import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { AIPersonality } from './types';
import { getPersonalityLogo } from '@/components/Icons/AIPersonalityLogos';

interface VoiceRecordingBubbleProps {
  personality: AIPersonality;
}

const VoiceRecordingBubble: React.FC<VoiceRecordingBubbleProps> = ({ personality }) => {
  const PersonalityIcon = getPersonalityLogo(personality.iconId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-white/70 via-white/30 to-slate-100/50 dark:from-slate-900/75 dark:via-slate-900/55 dark:to-slate-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_20px_rgba(15,23,42,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.24)] border border-white/70 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-xl transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <PersonalityIcon size={18} className="text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" aria-hidden="true"></div>
          <div
            className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
            aria-hidden="true"
          ></div>
          <div
            className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
            aria-hidden="true"
          ></div>
        </div>
      </div>
    </motion.div>
  );
};

export default VoiceRecordingBubble;
