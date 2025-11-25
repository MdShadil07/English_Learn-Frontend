import React from 'react';

type Column = {
  key: string;
  label: string;
};

export const PricingComparison: React.FC = () => {
  const columns: Column[] = [
    { key: 'feature', label: 'Feature' },
    { key: 'free', label: 'Free' },
    { key: 'pro', label: 'Pro' },
    { key: 'premium', label: 'Premium' },
  ];

  const rows = [
    { feature: 'AI conversations / day', free: '5', pro: 'Unlimited', premium: 'Unlimited' },
    { feature: 'Grammar explanations', free: 'Basic', pro: 'Detailed', premium: 'Advanced' },
    { feature: 'Vocabulary size', free: '500', pro: '3,000', premium: '10,000+' },
    { feature: 'Priority support', free: 'No', pro: 'Yes', premium: 'Yes' },
    { feature: 'Private practice rooms', free: 'No', pro: 'No', premium: 'Yes' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 my-8">
      <h3 className="text-2xl font-semibold mb-4">Compare plans</h3>
      <div className="overflow-auto rounded-lg border">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-3 text-sm font-medium text-slate-700">{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.feature} className="border-t">
                <td className="px-4 py-3 text-sm text-slate-700">{r.feature}</td>
                <td className="px-4 py-3 text-sm">{r.free}</td>
                <td className="px-4 py-3 text-sm">{r.pro}</td>
                <td className="px-4 py-3 text-sm">{r.premium}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PricingComparison;
