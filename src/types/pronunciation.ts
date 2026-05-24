export type RecorderUiState = 'idle' | 'recording' | 'review' | 'uploading';

export interface RecordingValidationSummary {
  isValid: boolean;
  warnings: string[];
  silenceRatio: number;
  clippedSamplesRatio: number;
  averageLevel: number;
  backgroundNoiseEstimate: number;
  speechToNoiseRatio: number;
  audioQualityScore: number;
}

export interface RecordingQualityMetrics {
  averageLevel: number;
  peakLevel: number;
  clippedSamplesRatio: number;
  silenceRatio: number;
  backgroundNoiseEstimate: number;
  speechToNoiseRatio: number;
  audioQualityScore: number;
  inputQuality: 'poor' | 'fair' | 'good';
  warnings: string[];
}

export interface PronunciationRecordingPayload {
  blob: Blob;
  fileName: string;
  mimeType: string;
  durationMs: number;
  waveformPeaks: number[];
  validation: RecordingValidationSummary;
  qualityMetrics: RecordingQualityMetrics;
  deviceMetadata: Record<string, unknown>;
  networkMetadata: Record<string, unknown>;
}

export interface PronunciationUploadSession {
  _id: string;
  practiceSessionId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  durationMs?: number;
  chunkSizeBytes: number;
  totalChunks: number;
  uploadedParts: number[];
  uploadedBytes: number;
  status: 'initiated' | 'uploading' | 'assembled' | 'queued' | 'completed' | 'cancelled' | 'failed' | 'retry_required' | 'preprocessing' | 'transcribing' | 'aligning' | 'analyzing';
  finalObjectKey?: string | null;
  finalAudioUrl?: string | null;
  uploadUrl?: string | null;
  uploadMethod?: 's3-presigned-put' | 'legacy-chunk-upload';
}

export interface PendingPronunciationUpload {
  localId: string;
  sessionId: string;
  transcript: string;
  uploadSessionId?: string;
  blob: Blob;
  fileName: string;
  mimeType: string;
  chunkSizeBytes: number;
  totalChunks: number;
  durationMs: number;
  waveformPeaks: number[];
  qualityMetrics: RecordingQualityMetrics;
  validation: RecordingValidationSummary;
  deviceMetadata: Record<string, unknown>;
  networkMetadata: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
}
