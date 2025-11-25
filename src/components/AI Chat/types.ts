import { Dispatch, SetStateAction } from 'react';
import { AIPersonalityIconId } from '@/components/Icons/AIPersonalityIcons';

export interface AIPersonality {
  id: string;
  iconId: AIPersonalityIconId;
  name: string;
  description: string;
  avatar: string;
  color: string;
  gradient: string;
  tier: 'free' | 'pro' | 'premium';
  features: string[];
  specialty: string;
  language: string;
  voice: boolean;
  advancedMode: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  accuracy?: {
    overall: number;
    grammar: number;
    vocabulary: number;
    spelling: number;
    fluency: number;
    feedback: string[];
  };
  xpGained?: number;
  personalityId?: string;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  personalityId: string;
  messages: Message[];
  createdAt: Date;
  lastUpdated: Date;
  totalAccuracy: number;
  totalXP: number;
  messageCount: number;
}

export interface ChatStats {
  currentAccuracy: number;
  totalMessages: number;
  totalXP: number;
  currentLevel: number;
  currentLevelXP: number;
  xpToNextLevel: number;
  xpRequiredForLevel: number;
  xpProgressPercentage: number;
  weeklyProgress: number;
  streak: number;
  totalLearningTime: number;
}

export interface UserSettings {
  voiceEnabled: boolean;
  language: string;
  personality: string;
  showAccuracy: boolean;
  autoTranslate: boolean;
  theme: 'light' | 'dark' | 'auto';
}

export type SetSettings = Dispatch<SetStateAction<UserSettings>>;
