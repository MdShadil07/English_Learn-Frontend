import React from 'react';
import { Target, TrendingUp, AlertTriangle, ArrowRight, Zap, Flame, Crosshair } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export type TopCategory = {
  name: string;
  level: number | string;
  accuracy: number;
  xpEarned: number;
  momentum: number;
};

export type NeedsAttentionCategory = {
  name: string;
  accuracy: number;
  totalAttempts: number;
};

interface CategoryMomentumCardProps {
  topCategories: TopCategory[];
  needsAttention: NeedsAttentionCategory[];
}

const CategoryMomentumCard: React.FC<CategoryMomentumCardProps> = ({ topCategories, needsAttention }) => {
  // 3D Tilt Effect Setup
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
    <div className="perspective-1000 w-full group">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex flex-col bg-white dark:bg-[#050C14] rounded-[2.5rem] p-5 md:p-6 lg:p-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] border border-slate-100 dark:border-emerald-500/20 transition-all duration-1000 overflow-hidden w-full"
      >
        {/* Holographic Background Orbs */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-300/15 dark:group-hover:bg-emerald-400/20 transition-all duration-1000" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-400/10 dark:bg-teal-600/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-300/15 dark:group-hover:bg-cyan-500/20 transition-all duration-1000 delay-100" />

        {/* Header HUD */}
        <div className="flex items-center justify-between mb-8 relative z-20" style={{ transform: "translateZ(30px)" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-sm dark:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <Crosshair className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 dark:text-emerald-400">Momentum</p>
              <h3 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Category Pulse</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Live Weekly</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 relative z-10 flex-1">

          {/* Left Sidebar: 3D Mascot */}
          <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col items-center justify-center p-4 lg:p-6 relative group/mascot" style={{ transform: "translateZ(40px)" }}>

            <motion.div
              className="relative z-20 drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_30px_rgba(16,185,129,0.4)] -mt-4 lg:-mt-8 mb-2 w-[220px] h-[220px] md:w-[280px] md:h-[280px] lg:w-[380px] lg:h-[380px]"
              initial={{ y: 0 }}
              animate={{ y: [0, -12, 0], rotate: [0, 2, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.15, y: -5, rotate: 0, transition: { duration: 0.4, type: "spring", stiffness: 300 } }}
            >
              <img src="/bird.png" alt="AI Mascot" className="w-full h-full object-contain transform scale-105" />
            </motion.div>
          </div>

          {/* Right Area: Stats Panels */}
          <div className="flex-1 flex flex-col gap-5 justify-center" style={{ transform: "translateZ(20px)" }}>

            {/* Top Performers Section */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-1">
                <Flame className="h-4 w-4 text-orange-500" strokeWidth={3} />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">Peak Performers</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {topCategories.length > 0 ? (
                  topCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="group/cat relative flex flex-col justify-between p-3 md:p-3.5 rounded-[1.2rem] bg-white dark:bg-[#050C14]/50 border border-slate-200 dark:border-emerald-500/20 shadow-sm hover:shadow-md dark:shadow-none backdrop-blur-md hover:border-emerald-300 dark:hover:border-emerald-500/40 transition-all cursor-crosshair overflow-hidden min-h-[90px]"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 dark:bg-emerald-400/20 rounded-full blur-[20px] -translate-y-12 translate-x-12 group-hover/cat:scale-150 transition-transform duration-500" />

                      <div className="flex items-start justify-between mb-2 md:mb-3 relative z-10">
                        <div>
                          <p className="text-[13px] md:text-[14px] font-black text-slate-900 dark:text-white leading-tight group-hover/cat:text-emerald-600 dark:group-hover/cat:text-emerald-300 transition-colors truncate max-w-[120px] sm:max-w-[100px] md:max-w-[140px]">{category.name}</p>
                          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Level {category.level}</p>
                        </div>
                        <div className="flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-300 px-1.5 py-0.5 rounded-md font-black text-[10px] md:text-[11px] shadow-sm dark:shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                          {Math.round(category.accuracy)}%
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] md:text-[11px] font-black relative z-10 mt-auto">
                        <span className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-[#050C14]/80 px-1.5 py-0.5 rounded border border-slate-200/50 dark:border-white/5">{category.xpEarned} XP</span>
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">
                          +{category.momentum}% <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3 group-hover/cat:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-6 px-4 bg-slate-50 dark:bg-[#050C14]/50 rounded-[1.5rem] border border-slate-200 border-dashed dark:border-emerald-500/20">
                    <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 text-center">No top categories yet. Keep practicing to build your momentum!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Needs Attention Section */}
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center gap-2 px-1">
                <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" strokeWidth={3} />
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400">Critical Focus</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {needsAttention.length > 0 ? (
                  needsAttention.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 2 }}
                      className="group/attn relative flex flex-col justify-between p-3 md:p-3.5 rounded-[1.2rem] bg-[#FFF5F5] dark:bg-[#050C14]/50 border border-rose-200 dark:border-rose-500/20 backdrop-blur-md hover:border-rose-300 dark:hover:border-rose-500/40 transition-all cursor-crosshair shadow-sm dark:shadow-none min-h-[75px]"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-[13px] md:text-[14px] font-black text-rose-900 dark:text-rose-200 leading-tight pr-2 group-hover/attn:text-rose-700 dark:group-hover/attn:text-rose-100 transition-colors truncate max-w-[140px]">{category.name}</p>
                        <div className="flex items-center justify-center bg-white dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 dark:text-rose-300 px-1.5 py-0.5 rounded-md font-black text-[10px] md:text-[11px] shadow-sm dark:shadow-[0_0_10px_rgba(244,63,94,0.15)] flex-shrink-0">
                          {Math.round(category.accuracy)}%
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 mt-auto">
                        <Target className="w-2.5 h-2.5 md:w-3 md:h-3 text-rose-500 dark:text-rose-400" />
                        <p className="text-[9px] md:text-[10px] font-black text-rose-500 dark:text-rose-400 uppercase tracking-widest">
                          {category.totalAttempts} attempts
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-2 flex flex-col items-center justify-center py-6 px-4 bg-[#FFF5F5]/50 dark:bg-rose-500/5 rounded-[1.5rem] border border-rose-200 border-dashed dark:border-rose-500/20">
                    <p className="text-[12px] font-bold text-rose-500 dark:text-rose-400 text-center">No critical focus areas identified. Great job!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CategoryMomentumCard;
