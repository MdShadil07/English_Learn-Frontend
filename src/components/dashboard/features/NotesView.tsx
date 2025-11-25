import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote, Plus, Search, Edit, Trash2, Star, Tag, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const NotesView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const notes = [
    { id: '1', title: 'Phrasal Verbs', content: 'Common phrasal verbs: look up, put off, get over...', tags: ['vocabulary', 'verbs'], starred: true, lastEdited: '2 hours ago', color: 'blue' },
    { id: '2', title: 'Conditional Sentences', content: 'First conditional: If + present simple, will + infinitive...', tags: ['grammar'], starred: false, lastEdited: '1 day ago', color: 'emerald' },
    { id: '3', title: 'Business Email Templates', content: 'Formal email structure and common phrases...', tags: ['business', 'writing'], starred: true, lastEdited: '3 days ago', color: 'purple' },
    { id: '4', title: 'IELTS Speaking Tips', content: 'Key strategies for scoring high in speaking test...', tags: ['ielts', 'speaking'], starred: false, lastEdited: '1 week ago', color: 'orange' },
  ];

  const stats = [
    { label: 'Total Notes', value: '24', icon: StickyNote, color: 'text-blue-500', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
    { label: 'Starred', value: '8', icon: Star, color: 'text-yellow-500', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
    { label: 'Tags Used', value: '12', icon: Tag, color: 'text-purple-500', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
      emerald: 'border-l-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      purple: 'border-l-purple-500 bg-purple-50 dark:bg-purple-950/20',
      orange: 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden border-none shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                  <StickyNote className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white">My Notes</h1>
                  <p className="text-lg text-white/90">Organize your learning materials</p>
                </div>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-white/90">
                <Plus className="mr-2 h-4 w-4" />
                New Note
              </Button>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Notes</CardTitle>
              <CardDescription>Your study notes and materials</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notes.map((note) => (
              <Card key={note.id} className={cn('border-l-4 hover:shadow-lg transition-all', getColorClass(note.color))}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {note.title}
                        {note.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                      </CardTitle>
                      <CardDescription className="mt-2">{note.content}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {note.lastEdited}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesView;
