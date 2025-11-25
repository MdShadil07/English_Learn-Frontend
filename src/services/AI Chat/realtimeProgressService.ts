/**
 * 🔄 Real-time Progress Service
 * Polls backend for XP, level-up, and accuracy updates
 * Handles background job completion notifications
 */

export interface ProgressUpdate {
  xp: {
    total: number;
    gained: number;
    level: number;
    progress: number;
    leveledUp: boolean;
    previousLevel?: number;
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
  };
  streak: {
    current: number;
    best: number;
  };
  timestamp: number;
}

export interface RealtimeProgressListener {
  onProgressUpdate: (update: ProgressUpdate) => void;
  onLevelUp: (newLevel: number, oldLevel: number, xpGained: number) => void;
  onAccuracyUpdate: (accuracy: ProgressUpdate['accuracy']) => void;
  onError?: (error: Error) => void;
}

class RealtimeProgressService {
  private listeners: Map<string, RealtimeProgressListener> = new Map();
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastKnownProgress: Map<string, ProgressUpdate> = new Map();
  private readonly POLL_INTERVAL = 2000; // Poll every 2 seconds
  private readonly MAX_POLL_DURATION = 30000; // Stop polling after 30 seconds

  /**
   * Start listening for progress updates for a specific user
   */
  startListening(userId: string, listener: RealtimeProgressListener): void {
    console.log(`🔄 Starting real-time progress listening for user: ${userId.substring(0, 8)}`);
    
    // Store listener
    this.listeners.set(userId, listener);

    // Start polling
    this.startPolling(userId);
  }

  /**
   * Stop listening for a specific user
   */
  stopListening(userId: string): void {
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
  private startPolling(userId: string): void {
    const startTime = Date.now();

    const poll = async () => {
      // Stop polling after max duration
      if (Date.now() - startTime > this.MAX_POLL_DURATION) {
        console.log(`⏱️ Max poll duration reached for user ${userId.substring(0, 8)}, stopping`);
        this.stopListening(userId);
        return;
      }

      try {
        const progress = await this.fetchProgress(userId);
        
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
            // (background job completed)
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
   * Fetch latest progress from backend
   */
  private async fetchProgress(userId: string): Promise<ProgressUpdate | null> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/progress/realtime`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch progress: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.data) {
        return null;
      }

      const progress = data.data;

      // Transform backend data to ProgressUpdate format
      return {
        xp: {
          total: progress.xp?.total || 0,
          gained: 0, // Will be calculated by comparing with last known
          level: progress.xp?.level || 1,
          progress: progress.xp?.progress || 0,
          leveledUp: false,
        },
        accuracy: {
          overall: progress.accuracyData?.overall || 0,
          adjustedOverall: progress.accuracyData?.adjustedOverall || 0,
          grammar: progress.accuracyData?.grammar || 0,
          vocabulary: progress.accuracyData?.vocabulary || 0,
          spelling: progress.accuracyData?.spelling || 0,
          fluency: progress.accuracyData?.fluency || 0,
          punctuation: progress.accuracyData?.punctuation || 0,
          capitalization: progress.accuracyData?.capitalization || 0,
          totalErrors: progress.accuracyData?.totalErrors || 0,
          criticalErrors: progress.accuracyData?.criticalErrors || 0,
        },
        streak: {
          current: progress.streak?.current || 0,
          best: progress.streak?.best || 0,
        },
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('Error fetching progress:', error);
      return null;
    }
  }

  /**
   * Check if progress has changed
   */
  private hasProgressChanged(
    last: ProgressUpdate | undefined,
    current: ProgressUpdate
  ): boolean {
    if (!last) return true;

    // Check XP change
    if (last.xp.total !== current.xp.total) return true;

    // Check accuracy change
    if (this.hasAccuracyChanged(last.accuracy, current.accuracy)) return true;

    // Check streak change
    if (last.streak.current !== current.streak.current) return true;

    return false;
  }

  /**
   * Check if accuracy has changed
   */
  private hasAccuracyChanged(
    last: ProgressUpdate['accuracy'],
    current: ProgressUpdate['accuracy']
  ): boolean {
    return (
      last.overall !== current.overall ||
      last.grammar !== current.grammar ||
      last.vocabulary !== current.vocabulary ||
      last.spelling !== current.spelling ||
      last.fluency !== current.fluency
    );
  }

  /**
   * Manual trigger to check for updates (called after sending message)
   */
  async checkForUpdates(userId: string): Promise<ProgressUpdate | null> {
    return this.fetchProgress(userId);
  }

  /**
   * Cleanup all listeners
   */
  cleanup(): void {
    console.log('🧹 Cleaning up real-time progress service');
    this.pollingIntervals.forEach((interval) => clearInterval(interval));
    this.pollingIntervals.clear();
    this.listeners.clear();
    this.lastKnownProgress.clear();
  }
}

export const realtimeProgressService = new RealtimeProgressService();
