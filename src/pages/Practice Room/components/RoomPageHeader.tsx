import { Copy, Crown, ChevronLeft, Lock, Share2, Users } from 'lucide-react';
import { RoomDetails } from '../../../services/roomService';
import { cn } from '../../../lib/utils';

interface RoomPageHeaderProps {
  room: RoomDetails | null;
  isHost: boolean;
  participantsCount: number;
  isInCall: boolean;
  isMediaInitializing: boolean;
  onBack: () => void;
  onCopyCode: () => void;
  onShare: () => void;
}

const RoomPageHeader = ({
  room,
  isHost,
  participantsCount,
  isInCall,
  isMediaInitializing,
  onBack,
  onCopyCode,
  onShare,
}: RoomPageHeaderProps) => {
  return (
    <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onBack}
          className="flex-shrink-0 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <img
            src="/logo.svg"
            alt="CognitoSpeak"
            className="w-6 h-6 opacity-80"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            {room?.isPrivate && <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
            <h1 className="text-white font-bold text-sm sm:text-base truncate">{room?.topic}</h1>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Users className="w-3 h-3" />
              {participantsCount}
            </span>
            {isInCall ? (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            ) : isMediaInitializing ? (
              <span className="text-xs text-amber-400 animate-pulse">Connecting...</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isHost && room?.roomCode && (
          <button
            onClick={onCopyCode}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-200 group"
            title="Copy room code"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="text-amber-300 font-mono text-sm font-bold tracking-[0.2em]">{room.roomCode}</span>
            <Copy className="w-3 h-3 text-amber-400 group-hover:text-amber-300" />
          </button>
        )}
        <button
          onClick={onShare}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-emerald-600/20 border border-slate-700/50 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all duration-200"
          title="Share room"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default RoomPageHeader;
