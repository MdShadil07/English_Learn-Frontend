import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PersonalInfoData {
  dateOfBirth?: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say' | 'other';
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  nationality: string;
  languages: Array<{
    language: string;
    proficiency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  }>;
}

interface EditPersonalInformationProps {
  personalInfo: PersonalInfoData;
  location: string;
  goals: string[];
  interests: string[];
  onUpdatePersonal: (field: string, value: any) => void;
  onUpdate: (field: string, value: any) => void;
  onToggleArray: (field: 'goals' | 'interests', value: string) => void;
  onToggleLanguage: (language: string) => void;
  onUpdateLanguageProficiency: (language: string, proficiency: string) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditPersonalInformation: React.FC<EditPersonalInformationProps> = ({
  personalInfo,
  location,
  goals,
  interests,
  onUpdatePersonal,
  onUpdate,
  onToggleArray,
  onToggleLanguage,
  onUpdateLanguageProficiency,
  onSave,
  isSaving
}) => {
  const genderOptions = ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'];
  const proficiencyOptions = ['beginner', 'intermediate', 'advanced', 'native'];

  const goalOptions = [
    'improve-speaking-skills', 'enhance-vocabulary', 'master-grammar',
    'prepare-for-exams', 'business-english', 'travel-communication',
    'academic-writing', 'pronunciation-improvement', 'reading-comprehension', 'writing-skills'
  ];

  const interestOptions = [
    'technology', 'business', 'science', 'literature', 'travel',
    'movies', 'music', 'sports', 'cooking', 'art', 'politics',
    'history', 'medicine', 'law', 'finance', 'education'
  ];

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi'
  ];

  return (
    <div className="space-y-8 pb-8 max-w-3xl">
      
      {/* Contact Information */}
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Contact Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => onUpdate('location', e.target.value)}
              placeholder="City, Country"
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Phone Number</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => onUpdatePersonal('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Address Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="street" className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Street Address</Label>
              <Input
                id="street"
                value={personalInfo.address?.street || ''}
                onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, street: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city" className="text-slate-400 text-[9px] font-black uppercase tracking-widest">City</Label>
              <Input
                id="city"
                value={personalInfo.address?.city || ''}
                onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, city: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-400 text-[9px] font-black uppercase tracking-widest">State/Province</Label>
              <Input
                id="state"
                value={personalInfo.address?.state || ''}
                onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, state: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country" className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Country</Label>
              <Input
                id="country"
                value={personalInfo.address?.country || ''}
                onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, country: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="zipCode" className="text-slate-400 text-[9px] font-black uppercase tracking-widest">ZIP/Postal Code</Label>
              <Input
                id="zipCode"
                value={personalInfo.address?.zipCode || ''}
                onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, zipCode: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Demographics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={personalInfo.dateOfBirth || ''}
              onChange={(e) => onUpdatePersonal('dateOfBirth', e.target.value)}
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus-visible:ring-emerald-500/30 rounded-xl [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Gender</Label>
            <Select
              value={personalInfo.gender}
              onValueChange={(value) => onUpdatePersonal('gender', value)}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                {genderOptions.map(gender => (
                  <SelectItem key={gender} value={gender}>
                    {gender.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="nationality" className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Nationality</Label>
            <Input
              id="nationality"
              value={personalInfo.nationality}
              onChange={(e) => onUpdatePersonal('nationality', e.target.value)}
              placeholder="Your nationality"
              className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white placeholder:text-slate-600 focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Spoken Languages
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {languageOptions.map(language => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={personalInfo.languages.some(l => l.language === language)}
                onCheckedChange={() => onToggleLanguage(language)}
                className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              />
              <Label htmlFor={language} className="text-slate-300 text-sm cursor-pointer">{language}</Label>
            </div>
          ))}
        </div>

        {/* Language Proficiency */}
        {personalInfo.languages.length > 0 && (
          <div className="mt-6 space-y-3 p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
            <Label className="text-slate-300 text-[10px] font-black uppercase tracking-widest">Proficiency Levels</Label>
            {personalInfo.languages.map((lang, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-slate-900 dark:text-white text-sm font-medium w-24">{lang.language}</span>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value) => onUpdateLanguageProficiency(lang.language, value)}
                >
                  <SelectTrigger className="w-full sm:w-48 bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white focus:ring-emerald-500/30 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900 dark:bg-white/5 dark:border-emerald-500/20 dark:text-white">
                    {proficiencyOptions.map(level => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Goals */}
      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Learning Goals
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {goalOptions.map(goal => (
            <div key={goal} className="flex items-start space-x-2">
              <Checkbox
                id={goal}
                checked={goals.includes(goal)}
                onCheckedChange={() => onToggleArray('goals', goal)}
                className="mt-1 border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              />
              <Label htmlFor={goal} className="text-slate-300 text-sm leading-tight cursor-pointer">
                {goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-400 pb-3 border-b border-emerald-500/10">
          Interests
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {interestOptions.map(interest => (
            <div key={interest} className="flex items-center space-x-2">
              <Checkbox
                id={interest}
                checked={interests.includes(interest)}
                onCheckedChange={() => onToggleArray('interests', interest)}
                className="border-emerald-500/30 data-[state=checked]:bg-emerald-500 data-[state=checked]:text-slate-950"
              />
              <Label htmlFor={interest} className="text-slate-300 text-sm cursor-pointer">
                {interest.charAt(0).toUpperCase() + interest.slice(1)}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update account details'}
        </Button>
      </div>
    </div>
  );
};

export default EditPersonalInformation;
