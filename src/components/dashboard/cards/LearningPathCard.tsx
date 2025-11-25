import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, CheckCircle2, Trophy, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Theme configuration for different path colors
const themeConfig = {
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'group-hover:border-emerald-500/30',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    progressColor: 'bg-emerald-500',
    button: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-emerald-600 dark:hover:bg-emerald-400',
    glow: 'from-emerald-500/10'
  },
  blue: {
    bg: 'bg-blue-500/10',
    border: 'group-hover:border-blue-500/30',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    progressColor: 'bg-blue-500',
    button: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-blue-400',
    glow: 'from-blue-500/10'
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'group-hover:border-purple-500/30',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    progressColor: 'bg-purple-500',
    button: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-purple-600 dark:hover:bg-purple-400',
    glow: 'from-purple-500/10'
  },
  orange: {
    bg: 'bg-orange-500/10',
    border: 'group-hover:border-orange-500/30',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    progressColor: 'bg-orange-500',
    button: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-orange-600 dark:hover:bg-orange-400',
    glow: 'from-orange-500/10'
  },
  default: {
    bg: 'bg-slate-500/10',
    border: 'group-hover:border-slate-500/30',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-slate-600 dark:text-slate-400',
    progressColor: 'bg-slate-500',
    button: 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-700',
    glow: 'from-slate-500/10'
  }
};

const LearningPathCard = ({ path, index = 0, onContinue }) => {
  if (!path) return null;
  
  const colorKey = (path.color || 'default').toLowerCase();
  const theme = themeConfig[colorKey] || themeConfig.default;
  const Icon = path.icon || BookOpen;
  const progressPercent = Math.round(path.progress || 0);
  const isComplete = progressPercent >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="h-full w-full mb-6"
    >
      <div 
        className={cn(
          "group relative flex flex-col justify-between h-full overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500",
          "hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-none hover:-translate-y-1",
          theme.border
        )}
        onClick={() => onContinue?.(path.id)}
      >
        
        {/* Subtle Top Glow */}
        <div className={cn(
          "absolute top-0 inset-x-0 h-32 bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none",
          theme.glow
        )} />

        <div className="relative z-10 p-5 sm:p-6 flex flex-col h-full">
          
          {/* Header: Icon & Badge */}
          <div className="flex justify-between items-start mb-5">
            <div className={cn(
              "p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg",
              theme.iconBg,
              theme.iconColor
            )}>
              <Icon className="w-6 h-6" strokeWidth={2} />
            </div>
            
            <div className="flex flex-col items-end gap-1">
               <Badge variant="outline" className="bg-slate-50/50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-mono text-[10px] px-2 py-1">
                  {path.completedLessons}/{path.totalLessons}
               </Badge>
               {isComplete && (
                 <motion.span 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }}
                   className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5"
                 >
                   <CheckCircle2 className="w-3 h-3" /> Done
                 </motion.span>
               )}
            </div>
          </div>

          {/* Content: Title & Description */}
          <div className="mb-6 flex-grow space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-600 dark:group-hover:from-white dark:group-hover:to-slate-300 transition-all duration-300">
               {path.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {path.description}
            </p>
          </div>

          {/* Footer: Progress & Action */}
          <div className="mt-auto pt-5 border-t border-slate-100 dark:border-slate-800/50">
            
            {/* Progress Bar Section */}
            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                  {isComplete ? 'Completed' : 'Progress'}
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{progressPercent}%</span>
              </div>
              
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className={cn("h-full rounded-full relative", theme.progressColor)}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </motion.div>
              </div>
            </div>

            {/* Action Button */}
            <Button 
              className={cn(
                "w-full h-11 sm:h-12 rounded-xl font-bold shadow-sm transition-all duration-300 border-0 group/btn relative overflow-hidden",
                theme.button
              )}
              onClick={(e) => {
                e.stopPropagation();
                onContinue?.(path.id);
              }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isComplete ? (
                  <>
                    <Trophy className="w-4 h-4" />
                    Review
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Continue
                  </>
                )}
                <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all duration-300" />
              </span>
            </Button>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(LearningPathCard);