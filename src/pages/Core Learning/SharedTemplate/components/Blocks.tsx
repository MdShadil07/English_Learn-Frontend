import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, CheckCircle2, X, BrainCircuit, Lightbulb, Flame, Award, Target, Trophy, ArrowRight, Sparkles, Briefcase } from 'lucide-react';
import { Button, Badge } from './UI';

export const HeroSection = ({ data, lessonData }: any) => (
  <div id={data.id} className="mb-16 pt-8">
    <div className="flex items-center gap-3 mb-6">
      <Badge variant="emerald">{lessonData.difficulty}</Badge>
      <span className="flex items-center text-sm font-bold text-slate-500">
        <Clock className="w-4 h-4 mr-1.5" /> {lessonData.estimatedTime} read
      </span>
    </div>
    <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
      {data.heading}
    </h1>
    <p className="text-xl text-slate-600 mb-10 max-w-2xl font-medium leading-relaxed">
      {data.subheading}
    </p>
    
    <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
          <Zap size={20} className="fill-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 leading-none">Skills you'll unlock</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1">Complete the lesson to master these</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 relative z-10">
        {lessonData.objectives.map((obj: any, i: number) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center mb-3">
              <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
            </div>
            <h4 className="font-black text-slate-900 text-sm mb-1.5">{obj.title}</h4>
            <p className="text-xs font-semibold text-slate-500 leading-relaxed">{obj.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export const ConceptSection = ({ data }: any) => {
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCheck = (idx: number) => {
    setSelectedOpt(idx);
    setIsSubmitted(true);
  };

  return (
    <div id={data.id} className="mb-20 scroll-mt-24">
      <h2 className="text-3xl font-black text-slate-900 mb-6">{data.title}</h2>
      <div 
        className="text-lg text-slate-700 leading-relaxed mb-10 font-medium"
        dangerouslySetInnerHTML={{ __html: data.theory.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black bg-slate-100 px-1.5 py-0.5 rounded">$1</strong>') }}
      />

      {data.aiExplanation && (
        <div className="mb-10 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={100} /></div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Sparkles size={20} className="fill-emerald-600" />
            </div>
            <h4 className="font-black text-emerald-950 text-lg">AI Simplification</h4>
          </div>
          <p className="text-emerald-900 font-semibold text-lg mb-4 relative z-10">"{data.aiExplanation.simple}"</p>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-sm text-emerald-900 font-semibold border border-emerald-200/50 shadow-sm">
            <span className="font-black text-emerald-700 uppercase tracking-widest text-[10px] block mb-1">Memory Trick</span> 
            {data.aiExplanation.memoryTrick}
          </div>
        </div>
      )}

      {data.examples && (
        <div className="mb-10 space-y-6">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Compare & Learn</h4>
          <div className="grid md:grid-cols-2 gap-4">
            {data.examples.map((ex: any, idx: number) => (
              <React.Fragment key={idx}>
                <div className="bg-white border-2 border-emerald-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-600 mb-3">
                    <CheckCircle2 size={18} className="fill-emerald-100" /> <span className="text-xs font-black uppercase tracking-wider">Correct</span>
                  </div>
                  <p className="text-slate-900 font-bold text-lg mb-2" dangerouslySetInnerHTML={{ __html: ex.correct.text.replace(/\*\*(.*?)\*\*/g, '<span class="text-emerald-700 font-black border-b-2 border-emerald-200">$1</span>') }} />
                  <p className="text-sm font-medium text-slate-500">{ex.correct.explanation}</p>
                </div>
                <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 border-dashed">
                  <div className="flex items-center gap-2 text-rose-500 mb-3">
                    <X size={18} /> <span className="text-xs font-black uppercase tracking-wider">Incorrect</span>
                  </div>
                  <p className="text-slate-700 font-bold text-lg mb-2 line-through decoration-rose-300 decoration-2 opacity-70" dangerouslySetInnerHTML={{ __html: ex.incorrect.text.replace(/\*\*(.*?)\*\*/g, '<span class="text-rose-600 font-black">$1</span>') }} />
                  <p className="text-sm font-medium text-slate-500">{ex.incorrect.explanation}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {data.inlineCheck && (
        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <BrainCircuit size={20} className="text-indigo-400" />
            </div>
            <h4 className="font-black text-white text-lg">Quick Check</h4>
          </div>
          <p className="text-lg text-slate-200 font-semibold mb-6">{data.inlineCheck.question}</p>
          <div className="space-y-3">
            {data.inlineCheck.options.map((opt: any, idx: number) => {
              const isSelected = selectedOpt === idx;
              const isCorrectAnswer = data.inlineCheck.correctIndex === idx;
              const showSuccess = isSubmitted && isCorrectAnswer;
              const showError = isSubmitted && isSelected && !isCorrectAnswer;

              let btnClass = "border-white/10 hover:bg-white/5 text-slate-300 bg-transparent";
              if (isSelected && !isSubmitted) btnClass = "border-indigo-400 bg-indigo-500/10 text-white";
              if (showSuccess) btnClass = "border-emerald-500 bg-emerald-500/10 text-emerald-400";
              if (showError) btnClass = "border-rose-500 bg-rose-500/10 text-rose-400";

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => handleCheck(idx)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between font-bold ${btnClass}`}
                >
                  <span>{opt}</span>
                  {showSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {showError && <X className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>
          
          <AnimatePresence>
            {isSubmitted && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className={`mt-6 p-4 rounded-xl text-sm font-semibold flex items-start gap-3 ${selectedOpt === data.inlineCheck.correctIndex ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/10 text-slate-300'}`}
              >
                <Lightbulb className="w-5 h-5 shrink-0" />
                <p>{data.inlineCheck.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export const CheckpointSection = ({ data }: any) => (
  <div id={data.id} className="mb-20 scroll-mt-24 py-8 border-y-2 border-slate-100 border-dashed flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
      <Flame className="w-8 h-8 text-amber-500 fill-amber-500" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-2">{data.title}</h3>
    <p className="text-slate-600 font-medium max-w-md">{data.message}</p>
  </div>
);

export const RealWorldSection = ({ data }: any) => (
  <div id={data.id} className="mb-20 scroll-mt-24">
    <h2 className="text-3xl font-black text-slate-900 mb-6">{data.title}</h2>
    <div className="space-y-4">
      {data.scenarios?.map((scenario: any, idx: number) => (
        <div key={idx} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
             <Briefcase className="text-slate-500" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-lg mb-2">{scenario.context}</h4>
            <p className="text-slate-700 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: scenario.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>') }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MistakesSection = ({ data }: any) => (
  <div id={data.id} className="mb-20 scroll-mt-24">
    <h2 className="text-3xl font-black text-slate-900 mb-6">{data.title}</h2>
    <div className="space-y-4">
      {data.items?.map((item: any, idx: number) => (
        <div key={idx} className="bg-rose-50 border-2 border-rose-100 rounded-2xl p-6">
          <h4 className="font-bold text-rose-900 text-lg mb-2">{item.mistake}</h4>
          <p className="text-rose-800 font-medium text-sm mb-4">{item.reason}</p>
          <div className="bg-white rounded-xl p-4 border border-rose-200">
            <span className="font-black text-emerald-600 text-xs uppercase tracking-widest block mb-1">The Fix</span>
            <p className="text-slate-700 font-bold">{item.fix}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const DrillTeaser = ({ data }: any) => (
  <div id={data.id} className="mt-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-1 shadow-2xl scroll-mt-24">
    <div className="bg-white rounded-[1.8rem] p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between relative overflow-hidden">
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="flex-1 text-center md:text-left relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest mb-4 border border-emerald-200/50">
          <Award size={14} className="fill-emerald-600" /> Final Milestone
        </div>
        <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">{data.title}</h3>
        <p className="text-slate-600 font-medium text-lg mb-6 max-w-md">{data.description}</p>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Target className="w-4 h-4 text-indigo-500" /> {data.questionCount} Questions
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {data.passMark} to Pass
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto shrink-0 flex flex-col items-center bg-slate-50 p-6 rounded-2xl border-2 border-slate-100 z-10">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
          <Trophy className="w-10 h-10 text-amber-500 fill-amber-400" />
        </div>
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 text-center">Reward<br/><span className="text-amber-600 text-lg">+{data.rewardXP} XP</span></p>
        <Button variant="primary" className="w-full shadow-emerald-500/25 shadow-xl text-base py-4 rounded-xl">
          Begin Challenge <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  </div>
);
