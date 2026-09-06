import React from 'react';
import { motion } from 'framer-motion';
import AnimatedVisual from './Visuals/AnimatedVisuals';

export default function PhenomenaPanel({ attempt }) {
  const profile = attempt?.phonologicalProfile;
  const phenomena = attempt?.phenomena || [];
  const semanticClassification = attempt?.trustSignals?.semantic?.classification;
  const prosody = attempt?.prosodyAnalysis || {};
  const hasTrustFallback = ['wrong_passage', 'random_speech', 'native_language', 'low_audio_quality'].includes(semanticClassification);
  const severity = attempt?.trustSignals?.severity?.label || (attempt?.severity >= 4 ? 'critical' : attempt?.severity >= 3 ? 'major' : attempt?.severity >= 2 ? 'moderate' : 'minor');
  const severityTone = severity === 'critical'
    ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800/50'
    : severity === 'major'
    ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50'
    : severity === 'moderate'
    ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50'
    : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800/50';

  return (
    <div className="rounded-2xl border border-slate-200/60 dark:border-emerald-500/20 bg-white/80 dark:bg-[#050C14]/60 p-4">
      <h4 className="font-extrabold text-sm mb-2">Pronunciation Patterns</h4>
      {profile ? (
        <div className="mb-3">
          <p className="text-xs text-slate-500 mb-2">Detected pattern strengths</p>
          <div className="flex flex-wrap gap-2">{Object.entries(profile.patternScores || {}).map(([k,v]) => (
            <div key={k} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-[#050C14] text-xs font-bold border dark:border-emerald-500/20">
              {k.replace(/_/g,' ')}: {Math.round(Number(v) * 100)}%
            </div>
          ))}</div>
        </div>
      ) : <p className="text-xs text-slate-400">No pattern profile available.</p>}

      {prosody && typeof prosody === 'object' && (
        <div className="mb-3 rounded-xl border border-slate-200/70 dark:border-emerald-500/20 bg-slate-50/70 dark:bg-[#050C14]/30 p-3">
          <div className="flex items-center justify-between gap-2 mb-2">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Prosody</p>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityTone}`}>{severity}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-white/80 dark:bg-[#050C14]/60 p-2 border border-slate-200/60 dark:border-emerald-500/20">
              <div className="text-slate-400 uppercase tracking-widest font-semibold">Speech rate</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">{Math.round(prosody.averageSpeakingRate || 0)} wpm</div>
            </div>
            <div className="rounded-lg bg-white/80 dark:bg-[#050C14]/60 p-2 border border-slate-200/60 dark:border-emerald-500/20">
              <div className="text-slate-400 uppercase tracking-widest font-semibold">Pauses</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">{prosody.pauseCount || 0} / {Math.round(prosody.pauseTotalMs || 0)} ms</div>
            </div>
            <div className="rounded-lg bg-white/80 dark:bg-[#050C14]/60 p-2 border border-slate-200/60 dark:border-emerald-500/20">
              <div className="text-slate-400 uppercase tracking-widest font-semibold">Rhythm</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">Variance {Math.round((prosody.rhythmVariance || 0) * 100)}%</div>
            </div>
            <div className="rounded-lg bg-white/80 dark:bg-[#050C14]/60 p-2 border border-slate-200/60 dark:border-emerald-500/20">
              <div className="text-slate-400 uppercase tracking-widest font-semibold">Hesitation</div>
              <div className="font-bold text-slate-800 dark:text-slate-100">{prosody.hesitationCount || 0} long gaps</div>
            </div>
          </div>
        </div>
      )}

      {phenomena.length ? (
        <div>
          <p className="text-xs text-slate-500 mb-2">Phenomena</p>
          <div className="space-y-3">
            {phenomena.map((p) => (
              <div key={p.id} className="flex items-start gap-3">
                <motion.div
                  className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-[#050C14] flex items-center justify-center border border-slate-200 dark:border-emerald-500/20"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1 + (p.confidence || 0) * 0.25, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                >
                  {p.visual?.svg ? (
                    <div style={{ width: 48, height: 48 }} dangerouslySetInnerHTML={{ __html: p.visual.svg }} />
                  ) : (
                    <AnimatedVisual keyName={p.visualKey || p.visual?.key || ''} />
                  )}
                </motion.div>
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="font-bold text-sm">{p.name}</h5>
                    <span className="text-xs text-slate-400">{Math.round((p.confidence||0)*100)}%</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{p.evidence?.join(' ')}</p>
                  <div className="mt-2 text-xs text-slate-600">{p.drills?.map(d=>d.instruction).slice(0,2).join(' • ')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : hasTrustFallback ? (
        <div className="rounded-xl border border-rose-200/70 dark:border-rose-900/40 bg-rose-50/70 dark:bg-rose-950/20 p-3">
          <div className="flex items-start gap-3">
            <motion.div
              className="w-14 h-14 rounded-xl bg-white/80 dark:bg-slate-900/80 flex items-center justify-center border border-rose-200/70 dark:border-rose-800/60"
              initial={{ scale: 0.92 }}
              animate={{ scale: [0.92, 1.02, 0.92] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              <AnimatedVisual keyName="tongue_retract" />
            </motion.div>
            <div>
              <h5 className="font-bold text-sm text-rose-700 dark:text-rose-300">Wrong passage spoken</h5>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Read the displayed English passage exactly as shown. The system will not trust phoneme feedback until the passage matches.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-slate-400">No phenomena detected.</p>
      )}
    </div>
  );
}
