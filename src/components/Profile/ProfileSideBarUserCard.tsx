import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Flame, Trophy, BadgeCheck } from 'lucide-react';
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
    isVerified?: boolean;
    tier?: 'free' | 'pro' | 'premium';
    subscriptionStatus: 'none' | 'free' | 'basic' | 'premium' | 'pro';
  };
}

export const ProfileSideBarUserCard: React.FC<ProfileSideBarUserCardProps> = ({
  profile,
}) => {
  // Stat tiles using the exact AI Chat holographic design
  const statTiles = [
    {
      id: 'streak',
      label: 'Streak',
      value: profile.stats.currentStreak,
      icon: Flame,
      gradient: 'from-orange-400 to-orange-500 shadow-orange-500/20',
      labelColor: 'text-orange-600 dark:text-orange-400',
      bgClass: 'hover:bg-orange-50 dark:hover:bg-orange-500/10',
      borderClass: 'hover:border-orange-200 dark:hover:border-orange-500/30'
    },
    {
      id: 'xp',
      label: 'Total XP',
      value: profile.stats.totalXP.toLocaleString(),
      icon: Trophy,
      gradient: 'from-blue-400 to-blue-500 shadow-blue-500/20',
      labelColor: 'text-blue-600 dark:text-blue-400',
      bgClass: 'hover:bg-blue-50 dark:hover:bg-blue-500/10',
      borderClass: 'hover:border-blue-200 dark:hover:border-blue-500/30'
    }
  ];

  return (
    <div className="p-4 flex-none">
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] flex-none transition-all duration-1000 group w-full">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
        
        {/* Static Glowing Orbs for performance on low-end devices */}
        <div 
          className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none z-0"
        />
        <div 
          className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 dark:bg-teal-600/20 rounded-full blur-[60px] pointer-events-none z-0"
        />

        {/* Sparkles */}
        <div className="absolute top-[10%] right-[15%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)] animate-ping opacity-50 z-0"></div>
        <div className="absolute bottom-[20%] left-[10%] w-1.5 h-1.5 bg-emerald-300 rounded-full shadow-[0_0_10px_rgba(52,211,153,1)] animate-pulse opacity-60 z-0"></div>

        <div className="relative z-10 p-5 space-y-4">

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
              {profile.tier === 'premium' && (
                <PremiumPlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
              {profile.tier === 'pro' && (
                <ProPlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
              {(!profile.tier || profile.tier === 'free') && (
                <FreePlanIcon size="sm" className="absolute -top-1 -right-1" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base">{profile.fullName}</h3>
                {profile.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />}
              </div>
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

          {/* Holographic Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            {statTiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <div
                  key={tile.id}
                  className={cn(
                    "relative flex items-center gap-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 p-2 transition-all duration-300 shadow-sm cursor-default group/tile",
                    tile.bgClass,
                    tile.borderClass
                  )}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tile.gradient} text-white shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                  >
                    <Icon className="h-4 w-4 drop-shadow-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                      {tile.label}
                    </p>
                    <p className={cn("truncate text-[13px] font-black leading-none mt-0.5 tracking-tight", tile.labelColor)}>
                      {tile.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subscription Status Card */}
          <SubscriptionCard tier={profile.tier} />
        </div>
      </div>
    </div>
  );
};
