import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Target, Clock, Zap } from 'lucide-react';
import type { LeaderboardEntry } from '@/services/analyticsService';
import { cn } from '@/lib/utils';
import { getInitials } from './leaderboardUtils';

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

// Same robust avatar resolution as before
const resolveAvatarValue = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value.trim() === '' ? undefined : value;
  if (typeof value === 'object' && value !== null) {
    const candidate =
      (value as Record<string, unknown>).url ||
      (value as Record<string, unknown>).secureUrl ||
      (value as Record<string, unknown>).secure_url ||
      (value as Record<string, unknown>).path ||
      (value as Record<string, unknown>).avatarUrl ||
      (value as Record<string, unknown>).href;
    if (typeof candidate === 'string' && candidate.trim() !== '') return candidate;
  }
  return undefined;
};

const getAvatarSource = (user: unknown) => {
  if (!user || typeof user !== 'object') return undefined;
  const record = user as Record<string, unknown>;
  const sources = [
    record.avatarUrl, record.avatar, record.profileImage, record.profile_image, record.photoUrl, record.photo_url,
  ];
  for (const value of sources) {
    const resolved = resolveAvatarValue(value);
    if (resolved) return resolved;
  }
  // Check profile/userProfile...
  const checkNested = (nested: unknown) => {
    if (nested && typeof nested === 'object') {
      const keys = ['avatar_url', 'avatarUrl', 'avatar', 'image', 'imageUrl', 'profileImage', 'profile_image'];
      for (const key of keys) {
        const resolved = resolveAvatarValue((nested as Record<string, unknown>)[key]);
        if (resolved) return resolved;
      }
    }
    return undefined;
  };
  const profileRes = checkNested(record.profile);
  if (profileRes) return profileRes;
  const userProfileRes = checkNested(record.userProfile);
  if (userProfileRes) return userProfileRes;
  return undefined;
};

type PremiumRankTheme = {
  container: string;
  avatarRing: string;
  badge: string;
  name: string;
  username: string;
  pointsText: string;
  pointsLabel: string;
  accIcon: string;
};

const rankThemes: Record<number, PremiumRankTheme> & { default: PremiumRankTheme } = {
  1: { // GOLD
    container: 'bg-gradient-to-b from-[#FFFBEB] to-white dark:from-amber-900/20 dark:to-transparent border border-[#FDE68A]/60 dark:border-amber-500/30 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.15)] hover:shadow-[0_8px_25px_-4px_rgba(251,191,36,0.25)]',
    avatarRing: 'ring-[4px] ring-amber-400 dark:ring-amber-500/60 shadow-md',
    badge: 'bg-gradient-to-br from-yellow-300 to-amber-500 text-amber-950 shadow-sm border border-yellow-200/50 dark:border-amber-600',
    name: 'text-amber-950 dark:text-amber-50',
    username: 'text-amber-700/80 dark:text-amber-400/70',
    pointsText: 'text-amber-600 dark:text-amber-400',
    pointsLabel: 'text-amber-500/80 dark:text-amber-400/80',
    accIcon: 'text-amber-500 dark:text-amber-400',
  },
  2: { // SILVER
    container: 'bg-gradient-to-b from-slate-50 to-white dark:from-slate-800/30 dark:to-transparent border border-slate-200/60 dark:border-slate-700/50 shadow-[0_4px_15px_-4px_rgba(148,163,184,0.1)] hover:shadow-[0_8px_20px_-4px_rgba(148,163,184,0.15)]',
    avatarRing: 'ring-[4px] ring-slate-300 dark:ring-slate-500/60 shadow-sm',
    badge: 'bg-gradient-to-br from-slate-200 to-slate-400 text-slate-800 shadow-sm border border-slate-100/50 dark:border-slate-500',
    name: 'text-slate-900 dark:text-slate-50',
    username: 'text-slate-500 dark:text-slate-400',
    pointsText: 'text-slate-700 dark:text-slate-300',
    pointsLabel: 'text-slate-500 dark:text-slate-400',
    accIcon: 'text-slate-400 dark:text-slate-500',
  },
  3: { // BRONZE
    container: 'bg-gradient-to-b from-orange-50 to-white dark:from-orange-900/20 dark:to-transparent border border-orange-200/60 dark:border-orange-800/30 shadow-[0_4px_15px_-4px_rgba(249,115,22,0.1)] hover:shadow-[0_8px_20px_-4px_rgba(249,115,22,0.15)]',
    avatarRing: 'ring-[4px] ring-orange-400/80 dark:ring-orange-600/60 shadow-sm',
    badge: 'bg-gradient-to-br from-orange-300 to-amber-600 text-orange-950 shadow-sm border border-orange-200/50 dark:border-orange-700',
    name: 'text-orange-950 dark:text-orange-50',
    username: 'text-orange-700/80 dark:text-orange-400/70',
    pointsText: 'text-orange-600 dark:text-orange-400',
    pointsLabel: 'text-orange-500/80 dark:text-orange-400/80',
    accIcon: 'text-orange-500 dark:text-orange-400',
  },
  default: {
    container: 'bg-white dark:bg-[#050C14]/50 border border-slate-100 dark:border-emerald-500/20 shadow-sm hover:shadow-md dark:shadow-none',
    avatarRing: 'ring-2 ring-slate-200 dark:ring-emerald-500/40',
    badge: 'bg-slate-500 dark:bg-emerald-600 text-white',
    name: 'text-slate-900 dark:text-white',
    username: 'text-slate-500 dark:text-slate-400',
    pointsText: 'text-slate-700 dark:text-slate-300',
    pointsLabel: 'text-slate-500 dark:text-slate-400',
    accIcon: 'text-slate-400 dark:text-slate-500',
  },
};

interface TopPerformerCardProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  isPremiumUser: boolean;
  onAvatarError: React.ReactEventHandler<HTMLImageElement>;
  sidebarState?: 'expanded' | 'collapsed';
}

export const TopPerformerCard: React.FC<TopPerformerCardProps> = ({
  entry,
  isCurrentUser,
  isPremiumUser,
  onAvatarError,
  sidebarState = 'expanded',
}) => {
  const theme = rankThemes[entry.rank] ?? rankThemes.default;
  const avatarSrc = getAvatarSource(entry.user);
  const initials = getInitials(entry.user.name);
  const lastActiveLabel = formatRelativeTime(entry.analytics.lastActiveAgo ?? entry.lastActive ?? undefined);
  const accuracy = Math.round(entry.progress.accuracy.overall ?? entry.metricValue ?? 0);
  const points = Math.round(entry.metricValue ?? 0);
  
  const momentumLabel = isPremiumUser && typeof entry.progress.tierLevel === 'number'
    ? `Tier ${entry.progress.tierLevel}`
    : 'Growing';

  return (
    <div
      className={cn(
        'w-full rounded-[24px] p-4 sm:p-5 lg:p-6 transition-all duration-300 relative overflow-hidden flex flex-row sm:flex-col items-center sm:text-center justify-between sm:justify-center gap-4 sm:gap-0',
        theme.container,
        isCurrentUser && 'ring-2 ring-emerald-500/50 dark:ring-emerald-500/30'
      )}
    >
      {/* Optional shiny overlay for top 3 */}
      {entry.rank <= 3 && (
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 dark:from-white/0 dark:via-white/5 dark:to-white/0 pointer-events-none translate-x-[-100%] animate-[shimmer_3s_infinite]" />
      )}

      {/* Left side on mobile: Avatar + Name */}
      <div className="flex flex-row sm:flex-col items-center sm:justify-center gap-3 sm:gap-0 flex-1 sm:flex-auto min-w-0">
        {/* Left side on mobile: Avatar + Name */}
        <div className="flex items-center gap-3 sm:flex-col w-full min-w-0">
          <div className="relative mb-0 sm:mb-3.5 shrink-0">
            <Avatar className={cn('h-14 w-14 sm:h-16 sm:w-16 lg:h-[72px] lg:w-[72px] rounded-full', theme.avatarRing)}>
              <AvatarImage src={avatarSrc} alt={entry.user.name} onError={onAvatarError} />
              <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-[#050C14] dark:text-slate-300 font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span
              className={cn(
                'absolute -bottom-2.5 left-1/2 -translate-x-1/2 inline-flex h-6 min-w-[26px] items-center justify-center rounded-full px-2.5 text-[12px] font-black tracking-tight',
                theme.badge
              )}
            >
              #{entry.rank}
            </span>
          </div>

          <div className="flex flex-col justify-between items-start sm:items-center min-w-0 w-full px-0 sm:px-1 text-left sm:text-center flex-1 h-[48px] sm:h-auto sm:mb-2 pt-0.5 sm:pt-0">
            <p className={cn('truncate text-[15px] sm:text-[17px] font-black leading-tight', theme.name)}>
              {entry.user.name}
            </p>
            
            <div className="flex items-center gap-2 sm:gap-3 justify-start sm:justify-center flex-wrap w-full">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-[13px] font-bold text-slate-600 dark:text-slate-300">
                <Target className={cn('w-3 sm:w-3.5 h-3 sm:h-3.5', theme.accIcon)} />
                <span>{accuracy}% acc</span>
              </div>
              {entry.rank <= 3 && (
                 <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                   <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-emerald-500/20" />
                   {momentumLabel}
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side on mobile: Points */}
      <div className="flex flex-col items-end sm:items-center justify-center shrink-0 w-auto sm:w-full mt-0 sm:mt-1">
          <div className="flex items-baseline gap-1">
            <span className={cn('text-[18px] sm:text-[24px] lg:text-[26px] font-black tracking-tight leading-none', theme.pointsText)}>
              {points.toLocaleString()}
            </span>
            <span className={cn('text-[9px] sm:text-[11px] font-bold uppercase tracking-widest', theme.pointsLabel)}>pts</span>
          </div>
      </div>
      </div>
  );
};

export default TopPerformerCard;
