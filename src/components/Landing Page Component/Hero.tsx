import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- TYPES ---
interface User {
  id: string;
  name: string;
  location: string;
  message: string;
  avatar: string;
  flag: string;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  bubblePosition: 'top' | 'bottom' | 'left' | 'right';
  bubbleColor: string;
  delay: number;
  svgStart: { x: number; y: number }; // Percentage coordinates for SVG lines
}

// --- GLOBAL NETWORK ARCS (INSIDE GLOBE) ---
// Simulates live connections happening across different continents
const GlobalNetworkArcs = () => {
  const arcs = [
    { id: 1, d: "M 20 40 Q 40 10 60 30", delay: 0, duration: 3 },
    { id: 2, d: "M 60 30 Q 70 50 80 40", delay: 1.5, duration: 2.5 },
    { id: 3, d: "M 20 60 Q 40 80 70 60", delay: 0.8, duration: 3.5 },
    { id: 4, d: "M 30 20 Q 50 50 20 80", delay: 2.2, duration: 4 },
    { id: 5, d: "M 70 20 Q 90 50 70 80", delay: 1.1, duration: 3 },
    { id: 6, d: "M 40 70 Q 60 90 80 70", delay: 2.8, duration: 2.8 },
  ];

  return (
    <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      {arcs.map((arc) => (
        <g key={arc.id}>
          {/* Subtle base line */}
          <path d={arc.d} fill="none" stroke="rgba(45, 212, 191, 0.15)" strokeWidth="0.5" />
          {/* Animated data pulse across continents */}
          <motion.path
            d={arc.d}
            fill="none"
            stroke="#5eead4"
            strokeWidth="0.8"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: arc.duration,
              repeat: Infinity,
              delay: arc.delay,
              ease: "easeInOut"
            }}
          />
          {/* Ping at destination */}
          <motion.circle
            cx="0" cy="0" r="1.5"
            fill="#34d399"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.5] }}
            transition={{ duration: arc.duration, repeat: Infinity, delay: arc.delay + arc.duration * 0.8 }}
            style={{ offsetPath: `path('${arc.d}')`, offsetDistance: '100%' } as any}
          />
        </g>
      ))}
    </svg>
  );
};

// --- ADVANCED 3D GLOBE COMPONENT (PERFORMANCE OPTIMIZED) ---
const RealisticGlobe = () => {
  // Safe checks for window to avoid SSR errors
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <div className="relative w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] flex items-center justify-center z-20 will-change-transform">
      {/* Outer Atmosphere Glow - Hardware Accelerated via Radial Gradients instead of Box Blurs */}
      <div className="absolute inset-[-20%] bg-[radial-gradient(circle,rgba(45,212,191,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(45,212,191,0.1)_0%,transparent_70%)] rounded-full pointer-events-none" style={{ transform: 'translateZ(0)' }}></div>

      {/* 3D Sphere Base */}
      <div className="relative w-full h-full rounded-full overflow-hidden shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.8),inset_10px_10px_40px_rgba(255,255,255,0.3),0_0_40px_rgba(45,212,191,0.4)] dark:shadow-[inset_-30px_-30px_60px_rgba(0,0,0,0.9),inset_10px_10px_40px_rgba(255,255,255,0.1),0_0_40px_rgba(45,212,191,0.2)] bg-[#0f172a]">

        {/* Scrolling World Map - Optimized via Hardware-Accelerated Masking instead of heavy CSS filters */}
        <div
          className="absolute inset-0 w-[200%] h-full opacity-80 bg-teal-300 dark:bg-emerald-500"
          style={{
            WebkitMaskImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
            WebkitMaskSize: '50% 100%',
            WebkitMaskRepeat: 'repeat-x',
            maskImage: `url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')`,
            maskSize: '50% 100%',
            maskRepeat: 'repeat-x',
            animation: 'rotateGlobe 30s linear infinite',
          }}
        />

        {/* Global Connection Arcs (The active network) */}
        <GlobalNetworkArcs />

        {/* Latitude/Longitude Overlay for 3D depth */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none"></div>
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 100">
          <ellipse cx="50" cy="50" rx="25" ry="49" fill="none" stroke="#fff" strokeWidth="0.2" />
          <ellipse cx="50" cy="50" rx="49" ry="25" fill="none" stroke="#fff" strokeWidth="0.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#fff" strokeWidth="0.2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#fff" strokeWidth="0.2" />
        </svg>

        {/* Dynamic City Nodes - Reduced count on mobile for performance */}
        {[...Array(isTouchDevice ? 6 : 12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_#fff,0_0_15px_#5eead4] will-change-transform"
            style={{
              top: `${15 + (i * 60) % 70}%`,
              left: `${15 + (i * 45) % 70}%`,
              transform: 'translateZ(0)',
            }}
            animate={prefersReducedMotion ? {} : { opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{
              duration: isTouchDevice ? 2 : 1.5 + (i % 2),
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Front Glass Reflection */}
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.25)_0%,transparent_50%)] pointer-events-none"></div>
      </div>

      {/* Floating Status Pill */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute -bottom-4 bg-slate-900/80 dark:bg-black/80 backdrop-blur-md border border-slate-700/50 px-4 py-2 rounded-full shadow-lg z-30 flex items-center gap-2"
      >
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-xs font-semibold text-slate-200">12,403 live connections</span>
      </motion.div>
    </div>
  );
};

// --- MAIN HERO COMPONENT ---
export default function Hero() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // User Data with precise coordinates for the SVG data streams
  const users: User[] = [
    {
      id: '1',
      name: 'Sarah',
      location: 'New York',
      message: "Let's practice together!",
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
      flag: '🇺🇸',
      position: { top: '8%', left: '5%' },
      svgStart: { x: 15, y: 15 },
      bubblePosition: 'top',
      bubbleColor: 'text-emerald-600 dark:text-emerald-400',
      delay: 0.8,
    },
    {
      id: '2',
      name: 'James',
      location: 'London',
      message: 'Great work!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      flag: '🇬🇧',
      position: { top: '15%', right: '2%' },
      svgStart: { x: 85, y: 22 },
      bubblePosition: 'top',
      bubbleColor: 'text-blue-600 dark:text-blue-400',
      delay: 1.0,
    },
    {
      id: '3',
      name: 'Raj',
      location: 'Mumbai',
      message: 'How do you say...?',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      flag: '🇮🇳',
      position: { bottom: '25%', left: '8%' },
      svgStart: { x: 18, y: 70 },
      bubblePosition: 'left',
      bubbleColor: 'text-indigo-600 dark:text-indigo-400',
      delay: 1.2,
    },
    {
      id: '4',
      name: 'Emma',
      location: 'Seoul',
      message: 'That makes sense!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
      flag: '🇰🇷',
      position: { bottom: '18%', right: '5%' },
      svgStart: { x: 85, y: 75 },
      bubblePosition: 'right',
      bubbleColor: 'text-teal-600 dark:text-teal-400',
      delay: 1.4,
    }
  ];

  if (!isMounted) return null;

  return (
    <section className="relative min-h-screen bg-[#f8fbff] dark:bg-[#070b14] font-sans overflow-hidden flex items-center pt-8 pb-20 selection:bg-emerald-100 dark:selection:bg-emerald-900/50 selection:text-emerald-900 dark:selection:text-emerald-200 transition-colors duration-500 ease-in-out">

      {/* Global CSS Animations */}
      <style>{`
        @keyframes rotateGlobe {
          0% { background-position: 0% 0; }
          100% { background-position: -100% 0; }
        }
        @keyframes dashFlow {
          0% { stroke-dashoffset: 1000; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>

      {/* Optimized Ambient Background Glows & Patterns */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 text-slate-500 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Hardware-Accelerated Gradients (Replaces heavy CSS Blurs) */}
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.05)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* --- LEFT COLUMN: TYPOGRAPHY & CTAS --- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-5 flex flex-col justify-center text-center lg:text-left pt-10 lg:pt-0 max-w-2xl mx-auto lg:mx-0 relative z-30"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto lg:mx-0 mb-6 inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500 ease-in-out"
            >
              <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight transition-colors duration-500 ease-in-out">Active: 100+ Countries Connected</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold leading-[1.1] tracking-tight text-[#0f172a] dark:text-white mb-6 transition-colors duration-500 ease-in-out"
            >
              Speak English<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 block mt-2 pb-2">
                Fearlessly.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium mx-auto lg:mx-0 max-w-[480px] transition-colors duration-500 ease-in-out"
            >
              Your AI tutor connects you with learners worldwide. Practice 24/7, get real-time feedback, and build confidence in every conversation.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                to="/signup"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-[#0f172a] dark:bg-emerald-500 text-white dark:hover:bg-emerald-400 hover:bg-black font-semibold text-base shadow-xl shadow-slate-900/10 dark:shadow-emerald-900/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/demo" className="w-full sm:w-auto h-14 px-8 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-base shadow-sm transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                Try Voice Demo
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex items-center justify-center lg:justify-start gap-4"
            >
              <div className="flex -space-x-3">
                {['women', 'men', 'women', 'men'].map((gender, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#f8fbff] dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex-shrink-0 shadow-sm overflow-hidden transition-all duration-500 ease-in-out">
                    <img src={`https://randomuser.me/api/portraits/thumb/${gender}/${i + 10}.jpg`} alt="user avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-500 ease-in-out">
                Trusted by <span className="text-slate-800 dark:text-white">50,000+</span> learners
              </p>
            </motion.div>
          </motion.div>

          {/* --- RIGHT COLUMN: GLOBE & ACTIVE CONNECTIONS --- */}
          <div className="lg:col-span-7 relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center z-10 mt-10 lg:mt-0">

            {/* SVG Dynamic Data Streams Overlay - Pure CSS Colors to avoid JS Re-renders */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden sm:block" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientSarah" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(52,211,153,1)" />
                  <stop offset="100%" stopColor="rgba(52,211,153,0)" />
                </linearGradient>
                <linearGradient id="gradientJames" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(59,130,246,1)" />
                  <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                </linearGradient>
                <linearGradient id="gradientRaj" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(99,102,241,1)" />
                  <stop offset="100%" stopColor="rgba(99,102,241,0)" />
                </linearGradient>
                <linearGradient id="gradientEmma" x1="100%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="rgba(45,212,191,1)" />
                  <stop offset="100%" stopColor="rgba(45,212,191,0)" />
                </linearGradient>
              </defs>

              {/* Data Streams */}
              {users.map((user, i) => {
                const pathD = `M ${user.svgStart.x} ${user.svgStart.y} C ${user.svgStart.x > 50 ? 60 : 40} ${user.svgStart.y}, ${user.svgStart.x > 50 ? 60 : 40} 50, 50 50`;
                const gradientId = i === 0 ? "url(#gradientSarah)" : i === 1 ? "url(#gradientJames)" : i === 2 ? "url(#gradientRaj)" : "url(#gradientEmma)";

                return (
                  <g key={`stream-${user.id}`} className="opacity-70 dark:opacity-90 text-slate-300/60 dark:text-slate-700/60">
                    {/* Base conduit line - Uses currentColor configured via Tailwind text- utilities on the group */}
                    <path d={pathD} fill="none" stroke="currentColor" strokeWidth="0.2" />
                    {/* Flowing Data Packet */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={gradientId}
                      strokeWidth="0.4"
                      strokeDasharray="5 1000"
                      strokeLinecap="round"
                      style={{ animation: `dashFlow ${2 + i * 0.3}s linear infinite` }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Holographic Pedestal Base - Optimized */}
            <div className="absolute bottom-4 sm:bottom-12 lg:bottom-16 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[200px] pointer-events-none flex flex-col items-center justify-end z-10">
              <div className="absolute bottom-0 w-[80%] h-[150px] bg-[radial-gradient(ellipse,rgba(94,234,212,0.2)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(20,184,166,0.1)_0%,transparent_70%)] rounded-full transition-colors duration-500" style={{ transform: 'translateZ(0)' }}></div>

              <motion.div
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-[85%] h-[120px] border border-cyan-300/30 dark:border-cyan-500/20 rounded-[100%] shadow-[0_0_30px_rgba(45,212,191,0.2)_inset,0_20px_40px_rgba(45,212,191,0.2)] dark:shadow-[0_0_30px_rgba(45,212,191,0.1)_inset,0_20px_40px_rgba(45,212,191,0.1)] absolute bottom-[10px] transition-colors duration-500"
              />
              <motion.div
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="w-[65%] h-[90px] border-2 border-emerald-300/50 dark:border-emerald-500/30 rounded-[100%] shadow-[0_0_40px_rgba(52,211,153,0.4)] dark:shadow-[0_0_40px_rgba(52,211,153,0.2)] absolute bottom-[30px] transition-colors duration-500"
              />
              <div className="w-[45%] h-[60px] border-[3px] border-teal-200/80 dark:border-teal-500/50 rounded-[100%] shadow-[0_0_50px_rgba(45,212,191,0.8),inset_0_0_20px_rgba(255,255,255,0.5)] dark:shadow-[0_0_50px_rgba(45,212,191,0.4),inset_0_0_20px_rgba(255,255,255,0.1)] bg-teal-100/20 dark:bg-teal-900/30 absolute bottom-[50px] flex items-center justify-center transition-colors duration-500">
                <div className="w-[80%] h-[60%] rounded-[100%] bg-[radial-gradient(ellipse,rgba(255,255,255,0.6)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse,rgba(255,255,255,0.2)_0%,transparent_70%)]"></div>
              </div>
              <div className="absolute bottom-[80px] w-[30%] h-[200px] bg-[radial-gradient(ellipse_at_bottom,rgba(94,234,212,0.3)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_at_bottom,rgba(20,184,166,0.1)_0%,transparent_70%)] rounded-full transition-colors duration-500"></div>
            </div>

            {/* Orbiting Tech Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 hidden sm:flex">
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[120%] h-[120%] border-[1.5px] border-dashed border-cyan-400/20 dark:border-cyan-400/10 rounded-full"
                style={{ transform: 'rotateX(75deg) rotateY(-10deg) translateZ(0)' }}
              />
              <motion.div
                animate={{ rotateZ: -360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute w-[130%] h-[130%] border-[1px] border-emerald-300/30 dark:border-emerald-400/10 rounded-full"
                style={{ transform: 'rotateX(70deg) rotateY(15deg) translateZ(0)' }}
              />
              {/* Orbital satellites */}
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-[125%] h-[125%]"
                style={{ transform: 'rotateX(72deg) translateZ(0)' }}
              >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-white dark:bg-slate-200 rounded-full shadow-[0_0_10px_#fff]"></div>
                <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-teal-200 dark:bg-teal-400 rounded-full shadow-[0_0_8px_#5eead4]"></div>
              </motion.div>
            </div>

            {/* The 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute z-20 pb-10" // Padding to lift onto pedestal
            >
              <RealisticGlobe />
            </motion.div>

            {/* Floating Avatars & Active Chat Bubbles */}
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, delay: user.delay, type: "spring", stiffness: 90 }}
                className="absolute z-30 flex flex-col items-center group"
                style={user.position}
              >
                {/* Chat Bubble Simulation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: user.delay + 0.3 }}
                  className={`absolute bg-white/95 dark:bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-teal-500/10 dark:shadow-black/50 border border-slate-100 dark:border-slate-700 whitespace-nowrap transform transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-105 z-20 ${user.bubblePosition === 'top' ? 'bottom-[calc(100%+16px)]' :
                    user.bubblePosition === 'bottom' ? 'top-[calc(100%+16px)]' :
                      user.bubblePosition === 'left' ? 'right-[calc(100%+16px)] top-0' :
                        'left-[calc(100%+16px)] top-0'
                    }`}
                >
                  <p className={`text-sm font-bold ${user.bubbleColor} flex items-center gap-2`}>
                    {user.message}
                  </p>

                  {/* Bubble Pointer */}
                  <div className={`absolute w-3 h-3 bg-white/95 dark:bg-slate-800/95 border-slate-100 dark:border-slate-700 transform rotate-45 ${user.bubblePosition === 'top' ? '-bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b' :
                    user.bubblePosition === 'bottom' ? '-top-1.5 left-1/2 -translate-x-1/2 border-l border-t' :
                      user.bubblePosition === 'left' ? '-right-1.5 top-1/2 -translate-y-1/2 border-r border-t' :
                        '-left-1.5 top-1/2 -translate-y-1/2 border-l border-b'
                    }`}></div>
                </motion.div>

                {/* Avatar */}
                <div className="relative">
                  {/* Avatar Connection Pulse Glow */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.5)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>

                  <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] rounded-full border-[3px] border-white dark:border-slate-800 bg-gradient-to-br from-teal-400 to-emerald-400 p-[2px] shadow-2xl overflow-hidden transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-teal-500/30 cursor-pointer relative z-10">
                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" crossOrigin="anonymous" />
                  </div>
                </div>

                {/* Location Pill */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: user.delay + 0.4 }}
                  className="mt-[-10px] bg-white dark:bg-slate-800 px-3 py-1 rounded-full shadow-lg border border-slate-100 dark:border-slate-700 whitespace-nowrap z-20 relative group-hover:-translate-y-1 transition-transform"
                >
                  <p className="text-[11px] sm:text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 uppercase tracking-wide transition-colors duration-500">
                    <span className="text-sm leading-none drop-shadow-sm">{user.flag}</span> {user.location}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Fade Transition into the next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#f8fbff] dark:from-[#070b14] to-transparent z-20 pointer-events-none transition-colors duration-500 ease-in-out"></div>
    </section>
  );
}