import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api, ApiResponse } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const CheckoutReturn: React.FC = () => {
  const loc = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<unknown | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const qp = new URLSearchParams(loc.search);
        const pid = qp.get('payment_id') || qp.get('paymentId') || qp.get('payment') || qp.get('payment_id') || qp.get('paymentId');
        const subId = qp.get('subscription_id') || qp.get('subscription') || qp.get('subscriptionId');
        setPaymentId(pid);

        // Try to refresh subscription snapshot from backend
        try {
          const me = await api.payment.getMySubscription();
          const meObj = me as ApiResponse<unknown>;
          if (meObj && meObj.success) {
            setSubscription(meObj.data ?? null);
            setMessage('Subscription updated');
            toast({ title: 'Subscription confirmed', description: 'We updated your subscription status', duration: 3000 });
            // Auto-redirect to dashboard and pass subscription data so dashboard can show a congratulation card
            try {
              const navState = { upgraded: true, subscription: meObj.data ?? null };
              // Use replace to avoid back-button returning to return page
              (window as unknown as { __navigateToDashboardState?: unknown }).__navigateToDashboardState = navState; // fallback for non-router consumers
              // Use location.assign if navigate not available (we'll use history state via replaceState)
              window.history.replaceState(navState, '', '/dashboard');
              window.location.replace('/dashboard');
              return;
            } catch (redirErr) {
              console.debug('Auto-redirect to dashboard failed', redirErr);
            }
          } else {
            setMessage('No active subscription found');
          }
        } catch (e) {
          console.debug('Failed to fetch subscription after return', e);
          setMessage('Returned from payment — we will reconcile your subscription shortly');
        }
      } catch (err) {
        console.error('CheckoutReturn error', err);
        setMessage('Payment completed. Returning to dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, [loc.search, toast]);

  const goDashboard = () => navigate('/dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-lg shadow p-6">
        {loading ? (
          <div>Processing your payment and updating subscription, please wait...</div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment return</h2>
            {subscription ? (
              (() => {
                const sub = subscription as unknown as {
                  planId?: { name?: string } | null;
                  tier?: string | null;
                  planType?: string | null;
                  startDate?: string | number | Date | null;
                  endDate?: string | number | Date | null;
                } | null;
                return (
                  <div className="p-4 border rounded-lg bg-green-50">
                    <h3 className="font-semibold text-lg">Congratulations — your plan has been upgraded!</h3>
                    <p className="mt-2">Plan: <strong>{(sub?.planId && sub.planId.name) || sub?.tier || 'Unknown'}</strong></p>
                    <p>Type: <strong>{sub?.planType || 'recurring'}</strong></p>
                    {sub?.startDate && <p>Start: {new Date(String(sub.startDate)).toLocaleString()}</p>}
                    {sub?.endDate && <p>End: {new Date(String(sub.endDate)).toLocaleString()}</p>}
                    <div className="mt-4">
                      <Button onClick={goDashboard}>Go to Dashboard</Button>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="p-4 border rounded-lg bg-yellow-50">
                <p>{message || 'Payment completed. We will update your subscription shortly.'}</p>
                <div className="mt-4">
                  <Button onClick={goDashboard}>Go to Dashboard</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutReturn;
