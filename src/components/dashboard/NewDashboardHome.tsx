import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Brain,
  PenTool,
  Mic,
  Bot,
  Users,
  Target,
  Zap,
  Flame,
  Star,
  CheckCircle,
  Clock,
  MessageSquare,
  Award,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

import WordOfTheDay from './WordOfTheDay';
import DashboardHero from './DashboardHero';
import {
  LearningPathCard,
  QuickActionCard,
  StatsCard,
  CommunityRoomCard,
  DashboardCTACard
} from './cards';

import { getActivityStyle } from './cards/ActivityCard';
import Footer from '@/components/layout/Footer';
import NewsletterSubscription from '@/components/layout/NewsletterSubscription';


// ---------------------- //
// Interfaces
// ---------------------- //
interface LearningPath {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  color: string;
  gradient: string;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  href: string;
  badge?: string;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  time: string;
  icon: React.ElementType;
  color: string;
}


// ---------------------- //
// Component
// ---------------------- //
const NewDashboardHome = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12 ? 'Good Morning' :
      hour < 18 ? 'Good Afternoon' :
      'Good Evening'
    );
  }, []);


  // Learning Paths
  const learningPaths: LearningPath[] = [
    {
      id: 'grammar',
      title: 'Grammar Mastery',
      description: 'Master English grammar rules and structures',
      icon: BookOpen,
      progress: Math.round((31 / 48) * 100),
      totalLessons: 48,
      completedLessons: 31,
      color: 'emerald',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'vocabulary',
      title: 'Vocabulary Builder',
      description: 'Expand your word power systematically',
      icon: Brain,
      progress: Math.round((47 / 60) * 100),
      totalLessons: 60,
      completedLessons: 47,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'writing',
      title: 'Writing Excellence',
      description: 'Develop professional writing skills',
      icon: PenTool,
      progress: Math.round((15 / 36) * 100),
      totalLessons: 36,
      completedLessons: 15,
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'speaking',
      title: 'Fluent Speaking',
      description: 'Improve pronunciation and fluency',
      icon: Mic,
      progress: Math.round((22 / 40) * 100),
      totalLessons: 40,
      completedLessons: 22,
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500'
    }
  ];

  // Quick Actions
  const quickActions: QuickAction[] = [
    {
      id: 'ai-chat',
      title: 'AI Chat',
      description: 'Practice with AI tutor',
      icon: Bot,
      color: 'from-primary to-accent',
      href: '/dashboard/ai-chat',
      badge: 'New'
    },
    {
      id: 'practice-room',
      title: 'Join Room',
      description: 'Practice with others',
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      href: '/dashboard/rooms',
      badge: 'Live'
    },
    {
      id: 'daily-challenge',
      title: 'Daily Challenge',
      description: "Complete today's task",
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      href: '/dashboard/challenges'
    },
    {
      id: 'focus-mode',
      title: 'Focus Mode',
      description: 'Distraction-free learning',
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      href: '/dashboard/focus'
    }
  ];

  // Recent Activities
  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'Completed Grammar Lesson: Past Perfect Tense',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'emerald'
    },
    {
      id: '2',
      type: 'practice',
      title: 'AI Conversation Practice Session',
      time: '5 hours ago',
      icon: MessageSquare,
      color: 'blue'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Earned "Vocabulary Master" Badge',
      time: '1 day ago',
      icon: Award,
      color: 'purple'
    },
    {
      id: '4',
      type: 'room',
      title: 'Joined "Business English" Practice Room',
      time: '2 days ago',
      icon: Users,
      color: 'orange'
    }
  ];

  // Practice Rooms
  const practiceRooms = [
    { name: 'Business English Hub', members: 12, level: 'Intermediate', status: 'live' as const },
    { name: 'Pronunciation Practice', members: 8, level: 'All Levels', status: 'live' as const },
    { name: 'Grammar Discussion', members: 15, level: 'Advanced', status: 'scheduled' as const }
  ];

  // Stats
  const stats = [
    { label: 'Current Streak', value: '12', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Total XP', value: '3,450', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Lessons Completed', value: '127', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Study Time', value: '48h', icon: Clock, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' }
  ];


  // ---------------------- //
  // Render
  // ---------------------- //
  return (
    <div className="min-h-screen w-full max-w-full p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-x-hidden">
      
      {/* HERO */}
      <DashboardHero user={user} greeting={greeting} stats={stats} />

      {/* Wrap the rest of the page in overflow-x-hidden to avoid horizontal scroll
          while allowing the HERO to overflow for decorative elements */}
      <div className="w-full max-w-full overflow-x-hidden">

      {/* QUICK ACTIONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Quick Actions
          </h2>
          <div className="flex items-center gap-2 text-emerald-600">
            <Zap className="h-5 w-5" />
            <span className="text-sm font-medium">Choose your path</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.id}
              action={action}
              index={index}
              onActionClick={(id) => console.log('Navigate:', id)}
            />
          ))}
        </div>
      </motion.div>

      {/* WORD OF THE DAY */}
      <WordOfTheDay />

      {/* LEARNING PATHS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Your Learning Paths</h2>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-emerald-200 text-emerald-700"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {learningPaths.map((path, index) => (
            <LearningPathCard
              key={path.id}
              path={path}
              index={index}
              onContinue={(id) => console.log('Continue:', id)}
            />
          ))}
        </div>
      </motion.div>

      {/* RECENT ACTIVITY + PRACTICE ROOMS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

        {/* LEFT — RECENT ACTIVITY */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }} className="mt-6 xl:mt-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Recent Activity
                </h2>
                <p className="text-sm text-emerald-600">Your latest learning achievements</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-emerald-200 text-emerald-700"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const style = getActivityStyle(activity.type);

              return (
                <motion.div key={activity.id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 + index * 0.1 }}>
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-emerald-200">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg", style.iconBg)}>
                      <activity.icon className="h-5 w-5 text-white" />
                    </div>

                    <div className="flex-1">
                      <h4 className={cn("text-sm font-semibold mb-1", style.textColor)}>
                        {activity.title}
                      </h4>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("text-xs px-3 py-1 rounded-full border", style.bgColor, style.textColor)}>
                          {activity.type}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-emerald-100/60 text-emerald-700 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* RIGHT — PRACTICE ROOMS */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Practice Rooms
                </h2>
                <p className="text-sm text-purple-600">Join live practice sessions</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-purple-200 text-purple-700"
            >
              Browse All
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>

          <CommunityRoomCard rooms={practiceRooms} />
        </motion.div>
      </div>

      {/* CTA */}
      <DashboardCTACard
        onGetStarted={() => console.log('Get Started')}
        onExploreFeatures={() => console.log('Explore Features')}
        onStartPractice={() => console.log('Start Practice')}
      />

      {/* NEWSLETTER */}
      <NewsletterSubscription variant="dashboard" />

      </div>

      {/* FOOTER */}
      <Footer variant="dashboard" showNewsletter={false} />

    </div>
  );
};

export default NewDashboardHome;
