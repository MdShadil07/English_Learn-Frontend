/**
 * Frontend Accuracy Calculator
 * Analyzes user messages and AI responses to calculate accuracy scores
 */

export interface AccuracyErrorDetail {
  type?: string;
  message: string;
  position?: number;
  severity?: 'low' | 'medium' | 'high';
  suggestion?: string;
  explanation?: string;
  examples?: string[];
  alternatives?: string[];
}

export interface AccuracyInsights {
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  strengths: string[];
  weaknesses: string[];
  improvement: number;
  nextSteps?: string[];
  learningPath?: string[];
  consistencyScore?: number;
}

export interface AccuracyStatistics {
  wordCount?: number;
  sentenceCount?: number;
  paragraphCount?: number;
  avgWordsPerSentence?: number;
  avgSyllablesPerWord?: number;
  complexWordCount?: number;
  uniqueWordRatio?: number;
  errorCount?: number;
  criticalErrorCount?: number;
  spellingErrorCount?: number;
  grammarErrorCount?: number;
  vocabularyErrorCount?: number;
  fluencyErrorCount?: number;
  punctuationErrorCount?: number;
  capitalizationErrorCount?: number;
  errorsByCategory?: Record<string, number>;
}

export interface AccuracyTierInfo {
  tier: 'FREE' | 'PRO' | 'PREMIUM';
  multiplier: number;
  analysisDepth: string;
  featuresUnlocked?: Record<string, boolean>;
}

export interface AccuracyAIResponseAnalysis {
  hasCorrectionFeedback?: boolean;
  hasAppreciation?: boolean;
  hasGrammarCorrection?: boolean;
  hasSpellingCorrection?: boolean;
  hasVocabularyFeedback?: boolean;
  correctedErrors?: string[];
  appreciationLevel?: 'none' | 'low' | 'medium' | 'high';
  severityOfCorrections?: 'none' | 'minor' | 'moderate' | 'major' | 'critical';
}

export interface AccuracyResult {
  overall: number;
  adjustedOverall?: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation?: number;
  capitalization?: number;
  syntax?: number;
  coherence?: number;
  contextRelevance?: number;
  messageLengthScore?: number;
  complexityScore?: number;
  feedback: string[];
  suggestions?: string[];
  errors?: AccuracyErrorDetail[];
  statistics?: AccuracyStatistics;
  insights?: AccuracyInsights;
  aiResponseAnalysis?: AccuracyAIResponseAnalysis;
  xpEarned?: number;
  xpPenalty?: number;
  netXP?: number;
  bonusXP?: number;
  adaptiveXPMultiplier?: number;
  tierMultiplier?: number;
  tierInfo?: AccuracyTierInfo;
  analysisDepth?: 'basic' | 'detailed' | 'comprehensive' | string;
  tier?: 'free' | 'pro' | 'premium';
  timestamp?: string;
}

export interface MessageAnalysis {
  userMessage: string;
  aiResponse: string;
  timestamp: Date;
  quality: AccuracyResult;
}

/**
 * Analyzes a user's message for English accuracy using backend API
 * @param userMessage - The user's message
 * @param aiResponse - The AI's response (optional)
 * @returns Accuracy analysis result
 */
import { api } from '../../api';

export const analyzeMessageAccuracy = async (
  userMessage: string,
  aiResponse?: string,
  options?: {
    userTier?: string;
    userLevel?: string;
    previousAccuracy?: unknown;
    userId?: string;
  }
): Promise<AccuracyResult> => {
  // Prefer backend authoritative analysis. Include optional metadata so server uses full pipeline.
  const body: {
    userMessage: string;
    aiResponse: string;
    userTier?: string;
    userLevel?: string;
    previousAccuracy?: unknown;
    userId?: string;
  } = {
    userMessage,
    aiResponse: aiResponse || '',
  };
  if (options?.userTier) body.userTier = options.userTier;
  if (options?.userLevel) body.userLevel = options.userLevel;
  if (options?.previousAccuracy) body.previousAccuracy = options.previousAccuracy;
  if (options?.userId) body.userId = options.userId;

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  try {
    const response = await fetch(`${apiBase}/api/accuracy/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data) {
        const analysis = data.data.analysis ?? {};
        const accuracy = data.data.accuracy ?? {};
        return {
          overall: analysis.overall ?? accuracy.current ?? 0,
          grammar: analysis.grammar ?? 0,
          vocabulary: analysis.vocabulary ?? 0,
          spelling: analysis.spelling ?? 0,
          fluency: analysis.fluency ?? 0,
          feedback: analysis.feedback ?? analysis?.feedback ?? [],
          statistics: analysis.statistics ?? undefined,
          insights: analysis.accuracyInsights ?? analysis.insights ?? undefined,
          xpEarned: data.data.xp?.earned ?? data.data.xpEarned ?? undefined,
          tier: options?.userTier as AccuracyResult["tier"],
          timestamp: new Date().toISOString(),
        };
      }
    }
    throw new Error('Backend API failed or returned invalid data');
  } catch (error) {
    console.error('Backend accuracy analysis failed', error);
    throw error; // Propagate error instead of falling back
  }
};

/**
 * Calculate XP reward based on accuracy
 */
export const calculateAccuracyXP = async (accuracy: number, messageLength: number): Promise<number> => {
  // Prefer server-side XP calculation.
  try {
    interface XPResponseData {
      xp?: number;
      xpAmount?: number;
      xpEarned?: number;
      [key: string]: unknown;
    }
    const resp = await api.progress.calculateXPReward({ action: 'accuracy', multiplier: Math.max(0, Math.min(1, accuracy / 100)), customXP: Math.floor(messageLength / 10) });
    if (resp && resp.success && resp.data) {
      // Server may return structured xp in data.xp or data.xpAmount
      const data = resp.data as XPResponseData;
      const maybeXp = data.xp ?? data.xpAmount ?? data.xpEarned;
      if (typeof maybeXp === 'number' && Number.isFinite(maybeXp)) return maybeXp;
    }
  } catch (e) {
    console.error('Failed to calculate XP via backend', e);
  }
  
  // Return 0 or throw if backend fails, to avoid client-side calculation
  return 0;
};

/**
 * Track message history for progress analysis
 */
class AccuracyTracker {
  private history: MessageAnalysis[] = [];
  private readonly maxHistory = 50;

  addAnalysis(userMessage: string, aiResponse: string, quality: AccuracyResult) {
    const analysis: MessageAnalysis = {
      userMessage,
      aiResponse,
      timestamp: new Date(),
      quality,
    };

    this.history.unshift(analysis);

    // Keep only recent history
    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(0, this.maxHistory);
    }
  }

  getAverageAccuracy(): number {
    if (this.history.length === 0) return 0;

    const total = this.history.reduce((sum, analysis) => sum + analysis.quality.overall, 0);
    return Math.round(total / this.history.length);
  }

  getRecentTrend(): number {
    if (this.history.length < 5) return 0;

    const recent = this.history.slice(0, 5);
    const older = this.history.slice(5, 10);

    const recentAvg = recent.reduce((sum, a) => sum + a.quality.overall, 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + a.quality.overall, 0) / older.length;

    return recentAvg - olderAvg;
  }

  getSkillBreakdown() {
    if (this.history.length === 0) {
      return { grammar: 0, vocabulary: 0, spelling: 0, fluency: 0 };
    }

    const skills = this.history.reduce(
      (acc, analysis) => ({
        grammar: acc.grammar + analysis.quality.grammar,
        vocabulary: acc.vocabulary + analysis.quality.vocabulary,
        spelling: acc.spelling + analysis.quality.spelling,
        fluency: acc.fluency + analysis.quality.fluency,
      }),
      { grammar: 0, vocabulary: 0, spelling: 0, fluency: 0 }
    );

    const count = this.history.length;
    return {
      grammar: Math.round(skills.grammar / count),
      vocabulary: Math.round(skills.vocabulary / count),
      spelling: Math.round(skills.spelling / count),
      fluency: Math.round(skills.fluency / count),
    };
  }
}

export const accuracyTracker = new AccuracyTracker();
