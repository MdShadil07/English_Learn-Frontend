import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Mic, Zap, Activity,
  Crown, Sparkles, Volume2, Settings, CheckCircle2,
  ArrowRight, ArrowUpRight, BookOpen,
  Brain, Briefcase, GraduationCap, Glasses, Award,
  Globe2, Ear, Video, MicOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Globe from 'react-globe.gl';
import {
  AlexPersonalityLogo,
  NovaPersonalityLogo,
  LiamPersonalityLogo,
  CoachTaylorLogo,
  SophiaLogo,
} from '../Icons/AIPersonalityLogos';

// --- Helper: Color Maps to prevent Tailwind purging dynamic classes ---
const colorClasses = {
  emerald: {
    bg: 'bg-emerald-100 dark:bg-emerald-900/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800'
  },
  cyan: {
    bg: 'bg-cyan-100 dark:bg-cyan-900/30',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800'
  },
  teal: {
    bg: 'bg-teal-100 dark:bg-teal-900/30',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800'
  },
  amber: {
    bg: 'bg-amber-100 dark:bg-amber-900/30',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  }
};

const stepColorClasses = {
  emerald: {
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200/50 dark:border-emerald-800/40',
    glow: 'rgba(16, 185, 129, 0.12)',
    progress: 'bg-emerald-500'
  },
  teal: {
    bg: 'bg-teal-50/80 dark:bg-teal-950/20',
    text: 'text-teal-600 dark:text-teal-400',
    border: 'border-teal-200/50 dark:border-teal-800/40',
    glow: 'rgba(20, 184, 166, 0.12)',
    progress: 'bg-teal-500'
  },
  amber: {
    bg: 'bg-amber-50/80 dark:bg-amber-950/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200/50 dark:border-amber-800/40',
    glow: 'rgba(245, 158, 11, 0.12)',
    progress: 'bg-amber-500'
  },
  cyan: {
    bg: 'bg-cyan-50/80 dark:bg-cyan-950/20',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200/50 dark:border-cyan-800/40',
    glow: 'rgba(6, 182, 212, 0.12)',
    progress: 'bg-cyan-500'
  },
  indigo: {
    bg: 'bg-indigo-50/80 dark:bg-indigo-950/20',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200/50 dark:border-indigo-800/40',
    glow: 'rgba(99, 102, 241, 0.12)',
    progress: 'bg-indigo-500'
  },
  rose: {
    bg: 'bg-rose-50/80 dark:bg-rose-950/20',
    text: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200/50 dark:border-rose-800/40',
    glow: 'rgba(244, 63, 94, 0.12)',
    progress: 'bg-rose-500'
  }
};

// --- Utility: Hardware-Accelerated Mouse Spotlight Card ---
const SpotlightCard = ({ children, className = "", spotColor = "rgba(45, 212, 191, 0.15)", onMouseEnter, onMouseLeave }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-slate-200/60 dark:border-slate-800/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl overflow-hidden transition-all duration-500 ease-out hover:border-teal-300/40 dark:hover:border-teal-600/40 shadow-lg shadow-slate-200/10 dark:shadow-none ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ transform: 'translateZ(0)' }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              ${spotColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full z-10 w-full">{children}</div>
    </div>
  );
};

// --- Micro-component: Typist Simulator for Correction Preview ---
const TypingText = ({ text, delay = 0.05 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    if (!text) return;

    const timer = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, delay * 1000);

    return () => clearInterval(timer);
  }, [text, delay]);

  return <>{displayed}</>;
};

// --- Micro-component: Voice Wave Animator ---
const AudioWaveform = () => {
  const bars = Array.from({ length: 15 });
  return (
    <div className="flex items-end justify-center gap-1.5 h-10 w-full px-4">
      {bars.map((_, i) => {
        const centerOffset = Math.abs(7 - i);
        const baseHeight = Math.max(6, 26 - centerOffset * 2.5);
        return (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-teal-450 to-cyan-400 rounded-full"
            style={{ backgroundColor: '#14b8a6' }}
            animate={{
              height: [baseHeight - 3, baseHeight + (Math.random() * 14 - 4), baseHeight - 3]
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.03
            }}
          />
        );
      })}
    </div>
  );
};

// --- Visual: AI Personality Selector (Custom Gradient SVG Avatars) ---
const personalities = [
  {
    id: 'alex',
    name: 'Alex',
    role: 'Casual Chat',
    tier: 'Free',
    color: 'emerald' as const,
    Icon: AlexPersonalityLogo,
    iconSize: 28,
    desc: 'Great for daily conversation practice. Provides minor corrections on the fly.',
    features: ['Casual Tone', 'Minor Corrections', 'Basic Vocabulary']
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Professional',
    tier: 'Pro',
    color: 'purple' as const,
    Icon: NovaPersonalityLogo,
    iconSize: 28,
    desc: 'Focused on business English and formal structure. Ideal for workplace prep.',
    features: ['Formal Tone', 'Grammar Precision', 'Business Terms']
  },
  {
    id: 'liam',
    name: 'Liam',
    role: 'Grammar Coach',
    tier: 'Pro',
    color: 'cyan' as const,
    Icon: LiamPersonalityLogo,
    iconSize: 28,
    desc: 'Stops to explain rules. Perfect if you want to understand the "why" behind mistakes.',
    features: ['Rule Explanations', 'Structure Drills', 'Detailed Feedback']
  },
  {
    id: 'coach',
    name: 'Coach Taylor',
    role: 'Intensive',
    tier: 'Premium',
    color: 'teal' as const,
    Icon: CoachTaylorLogo,
    iconSize: 28,
    desc: 'High-intensity practice with deep analysis. Corrects major & minor errors instantly.',
    features: ['Deep Analysis', 'Strict Corrections', 'Unlimited Chats']
  },
  {
    id: 'sophia',
    name: 'Sophia',
    role: 'Academic',
    tier: 'Premium',
    color: 'amber' as const,
    Icon: SophiaLogo,
    iconSize: 34,
    desc: 'Prepares you for IELTS/TOEFL with complex sentence structures and advanced vocabulary.',
    features: ['Academic Vocab', 'Complex Syntax', 'Essay Review']
  }
];

const PersonalityShowcase = () => {
  const [activeId, setActiveId] = useState('coach');
  const activePersona = personalities.find(p => p.id === activeId) || personalities[3];

  const activeClasses = colorClasses[activePersona.color];
  const colorGlow = activePersona.color === 'emerald' ? 'rgba(16, 185, 129, 0.08)' :
    activePersona.color === 'purple' ? 'rgba(168, 85, 247, 0.08)' :
      activePersona.color === 'cyan' ? 'rgba(6, 182, 212, 0.08)' :
        activePersona.color === 'teal' ? 'rgba(20, 184, 166, 0.08)' :
          'rgba(245, 158, 11, 0.08)';

  return (
    <div className="flex flex-col h-full w-full justify-center">
      {/* Avatar Selector - Scrollable on Mobile */}
      <div className="flex justify-start md:justify-between items-center mb-6 bg-white/40 dark:bg-slate-950/40 p-2.5 rounded-[1.25rem] border border-slate-200/50 dark:border-slate-800/40 shadow-inner overflow-x-auto no-scrollbar gap-2 md:gap-0">
        {personalities.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`relative group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 flex-shrink-0 min-w-[68px] md:min-w-0 ${activeId === p.id
                ? 'bg-slate-950/5 dark:bg-white/8 shadow-[0_10px_30px_rgba(15,23,42,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] scale-105 z-10 border border-white/50 dark:border-white/10'
                : 'hover:bg-white/50 dark:hover:bg-slate-850/50 opacity-70 hover:opacity-100 hover:-translate-y-0.5'
              }`}
            aria-pressed={activeId === p.id}
          >
            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-white/70 via-white/30 to-slate-100/50 dark:from-slate-900/75 dark:via-slate-900/55 dark:to-slate-800/80 border border-white/70 dark:border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_20px_rgba(15,23,42,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_20px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 group-hover:scale-105 group-active:scale-95">
                <p.Icon size={p.iconSize} className={`transition-all duration-300 ${activeId === p.id ? 'scale-110' : 'opacity-85'}`} />
              </div>
              {p.tier === 'Premium' && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full shadow-sm border-2 border-white dark:border-slate-800">
                  <Crown className="w-2.5 h-2.5 fill-current" />
                </div>
              )}
            </div>
            <span className={`text-[10px] md:text-xs mt-2 transition-colors whitespace-nowrap ${activeId === p.id ? 'text-[#0f172a] dark:text-white font-bold' : 'text-slate-500 font-medium'
              }`}>
              {p.name}
            </span>
          </button>
        ))}
      </div>

      {/* Details Card */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`flex-1 rounded-[1.5rem] p-6 border relative overflow-hidden flex flex-col justify-center shadow-inner ${activePersona.tier === 'Premium'
              ? 'bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-amber-950/40 dark:to-orange-950/20 border-amber-200/50 dark:border-amber-800/30'
              : 'bg-white/80 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/50'
            }`}
        >
          {/* Background Glow */}
          <div className="absolute -top-1/2 -right-1/2 w-full h-full pointer-events-none transform translateZ(0)"
            style={{ backgroundImage: `radial-gradient(circle, ${colorGlow} 0%, transparent 70%)` }} />

          <div className="absolute -bottom-4 -right-4 opacity-[0.04] dark:opacity-[0.06] rotate-12 pointer-events-none transform scale-100 md:scale-110 blur-[0.4px] transition-transform duration-500">
            <activePersona.Icon size={96} />
          </div>

          <div className="relative z-10 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-3">
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold text-[#0f172a] dark:text-white flex items-center gap-3 mb-2 tracking-tight">
                  {activePersona.name}
                  {activePersona.tier === 'Premium' && <Sparkles className="w-5 h-5 text-amber-500 fill-current animate-pulse" />}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-[10px] md:text-xs px-3 py-1 rounded-full font-extrabold border shadow-sm uppercase tracking-wider ${activePersona.tier === 'Free' ? 'border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-450' :
                      activePersona.tier === 'Pro' ? 'border-cyan-200 text-cyan-700 bg-cyan-50 dark:bg-cyan-900/30 dark:border-cyan-800 dark:text-cyan-450' :
                        'border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-450'
                    }`}>
                    {activePersona.tier}
                  </span>
                  <span className="text-[10px] md:text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 font-bold shadow-sm uppercase tracking-wider">
                    {activePersona.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed text-sm font-medium max-w-sm">
              {activePersona.desc}
            </p>

            <div className="grid grid-cols-1 gap-3">
              {activePersona.features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-100 dark:border-slate-800/40 shadow-sm backdrop-blur-md"
                >
                  <div className={`p-1.5 rounded-lg ${activeClasses.bg}`}>
                    <CheckCircle2 className={`w-3.5 h-3.5 ${activeClasses.text}`} />
                  </div>
                  <span className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200">{feat}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Visual: Mobile Voice Interface (Premium, Redesigned, Bottom-Aligned) ---
const MobileVoiceInterface = () => (
  <div className="transform scale-[0.85] sm:scale-95 md:scale-100 origin-bottom relative mx-auto border-slate-900 dark:border-slate-800 bg-[#0f172a] border-[10px] rounded-[2.5rem] md:rounded-[3rem] h-[440px] md:h-[480px] w-[250px] md:w-[280px] shadow-2xl flex flex-col overflow-hidden z-20 translate-y-4 md:translate-y-8">
    {/* Dynamic Island / Notch */}
    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-5 w-24 bg-black rounded-full z-30 flex items-center justify-between px-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-80"></div>
      <div className="w-2 h-2 rounded-full bg-slate-800/80 border border-slate-700/50"></div>
    </div>

    {/* Screen Content - Dark Mode Styled */}
    <div className="flex-1 bg-gradient-to-b from-slate-900 to-[#070b14] overflow-y-auto no-scrollbar pt-12 pb-6 px-4 font-sans text-white flex flex-col">

      {/* Header Status */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          <Crown className="w-3 h-3 fill-current" />
          <span className="text-[9px] font-black uppercase tracking-wider">Pro Suite</span>
        </div>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>

      {/* Neural Voice Selection */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-3 mb-4 shadow-lg backdrop-blur-md">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-teal-500/20 p-1.5 rounded-lg">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            </div>
            <div>
              <h5 className="text-[10px] md:text-[11px] font-bold text-white tracking-wide">Neural Voice</h5>
              <p className="text-[8px] text-teal-400 font-medium">Ultra-Realistic Accent</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[8px] font-bold">UK</div>
            <span className="text-[10px] md:text-xs font-bold text-slate-200">James (British)</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      {/* Animated Audio Stream */}
      <div className="mb-4 bg-slate-950/50 border border-slate-800/60 rounded-2xl py-3 flex flex-col items-center justify-center shadow-inner">
        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2.5">Neural Stream Audio</div>
        <AudioWaveform />
      </div>

      {/* Neon Advanced Sliders */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 shadow-lg backdrop-blur-md mt-auto">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[9px] md:text-[10px] font-bold text-slate-200 uppercase tracking-widest">Fine Tuning</span>
        </div>

        {/* Pitch Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-[9px] text-slate-400 font-medium mb-1.5">
            <span>Pitch</span>
            <span className="font-bold text-emerald-400">1.10x</span>
          </div>
          <div className="relative h-1 bg-slate-900 rounded-full">
            <div className="absolute h-full bg-emerald-500 w-[60%] rounded-full shadow-[0_0_10px_#10b981]"></div>
            <div className="absolute top-1/2 left-[60%] w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-[2.5px] border-emerald-500"></div>
          </div>
        </div>

        {/* Speed Slider */}
        <div>
          <div className="flex justify-between text-[9px] text-slate-400 font-medium mb-1.5">
            <span>Speed</span>
            <span className="font-bold text-teal-400">0.95x</span>
          </div>
          <div className="relative h-1 bg-slate-900 rounded-full">
            <div className="absolute h-full bg-teal-500 w-[45%] rounded-full shadow-[0_0_10px_#14b8a6]"></div>
            <div className="absolute top-1/2 left-[45%] w-3 h-3 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 border-[2.5px] border-teal-500"></div>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Nav Bar (Simulated iPhone Home Indicator) */}
    <div className="bg-[#070b14] h-6 flex justify-center items-end pb-2">
      <div className="w-1/3 h-1 bg-slate-600 rounded-full"></div>
    </div>
  </div>
);

// --- Visual: Enhanced Track Your Growth ---
const TrackGrowth = () => {
  const [key, setKey] = useState(0);

  return (
    <div
      className="bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 w-full max-w-sm mx-auto shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200/60 dark:border-slate-700/60 font-sans relative overflow-hidden cursor-pointer"
      onClick={() => setKey(k => k + 1)}
    >
      {/* Restart Hint */}
      <div className="absolute top-2 right-4 text-[9px] text-slate-450 dark:text-slate-500 uppercase tracking-wider font-semibold opacity-60 hover:opacity-100 transition-opacity">
        Replay
      </div>

      {/* Hardware Accelerated Background Glow */}
      <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[radial-gradient(circle,rgba(20,184,166,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>

      {/* Progress Bar */}
      <div className="mb-6 relative z-10">
        <div className="flex justify-between text-[10px] md:text-xs font-extrabold text-slate-400 dark:text-slate-500 mb-2 px-1 uppercase tracking-wider">
          <span>A1</span><span>A2</span><span>B1</span><span className="text-teal-500 dark:text-teal-400">B2</span><span className="text-[#0f172a] dark:text-white">C1</span><span>C2</span>
        </div>
        <div className="relative h-8 md:h-10 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1 flex items-center shadow-inner">
          {/* Active Pill with spring animation */}
          <motion.div
            key={`pill-${key}`}
            initial={{ left: '0%' }}
            animate={{ left: '68%' }}
            transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.1 }}
            className="absolute top-1 bottom-1 w-10 md:w-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-xl shadow-lg shadow-teal-500/30 z-10 border border-white/20 dark:border-slate-750"
          />
          {/* Base Track */}
          <div className="w-full h-full flex divide-x divide-slate-200/50 dark:divide-slate-700/50">
            <div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div>
          </div>
        </div>
        <div className="text-center mt-3.5">
          <span className="text-slate-500 dark:text-slate-450 font-bold text-xs uppercase tracking-widest">Target: </span>
          <span className="text-[#0f172a] dark:text-white font-black text-sm">Proficient C1</span>
        </div>
      </div>

      {/* Radar Chart Container */}
      <div className="relative w-full aspect-square max-w-[210px] md:max-w-[230px] mx-auto z-10">

        {/* Labels */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 text-center">
          <div className="text-teal-600 dark:text-teal-400 font-black text-xs md:text-sm">95%</div>
          <div className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Pronunciation</div>
        </div>
        <div className="absolute top-[25%] -right-6 md:-right-8 text-center">
          <div className="text-slate-700 dark:text-slate-300 font-black text-xs md:text-sm">74%</div>
          <div className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Vocabulary</div>
        </div>
        <div className="absolute bottom-[10%] -right-2 md:-right-4 text-center">
          <div className="text-teal-600 dark:text-teal-400 font-black text-xs md:text-sm">80%</div>
          <div className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Grammar</div>
        </div>
        <div className="absolute bottom-[10%] -left-2 md:-left-4 text-center">
          <div className="text-slate-700 dark:text-slate-300 font-black text-xs md:text-sm">47%</div>
          <div className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Fluency</div>
        </div>
        <div className="absolute top-[25%] -left-6 md:-left-8 text-center">
          <div className="text-teal-600 dark:text-teal-400 font-black text-xs md:text-sm">81%</div>
          <div className="text-[8px] md:text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Confidence</div>
        </div>

        {/* SVG Chart */}
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-md">
          {/* Grid (Pentagons) */}
          {[20, 40, 60, 80, 100].map((r, i) => (
            <polygon
              key={i}
              points="50,5 90,35 75,90 25,90 10,35"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              transform={`scale(${r / 100})`}
              className="origin-center text-slate-200 dark:text-slate-850"
            />
          ))}

          {/* Data Shape with morph animation */}
          <motion.polygon
            key={`chart-${key}`}
            points="50,10 80,45 70,80 35,75 20,40"
            fill="rgba(45, 212, 191, 0.2)"
            stroke="#14b8a6"
            strokeWidth="2"
            className="filter drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 13, delay: 0.2 }}
            style={{ originX: "50px", originY: "50px" }}
          />

          {/* Data Points */}
          <circle cx="50" cy="10" r="3" fill="#14b8a6" stroke="#fff" strokeWidth="1.5" />
          <circle cx="80" cy="45" r="2.5" fill="#94a3b8" stroke="none" />
          <circle cx="70" cy="80" r="3" fill="#14b8a6" stroke="#fff" strokeWidth="1.5" />
          <circle cx="35" cy="75" r="2.5" fill="#94a3b8" stroke="none" />
          <circle cx="20" cy="40" r="3" fill="#14b8a6" stroke="#fff" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
};

// --- Visual: Correction Depth (Refined UI with typing simulation) ---
const CorrectionDepth = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setShowAnalysis(false);
    const timer = setTimeout(() => {
      setShowAnalysis(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, [key]);

  return (
    <div
      className="space-y-4 w-full cursor-pointer"
      onClick={() => setKey(k => k + 1)}
    >
      {/* Replay Hint */}
      <div className="text-[9px] text-slate-400 dark:text-slate-500 text-right uppercase tracking-wider font-semibold opacity-65 hover:opacity-100 transition-opacity">
        Replay Typing
      </div>

      {/* User Message */}
      <div className="flex gap-3 items-end opacity-90">
        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 dark:text-slate-400 flex-shrink-0">You</div>
        <div className="bg-slate-100 dark:bg-slate-850 px-4 py-2.5 rounded-2xl rounded-bl-none text-sm font-medium text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-slate-800 shadow-sm w-full min-h-[44px] flex items-center">
          <p className="flex items-center flex-wrap">
            <span className={showAnalysis ? "line-through decoration-rose-400 decoration-2 text-slate-400 dark:text-slate-500 transition-colors duration-500" : ""}>
              <TypingText key={key} text="I goed to the store yesterday." delay={0.06} />
            </span>
            {!showAnalysis && <span className="w-1.5 h-4 bg-teal-500 animate-pulse ml-0.5" />}
          </p>
        </div>
      </div>

      <div className="relative pl-11 min-h-[220px] w-full">
        <AnimatePresence>
          {showAnalysis && (
            <>
              {/* Free Tier Correction (Background Layer) */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 0.45, y: -25, scale: 0.95 }}
                exit={{ opacity: 0 }}
                className="absolute left-11 right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm z-10 origin-top"
              >
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Basic Correction</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">I <span className="text-emerald-500 font-bold">went</span> to the store yesterday.</div>
              </motion.div>

              {/* Premium Analysis (Foreground Layer) */}
              <motion.div
                className="relative bg-white dark:bg-slate-800 border border-amber-250/70 dark:border-amber-700/50 p-4 rounded-2xl rounded-tl-none shadow-xl shadow-amber-500/5 z-20 w-full"
                initial={{ y: 20, opacity: 0, scale: 0.98 }}
                animate={{ y: 5, opacity: 1, scale: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 14 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 px-2 py-1 rounded-md border border-amber-200/40 dark:border-amber-800/40">
                    <Crown className="w-3 h-3 fill-current" /> Pro Analysis
                  </div>
                </div>
                <div className="text-sm font-semibold text-[#0f172a] dark:text-slate-200 mb-3 leading-relaxed">
                  I <span className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-250/40 dark:border-emerald-800/40">went</span> to the store yesterday.
                </div>
                <div className="text-[11px] md:text-xs text-slate-650 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-850 leading-relaxed font-medium">
                  <strong className="text-slate-950 dark:text-white block mb-1">Why?</strong>
                  "Goed" is incorrect because "go" is an irregular verb. The correct past tense is <strong>"went"</strong>. Use it for completed past actions.
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Visual: Pronunciation Scoring (MFA & Whisper Integration Preview) ---
const PronunciationPreview = () => {
  return (
    <div className="relative w-full h-full min-h-[400px] md:min-h-[480px] flex items-center justify-center perspective-[1200px]" style={{ perspective: '1200px' }}>
      {/* 3D Tilted Card - Now much larger and adaptive */}
      <motion.div
        className="w-[90%] max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200/50 dark:border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative"
        initial={{ rotateX: 15, rotateY: -10, scale: 0.95 }}
        animate={{ rotateX: [15, 12, 15], rotateY: [-10, -6, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center justify-between mb-8 border-b-2 border-slate-100/50 dark:border-slate-800/50 pb-5" style={{ transform: 'translateZ(25px)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/40 dark:to-blue-900/20 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-700/50 shadow-inner">
              <Ear className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="text-sm md:text-base font-black text-slate-800 dark:text-white tracking-tight">Speech Analysis</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">Listening Engine Active</span>
              </div>
            </div>
          </div>
          <div className="w-24 opacity-80"><AudioWaveform /></div>
        </div>

        <div className="text-xl md:text-3xl font-medium leading-[1.6] text-slate-400 dark:text-slate-500 mt-6" style={{ transform: 'translateZ(40px)' }}>
          The <span className="text-slate-800 dark:text-slate-200 font-bold bg-slate-100 dark:bg-slate-800/60 rounded-lg px-2 transition-colors duration-300 shadow-sm">quick</span> brown fox
          <span className="relative inline-block mx-2 group">
            <span className="text-rose-600 dark:text-rose-400 font-black bg-rose-50 dark:bg-rose-950/40 rounded-lg px-2 border-b-4 border-rose-300 dark:border-rose-800 cursor-pointer transition-all hover:bg-rose-100 dark:hover:bg-rose-900/60">
              jumps
            </span>

            {/* 3D Floating Error Tag - Refined Size and Typography */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: -65 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100, damping: 10 }}
              className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-600 text-white text-xs md:text-sm font-black px-4 py-2.5 rounded-2xl shadow-2xl shadow-rose-600/40 z-20 pointer-events-none border-2 border-rose-400/50"
              style={{ transform: 'translateZ(70px)' }}
            >
              /dʒʌmps/ <span className="text-rose-200 font-medium ml-1">not "jamps"</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-600 rotate-45 border-b-2 border-r-2 border-rose-400/50"></div>
            </motion.div>
          </span>
          over the lazy dog.
        </div>

        {/* Floating Scores - More balanced placements */}
        <motion.div
          className="absolute -right-8 -bottom-8 bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-5 rounded-[2rem] shadow-2xl shadow-emerald-500/40 border-[3px] border-white dark:border-slate-800"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 1.2, type: "spring" }}
          style={{ transform: 'translateZ(80px)' }}
        >
          <div className="text-[10px] md:text-xs font-black opacity-90 uppercase tracking-widest mb-1 text-emerald-50">Overall Score</div>
          <div className="text-4xl md:text-5xl font-black tracking-tighter">92<span className="text-2xl text-emerald-100 opacity-80">%</span></div>
        </motion.div>

        <motion.div
          className="absolute -left-8 top-[35%] bg-gradient-to-br from-amber-400 to-orange-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl shadow-amber-500/30 border-[3px] border-white dark:border-slate-800"
          initial={{ scale: 0, x: -30 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: 1.5, type: "spring" }}
          style={{ transform: 'translateZ(50px)' }}
        >
          <div className="text-[10px] md:text-xs font-black uppercase tracking-wider mb-0.5 text-amber-50">Pitch & Tone</div>
          <div className="text-sm md:text-base font-bold">Native-Like</div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// --- Visual: Global Practice Rooms (Audio & Video SFU Interface) ---
const PracticeRoomPreview = () => {
  return (
    <div className="relative w-full h-full min-h-[460px] md:min-h-[500px] flex items-center justify-center rounded-[2.5rem] overflow-hidden bg-[#020617] shadow-[0_30px_60px_rgba(0,0,0,0.4)] group perspective-[1200px]" style={{ perspective: '1200px' }}>

      {/* Ambient glow to frame the vector artwork */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.22),transparent_40%),radial-gradient(circle_at_bottom,rgba(14,165,233,0.18),transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.94),rgba(2,6,23,0.99))]" />
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-30 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,white,transparent_92%)]" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(2,6,23,0.18)_100%)]" />

      {/* Hero artwork rendered as contained vector-style illustration */}
      <motion.div
        className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none"
        animate={{ y: [0, -10, 0], scale: [1, 1.015, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative w-[92%] h-[92%] max-w-[680px] max-h-[680px] flex items-center justify-center">
          <div className="absolute inset-10 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="absolute inset-[10%] rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-cyan-300/10 blur-2xl opacity-70" />
          <img
            src="/practice.png"
            alt="Practice room hero preview"
            className="relative z-10 w-full h-full object-contain select-none drop-shadow-[0_30px_60px_rgba(34,211,238,0.35)] [filter:contrast(1.12)_saturate(1.18)_brightness(1.04)] [image-rendering:auto]"
            draggable={false}
          />
        </div>
      </motion.div>

      {/* Soft light sweep for depth */}
      <div className="absolute inset-0 z-[3] pointer-events-none bg-[linear-gradient(115deg,transparent_20%,rgba(255,255,255,0.1)_50%,transparent_80%)] opacity-55 mix-blend-screen group-hover:opacity-75 transition-opacity duration-700" />

      {/* Floating room card */}
      <motion.div
        className="absolute right-4 bottom-4 md:right-6 md:bottom-6 z-[4] w-[210px] md:w-[240px] rounded-[1.75rem] border border-white/20 bg-slate-950/55 backdrop-blur-xl p-4 text-white shadow-[0_24px_50px_rgba(0,0,0,0.45)]"
        initial={{ opacity: 0, y: 18, scale: 0.94, rotate: -4 }}
        animate={{ opacity: 1, y: [0, -8, 0], scale: 1, rotate: [1, -1, 1] }}
        transition={{
          opacity: { duration: 0.35 },
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 0.35 },
          rotate: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-200/80 font-black">Live room</div>
            <div className="mt-1 text-sm font-bold text-white">Global Practice Hub</div>
          </div>
          <div className="relative h-11 w-11 rounded-2xl bg-cyan-400/15 border border-cyan-300/25 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-cyan-300/20 blur-lg" />
            <Globe2 className="relative z-10 h-5 w-5 text-cyan-200" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-300/80 font-bold">Learners online</div>
            <div className="text-lg font-black tracking-tight">128</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-300/80 font-bold">Latency</div>
            <div className="text-sm font-bold text-emerald-300">18 ms</div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-200/85">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(74,222,128,0.8)]" />
          Topic room: IELTS • Debates • Daily speaking
        </div>
      </motion.div>
    </div>
  );
};

// --- Walkthrough Timeline Data Array ---
const steps = [
  {
    title: 'Adaptive AI Tutors',
    subtitle: 'Meet Your Custom Tutors',
    desc: 'Practice real conversations with five unique AI personas matching your current speaking goals, career fields, and skill level.',
    features: [
      '5 distinct AI characters from casual chats to strict IELTS coaches',
      'Instant accent, vocabulary, and grammar adjustments',
      'Customized welcome messages and personalized dialogue histories'
    ],
    accentColor: 'emerald' as const,
    icon: Brain,
    preview: () => <PersonalityShowcase />
  },
  {
    title: 'Studio Voice Controls',
    subtitle: 'Neural Accent Tuning',
    desc: 'Fine-tune pronunciation and listening skills. Adjust speaking speeds, pitch depths, and toggle regional native accents.',
    features: [
      'Neural Voice Engine delivering human-like speaking cadence',
      'Explicit slider controls for pitch adjustments and speech speed',
      'Realistic accents matching UK, US, and Australian English'
    ],
    accentColor: 'teal' as const,
    icon: Mic,
    preview: () => <MobileVoiceInterface />
  },
  {
    title: 'Pronunciation Scoring',
    subtitle: 'Real-Time MFA Engine',
    desc: 'Visually track your speech accuracy. Our engine highlights mispronounced words instantly, offering phonetic breakdowns and scoring.',
    features: [
      'Phonetic alignment using Montreal Forced Aligner',
      'Instant color-coded word highlights for mistakes',
      'Detailed pitch and tone confidence scoring'
    ],
    accentColor: 'indigo' as const,
    icon: Ear,
    preview: () => <PronunciationPreview />
  },
  {
    title: 'Intelligent Correction',
    subtitle: 'Deep Grammar Breakdowns',
    desc: 'Get immediate corrective explanations. Learn the syntactic rules and linguistic reasoning behind every error.',
    features: [
      'Subtle spelling and phrasing corrections in real-time',
      'In-depth Pro analysis detailing the structural "why"',
      'Clear, interactive rules for irregular verbs and grammar constructs'
    ],
    accentColor: 'amber' as const,
    icon: Sparkles,
    preview: () => <CorrectionDepth />
  },
  {
    title: 'Track Your Growth',
    subtitle: '5-Dimension Fluency Reports',
    desc: 'Our engine tracks your speaking dimensions against the standardized CEFR scale. Watch your confidence and scoring climb.',
    features: [
      'Live pentagon radar reports tracking pronunciation & vocabulary',
      'Real-time CEFR classification levels (A1 to C2)',
      'XP tracking, streak multipliers, and weekly milestones'
    ],
    accentColor: 'cyan' as const,
    icon: Activity,
    preview: () => <TrackGrowth />
  },
  {
    title: 'Global Practice Rooms',
    subtitle: 'Live Multi-User Audio',
    desc: 'Join immersive audio rooms powered by Mediasoup. Practice live with learners worldwide in specialized topic rooms.',
    features: [
      'Ultra-low latency SFU audio streaming',
      'Topic-based rooms (e.g., IELTS, Debates)',
      'Connect with thousands of peers globally'
    ],
    accentColor: 'rose' as const,
    icon: Globe2,
    preview: () => <PracticeRoomPreview />
  }
];

const Features = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- Automate Autoplay Slideshow Stepper (8 seconds per step) ---
  useEffect(() => {
    if (!isPlaying) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveStep((currentStep) => (currentStep + 1) % steps.length);
          return 0;
        }
        return prev + 1.25; // Advances roughly every 8 seconds (100 / (1.25 * 10) = 8s)
      });
    }, 100);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, activeStep]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
  };

  if (!isMounted) return null;

  const currentStep = steps[activeStep];
  const colorGlow = currentStep.accentColor === 'emerald' ? 'rgba(16, 185, 129, 0.06)' :
    currentStep.accentColor === 'teal' ? 'rgba(20, 184, 166, 0.06)' :
      currentStep.accentColor === 'amber' ? 'rgba(245, 158, 11, 0.06)' :
        currentStep.accentColor === 'indigo' ? 'rgba(99, 102, 241, 0.06)' :
          currentStep.accentColor === 'rose' ? 'rgba(244, 63, 94, 0.06)' :
            'rgba(6, 182, 212, 0.06)';

  return (
    <section id="features" className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] relative overflow-hidden transition-colors duration-500 ease-in-out font-sans scroll-mt-24 lg:scroll-mt-32">

      {/* Global CSS to hide scrollbars */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* --- Optimized Background Elements (No performance degrading blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-[10%] left-[20%] w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${colorGlow} 0%, transparent 60%)`, transform: 'translateZ(0)' }} />
      </div>

      <div className="max-w-[1440px] px-6 sm:px-8 lg:px-12 mx-auto relative z-10">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/65 shadow-sm backdrop-blur-sm transition-colors duration-500">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Interactive Walkthrough</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[#0f172a] dark:text-white tracking-tight leading-[1.1]">
              Advanced AI.<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2">Human Experience.</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Explore our core learning engine below. Hover over previews to pause the walkthrough, or click any step to explore manually.
            </p>
          </motion.div>
        </div>

        {/* Walkthrough Layout Split-Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto items-stretch">

          {/* LEFT: Stepper Timeline Panel (40% width) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">

            {/* Horizontal Timeline Scroll on Mobile & Tablet */}
            <div className="flex lg:hidden overflow-x-auto no-scrollbar gap-3 pb-3 border-b border-slate-200/50 dark:border-slate-800/40">
              {steps.map((step, idx) => {
                const colors = stepColorClasses[step.accentColor];
                const isActive = idx === activeStep;
                return (
                  <button
                    key={idx}
                    onClick={() => handleStepClick(idx)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-xs font-bold transition-all duration-300 flex-shrink-0 ${isActive
                        ? `${colors.bg} ${colors.text} ${colors.border} shadow-sm scale-102`
                        : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 text-slate-500 dark:text-slate-455'
                      }`}
                  >
                    <step.icon className="w-3.5 h-3.5" />
                    <span>{step.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Vertical timeline stepper (Desktop only) */}
            <div className="hidden lg:flex flex-col space-y-4">
              {steps.map((step, idx) => {
                const colors = stepColorClasses[step.accentColor];
                const isActive = idx === activeStep;
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setIsPlaying(false)}
                    onMouseLeave={() => setIsPlaying(true)}
                    onClick={() => handleStepClick(idx)}
                    className={`relative p-5 rounded-[1.5rem] border cursor-pointer transition-all duration-400 group flex items-start gap-4 select-none ${isActive
                        ? `${colors.bg} ${colors.border} shadow-md shadow-slate-200/5 dark:shadow-none`
                        : 'bg-white/30 dark:bg-slate-900/10 border-transparent hover:bg-white/60 dark:hover:bg-slate-900/40 hover:border-slate-200/40 dark:hover:border-slate-800/50'
                      }`}
                  >
                    {/* Stepper Side indicator */}
                    <div className="flex flex-col items-center h-full relative">
                      <div className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 ${isActive
                          ? `${colors.bg} ${colors.text} ${colors.border} scale-110 shadow-sm`
                          : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800 text-slate-450 dark:text-slate-500 group-hover:scale-105'
                        }`}>
                        <step.icon className="w-4 h-4" />
                      </div>

                      {/* Vertical line connector */}
                      {idx < steps.length - 1 && (
                        <div className="absolute top-9 bottom-[-28px] w-[2px] bg-slate-200/60 dark:bg-slate-800/60 pointer-events-none" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base font-extrabold mb-1 tracking-tight transition-colors duration-300 ${isActive ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
                        }`}>
                        {step.title}
                      </h3>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isActive ? colors.text : 'text-slate-400 dark:text-slate-500'
                        }`}>
                        {step.subtitle}
                      </p>

                      {/* Loading line indicator */}
                      {isActive && (
                        <div className="h-0.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                          <motion.div
                            className={`h-full ${colors.progress}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Feature Description Card (Left Bottom) */}
            <div className="p-6 md:p-8 rounded-[1.5rem] bg-white/40 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/40 backdrop-blur-md shadow-sm">
              <h3 className="text-xl md:text-2xl font-black text-[#0f172a] dark:text-white mb-2.5 tracking-tight flex items-center gap-2.5">
                <currentStep.icon className={`w-5 h-5 ${stepColorClasses[currentStep.accentColor].text}`} />
                {currentStep.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-[15px] font-medium leading-relaxed mb-6">
                {currentStep.desc}
              </p>

              <ul className="space-y-3">
                {currentStep.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start text-xs font-bold text-slate-650 dark:text-slate-300 leading-tight">
                    <CheckCircle2 className={`w-3.5 h-3.5 ${stepColorClasses[currentStep.accentColor].text} mr-2.5 mt-0.5 flex-shrink-0`} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex gap-3">
                <Button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className={`rounded-full h-11 px-5 font-bold shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0 text-white flex items-center gap-2 ${stepColorClasses[currentStep.accentColor].progress}`}
                >
                  Next Feature <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

          </div>

          {/* RIGHT: Visual Rendering Sandbox (60% width) */}
          <div
            className="lg:col-span-7 flex items-center justify-center w-full min-h-[460px] md:min-h-[500px]"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 25, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -25, scale: 0.96 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex justify-center"
              >
                {currentStep.preview()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;