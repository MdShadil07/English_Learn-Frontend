import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, ShieldAlert, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export const InventoryCard: React.FC = () => {
  const inventory = [
    { id: 1, name: 'Streak Freeze', icon: Flame, count: 2, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10' },
    { id: 2, name: 'XP Boost', icon: Zap, count: 1, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { id: 3, name: 'Correction Coins', icon: Coins, count: 1250, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 100 }}
      className="group relative h-full w-full rounded-[2rem] sm:rounded-[2.5rem] p-[1px] bg-emerald-200/40 dark:bg-emerald-500/10 shadow-xl dark:shadow-[0_8px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-500"
    >
      <div className="relative w-full h-full rounded-[1.95rem] sm:rounded-[2.45rem] bg-white/88 sm:backdrop-blur-2xl dark:bg-[#050C14]/60 overflow-hidden flex flex-col p-5 sm:p-6">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="relative z-10 flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shrink-0">
          <ShieldAlert className="h-6 w-6 sm:h-7 sm:w-7 text-white drop-shadow-sm" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight truncate">Inventory</h3>
          <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 truncate">Power-ups & Items</p>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-2">
        {inventory.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700/50">
              <div className="flex items-center gap-4">
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl shadow-sm", item.bg, item.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[15px] font-bold text-slate-700 dark:text-slate-200">{item.name}</span>
              </div>
              <div className="flex items-center justify-center min-w-[3.5rem] px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[14px] font-black text-slate-600 dark:text-slate-300 shadow-sm">
                {item.count > 100 ? item.count.toLocaleString() : `x${item.count}`}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="relative z-10 mt-6">
        <button className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[13px] font-bold tracking-wide hover:scale-[1.02] transition-transform shadow-sm">
          Visit Shop
        </button>
      </div>
      </div>
    </motion.div>
  );
};
