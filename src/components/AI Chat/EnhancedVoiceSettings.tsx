/**
 * Enhanced Voice Settings Component
 * Comprehensive voice controls with premium features
 */

import React, { useState, useEffect } from 'react';
import { Volume2, Crown, Sparkles, User, Users } from 'lucide-react';
// Update the import path if the Slider component exists elsewhere, for example:
import { Slider } from '@/components/ui/slider';
// Or, if you don't have a Slider component, you can install one (like @radix-ui/react-slider) and import it:
// import { Slider } from '@radix-ui/react-slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
  VOICE_PRESETS,
  VOICE_PERSONALITIES,
  getBestVoiceForPersonality,
  getVoiceSettings,
  getPremiumVoices,
  getVoicesByGender
} from '@/utils/AI Chat/voicePersonalities';

interface VoiceSettingsProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  speechRate: number;
  speechPitch?: number;
  speechVolume?: number;
  userTier: 'free' | 'pro' | 'premium';
  currentPersonalityId?: string; // AI personality ID for voice matching
  onVoiceSelect: (voice: SpeechSynthesisVoice) => void;
  onSpeechRateChange: (rate: number) => void;
  onSpeechPitchChange?: (pitch: number) => void;
  onSpeechVolumeChange?: (volume: number) => void;
  onTestVoice: () => void;
}

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
  onTestVoice
}) => {
  // Precise tier checking: Premium users have all Pro features too
  const isPremium = userTier === 'premium';
  const isPro = userTier === 'pro' || userTier === 'premium'; // Premium users get Pro features
  const isFree = userTier === 'free';

  // State for advanced filters (Premium/Pro features)
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [personalityMatchedVoice, setPersonalityMatchedVoice] = useState<SpeechSynthesisVoice | null>(null);

  // Get personality-matched voice recommendation
  useEffect(() => {
    const loadPersonalityVoice = async () => {
      if (!currentPersonalityId) {
        setPersonalityMatchedVoice(null);
        return;
      }
      const matchedVoice = await getBestVoiceForPersonality(currentPersonalityId, voices, userTier);
      setPersonalityMatchedVoice(matchedVoice || null);
    };
    loadPersonalityVoice();
  }, [currentPersonalityId, voices, userTier]);

  // Get personality voice settings
  const personalityVoiceSettings = React.useMemo(() => {
    if (!currentPersonalityId) return null;
    return getVoiceSettings(currentPersonalityId);
  }, [currentPersonalityId]);

  // Auto-apply personality settings when personality changes
  useEffect(() => {
    if (personalityVoiceSettings && (isPro || isPremium)) {
      if (onSpeechRateChange) onSpeechRateChange(personalityVoiceSettings.rate);
      if (onSpeechPitchChange) onSpeechPitchChange(personalityVoiceSettings.pitch);
      if (onSpeechVolumeChange) onSpeechVolumeChange(personalityVoiceSettings.volume);
    }
  }, [personalityVoiceSettings, isPro, isPremium, onSpeechRateChange, onSpeechPitchChange, onSpeechVolumeChange]);

  // Filter voices based on user selections
  const filteredVoices = React.useMemo(() => {
    let filtered = voices;

    // Gender filter (Premium/Pro feature)
    if (genderFilter !== 'all' && (isPro || isPremium)) {
      filtered = getVoicesByGender(filtered, genderFilter);
    }

    // Premium quality filter (Premium feature only)
    if (showPremiumOnly && isPremium) {
      filtered = getPremiumVoices(filtered);
    }

    return filtered;
  }, [voices, genderFilter, showPremiumOnly, isPro, isPremium]);

  // Group filtered voices by language
  const voicesByLanguage = React.useMemo(() => {
    const grouped: Record<string, SpeechSynthesisVoice[]> = {};
    
    filteredVoices.forEach(voice => {
      const langCode = voice.lang.split('-')[0];
      const langGroup = voice.lang.startsWith('en-US') ? 'English (US)'
        : voice.lang.startsWith('en-GB') ? 'English (UK)'
        : voice.lang.startsWith('en-') ? 'English (Other)'
        : voice.lang.startsWith('hi') ? 'Hindi'
        : voice.lang.startsWith('ur') ? 'Urdu'
        : voice.lang.startsWith('es') ? 'Spanish'
        : voice.lang.startsWith('fr') ? 'French'
        : voice.lang.startsWith('de') ? 'German'
        : voice.lang.startsWith('zh') ? 'Chinese'
        : voice.lang.startsWith('ja') ? 'Japanese'
        : voice.lang.startsWith('ko') ? 'Korean'
        : voice.lang.startsWith('ar') ? 'Arabic'
        : voice.lang.startsWith('pt') ? 'Portuguese'
        : voice.lang.startsWith('ru') ? 'Russian'
        : voice.lang.startsWith('it') ? 'Italian'
        : voice.lang.startsWith('bn') ? 'Bengali'
        : 'Other Languages';
      
      if (!grouped[langGroup]) {
        grouped[langGroup] = [];
      }
      grouped[langGroup].push(voice);
    });
    
    return grouped;
  }, [filteredVoices]);

  const isPremiumVoice = (voice: SpeechSynthesisVoice) => {
    return voice.name.includes('Premium') || 
           voice.name.includes('Enhanced') || 
           voice.name.includes('Neural') || 
           voice.name.includes('Desktop') ||
           voice.name.includes('Natural');
  };

  // Debug: Log tier on mount and changes
  useEffect(() => {
    console.log('🔐 Voice Settings - User Tier:', userTier, {
      isPremium,
      isPro,
      isFree,
      currentPersonalityId
    });
  }, [userTier, isPremium, isPro, isFree, currentPersonalityId]);

  return (
    <div className="space-y-4">
      {/* Subscription Tier Indicator */}
      <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Crown className={cn(
            "h-4 w-4",
            isPremium ? "text-amber-500" : isPro ? "text-blue-500" : "text-slate-400"
          )} />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Your Plan:
          </span>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs font-semibold",
            isPremium ? "border-amber-400 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30" :
            isPro ? "border-blue-400 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" :
            "border-slate-400 text-slate-700 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30"
          )}
        >
          {userTier.toUpperCase()}
        </Badge>
      </div>

      {/* Personality-Matched Voice Recommendation (Pro/Premium) */}
      {personalityMatchedVoice && (isPro || isPremium) && (
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                  AI Personality Match
                </h4>
                <Badge variant="outline" className="text-[10px] py-0 h-4 border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300">
                  {isPremium ? 'Premium' : 'Pro'}
                </Badge>
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 mb-2">
                Recommended for your current AI personality
              </p>
              <Button
                onClick={() => onVoiceSelect(personalityMatchedVoice)}
                variant="outline"
                size="sm"
                className="h-7 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
              >
                <span className="truncate">{personalityMatchedVoice.name}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters (Premium/Pro) */}
      {(isPro || isPremium) && (
        <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Advanced Filters
            </h4>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Gender Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                Gender
              </label>
              <Select value={genderFilter} onValueChange={(value: 'all' | 'male' | 'female') => setGenderFilter(value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3" />
                      All Voices
                    </div>
                  </SelectItem>
                  <SelectItem value="male" className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Male
                    </div>
                  </SelectItem>
                  <SelectItem value="female" className="text-xs">
                    <div className="flex items-center gap-1.5">
                      <User className="h-3 w-3" />
                      Female
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Premium Quality Filter (Premium only) */}
            {isPremium && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Quality
                </label>
                <Button
                  onClick={() => setShowPremiumOnly(!showPremiumOnly)}
                  variant={showPremiumOnly ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-full h-8 text-xs",
                    showPremiumOnly && "bg-amber-500 hover:bg-amber-600"
                  )}
                >
                  <Crown className="h-3 w-3 mr-1.5" />
                  Premium Only
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voice Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Voice Selection
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {filteredVoices.length} voices • {Object.keys(voicesByLanguage).length} languages
            </p>
          </div>
        </div>

        <Select
          value={selectedVoice?.name || ''}
          onValueChange={(value) => {
            const voice = voices.find((v) => v.name === value);
            if (voice) {
              onVoiceSelect(voice);
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {Object.entries(voicesByLanguage).map(([language, langVoices]) => (
              <React.Fragment key={language}>
                <div className="px-2 py-1 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 sticky top-0">
                  {language} ({langVoices.length})
                </div>
                {langVoices.map((voice) => {
                  const isPremiom = isPremiumVoice(voice);
                  // Precise locking: Premium voices only for Premium tier
                  const isLocked = isPremiom && !isPremium;
                  const isMale = voice.name.toLowerCase().includes('male') && !voice.name.toLowerCase().includes('female');
                  const isFemale = voice.name.toLowerCase().includes('female');

                  return (
                    <SelectItem 
                      key={voice.name} 
                      value={voice.name}
                      disabled={isLocked}
                      className="cursor-pointer py-1.5"
                    >
                      <div className="flex items-center justify-between w-full gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {(isMale || isFemale) && <span className="text-xs">{isMale ? '♂' : '♀'}</span>}
                          <span className="truncate text-xs">{voice.name}</span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {isPremiom && <Crown className="h-3 w-3 text-amber-500" />}
                          {isLocked && <Badge variant="outline" className="text-[10px] py-0 h-4">Locked</Badge>}
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>

        {/* Selected Voice Info - Compact */}
        {selectedVoice && (
          <div className="p-2 rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                  {selectedVoice.name}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {selectedVoice.lang} • {selectedVoice.localService ? 'Local' : 'Online'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onTestVoice}
                className="h-7 px-2 text-xs flex-shrink-0"
              >
                <Volume2 className="h-3 w-3 mr-1" />
                Test
              </Button>
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Speech Rate Control - Compact */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
            Speech Rate
          </label>
          <Badge variant="outline" className="text-[10px] font-mono h-5">
            {speechRate.toFixed(2)}x
          </Badge>
        </div>
        <Slider
          value={[speechRate]}
          onValueChange={([value]) => onSpeechRateChange(value)}
          min={0.5}
          max={2.0}
          step={0.05}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>2.0x</span>
        </div>
      </div>

      {/* Voice Personalities Explorer (Premium/Pro) */}
      {(isPremium || isPro) && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Voice Personalities
              </h4>
              <Badge variant="outline" className="text-[10px] py-0 h-4 ml-auto border-purple-300 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                {Object.keys(VOICE_PERSONALITIES).length} Personalities
              </Badge>
            </div>
            
            <div className="grid gap-2">
              {Object.values(VOICE_PERSONALITIES).map((personality) => {
                const tierOrder = { free: 0, pro: 1, premium: 2 };
                const hasAccess = tierOrder[userTier] >= tierOrder[personality.tier];
                const isCurrentPersonality = currentPersonalityId === personality.id;

                return (
                  <div
                    key={personality.id}
                    className={cn(
                      "p-2.5 rounded-lg border transition-all",
                      hasAccess 
                        ? isCurrentPersonality
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                          : "border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700"
                        : "border-slate-200 dark:border-slate-700 opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="text-lg mt-0.5">{personality.displayName.split(' ')[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <h5 className="text-xs font-medium text-slate-900 dark:text-slate-100">
                            {personality.displayName.split(' ').slice(1).join(' ')}
                          </h5>
                          {!hasAccess && <Crown className="h-3 w-3 text-amber-500" />}
                          {isCurrentPersonality && (
                            <Badge variant="outline" className="text-[9px] py-0 h-3.5 border-emerald-500 text-emerald-700 dark:text-emerald-300">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 mb-1.5">
                          {personality.description}
                        </p>
                        {hasAccess && (
                          <div className="flex items-center gap-2 text-[9px] text-slate-500 dark:text-slate-400">
                            <span>Rate: {personality.rate}x</span>
                            <span>•</span>
                            <span>Pitch: {personality.pitch.toFixed(1)}</span>
                            <span>•</span>
                            <span>{personality.lang.toUpperCase()}</span>
                          </div>
                        )}
                        {!hasAccess && (
                          <Badge variant="outline" className="text-[9px] py-0 h-4 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
                            {personality.tier.charAt(0).toUpperCase() + personality.tier.slice(1)} Required
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Voice Presets - Compact */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
          Quick Presets
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {VOICE_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant="outline"
              size="sm"
              onClick={() => onSpeechRateChange(preset.rate)}
              className={cn(
                "flex items-center justify-start h-8 px-2 text-xs transition-all",
                Math.abs(speechRate - preset.rate) < 0.05 && 
                "border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100"
              )}
            >
              <span className="mr-1.5">{preset.icon}</span>
              <span className="text-[11px]">{preset.displayName}</span>
              <span className="ml-auto text-[10px] text-slate-500">{preset.rate}x</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Premium Advanced Controls - Compact */}
      {(isPremium || isPro) && (
        <>
          <Separator />
          <div className="space-y-3 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2">
              <Crown className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <label className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                Advanced Controls
              </label>
              <Badge variant="secondary" className="bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100 text-[10px] h-4 ml-auto">
                {isPremium ? 'Premium' : 'Pro'}
              </Badge>
            </div>

            {/* Pitch Control */}
            {onSpeechPitchChange && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                    Pitch
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                    {speechPitch.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[speechPitch]}
                  onValueChange={([value]) => onSpeechPitchChange(value)}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-emerald-600 dark:text-emerald-400">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>
            )}

            {/* Volume Control */}
            {onSpeechVolumeChange && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-emerald-800 dark:text-emerald-200">
                    Volume
                  </label>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-mono">
                    {Math.round(speechVolume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[speechVolume]}
                  onValueChange={([value]) => onSpeechVolumeChange(value)}
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </>
      )}

      {/* Upgrade prompt for free users - Compact and matching design */}
      {isFree && (
        <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-start gap-2">
            <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">
                Unlock Advanced Controls
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                Premium voices, pitch & volume controls with Pro or Premium.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVoiceSettings;
