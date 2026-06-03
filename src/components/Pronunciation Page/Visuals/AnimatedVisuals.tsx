import React from 'react';
import { motion } from 'framer-motion';

type ArticulationZone =
  | 'dental'
  | 'alveolar'
  | 'postalveolar'
  | 'labiodental'
  | 'bilabial'
  | 'velar'
  | 'rhotic'
  | 'vowel'
  | 'neutral';

type PlacementProfile = {
  key: string;
  title: string;
  instruction: string;
  support: string;
  zone: ArticulationZone;
};

const PHONEME_GROUPS: Array<{ profile: PlacementProfile; phonemes: string[] }> = [
  {
    profile: {
      key: 'dental_fricative',
      title: 'Dental placement',
      instruction: 'Place the tongue tip gently between the upper and lower teeth.',
      support: 'Use a soft airflow for TH sounds; avoid turning it into a hard T/D stop.',
      zone: 'dental',
    },
    phonemes: ['TH', 'DH'],
  },
  {
    profile: {
      key: 'alveolar_ridge',
      title: 'Alveolar ridge control',
      instruction: 'Touch or hover the tongue tip near the alveolar ridge behind top teeth.',
      support: 'Keep contact brief for T/D/N/L/S/Z and release cleanly.',
      zone: 'alveolar',
    },
    phonemes: ['T', 'D', 'N', 'L', 'S', 'Z'],
  },
  {
    profile: {
      key: 'postalveolar_channel',
      title: 'Post-alveolar channel',
      instruction: 'Lift the tongue blade slightly back to shape a narrow fricative channel.',
      support: 'Useful for SH/CH/JH and avoids flattening into plain S sounds.',
      zone: 'postalveolar',
    },
    phonemes: ['SH', 'CH', 'JH', 'ZH'],
  },
  {
    profile: {
      key: 'labiodental_contact',
      title: 'Labiodental contact',
      instruction: 'Touch upper teeth lightly to the lower lip.',
      support: 'This creates F/V accurately and prevents bilabial substitutions.',
      zone: 'labiodental',
    },
    phonemes: ['F', 'V'],
  },
  {
    profile: {
      key: 'bilabial_closure',
      title: 'Bilabial closure',
      instruction: 'Close both lips fully, then release with controlled airflow.',
      support: 'Use for P/B/M and avoid leaking air before release.',
      zone: 'bilabial',
    },
    phonemes: ['P', 'B', 'M', 'W'],
  },
  {
    profile: {
      key: 'velar_lift',
      title: 'Back tongue lift',
      instruction: 'Raise the back of the tongue toward the soft palate.',
      support: 'Targets K/G/NG and helps prevent fronted consonant substitutions.',
      zone: 'velar',
    },
    phonemes: ['K', 'G', 'NG'],
  },
  {
    profile: {
      key: 'rhotic_shape',
      title: 'Rhotic shaping',
      instruction: 'Keep the tongue tip off the roof while curling or bunching slightly.',
      support: 'Hold a stable R color without tapping into L.',
      zone: 'rhotic',
    },
    phonemes: ['R', 'ER'],
  },
  {
    profile: {
      key: 'vowel_space',
      title: 'Vowel tongue space',
      instruction: 'Adjust tongue height/frontness with steady jaw opening for vowels.',
      support: 'Use clear vowel targets before adding final consonants.',
      zone: 'vowel',
    },
    phonemes: ['AA', 'AE', 'AH', 'AO', 'AW', 'AY', 'EH', 'EY', 'IH', 'IY', 'OW', 'OY', 'UH', 'UW'],
  },
];

const normalizePhoneme = (value: string) => String(value || '').toUpperCase().replace(/[0-2]/g, '').trim();

const resolveProfileForPhoneme = (phoneme: string): PlacementProfile | null => {
  const normalized = normalizePhoneme(phoneme);
  if (!normalized) return null;
  const matched = PHONEME_GROUPS.find((group) => group.phonemes.includes(normalized));
  return matched?.profile || null;
};

export const resolveTonguePlacement = (expected: string[], actual: string[]) => {
  const expectedSet = new Set((expected || []).map(normalizePhoneme).filter(Boolean));
  const actualSet = new Set((actual || []).map(normalizePhoneme).filter(Boolean));

  const missedTargets = [...expectedSet].filter((p) => !actualSet.has(p));
  const wrongOutputs = [...actualSet].filter((p) => !expectedSet.has(p));

  const focusTarget = missedTargets[0] || [...expectedSet][0] || [...actualSet][0] || '';
  const focusSpoken = wrongOutputs[0] || [...actualSet][0] || '';

  const targetProfile = resolveProfileForPhoneme(focusTarget);
  const spokenProfile = resolveProfileForPhoneme(focusSpoken);

  const primary = targetProfile || spokenProfile || {
    key: 'neutral',
    title: 'General tongue stability',
    instruction: 'Keep the tongue relaxed and move deliberately between target sounds.',
    support: 'Start slow, then increase speed while preserving the same mouth shape.',
    zone: 'neutral' as ArticulationZone,
  };

  return {
    primary,
    focusTarget,
    focusSpoken,
    targetProfile,
    spokenProfile,
  };
};

export function AspirationPuff() {
  return (
    <motion.svg viewBox="0 0 240 120" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-12 h-12">
      <g fill="#cce7ff"><ellipse cx="170" cy="60" rx="40" ry="18" opacity="0.95"/></g>
      <g stroke="#333" fill="none"><rect x="20" y="45" width="80" height="30" rx="6"/></g>
    </motion.svg>
  );
}

export function TongueRetract() {
  return (
    <motion.svg viewBox="0 0 260 140" initial={{ y: 8 }} animate={{ y: [8, 0, 8] }} transition={{ repeat: Infinity, repeatType: 'mirror', duration: 1.4, ease: 'easeInOut' }} className="w-12 h-12">
      <g fill="#f5c2b0"><ellipse cx="130" cy="90" rx="70" ry="22"/></g>
      <path d="M40 90 C90 60 170 60 220 90" stroke="#a33" strokeWidth="3" fill="none"/>
    </motion.svg>
  );
}

export function StressPulse() {
  return (
    <motion.svg viewBox="0 0 300 80" initial={{ scale: 0.95 }} animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-12 h-12">
      <polyline points="0,40 40,40 60,20 100,60 140,40 180,70 220,40 300,40" fill="none" stroke="#333" strokeWidth="2"/>
    </motion.svg>
  );
}

const tonguePathForZone = (zone: ArticulationZone) => {
  switch (zone) {
    case 'dental':
      return 'M36 104 C70 72 98 63 128 52 C141 47 151 47 162 54 C145 60 126 70 98 93 C75 112 56 118 36 114 Z';
    case 'alveolar':
      return 'M34 106 C66 88 96 74 126 68 C144 64 160 67 168 75 C146 80 124 88 100 102 C78 114 56 118 34 114 Z';
    case 'postalveolar':
      return 'M34 106 C63 94 92 83 122 80 C142 78 161 82 172 92 C148 96 123 103 96 114 C72 123 52 124 34 118 Z';
    case 'labiodental':
      return 'M34 108 C65 96 92 90 120 88 C145 86 165 92 173 101 C147 102 121 107 94 116 C70 123 51 124 34 118 Z';
    case 'bilabial':
      return 'M34 108 C64 100 92 96 122 95 C144 94 162 100 172 109 C147 109 120 112 93 118 C69 123 50 123 34 118 Z';
    case 'velar':
      return 'M34 108 C61 103 89 101 117 103 C140 105 163 96 176 84 C172 96 167 109 151 117 C130 128 100 128 75 122 C56 118 43 114 34 108 Z';
    case 'rhotic':
      return 'M34 108 C64 96 93 86 120 86 C138 86 152 90 161 98 C150 100 136 104 126 112 C115 120 100 121 84 118 C65 114 49 111 34 108 Z';
    case 'vowel':
      return 'M34 108 C62 99 88 94 114 94 C137 94 157 99 170 106 C145 107 120 112 96 119 C74 125 54 124 34 118 Z';
    default:
      return 'M34 108 C64 98 92 90 120 88 C144 86 162 92 172 102 C147 104 121 109 95 117 C71 124 51 124 34 118 Z';
  }
};

const tonguePulsePathForZone = (zone: ArticulationZone) => {
  switch (zone) {
    case 'dental':
      return 'M36 104 C72 69 101 58 132 50 C145 46 156 47 168 56 C148 62 127 73 98 96 C74 115 56 119 36 114 Z';
    case 'velar':
      return 'M34 108 C61 103 88 102 116 104 C141 106 164 92 178 79 C174 95 168 111 151 121 C130 132 100 130 75 123 C56 118 42 113 34 108 Z';
    default:
      return tonguePathForZone(zone);
  }
};

function ArticulationMouthMap({ zone, label, tone }: { zone: ArticulationZone; label: string; tone: 'target' | 'spoken' }) {
  const tongue = tonguePathForZone(zone);
  const tonguePulse = tonguePulsePathForZone(zone);
  const tongueColor = tone === 'target' ? '#22c55e' : '#ef4444';
  const chipTone = tone === 'target'
    ? 'text-emerald-700 bg-emerald-100 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-900/30 dark:border-emerald-800/50'
    : 'text-rose-700 bg-rose-100 border-rose-200 dark:text-rose-300 dark:bg-rose-900/30 dark:border-rose-800/50';

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p-2">
      <div className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-extrabold uppercase tracking-widest ${chipTone}`}>
        {label}
      </div>
      <motion.svg viewBox="0 0 220 140" className="w-full h-28 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <path d="M14 74 C22 35 60 18 112 20 C164 22 198 42 206 74 C198 106 164 124 112 126 C60 128 22 111 14 74 Z" fill="#fde6d8" stroke="#c9a38f" strokeWidth="2"/>
        <path d="M28 61 C60 45 95 40 130 42 C154 44 174 50 190 61" stroke="#8f6d5c" strokeWidth="3" fill="none"/>
        <path d="M34 66 C61 56 90 53 120 55 C146 57 168 62 186 70" stroke="#ffffff" strokeWidth="4" fill="none" opacity="0.9"/>
        <path d="M30 84 C62 96 95 101 128 99 C154 97 175 91 190 82" stroke="#8f6d5c" strokeWidth="3" fill="none"/>
        <motion.path d={tongue} fill={tongueColor} opacity={0.85} animate={{ d: [tongue, tonguePulse, tongue] }} transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }} />
        <circle cx={zone === 'dental' ? 154 : zone === 'alveolar' ? 138 : zone === 'postalveolar' ? 126 : zone === 'labiodental' ? 168 : zone === 'bilabial' ? 180 : zone === 'velar' ? 104 : zone === 'rhotic' ? 132 : zone === 'vowel' ? 116 : 128} cy={zone === 'dental' ? 56 : zone === 'alveolar' ? 61 : zone === 'postalveolar' ? 67 : zone === 'labiodental' ? 70 : zone === 'bilabial' ? 73 : zone === 'velar' ? 78 : zone === 'rhotic' ? 71 : zone === 'vowel' ? 82 : 72} r="4" fill={tongueColor} />
      </motion.svg>
    </div>
  );
}

export function TonguePlacementCoach({ expected = [], actual = [] }: { expected?: string[]; actual?: string[] }) {
  const resolved = resolveTonguePlacement(expected, actual);
  const animationKey =
    resolved.primary.key === 'dental_fricative' ? 'tongue_retract' :
    resolved.primary.key === 'postalveolar_channel' ? 'stress_wave' :
    resolved.primary.key === 'labiodental_contact' ? 'aspiration_burst' :
    resolved.primary.key === 'velar_lift' ? 'tongue_retract_motion' :
    resolved.primary.key === 'rhotic_shape' ? 'stress_pulse' :
    'tongue_retract';

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 p-3">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
          <AnimatedVisual keyName={animationKey} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Tongue Placement Coach</p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1">{resolved.primary.title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{resolved.primary.instruction}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{resolved.primary.support}</p>
          {(resolved.focusTarget || resolved.focusSpoken) ? (
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 mt-2">
              Target focus: {resolved.focusTarget || 'n/a'}
              {resolved.focusSpoken ? ` | Spoken: ${resolved.focusSpoken}` : ''}
            </p>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
        <ArticulationMouthMap zone={resolved.targetProfile?.zone || resolved.primary.zone} label="Target placement" tone="target" />
        <ArticulationMouthMap zone={resolved.spokenProfile?.zone || 'neutral'} label="Your spoken placement" tone="spoken" />
      </div>
    </div>
  );
}

export default function AnimatedVisual({ keyName }: { keyName: string }) {
  switch (keyName) {
    case 'aspiration_puff':
    case 'aspiration_burst':
      return <AspirationPuff />;
    case 'tongue_retract_motion':
    case 'tongue_retract':
      return <TongueRetract />;
    case 'stress_pulse':
    case 'stress_wave':
      return <StressPulse />;
    default:
      return <div className="w-12 h-12" />;
  }
}
