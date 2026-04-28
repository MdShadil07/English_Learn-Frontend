import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, X, Shield, MicOff, UserMinus, Ban, 
  Lock, Unlock, MessageSquareOff, Hand, Users, ArrowLeft,
  ShieldAlert, Trash2, VolumeX
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { cn } from '../../../lib/utils';
import { RoomParticipant } from '../../../services/roomService';

interface RoomSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  participants: RoomParticipant[];
  blockedUsers: RoomParticipant[];
  hostId: string;
  localUserId: string;
  onKick: (userId: string) => void;
  onMute: (userId: string) => void;
  onBlock: (userId: string) => void;
  onUnblock: (userId: string) => void;
  onToggleLock: () => void;
  onToggleModerator: (userId: string, isMod: boolean) => void;
  onMuteAll: () => void;
  onClearChat: () => void;
  isLocked: boolean;
  moderators: string[];
}

const RoomSettingsPanel = ({
  isOpen,
  onClose,
  participants,
  blockedUsers = [],
  hostId,
  localUserId,
  onKick,
  onMute,
  onBlock,
  onUnblock,
  onToggleLock,
  onToggleModerator,
  onMuteAll,
  onClearChat,
  isLocked,
  moderators = []
}: RoomSettingsPanelProps) => {
  const isHost = localUserId === hostId;
  const isLocalModerator = moderators.includes(localUserId);
  const isAdmin = isHost || isLocalModerator;

  if (!isAdmin && isOpen) {
     onClose();
     return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-slate-900 border-l border-white/10 z-[110] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50 backdrop-blur-xl sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{isHost ? 'Admin Control' : 'Moderator Panel'}</h2>
                  <p className="text-[10px] text-slate-400 font-medium font-mono uppercase tracking-widest leading-none">{isHost ? 'Host Privileges' : 'Enforcement Tools'}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="rounded-xl hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 pb-12">
                {/* General Security */}
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Security Settings
                  </h3>
                  <div className="space-y-3">
                    <div className={cn(
                      "p-4 rounded-2xl border transition-all duration-300",
                      isLocked ? "bg-amber-500/5 border-amber-500/20" : "bg-white/5 border-white/5"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            isLocked ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
                          )}>
                            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Lock Room</p>
                            <p className="text-[10px] text-slate-500 font-medium">Prevent new participants from joining</p>
                          </div>
                        </div>
                        <Button 
                          variant={isLocked ? "default" : "secondary"}
                          size="sm"
                          onClick={onToggleLock}
                          disabled={!isAdmin}
                          className={cn(
                            "rounded-lg px-4 font-bold text-[11px]",
                            isLocked ? "bg-amber-500 hover:bg-amber-600 text-black shadow-lg shadow-amber-950/20" : "bg-slate-800 text-slate-300 hover:bg-slate-700",
                            !isAdmin && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {isLocked ? 'Room Locked' : 'Lock Room'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Global Session Controls */}
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Settings className="w-3 h-3" />
                    Global Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onMuteAll}
                      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all gap-2 group"
                    >
                      <div className="p-1.5 sm:p-2 rounded-xl bg-red-500/20 group-hover:scale-110 transition-transform">
                        <VolumeX className="w-3.5 h-3.5 sm:w-4 h-4 text-red-500" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-red-400 uppercase tracking-tighter">Mute Everyone</span>
                    </button>

                    <button
                      onClick={onClearChat}
                      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-800 border border-white/5 hover:bg-slate-700 transition-all gap-2 group"
                    >
                      <div className="p-1.5 sm:p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Clear Chat</span>
                    </button>
                  </div>
                </section>

                {/* Participant Management */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      Manage Members
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/20">
                      {participants.length} TOTAL
                    </span>
                  </div>
                  <div className="space-y-2">
                    {participants.filter(p => p.userId !== localUserId).map(p => {
                      const isTargetHost = p.userId === hostId;
                      const isTargetMod = moderators.includes(p.userId);
                      const canModerate = !isTargetHost; // Nobody can moderate the host

                      return (
                        <div 
                          key={p.userId}
                          className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-200"
                        >
                          <Avatar className="w-10 h-10 border border-white/10 shadow-lg">
                            <AvatarImage src={p.avatar} />
                            <AvatarFallback className="bg-slate-800 text-slate-400 font-bold">
                              {p.fullName?.[0] || '?'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-white truncate">{p.fullName}</p>
                              {isTargetMod && <Shield className="w-3 h-3 text-blue-400" title="Moderator" />}
                            </div>
                            <p className="text-[10px] text-slate-500 font-mono">ID: {p.userId.slice(-6)}</p>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Host only: Toggle Moderator */}
                            {isHost && !isTargetHost && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => onToggleModerator(p.userId, !isTargetMod)}
                                title={isTargetMod ? "Revoke Moderator Role" : "Appoint as Moderator"}
                                className={cn(
                                  "w-9 h-9 rounded-xl transition-all duration-300",
                                  isTargetMod 
                                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-400" 
                                    : "text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent"
                                )}
                              >
                                <Shield className={cn("w-4 h-4", isTargetMod && "fill-current")} />
                              </Button>
                            )}

                            {canModerate && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => onMute(p.userId)}
                                  title="Mute Mic"
                                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-400/10"
                                >
                                  <MicOff className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => onKick(p.userId)}
                                  title="Kick from Room"
                                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                                >
                                  <UserMinus className="w-4 h-4" />
                                </Button>
                                {isHost && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => onBlock(p.userId)}
                                    title="Block & Ban"
                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-red-600"
                                  >
                                    <Ban className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {participants.length <= 1 && (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 px-6">
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 opacity-50">
                           <Users className="w-6 h-6 text-slate-500" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium">No other participants to manage yet.</p>
                      </div>
                    )}
                  </div>
                </section>
                {/* Blocked Users management */}
                {blockedUsers.length > 0 && (
                  <section>
                    <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" />
                      Blacklisted Users
                    </h3>
                    <div className="space-y-2">
                       {blockedUsers.map(u => (
                         <div 
                          key={u.userId}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/5 border border-red-500/10"
                        >
                          <Avatar className="w-8 h-8 opacity-60">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback>{u.fullName?.[0] || '?'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-300 truncate">{u.fullName}</p>
                            <p className="text-[10px] text-red-400 font-mono">BLOCKED</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => onUnblock(u.userId)}
                            className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-black uppercase"
                          >
                            Unblock
                          </Button>
                        </div>
                       ))}
                    </div>
                  </section>
                )}
              </div>
            </ScrollArea>

            {/* Footer Tip */}
            <div className="p-4 sm:p-6 bg-slate-950/50 border-t border-white/5">
               <div className="flex items-start gap-3 p-3 sm:p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <Shield className="w-3.5 h-3.5 sm:w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-amber-500 mb-0.5 sm:mb-1">Host Tip</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 leading-relaxed">
                      Actions taken here are immediate. Kicked users can rejoin unless you Lock the room or Block them permanently.
                    </p>
                  </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoomSettingsPanel;
