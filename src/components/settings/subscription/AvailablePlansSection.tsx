import React from 'react';
import { PricingCard } from '@/components/Global Component/PricingCard';

interface AvailablePlansSectionProps {
  currentSubscription: any;
  plans: any[];
  onUpgrade: (planId: string) => void;
}

const AvailablePlansSection: React.FC<AvailablePlansSectionProps> = ({ currentSubscription, plans, onUpgrade }) => {
  const currentPlanCode = currentSubscription?.status === 'active' ? (currentSubscription.planCode || currentSubscription.tier?.toUpperCase()) : 'FREE';

  const displayPlans = plans;

  return (
    <div id="available-plans" className="pt-8">
      <div className="mb-8 text-center md:text-left">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Available Plans</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Choose the right plan to accelerate your English learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto md:mx-0">
        {displayPlans.map((plan: any, index: number) => {
          const planCodeValue = plan.code || plan.planCode || plan.tier?.toUpperCase();
          const planTierUpper = plan.tier?.toUpperCase();
          const isCurrentPlan = currentPlanCode === planCodeValue || currentPlanCode === planTierUpper;
          const isPopular = plan.isPopular || planCodeValue === 'PRO_MONTHLY' || plan.tier === 'pro';
          
          // Price in DB is often in paisa/cents. If price > 1000, it's likely paisa.
          const displayPrice = plan.price > 1000 ? (plan.price / 100) : plan.price;

          const colorMap: Record<string, 'slate' | 'emerald' | 'purple'> = {
            'free': 'slate',
            'pro': 'emerald',
            'premium': 'purple'
          };

          const cardColor = colorMap[plan.tier || 'free'] || 'slate';

          // Map backend features to PricingCard format
          const cardFeatures = [
            { title: plan.features?.aiMessages > 100 ? 'Unlimited AI conversations' : `${plan.features?.aiMessages || 5} AI conversations/day`, included: true },
            { title: 'Pronunciation analysis', included: true },
            { title: 'Advanced writing feedback', included: plan.tier === 'pro' || plan.tier === 'premium' },
            { title: 'Priority support', included: !!plan.features?.prioritySupport },
            { title: 'Private practice rooms', included: plan.tier === 'premium' },
          ];

          return (
            <div key={plan._id || planCodeValue} className="relative w-full h-full">
              {isCurrentPlan && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                    Active Plan
                  </span>
                </div>
              )}
              <PricingCard
                id={plan._id || planCodeValue}
                name={plan.name}
                description={plan.description || (plan.price === 0 ? 'Perfect for getting started' : 'For serious learners')}
                price={displayPrice}
                period={plan.billingPeriod || plan.interval || 'monthly'}
                billingText={plan.price === 0 ? 'No credit card required' : 'Billed securely via Razorpay'}
                features={cardFeatures}
                cta={isCurrentPlan ? 'Current Plan' : (plan.price === 0 ? 'Downgrade to Free' : 'Upgrade Now')}
                color={cardColor}
                popular={isPopular && !isCurrentPlan}
                index={index}
                onCtaClick={() => !isCurrentPlan && onUpgrade(plan._id || planCodeValue)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailablePlansSection;
