import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Trophy, Flame, TrendingUp, ArrowLeft, MessageCircle, UserPlus, Award, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/api';
import { BasicHeader } from '@/components/layout';

interface PublicUserProfile {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  level: number;
  role: 'student' | 'teacher' | 'admin';
  subscriptionStatus: 'free' | 'basic' | 'premium' | 'pro';
  bio?: string;
  location?: string;
  stats: {
    currentStreak: number;
    totalXP: number;
    totalSessions: number;
  };
  joinedDate?: string;
  skills?: string[];
  achievements?: string;
  // API response flat fields
  currentStreak?: number;
  totalXP?: number;
  totalSessions?: number;
}

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicUserProfile | null>(
    (location.state?.profile as PublicUserProfile) || null
  );
  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Normalize profile from state if it exists
    if (profile && !profile.stats) {
      const normalized: PublicUserProfile = {
        id: profile.id || '',
        fullName: profile.fullName || 'Unknown User',
        email: profile.email || '',
        avatar: profile.avatar || null,
        level: profile.level || 0,
        role: profile.role || 'student',
        subscriptionStatus: profile.subscriptionStatus || 'free',
        bio: profile.bio || '',
        location: profile.location || '',
        skills: profile.skills || [],
        achievements: profile.achievements || '',
        joinedDate: profile.joinedDate,
        stats: {
          currentStreak: profile.currentStreak || 0,
          totalXP: profile.totalXP || 0,
          totalSessions: profile.totalSessions || 0,
        },
      };
      setProfile(normalized);
    }
    
    if (!profile && userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    if (!userId) {
      setError('User ID not provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`🔍 Fetching profile for user ID: ${userId}`);
      
      const response = await api.user.getPublicProfile(userId);
      
      console.log('📦 Profile API Response:', response);
      
      // Handle response wrapped in success/data structure
      let profileData: any = null;
      
      if ((response as any)?.success && (response as any)?.data) {
        profileData = (response as any).data;
      } else if ((response as any)?.data) {
        profileData = (response as any).data;
      } else if ((response as any)?.fullName || (response as any)?.email) {
        // Direct profile object
        profileData = response as any;
      }

      if (!profileData) {
        setError('User profile not found');
        return;
      }

      // Normalize stats object from flat API response
      const normalizedProfile: PublicUserProfile = {
        id: profileData.id || '',
        fullName: profileData.fullName || profileData.full_name || 'Unknown User',
        email: profileData.email || '',
        avatar: profileData.avatar || profileData.avatarUrl || null,
        level: profileData.level || 0,
        role: profileData.role || 'student',
        subscriptionStatus: profileData.subscriptionStatus || profileData.subscription_status || 'free',
        bio: profileData.bio || '',
        location: profileData.location || '',
        skills: profileData.skills || [],
        achievements: profileData.achievements || '',
        joinedDate: profileData.joinedDate || profileData.joined_date,
        stats: {
          currentStreak: profileData.currentStreak || profileData.current_streak || 0,
          totalXP: profileData.totalXP || profileData.total_xp || 0,
          totalSessions: profileData.totalSessions || profileData.total_sessions || 0,
        },
      };

      setProfile(normalizedProfile);
      console.log(`✅ Profile loaded for: ${normalizedProfile.fullName}`);
    } catch (err) {
      console.error('❌ Error fetching user profile:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30 dark:from-emerald-950/10 dark:via-slate-950 dark:to-teal-950/10 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-12 h-12 border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-500 rounded-full"></div>
          </motion.div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30 dark:from-emerald-950/10 dark:via-slate-950 dark:to-teal-950/10 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {error || 'Profile Not Found'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            The user profile you're looking for doesn't exist or is no longer available.
          </p>
          <Button onClick={() => navigate('/dashboard')} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <BasicHeader
        user={{
          id: profile?.id || '1',
          email: profile?.email || 'user@example.com',
          fullName: profile?.fullName || 'User',
          avatar: profile?.avatar || null,
          isPremium: profile?.subscriptionStatus === 'premium',
          subscriptionStatus: profile?.subscriptionStatus || 'free',
          role: (profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Student') as 'student' | 'teacher' | 'admin',
        }}
        onLogout={() => {
          navigate('/dashboard');
        }}
        showSidebarToggle={false}
        title="CognitoSpeak"
        subtitle="User Profile"
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 pt-20 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 md:space-y-8"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -4 }}
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-slate-700 dark:text-slate-300"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </motion.button>

          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 dark:from-emerald-900/10 dark:via-transparent dark:to-cyan-900/10 -z-10"></div>

            <div className="px-6 py-12 md:px-8 md:py-16">
              {/* Profile Info Section */}
              <div className="flex flex-col md:flex-row gap-8 mb-12">
                {/* Avatar */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="flex-shrink-0"
                >
                  <Avatar className="w-40 h-40 ring-4 ring-emerald-100 dark:ring-emerald-900/30 shadow-xl">
                    <AvatarImage src={profile?.avatar || ''} alt={profile?.fullName || 'User'} />
                    <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 text-4xl font-bold">
                      {getInitials(profile?.fullName || 'User')}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>

                {/* User Info */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex-1"
                >
                  <div className="mb-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">
                      {profile?.fullName || 'Unknown User'}
                    </h1>
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <Badge className="bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 px-4 py-2">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {(profile?.role?.charAt(0).toUpperCase() ?? 'S') + (profile?.role?.slice(1) ?? 'tudent')}
                      </Badge>
                      <Badge
                        className={`px-4 py-2 ${
                          profile?.subscriptionStatus === 'premium'
                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-300'
                            : profile?.subscriptionStatus === 'basic'
                              ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
                              : profile?.subscriptionStatus === 'pro'
                                ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300'
                                : 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        {profile?.subscriptionStatus === 'premium'
                          ? 'Premium'
                          : profile?.subscriptionStatus === 'basic'
                            ? 'Basic'
                            : profile?.subscriptionStatus === 'pro'
                              ? 'Pro'
                              : 'Free'}
                      </Badge>
                    </div>

                    {/* Bio */}
                    {profile?.bio && (
                      <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-4 max-w-2xl">
                        {profile.bio}
                      </p>
                    )}

                    {/* Location and Joined Date */}
                    <div className="flex flex-wrap gap-6 text-slate-600 dark:text-slate-400">
                      {profile?.location && (
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📍</span>
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile?.joinedDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          <span>Joined {new Date(profile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Follow
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
              >
                {/* Current Streak */}
                <div className="bg-gradient-to-br from-orange-50/90 to-red-50/90 dark:from-orange-900/40 dark:to-red-900/40 backdrop-blur-sm rounded-2xl p-5 border border-orange-200/50 dark:border-orange-800/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-orange-500/20 dark:bg-orange-500/10">
                      <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">Streak</span>
                  </div>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{profile?.stats?.currentStreak ?? 0}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">consecutive days</p>
                </div>

                {/* Total XP */}
                <div className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 dark:from-blue-900/40 dark:to-indigo-900/40 backdrop-blur-sm rounded-2xl p-5 border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-blue-500/20 dark:bg-blue-500/10">
                      <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total XP</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{(profile?.stats?.totalXP ?? 0).toLocaleString()}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">points earned</p>
                </div>

                {/* Level */}
                <div className="bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-900/40 dark:to-pink-900/40 backdrop-blur-sm rounded-2xl p-5 border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-purple-500/20 dark:bg-purple-500/10">
                      <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Level</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{profile?.level ?? 0}</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">current level</p>
                </div>

                {/* Sessions */}
                <div className="bg-gradient-to-br from-cyan-50/90 to-teal-50/90 dark:from-cyan-900/40 dark:to-teal-900/40 backdrop-blur-sm rounded-2xl p-5 border border-cyan-200/50 dark:border-cyan-800/50 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-cyan-500/20 dark:bg-cyan-500/10">
                      <TrendingUp className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">Sessions</span>
                  </div>
                  <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-100">{profile?.stats?.totalSessions ?? 0}</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-2">learning sessions</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Skills & Achievements Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            {profile?.skills && profile.skills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-emerald-500/20 dark:bg-emerald-500/10">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Skills</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 px-3 py-1"
                    >
                      ✨ {skill}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {profile?.achievements && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-yellow-500/20 dark:bg-yellow-500/10">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Achievements</h2>
                </div>
                <div className="space-y-3">
                  {Array.isArray(profile.achievements) ? (
                    profile.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                        <span className="text-2xl">🏆</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{achievement}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-200/50 dark:border-yellow-800/50">
                      <span className="text-2xl">🏆</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{profile.achievements}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Empty Skills Message */}
          {(!profile?.skills || profile.skills.length === 0) && !profile?.achievements && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg border border-slate-200/50 dark:border-slate-700/50 text-center"
            >
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Journey Just Started</h3>
              <p className="text-slate-600 dark:text-slate-400">This user is just beginning their learning journey. Check back soon for skills and achievements!</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfilePage;
