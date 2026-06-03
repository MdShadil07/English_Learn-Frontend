export interface LessonObjective {
  title: string;
  desc: string;
}

export interface SidebarNav {
  id: string;
  title: string;
  status: 'locked' | 'active' | 'completed';
}

export interface ContentBlock {
  id: string;
  type: 'hero' | 'concept' | 'checkpoint' | 'real_world' | 'mistakes' | 'drill_teaser';
  [key: string]: any;
}

export interface LessonData {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  xpReward: number;
  progress: number;
  streak: number;
  dailyGoalProgress: number;
  dailyGoalTotal: number;
  objectives: LessonObjective[];
  sidebarNav: SidebarNav[];
  content: ContentBlock[];
}

export const VERB_AGREEMENT_DATA: LessonData = {
  id: "l_sva_01",
  title: "Subject-Verb Agreement",
  difficulty: "Beginner",
  estimatedTime: "12 mins", 
  xpReward: 150,
  progress: 35, 
  streak: 4, 
  dailyGoalProgress: 2, 
  dailyGoalTotal: 3,
  objectives: [
    { title: "The Foundation", desc: "Understand the core matching rule." },
    { title: "Number Identification", desc: "Instantly spot singular vs plural." },
    { title: "Trap Avoidance", desc: "Navigate tricky words like 'everyone'." }
  ],
  sidebarNav: [
    { id: "intro", title: "Introduction", status: "completed" },
    { id: "concept_1", title: "The Golden Rule", status: "active" },
    { id: "checkpoint_1", title: "Milestone", status: "locked" },
    { id: "real_world", title: "Real-World Usage", status: "locked" },
    { id: "common_mistakes", title: "Common Mistakes", status: "locked" },
    { id: "assessment", title: "Mastery Challenge", status: "locked" }
  ],
  content: [
    {
      id: "intro",
      type: "hero",
      heading: "Mastering Subject-Verb Agreement",
      subheading: "The foundation of grammatically flawless English sentences. Master this to instantly sound more professional.",
    },
    {
      id: "concept_1",
      type: "concept",
      title: "The Golden Rule",
      theory: "The core rule is simple: **Singular subjects** take **singular verbs**, and **plural subjects** take **plural verbs**. Think of them as partners that must always match in number.",
      aiExplanation: {
        simple: "If one person is doing it, add an 's' to the action word. If many are doing it, don't.",
        memoryTrick: "Singular Subject = Single 'S' on the verb (He walkS). Plural Subject = Plural people, zero 'S' (They walk)."
      },
      examples: [
        {
          correct: { text: "The **dog barks** loudly.", explanation: "Singular subject (dog) pairs with singular verb (barks)." },
          incorrect: { text: "The **dog bark** loudly.", explanation: "Missing the singular 's' on the verb." }
        }
      ],
      inlineCheck: {
        question: "Choose the correct sentence to complete the rule:",
        options: [
          "My friend live in London.",
          "My friend lives in London."
        ],
        correctIndex: 1,
        explanation: "'Friend' is singular, so the verb must be 'lives'."
      }
    },
    {
      id: "checkpoint_1",
      type: "checkpoint",
      title: "Halfway There!",
      message: "You've successfully mastered the Golden Rule. Take a deep breath. Just 6 minutes left to complete this lesson and maintain your 4-day streak."
    },
    {
      id: "real_world",
      type: "real_world",
      title: "How it appears in real life",
      scenarios: [
        {
          context: "Professional Emails",
          icon: "Briefcase",
          text: "The team **is** reviewing the report. (Not 'are', because the team acts as one single unit here)."
        }
      ]
    },
    {
      id: "common_mistakes",
      type: "mistakes",
      title: "Top Mistakes Indian Learners Make",
      items: [
        {
          mistake: "Saying 'He go to school' instead of 'He goes'.",
          reason: "Direct translation from Hindi/regional languages where verb conjugations don't rely on 's' for singular third-person.",
          fix: "Always pause when using He, She, or It. Force yourself to add the 's' sound."
        }
      ]
    },
    {
      id: "assessment",
      type: "drill_teaser",
      title: "Mastery Challenge",
      description: "Prove your knowledge to unlock the next module and claim your XP.",
      questionCount: 15,
      passMark: "80%",
      rewardXP: 150
    }
  ]
};
