import React, { useMemo, useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Medal, Target, Sparkles } from 'lucide-react';
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

    return (
      <div
        key={entry.user.id}
        className={cn(
          'flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm dark:border-slate-800 dark:bg-slate-950',
          isCurrentUser && 'border-emerald-400 bg-emerald-50/60 dark:border-emerald-400/60 dark:bg-emerald-900/20'
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="w-10 text-right text-xs font-semibold text-slate-400">#{entry.rank}</span>
          <Avatar
            className={cn(
              'h-11 w-11 rounded-2xl border border-slate-200/70 bg-slate-50/70 text-sm font-semibold shadow-sm ring-1 ring-slate-200/60 transition-shadow dark:border-slate-800/60 dark:bg-slate-900/40 dark:ring-slate-800/60',
              isCurrentUser && 'ring-emerald-400/70 dark:ring-emerald-500/60'
            )}
          >
            <AvatarImage src={avatarSrc} alt={entry.user.name} onError={handleAvatarError} />
            <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-white">{entry.user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">@{entry.user.username || 'anonymous'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">
            {Math.round(entry.metricValue ?? 0)} pts
          </span>
          <span>{Math.round(entry.progress.accuracy.overall ?? 0)}%</span>
        </div>
      </div>
    );
  };

  const renderUserPlacementCard = () => {
    if (!currentUserEntry) {
      return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            We haven’t captured your rank just yet. Complete a few activities and check back soon.
          </p>
        </div>
      );
    }

    const initials = getInitials(currentUserEntry.user.name);
    const avatarSrc = getAvatarSource(currentUserEntry.user);

    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Badge className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white">Your rank</Badge>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">#{currentUserEntry.rank}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Target className="h-3.5 w-3.5" />
            {Math.round(currentUserEntry.progress.accuracy.overall ?? 0)}% accuracy
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Avatar
            className={cn(
              'h-11 w-11 rounded-2xl border border-slate-200/70 bg-slate-50/70 text-sm font-semibold shadow-sm ring-2 ring-emerald-400/70 transition-shadow dark:border-slate-800/60 dark:bg-slate-900/40 dark:ring-emerald-500/60'
            )}
          >
            <AvatarImage src={avatarSrc} alt={currentUserEntry.user.name} onError={handleAvatarError} />
            <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{currentUserEntry.user.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">@{currentUserEntry.user.username || 'anonymous'}</p>
          </div>
          <div className="ml-auto text-right text-xs text-slate-500 dark:text-slate-400">
            <p className="font-semibold text-slate-900 dark:text-white">{Math.round(currentUserEntry.metricValue ?? 0)} pts</p>
            {!isCurrentUserInDisplayed && (
              <p className="mt-1 text-xs">Outside top {TOP_LIMIT} • keep pushing!</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnalyticsCardShell
      accent="slate"
      className="h-full"
      contentClassName="flex h-full w-full flex-col gap-6 p-6 md:p-7 xl:p-9 xl:pb-12"
      showOrbs={false}
    >
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900 dark:bg-slate-100/10 dark:text-slate-100">
            <Medal className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Leaderboard</p>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Global accuracy rankings</h3>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={metric} onValueChange={onMetricChange}>
            <SelectTrigger className="w-36 rounded-lg border border-slate-200 bg-white text-sm font-medium dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeframe} onValueChange={(value) => onTimeframeChange(value as LeaderboardTimeframeValue)}>
            <SelectTrigger className="w-28 rounded-lg border border-slate-200 bg-white text-sm font-medium dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              {timeframeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={tier} onValueChange={(value) => onTierChange(value as LeaderboardTierValue)}>
            <SelectTrigger className="w-28 rounded-lg border border-slate-200 bg-white text-sm font-medium dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              {tierOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        {renderUserPlacementCard()}
      </motion.div>

      <div className="flex flex-1 flex-col">
        {!displayedEntries.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
            <Medal className="h-8 w-8 text-emerald-400/70" />
            <p>No leaderboard data available yet.</p>
            <p>Start practicing to see rankings populate.</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-7 lg:gap-8">
            {hasPodium && podiumEntries.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <Medal className="h-4 w-4 text-emerald-500" />
                  Top performers
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {podiumEntries.map((entry) => renderPodiumCard(entry))}
                </div>
              </div>
            )}

            {listEntries.length > 0 && (
              <div className="flex flex-1 flex-col gap-4 lg:gap-5">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <Sparkles className="h-4 w-4 text-emerald-500" />
                  {hasPodium ? (
                    <>Global rankings #{pageStartRank} – #{pageEndRank}</>
                  ) : (
                    <>Global rankings</>
                  )}
                </div>
                <div className="space-y-2.5 lg:space-y-3">
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
    </AnalyticsCardShell>
  );
};

export type { LeaderboardTierValue, LeaderboardTimeframeValue };
export default LeaderboardCard;
