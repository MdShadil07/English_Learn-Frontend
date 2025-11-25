import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  personalityName?: string;
  className?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({ 
  personalityName = 'AI', 
  className 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl shadow-sm',
        className
      )}
    >
      {/* Animated Brain Icon */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <Brain className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-3 h-3 text-purple-500 dark:text-purple-400" />
        </motion.div>
      </motion.div>

      {/* Animated Text */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
          {personalityName} is thinking
        </span>
        
        {/* Animated Dots */}
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2,
                ease: 'easeInOut',
              }}
              className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
            />
          ))}
        </div>
      </div>

      {/* Shimmer Effect */}
      <motion.div
        animate={{
          x: ['-100%', '200%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
        style={{ pointerEvents: 'none' }}
      />
    </motion.div>
  );
};

export const TypingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-2 px-4 py-2', className)}>
      <div className="flex gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        Typing...
      </span>
    </div>
  );
};

export default ThinkingIndicator;
