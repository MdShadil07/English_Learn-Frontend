import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Crown, Zap, Settings as SettingsIcon, Mic, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { LANGUAGES } from './constants';
import { SetSettings, UserSettings } from './types';
import { VOICE_PRESETS } from '@/utils/AI Chat/voicePersonalities';
import aiChatSettingsService from '@/services/AI Chat/aiChatSettingsService';
import { EnhancedVoiceSettings } from './EnhancedVoiceSettings';

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
  userTier?: 'free' | 'pro' | 'premium';
  currentPersonalityId?: string;
  inline?: boolean;
}

const AIChatSettingsSidebar: React.FC<AIChatSettingsSidebarProps> = ({
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
  userTier = 'free',
  currentPersonalityId,
  inline = false
}) => {
  // Precise tier checking: Premium users have all Pro features
  const isPremium = userTier === 'premium';
  const isPro = userTier === 'pro' || userTier === 'premium';
  const isFree = userTier === 'free';
  const { toast } = useToast();

  // Debug: Log tier information
  useEffect(() => {
    console.log('🎛️ Settings Sidebar - Tier Info:', {
      userTier,
      isPremium,
      isPro,
      isFree,
      currentPersonalityId
    });
  }, [userTier, isPremium, isPro, isFree, currentPersonalityId]);

  // Loading and saving states
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);

  // Advanced voice controls (premium features)
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);

  // Load settings from backend when component mounts
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoadingSettings(true);
      try {
        const data = await aiChatSettingsService.getSettings();
        // Map backend language format to frontend format
        setSettings(prev => ({
          ...prev,
          language: data.responseLanguage || 'english'
        }));
      } catch (error) {
        console.error('Failed to load AI chat settings:', error);
        // Continue with default settings - no need to show error to user
      } finally {
        setIsLoadingSettings(false);
      }
    };

    if (isOpen) {
      loadSettings();
    }
  }, [isOpen, setSettings]);

  // Save language preference to backend
  const handleSaveLanguage = async () => {
    setIsSavingLanguage(true);
    try {
      // Map frontend code to backend code before updating
      const backendLanguage = aiChatSettingsService.mapToBackendCode(settings.language);
      await aiChatSettingsService.updateLanguage(backendLanguage);
      toast({
        title: "Success",
        description: "Language preference saved successfully!",
      });
    } catch (error) {
      console.error('Failed to save language:', error);
      toast({
        title: "Error",
        description: "Failed to save language preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingLanguage(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={inline ? 'hidden' : 'fixed inset-0 bg-black/30 backdrop-blur-sm z-40'}
            onClick={onClose}
          />

          {/* Settings Sidebar */}
          <motion.aside
            initial={{ x: inline ? 0 : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: inline ? 0 : '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={inline
              ? 'relative w-full h-full max-w-full bg-transparent z-0 flex flex-col overflow-y-auto'
              : 'fixed left-0 top-0 bottom-0 w-full sm:w-80 lg:w-96 max-w-full bg-white/95 dark:bg-slate-950/95 sm:backdrop-blur-xl border-r border-emerald-200/40 dark:border-emerald-900/30 z-50 flex flex-col shadow-2xl overflow-y-auto'
            }
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-emerald-200/40 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Subscription Badge */}
            {(isPro || isPremium) && (
              <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border-b border-amber-200/40 dark:border-amber-900/30">
                <div className="flex items-center gap-2">
                  {isPremium ? (
                    <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {isPremium ? 'Premium' : 'Pro'} Member
                  </span>
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                </div>
              </div>
            )}

            {/* Settings Content */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 sm:px-5 py-4 box-border">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 gap-2 mb-6">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="voice">Voice</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  {/* General Settings */}
                  <TabsContent value="general" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        Display Settings
                      </h3>

                      <SettingItem
                        title="Show Accuracy"
                        description="Display real-time accuracy feedback"
                        checked={settings.showAccuracy}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, showAccuracy: checked }))
                        }
                      />

                      <SettingItem
                        title="Auto Translate"
                        description="Translate responses automatically"
                        checked={settings.autoTranslate}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, autoTranslate: checked }))
                        }
                        isPremiumFeature={!isPro}
                        locked={!isPro}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        Language
                      </h3>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          AI Response Language
                        </label>
                        {isLoadingSettings ? (
                          <div className="flex items-center justify-center p-4 text-sm text-slate-500">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading settings...
                          </div>
                        ) : (
                          <>
                            <Select
                              value={settings.language}
                              onValueChange={(value) =>
                                setSettings((prev) => ({ ...prev, language: value }))
                              }
                              disabled={isSavingLanguage}
                            >
                              <SelectTrigger className="w-full max-w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LANGUAGES.map((lang) => (
                                  <SelectItem key={lang.code} value={lang.code}>
                                    {lang.flag} {lang.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              onClick={handleSaveLanguage}
                              disabled={isSavingLanguage}
                              className="w-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                            >
                              {isSavingLanguage ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="w-4 h-4 mr-2" />
                                  Save Language Preference
                                </>
                              )}
                            </Button>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                              The AI will respond to you in the selected language. This preference will be saved for future conversations.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  {/* Voice Settings */}
                  <TabsContent value="voice" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        Voice Output
                      </h3>

                      <SettingItem
                        title="Voice Responses"
                        description="AI speaks responses aloud"
                        checked={settings.voiceEnabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({ ...prev, voiceEnabled: checked }))
                        }
                      />
                    </div>

                    {settings.voiceEnabled && (
                      <>
                        <Separator />

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
                          onSpeechPitchChange={setSpeechPitch}
                          onSpeechVolumeChange={setSpeechVolume}
                          onTestVoice={onTestVoice || (() => {})}
                        />
                      </>
                    )}

                    <Separator />

                      <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        Voice Input
                      </h3>

                      <SettingItem
                        title="Voice Input"
                        description="Use microphone for text input"
                        checked={isRecording}
                        onCheckedChange={onToggleRecording}
                        icon={<Mic className="h-4 w-4" />}
                      />
                    </div>
                  </TabsContent>

                  {/* Advanced Settings */}
                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        Advanced Features
                      </h3>

                      <SettingItem
                        title="Advanced Grammar Analysis"
                        description="Detailed grammar breakdown and suggestions"
                        checked={false}
                        onCheckedChange={() => {}}
                        isPremiumFeature={!isPremium}
                        locked={!isPremium}
                      />

                      <SettingItem
                        title="Pronunciation Coach"
                        description="Real-time pronunciation feedback"
                        checked={false}
                        onCheckedChange={() => {}}
                        isPremiumFeature={!isPro}
                        locked={!isPro}
                      />

                      <SettingItem
                        title="Context-Aware Suggestions"
                        description="AI learns from your conversation patterns"
                        checked={false}
                        onCheckedChange={() => {}}
                        isPremiumFeature={!isPro}
                        locked={!isPro}
                      />

                      <SettingItem
                        title="Offline Mode"
                        description="Download conversations for offline access"
                        checked={false}
                        onCheckedChange={() => {}}
                        isPremiumFeature={!isPremium}
                        locked={!isPremium}
                      />
                    </div>

                    {isFree && (
                      <>
                        <Separator />
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/30 dark:to-emerald-950/30 border border-amber-200/40 dark:border-amber-900/30">
                          <div className="flex items-start gap-3">
                            <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                Upgrade to Premium
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                Unlock all advanced features, premium voices, and unlimited conversations.
                              </p>
                              <Button size="sm" className="w-full bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600">
                                <Crown className="h-4 w-4 mr-2" />
                                Upgrade Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </ScrollArea>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

// Setting Item Component
interface SettingItemProps {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  isPremiumFeature?: boolean;
  locked?: boolean;
  icon?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  description,
  checked,
  onCheckedChange,
  isPremiumFeature = false,
  locked = false,
  icon
}) => {
  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-lg border",
      locked ? "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800" : "border-transparent"
    )}>
      <div className="flex items-start gap-3 flex-1">
        {icon && (
          <div className="text-emerald-600 dark:text-emerald-400 mt-0.5">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <label className={cn(
              "text-sm font-medium",
              locked ? "text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"
            )}>
              {title}
            </label>
            {isPremiumFeature && (
              <Badge variant="outline" className="text-xs border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-400">
                <Crown className="h-3 w-3 mr-1" />
                {locked ? 'Premium' : 'Pro'}
              </Badge>
            )}
          </div>
          <p className={cn(
            "text-xs mt-0.5",
            locked ? "text-slate-400 dark:text-slate-500" : "text-slate-500 dark:text-slate-400"
          )}>
            {description}
          </p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={locked}
      />
    </div>
  );
};

export default AIChatSettingsSidebar;
