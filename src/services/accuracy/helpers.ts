import {
  BaseAccuracyMetrics,
  FeedbackItem,
  PersonalityWeights,
  PremiumAccuracyMetrics,
  ProAccuracyMetrics,
  TierAccuracyMetrics,
  UserTier,
} from './types';

const DEFAULT_WEIGHTS: PersonalityWeights = {
  grammar: 1.0,
  vocabulary: 1.0,
  spelling: 1.0,
  fluency: 1.0,
  comprehension: 1.0,
  sentenceStructure: 1.0,
  coherence: 1.0,
  clarity: 1.0,
  engagement: 1.0,
  contextAwareness: 1.0,
  idiomaticUsage: 1.0,
  formalityLevel: 1.0,
  culturalNuance: 1.0,
  advancedGrammar: 1.0,
  rhetoricalDevices: 1.0,
};

const PERSONALITY_WEIGHT_MAP: Record<string, Partial<PersonalityWeights>> = {
  'grammar-expert': {
    grammar: 1.5,
    advancedGrammar: 1.5,
    sentenceStructure: 1.3,
    spelling: 1.2,
  },
  'vocabulary-builder': {
    vocabulary: 1.5,
    idiomaticUsage: 1.3,
    contextAwareness: 1.2,
  },
  'business-professional': {
    formalityLevel: 1.5,
    clarity: 1.4,
    coherence: 1.3,
    vocabulary: 1.2,
  },
  'casual-conversationalist': {
    fluency: 1.5,
    engagement: 1.4,
    idiomaticUsage: 1.2,
  },
  'academic-tutor': {
    comprehension: 1.5,
    sentenceStructure: 1.4,
    clarity: 1.3,
    advancedGrammar: 1.3,
  },
  'pronunciation-coach': {
    fluency: 1.5,
    clarity: 1.3,
  },
  'creative-writer': {
    rhetoricalDevices: 1.5,
    vocabulary: 1.4,
    engagement: 1.3,
    idiomaticUsage: 1.2,
  },
  'interview-specialist': {
    formalityLevel: 1.4,
    clarity: 1.4,
    coherence: 1.3,
    engagement: 1.2,
  },
};

export function getPersonalityWeights(personalityId?: string): PersonalityWeights {
  if (!personalityId) return { ...DEFAULT_WEIGHTS };
  return { ...DEFAULT_WEIGHTS, ...PERSONALITY_WEIGHT_MAP[personalityId] };
}

export function calculateWeightedAverage(
  metrics: TierAccuracyMetrics,
  weights: PersonalityWeights,
  tier: UserTier
): number {
  let totalScore = 0;
  let totalWeight = 0;

  const applyMetric = <T extends keyof PersonalityWeights>(metric: T, value: number | undefined) => {
    if (typeof value !== 'number') return;
    const weight = weights[metric] ?? 1;
    totalScore += value * weight;
    totalWeight += weight;
  };

  const baseMetrics: (keyof BaseAccuracyMetrics)[] = [
    'grammar',
    'vocabulary',
    'spelling',
    'fluency',
    'comprehension',
  ];

  baseMetrics.forEach((metric) => applyMetric(metric, metrics[metric]));

  if (tier === 'pro' || tier === 'premium') {
    const proMetrics: (keyof ProAccuracyMetrics)[] = [
      'sentenceStructure',
      'coherence',
      'clarity',
      'engagement',
      'contextAwareness',
    ];

    proMetrics.forEach((metric) => applyMetric(metric, (metrics as ProAccuracyMetrics)[metric]));
  }

  if (tier === 'premium') {
    const premiumMetrics: (keyof PremiumAccuracyMetrics)[] = [
      'idiomaticUsage',
      'formalityLevel',
      'culturalNuance',
      'advancedGrammar',
      'rhetoricalDevices',
    ];

    premiumMetrics.forEach((metric) => applyMetric(metric, (metrics as PremiumAccuracyMetrics)[metric]));
  }

  return Math.round(totalScore / Math.max(totalWeight, 1));
}

export function generateFeedback(
  metrics: TierAccuracyMetrics,
  tier: UserTier
): FeedbackItem[] {
  const feedback: FeedbackItem[] = [];

  Object.entries(metrics).forEach(([key, rawValue]) => {
    const value = Number(rawValue) || 0;

    if (value >= 90) {
      feedback.push({ category: key, message: `Excellent ${key}!`, severity: 'success' });
    } else if (value >= 75) {
      feedback.push({ category: key, message: `Good ${key}, room for improvement`, severity: 'info' });
    } else if (value >= 60) {
      feedback.push({
        category: key,
        message: `${key} needs attention`,
        severity: 'warning',
        suggestion: `Practice ${key} exercises to improve`,
      });
    } else {
      feedback.push({
        category: key,
        message: `${key} requires significant work`,
        severity: 'error',
        suggestion: `Focus on ${key} fundamentals`,
      });
    }
  });

  if (tier === 'pro' || tier === 'premium') {
    const proMetrics = metrics as ProAccuracyMetrics;
    if ((proMetrics.coherence ?? 100) < 70) {
      feedback.push({
        category: 'coherence',
        message: 'Improve logical flow between ideas',
        severity: 'warning',
        suggestion: 'Use transition words and connect sentences logically',
      });
    }
  }

  if (tier === 'premium') {
    const premiumMetrics = metrics as PremiumAccuracyMetrics;
    if ((premiumMetrics.idiomaticUsage ?? 100) < 70) {
      feedback.push({
        category: 'idiomaticUsage',
        message: 'Enhance your use of idioms and expressions',
        severity: 'info',
        suggestion: 'Learn common English idioms for natural speech',
      });
    }
  }

  return feedback;
}

export function analyzeStrengthsAndWeaknesses(
  metrics: TierAccuracyMetrics
): { strengths: string[]; improvementAreas: string[] } {
  const strengths: string[] = [];
  const improvementAreas: string[] = [];

  Object.entries(metrics).forEach(([key, rawValue]) => {
    const value = Number(rawValue) || 0;

    if (value >= 85) strengths.push(key);
    if (value < 70) improvementAreas.push(key);
  });

  return { strengths, improvementAreas };
}
