import React, { useState, useEffect } from 'react';
import { Shield, Loader2, CheckCircle2, CreditCard, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';

// Utility to load external scripts dynamically
const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CheckoutModalProps {
  planId: string;
  plans: any[];
  onClose: () => void;
  onSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ planId, plans, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [isRecurring, setIsRecurring] = useState(false);
  const [hasTrial, setHasTrial] = useState(false);
  const [buyerState, setBuyerState] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponData, setCouponData] = useState<{
    code: string;
    discountAmount: number;
    finalPrice: number;
  } | null>(null);

  interface TaxPreview {
    totalTax: number;
    igst: number;
    cgst: number;
    sgst: number;
  }
  const [taxPreview, setTaxPreview] = useState<TaxPreview | null>(null);
  const [fetchingTax, setFetchingTax] = useState(false);

  useEffect(() => {
    if (user && (user as any).phone) {
      setBuyerPhone((user as any).phone);
    }
  }, [user]);

  const selectedPlan = plans.find(p => (p._id === planId || p.code === planId || p.tier === planId || p.planCode === planId));

  const fetchTaxPreview = async (amountPaise: number, state?: string) => {
    try {
      setFetchingTax(true);
      const resp = await api.payment.taxPreview({ amount: amountPaise, buyerState: state || buyerState, taxRatePercent: selectedPlan?.taxPercent });
      if (resp && resp.success) {
        const body = resp as unknown as { tax?: TaxPreview };
        setTaxPreview(body.tax ?? null);
      }
    } catch (e) {
      console.debug('tax preview failed', e);
    } finally {
      setFetchingTax(false);
    }
  };

  useEffect(() => {
    if (selectedPlan) {
      fetchTaxPreview(selectedPlan.price);
    }
  }, [selectedPlan]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setCouponError(null);
    try {
      const response = await api.payment.validateCoupon({ code: couponCode, planId: selectedPlan._id });
      if (response.success) {
        setCouponData({
          code: response.coupon?.code || couponCode,
          discountAmount: response.discountAmount,
          finalPrice: response.finalPrice
        });
        setCouponError(null);
        fetchTaxPreview(response.finalPrice, buyerState);
      } else {
        setCouponError(response.message || 'Invalid coupon');
        setCouponData(null);
      }
    } catch (err: any) {
      setCouponError(err.message || 'Failed to validate coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponData(null);
    setCouponError(null);
    if (selectedPlan) {
      fetchTaxPreview(selectedPlan.price);
    }
  };

  const handleCheckout = async () => {
    try {
      if (!buyerState) {
        throw new Error('Please select your billing state/region');
      }

      setLoading(true);
      setError(null);
      setStep('processing');

      if (!selectedPlan) {
        throw new Error('Selected plan not found');
      }

      function generateIdempotencyKey(): string {
        try {
          const globalCrypto = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
          if (globalCrypto && typeof globalCrypto.randomUUID === 'function') return globalCrypto.randomUUID();
        } catch (err) {
          console.debug('crypto.randomUUID not available', err);
        }
        return `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      }

      const payload = {
        planId: selectedPlan._id,
        planType: selectedPlan.billingPeriod || selectedPlan.interval || 'monthly',
        isRecurring: isRecurring,
        hasTrial: hasTrial && selectedPlan.price > 0,
        buyerState: buyerState,
        buyerGstin: buyerGstin,
        couponCode: couponData?.code,
        idempotencyKey: generateIdempotencyKey()
      };

      // Create a production subscription via backend which returns a Razorpay subscription id
      const response = await api.payment.createSubscription(payload);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to initialize subscription');
      }

      const resp = response as any;
      const redirectUrl = resp?.redirectUrl;
      
      if (redirectUrl && typeof redirectUrl === 'string') {
        // Redirect user to hosted payment page (e.g., Stripe Checkout)
        window.location.assign(redirectUrl);
        return;
      }

      const rzOrderId = resp.isOrder ? resp.razorpayOrder?.id : null;
      const rzSubId = !resp.isOrder ? resp.razorpaySubscription?.id : null;
      const key = resp.key || import.meta.env.VITE_RAZORPAY_KEY_ID;
      const customerId = resp.customerId;

      if (!key) throw new Error('Payment gateway key not found');
      if (!rzOrderId && !rzSubId) throw new Error('No valid session id returned from server');

      // Load Razorpay checkout script
      const scriptLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!scriptLoaded) throw new Error('Failed to load Razorpay checkout');

      const options: any = {
        key: key,
        name: resp.name || 'Learn English',
        description: resp.description || `Secure checkout for ${selectedPlan.name}`,
        image: '/logo.png',
        ...(rzOrderId ? { order_id: rzOrderId } : { subscription_id: rzSubId }),
        amount: resp.amount,
        currency: resp.currency || 'INR',
        prefill: {
          name: resp.prefill?.name || user?.fullName || '',
          email: resp.prefill?.email || user?.email || '',
          contact: buyerPhone || resp.prefill?.contact || '',
        },
        theme: {
          color: '#10b981' // emerald-500
        },
        config: {
          display: {
            blocks: {
              all: {
                name: "All Payment Methods",
                instruments: [
                  { method: "upi" },
                  { method: "card" },
                  { method: "netbanking" },
                  { method: "wallet" },
                  { method: "emi" },
                  { method: "paylater" }
                ]
              }
            },
            sequence: ["block.all"],
            preferences: {
              show_default_blocks: true
            }
          }
        },
        retry: {
          enabled: true, 
        },
        handler: async function (r: any) {
          try {
            setLoading(true);
            const razorpay_payment_id = (r['razorpay_payment_id'] as string) || null;
            const razorpay_subscription_id = (r['razorpay_subscription_id'] as string) || null;
            const razorpay_order_id = (r['razorpay_order_id'] as string) || null;
            const razorpay_signature = (r['razorpay_signature'] as string) || null;

            const confirmResponse = await api.payment.confirm({
              razorpay_payment_id,
              razorpay_subscription_id,
              razorpay_order_id,
              razorpay_signature
            });

            if (confirmResponse.success) {
              setStep('success');
              setTimeout(() => {
                onSuccess();
              }, 2000);
            } else {
              throw new Error(confirmResponse.message || 'Failed to confirm payment');
            }
          } catch (err: any) {
            console.error('Payment confirmation error', err);
            setError(err.message || 'Payment confirmation failed');
            setStep('confirm');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setStep('confirm');
            // Trigger the AI agent by simulating an abandoned checkout locally
            api.payment.simulateFailure({
              reason: 'Customer closed the checkout window without completing payment.',
              code: 'CHECKOUT_ABANDONED',
              step: 'payment_initiation',
              source: 'customer'
            }).catch(console.error);
          }
        }
      };

      const Rz = (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { open: () => void; on: (event: string, handler: Function) => void } }).Razorpay;
      if (!Rz) throw new Error('Razorpay SDK not available');
      
      const rzp = new Rz(options);
      
      // Listen for actual payment failure events in the checkout UI
      rzp.on('payment.failed', function (response: any) {
        console.log('Razorpay payment failed event caught:', response.error);
        api.payment.simulateFailure({
          reason: response.error?.description || 'Payment failed during processing',
          code: response.error?.code || 'BAD_REQUEST_ERROR',
          step: response.error?.step || 'payment_authorization',
          source: response.error?.source || 'bank'
        }).catch(console.error);
      });

      rzp.open();

    } catch (err: any) {
      console.error('Checkout error', err);
      setError(err.message || 'An error occurred during checkout');
      setStep('confirm');
      setLoading(false);
    }
  };

  if (!selectedPlan) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-md bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
        <div className="p-5 md:p-6 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-transparent flex-1">
          {step === 'success' ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Payment Successful!</h3>
              <p className="text-slate-500 dark:text-slate-400">
                Your subscription to {selectedPlan.name} is now active.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Confirm Checkout</h3>
                <button onClick={onClose} disabled={loading} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Shield className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedPlan.name}</span>
                  <div className="flex flex-col items-end">
                    {couponData ? (
                      <>
                        <span className="font-bold text-slate-900 dark:text-white">₹{(couponData.finalPrice / 100).toFixed(2)}/{selectedPlan.interval || 'month'}</span>
                        <span className="text-xs text-slate-400 line-through">₹{(selectedPlan.price / 100).toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-bold text-slate-900 dark:text-white">₹{(selectedPlan.price / 100).toFixed(2)}/{selectedPlan.interval || 'month'}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-4">
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  Secure encrypted checkout via Razorpay
                </div>
              </div>

              {/* Promo Code Section */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Promo Code
                </label>
                {couponData ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {couponData.code} applied (-₹{(couponData.discountAmount / 100).toFixed(2)})
                      </span>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={loading || validatingCoupon}
                      placeholder="Enter code"
                      className="flex-1 h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 uppercase"
                    />
                    <Button 
                      onClick={handleValidateCoupon} 
                      disabled={loading || validatingCoupon || !couponCode.trim()}
                      className="bg-slate-900 dark:bg-slate-700 text-white"
                    >
                      {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-500 mt-1.5">{couponError}</p>}
              </div>

              {/* Tax Preview UI */}
              {taxPreview && (
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 text-sm">
                  <div className="flex justify-between mb-1.5 text-slate-500 dark:text-slate-400">
                    <span>Base Price:</span>
                    <span className={couponData ? 'line-through' : 'font-medium text-slate-900 dark:text-white'}>
                      ₹{(selectedPlan.price / 100).toFixed(2)}
                    </span>
                  </div>
                  {couponData && (
                    <div className="flex justify-between mb-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Discount ({couponData.code}):</span>
                      <span>-₹{(couponData.discountAmount / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between mb-1.5 text-slate-500 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ₹{Math.max(0, (((couponData ? couponData.finalPrice : selectedPlan.price) - taxPreview.totalTax) / 100)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-3 text-slate-500 dark:text-slate-400">
                    <span>Estimated Tax:</span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      ₹{(taxPreview.totalTax / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-white text-base">
                    <span>Total Payment:</span>
                    <div className="flex items-center gap-2">
                      {fetchingTax && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
                      <span>₹{((couponData ? couponData.finalPrice : selectedPlan.price) / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing and Subscription Preferences Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Billing State / Region *
                  </label>
                  <select 
                    value={buyerState} 
                    onChange={(e) => setBuyerState(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    <option value="">Select State...</option>
                    {['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal', 'Gujarat', 'Haryana', 'Other/International'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="hidden">
                  {/* Phone prefill is handled by user profile data automatically */}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    GSTIN / Tax ID (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={buyerGstin} 
                    onChange={(e) => setBuyerGstin(e.target.value)}
                    disabled={loading}
                    placeholder="e.g. 07AAAAA1111A1Z1"
                    className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Auto-renew checkbox temporarily removed for Razorpay test mode (recurring unsupported) */}
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold shadow-lg active:scale-98 transition-transform"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> {isRecurring ? 'Start 7-Day Free Trial' : `Pay ₹${((couponData ? couponData.finalPrice : selectedPlan.price) / 100).toFixed(2)}`}
                    </span>
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full text-slate-500"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CheckoutModal;
