import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Zap, Award, Star, Sparkles } from 'lucide-react';
import { PremiumPlanIcon } from '@/components/Icons/SubscriptionIcons';
import { cn } from '@/lib/utils';

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
    <div className={cn(
      "relative overflow-hidden rounded-[1.5rem] p-6 transition-all duration-300",
      "bg-white dark:bg-[#050C14] border shadow-lg cursor-pointer group/card",
      isPremium 
        ? "border-amber-200 dark:border-amber-500/30 shadow-amber-500/10" 
        : "border-slate-200 dark:border-emerald-500/20 hover:border-amber-300 dark:hover:border-amber-500/40"
    )}>
      {/* Noise Texture Overlay for Holographic Feel (Static & Cheap to render) */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
      
      {/* Static Radial Glows (Optimized for low-end devices - no heavy animations) */}
      <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-[60px] pointer-events-none z-0"></div>
      <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-orange-400/10 dark:bg-orange-600/10 blur-[50px] pointer-events-none z-0"></div>

      <div className="relative z-10">
        {isPremium && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
            <Award className="h-3 w-3" />
            Active
            <Sparkles className="h-3 w-3 text-amber-100" />
          </div>
        )}

        <div className="text-center mb-6 mt-4">
          <div className="flex items-center justify-center mx-auto mb-4">
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center shadow-md",
              "bg-gradient-to-br from-amber-400 to-orange-600 border border-amber-300/50 dark:border-amber-500/50"
            )}>
              <PremiumPlanIcon size="lg" className="text-white drop-shadow-sm" />
            </div>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Premium Plan</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Unlock your full potential</p>
          <div className="flex items-end justify-center gap-1">
            <div className="text-4xl font-black text-slate-900 dark:text-white leading-none">$19</div>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-widest">/ mo</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="text-[10px] font-black text-amber-500 dark:text-amber-400 uppercase tracking-[0.2em] mb-4 text-center">Premium Features</div>
          <div className="grid grid-cols-1 gap-2">
            {includedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-1.5 rounded-lg group/feature">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center border border-amber-200 dark:border-amber-500/30">
                  <Check className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 group-hover/feature:text-slate-900 dark:group-hover/feature:text-white transition-colors">{feature}</span>
              </div>
            ))}
          </div>

          {/* Premium badge */}
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200/50 dark:border-amber-500/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <Zap className="h-4 w-4 flex-shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider leading-tight">Everything in Basic + Premium Exclusives</span>
            </div>
          </div>
        </div>

        <Button
          className={cn(
            "w-full h-12 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300",
            isPremium
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 hover:bg-amber-100 dark:hover:bg-amber-500/20"
              : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
          )}
          disabled={isPremium}
        >
          {isPremium ? (
            <>
              <Award className="h-4 w-4 mr-2" />
              Current Plan
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </>
          )}
        </Button>

        {!isPremium && (
          <div className="mt-4 flex justify-center">
            <div className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-200/50 dark:border-amber-500/20">
              <Star className="h-3 w-3" />
              <span className="text-[9px] font-black uppercase tracking-widest">7-day free trial</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { PremiumPlanCard };
