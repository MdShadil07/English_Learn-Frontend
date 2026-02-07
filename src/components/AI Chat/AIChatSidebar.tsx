import React, { useState, useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Clock, Flame, MessageSquare, Plus, Sparkles, Target, TrendingUp, UserCircle2 } from 'lucide-react';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

import { AIPersonality, ChatStats, Conversation } from './types';

// Define AccuracyResult type matching backend API response
export interface AccuracyResult {
  overall: number;
  adjustedOverall?: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation?: number;
  capitalization?: number;
  aiResponseAnalysis?: {
    appreciationLevel?: string;
    severityOfCorrections?: string;
    hasCorrectionFeedback?: boolean;
    correctedErrors?: string[];
  };
  insights?: {
    improvement?: number;
    netXP?: number;
    strengths?: string[];
    weaknesses?: string[];
    level?: string;
  };
  netXP?: number;
}
import { getPersonalityIcon } from '../Icons/AIPersonalityIcons';

interface AIChatSidebarProps {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  chatStats: ChatStats;
  personalities: AIPersonality[];
  selectedPersonalityId: string;
  onSelectPersonality?: (personality: AIPersonality) => void;
  sidebarMode: 'stats' | 'accuracy';
  onSidebarModeChange?: (mode: 'stats' | 'accuracy') => void;
  latestAccuracy?: {
    accuracy: AccuracyResult;
    xpGained?: number;
    timestamp: Date;
    fromCache?: boolean; // Track if result came from cache
  };
  isSidebarLoading?: boolean;
}

const AIChatSidebar: React.FC<AIChatSidebarProps> = ({
  conversations,
  activeConversation,
  onSelectConversation,
  onNewConversation,
  chatStats,
  personalities,
  selectedPersonalityId,
  onSelectPersonality,
  sidebarMode,
  onSidebarModeChange,
  latestAccuracy,
  isSidebarLoading
}) => {
  // Avoid noisy debug logs in production — logging harms scroll performance
  const [activeView, setActiveView] = useState<'conversations' | 'personalities'>('conversations');
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [previousStats, setPreviousStats] = useState<ChatStats | null>(null);

  // Update loading state when new data is being loaded
  useEffect(() => {
    if (isSidebarLoading) {
      setIsStatsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsStatsLoading(false);
        setPreviousStats(chatStats);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSidebarLoading, chatStats]);

  const tabs = [
    { id: 'conversations', label: 'Conversations', icon: MessageSquare },
    { id: 'personalities', label: 'AI Personalities', icon: Sparkles }
  ] as const;

  const getPersonality = (id: string) => personalities.find((personality) => personality.id === id);

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .ai-sidebar-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: rgba(5, 150, 105, 0.35) transparent;
              overscroll-behavior: contain;
            }

            .ai-sidebar-scrollbar::-webkit-scrollbar {
              width: 6px;
            }

            .ai-sidebar-scrollbar::-webkit-scrollbar-track {
              background: transparent;
            }

            .ai-sidebar-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(16, 185, 129, 0.45), rgba(20, 184, 166, 0.35));
              border-radius: 9999px;
            }

            .ai-sidebar-scrollbar:hover::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(16, 185, 129, 0.7), rgba(20, 184, 166, 0.6));
            }

            .dark .ai-sidebar-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(34, 197, 94, 0.45), rgba(45, 212, 191, 0.35));
            }

            .dark .ai-sidebar-scrollbar:hover::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, rgba(34, 197, 94, 0.7), rgba(45, 212, 191, 0.6));
            }
          `,
        }}
      />

      <aside
        className="w-full sm:w-80 flex h-full min-h-0 max-h-[calc(100vh-6rem)] flex-col overflow-hidden border-r border-emerald-200/40 bg-white/88 sm:backdrop-blur-2xl dark:border-emerald-900/30 dark:bg-slate-950/70 lg:max-h-[calc(100vh-2rem)]"
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      >
        <div className="px-4 sm:px-5 pt-5 flex-none">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Insights</span>
            <div className="inline-flex rounded-full bg-emerald-100/50 p-1 text-xs dark:bg-emerald-900/40">
              <button
                type="button"
                onClick={() => onSidebarModeChange?.('stats')}
                className={cn(
                  'rounded-full px-2.5 py-1 transition',
                  sidebarMode === 'stats'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                    : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                )}
              >
                Stats
              </button>
              <button
                type="button"
                onClick={() => latestAccuracy && onSidebarModeChange?.('accuracy')}
                className={cn(
                  'rounded-full px-2.5 py-1 transition',
                  sidebarMode === 'accuracy'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300'
                    : latestAccuracy
                    ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                    : 'cursor-not-allowed text-emerald-400/60 dark:text-emerald-600/40'
                )}
                disabled={!latestAccuracy}
              >
                Accuracy
              </button>
            </div>
          </div>

          {isSidebarLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-2"></span>
              <span className="text-emerald-700 font-medium">Calculating...</span>
            </div>
          ) : sidebarMode === 'stats' ? (
            <MemoSidebarUserCard
              level={chatStats.currentLevel}
              xpProgressPercentage={chatStats.xpProgressPercentage}
              currentLevelXp={chatStats.currentLevelXP}
              xpRequiredForLevel={chatStats.xpRequiredForLevel}
              xpToNextLevel={chatStats.xpToNextLevel}
              streak={chatStats.streak}
              totalXp={chatStats.totalXP}
              totalMessages={chatStats.totalMessages}
              accuracy={chatStats.currentAccuracy}
              totalLearningTime={chatStats.totalLearningTime}
              isLoading={isStatsLoading}
            />
          ) : latestAccuracy ? (
            <MemoSidebarAccuracyCard latestAccuracy={latestAccuracy} isLoading={isStatsLoading} />
          ) : null}
        </div>

        <div className="px-4 sm:px-5 flex-none">
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-white/40 bg-white/60 p-1 shadow-inner backdrop-blur-sm dark:border-emerald-900/40 dark:bg-slate-900/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;

              return (
                <Button
                  key={tab.id}
                  className={cn(
                    'flex-1 sm:min-w-[140px] gap-2 rounded-xl border border-transparent transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'bg-transparent text-emerald-700 hover:border-emerald-300/60 hover:bg-emerald-50/60 hover:text-emerald-800 dark:text-emerald-200 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-900/40'
                  )}
                  onClick={() => setActiveView(tab.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-300')} />
                  <span className="text-sm font-semibold">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 min-h-0 flex-col h-full px-4 sm:px-5 pb-5">
          <AnimatePresence mode="wait">
            {activeView === 'conversations' && (
              <motion.div
                key="conversations"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 min-h-0 flex flex-col h-full"
              >
                <div className="flex items-center justify-end pt-2 pb-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onNewConversation}
                    className="h-8 w-8 rounded-full border border-emerald-200/40 text-emerald-600 shadow-sm transition hover:scale-105 hover:bg-emerald-50/60 dark:border-emerald-800/40 dark:text-emerald-200 dark:hover:bg-emerald-900/40"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {conversations.length === 0 ? (
                  <MemoEmptyStateCard onNewConversation={onNewConversation} />
                ) : (
                  <div className="ai-sidebar-scrollbar flex-1 min-h-0 overflow-y-auto pr-1">
                    <div className="space-y-2.5 pb-4">
                              {conversations.map((conversation) => {
                        const personality = getPersonality(conversation.personalityId);
                                return (
                                  <button
                                    key={conversation.id}
                                    type="button"
                                    className={cn(
                                      'flex w-full max-w-full items-start gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-transform duration-150 will-change-transform',
                                      'border-emerald-200/50 bg-white/85 shadow-sm dark:border-emerald-800/50 dark:bg-slate-900/70',
                                      'hover:translate-x-0.5 hover:shadow-lg dark:hover:border-emerald-600/60',
                                      activeConversation?.id === conversation.id &&
                                        'border-emerald-400 bg-gradient-to-br from-emerald-50/90 via-teal-50/85 to-cyan-50/90 shadow-xl dark:border-emerald-500'
                                    )}
                                    onClick={() => onSelectConversation(conversation)}
                                  >
                            <div
                              className={cn(
                                'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white shadow-inner shadow-emerald-900/20',
                                personality?.gradient ?? 'from-emerald-400 to-teal-500'
                              )}
                                      style={{ transform: 'translateZ(0)' }}
                            >
                              {personality?.avatar ?? '🤖'}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-1.5">
                                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {conversation.title}
                                </p>
                                <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                                  {conversation.lastUpdated.toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                                <span className="font-medium text-emerald-600 dark:text-emerald-300">
                                  {conversation.messageCount} messages
                                </span>
                                {conversation.totalAccuracy > 0 && (
                                  <Badge variant="secondary" className="text-[9px] uppercase tracking-wide">
                                    {Math.round(conversation.totalAccuracy)}% avg
                                  </Badge>
                                )}
                                {conversation.totalXP > 0 && (
                                  <span className="rounded-full bg-emerald-100/80 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                    +{conversation.totalXP} XP
                                  </span>
                                )}
                              </div>
                              <p className="line-clamp-2 text-[10px] text-slate-400 dark:text-slate-500">
                                {personality?.description || 'Continue building your skills with this tutor.'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeView === 'personalities' && (
              <motion.div
                key="personalities"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex-1 min-h-0 flex flex-col h-full"
              >
                <div className="px-5 pt-2 pb-1" />

                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="ai-sidebar-scrollbar flex-1 min-h-0 overflow-y-auto px-5 pb-5 -mt-1">
                    <div className="space-y-3">
                      {personalities.map((personality) => {
                        const isSelected = personality.id === selectedPersonalityId;
                        const PersonalityIcon = getPersonalityIcon(personality.iconId);
                        return (
                          <button
                            key={personality.id}
                            type="button"
                            onClick={() => onSelectPersonality?.(personality)}
                            className={cn(
                              'flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition-transform duration-150 will-change-transform overflow-hidden',
                              'bg-white/80 dark:bg-slate-900/70 border-emerald-200/40 dark:border-emerald-800/40 shadow-sm',
                              isSelected && 'border-emerald-400 bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-900/30',
                              'hover:translate-x-0.5 hover:shadow-md dark:hover:border-emerald-500/60'
                            )}
                            style={{ transform: 'translateZ(0)' }}
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white to-emerald-50/80 dark:from-slate-800 dark:to-slate-700/80 shadow-lg border-2 border-emerald-200/70 dark:border-emerald-600/50 ring-1 ring-emerald-100/50 dark:ring-emerald-800/30">
                              <PersonalityIcon size={22} className="text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0 overflow-hidden">
                              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">{personality.name}</p>
                                <span className="shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-300 whitespace-nowrap">
                                  {personality.tier}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 break-words line-clamp-2">{personality.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>
    </>
  );
};

const SidebarUserCard: React.FC<{
  level: number;
  xpProgressPercentage: number;
  currentLevelXp: number;
  xpRequiredForLevel: number;
  xpToNextLevel: number;
  streak: number;
  totalXp: number;
  totalMessages: number;
  accuracy: number;
  totalLearningTime: number;
  isLoading?: boolean;
}> = ({
  level,
  xpProgressPercentage,
  currentLevelXp,
  xpRequiredForLevel,
  xpToNextLevel,
  streak,
  totalXp,
  totalMessages,
  accuracy,
  totalLearningTime,
  isLoading = false,
}) => {
  // Keep this component lightweight; avoid expensive debug logging
  // Format learning time to hours:minutes:seconds or minutes:seconds
  const formatLearningTime = (seconds: number): string => {
    if (isLoading) return '--:--';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const statTiles = [
    {
      id: 'streak',
      label: 'Streak',
      value: isLoading ? '--' : streak,
      icon: Flame,
      gradient: 'from-orange-400 to-orange-500',
      labelColor: 'text-orange-600 dark:text-orange-300'
    },
    {
      id: 'messages',
      label: 'Messages',
      value: isLoading ? '--' : totalMessages,
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-teal-500',
      labelColor: 'text-emerald-600 dark:text-emerald-300'
    },
    {
      id: 'accuracy',
      label: 'Overall Accuracy',
      value: isLoading ? '--%' : `${Math.round(accuracy)}%`,
      icon: Activity,
      gradient: 'from-indigo-500 to-blue-500',
      labelColor: 'text-indigo-600 dark:text-indigo-300'
    },
    {
      id: 'time',
      label: 'Learning Time',
      value: formatLearningTime(totalLearningTime),
      icon: Clock,
      gradient: 'from-purple-500 to-pink-500',
      labelColor: 'text-purple-600 dark:text-purple-300'
    }
  ] as const;

  return (
    <div className="relative overflow-hidden rounded-lg border border-emerald-200/30 bg-white/85 shadow-sm backdrop-blur-md dark:border-emerald-800/30 dark:bg-slate-950/55 flex-none">
      <div className="absolute -right-6 -top-5 h-16 w-16 rounded-full bg-emerald-200/28 blur-2xl dark:bg-emerald-800/18"></div>
      <div className="absolute bottom-0 left-4 h-10 w-10 rounded-full bg-teal-200/28 blur-2xl dark:bg-teal-800/18"></div>

      <div className="relative p-1 space-y-1">
        <div className="grid grid-cols-2 gap-0.5">
          {statTiles.map((tile, index) => {
            const Icon = tile.icon;

            return (
              <div
                key={tile.id}
                className={cn(
                  "relative overflow-hidden rounded-lg border border-white/30 bg-white/70 p-1 text-center shadow-sm backdrop-blur-sm dark:border-white/5 dark:bg-slate-900/60",
                  isLoading && "animate-pulse"
                )}
              >
                <div
                  className={`mx-auto will-change-transform transform-gpu h-4 w-4 flex items-center justify-center rounded-md bg-gradient-to-br ${tile.gradient} text-white shadow-sm`}
                  style={{ transform: 'translateZ(0)' }}
                >
                  <Icon className="h-2.5 w-2.5" />
                </div>
                <div className="mt-1 space-y-0">
                  <p className={`text-xs font-semibold ${tile.labelColor}`}>
                    {tile.value}
                  </p>
                  <p className="text-[9px] font-medium text-slate-600 dark:text-slate-300">{tile.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-1 pt-0.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">Level {isLoading ? '--' : level}</h3>
            </div>
          </div>
          {isLoading ? (
            <div className="h-1.5 w-full rounded-full bg-emerald-200/60 dark:bg-slate-800/70 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse"
                style={{ width: '50%' }}
              ></div>
            </div>
          ) : (
            <Progress
              value={xpProgressPercentage}
              className="h-1 rounded-full bg-emerald-200/60 dark:bg-slate-800/70 [&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-teal-500"
            />
          )}
          <div className="flex flex-wrap items-center justify-between gap-x-2 text-[9px] text-emerald-700/80 dark:text-emerald-200/70">
            <span>
              Total XP: <span className="font-semibold">{totalXp.toLocaleString()}</span>
            </span>
            <span className="text-[9px]">{isLoading ? '-- / --' : `Lvl XP: ${currentLevelXp.toLocaleString()} / ${xpRequiredForLevel.toLocaleString()}`}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-x-2 text-[9px] text-emerald-600/80 dark:text-emerald-300/70">
            <span>{isLoading ? '--' : xpToNextLevel.toLocaleString()} XP remaining</span>
            <span>{isLoading ? '--' : Math.round(xpProgressPercentage)}% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SidebarAccuracyCard: React.FC<{
  latestAccuracy: {
    accuracy: AccuracyResult;
    xpGained?: number;
    timestamp: Date;
    fromCache?: boolean;
  };
  isLoading?: boolean;
}> = ({ latestAccuracy, isLoading = false }) => {
  // Keep this component lightweight; avoid expensive debug logging
  const { accuracy, xpGained = 0, timestamp, fromCache = false } = latestAccuracy || {};
  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/40 bg-white/85 shadow-md backdrop-blur-xl dark:border-emerald-800/40 dark:bg-slate-950/60 flex-none">
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-black/30 backdrop-blur-sm">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        </div>
        <div className="p-4 opacity-30">
          <div className="h-6 w-3/4 rounded bg-slate-200 dark:bg-slate-700 mb-4"></div>
          <div className="h-4 w-1/2 rounded bg-slate-200 dark:bg-slate-700 mb-6"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700 mr-2"></div>
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-700"></div>
                <div className="ml-auto h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-700"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!accuracy) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border-2 border-dashed border-emerald-200/60 bg-white/50 p-6 text-center dark:border-emerald-900/40 dark:bg-slate-900/50">
        <div>
          <Activity className="mx-auto h-8 w-8 text-emerald-400" />
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            No accuracy data available yet
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Complete a conversation to see your accuracy metrics
          </p>
        </div>
      </div>
    );
  }
  const aiFeedback = accuracy.aiResponseAnalysis;

  // Calculate improvement indicator
  const improvement = accuracy.insights?.improvement ?? 0;
  // XP can be on root or inside insights
  const netXP = accuracy.netXP ?? accuracy.insights?.netXP ?? 0;
  const isPositiveXP = netXP > 0;
  const isImproving = improvement > 0;

  const primaryBreakdown = [
    { label: 'Grammar', value: accuracy.grammar?.toFixed(2) ?? '0.00' },
    { label: 'Vocabulary', value: accuracy.vocabulary?.toFixed(2) ?? '0.00' },
    { label: 'Spelling', value: accuracy.spelling?.toFixed(2) ?? '0.00' },
    { label: 'Fluency', value: accuracy.fluency?.toFixed(2) ?? '0.00' }
  ];

  const additionalMetrics = [
    { label: 'Punctuation', value: accuracy.punctuation !== undefined ? accuracy.punctuation.toFixed(2) : '0.00' },
    { label: 'Capitalization', value: accuracy.capitalization !== undefined ? accuracy.capitalization.toFixed(2) : '0.00' }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/50 bg-amber-50/70 shadow-lg backdrop-blur-xl dark:border-amber-800/40 dark:bg-amber-950/40 flex-none">
      <div className="absolute -right-12 -top-10 h-24 w-24 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-800/30"></div>
      <div className="absolute bottom-0 left-6 h-14 w-14 rounded-full bg-orange-200/30 blur-2xl dark:bg-orange-800/30"></div>

      <div className="relative p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-600 dark:text-amber-300" />
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Latest Accuracy</span>
            {fromCache && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 px-2 py-0.5 text-[9px] font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                📥 Cached
              </span>
            )}
          </div>
          <span className="text-[10px] text-amber-600/80 dark:text-amber-200/70">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-amber-700 dark:text-amber-200">{accuracy.overall.toFixed(2)}%</p>
              {accuracy.adjustedOverall && accuracy.adjustedOverall !== accuracy.overall && (
                <span className="text-xs text-amber-600/70 dark:text-amber-300/70">
                  (adj: {accuracy.adjustedOverall.toFixed(2)}%)
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-amber-600/80 dark:text-amber-300/80">Overall performance</p>
              {isImproving && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  +{improvement.toFixed(2)}%
                </span>
              )}
              {!isImproving && improvement < 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400">
                  <TrendingUp className="h-3 w-3 rotate-180" />
                  {improvement.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
          {typeof netXP === 'number' && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold shadow-sm ${
              isPositiveXP 
                ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'bg-red-100/80 text-red-700 dark:bg-red-900/50 dark:text-red-300'
            }`}>
              <TrendingUp className={`h-3 w-3 ${!isPositiveXP ? 'rotate-180' : ''}`} />
              {isPositiveXP ? '+' : ''}{netXP} XP
            </span>
          )}
        </div>

        {/* AI Feedback Badge */}
        {aiFeedback && (
          <div className="rounded-lg bg-blue-100/60 dark:bg-blue-900/30 p-2 border border-blue-200/40 dark:border-blue-800/40">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-blue-700 dark:text-blue-300">
                AI Feedback:
              </span>
              <span className="capitalize text-blue-600 dark:text-blue-400">
                {aiFeedback.appreciationLevel && aiFeedback.appreciationLevel !== 'none'
                  ? aiFeedback.appreciationLevel
                  : aiFeedback.severityOfCorrections || 'none'}
              </span>
            </div>
            {(aiFeedback.hasCorrectionFeedback || (aiFeedback.correctedErrors && aiFeedback.correctedErrors.length > 0)) && (
              <p className="text-[10px] text-blue-600/80 dark:text-blue-300/80 mt-1">
                ⚠️ AI made corrections - accuracy adjusted
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          {primaryBreakdown.map((item) => (
            <div key={item.label} className="rounded-xl border border-amber-200/40 bg-white/70 p-3 text-center shadow-sm dark:border-amber-800/40 dark:bg-amber-950/40">
              <p className="text-sm font-bold text-amber-700 dark:text-amber-200">{item.value}%</p>
              <p className="text-[11px] text-amber-600/80 dark:text-amber-300/80">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Metrics */}
        {(accuracy.punctuation !== undefined || accuracy.capitalization !== undefined) && (
          <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-amber-200/30 dark:border-amber-800/30">
            {additionalMetrics.map((item) => (
              <div key={item.label} className="rounded-xl border border-amber-200/40 bg-white/50 p-2 text-center shadow-sm dark:border-amber-800/40 dark:bg-amber-950/30">
                <p className="text-xs font-bold text-amber-700 dark:text-amber-200">{item.value}%</p>
                <p className="text-[10px] text-amber-600/80 dark:text-amber-300/80">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyStateCard: React.FC<{ onNewConversation: () => void }> = ({ onNewConversation }) => {
  return (
    <div className="mt-6 flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-emerald-200/60 bg-emerald-50/40 p-6 text-center text-sm text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-900/30 dark:text-emerald-200">
      <MessageSquare className="mb-3 h-6 w-6 text-emerald-500" />
      <p className="font-semibold">No conversations yet</p>
      <p className="mt-1 text-xs text-emerald-600/80 dark:text-emerald-300/80">
        Start a new chat to begin your practice journey with the AI tutor.
      </p>
      <Button
        onClick={onNewConversation}
        size="sm"
        className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:from-emerald-600 hover:to-teal-600"
      >
        <Plus className="mr-2 h-4 w-4" />
        New conversation
      </Button>
    </div>
  );
};

const StatPill: React.FC<{ label: string; value: React.ReactNode; tone: 'emerald' | 'teal' | 'cyan' | 'violet' }> = ({ label, value, tone }) => {
  const toneMap = {
    emerald: 'bg-emerald-50/60 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-200',
    teal: 'bg-teal-50/60 dark:bg-teal-900/20 text-teal-700 dark:text-teal-200',
    cyan: 'bg-cyan-50/60 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-200',
    violet: 'bg-violet-50/60 dark:bg-violet-900/20 text-violet-700 dark:text-violet-200'
  } as const;

  return (
    <div className={cn('rounded-xl border border-white/40 px-3 py-2 shadow-sm', toneMap[tone])}>
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-[11px] uppercase tracking-wide opacity-70">{label}</div>
    </div>
  );
};

// Memoize heavy subcomponents to avoid unnecessary re-renders
const MemoSidebarUserCard = memo(SidebarUserCard);
const MemoSidebarAccuracyCard = memo(SidebarAccuracyCard);
const MemoEmptyStateCard = memo(EmptyStateCard);
const MemoStatPill = memo(StatPill);

export default memo(AIChatSidebar);