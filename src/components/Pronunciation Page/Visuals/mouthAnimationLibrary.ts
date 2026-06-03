export type MouthAnimationSeverity = 'low' | 'medium' | 'high';

export type MouthAnimationSequenceStep = {
  label: string;
  position: string;
  caption: string;
  durationMs: number;
};

export type MouthAnimationCue = {
  word: string;
  phoneme: string;
  severity: MouthAnimationSeverity;
  animation: string;
  animationFile: string;
  mistake: string;
  practiceWords: string[];
  tonguePlacement: string;
  airflow: string;
};

export type MouthAnimationSequence = {
  animationId: string;
  phoneme: string;
  mistake: string;
  severity: MouthAnimationSeverity;
  animation: string;
  practiceWords: string[];
  tonguePlacement: string;
  airflow: string;
  steps: MouthAnimationSequenceStep[];
};

const normalizePhoneme = (value: string) => String(value || '').toUpperCase().replace(/[0-2]/g, '').trim();

const SEQUENCE_PATHS: Record<string, string> = {
  'th-animation': '/animations/th.json',
  'r-animation': '/animations/r.json',
  'l-animation': '/animations/l.json',
  'v-animation': '/animations/v.json',
  'w-animation': '/animations/w.json',
  'sh-animation': '/animations/sh.json',
  'k-animation': '/animations/k.json',
  'p-animation': '/animations/p.json',
  'neutral-animation': '/animations/neutral.json',
};

const CUES: Record<string, Omit<MouthAnimationCue, 'word' | 'phoneme' | 'severity'>> = {
  'th-animation': {
    animation: 'th-animation',
    animationFile: SEQUENCE_PATHS['th-animation'],
    mistake: 'TH Fronting',
    practiceWords: ['think', 'three', 'thirty'],
    tonguePlacement: 'Tongue slightly between the teeth.',
    airflow: 'Gentle and continuous airflow.',
  },
  'r-animation': {
    animation: 'r-animation',
    animationFile: SEQUENCE_PATHS['r-animation'],
    mistake: 'R Reduction',
    practiceWords: ['red', 'rain', 'road'],
    tonguePlacement: 'Pull the tongue back without touching the roof.',
    airflow: 'Keep the sound smooth and controlled.',
  },
  'l-animation': {
    animation: 'l-animation',
    animationFile: SEQUENCE_PATHS['l-animation'],
    mistake: 'L Simplification',
    practiceWords: ['light', 'leaf', 'little'],
    tonguePlacement: 'Raise the tongue tip to the alveolar ridge.',
    airflow: 'Let air move around the sides of the tongue.',
  },
  'v-animation': {
    animation: 'v-animation',
    animationFile: SEQUENCE_PATHS['v-animation'],
    mistake: 'V Devoicing',
    practiceWords: ['very', 'voice', 'victory'],
    tonguePlacement: 'Touch the upper teeth lightly to the lower lip.',
    airflow: 'Keep a steady voiced airflow.',
  },
  'w-animation': {
    animation: 'w-animation',
    animationFile: SEQUENCE_PATHS['w-animation'],
    mistake: 'W Lip Rounding',
    practiceWords: ['water', 'window', 'warm'],
    tonguePlacement: 'Round the lips while keeping the tongue relaxed.',
    airflow: 'Release the sound smoothly into the vowel.',
  },
  'sh-animation': {
    animation: 'sh-animation',
    animationFile: SEQUENCE_PATHS['sh-animation'],
    mistake: 'SH Channeling',
    practiceWords: ['she', 'ship', 'shadow'],
    tonguePlacement: 'Lift the tongue blade slightly back from the ridge.',
    airflow: 'Keep the air narrow and soft.',
  },
  'k-animation': {
    animation: 'k-animation',
    animationFile: SEQUENCE_PATHS['k-animation'],
    mistake: 'Velar Fronting',
    practiceWords: ['keep', 'kite', 'cold'],
    tonguePlacement: 'Lift the back of the tongue toward the soft palate.',
    airflow: 'Hold the closure, then release cleanly.',
  },
  'p-animation': {
    animation: 'p-animation',
    animationFile: SEQUENCE_PATHS['p-animation'],
    mistake: 'Lip Closure Timing',
    practiceWords: ['pen', 'paper', 'please'],
    tonguePlacement: 'Close both lips fully before release.',
    airflow: 'Release a short burst of air.',
  },
  'neutral-animation': {
    animation: 'neutral-animation',
    animationFile: SEQUENCE_PATHS['neutral-animation'],
    mistake: 'General placement',
    practiceWords: ['slowly', 'clearly', 'carefully'],
    tonguePlacement: 'Keep the jaw and tongue relaxed.',
    airflow: 'Use smooth, even airflow.',
  },
};

const phonemeGroups: Array<{ animation: string; phonemes: string[] }> = [
  { animation: 'th-animation', phonemes: ['TH', 'DH'] },
  { animation: 'r-animation', phonemes: ['R', 'ER'] },
  { animation: 'l-animation', phonemes: ['L'] },
  { animation: 'v-animation', phonemes: ['V', 'F'] },
  { animation: 'w-animation', phonemes: ['W'] },
  { animation: 'sh-animation', phonemes: ['SH', 'CH', 'JH', 'ZH'] },
  { animation: 'k-animation', phonemes: ['K', 'G', 'NG'] },
  { animation: 'p-animation', phonemes: ['P', 'B', 'M'] },
];

export const MASTER_MOUTH_POSITIONS = [
  { id: 'neutral-mouth', label: 'Neutral', symbolId: 'neutral-mouth', asset: '/animations/master-positions.svg#neutral-mouth' },
  { id: 'closed-lips', label: 'Closed Lips', symbolId: 'closed-lips', asset: '/animations/master-positions.svg#closed-lips' },
  { id: 'open-mouth', label: 'Open Mouth', symbolId: 'open-mouth', asset: '/animations/master-positions.svg#open-mouth' },
  { id: 'rounded-lips', label: 'Rounded Lips', symbolId: 'rounded-lips', asset: '/animations/master-positions.svg#rounded-lips' },
  { id: 'wide-smile', label: 'Wide Smile', symbolId: 'wide-smile', asset: '/animations/master-positions.svg#wide-smile' },
  { id: 'lower-lip-bite', label: 'Lower Lip Bite', symbolId: 'lower-lip-bite', asset: '/animations/master-positions.svg#lower-lip-bite' },
  { id: 'tongue-forward', label: 'Tongue Forward', symbolId: 'tongue-forward', asset: '/animations/master-positions.svg#tongue-forward' },
  { id: 'tongue-between-teeth', label: 'Tongue Between Teeth', symbolId: 'tongue-between-teeth', asset: '/animations/master-positions.svg#tongue-between-teeth' },
  { id: 'tongue-up', label: 'Tongue Up', symbolId: 'tongue-up', asset: '/animations/master-positions.svg#tongue-up' },
  { id: 'tongue-back', label: 'Tongue Back', symbolId: 'tongue-back', asset: '/animations/master-positions.svg#tongue-back' },
  { id: 'airflow-indicator', label: 'Airflow', symbolId: 'airflow-indicator', asset: '/animations/master-positions.svg#airflow-indicator' },
  { id: 'release-burst', label: 'Release Burst', symbolId: 'release-burst', asset: '/animations/master-positions.svg#release-burst' },
];

export const resolveMouthAnimationCue = (input: {
  word: string;
  expectedPhonemes?: string[];
  actualPhonemes?: string[];
  issueType?: string;
  score?: number;
}): MouthAnimationCue => {
  const expected = (input.expectedPhonemes || []).map(normalizePhoneme).filter(Boolean);
  const actual = (input.actualPhonemes || []).map(normalizePhoneme).filter(Boolean);
  const primaryPhoneme = expected[0] || actual[0] || 'NEUTRAL';
  const animation = phonemeGroups.find((group) => {
    const combined = [...expected, ...actual];
    return combined.some((phoneme) => group.phonemes.includes(phoneme));
  })?.animation || 'neutral-animation';

  const base = CUES[animation] || CUES['neutral-animation'];
  const severity: MouthAnimationSeverity = typeof input.score === 'number'
    ? input.score < 60
      ? 'high'
      : input.score < 80
      ? 'medium'
      : 'low'
    : input.issueType === 'omission' || input.issueType === 'substitution'
    ? 'medium'
    : 'low';

  return {
    word: input.word,
    phoneme: primaryPhoneme,
    severity,
    ...base,
  };
};

export const getAnimationFile = (animation: string) => SEQUENCE_PATHS[animation] || SEQUENCE_PATHS['neutral-animation'];
