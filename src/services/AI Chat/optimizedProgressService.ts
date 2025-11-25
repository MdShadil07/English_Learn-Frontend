/**
 * Optimized Progress Service
 * Fetches real-time progress data from cache-first API for AI Chat page
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get authentication token
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

/**
 * Real-time progress data interface (optimized - only sidebar essentials)
 */
export interface RealtimeProgressData {
  streak: {
    current: number;
  };
  accuracy: {
    overall: number;
    adjustedOverall?: number;
    grammar?: number;
    vocabulary?: number;
    spelling?: number;
    fluency?: number;
    punctuation?: number;
    capitalization?: number;
    messageCount?: number;
    lastUpdated?: string;
    source?: 'fast-cache' | 'optimized-cache' | 'progress-cache' | 'database';
  };
  xp: {
    total: number;
    currentLevel: number;
    xpToNextLevel: number;
    currentLevelXP?: number;
    xpRequiredForLevel?: number;
    progressPercentage?: number;
    cumulativeXPForCurrentLevel?: number;
    cumulativeXPForNextLevel?: number;
    prestigeLevel?: number;
    recentGain?: number;
  };
  stats: {
    totalMessages: number;
    totalMinutes: number;
  };
  lastUpdate: string;
  source: 'cache' | 'database' | 'fast-cache' | 'optimized-cache' | 'progress-cache';
}

/**
 * Progress update interface for polling
 */
export interface ProgressUpdate {
  xp: {
    total: number;
    gained: number;
    level: number;
    progress: number;
    progressPercentage: number;
    leveledUp: boolean;
    previousLevel?: number;
    currentLevelXP: number;
    xpToNextLevel: number;
    xpRequiredForLevel: number;
    cumulativeXPForCurrentLevel: number;
    cumulativeXPForNextLevel: number;
    prestigeLevel?: number;
  };
  accuracy: {
    overall: number;
    adjustedOverall: number;
    grammar: number;
    vocabulary: number;
    spelling: number;
    fluency: number;
    punctuation: number;
    capitalization: number;
    totalErrors: number;
    criticalErrors: number;
    messageCount?: number;
    source?: 'fast-cache' | 'optimized-cache' | 'progress-cache' | 'database';
    lastUpdated?: string;
  };
  streak: {
    current: number;
    best: number;
  };
  timestamp: number;
}

/**
 * Progress listener interface
 */
export interface ProgressListener {
  onProgressUpdate: (update: ProgressUpdate) => void;
  onLevelUp: (newLevel: number, oldLevel: number, xpGained: number) => void;
  onAccuracyUpdate: (accuracy: ProgressUpdate['accuracy']) => void;
  onError?: (error: Error) => void;
}

/**
 * Dashboard data interface
 */
export interface DashboardProgressData {
  overview: {
    totalXP: number;
    currentLevel: number;
    currentStreak: number;
    longestStreak: number;
    totalSessions: number;
    totalHours: number;
  };
  todayProgress: {
    minutes: number;
    minutesGoal: number;
    messages: number;
    messagesGoal: number;
    goalMet: boolean;
    percentComplete: number;
  };
  accuracy: {
    overall: number;
    grammar: number;
    vocabulary: number;
    spelling: number;
    fluency: number;
  };
  streakStats: {
    current: number;
    longest: number;
    totalActiveDays: number;
    averageMinutesPerDay: number;
  };
  source: 'cache' | 'database';
}

/**
 * Batch statistics interface
 */
export interface BatchStatistics {
  queueSize: number;
  isProcessing: boolean;
  flushInterval: number;
  status: 'healthy' | 'warning' | 'error';
}

/**
 * Fetch real-time progress (cache-first, updates every 5 seconds)
 */
export const fetchRealtimeProgress = async (): Promise<RealtimeProgressData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout for realtime

  try {
    const response = await fetch(`${API_BASE_URL}/progress/optimized/realtime`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch realtime progress');
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
    
    throw new Error('Failed to fetch realtime progress');
  }
};

/**
 * Fetch dashboard progress (cached for 2 minutes, less critical)
 */
export const fetchDashboardProgress = async (): Promise<DashboardProgressData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for dashboard

  try {
    const response = await fetch(`${API_BASE_URL}/progress/optimized/dashboard`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch dashboard progress');
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
    
    throw new Error('Failed to fetch dashboard progress');
  }
};

/**
 * Fetch batch statistics (monitoring)
 */
export const fetchBatchStatistics = async (): Promise<BatchStatistics> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/optimized/batch-stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch batch statistics');
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to fetch batch statistics');
  }
};

/**
 * Force flush (admin only - use sparingly)
 */
export const forceFlushProgress = async (): Promise<{ processed: number; errors: number }> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/progress/optimized/force-flush`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to force flush');
    }

    return result.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Failed to force flush');
  }
};

/**
 * Optimized Progress Service with caching and real-time polling
 */
class OptimizedProgressService {
  private static realtimeCache: RealtimeProgressData | null = null;
  private static realtimeCacheTime: number = 0;
  private static readonly REALTIME_CACHE_TTL = 5000; // 5 seconds

  private static dashboardCache: DashboardProgressData | null = null;
  private static dashboardCacheTime: number = 0;
  private static readonly DASHBOARD_CACHE_TTL = 30000; // 30 seconds

  // Polling state
  private static listeners: Map<string, ProgressListener> = new Map();
  private static pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private static lastKnownProgress: Map<string, ProgressUpdate> = new Map();
  private static readonly POLL_INTERVAL = 2000; // Poll every 2 seconds
  private static readonly MAX_POLL_DURATION = 30000; // Stop polling after 30 seconds

  /**
   * Start listening for progress updates for a specific user
   */
  static startListening(userId: string, listener: ProgressListener): void {
    console.log(`🔄 Starting real-time progress listening for user: ${userId.substring(0, 8)}`);
    
    // 🔧 FIX: Clear client-side cache to force fresh fetch
    console.log('🧹 Clearing client-side cache to force fresh data');
    this.realtimeCache = null;
    this.realtimeCacheTime = 0;
    
    // Store listener
    this.listeners.set(userId, listener);

    // Start polling with a small delay to allow backend processing
    console.log('⏱️ Starting polling with 1s delay to allow backend processing');
    setTimeout(() => {
      this.startPolling(userId);
    }, 1000); // 1 second delay
  }

  /**
   * Stop listening for a specific user
   */
  static stopListening(userId: string): void {
    console.log(`⏹️ Stopping real-time progress listening for user: ${userId.substring(0, 8)}`);
    
    // Clear interval
    const interval = this.pollingIntervals.get(userId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(userId);
    }

    // Remove listener
    this.listeners.delete(userId);
    this.lastKnownProgress.delete(userId);
  }

  /**
   * Start polling for updates
   */
  private static startPolling(userId: string): void {
    const startTime = Date.now();

    const poll = async () => {
      // Stop polling after max duration
      if (Date.now() - startTime > this.MAX_POLL_DURATION) {
        console.log(`⏱️ Max poll duration reached for user ${userId.substring(0, 8)}, stopping`);
        this.stopListening(userId);
        return;
      }

      try {
        const progress = await this.fetchProgressForPolling(userId);
        
        if (progress) {
          const lastProgress = this.lastKnownProgress.get(userId);
          
          // Check if progress has changed
          if (this.hasProgressChanged(lastProgress, progress)) {
            console.log(`✨ Progress update detected for user ${userId.substring(0, 8)}`);
            
            const listener = this.listeners.get(userId);
            if (listener) {
              // Notify main progress update
              listener.onProgressUpdate(progress);

              // Check for level up
              if (lastProgress && progress.xp.level > lastProgress.xp.level) {
                console.log(`🎉 LEVEL UP! ${lastProgress.xp.level} → ${progress.xp.level}`);
                listener.onLevelUp(
                  progress.xp.level,
                  lastProgress.xp.level,
                  progress.xp.gained
                );
              }

              // Notify accuracy update
              if (!lastProgress || this.hasAccuracyChanged(lastProgress.accuracy, progress.accuracy)) {
                console.log(`📊 Accuracy updated:`, progress.accuracy);
                listener.onAccuracyUpdate(progress.accuracy);
              }
            }

            // Store as last known progress
            this.lastKnownProgress.set(userId, progress);

            // Stop polling after first successful update
            console.log(`✅ Background job completed, stopping poll for ${userId.substring(0, 8)}`);
            this.stopListening(userId);
          }
        }
      } catch (error) {
        console.error(`❌ Error polling progress for ${userId.substring(0, 8)}:`, error);
        const listener = this.listeners.get(userId);
        if (listener?.onError) {
          listener.onError(error as Error);
        }
      }
    };

    // Initial poll
    poll();

    // Set up interval
    const interval = setInterval(poll, this.POLL_INTERVAL);
    this.pollingIntervals.set(userId, interval);
  }

  /**
   * Fetch progress for polling (converts RealtimeProgressData to ProgressUpdate)
   */
  private static async fetchProgressForPolling(userId: string): Promise<ProgressUpdate | null> {
    try {
      console.log('🔄 [POLLING] Fetching progress data...');
      // Force refresh to get latest data
      const data = await this.getRealtimeProgress(true);
      
      if (!data) {
        console.warn('⚠️ [POLLING] No data received from realtime endpoint');
        return null;
      }

      // 🔧 FIX: Add null checks for nested data
      if (!data.xp || !data.accuracy || !data.streak) {
        console.error('❌ [POLLING] Incomplete data structure received:', data);
        return null;
      }

      console.log('📊 [POLLING] Data received:', {
        totalXP: data.xp.total,
        level: data.xp.currentLevel,
        accuracy: data.accuracy.overall,
        streak: data.streak.current,
      });

      // Calculate XP gained (will be computed by comparing with last known)
      const lastProgress = this.lastKnownProgress.get(userId);
      const xpGained = lastProgress ? data.xp.total - lastProgress.xp.total : 0;

      const prestigeLevel = data.xp.prestigeLevel ?? 0;
      const providedXpRequired = data.xp.xpRequiredForLevel;
      const providedCurrentLevelXP = data.xp.currentLevelXP;
      const providedXpRemaining = data.xp.xpToNextLevel;
      const cumulativeCurrentFromApi = data.xp.cumulativeXPForCurrentLevel;
      const cumulativeNextFromApi = data.xp.cumulativeXPForNextLevel;

      const xpRequiredForLevel = Math.max(
        1,
        typeof providedXpRequired === 'number'
          ? providedXpRequired
          : (typeof providedCurrentLevelXP === 'number' && typeof providedXpRemaining === 'number'
              ? providedCurrentLevelXP + providedXpRemaining
              : 0)
      );

      let xpIntoLevel =
        typeof providedCurrentLevelXP === 'number'
          ? providedCurrentLevelXP
          : Math.max(0, xpRequiredForLevel - (providedXpRemaining ?? xpRequiredForLevel));
      xpIntoLevel = Math.max(0, Math.min(xpIntoLevel, xpRequiredForLevel));

      let xpRemaining =
        typeof providedXpRemaining === 'number'
          ? providedXpRemaining
          : Math.max(0, xpRequiredForLevel - xpIntoLevel);
      xpRemaining = Math.max(0, Math.min(xpRemaining, xpRequiredForLevel));

      if (xpIntoLevel + xpRemaining !== xpRequiredForLevel) {
        xpRemaining = Math.max(0, xpRequiredForLevel - xpIntoLevel);
      }

      const progressPercentage = Math.max(
        0,
        Math.min(
          100,
          typeof data.xp.progressPercentage === 'number'
            ? data.xp.progressPercentage
            : (xpRequiredForLevel > 0 ? (xpIntoLevel / xpRequiredForLevel) * 100 : 100)
        )
      );

      const cumulativeCurrent =
        typeof cumulativeCurrentFromApi === 'number'
          ? cumulativeCurrentFromApi
          : Math.max(0, Math.floor(data.xp.total - xpIntoLevel));
      const cumulativeNext =
        typeof cumulativeNextFromApi === 'number'
          ? cumulativeNextFromApi
          : Math.max(cumulativeCurrent, cumulativeCurrent + xpRequiredForLevel);

      console.log('📈 [POLLING] XP Comparison:', {
        lastTotal: lastProgress?.xp.total,
        currentTotal: data.xp.total,
        gained: xpGained,
      });

      // Transform to ProgressUpdate format
      return {
        xp: {
          total: data.xp.total,
          gained: xpGained,
          level: data.xp.currentLevel,
          progress: progressPercentage,
          progressPercentage,
          leveledUp: false,
          currentLevelXP: xpIntoLevel,
          xpToNextLevel: xpRemaining,
          xpRequiredForLevel,
          cumulativeXPForCurrentLevel: cumulativeCurrent,
          cumulativeXPForNextLevel: cumulativeNext,
          prestigeLevel,
        },
        accuracy: {
          overall: data.accuracy.overall,
          adjustedOverall: data.accuracy.adjustedOverall ?? data.accuracy.overall,
          grammar: data.accuracy.grammar ?? 0,
          vocabulary: data.accuracy.vocabulary ?? 0,
          spelling: data.accuracy.spelling ?? 0,
          fluency: data.accuracy.fluency ?? 0,
          punctuation: data.accuracy.punctuation ?? 0,
          capitalization: data.accuracy.capitalization ?? 0,
          totalErrors: 0,
          criticalErrors: 0,
          messageCount: data.accuracy.messageCount,
          source: data.accuracy.source,
          lastUpdated: data.accuracy.lastUpdated,
        },
        streak: {
          current: data.streak.current,
          best: data.streak.current, // Backend doesn't provide best in realtime endpoint
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('❌ [POLLING] Error fetching progress for polling:', error);
      return null;
    }
  }

  /**
   * Check if progress has changed
   */
  private static hasProgressChanged(
    last: ProgressUpdate | undefined,
    current: ProgressUpdate
  ): boolean {
    if (!last) {
      console.log('✅ [POLLING] No previous progress - treating as change');
      return true;
    }

    console.log('🔍 [POLLING] Comparing progress:', {
      lastXP: last.xp.total,
      currentXP: current.xp.total,
      lastAccuracy: last.accuracy.overall,
      currentAccuracy: current.accuracy.overall,
      lastStreak: last.streak.current,
      currentStreak: current.streak.current,
    });

    // Check XP change
    if (last.xp.total !== current.xp.total) {
      console.log('✅ [POLLING] XP changed!', last.xp.total, '→', current.xp.total);
      return true;
    }

    if (last.xp.progressPercentage !== current.xp.progressPercentage) {
      console.log('✅ [POLLING] XP progress percentage changed!', last.xp.progressPercentage, '→', current.xp.progressPercentage);
      return true;
    }

    // Check accuracy change
    if (this.hasAccuracyChanged(last.accuracy, current.accuracy)) {
      console.log('✅ [POLLING] Accuracy changed!');
      return true;
    }

    // Check streak change
    if (last.streak.current !== current.streak.current) {
      console.log('✅ [POLLING] Streak changed!');
      return true;
    }

    console.log('⏸️ [POLLING] No changes detected');
    return false;
  }

  /**
   * Check if accuracy has changed
   */
  private static hasAccuracyChanged(
    last: ProgressUpdate['accuracy'],
    current: ProgressUpdate['accuracy']
  ): boolean {
    return last.overall !== current.overall;
  }

  /**
   * Manual trigger to check for updates (called after sending message)
   */
  static async checkForUpdates(userId: string): Promise<ProgressUpdate | null> {
    return this.fetchProgressForPolling(userId);
  }

  /**
   * Cleanup all listeners
   */
  static cleanup(): void {
    console.log('🧹 Cleaning up optimized progress service');
    this.pollingIntervals.forEach((interval) => clearInterval(interval));
    this.pollingIntervals.clear();
    this.listeners.clear();
    this.lastKnownProgress.clear();
  }

  /**
   * Get realtime progress with client-side caching (reduces network calls)
   */
  static async getRealtimeProgress(forceRefresh = false): Promise<RealtimeProgressData> {
    const now = Date.now();

    // Return cached data if available and not expired
    if (!forceRefresh && 
        this.realtimeCache && 
        (now - this.realtimeCacheTime) < this.REALTIME_CACHE_TTL) {
      console.log('📦 Using client-side cached realtime progress');
      return this.realtimeCache;
    }

    console.log('🌐 Fetching realtime progress from server');
    const data = await fetchRealtimeProgress();

    // Update cache
    this.realtimeCache = data;
    this.realtimeCacheTime = now;

    return data;
  }

  /**
   * Get dashboard progress with client-side caching
   */
  static async getDashboardProgress(forceRefresh = false): Promise<DashboardProgressData> {
    const now = Date.now();

    // Return cached data if available and not expired
    if (!forceRefresh && 
        this.dashboardCache && 
        (now - this.dashboardCacheTime) < this.DASHBOARD_CACHE_TTL) {
      console.log('📦 Using client-side cached dashboard progress');
      return this.dashboardCache;
    }

    console.log('🌐 Fetching dashboard progress from server');
    const data = await fetchDashboardProgress();

    // Update cache
    this.dashboardCache = data;
    this.dashboardCacheTime = now;

    return data;
  }

  /**
   * Clear client-side cache (use when user logs out)
   */
  static clearCache(): void {
    this.realtimeCache = null;
    this.realtimeCacheTime = 0;
    this.dashboardCache = null;
    this.dashboardCacheTime = 0;
    // Remove any persisted per-message accuracy caches and streak data from localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          if (key.startsWith('accuracyCache:') || key === 'streakData') {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('Failed to clear persisted progress/accuracy keys from localStorage', e);
    }

    console.log('🗑️ Client-side progress cache cleared (including persisted accuracy/streak keys)');
  }

  /**
   * Prefetch data in background (improve perceived performance)
   */
  static async prefetchData(): Promise<void> {
    try {
      await Promise.all([
        this.getRealtimeProgress(true),
        this.getDashboardProgress(true),
      ]);
      console.log('✅ Progress data prefetched successfully');
    } catch (error) {
      console.error('❌ Failed to prefetch progress data:', error);
    }
  }
}

export default OptimizedProgressService;
