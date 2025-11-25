/**
 * ✅ VALIDATORS & HELPERS
 * Input validation and boundary checking for leveling system
 */

// ========================================
// CONSTANTS
// ========================================

const MIN_LEVEL = 1;
const MAX_LEVEL = 999;
const MIN_XP = 0;
const MAX_XP = Number.MAX_SAFE_INTEGER;
const MIN_ACCURACY = 0;
const MAX_ACCURACY = 100;
const MIN_STREAK = 0;
const MAX_STREAK = 10000;
const MIN_PRESTIGE = 0;
const MAX_PRESTIGE = 10;

// ========================================
// LEVEL VALIDATORS
// ========================================

/**
 * Validate level is within bounds
 */
export const validateLevel = (level: number): boolean => {
  return Number.isInteger(level) && level >= MIN_LEVEL && level <= MAX_LEVEL;
};

/**
 * Clamp level to valid range
 */
export const clampLevel = (level: number): number => {
  return Math.max(MIN_LEVEL, Math.min(MAX_LEVEL, Math.floor(level)));
};

/**
 * Throw error if level is invalid
 */
export const assertValidLevel = (level: number): void => {
  if (!validateLevel(level)) {
    throw new Error(`Invalid level: ${level}. Must be an integer between ${MIN_LEVEL} and ${MAX_LEVEL}.`);
  }
};

// ========================================
// XP VALIDATORS
// ========================================

/**
 * Validate XP is within bounds
 */
export const validateXP = (xp: number): boolean => {
  return Number.isFinite(xp) && xp >= MIN_XP && xp <= MAX_XP;
};

/**
 * Clamp XP to valid range
 */
export const clampXP = (xp: number): number => {
  return Math.max(MIN_XP, Math.min(MAX_XP, Math.floor(xp)));
};

/**
 * Throw error if XP is invalid
 */
export const assertValidXP = (xp: number): void => {
  if (!validateXP(xp)) {
    throw new Error(`Invalid XP: ${xp}. Must be a number between ${MIN_XP} and ${MAX_XP}.`);
  }
};

// ========================================
// ACCURACY VALIDATORS
// ========================================

/**
 * Validate accuracy percentage
 */
export const validateAccuracy = (accuracy: number): boolean => {
  return Number.isFinite(accuracy) && accuracy >= MIN_ACCURACY && accuracy <= MAX_ACCURACY;
};

/**
 * Clamp accuracy to valid range
 */
export const clampAccuracy = (accuracy: number): number => {
  return Math.max(MIN_ACCURACY, Math.min(MAX_ACCURACY, accuracy));
};

/**
 * Throw error if accuracy is invalid
 */
export const assertValidAccuracy = (accuracy: number): void => {
  if (!validateAccuracy(accuracy)) {
    throw new Error(`Invalid accuracy: ${accuracy}. Must be between ${MIN_ACCURACY} and ${MAX_ACCURACY}.`);
  }
};

// ========================================
// STREAK VALIDATORS
// ========================================

/**
 * Validate streak days
 */
export const validateStreak = (streak: number): boolean => {
  return Number.isInteger(streak) && streak >= MIN_STREAK && streak <= MAX_STREAK;
};

/**
 * Clamp streak to valid range
 */
export const clampStreak = (streak: number): number => {
  return Math.max(MIN_STREAK, Math.min(MAX_STREAK, Math.floor(streak)));
};

/**
 * Throw error if streak is invalid
 */
export const assertValidStreak = (streak: number): void => {
  if (!validateStreak(streak)) {
    throw new Error(`Invalid streak: ${streak}. Must be an integer between ${MIN_STREAK} and ${MAX_STREAK}.`);
  }
};

// ========================================
// PRESTIGE VALIDATORS
// ========================================

/**
 * Validate prestige level
 */
export const validatePrestige = (prestige: number): boolean => {
  return Number.isInteger(prestige) && prestige >= MIN_PRESTIGE && prestige <= MAX_PRESTIGE;
};

/**
 * Clamp prestige to valid range
 */
export const clampPrestige = (prestige: number): number => {
  return Math.max(MIN_PRESTIGE, Math.min(MAX_PRESTIGE, Math.floor(prestige)));
};

/**
 * Throw error if prestige is invalid
 */
export const assertValidPrestige = (prestige: number): void => {
  if (!validatePrestige(prestige)) {
    throw new Error(`Invalid prestige: ${prestige}. Must be an integer between ${MIN_PRESTIGE} and ${MAX_PRESTIGE}.`);
  }
};

// ========================================
// MULTIPLIER VALIDATORS
// ========================================

/**
 * Validate multiplier is positive
 */
export const validateMultiplier = (multiplier: number): boolean => {
  return Number.isFinite(multiplier) && multiplier > 0 && multiplier <= 10;
};

/**
 * Clamp multiplier to reasonable range
 */
export const clampMultiplier = (multiplier: number, min = 0.1, max = 10): number => {
  return Math.max(min, Math.min(max, multiplier));
};

/**
 * Throw error if multiplier is invalid
 */
export const assertValidMultiplier = (multiplier: number): void => {
  if (!validateMultiplier(multiplier)) {
    throw new Error(`Invalid multiplier: ${multiplier}. Must be a positive number <= 10.`);
  }
};

// ========================================
// DATE VALIDATORS
// ========================================

/**
 * Validate date object
 */
export const validateDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

/**
 * Throw error if date is invalid
 */
export const assertValidDate = (date: Date): void => {
  if (!validateDate(date)) {
    throw new Error(`Invalid date: ${date}`);
  }
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  return validateDate(date) && date.getTime() > Date.now();
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  return validateDate(date) && date.getTime() < Date.now();
};

// ========================================
// PERCENTAGE VALIDATORS
// ========================================

/**
 * Validate percentage (0-100)
 */
export const validatePercentage = (percentage: number): boolean => {
  return Number.isFinite(percentage) && percentage >= 0 && percentage <= 100;
};

/**
 * Clamp percentage to 0-100
 */
export const clampPercentage = (percentage: number): number => {
  return Math.max(0, Math.min(100, percentage));
};

// ========================================
// SANITIZATION HELPERS
// ========================================

/**
 * Sanitize user input for level progression
 */
export const sanitizeLevelInput = (input: {
  level?: number;
  xp?: number;
  accuracy?: number;
  streak?: number;
  prestige?: number;
}): {
  level: number;
  xp: number;
  accuracy: number;
  streak: number;
  prestige: number;
} => {
  return {
    level: input.level ? clampLevel(input.level) : MIN_LEVEL,
    xp: input.xp ? clampXP(input.xp) : MIN_XP,
    accuracy: input.accuracy ? clampAccuracy(input.accuracy) : 100,
    streak: input.streak ? clampStreak(input.streak) : 0,
    prestige: input.prestige ? clampPrestige(input.prestige) : 0,
  };
};

/**
 * Sanitize XP gain input
 */
export const sanitizeXPGain = (amount: number): number => {
  if (!Number.isFinite(amount)) return 0;
  if (amount < 0) return 0;
  if (amount > 10000) return 10000; // Max XP per action
  return Math.floor(amount);
};

// ========================================
// SAFE MATH OPERATIONS
// ========================================

/**
 * Safely add two numbers (prevent overflow)
 */
export const safeAdd = (a: number, b: number): number => {
  const result = a + b;
  if (!Number.isFinite(result)) {
    return MAX_XP;
  }
  return Math.min(MAX_XP, result);
};

/**
 * Safely multiply two numbers
 */
export const safeMultiply = (a: number, b: number): number => {
  const result = a * b;
  if (!Number.isFinite(result)) {
    return MAX_XP;
  }
  return Math.min(MAX_XP, result);
};

/**
 * Safely calculate percentage
 */
export const safePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  if (!Number.isFinite(value) || !Number.isFinite(total)) return 0;
  return clampPercentage((value / total) * 100);
};

// ========================================
// BOUNDARY CHECKS
// ========================================

/**
 * Check if user is at max level
 */
export const isMaxLevel = (level: number): boolean => {
  return level >= MAX_LEVEL;
};

/**
 * Check if user can prestige (level 200+)
 */
export const canPrestige = (level: number): boolean => {
  return level >= 200;
};

/**
 * Check if prestige is maxed out
 */
export const isMaxPrestige = (prestige: number): boolean => {
  return prestige >= MAX_PRESTIGE;
};

// ========================================
// EXPORTS
// ========================================

export const Validators = {
  // Level
  validateLevel,
  clampLevel,
  assertValidLevel,
  
  // XP
  validateXP,
  clampXP,
  assertValidXP,
  
  // Accuracy
  validateAccuracy,
  clampAccuracy,
  assertValidAccuracy,
  
  // Streak
  validateStreak,
  clampStreak,
  assertValidStreak,
  
  // Prestige
  validatePrestige,
  clampPrestige,
  assertValidPrestige,
  
  // Multiplier
  validateMultiplier,
  clampMultiplier,
  assertValidMultiplier,
  
  // Date
  validateDate,
  assertValidDate,
  isFutureDate,
  isPastDate,
  
  // Percentage
  validatePercentage,
  clampPercentage,
  
  // Sanitization
  sanitizeLevelInput,
  sanitizeXPGain,
  
  // Safe Math
  safeAdd,
  safeMultiply,
  safePercentage,
  
  // Boundary Checks
  isMaxLevel,
  canPrestige,
  isMaxPrestige,
};

export default Validators;
