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
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isBlockedModalOpen, setIsBlockedModalOpen] = useState(false);
  const [lockedRoomTopic, setLockedRoomTopic] = useState('');
 
  const handleCreateInstantRoom = async () => {
    try {
      setIsCreatingRoom(true);
      const newRoom = await roomService.createRoom({
        topic: 'Instant Practice Session',
        description: 'A quick spontaneous conversation to practice English speaking skills.',
        banner: BANNER_PRESETS[Math.floor(Math.random() * BANNER_PRESETS.length)].id,
        maxParticipants: 10,
        isPrivate: false,
      });
 
      toast({ title: 'Room ready!', description: 'Your instant practice room has been created.' });
      navigate(`/practice-room/${newRoom.roomId}`);
    } catch (e: unknown) {
      const err = e instanceof Error ? e : new Error('Unable to create an instant room');
      console.error('[RoomsView] instant room create failed:', err);
      toast({ title: 'Create failed', description: err.message || 'Unable to create an instant room.', variant: 'destructive' });
    } finally {
      setIsCreatingRoom(false);
    }
  };

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
    <div className="min-h-screen relative overflow-x-hidden bg-slate-50 dark:bg-slate-950 font-sans">
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
          onInstantCreateClick={handleCreateInstantRoom}
          isCreatingRoom={isCreatingRoom}
          onBrowseClick={() => {
            document.getElementById('active-rooms-section')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Create Room Modal Header */}
        <CreateRoomModal 
          isOpen={isCreateDialogOpen} 
          onClose={() => setIsCreateDialogOpen(false)} 
        />

        {/* Rooms List - Light & Dark Modern Design */}
        <section id="active-rooms-section" className="relative mt-6 lg:-mt-4 pb-16 z-20">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] text-emerald-600 dark:text-emerald-400 font-bold drop-shadow-sm">Available rooms</p>
              <h2 className="mt-2 text-2xl sm:text-4xl font-semibold text-slate-900 dark:text-white tracking-tight">Browse live practice sessions</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 bg-slate-100/80 dark:bg-slate-950/60 p-1 sm:p-1.5 rounded-full border border-slate-200 dark:border-slate-800 w-max max-w-full">
              {(['top', 'newest'] as const).map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRoomSort(option)}
                  className={cn(
                    'rounded-full px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300',
                    roomSort === option
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  )}
                >
                  {option === 'top' ? 'Top Members' : 'Newest First'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search rooms..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white/80 dark:bg-slate-950/80 pl-10 sm:pl-14 pr-4 py-3 sm:py-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm font-medium text-sm sm:text-lg"
              />
            </div>
            <button
              onClick={fetchRooms}
              className="inline-flex h-[60px] sm:w-[150px] items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-800 px-6 font-semibold text-white hover:bg-slate-800 dark:hover:bg-slate-700 hover:shadow-lg active:scale-95 transition-all text-base"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Refresh'}
            </button>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                 <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mb-5" />
                 <p className="font-medium animate-pulse text-lg">Loading active sessions...</p>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-16 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
                 <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6 border border-slate-200 dark:border-slate-700">
                    <MessageCircle className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No active rooms</h3>
                 <p className="text-slate-600 dark:text-slate-400 text-lg max-w-sm">There are no matching active sessions. Be the first to create one and start practicing!</p>
                 <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl px-10 py-6 text-lg shadow-lg transition-all hover:scale-105 active:scale-95">
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
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-emerald-500/30">
                  
                  {/* Banner Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                    {(() => {
                      const preset = BANNER_PRESETS.find(p => p.id === room.banner);
                      
                      if (room.banner?.startsWith('data:image') || room.banner?.startsWith('http')) {
                        return (
                          <img 
                            src={room.banner} 
                            alt="Room Banner" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        );
                      } else if (preset) {
                        return (
                          <div className={cn("w-full h-full group-hover:scale-105 transition-transform duration-500", preset.bgClass)}>
                             {preset.elements}
                          </div>
                        );
                      } else {
                        return (
                          <div className={cn("w-full h-full bg-gradient-to-br", room.banner || 'from-emerald-400 via-emerald-500 to-teal-600')}>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl font-bold text-white/30">Practice</span>
                            </div>
                          </div>
                        );
                      }
                    })()}

                    {/* Live Badge */}
                    {room.status === 'active' && (
                      <div className="absolute top-4 left-4">
                        <div className="flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          LIVE
                        </div>
                      </div>
                    )}

                    {/* Participants Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                        <Users className="w-3.5 h-3.5" />
                        <span>{room.participantCount}/{room.maxParticipants}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Room Title */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {room.topic}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                      {room.description || 'Engaging English practice conversation for all levels.'}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                      </div>
                      {room.isPrivate && (
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5" />
                          <span>Private</span>
                        </div>
                      )}
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        room.status === 'active' 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
                      )}>
                        {room.status === 'active' ? 'Active' : 'Closed'}
                      </span>
                      {room.isLocked && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                          Locked
                        </span>
                      )}
                    </div>

                    {/* Join Button */}
                    <Button 
                      onClick={() => handleJoinRoom(room)}
                      disabled={room.status !== 'active' || room.participantCount >= room.maxParticipants}
                      className={cn(
                        "w-full h-11 rounded-xl text-sm font-bold transition-all",
                        room.status === 'active' && room.participantCount < room.maxParticipants
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                      )}
                    >
                      {room.status === 'active' && room.participantCount < room.maxParticipants ? (
                        <>
                          Join Room
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </>
                      ) : room.participantCount >= room.maxParticipants ? (
                        "Room Full"
                      ) : (
                        "Closed"
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
