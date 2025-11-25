import React from 'react';
import { Activity, ArrowUpRight, Gauge, Sparkles } from 'lucide-react';
import type { AccuracyResult } from '@/utils/AI Chat/accuracy/accuracyCalculator';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnalyticsCardShell from './AnalyticsCardShell';

interface LiveAccuracySnapshotCardProps {
  accuracyData?: AccuracyResult | null;
}

const LiveAccuracySnapshotCard: React.FC<LiveAccuracySnapshotCardProps> = ({ accuracyData }) => {
  const safePercent = (value?: number | null) => {
    const normalized = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    return Math.round(normalized);
  };

  const headline = safePercent(accuracyData?.adjustedOverall ?? accuracyData?.overall);
  const primaryMetrics = [
    { label: 'Grammar', value: safePercent(accuracyData?.grammar) },
    { label: 'Vocabulary', value: safePercent(accuracyData?.vocabulary) },
    { label: 'Fluency', value: safePercent(accuracyData?.fluency) },
    { label: 'Spelling', value: safePercent(accuracyData?.spelling) },
  ];

  const supportMetrics = [
    { label: 'Punctuation', value: safePercent(accuracyData?.punctuation) },
    { label: 'Capitalization', value: safePercent(accuracyData?.capitalization) },
    { label: 'Syntax', value: safePercent(accuracyData?.syntax) },
    { label: 'Coherence', value: safePercent(accuracyData?.coherence) },
  ].filter((metric) => metric.value > 0);

  return (
    <AnalyticsCardShell accent="purple" contentClassName="p-6 md:p-7 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-600 dark:bg-purple-400/10 dark:text-purple-300">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-500 dark:text-purple-300">Live Accuracy</p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Snapshot of your current performance</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-300">
          <Gauge className="h-4 w-4 text-purple-500" />
          Adaptive analysis running
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr,1fr]">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-purple-200/40 dark:bg-slate-950 dark:ring-purple-500/20">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-400">Overall accuracy</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.span
                key={headline}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="text-6xl font-semibold text-slate-900 dark:text-white"
              >
                {headline}%
              </motion.span>
              {headline >= 90 && <Sparkles className="h-6 w-6 text-amber-400" />}
            </div>
            {accuracyData?.tierInfo && (
              <Badge className="rounded-full bg-purple-500/90 px-4 py-1 text-xs font-medium text-white shadow-sm">
                Tier {accuracyData.tierInfo.tier} • {accuracyData.tierInfo.multiplier}x
              </Badge>
            )}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {primaryMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                className="rounded-xl border border-purple-100/40 bg-white p-4 shadow-[0_6px_18px_-12px_rgba(124,58,237,0.18)] dark:border-purple-500/20 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{metric.label}</p>
                  <span className="flex items-center gap-1 text-xs font-medium text-purple-500">
                    <ArrowUpRight className="h-3 w-3" />
                    {metric.value}%
                  </span>
                </div>
                <Progress value={metric.value} className="mt-3 h-1.5" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-purple-100/50 bg-white px-5 py-4 text-sm shadow-sm dark:border-purple-500/20 dark:bg-slate-950">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Key signals</p>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-center justify-between">
                <span>Recent accuracy drift</span>
                <span className="font-semibold text-purple-500">Stable</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Grammar consistency</span>
                <span className="font-semibold text-purple-500">{primaryMetrics[0]?.value ?? 0}%</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Confidence score</span>
                <span className="font-semibold text-purple-500">High</span>
              </li>
            </ul>
          </div>

          {supportMetrics.length > 0 && (
            <div className="rounded-2xl border border-purple-100/50 bg-white px-5 py-4 shadow-sm dark:border-purple-500/20 dark:bg-slate-950">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-slate-400">Support metrics</p>
              <div className="mt-3 grid gap-3 text-sm">
                {supportMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-300">{metric.label}</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{metric.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnalyticsCardShell>
  );
};

export default LiveAccuracySnapshotCard;
