/**
 * EnhancedVoiceSettings — Premium Voice Configuration Panel
 * Full glassmorphism design, hidden scrollbars, animated interactions,
 * tier-gated controls, voice presets, pitch/volume sliders, and personality explorer.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Crown, Sparkles, User, Users, Play, Check, Lock,
  Mic, Sliders, Wand2, BarChart3, ChevronRight,
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  VOICE_PRESETS,
  VOICE_PERSONALITIES,
  getBestVoiceForPersonality,
  getVoiceSettings,
  getPremiumVoices,
  getVoicesByGender,
  VoicePreset,
  VoicePersonality,
} from '@/utils/AI Chat/voicePersonalities';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface VoiceSettingsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speechRate: number;
  speechPitch?: number;
  speechVolume?: number;
  userTier: 'free' | 'pro' | 'premium';
  currentPersonalityId?: string;
  onVoiceSelect: (voice: SpeechSynthesisVoice) => void;
  onSpeechRateChange: (rate: number) => void;
  onSpeechPitchChange?: (pitch: number) => void;
  onSpeechVolumeChange?: (volume: number) => void;
  onTestVoice: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const tierOrder: Record<string, number> = { free: 0, pro: 1, premium: 2 };

const isPremiumVoice = (voice: SpeechSynthesisVoice) =>
  ['Premium', 'Enhanced', 'Neural', 'Desktop', 'Natural', 'HD'].some((kw) =>
    voice.name.includes(kw)
  );

// Hide-scrollbar style string
const noScrollbar: React.CSSProperties = { scrollbarWidth: 'none', msOverflowStyle: 'none' };

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Slim section label */
const Label = ({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-1.5 mb-2.5">
    {icon && <span className="text-emerald-500 dark:text-emerald-400">{icon}</span>}
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
      {children}
    </p>
  </div>
);

/** Premium slider row with glowing value badge */
const SliderRow = ({
  label, value, min, max, step, format, onChange, locked, color = 'emerald',
}: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
  locked?: boolean; color?: 'emerald' | 'purple' | 'amber';
}) => {
  const pct = ((value - min) / (max - min)) * 100;
  const colorMap = {
    emerald: {
      badge: 'border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/10',
      track: 'from-emerald-400 to-teal-400',
    },
    purple: {
      badge: 'border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-500/10',
      track: 'from-purple-400 to-indigo-400',
    },
    amber: {
      badge: 'border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10',
      track: 'from-amber-400 to-orange-400',
    },
  };
  const c = colorMap[color];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className={cn('text-xs font-semibold', locked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-700 dark:text-slate-200')}>
          {label}
        </span>
        <motion.span
          key={value}
          initial={{ scale: 0.8, opacity: 0.6 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn('text-[10px] font-mono px-2 py-0.5 rounded-lg border font-bold', locked
            ? 'border-slate-200 dark:border-white/5 text-slate-400 dark:text-slate-600 bg-slate-50 dark:bg-white/5'
            : c.badge
          )}
        >
          {format(value)}
        </motion.span>
      </div>

      {/* Gradient track indicator */}
      <div className="relative h-1 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden mb-1">
        <motion.div
          className={cn('absolute left-0 top-0 h-full rounded-full bg-gradient-to-r', c.track)}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      <Slider
        value={[value]}
        onValueChange={([v]) => !locked && onChange(v)}
        min={min} max={max} step={step}
        disabled={locked}
        className={cn('w-full', locked && 'opacity-40 pointer-events-none')}
      />
      <div className="flex justify-between text-[9px] text-slate-400 dark:text-slate-600 font-mono">
        <span>{format(min)}</span>
        <span>{format((min + max) / 2)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
};

/** Waveform bars for active voice indicator */
const MiniWaveform = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[2px] h-3">
    {[0.5, 0.9, 0.6, 1, 0.4, 0.8, 0.5].map((h, i) => (
      <motion.div
        key={i}
        className={cn('w-[2px] rounded-full', active ? 'bg-emerald-400' : 'bg-slate-300 dark:bg-slate-600')}
        animate={active ? { scaleY: [h, 1, h * 0.4, h] } : { scaleY: h * 0.3 }}
        transition={active ? { duration: 0.7 + i * 0.09, repeat: Infinity, ease: 'easeInOut', delay: i * 0.06 } : {}}
        style={{ height: '100%', transformOrigin: 'bottom' }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export const EnhancedVoiceSettings: React.FC<VoiceSettingsProps> = ({
  voices,
  selectedVoice,
  speechRate,
  speechPitch = 1.0,
  speechVolume = 1.0,
  userTier,
  currentPersonalityId,
  onVoiceSelect,
  onSpeechRateChange,
  onSpeechPitchChange,
  onSpeechVolumeChange,
  onTestVoice,
}) => {
  const isPremium = userTier === 'premium';
  const isPro     = userTier === 'pro' || userTier === 'premium';
  const isFree    = userTier === 'free';

  const [genderFilter, setGenderFilter]       = useState<'all' | 'male' | 'female'>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [personalityMatchedVoice, setPersonalityMatchedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [activePresetId, setActivePresetId]   = useState<string | null>(null);
  const [isTesting, setIsTesting]             = useState(false);

  // ── Load personality-matched voice ────────────────────────────────────────
  useEffect(() => {
    if (!currentPersonalityId) { setPersonalityMatchedVoice(null); return; }
    getBestVoiceForPersonality(currentPersonalityId, voices, userTier)
      .then((v) => setPersonalityMatchedVoice(v ?? null));
  }, [currentPersonalityId, voices, userTier]);

  // ── Auto-apply personality voice settings (Pro/Premium) ───────────────────
  const personalityVoiceSettings = React.useMemo(
    () => (currentPersonalityId ? getVoiceSettings(currentPersonalityId) : null),
    [currentPersonalityId]
  );

  useEffect(() => {
    if (personalityVoiceSettings && isPro) {
      onSpeechRateChange(personalityVoiceSettings.rate);
      onSpeechPitchChange?.(personalityVoiceSettings.pitch);
      onSpeechVolumeChange?.(personalityVoiceSettings.volume);
    }
  }, [personalityVoiceSettings, isPro]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply a voice preset ──────────────────────────────────────────────────
  const applyPreset = useCallback((preset: VoicePreset) => {
    setActivePresetId(preset.id);
    onSpeechRateChange(preset.rate);
    onSpeechPitchChange?.(preset.pitch);
    onSpeechVolumeChange?.(preset.volume);
  }, [onSpeechRateChange, onSpeechPitchChange, onSpeechVolumeChange]);

  // ── Apply a personality ───────────────────────────────────────────────────
  const applyPersonality = useCallback(async (personality: VoicePersonality) => {
    onSpeechRateChange(personality.rate);
    onSpeechPitchChange?.(personality.pitch);
    onSpeechVolumeChange?.(personality.volume);
    const matched = await getBestVoiceForPersonality(personality.id, voices, userTier);
    if (matched) onVoiceSelect(matched);
  }, [voices, userTier, onVoiceSelect, onSpeechRateChange, onSpeechPitchChange, onSpeechVolumeChange]);

  // ── Test voice with animation ─────────────────────────────────────────────
  const handleTest = useCallback(() => {
    setIsTesting(true);
    onTestVoice();
    setTimeout(() => setIsTesting(false), 2500);
  }, [onTestVoice]);

  // ── Filtered voice list ───────────────────────────────────────────────────
  const filteredVoices = React.useMemo(() => {
    let list = voices;
    if (genderFilter !== 'all' && isPro) list = getVoicesByGender(list, genderFilter);
    if (showPremiumOnly && isPremium)    list = getPremiumVoices(list);
    return list;
  }, [voices, genderFilter, showPremiumOnly, isPro, isPremium]);

  // ── Group by language ─────────────────────────────────────────────────────
  const voicesByLanguage = React.useMemo(() => {
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};
    filteredVoices.forEach((voice) => {
      const group =
        voice.lang.startsWith('en-US') ? 'English (US)'  :
        voice.lang.startsWith('en-GB') ? 'English (UK)'  :
        voice.lang.startsWith('en-AU') ? 'English (AU)'  :
        voice.lang.startsWith('en-')   ? 'English (Other)' :
        voice.lang.startsWith('hi')    ? 'Hindi'   :
        voice.lang.startsWith('ur')    ? 'Urdu'    :
        voice.lang.startsWith('es')    ? 'Spanish' :
        voice.lang.startsWith('fr')    ? 'French'  :
        voice.lang.startsWith('de')    ? 'German'  :
        voice.lang.startsWith('zh')    ? 'Chinese' :
        voice.lang.startsWith('ja')    ? 'Japanese':
        voice.lang.startsWith('ko')    ? 'Korean'  :
        voice.lang.startsWith('ar')    ? 'Arabic'  :
        voice.lang.startsWith('pt')    ? 'Portuguese':
        voice.lang.startsWith('ru')    ? 'Russian' :
        voice.lang.startsWith('it')    ? 'Italian' :
        voice.lang.startsWith('bn')    ? 'Bengali' :
        'Other';
      (grouped[group] = grouped[group] ?? []).push(voice);
    });
    return grouped;
  }, [filteredVoices]);

  return (
    <div className="w-full min-w-0 space-y-5">

      {/* ── Tier pill ── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-black',
          isPremium ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/15 border-amber-200 dark:border-amber-700/40 text-amber-800 dark:text-amber-300'
          : isPro   ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/15 border-emerald-200 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400',
        )}
      >
        {/* Shimmer */}
        <motion.div
          className="pointer-events-none absolute inset-0 w-[40%] bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: 'easeInOut' }}
        />
        <div className="flex items-center gap-2 relative z-10">
          <Crown className={cn('h-3.5 w-3.5', isPremium ? 'text-amber-500' : isPro ? 'text-emerald-500' : 'text-slate-400')} />
          <span>Voice Plan</span>
        </div>
        <span className="relative z-10 uppercase tracking-widest text-[9px] px-2 py-0.5 rounded-full bg-current/10 border border-current/20">
          {userTier}
        </span>
      </motion.div>

      {/* ── AI Personality Voice Match (Pro/Premium) ── */}
      <AnimatePresence>
        {personalityMatchedVoice && isPro && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-700/40 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-3"
          >
            <motion.div
              className="pointer-events-none absolute -top-3 -right-3 h-12 w-12 rounded-full bg-emerald-300/20 blur-xl"
              animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="relative z-10 flex items-start gap-2.5">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/40 border border-emerald-200 dark:border-emerald-700/50">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-emerald-900 dark:text-emerald-100 mb-0.5">
                  AI Personality Voice Match
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 truncate mb-2">
                  {personalityMatchedVoice.name}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onVoiceSelect(personalityMatchedVoice)}
                  className="h-6 w-full text-[10px] font-black border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                >
                  <Check className="h-3 w-3 mr-1" /> Use This Voice
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Advanced Filters (Pro/Premium) ── */}
      {isPro && (
        <div className="space-y-3 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-slate-50/80 to-white/60 dark:from-white/[0.03] dark:to-white/[0.02]">
          <div className="flex items-center gap-2">
            <Sliders className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
              Advanced Filters
            </span>
            <span className="ml-auto text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
              {isPremium ? 'Premium' : 'Pro'}
            </span>
          </div>

          {/* Gender filter */}
          <div className="w-full min-w-0">
            <Label icon={<Users className="h-3 w-3" />}>Gender Filter</Label>
            <div className="grid grid-cols-3 gap-1">
              {(['all', 'male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={cn(
                    'flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-black border transition-all duration-150',
                    genderFilter === g
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                      : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-600/50',
                  )}
                >
                  {g === 'all' ? <Users className="h-3 w-3" /> : <User className="h-3 w-3" />}
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Premium quality toggle (Premium only) */}
          {isPremium && (
            <div className="w-full min-w-0">
              <Label icon={<Crown className="h-3 w-3" />}>Quality</Label>
              <button
                onClick={() => setShowPremiumOnly((p) => !p)}
                className={cn(
                  'w-full flex items-center justify-center gap-2 h-8 rounded-lg text-xs font-black border transition-all duration-200',
                  showPremiumOnly
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 border-amber-400 text-white shadow-[0_2px_8px_rgba(245,158,11,0.4)]'
                    : 'border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20',
                )}
              >
                <Crown className="h-3 w-3" />
                {showPremiumOnly ? '✓ Premium Only' : 'Show Premium Only'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Voice Selection ── */}
      <div className="w-full min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <Label icon={<Mic className="h-3 w-3" />}>Voice Selection</Label>
          <span className="text-[9px] text-slate-400 dark:text-slate-600 mb-2.5">
            {filteredVoices.length} · {Object.keys(voicesByLanguage).length} langs
          </span>
        </div>

        <Select
          value={selectedVoice?.name ?? ''}
          onValueChange={(name) => {
            const voice = voices.find((v) => v.name === name);
            if (voice) onVoiceSelect(voice);
          }}
        >
          <SelectTrigger className="w-full h-9 text-xs bg-white/60 dark:bg-white/[0.04] border-slate-200 dark:border-white/15">
            <SelectValue placeholder="Select a voice…" />
          </SelectTrigger>
          <SelectContent
            className="max-h-[260px] w-full overflow-y-auto"
            style={noScrollbar}
          >
            {Object.entries(voicesByLanguage).map(([lang, langVoices]) => (
              <React.Fragment key={lang}>
                <div className="px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-[#050C14] sticky top-0 z-10 flex items-center justify-between">
                  <span>{lang}</span>
                  <span className="font-mono text-slate-400">({langVoices.length})</span>
                </div>
                {langVoices.map((voice) => {
                  const premium = isPremiumVoice(voice);
                  const locked  = premium && !isPremium;
                  const glyph   = voice.name.toLowerCase().includes('female') ? '♀'
                                : voice.name.toLowerCase().includes('male')   ? '♂' : null;
                  return (
                    <SelectItem
                      key={voice.name}
                      value={voice.name}
                      disabled={locked}
                      className="text-xs py-1.5"
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {glyph && <span className="text-[10px] shrink-0 text-slate-400">{glyph}</span>}
                          <span className="truncate">{voice.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          {premium && <Crown className="h-3 w-3 text-amber-500" />}
                          {locked  && <Lock  className="h-3 w-3 text-slate-400" />}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>

        {/* Selected voice card + test button */}
        <AnimatePresence>
          {selectedVoice && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border border-emerald-200/60 dark:border-emerald-700/30 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/20 dark:to-teal-950/15"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MiniWaveform active={isTesting} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{selectedVoice.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 truncate">
                    {selectedVoice.lang} · {selectedVoice.localService ? '📶 Local' : '☁️ Online'}
                    {isPremiumVoice(selectedVoice) && ' · ⭐'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTest}
                disabled={isTesting}
                className={cn(
                  'flex items-center gap-1 h-7 px-3 rounded-lg text-[10px] font-black border transition-all duration-200 shrink-0',
                  isTesting
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-emerald-300 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30',
                )}
              >
                <Play className="h-3 w-3" />
                {isTesting ? 'Playing…' : 'Test'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-slate-200 dark:border-white/8" />

      {/* ── Speech Rate (all tiers) ── */}
      <div className="w-full min-w-0 space-y-1">
        <Label icon={<Volume2 className="h-3 w-3" />}>Speech Rate</Label>
        <SliderRow
          label="Rate"
          value={speechRate}
          min={0.5} max={2.0} step={0.05}
          format={(v) => `${v.toFixed(2)}×`}
          onChange={onSpeechRateChange}
          color="emerald"
        />
      </div>

      {/* ── Quick Presets ── */}
      <div className="w-full min-w-0 space-y-2">
        <Label icon={<Wand2 className="h-3 w-3" />}>Quick Presets</Label>
        <div className="grid grid-cols-1 gap-1.5">
          {VOICE_PRESETS.map((preset, idx) => {
            const isActive = activePresetId === preset.id;
            return (
              <motion.button
                key={preset.id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ x: 2 }}
                onClick={() => applyPreset(preset)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all duration-200',
                  isActive
                    ? 'border-emerald-400 dark:border-emerald-500/60 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 shadow-sm'
                    : 'border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] hover:border-emerald-200 dark:hover:border-emerald-700/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-900/15',
                )}
              >
                <span className="text-base shrink-0">{preset.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-none">{preset.displayName}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-0.5">{preset.description}</p>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-0.5">
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-600">{preset.rate}×</span>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="h-3 w-3 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Advanced Controls: Pitch + Volume (Pro/Premium) ── */}
      {isPro && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full min-w-0 space-y-4"
        >
          <div className="border-t border-slate-200 dark:border-white/8" />
          <div className="relative overflow-hidden w-full min-w-0 space-y-4 p-4 rounded-xl border border-emerald-200 dark:border-emerald-700/40 bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20">
            {/* Orb */}
            <motion.div
              className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-300/20 dark:bg-emerald-600/10 blur-xl"
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity }}
            />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-800 dark:text-emerald-200">
                  Advanced Controls
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
                {isPremium ? 'Premium' : 'Pro'}
              </span>
            </div>

            {/* Pitch */}
            {onSpeechPitchChange && (
              <div className="relative z-10">
                <SliderRow
                  label="Pitch"
                  value={speechPitch}
                  min={0.5} max={1.5} step={0.05}
                  format={(v) => v.toFixed(2)}
                  onChange={onSpeechPitchChange}
                  color="purple"
                />
              </div>
            )}

            {/* Volume */}
            {onSpeechVolumeChange && (
              <div className="relative z-10">
                <SliderRow
                  label="Volume"
                  value={speechVolume}
                  min={0.1} max={1.0} step={0.05}
                  format={(v) => `${Math.round(v * 100)}%`}
                  onChange={onSpeechVolumeChange}
                  color="amber"
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Voice Personalities Explorer (Pro/Premium) ── */}
      {isPro && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full min-w-0 space-y-3"
        >
          <div className="border-t border-slate-200 dark:border-white/8" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <Label>Voice Personalities</Label>
            </div>
            <span className="text-[9px] text-slate-400 dark:text-slate-600 mb-2.5">
              {Object.keys(VOICE_PERSONALITIES).length} AI voices
            </span>
          </div>

          <div className="grid gap-2">
            {Object.values(VOICE_PERSONALITIES).map((personality, idx) => {
              const hasAccess = tierOrder[userTier] >= tierOrder[personality.tier];
              const isActive  = currentPersonalityId === personality.id;
              const tierLabel = personality.tier.charAt(0).toUpperCase() + personality.tier.slice(1);

              return (
                <motion.div
                  key={personality.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={hasAccess ? { x: 2 } : {}}
                  className={cn(
                    'relative overflow-hidden rounded-xl border p-3 transition-all duration-200',
                    isActive
                      ? 'border-emerald-400 dark:border-emerald-500/60 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/20 shadow-sm'
                      : hasAccess
                        ? 'border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.03] hover:border-purple-300 dark:hover:border-purple-700/50 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 cursor-pointer'
                        : 'border-slate-100 dark:border-white/5 bg-slate-50/40 dark:bg-white/[0.01] opacity-60',
                  )}
                  onClick={() => hasAccess && applyPersonality(personality)}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="text-xl shrink-0 mt-0.5">{personality.displayName.split(' ')[0]}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-xs font-black text-slate-900 dark:text-slate-100 leading-none truncate">
                          {personality.displayName.split(' ').slice(1).join(' ')}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                            <Check className="h-2.5 w-2.5" /> Active
                          </span>
                        )}
                        {!hasAccess && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-600/40 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400">
                            <Crown className="h-2.5 w-2.5" /> {tierLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mb-1.5 truncate">
                        {personality.description}
                      </p>
                      {hasAccess && (
                        <div className="flex flex-wrap gap-1">
                          {[
                            `${personality.rate}×`,
                            `Pitch ${personality.pitch.toFixed(1)}`,
                            personality.lang.toUpperCase().split('-')[0],
                            personality.fallbackCriteria.gender ?? null,
                          ].filter(Boolean).map((tag) => (
                            <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {hasAccess && !isActive && (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600 shrink-0 mt-1" />
                    )}
                  </div>
                  {/* Locked overlay */}
                  {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-300 dark:text-slate-700" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Upgrade prompt (free users) ── */}
      {isFree && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-700/40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 p-4"
        >
          <motion.div
            className="pointer-events-none absolute -top-3 -left-3 h-14 w-14 rounded-full bg-emerald-300/20 blur-xl"
            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }}
          />
          <div className="relative z-10 flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.4)]">
              <Crown className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-black text-emerald-900 dark:text-emerald-100 mb-1">
                Unlock Advanced Voice Controls
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-snug mb-2.5">
                Get pitch & volume control, gender filters, premium voices, and AI personality voice matching.
              </p>
              <div className="flex flex-wrap gap-1 mb-2.5">
                {['Pitch Control', 'Volume Control', 'Voice Personalities', 'Premium Voices'].map((f) => (
                  <span key={f} className="text-[9px] font-black px-1.5 py-0.5 rounded-full border border-emerald-300/60 dark:border-emerald-700/40 bg-white/60 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                    ✓ {f}
                  </span>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition-shadow"
              >
                <Crown className="h-3.5 w-3.5" /> Upgrade to Pro
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedVoiceSettings;
