import { BookOpen } from 'lucide-react';
import { CourseListView } from '../SharedTemplate/CourseListView';

export default function GrammarTopicPage() {
  return (
    <CourseListView 
      coreSection="Grammar"
      title="Grammar Hub"
      description="Master English grammar rules with comprehensive lessons and exercises."
      icon={<BookOpen className="h-8 w-8 text-white" />}
    />
  );
}
