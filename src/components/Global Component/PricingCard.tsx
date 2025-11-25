import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Sparkles, HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Feature {
  title: string;
  included: boolean;
  tooltip?: string;
}

interface PricingCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'monthly' | 'yearly';
  billingText: string;
  features: Feature[];
  cta: string;
  color: 'slate' | 'emerald' | 'purple';
  popular?: boolean;
  index?: number;
  onCtaClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  id,
  name,
  description,
  price,
  period,
  billingText,
  features,
  cta,
  color,
  popular = false,
  index = 0,
  onCtaClick,
}) => {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ y: popular ? -8 : 0 }}
      className={cn(
        "rounded-xl border bg-white dark:bg-slate-900 shadow-xl overflow-hidden relative flex flex-col transition-all duration-300",
        color === 'slate' && 'border-slate-200 dark:border-slate-800',
        color === 'emerald' && 'border-emerald-200 dark:border-emerald-800',
        color === 'purple' && 'border-blue-200 dark:border-blue-800',
        popular ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 md:-mt-4 md:mb-4' : ''
      )}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute top-0 right-5 z-10">
          <div className="relative">
            <div className="w-28 h-28 overflow-hidden absolute -top-14 -right-14">
              <div className="absolute top-0 right-0 h-14 w-36 bg-gradient-to-r from-emerald-500 to-teal-500 transform rotate-45 origin-bottom-left translate-y-8"></div>
            </div>
            <span className="absolute top-0 right-0 transform rotate-45 text-xs font-bold text-white mt-2.5 mr-1.5">POPULAR</span>
          </div>
        </div>
      )}

      {/* Plan header */}
      <div className="p-6 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 text-center">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          {name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 my-2">
          {description}
        </p>
        <div className="mt-4 mb-2">
          <motion.span
            key={`${id}-${period}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-slate-900 dark:text-white"
          >
            ₹{price === 0 ? '0' : price.toLocaleString('en-IN')}
          </motion.span>
          <span className="text-slate-600 dark:text-slate-400 ml-1">
            {price > 0 ? `/${period === 'yearly' ? 'year' : 'month'}` : ''}
          </span>
        </div>
        {price > 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-2">
            {billingText}
          </p>
        )}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCtaClick}
          className={cn(
            'mt-4 w-full text-white shadow-lg rounded-lg font-semibold py-2.5 px-4 transition-all duration-300',
            color === 'slate' && 'bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
            color === 'emerald' && 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
            color === 'purple' && 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          )}
        >
          {price > 0 && <Sparkles className="inline-block mr-2 h-4 w-4" />}
          {cta}
        </motion.button>
      </div>

      {/* Features list */}
      <div className="p-6 flex-grow">
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                {feature.included ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : (
                  <X className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                )}
              </div>
              <div className="ml-3 flex items-center">
                <span 
                  className={`text-sm ${
                    feature.included 
                      ? 'text-slate-700 dark:text-slate-300' 
                      : 'text-slate-500 dark:text-slate-500'
                  }`}
                >
                  {feature.title}
                </span>
                
                {feature.tooltip && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="ml-1.5 focus:outline-none">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs text-xs">{feature.tooltip}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
