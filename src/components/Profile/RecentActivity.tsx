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
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50/90 via-amber-50/90 to-yellow-50/90 dark:from-orange-900/20 dark:via-amber-900/20 dark:to-yellow-900/20 backdrop-blur-xl border border-orange-200/50 dark:border-orange-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-orange-300/20 to-amber-300/20 dark:from-orange-700/20 dark:to-amber-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300/20 to-orange-300/20 dark:from-yellow-700/20 dark:to-orange-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Activity className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Latest learning sessions</p>
          </div>
        </div>

        <div className="space-y-3">
          {profile.recentActivity && profile.recentActivity.length > 0 ? (
            profile.recentActivity.slice(0, 3).map((activity, index) => (
              <motion.div
                key={activity.id}
                className="flex items-center gap-3 p-2 bg-white/60 dark:bg-slate-800/60 rounded-lg border border-orange-200/30 dark:border-orange-800/30"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <motion.div
                  className="w-8 h-8 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 }}
                >
                  <span className="text-sm">{activity.icon}</span>
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{activity.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-orange-600 dark:text-orange-400">+{activity.xpGained} XP</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
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
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-2">No Recent Activity</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Start learning to see your progress and achievements here!</p>
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
