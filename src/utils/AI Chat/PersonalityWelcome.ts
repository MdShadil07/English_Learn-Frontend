/**
 * AI Personality Welcome Messages
 * Frontend utility for displaying welcome messages
 */

export const getPersonalityWelcomeMessage = (personalityId: string, userName: string): string => {
  const welcomeMessages: Record<string, (name: string) => string> = {
    'basic-tutor': (name: string) => `Hello ${name}! 👋

I'm Alex Mentor, your personal English tutor, and I'm so excited to start this learning journey with you!

I'm here to help you build a strong foundation in English. Whether you're just starting out or want to strengthen your basics, we'll work together at a pace that's comfortable for you.

What I can help you with:
✓ Basic grammar and sentence structure
✓ Everyday vocabulary building
✓ Simple conversation practice
✓ Pronunciation guidance
✓ Reading comprehension

Feel free to ask me anything, make mistakes, and practice freely. Remember, every expert was once a beginner, and I'm here to support you every step of the way!

What would you like to work on today? 😊`,

    'conversation-coach': (name: string) => `Hey ${name}! 🎯

I'm Nova Coach, your conversation specialist, and I'm thrilled to help you take your English to the next level!

I'm all about making your English sound natural, confident, and authentic. We're going to dive into real conversations, explore idioms, master phrasal verbs, and help you speak like a native.

What makes our sessions special:
✨ Real-world conversation practice
✨ Natural expressions and idioms
✨ Cultural context and nuances
✨ Visual error correction (errors highlighted in red, corrections shown in green)
✨ Authentic dialogue scenarios
✨ Fluency-focused feedback

Whether you want to nail that job interview, chat confidently with native speakers, or just sound more natural, I've got your back!

So, what topic should we dive into today? Let's make this conversation amazing! 🚀`,

    'grammar-expert': (name: string) => `Greetings, ${name}! 📚

I'm Iris Scholar, your grammar and writing specialist, and I'm delighted to embark on this journey toward English mastery with you!

As your premium grammar expert, I provide meticulous analysis and comprehensive feedback to help you achieve excellence in English. Whether you're preparing for academic writing, professional communication, or simply want to master the intricacies of the language, I'm here to guide you.

Premium Features at Your Disposal:
🎓 Advanced grammatical analysis
🎓 Visual error highlighting (errors marked in red, corrections in green)
🎓 Detailed explanations with linguistic terminology
🎓 Academic and professional writing guidance
🎓 Style and register coaching
🎓 Complex grammar structures mastered
🎓 Comprehensive feedback on every aspect

I believe that true language mastery comes from understanding the 'why' behind every rule. Together, we'll explore the beautiful complexity of English grammar and elevate your writing to new heights.

What aspect of English grammar or writing would you like to refine today? Let's pursue excellence together! ✨`,

    'business-mentor': (name: string) => `Good day, ${name}! 💼

I'm Atlas Mentor, your executive business communication coach, and I'm honored to support your professional development journey.

With extensive experience in corporate communication and business English, I'm here to help you excel in every professional interaction—from emails and presentations to negotiations and leadership communication.

Your Premium Business Advantage:
💼 Professional communication mastery
💼 Visual feedback (unprofessional language marked, professional alternatives provided)
💼 Industry-specific vocabulary and best practices
💼 Email, presentation, and meeting excellence
💼 Negotiation and persuasion strategies
💼 Executive presence development
💼 Cross-cultural business communication
💼 Career-advancing communication skills

In the business world, how you communicate directly impacts your credibility, influence, and success. Together, we'll ensure your English reflects the professional you aspire to be.

What business communication challenge can I help you master today? Let's elevate your professional presence! 🚀`,

    'cultural-guide': (name: string) => `Hello ${name}! 🌍

I'm Luna Guide, your cultural fluency coach, and I'm excited to explore the fascinating world of English language and culture with you!

Language is so much more than words—it's about culture, context, and connection. I'm here to help you understand not just what to say, but how, when, and why people say it in different English-speaking cultures.

Your Pro Cultural Features:
🌟 Cultural context and etiquette
🌟 Visual guidance (cultural missteps highlighted, appropriate alternatives shown)
🌟 Idioms and expressions explained
🌟 Regional variations (US/UK/Australian English)
🌟 Social scripts and small talk mastery
🌟 Pop culture and current events
🌟 Cross-cultural communication skills
🌟 Travel and living abroad preparation

Whether you're preparing to travel, work with international teams, or just want to understand English in all its cultural richness, I'm here to guide you!

What cultural aspect of English would you like to explore today? Let's make you culturally fluent! ✨`
  };

  const welcomeFn = welcomeMessages[personalityId];
  if (welcomeFn) {
    return welcomeFn(userName);
  }

  // Fallback message
  return `Hello ${userName}! Welcome to your English learning session. How can I help you today?`;
};

/**
 * Get short greeting for personality (used in chat bubbles)
 */
export const getPersonalityGreeting = (personalityId: string, userName: string): string => {
  const greetings: Record<string, string> = {
    'basic-tutor': `Hello ${userName}! I'm Alex, your tutor. Let's learn together! 👋`,
    'conversation-coach': `Hey ${userName}! Ready for some great conversations? 🎯`,
    'grammar-expert': `Greetings ${userName}! Let's master English grammar! 📚`,
    'business-mentor': `Good day ${userName}! Let's elevate your professional English! 💼`,
    'cultural-guide': `Hello ${userName}! Let's explore English cultures together! 🌍`
  };

  return greetings[personalityId] || `Hello ${userName}!`;
};

/**
 * Get personality capabilities
 */
export const getPersonalityCapabilities = (personalityId: string): string[] => {
  const capabilities: Record<string, string[]> = {
    'basic-tutor': [
      'Basic grammar explanations',
      'Vocabulary building (A1-B1)',
      'Simple sentence construction',
      'Everyday conversation practice',
      'Pronunciation tips',
      'Basic reading comprehension',
      'Encouraging feedback',
      'Simple writing exercises'
    ],
    'conversation-coach': [
      'Advanced conversation practice',
      'Idioms and phrasal verbs',
      'Cultural context and nuances',
      'Natural expression coaching',
      'Role-play scenarios',
      'Pronunciation and intonation',
      'Visual error highlighting',
      'Real-world communication strategies',
      'Fluency development',
      'Contextual vocabulary expansion'
    ],
    'grammar-expert': [
      'Advanced grammar instruction',
      'Comprehensive error analysis',
      'Visual error and correction highlighting',
      'Academic writing excellence',
      'Complex sentence structures',
      'Writing style and register',
      'Punctuation mastery',
      'Linguistic terminology explained',
      'Essay and composition feedback',
      'Professional writing standards',
      'Coherence and cohesion',
      'Advanced editing techniques'
    ],
    'business-mentor': [
      'Business email mastery',
      'Professional presentation skills',
      'Meeting facilitation language',
      'Negotiation communication',
      'Visual error correction',
      'Industry vocabulary',
      'Report and proposal writing',
      'Executive communication',
      'Professional networking',
      'Cross-cultural business awareness',
      'Leadership language',
      'Interview preparation',
      'LinkedIn optimization',
      'Corporate etiquette'
    ],
    'cultural-guide': [
      'Cultural context and awareness',
      'Idioms and expressions',
      'Visual error correction',
      'Regional variations',
      'Social etiquette coaching',
      'Slang and informal language',
      'Pop culture integration',
      'Cross-cultural communication',
      'Travel preparation',
      'Cultural taboos and sensitivity',
      'Small talk mastery',
      'Holiday and celebration vocabulary'
    ]
  };

  return capabilities[personalityId] || [];
};
