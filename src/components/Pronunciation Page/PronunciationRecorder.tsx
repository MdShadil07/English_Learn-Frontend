import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Loader2, Mic, RefreshCcw, Square, UploadCloud, Volume2, Activity, Target, Info } from 'lucide-react';
import { WavyBackground } from './soloPractice';
import type { PronunciationRecordingPayload, RecorderUiState, RecordingValidationSummary } from '@/types/pronunciation';

interface PronunciationRecorderProps {
  disabled?: boolean;
  isBusy?: boolean;
  isPremium?: boolean;
  uploadProgress?: number;
  onSubmitRecording: (payload: PronunciationRecordingPayload, metadataOverrides?: any) => Promise<void>;
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
  isPremium = false,
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
  const persistentStreamRef = useRef<MediaStream | null>(null);
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
    let active = true;
    const initMic = async () => {
      try {
        if (navigator.mediaDevices?.getUserMedia) {
           const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
              channelCount: 1,
              sampleRate: 48000,
            },
          });
          if (active) {
            persistentStreamRef.current = stream;
          } else {
            stream.getTracks().forEach(t => t.stop());
          }
        }
      } catch (err) {
        console.warn('Pre-initializing mic failed:', err);
      }
    };
    initMic();

    return () => {
      active = false;
      if (persistentStreamRef.current) {
        persistentStreamRef.current.getTracks().forEach(t => t.stop());
        persistentStreamRef.current = null;
      }
    };
  }, []);

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
    // Do not stop the stream tracks here, as we reuse persistentStreamRef!
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

    let frameCount = 0;
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
      if (levelSamplesRef.current.length > 300) {
        levelSamplesRef.current.shift();
      }
      const sortedSamples = [...levelSamplesRef.current].sort((a, b) => a - b);
      const noiseFloor = sortedSamples[Math.max(0, Math.floor(sortedSamples.length * 0.2))] || 0;
      const speechPeak = sortedSamples[Math.max(0, Math.floor(sortedSamples.length * 0.85))] || rms;
      const computedSnr = 20 * Math.log10((speechPeak + 1e-4) / (noiseFloor + 1e-4));
      const qualityScore = clamp(
        100
          - ((silentFramesRef.current / totalFramesRef.current) * 35)
          - ((clippedFramesRef.current / totalFramesRef.current) * 30)
          - clamp(noiseFloor * 500, 0, 28)
          + clamp(computedSnr * 2.4, 0, 38)
          + clamp(rms * 220, 0, 16),
        0,
        100
      );

      frameCount += 1;
      // Only trigger React state updates every 6 frames (~10fps) to prevent UI freezing
      if (frameCount % 6 === 0) {
        setWaveformPeaks((current) => [...current.slice(-47), Math.max(0.05, localPeak)]);
        setPeakLevel((current) => Math.max(current, localPeak));
        setAverageLevel(levelSamplesRef.current.reduce((sum, value) => sum + value, 0) / levelSamplesRef.current.length);
        setSilenceRatio(silentFramesRef.current / totalFramesRef.current);
        setClippedSamplesRatio(clippedFramesRef.current / totalFramesRef.current);
        setBackgroundNoiseEstimate(noiseFloor);
        setSpeechToNoiseRatio(Number.isFinite(computedSnr) ? Math.max(0, computedSnr) : 0);
        setAudioQualityScore(Math.round(qualityScore));
      }

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
      let stream = persistentStreamRef.current;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            channelCount: 1,
            sampleRate: 48000,
          },
        });
        persistentStreamRef.current = stream;
      }

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

  const handleUpload = async (depth: 'fast' | 'deep' = 'fast') => {
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

    setUiState('processing');
    try {
      await onSubmitRecording(payload, { analysisDepth: depth });
    } catch (error) {
      console.error('Pronunciation upload failed:', error);
      setErrorMessage((error as Error).message || 'Upload failed. Please try again.');
      setUiState('review');
    }
  };

  const qualityLabel = getInputQuality(averageLevel, silenceRatio, clippedSamplesRatio);
  const isUploadBlocked = validationState ? !validationState.isValid : false;

  // Decorative Radial Ticks around the record button
  const TickMarks = ({ reverse = false }: { reverse?: boolean }) => (
    <div className={`hidden sm:flex items-center gap-1.5 md:gap-2 opacity-30 dark:opacity-50 ${reverse ? 'flex-row-reverse' : ''}`}>
      {[...Array(14)].map((_, i) => {
        const height = 4 + (i % 4) * 3;
        return (
          <div 
            key={i} 
            className="w-[2px] rounded-full bg-slate-400 dark:bg-slate-500 transition-all duration-300" 
            style={{ height: `${height}px` }} 
          />
        );
      })}
    </div>
  );

  // Dynamic Recording Waveform
  const AnimatedWaveform = ({ isRecording }: { isRecording: boolean }) => (
    <div className="flex items-center justify-center gap-[3px] sm:gap-1 h-12 md:h-16 w-full px-4">
      {[...Array(40)].map((_, i) => {
        const centerDist = Math.abs(20 - i);
        const baseHeight = Math.max(10, 100 - (centerDist * 4));
        const animateHeight = isRecording 
          ? [`${baseHeight * 0.2}%`, `${baseHeight}%`, `${baseHeight * 0.3}%`] 
          : `${baseHeight * 0.15}%`;
        
        return (
          <motion.div
            key={i}
            className={`w-1 rounded-full ${
              isRecording 
                ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' 
                : 'bg-slate-300 dark:bg-indigo-500/40'
            }`}
            animate={{ height: animateHeight }}
            transition={{ 
              duration: isRecording ? 0.3 + Math.random() * 0.3 : 0.5, 
              repeat: isRecording ? Infinity : 0, 
              ease: "easeInOut" 
            }}
          />
        );
      })}
    </div>
  );

  return (
    <div className="w-full relative flex flex-col items-center">
      
      {/* Mic Ready Indicator */}
      <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-5 py-2.5 rounded-full shadow-sm mb-6">
        <Mic className="w-4 h-4 text-slate-500 dark:text-slate-400" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {uiState === 'recording' ? 'Listening...' : uiState === 'uploading' ? `Uploading ${uploadProgress}%` : uiState === 'review' ? 'Review recording' : 'Mic ready when you are'}
        </span>
        <span className={`w-2.5 h-2.5 rounded-full ${uiState === 'recording' ? 'bg-red-500 animate-ping' : uiState === 'idle' ? 'bg-green-500' : 'bg-amber-500'}`}></span>
      </div>

      {/* Quality Metrics & Visualizer Box */}
      <div className="w-full max-w-4xl relative overflow-hidden rounded-3xl bg-slate-50 dark:bg-[#0c101c] border border-slate-200 dark:border-slate-800/80 py-6 md:py-8 flex flex-col items-center shadow-sm mb-8">
        <WavyBackground position="left" />
        <WavyBackground position="right" />
        
        <div className="relative z-10 w-full mb-6">
          <AnimatedWaveform isRecording={uiState === 'recording'} />
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-2 md:gap-4 px-4">
          {[
            { icon: Activity, label: "Mic Quality", value: qualityLabel.toUpperCase(), valColor: qualityLabel === 'poor' ? "text-rose-500 dark:text-rose-400" : "text-emerald-500 dark:text-emerald-400" },
            { icon: Target, label: "Quality Score", value: `${audioQualityScore} / 100` },
            { icon: Activity, label: "SNR", value: `${speechToNoiseRatio.toFixed(1)} DB`, valColor: "text-blue-500 dark:text-blue-400" },
            { icon: Volume2, label: "Silence", value: `${Math.round(silenceRatio * 100)}%` },
            { icon: AlertTriangle, label: "Clip Risk", value: `${Math.round(clippedSamplesRatio * 100)}%` },
          ].map((metric, i) => (
            <div key={i} className="flex items-center gap-2 bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/50 px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-sm">
              <metric.icon className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] md:text-[11px] font-bold text-slate-500 dark:text-slate-400">{metric.label}</span>
              <span className={`text-[10px] md:text-[11px] font-bold ${metric.valColor || 'text-slate-700 dark:text-slate-200'}`}>{metric.value}</span>
            </div>
          ))}
        </div>
      </div>

      {uiState === 'review' && previewUrl && (
        <div className="mb-6 w-full max-w-4xl rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60 z-20 relative">
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
                  </div>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-amber-800/90 dark:text-amber-100/90">
                    {isUploadBlocked ? 'This recording does not contain a reliable enough voice signal yet. Please retry with clearer speech.' : 'Your audio may still be analyzed. These tips can help improve accuracy.'}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/30 dark:bg-slate-950/30">
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

      {/* Main Record Action Area */}
      <div className="flex flex-col items-center mt-2 w-full">
        <div className="flex items-center justify-center gap-6 md:gap-12 w-full">
          <TickMarks />
          
          {/* Big Record Button */}
          <div className="relative flex items-center justify-center">
            {uiState === 'recording' && (
              <>
                <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping"></div>
                <div className="absolute inset-[-20px] rounded-full border border-purple-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              </>
            )}
            <button 
              onClick={uiState === 'recording' ? stopRecording : startRecording}
              disabled={disabled || isBusy || uiState === 'review' || uiState === 'uploading'}
              className={`relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 ${
                uiState === 'recording'
                  ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.5)]' 
                  : 'bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-700 dark:to-slate-800 text-white shadow-slate-900/20 border-4 border-indigo-500/30 dark:border-indigo-400/30'
              } ${disabled || isBusy || uiState === 'uploading' ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {uiState === 'recording' ? (
                 <div className="w-8 h-8 bg-white rounded-md animate-pulse"></div>
              ) : (
                 <Mic className="w-10 h-10 md:w-12 md:h-12 text-indigo-300 dark:text-indigo-400" />
              )}
            </button>
          </div>

          <TickMarks reverse />
        </div>

        <div className="text-center mt-8 space-y-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            {uiState === 'recording' ? 'Recording in progress...' : uiState === 'review' ? 'Review your recording' : uiState === 'uploading' ? 'Uploading...' : 'Tap to start recording and keep the mic on while you read'}
          </p>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <Info className="w-4 h-4" /> {uiState === 'recording' ? `Recording: ${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}` : 'Speak clearly, take your time, and enjoy the practice.'}
          </p>
        </div>
      </div>

      {uiState === 'review' && (
        <div className="mt-8 flex flex-col md:flex-row flex-wrap items-center justify-center gap-3 w-full">
          <button
            onClick={handleRetry}
            disabled={isBusy}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCcw className="h-4 w-4" />
            Retry
          </button>
          <button
            onClick={() => handleUpload('fast')}
            disabled={isBusy || isUploadBlocked}
            className="inline-flex items-center gap-2 rounded-full bg-slate-800 dark:bg-slate-700 px-5 py-3 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />
            {isUploadBlocked ? 'Retry Required' : 'Upload And Analyze'}
          </button>

          {isPremium ? (
            <button
              onClick={() => handleUpload('deep')}
              disabled={isBusy || isUploadBlocked}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-transform hover:-translate-y-0.5 hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-60 border border-white/20 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 hover:bg-transparent transition-colors"></div>
              <Activity className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{isUploadBlocked ? 'Retry Required' : 'In-Depth Analysis (Premium)'}</span>
            </button>
          ) : (
            <button
              disabled={true}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-5 py-3 text-sm font-bold text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700 relative overflow-hidden"
              title="Upgrade to Premium for Deep Analysis"
            >
              <Activity className="h-4 w-4 opacity-50" />
              <span>In-Depth Analysis (Premium Only)</span>
            </button>
          )}
        </div>
      )}

      {errorMessage && (
        <p className="mt-4 text-center text-sm font-medium text-rose-600 dark:text-rose-400">{errorMessage}</p>
      )}
    </div>
  );
}
