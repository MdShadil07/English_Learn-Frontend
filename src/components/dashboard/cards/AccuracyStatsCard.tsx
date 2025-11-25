import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
// import the correct type or define locally if not exported
// import { AccuracyResult } from '@/services/AI Chat/accuracyService';

// If the type is not exported, define it locally here:
interface AccuracyResult {
  overall: number;
  adjustedOverall?: number;
  netXP?: number;
  insights?: {
    improvement?: number;
    level?: string;
    strengths: string[];
    weaknesses: string[];
  };
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation?: number;
  capitalization?: number;
  statistics?: {
    grammarErrorCount?: number;
    spellingErrorCount?: number;
    vocabularyErrorCount?: number;
    fluencyErrorCount?: number;
    errorCount?: number;
  };
}

interface AccuracyStatsCardProps {
  accuracy: AccuracyResult;
  showDetailedMetrics?: boolean;
}

const AccuracyStatsCard: React.FC<AccuracyStatsCardProps> = ({ 
  accuracy, 
  showDetailedMetrics = true 
}) => {
  const netXP = accuracy.netXP || 0;
  const isPositiveXP = netXP > 0;
  const improvement = accuracy.insights?.improvement || 0;
  const isImproving = improvement > 0;

  // Error breakdown by category
  const errorStats = [
    { 
      label: 'Grammar', 
      count: accuracy.statistics?.grammarErrorCount || 0,
      color: 'text-rose-600 dark:text-rose-400'
    },
    { 
      label: 'Spelling', 
      count: accuracy.statistics?.spellingErrorCount || 0,
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      label: 'Vocabulary', 
      count: accuracy.statistics?.vocabularyErrorCount || 0,
      color: 'text-amber-600 dark:text-amber-400'
    },
    { 
      label: 'Fluency', 
      count: accuracy.statistics?.fluencyErrorCount || 0,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
  ];

  const totalErrors = accuracy.statistics?.errorCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-6 rounded-2xl bg-gradient-to-br from-white/90 to-emerald-50/60 dark:from-slate-800/90 dark:to-emerald-900/30 backdrop-blur-lg border border-emerald-200/40 dark:border-emerald-700/40 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-lg font-bold text-emerald-900 dark:text-white">Accuracy Stats</h3>
        </div>
        {accuracy.insights && (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
            accuracy.insights.level === 'Expert' && "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
            accuracy.insights.level === 'Advanced' && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
            accuracy.insights.level === 'Intermediate' && "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
            accuracy.insights.level === 'Beginner' && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
          )}>
            <Award className="h-3 w-3" />
            {accuracy.insights.level}
          </div>
        )}
      </div>

      {/* Overall Accuracy with XP Meter */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                {accuracy.overall.toFixed(2)}%
              </p>
              {accuracy.adjustedOverall && accuracy.adjustedOverall !== accuracy.overall && (
                <span className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                  (adj: {accuracy.adjustedOverall.toFixed(2)}%)
                </span>
              )}
            </div>
            <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Overall Accuracy</p>
          </div>
          
          {/* XP Indicator */}
          <div className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold shadow-md",
            isPositiveXP 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
              : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
          )}>
            {isPositiveXP ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{isPositiveXP ? '+' : ''}{netXP} XP</span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.abs(netXP))}%` }}
            transition={{ duration: 0.5 }}
            className={cn(
              "h-full",
              isPositiveXP 
                ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                : "bg-gradient-to-r from-red-500 to-rose-500"
            )}
          />
        </div>

        {/* Improvement Indicator */}
        {improvement !== 0 && (
          <div className="flex items-center gap-1 mt-2">
            {isImproving ? (
              <>
                <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  +{improvement.toFixed(2)}% improvement
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                  {improvement.toFixed(2)}% decline
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      {showDetailedMetrics && (
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Category Scores</h4>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Grammar', value: accuracy.grammar },
              { label: 'Vocabulary', value: accuracy.vocabulary },
              { label: 'Spelling', value: accuracy.spelling },
              { label: 'Fluency', value: accuracy.fluency },
            ].map((category) => (
              <div 
                key={category.label}
                className="p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 border border-emerald-200/30 dark:border-emerald-700/30"
              >
                <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mb-1">{category.label}</p>
                <p className="text-lg font-bold text-emerald-900 dark:text-emerald-200">{category.value.toFixed(2)}%</p>
              </div>
            ))}
          </div>

          {/* Additional Metrics */}
          {(accuracy.punctuation !== undefined || accuracy.capitalization !== undefined) && (
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-200/30 dark:border-emerald-700/30">
              {accuracy.punctuation !== undefined && (
                <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-800/40 border border-emerald-200/20 dark:border-emerald-700/20">
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mb-0.5">Punctuation</p>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{accuracy.punctuation.toFixed(2)}%</p>
                </div>
              )}
              {accuracy.capitalization !== undefined && (
                <div className="p-2 rounded-lg bg-white/40 dark:bg-slate-800/40 border border-emerald-200/20 dark:border-emerald-700/20">
                  <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 mb-0.5">Capitalization</p>
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{accuracy.capitalization.toFixed(2)}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Breakdown */}
      {totalErrors > 0 && (
        <div className="mt-4 pt-4 border-t border-emerald-200/30 dark:border-emerald-700/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
              Error Breakdown ({totalErrors} total)
            </h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {errorStats.filter(stat => stat.count > 0).map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center justify-between p-2 rounded-lg bg-white/40 dark:bg-slate-800/40"
              >
                <span className="text-xs text-emerald-900 dark:text-emerald-200">{stat.label}</span>
                <span className={cn("text-xs font-bold", stat.color)}>{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {accuracy.insights && (accuracy.insights.strengths.length > 0 || accuracy.insights.weaknesses.length > 0) && (
        <div className="mt-4 pt-4 border-t border-emerald-200/30 dark:border-emerald-700/30 space-y-2">
          {accuracy.insights.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {accuracy.insights.strengths.map((strength, i) => (
                  <span 
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}
          {accuracy.insights.weaknesses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-rose-700 dark:text-rose-300 mb-1">Weaknesses:</p>
              <div className="flex flex-wrap gap-1">
                {accuracy.insights.weaknesses.map((weakness, i) => (
                  <span 
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                  >
                    {weakness}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AccuracyStatsCard;
