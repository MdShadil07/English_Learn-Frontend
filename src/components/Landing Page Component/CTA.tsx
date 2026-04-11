import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Star, Zap, CheckCircle2, Trophy, Target, Users } from 'lucide-react';

const CTA = () => {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden bg-slate-50 flex items-center justify-center min-h-[auto] lg:min-h-[700px]">
      
      {/* --- Dynamic Background (Light Mode) --- */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-slate-100"></div>
        
        {/* Animated Gradient Orbs */}
        <motion.div 
          className="absolute top-[-10%] right-[-10%] w-[20rem] md:w-[50rem] h-[20rem] md:h-[50rem] bg-emerald-200/40 rounded-full blur-[60px] md:blur-[100px]"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-[-10%] left-[-10%] w-[20rem] md:w-[50rem] h-[20rem] md:h-[50rem] bg-blue-200/40 rounded-full blur-[60px] md:blur-[100px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-multiply"></div>
      </div>

      {/* --- "Smoke" Fade Effect from Top --- */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-slate-50 via-slate-50/50 to-transparent z-10 pointer-events-none"></div>

      <div className="container px-4 mx-auto relative z-20">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* --- Left Column: Compelling Copy & Benefits --- */}
            <div className="text-center lg:text-left relative z-10 order-1">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6 md:mb-8">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] md:text-xs font-bold tracking-wide uppercase text-slate-600">
                    Join 2 Million+ Learners
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-4 md:mb-6 leading-[1.1] tracking-tight">
                  Write Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600">
                    Success Story.
                  </span>
                </h2>

                <p className="text-base md:text-lg text-slate-600 mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Experience the fastest way to fluency. Our AI adapts to your personal goals, giving you the confidence to speak from day one.
                </p>

                {/* Why This Platform? - Micro Benefits */}
                <div className="flex flex-col gap-3 md:gap-4 mb-8 md:mb-10">
                  {[
                    { icon: Target, title: "Hyper-Personalized", desc: "AI adapts to your career & interests" },
                    { icon: Zap, title: "3x Faster Fluency", desc: "Proven methodology for rapid growth" },
                    { icon: Users, title: "Real Connections", desc: "Practice with a global community" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 md:gap-4 bg-white/60 backdrop-blur-sm p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl flex-shrink-0">
                        <item.icon className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start w-full">
                  <Button 
                    size="lg" 
                    className="relative w-full sm:w-auto h-12 md:h-14 px-8 rounded-full text-base font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-emerald-900/10 overflow-hidden transition-all hover:scale-[1.02] active:scale-95 border-0 group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Start Your Free Trial <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="w-full sm:w-auto h-12 md:h-14 px-8 rounded-full text-base font-bold border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                  >
                    View Success Stories
                  </Button>
                </div>
                
                <div className="mt-6 text-xs md:text-sm text-slate-500 flex items-center justify-center lg:justify-start gap-2">
                  <div className="flex -space-x-2 mr-2">
                     {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+30}`} alt="user" />
                        </div>
                     ))}
                  </div>
                  <p>Rated <span className="font-bold text-slate-900">4.9/5</span> by users like you</p>
                </div>

              </motion.div>
            </div>

            {/* --- Right Column: 3D Success Graphic --- */}
            {/* Visible on mobile, but scaled down */}
            <div className="relative h-[450px] md:h-[600px] flex items-center justify-center perspective-1000 order-2 mt-8 lg:mt-0">
               
               {/* Mobile Scale Wrapper */}
               <div className="transform scale-[0.75] sm:scale-[0.85] md:scale-100 transition-transform duration-300 origin-center">
                 
                 {/* Floating 3D Card Container */}
                 <motion.div 
                   className="relative w-[340px] h-[500px] bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] border border-white/50 z-20 flex flex-col overflow-hidden"
                   initial={{ rotateY: -15, rotateX: 5, y: 20, opacity: 0 }}
                   whileInView={{ rotateY: -10, rotateX: 5, y: 0, opacity: 1 }}
                   transition={{ duration: 1, type: "spring" }}
                   whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.4 } }}
                 >
                    {/* Card Header Image */}
                    <div className="h-32 bg-gradient-to-br from-emerald-400 to-teal-500 relative">
                       <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                          <div className="w-24 h-24 rounded-full border-4 border-white bg-white p-1 shadow-lg">
                             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=c0aede" alt="User" className="w-full h-full rounded-full" />
                          </div>
                       </div>
                    </div>

                    {/* Card Body */}
                    <div className="pt-12 pb-8 px-6 text-center flex-1 flex flex-col">
                       <h3 className="text-2xl font-bold text-slate-900">Sarah Jenkins</h3>
                       <p className="text-slate-500 text-sm mb-6">Marketing Director</p>

                       {/* Achievement Badges */}
                       <div className="flex justify-center gap-2 mb-6">
                          <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                             <Trophy className="w-3 h-3" /> Top 1%
                          </span>
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                             <CheckCircle2 className="w-3 h-3" /> C1 Fluent
                          </span>
                       </div>

                       {/* Growth Graph */}
                       <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mt-auto">
                          <div className="flex justify-between items-end h-16 gap-2">
                             {[30, 45, 40, 60, 55, 75, 90].map((h, i) => (
                                <motion.div 
                                  key={i}
                                  className="w-full bg-emerald-200 rounded-t-sm"
                                  initial={{ height: 0 }}
                                  whileInView={{ height: `${h}%` }}
                                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                >
                                   {i === 6 && (
                                      <div className="w-full h-full bg-emerald-500 relative">
                                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1.5 py-0.5 rounded">
                                            Now
                                         </div>
                                      </div>
                                   )}
                                </motion.div>
                             ))}
                          </div>
                          <div className="text-xs text-slate-400 mt-2 font-medium">3 Month Progress</div>
                       </div>
                    </div>
                 </motion.div>

                 {/* Floating Elements Behind/Around */}
                 <motion.div 
                   className="absolute top-20 right-10 w-20 h-20 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center z-30"
                   animate={{ y: [0, -15, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <Zap className="w-10 h-10 text-amber-400 fill-current" />
                 </motion.div>

                 <motion.div 
                   className="absolute bottom-32 left-0 bg-white py-3 px-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-30"
                   animate={{ y: [0, 15, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                 >
                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                       <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="text-xs text-slate-500">Weekly Goal</div>
                       <div className="text-sm font-bold text-slate-900">Completed!</div>
                    </div>
                 </motion.div>

                 {/* Decorative Back Card */}
                 <div className="absolute top-10 left-20 w-[340px] h-[500px] bg-slate-100 rounded-[2.5rem] border border-slate-200 z-10 transform rotate-[-6deg] opacity-60"></div>
               </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;