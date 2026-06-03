import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Sparkles, CheckCircle2, BookOpen, Moon, Sun } from 'lucide-react';

// --- MAIN LOGO COMPONENT --- //

interface AlexLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

export function AlexAILogo({ size = 'hero', showLabel = true }: AlexLogoProps) {
  // Sizing configurations
  const sizeMap = {
    sm: { container: 'w-12 h-12', radius: 'rounded-xl', stroke: 2, icon: 16 },
    md: { container: 'w-20 h-20', radius: 'rounded-2xl', stroke: 2.5, icon: 28 },
    lg: { container: 'w-32 h-32', radius: 'rounded-[2rem]', stroke: 3, icon: 48 },
    hero: { container: 'w-48 h-48', radius: 'rounded-[3rem]', stroke: 4, icon: 72 },
  };

  const currentSize = sizeMap[size];
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = showLabel && !prefersReducedMotion;

  // 3D Parallax Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for buttery Apple-like physics
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "200%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "200%"]);
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 group">
      
      {/* 3D Container */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative ${currentSize.container} cursor-pointer transition-transform duration-300 group-hover:scale-105`}
      >
        {/* Dynamic Drop Shadow matching the tilt */}
        <motion.div 
          style={{ x: shadowX, y: shadowY }}
          className={`absolute -inset-3 bg-[#10B981]/25 dark:bg-[#10B981]/20 blur-2xl rounded-full transition-opacity duration-500 opacity-55 group-hover:opacity-100 -z-10`}
        />

        {/* --- THE APPLE-STYLE SQUIRCLE ICON --- */}
        <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFF] to-[#E2E8F0] dark:from-[#0B1020] dark:via-[#111827] dark:to-[#050816] border border-black/5 dark:border-white/10 shadow-[0_14px_40px_rgba(15,23,42,0.12)] dark:shadow-[0_14px_40px_rgba(0,0,0,0.48)]`}>
          
          {/* 1. Animated Siri/AI Gradient Mesh Background */}
          <div className="absolute inset-0 opacity-80 dark:opacity-90 mix-blend-multiply dark:mix-blend-screen">
            <motion.div 
              animate={shouldAnimate ? { rotate: 360, scale: [1, 1.16, 1] } : undefined}
              transition={shouldAnimate ? { duration: 15, repeat: Infinity, ease: "linear" } : undefined}
              className="absolute -top-1/2 -left-1/2 w-full h-full bg-[#38BDF8] rounded-full blur-3xl opacity-55"
            />
            <motion.div 
              animate={shouldAnimate ? { rotate: -360, scale: [1, 1.24, 1] } : undefined}
              transition={shouldAnimate ? { duration: 20, repeat: Infinity, ease: "linear" } : undefined}
              className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-[#818CF8] rounded-full blur-3xl opacity-55"
            />
            <motion.div 
              animate={shouldAnimate ? { x: [-20, 20, -20], y: [-20, 20, -20], scale: [1, 1.05, 1] } : undefined}
              transition={shouldAnimate ? { duration: 10, repeat: Infinity, ease: "easeInOut" } : undefined}
              className="absolute top-1/4 right-1/4 w-3/4 h-3/4 bg-[#FB7185] rounded-full blur-3xl opacity-35"
            />
          </div>

          {/* 2. Frosted Glass Overlay */}
          <div className="absolute inset-0 backdrop-blur-[8px] bg-white/14 dark:bg-black/20" />

          {/* 3. The Core Glyph: Abstract 'A' + Checkmark + Edit Spark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ transform: "translateZ(30px)" }}>
            <svg 
              viewBox="0 0 100 100" 
              className="w-3/4 h-3/4 overflow-visible drop-shadow-[0_6px_14px_rgba(15,23,42,0.16)]"
            >
              <defs>
                <linearGradient id="glyphGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#047857" />
                  <stop offset="50%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
                <linearGradient id="glyphGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A7F3D0" />
                  <stop offset="50%" stopColor="#34D399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="glyphRing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="50%" stopColor="#BFDBFE" />
                  <stop offset="100%" stopColor="#93C5FD" />
                </linearGradient>
              </defs>

              {/* The "A" / Ribbon Checkmark Path */}
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
                transition={shouldAnimate ? { duration: 2, ease: "easeInOut", delay: 0.2 } : undefined}
                d="M 26 74 L 50 20 L 62 45 L 46 66 L 78 31"
                fill="none"
                stroke="url(#glyphGrad)"
                strokeWidth={currentSize.stroke * 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:hidden"
              />
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={shouldAnimate ? { pathLength: 1, opacity: 1 } : undefined}
                transition={shouldAnimate ? { duration: 2, ease: "easeInOut", delay: 0.2 } : undefined}
                d="M 26 74 L 50 20 L 62 45 L 46 66 L 78 31"
                fill="none"
                stroke="url(#glyphGradDark)"
                strokeWidth={currentSize.stroke * 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hidden dark:block"
              />

              <motion.circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="url(#glyphRing)"
                strokeWidth={currentSize.stroke * 0.8}
                strokeDasharray="2 7"
                opacity="0.35"
                animate={shouldAnimate ? { rotate: 360 } : undefined}
                transition={shouldAnimate ? { duration: 12, repeat: Infinity, ease: "linear" } : undefined}
                style={{ transformOrigin: 'center' }}
              />

              {/* Crossbar of the 'A' (The Editing Pen Stroke) */}
              <motion.path
                initial={{ scaleX: 0, opacity: 0 }}
                animate={shouldAnimate ? { scaleX: 1, opacity: 1 } : undefined}
                transition={shouldAnimate ? { duration: 1, delay: 1.5, ease: "easeOut" } : undefined}
                d="M 35 55 L 65 55"
                fill="none"
                stroke="#34D399"
                strokeWidth={currentSize.stroke * 1.5}
                strokeLinecap="round"
                transform-origin="center"
              />
            </svg>

            {/* Orbiting AI Spark (Represents scanning/thinking) */}
            <motion.div
              animate={shouldAnimate ? { rotate: 360 } : undefined}
              transition={shouldAnimate ? { duration: 8, repeat: Infinity, ease: "linear" } : undefined}
              className="absolute w-[85%] h-[85%] rounded-full border border-transparent"
            >
              <motion.div 
                animate={shouldAnimate ? { scale: [1, 1.42, 1], opacity: [0.45, 1, 0.45] } : undefined}
                transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="absolute -top-1 left-1/2 -ml-2 w-4 h-4 bg-emerald-400 dark:bg-emerald-300 rounded-full blur-[2px] flex items-center justify-center shadow-[0_0_14px_rgba(16,185,129,0.8)]"
              >
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </motion.div>
            </motion.div>
          </div>

          {/* 4. Interactive Glare (Apple Glass Effect) */}
          <motion.div 
            style={{ x: glareX, y: glareY }}
            className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-white/45 via-white/5 to-transparent pointer-events-none -z-0 blur-md transform -rotate-45"
          />
          
          {/* Inner Highlights */}
          <div className="absolute inset-0 rounded-[inherit] border border-white/40 dark:border-white/10 pointer-events-none z-10" />
          <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.15)] pointer-events-none z-10" />
        </div>
      </motion.div>

      {/* --- TYPOGRAPHY SECTION --- */}
      {showLabel && (
        <div className="text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex items-center gap-1.5 mb-1"
          >
            <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Alex
            </h2>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="text-[13px] md:text-[14px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI English Tutor
          </motion.p>
        </div>
      )}
    </div>
  );
}

// --- DEMO / PRESENTATION ENVIRONMENT --- //

export default function AlexLogoPresentation() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] transition-colors duration-500 font-sans flex flex-col items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-rose-500/10 dark:bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <BookOpen className="w-6 h-6" />
          <span className="font-bold tracking-tight text-lg">Alex AI Persona</span>
        </div>
        
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center justify-center gap-2 text-[14px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Hero Logo Showcase */}
      <div className="flex flex-col items-center mb-24 relative z-10">
        <AlexAILogo size="hero" showLabel={true} />
        
        {/* Core Capabilities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <CapabilityBadge icon={CheckCircle2} text="Flawless Grammar" color="text-emerald-500" />
          <CapabilityBadge icon={Sparkles} text="Smart Corrections" color="text-blue-500" />
          <CapabilityBadge icon={BookOpen} text="Friendly Tone" color="text-rose-500" />
        </motion.div>
      </div>

      {/* System Icon Sizes Showcase */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="w-full max-w-3xl border-t border-slate-200 dark:border-white/10 pt-12 relative z-10"
      >
        <h3 className="text-center text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-10">
          System Icon Adaptability
        </h3>
        
        <div className="flex flex-wrap items-end justify-center gap-12 md:gap-20">
          <div className="flex flex-col items-center gap-4">
            <AlexAILogo size="lg" showLabel={false} />
            <span className="text-xs font-semibold text-slate-500">Large (128px)</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AlexAILogo size="md" showLabel={false} />
            <span className="text-xs font-semibold text-slate-500">Medium (80px)</span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <AlexAILogo size="sm" showLabel={false} />
            <span className="text-xs font-semibold text-slate-500">Small (48px)</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

// Small helper component for the badges
function CapabilityBadge({ icon: Icon, text, color }: { icon: any, text: string, color: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#1C1C1E] border border-slate-200 dark:border-white/10 shadow-sm">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{text}</span>
    </div>
  );
}