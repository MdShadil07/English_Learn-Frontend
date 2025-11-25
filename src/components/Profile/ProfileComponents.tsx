import React from 'react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
  progress?: number;
  maxProgress?: number;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isCompleted: boolean;
}

interface ActivityItem {
  id: string;
  type: 'lesson' | 'achievement' | 'streak' | 'level_up' | 'practice';
  title: string;
  description: string;
  timestamp: string;
  xpGained?: number;
  icon: string;
}

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{achievement.icon}</span>
      <div>
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{achievement.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{achievement.description}</p>
      </div>
    </div>
  </div>
);

const LearningGoalCard: React.FC<{ goal: LearningGoal }> = ({ goal }) => (
  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{goal.title}</h4>
    <p className="text-sm text-slate-600 dark:text-slate-400">{goal.description}</p>
    <div className="mt-2">
      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500">
        <span>{goal.currentValue}/{goal.targetValue} {goal.unit}</span>
        <span>{Math.round((goal.currentValue / goal.targetValue) * 100)}%</span>
      </div>
      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1">
        <div
          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
          style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
        />
      </div>
    </div>
  </div>
);

const ActivityCard: React.FC<{ activity: ActivityItem }> = ({ activity }) => (
  <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
    <div className="flex items-center gap-3">
      <span className="text-xl">{activity.icon}</span>
      <div className="flex-1">
        <h4 className="font-medium text-slate-900 dark:text-slate-100">{activity.title}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-400">{activity.description}</p>
      </div>
      {activity.xpGained && (
        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
          +{activity.xpGained} XP
        </span>
      )}
    </div>
  </div>
);

export { AchievementCard, LearningGoalCard, ActivityCard };
