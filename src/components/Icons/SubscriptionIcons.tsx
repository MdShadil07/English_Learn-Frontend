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

// Epic Pro Plan Icon - Crown design with animated glows
export const ProPlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], "drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] hover:scale-110 transition-transform duration-300", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="proCrownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="50%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
      <linearGradient id="proGoldShine" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FDE047" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FEF08A" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#FDE047" stopOpacity="0.8" />
      </linearGradient>
      <filter id="proGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Glowing background halo */}
    <circle cx="12" cy="12" r="10" fill="#3B82F6" opacity="0.15" className="animate-pulse" />

    {/* Main Crown Shape */}
    <path
      d="M4 19L5 8L9 12L12 5L15 12L19 8L20 19H4Z"
      fill="url(#proCrownGradient)"
      filter="url(#proGlow)"
    />
    
    {/* Inner shine and details for 3D effect */}
    <path
      d="M5.5 17.5L6.2 9.5L9.5 12.5L12 7L14.5 12.5L17.8 9.5L18.5 17.5H5.5Z"
      fill="url(#proGoldShine)"
      opacity="0.9"
    />

    {/* Crown Jewels */}
    <circle cx="12" cy="5" r="1.5" fill="#FEF08A" className="animate-pulse" style={{ animationDelay: '0ms' }} />
    <circle cx="5" cy="8" r="1" fill="#FEF08A" className="animate-pulse" style={{ animationDelay: '300ms' }} />
    <circle cx="19" cy="8" r="1" fill="#FEF08A" className="animate-pulse" style={{ animationDelay: '600ms' }} />

    {/* Bottom base detail */}
    <path d="M4 21C4 21 8 20 12 20C16 20 20 21 20 21" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Ultra Premium Plan Icon - Crystal Diamond design with flares
export const PremiumPlanIcon: React.FC<IconProps> = ({ size = 'md', className }) => (
  <svg
    className={cn(sizeClasses[size], "drop-shadow-[0_0_12px_rgba(16,185,129,0.7)] hover:scale-110 transition-transform duration-300", className)}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="diamondGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="50%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="diamondGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.9" />
      </linearGradient>
      <filter id="premiumGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <radialGradient id="sparkle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Ambient rotating glow */}
    <circle cx="12" cy="12" r="10" fill="#10B981" opacity="0.2" className="animate-ping" style={{ animationDuration: '3s' }} />

    {/* Back facets */}
    <path d="M12 2L2 8L12 22L22 8L12 2Z" fill="url(#diamondGrad1)" filter="url(#premiumGlow)" />
    
    {/* Front top facets */}
    <path d="M2 8L12 12L22 8L17 4H7L2 8Z" fill="url(#diamondGrad2)" />
    <path d="M7 4L12 12L17 4H7Z" fill="#6EE7B7" opacity="0.7" />

    {/* Bottom facets for 3D effect */}
    <path d="M2 8L12 22L12 12L2 8Z" fill="#047857" opacity="0.6" />
    <path d="M22 8L12 22L12 12L22 8Z" fill="#065F46" opacity="0.8" />

    {/* Top table facet highlight */}
    <path d="M8 4.5H16L12 9L8 4.5Z" fill="#FFFFFF" opacity="0.5" />

    {/* Sharp white outlines for extreme crispness */}
    <path d="M12 2L2 8M12 2L22 8M2 8L12 22M22 8L12 22M2 8H22M12 2V12M12 12V22M7 4L12 12M17 4L12 12" stroke="#FFFFFF" strokeWidth="0.5" strokeLinecap="round" opacity="0.8" />

    {/* Animated sparkles */}
    <circle cx="6" cy="7" r="1.5" fill="url(#sparkle)" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
    <circle cx="18" cy="7" r="1.5" fill="url(#sparkle)" className="animate-pulse" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
    <circle cx="12" cy="18" r="1" fill="url(#sparkle)" className="animate-pulse" style={{ animationDuration: '1s', animationDelay: '1s' }} />
  </svg>
);

// Main export component for backward compatibility
export interface SubscriptionIconProps {
  type: 'free' | 'basic' | 'premium' | 'pro';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SubscriptionIcon: React.FC<SubscriptionIconProps> = ({ type, size = 'md', className }) => {
  switch (type) {
    case 'free':
      return <FreePlanIcon size={size} className={className} />;
    case 'basic':
      return <BasicPlanIcon size={size} className={className} />;
    case 'pro':
      return <ProPlanIcon size={size} className={className} />;
    case 'premium':
      return <PremiumPlanIcon size={size} className={className} />;
    default:
      return <FreePlanIcon size={size} className={className} />;
  }
};
