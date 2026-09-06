import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, Clock, Zap } from 'lucide-react';
import { UserProfile, LearningGoal } from '@/types/user';

interface LearningGoalsCardProps {
  profile: UserProfile;
}

const LearningGoalsCard: React.FC<LearningGoalsCardProps> = ({ profile }) => {
  // If no learning goals exist, we can provide a default or empty state
  const goals = profile.learningGoals && profile.learningGoals.length > 0 
    ? profile.learningGoals 
    : [
        {
          id: '1',
          title: 'Master B2 Vocabulary',
          description: 'Learn 500 new words in the B2 CEFR list.',
          category: 'Vocabulary',
          targetValue: 500,
          currentValue: 340,
          unit: 'words',
          isCompleted: false,
        },
        {
          id: '2',
          title: 'Daily Practice Streak',
          description: 'Maintain a 30-day learning streak.',
          category: 'Consistency',
          targetValue: 30,
          currentValue: profile.stats?.currentStreak || 0,
          unit: 'days',
          isCompleted: (profile.stats?.currentStreak || 0) >= 30,
        }
      ] as LearningGoal[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
      className="group relative h-full w-full overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] p-[1px] bg-emerald-200/40 dark:bg-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative w-full h-full rounded-[1.95rem] sm:rounded-[2.45rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 overflow-hidden flex flex-col p-5 sm:p-6 md:p-8">
      {/* Background decorative elements matching AIChatPage pulses */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-pink-300/10 dark:bg-pink-500/5 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 transition-colors duration-700"></div>
      
      <div className="relative z-10 w-full flex-1 flex flex-col">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-[1.25rem] bg-gradient-to-br from-pink-400 to-rose-600 dark:from-pink-500 dark:to-rose-700 shadow-lg shadow-pink-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
            <Target className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight truncate">Active Goals</h3>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">Your current learning targets</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {goals.map((goal, index) => {
            const progressPercentage = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
            
            return (
              <motion.div 
                key={goal.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl p-5 border border-slate-200/50 dark:border-slate-700/50 hover:border-pink-300 dark:hover:border-pink-800 transition-colors duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {goal.isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Zap className="w-4 h-4 text-pink-500" />
                      )}
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">
                        {goal.category}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">{goal.title}</h4>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-1 flex flex-col items-end">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{goal.unit}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                      {goal.currentValue} / {goal.targetValue}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                  {goal.description}
                </p>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-500 dark:text-slate-400">Progress</span>
                    <span className={goal.isCompleted ? "text-emerald-500" : "text-pink-500"}>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        goal.isCompleted 
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' 
                          : 'bg-gradient-to-r from-pink-400 to-rose-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 1, ease: "easeOut" }}
                    />
                  </div>
                </div>
                
                {goal.deadline && (
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 border border-slate-100 dark:border-slate-800">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </div>
                )}
              </motion.div>
            );
          })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LearningGoalsCard;
