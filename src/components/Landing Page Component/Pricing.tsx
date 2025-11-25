import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Utility: Custom Tooltip (Self-Contained) ---
const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-1.5 align-middle">
    <HelpCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 cursor-help" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-xl">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
    </div>
  </div>
);

// --- Utility: Custom Toggle (Self-Contained) ---
const BillingToggle = ({ isYearly, onToggle }) => (
  <div 
    onClick={onToggle}
    className="relative w-14 h-7 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer transition-colors duration-300 border border-slate-300 dark:border-slate-700"
  >
    <motion.div
      className="absolute top-0.5 left-0.5 w-5 h-5 bg-white dark:bg-emerald-500 rounded-full shadow-sm"
      animate={{ x: isYearly ? 28 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </div>
);

const pricingPlans = [
  {
    id: 'free',
    name: 'Free',
    icon: Star,
    description: 'Basic access to start your journey',
    price: { monthly: 0, yearly: 0 },
    features: [
      { included: true, title: 'Basic AI conversation (5/day)', tooltip: 'Limited daily practice sessions' },
      { included: true, title: 'Grammar essentials', tooltip: 'Foundational lessons' },
      { included: true, title: 'Vocabulary basics', tooltip: '500+ essential words' },
      { included: true, title: 'Community access', tooltip: 'View discussions' },
      { included: false, title: 'Pronunciation analysis' },
      { included: false, title: 'All AI personalities' },
      { included: false, title: 'Writing feedback' },
    ],
    cta: 'Start for Free',
    color: 'slate',
    popular: false
  },
  {
    id: 'plus',
    name: 'Plus',
    icon: Zap,
    description: 'Accelerate your learning curve',
    price: { monthly: 9.99, yearly: 7.99 },
    features: [
      { included: true, title: 'Unlimited AI conversations', tooltip: 'No daily limits' },
      { included: true, title: 'Full grammar curriculum', tooltip: 'Advanced lessons included' },
      { included: true, title: 'Expanded vocabulary', tooltip: '3,000+ words' },
      { included: true, title: 'Full Community access', tooltip: 'Post and reply' },
      { included: true, title: 'Basic pronunciation analysis', tooltip: 'Standard feedback' },
      { included: true, title: '3 AI personalities', tooltip: 'Alex, Nova, Liam' },
      { included: false, title: 'Advanced writing feedback' },
    ],
    cta: 'Start Free Trial',
    color: 'emerald',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: Crown,
    description: 'The ultimate fluency toolkit',
    price: { monthly: 19.99, yearly: 15.99 },
    features: [
      { included: true, title: 'Unlimited AI conversations', tooltip: 'No daily limits' },
      { included: true, title: 'Complete curriculum', tooltip: 'Every module available' },
      { included: true, title: 'Comprehensive vocabulary', tooltip: '10,000+ words' },
      { included: true, title: 'Priority community access', tooltip: 'Verified badge' },
      { included: true, title: 'Advanced pronunciation', tooltip: 'Phoneme-level analysis' },
      { included: true, title: 'All 5 AI personalities', tooltip: 'Includes Coach & Sophia' },
      { included: true, title: 'Advanced writing feedback', tooltip: 'Style & Tone analysis' },
    ],
    cta: 'Start Free Trial',
    color: 'amber',
    popular: false
  }
];

const PricingCard = ({ plan, isYearly, index }) => {
  const isPopular = plan.popular;
  const isPremium = plan.id === 'premium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative flex flex-col p-1 rounded-3xl transition-all duration-300 ${
        isPopular 
          ? 'md:-mt-8 md:mb-8 z-10 shadow-2xl shadow-emerald-500/20' 
          : 'shadow-xl border border-slate-200 dark:border-slate-800'
      } ${isPremium ? 'border-amber-200/50 dark:border-amber-900/30' : ''}`}
    >
      {/* Gradient Border for Popular Plan */}
      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-3xl -z-10" />
      )}

      <div className={`h-full flex flex-col rounded-[22px] bg-white dark:bg-slate-900 overflow-hidden ${isPopular ? 'm-[1px]' : ''}`}>
        
        {/* Card Header */}
        <div className={`p-8 ${
          isPopular ? 'bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-900/10' : 
          isPremium ? 'bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10' : ''
        }`}>
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${
              isPopular ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
              isPremium ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              <plan.icon className="w-6 h-6" />
            </div>
            {isPopular && (
              <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">{plan.description}</p>

          <div className="mt-6 flex items-baseline">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">
              ${isYearly ? plan.price.yearly : plan.price.monthly}
            </span>
            <span className="ml-2 text-slate-500 dark:text-slate-400">/month</span>
          </div>
          {isYearly && plan.price.monthly > 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
              Billed ${plan.price.yearly * 12} yearly (Save 20%)
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="p-8 pt-0 flex-grow">
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 mb-6"></div>
          <ul className="space-y-4">
            {plan.features.map((feature, idx) => (
              <li key={idx} className={`flex items-start ${!feature.included ? 'opacity-50' : ''}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {feature.included ? (
                    <Check className={`h-5 w-5 ${isPopular ? 'text-emerald-500' : isPremium ? 'text-amber-500' : 'text-slate-400'}`} />
                  ) : (
                    <X className="h-5 w-5 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <span className="ml-3 text-sm text-slate-600 dark:text-slate-300 flex-1">
                  {feature.title}
                  {feature.tooltip && feature.included && (
                    <InfoTooltip text={feature.tooltip} />
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <div className="p-8 pt-0 mt-auto">
          <Button 
            className={`w-full h-12 rounded-xl font-semibold text-base shadow-lg transition-all duration-300 ${
              isPopular ? 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-500/25' : 
              isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-amber-500/25' :
              'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
            }`}
          >
            {plan.cta}
          </Button>
          <p className="text-center text-xs text-slate-400 mt-4">
            {plan.price.monthly === 0 ? "No credit card required" : "7-day money-back guarantee"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" id="pricing">
      
      {/* --- Abstract Background --- */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[50rem] h-[50rem] bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- Header --- */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
              Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Fluency</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
              Transparent pricing. No hidden fees. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                Monthly
              </span>
              <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />
              <span className={`text-sm font-medium transition-colors flex items-center gap-2 ${isYearly ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                Yearly
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              isYearly={isYearly} 
              index={index} 
            />
          ))}
        </div>

        {/* --- Trust Footer --- */}
        <div className="mt-20 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Trusted by forward-thinking teams at
          </p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale">
             {/* Reusing brand text for lightweight implementation */}
             {['Google', 'Spotify', 'Airbnb', 'Stripe'].map((brand) => (
               <span key={brand} className="text-xl font-bold text-slate-800 dark:text-slate-200">{brand}</span>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;