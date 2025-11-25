export type UserTier = 'free' | 'pro' | 'premium';

export interface BaseAccuracyMetrics {
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  comprehension: number;
}

export interface ProAccuracyMetrics extends BaseAccuracyMetrics {
  sentenceStructure: number;
  coherence: number;
  clarity: number;
  engagement: number;
  contextAwareness: number;
}

export interface PremiumAccuracyMetrics extends ProAccuracyMetrics {
  idiomaticUsage: number;
  formalityLevel: number;
  culturalNuance: number;
  advancedGrammar: number;
  rhetoricalDevices: number;
}

export type TierAccuracyMetrics =
  | BaseAccuracyMetrics
  | ProAccuracyMetrics
  | PremiumAccuracyMetrics;

export interface FeedbackItem {
  category: string;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  suggestion?: string;
}

export interface PersonalityWeights {
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  comprehension: number;
  sentenceStructure?: number;
  coherence?: number;
  clarity?: number;
  engagement?: number;
  contextAwareness?: number;
  idiomaticUsage?: number;
  formalityLevel?: number;
  culturalNuance?: number;
  advancedGrammar?: number;
  rhetoricalDevices?: number;
}

export interface AccuracyAnalysisResult {
  overall: number;
  metrics: TierAccuracyMetrics;
  feedback: FeedbackItem[];
  tier: UserTier;
  personalityWeighted: boolean;
  timestamp: string;
  improvementAreas: string[];
  strengths: string[];
}
