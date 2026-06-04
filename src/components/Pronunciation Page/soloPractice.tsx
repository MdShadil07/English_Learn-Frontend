import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, X, ChevronRight, Play, RotateCcw, Mic,
  Sparkles, Headphones, ArrowRight, Volume2, AlertTriangle,
  BarChart3, Activity, Target, Volume1, Info, Gauge, Trophy
} from 'lucide-react';
import { pronunciationService } from '../../services/pronunciationService';
import { pronunciationUploadService } from '../../services/pronunciationUploadService';
import PronunciationRecorder from './PronunciationRecorder';

const defaultPassageText = 'The architect designed a beautiful structure for the museum.';
const fallbackPassage = {
  text: defaultPassageText,
  exerciseType: 'Reading Exercise',
  cefrLevel: 'B1 Level',
  phonemeTargets: ['CH', 'SH'],
  mtiTargets: ['clarity'],
  metadata: { readingHints: ["Focus on clearly pronouncing the 'ch' sound in architect."] },
};

const getAnalysisTip = (analysis: any) => {
  if (!analysis) return 'Listen carefully to the target pronunciation and repeat with confidence.';
  const alignedWord = String(analysis.alignedWord || '').trim();
  const targetWord = String(analysis.word || '').trim();
  if (!alignedWord && (analysis.issueType === 'omission' || analysis.score === 0)) return `The target word "${targetWord}" was likely omitted. Slow down and pronounce the full word clearly.`;
  if (alignedWord && targetWord && alignedWord.toLowerCase() !== targetWord.toLowerCase()) return `You said "${alignedWord}" instead of "${targetWord}". Focus on consonant sequence and vowel quality.`;
  const issue = analysis.issueType || 'pronunciation';
  if (issue === 'clarity') return `Use a clearer mouth shape for "${analysis.word}" and keep the consonants crisp.`;
  if (issue === 'stress') return `Shift the stress pattern on "${analysis.word}" to match natural English rhythm.`;
  if (issue === 'intonation') return `Raise or lower your pitch on "${analysis.word}" to reflect natural speech melody.`;
  return `Try producing the expected phonemes more accurately for "${analysis.word}".`;
};

// Background Wave Graphic for Boxes
export const WavyBackground = ({ position = "left" }: { position?: "left" | "right" }) => (
  <svg 
    className={`absolute top-0 ${position === "left" ? "left-0" : "right-0"} w-[60%] md:w-1/2 h-full opacity-30 dark:opacity-40 pointer-events-none`} 
    preserveAspectRatio="none" 
    viewBox="0 0 500 200"
  >
    <path 
      d={position === "left" ? "M0,200 C150,150 250,50 500,200 L0,200 Z" : "M500,200 C350,150 250,50 0,200 L500,200 Z"} 
      fill="url(#wave-grad)" 
    />
    <defs>
      <linearGradient id="wave-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
      </linearGradient>
    </defs>
  </svg>
);


// --- CUSTOM SVG RADAR CHART ---
const RadarChart = ({ data }) => {
  const size = 200;
  const center = size / 2;
  const radius = 70;

  // Generate grid polygons
  const levels = 5;
  const gridPolygons = Array.from({ length: levels }).map((_, levelIndex) => {
    const levelRadius = radius * ((levelIndex + 1) / levels);
    const points = data.map((_, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / data.length;
      return `${center + levelRadius * Math.cos(angle)},${center + levelRadius * Math.sin(angle)}`;
    }).join(' ');
    return <polygon key={levelIndex} points={points} fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />;
  });

  // Generate data polygon
  const dataPoints = data.map((d, i) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * i) / data.length;
    const valRadius = radius * (d.value / 100);
    return `${center + valRadius * Math.cos(angle)},${center + valRadius * Math.sin(angle)}`;
  }).join(' ');

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {gridPolygons}
        {/* Axes lines */}
        {data.map((_, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / data.length;
          return (
            <line key={`axis-${i}`} x1={center} y1={center} x2={center + radius * Math.cos(angle)} y2={center + radius * Math.sin(angle)} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1" />
          );
        })}
        {/* Data Area */}
        <polygon points={dataPoints} fill="url(#radarGradient)" stroke="#8b5cf6" strokeWidth="2" fillOpacity="0.6" className="drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
        <defs>
          <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        {/* Labels */}
        {data.map((d, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / data.length;
          const labelRadius = radius + 25;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);
          return (
            <g key={`label-${i}`} transform={`translate(${x}, ${y})`}>
              <text textAnchor="middle" dy="-5" className="text-[10px] font-semibold fill-slate-500 dark:fill-slate-400">{d.label}</text>
              <text textAnchor="middle" dy="8" className="text-[11px] font-bold fill-slate-800 dark:fill-white">{d.value}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// --- MINI WAVEFORM COMPONENT ---
const MiniWaveform = ({ colorClass = "bg-teal-500", count = 20, animate = true }) => (
  <div className="flex items-end justify-center gap-1 h-8 w-full overflow-hidden">
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-1 rounded-t-sm ${colorClass}`}
        initial={{ height: '10%' }}
        animate={{ height: animate ? [`${10 + Math.random() * 40}%`, `${40 + Math.random() * 60}%`, `${10 + Math.random() * 40}%`] : `${20 + Math.random() * 60}%` }}
        transition={{ duration: 0.8 + Math.random() * 0.5, repeat: animate ? Infinity : 0, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// --- LARGE COMPARISON WAVEFORMS ---
const ComparisonWaveform = ({ isTarget }) => (
  <div className="flex items-center gap-1 h-12 w-full justify-center">
    {[...Array(30)].map((_, i) => {
      // Create a nice bell-curve like waveform shape
      const centerDist = Math.abs(15 - i);
      const baseHeight = 100 - (centerDist * 5);
      const height = Math.max(10, baseHeight * (0.5 + Math.random() * 0.5));
      return (
        <div
          key={i}
          className={`w-1 rounded-full ${isTarget ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.6)]' : 'bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.6)]'}`}
          style={{ height: `${height}%` }}
        />
      );
    })}
  </div>
);


// --- MAIN DONUT GAUGE ---
const DonutGauge = ({ score }) => {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex flex-col items-center justify-center mx-auto my-4">
      <div className="absolute top-2 right-0 bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
        ↑ 14%
      </div>
      <svg className="transform -rotate-90 w-full h-full drop-shadow-xl" viewBox="0 0 160 160">
        {/* Inner track */}
        <circle cx="80" cy="80" r={radius - 12} stroke="currentColor" strokeWidth="2" fill="transparent" className="text-slate-200 dark:text-slate-800/50" />
        {/* Outer track */}
        <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
        {/* Colored Progress */}
        <motion.circle
          cx="80" cy="80" r={radius} stroke="url(#donutGradient)" strokeWidth="12" fill="transparent"
          strokeDasharray={circumference} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut" }}
          className="drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]"
        />
        <defs>
          <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center top-4">
        <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tighter">{score}%</span>
        <span className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1">
          Great Job! <span>🎉</span>
        </span>
      </div>
    </div>
  );
};

// --- ARTICULATION MOUTH COMPONENT ---
const ArticulationMouth = () => (
  <div className="w-24 h-24 relative flex items-center justify-center">
    {/* Stylized Lips SVG */}
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_4px_10px_rgba(244,63,94,0.4)]">
      {/* Outer Glow */}
      <path d="M10,50 Q50,20 90,50 Q50,80 10,50 Z" fill="#f43f5e" opacity="0.15" filter="blur(4px)" />
      {/* Top Lip */}
      <path d="M15,50 Q30,35 50,40 Q70,35 85,50 Q50,45 15,50 Z" fill="url(#lipGradient)" />
      {/* Bottom Lip */}
      <path d="M15,50 Q50,55 85,50 Q70,75 50,75 Q30,75 15,50 Z" fill="url(#lipGradient)" />
      {/* Teeth (Simple blocks) */}
      <path d="M30,48 L70,48 L65,52 L35,52 Z" fill="#ffffff" opacity="0.9" />
      <path d="M35,55 L65,55 L60,52 L40,52 Z" fill="#e2e8f0" opacity="0.8" />
      <defs>
        <linearGradient id="lipGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff4b2b" />
          <stop offset="100%" stopColor="#ff416c" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

// --- HUMAN HEAD SILHOUETTE SVG ---
const HumanSilhouette = () => (
  <svg viewBox="0 0 200 250" className="absolute right-0 bottom-0 h-[120%] opacity-20 dark:opacity-[0.15] pointer-events-none translate-y-4" style={{ zIndex: 0 }}>
    <defs>
      <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f43f5e" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <path d="M180,0 C120,0 70,40 60,90 C50,130 60,150 50,170 C40,190 30,200 30,210 C30,220 50,220 60,215 C70,210 75,200 80,190 C85,180 90,175 100,180 C110,185 115,200 120,220 C125,240 140,250 180,250 L200,250 L200,0 Z" fill="url(#headGradient)" filter="blur(2px)" />
  </svg>
);


export default function App({ isOpen = true, onClose = () => { } }) {

  const [sessionState, setSessionState] = useState('idle');
  const [activeWord, setActiveWord] = useState<any>(null);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [passage, setPassage] = useState<any>(fallbackPassage);
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [userAudioBlobUrl, setUserAudioBlobUrl] = useState<string | null>(null);
  const [playingMistakeIndex, setPlayingMistakeIndex] = useState<number | null>(null);

  const pollIntervalRef = useRef<number | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const playbackTimeoutRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  const cleanupSession = useCallback(() => {
    if (pollIntervalRef.current) { window.clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
    if (pollTimeoutRef.current) { window.clearTimeout(pollTimeoutRef.current); pollTimeoutRef.current = null; }
    if (playbackTimeoutRef.current) { window.clearTimeout(playbackTimeoutRef.current); playbackTimeoutRef.current = null; }
    if (audioPlayerRef.current) { audioPlayerRef.current.pause(); audioPlayerRef.current.src = ''; audioPlayerRef.current = null; }
    if (userAudioBlobUrl) { URL.revokeObjectURL(userAudioBlobUrl); setUserAudioBlobUrl(null); }
    setPlayingMistakeIndex(null);
    setSessionInfo(null);
    setPassage(fallbackPassage);
    setAttemptResult(null);
    setErrorMessage('');
    setIsSessionLoading(false);
    setIsSubmittingAttempt(false);
    setUploadProgress(0);
    setSessionState('idle');
    setActiveWord(null);
    setAnalysisStepIndex(0);
  }, [userAudioBlobUrl]);

  const initializeSession = useCallback(async () => {
    setErrorMessage('');
    setIsSessionLoading(true);
    try {
      const response = await pronunciationService.createSession({ exerciseType: 'passage' });
      const data = response?.data;
      if (data?.session && data?.passage) {
        setSessionInfo(data.session);
        setPassage(data.passage);
      } else {
        setPassage(fallbackPassage);
      }
    } catch (error) {
      console.error('Pronunciation session initialization failed:', error);
      setErrorMessage('Could not load practice passage. Please try again later.');
      setPassage(fallbackPassage);
    } finally {
      setIsSessionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && !hasInitializedRef.current) {
      initializeSession();
      hasInitializedRef.current = true;
    }
  }, [isOpen, initializeSession]);

  const submitPracticeAttempt = async (recording: any) => {
    const sessionId = sessionInfo?._id || sessionInfo?.id;
    if (!sessionId) {
      setErrorMessage('Unable to submit attempt without an active practice session.');
      setSessionState('idle');
      return;
    }
    
    // Create a local blob URL for instant playback of the exact recorded audio
    if (recording?.blob) {
      if (userAudioBlobUrl) URL.revokeObjectURL(userAudioBlobUrl);
      setUserAudioBlobUrl(URL.createObjectURL(recording.blob));
    }

    setIsSubmittingAttempt(true);
    setErrorMessage('');

    try {
      const transcriptText = passage?.text || defaultPassageText;
      const uploadResult = await pronunciationUploadService.uploadRecording(sessionId, transcriptText, recording, {
        onProgress: setUploadProgress,
      });
      const response = await pronunciationService.submitAttempt(sessionId, {
        audioUrl: uploadResult.audioUrl,
        audioObjectKey: uploadResult.objectKey,
        audioMimeType: recording.mimeType,
        uploadSessionId: uploadResult.uploadId,
        transcript: transcriptText,
        attemptNumber: 1,
        metadata: {
          passageId: sessionInfo.passageId,
          waveformPeaks: recording.waveformPeaks,
          recordingValidation: recording.validation,
          qualityMetrics: recording.qualityMetrics,
          deviceMetadata: recording.deviceMetadata,
          networkMetadata: recording.networkMetadata,
        },
      });
      const attempt = response?.data;
      setAttemptResult(attempt);
      const pollSessionId = sessionInfo?._id || sessionInfo?.id;
      if (attempt?._id && pollSessionId) {
        pollAttemptStatus(pollSessionId, attempt._id);
      } else {
        setTimeout(() => setSessionState('results'), 1500);
      }
    } catch (error: any) {
      console.error('Submit attempt error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit your recording for analysis.');
      setSessionState('idle');
    } finally {
      setIsSubmittingAttempt(false);
      setUploadProgress(0);
    }
  };

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) { window.clearInterval(pollIntervalRef.current); pollIntervalRef.current = null; }
    if (pollTimeoutRef.current) { window.clearTimeout(pollTimeoutRef.current); pollTimeoutRef.current = null; }
  }, []);

  const isTerminalAttemptState = (attempt: any) => {
    if (!attempt) return false;
    const terminal = ['completed', 'failed', 'retry_required', 'cancelled'];
    return terminal.includes(attempt.status || '') ||
      terminal.includes(attempt.workflowState || '') ||
      terminal.includes(attempt.processingStage || '');
  };

  const pollAttemptStatus = (sessionId: string, attemptId: string) => {
    stopPolling();
    pollTimeoutRef.current = window.setTimeout(() => {
      stopPolling();
      setErrorMessage('Analysis is taking longer than expected. Please refresh and try again.');
      setSessionState('idle');
    }, 3 * 60 * 1000);

    pollIntervalRef.current = window.setInterval(async () => {
      try {
        const response = await pronunciationService.getAttempt(sessionId, attemptId);
        const attempt = response?.data;
        if (attempt) {
          setAttemptResult(attempt);
          
          const stages = ['uploaded', 'transcribing', 'scoring', 'analyzing', 'coaching'];
          const currentStage = attempt.processingStage || attempt.workflowState || 'uploaded';
          setAnalysisStepIndex(Math.max(0, stages.indexOf(currentStage)));

          if (isTerminalAttemptState(attempt)) {
            setSessionState('results');
            stopPolling();
          }
        }
      } catch (error) {
        console.error('Polling attempt status failed:', error);
      }
    }, 2200);
  };

  const [animStep, setAnimStep] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep(prev => (prev + 1) % 15);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    stopPolling();
    cleanupSession();
    hasInitializedRef.current = false;
    if (onClose) onClose();
  };

  const handleRetryExercise = async () => {
    setAttemptResult(null);
    setActiveWord(null);
    setErrorMessage('');
    setUploadProgress(0);
    setSessionState('idle');
  };

  const handleNextExercise = async () => {
    setAttemptResult(null);
    setActiveWord(null);
    setErrorMessage('');
    setUploadProgress(0);
    setSessionState('idle');
    hasInitializedRef.current = false;
    await initializeSession();
  };


  const handlePlayNativeAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(passage?.text || defaultPassageText);
      const voices = window.speechSynthesis.getVoices();
      const nativeVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) || voices.find(v => v.lang === 'en-US');
      if (nativeVoice) utterance.voice = nativeVoice;
      utterance.lang = 'en-US';
      utterance.rate = 0.7; // slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayTargetAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window && activeWord) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(activeWord.word);
      const voices = window.speechSynthesis.getVoices();
      const nativeVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) || voices.find(v => v.lang === 'en-US');
      if (nativeVoice) utterance.voice = nativeVoice;
      utterance.lang = 'en-US';
      utterance.rate = 0.7;
      utterance.pitch = 1.0;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayMistakeAudio = (mistake: any, idx: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    
    // Stop any existing playback
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.src = '';
    }
    if (playbackTimeoutRef.current) {
      window.clearTimeout(playbackTimeoutRef.current);
      playbackTimeoutRef.current = null;
    }

    if (playingMistakeIndex === idx) {
      setPlayingMistakeIndex(null);
      return;
    }

    const sourceUrl = userAudioBlobUrl || attemptResult?.audioUrl;
    
    if (sourceUrl) {
      setPlayingMistakeIndex(idx);
      const audio = new Audio(sourceUrl);
      audio.volume = 1.0;
      audio.playbackRate = 0.8;
      audioPlayerRef.current = audio;
      
      // Ensure minimum 300ms duration for audibility
      const rawStart = mistake.startTime || 0;
      const rawEnd = mistake.endTime || (rawStart + 1.0);
      const duration = Math.max(0.3, rawEnd - rawStart);
      
      const start = Math.max(0, rawStart - 0.1);
      const end = start + duration + 0.1;
      const durationMs = (end - start) * 1000;
      
      const cleanup = () => {
        if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
        audio.pause();
        audio.removeEventListener('timeupdate', timeUpdateHandler);
        setPlayingMistakeIndex(null);
        if (audioPlayerRef.current === audio) {
          audioPlayerRef.current = null;
        }
      };
      
      const timeUpdateHandler = () => {
        if (audio.currentTime >= end) {
          cleanup();
        }
      };
      
      const playSnippet = () => {
        try {
          audio.addEventListener('timeupdate', timeUpdateHandler);
          audio.currentTime = start;
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              // Fallback timeout in case timeupdate is too slow to fire
              playbackTimeoutRef.current = window.setTimeout(cleanup, durationMs + 100);
            }).catch((err: any) => {
              if (String(err).includes('AbortError')) return;
              console.error('[Mistake Audio] Playback promise rejected:', err);
              cleanup();
            });
          }
        } catch (err) {
          console.error('[Mistake Audio] Error setting currentTime or playing:', err);
          cleanup();
        }
      };
      
      audio.addEventListener('canplay', playSnippet, { once: true });
      audio.addEventListener('ended', cleanup);
      
      if (audio.readyState >= 3) {
        audio.removeEventListener('canplay', playSnippet);
        playSnippet();
      }
    } else {
      console.warn('[Mistake Audio] No sourceUrl available to play audio.');
    }
  };

  const handlePlayUserAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window && activeWord) {
      window.speechSynthesis.cancel();
      // Simulating user audio if alignedWord is available, otherwise falling back
      const wordToSpeak = activeWord.alignedWord || activeWord.word;
      const utterance = new SpeechSynthesisUtterance(wordToSpeak);
      const voices = window.speechSynthesis.getVoices();
      const userVoice = voices.find(v => v.name.includes('Google UK English Male')) || voices.find(v => v.lang === 'en-US' && v.name.includes('Male')) || voices.find(v => v.lang === 'en-US');
      if (userVoice) utterance.voice = userVoice;
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 0.85; // Different pitch to distinguish "user"
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePlayBothAudio = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if ('speechSynthesis' in window && activeWord) {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      const nativeVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang === 'en-US' && v.name.includes('Female')) || voices.find(v => v.lang === 'en-US');
      const userVoice = voices.find(v => v.name.includes('Google UK English Male')) || voices.find(v => v.lang === 'en-US' && v.name.includes('Male')) || voices.find(v => v.lang === 'en-US');
      
      const targetUtterance = new SpeechSynthesisUtterance(activeWord.word);
      if (nativeVoice) targetUtterance.voice = nativeVoice;
      targetUtterance.lang = 'en-US';
      targetUtterance.rate = 0.7;
      targetUtterance.pitch = 1.0;
      targetUtterance.volume = 1;
      
      const userUtterance = new SpeechSynthesisUtterance(activeWord.alignedWord || activeWord.word);
      if (userVoice) userUtterance.voice = userVoice;
      userUtterance.lang = 'en-US';
      userUtterance.rate = 0.8;
      userUtterance.pitch = 0.85;
      userUtterance.volume = 1;

      window.speechSynthesis.speak(targetUtterance);
      // Wait for the first utterance to finish before speaking the second
      targetUtterance.onend = () => {
        setTimeout(() => window.speechSynthesis.speak(userUtterance), 600); // 600ms pause for clarity
      };
    }
  };

  const historyTranscript = (passage?.text || defaultPassageText).split(/\s+/).map((word: string) => {
    const normalized = word.replace(/[.,!?;:]/g, '');
    const normalizedLower = normalized.toLowerCase();
    const analysis = attemptResult?.wordAnalysis?.find((item: any) => {
      const normalizedAnalysisWord = item.word?.toLowerCase() || '';
      const normalizedAlignedWord = item.alignedWord?.toLowerCase() || '';
      return normalizedAnalysisWord === normalizedLower || normalizedAlignedWord === normalizedLower;
    });
    const score = analysis?.score ?? 100;
    const status = analysis
      ? score >= 90 ? 'perfect' : score >= 75 ? 'warning' : 'error'
      : sessionState === 'results' ? 'perfect' : 'perfect';

    const expectedPhonemes = analysis?.expectedPhonemes || [];
    const actualPhonemes = analysis?.actualPhonemes || [];
    const alignedWord = String(analysis?.alignedWord || '').trim();
    const startTime = analysis?.startTime;
    const endTime = analysis?.endTime;

    return {
      word,
      status,
      ipa: expectedPhonemes.length ? expectedPhonemes.join(' ') : '—',
      userIpa: actualPhonemes.length ? actualPhonemes.join(' ') : '—',
      alignedWord: alignedWord || null,
      startTime,
      endTime,
      targetSound: expectedPhonemes.length ? `/${expectedPhonemes[0]}/` : '',
      articulationTip: analysis ? getAnalysisTip(analysis) : 'Focus on clarity and rhythm.',
      tip: analysis ? getAnalysisTip(analysis) : 'Focus on clarity and rhythm while reading each sentence aloud.',
    };
  });

  const transcriptData = historyTranscript.length ? historyTranscript : [];

  const overallScore = Math.round(attemptResult?.scores?.pronunciation || 0);
  const fluencyScore = Math.round(attemptResult?.scores?.fluency || 0);
  const intonationScore = Math.round(attemptResult?.scores?.intonation || 0);
  const prosodyPitch = Math.round(attemptResult?.prosodyAnalysis?.pitchScore || attemptResult?.scores?.intonation || 80);
  const prosodyRhythm = Math.round(attemptResult?.prosodyAnalysis?.rhythmScore || attemptResult?.scores?.fluency || 80);
  const prosodyClarity = Math.round(attemptResult?.scores?.clarity || 85);
  const prosodyPace = Math.round(attemptResult?.scores?.fluency || 80);
  const prosodyStress = Math.round(attemptResult?.scores?.stress || 80);
  
  const issueWords = transcriptData.filter((t: any) => t.status === 'error' || t.status === 'warning');
  const correctCount = transcriptData.length - issueWords.length;

  const readingSpeed = Math.round(attemptResult?.prosodyAnalysis?.averageSpeakingRate ? attemptResult.prosodyAnalysis.averageSpeakingRate * 60 : 120);

  const isInvalidReading = (attemptResult?.attemptClassification && attemptResult.attemptClassification !== 'valid_reading') || attemptResult?.status === 'retry_required' || attemptResult?.status === 'failed';
  const expectedText = attemptResult?.expectedTranscript || passage?.text || defaultPassageText;
  const recognizedText = attemptResult?.recognizedTranscript || attemptResult?.transcript || "No clear speech detected.";

  const getAnalysisState = () => {
    if (uploadProgress > 0 && uploadProgress < 100 && !attemptResult) {
      return { step: 0, progress: Math.max(5, uploadProgress * 0.4), title: 'Uploading Audio', desc: 'Securely transferring your recording.' };
    }
    
    if (attemptResult) {
      const stage = attemptResult.processingStage || attemptResult.workflowState;
      if (stage === 'completed') {
        return { step: 3, progress: 100, title: 'Analysis Complete', desc: 'Preparing your personalized results.' };
      }
      if (stage === 'analyzing' || stage === 'analysis_pending') {
        return { step: 2, progress: 85, title: 'Analyzing Pronunciation', desc: 'Comparing spoken words with native patterns.' };
      }
      if (stage === 'transcribing' || stage === 'transcription_pending') {
        return { step: 1, progress: 65, title: 'Cleaning & Transcribing', desc: 'Filtering noise and extracting phonemes.' };
      }
      return { step: 1, progress: 50, title: 'Processing Upload', desc: 'Verifying audio integrity.' };
    }

    if (uploadProgress === 100) {
      return { step: 1, progress: 45, title: 'Finalizing Upload', desc: 'Connecting to processing engine.' };
    }

    return { step: 0, progress: 10, title: 'Preparing', desc: 'Initializing secure upload.' };
  };

  const analysisState = getAnalysisState();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 font-sans text-slate-900 dark:text-slate-100 bg-slate-100/80 dark:bg-[#070b14]/80 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-[1440px] min-h-[90vh] h-[95vh] bg-white dark:bg-[#0d1117] md:rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden"
        >

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Solo Practice</h1>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Reading Exercise • {passage?.cefrLevel || "B1 Level"}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700">
                <Sparkles className="w-4 h-4 text-purple-500" /> Detailed Feedback
              </button>
              <button onClick={handleClose} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        {/* =============================================================
            STAGE 1: IDLE / RECORDING / ANALYZING 
            ============================================================= */}
        {sessionState !== 'results' && (
          <motion.div
            key="recording-stage"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, filter: 'blur(8px)' }} transition={{ duration: 0.4 }}
            className="flex-1 w-full overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center justify-start py-8 px-4 md:px-12 max-w-6xl mx-auto gap-8"
          >
            {/* Top Progress Bar */}
            <div className="flex items-center gap-4 w-full max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                <Activity className="w-4 h-4 text-purple-500" /> Exercise Progress
              </div>
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex">
                <div className="w-1/8 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 rounded-full relative">
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-[2px]"></div>
                </div>
              </div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                1 / 8
              </div>
            </div>

            {/* Main Sentence Box */}
            <div className="w-full relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#0c101c] border border-purple-200 dark:border-purple-500/30 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.15)] dark:shadow-[0_0_50px_-15px_rgba(168,85,247,0.2)] p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center min-h-[400px] md:min-h-[450px]">
              <WavyBackground position="left" />
              <WavyBackground position="right" />
              
              <div className="relative z-10 w-full flex-1 flex flex-col items-center justify-center max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-purple-500/20 scrollbar-track-transparent pr-2 mb-6">
                <h1 className={`font-serif text-slate-900 dark:text-white text-center tracking-tight leading-tight ${(passage?.text || defaultPassageText).length > 120 ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}>
                  {passage?.text || defaultPassageText}
                </h1>
              </div>
              
              <div className="relative z-10 flex items-center gap-2 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-900/60 px-5 py-2 rounded-full border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm mt-auto">
                <Volume1 className="w-4 h-4 text-purple-500" /> Read the sentence aloud with clarity and confidence
              </div>
            </div>

            {sessionState === 'analyzing' ? (
              <motion.div
                key="analysis-stage"
                initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-3xl my-8"
              >
                <div className="bg-white dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 md:p-10 shadow-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-400/5 to-emerald-500/5 animate-pulse-slow"></div>
                  
                  <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100 dark:text-slate-800/50" />
                        <circle
                          cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent"
                          strokeDasharray={2 * Math.PI * 45}
                          strokeDashoffset={(2 * Math.PI * 45) - (analysisState.progress / 100) * (2 * Math.PI * 45)}
                          className="text-teal-500 transition-all duration-700 ease-out"
                        />
                      </svg>
                      <span className="absolute text-lg font-bold text-slate-800 dark:text-white">
                        {Math.round(analysisState.progress)}%
                      </span>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                      <h4 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-2 flex items-center justify-center md:justify-start gap-3">
                        {analysisState.title}
                        <div className="flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{analysisState.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <PronunciationRecorder
                disabled={isSessionLoading}
                onStateChange={(state) => {
                  if (state === 'recording') setSessionState('recording');
                  if (state === 'processing') setSessionState('analyzing');
                  if (state === 'idle') setSessionState('idle');
                }}
                onSubmitRecording={submitPracticeAttempt}
                onError={(err) => setErrorMessage(err)}
              />
            )}
            
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5 }}
                  className="mt-4 px-6 py-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-center gap-4 w-full max-w-3xl"
                >
                  <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                  <p className="text-sm font-medium text-rose-700 dark:text-rose-400">{errorMessage}</p>
                  <button onClick={() => setErrorMessage('')} className="ml-auto text-rose-400 hover:text-rose-600 dark:hover:text-rose-300">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Tips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-4">
              {[
                { title: "Speak Clearly", desc: "Articulate each word with precision.", icon: Activity, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/20", border: "border-purple-200 dark:border-purple-500/30" },
                { title: "Take Your Time", desc: "Good reading comes with natural pace.", icon: Gauge, color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-500/20", border: "border-indigo-200 dark:border-indigo-500/30" },
                { title: "Listen & Improve", desc: "Review feedback and refine pronunciation.", icon: Headphones, color: "text-teal-500", bg: "bg-teal-100 dark:bg-teal-500/20", border: "border-teal-200 dark:border-teal-500/30" },
                { title: "You've Got This!", desc: "Small steps today, big progress tomorrow.", icon: Trophy, color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-500/20", border: "border-amber-200 dark:border-amber-500/30" },
              ].map((card, i) => (
                <div key={i} className={`flex items-center gap-4 bg-white dark:bg-slate-900/50 p-4 rounded-2xl border ${card.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-default`}>
                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${card.bg}`}>
                    <card.icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{card.title}</h4>
                    <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        )}
        
        {sessionState === 'results' && (
        <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
          {/* DASHBOARD GRID */}
          {isInvalidReading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto bg-slate-50 dark:bg-[#0b0e14]">
              <div className="max-w-4xl w-full flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                  <AlertTriangle className="w-10 h-10 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                  {attemptResult?.attemptClassification === 'silence' ? "We couldn't hear you" :
                   attemptResult?.attemptClassification === 'partial_reading' ? "Incomplete reading" :
                   (attemptResult?.status === 'retry_required' || attemptResult?.status === 'failed') && attemptResult?.attemptClassification === 'valid_reading' ? "Audio Issue Detected" :
                   "Hmm, that didn't sound right"}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg max-w-2xl">
                  {attemptResult?.errorMessage || "It looks like you read a completely different passage or the audio wasn't clear. Let's try that again and focus on reading the target sentence."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">What was expected</h3>
                    <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed">{expectedText}</p>
                  </div>
                  
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">What we heard</h3>
                    <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed italic opacity-80">"{recognizedText}"</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 overflow-y-auto bg-slate-50 dark:bg-[#0b0e14]">

            {/* ================= LEFT COLUMN ================= */}
            <div className="xl:col-span-3 flex flex-col gap-6">

              {/* Overall Accuracy Panel */}
              <div className="bg-white dark:bg-[#131722] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">Overall Accuracy</h3>
                <DonutGauge score={overallScore} />
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-4 leading-relaxed max-w-[80%]">
                  Your performance is better than 84% of other learners
                </p>
              </div>

              {attemptResult?.metadata?.alignmentConfidence !== undefined && attemptResult.metadata.alignmentConfidence < 0.40 && (
                <div className="bg-rose-50 dark:bg-rose-500/10 rounded-3xl p-5 border border-rose-100 dark:border-rose-500/20 shadow-sm">
                  <h3 className="text-sm font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Analysis Confidence
                  </h3>
                  <div className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
                    Low ({Math.round(attemptResult.metadata.alignmentConfidence * 100)}%)
                  </div>
                  <p className="text-[11px] font-medium text-rose-700/80 dark:text-rose-300/80 leading-relaxed">
                    The system had difficulty understanding the recording. Please speak closer to the microphone and try again.
                  </p>
                </div>
              )}

              {/* Performance Breakdown */}
              <div className="bg-white dark:bg-[#131722] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> Performance Breakdown
                  </h3>
                  <button className="text-xs font-bold text-blue-500 hover:text-blue-400">See Details</button>
                </div>

                <div className="space-y-5">
                  {[
                    { label: 'Pronunciation', value: overallScore, color: 'bg-cyan-400', stat: overallScore >= 90 ? 'Excellent' : overallScore >= 75 ? 'Great' : 'Good', statColor: 'text-cyan-400' },
                    { label: 'Fluency', value: fluencyScore, color: 'bg-purple-500', stat: fluencyScore >= 90 ? 'Excellent' : fluencyScore >= 75 ? 'Great' : 'Good', statColor: 'text-purple-400' },
                    { label: 'Prosody', value: intonationScore, color: 'bg-amber-400', stat: intonationScore >= 90 ? 'Excellent' : intonationScore >= 75 ? 'Great' : 'Good', statColor: 'text-amber-400' }
                  ].map((item: any) => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800`}>
                            <Activity className={`w-3 h-3 ${item.statColor}`} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold">
                          <span className="text-slate-800 dark:text-white">{item.value}%</span>
                          <span className={item.statColor}>{item.stat}</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Acoustic Profile */}
              <div className="bg-white dark:bg-[#131722] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col min-h-[260px]">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 z-10">Acoustic Profile</h3>
                <div className="flex-1 -mt-4 relative z-10">
                  <RadarChart data={[
                    { label: 'Pitch', value: prosodyPitch },
                    { label: 'Clarity', value: prosodyClarity },
                    { label: 'Pace', value: prosodyRhythm },
                    { label: 'Stress', value: prosodyStress },
                    { label: 'Intonation', value: intonationScore }
                  ]} />
                </div>
              </div>

              {/* Gamification Card */}
              <div className="bg-gradient-to-br from-indigo-900 to-[#0f0b29] rounded-3xl p-6 border border-indigo-800/50 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-3xl rounded-full"></div>
                <div className="flex items-center gap-4 relative z-10">
                  {/* 3D-ish Star icon mock */}
                  <div className="w-16 h-16 flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-300 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.6)] animate-pulse"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-white drop-shadow-md" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Keep it up!</h3>
                    <p className="text-indigo-200 text-xs mt-1 leading-relaxed">Focus on the highlighted areas to reach perfection.</p>
                  </div>
                </div>
                <button className="w-full mt-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                  View Personalized Tips <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>


            {/* ================= RIGHT COLUMN ================= */}
            <div className="xl:col-span-9 flex flex-col gap-6">

              {/* TOP SECTION: Transcript */}
              <div className="bg-white dark:bg-[#131722] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-500" /> Your Reading
                  </h3>
                  <div className="flex gap-4 text-xs font-semibold text-slate-500 dark:text-slate-300">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div> Perfect</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div> Minor</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div> Error</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 leading-loose mt-4">
                  {transcriptData.map((item, idx) => {
                    const isError = item.status === 'error';
                    const isWarning = item.status === 'warning';
                    const isActive = activeWord?.word === item.word;

                    let baseClasses = `relative px-5 py-2.5 rounded-xl text-lg font-medium transition-all `;
                    if (isError) {
                      baseClasses += `bg-rose-50 dark:bg-[#1A1116] border ${isActive ? 'border-rose-500' : 'border-rose-500/30'} text-slate-900 dark:text-slate-100 hover:border-rose-500 shadow-[inset_0_0_15px_rgba(244,63,94,0.05)]`;
                    } else if (isWarning) {
                      baseClasses += `bg-amber-50 dark:bg-[#1A1611] border ${isActive ? 'border-amber-500' : 'border-amber-500/30'} text-slate-900 dark:text-slate-100 hover:border-amber-500 shadow-[inset_0_0_15px_rgba(245,158,11,0.05)]`;
                    } else {
                      baseClasses += `bg-slate-50 dark:bg-[#181C25] border ${isActive ? 'border-slate-400' : 'border-slate-200 dark:border-slate-700/50'} text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600`;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveWord(item)}
                        className={baseClasses}
                      >
                        {isError && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full shadow-[0_0_5px_rgba(244,63,94,0.8)]"></div>}
                        {isWarning && <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_5px_rgba(245,158,11,0.8)]"></div>}
                        <span className={
                          isError 
                            ? "border-b-2 border-dotted border-rose-500/70 pb-0.5 text-rose-600 dark:text-white" 
                            : isWarning 
                              ? "border-b-2 border-dotted border-amber-500/70 pb-0.5 text-amber-600 dark:text-white"
                              : ""
                        }>
                          {item.word}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MIDDLE SECTION: Detailed Inspector (Always visible when a word is active) */}
              <AnimatePresence mode="wait">
                {activeWord && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-slate-50 dark:bg-[#0f1219] rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800/80 shadow-inner relative">

                      {/* Issue Header */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.3)] ${activeWord.status === 'perfect' ? 'bg-emerald-100 dark:bg-emerald-500 text-emerald-600 dark:text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' : activeWord.status === 'warning' ? 'bg-amber-100 dark:bg-amber-500 text-amber-600 dark:text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'bg-rose-100 dark:bg-rose-500 text-rose-600 dark:text-white'}`}>
                            {activeWord.status === 'perfect' ? <Target className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                          </div>
                          <h4 className={`text-lg font-bold ${activeWord.status === 'perfect' ? 'text-emerald-600 dark:text-emerald-400' : activeWord.status === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-500'}`}>
                            {activeWord.status === 'perfect' ? 'Perfect Articulation' : activeWord.status === 'warning' ? 'Almost There' : 'Needs Improvement'}
                          </h4>
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 sm:ml-4 sm:pl-4 sm:border-l border-slate-200 dark:border-slate-700">
                          {activeWord.tip}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Pronunciation Comparison Box */}
                        <div className="bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
                          <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-6">
                            <Activity className="w-3.5 h-3.5 text-purple-400" /> Pronunciation Comparison
                          </h5>

                          {activeWord.status === 'perfect' ? (
                            <div className="flex flex-col items-center justify-center h-full text-center py-4 flex-1">
                              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                <Target className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
                              </div>
                              <p className="text-emerald-600 dark:text-emerald-400 font-bold text-lg mb-1">Perfect Pronunciation!</p>
                              <p className="text-slate-500 dark:text-slate-400 text-sm">You pronounced this word perfectly.</p>
                              <button onClick={handlePlayTargetAudio} className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm transition-colors border border-emerald-100 dark:border-emerald-500/20">
                                <Volume2 className="w-4 h-4" /> Listen Again
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-8">
                                <div className="text-center w-2/5 relative">
                                  <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-2">Target</p>
                                  <p className="text-xl md:text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">/{activeWord.ipa}/</p>
                                  <div className="mt-4"><ComparisonWaveform isTarget={true} /></div>
                                </div>

                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">VS</div>

                                <div className="text-center w-2/5 relative">
                                  <p className={`text-[10px] font-bold uppercase mb-2 ${activeWord.status === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-500'}`}>You Said</p>
                                  <p className={`text-xl md:text-2xl font-mono font-bold ${activeWord.status === 'warning' ? 'text-amber-600 dark:text-amber-500' : 'text-rose-600 dark:text-rose-500'}`}>/{activeWord.userIpa}/</p>
                                  <div className="mt-4"><ComparisonWaveform isTarget={false} /></div>
                                </div>
                              </div>

                              <div className="flex items-center justify-center gap-4">
                                <button onClick={handlePlayTargetAudio} className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 transition-colors border border-emerald-100 dark:border-emerald-500/20 shadow-sm group">
                                  <Play className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform" />
                                </button>
                                <button onClick={handlePlayBothAudio} className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-sm transition-colors border border-indigo-100 dark:border-indigo-500/20 shadow-sm hover:-translate-y-0.5">
                                  <Play className="w-4 h-4" /> Play Both
                                </button>
                                <button onClick={handlePlayUserAudio} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border shadow-sm group ${activeWord.status === 'warning' ? 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' : 'bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20'}`}>
                                  <Play className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Articulation Guide Box */}
                        <div className="bg-white dark:bg-[#131722] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[250px]">
                          {/* Animated background element for active visualization */}
                          <div className={`absolute top-1/2 left-1/4 w-32 h-32 rounded-full blur-[50px] pointer-events-none transition-colors duration-1000 ${
                            activeWord.status === 'perfect' ? 'bg-emerald-500/10' :
                            activeWord.status === 'warning' ? 'bg-amber-500/10' : 'bg-rose-500/10'
                          }`}></div>

                          <HumanSilhouette />

                          <div className="relative z-10">
                            <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 mb-2">
                              <Activity className="w-3.5 h-3.5 text-purple-400" /> Articulation Guide
                            </h5>
                            <p className="text-xs text-slate-400 mb-6">Focus on the highlighted sounds</p>
                          </div>

                          <div className="flex items-center gap-6 relative z-10 mb-4">
                            <ArticulationMouth />
                            <div className="flex-1 bg-slate-50 dark:bg-[#1A1F2B]/80 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center gap-2 mb-1.5">
                                <p className="text-2xl font-mono font-bold text-indigo-500 dark:text-indigo-400">{activeWord.targetSound}</p>
                                {activeWord.status !== 'perfect' && (
                                  <span className="flex items-center justify-center h-5 px-2 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                    Target
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{activeWord.articulationTip}</p>
                            </div>
                          </div>

                          <div className="relative z-10 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex gap-1.5 items-center justify-center mb-2">
                              {[...Array(15)].map((_, i) => (
                                <div key={i} className={`h-2 rounded-full transition-all duration-300 ${
                                  i < animStep
                                    ? activeWord.status === 'perfect'
                                      ? 'w-4 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                                      : activeWord.status === 'warning'
                                        ? 'w-4 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                                        : 'w-4 bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                    : 'w-2 bg-slate-200 dark:bg-slate-700'
                                  }`} />
                              ))}
                            </div>
                            <p className="text-[10px] text-center font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                              {activeWord.status === 'perfect' ? 'Perfect Execution' : activeWord.status === 'warning' ? 'Needs adjustment' : 'Incorrect position'}
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>


              {/* BOTTOM SECTION: Stats & Mistakes */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 4 Mini Stat Cards */}
                <div className="lg:col-span-8 grid grid-cols-2 gap-4 h-[260px]">

                  {/* Words Accuracy */}
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Words Accuracy</p>
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 relative flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="46" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="289" strokeDashoffset="28.9" strokeLinecap="round" />
                        </svg>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{overallScore}%</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-emerald-500">Excellent</p>
                        <Activity className="w-4 h-4 text-emerald-500 ml-auto mt-1" />
                      </div>
                    </div>
                    <MiniWaveform colorClass="bg-emerald-500/80" count={15} />
                  </div>

                  {/* Reading Speed */}
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Reading Speed</p>
                    <div className="flex items-center justify-between mt-2 mb-4">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 relative flex flex-col items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="46" stroke="#8b5cf6" strokeWidth="8" fill="transparent" strokeDasharray="289" strokeDashoffset="50" strokeLinecap="round" />
                        </svg>
                        <span className="text-xs font-bold text-slate-800 dark:text-white leading-none">{readingSpeed}</span>
                        <span className="text-[8px] font-bold text-slate-400">WPM</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-purple-400">Good</p>
                      </div>
                    </div>
                    <MiniWaveform colorClass="bg-purple-500/80" count={15} />
                  </div>

                  {/* Correct Words */}
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Correct Words</p>
                    <div className="mt-2 mb-4">
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{correctCount} <span className="text-sm text-slate-500">/ {transcriptData.length}</span></p>
                      <p className="text-xs font-bold text-emerald-500 mt-1">Great</p>
                    </div>
                    <MiniWaveform colorClass="bg-emerald-400" count={15} animate={false} />
                  </div>

                  {/* Error Words */}
                  <div className="bg-white dark:bg-[#131722] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Error Words</p>
                    <div className="mt-2 mb-4">
                      <p className="text-2xl font-bold text-rose-500">{issueWords.length}</p>
                      <p className="text-xs font-bold text-rose-500 mt-1">Needs Work</p>
                    </div>
                    <MiniWaveform colorClass="bg-rose-500" count={15} animate={false} />
                  </div>

                </div>

                {/* Mistakes List */}
                <div className="lg:col-span-4 bg-white dark:bg-[#131722] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[260px]">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-4 shrink-0">Mistakes</p>
                  <div className="flex-1 space-y-3 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {issueWords.map((mistake: any, idx: number) => (
                      <div key={idx} onClick={() => setActiveWord(mistake)} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400">{idx + 1}.</span>
                          <span className={`text-sm font-semibold text-slate-800 dark:text-white transition-colors ${mistake.status === 'error' ? 'group-hover:text-rose-400' : 'group-hover:text-amber-400'}`}>{mistake.word}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${mistake.status === 'error' ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-amber-500 bg-amber-50 dark:bg-amber-500/10'}`}>{mistake.status === 'error' ? 'Needs Work' : 'Minor'}</span>
                          <button onClick={(e) => handlePlayMistakeAudio(mistake, idx, e)} className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${playingMistakeIndex === idx ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-[#1A1F2B] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500'}`}>
                            {playingMistakeIndex === idx ? (
                              <div className="w-2 h-2 bg-white rounded-[1px] animate-pulse" />
                            ) : (
                              <Volume2 className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-slate-50 hover:bg-slate-100 dark:bg-[#1A1F2B] dark:hover:bg-[#222836] border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    Review All Mistakes <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* ACTION BAR (Fixed at bottom) */}
          <div className="w-full bg-slate-50 dark:bg-[#0b0e14] border-t border-slate-200 dark:border-slate-800 p-4 shrink-0 shadow-lg relative z-10">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={handlePlayNativeAudio} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white dark:bg-[#1A1F2B] hover:bg-emerald-50 dark:hover:bg-[#1A222C] border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 font-bold text-[13px] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                <Headphones className="w-4 h-4 group-hover:scale-110 transition-transform" /> 
                <span className="tracking-wide">Listen to Native</span>
              </button>
              <button onClick={handleRetryExercise} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white dark:bg-[#1A1F2B] hover:bg-purple-50 dark:hover:bg-[#222836] border border-slate-200 dark:border-slate-700 text-purple-600 dark:text-purple-400 font-bold text-[13px] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 group">
                <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-300" /> 
                <span className="tracking-wide">Try Again</span>
              </button>
              <button onClick={handleNextExercise} className="w-full sm:w-auto flex-[1.2] flex items-center justify-center gap-2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[13px] transition-all shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 group">
                <span className="tracking-wide">Next Exercise</span> 
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
        )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}