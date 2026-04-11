/**
 * Practice Room Service
 * Handles API calls to the backend for room management
 */

import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export interface CreateRoomData {
  maxParticipants?: number;
  isPrivate?: boolean;
  allowRecording?: boolean;
  topic?: string;
  description?: string;
}

export interface RoomMessage {
  roomId: string;
  userId: string;
  message: any;
  timestamp: string;
}

export interface RoomParticipant {
  userId: string;
  username?: string;
  fullName?: string;
  avatar?: string;
  isHost?: boolean;
  isInCall?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isHandRaised?: boolean;
}

export interface WebRTCOffer {
  roomId: string;
  targetUserId: string;
  offer: RTCSessionDescriptionInit;
}

export interface WebRTCAnswer {
  roomId: string;
  targetUserId: string;
  answer: RTCSessionDescriptionInit;
}

export interface WebRTCIceCandidate {
  roomId: string;
  targetUserId: string;
  candidate: RTCIceCandidateInit;
}

export interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
  isConnected: boolean;
}

class RoomService {
  private socket: Socket | null = null;
  private roomMessageCallbacks: ((message: RoomMessage) => void)[] = [];
  private roomUserJoinedCallbacks: ((data: { roomId: string; userId: string }) => void)[] = [];
  private roomUserLeftCallbacks: ((data: { roomId: string; userId: string }) => void)[] = [];
  private roomClosedCallbacks: ((data: { roomId: string }) => void)[] = [];

  // WebRTC related
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private isInCall = false;
  private currentRoomId: string | null = null;
  private pendingIceCandidates: Map<string, RTCIceCandidateInit[]> = new Map();

  // WebRTC event callbacks
  private webrtcUserJoinedCallCallbacks: ((data: { roomId: string; userId: string; existingParticipants?: string[] }) => void)[] = [];
  private webrtcUserLeftCallCallbacks: ((data: { roomId: string; userId: string; reason?: string }) => void)[] = [];
  private webrtcOfferCallbacks: ((data: { roomId: string; fromUserId: string; offer: RTCSessionDescriptionInit }) => void)[] = [];
  private webrtcAnswerCallbacks: ((data: { roomId: string; fromUserId: string; answer: RTCSessionDescriptionInit }) => void)[] = [];
  private webrtcIceCandidateCallbacks: ((data: { roomId: string; fromUserId: string; candidate: RTCIceCandidateInit }) => void)[] = [];
  private webrtcCallStartedCallbacks: ((data: { roomId: string; initiatorUserId: string }) => void)[] = [];
  private webrtcCallEndedCallbacks: ((data: { roomId: string; endedByUserId: string }) => void)[] = [];
  private peerConnectionUpdatedCallbacks: ((connections: Map<string, PeerConnection>) => void)[] = [];

  /**
   * Get authorization token
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getCurrentUserId(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || null;
    } catch (error) {
      return null;
    }
  }

  private normalizeSocketPayload<T>(payload: any): T {
    if (payload && typeof payload === 'object' && 'data' in payload) {
      return payload.data as T;
    }
    return payload as T;
  }

  private notifyPeerConnectionsUpdated(): void {
    this.peerConnectionUpdatedCallbacks.forEach((callback) => callback(this.peerConnections));
  }

  private getRtcConfiguration(): RTCConfiguration {
    const customIceServers = import.meta.env.VITE_WEBRTC_ICE_SERVERS;
    let iceServers: RTCIceServer[] = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ];

    if (customIceServers) {
      try {
        const parsedServers = JSON.parse(customIceServers);
        if (Array.isArray(parsedServers) && parsedServers.length > 0) {
          iceServers = parsedServers;
        }
      } catch (error) {
        console.warn('Invalid VITE_WEBRTC_ICE_SERVERS format. Using default STUN servers.');
      }
    }

    return {
      iceServers,
      iceCandidatePoolSize: 10,
      bundlePolicy: 'max-bundle',
      rtcpMuxPolicy: 'require',
    };
  }

  private queuePendingIceCandidate(userId: string, candidate: RTCIceCandidateInit): void {
    const queue = this.pendingIceCandidates.get(userId) || [];
    queue.push(candidate);
    this.pendingIceCandidates.set(userId, queue);
  }

  private async flushPendingIceCandidates(userId: string): Promise<void> {
    const peer = this.peerConnections.get(userId);
    if (!peer || !peer.connection.remoteDescription) return;

    const queue = this.pendingIceCandidates.get(userId);
    if (!queue || queue.length === 0) return;

    for (const candidate of queue) {
      try {
        await peer.connection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (error) {
        console.error('Failed to flush ICE candidate:', error);
      }
    }

    this.pendingIceCandidates.delete(userId);
  }

  private isPeerConnectionClosed(peer: PeerConnection): boolean {
    return peer.connection.signalingState === 'closed' || peer.connection.iceConnectionState === 'closed';
  }

  private async updatePeerConnectionTracks(peer: PeerConnection): Promise<void> {
    if (!this.localStream || this.isPeerConnectionClosed(peer)) return;

    const tracks = this.localStream.getTracks();
    for (const track of tracks) {
      const sender = peer.connection.getSenders().find(s => s.track?.kind === track.kind);
      try {
        if (sender) {
          await sender.replaceTrack(track);
        } else {
          peer.connection.addTrack(track, this.localStream);
        }
      } catch (error) {
        console.error('Failed to update peer track:', error);
      }
    }
  }

  private async synchronizeLocalStreamToPeers(): Promise<void> {
    if (!this.localStream) return;

    for (const peer of this.peerConnections.values()) {
      await this.updatePeerConnectionTracks(peer);
    }
  }

  private async renegotiatePeerConnection(userId: string): Promise<void> {
    const peer = this.peerConnections.get(userId);
    if (!peer || !this.socket || !this.currentRoomId || this.isPeerConnectionClosed(peer)) return;

    try {
      const offer = await peer.connection.createOffer();
      await peer.connection.setLocalDescription(offer);

      this.socket.emit('webrtc:offer', {
        roomId: this.currentRoomId,
        targetUserId: userId,
        offer,
      });
    } catch (error) {
      console.error('Failed to renegotiate peer connection:', error);
    }
  }

  /**
   * Create a new practice room
   */
  async createRoom(data: CreateRoomData = {}): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/rooms`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Join an existing room
   */
  async joinRoom(roomId: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/rooms/${roomId}/join`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Leave a room
   */
  async leaveRoom(roomId: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/rooms/${roomId}/leave`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Get room details
   */
  async getRoomDetails(roomId: string): Promise<RoomDetails | null> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    try {
      const response = await axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get user's rooms
   */
  async getUserRooms(): Promise<RoomDetails[]> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.get(`${API_URL}/rooms/my-rooms`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Get all active non-private rooms
   */
  async getActiveRooms(): Promise<RoomDetails[]> {
    const response = await axios.get(`${API_URL}/rooms/active`);

    return response.data.data;
  }

  /**
   * Close a room (host only)
   */
  async closeRoom(roomId: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await axios.post(`${API_URL}/rooms/${roomId}/close`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.data;
  }

  /**
   * Initialize WebSocket connection
   */
  initializeSocket(): void {
    const token = this.getAuthToken();
    if (!token) {
      console.warn('No auth token available for WebSocket connection');
      return;
    }

    this.socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    this.setupSocketEventHandlers();
  }

  /**
   * Disconnect WebSocket
   */
  disconnectSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Setup WebSocket event handlers
   */
  private setupSocketEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to room WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from room WebSocket');
    });

    // Room events
    this.socket.on('room:user-joined', (data: { roomId: string; userId: string }) => {
      this.roomUserJoinedCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('room:user-left', (data: { roomId: string; userId: string }) => {
      this.roomUserLeftCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('room:message', (message: RoomMessage) => {
      this.roomMessageCallbacks.forEach(callback => callback(message));
    });

    this.socket.on('room:closed', (data: { roomId: string }) => {
      this.roomClosedCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('room:error', (error: any) => {
      console.error('Room WebSocket error:', error);
    });

    // WebRTC events
    this.socket.on('webrtc:offer', (payload: any) => {
      const data = this.normalizeSocketPayload<{ roomId: string; fromUserId: string; offer: RTCSessionDescriptionInit }>(payload);
      this.webrtcOfferCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:answer', (payload: any) => {
      const data = this.normalizeSocketPayload<{ roomId: string; fromUserId: string; answer: RTCSessionDescriptionInit }>(payload);
      this.webrtcAnswerCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:ice-candidate', (payload: any) => {
      const data = this.normalizeSocketPayload<{ roomId: string; fromUserId: string; candidate: RTCIceCandidateInit }>(payload);
      this.webrtcIceCandidateCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:user-joined-call', (data: { roomId: string; userId: string; existingParticipants?: string[] }) => {
      this.webrtcUserJoinedCallCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:user-left-call', (data: { roomId: string; userId: string; reason?: string }) => {
      this.webrtcUserLeftCallCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:call-started', (data: { roomId: string; initiatorUserId: string }) => {
      this.webrtcCallStartedCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:call-ended', (data: { roomId: string; endedByUserId: string }) => {
      this.webrtcCallEndedCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('webrtc:call-joined', (data: { roomId: string; userId: string; existingParticipants?: string[] }) => {
      this.isInCall = true;
      // Existing participants will initiate offer via `webrtc:user-joined-call`
      // The joiner does not need to create duplicate offers.
    });

    this.socket.on('webrtc:call-left', (data: { roomId: string; userId: string }) => {
      // Close peer connection for this user
      const peer = this.peerConnections.get(data.userId);
      if (peer) {
        peer.connection.close();
        this.peerConnections.delete(data.userId);
        this.pendingIceCandidates.delete(data.userId);
        this.notifyPeerConnectionsUpdated();
      }
    });

    this.socket.on('webrtc:error', (error: any) => {
      console.error('WebRTC error:', error);
    });
  }

  /**
   * Join room via WebSocket
   */
  joinRoomSocket(roomId: string): void {
    if (this.socket) {
      this.socket.emit('room:join', { roomId });
    }
  }

  /**
   * Leave room via WebSocket
   */
  leaveRoomSocket(roomId: string): void {
    if (this.socket) {
      this.socket.emit('room:leave', { roomId });
    }
  }

  /**
   * Send message to room via WebSocket
   */
  sendRoomMessage(roomId: string, message: any): void {
    if (this.socket) {
      this.socket.emit('room:message', { roomId, message });
    }
  }

  /**
   * Event subscription methods
   */
  onRoomMessage(callback: (message: RoomMessage) => void): () => void {
    this.roomMessageCallbacks.push(callback);
    return () => {
      const index = this.roomMessageCallbacks.indexOf(callback);
      if (index > -1) {
        this.roomMessageCallbacks.splice(index, 1);
      }
    };
  }

  onRoomUserJoined(callback: (data: { roomId: string; userId: string }) => void): () => void {
    this.roomUserJoinedCallbacks.push(callback);
    return () => {
      const index = this.roomUserJoinedCallbacks.indexOf(callback);
      if (index > -1) {
        this.roomUserJoinedCallbacks.splice(index, 1);
      }
    };
  }

  onRoomUserLeft(callback: (data: { roomId: string; userId: string }) => void): () => void {
    this.roomUserLeftCallbacks.push(callback);
    return () => {
      const index = this.roomUserLeftCallbacks.indexOf(callback);
      if (index > -1) {
        this.roomUserLeftCallbacks.splice(index, 1);
      }
    };
  }

  onRoomClosed(callback: (data: { roomId: string }) => void): () => void {
    this.roomClosedCallbacks.push(callback);
    return () => {
      const index = this.roomClosedCallbacks.indexOf(callback);
      if (index > -1) {
        this.roomClosedCallbacks.splice(index, 1);
      }
    };
  }

  // ============ WebRTC Methods ============

  /**
   * Initialize user media (camera/microphone)
   */
  async initializeMedia(audio: boolean = true, video: boolean = false): Promise<MediaStream> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        } : false,
      };

      this.localStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (this.isInCall) {
        await this.synchronizeLocalStreamToPeers();
      }

      return this.localStream;
    } catch (error) {
      console.error('Failed to initialize media:', error);
      throw new Error('Could not access camera or microphone');
    }
  }

  /**
   * Stop user media
   */
  stopMedia(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
  }

  /**
   * Toggle audio
   */
  toggleAudio(): boolean {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return audioTrack.enabled;
      }
    }
    return false;
  }

  /**
   * Toggle video
   */
  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) {
      await this.initializeMedia(true, true);
      return true;
    }

    const videoTrack = this.localStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      return videoTrack.enabled;
    }

    try {
      const screen = await navigator.mediaDevices.getUserMedia({ video: true });
      const newVideoTrack = screen.getVideoTracks()[0];
      if (newVideoTrack) {
        this.localStream.addTrack(newVideoTrack);
        await this.synchronizeLocalStreamToPeers();

        if (this.currentRoomId) {
          for (const userId of this.peerConnections.keys()) {
            await this.renegotiatePeerConnection(userId);
          }
        }

        return true;
      }
    } catch (error) {
      console.error('Failed to add video track:', error);
    }

    return false;
  }

  /**
   * Join WebRTC call
   */
  async joinCall(roomId: string): Promise<void> {
    if (!this.socket) throw new Error('WebSocket not connected');

    this.currentRoomId = roomId;
    this.socket.emit('webrtc:join-call', { roomId });
  }

  /**
   * Leave WebRTC call
   */
  async leaveCall(roomId: string): Promise<void> {
    if (!this.socket) throw new Error('WebSocket not connected');

    // Close all peer connections
    this.peerConnections.forEach(peer => {
      peer.connection.close();
    });
    this.peerConnections.clear();
    this.pendingIceCandidates.clear();
    this.notifyPeerConnectionsUpdated();

    this.socket.emit('webrtc:leave-call', { roomId });
    this.isInCall = false;
    this.currentRoomId = null;
  }

  /**
   * Start call (API call)
   */
  async startCall(roomId: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');

    await axios.post(`${API_URL}/rooms/${roomId}/start-call`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * End call (API call)
   */
  async endCall(roomId: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');

    await axios.post(`${API_URL}/rooms/${roomId}/end-call`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  /**
   * Get call participants
   */
  async getCallParticipants(roomId: string): Promise<string[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');

    const response = await axios.get(`${API_URL}/rooms/${roomId}/call-participants`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data.data;
  }

  /**
   * Create peer connection for a user
   */
  private createPeerConnection(userId: string): RTCPeerConnection {
    const existingPeer = this.peerConnections.get(userId);
    if (existingPeer && existingPeer.connection.signalingState !== 'closed') {
      return existingPeer.connection;
    }

    const peerConnection = new RTCPeerConnection(this.getRtcConfiguration());

    // Add local stream tracks to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.socket && this.currentRoomId) {
        this.socket.emit('webrtc:ice-candidate', {
          roomId: this.currentRoomId,
          targetUserId: userId,
          candidate: event.candidate,
        });
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      const peer = this.peerConnections.get(userId);
      if (peer) {
        peer.isConnected = peerConnection.connectionState === 'connected';
        if (peerConnection.connectionState === 'failed') {
          peerConnection.restartIce();
        }
        if (peerConnection.connectionState === 'disconnected' || peerConnection.connectionState === 'closed') {
          this.pendingIceCandidates.delete(userId);
        }
        this.notifyPeerConnectionsUpdated();
      }
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      const peer = this.peerConnections.get(userId);
      if (peer) {
        peer.stream = event.streams[0] || new MediaStream([event.track]);
        this.notifyPeerConnectionsUpdated();
      }
    };

    return peerConnection;
  }

  /**
   * Send WebRTC offer to user
   */
  async sendOffer(userId: string, roomId: string): Promise<void> {
    if (!this.socket) throw new Error('WebSocket not connected');

    const existingPeer = this.peerConnections.get(userId);
    const peerConnection = this.createPeerConnection(userId);
    if (!existingPeer) {
      this.peerConnections.set(userId, {
        userId,
        connection: peerConnection,
        isConnected: false,
      });
      this.notifyPeerConnectionsUpdated();
    }

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      this.socket.emit('webrtc:offer', {
        roomId,
        targetUserId: userId,
        offer,
      });
    } catch (error) {
      console.error('Failed to send offer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming WebRTC offer
   */
  async handleOffer(data: { roomId: string; fromUserId: string; offer: RTCSessionDescriptionInit }): Promise<void> {
    const existingPeer = this.peerConnections.get(data.fromUserId);
    const peerConnection = this.createPeerConnection(data.fromUserId);
    if (!existingPeer) {
      this.peerConnections.set(data.fromUserId, {
        userId: data.fromUserId,
        connection: peerConnection,
        isConnected: false,
      });
      this.notifyPeerConnectionsUpdated();
    }

    try {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      await this.flushPendingIceCandidates(data.fromUserId);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      if (this.socket) {
        this.socket.emit('webrtc:answer', {
          roomId: data.roomId,
          targetUserId: data.fromUserId,
          answer,
        });
      }
    } catch (error) {
      console.error('Failed to handle offer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming WebRTC answer
   */
  async handleAnswer(data: { roomId: string; fromUserId: string; answer: RTCSessionDescriptionInit }): Promise<void> {
    const peer = this.peerConnections.get(data.fromUserId);
    if (!peer) return;

    try {
      await peer.connection.setRemoteDescription(new RTCSessionDescription(data.answer));
      await this.flushPendingIceCandidates(data.fromUserId);
    } catch (error) {
      console.error('Failed to handle answer:', error);
      throw error;
    }
  }

  /**
   * Handle incoming ICE candidate
   */
  async handleIceCandidate(data: { roomId: string; fromUserId: string; candidate: RTCIceCandidateInit }): Promise<void> {
    const peer = this.peerConnections.get(data.fromUserId);
    if (!peer) {
      this.queuePendingIceCandidate(data.fromUserId, data.candidate);
      return;
    }

    if (!peer.connection.remoteDescription) {
      this.queuePendingIceCandidate(data.fromUserId, data.candidate);
      return;
    }

    try {
      await peer.connection.addIceCandidate(new RTCIceCandidate(data.candidate));
    } catch (error) {
      console.error('Failed to handle ICE candidate:', error);
    }
  }

  /**
   * Get peer connection for user
   */
  getPeerConnection(userId: string): PeerConnection | undefined {
    return this.peerConnections.get(userId);
  }

  /**
   * Get all peer connections
   */
  getAllPeerConnections(): Map<string, PeerConnection> {
    return this.peerConnections;
  }

  /**
   * Check if user is in call
   */
  isUserInCall(): boolean {
    return this.isInCall;
  }

  /**
   * Get local media stream
   */
  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // ============ WebRTC Event Callbacks ============

  onWebRTCUserJoinedCall(callback: (data: { roomId: string; userId: string; existingParticipants?: string[] }) => void): () => void {
    this.webrtcUserJoinedCallCallbacks.push(callback);
    return () => {
      const index = this.webrtcUserJoinedCallCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcUserJoinedCallCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCUserLeftCall(callback: (data: { roomId: string; userId: string; reason?: string }) => void): () => void {
    this.webrtcUserLeftCallCallbacks.push(callback);
    return () => {
      const index = this.webrtcUserLeftCallCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcUserLeftCallCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCOffer(callback: (data: { roomId: string; fromUserId: string; offer: RTCSessionDescriptionInit }) => void): () => void {
    this.webrtcOfferCallbacks.push(callback);
    return () => {
      const index = this.webrtcOfferCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcOfferCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCAnswer(callback: (data: { roomId: string; fromUserId: string; answer: RTCSessionDescriptionInit }) => void): () => void {
    this.webrtcAnswerCallbacks.push(callback);
    return () => {
      const index = this.webrtcAnswerCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcAnswerCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCIceCandidate(callback: (data: { roomId: string; fromUserId: string; candidate: RTCIceCandidateInit }) => void): () => void {
    this.webrtcIceCandidateCallbacks.push(callback);
    return () => {
      const index = this.webrtcIceCandidateCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcIceCandidateCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCCallStarted(callback: (data: { roomId: string; initiatorUserId: string }) => void): () => void {
    this.webrtcCallStartedCallbacks.push(callback);
    return () => {
      const index = this.webrtcCallStartedCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcCallStartedCallbacks.splice(index, 1);
      }
    };
  }

  onWebRTCCallEnded(callback: (data: { roomId: string; endedByUserId: string }) => void): () => void {
    this.webrtcCallEndedCallbacks.push(callback);
    return () => {
      const index = this.webrtcCallEndedCallbacks.indexOf(callback);
      if (index > -1) {
        this.webrtcCallEndedCallbacks.splice(index, 1);
      }
    };
  }

  onPeerConnectionsUpdated(callback: (connections: Map<string, PeerConnection>) => void): () => void {
    this.peerConnectionUpdatedCallbacks.push(callback);
    callback(this.peerConnections);

    return () => {
      const index = this.peerConnectionUpdatedCallbacks.indexOf(callback);
      if (index > -1) {
        this.peerConnectionUpdatedCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const roomService = new RoomService();
export default roomService;
