/**
 * Speech Synthesis Utility — v2 (Multi-Language)
 * ──────────────────────────────────────────────────────────────────────────────
 * Robust multi-language TTS with:
 *   • Smart voice selection per language (exact → partial → any → English)
 *   • Language-aware text cleaning (non-Latin scripts preserved)
 *   • Reliable voice loading with voiceschanged retry + timeout
 *   • Long-text chunking without mid-chunk cancellation
 *   • Auto-detect language from unicode ranges when no explicit lang given
 *   • Chrome bug workarounds (silent 14-second limit, stall recovery)
 */

import {
  cleanTextForSpeech,
  getVoiceCodesForLanguage,
  validateTextForSpeech,
} from './AI Chat/advancedTextCleaner';

import { showVoiceInstallationHelpInConsole } from './AI Chat/voiceInstallationGuide';

// ─────────────────────────────────────────────────────────────────────────────
// Public interface
// ─────────────────────────────────────────────────────────────────────────────
export interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  rate?: number;    // 0.1 – 10  (default 1)
  pitch?: number;   // 0 – 2     (default 1)
  volume?: number;  // 0 – 1     (default 1)
  lang?: string;    // BCP-47 e.g. 'en-US', 'hi-IN'
  language?: string; // Human name e.g. 'english', 'hindi'
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Language helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect likely BCP-47 primary subtag from Unicode script ranges.
 * Used as a last-resort fallback when no explicit language is given.
 */
function detectLanguageFromText(text: string): string | null {
  const sample = text.slice(0, 200);
  if (/[\u0900-\u097F]/.test(sample)) return 'hi'; // Devanagari → Hindi
  if (/[\u0600-\u06FF]/.test(sample)) return 'ar'; // Arabic
  if (/[\u0980-\u09FF]/.test(sample)) return 'bn'; // Bengali
  if (/[\u0A00-\u0A7F]/.test(sample)) return 'pa'; // Gurmukhi → Punjabi
  if (/[\u0B80-\u0BFF]/.test(sample)) return 'ta'; // Tamil
  if (/[\u0C00-\u0C7F]/.test(sample)) return 'te'; // Telugu
  if (/[\u0D00-\u0D7F]/.test(sample)) return 'ml'; // Malayalam
  if (/[\u0900-\u097F]/.test(sample)) return 'mr'; // Marathi (also Devanagari)
  if (/[\u4E00-\u9FFF]/.test(sample)) return 'zh'; // CJK → Chinese
  if (/[\u3040-\u30FF]/.test(sample)) return 'ja'; // Hiragana/Katakana → Japanese
  if (/[\uAC00-\uD7AF]/.test(sample)) return 'ko'; // Hangul → Korean
  if (/[\u0400-\u04FF]/.test(sample)) return 'ru'; // Cyrillic → Russian
  if (/[\u0590-\u05FF]/.test(sample)) return 'he'; // Hebrew
  if (/[\u0E00-\u0E7F]/.test(sample)) return 'th'; // Thai
  return null;
}

/**
 * Returns true if text contains primarily non-Latin characters that should
 * NOT be passed through Latin-only cleaning routines.
 */
function isNonLatinScript(language: string): boolean {
  const nonLatin = ['hindi', 'urdu', 'arabic', 'bengali', 'japanese', 'chinese',
    'korean', 'thai', 'vietnamese', 'russian', 'hebrew', 'persian', 'punjabi',
    'gujarati', 'tamil', 'telugu', 'kannada', 'malayalam', 'marathi',
    'odia', 'assamese', 'sindhi', 'konkani', 'maithili', 'santali', 'kashmiri',
    'dogri', 'bodo', 'bhojpuri'];
  return nonLatin.includes(language.toLowerCase());
}

// ─────────────────────────────────────────────────────────────────────────────
// Chunk splitter — language-aware, no mid-word cuts
// ─────────────────────────────────────────────────────────────────────────────
function splitIntoChunks(text: string, maxLen = 180): string[] {
  if (text.length <= maxLen) return [text];

  const chunks: string[] = [];
  // Split by sentence boundaries first (supports CJK ，。！？ and Arabic ؟،)
  const sentences = text.match(/[^.!?。！？؟،\n]+[.!?。！？؟،\n]*/g) || [text];

  let current = '';
  for (const sentence of sentences) {
    if ((current + sentence).length <= maxLen) {
      current += sentence;
    } else {
      if (current.trim()) chunks.push(current.trim());
      
      // Sentence itself is too long — split by commas/pauses
      if (sentence.length > maxLen) {
        const parts = sentence.split(/[,،、]+/);
        current = '';
        for (let part of parts) {
          // If a part is STILL too long (no commas), force split by spaces
          if (part.length > maxLen) {
            const words = part.split(' ');
            let temp = '';
            for (const word of words) {
              if ((temp + word).length <= maxLen) {
                temp += word + ' ';
              } else {
                if (temp.trim()) chunks.push(temp.trim());
                temp = word + ' ';
              }
            }
            part = temp;
          }

          if ((current + part).length <= maxLen) {
            current += part + ', ';
          } else {
            if (current.trim()) chunks.push(current.trim());
            current = part + ', ';
          }
        }
      } else {
        current = sentence;
      }
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(c => c.length > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
export interface TextChunk {
  text: string;
  langCode: string;
}

/**
 * Script Splitter — robustly divides mixed text by detected Unicode scripts.
 * Maps characters directly to their target BCP-47 language locale.
 */
function splitMixedLanguageText(text: string, primaryLangCode: string = 'en-US'): TextChunk[] {
  const result: TextChunk[] = [];
  let currentChunk = '';
  let currentLang = primaryLangCode;

  // Ordered ranges of non-Latin scripts to evaluate
  const scriptRanges = [
    { regex: /[\u0900-\u097F]/, lang: 'hi-IN' }, // Devanagari (Hindi, Marathi)
    { regex: /[\u0980-\u09FF]/, lang: 'bn-IN' }, // Bengali
    { regex: /[\u0A00-\u0A7F]/, lang: 'pa-IN' }, // Gurmukhi (Punjabi)
    { regex: /[\u0A80-\u0AFF]/, lang: 'gu-IN' }, // Gujarati
    { regex: /[\u0B00-\u0B7F]/, lang: 'or-IN' }, // Odia
    { regex: /[\u0B80-\u0BFF]/, lang: 'ta-IN' }, // Tamil
    { regex: /[\u0C00-\u0C7F]/, lang: 'te-IN' }, // Telugu
    { regex: /[\u0C80-\u0CFF]/, lang: 'kn-IN' }, // Kannada
    { regex: /[\u0D00-\u0D7F]/, lang: 'ml-IN' }, // Malayalam
    { regex: /[\u0600-\u06FF]/, lang: 'ar-SA' }, // Arabic / Urdu
    { regex: /[\u3040-\u30FF\u4E00-\u9FFF]/, lang: 'ja-JP' }, // Japanese / CJK
    { regex: /[\uAC00-\uD7AF]/, lang: 'ko-KR' }, // Korean
  ];

  const getCharLang = (char: string): string | null => {
    // English/Latin fallback
    if (/[a-zA-Z]/.test(char)) return primaryLangCode.startsWith('en') ? primaryLangCode : 'en-US';
    
    // Check specific Unicode blocks
    for (const range of scriptRanges) {
      if (range.regex.test(char)) return range.lang;
    }
    
    // Return null for punctuation/spaces (they attach to the active chunk)
    return null;
  };

  for (const char of text) {
    const charLang = getCharLang(char);
    
    if (charLang) {
      if (charLang !== currentLang && currentChunk.trim().length > 0) {
        result.push({ text: currentChunk, langCode: currentLang });
        currentChunk = '';
      }
      currentLang = charLang;
      currentChunk += char;
    } else {
      // Punctuation/spaces — append to current active chunk
      currentChunk += char;
    }
  }

  if (currentChunk.trim().length > 0) {
    result.push({ text: currentChunk, langCode: currentLang });
  }

  return result.filter(c => c.text.trim().length > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// SpeechSynthesisManager
// ─────────────────────────────────────────────────────────────────────────────

interface QueueItem {
  text: string;
  langCode: string;
  voice: SpeechSynthesisVoice | undefined;
  options: any;
  isCloudTTS: boolean;
  isFirst: boolean;
  isLast: boolean;
}

class SpeechQueueManager {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isEnabled = true;
  private isPaused = false;
  private currentCloudAudio: HTMLAudioElement | null = null;
  private sharedCloudAudio: HTMLAudioElement | null = null;
  private cloudAudioCache = new Map<string, HTMLAudioElement>();
  private queue: QueueItem[] = [];
  private currentItem: QueueItem | null = null;
  private isProcessingQueue = false;
  private voiceCache = new Map<string, SpeechSynthesisVoice | null>();
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;
  private stallCheckInterval: ReturnType<typeof setInterval> | null = null;
  private stallCheckUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window === 'undefined') return;
    this.synthesis = window.speechSynthesis;

    this._preloadVoices();

    this.synthesis.onvoiceschanged = () => {
      this._preloadVoices();
    };

    // Create and unlock shared audio element to bypass autoplay policies
    this.sharedCloudAudio = new Audio();
    const unlockAudio = () => {
      if (this.sharedCloudAudio) {
        // A tiny silent MP3 base64 to legitimately unlock the audio context
        this.sharedCloudAudio.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//NkxgAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
        this.sharedCloudAudio.play().then(() => {
          this.sharedCloudAudio?.pause();
        }).catch(() => {});
        
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
      }
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.pause();
    });
  }

  private _preloadVoices(): void {
    const v = this.synthesis.getVoices();
    if (v.length > 0) {
      this.cachedVoices = v;
      this.voicesLoaded = true;
      this.voiceCache.clear();
    }
  }

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  async getVoices(): Promise<SpeechSynthesisVoice[]> {
    if (this.voicesLoaded && this.cachedVoices.length > 0) {
      return this.cachedVoices;
    }
    
    return new Promise(resolve => {
      let attempts = 0;
      const checkInterval = setInterval(() => {
        const v = this.synthesis.getVoices();
        if (v.length > 0) {
          clearInterval(checkInterval);
          this.cachedVoices = v;
          this.voicesLoaded = true;
          resolve(v);
        } else if (attempts > 20) {
          clearInterval(checkInterval);
          resolve([]);
        }
        attempts++;
      }, 50);
    });
  }

  async getVoicesForLanguage(language: string): Promise<SpeechSynthesisVoice[]> {
    const voices = await this.getVoices();
    const codes = getVoiceCodesForLanguage(language);
    
    return voices.filter(voice => {
      const voiceLang = voice.lang.toLowerCase();
      return codes.some(code => 
        voiceLang === code.toLowerCase() || 
        voiceLang.startsWith(code.split('-')[0].toLowerCase())
      );
    });
  }

  async getBestVoiceForLanguage(language: string): Promise<SpeechSynthesisVoice | undefined> {
    const cacheKey = language.toLowerCase();
    if (this.voiceCache.has(cacheKey)) {
      const cached = this.voiceCache.get(cacheKey);
      return cached === null ? undefined : cached;
    }

    const voices = await this.getVoices();
    const codes = getVoiceCodesForLanguage(language);
    if (!codes.length) return undefined;

    const primaryPrefixes = codes.map(c => c.split('-')[0].toLowerCase());

    for (const code of codes) {
      const exact = voices.find(v => v.lang.toLowerCase() === code.toLowerCase());
      if (exact) {
        this.voiceCache.set(cacheKey, exact);
        return exact;
      }
    }

    for (const prefix of primaryPrefixes) {
      const partial = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
      if (partial) {
        this.voiceCache.set(cacheKey, partial);
        return partial;
      }
    }

    for (const prefix of primaryPrefixes) {
      const local = voices.find(v => v.lang.toLowerCase().startsWith(prefix) && v.localService);
      if (local) {
        this.voiceCache.set(cacheKey, local);
        return local;
      }
    }

    this.voiceCache.set(cacheKey, null);
    return undefined;
  }

  async getVoiceByLang(lang = 'en-US'): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await this.getVoices();
    return (
      voices.find(v => v.lang === lang) ??
      voices.find(v => v.lang.startsWith(lang.split('-')[0]))
    );
  }

  async getDefaultVoice(lang = 'en-US'): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await this.getVoices();
    return (
      voices.find(v => v.default && v.lang.startsWith(lang.split('-')[0])) ??
      voices.find(v => v.lang === lang) ??
      voices.find(v => v.lang.startsWith(lang.split('-')[0]))
    );
  }

  async hasNativeVoiceSupport(language: string): Promise<boolean> {
    const matches = await this.getVoicesForLanguage(language);
    return matches.length > 0;
  }

  async speak(text: string, options: any = {}): Promise<void> {
    if (!this.isSupported()) return Promise.reject(new Error('Speech synthesis not supported'));
    if (!this.isEnabled) return;

    const language = options.language || 'english';
    const validation = validateTextForSpeech(text);
    if (!validation.valid) return Promise.reject(new Error(validation.error || ''));

    const cleanedText = cleanTextForSpeech(text, language);
    if (!cleanedText) return;

    const codes = getVoiceCodesForLanguage(language);
    const primaryCode = codes[0] || 'en-US';

    // Reset Queue completely
    this.stop(); 
    this.queue = [];

    const scriptChunks = splitMixedLanguageText(cleanedText, primaryCode);
    const voices = await this.getVoices();
    
    // Attempt to use the Backend TTS Proxy for mixed language combined audio (Step 8)
    const hasNonEnglish = scriptChunks.some(c => !c.langCode.startsWith('en'));
    
    if (hasNonEnglish) {
      try {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
        const response = await fetch('/api/tts/speak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ text: cleanedText, lang: primaryCode })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.audioBase64) {
            console.log('🗣️ TTS API SUCCESS: Generated combined audio stream from backend.');
            await this._playBase64Audio(data.audioBase64, options);
            return;
          }
        } else {
          console.warn('⚠️ TTS API Error:', await response.text());
        }
      } catch (err) {
        console.error('⚠️ TTS API Fetch failed:', err);
      }
    }

    // Fallback: Use browser native TTS if backend fails or text is English only
    console.log('🗣️ TTS FALLBACK: Using native Browser Speech Synthesis.');
    for (let i = 0; i < scriptChunks.length; i++) {
      const chunk = scriptChunks[i];
      const isFirstChunk = i === 0;
      const isLastChunk = i === scriptChunks.length - 1;

      let chunkLangCode = chunk.langCode;
      let exactVoice = voices.find(v => v.lang.toLowerCase() === chunkLangCode.toLowerCase()) || 
                       voices.find(v => v.lang.toLowerCase().startsWith(chunkLangCode.split('-')[0].toLowerCase()));
      
      let isCloudTTS = false;
      let chunkVoice = exactVoice;

      if (!exactVoice && !chunkLangCode.startsWith('en')) {
        isCloudTTS = true;
      } else if (!exactVoice) {
        chunkVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      }

      if (options.voice && chunkLangCode.startsWith('en') && options.voice.lang.toLowerCase().startsWith('en')) {
        chunkVoice = options.voice;
      }

      const subChunks = splitIntoChunks(chunk.text, 120);
      
      for (let j = 0; j < subChunks.length; j++) {
        this.queue.push({
          text: subChunks[j],
          langCode: chunkVoice ? chunkVoice.lang : chunkLangCode,
          voice: chunkVoice,
          options,
          isCloudTTS,
          isFirst: isFirstChunk && j === 0,
          isLast: isLastChunk && j === subChunks.length - 1
        });
      }
    }

    this.playNext();
  }

  private _playBase64Audio(base64Data: string, options: any): Promise<void> {
    return new Promise((resolve) => {
      const audio = this.sharedCloudAudio || new Audio();
      audio.src = `data:audio/mpeg;base64,${base64Data}`;
      audio.load();
      
      if (options.volume) audio.volume = options.volume;
      if (options.rate) audio.playbackRate = options.rate;

      this.currentCloudAudio = audio;

      audio.onplay = () => {
        this.isPaused = false;
        options.onStart?.();
      };

      audio.onended = () => {
        this.currentCloudAudio = null;
        options.onEnd?.();
        resolve();
      };

      audio.onerror = (e) => {
        console.error('🚨 TTS Base64 Audio Playback Failed', e);
        this.currentCloudAudio = null;
        resolve();
      };

      audio.play().catch(e => {
        console.error('🚨 TTS Base64 Audio Play Rejected (Autoplay):', e);
        this.currentCloudAudio = null;
        resolve();
      });
    });
  }

  private async playNext() {
    if (this.isProcessingQueue || this.queue.length === 0 || !this.isEnabled) {
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const item = this.queue.shift();
    if (!item) {
      this.isProcessingQueue = false;
      this.currentItem = null;
      return;
    }
    
    this.currentItem = item;

    try {
      if (item.isCloudTTS) {
        await this._playCloudTTSFallback(item.text, item.langCode, item.options, item.isFirst, item.isLast);
      } else {
        await this._utterAndWait(item.text, item.voice, item.langCode, item.options, item.isFirst, item.isLast);
      }
    } catch (err) {
      console.warn('Queue item playback failed:', err);
    } finally {
      this.isProcessingQueue = false;
      if (this.queue.length > 0 && !this.isPaused) {
        this.playNext();
      }
    }
  }

  private _utterAndWait(
    text: string,
    voice: SpeechSynthesisVoice | undefined,
    langCode: string,
    options: any,
    fireOnStart: boolean,
    fireOnEnd: boolean
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
      }
      
      if (options.rate) utterance.rate = options.rate;
      if (options.pitch) utterance.pitch = options.pitch;
      if (options.volume) utterance.volume = options.volume;

      const cleanup = () => {
        if (this.stallCheckInterval) clearInterval(this.stallCheckInterval);
        this.stallCheckInterval = null;
        this.stallCheckUtterance = null;
        this.currentUtterance = null;
      };

      utterance.onstart = () => {
        this.isPaused = false;
        if (fireOnStart) options.onStart?.();

        let lastPos = 0;
        let stallCount = 0;
        this.stallCheckUtterance = utterance;
        this.stallCheckInterval = setInterval(() => {
          if (!this.isPaused && this.synthesis.speaking) {
            if (this.stallCheckUtterance !== utterance) {
              cleanup();
              return;
            }
            if (lastPos === stallCount) {
              stallCount++;
              if (stallCount > 140) {
                console.warn('TTS stalled — recovering...');
                this.synthesis.pause();
                this.synthesis.resume();
                stallCount = 0;
              }
            } else {
              lastPos = stallCount;
              stallCount = 0;
            }
          }
        }, 100);
      };

      utterance.onend = () => {
        cleanup();
        if (fireOnEnd) options.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        cleanup();
        if (event.error === 'interrupted' || event.error === 'canceled') {
          resolve();
          return;
        }
        console.warn(`⚠️ TTS native failed (${event.error}). Auto-recovering via Cloud Fallback...`);
        
        // Auto-recover using Cloud TTS if native engine crashes
        this._playCloudTTSFallback(text, langCode, options, fireOnStart, fireOnEnd)
          .then(resolve)
          .catch(() => {
             options.onError?.(event);
             resolve();
          });
      };

      utterance.onpause  = () => { this.isPaused = true;  options.onPause?.();  };
      utterance.onresume = () => { this.isPaused = false; options.onResume?.(); };
      utterance.onboundary = (e) => options.onBoundary?.(e);

      try {
        this.synthesis.speak(utterance);
      } catch (err) {
        cleanup();
        reject(err);
      }
    });
  }

  private async _playCloudTTSFallback(text: string, langCode: string, options: any, fireOnStart: boolean, fireOnEnd: boolean): Promise<void> {
    try {
      console.log('🗣️ Executing Cloud TTS Fallback for text chunk...');
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token') || '';
      const response = await fetch('/api/tts/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text, lang: langCode })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioBase64) {
          const cloudOptions = { ...options };
          if (!fireOnStart) delete cloudOptions.onStart;
          if (!fireOnEnd) delete cloudOptions.onEnd;
          await this._playBase64Audio(data.audioBase64, cloudOptions);
          return;
        }
      }
    } catch (e) {
      console.error('Cloud TTS Fallback completely failed:', e);
    }
    throw new Error('Cloud TTS Fallback failed');
  }

  async speakAIResponse(text: string, options: any = {}): Promise<void> {
    const language = options.language || 'english';

    const hasNative = await this.hasNativeVoiceSupport(language);
    if (!hasNative && language !== 'english') {
      const sessionKey = `tts_guide_shown_${language}`;
      if (!sessionStorage.getItem(sessionKey)) {
        showVoiceInstallationHelpInConsole(language);
        sessionStorage.setItem(sessionKey, 'true');
      }
    }

    return this.speak(text, {
      rate:   0.9,
      pitch:  1.0,
      volume: 1.0,
      ...options,
    });
  }

  setRealtimeSettings(rate: number, pitch: number, volume: number): void {
    if (this.currentCloudAudio) {
      this.currentCloudAudio.volume = volume;
      this.currentCloudAudio.playbackRate = rate;
    }

    // Update upcoming chunks
    this.queue.forEach(item => {
      item.options.rate = rate;
      item.options.pitch = pitch;
      item.options.volume = volume;
    });

    // If native TTS is playing, we must cancel and restart the current chunk to apply the settings instantly
    if (this.synthesis.speaking && this.currentItem && !this.currentItem.isCloudTTS) {
      this.currentItem.options.rate = rate;
      this.currentItem.options.pitch = pitch;
      this.currentItem.options.volume = volume;
      
      this.isProcessingQueue = false;
      this.queue.unshift(this.currentItem); // Put it back at the front
      
      // We must cancel without clearing the entire queue (unlike stop())
      this.synthesis.cancel();
      
      // `cancel` triggers `onend` or `onerror` which might naturally try to call `playNext`.
      // But we just re-queued it, so it will play the current item again!
      setTimeout(() => {
        if (!this.isProcessingQueue && this.queue.length > 0 && !this.isPaused) {
          this.playNext();
        }
      }, 50);
    }
  }

  pause(): void {
    if (this.currentCloudAudio) {
      this.currentCloudAudio.pause();
    }
    this.synthesis.pause();
    this.isPaused = true;
  }

  resume(): void {
    if (this.currentCloudAudio) {
      this.currentCloudAudio.play().catch(() => {});
    }
    this.synthesis.resume();
    this.isPaused = false;
    
    if (this.queue.length > 0 && !this.isProcessingQueue) {
      this.playNext();
    }
  }

  stop(): void {
    this.queue = [];
    this.currentItem = null;
    this.isProcessingQueue = false;
    this.synthesis.cancel();
    if (this.currentCloudAudio) {
      this.currentCloudAudio.pause();
      this.currentCloudAudio = null;
    }
    this.cloudAudioCache.forEach(audio => { audio.src = ''; });
    this.cloudAudioCache.clear();
    
    this.currentUtterance = null;
    this.isPaused = false;
  }

  cancel(): void {
    this.stop();
  }

  isSpeaking(): boolean      { return this.synthesis.speaking || this.isProcessingQueue; }
  isPausedState(): boolean   { return this.isPaused; }
  isEnabledState(): boolean  { return this.isEnabled; }
  getCurrentUtterance()      { return this.currentUtterance; }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
    this.stop();
  }

  toggle(): boolean {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) { this.stop(); }
    return this.isEnabled;
  }

  clearVoiceCache(): void {
    this.voiceCache.clear();
  }
}

const speechSynthesis = new SpeechQueueManager();
export default speechSynthesis;
export { SpeechQueueManager as SpeechSynthesisManager };
