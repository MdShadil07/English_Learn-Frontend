import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  BookOpen,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { api } from '@/utils/api';

const AudioWave = ({ isPlaying }: { isPlaying: boolean }) => (
  <div className="flex items-center justify-center gap-0.5 h-4">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="w-0.5 bg-emerald-500 rounded-full"
        animate={{ height: isPlaying ? [4, 12, 6, 14, 4] : 4 }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: i * 0.1,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const DifficultyBadge = ({ level }: { level: string }) => {
  const colors: Record<string, string> = {
    beginner: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    intermediate: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    advanced: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800"
  };
  
  return (
    <span className={cn("text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wide", colors[level] || colors.beginner)}>
      {level}
    </span>
  );
};

const WordCard = ({ word, isFullWidth = false }: { word: any, isFullWidth?: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(true);
    // Integrate text-to-speech here if available, fallback to timeout for animation
    setTimeout(() => setIsPlaying(false), 2000);
  };

  if (!word) return null;

  return (
    <motion.div
      layout
      className={cn(
        "group relative bg-white dark:bg-[#050C14] backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-emerald-500/10 shadow-sm hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)] transition-all duration-500 overflow-hidden",
        isFullWidth ? "w-full max-w-4xl mx-auto" : ""
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-blue-50/50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative p-6 flex flex-col h-full">
        
        {/* Header: Word & Audio */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DifficultyBadge level={word.difficulty || 'beginner'} />
              <span className="text-xs font-medium text-slate-400 italic">{word.partOfSpeech}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 transition-all duration-300">
              {word.word}
            </h3>
            <div className="text-sm text-slate-500 font-mono mt-1">{word.phonetic}</div>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-slate-100 dark:bg-[#050C14] border border-transparent dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 transition-colors shrink-0"
            onClick={handlePlay}
          >
            {isPlaying ? <AudioWave isPlaying={true} /> : <Volume2 className="h-5 w-5 md:h-6 md:w-6" />}
          </Button>
        </div>

        {/* Definition */}
        <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed mb-6 flex-grow">
          {word.definition}
        </p>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-6 pb-6">
                
                {/* Examples */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <BookOpen className="w-3 h-3" /> Examples in Context
                  </div>
                  {word.examples?.map((ex: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50">
                      <p className="text-slate-800 dark:text-slate-200 font-medium mb-1 text-sm">"{ex.sentence}"</p>
                      <p className="text-slate-500 text-xs italic mb-2">{ex.translation}</p>
                      {ex.explanation && (
                        <p className="text-slate-600 dark:text-slate-400 text-xs bg-white dark:bg-slate-800/50 p-2 rounded-md border border-slate-100 dark:border-slate-700">
                          {ex.explanation}
                        </p>
                      )}
                      <div className="mt-2 flex justify-end">
                        <Badge variant="secondary" className="text-[10px] h-5 bg-white dark:bg-slate-700 shadow-sm">
                          {ex.context}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Synonyms */}
                {word.synonyms && word.synonyms.length > 0 && (
                  <div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      <Lightbulb className="w-3 h-3" /> Similar Words
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {word.synonyms.map((syn: string) => (
                        <span key={syn} className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                          {syn}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <Button 
            className={cn(
              "flex-1 h-10 rounded-xl text-sm font-semibold shadow-sm transition-all",
              isExpanded 
                ? "bg-slate-100 dark:bg-[#050C14] border dark:border-emerald-500/20 text-slate-900 dark:text-emerald-400 hover:bg-slate-200 dark:hover:bg-emerald-500/10" 
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:opacity-90"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>Less <ChevronUp className="ml-1 w-4 h-4" /></>
            ) : (
              <>Example & Context <ChevronDown className="ml-1 w-4 h-4" /></>
            )}
          </Button>
          
          <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-slate-200 dark:bg-[#050C14] dark:border-emerald-500/20 dark:text-emerald-500 hover:text-emerald-500 dark:hover:bg-emerald-500/10 hover:border-emerald-200 transition-colors shrink-0">
            <Bookmark className="h-4 w-4" />
          </Button>
        </div>

      </div>
    </motion.div>
  );
};

export default function WordOfTheDay() {
  const [dailyWord, setDailyWord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTodayWord = async () => {
      try {
        const response = await api.wotd.getToday() as any;
        if (response?.success) {
          setDailyWord(response.data);
        }
      } catch (error: any) {
        if (!error.message?.includes('No word of the day available yet')) {
          console.error('Failed to fetch Word of the Day', error);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayWord();
  }, []);

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end mb-8 gap-4 px-2 max-w-4xl mx-auto">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Daily Vocabulary</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Word of the Day
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Master a new word specially curated for your fluency level today.
          </p>
        </div>
        
        <Button variant="outline" className="hidden sm:flex gap-2 rounded-full border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:border-emerald-200 transition-all shrink-0">
          View Archive <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Daily Word Content */}
      <div className="px-2">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : dailyWord ? (
          <WordCard word={dailyWord} isFullWidth={true} />
        ) : (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
            <p>Your daily word is being generated. Check back shortly!</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-center sm:hidden">
         <Button variant="ghost" className="text-emerald-600 font-medium">
            View Archive <ArrowRight className="ml-1 w-4 h-4" />
         </Button>
      </div>
    </section>
  );
}