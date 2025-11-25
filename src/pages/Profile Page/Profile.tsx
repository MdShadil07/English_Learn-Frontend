
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth, User } from '../../contexts/AuthContext';
import { ProfileSidebar } from '../../components/Profile/ProfileSidebar';
import { AchievementCard, LearningGoalCard, ActivityCard } from '../../components/Profile/ProfileComponents';
import {
  PersonalInformationCard,
  EducationJourneyCard,
  BadgesAndAchievementsCard,
  CertificatesCard,
  ProfileHero,
  DailyProgressCard,
  SkillOverview,
  RecentActivity,
  LearningRecommendations,
  BasicPlanCard,
  PremiumPlanCard
} from '../../components/Profile';
import { BasicHeader } from '../../components/layout';
import { Button } from '../../components/ui/button';
import {
  Settings,
  Crown,
  Menu,
  Briefcase,
  X,
  Sparkles,
  Brain,
  Play,
  BarChart3,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { queryKeys, queryOptions } from '@/utils/queryKeys';
import { resolveUserTier, mapTierToStatus } from '@/utils/tierUtils';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [showSidebar, setShowSidebar] = useState(true);
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string>('');
  const [activeView, setActiveView] = useState<'overview' | 'achievements' | 'settings' | 'activity' | 'subscription'>('overview');
  const [sidebarActiveView, setSidebarActiveView] = useState<'overview' | 'achievements' | 'settings' | 'activity' | 'subscription'>('overview');

  // Fetch profile data using React Query - now unified with AuthContext
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: queryKeys.profile.get(),
    queryFn: async () => {
      console.log('🔄 Profile Page: Fetching profile data via React Query...');
      const response = await api.profile.get();
      console.log('📡 Profile Page: Profile API response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data as {
        user?: any;
        profile?: any;
        userProfile?: any;
      };
    },
    ...queryOptions.profile,
    // Only fetch if we don't have complete user data from AuthContext
    enabled: !!user?.id,
  });

  // Use centralized resolver for tier normalization
  const resolvedTier = resolveUserTier(user);

  const profile: UserProfile | null = profileData ? {
    id: user?.id || '1',
    fullName: user?.fullName || 'User', // Use AuthContext data as primary source
    email: user?.email || 'user@example.com',
    username: user?.username || '',
    avatar: user?.avatar || null, // Use AuthContext avatar - single source of truth
    level: 1, // Default level since no stats available
    isPremium: resolvedTier === 'premium',
    subscriptionStatus: profileData.user?.subscriptionStatus || profileData.profile?.subscriptionStatus || mapTierToStatus(resolvedTier),
    role: (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student') as 'student' | 'teacher' | 'admin',
    bio: profileData.user?.bio || profileData.profile?.bio || '',
    location: profileData.user?.location || profileData.profile?.location || '',
    address: profileData.profile?.address || '',
    phone: profileData.user?.phone || profileData.profile?.phone || '',
    educationalQualifications: profileData.profile?.education?.map((edu: any, index: number) => ({
      id: index.toString(),
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      institution: edu.institution,
      graduationYear: edu.endYear || edu.graduationYear,
      startYear: edu.startYear,
      location: edu.location,
      gpa: edu.grade,
      description: edu.description,
      achievements: []
    })) || [],
    joinedDate: profileData.user?.createdAt || new Date().toISOString(),
    lastActive: new Date().toISOString(),
    totalStudyTime: 0, // Default since no stats available
    weeklyGoal: 300, // Default weekly goal
    achievements: [], // Empty for now
    stats: {
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      totalXP: 0,
      accuracy: 0,
      vocabulary: 0,
      grammar: 0,
      pronunciation: 0,
      fluency: 0,
      completedLessons: 0,
      certificates: 0,
      studyTimeThisWeek: 0,
      averageSessionLength: 0
    },
    preferences: {
      theme: 'auto',
      language: 'en',
      notifications: true,
      soundEffects: true,
      voiceOutput: false,
      autoplay: false,
      studyReminders: true,
      weeklyReports: true,
      privacyMode: false,
      dataCollection: true,
      marketingEmails: false
    },
    recentActivity: [], // Empty for now
    learningGoals: [], // Empty for now
    skills: [], // Empty for now
    certificates: profileData.profile?.certifications?.map((cert: any, index: number) => ({
      id: index.toString(),
      name: cert.name,
      issuer: cert.issuer,
      date: cert.issueDate || cert.date,
      credentialId: cert.credentialId,
      verificationUrl: cert.credentialUrl || cert.verificationUrl
    })) || [],
    professionalInfo: profileData.profile?.professionalInfo ? {
      company: profileData.profile.professionalInfo.company,
      position: profileData.profile.professionalInfo.position,
      experienceYears: profileData.profile.professionalInfo.experienceYears,
      industry: profileData.profile.professionalInfo.industry,
      specializations: profileData.profile.professionalInfo.skills || []
    } : undefined,
    socialHandles: profileData.profile?.socialLinks ? {
      linkedin: profileData.profile.socialLinks.linkedin,
      twitter: profileData.profile.socialLinks.twitter,
      github: profileData.profile.socialLinks.github,
      website: profileData.profile.socialLinks.website,
      facebook: profileData.profile.socialLinks.facebook,
      instagram: profileData.profile.socialLinks.instagram
    } : undefined
  } : null;

  const handleSidebarToggle = (open: boolean) => {
    setShowSidebar(open);
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            {profileError?.message || 'Unable to load profile data'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 transition-all duration-500 overflow-x-hidden">
      {/* Header */}
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'user@example.com',
          fullName: user?.fullName || 'Alex Johnson',
          avatar: user?.avatar, // Use avatar from AuthContext for consistency
          isPremium: profile?.isPremium,
          subscriptionStatus: profile?.subscriptionStatus,
          role: (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student') as 'student' | 'teacher' | 'admin',
        }}
        onLogout={() => {
          // Handle logout logic here
        }}
        showSidebarToggle={true}
        onSidebarToggle={handleSidebarToggle}
        sidebarOpen={showSidebar}
        title="CognitoSpeak"
        subtitle="AI Learning Platform"
      />

      {/* Main Layout Container */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <ProfileSidebar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
          profile={{
            avatar: user?.avatar, // Use avatar from AuthContext for consistency
            fullName: profile.fullName,
            level: profile.level,
            role: (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student') as 'student' | 'teacher' | 'admin',
            stats: { currentStreak: profile.stats.currentStreak, totalXP: profile.stats.totalXP },
            isPremium: profile.isPremium,
            subscriptionStatus: profile.subscriptionStatus,
            preferences: profile.preferences,
          }}
          activeView={sidebarActiveView}
          onViewChange={setSidebarActiveView}
        />

        {/* Backdrop Overlay - Only behind sidebar */}
        {showSidebar && (
          <div
            className="fixed top-16 left-0 w-80 sm:w-96 h-[calc(100vh-4rem)] bg-black/5 dark:bg-black/10 z-30"
          />
        )}

        {/* Clickable Backdrop - For closing sidebar */}
        {showSidebar && (
          <div
            className="fixed top-16 left-80 sm:left-96 right-0 h-[calc(100vh-4rem)] bg-transparent z-35"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Content */}
        <div className={`flex-1 p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 transition-all duration-300 pt-14 xs:pt-16 sm:pt-20 ${
          showSidebar ? 'lg:ml-80 xl:ml-96' : 'ml-0'
        }`}>

        {/* ================================================================== */}
        {/* START OF LAYOUT AS REQUESTED                                       */}
        {/* ================================================================== */}

        {/* Advanced Hero Welcome Section - Matching Dashboard Design */}
        <ProfileHero profile={profile} sidebarOpen={showSidebar} />


        {/* Daily Progress, Skill Overview & Recent Activity - Below Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <DailyProgressCard profile={profile} />
          <SkillOverview profile={profile} />
          <RecentActivity profile={profile} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <PersonalInformationCard profile={profile} />
          <EducationJourneyCard profile={profile} />
        </div>

        {/* Badges & Achievements and Certificates - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <BadgesAndAchievementsCard profile={profile} />
          {profile.certificates && profile.certificates.length > 0 && (
            <CertificatesCard profile={profile} />
          )}
        </div>

        {/* Learning Recommendations */}
        <LearningRecommendations profile={profile} />

        {/* ================================================================== */}
        {/* END OF REQUESTED LAYOUT. OTHER COMPONENTS FOLLOW.                */}
        {/* ================================================================== */}


        {/* Quick Actions & Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <BasicPlanCard />
          {profile.isPremium !== undefined && (profile.isPremium || profile.subscriptionStatus === 'pro') && <PremiumPlanCard isPremium={profile.isPremium} />}
        </div>

        {/* Learning Goals & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">🎯 Learning Goals</h3>
            <div className="space-y-4">
              {profile.learningGoals.map(goal => <LearningGoalCard key={goal.id} goal={goal} />)}
            </div>
          </div>
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">🏆 Recent Achievements</h3>
            <div className="space-y-4">
              {profile.achievements && profile.achievements.map(ach => <AchievementCard key={ach.id} achievement={ach} />)}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20 dark:border-slate-700/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">📈 Recent Activity</h3>
          <div className="space-y-3 sm:space-y-4">
            {profile.recentActivity && profile.recentActivity.slice(0, 5).map(activity => <ActivityCard key={activity.id} activity={activity} />)}
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
