import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Play,
  Star,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Volume2,
  BookMarked,
  Sparkles,
  CheckCircle,
  Search,
  Filter,
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface VocabularySet {
  id: string;
  title: string;
  description: string;
  category: string;
  totalWords: number;
  learnedWords: number;
  progress: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: any;
  gradient: string;
}

interface Word {
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  pronunciation: string;
  difficulty: string;
}

const VocabularyView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('sets');

  const vocabularySets: VocabularySet[] = [
    {
      id: 'business',
      title: 'Business English',
      description: 'Professional vocabulary for workplace success',
      category: 'Professional',
      totalWords: 500,
      learnedWords: 380,
      progress: 76,
      difficulty: 'Intermediate',
      icon: Brain,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'academic',
      title: 'Academic Vocabulary',
      description: 'Essential words for academic writing and reading',
      category: 'Academic',
      totalWords: 600,
      learnedWords: 420,
      progress: 70,
      difficulty: 'Advanced',
      icon: BookMarked,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      id: 'daily',
      title: 'Daily Conversation',
      description: 'Common words used in everyday situations',
      category: 'General',
      totalWords: 400,
      learnedWords: 350,
      progress: 88,
      difficulty: 'Beginner',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'idioms',
      title: 'Idioms & Phrases',
      description: 'Popular idioms and expressions',
      category: 'Expressions',
      totalWords: 300,
      learnedWords: 180,
      progress: 60,
      difficulty: 'Intermediate',
      icon: Star,
      gradient: 'from-orange-500 to-amber-500'
    },
    {
      id: 'tech',
      title: 'Technology Terms',
      description: 'Modern tech and digital vocabulary',
      category: 'Professional',
      totalWords: 350,
      learnedWords: 200,
      progress: 57,
      difficulty: 'Intermediate',
      icon: Sparkles,
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      id: 'travel',
      title: 'Travel & Tourism',
      description: 'Vocabulary for travelers and hospitality',
      category: 'General',
      totalWords: 250,
      learnedWords: 150,
      progress: 60,
      difficulty: 'Beginner',
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const recentWords: Word[] = [
    {
      word: 'Eloquent',
      partOfSpeech: 'Adjective',
      definition: 'Fluent or persuasive in speaking or writing',
      example: 'Her eloquent speech moved the entire audience.',
      pronunciation: '/ˈeləkwənt/',
      difficulty: 'Advanced'
    },
    {
      word: 'Pragmatic',
      partOfSpeech: 'Adjective',
      definition: 'Dealing with things sensibly and realistically',
      example: 'We need a pragmatic approach to solve this problem.',
      pronunciation: '/præɡˈmætɪk/',
      difficulty: 'Intermediate'
    },
    {
      word: 'Meticulous',
      partOfSpeech: 'Adjective',
      definition: 'Showing great attention to detail; very careful',
      example: 'She is meticulous about her work.',
      pronunciation: '/məˈtɪkjələs/',
      difficulty: 'Advanced'
    }
  ];

  const stats = [
    { label: 'Total Words Learned', value: '1,680', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Words This Week', value: '45', icon: TrendingUp, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Daily Streak', value: '12', icon: Award, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
    { label: 'Retention Rate', value: '92%', icon: BarChart, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' }
  ];

  const learningMethods = [
    {
      title: 'Flashcards',
      description: 'Spaced repetition learning',
      icon: BookMarked,
      color: 'from-emerald-500 to-teal-500',
      words: 120
    },
    {
      title: 'Word Games',
      description: 'Fun vocabulary challenges',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      words: 85
    },
    {
      title: 'Context Reading',
      description: 'Learn words in sentences',
      icon: Brain,
      color: 'from-blue-500 to-cyan-500',
      words: 95
    }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">Vocabulary Builder</h1>
                    <p className="text-lg text-white/90">Expand your word power systematically</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-3xl font-bold text-white">1,680</div>
                  <p className="text-sm text-white/80">Words Learned</p>
                </div>
                <div className="text-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="text-3xl font-bold text-white">92%</div>
                  <p className="text-sm text-white/80">Retention</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
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
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="sets">Vocabulary Sets</TabsTrigger>
              <TabsTrigger value="review">Review Words</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search words..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <TabsContent value="sets" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vocabularySets.map((set, index) => (
                <motion.div
                  key={set.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className={cn('w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center', set.gradient)}>
                          <set.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="outline" className="bg-background">
                          {set.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{set.title}</CardTitle>
                      <CardDescription>{set.description}</CardDescription>
                      <Badge variant="secondary" className="w-fit mt-2">{set.category}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {set.learnedWords}/{set.totalWords} words
                        </span>
                        <span className="font-bold text-primary">{set.progress}%</span>
                      </div>
                      <Progress value={set.progress} className="h-2" />
                      <Button className={cn('w-full bg-gradient-to-r text-white', set.gradient)}>
                        <Play className="mr-2 h-4 w-4" />
                        {set.progress > 0 ? 'Continue' : 'Start'} Learning
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Words to Review</CardTitle>
                <CardDescription>Review these words to strengthen your memory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentWords.map((word, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-2xl font-bold text-primary">{word.word}</h3>
                        <Badge variant="outline">{word.partOfSpeech}</Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                        {word.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mb-2">{word.definition}</p>
                    <div className="p-3 bg-muted/50 rounded text-sm italic mb-2">
                      "{word.example}"
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Pronunciation:</span> {word.pronunciation}
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Star className="mr-1 h-3 w-3" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Mark as Learned
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Load More Words
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learningMethods.map((method, index) => (
                <motion.div
                  key={method.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all cursor-pointer border-2 border-transparent hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className={cn('w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform', method.color)}>
                        <method.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-muted-foreground">{method.words} words ready</span>
                      </div>
                      <Button className="w-full group-hover:bg-primary group-hover:text-white">
                        Start Practice
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default VocabularyView;
