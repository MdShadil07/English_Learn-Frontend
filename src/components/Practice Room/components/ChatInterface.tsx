import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Paperclip } from 'lucide-react';

import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface ChatInterfaceProps {
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}

const ChatInterface = ({
  messages,
  currentUserId,
  onSendMessage,
  participants
}: ChatInterfaceProps) => {
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getParticipantInfo = (senderId: string) => {
    return participants.find(p => p.id === senderId);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border flex flex-col h-full"
    >
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-semibold text-gray-900">Room Chat</h3>
        <p className="text-sm text-gray-500">
          {participants.length} participant{participants.length !== 1 ? 's' : ''} online
        </p>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((message) => {
              const isCurrentUser = message.senderId === currentUserId;
              const participant = getParticipantInfo(message.senderId);

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex gap-3 ${
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={participant?.avatar} alt={participant?.name} />
                      <AvatarFallback className="text-xs">
                        {participant?.name?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'system'
                        ? 'bg-gray-100 text-gray-600 text-center text-sm'
                        : isCurrentUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.type !== 'system' && !isCurrentUser && (
                      <div className="text-xs font-medium text-gray-500 mb-1">
                        {participant?.name || 'Unknown'}
                      </div>
                    )}

                    <div className="text-sm break-words">
                      {message.content}
                    </div>

                    <div
                      className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={participant?.avatar} alt={participant?.name} />
                      <AvatarFallback className="text-xs">
                        {participant?.name?.charAt(0).toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-gray-50 rounded-b-lg">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="pr-12"
              maxLength={500}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <Smile className="h-4 w-4 text-gray-400" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="px-3"
          >
            <Paperclip className="h-4 w-4 text-gray-400" />
          </Button>

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Character Count */}
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>Press Enter to send</span>
          <span>{newMessage.length}/500</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatInterface;