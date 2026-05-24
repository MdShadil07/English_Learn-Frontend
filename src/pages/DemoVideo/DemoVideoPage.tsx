import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Maximize,
  Mic,
  MousePointer2,
  Pause,
  Play,
  Settings,
  ShieldCheck,
  SkipForward,
  Sparkles,
  Volume2,
  MessageSquare,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Icons/Logo';

// --- Types ---
type Scene = {
  id: string;
  label: string;
  title: string;
  summary: string;
  duration: number; // in ms
  text: string;     // Voiceover text
  render: () => React.ReactNode;
};

export default function DemoVideoPage() {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  
  // Voice synth
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const scenes = useMemo<Scene[]>(() => [
    {
      id: 'intro',
      label: 'Landing',
      title: 'The landing page sets the tone',
      summary: 'A clean brand reveal that mirrors the public homepage and product positioning.',
      duration: 6200,
      text: 'We begin on the landing page, where the brand, motion, and learning promise are introduced with a clean product-first feel.',
      render: () => <SceneIntro />
    },
    {
      id: 'dashboard',
      label: 'AI Chat',
      title: 'AI personalities and settings',
      summary: 'The chat experience brings personality selection and speech settings into a polished control surface.',
      duration: 8400,
      text: 'Next, the AI chat page shows personalities, language, voice, and response settings in a single focused workspace.',
      render: () => <SceneDashboard />
    },
    {
      id: 'chat-room',
      label: 'Practice Room',
      title: 'Live practice room and collaboration',
      summary: 'A room-style session with controls, participants, and active speaking feedback.',
      duration: 9200,
      text: 'The practice room feels live and collaborative, with speaking controls, participant tiles, and session actions that mirror the real product flow.',
      render: () => <SceneChatRoom />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      title: 'Analytics that prove progress',
      summary: 'Track performance, trends, and skill breakdowns with confidence.',
      duration: 7800,
      text: 'Analytics translate practice into proof. The dashboard highlights trends, skill breakdowns, and recent gains so progress is always visible.',
      render: () => <SceneAnalytics />
    },
    {
      id: 'pronunciation',
      label: 'Pronunciation',
      title: 'Pronunciation studio with real-time guidance',
      summary: 'Waveform, score, and sound-level coaching presented with precision.',
      duration: 8000,
      text: 'In pronunciation, the studio analyzes speech in real time and highlights specific sounds so learners can correct and repeat with confidence.',
      render: () => <ScenePronunciation />
    },
    {
      id: 'outro',
      label: 'Close',
      title: 'Ready for the full product story',
      summary: 'A clean finish that leaves the audience with the core value proposition.',
      duration: 5200,
      text: 'Everything works together as one premium learning flow. That is the product story: practice, feedback, analytics, and confidence.',
      render: () => <SceneOutro />
    }
  ], []);

  const activeScene = scenes[currentSceneIndex];

  const handlePlayPause = () => {
    if (showPlayOverlay) {
      setShowPlayOverlay(false);
      setIsPlaying(true);
      playScene(currentSceneIndex);
      return;
    }

    if (isPlaying) {
      setIsPlaying(false);
      if (synthRef.current) synthRef.current.pause();
    } else {
      setIsPlaying(true);
      if (synthRef.current && synthRef.current.paused) {
         synthRef.current.resume();
      } else {
         playScene(currentSceneIndex);
      }
    }
  };

  const playScene = (index: number) => {
    if (index >= scenes.length) {
      setIsPlaying(false);
      setShowPlayOverlay(true);
      return;
    }

    setCurrentSceneIndex(index);
    setProgress(0);
    
    // Voiceover
    if (synthRef.current) {
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(scenes[index].text);
      // Try to find a good English voice (preferably female/professional if available)
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Natural')));
      if (preferredVoice) utterance.voice = preferredVoice;
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }
  };

  // Progress Bar effect
  useEffect(() => {
    if (!isPlaying) return;

    const interval = 50; // update every 50ms
    const step = (interval / scenes[currentSceneIndex].duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev + step >= 100) {
          clearInterval(timer);
          // Go to next scene
          if (currentSceneIndex < scenes.length - 1) {
            playScene(currentSceneIndex + 1);
          } else {
            setIsPlaying(false);
            setShowPlayOverlay(true);
          }
          return 100;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentSceneIndex]);


  const skipScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      playScene(currentSceneIndex + 1);
    } else {
       setIsPlaying(false);
       setShowPlayOverlay(true);
       setProgress(100);
    }
  };


  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#f8fbff] text-slate-900 font-sans dark:bg-[#070b14] dark:text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.12),_transparent_24%),linear-gradient(180deg,_rgba(255,255,255,0)_0%,_rgba(248,251,255,0.96)_100%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.08),_transparent_24%),linear-gradient(180deg,_rgba(7,11,20,0)_0%,_rgba(7,11,20,0.96)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.06] [background-image:linear-gradient(rgba(51,65,85,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(51,65,85,0.28)_1px,transparent_1px)] [background-size:56px_56px]" />

      <div className="absolute inset-x-0 top-0 z-50 flex items-center justify-between border-b border-emerald-200/50 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-emerald-800/30 dark:bg-slate-950/85 sm:px-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="lg" variant="adaptive" animated={false} className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                <Sparkles size={12} />
                Product Demo
              </div>
              <div className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">CognitoSpeak AI Learning Platform</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-xs text-emerald-700 backdrop-blur md:flex md:items-center md:gap-2 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
            <ShieldCheck size={14} className="text-emerald-500" />
            Guided walkthrough
          </div>
          <button
            onClick={() => navigate('/')}
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800/40 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-emerald-950/30"
          >
            Exit demo
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col pt-20">
        <div className="relative flex flex-1 items-center justify-center px-4 pb-6 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSceneIndex}
              initial={{ opacity: 0, y: 18, scale: 0.985, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, scale: 1.01, filter: 'blur(12px)' }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="flex h-full w-full items-center justify-center"
            >
              {activeScene.render()}
            </motion.div>
          </AnimatePresence>

          <AnimatePresence>
            {showPlayOverlay && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md dark:bg-slate-950/55"
              >
                <motion.button
                  initial={{ scale: 0.88, y: 12 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                  onClick={handlePlayPause}
                  className="group flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-[0_0_60px_rgba(20,184,166,0.35)] transition hover:scale-105"
                >
                  <Play size={40} className="ml-2" fill="currentColor" />
                </motion.button>
                <p className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">Start the polished walkthrough</p>
                <p className="mt-2 max-w-md text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
                  Turn on audio for the voice-over, scene cuts, and feature callouts.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        <div className="relative z-50 border-t border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlayPause}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              onClick={skipScene}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10"
            >
              <SkipForward size={22} />
            </button>

            <div className="hidden h-11 items-center rounded-full border border-emerald-200 bg-white/85 px-4 text-xs uppercase tracking-[0.28em] text-emerald-600 md:flex dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              Scene {String(currentSceneIndex + 1).padStart(2, '0')}
            </div>

            <div className="flex flex-1 items-center gap-2">
              {scenes.map((scene, idx) => (
                <button
                  key={`${scene.id}-progress`}
                  onClick={() => playScene(idx)}
                  className="group h-2 flex-1 overflow-hidden rounded-full bg-emerald-100 dark:bg-white/10"
                  aria-label={`Jump to ${scene.title}`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-150 ${idx < currentSceneIndex ? 'bg-emerald-400' : idx === currentSceneIndex ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500' : 'bg-transparent group-hover:bg-emerald-200 dark:group-hover:bg-white/20'}`}
                    style={{ width: idx < currentSceneIndex ? '100%' : idx === currentSceneIndex ? `${progress}%` : '0%' }}
                  />
                </button>
              ))}
            </div>

            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10">
              <Volume2 size={18} />
            </button>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:border-white/20 dark:hover:bg-white/10"
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen();
                } else if (document.exitFullscreen) {
                  document.exitFullscreen();
                }
              }}
            >
              <Maximize size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// SCENE COMPONENTS
// ==========================================

function Cursor({ path, duration = 4 }: { path: any[], duration?: number }) {
  return (
    <motion.div
      initial={{ x: path[0].x, y: path[0].y, opacity: 0 }}
      animate={{ 
        x: path.map(p => p.x), 
        y: path.map(p => p.y),
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: duration, 
        times: [0, 0.1, 0.9, 1],
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 1
      }}
      className="absolute z-50 drop-shadow-lg"
    >
      <MousePointer2 className="text-white fill-slate-900 drop-shadow-md w-6 h-6" />
      
      {/* Click ripple effect */}
      <motion.div 
        animate={{ scale: [1, 2.5], opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
        className="absolute top-0 left-0 w-4 h-4 bg-blue-400 rounded-full -ml-1 -mt-1"
      />
    </motion.div>
  );
}

function SceneIntro() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[500px] w-[960px] rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/75 to-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-[0_40px_120px_rgba(15,23,42,0.65)]" />
      </div>
      <div className="absolute -left-12 top-6 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <div className="absolute -right-12 bottom-4 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl" />

      <div className="relative z-10 grid w-full max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-700 shadow-sm dark:border-emerald-800/40 dark:bg-slate-950/60 dark:text-emerald-300">
            <Sparkles size={12} />
            CognitoSpeak landing page
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mb-7 flex h-24 w-24 items-center justify-center rounded-[1.4rem] border border-emerald-200 bg-white shadow-[0_0_80px_rgba(20,184,166,0.16)] dark:border-emerald-800/30 dark:bg-slate-900 dark:shadow-[0_0_80px_rgba(20,184,166,0.32)]"
          >
            <Logo size="2xl" variant="adaptive" animated={false} />
          </motion.div>

          <h1 className="text-5xl font-semibold tracking-tight text-slate-900 md:text-7xl dark:text-white">
            Learn English with a{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-300 dark:via-teal-300 dark:to-cyan-300">premium product feel</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl dark:text-slate-300">
            The homepage reveal mirrors the app’s public identity: sharp branding, confident motion, and a direct path into chat, practice, analytics, and pronunciation.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">Live learning</div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">AI guidance</div>
            <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">Progress tracking</div>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-3 text-sm font-medium text-white shadow-[0_16px_40px_rgba(20,184,166,0.28)]">
              Get started free
              <ArrowRight size={16} />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-medium text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
              Explore demo
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.15 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative flex h-[440px] w-full items-center justify-center rounded-[2rem] border border-emerald-200/60 bg-white/80 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-emerald-800/30 dark:bg-slate-950/75">
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_30%_25%,rgba(20,184,166,0.16),transparent_30%),radial-gradient(circle_at_70%_70%,rgba(45,212,191,0.12),transparent_28%)]" />
            <div className="relative flex h-full w-full items-center justify-center">
              <div className="absolute inset-8 rounded-full border border-emerald-200/50 dark:border-white/10" />
              <div className="absolute inset-16 rounded-full border border-emerald-200/35 dark:border-white/10" />
              <div className="absolute inset-24 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.14),transparent_70%)]" />
              <div className="absolute h-40 w-40 rounded-full bg-emerald-500/15 blur-2xl" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
                className="absolute h-72 w-72 rounded-full border border-dashed border-emerald-300/40 dark:border-emerald-400/20"
              />

              {[0, 120, 240].map((rotate, idx) => (
                <motion.div
                  key={rotate}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.15 }}
                  className="absolute h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.7)]"
                  style={{ transform: `rotate(${rotate}deg) translateX(150px)` }}
                />
              ))}

              <div className="relative z-10 flex h-36 w-36 items-center justify-center rounded-full bg-slate-950 shadow-[0_0_50px_rgba(15,23,42,0.22)] ring-1 ring-emerald-200 dark:ring-emerald-400/20">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-[0.28em] text-emerald-400">Live</div>
                  <div className="mt-2 text-3xl font-semibold text-white">4,812</div>
                  <div className="mt-1 text-sm text-slate-300">learners online</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SceneDashboard() {
  return (
    <div className="relative h-[520px] w-[920px] overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:bg-slate-950/95 dark:shadow-[0_30px_100px_rgba(15,23,42,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.14),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.12),_transparent_32%)]" />

      <div className="relative flex h-full">
        <div className="w-72 border-r border-emerald-100 bg-white/90 p-6 dark:border-white/10 dark:bg-black/25">
          <div className="mb-8 flex items-center gap-3">
            <Logo size="lg" variant="adaptive" animated={false} />
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white">CognitoSpeak</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">AI Learning Platform</div>
            </div>
          </div>

          <div className="space-y-2">
            {[
              ['Alex Mentor', 'Beginner English', true],
              ['Nova Coach', 'Conversation practice', false],
              ['Iris Scholar', 'Advanced grammar', false],
              ['Atlas Mentor', 'Business English', false],
              ['Luna Guide', 'Cultural English', false],
            ].map(([label, meta, active]) => (
              <div
                key={label as string}
                className={`rounded-2xl border px-4 py-3 text-sm transition ${active ? 'border-emerald-400/40 bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'border-emerald-100 bg-white/90 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-slate-800/50'}`}
              >
                <div className="font-medium">{label as string}</div>
                <div className={`mt-1 text-xs ${active ? 'text-emerald-50/90' : 'text-slate-500 dark:text-slate-400'}`}>{meta as string}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Selected voice</div>
            <div className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">Nova Coach</div>
            <div className="mt-1 text-sm text-emerald-600 dark:text-emerald-300">English, natural speech</div>
          </div>
        </div>

        <div className="flex-1 p-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-emerald-600 dark:text-slate-400">AI chat</div>
              <div className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Personality and settings</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                Show settings
              </div>
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500" />
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white">Nova Coach</div>
                    <div className="text-xs text-emerald-600 dark:text-emerald-400">Conversational English</div>
                  </div>
                </div>
                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Voice enabled
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="max-w-[76%] rounded-3xl rounded-tl-md border border-emerald-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
                  We can talk about travel, work, or daily routines. I’ll correct you without breaking the flow.
                </div>
                <div className="ml-auto max-w-[76%] rounded-3xl rounded-tr-md bg-gradient-to-br from-emerald-500 to-teal-500 px-4 py-3 text-sm leading-6 text-white shadow-[0_0_30px_rgba(20,184,166,0.18)]">
                  I want to sound more natural in meetings.
                </div>
                <div className="max-w-[78%] rounded-3xl rounded-tl-md border border-amber-500/25 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-[#111827] dark:text-slate-200">
                  <span className="font-medium text-amber-600 dark:text-amber-300">Tip:</span> try a more direct sentence and we’ll refine tone and vocabulary.
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Settings</div>
              {[
                ['Response language', 'English'],
                ['Show accuracy', 'On'],
                ['Auto translate', 'Off'],
                ['Voice rate', '0.9x'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Aligned with the AI chat sidebar</div>
                  </div>
                  <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{value}</div>
                </div>
              ))}

              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
                <div className="text-sm font-medium text-emerald-700 dark:text-emerald-200">Selected personality</div>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  Nova Coach is tuned for realistic conversation, pronunciation coaching, and contextual correction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Cursor path={[{ x: 116, y: 118 }, { x: 392, y: 250 }, { x: 728, y: 160 }]} duration={6} />
    </div>
  );
}

function SceneChatRoom() {
  return (
    <div className="relative h-[520px] w-[920px] overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:bg-slate-950/95 dark:shadow-[0_30px_100px_rgba(15,23,42,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_35%),linear-gradient(180deg,_rgba(255,255,255,0.9)_0%,_rgba(248,251,255,1)_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.8)_0%,_rgba(2,6,23,1)_100%)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex h-16 items-center justify-between border-b border-emerald-100 bg-white/90 px-6 dark:border-white/10 dark:bg-black/20">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
              <User size={20} />
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white">Practice room</div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">Live collaboration</div>
            </div>
          </div>
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Room session
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Host', 'Maya', 'Online'],
                  ['Participants', '6', '2 speaking'],
                  ['Latency', '28ms', 'Stable'],
                  ['Room lock', 'Off', 'Ready to join'],
                ].map(([label, value, meta], idx) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 * idx }}
                    className="rounded-3xl border border-emerald-100 bg-white/90 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">{label}</div>
                    <div className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{value}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{meta}</div>
                  </motion.div>
                ))}
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Participants</div>
                    <div className="mt-1 text-lg font-medium text-slate-900 dark:text-white">Speaking tiles</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-700 dark:text-emerald-200">Live room</div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {['Maya', 'Alex', 'Nova Coach', 'You'].map((name, idx) => (
                    <motion.div
                      key={name}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + idx * 0.12 }}
                      className="relative rounded-3xl border border-emerald-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(236,253,245,0.95)_100%)] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                          <User size={18} />
                        </div>
                        <div className={`h-2.5 w-2.5 rounded-full ${idx % 2 === 0 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                      </div>
                      <div className="mt-5 text-base font-medium text-slate-900 dark:text-white">{name}</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Speaking now</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-emerald-100 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Session chat</div>
                  <div className="mt-1 text-lg font-medium text-slate-900 dark:text-white">Correction without disruption</div>
                </div>
                <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  Active
                </div>
              </div>

              <div className="space-y-3">
                <div className="max-w-[88%] rounded-3xl rounded-tl-md border border-emerald-100 bg-white px-4 py-3 text-sm leading-6 text-slate-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200">
                  Let’s start with a short introduction. Speak naturally and I’ll keep the feedback precise.
                </div>
                <div className="ml-auto max-w-[88%] rounded-3xl rounded-tr-md bg-gradient-to-br from-emerald-500 to-teal-500 px-4 py-3 text-sm leading-6 text-white">
                  Hi everyone, I’m ready to practice my pronunciation and confidence.
                </div>
                <div className="max-w-[88%] rounded-3xl rounded-tl-md border border-amber-500/25 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700 dark:bg-[#111827] dark:text-slate-200">
                  <span className="font-medium text-amber-600 dark:text-amber-300">Coach note:</span> use a smoother pause after “practice” and keep the last consonant clear.
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-white/10 dark:bg-white/5">
                <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Controls</div>
                <div className="mt-4 flex items-center gap-3">
                  {['Mic', 'Hand', 'Reaction', 'Leave'].map((item) => (
                    <div key={item} className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="flex h-20 items-center gap-4 border-t border-emerald-100 bg-white/90 px-4 dark:border-white/10 dark:bg-black/20">
          <div className="relative flex h-12 flex-1 items-center overflow-hidden rounded-full border border-emerald-100 bg-emerald-50/70 px-4 dark:border-white/10 dark:bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '64%' }}
              transition={{ delay: 0.8, duration: 1.2 }}
              className="absolute left-0 top-0 h-full bg-emerald-500/10"
            />
            <span className="relative z-10 text-slate-500 dark:text-slate-400">Room controls and live input...</span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
            <Play size={18} fill="currentColor" className="ml-0.5" />
          </div>
        </div>
      </div>

      <Cursor path={[{ x: 420, y: 432 }, { x: 744, y: 444 }, { x: 744, y: 444 }]} duration={6} />
    </div>
  );
}

function SceneAnalytics() {
  return (
    <div className="relative h-[520px] w-[920px] overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:bg-slate-950/95 dark:shadow-[0_30px_100px_rgba(15,23,42,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(20,184,166,0.14),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.1),_transparent_30%)]" />

      <div className="relative h-full p-7">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-emerald-600 dark:text-slate-400">Analytics</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">Performance at a glance</div>
          </div>
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
            Last 7 days
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ['Accuracy', '94%', '+5'],
            ['Fluency', '88%', '+3'],
            ['Pronunciation', '86%', '+8'],
            ['Streak', '24d', '+2'],
          ].map(([label, value, delta]) => (
            <div key={label} className="rounded-3xl border border-emerald-100 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">{label}</div>
              <div className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">{value}</div>
              <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-300">+{delta}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">Score trend</div>
                <div className="mt-1 text-lg font-medium text-white">Skill improvement over time</div>
              </div>
                       <div className="rounded-full bg-sky-500/15 px-3 py-1 text-xs text-emerald-300">Consistent growth</div>
            </div>

            <div className="mt-6 flex h-56 items-end gap-3">
              {[48, 55, 60, 68, 73, 82, 91].map((height, idx) => (
                <motion.div
                  key={idx}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ delay: 0.6 + idx * 0.08, duration: 0.45 }}
                    className="flex-1 rounded-t-2xl bg-gradient-to-t from-emerald-500 via-teal-500 to-cyan-400"
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="rounded-3xl border border-emerald-100 bg-white/90 p-5 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">
              <BarChart3 size={14} />
              Breakdown
            </div>

            <div className="mt-4 space-y-4">
              {[
                ['Conversation', 88],
                ['Grammar', 91],
                ['Pronunciation', 84],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{label as string}</span>
                    <span>{value as number}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-100 dark:bg-white/10">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 p-4">
              <div className="text-sm font-medium text-emerald-700 dark:text-emerald-200">Insight</div>
              <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                Speaking consistency is improving, and pronunciation is the fastest-moving skill this week.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Cursor path={[{ x: 220, y: 144 }, { x: 580, y: 250 }, { x: 780, y: 180 }]} duration={5.5} />
    </div>
  );
}

function ScenePronunciation() {
  return (
    <div className="relative h-[520px] w-[920px] overflow-hidden rounded-[2rem] border border-emerald-200/70 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:bg-slate-950/95 dark:shadow-[0_30px_100px_rgba(15,23,42,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.12),_transparent_26%)]" />

      <div className="relative flex h-full flex-col items-center justify-center p-8">
        <div className="mb-10 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-600 dark:text-slate-400">Pronunciation studio</div>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl dark:text-white">Say the sentence with precision</h2>
          <p className="mt-3 text-lg text-slate-300 md:text-xl">
            <span className="text-slate-900 dark:text-white">The </span>
            <span className="text-amber-500 dark:text-amber-300">quick</span>
            <span className="text-slate-900 dark:text-white"> brown fox jumps.</span>
          </p>
        </div>

        <div className="mb-10 flex h-28 items-center gap-2">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [12, 20 + ((i * 17) % 55), 12] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.03, ease: 'easeInOut' }}
              className={`w-2 rounded-full ${i > 18 && i < 26 ? 'bg-amber-400' : 'bg-emerald-500'}`}
              style={{ opacity: i > 18 && i < 26 ? 0.55 : 1 }}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="flex max-w-3xl items-center gap-6 rounded-3xl border border-emerald-100 bg-white/90 p-6 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-white/5"
        >
          <div className="relative h-20 w-20">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              <path
                className="text-emerald-100 dark:text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: '88, 100' }}
                transition={{ delay: 3.2, duration: 1 }}
                className="text-emerald-500"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-slate-900 dark:text-white">88%</div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">Coaching note</div>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Excellent clarity</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Tighten the <span className="text-amber-500 dark:text-amber-300">/kw/</span> in quick and keep the ending consonant clean.
            </p>
          </div>
        </motion.div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[
            ['Sound', '/kw/', 'Targeted focus'],
            ['Rhythm', 'Smooth', 'Natural pacing'],
            ['Score', '88%', 'Strong result'],
          ].map(([label, value, meta]) => (
            <div key={label} className="rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 text-center dark:border-white/10 dark:bg-white/5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-600 dark:text-slate-400">{label}</div>
              <div className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{value}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{meta}</div>
            </div>
          ))}
        </div>

        <Cursor path={[{ x: 286, y: 398 }, { x: 410, y: 300 }, { x: 410, y: 300 }]} duration={6} />
      </div>
    </div>
  );
}

function SceneOutro() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[420px] w-[760px] rounded-[2rem] border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/70 to-white shadow-[0_40px_120px_rgba(15,23,42,0.12)] dark:border-emerald-800/30 dark:from-slate-900 dark:via-slate-950 dark:to-black dark:shadow-[0_40px_120px_rgba(15,23,42,0.65)]" />
      </div>

      <div className="relative z-10 flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-[0_0_60px_rgba(20,184,166,0.22)] ring-1 ring-emerald-200 dark:bg-emerald-500 dark:shadow-[0_0_60px_rgba(34,197,94,0.35)] dark:ring-emerald-400/30"
        >
          <Logo size="lg" variant="adaptive" animated={false} />
        </motion.div>

        <motion.h2
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl dark:text-white"
        >
          Ready to present the product story
        </motion.h2>

        <motion.p
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300"
        >
          The demo now closes with a cleaner pace, stronger framing, and a professional finish that connects chat room, analytics, and pronunciation in one flow.
        </motion.p>

        <motion.button
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-4 text-lg font-medium text-white shadow-[0_16px_40px_rgba(20,184,166,0.28)] transition hover:scale-[1.02]"
        >
          Start learning free
          <ArrowRight size={18} />
        </motion.button>
      </div>
    </div>
  );
}
