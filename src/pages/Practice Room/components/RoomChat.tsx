import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Smile, Info, Check, ShieldCheck, Heart, MessageSquare, Crown } from 'lucide-react';

import { roomService } from '../../../services/roomService';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { cn } from '../../../lib/utils';
import { RoomParticipant } from '../../../services/roomService';

interface Message {
  id: string;
  senderId: string;
  senderName?: string;
  senderAvatar?: string;
  content: any;
  timestamp: Date;
  type: 'text' | 'system';
}

interface RoomChatProps {
  roomId: string;
  currentUserId?: string;
  participants: RoomParticipant[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageReactions: Record<string, Record<string, string[]>>;
  setMessageReactions: React.Dispatch<React.SetStateAction<Record<string, Record<string, string[]>>>>;
}

const RoomChat = ({ 
  roomId, 
  currentUserId, 
  participants, 
  messages, 
  setMessages,
  messageReactions,
  setMessageReactions
}: RoomChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const participantMap = useMemo(() => {
    const map = new Map<string, RoomParticipant>();
    participants.forEach(p => map.set(p.userId, p));
    return map;
  }, [participants]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const trimmedMessage = newMessage.trim();
    const currentUser = participantMap.get(currentUserId || '');

    const outgoingMessage: Message = {
      id: `local-${Date.now()}-${Math.random()}`,
      senderId: currentUserId || 'me',
      senderName: currentUser?.fullName || 'You',
      senderAvatar: currentUser?.avatar,
      content: trimmedMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, outgoingMessage]);
    roomService.sendRoomMessage(roomId, { text: trimmedMessage });
    setNewMessage('');
  };

  const handleMessageReaction = (msgId: string, emoji: string) => {
    // Prevent multiple reactions from same user
    const currentReactions = messageReactions[msgId]?.[emoji] || [];
    if (currentUserId && currentReactions.includes(currentUserId)) return;

    roomService.sendReaction(roomId, `msg:${msgId}:${emoji}`);
    setMessageReactions(prev => {
      const msgMap = prev[msgId] || {};
      const userList = msgMap[emoji] || [];
      if (currentUserId && userList.includes(currentUserId)) return prev;
      return { ...prev, [msgId]: { ...msgMap, [emoji]: [...userList, currentUserId || 'me'] } };
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
     try {
       return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     } catch (e) {
       return '--:--';
     }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(@host|@mod|@moderator)/gi);
    return (
      <span className="break-words">
        {parts.map((part, i) => {
          const lowerPart = part.toLowerCase();
          if (lowerPart === '@host') {
            return (
              <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold mx-0.5 animate-pulse">
                <Crown className="w-2.5 h-2.5 fill-amber-500/30" />
                {part}
              </span>
            );
          }
          if (lowerPart === '@mod' || lowerPart === '@moderator') {
            return (
              <span key={i} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-200 border border-blue-500/30 font-bold mx-0.5 animate-pulse">
                <ShieldCheck className="w-2.5 h-2.5 fill-blue-500/30" />
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 shadow-2xl flex-1 min-h-0">
      <div className="px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              Session Chat
            </h3>
            <p className="text-[11px] text-slate-400 font-medium font-mono">Synced across all participants</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-4 scrollbar-hide">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-50">
             <div className="p-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
             </div>
             <p className="text-[10px] text-slate-400 font-medium text-center max-w-[200px]">
               Messages are persistent for this session.
             </p>
          </div>

          <AnimatePresence initial={false}>
            {messages.map((message, idx) => {
              const isCurrentUser = message.senderId === currentUserId;
              const isSystem = message.type === 'system';
              const p = participantMap.get(message.senderId);
              const senderName = isCurrentUser ? 'You' : (p?.fullName || message.senderName || 'User');
              const senderAvatar = p?.avatar || message.senderAvatar;
              
              const showAvatar = !isCurrentUser && !isSystem && (idx === 0 || messages[idx-1].senderId !== message.senderId);
              const content = typeof message.content === 'object' ? message.content.text : message.content;

              if (isSystem) {
                return (
                  <motion.div key={message.id} className="flex justify-center py-2">
                    <div className="px-3 py-1 rounded-full bg-slate-800/40 border border-white/5 flex items-center gap-2">
                       <Info className="w-3 h-3 text-slate-500" />
                       <span className="text-[10px] text-slate-400 font-medium">{content}</span>
                    </div>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: isCurrentUser ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn("flex flex-col", isCurrentUser ? "items-end" : "items-start")}
                >
                  <div className={cn("flex gap-2 max-w-[85%]", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                    {showAvatar ? (
                      <Avatar className="w-7 h-7 mt-0.5 border border-white/10 shrink-0">
                        <AvatarImage src={senderAvatar} />
                        <AvatarFallback className="bg-slate-800 text-[10px] text-slate-400">
                          {senderName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : !isCurrentUser && <div className="w-7" />}

                    <div className="flex flex-col space-y-1">
                      {!isCurrentUser && showAvatar && (
                        <span className="text-[10px] font-bold text-slate-400 ml-1">
                          {senderName}
                        </span>
                      )}
                      
                      <div className={cn(
                        "px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed shadow-sm relative group/msg",
                        isCurrentUser 
                          ? "bg-emerald-600 text-white rounded-tr-none shadow-emerald-900/20" 
                          : "bg-slate-800 text-slate-100 rounded-tl-none border border-white/5"
                      )}>
                        {renderMessageContent(content)}
                        
                        <div className={cn("absolute -bottom-4 opacity-0 group-hover/msg:opacity-100 transition-opacity flex gap-1 z-10", isCurrentUser ? "right-0" : "left-0")}>
                           <button 
                             onClick={() => handleMessageReaction(message.id, '💖')} 
                             disabled={currentUserId ? (messageReactions[message.id]?.['💖']?.includes(currentUserId)) : false}
                             className={cn(
                               "p-1 rounded-full border transition-all shadow-lg",
                               currentUserId && messageReactions[message.id]?.['💖']?.includes(currentUserId)
                                 ? "bg-pink-500/20 border-pink-500/50 scale-110" 
                                 : "bg-slate-800 border-white/10 hover:bg-slate-700 hover:scale-110 active:scale-95"
                             )}
                           >
                              <Heart className={cn("w-2.5 h-2.5", currentUserId && messageReactions[message.id]?.['💖']?.includes(currentUserId) ? "text-pink-500 fill-pink-500" : "text-slate-400")} />
                           </button>
                        </div>

                        {messageReactions[message.id] && Object.entries(messageReactions[message.id]).map(([emoji, userList]) => (
                          <div key={emoji} className={cn("absolute -bottom-3 px-1.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-[9px] flex items-center gap-1 shadow-md", isCurrentUser ? "right-4" : "left-6")}>
                             <span>{emoji}</span>
                             <span className="text-slate-400 font-bold">{userList.length}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className={cn("flex items-center gap-1 text-[9px] text-slate-500", isCurrentUser ? "justify-end" : "justify-start ml-1")}>
                        {formatTime(message.timestamp)}
                        {isCurrentUser && <Check className="w-2.5 h-2.5 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="p-4 bg-slate-900 border-t border-white/5 space-y-3">
        {/* Context-Aware Mention Suggestions */}
        <AnimatePresence>
          {newMessage.endsWith('@') && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1"
            >
               <button 
                 onClick={() => setNewMessage(prev => prev.slice(0, -1) + '@Host ')}
                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all active:scale-95 group shrink-0"
               >
                 <Crown className="w-2.5 h-2.5 fill-amber-500/30" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Host</span>
               </button>

               <button 
                 onClick={() => setNewMessage(prev => prev.slice(0, -1) + '@Moderator ')}
                 className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all active:scale-95 group shrink-0"
               >
                 <ShieldCheck className="w-2.5 h-2.5 fill-blue-500/30" />
                 <span className="text-[8px] font-black uppercase tracking-widest">Moderator</span>
               </button>
               
               <div className="w-px h-3 bg-white/10 mx-1" />
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">Reporting Tag</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 bg-slate-800/50 border border-white/5 p-1.5 rounded-2xl focus-within:border-emerald-500/50 transition-all">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            className="flex-1 bg-transparent border-none focus-visible:ring-0 text-xs text-white h-8 placeholder:text-slate-500"
            maxLength={500}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className={cn(
              "w-8 h-8 rounded-xl transition-all p-0 overflow-hidden shrink-0",
              newMessage.trim() ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-500 opacity-0"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomChat;