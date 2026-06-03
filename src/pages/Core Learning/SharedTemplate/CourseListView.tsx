import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Star, Play, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { courseService, CourseData } from '../../../services/courseService';
import { cn } from '@/lib/utils';

interface CourseListViewProps {
  coreSection: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export const CourseListView: React.FC<CourseListViewProps> = ({ coreSection, title, description, icon }) => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const observer = useRef<IntersectionObserver | null>(null);

  const lastCourseElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadCourses = async (currentPage: number, search: string, isNewSearch: boolean = false) => {
    try {
      setLoading(true);
      const response = await courseService.getCoursesBySection(coreSection, currentPage, 12, search);
      
      setCourses(prev => isNewSearch ? response.data : [...prev, ...response.data]);
      setHasMore(response.pagination.page < response.pagination.totalPages);
    } catch (error) {
      console.error('Failed to load courses', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and pagination
  useEffect(() => {
    // Skip if it's a new search, handled by the search effect
    if (page === 1 && searchQuery !== '') return;
    loadCourses(page, searchQuery, page === 1);
  }, [page, coreSection]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadCourses(1, searchQuery, true);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, coreSection]);

  return (
    <div className="min-h-screen p-6 space-y-8 bg-slate-50/50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-none shadow-lg bg-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90" />
          <CardContent className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                    {icon || <BookOpen className="h-8 w-8 text-white" />}
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white">{title}</h1>
                    <p className="text-lg text-white/90">{description}</p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative w-64 md:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50"
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="md:hidden mt-4">
               <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/70" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus-visible:ring-white/50"
                  />
                </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course, index) => {
          const isLastElement = index === courses.length - 1;
          
          return (
            <motion.div
              key={course._id}
              ref={isLastElement ? lastCourseElementRef : null}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (index % 12) * 0.05 }}
            >
              <Card className="group hover:shadow-xl transition-all h-full flex flex-col overflow-hidden border-slate-200">
                {course.thumbnailUrl ? (
                  <div className="h-40 w-full overflow-hidden bg-slate-100">
                    <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                ) : (
                  <div className="h-40 w-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-indigo-300" />
                  </div>
                )}
                
                <CardHeader className="flex-1 pb-2">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                      {course.level}
                    </Badge>
                    <div className="flex items-center text-amber-500 text-sm font-medium">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {course.rating.toFixed(1)}
                    </div>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 leading-tight mb-1">{course.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm text-slate-500">
                    {course.summary}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.durationMinutes} min
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course.lessonsCount} lessons
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => navigate(`/courses/${course.slug}`)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No courses found</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            We couldn't find any courses matching your search criteria in this section.
          </p>
        </div>
      )}
    </div>
  );
};
