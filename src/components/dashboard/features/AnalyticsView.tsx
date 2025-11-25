import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, LineChart, PieChart, Award, Target, Zap, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const AnalyticsView = () => {
  const stats = [
    { label: 'Total XP', value: '2,450', icon: Zap, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Accuracy', value: '87%', icon: Target, color: 'text-green-500', bgColor: 'bg-green-100 dark:bg-green-900/20' },
    { label: 'Lessons Done', value: '128', icon: CheckCircle, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Streak', value: '12 days', icon: TrendingUp, color: 'text-red-500', bgColor: 'bg-red-100 dark:bg-red-900/20' },
  ];

  const skillProgress = [
    { name: 'Grammar', progress: 75, target: 100 },
    { name: 'Vocabulary', progress: 82, target: 100 },
    { name: 'Pronunciation', progress: 68, target: 100 },
    { name: 'Listening', progress: 90, target: 100 },
    { name: 'Speaking', progress: 65, target: 100 },
  ];

  const weeklyActivity = [
    { day: 'Mon', sessions: 3, xp: 180 },
    { day: 'Tue', sessions: 2, xp: 120 },
    { day: 'Wed', sessions: 4, xp: 240 },
    { day: 'Thu', sessions: 3, xp: 180 },
    { day: 'Fri', sessions: 5, xp: 300 },
    { day: 'Sat', sessions: 2, xp: 120 },
    { day: 'Sun', sessions: 1, xp: 60 },
  ];

  const learningPaths = [
    { name: 'English Fundamentals', completion: 65, lessons: 45, nextLesson: 'Present Continuous' },
    { name: 'Advanced Grammar', completion: 42, lessons: 30, nextLesson: 'Conditional Sentences' },
    { name: 'Business English', completion: 28, lessons: 20, nextLesson: 'Email Communication' },
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Analytics</h1>
            <p className="text-slate-600 dark:text-slate-400">Track your learning progress and achievements</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={cn('p-3 rounded-full', stat.bgColor)}>
                    <stat.icon className={cn('h-6 w-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="skills">Skill Progress</TabsTrigger>
          <TabsTrigger value="activity">Weekly Activity</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
        </TabsList>

        {/* Skills Progress */}
        <TabsContent value="skills" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Skill Progress</CardTitle>
                <CardDescription>Your progress across different skills</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {skillProgress.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 dark:text-white">{skill.name}</span>
                        <Badge variant="secondary">{skill.progress}%</Badge>
                      </div>
                      <Progress value={skill.progress} className="h-3" />
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Weekly Activity */}
        <TabsContent value="activity" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your learning activity this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                  {weeklyActivity.map((day, index) => (
                    <motion.div
                      key={day.day}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.4 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{day.day}</span>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-8 flex items-center justify-center">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{day.sessions}</span>
                      </div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">+{day.xp}XP</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Learning Paths */}
        <TabsContent value="paths" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {learningPaths.map((path, index) => (
              <Card key={path.name} className="hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{path.name}</h3>
                        <p className="text-sm text-muted-foreground">{path.lessons} lessons total</p>
                      </div>
                      <Badge variant="outline">{path.completion}%</Badge>
                    </div>
                    <Progress value={path.completion} className="h-3" />
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Next: <span className="font-medium">{path.nextLesson}</span>
                      </span>
                      <Button size="sm" variant="outline">
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Badges you've earned</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[
                { icon: '🔥', name: 'Streak Master', earned: true },
                { icon: '⭐', name: 'Perfect Score', earned: true },
                { icon: '🎯', name: 'Accuracy Guru', earned: true },
                { icon: '🚀', name: 'Speed Demon', earned: false },
                { icon: '📚', name: 'Bookworm', earned: true },
                { icon: '🏆', name: 'Champion', earned: false },
                { icon: '🌟', name: 'Rising Star', earned: true },
                { icon: '💪', name: 'Persistence', earned: false },
              ].map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
                    achievement.earned
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-50'
                  )}
                >
                  <div className="text-3xl">{achievement.icon}</div>
                  <span className="text-xs font-medium text-center text-slate-700 dark:text-slate-300">
                    {achievement.name}
                  </span>
                  {achievement.earned && (
                    <Badge className="mt-1 text-xs">
                      Earned
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AnalyticsView;
