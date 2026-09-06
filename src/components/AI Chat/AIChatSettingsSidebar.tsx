import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Volume2, Crown, Zap, Settings as SettingsIcon, Mic, Save,
  Loader2, Check, ChevronsUpDown, Globe, Sliders, BrainCircuit, Lock,
  Sparkles, Wand2, BarChart3, BookOpen, Languages, MessageSquare,
  ShieldCheck, Headphones, Star, TrendingUp,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { LANGUAGES } from './constants';
import { SetSettings, UserSettings } from './types';
import aiChatSettingsService from '@/services/AI Chat/aiChatSettingsService';
import { EnhancedVoiceSettings } from './EnhancedVoiceSettings';
import { api } from '@/utils/api';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface AIChatSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  setSettings: SetSettings;
  isRecording: boolean;
  onToggleRecording: (checked: boolean) => void;
  voices?: SpeechSynthesisVoice[];
  selectedVoice?: SpeechSynthesisVoice | null;
  onVoiceSelect?: (voice: SpeechSynthesisVoice) => void;
  onTestVoice?: () => void;
  speechRate?: number;
  onSpeechRateChange?: (rate: number) => void;
  speechPitch?: number;
  onSpeechPitchChange?: (pitch: number) => void;
  speechVolume?: number;
  onSpeechVolumeChange?: (volume: number) => void;
  userTier?: 'free' | 'pro' | 'premium';
  currentPersonalityId?: string;
  inline?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Waveform Animation — live voice indicator bars
// ─────────────────────────────────────────────────────────────────────────────
const VoiceWaveform = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[2px] h-4">
    {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3].map((h, i) => (
      <motion.div
        key={i}
        className={cn('w-[2px] rounded-full', active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}
        animate={active ? { scaleY: [h, 1, h * 0.5, h], opacity: [0.8, 1, 0.6, 0.8] } : { scaleY: h * 0.4 }}
        transition={active ? { duration: 0.8 + i * 0.1, repeat: Infinity, ease: 'easeInOut', delay: i * 0.07 } : {}}
        style={{ height: '100%', transformOrigin: 'bottom' }}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components (defined OUTSIDE main component — prevents remount on render)
// ─────────────────────────────────────────────────────────────────────────────

// Language Combobox
const LanguageCombobox = ({
  value, onChange, disabled, placeholder,
}: { value: string | undefined; onChange: (v: string) => void; disabled: boolean; placeholder: string }) => {
  const [open, setOpen] = useState(false);
  const selectedLang = LANGUAGES.find(
    (l) => 
      l.name.toLowerCase() === value?.toLowerCase().trim() || 
      l.code.toLowerCase() === value?.toLowerCase().trim() ||
      value?.toLowerCase().trim().startsWith(l.name.toLowerCase()) ||
      value?.toLowerCase().trim().startsWith(l.code.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-white/40 dark:bg-[#050C14]/60 border border-white/60 dark:border-emerald-500/20 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-[#050C14]/80 font-normal"
        >
          {selectedLang ? (
            <span className="flex items-center gap-2 truncate">
              {selectedLang.flag} {selectedLang.name}
            </span>
          ) : (
            <span className="text-slate-400 dark:text-slate-500 truncate">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 z-[100]"
        align="start" side="top" sideOffset={8} avoidCollisions
      >
        <Command>
          <CommandInput placeholder="Search language..." className="h-8 text-sm" />
          <CommandList className="max-h-[200px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {LANGUAGES.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={lang.name}
                  onSelect={() => { onChange(lang.code); setOpen(false); }}
                  className="cursor-pointer"
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedLang?.code === lang.code ? 'opacity-100' : 'opacity-0')} />
                  {lang.flag} {lang.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Section Header
const SectionHeader = ({ icon, label, badge }: { icon: React.ReactNode; label: string; badge?: React.ReactNode }) => (
  <div className="flex items-center gap-2.5 mb-4">
    <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-500/15 dark:to-teal-500/10 border border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm">
      {icon}
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400 flex-1">{label}</p>
    {badge}
  </div>
);

// Premium Badge
const PremiumBadge = ({ label = 'Premium', color = 'amber' }: { label?: string; color?: 'amber' | 'emerald' | 'purple' }) => {
  const styles = {
    amber: 'border-amber-300/60 dark:border-amber-600/40 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
    emerald: 'border-emerald-300/60 dark:border-emerald-600/40 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
    purple: 'border-purple-300/60 dark:border-purple-600/40 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
  };
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border', styles[color])}>
      <Crown className="h-2.5 w-2.5" />{label}
    </span>
  );
};

// Setting Item
interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isPremiumFeature?: boolean;
  locked?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title, description, checked, onCheckedChange,
  isPremiumFeature = false, locked = false, icon, badge,
}) => (
  <div className={cn(
    'group/item relative overflow-hidden flex items-center justify-between gap-3 rounded-2xl p-3 border transition-all duration-300',
    locked
      ? 'bg-slate-50/60 dark:bg-[#050C14]/40 border-slate-200/60 dark:border-white/5'
      : 'bg-white/40 dark:bg-[#050C14]/50 border-white/60 dark:border-emerald-500/15 hover:bg-white/70 dark:hover:bg-[#050C14]/70 hover:border-emerald-200/60 dark:hover:border-emerald-500/30 cursor-pointer',
  )}>
    {/* Hover sweep */}
    {!locked && (
      <div className="pointer-events-none absolute inset-0 w-[200%] -translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 dark:via-white/[0.03] to-transparent transition-transform duration-700 group-hover/item:translate-x-[50%]" />
    )}
    <div className="flex items-start gap-2.5 flex-1 relative z-10 min-w-0">
      {icon && (
        <div className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400">{icon}</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn(
            'text-sm font-semibold leading-snug',
            locked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-800 dark:text-slate-100',
          )}>
            {title}
          </span>
          {isPremiumFeature && <PremiumBadge label={locked ? 'Premium' : 'Pro'} color={locked ? 'amber' : 'emerald'} />}
          {badge}
          {locked && <Lock className="h-3 w-3 text-slate-400 dark:text-slate-600 shrink-0" />}
        </div>
        <p className={cn(
          'text-[11px] mt-0.5 leading-snug',
          locked ? 'text-slate-400 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400',
        )}>
          {description}
        </p>
      </div>
    </div>
    <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={locked} className="relative z-10 shrink-0" />
  </div>
);

// Tab Button
const TabBtn = ({
  active, onClick, icon, label,
}: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex-1 flex flex-col items-center gap-1 py-2 rounded-[14px] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200',
      active
        ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
        : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10',
    )}
  >
    {icon}
    {label}
  </button>
);

// Save Button
const SaveBtn = ({
  onClick, loading, disabled, label,
}: { onClick: () => void; loading: boolean; disabled: boolean; label: string }) => (
  <motion.button
    whileHover={!loading && !disabled ? { scale: 1.02 } : {}}
    whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
    onClick={onClick}
    disabled={loading || disabled}
    className={cn(
      'w-full flex items-center justify-center gap-2 py-2.5 rounded-[14px] text-sm font-black tracking-wide transition-all duration-200',
      loading || disabled
        ? 'bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed'
        : 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)]',
    )}
  >
    {loading
      ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
      : <><Save className="h-4 w-4" /> {label}</>}
  </motion.button>
);

// Glass Card
const GlassCard = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    'relative w-full min-w-0 max-w-full box-border overflow-hidden rounded-[20px] border border-white/60 dark:border-emerald-500/15 bg-white/40 dark:bg-[#050C14]/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(16,185,129,0.04)] backdrop-blur-xl p-4',
    className,
  )}>
    <div className="pointer-events-none absolute -top-4 -right-4 h-16 w-16 rounded-full bg-emerald-300/15 dark:bg-emerald-600/10 blur-2xl" />
    <div className="relative z-10 w-full min-w-0">
      {children}
    </div>
  </div>
);

// Premium Feature Card (locked feature teaser)
const FeatureCard = ({
  icon, title, description, tier, locked,
}: { icon: React.ReactNode; title: string; description: string; tier: string; locked: boolean }) => (
  <div className={cn(
    'relative group overflow-hidden flex items-start gap-3 p-3 rounded-2xl border transition-all duration-300',
    locked
      ? 'border-slate-200/60 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] opacity-80'
      : 'border-emerald-200/60 dark:border-emerald-500/20 bg-gradient-to-br from-emerald-50/60 to-teal-50/40 dark:from-emerald-950/30 dark:to-teal-950/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 cursor-default',
  )}>
    <div className={cn(
      'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs',
      locked
        ? 'border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600'
        : 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    )}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className={cn('text-xs font-bold', locked ? 'text-slate-500 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100')}>
          {title}
        </span>
        <PremiumBadge label={tier} color={tier === 'Premium' ? 'amber' : 'purple'} />
      </div>
      <p className="text-[10px] text-slate-500 dark:text-slate-500 leading-snug">{description}</p>
    </div>
    {locked && (
      <Lock className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 shrink-0 mt-0.5" />
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
const AIChatSettingsSidebar: React.FC<AIChatSettingsSidebarProps> = ({
  isOpen, onClose, settings, setSettings, isRecording, onToggleRecording,
  voices = [], selectedVoice, onVoiceSelect, onTestVoice,
  speechRate = 1, onSpeechRateChange,
  speechPitch = 1.0, onSpeechPitchChange,
  speechVolume = 1.0, onSpeechVolumeChange,
  userTier = 'free', currentPersonalityId, inline = false,
}) => {
  const isPremium = userTier === 'premium';
  const isPro     = userTier === 'pro' || userTier === 'premium';
  const isFree    = userTier === 'free';
  const { toast } = useToast();

  const [activeTab, setActiveTab]                       = useState<'general' | 'voice' | 'advanced'>('general');
  const [isLoadingSettings, setIsLoadingSettings]       = useState(false);
  const [isSavingLanguage, setIsSavingLanguage]         = useState(false);
  const [isSavingNativeLanguage, setIsSavingNativeLanguage] = useState(false);
  const [nativeLanguage, setNativeLanguage]             = useState('');

  // ── Backend: load settings on open ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    const loadSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const data = await aiChatSettingsService.getSettings();
        setSettings((prev) => ({ ...prev, language: data.responseLanguage || 'english' }));
      } catch {
        /* silent — continue with defaults */
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();

    // Load native language from localStorage
    try {
      const ud = JSON.parse(localStorage.getItem('userData') || '{}');
      if (ud.nativeLanguage) setNativeLanguage(ud.nativeLanguage);
    } catch { /* silent */ }
  }, [isOpen, setSettings]);

  // ── Backend: save AI response language ────────────────────────────────────
  const handleSaveLanguage = async () => {
    setIsSavingLanguage(true);
    try {
      const backendLanguage = aiChatSettingsService.mapToBackendCode(settings.language);
      await aiChatSettingsService.updateLanguage(backendLanguage);
      toast({ title: '✓ Saved', description: 'AI response language updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save language preference.', variant: 'destructive' });
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // ── Backend: save native language ─────────────────────────────────────────
  const handleSaveNativeLanguage = async () => {
    setIsSavingNativeLanguage(true);
    try {
      const langName = LANGUAGES.find((l) => l.code === nativeLanguage)?.name || nativeLanguage;
      await api.profile.update({ nativeLanguage: langName });
      // Persist to localStorage
      try {
        const ud = JSON.parse(localStorage.getItem('userData') || '{}');
        ud.nativeLanguage = langName;
        localStorage.setItem('userData', JSON.stringify(ud));
      } catch { /* silent */ }
      toast({ title: '✓ Saved', description: 'Native language updated.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to save native language preference.', variant: 'destructive' });
    } finally {
      setIsSavingNativeLanguage(false);
    }
  };

  // ── Shared sidebar content (JSX variable — NOT a component fn, prevents remount blink) ──
  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header ── */}
      <div className="relative overflow-hidden shrink-0 px-5 py-4 border-b border-white/40 dark:border-emerald-500/10">
        <motion.div
          className="pointer-events-none absolute top-0 left-0 h-24 w-24 rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[40px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute top-2 right-8 h-16 w-16 rounded-full bg-teal-400/15 dark:bg-teal-600/8 blur-[30px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.4)]">
              <SettingsIcon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-400">AI Learning</p>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">Settings</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/60 dark:border-white/10 bg-white/60 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── Tier Banner (Pro / Premium) ── */}
      {(isPro || isPremium) && (
        <div className="shrink-0 mx-4 mt-3">
          <motion.div
            className={cn(
              'relative overflow-hidden flex items-center gap-3 px-4 py-2.5 rounded-[18px] border',
              isPremium
                ? 'bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-emerald-500/15 border-amber-400/30 dark:border-amber-500/30'
                : 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-400/30 dark:border-emerald-600/30',
            )}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer */}
            <motion.div
              className="pointer-events-none absolute inset-0 w-[60%] bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              animate={{ x: ['-100%', '300%'] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 4 }}
            />
            <div className={cn(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl',
              isPremium ? 'bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_2px_10px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_2px_10px_rgba(16,185,129,0.4)]',
            )}>
              {isPremium ? <Crown className="h-3.5 w-3.5 text-white" /> : <Zap className="h-3.5 w-3.5 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 dark:text-white leading-none">
                {isPremium ? '✨ Premium Member' : '⚡ Pro Member'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {isPremium ? 'All features unlocked' : 'Pro features active'}
              </p>
            </div>
            <motion.span
              className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Active
            </motion.span>
          </motion.div>
        </div>
      )}

      {/* ── Tab bar ── */}
      <div className="shrink-0 mx-4 mt-3 flex gap-1.5 p-1.5 rounded-[18px] bg-white/40 dark:bg-[#050C14]/60 border border-white/60 dark:border-emerald-500/15 backdrop-blur-xl">
        <TabBtn active={activeTab === 'general'}  onClick={() => setActiveTab('general')}  icon={<Sliders className="h-3.5 w-3.5" />}     label="General"  />
        <TabBtn active={activeTab === 'voice'}    onClick={() => setActiveTab('voice')}    icon={<Volume2 className="h-3.5 w-3.5" />}      label="Voice"    />
        <TabBtn active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} icon={<BrainCircuit className="h-3.5 w-3.5" />} label="Advanced" />
      </div>

      {/* ── Scrollable content (hidden scrollbar) ── */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' } as React.CSSProperties}
      >
        <div className="px-4 py-4 space-y-4 w-full min-w-0 max-w-full box-border">

          {/* ────────────── GENERAL ────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Display */}
                <GlassCard>
                  <SectionHeader icon={<Sliders className="h-4 w-4" />} label="Display" />
                  <div className="space-y-2">
                    <SettingItem
                      title="Show Accuracy"
                      description="Display real-time accuracy feedback per message"
                      checked={settings.showAccuracy}
                      onCheckedChange={(c) => setSettings((p) => ({ ...p, showAccuracy: c }))}
                      icon={<BarChart3 className="h-4 w-4" />}
                    />
                    <SettingItem
                      title="Per-Message Snapshot"
                      description="Open accuracy overlay after each message"
                      checked={Boolean(settings.showPerMessageSnapshot)}
                      onCheckedChange={(c) => setSettings((p) => ({ ...p, showPerMessageSnapshot: c }))}
                      icon={<MessageSquare className="h-4 w-4" />}
                    />
                    <SettingItem
                      title="Auto Translate"
                      description="Translate AI responses automatically"
                      checked={settings.autoTranslate}
                      onCheckedChange={(c) => setSettings((p) => ({ ...p, autoTranslate: c }))}
                      isPremiumFeature={!isPro}
                      locked={!isPro}
                      icon={<Languages className="h-4 w-4" />}
                    />
                  </div>
                </GlassCard>

                {/* Language */}
                <GlassCard>
                  <SectionHeader icon={<Globe className="h-4 w-4" />} label="Language" />
                  <div className="space-y-5">

                    {/* Native Language */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        Native Language (Translations)
                      </label>
                      <LanguageCombobox
                        value={nativeLanguage}
                        onChange={(val) => {
                          const name = LANGUAGES.find((l) => l.code === val)?.name || val;
                          setNativeLanguage(name);
                        }}
                        disabled={isSavingNativeLanguage}
                        placeholder="Select native language"
                      />
                      <SaveBtn
                        onClick={handleSaveNativeLanguage}
                        loading={isSavingNativeLanguage}
                        disabled={!nativeLanguage}
                        label="Save Native Language"
                      />
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-500 leading-snug">
                        Translations of selected text will use this language.
                      </p>
                    </div>

                    <div className="border-t border-white/40 dark:border-emerald-500/10" />

                    {/* AI Response Language */}
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                        AI Response Language
                      </label>
                      {isLoadingSettings ? (
                        <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
                          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
                        </div>
                      ) : (
                        <>
                          <LanguageCombobox
                            value={settings.language}
                            onChange={(v) => {
                              const backendLang = aiChatSettingsService.mapToBackendCode(v);
                              setSettings((p) => ({ ...p, language: backendLang }));
                            }}
                            disabled={isSavingLanguage}
                            placeholder="Select response language"
                          />
                          <SaveBtn
                            onClick={handleSaveLanguage}
                            loading={isSavingLanguage}
                            disabled={false}
                            label="Save Language"
                          />
                          <p className="text-[11px] text-slate-500 dark:text-slate-500 leading-snug">
                            AI will reply in this language for all future conversations.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>

                {/* Premium stats teaser for free users */}
                {isFree && (
                  <div className="relative overflow-hidden rounded-[18px] p-4 border border-purple-200/40 dark:border-purple-700/20 bg-gradient-to-br from-purple-50/60 to-indigo-50/40 dark:from-purple-950/30 dark:to-indigo-950/20">
                    <motion.div
                      className="pointer-events-none absolute -top-3 -right-3 h-16 w-16 rounded-full bg-purple-300/20 blur-xl"
                      animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }}
                    />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 text-white shadow-[0_4px_10px_rgba(139,92,246,0.4)]">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100 mb-1">Advanced Analytics <span className="text-purple-600 dark:text-purple-400">Pro+</span></p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                          Get detailed learning insights, pronunciation heatmaps, and weekly progress reports.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────────── VOICE ────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Voice Output toggle with live waveform */}
                <GlassCard>
                  <SectionHeader
                    icon={<Volume2 className="h-4 w-4" />}
                    label="Voice Output"
                    badge={<VoiceWaveform active={settings.voiceEnabled} />}
                  />
                  <SettingItem
                    title="AI Voice Responses"
                    description="AI speaks responses aloud with your selected voice"
                    checked={settings.voiceEnabled}
                    onCheckedChange={(c) => setSettings((p) => ({ ...p, voiceEnabled: c }))}
                    icon={<Headphones className="h-4 w-4" />}
                  />

                  {/* Voice quality indicator */}
                  {settings.voiceEnabled && selectedVoice && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/40 dark:border-emerald-700/20"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 truncate">
                        {selectedVoice.name}
                      </span>
                      <span className="text-[9px] text-slate-400 dark:text-slate-600 ml-auto shrink-0">
                        {selectedVoice.localService ? '📶 Local' : '☁️ Online'}
                      </span>
                    </motion.div>
                  )}
                </GlassCard>

                {/* EnhancedVoiceSettings — fully constrained */}
                {settings.voiceEnabled && (
                  <GlassCard className="w-full min-w-0 max-w-full overflow-x-hidden box-border">
                    <SectionHeader icon={<Sliders className="h-4 w-4" />} label="Voice Settings" />
                    <div className="w-full min-w-0 max-w-full overflow-x-hidden box-border">
                      <EnhancedVoiceSettings
                        voices={voices}
                        selectedVoice={selectedVoice || null}
                        speechRate={speechRate}
                        speechPitch={speechPitch}
                        speechVolume={speechVolume}
                        userTier={userTier}
                        currentPersonalityId={currentPersonalityId}
                        onVoiceSelect={onVoiceSelect || (() => {})}
                        onSpeechRateChange={onSpeechRateChange || (() => {})}
                        onSpeechPitchChange={onSpeechPitchChange ?? (() => {})}
                        onSpeechVolumeChange={onSpeechVolumeChange ?? (() => {})}
                        onTestVoice={onTestVoice || (() => {})}
                      />
                    </div>
                  </GlassCard>
                )}

                {/* Voice Input */}
                <GlassCard>
                  <SectionHeader icon={<Mic className="h-4 w-4" />} label="Voice Input" />
                  <SettingItem
                    title="Microphone Input"
                    description="Use microphone to dictate your messages"
                    checked={isRecording}
                    onCheckedChange={onToggleRecording}
                    icon={<Mic className="h-4 w-4" />}
                    badge={isRecording ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-black bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-700/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                        LIVE
                      </span>
                    ) : undefined}
                  />
                </GlassCard>

                {/* Upgrade prompt for voice features (free users) */}
                {isFree && (
                  <div className="relative overflow-hidden rounded-[20px] p-4 bg-gradient-to-br from-emerald-500/8 via-teal-500/8 to-cyan-500/8 border border-emerald-200/40 dark:border-emerald-700/20">
                    <motion.div
                      className="pointer-events-none absolute -top-4 -left-4 h-20 w-20 rounded-full bg-emerald-300/15 blur-2xl"
                      animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }}
                    />
                    <p className="relative z-10 text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      🎙️ <span className="font-bold">Upgrade to Pro</span> to unlock pitch & volume control, gender voice filters, and AI personality voice matching.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ────────────── ADVANCED ────────────── */}
          <AnimatePresence mode="wait">
            {activeTab === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* AI Learning Features */}
                <GlassCard>
                  <SectionHeader icon={<BrainCircuit className="h-4 w-4" />} label="AI Learning Engine" />
                  <div className="space-y-2">
                    <SettingItem
                      title="Show Accuracy"
                      description="Real-time feedback on grammar & vocabulary"
                      checked={settings.showAccuracy}
                      onCheckedChange={(c) => setSettings((p) => ({ ...p, showAccuracy: c }))}
                      icon={<BarChart3 className="h-4 w-4" />}
                    />
                    <SettingItem
                      title="Pronunciation Coach"
                      description="Real-time pronunciation feedback per word"
                      checked={false}
                      onCheckedChange={() => {}}
                      isPremiumFeature={!isPro}
                      locked={!isPro}
                      icon={<Mic className="h-4 w-4" />}
                    />
                    <SettingItem
                      title="Context-Aware Suggestions"
                      description="AI adapts to your personal learning patterns"
                      checked={false}
                      onCheckedChange={() => {}}
                      isPremiumFeature={!isPro}
                      locked={!isPro}
                      icon={<Sparkles className="h-4 w-4" />}
                    />
                  </div>
                </GlassCard>

                {/* Premium Feature Cards */}
                <GlassCard>
                  <SectionHeader icon={<Crown className="h-4 w-4" />} label="Premium Features" />
                  <div className="space-y-2">
                    <FeatureCard
                      icon={<BookOpen className="h-4 w-4" />}
                      title="Advanced Grammar Analysis"
                      description="Detailed grammar breakdown, clause-level analysis, and personalised corrections"
                      tier="Premium"
                      locked={!isPremium}
                    />
                    <FeatureCard
                      icon={<Wand2 className="h-4 w-4" />}
                      title="Smart Writing Coach"
                      description="AI rewrites your sentences with style improvements and fluency tips"
                      tier="Pro"
                      locked={!isPro}
                    />
                    <FeatureCard
                      icon={<ShieldCheck className="h-4 w-4" />}
                      title="Offline Mode"
                      description="Download conversations and practice even without internet"
                      tier="Premium"
                      locked={!isPremium}
                    />
                    <FeatureCard
                      icon={<Star className="h-4 w-4" />}
                      title="Custom Lesson Plans"
                      description="AI creates a personalised 30-day learning curriculum just for you"
                      tier="Premium"
                      locked={!isPremium}
                    />
                  </div>
                </GlassCard>

                {/* Upgrade CTA — free/pro users */}
                {!isPremium && (
                  <div className="relative overflow-hidden rounded-[20px] p-5 bg-gradient-to-br from-amber-500/10 via-orange-500/8 to-emerald-500/10 border border-amber-300/30 dark:border-amber-600/20 backdrop-blur-xl">
                    <motion.div
                      className="pointer-events-none absolute -top-4 -left-4 h-24 w-24 rounded-full bg-amber-300/20 blur-2xl"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />
                    <motion.div
                      className="pointer-events-none absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-emerald-300/15 blur-2xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                    />
                    <div className="relative z-10 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.5)]">
                        <Crown className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                          {isFree ? 'Upgrade to Premium' : 'Go Premium'}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug mb-3">
                          {isFree
                            ? 'Unlock all advanced features, premium voices, grammar analysis, and unlimited conversations.'
                            : 'Get the full experience: advanced analytics, offline mode, custom lesson plans and more.'}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {['Premium Voices', 'Grammar AI', 'Offline Mode', 'Lesson Plans'].map((f) => (
                            <span key={f} className="text-[9px] font-black px-2 py-0.5 rounded-full border border-amber-300/50 dark:border-amber-600/30 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                              ✓ {f}
                            </span>
                          ))}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[12px] bg-gradient-to-r from-amber-500 to-emerald-500 text-white text-sm font-black shadow-[0_4px_14px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] transition-shadow"
                        >
                          <Crown className="h-4 w-4" /> Upgrade Now — Unlock All
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Premium users: show their perks */}
                {isPremium && (
                  <div className="relative overflow-hidden rounded-[18px] p-4 border border-amber-300/30 dark:border-amber-600/20 bg-gradient-to-br from-amber-50/50 to-emerald-50/30 dark:from-amber-950/20 dark:to-emerald-950/10">
                    <motion.div
                      className="pointer-events-none absolute -top-3 -right-3 h-14 w-14 rounded-full bg-amber-300/20 blur-xl"
                      animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 4, repeat: Infinity }}
                    />
                    <div className="relative z-10">
                      <p className="text-xs font-black text-amber-700 dark:text-amber-300 mb-2 flex items-center gap-1.5">
                        <Crown className="h-3.5 w-3.5" /> Your Premium Perks
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['Unlimited Chats', 'All Voices', 'Grammar AI', 'Analytics', 'Offline Mode', 'Lesson Plans'].map((perk) => (
                          <div key={perk} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                            <Check className="h-3 w-3 text-emerald-500 shrink-0" /> {perk}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — non-inline mode only */}
          {!inline && (
            <motion.div
              key="settings-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={onClose}
            />
          )}

          {inline ? (
            <motion.div
              key="settings-inline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-full h-full flex flex-col overflow-hidden"
            >
              {sidebarContent}
            </motion.div>
          ) : (
            <motion.aside
              key="settings-aside"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-full sm:w-80 lg:w-[340px] max-w-full z-50 flex flex-col overflow-hidden shadow-2xl bg-white/85 dark:bg-[#050C14]/92 backdrop-blur-2xl border-r border-white/60 dark:border-emerald-500/15"
            >
              {/* Background orbs */}
              <motion.div
                className="pointer-events-none absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-emerald-300/15 dark:bg-emerald-600/8 rounded-full blur-[60px]"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="pointer-events-none absolute bottom-[-10%] right-[-10%] w-[50%] h-[40%] bg-teal-300/15 dark:bg-teal-600/8 rounded-full blur-[60px]"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              />
              <div className="relative z-10 flex flex-col h-full">
                {sidebarContent}
              </div>
            </motion.aside>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default AIChatSettingsSidebar;
