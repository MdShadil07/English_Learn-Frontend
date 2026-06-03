import React from 'react';

import { AlexAILogo } from './AlexLogo';
import { NovaPersonalityAvatar } from './NovaLogo';
import { LiamPersonalityAvatar } from './LiamLogo';
import { CoachTaylorPersonalityLogo } from './CoachTaylorLogo';
import { SophiaPersonalityLogo } from './sophiaLogo';

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
      return ({ size = 22, className }: LogoProps) => <SophiaPersonalityLogo size={size} className={className} animated={false} showLabel={false} />;
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

export const AlexPersonalityLogo: React.FC<LogoProps> = ({ size = 22, className }) => (
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
    <AlexAILogo size={size >= 40 ? 'md' : size >= 28 ? 'sm' : 'sm'} showLabel={false} />
  </div>
);

export const NovaPersonalityLogo = wrapSizedLogo(NovaPersonalityAvatar);
export const LiamPersonalityLogo = wrapSizedLogo(LiamPersonalityAvatar);
export const CoachTaylorLogo = ({ size = 22, className }: LogoProps) => (
  <CoachTaylorPersonalityLogo size={size} className={className} />
);
export const SophiaLogo = ({ size = 22, className }: LogoProps) => (
  <SophiaPersonalityLogo size={size} className={className} showLabel={false} />
);

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
      return SophiaLogo;
    default:
      return AlexPersonalityLogo;
  }
};
