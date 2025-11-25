import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Target, Clock } from 'lucide-react';
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

type RankTheme = {
  container: string;
  currentUserRing: string;
  avatarBorder: string;
  avatarRing: string;
  avatarCurrentUserRing: string;
  avatarFallback: string;
  badge: string;
  label: string;
  pointsChip: string;
  pointsLabel: string;
  accuracyChip: string;
  accuracyLabel: string;
  metricAccent: string;
  accentIcon: string;
};

const rankThemes: Record<number, RankTheme> & { default: RankTheme } = {
  1: {
    container: 'border-emerald-200/70 dark:border-emerald-700/60',
    currentUserRing: 'ring-2 ring-emerald-400/70 dark:ring-emerald-500/70',
    avatarBorder: 'border-emerald-200/70 dark:border-emerald-800/50',
    avatarRing: 'ring-emerald-100 dark:ring-emerald-800/40',
    avatarCurrentUserRing: 'ring-emerald-400/80 dark:ring-emerald-500/70',
    avatarFallback: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-100',
    badge: 'bg-emerald-500',
    label: 'text-emerald-600 dark:text-emerald-300',
    pointsChip: 'border-emerald-200/60 bg-emerald-50/80 text-emerald-600 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200',
    pointsLabel: 'text-emerald-500/80 dark:text-emerald-200/80',
    accuracyChip: 'border-sky-200/60 bg-sky-50/80 text-sky-600 dark:border-sky-800/60 dark:bg-sky-900/35 dark:text-sky-200',
    accuracyLabel: 'text-sky-500/80 dark:text-sky-200/80',
    metricAccent: 'border-emerald-200/60 dark:border-emerald-800/50',
    accentIcon: 'text-emerald-500',
  },
  2: {
    container: 'border-sky-200/70 dark:border-sky-800/60',
    currentUserRing: 'ring-2 ring-sky-400/70 dark:ring-sky-500/70',
    avatarBorder: 'border-sky-200/70 dark:border-sky-800/50',
    avatarRing: 'ring-sky-100 dark:ring-sky-800/40',
    avatarCurrentUserRing: 'ring-sky-400/80 dark:ring-sky-500/70',
    avatarFallback: 'bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100',
    badge: 'bg-sky-500',
    label: 'text-sky-600 dark:text-sky-300',
    pointsChip: 'border-sky-200/60 bg-sky-50/80 text-sky-600 dark:border-sky-800/60 dark:bg-sky-900/30 dark:text-sky-200',
    pointsLabel: 'text-sky-500/80 dark:text-sky-200/80',
    accuracyChip: 'border-amber-200/60 bg-amber-50/80 text-amber-600 dark:border-amber-800/60 dark:bg-amber-900/35 dark:text-amber-200',
    accuracyLabel: 'text-amber-500/80 dark:text-amber-200/80',
    metricAccent: 'border-sky-200/60 dark:border-sky-800/50',
    accentIcon: 'text-sky-500',
  },
  3: {
    container: 'border-amber-200/70 dark:border-amber-800/60',
    currentUserRing: 'ring-2 ring-amber-400/70 dark:ring-amber-500/70',
    avatarBorder: 'border-amber-200/70 dark:border-amber-800/50',
    avatarRing: 'ring-amber-100 dark:ring-amber-800/40',
    avatarCurrentUserRing: 'ring-amber-400/80 dark:ring-amber-500/70',
    avatarFallback: 'bg-amber-100 text-amber-700 dark:bg-amber-800 dark:text-amber-100',
    badge: 'bg-amber-500',
    label: 'text-amber-600 dark:text-amber-300',
    pointsChip: 'border-amber-200/60 bg-amber-50/80 text-amber-600 dark:border-amber-800/60 dark:bg-amber-900/30 dark:text-amber-200',
    pointsLabel: 'text-amber-500/80 dark:text-amber-200/80',
    accuracyChip: 'border-sky-200/60 bg-sky-50/80 text-sky-600 dark:border-sky-800/60 dark:bg-sky-900/35 dark:text-sky-200',
    accuracyLabel: 'text-sky-500/80 dark:text-sky-200/80',
    metricAccent: 'border-amber-200/60 dark:border-amber-800/50',
    accentIcon: 'text-amber-500',
  },
  default: {
    container: 'border-slate-200/70 dark:border-slate-800/60',
    currentUserRing: 'ring-2 ring-slate-400/70 dark:ring-slate-500/70',
    avatarBorder: 'border-slate-200/70 dark:border-slate-800/50',
    avatarRing: 'ring-slate-100 dark:ring-slate-800/40',
    avatarCurrentUserRing: 'ring-slate-400/80 dark:ring-slate-500/70',
    avatarFallback: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-100',
    badge: 'bg-slate-500',
    label: 'text-slate-600 dark:text-slate-300',
    pointsChip: 'border-slate-200/60 bg-slate-100/80 text-slate-700 dark:border-slate-800/60 dark:bg-slate-900/30 dark:text-slate-200',
    pointsLabel: 'text-slate-500/80 dark:text-slate-300/80',
    accuracyChip: 'border-sky-200/60 bg-sky-50/80 text-sky-600 dark:border-sky-800/60 dark:bg-sky-900/35 dark:text-sky-200',
    accuracyLabel: 'text-sky-500/80 dark:text-sky-200/80',
    metricAccent: 'border-slate-200/60 dark:border-slate-800/50',
    accentIcon: 'text-slate-500',
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
  const avatarSrc = entry.user.avatarUrl ?? entry.user.avatar ?? undefined;
  const initials = getInitials(entry.user.name);
  const lastActiveLabel = formatRelativeTime(entry.analytics.lastActiveAgo ?? entry.lastActive ?? undefined);
  const accuracy = Math.round(entry.progress.accuracy.overall ?? entry.metricValue ?? 0);
  const points = Math.round(entry.metricValue ?? 0);
  const momentumLabel =
    isPremiumUser && typeof entry.progress.tierLevel === 'number'
      ? `Tier ${entry.progress.tierLevel}`
      : 'Consistent growth';
  const isSidebarExpanded = sidebarState === 'expanded';

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white p-4 shadow-sm transition-colors dark:bg-slate-950 md:p-5',
        isSidebarExpanded ? 'lg:p-4 xl:p-[18px]' : 'lg:p-5 xl:p-6',
        theme.container,
        isCurrentUser && theme.currentUserRing
      )}
    >
      <div className="flex flex-col gap-4">
        <div className={cn('flex flex-wrap items-start justify-between gap-4', isSidebarExpanded && 'lg:gap-3 xl:gap-2.5')}>
          <div className="flex items-start gap-4">
            <div className="relative inline-flex">
              <Avatar
                className={cn(
                  'h-14 w-14 rounded-3xl border bg-white text-base font-semibold shadow-md ring-1 transition-transform dark:bg-slate-900 max-[1280px]:h-12 max-[1280px]:w-12 max-[1280px]:text-sm max-[1100px]:h-10 max-[1100px]:w-10 max-[1100px]:text-xs max-[900px]:h-9 max-[900px]:w-9 max-[900px]:text-[11px]',
                  isSidebarExpanded ? 'lg:h-12 lg:w-12 lg:text-sm xl:h-11 xl:w-11 xl:text-xs' : 'lg:h-14 lg:w-14 lg:text-base xl:h-[60px] xl:w-[60px] xl:text-sm',
                  theme.avatarBorder,
                  theme.avatarRing,
                  isCurrentUser && theme.avatarCurrentUserRing,
                  isCurrentUser && 'scale-[1.02]'
                )}
              >
                <AvatarImage src={avatarSrc} alt={entry.user.name} onError={onAvatarError} />
                <AvatarFallback className={theme.avatarFallback}>{initials}</AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  'absolute -left-2 -top-2 inline-flex h-7 min-w-[24px] items-center justify-center rounded-full px-2 text-[10px] font-semibold uppercase tracking-wide text-white shadow-md max-[1100px]:h-6 max-[1100px]:min-w-[22px] max-[1100px]:text-[9px]',
                  isSidebarExpanded && 'lg:-left-1.5 lg:-top-1.5 lg:h-6 lg:min-w-[22px] lg:px-1.5 lg:text-[9px] xl:-left-1.5 xl:-top-1.5 xl:h-5 xl:min-w-[20px] xl:px-1.5 xl:text-[8px]',
                  theme.badge
                )}
              >
                #{entry.rank}
              </span>
            </div>
            <div className="min-w-0 space-y-1 mt-1 md:mt-1.5 lg:mt-2">
              <p className={cn('truncate text-sm font-semibold text-slate-900 dark:text-white', isSidebarExpanded ? 'lg:text-[13px] xl:text-xs' : 'lg:text-base xl:text-base')}>{entry.user.name}</p>
              <p className={cn('truncate text-[11px] font-medium text-slate-400/80 dark:text-slate-400/80', isSidebarExpanded ? 'lg:text-[10px] xl:text-[9px]' : 'lg:text-[11px] xl:text-[11px]')}>
                @{entry.user.username || 'anonymous'}
              </p>
            </div>
          </div>
          <div className={cn('flex w-full flex-wrap items-center justify-end gap-2 md:w-auto', isSidebarExpanded && 'lg:gap-1.5 xl:gap-1')}>
            <div
              className={cn(
                'flex w-full items-center justify-between gap-5 sm:gap-6 lg:gap-7 xl:gap-8',
                isSidebarExpanded && 'lg:gap-7 xl:gap-9'
              )}
            >
              <div
                className={cn(
                  'inline-flex min-w-[80px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold max-[1280px]:min-w-[72px] max-[1280px]:px-2.5 max-[1280px]:text-[11px] max-[1100px]:min-w-[60px] max-[1100px]:px-2 max-[1100px]:text-[10px] max-[900px]:min-w-[56px] max-[900px]:px-1.5 max-[900px]:text-[9px]',
                  isSidebarExpanded && 'lg:min-w-[74px] lg:px-2.5 lg:text-[11px] xl:min-w-[70px] xl:px-2 xl:text-[10px]',
                  theme.pointsChip
                )}
              >
                <span className={cn('text-sm leading-tight max-[1280px]:text-[13px] max-[1100px]:text-[12px] max-[900px]:text-[11px]', isSidebarExpanded && 'lg:text-[13px] xl:text-[12px]')}>{points.toLocaleString()}</span>
                <span className={cn('text-[11px] font-medium uppercase tracking-wide max-[1280px]:text-[10px] max-[1100px]:text-[9px] max-[900px]:text-[8px]', isSidebarExpanded && 'lg:text-[10px] xl:text-[9px]', theme.pointsLabel)}>pts</span>
              </div>
              <div
                className={cn(
                  'inline-flex min-w-[80px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold max-[1280px]:min-w-[72px] max-[1280px]:px-2.5 max-[1280px]:text-[11px] max-[1100px]:min-w-[60px] max-[1100px]:px-2 max-[1100px]:text-[10px] max-[900px]:min-w-[56px] max-[900px]:px-1.5 max-[900px]:text-[9px]',
                  isSidebarExpanded && 'lg:min-w-[74px] lg:px-2.5 lg:text-[11px] xl:min-w-[70px] xl:px-2 xl:text-[10px] lg:-translate-x-1 lg:transform xl:-translate-x-1',
                  theme.accuracyChip
                )}
              >
                <span className={cn('text-[11px] font-medium uppercase tracking-wide max-[1280px]:text-[10px] max-[1100px]:text-[9px] max-[900px]:text-[8px]', isSidebarExpanded && 'lg:text-[10px] xl:text-[9px]')}>Acc</span>
                <span className={cn('text-sm leading-tight max-[1280px]:text-[13px] max-[1100px]:text-[12px] max-[900px]:text-[11px]', isSidebarExpanded && 'lg:text-[13px] xl:text-[12px]', theme.accuracyLabel)}>{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className={cn('flex items-center gap-3 text-[10px] text-slate-600 dark:text-slate-300', isSidebarExpanded && 'lg:gap-2 xl:gap-1.5')}>
          <span className={cn('inline-flex items-center gap-2', isSidebarExpanded && 'lg:gap-1.5')}>
            <div className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-[10px] shadow-sm dark:bg-slate-950/40', isSidebarExpanded && 'lg:h-5 lg:w-5', theme.accentIcon)}>
              <Target className={cn('h-2.5 w-2.5', isSidebarExpanded && 'lg:h-2 lg:w-2')} />
            </div>
            <span className={cn('truncate text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-200', isSidebarExpanded && 'lg:text-[10px] xl:text-[9.5px]')}>{momentumLabel}</span>
          </span>
          <span className={cn('ml-auto inline-flex items-center gap-2', isSidebarExpanded && 'lg:gap-1.5')}>
            <div className={cn('flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-[10px] text-slate-500 shadow-sm dark:bg-slate-950/40', isSidebarExpanded && 'lg:h-5 lg:w-5')}>
              <Clock className={cn('h-2.5 w-2.5', isSidebarExpanded && 'lg:h-2 lg:w-2')} />
            </div>
            <span className={cn('truncate text-[11px] font-medium tracking-wide text-slate-600 dark:text-slate-200', isSidebarExpanded && 'lg:text-[10px] xl:text-[9.5px]')}>{lastActiveLabel}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopPerformerCard;
