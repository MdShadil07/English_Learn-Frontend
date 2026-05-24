import { API_BASE_URL, getAuthToken } from '@/utils/api';
import { Conversation, Message } from '@/components/AI Chat/types';

interface StoredMessage {
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  personalityId?: string;
}

interface StoredConversation {
  conversationId: string;
  personalityId: string;
  title: string;
  messageCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
}

const authHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const toDate = (value?: string): Date => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const mapMessage = (message: StoredMessage): Message => ({
  id: message.messageId,
  role: message.role,
  content: message.content,
  timestamp: toDate(message.timestamp),
  personalityId: message.personalityId,
});

const mapConversation = (conversation: StoredConversation): Conversation => ({
  id: conversation.conversationId,
  title: conversation.title,
  personalityId: conversation.personalityId,
  messages: conversation.messages.map(mapMessage).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
  createdAt: toDate(conversation.createdAt),
  lastUpdated: toDate(conversation.lastMessageAt || conversation.updatedAt),
  totalAccuracy: 0,
  totalXP: 0,
  messageCount: conversation.messageCount,
});

export const conversationHistoryService = {
  async listConversations(): Promise<Conversation[]> {
    const response = await fetch(`${API_BASE_URL}/ai-chat/conversations?limit=50`, {
      method: 'GET',
      headers: authHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load conversations');
    }

    return (result.conversations as StoredConversation[])
      .map(mapConversation)
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await fetch(`${API_BASE_URL}/ai-chat/conversations/${encodeURIComponent(conversationId)}/messages?limit=1000`, {
      method: 'GET',
      headers: authHeaders(),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load conversation messages');
    }

    return (result.messages as StoredMessage[])
      .map(mapMessage)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  queueTurn(input: {
    conversationId: string;
    personalityId: string;
    title: string;
    messages: Message[];
  }): void {
    try {
      fetch(`${API_BASE_URL}/ai-chat/conversations/turn`, {
        method: 'POST',
        headers: authHeaders(),
        keepalive: true,
        body: JSON.stringify({
          conversationId: input.conversationId,
          personalityId: input.personalityId,
          title: input.title,
          messages: input.messages.map((message) => ({
            messageId: message.id,
            role: message.role,
            content: message.content,
            timestamp: message.timestamp.toISOString(),
            personalityId: message.personalityId || input.personalityId,
          })),
        }),
      }).catch((error) => {
        console.error('Failed to queue AI chat turn:', error);
      });
    } catch (error) {
      console.error('Failed to prepare AI chat turn for persistence:', error);
    }
  },

  flushQueuedConversations(keepalive = false): void {
    try {
      fetch(`${API_BASE_URL}/ai-chat/conversations/flush`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({}),
        keepalive,
      }).catch((error) => {
        console.error('Failed to flush AI chat conversations:', error);
      });
    } catch (error) {
      console.error('Failed to prepare AI chat conversation flush:', error);
    }
  },
};
