import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { Briefcase, TrendingUp, Award, Moon, Sun, Sparkles } from 'lucide-react';

// --- MAIN LOGO COMPONENT --- //

interface NovaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showLabel?: boolean;
}

export function NovaAILogo({ size = 'hero', showLabel = true }: NovaLogoProps) {
  const sizeMap = {
    sm: { container: 'w-12 h-12', radius: 'rounded-xl', stroke: 2, icon: 16 },
    md: { container: 'w-20 h-20', radius: 'rounded-2xl', stroke: 2.5, icon: 28 },
    lg: { container: 'w-32 h-32', radius: 'rounded-[2rem]', stroke: 3, icon: 48 },
    hero: { container: 'w-48 h-48', radius: 'rounded-[2.5rem]', stroke: 4, icon: 72 },
  };

  const currentSize = sizeMap[size];
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = showLabel && !prefersReducedMotion;

  // 3D Parallax Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 120, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 120, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  // Parallax shifts for internal elements
  const glyphX = useTransform(mouseXSpring, [-0.5, 0.5], ["-8px", "8px"]);
  const glyphY = useTransform(mouseYSpring, [-0.5, 0.5], ["-8px", "8px"]);
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], ["-20px", "20px"]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], ["-20px", "20px"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
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
        {/* Deep Ambient Shadow */}
        <motion.div 
          style={{ x: shadowX, y: shadowY }}
          className={`absolute -inset-3 bg-[#7C3AED]/28 dark:bg-[#7C3AED]/20 blur-3xl rounded-full transition-opacity duration-500 opacity-60 group-hover:opacity-100 -z-10`}
        />

        {/* --- THE ELITE SQUIRCLE FRAME --- */}
        <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden p-[1.5px] shadow-[0_16px_48px_rgba(2,6,23,0.18)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.72)]`}>
          
          {/* Animated Rotating Edge Light (Chamfered edge effect) */}
              <motion.div 
                animate={shouldAnimate ? { rotate: 360 } : undefined}
                transition={shouldAnimate ? { duration: 6, repeat: Infinity, ease: "linear" } : undefined}
            className="absolute -inset-[100%] z-0"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, rgba(139,92,246,0.8) 50%, transparent 60%, transparent 100%)'
            }}
          />
          
          <div className="absolute -inset-[100%] z-0 bg-slate-300 dark:bg-slate-700 opacity-30" />

          {/* Inner Glass Core */}
          <div className={`relative w-full h-full ${currentSize.radius} overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#F8FAFC] to-[#E2E8F0] dark:from-[#0B1020] dark:via-[#10192C] dark:to-[#050816] z-10`}>
            
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 opacity-80 dark:opacity-60 mix-blend-multiply dark:mix-blend-screen">
                  <motion.div 
                    animate={shouldAnimate ? { x: [-20, 20, -20], y: [10, -10, 10], scale: [1, 1.04, 1] } : undefined} 
                    transition={shouldAnimate ? { duration: 15, repeat: Infinity, ease: "easeInOut" } : undefined}
                className="absolute -top-[30%] -right-[20%] w-[120%] h-[120%] bg-[radial-gradient(circle,_rgba(139,92,246,0.22)_0%,_rgba(167,139,250,0.14)_35%,_transparent_72%)] rounded-full blur-3xl"
              />
            </div>

            {/* Ambient Gold Dust Particles */}
                {size === 'hero' && shouldAnimate && <AmbientGoldDust />}

            {/* Frosted Glass Overlay */}
            <div className="absolute inset-0 backdrop-blur-[10px] bg-white/15 dark:bg-black/25" />

            {/* --- 3D GLYPH: THE FORGED "N" --- */}
            <motion.div 
              style={{ x: glyphX, y: glyphY, transform: "translateZ(40px)" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-[68%] h-[68%] overflow-visible drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              >
                <defs>
                  <linearGradient id="platLight" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#C7D2FE" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                  <linearGradient id="platDark" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="55%" stopColor="#0F172A" />
                    <stop offset="100%" stopColor="#020617" />
                  </linearGradient>
                  <linearGradient id="goldAccent" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4C1D95" />
                    <stop offset="28%" stopColor="#7C3AED" />
                    <stop offset="72%" stopColor="#DDD6FE" />
                    <stop offset="100%" stopColor="#312E81" />
                  </linearGradient>
                  <linearGradient id="novaStar" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EDE9FE" />
                    <stop offset="60%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#6D28D9" />
                  </linearGradient>

                  <filter id="goldGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.45" floodColor="#8B5CF6" />
                  </filter>
                  <filter id="pillarShadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.4" floodColor="#000000" />
                  </filter>
                  <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodOpacity="0.7" floodColor="#8B5CF6" />
                  </filter>
                </defs>

                {/* Left Platinum Pillar */}
                <g filter="url(#pillarShadow)">
                  <path 
                    d="M 22 80 L 22 20 L 38 20 L 38 80 Z" 
                    className="fill-[url(#platLight)] dark:fill-[url(#platDark)]" 
                  />
                  {/* 3D Edge Bevel */}
                  <path d="M 22 80 L 22 20 L 38 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <path d="M 38 20 L 38 80 L 22 80" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
                </g>

                {/* Right Platinum Pillar */}
                <g filter="url(#pillarShadow)">
                  <path 
                    d="M 62 80 L 62 20 L 78 20 L 78 80 Z" 
                    className="fill-[url(#platLight)] dark:fill-[url(#platDark)]" 
                  />
                  {/* 3D Edge Bevel */}
                  <path d="M 62 80 L 62 20 L 78 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
                  <path d="M 78 20 L 78 80 L 62 80" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
                </g>

                {/* Center Gold Diagonal (Crosses over left, under right) */}
                <g filter="url(#goldGlow)">
                  <path 
                    d="M 22 22 L 38 22 L 78 78 L 62 78 Z" 
                    fill="url(#goldAccent)" 
                  />
                  {/* Gold Edge Highlights */}
                  <path d="M 22 22 L 38 22 L 78 78" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.75" />
                  <path d="M 78 78 L 62 78 L 22 22" fill="none" stroke="#0F172A" strokeWidth="1" opacity="0.35" />
                </g>

                {/* The "Nova" Diamond Star (Top Right) */}
                <motion.g
                  animate={shouldAnimate ? { scale: [1, 1.16, 1], opacity: [0.8, 1, 0.8], rotate: [0, 8, 0] } : undefined}
                  transition={shouldAnimate ? { duration: 4.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                  transform="translate(84, 15)"
                  filter="url(#starGlow)"
                >
                  <path
                    d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z"
                    fill="url(#novaStar)"
                  />
                  {/* Star Highlight */}
                  <path d="M 0 -12 L 3 -3 L 0 0 Z" fill="#FFFFFF" opacity="0.85" />
                </motion.g>
              </svg>
            </motion.div>

            {/* --- PREMIUM SWEEPING GLARE EFFECT --- */}
            <motion.div
              animate={shouldAnimate ? { x: ['-200%', '200%'], opacity: [0, 0.5, 0] } : undefined}
              transition={shouldAnimate ? { duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" } : undefined}
              className="absolute inset-0 w-[150%] h-[150%] bg-gradient-to-r from-transparent via-white/90 to-transparent transform -rotate-45 pointer-events-none z-20 mix-blend-overlay"
            />
            
            {/* Static Inner Bevel Highlight */}
            <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-none z-30" />
          </div>
        </div>
      </motion.div>

      {/* --- TYPOGRAPHY SECTION --- */}
      {showLabel && (
        <div className="text-center flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-2 mb-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" fill="#A78BFA" />
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Nova
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6] shadow-[0_0_8px_#8B5CF6] animate-pulse" />
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase">
              Pro Business AI
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Ambient Gold Dust
function AmbientGoldDust() {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: ['0%', '-20%', '0%'],
            x: ['0%', '10%', '0%'],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-[#FDE68A] rounded-full blur-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 6px #D4AF37'
          }}
        />
      ))}
    </div>
  );
}

// --- DEMO / PRESENTATION ENVIRONMENT --- //

export default function NovaLogoPresentation() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#02040A] transition-colors duration-500 font-sans flex flex-col items-center py-12 px-6 relative overflow-hidden">
      
      {/* Background ambient lighting (Classy, muted corporate tones) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-slate-300/30 dark:bg-[#1E293B]/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 dark:bg-amber-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-2 text-slate-800 dark:text-white">
          <Briefcase className="w-6 h-6 text-[#D4AF37]" />
          <span className="font-bold tracking-tight text-lg">Nova AI Persona</span>
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
      <div className="flex flex-col items-center mb-24 relative z-10">
        <NovaAILogo size="hero" showLabel={true} />
        
        {/* Core Capabilities - Formal Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mt-12"
        >
          <CapabilityBadge icon={Briefcase} text="Business English" color="text-slate-700 dark:text-slate-300" />
          <CapabilityBadge icon={TrendingUp} text="Formal Tone" color="text-[#8B5CF6]" />
          <CapabilityBadge icon={Award} text="Interview Prep" color="text-purple-600 dark:text-purple-400" />
        </motion.div>
      </div>

      {/* System Icon Sizes Showcase */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="w-full max-w-4xl border-t border-slate-300 dark:border-white/10 pt-12 relative z-10"
      >
        <h3 className="text-center text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-12">
          Corporate System Icons
        </h3>
        
        <div className="flex flex-wrap items-end justify-center gap-10 md:gap-20">
          <div className="flex flex-col items-center gap-5">
            <NovaAILogo size="lg" showLabel={false} />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Large (128px)</span>
          </div>
          <div className="flex flex-col items-center gap-5">
            <NovaAILogo size="md" showLabel={false} />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Medium (80px)</span>
          </div>
          <div className="flex flex-col items-center gap-5">
            <NovaAILogo size="sm" showLabel={false} />
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">Small (48px)</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

// Small helper component for the badges
function CapabilityBadge({ icon: Icon, text, color }: { icon: any, text: string, color: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/60 dark:bg-[#111827]/60 border border-slate-200 dark:border-white/10 shadow-[0_4px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_15px_rgba(0,0,0,0.4)] backdrop-blur-md transition-transform hover:-translate-y-0.5 cursor-default">
      <Icon className={`w-4 h-4 ${color}`} />
      <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200 tracking-wide">{text}</span>
    </div>
  );
}

export const NovaPersonalityAvatar = NovaAILogo;