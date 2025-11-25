/**
 * 📊 REAL-TIME ACCURACY ANALYTICS DASHBOARD
 * 
 * Displays comprehensive accuracy data from categoryOverall with real-time updates.
 * 
 * Features:
 * - Auto-refresh every 5 seconds when active
 * - Visual progress bars for all subcategories
 * - Calculation metadata (count, last updated)
 * - Smooth animations and transitions
 * - Loading states and error handling
 * - Responsive grid layout
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  Target,
  Sparkles,
  Brain,
  BookOpen,
  MessageSquare,
  Award,
  Zap,
  Activity,
  RefreshCw
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// ========================================
// TYPE DEFINITIONS
// ========================================

interface AccuracyData {
  overall: number;
  grammar: number;
  vocabulary: number;
  spelling: number;
  fluency: number;
  punctuation: number;
  capitalization: number;
  syntax: number;
  coherence: number;
  calculationCount: number;
  lastCalculated: string | null;
}

interface DashboardResponse {
  success: boolean;
  source: 'cache' | 'database';
  data: {
    overview: {
      totalXP: number;
      currentLevel: number;
      currentStreak: number;
      longestStreak: number;
      totalSessions: number;
      totalHours: number;
    };
    accuracy: AccuracyData;
    todayProgress: {
      minutes: number;
      minutesGoal: number;
      messages: number;
      messagesGoal: number;
      goalMet: boolean;
      percentComplete: number;
    };
    streakStats: {
      current: number;
      longest: number;
      totalActiveDays: number;
      averageMinutesPerDay: number;
    };
  };
}

interface RealtimeProgressResponse {
  streak: { current: number };
  accuracy: {
    overall: number;
    grammar?: number;
    vocabulary?: number;
    spelling?: number;
    fluency?: number;
    punctuation?: number;
    capitalization?: number;
    syntax?: number;
    coherence?: number;
    messageCount?: number;
    lastUpdated: string;
    source: 'fast-cache' | 'optimized-cache' | 'progress-cache' | 'database' | 'none';
  };
  xp: {
    total: number;
    currentLevel: number;
    prestigeLevel: number;
  };
  stats: {
    totalMessages: number;
    totalMinutes: number;
  };
}

// ========================================
// CATEGORY CONFIGURATION
// ========================================

const CATEGORY_CONFIG = [
  {
    key: 'grammar',
    label: 'Grammar',
    icon: BookOpen,
    color: 'blue',
    description: 'Sentence structure and rules'
  },
  {
    key: 'vocabulary',
    label: 'Vocabulary',
    icon: Brain,
    color: 'purple',
    description: 'Word choice and usage'
  },
  {
    key: 'spelling',
    label: 'Spelling',
    icon: CheckCircle2,
    color: 'green',
    description: 'Correct word spelling'
  },
  {
    key: 'fluency',
    label: 'Fluency',
    icon: MessageSquare,
    color: 'orange',
    description: 'Natural expression'
  },
  {
    key: 'punctuation',
    label: 'Punctuation',
    icon: Target,
    color: 'pink',
    description: 'Correct punctuation use'
  },
  {
    key: 'capitalization',
    label: 'Capitalization',
    icon: Sparkles,
    color: 'cyan',
    description: 'Proper capitalization'
  },
  {
    key: 'syntax',
    label: 'Syntax',
    icon: Award,
    color: 'indigo',
    description: 'Word order and structure'
  },
  {
    key: 'coherence',
    label: 'Coherence',
    icon: Zap,
    color: 'amber',
    description: 'Logical flow and clarity'
  }
] as const;

// ========================================
// API FUNCTIONS
// ========================================

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchDashboardData(): Promise<DashboardResponse> {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/progress/dashboard`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }

  return response.json();
}

async function fetchRealtimeProgress(): Promise<RealtimeProgressResponse> {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/progress/realtime`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch realtime progress');
  }

  return response.json();
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function getScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600 dark:text-green-400';
  if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
  if (score >= 50) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

function getProgressColor(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 50) return 'bg-orange-500';
  return 'bg-red-500';
}

function formatTimestamp(timestamp: string | null): string {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

// ========================================
// COMPONENT
// ========================================

export function RealtimeAccuracyDashboard() {
  const [isRealtime, setIsRealtime] = useState(true);

  // Dashboard data (slower updates, more comprehensive)
  const {
    data: dashboardData,
    isLoading: isDashboardLoading,
    error: dashboardError,
    refetch: refetchDashboard
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
    staleTime: 30000, // 30 seconds
    refetchInterval: isRealtime ? 30000 : false, // Auto-refresh every 30s
    refetchOnWindowFocus: true,
  });

  // Realtime progress (faster updates, lightweight)
  const {
    data: realtimeData,
    isLoading: isRealtimeLoading,
    error: realtimeError,
    refetch: refetchRealtime
  } = useQuery({
    queryKey: ['realtime-progress'],
    queryFn: fetchRealtimeProgress,
    staleTime: 5000, // 5 seconds
    refetchInterval: isRealtime ? 5000 : false, // Auto-refresh every 5s
    refetchOnWindowFocus: true,
  });

  const accuracy = dashboardData?.data.accuracy;
  const realtimeAccuracy = realtimeData?.accuracy;
  const isLoading = isDashboardLoading || isRealtimeLoading;
  const hasError = dashboardError || realtimeError;

  // Use realtime data if available, otherwise fall back to dashboard data
  const displayData = realtimeAccuracy || accuracy;

  if (hasError) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <Activity className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <p>Failed to load accuracy data</p>
          <button
            onClick={() => {
              refetchDashboard();
              refetchRealtime();
            }}
            className="mt-4 text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
  <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/20">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Real-Time Accuracy Analytics</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Activity className={cn(
                    "h-4 w-4",
                    isRealtime ? "text-green-500 animate-pulse" : "text-gray-400"
                  )} />
                  {isRealtime ? 'Live updates enabled' : 'Updates paused'}
                  {displayData && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span>
                        {accuracy?.calculationCount || realtimeAccuracy?.messageCount || 0} messages analyzed
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(accuracy?.lastCalculated || realtimeAccuracy?.lastUpdated || null)}</span>
                    </>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {realtimeData?.accuracy.source && (
                <Badge variant="outline" className="text-xs">
                  {realtimeData.accuracy.source}
                </Badge>
              )}
              <button
                onClick={() => setIsRealtime(!isRealtime)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isRealtime ? "bg-green-500/20 text-green-600" : "bg-gray-500/20 text-gray-600"
                )}
                title={isRealtime ? "Pause updates" : "Resume updates"}
              >
                <RefreshCw className={cn("h-5 w-5", isRealtime && "animate-spin")} />
              </button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Overall Score Card */}
      {isLoading ? (
        <Card className="p-6">
          <Skeleton className="h-32 w-full" />
        </Card>
      ) : displayData ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-950">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Overall Accuracy</h2>
              </div>
              <motion.div
                key={displayData.overall}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className={cn(
                  "text-7xl font-bold",
                  getScoreColor(displayData.overall)
                )}
              >
                {Math.round(displayData.overall)}%
              </motion.div>
              <Progress 
                value={displayData.overall} 
                className="h-3"
              />
              <p className="text-muted-foreground text-sm">
                Rolling average across all categories
              </p>
            </div>
          </Card>
        </motion.div>
      ) : null}

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {CATEGORY_CONFIG.map((category, index) => {
          const score = displayData?.[category.key as keyof typeof displayData] as number || 0;
          const Icon = category.icon;

          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="p-5 hover:shadow-lg transition-shadow border-primary/10 hover:border-primary/30">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/30`}>
                          <Icon className={`h-4 w-4 text-${category.color}-600 dark:text-${category.color}-400`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{category.label}</h3>
                          <p className="text-xs text-muted-foreground">{category.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <motion.span
                          key={score}
                          initial={{ scale: 1.2 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "text-2xl font-bold",
                            getScoreColor(score)
                          )}
                        >
                          {Math.round(score)}%
                        </motion.span>
                        {score >= 90 && (
                          <Badge variant="default" className="bg-green-500">
                            Excellent
                          </Badge>
                        )}
                      </div>

                      <div className="relative">
                        <Progress value={score} className="h-2" />
                        <div
                          className={cn(
                            "absolute top-0 left-0 h-2 rounded-full transition-all duration-500",
                            getProgressColor(score)
                          )}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Stats */}
      {dashboardData?.data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Today's Progress</p>
                <p className="text-2xl font-bold">
                  {dashboardData.data.todayProgress.messages}/{dashboardData.data.todayProgress.messagesGoal}
                </p>
                <Progress 
                  value={(dashboardData.data.todayProgress.messages / dashboardData.data.todayProgress.messagesGoal) * 100} 
                  className="mt-2 h-1"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">
                  {dashboardData.data.streakStats.current} days
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Longest: {dashboardData.data.streakStats.longest} days
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Practice Time</p>
                <p className="text-2xl font-bold">
                  {dashboardData.data.todayProgress.minutes} min
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Goal: {dashboardData.data.todayProgress.minutesGoal} min
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

export default RealtimeAccuracyDashboard;
