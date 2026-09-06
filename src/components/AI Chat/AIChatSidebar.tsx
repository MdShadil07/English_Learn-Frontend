import React, { useState, useEffect, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Clock, Flame, MessageSquare, Plus, Sparkles, Target, TrendingUp, UserCircle2, X } from 'lucide-react';

import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { cn } from '../../lib/utils';

import { AIPersonality, ChatStats, Conversation, AccuracyResult } from './types';
import { SidebarUserCard } from './SidebarUserCard';
import { SidebarAccuracyCard } from './SidebarAccuracyCard';
import { getConversationPersonalityLogo, getPersonalityLogo } from '../Icons/AIPersonalityLogos';

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
  showAccuracy?: boolean;
  isSidebarLoading?: boolean;
  onClose?: () => void;
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
  showAccuracy = true,
  isSidebarLoading,
  onClose
}) => {
  const [activeView, setActiveView] = useState<'conversations' | 'personalities'>('conversations');
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [previousStats, setPreviousStats] = useState<ChatStats | null>(null);

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
        className="flex h-full min-h-0 max-h-full w-full flex-col overflow-hidden border-r border-emerald-200/40 bg-white/88 sm:backdrop-blur-2xl dark:border-emerald-500/10 dark:bg-[#050C14]/60"
        style={{ willChange: 'transform, opacity', transform: 'translateZ(0)' }}
      >
        <div className="px-4 sm:px-5 pt-4 flex-none">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">Learning insights</span>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-full border border-emerald-200/50 bg-emerald-100/50 p-1 text-xs shadow-inner dark:border-emerald-800/50 dark:bg-emerald-900/40">
              <button
                type="button"
                onClick={() => onSidebarModeChange?.('stats')}
                className={cn(
                  'rounded-full px-2.5 py-1 font-semibold transition',
                  sidebarMode === 'stats'
                    ? 'bg-white text-emerald-700 shadow-sm dark:bg-[#050C14] dark:border dark:border-emerald-500/20 dark:text-emerald-300'
                    : 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                )}
              >
                Stats
              </button>
              {showAccuracy && (
                <button
                  type="button"
                  onClick={() => latestAccuracy && onSidebarModeChange?.('accuracy')}
                  className={cn(
                    'rounded-full px-2.5 py-1 font-semibold transition',
                    sidebarMode === 'accuracy'
                      ? 'bg-white text-emerald-700 shadow-sm dark:bg-[#050C14] dark:border dark:border-emerald-500/20 dark:text-emerald-300'
                      : latestAccuracy
                        ? 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400'
                        : 'cursor-not-allowed text-emerald-400/60 dark:text-emerald-600/40'
                  )}
                  disabled={!latestAccuracy}
                >
                  Accuracy
                </button>
              )}
              </div>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-emerald-200/70 bg-white/80 text-slate-500 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-emerald-500/20 dark:bg-[#050C14]/80 dark:text-slate-300 dark:hover:bg-emerald-900/50 lg:hidden"
                  aria-label="Close AI chat sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
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
          <div className="mt-3 grid grid-cols-2 gap-1 rounded-2xl border border-white/40 bg-white/60 p-1 shadow-inner backdrop-blur-sm dark:border-emerald-500/20 dark:bg-[#050C14]/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;

              return (
                <Button
                  key={tab.id}
                  className={cn(
                    'min-w-0 justify-center gap-1.5 rounded-xl border border-transparent px-2 transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                      : 'bg-transparent text-emerald-700 hover:border-emerald-300/60 hover:bg-emerald-50/60 hover:text-emerald-800 dark:text-emerald-200 dark:hover:border-emerald-700/60 dark:hover:bg-emerald-900/40'
                  )}
                  onClick={() => setActiveView(tab.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-300')} />
                  <span className="truncate text-xs font-semibold sm:text-sm">{tab.label}</span>
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
                        const PersonalityIcon = getConversationPersonalityLogo(personality?.iconId ?? 'basic-tutor');
                        return (
                          <button
                            key={conversation.id}
                            type="button"
                            className={cn(
                              'group flex w-full max-w-full items-start gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-200 will-change-transform',
                              'border-emerald-200/40 bg-white/82 shadow-sm backdrop-blur-xl dark:border-emerald-500/20 dark:bg-[#050C14]/68',
                              'hover:-translate-y-0.5 hover:shadow-lg dark:hover:border-emerald-600/50',
                              activeConversation?.id === conversation.id &&
                              'border-white/60 bg-gradient-to-br from-white/92 via-emerald-50/70 to-slate-50/90 shadow-[0_14px_35px_rgba(15,23,42,0.12)] ring-1 ring-emerald-400/15 dark:border-white/10 dark:from-slate-900/80 dark:via-emerald-950/35 dark:to-slate-900/75 dark:shadow-[0_14px_35px_rgba(0,0,0,0.35)] dark:ring-emerald-400/10'
                            )}
                            onClick={() => onSelectConversation(conversation)}
                          >
                            <div
                              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white/70 via-white/30 to-slate-100/50 dark:from-slate-900/75 dark:via-slate-900/55 dark:to-slate-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_8px_16px_rgba(15,23,42,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_16px_rgba(0,0,0,0.22)] border border-white/70 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
                              style={{ transform: 'translateZ(0)' }}
                            >
                              <PersonalityIcon
                                size={18}
                                className="text-emerald-600 dark:text-emerald-300"
                              />
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
                        const PersonalityIcon = getPersonalityLogo(personality.iconId);
                        return (
                          <button
                            key={personality.id}
                            type="button"
                            onClick={() => onSelectPersonality?.(personality)}
                            className={cn(
                              'flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition-transform duration-150 will-change-transform overflow-hidden',
                              'bg-white/80 dark:bg-[#050C14]/70 border-emerald-200/40 dark:border-emerald-500/20 shadow-sm',
                              isSelected && 'border-emerald-400 bg-emerald-50/70 dark:border-emerald-500 dark:bg-emerald-900/30',
                              'hover:translate-x-0.5 hover:shadow-md dark:hover:border-emerald-500/60'
                            )}
                            style={{ transform: 'translateZ(0)' }}
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-white/70 via-white/30 to-slate-100/50 dark:from-slate-900/75 dark:via-slate-900/55 dark:to-slate-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_20px_rgba(15,23,42,0.08)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_20px_rgba(0,0,0,0.24)] border border-white/70 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5 backdrop-blur-xl transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
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
export const MemoSidebarAccuracyCard = memo(SidebarAccuracyCard);
const MemoEmptyStateCard = memo(EmptyStateCard);
const MemoStatPill = memo(StatPill);

export default memo(AIChatSidebar);
