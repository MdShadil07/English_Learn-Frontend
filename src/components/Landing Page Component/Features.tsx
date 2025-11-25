import React, { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Mic, Zap, Activity, 
  Crown, Sparkles, Volume2, Settings, CheckCircle2, Lock,
  BarChart3, Globe, Smartphone, ArrowRight, ArrowUpRight, BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Utility: Mouse Spotlight Card ---
const SpotlightCard = ({ children, className = "", spotColor = "rgba(16, 185, 129, 0.15)" }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              ${spotColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
};

// --- Visual: AI Personality Selector (Enhanced 3D Avatars) ---
const personalities = [
  { 
    id: 'alex', 
    name: 'Alex', 
    role: 'Casual Chat', 
    tier: 'Free', 
    color: 'emerald',
    avatar: '/logo.svg',
    desc: 'Great for daily conversation practice. Provides minor corrections on the fly.',
    features: ['Casual Tone', 'Minor Corrections', 'Basic Vocabulary']
  },
  { 
    id: 'nova', 
    name: 'Nova', 
    role: 'Professional', 
    tier: 'Pro', 
    color: 'blue',
    avatar: '/logo.svg',
    desc: 'Focused on business English and formal structure. Ideal for workplace prep.',
    features: ['Formal Tone', 'Grammar Precision', 'Business Terms']
  },
  { 
    id: 'liam', 
    name: 'Liam', 
    role: 'Grammar Coach', 
    tier: 'Pro', 
    color: 'indigo',
    avatar: '/logo.svg',
    desc: 'Stops to explain rules. Perfect if you want to understand the "why" behind mistakes.',
    features: ['Rule Explanations', 'Structure Drills', 'Detailed Feedback']
  },
  { 
    id: 'coach', 
    name: 'Coach Taylor', 
    role: 'Intensive', 
    tier: 'Premium', 
    color: 'amber',
    avatar: '/logo.svg',
    desc: 'High-intensity practice with deep analysis. Corrects major & minor errors instantly.',
    features: ['Deep Analysis', 'Strict Corrections', 'Unlimited Chats']
  },
  { 
    id: 'sophia', 
    name: 'Sophia', 
    role: 'Academic', 
    tier: 'Premium', 
    color: 'rose',
    avatar: '/logo.svg',
    desc: 'Prepares you for IELTS/TOEFL with complex sentence structures and advanced vocabulary.',
    features: ['Academic Vocab', 'Complex Syntax', 'Essay Review']
  }
];

const PersonalityShowcase = () => {
  const [activeId, setActiveId] = useState('coach');
  const activePersona = personalities.find(p => p.id === activeId);

  return (
    <div className="flex flex-col h-full">
      {/* Avatar Selector - Scrollable on Mobile */}
      <div className="flex md:justify-between items-center mb-6 md:mb-8 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-x-auto no-scrollbar gap-2 md:gap-0">
        {personalities.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`relative group flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 flex-shrink-0 min-w-[60px] md:min-w-0 ${activeId === p.id ? 'bg-white dark:bg-slate-700 shadow-lg scale-105 md:scale-110 z-10' : 'hover:bg-white/50 dark:hover:bg-slate-700/50 opacity-70 hover:opacity-100'}`}
          >
            <div className={`relative w-10 h-10 md:w-14 md:h-14 rounded-full p-1 transition-transform duration-300 ${
              activeId === p.id ? `scale-110 bg-${p.color}-100 dark:bg-${p.color}-900/50` : 'grayscale hover:grayscale-0'
            }`}>
              <img 
                src={p.avatar} 
                alt={p.name} 
                className="w-full h-full object-contain drop-shadow-sm" 
              />
              {p.tier === 'Premium' && (
                <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-amber-400 text-white p-0.5 md:p-1 rounded-full shadow-sm border-2 border-white dark:border-slate-800">
                  <Crown className="w-2 h-2 md:w-2.5 md:h-2.5 fill-current" />
                </div>
              )}
            </div>
            <span className={`text-[9px] md:text-[10px] mt-2 font-medium transition-colors whitespace-nowrap ${activeId === p.id ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500'}`}>{p.name}</span>
          </button>
        ))}
      </div>

      {/* Details Card */}
      <AnimatePresence mode='wait'>
        <motion.div 
          key={activeId}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={`flex-1 rounded-3xl p-5 md:p-6 border relative overflow-hidden flex flex-col justify-center ${
            activePersona.tier === 'Premium' 
              ? 'bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/30'
              : 'bg-slate-50/80 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700/50'
          }`}
        >
          {/* Background Decoration */}
          <div className={`absolute -top-10 -right-10 w-48 h-48 bg-${activePersona.color}-500/10 rounded-full blur-3xl pointer-events-none`}></div>
          
          {/* 3D Avatar Large Preview (Faded Background) */}
          <img 
            src={activePersona.avatar} 
            alt="" 
            className="absolute -bottom-4 -right-4 w-24 h-24 md:w-32 md:h-32 opacity-10 rotate-12 pointer-events-none grayscale" 
          />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-2">
              <div>
                <h4 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
                  {activePersona.name}
                  {activePersona.tier === 'Premium' && <Sparkles className="w-5 h-5 text-amber-500 fill-current animate-pulse" />}
                </h4>
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-[10px] md:text-xs px-2.5 py-1 rounded-full font-bold border shadow-sm ${
                    activePersona.tier === 'Free' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                    activePersona.tier === 'Pro' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                    'border-amber-200 text-amber-700 bg-amber-50'
                  }`}>
                    {activePersona.tier}
                  </span>
                  <span className="text-[10px] md:text-xs px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 font-medium shadow-sm">
                    {activePersona.role}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed text-sm font-medium">
              {activePersona.desc}
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {activePersona.features.map((feat, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/60 p-2 md:p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm backdrop-blur-sm"
                >
                  <div className={`p-1 rounded-full bg-${activePersona.color}-100 dark:bg-${activePersona.color}-900/30`}>
                    <CheckCircle2 className={`w-3 h-3 md:w-3.5 md:h-3.5 text-${activePersona.color}-600 dark:text-${activePersona.color}-400`} />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200">{feat}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// --- Visual: Mobile Voice Interface (Premium) ---
const MobileVoiceInterface = () => (
  <div className="transform scale-90 md:scale-100 origin-top relative mx-auto border-slate-800 bg-slate-900 border-[8px] rounded-[2.5rem] h-[420px] md:h-[480px] w-[260px] md:w-[280px] shadow-2xl flex flex-col overflow-hidden">
    {/* Notch */}
    <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 z-20 rounded-b-xl w-28 md:w-32 mx-auto"></div>
    
    {/* Screen Content */}
    <div className="flex-1 bg-slate-50 overflow-y-auto no-scrollbar pt-8 pb-4 px-3 md:px-4 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
          <Crown className="w-3 h-3 fill-current" />
          <span className="text-[10px] font-bold uppercase">Premium Member</span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium bg-slate-100 px-2 py-1 rounded-full">Active</span>
      </div>

      {/* AI Match Card */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 shadow-sm">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-1.5 rounded-lg">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <h5 className="text-[10px] md:text-xs font-bold text-slate-800">AI Personality Match</h5>
              <p className="text-[8px] md:text-[9px] text-emerald-600">Recommended for your style</p>
            </div>
          </div>
          <span className="text-[8px] bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Premium</span>
        </div>
        <div className="bg-white border border-emerald-200 rounded-lg p-2 text-center shadow-sm">
          <span className="text-[9px] md:text-[10px] font-semibold text-emerald-700">Microsoft Zira - English (US)</span>
        </div>
      </div>

      {/* Presets */}
      <div className="mb-4">
        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Presets</h5>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-sm hover:border-indigo-300 transition-colors cursor-pointer">
            <Volume2 className="w-3 h-3 text-indigo-500" />
            <span className="text-[9px] md:text-[10px] font-medium text-slate-700">Natural Spkr</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-sm hover:border-amber-300 transition-colors cursor-pointer">
            <Zap className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] md:text-[10px] font-medium text-slate-700">Native Speed</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-2 flex items-center gap-2 shadow-sm hover:border-blue-300 transition-colors cursor-pointer">
            <BookOpen className="w-3 h-3 text-blue-500" />
            <span className="text-[9px] md:text-[10px] font-medium text-slate-700">Story Teller</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-center gap-2 border-dashed cursor-pointer hover:bg-slate-100">
             <span className="text-[9px] md:text-[10px] text-slate-400">+ Custom</span>
          </div>
        </div>
      </div>

      {/* Advanced Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <Settings className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] md:text-xs font-bold text-slate-700">Advanced Controls</span>
          </div>
          <span className="text-[8px] bg-slate-900 text-white px-1.5 py-0.5 rounded">Premium</span>
        </div>

        {/* Pitch Slider */}
        <div className="mb-3">
          <div className="flex justify-between text-[9px] text-slate-500 mb-1">
            <span>Pitch</span>
            <span className="font-bold text-emerald-600">1.10</span>
          </div>
          <div className="relative h-1.5 bg-slate-100 rounded-full">
            <div className="absolute h-full bg-slate-800 w-[60%] rounded-full"></div>
            <div className="absolute top-1/2 left-[60%] w-3 h-3 bg-white border-2 border-slate-800 rounded-full -translate-x-1/2 -translate-y-1/2 shadow cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-300 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Volume Slider */}
        <div>
          <div className="flex justify-between text-[9px] text-slate-500 mb-1">
            <span>Volume</span>
            <span className="font-bold text-emerald-600">100%</span>
          </div>
          <div className="relative h-1.5 bg-slate-100 rounded-full">
            <div className="absolute h-full bg-indigo-500 w-[90%] rounded-full"></div>
            <div className="absolute top-1/2 left-[90%] w-3 h-3 bg-white border-2 border-indigo-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow cursor-pointer hover:scale-110 transition-transform"></div>
          </div>
        </div>
      </div>

    </div>
    
    {/* Bottom Nav Hint */}
    <div className="bg-white border-t border-slate-200 p-3 flex justify-around items-center text-slate-300">
        <div className="w-10 h-1 bg-slate-300 rounded-full"></div>
    </div>
  </div>
);

// --- Visual: Track Your Growth (Light Mode Exact Replica) ---
const TrackGrowth = () => (
  <div className="bg-white rounded-3xl p-4 md:p-6 w-full max-w-sm mx-auto shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-slate-100 font-sans">
    
    {/* Progress Bar */}
    <div className="mb-6 md:mb-8">
      <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 mb-2 px-1">
        <span>A1</span><span>A2</span><span>B1</span><span>B2</span><span className="text-slate-900">C1</span><span>C2</span>
      </div>
      <div className="relative h-8 md:h-10 bg-slate-100 rounded-2xl p-1 flex items-center">
        {/* Active Pill */}
        <div className="absolute right-[16%] top-1 bottom-1 w-10 md:w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg shadow-purple-500/30 z-10">
           {/* Particles Effect CSS */}
           <style>{`
             .particle { position: absolute; background: white; border-radius: 50%; opacity: 0.8; animation: float-particle 2s infinite; }
             @keyframes float-particle { 0% { transform: translateY(0) scale(1); opacity: 0.8; } 100% { transform: translateY(-20px) scale(0); opacity: 0; } }
           `}</style>
           <div className="particle w-1 h-1 top-0 left-2" style={{animationDelay: '0s'}}></div>
           <div className="particle w-0.5 h-0.5 top-2 right-2" style={{animationDelay: '0.5s'}}></div>
        </div>
        {/* Base Track */}
        <div className="w-full h-full flex divide-x divide-slate-200">
           <div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div><div className="flex-1"></div>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className="text-slate-500 font-medium text-sm md:text-base">Proficient </span>
        <span className="text-blue-600 font-bold text-base md:text-lg">C1</span>
      </div>
    </div>

    {/* Radar Chart */}
    <div className="relative w-full aspect-square max-w-[220px] md:max-w-[240px] mx-auto">
      
      {/* Labels */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-center">
        <div className="text-blue-600 font-bold text-xs md:text-sm">95%</div>
        <div className="text-[9px] md:text-[10px] text-slate-400">Pronunciation</div>
      </div>
      <div className="absolute top-[25%] -right-6 md:-right-8 text-center">
        <div className="text-slate-700 font-bold text-xs md:text-sm">74%</div>
        <div className="text-[9px] md:text-[10px] text-slate-400">Vocabulary</div>
      </div>
      <div className="absolute bottom-[15%] -right-2 md:-right-4 text-center">
        <div className="text-blue-600 font-bold text-xs md:text-sm">80%</div>
        <div className="text-[9px] md:text-[10px] text-slate-400">Grammar</div>
      </div>
      <div className="absolute bottom-[15%] -left-2 md:-left-4 text-center">
        <div className="text-slate-700 font-bold text-xs md:text-sm">47%</div>
        <div className="text-[9px] md:text-[10px] text-slate-400">Fluency</div>
      </div>
      <div className="absolute top-[25%] -left-6 md:-left-8 text-center">
        <div className="text-blue-600 font-bold text-xs md:text-sm">81%</div>
        <div className="text-[9px] md:text-[10px] text-slate-400">Filler Words</div>
      </div>

      {/* SVG Chart */}
      <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
        {/* Grid (Pentagons) */}
        {[20, 40, 60, 80, 100].map((r, i) => (
          <polygon 
            key={i}
            points="50,5 90,35 75,90 25,90 10,35" 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="1"
            transform={`scale(${r/100})`}
            className="origin-center"
          />
        ))}
        
        {/* Data Shape */}
        <polygon 
          points="50,10 80,45 70,80 35,75 20,40" 
          fill="rgba(59, 130, 246, 0.1)" 
          stroke="#3b82f6" 
          strokeWidth="2"
          className="filter drop-shadow-md"
        />
        
        {/* Data Points */}
        <circle cx="50" cy="10" r="2" fill="white" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="80" cy="45" r="2" fill="#94a3b8" stroke="none" />
        <circle cx="70" cy="80" r="2" fill="white" stroke="#3b82f6" strokeWidth="2" />
        <circle cx="35" cy="75" r="2" fill="#94a3b8" stroke="none" />
        <circle cx="20" cy="40" r="2" fill="white" stroke="#3b82f6" strokeWidth="2" />
      </svg>
    </div>
  </div>
);

// --- Visual: Correction Depth (Preserved from previous) ---
const CorrectionDepth = () => (
  <div className="space-y-3">
    <div className="flex gap-3 items-center opacity-60">
      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] md:text-[10px]">Me</div>
      <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-lg text-xs text-slate-500 line-through decoration-red-400 decoration-2">
        I goed to the store.
      </div>
    </div>
    <div className="relative pl-10 md:pl-11">
      <div className="absolute top-0 left-10 md:left-11 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-sm z-10 transform scale-95 opacity-50 origin-top">
        <div className="text-xs font-bold text-slate-400 mb-1">Free Correction</div>
        <div className="text-sm text-slate-700 dark:text-slate-300">I <span className="text-emerald-500 font-bold">went</span> to the store.</div>
      </div>
      <motion.div 
        className="relative bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/30 p-3 rounded-lg shadow-lg z-20"
        initial={{ y: 10, opacity: 0 }}
        whileInView={{ y: 20, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Crown className="w-3 h-3" /> Premium Analysis
          </div>
        </div>
        <div className="text-sm text-slate-800 dark:text-slate-200 mb-2">
          I <span className="text-emerald-500 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-1 rounded">went</span> to the store.
        </div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded border border-slate-100 dark:border-slate-700">
          <strong>Why?</strong> "Goed" is incorrect. The past tense of "go" is irregular. Use "went" for completed past actions.
        </div>
      </motion.div>
    </div>
  </div>
);

const Features = () => {
  return (
    <section className="py-12 md:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      
      <div className="container px-4 mx-auto relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-slate-900 dark:text-white tracking-tight"
          >
            Advanced AI. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Human Personality.</span>
          </motion.h2>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Experience the next generation of language learning with AI personalities that adapt to your specific goals, from casual chat to academic mastery.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          
          {/* Feature 1: AI Personalities (Wide) */}
          <SpotlightCard className="md:col-span-2 lg:col-span-2 rounded-3xl p-5 md:p-8 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-slate-800/50" spotColor="rgba(16, 185, 129, 0.1)">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-[10px] md:text-xs font-bold uppercase tracking-wider">5 Personalities</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">Meet Your Perfect Tutor</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Switch instantly between personalities. Start with <span className="font-semibold text-emerald-600">Alex (Free)</span> for casual practice, or unlock <span className="font-semibold text-amber-500">Coach Taylor</span> for intensive correction.
              </p>
            </div>
            {/* Interactive Component */}
            <div className="relative z-20">
              <PersonalityShowcase />
            </div>
          </SpotlightCard>

          {/* Feature 2: Voice Control (Tall - Mobile UI) */}
          <SpotlightCard className="md:col-span-1 lg:col-span-1 md:row-span-2 rounded-3xl p-0 bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center overflow-hidden" spotColor="rgba(99, 102, 241, 0.15)">
            <div className="pt-6 md:pt-8 px-6 md:px-8 w-full text-center z-10">
              <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">Premium Voice Suite</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-4 md:mb-6">
                Fine-tune pitch, speed, and accent with professional controls.
              </p>
            </div>
            <div className="relative w-full flex justify-center pb-6 md:pb-8">
              <MobileVoiceInterface />
            </div>
          </SpotlightCard>

          {/* Feature 3: Correction Depth (Wide) */}
          <SpotlightCard className="md:col-span-1 lg:col-span-2 rounded-3xl p-5 md:p-8" spotColor="rgba(245, 158, 11, 0.1)">
             <div className="flex flex-col md:flex-row gap-6 md:gap-8">
               <div className="md:w-1/2">
                 <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                   <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                 </div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-2">Intelligent Correction Depth</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                   Free users get gentle nudges. Premium users get deep linguistic breakdowns explaining the <em>"why"</em> behind every mistake.
                 </p>
                 <ul className="space-y-2 mt-4">
                   <li className="flex items-center text-xs text-slate-700 dark:text-slate-300">
                     <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-2" /> Minor error detection (All Tiers)
                   </li>
                   <li className="flex items-center text-xs text-slate-700 dark:text-slate-300">
                     <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mr-2" /> Deep grammar logic (Premium)
                   </li>
                   <li className="flex items-center text-xs text-slate-700 dark:text-slate-300">
                     <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 mr-2" /> Alternative phrasing suggestions (Premium)
                   </li>
                 </ul>
               </div>
               <div className="md:w-1/2 relative min-h-[160px] md:min-h-[180px] flex items-center">
                 <div className="absolute inset-0 bg-amber-500/5 rounded-full blur-3xl"></div>
                 <div className="w-full">
                    <CorrectionDepth />
                 </div>
               </div>
             </div>
          </SpotlightCard>

          {/* Feature 4: Track Your Growth (Large Centerpiece) */}
          <SpotlightCard className="md:col-span-2 lg:col-span-3 rounded-3xl p-6 md:p-8 bg-slate-50 dark:bg-slate-900" spotColor="rgba(59, 130, 246, 0.1)">
             <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
               <div className="md:w-1/3 text-center md:text-left">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 md:mb-6 mx-auto md:mx-0">
                   <Activity className="w-5 h-5 md:w-6 md:h-6" />
                 </div>
                 <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3">Track Your Growth</h3>
                 <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm md:text-base">
                   Our advanced analytics engine tracks 5 key dimensions of fluency. Watch your CEFR level climb from A1 to C2 with visual progress reports.
                 </p>
                 <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20 text-xs md:text-sm">
                   View Sample Report <ArrowRight className="ml-2 w-3 h-3 md:w-4 md:h-4" />
                 </Button>
               </div>
               
               <div className="md:w-2/3 w-full flex justify-center">
                  <TrackGrowth />
               </div>
             </div>
          </SpotlightCard>

        </div>
      </div>
    </section>
  );
};

export default Features;