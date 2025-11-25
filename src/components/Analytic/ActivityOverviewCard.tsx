import React from 'react';
import { TrendIndicator, ProgressRing } from '@/components/Analytic/AdvancedCharts';
import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsCardShell from './AnalyticsCardShell';

interface ActivityOverviewCardProps {
  totalTimeMinutes: number;
  totalSessions: number;
  xpValue: number;
  xpPrevious: number;
  consistencyScore: number;
  consistencyPrevious: number;
}

const ActivityOverviewCard: React.FC<ActivityOverviewCardProps> = ({
  totalTimeMinutes,
  totalSessions,
  xpValue,
  xpPrevious,
  consistencyScore,
  consistencyPrevious,
}) => {
  return (
    <AnalyticsCardShell accent="emerald" contentClassName="p-6 md:p-7 space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 dark:text-emerald-300">Activity</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Learning momentum overview</h3>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">Updated live</span>
      </div>

      <div className="grid gap-6 md:grid-cols-[1.2fr,1fr] md:items-center">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-300">Total study time</p>
            <p className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">
              {totalTimeMinutes}
              <span className="ml-1 text-base font-medium text-slate-500 dark:text-slate-300">min</span>
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-100/60 bg-white p-4 shadow-sm dark:border-emerald-500/20 dark:bg-slate-950">
            <TrendIndicator value={xpValue} previousValue={xpPrevious} label="XP gained" format="number" />
            <div className="mt-4 border-t border-emerald-100/60 pt-4 dark:border-emerald-500/20">
              <TrendIndicator
                value={consistencyScore}
                previousValue={consistencyPrevious}
                label="Consistency score"
                format="percentage"
              />
            </div>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto flex flex-col items-center gap-4"
        >
          <ProgressRing
            value={totalSessions}
            max={100}
            size={140}
            strokeWidth={10}
            label="Sessions"
            subLabel="Lifetime"
            gradient="from-emerald-500 to-teal-500"
          />
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            Keep streaking to unlock richer momentum insights.
          </p>
        </motion.div>
      </div>
    </AnalyticsCardShell>
  );
};

export default ActivityOverviewCard;
