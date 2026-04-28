import { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Users, MessageSquare,
  Copy, Share2, Crown, Pin, PinOff, Volume2, VolumeX, Lock,
  ChevronLeft, Wifi, Radio, Sparkles, Loader2, Smile, Settings, Shield, Trash2, X, MoreHorizontal
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';
import { roomService, RoomDetails, RoomParticipant, PeerConnection } from '../../services/roomService';
import { cn } from '../../lib/utils';
import VideoTile from './components/VideoTile';
import ControlButton from './components/ControlButton';
import RoomWarningModal, { WarningType } from './components/RoomWarningModal';

const RoomChat = lazy(() => import('./components/RoomChat'));
const PrivateRoomGate = lazy(() => import('./components/PrivateRoomGate'));
const ParticipantsPanel = lazy(() => import('./components/ParticipantsPanel'));
const RoomSettingsPanel = lazy(() => import('./components/RoomSettingsPanel'));
import { EmojiSelectorPopover } from './components/EmojiPicker';

const AudioWave = ({ active }: { active: boolean }) => (
  <div className="flex items-center gap-[2px] h-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-current rounded-full"
        animate={active ? { height: ['4px', '12px', '6px', '10px', '4px'] } : { height: '4px' }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
      />
    ))}
  </div>
);

// ─── PracticeRoomPage ─────────────────────────────────────────────────────────

const PracticeRoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id || '';
  const { toast } = useToast();

  const urlParams = new URLSearchParams(location.search);
  const urlCode = urlParams.get('code');

  const [room, setRoom] = useState<RoomDetails | null>(null);
  const [participants, setParticipants] = useState<RoomParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPrivateGate, setShowPrivateGate] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(urlCode);

  const [isMicOn, setIsMicOn] = useState(true);
  const isMicOnRef = useRef(isMicOn);
  useEffect(() => { isMicOnRef.current = isMicOn; }, [isMicOn]);
  
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peerConnections, setPeerConnections] = useState<Map<string, PeerConnection>>(new Map());
  const [isMediaInitializing, setIsMediaInitializing] = useState(false);
  const [isMutedByHost, setIsMutedByHost] = useState(false);
  const [isChatClearedNotify, setIsChatClearedNotify] = useState(false);
  const [isModAppointedNotify, setIsModAppointedNotify] = useState(false);
  const [isMentionedNotify, setIsMentionedNotify] = useState(false);
  const [lastMentionedId, setLastMentionedId] = useState<string | null>(
    () => sessionStorage.getItem(`lastMentionedId-${urlCode || 'room'}-${currentUserId}`) || null
  );
  const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
  const [handsRaised, setHandsRaised] = useState<Set<string>>(new Set());
  const [activeReactions, setActiveReactions] = useState<{ id: number; emoji: string; userId: string; x: number }[]>([]);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isRoomLocked, setIsRoomLocked] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [latencies, setLatencies] = useState<Record<string, number>>({});
  
  // Chat & Reaction State (Centralized to survive panel close/mount)
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatMessageReactions, setChatMessageReactions] = useState<Record<string, Record<string, string[]>>>( {}); 
  const [isReactionSelectorOpen, setIsReactionSelectorOpen] = useState(false);
  const controlsWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Modal State for Kick/Block/Locked
  const [warningModal, setWarningModal] = useState<{
    isOpen: boolean;
    type: WarningType;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    description: ''
  });
 
  // Simulate network jitter
  useEffect(() => {
    const updateLatencies = () => {
      const newLatencies: Record<string, number> = {};
      [currentUserId, ...participants.map(p => p.userId)].forEach(id => {
        newLatencies[id] = Math.floor(Math.random() * 40) + 20; // 20-60ms base
        if (id === 'poor-con') newLatencies[id] = 250 + Math.random() * 100; // Simulated bad connection
      });
      setLatencies(newLatencies);
    };
 
    updateLatencies();
    const interval = setInterval(updateLatencies, 3000);
    return () => clearInterval(interval);
  }, [participants, currentUserId]);
 
  // Session timer
  useEffect(() => {
    if (!isInCall) return;
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [isInCall]);
 
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  const [pinnedUserId, setPinnedUserId] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const hasJoinedRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const analyserRefs = useRef<Map<string, { animId: number }>>(new Map());

  // Broadcast hand raise status when it changes
  useEffect(() => {
    if (isInCall && roomId) {
      roomService.toggleHand(roomId, isHandRaised);
    }
  }, [isHandRaised, isInCall, roomId]);

  const handleSendReaction = (emoji: any) => {
    if (!roomId) return;
    // Send the emoji image URL
    const emojiUrl = emoji.src || emoji;
    roomService.sendReaction(roomId, emojiUrl);
    // Also show locally
    const id = Date.now() + Math.random();
    setActiveReactions(prev => [...prev, { id, emoji: emojiUrl, userId: currentUserId, x: Math.random() * 80 + 10 }]);
    setTimeout(() => {
      setActiveReactions(prev => prev.filter(r => r.id !== id));
    }, 4000);
  };

  const isHost = useMemo(() => {
    if (!room?.hostId || !currentUserId) return false;
    const hId = room.hostId;
    const rawHId = typeof hId === 'object' ? (hId as any)._id || (hId as any).id : hId;
    return String(rawHId).toLowerCase() === String(currentUserId).toLowerCase();
  }, [room?.hostId, currentUserId]);
  const isAdmin = useMemo(() => {
    return isHost || (room?.moderators || []).includes(currentUserId);
  }, [isHost, room?.moderators, currentUserId]);

  const isParticipant = room?.participants.some(p => p.userId === currentUserId);

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
      let tickCount = 0;
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const now = avg > 10;
        
        tickCount++;
        
        if (now !== speaking) {
          speaking = now;
          if (now) {
            setSpeakingUsers(prev => { 
              const s = new Set(prev); 
              s.add(uid); 
              return s; 
            });
          } else {
            // Debounce removal by 1 second to drastically reduce render thrash
            setTimeout(() => {
              if (!speaking) {
                setSpeakingUsers(prev => { 
                  const s = new Set(prev); 
                  s.delete(uid); 
                  return s; 
                });
              }
            }, 1000);
          }
        }
        const id = requestAnimationFrame(tick);
        analyserRefs.current.set(uid, { animId: id });
      };
      const id = requestAnimationFrame(tick);
      analyserRefs.current.set(uid, { animId: id });
    } catch (error) { 
      console.error('[SpeakerDetection] Error starting detection for user:', uid, error); 
    }
  }, []);

  const stopSpeakerDetection = useCallback((uid: string) => {
    const e = analyserRefs.current.get(uid);
    if (e) { cancelAnimationFrame(e.animId); analyserRefs.current.delete(uid); }
  }, []);

  useEffect(() => {
    if (chatMessages.length === 0) return;
    const lastMsg = chatMessages[chatMessages.length - 1];
    if (lastMsg.id === lastMentionedId) return;
    
    const content = (typeof lastMsg.content === 'object' ? lastMsg.content.text : lastMsg.content) || '';
    const lowerContent = content.toLowerCase();
    
    const isTaggingHost = lowerContent.includes('@host');
    const isTaggingMod = lowerContent.includes('@mod') || lowerContent.includes('@moderator');
    
    if ((isTaggingHost && isHost) || (isTaggingMod && isAdmin)) {
      setIsMentionedNotify(true);
      setLastMentionedId(lastMsg.id);
      sessionStorage.setItem(`lastMentionedId-${urlCode || 'room'}-${currentUserId}`, lastMsg.id);
    }
  }, [chatMessages, isHost, isAdmin, lastMentionedId]);

  useEffect(() => {
    if (isMentionedNotify) {
      const timer = setTimeout(() => {
        setIsMentionedNotify(false);
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [isMentionedNotify]);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    if (isMoreMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMoreMenuOpen]);

  // ── Load room ──
  const loadRoom = useCallback(async () => {
    if (!roomId) return;
    try {
      const details = await roomService.getRoomDetails(roomId);
      if (!details) { setError('Room not found'); setIsLoading(false); return; }
      if (details.status === 'closed') { setError('This room has been closed.'); setIsLoading(false); return; }

      const isHost = String(typeof details.hostId === 'object' ? (details.hostId as any)._id : details.hostId) === String(currentUserId);
      const isMember = details.participants.some(p => p.userId === currentUserId);

      if (details.isPrivate) {
        const hasCode = !!(roomCode || urlCode);
        
        if (!isHost && !isMember && !hasCode) {
          setShowPrivateGate(true);
          setRoom(details);
          setParticipants(details.participants);
          setIsLoading(false);
          return;
        }
      }

      // Auto-join if user is not already a participant
      let finalDetails = details;
      if (!isMember) {
        finalDetails = await roomService.joinRoom(roomId, roomCode || urlCode || undefined);
      }

      setRoom(finalDetails);
      setParticipants(finalDetails.participants);
      setIsRoomLocked(finalDetails.isLocked);
    } catch (e: any) {
      const msg = e.response?.data?.message || e.message || 'Failed to load room';
      if (msg.toLowerCase().includes('blocked')) {
        setWarningModal({
          isOpen: true,
          type: 'blocked',
          title: 'Access Denied',
          description: 'The host has blocked you from this specific room. You cannot join this session.'
        });
      } else if (msg.toLowerCase().includes('locked')) {
        setWarningModal({
          isOpen: true,
          type: 'locked',
          title: 'Session Locked',
          description: 'This room is currently locked by the host.'
        });
      } else {
        setError(msg);
      }
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
      roomService.onRoomUserLeft(({ userId }) => {
        if (!mounted) return;
        setParticipants(prev => prev.filter(p => p.userId !== userId));
        stopSpeakerDetection(userId);
      }),
      roomService.onRoomUserJoined(async ({ userId }) => {
        if (!mounted) return;
        try {
          const details = await roomService.getRoomDetails(roomId);
          if (details && mounted) {
             setParticipants(details.participants);
          }
        } catch (e) {
          console.error("Failed to refresh participants", e);
        }
      }),
      roomService.onRoomClosed(() => {
        toast({ title: 'Room closed', description: 'The host has ended this session.', variant: 'destructive' });
        navigate('/dashboard?view=rooms');
      }),
      roomService.onHandToggled(({ userId, isRaised }) => {
        if (!mounted) return;
        setHandsRaised(prev => {
          const s = new Set(prev);
          if (isRaised) s.add(userId);
          else s.delete(userId);
          return s;
        });
      }),
      roomService.onReaction(({ userId, reaction }) => {
        if (!mounted) return;
        
        // Handle message reactions
        if (reaction.startsWith('msg:')) {
          const [_, msgId, emoji] = reaction.split(':');
          setChatMessageReactions(prev => {
            const msgMap = prev[msgId] || {};
            const userList = msgMap[emoji] || [];
            if (userList.includes(userId)) return prev;
            return { ...prev, [msgId]: { ...msgMap, [emoji]: [...userList, userId] } };
          });
          return;
        }

        const id = Date.now() + Math.random();
        setActiveReactions(prev => [...prev, { id, emoji: reaction, userId, x: Math.random() * 80 + 10 }]);
        setTimeout(() => {
          setActiveReactions(prev => prev.filter(r => r.id !== id));
        }, 4000);
      }),
      roomService.onRoomMessage((event) => {
        if (!mounted) return;
        setChatMessages(prev => [
          ...prev,
          {
            id: `${event.userId}-${new Date(event.timestamp).getTime()}`,
            senderId: event.userId,
            content: event.message,
            timestamp: new Date(event.timestamp),
            type: 'text'
          }
        ]);
      }),
      roomService.onRoomHistory((data) => {
        if (!mounted || data.roomId !== roomId) return;
        setChatMessages(data.messages.map(m => ({
          id: `${m.userId}-${new Date(m.timestamp).getTime()}`,
          senderId: m.userId,
          content: m.message,
          timestamp: new Date(m.timestamp),
          type: 'text'
        })));
      }),
      roomService.onLockUpdated((data) => {
        if (!mounted) return;
        setIsRoomLocked(data.isLocked);
      }),
      roomService.onForceKick((data: any) => {
        if (!mounted || data.roomId !== roomId) return;
        const isBlocked = !!data.isBlocked;
        
        // Stop media and socket immediately
        roomService.leaveCall(roomId!).catch(console.error);
        roomService.leaveRoomSocket(roomId!);
        setIsInCall(false);

        setWarningModal({
          isOpen: true,
          type: isBlocked ? 'blocked' : 'kicked',
          title: isBlocked ? 'Permanently Blocked' : 'Removed from Room',
          description: isBlocked 
            ? 'The host has blocked you from this session. You will not be able to re-join this specific room.' 
            : 'The host has removed you from this session. Please go back to the dashboard.'
        });
      }),
      roomService.onForceMute(() => {
        if (!mounted) return;
        if (isMicOnRef.current) {
          handleMic(false);
          setIsMutedByHost(true);
        }
      }),
      (() => {
        const h = () => { if (mounted) loadRoom(); };
        const s = roomService.getSocket();
        s?.on('room:user-unblocked', h);
        return () => { s?.off('room:user-unblocked', h); };
      })(),
      (() => {
        const h = (data: any) => { if (mounted && data.isBlocked) loadRoom(); };
        const s = roomService.getSocket();
        s?.on('room:user-kicked', h);
        return () => { s?.off('room:user-kicked', h); };
      })(),
      (() => {
        const h = (data: any) => { 
          if (!mounted) return;
          setRoom(prev => {
            if (!prev) return prev;
            const currentMods = prev.moderators || [];
            const updatedMods = data.isModerator 
              ? Array.from(new Set([...currentMods, data.userId]))
              : currentMods.filter(id => String(id) !== String(data.userId));
            return { ...prev, moderators: updatedMods };
          });
          // Notify the user if they were promoted
          if (data.userId === currentUserId && data.isModerator) {
            setIsModAppointedNotify(true);
          }
          // Background sync to ensure accuracy
          loadRoom(); 
        };
        const s = roomService.getSocket();
        s?.on('room:moderator-updated', h);
        return () => { s?.off('room:moderator-updated', h); };
      })(),
      (() => {
        const h = (data: any) => { 
          if (!mounted) return;
          if (!data.excludedIds.includes(currentUserId)) {
            if (isMicOnRef.current) {
              handleMic(false);
              setIsMutedByHost(true);
            }
          }
        };
        const s = roomService.getSocket();
        s?.on('room:force-mute-all', h);
        return () => { s?.off('room:force-mute-all', h); };
      })(),
      (() => {
        const h = () => { 
          if (!mounted) return;
          setChatMessages([]); 
          setIsChatClearedNotify(true);
        };
        const s = roomService.getSocket();
        s?.on('room:chat-cleared', h);
        return () => { s?.off('room:chat-cleared', h); };
      })(),
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
      } catch (e: unknown) {
        const err = e instanceof Error ? e : new Error('Call failed');
        console.error('[Room] SFU init failed:', err);
        hasInitializedRef.current = false;
        if (mounted) toast({ title: 'Call failed', description: err.message || 'Check permissions and try again.', variant: 'destructive' });
      } finally {
        if (mounted) setIsMediaInitializing(false);
      }
    };

    init();
    const trackedAnalysers = new Map(analyserRefs.current);

    return () => {
      mounted = false;
      unsubs.forEach(fn => fn());
      trackedAnalysers.forEach((_, uid) => stopSpeakerDetection(uid));
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
    } catch (e: unknown) {
      const err = e as { response?: { data?: { code?: string } }; message?: string };
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
      navigate('/dashboard?view=rooms', { replace: true });
    }
  };
  const handleMic = async (forceState?: boolean) => { 
    try { 
      // Don't allow unmuting if muted by host
      if (isMutedByHost && forceState !== false) {
        toast({ title: 'Cannot unmute', description: 'You have been muted by the host.', variant: 'destructive' });
        return;
      }
      const newState = await roomService.toggleAudio(forceState); 
      setIsMicOn(newState);
      if (newState) {
        setIsMutedByHost(false);
      }
    } catch (error) { 
      console.error('[Mic] Error:', error);
      toast({ title: 'Mic error', description: 'Failed to toggle microphone', variant: 'destructive' }); 
    } 
  };
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

  // ── Optimized Participant Map ──
  const participantMap = useMemo(() => {
    const map = new Map();
    participants.forEach(p => map.set(p.userId, p));
    return map;
  }, [participants]);

  // ── Featured tile logic (Active Speakers Grid) ──
  const featuredIds = useMemo(() => {
    const speakers = Array.from(speakingUsers).filter(uid => uid !== currentUserId);
    
    // Priority 1: Pinned user (Exclusive Focus Mode)
    if (pinnedUserId) {
      return [pinnedUserId];
    }
    
    // Priority 2: Active speakers (up to 4)
    if (speakers.length > 0) {
      return speakers.slice(0, 4);
    }
    
    // Priority 3: Host + You
    const host = room?.hostId ? participantMap.get(String(typeof room.hostId === 'object' ? (room.hostId as any)._id : room.hostId))?.userId : undefined;
    if (host && host !== currentUserId) {
      return [host, currentUserId];
    }
    
    return [currentUserId];
  }, [speakingUsers, pinnedUserId, currentUserId, room?.hostId, participants]);

  const buildTileData = (uid: string) => {
    if (uid === currentUserId) {
      const name = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || user?.fullName || 'You';
      return { name, avatar: user?.avatar, stream: localStream, isLocal: true, isModerator: room?.moderators?.includes(currentUserId) };
    }
    const peer = peerConnections.get(uid);
    const p = participantMap.get(uid);
    return { name: p?.fullName || p?.username || 'Participant', avatar: p?.avatar, stream: peer?.stream || null, isLocal: false, isModerator: room?.moderators?.includes(uid) };
  };

  const featuredList = featuredIds.map(uid => ({ userId: uid, ...buildTileData(uid) }));

  // Limit thumbnails to avoid showing 400 people in a strip
  const thumbList = pinnedUserId ? [] : [
    currentUserId,
    ...Array.from(peerConnections.keys())
  ]
    .filter(uid => !featuredIds.includes(uid))
    .slice(0, 8)
    .map(uid => ({ userId: uid, ...buildTileData(uid) })); // Only show top 8 non-featured participants in the strip

  // ── Loading / Error ──
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          </div>
          <p className="text-emerald-500/80 font-bold tracking-wider uppercase text-xs">Entering Practice Room</p>
        </div>
      </div>
    );
  }

  if (showPrivateGate) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500 font-medium"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
        <PrivateRoomGate prefillCode={roomCode || undefined} onSuccess={handlePrivateGate} onBack={() => navigate('/rooms')} />
      </Suspense>
    );
  }

  if (error) {
    const isLocked = error.toLowerCase().includes('locked');
    return (
      <RoomWarningModal 
        isOpen={true}
        onClose={() => navigate('/dashboard?view=rooms')}
        type={isLocked ? 'locked' : 'error'}
        title={isLocked ? 'Session Locked' : 'Access Denied'}
        description={isLocked ? "This room is currently restricted. The moderator has locked entry to new participants." : error}
        actionLabel="Go to Dashboard"
        onAction={() => navigate('/dashboard?view=rooms')}
      />
    );
  }


  return (
    <div
      className="fixed inset-0 flex flex-col bg-slate-950 overflow-hidden"
    >
      <AnimatePresence>
        {isMutedByHost && (
          <motion.div 
            key="muted-notify"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-red-500/95 text-white py-2.5 px-4 flex items-center justify-between z-50 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-1.5 rounded-lg border border-white/20">
                <MicOff className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest leading-none mb-0.5">Moderation Alert</p>
                <p className="text-[10px] text-red-50 font-medium">You have been muted by the room host or moderator.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsMutedByHost(false)}
              className="text-white hover:bg-white/10 rounded-full h-8 px-4 text-[10px] font-black uppercase border border-white/20"
            >
              Understand
            </button>
          </motion.div>
        )}

        {isMentionedNotify && (
          <motion.div
            key="mention-notify"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="absolute top-20 right-6 z-[100] flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)] max-w-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
               <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-white text-xs font-black uppercase tracking-tighter mb-1">Attention Required</h4>
              <p className="text-slate-400 text-[10px] leading-tight">Someone mentioned you in the chat. Please check for any issues.</p>
            </div>
            <button 
              onClick={() => {
                setIsMentionedNotify(false);
                setIsChatOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
            >
              View
            </button>
            <button
              onClick={() => setIsMentionedNotify(false)}
              className="absolute -top-2 -right-2 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-white/10 hover:bg-slate-700 transition-all cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}

        {isChatClearedNotify && (
          <motion.div
            key="chat-cleared-notify"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-500/90 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <Trash2 className="w-5 h-5 text-white animate-bounce" />
            <div className="flex flex-col">
              <span className="text-white text-xs font-black uppercase tracking-widest">Chat History Sanitized</span>
              <span className="text-white/70 text-[10px] font-medium leading-none">The session chat has been cleared by administration.</span>
            </div>
            <button 
              onClick={() => setIsChatClearedNotify(false)}
              className="text-white hover:bg-white/10 rounded-full h-8 px-4 text-[10px] font-black uppercase border border-white/20 ml-2"
            >
              Okay
            </button>
          </motion.div>
        )}

        {isModAppointedNotify && (
          <motion.div
            key="mod-appointed-notify"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="absolute inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 max-w-sm w-full shadow-[0_0_50px_rgba(16,185,129,0.2)] text-center relative overflow-hidden">
               {/* Decorative glow */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full" />
               
               <div className="relative z-10">
                 <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-emerald-400 animate-pulse" />
                 </div>
                 <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">New Responsibilities</h2>
                 <p className="text-slate-400 text-sm mb-8 leading-relaxed">You have been appointed as a <span className="text-emerald-400 font-bold">Moderator</span>. You now have access to the Admin Panel to help manage the session.</p>
                 <button 
                  onClick={() => setIsModAppointedNotify(false)}
                  className="w-full py-4 rounded-2xl bg-emerald-500 text-slate-950 font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                 >
                  I'm Ready
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Floating Reactions Overlay (High Fidelity) */}
      <div className="absolute inset-0 pointer-events-none z-[60] overflow-hidden">
        <AnimatePresence>
          {activeReactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ y: '105vh', x: `${r.x}%`, opacity: 0, scale: 0, rotate: -20 }}
              animate={{ 
                y: '-20vh', 
                opacity: [0, 1, 1, 0.8, 0], 
                scale: [0, 1.2, 1, 1.1, 0.8],
                rotate: [ -20, 10, -10, 20, 0 ]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 4.5 + Math.random(), 
                ease: [0.23, 1, 0.32, 1],
                times: [0, 0.1, 0.4, 0.8, 1]
              }}
              className="absolute text-5xl filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] select-none pointer-events-none"
              style={{ left: 0 }}
            >
              <div className="relative">
                <img src={r.emoji} alt="reaction" className="w-12 h-12 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.4)]" />
                {/* Subtle outer glow for premium feel */}
                <div className="absolute inset-0 blur-lg opacity-30 bg-white/20 rounded-full scale-150 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── HEADER ── */}
      <header className="relative flex-shrink-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg overflow-hidden">
        {/* Banner Layer */}
        {room?.banner && (
          <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none">
            {room.banner.startsWith('http') || room.banner.startsWith('/') || room.banner.includes('.') ? (
              <img 
                src={room.banner.startsWith('http') ? room.banner : `${import.meta.env.VITE_API_URL || ''}${room.banner}`} 
                alt="" 
                className="w-full h-full object-cover blur-[2px]" 
                onError={(e) => {
                  (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                }}
              />
            ) : (
              <div className={cn("w-full h-full bg-gradient-to-br", room.banner)} />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-slate-950/80" />
            <div className="absolute inset-0 bg-slate-950/20" />
          </div>
        )}
        
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="group flex items-center gap-2 p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider pr-1">Exit</span>
          </button>
          
          <div className="h-8 w-px bg-white/10 hidden sm:block" />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-black text-sm sm:text-lg tracking-tight truncate max-w-[140px] sm:max-w-[400px]">
                {room?.topic || 'Practice Session'}
              </h1>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">{formatTime(sessionTime)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-500/60" />
                Live Network · {participants.length} Active
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 text-[11px] font-bold text-slate-400">
             <div className="flex items-center gap-1.5 text-emerald-400/80">
                <Wifi className="w-3.5 h-3.5" />
                <span>Stable</span>
             </div>
             <div className="w-px h-3 bg-white/10" />
             <div className="flex items-center gap-1.5 text-blue-400/80">
                <Lock className="w-3.5 h-3.5" />
                <span>E2E Encrypted</span>
             </div>
             {room?.isPrivate && room?.roomCode && isHost && (
               <div className="flex items-center gap-3">
                 <div className="w-px h-4 bg-white/10" />
                 <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 mb-0.5">
                     <Crown className="w-2 h-2 text-amber-400 fill-amber-400/20" />
                     <span className="text-[8px] text-slate-500 font-black uppercase tracking-tighter leading-none">Owner Access</span>
                   </div>
                   <div
                     onClick={handleCopyCode}
                     className="group/code flex items-center gap-1.5 cursor-pointer"
                   >
                     <span className="font-mono text-emerald-400 tracking-[0.2em] text-xs font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
                       {room.roomCode}
                     </span>
                     <Copy className="w-2.5 h-2.5 text-slate-600 group-hover/code:text-emerald-400 transition-colors" />
                   </div>
                 </div>
               </div>
             )}
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10 active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Invite</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsSettingsOpen(true)}
              className={cn(
                "flex items-center gap-2 p-2 sm:p-2.5 rounded-xl transition-all active:scale-95",
                isSettingsOpen ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(52,211,153,0.2)]" : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
              )}
              title="Room Settings"
            >
              <Settings className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </button>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="flex-1 min-h-0 relative bg-slate-950 overflow-hidden">
        <div className={cn(
          "h-full w-full transition-all duration-500 ease-[0.22, 1, 0.36, 1] relative flex flex-col",
          (isChatOpen || isPanelOpen) ? "lg:pr-[360px] xl:pr-[400px]" : ""
        )}>
          <div className="flex-1 p-2 sm:p-4 min-h-0 relative flex flex-col gap-4">
            <div className="flex-1 min-h-0 relative">
              <div className={cn(
                "h-full w-full grid gap-2 sm:gap-4 transition-all duration-500",
                featuredList.length === 1 ? "grid-cols-1" : 
                featuredList.length === 2 ? "grid-cols-1 sm:grid-cols-2" :
                featuredList.length <= 4 ? "grid-cols-2" :
                "grid-cols-2 lg:grid-cols-3"
              )}>
                {featuredList.map((f, idx) => (
                  <VideoTile
                    key={f.userId}
                    userId={f.userId}
                    displayName={f.name}
                    avatar={f.avatar}
                    stream={f.stream}
                    isMuted={f.userId === currentUserId ? !isMicOn : false}
                    isVideoOff={f.userId === currentUserId ? !isVideoOn : false}
                    isSpeaking={speakingUsers.has(f.userId)}
                    isPinned={pinnedUserId === f.userId}
                    isHandRaised={f.userId === currentUserId ? isHandRaised : handsRaised.has(f.userId)}
                    isHost={room?.hostId === f.userId}
                    isLocal={f.isLocal}
                    isModerator={f.isModerator}
                    onPin={() => handlePin(f.userId)}
                    size="featured"
                    latency={latencies[f.userId]}
                    masterMute={!isSpeakerOn}
                    className={cn(
                      featuredList.length === 3 && idx === 0 ? "sm:col-span-2" : ""
                    )}
                  />
                ))}
              </div>

              {/* Speaker indicators (Floating) */}
              <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col gap-2 z-20 pointer-events-none">
                {Array.from(speakingUsers).slice(0, 3).map(uid => {
                  const p = participantMap.get(uid);
                  return (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={uid} 
                      className="flex items-center gap-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 text-[10px] text-emerald-400 font-bold shadow-lg"
                    >
                      <AudioWave active={true} />
                      <span className="truncate max-w-[80px]">{p?.fullName || 'Active'}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {thumbList.length > 0 && (
              <div className="flex-shrink-0 w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
                <div className="flex gap-3 w-max min-w-full justify-center">
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
                      isHandRaised={t.userId === currentUserId ? isHandRaised : handsRaised.has(t.userId)}
                      isHost={room?.hostId === t.userId}
                      isLocal={t.isLocal}
                      isModerator={t.isModerator}
                      onPin={() => handlePin(t.userId)}
                      size="thumb"
                      latency={latencies[t.userId]}
                      masterMute={!isSpeakerOn}
                    />
                  ))}
                  {participants.length > thumbList.length + featuredList.length && (
                    <button 
                      onClick={() => setIsPanelOpen(true)}
                      className="w-24 h-20 sm:w-44 sm:h-28 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-white/10 hover:text-slate-300 transition-all cursor-pointer group"
                    >
                      <div className="p-2 rounded-xl bg-slate-800 group-hover:bg-emerald-500/10 transition-colors">
                        <Users className="w-5 h-5 group-hover:text-emerald-400" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">+{participants.length - thumbList.length - featuredList.length} More</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="absolute inset-y-2 right-2 w-[340px] sm:w-[380px] z-50 flex flex-col bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
              >
                {/* Mobile close button inside header for chat */}
                <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/5">
                  <span className="text-white font-bold text-sm h-6">Session Chat</span>
                  <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white">
                    <ChevronLeft className="w-5 h-5 -rotate-90" />
                  </button>
                </div>
                
                <Suspense fallback={<div className="flex-1 flex items-center justify-center p-8"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>}>
                    <RoomChat 
                      roomId={roomId!} 
                      currentUserId={currentUserId} 
                      participants={participants} 
                      messages={chatMessages}
                      setMessages={setChatMessages}
                      messageReactions={chatMessageReactions}
                      setMessageReactions={setChatMessageReactions}
                    />
                 </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
 
          {/* ── PARTICIPANTS PANEL ── */}
          <Suspense fallback={null}>
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
          </Suspense>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <footer className="flex-shrink-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 px-2 sm:px-4 py-2.5 sm:py-3">
        {/* Thin emerald top accent line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

        <div ref={controlsWrapperRef} className="relative flex items-center justify-center gap-3 sm:gap-3 max-w-3xl mx-auto px-2">
          <ControlButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleMic();
            }}
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
          {/* Reactions Toggle - hidden on small screens */}
          <div className="relative hidden sm:flex">
            <EmojiSelectorPopover
              isOpen={isReactionSelectorOpen}
              onClose={() => setIsReactionSelectorOpen(false)}
              onSelect={(emoji) => {
                handleSendReaction(emoji.src || emoji.name);
              }}
              className="!left-0 !right-auto"
            />
            
            <ControlButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsReactionSelectorOpen(!isReactionSelectorOpen);
              }}
              active={isReactionSelectorOpen}
              activeIcon={<Smile className="w-5 h-5 text-emerald-400" />}
              inactiveIcon={<Smile className="w-5 h-5" />}
              label="React"
            />
          </div>

          <ControlButton
            onClick={() => setIsHandRaised(p => !p)}
            active={isHandRaised}
            activeIcon={<Hand className="w-5 h-5" />}
            inactiveIcon={<Hand className="w-5 h-5" />}
            label="Hand"
            variant="warn"
          />

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-700/60 mx-1" />

          {/* People - hidden on small screens */}
          <div className="hidden sm:flex">
            <ControlButton
              onClick={() => { 
                setIsPanelOpen(p => !p); 
                if (!isPanelOpen) setIsChatOpen(false); 
              }}
              active={isPanelOpen}
              activeIcon={<Users className="w-5 h-5" />}
              inactiveIcon={<Users className="w-5 h-5" />}
              label="People"
              badge={participants.length > 0 ? participants.length : undefined}
            />
          </div>
          {/* Chat - hidden on small screens */}
          <div className="hidden sm:flex">
            <ControlButton
              onClick={() => { 
                setIsChatOpen(p => !p); 
                if (!isChatOpen) setIsPanelOpen(false); 
              }}
              active={isChatOpen}
              activeIcon={<MessageSquare className="w-5 h-5" />}
              inactiveIcon={<MessageSquare className="w-5 h-5" />}
              label="Chat"
            />
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-slate-700/60 mx-1" />

          {/* Three-dot menu - only shows on small screens */}
          <div ref={moreMenuRef} className="relative sm:hidden">
            <ControlButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMoreMenuOpen(!isMoreMenuOpen);
              }}
              active={isMoreMenuOpen}
              activeIcon={<MoreHorizontal className="w-5 h-5" />}
              inactiveIcon={<MoreHorizontal className="w-5 h-5" />}
              label="More"
            />
            
            {/* Mobile More Menu */}
            <AnimatePresence>
              {isMoreMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-[calc(100%+16px)] right-0 left-auto w-52 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
                >
                  <div className="flex flex-col p-1">
                    {/* React */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreMenuOpen(false);
                        setIsReactionSelectorOpen(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
                    >
                      <Smile className="w-5 h-5" />
                      <span className="text-sm font-medium">React</span>
                    </button>
                    
                    {/* People */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreMenuOpen(false);
                        setIsPanelOpen(true);
                        setIsChatOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
                    >
                      <Users className="w-5 h-5" />
                      <span className="text-sm font-medium">People</span>
                      {participants.length > 0 && (
                        <span className="ml-auto text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">
                          {participants.length}
                        </span>
                      )}
                    </button>
                    
                    {/* Chat */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreMenuOpen(false);
                        setIsChatOpen(true);
                        setIsPanelOpen(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
                    >
                      <MessageSquare className="w-5 h-5" />
                      <span className="text-sm font-medium">Chat</span>
                    </button>
                    
                    {/* Settings */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMoreMenuOpen(false);
                        setIsSettingsOpen(true);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="text-sm font-medium">Settings</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Mobile Emoji Selector */}
            <EmojiSelectorPopover
              isOpen={isReactionSelectorOpen}
              onClose={() => setIsReactionSelectorOpen(false)}
              onSelect={(emoji) => {
                handleSendReaction(emoji.src || emoji.name);
              }}
              className="!left-0 !right-auto"
            />
          </div>

          {/* Leave — styled like the app's destructive button */}
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400/50 text-red-400 hover:text-red-300 font-medium transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
          >
            <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] font-semibold hidden sm:block leading-none">Leave</span>
          </button>
        </div>
      </footer>
 
      {/* ── LEAVE CONFIRMATION MODAL ── */}
      <RoomWarningModal 
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        type="exit"
        title="Exit Session?"
        description="Are you sure you want to leave this practice room? You can join back anytime if the session is still active."
        actionLabel="Leave Now"
        onAction={handleLeaveRoom}
        secondaryActionLabel="Stay here"
      />

      <RoomWarningModal 
        isOpen={warningModal.isOpen}
        onClose={() => navigate('/dashboard?view=rooms')}
        type={warningModal.type}
        title={warningModal.title}
        description={warningModal.description}
        actionLabel="Go to Dashboard"
        onAction={() => navigate('/dashboard?view=rooms')}
      />

      <RoomSettingsPanel 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        participants={participants}
        blockedUsers={room?.blockedUsers || []}
        moderators={room?.moderators || []}
        hostId={room?.hostId || ''}
        localUserId={currentUserId}
        isLocked={isRoomLocked}
        onKick={(uid) => roomService.kickUser(roomId!, uid)}
        onMute={(uid) => roomService.muteUser(roomId!, uid)}
        onBlock={(uid) => {
          roomService.kickUser(roomId!, uid, true);
          toast({ title: 'User Blocked', description: 'Participant has been removed and blocked from this room.' });
        }}
        onUnblock={(uid) => {
          roomService.unblockUser(roomId!, uid);
          toast({ title: 'User Unblocked', description: 'Participant can now re-join this session.' });
        }}
        onToggleLock={() => roomService.toggleRoomLock(roomId!, !isRoomLocked)}
        onToggleModerator={(uid, isMod) => {
          roomService.toggleModerator(roomId!, uid, isMod);
        }}
        onMuteAll={() => {
          roomService.muteAllParticipants(roomId!);
        }}
        onClearChat={() => {
          roomService.clearRoomChat(roomId!);
        }}
      />
    </div>
  );
};

export default PracticeRoomPage;
