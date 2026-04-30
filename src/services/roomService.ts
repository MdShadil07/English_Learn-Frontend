/**
 * Practice Room Service
 * Handles API calls to the backend for room management.
 * Media is exclusively handled via Mediasoup SFU.
 */

import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import * as mediasoup from 'mediasoup-client';
import type { Device, Transport, Producer, Consumer } from 'mediasoup-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Industry-standard: SFU URL from env, never hardcoded
const SFU_URL = import.meta.env.VITE_SFU_URL || 'http://localhost:3001';

// ─── Public Interfaces ──────────────────────────────────────────────────────

export interface RoomDetails {
  roomId: string;
  roomCode?: string;     // Only visible to host for private rooms
  topic: string;
  description?: string;
  banner?: string;
  bannerText?: string;
  bannerFontFamily?: string;
  bannerIsBold?: boolean;
  bannerIsItalic?: boolean;
  bannerFontSize?: number;
  hostId: string;
  participants: RoomParticipant[];
  maxParticipants: number;
  isPrivate: boolean;
  isLocked: boolean;
  status: 'active' | 'closed';
  createdAt: string;
  participantCount: number;
  isFull: boolean;
  sfuUrl?: string;
  blockedUsers?: RoomParticipant[];
}

export interface CreateRoomData {
  maxParticipants?: number;
  isPrivate?: boolean;
  allowRecording?: boolean;
  topic?: string;
  description?: string;
  banner?: string;
  bannerText?: string;
  bannerFontFamily?: string;
  bannerIsBold?: boolean;
  bannerIsItalic?: boolean;
  bannerFontSize?: number;
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

/**
 * Represents a remote peer in the SFU room.
 * `stream` holds all MediaStreamTracks consumed from the SFU for that user.
 */
export interface PeerConnection {
  userId: string;
  stream: MediaStream;
  isConnected: boolean;
}

// ─── RoomService Class ───────────────────────────────────────────────────────

class RoomService {
  // ── Signaling sockets ──
  /** Backend signaling socket (room events, chat, presence) */
  private socket: Socket | null = null;
  /** Dedicated SFU signaling socket (WebRTC negotiation) */
  private sfuSocket: Socket | null = null;

  // ── Room event callbacks ──
  private roomMessageCallbacks: ((msg: RoomMessage) => void)[] = [];
  private roomUserJoinedCallbacks: ((data: { roomId: string; userId: string }) => void)[] = [];
  private roomUserLeftCallbacks: ((data: { roomId: string; userId: string }) => void)[] = [];
  private roomClosedCallbacks: ((data: { roomId: string }) => void)[] = [];
  private onHandToggledCallbacks: ((data: { userId: string; isRaised: boolean }) => void)[] = [];
  private roomHistoryCallbacks: ((data: { roomId: string; messages: any[] }) => void)[] = [];
  private roomReactionCallbacks: ((data: { userId: string; reaction: string }) => void)[] = [];
  private forceKickCallbacks: ((data: { roomId: string }) => void)[] = [];
  private forceMuteCallbacks: ((data: { roomId: string }) => void)[] = [];
  private lockUpdatedCallbacks: ((data: { isLocked: boolean; updatedBy: string }) => void)[] = [];

  // ── SFU / media state ──
  private device: Device | null = null;
  private sendTransport: Transport | null = null;
  private recvTransport: Transport | null = null;
  private producers: Map<string, Producer> = new Map(); // keyed by track.kind
  private consumers: Map<string, Consumer> = new Map(); // keyed by consumer.id
  private consumedProducerIds: Set<string> = new Set();

  private localStream: MediaStream | null = null;
  private isInCall = false;
  private currentRoomId: string | null = null;
  private dynamicSfuUrl: string | null = null;

  /**
   * Remote peers: userId → { userId, stream, isConnected }
   * The stream is always a NEW MediaStream object when tracks change so that
   * React / HTMLVideoElement srcObject ref-checks fire correctly.
   */
  private peerConnections: Map<string, PeerConnection> = new Map();

  // ── Peer connection update callbacks ──
  private peerConnectionUpdatedCallbacks: ((connections: Map<string, PeerConnection>) => void)[] = [];

  // ── WebRTC user-joined/left call callbacks (for UI participant badges) ──
  private webrtcUserJoinedCallCallbacks: ((data: { roomId: string; userId: string }) => void)[] = [];
  private webrtcUserLeftCallCallbacks:  ((data: { roomId: string; userId: string }) => void)[] = [];

  // ── Active speaker callbacks (for grid UI) ──
  private activeSpeakerCallbacks: ((data: { roomId: string; activeSpeakerIds: string[] }) => void)[] = [];

  // ────────────────────────────────────────────────────────────────────────────
  // Utilities
  // ────────────────────────────────────────────────────────────────────────────

  private getAuthToken(): string | null {
    return localStorage.getItem('accessToken') || localStorage.getItem('token');
  }

  getCurrentUserId(): string | null {
    const token = this.getAuthToken();
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || payload.id || payload.sub || null;
    } catch {
      return null;
    }
  }

  private notifyPeerConnectionsUpdated(): void {
    this.peerConnectionUpdatedCallbacks.forEach(cb => cb(this.peerConnections));
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Backend REST API
  // ────────────────────────────────────────────────────────────────────────────

  async createRoom(data: CreateRoomData = {}): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.post(`${API_URL}/rooms`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.data.data?.sfuUrl) this.dynamicSfuUrl = res.data.data.sfuUrl;
    return res.data.data;
  }

  async uploadBanner(file: File): Promise<string> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    
    const formData = new FormData();
    formData.append('banner', file);

    const res = await axios.post(`${API_URL}/rooms/upload-banner`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    
    return res.data.data.bannerUrl;
  }

  async joinRoom(roomId: string, roomCode?: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.post(`${API_URL}/rooms/${roomId}/join`,
      roomCode ? { roomCode } : {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (res.data.data?.sfuUrl) this.dynamicSfuUrl = res.data.data.sfuUrl;
    return res.data.data;
  }

  async leaveRoom(roomId: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.post(`${API_URL}/rooms/${roomId}/leave`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }

  async getRoomDetails(roomId: string): Promise<RoomDetails | null> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    try {
      const res = await axios.get(`${API_URL}/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.data?.sfuUrl) this.dynamicSfuUrl = res.data.data.sfuUrl;
      return res.data.data;
    } catch (err: any) {
      if (err.response?.status === 404) return null;
      throw err;
    }
  }

  async getUserRooms(): Promise<RoomDetails[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.get(`${API_URL}/rooms/my-rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }

  async getActiveRooms(): Promise<RoomDetails[]> {
    const res = await axios.get(`${API_URL}/rooms/active`);
    return res.data.data;
  }

  async closeRoom(roomId: string): Promise<RoomDetails> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.post(`${API_URL}/rooms/${roomId}/close`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }

  async startCall(roomId: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    await axios.post(`${API_URL}/rooms/${roomId}/start-call`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async endCall(roomId: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    await axios.post(`${API_URL}/rooms/${roomId}/end-call`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async getCallParticipants(roomId: string): Promise<string[]> {
    const token = this.getAuthToken();
    if (!token) throw new Error('Authentication required');
    const res = await axios.get(`${API_URL}/rooms/${roomId}/call-participants`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Backend Signaling Socket (room events, chat, presence)
  // ────────────────────────────────────────────────────────────────────────────

  initializeSocket(): void {
    const token = this.getAuthToken();
    if (!token) {
      console.warn('[roomService] No auth token — skipping socket init');
      return;
    }
    if (this.socket?.connected || this.socket?.active) return;

    this.socket = io(
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000',
      { auth: { token }, transports: ['websocket', 'polling'] }
    );

    this.setupBackendSocketHandlers();
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  connect(): Socket {
    this.initializeSocket();
    return this.socket!;
  }

  disconnectSocket(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  private setupBackendSocketHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => console.log('[roomService] Backend socket connected'));
    this.socket.on('disconnect', () => console.log('[roomService] Backend socket disconnected'));

    this.socket.on('room:user-joined', (data: { roomId: string; userId: string }) => {
      this.roomUserJoinedCallbacks.forEach(cb => cb(data));
    });
    this.socket.on('room:user-left', (data: { roomId: string; userId: string }) => {
      this.roomUserLeftCallbacks.forEach(cb => cb(data));
    });
    this.socket.on('room:message', (msg: RoomMessage) => {
      this.roomMessageCallbacks.forEach(cb => cb(msg));
    });
    this.socket.on('room:closed', (data: { roomId: string }) => {
      this.roomClosedCallbacks.forEach(cb => cb(data));
    });
    this.socket.on('room:error', (err: any) => {
      console.error('[roomService] Room error:', err);
    });

    // Participant call presence updates (for UI badges only)
    this.socket.on('webrtc:user-joined-call', (data: { roomId: string; userId: string }) => {
      this.webrtcUserJoinedCallCallbacks.forEach(cb => cb(data));
    });
    this.socket.on('webrtc:user-left-call', (data: { roomId: string; userId: string }) => {
      this.webrtcUserLeftCallCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:force-kick', (data: { roomId: string }) => {
      this.forceKickCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:force-mute', (data: { roomId: string }) => {
      this.forceMuteCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:lock-updated', (data: { isLocked: boolean; updatedBy: string }) => {
      this.lockUpdatedCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:hand-toggled', (data: { userId: string; isRaised: boolean }) => {
      this.onHandToggledCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:history', (data: { roomId: string; messages: any[] }) => {
      this.roomHistoryCallbacks.forEach(cb => cb(data));
    });

    this.socket.on('room:reaction', (data: { userId: string; reaction: string }) => {
      this.roomReactionCallbacks.forEach(cb => cb(data));
    });
  }

  joinRoomSocket(roomId: string): void {
    this.socket?.emit('room:join', { roomId });
  }

  leaveRoomSocket(roomId: string): void {
    this.socket?.emit('room:leave', { roomId });
  }

  sendRoomMessage(roomId: string, message: any): void {
    this.socket?.emit('room:message', { roomId, message });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // SFU Socket (Mediasoup negotiation — dedicated connection to SFU server)
  // ────────────────────────────────────────────────────────────────────────────

  private connectToSFU(): Promise<void> {
    if (this.sfuSocket?.connected) return Promise.resolve();

    const token = this.getAuthToken();
    if (!token) return Promise.reject(new Error('Authentication required for SFU'));

    this.sfuSocket?.disconnect();

    const targetSfuUrl = this.dynamicSfuUrl || SFU_URL;

    this.sfuSocket = io(targetSfuUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupSFUSocketHandlers();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`SFU connection timeout. Is SFU running at ${targetSfuUrl}?`));
      }, 12000);

      this.sfuSocket!.once('connect', () => {
        clearTimeout(timeout);
        console.log(`[roomService] SFU socket connected: ${targetSfuUrl}`);
        resolve();
      });

      this.sfuSocket!.once('connect_error', (err) => {
        clearTimeout(timeout);
        console.error('[roomService] SFU connect_error:', err.message);
        reject(new Error(`SFU connection failed: ${err.message}`));
      });
    });
  }

  disconnectSFU(): void {
    this.sfuSocket?.disconnect();
    this.sfuSocket = null;
  }

  private setupSFUSocketHandlers(): void {
    if (!this.sfuSocket) return;

    this.sfuSocket.off('sfu:new-producer');
    this.sfuSocket.off('sfu:producer-closed');
    this.sfuSocket.off('sfu:active-speakers');

    // New producer from a peer — attempt to consume (audio always, video gated)
    this.sfuSocket.on(
      'sfu:new-producer',
      (data: { producerId: string; producerUserId: string; kind: string }) => {
        if (data.producerUserId !== this.getCurrentUserId()) {
          this.consumeProducer(data.producerId, data.producerUserId, 'thumb').catch(err =>
            console.error('[SFU] consumeProducer error:', err)
          );
        }
      }
    );

    this.sfuSocket.on(
      'sfu:producer-closed',
      (data: { producerId: string; producerUserId: string }) => {
        this.handleRemoteProducerClosed(data.producerId, data.producerUserId);
      }
    );

    // BLOCKER-1 (client): Active speaker updates from AudioLevelObserver VAD.
    // When the SFU reports new active speakers, automatically request their video
    // consumers (if not already consuming) and close video for users who went silent.
    this.sfuSocket.on(
      'sfu:active-speakers',
      async (data: { roomId: string; activeSpeakerIds: string[] }) => {
        this.activeSpeakerCallbacks.forEach(cb => cb(data));

        if (!this.recvTransport || !this.device || !this.currentRoomId) return;
        const myId = this.getCurrentUserId();

        // Request video consumers for newly active speakers
        for (const speakerId of data.activeSpeakerIds) {
          if (speakerId === myId) continue;
          // Find their video producer from room state
          const rs = this.getRoomProducers();
          const videoProducer = rs.find(p => p.userId === speakerId && p.kind === 'video');
          if (videoProducer && !this.consumedProducerIds.has(videoProducer.id)) {
            await this.consumeProducer(videoProducer.id, speakerId, 'thumb').catch(() => {});
          }
        }
      }
    );
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Media Capture
  // ────────────────────────────────────────────────────────────────────────────

  async initializeMedia(audio = true, video = false): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: audio
        ? { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
        : false,
      video: video
        ? { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } }
        : false,
    };

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Media access timeout — check permissions')), 10000)
    );

    this.localStream = await Promise.race([
      navigator.mediaDevices.getUserMedia(constraints),
      timeout,
    ]);

    if (this.isInCall && this.sendTransport) {
      for (const track of this.localStream.getTracks()) {
        await this.produceTrack(track);
      }
    }

    return this.localStream;
  }

  stopMedia(): void {
    this.localStream?.getTracks().forEach(t => t.stop());
    this.localStream = null;
  }

  getLocalStream(): MediaStream | null {
    return this.localStream;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Mediasoup Device + Transport creation
  // ────────────────────────────────────────────────────────────────────────────

  private async initializeDevice(rtpCapabilities: any): Promise<void> {
    if (!rtpCapabilities || typeof rtpCapabilities !== 'object' || Array.isArray(rtpCapabilities)) {
      throw new Error(`Invalid routerRtpCapabilities: ${JSON.stringify(rtpCapabilities)}`);
    }
    this.device = new mediasoup.Device();
    await this.device.load({ routerRtpCapabilities: rtpCapabilities });
    console.log('[Mediasoup] Device loaded');
  }

  private async createSendTransport(roomId: string): Promise<void> {
    if (!this.sfuSocket || !this.device) throw new Error('SFU socket or device not ready');

    return new Promise((resolve, reject) => {
      this.sfuSocket!.emit('sfu:createWebRtcTransport', { roomId }, (data: any) => {
        if (data?.error) return reject(new Error(data.error));
        try {
          this.sendTransport = this.device!.createSendTransport(data);
        } catch (err) {
          return reject(err);
        }

        this.sendTransport!.on('connect', ({ dtlsParameters }, callback, errback) => {
          this.sfuSocket!.emit(
            'sfu:connectWebRtcTransport',
            { roomId, transportId: this.sendTransport!.id, dtlsParameters },
            (res: any) => {
              if (res?.error) errback(new Error(res.error));
              else callback();
            }
          );
        });

        this.sendTransport!.on('produce', ({ kind, rtpParameters }, callback, errback) => {
          this.sfuSocket!.emit(
            'sfu:produce',
            { roomId, transportId: this.sendTransport!.id, kind, rtpParameters },
            (res: any) => {
              if (res?.error) errback(new Error(res.error));
              else callback({ id: res.id });
            }
          );
        });

        this.sendTransport!.on('connectionstatechange', state => {
          console.log(`[Mediasoup] Send transport: ${state}`);
        });

        resolve();
      });
    });
  }

  private async createRecvTransport(roomId: string): Promise<void> {
    if (!this.sfuSocket || !this.device) throw new Error('SFU socket or device not ready');

    return new Promise((resolve, reject) => {
      this.sfuSocket!.emit('sfu:createWebRtcTransport', { roomId }, (data: any) => {
        if (data?.error) return reject(new Error(data.error));
        try {
          this.recvTransport = this.device!.createRecvTransport(data);
        } catch (err) {
          return reject(err);
        }

        this.recvTransport!.on('connect', ({ dtlsParameters }, callback, errback) => {
          this.sfuSocket!.emit(
            'sfu:connectWebRtcTransport',
            { roomId, transportId: this.recvTransport!.id, dtlsParameters },
            (res: any) => {
              if (res?.error) errback(new Error(res.error));
              else callback();
            }
          );
        });

        this.recvTransport!.on('connectionstatechange', state => {
          console.log(`[Mediasoup] Recv transport: ${state}`);
        });

        resolve();
      });
    });
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Produce local tracks
  // ────────────────────────────────────────────────────────────────────────────

  private async produceTrack(track: MediaStreamTrack): Promise<void> {
    if (!this.sendTransport || track.readyState === 'ended') return;
    if (this.producers.has(track.kind)) return; // avoid duplicate producers

    try {
      // For video tracks, send 3 simulcast layers so the SFU can selectively
      // forward the appropriate resolution per-consumer:
      //   r0 → 180p @ ≤100kbps (thumbnail viewers)
      //   r1 → 360p @ ≤300kbps (standard grid)
      //   r2 → 720p @ ≤900kbps (featured/pinned speaker)
      const isVideo = track.kind === 'video';
      const produceOptions: any = { track };

      if (isVideo) {
        produceOptions.encodings = [
          { rid: 'r0', maxBitrate: 100_000, scaleResolutionDownBy: 4 },
          { rid: 'r1', maxBitrate: 300_000, scaleResolutionDownBy: 2 },
          { rid: 'r2', maxBitrate: 900_000, scaleResolutionDownBy: 1 },
        ];
        produceOptions.codecOptions = { videoGoogleStartBitrate: 1000 };
      }

      const producer = await this.sendTransport.produce(produceOptions);
      this.producers.set(track.kind, producer);
      console.log(`[Mediasoup] Producing ${track.kind}: ${producer.id}${isVideo ? ' (simulcast 3 layers)' : ''}`);

      producer.on('transportclose', () => this.producers.delete(track.kind));
      producer.on('trackended', () => {
        producer.close();
        this.producers.delete(track.kind);
      });
    } catch (err) {
      console.error(`[Mediasoup] Failed to produce ${track.kind}:`, err);
      throw err;
    }
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Consume remote tracks
  // ────────────────────────────────────────────────────────────────────────────

  /** Cache of known room producers keyed by producerId (populated on getProducers) */
  private knownRoomProducers: Array<{ id: string; userId: string; kind: string }> = [];

  private getRoomProducers() { return this.knownRoomProducers; }

  private async consumeProducer(
    producerId: string,
    producerUserId: string,
    viewContext: 'featured' | 'thumb' = 'thumb'
  ): Promise<void> {
    if (!this.sfuSocket || !this.recvTransport || !this.device || !this.currentRoomId) return;
    if (this.consumedProducerIds.has(producerId)) return;

    return new Promise<void>((resolve) => {
      this.sfuSocket!.emit(
        'sfu:consume',
        {
          roomId:          this.currentRoomId,
          transportId:     this.recvTransport!.id,
          producerId,
          rtpCapabilities: this.device!.rtpCapabilities,
          viewContext,
          kind:            undefined, // SFU infers kind from producerId
        },
        async (data: any) => {
          // BLOCKER-1 (client): Server gated this video consumer — not an active speaker.
          // Show avatar fallback. No crash, no error toast — this is the happy path.
          if (data?.gated) {
            console.log(`[SFU] Video gated for producer ${producerId} (${data.reason}) — showing avatar`);
            return resolve();
          }

          try {
            const consumer: Consumer = await this.recvTransport!.consume(data);
            this.consumers.set(consumer.id, consumer);
            this.consumedProducerIds.add(producerId);
            console.log(`[Mediasoup] Consumer: ${consumer.id} (${consumer.kind}) ← ${producerUserId}`);

            consumer.on('transportclose', () => {
              this.consumedProducerIds.delete(producerId);
              this.consumers.delete(consumer.id);
            });
            consumer.on('producerclose', () => {
              this.handleRemoteProducerClosed(producerId, producerUserId);
            });

            // CRITICAL: always create a NEW MediaStream so React re-renders
            const existingPeer = this.peerConnections.get(producerUserId);
            const existingTracks = existingPeer ? existingPeer.stream.getTracks() : [];
            const newStream = new MediaStream([...existingTracks, consumer.track]);

            this.peerConnections.set(producerUserId, {
              userId: producerUserId,
              stream: newStream,
              isConnected: true,
            });
            this.notifyPeerConnectionsUpdated();

            // Resume consumer via SFU socket
            this.sfuSocket!.emit(
              'sfu:resumeConsumer',
              { roomId: this.currentRoomId!, consumerId: consumer.id },
              (res: any) => {
                if (res?.error) console.error('[Mediasoup] Resume error:', res.error);
                else console.log(`[Mediasoup] Consumer resumed: ${consumer.id}`);
              }
            );
          } catch (err) {
            console.error('[Mediasoup] Error setting up consumer:', err);
          }
          resolve();
        }
      );
    });
  }

  /**
   * Request HD video for a pinned user (bypasses active-speaker gate).
   * Call when user pins someone in the UI.
   */
  async requestPinnedVideo(
    producerId: string,
    producerUserId: string,
  ): Promise<void> {
    if (!this.sfuSocket || !this.recvTransport || !this.device || !this.currentRoomId) return;
    if (this.consumedProducerIds.has(producerId)) return;

    return new Promise<void>((resolve) => {
      this.sfuSocket!.emit(
        'sfu:requestProducerVideo',
        {
          roomId:          this.currentRoomId,
          producerId,
          transportId:     this.recvTransport!.id,
          rtpCapabilities: this.device!.rtpCapabilities,
        },
        async (data: any) => {
          if (data?.error) { console.error('[SFU] requestPinnedVideo error:', data.error); return resolve(); }
          try {
            const consumer: Consumer = await this.recvTransport!.consume(data);
            this.consumers.set(consumer.id, consumer);
            this.consumedProducerIds.add(producerId);

            consumer.on('transportclose', () => { this.consumedProducerIds.delete(producerId); this.consumers.delete(consumer.id); });
            consumer.on('producerclose',  () => { this.handleRemoteProducerClosed(producerId, producerUserId); });

            const existingPeer = this.peerConnections.get(producerUserId);
            const existingTracks = existingPeer ? existingPeer.stream.getTracks() : [];
            this.peerConnections.set(producerUserId, {
              userId: producerUserId,
              stream: new MediaStream([...existingTracks, consumer.track]),
              isConnected: true,
            });
            this.notifyPeerConnectionsUpdated();

            this.sfuSocket!.emit('sfu:resumeConsumer', { roomId: this.currentRoomId!, consumerId: consumer.id }, () => {});
          } catch (err) { console.error('[SFU] requestPinnedVideo setup error:', err); }
          resolve();
        }
      );
    });
  }

  private handleRemoteProducerClosed(producerId: string, producerUserId: string): void {
    this.consumedProducerIds.delete(producerId);

    for (const [consumerId, consumer] of this.consumers.entries()) {
      if ((consumer as any).producerId === producerId) {
        consumer.close();
        this.consumers.delete(consumerId);
        break;
      }
    }

    const peer = this.peerConnections.get(producerUserId);
    if (!peer) return;

    const remainingTracks = peer.stream.getTracks().filter(t => t.readyState === 'live');
    if (remainingTracks.length === 0) {
      this.peerConnections.delete(producerUserId);
    } else {
      this.peerConnections.set(producerUserId, {
        ...peer,
        stream: new MediaStream(remainingTracks),
      });
    }
    this.notifyPeerConnectionsUpdated();
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Join / Leave Call
  // ────────────────────────────────────────────────────────────────────────────

  async joinCall(roomId: string): Promise<void> {
    this.currentRoomId = roomId;

    // Step 1: Connect dedicated SFU socket (VITE_SFU_URL)
    await this.connectToSFU();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timed out negotiating with SFU')), 15000);

      this.sfuSocket!.emit('sfu:getRouterRtpCapabilities', { roomId }, async (data: any) => {
        try {
          if (data?.error) throw new Error(data.error);

          const rtpCaps =
            data?.rtpCapabilities ?? data?.data?.rtpCapabilities ?? data?.data ?? data;

          await this.initializeDevice(rtpCaps);
          await this.createSendTransport(roomId);
          await this.createRecvTransport(roomId);

          this.isInCall = true;
          this.socket?.emit('webrtc:join-call', { roomId });

          // Consume existing producers (late joiner)
          await new Promise<void>((res) => {
            this.sfuSocket!.emit('sfu:getProducers', { roomId }, async (producerRes: any) => {
              if (producerRes?.producers && Array.isArray(producerRes.producers)) {
                // Cache for active-speaker handler
                this.knownRoomProducers = producerRes.producers;
                const myId = this.getCurrentUserId();
                for (const p of producerRes.producers) {
                  if (p.userId !== myId) {
                    // Audio always: consume immediately
                    // Video: gated by server — consume only for active speakers
                    await this.consumeProducer(p.id, p.userId, 'thumb');
                  }
                }
              }
              res();
            });
          });

          // Produce local tracks
          if (this.localStream) {
            for (const track of this.localStream.getTracks()) {
              await this.produceTrack(track);
            }
          }

          clearTimeout(timeout);
          console.log('[roomService] joinCall complete');
          resolve();
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });
    });
  }

  async leaveCall(roomId: string): Promise<void> {
    this.producers.forEach(p => p.close());
    this.producers.clear();
    this.consumers.forEach(c => c.close());
    this.consumers.clear();
    this.consumedProducerIds.clear();
    this.knownRoomProducers = [];

    this.sendTransport?.close();
    this.sendTransport = null;
    this.recvTransport?.close();
    this.recvTransport = null;
    this.device = null;

    this.socket?.emit('webrtc:leave-call', { roomId });
    this.disconnectSFU();

    this.peerConnections.clear();
    this.notifyPeerConnectionsUpdated();

    this.isInCall = false;
    this.currentRoomId = null;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Toggle Audio / Video
  // ────────────────────────────────────────────────────────────────────────────

  async toggleAudio(forceState?: boolean): Promise<boolean> {
    console.log('[roomService.toggleAudio] Called with forceState:', forceState);
    console.log('[roomService.toggleAudio] localStream exists:', !!this.localStream);
    
    if (!this.localStream) {
      console.log('[roomService.toggleAudio] Initializing media...');
      await this.initializeMedia(true, false);
    }
    
    const track = this.localStream!.getAudioTracks()[0];
    console.log('[roomService.toggleAudio] Audio track found:', !!track);
    if (!track) {
      console.error('[roomService.toggleAudio] No audio track found!');
      return false;
    }

    const newState = forceState !== undefined ? forceState : !track.enabled;
    console.log('[roomService.toggleAudio] Setting track.enabled from', track.enabled, 'to', newState);
    track.enabled = newState;
    
    const producer = this.producers.get('audio');
    console.log('[roomService.toggleAudio] Audio producer found:', !!producer);
    if (producer) {
      try { 
        console.log('[roomService.toggleAudio] Producer state change:', newState ? 'resume' : 'pause');
        if (track.enabled) {
          await producer.resume();
        } else {
          await producer.pause();
        }
      }
      catch (err) { console.error('[Mediasoup] Audio toggle error:', err); }
    }
    
    console.log('[roomService.toggleAudio] Returning track.enabled:', track.enabled);
    return track.enabled;
  }

  async toggleHand(roomId: string, isRaised: boolean): Promise<void> {
    this.socket?.emit('room:hand-toggle', { roomId, isRaised });
  }

  toggleModerator(roomId: string, targetUserId: string, isModerator: boolean): void {
    this.socket?.emit('room:toggle-moderator', { roomId, targetUserId, isModerator });
  }

  muteAllParticipants(roomId: string): void {
    this.socket?.emit('room:mute-all', { roomId });
  }

  clearRoomChat(roomId: string): void {
    this.socket?.emit('room:clear-chat', { roomId });
  }

  onHandToggled(cb: (data: { userId: string; isRaised: boolean }) => void): () => void {
    this.onHandToggledCallbacks.push(cb);
    return () => { this.onHandToggledCallbacks = this.onHandToggledCallbacks.filter(x => x !== cb); };
  }

  onRoomHistory(cb: (data: { roomId: string; messages: any[] }) => void): () => void {
    this.roomHistoryCallbacks.push(cb);
    return () => { this.roomHistoryCallbacks = this.roomHistoryCallbacks.filter(x => x !== cb); };
  }

  onReaction(cb: (data: { userId: string; reaction: string }) => void): () => void {
    this.roomReactionCallbacks.push(cb);
    return () => { this.roomReactionCallbacks = this.roomReactionCallbacks.filter(x => x !== cb); };
  }

  onForceKick(cb: (data: { roomId: string }) => void): () => void {
    this.forceKickCallbacks.push(cb);
    return () => { this.forceKickCallbacks = this.forceKickCallbacks.filter(x => x !== cb); };
  }

  onForceMute(cb: (data: { roomId: string }) => void): () => void {
    this.forceMuteCallbacks.push(cb);
    return () => { this.forceMuteCallbacks = this.forceMuteCallbacks.filter(x => x !== cb); };
  }

  onLockUpdated(cb: (data: { isLocked: boolean; updatedBy: string }) => void): () => void {
    this.lockUpdatedCallbacks.push(cb);
    return () => { this.lockUpdatedCallbacks = this.lockUpdatedCallbacks.filter(x => x !== cb); };
  }

  sendReaction(roomId: string, reaction: string): void {
    this.socket?.emit('room:reaction', { roomId, reaction });
  }

  kickUser(roomId: string, targetUserId: string, isBlock = false): void {
    this.socket?.emit('room:kick-user', { roomId, targetUserId, isBlock });
  }

  muteUser(roomId: string, targetUserId: string): void {
    this.socket?.emit('room:mute-user', { roomId, targetUserId });
  }

  toggleRoomLock(roomId: string, isLocked: boolean): void {
    this.socket?.emit('room:toggle-lock', { roomId, isLocked });
  }

  unblockUser(roomId: string, targetUserId: string): void {
    this.socket?.emit('room:unblock-user', { roomId, targetUserId });
  }

  async toggleVideo(): Promise<boolean> {
    if (!this.localStream) {
      await this.initializeMedia(true, true);
      const t = this.localStream!.getVideoTracks()[0];
      if (this.isInCall && t) await this.produceTrack(t);
      return true;
    }

    let videoTrack = this.localStream.getVideoTracks()[0];
    if (!videoTrack) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoTrack = stream.getVideoTracks()[0];
      this.localStream.addTrack(videoTrack);
      if (this.isInCall) await this.produceTrack(videoTrack);
      return true;
    }

    videoTrack.enabled = !videoTrack.enabled;
    const producer = this.producers.get('video');
    if (producer) {
      try { 
        if (videoTrack.enabled) {
          await producer.resume();
        } else {
          await producer.pause();
        }
      }
      catch (err) { console.error('[Mediasoup] Video toggle error:', err); }
    }
    return videoTrack.enabled;
  }

  // ────────────────────────────────────────────────────────────────────────────
  // Accessors
  // ────────────────────────────────────────────────────────────────────────────

  isUserInCall(): boolean { return this.isInCall; }
  getAllPeerConnections(): Map<string, PeerConnection> { return this.peerConnections; }
  isConnected(): boolean { return this.socket?.connected ?? false; }

  // ────────────────────────────────────────────────────────────────────────────
  // Event Subscriptions
  // ────────────────────────────────────────────────────────────────────────────

  onRoomMessage(cb: (msg: RoomMessage) => void): () => void {
    this.roomMessageCallbacks.push(cb);
    return () => { this.roomMessageCallbacks = this.roomMessageCallbacks.filter(x => x !== cb); };
  }

  onRoomUserJoined(cb: (data: { roomId: string; userId: string }) => void): () => void {
    this.roomUserJoinedCallbacks.push(cb);
    return () => { this.roomUserJoinedCallbacks = this.roomUserJoinedCallbacks.filter(x => x !== cb); };
  }

  onRoomUserLeft(cb: (data: { roomId: string; userId: string }) => void): () => void {
    this.roomUserLeftCallbacks.push(cb);
    return () => { this.roomUserLeftCallbacks = this.roomUserLeftCallbacks.filter(x => x !== cb); };
  }

  onRoomClosed(cb: (data: { roomId: string }) => void): () => void {
    this.roomClosedCallbacks.push(cb);
    return () => { this.roomClosedCallbacks = this.roomClosedCallbacks.filter(x => x !== cb); };
  }

  onWebRTCUserJoinedCall(cb: (data: { roomId: string; userId: string }) => void): () => void {
    this.webrtcUserJoinedCallCallbacks.push(cb);
    return () => { this.webrtcUserJoinedCallCallbacks = this.webrtcUserJoinedCallCallbacks.filter(x => x !== cb); };
  }

  onWebRTCUserLeftCall(cb: (data: { roomId: string; userId: string }) => void): () => void {
    this.webrtcUserLeftCallCallbacks.push(cb);
    return () => { this.webrtcUserLeftCallCallbacks = this.webrtcUserLeftCallCallbacks.filter(x => x !== cb); };
  }

  onActiveSpeakers(cb: (data: { roomId: string; activeSpeakerIds: string[] }) => void): () => void {
    this.activeSpeakerCallbacks.push(cb);
    return () => { this.activeSpeakerCallbacks = this.activeSpeakerCallbacks.filter(x => x !== cb); };
  }

  onPeerConnectionsUpdated(cb: (connections: Map<string, PeerConnection>) => void): () => void {
    this.peerConnectionUpdatedCallbacks.push(cb);
    cb(this.peerConnections);
    return () => {
      this.peerConnectionUpdatedCallbacks = this.peerConnectionUpdatedCallbacks.filter(x => x !== cb);
    };
  }
}

// ─── Singleton export ────────────────────────────────────────────────────────
export const roomService = new RoomService();
export default roomService;
