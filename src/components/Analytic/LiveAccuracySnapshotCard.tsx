import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, Gauge, Sparkles, TrendingUp, CheckCircle, BrainCircuit } from 'lucide-react';
import type { AccuracyResult } from '@/utils/AI Chat/accuracy/accuracyCalculator';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiveAccuracySnapshotCardProps {
  accuracyData?: AccuracyResult | null;
}

// Animated Number Component
const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 1200;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeProgress);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <>{Math.round(displayValue)}</>;
};

// SVG Circular Gauge Component
const CircularGauge = ({ value, color, size = 120 }: { value: number, color: string, size?: number }) => {
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm dark:drop-shadow-xl" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2} cy={size/2} r={radius}
          stroke="currentColor"
          className="text-purple-100 dark:text-purple-900/40"
          strokeWidth="8"
          fill="transparent"
        />
        <motion.circle
          cx={size/2} cy={size/2} r={radius}
          stroke="currentColor"
          className={cn("drop-shadow-md dark:drop-shadow-[0_0_10px_currentColor]", color)}
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-indigo-300">
          <AnimatedNumber value={value} />
          <span className="text-xl">%</span>
        </span>
      </div>
    </div>
  );
};

const LiveAccuracySnapshotCard: React.FC<LiveAccuracySnapshotCardProps> = ({ accuracyData }) => {
  const safePercent = (value?: number | null) => {
    const normalized = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    return Math.round(normalized);
  };

  const headline = safePercent(accuracyData?.adjustedOverall ?? accuracyData?.overall);
  const primaryMetrics = [
    { label: 'Grammar', value: safePercent(accuracyData?.grammar) },
    { label: 'Vocabulary', value: safePercent(accuracyData?.vocabulary) },
    { label: 'Fluency', value: safePercent(accuracyData?.fluency) },
    { label: 'Spelling', value: safePercent(accuracyData?.spelling) },
  ];

  const supportMetrics = [
    { label: 'Punctuation', value: safePercent(accuracyData?.punctuation) },
    { label: 'Capitalization', value: safePercent(accuracyData?.capitalization) },
    { label: 'Syntax', value: safePercent(accuracyData?.syntax) },
    { label: 'Coherence', value: safePercent(accuracyData?.coherence) },
  ].filter((metric) => metric.value > 0);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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
    <div className="perspective-1000 w-full h-full group">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex flex-col bg-white dark:bg-[#0A0514] rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-[0_20px_50px_-15px_rgba(124,58,237,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(124,58,237,0.4)] border border-slate-100 dark:border-purple-500/20 overflow-hidden w-full h-full transition-all duration-1000"
      >
        {/* Animated Background Textures */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-purple-400/10 dark:bg-purple-600/20 rounded-full blur-[80px] pointer-events-none transition-all duration-1000 group-hover:scale-110 group-hover:bg-purple-300/15 dark:group-hover:bg-purple-500/20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/10 dark:bg-indigo-600/20 rounded-full blur-[60px] pointer-events-none transition-all duration-1000 group-hover:scale-110 group-hover:bg-indigo-300/15 dark:group-hover:bg-indigo-500/20" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-20" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-purple-600 dark:text-purple-400 shadow-sm dark:shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-purple-600 dark:text-purple-400">Live Telemetry</p>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Performance Snapshot</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/30 backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(124,58,237,0.2)] w-max">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500 dark:bg-purple-400"></span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-300">Adaptive Analysis</span>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr] relative z-20 flex-1" style={{ transform: "translateZ(20px)" }}>
          
          {/* Left Column: Overall & Primary Metrics */}
          <div className="flex flex-col gap-6">
            
            {/* Holographic Overall Accuracy Card */}
            <div className="relative rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 backdrop-blur-xl shadow-sm dark:shadow-inner overflow-hidden group/overall hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 dark:from-purple-500/10 to-transparent opacity-0 group-hover/overall:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-300">Overall Accuracy</p>
                {accuracyData?.tierInfo && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md">
                    <Sparkles className="w-3 h-3" />
                    <span className="text-[10px] font-black tracking-widest uppercase">Tier {accuracyData.tierInfo.tier}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <CircularGauge value={headline} color="text-purple-500 dark:text-purple-400" size={130} />
                
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-100 dark:border-purple-500/20">
                    <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-200">Real-time</span>
                  </div>
                  {headline >= 90 && (
                    <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 animate-pulse">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[11px] font-bold uppercase tracking-wider">Exceptional</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sub Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              {primaryMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 p-4 backdrop-blur-md hover:border-purple-300 dark:hover:border-purple-500/40 hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-all duration-300 shadow-sm cursor-crosshair group/metric"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover/metric:text-purple-600 dark:group-hover/metric:text-purple-300 transition-colors">{metric.label}</p>
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/20 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="h-3 w-3" />
                      {metric.value}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden shadow-inner relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full shadow-sm dark:shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Signals & Support */}
          <div className="flex flex-col gap-4">
            
            {/* Key Signals HUD */}
            <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-sm relative overflow-hidden group/signals hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover/signals:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center gap-2 mb-5">
                <Gauge className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-300">Telemetry Signals</p>
              </div>

              <ul className="space-y-4">
                <li className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Accuracy Drift</span>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Stable</span>
                  </div>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Grammar Consistency</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{primaryMetrics[0]?.value ?? 0}%</span>
                  </div>
                </li>
                <li className="flex items-center justify-between p-2 rounded-xl hover:bg-white dark:hover:bg-white/5 transition-colors">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confidence Score</span>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">High</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Support Metrics */}
            {supportMetrics.length > 0 && (
              <div className="rounded-[2rem] border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 p-6 backdrop-blur-xl shadow-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-4">Secondary Metrics</p>
                <div className="grid gap-3">
                  {supportMetrics.map((metric) => (
                    <div key={metric.label} className="flex items-center justify-between group/sec cursor-pointer">
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 group-hover/sec:text-slate-900 dark:group-hover/sec:text-white transition-colors">{metric.label}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1 bg-slate-200 dark:bg-black/40 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 dark:bg-slate-500 group-hover/sec:bg-purple-500 dark:group-hover/sec:bg-purple-400 transition-colors" style={{ width: `${metric.value}%` }} />
                        </div>
                        <span className="text-xs font-bold text-slate-900 dark:text-white w-8 text-right">{metric.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveAccuracySnapshotCard;
