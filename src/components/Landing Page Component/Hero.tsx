import React from 'react';
import { motion } from 'framer-motion';
// import { Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Mic, Send, BarChart3, Globe, Zap } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-950 pt-24 pb-12 lg:pt-32 lg:pb-16 min-h-screen flex items-center">
      
      {/* Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 7s ease-in-out infinite 1s; }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>

      {/* Abstract Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[50rem] md:w-[80rem] h-[50rem] md:h-[80rem] bg-gradient-to-br from-emerald-100/40 to-teal-50/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 dark:from-emerald-900/20 dark:to-teal-900/10"></div>
        <div className="absolute bottom-0 left-0 w-[40rem] md:w-[60rem] h-[40rem] md:h-[60rem] bg-gradient-to-tr from-blue-100/40 to-emerald-50/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 dark:from-blue-900/20 dark:to-emerald-900/10"></div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left pt-10 lg:pt-0"
          >
            <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
              <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">New: Voice Analysis Engine 2.0</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 text-slate-900 dark:text-white leading-[1.1]">
              Speak English <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                Fearlessly.
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Your AI tutor sits in your pocket, ready to chat 24/7. Get instant feedback on pronunciation, grammar, and vocabulary as you speak.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center lg:justify-start">
              <Button size="lg" className="h-12 md:h-14 px-8 rounded-full bg-slate-900 dark:bg-emerald-600 text-white hover:bg-slate-800 dark:hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all text-base w-full sm:w-auto" asChild>
                <a href="/signup">
                  Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="h-12 md:h-14 px-8 rounded-full border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-slate-800 text-slate-900 dark:text-white text-base w-full sm:w-auto" asChild>
                <a href="#demo">Watch Demo</a>
              </Button>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-950 bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" className="w-full h-full" />
                  </div>
                ))}
              </div>
              <p>Trusted by 50,000+ learners</p>
            </div>
          </motion.div>

          {/* Right Column: Phone Mockup with Chat Interface */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end mt-12 lg:mt-0"
          >
            {/* Scale Wrapper for Mobile: Scales down the phone on small screens to prevent overflow */}
            <div className="transform scale-[0.85] sm:scale-100 origin-top lg:origin-center transition-transform duration-300">
              
              {/* Glow Effect behind phone */}
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full transform scale-75"></div>

              {/* --- Mobile Phone Frame --- */}
              <div className="relative w-[320px] h-[660px] bg-slate-950 rounded-[3rem] border-[6px] border-slate-900 shadow-2xl overflow-hidden z-20 mx-auto">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-xl z-30"></div>

                {/* Status Bar Area */}
                <div className="w-full h-12 bg-white dark:bg-slate-900 flex items-center justify-between px-6 pt-2 z-20 relative border-b border-slate-100 dark:border-slate-800">
                   <div className="text-xs font-bold text-slate-900 dark:text-white">9:41</div>
                   <div className="flex gap-1.5">
                     <div className="w-4 h-2.5 bg-slate-900 dark:bg-white rounded-[1px]"></div>
                     <div className="w-4 h-2.5 bg-slate-900 dark:bg-white rounded-[1px]"></div>
                   </div>
                </div>

                {/* Chat Interface Content */}
                <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 pb-8">
                  
                  {/* Chat Header */}
                  <div className="px-5 py-3 bg-white dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
                          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="AI" className="w-8 h-8" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-slate-900 dark:text-white">AI Tutor</h3>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Online • Reply in 1s</p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    <div className="text-center text-xs text-slate-400 font-medium my-4">Today, 9:41 AM</div>

                    {/* AI Message */}
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="AI" className="w-5 h-5" />
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-sm text-slate-700 dark:text-slate-300">Hi Alex! Ready to practice your job interview skills today? 👔</p>
                      </div>
                    </div>

                    {/* User Message */}
                    <div className="flex flex-col items-end gap-1">
                      <div className="bg-emerald-600 text-white p-3.5 rounded-2xl rounded-tr-none shadow-md max-w-[85%]">
                        <p className="text-sm">Yes, I'm a bit nervous. I want to talk about my leadership skill.</p>
                      </div>
                      {/* Small Correction Indicator */}
                      <div className="flex items-center gap-1 mr-1">
                        <Zap className="w-3 h-3 text-amber-400 fill-current" />
                        <span className="text-[10px] text-slate-500">Suggestion available</span>
                      </div>
                    </div>

                    {/* AI Response (Correction) */}
                    <div className="flex gap-3 max-w-[90%]">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                         <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix" alt="AI" className="w-5 h-5" />
                      </div>
                      <div className="space-y-2">
                         <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800">
                            <p className="text-sm text-slate-700 dark:text-slate-300">No need to be nervous! Here's a quick tip:</p>
                         </div>
                         {/* Correction Card embedded in chat */}
                         <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Better phrasing:</p>
                            <div className="flex items-center gap-2">
                               <span className="text-xs line-through text-red-400">leadership skill</span>
                               <ArrowRight className="w-3 h-3 text-slate-400" />
                               <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">leadership skills</span>
                            </div>
                         </div>
                      </div>
                    </div>
                    
                    {/* Active Typing Indicator */}
                    <div className="flex gap-2 ml-11">
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></div>
                    </div>

                  </div>

                  {/* Input Area */}
                  <div className="px-4 pb-6 pt-2 bg-slate-50 dark:bg-slate-950">
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 cursor-pointer hover:bg-emerald-200 transition-colors">
                        <Mic className="w-4 h-4" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Type a message..." 
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-800 dark:text-white placeholder:text-slate-400 px-2"
                        disabled
                      />
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white cursor-pointer hover:bg-emerald-700 transition-colors">
                        <Send className="w-4 h-4 ml-0.5" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* --- Floating Analytic Cards (Around the Phone) --- */}
              {/* Adjusted negative margins and positions for mobile response */}
              
              {/* Card 1: Fluency Score (Top Left) */}
              <div className="absolute top-[10%] -left-4 md:-left-24 bg-white dark:bg-slate-800 p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-float z-30 max-w-[140px] md:max-w-[160px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">92/100</span>
                </div>
                <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Fluency Score</p>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden">
                  <div className="w-[92%] h-full bg-blue-500 rounded-full"></div>
                </div>
              </div>

              {/* Card 2: Active User (Bottom Right) */}
              <div className="absolute bottom-[20%] -right-2 md:-right-16 bg-white dark:bg-slate-800 p-3 pr-4 md:pr-5 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 animate-float-delayed z-30 flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                    <Globe className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  {/* Pulse Ring Animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-pulse-ring"></div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">Real-time</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Translation Active</p>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;