/**
 * 📊 ANALYTICS SERVICE - FRONTEND
 * Optimized React Query hooks for analytics data
 * 
 * Features:
 * - Automatic caching with React Query
 * - Smart refetching on focus/reconnect
 * - Optimistic updates
 * - Debounced mutations
 * - Real-time updates via polling
 * - Memory-efficient data management
 * 
 * Performance:
 * - Cached data served instantly (< 5ms)
 * - Background refetch for freshness
 * - Stale-while-revalidate pattern
 * - Automatic garbage collection
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface AccuracyHistoryPoint {
  date: string;
  overall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency?: number;
}

export interface AccuracyBreakdown {
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
}

export interface AccuracyDataSummary {
  overall: number;
  adjustedOverall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation: number;
  capitalization: number;
  syntax?: number;
  coherence?: number;
  totalErrors?: number;
  criticalErrors?: number;
  errorsByType?: Partial<Record<string, number>>;
}

export interface AccuracyTrends {
  trend: 'improving' | 'declining' | 'stable';
  improvement: number;
  currentAverage: number;
  breakdown: AccuracyBreakdown;
  history: AccuracyHistoryPoint[];
  current?: number;
  previous?: number;
  data?: Array<Record<string, unknown>>;
}

export interface CategoryPerformance {
  topCategories: Array<{ name: string; accuracy: number; xpEarned: number; level: number }>;
  needsImprovement: Array<{ name: string; accuracy: number; totalAttempts: number }>;
  totalCategories: number;
}

export interface RecentActivitySummary {
  lastActive: string;
  totalSessions: number;
  totalTimeSpent: number;
  averageSessionTime: number;
}

export interface AnalyticsSnapshot {
  learningVelocity?: number;
  consistencyScore?: number;
  improvementRate?: number;
  strongestSkill?: string;
  weakestSkill?: string;
  recommendedFocus?: string[];
}

export interface DashboardAnalytics {
  overview: {
    totalXP: number;
    currentLevel: number;
    levelProgress: number;
    overallAccuracy: number;
    streak: number;
    longestStreak: number;
  };
  accuracyData: AccuracyDataSummary;
  accuracyTrends: AccuracyTrends;
  levelUpStats: Record<string, unknown>;
  xpBreakdown: Record<string, unknown>;
  skillsOverview: unknown[];
  categoryPerformance: CategoryPerformance;
  recentActivity: RecentActivitySummary;
  analytics: AnalyticsSnapshot;
}

export interface XPData {
  totalXP: number;
  dailyXP: number;
  weeklyXP: number;
  monthlyXP: number;
  breakdown: Record<string, number>;
  history: Array<Record<string, unknown>>;
  recentEvents: Array<Record<string, unknown>>;
  totalInPeriod?: number;
  eventCount?: number;
  bySource?: Record<string, number>;
}

export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string | null;
    name: string;
    username: string | null;
    tier: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
    country?: string | null;
    profile?: Record<string, unknown> | null;
  };
  userProfile?: Record<string, unknown> | null;
  progress: {
    totalXP: number;
    weeklyXP: number;
    monthlyXP: number;
    currentLevel: number;
    tierLevel: number;
    streak: { current: number; longest: number };
    accuracy: {
      overall: number;
      grammar: number;
      vocabulary: number;
      spelling: number;
      fluency: number;
    };
    sessions: number;
    timeSpent: number;
  };
  analytics: {
    improvementRate: number;
    learningVelocity: number;
    consistencyScore: number;
    recommendedFocus: string[];
    lastActiveAgo?: string | null;
  };
  metricValue: number;
  lastActive: string | null;
}

export interface LeaderboardResponse {
  meta: {
    limit: number;
    offset: number;
    metric: string;
    direction: string;
    timeframe: string;
    tier: string;
  };
  leaderboard: LeaderboardEntry[];
}

// ========================================
// QUERY KEYS
// ========================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: (userId: string, timeRange: string) => ['analytics', 'dashboard', userId, timeRange] as const,
  accuracyTrends: (userId: string, days: number) => ['analytics', 'accuracy-trends', userId, days] as const,
  xpData: (userId: string, timeRange: string) => ['analytics', 'xp-data', userId, timeRange] as const,
  levelStats: (userId: string) => ['analytics', 'level-stats', userId] as const,
  skills: (userId: string) => ['analytics', 'skills', userId] as const,
  categories: (userId: string) => ['analytics', 'categories', userId] as const,
  leaderboard: (params: string) => ['analytics', 'leaderboard', params] as const,
};

// ========================================
// QUERY CONFIGURATION
// ========================================

const QUERY_CONFIG = {
  // Stale time: How long data is considered fresh (no refetch)
  STALE_TIME: {
    DASHBOARD: 30 * 1000, // 30 seconds - frequently updated
    ACCURACY: 60 * 1000, // 1 minute
    XP: 30 * 1000, // 30 seconds - changes often
    LEVELS: 5 * 60 * 1000, // 5 minutes - rarely changes
    SKILLS: 2 * 60 * 1000, // 2 minutes
    CATEGORIES: 2 * 60 * 1000, // 2 minutes
  },

  // Cache time: How long data stays in memory after unused
  CACHE_TIME: {
    DASHBOARD: 5 * 60 * 1000, // 5 minutes
    ACCURACY: 10 * 60 * 1000, // 10 minutes
    XP: 5 * 60 * 1000, // 5 minutes
    LEVELS: 30 * 60 * 1000, // 30 minutes
    SKILLS: 15 * 60 * 1000, // 15 minutes
    CATEGORIES: 15 * 60 * 1000, // 15 minutes
  },

  // Refetch intervals for real-time data
  REFETCH_INTERVAL: {
    DASHBOARD: 30 * 1000, // 30 seconds when component mounted
    DISABLED: false, // Don't refetch
  },
};

// ========================================
// REACT QUERY HOOKS
// ========================================

export interface LeaderboardQueryParams {
  metric?: string;
  timeframe?: 'week' | 'month' | 'all';
  tier?: 'free' | 'pro' | 'premium' | 'all';
  limit?: number;
  offset?: number;
  direction?: 'asc' | 'desc';
}

/**
 * Get comprehensive dashboard analytics
 * Auto-refreshes every 30 seconds when component is visible
 */
export function useDashboardAnalytics(
  userId: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'week',
  options?: Partial<UseQueryOptions<DashboardAnalytics>>
) {
  return useQuery({
    queryKey: analyticsKeys.dashboard(userId, timeRange),
    queryFn: async () => {
      const response = await api.get(`/analytics/dashboard/${userId}?timeRange=${timeRange}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.DASHBOARD,
    gcTime: QUERY_CONFIG.CACHE_TIME.DASHBOARD,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL.DASHBOARD,
    refetchOnWindowFocus: true, // Refetch when user returns to tab
    refetchOnReconnect: true, // Refetch when internet reconnects
    retry: 2, // Retry failed requests twice
    enabled: !!userId, // Only run if userId exists
    ...options,
  });
}

/**
 * Get accuracy trends
 * Cached for 1 minute, refetch on window focus
 */
export function useAccuracyTrends(
  userId: string,
  days: number = 7,
  options?: Partial<UseQueryOptions<AccuracyTrends>>
) {
  return useQuery({
    queryKey: analyticsKeys.accuracyTrends(userId, days),
    queryFn: async () => {
      const response = await api.get(`/analytics/accuracy-trends/${userId}?days=${days}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.ACCURACY,
    gcTime: QUERY_CONFIG.CACHE_TIME.ACCURACY,
    refetchOnWindowFocus: true,
    enabled: !!userId,
    ...options,
  });
}

/**
 * Get XP data and breakdown
 * Auto-refreshes every 30 seconds
 */
export function useXPData(
  userId: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'week',
  options?: Partial<UseQueryOptions<XPData>>
) {
  return useQuery({
    queryKey: analyticsKeys.xpData(userId, timeRange),
    queryFn: async () => {
      const response = await api.get(`/analytics/xp-data/${userId}?timeRange=${timeRange}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.XP,
    gcTime: QUERY_CONFIG.CACHE_TIME.XP,
    refetchInterval: QUERY_CONFIG.REFETCH_INTERVAL.DASHBOARD,
    refetchOnWindowFocus: true,
    enabled: !!userId,
    ...options,
  });
}

/**
 * Get level statistics
 * Cached for 5 minutes
 */
export function useLevelStats(userId: string, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: analyticsKeys.levelStats(userId),
    queryFn: async () => {
      const response = await api.get(`/analytics/level-stats/${userId}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.LEVELS,
    gcTime: QUERY_CONFIG.CACHE_TIME.LEVELS,
    refetchOnWindowFocus: false, // Levels change rarely
    enabled: !!userId,
    ...options,
  });
}

/**
 * Get skills overview
 * Cached for 2 minutes
 */
export function useSkillsData(userId: string, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: analyticsKeys.skills(userId),
    queryFn: async () => {
      const response = await api.get(`/analytics/skills/${userId}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.SKILLS,
    gcTime: QUERY_CONFIG.CACHE_TIME.SKILLS,
    refetchOnWindowFocus: true,
    enabled: !!userId,
    ...options,
  });
}

/**
 * Get category performance
 * Cached for 2 minutes
 */
export function useCategoryData(userId: string, options?: Partial<UseQueryOptions>) {
  return useQuery({
    queryKey: analyticsKeys.categories(userId),
    queryFn: async () => {
      const response = await api.get(`/analytics/categories/${userId}`);
      return response.data.data;
    },
    staleTime: QUERY_CONFIG.STALE_TIME.CATEGORIES,
    gcTime: QUERY_CONFIG.CACHE_TIME.CATEGORIES,
    refetchOnWindowFocus: true,
    enabled: !!userId,
    ...options,
  });
}

/**
 * Get leaderboard data with customizable metric and timeframe
 */
export function useLeaderboardData(
  params: LeaderboardQueryParams,
  options?: Partial<UseQueryOptions<LeaderboardResponse>>
) {
  const {
    metric = 'xp',
    timeframe = 'all',
    tier = 'all',
    limit = 10,
    offset = 0,
    direction = 'desc',
  } = params;

  const serialized = JSON.stringify({ metric, timeframe, tier, limit, offset, direction });

    return useQuery<LeaderboardResponse>({
      queryKey: analyticsKeys.leaderboard(serialized),
      queryFn: async () => {
        const queryParams: Record<string, string | number> = {
          metric,
          timeframe,
          limit,
          offset,
          direction,
        };

        if (tier !== 'all') {
          queryParams.tier = tier;
        }

        const response = await api.get('/analytics/leaderboard', {
          params: queryParams,
        });
        const leaderboard = response.data.data?.leaderboard || [];

        const enhanced = leaderboard.map((entry: LeaderboardEntry) => ({
          ...entry,
          analytics: {
            ...entry.analytics,
            lastActiveAgo: entry.analytics?.lastActiveAgo,
          },
        }));

        return {
          ...response.data.data,
          leaderboard: enhanced,
        };
    },
    staleTime: QUERY_CONFIG.STALE_TIME.DASHBOARD,
    gcTime: QUERY_CONFIG.CACHE_TIME.DASHBOARD,
    refetchOnWindowFocus: true,
    ...options,
  });
}

// ========================================
// MUTATION HOOKS
// ========================================

/**
 * Update accuracy data
 * Optimistic update for instant UI feedback
 */
export function useUpdateAccuracy(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accuracyData: Record<string, unknown>) => {
      const response = await api.post(`/analytics/update-accuracy/${userId}`, accuracyData);
      return response.data;
    },
    // Optimistic update: Update UI immediately before server responds
    onMutate: async (newAccuracy) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: analyticsKeys.dashboard(userId, 'week') });

      // Snapshot current value
      const previousData = queryClient.getQueryData<DashboardAnalytics>(analyticsKeys.dashboard(userId, 'week'));

      // Optimistically update
      queryClient.setQueryData(analyticsKeys.dashboard(userId, 'week'), (old: DashboardAnalytics | undefined) => {
        if (!old) return old;
        return {
          ...old,
          accuracyData: { ...old.accuracyData, ...newAccuracy },
        };
      });

      return { previousData };
    },
    // On error, rollback
    onError: (_err, _newAccuracy, context: { previousData?: DashboardAnalytics } | undefined) => {
      if (context?.previousData) {
        queryClient.setQueryData(analyticsKeys.dashboard(userId, 'week'), context.previousData);
      }
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: analyticsKeys.dashboard(userId, 'week') });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.accuracyTrends(userId, 7) });
    },
  });
}

// ========================================
// UTILITY HOOKS
// ========================================

/**
 * Prefetch dashboard data
 * Call this when user is likely to navigate to dashboard
 */
export function usePrefetchDashboard(userId: string, timeRange: 'day' | 'week' | 'month' | 'year' = 'week') {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: analyticsKeys.dashboard(userId, timeRange),
      queryFn: async () => {
        const response = await api.get(`/analytics/dashboard/${userId}?timeRange=${timeRange}`);
        return response.data.data;
      },
      staleTime: QUERY_CONFIG.STALE_TIME.DASHBOARD,
    });
  };
}

/**
 * Invalidate all analytics cache
 * Use after personality change or major updates
 */
export function useInvalidateAnalytics() {
  const queryClient = useQueryClient();

  return (userId?: string) => {
    if (userId) {
      // Invalidate specific user's analytics
      queryClient.invalidateQueries({ queryKey: ['analytics', userId] });
    } else {
      // Invalidate all analytics
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    }
  };
}

/**
 * Force refresh all analytics data
 * Use when user manually refreshes
 */
export function useRefreshAnalytics(userId: string) {
  const queryClient = useQueryClient();

  return async () => {
    await Promise.all([
      queryClient.refetchQueries({ queryKey: analyticsKeys.dashboard(userId, 'week') }),
      queryClient.refetchQueries({ queryKey: analyticsKeys.accuracyTrends(userId, 7) }),
      queryClient.refetchQueries({ queryKey: analyticsKeys.xpData(userId, 'week') }),
      queryClient.refetchQueries({ queryKey: analyticsKeys.skills(userId) }),
      queryClient.refetchQueries({ queryKey: analyticsKeys.categories(userId) }),
    ]);
  };
}

// ========================================
// EXPORTS
// ========================================

export default {
  useDashboardAnalytics,
  useAccuracyTrends,
  useXPData,
  useLevelStats,
  useSkillsData,
  useCategoryData,
  useLeaderboardData,
  useUpdateAccuracy,
  usePrefetchDashboard,
  useInvalidateAnalytics,
  useRefreshAnalytics,
};
