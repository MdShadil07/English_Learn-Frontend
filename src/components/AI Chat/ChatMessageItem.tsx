import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Target, User as UserIcon, Loader2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

import { AIPersonality, Message, UserSettings } from './types';
import { getPersonalityIcon } from '@/components/Icons/AIPersonalityIcons';
import { FormattedAIMessage, hasFormatting } from './FormattedAIMessage';
import { ThinkingIndicator } from './ThinkingIndicator';

interface ChatMessageItemProps {
  message: Message;
  index: number;
  selectedPersonality: AIPersonality;
  settings: UserSettings;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ 
  message, 
  index, 
  selectedPersonality, 
  settings
}) => {
  const PersonalityIcon = getPersonalityIcon(selectedPersonality.iconId);
  
  // Check if personality supports visual formatting (Pro/Premium)
  const supportsFormatting = selectedPersonality.tier === 'pro' || selectedPersonality.tier === 'premium';
  const hasVisualFormatting = supportsFormatting && hasFormatting(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
      role="listitem"
      aria-label={`${message.role === 'user' ? 'User' : 'Assistant'} message`}
    >
      {message.role === 'assistant' && (
        <div
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800 dark:to-slate-700/80 shadow-lg border-2 border-emerald-200/70 dark:border-emerald-600/50 ring-1 ring-emerald-100/40 dark:ring-emerald-800/30"
          aria-hidden="true"
        >
          <PersonalityIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      <div className="flex flex-col gap-2 max-w-[80%]">
        {/* Show thinking indicator when AI message is empty and streaming */}
        {message.role === 'assistant' && message.isStreaming && !message.content ? (
          <ThinkingIndicator personalityName={selectedPersonality.name} />
        ) : (
          <div
            className={cn(
              'p-4 rounded-2xl shadow-sm relative',
              message.role === 'user'
                ? 'bg-emerald-500 text-white rounded-tr-none'
                : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none'
            )}
          >
            {message.role === 'assistant' && hasVisualFormatting ? (
              <FormattedAIMessage content={message.content} />
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
                {message.isStreaming && message.content && (
                  <motion.span 
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-current ml-1 align-middle" 
                    aria-hidden="true" 
                  />
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {message.role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <UserIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
