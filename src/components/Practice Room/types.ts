// Practice Room Types

export interface RoomParticipant {
  userId: string;
  username?: string;
  fullName?: string;
  avatar?: string;
}

export interface RoomDetails {
  roomId: string;
  topic: string;
  description?: string;
  hostId: string;
  participants: RoomParticipant[];
  maxParticipants: number;
  isPrivate: boolean;
  status: 'active' | 'closed';
  createdAt: string;
  participantCount: number;
  isFull: boolean;
}

export interface RoomMessage {
  id: string;
  roomId: string;
  userId: string;
  username?: string;
  avatar?: string;
  message: string;
  timestamp: string;
  type: 'text' | 'system' | 'join' | 'leave';
}

export interface CreateRoomData {
  maxParticipants?: number;
}

export interface RoomSettings {
  isPrivate: boolean;
  allowRecording: boolean;
  maxParticipants: number;
  roomName?: string;
  description?: string;
}

export interface RoomState {
  currentRoom: RoomDetails | null;
  participants: RoomParticipant[];
  messages: RoomMessage[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}