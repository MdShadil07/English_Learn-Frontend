import React from 'react';
import { motion } from 'framer-motion';
import { Target, Flame, MessageSquare, Activity, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

export const SidebarUserCard: React.FC<{
  level: number;
  xpProgressPercentage: number;
  currentLevelXp: number;
  xpRequiredForLevel: number;
  xpToNextLevel: number;
  streak: number;
  totalXp: number;
  totalMessages: number;
  accuracy: number;
  totalLearningTime: number;
  isLoading?: boolean;
}> = ({
  level,
  xpProgressPercentage,
  currentLevelXp,
  xpRequiredForLevel,
  xpToNextLevel,
  streak,
  totalXp,
  totalMessages,
  accuracy,
  totalLearningTime,
  isLoading = false,
}) => {
  const formatLearningTime = (seconds: number): string => {
    if (isLoading) return '--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const statTiles = [
    {
      id: 'streak',
      label: 'Streak',
      value: isLoading ? '--' : streak,
      icon: Flame,
      gradient: 'from-orange-400 to-orange-500 shadow-orange-500/20',
      labelColor: 'text-orange-600 dark:text-orange-400',
      bgClass: 'hover:bg-orange-50 dark:hover:bg-orange-500/10',
      borderClass: 'hover:border-orange-200 dark:hover:border-orange-500/30'
    },
    {
      id: 'messages',
      label: 'Messages',
      value: isLoading ? '--' : totalMessages,
      icon: MessageSquare,
      gradient: 'from-emerald-400 to-emerald-500 shadow-emerald-500/20',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
      bgClass: 'hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
      borderClass: 'hover:border-emerald-200 dark:hover:border-emerald-500/30'
    },
    {
      id: 'accuracy',
      label: 'Accuracy',
      value: isLoading ? '--%' : `${Math.round(accuracy)}%`,
      icon: Activity,
      gradient: 'from-blue-400 to-blue-500 shadow-blue-500/20',
      labelColor: 'text-blue-600 dark:text-blue-400',
      bgClass: 'hover:bg-blue-50 dark:hover:bg-blue-500/10',
      borderClass: 'hover:border-blue-200 dark:hover:border-blue-500/30'
    },
    {
      id: 'time',
      label: 'Time',
      value: formatLearningTime(totalLearningTime),
      icon: Clock,
      gradient: 'from-purple-400 to-purple-500 shadow-purple-500/20',
      labelColor: 'text-purple-600 dark:text-purple-400',
      bgClass: 'hover:bg-purple-50 dark:hover:bg-purple-500/10',
      borderClass: 'hover:border-purple-200 dark:hover:border-purple-500/30'
    }
  ] as const;

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

      <div className="relative z-10 p-5 space-y-4">
        
        {/* Holographic Stats Grid First */}
        <div className="grid grid-cols-2 gap-2">
          {statTiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <div
                key={tile.id}
                className={cn(
                  "relative flex items-center gap-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 transition-all duration-300 shadow-sm cursor-default group/tile",
                  tile.bgClass,
                  tile.borderClass,
                  isLoading && "animate-pulse"
                )}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tile.gradient} text-white shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                >
                  <Icon className="h-4 w-4 drop-shadow-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    {tile.label}
                  </p>
                  <p className={cn("truncate text-[13px] font-black leading-none mt-0.5 tracking-tight", tile.labelColor)}>
                    {tile.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Exact Layout Level Bar within Premium Holographic Board */}
        <div className="relative w-full p-4 rounded-[1.5rem] bg-white/40 dark:bg-[#050C14]/60 border border-white/60 dark:border-emerald-500/20 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none backdrop-blur-2xl overflow-hidden group/board transition-all duration-500 hover:bg-white/60 dark:hover:bg-[#050C14]/80">
          <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent -translate-x-[100%] group-hover/board:translate-x-[50%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="text-[13px] font-black text-slate-800 dark:text-slate-100 mb-1.5 flex items-center gap-1.5">
              Level {isLoading ? '--' : level}
            </div>
            
            {isLoading ? (
              <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden mb-2 shadow-inner">
                <div className="h-full bg-emerald-500 dark:bg-emerald-400 animate-pulse w-1/2 rounded-full"></div>
              </div>
            ) : (
              <div className="h-1.5 w-full rounded-full bg-slate-200/80 dark:bg-slate-800/80 overflow-hidden mb-2 shadow-inner">
                <div
                  className="h-full rounded-full bg-emerald-500 dark:bg-emerald-400 transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(1, xpProgressPercentage)}%` }}
                />
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-bold tracking-wide">
              <span>Total XP: {isLoading ? '--' : totalXp.toLocaleString()}</span>
              <span>Lvl XP: {isLoading ? '--' : `${currentLevelXp.toLocaleString()} / ${xpRequiredForLevel.toLocaleString()}`}</span>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-emerald-600 dark:text-emerald-500/90 font-black tracking-wide">
              <span>{isLoading ? '--' : (xpRequiredForLevel - currentLevelXp).toLocaleString()} XP remaining</span>
              <span>{isLoading ? '--' : Math.floor(xpProgressPercentage)}% complete</span>
            </div>
          </div>

          {/* Glowing Wave Background for Board */}
          <div className="absolute bottom-0 left-0 w-full h-[40px] opacity-20 dark:opacity-30 pointer-events-none">
            <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
              <path d="M0,60 Q100,0 200,30 T400,10 L400,60 Z" fill="url(#waveGradLevel)" />
              <defs>
                <linearGradient id="waveGradLevel" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
