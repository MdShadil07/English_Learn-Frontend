import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Heart, Lock, MessageSquareHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ToneSentimentCardProps {
  isPremium: boolean;
  hasData?: boolean;
  onUpgradeClick?: () => void;
}

const mockToneData = [
  { name: 'Confident', value: 85, color: '#10b981' },
  { name: 'Polite', value: 92, color: '#3b82f6' },
  { name: 'Casual', value: 45, color: '#f59e0b' },
  { name: 'Hesitant', value: 15, color: '#ef4444' },
];

const ToneSentimentCard: React.FC<ToneSentimentCardProps> = ({ isPremium, hasData = true, onUpgradeClick }) => {
  if (!isPremium) {
    return (
      <div className="relative w-full h-full min-h-[350px] rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 overflow-hidden group">
        {/* Blurred Background Preview */}
        <div className="absolute inset-0 p-6 opacity-30 blur-[4px] pointer-events-none select-none flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-lg">Tone & Sentiment Analysis</h3>
          </div>
          <div className="flex-1 w-full flex items-end justify-between px-4 gap-2">
            <div className="w-full bg-emerald-500/50 rounded-t-lg h-3/4"></div>
            <div className="w-full bg-blue-500/50 rounded-t-lg h-full"></div>
            <div className="w-full bg-amber-500/50 rounded-t-lg h-2/5"></div>
            <div className="w-full bg-rose-500/50 rounded-t-lg h-1/5"></div>
          </div>
        </div>

        {/* Lock Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/20 mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Understand Your Impact</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
            Unlock Premium to reveal how your spoken and written English sounds to natives (Confident, Polite, Hesitant).
          </p>
          <Button
            onClick={onUpgradeClick}
            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-8 shadow-xl shadow-rose-500/20"
          >
            Unlock Premium Features
          </Button>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="w-full h-full min-h-[350px] rounded-3xl bg-white dark:bg-[#050C14] border border-rose-200 dark:border-rose-900/30 p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 blur-[80px] pointer-events-none"></div>
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
          <MessageSquareHeart className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Tone Data Yet</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[250px]">
          Interact with the AI to receive emotional intelligence and tone analysis on your communication!
        </p>
      </div>
    );
  }

  // Premium View
  return (
    <div className="w-full h-full min-h-[350px] rounded-3xl bg-white dark:bg-[#050C14] border border-rose-200 dark:border-rose-900/30 p-6 flex flex-col shadow-sm relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 dark:bg-rose-500/10 blur-[80px] pointer-events-none"></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Tone & Sentiment</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini NLP Analysis</p>
        </div>

        <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full">
          <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Highly Professional</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex-1 w-full min-h-[180px] relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockToneData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }} width={70} />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.02)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
              {mockToneData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Insight */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 relative z-10">
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong className="text-rose-600 dark:text-rose-500 font-bold">Communication Profile:</strong> You sound highly polite and confident in 92% of your responses. Your hesitation markers (like "uh", "um") have decreased by 15% this week.
        </p>
      </div>
    </div>
  );
};

export default ToneSentimentCard;
