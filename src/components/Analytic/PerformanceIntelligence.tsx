import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Star,
  Zap,
  Clock,
  Target,
  Lock,
  Crown,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Insight {
  type: 'strength' | 'weakness' | 'recommendation' | 'prediction' | 'milestone';
  title: string;
  description: string;
  metric?: string;
  icon: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  isPremium?: boolean;
}

interface PerformanceIntelligenceProps {
  strengths: Array<{
    category: string;
    score: number;
    improvement: number;
    momentum: string;
  }>;
  weaknesses: Array<{
    category: string;
    score: number;
    decline: number;
    recommendation: string;
  }>;
  learningVelocity: {
    current: number;
    trend: 'up' | 'down' | 'stable';
    comparison: string;
  };
  predictedLevelUp?: {
    date: string;
    daysRemaining: number;
    confidence: number;
  };
  optimalPracticeTimes?: string[];
  tier: 'free' | 'pro' | 'premium';
  onUpgrade?: () => void;
}

export const PerformanceIntelligence: React.FC<PerformanceIntelligenceProps> = ({
  strengths,
  weaknesses,
  learningVelocity,
  predictedLevelUp,
  optimalPracticeTimes,
  tier,
  onUpgrade,
}) => {
  const isPremium = tier === 'premium';
  const isPro = tier === 'pro' || isPremium;

  const insights: Insight[] = [
    // Strengths
    ...strengths.slice(0, 2).map((s) => ({
      type: 'strength' as const,
      title: `${s.category} Mastery`,
      description: `Outstanding ${s.score}% accuracy with ${s.improvement > 0 ? '+' : ''}${s.improvement}% improvement`,
      metric: s.momentum,
      icon: <Star className="h-5 w-5" />,
      priority: 'high' as const,
    })),
    // Weaknesses
    ...weaknesses.slice(0, 2).map((w) => ({
      type: 'weakness' as const,
      title: `${w.category} Needs Work`,
      description: w.recommendation,
      metric: `${w.score}% accuracy`,
      icon: <AlertCircle className="h-5 w-5" />,
      priority: 'medium' as const,
    })),
    // Learning Velocity
    {
      type: 'recommendation' as const,
      title: 'Learning Velocity',
      description: learningVelocity.comparison,
      metric: `${learningVelocity.current}% faster`,
      icon: learningVelocity.trend === 'up' ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />,
      priority: 'high' as const,
    },
  ];

  // Premium-only insights
  if (isPremium && predictedLevelUp) {
    insights.push({
      type: 'prediction' as const,
      title: 'Level-Up Prediction',
      description: `Expected on ${predictedLevelUp.date}`,
      metric: `${predictedLevelUp.daysRemaining} days`,
      icon: <Sparkles className="h-5 w-5" />,
      priority: 'high' as const,
      isPremium: true,
    });
  }

  // Pro feature
  if (isPro && optimalPracticeTimes) {
    insights.push({
      type: 'recommendation' as const,
      title: 'Optimal Practice Times',
      description: optimalPracticeTimes.join(', '),
      metric: 'Peak performance',
      icon: <Clock className="h-5 w-5" />,
      priority: 'medium' as const,
      isPremium: true,
    });
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'from-rose-500 to-red-600';
      case 'medium':
        return 'from-amber-500 to-orange-600';
      case 'low':
        return 'from-emerald-500 to-teal-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength':
        return 'bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 border-emerald-200/50 dark:border-emerald-700/50';
      case 'weakness':
        return 'bg-gradient-to-br from-rose-50/90 via-red-50/90 to-orange-50/90 dark:from-rose-900/30 dark:via-red-900/30 dark:to-orange-900/30 border-rose-200/50 dark:border-rose-700/50';
      case 'recommendation':
        return 'bg-gradient-to-br from-blue-50/90 via-cyan-50/90 to-sky-50/90 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-sky-900/30 border-blue-200/50 dark:border-blue-700/50';
      case 'prediction':
        return 'bg-gradient-to-br from-purple-50/90 via-fuchsia-50/90 to-pink-50/90 dark:from-purple-900/30 dark:via-fuchsia-900/30 dark:to-pink-900/30 border-purple-200/50 dark:border-purple-700/50';
      default:
        return 'bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 border-emerald-200/30 dark:border-emerald-700/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              AI Performance Intelligence
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Personalized insights powered by advanced analytics
            </p>
          </div>
        </div>
        {!isPremium && (
          <Button
            onClick={onUpgrade}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all"
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade
          </Button>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="group cursor-pointer"
          >
            <div className={cn(
              "relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-xl hover:shadow-2xl transition-all duration-500 h-full",
              getTypeColor(insight.type)
            )}>
              {/* Background decorative elements */}
              <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

              <div className="relative p-6">
                <div className="flex items-start justify-between mb-3">
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300",
                      getPriorityColor(insight.priority)
                    )}
                    whileHover={{
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <div className="text-white">
                      {insight.icon}
                    </div>
                  </motion.div>
                  {insight.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                  {insight.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  {insight.description}
                </p>

                {insight.metric && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <Zap className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      {insight.metric}
                    </span>
                  </div>
                )}

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 -z-10"></div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Locked Premium Features */}
        {!isPremium && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: insights.length * 0.1,
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{
                y: -8,
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-rose-50/90 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-rose-900/20 backdrop-blur-xl border border-amber-200/50 dark:border-amber-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                {/* Background decorative elements */}
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-amber-300/20 to-orange-300/20 dark:from-amber-700/20 dark:to-orange-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-rose-300/20 to-amber-300/20 dark:from-rose-700/20 dark:to-amber-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

                <div className="relative p-6 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
                  <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Lock className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                    Unlock More Insights
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    Get AI-powered predictions and personalized recommendations
                  </p>
                  <Button
                    onClick={onUpgrade}
                    size="sm"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Premium
                  </Button>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400/0 via-orange-400/0 to-rose-400/0 group-hover:from-amber-400/10 group-hover:via-orange-400/10 group-hover:to-rose-400/10 transition-all duration-500 -z-10"></div>
                </div>
              </div>
            </motion.div>

            {!isPro && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: (insights.length + 1) * 0.1,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 backdrop-blur-xl border border-blue-200/50 dark:border-blue-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Background decorative elements */}
                  <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-blue-300/20 to-purple-300/20 dark:from-blue-700/20 dark:to-purple-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                  <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/20 to-blue-300/20 dark:from-purple-700/20 dark:to-blue-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

                  <div className="relative p-6 flex flex-col items-center justify-center text-center h-full min-h-[240px]">
                    <motion.div
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    >
                      <Clock className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-2">
                      Optimal Practice Times
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      Discover your peak learning hours
                    </p>
                    <Button
                      onClick={onUpgrade}
                      size="sm"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-blue-400/10 group-hover:via-indigo-400/10 group-hover:to-purple-400/10 transition-all duration-500 -z-10"></div>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PerformanceIntelligence;
