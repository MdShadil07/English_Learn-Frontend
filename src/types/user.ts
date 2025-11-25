// User profile and related type definitions

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username?: string;
  avatar?: string; // Updated to match auth controller response
  level: number;
  isPremium: boolean;
  subscriptionStatus: 'none' | 'free' | 'basic' | 'premium' | 'pro' | 'expired';
  subscriptionDetails?: SubscriptionDetails;
  role: 'student' | 'teacher' | 'admin';
  bio?: string;
  location?: string;
  address?: string;
  phone?: string;
  educationalQualifications?: {
    id: string;
    degree: string;
    fieldOfStudy: string;
    institution: string;
    graduationYear: number;
    gpa?: string;
    startYear?: number;
    description?: string;
    location?: string;
    achievements?: string[];
  }[];
  joinedDate: string;
  lastActive: string;
  totalStudyTime: number;
  weeklyGoal: number;
  achievements: Achievement[];
  stats: UserStats;
  preferences: UserPreferences;
  recentActivity: ActivityItem[];
  learningGoals: LearningGoal[];
  skills: SkillProgress[];
  certificates?: Certificate[];
  professionalInfo?: ProfessionalInfo;
  socialHandles?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalXP: number;
  accuracy: number;
  vocabulary: number;
  grammar: number;
  pronunciation: number;
  fluency: number;
  completedLessons: number;
  certificates: number;
  studyTimeThisWeek: number;
  averageSessionLength: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  voiceOutput: boolean;
  autoplay: boolean;
  studyReminders: boolean;
  weeklyReports: boolean;
  privacyMode: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'lesson' | 'achievement' | 'streak' | 'level_up' | 'practice';
  title: string;
  description: string;
  timestamp: string;
  xpGained?: number;
  icon: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isCompleted: boolean;
}

export interface SkillProgress {
  skill: string;
  current: number;
  target: number;
  improvement: number;
  icon: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
  file?: string;
  verificationUrl?: string;
}

export interface EducationalInfo {
  field?: string;
  degree?: string;
  college?: string;
  graduationYear?: number;
  gpa?: string;
}

export interface ProfessionalInfo {
  company?: string;
  position?: string;
  experienceYears?: number;
  industry?: string;
  specializations?: string[];
}

export interface SubscriptionDetails {
  planCode: string;
  tier: 'free' | 'pro' | 'premium';
  status: 'active' | 'expired' | 'cancelled' | 'none';
  expiresAt: string | null;
  autoRenew: boolean;
  hasActiveSubscription: boolean;
  isExpired: boolean;
  daysRemaining: number;
}
