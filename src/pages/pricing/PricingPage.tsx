import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown, HelpCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { PricingCard } from '@/components/Global Component/PricingCard';
import PricingFeatures from '@/components/pricing/PricingFeatures';
import PricingComparison from '@/components/pricing/PricingComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import SubscribeCTA from '@/components/pricing/SubscribeCTA';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api } from '@/utils/api';
import useSubscriptionSSE from '@/hooks/useSubscriptionSSE';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mapBackendPlansToPricingTiers, defaultFallbackPlans } from '@/components/pricing/PricingUtils';
import CheckoutModal from '@/components/settings/subscription/CheckoutModal';
import { SupportTicketModal } from '@/components/support/SupportTicketModal';

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [pricingTiers, setPricingTiers] = useState<any[]>(defaultFallbackPlans);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [plansByTier, setPlansByTier] = useState<Record<string, unknown>>({});
  const [mySubscription, setMySubscription] = useState<unknown | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<PricingTier | null>(null);
  const [rawBackendPlans, setRawBackendPlans] = useState<any[]>([]);
  const { toast } = useToast();



  // Load backend plans and pricing configuration
  React.useEffect(() => {
    let mounted = true;
    
    // Fetch pricing configuration from backend
    (async () => {
      try {
        const result = await api.payment.getPricingConfig();
        if (!mounted) return;
        const resObj = result as unknown as { success?: boolean; pricing?: { pro: { monthly: number; yearly: number }; premium: { monthly: number; yearly: number } } };
        if (resObj && resObj.success && resObj.pricing) {
          setPricingConfig(resObj.pricing);
        }
      } catch (err) {
        console.debug('Failed to load pricing config', err);
      }
    })();
    
    // Load backend plans
    (async () => {
      try {
        const result = await api.payment.getPlans();
        if (!mounted) return;
        const resObj = result as unknown as { success?: boolean; plans?: any[] };
        if (resObj && resObj.success && resObj.plans) {
          setRawBackendPlans(resObj.plans);
          const mapped = mapBackendPlansToPricingTiers(resObj.plans);
          // sort so free is first, then cheapest to most expensive
          mapped.sort((a, b) => a.price.monthly - b.price.monthly);
          setPricingTiers(mapped);
        }
      } catch (err) {
        console.debug('Failed to load plans', err);
      } finally {
        if (mounted) setIsLoadingPlans(false);
      }
    })();
    // also load current user's subscription to guard trial CTA
    (async () => {
      try {
        const me = await api.payment.getMySubscription();
        const meObj = me as unknown as { success?: boolean; subscription?: unknown };
        if (mounted && meObj && meObj.success) setMySubscription(meObj.subscription ?? null);
      } catch (e) {
        // ignore - user may be unauthenticated
      }
    })();
    return () => { mounted = false };
  }, []);



  // Listen for realtime updates and refresh subscription snapshot
  useSubscriptionSSE(async (event) => {
    try {
      if (!event || !event.payload) return;
      const payload = event.payload;
      // If event looks like subscription update, refresh
      if (
        payload &&
        typeof payload === 'object' &&
        payload !== null &&
        'type' in payload &&
        typeof (payload as { type?: string }).type === 'string' &&
        (
          (payload as { type: string }).type.startsWith('subscription_') ||
          (payload as { type: string }).type === 'subscription_provisioned' ||
          (payload as { type: string }).type === 'subscription_charged'
        )
      ) {
        try {
          const me = await api.payment.getMySubscription();
          const meObj = me as unknown as { success?: boolean; subscription?: unknown };
          if (meObj && meObj.success) setMySubscription(meObj.subscription ?? null);
        } catch (e) {
          console.debug('Failed to refresh subscription after SSE event', e);
        }
      }
    } catch (e) {
      console.debug('SSE event handler error', e);
    }
  }, true);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0B1120]">
      {/* SaaS mesh gradient background */}
      <div className="absolute top-0 left-0 right-0 h-[600px] w-full overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-900/40 pointer-events-none" />
        <div className="absolute top-20 -left-20 w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-[100px] dark:bg-teal-900/30 pointer-events-none" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-700 dark:from-white dark:via-emerald-300 dark:to-teal-300">
            Simple, Transparent Pricing
          </h1>

          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8">
            Choose the perfect plan to accelerate your English learning journey. All plans include access to our innovative AI learning platform.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={cn('text-sm font-medium', billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400')}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'yearly'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
            />
            <span className={cn('text-sm font-medium flex items-center', billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400')}>
              Yearly
              {billingCycle === 'yearly' && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full"
                >
                  Save 20%
                </motion.span>
              )}
            </span>
          </div>
        </motion.div>

        {/* Pricing cards - grid layout with refined styling */}
        {!isLoadingPlans && pricingTiers.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 px-6 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm mb-16">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800/50 text-slate-400 rounded-full flex items-center justify-center mb-6">
              <Crown className="w-8 h-8 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Our plans are getting an upgrade!</h3>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">We are currently crafting new, high-value subscription packages tailored for your fluency journey. Check back soon for exclusive early-bird offers.</p>
            <Button variant="outline" className="rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
              Notify Me When Available
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {isLoadingPlans && pricingTiers.length === 0 && <div className="col-span-3 text-center py-20">Loading plans...</div>}
            {pricingTiers.map((tier, index) => {
              let activeTier = 'free';
              if (mySubscription) {
                const subStatus = (mySubscription as any).status;
                // Only consider the subscription active if it's actually active, trialing, or past_due.
                // 'created' means they started the checkout process but haven't paid yet!
                if (subStatus === 'active' || subStatus === 'trialing' || subStatus === 'past_due') {
                  activeTier = (mySubscription as any).tier || 'free';
                }
              } else if (user) {
                const subStatus = (user as any).subscriptionStatus;
                if (subStatus === 'active') {
                  activeTier = user.tier || 'free';
                }
              }

              const isCurrentPlan = activeTier === tier.id;
              const isHigherPlan = 
                (activeTier === 'premium' && tier.id !== 'premium') || 
                (activeTier === 'pro' && tier.id === 'free');

              return (
              <PricingCard
                key={tier.id}
                id={tier.id}
                name={tier.name}
                description={tier.description}
                price={billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly}
                period={billingCycle}
                billingText={billingCycle === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                features={tier.features}
                cta={isCurrentPlan ? 'Current Plan' : isHigherPlan ? 'Downgrade' : tier.cta}
                color={tier.color}
                popular={tier.popular}
                index={index}
                onCtaClick={async () => {
                  if (isCurrentPlan) return;
                  
                  // Direct upgrade flow for paid plans
                  if (tier.price && (billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly) > 0) {
                    // Open the upgrade modal
                    setUpgradeTier(tier);
                    setShowUpgradeModal(true);
                  } else {
                    // Free plan or fallback
                    if (user) {
                       toast({ title: 'Downgrade', description: 'Please contact support to downgrade your plan.', duration: 5000 });
                    } else {
                      toast({ title: 'Free plan selected', description: 'Redirecting to signup', duration: 3000 });
                      window.location.href = '/auth/signup';
                    }
                  }
                }}
              />
            )})}
          </div>
        )}

        {/* Extra sections: features, comparison, subscribe, faq */}
        <PricingFeatures />
        <PricingComparison />
        <SubscribeCTA />
        <PricingFAQ />
      </div>
      
      {/* Checkout Modal */}
      {showUpgradeModal && upgradeTier && (
        <CheckoutModal
          planId={billingCycle === 'yearly' ? upgradeTier._yearlyId : upgradeTier._monthlyId}
          plans={rawBackendPlans}
          onClose={() => {
            setShowUpgradeModal(false);
            setUpgradeTier(null);
          }}
          onSuccess={() => {
            setShowUpgradeModal(false);
            setUpgradeTier(null);
            window.location.href = '/dashboard';
          }}
        />
      )}

      {/* Floating Support Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-xl dark:bg-black/80 text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(244,63,94,0.25)] hover:shadow-[0_8px_40px_rgba(244,63,94,0.4)] border border-rose-500/30 hover:border-rose-400/60 transition-all duration-300 font-medium group"
      >
        <div className="bg-rose-500/20 p-1.5 rounded-full group-hover:bg-rose-500/30 transition-colors">
          <Flag className="w-4 h-4 text-rose-400 drop-shadow-md" />
        </div>
        <span className="hidden sm:inline tracking-wide drop-shadow-sm">Report Issue</span>
      </motion.button>

      {/* Support Ticket Modal */}
      <SupportTicketModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        sourcePage="/pricing"
      />
    </div>
  );
};

export default PricingPage;
