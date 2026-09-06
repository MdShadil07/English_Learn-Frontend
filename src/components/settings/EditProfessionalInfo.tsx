import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface ProfessionalInfoData {
  company: string;
  position: string;
  experienceYears: number;
  industry: string;
  skills: string[];
  interests: string[];
  careerGoals: string;
  resumeUrl: string;
}

interface EditProfessionalInfoProps {
  professionalInfo: ProfessionalInfoData;
  onUpdate: (field: string, value: any) => void;
  onToggleArray: (field: string, value: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditProfessionalInfo: React.FC<EditProfessionalInfoProps> = ({
  professionalInfo,
  onUpdate,
  onToggleArray,
  onSave,
  isSaving
}) => {
  const industryOptions = [
    'technology', 'finance', 'healthcare', 'education', 'manufacturing',
    'retail', 'media', 'consulting', 'government', 'non-profit', 'other'
  ];

  const skillOptions = [
    'javascript', 'python', 'react', 'node.js', 'sql', 'aws',
    'project-management', 'agile', 'data-analysis', 'machine-learning',
    'marketing', 'sales', 'design', 'writing', 'public-speaking'
  ];

  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Current Employment
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Company / Organization</Label>
            <Input
              id="company"
              value={professionalInfo.company}
              onChange={(e) => onUpdate('company', e.target.value)}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
              placeholder="Where do you work?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Position / Job Title</Label>
            <Input
              id="position"
              value={professionalInfo.position}
              onChange={(e) => onUpdate('position', e.target.value)}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
              placeholder="e.g. Senior Developer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Industry</Label>
            <Select
              value={professionalInfo.industry}
              onValueChange={(value) => onUpdate('industry', value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white max-h-60">
                {industryOptions.map(ind => (
                  <SelectItem key={ind} value={ind}>
                    {ind.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="experienceYears" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Years of Experience</Label>
            <Input
              id="experienceYears"
              type="number"
              min="0"
              value={professionalInfo.experienceYears}
              onChange={(e) => onUpdate('experienceYears', parseInt(e.target.value) || 0)}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Skills & Career
        </h3>

        <div className="space-y-4">
          <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Professional Skills</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {skillOptions.map(skill => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={professionalInfo.skills.includes(skill)}
                  onCheckedChange={() => onToggleArray('skills', skill)}
                  className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
                />
                <Label htmlFor={`skill-${skill}`} className="text-slate-300 text-sm cursor-pointer">
                  {skill.replace(/-/g, ' ')}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="careerGoals" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Career Goals</Label>
          <Textarea
            id="careerGoals"
            value={professionalInfo.careerGoals}
            onChange={(e) => onUpdate('careerGoals', e.target.value)}
            placeholder="What are your professional aspirations?"
            rows={4}
            className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl resize-y"
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label htmlFor="resumeUrl" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Resume URL (Optional)</Label>
          <Input
            id="resumeUrl"
            type="url"
            value={professionalInfo.resumeUrl}
            onChange={(e) => onUpdate('resumeUrl', e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update professional info'}
        </Button>
      </div>
    </div>
  );
};

export default EditProfessionalInfo;
