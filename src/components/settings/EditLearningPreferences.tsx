import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface LearningPreferencesData {
  preferredLearningStyle: 'visual' | 'auditory' | 'reading-writing' | 'kinesthetic' | 'mixed';
  dailyLearningGoal: number;
  weeklyLearningGoal: number;
  targetEnglishLevel: 'beginner' | 'intermediate' | 'advanced' | 'native-like';
  focusAreas: string[];
}

interface EditLearningPreferencesProps {
  learningPreferences: LearningPreferencesData;
  onUpdate: (field: string, value: any) => void;
  onToggleArray: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditLearningPreferences: React.FC<EditLearningPreferencesProps> = ({
  learningPreferences,
  onUpdate,
  onToggleArray,
  onSave,
  isSaving
}) => {
  const learningStyles = ['visual', 'auditory', 'reading-writing', 'kinesthetic', 'mixed'];
  const targetLevels = ['beginner', 'intermediate', 'advanced', 'native-like'];
  const focusAreas = [
    'speaking', 'listening', 'reading', 'writing',
    'grammar', 'vocabulary', 'pronunciation', 'business',
    'academic', 'casual-conversation'
  ];

  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Goals & Styles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Preferred Learning Style</Label>
            <Select
              value={learningPreferences.preferredLearningStyle}
              onValueChange={(value) => onUpdate('preferredLearningStyle', value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select style" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                {learningStyles.map(style => (
                  <SelectItem key={style} value={style}>
                    {style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Target English Level</Label>
            <Select
              value={learningPreferences.targetEnglishLevel}
              onValueChange={(value) => onUpdate('targetEnglishLevel', value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select target level" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                {targetLevels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Daily Learning Goal (minutes)</Label>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{learningPreferences.dailyLearningGoal} min</span>
            </div>
            <Slider
              value={[learningPreferences.dailyLearningGoal]}
              min={5}
              max={120}
              step={5}
              onValueChange={([value]) => onUpdate('dailyLearningGoal', value)}
              className="py-4 [&_[role=slider]]:border-emerald-500 [&_[role=slider]]:bg-emerald-500 [&_[data-orientation=horizontal]>div]:bg-emerald-500/20 [&_[data-orientation=horizontal]>div>div]:bg-emerald-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Weekly Learning Goal (minutes)</Label>
              <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{learningPreferences.weeklyLearningGoal} min</span>
            </div>
            <Slider
              value={[learningPreferences.weeklyLearningGoal]}
              min={30}
              max={840}
              step={30}
              onValueChange={([value]) => onUpdate('weeklyLearningGoal', value)}
              className="py-4 [&_[role=slider]]:border-emerald-500 [&_[role=slider]]:bg-emerald-500 [&_[data-orientation=horizontal]>div]:bg-emerald-500/20 [&_[data-orientation=horizontal]>div>div]:bg-emerald-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Focus Areas
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {focusAreas.map(area => (
            <div key={area} className="flex items-center space-x-2">
              <Checkbox
                id={`focus-${area}`}
                checked={learningPreferences.focusAreas.includes(area)}
                onCheckedChange={() => onToggleArray('focusAreas', area)}
                className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              />
              <Label htmlFor={`focus-${area}`} className="text-slate-300 text-sm cursor-pointer">
                {area.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update learning preferences'}
        </Button>
      </div>
    </div>
  );
};

export default EditLearningPreferences;
