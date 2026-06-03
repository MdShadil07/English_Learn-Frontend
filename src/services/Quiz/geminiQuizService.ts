export type QuizQuestionStatus = 'completed' | 'current' | 'flagged' | 'unanswered';

export interface QuizInfo {
  title: string;
  module: string;
  totalQuestions: number;
  currentQuestion: number;
  timeRemaining: string;
  progress: number;
  streak: number;
}

export interface QuizQuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizContext {
  type: string;
  sender: string;
  date: string;
  subject: string;
  content: string;
}

export interface QuizQuestion {
  id: number;
  type: string;
  skill: string;
  context: QuizContext;
  prompt: string;
  options: QuizQuestionOption[];
  speakingPrompt: string;
}

export interface QuizExperience {
  info: QuizInfo;
  questionMap: Array<{ id: number; status: QuizQuestionStatus }>;
  currentQuestion: QuizQuestion;
}

export interface GenerateQuizExperienceInput {
  title: string;
  module: string;
  level?: string;
  focus?: string;
  questionCount?: number;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const DEFAULT_EXPERIENCE: QuizExperience = {
  info: {
    title: 'Advanced Business Communication',
    module: 'Module 4: Formal Negotiations',
    totalQuestions: 25,
    currentQuestion: 12,
    timeRemaining: '14:52',
    progress: 48,
    streak: 3,
  },
  questionMap: Array.from({ length: 25 }, (_, index) => ({
    id: index + 1,
    status: index < 11 ? 'completed' : index === 11 ? 'current' : index === 5 || index === 8 ? 'flagged' : 'unanswered',
  })),
  currentQuestion: {
    id: 12,
    type: 'Hybrid Scenario',
    skill: 'Vocabulary & Tone',
    context: {
      type: 'Email Thread',
      sender: 'Sarah Jenkins, VP of Operations',
      date: 'Oct 12, 10:23 AM',
      subject: 'Re: Q4 Supply Chain Delays',
      content:
        'Hi Team,\n\nWe are facing a 2-week delay from our primary vendor in Taiwan. We need to communicate this to our enterprise clients immediately without causing panic. \n\nPlease draft a response. It is crucial that we ______ the situation professionally while offering a temporary workaround.',
    },
    prompt: 'Which phrase best completes the sentence to maintain a formal, reassuring, and professional tone?',
    options: [
      { id: 'A', text: 'apologize for messing up' },
      { id: 'B', text: 'address the situation' },
      { id: 'C', text: 'make excuses about' },
      { id: 'D', text: 'ignore the reality of' },
    ],
    speakingPrompt:
      'Once you have selected the correct phrase, press record and read the complete, corrected sentence aloud to practice your professional delivery.',
  },
};

function stripCodeFences(text: string): string {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

function safeParseExperience(rawText: string): QuizExperience | null {
  try {
    const parsed = JSON.parse(stripCodeFences(rawText));
    if (!parsed?.info || !parsed?.questionMap || !parsed?.currentQuestion) {
      return null;
    }
    return parsed as QuizExperience;
  } catch {
    return null;
  }
}

export class GeminiQuizService {
  async generatePracticeQuiz(input: GenerateQuizExperienceInput): Promise<QuizExperience> {
    if (!GEMINI_API_KEY) {
      return DEFAULT_EXPERIENCE;
    }

    const prompt = `
Create a single quiz experience for an English practice app.
Return valid JSON only and no markdown fences.

Context:
- Title: ${input.title}
- Module: ${input.module}
- Level: ${input.level || 'Intermediate'}
- Focus: ${input.focus || 'Business communication'}
- Question count: ${input.questionCount || 25}

Schema:
{
  "info": { "title": string, "module": string, "totalQuestions": number, "currentQuestion": number, "timeRemaining": string, "progress": number, "streak": number },
  "questionMap": [{ "id": number, "status": "completed" | "current" | "flagged" | "unanswered" }],
  "currentQuestion": {
    "id": number,
    "type": string,
    "skill": string,
    "context": { "type": string, "sender": string, "date": string, "subject": string, "content": string },
    "prompt": string,
    "options": [{ "id": "A" | "B" | "C" | "D", "text": string }],
    "speakingPrompt": string
  }
}

Make the content realistic, polished, and suitable for a premium English learning experience.
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.5,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 2048,
          },
        }),
      });

      if (!response.ok) {
        return DEFAULT_EXPERIENCE;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('') || '';
      const parsed = safeParseExperience(text);
      return parsed || DEFAULT_EXPERIENCE;
    } catch {
      return DEFAULT_EXPERIENCE;
    }
  }
}

export const geminiQuizService = new GeminiQuizService();
export const defaultQuizExperience = DEFAULT_EXPERIENCE;
