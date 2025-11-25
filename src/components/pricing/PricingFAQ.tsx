import React from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel anytime from your account settings and you won’t be charged next period.' },
  { q: 'Do you offer student discounts?', a: 'We offer occasional promotions — subscribe to our newsletter or contact support.' },
  { q: 'Is there a trial?', a: 'Pro has a 7-day trial and Premium 14-day trial in most regions.' },
];

export const PricingFAQ: React.FC = () => {
  return (
    <section id="faq" className="max-w-4xl mx-auto px-4 my-12">
      <h3 className="text-2xl font-semibold mb-4">Frequently asked questions</h3>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-md border p-4">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <span className="font-medium">{f.q}</span>
              <ChevronDown className="h-4 w-4 text-slate-500 group-open:rotate-180 transition" />
            </summary>
            <div className="mt-3 text-sm text-slate-600">{f.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default PricingFAQ;
