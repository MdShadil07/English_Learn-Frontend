/**
 * Speech Synthesis Utility
 * Advanced global utility for multi-language text-to-speech functionality
 * Supports emoji descriptions, language-specific voices, and intelligent text cleaning
 * Includes fallback strategies for languages without native browser support
 */

import { 
  cleanTextForSpeech, 
  getVoiceCodesForLanguage, 
  validateTextForSpeech 
} from './AI Chat/advancedTextCleaner';

import { showVoiceInstallationHelpInConsole } from './AI Chat/voiceInstallationGuide';

export interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number; // 0.1 to 10 (default: 1)
  pitch?: number; // 0 to 2 (default: 1)
  volume?: number; // 0 to 1 (default: 1)
  lang?: string; // Language code (e.g., 'en-US', 'hi-IN', 'es-ES')
  language?: string; // Human-readable language name (e.g., 'english', 'hindi', 'spanish')
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

// Languages that commonly lack browser support
const FALLBACK_LANGUAGES = ['hindi', 'urdu', 'bengali', 'arabic', 'thai', 'vietnamese'];

class SpeechSynthesisManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isEnabled: boolean = true;
  private isPaused: boolean = false;
  private queue: string[] = [];
  private isProcessingQueue: boolean = false;

  constructor() {
    this.synthesis = window.speechSynthesis;
    
    // Handle page visibility change to prevent speech issues
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.currentUtterance) {
        this.pause();
      }
    });
  }

  /**
   * Check if speech synthesis is supported
   */
  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Get available voices
   */
  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
      let voices = this.synthesis.getVoices();
      
      if (voices.length > 0) {
        resolve(voices);
      } else {
        // Wait for voices to be loaded
        this.synthesis.onvoiceschanged = () => {
          voices = this.synthesis.getVoices();
          resolve(voices);
        };
      }
    });
  }

  /**
   * Get available voices for a specific language
   */
  async getVoicesForLanguage(language: string): Promise<SpeechSynthesisVoice[]> {
    const voices = await this.getVoices();
    const voiceCodes = getVoiceCodesForLanguage(language);
    
    // Find voices matching the language codes
    const matchingVoices = voices.filter(voice => 
      voiceCodes.some(code => voice.lang.startsWith(code.split('-')[0]))
    );
    
    return matchingVoices.length > 0 ? matchingVoices : voices.filter(v => v.lang.startsWith('en'));
  }

  /**
   * Get the best voice for a specific language
   */
  async getBestVoiceForLanguage(language: string): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await this.getVoicesForLanguage(language);
    const voiceCodes = getVoiceCodesForLanguage(language);
    
    console.log('🔍 TTS: Finding voice for language:', language);
    console.log('📋 TTS: Voice codes:', voiceCodes);
    console.log('🎙️ TTS: Available voices:', voices.length, voices.map(v => `${v.name} (${v.lang})`));
    
    // Priority: exact match > local variant > any match > English fallback
    for (const code of voiceCodes) {
      const exactMatch = voices.find(v => v.lang === code);
      if (exactMatch) {
        console.log('✅ TTS: Exact match found:', exactMatch.name, exactMatch.lang);
        return exactMatch;
      }
    }
    
    for (const code of voiceCodes) {
      const localMatch = voices.find(v => v.lang.startsWith(code.split('-')[0]));
      if (localMatch) {
        console.log('✅ TTS: Local match found:', localMatch.name, localMatch.lang);
        return localMatch;
      }
    }
    
    const fallback = voices[0] || (await this.getDefaultVoice());
    console.log('⚠️ TTS: Using fallback voice:', fallback?.name, fallback?.lang);
    return fallback;
  }

  /**
   * Check if a language has proper native voice support
   */
  async hasNativeVoiceSupport(language: string): Promise<boolean> {
    const voices = await this.getVoicesForLanguage(language);
    const voiceCodes = getVoiceCodesForLanguage(language);
    
    // Check if we have any voice matching the language codes
    const hasMatch = voiceCodes.some(code => 
      voices.some(v => v.lang.startsWith(code.split('-')[0]))
    );
    
    console.log('🔍 TTS: Native voice support for', language, ':', hasMatch);
    return hasMatch;
  }

  /**
   * Split text into smaller chunks for better pronunciation
   * Useful for languages with poor voice quality
   */
  private splitTextIntoChunks(text: string, maxChunkSize: number = 100): string[] {
    // Split by sentences first
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    
    for (const sentence of sentences) {
      if (sentence.length <= maxChunkSize) {
        chunks.push(sentence.trim());
      } else {
        // Split long sentences by commas or spaces
        const parts = sentence.split(/[,،]/); // Include Arabic comma
        for (const part of parts) {
          if (part.trim()) {
            chunks.push(part.trim());
          }
        }
      }
    }
    
    return chunks.filter(chunk => chunk.length > 0);
  }

  /**
   * Get English voices only
   */
  async getEnglishVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = await this.getVoices();
    return voices.filter(voice => voice.lang.startsWith('en'));
  }

  /**
   * Get a specific voice by name or language
   */
  async getVoiceByLang(lang: string = 'en-US'): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await this.getVoices();
    return voices.find(voice => voice.lang === lang) || voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
  }

  /**
   * Get the default voice for a language
   */
  async getDefaultVoice(lang: string = 'en-US'): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await this.getVoices();
    return voices.find(voice => voice.default && voice.lang.startsWith(lang.split('-')[0])) || 
           voices.find(voice => voice.lang === lang) ||
           voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
  }

  /**
   * Speak the given text with advanced cleaning and language support
   */
  async speak(text: string, options: SpeechOptions = {}): Promise<void> {
    if (!this.isSupported()) {
      console.error('Speech synthesis is not supported in this browser');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    if (!this.isEnabled) {
      console.log('Speech synthesis is disabled');
      return Promise.resolve();
    }

    // Validate and clean text
    const language = options.language || 'english';
    console.log('🔊 TTS: Speaking with language:', language, 'Original text length:', text.length);
    
    const validation = validateTextForSpeech(text);
    
    if (!validation.valid) {
      console.error('Text validation failed:', validation.error);
      return Promise.reject(new Error(validation.error));
    }

    const cleanedText = cleanTextForSpeech(text, language);
    console.log('🧹 TTS: Cleaned text length:', cleanedText.length, 'First 100 chars:', cleanedText.substring(0, 100));
    
    if (!cleanedText || cleanedText.trim().length === 0) {
      console.warn('No text to speak after cleaning');
      return Promise.resolve();
    }

    // Check if language needs special handling
    const needsFallback = FALLBACK_LANGUAGES.includes(language.toLowerCase());
    const hasNativeSupport = await this.hasNativeVoiceSupport(language);
    
    if (needsFallback && !hasNativeSupport) {
      console.warn('⚠️ TTS: Language', language, 'lacks native support. Using chunked speech for better quality.');
      
      // Show installation guide once per session for this language
      const sessionKey = `tts_guide_shown_${language}`;
      if (!sessionStorage.getItem(sessionKey)) {
        showVoiceInstallationHelpInConsole(language);
        sessionStorage.setItem(sessionKey, 'true');
      }
      
      return this.speakWithChunking(cleanedText, options);
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.currentUtterance = utterance;

    // Get voice codes for the language
    const voiceCodes = getVoiceCodesForLanguage(language);
    const primaryLangCode = voiceCodes[0] || 'en-US';

    // Set voice with language-specific selection
    if (options.voice) {
      utterance.voice = options.voice;
      utterance.lang = options.voice.lang || primaryLangCode;
      console.log('🎤 TTS: Using provided voice:', options.voice.name);
    } else if (options.language) {
      const voice = await this.getBestVoiceForLanguage(options.language);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
        console.log('🎤 TTS: Selected voice for', options.language, ':', voice.name, 'Lang:', voice.lang);
      } else {
        // Even if no voice found, set the language code so browser can try
        utterance.lang = primaryLangCode;
        console.warn('⚠️ TTS: No voice found for language:', options.language, 'Using lang code:', primaryLangCode);
      }
    } else if (options.lang) {
      const voice = await this.getVoiceByLang(options.lang);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = options.lang;
      } else {
        utterance.lang = options.lang;
      }
    } else {
      const defaultVoice = await this.getDefaultVoice();
      if (defaultVoice) {
        utterance.voice = defaultVoice;
        utterance.lang = defaultVoice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }
    }

    // Set speech parameters with optimized defaults
    utterance.rate = options.rate ?? 0.95; // Slightly slower for clarity
    utterance.pitch = options.pitch ?? 1.0;
    utterance.volume = options.volume ?? 1.0;

    return new Promise((resolve, reject) => {
      // Event handlers
      utterance.onstart = () => {
        this.isPaused = false;
        options.onStart?.();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        this.isPaused = false;
        options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        this.isPaused = false;
        console.error('Speech synthesis error:', event);
        options.onError?.(event);
        reject(event);
      };

      utterance.onpause = () => {
        this.isPaused = true;
        options.onPause?.();
      };

      utterance.onresume = () => {
        this.isPaused = false;
        options.onResume?.();
      };
      
      utterance.onboundary = (event) => {
        options.onBoundary?.(event);
      };

      // Speak
      try {
        this.synthesis.speak(utterance);
      } catch (error) {
        console.error('Error speaking:', error);
        this.currentUtterance = null;
        reject(error);
      }
    });
  }

  /**
   * Speak with chunking for better pronunciation quality
   * Splits text into smaller chunks and speaks them with pauses
   */
  private async speakWithChunking(text: string, options: SpeechOptions = {}): Promise<void> {
    const chunks = this.splitTextIntoChunks(text, 80);
    console.log('📦 TTS: Split text into', chunks.length, 'chunks for better pronunciation');
    
    const language = options.language || 'english';
    const voiceCodes = getVoiceCodesForLanguage(language);
    const primaryLangCode = voiceCodes[0] || 'en-US';
    
    // Get voice once for all chunks
    let voice: SpeechSynthesisVoice | undefined;
    if (options.voice) {
      voice = options.voice;
    } else if (options.language) {
      voice = await this.getBestVoiceForLanguage(options.language);
    }
    
    // Trigger onStart for the first chunk
    if (chunks.length > 0 && options.onStart) {
      options.onStart();
    }
    
    // Speak each chunk sequentially with small pauses
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const isLastChunk = i === chunks.length - 1;
      
      await new Promise<void>((resolve, reject) => {
        this.cancel();
        
        const utterance = new SpeechSynthesisUtterance(chunk);
        this.currentUtterance = utterance;
        
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = primaryLangCode;
        }
        
        // Slower rate for better clarity on unsupported languages
        utterance.rate = (options.rate ?? 0.95) * 0.9;
        utterance.pitch = options.pitch ?? 1.0;
        utterance.volume = options.volume ?? 1.0;
        
        utterance.onend = () => {
          this.currentUtterance = null;
          
          // Add small pause between chunks (200ms)
          if (!isLastChunk) {
            setTimeout(() => resolve(), 200);
          } else {
            // Trigger onEnd only for the last chunk
            if (options.onEnd) {
              options.onEnd();
            }
            resolve();
          }
        };
        
        utterance.onerror = (event) => {
          this.currentUtterance = null;
          console.error('Chunk speech error:', event);
          if (options.onError) {
            options.onError(event);
          }
          // Continue to next chunk even on error
          if (!isLastChunk) {
            setTimeout(() => resolve(), 100);
          } else {
            reject(event);
          }
        };
        
        try {
          this.synthesis.speak(utterance);
        } catch (error) {
          console.error('Error speaking chunk:', error);
          this.currentUtterance = null;
          if (!isLastChunk) {
            resolve();
          } else {
            reject(error);
          }
        }
      });
    }
  }

  /**
   * Speak with queue - useful for multiple messages
   */
  async speakWithQueue(text: string, options: SpeechOptions = {}): Promise<void> {
    this.queue.push(text);
    
    if (!this.isProcessingQueue) {
      await this.processQueue(options);
    }
  }

  /**
   * Process the speech queue
   */
  private async processQueue(options: SpeechOptions = {}): Promise<void> {
    this.isProcessingQueue = true;

    while (this.queue.length > 0) {
      const text = this.queue.shift();
      if (text) {
        try {
          await this.speak(text, options);
        } catch (error) {
          console.error('Error speaking queued text:', error);
        }
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Pause current speech
   */
  pause(): void {
    if (this.synthesis.speaking && !this.isPaused) {
      this.synthesis.pause();
    }
  }

  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  /**
   * Cancel current speech
   */
  cancel(): void {
    this.synthesis.cancel();
    this.currentUtterance = null;
    this.isPaused = false;
  }

  /**
   * Clear the queue
   */
  clearQueue(): void {
    this.queue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  /**
   * Check if speech is paused
   */
  isPausedState(): boolean {
    return this.isPaused;
  }

  /**
   * Enable speech synthesis
   */
  enable(): void {
    this.isEnabled = true;
  }

  /**
   * Disable speech synthesis
   */
  disable(): void {
    this.isEnabled = false;
    this.cancel();
    this.clearQueue();
  }

  /**
   * Toggle speech synthesis
   */
  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      this.cancel();
      this.clearQueue();
    }
    return this.isEnabled;
  }

  /**
   * Check if speech is enabled
   */
  isEnabledState(): boolean {
    return this.isEnabled;
  }

  /**
   * Get current utterance
   */
  getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }

  /**
   * Speak AI response with enhanced features
   * Optimized for AI chat responses with emoji support and advanced cleaning
   */
  async speakAIResponse(text: string, options: SpeechOptions = {}): Promise<void> {
    // Get language from options or default to english
    const language = options.language || 'english';
    
    // Text will be cleaned automatically in the speak method
    // Use slightly slower rate for AI responses for better comprehension
    const enhancedOptions: SpeechOptions = {
      rate: 0.9,
      pitch: 1.0,
      volume: 1.0,
      language, // Pass language for proper voice selection
      ...options
    };

    return this.speak(text, enhancedOptions);
  }
}

// Create and export singleton instance
const speechSynthesis = new SpeechSynthesisManager();

export default speechSynthesis;
export { SpeechSynthesisManager };
