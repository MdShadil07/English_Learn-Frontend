import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity, BarChart3, AlertTriangle, CheckCircle2, ChevronRight, Mic2, Sparkles, BookOpen } from 'lucide-react';

export default function DetailedPronunciationAnalysis({ attemptResult, onClose }: { attemptResult: any, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState('phonemes');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'low': return 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const tabs = [
    { id: 'phonemes', label: 'Phoneme Timeline', icon: Activity },
    { id: 'prosody', label: 'Prosody & Intonation', icon: BarChart3 },
    { id: 'drills', label: 'Recommended Drills', icon: BookOpen },
    { id: 'diagnostics', label: 'Engine Diagnostics', icon: Mic2 },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-6xl h-[85vh] bg-white dark:bg-[#0b0e14] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#131722]/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Detailed Pronunciation Feedback</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">In-depth analysis of your reading attempt</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 p-4 flex flex-col gap-2 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                    ? 'bg-white dark:bg-[#1A1F2B] text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent'
                  }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-500' : 'opacity-70'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-[#0b0e14]">
            
            {/* PHONEMES TAB */}
            {activeTab === 'phonemes' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Phoneme Level Breakdown</h3>
                  <div className="flex gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Match</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Substitution</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-500"></div> Deletion</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Insertion</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-[#131722] border-b border-slate-200 dark:border-slate-800">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Word</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Expected</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actual</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue Type</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Severity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {attemptResult?.phonemeAnalysis?.map((pa: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-[#131722]/50 transition-colors">
                          <td className="p-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{pa.word || '—'}</td>
                          <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">/{pa.expected || '—'}/</td>
                          <td className="p-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                            <span className={pa.issueType !== 'match' ? 'text-rose-500 font-bold' : 'text-emerald-500'}>
                              /{pa.actual || '—'}/
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider
                              ${pa.issueType === 'match' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                pa.issueType === 'substitution' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                                pa.issueType === 'deletion' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400' :
                                'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              }`}>
                              {pa.issueType}
                            </span>
                          </td>
                          <td className="p-4">
                            {pa.issueType !== 'match' ? (
                              <span className={`px-2 py-1 border rounded-md text-[10px] font-bold uppercase ${getSeverityColor(pa.severity || 'low')}`}>
                                {pa.severity || 'low'}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* PROSODY TAB */}
            {activeTab === 'prosody' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Prosody & Intonation Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(attemptResult?.prosodyAnalysis || {}).map(([key, value]: [string, any]) => {
                    if (typeof value !== 'number') return null;
                    return (
                      <div key={key} className="bg-slate-50 dark:bg-[#131722] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">
                          {Number.isInteger(value) ? value : value.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* DRILLS TAB */}
            {activeTab === 'drills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Personalized Drill Recommendations</h3>
                <div className="space-y-4">
                  {attemptResult?.drillRecommendations?.length > 0 ? (
                    attemptResult.drillRecommendations.map((drill: any, i: number) => (
                      <div key={i} className="flex gap-4 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                        <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white capitalize mb-1">{drill.type.replace(/_/g, ' ')}</h4>
                          {drill.word && <p className="text-xs font-semibold text-indigo-500 mb-2">Target Word: {drill.word}</p>}
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{drill.instruction}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Specific Drills Required</h4>
                      <p className="text-slate-500">Your pronunciation was excellent! Keep practicing regular passages.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* DIAGNOSTICS TAB */}
            {activeTab === 'diagnostics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Engine Diagnostics & Metadata</h3>
                <div className="bg-slate-50 dark:bg-[#131722] rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                  <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(attemptResult?.metadata || {}, null, 2)}
                  </pre>
                </div>
                {attemptResult?.metadata?.mtiLikelihood && (
                  <div className="bg-rose-50 dark:bg-rose-500/10 rounded-2xl p-6 border border-rose-200 dark:border-rose-500/20 mt-6">
                    <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Mother Tongue Influence (MTI) Detection
                    </h4>
                    <p className="text-sm text-rose-700 dark:text-rose-400 mb-4">
                      Detected Label: <span className="font-bold">{attemptResult.metadata.mtiLikelihood.label}</span> 
                      ({Math.round(attemptResult.metadata.mtiLikelihood.confidence * 100)}% confidence)
                    </p>
                    <ul className="list-disc pl-5 text-xs text-rose-600 dark:text-rose-300 space-y-1">
                      {attemptResult.metadata.mtiLikelihood.reasons.map((r: string, i: number) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
