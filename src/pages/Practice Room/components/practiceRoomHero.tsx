import React from 'react';
import { motion, Variants } from 'framer-motion';
import {
  Globe,
  Mic,
  Video,
  Users,
  MessageSquare,
  ArrowRight,
  Plus,
  Headphones,
  Signal,
  Settings2,
  Sparkles,
  MoreHorizontal,
  Activity,
  CheckCircle2,
  Volume2,
  MonitorUp,
  PhoneOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// Removed IsometricRoom and Spline imports since we are using the pixel-perfect image asset
import AmbientLighting from '../../../components/Landing Page Component/PracticeRoom/AmbientLighting';
import FloatingParticles from '../../../components/Landing Page Component/PracticeRoom/FloatingParticles';
import { LeftFeatureCards, BottomFeatureCards } from '../../../components/Landing Page Component/PracticeRoom/FeatureCards';

// --- Utility Function ---
function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'emerald';
  size?: 'default' | 'lg' | 'icon';
}

// --- UI Components ---
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg',
    outline: 'border-2 border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 hover:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-900',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/25 shadow-lg',
  } as const;
  const sizes = {
    default: 'h-11 px-6 py-2 text-sm',
    lg: 'h-14 rounded-full px-8 text-base',
    icon: 'h-10 w-10',
  } as const;
  return (
    <button
      ref={ref}
      className={cn('inline-flex items-center justify-center rounded-xl font-bold transition-all focus-visible:outline-none active:scale-95', variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = 'Button';
 


// --- Sub-Components for Visuals ---

const AudioWave = () => (
  <div className="flex items-center justify-center gap-[2px] h-3">
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-emerald-400 rounded-full"
        animate={{ height: ['4px', '12px', '6px', '10px', '4px'] }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          delay: i * 0.15,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const ACTIVE_SPEAKERS = [
  { id: 1, name: "Yuki", flag: "🇯🇵", location: "Japan", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80", isSpeaking: true, latency: "42ms" },
  { id: 2, name: "Carlos", flag: "🇪🇸", location: "Spain", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "85ms" },
  { id: 3, name: "Emma", flag: "🇬🇧", location: "UK", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "38ms" },
  { id: 4, name: "You", flag: "🇺🇸", location: "Online", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80", isSpeaking: false, latency: "12ms" },
];

export default function PracticeRoomHero({
  onCreateClick,
  onBrowseClick
}: {
  onCreateClick?: () => void;
  onBrowseClick?: () => void;
}) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  const floatAnimation = (delay = 0, yOffset = -15) => ({
    y: [0, yOffset, 0],
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' as const, delay }
  });

  return (
    <section className="bg-transparent pt-4 lg:pt-6 pb-12 lg:pb-24 relative overflow-hidden font-sans transition-colors duration-500 ease-in-out">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-14 relative">
        
        {/* Main Container with Glassmorphic Border */}
        <div className="relative rounded-[3rem] p-6 sm:p-8 lg:p-12 border border-slate-200/80 dark:border-slate-800/60 bg-white/60 dark:bg-[#0a0f1c]/80 backdrop-blur-3xl shadow-xl dark:shadow-2xl overflow-visible transition-colors duration-300">
          
          <AmbientLighting />
          <FloatingParticles />

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-8 relative z-10">
            
            {/* --- Left Column: Copy & Actions --- */}
            <motion.div
              className="flex flex-col text-center lg:text-left"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-6 flex justify-center lg:justify-start">
                <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500 ease-in-out">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Live Practice Rooms</span>
                </div>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-[#0f172a] dark:text-white tracking-tight leading-[1.1] mb-6 transition-colors duration-500 ease-in-out">
                Practice.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 block mt-2 pb-2">
                  Connect & Grow.
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0 transition-colors duration-500 ease-in-out">
                Break the language barrier. Join live audio and video rooms with learners worldwide. Practice speaking in real-time, get instant AI assistance, and build global confidence.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 justify-center lg:justify-start mb-10 z-20">
                <Button variant="emerald" size="lg" className="group shadow-emerald-500/20 w-full sm:w-auto" onClick={onCreateClick}>
                  <Plus className="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" />
                  Create a Room
                </Button>

                <Button variant="outline" size="lg" className="group border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto" onClick={onBrowseClick}>
                  <Globe className="w-5 h-5 mr-2 text-indigo-400 group-hover:animate-pulse" />
                  Browse Active Rooms
                </Button>
              </motion.div>
            </motion.div>

            {/* --- Right Column: Pixel Perfect Vector Art / Image --- */}
            <div className="relative h-full flex items-center justify-center min-h-[400px] lg:min-h-[600px] w-full">
              
              {/* Stunning Ambient Glow Behind the Image */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <div className="w-[80%] h-[80%] max-w-[600px] bg-gradient-to-tr from-teal-500/20 via-emerald-500/10 to-cyan-500/20 dark:from-teal-500/30 dark:via-emerald-500/20 dark:to-cyan-500/30 rounded-full blur-[80px] dark:blur-[100px] mix-blend-multiply dark:mix-blend-screen animate-pulse transition-colors" />
              </div>

              {/* Vector Art Container (Directly Floating Image) */}
              <motion.div 
                className="relative z-10 w-full max-w-[800px]"
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.3 }}
              >
                <motion.img 
                  src="/practice.png" 
                  alt="Practice Room 3D Environment"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-700"
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

          </div>

          {/* Bottom Horizontal Feature Cards - Now inside the Hero Container */}
          <div className="relative z-10 w-full pt-8 lg:pt-12 mt-8 lg:mt-4 border-t border-emerald-100 dark:border-emerald-900/30">
            <BottomFeatureCards />
          </div>

        </div>
        
      </div>
    </section>
  );
}