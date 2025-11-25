// All imports must be at the top
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
// Update the import path below to match the actual location and filename of AIChatSidebar
import type { AccuracyResult } from '../../components/AI Chat/AIChatSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Activity,
  CheckCircle,
  Settings,
  ChevronDown,
  MessageSquare,
  ChevronUp,
  VolumeX,
  Volume2,
  PanelLeftClose,
  PanelLeftOpen,
  Languages,
  Sparkles
} from 'lucide-react';
import { useAuth, User } from '../../contexts/AuthContext';
// Update the import path below to the correct relative path if needed
import { useToast } from '../../hooks/use-toast';
// Update the import path below to the correct relative path if needed
import speechSynthesis from '../../utils/speechSynthesis';
import { AudioRecorder, encodeAudioForAPI } from '../../utils/RealtimeAudio';
import type { StreakData, StreakUpdateResult } from '../../services/AI Chat/streakService';
import type { GeminiMessage } from '../../services/AI Chat/geminiService';
import type { RealtimeProgressData, ProgressUpdate, ProgressListener } from '../../services/AI Chat/optimizedProgressService';
import AIChatSidebar from '../../components/AI Chat/AIChatSidebar';

import AIChatSettingsSidebar from '../../components/AI Chat/AIChatSettingsSidebar';
import ChatInputArea from '../../components/AI Chat/ChatInputArea';
import VoiceRecordingBubble from '../../components/AI Chat/VoiceRecordingBubble';
import ChatMessageItem from '../../components/AI Chat/ChatMessageItem';
import LevelUpNotification from '../../components/AI Chat/LevelUpNotification';
import { Button } from '../../components/ui/button';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Card, CardContent } from '../../components/ui/card';
import { getPersonalityIcon } from '../../components/Icons/AIPersonalityIcons';
import { AI_PERSONALITIES } from '../../components/AI Chat/constants';
import { cn } from '../../lib/utils';
import {
  AIPersonality,
  Conversation,
  Message,
  ChatStats,
  UserSettings
} from '../../components/AI Chat/types';
import { getBestVoiceForPersonality, getVoiceSettings } from '../../utils/AI Chat/voicePersonalities';
import { getPersonalityWelcomeMessage } from '../../utils/AI Chat/PersonalityWelcome';
import { api } from '../../utils/api';

// Add fallback type for SpeechRecognition if not present (for TypeScript compatibility)
declare global {
  // Only declare if not already present
  interface SpeechRecognition {
    start(): void;
    stop(): void;
    abort?(): void;
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
  }
  interface Window {
    SpeechRecognition?: { new (): SpeechRecognition };
    webkitSpeechRecognition?: { new (): SpeechRecognition };
  }
}



const AIChatPage: React.FC = () => {
  // State for latest accuracy snapshot (per message) - must be declared before any usage
  const [latestAccuracy, setLatestAccuracy] = useState<{
    accuracy: AccuracyResult;
    xpGained?: number;
    timestamp: Date;
    fromCache?: boolean;
  } | null>(null);

  // Auth context (must be declared before any use of 'user')
  const { user } = useAuth();
  // Toast context (must be declared before any use of 'toast')
  const { toast } = useToast();
  // User tier (must be declared before any use of 'userTier')
  const userTier: 'free' | 'pro' | 'premium' = user?.tier || 'free';
  // --- Robust polling state for backend progress/accuracy ---
  const [polling, setPolling] = useState(false);
  const [latestMessageCount, setLatestMessageCount] = useState<number>(0);
  const [latestAccuracyTimestamp, setLatestAccuracyTimestamp] = useState<string | null>(null);
  const [isSidebarLoading, setIsSidebarLoading] = useState(false);

  // Optimized, industry-level polling for backend-processed stats/accuracy after message send
  useEffect(() => {
    if (!polling) return;
    let attempts = 0;
    const maxAttempts = 60; // increased to allow backend more processing time (~72 seconds at 1200ms)
    let gracePolls = 0;
    const maxGracePolls = 5; // Number of extra polls after detecting new data
    let detectedNewData = false;
    const poll = async () => {
      try {
        // Force refresh after message send (when polling is true)
        const forceRefresh = polling;
        // Lazy-load heavy services to avoid initializing them on mount
        const [{ default: OptimizedProgressServiceLazy }, accuracyModule] = await Promise.all([
          import('../../services/AI Chat/optimizedProgressService'),
          import('../../services/AI Chat/accuracyService')
        ]);
        const progress = await OptimizedProgressServiceLazy.getRealtimeProgress(forceRefresh);
        const accuracy = await accuracyModule.fetchLatestAccuracy(forceRefresh);

        setChatStats({
          currentAccuracy: progress.accuracy?.overall ?? 0,
          totalMessages: progress.stats?.totalMessages ?? 0,
          totalXP: progress.xp?.total ?? 0,
          currentLevel: progress.xp?.currentLevel ?? 1,
          currentLevelXP: progress.xp?.currentLevelXP ?? 0,
          xpToNextLevel: progress.xp?.xpToNextLevel ?? 0,
          xpRequiredForLevel: progress.xp?.xpRequiredForLevel ?? 100,
          xpProgressPercentage: progress.xp?.progressPercentage ?? 0,
          weeklyProgress: 0,
          streak: progress.streak?.current ?? 0,
          totalLearningTime: (progress.stats?.totalMinutes ?? 0) * 60
        });
        setLatestAccuracy({
          accuracy: {
            overall: accuracy.overall,
            adjustedOverall: accuracy.adjustedOverall,
            grammar: accuracy.grammar ?? 0,
            vocabulary: accuracy.vocabulary ?? 0,
            spelling: accuracy.spelling ?? 0,
            fluency: accuracy.fluency ?? 0,
            punctuation: accuracy.punctuation ?? 0,
            capitalization: accuracy.capitalization ?? 0,
          },
          timestamp: new Date(accuracy.lastUpdated || Date.now()),
          fromCache: accuracy.source !== 'database'
        });

        // Debug: log incoming progress and accuracy payloads to help trace staleness
        // These logs are temporary for runtime verification and can be removed later.
        console.debug('[POLL DEBUG] progress:', progress, 'accuracy:', accuracy, 'latestMessageCount:', latestMessageCount, 'latestAccuracyTimestamp:', latestAccuracyTimestamp);

        // Check if new message or new accuracy
        const newMsg = progress?.stats?.totalMessages > latestMessageCount;
        const newAcc = accuracy?.lastUpdated && (!latestAccuracyTimestamp || new Date(accuracy.lastUpdated) > new Date(latestAccuracyTimestamp));
        if (newMsg || newAcc) {
          detectedNewData = true;
          // Update latestMessageCount and latestAccuracyTimestamp to new values
          setLatestMessageCount(progress?.stats?.totalMessages ?? 0);
          setLatestAccuracyTimestamp(accuracy?.lastUpdated || null);
        }
        if (detectedNewData) {
          gracePolls++;
          if (gracePolls >= maxGracePolls) {
            setIsSidebarLoading(false);
            setPolling(false);
          }
        }
      } catch (err) {
        // Ignore errors, just try again
      }
      attempts++;
      if (attempts >= maxAttempts) {
        setIsSidebarLoading(false);
        setPolling(false);
      }
    };
    // Debug: indicate polling started
    console.debug('[POLL DEBUG] starting polling, maxAttempts:', maxAttempts, 'maxGracePolls:', maxGracePolls);

    const interval = setInterval(() => {
      // Skip polls while tab is in background to reduce unnecessary work
      if (typeof document !== 'undefined' && document.hidden) return;
      poll();
    }, 2000);
    return () => clearInterval(interval);
  }, [polling, latestMessageCount, latestAccuracyTimestamp]);
  // end of polling effect




  const [settings, setSettings] = useState<UserSettings>({
    voiceEnabled: true,
    language: 'english',
    personality: AI_PERSONALITIES[0].id,
    showAccuracy: true,
    autoTranslate: false,
    theme: 'auto'
  });

  // Speech settings state (must be declared before useSpeechSynthesis)
  const [speechRate, setSpeechRate] = useState(0.9);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);

  // Speech Synthesis State and Controls
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Load voices on mount
  useEffect(() => {
    speechSynthesis.getVoices().then(setVoices);
  }, []);

  // Update selected voice when language or voices change
  useEffect(() => {
    if (settings.language && voices.length > 0) {
      speechSynthesis.getBestVoiceForLanguage(settings.language).then(setSelectedVoice);
    }
  }, [settings.language, voices]);

  const speakAIResponse = useCallback(async (text: string, _personalityId: string, language: string) => {
    setIsSpeaking(true);
    try {
      await speechSynthesis.speakAIResponse(text, {
        voice: selectedVoice || undefined,
        rate: speechRate,
        pitch: speechPitch,
        volume: speechVolume,
        language,
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  }, [selectedVoice, speechRate, speechPitch, speechVolume]);

  const cancelSpeech = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled((prev) => {
      const next = !prev;
      if (!next) {
        cancelSpeech();
      }
      return next;
    });
  }, [cancelSpeech]);

  // � Initial Progress Data State (fetched once on mount)
  const [initialProgressData, setInitialProgressData] = useState<RealtimeProgressData | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  // State management
  const [selectedPersonality, setSelectedPersonality] = useState<AIPersonality>(AI_PERSONALITIES[0]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [chatStats, setChatStats] = useState<ChatStats>({
    currentAccuracy: 0,
    totalMessages: 0,
    totalXP: 0,
    currentLevel: 1,
    currentLevelXP: 0,
    xpToNextLevel: 100,
    xpRequiredForLevel: 100,
    xpProgressPercentage: 0,
    weeklyProgress: 0,
    streak: 0,
    totalLearningTime: 0 // in seconds
  });
  const [sessionStartTime] = useState<number>(Date.now());
  const [activeMinutes, setActiveMinutes] = useState<number>(0);
  const [streakData, setStreakData] = useState<StreakData | null>(null);

  // Lazy-load streak data to avoid initializing the streak engine on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const StreakModule = await import('../../services/AI Chat/streakService');
        const initial = StreakModule.default.loadStreakData();
        if (mounted) setStreakData(initial);
      } catch (err) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);
  // Removed: const [realtimeAccuracy, setRealtimeAccuracy] = useState<EnhancedAccuracyResult | null>(null);

  // UI state
  const [showSettings, setShowSettings] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<'stats' | 'accuracy'>('stats');
  // Removed: latestAccuracy state, now handled by backend real-time progress only
  
  // Real-time progress state
  const [isPollingProgress, setIsPollingProgress] = useState(false);
  const [showLevelUpNotification, setShowLevelUpNotification] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ newLevel: number; oldLevel: number; xpGained: number } | null>(null);
  
  // State for streaming control
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Use a robust type for SpeechRecognition (cross-browser, no 'any')
  const recognitionRef = useRef<
    (typeof window.SpeechRecognition extends { new (): infer R } ? R : never) |
    (typeof window.webkitSpeechRecognition extends { new (): infer W } ? W : never) |
    null
  >(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // AudioRecorder for raw audio capture (fallback / parallel capture)
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  // Collected audio chunks (Float32Array) while recording
  const audioChunksRef = useRef<Float32Array[]>([]);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [isRawRecording, setIsRawRecording] = useState(false);
  const [autoSendPending, setAutoSendPending] = useState(false);

  // Check if user is at bottom of scroll area
  const checkIfAtBottom = useCallback(() => {
    const scrollElement = scrollAreaRef.current;
    if (scrollElement) {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      setIsAtBottom(atBottom);
      setShowScrollButton(!atBottom);
    }
  }, []);

  // Scroll to bottom when new messages arrive (only if user is already at bottom)
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    checkIfAtBottom();
  }, [checkIfAtBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-scroll to bottom only if user was already at bottom before new message
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // (moved below startNewConversation to avoid TDZ lint error)

  // Available personalities based on subscription
  const availablePersonalities = useMemo(() => {
    if (!user) return [AI_PERSONALITIES[0]];

    // Use tier field from user object (source of truth)
    const subscriptionTier = user.tier || 'free';
    const tierOrder = { free: 0, pro: 1, premium: 2 };
    const userTierLevel = tierOrder[subscriptionTier as keyof typeof tierOrder] || 0;

    const filtered = AI_PERSONALITIES.filter(personality => {
      const personalityTierLevel = tierOrder[personality.tier as keyof typeof tierOrder];
      const hasAccess = personalityTierLevel <= userTierLevel;
      
      if (!hasAccess) {
        console.log(`🔒 Personality "${personality.name}" (${personality.tier}) is LOCKED for user tier: ${subscriptionTier}`);
      }
      
      return hasAccess;
    });

    console.log(`🎭 Available Personalities (${filtered.length}/${AI_PERSONALITIES.length}):`, 
      filtered.map(p => `${p.name} (${p.tier})`).join(', ')
    );

    return filtered;
  }, [user]);

  // Speech synthesis functions
  const handleSpeakMessage = useCallback(async (messageId: string, text: string) => {
    if (!speechEnabled) return;
    cancelSpeech();
    setSpeakingMessageId(messageId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await speakAIResponse(text, selectedPersonality.id, settings.language);
      setSpeakingMessageId(null);
    } catch (error) {
      setSpeakingMessageId(null);
      toast({
        title: 'Speech Error',
        description: 'Failed to speak the message. Please try again.',
        variant: 'destructive'
      });
    }
  }, [speechEnabled, selectedPersonality.id, speakAIResponse, cancelSpeech, toast, settings.language]);

  const handleStopSpeaking = useCallback(() => {
    cancelSpeech();
    setSpeakingMessageId(null);
  }, [cancelSpeech]);

  const handleTestVoice = useCallback(() => {
    const testMessage = `Hello! I'm ${selectedPersonality.name}. This is how I sound. Let's learn English together!`;
    handleSpeakMessage('test', testMessage);
  }, [selectedPersonality.name, handleSpeakMessage]);

  // Set personality-specific voice when personality changes
  // No need to set personality-specific voice, handled by selectedVoice effect above

  // Start new conversation
  const startNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}`,
      title: `Chat with ${selectedPersonality.name}`,
      personalityId: selectedPersonality.id,
      messages: [{
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: getPersonalityWelcomeMessage(selectedPersonality.id, user?.fullName || 'there'),
        timestamp: new Date()
      }],
      createdAt: new Date(),
      lastUpdated: new Date(),
      totalAccuracy: 0,
      totalXP: 0,
      messageCount: 1
    };

    setActiveConversation(newConversation);
    setMessages(newConversation.messages);
    setConversations(prev => [newConversation, ...prev.slice(0, 49)]); // Keep max 50 conversations
    // Removed: setLatestAccuracy(null);
    setSidebarMode('stats');
  }, [selectedPersonality, user?.fullName]);

  // Initialize conversation
  useEffect(() => {
    if (!activeConversation) {
      startNewConversation();
    }
  }, [activeConversation, startNewConversation]);

  // 🔄 Fetch initial progress data once on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!user) return;

      try {
        setProgressLoading(true);
        console.log('📊 Fetching initial progress data on mount...');
        
        const { default: OptimizedProgressServiceLazy } = await import('../../services/AI Chat/optimizedProgressService');
        const data = await OptimizedProgressServiceLazy.getRealtimeProgress(false);
        setInitialProgressData(data);
        
        console.log('✅ Initial progress loaded:', {
          source: data.source,
          streak: data.streak?.current || 0,
          xp: data.xp?.total || 0,
          accuracy: data.accuracy?.overall || 0,
          messages: data.stats?.totalMessages || 0,
        });

        // Populate chatStats with initial data
        setChatStats(prev => ({
          ...prev,
          currentAccuracy: data.accuracy?.overall || prev.currentAccuracy,
          totalMessages: data.stats?.totalMessages || prev.totalMessages,
          totalXP: data.xp?.total || prev.totalXP,
          currentLevel: data.xp?.currentLevel || prev.currentLevel,
          currentLevelXP: data.xp?.currentLevelXP ?? prev.currentLevelXP,
          xpToNextLevel: data.xp?.xpToNextLevel || prev.xpToNextLevel,
          xpRequiredForLevel: data.xp?.xpRequiredForLevel || prev.xpRequiredForLevel,
          xpProgressPercentage: data.xp?.progressPercentage ?? prev.xpProgressPercentage,
          streak: data.streak?.current || prev.streak,
          totalLearningTime: (data.stats?.totalMinutes || 0) * 60 || prev.totalLearningTime,
        }));
      } catch (error) {
        console.error('❌ Failed to fetch initial progress:', error);
      } finally {
        setProgressLoading(false);
      }
    };

    fetchInitialData();
  }, [user]); // Only fetch on mount or when user changes

  // Track learning time (only for UI, real tracking happens in backend)
  useEffect(() => {
    const interval = setInterval(() => {
      setChatStats(prev => ({
        ...prev,
        totalLearningTime: prev.totalLearningTime + 1
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  // 🔄 Cleanup real-time progress service on unmount
  useEffect(() => {
    return () => {
        if (user?.id) {
        console.log('🧹 Cleaning up real-time progress service');
        import('../../services/AI Chat/optimizedProgressService').then(mod => {
          try { mod.default.stopListening(user.id); } catch (e) { /* ignore */ }
        }).catch(() => {/* ignore */});
      }
    };
  }, [user?.id]);

  // 🔥 STREAK TRACKING - Track active minutes and update streak
  useEffect(() => {
    // Lightweight heartbeat for streak tracking (keeps API lazy-loading elsewhere intact)
    const streakInterval = setInterval(() => {
      // no-op heartbeat; detailed streak logic is lazy-loaded elsewhere
    }, 60000);

    return () => clearInterval(streakInterval);
  }, [sessionStartTime, streakData, userTier, user, toast]);

  // 🔥 INITIAL STREAK CHECK - Check streak status on mount (lazy-load to avoid eager init)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const StreakModule = await import('../../services/AI Chat/streakService');
        // Only run if component still mounted and streakData is available
        if (!mounted) return;

        const riskStatus = StreakModule.default.checkStreakRisk(streakData, userTier);

        if (riskStatus.atRisk && riskStatus.hoursRemaining > 0) {
          toast({
            title: '⚠️ Streak at Risk!',
            description: riskStatus.message,
            variant: 'destructive',
            duration: 8000,
          });
        }

        // Update chat stats with current streak (guarded)
        setChatStats(prev => ({
          ...prev,
          streak: streakData?.current ?? prev.streak
        }));
      } catch (err) {
        // ignore lazy-load errors
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Removed: Real-time frontend accuracy calculation effect. All accuracy is now backend-driven.


  // AI response generator
  const getAIResponse = useCallback(async (
    userMessage: string,
    personality: AIPersonality,
    history: Message[],
    onChunk?: (chunk: string) => void,
    onComplete?: (fullResponse: string) => void,
    signal?: AbortSignal
  ): Promise<string> => {
    try {
      const conversationHistory: GeminiMessage[] = history.slice(-20).map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: message.content
      }));

      // Call backend API with streaming support
      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai-chat/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            message: userMessage,
            personalityId: personality.id,
            conversationHistory: conversationHistory,
            language: settings.language,
            userProfile: user ? {
              userName: user.fullName || user.username,
              userLevel: (user as User & { level?: number }).level || 1,
              totalXP: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.totalXP || 0,
              currentStreak: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.currentStreak || 0,
              skillLevels: {
                vocabulary: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.vocabulary || 0,
                grammar: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.grammar || 0,
                pronunciation: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.pronunciation || 0,
                fluency: (user as User & { stats?: { totalXP?: number; currentStreak?: number; vocabulary?: number; grammar?: number; pronunciation?: number; fluency?: number } }).stats?.fluency || 0
              }
            } : undefined
          }),
          signal: signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Handle Server-Sent Events
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                try {
                  const data = JSON.parse(dataStr);

                  if (data.chunk) {
                    fullResponse += data.chunk;
                    onChunk?.(data.chunk);
                  } else if (data.done) {
                    onComplete?.(fullResponse);
                    return fullResponse;
                  } else if (data.error) {
                    throw new Error(data.error);
                  }
                } catch (parseError) {
                  // Skip invalid JSON
                  console.warn('Skipping invalid SSE data:', dataStr);
                }
              }
          }
        }

        onComplete?.(fullResponse);
        return fullResponse;

      } finally {
        reader.releaseLock();
      }

    } catch (error) {
      console.error('Backend API error:', error);
      throw error;
    }
  }, [settings.language, user]);  // Send message to AI
  const sendMessage = useCallback(async () => {
    if (!input.trim() || !activeConversation) return;

    // Store the current messageCount and accuracy timestamp before sending
    setLatestMessageCount(chatStats.totalMessages);
    setLatestAccuracyTimestamp(latestAccuracy?.timestamp?.toISOString() || null);
    setIsSidebarLoading(true);

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Add user message
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const assistantMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      personalityId: selectedPersonality.id,
      isStreaming: true // Mark as streaming
    };

    // Add assistant message to UI
    const messagesWithAssistant = [...newMessages, assistantMessage];
    setMessages(messagesWithAssistant);

    // Create abort controller for stream cancellation
    const controller = new AbortController();
    setAbortController(controller);

    try {
      // Get AI response with streaming first
      const fullResponse = await getAIResponse(
        userMessage.content,
        selectedPersonality,
        messagesWithAssistant,
        // onChunk callback - update the assistant message content
        (chunk: string) => {
          setMessages(prevMessages => {
            return prevMessages.map(msg => {
              if (msg.id === assistantMessage.id) {
                return {
                  ...msg,
                  content: msg.content + chunk
                };
              }
              return msg;
            });
          });
        },
        // onComplete callback - mark streaming as complete and auto-speak if enabled
        async (fullResponse: string) => {
          setMessages(prevMessages => {
            return prevMessages.map(msg => {
              if (msg.id === assistantMessage.id) {
                return {
                  ...msg,
                  content: fullResponse,
                  isStreaming: false // Mark streaming as complete
                };
              }
              return msg;
            });
          });

          setLoading(false); // Ensure loading is false when streaming completes

          // Auto-speak the AI response if speech is enabled
          if (speechEnabled && fullResponse) {
            setTimeout(() => {
              speakAIResponse(fullResponse, selectedPersonality.id, settings.language).catch(err => {
                console.error('Auto-speak error:', err);
              });
            }, 1000);
          }
        },
        controller.signal
      );

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversation.id
          ? {
              ...conv,
              messages: messagesWithAssistant.map(msg =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: fullResponse, isStreaming: false }
                  : msg
              ),
              lastUpdated: new Date(),
              totalAccuracy: messagesWithAssistant.reduce((sum, msg) =>
                sum + (msg.accuracy?.overall || 0), 0) / messagesWithAssistant.filter(msg => msg.accuracy).length || 0,
              totalXP: messagesWithAssistant.reduce((sum, msg) => sum + (msg.xpGained || 0), 0),
              messageCount: messagesWithAssistant.length
            }
          : conv
      ));

      setActiveConversation(prev =>
        prev ? {
          ...prev,
          messages: messagesWithAssistant.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: fullResponse, isStreaming: false }
              : msg
          ),
          lastUpdated: new Date(),
          totalAccuracy: messagesWithAssistant.reduce((sum, msg) =>
            sum + (msg.accuracy?.overall || 0), 0) / messagesWithAssistant.filter(msg => msg.accuracy).length || 0,
          totalXP: messagesWithAssistant.reduce((sum, msg) => sum + (msg.xpGained || 0), 0),
          messageCount: messagesWithAssistant.length
        } : null
      );

      // After sending a message, prefer using the optimized service listener (server-aware polling)
      // Falls back to local polling if no user id is available
      if (user?.id) {
        try {
          const listener: ProgressListener = {
            onProgressUpdate: (update: ProgressUpdate) => {
              // Map ProgressUpdate to ChatStats
              const mapped: ChatStats = {
                currentAccuracy: update.accuracy?.overall ?? 0,
                totalMessages: update.accuracy?.messageCount ?? 0,
                totalXP: update.xp?.total ?? 0,
                currentLevel: update.xp?.level ?? 1,
                currentLevelXP: update.xp?.currentLevelXP ?? 0,
                xpToNextLevel: update.xp?.xpToNextLevel ?? 0,
                xpRequiredForLevel: update.xp?.xpRequiredForLevel ?? 100,
                xpProgressPercentage: update.xp?.progressPercentage ?? 0,
                weeklyProgress: 0,
                streak: update.streak?.current ?? 0,
                totalLearningTime: 0
              };

              setChatStats(mapped);
              // Clear loading state and debug
              setIsSidebarLoading(false);
              console.debug('[PROGRESS LISTENER] onProgressUpdate', update, mapped);
            },
            onLevelUp: (newLevel: number, oldLevel: number, xpGained: number) => {
              setLevelUpData({ newLevel, oldLevel, xpGained });
              setShowLevelUpNotification(true);
            },
            onAccuracyUpdate: (accuracyUpdate: ProgressUpdate['accuracy']) => {
              const accuracyObj = {
                overall: accuracyUpdate.overall,
                adjustedOverall: accuracyUpdate.adjustedOverall,
                grammar: accuracyUpdate.grammar ?? 0,
                vocabulary: accuracyUpdate.vocabulary ?? 0,
                spelling: accuracyUpdate.spelling ?? 0,
                fluency: accuracyUpdate.fluency ?? 0,
                punctuation: accuracyUpdate.punctuation,
                capitalization: accuracyUpdate.capitalization,
                messageCount: accuracyUpdate.messageCount
              } as AccuracyResult;

              const latest = {
                accuracy: accuracyObj,
                xpGained: undefined,
                timestamp: new Date(accuracyUpdate.lastUpdated || Date.now()),
                fromCache: accuracyUpdate.source !== 'database'
              };

              setLatestAccuracy(latest);
              // Clear loading state and debug
              setIsSidebarLoading(false);
              // Auto-switch sidebar to accuracy view and ensure it's visible so users see the latest snapshot
              setSidebarMode('accuracy');
              setSidebarOpen(true);
              console.debug('[PROGRESS LISTENER] onAccuracyUpdate', accuracyUpdate, latest, 'switched sidebar to accuracy');
            },
            onError: (err?: Error) => {
              console.error('Progress listener error:', err);
            }
          };

          try {
            const { default: OptimizedProgressServiceLazy } = await import('../../services/AI Chat/optimizedProgressService');
            OptimizedProgressServiceLazy.startListening(user.id, listener);
          } catch (err) {
            console.error('Failed to start OptimizedProgressService listener', err);
            throw err;
          }
        } catch (err) {
          console.error('Failed to start OptimizedProgressService listener, falling back to polling', err);
          setPolling(true);
        }
      } else {
        setPolling(true);
      }

    } catch (error) {
      console.error('Error sending message:', error);

      setMessages(prevMessages => {
        return prevMessages.map(msg => {
          if (msg.id === assistantMessage.id) {
            return {
              ...msg,
              content: "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.",
              isStreaming: false
            };
          }
          return msg;
        });
      });

      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  }, [getAIResponse, messages, activeConversation, toast, selectedPersonality, input, speakAIResponse, speechEnabled, settings.language, chatStats, latestAccuracy, user?.id]);

  // Handle key press in input
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // If a transcript was uploaded and we set `autoSendPending`, trigger sendMessage
  // once `sendMessage` is available. This avoids referencing `sendMessage` before
  // it's initialized and ensures the transcribed input is sent automatically.
  useEffect(() => {
    if (!autoSendPending) return;

    let mounted = true;

    (async () => {
      try {
        await sendMessage();
      } catch (err) {
        console.error('Auto-send failed:', err);
      } finally {
        if (mounted) setAutoSendPending(false);
      }
    })();

    return () => { mounted = false; };
  }, [autoSendPending, sendMessage]);

  // Voice recording functionality
  const recognitionRetryRef = useRef(0);
  const RECOGNITION_MAX_RETRIES = 2;
  const RECOGNITION_BASE_BACKOFF = 500; // ms
  const startVoiceRecording = useCallback(async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Voice Recognition Not Supported',
        description: 'Your browser does not support voice recognition.',
        variant: 'destructive'
      });
      return;
    }
    // Start raw audio capture via AudioRecorder (ensures mic permission prompt
    // and provides chunks for fallback / downstream upload if SR fails).
    audioChunksRef.current = [];
    try {
      audioRecorderRef.current = new AudioRecorder((chunk) => {
        // Collect float32 chunks
        audioChunksRef.current.push(chunk);
      });
      await audioRecorderRef.current.start();
      setIsRawRecording(true);
    } catch (err) {
      console.warn('Failed to start AudioRecorder', err);
      toast({ title: 'Microphone Error', description: 'Unable to access microphone.', variant: 'destructive' });
      // fall through to attempt SpeechRecognition (may still work)
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      const rec = recognitionRef.current as
        | InstanceType<typeof window.SpeechRecognition>
        | InstanceType<typeof window.webkitSpeechRecognition>;
      // Use continuous + interim results for smoother UX; stop explicitly when user toggles
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = settings.language || 'en-US';

      // reset retry counter on successful start
      recognitionRetryRef.current = 0;

      rec.onresult = (event) => {
        try {
          const last = event.results[event.results.length - 1];
          const transcript = last[0].transcript || '';
          if (last.isFinal) {
            // Append final transcript to the input and clear interim
            setInput(prev => (prev && prev.trim().length > 0 ? prev + ' ' + transcript : transcript));
            setInterimTranscript('');
          } else {
            // Show interim transcript without committing
            setInterimTranscript(transcript);
          }
        } catch (e) {
          console.debug('Error processing speech result', e);
        }
      };

      rec.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        // Network errors can be transient; attempt a small number of retries
        if (event.error === 'network') {
          const retryCount = recognitionRetryRef.current ?? 0;
          if (retryCount < RECOGNITION_MAX_RETRIES) {
            const backoff = RECOGNITION_BASE_BACKOFF * Math.pow(2, retryCount);
            recognitionRetryRef.current = retryCount + 1;
            toast({
              title: 'Network issue with voice recognition',
              description: `Retrying voice recognition (attempt ${recognitionRetryRef.current}/${RECOGNITION_MAX_RETRIES})...`,
            });
            try { rec.stop(); } catch (err) { /* ignore */ }
            setTimeout(() => {
              // attempt restart
              try {
                startVoiceRecording();
              } catch (e) {
                console.error('Failed to restart speech recognition after network error', e);
                setIsRecording(false);
              }
            }, backoff);
            return;
          }
          // final fallback after retries: inform the user and ensure raw audio capture
          toast({
            title: 'Network Error in Voice Recognition',
            description: 'Voice recognition experienced a network error — switching to raw audio capture so you can upload for transcription.',
            variant: 'destructive'
          });

          try { rec.stop(); } catch (err) { /* ignore */ }

          // If we don't already have a raw AudioRecorder running, start one so we can
          // continue capturing the user's speech locally and upload it later.
          if (!audioRecorderRef.current) {
            try {
              audioChunksRef.current = [];
              audioRecorderRef.current = new AudioRecorder((chunk) => {
                audioChunksRef.current.push(chunk);
              });
              // start() may prompt for mic permission if not yet granted
              audioRecorderRef.current.start().then(() => {
                setIsRawRecording(true);
                console.debug('AudioRecorder started as fallback after SR network error');
              }).catch((startErr) => {
                console.warn('Fallback AudioRecorder failed to start:', startErr);
                setIsRawRecording(false);
              });
            } catch (startErr) {
              console.warn('Failed to create/start AudioRecorder fallback', startErr);
              setIsRawRecording(false);
            }
          } else {
            // already recording raw audio
            setIsRawRecording(true);
          }

          // Keep the recording UI active so user can stop and upload the captured audio
          setIsRecording(true);
          return;
        }

        // Non-network errors: permission issues or others
        const errCode = String((event as unknown as { error?: string }).error || '');
        if (errCode === 'not-allowed' || errCode === 'permission_denied') {
          toast({
            title: 'Microphone Permission Denied',
            description: 'Please allow microphone access in your browser settings and try again.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Voice Recognition Error',
            description: 'Failed to recognize speech. Please try again.',
            variant: 'destructive'
          });
        }
        try { rec.stop(); } catch (err) { /* ignore */ }
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
        setInterimTranscript('');
      };

      // Start listening
      rec.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      toast({
        title: 'Voice Recognition Error',
        description: 'Failed to start voice recognition. Please try again.',
        variant: 'destructive'
      });
    }
  }, [settings.language, toast]);

  const stopVoiceRecording = useCallback(async () => {
    if (recognitionRef.current) {
      (
        recognitionRef.current as
          | InstanceType<typeof window.SpeechRecognition>
          | InstanceType<typeof window.webkitSpeechRecognition>
      ).stop();
    }

    try {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.stop();
        setIsRawRecording(false);

        // Capture chunks and clear shared state quickly
        const chunks = audioChunksRef.current.slice();
        audioChunksRef.current = [];
        audioRecorderRef.current = null;

        // Capture current interim transcript snapshot and defer heavy work off the click handler
        const currentInterim = interimTranscript;
        setTimeout(async () => {
          if (chunks.length === 0) return;
          try {
            let totalLen = 0;
            for (const c of chunks) totalLen += c.length;
            const merged = new Float32Array(totalLen);
            let offset = 0;
            for (const c of chunks) {
              merged.set(c, offset);
              offset += c.length;
            }

            const b64 = encodeAudioForAPI(merged);
            setRecordedAudioBase64(b64);
            toast({ title: 'Audio recorded', description: 'Recorded audio captured locally. Uploading for transcription...', });

              try {
              const resp = await api.audio.transcribe({ audioBase64: b64, format: 'wav', sampleRate: 24000 });
              // Handle structured 'route not found' response from the client helper
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if ((resp as any)?.code === 'ROUTE_NOT_FOUND' || !resp || (resp as any).success === false) {
                console.warn('Transcription route missing or failed:', resp);
                // If we have an interim transcript from SpeechRecognition, use that
                if (currentInterim && currentInterim.trim().length > 0) {
                  setInput((prev) => (prev && prev.trim().length > 0 ? prev + ' ' + currentInterim : currentInterim));
                  setAutoSendPending(true);
                  api.accuracy.analyzeMessage({ userMessage: currentInterim }).catch((e) => console.warn('Analyzer failed:', e));
                } else {
                  toast({
                    title: 'Transcription service unavailable',
                    description: 'Backend transcription endpoint not found. Start the server or provide /audio/transcribe to enable upload-based transcription.',
                    variant: 'destructive'
                  });
                }
                return;
              }

              const transcript = resp?.data?.transcript || resp?.data?.text || resp?.transcript || '';
              if (transcript && transcript.trim().length > 0) {
                setInput((prev) => (prev && prev.trim().length > 0 ? prev + ' ' + transcript : transcript));
                setAutoSendPending(true);
                api.accuracy.analyzeMessage({ userMessage: transcript }).catch((e) => console.warn('Analyzer failed:', e));
              } else {
                toast({ title: 'Transcription empty', description: 'Server returned empty transcript.', variant: 'destructive' });
              }
            } catch (uploadErr) {
              console.error('Transcription upload failed', uploadErr);
              toast({ title: 'Transcription failed', description: 'Failed to transcribe recorded audio.', variant: 'destructive' });
            }
          } catch (err) {
            console.error('Failed to encode recorded audio', err);
          }
        }, 0);
      }
    } catch (err) {
      console.warn('Error stopping AudioRecorder', err);
    }

    setIsRecording(false);
    setInterimTranscript('');
  }, [toast, interimTranscript]);

  const handleRecordingToggle = useCallback(
    (checked: boolean) => {
      if (checked) {
        startVoiceRecording();
      } else {
        stopVoiceRecording();
      }
    },
    [startVoiceRecording, stopVoiceRecording]
  );

  const handleRecordingClick = useCallback(() => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  }, [isRecording, startVoiceRecording, stopVoiceRecording]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Sidebar mode change: accuracy is always backend-driven, so no local check needed
  const handleSidebarModeChange = useCallback((mode: 'stats' | 'accuracy') => {
    setSidebarMode(mode);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cleanup effect for abort controller
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const toggleSettingsPanel = useCallback(() => {
    setShowSettings((prev) => !prev);
  }, []);

  // Track viewport width >= 700px to decide inline vs overlay settings
  const [isWide, setIsWide] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && window.innerWidth >= 700;
    } catch (e) {
      return false;
    }
  });
  const prevSidebarOpenRef = useRef<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 700px)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsWide(e.matches);
    };
    // initial
    setIsWide(mq.matches);

    // Support both modern and legacy listeners without using `any`.
    type MQWithLegacy = MediaQueryList & {
      addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
    };

    const mqLegacy = mq as MQWithLegacy;
    if (typeof mqLegacy.addEventListener === 'function') {
      mqLegacy.addEventListener!('change', handleChange as EventListener);
    } else if (typeof mqLegacy.addListener === 'function') {
      mqLegacy.addListener!(handleChange);
    }

    return () => {
      if (typeof mqLegacy.removeEventListener === 'function') {
        mqLegacy.removeEventListener!('change', handleChange as EventListener);
      } else if (typeof mqLegacy.removeListener === 'function') {
        mqLegacy.removeListener!(handleChange);
      }
    };
  }, []);

  // When settings open on wide screens, close the main sidebar (remember its previous state)
  useEffect(() => {
    if (showSettings && isWide) {
      if (sidebarOpen) {
        prevSidebarOpenRef.current = true;
        setSidebarOpen(false);
      } else {
        prevSidebarOpenRef.current = false;
      }
    }

    if (!showSettings && prevSidebarOpenRef.current) {
      setSidebarOpen(true);
      prevSidebarOpenRef.current = null;
    }
  }, [showSettings, isWide, sidebarOpen]);

  // Personality selection
  const handlePersonalityChange = useCallback((personality: AIPersonality) => {
    if (!availablePersonalities.some(p => p.id === personality.id)) {
      toast({
        title: 'Subscription Required',
        description: `${personality.name} is available for ${personality.tier} subscribers.`,
        variant: 'destructive'
      });
      return;
    }

    setSelectedPersonality(personality);
    setSettings(prev => ({ ...prev, personality: personality.id }));

    if (activeConversation) {
      startNewConversation();
    }
  }, [availablePersonalities, toast, activeConversation, startNewConversation]);

  const handleConversationSelect = useCallback((conversation: Conversation) => {
    setActiveConversation(conversation);
    setMessages(conversation.messages);
  }, []);


  // (latestAccuracy state declared at the top of the component)

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">

      {/* Level-Up Notification */}
      {levelUpData && (
        <LevelUpNotification
          show={showLevelUpNotification}
          newLevel={levelUpData.newLevel}
          oldLevel={levelUpData.oldLevel}
          xpGained={levelUpData.xpGained}
          onClose={() => setShowLevelUpNotification(false)}
        />
      )}

      {/* Progress Polling Indicator */}
      {isPollingProgress && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 z-40 flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full shadow-lg"
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Updating progress...</span>
        </motion.div>
      )}

      <div className="container mx-auto flex h-full flex-1 min-h-0 flex-col justify-start px-0 py-0 sm:px-3 sm:py-4 lg:px-4 lg:py-6">
        <div className="flex h-full w-full max-w-7xl flex-1 min-h-0 flex-col">

          {/* Unified Chat Card */}
          <div className="relative flex h-[calc(100vh-3.5rem)] max-h-[calc(100vh-3.5rem)] flex-1 flex-col min-h-0 overflow-hidden bg-white shadow-none dark:bg-slate-950/95 sm:h-[calc(100vh-5rem)] sm:max-h-[calc(100vh-5rem)] sm:rounded-[1.75rem] sm:border sm:bg-white sm:dark:bg-slate-950 lg:h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-6rem)] lg:flex-row">

            {/* Sidebar Section */}
            <AnimatePresence>
              {sidebarOpen && !(isWide && showSettings) && (
                <motion.aside
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 h-full min-h-0 w-80 flex-shrink-0 self-stretch overflow-hidden border-r border-emerald-200/40 dark:border-emerald-900/30 flex"
                >
                  <div className="flex h-full w-full overflow-hidden">
                    <AIChatSidebar
                      conversations={conversations}
                      activeConversation={activeConversation}
                      onSelectConversation={handleConversationSelect}
                      onNewConversation={startNewConversation}
                      chatStats={chatStats}
                      personalities={AI_PERSONALITIES}
                      selectedPersonalityId={selectedPersonality.id}
                      onSelectPersonality={handlePersonalityChange}
                      sidebarMode={sidebarMode}
                      onSidebarModeChange={handleSidebarModeChange}
                      latestAccuracy={latestAccuracy || undefined}
                      isSidebarLoading={isSidebarLoading}
                    />
                  </div>
                </motion.aside>
              )}

              {isWide && showSettings && (
                <motion.aside
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 h-full min-h-0 w-80 flex-shrink-0 self-stretch overflow-hidden border-r border-emerald-200/40 dark:border-emerald-900/30 flex"
                >
                  <div className="flex h-full w-full overflow-hidden">
                    <AIChatSettingsSidebar
                      inline
                      isOpen={showSettings}
                      onClose={() => setShowSettings(false)}
                      settings={settings}
                      setSettings={setSettings}
                      isRecording={isRecording}
                      onToggleRecording={handleRecordingToggle}
                      voices={voices}
                      selectedVoice={selectedVoice}
                      onVoiceSelect={setSelectedVoice}
                      onTestVoice={handleTestVoice}
                      speechRate={speechRate}
                      onSpeechRateChange={setSpeechRate}
                      speechPitch={speechPitch}
                      onSpeechPitchChange={setSpeechPitch}
                      speechVolume={speechVolume}
                      onSpeechVolumeChange={setSpeechVolume}
                      userTier={userTier}
                      currentPersonalityId={selectedPersonality.id}
                    />
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Settings Sidebar (overlay for small screens) */}
            {!(isWide && showSettings) && (
              <AIChatSettingsSidebar
                inline={false}
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
                settings={settings}
                setSettings={setSettings}
                isRecording={isRecording}
                onToggleRecording={handleRecordingToggle}
                voices={voices}
                selectedVoice={selectedVoice}
                onVoiceSelect={setSelectedVoice}
                onTestVoice={handleTestVoice}
                speechRate={speechRate}
                onSpeechRateChange={setSpeechRate}
                speechPitch={speechPitch}
                onSpeechPitchChange={setSpeechPitch}
                speechVolume={speechVolume}
                onSpeechVolumeChange={setSpeechVolume}
                userTier={userTier}
                currentPersonalityId={selectedPersonality.id}
              />
            )}

            {/* Main Chat Section */}
            <main className="relative z-10 flex flex-1 min-h-0 min-w-0 flex-col overflow-hidden">
              <header className="relative z-10 flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 border-b border-emerald-500/35 bg-[#059669] text-white shadow-[0_8px_24px_-18px_rgba(5,150,105,0.85)] sm:gap-3 sm:px-4 sm:py-3">
                <div className="flex items-center gap-3 sm:gap-4 text-white">
                  {(() => {
                    const Icon = getPersonalityIcon(selectedPersonality.iconId);
                    return <Icon size={40} className="opacity-95" />;
                  })()}
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]"></span>
                  </div>
                  
                  {/* 🔥 STREAK INDICATOR (Local state, updated during session) */}
                  {streakData?.current > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm",
                        (streakData?.todayMinutes ?? 0) >= 10
                          ? "bg-green-500/20 border-green-400/30" 
                          : "bg-orange-500/20 border-orange-400/30"
                      )}
                      title={`Current streak: ${streakData?.current ?? 0} days | ${(streakData?.todayMinutes ?? 0) >= 10 ? 'Goal met! ✅' : `${10 - (streakData?.todayMinutes ?? 0)}m remaining`}`}
                    >
                      <span className="text-lg">{(streakData?.todayMinutes ?? 0) >= 10 ? '✅' : '🔥'}</span>
                      <span className="text-sm font-bold">{streakData?.current ?? 0}</span>
                      {(streakData?.todayMinutes ?? 0) < 10 && (
                        <span className="text-xs opacity-75">
                          ({10 - (streakData?.todayMinutes ?? 0)}m)
                        </span>
                      )}
                    </motion.div>
                  )}
                  
                  {/* ⏱️ SESSION TIME (Local tracking) */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-sm"
                    title={`Session time: ${activeMinutes} minutes`}
                  >
                    <span className="text-sm">⏱️</span>
                    <span className="text-xs font-medium">{activeMinutes}m</span>
                  </motion.div>
                </div>

                <div className="hidden items-center gap-3 text-white sm:flex">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label={sidebarOpen ? 'Hide conversation list' : 'Show conversation list'}
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-3.5 w-3.5" />
                    ) : (
                      <PanelLeftOpen className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className={cn(
                      "relative p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30",
                      isSpeaking && "animate-pulse"
                    )}
                    aria-label={speechEnabled ? "Mute speaker" : "Enable speaker"}
                  >
                    {speechEnabled ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5" />
                    )}
                    {isSpeaking && speechEnabled && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-ping" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(true)}
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="View progress"
                  >
                    <Activity className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      toast({
                        title: 'Lesson saved',
                        description: 'This conversation has been marked for review.',
                      })
                    }
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Save lesson"
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={toggleSettingsPanel}
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Toggle settings"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-white sm:hidden">
                  <button
                    type="button"
                    onClick={toggleSidebar}
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label={sidebarOpen ? 'Hide conversation list' : 'Show conversation list'}
                  >
                    {sidebarOpen ? (
                      <PanelLeftClose className="h-3.5 w-3.5" />
                    ) : (
                      <PanelLeftOpen className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleSpeech}
                    className={cn(
                      "relative p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30",
                      isSpeaking && "animate-pulse"
                    )}
                    aria-label={speechEnabled ? "Mute speaker" : "Enable speaker"}
                  >
                    {speechEnabled ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5" />
                    )}
                    {isSpeaking && speechEnabled && (
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-400 animate-ping" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleSettingsPanel}
                    className="p-1 text-white transition hover:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-white/30"
                    aria-label="Toggle settings"
                  >
                    <Settings className="h-3.5 w-3.5" />
                  </button>
                </div>
              </header>

              {/* Chat Content Area */}
              <div className="relative flex flex-1 min-h-0 flex-col overflow-hidden">
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className="h-full flex-1 p-4 sm:p-6 max-h-full touch-pan-y overflow-auto" 
                  role="log" 
                  aria-live="polite"
                  onScroll={handleScroll}
                >
                  <div className="space-y-4">
                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <ChatMessageItem
                          key={message.id}
                          message={message}
                          index={index}
                          selectedPersonality={selectedPersonality}
                          settings={settings}
                        />
                      ))}
                    </AnimatePresence>

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Scroll to bottom button */}
                <AnimatePresence>
                  {showScrollButton && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-24 right-6 z-20"
                    >
                      <button
                        onClick={scrollToBottom}
                        className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-900/20 border-2 border-white/20 backdrop-blur-sm transition-colors flex items-center justify-center"
                        aria-label="Scroll to bottom"
                      >
                        <ChevronUp className="h-5 w-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 📊 REAL-TIME ACCURACY INDICATOR (Premium) */}
              {/* Real-time frontend accuracy indicator removed. All accuracy/XP/level is backend-driven. */}

              <ChatInputArea
                input={input}
                onInputChange={setInput}
                onSend={sendMessage}
                loading={loading}
                isRecording={isRecording}
                onToggleRecording={handleRecordingClick}
                interimTranscript={interimTranscript}
                settings={settings}
                selectedPersonality={selectedPersonality}
                onKeyPress={handleKeyPress}
                characterCount={input.length}
                maxCharacters={500}
              />
            </main>
          </div>

          {/* Mobile Sidebar Overlay */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                onClick={toggleSidebar}
              >
                <motion.aside
                  initial={{ x: -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -300, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute left-0 top-0 h-full w-full max-w-xs bg-white/88 dark:bg-slate-950/70 backdrop-blur-2xl border-r border-emerald-200/40 dark:border-emerald-900/30 sm:max-w-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <AIChatSidebar
                    conversations={conversations}
                    activeConversation={activeConversation}
                    onSelectConversation={handleConversationSelect}
                    onNewConversation={startNewConversation}
                    chatStats={chatStats}
                    personalities={AI_PERSONALITIES}
                    selectedPersonalityId={selectedPersonality.id}
                    onSelectPersonality={handlePersonalityChange}
                    sidebarMode={sidebarMode}
                    onSidebarModeChange={handleSidebarModeChange}
                      latestAccuracy={latestAccuracy || undefined}
                      isSidebarLoading={isSidebarLoading}
                  />
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
export default AIChatPage;