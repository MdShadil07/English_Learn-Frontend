import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Helper to map color strings to Tailwind classes dynamically
// Note: In a real app, ensure these classes are safelisted or use a style map
const getColorClasses = (color) => {
  if (!color) return { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'group-hover:border-slate-500/50', glow: 'from-slate-500/20' };

  const colorMap = {
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'group-hover:border-emerald-500/50', glow: 'from-emerald-500/20' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'group-hover:border-blue-500/50', glow: 'from-blue-500/20' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'group-hover:border-purple-500/50', glow: 'from-purple-500/20' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'group-hover:border-amber-500/50', glow: 'from-amber-500/20' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'group-hover:border-orange-500/50', glow: 'from-orange-500/20' },
    indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'group-hover:border-indigo-500/50', glow: 'from-indigo-500/20' },
    rose: { bg: 'bg-rose-500/10', text: 'text-rose-600', border: 'group-hover:border-rose-500/50', glow: 'from-rose-500/20' },
    // Default fallback
    default: { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'group-hover:border-slate-500/50', glow: 'from-slate-500/20' }
  };
  
  // Extract color name from input (e.g., "from-emerald-500" -> "emerald")
  const colorKey = Object.keys(colorMap).find(key => color.includes(key)) || 'default';
  return colorMap[colorKey];
};

const QuickActionCard = ({ action, index, onActionClick }) => {
  // Guard clause to prevent crashes if action is undefined
  if (!action) return null;

  const theme = getColorClasses(action.color || 'default');
  const Icon = action.icon || ArrowUpRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: 0.1 * (index || 0), 
        duration: 0.5,
        ease: "easeOut"
      }}
      onClick={() => onActionClick && onActionClick(action.id)}
      className="h-full"
    >
      <div 
        className={cn(
          "group relative h-full overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all duration-500 cursor-pointer",
          "hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none hover:-translate-y-1",
          theme.border
        )}
      >
        {/* --- Ambient Background Glow --- */}
        <div className={cn(
          "absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out",
          theme.glow
        )} />
        
        <div className="relative z-10 p-6 flex flex-col h-full">
          
          {/* Header: Icon & Badge */}
          <div className="flex justify-between items-start mb-6">
            <div className={cn(
              "p-3.5 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg",
              theme.bg,
              theme.text
            )}>
              <Icon className="w-6 h-6" strokeWidth={2} />
            </div>

            {action.badge && (
              <Badge className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-0 font-bold px-2.5 py-0.5 shadow-sm">
                {action.badge}
              </Badge>
            )}
          </div>

          {/* Content: Title & Description */}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {action.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {action.description}
            </p>
          </div>

          {/* Footer: Action Arrow */}
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-4">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors uppercase tracking-wider">
              Action
            </span>
            
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1",
              "bg-slate-50 dark:bg-slate-800 group-hover:bg-slate-900 dark:group-hover:bg-white"
            )}>
              <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-white dark:group-hover:text-slate-900" />
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default QuickActionCard;