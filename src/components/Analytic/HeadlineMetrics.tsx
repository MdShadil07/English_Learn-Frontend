import React from 'react';
import { motion } from 'framer-motion';
import { TrendIndicator } from '@/components/Analytic/AdvancedCharts';
import type { LucideIcon } from 'lucide-react';
import AnalyticsCardShell, { type AnalyticsAccent } from './AnalyticsCardShell';

type MetricFormat = 'number' | 'percentage';

type HeadlineMetric = {
  label: string;
  value: number;
  previous: number;
  icon: LucideIcon;
  format: MetricFormat;
};

interface HeadlineMetricsProps {
  metrics: HeadlineMetric[];
}

const HeadlineMetrics: React.FC<HeadlineMetricsProps> = ({ metrics }) => {
  if (!metrics.length) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => {
        const accents: AnalyticsAccent[] = ['emerald', 'blue', 'amber', 'purple'];
        const accent = accents[index % accents.length];

        return (
          <AnalyticsCardShell
            key={metric.label}
            accent={accent}
            contentClassName="p-5 md:p-6"
            transition={{ delay: index * 0.05, duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                    {metric.label}
                  </p>
                  <motion.p
                    key={metric.value}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="text-3xl font-semibold text-slate-900 dark:text-white"
                  >
                    {metric.format === 'percentage'
                      ? `${Math.round(metric.value)}%`
                      : Math.round(metric.value).toLocaleString()}
                  </motion.p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>

              <TrendIndicator
                value={metric.value}
                previousValue={metric.previous}
                label="Change"
                format={metric.format}
              />
            </div>
          </AnalyticsCardShell>
        );
      })}
    </div>
  );
};

export type { HeadlineMetric };
export default HeadlineMetrics;
