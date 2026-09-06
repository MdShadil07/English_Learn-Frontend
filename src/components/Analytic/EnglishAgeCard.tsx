import React, { useMemo, useState, useEffect } from 'react';
import { Info, Sprout, TreePine, Crown, BatteryLow, Target, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EnglishAgeCardProps {
  currentLevel: number;
  overallAccuracy: number;
  timeSpentMinutes?: number;
}

// Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1500; // 1.5 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{displayValue.toFixed(1)}</>;
};

// Floating Particles Component
const Particles = ({ color }: { color: string }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 mix-blend-screen">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={cn("absolute w-1.5 h-1.5 rounded-full blur-[1px]", color)}
          initial={{
            x: Math.random() * 200 - 50,
            y: Math.random() * 200 + 100,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * 300 - 100,
            y: -50,
            opacity: [0, 1, 0],
            scale: [0, Math.random() * 2 + 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default function EnglishAgeCard({ currentLevel = 1, overallAccuracy = 0, timeSpentMinutes = 0 }: EnglishAgeCardProps) {
  // Production-grade Algorithmic English Age Calculation
  const calculateAge = () => {
    // 1. Base Progression: Level 1 starts at 0 base age. Each level adds ~0.12 years.
    const baseAge = Math.max(0, currentLevel - 1) * 0.12;

    // 2. Practice Time Weight: Every hour of practice adds ~0.08 years, capped at +1.5 years purely from time
    // This ensures users who spend a lot of time practicing still age up even if they haven't leveled up.
    const timeSpentAge = Math.min((timeSpentMinutes / 60) * 0.08, 1.5);

    // 3. Accuracy Modifier: 
    // - 0% accuracy = 0.5x multiplier (at least they are trying, don't penalize completely)
    // - 80% accuracy = 1.0x multiplier (standard expected performance)
    // - 100% accuracy = 1.25x multiplier (exceptional performance)
    const accuracyModifier = overallAccuracy > 0 
      ? Math.max(0.5, overallAccuracy / 80) 
      : 0.0;

    // 4. Composite Calculation
    let finalAge = (baseAge + timeSpentAge) * Math.min(accuracyModifier, 1.25);

    // 5. Competency Boost: If a user has extremely high accuracy early on, they demonstrate prior knowledge.
    if (overallAccuracy >= 85 && currentLevel <= 5 && timeSpentMinutes > 30) {
      finalAge += 0.4;
    }

    // 6. Guarantee Off-Zero: If they spent more than 10 mins, ensure they aren't age 0.0
    if (timeSpentMinutes >= 10 && finalAge < 0.1) {
      finalAge = Math.min((timeSpentMinutes / 60) * 0.1, 0.2); 
    }

    // 7. Hard Caps: 0.0 to 5.0
    return Math.min(Math.max(finalAge, 0.0), 5.0);
  };

  const englishAge = calculateAge();
  const goalAge = 5.0;
  const yearsToGo = Math.max(0, goalAge - englishAge).toFixed(1);
  const fillPercentage = Math.min((englishAge / goalAge) * 100, 100);

  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

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

  // Dynamic Tier Configuration
  const tierConfig = useMemo(() => {
    if (englishAge < 1.2) {
      return {
        id: 'tier-1',
        theme: {
          bg: 'bg-rose-50/80 dark:bg-[#1A0B10]',
          border: 'border-rose-300/50 dark:border-rose-900/60',
          textMain: 'text-rose-950 dark:text-rose-100',
          textSub: 'text-rose-600 dark:text-rose-400',
          gradient: 'from-rose-500 to-red-600 dark:from-rose-500 dark:to-red-700',
          ringFill: 'text-rose-500',
          ringTrack: 'text-rose-200 dark:text-rose-950',
          glow: 'shadow-[0_20px_50px_-15px_rgba(244,63,94,0.3)] dark:shadow-[0_20px_50px_-15px_rgba(225,29,72,0.4)]',
          quoteBg: 'bg-rose-100/50 dark:bg-rose-900/30',
          particle: 'bg-rose-500'
        },
        Icon: BatteryLow,
        tag: "Critical Wake-up Call",
        message: `Your English is running on 1%. You speak like a 1-year-old trying to order coffee. Wake up and practice!`,
        quote: "Excuses burn zero calories and learn zero vocabulary. 🔥",
        animation: { x: [0, 3, -3, 0], transition: { repeat: Infinity, duration: 0.2, type: 'tween' } },
        nextMilestone: "Reach Age 1.5 to unlock 'Curious Toddler' status."
      };
    } else if (englishAge < 2.5) {
      return {
        id: 'tier-2',
        theme: {
          bg: 'bg-amber-50/80 dark:bg-[#1A130B]',
          border: 'border-amber-300/50 dark:border-amber-900/60',
          textMain: 'text-amber-950 dark:text-amber-100',
          textSub: 'text-amber-600 dark:text-amber-500',
          gradient: 'from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600',
          ringFill: 'text-amber-500',
          ringTrack: 'text-amber-200 dark:text-amber-950',
          glow: 'shadow-[0_20px_50px_-15px_rgba(245,158,11,0.3)] dark:shadow-[0_20px_50px_-15px_rgba(217,119,6,0.4)]',
          quoteBg: 'bg-amber-100/50 dark:bg-amber-900/30',
          particle: 'bg-amber-400'
        },
        Icon: Sprout,
        tag: "Rising Sprout",
        message: "You're bursting with potential! You have the basics down, but your vocabulary is still a bit green. Water your brain!",
        quote: "Mighty oaks from little acorns grow. Keep sprouting. 🌱",
        animation: { y: [0, -6, 0], scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 3, ease: "easeInOut" } },
        nextMilestone: "Reach Age 2.5 to unlock 'Confident Teenager' status."
      };
    } else if (englishAge < 4.0) {
      return {
        id: 'tier-3',
        theme: {
          bg: 'bg-[#F4FBF6]/80 dark:bg-[#0B1A13]',
          border: 'border-[#1EA65A]/30 dark:border-emerald-800/60',
          textMain: 'text-[#1B434D] dark:text-emerald-50',
          textSub: 'text-emerald-600 dark:text-emerald-400',
          gradient: 'from-emerald-400 to-[#1EA65A] dark:from-emerald-500 dark:to-teal-500',
          ringFill: 'text-[#1EA65A] dark:text-emerald-400',
          ringTrack: 'text-emerald-100 dark:text-emerald-950',
          glow: 'shadow-[0_20px_50px_-15px_rgba(16,185,129,0.3)] dark:shadow-[0_20px_50px_-15px_rgba(5,150,105,0.4)]',
          quoteBg: 'bg-emerald-100/40 dark:bg-emerald-900/30',
          particle: 'bg-emerald-400'
        },
        Icon: TreePine,
        tag: "Fluent Thinker",
        message: "Fantastic momentum! Your communication flows natively. You can hold your own in almost any conversation. Masterful!",
        quote: "Consistency today forms the roots of complete confidence tomorrow. 🌲",
        animation: { scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 4, ease: "easeInOut" } },
        nextMilestone: "Reach Age 4.0 to unlock 'Native Master' status."
      };
    } else {
      return {
        id: 'tier-4',
        theme: {
          bg: 'bg-indigo-50/80 dark:bg-[#0B0D1A]',
          border: 'border-indigo-300/50 dark:border-indigo-800/60',
          textMain: 'text-indigo-950 dark:text-indigo-50',
          textSub: 'text-indigo-600 dark:text-indigo-400',
          gradient: 'from-indigo-400 via-purple-500 to-pink-500 dark:from-indigo-500 dark:via-purple-600 dark:to-pink-600',
          ringFill: 'text-purple-500',
          ringTrack: 'text-indigo-100 dark:text-indigo-950',
          glow: 'shadow-[0_20px_50px_-15px_rgba(139,92,246,0.3)] dark:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.4)]',
          quoteBg: 'bg-indigo-100/50 dark:bg-indigo-900/40',
          particle: 'bg-purple-400'
        },
        Icon: Crown,
        tag: "Native Eloquence",
        message: "Absolutely god-tier. You speak with the elegance, nuance, and command of a seasoned native speaker. You are the benchmark.",
        quote: "Language is an art, and you are painting absolute masterpieces. 👑",
        animation: { rotate: [0, 8, -8, 0], y: [0, -5, 0], transition: { repeat: Infinity, duration: 6, ease: "easeInOut" } },
        nextMilestone: "You've reached the pinnacle of fluency. Keep maintaining!"
      };
    }
  }, [englishAge]);

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;

  return (
    <div className="relative w-full h-full perspective-1000 group">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "relative w-full rounded-[2rem] lg:rounded-[2.5rem] p-5 md:p-6 lg:p-8 transition-colors duration-1000 h-full flex flex-col justify-between overflow-hidden border backdrop-blur-xl",
          tierConfig.theme.bg,
          tierConfig.theme.border,
          tierConfig.theme.glow
        )}
      >
        {/* Animated Liquid Background Overlay */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className={cn(
          "absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full blur-[80px] pointer-events-none opacity-30 mix-blend-multiply dark:mix-blend-lighten transition-colors duration-1000",
          `bg-gradient-to-br ${tierConfig.theme.gradient}`
        )} />
        <Particles color={tierConfig.theme.particle} />

        {/* 3D Header Section */}
        <div className="flex items-center justify-between mb-8 relative z-10" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-2.5">
            <div className={cn("p-1.5 rounded-xl bg-white/50 dark:bg-black/30 border shadow-sm backdrop-blur-md", tierConfig.theme.border)}>
              <Sparkles className={cn("w-5 h-5", tierConfig.theme.textSub)} />
            </div>
            <h2 className={cn("text-[18px] lg:text-[21px] font-black tracking-tight drop-shadow-sm", tierConfig.theme.textMain)}>
              English Age
            </h2>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className={cn("flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm backdrop-blur-xl cursor-help group/tooltip relative", tierConfig.theme.quoteBg, tierConfig.theme.border)}
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", tierConfig.theme.textSub)}></span>
              <span className={cn("relative inline-flex rounded-full h-2.5 w-2.5", tierConfig.theme.bg)}></span>
            </div>
            <span className={cn("text-[10.5px] font-black uppercase tracking-[0.15em]", tierConfig.theme.textSub)}>
              {tierConfig.tag}
            </span>
            {/* Tooltip */}
            <div className="absolute -bottom-10 right-0 w-max max-w-[200px] bg-slate-900 text-white text-[11px] p-2 rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Age represents your functional fluency compared to years of native practice.
            </div>
          </motion.div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col-reverse sm:flex-row gap-6 justify-between items-center sm:items-stretch flex-1 relative z-10">

          {/* Left Column: Text & Data */}
          <div className="flex-1 flex flex-col w-full text-center sm:text-left justify-center" style={{ transform: "translateZ(40px)" }}>

            {/* Huge Animated Age Readout */}
            <div className="flex items-baseline justify-center sm:justify-start gap-2.5 mb-4 group/readout">
              <span className={cn(
                "text-[56px] lg:text-[72px] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-br drop-shadow-sm transition-transform duration-300 group-hover/readout:scale-105 origin-left",
                tierConfig.theme.gradient
              )}>
                <AnimatedNumber value={englishAge} />
              </span>
              <span className={cn("text-[16px] lg:text-[20px] font-black uppercase tracking-widest opacity-50", tierConfig.theme.textMain)}>
                years
              </span>
            </div>

            {/* Emotional/Creative Message */}
            <div className={cn("relative p-4 rounded-2xl mb-8 border backdrop-blur-sm transition-all shadow-sm hover:shadow-md", tierConfig.theme.quoteBg, tierConfig.theme.border)}>
              <p className={cn("text-[14px] lg:text-[15.5px] font-bold leading-relaxed max-w-[280px] mx-auto sm:mx-0", tierConfig.theme.textMain, "opacity-90")}>
                {tierConfig.message}
              </p>
            </div>

            {/* Gamified Linear Progress & Next Milestone */}
            <div className="w-full mt-auto bg-white/40 dark:bg-black/20 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group/progress">
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-[100%] group-hover/progress:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none z-10"></div>

              <div className="flex items-center justify-between mb-3">
                <h4 className={cn("text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5", tierConfig.theme.textSub)}>
                  <Target className="w-3.5 h-3.5" /> Next Goal: {goalAge} Yrs
                </h4>
                <span className={cn("text-[12px] font-black bg-white/50 dark:bg-black/40 px-2 py-0.5 rounded-full shadow-sm", tierConfig.theme.textMain)}>
                  {yearsToGo} yrs left
                </span>
              </div>
              
              {/* Animated Progress Bar */}
              <div className={cn("flex-1 h-3 rounded-full overflow-hidden relative shadow-inner", tierConfig.theme.ringTrack)}>
                {/* Glowing Liquid Fill */}
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPercentage}%` }}
                  transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                  className={cn("absolute left-0 top-0 h-full rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] relative overflow-hidden", `bg-gradient-to-r ${tierConfig.theme.gradient}`)}
                >
                  {/* Internal flow animation */}
                  <motion.div 
                    className="absolute inset-0 w-[200%] bg-[url('/noise.svg')] opacity-30 mix-blend-overlay"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  />
                </motion.div>
              </div>

              {/* Next Milestone Text */}
              <div className="mt-3 flex items-center gap-1.5 opacity-70">
                <ArrowRight className={cn("w-3.5 h-3.5", tierConfig.theme.textMain)} />
                <span className={cn("text-[11px] font-bold", tierConfig.theme.textMain)}>
                  {tierConfig.nextMilestone}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Hover Circular Visual */}
          <div className="relative w-[150px] h-[150px] lg:w-[180px] lg:h-[180px] flex-shrink-0 flex items-center justify-center mb-6 sm:mb-0" style={{ transform: "translateZ(60px)" }}>

            {/* Glowing Backdrop Behind Ring */}
            <div className={cn("absolute inset-0 rounded-full blur-2xl opacity-40 animate-pulse", `bg-gradient-to-tr ${tierConfig.theme.gradient}`)}></div>

            {/* Dynamic SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80" cy="80" r={radius}
                stroke="currentColor"
                className={cn("transition-colors duration-1000", tierConfig.theme.ringTrack)}
                strokeWidth="12"
                fill="transparent"
              />
              {/* Foreground Fill */}
              <motion.circle
                cx="80" cy="80" r={radius}
                stroke="url(#ringGradientAge)"
                className={cn("transition-colors duration-1000 drop-shadow-lg")}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="ringGradientAge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="currentColor" className={tierConfig.theme.textSub} />
                  <stop offset="100%" stopColor="currentColor" className={tierConfig.theme.ringFill} />
                </linearGradient>
              </defs>
            </svg>

            {/* Central 3D Animated Icon / Visual */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center rounded-full z-10 m-[26px] bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 shadow-[inset_0_4px_20px_rgba(255,255,255,0.4)] dark:shadow-[inset_0_4px_20px_rgba(255,255,255,0.05)]", 
              tierConfig.theme.textMain,
              tierConfig.theme.border
            )}>
              <motion.div animate={tierConfig.animation}>
                <tierConfig.Icon className={cn("w-14 h-14 lg:w-16 lg:h-16 drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]", tierConfig.theme.textSub)} strokeWidth={1.5} />
              </motion.div>
            </div>

            {/* Floating Level Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className={cn("absolute -bottom-2 px-3 py-1 rounded-full border shadow-lg backdrop-blur-md z-20 flex items-center gap-1", tierConfig.theme.bg, tierConfig.theme.border)}
            >
              <Zap className={cn("w-3 h-3 fill-current", tierConfig.theme.textSub)} />
              <span className={cn("text-[10px] font-black uppercase tracking-widest", tierConfig.theme.textMain)}>
                Lvl {currentLevel}
              </span>
            </motion.div>

          </div>
        </div>

        {/* Floating Gamified Quote Footer */}
        <div className={cn("mt-6 rounded-[24px] p-5 relative overflow-hidden flex items-center justify-center border backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-[1.01]", tierConfig.theme.quoteBg, tierConfig.theme.border)} style={{ transform: "translateZ(20px)" }}>
          <p className={cn("text-center text-[13.5px] lg:text-[15px] font-black tracking-wide leading-relaxed px-4 relative z-10 italic opacity-90", tierConfig.theme.textMain)}>
            "{tierConfig.quote}"
          </p>
        </div>

      </motion.div>
    </div>
  );
}
