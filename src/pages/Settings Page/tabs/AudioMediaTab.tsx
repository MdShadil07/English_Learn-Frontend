import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AudioMediaTab: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    soundEffects: true,
    voiceOutput: true,
    autoplay: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: 'Settings saved!',
      description: 'Your audio & media preferences have been updated.',
    });
    setIsSaving(false);
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Playback Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Sound Effects</Label>
              <p className="text-[10px] font-medium text-slate-500">Play sounds for interactions and achievements</p>
            </div>
            <Switch
              checked={preferences.soundEffects}
              onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Voice Output</Label>
              <p className="text-[10px] font-medium text-slate-500">Enable text-to-speech features for vocabulary</p>
            </div>
            <Switch
              checked={preferences.voiceOutput}
              onCheckedChange={(checked) => updatePreference('voiceOutput', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Autoplay Media</Label>
              <p className="text-[10px] font-medium text-slate-500">Automatically play audio and video content</p>
            </div>
            <Switch
              checked={preferences.autoplay}
              onCheckedChange={(checked) => updatePreference('autoplay', checked)}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Saving...' : 'Save preferences'}
        </Button>
      </div>
    </div>
  );
};

export default AudioMediaTab;
