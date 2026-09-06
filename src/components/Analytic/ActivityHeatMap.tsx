import React, { useMemo, useState } from 'react';
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
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const availableYears = useMemo(() => {
    if (!activities.length) return [new Date().getFullYear()];
    const years = activities.map(a => new Date(a.date).getFullYear());
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => b - a);
    
    const currentYear = new Date().getFullYear();
    if (!uniqueYears.includes(currentYear)) {
      uniqueYears.unshift(currentYear);
    }
    return uniqueYears;
  }, [activities]);

  // Generate grid data based on selected year
  const gridData = useMemo(() => {
    const days: ActivityDay[] = [];
    const activityMap = new Map(activities.map((a) => [a.date, a]));
    const currentYear = new Date().getFullYear();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;
    
    if (selectedYear === currentYear) {
      // Last 365 days leading up to today
      startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1);
      startDate.setDate(startDate.getDate() + 1); // exactly 365 days window
      endDate = today;
    } else {
      // Full calendar year
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31);
    }

    // Grid starts on the Sunday of the first week
    const gridStart = new Date(startDate);
    gridStart.setDate(gridStart.getDate() - gridStart.getDay());

    // Grid ends on the Saturday of the last week
    const gridEnd = new Date(endDate);
    gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

    const currentDate = new Date(gridStart);
    while (currentDate <= gridEnd) {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const activity = activityMap.get(dateStr);
      
      // If outside the requested range (e.g., padding days), mark level as -1 to make them invisible
      const isOutOfRange = currentDate < startDate || currentDate > endDate;
      
      days.push({
        date: dateStr,
        count: activity?.count ?? 0,
        level: isOutOfRange ? -1 : (activity?.level ?? 0),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  }, [activities, selectedYear]);

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
      case -1:
        return 'opacity-0 pointer-events-none border-transparent';
      case 0:
        return 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/5';
      case 1:
        return 'bg-emerald-200 dark:bg-emerald-900/60 border-transparent';
      case 2:
        return 'bg-emerald-300 dark:bg-emerald-700/80 border-transparent';
      case 3:
        return 'bg-emerald-500 dark:bg-emerald-500 border-transparent shadow-[0_0_8px_rgba(16,185,129,0.3)]';
      case 4:
        return 'bg-emerald-600 dark:bg-emerald-400 border-transparent shadow-[0_0_12px_rgba(16,185,129,0.6)]';
      default:
        return 'bg-slate-100 dark:bg-white/5 border-slate-200/50 dark:border-white/5';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Card className={cn(
        "relative flex flex-col bg-white dark:bg-[#050C14] rounded-3xl md:rounded-[2rem] p-5 md:p-7 lg:p-8",
        "shadow-[0_15px_40px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_15px_40px_-15px_rgba(16,185,129,0.2)]",
        "border border-slate-100 dark:border-emerald-500/20 transition-all duration-1000 w-full overflow-hidden"
      )}>
        {/* Holographic Background Orbs */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none transition-all duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-[60px] pointer-events-none transition-all duration-1000 delay-100" />

        <div className="relative z-20 flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 lg:pb-8 border-b border-slate-100 dark:border-white/5">
          {/* Header Left & Year Filter */}
          <div className="flex flex-col md:flex-row md:items-start lg:items-center justify-between w-full lg:w-auto gap-4 lg:gap-8">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/10 dark:to-teal-500/10 border border-emerald-100 dark:border-emerald-500/20 shadow-sm overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-emerald-400/20 blur-lg animate-pulse"></div>
                <Calendar className="h-6 w-6 md:h-7 md:w-7 text-emerald-600 dark:text-emerald-400 relative z-10" />
              </div>
              <div>
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-0.5 md:mb-1 flex items-center gap-1.5">
                   Consistency
                </p>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
                  Activity Heatmap
                </h3>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1 bg-slate-50 dark:bg-[#050C14]/50 p-1 rounded-xl border border-slate-200 dark:border-emerald-500/20 shadow-sm">
               {availableYears.map(year => (
                  <button
                     key={year}
                     onClick={() => setSelectedYear(year)}
                     className={cn(
                       "px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300", 
                       selectedYear === year 
                         ? "bg-white dark:bg-[#050C14] text-emerald-600 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20" 
                         : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-[#050C14]"
                     )}
                  >
                    {year}
                  </button>
               ))}
            </div>
          </div>

          {/* Stats Row (Responsive Grid) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 w-full lg:w-auto">
            {/* Stat: Total Days */}
            <div className="bg-slate-50 dark:bg-[#050C14]/50 rounded-xl md:rounded-[1rem] border border-slate-200 dark:border-emerald-500/20 p-3 md:p-4 shadow-sm flex flex-col justify-between hover:bg-white dark:hover:bg-[#050C14] hover:border-emerald-500/30 transition-all cursor-default group relative overflow-hidden min-w-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 opacity-80" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Days</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                {totalActiveDays}
              </span>
            </div>

            {/* Stat: Current Streak */}
            <div className="bg-slate-50 dark:bg-[#050C14]/50 rounded-xl md:rounded-[1rem] border border-slate-200 dark:border-emerald-500/20 p-3 md:p-4 shadow-sm flex flex-col justify-between hover:bg-white dark:hover:bg-[#050C14] hover:border-emerald-500/30 transition-all cursor-default group relative overflow-hidden min-w-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 opacity-80" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Streak</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {currentStreak}
              </span>
            </div>

            {/* Stat: Best Streak */}
            <div className="bg-slate-50 dark:bg-[#050C14]/50 rounded-xl md:rounded-[1rem] border border-slate-200 dark:border-emerald-500/20 p-3 md:p-4 shadow-sm flex flex-col justify-between hover:bg-white dark:hover:bg-[#050C14] hover:border-emerald-500/30 transition-all cursor-default group relative overflow-hidden min-w-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 opacity-80" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Best</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {longestStreak}
              </span>
            </div>

            {/* Stat: Sessions */}
            <div className="bg-slate-50 dark:bg-[#050C14]/50 rounded-xl md:rounded-[1rem] border border-slate-200 dark:border-emerald-500/20 p-3 md:p-4 shadow-sm flex flex-col justify-between hover:bg-white dark:hover:bg-[#050C14] hover:border-emerald-500/30 transition-all cursor-default group relative overflow-hidden min-w-[120px]">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 opacity-80" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Sessions</span>
              </div>
              <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {totalSessions}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-20 pt-6 md:pt-8 w-full">
          <div className="flex flex-col w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-emerald-500/20 dark:scrollbar-thumb-emerald-500/40 scrollbar-track-transparent">
            
            <div className="min-w-[750px] w-full flex flex-col gap-2 md:gap-3">
              {/* Month Labels */}
              <div className="flex w-full mb-1">
                {/* Spacer for Weekday Labels */}
                <div className="w-8 md:w-10 flex-shrink-0"></div>
                {/* Months Grid */}
                <div className="flex-1 grid grid-flow-col gap-[2px] sm:gap-[3px] md:gap-[4px] lg:gap-[5px]" style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))` }}>
                  {weeks.map((week, weekIndex) => {
                    const hasFirstOfMonth = week.some(day => {
                       if (day.level === -1) return false;
                       return parseInt(day.date.split('-')[2], 10) === 1;
                    });
                    
                    const isFirstCol = weekIndex === 0;
                    let monthToDisplay = null;
                    
                    if (hasFirstOfMonth) {
                       const firstDay = week.find(day => day.level !== -1 && parseInt(day.date.split('-')[2], 10) === 1);
                       if (firstDay) {
                         monthToDisplay = months[parseInt(firstDay.date.split('-')[1], 10) - 1];
                       }
                    } else if (isFirstCol) {
                       const firstValidDay = week.find(day => day.level !== -1);
                       if (firstValidDay) {
                         monthToDisplay = months[parseInt(firstValidDay.date.split('-')[1], 10) - 1];
                       }
                    }
                    
                    return (
                      <div key={weekIndex} className="relative flex justify-start h-4">
                        {monthToDisplay && (
                          <span className="absolute left-0 bottom-0 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 whitespace-nowrap z-10">
                            {monthToDisplay}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Heatmap Area */}
              <div className="flex w-full">
                {/* Weekday Labels */}
                <div className="w-8 md:w-10 flex-shrink-0 grid grid-rows-7 gap-[2px] sm:gap-[3px] md:gap-[4px] lg:gap-[5px] pr-2 md:pr-3">
                  {weekDays.map((day, index) => (
                    <div
                      key={day}
                      className={cn(
                        'flex items-center justify-end text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500',
                        index % 2 === 1 && 'opacity-0' // Show only Mon, Wed, Fri
                      )}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Activity Grid */}
                <div className="flex-1 grid grid-rows-7 grid-flow-col gap-[2px] sm:gap-[3px] md:gap-[4px] lg:gap-[5px]">
                  {gridData.map((day, dayIndex) => (
                    <Tooltip key={`day-${dayIndex}`}>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: dayIndex * 0.001 }}
                          whileHover={{ scale: 1.4, zIndex: 10, borderRadius: '4px' }}
                          className={cn(
                            'w-full aspect-square rounded-[2px] md:rounded-sm border cursor-pointer transition-all duration-200',
                            getColorClass(day.level)
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-slate-900 dark:bg-[#050C14] text-white dark:text-white border-none dark:border-solid dark:border dark:border-emerald-500/20 shadow-xl rounded-xl px-3 py-2 z-50">
                        <div className="flex flex-col items-center">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{formatDate(day.date)}</p>
                          <p className="text-sm font-bold">
                            {day.count === 0 ? 'No activity' : `${day.count} ${day.count === 1 ? 'session' : 'sessions'}`}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-2 border-t border-slate-100 dark:border-white/5 w-full min-w-[750px]">
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Less</span>
              <div className="flex items-center gap-[4px] md:gap-[6px]">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={cn(
                      'h-3 w-3 md:h-[14px] md:w-[14px] rounded-[2px] md:rounded-sm border',
                      getColorClass(level)
                    )}
                  />
                ))}
              </div>
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">More</span>
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default ActivityHeatmap;
