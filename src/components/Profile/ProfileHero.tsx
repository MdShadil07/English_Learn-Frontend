import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  Flame,
  Trophy,
  TrendingUp,
  BookOpen,
  Brain,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { PremiumIcon, BasicIcon } from '@/components/Icons';
import { FreeIcon } from '@/components/Icons';

interface ProfileHeroProps {
  profile: UserProfile;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mt-8 sm:mt-12 md:mt-16 w-full overflow-hidden"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 backdrop-blur-xl shadow-2xl border border-emerald-200/30 dark:border-emerald-700/30 w-full">
        {/* Enhanced Background decorative elements */}
        <div className="absolute inset-0 -z-10">
          {/* Large animated gradient orbs */}
          <div className="absolute -top-[50%] -right-[40%] w-[120rem] h-[120rem] rounded-full bg-gradient-to-tr from-emerald-200/30 via-teal-200/30 to-cyan-200/30 blur-3xl dark:from-emerald-800/15 dark:via-teal-800/15 dark:to-cyan-800/15 animate-pulse"></div>
          <div className="absolute -bottom-[40%] -left-[50%] w-[100rem] h-[100rem] rounded-full bg-gradient-to-br from-cyan-200/30 via-emerald-200/30 to-teal-200/30 blur-3xl dark:from-cyan-800/15 dark:via-emerald-800/15 dark:to-teal-800/15 animate-pulse delay-1000"></div>

          {/* Floating geometric shapes */}
          <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-2xl bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 rotate-45 animate-float"></div>
          <div className="absolute bottom-[30%] left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 animate-float-delayed"></div>
          <div className="absolute top-[60%] right-[30%] w-16 h-16 rounded-xl bg-gradient-to-br from-teal-300/20 to-cyan-300/20 dark:from-teal-700/20 dark:to-cyan-700/20 rotate-12 animate-float"></div>

          {/* Enhanced grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath opacity='.1' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Enhanced decorative shadow layers */}
        <div className="absolute -z-10 w-full h-full -bottom-4 -right-4 sm:-bottom-8 sm:-right-8 bg-gradient-to-br from-emerald-200/50 via-teal-200/50 to-cyan-200/50 dark:from-emerald-800/30 dark:via-teal-800/30 dark:to-cyan-800/30 rounded-3xl backdrop-blur-sm"></div>
        <div className="absolute -z-20 w-full h-full -bottom-8 -right-8 sm:-bottom-16 sm:-right-16 bg-gradient-to-br from-cyan-200/40 via-emerald-200/40 to-teal-200/40 dark:from-cyan-800/25 dark:via-emerald-800/25 dark:to-teal-800/25 rounded-3xl backdrop-blur-sm"></div>

        {/* Enhanced Floating Icons */}
        <motion.div
          className="absolute top-4 left-4 sm:top-6 sm:left-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
          animate={{
            y: [-8, 8, -8],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="h-6 w-6 sm:h-10 sm:w-10 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="absolute top-6 right-6 sm:top-10 sm:right-10 text-teal-500/40 sm:text-teal-500/50 dark:text-teal-400/30 dark:sm:text-teal-400/40 hidden sm:block"
          animate={{
            y: [8, -8, 8],
            rotate: [0, -3, 3, 0]
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Brain className="h-5 w-5 sm:h-8 sm:w-8 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="absolute bottom-12 left-8 sm:bottom-20 sm:left-12 text-cyan-500/40 sm:text-cyan-500/50 dark:text-cyan-400/30 dark:sm:text-cyan-400/40 hidden sm:block"
          animate={{
            y: [-6, 6, -6],
            x: [-3, 3, -3],
            rotate: [0, 8, -8, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Star className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-lg" />
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
          animate={{
            y: [10, -10, 10],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 drop-shadow-lg" />
        </motion.div>

        {/* Content - Profile Style */}
        <div className="relative overflow-hidden">
          {/* Hero Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-cyan-50/50 dark:from-emerald-900/10 dark:via-transparent dark:to-cyan-900/10"></div>

          {/* Floating Background Orbs */}
          <div className="absolute -top-10 -right-10 sm:-top-20 sm:-right-20 w-48 h-48 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 blur-3xl animate-pulse hidden sm:block"></div>
          <div className="absolute -bottom-10 -left-10 sm:-bottom-20 sm:-left-20 w-40 h-40 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-cyan-200/20 to-emerald-200/20 dark:from-cyan-800/10 dark:to-emerald-800/10 blur-3xl animate-pulse delay-1000 hidden sm:block"></div>

          <div className="relative z-10 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 w-full overflow-hidden">
            <div className="flex flex-col items-center gap-3 sm:gap-4 md:gap-6 lg:flex-row lg:items-start lg:gap-8 w-full max-w-full">

              {/* Left Section - Centered Rectangular Avatar */}
              <div className="flex flex-col items-center justify-center flex-shrink-0 w-full lg:w-auto">
                {/* Rectangular Profile Avatar - Centered */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="relative group mb-2 sm:mb-3 md:mb-4"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.fullName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                        <span className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-600 dark:text-slate-400">
                          {profile.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Subscription indicator */}
                  {profile.subscriptionStatus === 'premium' && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-1 shadow-lg">
                      <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                    </div>
                  )}
                </motion.div>

                {/* User Email - Minimal and Simple */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center"
                >
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-normal truncate max-w-[150px] sm:max-w-[200px]">{profile.email}</p>
                  <div className="flex items-center justify-center gap-1 mt-0.5 sm:mt-1">
                    <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs font-medium text-green-600 dark:text-green-400">Active</span>
                  </div>
                </motion.div>
              </div>

              {/* Right Section - User Info & Stats */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex-1 space-y-2 sm:space-y-3 md:space-y-4 w-full min-w-0 overflow-hidden"
              >
                {/* User Name, Role, and Plan */}
                <div className="text-center lg:text-left">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
                    {profile.fullName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2 md:gap-3">
                    <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold ${
                      profile.role === 'student'
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
                        : 'bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {profile.role}
                    </span>
                    <span className={`px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold ${
                      profile.subscriptionStatus === 'premium'
                        ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 border border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-300'
                        : profile.subscriptionStatus === 'basic'
                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300'
                        : 'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {profile.subscriptionStatus === 'premium' ? 'Premium Plan' : profile.subscriptionStatus === 'basic' ? 'Pro Plan' : 'Free Plan'}
                    </span>
                  </div>
                </div>

                {/* Bio/About Section - Minimal Card Design */}
                {profile.bio && (
                  <div className="max-w-2xl mx-auto lg:mx-0 mr-4 sm:mr-6 md:mr-8 lg:mr-12 w-full">
                    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 border border-slate-200/50 dark:border-slate-700/50 shadow-sm min-h-[60px] sm:min-h-[80px] md:min-h-[100px] lg:min-h-[120px] w-full overflow-hidden">
                      <div className="border-l-4 border-slate-300 dark:border-slate-600 pl-2 sm:pl-3 md:pl-4">
                        <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed break-words">{profile.bio}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile Stats Cards */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 w-full max-w-full mx-auto lg:mx-0 overflow-hidden">
                  {/* Current Streak */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-orange-500" />
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">{profile.stats.currentStreak}</p>
                  </div>

                  {/* Total XP */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-blue-500" />
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">{profile.stats.totalXP.toLocaleString()}</p>
                  </div>

                  {/* Level */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-500" />
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">{profile.level}</p>
                  </div>

                  {/* Weekly Progress */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-cyan-500" />
                    <p className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">{profile.stats.totalSessions}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHero;
