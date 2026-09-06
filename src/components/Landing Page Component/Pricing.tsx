import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import { api } from '@/utils/api';
import { mapBackendPlansToPricingTiers, defaultFallbackPlans } from '@/components/pricing/PricingUtils';
import { PricingCard } from '@/components/Global Component/PricingCard';

const Pricing = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [pricingPlans, setPricingPlans] = useState<any[]>(defaultFallbackPlans);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    // Fetch plans from backend
    (async () => {
      try {
        const result = await api.payment.getPlans();
        const resObj = result as unknown as { success?: boolean; plans?: any[] };
        if (resObj && resObj.success && resObj.plans) {
          const mapped = mapBackendPlansToPricingTiers(resObj.plans);
          mapped.sort((a, b) => a.price.monthly - b.price.monthly);
          setPricingPlans(mapped);
        }
      } catch (err) {
        console.error('Failed to load plans on landing', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (!isMounted) return null;

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-transparent relative overflow-hidden transition-colors duration-500 font-sans scroll-mt-24 lg:scroll-mt-32">
      
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
            <div className="flex items-center justify-center gap-4 bg-white/60 dark:bg-[#050C14]/60 backdrop-blur-md border border-slate-200/60 dark:border-emerald-500/10 p-2 rounded-full w-fit mx-auto shadow-sm">
              <span className={`text-sm font-bold tracking-wide transition-colors ${!isYearly ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                Monthly
              </span>
              <div 
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-14 h-7 rounded-full cursor-pointer transition-colors duration-300 border shadow-inner flex items-center px-0.5 ${
                  isYearly 
                    ? 'bg-emerald-500 border-emerald-600 dark:bg-emerald-500/80 dark:border-emerald-500' 
                    : 'bg-slate-200 border-slate-300 dark:bg-[#050C14] dark:border-emerald-500/20'
                }`}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{ x: isYearly ? 28 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </div>
              <span className={`text-sm font-bold tracking-wide transition-colors ${isYearly ? 'text-[#0f172a] dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                Yearly
              </span>
              <span className="text-[10px] font-extrabold bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-400 px-2 py-1 rounded-full border border-teal-200 dark:border-teal-800 uppercase tracking-widest shadow-sm">
                Save 20%
              </span>
            </div>
          </motion.div>
        </div>

        {/* --- Pricing Cards Grid --- */}
        {!isLoading && pricingPlans.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-white/50 dark:bg-[#0f172a]/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
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
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-8 max-w-6xl mx-auto items-start">
            {pricingPlans.map((plan, index) => (
              <div key={plan.id} className="h-full">
                <PricingCard 
                  id={plan.id}
                  name={plan.name}
                  description={plan.description}
                  price={plan.price.monthly} // the wrapper inside PricingCard will handle `plan` format if passed
                  features={plan.features}
                  cta={plan.cta}
                  color={plan.color}
                  plan={plan} 
                  isYearly={isYearly} 
                  index={index} 
                />
              </div>
            ))}
          </div>
        )}

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