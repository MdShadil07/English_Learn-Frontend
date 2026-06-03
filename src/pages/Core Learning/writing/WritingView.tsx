import { useState } from 'react';
import { motion } from 'framer-motion';
import { PenTool, FileText, CheckCircle, Clock, Star, TrendingUp, Award, Plus, Sparkles, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const WritingView = () => {
  const [activeTab, setActiveTab] = useState('prompts');

  const stats = [
    { label: 'Total Writings', value: '24', icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Avg. Score', value: '87%', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Words Written', value: '8.2K', icon: TrendingUp, color: 'text-emerald-500', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
    { label: 'Streak', value: '9 days', icon: Award, color: 'text-orange-500', bgColor: 'bg-orange-100 dark:bg-orange-900/20' }
  ];

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Writing Excellence</h1>
                <p className="text-lg text-white/90">Develop your writing skills with guided practice</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={stat.label} className="hover:shadow-lg transition-shadow">
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
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Writing Features Coming Soon</CardTitle>
          <CardDescription>Essay writing, creative writing, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Start Writing
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WritingView;
