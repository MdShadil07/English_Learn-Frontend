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
  Loader2
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

const RoomsView = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState<RoomDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Create room form state
  const [createForm, setCreateForm] = useState({
    maxParticipants: 10,
    isPrivate: false,
    topic: '',
    description: ''
  });

  useEffect(() => {
    fetchRooms();
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

  const handleCreateRoom = async () => {
    if (!createForm.topic.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a room topic.',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsCreating(true);
      const newRoom = await roomService.createRoom({
        maxParticipants: createForm.maxParticipants,
        isPrivate: createForm.isPrivate,
        topic: createForm.topic,
        description: createForm.description
      });

      toast({
        title: 'Room Created!',
        description: 'Your practice room is ready. Joining now...',
      });

      setIsCreateDialogOpen(false);
      // Reset form
      setCreateForm({
        maxParticipants: 10,
        isPrivate: false,
        topic: '',
        description: ''
      });

      // Navigate to the new room
      navigate(`/practice-room/${newRoom.roomId}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast({
        title: 'Error',
        description: 'Failed to create room. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (room: RoomDetails) => {
    try {
      await roomService.joinRoom(room.roomId);
      navigate(`/practice-room/${room.roomId}`);
    } catch (error: any) {
      if (error.response?.status === 409) {
        // Already joined, navigate anyway
        navigate(`/practice-room/${room.roomId}`);
      } else {
        console.error('Error joining room:', error);
        toast({
          title: 'Error',
          description: 'Failed to join room. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const filteredRooms = rooms.filter(room =>
    !room.isPrivate && (
      room.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.roomId?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10">
        {/* Neural Network Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.3'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Cpath d='M7 7 L27 7 M27 7 L47 7 M7 27 L27 27 M27 27 L47 27 M7 47 L27 47 M27 47 L47 47 M7 7 L7 27 M7 27 L7 47 M27 7 L27 27 M27 27 L27 47 M47 7 L47 27 M47 27 L47 47' stroke='%23000000' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Gradient Orbs */}
        <div className="absolute top-[10%] right-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-emerald-100/30 to-teal-100/20 blur-3xl dark:from-emerald-900/10 dark:to-teal-900/5 animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-100/20 to-emerald-100/30 blur-3xl dark:from-cyan-900/5 dark:to-emerald-900/10 animate-pulse" />
        <div className="absolute top-[50%] left-[50%] w-64 h-64 rounded-full bg-gradient-to-bl from-purple-100/15 to-pink-100/25 blur-3xl dark:from-purple-900/5 dark:to-pink-900/10 animate-pulse" />
      </div>

      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Card className="relative overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white/95 via-slate-50/90 to-emerald-50/80 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-emerald-950/80 backdrop-blur-xl">
            {/* Animated border */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-lg blur-sm" />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-lg" />

            <CardContent className="relative p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-lg">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      Practice Rooms
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mt-1">
                      Join live sessions and practice with others in real-time
                    </p>
                  </div>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Plus className="mr-2 h-5 w-5" />
                      Create Room
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/50">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-emerald-500" />
                        Create Practice Room
                      </DialogTitle>
                      <DialogDescription>
                        Set up your practice session and invite others to join.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic">Room Topic *</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., Business English Practice"
                          value={createForm.topic}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, topic: e.target.value }))}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe what this practice session is about..."
                          value={createForm.description}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                          className="mt-1"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxParticipants">Max Participants</Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          min="2"
                          max="50"
                          value={createForm.maxParticipants}
                          onChange={(e) => setCreateForm(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 10 }))}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Private Room</Label>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Only invited participants can join
                          </p>
                        </div>
                        <Switch
                          checked={createForm.isPrivate}
                          onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isPrivate: checked }))}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateRoom}
                        disabled={isCreating}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Create Room
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white/90 to-slate-50/80 dark:from-slate-900/90 dark:to-slate-800/80 backdrop-blur-sm">
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-10", stat.gradient)} />
                <CardContent className="relative p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={cn('p-3 rounded-xl shadow-lg', stat.bgColor)}>
                      <stat.icon className={cn('h-6 w-6', stat.color)} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Rooms List */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-white/95 via-slate-50/90 to-emerald-50/80 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-emerald-950/80 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-emerald-500" />
                  Your Rooms
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Loading your rooms...' : `You have ${filteredRooms.length} practice room${filteredRooms.length !== 1 ? 's' : ''}`}
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-400">Loading rooms...</span>
                </div>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gradient-to-br from-slate-100 to-emerald-100 dark:from-slate-800 dark:to-emerald-900 rounded-full w-fit mx-auto mb-4">
                  <Video className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {searchQuery ? 'No rooms found' : 'No practice rooms yet'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {searchQuery ? 'Try adjusting your search terms.' : 'Create your first practice room to get started!'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Room
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredRooms.map((room, index) => (
                    <motion.div
                      key={room.roomId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="group relative overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/30 backdrop-blur-sm">
                        {/* Animated border */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />

                        <CardContent className="relative p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
                              <Video className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={room.status === 'active' ? 'default' : 'secondary'}
                                className={cn(
                                  "shadow-sm",
                                  room.status === 'active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                                    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                                )}
                              >
                                {room.status === 'active' ? (
                                  <>
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                                    Live
                                  </>
                                ) : (
                                  'Closed'
                                )}
                              </Badge>
                              {room.isPrivate && (
                                <Badge variant="outline" className="border-slate-300 dark:border-slate-600">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Private
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">
                                {room.topic || 'Practice Session'}
                              </h3>
                              {room.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                                  {room.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{room.participantCount}/{room.maxParticipants}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                              <div className="text-xs text-slate-500 dark:text-slate-500">
                                Room ID: {room.roomId}
                              </div>
                              <Button
                                onClick={() => handleJoinRoom(room)}
                                disabled={room.status !== 'active' || room.isFull}
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                              >
                                {room.status === 'active' ? (
                                  room.isFull ? (
                                    <>
                                      <UserPlus className="mr-2 h-4 w-4" />
                                      Full
                                    </>
                                  ) : (
                                    <>
                                      <Play className="mr-2 h-4 w-4" />
                                      Join Now
                                    </>
                                  )
                                ) : (
                                  'Closed'
                                )}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoomsView;
