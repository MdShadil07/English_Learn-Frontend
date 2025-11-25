import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Phone, Globe, Target, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-800/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
    >
      {/* Background decorative elements */}
      <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg"></div>

      {/* Enhanced Floating Icons */}
      <motion.div
        className="absolute top-4 left-4 text-emerald-500/40 dark:text-emerald-400/30 hidden sm:block"
        animate={{
          y: [-6, 6, -6],
          rotate: [0, 3, -3, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Calendar className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -2, 2, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Globe className="h-5 w-5 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 text-cyan-500/40 dark:text-cyan-400/30 hidden sm:block"
        animate={{
          y: [-4, 4, -4],
          x: [-2, 2, -2],
          rotate: [0, 6, -6, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Target className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-6 sm:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Calendar className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Personal Information
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Your personal details and preferences
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Contact Information</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => onUpdate('location', e.target.value)}
                  placeholder="City, Country"
                  className="bg-white dark:bg-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => onUpdatePersonal('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-white dark:bg-slate-700"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Address Details</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    value={personalInfo.address?.street || ''}
                    onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, street: e.target.value })}
                    placeholder="123 Main Street"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={personalInfo.address?.city || ''}
                    onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, city: e.target.value })}
                    placeholder="New York"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    value={personalInfo.address?.state || ''}
                    onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, state: e.target.value })}
                    placeholder="New York"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={personalInfo.address?.country || ''}
                    onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, country: e.target.value })}
                    placeholder="United States"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    value={personalInfo.address?.zipCode || ''}
                    onChange={(e) => onUpdatePersonal('address', { ...personalInfo.address, zipCode: e.target.value })}
                    placeholder="10001"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Personal Information */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Personal Details</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={personalInfo.dateOfBirth || ''}
                  onChange={(e) => onUpdatePersonal('dateOfBirth', e.target.value)}
                  className="bg-white dark:bg-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={personalInfo.gender}
                  onValueChange={(value) => onUpdatePersonal('gender', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    {genderOptions.map(gender => (
                      <SelectItem key={gender} value={gender}>
                        {gender.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality</Label>
              <Input
                id="nationality"
                value={personalInfo.nationality}
                onChange={(e) => onUpdatePersonal('nationality', e.target.value)}
                placeholder="Your nationality"
                className="bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          <Separator />

          {/* Languages */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-3"
            >
              <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Languages You Speak</span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {languageOptions.map(language => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={personalInfo.languages.some(l => l.language === language)}
                    onCheckedChange={() => onToggleLanguage(language)}
                  />
                  <Label htmlFor={language} className="text-sm">{language}</Label>
                </div>
              ))}
            </div>

            {/* Language Proficiency */}
            {personalInfo.languages.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label className="text-sm font-medium">Language Proficiency</Label>
                {personalInfo.languages.map(lang => (
                  <div key={lang.language} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-20">{lang.language}:</span>
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) => onUpdateLanguageProficiency(lang.language, value)}
                    >
                      <SelectTrigger className="w-40 bg-white dark:bg-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
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

          <Separator />

          {/* Learning Goals */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-3"
            >
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Learning Goals</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {goalOptions.map(goal => (
                <div key={goal} className="flex items-center space-x-2">
                  <Checkbox
                    id={goal}
                    checked={goals.includes(goal)}
                    onCheckedChange={() => onToggleArray('goals', goal)}
                  />
                  <Label htmlFor={goal} className="text-sm">
                    {goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Interests */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 mb-3"
            >
              <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Interests</span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={interests.includes(interest)}
                    onCheckedChange={() => onToggleArray('interests', interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Personal Information...
                </>
              ) : (
                <>
                  Save Personal Information
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditPersonalInformation;
