import React from 'react';
import { Trophy, Target, Clock, BookOpen } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalSessions: number;
    totalXP: number;
    currentStreak: number;
    accuracy: number;
    vocabulary: number;
    grammar: number;
    pronunciation: number;
    fluency: number;
    completedLessons: number;
    totalStudyTime: number;
    averageSessionLength: number;
  };
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 text-center">
        <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mx-auto mb-2" />
        <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{stats.totalXP.toLocaleString()}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Total XP</div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 text-center">
        <Target className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 mx-auto mb-2" />
        <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{stats.accuracy}%</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Accuracy</div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 text-center">
        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 mx-auto mb-2" />
        <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{formatTime(stats.totalStudyTime)}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Study Time</div>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/50 text-center">
        <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 mx-auto mb-2" />
        <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">{stats.completedLessons}</div>
        <div className="text-xs text-slate-600 dark:text-slate-400">Lessons</div>
      </div>
    </div>
  );
};

export default ProfileStats;
