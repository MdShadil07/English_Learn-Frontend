import React from 'react';
import { FreePlanIcon, BasicPlanIcon, PremiumPlanIcon, ProPlanIcon } from '@/components/Icons/SubscriptionIcons';

const SubscriptionIconsShowcase: React.FC = () => {
  const icons = [
    { component: FreePlanIcon, name: 'Free Plan', type: 'free', color: 'slate', description: 'Connected dots' },
    { component: BasicPlanIcon, name: 'Basic Plan', type: 'basic', color: 'emerald', description: 'Filled star' },
    { component: ProPlanIcon, name: 'Pro Plan', type: 'pro', color: 'amber', description: 'Outline star' },
    { component: PremiumPlanIcon, name: 'Premium Plan', type: 'premium', color: 'purple', description: 'Diamond with facets' },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/20 rounded-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Professional Subscription Icons
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Clean SVG icons with sophisticated gradients and professional design
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {icons.map(({ component: IconComponent, name, type, color, description }) => (
          <div key={type} className="text-center group">
            <div className="mb-4 flex justify-center">
              <div className={`p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-${color}-200 dark:border-${color}-800 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                <IconComponent size="xl" className="text-current" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
              {name}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          ✨ Icon Features
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Free: Connected dots design</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Basic: Filled star with shine</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Pro: Outline star (not filled)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Premium: Diamond with facets</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          📝 Usage Examples
        </h3>
        <div className="space-y-3 text-sm font-mono">
          <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">import</span> {'{ ProPlanIcon }'} <span className="text-blue-600 dark:text-blue-400">from</span> <span className="text-green-600">'@/components/icons'</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-1">
              &lt;ProPlanIcon size="lg" className="text-amber-600" /&gt; <span className="text-gray-500">{'// Outline star'}</span>
            </p>
          </div>
          <div className="bg-white/50 dark:bg-slate-800/50 p-3 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-blue-400">import</span> {'{ PremiumPlanIcon }'} <span className="text-blue-600 dark:text-blue-400">from</span> <span className="text-green-600">'@/components/icons'</span>
            </p>
            <p className="text-slate-700 dark:text-slate-300 mt-1">
              &lt;PremiumPlanIcon size="xl" className="text-purple-600" /&gt; <span className="text-gray-500">{'// Diamond with facets'}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionIconsShowcase;
