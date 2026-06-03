type AudioLevelHandler = (userId: string, level: number, isSpeaking: boolean) => void;
type ActiveSpeakersHandler = (activeUserIds: string[]) => void;

class SpeakerDetector {
  private audioContext: AudioContext | null = null;
  private analysers: Map<string, AnalyserNode> = new Map();
  private dataArrays: Map<string, Uint8Array> = new Map();
  private sources: Map<string, MediaStreamAudioSourceNode> = new Map();
  private activeStreams: Map<string, MediaStream> = new Map();
  
  private animationFrameId: number | null = null;
  
  // Event listeners
  private audioLevelListeners: Set<AudioLevelHandler> = new Set();
  private activeSpeakersListeners: Set<ActiveSpeakersHandler> = new Set();
  
  // State
  private speakingUsers: Set<string> = new Set();
  private lastActiveSpeakersUpdate = 0;
  
  // Config
  private readonly SPEAKING_THRESHOLD = 15;
  private readonly ACTIVE_SPEAKERS_THROTTLE_MS = 1000;

  constructor() {
    this.detectLoop = this.detectLoop.bind(this);
  }

  // ---- Event Emitters ----

  onAudioLevel(handler: AudioLevelHandler): () => void {
    this.audioLevelListeners.add(handler);
    return () => this.audioLevelListeners.delete(handler);
  }

  onActiveSpeakers(handler: ActiveSpeakersHandler): () => void {
    this.activeSpeakersListeners.add(handler);
    return () => this.activeSpeakersListeners.delete(handler);
  }

  // ---- Core Logic ----

  startDetecting(userId: string, stream: MediaStream) {
    if (!stream.getAudioTracks().length) return;

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    // Resume context if suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(console.error);
    }

    try {
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      // DO NOT connect analyser to destination to avoid echo

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      this.analysers.set(userId, analyser);
      this.dataArrays.set(userId, dataArray);
      this.sources.set(userId, source);
      this.activeStreams.set(userId, stream);

      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(this.detectLoop);
      }
    } catch (err) {
      console.warn('[SpeakerDetector] Failed to attach stream for', userId, err);
    }
  }

  stopDetecting(userId: string) {
    const source = this.sources.get(userId);
    const analyser = this.analysers.get(userId);
    
    if (source) source.disconnect();
    if (analyser) analyser.disconnect();
    
    this.sources.delete(userId);
    this.analysers.delete(userId);
    this.dataArrays.delete(userId);
    this.activeStreams.delete(userId);
    this.speakingUsers.delete(userId);

    if (this.analysers.size === 0 && this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.audioContext?.close().catch(console.error);
    this.audioContext = null;
    
    this.sources.forEach(s => s.disconnect());
    this.analysers.forEach(a => a.disconnect());
    
    this.sources.clear();
    this.analysers.clear();
    this.dataArrays.clear();
    this.activeStreams.clear();
    this.speakingUsers.clear();
    this.audioLevelListeners.clear();
    this.activeSpeakersListeners.clear();
  }

  private detectLoop() {
    if (this.analysers.size === 0) {
      this.animationFrameId = null;
      return;
    }

    let speakingChanged = false;
    const now = Date.now();

    for (const [userId, analyser] of this.analysers.entries()) {
      const dataArray = this.dataArrays.get(userId)!;
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const isSpeaking = average > this.SPEAKING_THRESHOLD;

      // Track speaking users (for the featured grid)
      if (isSpeaking && !this.speakingUsers.has(userId)) {
        this.speakingUsers.add(userId);
        speakingChanged = true;
      } else if (!isSpeaking && this.speakingUsers.has(userId)) {
        // We could add a decay here, but for the raw audio event we send exactly what is happening
        // Decay will be handled loosely by the throttled update
        this.speakingUsers.delete(userId);
        speakingChanged = true;
      }

      // Emit high-frequency event for pure DOM ref animations
      this.audioLevelListeners.forEach(handler => handler(userId, average, isSpeaking));
    }

    // Emit throttled active speakers for React layout updates
    if (speakingChanged && now - this.lastActiveSpeakersUpdate > this.ACTIVE_SPEAKERS_THROTTLE_MS) {
      this.lastActiveSpeakersUpdate = now;
      this.activeSpeakersListeners.forEach(handler => handler(Array.from(this.speakingUsers).slice(0, 4)));
    }

    this.animationFrameId = requestAnimationFrame(this.detectLoop);
  }
}

export const speakerDetector = new SpeakerDetector();
