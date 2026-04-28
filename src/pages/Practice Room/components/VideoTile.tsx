import { useEffect, useRef } from 'react';
import { Crown, Hand, MicOff, Pin, PinOff, VideoOff, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { cn } from '../../../lib/utils';

interface VideoTileProps {
  userId: string;
  displayName: string;
  avatar?: string;
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isPinned: boolean;
  isHost: boolean;
  isLocal: boolean;
  onPin(): void;
  size?: 'featured' | 'thumb';
  className?: string;
  latency?: number;
  isHandRaised?: boolean;
  masterMute?: boolean;
  isModerator?: boolean;
}

const VideoTile = ({
  userId,
  displayName,
  avatar,
  stream,
  isMuted,
  isVideoOff,
  isSpeaking,
  isPinned,
  isHost,
  isLocal,
  onPin,
  size = 'thumb',
  className,
  latency,
  isHandRaised,
  masterMute,
  isModerator,
}: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !stream) return;
    if (el.srcObject !== stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    }
  }, [stream]);

  const isFeatured = size === 'featured';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={cn(
      'relative group rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300',
      'bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/50 dark:border-slate-800/50',
      isFeatured ? 'w-full h-full' : 'w-24 h-20 sm:w-44 sm:h-28 cursor-pointer',
      isSpeaking && !isPinned && 'ring-1 sm:ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]',
      isPinned && 'ring-1 sm:ring-2 ring-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]',
      !isFeatured && 'hover:ring-1 sm:hover:ring-2 hover:ring-emerald-400/50 hover:scale-[1.02]',
      className
    )}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal || masterMute}
        className={cn('w-full h-full object-cover', (isVideoOff || !stream) && 'hidden')}
        style={{ transform: 'scaleX(-1)' }}
      />

      {(isVideoOff || !stream) && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/30">
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-teal-500/5 blur-2xl" />
          </div>
          <Avatar className={cn('relative z-10', isFeatured ? 'w-16 h-16 sm:w-24 sm:h-24 ring-2 sm:ring-4 ring-emerald-500/20' : 'w-8 h-8 sm:w-12 sm:h-12 ring-1 sm:ring-2 ring-emerald-500/20')}>
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm sm:text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {isSpeaking && <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-2xl pointer-events-none animate-pulse" />}

      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />

      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* Premium Role Badges (Enlightened Design) */}
          {isHost && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/30 to-yellow-500/30 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.4)] backdrop-blur-md animate-[pulse_3s_infinite]">
              <Crown className="w-3 h-3 text-amber-400 fill-amber-400 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-amber-200">Host</span>
            </span>
          )}
          {isModerator && !isHost && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gradient-to-r from-blue-600/30 to-cyan-500/30 border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.4)] backdrop-blur-md">
              <Shield className="w-3 h-3 text-blue-400 fill-blue-400 drop-shadow-[0_0_2px_rgba(0,0,0,0.5)]" />
              <span className="text-[9px] font-black uppercase tracking-tighter text-blue-200">Mod</span>
            </span>
          )}
          {isPinned && <Pin className="w-3 h-3 text-emerald-400" />}
          <span className="text-white/90 text-xs font-semibold truncate max-w-[90px] drop-shadow">
            {isLocal ? 'You' : displayName}
          </span>
          {isHandRaised && (
             <span className="flex items-center p-0.5 rounded bg-amber-500/20 border border-amber-400/20">
               <Hand className="w-2.5 h-2.5 text-amber-400 fill-amber-400/20" />
             </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {isMuted && (
            <span className="flex items-center p-0.5 rounded bg-red-500/30 border border-red-400/20">
              <MicOff className="w-2.5 h-2.5 text-red-400" />
            </span>
          )}
          {isVideoOff && <VideoOff className="w-2.5 h-2.5 text-slate-400" />}
        </div>
      </div>

      <div className="absolute top-2 left-2 flex gap-1 z-10 transition-opacity duration-300">
        {latency !== undefined && (
          <div className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-md backdrop-blur-md text-[9px] font-black uppercase tracking-tight text-white border transition-colors",
            latency < 80 ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
            latency < 150 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
            "bg-red-500/10 border-red-500/20 text-red-400"
          )}>
            <div className={cn(
              "w-1 h-1 rounded-full",
              latency < 80 ? "bg-emerald-400" :
              latency < 150 ? "bg-amber-400" :
              "bg-red-400"
            )} />
            {latency}ms
          </div>
        )}
      </div>
 
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 z-10">
        <button
          onClick={onPin}
          className="p-1.5 rounded-lg bg-slate-900/70 hover:bg-emerald-600/30 border border-slate-700/50 hover:border-emerald-400/50 text-slate-300 hover:text-emerald-400 backdrop-blur transition-all duration-200"
          title={isPinned ? 'Unpin' : 'Pin to main view'}
        >
          {isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

export default VideoTile;
