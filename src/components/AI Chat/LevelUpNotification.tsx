import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface LevelUpNotificationProps {
  show: boolean;
  newLevel: number;
  oldLevel: number;
  xpGained: number;
  onClose: () => void;
}

const LevelUpNotification: React.FC<LevelUpNotificationProps> = ({
  show,
  newLevel,
  oldLevel,
  xpGained,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <Card className="relative overflow-hidden border-2 border-amber-400 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-950 dark:via-slate-900 dark:to-orange-950 shadow-2xl">
            {/* Animated background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 via-orange-400/20 to-yellow-400/20 animate-pulse" />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-transparent to-orange-400/30 rounded-full blur-xl"
            />

            <div className="relative px-8 py-6 flex items-center gap-4">
              {/* Animated sparkles */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-shrink-0"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-50" />
                  <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-4 rounded-full">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-400 bg-clip-text text-transparent">
                      Level Up!
                    </h3>
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                    Level {oldLevel} → Level {newLevel}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-600 dark:text-slate-300">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>+{xpGained} XP earned</span>
                  </div>
                </motion.div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                aria-label="Close notification"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Confetti animation */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50%',
                    y: '50%',
                    opacity: 1,
                    scale: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1 + Math.random(),
                    delay: Math.random() * 0.5,
                    ease: 'easeOut',
                  }}
                  className={`absolute w-2 h-2 rounded-full ${
                    i % 3 === 0
                      ? 'bg-amber-400'
                      : i % 3 === 1
                      ? 'bg-orange-400'
                      : 'bg-yellow-400'
                  }`}
                />
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LevelUpNotification;