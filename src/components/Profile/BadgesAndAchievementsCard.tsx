import React from 'react';
import { Trophy } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { UserProfile } from '@/types/user';

interface BadgesAndAchievementsCardProps {
  profile: UserProfile;
}

const BadgesAndAchievementsCard: React.FC<BadgesAndAchievementsCardProps> = ({ profile }) => {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 border border-emerald-200/40 dark:border-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.15)] p-4 sm:p-5 md:p-8 transition-all duration-500">
      {/* Background decorative elements matching AIChatPage pulses */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute -top-[20%] -right-[10%] w-[55%] h-[55%] bg-yellow-300/20 dark:bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none animate-[pulse_8s_ease-in-out_infinite] z-0 group-hover:bg-yellow-400/20 transition-colors duration-700"></div>
      <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-[70px] pointer-events-none animate-[pulse_10s_ease-in-out_infinite_1s] z-0 group-hover:bg-orange-400/20 transition-colors duration-700"></div>

      {/* Header at the top */}
      <div className="relative flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pt-1 sm:pt-2">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white">Badges & Achievements</h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 dark:text-slate-400">Earned rewards and milestones</p>
        </div>
      </div>

      <div className="relative">
        {profile.achievements && profile.achievements.length > 0 ? (
          <div className="max-h-[350px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto scrollbar-hide">
            <div className="space-y-3 sm:space-y-4 pl-1 sm:pl-2 pr-1 sm:pr-2">
              {profile.achievements.slice(0, 4).map(achievement => (
                <div key={achievement.id} className="bg-white/40 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-yellow-200/40 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-2xl sm:text-3xl p-1.5 sm:p-2 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl border border-yellow-200/50 dark:border-yellow-800/50 flex-shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base mb-1">{achievement.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2 sm:mb-3">{achievement.description}</p>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-full font-semibold ${achievement.rarity === 'legendary' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                            achievement.rarity === 'epic' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' :
                              achievement.rarity === 'rare' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' :
                                'bg-gradient-to-r from-gray-500 to-slate-500 text-white'
                          }`}>
                          {achievement.rarity}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-500 font-medium">
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {profile.achievements.length > 4 && (
                <div className="text-center mt-3 sm:mt-4">
                  <Button variant="outline" className="text-xs sm:text-sm bg-white/80 dark:bg-slate-800/80 border-indigo-200 dark:border-slate-600 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all duration-300">
                    View All {profile.achievements.length} Achievements
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-10 md:py-12">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
              <Trophy className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base font-medium mb-1 sm:mb-2">No achievements yet</p>
            <p className="text-[10px] sm:text-xs md:text-sm text-slate-500 dark:text-slate-500">Complete lessons to earn badges!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgesAndAchievementsCard;
