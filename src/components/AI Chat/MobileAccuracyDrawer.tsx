import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Hexagon, 
  Download, 
  TrendingUp
} from 'lucide-react';

// --- TYPES --- //
export type AccuracyBreakdown = {
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation: number;
  capitalization: number;
};

export interface Props {
  open: boolean;
  latest?: {
    accuracy: {
      score?: number;
      overall?: number;
      adjustedOverall?: number;
      label?: string;
      breakdown?: AccuracyBreakdown;
      grammar?: number;
      vocabulary?: number;
      spelling?: number;
      fluency?: number;
      punctuation?: number;
      capitalization?: number;
      readability?: any;
      tone?: any;
      style?: any;
      vocabularyAnalysis?: any;
      premiumFeatures?: any;
    };
    currentScore?: number;
    xpGained?: number;
    timestamp?: Date;
    isCached?: boolean;
  } | null;
  onClose: () => void;
}

// --- MAIN COMPONENT --- //
export default function MobileAccuracyDrawer({ open, latest, onClose }: Props) {
  if (!latest) return null;

  const accuracy = latest.accuracy;
  const score = Number(latest.currentScore ?? accuracy.score ?? accuracy.adjustedOverall ?? accuracy.overall ?? 0) || 0;
  const breakdown = accuracy.breakdown ?? {
    grammar: accuracy.grammar ?? 0,
    vocabulary: accuracy.vocabulary ?? 0,
    spelling: accuracy.spelling ?? 0,
    fluency: accuracy.fluency ?? 0,
    punctuation: accuracy.punctuation ?? 0,
    capitalization: accuracy.capitalization ?? 0
  };

  // Format timestamp
  const timeString = latest.timestamp 
    ? latest.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) 
    : 'Just now';

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col font-sans pointer-events-none">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-emerald-950/35 dark:bg-black/60 backdrop-blur-md pointer-events-auto"
            onClick={onClose}
          />

          {/* Top Attached Drawer (Apple-style top sheet) */}
          <motion.div
            initial={{ y: '-100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ 
              y: '-100%', 
              opacity: 0, 
              scale: 0.95,
              transition: { type: 'spring', damping: 25, stiffness: 200 }
            }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-full max-w-md mx-auto relative z-10 pointer-events-auto"
          >
            <div className="bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-slate-900 rounded-b-[2.5rem] p-6 shadow-2xl pb-8 border-b border-emerald-200 dark:bg-zinc-950 dark:bg-none dark:text-white dark:border-zinc-800 overflow-y-auto max-h-[85vh] scrollbar-hide">
              
              {/* Drag Handle (Visual only) */}
              <div className="w-12 h-1.5 bg-emerald-300 rounded-full mx-auto mb-6 dark:bg-white/20" />

              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <Hexagon className="w-[18px] h-[18px] text-emerald-500" strokeWidth={2.5} />
                  <span className="text-[13px] font-bold tracking-wider text-slate-900 dark:text-white">
                    LATEST ACCURACY
                  </span>
                  
                  {latest.isCached && (
                    <div className="flex items-center gap-1.5 bg-emerald-500/15 px-2 py-0.5 rounded-full ml-1 backdrop-blur-sm dark:bg-emerald-500/20">
                      <div className="bg-emerald-500 rounded-full p-[2px]">
                        <Download className="w-[8px] h-[8px] text-white dark:text-black" strokeWidth={3} />
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">Cached</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-500 dark:text-white/60">
                  {timeString}
                </span>
              </div>

              {/* Main Score & XP */}
              <div className="px-1">
                <h1 className="text-[4rem] font-bold text-emerald-600 tracking-tight leading-none mb-4 dark:text-emerald-400">
                  {score.toFixed(2)}%
                </h1>
                <div className="flex items-center justify-between">
                  <span className="text-[17px] font-medium text-slate-700 dark:text-white/80">
                    Overall performance
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-full shadow-sm dark:bg-white/10">
                    <TrendingUp className="w-[14px] h-[14px] text-emerald-400" strokeWidth={3} />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {latest.xpGained || 0} XP
                    </span>
                  </div>
                </div>
              </div>

              {/* White Breakdown Grid */}
              <div className="grid grid-cols-2 gap-y-7 gap-x-4 bg-emerald-50 rounded-[2rem] p-6 mt-8 shadow-inner dark:bg-white">
                <GridItem 
                  value={breakdown.grammar || 0} 
                  label="Grammar" 
                />
                <GridItem 
                  value={breakdown.vocabulary || 0} 
                  label="Vocabulary" 
                />
                <GridItem 
                  value={breakdown.spelling || 0} 
                  label="Spelling" 
                />
                <GridItem 
                  value={breakdown.fluency || 0} 
                  label="Fluency" 
                />
                <GridItem 
                  value={breakdown.punctuation || 0} 
                  label="Punctuation" 
                />
                <GridItem 
                  value={breakdown.capitalization || 0} 
                  label="Capitalization" 
                />
              </div>
              
              {/* Advanced NLP Insights */}
              {(accuracy.readability || accuracy.tone || accuracy.style || accuracy.premiumFeatures) && (
                <div className="mt-6 pt-6 border-t border-emerald-200 dark:border-zinc-800 flex flex-col gap-4">
                  <h3 className="text-sm font-bold text-slate-800 tracking-wide dark:text-white/90 uppercase mb-2 flex items-center gap-2">
                    <Hexagon className="w-4 h-4 text-emerald-500" />
                    Advanced Insights
                  </h3>
                  
                  {accuracy.readability && (
                    <div className="bg-white/60 dark:bg-zinc-900/50 p-4 rounded-xl border border-emerald-100 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Readability (Flesch)</span>
                        <span className="text-sm font-black dark:text-white">{accuracy.readability.fleschReadingEase ?? 'N/A'}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{accuracy.readability.recommendation || accuracy.readability.averageLevel}</p>
                    </div>
                  )}

                  {accuracy.tone && (
                    <div className="bg-white/60 dark:bg-zinc-900/50 p-4 rounded-xl border border-emerald-100 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Tone Analysis</span>
                        <span className="text-sm font-black dark:text-white capitalize">{accuracy.tone.overall ?? 'Neutral'}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Formality: {accuracy.tone.formalityScore}% | Assertiveness: {accuracy.tone.assertivenessScore}%</p>
                      {accuracy.tone.recommendations && accuracy.tone.recommendations.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-emerald-100/50 dark:border-zinc-800/50">
                          <p className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Tone Feedback:</p>
                          <ul className="text-[11px] text-slate-600 dark:text-slate-400 list-disc pl-3 flex flex-col gap-1">
                            {accuracy.tone.recommendations.map((rec: string, i: number) => (
                              <li key={i}>{rec}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {accuracy.vocabularyAnalysis && accuracy.vocabularyAnalysis.suggestions && accuracy.vocabularyAnalysis.suggestions.length > 0 && (
                    <div className="bg-white/60 dark:bg-zinc-900/50 p-4 rounded-xl border border-emerald-100 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Vocabulary Enhancements</span>
                      </div>
                      <ul className="text-[11px] text-slate-600 dark:text-slate-400 flex flex-col gap-2 mt-2">
                        {accuracy.vocabularyAnalysis.suggestions.map((sug: any, i: number) => (
                          <li key={i} className="flex flex-col">
                            <span className="font-semibold text-emerald-700 dark:text-emerald-300">"{sug.original}" ➔ {sug.suggested.join(', ')}</span>
                            {sug.reason && <span className="opacity-80 mt-0.5">{sug.reason}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {accuracy.style && (
                    <div className="bg-white/60 dark:bg-zinc-900/50 p-4 rounded-xl border border-emerald-100 dark:border-zinc-800">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Writing Style</span>
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                         <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                           <span>Passive Voice:</span>
                           <span className="font-semibold">{accuracy.style.passiveVoiceUsage ?? 0}%</span>
                         </div>
                         <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                           <span>Sentence Variance:</span>
                           <span className="font-semibold">{accuracy.style.sentenceLengthVariance ?? 0}</span>
                         </div>
                      </div>
                    </div>
                  )}
                  
                  {accuracy.premiumFeatures && accuracy.premiumFeatures.premiumBadges && accuracy.premiumFeatures.premiumBadges.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {accuracy.premiumFeatures.premiumBadges.map((badge: string, i: number) => (
                         <span key={i} className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                           {badge}
                         </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Close Button (Attached just below the drawer) */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="absolute -bottom-20 left-0 right-0 flex justify-center"
            >
              <button 
                onClick={onClose}
                className="w-14 h-14 rounded-full border border-emerald-200 bg-white/90 backdrop-blur-xl flex items-center justify-center text-emerald-950 hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all shadow-lg dark:border-zinc-800 dark:bg-black/80 dark:text-white dark:hover:bg-zinc-800"
              >
                <X className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </motion.div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Sub-component for the grid items
function GridItem({ value, label }: { value: number; label: string }) {
  const normalizedValue = Number(value) || 0;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-[22px] font-bold text-emerald-950 mb-1 leading-none tracking-tight dark:text-black">
        {normalizedValue.toFixed(2)}%
      </span>
      <span className="text-[14px] font-bold text-emerald-700 dark:text-zinc-400">
        {label}
      </span>
    </div>
  );
}