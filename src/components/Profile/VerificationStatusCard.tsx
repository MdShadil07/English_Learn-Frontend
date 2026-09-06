import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheck, 
  AlertTriangle,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationStatusCardProps {
  profile: any;
}

export const VerificationStatusCard: React.FC<VerificationStatusCardProps> = ({ profile }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEmailVerified = user?.isEmailVerified;
  const isGoogleLinked = user?.googleAuth?.isLinked;

  // Determine overall verification status
  const isFullyVerified = isEmailVerified && isGoogleLinked;
  const hasAnyVerification = isEmailVerified || isGoogleLinked;

  const handleClick = () => {
    navigate('/edit-profile?section=verification');
  };

  const getStatusConfig = () => {
    if (isFullyVerified) {
      return {
        title: 'Account Secured',
        icon: ShieldCheck,
        gradient: 'from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600',
        shadow: 'shadow-emerald-500/20 dark:shadow-emerald-500/10',
        border: 'border-emerald-200/40 dark:border-emerald-500/10',
        actionText: 'Verified',
        actionColor: 'text-emerald-500 dark:text-emerald-400',
      };
    }
    if (hasAnyVerification) {
      return {
        title: 'Partially Secured',
        icon: AlertTriangle,
        gradient: 'from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600',
        shadow: 'shadow-amber-500/20 dark:shadow-amber-500/10',
        border: 'border-amber-200/40 dark:border-amber-500/10',
        actionText: 'Improve',
        actionColor: 'text-amber-500 dark:text-amber-400',
      };
    }
    return {
      title: 'Action Required',
      icon: ShieldAlert,
      gradient: 'from-rose-400 to-rose-500 dark:from-rose-500 dark:to-rose-600',
      shadow: 'shadow-rose-500/20 dark:shadow-rose-500/10',
      border: 'border-rose-200/40 dark:border-rose-500/10',
      actionText: 'Fix Now',
      actionColor: 'text-rose-500 dark:text-rose-400',
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div 
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border bg-white dark:bg-[#050C14]/80 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer p-3",
        config.border
      )}
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          {/* Premium Gradient Icon - Compact */}
          <div className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-b shadow-sm transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-3",
            config.gradient,
            config.shadow
          )}>
            <Icon className="h-4 w-4 text-white drop-shadow-sm" />
          </div>
          
          {/* Clean Typography Block - Compact */}
          <div className="flex flex-col justify-center">
            <h4 className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white leading-none mb-1">
              {config.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
               <span>Email {isEmailVerified ? 'Verified' : 'Unverified'}</span>
               <span className="w-[3px] h-[3px] rounded-full bg-slate-300 dark:bg-slate-600"></span>
               <span>Google {isGoogleLinked ? 'Linked' : 'Unlinked'}</span>
            </div>
          </div>

        </div>
        
        {/* Right Action Area - iOS Style - Compact */}
        <div className="flex items-center gap-1 pl-2">
           <span className={cn("text-[11px] font-semibold", config.actionColor)}>
             {config.actionText}
           </span>
           <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
