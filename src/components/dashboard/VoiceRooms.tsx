import { motion } from 'framer-motion';
import { Video, Users, Mic, MicOff, PhoneOff, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const VoiceRooms = () => {
  const activeRooms = [
    { id: '1', name: 'Business English', participants: 8, topic: 'Professional Communication', level: 'Intermediate' },
    { id: '2', name: 'Casual Chat', participants: 12, topic: 'Daily Conversations', level: 'All Levels' },
    { id: '3', name: 'IELTS Prep', participants: 6, topic: 'Test Preparation', level: 'Advanced' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">Voice Rooms</h1>
                  <p className="text-lg text-white/90">Practice speaking with others live</p>
                </div>
              </div>
              <Button className="bg-white text-indigo-600 hover:bg-white/90">
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Active Voice Room
              </CardTitle>
              <CardDescription>Business English Discussion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-4">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium">User {i}</p>
                      <Badge variant="secondary" className="text-xs">
                        <Mic className="h-3 w-3 mr-1" />
                        Speaking
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center gap-4 pt-6">
                <Button size="lg" variant="outline" className="rounded-full h-14 w-14">
                  <Mic className="h-6 w-6" />
                </Button>
                <Button size="lg" variant="destructive" className="rounded-full h-16 w-16">
                  <PhoneOff className="h-6 w-6" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-14 w-14">
                  <Settings className="h-6 w-6" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Available Rooms</CardTitle>
              <CardDescription>Join a live session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-xs text-muted-foreground">{room.topic}</p>
                      </div>
                      <Badge className="bg-green-500">Live</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{room.participants} active</span>
                      <span>•</span>
                      <span>{room.level}</span>
                    </div>
                    <Button size="sm" className="w-full mt-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                      Join Room
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoiceRooms;
