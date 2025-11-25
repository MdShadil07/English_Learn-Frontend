import { Logo } from "@/components/Icons/Logo";
import { cn } from "@/lib/utils";

interface TeamSwitcherProps {
  teams: {
    name: string;
    plan: string;
  }[];
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-white/60 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 shadow-sm backdrop-blur-sm">
        <Logo
          size="lg"
          variant="adaptive"
          animated={false}
          sidebarState="expanded"
        />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-500 dark:from-emerald-300 dark:via-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
          CognitoSpeak
        </span>
        <span className="truncate text-xs text-slate-500 dark:text-slate-400">
          AI Learning Platform
        </span>
      </div>
    </div>
  );
}
