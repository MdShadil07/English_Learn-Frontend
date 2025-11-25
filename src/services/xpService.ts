/**
 * 🎮 XP SERVICE - Backend Integration
 * 
 * Calls backend XP/Leveling API for accurate calculations
 * All XP and Level calculations are done by the backend
 */


// ========================================
// TYPES
// ========================================

export interface XPAwardParams {
  userId: string;
  wordCount: number;
  accuracy: number;
  errorCount?: number;
  criticalErrors?: number;
  baseXP?: number;
}

export interface XPAwardResponse {
  success: boolean;
  message: string;
  data: {
    xp: {
      earned: number;
      baseXP: number;
      bonusXP: number;
      penalty: number;
      multipliers: {
        tier: number;
        accuracy: number;
        streak: number;
        prestige: number;
        total: number;
      };
      breakdown: string;
    };
    level: {
      current: number;
      previous: number;
      leveledUp: boolean;
      levelsGained: number;
      proficiency: string;
      isMilestone: boolean;
      rewards?: string[];
    };
    progress: {
      currentXP: number;
      xpForCurrentLevel: number;
      xpForNextLevel: number;
      xpToNextLevel: number;
      progressPercentage: number;
      proficiency: string;
    };
  };
}

export interface UserProgress {
  userId: string;
  level: number;
  xp: number;
  proficiency: string;
  progress: {
    currentXP: number;
    xpForCurrentLevel: number;
    xpForNextLevel: number;
    xpToNextLevel: number;
    progressPercentage: number;
    proficiency: string;
  };
  tier: string;
  prestigeLevel: number;
}

export interface XPPreviewParams {
  wordCount: number;
  accuracy: number;
  errorCount?: number;
  criticalErrors?: number;
  tier?: string;
  streakDays?: number;
  prestigeLevel?: number;
}

export interface XPPreviewResponse {
  success: boolean;
  data: {
    netXP: number;
    baseXP: number;
    bonusXP: number;
    penalty: number;
    multipliers: {
      tier: number;
      accuracy: number;
      streak: number;
      prestige: number;
      total: number;
    };
    breakdown: string;
  };
}

// ========================================
// XP SERVICE CLASS
// ========================================

class XPService {
  /**
   * Award XP to user and process level ups
   * @param params - XP award parameters
   * @returns Award result with XP breakdown and level info
   */
  async awardXP(params: XPAwardParams): Promise<XPAwardResponse> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/xp/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to award XP');
      }

      const data: XPAwardResponse = await response.json();
      
      console.log('✅ XP Awarded:', {
        earned: data.data.xp.earned,
        level: data.data.level.current,
        leveledUp: data.data.level.leveledUp,
      });

      return data;
    } catch (error) {
      console.error('❌ Error awarding XP:', error);
      throw error;
    }
  }

  /**
   * Get user's current progress
   * @param userId - User ID
   * @returns Current level, XP, and progress info
   */
  async getProgress(userId: string): Promise<UserProgress> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/xp/progress/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch progress');
      }

      const result = await response.json();
      return result.data as UserProgress;
    } catch (error) {
      console.error('❌ Error fetching progress:', error);
      throw error;
    }
  }

  /**
   * Preview XP calculation without saving
   * Useful for showing estimated XP before user submits
   * @param params - Preview parameters
   * @returns XP calculation preview
   */
  async previewXP(params: XPPreviewParams): Promise<XPPreviewResponse> {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/xp/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to preview XP');
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Error previewing XP:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const xpService = new XPService();
export default xpService;
