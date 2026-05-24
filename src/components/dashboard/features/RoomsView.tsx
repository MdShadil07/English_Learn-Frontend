import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Video,
  Mic,
  Plus,
  Search,
  Globe,
  Clock,
  Star,
  Crown,
  Shield,
  Sparkles,
  Zap,
  MessageCircle,
  UserPlus,
  Settings,
  Play,
  Loader2,
  Lock,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { roomService, RoomDetails } from '@/services/roomService';
import { useToast } from '@/hooks/use-toast';
import PracticeRoomHero from '@/pages/Practice Room/components/practiceRoomHero';
import CreateRoomModal from '@/pages/Practice Room/components/createRoomModel';
import { BANNER_PRESETS } from '@/pages/Practice Room/components/RoomBannerSelector';
import RoomWarningModal from '@/pages/Practice Room/components/RoomWarningModal';

const RoomsView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roomSort, setRoomSort] = useState<'top' | 'newest'>('top');
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [lockedRoomTopic, setLockedRoomTopic] = useState('');
 


  useEffect(() => {
    fetchRooms();

    // Listen for real-time lock updates
    const socket = roomService.connect();
    
    const h = (data: { roomId: string; isLocked: boolean }) => {
      setRooms(prev => prev.map(r => 
        r.roomId === data.roomId ? { ...r, isLocked: data.isLocked } : r
      ));
    };

    socket.on('room:lock-updated', h);

    return () => {
      socket.off('room:lock-updated', h);
    };
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const activeRooms = await roomService.getActiveRooms();
      setRooms(activeRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast({
        title: 'Error',
        description: 'Failed to load rooms. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };



  const handleJoinRoom = async (room: RoomDetails) => {
    try {
      await roomService.joinRoom(room.roomId);
      navigate(`/practice-room/${room.roomId}`);
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || '';
      if (error.response?.status === 409) {
        navigate(`/practice-room/${room.roomId}`);
      } else if (msg.toLowerCase().includes('blocked')) {
        setIsBlockedModalOpen(true);
      } else if (msg.toLowerCase().includes('locked')) {
        setLockedRoomTopic(room.topic);
        setIsLockedModalOpen(true);
      } else {
        console.error('Error joining room:', error);
        toast({
          title: 'Join failed',
          description: msg || 'Failed to join room. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const filteredRooms = rooms
    .filter(room =>
      !room.isPrivate && (
        room.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (roomSort === 'top') {
        return b.participantCount - a.participantCount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || b.participantCount - a.participantCount;
    });

  const stats = [
    {
      label: 'Active Rooms',
      value: rooms.filter(r => r.status === 'active').length.toString(),
      icon: Video,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-100/50 dark:bg-emerald-900/20',
      gradient: 'from-emerald-500/20 to-teal-500/20'
    },
    {
      label: 'Total Participants',
      value: rooms.reduce((acc, room) => acc + room.participantCount, 0).toString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100/50 dark:bg-blue-900/20',
      gradient: 'from-blue-500/20 to-indigo-500/20'
    },
    {
      label: 'Your Sessions',
      value: rooms.length.toString(),
      icon: Clock,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100/50 dark:bg-purple-900/20',
      gradient: 'from-purple-500/20 to-pink-500/20'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#f8fbff] dark:bg-[#070b14] font-sans transition-colors duration-500 ease-in-out">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-white"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-400/10 dark:bg-emerald-500/5 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] rounded-full bg-teal-500/5 blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      {/* Hero Section (Full width) */}
      <div className="relative z-10 w-full shrink-0">
        <PracticeRoomHero 
          onCreateClick={() => setIsCreateDialogOpen(true)}
          onBrowseClick={() => {
            document.getElementById('active-rooms-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Main Content Area - no max-width cap, expands with sidebar */}
      <div className="relative z-10 w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 py-8">
        {/* Create Room Modal Header */}
        <CreateRoomModal 
          isOpen={isCreateDialogOpen} 
          onClose={() => setIsCreateDialogOpen(false)} 
        />

        {/* Rooms List - Light & Dark Modern Design */}
        <section id="active-rooms-section" className="relative mt-6 lg:-mt-4 pb-16 z-20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between mb-2">
            <div>
              <p className="text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] text-emerald-600 dark:text-emerald-400 font-bold drop-shadow-sm">Available rooms</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">Browse live practice sessions</h2>
            </div>
          </div>

          {/* Unified Glassmorphic Filter Toolbar */}
          <div className="mb-10 mt-8 bg-white/50 dark:bg-[#090f1c]/60 backdrop-blur-2xl rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-lg dark:shadow-2xl/40 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            
            {/* Search Input Box */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search rooms by topic, description, or host..."
                className="w-full rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 pl-11 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all font-semibold text-sm shadow-inner"
              />
            </div>
            
            {/* Sort Tabs and Refresh Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="flex bg-slate-200/50 dark:bg-slate-950/60 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800">
                {(['top', 'newest'] as const).map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRoomSort(option)}
                    className={cn(
                      'rounded-xl px-4 py-2 text-xs font-black tracking-wide transition-all duration-300',
                      roomSort === option
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900/60'
                    )}
                  >
                    {option === 'top' ? 'Top Members' : 'Newest First'}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchRooms}
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 px-6 font-bold text-white hover:shadow-lg active:scale-95 transition-all text-xs tracking-wider"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 shadow-xl">
                 <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mb-6" />
                 <p className="font-bold animate-pulse text-lg tracking-tight">Loading active practice sessions...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-20 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center shadow-xl">
                 <div className="w-24 h-24 rounded-full bg-slate-100/80 dark:bg-slate-855/80 flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <MessageCircle className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                 </div>
                 <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No active rooms</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-lg max-w-sm font-medium">There are no matching active sessions. Be the first to create one and start practicing!</p>
                 <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl px-12 py-6 text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                    Create Practice Room
                 </Button>
              </div>
            ) : filteredRooms.map((room, idx) => (
              <motion.div
                key={room.roomId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5, type: "spring", stiffness: 100 }}
                className="group"
              >
                <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 shadow-md hover:shadow-2xl hover:shadow-emerald-500/5 hover:-translate-y-2 transition-all duration-500 hover:border-emerald-500/30">
                  
                  {/* Banner Image / Graphics */}
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-b border-slate-100 dark:border-slate-800/60">
                    {(() => {
                      const preset = BANNER_PRESETS.find(p => p.id === room.banner);
                      
                      if (room.banner?.startsWith('data:image') || room.banner?.startsWith('http')) {
                        return (
                          <img 
                            src={room.banner} 
                            alt="Room Banner" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                        );
                      } else if (preset) {
                        return (
                          <div className={cn("w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out", preset.bgClass)}>
                             {preset.elements}
                          </div>
                        );
                      } else {
                        return (
                          <div className={cn("w-full h-full bg-gradient-to-br group-hover:scale-110 transition-transform duration-700 ease-out", room.banner || 'from-emerald-400 via-emerald-500 to-teal-600')}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl font-bold text-white/30">Practice</span>
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {/* Gradient Overlay for bottom text styling */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                    {/* Live Badge */}
                    {room.status === 'active' && (
                      <div className="absolute top-4 left-4 z-20">
                        <div className="flex items-center gap-1.5 bg-red-500/90 text-white backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider shadow-md border border-red-500/30">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          LIVE
                        </div>
                      </div>
                    )}

                    {/* Participants Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <div className="flex items-center gap-1.5 bg-slate-950/65 backdrop-blur-sm text-white border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-bold shadow-md">
                        <Users className="w-3.5 h-3.5" />
                        <span>{room.participantCount}/{room.maxParticipants}</span>
                      </div>
                    </div>

                    {/* Overlay Host Avatar and Name */}
                    {(() => {
                      const hostName = room.hostName || 'Host';
                      const hostAvatar = room.hostAvatar;
                      return (
                        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-slate-950/65 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 shadow-sm max-w-[80%]">
                          <Avatar className="h-6 w-6 border border-white/20 shrink-0">
                            <AvatarImage src={hostAvatar} />
                            <AvatarFallback className="bg-emerald-500 text-white text-[9px] font-black">
                              {hostName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[10px] font-black text-white/90 truncate">
                            By {hostName}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Content Body */}
                  <div className="p-6">
                    {/* Room Title */}
                    <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors duration-300">
                      {room.topic}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {room.description || 'Engaging English practice conversation for all levels.'}
                    </p>

                    <div className="border-t border-slate-100 dark:border-slate-800/60 my-4" />

                    {/* Status & Meta Row */}
                    <div className="flex items-center gap-2 mb-5 flex-wrap">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                        room.status === 'active' 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                      )}>
                        {room.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                      
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1",
                        room.isPrivate
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                          : "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20"
                      )}>
                        {room.isPrivate ? <Shield className="w-3 h-3" /> : null}
                        {room.isPrivate ? 'Private' : 'Public'}
                      </span>

                      {room.isLocked && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          Locked
                        </span>
                      )}

                      <span className="text-[10px] text-slate-400 dark:text-slate-500 ml-auto font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(room.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Join Button */}
                    <Button 
                      onClick={() => handleJoinRoom(room)}
                      disabled={room.status !== 'active' || room.participantCount >= room.maxParticipants}
                      className={cn(
                        "w-full h-11 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn",
                        room.status === 'active' && room.participantCount < room.maxParticipants
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700"
                      )}
                    >
                      {room.status === 'active' && room.participantCount < room.maxParticipants ? (
                        <>
                          <span>Join Practice Session</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                        </>
                      ) : room.participantCount >= room.maxParticipants ? (
                        "Session is Full"
                      ) : (
                        "Session Closed"
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      {/* Locked Room Warning Modal */}
      <RoomWarningModal 
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
        type="locked"
        title="Session Locked"
        description={`The room "${lockedRoomTopic}" is currently restricted. The moderator has locked entry to new participants.`}
      />

      <RoomWarningModal 
        isOpen={isBlockedModalOpen}
        onClose={() => setIsBlockedModalOpen(false)}
        type="blocked"
        title="Access Denied"
        description="The host has blocked you from this specific room. You cannot re-join this session, but you can try joining other available rooms."
      />
    </div>
  </div>
);
};

export default RoomsView;
