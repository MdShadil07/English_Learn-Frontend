/**
 * 📊 ADVANCED ANALYTICS COMPONENTS
 * Reusable chart and visualization components for analytics dashboard
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Clock,
  Target,
  Zap,
  Award,
  BookOpen,
  Brain,
  Sparkles
} from 'lucide-react';

// ========== ANIMATED PROGRESS RING ==========
export interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  subLabel?: string;
  showPercentage?: boolean;
  gradient?: string;
  icon?: React.ElementType;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  subLabel,
  showPercentage = true,
  gradient = "from-emerald-500 to-teal-500",
  icon: Icon
}) => {
  const percentage = (value / max) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`stop-color-${gradient.split('-')[1]}`} stopColor="var(--emerald-500)" />
              <stop offset="100%" className={`stop-color-${gradient.split('-')[3]}`} stopColor="var(--teal-500)" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {Icon && (
            <Icon className={cn("w-6 h-6 mb-1 bg-gradient-to-r bg-clip-text text-transparent", gradient)} />
          )}
          {showPercentage && (
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
      
      {label && (
        <div className="text-center">
          <p className="font-semibold text-sm">{label}</p>
          {subLabel && <p className="text-xs text-muted-foreground">{subLabel}</p>}
        </div>
      )}
    </div>
  );
};

// ========== HEAT MAP CALENDAR ==========
export interface HeatMapDay {
  date: string;
  value: number;
  label?: string;
}

export interface HeatMapCalendarProps {
  data: HeatMapDay[];
  weeks?: number;
}

export const HeatMapCalendar: React.FC<HeatMapCalendarProps> = ({ 
  data, 
  weeks = 12 
}) => {
  const getColor = (value: number) => {
    if (value === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (value < 25) return 'bg-emerald-200 dark:bg-emerald-900';
    if (value < 50) return 'bg-emerald-400 dark:bg-emerald-700';
    if (value < 75) return 'bg-emerald-500 dark:bg-emerald-600';
    return 'bg-emerald-600 dark:bg-emerald-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Activity Heatmap</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((val) => (
              <div key={val} className={cn("w-3 h-3 rounded-sm", getColor(val))} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-1">
        {data.slice(0, weeks * 7).map((day, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.01 }}
            className={cn(
              "w-full aspect-square rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-emerald-400",
              getColor(day.value)
            )}
            title={`${day.date}: ${day.value}% activity`}
          />
        ))}
      </div>
    </div>
  );
};

// ========== TREND INDICATOR ==========
export interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  label: string;
  format?: 'number' | 'percentage' | 'time';
  showDiff?: boolean;
}

export const TrendIndicator: React.FC<TrendIndicatorProps> = ({
  value,
  previousValue,
  label,
  format = 'number',
  showDiff = true
}) => {
  const diff = value - previousValue;
  const percentageChange = previousValue !== 0 ? (diff / previousValue) * 100 : 0;
  const isPositive = diff > 0;
  const isNeutral = diff === 0;

  const formatValue = (val: number) => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return '0';
    if (format === 'percentage') return `${Math.round(val)}%`;
    if (format === 'time') return `${val}h`;
    return val.toLocaleString();
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">
          {formatValue(value)}
        </p>
      </div>
      
      {showDiff && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
          isPositive && "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400",
          !isPositive && !isNeutral && "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400",
          isNeutral && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
        )}>
          {isPositive && <TrendingUp className="w-3 h-3" />}
          {!isPositive && !isNeutral && <TrendingDown className="w-3 h-3" />}
          {isNeutral && <Minus className="w-3 h-3" />}
          <span>{Math.abs(percentageChange).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

// ========== SKILL RADAR CHART ==========
export interface SkillRadarProps {
  data: Array<{
    skill: string;
    value: number;
    max?: number;
  }>;
  size?: number;
}

export const SkillRadar: React.FC<SkillRadarProps> = ({ 
  data, 
  size = 200 
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const angleStep = (Math.PI * 2) / data.length;

  const getPoint = (index: number, value: number, max: number = 100) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  const points = data.map((d, i) => getPoint(i, d.value, d.max || 100));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="mx-auto">
      {/* Grid circles */}
      {[20, 40, 60, 80, 100].map((percent) => (
        <circle
          key={percent}
          cx={centerX}
          cy={centerY}
          r={(percent / 100) * radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="text-gray-200 dark:text-gray-700"
          opacity="0.3"
        />
      ))}

      {/* Skill lines */}
      {data.map((_, index) => {
        const endPoint = getPoint(index, 100);
        return (
          <line
            key={index}
            x1={centerX}
            y1={centerY}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
            opacity="0.3"
          />
        );
      })}

      {/* Data area */}
      <motion.path
        d={pathData}
        fill="url(#radarGradient)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Data points */}
      {points.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="currentColor"
          className="text-emerald-500"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5 + index * 0.1 }}
        />
      ))}

      {/* Labels */}
      {data.map((d, index) => {
        const labelPoint = getPoint(index, 120);
        return (
          <text
            key={index}
            x={labelPoint.x}
            y={labelPoint.y}
            textAnchor="middle"
            className="text-xs font-medium fill-current text-foreground"
          >
            {d.skill}
          </text>
        );
      })}

      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--emerald-500)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--emerald-500)" />
          <stop offset="100%" stopColor="var(--teal-500)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// ========== TIME SERIES CHART ==========
export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface TimeSeriesChartProps {
  data: TimeSeriesPoint[];
  height?: number;
  showGrid?: boolean;
  animate?: boolean;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  data,
  height = 200,
  showGrid = true,
  animate = true
}) => {
  if (data.length === 0) return null;

  const width = 100; // percentage
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const getY = (value: number) => {
    return ((maxValue - value) / range) * 100;
  };

  const pathData = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = getY(point.value);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const areaData = `${pathData} L 100 100 L 0 100 Z`;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {showGrid && [0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeWidth="0.2"
            className="text-gray-300 dark:text-gray-600"
            opacity="0.5"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={areaData}
          fill="url(#areaGradient)"
          initial={animate ? { opacity: 0 } : {}}
          animate={animate ? { opacity: 0.3 } : {}}
          transition={{ duration: 1 }}
        />

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animate ? { pathLength: 0 } : {}}
          animate={animate ? { pathLength: 1 } : {}}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100;
          const y = getY(point.value);
          return (
            <motion.circle
              key={index}
              cx={x}
              cy={y}
              r="1"
              fill="currentColor"
              className="text-emerald-500"
              initial={animate ? { scale: 0 } : {}}
              animate={animate ? { scale: 1 } : {}}
              transition={{ delay: 1 + index * 0.05 }}
            />
          );
        })}

        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--emerald-500)" />
            <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--emerald-500)" />
            <stop offset="100%" stopColor="var(--teal-500)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

// ========== COMPARISON BAR ==========
export interface ComparisonBarProps {
  label: string;
  current: number;
  previous: number;
  max?: number;
  format?: 'number' | 'percentage';
}

export const ComparisonBar: React.FC<ComparisonBarProps> = ({
  label,
  current,
  previous,
  max = 100,
  format = 'number'
}) => {
  const currentPercent = (current / max) * 100;
  const previousPercent = (previous / max) * 100;
  const improvement = current - previous;

  const formatValue = (val: number) => {
    if (typeof val !== 'number' || !Number.isFinite(val)) return '0';
    return format === 'percentage' ? `${Math.round(val)}%` : val.toLocaleString();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {formatValue(previous)} → {formatValue(current)}
          </span>
          {improvement !== 0 && (
            <Badge 
              variant={improvement > 0 ? "default" : "destructive"}
              className={cn(
                "text-xs",
                improvement > 0 && "bg-emerald-500 hover:bg-emerald-600"
              )}
            >
              {improvement > 0 ? '+' : ''}{formatValue(improvement)}
            </Badge>
          )}
        </div>
      </div>

      <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
        {/* Previous value (lighter) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${previousPercent}%` }}
          transition={{ duration: 0.8 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 opacity-50"
        />

        {/* Current value */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${currentPercent}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-end pr-2"
        >
          <span className="text-white text-xs font-bold">
            {formatValue(current)}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default {
  ProgressRing,
  HeatMapCalendar,
  TrendIndicator,
  SkillRadar,
  TimeSeriesChart,
  ComparisonBar
};
