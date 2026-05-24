import { api } from '@/utils/api';

export interface PronunciationSessionCreateInput {
  exerciseType?: string;
  cefrLevel?: string;
  phonemeTargets?: string[];
  mtiTargets?: string[];
}

export interface PronunciationAttemptSubmission {
  audioUrl: string;
  audioObjectKey?: string;
  audioMimeType?: string;
  uploadSessionId?: string;
  transcript: string;
  attemptNumber: number;
  metadata?: Record<string, unknown>;
}

export interface PronunciationUploadSessionCreateInput {
  sessionId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationMs: number;
  chunkSizeBytes: number;
  totalChunks: number;
  waveformPeaks?: number[];
  qualityMetrics?: Record<string, unknown>;
  deviceMetadata?: Record<string, unknown>;
  networkMetadata?: Record<string, unknown>;
  validation?: Record<string, unknown>;
}

export const pronunciationService = {
  createSession: (data?: PronunciationSessionCreateInput) =>
    api.pronunciation.createSession(data || {}),

  getSession: (sessionId: string) =>
    api.pronunciation.getSession(sessionId),

  createUploadSession: (data: PronunciationUploadSessionCreateInput) =>
    api.pronunciation.createUploadSession(data),

  getUploadSession: (uploadId: string) =>
    api.pronunciation.getUploadSession(uploadId),

  completeUpload: (uploadId: string) =>
    api.pronunciation.completeUpload(uploadId),

  cancelUpload: (uploadId: string) =>
    api.pronunciation.cancelUpload(uploadId),

  submitAttempt: (sessionId: string, payload: PronunciationAttemptSubmission) =>
    api.pronunciation.submitAttempt(sessionId, payload),

  getAttempt: (sessionId: string, attemptId: string) =>
    api.pronunciation.getAttempt(sessionId, attemptId),

  recommendPassage: (data?: PronunciationSessionCreateInput) =>
    api.pronunciation.recommendPassage(data || {}),
};
