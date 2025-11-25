import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, Zap, Crown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PricingCard } from '@/components/Global Component/PricingCard';
import PricingFeatures from '@/components/pricing/PricingFeatures';
import PricingComparison from '@/components/pricing/PricingComparison';
import PricingFAQ from '@/components/pricing/PricingFAQ';
import SubscribeCTA from '@/components/pricing/SubscribeCTA';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { api, getAuthToken } from '@/utils/api';
import useSubscriptionSSE from '@/hooks/useSubscriptionSSE';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; yearly: number };
  badge?: string;
  badgeColor?: string;
  features: Array<{
    title: string;
    included: boolean;
    tooltip?: string;
  }>;
  cta: string;
  color: 'slate' | 'emerald' | 'purple';
  icon: React.ReactNode;
  popular?: boolean;
}

// Pricing tiers with dynamic prices from backend
const createPricingTiers = (pricing?: { pro: { monthly: number; yearly: number }; premium: { monthly: number; yearly: number } }): PricingTier[] => [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: { monthly: 0, yearly: 0 },
    features: [
      { title: '5 AI conversations/day', included: true, tooltip: 'Limited daily conversations' },
      { title: 'Basic grammar lessons', included: true },
      { title: 'Vocabulary basics (500 words)', included: true },
      { title: 'Community access', included: true },
      { title: 'Pronunciation analysis', included: false },
      { title: 'All AI personalities', included: false },
      { title: 'Writing feedback', included: false },
      { title: 'Priority support', included: false },
    ],
    cta: 'Start Free',
    color: 'slate',
    icon: <Sparkles className="w-5 h-5" />,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For serious learners',
    price: { 
      monthly: pricing?.pro.monthly || 499, 
      yearly: pricing?.pro.yearly || 4990 
    },
    badge: 'Most Popular',
    badgeColor: 'from-emerald-500 to-teal-500',
    features: [
      { title: 'Unlimited AI conversations', included: true },
      { title: 'Full grammar curriculum', included: true },
      { title: 'Expanded vocabulary (3,000+ words)', included: true },
      { title: 'Community access', included: true },
      { title: 'Basic pronunciation analysis', included: true },
      { title: '3 AI personalities', included: true },
      { title: 'Basic writing feedback', included: true },
      { title: 'Private practice rooms', included: false },
    ],
    cta: 'Upgrade to Pro',
    color: 'emerald',
    icon: <Zap className="w-5 h-5" />,
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For professionals',
    price: { 
      monthly: pricing?.premium.monthly || 999, 
      yearly: pricing?.premium.yearly || 9990 
    },
    features: [
      { title: 'Unlimited AI conversations', included: true },
      { title: 'Complete curriculum', included: true },
      { title: 'Comprehensive vocabulary (10,000+ words)', included: true },
      { title: 'Priority community access', included: true },
      { title: 'Advanced pronunciation analysis', included: true },
      { title: 'All 5 AI personalities', included: true },
      { title: 'Advanced writing feedback', included: true },
      { title: 'Private practice rooms', included: true },
    ],
    cta: 'Upgrade to Premium',
    color: 'purple',
    icon: <Crown className="w-5 h-5" />,
  },
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [pricingConfig, setPricingConfig] = useState<{ pro: { monthly: number; yearly: number }; premium: { monthly: number; yearly: number } } | null>(null);
  const pricingTiers = createPricingTiers(pricingConfig || undefined);
  const [plansByTier, setPlansByTier] = useState<Record<string, unknown>>({});
  const [mySubscription, setMySubscription] = useState<unknown | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeTier, setUpgradeTier] = useState<PricingTier | null>(null);
  const [buyerStateInput, setBuyerStateInput] = useState<string>('');
  const [buyerGstinInput, setBuyerGstinInput] = useState<string>('');
  interface TaxPreview {
    taxTotal: number;
    igst: number;
    cgst: number;
    sgst: number;
    totalAmount: number;
  }
  const [taxPreview, setTaxPreview] = useState<TaxPreview | null>(null);
  const { toast } = useToast();

  async function loadScript(src: string) {
    return new Promise<HTMLScriptElement | null>((resolve) => {
      const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
      if (existing) return resolve(existing);
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(script);
      script.onerror = () => resolve(null);
      document.body.appendChild(script);
    });
  }

  const handleSubscribe = async (tier: PricingTier, buyerState?: string, buyerGstin?: string) => {
    // Prevent double-clicks
    setLoadingPlan(tier.id);
    try {
      // Create a production subscription via backend which returns a Razorpay subscription id
      function generateIdempotencyKey(): string {
        try {
          // Use Web Crypto randomUUID when available
          const globalCrypto = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
          if (globalCrypto && typeof globalCrypto.randomUUID === 'function') return globalCrypto.randomUUID();
        } catch (err) {
          // ignore — fallback will generate a pseudo-random id
          console.debug('generateIdempotencyKey: crypto.randomUUID not available', err);
        }
        return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }

      const idempotencyKey = generateIdempotencyKey();
      // Prefer sending the backend's plan _id when available (loaded via /payment/plans),
      // fallback to the tier id (e.g., 'pro') if not present.
      const planKey = `${tier.id}|${billingCycle}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const backendPlan = (plansByTier && (plansByTier as any)[planKey]) || null;
      const planIdToSend = backendPlan && backendPlan._id ? String(backendPlan._id) : String(tier.id);
      const payload: { planId?: string; planType?: string; idempotencyKey?: string } = { planId: planIdToSend, planType: billingCycle, idempotencyKey };
      const resp = await api.payment.createSubscription(payload);
      if (!resp || !resp.success) throw new Error(resp?.message || 'Failed to create subscription');

      const razorpaySub = resp.razorpaySubscription;
      const key = resp.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
      // If backend returned a redirect URL (hosted checkout/payment link), prefer redirecting the browser
      const redirectUrl = ((resp as unknown) as Record<string, unknown>)['redirectUrl'] as string | undefined || null;
      if (redirectUrl && typeof redirectUrl === 'string') {
        // Redirect user to hosted payment page
        window.location.assign(redirectUrl);
        return;
      }
      if (!razorpaySub || !razorpaySub.id) throw new Error('No subscription id returned from server');

      // Load Razorpay subscription checkout script
      const script = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!script) throw new Error('Failed to load Razorpay checkout');

      const options: Record<string, unknown> = {
        key,
        subscription_id: razorpaySub.id,
        name: 'English Practice',
        description: `${tier.name} subscription`,
        prefill: { name: '', email: '' },
        handler: async (response: Record<string, unknown>) => {
          try {
            // Show loading state during confirmation
            toast({ title: 'Processing...', description: 'Confirming your payment', duration: 2000 });
            
            const r = response as Record<string, unknown>;
            const razorpay_payment_id = (r['razorpay_payment_id'] as string) || null;
            const razorpay_subscription_id = (r['razorpay_subscription_id'] as string) || null;
            const razorpay_signature = (r['razorpay_signature'] as string) || null;

            await api.payment.confirm({
              razorpay_payment_id,
              razorpay_subscription_id,
              razorpay_signature,
            });

            toast({ title: 'Success!', description: `Subscribed to ${tier.name} plan successfully!`, duration: 3000 });
            
            // Redirect to dashboard after successful payment
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } catch (err) {
            console.error('Payment confirmation error:', err);
            toast({ title: 'Payment Error', description: 'Payment confirmation failed. Please contact support.', variant: 'destructive', duration: 6000 });
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            setLoadingPlan(null);
            toast({ title: 'Payment Cancelled', description: 'You cancelled the payment process.', duration: 3000 });
          },
        },
        theme: { color: '#10b981' },
      };

      const Rz = (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void } }).Razorpay;
      if (!Rz) throw new Error('Razorpay SDK not available');
      const rzp = new Rz(options);
      rzp.open();
    } catch (err: unknown) {
      console.error('subscribe error', err);
      let message = 'Subscription failed';
      if (err instanceof Error) message = err.message;
      else message = String(err);
      toast({ title: 'Subscription failed', description: message || 'Subscription failed', duration: 7000 });
    } finally {
      setLoadingPlan(null);
    }
  };

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
    
    // Load backend plans and map by tier+planType to get real ObjectIds
    (async () => {
      try {
        const result = await api.payment.getPlans();
        if (!mounted) return;
        const resObj = result as unknown as { success?: boolean; plans?: unknown[] };
        if (resObj && resObj.success) {
          const plansArr = resObj.plans ?? [];
          const map: Record<string, unknown> = {};
          plansArr.forEach((p) => {
            const pp = p as Record<string, unknown>;
            // map by `tier|planType` e.g., 'pro|monthly'
            const key = `${String(pp['tier'] ?? '')}|${String(pp['planType'] ?? '')}`;
            map[key] = pp;
          });
          setPlansByTier(map);
        }
      } catch (err) {
        console.debug('Failed to load plans', err);
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

  // Upgrade modal helpers
  const fetchTaxPreview = async (amountPaise: number) => {
    try {
      // Do not send client-supplied state — backend will resolve state from profile or GeoIP
      const resp = await api.payment.taxPreview({ amount: amountPaise });
      if (resp && resp.success) {
        // api returns { success, tax, resolvedState, note }
        const body = resp as unknown as { tax?: TaxPreview };
        setTaxPreview(body.tax ?? null);
      }
    } catch (e) {
      console.debug('tax preview failed', e);
    }
  };

  const handleUpgradeSubmit = async () => {
    if (!upgradeTier) return;
    setShowUpgradeModal(false);
    // call subscribe — server will resolve state/GST
    await handleSubscribe(upgradeTier);
    // clear modal state
    setBuyerStateInput('');
    setBuyerGstinInput('');
    setTaxPreview(null);
    setUpgradeTier(null);
  };

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
    <div className="relative min-h-screen w-full overflow-hidden">
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
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingTiers.map((tier, index) => {
            const isCurrentPlan = user?.tier === tier.id;
            const isHigherPlan = 
              (user?.tier === 'premium' && tier.id !== 'premium') || 
              (user?.tier === 'pro' && tier.id === 'free');

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
                  // Direct payment flow - no tax preview modal
                  setLoadingPlan(tier.id);
                  try {
                    await handleSubscribe(tier);
                  } catch (error) {
                    console.error('Subscription error:', error);
                    setLoadingPlan(null);
                  }
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

        {/* Extra sections: features, comparison, subscribe, faq */}
        <PricingFeatures />
        <PricingComparison />
        <SubscribeCTA />
        <PricingFAQ />
      </div>
      {/* Upgrade modal for collecting GST/billing info before paid flow */}
      <Dialog open={showUpgradeModal} onOpenChange={(open) => setShowUpgradeModal(Boolean(open))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade & Enter Billing Info</DialogTitle>
                <p className="text-sm text-muted-foreground">We calculate taxes server-side using your saved billing address. You can preview the tax here before proceeding.</p>
          </DialogHeader>
          <div className="mt-4 space-y-3">
            {/* State/GSTIN inputs removed — server will resolve state and GSTIN from user profile where possible */}
            {upgradeTier && (
              <div className="mt-2">
                <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={() => fetchTaxPreview((billingCycle === 'yearly' ? upgradeTier.price.yearly : upgradeTier.price.monthly) * 100)}>Preview Tax</button>
                {taxPreview && (
                  <div className="mt-2 text-sm text-slate-700">
                    <div>Tax Total: {(taxPreview.taxTotal / 100).toFixed(2)}</div>
                    <div>IGST: {(taxPreview.igst / 100).toFixed(2)}</div>
                    <div>CGST: {(taxPreview.cgst / 100).toFixed(2)}</div>
                    <div>SGST: {(taxPreview.sgst / 100).toFixed(2)}</div>
                    <div className="font-semibold">Total: {(taxPreview.totalAmount / 100).toFixed(2)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter className="mt-4">
            <div className="flex gap-2">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button onClick={handleUpgradeSubmit} className="px-4 py-2 rounded bg-emerald-600 text-white">Proceed to Checkout</button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PricingPage;
