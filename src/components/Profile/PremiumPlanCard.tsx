import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Award, Star } from 'lucide-react';
import { PremiumPlanIcon } from '@/components/Icons/SubscriptionIcons';

interface PremiumPlanCardProps {
  isPremium: boolean;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ isPremium }) => {
  const includedFeatures = [
    'Unlimited AI conversations',
    'Complete curriculum',
    'Comprehensive vocabulary',
    'Priority community access',
    'Advanced pronunciation analysis',
    'All 5 AI personalities',
    'Advanced writing feedback',
    'Private practice rooms'
  ];

  return (
    <div className={`relative ${isPremium ? 'ring-2 ring-amber-400 shadow-2xl' : 'hover:shadow-2xl'} bg-gradient-to-br from-amber-50 via-yellow-50/80 to-orange-50/60 dark:from-amber-900/20 dark:via-yellow-900/15 dark:to-orange-900/10 rounded-2xl p-6 border border-amber-200/60 dark:border-amber-800/60 shadow-xl hover:shadow-2xl hover:border-amber-300/70 dark:hover:border-amber-600/70 hover:bg-gradient-to-br hover:from-amber-50/90 hover:via-yellow-50/85 hover:to-orange-50/70 dark:hover:from-amber-900/25 dark:hover:via-yellow-900/20 dark:hover:to-orange-900/15 transition-all duration-500 hover:scale-[1.02] cursor-pointer`}>
      {isPremium && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <Award className="h-4 w-4" />
          Premium Active
          <Star className="h-4 w-4 text-yellow-200" />
        </div>
      )}

      <div className="text-center mb-6">
        <div className="flex items-center justify-center mx-auto mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
            <PremiumPlanIcon size="xl" className="text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors duration-300">Premium Plan</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">Unlock your full potential</p>
        <div className="text-4xl font-bold text-slate-900 dark:text-white mb-1">$19</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">per month</div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-3">Premium Features</div>
        {includedFeatures.map((feature, index) => (
          <div key={index} className="flex items-center gap-3 hover:bg-amber-50/50 dark:hover:bg-amber-900/20 rounded-lg p-2 -m-2 transition-colors duration-200">
            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
          </div>
        ))}

        {/* Premium badge */}
        <div className="mt-4 p-3 bg-gradient-to-r from-amber-100/50 to-yellow-100/50 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-lg border border-amber-200/40 dark:border-amber-800/40 hover:bg-gradient-to-r hover:from-amber-100/70 hover:to-yellow-100/70 dark:hover:from-amber-900/40 dark:hover:to-yellow-900/40 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <Zap className="h-4 w-4" />
            <span className="text-xs font-semibold">Everything in Basic + Premium Exclusives</span>
          </div>
        </div>
      </div>

      <Button
        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 group ${
          isPremium
            ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:from-amber-300 hover:via-yellow-300 hover:to-orange-400'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500'
        }`}
        disabled={isPremium}
      >
        {isPremium ? (
          <>
            <Award className="h-4 w-4 mr-2" />
            Premium Active
          </>
        ) : (
          <>
            <Zap className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </>
        )}
      </Button>

      {!isPremium && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors duration-200">
            <Star className="h-3 w-3" />
            7-day free trial included
          </div>
        </div>
      )}
    </div>
  );
};

export { PremiumPlanCard };
