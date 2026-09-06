import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Target, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { AccuracyResult } from './types';
import { cn } from '../../lib/utils';

export const SidebarAccuracyCard: React.FC<{
  latestAccuracy: {
    accuracy: AccuracyResult;
    xpGained?: number;
    timestamp: Date;
    fromCache?: boolean;
  };
  isLoading?: boolean;
}> = ({ latestAccuracy, isLoading = false }) => {
  const { accuracy, xpGained = 0, timestamp, fromCache = false } = latestAccuracy || {};
  
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] flex-none h-64 transition-all duration-1000">
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-[#050C14]/50 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!accuracy) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] flex-none transition-all duration-1000 p-6 flex flex-col items-center justify-center min-h-[160px]">
         <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
         <Activity className="h-8 w-8 text-emerald-400 mb-3" />
         <p className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-[0.1em]">No Data Yet</p>
         <p className="text-[10px] font-medium text-slate-500 mt-1 text-center">Complete a conversation to see accuracy.</p>
      </div>
    );
  }

  const aiFeedback = accuracy.aiResponseAnalysis;
  const improvement = accuracy.insights?.improvement ?? 0;
  const netXP = accuracy.netXP ?? accuracy.insights?.netXP ?? 0;
  const isPositiveXP = netXP > 0;
  const isImproving = improvement > 0;

  const primaryBreakdown = [
    { label: 'Grammar', value: accuracy.grammar?.toFixed(2) ?? '0.00' },
    { label: 'Vocab', value: accuracy.vocabulary?.toFixed(2) ?? '0.00' },
    { label: 'Spelling', value: accuracy.spelling?.toFixed(2) ?? '0.00' },
    { label: 'Fluency', value: accuracy.fluency?.toFixed(2) ?? '0.00' }
  ];

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] flex-none transition-all duration-1000 group w-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* Animated Glowing Orbs */}
      <motion.div 
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none z-0"
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 dark:bg-teal-600/20 rounded-full blur-[60px] pointer-events-none z-0"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Sparkles */}
      <div className="absolute top-[10%] right-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] animate-ping opacity-50 z-0"></div>
      <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse opacity-60 z-0"></div>

      <div className="relative z-10 p-5 space-y-5">
        
        {/* Header HUD */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-sm dark:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-500 dark:text-emerald-400">Analysis</p>
              <h3 className="text-[16px] font-black tracking-tight text-slate-900 dark:text-white leading-none mt-0.5">Accuracy</h3>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 backdrop-blur-md shadow-sm">
              <div className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-300">Live</span>
            </div>
            {fromCache && (
              <span className="text-[8px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Cached</span>
            )}
          </div>
        </div>

        {/* Main Score Holographic Board */}
        <div className="relative w-full p-4 rounded-[1.5rem] bg-white/40 dark:bg-[#050C14]/60 border border-white/60 dark:border-emerald-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-2xl overflow-hidden group/board transition-all duration-500 hover:bg-white/60 dark:hover:bg-[#050C14]/80">
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-[100%] group-hover/board:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col">
               <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400 mb-1">Overall</p>
               <div className="flex items-baseline gap-1.5">
                 <motion.span 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="text-4xl font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br from-emerald-600 to-teal-400 dark:from-emerald-400 dark:to-teal-200"
                 >
                   {accuracy.overall.toFixed(1)}
                 </motion.span>
                 <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest">%</span>
               </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border shadow-[0_2px_10px_rgba(0,0,0,0.05)] backdrop-blur-xl",
                isImproving ? "bg-emerald-400/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-rose-400/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
              )}>
                {isImproving ? <TrendingUp className="w-3 h-3" /> : <TrendingUp className="w-3 h-3 rotate-180" />}
                <span className="tracking-wider">{Math.abs(improvement).toFixed(1)}%</span>
              </div>
              
              {isPositiveXP && (
                <span className="text-[11px] font-black text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                  +{netXP} XP
                </span>
              )}
            </div>
          </div>
          
          {/* Glowing Wave Background */}
          <div className="absolute bottom-0 left-0 w-full h-[30px] opacity-20 dark:opacity-30 pointer-events-none">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,60 Q100,0 200,30 T400,10 L400,60 Z" fill="url(#waveGradScore)" />
              <defs>
                <linearGradient id="waveGradScore" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* AI Direct Quote / Feedback */}
        {aiFeedback && (
          <div className="relative">
            <h5 className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">AI Correction</h5>
            <div className="bg-slate-50 dark:bg-white/5 rounded-[1.25rem] p-4 border-l-[3px] border-emerald-500 relative overflow-hidden backdrop-blur-md shadow-sm hover:bg-slate-100 dark:hover:bg-emerald-500/10 transition-colors">
              <span className="absolute -top-1 -left-1 text-[60px] font-serif text-slate-200 dark:text-emerald-500/10 leading-none select-none">"</span>
              <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200 relative z-10 pl-3 leading-relaxed">
                {(aiFeedback.hasCorrectionFeedback || (aiFeedback.correctedErrors && aiFeedback.correctedErrors.length > 0)) ? (
                  <>AI detected corrections. Keep practicing to improve your <span className="text-emerald-600 dark:text-emerald-300">fluency</span>.</>
                ) : (
                  <>Great job! Your recent responses show solid understanding.</>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Breakdown Mini Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          {primaryBreakdown.map((item, idx) => (
            <div key={item.label} className="bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 py-3 px-1 flex flex-col items-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group shadow-sm">
               <span className="text-[14px] font-black text-slate-800 dark:text-white tracking-tight leading-none truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-300">
                 {Math.round(parseFloat(item.value))}
               </span>
               <span className="text-[7px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mt-1 truncate w-full text-center px-1">
                 {item.label}
               </span>
               <div className="w-8 h-1 bg-slate-200 dark:bg-black/40 rounded-full mt-2 overflow-hidden shadow-inner">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: `${Math.min(100, Math.round(parseFloat(item.value)))}%` }} 
                   transition={{ duration: 1, delay: 0.2 + idx * 0.1 }} 
                   className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-400 rounded-full"
                 ></motion.div>
               </div>
            </div>
          ))}
        </div>

        {/* Advanced NLP Insights Holographic */}
        {(accuracy.readability || accuracy.tone || accuracy.style) && (
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400">Advanced Insights</span>
            </div>
            
            <div className="bg-slate-50 dark:bg-white/5 rounded-[1.25rem] p-4 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-white/10 space-y-3">
              
              {accuracy.readability && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Readability</span>
                  <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                    {accuracy.readability.fleschReadingEase ?? 'N/A'}
                  </span>
                </div>
              )}

              {accuracy.tone && (
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Tone</span>
                  <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-500/20 capitalize">
                    {accuracy.tone.overall ?? 'Neutral'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
