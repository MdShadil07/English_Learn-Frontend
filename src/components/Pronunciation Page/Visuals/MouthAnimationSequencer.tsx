import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { resolveMouthAnimationCue, type MouthAnimationCue, type MouthAnimationSequence, type MouthAnimationSequenceStep, MASTER_MOUTH_POSITIONS } from './mouthAnimationLibrary';

type MouthAnimationSequencerProps = {
  cue?: Partial<MouthAnimationCue> | null;
  expected?: string[];
  actual?: string[];
  word?: string;
};

const FALLBACK_SEQUENCE: MouthAnimationSequence = {
  animationId: 'neutral-animation',
  phoneme: 'NEUTRAL',
  mistake: 'General placement',
  severity: 'low',
  animation: 'neutral-animation',
  practiceWords: ['slowly', 'clearly', 'carefully'],
  tonguePlacement: 'Keep the jaw and tongue relaxed.',
  airflow: 'Use smooth, even airflow.',
  steps: [
    { label: 'Start', position: 'neutral-mouth', caption: 'Relax the face and jaw.', durationMs: 600 },
    { label: 'Open', position: 'open-mouth', caption: 'Open the mouth gently.', durationMs: 700 },
    { label: 'Release', position: 'airflow-indicator', caption: 'Let air move steadily.', durationMs: 700 },
  ],
};

const getSequencePath = (animation: string) => {
  switch (animation) {
    case 'th-animation': return '/animations/th.json';
    case 'r-animation': return '/animations/r.json';
    case 'l-animation': return '/animations/l.json';
    case 'v-animation': return '/animations/v.json';
    case 'w-animation': return '/animations/w.json';
    case 'sh-animation': return '/animations/sh.json';
    case 'k-animation': return '/animations/k.json';
    case 'p-animation': return '/animations/p.json';
    default: return '/animations/neutral.json';
  }
};

const resolvePosition = (position: string) => MASTER_MOUTH_POSITIONS.find((item) => item.id === position)?.asset || '/animations/master-positions.svg#neutral-mouth';

function MouthPreview({ position, animationLabel }: { position: string; animationLabel: string }) {
  const positionHref = resolvePosition(position);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#dbe6f8] border border-[#d0d9ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] h-[162px] w-[162px] md:h-[176px] md:w-[176px]">
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="mouth-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f7ff" />
            <stop offset="100%" stopColor="#d8e5f9" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="220" height="220" fill="url(#mouth-glow)" rx="22" />
        <path d="M72 66 C92 32 128 32 148 66" stroke="#4f87ff" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M52 120 C77 100 143 100 168 120" stroke="#4f87ff" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M57 114 C82 88 138 88 163 114" stroke="#4f87ff" strokeWidth="4" fill="none" strokeLinecap="round" />
        <g transform="translate(0 1)">
          <use href={positionHref} />
        </g>
        <path d="M108 144 C93 154 82 156 72 154" stroke="#c0d1ef" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M112 144 C127 154 138 156 148 154" stroke="#c0d1ef" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.75" />
        <path d="M110 40 C120 44 129 51 132 60" stroke="#4f87ff" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M110 166 C104 168 98 169 92 168" stroke="#d7e2f6" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />
      </svg>
      <div className="absolute inset-x-0 bottom-4 flex justify-center">
        <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-[10px] font-bold text-slate-600 backdrop-blur shadow-sm border border-white/50">
          {animationLabel}
        </span>
      </div>
    </div>
  );
}

export default function MouthAnimationSequencer({ cue, expected = [], actual = [], word = '' }: MouthAnimationSequencerProps) {
  const resolvedCue = useMemo(() => {
    if (cue?.animation) {
      return {
        word: cue.word || word,
        phoneme: cue.phoneme || expected[0] || actual[0] || 'NEUTRAL',
        severity: cue.severity || 'low',
        animation: cue.animation,
        animationFile: cue.animationFile || getSequencePath(cue.animation),
        mistake: cue.mistake || 'General placement',
        practiceWords: cue.practiceWords || [],
        tonguePlacement: cue.tonguePlacement || 'Keep the jaw and tongue relaxed.',
        airflow: cue.airflow || 'Use smooth, even airflow.',
      } satisfies MouthAnimationCue;
    }
    return resolveMouthAnimationCue({ word: word || 'word', expectedPhonemes: expected, actualPhonemes: actual });
  }, [actual, cue, expected, word]);

  const [sequence, setSequence] = useState<MouthAnimationSequence | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showCorrect, setShowCorrect] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await fetch(resolvedCue.animationFile);
        if (!response.ok) {
          throw new Error('Unable to load mouth animation');
        }
        const payload = await response.json() as MouthAnimationSequence;
        if (!cancelled) {
          setSequence(payload);
          setActiveStepIndex(0);
        }
      } catch {
        if (!cancelled) {
          setSequence(FALLBACK_SEQUENCE);
          setActiveStepIndex(0);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [resolvedCue.animationFile]);

  useEffect(() => {
    const steps = sequence?.steps || FALLBACK_SEQUENCE.steps;
    if (!steps.length) return;
    const current = steps[Math.min(activeStepIndex, steps.length - 1)];
    const timer = window.setTimeout(() => {
      setActiveStepIndex((value) => (value + 1) % steps.length);
      setShowCorrect((value) => value || activeStepIndex >= Math.max(0, steps.length - 2));
    }, current.durationMs);
    return () => window.clearTimeout(timer);
  }, [activeStepIndex, sequence]);

  const steps = sequence?.steps || FALLBACK_SEQUENCE.steps;
  const activeStep = steps[Math.min(activeStepIndex, steps.length - 1)] as MouthAnimationSequenceStep;
  const animationTitle = sequence?.animationId || resolvedCue.animation;
  const practiceWords = sequence?.practiceWords || resolvedCue.practiceWords || [];

  const animationLabel = showCorrect ? 'Correct position' : activeStep?.label || 'Start';

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-[#1f2228] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_168px]">
        <div className="p-4 md:p-5 border-b md:border-b-0 md:border-r border-white/10 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.35em] text-slate-400">Sounds like</p>
              <h4 className="mt-2 text-[clamp(1.3rem,4vw,2.2rem)] font-black leading-none tracking-tight text-white break-words">
                {resolvedCue.phoneme}
                <span className="ml-2 text-white/90">{animationTitle.replace(/-/g, ' ')}</span>
              </h4>
              <p className="mt-2 text-sm text-slate-300 max-w-xl">{resolvedCue.mistake}</p>
            </div>
            <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-slate-100 whitespace-nowrap">
              {String(resolvedCue.severity).toUpperCase()} confidence
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Tongue placement</p>
              <p className="mt-2 text-sm text-slate-100 leading-relaxed">{resolvedCue.tonguePlacement}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-slate-400">Airflow</p>
              <p className="mt-2 text-sm text-slate-100 leading-relaxed">{resolvedCue.airflow}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {practiceWords.slice(0, 3).map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-white/90">
                {item}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-300">
            {steps.map((step, index) => (
              <button
                key={`${step.label}-${index}`}
                type="button"
                onClick={() => setActiveStepIndex(index)}
                className={`rounded-full px-3 py-1.5 border transition-colors ${index === activeStepIndex ? 'border-sky-300/60 bg-sky-400/10 text-sky-100' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                {step.label}
              </button>
            ))}
          </div>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-cyan-300"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, ((activeStepIndex + 1) / Math.max(1, steps.length)) * 100)}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>

        <div className="p-4 md:p-5 flex items-center justify-center bg-[#dde7f7]">
          <div className="flex flex-col items-center gap-2">
            <MouthPreview position={activeStep?.position || 'neutral-mouth'} animationLabel={animationLabel} />
            <p className="text-[11px] italic text-slate-500">Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
