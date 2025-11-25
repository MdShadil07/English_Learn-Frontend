import React from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ToastActionElement } from '@/components/ui/toast';
import { Sparkles } from 'lucide-react';

export type UpgradeToastProps = {
  isPremiumUser?: boolean;
  storageKey?: string;
};

export default function UpgradeToast({ isPremiumUser = false, storageKey = 'upgrade_to_premium_dismissed_v1' }: UpgradeToastProps) {
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (isPremiumUser) return;
      const dismissed = window.localStorage.getItem(storageKey);
      if (dismissed) return;

      const t = toast({
        title: 'Unlock Premium Analytics',
        description: 'Get AI predictions, deeper insights and personalized learning paths.',
        action: (
          <div className="flex w-full flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              aria-label="Don't show this again"
              className="w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 transition sm:w-auto sm:min-w-[120px]"
              onClick={() => {
                try {
                  window.localStorage.setItem(storageKey, '1');
                } catch (e) {
                  /* ignore */
                }
                t.dismiss();
              }}
            >
              Don't show again
            </button>

            <a
              href="/pricing"
              onClick={() => t.dismiss()}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 sm:w-auto"
            >
              <Sparkles className="h-4 w-4" />
              <span>Upgrade</span>
            </a>
          </div>
        ) as unknown as ToastActionElement,
      });

      // nothing else to do here; toast will handle its own lifecycle
    } catch (e) {
      // non-fatal: log to help debugging in dev
      console.error('Upgrade toast failed', e);
    }
  }, [isPremiumUser, toast, storageKey]);

  return null;
}
