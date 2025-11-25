import { useState } from 'react';
import { Brain, Mic, MessageSquare, BookOpen, Sparkles } from 'lucide-react';

const AIPractice = () => {
  const [selectedPracticeType, setSelectedPracticeType] = useState<string | null>(null);

  const practiceTypes = [
    {
      id: 'conversation',
      title: 'AI Conversation Practice',
      description: 'Practice natural conversations with AI in various scenarios',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'pronunciation',
      title: 'Pronunciation Practice',
      description: 'Improve your pronunciation with AI-powered feedback',
      icon: Mic,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'scenario',
      title: 'Scenario-Based Practice',
      description: 'Practice English in real-world situations',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'interactive',
      title: 'Interactive Exercises',
      description: 'Engage with AI-generated interactive exercises',
      icon: Sparkles,
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">AI Practice</h1>
        </div>
        <p className="text-gray-600">
          Practice your English skills with AI-powered interactive exercises and real-time feedback
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practiceTypes.map((practice) => {
          const Icon = practice.icon;
          return (
            <div
              key={practice.id}
              onClick={() => setSelectedPracticeType(practice.id)}
              className={`relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                selectedPracticeType === practice.id
                  ? 'border-purple-500 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="p-6">
                <div
                  className={`w-14 h-14 rounded-lg bg-gradient-to-br ${practice.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {practice.title}
                </h3>
                <p className="text-gray-600">{practice.description}</p>
              </div>
              {selectedPracticeType === practice.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedPracticeType && (
        <div className="mt-8 p-6 bg-purple-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ready to Start?</h2>
            <button
              onClick={() => setSelectedPracticeType(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Click the button below to start your practice session. The AI will guide you through
            the exercises and provide real-time feedback.
          </p>
          <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg transition-all">
            Start Practice Session
          </button>
        </div>
      )}
    </div>
  );
};

export default AIPractice;
