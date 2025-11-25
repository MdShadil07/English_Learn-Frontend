import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mic, Users, ArrowRight, BookOpen, CheckCircle2, BarChart, Zap, Globe } from 'lucide-react';

const HowItWorks = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
  };

  // Waveform Bar Component
  const WaveBar = ({ delay }) => (
    <motion.div
      className="w-1.5 md:w-2 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full"
      animate={{ height: ["20%", "80%", "20%"] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: [0.42, 0, 0.58, 1],
        delay: delay,
      }}
      style={{ height: '20%' }}
    />
  );

  // Map Node Component
  const MapNode = ({ top, left, delay, imgSeed, isCenter = false }) => (
    <motion.div 
      className="absolute"
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
    >
      <div className="relative">
        {/* Pulse Effect */}
        <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isCenter ? 'bg-amber-500' : 'bg-slate-500'}`}></div>
        
        {/* Avatar */}
        <div className={`relative z-10 rounded-full overflow-hidden border-2 shadow-lg ${isCenter ? 'w-12 h-12 border-amber-500' : 'w-8 h-8 border-slate-600 bg-slate-800'}`}>
          <img 
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${imgSeed}`} 
            alt="User" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Status Dot */}
        {isCenter && (
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full z-20"></div>
        )}
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" id="how-it-works">
      
      {/* --- Abstract Background --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Header --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-20"
        >
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm">
             <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">The Process</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
            Fluent in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">4 Simple Steps</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Our intuitive platform adapts to your pace. From your first chat to mastering complex topics, we guide you every step of the way.
          </p>
        </motion.div>

        {/* --- Steps Container --- */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-24 md:space-y-32"
        >
          
          {/* STEP 1: Chat with AI */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1 relative group">
              {/* Visual: Abstract Chat Interface */}
              <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden backdrop-blur-sm transition-transform duration-500 group-hover:scale-[1.02]">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <div className="space-y-4 mt-2">
                   {/* Bot Message */}
                   <motion.div className="flex gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                     <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-sm">
                       <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none max-w-[85%] border border-slate-200 dark:border-slate-700">
                       <div className="h-2.5 w-48 bg-slate-300 dark:bg-slate-700 rounded-full mb-2"></div>
                       <div className="h-2.5 w-32 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
                     </div>
                   </motion.div>
                   {/* User Message */}
                   <motion.div className="flex gap-3 justify-end" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                     <div className="bg-emerald-500 p-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-lg shadow-emerald-500/20">
                        <div className="h-2.5 w-40 bg-white/40 rounded-full mb-2"></div>
                        <div className="h-2.5 w-24 bg-white/40 rounded-full"></div>
                     </div>
                     <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-sm">
                       <span className="text-xs font-bold text-slate-500">You</span>
                     </div>
                   </motion.div>
                   {/* Bot Reply */}
                   <motion.div className="flex gap-3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                     <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shadow-sm">
                       <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                     </div>
                     <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center border border-slate-200 dark:border-slate-700">
                       <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                       <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-100"></span>
                       <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-200"></span>
                     </div>
                   </motion.div>
                </div>
                {/* Floating Badge */}
                <motion.div className="absolute bottom-6 right-6 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-2 z-20" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", delay: 1.5 }}>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Active</span>
                </motion.div>
              </div>
              <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm">
                <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Chat with AI Tutors</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Choose from 5 different AI personas tailored to your learning style. Whether you need a strict grammarian or a casual conversation partner, we have the perfect match.
              </p>
              <ul className="space-y-4">
                {['24/7 Availability', 'Instant Feedback', 'Context-Aware Responses'].map((item, i) => (
                  <motion.li key={i} className="flex items-center text-slate-700 dark:text-slate-300 font-medium" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 * i }}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* STEP 2: Practice Speaking */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-1">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 shadow-sm">
                <Mic className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Real-time Pronunciation</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Our voice engine analyzes your speech patterns in milliseconds. Get immediate visual feedback on tone, pace, and pronunciation accuracy with detailed reports.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 h-12 shadow-lg shadow-blue-500/20">
                Try Voice Demo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="order-2 relative group">
               {/* Visual: Audio Waveform */}
               <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-8 flex flex-col items-center justify-center h-[320px] overflow-hidden">
                 <div className="relative z-10 mb-8">
                   <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl shadow-blue-500/30 z-20">
                     <Mic className="w-10 h-10 text-white" />
                   </div>
                   {[1, 2, 3].map((i) => (
                     <motion.div key={i} className="absolute inset-0 border border-blue-400/30 rounded-full" animate={{ scale: [1, 1.8], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4, ease: [0.22, 1, 0.36, 1] }} />
                   ))}
                 </div>
                 <div className="flex items-center justify-center gap-1.5 h-16 w-full px-8">
                   {[...Array(16)].map((_, i) => ( <WaveBar key={i} delay={i * 0.1} /> ))}
                 </div>
                 <div className="absolute bottom-6 flex items-center gap-2 text-blue-400 text-sm font-semibold tracking-wide uppercase">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    Listening...
                 </div>
               </div>
               <div className="absolute -inset-4 bg-blue-500/20 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
          </div>

          {/* STEP 3: Learn with Modules */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-2 md:order-1 relative group">
               {/* Visual: Stacked Cards */}
               <div className="relative h-[340px] w-full flex justify-center items-center">
                 <div className="absolute top-0 w-[80%] h-[220px] bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 transform scale-90 -rotate-6 opacity-60"></div>
                 <div className="absolute top-4 w-[85%] h-[220px] bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 transform scale-95 -rotate-3 shadow-lg"></div>
                 <motion.div className="absolute top-8 w-[90%] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl p-6 md:p-8" whileHover={{ y: -5, rotate: 0 }} transition={{ type: "spring", stiffness: 300 }}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module 01</span>
                         <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Active</span>
                      </div>
                    </div>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Business English</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Master the terminology of the corporate world.</p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                          <span>Progress</span>
                          <span>65%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <motion.div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full" initial={{ width: 0 }} whileInView={{ width: "65%" }} transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
                        </div>
                    </div>
                 </motion.div>
                 <motion.div className="absolute -right-4 top-20 bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg border border-purple-100 dark:border-purple-900/30 flex items-center gap-3 z-20" initial={{ scale: 0, rotate: -10 }} whileInView={{ scale: 1, rotate: 6 }} transition={{ type: "spring", delay: 1 }}>
                   <div className="bg-yellow-100 dark:bg-yellow-900/30 p-1.5 rounded-full text-yellow-600 dark:text-yellow-400">
                     <Zap className="w-4 h-4 fill-current" />
                   </div>
                   <div>
                     <div className="text-xs font-bold text-slate-900 dark:text-white">Streak</div>
                     <div className="text-[10px] text-slate-500">5 Days</div>
                   </div>
                 </motion.div>
               </div>
               <div className="absolute inset-10 bg-purple-500/20 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 shadow-sm">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Structured Learning Path</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Don't know where to start? Follow our expertly crafted modules covering grammar, business terms, and travel essentials with gamified progress.
              </p>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">50+</div>
                    <div className="text-sm font-medium text-slate-500">Modules Available</div>
                 </div>
                 <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">A1-C2</div>
                    <div className="text-sm font-medium text-slate-500">CEFR Levels</div>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* STEP 4: Community */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={itemVariants} className="order-1">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 shadow-sm">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Connect with Peers</h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Join practice rooms, compete in leaderboards, and make friends globally. Learning is faster when you do it together in a supportive environment.
              </p>
              <Button variant="link" className="text-amber-600 dark:text-amber-400 p-0 h-auto text-lg font-semibold hover:no-underline hover:opacity-80 group">
                View Community Rules <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="order-2 relative group">
               {/* Visual: Worldwide Connectivity Map */}
               <div className="relative rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl h-[340px] w-full overflow-hidden flex items-center justify-center">
                 
                 {/* Map Silhouette & Grid */}
                 <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                 <svg className="absolute inset-0 w-full h-full text-slate-800 fill-current opacity-40 pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
                    <path d="M40,60 Q70,40 100,60 T140,80 T120,130 T60,120 Z" />
                    <path d="M180,50 Q210,30 240,50 T260,90 T220,110 T190,80 Z" />
                    <path d="M280,40 Q320,20 360,50 T380,100 T320,110 T290,80 Z" />
                 </svg>

                 {/* Connection Lines (SVG) */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <defs>
                     <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                       <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
                       <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                       <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                     </linearGradient>
                   </defs>
                   
                   {/* Animated Paths */}
                   {[
                     "M200,80 Q280,40 320,80", // Europe -> Asia
                     "M80,90 Q160,30 200,80",  // America -> Europe
                     "M80,90 Q70,130 100,160", // NA -> SA
                     "M200,80 Q210,120 190,150" // Europe -> Africa
                   ].map((d, i) => (
                     <motion.path 
                        key={i}
                        d={d}
                        fill="none" 
                        stroke="url(#lineGrad)" 
                        strokeWidth="2"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }} 
                        whileInView={{ pathLength: 1, opacity: 0.6 }} 
                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2), repeat: Infinity, repeatDelay: 3 }} 
                     />
                   ))}
                 </svg>

                 {/* User Nodes (Avatars) */}
                 {/* Coordinates are % based for responsiveness */}
                 <MapNode top="35%" left="20%" delay={0} imgSeed={12} />     {/* NA */}
                 <MapNode top="30%" left="50%" delay={0.2} imgSeed={23} isCenter /> {/* EU (Hub) */}
                 <MapNode top="35%" left="80%" delay={0.4} imgSeed={34} />     {/* Asia */}
                 <MapNode top="70%" left="25%" delay={0.6} imgSeed={45} />     {/* SA */}
                 <MapNode top="65%" left="55%" delay={0.8} imgSeed={56} />     {/* Africa */}

                 {/* Active Badge */}
                 <div className="absolute bottom-6 left-6 bg-slate-800/90 backdrop-blur-md border border-slate-700 px-3 py-2 rounded-xl flex items-center gap-3 shadow-lg z-20">
                     <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full border border-slate-800 bg-slate-700 flex items-center justify-center text-[8px] text-white">You</div>
                        <div className="w-6 h-6 rounded-full border border-slate-800 bg-amber-500 flex items-center justify-center text-[8px] text-white">+3</div>
                     </div>
                     <div className="text-xs font-medium text-slate-300">Connected <span className="text-white font-bold ml-1">Worldwide</span></div>
                 </div>
               </div>
               
               {/* Background Glow */}
               <div className="absolute -inset-4 bg-amber-500/20 blur-3xl -z-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </motion.div>
          </div>

        </motion.div>

        {/* --- CTA Section --- */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 relative rounded-[2.5rem] overflow-hidden bg-slate-900 dark:bg-slate-800 text-white shadow-2xl"
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 to-teal-800/90 z-0"></div>
          
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10 z-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 p-10 md:p-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your English?</h2>
              <p className="text-emerald-50 text-lg mb-8 max-w-md leading-relaxed">
                Join 50,000+ learners who have accelerated their fluency with CognitoSpeak. Start your journey today—no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 h-14 px-8 rounded-full text-base font-semibold border-0 shadow-lg transition-transform hover:-translate-y-1">
                  Get Started Free
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 h-14 px-8 rounded-full text-base backdrop-blur-sm">
                  View Pricing
                </Button>
              </div>
            </div>

            {/* Abstract Graphic Right Side */}
            <div className="hidden lg:flex justify-end relative">
               <motion.div 
                 className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 relative shadow-2xl"
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
               >
                 <motion.div 
                   className="absolute -top-6 -right-6 bg-white text-emerald-700 px-6 py-3 rounded-2xl shadow-xl font-bold text-sm"
                   animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
                   transition={{ duration: 3, repeat: Infinity }}
                 >
                   Start Now!
                 </motion.div>
                 <div className="text-center">
                   <div className="text-6xl font-extrabold mb-1 tracking-tighter">14</div>
                   <div className="text-lg font-medium opacity-90 uppercase tracking-widest">Day Trial</div>
                 </div>
               </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HowItWorks;