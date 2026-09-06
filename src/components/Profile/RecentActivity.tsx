import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface RecentActivityProps {
  profile: UserProfile;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02, rotate: 1, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 border border-emerald-200/40 dark:border-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)] transition-all duration-500"
    >
      {/* Background decorative elements matching AIChatPage pulses */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[55%] bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 group-hover:bg-orange-400/20 transition-colors duration-700"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-[70px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_1s] z-0 group-hover:bg-yellow-400/20 transition-colors duration-700"></div>

      <div className="relative p-4 sm:p-5 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Latest learning sessions</p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {profile.recentActivity && profile.recentActivity.length > 0 ? (
            profile.recentActivity.slice(0, 3).map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-center gap-2 sm:gap-3 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-orange-200/30 dark:border-orange-800/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  <span className="text-xs sm:text-sm">{activity.icon}</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{activity.title}</p>
                  <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 truncate">{activity.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] sm:text-xs font-medium text-orange-600 dark:text-orange-400">+{activity.xpGained} XP</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 hidden sm:block">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))
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
              <h4 className="text-sm sm:text-base text-slate-900 dark:text-slate-100 font-semibold mb-1 sm:mb-2">No Recent Activity</h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Start learning to see your progress and achievements here!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-400/0 via-amber-400/0 to-yellow-400/0 group-hover:from-orange-400/10 group-hover:via-amber-400/10 group-hover:to-yellow-400/10 transition-all duration-500 -z-10"></div>
    </motion.div>
  );
};

export default RecentActivity;
