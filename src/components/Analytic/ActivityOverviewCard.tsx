import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Info, TrendingUp, TrendingDown, Minus, Clock, Zap, Target, Sparkles } from 'lucide-react';
import { ProgressRing } from '@/components/Analytic/AdvancedCharts';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ActivityOverviewCardProps {
  totalTimeMinutes: number;
  totalSessions: number;
  xpValue: number;
  xpPrevious: number;
  consistencyScore: number;
  consistencyPrevious: number;
  topPercentile?: number;
  isNewUser?: boolean;
}

const ActivityOverviewCard: React.FC<ActivityOverviewCardProps> = ({
  totalTimeMinutes,
  totalSessions,
  xpValue,
  xpPrevious,
  consistencyScore,
  consistencyPrevious,
  topPercentile = 15,
  isNewUser = false,
}) => {
  const getDiff = (current: number, previous: number) => {
    const diff = current - previous;
    const percentage = previous !== 0 ? (diff / previous) * 100 : 0;
    return { diff, percentage, isPositive: diff > 0, isNeutral: diff === 0 };
  };

  const xpStats = getDiff(xpValue, xpPrevious);
  const consistencyStats = getDiff(consistencyScore, consistencyPrevious);

  const DiffBadge = ({ stats }: { stats: ReturnType<typeof getDiff> }) => (
    <div className={cn(
      "flex items-center gap-1 text-[11px] font-black px-2.5 py-1 rounded-full border shadow-[0_2px_10px_rgba(0,0,0,0.05)] backdrop-blur-xl transition-all",
      stats.isPositive && "bg-emerald-400/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/10",
      !stats.isPositive && !stats.isNeutral && "bg-rose-400/10 border-rose-500/20 text-rose-600 dark:text-rose-400 dark:bg-rose-500/10",
      stats.isNeutral && "bg-slate-400/10 border-slate-500/20 text-slate-600 dark:text-slate-400 dark:bg-slate-500/10"
    )}>
      {stats.isPositive && <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} />}
      {!stats.isPositive && !stats.isNeutral && <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />}
      {stats.isNeutral && <Minus className="w-3.5 h-3.5" strokeWidth={3} />}
      <span className="tracking-widest">{Math.abs(stats.percentage).toFixed(1)}%</span>
    </div>
  );

  return (
    <Card className="relative flex flex-col bg-white dark:bg-[#050C14] rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] dark:shadow-none border border-slate-100 dark:border-emerald-500/20 overflow-hidden group w-full h-full transition-all duration-1000">
      
      {/* =========================================================
          CREATIVE BACKGROUND & ANIMATED MESH
      ========================================================= */}
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
      
      {/* Animated glowing orbs */}
      <motion.div 
        className="absolute top-[-10%] left-[-10%] w-[60%] h-[70%] bg-emerald-300/20 dark:bg-emerald-600/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[60%] bg-teal-300/20 dark:bg-teal-600/10 rounded-full blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Sparkles / Stars effect */}
      <div className="absolute top-[10%] right-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] animate-ping opacity-50"></div>
      <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse opacity-60"></div>


      {/* =========================================================
          HEADER
      ========================================================= */}
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8 relative z-20" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">Activity</p>
              <h3 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Global Overview</h3>
            </div>
          </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 dark:bg-[#050C14]/60 border border-slate-200/50 dark:border-emerald-500/20 shadow-sm backdrop-blur-md">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">Live</span>
        </div>
      </div>


      {/* =========================================================
          MAIN CONTENT & LAYOUT
      ========================================================= */}
      <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 flex-1 relative z-20">
        
        {/* Left Side: Dynamic Stats Display */}
        <div className="flex flex-col flex-1 w-full justify-between gap-6 relative">
          
          {/* Holographic "Study Time" Board */}
          <div className="relative w-full p-6 rounded-[24px] bg-white/40 dark:bg-[#050C14]/60 border border-white/60 dark:border-emerald-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-2xl overflow-hidden group/board transition-all duration-500 hover:bg-white/60 dark:hover:bg-[#050C14]/80">
            
            {/* Holographic sweep effect */}
            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-[100%] group-hover/board:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>

            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Total Study Time</p>
            </div>
            
            <div className="flex items-end gap-2 relative">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-[56px] lg:text-[64px] font-black tracking-tighter leading-[0.85] bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-200 drop-shadow-sm"
              >
                {totalTimeMinutes}
              </motion.span>
              <span className="text-[18px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">min</span>
            </div>

            {/* Glowing SVG Wave behind the text */}
            <div className="absolute bottom-0 left-0 w-full h-[60px] opacity-20 dark:opacity-30 pointer-events-none">
              <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
                <path d="M0,60 Q100,0 200,30 T400,10 L400,60 Z" fill="url(#waveGrad)" />
                <defs>
                  <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#14b8a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Twin Sub-Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* XP Card */}
            <div className="flex flex-col justify-between p-5 rounded-[20px] bg-white/70 dark:bg-[#050C14]/70 border border-slate-200/60 dark:border-emerald-500/20 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 fill-emerald-500/20" />
                </div>
                <DiffBadge stats={xpStats} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-1">XP Gained</p>
                <p className="text-[24px] font-black text-slate-800 dark:text-white leading-none tracking-tight">+{xpValue}</p>
              </div>
            </div>

            {/* Consistency Card */}
            <div className="flex flex-col justify-between p-5 rounded-[20px] bg-white/70 dark:bg-[#050C14]/70 border border-slate-200/60 dark:border-emerald-500/20 shadow-sm hover:-translate-y-1 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                  <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <DiffBadge stats={consistencyStats} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 mb-1">Consistency</p>
                <p className="text-[24px] font-black text-slate-800 dark:text-white leading-none tracking-tight">{consistencyScore}%</p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Floating Progress Ring */}
        <div className="flex flex-col items-center justify-center shrink-0 w-[180px] lg:w-[200px] relative">
          
          {/* Futuristic Ring Pedestal / Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[160px] h-[160px] rounded-full bg-emerald-400/10 dark:bg-emerald-500/10 blur-2xl animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 hover:scale-105 transition-transform duration-500 drop-shadow-[0_10px_20px_rgba(16,185,129,0.2)]">
            <ProgressRing
              value={totalSessions}
              max={100}
              size={180}
              strokeWidth={16}
              gradient="from-[#10B981] to-[#0D9488]"
              icon={Activity}
            />
            {/* Inner Ring Glow */}
            <div className="absolute inset-0 rounded-full border-[2px] border-emerald-400/20 dark:border-emerald-400/10 scale-110 pointer-events-none"></div>
          </div>
          
          <div className="mt-8 flex flex-col items-center relative z-10 bg-white/80 dark:bg-[#050C14]/80 px-5 py-2.5 rounded-full border border-slate-200 dark:border-emerald-500/20 shadow-sm backdrop-blur-md">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 text-center">
              Total Sessions
            </p>
            {isNewUser ? (
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[13px] font-black text-amber-600 dark:text-amber-500">
                  New Scholar
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <p className="text-[13px] font-black text-emerald-700 dark:text-emerald-400">
                  Top {topPercentile}% User
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </Card>
  );
};

export default ActivityOverviewCard;
