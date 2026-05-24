import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Mic, RefreshCcw, Square, UploadCloud, Volume2 } from 'lucide-react';
import type { PronunciationRecordingPayload, RecorderUiState, RecordingValidationSummary } from '@/types/pronunciation';

interface PronunciationRecorderProps {
  disabled?: boolean;
  isBusy?: boolean;
  uploadProgress?: number;
  onSubmitRecording: (payload: PronunciationRecordingPayload) => Promise<void>;
  onStateChange?: (state: RecorderUiState) => void;
}

type QualityLevel = 'poor' | 'fair' | 'good';

const selectSupportedMimeType = () => {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
  ];

  for (const candidate of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(candidate)) {
      return candidate;
    }
  }

  return '';
};

const getInputQuality = (averageLevel: number, silenceRatio: number, clippedSamplesRatio: number): QualityLevel => {
  if (averageLevel > 0.08 && silenceRatio < 0.45 && clippedSamplesRatio < 0.03) {
    return 'good';
  }
  if (averageLevel > 0.03 && silenceRatio < 0.7 && clippedSamplesRatio < 0.08) {
    return 'fair';
  }
  return 'poor';
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function PronunciationRecorder({
  disabled = false,
  isBusy = false,
  uploadProgress = 0,
  onSubmitRecording,
  onStateChange,
}: PronunciationRecorderProps) {
  const [uiState, setUiState] = useState<RecorderUiState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const [waveformPeaks, setWaveformPeaks] = useState<number[]>([]);
  const [averageLevel, setAverageLevel] = useState(0);
  const [peakLevel, setPeakLevel] = useState(0);
  const [silenceRatio, setSilenceRatio] = useState(0);
  const [clippedSamplesRatio, setClippedSamplesRatio] = useState(0);
  const [backgroundNoiseEstimate, setBackgroundNoiseEstimate] = useState(0);
  const [speechToNoiseRatio, setSpeechToNoiseRatio] = useState(0);
  const [audioQualityScore, setAudioQualityScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [validationState, setValidationState] = useState<RecordingValidationSummary | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const levelSamplesRef = useRef<number[]>([]);
  const silentFramesRef = useRef(0);
  const clippedFramesRef = useRef(0);
  const totalFramesRef = useRef(0);
  const secondsRef = useRef(0);

  useEffect(() => {
    onStateChange?.(uiState);
  }, [onStateChange, uiState]);

  useEffect(() => {
    secondsRef.current = seconds;
  }, [seconds]);

  useEffect(() => () => {
    cleanupAudioGraph();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const waveformBars = useMemo(() => {
    const bars = waveformPeaks.slice(-32);
    if (!bars.length) {
      return new Array(24).fill(0.08);
    }
    return bars;
  }, [waveformPeaks]);

  const resetPreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setRecordingBlob(null);
    setWarnings([]);
    setWaveformPeaks([]);
    setAverageLevel(0);
    setPeakLevel(0);
    setSilenceRatio(0);
    setClippedSamplesRatio(0);
    setBackgroundNoiseEstimate(0);
    setSpeechToNoiseRatio(0);
    setAudioQualityScore(0);
    setSeconds(0);
    secondsRef.current = 0;
    setErrorMessage('');
    setValidationState(null);
  };

  const cleanupAudioGraph = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    sourceNodeRef.current?.disconnect();
    analyserRef.current?.disconnect();
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => undefined);
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    sourceNodeRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const startMetering = async (stream: MediaStream) => {
    const audioContext = new window.AudioContext();
    await audioContext.resume();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceNodeRef.current = source;
    levelSamplesRef.current = [];
    silentFramesRef.current = 0;
    clippedFramesRef.current = 0;
    totalFramesRef.current = 0;

    const data = new Uint8Array(analyser.frequencyBinCount);

    const tick = () => {
      if (!analyserRef.current) {
        return;
      }

      analyserRef.current.getByteTimeDomainData(data);
      let sumSquares = 0;
      let localPeak = 0;
      let clipped = false;

      for (let i = 0; i < data.length; i += 1) {
        const centered = (data[i] - 128) / 128;
        sumSquares += centered * centered;
        localPeak = Math.max(localPeak, Math.abs(centered));
        if (Math.abs(centered) > 0.98) {
          clipped = true;
        }
      }

      const rms = Math.sqrt(sumSquares / data.length);
      totalFramesRef.current += 1;
      if (rms < 0.018) {
        silentFramesRef.current += 1;
      }
      if (clipped) {
        clippedFramesRef.current += 1;
      }

      levelSamplesRef.current.push(rms);
      const sortedSamples = [...levelSamplesRef.current].sort((a, b) => a - b);
      const noiseFloor = sortedSamples[Math.max(0, Math.floor(sortedSamples.length * 0.2))] || 0;
      const speechPeak = sortedSamples[Math.max(0, Math.floor(sortedSamples.length * 0.85))] || rms;
      const computedSnr = 20 * Math.log10((speechPeak + 1e-4) / (noiseFloor + 1e-4));
      const qualityScore = clamp(
        100
          - (silenceRatio * 35)
          - (clippedSamplesRatio * 30)
          - clamp(noiseFloor * 500, 0, 28)
          + clamp(computedSnr * 2.4, 0, 38)
          + clamp(rms * 220, 0, 16),
        0,
        100
      );
      setWaveformPeaks((current) => [...current.slice(-47), Math.max(0.05, localPeak)]);
      setPeakLevel((current) => Math.max(current, localPeak));
      setAverageLevel(levelSamplesRef.current.reduce((sum, value) => sum + value, 0) / levelSamplesRef.current.length);
      setSilenceRatio(silentFramesRef.current / totalFramesRef.current);
      setClippedSamplesRatio(clippedFramesRef.current / totalFramesRef.current);
      setBackgroundNoiseEstimate(noiseFloor);
      setSpeechToNoiseRatio(Number.isFinite(computedSnr) ? Math.max(0, computedSnr) : 0);
      setAudioQualityScore(Math.round(qualityScore));

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
  };

  const analyzeValidation = (blobOverride?: Blob | null) => {
    const candidateBlob = blobOverride ?? recordingBlob;
    const currentWarnings: string[] = [];
    const blockingIssues: string[] = [];
    const durationSeconds = secondsRef.current;

    if (!candidateBlob) {
      blockingIssues.push('No recording found.');
    }

    if (silenceRatio > 0.94) {
      currentWarnings.push('Too much silence was detected. Move closer to the mic and try again.');
    }

    if (averageLevel < 0.012) {
      currentWarnings.push('Mic input is very low. Speak slightly louder or move closer to the phone.');
    }

    if (backgroundNoiseEstimate > 0.08 || speechToNoiseRatio < 3) {
      currentWarnings.push('We detected high background noise. Your pronunciation score may be inaccurate.');
    }

    if (clippedSamplesRatio > 0.15) {
      currentWarnings.push('The mic clipped a lot. Move a little farther from the microphone.');
    }

    if (audioQualityScore < 30) {
      currentWarnings.push('Audio quality is below ideal. Results may be less accurate than usual.');
    }

    return {
      isValid: blockingIssues.length === 0,
      warnings: [...blockingIssues, ...currentWarnings],
      blockingIssues,
      silenceRatio,
      clippedSamplesRatio,
      averageLevel,
      backgroundNoiseEstimate,
      speechToNoiseRatio,
      audioQualityScore,
    };
  };

  const applyValidationPreview = (blobOverride?: Blob | null) => {
    const validation = analyzeValidation(blobOverride);
    setWarnings(validation.warnings);
    setValidationState({
      isValid: validation.isValid,
      warnings: validation.warnings,
      silenceRatio: validation.silenceRatio,
      clippedSamplesRatio: validation.clippedSamplesRatio,
      averageLevel: validation.averageLevel,
      backgroundNoiseEstimate: validation.backgroundNoiseEstimate,
      speechToNoiseRatio: validation.speechToNoiseRatio,
      audioQualityScore: validation.audioQualityScore,
    });
    return validation;
  };

  const startRecording = async () => {
    resetPreview();
    setErrorMessage('');

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Microphone access is not supported on this device.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 48000,
        },
      });

      const mimeType = selectSupportedMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      chunksRef.current = [];
      mediaRecorderRef.current = recorder;
      mediaStreamRef.current = stream;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordingBlob(blob);
        setPreviewUrl(url);
        applyValidationPreview(blob);
        setUiState('review');
        cleanupAudioGraph();
      };

      recorder.start(300);
      await startMetering(stream);
      setUiState('recording');
      timerRef.current = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    } catch (error) {
      console.error('Pronunciation recorder start failed:', error);
      setErrorMessage('Microphone access failed. Please allow audio access and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRetry = () => {
    if (isBusy) {
      return;
    }
    resetPreview();
    setUiState('idle');
  };

  const handleUpload = async () => {
    if (!recordingBlob) {
      return;
    }

    const validation = applyValidationPreview(recordingBlob);
    if (!validation.isValid) {
      return;
    }

    const inputQuality = getInputQuality(averageLevel, silenceRatio, clippedSamplesRatio);
    const payload: PronunciationRecordingPayload = {
      blob: recordingBlob,
      fileName: `solo-practice-${Date.now()}.webm`,
      mimeType: recordingBlob.type || 'audio/webm',
      durationMs: seconds * 1000,
      waveformPeaks: waveformPeaks.slice(-48),
      validation,
      qualityMetrics: {
        averageLevel,
        peakLevel,
        clippedSamplesRatio,
        silenceRatio,
        backgroundNoiseEstimate,
        speechToNoiseRatio,
        audioQualityScore,
        inputQuality,
        warnings: validation.warnings,
      },
      deviceMetadata: {
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        maxTouchPoints: navigator.maxTouchPoints || 0,
      },
      networkMetadata: {
        online: navigator.onLine,
      },
    };

    setUiState('uploading');
    try {
      await onSubmitRecording(payload);
    } catch (error) {
      console.error('Pronunciation upload failed:', error);
      setErrorMessage((error as Error).message || 'Upload failed. Please try again.');
      setUiState('review');
    }
  };

  const qualityLabel = getInputQuality(averageLevel, silenceRatio, clippedSamplesRatio);
  const isUploadBlocked = validationState ? !validationState.isValid : false;

  return (
    <div className="w-full relative flex flex-col items-center">
      <div className="min-h-10 mb-4 flex items-center justify-center">
        {uiState === 'recording' && (
          <div className="flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-rose-600 shadow-sm dark:border-rose-800/50 dark:bg-rose-900/20 dark:text-rose-400">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest">{`${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`}</span>
          </div>
        )}
        {uiState === 'uploading' && (
          <div className="flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-teal-600 dark:border-teal-800/50 dark:bg-teal-900/20 dark:text-teal-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-widest">{uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Upload complete'}</span>
          </div>
        )}
        {uiState === 'idle' && (
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-slate-500 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300">
            <Mic className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest">Mic ready when you are</span>
          </div>
        )}
        {uiState === 'review' && (
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-amber-700 shadow-sm dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-300">
            <Volume2 className="h-3.5 w-3.5" />
            <span className="text-xs font-bold uppercase tracking-widest">Review before upload</span>
          </div>
        )}
      </div>

      <div className="mb-8 w-full rounded-[2rem] border border-slate-200/70 bg-slate-50/80 px-5 py-6 shadow-inner dark:border-slate-800/60 dark:bg-slate-900/50">
        <div className="flex h-24 items-end justify-center gap-1">
          {waveformBars.map((bar, index) => (
            <motion.div
              key={`${index}-${bar}`}
              animate={{ height: `${Math.max(12, bar * 100)}%` }}
              transition={{ duration: 0.18 }}
              className={`w-2 rounded-full ${
                uiState === 'recording'
                  ? 'bg-emerald-500'
                  : uiState === 'uploading'
                  ? 'bg-teal-500'
                  : 'bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800">Mic quality: {qualityLabel}</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800">Quality score: {audioQualityScore}/100</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800">SNR: {speechToNoiseRatio.toFixed(1)} dB</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800">Silence: {Math.round(silenceRatio * 100)}%</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-sm dark:bg-slate-800">Clip risk: {Math.round(clippedSamplesRatio * 100)}%</span>
        </div>
      </div>

      {uiState === 'review' && previewUrl && (
        <div className="mb-6 w-full rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60">
          <audio controls className="w-full" src={previewUrl} />
          {!!warnings.length && (
            <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 text-left shadow-sm dark:border-amber-800/50 dark:bg-[linear-gradient(135deg,rgba(120,53,15,0.22),rgba(15,23,42,0.8))]">
              <div className="mb-3 flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <span className="text-sm font-extrabold">{isUploadBlocked ? 'Recording needs a retry' : 'Recording warnings'}</span>
                    <span className="rounded-full border border-amber-200 bg-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:border-amber-700/60 dark:bg-slate-900/50 dark:text-amber-300">
                      {isUploadBlocked ? 'Upload blocked' : 'Upload can continue'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-amber-800/90 dark:text-amber-100/90">
                    {isUploadBlocked
                      ? 'This recording does not contain a reliable enough voice signal yet. Please retry with clearer speech or a closer microphone position.'
                      : 'Your audio may still be analyzed. These tips can help improve pronunciation accuracy on the next try, especially on low-volume mobile recordings.'}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/30 dark:bg-slate-950/30">
                <div className="mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <span className="text-xs font-extrabold uppercase tracking-widest">What we noticed</span>
                </div>
                <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-200">
                  {warnings.map((warning) => (
                    <li key={warning} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500"></span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-center relative">
        {uiState === 'recording' && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.3)_0%,transparent_70%)] animate-pulse"></div>
        )}
        <button
          onClick={uiState === 'recording' ? stopRecording : startRecording}
          disabled={disabled || isBusy || uiState === 'review' || uiState === 'uploading'}
          className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-2xl transition-all duration-300 ${
            uiState === 'recording'
              ? 'scale-110 bg-rose-500 shadow-rose-500/30'
              : 'bg-slate-900 hover:scale-105 hover:shadow-slate-900/20 dark:bg-white dark:text-slate-900'
          } ${disabled || isBusy || uiState === 'review' || uiState === 'uploading' ? 'cursor-not-allowed opacity-60' : ''}`}
        >
          {uiState === 'recording' ? <Square className="h-8 w-8 fill-current" /> : <Mic className="h-9 w-9" />}
        </button>
      </div>

      <p className="mt-6 h-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 md:text-xs">
        {uiState === 'idle' && 'Tap to start recording and keep the mic on while you read'}
        {uiState === 'recording' && 'Mic is live. Tap again only after you finish the full passage'}
        {uiState === 'review' && 'Retry if needed, then upload for backend pronunciation analysis'}
        {uiState === 'uploading' && 'Uploading audio in background-safe chunks'}
      </p>

      {uiState === 'review' && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
          <button
            onClick={handleUpload}
            disabled={isBusy || isUploadBlocked}
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-teal-500/20 transition-transform hover:-translate-y-0.5 hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            {isUploadBlocked ? 'Retry Required' : 'Upload And Analyze'}
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-center text-sm font-medium text-rose-600 dark:text-rose-400">{errorMessage}</p>
      )}
    </div>
  );
}
