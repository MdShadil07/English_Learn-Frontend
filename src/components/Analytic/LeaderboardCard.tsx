import React, { useMemo, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Medal, Target, Sparkles, Trophy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry } from '@/services/analyticsService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';
import AnalyticsCardShell from './AnalyticsCardShell';
import TopPerformerCard from './TopPerformerCard';
import { useSidebar } from '@/components/ui/sidebar';
import { getInitials } from './leaderboardUtils';

const resolveAvatarValue = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') {
    return value.trim() === '' ? undefined : value;
  }
  if (typeof value === 'object' && value !== null) {
    const candidate =
      (value as Record<string, unknown>).url ||
      (value as Record<string, unknown>).secureUrl ||
      (value as Record<string, unknown>).secure_url ||
      (value as Record<string, unknown>).path ||
      (value as Record<string, unknown>).avatarUrl ||
      (value as Record<string, unknown>).href;
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate;
    }
  }
  return undefined;
};

const getAvatarSource = (user: unknown) => {
  if (!user || typeof user !== 'object') return undefined;
  const record = user as Record<string, unknown>;
  const sources = [
    record.avatarUrl,
    record.avatar,
    record.profileImage,
    record.profile_image,
    record.photoUrl,
    record.photo_url,
  ];
  for (const value of sources) {
    const resolved = resolveAvatarValue(value);
    if (resolved) {
      return resolved;
    }
  }

  const profile = record.profile && typeof record.profile === 'object' ? (record.profile as Record<string, unknown>) : null;
  if (profile) {
    const profileSourceKeys = ['avatar_url', 'avatarUrl', 'avatar', 'image', 'imageUrl', 'profileImage', 'profile_image'];
    for (const key of profileSourceKeys) {
      const resolved = resolveAvatarValue(profile[key]);
      if (resolved) {
        return resolved;
      }
    }
  }

  const userProfile = record.userProfile && typeof record.userProfile === 'object' ? (record.userProfile as Record<string, unknown>) : null;
  if (userProfile) {
    const userProfileSourceKeys = ['avatar_url', 'avatarUrl', 'avatar', 'image', 'imageUrl', 'profileImage', 'profile_image'];
    for (const key of userProfileSourceKeys) {
      const resolved = resolveAvatarValue(userProfile[key]);
      if (resolved) {
        return resolved;
      }
    }
  }

  return undefined;
};

const handleAvatarError: React.ReactEventHandler<HTMLImageElement> = (event) => {
  event.currentTarget.style.display = 'none';
};

type LeaderboardMetricOption = { label: string; value: string };

type LeaderboardTimeframeValue = 'week' | 'month' | 'all';

type LeaderboardTimeframeOption = { label: string; value: LeaderboardTimeframeValue };

type LeaderboardTierValue = 'all' | 'free' | 'pro' | 'premium';

type LeaderboardTierOption = { label: string; value: LeaderboardTierValue };

interface LeaderboardCardProps {
  metric: string;
  timeframe: LeaderboardTimeframeValue;
  tier: LeaderboardTierValue;
  currentUserId: string;
  isPremiumUser: boolean;
  metricOptions: LeaderboardMetricOption[];
  timeframeOptions: LeaderboardTimeframeOption[];
  tierOptions: LeaderboardTierOption[];
  onMetricChange: (value: string) => void;
  onTimeframeChange: (value: LeaderboardTimeframeValue) => void;
  onTierChange: (value: LeaderboardTierValue) => void;
  entries: LeaderboardEntry[];
  viewerPlacement?: LeaderboardEntry | null;
}

const TOP_LIMIT = 100;
const PAGE_SIZE = 12;

const formatRelativeTime = (isoString?: string | null) => {
  if (!isoString) return 'Active recently';

  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  if (diffMinutes < 1) return 'Active now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;

  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears}y ago`;
};

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  metric,
  timeframe,
  tier,
  currentUserId,
  isPremiumUser,
  metricOptions,
  timeframeOptions,
  tierOptions,
  onMetricChange,
  onTimeframeChange,
  onTierChange,
  entries,
  viewerPlacement,
}) => {
  let sidebarState: 'expanded' | 'collapsed' = 'expanded';
  try {
    const sidebar = useSidebar();
    sidebarState = sidebar.state;
  } catch (error) {
    sidebarState = 'expanded';
  }

  const normalizedEntries = useMemo(
    () =>
      entries.map((entry) => {
        const avatarSource = getAvatarSource(entry.user);
        return {
          ...entry,
          user: {
            ...entry.user,
            avatar: avatarSource ?? entry.user.avatar ?? null,
            avatarUrl: avatarSource ?? entry.user.avatarUrl ?? null,
          },
        };
      }),
    [entries]
  );

  const viewerEntry = useMemo(() => {
    if (!viewerPlacement || !viewerPlacement.user?.id) return undefined;
    if (viewerPlacement.user.id !== currentUserId) return undefined;

    const avatarSource = getAvatarSource(viewerPlacement.user);
    return {
      ...viewerPlacement,
      user: {
        ...viewerPlacement.user,
        avatar: avatarSource ?? viewerPlacement.user.avatar ?? null,
        avatarUrl: avatarSource ?? viewerPlacement.user.avatarUrl ?? null,
      },
    };
  }, [viewerPlacement, currentUserId]);

  const currentUserEntry = useMemo(() => {
    const fromTopEntries = normalizedEntries.find((entry) => entry.user.id === currentUserId);
    const candidate = fromTopEntries ?? viewerEntry ?? null;

    if (!candidate) return null;

    const avatarSource = getAvatarSource(candidate.user);
    return {
      ...candidate,
      user: {
        ...candidate.user,
        avatar: avatarSource ?? candidate.user.avatar ?? null,
        avatarUrl: avatarSource ?? candidate.user.avatarUrl ?? null,
      },
    };
  }, [normalizedEntries, currentUserId, viewerEntry]);

  const baseDisplayedEntries = useMemo(() => normalizedEntries.slice(0, TOP_LIMIT), [normalizedEntries]);

  const displayedEntries = useMemo(() => {
    if (!currentUserEntry) {
      return baseDisplayedEntries;
    }

  const alreadyIncluded = baseDisplayedEntries.some((entry) => entry.user.id === currentUserEntry.user.id);
    if (alreadyIncluded) {
      return baseDisplayedEntries.map((entry) =>
        entry.user.id === currentUserEntry.user.id
          ? { ...entry, user: { ...entry.user, avatar: currentUserEntry.user.avatar, avatarUrl: currentUserEntry.user.avatarUrl } }
          : entry
      );
    }

    return [...baseDisplayedEntries, currentUserEntry];
  }, [baseDisplayedEntries, currentUserEntry]);

  const { podiumEntries, listEntries, hasPodium } = useMemo(() => {
    const hasFullPodium = displayedEntries.length >= 4;
    return {
      podiumEntries: hasFullPodium ? displayedEntries.slice(0, 3) : [],
      listEntries: displayedEntries.slice(hasFullPodium ? 3 : 0),
      hasPodium: hasFullPodium,
    };
  }, [displayedEntries]);

  const isCurrentUserInDisplayed = currentUserEntry
    ? displayedEntries.some((entry) => entry.user.id === currentUserEntry.user.id)
    : false;

  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [metric, timeframe, tier, normalizedEntries.length]);

  const totalPages = Math.max(1, Math.ceil(listEntries.length / PAGE_SIZE));

  const paginationPages = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, idx) => idx);
    }

    const pages = new Set<number>([0, totalPages - 1]);
    for (let offset = -1; offset <= 1; offset += 1) {
      const candidate = pageIndex + offset;
      if (candidate > 0 && candidate < totalPages - 1) {
        pages.add(candidate);
      }
    }

    if (pageIndex <= 2) {
      pages.add(1);
      pages.add(2);
    }

    if (pageIndex >= totalPages - 3) {
      pages.add(totalPages - 2);
      pages.add(totalPages - 3);
    }

    return Array.from(pages).sort((a, b) => a - b);
  }, [totalPages, pageIndex]);

  useEffect(() => {
    if (pageIndex > totalPages - 1) {
      setPageIndex(totalPages - 1);
    }
  }, [pageIndex, totalPages]);

  const pagedListEntries = useMemo(() => {
    if (!listEntries.length) return [];
    const start = pageIndex * PAGE_SIZE;
    return listEntries.slice(start, start + PAGE_SIZE);
  }, [listEntries, pageIndex]);

  const listStartRank = listEntries.length
    ? hasPodium
      ? (podiumEntries[podiumEntries.length - 1]?.rank ?? 0) + 1
      : listEntries[0]?.rank ?? 0
    : 0;

  const pageStartRank = pagedListEntries.length ? pagedListEntries[0]?.rank ?? listStartRank : listStartRank;
  const pageEndRank = pagedListEntries.length
    ? pagedListEntries[pagedListEntries.length - 1]?.rank ?? pageStartRank
    : pageStartRank;

  const renderPodiumCard = (entry: LeaderboardEntry) => {
    const isCurrentUser = entry.user.id === currentUserId;
    const avatarSource = getAvatarSource(entry.user);
    const preparedEntry = avatarSource
      ? {
          ...entry,
          user: {
            ...entry.user,
            avatar: avatarSource,
            avatarUrl: avatarSource,
          },
        }
      : entry;

    return (
      <TopPerformerCard
        key={entry.user.id}
        entry={preparedEntry}
        isCurrentUser={isCurrentUser}
        isPremiumUser={isPremiumUser}
        onAvatarError={handleAvatarError}
        sidebarState={sidebarState}
      />
    );
  };

  const renderListRow = (entry: LeaderboardEntry) => {
    const isCurrentUser = entry.user.id === currentUserId;
    const initials = getInitials(entry.user.name);
    const avatarSrc = getAvatarSource(entry.user);

    // Rank styling logic
    const isTop3 = entry.rank <= 3;
    const rankColor = entry.rank === 1 ? 'text-yellow-500 font-black' : entry.rank === 2 ? 'text-slate-400 font-bold' : entry.rank === 3 ? 'text-amber-600 font-bold' : 'text-slate-400 font-medium';

    return (
      <div
        key={entry.user.id}
        className={cn(
          'group relative flex w-full items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/50 px-4 py-3.5 text-sm shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_20px_rgb(0,0,0,0.06)] dark:border-emerald-500/20 dark:bg-[#050C14]/40 dark:shadow-none dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]',
          isCurrentUser && 'border-emerald-400/50 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/40 dark:to-teal-900/20 ring-1 ring-emerald-500/20 shadow-[0_4px_15px_rgba(16,185,129,0.1)]'
        )}
      >
        {isCurrentUser && (
          <div className="absolute -left-[1px] top-[10%] bottom-[10%] w-[3px] rounded-r-md bg-emerald-500"></div>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="w-10 shrink-0 text-center flex items-center justify-center">
            {isTop3 ? (
              <div className={cn("flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 shadow-sm border", 
                entry.rank === 1 ? "border-yellow-200 text-yellow-500 shadow-yellow-500/20" : 
                entry.rank === 2 ? "border-slate-200 text-slate-400" : "border-amber-200 text-amber-600"
              )}>
                <span className="text-xs font-bold">{entry.rank}</span>
              </div>
            ) : (
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">#{entry.rank}</span>
            )}
          </div>
          <Avatar
            className={cn(
              'h-11 w-11 shrink-0 rounded-full border-2 border-white/80 bg-slate-50/70 text-sm font-semibold shadow-sm transition-shadow dark:border-emerald-500/20 dark:bg-[#050C14] group-hover:shadow-md group-hover:border-slate-200 dark:group-hover:border-emerald-500/40',
              isCurrentUser && 'border-emerald-200 dark:border-emerald-700/60 ring-2 ring-emerald-400/30'
            )}
          >
            <AvatarImage src={avatarSrc} alt={entry.user.name} onError={handleAvatarError} />
            <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 ml-1">
            <p className={cn("truncate font-bold transition-colors", isCurrentUser ? "text-emerald-700 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400")}>
              {entry.user.name}
            </p>
            <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400/80">@{entry.user.username || 'anonymous'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-5 text-right">
          <div className="flex flex-col items-end">
            <span className="text-[14px] font-black tracking-tight text-slate-900 dark:text-white">
              {Math.round(entry.metricValue ?? 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Points</span>
          </div>
          <div className="hidden sm:flex flex-col items-end w-12">
            <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(entry.progress.accuracy.overall ?? 0)}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Acc</span>
          </div>
        </div>
      </div>
    );
  };

  const renderUserPlacementCard = () => {
    if (!currentUserEntry) {
      return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100/80 to-white/50 border border-slate-200/60 px-6 py-6 shadow-sm backdrop-blur-sm dark:border-emerald-500/20 dark:from-[#050C14]/80 dark:to-[#050C14]/50">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 text-center">
            We haven’t captured your rank just yet. Complete a few activities and check back soon!
          </p>
        </div>
      );
    }

    const initials = getInitials(currentUserEntry.user.name);
    const avatarSrc = getAvatarSource(currentUserEntry.user);

    return (
      <div className="relative overflow-hidden w-full rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-400/5 to-transparent border border-emerald-500/20 p-5 lg:p-6 shadow-[0_8px_30px_rgb(16,185,129,0.06)] backdrop-blur-md dark:border-emerald-500/10 dark:bg-gradient-to-r dark:from-emerald-900/30 dark:via-teal-900/10">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-400/20 rounded-full blur-[50px] pointer-events-none" />
        
        <div className="relative w-full z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-4">
          <div className="flex flex-row items-center gap-4 sm:gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/60 dark:bg-[#050C14]/60 shadow-sm border border-white/80 dark:border-emerald-500/20 min-w-[60px] sm:min-w-[70px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5 sm:mb-1">Rank</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-none">#{currentUserEntry.rank}</span>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <Avatar
                className={cn(
                  'h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-white/80 bg-slate-50/70 shadow-md ring-4 ring-emerald-400/20 transition-all hover:scale-105 dark:border-emerald-500/20 dark:bg-[#050C14]/40 dark:ring-emerald-500/20'
                )}
              >
                <AvatarImage src={avatarSrc} alt={currentUserEntry.user.name} onError={handleAvatarError} />
                <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200 font-bold text-base sm:text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-white">{currentUserEntry.user.name}</p>
                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                  <Badge className="rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 sm:px-2.5 text-[9px] sm:text-[10px] font-bold hover:bg-emerald-200">You</Badge>
                  <p className="truncate text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">@{currentUserEntry.user.username || 'anonymous'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between sm:justify-end gap-4 sm:gap-6 bg-white/40 dark:bg-[#050C14]/40 rounded-2xl p-3 px-5 border border-white/50 dark:border-emerald-500/20 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accuracy</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Target className="h-4 w-4 text-emerald-500" />
                <span className="text-[15px] font-bold text-slate-900 dark:text-white">{Math.round(currentUserEntry.progress.accuracy.overall ?? 0)}%</span>
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200/50 dark:bg-emerald-500/20"></div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Score</span>
              <p className="text-[18px] font-black tracking-tight text-slate-900 dark:text-white leading-none mt-1">{Math.round(currentUserEntry.metricValue ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#F9FDFB] to-white dark:bg-[#050C14] dark:bg-none rounded-[2rem] lg:rounded-[2.5rem] border border-slate-100/60 dark:border-emerald-500/20 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.35)] dark:shadow-none overflow-hidden flex flex-col p-5 md:p-8 xl:p-10 transition-all duration-500">
      {/* Background Orbs */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[40%] -left-20 w-48 h-48 bg-teal-300/10 dark:bg-teal-500/10 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex shrink-0 h-[60px] w-[60px] items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#F59E0B] to-[#D97706] shadow-[0_10px_25px_rgba(245,158,11,0.35)] dark:shadow-[0_10px_25px_rgba(245,158,11,0.2)] text-white overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 dark:bg-black/10 mix-blend-overlay"></div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/40 blur-[12px] rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <Trophy className="h-8 w-8 relative z-10 drop-shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300" strokeWidth={1.5} />
            <Sparkles className="absolute top-2 right-2 h-3 w-3 text-yellow-100 animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D97706] dark:text-amber-400 mb-1.5 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Global Leaderboard</span>
            </p>
            <h3 className="text-[22px] sm:text-[26px] font-black tracking-tight text-slate-900 dark:text-white leading-none truncate">Top Performers</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-start md:justify-end">
          <Select value={metric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-full sm:w-[140px] flex-1 sm:flex-none h-[42px] rounded-xl border border-slate-200/60 bg-white/80 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-slate-300 focus:ring-amber-500/20 dark:border-emerald-500/20 dark:bg-[#050C14]/80 dark:text-slate-200 dark:hover:bg-[#050C14]">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-emerald-500/20 dark:bg-[#050C14] shadow-xl">
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={(value) => onTimeframeChange(value as LeaderboardTimeframeValue)}>
            <SelectTrigger className="w-full sm:w-[120px] flex-1 sm:flex-none h-[42px] rounded-xl border border-slate-200/60 bg-white/80 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-slate-300 focus:ring-amber-500/20 dark:border-emerald-500/20 dark:bg-[#050C14]/80 dark:text-slate-200 dark:hover:bg-[#050C14]">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-emerald-500/20 dark:bg-[#050C14] shadow-xl">
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tier} onValueChange={(value) => onTierChange(value as LeaderboardTierValue)}>
            <SelectTrigger className="w-full sm:w-[110px] flex-1 sm:flex-none h-[42px] rounded-xl border border-slate-200/60 bg-white/80 text-[13px] font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-slate-300 focus:ring-amber-500/20 dark:border-emerald-500/20 dark:bg-[#050C14]/80 dark:text-slate-200 dark:hover:bg-[#050C14]">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200 dark:border-emerald-500/20 dark:bg-[#050C14]">
              {tierOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="font-medium cursor-pointer rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div className="relative z-10 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {renderUserPlacementCard()}
      </motion.div>

      <div className="relative z-10 flex flex-1 flex-col">
        {!displayedEntries.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
            <Medal className="h-8 w-8 text-emerald-400/70" />
            <p>No leaderboard data available yet.</p>
            <p>Start practicing to see rankings populate.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-7 lg:gap-8">
            {hasPodium && podiumEntries.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Medal className="h-4 w-4 text-emerald-500" />
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Podium Finishes</span>
                </div>
                <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                  {podiumEntries.map((entry) => renderPodiumCard(entry))}
                </div>
              </div>
            )}

            {listEntries.length > 0 && (
              <div className="flex flex-1 flex-col gap-4 mt-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      {hasPodium ? `Ranks #${pageStartRank} – #${pageEndRank}` : `Global rankings`}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col w-full space-y-2.5 lg:space-y-3">
                  {pagedListEntries.map((entry) => renderListRow(entry))}
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <button
                      type="button"
                      onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                      disabled={pageIndex === 0}
                      className={cn(
                        'rounded-lg border px-3 py-1 font-medium transition-colors',
                        pageIndex === 0
                          ? 'cursor-not-allowed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-600'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white'
                      )}
                    >
                      Previous
                    </button>
                    <div className="flex items-center gap-2">
                      {paginationPages.map((page, idx) => {
                        const previousPage = paginationPages[idx - 1];
                        const showEllipsis = idx > 0 && page - previousPage > 1;
                        const isActive = page === pageIndex;

                        return (
                          <React.Fragment key={`fragment-${page}`}>
                            {showEllipsis && (
                              <span className="px-1 text-slate-400 dark:text-slate-600">…</span>
                            )}
                            <button
                              type="button"
                              onClick={() => setPageIndex(page)}
                              className={cn(
                                'h-8 w-8 rounded-full text-xs font-semibold transition-colors',
                                isActive
                                  ? 'bg-emerald-500 text-white'
                                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                              )}
                            >
                              {page + 1}
                            </button>
                          </React.Fragment>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
                      disabled={pageIndex >= totalPages - 1}
                      className={cn(
                        'rounded-lg border px-3 py-1 font-medium transition-colors',
                        pageIndex >= totalPages - 1
                          ? 'cursor-not-allowed border-slate-200 text-slate-300 dark:border-slate-800 dark:text-slate-600'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:text-white'
                      )}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export type { LeaderboardTierValue, LeaderboardTimeframeValue };
export default LeaderboardCard;
