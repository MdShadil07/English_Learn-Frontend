import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  X,
  User,
  Trophy,
  Settings,
  Crown,
  Target,
  Activity,
  Award,
  TrendingUp,
  Clock,
  Star,
  Zap,
  Gift,
  Calendar,
  BookOpen,
  MessageSquare,
  Bell,
  Shield,
  CreditCard,
  Download,
  Edit3,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import { BasicPlanCard } from './BasicPlanCard';
import { PremiumPlanCard } from './PremiumPlanCard';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon } from '@/components/Icons/SubscriptionIcons';
import { ProfileSideBarUserCard } from './ProfileSideBarUserCard';

interface ProfileSidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  profile: {
    avatar?: string; // Updated to match auth controller response
    fullName: string;
    level: number;
    role?: 'student' | 'teacher' | 'admin';
    stats: {
      currentStreak: number;
      totalXP: number;
    };
    isPremium: boolean;
    subscriptionStatus: 'none' | 'free' | 'basic' | 'premium' | 'pro';
    preferences: {
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
    };
  };
  activeView: 'overview' | 'achievements' | 'settings' | 'activity' | 'subscription';
  onViewChange: (view: 'overview' | 'achievements' | 'settings' | 'activity' | 'subscription') => void;
  onEditProfile?: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  showSidebar,
  setShowSidebar,
  profile,
  activeView,
  onViewChange,
  onEditProfile,
}) => {
  const sidebarViews = [
    { id: 'overview', label: 'Overview', icon: User, color: 'blue' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, color: 'yellow' },
    { id: 'activity', label: 'Activity', icon: Activity, color: 'green' },
    { id: 'subscription', label: 'Subscription', icon: Crown, color: 'purple' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'slate' },
  ];

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-500',
      yellow: 'text-yellow-500',
      green: 'text-green-500',
      purple: 'text-purple-500',
      slate: 'text-slate-500',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
            scroll-behavior: smooth;
            position: relative;
          }

          .custom-scrollbar-thin::-webkit-scrollbar {
            height: 0.5px;
            background: transparent;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgba(148, 163, 184, 0.4), rgba(148, 163, 184, 0.2));
            border-radius: 0.25px;
            transition: all 0.2s ease;
            cursor: pointer;
            min-height: 0.5px;
          }

          .custom-scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.6));
            height: 1px;
          }

          .custom-scrollbar-thin:hover::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgba(79, 70, 229, 0.7), rgba(124, 58, 237, 0.7));
          }

          /* Minimal scroll indicator */
          .scroll-indicator-minimal {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 0.5px;
            background: linear-gradient(90deg,
              transparent 0%,
              rgba(148, 163, 184, 0.15) 15%,
              rgba(148, 163, 184, 0.3) 50%,
              rgba(148, 163, 184, 0.15) 85%,
              transparent 100%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .custom-scrollbar-thin:hover .scroll-indicator-minimal {
            opacity: 1;
          }

          /* Floating animations */
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }

          @keyframes float-delayed {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(-3deg); }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .nav-button-active {
            background: linear-gradient(to right, #059669, #10b981) !important;
            transition: none !important;
          }

          .nav-button-inactive {
            transition: all 0.15s ease-in-out !important;
          }

          .nav-button-inactive:hover {
            transform: translateY(-1px) scale(1.02) !important;
          }
        `
      }} />
      <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{
            x: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
            },
            opacity: {
              duration: 0.2,
              ease: "easeOut"
            }
          }}
          className="fixed top-16 left-0 z-40 w-80 sm:w-96 h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header with Profile Card */}
          <ProfileSideBarUserCard profile={profile} />

          {/* Navigation Tabs - Horizontal Scrolling Pagination */}
          <div className="px-4 mt-4 mb-3">
            <div className="relative">
              {/* Horizontal Scrollable Container with Enhanced Scrollbar */}
              <div className="overflow-x-auto custom-scrollbar-thin scrollbar-thin touch-pan-x">
                <div className="flex gap-2 items-center min-w-max px-1 pb-2">
                  {sidebarViews.map((view, index) => {
                    const Icon = view.icon;
                    const isActive = activeView === view.id;

                    return (
                      <motion.button
                        key={view.id}
                        onClick={() => onViewChange(view.id as any)}
                        className={`relative flex-shrink-0 px-3 py-2.5 rounded-lg flex items-center gap-2 min-w-[95px] sm:min-w-[100px] ${isActive ? 'nav-button-active bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg border-0' : 'nav-button-inactive bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:shadow-md'}`}
                        whileHover={isActive ? {} : { scale: 1.02, y: -1 }}
                        whileTap={isActive ? {} : { scale: 0.98 }}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : getIconColor(view.color)}`} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : ''}`}>
                          {view.label}
                        </span>

                        {/* Active State Pulse Effect - Behind content */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-emerald-100 dark:bg-emerald-800 rounded-lg shadow-lg -z-10"
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(5, 150, 105, 0.7)",
                                "0 0 0 4px rgba(5, 150, 105, 0)",
                                "0 0 0 0 rgba(5, 150, 105, 0)"
                              ]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              repeatDelay: 1
                            }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="scroll-indicator-minimal"></div>
            </div>
          </div>

          {/* Dynamic Content Area */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeView === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-indigo-50/20 via-white/40 to-purple-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="space-y-6">
                    {/* Daily Progress */}
                    <div className="bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 backdrop-blur-sm rounded-xl p-4 border border-emerald-200/40 dark:border-emerald-800/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Daily Progress</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Today's learning streak</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Study Time</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">45m</span>
                        </div>
                        <div className="w-full bg-emerald-200/60 dark:bg-emerald-800/60 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Weekly Goal</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">60 min</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Quick Actions</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (onEditProfile) {
                              onEditProfile();
                              setShowSidebar(false);
                            }
                          }}
                          className="text-xs bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-200 h-10"
                        >
                          <Edit3 className="h-3 w-3 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-200 h-10">
                          <Download className="h-3 w-3 mr-2" />
                          Export Data
                        </Button>
                      </div>
                    </div>

                    {/* Current Level Progress */}
                    <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 backdrop-blur-sm rounded-xl p-4 border border-blue-200/40 dark:border-blue-800/40 shadow-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                          <Star className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Level Progress</h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400">Level {profile.level} • {profile.stats.totalXP.toLocaleString()} XP</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">Progress to Next Level</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">75%</span>
                        </div>
                        <div className="w-full bg-blue-200/60 dark:bg-blue-800/60 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: '75%' }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">2,500 XP to next level</p>
                      </div>
                    </div>

                    {/* Subscription Status */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Subscription</span>
                      </div>
                      <div className="bg-gradient-to-br from-slate-50/90 to-indigo-50/90 dark:from-slate-800/90 dark:to-slate-900/90 rounded-xl p-4 border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Current Plan</span>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${profile.subscriptionStatus === 'premium' ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 dark:text-amber-300' : profile.subscriptionStatus === 'basic' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300' : profile.subscriptionStatus === 'free' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                            {profile.subscriptionStatus === 'premium' ? (
                              <>
                                <PremiumPlanIcon size="md" className="flex-shrink-0" />
                                Premium
                              </>
                            ) : profile.subscriptionStatus === 'basic' ? (
                              <>
                                <BasicPlanIcon size="md" className="flex-shrink-0" />
                                Basic
                              </>
                            ) : profile.subscriptionStatus === 'free' ? (
                              <>
                                <FreePlanIcon size="md" className="flex-shrink-0" />
                                Free
                              </>
                            ) : (
                              <>
                                <span className="text-slate-600 dark:text-slate-400">No Subscription</span>
                              </>
                            )}
                          </div>
                        </div>
                        {profile.subscriptionStatus === 'none' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Choose a Plan
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'free' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Basic
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'basic' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Premium
                          </Button>
                        )}
                        {profile.subscriptionStatus === 'premium' && (
                          <div className="text-center">
                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Premium Member</p>
                            <div className="flex items-center justify-center gap-1">
                              <PremiumPlanIcon size="md" className="flex-shrink-0" />
                              <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">All Features Unlocked</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Achievements */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Achievements</span>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg p-3 border border-amber-200/40 dark:border-amber-800/40">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">🏆</div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Week Warrior</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">7-day streak completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg p-3 border border-blue-200/40 dark:border-blue-800/40">
                          <div className="flex items-center gap-3">
                            <div className="text-xl">📚</div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Grammar Master</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">95% accuracy achieved</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'subscription' && (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-purple-50/20 via-white/40 to-indigo-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="space-y-4">
                    <BasicPlanCard />
                    <PremiumPlanCard isPremium={profile.isPremium} />
                  </div>
                </motion.div>
              )}

              {activeView === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-slate-50/20 via-white/40 to-indigo-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <ProfileSettings
                    preferences={profile.preferences}
                    onUpdatePreferences={(preferences) => {
                      // Update preferences logic here
                      console.log('Preferences updated:', preferences);
                    }}
                  />
                </motion.div>
              )}

              {(activeView === 'achievements' || activeView === 'activity') && (
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full overflow-y-auto p-4 space-y-5 bg-gradient-to-b from-yellow-50/20 via-white/40 to-orange-50/20 dark:from-slate-900/40 dark:via-slate-900/30 dark:to-slate-800/40 scrollbar-hide"
                >
                  <div className="text-center py-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg ${
                      activeView === 'achievements'
                        ? 'bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40'
                    }`}>
                      {activeView === 'achievements' ? (
                        <Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                      ) : (
                        <Activity className="h-8 w-8 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                      {activeView === 'achievements' ? 'Achievement Gallery' : 'Activity Timeline'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {activeView === 'achievements'
                        ? 'Track your learning milestones and unlock rewards'
                        : 'View your learning journey and progress over time'
                      }
                    </p>
                    <Button className={`bg-gradient-to-r shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                      activeView === 'achievements'
                        ? 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                        : 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    }`}>
                      <Plus className="h-4 w-4 mr-2" />
                      {activeView === 'achievements' ? 'Browse Achievements' : 'View Full Activity'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
};
