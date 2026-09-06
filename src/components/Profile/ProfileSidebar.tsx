import React, { useRef } from 'react';
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
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import { BasicPlanCard } from './BasicPlanCard';
import { PremiumPlanCard } from './PremiumPlanCard';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon } from '@/components/Icons/SubscriptionIcons';
import { ProfileSideBarUserCard } from './ProfileSideBarUserCard';
import { VerificationStatusCard } from './VerificationStatusCard';

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
    tier?: 'free' | 'pro' | 'premium';
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

  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const scrollAmount = 150;
      tabsRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
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
            background: linear-gradient(to right, rgba(16, 185, 129, 0.9), rgba(20, 184, 166, 0.8)) !important;
            transition: all 0.3s ease !important;
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
          className="fixed top-16 left-0 z-40 w-80 h-[calc(100vh-4rem)] bg-white sm:backdrop-blur-2xl dark:bg-[#050C14] border-r border-emerald-200/40 dark:border-emerald-500/10 flex flex-col shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background decorative elements - Static for performance */}
          <div className="absolute inset-0 pointer-events-none -z-10">
            <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-200/20 to-emerald-200/20 dark:from-cyan-800/10 dark:to-emerald-800/10 blur-[80px]"></div>
          </div>

          {/* Header with Profile Card */}
          <div className="relative z-10">
            <ProfileSideBarUserCard profile={profile} />
          </div>



          {/* Navigation Tabs - Horizontal Scrolling Pagination */}
          <div className="px-4 mt-2 mb-3">
            <div className="relative group">
              {/* Left Scroll Button (hidden on mobile, shown on desktop hover) */}
              <button 
                onClick={() => scrollTabs('left')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#0A121A] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-slate-50 dark:hover:bg-slate-800"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>

              {/* Horizontal Scrollable Container (Scrollbar Hidden) */}
              <div 
                ref={tabsRef}
                className="overflow-x-auto scrollbar-hide touch-pan-x border border-white/40 bg-white/60 p-1 shadow-inner backdrop-blur-sm dark:border-emerald-500/20 dark:bg-[#050C14]/50 rounded-2xl scroll-smooth"
              >
                <div className="flex gap-1 items-center min-w-max px-1">
                  {sidebarViews.map((view, index) => {
                    const Icon = view.icon;
                    const isActive = activeView === view.id;

                    return (
                      <motion.button
                        key={view.id}
                        onClick={() => onViewChange(view.id as any)}
                        className={`relative flex-shrink-0 px-3 py-2.5 rounded-xl flex items-center gap-2 min-w-[95px] sm:min-w-[100px] transition-all duration-300 border border-transparent ${isActive ? 'nav-button-active text-white shadow-lg' : 'bg-transparent text-emerald-700 hover:border-emerald-300/60 hover:bg-emerald-50/60 hover:text-emerald-800 dark:text-emerald-200 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-900/40'}`}
                        whileHover={isActive ? {} : { scale: 1.02, y: -1 }}
                        whileTap={isActive ? {} : { scale: 0.98 }}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : getIconColor(view.color)}`} />
                        <span className={`text-xs font-semibold ${isActive ? 'text-white' : ''}`}>
                          {view.label}
                        </span>

                        {/* Active State Element - Static for performance */}
                        {isActive && (
                          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-800 rounded-lg shadow-md -z-10" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Right Scroll Button */}
              <button 
                onClick={() => scrollTabs('right')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-[#0A121A] shadow-[0_2px_8px_rgba(0,0,0,0.12)] border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-slate-50 dark:hover:bg-slate-800"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              </button>
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
                  className="h-full overflow-y-auto p-4 space-y-5 scrollbar-hide relative z-10"
                >
                  <div className="space-y-6">
                    {/* Verification Status Card */}
                    <VerificationStatusCard profile={profile} />

                    {/* Daily Progress */}
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.05)] p-4 transition-all duration-500 group/card">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
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
                    <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.05)] p-4 transition-all duration-500 group/card">
                      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
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
                      <div className="relative overflow-hidden rounded-[1.5rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.05)] p-4 transition-all duration-500 group/card">
                        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Current Plan</span>
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${profile.tier === 'premium' ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 text-amber-800 dark:from-amber-900/30 dark:via-yellow-900/30 dark:to-orange-900/30 dark:text-amber-300' : profile.tier === 'pro' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300' : profile.tier === 'free' ? 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 dark:from-gray-900/30 dark:to-slate-900/30 dark:text-gray-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                            {profile.tier === 'premium' ? (
                              <>
                                <PremiumPlanIcon size="md" className="flex-shrink-0" />
                                Premium
                              </>
                            ) : profile.tier === 'pro' ? (
                              <>
                                <BasicPlanIcon size="md" className="flex-shrink-0" />
                                Pro
                              </>
                            ) : profile.tier === 'free' ? (
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
                        {(!profile.tier || profile.tier === 'free') && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Pro
                          </Button>
                        )}
                        {profile.tier === 'pro' && (
                          <Button size="sm" className="w-full text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 shadow-lg">
                            <Crown className="h-3 w-3 mr-2" />
                            Upgrade to Premium
                          </Button>
                        )}
                        {profile.tier === 'premium' && (
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
                        <div className="relative overflow-hidden rounded-xl border border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-900/10 p-3 transition-all duration-300 hover:dark:bg-amber-900/20">
                          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
                          <div className="flex items-center gap-3">
                            <div className="text-xl">🏆</div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Week Warrior</p>
                              <p className="text-xs text-slate-600 dark:text-slate-400">7-day streak completed</p>
                            </div>
                          </div>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 p-3 transition-all duration-300 hover:dark:bg-blue-900/20">
                          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
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
                  className="h-full overflow-y-auto p-4 space-y-5 scrollbar-hide relative z-10"
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
                  className="h-full overflow-y-auto p-4 space-y-5 scrollbar-hide relative z-10"
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
                  className="h-full overflow-y-auto p-4 space-y-5 scrollbar-hide relative z-10"
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
