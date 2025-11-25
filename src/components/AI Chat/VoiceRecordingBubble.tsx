import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { AIPersonality } from './types';
import { getPersonalityIcon } from '@/components/Icons/AIPersonalityIcons';

interface VoiceRecordingBubbleProps {
  personality: AIPersonality;
}

const VoiceRecordingBubble: React.FC<VoiceRecordingBubbleProps> = ({ personality }) => {
  const PersonalityIcon = getPersonalityIcon(personality.iconId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800 dark:to-slate-700/80 shadow-lg border-2 border-emerald-200/70 dark:border-emerald-600/50 ring-1 ring-emerald-100/40 dark:ring-emerald-800/30"
        aria-hidden="true"
      >
        <PersonalityIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
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
