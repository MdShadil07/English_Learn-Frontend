/**
 * ⚡ ENHANCEMENT: Centralized Accuracy Context
 * 
 * Provides accuracy state management across the application
 * Eliminates prop drilling and enables easy access to accuracy data
 * Implements caching and performance optimizations
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// Types
export interface AccuracyData {
  overall: number;
  weightedOverall?: number;
  adjustedOverall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation: number;
  capitalization: number;
  contextRelevance: number;
  messageLengthScore: number;
  complexityScore: number;
  
  aiResponseAnalysis?: {
    hasCorrectionFeedback: boolean;
    hasAppreciation: boolean;
    hasGrammarCorrection: boolean;
    hasSpellingCorrection: boolean;
    hasVocabularyFeedback: boolean;
    correctedErrors: string[];
    appreciationLevel: 'none' | 'low' | 'medium' | 'high';
    severityOfCorrections: 'none' | 'minor' | 'moderate' | 'major';
  };
  
  feedback: string[];
  errors: Array<{
    type: string;
    message: string;
    position?: number;
    severity: 'low' | 'medium' | 'high';
    suggestion?: string;
  }>;
  suggestions: string[];
  
  statistics: {
    wordCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    uniqueWordRatio: number;
    errorCount: number;
    spellingErrorCount: number;
    grammarErrorCount: number;
    vocabularyErrorCount: number;
    fluencyErrorCount: number;
    punctuationErrorCount: number;
    capitalizationErrorCount: number;
  };
  
  insights: {
    level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    strengths: string[];
    weaknesses: string[];
    improvement: number;
    consistencyScore?: number;
  };
  
  xpEarned: number;
  xpPenalty: number;
  netXP: number;
  adaptiveXPMultiplier?: number;
}

export interface LatestAccuracy {
  accuracy: AccuracyData;
  xpGained: number;
  timestamp: Date;
}

interface AccuracyContextState {
  latestAccuracy: LatestAccuracy | null;
  accuracyHistory: LatestAccuracy[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setLatestAccuracy: (accuracy: LatestAccuracy) => void;
  clearAccuracy: () => void;
  getAverageAccuracy: () => number;
  getTotalXP: () => number;
  getConsistencyScore: () => number;
}

const AccuracyContext = createContext<AccuracyContextState | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  LATEST: 'accuracy_latest',
  HISTORY: 'accuracy_history',
} as const;

// Maximum history size (keep last 50 messages)
const MAX_HISTORY_SIZE = 50;

export const AccuracyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latestAccuracy, setLatestAccuracyState] = useState<LatestAccuracy | null>(null);
  const [accuracyHistory, setAccuracyHistory] = useState<LatestAccuracy[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ⚡ OPTIMIZATION: Load from localStorage on mount
  useEffect(() => {
    try {
      const storedLatest = localStorage.getItem(STORAGE_KEYS.LATEST);
      const storedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
      
      if (storedLatest) {
        const parsed = JSON.parse(storedLatest);
        setLatestAccuracyState({
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        });
      }
      
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory) as LatestAccuracy[];
        setAccuracyHistory(
          parsed.map((item) => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }))
        );
      }
      
      console.log('✅ Accuracy context loaded from cache');
    } catch (err) {
      console.error('❌ Error loading accuracy from cache:', err);
      setError('Failed to load accuracy history');
    }
  }, []);

  // ⚡ OPTIMIZATION: Save to localStorage whenever state changes
  useEffect(() => {
    if (latestAccuracy) {
      try {
        localStorage.setItem(STORAGE_KEYS.LATEST, JSON.stringify(latestAccuracy));
      } catch (err) {
        console.error('❌ Error saving latest accuracy:', err);
      }
    }
  }, [latestAccuracy]);

  useEffect(() => {
    if (accuracyHistory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(accuracyHistory));
      } catch (err) {
        console.error('❌ Error saving accuracy history:', err);
      }
    }
  }, [accuracyHistory]);

  // Set latest accuracy and update history
  const setLatestAccuracy = useCallback((accuracy: LatestAccuracy) => {
    setLatestAccuracyState(accuracy);
    
    setAccuracyHistory((prev) => {
      const updated = [accuracy, ...prev].slice(0, MAX_HISTORY_SIZE);
      return updated;
    });
    
    console.log('📊 Accuracy updated:', {
      overall: accuracy.accuracy.overall,
      weightedOverall: accuracy.accuracy.weightedOverall,
      xpGained: accuracy.xpGained,
      level: accuracy.accuracy.insights.level,
    });
  }, []);

  // Clear all accuracy data
  const clearAccuracy = useCallback(() => {
    setLatestAccuracyState(null);
    setAccuracyHistory([]);
    localStorage.removeItem(STORAGE_KEYS.LATEST);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    console.log('🗑️ Accuracy data cleared');
  }, []);

  // Calculate average accuracy from history
  const getAverageAccuracy = useCallback(() => {
    if (accuracyHistory.length === 0) return 0;
    
    const sum = accuracyHistory.reduce(
      (total, item) => total + (item.accuracy.weightedOverall || item.accuracy.overall),
      0
    );
    
    return parseFloat((sum / accuracyHistory.length).toFixed(2));
  }, [accuracyHistory]);

  // Calculate total XP gained
  const getTotalXP = useCallback(() => {
    return accuracyHistory.reduce((total, item) => total + item.xpGained, 0);
  }, [accuracyHistory]);

  // ⚡ NEW: Calculate consistency score based on variance in recent messages
  const getConsistencyScore = useCallback(() => {
    if (accuracyHistory.length < 3) return 100; // Not enough data
    
    const recent = accuracyHistory.slice(0, 10); // Last 10 messages
    const scores = recent.map(item => item.accuracy.weightedOverall || item.accuracy.overall);
    
    // Calculate mean
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    
    // Calculate variance
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    // Calculate standard deviation
    const stdDev = Math.sqrt(variance);
    
    // Convert to consistency score (lower variance = higher consistency)
    // Max variance expected: ~400 (scores range 0-100)
    const consistencyScore = Math.max(0, 100 - (stdDev * 2));
    
    return parseFloat(consistencyScore.toFixed(2));
  }, [accuracyHistory]);

  const value: AccuracyContextState = {
    latestAccuracy,
    accuracyHistory,
    isLoading,
    error,
    setLatestAccuracy,
    clearAccuracy,
    getAverageAccuracy,
    getTotalXP,
    getConsistencyScore,
  };

  return <AccuracyContext.Provider value={value}>{children}</AccuracyContext.Provider>;
};

// Custom hook to use accuracy context
export const useAccuracy = () => {
  const context = useContext(AccuracyContext);
  
  if (context === undefined) {
    throw new Error('useAccuracy must be used within an AccuracyProvider');
  }
  
  return context;
};

// Export for use in other components
export { AccuracyContext };
