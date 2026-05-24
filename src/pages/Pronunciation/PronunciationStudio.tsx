import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, Square, Loader2, Play, RotateCcw, 
  Activity, Zap, Target, Volume2, 
  CheckCircle2, AlertTriangle, XCircle, Info, ChevronRight,
  PhoneCall, PhoneOff, Globe2, Signal, Users, Settings2, ShieldAlert,
  BookOpen, Sparkles, Crown, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BasicHeader } from '@/components/layout';
import { useAuth } from '@/contexts';
import RealLifeFeedback from '@/components/Pronunciation Page/Hero';
import SoloPracticeModal from '@/components/Pronunciation Page/soloPractice';
import LivePracticeModal from '@/components/Pronunciation Page/livePeerPractice';

// --- HIGH-PERFORMANCE AUDIO SPECTRUM ---
const LiveAudioSpectrum = ({ isRecording, color = "emerald" }) => (
  <div className="flex items-center justify-center gap-[3px] sm:gap-1.5 h-16 sm:h-24 w-full max-w-md mx-auto" style={{ transform: 'translateZ(0)' }}>
    {[...Array(36)].map((_, i) => {
      const centerDist = Math.abs(18 - i);
      const maxHeight = 100 - (centerDist * 4);
      const isActive = isRecording;
      
      const bgColorClass = color === "emerald" 
        ? "bg-emerald-400 dark:bg-emerald-500" 
        : "bg-blue-400 dark:bg-blue-500";
      
      return (
        <motion.div
          key={i}
          className={`w-1 sm:w-1.5 rounded-full origin-center will-change-transform ${
            isActive ? bgColorClass : 'bg-slate-200 dark:bg-slate-700/50'
          }`}
          animate={{ 
            scaleY: isActive 
              ? [Math.max(0.1, Math.random()), Math.max(0.2, (maxHeight/100) * Math.random() * 1.5), Math.max(0.1, Math.random())] 
              : 0.1
          }}
          transition={{
            duration: isActive ? 0.3 + Math.random() * 0.2 : 0.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          }}
          style={{ height: '100%' }}
        />
      );
    })}
  </div>
);

// --- CIRCULAR SCORE GAUGE ---
const ScoreGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100 dark:text-slate-800/50" />
        <motion.circle 
          cx="50" cy="50" r="45" 
          stroke="url(#scoreGradient)" 
          strokeWidth="8" 
          fill="transparent" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-400 to-emerald-600 tracking-tighter">
          {score}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Overall</span>
      </div>
    </div>
  );
};

// --- TRANSCRIPT DATA SIMULATION (PASSAGE) ---
const transcriptData = [
  { word: "The", status: "perfect", ipa: "ðə" },
  { word: "architect", status: "warning", ipa: "ˈɑːrkɪtekt", userIpa: "ˈɑːrtʃɪtekt", tip: "Pronounce 'ch' as /k/ here." },
  { word: "designed", status: "perfect", ipa: "dɪˈzaɪnd" },
  { word: "a", status: "perfect", ipa: "ə" },
  { word: "beautiful", status: "perfect", ipa: "ˈbjuːtɪfl" },
  { word: "structure", status: "error", ipa: "ˈstrʌktʃər", userIpa: "ˈstrʌkʃər", tip: "Missing the 't' sound before 'sh'." },
  { word: "for", status: "perfect", ipa: "fɔːr" },
  { word: "the", status: "perfect", ipa: "ðə" },
  { word: "museum.", status: "perfect", ipa: "mjuˈziːəm" }
];

// --- LIVE CONVERSATION SIMULATION DATA ---
const liveStreamData = [
  { id: 1, speaker: 'peer', text: "Hi! How is your day going?", time: "0:05" },
  { id: 2, speaker: 'user', text: "It's going well, thank you. I am ", time: "0:12", isLive: false },
  { id: 3, speaker: 'user', text: "working on my pronunciation.", time: "0:15", hasError: true, errorWord: "pronunciation", tip: "/prəˌnʌnsiˈeɪʃn/ (Focus on the 'c' sound)" },
  { id: 4, speaker: 'peer', text: "That's great! It sounds pretty good to me so far.", time: "0:22" },
];

export default function PronunciationStudio() {
  const [activeMode, setActiveMode] = useState<'passage' | 'live'>('live');
  const [isSearchingPartner, setIsSearchingPartner] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const [showSoloModal, setShowSoloModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
   
  // Passage State
  const [sessionState, setSessionState] = useState<'idle' | 'recording' | 'analyzing' | 'results'>('idle');
  const [timer, setTimer] = useState(0);
  const [activeWord, setActiveWord] = useState(null);

  // Live Call State
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [liveStreamData, setLiveStreamData] = useState([]);
  const { user, signOut } = useAuth();

  // Timer simulations
  useEffect(() => {
    let interval;
    if (sessionState === 'recording') {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    } else if (sessionState === 'idle') {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [sessionState]);

  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      interval = setInterval(() => setCallDuration(t => t + 1), 1000);
    } else if (callState === 'idle') {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const handlePassageMicClick = () => {
    if (sessionState === 'idle') setSessionState('recording');
    else if (sessionState === 'recording') {
      setSessionState('analyzing');
      setTimeout(() => setSessionState('results'), 2500);
    }
  };

  const handleStartCall = () => {
    setCallState('connecting');
    setTimeout(() => setCallState('connected'), 3000);
  };

  const handleEndCall = () => {
    setCallState('idle');
  };

  const handleLogout = async () => {
    await signOut();
  };

  const handleSoloPractice = () => {
    setShowSoloModal(true);
  };

  const handleFindPartner = () => {
    setShowPartnerModal(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-[#f8fbff] dark:bg-[#070b14] font-sans text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden relative selection:bg-teal-200 dark:selection:bg-teal-900/50 selection:text-teal-900 dark:selection:text-teal-100">
      
      {/* --- Optimized Background Elements (Hardware Accelerated) --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[-10%] right-[-10%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      {/* --- Header --- */}
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'user@example.com',
          fullName: user?.fullName || 'User',
          avatar: user?.avatar,
        }}
        onLogout={handleLogout}
        showSidebarToggle={true}
        onSidebarToggle={(open) => {}}
        sidebarOpen={false}
        title="Pronunciation Studio"
        subtitle="Neural Acoustic Engine"
      />

      {/* --- Hero Section --- */}
      <RealLifeFeedback 
        onSoloPractice={handleSoloPractice}
        onFindPartner={handleFindPartner}
      />

      {/* --- SOLO PRACTICE MODAL --- */}
      <SoloPracticeModal 
        key="solo-practice-modal"
        isOpen={showSoloModal}
        onClose={() => setShowSoloModal(false)}
      />

      {/* --- LIVE PEER PRACTICE MODAL --- */}
      <LivePracticeModal 
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
      />

      <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-24">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-[#0f172a] dark:text-white mb-4">Select Practice Mode</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
            Click on the cards above to start solo practice or find a partner.
          </p>
        </div>
      </main>
    </div>
  );
}