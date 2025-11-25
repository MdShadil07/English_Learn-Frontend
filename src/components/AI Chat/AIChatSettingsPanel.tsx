import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

import { LANGUAGES } from './constants';
import { SetSettings, UserSettings } from './types';
import { VOICE_PRESETS } from '@/utils/AI Chat/voicePersonalities';

interface AIChatSettingsPanelProps {
  showSettings: boolean;
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
}

const AIChatSettingsPanel: React.FC<AIChatSettingsPanelProps> = ({
  showSettings,
  settings,
  setSettings,
  isRecording,
  onToggleRecording,
  voices = [],
  selectedVoice,
  onVoiceSelect,
  onTestVoice,
  speechRate = 1,
  onSpeechRateChange
}) => {
  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
            <CardContent className="p-3 sm:p-4">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 gap-1 sm:gap-2 mb-4 h-auto p-1">
                  <TabsTrigger value="general" className="text-xs sm:text-sm py-2">General</TabsTrigger>
                  <TabsTrigger value="voice" className="text-xs sm:text-sm py-2">Voice</TabsTrigger>
                  <TabsTrigger value="language" className="text-xs sm:text-sm py-2">Language</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-3">
                      <label className="text-sm font-medium">Show Accuracy</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Display real-time accuracy feedback</p>
                    </div>
                    <Switch
                      checked={settings.showAccuracy}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, showAccuracy: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex-1 pr-3">
                      <label className="text-sm font-medium">Auto Translate</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Translate responses automatically</p>
                    </div>
                    <Switch
                      checked={settings.autoTranslate}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, autoTranslate: checked }))
                      }
                    />
                  </div>
                </TabsContent>

                <TabsContent value="voice" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Voice Responses</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">AI speaks responses aloud</p>
                    </div>
                    <Switch
                      checked={settings.voiceEnabled}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({ ...prev, voiceEnabled: checked }))
                      }
                    />
                  </div>

                  {settings.voiceEnabled && (
                    <>
                      {/* Voice Selection */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Voice</label>
                        <Select
                          value={selectedVoice?.name}
                          onValueChange={(value) => {
                            const voice = voices.find(v => v.name === value);
                            if (voice && onVoiceSelect) onVoiceSelect(voice);
                          }}
                        >
                          <SelectTrigger className="bg-white/70 dark:bg-slate-900/70">
                            <SelectValue placeholder="Choose a voice..." />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {voices.length === 0 ? (
                              <SelectItem value="no-voices" disabled>
                                No voices available
                              </SelectItem>
                            ) : (
                              voices.map((voice) => (
                                <SelectItem key={voice.name} value={voice.name}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs">
                                      {voice.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({voice.lang})
                                    </span>
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Speech Rate */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium">Speech Speed</label>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {speechRate.toFixed(1)}x
                          </span>
                        </div>
                        <Slider
                          value={[speechRate]}
                          onValueChange={([value]) => onSpeechRateChange?.(value)}
                          min={0.5}
                          max={2}
                          step={0.1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Slower</span>
                          <span>Normal</span>
                          <span>Faster</span>
                        </div>
                      </div>

                      {/* Voice Presets */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Quick Presets</label>
                        <div className="grid grid-cols-2 gap-2">
                          {VOICE_PRESETS.slice(0, 4).map((preset) => (
                            <Button
                              key={preset.id}
                              variant="outline"
                              size="sm"
                              onClick={() => onSpeechRateChange?.(preset.rate)}
                              className="justify-start text-xs"
                            >
                              <span className="mr-2">{preset.icon}</span>
                              {preset.displayName}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Test Voice Button */}
                      <Button
                        onClick={onTestVoice}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                      >
                        <Volume2 className="mr-2 h-4 w-4" />
                        Test Voice
                      </Button>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Voice Input</label>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Use voice to send messages</p>
                    </div>
                    <Switch
                      checked={isRecording}
                      onCheckedChange={onToggleRecording}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="language" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Response Language</label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
                    >
                      <SelectTrigger className="bg-white/70 dark:bg-slate-900/70">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <div className="flex items-center gap-2">
                              <span aria-hidden="true">{lang.flag}</span>
                              <span>{lang.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatSettingsPanel;
