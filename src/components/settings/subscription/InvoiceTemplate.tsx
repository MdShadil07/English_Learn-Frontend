import React from 'react';
import QRCode from 'react-qr-code';

interface InvoiceTemplateProps {
  invoice?: any;
}

// Minimalist, premium vector logo
const LogoSVG = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#0F172A" />
    <path d="M20 8L30 14V26L20 32L10 26V14L20 8Z" fill="url(#paint0_linear)" />
    <path d="M20 8L30 14V20L20 26L10 20V14L20 8Z" fill="url(#paint1_linear)" />
    <path d="M20 32V20L30 14V26L20 32Z" fill="url(#paint2_linear)" />
    <path d="M20 20L10 14V26L20 32V20Z" fill="url(#paint3_linear)" />
    <circle cx="20" cy="20" r="3" fill="#FFFFFF" shadow="0 2px 4px rgba(0,0,0,0.2)" />
    <defs>
      <linearGradient id="paint0_linear" x1="20" y1="8" x2="20" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="paint1_linear" x1="20" y1="8" x2="20" y2="26" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34D399" />
        <stop offset="1" stopColor="#10B981" />
      </linearGradient>
      <linearGradient id="paint2_linear" x1="25" y1="14" x2="25" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#047857" />
        <stop offset="1" stopColor="#064E3B" />
      </linearGradient>
      <linearGradient id="paint3_linear" x1="15" y1="14" x2="15" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
  </svg>
);

// Fallback mock data
const defaultMockInvoice = {
  paymentId: 'INV-2026-89A4B',
  referenceId: 'TXN-99823-XYZ',
  amount: 2900, // $29.00
  currency: 'USD',
  createdAt: new Date().toISOString(),
  provider: 'Stripe (Visa •••• 4242)',
  subscriptionId: {
    planId: { name: 'Pro Intelligence Tier' },
    billingState: 'California',
  },
  userId: {
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@example.com',
  }
};

export default function InvoiceTemplate({ invoice = defaultMockInvoice }: InvoiceTemplateProps) {
  // Safe extraction of data
  const planName = invoice?.subscriptionId?.planId?.name || invoice?.subscriptionId?.tier || 'Pro Subscription';
  const totalAmount = invoice?.amount > 0
    ? invoice.amount / 100
    : (invoice?.subscriptionId?.planId?.price ? invoice.subscriptionId.planId.price / 100 : 0);

  const taxRate = 0.18; // 18% tax
  const baseAmount = totalAmount / (1 + taxRate);
  const taxAmount = totalAmount - baseAmount;

  const currencySymbol = invoice?.currency === 'INR' ? '₹' : '$';

  const invoiceDate = new Date(invoice?.createdAt || invoice?.date || Date.now());
  const dateStr = invoiceDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  const timeStr = invoiceDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const user = invoice?.userId || {};
  const userName = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Valued Customer';
  const userEmail = user.email || '';
  const billingState = invoice?.subscriptionId?.billingState || user.billing?.billingState || '';
  const billingGstin = invoice?.subscriptionId?.billingGstin || user.billing?.billingGstin || '';
  const isPaid = true;

  return (
    <div className="flex justify-center p-4 md:p-8 bg-slate-100 min-h-screen font-sans">
      <div
        className="relative bg-white shadow-2xl ring-1 ring-slate-900/5 overflow-hidden"
        style={{
          width: '794px',       // Exact A4 width at 96 DPI
          minHeight: '1123px',  // Exact A4 height at 96 DPI
          margin: '0 auto',
          color: '#0f172a',
          WebkitPrintColorAdjust: 'exact', // Forces background colors to print
          printColorAdjust: 'exact',
        }}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 z-50"></div>

        {/* Faint Background Watermark Pattern */}
        <div
          className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        ></div>

        <div className="relative z-10 flex flex-col h-full px-14 py-16">

          {/* HEADER ROW */}
          <div className="flex justify-between items-start mb-16">
            <div className="flex items-center gap-4">
              <LogoSVG />
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">CognitoSpeak</h1>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Language Intelligence</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <h2 className="text-4xl font-light text-slate-300 tracking-widest uppercase mb-3">Receipt</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-100/80">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">Paid</span>
              </div>
            </div>
          </div>

          {/* SAAS SUMMARY RIBBON (Crucial for premium look) */}
          <div className="flex border-y border-slate-200/80 bg-slate-50/50 mb-12">
            <div className="flex-1 py-5 pr-6 border-r border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Amount Paid</p>
              <p className="text-2xl font-semibold text-slate-900 tabular-nums tracking-tight">{currencySymbol}{totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex-1 py-5 px-6 border-r border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Paid</p>
              <p className="text-sm font-semibold text-slate-900">{dateStr} <span className="text-slate-400 font-normal ml-1">{timeStr}</span></p>
            </div>
            <div className="flex-1 py-5 px-6 border-r border-slate-200/80">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="text-sm font-semibold text-slate-900 capitalize">{invoice?.provider || 'Credit Card'}</p>
            </div>
            <div className="flex-1 py-5 pl-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Receipt Number</p>
              <p className="text-sm font-semibold text-slate-900 font-mono">{invoice?.paymentId || 'INV-000000'}</p>
            </div>
          </div>

          {/* ADDRESS GRID */}
          <div className="grid grid-cols-2 gap-16 mb-16">
            {/* Customer Details */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">Billed To</p>
              <h3 className="text-base font-bold text-slate-900 mb-1">{userName}</h3>
              {userEmail && <p className="text-sm font-medium text-slate-500 mb-4">{userEmail}</p>}

              <div className="space-y-1">
                {billingState && (
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-400 w-16 inline-block">State:</span>
                    <span className="font-semibold text-slate-700">{billingState}</span>
                  </p>
                )}
                {billingGstin && (
                  <p className="text-xs text-slate-500">
                    <span className="text-slate-400 w-16 inline-block">GSTIN:</span>
                    <span className="font-semibold text-slate-700 font-mono">{billingGstin}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Company Details */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 text-right">Billed By</p>
              <div className="text-right">
                <h3 className="text-base font-bold text-slate-900 mb-1">CognitoSpeak Inc.</h3>
                <p className="text-sm font-medium text-slate-500 mb-1">123 Learning Avenue, Suite 400</p>
                <p className="text-sm font-medium text-slate-500 mb-4">San Francisco, CA 94107</p>
                <p className="text-xs text-slate-500">
                  <span className="text-slate-400 mr-2">Tax ID:</span>
                  <span className="font-semibold text-slate-700 font-mono">US-987654321</span>
                </p>
              </div>
            </div>
          </div>

          {/* ITEM TABLE */}
          <div className="flex-grow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900">
                  <th className="py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-3/4">Description</th>
                  <th className="py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Qty</th>
                  <th className="py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right w-1/4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-6 align-top">
                    <p className="text-sm font-bold text-slate-900 mb-1">{planName}</p>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed pr-8 max-w-md">
                      Digital subscription for interactive speech analysis, native pronunciation modeling, and real-time AI feedback.
                    </p>
                    {invoice?.referenceId && (
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">Ref: {invoice.referenceId}</p>
                    )}
                  </td>
                  <td className="py-6 align-top text-right">
                    <p className="text-sm font-semibold text-slate-700">1</p>
                  </td>
                  <td className="py-6 align-top text-right">
                    <p className="text-sm font-semibold text-slate-900 tabular-nums">{currencySymbol}{baseAmount.toFixed(2)}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* TOTALS BLOCK */}
          <div className="flex justify-end mt-8 mb-auto">
            <div className="w-[320px]">
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subtotal</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">{currencySymbol}{baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tax (18%)</span>
                  <span className="text-sm font-semibold text-slate-900 tabular-nums">{currencySymbol}{taxAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Paid</span>
                <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">{currencySymbol}{totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-slate-300 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Due</span>
                <span className="text-sm font-bold text-emerald-600 tabular-nums">{currencySymbol}0.00</span>
              </div>
            </div>
          </div>

          {/* PAID WATERMARK (Behind content, visual only) */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-12 pointer-events-none z-0 opacity-[0.02]">
            <span className="text-[180px] font-black uppercase tracking-tighter text-slate-900">PAID</span>
          </div>

          {/* FOOTER */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-end relative z-10">
            <div>
              <p className="text-xs font-bold text-slate-900 mb-1">Thank you for choosing CognitoSpeak.</p>
              <p className="text-[11px] font-medium text-slate-500">
                If you have any questions about this receipt, please contact <br />
                <span className="text-slate-800 font-semibold">support@cognitospeak.com</span>
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm mb-2">
                <QRCode
                  value={`https://cognitospeak.com/verify/receipt/${invoice?.paymentId || 'DEMO'}`}
                  size={54}
                  level="L"
                  fgColor="#0f172a"
                />
              </div>
              <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                DOC-{invoice?.paymentId?.replace(/[^a-zA-Z0-9]/g, '').slice(-8) || '00000000'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}