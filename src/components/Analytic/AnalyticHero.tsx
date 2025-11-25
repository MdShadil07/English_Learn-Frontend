import React from 'react';
import { motion } from 'framer-motion';
import useLowEnd from '@/hooks/use-lowend';
import type { Variants, Transition } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Brain,
  Target,
  Zap,
  TrendingUp,
  Search,
  Share2,
  Download,
  PieChart,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// --- Configuration: Floating Insight Widgets ---
const INSIGHT_WIDGETS = [
  {
    id: 1,
    label: "Learning Velocity",
    value: "+12%",
    trend: "up",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    position: "top-10 -left-4 md:top-20 md:-left-24",
    delay: 0.2
  },
  {
    id: 2,
    label: "Vocab Retention",
    value: "94%",
    trend: "neutral",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    position: "bottom-20 -right-4 md:bottom-32 md:-right-12",
    delay: 0.5
  },
  {
    id: 3,
    label: "Focus Area",
    value: "Grammar",
    trend: "alert",
    icon: Target,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    position: "top-0 -right-8 md:top-10 md:-right-20",
    delay: 0.8
  }
];

type AnalyticsHeroProps = {
  user?: {
    fullName: string;
    email?: string;
  };
};

export default function AnalyticsHero({ user = { fullName: 'Learner' } }: AnalyticsHeroProps) {
  const isLowEnd = useLowEnd();

  // If device is low-end, render a simplified static hero to avoid expensive animations
  if (isLowEnd) {
    return (
      <div className="relative w-full pt-8 pb-12 md:pt-10 md:pb-16 overflow-visible">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-500/30 shadow-sm">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">Real-time Performance</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">Precision Insights.</h1>
              <p className="text-base text-slate-600 dark:text-slate-400 max-w-lg">Decode your fluency. Our engine analyzes multiple linguistic signals to provide actionable accuracy on your progress.</p>

              <div className="flex gap-3 justify-center lg:justify-start mt-4">
                <button className="px-6 py-3 rounded-full bg-emerald-600 text-white">Deep Dive Analysis</button>
                <button className="px-6 py-3 rounded-full bg-white border">View Stories</button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-[300px] h-[380px] bg-white rounded-2xl border shadow-md flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.fullName)}`} alt="avatar" className="w-16 h-16 rounded-full" />
                </div>
                <div className="text-lg font-bold">{user.fullName}</div>
                <div className="text-xs text-slate-500">{user.email ?? ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Animation Variants
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 } as Transition,
    },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: { duration: 6, repeat: Infinity }
  };

  // Radar Chart Data Points (SVG Coordinates)
  // Center is 100,100. Radius is ~80.
  // 5 Points: Top, Top-Right, Bottom-Right, Bottom-Left, Top-Left
  const radarPoints = "100,20 176,76 147,164 53,164 24,76"; // Outer shape (Goal)
  const userPoints = "100,40 160,85 130,140 70,140 40,90"; // Inner shape (User Progress)

  return (
    <div className="relative w-full pt-8 pb-16 md:pt-12 md:pb-24 overflow-visible">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div 
            className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 15, repeat: Infinity }}
         />
        <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[50rem] h-[50rem] bg-emerald-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 12, repeat: Infinity }}
         />
         {/* Technical Grid Overlay */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* --- Left Column: Text & Controls --- */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="space-y-8 text-center lg:text-left order-1"
        >
          <div className="space-y-6">
            <motion.div variants={itemVariants} className="inline-flex items-center justify-center lg:justify-start w-full lg:w-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-500/30 shadow-sm backdrop-blur-md">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                  Real-time Performance
                </span>
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Precision <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-500">
                  Insights.
                </span>
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Decode your fluency. Our advanced engine analyzes 50+ linguistic data points to provide you with actionable, pinpoint accuracy on your progress.
              </motion.p>
            </div>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <Button
              size="lg"
              className="h-14 px-8 text-base font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Search className="mr-2 w-5 h-5" /> Deep Dive Analysis
            </Button>
            <div className="flex gap-2 justify-center">
               <Button
                 size="icon"
                 variant="outline"
                 className="h-14 w-14 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-all"
               >
                 <Download className="w-5 h-5" />
               </Button>
               <Button
                 size="icon"
                 variant="outline"
                 className="h-14 w-14 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-all"
               >
                 <Share2 className="w-5 h-5" />
               </Button>
            </div>
          </motion.div>

          {/* Summary Stats Strip */}
          <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-6 pt-4 border-t border-slate-200 dark:border-slate-800/50">
            <div className="text-left">
               <div className="text-2xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                  B2 <span className="text-sm font-medium text-emerald-500">Advanced</span>
               </div>
               <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">CEFR Level</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
            <div className="text-left">
               <div className="text-2xl font-bold text-slate-900 dark:text-white">45h</div>
               <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Total Practice</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
             <div className="text-left">
               <div className="text-2xl font-bold text-slate-900 dark:text-white">94%</div>
               <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Accuracy</div>
            </div>
          </motion.div>

        </motion.div>

        {/* --- Right Column: Holographic Visualization --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex justify-center lg:justify-end items-center h-[500px] md:h-[600px] w-full perspective-1000 order-2 mt-8 lg:mt-0"
        >
          
          {/* --- Central 3D Glass Interface --- */}
          <motion.div
             className="relative z-20 w-[320px] md:w-[400px] h-[420px] md:h-[500px] bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/80 dark:to-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-700/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
             initial={{ rotateY: -8, rotateX: 4 }}
             animate={{ rotateY: 0, rotateX: 0 }}
             transition={{ duration: 2, type: 'spring', stiffness: 40 }}
             whileHover={{ rotateY: -2, rotateX: 2, scale: 1.02, transition: { duration: 0.3 } }}
          >
             
             {/* Header */}
             <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center">
                <div>
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Proficiency Analysis</div>
                   <h3 className="text-lg font-bold text-slate-900 dark:text-white">Skill Breakdown</h3>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">Live Data</Badge>
             </div>

             {/* Body: Radar Chart */}
             <div className="flex-1 relative flex items-center justify-center p-6">
                <div className="relative w-full h-full max-h-[300px] max-w-[300px]">
                   
                   {/* Labels */}
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] font-bold text-slate-500">Pronunciation</div>
                   <div className="absolute top-1/4 right-0 translate-x-4 text-[10px] font-bold text-slate-500">Vocab</div>
                   <div className="absolute bottom-1/4 right-0 translate-x-2 text-[10px] font-bold text-slate-500">Grammar</div>
                   <div className="absolute bottom-1/4 left-0 -translate-x-2 text-[10px] font-bold text-slate-500">Fluency</div>
                   <div className="absolute top-1/4 left-0 -translate-x-4 text-[10px] font-bold text-slate-500">Listening</div>

                   <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                      {/* Grid Rings */}
                      {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                         <motion.polygon 
                            key={i}
                            points={radarPoints} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="1" 
                            className="text-slate-200 dark:text-slate-700"
                            transform={`scale(${scale})`}
                            style={{ transformOrigin: '100px 100px' }}
                         />
                      ))}
                      
                      {/* Data Polygon (Animated) */}
                      <motion.polygon 
                         points={userPoints}
                         fill="rgba(16, 185, 129, 0.2)" 
                         stroke="#10b981" 
                         strokeWidth="2"
                         initial={{ scale: 0, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         transition={{ duration: 1, delay: 0.5, type: "spring" }}
                      />
                      
                      {/* Data Points */}
                      {userPoints.split(' ').map((point, i) => {
                         const [cx, cy] = point.split(',');
                         return (
                            <motion.circle 
                               key={i} 
                               cx={cx} cy={cy} r="3" 
                               fill="white" stroke="#10b981" strokeWidth="2"
                               initial={{ scale: 0 }}
                               animate={{ scale: 1 }}
                               transition={{ delay: 1 + i * 0.1 }}
                            />
                         )
                      })}
                   </svg>
                </div>
             </div>

             {/* Footer: Insight Strip */}
             <div className="p-4 bg-slate-50/80 dark:bg-slate-800/50 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center backdrop-blur-sm">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                   <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Analyzing speaking patterns...</span>
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">89/100</div>
             </div>

          </motion.div>

          {/* --- Floating Insight Nodes --- */}
          {INSIGHT_WIDGETS.map((widget, i) => (
             <motion.div
               key={widget.id}
               className={`absolute ${widget.position} z-30 hidden md:flex flex-col gap-1 p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border shadow-xl ${widget.border}`}
               animate={floatAnimation}
               style={{ animationDelay: `${widget.delay}s` }}
               whileHover={{ scale: 1.05 }}
             >
                <div className="flex items-center gap-2">
                   <div className={`p-1.5 rounded-lg ${widget.bg} ${widget.color}`}>
                      <widget.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{widget.label}</span>
                </div>
                <div className="flex items-baseline gap-2 pl-1">
                   <span className="text-xl font-bold text-slate-900 dark:text-white">{widget.value}</span>
                   {widget.trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                   {widget.trend === "alert" && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></div>}
                </div>
             </motion.div>
          ))}

          {/* Decorative Background Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-emerald-500/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

        </motion.div>
      </div>
    </div>
  );
}   