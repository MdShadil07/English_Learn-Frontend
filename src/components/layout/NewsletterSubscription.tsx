import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface NewsletterSubscriptionProps {
  variant?: 'landing' | 'dashboard';
  className?: string;
}

const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  variant = 'dashboard',
  className = ''
}) => {
  const handleSubscribe = () => {
    // Handle newsletter subscription
    console.log('Newsletter subscription submitted');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${
        variant === 'landing'
          ? 'bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-6 pb-4'
          : 'bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 rounded-3xl p-4 sm:p-6 shadow-lg'
      } ${className}`}
    >
      <div className={variant === 'landing' ? 'grid md:grid-cols-2 gap-6 items-center' : 'text-center'}>
        <motion.div
          initial={{ opacity: 0, x: variant === 'landing' ? -20 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={variant === 'landing' ? '' : 'mb-6'}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={variant === 'landing' ? 'flex items-center gap-3' : 'flex items-center justify-center gap-3 mb-4'}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className={`text-lg sm:text-xl font-bold ${
                variant === 'landing'
                  ? 'text-slate-900 dark:text-white'
                  : 'text-emerald-800 dark:text-emerald-200'
              }`}>
                {variant === 'landing' ? 'Subscribe to our newsletter' : 'Stay Updated'}
              </h3>
              <p className={`text-xs sm:text-sm ${
                variant === 'landing'
                  ? 'text-slate-600 dark:text-slate-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {variant === 'landing' ? 'Get the latest news, updates and learning tips delivered to your inbox.' : 'Get learning tips & updates'}
              </p>
            </div>
          </motion.div>

          {variant === 'landing' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600 dark:text-slate-400 text-sm hidden md:block"
            >
              Get the latest news, updates and learning tips delivered to your inbox.
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: variant === 'landing' ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: variant === 'landing' ? 0.4 : 0.3 }}
          className={variant === 'landing' ? 'flex flex-col sm:flex-row gap-3' : 'flex flex-col sm:flex-row gap-3 max-w-md mx-auto'}
        >
          <input
            type="email"
            placeholder={variant === 'landing' ? "Enter your email" : "Enter your email address"}
            className={`px-4 py-3 rounded-lg border flex-grow focus:outline-none focus:ring-2 text-sm transition-all duration-200 ${
              variant === 'landing'
                ? 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-emerald-500 dark:focus:ring-emerald-400'
                : 'border-emerald-200 dark:border-emerald-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-emerald-900 dark:text-emerald-100 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-300 dark:focus:border-emerald-600'
            }`}
          />
          <Button
            onClick={handleSubscribe}
            className={`font-semibold transition-all duration-200 hover:shadow-lg ${
              variant === 'landing'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl hover:shadow-xl'
            }`}
          >
            Subscribe
          </Button>
        </motion.div>

        {variant === 'dashboard' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-emerald-600 dark:text-emerald-400 mt-3"
          >
            No spam, unsubscribe anytime • Weekly digest only
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default NewsletterSubscription;
