import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Flame, CheckCircle2, Award, Sparkles, Bookmark, MessageSquareShare } from 'lucide-react';
import { Button } from './UI';

export const LeftNavigationPanel = ({ 
  lessonData, 
  isSidebarOpen, 
  setSidebarOpen, 
  activeSection, 
  scrollTo,
  navigate
}: any) => {
  return (
    <>
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" 
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        lg:relative lg:translate-x-0 lg:w-[280px] xl:w-[320px] shrink-0
        ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'}
      `}>
        <div className="p-6 border-b border-slate-100 shrink-0">
          <div className="flex justify-between items-center mb-6">
            <button onClick={() => navigate('/dashboard?view=grammar')} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Modules
            </button>
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/50">
              <Flame size={14} className="text-amber-500 fill-amber-500" />
              <span className="text-xs font-bold text-amber-700">{lessonData.streak}</span>
            </div>
          </div>

          <h3 className="font-black text-xl text-slate-900 leading-tight mb-4">{lessonData.title}</h3>
          
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Overall Progress</span>
              <span>{lessonData.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${lessonData.progress}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 py-6 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-3 mb-4">Lesson Flow</p>
          
          {lessonData.sidebarNav.map((nav: any) => {
            const isActive = activeSection === nav.id;
            const isCheckpoint = nav.id.includes('checkpoint');
            return (
              <button 
                key={nav.id}
                onClick={() => scrollTo(nav.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group
                  ${isActive ? 'bg-slate-50 shadow-sm border border-slate-200/60' : 'hover:bg-slate-50/50 border border-transparent'}
                `}
              >
                <div className="mt-0.5 shrink-0">
                  {nav.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  ) : nav.id === 'assessment' ? (
                    <Award className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
                  ) : isCheckpoint ? (
                    <Flame className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-300'}`} />
                  ) : (
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isActive ? 'border-slate-900' : 'border-slate-300'}`}>
                      {isActive && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />}
                    </div>
                  )}
                </div>
                <span className={`font-bold text-sm leading-snug ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}`}>
                  {nav.title}
                </span>
              </button>
            )
          })}
        </div>
      </aside>
    </>
  );
};

export const RightAssistantPanel = ({ lessonData }: any) => (
  <aside className="hidden xl:flex w-[300px] bg-slate-50 border-l border-slate-200 flex-col shrink-0 h-screen sticky top-0 overflow-y-auto">
    <div className="p-8 space-y-8">
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Daily Goal</p>
          <span className="text-xs font-bold text-slate-600">{lessonData.dailyGoalProgress}/{lessonData.dailyGoalTotal}</span>
        </div>
        <div className="flex gap-2">
          {[...Array(lessonData.dailyGoalTotal)].map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < lessonData.dailyGoalProgress ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-200'}`} />
          ))}
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-3">Complete {lessonData.dailyGoalTotal - lessonData.dailyGoalProgress} more lesson to hit your goal.</p>
      </div>

      <div className="h-px w-full bg-slate-200" />

      <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
        <div className="absolute -right-4 -top-4 opacity-10"><Sparkles size={80} /></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <div className="w-6 h-6 bg-emerald-500/20 rounded-md flex items-center justify-center">
            <Sparkles size={14} className="text-emerald-400" />
          </div>
          <h4 className="font-black text-sm uppercase tracking-wider text-emerald-400">Cognito AI</h4>
        </div>
        <p className="text-sm text-slate-300 font-medium mb-5 leading-relaxed relative z-10">
          Need a simpler explanation? Highlight any text or ask me directly.
        </p>
        <Button variant="outline" className="w-full bg-white/10 border-white/10 text-white hover:bg-white/20 hover:border-white/20 hover:text-white">
          Ask a Question
        </Button>
      </div>

      <div className="space-y-3">
         <Button variant="outline" className="w-full justify-start text-slate-600 border-slate-200"><Bookmark className="w-4 h-4 mr-3"/> Save Lesson</Button>
         <Button variant="outline" className="w-full justify-start text-slate-600 border-slate-200"><MessageSquareShare className="w-4 h-4 mr-3"/> Discuss in Forum</Button>
      </div>
    </div>
  </aside>
);
