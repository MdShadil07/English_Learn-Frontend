import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Flag, ChevronLeft, ChevronRight, Pause, Volume2, Mic, 
  CheckCircle2, AlertCircle, Info, LayoutGrid, Zap, Play, Square,
  Check, ArrowRight, Settings, Maximize2, Bookmark, Flame,
  BookOpen, Target, Sparkles
} from 'lucide-react';
import { defaultQuizExperience, geminiQuizService, type QuizExperience } from '../../services/Quiz/geminiQuizService';

/* ========================================================================== */
/* MOCK DATA                                                                  */
/* ========================================================================== */

const QUIZ_INFO = {
  title: "Advanced Business Communication",
  module: "Module 4: Formal Negotiations",
  totalQuestions: 25,
  currentQuestion: 12,
  timeRemaining: "14:52",
  progress: 48, // percentage
  streak: 3
};

const QUESTION_MAP = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  status: i < 11 ? 'completed' : i === 11 ? 'current' : i === 5 || i === 8 ? 'flagged' : 'unanswered'
}));

const CURRENT_QUESTION = {
  id: 12,
  type: "Hybrid Scenario",
  skill: "Vocabulary & Tone",
  context: {
    type: "Email Thread",
    sender: "Sarah Jenkins, VP of Operations",
    date: "Oct 12, 10:23 AM",
    subject: "Re: Q4 Supply Chain Delays",
    content: "Hi Team,\n\nWe are facing a 2-week delay from our primary vendor in Taiwan. We need to communicate this to our enterprise clients immediately without causing panic. \n\nPlease draft a response. It is crucial that we ______ the situation professionally while offering a temporary workaround."
  },
  prompt: "Which phrase best completes the sentence to maintain a formal, reassuring, and professional tone?",
  options: [
    { id: 'A', text: "apologize for messing up" },
    { id: 'B', text: "address the situation" },
    { id: 'C', text: "make excuses about" },
    { id: 'D', text: "ignore the reality of" }
  ],
  speakingPrompt: "Once you have selected the correct phrase, press record and read the complete, corrected sentence aloud to practice your professional delivery."
};

/* ========================================================================== */
/* REUSABLE COMPONENTS                                                        */
/* ========================================================================== */

const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: "bg-slate-100 text-slate-600 border border-slate-200",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const OptionCard = ({ id, text, selected, onClick, hotkey }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-center gap-4
      ${selected 
        ? 'border-indigo-600 bg-indigo-50/80 shadow-md shadow-indigo-100' 
        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50 shadow-sm'}
    `}
  >
    {/* Keybinding Indicator */}
    <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 lg:opacity-100 transition-opacity">
       <span className="bg-white border border-slate-200 text-slate-400 text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
         {hotkey}
       </span>
    </div>

    {/* Radio Button */}
    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors
      ${selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}
    `}>
      {selected && <Check className="w-4 h-4" />}
    </div>
    
    {/* Letter & Text */}
    <div className="flex-1 flex items-center gap-3">
      <span className={`text-sm font-black ${selected ? 'text-indigo-700' : 'text-slate-400'}`}>{id}</span>
      <span className={`text-base font-semibold ${selected ? 'text-indigo-950' : 'text-slate-700'}`}>{text}</span>
    </div>
  </motion.div>
);

const AudioVisualizer = ({ isRecording }) => (
  <div className="flex items-center gap-1 h-8">
    {[...Array(24)].map((_, i) => (
      <motion.div
        key={i}
        className={`w-1.5 rounded-full ${isRecording ? 'bg-indigo-500' : 'bg-slate-200'}`}
        animate={isRecording ? {
          height: ["20%", "80%", "40%", "100%", "30%", "20%"],
        } : { height: "20%" }}
        transition={isRecording ? {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.05
        } : {}}
      />
    ))}
  </div>
);

/* ========================================================================== */
/* MAIN PAGE                                                                  */
/* ========================================================================== */

export default function EndUserQuizTemplate() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [quizExperience, setQuizExperience] = useState<QuizExperience>(defaultQuizExperience);

  // Keyboard shortcut listener mock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '1' || e.key === 'a' || e.key === 'A') setSelectedOption('A');
      if (e.key === '2' || e.key === 'b' || e.key === 'B') setSelectedOption('B');
      if (e.key === '3' || e.key === 'c' || e.key === 'C') setSelectedOption('C');
      if (e.key === '4' || e.key === 'd' || e.key === 'D') setSelectedOption('D');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fallback = defaultQuizExperience;

    const loadQuizExperience = async () => {
      const experience = await geminiQuizService.generatePracticeQuiz({
        title: fallback.info.title,
        module: fallback.info.module,
        level: 'Advanced',
        focus: 'Business communication',
        questionCount: fallback.info.totalQuestions,
      });

      if (isMounted && experience) {
        setQuizExperience(experience);
      }
    };

    loadQuizExperience();

    return () => {
      isMounted = false;
    };
  }, []);

  const QUIZ_INFO = quizExperience.info;
  const QUESTION_MAP = quizExperience.questionMap;
  const CURRENT_QUESTION = quizExperience.currentQuestion;

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans text-slate-900 flex flex-col selection:bg-indigo-500/20">
      
      {/* ---------------------------------------------------------------------- */}
      {/* TOP NAVIGATION BAR                                                     */}
      {/* ---------------------------------------------------------------------- */}
      <header className="h-[72px] bg-white border-b border-slate-200 shrink-0 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        
        {/* Left: Brand & Quiz Info */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight hidden sm:block text-slate-900">Mastery</span>
          </div>
          <div className="hidden lg:block w-px h-8 bg-slate-200"></div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">{QUIZ_INFO.title}</h1>
            <p className="text-[11px] font-medium text-slate-500">{QUIZ_INFO.module}</p>
          </div>
        </div>

        {/* Center: Progress Bar */}
        <div className="hidden md:flex flex-col items-center w-full max-w-md px-8">
          <div className="flex justify-between w-full text-[11px] font-bold mb-1.5">
            <span className="text-indigo-600 flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500"/> {QUIZ_INFO.streak} Streak</span>
            <span className="text-slate-500">{QUIZ_INFO.currentQuestion} of {QUIZ_INFO.totalQuestions} Questions</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full relative"
              style={{ width: `${QUIZ_INFO.progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)' }}></div>
            </div>
          </div>
        </div>

        {/* Right: Timer & Actions */}
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-lg shadow-sm">
            <Clock className="w-4 h-4 animate-pulse" />
            <span className="font-mono font-bold text-sm tracking-wide">{QUIZ_INFO.timeRemaining}</span>
          </div>
          <button className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors font-semibold text-xs border border-transparent hover:border-slate-200">
            <Pause className="w-4 h-4" /> Save & Pause
          </button>
          <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
          <button className="text-slate-400 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------------- */}
      {/* MAIN WORKSPACE                                                         */}
      {/* ---------------------------------------------------------------------- */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 h-[calc(100vh-72px)] overflow-hidden">
        
        {/* ================================================================== */}
        {/* LEFT: CONTEXT PANEL (Audio/Reading) - Col span 4                   */}
        {/* ================================================================== */}
        <div className="hidden lg:flex lg:col-span-4 flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2 pb-24">
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500"/> Context
              </h2>
              <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-500">Reading</span>
            </div>
            
            <div className="p-6">
               <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 shadow-inner">
                 <div className="flex items-center gap-3 mb-4 border-b border-slate-200 pb-4">
                   <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg border border-indigo-200">
                     SJ
                   </div>
                   <div>
                     <p className="text-sm font-bold text-slate-900 leading-none">{CURRENT_QUESTION.context.sender}</p>
                     <p className="text-xs text-slate-500 mt-1">{CURRENT_QUESTION.context.date}</p>
                   </div>
                 </div>
                 <div className="mb-2">
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject:</span>
                   <span className="text-sm font-bold text-slate-900 ml-2">{CURRENT_QUESTION.context.subject}</span>
                 </div>
                 <div className="text-[15px] leading-relaxed text-slate-700 font-medium whitespace-pre-line mt-4">
                   {CURRENT_QUESTION.context.content}
                 </div>
               </div>

               {/* Mock Audio Context Tool */}
               <div className="mt-6 border-t border-slate-100 pt-6">
                 <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Listen to Audio Context</p>
                 <div className="bg-white border border-indigo-100 rounded-xl p-3 flex items-center gap-4 shadow-sm">
                   <button className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 shadow-md shrink-0 transition-transform active:scale-95">
                     <Play className="w-4 h-4 ml-0.5" fill="currentColor"/>
                   </button>
                   <div className="flex-1 h-6 flex items-center gap-0.5 opacity-60">
                     {[...Array(20)].map((_, i) => <div key={i} className="w-1 bg-indigo-400 rounded-full" style={{height: `${Math.max(20, Math.random()*100)}%`}}></div>)}
                   </div>
                   <span className="text-xs font-mono font-bold text-slate-500">00:42</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* ================================================================== */}
        {/* CENTER: INTERACTION PANEL (Question & Options) - Col span 6        */}
        {/* ================================================================== */}
        <div className="col-span-1 lg:col-span-6 flex flex-col h-full overflow-y-auto custom-scrollbar pb-32 relative">
          
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6 shrink-0">
             <div className="flex items-center gap-3">
               <div className="bg-indigo-100 text-indigo-700 font-black w-10 h-10 rounded-xl flex items-center justify-center text-lg border border-indigo-200 shadow-sm">
                 {QUIZ_INFO.currentQuestion}
               </div>
               <div>
                 <Badge variant="indigo" className="mb-0.5 bg-indigo-50 border-indigo-100 text-indigo-600">{CURRENT_QUESTION.type}</Badge>
                 <p className="text-xs font-bold text-slate-500 flex items-center gap-1"><Target className="w-3 h-3"/> {CURRENT_QUESTION.skill}</p>
               </div>
             </div>
             
             <div className="flex gap-2">
               <button 
                 onClick={() => setShowHint(!showHint)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                 ${showHint ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
               `}>
                 <Info className="w-3.5 h-3.5" /> Hint
               </button>
               <button 
                 onClick={() => setIsFlagged(!isFlagged)}
                 className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border
                 ${isFlagged ? 'bg-orange-50 text-orange-600 border-orange-200 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}
               `}>
                 <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-orange-600' : ''}`} /> Flag
               </button>
             </div>
          </div>

          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 overflow-hidden shadow-sm"
              >
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-800 font-medium leading-relaxed">
                  <strong>Hint:</strong> Look for a phrase that means "to deal with or discuss a problem" without sounding defensive or overly casual. The tone should be objective.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Part 1: MCQ */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm mb-6">
            <h3 className="text-lg lg:text-xl font-bold text-slate-900 mb-8 leading-snug">
              {CURRENT_QUESTION.prompt}
            </h3>
            
            <div className="space-y-4">
              {CURRENT_QUESTION.options.map((opt, i) => (
                <OptionCard 
                  key={opt.id}
                  id={opt.id}
                  text={opt.text}
                  selected={selectedOption === opt.id}
                  onClick={() => setSelectedOption(opt.id)}
                  hotkey={i + 1}
                />
              ))}
            </div>
          </div>

          {/* Part 2: Speaking (Only enables if MCQ is selected) */}
          <motion.div 
            initial={{ opacity: 0.5, filter: 'grayscale(100%)' }}
            animate={{ opacity: selectedOption ? 1 : 0.5, filter: selectedOption ? 'grayscale(0%)' : 'grayscale(100%)' }}
            className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm relative overflow-hidden"
          >
            {/* Lock Overlay if not selected */}
            {!selectedOption && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
                <div className="bg-slate-900/80 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4"/> Select an answer first
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <Mic className="w-5 h-5 text-indigo-500" />
              <h4 className="font-bold text-slate-900">Pronunciation Practice</h4>
              <Badge variant="purple" className="ml-auto bg-purple-50 text-purple-700 border-purple-200"><Sparkles className="w-3 h-3 inline mr-1"/> AI Graded</Badge>
            </div>
            
            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
              {CURRENT_QUESTION.speakingPrompt}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center gap-6 shadow-inner">
               <AnimatePresence mode="wait">
                 {!isRecording ? (
                   <motion.button 
                     key="start"
                     initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                     onClick={() => setIsRecording(true)}
                     disabled={!selectedOption}
                     className="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-500/30 hover:bg-rose-600 hover:scale-105 transition-all outline-none focus:ring-4 focus:ring-rose-500/20 disabled:opacity-50 disabled:hover:scale-100"
                   >
                     <Mic className="w-6 h-6" />
                   </motion.button>
                 ) : (
                   <motion.button 
                     key="stop"
                     initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
                     onClick={() => setIsRecording(false)}
                     className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-slate-800 transition-all outline-none focus:ring-4 focus:ring-slate-900/20"
                   >
                     <Square className="w-5 h-5" fill="currentColor" />
                   </motion.button>
                 )}
               </AnimatePresence>

               {isRecording && (
                 <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                   <AudioVisualizer isRecording={isRecording} />
                   <span className="text-xs font-bold text-rose-600 animate-pulse mt-2">Recording... 00:12 / 01:00</span>
                 </div>
               )}

               {!isRecording && (
                 <p className="text-xs font-bold text-slate-400">Click to start recording</p>
               )}
            </div>
          </motion.div>

        </div>

        {/* ================================================================== */}
        {/* RIGHT: QUESTION NAVIGATOR MAP - Col span 2                         */}
        {/* ================================================================== */}
        <div className="hidden lg:flex lg:col-span-2 flex-col h-full">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col h-full">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
              Question Map <LayoutGrid className="w-4 h-4"/>
            </h3>
            
            <div className="grid grid-cols-4 gap-2 mb-6">
              {QUESTION_MAP.map((q) => (
                <button 
                  key={q.id}
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all relative group
                    ${q.status === 'completed' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-200' : ''}
                    ${q.status === 'current' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : ''}
                    ${q.status === 'flagged' ? 'bg-orange-50 text-orange-700 border-2 border-orange-400 border-dashed' : ''}
                    ${q.status === 'unanswered' ? 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300' : ''}
                  `}
                >
                  {q.id}
                  {q.status === 'flagged' && <Flag className="w-3 h-3 absolute -top-1.5 -right-1.5 text-orange-500 fill-orange-500 bg-white rounded-full"/>}
                </button>
              ))}
            </div>

            <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><div className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200"></div> Answered</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><div className="w-3 h-3 rounded bg-indigo-600"></div> Current</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><div className="w-3 h-3 rounded border-2 border-orange-400 border-dashed bg-orange-50"></div> Flagged for Review</div>
               <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500"><div className="w-3 h-3 rounded border border-slate-200 bg-white"></div> Unanswered</div>
            </div>
          </div>
        </div>

      </main>

      {/* ---------------------------------------------------------------------- */}
      {/* FIXED BOTTOM NAVIGATION BAR                                            */}
      {/* ---------------------------------------------------------------------- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:px-8 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-40">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          <button className="flex items-center gap-2 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors border border-transparent hover:border-slate-200">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          
          <div className="flex items-center gap-3">
             <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-bold text-sm transition-colors">
               <Bookmark className="w-4 h-4"/> Skip for now
             </button>
             <button 
               className={`flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md
               ${selectedOption ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
             `}>
               Next Question <ArrowRight className="w-4 h-4" />
             </button>
          </div>

        </div>
      </div>

      {/* Global Styles for Custom Scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}} />
    </div>
  );
}