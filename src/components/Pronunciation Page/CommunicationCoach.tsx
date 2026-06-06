import React, { useEffect, useState } from 'react';
import { pronunciationService } from '@/services/pronunciationService';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle, BookOpen, GraduationCap, Mic, Sparkles, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CommunicationCoach({ attempt }: { attempt: any }) {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState<any>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'error' | 'locked'>('idle');
  const [message, setMessage] = useState('');
  const isPremium = user?.tier === 'premium' || user?.isPremium === true;

  useEffect(() => {
    if (!attempt) return;
    if (!isPremium) {
      setState('locked');
      setMessage('Communication Coach AI is available for Premium users.');
      setAnalysis(null);
      return;
    }

    if (attempt.coachAnalysis) {
      setAnalysis(attempt.coachAnalysis);
      setState('ready');
      setMessage('');
      return;
    }

    setState('loading');
    setMessage('');

    (async () => {
      try {
        const response = await pronunciationService.analyzeCoach(attempt);
        const payload = (response as any)?.data;
        if (payload?.analysis) {
          setAnalysis(payload.analysis);
          setState('ready');
          return;
        }

        setState('error');
        setMessage('Communication coach response was empty. Please retry.');
      } catch (error: any) {
        const code = error?.code || error?.response?.data?.code;
        if (code === 'PREMIUM_REQUIRED') {
          setState('locked');
          setMessage('Communication Coach AI is available for Premium users.');
        } else {
          setState('error');
          setMessage(error?.message || 'Coach analysis failed. Please retry.');
        }
      }
    })();
  }, [attempt, user?.tier, user?.isPremium]);

  if (!attempt) return null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f1219]">
      {/* Header with teacher persona styling */}
      <div className="bg-gradient-to-r from-indigo-900 to-[#1e1b4b] p-5 pb-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30">
            <div className="w-full h-full rounded-2xl bg-[#0f1219] flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-indigo-400" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-lg flex items-center gap-2">
              Nova Coach
              <span className="bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent text-[10px] uppercase tracking-widest font-black border border-amber-500/30 px-2 py-0.5 rounded-full ml-2 flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Premium
              </span>
            </h4>
            <p className="text-indigo-200/80 text-xs mt-0.5 font-medium tracking-wide uppercase">Strict Pronunciation Tutor</p>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-3 relative z-20 bg-white dark:bg-[#131722] rounded-t-3xl border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
        <AnimatePresence mode="wait">
          {state === 'locked' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-200 dark:border-amber-500/20">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">{message}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-[80%] leading-relaxed">Upgrade to unlock personalized strict feedback, AI-driven drill sessions, and detailed phonetic analysis.</p>
              <button className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all hover:-translate-y-0.5">
                Upgrade to Premium
              </button>
            </motion.div>
          ) : state === 'loading' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-10 flex flex-col items-center justify-center space-y-4">
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-500"
                    animate={{ y: [-4, 4, -4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium animate-pulse">Nova is analyzing your pronunciation patterns...</p>
            </motion.div>
          ) : analysis?.source === 'error-fallback' || state === 'error' ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-xl border border-rose-200 bg-rose-50 dark:border-rose-900/40 dark:bg-rose-950/20 text-rose-900 dark:text-rose-100 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-extrabold uppercase tracking-widest text-[10px] block mb-1">Analysis Failed</span>
                <p className="text-xs">{analysis?.narrative || message}</p>
              </div>
            </motion.div>
          ) : analysis ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              
              {/* Strict Narrative */}
              <div className="bg-slate-50 dark:bg-[#1A1F2B] rounded-2xl p-4 border-l-4 border-l-indigo-500 border border-slate-200 dark:border-slate-800/80 shadow-sm relative">
                <div className="absolute top-4 right-4 text-indigo-500/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h5 className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Mic className="w-3 h-3" /> Coach's Verdict
                </h5>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed relative z-10">
                  "{analysis.narrative}"
                </p>
              </div>

              {/* Drill Words Section */}
              {analysis.drillWords && analysis.drillWords.length > 0 && (
                <div>
                  <h5 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Volume2 className="w-3 h-3" /> Recommended Drill Session
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {analysis.drillWords.map((word: string, i: number) => (
                      <div key={i} className="group relative flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 rounded-xl transition-all cursor-pointer hover:shadow-md hover:shadow-indigo-500/10">
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">{word}</span>
                        <div className="w-5 h-5 rounded-md bg-white dark:bg-[#1A1F2B] flex items-center justify-center shadow-sm">
                          <Volume2 className="w-3 h-3 text-indigo-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 italic">Practice these words to target your specific weaknesses before the next exercise.</p>
                </div>
              )}

              {/* Suggestions */}
              <div>
                <h5 className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <BookOpen className="w-3 h-3" /> Action Items
                </h5>
                <ul className="space-y-2">
                  {analysis.suggestions.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 bg-white dark:bg-[#1A1F2B] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                      <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{i + 1}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
