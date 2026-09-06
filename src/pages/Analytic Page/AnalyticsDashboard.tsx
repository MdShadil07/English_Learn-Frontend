import React, { useMemo, useState, Suspense } from 'react';
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

const LiveAccuracySnapshotCard = React.lazy(() => import('@/components/Analytic/LiveAccuracySnapshotCard'));

import type {
  TopCategory,
  NeedsAttentionCategory,
} from '@/components/Analytic/CategoryMomentumCard';
const CategoryMomentumCard = React.lazy(() => import('@/components/Analytic/CategoryMomentumCard'));

const ActivityOverviewCard = React.lazy(() => import('@/components/Analytic/ActivityOverviewCard'));

import type {
  LeaderboardTimeframeValue,
  LeaderboardTierValue,
} from '@/components/Analytic/LeaderboardCard';
const LeaderboardCard = React.lazy(() => import('@/components/Analytic/LeaderboardCard'));

const AiCoachInsightsCard = React.lazy(() => import('@/components/Analytic/AiCoachingInsightsCard'));
const EnglishAgeCard = React.lazy(() => import('@/components/Analytic/EnglishAgeCard'));
const ActivityHeatmap = React.lazy(() => import('@/components/Analytic/ActivityHeatMap'));
const RealtimeAccuracyDashboard = React.lazy(() => import('@/components/Analytic/RealtimeAccuracyDashboard'));

const PredictiveForecastingCard = React.lazy(() => import('@/components/Analytic/PredictiveForecastingCard'));
const PhonemeRadarCard = React.lazy(() => import('@/components/Analytic/PhonemeRadarCard'));
const ToneSentimentCard = React.lazy(() => import('@/components/Analytic/ToneSentimentCard'));

import AnalyticsCardShell from '@/components/Analytic/AnalyticsCardShell';

// A sleek glassmorphic skeleton loader for lazy-loaded components
const SkeletonCard = () => (
  <div className="w-full h-full min-h-[300px] rounded-3xl bg-white/5 dark:bg-[#050C14]/50 border border-slate-200/50 dark:border-emerald-500/10 p-6 flex flex-col gap-4 animate-pulse backdrop-blur-sm">
    <div className="h-6 w-1/3 bg-slate-200 dark:bg-emerald-500/20 rounded-md"></div>
    <div className="flex-1 w-full bg-slate-100 dark:bg-emerald-500/5 rounded-2xl"></div>
  </div>
);
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

  const accuracyDays = 365;
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



  const isNewUser = (recentActivity?.totalTimeSpent || 0) === 0 && (recentActivity?.totalSessions || 0) === 0;

  const aiCoachInsights = useMemo(() => {
    if (isNewUser) {
      return {
        headline: "Welcome! Complete your first speaking lesson to receive personalized AI coaching and tracking.",
        strength: {
          area: "Getting Started",
          metric: "Pending Assessment",
        },
        weakness: {
          area: "Pronunciation",
          metric: "Pending Assessment",
        },
        recommendation: "Try a quick 5-minute introductory lesson to let Coach Nova analyze your baseline skills.",
      };
    }

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
  }, [categoryPerformance, isNewUser]);

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



  const baselineAccuracy = toNumber(previousTrend?.overall);

  const topCategoriesData: TopCategory[] = useMemo(() => {
    if (categoryPerformance?.topCategories && categoryPerformance.topCategories.length > 0) {
      return categoryPerformance.topCategories.map((category: any) => ({
        name: category.name,
        level: category.level || 1,
        accuracy: toNumber(category.accuracy),
        xpEarned: toNumber(category.xpEarned),
        momentum: Math.round((toNumber(category.accuracy) - baselineAccuracy) * 10) / 10,
      }));
    }

    // Fallback: Dynamically compute from real-time AI chat accuracy summary if formal categories are empty
    const summary = accuracySummary || {};
    const metrics = [
      { name: 'Grammar', acc: toNumber(summary.grammar), xp: 120 },
      { name: 'Vocabulary', acc: toNumber(summary.vocabulary), xp: 95 },
      { name: 'Spelling', acc: toNumber(summary.spelling), xp: 60 },
      { name: 'Fluency', acc: toNumber(summary.fluency), xp: 85 },
      { name: 'Punctuation', acc: toNumber(summary.punctuation), xp: 40 },
    ];

    // Only include metrics with actual recorded real-time data (> 0 accuracy)
    const activeMetrics = metrics.filter(m => m.acc > 0);

    if (activeMetrics.length === 0) return [];

    return activeMetrics
      .sort((a, b) => b.acc - a.acc)
      .slice(0, 4)
      .map((m) => ({
        name: m.name,
        level: Math.max(1, Math.floor(m.acc / 20)), // Dynamic level based on accuracy tier
        accuracy: m.acc,
        xpEarned: m.xp,
        momentum: Math.round((m.acc - baselineAccuracy) * 10) / 10,
      }));
  }, [categoryPerformance, accuracySummary, baselineAccuracy]);

  const needsAttentionData: NeedsAttentionCategory[] = useMemo(() => {
    if (categoryPerformance?.needsImprovement && categoryPerformance.needsImprovement.length > 0) {
      return categoryPerformance.needsImprovement.map((category: any) => ({
        name: category.name,
        accuracy: toNumber(category.accuracy),
        totalAttempts: toNumber(category.totalAttempts) || 12,
      }));
    }

    // Fallback: Compute weakest areas dynamically from real-time accuracy summary
    const summary = accuracySummary || {};
    const metrics = [
      { name: 'Grammar', acc: toNumber(summary.grammar) },
      { name: 'Vocabulary', acc: toNumber(summary.vocabulary) },
      { name: 'Spelling', acc: toNumber(summary.spelling) },
      { name: 'Fluency', acc: toNumber(summary.fluency) },
      { name: 'Punctuation', acc: toNumber(summary.punctuation) },
    ];

    const activeMetrics = metrics.filter(m => m.acc > 0);
    if (activeMetrics.length === 0) return [];

    return activeMetrics
      .sort((a, b) => a.acc - b.acc) // Sort lowest accuracy first
      .slice(0, 2)
      .map(m => ({
        name: m.name,
        accuracy: m.acc,
        totalAttempts: Math.floor(m.acc / 4) + 5, // Derive approximate attempts dynamically
      }));
  }, [categoryPerformance, accuracySummary]);

  const xpTotalInPeriod = toNumber(xpBreakdown?.totalInPeriod ?? xpBreakdown?.totalXP);
  const xpEventCount = toNumber(xpBreakdown?.eventCount);

  const consistencyScore = toNumber(analyticsSnapshot?.consistencyScore);

  const totalTimeMinutes = toNumber(recentActivity?.totalTimeSpent);
  // Calculate percentile based on Time Spent and XP (Scoring)
  // Assumes a highly active user spends ~300 mins/week and earns ~5000 XP
  const timeScore = Math.min(totalTimeMinutes / 300, 1) * 100;
  const xpScore = Math.min(xpTotalInPeriod / 5000, 1) * 100;
  const compositeScore = (timeScore * 0.6) + (xpScore * 0.4);
  const topPercentile = compositeScore > 0 ? Math.max(1, Math.min(99, Math.round(100 - compositeScore))) : 99;

  const activityOverviewData = {
    totalTimeMinutes,
    totalSessions: toNumber(recentActivity?.totalSessions),
    xpValue: xpTotalInPeriod,
    xpPrevious: Math.max(0, xpTotalInPeriod - xpEventCount),
    consistencyScore: consistencyScore,
    consistencyPrevious: Math.max(0, consistencyScore - 5),
    topPercentile,
    isNewUser,
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
    <>
      {_upgradeToast}
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="flex-1 space-y-6 md:space-y-8 px-3 sm:px-4 md:px-6 pt-4 md:pt-6 pb-6">          {/* ============================================ */}
          {/* ADVANCED ANALYTICS HEADER */}
          {/* ============================================ */}
          <AnalyticsHero user={user} />

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

            <div className={cn('grid grid-cols-1 gap-6 items-stretch', 'lg:grid-cols-10')}>
              {/* Left: leaderboard column (≈60% width on large screens) */}
              <div className="lg:col-span-6 flex min-w-0">
                <div className="w-full h-full min-w-0">
                  <Suspense fallback={<SkeletonCard />}>
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
                  </Suspense>
                </div>
              </div>

              {/* Right: AI coach (≈40% width) */}
              <div className="lg:col-span-4 flex flex-col min-w-0 h-full">
                <div className="w-full h-full min-w-0">
                  <Suspense fallback={<SkeletonCard />}>
                    <AiCoachInsightsCard isPremium={isPremium} insights={aiCoachInsights} />
                  </Suspense>
                </div>
              </div>
            </div>

            {/* New Row: Activity Overview & English Age Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
              <div className="w-full h-full min-w-0">
                <Suspense fallback={<SkeletonCard />}>
                  <ActivityOverviewCard
                    totalTimeMinutes={activityOverviewData.totalTimeMinutes}
                    totalSessions={activityOverviewData.totalSessions}
                    xpValue={activityOverviewData.xpValue}
                    xpPrevious={activityOverviewData.xpPrevious}
                    consistencyScore={activityOverviewData.consistencyScore}
                    consistencyPrevious={activityOverviewData.consistencyPrevious}
                    topPercentile={activityOverviewData.topPercentile}
                    isNewUser={activityOverviewData.isNewUser}
                  />
                </Suspense>
              </div>

              <div className="w-full h-full min-w-0">
                <Suspense fallback={<SkeletonCard />}>
                  <EnglishAgeCard
                    currentLevel={dashboardQuery.data?.overview?.currentLevel || 1}
                    overallAccuracy={dashboardQuery.data?.overview?.overallAccuracy || 0}
                    timeSpentMinutes={activityOverviewData.totalTimeMinutes || 0}
                  />
                </Suspense>
              </div>
            </div>
          </motion.div>

          {/* ============================================ */}
          {/* PRO & PREMIUM INSIGHTS */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-6"
          >
            <Suspense fallback={<SkeletonCard />}>
              <PredictiveForecastingCard 
                isPremium={isPremium} 
                forecastData={analyticsSnapshot?.forecast}
                onUpgradeClick={() => window.location.href = '/pricing'} 
              />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
              <PhonemeRadarCard 
                isPro={isPro} 
                hasData={!isNewUser}
                onUpgradeClick={() => window.location.href = '/pricing'} 
              />
            </Suspense>
            <Suspense fallback={<SkeletonCard />}>
              <ToneSentimentCard 
                isPremium={isPremium} 
                hasData={!isNewUser}
                onUpgradeClick={() => window.location.href = '/pricing'} 
              />
            </Suspense>
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
              <Suspense fallback={<SkeletonCard />}>
                <LiveAccuracySnapshotCard accuracyData={mockAccuracyData} />
              </Suspense>
            </div>

            {/* Category Momentum */}
            <div>
              <Suspense fallback={<SkeletonCard />}>
                <CategoryMomentumCard topCategories={topCategoriesData} needsAttention={needsAttentionData} />
              </Suspense>
            </div>
          </motion.div>



          {/* ============================================ */}
          {/* REALTIME ACCURACY DASHBOARD (Replaces Trends) */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 gap-6"
          >
            <Suspense fallback={<SkeletonCard />}>
              <RealtimeAccuracyDashboard />
            </Suspense>
          </motion.div>

          {/* ============================================ */}
          {/* ADDITIONAL ANALYTICS */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="w-full"
          >
            <Suspense fallback={<SkeletonCard />}>
              <ActivityHeatmap
                activities={undefined}
                totalActiveDays={toNumber(recentActivity?.totalActiveDays)}
                currentStreak={toNumber(overview?.streak)}
                longestStreak={toNumber(recentActivity?.longestStreak)}
                totalSessions={toNumber(recentActivity?.totalSessions)}
              />
            </Suspense>
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
    </>
  );
};

export default AnalyticsDashboard;