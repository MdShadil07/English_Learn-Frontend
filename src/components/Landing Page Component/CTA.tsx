import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, CheckCircle2, Trophy, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTA = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-transparent flex items-center justify-center min-h-[auto] lg:min-h-[800px] transition-colors duration-500 ease-in-out font-sans">
      
      {/* --- Optimized Background Effects (No Heavy Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Dotted Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        
        {/* Hardware-Accelerated Gradients */}
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(52,211,153,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(45,212,191,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-8 lg:px-12 relative z-20">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* --- Left Column: Compelling Copy & Benefits --- */}
          <div className="text-center lg:text-left relative z-10 order-1">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* Headline */}
              <h2 className="text-5xl sm:text-6xl lg:text-[4.5rem] font-extrabold text-[#0f172a] dark:text-white mb-6 leading-[1.05] tracking-tight transition-colors duration-500">
                Write Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2 block">
                  Success Story.
                </span>
              </h2>

              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-[480px] mx-auto lg:mx-0 font-medium transition-colors duration-500">
                Experience the fastest way to fluency. Our AI adapts to your personal goals, giving you the confidence to speak from day one.
              </p>

              {/* Micro Benefits Grid */}
              <div className="flex flex-col gap-4 mb-10 max-w-md mx-auto lg:mx-0">
                {[
                  { icon: Target, title: "Hyper-Personalized", desc: "AI adapts to your career & interests" },
                  { icon: Zap, title: "3x Faster Fluency", desc: "Proven methodology for rapid growth" },
                  { icon: Users, title: "Real Connections", desc: "Practice with a global community" }
                ].map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                    className="flex items-center gap-4 bg-white/60 dark:bg-[#050C14]/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/60 dark:border-emerald-500/10 shadow-sm hover:border-teal-200 dark:hover:border-emerald-500/30 hover:bg-white dark:hover:bg-[#050C14]/80 transition-all text-left group"
                  >
                    <div className="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#0f172a] dark:text-white text-[15px]">{item.title}</h4>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full max-w-md mx-auto lg:mx-0">
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="relative w-full h-14 px-8 rounded-full text-base font-bold bg-[#0f172a] dark:bg-emerald-500 text-white hover:bg-black dark:hover:bg-emerald-400 shadow-xl shadow-slate-900/10 dark:shadow-emerald-900/20 transition-all hover:-translate-y-1 border-0 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Your Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                  </Button>
                </Link>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto h-14 px-8 rounded-full text-base font-bold border-slate-200 dark:border-emerald-500/20 bg-white dark:bg-[#050C14] text-[#0f172a] dark:text-white hover:bg-slate-50 dark:hover:bg-[#050C14]/80 shadow-sm transition-all hover:-translate-y-1"
                  onClick={() => {
                    document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  View Success Stories
                </Button>
              </div>
              
              {/* Mini Social Proof */}
              <div className="mt-8 text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-3">
                   {[1, 2, 3].map((i) => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-[#050C14] bg-slate-200 dark:bg-[#050C14] overflow-hidden shadow-sm">
                        <img src="/mine.png" alt="user" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <p className="font-medium">Rated <span className="font-extrabold text-[#0f172a] dark:text-white">4.9/5</span> by users like you</p>
              </div>

            </motion.div>
          </div>

          {/* --- Right Column: 3D Success Graphic --- */}
          <div className="relative h-[550px] md:h-[650px] flex items-center justify-center order-2 mt-8 lg:mt-0" style={{ perspective: '1200px' }}>
             
             {/* Hardware-accelerated scaling wrapper for mobile */}
             <div className="transform scale-[0.85] sm:scale-95 lg:scale-100 transition-transform duration-300 origin-center relative z-20">
               
               {/* Decorative Back Card (Shadow illusion) */}
               <div className="absolute top-6 left-12 w-[340px] md:w-[380px] h-[540px] bg-teal-100/50 dark:bg-teal-900/20 rounded-[2.5rem] border border-teal-200/50 dark:border-teal-800/30 z-10 transform rotate-[6deg] opacity-70"></div>
               
               {/* Main Floating 3D Card */}
               <motion.div 
                 className="relative w-[340px] md:w-[380px] h-[560px] bg-white/95 dark:bg-[#050C14]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_30px_60px_-20px_rgba(20,184,166,0.15),0_20px_40px_-20px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_15px_rgba(16,185,129,0.05)] border border-white/60 dark:border-emerald-500/20 z-20 flex flex-col p-3 transition-colors duration-500 overflow-hidden"
                 initial={{ rotateY: -15, rotateX: 5, y: 30, opacity: 0 }}
                 whileInView={{ rotateY: -8, rotateX: 2, y: 0, opacity: 1 }}
                 transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
                 whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.4 } }}
               >
                 
                 {/* Holographic Glare Effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 dark:from-white/0 dark:via-white/10 dark:to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none transform -translate-x-full hover:translate-x-full ease-out"></div>

                 {/* Large Rectangular Aesthetic Avatar */}
                 <div className="w-full h-[280px] rounded-[2rem] overflow-hidden relative shadow-inner group cursor-pointer border border-slate-100/50 dark:border-slate-800/50">
                    <img 
                      src="/mine.png" 
                      alt="Md Shadil" 
                      className="w-full h-full object-cover object-top transform transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: 'center 20%' }}
                    />
                    {/* Premium Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/20 to-transparent opacity-80 dark:opacity-90 pointer-events-none"></div>
                    
                    {/* Integrated Profile Info */}
                    <div className="absolute bottom-5 left-6 right-5 flex justify-between items-end">
                       <div>
                          <h3 className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">Md Shadil</h3>
                          <p className="text-teal-300 text-[13px] font-bold mt-1 uppercase tracking-wider drop-shadow-sm">Student - Galgotias University</p>
                       </div>
                       <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-lg">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                       </div>
                    </div>
                 </div>

                 {/* Card Body */}
                 <div className="pt-6 pb-3 px-4 text-center flex-1 flex flex-col relative z-10">
                    
                    {/* Achievement Badges */}
                    <div className="flex justify-center gap-3 mb-6">
                       <span className="bg-slate-100 dark:bg-[#050C14] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors">
                          <Trophy className="w-4 h-4 text-amber-500" /> Top 1% Earner
                       </span>
                       <span className="bg-slate-100 dark:bg-[#050C14] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-colors">
                          <Target className="w-4 h-4 text-blue-500" /> C1 Advanced
                       </span>
                    </div>

                    {/* Styled Growth Graph */}
                    <div className="bg-slate-50 dark:bg-[#050C14]/80 rounded-2xl p-5 border border-slate-100 dark:border-emerald-500/10 mt-auto shadow-[inset_0_0_10px_rgba(16,185,129,0.02)] transition-colors">
                       <div className="flex justify-between items-end h-[72px] gap-2.5">
                          {[30, 45, 40, 60, 55, 75, 95].map((h, i) => (
                            <motion.div 
                              key={i}
                              className="w-full bg-slate-200 dark:bg-[#050C14] border dark:border-emerald-500/10 rounded-full relative group overflow-hidden transition-colors"
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: 0.5 + (i * 0.08), ease: "easeOut" }}
                            >
                               {i === 6 && (
                                  <div className="absolute inset-0 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                                     <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-[#050C14] rounded-full border-2 border-emerald-400"></div>
                                  </div>
                               )}
                               {i !== 6 && (
                                  <div className="absolute inset-0 bg-teal-100 dark:bg-teal-900/40 rounded-full transition-colors"></div>
                               )}
                            </motion.div>
                          ))}
                       </div>
                       <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 font-bold uppercase tracking-widest">3 Month Fluency Progress</div>
                    </div>
                 </div>
               </motion.div>
             </div>

          </div>

        </div>
      </div>
      
      {/* Global CSS for shimmer effect */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </section>
  );
};

export default CTA;