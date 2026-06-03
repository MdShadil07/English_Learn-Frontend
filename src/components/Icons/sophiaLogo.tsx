import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { 
  Crown, 
  BookOpen, 
  PenTool, 
  FileCheck2, 
  Gem,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';

// --- MAIN LOGO COMPONENT --- //

interface SophiaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero' | number;
  showLabel?: boolean;
}

export function SophiaPersonalityLogo({ size = 'hero', showLabel = true }: SophiaLogoProps) {
  const sizeMap = {
    sm: { container: 'w-12 h-12', radius: 'rounded-[0.9rem]' },
    md: { container: 'w-20 h-20', radius: 'rounded-[1.2rem]' },
    lg: { container: 'w-32 h-32', radius: 'rounded-[1.8rem]' },
    hero: { container: 'w-48 h-48', radius: 'rounded-[2.5rem]' },
  };

  const currentSize = typeof size === 'number'
    ? { container: '', radius: 'rounded-[1.8rem]' }
    : sizeMap[size];

  const containerStyle = typeof size === 'number' ? { width: size, height: size } : undefined;
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
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...containerStyle }}
        className={`relative ${currentSize.container ?? ''} cursor-pointer transition-transform duration-500 hover:scale-105 z-10`}
      >
        {/* Dynamic Heavy Drop Shadow (Rich Crimson/Rose Gold tint) */}
        <motion.div 
          style={{ x: shadowX, y: shadowY }}
          className="absolute -inset-2 bg-gradient-to-br from-[#E11D48]/50 to-[#881337]/40 dark:from-[#BE123C]/50 dark:to-[#4C0519]/40 blur-2xl rounded-full transition-opacity duration-500 opacity-60 group-hover:opacity-100 -z-20"
        />

        {/* --- LUXURY HARDWARE SQUIRCLE --- */}
        <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] dark:from-[#1F0A11] dark:to-[#0A0205] p-[2px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.9)]`}>
          
          {/* Animated Edge Glint (Simulates a polished Rose Gold chamfer) */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%] z-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, #FDA4AF 45%, #FFE4E6 50%, #FDA4AF 55%, transparent 60%, transparent 100%)'
            }}
          />
          
          {/* Obsidian / Dark Ruby Core Plate */}
          <div className={`absolute inset-[2px] ${currentSize.radius} bg-gradient-to-br from-[#FFFFFF] to-[#F1F5F9] dark:from-[#140508] dark:to-[#050102] overflow-hidden z-10`}>
            
            {/* Background Texture: Luxury Brushed Metal Radial */}
            <div className="absolute inset-0 opacity-[0.5] dark:opacity-[0.8]"
                 style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.08) 0%, transparent 70%)' }} />
                 
            {/* Floating High-Intensity Stardust */}
            {size === 'hero' && shouldAnimate && <AmbientStardust />}

            {/* --- RECESSED CHRONOGRAPH DIALS (Academic Precision) --- */}
            <motion.div 
              style={{ x: dialX, y: dialY, transform: "translateZ(10px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {/* Geometric Academic Grid */}
              <div className="absolute w-[80%] h-[80%] rounded-full border border-rose-900/10 dark:border-rose-300/5 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.03)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_40%,rgba(255,255,255,0.01)_100%)] shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_4px_10px_rgba(0,0,0,0.4)]" />
              
              {/* Outer Counter-Clockwise Ring */}
              <motion.div 
                animate={shouldAnimate ? { rotate: -360 } : undefined}
                transition={shouldAnimate ? { duration: 50, repeat: Infinity, ease: "linear" } : undefined}
                className="absolute w-[85%] h-[85%] border-[1px] border-dashed border-rose-900/20 dark:border-rose-500/20 rounded-full"
              />
              
              {/* Inner Clockwise Ring */}
              <motion.div 
                animate={shouldAnimate ? { rotate: 360 } : undefined}
                transition={shouldAnimate ? { duration: 40, repeat: Infinity, ease: "linear" } : undefined}
                className="absolute w-[70%] h-[70%] border-[2px] border-dotted border-rose-800/20 dark:border-rose-400/20 rounded-full"
              />
            </motion.div>

            {/* --- 3D FORGED 'CREST OF WISDOM' EMBLEM --- */}
            <motion.div 
              style={{ x: coreX, y: coreY, transform: "translateZ(60px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg viewBox="0 0 100 100" className="w-[75%] h-[75%] drop-shadow-[0_15px_20px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.9)] overflow-visible">
                <defs>
                  <linearGradient id="roseGoldOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFE4E6" />
                    <stop offset="30%" stopColor="#FDA4AF" />
                    <stop offset="70%" stopColor="#BE123C" />
                    <stop offset="100%" stopColor="#4C0519" />
                  </linearGradient>
                  <linearGradient id="roseGoldInner" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FECDD3" />
                    <stop offset="50%" stopColor="#E11D48" />
                    <stop offset="100%" stopColor="#881337" />
                  </linearGradient>
                  <linearGradient id="enamelBg" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#2A0A12" />
                    <stop offset="50%" stopColor="#120408" />
                    <stop offset="100%" stopColor="#050102" />
                  </linearGradient>
                  <linearGradient id="rubyTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FCA5A5" />
                    <stop offset="100%" stopColor="#E11D48" />
                  </linearGradient>
                  <linearGradient id="rubyTopRight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FB7185" />
                    <stop offset="100%" stopColor="#BE123C" />
                  </linearGradient>
                  <linearGradient id="rubyBottomLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#9F1239" />
                    <stop offset="100%" stopColor="#4C0519" />
                  </linearGradient>
                  <linearGradient id="rubyBottomRight" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#881337" />
                    <stop offset="100%" stopColor="#2A0510" />
                  </linearGradient>
                  <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.8" floodColor="#F43F5E" />
                  </filter>
                  <filter id="roseGoldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodOpacity="0.6" floodColor="#FB7185" />
                  </filter>
                </defs>

                <g stroke="url(#roseGoldOuter)" fill="none" strokeWidth="2.5" strokeLinecap="round" filter="url(#roseGoldGlow)">
                  <path d="M 25 85 Q 5 60 20 25" />
                  <path d="M 22 72 Q 10 65 15 50" fill="url(#roseGoldOuter)" stroke="none" />
                  <path d="M 17 55 Q 5 45 15 35" fill="url(#roseGoldOuter)" stroke="none" />
                  <path d="M 16 38 Q 8 28 20 22" fill="url(#roseGoldOuter)" stroke="none" />
                  <path d="M 75 85 Q 95 60 80 25" />
                  <path d="M 78 72 Q 90 65 85 50" fill="url(#roseGoldOuter)" stroke="none" />
                  <path d="M 83 55 Q 95 45 85 35" fill="url(#roseGoldOuter)" stroke="none" />
                  <path d="M 84 38 Q 92 28 80 22" fill="url(#roseGoldOuter)" stroke="none" />
                </g>

                <g filter="drop-shadow(0px 8px 6px rgba(0,0,0,0.5))">
                  <path d="M 30 25 L 70 25 L 75 45 C 75 70 50 85 50 85 C 50 85 25 70 25 45 Z" fill="url(#roseGoldOuter)" stroke="#FFE4E6" strokeWidth="0.5" strokeLinejoin="round" />
                  <path d="M 34 29 L 66 29 L 70 45 C 70 65 50 78 50 78 C 50 78 30 65 30 45 Z" fill="url(#roseGoldInner)" />
                  <path d="M 37 32 L 63 32 L 66 45 C 66 61 50 72 50 72 C 50 72 34 61 34 45 Z" fill="url(#enamelBg)" />
                  <path d="M 37 32 L 63 32 L 66 45 C 50 55 34 45 34 45 Z" fill="rgba(255,255,255,0.08)" />

                  <g transform="translate(50, 18) scale(0.6)">
                    <path d="M -25 0 L -35 -20 L -15 -10 L 0 -30 L 15 -10 L 35 -20 L 25 0 Z" fill="url(#roseGoldOuter)" filter="url(#roseGoldGlow)" stroke="#FFE4E6" strokeWidth="1" strokeLinejoin="round" />
                    <ellipse cx="0" cy="2" rx="28" ry="4" fill="url(#roseGoldInner)" stroke="#4C0519" strokeWidth="1"/>
                    <circle cx="0" cy="-30" r="4" fill="#EF4444" />
                    <circle cx="-35" cy="-20" r="3" fill="#EF4444" />
                    <circle cx="35" cy="-20" r="3" fill="#EF4444" />
                  </g>

                  <motion.g 
                    filter="url(#coreGlow)"
                    animate={shouldAnimate ? { scale: [1, 1.05, 1] } : undefined}
                    transition={shouldAnimate ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : undefined}
                  >
                    <polygon points="50,38 40,50 50,55" fill="url(#rubyTopLeft)" />
                    <polygon points="50,38 60,50 50,55" fill="url(#rubyTopRight)" />
                    <polygon points="40,50 50,68 50,55" fill="url(#rubyBottomLeft)" />
                    <polygon points="60,50 50,68 50,55" fill="url(#rubyBottomRight)" />
                    <polygon points="50,38 60,50 50,68 40,50" fill="none" stroke="#FDA4AF" strokeWidth="0.5" opacity="0.8" />
                    <path d="M 40 50 L 60 50 M 50 38 L 50 68" stroke="#FDA4AF" strokeWidth="0.5" opacity="0.5" />
                    <polygon points="50,47 52,50 50,53 48,50" fill="#FFFFFF" filter="blur(1px)" />
                  </motion.g>
                </g>
              </svg>

              <motion.div
                animate={shouldAnimate ? { x: ['-200%', '200%'] } : undefined}
                transition={shouldAnimate ? { duration: 3.5, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" } : undefined}
                className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/40 dark:via-white/10 to-transparent transform -rotate-[30deg] pointer-events-none z-20"
              />
            </motion.div>
            
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
            <Sparkles className="w-5 h-5 text-[#E11D48]" fill="#FDA4AF" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Sophia
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20 shadow-[0_0_10px_rgba(225,29,72,0.1)]"
          >
            <Crown className="w-3.5 h-3.5 text-[#E11D48]" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#E11D48] dark:text-[#FDA4AF] uppercase">
              Premium Academic
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Ambient Floating Stardust (Elegant, rising magic)
function AmbientStardust() {
  const embers = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {embers.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['10%', '-110%'],
            x: ['0%', `${(Math.random() - 0.5) * 30}%`],
            opacity: [0, Math.random() * 0.7 + 0.3, 0],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            duration: 3 + Math.random() * 4, 
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeIn"
          }}
          className="absolute w-1 h-1 rounded-full blur-[0.5px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${80 + Math.random() * 20}%`, 
            backgroundColor: Math.random() > 0.4 ? '#FDA4AF' : '#FFE4E6',
            boxShadow: `0 0 6px ${Math.random() > 0.4 ? '#E11D48' : '#FDA4AF'}`
          }}
        />
      ))}
    </div>
  );
}

// --- DEMO / VIP PRESENTATION ENVIRONMENT --- //

export default function SophiaPremiumAcademic() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark for premium academic feel

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#05010A] transition-colors duration-500 font-sans flex flex-col items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background ambient lighting (Rich Rose Gold & Crimson tones) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-rose-300/30 dark:bg-[#E11D48]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-400/10 dark:bg-[#4C0519]/40 blur-[120px] rounded-full pointer-events-none" />
      {/* Subtle Grid overlay for dark mode */}
      <div className="hidden dark:block absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] bg-[size:70px_70px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <Gem className="w-6 h-6 text-[#E11D48]" />
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
        <SophiaPersonalityLogo size="hero" showLabel={true} />
        
        {/* Core Capabilities - Premium Academic Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col items-center gap-8 mt-12 w-full max-w-4xl"
        >
          <p className="text-[#64748B] dark:text-[#94A3B8] max-w-2xl text-center text-[16px] font-medium leading-relaxed">
            Prepares you for IELTS and TOEFL with sophisticated academic vocabulary, advanced sentence structures, and intelligent essay feedback systems.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full mt-4">
            <FeatureCard 
              icon={BookOpen} 
              title="Academic Vocab" 
              desc="Master advanced vocabulary for elite academic performance." 
            />
            <FeatureCard 
              icon={PenTool} 
              title="Complex Syntax" 
              desc="Develop sophisticated sentence structures confidently." 
            />
            <FeatureCard 
              icon={FileCheck2} 
              title="Essay Review" 
              desc="Premium AI-powered essay correction and scoring." 
              isHighlight 
            />
          </div>
        </motion.div>
      </div>

      {/* Footer Accents */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-30 mt-10 border-t border-slate-200 dark:border-white/10 py-7 flex items-center justify-center gap-3 w-full max-w-3xl"
      >
        <Gem className="w-5 h-5 text-[#E11D48] dark:text-[#FDA4AF]" />
        <span className="text-[11px] uppercase tracking-[0.35em] text-slate-600 dark:text-[#FECDD3] font-semibold">
          Premium Access. Unlimited Potential.
        </span>
      </motion.div>

    </div>
  );
}

// Sub-component for the Elite Feature Cards
function FeatureCard({ icon: Icon, title, desc, isHighlight = false }: { icon: any, title: string, desc: string, isHighlight?: boolean }) {
  return (
    <div className={`group relative overflow-hidden flex flex-col items-center justify-center p-8 rounded-[2rem] border transition-all duration-500 hover:-translate-y-1 ${
      isHighlight 
        ? 'bg-gradient-to-br from-[#FFF1F2] to-white dark:from-[#2A0510] dark:to-[#120206] border-[#FDA4AF] dark:border-[#E11D48]/40 shadow-[0_15px_40px_rgba(225,29,72,0.15)] dark:shadow-[0_15px_40px_rgba(225,29,72,0.2)]'
        : 'bg-white dark:bg-[#11050A] border-slate-200 dark:border-[#4C0519]/30 shadow-md dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
    }`}>
      
      {/* Subtle hover gradient */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 ${isHighlight ? 'bg-gradient-to-br from-[#FFE4E6]/50 to-transparent dark:from-[#E11D48]/10' : 'bg-slate-50/50 dark:bg-[#2A0510]/30'}`} />

      <div className="relative z-20 flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 ${
          isHighlight 
            ? 'bg-gradient-to-br from-[#FDA4AF] to-[#E11D48] dark:from-[#BE123C] dark:to-[#4C0519] text-white shadow-[0_0_20px_rgba(225,29,72,0.3)]' 
            : 'bg-slate-100 dark:bg-[#2A0510]/50 text-slate-700 dark:text-[#FDA4AF] border border-slate-200 dark:border-[#881337]/50'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className={`font-black text-[18px] tracking-tight mb-3 ${isHighlight ? 'text-[#BE123C] dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
          {title}
        </h3>
        
        <p className="text-[14px] leading-relaxed text-slate-500 dark:text-slate-400 font-medium">
          {desc}
        </p>
      </div>
    </div>
  );
}