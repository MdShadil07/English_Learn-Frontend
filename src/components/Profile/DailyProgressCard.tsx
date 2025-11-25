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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02, rotate: 1, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-teal-900/20 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-emerald-300/20 to-green-300/20 dark:from-emerald-700/20 dark:to-green-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-teal-300/20 to-emerald-300/20 dark:from-teal-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Target className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Progress</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Today's learning streak</p>
          </div>
        </div>

        <div className="space-y-3">
          {hasProgress ? (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Study Time</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatTime(profile.stats.studyTimeThisWeek)}</span>
              </div>
              <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((profile.stats.studyTimeThisWeek / 60) * 100, 100)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((profile.stats.studyTimeThisWeek / 60) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                ></motion.div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Weekly Goal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{profile.weeklyGoal} min</span>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center py-8"
            >
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Lock className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </motion.div>
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-2">Progress Locked</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Start your learning journey to track daily progress and build streaks!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-green-400/0 to-teal-400/0 group-hover:from-emerald-400/10 group-hover:via-green-400/10 group-hover:to-teal-400/10 transition-all duration-500 -z-10"></div>
    </motion.div>
  );
};

export default DailyProgressCard;
