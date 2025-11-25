import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Flame, Trophy } from 'lucide-react';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon, ProPlanIcon } from '@/components/Icons/SubscriptionIcons';
import { SubscriptionCard } from '../Global Component/SubscriptionCard';

interface ProfileSideBarUserCardProps {
  profile: {
    avatar?: string; // Updated to match auth controller response
    fullName: string;
    level: number;
    role?: 'student' | 'teacher' | 'admin';
    stats: {
      currentStreak: number;
      totalXP: number;
    };
    subscriptionStatus: 'none' | 'free' | 'basic' | 'premium' | 'pro';
  };
}

export const ProfileSideBarUserCard: React.FC<ProfileSideBarUserCardProps> = ({
  profile,
}) => {
  return (
    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
      <Card className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <Avatar className="w-16 h-16 ring-4 ring-white/50 dark:ring-slate-700/50 shadow-lg">
                <AvatarImage
                  src={profile.avatar}
                  alt="Profile"
                  onError={(e) => {
                    // Hide the image if Firebase URL is invalid
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <AvatarFallback className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-lg font-bold">
                  {profile.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {profile.subscriptionStatus === 'premium' && (
                <PremiumPlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
              {profile.subscriptionStatus === 'basic' && (
                <BasicPlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
              {profile.subscriptionStatus === 'pro' && (
                <ProPlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
              {profile.subscriptionStatus === 'free' && (
                <FreePlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base">{profile.fullName}</h3>
              <div className="flex items-center gap-2">
                <p className="text-sm text-slate-600 dark:text-slate-400">Level {profile.level}</p>
                <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {profile.role === 'teacher' ? 'Teacher' :
                   profile.role === 'admin' ? 'Admin' :
                   profile.role === 'student' ? 'Student' : 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats with Modern Design */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative overflow-hidden bg-gradient-to-br from-orange-50/90 via-red-50/90 to-amber-50/90 dark:from-orange-900/30 dark:via-red-900/30 dark:to-amber-900/30 backdrop-blur-xl p-3 rounded-2xl border border-orange-200/40 dark:border-orange-800/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 to-red-100/20 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl"></div>
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-orange-400/60 to-red-400/60 animate-pulse"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-red-400/40 to-orange-400/40 animate-pulse delay-500"></div>

              {/* Floating geometric shapes */}
              <div className="absolute top-2 right-8 w-4 h-4 rounded-lg bg-gradient-to-br from-orange-300/30 to-red-300/30 dark:from-orange-700/30 dark:to-red-700/30 rotate-45 animate-float opacity-60"></div>

              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                >
                  <Flame className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 mb-1">Current Streak</p>
                  <p className="font-extrabold text-2xl text-orange-900 dark:text-orange-100">{profile.stats.currentStreak}</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">days 🔥</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 backdrop-blur-xl p-3 rounded-2xl border border-blue-200/40 dark:border-blue-800/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
              {/* Background decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-indigo-100/20 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl"></div>
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-blue-400/60 to-indigo-400/60 animate-pulse"></div>
              <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-indigo-400/40 to-blue-400/40 animate-pulse delay-500"></div>

              {/* Floating geometric shapes */}
              <div className="absolute top-2 right-8 w-4 h-4 rounded-lg bg-gradient-to-br from-blue-300/30 to-indigo-300/30 dark:from-blue-700/30 dark:to-indigo-700/30 rotate-45 animate-float opacity-60"></div>

              <div className="relative flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                  className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg"
                >
                  <Trophy className="h-5 w-5" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Total XP</p>
                  <p className="font-extrabold text-2xl text-blue-900 dark:text-blue-100">{profile.stats.totalXP.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">points earned 🏆</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status Card */}
          <SubscriptionCard subscriptionStatus={profile.subscriptionStatus} />
        </CardContent>
      </Card>
    </div>
  );
};
