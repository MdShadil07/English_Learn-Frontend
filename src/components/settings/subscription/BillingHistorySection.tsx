import React from 'react';
import { Card } from '@/components/ui/card';
import { FileText, Download, Clock, Loader2, LifeBuoy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import InvoiceTemplate from './InvoiceTemplate';
import { SupportTicketModal } from '@/components/support/SupportTicketModal';
import { Button } from '@/components/ui/button';

const BillingHistorySection: React.FC = () => {
  const [showSupport, setShowSupport] = React.useState(false);
  const { data: billingData, isLoading } = useQuery({
    queryKey: ['billing-history'],
    queryFn: async () => {
      try {
        const response = await api.payment.getBillingHistory();
        return (response as any)?.payments ?? [];
      } catch (err) {
        console.error('Failed to fetch billing history', err);
        return [];
      }
    }
  });

  const invoices = Array.isArray(billingData) ? billingData : [];

  return (
    <div className="pt-8">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Billing History</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            View your past invoices and payment receipts.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:hover:bg-emerald-900/30 gap-2"
          onClick={() => setShowSupport(true)}
        >
          <LifeBuoy className="w-4 h-4" />
          Report Issue
        </Button>
      </div>

      <Card className="overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mb-2" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading billing history...</p>
          </div>
        ) : invoices.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {invoices.map((invoice: any, idx: number) => {
              const planName = invoice.subscriptionId?.planId?.name || invoice.subscriptionId?.tier || 'Subscription';
              const amt = invoice.amount > 0 ? (invoice.amount / 100).toFixed(2) : (invoice.subscriptionId?.planId?.price ? (invoice.subscriptionId.planId.price / 100).toFixed(2) : '0.00');
              const currencySymbol = '₹';
              const dateStr = new Date(invoice.createdAt || invoice.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });

              return (
                <div key={invoice._id || idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  {/* Hidden Invoice Template for PDF Generation */}
                  <div style={{ display: 'none' }}>
                    <div id={`invoice-template-${invoice.paymentId}`}>
                      <InvoiceTemplate invoice={invoice} />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
                      <FileText className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {currencySymbol}{amt} • {planName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {dateStr} • ID: {invoice.paymentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
                      Paid
                    </span>
                    <button 
                      className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors tooltip-trigger" 
                      title="Download Invoice"
                      onClick={async () => {
                        const element = document.getElementById(`invoice-template-${invoice.paymentId}`);
                        if (element) {
                          // Dynamically import to avoid breaking SSR or initial bundle size if not needed
                          const html2pdf = (await import('html2pdf.js')).default;
                          const opt = {
                            margin:       0,
                            filename:     `CognitoSpeak-Invoice-${invoice.paymentId}.pdf`,
                            image:        { type: 'jpeg', quality: 0.98 },
                            html2canvas:  { scale: 2, useCORS: true },
                            jsPDF:        { unit: 'px', format: [800, 1131], orientation: 'portrait' }
                          };
                          html2pdf().set(opt).from(element).save();
                        }
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h4 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No billing history yet</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Your future invoices and payment receipts will appear here once you upgrade your plan.
            </p>
          </div>
        )}
      </Card>

      <SupportTicketModal
        isOpen={showSupport}
        onClose={() => setShowSupport(false)}
        defaultCategory="billing"
        sourcePage="settings-billing-history"
      />
    </div>
  );
};

export default BillingHistorySection;
