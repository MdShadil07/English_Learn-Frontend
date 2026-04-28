import { cn } from '../../../lib/utils';

interface ControlButtonProps {
  onClick(e?: React.MouseEvent<HTMLButtonElement>): void;
  active: boolean;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
  variant?: 'default' | 'danger' | 'warn';
  badge?: number;
}

const ControlButton = ({
  onClick,
  active,
  activeIcon,
  inactiveIcon,
  label,
  variant = 'default',
  badge,
}: ControlButtonProps) => {
  const styles = {
    default: {
      on: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
      off: 'bg-slate-800/80 text-slate-400 border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/80',
    },
    danger: {
      on: 'bg-red-500/20 text-red-400 border-red-500/30',
      off: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20',
    },
    warn: {
      on: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      off: 'bg-slate-800/80 text-slate-400 border-slate-700/50 hover:bg-slate-700/80',
    },
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1 px-1.5 py-2 sm:px-3 sm:py-2.5 rounded-lg sm:rounded-xl border font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]',
        active ? styles[variant].on : styles[variant].off,
      )}
      title={label}
    >
      {active ? activeIcon : inactiveIcon}
      <span className="text-[10px] font-semibold hidden sm:block leading-none">{label}</span>
      {badge !== undefined && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold px-1 shadow-sm">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
};

export default ControlButton;
