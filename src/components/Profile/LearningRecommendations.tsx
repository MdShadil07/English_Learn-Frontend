import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/user';

interface LearningRecommendationsProps {
  profile: UserProfile;
}

const LearningRecommendations: React.FC<LearningRecommendationsProps> = ({ profile }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-50/90 via-purple-50/90 to-fuchsia-50/90 dark:from-violet-900/20 dark:via-purple-900/20 dark:to-fuchsia-900/20 backdrop-blur-xl border border-violet-200/50 dark:border-violet-800/50 shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full bg-gradient-to-br from-violet-300/20 to-fuchsia-300/20 dark:from-violet-700/20 dark:to-fuchsia-700/20 blur-xl"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-purple-300/20 to-violet-300/20 dark:from-purple-700/20 dark:to-violet-700/20 blur-lg"></div>

      <div className="relative p-4 sm:p-6 md:p-8">
        {/* Title and Sub-cards Row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* AI Powered Learning Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white">
                AI Powered Learning
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Advanced AI tools to accelerate your English mastery
              </p>
            </div>
          </div>

          {/* AI Chat Card */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-violet-200/40 dark:border-violet-800/40 flex-1 min-w-0 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1 truncate">
                  AI Chat Assistant
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mb-1.5 sm:mb-2 leading-relaxed truncate">
                  Practice with 5 AI personalities that correct grammar and pronunciation
                </p>
                <Button
                  size="sm"
                  className="w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 border-0 py-1 px-2 sm:px-3 text-[10px] sm:text-xs"
                >
                  Start AI Chat
                </Button>
              </div>
            </div>
          </div>

          {/* Voice Room Card */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-violet-200/40 dark:border-violet-800/40 flex-1 min-w-0 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm mb-1 truncate">
                  Voice Practice Rooms
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mb-1.5 sm:mb-2 leading-relaxed truncate">
                  Join interactive voice rooms with real-time pronunciation feedback
                </p>
                <Button
                  size="sm"
                  className="w-auto bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium rounded-md shadow-md hover:shadow-lg transition-all duration-300 border-0 py-1 px-2 sm:px-3 text-[10px] sm:text-xs"
                >
                  Join Voice Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-400/0 via-purple-400/0 to-fuchsia-400/0 hover:from-violet-400/5 hover:via-purple-400/5 hover:to-fuchsia-400/5 transition-all duration-500 -z-10"></div>
    </div>
  );
};

export default LearningRecommendations;
