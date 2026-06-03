import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { Microscope, Zap, ShieldCheck, Moon, Sun, Target, Award, Hexagon, Crosshair } from 'lucide-react';

// --- MAIN LOGO COMPONENT --- //

interface TaylorLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

interface CoachTaylorAvatarProps {
  size?: number | 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animated?: boolean;
}

const resolveAvatarSize = (size: CoachTaylorAvatarProps['size']) => {
  if (typeof size === 'number') {
    return size;
  }

  switch (size) {
    case 'hero':
      return 96;
    case 'lg':
      return 64;
    case 'md':
      return 40;
    case 'sm':
    default:
      return 24;
  }
};

export function TaylorPersonalityLogo({ size = 'hero', showLabel = true }: TaylorLogoProps) {
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
          className="absolute -inset-2 bg-gradient-to-br from-[#DC2626]/40 to-[#92400E]/30 dark:from-[#991B1B]/60 dark:to-[#78350F]/50 blur-2xl rounded-full transition-opacity duration-500 opacity-60 group-hover:opacity-100 -z-20"
        />

        {/* --- LUXURY HARDWARE SQUIRCLE --- */}
        <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden bg-gradient-to-br from-[#F8FAFC] to-[#CBD5E1] dark:from-[#1E1E24] dark:to-[#050505] p-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)]`}>
          
          {/* Animated Edge Glint (Simulates a polished metal chamfer) */}
          <motion.div 
            animate={shouldAnimate ? { rotate: 360 } : undefined}
            transition={shouldAnimate ? { duration: 6, repeat: Infinity, ease: "linear" } : undefined}
            className="absolute -inset-[100%] z-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, #FCA5A5 45%, #FDE68A 50%, #FCA5A5 55%, transparent 60%, transparent 100%)'
            }}
          />
          
          {/* Obsidian / Brushed Platinum Core Plate */}
          <div className={`absolute inset-[2px] ${currentSize.radius} bg-gradient-to-br from-[#FFFFFF] to-[#E2E8F0] dark:from-[#111114] dark:to-[#000000] overflow-hidden z-10`}>
            
            {/* Background Texture: Luxury Brushed Metal Dial */}
            <div className="absolute inset-0 opacity-[0.6] dark:opacity-[1]"
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 70%)' }} />
                 
            {/* Floating High-Intensity Embers */}
            {size === 'hero' && shouldAnimate && <AmbientEmbers />}

            {/* --- RECESSED CHRONOGRAPH DIALS (Precision & Timing) --- */}
            <motion.div 
              style={{ x: dialX, y: dialY, transform: "translateZ(10px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80 dark:opacity-100"
            >
              {/* Radar / Scanning Grid Background */}
              <div className="absolute w-[85%] h-[85%] rounded-full border border-slate-300/50 dark:border-white/5 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.05)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(255,255,255,0.02)_100%)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]" />
              
              {/* Outer Counter-Clockwise Ring */}
              <motion.div 
                animate={shouldAnimate ? { rotate: -360 } : undefined}
                transition={shouldAnimate ? { duration: 40, repeat: Infinity, ease: "linear" } : undefined}
                className="absolute w-[90%] h-[90%] border-[1px] border-dashed border-red-900/40 dark:border-red-500/30 rounded-full"
              />
              
              {/* Pulsing Analysis Waves */}
              <motion.div
                animate={shouldAnimate ? { scale: [0.6, 1.1], opacity: [0.8, 0] } : undefined}
                transition={shouldAnimate ? { duration: 2.5, repeat: Infinity, ease: "easeOut" } : undefined}
                className="absolute w-[70%] h-[70%] border border-[#F59E0B] rounded-full"
              />
              <motion.div
                animate={shouldAnimate ? { scale: [0.6, 1.1], opacity: [0.8, 0] } : undefined}
                transition={shouldAnimate ? { duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.25 } : undefined}
                className="absolute w-[70%] h-[70%] border border-[#EF4444] rounded-full"
              />
            </motion.div>

            {/* --- 3D FORGED 'REACTOR CORE' EMBLEM --- */}
            <motion.div 
              style={{ x: coreX, y: coreY, transform: "translateZ(60px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] drop-shadow-[0_15px_20px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.95)] overflow-visible">
                <defs>
                  {/* Ultra-Realistic 3D Gold/Titanium Facet Gradients */}
                  <linearGradient id="facetTop" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF4D0" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                  <linearGradient id="facetTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D4AF37" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <linearGradient id="facetBottomRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#451A03" />
                  </linearGradient>
                  <linearGradient id="facetBottom" x1="100%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#451A03" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <linearGradient id="facetBottomLeft" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#451A03" />
                    <stop offset="100%" stopColor="#92400E" />
                  </linearGradient>
                  <linearGradient id="facetLeft" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#78350F" />
                    <stop offset="100%" stopColor="#D4AF37" />
                  </linearGradient>
                  <linearGradient id="facetTopLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#92400E" />
                    <stop offset="100%" stopColor="#FDE68A" />
                  </linearGradient>

                  {/* Deep Inner Obsidian Plate */}
                  <linearGradient id="obsidianCore" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#1A1A1A" />
                    <stop offset="100%" stopColor="#000000" />
                  </linearGradient>

                  {/* Intense Ruby/Amber Optical Lens */}
                  <radialGradient id="rubyCore" cx="50%" cy="40%" r="60%">
                    <stop offset="0%" stopColor="#FCA5A5" />
                    <stop offset="30%" stopColor="#EF4444" />
                    <stop offset="70%" stopColor="#991B1B" />
                    <stop offset="100%" stopColor="#450A0A" />
                  </radialGradient>

                  {/* Glowing Filters */}
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="8" floodOpacity="1" floodColor="#EF4444" />
                  </filter>
                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.8" floodColor="#F59E0B" />
                  </filter>
                </defs>

                {/* --- 1. THE 3D FORGED OCTAGON SHIELD --- */}
                {/* Outer Bevels mapped to an Octagon */}
                <polygon points="30,10 70,10 62,25 38,25" fill="url(#facetTop)" />
                <polygon points="70,10 90,30 75,38 62,25" fill="url(#facetTopRight)" />
                <polygon points="90,30 90,70 75,62 75,38" fill="url(#facetRight)" />
                <polygon points="90,70 70,90 62,75 75,62" fill="url(#facetBottomRight)" />
                <polygon points="70,90 30,90 38,75 62,75" fill="url(#facetBottom)" />
                <polygon points="30,90 10,70 25,62 38,75" fill="url(#facetBottomLeft)" />
                <polygon points="10,70 10,30 25,38 25,62" fill="url(#facetLeft)" />
                <polygon points="10,30 30,10 38,25 25,38" fill="url(#facetTopLeft)" />

                {/* Sharp Edge Highlights (Enhances metallic feel) */}
                <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
                <polygon points="38,25 62,25 75,38 75,62 62,75 38,75 25,62 25,38" fill="none" stroke="rgba(0,0,0,0.8)" strokeWidth="1" />

                {/* --- 2. INNER RECESSED OBSIDIAN CORE --- */}
                <polygon points="38,25 62,25 75,38 75,62 62,75 38,75 25,62 25,38" fill="url(#obsidianCore)" />
                
                {/* Subtle Inner Reflection */}
                <polygon points="38,25 62,25 75,38 75,50 25,50 25,38" fill="rgba(255,255,255,0.05)" />

                {/* --- 3. PRECISION CROSSHAIRS (Extending out) --- */}
                <g filter="url(#goldGlow)">
                  <path d="M 50 15 L 50 35 M 50 65 L 50 85 M 15 50 L 35 50 M 65 50 L 85 50" stroke="#FDE68A" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
                </g>

                {/* --- 4. THE DEEP ANALYSIS OPTICAL REACTOR --- */}
                <g filter="url(#coreGlow)">
                  {/* Outer Lens Ring */}
                  <circle cx="50" cy="50" r="16" fill="none" stroke="#F59E0B" strokeWidth="2" opacity="0.9" />
                  <circle cx="50" cy="50" r="13" fill="none" stroke="#EF4444" strokeWidth="1" opacity="0.6" />
                  
                  {/* Glowing Core */}
                  <circle cx="50" cy="50" r="12" fill="url(#rubyCore)" />
                  
                  {/* Animated Iris Pulse */}
                  <motion.circle 
                    cx="50" cy="50" r="6" 
                    fill="#FCA5A5" 
                    animate={shouldAnimate ? { scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] } : undefined}
                    transition={shouldAnimate ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                    filter="blur(2px)"
                  />
                  
                  {/* Specular Lens Highlight */}
                  <path d="M 42 42 Q 50 38 58 42 Q 50 48 42 42" fill="#FFFFFF" opacity="0.7" />
                </g>
              </svg>
            </motion.div>

            {/* --- SWEEPING OPTICAL GLARE --- */}
            {/* Simulates light passing over a polished convex glass surface */}
              <motion.div
                animate={shouldAnimate ? { x: ['-200%', '200%'] } : undefined}
                transition={shouldAnimate ? { duration: 3.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" } : undefined}
              className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/40 dark:via-white/10 to-transparent transform -rotate-[30deg] pointer-events-none z-20"
            />
            
            {/* Inner Border Reflection */}
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_0_2px_3px_rgba(255,255,255,0.2)] pointer-events-none z-30" />
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

export const CoachTaylorPersonalityLogo = ({ size = 32, className, animated = true }: CoachTaylorAvatarProps) => {
  const resolvedSize = resolveAvatarSize(size);

  return (
    <div
      className={className}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateZ(0)',
      }}
    >
      <TaylorPersonalityLogo
        size={resolvedSize >= 40 ? 'md' : 'sm'}
        showLabel={false}
      />
    </div>
  );
};

export const CoachTaylorLogo = CoachTaylorPersonalityLogo;

// Sub-component: Ambient Floating Embers (High-intensity spark effect)
function AmbientEmbers() {
  const embers = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {embers.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['10%', '-110%'],
            x: ['0%', `${(Math.random() - 0.5) * 40}%`],
            opacity: [0, Math.random() * 0.9 + 0.1, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 1.5 + Math.random() * 3, // Fast, aggressive rising
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeIn"
          }}
          className="absolute w-1.5 h-1.5 rounded-full blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 20}%`, 
            backgroundColor: Math.random() > 0.3 ? '#EF4444' : '#FDE68A',
            boxShadow: `0 0 10px ${Math.random() > 0.3 ? '#DC2626' : '#D4AF37'}`
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
        <TaylorPersonalityLogo size="hero" showLabel={true} />
        
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
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${
      isHighlight 
        ? 'bg-gradient-to-b from-[#FEF2F2] to-white dark:from-[#2A0808] dark:to-[#110202] border-[#FCA5A5] dark:border-[#DC2626]/40 shadow-[0_15px_40px_rgba(220,38,38,0.15)] dark:shadow-[0_15px_40px_rgba(220,38,38,0.2)] hover:-translate-y-1'
        : 'bg-white dark:bg-[#111111] border-slate-200 dark:border-white/5 shadow-sm hover:-translate-y-1'
    }`}>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
        isHighlight ? 'bg-gradient-to-br from-[#FCA5A5] to-[#EF4444] dark:from-[#991B1B] dark:to-[#450A0A] text-white shadow-inner' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'
      }`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`font-bold text-[15px] ${isHighlight ? 'text-[#991B1B] dark:text-[#FCA5A5]' : 'text-slate-800 dark:text-slate-200'}`}>
        {title}
      </h3>
    </div>
  );
}