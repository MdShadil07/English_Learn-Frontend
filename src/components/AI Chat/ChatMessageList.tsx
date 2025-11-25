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
  // Limit the number of rendered messages to avoid huge DOM trees and reduce re-renders
  const VISIBLE_MESSAGE_LIMIT = 200;
  const visibleMessages = React.useMemo(() => {
    if (messages.length <= VISIBLE_MESSAGE_LIMIT) return messages;
    return messages.slice(messages.length - VISIBLE_MESSAGE_LIMIT);
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-6" role="log" aria-live="polite" onScroll={() => { /* noop placeholder for scroll handling */ }}>
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {visibleMessages.map((message, index) => (
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
