import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BrainCircuit, Sparkles, Rocket, TrendingUp, Zap, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface AiCoachInsightsCardProps {
  isPremium: boolean;
  insights: {
    headline: string;
    strength: {
      area: string;
      metric: string;
    };
    weakness: {
      area: string;
      metric: string;
    };
    recommendation: string;
  };
}

const AiCoachInsightsCard: React.FC<AiCoachInsightsCardProps> = ({ isPremium, insights }) => {
  if (!isPremium) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className="group"
      >
  <Card className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-3xl border border-amber-200/30 dark:border-amber-700/30 bg-gradient-to-br from-amber-50/90 via-orange-50/90 to-yellow-50/90 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 backdrop-blur-xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[420px]">
          {/* Floating decorative orbs */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-amber-300/20 to-orange-300/20 dark:from-amber-700/20 dark:to-orange-700/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-orange-300/20 to-amber-300/20 dark:from-orange-700/20 dark:to-amber-700/20 blur-2xl group-hover:scale-125 transition-transform duration-500" />
          
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-2 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xl"
          >
            <Lock className="h-10 w-10" />
          </motion.div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unlock Your AI Coach</h3>
          <p className="max-w-xs text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Get personalized insights, guided lessons, and predictive analytics to fast-track your fluency.
          </p>
          <Button className="mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
  <Card className="relative overflow-hidden rounded-3xl border border-cyan-200/30 dark:border-cyan-700/30 bg-gradient-to-br from-white/90 via-cyan-50/50 to-sky-50/80 dark:from-slate-800/90 dark:via-cyan-900/30 dark:to-sky-900/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500 min-h-[420px]">
        {/* Floating decorative orbs */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-cyan-300/20 to-sky-300/20 dark:from-cyan-700/20 dark:to-sky-700/20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-gradient-to-br from-sky-300/20 to-cyan-300/20 dark:from-sky-700/20 dark:to-cyan-700/20 blur-2xl group-hover:scale-125 transition-transform duration-500" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300"
            >
              <BrainCircuit className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">AI Coach Insights</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-normal">Personalized learning analysis</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-5">
          {/* Headline Message */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-white/80 to-cyan-50/60 dark:from-slate-900/60 dark:to-cyan-900/40 p-4 text-center shadow-lg backdrop-blur"
          >
            <p className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{insights.headline}</p>
          </motion.div>

          {/* Strength & Weakness Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/30 dark:to-green-900/30 p-4 backdrop-blur shadow-md"
            >
              <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 dark:text-emerald-300 mb-2">
                <TrendingUp className="h-4 w-4" />
                Top Strength
              </h4>
              <p className="text-base font-black text-slate-900 dark:text-white mb-1">{insights.strength.area}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{insights.strength.metric}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-rose-50/80 to-red-50/80 dark:from-rose-900/30 dark:to-red-900/30 p-4 backdrop-blur shadow-md"
            >
              <h4 className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300 mb-2">
                <Zap className="h-4 w-4" />
                Focus Area
              </h4>
              <p className="text-base font-black text-slate-900 dark:text-white mb-1">{insights.weakness.area}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">{insights.weakness.metric}</p>
            </motion.div>
          </div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-white/40 dark:border-white/10 bg-gradient-to-br from-blue-50/80 to-sky-50/80 dark:from-blue-900/30 dark:to-sky-900/30 p-4 backdrop-blur shadow-md"
          >
            <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">
              <Rocket className="h-4 w-4" />
              Next Step
            </h4>
            <p className="text-sm text-slate-900 dark:text-white leading-relaxed">{insights.recommendation}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AiCoachInsightsCard;
