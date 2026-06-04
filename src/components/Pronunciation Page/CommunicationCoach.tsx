import React, { useEffect, useState } from 'react';
import { pronunciationService } from '@/services/pronunciationService';
import { useAuth } from '@/contexts/AuthContext';
import { AlertTriangle } from 'lucide-react';


export default function CommunicationCoach({ attempt }) {
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

    // If server provides analysis in attempt, use it; otherwise we'd fetch /api/pronunciation/coach/analyze
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

  const sourceLabel = analysis?.source === 'gemini-flash'
    ? 'Gemini Flash'
    : analysis?.source === 'heuristic-fallback'
    ? 'Fallback coach'
    : analysis?.source === 'error-fallback'
    ? 'Service Error'
    : 'Coach';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Communication Coach</h4>
        <span className={`text-[10px] font-extrabold uppercase tracking-widest rounded-full px-2 py-1 border ${analysis?.source === 'gemini-flash' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/20 dark:text-emerald-300' : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'}`}>
          {sourceLabel}
        </span>
      </div>
      {state === 'locked' ? (
        <p className="text-xs text-amber-600 mt-3">{message}</p>
      ) : analysis?.source === 'error-fallback' ? (
        <div className="mt-3 rounded-lg border border-rose-200/70 bg-rose-50/70 dark:border-rose-900/40 dark:bg-rose-950/20 p-3 text-xs text-rose-900 dark:text-rose-100 flex items-start gap-2">
           <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
           <div>
             <span className="font-extrabold uppercase tracking-widest text-[10px] block mb-1">Service Unavailable</span>
             {analysis.narrative}
           </div>
        </div>
      ) : analysis ? (
        <div className="mt-3 text-sm space-y-3">
          <p className="font-medium text-slate-800 dark:text-slate-100 leading-relaxed">{analysis.narrative}</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">WPM</div>
              <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{Number(analysis.metrics?.wps || 0).toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Fillers</div>
              <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{analysis.metrics?.fillerCount || 0}</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 p-2">
              <div className="text-[10px] uppercase tracking-widest text-slate-400">Pause</div>
              <div className="mt-1 font-bold text-slate-900 dark:text-slate-100">{Math.round(analysis.metrics?.avgPauseMs || 0)}ms</div>
            </div>
          </div>
          {analysis.focus ? (
            <div className="rounded-lg border border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-3 text-xs text-emerald-900 dark:text-emerald-100">
              <span className="font-extrabold uppercase tracking-widest text-[10px] block mb-1">Focus</span>
              {analysis.focus}
              {analysis.summary ? <div className="mt-1 text-emerald-800/80 dark:text-emerald-200/80">{analysis.summary}</div> : null}
            </div>
          ) : null}
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Next drills</p>
            <ul className="space-y-2">
              {analysis.suggestions.map((s:string, i:number)=>(
                <li key={i} className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-slate-700 dark:text-slate-200">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : state === 'error' ? (
        <p className="text-xs text-rose-500 mt-3">{message || 'Coach analysis failed.'}</p>
      ) : (
        <p className="text-xs text-slate-500 mt-3">Reviewing fluency, hesitation, and pacing...</p>
      )}
    </div>
  );
}
