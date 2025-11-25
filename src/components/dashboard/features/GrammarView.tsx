import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Target,
  Sparkles,
  FileText,
  Headphones
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTime: string;
  locked: boolean;
}

const GrammarView = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const grammarTopics: GrammarTopic[] = [
    {
      id: 'tenses',
      title: 'Verb Tenses Mastery',
      description: 'Master all 12 English tenses with practical examples',
      difficulty: 'Intermediate',
      progress: 75,
      totalLessons: 24,
      completedLessons: 18,
      estimatedTime: '3 weeks',
      locked: false
    },
    {
      id: 'conditionals',
      title: 'Conditional Sentences',
      description: 'Learn zero, first, second, third, and mixed conditionals',
      difficulty: 'Intermediate',
      progress: 45,
      totalLessons: 12,
      completedLessons: 5,
      estimatedTime: '2 weeks',
      locked: false
    },
    {
      id: 'passive',
      title: 'Passive Voice',
      description: 'Understanding and using passive constructions',
      difficulty: 'Intermediate',
      progress: 60,
      totalLessons: 10,
      completedLessons: 6,
      estimatedTime: '1 week',
      locked: false
    },
    {
      id: 'articles',
      title: 'Articles (A, An, The)',
      description: 'Master the correct use of definite and indefinite articles',
      difficulty: 'Beginner',
      progress: 90,
      totalLessons: 8,
      completedLessons: 7,
      estimatedTime: '1 week',
      locked: false
    },
    {
      id: 'modals',
      title: 'Modal Verbs',
      description: 'Can, could, may, might, must, should, and more',
      difficulty: 'Intermediate',
      progress: 30,
      totalLessons: 15,
      completedLessons: 4,
      estimatedTime: '2 weeks',
      locked: false
    },
    {
      id: 'reported-speech',
      title: 'Reported Speech',
      description: 'Transform direct speech into indirect speech',
      difficulty: 'Advanced',
      progress: 0,
      totalLessons: 10,
      completedLessons: 0,
      estimatedTime: '2 weeks',
      locked: true
    },
    {
      id: 'phrasal-verbs',
      title: 'Phrasal Verbs',
      description: 'Common phrasal verbs used in everyday English',
      difficulty: 'Intermediate',
      progress: 55,
      totalLessons: 20,
      completedLessons: 11,
      estimatedTime: '3 weeks',
      locked: false
    },
    {
      id: 'subjunctive',
      title: 'Subjunctive Mood',
      description: 'Advanced grammar for wishes, suggestions, and hypotheticals',
      difficulty: 'Advanced',
      progress: 0,
      totalLessons: 8,
      completedLessons: 0,
      estimatedTime: '1 week',
      locked: true
    }
  ];

  const recentLessons = [
    { title: 'Present Perfect vs. Simple Past', completed: true, score: 92 },
    { title: 'Past Perfect Continuous', completed: true, score: 88 },
    { title: 'Future Perfect Tense', completed: false, score: null }
  ];

  const achievements = [
    { title: 'Grammar Novice', icon: Star, unlocked: true, description: 'Complete 10 grammar lessons' },
    { title: 'Tense Master', icon: Award, unlocked: true, description: 'Master all verb tenses' },
    { title: 'Grammar Expert', icon: Sparkles, unlocked: false, description: 'Complete all grammar topics' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Intermediate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Grammar Mastery</h1>
                    <p className="text-lg text-white/90">Build a strong foundation in English grammar</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-3xl font-bold text-white">54%</div>
                  <p className="text-sm text-white/80">Overall Progress</p>
                </div>
                <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-3xl font-bold text-white">51</div>
                  <p className="text-sm text-white/80">Lessons Done</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats & Recent Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Lessons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Lessons
              </CardTitle>
              <CardDescription>Continue where you left off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLessons.map((lesson, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-full',
                      lesson.completed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
                    )}>
                      {lesson.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      {lesson.completed && lesson.score && (
                        <p className="text-sm text-muted-foreground">Score: {lesson.score}%</p>
                      )}
                    </div>
                  </div>
                  <Button variant={lesson.completed ? 'outline' : 'default'}>
                    {lesson.completed ? 'Review' : 'Continue'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Achievements
              </CardTitle>
              <CardDescription>Your grammar milestones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    achievement.unlocked ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30 opacity-60'
                  )}
                >
                  <div className={cn(
                    'p-2 rounded-full',
                    achievement.unlocked ? 'bg-primary/10' : 'bg-muted'
                  )}>
                    <achievement.icon className={cn(
                      'h-5 w-5',
                      achievement.unlocked ? 'text-primary' : 'text-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grammar Topics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grammar Topics</CardTitle>
                <CardDescription>Choose a topic to start learning</CardDescription>
              </div>
              <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Beginner">Beginner</TabsTrigger>
                  <TabsTrigger value="Intermediate">Intermediate</TabsTrigger>
                  <TabsTrigger value="Advanced">Advanced</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {grammarTopics
                .filter(topic => selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty)
                .map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className={cn(
                      'group hover:shadow-lg transition-all',
                      topic.locked && 'opacity-60'
                    )}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500">
                              <BookOpen className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{topic.title}</CardTitle>
                              {topic.locked && (
                                <Badge variant="secondary" className="mt-1">
                                  Locked
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getDifficultyColor(topic.difficulty)}>
                            {topic.difficulty}
                          </Badge>
                        </div>
                        <CardDescription>{topic.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {topic.completedLessons}/{topic.totalLessons} Lessons
                          </span>
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {topic.estimatedTime}
                          </span>
                        </div>
                        {!topic.locked && (
                          <>
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Progress</span>
                                <span className="text-sm font-bold text-primary">{topic.progress}%</span>
                              </div>
                              <Progress value={topic.progress} className="h-2" />
                            </div>
                            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                              <Play className="mr-2 h-4 w-4" />
                              {topic.progress > 0 ? 'Continue' : 'Start'} Learning
                            </Button>
                          </>
                        )}
                        {topic.locked && (
                          <Button variant="outline" className="w-full" disabled>
                            Complete previous topics to unlock
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Practice Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Daily Practice</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Complete daily grammar exercises to build consistency
            </p>
            <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white">
              Start Practice
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Grammar Tests</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take comprehensive tests to assess your knowledge
            </p>
            <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white">
              Take Test
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-primary/20">
          <CardContent className="p-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4">
              <Headphones className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Audio Lessons</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Listen to grammar explanations and examples
            </p>
            <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-white">
              Listen Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default GrammarView;
