import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Globe,
  Mic,
  Video,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Headphones,
  Signal,
  Settings2,
  Sparkles,
  MoreHorizontal,
  Activity,
  CheckCircle2,
  Volume2,
  MonitorUp,
  PhoneOff,
  Zap,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility Function ---
function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'emerald';
  size?: 'default' | 'lg' | 'icon';
}

// --- UI Components ---
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg',
    outline: 'border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/25 shadow-lg',
  } as const;
  const sizes = {
    default: 'h-11 px-6 py-2 text-sm',
    lg: 'h-14 rounded-full px-8 text-base',
    icon: 'h-10 w-10',
  } as const;
  return (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none active:scale-95', variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';
 
const Badge = ({ children, variant, className }: { children: React.ReactNode, variant?: string, className?: string }) => (
  <span className={cn(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold overflow-hidden whitespace-nowrap border border-slate-200 dark:border-slate-800",
    variant === 'emerald' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-300",
    className
  )}>
    {children}
  </span>
);

// --- Sub-Components for Visuals ---

const AudioWave = () => (
  <div className="flex items-center justify-center gap-[2px] h-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-emerald-400 rounded-full"
        animate={{ height: ['4px', '12px', '6px', '10px', '4px'] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const ACTIVE_SPEAKERS = [
  { id: 1, name: "Yuki", flag: "🇯🇵", location: "Japan", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80", isSpeaking: true, latency: "42ms" },
  { id: 2, name: "Carlos", flag: "🇪🇸", location: "Spain", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "85ms" },
  { id: 3, name: "Emma", flag: "🇬🇧", location: "UK", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "38ms" },
  { id: 4, name: "You", flag: "🇺🇸", location: "Online", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "12ms" },
];

export default function PracticeRoomHero({
  onCreateClick,
  onBrowseClick,
  onInstantCreateClick,
  isCreatingRoom = false
}: {
  onCreateClick?: () => void;
  onBrowseClick?: () => void;
  onInstantCreateClick?: () => void;
  isCreatingRoom?: boolean;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const floatAnimation = (delay = 0, yOffset = -15) => ({
    y: [0, yOffset, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay }
  });

  return (
    <section className="relative min-h-screen bg-transparent overflow-hidden font-sans flex items-center pt-24 pb-20 lg:pt-32 lg:pb-24">

      {/* --- Ambient Background Elements --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* --- Left Column: Copy & Actions (Takes up 5 columns) --- */}
          <motion.div
            className="lg:col-span-5 max-w-2xl mx-auto lg:mx-0 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md cursor-pointer group">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  Live Practice Rooms <Signal className="w-3.5 h-3.5 group-hover:text-emerald-500 transition-colors" />
                </span>
              </div>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-3xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-6">
              Connect. Converse.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600">
                Conquer English.
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Break the language barrier. Join live audio and video rooms with learners worldwide. Practice speaking in real-time, get instant AI assistance, and build global confidence.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-center lg:justify-start mb-10">
              <div className="flex flex-col gap-4">
                <Button variant="emerald" size="lg" className="w-full group" onClick={onCreateClick}>
                  <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                  Create a Room
                </Button>
                
                {/* Instant Create Premium Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-5 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl group/card relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/card:opacity-20 transition-opacity">
                    <Zap className="w-12 h-12 text-emerald-500" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                        Instant Room
                      </h3>
                      <Badge variant="emerald" className="text-[9px] px-1.5 py-0">FAST</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                      Launch a private session instantly. No setup required.
                    </p>
                    <button
                      onClick={onInstantCreateClick}
                      disabled={isCreatingRoom}
                      className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                      {isCreatingRoom ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                      {isCreatingRoom ? 'Creating...' : 'Start Now'}
                    </button>
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-col h-full self-start pt-1">
                <Button variant="outline" size="lg" className="w-full sm:w-auto group border-slate-300 dark:border-slate-700" onClick={onBrowseClick}>
                  <Globe className="w-5 h-5 mr-2 text-blue-500 group-hover:animate-pulse" />
                  Browse Active Rooms
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-6 border-t border-slate-200 dark:border-slate-800/50">
              <div className="flex -space-x-3 shadow-sm rounded-full bg-white dark:bg-slate-900 p-1 border border-slate-100 dark:border-slate-800">
                {ACTIVE_SPEAKERS.map((s, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden relative group cursor-pointer">
                    <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                  1.2k+
                </div>
              </div>
              <div className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center sm:text-left">
                Learners online <span className="text-emerald-500 font-bold">right now</span>
              </div>
            </motion.div>
          </motion.div>

          {/* --- Right Column: 3D Mac Interface Visuals (Takes up 7 cols) --- */}
          <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] md:h-[650px] w-full flex items-center justify-center lg:justify-end mt-8 sm:mt-12 lg:mt-0 perspective-1000 overflow-hidden sm:overflow-visible">

            {/* Stunning Light Effect Behind Mac Window */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="absolute w-[80%] h-[80%] max-w-[700px] bg-gradient-to-tr from-emerald-500/40 via-teal-500/40 to-blue-600/40 rounded-full blur-[100px] mix-blend-screen"
                animate={{
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute w-[60%] h-[60%] max-w-[500px] bg-blue-400/20 rounded-full blur-[80px] mix-blend-screen animate-pulse" />
            </div>

            {/* Scaling wrapper to ensure it fits on all screens perfectly */}
            <div className="transform scale-[0.55] xs:scale-65 sm:scale-85 md:scale-100 origin-center transition-transform duration-500 relative w-full sm:w-[520px] h-[600px] z-10 flex items-center justify-center">

              {/* 1. Main Video Room Window (Mac UI) */}
              <motion.div
                className="absolute inset-0 w-full h-full bg-slate-900/80 backdrop-blur-2xl rounded-2xl border border-slate-700/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col overflow-hidden ring-1 ring-white/10"
                initial={{ opacity: 0, rotateY: 15, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, rotateY: -5, x: 0, scale: 1 }}
                whileHover={{ rotateY: 0, scale: 1.02, transition: { duration: 0.4 } }}
                transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
              >
                {/* Mac Window Header */}
                <div className="h-12 bg-slate-800/80 backdrop-blur-md flex items-center px-4 border-b border-slate-700/80 shrink-0">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-inner border border-black/10"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-inner border border-black/10"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-inner border border-black/10"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-2 text-xs font-semibold text-slate-300 tracking-wide bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    B2 Upper Intermediate <span className="text-slate-500 mx-1">•</span> Global Tech Talk
                  </div>
                  <div className="w-12"></div> {/* Spacer for balance */}
                </div>

                {/* Video Grid (Content Area) */}
                <div className="flex-1 p-4 grid grid-cols-2 gap-4 bg-slate-950/50 relative overflow-hidden shadow-inner">

                  {/* Inner Glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

                  {ACTIVE_SPEAKERS.map((speaker, idx) => (
                    <motion.div
                      key={speaker.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (idx * 0.1), type: "spring" }}
                      className={cn(
                        "relative rounded-2xl overflow-hidden shadow-lg group bg-slate-900 h-full",
                        speaker.isSpeaking ? "ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-950" : "border border-slate-800"
                      )}
                    >
                      <img src={speaker.image} alt={speaker.name} className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", speaker.isSpeaking ? "opacity-100" : "opacity-60")} />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <div className="bg-slate-900/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                          <Signal className={cn("w-2.5 h-2.5", parseInt(speaker.latency) < 50 ? "text-emerald-400" : "text-amber-400")} />
                          <span className="text-[9px] font-bold text-white">{speaker.latency}</span>
                        </div>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div className="flex items-center gap-2">
                          <div className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 shadow-sm">
                            <span className="text-xs font-bold text-white tracking-wide">{speaker.name} {speaker.flag}</span>
                            {speaker.isSpeaking && (
                              <div className="pl-2 border-l border-white/20">
                                <AudioWave />
                              </div>
                            )}
                          </div>
                        </div>
                        {!speaker.isSpeaking && (
                          <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center backdrop-blur-md">
                            <Mic className="w-3.5 h-3.5 text-rose-500" />
                            <div className="absolute w-5 h-0.5 bg-rose-500 rotate-45 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Bottom Toolbar (Mac style dock inside window) */}
                <div className="h-20 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 flex items-center justify-center gap-4 shrink-0 px-6">
                  <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 shadow-inner">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center text-slate-200 cursor-pointer shadow-sm">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center text-slate-200 cursor-pointer shadow-sm">
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center text-slate-200 cursor-pointer shadow-sm">
                      <MonitorUp className="w-5 h-5" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center justify-center border border-emerald-500/30 cursor-pointer shadow-sm">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center text-slate-200 cursor-pointer shadow-sm">
                      <Settings2 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="w-16 h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 transition-colors flex items-center justify-center text-white shadow-lg shadow-rose-500/20 cursor-pointer border border-rose-400">
                    <PhoneOff className="w-5 h-5" />
                  </div>
                </div>
              </motion.div>

              {/* --- Animated Connection Lines connecting AI Widget to Active Speaker --- */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible hidden md:block">
                <defs>
                  <linearGradient id="ai-pulse" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                    <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Curve from Chat Widget to Active Speaker */}
                <motion.path
                  d="M 0 450 Q -30 250 120 180"
                  fill="none"
                  stroke="url(#ai-pulse)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 1.5, delay: 1, ease: 'easeInOut' as const }}
                />
                <motion.circle
                  r="3"
                  fill="#10b981"
                  filter="blur(1px)"
                  initial={{ cx: 0, cy: 450 }}
                  animate={{ cx: [0, 120, 0], cy: [450, 180, 450] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' as const }}
                />
              </svg>

              <motion.div
                className="absolute z-30 w-[300px] bg-slate-900/90 backdrop-blur-2xl rounded-2xl border border-slate-700 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] shadow-emerald-500/10 overflow-hidden -left-16 bottom-20 ring-1 ring-white/10"
                initial={{ opacity: 0, y: 40, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6, type: 'spring' as const }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400">
                      <div className="absolute inset-0 rounded-md border border-emerald-400/50 animate-ping opacity-50"></div>
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">AI Co-Pilot</span>
                  </div>
                  <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-blue-400 border border-blue-500/30">
                    <Volume2 className="w-3 h-3" /> Listening
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* User Transcript */}
                  <div className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 shadow-sm border border-slate-700">
                      <img src={ACTIVE_SPEAKERS[0].image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="bg-slate-800 p-2.5 rounded-2xl rounded-tl-none text-xs text-slate-300 font-medium leading-relaxed border border-slate-700/50 shadow-inner">
                      "I think AI is going to <span className="line-through decoration-rose-400 decoration-2 text-slate-500">do a big change</span> in how we work."
                    </div>
                  </div>

                  {/* AI Correction/Suggestion */}
                  <motion.div
                    className="ml-10 bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-700/50 p-3 rounded-2xl rounded-tr-none shadow-sm relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 }}
                  >
                    <div className="absolute -left-2 top-3 w-4 h-4 bg-slate-800 border border-emerald-700 rounded-full flex items-center justify-center shadow-sm z-10">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Suggested Phrasing</span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      "...going to <span className="text-emerald-400 font-bold bg-emerald-900/40 px-1 rounded">bring about a major shift</span> in how we work."
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {/* 3. Floating Network/Status Pill (Top Right) */}
              <motion.div
                className="absolute z-30 -right-8 top-16"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8, type: 'spring' as const }}
              >
                <motion.div
                  className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-3 w-48 ring-1 ring-white/5"
                  animate={floatAnimation(1)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-xl flex items-center justify-center text-blue-400 border border-blue-700/50 shadow-inner">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Session Quality</div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-bold text-white leading-none">Optimal</div>
                      <div className="text-[10px] text-emerald-400 font-bold">100%</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}