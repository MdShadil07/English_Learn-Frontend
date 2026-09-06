import React from 'react';
import { motion } from 'framer-motion';
import { Map, MapPin, Trophy, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfile } from '@/types/user';

interface LearningJourneyPathProps {
  profile: UserProfile;
}

export const LearningJourneyPath: React.FC<LearningJourneyPathProps> = ({ profile }) => {
  const milestones = [
    { id: 1, title: 'Beginner (A1)', description: 'Started learning', status: 'completed' },
    { id: 2, title: 'Elementary (A2)', description: 'Basic conversations', status: 'current' },
    { id: 3, title: 'Intermediate (B1)', description: 'Everyday topics', status: 'locked' },
    { id: 4, title: 'Advanced (B2)', description: 'Complex discussions', status: 'locked' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 100 }}
      className="group relative h-full w-full rounded-[2rem] sm:rounded-[2.5rem] p-[1px] bg-emerald-200/40 dark:bg-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative w-full h-full rounded-[1.95rem] sm:rounded-[2.45rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 overflow-hidden flex flex-col p-5 sm:p-6">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-[1.25rem] bg-gradient-to-br from-emerald-400 to-teal-500 dark:from-emerald-500 dark:to-teal-600 shadow-lg shadow-teal-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
            <Map className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight truncate">Learning Journey</h3>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">Your language roadmap</p>
          </div>
        </div>
        <div className="px-3.5 py-2 rounded-full border bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Trophy className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase tracking-widest hidden sm:inline-block">Rank</span>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-4">
        <div className="relative space-y-6">
          {/* Vertical Line connecting milestones */}
          <div className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-slate-200 dark:bg-slate-700/50 z-0"></div>
          
          {milestones.map((milestone) => {
            const isCompleted = milestone.status === 'completed';
            const isCurrent = milestone.status === 'current';
            const isLocked = milestone.status === 'locked';

            return (
              <div key={milestone.id} className={cn("relative z-10 flex items-start gap-6 group/milestone", isLocked ? "opacity-60" : "opacity-100")}>
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-white dark:border-[#050C14] shadow-sm transition-transform duration-300",
                    isCompleted ? "bg-emerald-500" : isCurrent ? "bg-blue-500 scale-110 ring-4 ring-blue-500/20" : "bg-slate-300 dark:bg-slate-700",
                  )}>
                    {isCompleted ? <Check className="h-4 w-4 text-white font-bold" strokeWidth={3} /> : isCurrent ? <MapPin className="h-4 w-4 text-white" /> : <Lock className="h-4 w-4 text-white" />}
                  </div>
                </div>
                <div className="flex-1 pt-1.5 pb-2">
                  <h4 className={cn("text-[15px] font-bold tracking-tight mb-0.5 transition-colors", isCurrent ? "text-blue-600 dark:text-blue-400" : "text-slate-900 dark:text-white")}>
                    {milestone.title}
                  </h4>
                  <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{milestone.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </motion.div>
  );
};
