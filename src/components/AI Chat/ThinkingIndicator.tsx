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
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      className={cn(
        'relative overflow-hidden flex items-center gap-3.5 px-5 py-3.5',
        'bg-white/60 dark:bg-[#050C14]/70 border border-white/80 dark:border-emerald-500/20',
        'shadow-[0_8px_30px_rgba(16,185,129,0.08)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.15)]',
        'rounded-[1.5rem] rounded-tl-md backdrop-blur-xl',
        className
      )}
    >
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-14 h-14 bg-teal-400/5 dark:bg-teal-600/10 rounded-full blur-xl pointer-events-none" />

      {/* Shimmer sweep */}
      <motion.div
        animate={{ x: ['-100%', '300%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/5 dark:via-emerald-400/8 to-transparent pointer-events-none"
      />

      {/* Animated Brain Icon */}
      <motion.div
        animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative shrink-0 z-10"
      >
        <div className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-500/30 rounded-full blur-md animate-pulse" />
        <div className="relative w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center shadow-sm">
          <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 dark:text-amber-300" />
        </motion.div>
      </motion.div>

      {/* Text and dots */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            AI Analysis
          </span>
          <span className="text-[13px] font-bold text-slate-700 dark:text-slate-200 leading-tight">
            {personalityName} is thinking
          </span>
        </div>
        
        {/* Animated Dots */}
        <div className="flex gap-1.5 mb-1 self-end">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.22, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"
            />
          ))}
        </div>
      </div>
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
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: index * 0.15, ease: 'easeInOut' }}
            className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500"
          />
        ))}
      </div>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
        Typing...
      </span>
    </div>
  );
};

export default ThinkingIndicator;
