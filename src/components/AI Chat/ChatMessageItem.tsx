import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  userName?: string;
  userAvatar?: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ 
  message, 
  index, 
  selectedPersonality, 
  settings,
  userName = 'You',
  userAvatar
}) => {
  const PersonalityIcon = getPersonalityIcon(selectedPersonality.iconId);
  const displayName = message.role === 'user' ? userName : selectedPersonality.name;
  const userInitial = userName.trim().charAt(0).toUpperCase() || 'U';
  
  // Check if personality supports visual formatting (Pro/Premium)
  const supportsFormatting = selectedPersonality.tier === 'pro' || selectedPersonality.tier === 'premium';
  const hasVisualFormatting = supportsFormatting && hasFormatting(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.02, 0.12) }}
      className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
      role="listitem"
      aria-label={`${displayName} message`}
    >
      {message.role === 'assistant' && (
        <div
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800 dark:to-slate-700/80 shadow-lg border-2 border-emerald-200/70 dark:border-emerald-600/50 ring-1 ring-emerald-100/40 dark:ring-emerald-800/30"
          aria-hidden="true"
        >
          <PersonalityIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
        </div>
      )}

      <div className={cn('flex max-w-[80%] flex-col gap-1.5', message.role === 'user' ? 'items-end' : 'items-start')}>
        <span
          className={cn(
            'max-w-full truncate px-1 text-xs font-semibold',
            message.role === 'user'
              ? 'text-emerald-700 dark:text-emerald-300'
              : 'text-slate-600 dark:text-slate-300'
          )}
        >
          {displayName}
        </span>

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
        <Avatar className="h-10 w-10 flex-shrink-0 border-2 border-emerald-200 shadow-md dark:border-emerald-700">
          {userAvatar && <AvatarImage src={userAvatar} alt={userName} className="object-cover" />}
          <AvatarFallback className="bg-emerald-500 text-sm font-semibold text-white">
            {userInitial || <UserIcon className="h-5 w-5" aria-hidden="true" />}
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
