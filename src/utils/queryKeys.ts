/**
 * Query Keys for React Query
 * Centralized query keys to avoid typos and ensure consistency
 * Industry-level caching strategy for millions of users
 */

export const queryKeys = {
  // Core user data - highest priority for caching
  user: {
    profile: () => ['user', 'profile'] as const,
    auth: () => ['user', 'auth'] as const,
    stats: () => ['user', 'stats'] as const,
    level: () => ['user', 'level'] as const,
  },

  // Profile management - synchronized across all components
  profile: {
    get: () => ['profile'] as const,
    update: () => ['profile', 'update'] as const,
    avatar: () => ['profile', 'avatar'] as const,
    upload: () => ['profile', 'upload'] as const,
  },

  // Auth queries - critical for authentication flow
  auth: {
    profile: () => ['auth', 'profile'] as const,
    login: () => ['auth', 'login'] as const,
    signup: () => ['auth', 'signup'] as const,
    refresh: () => ['auth', 'refresh'] as const,
    logout: () => ['auth', 'logout'] as const,
  },

  // Progress tracking - real-time updates
  progress: {
    levelInfo: (totalXP: number) => ['progress', 'level-info', totalXP] as const,
    xpReward: (action: string) => ['progress', 'xp-reward', action] as const,
    update: (userId: string) => ['progress', 'update', userId] as const,
    session: () => ['progress', 'session'] as const,
  },

  // Level management - gamification system
  level: {
    userLevel: (userId: string) => ['level', userId] as const,
    stats: (userId: string) => ['level', 'stats', userId] as const,
    initialize: () => ['level', 'initialize'] as const,
    xp: (userId: string) => ['level', 'xp', userId] as const,
    session: (userId: string) => ['level', 'session', userId] as const,
  },

  // Accuracy analysis - AI features
  accuracy: {
    analysis: (userMessage: string) => ['accuracy', 'analysis', userMessage] as const,
    cache: () => ['accuracy', 'cache'] as const,
  },

  // Dashboard components - optimized for performance
  dashboard: {
    sidebar: () => ['dashboard', 'sidebar'] as const,
    wordOfDay: () => ['dashboard', 'word-of-day'] as const,
    quickStats: () => ['dashboard', 'quick-stats'] as const,
    recentActivity: () => ['dashboard', 'recent-activity'] as const,
  },

  // User management - admin features
  admin: {
    users: () => ['admin', 'users'] as const,
    analytics: () => ['admin', 'analytics'] as const,
    user: (id: string) => ['admin', 'user', id] as const,
  },

  // Global state - shared across components
  global: {
    currentUser: () => ['global', 'current-user'] as const,
    appState: () => ['global', 'app-state'] as const,
    notifications: () => ['global', 'notifications'] as const,
  },
} as const;

// Query options for different data types
export const queryOptions = {
  // Critical user data - never stale, frequent updates
  user: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 60 * 1000, // 1 minute for user data
  },

  // Profile data - moderate refresh rate
  profile: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },

  // Static data - long cache times
  static: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },

  // Real-time data - very short cache
  realtime: {
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 5,
    retryDelay: (attemptIndex: number) => Math.min(500 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 30 * 1000, // 30 seconds
  },
} as const;
