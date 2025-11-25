/**
 * React Hook for Speech Synthesis with Premium Tier Support
 * Easy-to-use hook for text-to-speech functionality in React components
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import speechSynthesis from '@/utils/speechSynthesis';
import type { SpeechOptions } from '@/utils/speechSynthesis';
import { getBestVoiceForPersonality, getVoiceSettings, getVoicesByGender, getPremiumVoices } from '@/utils/AI Chat/voicePersonalities';

interface UseSpeechSynthesisReturn {
  speak: (text: string, options?: SpeechOptions) => Promise<void>;
  speakAIResponse: (text: string, personalityId?: string) => Promise<void>;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isEnabled: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setVoice: (voice: SpeechSynthesisVoice) => void;
  enable: () => void;
  disable: () => void;
  toggle: () => boolean;
  getVoicesForPersonality: (personalityId: string) => Promise<SpeechSynthesisVoice | undefined>;
  getFilteredVoices: (gender?: 'male' | 'female' | 'all') => SpeechSynthesisVoice[];
}

export const useSpeechSynthesis = (userTier: 'free' | 'pro' | 'premium' = 'free'): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false); // Default to disabled (muted)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

  // Load voices on mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const availableVoices = await speechSynthesis.getEnglishVoices();
        setVoices(availableVoices);
        
        // Set default voice based on user tier
        if (availableVoices.length > 0 && !selectedVoice) {
          let defaultVoice: SpeechSynthesisVoice | undefined;
          
          if (userTier === 'premium') {
            const premiumVoices = getPremiumVoices(availableVoices);
            defaultVoice = premiumVoices[0];
          }
          
          if (!defaultVoice) {
            defaultVoice = await speechSynthesis.getDefaultVoice();
          }
          
          setSelectedVoice(defaultVoice || availableVoices[0]);
        }
      } catch (error) {
        console.error('Error loading voices:', error);
      }
    };

    loadVoices();
  }, [userTier, selectedVoice]);

  // Monitor speaking state
  useEffect(() => {
    statusCheckInterval.current = setInterval(() => {
      const speaking = speechSynthesis.isSpeaking();
      const paused = speechSynthesis.isPausedState();
      setIsSpeaking(speaking);
      setIsPaused(paused);
    }, 100);

    return () => {
      if (statusCheckInterval.current) {
        clearInterval(statusCheckInterval.current);
      }
    };
  }, []);

  // Speak function
  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    try {
      setIsSpeaking(true);
      setIsPaused(false);
      
      const finalOptions: SpeechOptions = {
        voice: selectedVoice || undefined,
        ...options,
        onStart: () => {
          setIsSpeaking(true);
          options.onStart?.();
        },
        onEnd: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          options.onEnd?.();
        },
        onError: (error) => {
          setIsSpeaking(false);
          setIsPaused(false);
          options.onError?.(error);
        },
        onPause: () => {
          setIsPaused(true);
          options.onPause?.();
        },
        onResume: () => {
          setIsPaused(false);
          options.onResume?.();
        }
      };

      await speechSynthesis.speak(text, finalOptions);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [selectedVoice]);

  // Speak AI response with personality and tier
  const speakAIResponse = useCallback(async (
    text: string, 
    personalityId?: string
  ) => {
    try {
      let voice = selectedVoice;
      let settings = { rate: 0.9, pitch: 1.0, volume: 1.0 };

      // If personality is provided, get the best voice for it based on tier
      if (personalityId) {
        voice = await getBestVoiceForPersonality(personalityId, voices, userTier);
        settings = getVoiceSettings(personalityId);
      }

      await speak(text, {
        voice: voice || undefined,
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume
      });
    } catch (error) {
      console.error('Error speaking AI response:', error);
    }
  }, [speak, voices, selectedVoice, userTier]);

  // Get voice for personality with tier
  const getVoicesForPersonality = useCallback(async (
    personalityId: string
  ) => {
    return getBestVoiceForPersonality(personalityId, voices, userTier);
  }, [voices, userTier]);

  // Get filtered voices by gender and tier
  const getFilteredVoices = useCallback((
    gender: 'male' | 'female' | 'all' = 'all'
  ): SpeechSynthesisVoice[] => {
    const filteredVoices = getVoicesByGender(voices, gender);
    
    // For premium users, prioritize premium voices
    if (userTier === 'premium' || userTier === 'pro') {
      const premiumVoices = getPremiumVoices(filteredVoices);
      if (premiumVoices.length > 0) {
        // Show premium voices first, then others
        const otherVoices = filteredVoices.filter(v => !premiumVoices.includes(v));
        return [...premiumVoices, ...otherVoices];
      }
    }
    
    return filteredVoices;
  }, [voices, userTier]);

  // Cancel speech
  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Pause speech
  const pause = useCallback(() => {
    speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  // Resume speech
  const resume = useCallback(() => {
    speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  // Enable speech
  const enable = useCallback(() => {
    speechSynthesis.enable();
    setIsEnabled(true);
  }, []);

  // Disable speech
  const disable = useCallback(() => {
    speechSynthesis.disable();
    setIsEnabled(false);
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  // Toggle speech
  const toggle = useCallback(() => {
    const newState = speechSynthesis.toggle();
    setIsEnabled(newState);
    if (!newState) {
      setIsSpeaking(false);
      setIsPaused(false);
    }
    return newState;
  }, []);

  // Set voice
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  return {
    speak,
    speakAIResponse,
    cancel,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isEnabled,
    voices,
    selectedVoice,
    setVoice,
    enable,
    disable,
    toggle,
    getVoicesForPersonality,
    getFilteredVoices
  };
};

export default useSpeechSynthesis;
