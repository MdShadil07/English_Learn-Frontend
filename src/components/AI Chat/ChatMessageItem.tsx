import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { AIPersonality, Message, UserSettings } from './types';
import { getPersonalityLogo } from '@/components/Icons/AIPersonalityLogos';
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
  const PersonalityIcon = getPersonalityLogo(selectedPersonality.iconId);
  const displayName = message.role === 'user' ? userName : selectedPersonality.name;
  const userInitial = userName.trim().charAt(0).toUpperCase() || 'U';
  
  const supportsFormatting = selectedPersonality.tier === 'pro' || selectedPersonality.tier === 'premium';
  const hasVisualFormatting = supportsFormatting && hasFormatting(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.12), ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex gap-3 sm:gap-4 group', message.role === 'user' ? 'justify-end' : 'justify-start')}
      role="listitem"
      aria-label={`${displayName} message`}
    >
      {/* AI Avatar — ml-1 so ring-offset doesn't get clipped by scroll container */}
      {message.role === 'assistant' && (
        <div className="shrink-0 mt-1 ml-1">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 ring-2 ring-emerald-400/50 dark:ring-emerald-400/60 ring-offset-2 ring-offset-slate-50 dark:ring-offset-[#050C14] shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:scale-105">
            <PersonalityIcon size={18} className="text-white drop-shadow-sm" />
          </div>
        </div>
      )}

      <div className={cn('flex max-w-[88%] flex-col gap-1.5 sm:max-w-[78%]', message.role === 'user' ? 'items-end' : 'items-start')}>
        {/* Sender label — always visible */}
        <span className={cn(
          'px-1 text-[10px] font-black uppercase tracking-[0.15em]',
          message.role === 'user'
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-500 dark:text-slate-400'
        )}>
          {displayName}
        </span>

        {/* Thinking Indicator */}
        {message.role === 'assistant' && message.isStreaming && !message.content ? (
          <ThinkingIndicator personalityName={selectedPersonality.name} />
        ) : message.role === 'user' ? (
          /* ── User bubble ── */
          <div className="relative overflow-hidden rounded-[1.5rem] rounded-tr-sm px-5 py-3.5 bg-gradient-to-br from-emerald-500 to-teal-500 shadow-[0_8px_30px_rgba(16,185,129,0.35)] text-white">
            <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-1/2 transition-transform duration-700 ease-out pointer-events-none" />
            <p className="whitespace-pre-wrap text-[15px] leading-7 sm:text-base sm:leading-8 font-medium relative z-10">
              {message.content}
              {message.isStreaming && message.content && (
                <motion.span 
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-white/80 ml-1 align-middle rounded-full" 
                  aria-hidden="true" 
                />
              )}
            </p>
          </div>
        ) : (
          /* ── AI bubble — border + corners on ONE element, never clipped ── */
          <div className="relative overflow-hidden rounded-[1.5rem] rounded-tl-sm border-2 border-slate-200 dark:border-emerald-500/50 bg-white dark:bg-[#0d1f35] shadow-[0_4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] px-5 py-4">
            {/* Emerald corner accent — top-left */}
            <div className="absolute top-0 left-0 w-12 h-[3px] bg-gradient-to-r from-emerald-400 via-emerald-300 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-[3px] h-12 bg-gradient-to-b from-emerald-400 via-emerald-300 to-transparent pointer-events-none" />

            {hasVisualFormatting ? (
              <FormattedAIMessage content={message.content} className="text-[15px] leading-7 sm:text-base sm:leading-8 text-slate-800 dark:text-slate-100 relative z-10" />
            ) : (
              <p className="whitespace-pre-wrap text-[15px] leading-7 sm:text-base sm:leading-8 text-slate-800 dark:text-slate-100 relative z-10">
                {message.content}
                {message.isStreaming && message.content && (
                  <motion.span 
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-0.5 h-4 bg-emerald-500 ml-1 align-middle rounded-full" 
                    aria-hidden="true" 
                  />
                )}
              </p>
            )}
          </div>
        )}
      </div>

      {/* User Avatar — mr-1 so ring-offset doesn't get clipped on the right */}
      {message.role === 'user' && (
        <div className="shrink-0 mt-1 mr-1">
          <Avatar className="h-10 w-10 ring-2 ring-emerald-400/50 dark:ring-emerald-500/60 ring-offset-2 ring-offset-white dark:ring-offset-[#050C14] shadow-lg shadow-emerald-500/20">
            {userAvatar && <AvatarImage src={userAvatar} alt={userName} className="object-cover rounded-full" />}
            <AvatarFallback className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-black text-white">
              {userInitial || <UserIcon className="h-5 w-5" aria-hidden="true" />}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessageItem;
