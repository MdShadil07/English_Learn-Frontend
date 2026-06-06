import React from 'react';
import { motion } from 'framer-motion';
import {
  Search, Moon, Bell, Menu, ArrowRight, Play,
  ChevronDown, Bot, Sparkles, Mic, Activity,
  CheckCircle2, Volume2, SoundOfMix
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative flex flex-col selection:bg-teal-500/30 selection:text-teal-900 overflow-hidden">

      {/* ---------------------------------------------------------------------
          AMBIENT BACKGROUND LIGHTING & GRID (Light SaaS Style)
      --------------------------------------------------------------------- */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/40 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-blue-200/30 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Very Subtle Dot Grid Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNCkiLz48L3N2Zz4=')] opacity-60 pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 flex flex-col min-h-screen">

        {/* ---------------------------------------------------------------------
            MAIN HERO SECTION
        --------------------------------------------------------------------- */}
        <main className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-8 mt-4 sm:mt-10 items-center">

          {/* LEFT COLUMN: Copy & Actions */}
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-20 order-2 lg:order-1">

            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 bg-white border border-slate-200/80 rounded-full px-1.5 py-1.5 pr-4 w-fit shadow-sm"
            >
              <div className="bg-teal-50 p-1.5 rounded-full border border-teal-100">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              </div>
              <span className="text-[11px] font-extrabold tracking-[0.15em] text-slate-700 uppercase">Fluency Engine v2.0 Live</span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
              <h1 className="text-[48px] sm:text-[64px] lg:text-[76px] font-[900] tracking-tight leading-[1.05] text-slate-900">
                Learn English.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500">
                  Speak with AI.
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
              <div className="relative pl-5 border-l-[3px] border-teal-400">
                <p className="text-[17px] text-slate-600 font-medium leading-relaxed max-w-[460px]">
                  Immerse yourself in real-time AI conversations, exact pronunciation analysis, and dynamic roleplay. Your hyper-intelligent language tutor is ready 24/7.
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6">
              <button className="justify-center bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center gap-2 transition-all shadow-[0_10px_30px_rgba(15,23,42,0.15)] hover:shadow-[0_10px_40px_rgba(15,23,42,0.2)] hover:-translate-y-0.5">
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-8 py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center gap-3 transition-all shadow-sm hover:-translate-y-0.5">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                  <Play className="w-3 h-3 text-slate-600 fill-current ml-0.5" />
                </div>
                See How It Works
              </button>
            </motion.div>

            {/* Mini Dashboard Data Row */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-wrap gap-8 pt-8 mt-4 border-t border-slate-200/80 max-w-[500px]">
              <div>
                <div className="flex items-end gap-1 mb-1">
                  <div className="text-3xl font-black text-slate-900 leading-none">94<span className="text-lg text-teal-500">%</span></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mb-1 animate-pulse"></div>
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Avg Pronunciation</div>
              </div>
              <div>
                <div className="text-3xl font-black text-slate-900 leading-none mb-1">2.4<span className="text-lg text-slate-400">M</span></div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Conversations Held</div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1 h-[30px]">
                  {[...Array(5)].map((_, i) => (
                    <motion.div key={i} className="w-1.5 bg-cyan-400 rounded-full" animate={{ height: [8, 16 + Math.random() * 10, 8] }} transition={{ duration: 1 + Math.random(), repeat: Infinity }} />
                  ))}
                </div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Real-time Analysis</div>
              </div>
            </motion.div>

          </div>

          {/* ---------------------------------------------------------------------
              RIGHT COLUMN: Clean, Visual Graphic Presentation
          --------------------------------------------------------------------- */}
          <div className="lg:col-span-7 relative h-[450px] sm:h-[550px] lg:h-[700px] flex items-center justify-center order-1 lg:order-2 w-full">

            {/* The Central Stage Container */}
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center z-10">

              {/* Outer Decorative Tech Rings (Subtle & Light) */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: "linear" }} className="absolute inset-4 sm:inset-10 rounded-full border border-slate-200/80 pointer-events-none"></motion.div>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} className="absolute inset-16 sm:inset-24 rounded-full border border-teal-100 border-dashed pointer-events-none"></motion.div>

              {/* Connecting Data Lines to floating graphics */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 600 600">
                <path d="M 300 300 Q 450 150 500 200" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 300 300 Q 150 180 120 220" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 300 300 Q 180 480 150 480" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* -------------------------------------------------------------
                  CENTRAL AI CORE (Clean & Abstract)
              ------------------------------------------------------------- */}
              <div className="relative z-20 flex items-center justify-center">
                {/* Soft Ambient Glow */}
                <div className="absolute w-56 h-56 bg-teal-300/30 rounded-full blur-3xl animate-pulse"></div>

                {/* Main Crystal / Orb */}
                <motion.div
                  initial={{ y: 0 }} animate={{ y: [-12, 12, -12] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-40 h-40 sm:w-48 sm:h-48 bg-white/80 backdrop-blur-2xl rounded-full border border-white shadow-[0_20px_50px_-12px_rgba(20,184,166,0.25)] flex flex-col items-center justify-center overflow-hidden"
                >
                  {/* Inner Gradient Aura */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50 opacity-80 z-0" />

                  {/* Central Avatar Icon */}
                  <div className="relative z-10 w-24 h-24 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-full flex items-center justify-center text-white shadow-[0_10px_20px_rgba(20,184,166,0.3)] ring-4 ring-white">
                    <Bot className="w-12 h-12 drop-shadow-md" />
                  </div>

                  {/* Radiating Sound Waves (SVG) inside the core */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" fill="none" stroke="#0ea5e9" strokeWidth="1">
                      <animate attributeName="r" values="35; 48; 35" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1; 0; 1" dur="3s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#14b8a6" strokeWidth="1">
                      <animate attributeName="r" values="42; 55; 42" dur="3s" repeatCount="indefinite" begin="1s" />
                      <animate attributeName="opacity" values="1; 0; 1" dur="3s" repeatCount="indefinite" begin="1s" />
                    </circle>
                  </svg>
                </motion.div>
              </div>

              {/* -------------------------------------------------------------
                  ABSTRACT FLOATING GRAPHICS (Visuals Only)
              ------------------------------------------------------------- */}

              {/* Graphic 1: Accuracy Gauge (Top Right) */}
              <motion.div
                animate={{ y: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-[18%] right-[5%] sm:right-[10%] bg-white p-3 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 z-30 flex items-center justify-center"
              >
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <motion.path
                      className="text-emerald-500 drop-shadow-sm" strokeDasharray="98 100" strokeLinecap="round" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: "98 100" }} transition={{ duration: 2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-800">98<span className="text-[10px]">%</span></span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 bg-emerald-100 rounded-full p-1 border border-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
              </motion.div>

              {/* Graphic 2: Audio Waveform Activity (Top Left) */}
              <motion.div
                animate={{ y: [0, 12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-[20%] left-[2%] sm:left-[5%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 z-30 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="flex items-end gap-1 h-8">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i} className="w-1.5 bg-blue-400 rounded-full"
                      animate={{ height: ['20%', '100%', '20%'] }}
                      transition={{ duration: 0.8 + (Math.random() * 0.5), repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Graphic 3: Phonetic Interpretation Box (Bottom Left) */}
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                className="absolute bottom-[20%] left-[10%] sm:left-[15%] bg-white px-5 py-3 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 z-30 flex items-center gap-4"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Phonetics</span>
                  <span className="text-xl font-mono font-bold text-slate-800 tracking-wider">/f'luːənsi/</span>
                </div>
                <div className="w-px h-8 bg-slate-100"></div>
                <Volume2 className="w-5 h-5 text-teal-500" />
              </motion.div>

              {/* Graphic 4: Syntax / Grammar Parse Blocks (Bottom Right) */}
              <motion.div
                animate={{ y: [0, 10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                className="absolute bottom-[15%] right-[10%] sm:right-[15%] bg-white p-4 rounded-2xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-100 z-30"
              >
                <div className="flex flex-col gap-2.5">
                  {/* Abstract sentence blocks */}
                  <div className="flex gap-2 items-center">
                    <div className="h-3 w-8 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-16 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-12 bg-emerald-100 rounded-full flex items-center justify-center relative">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} className="absolute -top-3 -right-2 bg-emerald-500 rounded-full p-0.5 border-2 border-white">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-3 w-12 bg-slate-200 rounded-full"></div>
                    <div className="h-3 w-20 bg-slate-200 rounded-full"></div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

        </main>
      </div>
    </div>
  );
}