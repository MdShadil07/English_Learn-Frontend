import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Microscope, Zap, ShieldCheck, Moon, Sun, Target, Award, Crosshair } from 'lucide-react';

// --- MAIN LOGO COMPONENT --- //

interface TaylorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

export function LiamAILogo({ size = 'hero', showLabel = true }: TaylorLogoProps) {
  const sizeMap = {
    sm: { container: 'w-12 h-12', radius: 'rounded-[0.9rem]' },
    md: { container: 'w-20 h-20', radius: 'rounded-[1.2rem]' },
    lg: { container: 'w-32 h-32', radius: 'rounded-[1.8rem]' },
    hero: { container: 'w-48 h-48', radius: 'rounded-[2.5rem]' },
  };

  const currentSize = sizeMap[size];
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = showLabel && !prefersReducedMotion;

  // Advanced Buttery 3D Parallax Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["18deg", "-18deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-18deg", "18deg"]);
  
  // Depth offsets for internal layers (Massive 3D Depth)
  const dialX = useTransform(mouseXSpring, [-0.5, 0.5], ["-8px", "8px"]);
  const dialY = useTransform(mouseYSpring, [-0.5, 0.5], ["-8px", "8px"]);
  const coreX = useTransform(mouseXSpring, [-0.5, 0.5], ["15px", "-15px"]);
  const coreY = useTransform(mouseYSpring, [-0.5, 0.5], ["15px", "-15px"]);
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-30px", "30px"]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-30px", "30px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div className="flex flex-col items-center gap-7 group">
      
      {/* 3D Physics Container */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative ${currentSize.container} cursor-pointer transition-transform duration-500 hover:scale-105 z-10`}
      >
        {/* Dynamic Heavy Drop Shadow (Rich Crimson/Amber tint) */}
        <motion.div 
          style={{ x: shadowX, y: shadowY }}
          className="absolute -inset-2 bg-gradient-to-br from-[#DC2626]/50 to-[#92400E]/40 dark:from-[#991B1B]/50 dark:to-[#78350F]/40 blur-2xl rounded-full transition-opacity duration-500 opacity-60 group-hover:opacity-100 -z-20"
        />

        {/* --- LUXURY HARDWARE SQUIRCLE --- */}
        <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#CBD5E1] dark:from-[#1A1A1C] dark:to-[#050505] p-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)]`}>
          
          {/* Animated Edge Glint (Simulates a polished metal chamfer) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%] z-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, #FCA5A5 45%, #FDE68A 50%, #FCA5A5 55%, transparent 60%, transparent 100%)'
            }}
          />
          
          {/* Obsidian / Brushed Platinum Core Plate */}
          <div className={`absolute inset-[2px] ${currentSize.radius} bg-gradient-to-br from-[#FFFFFF] to-[#E2E8F0] dark:from-[#111111] dark:to-[#000000] overflow-hidden z-10`}>
            
            {/* Background Texture: Luxury Brushed Metal Dial */}
            <div className="absolute inset-0 opacity-[0.6] dark:opacity-[0.9]"
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.08) 0%, transparent 70%)' }} />
                 
            {/* Floating High-Intensity Embers */}
            {size === 'hero' && <AmbientEmbers />}

            {/* --- RECESSED CHRONOGRAPH DIALS (Precision & Timing) --- */}
            <motion.div 
              style={{ x: dialX, y: dialY, transform: "translateZ(10px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* Radar / Scanning Grid Background */}
              <div className="absolute w-[80%] h-[80%] rounded-full border border-slate-300/50 dark:border-white/5 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.02)_100%)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]" />
              
              {/* Outer Counter-Clockwise Ring */}
              <motion.div 
                animate={shouldAnimate ? { rotate: -360 } : undefined}
                transition={shouldAnimate ? { duration: 40, repeat: Infinity, ease: "linear" } : undefined}
                className="absolute w-[85%] h-[85%] border-[1.5px] border-dashed border-red-900/30 dark:border-red-500/30 rounded-full"
              />
              
              {/* Pulsing Analysis Waves */}
              <motion.div
                animate={shouldAnimate ? { scale: [0.5, 1], opacity: [0.8, 0] } : undefined}
                transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: "easeOut" } : undefined}
                className="absolute w-[70%] h-[70%] border border-[#F59E0B] rounded-full"
              />
              <motion.div
                animate={shouldAnimate ? { scale: [0.5, 1], opacity: [0.8, 0] } : undefined}
                transition={shouldAnimate ? { duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 } : undefined}
                className="absolute w-[70%] h-[70%] border border-[#EF4444] rounded-full"
              />
            </motion.div>

            {/* --- 3D FORGED 'PRECISION CORE' EMBLEM --- */}
            <motion.div 
              style={{ x: coreX, y: coreY, transform: "translateZ(60px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] drop-shadow-[0_15px_20px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] overflow-visible">
                <defs>
                  {/* Ultra-Realistic 3D Gold Facet Gradients */}
                  <linearGradient id="goldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF4D0" />
                    <stop offset="30%" stopColor="#D4AF37" />
                    <stop offset="70%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>

                  <linearGradient id="goldInner" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="50%" stopColor="#B45309" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>

                  {/* 3D Ruby Gem Gradients (The Analysis Core) */}
                  <linearGradient id="rubyTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCA5A5" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                  
                  <linearGradient id="rubyTopRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#991B1B" />
                  </linearGradient>

                  <linearGradient id="rubyBottomLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#B91C1C" />
                    <stop offset="100%" stopColor="#7F1D1D" />
                  </linearGradient>

                  <linearGradient id="rubyBottomRight" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#7F1D1D" />
                    <stop offset="100%" stopColor="#450A0A" />
                  </linearGradient>

                  {/* Glowing Filters */}
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.8" floodColor="#EF4444" />
                  </filter>
                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.6" floodColor="#F59E0B" />
                  </filter>
                </defs>

                {/* --- 1. THE OUTER TACTICAL CROSSHAIR / COMPASS --- */}
                {/* Represents 'Strict Corrections' and 'Precision Targeting' */}
                <g filter="url(#goldGlow)">
                  {/* Top Pointer */}
                  <path d="M 48 5 L 52 5 L 56 22 L 44 22 Z" fill="url(#goldOuter)" stroke="#FFF4D0" strokeWidth="0.5" strokeLinejoin="round" />
                  {/* Bottom Pointer */}
                  <path d="M 48 95 L 52 95 L 56 78 L 44 78 Z" fill="url(#goldOuter)" stroke="#FFF4D0" strokeWidth="0.5" strokeLinejoin="round" />
                  {/* Left Pointer */}
                  <path d="M 5 48 L 5 52 L 22 56 L 22 44 Z" fill="url(#goldOuter)" stroke="#FFF4D0" strokeWidth="0.5" strokeLinejoin="round" />
                  {/* Right Pointer */}
                  <path d="M 95 48 L 95 52 L 78 56 L 78 44 Z" fill="url(#goldOuter)" stroke="#FFF4D0" strokeWidth="0.5" strokeLinejoin="round" />
                </g>

                {/* --- 2. THE INNER MACHINED BEZEL --- */}
                <circle cx="50" cy="50" r="32" fill="none" stroke="url(#goldInner)" strokeWidth="4" />
                <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5" />
                
                {/* Obsidian Core Plate */}
                <circle cx="50" cy="50" r="28" fill="#0A0A0A" stroke="#222" strokeWidth="1" />
                <circle cx="50" cy="50" r="28" fill="url(#goldInner)" opacity="0.1" />

                {/* --- 3. THE 3D RUBY GEM (Deep Analysis Core) --- */}
                <motion.g 
                  filter="url(#coreGlow)"
                  animate={shouldAnimate ? { scale: [1, 1.05, 1] } : undefined}
                  transition={shouldAnimate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                >
                  {/* Top Left Facet */}
                  <polygon points="50,22 25,50 50,55" fill="url(#rubyTopLeft)" />
                  {/* Top Right Facet */}
                  <polygon points="50,22 75,50 50,55" fill="url(#rubyTopRight)" />
                  {/* Bottom Left Facet */}
                  <polygon points="25,50 50,78 50,55" fill="url(#rubyBottomLeft)" />
                  {/* Bottom Right Facet */}
                  <polygon points="75,50 50,78 50,55" fill="url(#rubyBottomRight)" />
                  
                  {/* Brilliant Gem Edges (Enhances the 3D cut) */}
                  <polygon points="50,22 75,50 50,78 25,50" fill="none" stroke="#FCA5A5" strokeWidth="0.8" opacity="0.8" />
                  <path d="M 25 50 L 75 50 M 50 22 L 50 78" stroke="#FCA5A5" strokeWidth="0.5" opacity="0.6" />
                  
                  {/* Central Specular Highlight (The exact point of intense analysis) */}
                  <polygon points="50,48 52,50 50,52 48,50" fill="#FFFFFF" filter="blur(1px)" />
                </motion.g>

              </svg>
            </motion.div>

            {/* --- SWEEPING OPTICAL GLARE --- */}
            {/* Simulates light passing over a polished convex glass surface */}
              <motion.div
              animate={shouldAnimate ? { x: ['-200%', '200%'] } : undefined}
              transition={shouldAnimate ? { duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" } : undefined}
              className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/40 dark:via-white/10 to-transparent transform -rotate-[30deg] pointer-events-none z-20"
            />
            
            {/* Inner Border Reflection */}
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_0_2px_3px_rgba(255,255,255,0.2)] pointer-events-none z-30" />
          </div>
        </div>
      </motion.div>

      {/* --- ELITE TYPOGRAPHY SECTION --- */}
      {showLabel && (
        <div className="text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-1.5"
          >
            <Crosshair className="w-5 h-5 text-[#DC2626]" strokeWidth={3} />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Taylor
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#DC2626]" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#EF4444] dark:text-[#FCA5A5] uppercase">
              Premium Intensive
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Ambient Floating Embers (High-intensity spark effect)
function AmbientEmbers() {
  const embers = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {embers.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['10%', '-110%'],
            x: ['0%', `${(Math.random() - 0.5) * 40}%`],
            opacity: [0, Math.random() * 0.8 + 0.2, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 2 + Math.random() * 3, // Faster, more intense rising
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeIn"
          }}
          className="absolute w-1 h-1 rounded-full blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 20}%`, // Start from bottom
            backgroundColor: Math.random() > 0.4 ? '#EF4444' : '#FDE68A',
            boxShadow: `0 0 8px ${Math.random() > 0.4 ? '#DC2626' : '#D4AF37'}`
          }}
        />
      ))}
    </div>
  );
}

// --- DEMO / VIP PRESENTATION ENVIRONMENT --- //

export default function TaylorLogoPresentation() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for premium feel

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050505] transition-colors duration-500 font-sans flex flex-col items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background ambient lighting (Rich Crimson & Amber tones) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 dark:bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-500/10 dark:bg-red-900/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <Award className="w-6 h-6 text-[#DC2626]" />
          <span className="font-bold tracking-tight text-lg">Elite Persona</span>
        </div>
        
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center justify-center gap-2 text-[14px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2 rounded-full bg-white dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-sm"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      {/* Hero Logo Showcase */}
      <div className="flex flex-col items-center mb-16 relative z-10">
        <LiamAILogo size="hero" showLabel={true} />
        
        {/* Core Capabilities - Premium VIP Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col items-center gap-8 mt-14"
        >
          <p className="text-[#64748B] dark:text-[#94A3B8] max-w-lg text-center text-[15px] font-medium leading-relaxed">
            High-intensity practice with deep analysis. Corrects major & minor errors instantly. Your ultimate coaching experience.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            <FeatureCard icon={Microscope} title="Deep Analysis" />
            <FeatureCard icon={Target} title="Strict Corrections" />
            <FeatureCard icon={Zap} title="Unlimited Chats" isHighlight />
          </div>
        </motion.div>
      </div>

    </div>
  );
}

// Sub-component for the VIP Feature Cards
function FeatureCard({ icon: Icon, title, isHighlight = false }: { icon: any, title: string, isHighlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center p-5 rounded-2xl border transition-all ${
      isHighlight 
        ? 'bg-gradient-to-b from-[#FEF2F2] to-white dark:from-[#2A0808] dark:to-[#110202] border-[#FCA5A5] dark:border-[#DC2626]/40 shadow-[0_10px_30px_rgba(220,38,38,0.15)] dark:shadow-[0_10px_30px_rgba(220,38,38,0.15)]'
        : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-white/5 shadow-sm'
    }`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
        isHighlight ? 'bg-gradient-to-br from-[#FCA5A5] to-[#EF4444] dark:from-[#991B1B] dark:to-[#450A0A] text-white shadow-inner' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
      }`}>
        <Icon className="w-5 h-5" />
      </div>
      <h3 className={`font-bold text-[14px] ${isHighlight ? 'text-[#991B1B] dark:text-[#FCA5A5]' : 'text-slate-800 dark:text-slate-200'}`}>
        {title}
      </h3>
    </div>
  );
}

export const LiamPersonalityAvatar = LiamAILogo;