/**
 * 🧮 CORE XP CALCULATION ENGINE
 * Advanced XP calculation with multiple factors and adaptive difficulty
 */

import type {
  XPCalculationResult,
  XPSource,
  AdaptiveDifficulty,
  MomentumSystem,
  PrestigeSystem,
} from '../types';
import { XP_CURVE_CONFIG, ACCURACY_MULTIPLIERS, STREAK_BONUSES } from '../core/config';

// ========================================
// CORE XP CURVE FUNCTIONS
// ========================================

/**
 * Calculate XP required for a specific level
 * Uses exponential growth with milestone bonuses
 */
export const calculateXPForLevel = (level: number, prestigeLevel: number = 0): number => {
  if (level <= 1) return 0;
  
  const { BASE_XP, MULTIPLIER, EXPONENT, MILESTONE_BONUS, PRESTIGE_SCALING } = XP_CURVE_CONFIG;
  
  // Base exponential calculation
  let xp = BASE_XP * Math.pow(MULTIPLIER, level - 1) * Math.pow(level, EXPONENT);
  
  // Milestone bonus every 10 levels
  if (level % 10 === 0) {
    xp *= MILESTONE_BONUS;
  }
  
  // Prestige scaling (makes it harder after each prestige)
  if (prestigeLevel > 0) {
    xp *= Math.pow(PRESTIGE_SCALING, prestigeLevel);
  }
  
  return Math.floor(xp);
};

/**
 * Calculate cumulative XP for a specific level
 */
export const calculateCumulativeXP = (level: number, prestigeLevel: number = 0): number => {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += calculateXPForLevel(i, prestigeLevel);
  }
  return total;
};

/**
 * Get level from total XP
 */
export const getLevelFromXP = (totalXP: number, prestigeLevel: number = 0): number => {
  let level = 1;
  let cumulativeXP = 0;
  
  while (cumulativeXP <= totalXP) {
    level++;
    cumulativeXP += calculateXPForLevel(level, prestigeLevel);
    
    // Safety check to prevent infinite loop
    if (level > 999) break;
  }
  
  return level - 1;
};

// ========================================
// MULTIPLIER CALCULATIONS
// ========================================

/**
 * Get accuracy-based multiplier
 */
export const getAccuracyMultiplier = (accuracy: number): number => {
  for (const tier of ACCURACY_MULTIPLIERS) {
    if (accuracy >= tier.threshold) {
      return tier.multiplier;
    }
  }
  return 0.8; // Fallback
};

/**
 * Get streak-based multiplier
 */
export const getStreakMultiplier = (streakDays: number): number => {
  for (const tier of STREAK_BONUSES) {
    if (streakDays >= tier.days) {
      return tier.multiplier;
    }
  }
  return 1.0; // No bonus
};

/**
 * Calculate momentum multiplier
 */
export const calculateMomentumMultiplier = (momentumSystem: MomentumSystem): number => {
  if (!momentumSystem.bonusActive) return 1.0;
  
  // Check if momentum expired
  if (momentumSystem.expiresAt && new Date() > momentumSystem.expiresAt) {
    return 1.0;
  }
  
  return momentumSystem.multiplier;
};

/**
 * Calculate prestige bonus multiplier
 */
export const getPrestigeMultiplier = (prestigeSystem: PrestigeSystem): number => {
  return prestigeSystem.prestigeXPBonus;
};

// ========================================
// ADAPTIVE DIFFICULTY
// ========================================

/**
 * Calculate adaptive difficulty multiplier
 * Adjusts XP based on recent performance trends
 */
export const calculateAdaptiveDifficulty = (
  recentAccuracyTrend: number,
  consistencyScore: number,
  improvementRate: number
): number => {
  // Base multiplier
  let multiplier = 1.0;
  
  // Adjust based on accuracy trend (-20% to +20%)
  const trendAdjustment = (recentAccuracyTrend / 100) * 0.5;
  multiplier += Math.max(-0.2, Math.min(0.2, trendAdjustment));
  
  // Bonus for high consistency (0 to +15%)
  const consistencyBonus = (consistencyScore / 100) * 0.15;
  multiplier += consistencyBonus;
  
  // Bonus for improvement (+0% to +20%)
  const improvementBonus = Math.max(0, Math.min(0.2, improvementRate / 50));
  multiplier += improvementBonus;
  
  // Clamp to reasonable range (0.5x to 2.0x)
  return Math.max(0.5, Math.min(2.0, multiplier));
};

// ========================================
// DECAY CALCULATION
// ========================================

/**
 * Calculate XP decay from inactivity
 */
export const calculateDecay = (
  lastActiveDate: Date,
  decayConfig: {
    gracePeriodDays: number;
    decayRatePerDay: number;
    maxDecayPercentage: number;
  }
): number => {
  const daysInactive = Math.floor(
    (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // No decay during grace period
  if (daysInactive <= decayConfig.gracePeriodDays) {
    return 1.0; // No decay
  }
  
  // Calculate decay after grace period
  const decayDays = daysInactive - decayConfig.gracePeriodDays;
  const decayAmount = decayDays * decayConfig.decayRatePerDay;
  
  // Cap at max decay percentage
  const totalDecay = Math.min(decayAmount, decayConfig.maxDecayPercentage / 100);
  
  return 1.0 - totalDecay;
};

// ========================================
// COMPREHENSIVE XP CALCULATION
// ========================================

export interface XPCalculationParams {
  baseAmount: number;
  accuracy?: number;
  streakDays?: number;
  tierMultiplier?: number;
  adaptiveDifficulty?: AdaptiveDifficulty;
  momentumSystem?: MomentumSystem;
  prestigeSystem?: PrestigeSystem;
  eventMultiplier?: number;
  isPerfectMessage?: boolean;
}

/**
 * Calculate total XP with all multipliers
 * This is the main XP calculation function
 */
export const calculateTotalXP = (params: XPCalculationParams): XPCalculationResult => {
  const {
    baseAmount,
    accuracy = 100,
    streakDays = 0,
    tierMultiplier = 1.0,
    adaptiveDifficulty,
    momentumSystem,
    prestigeSystem,
    eventMultiplier = 1.0,
    isPerfectMessage = false,
  } = params;
  
  const sources: XPSource[] = [];
  
  // Base XP
  sources.push({
    type: 'accuracy',
    amount: baseAmount,
    multiplier: 1.0,
    description: 'Base XP',
    timestamp: new Date(),
  });
  
  // Calculate all multipliers
  const accuracyMult = accuracy ? getAccuracyMultiplier(accuracy) : 1.0;
  const streakMult = getStreakMultiplier(streakDays);
  const momentumMult = momentumSystem ? calculateMomentumMultiplier(momentumSystem) : 1.0;
  const prestigeMult = prestigeSystem ? getPrestigeMultiplier(prestigeSystem) : 1.0;
  const adaptiveMult = adaptiveDifficulty?.trendMultiplier || 1.0;
  const decayMult = adaptiveDifficulty?.decayFactor || 1.0;
  
  // Perfect message bonus
  const perfectBonus = isPerfectMessage ? 1.5 : 1.0;
  
  // Total multiplier
  const totalMultiplier = 
    accuracyMult * 
    streakMult * 
    tierMultiplier * 
    adaptiveMult * 
    momentumMult * 
    prestigeMult * 
    eventMultiplier * 
    perfectBonus * 
    decayMult;
  
  // Add bonus sources
  if (accuracyMult > 1.0) {
    sources.push({
      type: 'accuracy',
      amount: baseAmount * (accuracyMult - 1.0),
      multiplier: accuracyMult,
      description: `Accuracy Bonus (${accuracy}%)`,
      timestamp: new Date(),
    });
  }
  
  if (streakMult > 1.0) {
    sources.push({
      type: 'streak',
      amount: baseAmount * (streakMult - 1.0),
      multiplier: streakMult,
      description: `${streakDays}-Day Streak Bonus`,
      timestamp: new Date(),
    });
  }
  
  if (momentumMult > 1.0) {
    sources.push({
      type: 'bonus',
      amount: baseAmount * (momentumMult - 1.0),
      multiplier: momentumMult,
      description: `Momentum Bonus (${momentumSystem?.momentumLevel || 0}/5)`,
      timestamp: new Date(),
    });
  }
  
  if (isPerfectMessage) {
    sources.push({
      type: 'bonus',
      amount: baseAmount * 0.5,
      multiplier: perfectBonus,
      description: 'Perfect Message! 🎯',
      timestamp: new Date(),
    });
  }
  
  if (eventMultiplier > 1.0) {
    sources.push({
      type: 'event',
      amount: baseAmount * (eventMultiplier - 1.0),
      multiplier: eventMultiplier,
      description: 'Event Bonus Active! 🎉',
      timestamp: new Date(),
    });
  }
  
  // Calculate final XP
  const totalXP = Math.floor(baseAmount * totalMultiplier);
  const bonusXP = totalXP - baseAmount;
  
  return {
    baseXP: baseAmount,
    bonusXP: bonusXP,
    totalXP: totalXP,
    multipliers: {
      accuracy: accuracyMult,
      streak: streakMult,
      tier: tierMultiplier,
      adaptive: adaptiveMult,
      event: eventMultiplier,
      momentum: momentumMult,
      prestige: prestigeMult,
      total: totalMultiplier,
    },
    breakdown: sources,
  };
};

// ========================================
// SKILL-SPECIFIC XP DISTRIBUTION
// ========================================

/**
 * Distribute XP across skill categories
 */
export const distributeSkillXP = (
  totalXP: number,
  skillBreakdown?: Partial<Record<string, number>>
): Record<string, number> => {
  if (!skillBreakdown) {
    // Equal distribution if no breakdown provided
    const categories = ['grammar', 'vocabulary', 'spelling', 'fluency'];
    const xpPerSkill = Math.floor(totalXP / categories.length);
    
    return categories.reduce((acc, skill) => {
      acc[skill] = xpPerSkill;
      return acc;
    }, {} as Record<string, number>);
  }
  
  // Distribute based on provided breakdown
  const result: Record<string, number> = {};
  const total = Object.values(skillBreakdown).reduce((sum, val) => sum + (val || 0), 0);
  
  for (const [skill, weight] of Object.entries(skillBreakdown)) {
    if (weight && total > 0) {
      result[skill] = Math.floor((weight / total) * totalXP);
    }
  }
  
  return result;
};

// ========================================
// FORECAST & ANALYTICS
// ========================================

/**
 * Forecast when user will reach next level
 */
export const forecastLevelUp = (
  currentXP: number,
  xpToNextLevel: number,
  avgXPPerDay: number
): Date | null => {
  if (avgXPPerDay <= 0) return null;
  
  const daysToLevelUp = Math.ceil(xpToNextLevel / avgXPPerDay);
  const forecastDate = new Date();
  forecastDate.setDate(forecastDate.getDate() + daysToLevelUp);
  
  return forecastDate;
};

/**
 * Calculate average XP per day
 */
export const calculateAverageXPPerDay = (
  totalXP: number,
  activeDays: number
): number => {
  if (activeDays <= 0) return 0;
  return totalXP / activeDays;
};

/**
 * Calculate XP velocity (XP gain rate)
 */
export const calculateXPVelocity = (
  recentXP: number[],
  windowDays: number = 7
): number => {
  if (recentXP.length < 2) return 0;
  
  const recent = recentXP.slice(-windowDays);
  const sum = recent.reduce((acc, val) => acc + val, 0);
  
  return sum / recent.length;
};

// ========================================
// EXPORTS
// ========================================

export const XPCalculator = {
  calculateXPForLevel,
  calculateCumulativeXP,
  getLevelFromXP,
  getAccuracyMultiplier,
  getStreakMultiplier,
  calculateMomentumMultiplier,
  getPrestigeMultiplier,
  calculateAdaptiveDifficulty,
  calculateDecay,
  calculateTotalXP,
  distributeSkillXP,
  forecastLevelUp,
  calculateAverageXPPerDay,
  calculateXPVelocity,
};

export default XPCalculator;
