// accuracyService.ts
// Service to fetch latest accuracy data from backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
};

export interface LatestAccuracyData {
  overall: number;
  adjustedOverall?: number;
  grammar?: number;
  vocabulary?: number;
  spelling?: number;
  fluency?: number;
  punctuation?: number;
  capitalization?: number;
  messageCount?: number;
  lastUpdated?: string;
  source?: 'fast-cache' | 'optimized-cache' | 'progress-cache' | 'database';
}

export const fetchLatestAccuracy = async (forceRefresh = false): Promise<LatestAccuracyData> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Authentication required');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const url = `${API_BASE_URL}/accuracy/latest${forceRefresh ? `?t=${Date.now()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 401) {
      throw new Error('Authentication required');
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch latest accuracy');
    }

    return result.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
    throw new Error('Failed to fetch latest accuracy');
  }
};
