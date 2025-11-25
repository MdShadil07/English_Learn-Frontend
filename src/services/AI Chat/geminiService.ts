import axios from 'axios';

// Gemini API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: string;
}

export interface GeminiRequest {
  contents: {
    role: 'user' | 'model';
    parts: {
      text: string;
    }[];
  }[];
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
  safetySettings?: {
    category: string;
    threshold: string;
  }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
      role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: {
      category: string;
      probability: string;
      blocked: boolean;
    }[];
  }[];
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  gradient: string;
  tier: 'free' | 'pro' | 'premium';
  features: string[];
  specialty: string;
  language: string;
  voice: boolean;
  advancedMode: boolean;
}

export class GeminiAIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = GEMINI_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = GEMINI_API_URL;
  }

  /**
   * Generate AI response based on personality and conversation context
   */
  async generateResponse(
    userMessage: string,
    personality: AIPersonality,
    conversationHistory: GeminiMessage[] = [],
    language: string = 'en'
  ): Promise<string> {
    try {
      // Prepare the conversation context
      const contextMessages: GeminiMessage[] = [
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        {
          role: 'user',
          parts: userMessage
        }
      ];

      // Create personality-specific prompt
      const systemPrompt = this.createPersonalityPrompt(personality, language);

      // Prepare request body
      const requestBody: GeminiRequest = {
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\nUser: ${userMessage}` }]
          }
        ],
        generationConfig: {
          temperature: this.getTemperatureForPersonality(personality),
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1000,
          stopSequences: []
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      };

      // Make API request
      const response = await axios.post<GeminiResponse>(
        `${this.baseUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000 // 30 second timeout
        }
      );

      // Extract response text
      if (response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          return candidate.content.parts[0].text.trim();
        }
      }

      throw new Error('No response generated from Gemini API');

    } catch (error) {
      console.error('Gemini API Error:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
        } else if (error.response?.status === 403) {
          throw new Error('API key invalid or quota exceeded.');
        } else if (error.response?.status === 400) {
          throw new Error('Invalid request. Please check your message.');
        }
      }

      throw new Error('Failed to get AI response. Please try again.');
    }
  }

  /**
   * Create personality-specific prompt
   */
  private createPersonalityPrompt(personality: AIPersonality, language: string): string {
    const basePrompt = `You are ${personality.name}, an AI English language tutor with the following characteristics:

**Personality**: ${personality.description}
**Specialty**: ${personality.specialty}
**Features**: ${personality.features.join(', ')}

You are teaching English to someone who may not be a native speaker. Always respond in a helpful, encouraging, and educational way.`;

    const languagePrompts = {
      'basic-tutor': `${basePrompt}

Focus on:
- Simple explanations
- Basic grammar rules
- Common vocabulary
- Encouraging practice
- Clear pronunciation guidance

Keep responses simple and encouraging. Break down complex ideas into smaller parts.`,
      'conversation-coach': `${basePrompt}

Focus on:
- Natural conversation flow
- Everyday expressions and idioms
- Cultural context
- Pronunciation practice
- Role-playing scenarios

Encourage conversational practice and provide feedback on naturalness.`,
      'grammar-expert': `${basePrompt}

Focus on:
- Detailed grammar explanations
- Rule applications
- Common mistakes and corrections
- Advanced structures
- Academic writing style

Provide thorough explanations with examples and practice exercises.`,
      'business-mentor': `${basePrompt}

Focus on:
- Professional vocabulary
- Business communication
- Email and report writing
- Presentation skills
- Corporate culture

Use formal, professional language appropriate for business contexts.`,
      'cultural-guide': `${basePrompt}

Focus on:
- Cultural context and nuances
- Regional language variations
- Social customs and etiquette
- Idioms and colloquialisms
- Cross-cultural communication

Explain cultural references and help with understanding context.`
    };

    return languagePrompts[personality.id as keyof typeof languagePrompts] || languagePrompts['basic-tutor'];
  }

  /**
   * Get temperature setting based on personality
   */
  private getTemperatureForPersonality(personality: AIPersonality): number {
    const temperatures = {
      'basic-tutor': 0.3,    // More consistent, educational responses
      'conversation-coach': 0.7, // More varied, natural conversation
      'grammar-expert': 0.2, // Very consistent, rule-based responses
      'business-mentor': 0.4, // Professional but somewhat varied
      'cultural-guide': 0.6  // Varied to reflect different cultural contexts
    };

    return temperatures[personality.id as keyof typeof temperatures] || 0.5;
  }

  /**
   * Analyze message for educational insights
   */
  async analyzeMessageForInsights(
    userMessage: string,
    personality: AIPersonality
  ): Promise<{
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    topics: string[];
    suggestions: string[];
    corrections: string[];
  }> {
    try {
      const analysisPrompt = `Analyze this English language learner's message and provide educational insights:

Message: "${userMessage}"
Personality: ${personality.name} (${personality.specialty})

Provide analysis in JSON format:
{
  "difficulty": "beginner|intermediate|advanced",
  "topics": ["topic1", "topic2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "corrections": ["correction1", "correction2"]
}`;

      const requestBody: GeminiRequest = {
        contents: [{
          role: 'user',
          parts: [{ text: analysisPrompt }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 500
        }
      };

      const response = await axios.post<GeminiResponse>(
        `${this.baseUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 15000
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const text = response.data.candidates[0].content.parts[0].text;
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse analysis response:', parseError);
        }
      }

      // Fallback analysis
      return {
        difficulty: 'intermediate',
        topics: ['general-english'],
        suggestions: ['Keep practicing!'],
        corrections: []
      };

    } catch (error) {
      console.error('Analysis error:', error);
      return {
        difficulty: 'intermediate',
        topics: ['general-english'],
        suggestions: ['Keep practicing!'],
        corrections: []
      };
    }
  }

  /**
   * Generate conversation topic suggestions
   */
  async generateTopicSuggestions(
    userLevel: string,
    personality: AIPersonality,
    recentTopics: string[] = []
  ): Promise<string[]> {
    try {
      const prompt = `Suggest 5 English conversation topics suitable for a ${userLevel} level learner studying with ${personality.name} (${personality.specialty}).

Avoid these recently discussed topics: ${recentTopics.join(', ')}

Return only a JSON array of topic strings, like: ["topic1", "topic2", "topic3", "topic4", "topic5"]`;

      const requestBody: GeminiRequest = {
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 200
        }
      };

      const response = await axios.post<GeminiResponse>(
        `${this.baseUrl}?key=${this.apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000
        }
      );

      if (response.data.candidates && response.data.candidates.length > 0) {
        const text = response.data.candidates[0].content.parts[0].text;
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse topic suggestions:', parseError);
        }
      }

      return ['Daily routines', 'Hobbies and interests', 'Travel experiences', 'Food and cooking', 'Future plans'];

    } catch (error) {
      console.error('Topic suggestion error:', error);
      return ['Daily routines', 'Hobbies and interests', 'Travel experiences', 'Food and cooking', 'Future plans'];
    }
  }

  /**
   * Check API health and quota
   */
  async checkHealth(): Promise<{ healthy: boolean; quota?: number; error?: string }> {
    try {
      // Simple request to check if API is working
      await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`, {
        timeout: 5000
      });

      return { healthy: true };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          return { healthy: false, error: 'Invalid API key or quota exceeded' };
        } else if (error.response?.status === 429) {
          return { healthy: false, error: 'Rate limit exceeded' };
        }
      }

      return { healthy: false, error: 'API unavailable' };
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiAIService();
