/**
 * Voice Personality Mappings
 * Maps AI personalities to specific voice characteristics with tier-based quality
 */

export interface VoicePersonality {
  id: string;
  displayName: string;
  description: string;
  tier: 'free' | 'pro' | 'premium';
  preferredVoiceNames: string[]; // Preferred browser voice names
  lang: string;
  rate: number;
  pitch: number;
  volume: number;
  fallbackCriteria: {
    gender?: 'male' | 'female';
    quality?: 'enhanced' | 'premium' | 'natural';
  };
}

export const VOICE_PERSONALITIES: Record<string, VoicePersonality> = {
  'basic-tutor': {
    id: 'basic-tutor',
    displayName: '🎓 Emma (Friendly Teacher)',
    description: 'Warm and encouraging female voice, perfect for beginners',
    tier: 'free',
    preferredVoiceNames: [
      'Microsoft Zira Desktop',
      'Microsoft Zira',
      'Google US English Female',
      'Samantha',
      'Karen',
      'Moira',
      'Fiona'
    ],
    lang: 'en-US',
    rate: 0.85,
    pitch: 1.1,
    volume: 1.0,
    fallbackCriteria: {
      gender: 'female',
      quality: 'natural'
    }
  },
  'conversation-coach': {
    id: 'conversation-coach',
    displayName: '💬 Oliver (Conversation Expert)',
    description: 'Clear British male voice, great for natural conversations',
    tier: 'pro',
    preferredVoiceNames: [
      'Microsoft George Desktop',
      'Microsoft George',
      'Google UK English Male',
      'Daniel (Enhanced)',
      'Oliver',
      'Tom',
      'Fred'
    ],
    lang: 'en-GB',
    rate: 0.9,
    pitch: 0.95,
    volume: 1.0,
    fallbackCriteria: {
      gender: 'male',
      quality: 'enhanced'
    }
  },
  'grammar-expert': {
    id: 'grammar-expert',
    displayName: '📚 Victoria (Grammar Guru)',
    description: 'Precise British female voice, emphasizes correct pronunciation',
    tier: 'premium',
    preferredVoiceNames: [
      'Microsoft Hazel Desktop',
      'Microsoft Hazel',
      'Google UK English Female',
      'Serena (Premium)',
      'Victoria',
      'Kate',
      'Tessa'
    ],
    lang: 'en-GB',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0,
    fallbackCriteria: {
      gender: 'female',
      quality: 'premium'
    }
  },
  'business-mentor': {
    id: 'business-mentor',
    displayName: '💼 James (Business Professional)',
    description: 'Deep authoritative American male voice, ideal for business English',
    tier: 'premium',
    preferredVoiceNames: [
      'Microsoft David Desktop',
      'Microsoft David',
      'Microsoft Mark',
      'Google US English Male',
      'Alex',
      'Bruce',
      'Ralph'
    ],
    lang: 'en-US',
    rate: 0.95,
    pitch: 0.9,
    volume: 1.0,
    fallbackCriteria: {
      gender: 'male',
      quality: 'premium'
    }
  },
  'cultural-guide': {
    id: 'cultural-guide',
    displayName: '🌍 Sophie (Cultural Ambassador)',
    description: 'Expressive Australian female voice, perfect for cultural learning',
    tier: 'pro',
    preferredVoiceNames: [
      'Microsoft Catherine Desktop',
      'Microsoft Catherine',
      'Google Australian English Female',
      'Karen (Australian)',
      'Veena',
      'Tessa'
    ],
    lang: 'en-AU',
    rate: 0.9,
    pitch: 1.05,
    volume: 1.0,
    fallbackCriteria: {
      gender: 'female',
      quality: 'enhanced'
    }
  }
};

/**
 * Voice quality indicators for filtering
 */
export const VOICE_QUALITY_KEYWORDS = {
  premium: ['Premium', 'Enhanced', 'Natural', 'Neural', 'HD', 'Desktop'],
  standard: ['Microsoft', 'Google', 'Apple'],
  basic: []
};

/**
 * Get the best matching voice for a personality based on user tier
 */
export const getBestVoiceForPersonality = async (
  personalityId: string,
  availableVoices: SpeechSynthesisVoice[],
  userTier: 'free' | 'pro' | 'premium' = 'free'
): Promise<SpeechSynthesisVoice | undefined> => {
  const voiceConfig = VOICE_PERSONALITIES[personalityId];
  if (!voiceConfig) return undefined;

  // Check if user has access to this personality's voice quality
  const tierOrder = { free: 0, pro: 1, premium: 2 };
  const hasAccess = tierOrder[userTier] >= tierOrder[voiceConfig.tier];

  // Filter voices by language first
  const langVoices = availableVoices.filter(v => 
    v.lang.toLowerCase().startsWith(voiceConfig.lang.toLowerCase().split('-')[0])
  );

  // Try to find preferred voices
  for (const preferredName of voiceConfig.preferredVoiceNames) {
    const voice = langVoices.find(v => 
      v.name.toLowerCase().includes(preferredName.toLowerCase())
    );
    if (voice) {
      // Check for quality keywords for premium users
      if (hasAccess && voiceConfig.tier !== 'free') {
        const isPremiumVoice = VOICE_QUALITY_KEYWORDS.premium.some(keyword =>
          voice.name.includes(keyword)
        );
        if (isPremiumVoice) return voice;
      } else {
        return voice;
      }
    }
  }

  // Fallback to gender and quality-based selection
  const genderKeywords = voiceConfig.fallbackCriteria.gender === 'female' 
    ? ['female', 'woman', 'zira', 'hazel', 'susan', 'samantha', 'karen', 'victoria', 'catherine', 'heera']
    : ['male', 'man', 'david', 'mark', 'daniel', 'james', 'alex', 'george', 'ravi'];

  // Try to find quality voice for premium users
  if (hasAccess && voiceConfig.tier !== 'free') {
    const premiumVoice = langVoices.find(v => {
      const matchesGender = genderKeywords.some(keyword => v.name.toLowerCase().includes(keyword));
      const isPremium = VOICE_QUALITY_KEYWORDS.premium.some(keyword => v.name.includes(keyword));
      return matchesGender && isPremium;
    });
    if (premiumVoice) return premiumVoice;
  }

  // Standard gender match
  const genderVoice = langVoices.find(v => 
    genderKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
  );
  if (genderVoice) return genderVoice;

  // Return first language match or default
  return langVoices[0] || availableVoices[0];
};

/**
 * Get voice settings for a personality
 */
export const getVoiceSettings = (personalityId: string) => {
  const voiceConfig = VOICE_PERSONALITIES[personalityId];
  return voiceConfig ? {
    rate: voiceConfig.rate,
    pitch: voiceConfig.pitch,
    volume: voiceConfig.volume,
    lang: voiceConfig.lang
  } : {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    lang: 'en-US'
  };
};

/**
 * Filter voices by gender for user selection
 */
export const getVoicesByGender = (
  voices: SpeechSynthesisVoice[],
  gender: 'male' | 'female' | 'all' = 'all'
): SpeechSynthesisVoice[] => {
  if (gender === 'all') return voices;

  const keywords = gender === 'female'
    ? ['female', 'woman', 'zira', 'hazel', 'susan', 'samantha', 'karen', 'victoria', 'catherine', 'heera', 'moira', 'fiona']
    : ['male', 'man', 'david', 'mark', 'daniel', 'james', 'alex', 'george', 'ravi', 'tom', 'fred'];

  return voices.filter(v =>
    keywords.some(keyword => v.name.toLowerCase().includes(keyword))
  );
};

/**
 * Get premium voices only
 */
export const getPremiumVoices = (voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] => {
  return voices.filter(v =>
    VOICE_QUALITY_KEYWORDS.premium.some(keyword => v.name.includes(keyword))
  );
};

/**
 * Additional voice presets for user selection
 */
export interface VoicePreset {
  id: string;
  displayName: string;
  icon: string;
  description: string;
  rate: number;
  pitch: number;
  volume: number;
}

export const VOICE_PRESETS: VoicePreset[] = [
  {
    id: 'natural',
    displayName: 'Natural Speaker',
    icon: '🗣️',
    description: 'Balanced and natural speaking pace',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'slow-learner',
    displayName: 'Slow & Clear',
    icon: '🐢',
    description: 'Slower pace for better comprehension',
    rate: 0.75,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'fast-native',
    displayName: 'Native Speed',
    icon: '⚡',
    description: 'Natural native speaker speed',
    rate: 1.2,
    pitch: 1.0,
    volume: 1.0
  },
  {
    id: 'audiobook',
    displayName: 'Story Teller',
    icon: '📖',
    description: 'Expressive and engaging',
    rate: 0.9,
    pitch: 1.1,
    volume: 1.0
  },
  {
    id: 'professional',
    displayName: 'Professional',
    icon: '👔',
    description: 'Clear and authoritative',
    rate: 0.95,
    pitch: 0.95,
    volume: 1.0
  }
];
