import React, { useMemo, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Flame, Target, Activity, Trophy, Crown, Sparkles, TrendingUp, Award, Zap, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/components/ui/sidebar';
import {
  useDashboardAnalytics,
  useAccuracyTrends,
  useXPData,
  useLeaderboardData,
  LeaderboardQueryParams,
  AccuracyHistoryPoint,
  AccuracyDataSummary,
  LeaderboardEntry,
} from '@/services/analyticsService';
import AnalyticsHero from '@/components/Analytic/AnalyticHero';
import PerformanceIntelligence from '@/components/Analytic/PerformanceIntelligence';
import HeadlineMetrics, { HeadlineMetric } from '@/components/Analytic/HeadlineMetrics';
import AccuracyTrendsCard, {
  AccuracyComparison,
  TrendHistoryPoint,
} from '@/components/Analytic/AccuracyTrendsCard';
import LiveAccuracySnapshotCard from '@/components/Analytic/LiveAccuracySnapshotCard';
import CategoryMomentumCard, {
  TopCategory,
  NeedsAttentionCategory,
} from '@/components/Analytic/CategoryMomentumCard';
import ActivityOverviewCard from '@/components/Analytic/ActivityOverviewCard';
import LeaderboardCard, {
  LeaderboardTimeframeValue,
  LeaderboardTierValue,
} from '@/components/Analytic/LeaderboardCard';
import AiCoachInsightsCard from '@/components/Analytic/AiCoachingInsightsCard';
import ActivityHeatmap from '@/components/Analytic/ActivityHeatMap';
import EnterpriseAccuracyDisplay from '@/components/Analytic/EnterpriseAccuracyDisplay';
import RealtimeAccuracyDashboard from '@/components/Analytic/RealtimeAccuracyDashboard';
import SparklineChart from '@/components/Analytic/SparklineChart';
import TopPerformerCard from '@/components/Analytic/TopPerformerCard';
import AnalyticsCardShell from '@/components/Analytic/AnalyticsCardShell';
import { ProgressRing } from '@/components/Analytic/AdvancedCharts';
import type { AccuracyResult } from '@/utils/AI Chat/accuracy/accuracyCalculator';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import UpgradeToast from '@/components/ui/UpgradeToast';
import { resolveUserTier } from '@/utils/tierUtils';

type AuthUser = {
  _id?: string;
  id?: string;
  tier?: string;
  subscriptionTier?: string;
  isPremium?: boolean;
  isPro?: boolean;
  profile?: {
    isPremium?: boolean;
    isPro?: boolean;
    subscriptionStatus?: string;
  };
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const leaderboardMetricOptions = [
  { label: 'Total XP', value: 'xp' },
  { label: 'Weekly XP', value: 'weeklyXP' },
  { label: 'Monthly XP', value: 'monthlyXP' },
  { label: 'Accuracy', value: 'accuracy' },
  { label: 'Grammar', value: 'grammar' },
  { label: 'Vocabulary', value: 'vocabulary' },
  { label: 'Fluency', value: 'fluency' },
  { label: 'Streak', value: 'streak' },
  { label: 'Sessions', value: 'sessions' },
];

const leaderboardTimeframes: Array<{ label: string; value: LeaderboardTimeframeValue }> = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All Time', value: 'all' },
];

const leaderboardTierFilters: Array<{ label: string; value: LeaderboardTierValue }> = [
  { label: 'All Learners', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Premium', value: 'premium' },
];

const AnalyticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const { state: sidebarState } = useSidebar();
  const isSidebarExpanded = sidebarState === 'expanded';
  const authUser = (user ?? null) as AuthUser | null;
  const userId = authUser?._id || authUser?.id || '';
  
  const userTier = resolveUserTier(authUser as AuthUser | null);
  const isPremium = userTier === 'premium';
  const isPro = userTier === 'pro' || isPremium;

  const [leaderboardMetric, setLeaderboardMetric] = useState<string>('xp');
  const [leaderboardTimeframe, setLeaderboardTimeframe] = useState<LeaderboardTimeframeValue>('week');
  const [leaderboardTier, setLeaderboardTier] = useState<LeaderboardTierValue>('all');

  const dashboardQuery = useDashboardAnalytics(userId, 'week', {
    enabled: Boolean(userId),
  });

  const accuracyDays = 30;
  const accuracyQuery = useAccuracyTrends(userId, accuracyDays, {
    enabled: Boolean(userId),
  });

  const xpQuery = useXPData(userId, 'week', {
    enabled: Boolean(userId),
  });

  const leaderboardParams: LeaderboardQueryParams = useMemo(
    () => ({
      metric: leaderboardMetric,
      timeframe: leaderboardTimeframe,
      tier: leaderboardTier,
      limit: 10,
      direction: 'desc',
    }),
    [leaderboardMetric, leaderboardTimeframe, leaderboardTier]
  );

  const leaderboardQuery = useLeaderboardData(leaderboardParams, {
    enabled: true,
  });

  const isLoading =
    dashboardQuery.isLoading || accuracyQuery.isLoading || xpQuery.isLoading || leaderboardQuery.isLoading;

  const overview = dashboardQuery.data?.overview;
  const recentActivity = dashboardQuery.data?.recentActivity;
  const xpBreakdown = xpQuery.data;
  const accuracyTrends = accuracyQuery.data;
  const categoryPerformance = dashboardQuery.data?.categoryPerformance;
  const accuracySummary = dashboardQuery.data?.accuracyData;
  const analyticsSnapshot = dashboardQuery.data?.analytics;

  const rawTier = (authUser?.subscriptionTier || authUser?.tier || 'free').toUpperCase();
  const normalizedTier: 'FREE' | 'PRO' | 'PREMIUM' = rawTier === 'PRO' ? 'PRO' : rawTier === 'PREMIUM' ? 'PREMIUM' : 'FREE';
  const isPremiumUser = normalizedTier === 'PREMIUM' || normalizedTier === 'PRO';
  const tierMultiplier = normalizedTier === 'PREMIUM' ? 1.5 : normalizedTier === 'PRO' ? 1.25 : 1;

  
  // Reusable upgrade toast component (renders nothing) — placed here so it shows on analytics page
  // It will show only for non-premium users and is suppressed via localStorage when dismissed.
  
  // Render the component (it runs its own effect)
  // Mount the upgrade toast so the effect runs when the analytics page loads
  const _upgradeToast = <UpgradeToast isPremiumUser={isPremiumUser} />;

  const latestTrend = accuracyTrends?.history?.slice(-1)[0];
  const previousTrend = accuracyTrends?.history?.[0];

  const trendHistory = useMemo<TrendHistoryPoint[]>(
    () =>
      (accuracyTrends?.history ?? []).map((point: AccuracyHistoryPoint) => ({
        date: new Date(point.date).toISOString(),
        value: toNumber(point.overall),
      })),
    [accuracyTrends]
  );

  const aiCoachInsights = useMemo(() => {
    const strength = categoryPerformance?.topCategories?.[0];
    const weakness = categoryPerformance?.needsImprovement?.[0];

    // Calculate momentum from accuracy (since momentum isn't in the API response)
    const momentum = strength ? Math.min(strength.accuracy, 100) : 0;

    return {
      headline: `Your learning velocity is trending up, focus on ${weakness?.name || 'grammar'} to accelerate growth.`,
      strength: {
        area: strength?.name || 'Vocabulary',
        metric: `+${Math.round(momentum)}% momentum`,
      },
      weakness: {
        area: weakness?.name || 'Tenses',
        metric: `Accuracy at ${Math.round(weakness?.accuracy || 0)}%`,
      },
      recommendation: `Practice with interactive lessons on past, present, and future tenses to improve your sentence structure.`,
    };
  }, [categoryPerformance]);

  const mockAccuracyData: AccuracyResult = useMemo(() => {
    const summary: AccuracyDataSummary | undefined = accuracySummary;
    const errorsByType = {
      grammar: toNumber(summary?.errorsByType?.grammar),
      spelling: toNumber(summary?.errorsByType?.spelling),
      punctuation: toNumber(summary?.errorsByType?.punctuation),
      vocabulary: toNumber(summary?.errorsByType?.vocabulary),
      syntax: toNumber(summary?.errorsByType?.syntax),
    };

    const featureFlags = {
      detailedExplanations: normalizedTier !== 'FREE',
      toneAnalysis: normalizedTier !== 'FREE',
      readabilityMetrics: normalizedTier !== 'FREE',
      vocabularyAnalysis: true,
      styleAnalysis: normalizedTier !== 'FREE',
      coherenceAnalysis: normalizedTier === 'PREMIUM',
      premiumInsights: normalizedTier === 'PREMIUM',
      advancedGrammar: normalizedTier !== 'FREE',
      idiomaticExpressions: normalizedTier === 'PREMIUM',
    };

    const analysisDepth =
      normalizedTier === 'PREMIUM' ? 'comprehensive' : normalizedTier === 'PRO' ? 'detailed' : 'standard';

    return {
  overall: toNumber(summary?.overall),
  adjustedOverall: toNumber(summary?.adjustedOverall ?? summary?.overall),
  grammar: toNumber(summary?.grammar),
  vocabulary: toNumber(summary?.vocabulary),
  spelling: toNumber(summary?.spelling),
  fluency: toNumber(summary?.fluency),
  punctuation: toNumber(summary?.punctuation),
  capitalization: toNumber(summary?.capitalization),
  syntax: toNumber(summary?.syntax),
  coherence: toNumber(summary?.coherence),
  score: toNumber(summary?.overall),
  hasErrors: toNumber(summary?.totalErrors) > 0,
    errors: [],
    suggestions: [],
    feedback: [],
    statistics: {
      wordCount: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      avgWordsPerSentence: 0,
      avgSyllablesPerWord: 0,
      complexWordCount: 0,
      uniqueWordRatio: 0,
  errorCount: toNumber(summary?.totalErrors),
  criticalErrorCount: toNumber(summary?.criticalErrors),
      spellingErrorCount: errorsByType.spelling,
      grammarErrorCount: errorsByType.grammar,
      vocabularyErrorCount: errorsByType.vocabulary,
      fluencyErrorCount: 0,
      punctuationErrorCount: errorsByType.punctuation,
  capitalizationErrorCount: toNumber(summary?.errorsByType?.capitalization),
      errorsByCategory: errorsByType,
    },
    insights: {
      level: 'Intermediate',
      strengths: [],
      weaknesses: [],
      improvement:
        latestTrend && previousTrend
          ? toNumber(latestTrend.overall) - toNumber(previousTrend.overall)
          : toNumber(accuracyTrends?.improvement),
      nextSteps: [],
      learningPath: [],
    },
    xpEarned: 0,
    xpPenalty: 0,
    netXP: 0,
    bonusXP: 0,
    tierMultiplier,
    tierInfo: {
      tier: normalizedTier,
      multiplier: tierMultiplier,
      analysisDepth,
      featuresUnlocked: featureFlags,
    },
    };
  }, [accuracySummary, accuracyTrends?.improvement, latestTrend, normalizedTier, previousTrend, tierMultiplier]);

  const recentEventAmount = toNumber((xpBreakdown?.recentEvents?.[0] as { amount?: number })?.amount);

  const headlineMetrics: HeadlineMetric[] = [
    {
      label: 'Total XP',
      value: toNumber(overview?.totalXP),
      previous: Math.max(0, toNumber(overview?.totalXP) - recentEventAmount),
      icon: Trophy,
      format: 'number' as const,
    },
    {
      label: 'Overall Accuracy',
      value: toNumber(overview?.overallAccuracy),
      previous: toNumber(previousTrend?.overall),
      icon: Target,
      format: 'percentage' as const,
    },
    {
      label: 'Active Streak',
      value: toNumber(overview?.streak),
      previous: Math.max(0, toNumber(overview?.streak) - 1),
      icon: Flame,
      format: 'number' as const,
    },
    {
      label: 'Total Sessions',
      value: toNumber(recentActivity?.totalSessions),
      previous: Math.max(0, toNumber(recentActivity?.totalSessions) - 1),
      icon: Activity,
      format: 'number' as const,
    },
  ];

  const accuracyComparisons: AccuracyComparison[] = [
    {
      label: 'Overall Accuracy',
      current: toNumber(latestTrend?.overall ?? overview?.overallAccuracy),
      previous: toNumber(previousTrend?.overall),
      format: 'percentage',
    },
    {
      label: 'Grammar',
      current: toNumber(latestTrend?.grammar ?? accuracySummary?.grammar),
      previous: toNumber(previousTrend?.grammar),
      format: 'percentage',
    },
    {
      label: 'Vocabulary',
      current: toNumber(latestTrend?.vocabulary ?? accuracySummary?.vocabulary),
      previous: toNumber(previousTrend?.vocabulary),
      format: 'percentage',
    },
    {
      label: 'Fluency',
      current: toNumber(accuracySummary?.fluency),
      previous: toNumber(previousTrend?.fluency),
      format: 'percentage',
    },
  ];

  const baselineAccuracy = toNumber(previousTrend?.overall);

  const topCategoriesData: TopCategory[] = (categoryPerformance?.topCategories || []).map((category) => ({
    name: category.name,
    level: category.level,
    accuracy: toNumber(category.accuracy),
    xpEarned: toNumber(category.xpEarned),
    momentum: Math.round((toNumber(category.accuracy) - baselineAccuracy) * 10) / 10,
  }));

  const needsAttentionData: NeedsAttentionCategory[] = (categoryPerformance?.needsImprovement || []).map((category) => ({
    name: category.name,
    accuracy: toNumber(category.accuracy),
    totalAttempts: toNumber(category.totalAttempts),
  }));

  const xpTotalInPeriod = toNumber(xpBreakdown?.totalInPeriod ?? xpBreakdown?.totalXP);
  const xpEventCount = toNumber(xpBreakdown?.eventCount);

  const activityOverviewData = {
    totalTimeMinutes: toNumber(recentActivity?.totalTimeSpent),
    totalSessions: toNumber(recentActivity?.totalSessions),
    xpValue: xpTotalInPeriod,
    xpPrevious: Math.max(0, xpTotalInPeriod - xpEventCount),
    consistencyScore: toNumber(analyticsSnapshot?.consistencyScore),
    consistencyPrevious: Math.max(0, toNumber(analyticsSnapshot?.consistencyScore) - 5),
  };

  const leaderboardEntries = useMemo<LeaderboardEntry[]>(
    () =>
      (leaderboardQuery.data?.leaderboard ?? []).map((entry) => ({
        ...entry,
        metricValue: toNumber(entry.metricValue),
        user: {
          ...entry.user,
          avatar:
            (entry.user as { avatar?: string | null }).avatar ?? entry.user.avatarUrl ?? null,
          avatarUrl:
            entry.user.avatarUrl ?? (entry.user as { avatar?: string | null }).avatar ?? null,
        },
        progress: {
          ...entry.progress,
          totalXP: toNumber(entry.progress.totalXP),
          weeklyXP: toNumber(entry.progress.weeklyXP),
          monthlyXP: toNumber(entry.progress.monthlyXP),
          streak: {
            current: toNumber(entry.progress.streak?.current),
            longest: toNumber(entry.progress.streak?.longest),
          },
          accuracy: {
            ...entry.progress.accuracy,
            overall: toNumber(entry.progress.accuracy?.overall),
            grammar: toNumber(entry.progress.accuracy?.grammar),
            vocabulary: toNumber(entry.progress.accuracy?.vocabulary),
            spelling: toNumber(entry.progress.accuracy?.spelling),
            fluency: toNumber(entry.progress.accuracy?.fluency),
          },
          sessions: toNumber(entry.progress.sessions),
          timeSpent: toNumber(entry.progress.timeSpent),
        },
        analytics: {
          ...entry.analytics,
          improvementRate: toNumber(entry.analytics?.improvementRate),
          learningVelocity: toNumber(entry.analytics?.learningVelocity),
          consistencyScore: toNumber(entry.analytics?.consistencyScore),
          recommendedFocus: entry.analytics?.recommendedFocus ?? [],
        },
      })),
    [leaderboardQuery.data?.leaderboard]
  );

  return (
    <ScrollArea className="h-full w-full">
      {_upgradeToast}
      <div className="min-h-screen w-full">
        <div className="flex-1 space-y-8 px-0 pt-4 md:pt-6">
          {/* ============================================ */}
          {/* ADVANCED ANALYTICS HEADER */}
          {/* ============================================ */}
          <AnalyticsHero user={user} />

          

          {/* ============================================ */}
          {/* PERFORMANCE INTELLIGENCE - AI INSIGHTS */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PerformanceIntelligence
              strengths={[
                {
                  category: categoryPerformance?.topCategories?.[0]?.name || 'Vocabulary',
                  score: toNumber(categoryPerformance?.topCategories?.[0]?.accuracy) || 0,
                  improvement: 12,
                  momentum: 'Rising ↗️',
                },
                {
                  category: categoryPerformance?.topCategories?.[1]?.name || 'Grammar',
                  score: toNumber(categoryPerformance?.topCategories?.[1]?.accuracy) || 0,
                  improvement: 8,
                  momentum: 'Stable →',
                },
              ]}
              weaknesses={[
                {
                  category: categoryPerformance?.needsImprovement?.[0]?.name || 'Fluency',
                  score: toNumber(categoryPerformance?.needsImprovement?.[0]?.accuracy) || 0,
                  decline: 5,
                  recommendation: 'Practice with conversation exercises to improve fluency',
                },
              ]}
              learningVelocity={{
                current: 15,
                trend: 'up',
                comparison: "You're learning 15% faster than last week",
              }}
              predictedLevelUp={isPremium ? {
                date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                daysRemaining: 7,
                confidence: 87,
              } : undefined}
              optimalPracticeTimes={isPro ? ['9:00 AM', '2:00 PM', '7:00 PM'] : undefined}
              tier={userTier}
              onUpgrade={() => window.location.href = '/pricing'}
            />
          </motion.div>

          {/* ============================================ */}
          {/* COMPETITIVE LEADERBOARD */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    Global Leaderboard
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Compete with learners worldwide 🌍
                  </p>
                </div>
              </div>
            </div>
            
            <div className={cn('grid grid-cols-1 gap-6 xl:items-start', 'lg:grid-cols-10')}>
              {/* Left: leaderboard column (≈60% width on large screens) */}
              <div className="lg:col-span-6 flex">
                <div className="w-full">
                  <LeaderboardCard
                    metric={leaderboardMetric}
                    timeframe={leaderboardTimeframe}
                    tier={leaderboardTier}
                    currentUserId={userId}
                    isPremiumUser={isPremiumUser}
                    metricOptions={leaderboardMetricOptions}
                    timeframeOptions={leaderboardTimeframes}
                    tierOptions={leaderboardTierFilters}
                    onMetricChange={setLeaderboardMetric}
                    onTimeframeChange={setLeaderboardTimeframe}
                    onTierChange={setLeaderboardTier}
                    entries={leaderboardEntries}
                  />
                </div>
              </div>

              {/* Right: stacked learning overview (momentum) + AI coach (≈40% width) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <ActivityOverviewCard
                  totalTimeMinutes={activityOverviewData.totalTimeMinutes}
                  totalSessions={activityOverviewData.totalSessions}
                  xpValue={activityOverviewData.xpValue}
                  xpPrevious={activityOverviewData.xpPrevious}
                  consistencyScore={activityOverviewData.consistencyScore}
                  consistencyPrevious={activityOverviewData.consistencyPrevious}
                />

                <AiCoachInsightsCard isPremium={isPremium} insights={aiCoachInsights} />
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* ACCURACY & PERFORMANCE METRICS */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Performance Metrics
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Track your accuracy and progress over time 📈
                </p>
              </div>
            </div>

            <HeadlineMetrics metrics={headlineMetrics} />
          </motion.div>

          {/* ============================================ */}
          {/* DETAILED ANALYTICS GRID */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Live Accuracy Snapshot */}
            <div>
              <LiveAccuracySnapshotCard accuracyData={mockAccuracyData} />
            </div>

            {/* Category Momentum */}
            <div>
              <CategoryMomentumCard topCategories={topCategoriesData} needsAttention={needsAttentionData} />
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* TRENDS & ACTIVITY OVERVIEW */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 gap-6"
          >
            <AccuracyTrendsCard trendHistory={trendHistory} comparisons={accuracyComparisons} />
          </motion.div>

          {/* ============================================ */}
          {/* ADDITIONAL ANALYTICS - utilize more components */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <ActivityHeatmap
                activities={undefined}
                totalActiveDays={toNumber(recentActivity?.totalActiveDays)}
                currentStreak={toNumber(overview?.streak)}
                longestStreak={toNumber(recentActivity?.longestStreak)}
                totalSessions={toNumber(recentActivity?.totalSessions)}
              />

              <RealtimeAccuracyDashboard />
            </div>

            <div className="space-y-6">
              <AnalyticsCardShell accent="blue" showOrbs>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Overall Accuracy</h3>
                  <ProgressRing value={Math.round(mockAccuracyData.overall || 0)} label={`${Math.round(mockAccuracyData.overall || 0)}%`} />
                </div>
              </AnalyticsCardShell>

              <AnalyticsCardShell accent="emerald">
                <div className="p-4 space-y-3">
                  <h4 className="text-sm font-medium">Top Performers</h4>
                  <div className="space-y-3">
                    {(leaderboardEntries || []).slice(0, 3).map((entry) => (
                      <TopPerformerCard
                        key={entry.user.id || entry.user.username}
                        entry={entry}
                        isCurrentUser={(entry.user.id) === userId}
                        isPremiumUser={isPremiumUser}
                        onAvatarError={() => {}}
                        sidebarState={isSidebarExpanded ? 'expanded' : 'collapsed'}
                      />
                    ))}
                  </div>
                </div>
              </AnalyticsCardShell>

            </div>
          </motion.div>

          {/* Premium Upgrade CTA - Only for Free Users */}
          {!isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 p-8 border-2 border-amber-200/50 dark:border-amber-700/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 animate-pulse"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl">
                    <Crown className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 mb-2">
                      Unlock Premium Analytics
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Get AI predictions, advanced insights, and personalized learning paths
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.location.href = '/pricing'}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-xl hover:shadow-2xl transition-all text-lg px-8"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Upgrade Now
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default AnalyticsDashboard;