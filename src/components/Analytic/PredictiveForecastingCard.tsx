import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Sparkles, TrendingUp, Lock, Target, BrainCircuit, TrendingDown, Lightbulb, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictiveForecastingCardProps {
  isPremium: boolean;
  forecastData?: {
    currentLevel?: string;
    nextLevel?: string;
    readinessScore?: number;
    expectedArrival: string | null;
    earliestArrival?: string | null;
    latestArrival?: string | null;
    probability30?: number;
    probability60?: number;
    probability90?: number;
    accuracyVelocity: number;
    confidenceScore: number;
    learningMomentum?: number;
    plateauStatus?: 'none' | 'detected' | 'severe';
    roadmap?: Array<{ level: string; expectedDate: string | 'Completed' | null }>;
    recommendedFocus?: string;
    explanation?: {
      biggestStrength: string;
      biggestWeakness: string;
      momentumDesc: string;
      recentTrend: string;
      practice: string;
    };
    whatIfScenarios?: {
      doublePracticeDaysSaved: number;
      focusOnWeaknessDaysSaved: number;
    };
    projectedDataPoints: Array<{ date: string; value: number; isHistorical?: boolean; earliest?: number; latest?: number }>;
  };
  onUpgradeClick?: () => void;
}

const PredictiveForecastingCard: React.FC<PredictiveForecastingCardProps> = ({
  isPremium,
  forecastData,
  onUpgradeClick
}) => {
  const learningVelocity = forecastData?.accuracyVelocity ?? 0;
  const plateauStatus = forecastData?.plateauStatus ?? 'none';
  const hasData = Boolean(forecastData?.projectedDataPoints && forecastData.projectedDataPoints.length > 0);
  
  // Format dates for display
  const formatMonth = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short' });
    } catch {
      return dateStr;
    }
  };
  
  const formatDateDisplay = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'TBD';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'TBD';
    }
  };

  const chartData = hasData
    ? forecastData!.projectedDataPoints.map((point, index, arr) => {
        const isBridge = point.isHistorical && (index === arr.length - 1 || !arr[index + 1].isHistorical);
        return {
          month: formatMonth(point.date),
          actual: point.isHistorical ? point.value : null,
          predicted: (!point.isHistorical || isBridge) ? point.value : null,
          earliest: point.earliest,
          latest: point.latest
        };
      })
    : [];

  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md z-50">
          <p className="text-sm font-bold text-slate-900 dark:text-white mb-2">{data.month}</p>
          {data.actual !== null && (
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
              Historical: {data.actual}%
            </p>
          )}
          {data.predicted !== null && (
            <div className="mt-1">
              <p className="text-xs text-amber-600 dark:text-amber-500 font-bold">
                Predicted: {data.predicted}%
              </p>
              {data.earliest && data.latest && (
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  95% CI: {data.latest}% - {data.earliest}%
                </p>
              )}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  if (!isPremium) {
    return (
      <div className="relative w-full h-full min-h-[400px] rounded-3xl bg-slate-900/5 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 overflow-hidden group">
        <div className="absolute inset-0 p-6 opacity-30 blur-[4px] pointer-events-none select-none flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-lg">AI Velocity Analytics</h3>
          </div>
          <div className="flex-1 w-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl"></div>
        </div>
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-white/40 dark:bg-slate-950/40 backdrop-blur-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Predictive ML Forecast</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm mb-6">
            Unlock Premium to access our ML forecasting engine. See your true CEFR readiness, achievement probabilities, and custom what-if scenarios.
          </p>
          <Button onClick={onUpgradeClick} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 rounded-xl px-8 shadow-xl">
            Unlock Premium Analytics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[400px] rounded-3xl bg-white dark:bg-[#050C14] border border-amber-200 dark:border-amber-900/30 p-6 flex flex-col shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-500/10 blur-[80px] pointer-events-none"></div>

      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-orange-500/20">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">AI Learning Forecast</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Bayesian Logistic ML</p>
        </div>

        <div className="flex gap-2">
          {/* What-If Scenarios Tooltip */}
          {forecastData?.whatIfScenarios && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 group relative cursor-help">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">What-If Scenarios</p>
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between items-center gap-2">
                    <span>If you double your practice time:</span>
                    <span className="font-bold text-green-500">Save {forecastData.whatIfScenarios.doublePracticeDaysSaved} days</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span>If you focus entirely on {forecastData.explanation?.biggestWeakness}:</span>
                    <span className="font-bold text-green-500">Save {forecastData.whatIfScenarios.focusOnWeaknessDaysSaved} days</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Roadmap & Readiness Tooltip */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/50 group relative cursor-help">
            <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Readiness: {forecastData?.readinessScore}%</span>
            
            <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">Logistic Forecast Roadmap</p>
              <div className="space-y-2">
                {forecastData?.roadmap?.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{item.level}</span>
                    <span className={item.expectedDate === 'Completed' ? 'text-green-500 font-bold' : item.expectedDate ? 'text-slate-500' : 'text-rose-400 font-medium'}>
                      {item.expectedDate === 'Completed' ? 'Completed' : formatDateDisplay(item.expectedDate as string)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasData ? (
        <>
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 mb-6 relative z-10">
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
                {plateauStatus !== 'none' ? 'Plateau Detected' : 'Target Arrival'}
              </p>
              <span className={`text-lg font-black ${plateauStatus !== 'none' ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>
                {plateauStatus !== 'none' ? 'Needs Focus' : formatDateDisplay(forecastData?.expectedArrival ?? null)}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">Growth Rate</p>
              <span className="text-lg font-black text-amber-600 dark:text-amber-500">+{learningVelocity}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">90-Day Prob</p>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">{forecastData?.probability90}%</span>
            </div>
          </div>

          {/* Chart */}
          <div className="flex-1 w-full min-h-[160px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={plateauStatus !== 'none' ? "#f43f5e" : "#f59e0b"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={plateauStatus !== 'none' ? "#f43f5e" : "#f59e0b"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.2} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} domain={[50, 100]} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#colorActual)" />
                <Area type="monotone" dataKey="predicted" stroke={plateauStatus !== 'none' ? "#f43f5e" : "#f59e0b"} strokeWidth={3} strokeDasharray="5 5" fill="url(#colorPredicted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Footer Insight */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 relative z-10 flex gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-1">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Explainability</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                Projected to reach <strong className="text-slate-800 dark:text-slate-200">{forecastData?.nextLevel}</strong> between {formatDateDisplay(forecastData?.earliestArrival)} and {formatDateDisplay(forecastData?.latestArrival)}.
              </p>
              <ul className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-slate-500">
                <li className="flex items-center gap-1 truncate"><span className="text-green-500">✓</span> Strength: <strong className="truncate">{forecastData?.explanation?.biggestStrength}</strong></li>
                <li className="flex items-center gap-1 truncate"><span className="text-amber-500">⚠</span> Focus: <strong className="truncate">{forecastData?.explanation?.biggestWeakness}</strong></li>
                <li className="flex items-center gap-1 truncate"><span className="text-blue-500">✓</span> Trend: <strong>{forecastData?.explanation?.recentTrend}</strong></li>
                <li className="flex items-center gap-1 truncate"><span className="text-slate-400">↻</span> {forecastData?.explanation?.practice}</li>
              </ul>
            </div>
            
            {/* Momentum Score Badge */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 min-w-[75px] self-end">
              <span className="text-[10px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wider">Momentum</span>
              <span className={`text-2xl font-black ${forecastData?.learningMomentum && forecastData.learningMomentum > 70 ? 'text-green-500' : forecastData?.learningMomentum && forecastData.learningMomentum > 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                {forecastData?.learningMomentum ?? '--'}
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[220px] relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 flex items-center justify-center mb-4 shadow-inner border border-amber-100 dark:border-amber-900/30">
            <TrendingUp className="w-8 h-8 opacity-50" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Insufficient Data</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-[250px] leading-relaxed">
            Complete at least <strong className="text-amber-600 dark:text-amber-500">3 AI chat interactions</strong> to unlock your Bayesian ML learning forecast.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictiveForecastingCard;
