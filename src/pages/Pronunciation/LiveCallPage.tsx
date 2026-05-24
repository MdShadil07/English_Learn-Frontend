import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, PhoneOff, Signal, Sparkles, ShieldAlert, 
  Settings2, ChevronLeft, Volume2, MessageSquare, 
  MoreVertical, Target, ArrowRight, CheckCircle2,
  Activity, Video
} from 'lucide-react';

// --- HIGH-PERFORMANCE AUDIO SPECTRUM ---
const LiveAudioSpectrum = ({ isRecording, color = "emerald", barCount = 16, height = "100%" }) => (
  <div className="flex items-center justify-center gap-[3px] w-full" style={{ height, transform: 'translateZ(0)' }}>
    {[...Array(barCount)].map((_, i) => {
      const centerDist = Math.abs((barCount / 2) - i);
      const maxHeight = 100 - (centerDist * (100 / (barCount / 2)));
      const isActive = isRecording;
      
      const bgColorClass = color === "emerald" 
        ? "bg-emerald-500 dark:bg-emerald-400" 
        : color === "blue" 
        ? "bg-blue-500 dark:bg-blue-400"
        : "bg-teal-500 dark:bg-teal-400";
      
      return (
        <motion.div
          key={i}
          className={`flex-1 rounded-full origin-center will-change-transform ${isActive ? bgColorClass : 'bg-slate-200 dark:bg-slate-700/50'}`}
          animate={{ 
            scaleY: isActive ? [Math.max(0.1, Math.random()), Math.max(0.2, (maxHeight/100) * Math.random() * 1.2), Math.max(0.1, Math.random())] : 0.1
          }}
          transition={{ duration: isActive ? 0.2 + Math.random() * 0.2 : 0.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
          style={{ height: '100%', minWidth: '3px' }}
        />
      );
    })}
  </div>
);

// --- SIMULATED LIVE STREAM DATA ---
const initialLiveStreamData = [
  { id: 1, speaker: 'peer', text: "Hi! How is your day going?", time: "0:05", hasError: false },
  { id: 2, speaker: 'user', text: "It's going well, thank you. I am ", time: "0:12", isLive: false, hasError: false },
  { id: 3, speaker: 'user', text: "working on my pronunciation.", time: "0:15", hasError: true, errorWord: "pronunciation", tip: "/prəˌnʌnsiˈeɪʃn/ (Focus on the 'c' sound)" },
  { id: 4, speaker: 'peer', text: "That's great! Yes, I think the ", time: "0:22", isLive: false, hasError: false },
  { id: 5, speaker: 'peer', text: "architecture here is beautiful.", time: "0:25", isLive: true, hasError: true, errorWord: "architecture", tip: "/ˈɑːrkɪtektʃər/ (Use a hard 'ch' sound like /k/)" },
];

export default function LiveCallPage() {
  const [callDuration, setCallDuration] = useState(125); // Simulated starting at 2m 05s
  const [isMuted, setIsMuted] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [peerSpeaking, setPeerSpeaking] = useState(true);

  // Call Duration Timer
  useEffect(() => {
    const interval = setInterval(() => setCallDuration(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate peer speaking toggle
  useEffect(() => {
    const interval = setInterval(() => setPeerSpeaking(prev => !prev), 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEndCall = () => {
    // In a real app, navigate back or show summary modal
    console.log("Call Ended");
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="h-dvh w-full bg-[#f8fbff] dark:bg-[#070b14] font-sans text-slate-900 dark:text-slate-100 overflow-hidden relative selection:bg-teal-200 dark:selection:bg-teal-900/50 selection:text-teal-900 dark:selection:text-teal-100 flex flex-col transition-colors duration-500 ease-in-out">
      
      {/* --- Abstract Background Ambient Glows --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(59,130,246,0.12)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,rgba(59,130,246,0.08)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vh] bg-[radial-gradient(ellipse,rgba(16,185,129,0.1)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,rgba(16,185,129,0.06)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* --- Minimal App Header --- */}
      <header className="relative z-20 px-4 md:px-6 py-4 flex items-center justify-between border-b border-slate-200/60 dark:border-white/5 bg-white/60 dark:bg-[#0a0f1c]/80 backdrop-blur-md transition-colors duration-500">
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-tight">Live Practice Session</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Network</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1.5 rounded-full">
            <Signal className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Secure</span>
          </div>
          <div className="font-mono text-sm font-bold text-slate-600 dark:text-slate-200 w-12 text-right">
            {formatTime(callDuration)}
          </div>
        </div>
      </header>

      {/* --- Main App Interface --- */}
      <main className="flex-1 relative z-10 flex flex-col lg:flex-row overflow-hidden">
        
        {/* --- STAGE: ACTIVE CALL VIEW --- */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden h-[30vh] lg:h-full min-h-[160px]">
          
          <div className="w-full max-w-5xl mx-auto flex flex-row lg:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12 h-full">
            
            {/* Peer Voice Card */}
            <motion.div 
              className={`relative rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 flex-1 max-w-[200px] md:max-w-[320px] aspect-[4/5] md:aspect-square bg-white dark:bg-[#0b1121] border ${peerSpeaking ? 'border-blue-400 dark:border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-105' : 'border-slate-200 dark:border-slate-800 shadow-xl scale-100'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 dark:from-[#050810] via-transparent to-transparent z-10 transition-colors duration-500"></div>
              {/* Avatar Centerpiece */}
              <div className="relative z-20 w-16 h-16 md:w-32 md:h-32 rounded-full mb-4 md:mb-6 shadow-2xl">
                <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${peerSpeaking ? 'border-blue-500 dark:border-blue-400' : 'border-slate-300 dark:border-slate-700'}`}></div>
                {peerSpeaking && <div className="absolute inset-0 rounded-full border border-blue-400 animate-[ping_2s_infinite]"></div>}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=transparent" alt="Peer" className="w-full h-full rounded-full object-cover bg-slate-200 dark:bg-slate-800" />
              </div>
              <div className="relative z-20 text-center px-4">
                <h3 className="text-sm md:text-lg font-bold text-[#0f172a] dark:text-white mb-1">David</h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">Native Speaker • UK</p>
                <div className="h-6 md:h-8 mt-3 w-20 md:w-28 mx-auto">
                  <LiveAudioSpectrum isRecording={peerSpeaking} color="blue" />
                </div>
              </div>
            </motion.div>

            {/* User Voice Card */}
            <motion.div 
              className={`relative rounded-3xl md:rounded-[2.5rem] overflow-hidden flex flex-col items-center justify-center transition-all duration-500 flex-1 max-w-[200px] md:max-w-[320px] aspect-[4/5] md:aspect-square bg-white dark:bg-[#0b1121] border ${!isMuted && !peerSpeaking ? 'border-emerald-400 dark:border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.15)] scale-105' : 'border-slate-200 dark:border-slate-800 shadow-xl scale-100'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-100/80 dark:from-[#050810] via-transparent to-transparent z-10 transition-colors duration-500"></div>
              {/* Avatar Centerpiece */}
              <div className="relative z-20 w-16 h-16 md:w-32 md:h-32 rounded-full mb-4 md:mb-6 shadow-2xl">
                <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${!isMuted && !peerSpeaking ? 'border-emerald-500 dark:border-emerald-400' : 'border-slate-300 dark:border-slate-700'}`}></div>
                {!isMuted && !peerSpeaking && <div className="absolute inset-0 rounded-full border border-emerald-400 animate-[ping_2s_infinite]"></div>}
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" className="w-full h-full rounded-full object-cover bg-slate-200 dark:bg-slate-800" />
                
                {isMuted && (
                  <div className="absolute -bottom-2 -right-2 bg-rose-500 p-1.5 rounded-full border-2 border-white dark:border-[#0b1121]">
                    <MicOff className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="relative z-20 text-center px-4">
                <h3 className="text-sm md:text-lg font-bold text-[#0f172a] dark:text-white mb-1">You</h3>
                <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium hidden md:block">C1 Learner</p>
                <div className="h-6 md:h-8 mt-3 w-20 md:w-28 mx-auto">
                  <LiveAudioSpectrum isRecording={!isMuted && !peerSpeaking} color="emerald" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Floating Dock (Call Controls) */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4 bg-white/80 dark:bg-white/10 backdrop-blur-2xl p-2.5 md:p-3 rounded-full border border-slate-200 dark:border-white/10 z-50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-500">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all ${
                isMuted ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg scale-95' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-700 shadow-sm'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
            <button className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-700 flex items-center justify-center transition-all shadow-sm">
              <Video className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <button className="hidden sm:flex w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/80 dark:text-white dark:hover:bg-slate-700 items-center justify-center transition-all shadow-sm">
              <Settings2 className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="w-px h-8 bg-slate-300 dark:bg-white/10 mx-1 md:mx-2"></div>
            <button 
              onClick={handleEndCall} 
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(244,63,94,0.3)] dark:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all hover:scale-105"
            >
              <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </div>

        {/* --- RIGHT PANEL: LIVE AI TRANSCRIPT --- */}
        <AnimatePresence>
          {showChat && (
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="w-full lg:w-[450px] xl:w-[500px] h-[70vh] lg:h-full bg-white/90 dark:bg-[#0b1121]/90 backdrop-blur-2xl border-l border-slate-200/60 dark:border-white/5 flex flex-col shadow-[-20px_0_40px_rgba(0,0,0,0.05)] dark:shadow-[-20px_0_40px_rgba(0,0,0,0.3)] z-30 transition-colors duration-500"
            >
              {/* Panel Header */}
              <div className="p-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-[#0a0f1c] transition-colors duration-500">
                <div className="flex items-center gap-2">
                  <div className="bg-teal-100 dark:bg-teal-500/20 p-1.5 rounded-lg border border-teal-200 dark:border-transparent">
                    <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#0f172a] dark:text-white tracking-wide">Live AI Analysis</h3>
                </div>
                <div className="flex gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div> Perfect</span>
                  <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]"></div> Error</span>
                </div>
              </div>

              {/* Scrolling Transcript */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col justify-start">
                {initialLiveStreamData.map((item) => (
                  <motion.div 
                    key={item.id} 
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col w-full ${item.speaker === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 px-1">
                      {item.speaker === 'user' ? 'You' : 'David'} • {item.time}
                    </span>
                    
                    <div className={`relative max-w-[90%] p-4 rounded-2xl shadow-sm ${
                      item.speaker === 'user' 
                        ? 'bg-slate-100 dark:bg-[#151f32] border border-slate-200 dark:border-slate-700/50 rounded-tr-sm' 
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 rounded-tl-sm'
                    }`}>
                      
                      <div className="text-[15px] font-medium leading-relaxed text-[#0f172a] dark:text-slate-200">
                        {item.hasError ? (
                          <>
                            {item.text.split(item.errorWord)[0]}
                            {/* Error Highlight with Custom Premium Tooltip */}
                            <span className="relative inline-block group cursor-pointer">
                              <span className="text-rose-600 dark:text-rose-400 font-extrabold underline decoration-rose-300 dark:decoration-rose-500/50 decoration-2 underline-offset-4 bg-rose-100 dark:bg-rose-500/10 px-1 rounded transition-colors group-hover:bg-rose-200 dark:group-hover:bg-rose-500/20">
                                {item.errorWord}
                              </span>
                              
                              {/* Glassmorphic Pop-up Tooltip */}
                              <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[240px] bg-white/95 dark:bg-[#0a0f1c]/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-[#0f172a] dark:text-white p-4 rounded-2xl shadow-xl dark:shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 transform scale-95 group-hover:scale-100 origin-bottom">
                                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-500 dark:text-rose-400 uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-700/50 pb-2">
                                  <ShieldAlert className="w-3.5 h-3.5" /> Phoneme Alert
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2.5 mb-2 border border-slate-100 dark:border-slate-800">
                                  <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">{item.tip}</div>
                                </div>
                                <div className="text-[10px] text-slate-400 leading-snug">Tap to hear correct pronunciation</div>
                                {/* Pointer Arrow */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#0a0f1c] border-b border-r border-slate-200 dark:border-slate-700 rotate-45 pointer-events-none"></div>
                              </div>
                            </span>
                            {item.text.split(item.errorWord)[1]}
                          </>
                        ) : (
                          item.text
                        )}
                        {item.isLive && (
                          <span className="inline-block w-2 h-4 ml-1.5 bg-teal-500 dark:bg-teal-400 animate-pulse align-middle rounded-[1px] shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area (Mock) */}
              <div className="p-4 bg-slate-50 dark:bg-[#0a0f1c] border-t border-slate-200/60 dark:border-white/5 pb-8 lg:pb-4 transition-colors duration-500">
                <div className="flex items-center gap-3 bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2.5 shadow-inner">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 flex-1">Engine actively listening...</span>
                  <Target className="w-4 h-4 text-slate-400 dark:text-slate-600" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}