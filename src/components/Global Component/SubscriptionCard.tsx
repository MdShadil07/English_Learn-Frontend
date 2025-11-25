import React from 'react';
import { motion } from 'framer-motion';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon } from '@/components/Icons/SubscriptionIcons';

interface SubscriptionCardProps {
  subscriptionStatus: 'none' | 'free' | 'basic' | 'premium' | 'pro';
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscriptionStatus,
}) => {
  const currentStatus = subscriptionStatus === 'none' || subscriptionStatus === 'free' ? 'basic' : subscriptionStatus;

  // Free/No subscription card
  if (subscriptionStatus === 'none' || subscriptionStatus === 'free') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="mt-3 relative overflow-hidden bg-gradient-to-br from-gray-50/90 via-slate-50/90 to-zinc-50/90 dark:from-gray-800/30 dark:via-slate-800/30 dark:to-zinc-800/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/30 to-slate-100/30 dark:from-gray-800/15 dark:to-slate-800/15 rounded-2xl"></div>
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-gray-400/60 to-slate-400/60 animate-pulse"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-slate-400/40 to-gray-400/40 animate-pulse delay-500"></div>

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-gray-500 to-slate-600 text-white shadow-lg"
          >
            <FreePlanIcon size="md" className="flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">Free Plans</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Limited Features</p>
          </div>
        </div>

        {/* Decorative progress ring */}
        <div className="absolute top-2 right-8 w-6 h-6 rounded-full border-2 border-gray-400/30 dark:border-gray-600/30 animate-pulse"></div>
      </motion.div>
    );
  }

  // Basic subscription card
  if (subscriptionStatus === 'basic') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="mt-3 relative overflow-hidden bg-gradient-to-br from-slate-50/90 via-gray-50/90 to-zinc-50/90 dark:from-slate-800/30 dark:via-gray-800/30 dark:to-zinc-800/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-slate-200/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/30 to-gray-100/30 dark:from-slate-800/15 dark:to-gray-800/15 rounded-2xl"></div>
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-slate-400/60 to-gray-400/60 animate-pulse"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-gray-400/40 to-slate-400/40 animate-pulse delay-500"></div>

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 text-white shadow-lg"
          >
            <BasicPlanIcon size="md" className="flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Pro Member</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">₹499/month</p>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">Basic Member</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Core Features Available</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Pro subscription card
  if (subscriptionStatus === 'pro') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="mt-3 relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 dark:from-emerald-900/15 dark:to-teal-900/15 rounded-2xl"></div>
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400/60 to-teal-400/60 animate-pulse"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-teal-400/40 to-emerald-400/40 animate-pulse delay-500"></div>
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg"
          >
            <span className="text-sm">⭐</span>
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">Pro Member</p>
            <p className="text-xs text-purple-600 dark:text-purple-400">Advanced Features</p>
          </div>
        </div>

        {/* Decorative progress ring */}
        <div className="absolute top-2 right-8 w-6 h-6 rounded-full border-2 border-purple-400/30 dark:border-purple-600/30 animate-pulse"></div>
      </motion.div>
    );
  }

  // Premium subscription card
  if (subscriptionStatus === 'premium') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
        className="mt-3 relative overflow-hidden bg-gradient-to-br from-yellow-50/90 via-amber-50/90 to-orange-50/90 dark:from-yellow-900/30 dark:via-amber-900/30 dark:to-orange-900/30 backdrop-blur-xl rounded-2xl px-3 py-2 border border-yellow-200/50 dark:border-yellow-800/50 shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 to-amber-100/30 dark:from-yellow-900/15 dark:to-amber-900/15 rounded-2xl"></div>
        <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400/60 to-orange-400/60 animate-pulse"></div>
        <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-gradient-to-br from-orange-400/40 to-yellow-400/40 animate-pulse delay-500"></div>

        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="p-2 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg"
          >
            <PremiumPlanIcon size="md" className="flex-shrink-0" />
          </motion.div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Premium Member</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">All Features Unlocked</p>
          </div>
        </div>

        {/* Decorative progress ring */}
        <div className="absolute top-2 right-8 w-6 h-6 rounded-full border-2 border-yellow-400/30 dark:border-yellow-600/30 animate-pulse"></div>
      </motion.div>
    );
  }

  return null;
};
