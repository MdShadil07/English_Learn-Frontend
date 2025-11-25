export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  // AudioWorkletNode preferred, fall back to ScriptProcessorNode when unavailable
  private processor: AudioWorkletNode | ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;

  constructor(private onAudioData: (audioData: Float32Array) => void) {}

  // Create a blob URL for the worklet processor so we can register it dynamically
  private createWorkletModuleUrl(): string {
    const workletCode = `
      class RecorderProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
        }
        process(inputs) {
          const input = inputs[0];
          if (input && input[0]) {
            const channel = input[0];
            // Copy to a new Float32Array and transfer its buffer to the main thread
            const buffer = new Float32Array(channel.length);
            buffer.set(channel);
            this.port.postMessage(buffer.buffer, [buffer.buffer]);
          }
          return true;
        }
      }
      registerProcessor('recorder-processor', RecorderProcessor);
    `;

    const blob = new Blob([workletCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
  }

  async start() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      this.audioContext = new AudioContext({ sampleRate: 24000 });
      this.source = this.audioContext.createMediaStreamSource(this.stream);

      // Prefer AudioWorkletNode when available
      if (this.audioContext.audioWorklet && typeof this.audioContext.audioWorklet.addModule === 'function') {
        try {
          const moduleUrl = this.createWorkletModuleUrl();
          // Register the worklet processor
          // addModule expects a same-origin or blob URL; blob URL is fine here
          await this.audioContext.audioWorklet.addModule(moduleUrl);
          // Create the worklet node
          this.processor = new AudioWorkletNode(this.audioContext, 'recorder-processor');

          // Handle incoming buffers from the worklet
          (this.processor as AudioWorkletNode).port.onmessage = (e: MessageEvent) => {
            const arrayBuffer = e.data as ArrayBuffer;
            try {
              const floatData = new Float32Array(arrayBuffer);
              this.onAudioData(floatData);
            } catch (err) {
              // If reconstruction fails, ignore gracefully
              console.error('Failed to reconstruct audio buffer from worklet:', err);
            }
          };

          this.source.connect(this.processor as AudioWorkletNode);
          // Connect to destination to keep the node active; volume is zeroed by default
          (this.processor as AudioWorkletNode).connect(this.audioContext.destination);
          return;
        } catch (err) {
          console.warn('AudioWorkletNode registration failed, falling back to ScriptProcessorNode:', err);
          // fall through to ScriptProcessorNode fallback
        }
      }

      // Fallback for older browsers: ScriptProcessorNode (deprecated but widely supported)
      // Use a small buffer size to reduce latency
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      (this.processor as ScriptProcessorNode).onaudioprocess = (e: AudioProcessingEvent) => {
        const inputData = e.inputBuffer.getChannelData(0);
        this.onAudioData(new Float32Array(inputData));
      };

      this.source.connect(this.processor as ScriptProcessorNode);
      (this.processor as ScriptProcessorNode).connect(this.audioContext.destination);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  stop() {
    if (this.source) {
      try { this.source.disconnect(); } catch (err) { console.warn('Error disconnecting source', err); }
      this.source = null;
    }
    if (this.processor) {
      try { this.processor.disconnect(); } catch (err) { console.warn('Error disconnecting processor', err); }
      // If it is an AudioWorkletNode, also remove its message handler
      try {
        if ((this.processor as AudioWorkletNode).port) {
          (this.processor as AudioWorkletNode).port.onmessage = null;
        }
      } catch (err) { console.warn('Error clearing processor message handler', err); }
      this.processor = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.audioContext) {
      try { this.audioContext.close(); } catch (err) { console.warn('Error closing AudioContext', err); }
      this.audioContext = null;
    }
  }
}

export const encodeAudioForAPI = (float32Array: Float32Array): string => {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  
  const uint8Array = new Uint8Array(int16Array.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  
  return btoa(binary);
};

export const createWavFromPCM = (pcmData: Uint8Array): Uint8Array => {
  const int16Data = new Int16Array(pcmData.length / 2);
  for (let i = 0; i < pcmData.length; i += 2) {
    int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
  }
  
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  const sampleRate = 24000;
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const byteRate = sampleRate * blockAlign;

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + int16Data.byteLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, int16Data.byteLength, true);

  const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
  
  return wavArray;
};

class AudioQueue {
  private queue: Uint8Array[] = [];
  private isPlaying = false;
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  async addToQueue(audioData: Uint8Array) {
    this.queue.push(audioData);
    if (!this.isPlaying) {
      await this.playNext();
    }
  }

  private async playNext() {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      return;
    }

    this.isPlaying = true;
    const audioData = this.queue.shift()!;

    try {
      const wavData = createWavFromPCM(audioData);
      const buffer = new ArrayBuffer(wavData.byteLength);
      new Uint8Array(buffer).set(wavData);
      const audioBuffer = await this.audioContext.decodeAudioData(buffer);
      
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      
      source.onended = () => this.playNext();
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
      this.playNext();
    }
  }
}

let audioQueueInstance: AudioQueue | null = null;

export const playAudioData = async (audioContext: AudioContext, audioData: Uint8Array) => {
  if (!audioQueueInstance) {
    audioQueueInstance = new AudioQueue(audioContext);
  }
  await audioQueueInstance.addToQueue(audioData);
};
