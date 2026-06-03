import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Play, RotateCcw, 
  Target, AlertTriangle, XCircle, Info, ChevronRight, Sparkles, AudioWaveform,
  BookOpen, X
} from 'lucide-react';
import { pronunciationService } from '@/services/pronunciationService';
import { pronunciationUploadService } from '@/services/pronunciationUploadService';
import PronunciationRecorder from '@/components/Pronunciation Page/PronunciationRecorder';
import type { PronunciationRecordingPayload } from '@/types/pronunciation';
import PhenomenaPanel from '@/components/Pronunciation Page/PhenomenaPanel';
import CommunicationCoach from '@/components/Pronunciation Page/CommunicationCoach';
import GamificationPanel from '@/components/Pronunciation Page/GamificationPanel';
import MouthAnimationSequencer from '@/components/Pronunciation Page/Visuals/MouthAnimationSequencer';

// --- MOCK BUTTON COMPONENT ---
const Button = ({ children, onClick, className = "", variant = "default", disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
    outline: "border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// --- HIGH-PERFORMANCE AUDIO SPECTRUM ---
const LiveAudioSpectrum = ({ isRecording, color = "emerald", barCount = 36, height = "100%" }) => (
  <div className="flex items-center justify-center gap-[2px] sm:gap-[3px] w-full mx-auto" style={{ height, transform: 'translateZ(0)' }}>
    {[...Array(barCount)].map((_, i) => {
      const centerDist = Math.abs((barCount / 2) - i);
      const maxHeight = 100 - (centerDist * (100 / (barCount / 2)));
      const isActive = isRecording;
      
      const bgColorClass = color === "emerald" ? "bg-emerald-400 dark:bg-emerald-500" : "bg-blue-400 dark:bg-blue-500";
      
      return (
        <motion.div
          key={i}
          className={`flex-1 rounded-full origin-center will-change-transform ${isActive ? bgColorClass : 'bg-slate-200 dark:bg-slate-700/50'}`}
          animate={{ 
            scaleY: isActive ? [Math.max(0.1, Math.random()), Math.max(0.2, (maxHeight/100) * Math.random() * 1.5), Math.max(0.1, Math.random())] : 0.1
          }}
          transition={{ duration: isActive ? 0.3 + Math.random() * 0.2 : 0.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
          style={{ height: '100%', minWidth: '2px' }}
        />
      );
    })}
  </div>
);

// --- CIRCULAR SCORE GAUGE ---
const ScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800/50" />
        <motion.circle 
          cx="50" cy="50" r="45" stroke="url(#scoreGradient)" strokeWidth="8" fill="transparent" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }} strokeLinecap="round"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-emerald-600 tracking-tighter">{score}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Overall</span>
      </div>
    </div>
  );
};

const defaultPassageText = 'The architect designed a beautiful structure for the museum.';

const fallbackPassage = {
  text: defaultPassageText,
  exerciseType: 'Architecture',
  cefrLevel: 'B1',
  phonemeTargets: ['CH', 'SH'],
  mtiTargets: ['clarity'],
  metadata: {
    readingHints: [],
  },
};

const defaultTranscriptData = [
  { word: 'The', status: 'perfect', ipa: 'ðə' },
  { word: 'architect', status: 'warning', ipa: 'ˈɑːrkɪtekt', userIpa: 'ˈɑːrtʃɪtekt', tip: "Pronounce 'ch' as /k/ here." },
  { word: 'designed', status: 'perfect', ipa: 'dɪˈzaɪnd' },
  { word: 'a', status: 'perfect', ipa: 'ə' },
  { word: 'beautiful', status: 'perfect', ipa: 'ˈbjuːtɪfl' },
  { word: 'structure', status: 'error', ipa: 'ˈstrʌktʃər', userIpa: 'ˈstrʌkʃər', tip: "Missing the 't' sound before 'sh'." },
  { word: 'for', status: 'perfect', ipa: 'fɔːr' },
  { word: 'the', status: 'perfect', ipa: 'ðə' },
  { word: 'museum.', status: 'perfect', ipa: 'mjuˈziːəm' },
];

const getAnalysisTip = (analysis) => {
  if (!analysis) {
    return 'Listen carefully to the target pronunciation and repeat with confidence.';
  }

  const alignedWord = String(analysis.alignedWord || '').trim();
  const targetWord = String(analysis.word || '').trim();
  if (!alignedWord && (analysis.issueType === 'omission' || analysis.score === 0)) {
    return `The target word "${targetWord}" was likely omitted. Slow down and pronounce the full word clearly.`;
  }

  if (alignedWord && targetWord && alignedWord.toLowerCase() !== targetWord.toLowerCase()) {
    return `You said "${alignedWord}" instead of "${targetWord}". Focus on consonant sequence and vowel quality.`;
  }

  const issue = analysis.issueType || 'pronunciation';
  if (issue === 'clarity') {
    return `Use a clearer mouth shape for "${analysis.word}" and keep the consonants crisp.`;
  }

  if (issue === 'stress') {
    return `Shift the stress pattern on "${analysis.word}" to match natural English rhythm.`;
  }

  if (issue === 'intonation') {
    return `Raise or lower your pitch on "${analysis.word}" to reflect natural speech melody.`;
  }

  return `Try producing the expected phonemes more accurately for "${analysis.word}".`;
};

const classificationLabels = {
  valid_reading: 'Valid reading',
  partial_reading: 'Partial reading',
  wrong_passage: 'Different passage',
  random_speech: 'Unrelated speech',
  native_language: 'Another language detected',
  low_audio_quality: 'Low audio quality',
  silence: 'No clear speech',
};

export default function SoloPracticeModal({ isOpen = true, onClose = () => {} }) {
  const [sessionState, setSessionState] = useState('idle'); // idle | recording | analyzing | results
  const [activeWord, setActiveWord] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [passage, setPassage] = useState(fallbackPassage);
  const [attemptResult, setAttemptResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);

  const pollIntervalRef = useRef<number | null>(null);
  const pollTimeoutRef = useRef<number | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (sessionState !== 'analyzing') {
      setAnalysisStepIndex(0);
      return;
    }

    const interval = window.setInterval(() => {
      setAnalysisStepIndex((current) => (current + 1) % 4);
    }, 1800);

    return () => window.clearInterval(interval);
  }, [sessionState]);

  const cleanupSession = useCallback(() => {
    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }

    setSessionInfo(null);
    setPassage(fallbackPassage);
    setAttemptResult(null);
    setErrorMessage('');
    setIsSessionLoading(false);
    setIsSubmittingAttempt(false);
    setUploadProgress(0);
    setSessionState('idle');
    setActiveWord(null);
  }, []);

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
    // Only initialize when modal opens and hasn't been initialized yet
    if (isOpen && !hasInitializedRef.current) {
      initializeSession();
      hasInitializedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const submitPracticeAttempt = async (recording: PronunciationRecordingPayload) => {
    const sessionId = sessionInfo?._id || sessionInfo?.id;
    if (!sessionId) {
      setErrorMessage('Unable to submit attempt without an active practice session.');
      setSessionState('idle');
      return;
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
      }
    } catch (error) {
      console.error('Submit attempt error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit your recording for analysis.');
      setSessionState('idle');
    } finally {
      setIsSubmittingAttempt(false);
      setUploadProgress(0);
    }
  };


  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      window.clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      window.clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  const isTerminalAttemptState = (attempt: { status?: string; workflowState?: string; processingStage?: string } | null | undefined): boolean => {
    if (!attempt) return false;
    const terminal = ['completed', 'failed', 'retry_required', 'cancelled'];
    return terminal.includes(attempt.status || '') ||
           terminal.includes(attempt.workflowState || '') ||
           terminal.includes(attempt.processingStage || '');
  };

  const pollAttemptStatus = (sessionId: string, attemptId: string) => {
    stopPolling();

    // Safety timeout — stop polling after 3 minutes and show an error
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

  const handleClose = () => {
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
    hasInitializedRef.current = false;
    await initializeSession();
  };

  const handleNextLesson = async () => {
    setAttemptResult(null);
    setActiveWord(null);
    setErrorMessage('');
    setUploadProgress(0);
    setSessionState('idle');
    hasInitializedRef.current = false;
    await initializeSession();
  };

  const handlePlayNativeAudio = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Speech synthesis not supported');
    }
  };

  const validation = attemptResult?.trustSignals?.validation;
  const classification = attemptResult?.attemptClassification || validation?.classification;

  const historyTranscript = (passage?.text || defaultPassageText).split(/\s+/).map((word) => {
    const normalized = word.replace(/[.,!?;:]/g, '');
    const normalizedLower = normalized.toLowerCase();
    const analysis = attemptResult?.wordAnalysis?.find((item) => {
      const normalizedAnalysisWord = item.word?.toLowerCase() || '';
      const normalizedAlignedWord = item.alignedWord?.toLowerCase() || '';
      return normalizedAnalysisWord === normalizedLower || normalizedAlignedWord === normalizedLower;
    });
    const score = analysis?.score ?? 100;
    const classification = attemptResult?.attemptClassification || validation?.classification;
    const isTrustRejected = Boolean(classification && classification !== 'valid_reading');
    const status = analysis
      ? score >= 90
        ? 'perfect'
        : score >= 75
        ? 'warning'
        : 'error'
      : isTrustRejected
      ? classification === 'partial_reading'
        ? 'warning'
        : 'error'
      : sessionState === 'results'
      ? 'perfect'
      : 'perfect';

    const expectedPhonemes = analysis?.expectedPhonemes || [];
    const actualPhonemes = analysis?.actualPhonemes || [];
    const alignmentConfidence = analysis ? (analysis?.alignmentConfidence ?? undefined) : undefined;
    const confidenceLevel = alignmentConfidence >= 0.82 ? 'high' : alignmentConfidence >= 0.6 ? 'medium' : 'low';

    const alignedWord = String(analysis?.alignedWord || '').trim();
    const targetWord = String(normalized || '').trim();
    const isOmitted = Boolean(analysis && !alignedWord && (analysis.issueType === 'omission' || analysis.score === 0));
    const isSubstitution = Boolean(analysis && alignedWord && alignedWord.toLowerCase() !== normalizedLower);
    const isLowConfidence = typeof alignmentConfidence === 'number' && alignmentConfidence < 0.6;

    const wordPhenomena = (attemptResult?.phenomena || []).filter((p) => {
      const id = String(p?.id || '').toLowerCase();
      const name = String(p?.name || '').toLowerCase();
      const evidence = Array.isArray(p?.evidence) ? p.evidence.join(' ').toLowerCase() : '';
      return id.includes(normalizedLower) || name.includes(normalizedLower) || evidence.includes(normalizedLower);
    }).slice(0, 3);

    let diagnosisTitle = 'Pronunciation deviation';
    let diagnosisReason = 'This word differs from the expected pronunciation profile.';
    let phenomenaMissingReason = 'No stable phenomenon was attached for this word.';

    if (isOmitted) {
      diagnosisTitle = 'Word omitted';
      diagnosisReason = `Target word "${targetWord}" was not reliably detected in your speech.`;
      phenomenaMissingReason = 'Phenomena is empty here because the word was omitted, so no spoken phoneme pattern could be extracted.';
    } else if (isSubstitution) {
      diagnosisTitle = 'Word substitution';
      diagnosisReason = `Target "${targetWord}" was recognized as "${alignedWord}".`;
      phenomenaMissingReason = 'Phenomena is empty because this looks like a lexical substitution at low confidence rather than a stable phonological pattern.';
    } else if (isLowConfidence) {
      diagnosisTitle = 'Low alignment confidence';
      diagnosisReason = `The system could not align this word confidently (confidence ${Math.round((alignmentConfidence || 0) * 100)}%).`;
      phenomenaMissingReason = 'Phenomena is empty because low alignment confidence prevents trustworthy phoneme-level pattern extraction.';
    }

    return {
      word,
      status,
      ipa: expectedPhonemes.length ? expectedPhonemes.join(' ') : '—',
      userIpa: actualPhonemes.length ? actualPhonemes.join(' ') : '—',
      alignmentConfidence,
      confidenceLevel,
      alignedWord: alignedWord || null,
      diagnosisTitle,
      diagnosisReason,
      phenomenaForWord: wordPhenomena,
      phenomenaMissingReason,
      phonemes: {
        expected: expectedPhonemes,
        actual: actualPhonemes,
      },
      tip: analysis ? getAnalysisTip(analysis) : 'Focus on clarity and rhythm while reading each sentence aloud.',
    };
  });

  const overviewScores = attemptResult?.scores || {
    pronunciation: 0,
    fluency: 0,
    intonation: 0,
  };

  const issueWords = attemptResult?.wordAnalysis?.filter((item) => item.score < 90) ?? [];
  const isValidationOnlyAttempt = Boolean(classification && classification !== 'valid_reading');
  const severity = attemptResult?.trustSignals?.severity?.label || (attemptResult?.severity >= 4 ? 'critical' : attemptResult?.severity >= 3 ? 'major' : attemptResult?.severity >= 2 ? 'moderate' : 'minor');
  const focusWords = issueWords.slice(0, 3).map((item) => item.word).join(', ') || 'pronunciation accuracy';
  const analysisStatus = isValidationOnlyAttempt
    ? (classificationLabels[classification] || 'Validation required')
    : attemptResult?.status === 'failed'
    ? 'Reliable analysis unavailable'
    : attemptResult?.status === 'completed'
    ? 'Analysis complete'
    : 'Processing results';
  const highlightDescription = issueWords.length
    ? `${issueWords.length} word${issueWords.length === 1 ? '' : 's'} need attention.`
    : isValidationOnlyAttempt
    ? (validation?.reason || attemptResult?.errorMessage || 'This recording could not be safely scored.')
    : attemptResult?.status === 'failed'
    ? (attemptResult?.errorMessage || 'We could not analyze this recording reliably.')
    : 'Great job! Your pronunciation was consistent across the passage.';
  const isAttemptFailed = attemptResult?.status === 'failed' || attemptResult?.status === 'retry_required';

  const transcriptData = historyTranscript.length ? historyTranscript : defaultTranscriptData;
  const getConfidenceMeta = (confidence?: number) => {
    if (typeof confidence !== 'number') {
      return { label: 'Not scored', tone: 'text-slate-600 bg-slate-100 border-slate-200 dark:text-slate-300 dark:bg-slate-800/40 dark:border-slate-700/60' };
    }
    const value = confidence;
    if (value >= 0.82) {
      return { label: 'High confidence', tone: 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800/50' };
    }
    if (value >= 0.6) {
      return { label: 'Uncertain', tone: 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800/50' };
    }
    return { label: 'Unreliable', tone: 'text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800/50' };
  };
  const getSeverityMeta = (value?: string) => {
    switch (value) {
      case 'critical':
        return { label: 'Critical', tone: 'text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800/50' };
      case 'major':
        return { label: 'Major', tone: 'text-orange-700 bg-orange-100 border-orange-200 dark:text-orange-300 dark:bg-orange-900/30 dark:border-orange-800/50' };
      case 'moderate':
        return { label: 'Moderate', tone: 'text-amber-700 bg-amber-100 border-amber-200 dark:text-amber-300 dark:bg-amber-900/30 dark:border-amber-800/50' };
      default:
        return { label: 'Minor', tone: 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800/50' };
    }
  };
  const analysisSteps = [
    {
      title: 'Preparing your audio',
      description: 'Uploading the recording and securing it for backend processing.',
    },
    {
      title: 'Cleaning the signal',
      description: 'Reducing background noise, trimming silence, and normalizing the voice track.',
    },
    {
      title: 'Analyzing pronunciation',
      description: 'Comparing spoken words with the target passage and locating weak spots.',
    },
    {
      title: 'Building feedback',
      description: 'Generating word-level corrections and targeted pronunciation guidance.',
    },
  ];
  const activeAnalysisStep = analysisSteps[analysisStepIndex];
  const analysisProgress = uploadProgress > 0
    ? Math.min(92, Math.max(uploadProgress, 18 + (analysisStepIndex * 18)))
    : 22 + (analysisStepIndex * 18);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8 font-sans">
          
          {/* Backdrop (Darkened, blurred background) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 dark:bg-[#070b14]/80 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full max-w-6xl h-full max-h-[95vh] bg-white dark:bg-[#0d1117] rounded-[2.5rem] shadow-2xl shadow-slate-900/40 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transform translateZ(0)"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Background Ambient Glow (Hardware Accelerated) */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.08)_0%,transparent_60%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 md:px-8 border-b border-slate-100 dark:border-slate-800/60 relative z-20 bg-white/50 dark:bg-[#0d1117]/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center border border-teal-100 dark:border-teal-800/50 shadow-sm">
                  <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#0f172a] dark:text-white leading-none text-lg">Solo Practice</h3>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Reading Exercise</p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable area) */}
            <div className="flex-1 overflow-y-auto relative z-10 p-6 md:p-10 flex flex-col">
              <AnimatePresence mode="wait">
                
                {/* -------------------------------------------------------------
                    STAGE 1: IDLE / RECORDING / ANALYZING
                ------------------------------------------------------------- */}
                {sessionState !== 'results' && (
                  <motion.div 
                    key="recording-stage"
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }} transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-4 md:py-10"
                  >
                    {/* Reading Passage */}
                    <div className="text-center mb-12 md:mb-20 w-full">
                      <div className="flex items-center justify-center gap-3 mb-6">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 text-[10px] md:text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 rounded-md uppercase tracking-wider">
                            {passage?.cefrLevel || 'B1'}
                          </span>
                          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {passage?.exerciseType || 'Architecture'}
                          </p>
                        </div>
                      </div>
                      {passage?.metadata?.readingHints && passage.metadata.readingHints.length > 0 && (
                        <div className="mb-4 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                          <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                            💡 Tip: {passage.metadata.readingHints[0]}
                          </p>
                        </div>
                      )}
                      <div className="bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 p-8 md:p-14 rounded-[2.5rem] shadow-inner">
                        <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-relaxed md:leading-snug text-[#0f172a] dark:text-white tracking-tight">
                          {passage?.text || defaultPassageText}
                        </h2>
                      </div>
                    </div>

                    {sessionState === 'analyzing' ? (
                      <motion.div
                        key="analysis-stage"
                        initial={{ opacity: 0, scale: 0.96, y: 18 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-3xl"
                      >
                        <div className="rounded-[2.25rem] border border-slate-200/70 bg-white/90 p-6 shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80 md:p-8">
                          <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:gap-10">
                            <div className="relative flex h-44 w-44 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
                              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-500/20 via-emerald-400/20 to-cyan-500/20 blur-lg"></div>
                              <div className="absolute inset-0 rounded-full border-2 border-teal-400/40 animate-[ping_2.2s_infinite]"></div>
                              <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-[ping_2.2s_infinite]" style={{ animationDelay: '0.45s', transform: 'scale(1.18)' }}></div>
                              <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-[ping_2.2s_infinite]" style={{ animationDelay: '0.9s', transform: 'scale(1.36)' }}></div>
                              <div className="relative z-20 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-400 text-white shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                                <AudioWaveform className="h-11 w-11 animate-pulse" />
                              </div>
                              {[0, 1, 2].map((index) => (
                                <motion.div
                                  key={index}
                                  className="absolute z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-teal-600 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-emerald-300"
                                  style={{
                                    top: `${50 + 28 * Math.sin(index * Math.PI * 0.65)}%`,
                                    left: `${50 + 28 * Math.cos(index * Math.PI * 0.65)}%`,
                                    transform: 'translate(-50%, -50%)',
                                  }}
                                  animate={{ opacity: [0.45, 1, 0.45], scale: [0.78, 1, 0.78] }}
                                  transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.3, ease: 'easeInOut' }}
                                >
                                  <Sparkles className="h-4 w-4" />
                                </motion.div>
                              ))}
                            </div>

                            <div className="flex-1 text-center md:text-left">
                              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-teal-700 dark:border-teal-800/50 dark:bg-teal-900/20 dark:text-teal-300">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-[11px] font-extrabold uppercase tracking-widest">Pronunciation engine active</span>
                              </div>

                              <h3 className="text-2xl font-extrabold tracking-tight text-[#0f172a] dark:text-white md:text-3xl">
                                {activeAnalysisStep.title}
                              </h3>
                              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                                {activeAnalysisStep.description}
                              </p>

                              <div className="mt-6 w-full overflow-hidden rounded-full border border-slate-200/60 bg-slate-100 shadow-inner dark:border-slate-700/50 dark:bg-slate-800/70">
                                <motion.div
                                  className="h-3 rounded-full bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400"
                                  animate={{ width: `${analysisProgress}%` }}
                                  transition={{ duration: 0.6, ease: 'easeOut' }}
                                />
                              </div>

                              <div className="mt-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                                <span>{uploadProgress > 0 && uploadProgress < 100 ? `Uploading ${uploadProgress}%` : 'Analysis in progress'}</span>
                                <span>{analysisProgress}%</span>
                              </div>

                              <div className="mt-6 grid gap-3">
                                {analysisSteps.map((step, index) => {
                                  const isActive = index === analysisStepIndex;
                                  const isDone = index < analysisStepIndex || (uploadProgress === 100 && index === 0);

                                  return (
                                    <div
                                      key={step.title}
                                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all ${
                                        isActive
                                          ? 'border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-800/50 dark:bg-teal-900/20 dark:text-teal-300'
                                          : isDone
                                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-300'
                                          : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-400'
                                      }`}
                                    >
                                      <div className={`h-2.5 w-2.5 rounded-full ${isActive ? 'bg-teal-500 animate-pulse' : isDone ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                      <span className="text-sm font-bold">{step.title}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <PronunciationRecorder
                        disabled={isSessionLoading}
                        isBusy={isSubmittingAttempt}
                        uploadProgress={uploadProgress}
                        onStateChange={(state) => {
                          if (state === 'uploading') {
                            setSessionState('analyzing');
                            return;
                          }

                          if (state === 'recording') {
                            setSessionState('recording');
                            return;
                          }

                          if (state === 'review') {
                            setSessionState('idle');
                            return;
                          }

                          if (sessionState !== 'analyzing') {
                            setSessionState('idle');
                          }
                        }}
                        onSubmitRecording={async (payload) => {
                          setSessionState('analyzing');
                          await submitPracticeAttempt(payload);
                        }}
                      />
                    )}

                    {errorMessage && (
                      <p className="mt-4 text-center text-sm font-medium text-rose-600 dark:text-rose-400">{errorMessage}</p>
                    )}
                  </motion.div>
                )}

                {/* -------------------------------------------------------------
                    STAGE 2: ANALYSIS RESULTS DASHBOARD
                ------------------------------------------------------------- */}
                {sessionState === 'results' && (
                  <motion.div 
                    key="results-stage"
                    initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full flex-1 flex flex-col max-w-6xl mx-auto"
                  >
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-6">
                      <div>
                         <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">{isValidationOnlyAttempt ? 'Attempt Validation' : 'Acoustic Analysis'}</h2>
                         <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{isValidationOnlyAttempt ? 'We checked whether the recording matches the passage before scoring.' : 'Detailed phoneme breakdown for Exercise 1'}</p>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={handleNextLesson}
                          variant="outline" 
                          className="rounded-full font-bold bg-emerald-50/60 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 backdrop-blur-md hover:bg-emerald-100 dark:hover:bg-emerald-800 transition-all shadow-sm"
                        >
                          Next Lesson
                        </Button>
                        <Button 
                          onClick={handleRetryExercise}
                          variant="outline" 
                          className="rounded-full font-bold bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 backdrop-blur-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" /> Retry Exercise
                        </Button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6 md:gap-8 flex-1">
                      
                      {/* --- LEFT COLUMN: OVERALL STATS --- */}
                      <div className="lg:col-span-4 flex flex-col gap-6">
                        {/* Score Card */}
                        <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col items-center relative overflow-hidden">
                          {/* Inner Glow */}
                          <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
                          
                          <ScoreGauge score={isValidationOnlyAttempt ? 0 : overviewScores.pronunciation || 0} />
                          
                          <div className="w-full mt-6 text-center space-y-3 relative z-10">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{analysisStatus}</p>
                            <h3 className="text-3xl font-extrabold text-[#0f172a] dark:text-white">{isValidationOnlyAttempt ? 'Not scored' : `${overviewScores.pronunciation || 0}%`}</h3>
                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">{isValidationOnlyAttempt ? 'Validation status' : 'Pronunciation Score'}</p>
                          </div>

                          <div className="w-full mt-8 space-y-5 relative z-10">
                            {[
                              { label: 'Accuracy', value: overviewScores.pronunciation || 0, color: 'teal' },
                              { label: 'Fluency', value: overviewScores.fluency || 0, color: 'blue' },
                              { label: 'Prosody', value: overviewScores.intonation || 0, color: 'emerald' }
                            ].map((metric) => (
                              <div key={metric.label}>
                                <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                  <span>{metric.label}</span>
                                  <span className={`text-${metric.color}-600 dark:text-${metric.color}-400`}>{metric.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-200/80 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                  <motion.div 
                                    className={`h-full bg-${metric.color}-500 rounded-full`}
                                    initial={{ width: 0 }} animate={{ width: `${metric.value}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Accent Profile Card */}
                        <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-[1.5rem] p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex items-start gap-4">
                          <div className={`${isAttemptFailed ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-100 dark:border-amber-800/50' : 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-100 dark:border-indigo-800/50'} p-3 rounded-xl border flex-shrink-0`}>
                            {isAttemptFailed ? <AlertTriangle className="w-5 h-5 text-amber-500" /> : <Target className="w-5 h-5 text-indigo-500" />}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-[#0f172a] dark:text-white text-sm mb-1">{isValidationOnlyAttempt ? (classificationLabels[classification] || 'Retry Recommended') : isAttemptFailed ? 'Retry Recommended' : 'Acoustic Profile'}</h4>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">{highlightDescription}</p>
                          </div>
                        </div>
                      </div>

                      {/* --- RIGHT COLUMN: INTERACTIVE TRANSCRIPT --- */}
                      <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                        <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                          <PhenomenaPanel attempt={attemptResult} />
                          <CommunicationCoach attempt={attemptResult} />
                        </div>
                        <div className="mb-4">
                          <GamificationPanel attempt={attemptResult} />
                        </div>
                        <div className="bg-slate-50/80 dark:bg-slate-900/50 rounded-[2.5rem] p-6 md:p-8 border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex-1 relative overflow-hidden flex flex-col">
                          
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Sentence Transcript</h3>
                            <div className="flex gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600"></div> Perfect</span>
                               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Minor</span>
                               <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Error</span>
                            </div>
                          </div>
                          
                          {/* The Interactive Buttons */}
                          {isAttemptFailed ? (
                            <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50/70 p-6 text-left dark:border-amber-800/50 dark:bg-amber-900/20">
                              <div className="mb-5 flex items-start gap-4">
                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
                                  <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-extrabold text-[#0f172a] dark:text-white">We couldn't score this recording safely</h4>
                                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300">
                                    {validation?.reason || attemptResult?.errorMessage || "The recording could not be reliably matched with the target passage, so detailed pronunciation feedback has been withheld."}
                                  </p>
                                </div>
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-slate-950/30">
                                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300">Expected Passage</p>
                                  <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                                    “{validation?.expectedTranscript || passage?.text || defaultPassageText}”
                                  </p>
                                </div>
                                <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-slate-950/30">
                                  <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-300">What We Detected</p>
                                  <p className="text-sm font-semibold leading-relaxed text-slate-800 dark:text-slate-100">
                                    “{validation?.recognizedTranscript || attemptResult?.recognizedTranscript || 'No clear speech detected.'}”
                                  </p>
                                </div>
                              </div>

                              <div className="mt-4 rounded-2xl border border-amber-100 bg-white/80 p-4 dark:border-amber-900/40 dark:bg-slate-950/30">
                                <div className="grid gap-3 md:grid-cols-3">
                                  <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Status</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{classificationLabels[classification] || 'Retry required'}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Similarity</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{Math.round((validation?.metrics?.similarity || 0) * 100)}%</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Recommendation</p>
                                    <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">{validation?.recommendation || 'Please retry with the displayed passage.'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2 md:gap-3 leading-loose">
                              {transcriptData.map((item, idx) => (
                                <motion.button
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (idx * 0.05) }}
                                  onClick={() => setActiveWord(item)}
                                  className={`px-4 py-2 md:px-5 md:py-2.5 rounded-[1rem] text-lg md:text-xl font-bold transition-all shadow-sm border ${
                                    item.status === 'perfect' 
                                      ? 'bg-white dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700' 
                                      : item.status === 'warning'
                                      ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50 cursor-pointer'
                                      : 'bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 cursor-pointer'
                                  } ${activeWord?.word === item.word ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-slate-400 dark:ring-slate-500 scale-105' : ''}`}
                                >
                                  <span className="flex flex-col items-center leading-none gap-1">
                                    <span>{item.word}</span>
                                    <span className={`text-[9px] md:text-[10px] px-2 py-0.5 rounded-full border ${getConfidenceMeta(item.alignmentConfidence).tone}`}>{getConfidenceMeta(item.alignmentConfidence).label}</span>
                                  </span>
                                </motion.button>
                              ))}
                            </div>
                          )}

                          {/* Detail Breakdown Panel (Appears on click) */}
                          <AnimatePresence mode="wait">
                            {activeWord && activeWord.status !== 'perfect' ? (
                              <motion.div 
                                key="breakdown"
                                initial={{ opacity: 0, height: 0, marginTop: 0 }} 
                                animate={{ opacity: 1, height: 'auto', marginTop: 32 }} 
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="mt-auto pt-6 border-t border-slate-200/80 dark:border-slate-700/80"
                              >
                                <div className={`p-6 rounded-[1.5rem] border ${
                                  activeWord.status === 'error' 
                                    ? 'bg-rose-50/50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30' 
                                    : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30'
                                }`}>
                                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                    
                                    {/* Phonetic Comparison Box */}
                                    <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-4 px-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex-shrink-0 w-full sm:w-auto justify-center">
                                      <div className="text-center">
                                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Target</div>
                                        {activeWord.ipa && activeWord.ipa !== '—' ? (
                                          <div className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">/{activeWord.ipa}/</div>
                                        ) : (
                                          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">No expected phonemes available</div>
                                        )}
                                      </div>
                                      <div className="w-px h-10 bg-slate-200 dark:bg-slate-700"></div>
                                      <div className="text-center">
                                        <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">You Said</div>
                                        {activeWord.userIpa && activeWord.userIpa !== '—' ? (
                                          <div className={`text-xl font-mono font-bold ${activeWord.status === 'error' ? 'text-rose-600 dark:text-rose-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                            /{activeWord.userIpa}/
                                          </div>
                                        ) : (
                                          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">No spoken phonemes captured</div>
                                        )}
                                      </div>
                                    </div>

                                    <div className="w-full sm:w-auto rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs bg-white/70 dark:bg-slate-900/60">
                                      <div><span className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px]">Target Word:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{activeWord.word}</span></div>
                                      <div className="mt-1"><span className="font-extrabold text-slate-500 uppercase tracking-widest text-[10px]">Detected Word:</span> <span className="font-semibold text-slate-800 dark:text-slate-100">{activeWord.alignedWord || 'Not detected'}</span></div>
                                    </div>

                                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest ${getConfidenceMeta(activeWord.alignmentConfidence).tone}`}>
                                      <span className="h-2 w-2 rounded-full bg-current"></span>
                                      {getConfidenceMeta(activeWord.alignmentConfidence).label}
                                    </div>

                                    {/* Feedback Tip */}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        {activeWord.status === 'error' ? <XCircle className="w-4 h-4 text-rose-500" /> : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                                        <h4 className="font-extrabold text-[#0f172a] dark:text-white text-[15px]">Phoneme Mismatch</h4>
                                      </div>
                                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                                        {activeWord.tip}
                                      </p>
                                      <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-3">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{activeWord.diagnosisTitle || 'Word diagnosis'}</p>
                                        <p className="mt-1 text-xs text-slate-700 dark:text-slate-200">{activeWord.diagnosisReason || 'No diagnosis details available.'}</p>
                                      </div>
                                      <div className="mt-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-3">
                                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Expected vs Spoken Phenomena</p>
                                        {Array.isArray(activeWord.phenomenaForWord) && activeWord.phenomenaForWord.length ? (
                                          <div className="mt-2 space-y-2">
                                            {activeWord.phenomenaForWord.map((ph, i) => (
                                              <div key={`${ph.id || ph.name || 'phen'}-${i}`} className="text-xs">
                                                <p className="font-bold text-slate-800 dark:text-slate-100">{ph.name}</p>
                                                <p className="text-slate-600 dark:text-slate-300">{Array.isArray(ph.evidence) ? ph.evidence.join(' ') : 'No evidence text.'}</p>
                                              </div>
                                            ))}
                                          </div>
                                        ) : (
                                          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">{activeWord.phenomenaMissingReason || 'Phenomena is empty because this word did not produce a stable reusable pattern in this attempt.'}</p>
                                        )}
                                      </div>
                                      <div className="mt-3">
                                        <MouthAnimationSequencer
                                          cue={activeWord.animationCue}
                                          expected={activeWord?.phonemes?.expected || []}
                                          actual={activeWord?.phonemes?.actual || []}
                                          word={activeWord.word}
                                        />
                                      </div>
                                      <button 
                                        onClick={() => handlePlayNativeAudio(activeWord.word)}
                                        className="mt-4 text-[11px] font-extrabold flex items-center gap-1.5 text-[#0f172a] dark:text-white bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                                      >
                                        <Play className="w-3.5 h-3.5 text-emerald-500 fill-current" /> Listen to Native Audio
                                      </button>
                                    </div>
                                    
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                key="hint"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                                className="mt-auto pt-8 text-center text-sm font-medium text-slate-400 flex items-center justify-center gap-2"
                              >
                                <Info className="w-4 h-4" /> Tap any highlighted word for a detailed phonetic breakdown
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Target Drill Action */}
                        <div className={`${isAttemptFailed ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20' : 'bg-gradient-to-r from-teal-500 to-emerald-500 shadow-teal-500/20'} rounded-[1.5rem] p-6 md:px-8 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg`}>
                          <div>
                            <h4 className="font-extrabold text-lg tracking-tight mb-1">{isAttemptFailed ? 'Retry This Recording' : 'Targeted Drill Generated'}</h4>
                            <p className="text-white/90 text-sm font-medium">
                              {isAttemptFailed
                                ? 'Record again in a quieter space or move closer to the microphone so we can produce trustworthy pronunciation feedback.'
                                : `Practice: ${focusWords} to improve your score and reduce the most common pronunciation mistakes.`}
                            </p>
                          </div>
                          <Button onClick={handleRetryExercise} className={`w-full sm:w-auto bg-white ${isAttemptFailed ? 'text-amber-700' : 'text-teal-700'} hover:bg-slate-50 font-bold rounded-xl shadow-sm border-0 h-12 px-6 transition-transform hover:-translate-y-0.5`}>
                            {isAttemptFailed ? 'Try Again' : 'Start Drill'} <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
