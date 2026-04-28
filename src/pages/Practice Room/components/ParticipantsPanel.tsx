import { AnimatePresence, motion } from 'framer-motion';
import { Crown, ChevronLeft, Pin, PinOff, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { cn } from '../../../lib/utils';
import { PeerConnection, RoomParticipant } from '../../../services/roomService';

interface ParticipantsPanelProps {
  participants: RoomParticipant[];
  hostId: string;
  peerConnections: Map<string, PeerConnection>;
  speakingUsers: Set<string>;
  localUserId: string;
  pinnedUserId: string | null;
  isOpen: boolean;
  onClose(): void;
  onPin(userId: string): void;
}

const ParticipantsPanel = ({
  participants,
  hostId,
  peerConnections,
  speakingUsers,
  localUserId,
  pinnedUserId,
  isOpen,
  onClose,
  onPin,
}: ParticipantsPanelProps) => {
  const inCallIds = new Set([localUserId, ...Array.from(peerConnections.keys())]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onClose}
          />

          <motion.aside
            key="panel"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-y-2 right-2 w-[340px] sm:w-[380px] z-[70] flex flex-col bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-sm tracking-tight text-white h-6">Participants</h2>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{participants.length} Active</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <ChevronLeft className="w-5 h-5 -rotate-90" />
              </button>
            </div>

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
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all duration-150"
                  >
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-10 h-10 border border-white/5 shadow-inner">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {isSpeaking && (
                        <span className="absolute -inset-0.5 rounded-full border-2 border-emerald-500 animate-pulse" />
                      )}
                      <span className={cn(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-900',
                        isInCall ? 'bg-emerald-500' : 'bg-slate-600',
                      )} />
                    </div>
 
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {isRoomHost && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[9px] font-bold border border-amber-500/20 uppercase tracking-tighter">
                            <Crown className="w-2.5 h-2.5" />
                            Host
                          </span>
                        )}
                        {isPinned && <Pin className="w-3 h-3 text-emerald-400 flex-shrink-0" />}
                        <span className="text-white text-[13px] font-semibold truncate leading-none">
                          {p.fullName || p.username || 'Participant'}
                          {isLocal && <span className="ml-1 text-slate-500 font-normal text-[11px] font-normal">(you)</span>}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">
                        {isInCall
                          ? isSpeaking ? '🎤 Speaking...' : 'In conversation'
                          : 'Waiting...'}
                      </span>
                    </div>
 
                    {!isLocal && (
                      <button
                        onClick={() => onPin(p.userId)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-150"
                        title={isPinned ? 'Unpin' : 'Pin to main view'}
                      >
                        {isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/5 px-5 py-4 bg-slate-950/30">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.1em] text-center">
                {inCallIds.size} in call · {participants.length} total
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default ParticipantsPanel;
