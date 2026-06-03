import { BookOpen } from 'lucide-react';
import { CourseListView } from '../SharedTemplate/CourseListView';

export default function GrammarView() {
  return (
    <CourseListView 
      coreSection="Grammar"
      title="Grammar Courses"
      description="Master English grammar rules with comprehensive courses."
      icon={<BookOpen className="h-8 w-8 text-white" />}
    />
  );
}
