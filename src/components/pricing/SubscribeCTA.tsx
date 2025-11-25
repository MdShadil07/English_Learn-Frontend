import React, { useState } from 'react';
import { Mail } from 'lucide-react';

export const SubscribeCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // placeholder: in real app call API
    setSent(true);
    setTimeout(() => setEmail(''), 500);
  };

  return (
    <section className="max-w-3xl mx-auto px-4 my-8">
      <div className="rounded-xl border p-6 flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex items-center gap-4">
          <div className="rounded-md bg-emerald-600 p-3 text-white">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold">Get pricing updates & offers</div>
            <div className="text-sm text-slate-600">Join our mailing list for discounts and product news.</div>
          </div>
        </div>

        <form onSubmit={submit} className="ml-auto flex w-full sm:w-auto items-center gap-3">
          <input
            type="email"
            aria-label="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full sm:w-64 rounded-md border px-3 py-2"
          />
          <button type="submit" className="rounded-md bg-emerald-600 px-4 py-2 text-white font-semibold">
            {sent ? 'Thanks!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SubscribeCTA;
