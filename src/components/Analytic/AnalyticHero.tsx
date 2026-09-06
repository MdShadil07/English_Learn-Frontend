import React from 'react';
import { motion } from 'framer-motion';
import {
  Info, Sparkles, Book, Star, BookOpen, Target, Award,
  Medal, Mic
} from 'lucide-react';

export default function AnalyticsHero({ user = { fullName: 'Learner' } }: { user?: any }) {
  const firstName = user?.fullName?.split(' ')[0] || 'Learner';

  return (
    <div className="w-full pb-8 flex items-center justify-center font-sans text-slate-900 dark:text-white selection:bg-emerald-500/30 selection:text-emerald-900 dark:selection:text-emerald-100">

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[1440px] bg-gradient-to-br from-[#F3FAF7] via-[#F9FDFB] to-white dark:bg-[#050C14] dark:bg-none rounded-[2.5rem] border border-emerald-500/10 dark:border-emerald-500/20 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_10px_30px_-20px_rgba(16,185,129,0.15)] overflow-hidden relative mx-auto transition-all duration-500"
      >
        {/* Subtle Background Glows */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[50%] bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="py-6 px-4 sm:px-8 md:py-10 md:px-10 lg:py-10 lg:px-12 flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-4 xl:gap-8 items-stretch relative z-10">

          {/* =========================================================
              LEFT COLUMN: GREETING & MOTIVATION
          ========================================================= */}
          <div className="w-full lg:w-[30%] xl:w-[28%] flex flex-col justify-start lg:pt-6 relative z-20 order-1 lg:order-1 text-left items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-start w-full"
            >
              {/* Active Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 mb-4 sm:mb-6 shadow-[0_2px_8px_rgba(16,185,129,0.1)] w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">Learning Active</span>
              </div>

              {/* Greeting */}
              <h1 className="text-[32px] sm:text-[36px] lg:text-[42px] xl:text-[48px] font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-4 sm:mb-6">
                Good evening,<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                  {firstName}.
                </span>
              </h1>

              {/* Motivation Text */}
              <p className="text-[13px] sm:text-[15px] font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-[320px] sm:max-w-md lg:max-w-[95%] mb-6 sm:mb-8 text-left">
                Your hard work is paying off. You're ahead of <span className="font-bold text-emerald-600 dark:text-emerald-400">81%</span> of learners this week. Keep up the momentum to reach your fluency goal by next month!
              </p>

              {/* CTA Button */}
              <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-900 dark:bg-emerald-600 text-white dark:text-white rounded-xl sm:rounded-2xl font-bold text-[14px] sm:text-[15px] hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] dark:hover:bg-emerald-500 dark:hover:shadow-[0_12px_24px_rgba(16,185,129,0.2)] transition-all w-fit">
                Continue Learning <span className="text-lg sm:text-xl leading-none">→</span>
              </button>
            </motion.div>
          </div>

          {/* =========================================================
              CENTER COLUMN: AVATAR & SPEECH BUBBLE
          ========================================================= */}
          <div className="w-full lg:w-[35%] xl:w-[36%] flex items-end justify-center relative min-h-[200px] sm:min-h-[320px] lg:min-h-[400px] order-2 lg:order-2 mt-8 lg:mt-0">

            {/* The Avatar */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full w-full lg:translate-x-4 xl:translate-x-8">

              {/* Premium Animated Backdrop Ring */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 sm:bottom-10 w-[180px] sm:w-[280px] h-[180px] sm:h-[280px] bg-gradient-to-tr from-emerald-400/40 to-teal-300/40 dark:from-emerald-500/30 dark:to-teal-400/30 rounded-full blur-[30px] sm:blur-[40px] z-0"
              />

              {/* Floating Geometric Orbs for Premium Look */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[5%] w-8 h-8 sm:w-14 sm:h-14 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full blur-[1px] opacity-90 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-20 border border-white/40"
              />
              <motion.div
                animate={{ y: [15, -15, 15], rotate: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[40%] right-[-5%] w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full blur-[1px] opacity-80 shadow-[0_0_20px_rgba(96,165,250,0.6)] z-20 border border-white/40"
              />
              <motion.div
                animate={{ y: [-8, 8, -8], scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                className="absolute bottom-[20%] left-[10%] w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-rose-300 to-pink-500 rounded-full blur-[1px] opacity-80 shadow-[0_0_15px_rgba(244,63,94,0.5)] z-20"
              />

              <motion.div
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative w-full max-w-[240px] sm:max-w-[340px] h-[220px] sm:h-[400px] lg:w-[400px] lg:h-[480px] flex items-end justify-center z-10 mx-auto"
              >
                {/* 3D Boy Image */}
                <img
                  src="/boy.png"
                  alt="AI Coach"
                  className="absolute bottom-0 translate-y-4 lg:translate-y-8 w-[100%] lg:w-[105%] h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] sm:drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
                  style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                />
              </motion.div>
            </div>



            {/* Decorative Sparkles */}
            <Sparkles className="absolute top-[10%] left-[10%] w-6 h-6 text-yellow-400 opacity-80 fill-current animate-pulse" />
            <Sparkles className="absolute top-[50%] right-[0%] w-5 h-5 text-[#15B77E] opacity-40 fill-current animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {/* =========================================================
              RIGHT COLUMN: JOURNEY & ACHIEVEMENT
          ========================================================= */}
          <div className="w-full lg:w-[35%] xl:w-[36%] flex flex-col justify-between pt-2 lg:items-end order-3 lg:order-3 mt-8 lg:mt-0">
            <div className="w-full xl:max-w-[420px] h-full flex flex-col justify-between">
              {/* Journey Section */}
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center justify-between mb-4 sm:mb-8">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 dark:text-white">Your English Journey</h3>
                    <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 hidden sm:block" />
                  </div>
                  <a href="#" className="text-[12px] sm:text-[13px] font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors">
                    View Roadmap <span className="text-[14px] sm:text-[15px] leading-none mb-[2px]">›</span>
                  </a>
                </div>

                {/* Custom Stepper Component - PREMIUM EDITION */}
                <div className="relative w-full bg-white/40 dark:bg-[#050C14]/80 backdrop-blur-md rounded-[20px] lg:rounded-3xl p-3 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/60 dark:border-emerald-500/20 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:hover:border-emerald-500/40 group overflow-hidden">
                  <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] px-1">
                    <div className="w-full min-w-full sm:min-w-[340px] relative mt-2 pb-2 sm:pb-4 flex justify-between">
                      {/* Background Line */}
                      <div className="absolute top-[16px] sm:top-[20px] left-[10px] sm:left-[20px] right-[10px] sm:right-[20px] h-[3px] bg-slate-200/80 dark:bg-slate-700/80 rounded-full z-0"></div>

                      {/* Active Progress Line */}
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '50%' }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                        className="absolute top-[16px] sm:top-[20px] left-[10px] sm:left-[20px] h-[3px] bg-gradient-to-r from-emerald-400 to-teal-500 z-0 shadow-[0_0_12px_rgba(52,211,153,0.6)] rounded-full"
                      />

                      {/* Steps */}
                      <div className="flex justify-between w-full relative z-10">

                        {/* Step 1: A1 */}
                        <motion.div whileHover={{ y: -4, scale: 1.05 }} className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group/step">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#050C14] border-2 border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shadow-sm relative transition-all group-hover/step:shadow-md group-hover/step:border-emerald-200 dark:group-hover/step:border-emerald-500/40">
                            <div className="absolute top-[-4px] right-[-4px] w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] bg-white dark:bg-[#050C14] rounded-full flex items-center justify-center shadow-sm">
                              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-rose-400 rounded-full text-[6px] sm:text-[8px] text-white flex items-center justify-center font-bold shadow-[0_0_8px_rgba(251,113,133,0.5)]">✓</div>
                            </div>
                            <Book className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-500 transition-colors" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] sm:text-[12px] font-bold text-slate-700 dark:text-slate-200 group-hover/step:text-emerald-600 dark:group-hover/step:text-emerald-400 transition-colors">A1</div>
                            <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Beginner</div>
                          </div>
                        </motion.div>

                        {/* Step 2: A2 */}
                        <motion.div whileHover={{ y: -4, scale: 1.05 }} className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group/step">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#050C14] border-2 border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center shadow-sm relative transition-all group-hover/step:shadow-md group-hover/step:border-emerald-200 dark:group-hover/step:border-emerald-500/40">
                            <div className="absolute top-[-4px] right-[-4px] w-[14px] h-[14px] sm:w-[18px] sm:h-[18px] bg-white dark:bg-[#050C14] rounded-full flex items-center justify-center shadow-sm">
                              <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-amber-400 rounded-full text-[6px] sm:text-[8px] text-white flex items-center justify-center font-bold shadow-[0_0_8px_rgba(251,191,36,0.5)]">✓</div>
                            </div>
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-500 transition-colors" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] sm:text-[12px] font-bold text-slate-700 dark:text-slate-200 group-hover/step:text-emerald-600 dark:group-hover/step:text-emerald-400 transition-colors">A2</div>
                            <div className="text-[9px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Elementary</div>
                          </div>
                        </motion.div>

                        {/* Step 3: B1 (Active) */}
                        <motion.div whileHover={{ y: -4, scale: 1.05 }} className="flex flex-col items-center gap-1 sm:gap-2 relative cursor-pointer group/step">
                          {/* Pulse Ring */}
                          <div className="absolute top-[-4px] sm:top-[-6px] w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] rounded-full bg-emerald-400/20 dark:bg-emerald-500/20 animate-ping" style={{ animationDuration: '3s' }}></div>

                          <div className="w-[40px] h-[40px] sm:w-[52px] sm:h-[52px] rounded-full bg-white dark:bg-[#050C14] border-[2px] sm:border-[3px] border-emerald-500 flex items-center justify-center shadow-[0_8px_24px_rgba(52,211,153,0.4)] relative -top-1 sm:-top-1.5 transition-all group-hover/step:shadow-[0_12px_30px_rgba(52,211,153,0.6)]">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-emerald-50 dark:bg-emerald-500/20 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100 to-transparent dark:from-emerald-900/40 opacity-50"></div>
                              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 fill-current relative z-10" />
                            </div>
                          </div>
                          <div className="text-center absolute top-[44px] sm:top-[60px] whitespace-nowrap">
                            <div className="text-[12px] sm:text-[14px] font-extrabold text-slate-900 dark:text-white tracking-tight">B1</div>
                            <div className="text-[10px] sm:text-[12px] text-slate-600 dark:text-slate-400 font-medium mb-1.5 sm:mb-2.5 hidden sm:block">Intermediate</div>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.8 }}
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full shadow-[0_4px_12px_rgba(20,184,166,0.3)] tracking-wide uppercase"
                            >
                              You are here
                            </motion.div>
                          </div>
                        </motion.div>

                        {/* Step 4: B2 */}
                        <motion.div whileHover={{ y: -4, scale: 1.05 }} className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group/step opacity-60 hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#050C14] border-2 border-slate-200 dark:border-emerald-500/20 flex items-center justify-center shadow-sm transition-all group-hover/step:border-slate-300 dark:group-hover/step:border-emerald-500/40">
                            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] sm:text-[12px] font-bold text-slate-500 dark:text-slate-400 group-hover/step:text-slate-700 dark:group-hover/step:text-slate-200 transition-colors">B2</div>
                            <div className="text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight hidden sm:block">Upper<br />Intermediate</div>
                          </div>
                        </motion.div>

                        {/* Step 5: C1 */}
                        <motion.div whileHover={{ y: -4, scale: 1.05 }} className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group/step opacity-60 hover:opacity-100 transition-opacity">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-[#050C14] border-2 border-slate-200 dark:border-emerald-500/20 flex items-center justify-center shadow-sm transition-all group-hover/step:border-slate-300 dark:group-hover/step:border-emerald-500/40">
                            <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 dark:text-slate-500" />
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] sm:text-[12px] font-bold text-slate-500 dark:text-slate-400 group-hover/step:text-slate-700 dark:group-hover/step:text-slate-200 transition-colors">C1</div>
                            <div className="text-[9px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block">Advanced</div>
                          </div>
                        </motion.div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Achievement Card */}
              <div className="bg-white/80 dark:bg-[#050C14] rounded-[20px] lg:rounded-[24px] p-4 sm:p-5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-emerald-500/20 mt-6 lg:mt-auto transition-colors">
                <div className="flex items-center gap-1.5 mb-3 sm:mb-4">
                  <span className="text-[12px] sm:text-[13px] font-bold text-slate-700 dark:text-slate-300">Next Achievement</span>
                  <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>

                <div className="flex items-center gap-3 sm:gap-5">

                  {/* Left Icon (Gold Medal Ribbon) */}
                  <div className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex-shrink-0 relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full blur-md opacity-60"></div>
                    <Medal className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-current relative z-10 drop-shadow-sm" />
                    {/* Ribbons */}
                    <div className="absolute -bottom-1 w-full flex justify-center gap-1">
                      <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-red-500 transform rotate-12 origin-top rounded-b-sm"></div>
                      <div className="w-1 h-2 sm:w-1.5 sm:h-3 bg-red-500 transform -rotate-12 origin-top rounded-b-sm"></div>
                    </div>
                  </div>

                  {/* Center Content */}
                  <div className="flex-1 w-full">
                    <h4 className="text-[15px] font-bold text-slate-800 dark:text-white mb-0.5">Pronunciation Expert</h4>
                    <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 mb-3">3 sessions remaining</p>

                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '82%' }}
                          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                        />
                      </div>
                      <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300">82%</span>
                    </div>
                  </div>

                  {/* Right Badge (Purple Hexagon) */}
                  <div className="hidden sm:flex w-[60px] h-[60px] flex-shrink-0 relative items-center justify-center ml-2">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-[12px] opacity-40"></div>

                    {/* CSS Hexagon Approximation */}
                    <div className="relative w-12 h-14 bg-gradient-to-b from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg"
                      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <div className="absolute inset-[2px] bg-gradient-to-b from-purple-600 to-indigo-700 z-0"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
                      <div className="absolute inset-[4px] border border-purple-400/30 z-10"
                        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>

                      <Mic className="w-5 h-5 text-white relative z-20" />
                    </div>

                    {/* Hexagon gold border points */}
                    <div className="absolute top-0 right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                    <div className="absolute bottom-0 left-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm"></div>
                    <div className="absolute top-1/2 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-sm transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 -right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-sm transform -translate-y-1/2"></div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Global Animation Keyframes defined inline for convenience */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes wave {
          0% { transform: rotate( 0.0deg) }
          10% { transform: rotate(14.0deg) }  
          20% { transform: rotate(-8.0deg) }
          30% { transform: rotate(14.0deg) }
          40% { transform: rotate(-4.0deg) }
          50% { transform: rotate(10.0deg) }
          60% { transform: rotate( 0.0deg) }
          100% { transform: rotate( 0.0deg) }
        }
        .animate-wave {
          display: inline-block;
          animation: wave 2.5s infinite;
        }
      `}} />
    </div>
  );
}