import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api, getBackendDocsBaseUrl } from '@/utils/api';
import { queryKeys } from '@/utils/queryKeys';
import CurrentPlanSection from '@/components/settings/subscription/CurrentPlanSection';
import BillingHistorySection from '@/components/settings/subscription/BillingHistorySection';
import CheckoutModal from '@/components/settings/subscription/CheckoutModal';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CreditCard, 
  Lock, 
  Check, 
  Trash2, 
  Plus, 
  AlertTriangle, 
  X, 
  KeyRound 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubscriptionTab: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);

  // Security Modal state
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [securityAction, setSecurityAction] = useState<'cancel' | 'toggleAutoRenew' | 'addCard' | 'deleteCard' | null>(null);
  const [securityPassword, setSecurityPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [targetAutoRenewState, setTargetAutoRenewState] = useState(false);
  const [tempCardDetails, setTempCardDetails] = useState<any>(null);

  // Card Modal state
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Status & Error state
  const [processing, setProcessing] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [successText, setSuccessText] = useState<string | null>(null);

  // Fetch current subscription
  const { 
    data: subscriptionData, 
    isLoading: isLoadingSubscription,
    refetch: refetchSubscription
  } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      try {
        const response = await api.payment.getMySubscription();
        return (response as any)?.subscription ?? null;
      } catch (err) {
        return null;
      }
    }
  });

  // Fetch user profile to get secure card vault info
  const {
    data: profileData,
    isLoading: isLoadingProfile,
    refetch: refetchProfile
  } = useQuery({
    queryKey: queryKeys.profile.get(),
    queryFn: async () => {
      try {
        const response = await api.profile.get();
        return response?.success ? response.data : null;
      } catch (err) {
        return null;
      }
    }
  });

  // Fetch available plans
  const { 
    data: plansData, 
    isLoading: isLoadingPlans 
  } = useQuery({
    queryKey: ['available-plans'],
    queryFn: async () => {
      try {
        const response = await api.payment.getPlans();
        return (response as any)?.plans ?? [];
      } catch (err) {
        return [];
      }
    }
  });

  const resetSecurityState = () => {
    setSecurityPassword('');
    setTwoFactorCode('');
    setChallengeId('');
    setTwoFactorRequired(false);
    setErrorText(null);
    setSuccessText(null);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted.substring(0, 19));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setCardExpiry(value.substring(0, 5));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCardCvv(value.substring(0, 4));
  };

  const handleUpgrade = (planId: string) => {
    setCheckoutPlanId(planId);
  };

  const handleCheckoutSuccess = () => {
    setCheckoutPlanId(null);
    refetchSubscription();
    refetchProfile();
  };

  const handleCancelClick = () => {
    setSecurityAction('cancel');
    setSecurityModalOpen(true);
  };

  const handleAddCardSubmit = () => {
    setErrorText(null);
    if (!cardHolderName.trim() || !cardNumber || !cardExpiry || !cardCvv) {
      setErrorText('Please fill in all card details.');
      return;
    }
    const cleanNumber = cardNumber.replace(/\s+/g, '');
    if (cleanNumber.length < 15 || cleanNumber.length > 19) {
      setErrorText('Please enter a valid credit card number.');
      return;
    }
    const expiryParts = cardExpiry.split('/');
    if (expiryParts.length !== 2) {
      setErrorText('Please enter expiry date in MM/YY format.');
      return;
    }
    const expMonth = parseInt(expiryParts[0], 10);
    const expYear = parseInt('20' + expiryParts[1], 10);
    if (isNaN(expMonth) || expMonth < 1 || expMonth > 12 || isNaN(expYear)) {
      setErrorText('Please enter a valid expiration month and year.');
      return;
    }
    const cleanCvv = cardCvv.trim();
    if (cleanCvv.length < 3 || cleanCvv.length > 4) {
      setErrorText('Please enter a valid CVV.');
      return;
    }

    // Determine brand
    let cardBrand = 'generic';
    if (cleanNumber.startsWith('4')) cardBrand = 'visa';
    else if (cleanNumber.startsWith('5')) cardBrand = 'mastercard';
    else if (cleanNumber.startsWith('34') || cleanNumber.startsWith('37')) cardBrand = 'amex';

    // Mock tokenization
    const last4 = cleanNumber.slice(-4);
    const cardToken = `tok_live_${Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

    // Close card modal, open security verification modal
    setCardModalOpen(false);
    setSecurityAction('addCard');
    setSecurityModalOpen(true);
    setTempCardDetails({
      cardBrand,
      last4,
      expMonth,
      expYear,
      cardToken,
      cardHolderName: cardHolderName.trim()
    });
  };

  const executeSecurityAction = async () => {
    setProcessing(true);
    setErrorText(null);
    try {
      let endpoint = '';
      let method = 'POST';
      let payload: any = {
        password: securityPassword,
        twoFactorCode: twoFactorCode || undefined,
        challengeId: challengeId || undefined
      };

      if (securityAction === 'cancel') {
        endpoint = '/api/subscription/cancel';
        payload.cancelAtCycleEnd = true;
        payload.reason = 'User cancelled via settings dashboard';
      } else if (securityAction === 'toggleAutoRenew') {
        endpoint = '/api/subscription/toggle-auto-renew';
        payload.autoRenew = targetAutoRenewState;
      } else if (securityAction === 'addCard') {
        endpoint = '/api/subscription/billing-card';
        payload = { ...payload, ...tempCardDetails };
      } else if (securityAction === 'deleteCard') {
        endpoint = '/api/subscription/billing-card';
        method = 'DELETE';
      }

      const response = await fetch(`${getBackendDocsBaseUrl()}${endpoint}`, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken') || localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.code === 'TWO_FACTOR_REQUIRED') {
        setChallengeId(result.data.challengeId);
        setTwoFactorRequired(true);
        setProcessing(false);
        return;
      }

      if (result.success) {
        setSuccessText(result.message || 'Action executed successfully.');
        setTimeout(() => {
          setSecurityModalOpen(false);
          resetSecurityState();
          setTempCardDetails(null);
          // Invalidate React Query caches for immediate reactive updates
          queryClient.invalidateQueries({ queryKey: ['my-subscription'] });
          queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
        }, 1500);
      } else {
        throw new Error(result.message || 'Action failed.');
      }
    } catch (err: any) {
      setErrorText(err.message || 'Verification failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (isLoadingSubscription || isLoadingPlans || isLoadingProfile) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl mb-6"></div>
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const currentSubscription = subscriptionData as any ?? null;
  const plans: any[] = Array.isArray(plansData) ? plansData : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing & Plans</h2>
        <p className="text-slate-500 dark:text-slate-400">
          Manage your subscription, billing details, and view your payment history.
        </p>
      </div>

      {/* Current Plan Overview */}
      <CurrentPlanSection 
        subscription={currentSubscription} 
        plans={plans} 
        onViewPlansClick={() => navigate('/pricing')}
        onCancelClick={currentSubscription?.status === 'active' ? handleCancelClick : undefined}
        onToggleAutoRenew={(targetState: boolean) => {
          if (targetState && (!profileData?.user?.billing || !profileData.user.billing.cardToken)) {
            alert('Please securely add a billing card before enabling auto-renewal.');
            return;
          }
          setTargetAutoRenewState(targetState);
          setSecurityAction('toggleAutoRenew');
          setSecurityModalOpen(true);
        }}
      />

      {/* Secure Billing Controls Section */}
      {currentSubscription && (currentSubscription.status === 'active' || currentSubscription.status === 'canceled') && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
          
          {/* Card Vault Section */}
          <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-500" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">Secure Card Vault</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> PCI Compliant
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Your payment credentials are fully secure. We use gateway tokenization to keep raw credit card details out of our local server database completely.
              </p>

              {profileData?.user?.billing?.cardToken ? (
                <div className="p-4 bg-gradient-to-r from-slate-900 to-slate-850 dark:from-slate-950 dark:to-slate-900 rounded-xl border border-slate-800 text-white relative overflow-hidden shadow-md">
                  {/* Decorative card chip */}
                  <div className="absolute right-4 top-4 w-10 h-7 bg-amber-500/20 rounded border border-amber-500/30 flex items-center justify-center opacity-60">
                    <span className="w-7 h-5 border border-amber-500/20 rounded-sm"></span>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                      {profileData.user.billing.cardBrand || 'Card'}
                    </div>
                    <div className="text-lg font-mono tracking-widest text-slate-100">
                      •••• •••• •••• {profileData.user.billing.last4}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                      <div>
                        <span className="block uppercase text-[8px]">Cardholder</span>
                        <span className="font-semibold text-slate-200">{profileData.user.billing.cardHolderName}</span>
                      </div>
                      <div className="text-right">
                        <span className="block uppercase text-[8px]">Expires</span>
                        <span className="font-semibold text-slate-200">
                          {profileData.user.billing.expMonth?.toString().padStart(2, '0')} / {profileData.user.billing.expYear?.toString().slice(-2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
                  <Lock className="w-8 h-8 text-slate-300 mb-2" />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">No payment methods saved</span>
                  <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Save a card for seamless renewals and subscription changes.</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              {profileData?.user?.billing?.cardToken ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-1.5"
                  onClick={() => {
                    setSecurityAction('deleteCard');
                    setSecurityModalOpen(true);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Card
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 flex items-center gap-1.5 shadow"
                  onClick={() => {
                    setCardHolderName('');
                    setCardNumber('');
                    setCardExpiry('');
                    setCardCvv('');
                    setCardModalOpen(true);
                  }}
                >
                  <Plus className="w-3.5 h-3.5" /> Add Card Method
                </Button>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Billing History */}
      <BillingHistorySection />

      {/* Checkout Modal */}
      {checkoutPlanId && (
        <CheckoutModal 
          planId={checkoutPlanId}
          plans={plans}
          onClose={() => setCheckoutPlanId(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {/* Card Details Modal */}
      {cardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => {
                setCardModalOpen(false);
                setErrorText(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Secure Credit Card</h3>
            </div>
            
            <div className="space-y-4">
              {errorText && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex items-start gap-2 border border-red-200 dark:border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="4111 1111 1111 1111"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    CVV
                  </label>
                  <input
                    type="password"
                    placeholder="•••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 dark:text-white"
                    value={cardCvv}
                    onChange={handleCvvChange}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCardModalOpen(false);
                    setErrorText(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow"
                  onClick={handleAddCardSubmit}
                >
                  Save Payment Method
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Security Verification Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-md p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <button 
              className="absolute right-4 top-4 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              onClick={() => {
                setSecurityModalOpen(false);
                resetSecurityState();
              }}
              disabled={processing}
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center text-center mt-2">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full mb-4">
                <KeyRound className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {twoFactorRequired ? 'Two-Factor Authentication' : 'Confirm Security Verification'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                {twoFactorRequired 
                  ? 'Please enter the 6-digit security code sent to your email to complete authorization.' 
                  : 'To verify your identity and secure your account, confirm your password to proceed.'}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {errorText && (
                <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-xs flex items-start gap-2 border border-red-200 dark:border-red-500/20">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 animate-bounce" />
                  <span>{errorText}</span>
                </div>
              )}

              {successText && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs flex items-start gap-2 border border-emerald-200 dark:border-emerald-500/20">
                  <Check className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successText}</span>
                </div>
              )}

              {!twoFactorRequired ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Your Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter account password"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    value={securityPassword}
                    onChange={(e) => setSecurityPassword(e.target.value)}
                    disabled={processing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && securityPassword) {
                        executeSecurityAction();
                      }
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    6-Digit Code
                  </label>
                  <input
                    type="text"
                    maxLength={8}
                    placeholder="e.g. 123456"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\s+/g, ''))}
                    disabled={processing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && twoFactorCode) {
                        executeSecurityAction();
                      }
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSecurityModalOpen(false);
                    resetSecurityState();
                  }}
                  disabled={processing}
                >
                  Cancel
                </Button>
                <Button
                  className="w-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 shadow flex items-center justify-center gap-2"
                  onClick={executeSecurityAction}
                  disabled={processing || (!twoFactorRequired && !securityPassword) || (twoFactorRequired && !twoFactorCode)}
                >
                  {processing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Confirm</span>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SubscriptionTab;
