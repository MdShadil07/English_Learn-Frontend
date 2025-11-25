import React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AnalyticsAccent =
  | 'emerald'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'amber'
  | 'orange'
  | 'slate';

interface AccentConfig {
  gradient: string;
  border: string;
  orbPrimary: string;
  orbSecondary: string;
}

const ACCENT_STYLES: Record<AnalyticsAccent, AccentConfig> = {
  emerald: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-emerald-100/60 dark:border-emerald-800/30',
    orbPrimary: 'bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-700/15 dark:to-teal-700/15',
    orbSecondary: 'bg-gradient-to-br from-cyan-200/20 to-emerald-200/20 dark:from-cyan-700/15 dark:to-emerald-700/15'
  },
  teal: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-teal-100/60 dark:border-teal-800/30',
    orbPrimary: 'bg-gradient-to-br from-teal-200/20 to-cyan-200/20 dark:from-teal-700/15 dark:to-cyan-700/15',
    orbSecondary: 'bg-gradient-to-br from-cyan-200/20 to-emerald-200/20 dark:from-cyan-700/15 dark:to-emerald-700/15'
  },
  blue: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-blue-100/60 dark:border-blue-800/30',
    orbPrimary: 'bg-gradient-to-br from-blue-200/20 to-sky-200/20 dark:from-blue-700/15 dark:to-sky-700/15',
    orbSecondary: 'bg-gradient-to-br from-sky-200/20 to-blue-200/20 dark:from-sky-700/15 dark:to-blue-700/15'
  },
  indigo: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-indigo-100/60 dark:border-indigo-800/30',
    orbPrimary: 'bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-700/15 dark:to-purple-700/15',
    orbSecondary: 'bg-gradient-to-br from-purple-200/20 to-indigo-200/20 dark:from-purple-700/15 dark:to-indigo-700/15'
  },
  purple: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-purple-100/60 dark:border-purple-800/30',
    orbPrimary: 'bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-700/15 dark:to-pink-700/15',
    orbSecondary: 'bg-gradient-to-br from-pink-200/20 to-purple-200/20 dark:from-pink-700/15 dark:to-purple-700/15'
  },
  pink: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-rose-100/60 dark:border-rose-800/30',
    orbPrimary: 'bg-gradient-to-br from-rose-200/20 to-pink-200/20 dark:from-rose-700/15 dark:to-pink-700/15',
    orbSecondary: 'bg-gradient-to-br from-pink-200/20 to-rose-200/20 dark:from-pink-700/15 dark:to-rose-700/15'
  },
  amber: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-amber-100/60 dark:border-amber-800/30',
    orbPrimary: 'bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-700/15 dark:to-orange-700/15',
    orbSecondary: 'bg-gradient-to-br from-orange-200/20 to-amber-200/20 dark:from-orange-700/15 dark:to-amber-700/15'
  },
  orange: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-orange-100/60 dark:border-orange-800/30',
    orbPrimary: 'bg-gradient-to-br from-orange-200/20 to-amber-200/20 dark:from-orange-700/15 dark:to-amber-700/15',
    orbSecondary: 'bg-gradient-to-br from-amber-200/20 to-orange-200/20 dark:from-amber-700/15 dark:to-orange-700/15'
  },
  slate: {
    gradient: 'bg-white dark:bg-slate-950',
    border: 'border border-slate-100/60 dark:border-slate-800/30',
    orbPrimary: 'bg-gradient-to-br from-slate-200/20 to-zinc-200/20 dark:from-slate-700/15 dark:to-zinc-700/15',
    orbSecondary: 'bg-gradient-to-br from-zinc-200/20 to-slate-200/20 dark:from-zinc-700/15 dark:to-slate-700/15'
  }
};

interface AnalyticsCardShellProps extends MotionProps {
  accent?: AnalyticsAccent;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
  hoverEffect?: boolean;
  backgroundClassName?: string;
  showOrbs?: boolean;
}

const baseMotion: MotionProps = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.6, type: 'spring', stiffness: 90 }
};

const AnalyticsCardShell: React.FC<AnalyticsCardShellProps> = ({
  accent = 'emerald',
  className,
  contentClassName,
  children,
  hoverEffect = true,
  backgroundClassName,
  showOrbs = false,
  ...motionProps
}) => {
  const style = ACCENT_STYLES[accent] ?? ACCENT_STYLES.emerald;

  return (
    <motion.div
      {...baseMotion}
      {...motionProps}
      whileHover={hoverEffect ? { y: -6, scale: 1.005, transition: { duration: 0.18 } } : undefined}
      className={cn('group relative', className)}
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-3xl shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] transition-all duration-500',
          backgroundClassName ?? style.gradient,
          style.border,
          hoverEffect && 'hover:shadow-[0_18px_38px_-22px_rgba(15,23,42,0.4)]'
        )}
      >
        {showOrbs && (
          <>
            <div
              className={cn(
                'pointer-events-none absolute -top-20 -right-16 h-32 w-32 rounded-full blur-3xl opacity-70 transition-transform duration-700',
                style.orbPrimary,
                hoverEffect && 'group-hover:scale-135'
              )}
            />
            <div
              className={cn(
                'pointer-events-none absolute -bottom-16 -left-16 h-28 w-28 rounded-full blur-3xl opacity-60 transition-transform duration-500',
                style.orbSecondary,
                hoverEffect && 'group-hover:scale-120'
              )}
            />
          </>
        )}
        <div className={cn('relative', contentClassName)}>{children}</div>
      </div>
    </motion.div>
  );
};

export default AnalyticsCardShell;
                