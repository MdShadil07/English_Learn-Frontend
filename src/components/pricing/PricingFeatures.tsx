import React from 'react';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';

export const PricingFeatures: React.FC = () => {
  const features = [
    { icon: <Sparkles className="w-5 h-5 text-emerald-500" />, title: 'AI-driven learning paths', desc: 'Personalized practice plans powered by your activity.' },
    { icon: <Zap className="w-5 h-5 text-emerald-500" />, title: 'Instant grammar fixes', desc: 'Real-time corrections with detailed explanations.' },
    { icon: <Crown className="w-5 h-5 text-emerald-500" />, title: 'Premium insights', desc: 'Advanced analytics and predictions for premium users.' },
    { icon: <Check className="w-5 h-5 text-emerald-500" />, title: 'Community & support', desc: 'Access to community rooms and priority support.' },
  ];

  return (
    <section className="max-w-6xl mx-auto my-12 px-4">
      <h3 className="text-2xl font-semibold mb-4">What you get with our plans</h3>
      <div className="grid sm:grid-cols-2 gap-6">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-4 p-4 rounded-lg border bg-white/50 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50">{f.icon}</div>
            <div>
              <div className="font-medium">{f.title}</div>
              <p className="text-sm text-slate-600">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PricingFeatures;
