const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface CourseData {
  _id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  level: string;
  language: string;
  instructor: string;
  tags: string[];
  modulesCount: number;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  durationMinutes: number;
  featuredImageUrl?: string;
  thumbnailUrl?: string;
  isFeatured: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class CourseService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  async getCoursesBySection(
    coreSection: string,
    page: number = 1,
    limit: number = 20,
    search: string = ''
  ): Promise<PaginatedResponse<CourseData>> {
    try {
      const url = new URL(`${this.baseURL}/courses`);
      if (coreSection) url.searchParams.append('coreSection', coreSection);
      if (page) url.searchParams.append('page', page.toString());
      if (limit) url.searchParams.append('limit', limit.toString());
      if (search) url.searchParams.append('search', search);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch courses');
      }

      return result;
    } catch (error) {
      console.error('Course fetch error:', error);
      throw error;
    }
  }

  async getCourseBySlug(slug: string): Promise<{ success: boolean; data: any }> {
    try {
      const response = await fetch(`${this.baseURL}/courses/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch course details');
      }

      return result;
    } catch (error) {
      console.error('Course details fetch error:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
