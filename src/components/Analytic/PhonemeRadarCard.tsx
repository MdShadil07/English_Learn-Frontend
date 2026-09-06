import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Lock, Mic, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhonemeRadarCardProps {
  isPro: boolean;
  hasData?: boolean;
  onUpgradeClick?: () => void;
}

const mockPhonemeData = [
  { subject: '/θ/ (think)', A: 45, fullMark: 100 },
  { subject: '/ð/ (this)', A: 60, fullMark: 100 },
  { subject: '/r/ (red)', A: 85, fullMark: 100 },
  { subject: '/l/ (let)', A: 75, fullMark: 100 },
  { subject: '/v/ (van)', A: 50, fullMark: 100 },
  { subject: '/w/ (wet)', A: 90, fullMark: 100 },
];

const PhonemeRadarCard: React.FC<PhonemeRadarCardProps> = ({ isPro, hasData = true, onUpgradeClick }) => {
  if (!isPro) {
    return (
      <div className="relative w-full h-full min-h-[350px] rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 overflow-hidden group">
        {/* Blurred Background Preview */}
        <div className="absolute inset-0 p-6 opacity-30 blur-[4px] pointer-events-none select-none flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <Mic className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-lg">Phoneme-Level Radar</h3>
          </div>
          <div className="flex-1 w-full bg-slate-200/50 rounded-full scale-75"></div>
        </div>

        {/* Lock Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Deep Pronunciation Analytics</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
            Unlock Pro to see exactly which specific sounds (phonemes) you are mispronouncing so you can fix your accent.
          </p>
          <Button
            onClick={onUpgradeClick}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 shadow-xl shadow-blue-500/20"
          >
            Unlock Pro Features
          </Button>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="w-full h-full min-h-[350px] rounded-3xl bg-white dark:bg-[#050C14] border border-blue-200 dark:border-blue-900/30 p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none"></div>
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <Mic className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Pronunciation Data Yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
          Start speaking in the Practice Room to generate your real-time phoneme accuracy radar!
        </p>
      </div>
    );
  }

  // Pro View
  return (
    <div className="w-full h-full min-h-[350px] rounded-3xl bg-white dark:bg-[#050C14] border border-blue-200 dark:border-blue-900/30 p-6 flex flex-col shadow-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-[80px] pointer-events-none"></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Mic className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Phoneme Accuracy Radar</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by MFA Audio Alignment</p>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1.5 text-rose-500 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded border border-rose-200 dark:border-rose-500/20">
            <AlertTriangle className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Needs Work: /θ/</span>
          </div>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="flex-1 w-full min-h-[220px] relative z-10 -mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={mockPhonemeData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}
            />
            <Radar name="Accuracy %" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="mt-2 pt-4 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed flex items-start gap-2">
          <Activity className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <span>You substitute the <strong className="text-slate-900 dark:text-white font-bold">/θ/</strong> sound (as in "think") with a /t/ or /s/ sound 55% of the time. Practice placing your tongue between your teeth.</span>
        </p>
      </div>
    </div>
  );
};

export default PhonemeRadarCard;
