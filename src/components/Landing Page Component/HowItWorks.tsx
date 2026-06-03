import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Mic, Users, ArrowRight, BookOpen, CheckCircle2, Zap, Sparkles, Activity, Radio, Globe2, Signal } from 'lucide-react';
import { Link } from 'react-router-dom';
import CommunityRulesModal from './CommunityRulesModal';

// --- HIGH-PERFORMANCE AUDIO SPECTRUM ---
const AudioSpectrum = () => (
  <div className="flex items-end justify-center gap-[4px] h-20 w-full px-8 absolute bottom-0 opacity-80" style={{ transform: 'translateZ(0)' }}>
    {[...Array(30)].map((_, i) => {
      // Bell-curve height distribution
      const centerDist = Math.abs(15 - i);
      const maxHeight = 100 - (centerDist * 5);

      return (
        <motion.div
          key={i}
          className="w-1.5 sm:w-2 bg-gradient-to-t from-teal-500 via-emerald-400 to-cyan-300 rounded-t-full origin-bottom will-change-transform"
          animate={{
            scaleY: [Math.max(0.1, maxHeight * 0.002), Math.max(0.2, maxHeight * 0.01), Math.max(0.1, maxHeight * 0.002)]
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05,
          }}
          style={{ height: '100px' }} // Fixed height, animated via scaleY for better performance
        />
      );
    })}
  </div>
);

// --- ADVANCED MAP NODE COMPONENT ---
const MapNode = ({ top, left, delay, imgSeed, isCenter = false, name }: { top: string, left: string, delay: number, imgSeed: number, isCenter?: boolean, name?: string }) => (
  <motion.div
    className="absolute z-20 flex flex-col items-center group cursor-pointer"
    style={{ top, left, transform: 'translate(-50%, -50%) translateZ(0)' }}
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    viewport={{ once: true, margin: "-50px" }}
  >
    <div className="relative flex flex-col items-center">
      {/* Radar Pulse Effect */}
      <div className={`absolute inset-0 rounded-full animate-ping opacity-30 ${isCenter ? 'bg-emerald-400 border-2 border-emerald-300' : 'bg-cyan-400 border border-cyan-300'}`} style={{ animationDuration: '2.5s' }}></div>

      {/* Avatar Container */}
      <div className={`relative z-10 rounded-full overflow-hidden border-[3px] shadow-lg transform transition-transform duration-300 group-hover:scale-110 ${isCenter ? 'w-14 h-14 sm:w-16 sm:h-16 border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 p-[2px]' : 'w-8 h-8 sm:w-10 sm:h-10 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700'}`}>
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${imgSeed}&backgroundColor=c0aede,d1d4f9,ffdfbf`}
          alt="User"
          className="w-full h-full rounded-full object-cover bg-white dark:bg-slate-900"
        />
      </div>

      {/* Status Dot */}
      {isCenter && (
        <div className="absolute -bottom-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 sm:h-5 sm:w-5 bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm"></span>
        </div>
      )}

      {/* Hover Label */}
      {name && (
        <div className="absolute top-[120%] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap border border-slate-700 pointer-events-none">
          {name}
        </div>
      )}
    </div>
  </motion.div>
);

const HowItWorks = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isCommunityRulesOpen, setIsCommunityRulesOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  if (!isMounted) return null;

  return (
    <section className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] relative overflow-hidden font-sans transition-colors duration-500 scroll-mt-24 lg:scroll-mt-32" id="how-it-works">

      {/* --- Optimized Background Elements (No CSS Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Hardware-Accelerated Gradients */}
        <div className="absolute top-[10%] left-[20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* --- Header --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-24"
        >
          {/* Badge */}
          <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500">
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">The Process</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[#0f172a] dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
            Fluent in <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2">4 Simple Steps</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto transition-colors duration-500">
            Our intuitive platform adapts to your pace. From your first chat to mastering complex topics, we guide you every step of the way.
          </p>
        </motion.div>

        {/* --- Steps Container --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-24 lg:space-y-32"
        >

          {/* STEP 1: Chat with AI */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-2 lg:order-1 relative group">
              {/* Visual: Abstract Chat Interface */}
              <div className="relative rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 overflow-hidden backdrop-blur-xl transition-all duration-500 group-hover:border-teal-200 dark:group-hover:border-teal-800/50">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
                <div className="space-y-6 mt-4 relative z-10">
                  {/* Bot Message */}
                  <motion.div className="flex gap-4 items-end" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 p-[2px] flex-shrink-0 shadow-md">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="AI" className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                    </div>
                    <div className="relative bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700 max-w-[80%]">
                      <p className="text-sm font-bold text-[#0f172a] dark:text-slate-200 mb-2">Hello! Ready to practice your interview skills?</p>
                      <div className="h-2 w-32 bg-slate-100 dark:bg-slate-700 rounded-full"></div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-800 border-l border-b border-slate-100 dark:border-slate-700 transform rotate-45"></div>
                    </div>
                  </motion.div>

                  {/* User Message */}
                  <motion.div className="flex gap-4 justify-end items-end" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <div className="relative bg-gradient-to-r from-teal-500 to-emerald-500 p-4 rounded-2xl rounded-br-none shadow-lg shadow-teal-500/20 max-w-[80%]">
                      <p className="text-sm font-bold text-white mb-2">Yes, let's start with common questions.</p>
                      <div className="h-2 w-24 bg-white/30 rounded-full"></div>
                      <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-emerald-500 transform rotate-45"></div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex flex-shrink-0 items-center justify-center border-2 border-white dark:border-slate-800 shadow-md">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-300">You</span>
                    </div>
                  </motion.div>

                  {/* Bot Reply */}
                  <motion.div className="flex gap-4 items-end" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                    <div className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 p-[2px] flex-shrink-0 shadow-md">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="AI" className="w-full h-full rounded-full bg-white dark:bg-slate-900" />
                    </div>
                    <div className="relative bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700">
                      <div className="flex gap-1.5 items-center h-5">
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                      <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-slate-800 border-l border-b border-slate-100 dark:border-slate-700 transform rotate-45"></div>
                    </div>
                  </motion.div>
                </div>

                {/* Floating Badge */}
                <motion.div className="absolute top-6 right-6 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 flex items-center gap-2 z-20" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", delay: 0.8 }}>
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">AI Online</span>
                </motion.div>
              </div>

              {/* Back Glow - Hardware Accelerated */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(45,212,191,0.1)_0%,transparent_50%)] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: 'translateZ(0) translate(-50%, -50%)' }}></div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800/50 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#0f172a] dark:text-white tracking-tight">Chat with AI Tutors</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Choose from 5 different AI personas tailored to your learning style. Whether you need a strict grammarian or a casual conversation partner, we have the perfect match.
              </p>
              <ul className="space-y-4">
                {['24/7 Availability', 'Instant Feedback', 'Context-Aware Responses'].map((item, i) => (
                  <motion.li key={i} className="flex items-center text-slate-700 dark:text-slate-300 font-bold" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* STEP 2: Practice Speaking */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-1">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#0f172a] dark:text-white tracking-tight">Real-time Pronunciation</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Our advanced voice engine analyzes your speech patterns in milliseconds. Get immediate visual feedback on tone, pace, and pronunciation accuracy with detailed actionable reports.
              </p>
              <button className="h-12 px-6 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[#0f172a] dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Try Voice Demo <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="order-2 relative group">
              {/* High-End Visual: Voice Analysis Engine */}
              <div className="relative rounded-[2.5rem] bg-[#0b1121] dark:bg-[#070b14] border border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col items-center justify-center h-[360px] sm:h-[400px] overflow-hidden group">
                {/* Hardware Accelerated Glows */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>

                {/* Floating Metric Badges */}
                <motion.div
                  className="absolute top-6 sm:top-8 left-4 sm:left-6 bg-slate-800/60 backdrop-blur-md border border-slate-700 px-3 py-2 sm:px-4 rounded-2xl flex items-center gap-3 shadow-lg z-20"
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                >
                  <div className="bg-emerald-500/20 p-1.5 rounded-lg text-emerald-400"><Activity className="w-4 h-4" /></div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</div>
                    <div className="text-xs sm:text-sm font-extrabold text-white">98.5%</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute top-16 sm:top-12 right-4 sm:right-6 bg-slate-800/60 backdrop-blur-md border border-slate-700 px-3 py-2 sm:px-4 rounded-2xl flex items-center gap-3 shadow-lg z-20"
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}
                >
                  <div className="bg-cyan-500/20 p-1.5 rounded-lg text-cyan-400"><Radio className="w-4 h-4" /></div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tone</div>
                    <div className="text-xs sm:text-sm font-extrabold text-white">Confident</div>
                  </div>
                </motion.div>

                {/* Central Holographic Mic Orb */}
                <div className="relative z-10 my-auto flex items-center justify-center pt-8 sm:pt-0">

                  {/* Rotating Analyzer Rings (SVG) - Hardware Accelerated */}
                  <svg className="absolute w-40 h-40 sm:w-48 sm:h-48 animate-[spin_10s_linear_infinite] will-change-transform" viewBox="0 0 100 100" style={{ transform: 'translateZ(0)' }}>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(45,212,191,0.2)" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(45,212,191,0.8)" strokeWidth="1.5" strokeDasharray="20 40 10 30" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute w-48 h-48 sm:w-56 sm:h-56 animate-[spin_15s_linear_infinite_reverse] will-change-transform" viewBox="0 0 100 100" style={{ transform: 'translateZ(0)' }}>
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(6,182,212,0.6)" strokeWidth="2" strokeDasharray="15 60" strokeLinecap="round" />
                  </svg>

                  {/* Core Glowing Orb */}
                  <motion.div
                    className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(45,212,191,0.4)] sm:shadow-[0_0_40px_rgba(45,212,191,0.5)] z-20 border border-white/20 will-change-transform"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {/* Avoid CSS blur here for performance, use radial gradient */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.4)_0%,transparent_70%)] rounded-full pointer-events-none"></div>
                    <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-md relative z-10" />
                  </motion.div>
                </div>

                {/* Advanced Dense Waveform */}
                <AudioSpectrum />

                <div className="absolute bottom-6 flex items-center gap-2 text-teal-400 text-[10px] sm:text-xs font-bold tracking-widest uppercase bg-slate-900/50 px-4 py-1.5 rounded-full border border-teal-500/20 backdrop-blur-sm z-20">
                  <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_#14b8a6]"></span>
                  Analyzing Speech...
                </div>
              </div>

              {/* Outer Hover Glow (Hardware Accelerated) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: 'translateZ(0) translate(-50%, -50%)' }}></div>
            </motion.div>
          </div>

          {/* STEP 3: Learn with Modules */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-2 lg:order-1 relative group">
              {/* Visual: Stacked Cards */}
              <div className="relative h-[320px] sm:h-[360px] w-full flex justify-center items-center">
                <div className="absolute top-4 w-[75%] h-[200px] sm:h-[240px] bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-300/50 dark:border-slate-700/50 transform scale-90 -rotate-6 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-95 will-change-transform"></div>
                <div className="absolute top-8 w-[85%] h-[200px] sm:h-[240px] bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-200 dark:border-slate-700 transform scale-95 -rotate-3 shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-100 will-change-transform"></div>

                <motion.div
                  className="absolute top-12 w-[95%] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 p-6 md:p-8 will-change-transform"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Module 01</span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">Active</span>
                    </div>
                  </div>
                  <h4 className="text-xl sm:text-2xl font-extrabold text-[#0f172a] dark:text-white mb-2">Business English</h4>
                  <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">Master the terminology of the corporate world.</p>

                  <div className="space-y-2.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Progress</span>
                      <span className="text-emerald-600 dark:text-emerald-400">65%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden shadow-inner transform translateZ(0)">
                      <motion.div
                        className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: "65%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Floating Streak Badge */}
                <motion.div
                  className="absolute -right-2 sm:-right-6 top-24 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-3 z-20 will-change-transform"
                  initial={{ scale: 0, rotate: -15 }}
                  whileInView={{ scale: 1, rotate: 8 }}
                  transition={{ type: "spring", delay: 0.6 }}
                >
                  <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl text-amber-500">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs font-extrabold text-[#0f172a] dark:text-white uppercase tracking-wide">Streak</div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">5 Days</div>
                  </div>
                </motion.div>
              </div>

              {/* Back Glow - Hardware Accelerated */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(52,211,153,0.15)_0%,transparent_60%)] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: 'translateZ(0) translate(-50%, -50%)' }}></div>
            </motion.div>

            <motion.div variants={itemVariants} className="order-1 lg:order-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#0f172a] dark:text-white tracking-tight">Structured Learning Path</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Don't know where to start? Follow our expertly crafted modules covering grammar, business terms, and travel essentials with gamified progress.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mb-1">50+</div>
                  <div className="text-[11px] sm:text-sm font-semibold text-slate-500">Modules Available</div>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-300">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white mb-1">A1-C2</div>
                  <div className="text-[11px] sm:text-sm font-semibold text-slate-500">CEFR Levels</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* STEP 4: Community */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-1">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-100 dark:border-cyan-800/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-6 shadow-sm">
                <Globe2 className="w-7 h-7" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold mb-4 text-[#0f172a] dark:text-white tracking-tight">Connect with Peers</h3>
              <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Join live practice rooms, compete in global leaderboards, and make friends. Learning is faster when you do it together in a supportive, interconnected environment.
              </p>
              <button
                onClick={() => setIsCommunityRulesOpen(true)}
                className="text-teal-600 dark:text-teal-400 text-base font-bold flex items-center gap-2 hover:opacity-80 transition-opacity group"
              >
                View Community Rules
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="order-2 relative group">
              {/* High-End Visual: Global Node Network */}
              <div className="relative rounded-[2.5rem] bg-[#0b1121] dark:bg-[#070b14] border border-slate-800 shadow-2xl h-[360px] sm:h-[400px] w-full overflow-hidden flex items-center justify-center">

                {/* Inner Atmospheric Glows (Hardware Accelerated) */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>

                {/* Dotted Holographic Map Background */}
                <div
                  className="absolute inset-0 opacity-40 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
                  }}
                ></div>

                {/* Simulated 3D Plane Rotation */}
                <div className="absolute inset-0 w-full h-full will-change-transform" style={{ perspective: '1000px' }}>
                  <div className="absolute inset-0 w-full h-full" style={{ transform: 'rotateX(20deg) rotateZ(0deg)', transformStyle: 'preserve-3d' }}>

                    {/* Glowing Data Arcs (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 sm:opacity-100" style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.5))' }}>
                      <defs>
                        <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0" />
                          <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
                          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Curved Connections */}
                      {[
                        { d: "M 150 120 Q 250 50 350 180", delay: 0 },
                        { d: "M 80 200 Q 200 150 250 100", delay: 1.2 },
                        { d: "M 350 250 Q 280 300 200 200", delay: 0.6 },
                        { d: "M 100 300 Q 200 250 300 320", delay: 1.8 }
                      ].map((path, i) => (
                        <motion.path
                          key={`arc-${i}`}
                          d={path.d}
                          fill="none"
                          stroke="url(#arcGrad)"
                          strokeWidth="2"
                          strokeLinecap="round"
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: 0.8 }}
                          transition={{ duration: 2.5, delay: 0.2 + path.delay, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                        />
                      ))}
                    </svg>

                    {/* Interactive Map Nodes (Avatars) */}
                    <MapNode top="30%" left="35%" delay={0} imgSeed={12} name="Sarah (US)" />
                    <MapNode top="45%" left="55%" delay={0.2} imgSeed={23} isCenter name="Matchmaking..." />
                    <MapNode top="35%" left="75%" delay={0.4} imgSeed={34} name="James (UK)" />
                    <MapNode top="65%" left="20%" delay={0.6} imgSeed={45} name="Carlos (BR)" />
                    <MapNode top="75%" left="65%" delay={0.8} imgSeed={56} name="Yuki (KR)" />
                  </div>
                </div>

                {/* Floating Glass "Live Matchmaking" Panel */}
                <motion.div
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 p-4 rounded-2xl flex flex-col gap-3 shadow-2xl z-30 w-[90%] sm:w-auto min-w-[220px]"
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Signal className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-slate-200">Live Practice</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">C1 Level</span>
                  </div>

                  <div className="flex items-center justify-between mt-1 border-t border-slate-700/50 pt-3">
                    <div className="flex -space-x-3">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden z-20">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" alt="You" />
                      </div>
                      <div className="w-8 h-8 rounded-full border-2 border-slate-800 bg-teal-500 flex items-center justify-center overflow-hidden z-10 opacity-80">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Partner" alt="Partner" />
                      </div>
                    </div>
                    <button className="text-[10px] font-bold bg-teal-500 text-white px-3 py-1.5 rounded-lg hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20">
                      Join Room
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* Outer Hover Glow (Hardware Accelerated) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_60%)] -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ transform: 'translateZ(0) translate(-50%, -50%)' }}></div>
            </motion.div>
          </div>

        </motion.div>

        {/* --- CTA Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-[#0f172a] shadow-2xl border border-slate-800 transform translateZ(0)"
        >
          {/* Advanced Gradient Overlay (Hardware Accelerated) */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/80 via-[#0f172a] to-emerald-900/80 z-0"></div>
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[100%] bg-[radial-gradient(circle,rgba(20,184,166,0.2)_0%,transparent_60%)] rounded-full z-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[80%] bg-[radial-gradient(circle,rgba(16,185,129,0.2)_0%,transparent_60%)] rounded-full z-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>

          {/* Pattern Grid */}
          <div className="absolute inset-0 opacity-10 z-0 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 p-8 sm:p-14 md:p-16 items-center">
            <div className="text-center sm:text-left">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight leading-[1.1]">Ready to Transform Your English?</h2>
              <p className="text-slate-300 text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto sm:mx-0 leading-relaxed font-medium">
                Join 50,000+ learners who have accelerated their fluency with CognitoSpeak. Start your journey today—no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center sm:justify-start">
                <Link
                  to="/signup"
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-emerald-500 text-white hover:bg-emerald-400 font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 flex items-center justify-center"
                >
                  Get Started Free
                </Link>
                <button
                  onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="h-12 sm:h-14 px-6 sm:px-8 rounded-full border border-slate-600 bg-white/5 hover:bg-white/10 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all hover:-translate-y-1"
                >
                  View Pricing
                </button>
              </div>
            </div>

            {/* Abstract Graphic Right Side */}
            <div className="hidden lg:flex justify-end relative h-full items-center">
              <motion.div
                className="w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center relative z-10 will-change-transform"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Glass Orb Background */}
                <div className="absolute inset-0 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 shadow-[inset_0_0_40px_rgba(255,255,255,0.1),0_20px_40px_rgba(0,0,0,0.4)]"></div>

                <motion.div
                  className="absolute -top-4 -right-2 bg-emerald-500 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-2xl shadow-xl shadow-emerald-500/20 border border-emerald-400 font-extrabold text-xs sm:text-sm tracking-wide z-20 will-change-transform"
                  animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Start Now!
                </motion.div>

                <div className="text-center relative z-20">
                  <div className="text-6xl sm:text-7xl font-black mb-1 tracking-tighter text-white drop-shadow-md">14</div>
                  <div className="text-base sm:text-lg font-bold opacity-80 uppercase tracking-widest text-teal-100">Day Trial</div>
                </div>
              </motion.div>

              {/* Orb back shadow/glow (Hardware Accelerated) */}
              <div className="absolute top-1/2 right-10 -translate-y-1/2 w-56 h-56 sm:w-64 sm:h-64 bg-[radial-gradient(circle,rgba(20,184,166,0.3)_0%,transparent_70%)] rounded-full z-0" style={{ transform: 'translateZ(0)' }}></div>
            </div>
          </div>
        </motion.div>

      </div>

      <CommunityRulesModal
        isOpen={isCommunityRulesOpen}
        onClose={() => setIsCommunityRulesOpen(false)}
      />
    </section>
  );
};

export default HowItWorks;