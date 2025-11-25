import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Flame, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ActivityDay {
  date: string; // ISO date string
  count: number; // Activity count for that day
  level: 0 | 1 | 2 | 3 | 4; // Activity intensity level
}

interface ActivityHeatmapProps {
  activities?: ActivityDay[];
  totalActiveDays?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalSessions?: number;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  activities = [],
  totalActiveDays = 0,
  currentStreak = 0,
  longestStreak = 0,
  totalSessions = 0,
}) => {
  // Generate last 365 days grid data
  const gridData = useMemo(() => {
    const today = new Date();
    const days: ActivityDay[] = [];
    const activityMap = new Map(activities.map((a) => [a.date, a]));

    // Generate 52 weeks (364 days) + adjust to start from Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    
    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    for (let i = 0; i < 371; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const activity = activityMap.get(dateStr);
      
      days.push({
        date: dateStr,
        count: activity?.count ?? 0,
        level: activity?.level ?? 0,
      });
    }

    return days;
  }, [activities]);

  // Group by weeks for vertical layout
  const weeks = useMemo(() => {
    const weeksArray: ActivityDay[][] = [];
    for (let i = 0; i < gridData.length; i += 7) {
      weeksArray.push(gridData.slice(i, i + 7));
    }
    return weeksArray;
  }, [gridData]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getColorClass = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-800';
      case 2:
        return 'bg-emerald-400 dark:bg-emerald-700 border-emerald-500 dark:border-emerald-600';
      case 3:
        return 'bg-emerald-600 dark:bg-emerald-500 border-emerald-700 dark:border-emerald-400';
      case 4:
        return 'bg-emerald-800 dark:bg-emerald-300 border-emerald-900 dark:border-emerald-200';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Card className="relative overflow-hidden border border-emerald-200/40 dark:border-emerald-700/40 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-xl rounded-2xl">
        {/* Decorative Background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-200/10 via-transparent to-teal-200/5 dark:from-emerald-500/5 dark:via-transparent dark:to-teal-500/5" />

        <CardHeader className="relative border-b border-emerald-100/50 dark:border-emerald-500/20 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg">
                <Calendar className="h-6 w-6" />
              </span>
              <div>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Learning Activity</CardTitle>
                <p className="text-xs text-muted-foreground">Your consistency over the year</p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="mt-4 grid grid-cols-4 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-emerald-200/40 bg-emerald-50/50 p-3 backdrop-blur dark:border-emerald-500/20 dark:bg-emerald-900/20"
            >
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <Calendar className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wide">Total Days</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{totalActiveDays}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-orange-200/40 bg-orange-50/50 p-3 backdrop-blur dark:border-orange-500/20 dark:bg-orange-900/20"
            >
              <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                <Flame className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wide">Current Streak</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{currentStreak}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-blue-200/40 bg-blue-50/50 p-3 backdrop-blur dark:border-blue-500/20 dark:bg-blue-900/20"
            >
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wide">Best Streak</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{longestStreak}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-xl border border-purple-200/40 bg-purple-50/50 p-3 backdrop-blur dark:border-purple-500/20 dark:bg-purple-900/20"
            >
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Award className="h-4 w-4" />
                <p className="text-xs font-medium uppercase tracking-wide">Sessions</p>
              </div>
              <p className="mt-1 text-2xl font-bold text-foreground">{totalSessions}</p>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6">
          <div className="space-y-4">
            {/* Month Labels */}
            <div className="flex gap-1 pl-8">
              {weeks.map((week, weekIndex) => {
                const firstDayOfWeek = new Date(week[0].date);
                const showMonth = firstDayOfWeek.getDate() <= 7 || weekIndex === 0;
                
                return (
                  <div key={weekIndex} className="flex-1 min-w-[14px]">
                    {showMonth && (
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {months[firstDayOfWeek.getMonth()]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1">
              {/* Weekday Labels */}
              <div className="flex flex-col gap-1 pr-2">
                {weekDays.map((day, index) => (
                  <div
                    key={day}
                    className={cn(
                      'h-3 w-6 flex items-center justify-end text-[10px] font-medium text-muted-foreground',
                      index % 2 === 1 && 'opacity-0' // Show only Mon, Wed, Fri for cleaner look
                    )}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Activity Grid */}
              <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-300/30 scrollbar-track-transparent">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <Tooltip key={`${weekIndex}-${dayIndex}`}>
                        <TooltipTrigger asChild>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                            whileHover={{ scale: 1.3, zIndex: 10 }}
                            className={cn(
                              'h-3 w-3 rounded-sm border cursor-pointer transition-all duration-200',
                              getColorClass(day.level)
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none shadow-lg">
                          <div className="text-xs">
                            <p className="font-semibold">{formatDate(day.date)}</p>
                            <p className="text-slate-300 dark:text-slate-600">
                              {day.count === 0 ? 'No activity' : `${day.count} ${day.count === 1 ? 'session' : 'sessions'}`}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between pt-4 border-t border-emerald-100/50 dark:border-emerald-500/20">
              <span className="text-xs text-muted-foreground">Less</span>
              <div className="flex items-center gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      'h-3 w-3 rounded-sm border',
                      getColorClass(level)
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">More</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default ActivityHeatmap;
