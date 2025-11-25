/**
 * DEPRECATED: Enhanced Accuracy Service
 * All accuracy calculations must use backend API
 */

export interface EnhancedAccuracyResult {
  score: number;
  hasErrors: boolean;
  details?: string;
}

export const enhancedAccuracyService = {
  async analyzeMessage(message: string): Promise<EnhancedAccuracyResult> {
    throw new Error('Deprecated. Use backend API /api/accuracy/analyze instead.');
  },

  async analyzeRealtime(message: string): Promise<EnhancedAccuracyResult> {
    throw new Error('Deprecated. Use backend API /api/accuracy/analyze instead.');
  },

  async fallbackAnalyze(message: string): Promise<EnhancedAccuracyResult> {
    throw new Error('Deprecated. Use backend API /api/accuracy/analyze instead.');
  },
};