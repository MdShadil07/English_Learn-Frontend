import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Award, Clock, Globe, Linkedin, Twitter, Github, Facebook, Instagram, ExternalLink } from 'lucide-react';
import { LinkedinIcon, TwitterIcon, GithubIcon, InstagramIcon, FacebookIcon } from '../../components/Icons/index';
import { UserProfile } from '@/types/user';

interface PersonalInformationCardProps {
  profile: UserProfile;
}

const PersonalInformationCard: React.FC<PersonalInformationCardProps> = ({ profile }) => {
  // Calculate member since date
  const memberSince = new Date(profile.joinedDate).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  // Calculate total achievements
  const totalAchievements = profile.achievements?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg group-hover:scale-125 transition-transform duration-500"></div>

      {/* Enhanced Floating Icons */}
      <motion.div
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-emerald-500/40 sm:text-emerald-500/50 dark:text-emerald-400/30 dark:sm:text-emerald-400/40 hidden sm:block"
        animate={{
          y: [-8, 8, -8],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <User className="h-6 w-6 sm:h-8 sm:w-8 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute top-6 right-6 sm:top-10 sm:right-10 text-teal-500/40 sm:text-teal-500/50 dark:text-teal-400/30 dark:sm:text-teal-400/40 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -3, 3, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Globe className="h-5 w-5 sm:h-7 sm:w-7 drop-shadow-lg" />
      </motion.div>
      <motion.div
        className="absolute bottom-12 left-8 sm:bottom-20 sm:left-12 text-cyan-500/40 sm:text-cyan-500/50 dark:text-cyan-400/30 dark:sm:text-cyan-400/40 hidden sm:block"
        animate={{
          y: [-6, 6, -6],
          x: [-3, 3, -3],
          rotate: [0, 8, -8, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Calendar className="h-6 w-6 sm:h-9 sm:w-9 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-6 sm:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
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
            <User className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Profile Overview
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Your learning journey and achievements
            </p>
          </div>
        </motion.div>

        {/* Enhanced Profile Stats Cards */}
        <div className="space-y-6 mb-8">
          {/* Member Since */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="group"
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-5 border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  animate={{
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
                >
                  <Calendar className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1 block">
                    Member Since
                  </label>
                  <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ y: -2, scale: 1.02 }}
            className="group"
          >
            <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-5 border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                >
                  <Award className="h-5 w-5 text-white" />
                </motion.div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1 block">
                    Achievements
                  </label>
                  <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    {totalAchievements} Badges Earned
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Location */}
          {profile.location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ y: -2, scale: 1.02 }}
              className="group"
            >
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl p-5 border border-emerald-200/40 dark:border-emerald-700/40 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                    animate={{
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <MapPin className="h-5 w-5 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1 block">
                      Address
                    </label>
                    <div className="space-y-1">
                      <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                        {profile.address || profile.location}
                      </p>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">
                        {profile.address && (
                          <span>{profile.address}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Social Media Section */}
        {profile.socialHandles && Object.keys(profile.socialHandles).some(key => profile.socialHandles?.[key as keyof typeof profile.socialHandles]) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="space-y-3"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0 }}
              className="flex items-center gap-2 mb-4"
            >
              <motion.div
                className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                animate={{
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              >
                <Globe className="h-4 w-4 text-white" />
              </motion.div>
              <div>
                <h4 className="text-base font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  Connect With Me
                </h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  Find me on social platforms
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {profile.socialHandles?.linkedin && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 dark:border-blue-700/40 hover:bg-gradient-to-br hover:from-blue-100/90 hover:to-indigo-100/90 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Linkedin className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">LinkedIn</span>
                </motion.a>
              )}

              {profile.socialHandles?.twitter && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-900/30 dark:to-blue-900/30 backdrop-blur-xl rounded-2xl border border-sky-200/40 dark:border-sky-700/40 hover:bg-gradient-to-br hover:from-sky-100/90 hover:to-blue-100/90 dark:hover:from-sky-900/40 dark:hover:to-blue-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Twitter className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-sky-800 dark:text-sky-200">Twitter</span>
                </motion.a>
              )}

              {profile.socialHandles?.github && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-gray-50/80 to-slate-50/80 dark:from-gray-900/30 dark:to-slate-900/30 backdrop-blur-xl rounded-2xl border border-gray-200/40 dark:border-gray-700/40 hover:bg-gradient-to-br hover:from-gray-100/90 hover:to-slate-100/90 dark:hover:from-gray-900/40 dark:hover:to-slate-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-gray-600 to-slate-700 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      y: [-2, 2, -2]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Github className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">GitHub</span>
                </motion.a>
              )}

              {profile.socialHandles?.website && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-purple-50/80 to-violet-50/80 dark:from-purple-900/30 dark:to-violet-900/30 backdrop-blur-xl rounded-2xl border border-purple-200/40 dark:border-purple-700/40 hover:bg-gradient-to-br hover:from-purple-100/90 hover:to-violet-100/90 dark:hover:from-purple-900/40 dark:hover:to-violet-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ExternalLink className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-purple-800 dark:text-purple-200">Website</span>
                </motion.a>
              )}

              {profile.socialHandles?.facebook && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.5, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/30 dark:to-indigo-900/30 backdrop-blur-xl rounded-2xl border border-blue-200/40 dark:border-blue-700/40 hover:bg-gradient-to-br hover:from-blue-100/90 hover:to-indigo-100/90 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Facebook className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-blue-800 dark:text-blue-200">Facebook</span>
                </motion.a>
              )}

              {profile.socialHandles?.instagram && (
                <motion.a
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.4 }}
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={profile.socialHandles.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 p-3 bg-gradient-to-br from-pink-50/80 to-rose-50/80 dark:from-pink-900/30 dark:to-rose-900/30 backdrop-blur-xl rounded-2xl border border-pink-200/40 dark:border-pink-700/40 hover:bg-gradient-to-br hover:from-pink-100/90 hover:to-rose-100/90 dark:hover:from-pink-900/40 dark:hover:to-rose-900/40 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 8, -8, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Instagram className="h-3 w-3 text-white" />
                  </motion.div>
                  <span className="text-xs font-medium text-pink-800 dark:text-pink-200">Instagram</span>
                </motion.a>
              )}
            </div>
          </motion.div>
        )}

        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-500 -z-10"></div>
      </div>
    </motion.div>
  );
};

export default PersonalInformationCard;
               