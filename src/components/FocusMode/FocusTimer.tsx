import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Square, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FocusTimerProps {
  durationMinutes?: number;
  onComplete: () => void;
  onTick: (timeLeft: number) => void;
  isActive: boolean;
  onToggleActive: () => void;
  onStop: () => void;
}

const AMBIENT_TRACK = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"; // Royalty-free ambient track

export const FocusTimer: React.FC<FocusTimerProps> = ({
  durationMinutes = 25,
  onComplete,
  onTick,
  isActive,
  onToggleActive,
  onStop
}) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalTime = durationMinutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const strokeDashoffset = 552 - (552 * progress) / 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          onTick(prev - 1);
          return prev - 1;
        });
      }, 1000);
      
      // Play audio if unmuted
      if (audioRef.current && !isMuted) {
        audioRef.current.play().catch(() => {}); // Catch browser autoplay block errors
      }
    } else if (!isActive) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete, onTick, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      if (isMuted && isActive) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="group relative w-full max-w-md mx-auto p-[1px] rounded-[3rem] bg-emerald-200/40 dark:bg-emerald-500/10 shadow-2xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.1)] transition-all duration-700 hover:-translate-y-1">
      {/* Background pulsing glow based on state */}
      <div className={cn(
        "absolute -inset-1 opacity-20 blur-3xl transition-colors duration-1000 -z-10",
        isActive ? "bg-gradient-to-br from-emerald-500 to-teal-500 animate-[pulse_4s_ease-in-out_infinite]" : "bg-gradient-to-br from-slate-500 to-slate-800"
      )}></div>

      <div className="relative flex flex-col items-center justify-center p-8 bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/80 rounded-[2.95rem] overflow-hidden">
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"></div>

        <audio ref={audioRef} src={AMBIENT_TRACK} loop />

        {/* Timer Ring */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-10 z-10 transition-transform duration-500 group-hover:scale-105">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
            <circle 
              cx="50%" cy="50%" r="42%" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="none" 
              className="text-slate-200/40 dark:text-slate-800/60" 
            />
            <motion.circle 
              cx="50%" cy="50%" r="42%" 
              stroke="url(#timerGradient)" 
              strokeWidth="12" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="552"
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: "linear" }}
              className={cn("drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]", isActive ? "opacity-100" : "opacity-50")}
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={isActive ? "#10b981" : "#64748b"} />
                <stop offset="100%" stopColor={isActive ? "#3b82f6" : "#475569"} />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span 
              key={formatTime(timeLeft)}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 tracking-tighter tabular-nums drop-shadow-sm"
            >
              {formatTime(timeLeft)}
            </motion.span>
            <span className={cn(
              "text-xs sm:text-sm font-bold uppercase tracking-[0.2em] mt-2 transition-colors duration-500",
              isActive ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
            )}>
              {isActive ? "Deep Focus" : "Paused"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 z-10 w-full px-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onStop}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-300 shadow-sm"
          >
            <Square className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
          </Button>

          <Button
            onClick={onToggleActive}
            className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] transition-all duration-500 shadow-2xl flex items-center justify-center border-none hover:scale-105 active:scale-95 group/play",
              isActive 
                ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30 text-white" 
                : "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/30 text-white"
            )}
          >
            {isActive ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current transition-transform group-hover/play:scale-110" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1 transition-transform group-hover/play:scale-110" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className={cn(
              "w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-slate-200 dark:border-white/10 transition-all duration-300 shadow-sm",
              isMuted 
                ? "bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10" 
                : "bg-gradient-to-br from-blue-400 to-indigo-500 text-white border-transparent shadow-lg shadow-blue-500/30"
            )}
          >
            {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
