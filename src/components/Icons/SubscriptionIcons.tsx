import React from 'react';
import { cn } from '@/lib/utils';

interface IconProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

// Professional Free Plan Icon - Clean SVG design
export const FreePlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="freeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
      </linearGradient>
    </defs>

    {/* Three dots representing basic access */}
    <circle cx="6" cy="12" r="2" fill="url(#freeGradient)" opacity="0.7" />
    <circle cx="12" cy="12" r="2" fill="url(#freeGradient)" opacity="0.7" />
    <circle cx="18" cy="12" r="2" fill="url(#freeGradient)" opacity="0.7" />

    {/* Connection line */}
    <path
      d="M8 12L10 12M14 12L16 12"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
);

// Professional Basic Plan Icon - Enhanced star design
export const BasicPlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="basicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
      <radialGradient id="basicShine" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="white" stopOpacity="0.6" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Star shape with gradient */}
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      fill="url(#basicGradient)"
    />

    {/* Inner shine effect */}
    <circle cx="12" cy="8" r="1.5" fill="url(#basicShine)" />

    {/* Subtle outer glow */}
    <circle
      cx="12"
      cy="8"
      r="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      opacity="0.3"
    />
  </svg>
);

// Professional Pro Plan Icon - Outline star design (not filled)
export const ProPlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="proOutlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.9" />
      </linearGradient>
    </defs>

    {/* Outline star (not filled) */}
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      stroke="url(#proOutlineGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className="drop-shadow-sm"
    />

    {/* Inner outline for depth */}
    <path
      d="M12 2L15.09 8.26L22 9L15.09 9.74L12 16L8.91 9.74L2 9L8.91 8.26L12 2Z"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity="0.5"
    />

    {/* Central sparkle */}
    <circle cx="12" cy="9" r="0.8" fill="currentColor" opacity="0.7" />

    {/* Corner accents */}
    <circle cx="7" cy="6" r="0.4" fill="currentColor" opacity="0.6" />
    <circle cx="17" cy="6" r="0.4" fill="currentColor" opacity="0.6" />
    <circle cx="9" cy="13" r="0.3" fill="currentColor" opacity="0.5" />
    <circle cx="15" cy="13" r="0.3" fill="currentColor" opacity="0.5" />
  </svg>
);

// Premium Plan Icon - Diamond/Gem design
export const PremiumPlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="diamondGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.9" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
      </linearGradient>
      <radialGradient id="diamondShine" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="white" stopOpacity="0.9" />
        <stop offset="50%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <filter id="diamondGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>

    {/* Main diamond shape */}
    <path
      d="M12 2L20 8L12 22L4 8L12 2Z"
      fill="url(#diamondGradient)"
      filter="url(#diamondGlow)"
      className="drop-shadow-lg"
    />

    {/* Diamond shine effect */}
    <path
      d="M12 4L16 8L12 16L8 8L12 4Z"
      fill="url(#diamondShine)"
    />

    {/* Inner highlight */}
    <path
      d="M12 6L14 8L12 12L10 8L12 6Z"
      fill="white"
      opacity="0.6"
    />

    {/* Facet lines for diamond cut effect */}
    <path
      d="M12 2L12 22M4 8L20 8M6 5L18 19M18 5L6 19"
      stroke="white"
      strokeWidth="0.3"
      strokeLinecap="round"
      opacity="0.5"
    />

    {/* Small sparkle dots */}
    <circle cx="9" cy="6" r="0.4" fill="white" opacity="0.8" />
    <circle cx="15" cy="6" r="0.4" fill="white" opacity="0.8" />
    <circle cx="12" cy="10" r="0.3" fill="white" opacity="0.7" />
  </svg>
);

// Main export component for backward compatibility
interface SubscriptionIconProps {
  type: 'free' | 'basic' | 'premium' | 'pro';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SubscriptionIcon: React.FC<SubscriptionIconProps> = ({
  type,
  size = 'md',
  className
}) => {
  const iconProps = { size, className };

  switch (type) {
    case 'free':
      return <FreePlanIcon {...iconProps} />;
    case 'basic':
      return <BasicPlanIcon {...iconProps} />;
    case 'premium':
      return <PremiumPlanIcon {...iconProps} />;
    case 'pro':
      return <ProPlanIcon {...iconProps} />;
    default:
      return <FreePlanIcon {...iconProps} />;
  }
};
