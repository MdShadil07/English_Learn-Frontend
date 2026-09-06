import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface FluencyLevelCardProps {
  profile: UserProfile;
}

const FluencyLevelCard: React.FC<FluencyLevelCardProps> = ({ profile }) => {
  // Simple CEFR calculation based on user level or XP
  // In a real app, this would be a more complex formula based on actual assessments
  const calculateCEFR = (level: number) => {
    if (level < 5) return { cefr: 'A1', title: 'Beginner', progress: level * 20, next: 'A2' };
    if (level < 15) return { cefr: 'A2', title: 'Elementary', progress: (level - 5) * 10, next: 'B1' };
    if (level < 30) return { cefr: 'B1', title: 'Intermediate', progress: (level - 15) * 6.6, next: 'B2' };
    if (level < 50) return { cefr: 'B2', title: 'Upper Intermediate', progress: (level - 30) * 5, next: 'C1' };
    if (level < 80) return { cefr: 'C1', title: 'Advanced', progress: (level - 50) * 3.3, next: 'C2' };
    return { cefr: 'C2', title: 'Mastery', progress: 100, next: 'MAX' };
  };

  const fluency = calculateCEFR(profile.level || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group relative overflow-hidden rounded-[2.5rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 border border-emerald-200/40 dark:border-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)] transition-all duration-500"
    >
      {/* Background decorative elements matching AIChatPage pulses */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[55%] bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 group-hover:bg-blue-400/20 transition-colors duration-700"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-300/20 dark:bg-indigo-500/10 rounded-full blur-[70px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_1s] z-0 group-hover:bg-indigo-400/20 transition-colors duration-700"></div>

      <div className="relative p-4 sm:p-5 md:p-6 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <motion.div
            className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Fluency Level</h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">CEFR Standard Equivalent</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 py-2">
          {/* Circular Progress Indicator */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center">
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-400/30 transition-colors duration-500"></div>
            
            {/* SVG Circle */}
            <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-200 dark:text-slate-800"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * fluency.progress) / 100}
                strokeLinecap="round"
                className="text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * fluency.progress) / 100 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
            </svg>
            
            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
                {fluency.cefr}
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-blue-500 uppercase tracking-widest mt-1">
                {fluency.title}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl p-3 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              Next: <span className="text-slate-900 dark:text-white font-bold">{fluency.next}</span>
            </span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-blue-500">
            {Math.round(fluency.progress)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default FluencyLevelCard;
