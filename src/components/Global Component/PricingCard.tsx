import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, HelpCircle, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// --- Utility: Custom Tooltip (Self-Contained) ---
const InfoTooltip = ({ text }: { text: string }) => (
  <div className="group relative inline-block ml-1.5 align-middle">
    <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-help transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-48 text-center z-50 shadow-xl border border-slate-700">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-800"></div>
    </div>
  </div>
);

const mapColorToIcon = (color: string) => {
  if (color === 'purple') return Crown;
  if (color === 'emerald') return Zap;
  return Star;
};

interface Feature {
  title: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  period?: 'monthly' | 'yearly';
  billingText?: string;
  features: Feature[];
  cta: string;
  color: 'slate' | 'emerald' | 'purple';
  popular?: boolean;
  index?: number;
  onCtaClick?: () => void;
  linkTo?: string;
  // Landing page compatibility props
  plan?: any;
  isYearly?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = (props) => {
  // Support both Global format and Landing format props seamlessly
  const isPopular = props.popular || props.plan?.popular;
  const isPremium = props.id === 'premium' || props.plan?.id === 'premium';
  const name = props.name || props.plan?.name;
  const description = props.description || props.plan?.description;
  const isYearly = props.isYearly || props.period === 'yearly';
  const price = props.plan ? (props.isYearly ? props.plan.price.yearly : props.plan.price.monthly) : props.price;
  const features = props.features || props.plan?.features || [];
  const cta = props.cta || props.plan?.cta;
  const color = props.color || props.plan?.color || 'slate';
  const index = props.index || 0;
  const icon = props.plan?.icon || mapColorToIcon(color);
  const targetLink = props.linkTo || "/signup";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className={`relative flex flex-col rounded-[2.5rem] transition-all duration-500 z-10 h-full ${
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
          ? 'bg-white/95 dark:bg-[#050C14]/95 border-0 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]' 
          : 'bg-white/60 dark:bg-[#050C14]/60 border border-slate-200/60 dark:border-emerald-500/10'
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
              {React.createElement(icon, { className: "w-6 h-6" })}
            </div>
            {isPopular && (
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                Most Popular
              </span>
            )}
          </div>

          <h3 className="text-2xl font-extrabold text-[#0f172a] dark:text-white mb-2 tracking-tight">{name}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 min-h-[40px] leading-relaxed">{description}</p>

          <div className="mt-6 flex items-baseline">
            <span className="text-4xl md:text-5xl font-black text-[#0f172a] dark:text-white tracking-tighter">
              ₹{price === 0 ? '0' : price.toLocaleString('en-IN')}
            </span>
            <span className="ml-2 text-sm font-bold text-slate-500 dark:text-slate-400">/{isYearly ? 'year' : 'month'}</span>
          </div>
          <div className="h-4 mt-2">
            {(props.billingText || (isYearly && props.plan && props.plan.price.monthly > 0)) && (
              <p className="text-xs text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wide">
                {props.billingText || `Billed ${props.plan.price.yearly * 12} yearly (Save 20%)`}
              </p>
            )}
          </div>
        </div>

        {/* Features List */}
        <div className="px-8 md:px-10 pb-8 flex-grow">
          <div className="w-full h-px bg-slate-200/60 dark:bg-slate-800/60 mb-8"></div>
          <ul className="space-y-4">
            {features.map((feature: any, idx: number) => (
              <li key={idx} className={`flex items-start ${!feature.included ? 'opacity-40 grayscale' : ''}`}>
                <div className="flex-shrink-0 mt-0.5">
                  {feature.included ? (
                    <div className={`p-1 rounded-md shadow-sm ${
                      isPopular ? 'bg-teal-100 dark:bg-teal-900/30' : 
                      isPremium ? 'bg-amber-100 dark:bg-amber-900/30' : 
                      'bg-slate-100 dark:bg-[#050C14] dark:border dark:border-emerald-500/20'
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
          {props.onCtaClick ? (
            <Button 
              onClick={props.onCtaClick}
              className={`w-full h-14 rounded-full font-bold text-[15px] shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                isPopular ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/20 border-0' : 
                isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/20 border-0' :
                'bg-[#0f172a] dark:bg-[#050C14] text-white dark:text-emerald-400 dark:border dark:border-emerald-500/30 hover:bg-black dark:hover:bg-emerald-500/10'
              }`}
            >
              {price > 0 && <Sparkles className="inline-block mr-2 h-4 w-4" />}
              {cta}
            </Button>
          ) : (
            <Link to={targetLink} className="block w-full">
              <Button 
                className={`w-full h-14 rounded-full font-bold text-[15px] shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  isPopular ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white shadow-teal-500/20 border-0' : 
                  isPremium ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-amber-500/20 border-0' :
                  'bg-[#0f172a] dark:bg-[#050C14] text-white dark:text-emerald-400 dark:border dark:border-emerald-500/30 hover:bg-black dark:hover:bg-emerald-500/10'
                }`}
              >
                {price > 0 && <Sparkles className="inline-block mr-2 h-4 w-4" />}
                {cta}
              </Button>
            </Link>
          )}
          <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-5">
            {price === 0 ? "No credit card required" : "7-day money-back guarantee"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
