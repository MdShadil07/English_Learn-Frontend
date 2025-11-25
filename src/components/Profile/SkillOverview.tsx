import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lock } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface SkillOverviewProps {
  profile: UserProfile;
}

const SkillOverview: React.FC<SkillOverviewProps> = ({ profile }) => {
  const hasStats = profile.stats && (profile.stats.vocabulary > 0 || profile.stats.grammar > 0 || profile.stats.pronunciation > 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02, rotate: -1, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-300/20 to-indigo-300/20 dark:from-blue-700/20 dark:to-indigo-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-12 h-12 rounded-full bg-gradient-to-br from-purple-300/20 to-blue-300/20 dark:from-purple-700/20 dark:to-blue-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <BookOpen className="h-5 w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Overview</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Current proficiency levels</p>
          </div>
        </div>

        <div className="space-y-3">
          {hasStats ? (
            [
              { skill: 'Vocabulary', level: profile.stats.vocabulary, color: 'from-blue-500 to-indigo-500' },
              { skill: 'Grammar', level: profile.stats.grammar, color: 'from-indigo-500 to-purple-500' },
              { skill: 'Pronunciation', level: profile.stats.pronunciation, color: 'from-purple-500 to-pink-500' },
            ].map((item, index) => (
              <motion.div
                key={item.skill}
                className="space-y-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{item.skill}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{item.level}%</span>
                </div>
                <div className="w-full bg-slate-200/60 dark:bg-slate-700/60 rounded-full h-1.5">
                  <motion.div
                    className={`bg-gradient-to-r ${item.color} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${item.level}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.level}%` }}
                    transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                  ></motion.div>
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
              <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-2">Skills Locked</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">Complete lessons to unlock and track your skill progression!</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:via-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-500 -z-10"></div>
    </motion.div>
  );
};

export default SkillOverview;
