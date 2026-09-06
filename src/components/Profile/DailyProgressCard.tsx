import React from 'react';
import { motion } from 'framer-motion';
import { Target, Lock } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface DailyProgressCardProps {
  profile: UserProfile;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({ profile }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const hasProgress = profile.stats && (profile.stats.studyTimeThisWeek > 0 || profile.stats.currentStreak > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 border border-emerald-200/40 dark:border-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)] transition-all duration-500"
    >
      {/* Background decorative elements matching AIChatPage pulses */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[55%] bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 group-hover:bg-emerald-400/20 transition-colors duration-700"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[70px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_1s] z-0 group-hover:bg-teal-400/20 transition-colors duration-700"></div>

      <div className="relative p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Daily Progress</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Today's learning streak</p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {hasProgress ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Study Time</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">{formatTime(profile.stats.studyTimeThisWeek)}</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-1.5 sm:h-2">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((profile.stats.studyTimeThisWeek / 60) * 100, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((profile.stats.studyTimeThisWeek / 60) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Weekly Goal</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white">{profile.weeklyGoal} min</span>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center py-4 sm:py-6 md:py-8"
            >
              <motion.div
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lock className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-slate-400 dark:text-slate-500" />
              </motion.div>
              <h4 className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-semibold mb-1 sm:mb-2">Progress Locked</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Start your learning journey to track daily progress and build streaks!</p>
            </motion.div>
          )}
        </div>
      </div>

    </motion.div>
  );
};

export default DailyProgressCard;
