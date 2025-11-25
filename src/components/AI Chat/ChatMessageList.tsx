import React from 'react';
import { AnimatePresence } from 'framer-motion';

import { ScrollArea } from '@/components/ui/scroll-area';

import ChatMessageItem from './ChatMessageItem';
import TypingIndicator from './TypingIndicator';
import { AIPersonality, Message, UserSettings } from './types';

interface ChatMessageListProps {
  messages: Message[];
  selectedPersonality: AIPersonality;
  settings: UserSettings;
  loading: boolean;
  loadingBubble?: React.ReactNode; // Make optional since we're using TypingIndicator
  endRef: React.RefObject<HTMLDivElement>;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  selectedPersonality,
  settings,
  loading,
  endRef
}) => {
  return (
    <ScrollArea className="flex-1 p-6" role="log" aria-live="polite">
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <ChatMessageItem
              key={message.id}
              message={message}
              index={index}
              selectedPersonality={selectedPersonality}
              settings={settings}
            />
          ))}

          {/* ChatGPT-style typing indicator */}
          {loading && (
            <TypingIndicator 
              selectedPersonality={selectedPersonality}
              key="typing-indicator"
            />
          )}
        </AnimatePresence>

        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
