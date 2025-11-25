import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AnalyticsCardShell from './AnalyticsCardShell';

export type TopCategory = {
  name: string;
  level: number | string;
  accuracy: number;
  xpEarned: number;
  momentum: number;
};

export type NeedsAttentionCategory = {
  name: string;
  accuracy: number;
  totalAttempts: number;
};

interface CategoryMomentumCardProps {
  topCategories: TopCategory[];
  needsAttention: NeedsAttentionCategory[];
}

const CategoryMomentumCard: React.FC<CategoryMomentumCardProps> = ({ topCategories, needsAttention }) => {
  return (
    <AnalyticsCardShell
      accent="amber"
      backgroundClassName="bg-white dark:bg-slate-950"
      showOrbs={false}
      contentClassName="p-6 md:p-7 space-y-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:bg-amber-400/10 dark:text-amber-300">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500 dark:text-amber-300">Momentum</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Category performance pulse</h3>
          </div>
        </div>
        <span className="text-xs font-medium text-slate-400">Weekly update</span>
      </div>

      <div className="space-y-4">
          <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Top performers</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {topCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="rounded-2xl border border-amber-100/60 bg-white p-4 shadow-sm dark:border-amber-500/20 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</p>
                  <p className="text-xs text-slate-400">Level {category.level}</p>
                </div>
                <Badge className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">
                  {Math.round(category.accuracy)}%
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                <span>{category.xpEarned} XP earned</span>
                <span className="font-semibold text-emerald-500">+{category.momentum}%</span>
              </div>
            </motion.div>
          ))}
          {!topCategories.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-amber-100/60 bg-white p-6 text-center dark:border-amber-500/20 dark:bg-slate-950">
              <Target className="mx-auto mb-2 h-9 w-9 text-slate-300" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No category momentum yet</p>
              <p className="text-xs text-slate-400">Practice to highlight your top strengths.</p>
            </div>
          )}
        </div>
      </div>

      <Separator className="bg-amber-100/60 dark:bg-amber-500/20" />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-rose-500" />
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Needs attention</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {needsAttention.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="rounded-2xl border border-rose-100/60 bg-white p-3 shadow-sm dark:border-rose-500/20 dark:bg-slate-950"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{category.name}</span>
                <Badge variant="outline" className="rounded-full border-rose-200 text-rose-500 dark:border-rose-500/50 dark:text-rose-300">
                  {Math.round(category.accuracy)}%
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-300">
                {category.totalAttempts} attempts • Focus sessions recommended
              </p>
            </motion.div>
          ))}
          {!needsAttention.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-emerald-100/60 bg-white p-4 text-center text-xs font-medium text-emerald-500 dark:border-emerald-500/20 dark:bg-slate-950">
              All categories are performing well 🎉
            </div>
          )}
        </div>
      </div>
    </AnalyticsCardShell>
  );
};

export default CategoryMomentumCard;
