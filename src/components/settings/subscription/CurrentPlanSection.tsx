import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurrentPlanSectionProps {
  subscription: any;
  plans: any[];
  onViewPlansClick: () => void;
  onCancelClick?: () => void;
  onToggleAutoRenew?: (state: boolean) => void;
}

const CurrentPlanSection: React.FC<CurrentPlanSectionProps> = ({ subscription, plans, onViewPlansClick, onCancelClick, onToggleAutoRenew }) => {
  const isActive = subscription?.status === 'active';
  const planCode = isActive ? (subscription?.planCode || subscription?.tier?.toUpperCase() || 'FREE') : 'FREE';
  const isPremium = planCode === 'PREMIUM';
  const isPro = planCode === 'PRO';
  const planName = isPremium ? 'Premium Plan' : (isPro ? 'Pro Plan' : 'Free Plan');
  const planDetails = plans.find(p => p.planCode === planCode || p.code === planCode || p.tier?.toUpperCase() === planCode);
  
  // Calculate days remaining if active
  let daysRemaining = 0;
  let progressPercentage = 0;
  
  if (subscription?.status === 'active' && subscription?.expiresAt) {
    const expiry = new Date(subscription.expiresAt);
    const renewed = new Date(subscription.renewedAt || Date.now() - 30 * 24 * 60 * 60 * 1000); // fallback to 30 days ago
    const now = new Date();
    
    const totalDuration = expiry.getTime() - renewed.getTime();
    const elapsed = now.getTime() - renewed.getTime();
    
    daysRemaining = Math.max(0, Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  }

  return (
    <Card className="p-6 md:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      {/* Decorative background element for premium/pro */}
      {(isPremium || isPro) && (
        <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isPremium ? 'bg-gradient-to-br from-purple-400/20 to-indigo-400/20' : 'bg-gradient-to-br from-emerald-400/20 to-cyan-400/20'
        }`} />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${
              isPremium ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white' : 
              (isPro ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500')
            }`}>
              {(isPremium || isPro) ? <Sparkles className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {planName}
            </h3>
            {subscription?.status === 'active' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            )}
            {subscription?.status === 'expired' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border border-red-200 dark:border-red-500/30 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Expired
              </span>
            )}
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm">
            {isPremium 
              ? 'You have full access to all premium features including Advanced AI Tutor, Unlimited Speech Analysis, and Custom Learning Paths.'
              : isPro
              ? 'You have access to Pro features including unlimited practice time and deeper pronunciation insights.'
              : 'You are currently on the Free plan. Upgrade to unlock advanced features, unlimited practice time, and deeper pronunciation insights.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(!isPremium && !isPro) && (
            <Button 
              className="shrink-0 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xl transition-transform active:scale-95"
              onClick={onViewPlansClick}
            >
              View Upgrade Options
            </Button>
          )}
          {(isPremium || isPro) && onCancelClick && (
            <Button 
              variant="outline"
              className="shrink-0 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 font-medium"
              onClick={onCancelClick}
            >
              Cancel Subscription
            </Button>
          )}
        </div>
      </div>

      {(isPremium || isPro) && subscription?.expiresAt && (
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white flex items-center gap-2">
                Billing Cycle
                {subscription?.status === 'canceled' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
                    Auto-renew off
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {subscription?.status === 'canceled' 
                  ? `Terminates on ${new Date(subscription.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`
                  : `Renews on ${new Date(subscription.expiresAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
              </p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{daysRemaining}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-wide">Days Left</span>
              </div>
              
              {onToggleAutoRenew && subscription?.status !== 'canceled' && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Auto-Renew</span>
                  <button
                    type="button"
                    className={`${
                      subscription.autoRenew ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'
                    } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900`}
                    onClick={() => onToggleAutoRenew(!subscription.autoRenew)}
                  >
                    <span
                      className={`${
                        subscription.autoRenew ? 'translate-x-4' : 'translate-x-0'
                      } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out relative"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default CurrentPlanSection;
