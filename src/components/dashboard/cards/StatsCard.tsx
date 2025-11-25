import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Stat {
  label: string;
  value: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface StatsCardProps {
  stats: Stat[];
}

const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3 + index * 0.1 }}
          whileHover={{ y: -5, scale: 1.05 }}
          className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/80 to-emerald-50/60 dark:from-slate-800/80 dark:to-emerald-900/30 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30"
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index }}
              className={`p-3 rounded-2xl text-white shadow-lg ${stat.bgColor} bg-gradient-to-br ${stat.color.includes('yellow') ? 'from-yellow-400 to-amber-500' : 'from-emerald-500 to-teal-500'}`}
            >
              <stat.icon className="h-5 w-5" />
            </motion.div>
            <div className="text-xl font-bold text-emerald-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{stat.label}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCard;
