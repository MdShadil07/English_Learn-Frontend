import React from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  MapPin,
  Calendar,
  Settings,
  Edit3,
  Clock,
  Target,
  Crown
} from 'lucide-react';
import { UserProfile } from '@/types/user';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ProfileHeroProps {
  profile: UserProfile;
}

const ProfileHero: React.FC<ProfileHeroProps> = ({ profile }) => {
  const navigate = useNavigate();

  const hoursStudied = Math.floor((profile.totalStudyTime || 0) / 60);
  const minutesStudied = (profile.totalStudyTime || 0) % 60;
  const levelProgress = ((profile.stats?.totalXP || 0) % 1000) / 1000 * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mt-8 sm:mt-12 w-full"
    >
      {/* 
        EXACT SIDEBAR PARITY CONTAINER
      */}
      <div className={cn(
        "relative w-full rounded-[3rem] p-[1px]",
        "bg-emerald-200/40 dark:bg-emerald-500/10",
        "shadow-sm sm:shadow-md dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-shadow duration-500"
      )}>
        <div className={cn(
          "relative w-full h-full rounded-[2.9rem] p-8 sm:p-12",
          "bg-white/95 sm:backdrop-blur-2xl dark:bg-[#050C14]/60",
          "overflow-hidden"
        )}>

        {/* Background decorative elements matching AIChatPage pulses */}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[55%] bg-emerald-300/5 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 group-hover:bg-emerald-400/10 transition-colors duration-700"></div>
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-teal-300/5 dark:bg-teal-500/10 rounded-full blur-[70px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_1s] z-0 group-hover:bg-teal-400/10 transition-colors duration-700"></div>
        <div className="relative z-10 flex flex-col xl:flex-row gap-12 lg:gap-16 items-center xl:items-center">

          {/* =========================================================
              LEFT: RECTANGULAR AVATAR (Creative, Simple, Rounded Corners)
          ========================================================= */}
          <div className="relative shrink-0 flex flex-col items-center">

            <div className="relative group">
              {/* Subtle Glow Behind Avatar */}
              <div className="absolute inset-0 bg-emerald-500/20 rounded-[2.5rem] blur-2xl group-hover:bg-emerald-400/30 transition-colors duration-700"></div>

              {/* Rectangular Avatar Container matching Small Cards */}
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-[2rem] p-1.5 sm:p-2 bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/80 border border-emerald-200/40 dark:border-emerald-500/10 shadow-xl dark:shadow-[0_8px_30px_rgba(16,185,129,0.1)] flex items-center justify-center">
                <div className="w-full h-full rounded-[1.5rem] sm:rounded-[1.6rem] overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.fullName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        // Hide the broken image
                        (e.target as HTMLImageElement).style.display = 'none';
                        // Show the fallback span which is a sibling
                        const nextSibling = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (nextSibling) nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback initials - hidden by default if avatar exists, shown on error or if no avatar */}
                  <span
                    className="w-full h-full items-center justify-center text-6xl font-black text-slate-300 dark:text-slate-600"
                    style={{ display: profile.avatar ? 'none' : 'flex' }}
                  >
                    {profile.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>

              {/* Level Badge integrated into the corner of the rectangle */}
              <div className="absolute -bottom-3 -right-3 z-20 flex items-center justify-center w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rotate-3 group-hover:rotate-0 transition-transform duration-300 ease-out">
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5">Lvl</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">{profile.level}</span>
                </div>
              </div>
            </div>

            {/* Sub-actions */}
            <div className="flex w-full gap-3 mt-8 justify-center">
              <button onClick={() => navigate('/edit-profile')} className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 border border-transparent font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                <Edit3 strokeWidth={2} className="w-4 h-4" /> Edit Profile
              </button>
              <button onClick={() => navigate('/settings')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm">
                <Settings strokeWidth={2} className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* =========================================================
              RIGHT: IDENTIY & MINIMALIST STATS (No Cards)
          ========================================================= */}
          <div className="flex-1 w-full flex flex-col items-center xl:items-start text-center xl:text-left">

            {/* Identity Header */}
            <div className="w-full mb-6">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none drop-shadow-sm">
                  {profile.fullName}
                </h1>
                {profile.isVerified && (
                  <BadgeCheck strokeWidth={2.5} className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4 mt-5 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <MapPin strokeWidth={2.5} className="w-4 h-4 text-emerald-500" />
                  {profile.location || 'Global Citizen'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="flex items-center gap-1.5">
                  <Calendar strokeWidth={2.5} className="w-4 h-4 text-teal-500" />
                  Joined 2026
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  Online
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full max-w-2xl mb-10">
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {profile.bio || "No bio provided yet. Update your profile to tell the community about your language learning journey."}
              </p>
            </div>

            {/* =====================================================
                "SOMETHING ELSE" - MINIMALIST INLINE STATS ROW (No Cards)
                ===================================================== */}
            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-8 sm:gap-12 w-full pt-6 border-t border-slate-200/50 dark:border-white/10">

              {/* Focus Time */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Clock strokeWidth={2.5} className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Focus Time</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{hoursStudied}</span>
                    <span className="text-xs font-bold text-blue-500">h</span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none ml-1">{minutesStudied}</span>
                    <span className="text-xs font-bold text-blue-500">m</span>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-white/10"></div>

              {/* Weekly Target */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 group-hover:scale-110 transition-transform">
                  <Target strokeWidth={2.5} className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Weekly Target</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">{profile.stats?.totalSessions || 0}</span>
                    <span className="text-xs font-bold text-orange-500">/ {profile.weeklyGoal || 5}</span>
                  </div>
                </div>
              </div>

              {/* Vertical Divider */}
              <div className="hidden sm:block w-px h-12 bg-slate-200 dark:bg-white/10"></div>

              {/* Active Plan */}
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Crown strokeWidth={2.5} className="w-5 h-5 text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-0.5">Subscription</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white leading-none capitalize">
                    {profile.tier}
                  </span>
                </div>
              </div>

            </div>

            {/* Level Progress Bar (Floating minimalist line instead of ring) */}
            <div className="w-full max-w-2xl mt-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Level Progress</span>
                <span className="text-[10px] font-bold text-slate-500">{Math.round(levelProgress)}% to next</span>
              </div>
              <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                  style={{ width: `${levelProgress}%` }}
                ></div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default ProfileHero;
