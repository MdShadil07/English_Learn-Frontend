import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { BasicPlanIcon } from '@/components/Icons/SubscriptionIcons';

interface BasicPlanCardProps {
  isPremium?: boolean;
}

const BasicPlanCard: React.FC<BasicPlanCardProps> = ({ isPremium = false }) => {
  const includedFeatures = [
    'Unlimited AI conversations',
    'Full grammar curriculum',
    'Expanded vocabulary',
    'Community access',
    'Basic pronunciation analysis',
    '3 AI personalities',
    'Basic writing feedback'
  ];

  const excludedFeatures = [
    'Private practice rooms'
  ];

  return (
    <div className={`relative ${isPremium ? 'opacity-60' : ''} bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-800 dark:via-blue-900/20 dark:to-indigo-900/10 rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg hover:shadow-2xl hover:border-blue-300/50 dark:hover:border-blue-600/50 hover:bg-gradient-to-br hover:from-blue-50/80 hover:via-indigo-50/60 hover:to-purple-50/40 dark:hover:from-blue-900/30 dark:hover:via-indigo-900/25 dark:hover:to-purple-900/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <BasicPlanIcon size="xl" className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">Basic Plan</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Perfect for getting started</p>
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">$9</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">per month</div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">What's Included</div>
        {includedFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg p-2 -m-2 transition-colors duration-200">
            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        ))}

        <div className="border-t border-slate-200 dark:border-slate-600 pt-3 mt-4">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">Not Available</div>
          {excludedFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 rounded-lg p-2 -m-2 transition-colors duration-200 opacity-60">
              <X className="h-4 w-4 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-500 dark:text-slate-400">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <Button
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 group ${
          isPremium
            ? 'bg-slate-100 text-slate-500 cursor-not-allowed border border-slate-200'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600'
        }`}
        disabled={isPremium}
      >
        {isPremium ? 'Current Plan' : 'Choose Basic'}
      </Button>
    </div>
  );
};

export { BasicPlanCard };
