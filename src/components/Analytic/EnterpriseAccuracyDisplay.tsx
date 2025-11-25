/**
 * 💎 ENTERPRISE ACCURACY DISPLAY COMPONENT
 * Displays tier-based accuracy analysis with premium features
 * Supports: FREE, PRO, PREMIUM tiers
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Award,
  AlertCircle,
  CheckCircle,
  Zap,
  BookOpen,
  Target,
  Sparkles,
  Crown,
  Star,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { AccuracyResult } from '@/utils/AI Chat/accuracy/accuracyCalculator';

interface EnterpriseAccuracyDisplayProps {
  accuracy: AccuracyResult;
  className?: string;
  showDetailed?: boolean;
}

const EnterpriseAccuracyDisplay: React.FC<EnterpriseAccuracyDisplayProps> = ({
  accuracy,
  className,
  showDetailed = true,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const tier = accuracy.tierInfo?.tier || 'FREE';
  const features = accuracy.tierInfo?.featuresUnlocked || {};

  // Tier badge styling
  const tierConfig = {
    FREE: { color: 'bg-gray-500', icon: null, label: 'Free' },
    PRO: { color: 'bg-blue-500', icon: Star, label: 'Pro' },
    PREMIUM: { color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: Crown, label: 'Premium' },
  };

  const tierInfo = tierConfig[tier as keyof typeof tierConfig] || tierConfig.FREE;
  const TierIcon = tierInfo.icon;

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-500';
    if (score >= 85) return 'text-blue-500';
    if (score >= 75) return 'text-yellow-500';
    if (score >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (score: number) => {
    if (score >= 95) return 'bg-green-500';
    if (score >= 85) return 'bg-blue-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Section header component
  const SectionHeader: React.FC<{ 
    title: string; 
    section: string; 
    icon: React.ElementType;
    badge?: string;
    isPremium?: boolean;
  }> = ({ title, section, icon: Icon, badge, isPremium }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full p-3 hover:bg-accent/50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="font-semibold">{title}</span>
        {isPremium && (
          <Badge className={tierInfo.color + ' text-white'}>
            {TierIcon && <TierIcon className="w-3 h-3 mr-1" />}
            {tier}
          </Badge>
        )}
        {badge && (
          <Badge variant="secondary">{badge}</Badge>
        )}
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Accuracy Analysis
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={tierInfo.color + ' text-white'}>
              {TierIcon && <TierIcon className="w-3 h-3 mr-1" />}
              {tierInfo.label}
            </Badge>
            {accuracy.analysisDepth && (
              <Badge variant="outline">
                {accuracy.analysisDepth}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* OVERVIEW - Always visible */}
        <div className="space-y-3">
          <SectionHeader
            title="Overview"
            section="overview"
            icon={Target}
          />

          <AnimatePresence>
            {expandedSections.has('overview') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-3 px-3"
              >
                {/* Overall Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Accuracy</span>
                    <span className={cn('text-2xl font-bold', getScoreColor(accuracy.adjustedOverall))}>
                      {accuracy.adjustedOverall.toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={accuracy.adjustedOverall} 
                    className="h-2"
                    indicatorClassName={getProgressColor(accuracy.adjustedOverall)}
                  />
                </div>

                {/* Core Scores Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Grammar', value: accuracy.grammar },
                    { label: 'Vocabulary', value: accuracy.vocabulary },
                    { label: 'Spelling', value: accuracy.spelling },
                    { label: 'Fluency', value: accuracy.fluency },
                    { label: 'Punctuation', value: accuracy.punctuation },
                    { label: 'Capitalization', value: accuracy.capitalization },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={cn('font-semibold', getScoreColor(value))}>
                          {value}%
                        </span>
                      </div>
                      <Progress 
                        value={value} 
                        className="h-1"
                        indicatorClassName={getProgressColor(value)}
                      />
                    </div>
                  ))}
                </div>

                {/* XP Breakdown */}
                <div className="bg-accent/30 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    XP Breakdown
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base XP:</span>
                      <span className="font-medium">+{accuracy.xpEarned}</span>
                    </div>
                    {accuracy.bonusXP && accuracy.bonusXP > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>💎 {tier} Bonus:</span>
                        <span className="font-medium">+{accuracy.bonusXP}</span>
                      </div>
                    )}
                    {accuracy.xpPenalty > 0 && (
                      <div className="flex justify-between text-red-600">
                        <span>Penalty:</span>
                        <span className="font-medium">-{accuracy.xpPenalty}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between font-bold">
                      <span>Net XP:</span>
                      <span className="text-green-600">+{accuracy.netXP}</span>
                    </div>
                    {accuracy.tierMultiplier && (
                      <div className="text-xs text-muted-foreground text-center">
                        {tier} Multiplier: {accuracy.tierMultiplier}x
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Separator />

        {/* FEEDBACK - All tiers */}
        {accuracy.feedback.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              title="Feedback"
              section="feedback"
              icon={CheckCircle}
              badge={`${accuracy.feedback.length}`}
            />

            <AnimatePresence>
              {expandedSections.has('feedback') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  {accuracy.feedback.map((feedback, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>{feedback}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ERRORS - All tiers (detailed for Pro/Premium) */}
        {accuracy.errors.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              title="Errors & Suggestions"
              section="errors"
              icon={AlertCircle}
              badge={`${accuracy.errors.length}`}
            />

            <AnimatePresence>
              {expandedSections.has('errors') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 px-3"
                >
                  {accuracy.errors.map((error, i) => (
                    <div key={i} className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-sm">{error.message}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {error.type} • {error.severity}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm space-y-2">
                        <div>
                          <span className="text-green-600 font-medium">✓ </span>
                          {error.suggestion}
                        </div>

                        {/* Pro/Premium: Detailed explanation */}
                        {features.detailedExplanations && error.explanation && (
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded">
                            <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mb-1">
                              <Info className="w-3 h-3" />
                              Explanation
                            </div>
                            <div className="text-xs">{error.explanation}</div>
                          </div>
                        )}

                        {/* Pro/Premium: Examples */}
                        {features.detailedExplanations && error.examples && error.examples.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold">Examples:</div>
                            {error.examples.map((example, j) => (
                              <div key={j} className="text-xs text-muted-foreground">• {example}</div>
                            ))}
                          </div>
                        )}

                        {/* Premium: Alternative phrasings */}
                        {features.alternativePhrasing && error.alternatives && error.alternatives.length > 0 && (
                          <div className="bg-purple-50 dark:bg-purple-950/20 p-2 rounded">
                            <div className="flex items-center gap-1 text-xs font-semibold text-purple-600 mb-1">
                              <Crown className="w-3 h-3" />
                              Premium Alternatives
                            </div>
                            <div className="space-y-1">
                              {error.alternatives.map((alt, j) => (
                                <div key={j} className="text-xs">• {alt}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PRO/PREMIUM: Tone Analysis */}
        {features.toneAnalysis && accuracy.tone && (
          <div className="space-y-3">
            <SectionHeader
              title="Tone Analysis"
              section="tone"
              icon={Star}
              isPremium={true}
            />

            <AnimatePresence>
              {expandedSections.has('tone') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                    <div className="text-sm">
                      <span className="font-semibold">Tone: </span>
                      <span className="capitalize">{accuracy.tone.overall}</span>
                      <span className="text-muted-foreground ml-2">
                        ({Math.round(accuracy.tone.confidence * 100)}% confidence)
                      </span>
                    </div>
                    {accuracy.tone.recommendations && accuracy.tone.recommendations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {accuracy.tone.recommendations.map((rec, i) => (
                          <div key={i} className="text-xs text-muted-foreground">• {rec}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PRO/PREMIUM: Readability */}
        {features.readabilityMetrics && accuracy.readability && (
          <div className="space-y-3">
            <SectionHeader
              title="Readability Metrics"
              section="readability"
              icon={BookOpen}
              isPremium={true}
            />

            <AnimatePresence>
              {expandedSections.has('readability') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-accent/30 rounded p-2">
                      <div className="text-xs text-muted-foreground">Grade Level</div>
                      <div className="font-semibold">{accuracy.readability.fleschKincaidGrade.toFixed(1)}</div>
                    </div>
                    <div className="bg-accent/30 rounded p-2">
                      <div className="text-xs text-muted-foreground">Reading Ease</div>
                      <div className="font-semibold">{accuracy.readability.fleschReadingEase.toFixed(1)}/100</div>
                    </div>
                    <div className="bg-accent/30 rounded p-2">
                      <div className="text-xs text-muted-foreground">SMOG Index</div>
                      <div className="font-semibold">{accuracy.readability.smogIndex.toFixed(1)}</div>
                    </div>
                    <div className="bg-accent/30 rounded p-2">
                      <div className="text-xs text-muted-foreground">Level</div>
                      <div className="font-semibold">{accuracy.readability.averageLevel}</div>
                    </div>
                  </div>
                  {accuracy.readability.recommendation && (
                    <div className="text-xs text-muted-foreground">{accuracy.readability.recommendation}</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PRO/PREMIUM: Vocabulary Analysis */}
        {features.vocabularyAnalysis && accuracy.vocabularyAnalysis && (
          <div className="space-y-3">
            <SectionHeader
              title="Vocabulary Analysis"
              section="vocabulary"
              icon={BookOpen}
              isPremium={true}
            />

            <AnimatePresence>
              {expandedSections.has('vocabulary') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">CEFR Level:</span>
                    <Badge>{accuracy.vocabularyAnalysis.level}</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Academic Words:</span>
                      <span>{accuracy.vocabularyAnalysis.academicWordUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Word Diversity:</span>
                      <span>{(accuracy.vocabularyAnalysis.wordDiversity * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PREMIUM: Premium Insights */}
        {features.premiumInsights && accuracy.premiumInsights && (
          <div className="space-y-3">
            <SectionHeader
              title="Premium Insights"
              section="premium"
              icon={Crown}
              isPremium={true}
            />

            <AnimatePresence>
              {expandedSections.has('premium') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 px-3"
                >
                  {/* Contextual Suggestions */}
                  {accuracy.premiumInsights.contextualSuggestions.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                      <div className="font-semibold text-sm mb-2">Contextual Suggestions</div>
                      <div className="space-y-1">
                        {accuracy.premiumInsights.contextualSuggestions.map((sug, i) => (
                          <div key={i} className="text-sm">• {sug}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Advanced Patterns */}
                  {accuracy.premiumInsights.advancedPatterns.detected.length > 0 && (
                    <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3">
                      <div className="font-semibold text-sm mb-2">Advanced Patterns Detected</div>
                      <div className="flex flex-wrap gap-1">
                        {accuracy.premiumInsights.advancedPatterns.detected.map((pattern, i) => (
                          <Badge key={i} variant="secondary">{pattern}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PRO/PREMIUM: Learning Path */}
        {features.detailedExplanations && accuracy.insights.nextSteps && accuracy.insights.nextSteps.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              title="Next Steps"
              section="nextsteps"
              icon={Target}
              isPremium={tier !== 'FREE'}
            />

            <AnimatePresence>
              {expandedSections.has('nextsteps') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  {accuracy.insights.nextSteps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <Target className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* PREMIUM: Learning Path */}
        {features.premiumInsights && accuracy.insights.learningPath && accuracy.insights.learningPath.length > 0 && (
          <div className="space-y-3">
            <SectionHeader
              title="Your Learning Path"
              section="learningpath"
              icon={Crown}
              isPremium={true}
            />

            <AnimatePresence>
              {expandedSections.has('learningpath') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-2 px-3"
                >
                  {accuracy.insights.learningPath.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm bg-purple-50 dark:bg-purple-950/20 rounded p-2">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500 text-white text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span>{step}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnterpriseAccuracyDisplay;
