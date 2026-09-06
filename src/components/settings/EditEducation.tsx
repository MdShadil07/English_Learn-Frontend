import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';

interface EducationData {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  educationLevel: 'high-school' | 'bachelors-degree' | 'masters-degree' | 'phd' | 'other';
  startYear?: number;
  endYear?: number | null;
  isCurrentlyEnrolled: boolean;
  grade?: string;
  description?: string;
}

interface EditEducationProps {
  education: EducationData[];
  onAddEducation: () => void;
  onRemoveEducation: (index: number) => void;
  onUpdateEducation: (index: number, field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditEducation: React.FC<EditEducationProps> = ({
  education,
  onAddEducation,
  onRemoveEducation,
  onUpdateEducation,
  onSave,
  isSaving
}) => {
  const levelOptions = ['high-school', 'bachelors-degree', 'masters-degree', 'phd', 'other'];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex justify-between items-center pb-3 border-b border-emerald-500/10">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400">
          Education History
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddEducation}
          className="text-[10px] font-black uppercase tracking-widest border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 h-8"
        >
          <Plus className="w-3 h-3 mr-1" /> Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-8 text-slate-400 border rounded-2xl border-dashed border-emerald-500/20 bg-emerald-500/5 text-sm font-medium">
          <p>No education history added yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="p-6 border border-emerald-500/20 rounded-2xl bg-emerald-500/5 relative shadow-[0_0_15px_rgba(16,185,129,0.05)]">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-xl"
                onClick={() => onRemoveEducation(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Institution</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => onUpdateEducation(index, 'institution', e.target.value)}
                    placeholder="University or School Name"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => onUpdateEducation(index, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Field of Study</Label>
                  <Input
                    value={edu.fieldOfStudy}
                    onChange={(e) => onUpdateEducation(index, 'fieldOfStudy', e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Education Level</Label>
                  <Select
                    value={edu.educationLevel}
                    onValueChange={(value) => onUpdateEducation(index, 'educationLevel', value)}
                  >
                    <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                      {levelOptions.map(level => (
                        <SelectItem key={level} value={level}>
                          {level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Start Year</Label>
                  <Input
                    type="number"
                    value={edu.startYear || ''}
                    onChange={(e) => onUpdateEducation(index, 'startYear', parseInt(e.target.value))}
                    placeholder="YYYY"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">End Year</Label>
                  <Input
                    type="number"
                    value={edu.endYear || ''}
                    onChange={(e) => onUpdateEducation(index, 'endYear', parseInt(e.target.value))}
                    disabled={edu.isCurrentlyEnrolled}
                    placeholder="YYYY"
                    className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <Checkbox
                  id={`enrolled-${index}`}
                  checked={edu.isCurrentlyEnrolled}
                  onCheckedChange={(checked) => onUpdateEducation(index, 'isCurrentlyEnrolled', checked)}
                  className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
                />
                <Label htmlFor={`enrolled-${index}`} className="text-slate-300 text-sm cursor-pointer">
                  I am currently enrolled here
                </Label>
              </div>

              <div className="space-y-2 mt-4">
                <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Description</Label>
                <Textarea
                  value={edu.description || ''}
                  onChange={(e) => onUpdateEducation(index, 'description', e.target.value)}
                  placeholder="Activities, societies, achievements..."
                  rows={2}
                  className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update education'}
        </Button>
      </div>
    </div>
  );
};

export default EditEducation;
