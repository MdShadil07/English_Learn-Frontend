import { useContext } from 'react';
import { LevelingContext } from '@/contexts/LevelingContext';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

/**
 * LevelProgressBar Component
 * 
 * Displays user's current level, XP progress, and proficiency tier
 * Integrates with the advanced leveling system
 * 
 * Features:
 * - Animated progress bar
 * - Current level display
 * - XP to next level counter
 * - Proficiency badge with tier
 * - Responsive design
 * 
 * @example
 * <LevelProgressBar />
 */
export const LevelProgressBar = () => {
  const context = useContext(LevelingContext);
  
  if (!context) {
    throw new Error('LevelProgressBar must be used within a LevelingProvider');
  }
  
  const { levelProgress, levelStats, isLoading } = context;

  // Proficiency level styling
  const proficiencyConfig = {
    Beginner: { 
      gradient: 'from-green-400 to-green-600', 
      icon: '🌱',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    Intermediate: { 
      gradient: 'from-blue-400 to-blue-600', 
      icon: '📚',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    Advanced: { 
      gradient: 'from-purple-400 to-purple-600', 
      icon: '🎓',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    Expert: { 
      gradient: 'from-orange-400 to-orange-600', 
      icon: '👑',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    Master: { 
      gradient: 'from-red-400 to-red-600', 
      icon: '🏅',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
  };

  const config = proficiencyConfig[levelProgress.proficiencyLevel];

  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  return (
    <Card className="p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4">
        {/* Level Info */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${config.bgColor} flex items-center justify-center text-2xl`}>
            {config.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold">
              Level {levelProgress.currentLevel}
            </h3>
            <p className={`text-sm font-medium ${config.textColor}`}>
              {levelProgress.proficiencyLevel} • Tier {levelProgress.tier}/10
            </p>
          </div>
        </div>

        {/* XP Counter */}
        <div className="text-right">
          <p className="text-lg font-bold text-gray-700">
            {formatNumber(levelProgress.xpToNextLevel)}
          </p>
          <p className="text-xs text-gray-500">XP to next level</p>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="space-y-2">
        <div className="relative">
          {/* Gradient Progress Bar */}
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(levelProgress.progressPercentage, 100)}%` }}
            >
              {/* Shimmer effect */}
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
            </div>
          </div>

          {/* Progress Percentage Badge */}
          {levelProgress.progressPercentage > 10 && (
            <div 
              className="absolute top-0 h-4 flex items-center"
              style={{ left: `${Math.min(levelProgress.progressPercentage, 95)}%` }}
            >
              <span className="text-xs font-bold text-white drop-shadow-md">
                {levelProgress.progressPercentage.toFixed(0)}%
              </span>
            </div>
          )}
        </div>

        {/* XP Range Labels */}
        <div className="flex justify-between text-xs text-gray-500">
          <span className="font-medium">
            {formatNumber(levelProgress.currentXP)} XP
          </span>
          <span className="font-medium">
            {formatNumber(levelProgress.xpForNextLevel)} XP
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100">
        {/* Total XP */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Total XP</p>
          <p className="text-sm font-bold text-purple-600">
            {formatNumber(levelStats.totalXP)}
          </p>
        </div>

        {/* Streak */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Streak</p>
          <p className="text-sm font-bold text-orange-600">
            🔥 {levelStats.currentStreak}
          </p>
        </div>

        {/* Perfect Messages */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-1">Perfect</p>
          <p className="text-sm font-bold text-yellow-600">
            ⭐ {levelStats.perfectMessages}
          </p>
        </div>
      </div>
    </Card>
  );
};

// Shimmer animation (add to your global CSS or Tailwind config)
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }
