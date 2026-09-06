import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Info, ChevronRight, CheckCircle2, Target, Flame, 
  Trophy, Play, TrendingUp, BarChart2, Rocket, 
  Sparkles, Activity, Ear, MessageSquare 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiCoachInsightsCardProps {
  isPremium?: boolean;
  insights?: any;
}

const AiCoachInsightsCard: React.FC<AiCoachInsightsCardProps> = ({ insights }) => {
  // 3D Tilt Effect Setup
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["4deg", "-4deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-4deg", "4deg"]);

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

  const isNewUser = insights?.strength?.area === "Getting Started";

  return (
    <div className="w-full h-full group">
      <motion.div
        className="relative flex flex-col bg-white dark:bg-[#050C14] rounded-3xl sm:rounded-[2.5rem] p-5 sm:p-6 lg:p-8 shadow-[0_20px_50px_-15px_rgba(16,185,129,0.15)] dark:shadow-[0_20px_50px_-15px_rgba(16,185,129,0.2)] border border-slate-100 dark:border-emerald-500/20 transition-all duration-1000 h-full overflow-hidden w-full"
      >
        {/* Holographic Background Orbs */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-400/10 dark:bg-emerald-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-emerald-300/15 dark:group-hover:bg-emerald-400/20 transition-all duration-1000" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/10 dark:bg-teal-600/20 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-300/15 dark:group-hover:bg-cyan-500/20 transition-all duration-1000 delay-100" />

        {/* Header HUD */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 relative z-20">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-500 dark:text-emerald-400 shadow-sm dark:shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 dark:text-emerald-400">AI Analysis</p>
              <h3 className="text-xl lg:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Coach Insights</h3>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 backdrop-blur-md shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-300">Live</span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 relative z-10 flex-1 h-full">
          
          {/* =========================================================
              TOP SECTION: ROBOT & PEDESTAL
          ========================================================= */}
          <div className="relative w-full flex flex-col items-center pt-2">
            
            {/* Holographic Beam */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-gradient-to-b from-emerald-500/10 dark:from-emerald-500/20 to-transparent rounded-full z-0 opacity-80 mix-blend-screen pointer-events-none"></div>
            
            {/* Floating Sparkles */}
            <motion.div className="absolute top-[5%] left-[10%] text-emerald-300 text-2xl drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} >✦</motion.div>
            <motion.div className="absolute top-[30%] right-[10%] text-emerald-400 text-3xl drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }} >✦</motion.div>
            <motion.div className="absolute bottom-[20%] left-[5%] text-teal-300 text-xl drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} >✦</motion.div>

            {/* Robot Container */}
            <div className="relative z-10 w-[300px] h-[280px] flex flex-col items-center justify-end mb-8 group/robot cursor-pointer">
              
              <motion.img 
                src="/robot.png" 
                alt="AI Coach Nova"
                loading="lazy"
                decoding="async"
                className="absolute bottom-[40px] w-[220px] h-auto object-contain z-20 drop-shadow-[0_20px_25px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)] filter brightness-100 dark:brightness-110 contrast-100 dark:contrast-125"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Holographic Pedestal */}
              <div className="relative w-[220px] h-[65px] z-10">
                 <div className="absolute top-0 w-full h-[45px] rounded-[50%] bg-emerald-50 dark:bg-emerald-950/80 border-2 border-emerald-200 dark:border-emerald-500/50 shadow-sm dark:shadow-[inset_0_0_20px_rgba(16,185,129,0.5)] z-20 backdrop-blur-md"></div>
                 <div className="absolute top-[22.5px] w-full h-[42.5px] bg-gradient-to-b from-slate-100 to-slate-50 dark:from-emerald-900/80 dark:to-transparent border-x border-b border-slate-200 dark:border-emerald-500/30 rounded-b-[50%] z-10"></div>
              </div>

              {/* Coach Nova Name Badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-max bg-white/90 dark:bg-[#050C14]/80 backdrop-blur-xl border border-slate-200 dark:border-emerald-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(16,185,129,0.3)] rounded-2xl p-2.5 pr-5 flex items-center gap-3.5 z-30 transform hover:scale-110 transition-transform">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center p-1 relative shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 opacity-10 dark:opacity-20"></div>
                  <img src="/robot.png" loading="lazy" decoding="async" className="w-full h-full object-contain scale-125 translate-y-1 relative z-10" alt="Avatar" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-black text-slate-900 dark:text-white leading-none tracking-tight">Coach Nova</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-emerald-200/60 mt-1 uppercase tracking-wider">AI Speaking Coach</span>
                </div>
              </div>
            </div>

            {/* Mini Stats Row */}
            {/* Mini Stats Row */}
            <div className="flex flex-row w-full justify-between gap-2 sm:gap-4 mt-8 sm:mt-12 mb-4">
              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-[1.5rem] border border-slate-200 dark:border-white/10 p-3 sm:p-5 shadow-sm flex flex-col items-center hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all cursor-default min-w-0">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <Target className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                   <span className="text-[16px] sm:text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-300 tracking-tight leading-none truncate">92%</span>
                 </div>
                 <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate w-full text-center">Confidence</span>
                 <div className="w-full h-1.5 bg-slate-200 dark:bg-black/40 rounded-full mt-2 sm:mt-3 overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-400 rounded-full"></motion.div>
                 </div>
              </div>
              
              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-[1.5rem] border border-slate-200 dark:border-white/10 p-3 sm:p-5 shadow-sm flex flex-col items-center hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:border-orange-200 dark:hover:border-orange-500/30 transition-all cursor-default min-w-0">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 shrink-0" />
                   <span className="text-[16px] sm:text-2xl lg:text-3xl font-black text-orange-600 dark:text-orange-300 tracking-tight leading-none truncate">12</span>
                 </div>
                 <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate w-full text-center">Streak</span>
                 <div className="w-full h-1.5 bg-slate-200 dark:bg-black/40 rounded-full mt-2 sm:mt-3 overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-400 rounded-full"></motion.div>
                 </div>
              </div>

              <div className="flex-1 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-[1.5rem] border border-slate-200 dark:border-white/10 p-3 sm:p-5 shadow-sm flex flex-col items-center hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all cursor-default min-w-0">
                 <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                   <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                   <span className="text-[16px] sm:text-2xl lg:text-3xl font-black text-indigo-600 dark:text-indigo-300 tracking-tight leading-none truncate">High</span>
                 </div>
                 <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 truncate w-full text-center">Focus</span>
                 <div className="w-full h-1.5 bg-slate-200 dark:bg-black/40 rounded-full mt-2 sm:mt-3 overflow-hidden shadow-inner">
                   <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 dark:from-indigo-600 dark:to-indigo-400 rounded-full"></motion.div>
                 </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-emerald-500/30 to-transparent my-4" />

          {/* =========================================================
              BOTTOM SECTION: INSIGHTS & ACTIONS
          ========================================================= */}
          <div className="flex flex-col justify-between flex-1 gap-3 sm:gap-4">
            
            {/* Top Insight Badge */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 dark:from-emerald-500/20 to-transparent" />
                <Rocket className="w-6 h-6 text-emerald-500 dark:text-emerald-400 relative z-10" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Coach Observation</span>
                <p className="text-[14px] font-bold text-slate-900 dark:text-white leading-snug">
                  {insights?.headline || "Welcome! Complete a speaking lesson to receive personalized AI coaching."}
                </p>
              </div>
            </div>

            {/* AI Direct Quote */}
            <div className="relative">
              <h5 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">AI Correction</h5>
              <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] p-6 border-l-[4px] border-emerald-500 relative overflow-hidden backdrop-blur-md shadow-sm hover:bg-slate-100 dark:hover:bg-emerald-500/10 transition-colors">
                <span className="absolute top-2 left-3 text-[80px] font-serif text-slate-200 dark:text-emerald-500/20 leading-none select-none">"</span>
                <p className="text-[15px] font-semibold text-slate-700 dark:text-slate-200 relative z-10 pl-4 leading-relaxed">
                  {isNewUser ? (
                    "I am currently analyzing your baseline metrics. Jump into a lesson to begin!"
                  ) : (
                    <>You often replace the <span className="font-bold text-emerald-600 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20 px-1.5 rounded border border-emerald-200 dark:border-emerald-500/30">TH</span> sound with T. Focus on placing your tongue between your teeth.</>
                  )}
                </p>
              </div>
            </div>

            {/* Recommended Drill Card */}
            <div className="relative mt-2">
              <h5 className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">Next Action</h5>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] p-5 border border-emerald-100 dark:border-emerald-500/30 flex items-center gap-5 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:border-emerald-200 dark:hover:border-emerald-400/50 transition-all group shadow-sm dark:shadow-[0_4px_20px_rgba(16,185,129,0.1)]">
                
                <div className="w-[72px] h-[72px] rounded-2xl bg-emerald-500 flex items-center justify-center relative overflow-hidden shrink-0 shadow-md dark:shadow-lg">
                   <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-emerald-400 dark:from-emerald-700 dark:to-emerald-400"></div>
                   {/* Waveform graphic */}
                   <div className="absolute inset-0 flex items-center justify-center gap-[3px] opacity-30 dark:opacity-40 mix-blend-overlay">
                     <div className="w-[3px] h-3 bg-white rounded-full animate-pulse"></div>
                     <div className="w-[3px] h-6 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                     <div className="w-[3px] h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                     <div className="w-[3px] h-8 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                     <div className="w-[3px] h-5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                   </div>
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center relative z-10 border border-white/40 group-hover:scale-110 group-hover:bg-white/30 transition-all">
                     <Play className="w-5 h-5 text-white ml-1 fill-white" />
                   </div>
                </div>
                
                <div className="flex flex-col flex-1 py-1">
                  <h6 className="text-[16px] font-black text-slate-900 dark:text-white mb-1.5 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                    {isNewUser ? "Diagnostic Lesson" : "TH Sound Mastery"}
                  </h6>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 fill-emerald-500 dark:fill-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">AI Recommended</span>
                  </div>
                  <p className="text-[12px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
                    <span>⏱ 5 min</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                    <span>{isNewUser ? "Assessment" : "Speaking Drill"}</span>
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/20 group-hover:border-emerald-200 dark:group-hover:border-emerald-500/40 transition-colors shadow-sm dark:shadow-none">
                  <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>

            {/* Weekly Milestone Progress */}
            <div className="relative mt-2">
              <div className="bg-slate-50 dark:bg-white/5 rounded-[1.5rem] p-5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-sm transition-all hover:bg-slate-100 dark:hover:bg-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-[12px] font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest">Weekly Milestone</span>
                  </div>
                  <span className="text-[12px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-500/20">3/5 Completed</span>
                </div>
                
                {/* Custom Segmented Progress Bar */}
                <div className="flex gap-2 w-full h-2.5">
                  <div className="flex-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                  <div className="flex-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                  <div className="flex-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"></div>
                  <div className="flex-1 rounded-full bg-slate-200 dark:bg-white/10"></div>
                  <div className="flex-1 rounded-full bg-slate-200 dark:bg-white/10"></div>
                </div>
                
                <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> Complete 2 more drills to unlock the Diamond Badge.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4 mt-auto">
              <button className="w-full sm:w-1/2 py-4 px-6 rounded-[1.5rem] bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-[14px] shadow-md dark:shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-lg dark:hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all hover:-translate-y-0.5">
                Chat with Nova
              </button>
              <button className="w-full sm:w-1/2 py-4 px-6 rounded-[1.5rem] bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black text-[14px] backdrop-blur-md transition-all shadow-sm dark:shadow-none hover:-translate-y-0.5">
                View Full Report
              </button>
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AiCoachInsightsCard;
