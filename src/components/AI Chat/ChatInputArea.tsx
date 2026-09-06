import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIPersonality, UserSettings } from './types';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';

interface ChatInputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  loading: boolean;
  isRecording: boolean;
  onToggleRecording: () => void;
  settings: UserSettings;
  selectedPersonality: AIPersonality;
  onKeyPress: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  loading,
  isRecording: isVoiceMode,
  onToggleRecording,
  settings,
  selectedPersonality,
  onKeyPress,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const MIN_H = 36;
  const MAX_H = 140;

  // Track what the input was before voice recording started
  const originalInputRef = useRef(input);
  const pendingTranscriptRef = useRef('');

  // Use the new simplified voice hook
  const { isRecording, isProcessing, toggleRecording, stopRecording } = useVoiceRecognition({
    language: settings.language,
    onTranscriptChange: (transcript) => {
      // Just keep track of it in the background, do not update UI live
      pendingTranscriptRef.current = transcript;
    },
    onEnd: () => {
      // When recording stops (either naturally or manually), flush the text to the input box
      if (pendingTranscriptRef.current.trim()) {
        const prefix = originalInputRef.current.trim();
        const newText = prefix ? `${prefix} ${pendingTranscriptRef.current}` : pendingTranscriptRef.current;
        onInputChange(newText);
      }
      
      // Reset the pending transcript
      pendingTranscriptRef.current = '';

      // Sync state back to the parent
      if (isVoiceMode) {
        onToggleRecording();
      }
    }
  });

  // Sync external state with internal hook
  useEffect(() => {
    if (isVoiceMode && !isRecording && !isProcessing) {
      originalInputRef.current = input;
      toggleRecording();
    } else if (!isVoiceMode && isRecording) {
      stopRecording();
    }
  }, [isVoiceMode]);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const next = Math.min(Math.max(el.scrollHeight, MIN_H), MAX_H);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > MAX_H ? 'auto' : 'hidden';
  }, [input]);

  const hasContent = input.trim().length > 0;
  const isInputDisabled = loading || isProcessing;

  return (
    <div className="px-3 pb-3 pt-1.5 w-full">
      <motion.div
        key="text-input"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="group/input relative overflow-hidden rounded-[20px] border border-white/60 dark:border-emerald-500/20 bg-white/40 dark:bg-[#050C14]/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.06)] backdrop-blur-2xl transition-all duration-500 hover:bg-white/60 dark:hover:bg-[#050C14]/80 focus-within:border-emerald-300/70 dark:focus-within:border-emerald-500/40 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.08),0_8px_30px_rgba(0,0,0,0.06)] dark:focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.12),0_8px_30px_rgba(16,185,129,0.08)]"
      >
        {/* Animated emerald orb — top-left (matches dashboard) */}
        <motion.div
          className="pointer-events-none absolute -top-6 -left-6 h-24 w-24 rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-[40px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Animated teal orb — bottom-right (matches dashboard) */}
        <motion.div
          className="pointer-events-none absolute -bottom-6 -right-6 h-20 w-20 rounded-full bg-teal-300/20 dark:bg-teal-600/10 blur-[40px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Holographic sweep on hover (matches dashboard board effect) */}
        <div className="pointer-events-none absolute inset-0 w-[200%] translate-x-[-100%] bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent transition-transform duration-1000 ease-in-out group-hover/input:translate-x-[50%]" />

        {/* Inner row */}
        <div className="relative z-10 flex items-end gap-2 px-3 py-2.5">

          {/* Mic button - Now pulses when listening */}
          <button
            onClick={onToggleRecording}
            disabled={isInputDisabled}
            aria-label={isRecording ? "Stop recording" : "Start Voice Mode"}
            className={cn(
              'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
              isRecording 
                ? 'bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse' 
                : 'text-slate-400 dark:text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400',
              isProcessing && 'cursor-wait opacity-50'
            )}
          >
            {isProcessing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent text-emerald-500" />
            ) : isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              // If they type while recording, we update the base input
              if (isRecording) {
                originalInputRef.current = e.target.value;
              }
              onInputChange(e.target.value);
            }}
            onKeyDown={onKeyPress as unknown as React.KeyboardEventHandler<HTMLTextAreaElement>}
            placeholder={isProcessing ? 'Transcribing...' : isRecording ? 'Listening...' : `Message ${selectedPersonality.name}…`}
            disabled={isInputDisabled}
            rows={1}
            className={cn(
              'flex-1 resize-none bg-transparent outline-none border-none',
              'min-h-[36px] py-1.5',
              'text-[14px] leading-6 text-slate-800 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'disabled:cursor-not-allowed disabled:opacity-50',
            )}
          />

          {/* Send button — emerald gradient matching dashboard accent */}
          <motion.button
            whileHover={hasContent && !isInputDisabled ? { scale: 1.06 } : {}}
            whileTap={hasContent && !isInputDisabled ? { scale: 0.94 } : {}}
            onClick={() => {
               if (isRecording) {
                 stopRecording();
                 onToggleRecording();
               }
               onSend();
            }}
            disabled={isInputDisabled || !hasContent}
            aria-label="Send message"
            className={cn(
              'mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
              hasContent && !isInputDisabled
                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)]'
                : 'cursor-not-allowed border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 text-slate-300 dark:text-slate-600'
            )}
          >
            {loading
              ? <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              : <Send className="h-3.5 w-3.5" />
            }
          </motion.button>
        </div>

        {/* Bottom hint bar */}
        <div className="relative z-10 flex items-center gap-3 border-t border-white/40 dark:border-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400 dark:text-slate-600">
          <span>↵ Send</span>
          <span className="opacity-40">·</span>
          <span>⇧↵ New line</span>
          {settings.voiceEnabled && (
            <span className="ml-auto flex items-center gap-1 text-emerald-500 dark:text-emerald-500/60">
              <Volume2 className="h-2.5 w-2.5" />
              Voice on
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInputArea;
