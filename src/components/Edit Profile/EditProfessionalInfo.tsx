import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building, Award, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface ProfessionalInfoData {
  company: string;
  position: string;
  experienceYears?: number;
  industry: string;
  skills: string[];
  interests: string[];
  careerGoals: string;
}

interface EditProfessionalInfoProps {
  professionalInfo: ProfessionalInfoData;
  onUpdate: (field: string, value: any) => void;
  onToggleArray: (field: 'skills' | 'interests', value: string) => void;
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
    'Technology', 'Healthcare', 'Education', 'Finance', 'Marketing',
    'Sales', 'Engineering', 'Legal', 'Creative', 'Research', 'Other'
  ];

  const skillOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Project Management',
    'Leadership', 'Communication', 'Data Analysis', 'Machine Learning',
    'Design', 'Marketing', 'Teaching', 'Research', 'Consulting',
    'Problem Solving', 'Team Management', 'Strategic Planning'
  ];

  const interestOptions = [
    'Technology', 'Innovation', 'Leadership', 'Research', 'Teaching',
    'Consulting', 'Entrepreneurship', 'Social Impact', 'Mentoring',
    'Public Speaking', 'Networking', 'Professional Development'
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
        <Briefcase className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -2, 2, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Building className="h-5 w-5 drop-shadow-lg" />
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
        <TrendingUp className="h-6 w-6 drop-shadow-lg" />
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
            <Briefcase className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Professional Information
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Your professional background and career details
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Current Position */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Current Position</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  value={professionalInfo.company}
                  onChange={(e) => onUpdate('company', e.target.value)}
                  placeholder="Your current company"
                  className="bg-white dark:bg-slate-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position/Job Title</Label>
                <Input
                  id="position"
                  value={professionalInfo.position}
                  onChange={(e) => onUpdate('position', e.target.value)}
                  placeholder="Software Engineer, Manager, etc."
                  className="bg-white dark:bg-slate-700"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={professionalInfo.industry}
                  onValueChange={(value) => onUpdate('industry', value)}
                >
                  <SelectTrigger className="bg-white dark:bg-slate-700">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map(industry => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experienceYears">Years of Experience</Label>
                <Input
                  id="experienceYears"
                  type="number"
                  value={professionalInfo.experienceYears || ''}
                  onChange={(e) => onUpdate('experienceYears', parseInt(e.target.value) || undefined)}
                  placeholder="5"
                  className="bg-white dark:bg-slate-700"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Career Goals */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Career Goals</span>
            </motion.div>

            <div className="space-y-2">
              <Label htmlFor="careerGoals">Career Goals & Aspirations</Label>
              <Textarea
                id="careerGoals"
                value={professionalInfo.careerGoals}
                onChange={(e) => onUpdate('careerGoals', e.target.value)}
                placeholder="Describe your professional goals and aspirations..."
                rows={3}
                className="bg-white dark:bg-slate-700"
              />
            </div>
          </div>

          <Separator />

          {/* Professional Skills */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-3"
            >
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Professional Skills</span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skillOptions.map(skill => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={professionalInfo.skills?.includes(skill) || false}
                    onCheckedChange={() => onToggleArray('skills', skill)}
                  />
                  <Label htmlFor={skill} className="text-sm">{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Professional Interests */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-3"
            >
              <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Professional Interests</span>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interestOptions.map(interest => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={professionalInfo.interests?.includes(interest) || false}
                    onCheckedChange={() => onToggleArray('interests', interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">{interest}</Label>
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
                  Saving Professional Information...
                </>
              ) : (
                <>
                  Save Professional Information
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditProfessionalInfo;
