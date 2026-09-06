export interface PlanFeatures {
  aiConversationsPerDay?: number;
  aiPersonalitiesCount?: number;
  pronunciationAnalysisPerDay?: number;
  aiChatAnalysis?: boolean;
  privateRoomCreation?: boolean;
  premiumVoiceIntegration?: boolean;
  advancedWritingFeedback?: boolean;
  grammarCurriculum?: boolean;
  vocabularySize?: number;
  [key: string]: any;
}

export interface BackendPlan {
  _id: string;
  code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'lifetime';
  durationDays: number | null;
  tier: 'free' | 'pro' | 'premium';
  isPopular?: boolean;
  features: PlanFeatures;
  isActive: boolean;
}

export interface FormattedFeature {
  title: string;
  included: boolean;
  tooltip?: string;
}

export function generateFeatureList(features: PlanFeatures): FormattedFeature[] {
  const list: FormattedFeature[] = [];

  // AI Conversations
  if (features.aiConversationsPerDay === 0) {
    list.push({ title: 'Unlimited AI conversations', included: true, tooltip: 'No daily limits' });
  } else {
    const limit = features.aiConversationsPerDay || 5;
    list.push({ title: `${limit} AI conversations/day`, included: true, tooltip: 'Limited daily practice sessions' });
  }

  // Grammar & Vocab
  if (features.grammarCurriculum) {
    list.push({ title: 'Full grammar curriculum', included: true, tooltip: 'Advanced lessons included' });
  } else {
    list.push({ title: 'Basic grammar lessons', included: true, tooltip: 'Foundational lessons' });
  }

  const vocabSize = features.vocabularySize || 500;
  list.push({ title: `${vocabSize.toLocaleString()}+ Vocabulary words`, included: true });

  // AI Personalities
  const personalities = features.aiPersonalitiesCount || 1;
  if (personalities >= 5) {
    list.push({ title: 'All 5 AI personalities', included: true, tooltip: 'Includes Coach & Sophia' });
  } else {
    list.push({ title: `${personalities} AI personalities`, included: true });
  }

  // Pronunciation
  if (features.pronunciationAnalysisPerDay === -1) {
    list.push({ title: 'Pronunciation analysis', included: false });
  } else if (features.pronunciationAnalysisPerDay === 0) {
    list.push({ title: 'Unlimited Pronunciation analysis', included: true, tooltip: 'Phoneme-level analysis' });
  } else {
    list.push({ title: `${features.pronunciationAnalysisPerDay} Pronunciation checks/day`, included: true });
  }

  // AI Chat Analysis
  list.push({
    title: 'AI Chat Analysis',
    included: !!features.aiChatAnalysis,
    tooltip: 'Detailed performance breakdown after chat'
  });

  // Writing Feedback
  list.push({
    title: 'Advanced writing feedback',
    included: !!features.advancedWritingFeedback,
    tooltip: 'Style & Tone analysis'
  });

  // Rooms
  list.push({
    title: 'Private practice rooms',
    included: !!features.privateRoomCreation
  });

  // Premium Voice
  list.push({
    title: 'Premium Voice Integration',
    included: !!features.premiumVoiceIntegration,
    tooltip: 'High quality neural voices'
  });

  // New Expanded Features
  list.push({
    title: 'IELTS / TOEFL Prep',
    included: !!features.ieltsToeflPrep,
    tooltip: features.ieltsToeflPrep ? 'Full preparation suite' : 'Coming Soon'
  });

  list.push({
    title: 'Live Mock Interviews',
    included: !!features.liveMockInterviews,
    tooltip: features.liveMockInterviews ? 'Practice with AI recruiters' : 'Coming Soon'
  });

  list.push({
    title: 'Detailed Progress Analytics',
    included: features.detailedProgressAnalytics !== undefined ? !!features.detailedProgressAnalytics : true,
    tooltip: 'Track your growth and XP daily'
  });

  list.push({
    title: 'Custom Learning Paths',
    included: features.customLearningPaths !== undefined ? !!features.customLearningPaths : !!features.grammarCurriculum,
    tooltip: 'Tailored paths based on your goals'
  });

  list.push({
    title: 'Native Speaker Tutors',
    included: !!features.nativeSpeakerTutors,
    tooltip: features.nativeSpeakerTutors ? 'Live 1:1 Sessions' : 'Coming Soon - Live 1:1 Sessions'
  });

  return list;
}

export const defaultFallbackPlans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: { monthly: 0, yearly: 0 },
    features: [
      { title: '5 AI conversations/day', included: true, tooltip: 'Limited daily practice sessions' },
      { title: 'Basic grammar lessons', included: true, tooltip: 'Foundational lessons' },
      { title: '500+ Vocabulary words', included: true },
      { title: '1 AI personalities', included: true },
      { title: 'Pronunciation analysis', included: false },
      { title: 'AI Chat Analysis', included: false },
      { title: 'Advanced writing feedback', included: false },
      { title: 'Private practice rooms', included: false },
      { title: 'Premium Voice Integration', included: false },
      { title: 'IELTS / TOEFL Prep', included: false, tooltip: 'Coming Soon' },
      { title: 'Live Mock Interviews', included: false, tooltip: 'Coming Soon' },
      { title: 'Detailed Progress Analytics', included: true, tooltip: 'Track your growth and XP daily' },
      { title: 'Custom Learning Paths', included: false, tooltip: 'Tailored paths based on your goals' },
      { title: 'Native Speaker Tutors', included: false, tooltip: 'Coming Soon - Live 1:1 Sessions' }
    ],
    cta: 'Start Free',
    color: 'slate',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious learners',
    price: { monthly: 499, yearly: 4990 },
    features: [
      { title: 'Unlimited AI conversations', included: true, tooltip: 'No daily limits' },
      { title: 'Full grammar curriculum', included: true, tooltip: 'Advanced lessons included' },
      { title: '3,000+ Vocabulary words', included: true },
      { title: '3 AI personalities', included: true },
      { title: 'Unlimited Pronunciation analysis', included: true },
      { title: 'AI Chat Analysis', included: true },
      { title: 'Advanced writing feedback', included: true },
      { title: 'Private practice rooms', included: false },
      { title: 'Premium Voice Integration', included: false },
      { title: 'IELTS / TOEFL Prep', included: false, tooltip: 'Coming Soon' },
      { title: 'Live Mock Interviews', included: false, tooltip: 'Coming Soon' },
      { title: 'Detailed Progress Analytics', included: true, tooltip: 'Track your growth and XP daily' },
      { title: 'Custom Learning Paths', included: true, tooltip: 'Tailored paths based on your goals' },
      { title: 'Native Speaker Tutors', included: false, tooltip: 'Coming Soon - Live 1:1 Sessions' }
    ],
    cta: 'Upgrade to Pro',
    color: 'emerald',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For professionals',
    price: { monthly: 999, yearly: 9990 },
    features: [
      { title: 'Unlimited AI conversations', included: true, tooltip: 'No daily limits' },
      { title: 'Full grammar curriculum', included: true, tooltip: 'Advanced lessons included' },
      { title: '10,000+ Vocabulary words', included: true },
      { title: 'All 5 AI personalities', included: true },
      { title: 'Unlimited Pronunciation analysis', included: true },
      { title: 'AI Chat Analysis', included: true },
      { title: 'Advanced writing feedback', included: true },
      { title: 'Private practice rooms', included: true },
      { title: 'Premium Voice Integration', included: true },
      { title: 'IELTS / TOEFL Prep', included: false, tooltip: 'Coming Soon' },
      { title: 'Live Mock Interviews', included: false, tooltip: 'Coming Soon' },
      { title: 'Detailed Progress Analytics', included: true, tooltip: 'Track your growth and XP daily' },
      { title: 'Custom Learning Paths', included: true, tooltip: 'Tailored paths based on your goals' },
      { title: 'Native Speaker Tutors', included: false, tooltip: 'Coming Soon - Live 1:1 Sessions' }
    ],
    cta: 'Upgrade to Premium',
    color: 'purple',
    popular: false
  }
];

// Function to map backend plans to the format expected by PricingCard
export function mapBackendPlansToPricingTiers(backendPlans: BackendPlan[]) {
  // Group plans by tier so we can extract monthly and yearly prices
  const plansByTierName: Record<string, {
    basePlan: BackendPlan;
    monthlyPrice: number;
    yearlyPrice: number;
    monthlyId: string;
    yearlyId: string;
  }> = {};

  backendPlans.forEach((plan) => {
    // Determine the base key (e.g., "Premium")
    const key = plan.name.replace(/(Monthly|Yearly|Plan)/ig, '').trim();
    
    if (!plansByTierName[key]) {
      plansByTierName[key] = {
        basePlan: plan,
        monthlyPrice: plan.price / 100,
        yearlyPrice: (plan.yearlyPrice || 0) / 100,
        monthlyId: plan._id,
        yearlyId: plan._id
      };
    } else {
      const existing = plansByTierName[key];
      const isCurrentCombined = plan.price > 0 && plan.yearlyPrice > 0;
      const isExistingCombined = existing.monthlyPrice > 0 && existing.yearlyPrice > 0;

      if (isCurrentCombined && !isExistingCombined) {
        // Prefer the combined plan if the existing one is split/incomplete
        plansByTierName[key] = {
          basePlan: plan,
          monthlyPrice: plan.price / 100,
          yearlyPrice: plan.yearlyPrice / 100,
          monthlyId: plan._id,
          yearlyId: plan._id
        };
      } else if (!isExistingCombined) {
        // Merge split plans
        const isYearly = plan.billingPeriod === 'yearly' || plan.name.toLowerCase().includes('yearly');
        if (isYearly) {
          existing.yearlyPrice = plan.price / 100;
          existing.yearlyId = plan._id;
        } else {
          existing.monthlyPrice = plan.price / 100;
          existing.monthlyId = plan._id;
          existing.basePlan = plan; // Prefer the monthly plan's features/description
        }
      }
    }
  });

  return Object.values(plansByTierName).map((group) => {
    const { basePlan, monthlyPrice, yearlyPrice, monthlyId, yearlyId } = group;
    
    // Determine color based on tier
    let color: 'slate' | 'emerald' | 'purple' = 'slate';
    if (basePlan.tier === 'pro') color = 'emerald';
    if (basePlan.tier === 'premium') color = 'purple';

    return {
      id: basePlan.tier || 'free', // unique identifier for the tier
      name: basePlan.name.replace(/(Monthly|Yearly)/i, '').trim(),
      description: basePlan.description,
      price: { monthly: monthlyPrice, yearly: yearlyPrice },
      features: generateFeatureList(basePlan.features),
      cta: monthlyPrice === 0 ? 'Start Free' : (basePlan.tier === 'premium' ? 'Upgrade to Premium' : 'Upgrade to Pro'),
      color,
      popular: !!basePlan.isPopular,
      _monthlyId: monthlyId,
      _yearlyId: yearlyId
    };
  });
}
