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
    <div className="min-h-screen p-3 sm:p-6 space-y-4 sm:space-y-8 overflow-x-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
          <CardContent className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-lg flex-shrink-0">
                  <Video className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white truncate max-w-[200px] xs:max-w-none">Voice Rooms</h1>
                  <p className="text-sm sm:text-lg text-white/90 truncate">Practice speaking live</p>
                </div>
              </div>
              <Button className="w-full sm:w-auto bg-white text-indigo-600 hover:bg-white/90 font-semibold shadow-lg">
                Create Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 min-w-0">
          <Card className="h-auto lg:h-[600px] min-w-0">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-2xl">
                <Video className="h-5 w-5 text-primary" />
                Active Voice Room
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Business English Discussion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-2 sm:p-4 border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col items-center gap-1 sm:gap-2">
                      <Avatar className="h-10 w-10 sm:h-16 sm:w-16 shadow-sm">
                        <AvatarFallback className="bg-emerald-50 text-emerald-700 text-xs sm:text-base">U{i}</AvatarFallback>
                      </Avatar>
                      <p className="text-[10px] sm:text-sm font-medium truncate w-full text-center">User {i}</p>
                      <Badge variant="secondary" className="text-[8px] sm:text-xs py-0 h-4 sm:h-5">
                        <Mic className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                        Live
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center gap-2 sm:gap-4 pt-4 sm:pt-6">
                <Button size="sm" variant="outline" className="rounded-full h-10 w-10 sm:h-14 sm:w-14">
                  <Mic className="h-4 w-4 sm:h-6 sm:w-6" />
                </Button>
                <Button size="lg" variant="destructive" className="rounded-full h-12 w-12 sm:h-16 sm:w-16 shadow-lg shadow-red-500/20">
                  <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
                <Button size="sm" variant="outline" className="rounded-full h-10 w-10 sm:h-14 sm:w-14">
                  <Settings className="h-4 w-4 sm:h-6 sm:w-6" />
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
