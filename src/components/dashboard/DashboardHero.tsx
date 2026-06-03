import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Moon, Bell, Settings, ArrowRight, Play, 
  BookOpen, MessageCircle, BarChart2, Star, Quote, 
  ArrowUpRight, ChevronDown, Mic, Edit3, Type, Menu
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 relative flex flex-col selection:bg-emerald-500 selection:text-white overflow-hidden">
      
      {/* Ambient Background Lighting - Responsive scaling */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] sm:w-[40%] h-[40%] bg-emerald-300/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[70%] sm:w-[50%] h-[50%] bg-cyan-200/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[10%] sm:left-[20%] w-[50%] sm:w-[30%] h-[30%] bg-blue-200/20 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      {/* Background Soft Shapes - Hidden on small screens to reduce clutter */}
      <svg className="hidden lg:block absolute left-[30%] top-[10%] w-[400px] h-[400px] text-white/40 pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 80 C 20 60, 10 40, 15 25 C 20 10, 40 10, 50 25 C 60 10, 80 10, 85 25 C 90 40, 80 60, 50 80 Z" />
      </svg>
      <svg className="hidden lg:block absolute right-[10%] top-[40%] w-[300px] h-[300px] text-white/40 pointer-events-none transform rotate-12" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50 80 C 20 60, 10 40, 15 25 C 20 10, 40 10, 50 25 C 60 10, 80 10, 85 25 C 90 40, 80 60, 50 80 Z" />
      </svg>

      {/* Main Container Container */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10 flex flex-col min-h-screen">
        
        <nav className="w-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_2px_20px_rgba(0,0,0,0.02)] rounded-[20px] sm:rounded-[24px] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-50 relative">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center relative">
              <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 2L36 11V29L20 38L4 29V11L20 2Z" fill="url(#logo_grad1)"/>
                <path d="M20 2L36 11V21L20 30L4 21V11L20 2Z" fill="url(#logo_grad2)"/>
                <path d="M20 38V19L36 11V29L20 38Z" fill="url(#logo_grad3)"/>
                <path d="M20 19L4 11V29L20 38V19Z" fill="url(#logo_grad4)"/>
                <path d="M14 16H26V18H18V20H24V22H18V26H16V16H14Z" fill="white"/>
                <defs>
                  <linearGradient id="logo_grad1" x1="20" y1="2" x2="20" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#10b981"/><stop offset="1" stopColor="#059669"/></linearGradient>
                  <linearGradient id="logo_grad2" x1="20" y1="2" x2="20" y2="30" gradientUnits="userSpaceOnUse"><stop stopColor="#34d399"/><stop offset="1" stopColor="#10b981"/></linearGradient>
                  <linearGradient id="logo_grad3" x1="28" y1="11" x2="28" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#047857"/><stop offset="1" stopColor="#064e3b"/></linearGradient>
                  <linearGradient id="logo_grad4" x1="12" y1="11" x2="12" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#059669"/><stop offset="1" stopColor="#047857"/></linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile, flexible on tablet/desktop */}
          <div className="hidden md:flex items-center bg-[#F1F5F9] rounded-full px-4 py-2 sm:py-2.5 w-full max-w-[280px] lg:max-w-[400px] mx-4 border border-transparent focus-within:bg-white focus-within:border-emerald-200 focus-within:shadow-sm transition-all">
            <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input 
              type="text" 
              placeholder="Search lessons or ask AI..." 
              className="bg-transparent border-none outline-none text-[13px] sm:text-[14px] w-full ml-3 placeholder:text-slate-400 text-slate-700 font-medium"
            />
            <div className="hidden lg:flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded text-[11px] text-slate-500 font-semibold shadow-sm flex-shrink-0">
              <span>⌘</span><span>K</span>
            </div>
          </div>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&q=80" alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="text-[14px] font-bold text-slate-900">Shadil Alam</span>
                <span className="text-[12px] text-emerald-500 font-semibold">Teacher</span>
              </div>
            </div>
            
            <div className="h-6 sm:h-8 w-px bg-slate-200 hidden sm:block"></div>
            
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              <button className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all relative">
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="absolute top-1.5 sm:top-2.5 right-1.5 sm:right-2.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              {/* Mobile Menu Toggle */}
              <button className="flex sm:hidden w-8 h-8 items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>

        <main className="flex-grow w-full grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-6 mt-8 sm:mt-12 items-center">
          
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 relative z-20 order-1">
            
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1.5 w-fit shadow-[0_2px_10px_rgba(16,185,129,0.1)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-widest text-slate-800 uppercase">AI COACHING ACTIVE</span>
            </div>

            {/* Headline - Responsive typography */}
            <h1 className="text-[42px] sm:text-[56px] lg:text-[72px] font-[800] tracking-[-0.03em] leading-[1.1] lg:leading-[1.05] text-slate-900 mt-2">
              Your English.<br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
                Transformed.
                <svg className="absolute -right-8 sm:-right-10 top-1 sm:top-2 w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0L13.5 8.5L22 10L13.5 11.5L12 20L10.5 11.5L2 10L10.5 8.5L12 0Z"/>
                  <path d="M19.5 15L20.25 18.25L23.5 19L20.25 19.75L19.5 23L18.75 19.75L15.5 19L18.75 18.25L19.5 15Z" opacity="0.6"/>
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <div className="relative pl-4 sm:pl-5 before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-emerald-500 before:rounded-full mt-1 sm:mt-2">
              <p className="text-[15px] sm:text-[16px] text-slate-500 font-medium leading-[1.6] sm:leading-[1.7] max-w-full lg:max-w-[400px]">
                Personalized AI coaching that helps you speak confidently, write clearly, and create impact in every conversation.
              </p>
            </div>

            {/* Action Buttons - Stack on small mobile, side-by-side on sm+ */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
              <button className="w-full sm:w-auto justify-center bg-[#0F172A] hover:bg-black text-white px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-semibold text-[14px] sm:text-[15px] flex items-center gap-3 transition-all shadow-[0_10px_30px_rgba(15,23,42,0.2)] group">
                Continue Learning 
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl font-semibold text-[14px] sm:text-[15px] flex items-center gap-2 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Explore Features
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
              <div className="flex -space-x-2 sm:-space-x-3">
                <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="Learner" />
                <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="Learner" />
                <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="Learner" />
                <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#F8FAFC] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="Learner" />
              </div>
              <div className="text-[12px] sm:text-[13px] font-medium text-slate-500 leading-tight">
                <span className="text-slate-700 font-bold">50K+ learners</span> improving<br className="hidden sm:block"/>their English every day
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 relative h-[350px] sm:h-[450px] lg:h-[700px] flex items-end justify-center pointer-events-none order-2 mt-4 lg:mt-0">
            
            {/* The sweeping background path - Hidden on mobile/tablet to keep UI clean */}
            <svg className="hidden lg:block absolute inset-0 w-[150%] h-[120%] -left-[20%] -top-[10%] -z-10 pointer-events-none" viewBox="0 0 800 800" fill="none">
              <path d="M100 700 C 200 650, 250 400, 400 350 C 550 300, 650 200, 750 100" stroke="#E2E8F0" strokeWidth="2" strokeDasharray="8 8" fill="none"/>
              <path d="M150 600 C 300 550, 300 300, 500 250 C 600 220, 650 150, 700 80" stroke="url(#growthGradient)" strokeWidth="4" strokeLinecap="round" fill="none" className="drop-shadow-lg"/>
              <path d="M685 95 L 705 70 L 720 100" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="150" cy="600" r="5" fill="#10B981" />
              <circle cx="500" cy="250" r="5" fill="#10B981" />
              <circle cx="300" cy="400" r="4" fill="white" stroke="#10B981" strokeWidth="2" />
              <defs>
                <linearGradient id="growthGradient" x1="150" y1="600" x2="700" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#34D399" stopOpacity="0.2"/>
                  <stop offset="0.4" stopColor="#10B981"/>
                  <stop offset="1" stopColor="#059669"/>
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Tags - Hidden on smaller screens for cleaner UI */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} 
              className="hidden lg:flex absolute left-[-20px] bottom-[35%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-[20px] items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><MessageCircle className="w-4 h-4 fill-current" /></div>
              <span className="font-bold text-[13px] text-slate-800 pr-2">Practice</span>
            </motion.div>

            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }} 
              className="hidden lg:flex absolute left-[0px] top-[45%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-[20px] items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500"><BookOpen className="w-4 h-4 fill-current" /></div>
              <span className="font-bold text-[13px] text-slate-800 pr-2">Learn</span>
            </motion.div>

            <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }} 
              className="hidden lg:flex absolute right-[-30px] top-[40%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-[20px] items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500"><BarChart2 className="w-4 h-4 fill-current" /></div>
              <span className="font-bold text-[13px] text-slate-800 pr-2">Improve</span>
            </motion.div>

            <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }} 
              className="hidden lg:flex absolute right-[20px] top-[15%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-[20px] items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-white pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-400"><Star className="w-4 h-4 fill-current" /></div>
              <span className="font-bold text-[13px] text-slate-800 pr-2">Confident</span>
            </motion.div>

            {/* Character & Podium - Responsive sizes */}
            <div className="relative w-full h-full flex flex-col items-center justify-end z-20">
              
              {/* Character Image (Transparent PNG/SVG) */}
              <div className="absolute bottom-[70px] sm:bottom-[80px] lg:bottom-[90px] w-full flex justify-center z-20 pointer-events-none">
                <img 
                  src="/dashboardhero.svg" 
                  alt="AI Teacher" 
                  className="w-[200px] sm:w-[260px] lg:w-[340px] h-[300px] sm:h-[400px] lg:h-[480px] object-contain object-bottom"
                />
              </div>

              {/* Podium */}
              <div className="relative w-[200px] sm:w-[260px] lg:w-[340px] h-[80px] sm:h-[90px] lg:h-[100px] flex flex-col items-center z-10">
                {/* Top Lip */}
                <div className="w-full h-[8px] sm:h-[12px] bg-[#E2E8F0] rounded-t-sm shadow-inner z-20 border-t border-white/60"></div>
                {/* Body */}
                <div className="w-[190px] sm:w-[245px] lg:w-[320px] h-full bg-gradient-to-b from-[#CBD5E1] to-[#94A3B8] rounded-b-sm shadow-[0_30px_60px_rgba(0,0,0,0.1)] relative overflow-hidden flex flex-col gap-[15px] sm:gap-[20px] pt-3 sm:pt-4">
                  <div className="w-full h-[1px] bg-white/20"></div>
                  <div className="w-full h-[1px] bg-white/20"></div>
                  <div className="w-full h-[1px] bg-white/20"></div>
                </div>
              </div>
            </div>

            {/* Bottom Quote Card - Shifts up slightly on mobile so it isn't cut off */}
            <div className="absolute bottom-[20px] sm:bottom-[-10px] bg-white/90 backdrop-blur-xl p-4 sm:p-5 rounded-[20px] sm:rounded-3xl w-[90%] sm:w-[340px] shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-white z-30 pointer-events-auto">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 mb-1 sm:mb-2 fill-current" />
              <p className="text-[13px] sm:text-[14px] font-semibold text-slate-700 leading-[1.5] sm:leading-[1.6] mb-2 sm:mb-3">
                I can express my ideas clearly and <span className="text-emerald-500 font-bold">confidently</span> now.
              </p>
              <p className="text-[11px] sm:text-[12px] text-slate-400 font-bold">— Arif H., Learner</p>
            </div>

          </div>

          {/* Data Cards: Stack on mobile, side-by-side on tablet (md), stacked again on desktop (lg) */}
          <div className="lg:col-span-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 sm:gap-6 relative z-20 xl:pl-4 order-3 mt-4 sm:mt-8 lg:mt-0">
            
            {/* Card 1: Today's Progress */}
            <div className="w-full bg-white/80 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900">Today's Progress</h3>
                <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Circular Chart */}
                <div className="relative w-[80px] h-[80px] sm:w-[110px] sm:h-[110px] flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500 drop-shadow-md" strokeDasharray="87 100" strokeLinecap="round" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[22px] sm:text-[28px] font-extrabold text-slate-900 tracking-tight leading-none">87%</span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-wider text-center leading-tight hidden sm:block">Overall<br/>Progress</span>
                  </div>
                </div>

                {/* Vertical Stats */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                  
                  {/* Speaking */}
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform"><Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] sm:text-[13px] font-bold text-slate-800 leading-tight">Speaking</span>
                        <span className="text-[11px] sm:text-[12px] text-slate-500 font-semibold">92%</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                  </div>

                  {/* Writing */}
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center group-hover:scale-105 transition-transform"><Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] sm:text-[13px] font-bold text-slate-800 leading-tight">Writing</span>
                        <span className="text-[11px] sm:text-[12px] text-slate-500 font-semibold">78%</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Vocabulary */}
                  <div className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform"><Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" /></div>
                      <div className="flex flex-col">
                        <span className="text-[12px] sm:text-[13px] font-bold text-slate-800 leading-tight">Vocabulary</span>
                        <span className="text-[11px] sm:text-[12px] text-slate-500 font-semibold">85%</span>
                      </div>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                </div>
              </div>
            </div>

            {/* Card 2: Weekly Improvement */}
            <div className="w-full bg-white/80 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-white">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="font-bold text-[15px] sm:text-[16px] text-slate-900">Weekly Improvement</h3>
                <button className="flex items-center gap-1 text-[11px] sm:text-[12px] font-bold text-blue-500 hover:text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                  This Week <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              
              <div className="relative h-[90px] sm:h-[110px] w-full mt-2 sm:mt-4">
                <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none" className="overflow-visible">
                  {/* Gradient Area Fill */}
                  <path d="M0,80 C30,70 60,85 100,60 C140,35 180,60 220,40 C260,20 280,30 300,10 L300,100 L0,100 Z" fill="url(#lineChartGradient)" opacity="0.3"/>
                  
                  {/* Main Line */}
                  <path d="M0,80 C30,70 60,85 100,60 C140,35 180,60 220,40 C260,20 280,30 300,10" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"/>
                  
                  {/* Points */}
                  <circle cx="0" cy="80" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="50" cy="76" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="100" cy="60" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="160" cy="50" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="220" cy="40" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="260" cy="22" r="3" fill="white" stroke="#10B981" strokeWidth="2"/>
                  <circle cx="300" cy="10" r="4" fill="#10B981" stroke="white" strokeWidth="2" className="drop-shadow-sm"/>
                  
                  <defs>
                    <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="1"/>
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Floating 32% Badge */}
                <div className="absolute right-[-5px] sm:right-[-10px] top-[-15px] sm:top-[-20px] bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-full shadow-md z-10">
                  +32%
                </div>
              </div>

              {/* X Axis */}
              <div className="flex justify-between mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-bold text-slate-400 px-1 uppercase tracking-wider">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}