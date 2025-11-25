// Ultra-advanced, responsive, dark-mode AccuracyTrendsCard
import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from 'lucide-react';
import { ComparisonBar, TimeSeriesChart } from '@/components/Analytic/AdvancedCharts';
import AnalyticsCardShell from './AnalyticsCardShell';

export type TrendHistoryPoint = {
  date: string;
  value: number;
};

export type AccuracyComparison = {
  label: string;
  current: number;
  previous: number;
  format: 'number' | 'percentage';
};

const RANGE_TABS = [
  { id: 'week', label: '7D' },
  { id: 'month', label: '30D' },
  { id: 'year', label: '12M' },
] as const;

type RangeKey = (typeof RANGE_TABS)[number]['id'];

interface AccuracyTrendsCardProps {
  /**
   * Fallback series (used if trendHistoryRanges is not provided)
   */
  trendHistory: TrendHistoryPoint[];
  /**
   * Optional series per range. If not passed, the same
   * trendHistory is used for all ranges.
   */
  trendHistoryRanges?: Partial<Record<RangeKey, TrendHistoryPoint[]>>;
  comparisons: AccuracyComparison[];
  /**
   * Show shimmer loading state for chart + cards
   */
  isLoading?: boolean;
}

const AccuracyTrendsCard: React.FC<AccuracyTrendsCardProps> = ({
  trendHistory,
  trendHistoryRanges,
  comparisons,
  isLoading = false,
}) => {
  const [activeRange, setActiveRange] = useState<RangeKey>('month');

  const activeSeries = useMemo<TrendHistoryPoint[]>(() => {
    return trendHistoryRanges?.[activeRange] ?? trendHistory;
  }, [trendHistoryRanges, activeRange, trendHistory]);

  const overallDelta = useMemo(() => {
    if (!comparisons.length) return 0;
    const avgCurrent =
      comparisons.reduce((sum, c) => sum + c.current, 0) / comparisons.length;
    const avgPrev =
      comparisons.reduce((sum, c) => sum + c.previous, 0) / comparisons.length;
    return avgCurrent - avgPrev;
  }, [comparisons]);

  const bestImprovement = useMemo(() => {
    if (!comparisons.length) return null;
    return comparisons.reduce(
      (best, c) => {
        const delta = c.current - c.previous;
        if (delta > best.delta) {
          return { label: c.label, delta };
        }
        return best;
      },
      { label: '', delta: -Infinity }
    );
  }, [comparisons]);

  const biggestDrop = useMemo(() => {
    if (!comparisons.length) return null;
    return comparisons.reduce(
      (worst, c) => {
        const delta = c.current - c.previous;
        if (delta < worst.delta) {
          return { label: c.label, delta };
        }
        return worst;
      },
      { label: '', delta: Infinity }
    );
  }, [comparisons]);

  const overallTrendColor =
    overallDelta > 0
      ? 'text-emerald-500'
      : overallDelta < 0
      ? 'text-rose-500'
      : 'text-slate-500';

  const overallTrendBadge =
    overallDelta > 0
      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
      : overallDelta < 0
      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
      : 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30';

  return (
    <AnalyticsCardShell
      accent="blue"
      contentClassName="p-6 md:p-8 space-y-8 lg:space-y-10"
    >
      {/* Header + overall trend */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300 shadow-sm">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-500 dark:text-sky-300">
              Trendline
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Accuracy trajectory
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Track your performance across different time horizons.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Last {activeRange === 'week' ? '7 days' : activeRange === 'month' ? '30 days' : '12 months'}
          </span>
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${overallTrendBadge}`}
          >
            {overallDelta > 0 ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : overallDelta < 0 ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            <span>
              {overallDelta > 0
                ? `Improving · +${overallDelta.toFixed(1)} pts`
                : overallDelta < 0
                ? `Dropping · ${overallDelta.toFixed(1)} pts`
                : 'Stable · 0.0 pts'}
            </span>
          </div>
        </div>
      </div>

      {/* Range Tabs + Chart */}
      <div className="space-y-4">
        {/* Animated Tabs */}
        <div className="inline-flex rounded-full border border-sky-100/60 bg-slate-50/80 p-1 text-xs font-medium text-slate-500 dark:border-sky-500/20 dark:bg-slate-900/70 dark:text-slate-300">
          {RANGE_TABS.map((tab) => {
            const isActive = tab.id === activeRange;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRange(tab.id)}
                className="relative mx-0.5 flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="accuracy-range-pill"
                    className="absolute inset-0 rounded-full bg-white shadow-sm dark:bg-slate-800"
                    transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                  />
                )}
                <span className="relative z-10">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time-Series Block */}
        <div className="h-64 md:h-72 rounded-3xl border border-sky-100/60 bg-white/80 dark:border-sky-500/20 dark:bg-slate-950/60 backdrop-blur-xl shadow-sm overflow-hidden">
          {isLoading ? (
            // Shimmer loading state
            <div className="flex h-full flex-col justify-between p-4 animate-pulse">
              <div className="space-y-3">
                <div className="h-4 w-24 rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
                <div className="h-3 w-32 rounded-full bg-slate-200/60 dark:bg-slate-800/70" />
              </div>
              <div className="flex-1 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70" />
              <div className="mt-3 flex gap-2">
                <div className="h-3 flex-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
                <div className="h-3 flex-1 rounded-full bg-slate-200/70 dark:bg-slate-800/80" />
              </div>
            </div>
          ) : activeSeries.length ? (
            <TimeSeriesChart
              data={activeSeries}
              // 👉 Inside your AdvancedCharts implementation,
              // use these hints to style the chart as an area-spline:
              // variant="area"
              // curve="smooth"
              // gradientFrom="rgba(56,189,248,0.35)"
              // gradientTo="rgba(16,185,129,0.05)"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center px-6">
              <TrendingUp className="mb-4 h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                No accuracy history yet
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Start practicing to unlock your trendline.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid + AI insights */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] items-start">
        {/* Metric comparison cards with sparklines */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {comparisons.map((comparison, index) => {
            const delta = comparison.current - comparison.previous;
            const isUp = delta > 0;
            const isDown = delta < 0;

            const badgeClass = isUp
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/30'
              : isDown
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/30'
              : 'bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/30';

            return (
              <motion.div
                key={comparison.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="flex flex-col rounded-2xl border border-sky-100/60 bg-white/80 dark:border-sky-500/20 dark:bg-slate-950/60 backdrop-blur-xl py-4 px-4 shadow-sm"
              >
                {/* Header + trend badge */}
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {comparison.label}
                    </p>
                    <div className="mt-0.5 flex items-baseline gap-1 text-sm">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {comparison.format === 'percentage'
                          ? `${comparison.current.toFixed(1)}%`
                          : comparison.current.toFixed(1)}
                      </span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        {delta > 0
                          ? `+${delta.toFixed(1)} vs prev`
                          : delta < 0
                          ? `${delta.toFixed(1)} vs prev`
                          : 'no change'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeClass}`}
                  >
                    {isUp ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : isDown ? (
                      <ArrowDownRight className="h-3 w-3" />
                    ) : (
                      <Minus className="h-3 w-3" />
                    )}
                    <span>{isUp ? 'Improving' : isDown ? 'Needs attention' : 'Steady'}</span>
                  </span>
                </div>

                {/* Sparkline micro-chart */}
                <div className="mb-2 h-8">
                  {isLoading ? (
                    <div className="h-full w-full animate-pulse rounded-lg bg-slate-100/80 dark:bg-slate-900/60" />
                  ) : (
                    <Sparkline
                      id={`spark-${comparison.label.replace(/\s+/g, '-').toLowerCase()}`}
                      current={comparison.current}
                      previous={comparison.previous}
                    />
                  )}
                </div>

                {/* Comparison bar visual */}
                <div className="mt-auto">
                  <ComparisonBar
                    label=""
                    current={comparison.current}
                    previous={comparison.previous}
                    format={comparison.format}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Insights panel */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-3xl border border-sky-100/60 bg-gradient-to-b from-sky-50/90 via-white/90 to-emerald-50/80 p-4 shadow-sm dark:border-sky-500/30 dark:bg-gradient-to-b dark:from-slate-900/90 dark:via-slate-950/95 dark:to-emerald-950/20"
        >
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600 dark:text-sky-300">
                AI Insights
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                Personalized performance summary
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3 w-3/4 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="h-3 w-5/6 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
              <div className="h-3 w-2/3 rounded-full bg-slate-200/80 dark:bg-slate-800/80" />
            </div>
          ) : (
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>
                  Overall accuracy is{' '}
                  <span className={overallTrendColor}>
                    {overallDelta > 0
                      ? `trending up by ${overallDelta.toFixed(1)} points`
                      : overallDelta < 0
                      ? `down by ${overallDelta.toFixed(1)} points`
                      : 'stable compared to your previous period'}
                  </span>
                  .
                </span>
              </li>

              {bestImprovement && bestImprovement.delta > 0 && (
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                  <span>
                    Your strongest improvement is in{' '}
                    <span className="font-medium text-slate-900 dark:text-white">
                      {bestImprovement.label}
                    </span>{' '}
                    (+{bestImprovement.delta.toFixed(1)}). Keep reinforcing this area to solidify gains.
                  </span>
                </li>
              )}

              {biggestDrop && biggestDrop.delta < 0 && (
                <li className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {biggestDrop.label}
                    </span>{' '}
                    has dipped by {biggestDrop.delta.toFixed(1)}. Consider targeting this in your next few sessions.
                  </span>
                </li>
              )}

              <li className="flex gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-purple-500" />
                <span>
                  For best results, review your{' '}
                  <span className="font-medium">weekly trend (7D)</span> after each practice streak and your{' '}
                  <span className="font-medium">monthly trend (30D)</span> for broader progress patterns.
                </span>
              </li>
            </ul>
          )}
        </motion.div>
      </div>
    </AnalyticsCardShell>
  );
};

export default AccuracyTrendsCard;

/**
 * Minimal inline sparkline component.
 * Plots previous → current as a 2-point mini chart.
 */
interface SparklineProps {
  id: string;
  current: number;
  previous: number;
}

const Sparkline: React.FC<SparklineProps> = ({ id, current, previous }) => {
  const clamp = (v: number) => Math.max(0, Math.min(100, v || 0));

  const prevVal = clamp(previous);
  const currVal = clamp(current);

  // Invert because SVG (0,0) is top-left
  const prevY = 16 - (prevVal / 100) * 14;
  const currY = 16 - (currVal / 100) * 14;

  return (
    <svg
      viewBox="0 0 40 16"
      className="h-full w-full text-sky-400 dark:text-sky-300"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-gradient`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Faint baseline */}
      <line
        x1="0"
        y1="15.5"
        x2="40"
        y2="15.5"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity={0.15}
      />

      {/* Gradient line */}
      <polyline
        points={`0,${prevY.toFixed(2)} 40,${currY.toFixed(2)}`}
        fill="none"
        stroke={`url(#${id}-gradient)`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Dots */}
      <circle cx="0" cy={prevY} r="1.5" fill="white" stroke="currentColor" strokeWidth="1" />
      <circle cx="40" cy={currY} r="1.5" fill="white" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};
