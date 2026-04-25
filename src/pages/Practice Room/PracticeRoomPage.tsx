import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Users, MessageSquare,
  Copy, Share2, Crown, Pin, PinOff, Volume2, VolumeX, Lock,
  ChevronLeft, Wifi, Radio, Sparkles,
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { roomService, RoomDetails, RoomParticipant, PeerConnection } from '../../services/roomService';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { cn } from '../../lib/utils';
import RoomChat from './components/RoomChat';

// ─── VideoTile ────────────────────────────────────────────────────────────────

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
}

const VideoTile = ({
  userId, displayName, avatar, stream, isMuted, isVideoOff,
  isSpeaking, isPinned, isHost, isLocal, onPin, size = 'thumb',
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
      // Base: matches app dark card surface
      'bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/50 dark:border-slate-800/50',
      isFeatured ? 'w-full h-full' : 'w-36 h-24 sm:w-44 sm:h-28 cursor-pointer',
      // Speaking: emerald glow matches app's primary
      isSpeaking && !isPinned && 'ring-2 ring-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.3)]',
      // Pinned: emerald accent
      isPinned && 'ring-2 ring-emerald-500 shadow-[0_0_24px_rgba(16,185,129,0.25)]',
      !isFeatured && 'hover:ring-2 hover:ring-emerald-400/50 hover:scale-[1.02]',
    )}>
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={cn('w-full h-full object-cover', (isVideoOff || !stream) && 'hidden')}
      />

      {/* Avatar fallback */}
      {(isVideoOff || !stream) && (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950/30">
          {/* Subtle orb decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-emerald-500/5 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-20 h-20 rounded-full bg-teal-500/5 blur-2xl" />
          </div>
          <Avatar className={cn('relative z-10', isFeatured ? 'w-24 h-24 ring-4 ring-emerald-500/20' : 'w-12 h-12 ring-2 ring-emerald-500/20')}>
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* Speaking pulse border */}
      {isSpeaking && <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-2xl pointer-events-none animate-pulse" />}

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-slate-950/90 to-transparent pointer-events-none" />

      {/* Name row */}
      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {isHost && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/30">
              <Crown className="w-2.5 h-2.5 text-amber-400" />
            </span>
          )}
          {isPinned && <Pin className="w-3 h-3 text-emerald-400" />}
          <span className="text-white/90 text-xs font-semibold truncate max-w-[90px] drop-shadow">
            {isLocal ? 'You' : displayName}
          </span>
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

      {/* Hover pin button */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
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

// ─── PrivateRoomGate ──────────────────────────────────────────────────────────

const PrivateRoomGate = ({
  prefillCode, onSuccess, onBack,
}: {
  prefillCode?: string;
  onSuccess: (code: string) => void;
  onBack: () => void;
}) => {
  const [code, setCode] = useState(prefillCode || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) { setError('Please enter a valid room code'); return; }
    setLoading(true);
    onSuccess(code.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center p-4">
      {/* Background orbs — same as landing page */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[15%] right-[15%] w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl" />
        <div className="absolute bottom-[20%] left-[10%] w-64 h-64 rounded-full bg-teal-100/40 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        {/* Logo header — matches landing page navbar */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.svg" alt="CognitoSpeak" className="w-8 h-8" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-emerald-800 bg-clip-text text-transparent">
            CognitoSpeak
          </span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-8 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)]">
          {/* Lock icon */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto mb-6">
            <Lock className="w-6 h-6 text-emerald-600" />
          </div>

          <h1 className="text-2xl font-bold text-center text-slate-900 mb-1">Private Room</h1>
          <p className="text-slate-500 text-sm text-center mb-8">
            Enter the room code to join this private session
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={code}
                onChange={e => { setCode(e.target.value.toUpperCase().slice(0, 8)); setError(''); }}
                placeholder="XXXXXX"
                className={cn(
                  'w-full px-4 py-4 rounded-xl border bg-slate-50 text-slate-900 text-center text-2xl tracking-[0.4em] font-bold uppercase placeholder:text-slate-300 placeholder:text-base placeholder:tracking-normal outline-none transition-all duration-200 focus:ring-2 focus:ring-offset-0',
                  error
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-slate-200 focus:border-emerald-400 focus:ring-emerald-100',
                )}
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs mt-2 text-center font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Primary CTA — matches landing page "Get Started Free" button style */}
            <button
              type="submit"
              disabled={loading || code.trim().length < 4}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Joining...
                </span>
              ) : 'Join Room →'}
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Secondary CTA — matches "Watch Demo" outline button */}
          <button
            onClick={onBack}
            className="w-full mt-4 py-3 rounded-xl border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50/50 text-sm font-medium transition-all duration-200"
          >
            ← Browse public rooms
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── ParticipantsPanel ────────────────────────────────────────────────────────

const ParticipantsPanel = ({
  participants, hostId, peerConnections, speakingUsers,
  localUserId, pinnedUserId, isOpen, onClose, onPin,
}: {
  participants: RoomParticipant[];
  hostId: string;
  peerConnections: Map<string, PeerConnection>;
  speakingUsers: Set<string>;
  localUserId: string;
  pinnedUserId: string | null;
  isOpen: boolean;
  onClose(): void;
  onPin(userId: string): void;
}) => {
  const inCallIds = new Set([localUserId, ...Array.from(peerConnections.keys())]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Mobile backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-30 md:hidden"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-80 z-40 flex flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200/60 dark:border-slate-700/50 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/60 dark:border-slate-700/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-700/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-slate-900 dark:text-white font-semibold text-sm">Participants</h2>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">{participants.length} in room</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
              {participants.map(p => {
                const isLocal = p.userId === localUserId;
                const isInCall = inCallIds.has(p.userId);
                const isSpeaking = speakingUsers.has(p.userId);
                const isPinned = pinnedUserId === p.userId;
                const isRoomHost = p.userId === hostId;
                const initials = (p.fullName || p.username || 'U')
                  .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

                return (
                  <div
                    key={p.userId}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-150"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* Speaking ring */}
                      {isSpeaking && (
                        <span className="absolute -inset-0.5 rounded-full border-2 border-emerald-400 animate-pulse" />
                      )}
                      {/* Status dot */}
                      <span className={cn(
                        'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900',
                        isInCall ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600',
                      )} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isRoomHost && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-semibold border border-amber-200/60 dark:border-amber-700/30">
                            <Crown className="w-2.5 h-2.5" />
                            Host
                          </span>
                        )}
                        {isPinned && <Pin className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                        <span className="text-slate-800 dark:text-white text-sm font-medium truncate">
                          {p.fullName || p.username || 'Participant'}
                          {isLocal && <span className="ml-1 text-slate-400 dark:text-slate-500 font-normal text-xs">(you)</span>}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {isInCall
                          ? isSpeaking ? '🎤 Speaking' : 'In call'
                          : 'In room'}
                      </span>
                    </div>

                    {/* Pin action */}
                    {!isLocal && (
                      <button
                        onClick={() => onPin(p.userId)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-150"
                        title={isPinned ? 'Unpin' : 'Pin to main view'}
                      >
                        {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200/60 dark:border-slate-700/50 px-5 py-3">
              <p className="text-slate-400 dark:text-slate-500 text-xs text-center">
                {inCallIds.size} in call · {participants.length} total · {participants.length - inCallIds.size} watching
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── ControlButton ────────────────────────────────────────────────────────────

const ControlButton = ({
  onClick, active, activeIcon, inactiveIcon, label, variant = 'default', badge,
}: {
  onClick(): void;
  active: boolean;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
  variant?: 'default' | 'danger' | 'warn';
  badge?: number;
}) => {
  const styles = {
    default: {
      on: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-700/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/30',
      off: 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/50 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80',
    },
    danger: {
      on: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200/60 dark:border-red-700/40',
      off: 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200/60 dark:border-red-700/40 hover:bg-red-100 dark:hover:bg-red-900/30',
    },
    warn: {
      on: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-700/40',
      off: 'bg-white dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border-slate-200/60 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/80',
    },
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]',
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

// ─── PracticeRoomPage ─────────────────────────────────────────────────────────

const PracticeRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const urlParams = new URLSearchParams(location.search);
  const urlCode = urlParams.get('code');

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrivateGate, setShowPrivateGate] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(urlCode);

  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, PeerConnection>>(new Map());
  const [isMediaInitializing, setIsMediaInitializing] = useState(false);
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [pinnedUserId, setPinnedUserId] = useState<string | null>(null);

  const hasJoinedRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const analyserRefs = useRef<Map<string, { animId: number }>>(new Map());

  const isHost = room?.hostId === user?.id;
  const isParticipant = room?.participants.some(p => p.userId === user?.id);
  const currentUserId = user?.id || '';

  // ── Speaker detection ──
  const startSpeakerDetection = useCallback((uid: string, stream: MediaStream) => {
    try {
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let speaking = false;
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const now = avg > 10;
        if (now !== speaking) {
          speaking = now;
          setSpeakingUsers(prev => { const s = new Set(prev); now ? s.add(uid) : s.delete(uid); return s; });
        }
        const id = requestAnimationFrame(tick);
        analyserRefs.current.set(uid, { animId: id });
      };
      const id = requestAnimationFrame(tick);
      analyserRefs.current.set(uid, { animId: id });
    } catch { /* not available */ }
  }, []);

  const stopSpeakerDetection = useCallback((uid: string) => {
    const e = analyserRefs.current.get(uid);
    if (e) { cancelAnimationFrame(e.animId); analyserRefs.current.delete(uid); }
  }, []);

  // ── Load room ──
  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    try {
      const details = await roomService.getRoomDetails(roomId);
      if (!details) { setError('Room not found'); setIsLoading(false); return; }
      if (details.status === 'closed') { setError('This room has been closed.'); setIsLoading(false); return; }

      if (details.isPrivate) {
        const isMember = details.participants.some(p => p.userId === user?.id);
        if (!isMember && !roomCode) {
          setShowPrivateGate(true);
          setRoom(details);
          setParticipants(details.participants);
          setIsLoading(false);
          return;
        }
      }

      setRoom(details);
      setParticipants(details.participants);
    } catch (e: any) {
      setError(e.message || 'Failed to load room');
    } finally {
      setIsLoading(false);
    }
  }, [roomId, user?.id, roomCode]);

  useEffect(() => { loadRoom(); }, [loadRoom]);

  // ── Auto-join socket ──
  useEffect(() => {
    if (!room || !user?.id || hasJoinedRef.current || showPrivateGate) return;
    const alreadyIn = room.participants.some(p => p.userId === user.id);
    if (alreadyIn) {
      hasJoinedRef.current = true;
      roomService.initializeSocket();
      roomService.joinRoomSocket(roomId!);
    }
  }, [room, user?.id, roomId, showPrivateGate]);

  // ── SFU init ──
  useEffect(() => {
    if (!roomId || !isParticipant || showPrivateGate || hasInitializedRef.current) return;
    let mounted = true;
    hasInitializedRef.current = true;

    const unsubs = [
      roomService.onPeerConnectionsUpdated(connections => {
        if (!mounted) return;
        setPeerConnections(new Map(connections));
        connections.forEach((peer, uid) => {
          if (uid !== currentUserId && !analyserRefs.current.has(uid)) {
            startSpeakerDetection(uid, peer.stream);
          }
        });
      }),
      roomService.onRoomUserLeft(({ userId }) => stopSpeakerDetection(userId)),
      roomService.onRoomClosed(() => {
        toast({ title: 'Room closed', description: 'The host has ended this session.', variant: 'destructive' });
        navigate('/rooms');
      }),
    ];

    const init = async () => {
      try {
        setIsMediaInitializing(true);
        const stream = await roomService.initializeMedia(true, false);
        if (!mounted) return;
        setLocalStream(stream);
        setIsMicOn(stream.getAudioTracks().some(t => t.enabled));
        setIsVideoOn(stream.getVideoTracks().some(t => t.enabled));
        startSpeakerDetection(currentUserId, stream);
        await roomService.joinCall(roomId);
        if (!mounted) return;
        setIsInCall(true);
        setLocalStream(roomService.getLocalStream());
        setPeerConnections(new Map(roomService.getAllPeerConnections()));
      } catch (err: any) {
        console.error('[Room] SFU init failed:', err);
        hasInitializedRef.current = false;
        if (mounted) toast({ title: 'Call failed', description: err?.message || 'Check permissions and try again.', variant: 'destructive' });
      } finally {
        if (mounted) setIsMediaInitializing(false);
      }
    };

    init();

    return () => {
      mounted = false;
      unsubs.forEach(fn => fn());
      analyserRefs.current.forEach((_, uid) => stopSpeakerDetection(uid));
      roomService.leaveCall(roomId).catch(() => {});
      roomService.stopMedia();
      setLocalStream(null);
      setPeerConnections(new Map());
      setIsInCall(false);
      hasInitializedRef.current = false;
    };
  }, [roomId, isParticipant, showPrivateGate, currentUserId, startSpeakerDetection, stopSpeakerDetection, toast, navigate]);

  // ── Private gate handler ──
  const handlePrivateGate = async (code: string) => {
    setRoomCode(code);
    try {
      await roomService.joinRoom(roomId!, code);
      setShowPrivateGate(false);
      hasJoinedRef.current = true;
      roomService.initializeSocket();
      roomService.joinRoomSocket(roomId!);
      await loadRoom();
    } catch (err: any) {
      const errCode = err.response?.data?.code;
      const msg = errCode === 'INVALID_ROOM_CODE' ? 'Incorrect code. Please try again.' :
                  errCode === 'PRIVATE_ROOM_CODE_REQUIRED' ? 'A room code is required.' :
                  err.message || 'Failed to join';
      toast({ title: 'Cannot join room', description: msg, variant: 'destructive' });
    }
  };

  // ── Controls ──
  const handleLeaveRoom = async () => {
    try {
      await roomService.leaveCall(roomId!).catch(() => {});
      roomService.stopMedia();
      await roomService.leaveRoom(roomId!);
      roomService.leaveRoomSocket(roomId!);
    } finally {
      navigate('/rooms', { replace: true });
    }
  };
  const handleMic = async () => { try { setIsMicOn(await roomService.toggleAudio()); } catch { toast({ title: 'Mic error', variant: 'destructive' }); } };
  const handleCamera = async () => {
    try {
      setIsVideoOn(await roomService.toggleVideo());
      const s = roomService.getLocalStream();
      if (s && s !== localStream) setLocalStream(s);
    } catch { toast({ title: 'Camera error', variant: 'destructive' }); }
  };
  const handlePin = (uid: string) => setPinnedUserId(p => p === uid ? null : uid);
  const handleCopyCode = () => {
    if (room?.roomCode) {
      navigator.clipboard.writeText(room.roomCode);
      toast({ title: '✅ Code copied', description: `Room code: ${room.roomCode}` });
    }
  };
  const handleShare = () => {
    if (!roomId) return;
    const url = `${window.location.origin}/practice-room/${roomId}${room?.isPrivate && room.roomCode ? `?code=${room.roomCode}` : ''}`;
    navigator.clipboard.writeText(url);
    toast({ title: '🔗 Link copied!', description: 'Share this link to invite others.' });
  };

  // ── Featured tile logic ──
  const featuredId = pinnedUserId
    ?? Array.from(speakingUsers).find(uid => uid !== currentUserId)
    ?? participants.find(p => p.userId === room?.hostId)?.userId
    ?? Array.from(peerConnections.keys())[0]
    ?? currentUserId;

  const buildTileData = (uid: string) => {
    if (uid === currentUserId) {
      const name = [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(' ') || user?.username || 'You';
      return { name, avatar: user?.avatar || user?.profile?.avatar_url, stream: localStream, isLocal: true };
    }
    const peer = peerConnections.get(uid);
    const p = participants.find(x => x.userId === uid);
    return { name: p?.fullName || p?.username || 'Participant', avatar: p?.avatar, stream: peer?.stream || null, isLocal: false };
  };

  const thumbList = [
    { userId: currentUserId, ...buildTileData(currentUserId) },
    ...Array.from(peerConnections.keys()).map(uid => ({ userId: uid, ...buildTileData(uid) })),
  ].filter(t => t.userId !== featuredId);

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-emerald-50 border border-emerald-100 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-emerald-500 animate-pulse" />
            </div>
          </div>
          <p className="text-slate-600 font-medium">Loading practice room...</p>
          <p className="text-slate-400 text-sm mt-1">Setting up your session</p>
        </div>
      </div>
    );
  }

  if (showPrivateGate) {
    return <PrivateRoomGate prefillCode={roomCode || undefined} onSuccess={handlePrivateGate} onBack={() => navigate('/rooms')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 flex items-center justify-center p-4">
        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[15%] right-[15%] w-80 h-80 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-5">
            <PhoneOff className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{error}</h2>
          <p className="text-slate-500 text-sm mb-6">The room may no longer be available.</p>
          <button
            onClick={() => navigate('/rooms')}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Browse Rooms →
          </button>
        </div>
      </div>
    );
  }

  const featured = buildTileData(featuredId);

  return (
    <div
      className="flex flex-col bg-slate-950 overflow-hidden"
      style={{ height: '100dvh' }}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-[10%] right-[8%] w-72 h-72 rounded-full bg-emerald-500/4 blur-3xl" />
        <div className="absolute bottom-[15%] left-[5%] w-60 h-60 rounded-full bg-teal-500/3 blur-3xl" />
      </div>

      {/* ── HEADER ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50">
        {/* Left: back + room info */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate('/rooms')}
            className="flex-shrink-0 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 text-slate-400 hover:text-white transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* App logo texture */}
          <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
            <img src="/logo.svg" alt="CognitoSpeak" className="w-6 h-6 opacity-80" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {room?.isPrivate && <Lock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
              <h1 className="text-white font-bold text-sm sm:text-base truncate">{room?.topic}</h1>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Users className="w-3 h-3" />
                {participants.length}
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

        {/* Right: room code + share */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Room code — host only */}
          {isHost && room?.roomCode && (
            <button
              onClick={handleCopyCode}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/40 transition-all duration-200 group"
              title="Copy room code"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span className="text-amber-300 font-mono text-sm font-bold tracking-[0.2em]">{room.roomCode}</span>
              <Copy className="w-3 h-3 text-amber-400 group-hover:text-amber-300" />
            </button>
          )}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-emerald-600/20 border border-slate-700/50 hover:border-emerald-500/40 text-slate-400 hover:text-emerald-400 transition-all duration-200"
            title="Share room"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="flex-1 flex min-h-0">

        {/* Video area */}
        <div className="flex-1 flex flex-col min-w-0 p-2 sm:p-3 gap-2 sm:gap-3">

          {/* Featured tile */}
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden relative">
            <VideoTile
              userId={featuredId}
              displayName={featured.name}
              avatar={featured.avatar}
              stream={featured.stream}
              isMuted={featuredId === currentUserId ? !isMicOn : false}
              isVideoOff={featuredId === currentUserId ? !isVideoOn : false}
              isSpeaking={speakingUsers.has(featuredId)}
              isPinned={pinnedUserId === featuredId}
              isHost={room?.hostId === featuredId}
              isLocal={featured.isLocal}
              onPin={() => handlePin(featuredId)}
              size="featured"
            />

            {/* Status pill overlaid on featured */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {pinnedUserId && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/60 backdrop-blur border border-slate-700/50 text-emerald-400 text-xs font-semibold">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              {!pinnedUserId && speakingUsers.has(featuredId) && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Speaking
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail strip */}
          {thumbList.length > 0 && (
            <div className="flex-shrink-0">
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {thumbList.map(t => (
                  <VideoTile
                    key={t.userId}
                    userId={t.userId}
                    displayName={t.name}
                    avatar={t.avatar}
                    stream={t.stream}
                    isMuted={t.userId === currentUserId ? !isMicOn : false}
                    isVideoOff={t.userId === currentUserId ? !isVideoOn : false}
                    isSpeaking={speakingUsers.has(t.userId)}
                    isPinned={pinnedUserId === t.userId}
                    isHost={room?.hostId === t.userId}
                    isLocal={t.isLocal}
                    onPin={() => handlePin(t.userId)}
                    size="thumb"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Chat panel */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="hidden md:flex flex-col flex-shrink-0 border-l border-slate-700/50 bg-slate-900/80 overflow-hidden"
            >
              <RoomChat roomId={roomId!} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CONTROLS ── */}
      <footer className="flex-shrink-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 px-4 py-3">
        {/* Thin emerald top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto">
          <ControlButton
            onClick={handleMic}
            active={isMicOn}
            activeIcon={<Mic className="w-5 h-5" />}
            inactiveIcon={<MicOff className="w-5 h-5" />}
            label={isMicOn ? 'Mic On' : 'Mic Off'}
            variant={isMicOn ? 'default' : 'danger'}
          />
          <ControlButton
            onClick={handleCamera}
            active={isVideoOn}
            activeIcon={<Video className="w-5 h-5" />}
            inactiveIcon={<VideoOff className="w-5 h-5" />}
            label={isVideoOn ? 'Camera' : 'Camera'}
          />
          <ControlButton
            onClick={() => setIsSpeakerOn(p => !p)}
            active={isSpeakerOn}
            activeIcon={<Volume2 className="w-5 h-5" />}
            inactiveIcon={<VolumeX className="w-5 h-5" />}
            label="Speaker"
          />
          <ControlButton
            onClick={() => setIsHandRaised(p => !p)}
            active={isHandRaised}
            activeIcon={<Hand className="w-5 h-5" />}
            inactiveIcon={<Hand className="w-5 h-5" />}
            label="Hand"
            variant="warn"
          />

          {/* Divider */}
          <div className="w-px h-8 bg-slate-700/60 mx-1" />

          <ControlButton
            onClick={() => { setIsPanelOpen(p => !p); setIsChatOpen(false); }}
            active={isPanelOpen}
            activeIcon={<Users className="w-5 h-5" />}
            inactiveIcon={<Users className="w-5 h-5" />}
            label="People"
            badge={participants.length > 0 ? participants.length : undefined}
          />
          <ControlButton
            onClick={() => { setIsChatOpen(p => !p); setIsPanelOpen(false); }}
            active={isChatOpen}
            activeIcon={<MessageSquare className="w-5 h-5" />}
            inactiveIcon={<MessageSquare className="w-5 h-5" />}
            label="Chat"
          />

          {/* Divider */}
          <div className="w-px h-8 bg-slate-700/60 mx-1" />

          {/* Leave — styled like the app's destructive button */}
          <button
            onClick={handleLeaveRoom}
            className="flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-[10px] font-semibold hidden sm:block leading-none">Leave</span>
          </button>
        </div>
      </footer>

      {/* ── PARTICIPANTS PANEL ── */}
      <ParticipantsPanel
        participants={participants}
        hostId={room?.hostId || ''}
        peerConnections={peerConnections}
        speakingUsers={speakingUsers}
        localUserId={currentUserId}
        pinnedUserId={pinnedUserId}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onPin={handlePin}
      />
    </div>
  );
};

export default PracticeRoomPage;
