import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export default function DashboardHero({ user, greeting }: { user?: any, greeting?: string }) {
  // We use the same theme/container from AnalyticHero but keep the original Dashboard content!

  return (
    <div className="w-full pb-8 flex items-center justify-center font-sans text-slate-900 dark:text-white selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">

      {/* Main Container matching Analytics style - Removed overflow-hidden so the dashboard image can bleed out! */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1440px] bg-gradient-to-br from-[#F3FAF7] via-[#F9FDFB] to-white dark:bg-[#050C14] dark:bg-none rounded-[2.5rem] border border-emerald-500/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_-20px_rgba(16,185,129,0.15)] relative mx-auto transition-all duration-500"
      >
        {/* Subtle Background Glows matching Analytics */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="py-8 px-4 sm:px-8 md:py-12 md:px-10 lg:py-16 lg:px-12 flex flex-col md:flex-row gap-6 lg:gap-4 xl:gap-8 items-center relative z-10">

          {/* =========================================================
              LEFT COLUMN: ORIGINAL DASHBOARD CONTENT
          ========================================================= */}
          <div className="w-full md:w-[50%] lg:w-[45%] flex flex-col gap-6 relative z-20">

            {/* Live Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 bg-white dark:bg-[#050C14] border border-slate-200/80 dark:border-emerald-500/20 rounded-full px-1.5 py-1.5 pr-4 w-fit shadow-[0_2px_8px_rgba(16,185,129,0.1)]"
            >
              <div className="bg-teal-50 dark:bg-emerald-500/10 p-1.5 rounded-full border border-teal-100 dark:border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-emerald-400" />
              </div>
              <span className="text-[11px] font-extrabold tracking-[0.15em] text-slate-700 dark:text-slate-300 uppercase">Fluency Engine v2.0 Live</span>
            </motion.div>

            {/* Headline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}>
              <h1 className="text-[42px] sm:text-[56px] lg:text-[64px] xl:text-[72px] font-[900] tracking-tight leading-[1.05] text-slate-900 dark:text-white">
                Learn English.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                  Speak with AI.
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}>
              <div className="relative pl-5 border-l-[3px] border-emerald-400">
                <p className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-[460px]">
                  Immerse yourself in real-time AI conversations, exact pronunciation analysis, and dynamic roleplay. Your hyper-intelligent language tutor is ready 24/7.
                </p>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button className="justify-center bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-[#050C14] px-8 py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center gap-2 transition-all shadow-[0_10px_30px_rgba(15,23,42,0.15)] dark:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:-translate-y-0.5">
                Start Practicing Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="justify-center bg-white dark:bg-[#050C14] hover:bg-slate-50 dark:hover:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-[1.25rem] font-bold text-[15px] flex items-center gap-3 transition-all shadow-sm hover:-translate-y-0.5">
                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-emerald-500/20 flex items-center justify-center border border-slate-200 dark:border-emerald-500/30">
                  <Play className="w-3 h-3 text-slate-600 dark:text-emerald-400 fill-current ml-0.5" />
                </div>
                See How It Works
              </button>
            </motion.div>

          </div>

          {/* =========================================================
              RIGHT COLUMN: DASHBOARD IMAGE
          ========================================================= */}
          <div className="w-full md:w-[50%] lg:w-[55%] relative min-h-[350px] mt-2 sm:mt-4 md:mt-0 overflow-visible">
            <motion.div
              initial={{ opacity: 0, x: 50, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="absolute top-0 right-[calc(-40%+5px)] sm:right-[-25%] md:right-[-15%] lg:right-[-20%] w-[130%] sm:w-[110%] md:w-[110%] lg:w-[130%] xl:w-[140%] z-10 perspective-1000 pointer-events-none"
            >
              <div className="w-full">
                <img
                  src="/dashboard.png"
                  alt="Dashboard Overview"
                  loading="lazy"
                  decoding="async"
                  className="w-full max-w-none h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
                />
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}