import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, MessageSquare, Award, Users, Clock, TrendingUp, ChevronRight, CheckCircle2, Trophy, Mic, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

// Refined theme configuration for activities - Minimal & Educational
const activityConfig = {
  lesson: {
    icon: BookOpen,
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
    dot: 'bg-emerald-500'
  },
  practice: {
    icon: MessageSquare,
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderHover: 'group-hover:border-blue-200 dark:group-hover:border-blue-800',
    dot: 'bg-blue-500'
  },
  achievement: {
    icon: Trophy,
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'group-hover:border-amber-200 dark:group-hover:border-amber-800',
    dot: 'bg-amber-500'
  },
  room: {
    icon: Users,
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderHover: 'group-hover:border-purple-200 dark:group-hover:border-purple-800',
    dot: 'bg-purple-500'
  },
  voice: {
    icon: Mic,
    bg: 'bg-rose-50 dark:bg-rose-900/10',
    iconColor: 'text-rose-600 dark:text-rose-400',
    borderHover: 'group-hover:border-rose-200 dark:group-hover:border-rose-800',
    dot: 'bg-rose-500'
  },
  default: {
    icon: CheckCircle2,
    bg: 'bg-slate-50 dark:bg-slate-900/10',
    iconColor: 'text-slate-600 dark:text-slate-400',
    borderHover: 'group-hover:border-slate-200 dark:group-hover:border-slate-700',
    dot: 'bg-slate-400'
  }
};

export const getActivityStyle = (type: string | undefined) => {
  const typeKey = (type || 'default').toLowerCase();
  return activityConfig[typeKey] || activityConfig.default;
};

// (Helper functions moved to `activityStyles.ts` to avoid exporting non-component values
// from a component file which can break React Fast Refresh.)

const ActivityCard = ({ activities = [] }) => {
  const safeActivities = Array.isArray(activities) ? activities : [];

  return (
    <div className="h-full flex flex-col mt-4">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Activity Log</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Your recent progress</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-8 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:text-emerald-400">
          View All
        </Button>
      </div>

      {/* Timeline Container */}
      <div className="flex-1 relative pl-2">
        
        {/* Vertical Timeline Line */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-200 dark:bg-slate-800"></div>

        <div className="space-y-6">
          {safeActivities.length > 0 ? (
            safeActivities.map((activity, index) => {
              const typeKey = (activity.type || 'default').toLowerCase();
              const theme = activityConfig[typeKey] || activityConfig.default;
              const Icon = theme.icon;

              return (
                <motion.div
                  key={activity.id || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative pl-10"
                >
                  {/* Timeline Dot */}
                  <div className={cn(
                    "absolute left-[15px] top-3 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-950 shadow-sm z-10 transition-colors",
                    theme.dot
                  )}></div>

                  {/* Activity Item */}
                  <div className={cn(
                    "flex items-center justify-between p-3 rounded-2xl border border-transparent transition-all duration-300",
                    "hover:bg-white hover:shadow-md hover:border-slate-100 dark:hover:bg-slate-900 dark:hover:border-slate-800",
                    theme.borderHover
                  )}>
                    
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Icon Box */}
                      <div className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105",
                        theme.bg,
                        theme.iconColor
                      )}>
                        <Icon className="w-5 h-5" strokeWidth={2} />
                      </div>

                      {/* Text Content */}
                      <div className="min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                          {activity.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {activity.type}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {activity.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* XP Badge (Right Side) */}
                    <div className="flex-shrink-0 pl-2">
                       <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                         +20 XP
                       </span>
                    </div>

                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm pl-8">
              No recent activity. Start learning!
            </div>
          )}
        </div>

      </div>
      
      {/* Footer Action */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 pl-10">
         <button className="text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 flex items-center gap-1 transition-colors group">
            View Full History 
            <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
         </button>
      </div>

    </div>
  );
};

export default memo(ActivityCard);