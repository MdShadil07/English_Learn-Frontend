import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LogOut, User as UserIcon, X } from 'lucide-react';
import { clearSavedSession, SavedSession } from '@/utils/sessionManager';
import { Button } from '@/components/ui/button';

interface SavedSessionCardProps {
  session: SavedSession;
  onRemove: () => void;
  onClose?: () => void;
  minimized?: boolean;
}

export const SavedSessionCard: React.FC<SavedSessionCardProps> = ({ session, onRemove, onClose, minimized }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    if (session.hasValidToken) {
      navigate('/dashboard');
    } else if (session.user?.email) {
      navigate(`/login?email=${encodeURIComponent(session.user.email)}`);
    } else {
      navigate('/login');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clearSavedSession();
    onRemove();
  };

  const displayName = session.user?.fullName || 'User';
  const displayEmail = session.user?.email || 'Signed in previously';

  if (minimized) {
    return (
      <button 
        onClick={handleContinue}
        className="flex items-center gap-3 p-2 pr-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl rounded-full hover:shadow-emerald-500/30 transition-all hover:-translate-y-1 group"
      >
        <div className="relative">
          {session.user?.avatar ? (
            <img 
              src={session.user.avatar} 
              alt={displayName} 
              className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-sm group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm group-hover:scale-105 transition-transform">
              <UserIcon className="w-5 h-5" />
            </div>
          )}
          {session.hasValidToken && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Continue as
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
            {displayName}
          </span>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto group">
      <div className="relative p-[1px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-700 dark:to-slate-800 shadow-xl dark:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative flex flex-col p-6 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl h-full w-full">
          {/* Header row with Remove button */}
          <div className="flex justify-between items-start w-full mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                {session.user?.avatar ? (
                  <img 
                    src={session.user.avatar} 
                    alt={displayName} 
                    className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm">
                    <UserIcon className="w-6 h-6" />
                  </div>
                )}
                {session.hasValidToken && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">
                  {displayName}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
                  {displayEmail}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 -mr-2 -mt-2">
              <button
                onClick={handleRemove}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors tooltip-trigger"
                title="Remove from this device"
                aria-label="Remove from this device"
              >
                <LogOut className="w-4 h-4" />
              </button>
              {onClose && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onClose();
                  }}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action button */}
          <Button 
            onClick={handleContinue}
            className="w-full relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold py-5 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
          >
            {session.hasValidToken ? 'Continue to Dashboard' : 'Log back in'}
            <ArrowRight className="w-4 h-4" />
          </Button>

          {/* Status text */}
          <div className="mt-4 text-center">
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-500">
              {session.hasValidToken 
                ? "You have an active session."
                : session.isTrustedDevice 
                  ? "Trusted device • Fast login available"
                  : "Saved session"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
