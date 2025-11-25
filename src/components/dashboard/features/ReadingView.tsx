import { motion } from 'framer-motion';
import { FileText, BookOpen, Clock, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ReadingView = () => {
  const stats = [
    { label: 'Articles Read', value: '45', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Reading Time', value: '12h', icon: Clock, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Comprehension', value: '89%', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Reading Comprehension</h1>
                <p className="text-lg text-white/90">Improve reading skills with diverse content</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
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
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reading Library</CardTitle>
          <CardDescription>Articles, stories, and comprehension exercises</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <BookOpen className="mr-2 h-4 w-4" />
            Browse Articles
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingView;
