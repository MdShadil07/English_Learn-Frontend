import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Sparkles,
  Target,
  Brain,
  BookOpen,
  MessageSquare,
  Award,
  Zap,
  RefreshCw,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface RealtimeProgressResponse {
  success: boolean;
  source: string;
  data: {
    accuracy: {
      overall: number;
      grammar?: number;
      vocabulary?: number;
      spelling?: number;
      fluency?: number;
      punctuation?: number;
      capitalization?: number;
      syntax?: number;
      coherence?: number;
      messageCount?: number;
      lastUpdated: string;
      source: string;
    };
  };
}

// ========================================
// CATEGORY CONFIGURATION
// ========================================

const CATEGORY_CONFIG = [
  { key: 'grammar', label: 'Grammar', icon: BookOpen, primary: true },
  { key: 'vocabulary', label: 'Vocabulary', icon: Brain, primary: true },
  { key: 'spelling', label: 'Spelling', icon: CheckCircle2 },
  { key: 'fluency', label: 'Fluency', icon: MessageSquare },
  { key: 'punctuation', label: 'Punctuation', icon: Target },
  { key: 'capitalization', label: 'Capitalization', icon: Sparkles },
  { key: 'syntax', label: 'Syntax', icon: Award },
  { key: 'coherence', label: 'Coherence', icon: Zap },
] as const;

// ========================================
// API FUNCTIONS
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_URL as string;

async function fetchRealtimeProgress(): Promise<RealtimeProgressResponse> {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/progress/realtime`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch realtime progress');
  }

  return response.json();
}

// ========================================
// PREMIUM MINI-COMPONENTS
// ========================================

const MiniWaveChart = ({ score }: { score: number }) => {
  return (
    <div className="absolute bottom-0 left-0 w-full h-[40%] opacity-20 pointer-events-none overflow-hidden rounded-b-[1.5rem]">
      <motion.svg
        className="absolute bottom-0 w-[200%] h-full"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        <path
          d="M0 50 Q 100 0, 200 50 T 400 50 T 600 50 T 800 50 L 800 100 L 0 100 Z"
          className="fill-emerald-400 dark:fill-emerald-500"
        />
      </motion.svg>
      <motion.svg
        className="absolute bottom-0 w-[200%] h-full opacity-50"
        viewBox="0 0 800 100"
        preserveAspectRatio="none"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        <path
          d="M0 60 Q 150 20, 300 60 T 600 60 T 900 60 L 900 100 L 0 100 Z"
          className="fill-teal-300 dark:fill-teal-600"
        />
      </motion.svg>
    </div>
  );
};

// ========================================
// MAIN DASHBOARD COMPONENT
// ========================================

export function RealtimeAccuracyDashboard() {
  const [isRealtime, setIsRealtime] = useState(true);

  const {
    data: realtimeData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['realtime-progress'],
    queryFn: fetchRealtimeProgress,
    staleTime: 5000,
    refetchInterval: isRealtime ? 5000 : false,
    refetchOnWindowFocus: true,
  });

  const displayData = realtimeData?.data?.accuracy;
  const overallScore = displayData?.overall || 0;

  // 3D Tilt Effect Setup (Premium Landing Page Grade)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Radial Math
  const radius = 66;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  if (error) {
    return (
      <div className="w-full rounded-[2.5rem] bg-white dark:bg-[#050C14] border border-red-200 dark:border-red-900/30 p-8 text-center flex flex-col items-center shadow-sm">
        <Activity className="h-12 w-12 text-red-500 mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Live Data Unavailable</h3>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
        >
          Reconnect
        </button>
      </div>
    );
  }

  return (
    <div className="perspective-1000 w-full group">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "relative flex flex-col bg-white dark:bg-[#050C14] rounded-3xl md:rounded-[2rem] p-4 md:p-6",
          "shadow-[0_10px_30px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_10px_30px_-15px_rgba(16,185,129,0.2)]",
          "border border-slate-100 dark:border-emerald-500/20 transition-all duration-1000 h-full overflow-hidden w-full"
        )}
      >
        {/* Holographic Background Orbs */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 dark:bg-emerald-500/15 rounded-full blur-[60px] md:blur-[80px] pointer-events-none transition-all duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/10 dark:bg-teal-600/15 rounded-full blur-[40px] md:blur-[60px] pointer-events-none transition-all duration-1000 delay-100" />

        {/* ------------------------------------------------ */}
        {/* PREMIUM HEADER HUD (Compact) */}
        {/* ------------------------------------------------ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 relative z-20 gap-3" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-100 dark:border-emerald-500/20 shadow-sm overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-emerald-400/20 blur-md md:blur-lg animate-pulse"></div>
              <Activity className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400 relative z-10" />
            </div>
            <div>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5" /> Live Telemetry
              </p>
              <h3 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                Accuracy Engine
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsRealtime(!isRealtime)}
            className="flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 text-xs rounded-full bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-emerald-500/30 backdrop-blur-md shadow-sm hover:bg-slate-50 dark:hover:bg-emerald-500/10 transition-colors self-start sm:self-auto group/btn"
          >
            <div className="relative flex h-1.5 w-1.5 md:h-2 md:w-2">
              <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75", isRealtime ? "animate-ping bg-emerald-400" : "bg-slate-400")}></span>
              <span className={cn("relative inline-flex rounded-full h-full w-full", isRealtime ? "bg-emerald-500" : "bg-slate-500")}></span>
            </div>
            <span className={cn("text-[10px] md:text-[11px] font-black uppercase tracking-widest", isRealtime ? "text-emerald-700 dark:text-emerald-300" : "text-slate-600 dark:text-slate-400")}>
              {isRealtime ? 'Live' : 'Paused'}
            </span>
            <RefreshCw className={cn("w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5 text-emerald-600 dark:text-emerald-400 group-hover/btn:rotate-180 transition-transform duration-500", isRealtime && "animate-spin")} />
          </button>
        </div>

        {/* ------------------------------------------------ */}
        {/* PREMIUM BENTO LAYOUT (Compact & Graphic-Rich) */}
        {/* ------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 relative z-10 items-stretch flex-1">
          
          {/* LEFT: Engine Panel with Rich Vector Art */}
          <div className={cn(
            "xl:col-span-4 flex flex-col items-center justify-center py-8 md:py-6 rounded-2xl md:rounded-[1.5rem] border relative overflow-hidden group/dial",
            "bg-gradient-to-b from-slate-50 to-white dark:from-[#050C14]/50 dark:to-transparent border-slate-200 dark:border-emerald-500/20 shadow-sm transition-all duration-700 min-h-[220px]"
          )} style={{ transform: "translateZ(40px)" }}>
            
            {/* --- RICH VECTOR ART GRAPHICS --- */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40 dark:opacity-60">
              {/* Abstract Glowing Grid lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" className="text-emerald-500/10" strokeWidth="1"/>
                  </pattern>
                  <linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="white" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#gridPattern)" mask="url(#fadeMask)" />
                <mask id="fadeMask"><rect width="100%" height="100%" fill="url(#fadeGrid)"/></mask>
              </svg>

              {/* Vector Tech Nodes & Curves */}
              <svg className="absolute w-[250px] h-[250px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 200">
                {/* Orbital tech tracks */}
                <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" className="text-emerald-400/20" strokeWidth="0.5" strokeDasharray="2 4"/>
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" className="text-teal-400/20" strokeWidth="0.5" strokeDasharray="1 6"/>
                
                {/* Tech nodes / Constellations */}
                <g className="text-emerald-500/40" fill="currentColor">
                  <circle cx="15" cy="100" r="2" />
                  <circle cx="185" cy="100" r="2" />
                  <circle cx="100" cy="15" r="2" />
                  <circle cx="100" cy="185" r="2" />
                  
                  <circle cx="40" cy="40" r="1.5" />
                  <circle cx="160" cy="160" r="1.5" />
                  <circle cx="40" cy="160" r="1.5" />
                  <circle cx="160" cy="40" r="1.5" />
                </g>

                {/* Connecting lines */}
                <path d="M15,100 Q40,40 100,15" fill="none" stroke="currentColor" className="text-emerald-400/20" strokeWidth="0.5" />
                <path d="M185,100 Q160,160 100,185" fill="none" stroke="currentColor" className="text-teal-400/20" strokeWidth="0.5" />
                <path d="M100,15 Q160,40 185,100" fill="none" stroke="currentColor" className="text-emerald-400/20" strokeWidth="0.5" />
                <path d="M15,100 Q40,160 100,185" fill="none" stroke="currentColor" className="text-teal-400/20" strokeWidth="0.5" />
              </svg>
            </div>
            {/* --- END VECTOR ART --- */}

            <div className="relative w-[130px] h-[130px] md:w-[150px] md:h-[150px] flex-shrink-0 flex items-center justify-center z-10 group-hover/dial:scale-[1.05] transition-transform duration-700">
              
              {/* Premium Clean Progress Ring */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Track (Subtle) */}
                <circle
                  cx="80" cy="80" r="70"
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/5"
                  strokeWidth="8"
                  fill="transparent"
                />
                {/* Foreground Fill (Smooth Gradient) */}
                <motion.circle
                  cx="80" cy="80" r="70"
                  stroke="url(#premiumRingGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                  animate={{ strokeDashoffset: (2 * Math.PI * 70) - (overallScore / 100) * (2 * Math.PI * 70) }}
                  transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="drop-shadow-[0_2px_8px_rgba(16,185,129,0.2)] dark:drop-shadow-[0_2px_8px_rgba(16,185,129,0.15)]"
                />
                
                <defs>
                  <linearGradient id="premiumRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#34d399" /> {/* Emerald 400 */}
                    <stop offset="100%" stopColor="#059669" /> {/* Emerald 600 */}
                  </linearGradient>
                </defs>
              </svg>

              {/* Minimalist Center Typography */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm leading-none">
                  {Math.round(overallScore)}
                </span>
                <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mt-1">
                  Accuracy
                </p>
              </div>
            </div>
            
            {/* Engine Status Text */}
            <div className="absolute bottom-3 md:bottom-4 flex items-center gap-1.5 bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">System Optimal</span>
            </div>
          </div>

          {/* RIGHT: Advanced Grid (Compact Cards) */}
          <div className="xl:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3" style={{ transform: "translateZ(30px)" }}>
            
            {/* Primary Categories (Compact but with waves) */}
            {CATEGORY_CONFIG.filter(c => c.primary).map((cat, i) => {
              const score = displayData?.[cat.key as keyof typeof displayData] as number || 0;
              const Icon = cat.icon;

              return (
                <div 
                  key={cat.key}
                  className="col-span-2 md:col-span-2 bg-gradient-to-br from-slate-50 to-white dark:from-[#050C14]/80 dark:to-transparent rounded-2xl md:rounded-[1.2rem] border border-slate-200 dark:border-emerald-500/20 p-3 md:p-4 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all cursor-default group/stat relative overflow-hidden min-h-[90px] md:min-h-[100px]"
                >
                  <MiniWaveChart score={score} />
                  
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg bg-white dark:bg-[#050C14] border border-slate-200 dark:border-emerald-500/20 flex items-center justify-center shadow-inner group-hover/stat:scale-110 transition-transform">
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-400 transition-colors">
                          {cat.label}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-400 transition-colors drop-shadow-sm">
                        {Math.round(score)}<span className="text-[12px] md:text-[14px] text-slate-400">%</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Glowing Progress Bar */}
                  <div className="relative z-10 w-full h-1.5 bg-slate-200 dark:bg-black/60 rounded-full mt-auto overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 dark:from-emerald-500 dark:to-teal-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>
              );
            })}

            {/* Secondary Categories (Ultra-compact Bento Blocks) */}
            {CATEGORY_CONFIG.filter(c => !c.primary).map((cat, i) => {
              const score = displayData?.[cat.key as keyof typeof displayData] as number || 0;
              const Icon = cat.icon;

              return (
                <div 
                  key={cat.key}
                  className="bg-slate-50 dark:bg-[#050C14]/50 rounded-xl md:rounded-[1rem] border border-slate-200 dark:border-emerald-500/20 p-2.5 md:p-3 lg:p-4 shadow-sm flex flex-col justify-between hover:bg-white dark:hover:bg-[#050C14] hover:border-emerald-500/30 transition-all cursor-default group/stat relative overflow-hidden min-h-[75px]"
                >
                  <div className="flex items-center justify-between mb-2 md:mb-3">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-500 dark:text-emerald-400 opacity-80" />
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-300 transition-colors truncate max-w-[60px] sm:max-w-none">
                        {cat.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-end justify-between">
                    <span className="text-lg md:text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover/stat:text-emerald-600 dark:group-hover/stat:text-emerald-300 transition-colors">
                      {Math.round(score)}<span className="text-[10px] md:text-[12px] text-slate-400 ml-0.5">%</span>
                    </span>
                  </div>
                  
                  {/* Subtle Thin Progress Line */}
                  <div className="w-full h-1 bg-slate-200 dark:bg-black/40 rounded-full mt-2 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.05), ease: "easeOut" }}
                      className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full opacity-80 group-hover/stat:opacity-100 transition-opacity"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </div>
  );
}

export default RealtimeAccuracyDashboard;
