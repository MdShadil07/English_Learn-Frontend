// AIChatSettingsSidebar — FULLY OPTIMIZED VERSION (Hybrid Mode C)

import React, {
  useEffect,
  useState,
  useCallback,
  Suspense,
  lazy,
  useMemo
} from "react";

import {
  X,
  Volume2,
  Crown,
  Zap,
  Settings as SettingsIcon,
  Mic,
  Save,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

import { LANGUAGES } from "./constants";
import { SetSettings, UserSettings } from "./types";

import { VOICE_PRESETS } from "@/utils/AI Chat/voicePersonalities";
import aiChatSettingsService from "@/services/AI Chat/aiChatSettingsService";

import LiteSelect from "./LiteSelect.tsx"; // NEW ultra-fast custom Select
import LiteRange from "./LiteRange.tsx";   // NEW ultra-fast native range slider
import * as MemoSettingItemModule from "./MemoSettingItem.tsx";
// runtime-safe resolution: ESM dev servers sometimes expose the component as a default
// or as a named export. Prefer `.default`, fall back to the module object.
// runtime-safe resolution: prefer `.default`, fall back to named exports or the module object.
interface MemoSettingItemProps {
  title: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  icon?: React.ReactNode;
  locked?: boolean;
  isPremiumFeature?: boolean;
}

const MemoSettingItem = (() => {
  const m = MemoSettingItemModule as unknown as Record<string, unknown>;
  // Common shapes we may encounter in dev/hmr environments
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const candidateAny = ((m as any).default ?? (m as any).MemoSettingItem ?? m) as any;
  return candidateAny as React.ComponentType<MemoSettingItemProps>;
})();

const EnhancedVoiceSettings = lazy(() => import("./EnhancedVoiceSettings"));



interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  setSettings: SetSettings;

  isRecording: boolean;
  onToggleRecording: (c: boolean) => void;

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

  userTier?: "free" | "pro" | "premium";
  currentPersonalityId?: string;

  inline?: boolean;
}

export default function AIChatSettingsSidebar({
  isOpen,
  onClose,
  settings,
  setSettings,
  isRecording,
  onToggleRecording,
  voices = [],
  selectedVoice,
  onVoiceSelect,
  onTestVoice,
  speechRate = 1,
  onSpeechRateChange,
  speechPitch = 1,
  onSpeechPitchChange,
  speechVolume = 1,
  onSpeechVolumeChange,
  userTier = "free",
  currentPersonalityId,
  inline = false
}: Props) {
  const { toast } = useToast();

  const isPremium = userTier === "premium";
  const isPro = userTier === "premium" || userTier === "pro";

  // ⚡ Local mirror to avoid expensive parent re-renders
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const [mountVoice, setMountVoice] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);

  // ⚡ Load language settings only when idle
  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const load = async () => {
      setIsLoadingSettings(true);
      try {
        const data = await aiChatSettingsService.getSettings();
        if (!cancelled) {
          setLocalSettings((prev) => ({
            ...prev,
            language: data.responseLanguage || "english"
          }));
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.debug('aiChatSettings load failed', error);
      }
      finally {
        if (!cancelled) setIsLoadingSettings(false);
      }
    };

    const id = "requestIdleCallback" in window
      ? window.requestIdleCallback(load, { timeout: 400 })
      : setTimeout(load, 150);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [isOpen]);

  // Save language → backend
  const saveLanguage = useCallback(async () => {
    // mark saving state immediately so UI shows feedback fast
    setIsSavingLanguage(true);

    const deferWork = (fn: () => void) => {
      if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
          // `requestIdleCallback` typing isn't present in some lib targets — use a safe cast
          (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number })
            .requestIdleCallback?.(fn, { timeout: 500 });
        } else if ('requestAnimationFrame' in window) {
          requestAnimationFrame(fn);
        } else {
          setTimeout(fn, 0);
        }
      } else {
        // server-side fallback
        setTimeout(fn, 0);
      }
    };

    // Defer the heavy network call so the pointerdown event finishes quickly
    deferWork(async () => {
      try {
        const backendCode = aiChatSettingsService.mapToBackendCode(localSettings.language);
        await aiChatSettingsService.updateLanguage(backendCode);
        toast({ title: 'Saved', description: 'Language saved successfully.' });
      } catch (e) {
        toast({ title: 'Error', description: 'Failed to save language.', variant: 'destructive' });
      } finally {
        // update UI on next frame to avoid layout jank
        requestAnimationFrame(() => setIsSavingLanguage(false));
      }
    });
  }, [localSettings.language, toast]);

  // Apply local → global when closing
  const handleClose = useCallback(() => {
    // Defer applying local settings to parent to avoid blocking pointer handlers
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      requestAnimationFrame(() => {
        setSettings(localSettings);
        onClose();
      });
    } else {
      setTimeout(() => {
        setSettings(localSettings);
        onClose();
      }, 0);
    }
  }, [localSettings, setSettings, onClose]);

  // Settings handlers (local only)
  const toggle = useCallback((key: keyof UserSettings, value: boolean) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const changeLanguage = useCallback((v: string) => {
    setLocalSettings((prev) => ({ ...prev, language: v }));
  }, []);

  // Lazy-load voice settings minimal impact
  useEffect(() => {
    if (!isOpen || !localSettings.voiceEnabled) return;
    const id = "requestIdleCallback" in window
      ? window.requestIdleCallback(() => setMountVoice(true), { timeout: 800 })
      : setTimeout(() => setMountVoice(true), 300);

    return () => {
      if ("cancelIdleCallback" in window) window.cancelIdleCallback(id as number);
      else clearTimeout(id as number);
    };
  }, [localSettings.voiceEnabled, isOpen]);

  return (
    <>
      {isOpen && (
        <>
          {!inline && (
            <div className="fixed inset-0 bg-black/30 z-40" onClick={handleClose} />
          )}

          <aside
            className={cn(
              inline
                ? "relative w-full"
                : "fixed left-0 top-0 bottom-0 w-full sm:w-80 lg:w-96 bg-white dark:bg-slate-950 border-r z-50 shadow-lg",
              "flex flex-col"
            )}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-emerald-500" />
                <span className="text-lg font-semibold">Settings</span>
              </div>

              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* PRO/PREMIUM BADGE */}
            {(isPro || isPremium) && (
              <div className="p-3 border-b bg-gradient-to-r from-emerald-50 to-amber-50">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <Crown className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Zap className="w-4 h-4 text-emerald-600" />
                  )}
                  <span className="font-medium text-sm">
                    {isPremium ? "Premium" : "Pro"} Member
                  </span>
                  <Badge className="ml-auto" variant="secondary">Active</Badge>
                </div>
              </div>
            )}

            {/* MAIN CONTENT */}
            <ScrollArea className="flex-1">
              <div className="p-4">
                <Tabs defaultValue="general">
                  <TabsList className="grid grid-cols-3 w-full mb-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="voice">Voice</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  {/* ----------------- GENERAL ---------------- */}
                  <TabsContent value="general" className="space-y-6">
                    <SectionTitle>Display Settings</SectionTitle>

                    <MemoSettingItem
                      title="Show Accuracy"
                      description="Real-time accuracy scores"
                      checked={localSettings.showAccuracy}
                      onCheckedChange={(c) => toggle("showAccuracy", c)}
                    />

                    <MemoSettingItem
                      title="Auto Translate"
                      description="Translate AI responses automatically"
                      checked={localSettings.autoTranslate}
                      onCheckedChange={(c) => toggle("autoTranslate", c)}
                      locked={!isPro}
                      isPremiumFeature={!isPro}
                    />

                    <Separator />

                    <SectionTitle>Language</SectionTitle>

                    {isLoadingSettings ? (
                      <LoadingRow />
                    ) : (
                      <>
                        <LiteSelect
                          value={localSettings.language}
                          onChange={changeLanguage}
                          options={LANGUAGES}
                        />

                        <Button
                          onClick={saveLanguage}
                          className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600"
                          disabled={isSavingLanguage}
                        >
                          {isSavingLanguage && (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          )}
                          Save Language
                        </Button>
                      </>
                    )}
                  </TabsContent>

                  {/* ----------------- VOICE ---------------- */}
                  <TabsContent value="voice" className="space-y-6">
                    <SectionTitle>Voice Output</SectionTitle>

                    <MemoSettingItem
                      title="Enable Voice Output"
                      description="AI will speak responses"
                      checked={localSettings.voiceEnabled}
                      onCheckedChange={(c) => toggle("voiceEnabled", c)}
                    />

                    {localSettings.voiceEnabled && (
                      <>
                        <Separator />

                        {mountVoice ? (
                          <Suspense fallback={<LoadingRow label="Loading voice settings..." />}>
                            <EnhancedVoiceSettings
                              voices={voices}
                              selectedVoice={selectedVoice}
                              onVoiceSelect={onVoiceSelect}
                              speechRate={speechRate}
                              speechPitch={speechPitch}
                              speechVolume={speechVolume}
                              onSpeechRateChange={onSpeechRateChange}
                              onSpeechPitchChange={onSpeechPitchChange}
                              onSpeechVolumeChange={onSpeechVolumeChange}
                              onTestVoice={onTestVoice}
                              userTier={userTier}
                            />
                          </Suspense>
                        ) : (
                          <LoadingRow label="Preparing voice options..." />
                        )}

                        <Separator />

                        <SectionTitle>Voice Input</SectionTitle>

                        <MemoSettingItem
                          title="Enable Microphone"
                          description="Use voice as input"
                          checked={isRecording}
                          onCheckedChange={onToggleRecording}
                          icon={<Mic className="w-4 h-4" />}
                        />
                      </>
                    )}
                  </TabsContent>

                  {/* ----------------- ADVANCED ---------------- */}
                  <TabsContent value="advanced" className="space-y-6">
                    <SectionTitle>Advanced Features</SectionTitle>

                    <LockedSetting title="Advanced Grammar Analysis" locked={!isPremium} />
                    <LockedSetting title="Pronunciation Coach" locked={!isPro} />
                    <LockedSetting title="Context-Aware Suggestions" locked={!isPro} />
                    <LockedSetting title="Offline Mode" locked={!isPremium} />

                    {userTier === "free" && (
                      <UpgradeCard />
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </aside>
        </>
      )}
    </>
  );
}

/* ----------------- SMALL OPTIMIZED SUBCOMPONENTS ---------------- */

const SectionTitle = React.memo(({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
    {children}
  </h3>
));

const LoadingRow = ({ label = "Loading..." }) => (
  <div className="flex items-center p-4 text-sm text-slate-500">
    <Loader2 className="w-4 h-4 animate-spin mr-2" />
    {label}
  </div>
);

const LockedSetting = ({ title, locked }: { title: string; locked: boolean }) => (
  <MemoSettingItem
    title={title}
    description=""
    checked={false}
    onCheckedChange={() => {}}
    locked={locked}
    isPremiumFeature={locked}
  />
);



const UpgradeCard = () => (
  <div className="p-4 rounded-lg border border-slate-100 bg-white dark:bg-slate-900 text-sm">
    <div className="flex items-start gap-3">
      <div className="flex-1">
        <div className="font-semibold">Upgrade to Pro</div>
        <div className="text-xs text-slate-500 mt-1">Unlock advanced features like pronunciation coach and offline mode.</div>
      </div>
      <div>
        <Button size="sm" className="bg-emerald-600 text-white">Upgrade</Button>
      </div>
    </div>
  </div>
);
