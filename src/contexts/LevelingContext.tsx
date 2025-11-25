/**
 * ⚡ ADVANCED LEVELING SYSTEM - Backend Integration
 * 
 * Features:
 * - Backend XP calculation (accurate, fair, tier-based)
 * - Level progression via backend service
 * - Data persistence (localStorage + backend sync)
 * - Centralized state management
 * - Real-time progress updates
 * - Integrates with accuracy system
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { useAccuracy } from './AccuracyContext';
import xpService, { XPAwardParams, UserProgress } from '@/services/xpService';

// Legacy type for compatibility
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master';

// Helper function to calculate tier based on level
const calculateTier = (level: number): number => {
  if (level >= 100) return 6; // legend
  if (level >= 75) return 5;  // master
  if (level >= 50) return 4;  // expert
  if (level >= 25) return 3;  // advanced
  if (level >= 10) return 2;  // intermediate
  return 1; // beginner
};

// ==================== TYPES ====================

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpToNextLevel: number;
  progressPercentage: number;
  proficiencyLevel: ProficiencyLevel;
  tier: number; // 1-10 (tiers within each proficiency level)
}

export interface LevelStats {
  totalXP: number;
  totalMessages: number;
  averageAccuracy: number;
  consistencyScore: number;
  currentStreak: number;
  longestStreak: number;
  perfectMessages: number;
  lastMessageTimestamp: Date | null;
}

export interface LevelMilestone {
  level: number;
  name: string;
  proficiencyLevel: ProficiencyLevel;
  unlockedAt: Date;
  xpRequired: number;
  rewards?: string[];
}

interface LevelingContextState {
  levelProgress: LevelProgress;
  levelStats: LevelStats;
  milestones: LevelMilestone[];
  isLoading: boolean;
  
  // Actions
  awardXPForMessage: (params: {
    wordCount: number;
    accuracy: number;
    errorCount?: number;
    criticalErrors?: number;
  }) => Promise<unknown>;
  addXP: (amount: number, accuracy?: number) => Promise<void>;
  updateStats: (messageData: {
    accuracy: number;
    isPerfect: boolean;
    timestamp: Date;
  }) => void;
  resetProgress: () => void;
  
  // Utilities
  getXPForLevel: (level: number) => number;
  getLevelFromXP: (xp: number) => number;
  getProficiencyLevel: (level: number) => ProficiencyLevel;
  getNextMilestone: () => LevelMilestone | null;
}

// ==================== CONSTANTS ====================

// XP curve configuration
const XP_CURVE_CONFIG = {
  BASE_XP: 500,              // XP needed for level 1 → 2
  EXPONENT: 1.5,             // Exponential growth factor
  MULTIPLIER: 1.15,          // Linear multiplier per level
  MILESTONE_BONUS: 1.25,     // Extra multiplier every 10 levels
};

// Proficiency level thresholds
const PROFICIENCY_LEVELS: Record<ProficiencyLevel, { minLevel: number; maxLevel: number }> = {
  Beginner: { minLevel: 1, maxLevel: 20 },
  Intermediate: { minLevel: 21, maxLevel: 50 },
  Advanced: { minLevel: 51, maxLevel: 100 },
  Expert: { minLevel: 101, maxLevel: 200 },
  Master: { minLevel: 201, maxLevel: Infinity },
};

// Milestone rewards
const MILESTONE_REWARDS: Record<number, string[]> = {
  5: ['🎯 Accuracy Insight Unlocked', '📊 Progress Chart'],
  10: ['🔥 Streak Tracker', '⭐ First Star Badge'],
  20: ['🎓 Intermediate Badge', '📈 Advanced Analytics'],
  30: ['💎 Premium Features Preview', '🏆 Achievement Board'],
  50: ['🎖️ Advanced Badge', '🔮 AI Insights Plus'],
  75: ['🌟 Gold Star Badge', '📚 Learning Path Customization'],
  100: ['👑 Expert Badge', '🚀 Master Class Access'],
  150: ['💫 Platinum Badge', '🎁 Exclusive Rewards'],
  200: ['🏅 Master Badge', '👨‍🏫 Mentor Status'],
};

// Storage keys
const STORAGE_KEYS = {
  LEVEL_PROGRESS: 'leveling_progress',
  LEVEL_STATS: 'leveling_stats',
  MILESTONES: 'leveling_milestones',
} as const;

// ==================== CONTEXT ====================

export const LevelingContext = createContext<LevelingContextState | undefined>(undefined);

export const LevelingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getConsistencyScore } = useAccuracy();
  
  // ==================== STATE ====================
  
  const [levelStats, setLevelStats] = useState<LevelStats>({
    totalXP: 0,
    totalMessages: 0,
    averageAccuracy: 0,
    consistencyScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    perfectMessages: 0,
    lastMessageTimestamp: null,
  });
  
  const [milestones, setMilestones] = useState<LevelMilestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // ==================== COMPUTED VALUES ====================
  
  const levelProgress = useMemo((): LevelProgress => {
    // Use cached values from backend response if available
    const currentLevel = levelStats.totalMessages > 0 
      ? Math.max(1, Math.floor(levelStats.totalXP / 100) + 1) // Simple fallback calculation
      : 1;
    
    const xpForCurrentLevel = (currentLevel - 1) * 100;
    const xpForNextLevel = currentLevel * 100;
    const currentXP = levelStats.totalXP - xpForCurrentLevel;
    const xpToNextLevel = xpForNextLevel - levelStats.totalXP;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercentage = (currentXP / xpNeededForLevel) * 100;
    
    // Map proficiency level based on current level
    let proficiencyLevel: ProficiencyLevel = 'Beginner';
    if (currentLevel >= 201) proficiencyLevel = 'Master';
    else if (currentLevel >= 101) proficiencyLevel = 'Expert';
    else if (currentLevel >= 51) proficiencyLevel = 'Advanced';
    else if (currentLevel >= 21) proficiencyLevel = 'Intermediate';
    
    const tier = calculateTier(currentLevel);
    
    return {
      currentLevel,
      currentXP,
      xpForCurrentLevel,
      xpForNextLevel,
      xpToNextLevel,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      proficiencyLevel,
      tier,
    };
  }, [levelStats.totalXP, levelStats.totalMessages]);
  
  // ==================== PERSISTENCE ====================
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedStats = localStorage.getItem(STORAGE_KEYS.LEVEL_STATS);
      const storedMilestones = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      
      if (storedStats) {
        const parsed = JSON.parse(storedStats);
        setLevelStats({
          ...parsed,
          lastMessageTimestamp: parsed.lastMessageTimestamp 
            ? new Date(parsed.lastMessageTimestamp) 
            : null,
        });
      }
      
      if (storedMilestones) {
        const parsed = JSON.parse(storedMilestones);
        setMilestones(
          parsed.map((m: LevelMilestone) => ({
            ...m,
            unlockedAt: new Date(m.unlockedAt),
          }))
        );
      }
      
      console.log('✅ Leveling system loaded from cache');
    } catch (err) {
      console.error('❌ Error loading leveling data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Save to localStorage whenever state changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEYS.LEVEL_STATS, JSON.stringify(levelStats));
        localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
      } catch (err) {
        console.error('❌ Error saving leveling data:', err);
      }
    }
  }, [levelStats, milestones, isLoading]);
  
  // ==================== ACTIONS ====================
  
  /**
   * Award XP for a message with full accuracy analysis
   * This is the primary method for awarding XP based on message quality
   */
  const awardXPForMessage = useCallback(async (params: {
    wordCount: number;
    accuracy: number;
    errorCount?: number;
    criticalErrors?: number;
  }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('⚠️ No userId found, cannot award XP');
        return null;
      }

      const oldLevel = levelProgress.currentLevel;
      
      // Award XP via backend with full accuracy data
      const awardParams: XPAwardParams = {
        userId,
        wordCount: params.wordCount,
        accuracy: params.accuracy,
        errorCount: params.errorCount || 0,
        criticalErrors: params.criticalErrors || 0,
      };

      const result = await xpService.awardXP(awardParams);
      
      // Update local state with backend response
      setLevelStats(prev => ({
        ...prev,
        totalXP: result.data.progress.currentXP + result.data.xp.earned,
        totalMessages: prev.totalMessages + 1,
      }));

      // Check for level up
      if (result.data.level.leveledUp) {
        const newLevel = result.data.level.current;
        
        console.log('🎉 LEVEL UP!', {
          oldLevel,
          newLevel,
          xpGained: result.data.xp.earned,
          proficiency: result.data.level.proficiency,
          rewards: result.data.level.rewards,
        });
        
        // Check for milestones
        if (MILESTONE_REWARDS[newLevel]) {
          const newMilestone: LevelMilestone = {
            level: newLevel,
            name: `Level ${newLevel} Milestone`,
            proficiencyLevel: result.data.level.proficiency as ProficiencyLevel,
            unlockedAt: new Date(),
            xpRequired: result.data.progress.xpForNextLevel,
            rewards: MILESTONE_REWARDS[newLevel],
          };
          
          setMilestones(prev => [...prev, newMilestone]);
          
          console.log('🏆 MILESTONE UNLOCKED!', newMilestone);
        }
      }
      
      console.log('⚡ XP Awarded via Backend:', {
        earned: result.data.xp.earned,
        breakdown: result.data.xp.breakdown,
        multipliers: result.data.xp.multipliers,
        progress: result.data.progress,
      });

      return result;
    } catch (error) {
      console.error('❌ Error awarding XP:', error);
      return null;
    }
  }, [levelProgress.currentLevel]);

  /**
   * Add XP (simple method for backward compatibility)
   * For messages, use awardXPForMessage instead
   */
  const addXP = useCallback(async (amount: number, accuracy?: number) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('⚠️ No userId found, cannot award XP');
        return;
      }

      const oldLevel = levelProgress.currentLevel;
      
      // Award XP via backend
      const params: XPAwardParams = {
        userId,
        wordCount: Math.ceil(amount / 2), // Convert XP back to word count estimate
        accuracy: accuracy || 85,
        errorCount: 0,
        criticalErrors: 0,
        baseXP: amount,
      };

      const result = await xpService.awardXP(params);
      
      // Update local state with backend response
      setLevelStats(prev => ({
        ...prev,
        totalXP: result.data.progress.currentXP + result.data.xp.earned,
      }));

      // Check for level up
      if (result.data.level.leveledUp) {
        const newLevel = result.data.level.current;
        
        console.log('🎉 LEVEL UP!', {
          oldLevel,
          newLevel,
          xpGained: result.data.xp.earned,
          proficiency: result.data.level.proficiency,
        });
        
        // Check for milestones
        if (MILESTONE_REWARDS[newLevel]) {
          const newMilestone: LevelMilestone = {
            level: newLevel,
            name: `Level ${newLevel} Milestone`,
            proficiencyLevel: result.data.level.proficiency as ProficiencyLevel,
            unlockedAt: new Date(),
            xpRequired: result.data.progress.xpForNextLevel,
            rewards: MILESTONE_REWARDS[newLevel],
          };
          
          setMilestones(prev => [...prev, newMilestone]);
          
          console.log('🏆 MILESTONE UNLOCKED!', newMilestone);
        }
      }
      
      console.log('⚡ XP Added via Backend:', {
        earned: result.data.xp.earned,
        multipliers: result.data.xp.multipliers,
        breakdown: result.data.xp.breakdown,
      });
    } catch (error) {
      console.error('❌ Error awarding XP:', error);
      // Fallback: update locally if backend fails
      setLevelStats(prev => ({
        ...prev,
        totalXP: prev.totalXP + amount,
      }));
    }
  }, [levelProgress.currentLevel]);
  
  /**
   * Update stats when a message is sent
   */
  const updateStats = useCallback((messageData: {
    accuracy: number;
    isPerfect: boolean;
    timestamp: Date;
  }) => {
    setLevelStats(prev => {
      const { accuracy, isPerfect, timestamp } = messageData;
      
      // Calculate streak
      let newStreak = prev.currentStreak;
      const lastMessage = prev.lastMessageTimestamp;
      
      if (lastMessage) {
        const hoursSinceLastMessage = (timestamp.getTime() - lastMessage.getTime()) / (1000 * 60 * 60);
        
        // Maintain streak if within 24 hours
        if (hoursSinceLastMessage <= 24) {
          newStreak += 1;
        } else {
          newStreak = 1; // Reset streak
        }
      } else {
        newStreak = 1;
      }
      
      const newLongestStreak = Math.max(prev.longestStreak, newStreak);
      const newTotalMessages = prev.totalMessages + 1;
      
      // Update average accuracy (weighted average)
      const newAverageAccuracy = 
        (prev.averageAccuracy * prev.totalMessages + accuracy) / newTotalMessages;
      
      return {
        ...prev,
        totalMessages: newTotalMessages,
        averageAccuracy: parseFloat(newAverageAccuracy.toFixed(2)),
        consistencyScore: getConsistencyScore(),
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        perfectMessages: isPerfect ? prev.perfectMessages + 1 : prev.perfectMessages,
        lastMessageTimestamp: timestamp,
      };
    });
    
    console.log('📊 Stats Updated:', {
      accuracy: messageData.accuracy,
      isPerfect: messageData.isPerfect,
      newStreak: levelStats.currentStreak + 1,
    });
  }, [levelStats.currentStreak, getConsistencyScore]);
  
  /**
   * Reset all progress (use with caution)
   */
  const resetProgress = useCallback(() => {
    const confirmed = window.confirm(
      '⚠️ This will reset ALL leveling progress. Are you sure?'
    );
    
    if (confirmed) {
      setLevelStats({
        totalXP: 0,
        totalMessages: 0,
        averageAccuracy: 0,
        consistencyScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        perfectMessages: 0,
        lastMessageTimestamp: null,
      });
      setMilestones([]);
      
      localStorage.removeItem(STORAGE_KEYS.LEVEL_STATS);
      localStorage.removeItem(STORAGE_KEYS.MILESTONES);
      
      console.log('🗑️ Leveling progress reset');
    }
  }, []);
  
  // ==================== UTILITIES ====================
  
  const getXPForLevel = useCallback((level: number) => {
    // Simple formula: each level requires level * 100 XP
    return level * 100;
  }, []);
  
  const getLevelFromXPUtil = useCallback((xp: number) => {
    // Simple calculation: level = floor(xp / 100) + 1
    return Math.floor(xp / 100) + 1;
  }, []);
  
  const getProficiencyLevelUtil = useCallback((level: number): ProficiencyLevel => {
    if (level >= 201) return 'Master';
    if (level >= 101) return 'Expert';
    if (level >= 51) return 'Advanced';
    if (level >= 21) return 'Intermediate';
    return 'Beginner';
  }, []);
  
  const getNextMilestone = useCallback((): LevelMilestone | null => {
    const nextMilestoneLevel = Object.keys(MILESTONE_REWARDS)
      .map(Number)
      .find(level => level > levelProgress.currentLevel);
    
    if (!nextMilestoneLevel) return null;
    
    return {
      level: nextMilestoneLevel,
      name: `Level ${nextMilestoneLevel} Milestone`,
      proficiencyLevel: getProficiencyLevelUtil(nextMilestoneLevel),
      unlockedAt: new Date(), // Will be replaced when actually unlocked
      xpRequired: nextMilestoneLevel * 100,
      rewards: MILESTONE_REWARDS[nextMilestoneLevel],
    };
  }, [levelProgress.currentLevel, getProficiencyLevelUtil]);
  
  // ==================== CONTEXT VALUE ====================
  
  const value: LevelingContextState = {
    levelProgress,
    levelStats,
    milestones,
    isLoading,
    awardXPForMessage,
    addXP,
    updateStats,
    resetProgress,
    getXPForLevel,
    getLevelFromXP: getLevelFromXPUtil,
    getProficiencyLevel: getProficiencyLevelUtil,
    getNextMilestone,
  };
  
  return (
    <LevelingContext.Provider value={value}>
      {children}
    </LevelingContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================
// (Moved to useLeveling.ts)
