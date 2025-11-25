import {
  AccuracyAnalysisResult,
  UserTier,
} from './accuracy/types';


// Centralized AccuracyService consolidates all accuracy logic and avoids duplication across feature modules.
export class AccuracyService {
  async analyzeMessage(
    userMessage: string,
    aiResponse: string,
    tier: UserTier,
    personalityId?: string
  ): Promise<AccuracyAnalysisResult> {
    try {
      const { analyzeMessageAccuracy } = await import('../utils/AI Chat/accuracy/accuracyCalculator');

      const userId = typeof window !== 'undefined'
        ? (() => {
            try {
              const raw = localStorage.getItem('userData');
              if (raw) {
                const parsed = JSON.parse(raw);
                return parsed?.id || parsed?._id || parsed?.userId || undefined;
              }
            } catch (e) {
              // ignore parse errors
            }
            return localStorage.getItem('userId') || undefined;
          })()
        : undefined;

      const backendResult = await analyzeMessageAccuracy(
        userMessage,
        aiResponse,
        {
          userTier: tier,
          userId,
        }
      );

      const mapped: AccuracyAnalysisResult = {
        overall: backendResult.overall,
        metrics: {
          grammar: backendResult.grammar,
          vocabulary: backendResult.vocabulary,
          spelling: backendResult.spelling,
          fluency: backendResult.fluency,
          comprehension: backendResult.contextRelevance ?? backendResult.overall,
        },
        feedback:
          backendResult.feedback?.map((item) => ({
            category: 'general',
            message: typeof item === 'string' ? item : String(item),
            severity: 'info',
          })) || [],
        tier,
        personalityWeighted: false,
        timestamp: new Date().toISOString(),
        improvementAreas: backendResult.insights?.weaknesses || [],
        strengths: backendResult.insights?.strengths || [],
      };

      if ((backendResult as { __fromCache?: boolean }).__fromCache) {
        console.log('📥 AccuracyService: using cached backend result');
      }

      return mapped;
    } catch (error) {
      console.error('❌ Backend accuracy service unavailable.', error);
      // Return a safe default or throw, do NOT fallback to local calculation
      // to ensure data consistency with the backend.
      throw new Error('Accuracy service unavailable');
    }
  }

  async analyzeRealtime(
    userMessage: string,
    tier: UserTier,
    personalityId?: string
  ): Promise<AccuracyAnalysisResult> {
     // Realtime analysis also depends on backend now, or we can return a placeholder
     // if we don't want to hit the API on every keystroke/partial message.
     // For now, returning empty result to avoid local calculation duplication.
     return {
        overall: 0,
        metrics: { grammar: 0, vocabulary: 0, spelling: 0, fluency: 0, comprehension: 0 },
        feedback: [],
        tier,
        personalityWeighted: Boolean(personalityId),
        timestamp: new Date().toISOString(),
        improvementAreas: [],
        strengths: [],
      };
  }
}

export const accuracyService = new AccuracyService();
