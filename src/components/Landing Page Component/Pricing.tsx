import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// --- Utility: Custom Tooltip (Self-Contained) ---
const InfoTooltip = ({ text }) => (
  <div className="group relative inline-block ml-1.5 align-middle">
    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-xl border border-slate-700">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
    </div>
  </div>
);

// --- Utility: Custom Toggle (Self-Contained) ---
const BillingToggle = ({ isYearly, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 border shadow-inner flex items-center px-0.5 ${
      isYearly 
        ? 'bg-emerald-500 border-emerald-600 dark:bg-emerald-500/80 dark:border-emerald-500' 
        : 'bg-slate-200 border-slate-300 dark:bg-slate-800 dark:border-slate-700'
    }`}
  >
    <motion.div
      className="w-5 h-5 bg-white rounded-full shadow-md"
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
    color: 'teal',
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className={`relative flex flex-col rounded-[2.5rem] transition-all duration-500 z-10 ${
        isPopular 
          ? 'md:-mt-6 md:mb-6 shadow-2xl shadow-teal-500/10 dark:shadow-none z-20' 
          : 'shadow-xl shadow-slate-200/50 dark:shadow-none mt-0'
      }`}
    >
      {/* Animated Gradient Border for Popular Plan */}
      {isPopular && (
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 rounded-[2.5rem] -z-10 p-[2px] opacity-100 dark:opacity-80">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-cyan-500 rounded-[2.5rem] blur-md opacity-30 pointer-events-none"></div>
        </div>
      )}

      {/* Main Card Container */}
      <div className={`h-full flex flex-col rounded-[calc(2.5rem-2px)] overflow-hidden backdrop-blur-xl ${
        isPopular 
          ? 'bg-white/95 dark:bg-[#0b1121]/95 border-0' 
          : 'bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60'
      }`}>
        
        {/* Card Header */}
        <div className={`p-8 md:p-10 pb-6 ${
          isPopular ? 'bg-gradient-to-b from-teal-50/50 to-transparent dark:from-teal-900/10' : 
          isPremium ? 'bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-900/10' : ''
        }`}>
          <div className="flex justify-between items-start mb-6">
            <div className={`p-3.5 rounded-2xl shadow-sm ${
              isPopular ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400 border border-teal-200/50 dark:border-teal-800/50' :
              isPremium ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/50' :
              'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50'
            }`}>
              <plan.icon className="w-6 h-6" />
            </div>
            {isPopular && (
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                Most Popular
              </span>
            )}
          </div>

          <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">{plan.name}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">{plan.description}</p>

          <div className="mt-6 flex items-baseline">
            <span className="text-4xl md:text-5xl font-black text-[#0f172a] dark:text-white tracking-tighter">
              ${isYearly ? plan.price.yearly : plan.price.monthly}
            </span>
            <span className="ml-2 text-sm font-bold text-slate-500 dark:text-slate-400">/month</span>
          </div>
          <div className="h-4 mt-2">
            {isYearly && plan.price.monthly > 0 && (
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wide">
                Billed ${plan.price.yearly * 12} yearly (Save 20%)
              </p>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="px-8 md:px-10 pb-8 flex-grow">
          <div className="w-full h-px bg-slate-200/60 dark:bg-slate-800/60 mb-8"></div>
          <ul className="space-y-4">
            {plan.features.map((feature, idx) => (
              <li key={idx} className={`flex items-start ${!feature.included ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {feature.included ? (
                    <div className={`p-1 rounded-md shadow-sm ${
                      isPopular ? 'bg-teal-100 dark:bg-teal-900/30' : 
                      isPremium ? 'bg-amber-100 dark:bg-amber-900/30' : 
                      'bg-slate-100 dark:bg-slate-800'
                    }`}>
                      <Check className={`h-3 w-3 ${
                        isPopular ? 'text-teal-600 dark:text-teal-400' : 
                        isPremium ? 'text-amber-600 dark:text-amber-400' : 
                        'text-slate-600 dark:text-slate-400'
                      }`} />
                    </div>
                  ) : (
                    <div className="p-1 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
                      <X className="h-3 w-3 text-slate-400 dark:text-slate-600" />
                    </div>
                  )}
                </div>
                <span className={`ml-3 text-sm font-semibold flex-1 ${!feature.included ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
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
        <div className="p-8 md:p-10 pt-0 mt-auto">
          <Link to="/signup" className="block w-full">
            <Button 
              className={`w-full h-14 rounded-full font-bold text-[15px] shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isPopular ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/20 border-0' : 
                isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/20 border-0' :
                'bg-[#0f172a] dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 border-0'
              }`}
            >
              {plan.cta}
            </Button>
          </Link>
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-5">
            {plan.price.monthly === 0 ? "No credit card required" : "7-day money-back guarantee"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Pricing = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isYearly, setIsYearly] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-[#f8fbff] dark:bg-[#070b14] relative overflow-hidden transition-colors duration-500 font-sans scroll-mt-24 lg:scroll-mt-32">
      
      {/* --- Optimized Background Elements (No CSS Blurs) --- */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-[20%] left-[-10%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(20,184,166,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_60%)]" style={{ transform: 'translateZ(0)' }}></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* --- Header --- */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 px-3 py-1.5 mb-6 rounded-full bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm backdrop-blur-sm transition-colors duration-500">
              <Sparkles className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 tracking-tight">Flexible Plans</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-[#0f172a] dark:text-white leading-[1.1] tracking-tight transition-colors duration-500">
              Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500 pb-2">Fluency</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-10 font-medium leading-relaxed transition-colors duration-500">
              Transparent pricing. No hidden fees. Cancel anytime.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/60 dark:border-slate-800/60 p-2 rounded-full w-fit mx-auto shadow-sm">
              <span className={`text-sm font-bold px-4 transition-colors cursor-pointer ${!isYearly ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} onClick={() => setIsYearly(false)}>
                Monthly
              </span>
              <BillingToggle isYearly={isYearly} onToggle={() => setIsYearly(!isYearly)} />
              <span className={`text-sm font-bold pl-4 pr-2 flex items-center gap-2 transition-colors cursor-pointer ${isYearly ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`} onClick={() => setIsYearly(true)}>
                Yearly
                <span className="text-[10px] font-extrabold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 px-2 py-1 rounded-full border border-teal-200 dark:border-teal-800 uppercase tracking-widest shadow-sm">
                  Save 20%
                </span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto items-start">
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
        <div className="mt-24 text-center">
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-8">
            Trusted by forward-thinking teams at
          </p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16 opacity-40 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             {/* High-end typography for placeholder logos */}
             {['Google', 'Spotify', 'Airbnb', 'Stripe'].map((brand) => (
               <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter text-[#0f172a] dark:text-white cursor-default select-none">
                 {brand}
               </span>
             ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Pricing;