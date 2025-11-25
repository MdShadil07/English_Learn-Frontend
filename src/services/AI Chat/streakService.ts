/**
 * Streak Management Service
 * Handles streak calculation, validation, and persistence
 * 
 * Rules:
 * - User must spend at least 5 minutes in AI chat daily to maintain streak
 * - Streak resets if user misses a day (24-hour window)
 * - Premium/Pro users get grace period and streak freeze features
 */

export interface StreakData {
  current: number;
  longest: number;
  lastActivityDate: Date | null;
  todayMinutes: number;
  streakMaintained: boolean;
  daysUntilReset: number;
  isActive: boolean; // Active today (>= 5 min)
}

export interface StreakUpdateResult {
  streakData: StreakData;
  increased: boolean;
  maintained: boolean;
  broken: boolean;
  message: string;
  xpBonus?: number;
}

export interface StreakConfig {
  minimumDailyMinutes: number; // Required minutes per day
  gracePeriodHours: number;    // Hours after 24h before streak breaks
  freezeAvailable: boolean;    // Can freeze streak (Premium feature)
  maxFreezes: number;          // Max freeze days (Premium feature)
}

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

/**
 * Get streak configuration based on subscription tier
 */
export function getStreakConfig(tier: 'free' | 'pro' | 'premium'): StreakConfig {
  switch (tier) {
    case 'premium':
      return {
        minimumDailyMinutes: 5,
        gracePeriodHours: 6, // 6-hour grace period
        freezeAvailable: true,
        maxFreezes: 7, // Can freeze 7 days per month
      };
    case 'pro':
      return {
        minimumDailyMinutes: 5,
        gracePeriodHours: 3, // 3-hour grace period
        freezeAvailable: true,
        maxFreezes: 3, // Can freeze 3 days per month
      };
    case 'free':
    default:
      return {
        minimumDailyMinutes: 5,
        gracePeriodHours: 0, // No grace period
        freezeAvailable: false,
        maxFreezes: 0,
      };
  }
}

/**
 * Check if two dates are on the same day (UTC)
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate()
  );
}

/**
 * Check if two dates are consecutive days
 */
function isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
  const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / DAY_IN_MS);
  return dayDiff === 1;
}

/**
 * Get days since last activity
 */
function getDaysSinceLastActivity(lastDate: Date, currentDate: Date): number {
  return Math.floor((currentDate.getTime() - lastDate.getTime()) / DAY_IN_MS);
}

/**
 * Calculate streak based on activity
 */
export class StreakService {
  private static readonly STORAGE_KEY = 'streakData';
  private static readonly SESSION_STORAGE_KEY = 'todaySessionMinutes';

  /**
   * Load streak data from localStorage
   */
  static loadStreakData(): StreakData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        return {
          ...data,
          lastActivityDate: data.lastActivityDate ? new Date(data.lastActivityDate) : null,
        };
      }
    } catch (error) {
      console.error('❌ Failed to load streak data:', error);
    }

    // Return default streak data
    return {
      current: 0,
      longest: 0,
      lastActivityDate: null,
      todayMinutes: 0,
      streakMaintained: false,
      daysUntilReset: 0,
      isActive: false,
    };
  }

  /**
   * Save streak data to localStorage
   */
  static saveStreakData(data: StreakData): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('✅ Streak data saved:', data);
    } catch (error) {
      console.error('❌ Failed to save streak data:', error);
    }
  }

  /**
   * Get today's accumulated minutes from session storage
   */
  static getTodaySessionMinutes(): number {
    try {
      const stored = sessionStorage.getItem(this.SESSION_STORAGE_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Update today's accumulated minutes
   */
  static updateTodaySessionMinutes(minutes: number): void {
    try {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, minutes.toString());
    } catch (error) {
      console.error('❌ Failed to update session minutes:', error);
    }
  }

  /**
   * Add practice time and update streak
   */
  static updateStreak(
    currentStreak: StreakData,
    minutesAdded: number,
    tier: 'free' | 'pro' | 'premium'
  ): StreakUpdateResult {
    const config = getStreakConfig(tier);
    const now = new Date();
    const lastDate = currentStreak.lastActivityDate;

    // Update today's total minutes
    const todayMinutes = currentStreak.todayMinutes + minutesAdded;
    const isActiveToday = todayMinutes >= config.minimumDailyMinutes;

    console.log(`⏱️ Streak Update:`, {
      minutesAdded,
      todayMinutes,
      minimumRequired: config.minimumDailyMinutes,
      isActiveToday,
      currentStreak: currentStreak.current,
      lastDate: lastDate?.toISOString(),
    });

    let increased = false;
    let maintained = false;
    let broken = false;
    let message = '';
    let xpBonus = 0;

    const newStreakData: StreakData = {
      ...currentStreak,
      todayMinutes,
      isActive: isActiveToday,
    };

    // First time user or no last activity
    if (!lastDate) {
      if (isActiveToday) {
        newStreakData.current = 1;
        newStreakData.longest = 1;
        newStreakData.lastActivityDate = now;
        newStreakData.streakMaintained = true;
        increased = true;
        message = '🎉 Streak started! Keep practicing daily to build your streak.';
        xpBonus = 10;
      } else {
        message = `⏳ ${config.minimumDailyMinutes - todayMinutes} more minutes needed to start your streak!`;
      }
    } else {
      // Check if same day
      if (isSameDay(lastDate, now)) {
        // Same day activity
        if (isActiveToday && !currentStreak.isActive) {
          // Just reached 5 minutes today
          maintained = true;
          newStreakData.streakMaintained = true;
          message = `✅ Daily goal achieved! Streak maintained: ${newStreakData.current} days`;
          xpBonus = newStreakData.current * 5; // Bonus XP based on streak length
        } else if (isActiveToday) {
          maintained = true;
          message = `💪 Keep going! ${todayMinutes} minutes today. Streak: ${newStreakData.current} days`;
        } else {
          message = `⏳ ${config.minimumDailyMinutes - todayMinutes} more minutes to maintain streak!`;
        }
      } else {
        // Different day - check if consecutive
        const daysSince = getDaysSinceLastActivity(lastDate, now);

        if (daysSince === 1) {
          // Consecutive day
          if (isActiveToday) {
            newStreakData.current += 1;
            newStreakData.longest = Math.max(newStreakData.longest, newStreakData.current);
            newStreakData.lastActivityDate = now;
            newStreakData.streakMaintained = true;
            increased = true;
            message = `🔥 Streak increased to ${newStreakData.current} days! Amazing!`;
            xpBonus = newStreakData.current * 10; // Higher bonus for increasing streak
          } else {
            // Haven't reached 5 minutes yet today
            const gracePeriodEnd = new Date(now.getTime() + config.gracePeriodHours * HOUR_IN_MS);
            message = `⚠️ Practice ${config.minimumDailyMinutes} minutes today to continue your ${currentStreak.current}-day streak!`;
            
            if (config.gracePeriodHours > 0) {
              message += ` You have ${config.gracePeriodHours} hours grace period.`;
            }
            
            newStreakData.daysUntilReset = 0;
          }
        } else {
          // Missed a day - check grace period
          const gracePeriodMs = config.gracePeriodHours * HOUR_IN_MS;
          const missedDeadline = new Date(lastDate.getTime() + DAY_IN_MS + gracePeriodMs);

          if (now <= missedDeadline) {
            // Still within grace period
            if (isActiveToday) {
              newStreakData.current += 1;
              newStreakData.longest = Math.max(newStreakData.longest, newStreakData.current);
              newStreakData.lastActivityDate = now;
              newStreakData.streakMaintained = true;
              increased = true;
              message = `⚡ Streak saved within grace period! Now ${newStreakData.current} days`;
              xpBonus = newStreakData.current * 8;
            } else {
              const minutesLeft = Math.floor((missedDeadline.getTime() - now.getTime()) / MINUTE_IN_MS);
              message = `⏰ ${minutesLeft} minutes left to save your ${currentStreak.current}-day streak!`;
            }
          } else {
            // Streak broken
            broken = true;
            const previousStreak = currentStreak.current;
            
            if (isActiveToday) {
              // Start new streak
              newStreakData.current = 1;
              newStreakData.lastActivityDate = now;
              newStreakData.streakMaintained = true;
              message = `💔 Previous ${previousStreak}-day streak ended. New streak started!`;
              xpBonus = 5;
            } else {
              newStreakData.current = 0;
              newStreakData.streakMaintained = false;
              message = `💔 ${previousStreak}-day streak ended. Practice ${config.minimumDailyMinutes} minutes to start fresh!`;
            }
          }
        }
      }
    }

    // Save updated streak data
    this.saveStreakData(newStreakData);
    this.updateTodaySessionMinutes(todayMinutes);

    console.log(`🔥 Streak Result:`, {
      current: newStreakData.current,
      longest: newStreakData.longest,
      increased,
      maintained,
      broken,
      xpBonus,
    });

    return {
      streakData: newStreakData,
      increased,
      maintained,
      broken,
      message,
      xpBonus,
    };
  }

  /**
   * Check if streak is at risk of breaking
   */
  static checkStreakRisk(streakData: StreakData, tier: 'free' | 'pro' | 'premium'): {
    atRisk: boolean;
    hoursRemaining: number;
    message: string;
  } {
    const config = getStreakConfig(tier);
    const now = new Date();
    const lastDate = streakData.lastActivityDate;

    if (!lastDate || streakData.current === 0) {
      return {
        atRisk: false,
        hoursRemaining: 24,
        message: 'No active streak',
      };
    }

    // Check if today
    if (isSameDay(lastDate, now)) {
      if (streakData.isActive) {
        return {
          atRisk: false,
          hoursRemaining: 24,
          message: 'Streak safe for today!',
        };
      } else {
        const endOfDay = new Date(now);
        endOfDay.setUTCHours(23, 59, 59, 999);
        const hoursLeft = Math.floor((endOfDay.getTime() - now.getTime()) / HOUR_IN_MS);
        
        return {
          atRisk: true,
          hoursRemaining: hoursLeft,
          message: `⚠️ ${config.minimumDailyMinutes - streakData.todayMinutes} more minutes needed today!`,
        };
      }
    }

    // Check grace period
    const deadline = new Date(lastDate.getTime() + DAY_IN_MS + config.gracePeriodHours * HOUR_IN_MS);
    const hoursLeft = Math.max(0, Math.floor((deadline.getTime() - now.getTime()) / HOUR_IN_MS));

    if (now > deadline) {
      return {
        atRisk: false,
        hoursRemaining: 0,
        message: 'Streak already ended',
      };
    }

    return {
      atRisk: true,
      hoursRemaining: hoursLeft,
      message: `🚨 ${hoursLeft} hours to save your ${streakData.current}-day streak!`,
    };
  }

  /**
   * Reset streak data (for testing or user request)
   */
  static resetStreak(): void {
    const defaultData: StreakData = {
      current: 0,
      longest: 0,
      lastActivityDate: null,
      todayMinutes: 0,
      streakMaintained: false,
      daysUntilReset: 0,
      isActive: false,
    };
    this.saveStreakData(defaultData);
    sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    console.log('🔄 Streak data reset');
  }

  /**
   * Sync with backend
   */
  static async syncWithBackend(userId: string, streakData: StreakData): Promise<void> {
    try {
      const response = await fetch('http://localhost:5000/api/progress/streak', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          userId,
          current: streakData.current,
          longest: streakData.longest,
          lastActivityDate: streakData.lastActivityDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync streak with backend');
      }

      console.log('✅ Streak synced with backend');
    } catch (error) {
      console.error('❌ Failed to sync streak with backend:', error);
    }
  }
}

export default StreakService;
