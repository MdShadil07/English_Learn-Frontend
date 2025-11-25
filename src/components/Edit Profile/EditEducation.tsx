import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Plus, Trash2, Building, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear?: number;
  endYear?: number | null;
  grade?: string;
  description?: string;
  isCurrentlyEnrolled: boolean;
  educationLevel: 'high-school' | 'associate-degree' | 'bachelors-degree' | 'masters-degree' | 'phd' | 'certificate' | 'diploma' | 'other';
}

interface EditEducationProps {
  education: Education[];
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
  const educationLevelOptions = [
    'high-school', 'associate-degree', 'bachelors-degree',
    'masters-degree', 'phd', 'certificate', 'diploma', 'other'
  ];

  // Check if any education entry has validation errors
  const hasValidationErrors = education.some(edu => {
    const currentYear = new Date().getFullYear();
    const isValidYear = (year: number | null | undefined) =>
      year === undefined || year === null || (typeof year === 'number' && year >= 1900 && year <= currentYear + 10);

    return (
      !edu.institution.trim() ||
      !edu.educationLevel ||
      (edu.startYear !== undefined && !isValidYear(edu.startYear)) ||
      (edu.endYear !== undefined && !isValidYear(edu.endYear) && !edu.isCurrentlyEnrolled)
    );
  });

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
        <GraduationCap className="h-6 w-6 drop-shadow-lg" />
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
        <Calendar className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <div className="relative p-6 sm:p-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center justify-between mb-6 sm:mb-8"
        >
          <motion.div className="flex items-center gap-3">
            <motion.div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <GraduationCap className="h-8 w-8 text-white drop-shadow-lg" />
            </motion.div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Education
              </h3>
              <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Your educational background and qualifications
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onAddEducation}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </Button>
          </motion.div>
        </motion.div>

        <CardContent className="space-y-6">
          {education.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Education Added</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Add your educational background to showcase your qualifications</p>
              <Button onClick={onAddEducation} variant="outline">
                Add Your First Education
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-emerald-200/40 dark:border-emerald-700/40 rounded-xl p-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Education #{index + 1}</h4>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {edu.degree} in {edu.fieldOfStudy}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveEducation(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`institution-${index}`}>Institution *</Label>
                      <Input
                        id={`institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => onUpdateEducation(index, 'institution', e.target.value)}
                        placeholder="University/School name"
                        className={`bg-white dark:bg-slate-700 ${!edu.institution.trim() ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`degree-${index}`}>Degree</Label>
                      <Input
                        id={`degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => onUpdateEducation(index, 'degree', e.target.value)}
                        placeholder="Bachelor's, Master's, etc."
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`fieldOfStudy-${index}`}>Field of Study</Label>
                      <Input
                        id={`fieldOfStudy-${index}`}
                        value={edu.fieldOfStudy}
                        onChange={(e) => onUpdateEducation(index, 'fieldOfStudy', e.target.value)}
                        placeholder="Computer Science, Business, etc."
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`educationLevel-${index}`}>Education Level *</Label>
                      <Select
                        value={edu.educationLevel}
                        onValueChange={(value) => onUpdateEducation(index, 'educationLevel', value)}
                      >
                        <SelectTrigger className={`bg-white dark:bg-slate-700 ${!edu.educationLevel ? 'border-red-300 focus:border-red-500' : ''}`}>
                          <SelectValue placeholder="Select education level" />
                        </SelectTrigger>
                        <SelectContent>
                          {educationLevelOptions.map(level => (
                            <SelectItem key={level} value={level}>
                              {level.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Start Year</Label>
                      <Input
                        type="number"
                        value={edu.startYear || ''}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (e.target.value === '' || (value >= 1900 && value <= new Date().getFullYear() + 10)) {
                            onUpdateEducation(index, 'startYear', value || undefined);
                          }
                        }}
                        placeholder="2020"
                        min="1900"
                        max={new Date().getFullYear() + 10}
                        className={`bg-white dark:bg-slate-700 ${
                          edu.startYear !== undefined && (edu.startYear < 1900 || edu.startYear > new Date().getFullYear() + 10)
                            ? 'border-red-300 focus:border-red-500'
                            : ''
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>End Year {edu.isCurrentlyEnrolled && <span className="text-emerald-600 font-medium">(Present)</span>}</Label>
                      <Input
                        type="number"
                        value={edu.isCurrentlyEnrolled ? '' : (edu.endYear || '')}
                        onChange={(e) => {
                          if (!edu.isCurrentlyEnrolled) {
                            const value = parseInt(e.target.value);
                            if (e.target.value === '' || (value >= 1900 && value <= new Date().getFullYear() + 10)) {
                              onUpdateEducation(index, 'endYear', value || undefined);
                            }
                          }
                        }}
                        placeholder={edu.isCurrentlyEnrolled ? "Present" : "2024"}
                        min="1900"
                        max={new Date().getFullYear() + 10}
                        className={`bg-white dark:bg-slate-700 ${
                          !edu.isCurrentlyEnrolled && edu.endYear !== undefined &&
                          (edu.endYear < 1900 || edu.endYear > new Date().getFullYear() + 10)
                            ? 'border-red-300 focus:border-red-500'
                            : ''
                        }`}
                        disabled={edu.isCurrentlyEnrolled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Grade/GPA</Label>
                      <Input
                        value={edu.grade || ''}
                        onChange={(e) => onUpdateEducation(index, 'grade', e.target.value)}
                        placeholder="3.8 GPA or A+"
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`currentlyEnrolled-${index}`}
                          checked={edu.isCurrentlyEnrolled}
                          onCheckedChange={(checked) => onUpdateEducation(index, 'isCurrentlyEnrolled', checked)}
                        />
                        <Label htmlFor={`currentlyEnrolled-${index}`}>Currently Enrolled</Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Description/Achievements</Label>
                    <Textarea
                      value={edu.description || ''}
                      onChange={(e) => onUpdateEducation(index, 'description', e.target.value)}
                      placeholder="Describe your achievements, projects, or relevant coursework..."
                      rows={3}
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Save Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button
              onClick={onSave}
              disabled={isSaving || hasValidationErrors}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Education...
                </>
              ) : hasValidationErrors ? (
                <>
                  Please fill in all required fields
                </>
              ) : (
                <>
                  Save Education Information
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditEducation;
