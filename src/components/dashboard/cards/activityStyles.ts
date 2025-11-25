// Shared activity style helper used across dashboard components
// import { activityConfig as _unused } from './ActivityCard';

// Note: activityConfig is duplicated here to avoid circular imports and to keep ActivityCard as a pure component file.
type ActivityType =
  | 'lesson'
  | 'practice'
  | 'achievement'
  | 'room'
  | 'voice'
  | 'default';

type ActivityTheme = {
  icon: string;
  bg: string;
  iconColor: string;
  borderHover: string;
  dot: string;
};

const activityConfig: Record<ActivityType, ActivityTheme> = {
  lesson: {
    icon: 'BookOpen',
    bg: 'bg-emerald-50 dark:bg-emerald-900/10',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    borderHover: 'group-hover:border-emerald-200 dark:group-hover:border-emerald-800',
    dot: 'bg-emerald-500'
  },
  practice: {
    icon: 'MessageSquare',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderHover: 'group-hover:border-blue-200 dark:group-hover:border-blue-800',
    dot: 'bg-blue-500'
  },
  achievement: {
    icon: 'Trophy',
    bg: 'bg-amber-50 dark:bg-amber-900/10',
    iconColor: 'text-amber-600 dark:text-amber-400',
    borderHover: 'group-hover:border-amber-200 dark:group-hover:border-amber-800',
    dot: 'bg-amber-500'
  },
  room: {
    icon: 'Users',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
    borderHover: 'group-hover:border-purple-200 dark:group-hover:border-purple-800',
    dot: 'bg-purple-500'
  },
  voice: {
    icon: 'Mic',
    bg: 'bg-pink-50 dark:bg-pink-900/10',
    iconColor: 'text-pink-600 dark:text-pink-400',
    borderHover: 'group-hover:border-pink-200 dark:group-hover:border-pink-800',
    dot: 'bg-pink-500'
  },
  default: {
    icon: 'Circle',
    bg: 'bg-slate-50 dark:bg-slate-900/10',
    iconColor: 'text-slate-600 dark:text-slate-400',
    borderHover: 'group-hover:border-slate-200 dark:group-hover:border-slate-700',
    dot: 'bg-slate-400'
  }
};

export const getActivityStyle = (type: string | undefined) => {
  const key = (type || 'default').toLowerCase();
  const theme = activityConfig[key as ActivityType] || activityConfig.default;

  return {
    iconBg: `bg-gradient-to-br ${theme.bg.replace('bg-', 'from-')} ${theme.iconColor}`,
    textColor: theme.iconColor,
    bgColor: theme.bg,
    gradient: `from-${(theme.iconColor || '').split('-')[1] || 'emerald'}-500 to-teal-500`
  };
};
