import React from 'react';
import { Send, Mic, MicOff, Volume2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { AIPersonality, UserSettings } from './types';

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
  characterCount?: number;
  maxCharacters?: number;
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  input,
  onInputChange,
  onSend,
  loading,
  isRecording,
  onToggleRecording,
  settings,
  selectedPersonality,
  onKeyPress,
  characterCount = 0,
  maxCharacters = 500
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange(event.target.value);
  };

  return (
    <div className="relative px-4 py-3">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            onKeyPress={onKeyPress}
            placeholder={`Message ${selectedPersonality.name}...`}
            disabled={loading}
            className={cn(
              "min-h-[44px] max-h-48 resize-none overflow-y-auto bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl",
              "border-emerald-200/30 dark:border-emerald-700/30 focus:border-emerald-400 dark:focus:border-emerald-600",
              "pl-12 pr-20 rounded-2xl"
            )}
            rows={1}
          />
          
          {/* Mic button inside input on the left */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleRecording}
            disabled={loading}
            className={cn(
              'absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8',
              'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800',
              isRecording && 'text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 animate-pulse'
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          {/* Character count on the right */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
            {characterCount}/{maxCharacters}
          </div>
        </div>

        <Button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className={cn(
            "bg-gradient-to-r shadow-lg transition-all duration-200",
            `from-${selectedPersonality.color}-500 to-${selectedPersonality.color}-600`,
            `hover:from-${selectedPersonality.color}-600 hover:to-${selectedPersonality.color}-700`,
            `text-white shadow-${selectedPersonality.color}-200/50 dark:shadow-${selectedPersonality.color}-900/20`,
            "rounded-xl"
          )}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Input hints */}
      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
        <span>Press Enter to send, Shift+Enter for new line</span>
        {settings.voiceEnabled && (
          <span className="flex items-center gap-1">
            <Volume2 className="h-3 w-3" />
            Voice responses enabled
          </span>
        )}
        {isRecording && (
          <span className="flex items-center gap-1 text-red-500">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Recording...
          </span>
        )}
      </div>
    </div>
  );
};

export default ChatInputArea;
