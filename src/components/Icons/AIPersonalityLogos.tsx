import React from 'react';

import { NovaPersonalityAvatar } from './NovaLogo';
import { LiamPersonalityAvatar } from './LiamLogo';
import { CoachTaylorPersonalityLogo } from './CoachTaylorLogo';

interface LogoProps {
  size?: number;
  className?: string;
}

export type AIPersonalityLogoId =
  | 'basic-tutor'
  | 'conversation-coach'
  | 'grammar-expert'
  | 'business-mentor'
  | 'cultural-guide';

export const getConversationPersonalityLogo = (id: AIPersonalityLogoId) => {
  switch (id) {
    case 'conversation-coach':
      return ({ size = 22, className }: LogoProps) => <CoachTaylorPersonalityLogo size={size} className={className} animated={false} />;
    case 'cultural-guide':
      return LunaGuideLogo;
    case 'grammar-expert':
      return LiamPersonalityLogo;
    case 'business-mentor':
      return NovaPersonalityLogo;
    case 'basic-tutor':
    default:
      return AlexPersonalityLogo;
  }
};

const wrapSizedLogo = (Icon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'hero'; showLabel?: boolean }>): React.FC<LogoProps> => (
  { size = 22, className }
) => (
  <div
    className={className}
    style={{
      width: size,
      height: size,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: 'translateZ(0)',
      transition: 'transform 180ms ease, opacity 180ms ease',
    }}
  >
    <Icon size={size >= 40 ? 'md' : size >= 28 ? 'sm' : 'sm'} showLabel={false} />
  </div>
);

const wrapPresentationLogo = (Logo: React.ComponentType): React.FC<LogoProps> => ({ size = 22, className }) => {
  const scale = Math.max(size / 420, 0.05);

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 420,
          height: 420,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Logo />
      </div>
    </div>
  );
};

const useSvgId = (prefix: string) => `${prefix}-${React.useId().replace(/:/g, '')}`;

export const AlexPersonalityLogo: React.FC<LogoProps> = ({ size = 22, className }) => {
  const id = useSvgId('alex');

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateZ(0)',
        transition: 'transform 180ms ease, opacity 180ms ease',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Alex Mentor logo">
        <defs>
          <linearGradient id={`${id}-case`} x1="12" y1="8" x2="88" y2="94" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F8FAFC" />
            <stop offset="0.38" stopColor="#D1FAE5" />
            <stop offset="1" stopColor="#0F766E" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="20" y1="4" x2="80" y2="96" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.42" stopColor="#6EE7B7" />
            <stop offset="0.72" stopColor="#10B981" />
            <stop offset="1" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id={`${id}-glyph`} x1="24" y1="78" x2="78" y2="18" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#064E3B" />
            <stop offset="0.5" stopColor="#10B981" />
            <stop offset="1" stopColor="#A7F3D0" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="34" cy="20" r="70" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.92" />
            <stop offset="0.5" stopColor="#D1FAE5" stopOpacity="0.42" />
            <stop offset="1" stopColor="#0F766E" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="7" stdDeviation="7" floodColor="#064E3B" floodOpacity="0.28" />
          </filter>
        </defs>

        <rect x="8" y="8" width="84" height="84" rx="24" fill={`url(#${id}-edge)`} filter={`url(#${id}-shadow)`} />
        <rect x="11" y="11" width="78" height="78" rx="21" fill={`url(#${id}-case)`} />
        <rect x="13" y="13" width="74" height="74" rx="19" fill={`url(#${id}-glow)`} />
        <path d="M24 28C36 20 52 19 66 27" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
        <path d="M22 70C33 81 68 82 80 63" fill="none" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" opacity="0.2" />

        <g filter={`url(#${id}-shadow)`}>
          <path
            d="M25 75L45 25C46.5 21.2 53.5 21.2 55 25L75 75"
            fill="none"
            stroke={`url(#${id}-glyph)`}
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M36 58H64" stroke="#ECFDF5" strokeWidth="7" strokeLinecap="round" opacity="0.96" />
          <path d="M39 58H61" stroke="#059669" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          <path d="M64 37L74 47L87 30" fill="none" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M64 37L74 47L87 30" fill="none" stroke="#059669" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g opacity="0.82">
          <path d="M30 80C40 74 48 74 50 80C52 74 60 74 70 80" fill="none" stroke="#ECFDF5" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M31 76C41 70 48 70 50 76C52 70 59 70 69 76" fill="none" stroke="#047857" strokeWidth="1.7" strokeLinecap="round" />
        </g>
        <circle cx="75" cy="23" r="3.6" fill="#A7F3D0" />
        <circle cx="22" cy="38" r="2.1" fill="#FFFFFF" opacity="0.78" />
      </svg>
    </div>
  );
};

export const LunaGuideLogo: React.FC<LogoProps> = ({ size = 22, className }) => {
  const id = useSvgId('luna');

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: 'translateZ(0)',
        transition: 'transform 180ms ease, opacity 180ms ease',
      }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label="Luna Guide logo">
        <defs>
          <linearGradient id={`${id}-frame`} x1="10" y1="8" x2="90" y2="92" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FEF3C7" />
            <stop offset="0.4" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id={`${id}-core`} x1="16" y1="14" x2="84" y2="88" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.45" stopColor="#ECFEFF" />
            <stop offset="1" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id={`${id}-gold`} x1="24" y1="24" x2="78" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FFFBEB" />
            <stop offset="0.52" stopColor="#FBBF24" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id={`${id}-aqua`} x1="18" y1="72" x2="78" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0E7490" />
            <stop offset="0.5" stopColor="#22D3EE" />
            <stop offset="1" stopColor="#A5F3FC" />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-22%" y="-22%" width="144%" height="144%">
            <feDropShadow dx="0" dy="8" stdDeviation="7" floodColor="#0F172A" floodOpacity="0.34" />
          </filter>
        </defs>

        <rect x="8" y="8" width="84" height="84" rx="24" fill={`url(#${id}-frame)`} filter={`url(#${id}-shadow)`} />
        <rect x="11" y="11" width="78" height="78" rx="21" fill={`url(#${id}-core)`} />
        <circle cx="50" cy="50" r="32" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.62" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="#0E7490" strokeWidth="1.4" strokeDasharray="3 5" opacity="0.42" />

        <g filter={`url(#${id}-shadow)`}>
          <path
            d="M58 22C46 26 38 37 38 50C38 65 49 76 64 78C58 83 49 85 41 82C26 77 17 62 20 46C24 29 40 18 58 22Z"
            fill={`url(#${id}-gold)`}
          />
          <path
            d="M58 22C50 31 50 43 58 53C65 62 75 65 84 61C81 73 70 80 58 79C43 77 32 65 32 50C32 35 43 24 58 22Z"
            fill="#F8FAFC"
            opacity="0.92"
          />
          <path d="M26 66C39 58 61 58 75 66" fill="none" stroke={`url(#${id}-aqua)`} strokeWidth="5" strokeLinecap="round" />
          <path d="M29 69C40 76 60 76 72 69" fill="none" stroke="#A5F3FC" strokeWidth="2.6" strokeLinecap="round" opacity="0.9" />
          <path d="M50 30V73M29 51H78" stroke="#0891B2" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        </g>

        <path d="M77 24L80 31L87 34L80 37L77 44L74 37L67 34L74 31Z" fill="#FDE68A" stroke="#FFFFFF" strokeWidth="1" />
        <path d="M22 32L24 36L28 38L24 40L22 44L20 40L16 38L20 36Z" fill="#67E8F9" opacity="0.9" />
        <path d="M18 22C28 14 42 12 54 17" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.72" />
      </svg>
    </div>
  );
};

export const NovaPersonalityLogo = wrapSizedLogo(NovaPersonalityAvatar);
export const LiamPersonalityLogo = wrapSizedLogo(LiamPersonalityAvatar);
export const CoachTaylorLogo = ({ size = 22, className }: LogoProps) => (
  <CoachTaylorPersonalityLogo size={size} className={className} />
);
export const SophiaLogo = LunaGuideLogo;

export const getPersonalityLogo = (id: AIPersonalityIconId) => {
  switch (id) {
    case 'basic-tutor':
      return AlexPersonalityLogo;
    case 'conversation-coach':
      return CoachTaylorLogo;
    case 'grammar-expert':
      return LiamPersonalityLogo;
    case 'business-mentor':
      return NovaPersonalityLogo;
    case 'cultural-guide':
      return LunaGuideLogo;
    default:
      return AlexPersonalityLogo;
  }
};
