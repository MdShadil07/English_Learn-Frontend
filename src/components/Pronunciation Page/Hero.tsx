import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, BookOpen, Signal, Globe2, Activity, 
  Sparkles, BrainCircuit, ArrowRight, CheckCircle2 
} from 'lucide-react';

// --- HIGH-PERFORMANCE AUDIO SPECTRUM ---
const LiveAudioSpectrum = ({ isRecording, color = "emerald", barCount = 12 }) => (
  <div className="flex items-center justify-center gap-[2px] h-full w-full" style={{ transform: 'translateZ(0)' }}>
    {[...Array(barCount)].map((_, i) => {
      const centerDist = Math.abs((barCount / 2) - i);
      const maxHeight = 100 - (centerDist * (100 / (barCount / 2)));
      const isActive = isRecording;
      
      const bgColorClass = color === "emerald" 
        ? "bg-emerald-400 dark:bg-emerald-500" 
        : "bg-blue-400 dark:bg-blue-500";
      
      return (
        <motion.div
          key={i}
          className={`flex-1 rounded-full origin-center will-change-transform ${
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
          style={{ height: '100%', minWidth: '2px' }}
        />
      );
    })}
  </div>
);

const RealLifeFeedback = ({ onSoloPractice, onFindPartner }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#050C14] overflow-hidden transition-colors duration-500 font-sans border-t border-slate-200/60 dark:border-emerald-500/20">
      
      {/* --- Ambient Background Glow --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(59,130,246,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(59,130,246,0.05)_0%,transparent_60%)]" style={{ transform: 'translate(-50%, -50%) translateZ(0)' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 flex flex-col items-center">
        
        {/* --- GRAPHIC COMPOSITION --- */}
        <div className="relative w-full max-w-[900px] h-[450px] md:h-[600px] flex justify-center items-start mt-10">
          
          {/* Scaling Wrapper for Flawless Mobile Responsiveness */}
          <div className="relative w-[320px] h-[650px] transform scale-[0.65] sm:scale-75 md:scale-90 lg:scale-100 origin-top flex-shrink-0">
            
            {/* --- CENTRAL PHONE MOCKUP --- */}
            <div className="absolute inset-x-0 top-0 h-[620px] bg-[#0d1117] border-[8px] border-[#1e293b] rounded-[3rem] shadow-2xl overflow-hidden z-10">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#1e293b] rounded-b-2xl z-20"></div>

              {/* Phone Content */}
              <div className="pt-14 px-6 relative z-10">
                <h3 className="text-white text-[28px] font-bold mb-1 tracking-tight">Live Conversation</h3>
                <p className="text-slate-400 text-xs font-medium mb-8">Oct 18 • Peer-to-Peer • 30m</p>

                {/* Tutor Recommendations Panel */}
                <div className="bg-[#151b23] rounded-2xl p-5 border border-slate-800/80 shadow-inner">
                  
                  {/* Avatar & Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 p-0.5">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica&backgroundColor=transparent" alt="Tutor" className="w-full h-full rounded-full bg-[#0d1117]" />
                    </div>
                    <h4 className="text-white text-base font-bold">Acoustic Analysis</h4>
                  </div>

                  {/* List Items */}
                  <div className="space-y-5">
                    <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                      <h5 className="text-sm text-slate-200 font-semibold mb-1">Pronunciation</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">Practice clarity on specific sounds (like "th" or "r/l" distinctions) to improve overall confidence.</p>
                    </div>

                    <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                      <h5 className="text-sm text-slate-200 font-semibold mb-1">Intonation</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">Work on using rising pitch on yes/no questions to sound more natural and native to...</p>
                    </div>

                    <div className="relative pl-5 opacity-40">
                      <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-fuchsia-500"></div>
                      <h5 className="text-sm text-slate-200 font-semibold mb-1">Fluency</h5>
                      <p className="text-xs text-slate-400 leading-relaxed">Pay special attention to syllable stress and connecting words smoothly across...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inner Phone Shadow/Fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* --- FLOATING CARD 1: VOCABULARY (LEFT) --- */}
            <motion.div 
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[28%] -left-[60%] w-[260px] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-3 inline-block shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                Intonation
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Use strategic pauses and linking to make your spoken language sound more fluent and natural.
              </p>
            </motion.div>

            {/* --- FLOATING CARD 2: GRAMMAR (TOP RIGHT) --- */}
            <motion.div 
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[16%] -right-[50%] w-[280px] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-20 flex items-center justify-between"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="pr-4">
                <h5 className="text-white text-base font-bold mb-1.5">Fluency</h5>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Your fluency score is <span className="text-emerald-400 font-semibold">top 15%</span> for your current CEFR level.
                </p>
              </div>
              
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                  <path className="text-fuchsia-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" style={{ filter: 'drop-shadow(0px 0px 4px rgba(217,70,239,0.8))' }} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-white text-lg font-black leading-none">85</span>
                  <span className="text-[7px] text-slate-300 font-bold uppercase tracking-wider">Score</span>
                </div>
              </div>
            </motion.div>

            {/* --- FLOATING CARD 3: PRONUNCIATION (BOTTOM RIGHT) --- */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[48%] -right-[40%] w-[270px] bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-30"
              style={{ transform: 'translateZ(0)' }}
            >
              <div className="bg-[#f97316] text-white text-xs font-bold px-2.5 py-1 rounded-lg mb-3 inline-block shadow-[0_0_12px_rgba(249,115,22,0.5)]">
                Pronunciation
              </div>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                Practice sound <strong className="text-white font-bold">/ɛ/</strong>. Focus on tricky words like <strong className="text-white font-bold">"percentile"</strong> to make your speech clearer.
              </p>
            </motion.div>

          </div>
          
          {/* --- EXACT LOWER OPACITY EFFECT (FADE OUT TO BOTTOM) --- */}
          {/* This overlays the bottom of the graphic exactly like the reference image */}
          <div className="absolute bottom-[-50px] left-0 w-full h-[250px] bg-gradient-to-t from-[#f8fbff] via-[#f8fbff]/90 dark:from-[#050C14] dark:via-[#050C14]/90 to-transparent z-40 pointer-events-none transition-colors duration-500"></div>
        </div>

        {/* --- BOTTOM TYPOGRAPHY --- */}
        <div className="relative z-50 text-center -mt-6 md:-mt-12 mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-[1.1]"
          >
            Get AI feedback <br className="hidden sm:block"/>
            on your <span className="text-blue-600 dark:text-blue-500">real-life</span> conversations
          </motion.h2>
        </div>

        {/* --- START PRACTICE OPTIONS (NEW) --- */}
        <div className="relative z-50 w-full max-w-[1000px] mx-auto grid md:grid-cols-2 gap-6 lg:gap-10 pb-10">
          
          {/* Option 1: Solo Practice */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 dark:bg-[#050C14]/80 backdrop-blur-2xl border border-slate-200/60 dark:border-emerald-500/20 rounded-[2rem] p-6 lg:p-8 flex flex-col items-center text-center shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group transition-all hover:border-blue-300 dark:hover:border-blue-500/50"
          >
            {/* Visual Graphic Representation */}
            <div className="w-full h-48 mb-6 rounded-[1.5rem] bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/60 relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_60%)]"></div>
               
               {/* Central Element */}
               <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 flex items-center justify-center relative z-10">
                 <Mic className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                 <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-[ping_2.5s_infinite]" style={{ transform: 'scale(1.2)' }}></div>
               </div>

               {/* Floating Badges */}
               <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-[#050C14]/90 backdrop-blur-md border border-slate-200/60 dark:border-emerald-500/20 p-2 px-3 rounded-xl flex items-center gap-2 shadow-lg transform group-hover:-translate-y-1 transition-transform duration-300">
                 <Activity className="w-3.5 h-3.5 text-blue-500" />
                 <span className="text-[10px] font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider">Score: <span className="text-blue-600 dark:text-blue-400">92</span></span>
               </div>
               
               <div className="absolute top-4 left-4 bg-white/90 dark:bg-[#050C14]/90 backdrop-blur-md border border-slate-200/60 dark:border-emerald-500/20 p-2 px-3 rounded-xl flex items-center gap-2 shadow-lg transform group-hover:translate-y-1 transition-transform duration-300">
                 <BookOpen className="w-3 h-3 text-fuchsia-500" />
                 <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Passage Mode</span>
               </div>
            </div>

            {/* Content & CTA */}
            <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-3 tracking-tight">Solo Practice</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-[280px]">
              Read curated passages or converse with AI tutors. Get an instant, phoneme-level breakdown of your speech.
            </p>
            <button 
              onClick={onSoloPractice}
              className="mt-auto w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[15px] shadow-lg shadow-blue-500/20 transition-transform hover:-translate-y-0.5"
            >
               Start Solo Practice
             </button>
          </motion.div>

          {/* Option 2: Live Peer Practice (STUNNING REDESIGN) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/80 dark:bg-[#050C14]/80 backdrop-blur-2xl border border-slate-200/60 dark:border-emerald-500/20 rounded-[2rem] p-6 lg:p-8 flex flex-col items-center text-center shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group transition-all hover:border-emerald-300 dark:hover:border-emerald-500/50"
          >
            {/* High-End Visual Graphic Representation */}
            <div className="w-full h-48 mb-6 rounded-[1.5rem] bg-slate-50 dark:bg-[#0d1117] border border-slate-100 dark:border-slate-800/60 relative flex items-center justify-center overflow-hidden perspective-1000">
               
               {/* Hardware Accelerated Background Rings */}
               <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)]"></div>
               <div className="absolute inset-[-40px] rounded-full border border-emerald-500/20 border-dashed animate-[spin_30s_linear_infinite]" style={{ transform: 'translateZ(0)' }}></div>
               <div className="absolute inset-[10px] rounded-full border border-teal-500/10 animate-[spin_20s_linear_infinite_reverse]" style={{ transform: 'translateZ(0)' }}></div>

               {/* Dynamic Connecting Glow Arc */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 200">
                 <path d="M 80 100 Q 200 160 320 100" fill="none" stroke="url(#peerLine)" strokeWidth="3" strokeDasharray="6 6" />
                 <defs>
                   <linearGradient id="peerLine" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#10b981" stopOpacity="0.1"/>
                     <stop offset="50%" stopColor="#10b981" stopOpacity="0.8"/>
                     <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                   </linearGradient>
                 </defs>
               </svg>

               {/* Connected Avatars Container */}
               <div className="w-full flex items-center justify-between px-6 sm:px-12 relative z-10 mt-4">
                 
                 {/* User (Left) */}
                 <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center">
                   <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-emerald-400 p-0.5 shadow-lg shadow-emerald-500/20 relative group-hover:scale-110 transition-transform duration-300">
                     <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded border border-[#0d1117]">YOU</div>
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You&backgroundColor=b6e3f4" alt="You" className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900" />
                   </div>
                   {/* Live Audio Bar */}
                   <div className="mt-4 w-12 h-4"><LiveAudioSpectrum isRecording={true} color="emerald" barCount={8} /></div>
                 </motion.div>

                 {/* Central AI Processor Node */}
                 <motion.div 
                   className="absolute top-[10%] left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700 p-2 px-3 rounded-xl shadow-xl z-20 flex flex-col items-center transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                 >
                    <div className="text-[8px] font-extrabold text-teal-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                      <BrainCircuit className="w-3 h-3" /> AI Engine
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                      <span className="text-emerald-500 font-mono font-bold text-[10px]">/ð/</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="text-emerald-500 font-mono font-bold text-[10px]">/ð/</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-0.5" />
                    </div>
                 </motion.div>

                 {/* Peer (Right) */}
                 <motion.div animate={{ y: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="flex flex-col items-center">
                   <div className="w-14 h-14 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-2 border-blue-400 p-0.5 shadow-lg shadow-blue-500/20 relative group-hover:scale-110 transition-transform duration-300">
                     <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded border border-[#0d1117]">PEER</div>
                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Peer&backgroundColor=ffdfbf" alt="Peer" className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-900" />
                   </div>
                   {/* Live Audio Bar */}
                   <div className="mt-4 w-12 h-4 opacity-60"><LiveAudioSpectrum isRecording={true} color="blue" barCount={8} /></div>
                 </motion.div>
               </div>

               {/* Floating Badges */}
               <div className="absolute top-3 left-4 bg-white/90 dark:bg-[#050C14]/90 backdrop-blur-md border border-slate-200/60 dark:border-emerald-500/20 p-1.5 px-2.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                 <Globe2 className="w-3 h-3 text-blue-500" />
                 <span className="text-[9px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">C1 Match</span>
               </div>
               
               <div className="absolute bottom-3 right-4 bg-white/90 dark:bg-[#050C14]/90 backdrop-blur-md border border-emerald-500/30 p-1.5 px-2.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                 <span className="text-[9px] font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wider">Analysis Active</span>
               </div>
            </div>

            {/* Content & CTA */}
            <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-3 tracking-tight">Live Peer Practice</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8 leading-relaxed max-w-[280px]">
              Match randomly with users globally. Have real-time conversations while our AI analyzes your pronunciation.
            </p>
            <button 
              onClick={onFindPartner}
              className="mt-auto w-full h-14 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[15px] shadow-lg shadow-emerald-500/20 transition-transform hover:-translate-y-0.5"
            >
              Find a Partner
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default RealLifeFeedback;