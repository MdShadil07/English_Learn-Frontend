import { API_BASE_URL, getAuthToken } from '@/utils/api';
import { pronunciationService } from '@/services/pronunciationService';
import { pronunciationUploadDb } from '@/utils/pronunciation/indexedDb';
import type {
  PendingPronunciationUpload,
  PronunciationRecordingPayload,
  PronunciationUploadSession,
} from '@/types/pronunciation';

const DEFAULT_CHUNK_SIZE_BYTES = 256 * 1024;
const MAX_UPLOAD_RETRIES = 3;

interface UploadCallbacks {
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

interface UploadResult {
  uploadId: string;
  audioUrl: string;
  objectKey: string;
}

const createLocalId = () =>
  `pronunciation-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const uploadChunkWithXhr = (
  uploadId: string,
  partIndex: number,
  chunk: Blob,
  signal?: AbortSignal
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('partIndex', String(partIndex));
    formData.append('chunk', chunk, `chunk-${partIndex}.webm`);

    xhr.open('POST', `${API_BASE_URL}/pronunciation/solo-practice/upload/session/${uploadId}/part`);

    const token = getAuthToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Chunk upload failed with status ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error while uploading chunk'));
    xhr.onabort = () => reject(new DOMException('Upload aborted', 'AbortError'));

    if (signal) {
      signal.addEventListener('abort', () => xhr.abort(), { once: true });
    }

    xhr.send(formData);
  });

const uploadBlobWithPresignedUrl = async (
  uploadUrl: string,
  blob: Blob,
  mimeType: string,
  signal?: AbortSignal
) => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
    },
    body: blob,
    signal,
  });

  if (!response.ok) {
    throw new Error(`Direct upload failed with status ${response.status}`);
  }
};

class PronunciationUploadService {
  async uploadRecording(
    sessionId: string,
    transcript: string,
    recording: PronunciationRecordingPayload,
    callbacks: UploadCallbacks = {}
  ): Promise<UploadResult> {
    const localId = createLocalId();
    const chunkSizeBytes = DEFAULT_CHUNK_SIZE_BYTES;
    const totalChunks = Math.max(1, Math.ceil(recording.blob.size / chunkSizeBytes));

    const pendingUpload: PendingPronunciationUpload = {
      localId,
      sessionId,
      transcript,
      blob: recording.blob,
      fileName: recording.fileName,
      mimeType: recording.mimeType,
      chunkSizeBytes,
      totalChunks,
      durationMs: recording.durationMs,
      waveformPeaks: recording.waveformPeaks,
      qualityMetrics: recording.qualityMetrics,
      validation: recording.validation,
      deviceMetadata: recording.deviceMetadata,
      networkMetadata: recording.networkMetadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await pronunciationUploadDb.put(pendingUpload);

    if (!navigator.onLine) {
      throw new Error('You are offline. Recording saved and will be available for retry.');
    }

    const sessionResponse = await pronunciationService.createUploadSession({
      sessionId,
      fileName: recording.fileName,
      mimeType: recording.mimeType,
      sizeBytes: recording.blob.size,
      durationMs: recording.durationMs,
      chunkSizeBytes,
      totalChunks,
      waveformPeaks: recording.waveformPeaks,
      qualityMetrics: recording.qualityMetrics,
      deviceMetadata: recording.deviceMetadata,
      networkMetadata: recording.networkMetadata,
      validation: recording.validation,
    });

    const uploadSession = sessionResponse.data as PronunciationUploadSession;
    pendingUpload.uploadSessionId = uploadSession._id;
    pendingUpload.updatedAt = Date.now();
    await pronunciationUploadDb.put(pendingUpload);

    if (uploadSession.uploadUrl && uploadSession.uploadMethod === 's3-presigned-put') {
      callbacks.onProgress?.(10);
      await uploadBlobWithPresignedUrl(uploadSession.uploadUrl, recording.blob, recording.mimeType, callbacks.signal);
      callbacks.onProgress?.(90);

      const completion = await pronunciationService.completeUpload(uploadSession._id);
      callbacks.onProgress?.(100);
      await pronunciationUploadDb.delete(localId);

      return {
        uploadId: uploadSession._id,
        audioUrl: completion.data.audioUrl,
        objectKey: completion.data.objectKey,
      };
    }

    const uploadedParts = new Set(uploadSession.uploadedParts || []);
    let completedBytes = uploadedParts.size * chunkSizeBytes;
    callbacks.onProgress?.(Math.min(99, Math.round((completedBytes / recording.blob.size) * 100)));

    for (let partIndex = 0; partIndex < totalChunks; partIndex += 1) {
      if (uploadedParts.has(partIndex)) {
        continue;
      }

      const start = partIndex * chunkSizeBytes;
      const end = Math.min(recording.blob.size, start + chunkSizeBytes);
      const chunk = recording.blob.slice(start, end, recording.mimeType);
      let lastError: Error | null = null;

      for (let attempt = 0; attempt < MAX_UPLOAD_RETRIES; attempt += 1) {
        try {
          await uploadChunkWithXhr(uploadSession._id, partIndex, chunk, callbacks.signal);
          uploadedParts.add(partIndex);
          completedBytes = Array.from(uploadedParts).length * chunkSizeBytes;
          callbacks.onProgress?.(Math.min(99, Math.round((Math.min(completedBytes, recording.blob.size) / recording.blob.size) * 100)));
          lastError = null;
          break;
        } catch (error) {
          lastError = error as Error;
          if ((error as Error).name === 'AbortError') {
            throw error;
          }
          if (!navigator.onLine) {
            throw new Error('Network lost during upload. Recording saved for retry.');
          }
          await new Promise((resolve) => window.setTimeout(resolve, 500 * (attempt + 1)));
        }
      }

      if (lastError) {
        throw lastError;
      }
    }

    const completion = await pronunciationService.completeUpload(uploadSession._id);
    callbacks.onProgress?.(100);
    await pronunciationUploadDb.delete(localId);

    return {
      uploadId: uploadSession._id,
      audioUrl: completion.data.audioUrl,
      objectKey: completion.data.objectKey,
    };
  }

  async cancelUpload(uploadId?: string, localId?: string) {
    if (uploadId) {
      await pronunciationService.cancelUpload(uploadId);
    }
    if (localId) {
      await pronunciationUploadDb.delete(localId);
    }
  }

  async listPendingUploads() {
    return pronunciationUploadDb.list();
  }
}

export const pronunciationUploadService = new PronunciationUploadService();
