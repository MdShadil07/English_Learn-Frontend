import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  variant?: 'default' | 'white' | 'black' | 'adaptive';
  animated?: boolean;
  sidebarState?: 'expanded' | 'collapsed';
}

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
  '2xl': 'w-12 h-12',
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className,
  variant = 'adaptive',
  animated = true,
  sidebarState = 'expanded'
}) => {
  // Dynamic color handling based on variant and theme
  const getColorClasses = () => {
    switch (variant) {
      case 'white':
        return 'text-white';
      case 'black':
        return 'text-black';
      case 'adaptive':
        return 'text-current';
      default:
        return 'text-white';
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center transition-all duration-500 ease-out cursor-pointer",
        sizeClasses[size],
        animated && "hover:scale-110 hover:rotate-2 hover:drop-shadow-lg",
        sidebarState === 'collapsed' && "hover:scale-125",
        className
      )}
      role="img"
      aria-label="CognitoSpeak - AI-Powered English Learning Platform"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          'w-full h-full drop-shadow-sm transition-all duration-300',
          animated && "hover:drop-shadow-md",
          variant === 'adaptive' && "text-inherit",
          getColorClasses()
        )}
        style={{
          filter: variant === 'adaptive' ? 'inherit' : undefined,
        }}
      >
        {/* Background Circle with subtle gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1a1a" stopOpacity={1} />
            <stop offset="100%" stopColor="#000000" stopOpacity={1} />
          </linearGradient>
        </defs>

        <circle
          cx="50"
          cy="50"
          r="45"
          fill="url(#bgGradient)"
          stroke="white"
          strokeWidth="2"
          strokeOpacity="0.8"
        />

        {/* Neural Network Pattern */}
        <g transform="translate(50, 50)">
          {/* Connection nodes with staggered pulse animations */}
          <circle
            cx="0"
            cy="-20"
            r="3"
            fill="white"
            opacity="0.9"
          />
          <circle
            cx="15"
            cy="-12"
            r="2.5"
            fill="white"
            opacity="0.8"
          />
          <circle
            cx="-15"
            cy="-12"
            r="2.5"
            fill="white"
            opacity="0.8"
          />
          <circle
            cx="20"
            cy="0"
            r="2"
            fill="white"
            opacity="0.7"
          />
          <circle
            cx="-20"
            cy="0"
            r="2"
            fill="white"
            opacity="0.7"
          />
          <circle
            cx="12"
            cy="15"
            r="2.5"
            fill="white"
            opacity="0.8"
          />
          <circle
            cx="-12"
            cy="15"
            r="2.5"
            fill="white"
            opacity="0.8"
          />
          <circle
            cx="0"
            cy="20"
            r="3"
            fill="white"
            opacity="0.9"
          />

          {/* Neural pathways with enhanced visual effects */}
          <g className="transition-all duration-700" style={{ opacity: 0.7 }}>
            <path d="M0,-20 Q7.5,-16 15,-12" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
            <path d="M0,-20 Q-7.5,-16 -15,-12" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
            <path d="M15,-12 Q17.5,-6 20,0" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            <path d="M-15,-12 Q-17.5,-6 -20,0" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            <path d="M20,0 Q9,7.5 12,15" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            <path d="M-20,0 Q-9,7.5 -12,15" stroke="white" strokeWidth="1.2" strokeOpacity="0.5" fill="none"/>
            <path d="M12,15 Q6,17.5 0,20" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
            <path d="M-12,15 Q-6,17.5 0,20" stroke="white" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
          </g>

          {/* Central cognitive processing unit with enhanced effects */}
          <circle
            cx="0"
            cy="0"
            r="8"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeOpacity="0.7"
          />
          <circle
            cx="0"
            cy="0"
            r="3"
            fill="white"
          />
          <circle
            cx="0"
            cy="0"
            r="1.5"
            fill="white"
          />
        </g>

        {/* Sound waves representing speech/language with rotation */}
        <g transform="translate(75, 50)" opacity="0.7">
          {/* Primary sound wave with rotation */}
          <path
            d="M0,-8 Q3,-8 3,-4 Q3,0 0,0 Q-3,0 -3,-4 Q-3,-8 0,-8"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Secondary sound wave with counter-rotation */}
          <path
            d="M6,-10 Q9,-10 9,-5 Q9,0 6,0 Q3,0 3,-5 Q3,-10 6,-10"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Tertiary sound wave with faster rotation */}
          <path
            d="M12,-12 Q15,-12 15,-6 Q15,0 12,0 Q9,0 9,-6 Q9,-12 12,-12"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>

        {/* Subtle accent elements with enhanced effects */}
        <circle
          cx="25"
          cy="25"
          r="1"
          fill="white"
          opacity="0.3"
        />
        <circle
          cx="75"
          cy="75"
          r="1"
          fill="white"
          opacity="0.3"
        />
        <circle
          cx="75"
          cy="25"
          r="0.8"
          fill="white"
          opacity="0.4"
        />
        <circle
          cx="25"
          cy="75"
          r="0.8"
          fill="white"
          opacity="0.4"
        />
      </svg>
    </div>
  );
};
