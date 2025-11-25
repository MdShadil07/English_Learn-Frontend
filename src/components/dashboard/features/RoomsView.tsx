import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Video, Mic, Plus, Search, Globe, Clock, Star, Crown, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Room {
  id: string;
  name: string;
  topic: string;
  host: string;
  participants: number;
  maxParticipants: number;
  level: string;
  isLive: boolean;
  language: string;
  duration: string;
}

const RoomsView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const activeRooms: Room[] = [
    { id: '1', name: 'Business English Hub', topic: 'Professional Communication', host: 'Sarah Johnson', participants: 12, maxParticipants: 20, level: 'Intermediate', isLive: true, language: 'English', duration: '45 min' },
    { id: '2', name: 'Pronunciation Practice', topic: 'American Accent', host: 'Mike Chen', participants: 8, maxParticipants: 15, level: 'All Levels', isLive: true, language: 'English', duration: '30 min' },
    { id: '3', name: 'IELTS Speaking Prep', topic: 'Test Preparation', host: 'Emma Wilson', participants: 15, maxParticipants: 20, level: 'Advanced', isLive: true, language: 'English', duration: '60 min' },
    { id: '4', name: 'Casual Conversation', topic: 'Daily Topics', host: 'John Doe', participants: 6, maxParticipants: 10, level: 'Beginner', isLive: true, language: 'English', duration: '30 min' },
    { id: '5', name: 'Grammar Discussion', topic: 'Advanced Grammar', host: 'Lisa Park', participants: 10, maxParticipants: 15, level: 'Advanced', isLive: false, language: 'English', duration: 'Starting in 20 min' },
  ];

  const stats = [
    { label: 'Active Rooms', value: '24', icon: Video, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Total Participants', value: '156', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Your Sessions', value: '12', icon: Clock, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Practice Rooms</h1>
                  <p className="text-lg text-white/90">Join live sessions and practice with others</p>
                </div>
              </div>
              <Button className="bg-white text-emerald-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-full', stat.bgColor)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Rooms</CardTitle>
              <CardDescription>Join a room or create your own</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search rooms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                      <Video className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-lg">{room.name}</h3>
                        {room.isLive && <Badge className="bg-green-500">Live</Badge>}
                        {!room.isLive && <Badge variant="secondary">Scheduled</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{room.topic}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{room.participants}/{room.maxParticipants}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span>{room.level}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{room.duration}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-xs text-muted-foreground">Host: {room.host}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    {room.isLive ? 'Join Now' : 'Set Reminder'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomsView;
