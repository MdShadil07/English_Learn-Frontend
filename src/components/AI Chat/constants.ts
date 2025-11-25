import { AIPersonality } from './types';

export const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'basic-tutor',
    iconId: 'basic-tutor',
    name: 'Alex Mentor',
    description: 'Friendly English teacher for beginners',
    avatar: '🧑‍🏫',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    tier: 'free',
    features: ['Basic grammar', 'Simple vocabulary', 'Spelling help'],
    specialty: 'Beginner English',
    language: 'en',
    voice: true,
    advancedMode: false
  },
  {
    id: 'conversation-coach',
    iconId: 'conversation-coach',
    name: 'Nova Coach',
    description: 'Practice real-life conversations',
    avatar: '💬',
    color: 'teal',
    gradient: 'from-teal-500 to-cyan-500',
    tier: 'pro',
    features: ['Conversation practice', 'Pronunciation tips', 'Cultural context'],
    specialty: 'Conversational English',
    language: 'en',
    voice: true,
    advancedMode: true
  },
  {
    id: 'grammar-expert',
    iconId: 'grammar-expert',
    name: 'Iris Scholar',
    description: 'Deep dive into English grammar rules',
    avatar: '📚',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-500',
    tier: 'pro',
    features: ['Advanced grammar', 'Error correction', 'Rule explanations'],
    specialty: 'Advanced Grammar',
    language: 'en',
    voice: true,
    advancedMode: true
  },
  {
    id: 'business-mentor',
    iconId: 'business-mentor',
    name: 'Atlas Mentor',
    description: 'Professional English for career growth',
    avatar: '💼',
    color: 'purple',
    gradient: 'from-purple-500 to-pink-500',
    tier: 'premium',
    features: ['Business vocabulary', 'Email writing', 'Presentation skills'],
    specialty: 'Business English',
    language: 'en',
    voice: true,
    advancedMode: true
  },
  {
    id: 'cultural-guide',
    iconId: 'cultural-guide',
    name: 'Luna Guide',
    description: 'Learn English with cultural insights',
    avatar: '🌍',
    color: 'amber',
    gradient: 'from-amber-500 to-orange-500',
    tier: 'premium',
    features: ['Cultural context', 'Idioms & slang', 'Regional variations'],
    specialty: 'Cultural English',
    language: 'en',
    voice: true,
    advancedMode: true
  }
];

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' }
];
