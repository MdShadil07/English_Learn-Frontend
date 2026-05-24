import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, Globe2, Signal, 
  Sparkles, X, Users, Mic, PhoneOff
} from 'lucide-react';

// --- MOCK BUTTON COMPONENT ---
const Button = ({ children, onClick, className = "", variant = "default", disabled = false }) => {
  const baseStyle = "inline-flex items-center justify-center font-bold transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
    outline: "border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export default function LivePracticeModal({ isOpen = true, onClose = () => {} }) {
  const navigate = useNavigate();
  const [callState, setCallState] = useState('searching'); // searching | match_found
  const [searchProgress, setSearchProgress] = useState(0);

  // Search Simulation Effect
  useEffect(() => {
    if (!isOpen) return;
    
    if (callState === 'searching') {
      const interval = setInterval(() => {
        setSearchProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCallState('match_found'), 400); // Small delay after hitting 100%
            return 100;
          }
          return prev + 2;
        });
      }, 50); // Simulates a 2.5 second search
      return () => clearInterval(interval);
    }
  }, [callState, isOpen]);


  const handleClose = () => {
    setCallState('searching');
    setSearchProgress(0);
    if(onClose) onClose();
  };

  const handleJoinCall = () => {
    handleClose();
    navigate('/pronunciation/live-call');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:p-8 font-sans">
          
          {/* Backdrop (Darkened, blurred background) */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 dark:bg-[#070b14]/80 backdrop-blur-xl"
            onClick={handleClose}
          />

          {/* Content Container - No box, no header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 20 }} 
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Floating */}
            <button 
              onClick={handleClose} 
              className="absolute -top-4 -right-4 z-50 w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700 transition-colors shadow-lg border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <AnimatePresence mode="wait">
                
                {/* -------------------------------------------------------------
                    STAGE 1: SEARCHING FOR PARTNER
                ------------------------------------------------------------- */}
                {callState === 'searching' && (
                  <motion.div 
                    key="searching-stage"
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 1.05 }} 
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center w-full py-10"
                  >
                    {/* Rectangular Card with Border Radius */}
                    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl p-8 md:p-10 shadow-2xl border border-slate-200 dark:border-slate-700 rounded-[2rem] w-full max-w-2xl">
                      
                      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-10">
                        {/* Left: Radar Animation */}
                        <div className="relative w-44 h-44 md:w-52 md:h-52 flex-shrink-0 flex items-center justify-center overflow-hidden rounded-full">
                          {/* Background Glow Only */}
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-teal-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
                          
                          {/* Radar Rings - Contained */}
                          <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-[ping_2s_infinite]"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-teal-400/40 animate-[ping_2s_infinite]" style={{ animationDelay: '0.4s', transform: 'scale(1.2)' }}></div>
                          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-[ping_2s_infinite]" style={{ animationDelay: '0.8s', transform: 'scale(1.4)' }}></div>
                          
                          {/* Core Globe */}
                          <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)] z-20 relative">
                            <Globe2 className="w-12 h-12 text-white animate-pulse" />
                          </div>

                          {/* Orbiting Avatar Particles - Inside Container */}
                          {[1, 2, 3].map((i) => (
                            <motion.div 
                              key={i}
                              className="absolute w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-500 overflow-hidden shadow-md z-30 bg-white dark:bg-slate-600"
                              style={{
                                top: `${50 + 28 * Math.sin(i * Math.PI * 0.6)}%`,
                                left: `${50 + 28 * Math.cos(i * Math.PI * 0.6)}%`,
                                transform: 'translate(-50%, -50%)',
                              }}
                              animate={{ opacity: [0.4, 1, 0.4], scale: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                            >
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 10}`} alt="User" className="w-full h-full" />
                            </motion.div>
                          ))}
                        </div>

                        {/* Right: Content */}
                        <div className="flex-1 text-center md:text-left">
                          <h2 className="text-xl md:text-2xl font-extrabold text-[#0f172a] dark:text-white mb-3 tracking-tight">
                            Scanning Network
                          </h2>
                          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-5">
                            Finding a C1 level speaking partner interested in Tech, Business, and Culture...
                          </p>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-200 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-300/50 dark:border-slate-600/50">
                            <motion.div 
                              className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full"
                              style={{ width: `${searchProgress}%` }}
                              layout
                            />
                          </div>
                          <p className="text-xs text-slate-400 mt-2 font-mono">{searchProgress}%</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* -------------------------------------------------------------
                    STAGE 2: MATCH FOUND TRANSITION
                ------------------------------------------------------------- */}
                {callState === 'match_found' && (
                  <motion.div 
                    key="match-found-stage"
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, y: -20 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="flex flex-col items-center justify-center w-full py-10"
                  >
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-emerald-200 dark:border-emerald-800/50 p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center text-center max-w-md w-full relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                      
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-8 border border-emerald-200 dark:border-emerald-800/50">
                        Match Found!
                      </div>

                      <div className="flex items-center gap-6 mb-8 relative z-10">
                        <div className="w-20 h-20 rounded-full border-[3px] border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg opacity-80">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=b6e3f4" alt="You" className="w-full h-full bg-slate-100 dark:bg-slate-900" />
                        </div>
                        
                        <div className="w-12 h-1 bg-emerald-500/30 relative rounded-full">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                        </div>

                        <div className="w-24 h-24 rounded-full border-4 border-blue-500 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=transparent" alt="Peer" className="w-full h-full bg-slate-800" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-2">David</h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">Native Speaker • UK • Tech Enthusiast</p>

                      <Button 
                        onClick={handleJoinCall}
                        className="w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[15px] shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5 border-0"
                      >
                        <Signal className="w-5 h-5 mr-2" /> Join Call Now
                      </Button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}