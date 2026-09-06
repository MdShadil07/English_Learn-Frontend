import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Gift, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/types/user';

interface DailyQuestsCardProps {
  profile: UserProfile;
}

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({ profile }) => {
  // Mock quests data (in a real app, this would come from the backend)
  const quests = [
    { id: 1, title: 'Complete 2 Lessons', progress: 1, total: 2, xp: 20, isCompleted: false, color: 'from-blue-400 to-indigo-500 dark:from-blue-500 dark:to-indigo-600' },
    { id: 2, title: 'Achieve 90% accuracy', progress: 100, total: 100, xp: 30, isCompleted: true, color: 'from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600' },
    { id: 3, title: 'Practice for 15 mins', progress: 8, total: 15, xp: 15, isCompleted: false, color: 'from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600' },
  ];

  const completedCount = quests.filter(q => q.isCompleted).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
      className="group relative h-full w-full rounded-[2rem] sm:rounded-[2.5rem] p-[1px] bg-emerald-200/40 dark:bg-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative w-full h-full rounded-[1.95rem] sm:rounded-[2.45rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 overflow-hidden flex flex-col p-5 sm:p-6">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-[1.25rem] bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 shadow-lg shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
            <Target className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight truncate">Daily Quests</h3>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">{completedCount} of {quests.length} completed</p>
          </div>
        </div>
        
        {/* Chest Reward */}
        <div className={cn(
          "flex items-center gap-2 px-3.5 py-2 rounded-full border transition-all duration-300",
          completedCount === quests.length 
            ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]" 
            : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
        )}>
          <Gift className={cn("h-4 w-4", completedCount === quests.length ? "animate-bounce" : "")} />
          <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:inline-block">Reward</span>
        </div>
      </div>

      {/* Quests List */}
      <div className="relative z-10 space-y-5 flex-1 flex flex-col justify-center">
        {quests.map((quest) => {
          const progressPercent = (quest.progress / quest.total) * 100;
          return (
            <div key={quest.id} className="group/quest relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {quest.isCompleted ? (
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-sm"></div>
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 relative z-10 drop-shadow-sm" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30" />
                  )}
                  <span className={cn(
                    "text-[15px] font-bold tracking-tight transition-colors",
                    quest.isCompleted ? "text-slate-400 dark:text-slate-500 line-through" : "text-slate-700 dark:text-slate-200"
                  )}>
                    {quest.title}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-black text-amber-500 drop-shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {quest.xp}
                </div>
              </div>
              
              {/* Progress Bar Container */}
              <div className="ml-8 w-[calc(100%-2rem)]">
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                    className={cn("h-full rounded-full bg-gradient-to-r relative", quest.color)}
                  >
                  </motion.div>
                </div>
                <div className="flex justify-end mt-1.5">
                   <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                     {quest.progress} / {quest.total}
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </motion.div>
  );
};
