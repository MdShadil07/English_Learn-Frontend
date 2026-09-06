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
  speakAIResponse: (text: string, personalityId?: string, language?: string, overrideSettings?: { rate?: number; pitch?: number; volume?: number }) => Promise<void>;
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

export const useSpeechSynthesis = (
  userTier: 'free' | 'pro' | 'premium' = 'free',
  globalRate?: number,
  globalPitch?: number,
  globalVolume?: number
): UseSpeechSynthesisReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false); // Default to disabled (muted)
  const statusCheckInterval = useRef<NodeJS.Timeout | null>(null);

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
  }, []);

  // Speak AI response with personality, tier, and language support
  const speakAIResponse = useCallback(async (
    text: string, 
    personalityId?: string,
    language?: string,
    overrideSettings?: { rate?: number; pitch?: number; volume?: number }
  ) => {
    try {
      let settings = { rate: 0.9, pitch: 1.0, volume: 1.0 };
      let personalityVoice: SpeechSynthesisVoice | undefined;

      // If personality is provided, get the voice settings for it
      if (personalityId) {
        settings = getVoiceSettings(personalityId);
        const voices = await speechSynthesis.getVoices();
        personalityVoice = getBestVoiceForPersonality(personalityId, voices, userTier);
      }

      // Apply global settings (from sliders in settings)
      if (globalRate !== undefined) settings.rate = globalRate;
      if (globalPitch !== undefined) settings.pitch = globalPitch;
      if (globalVolume !== undefined) settings.volume = globalVolume;

      // Apply override settings (if provided explicitly in call)
      if (overrideSettings?.rate !== undefined) settings.rate = overrideSettings.rate;
      if (overrideSettings?.pitch !== undefined) settings.pitch = overrideSettings.pitch;
      if (overrideSettings?.volume !== undefined) settings.volume = overrideSettings.volume;

      await speak(text, {
        voice: personalityVoice,
        rate: settings.rate,
        pitch: settings.pitch,
        volume: settings.volume,
        language: language || 'english' // Pass language for advanced cleaning and voice selection
      });
    } catch (error) {
      console.error('Error speaking AI response:', error);
    }
  }, [speak, globalRate, globalPitch, globalVolume, userTier]);

  // Get voice for personality with tier
  const getVoicesForPersonality = useCallback(async (
    personalityId: string
  ) => {
    const voices = await speechSynthesis.getVoices();
    return getBestVoiceForPersonality(personalityId, voices, userTier);
  }, [userTier]);

  // Get filtered voices by gender and tier
  const getFilteredVoices = useCallback(async (
    gender: 'male' | 'female' | 'all' = 'all'
  ): Promise<SpeechSynthesisVoice[]> => {
    const voices = await speechSynthesis.getVoices();
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
  }, [userTier]);

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
    enable,
    disable,
    toggle,
    getVoicesForPersonality,
    getFilteredVoices
  };
};

export default useSpeechSynthesis;
