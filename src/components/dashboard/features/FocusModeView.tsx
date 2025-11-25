import { motion } from 'framer-motion';
import { Zap, Clock, Target, TrendingUp, Play, Pause } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const FocusModeView = () => {
  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Focus Mode</h1>
                <p className="text-lg text-white/90">Distraction-free learning sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pomodoro Timer</CardTitle>
            <CardDescription>25 minutes of focused learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="none" className="text-primary" strokeDasharray="552" strokeDashoffset="138" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold">25:00</span>
                  <span className="text-sm text-muted-foreground">Focus Time</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white" size="lg">
              <Play className="mr-2 h-5 w-5" />
              Start Focus Session
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your focus sessions today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed Sessions</span>
                <span className="text-2xl font-bold">4/8</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">2h 15m</p>
                <p className="text-xs text-muted-foreground">Total Focus Time</p>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <Target className="h-5 w-5 text-primary mb-2" />
                <p className="text-2xl font-bold">95%</p>
                <p className="text-xs text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FocusModeView;
