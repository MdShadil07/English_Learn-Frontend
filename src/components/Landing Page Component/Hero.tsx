import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Mic,
  BarChart3,
  Globe,
  Play,
  Trophy,
  Flame,
  Activity,
  Languages,
  Brain,
  Wifi,
  Laptop,
  Coffee,
  Train,
  Settings,
  Send,
  CheckCircle2,
  PlayCircle,
  User,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// --- Configuration ---

// Real-world context nodes (People learning)
const CONTEXT_NODES = [
  { 
    id: 1, 
    icon: Laptop, 
    label: "Working", 
    sub: "Business English",
    color: "text-pink-500", 
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    // Desktop: Top Left, Mobile: Hidden or Compact
    position: "md:top-0 md:-left-16 lg:top-10 lg:-left-24",
    lineStart: { x: "20%", y: "20%" },
    delay: 0 
  },
  { 
    id: 2, 
    icon: Coffee, 
    label: "Casual", 
    sub: "Cafe Chat",
    color: "text-amber-500", 
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    // Desktop: Bottom Left
    position: "md:bottom-20 md:-left-12 lg:bottom-32 lg:-left-20",
    lineStart: { x: "20%", y: "80%" },
    delay: 1.5 
  },
  { 
    id: 3, 
    icon: Globe, 
    label: "Travel", 
    sub: "Cultural Prep",
    color: "text-blue-500", 
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    // Desktop: Top Right
    position: "md:top-10 md:-right-12 lg:top-16 lg:-right-28",
    lineStart: { x: "80%", y: "20%" },
    delay: 0.8 
  },
  { 
    id: 4, 
    icon: Train, 
    label: "Commute", 
    sub: "Listening",
    color: "text-emerald-500", 
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    // Desktop: Bottom Right
    position: "md:bottom-10 md:-right-8 lg:bottom-20 lg:-right-16",
    lineStart: { x: "80%", y: "80%" },
    delay: 2.2 
  },
];

export default function DashboardHero({ user = { fullName: 'Learner' }, greeting = 'Hello' }) {
  
  // Optimized Animation Variants (GPU accelerated)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1, 
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  // Infinite float animation (Optimized)
  const floatAnimation = {
    y: [0, -12, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <motion.div 
      className="relative w-full pt-6 pb-12 md:pt-12 md:pb-24 overflow-visible"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      
      {/* --- Ambient Lighting (CSS Optimized) --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none transform-gpu">
         <motion.div 
            className="absolute top-[-20%] right-[-10%] w-[25rem] md:w-[45rem] h-[25rem] md:h-[45rem] bg-emerald-400/20 rounded-full blur-[80px] md:blur-[120px] dark:bg-emerald-500/10 mix-blend-multiply dark:mix-blend-screen"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
         />
         <motion.div 
            className="absolute bottom-[-10%] left-[-10%] w-[20rem] md:w-[40rem] h-[20rem] md:h-[40rem] bg-blue-400/20 rounded-full blur-[80px] md:blur-[100px] dark:bg-blue-600/10 mix-blend-multiply dark:mix-blend-screen"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* --- Left Column: Text & Actions --- */}
        <motion.div 
          variants={itemVariants}
          className="space-y-8 text-center lg:text-left relative z-20"
        >
          
          {/* Animated Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-500/30 shadow-sm backdrop-blur-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                AI Coaching Active
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <div className="space-y-4">
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
            >
              {greeting}, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 animate-gradient-x">
                {user?.fullName || 'Learner'}
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Your personal AI tutor is ready. Dive into immersive conversations, track your real-time growth, and master English faster than ever.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              Start Session <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-base font-bold rounded-full border-2 border-slate-200 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 backdrop-blur-sm"
            >
              <PlayCircle className="mr-2 w-5 h-5" /> My Progress
            </Button>
          </motion.div>

          {/* Stats / Social Proof */}
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="flex items-center gap-3 group cursor-default">
               <div className="p-2.5 bg-orange-100 dark:bg-orange-900/20 rounded-2xl text-orange-500 group-hover:scale-110 transition-transform">
                  <Flame className="w-6 h-6 fill-current" />
               </div>
               <div className="text-left leading-tight">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">12</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Day Streak</div>
               </div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
            <div className="flex items-center gap-3 group cursor-default">
               <div className="p-2.5 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl text-yellow-500 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6 fill-current" />
               </div>
               <div className="text-left leading-tight">
                  <div className="text-xl font-bold text-slate-900 dark:text-white">Top 5%</div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Global Rank</div>
               </div>
            </div>
          </motion.div>

        </motion.div>

        {/* --- Right Column: Advanced Visuals --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end items-center h-[600px] md:h-[700px] w-full perspective-1000 mt-12 lg:mt-0 pointer-events-none md:pointer-events-auto"
        >
          
          {/* --- Connectivity Lines (SVG) --- */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible hidden md:block z-0">
             <defs>
                <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                   <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                   <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
             </defs>
             {CONTEXT_NODES.map((node, i) => (
               <g key={i}>
                 {/* Static Line */}
                 <path 
                   d={`M ${node.lineStart.x} ${node.lineStart.y} Q 50% 50% 50% 50%`} 
                   stroke="currentColor" 
                   className="text-slate-200 dark:text-slate-800" 
                   strokeWidth="1" 
                   fill="none" 
                   strokeDasharray="6 6"
                 />
                 {/* Moving Particle */}
                 <circle r="3" fill="#10b981">
                    <animateMotion 
                       dur={`${3 + i}s`} 
                       repeatCount="indefinite"
                       path={`M ${node.lineStart.x} ${node.lineStart.y} Q 50% 50% 50% 50%`}
                    />
                 </circle>
               </g>
             ))}
          </svg>

          {/* --- Central Phone Mockup --- */}
          <motion.div
            className="relative z-20 w-[280px] sm:w-[320px] h-[580px] sm:h-[640px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-900 shadow-2xl shadow-slate-300/50 dark:shadow-emerald-900/20 overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800"
            initial={{ rotateY: -5, rotateX: 2 }}
            animate={{ rotateY: 0, rotateX: 0 }}
            transition={{ duration: 2, type: 'spring', stiffness: 40 }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-30"></div>

            {/* Screen Content */}
            <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col font-sans overflow-hidden">
               
               {/* App Header */}
               <div className="pt-12 pb-4 px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
                           <AvatarImage src="/logo.svg" />
                           <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                     </div>
                     <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">Coach Taylor</div>
                        <div className="text-[10px] text-emerald-500 font-medium mt-0.5">Live Session</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded-full border border-red-100 dark:border-red-900/30">
                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                     <span className="text-[9px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Rec</span>
                  </div>
               </div>

               {/* Main Interaction Area */}
               <div className="flex-1 flex flex-col p-5 relative overflow-y-auto no-scrollbar">
                  
                  {/* AI Visualization (Center) */}
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[200px]">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Ripples */}
                        {[1, 2, 3].map((i) => (
                           <motion.div
                             key={i}
                             className="absolute inset-0 border border-emerald-500/20 rounded-full"
                             animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                             transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeOut" }}
                           />
                        ))}
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center z-10">
                           <Mic className="w-8 h-8 text-white" />
                        </div>
                     </div>
                     <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-4 animate-pulse">Listening to you...</p>
                  </div>

                  {/* Live Transcription & Correction Card */}
                  <motion.div 
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ delay: 0.5 }}
                     className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 space-y-3"
                  >
                     <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Transcript</span>
                        <span className="text-[10px] text-emerald-500 font-medium">98% Accuracy</span>
                     </div>
                     <div className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        "I really enjoyed the <span className="text-red-500 line-through decoration-red-300">meet</span> yesterday."
                     </div>
                     <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div className="text-xs">
                           <span className="font-bold text-emerald-700 dark:text-emerald-400">Correction:</span> Use <span className="font-bold">"meeting"</span> as a noun here.
                        </div>
                     </div>
                  </motion.div>
               </div>

               {/* Bottom Controls */}
               <div className="h-20 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-6">
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                     <Settings className="w-5 h-5 text-slate-400" />
                  </Button>
                  <Button size="icon" className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20">
                     <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </Button>
                  <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                     <BarChart3 className="w-5 h-5 text-slate-400" />
                  </Button>
               </div>

            </div>
          </motion.div>

          {/* --- Floating Phone Widgets (Breaking Grid) --- */}
          
          {/* Widget 1: Skill Growth (Right) */}
          <motion.div 
            className="absolute top-28 -right-8 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 z-30 w-44 hidden lg:block"
            initial={{ x: 40, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            transition={{ delay: 1.2, type: "spring" }}
            whileHover={{ scale: 1.05 }}
          >
             <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Proficiency</span>
                <Badge variant="secondary" className="text-[9px] bg-emerald-100 text-emerald-700 h-4 px-1.5">B2</Badge>
             </div>
             <div className="flex items-end justify-between h-10 gap-1">
                {[30, 50, 45, 70, 60, 85, 75].map((h, i) => (
                   <motion.div 
                      key={i} 
                      className="w-full bg-emerald-100 dark:bg-emerald-900/30 rounded-t-sm relative overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 1, delay: 1.5 + (i * 0.1) }}
                   >
                      <div className="absolute bottom-0 left-0 right-0 top-0 bg-emerald-500 opacity-80"></div>
                   </motion.div>
                ))}
             </div>
          </motion.div>

          {/* Widget 2: New Word (Left) */}
          <motion.div 
             className="absolute bottom-32 -left-12 bg-white dark:bg-slate-800 p-3 pr-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-slate-700 z-30 flex items-center gap-3 hidden lg:flex"
             initial={{ x: -40, opacity: 0 }} 
             animate={{ x: 0, opacity: 1 }} 
             transition={{ delay: 1.4, type: "spring" }}
             whileHover={{ scale: 1.05 }}
          >
             <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600">
                <Sparkles className="w-5 h-5" />
             </div>
             <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">New Word</div>
                <div className="text-[10px] text-slate-500">"Serendipity"</div>
             </div>
          </motion.div>

          {/* --- Context Nodes (Floating Around) --- */}
          {CONTEXT_NODES.map((node, i) => (
            <motion.div
              key={node.id}
              className={`absolute ${node.position} z-20 hidden lg:flex items-center gap-3 p-3 pr-5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border shadow-xl cursor-pointer transition-transform duration-300 ${node.border}`}
              animate={floatAnimation}
              style={{ animationDelay: `${node.delay}s` }}
              whileHover={{ scale: 1.05, zIndex: 40 }}
            >
               <div className={`p-2.5 rounded-xl ${node.bg} ${node.color}`}>
                  <node.icon className="w-5 h-5" />
               </div>
               <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">{node.label}</div>
                  <div className="text-[10px] text-slate-500 font-medium">{node.sub}</div>
               </div>
               {/* Connection Dot */}
               <div className={`absolute w-2 h-2 rounded-full ${node.color.replace('text-', 'bg-')} -z-10 top-1/2 -translate-y-1/2 ${i % 2 === 0 ? '-right-1' : '-left-1'}`}></div>
            </motion.div>
          ))}

          {/* Phone Glow Backdrop */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[800px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

        </motion.div>
      </div>
    </motion.div>
  );
}