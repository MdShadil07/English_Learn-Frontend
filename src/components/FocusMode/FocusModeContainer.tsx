import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FocusTimer } from './FocusTimer';
import { FocusMotivation } from './FocusMotivation';
import { FocusWarnings } from './FocusWarnings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
// import { api } from '@/lib/api'; // If we wanted to deduct XP on backend

export const FocusModeContainer: React.FC = () => {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Extract native language from user profile (fallback to 'en')
  const nativeLanguage = (user as any)?.profile?.nativeLanguage || 'en';

  // --- BROWSER API: Fullscreen ---
  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request failed", err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Exit fullscreen failed", err);
    }
  };

  // --- BROWSER API: Page Visibility & BeforeUnload ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      // If the user switches tabs while focus mode is active
      if (document.hidden && isActive && !showWarning) {
        setWarningCount(prev => {
          const newCount = prev + 1;
          if (newCount === 3) {
            // Apply XP Penalty (e.g. fire API call here)
            toast.error("Penalty Applied: -50 XP due to lost focus.");
            // api.user.deductXP(user.id, 50);
          }
          return newCount;
        });
        setShowWarning(true);
        
        // Optionally pause the timer automatically
        // setIsActive(false); 
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isActive) {
        e.preventDefault();
        e.returnValue = ''; // Trigger browser's strict exit warning
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isActive, showWarning]);

  // --- HANDLERS ---
  const handleToggleActive = () => {
    if (!isActive) {
      requestFullscreen();
      toast.success("Enterprise Focus Mode Activated. Stay focused!");
    } else {
      exitFullscreen();
    }
    setIsActive(!isActive);
  };

  const handleStop = () => {
    setIsActive(false);
    exitFullscreen();
    setWarningCount(0); // Reset warnings on manual stop
  };

  const handleComplete = () => {
    setIsActive(false);
    setSessionCompleted(true);
    exitFullscreen();
    toast.success("Session completed! +100 XP awarded.");
  };

  const handleReturnToFocus = () => {
    setShowWarning(false);
    requestFullscreen(); // Ensure they are pushed back to fullscreen
  };

  return (
    <div className="relative min-h-[calc(100vh-6rem)] w-full flex flex-col items-center justify-center p-[1px] rounded-[3.5rem] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700/50 dark:to-slate-800/20 shadow-2xl transition-all duration-700">
      
      {/* Inner glass wrapper */}
      <div className="relative w-full h-full min-h-[calc(100vh-6.5rem)] flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden rounded-[3.45rem] bg-white/90 dark:bg-[#050C14]/95 backdrop-blur-3xl">
        
        {/* Background Graphic */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay pointer-events-none z-0"></div>
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[1000px] sm:h-[1000px] rounded-full blur-[100px] sm:blur-[150px] pointer-events-none -z-10 transition-colors duration-1000",
          isActive ? "bg-emerald-500/10 dark:bg-emerald-500/20" : "bg-slate-400/5 dark:bg-slate-500/10"
        )}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto flex flex-col xl:flex-row gap-12 xl:gap-20 items-center justify-center z-10"
        >
          {/* Left Column: Timer */}
          <div className="flex-1 w-full max-w-md">
            <FocusTimer 
              durationMinutes={25}
              isActive={isActive}
              onToggleActive={handleToggleActive}
              onStop={handleStop}
              onTick={(timeLeft) => {
                // Optional: sync to global context or localStorage
              }}
              onComplete={handleComplete}
            />
          </div>

          {/* Right Column: Text & Motivation */}
          <div className="flex-1 w-full flex flex-col items-center xl:items-start text-center xl:text-left gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">
                <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400")}></span>
                {isActive ? "Session Active" : "Standby Mode"}
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight leading-tight">
                Enterprise<br/>Focus
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-lg font-medium leading-relaxed">
                Step into a completely distraction-free learning environment. Lock your screen, zero your mind, and achieve flow state.
              </p>
            </div>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-4"></div>

            <FocusMotivation 
              nativeLanguage={nativeLanguage} 
              isActive={isActive} 
            />
          </div>
        </motion.div>

        {/* Warning Overlay */}
        <FocusWarnings 
          isVisible={showWarning} 
          warningCount={warningCount}
          onReturnToFocus={handleReturnToFocus}
        />
      </div>
    </div>
  );
};
