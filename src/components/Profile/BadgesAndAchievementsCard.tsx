import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { UserProfile } from '@/types/user';

interface BadgesAndAchievementsCardProps {
  profile: UserProfile;
}

const BadgesAndAchievementsCard: React.FC<BadgesAndAchievementsCardProps> = ({ profile }) => {
  return (
    <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl pl-6 pr-6 pt-4 pb-6 shadow-xl border border-indigo-100/50 dark:border-slate-700/50 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/30 to-orange-50/30 dark:from-yellow-900/10 dark:to-orange-900/10"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 dark:from-yellow-800/10 dark:to-orange-800/10 rounded-full blur-2xl"></div>

      {/* Header at the top */}
      <div className="relative flex items-center gap-3 mb-4 pt-2">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Badges & Achievements</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Earned rewards and milestones</p>
        </div>
      </div>

      <div className="relative">
        {profile.achievements && profile.achievements.length > 0 ? (
          <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
            <div className="space-y-4 pl-2 pr-2">
              {profile.achievements.slice(0, 4).map(achievement => (
                <div key={achievement.id} className="bg-gradient-to-r from-white/80 to-yellow-50/80 dark:from-slate-800/80 dark:to-slate-700/80 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-800/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 flex-shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">{achievement.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{achievement.description}</p>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                          achievement.rarity === 'epic' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                          achievement.rarity === 'rare' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                          'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                        }`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-500 font-medium">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {profile.achievements.length > 4 && (
                <div className="text-center mt-4">
                  <Button variant="outline" className="text-sm bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-300">
                    View All {profile.achievements.length} Achievements
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Trophy className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base font-medium mb-2">No achievements yet</p>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-500">Complete lessons to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesAndAchievementsCard;
