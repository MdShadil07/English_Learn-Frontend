import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Trophy, Calendar, MapPin, Award } from 'lucide-react';
import { UserProfile } from '@/types/user';

interface EducationJourneyCardProps {
  profile: UserProfile;
}

const EducationJourneyCard: React.FC<EducationJourneyCardProps> = ({ profile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      {/* Enhanced Floating Icons */}
      <motion.div
        className="absolute top-4 left-4 text-emerald-500/40 dark:text-emerald-400/30 hidden sm:block"
        animate={{
          y: [-8, 8, -8],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <BookOpen className="h-6 w-6 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -3, 3, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Trophy className="h-5 w-5 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{
              rotate: [0, -10, 10, 0],
              transition: { duration: 0.5 }
            }}
          >
            <GraduationCap className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Educational Journey
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Your academic achievements and progress
            </p>
          </div>
        </motion.div>

        {/* Enhanced Timeline */}
        <div className="relative">
          {/* Timeline Line - Only show when there is data */}
          {profile.educationalQualifications && profile.educationalQualifications.length > 0 && (
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-200 via-teal-200 to-cyan-200 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700"></div>
          )}

          {profile.educationalQualifications && profile.educationalQualifications.length > 0 ? (
            <div className="space-y-6">
              {profile.educationalQualifications.length > 2 ? (
                <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                  {profile.educationalQualifications.map((education, index) => (
                    <motion.div
                      key={education.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                      className="group/item relative flex items-start gap-4 sm:gap-6 mb-6"
                    >
                      {/* Enhanced Timeline Node */}
                      <motion.div
                        className={`relative z-10 w-12 h-12 rounded-full border-4 border-white/90 dark:border-slate-800/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
                          index === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                          index === profile.educationalQualifications!.length - 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                          'bg-gradient-to-br from-purple-500 to-pink-600'
                        } group-hover/item:scale-110`}
                        animate={{
                          rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                      >
                        {index === 0 ? (
                          <BookOpen className="h-6 w-6 text-white" />
                        ) : index === profile.educationalQualifications!.length - 1 ? (
                          <Trophy className="h-6 w-6 text-white" />
                        ) : (
                          <GraduationCap className="h-6 w-6 text-white" />
                        )}
                      </motion.div>

                      {/* Enhanced Education Card */}
                      <div className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <div className="space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{education.degree}</h4>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                  education.graduationYear >= new Date().getFullYear()
                                    ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50'
                                    : 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50'
                                }`}>
                                  {education.graduationYear >= new Date().getFullYear() ? 'In Progress' : 'Completed'}
                                </span>
                              </div>

                              <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                                {education.fieldOfStudy} • {education.institution}
                              </p>

                              {education.location && (
                                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                  <MapPin className="h-4 w-4" />
                                  {education.location}
                                </div>
                              )}

                              <div className="flex flex-wrap gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{education.startYear || education.graduationYear - 4} - {education.graduationYear}</span>
                                </div>
                                {education.gpa && (
                                  <div className="flex items-center gap-1">
                                    <Award className="h-4 w-4" />
                                    <span>GPA: {education.gpa}</span>
                                  </div>
                                )}
                              </div>

                              {education.description && (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 italic bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                                  "{education.description}"
                                </p>
                              )}
                            </div>

                            {/* Journey Path Indicator */}
                            <div className="hidden lg:flex flex-col items-center gap-2">
                              <div className={`w-3 h-3 rounded-full shadow-lg ${
                                index === 0 ? 'bg-blue-500' :
                                index === profile.educationalQualifications!.length - 1 ? 'bg-emerald-500' :
                                'bg-purple-500'
                              }`}></div>
                              {index < profile.educationalQualifications!.length - 1 && (
                                <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600 rounded-full"></div>
                              )}
                            </div>
                          </div>

                          {education.achievements && education.achievements.length > 0 && (
                            <div className="pt-2 border-t border-emerald-200/30 dark:border-emerald-700/30">
                              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                                <Trophy className="h-4 w-4" />
                                Achievements:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {education.achievements.map((achievement, i) => (
                                  <motion.span
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="px-3 py-1 bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm"
                                  >
                                    {achievement}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                profile.educationalQualifications.map((education, index) => (
                  <motion.div
                    key={education.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    className="group/item relative flex items-start gap-4 sm:gap-6"
                  >
                    {/* Enhanced Timeline Node */}
                    <motion.div
                      className={`relative z-10 w-12 h-12 rounded-full border-4 border-white/90 dark:border-slate-800/90 shadow-lg flex items-center justify-center transition-all duration-300 ${
                        index === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' :
                        index === profile.educationalQualifications!.length - 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-600' :
                        'bg-gradient-to-br from-purple-500 to-pink-600'
                      } group-hover/item:scale-110`}
                      animate={{
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                    >
                      {index === 0 ? (
                        <BookOpen className="h-6 w-6 text-white" />
                      ) : index === profile.educationalQualifications!.length - 1 ? (
                        <Trophy className="h-6 w-6 text-white" />
                      ) : (
                        <GraduationCap className="h-6 w-6 text-white" />
                      )}
                    </motion.div>

                    {/* Enhanced Education Card */}
                    <div className="flex-1 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-6 border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{education.degree}</h4>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                                education.graduationYear >= new Date().getFullYear()
                                  ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50'
                                  : 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/50'
                              }`}>
                                {education.graduationYear >= new Date().getFullYear() ? 'In Progress' : 'Completed'}
                              </span>
                            </div>

                            <p className="text-emerald-700 dark:text-emerald-300 font-medium">
                              {education.fieldOfStudy} • {education.institution}
                            </p>

                            {education.location && (
                              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                                <MapPin className="h-4 w-4" />
                                {education.location}
                              </div>
                            )}

                            <div className="flex flex-wrap gap-4 text-sm text-emerald-600 dark:text-emerald-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{education.startYear || education.graduationYear - 4} - {education.graduationYear}</span>
                              </div>
                              {education.gpa && (
                                <div className="flex items-center gap-1">
                                  <Award className="h-4 w-4" />
                                  <span>GPA: {education.gpa}</span>
                                </div>
                              )}
                            </div>

                            {education.description && (
                              <p className="text-sm text-emerald-600 dark:text-emerald-400 italic bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30">
                                "{education.description}"
                              </p>
                            )}
                          </div>

                          {/* Journey Path Indicator */}
                          <div className="hidden lg:flex flex-col items-center gap-2">
                            <div className={`w-3 h-3 rounded-full shadow-lg ${
                              index === 0 ? 'bg-blue-500' :
                              index === profile.educationalQualifications!.length - 1 ? 'bg-emerald-500' :
                              'bg-purple-500'
                            }`}></div>
                            {index < profile.educationalQualifications!.length - 1 && (
                              <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-300 to-teal-300 dark:from-emerald-600 dark:to-teal-600 rounded-full"></div>
                            )}
                          </div>
                        </div>

                        {education.achievements && education.achievements.length > 0 && (
                          <div className="pt-2 border-t border-emerald-200/30 dark:border-emerald-700/30">
                            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3 flex items-center gap-2">
                              <Trophy className="h-4 w-4" />
                              Achievements:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {education.achievements.map((achievement, i) => (
                                <motion.span
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + i * 0.1 }}
                                  className="px-3 py-1 bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium border border-amber-200/50 dark:border-amber-700/50 backdrop-blur-sm"
                                >
                                  {achievement}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          ) : (
            /* Full-width empty state when no education data */
            <div className="w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center py-12"
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-slate-100/80 to-slate-200/80 dark:from-slate-700/50 dark:to-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <GraduationCap className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </motion.div>
                <h4 className="text-slate-900 dark:text-slate-100 font-semibold mb-2">No Education Yet</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">Add your educational qualifications to showcase your academic journey!</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 -z-10"></div>
      </div>
    </motion.div>
  );
};

export default EducationJourneyCard;
