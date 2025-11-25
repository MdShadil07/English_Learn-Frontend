import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

const createGradientId = (name: string) => `ai-personality-${name}-gradient`;

type GradientStop = { offset: string; color: string; opacity?: number };

const BaseIcon: React.FC<IconProps & {
  gradientId: string;
  stops: GradientStop[];
  accent?: string;
  children: (accentColor: string) => React.ReactNode;
}>
  = ({ size = 48, className, gradientId, stops, accent, children }) => {
    const accentColor = accent ?? '#ffffff';

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id={gradientId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            {stops.map(stop => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} stopOpacity={stop.opacity ?? 1} />
            ))}
          </linearGradient>
          <radialGradient id={`${gradientId}-glow`} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(24 24) scale(20)">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <filter id={`${gradientId}-shadow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle with gradient */}
        <circle cx="24" cy="24" r="20" fill={`url(#${gradientId})`} opacity="0.95" />
        
        {/* Subtle border */}
        <circle cx="24" cy="24" r="19.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" />
        
        {/* Inner glow */}
        <circle cx="24" cy="24" r="15" fill={`url(#${gradientId}-glow)`} opacity="0.4" />
        
        {/* Icon content with shadow */}
        <g filter={`url(#${gradientId}-shadow)`}>
          {children(accentColor)}
        </g>
      </svg>
    );
  };

// Alex Mentor - Basic Tutor (Book with growing plant/sprout - represents growth and learning)
export const BasicTutorIcon: React.FC<IconProps> = (props) => (
  <BaseIcon
    {...props}
    gradientId={createGradientId('basic')}
    stops={[
      { offset: '0%', color: '#10b981' },
      { offset: '50%', color: '#059669' },
      { offset: '100%', color: '#047857' }
    ]}
  >
    {(accent) => (
      <>
        {/* Open book */}
        <path 
          d="M24 18V32M24 18C22 18 19 17 17 17C16 17 15 17.5 15 19V30C15 30 16 29 17 29C19 29 22 30 24 30M24 18C26 18 29 17 31 17C32 17 33 17.5 33 19V30C33 30 32 29 31 29C29 29 26 30 24 30M24 30V32" 
          stroke={accent} 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Growing sprout on book */}
        <path 
          d="M24 22C24 22 25 20 26.5 20C28 20 28 21.5 28 21.5" 
          stroke={accent} 
          strokeWidth="1.4" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="24" cy="23" r="0.8" fill={accent} />
      </>
    )}
  </BaseIcon>
);

// Nova Coach - Conversation (Connected speech bubbles forming network)
export const ConversationCoachIcon: React.FC<IconProps> = (props) => (
  <BaseIcon
    {...props}
    gradientId={createGradientId('conversation')}
    stops={[
      { offset: '0%', color: '#14b8a6' },
      { offset: '50%', color: '#0d9488' },
      { offset: '100%', color: '#0f766e' }
    ]}
  >
    {(accent) => (
      <>
        {/* Main speech bubble */}
        <path 
          d="M16 19C16 17.8954 16.8954 17 18 17H28C29.1046 17 30 17.8954 30 19V23C30 24.1046 29.1046 25 28 25H25L23 27L21 25H18C16.8954 25 16 24.1046 16 23V19Z" 
          stroke={accent} 
          strokeWidth="1.7" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Sound waves inside */}
        <path 
          d="M19.5 21H26.5M20.5 23H25.5" 
          stroke={accent} 
          strokeWidth="1.4" 
          strokeLinecap="round"
        />
        
        {/* Secondary bubble (response) */}
        <path 
          d="M26 28H31C31.5523 28 32 28.4477 32 29V31C32 31.5523 31.5523 32 31 32H29.5L28.5 33L27.5 32H26C25.4477 32 25 31.5523 25 31V29C25 28.4477 25.4477 28 26 28Z" 
          stroke={accent} 
          strokeWidth="1.3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          opacity="0.7"
        />
        
        {/* Connection dots */}
        <circle cx="24" cy="27" r="1" fill={accent} opacity="0.6" />
      </>
    )}
  </BaseIcon>
);

// Iris Scholar - Grammar Expert (Magnifying glass over text with corrections)
export const GrammarExpertIcon: React.FC<IconProps> = (props) => (
  <BaseIcon
    {...props}
    gradientId={createGradientId('grammar')}
    stops={[
      { offset: '0%', color: '#06b6d4' },
      { offset: '50%', color: '#0891b2' },
      { offset: '100%', color: '#0e7490' }
    ]}
  >
    {(accent) => (
      <>
        {/* Document with text lines */}
        <rect 
          x="15" 
          y="16" 
          width="14" 
          height="18" 
          rx="1.5" 
          stroke={accent} 
          strokeWidth="1.6" 
          fill="none"
        />
        
        {/* Text lines with one marked */}
        <line x1="18" y1="20" x2="26" y2="20" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18" y1="23" x2="25" y2="23" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18" y1="26" x2="26" y2="26" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        <line x1="18" y1="29" x2="24" y2="29" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
        
        {/* Checkmark */}
        <path 
          d="M20 32L21.5 33.5L24 31" 
          stroke={accent} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        
        {/* Magnifying glass */}
        <circle 
          cx="28" 
          cy="27" 
          r="4" 
          stroke={accent} 
          strokeWidth="1.7" 
          fill="none"
        />
        <line 
          x1="31" 
          y1="30" 
          x2="33.5" 
          y2="32.5" 
          stroke={accent} 
          strokeWidth="1.8" 
          strokeLinecap="round"
        />
      </>
    )}
  </BaseIcon>
);

// Atlas Mentor - Business (Briefcase with rising graph/chart)
export const BusinessMentorIcon: React.FC<IconProps> = (props) => (
  <BaseIcon
    {...props}
    gradientId={createGradientId('business')}
    stops={[
      { offset: '0%', color: '#a855f7' },
      { offset: '50%', color: '#9333ea' },
      { offset: '100%', color: '#7e22ce' }
    ]}
  >
    {(accent) => (
      <>
        {/* Briefcase base */}
        <rect 
          x="16" 
          y="24" 
          width="16" 
          height="10" 
          rx="1.5" 
          stroke={accent} 
          strokeWidth="1.7" 
          fill="none"
        />
        
        {/* Handle */}
        <path 
          d="M21 24V21C21 20.4477 21.4477 20 22 20H26C26.5523 20 27 20.4477 27 21V24" 
          stroke={accent} 
          strokeWidth="1.6" 
          strokeLinecap="round"
        />
        
        {/* Lock/clasp */}
        <circle 
          cx="24" 
          cy="28" 
          r="1.2" 
          fill={accent}
        />
        
        {/* Rising chart inside */}
        <path 
          d="M19 31L21 29L23 30L25 27.5L27 28.5L29 26.5" 
          stroke={accent} 
          strokeWidth="1.3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          opacity="0.8"
        />
        
        {/* Success indicator */}
        <circle 
          cx="29" 
          cy="20" 
          r="3" 
          stroke={accent} 
          strokeWidth="1.5" 
          fill="none"
        />
        <path 
          d="M27.5 20L28.5 21L30.5 19" 
          stroke={accent} 
          strokeWidth="1.3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </>
    )}
  </BaseIcon>
);

// Luna Guide - Cultural (Globe with cultural symbols/compass)
export const CulturalGuideIcon: React.FC<IconProps> = (props) => (
  <BaseIcon
    {...props}
    gradientId={createGradientId('cultural')}
    stops={[
      { offset: '0%', color: '#f59e0b' },
      { offset: '50%', color: '#d97706' },
      { offset: '100%', color: '#b45309' }
    ]}
    accent="#fef3c7"
  >
    {(accent) => (
      <>
        {/* Globe circle */}
        <circle 
          cx="24" 
          cy="24" 
          r="9" 
          stroke={accent} 
          strokeWidth="1.8" 
          fill="none"
        />
        
        {/* Latitude lines */}
        <ellipse 
          cx="24" 
          cy="24" 
          rx="9" 
          ry="3" 
          stroke={accent} 
          strokeWidth="1.2" 
          fill="none"
          opacity="0.6"
        />
        <line 
          x1="15" 
          y1="24" 
          x2="33" 
          y2="24" 
          stroke={accent} 
          strokeWidth="1.2" 
          opacity="0.6"
        />
        
        {/* Longitude line */}
        <path 
          d="M24 15C24 15 21 18 21 24C21 30 24 33 24 33M24 15C24 15 27 18 27 24C27 30 24 33 24 33" 
          stroke={accent} 
          strokeWidth="1.2" 
          fill="none"
          opacity="0.6"
        />
        
        {/* Compass points */}
        <circle cx="24" cy="15" r="1" fill={accent} />
        <circle cx="24" cy="33" r="1" fill={accent} />
        <circle cx="15" cy="24" r="1" fill={accent} />
        <circle cx="33" cy="24" r="1" fill={accent} />
        
        {/* Cultural connection paths */}
        <path 
          d="M18 19L20 21M26 21L28 19M20 27L18 29M28 29L26 27" 
          stroke={accent} 
          strokeWidth="1" 
          strokeLinecap="round"
          opacity="0.5"
        />
      </>
    )}
  </BaseIcon>
);

export const AIPersonalityIcons = {
  'basic-tutor': BasicTutorIcon,
  'conversation-coach': ConversationCoachIcon,
  'grammar-expert': GrammarExpertIcon,
  'business-mentor': BusinessMentorIcon,
  'cultural-guide': CulturalGuideIcon,
};

export type AIPersonalityIconId = keyof typeof AIPersonalityIcons;

export const getPersonalityIcon = (id: AIPersonalityIconId) => AIPersonalityIcons[id];
