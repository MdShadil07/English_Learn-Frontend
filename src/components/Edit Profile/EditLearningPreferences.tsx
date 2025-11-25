import React from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Zap, BookOpen, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface LearningPreferencesData {
  preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'mixed';
  dailyLearningGoal: number;
  weeklyLearningGoal: number;
  targetEnglishLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'native';
  focusAreas: string[];
}

interface EditLearningPreferencesProps {
  learningPreferences: LearningPreferencesData;
  onUpdate: (field: string, value: any) => void;
  onToggleArray: (field: 'focusAreas', value: string) => void;
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
  const learningStyleOptions = [
    { value: 'visual', label: 'Visual', description: 'Learn through images, videos, and visual aids' },
    { value: 'auditory', label: 'Auditory', description: 'Learn through listening and speaking' },
    { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn through hands-on activities and practice' },
    { value: 'reading-writing', label: 'Reading/Writing', description: 'Learn through reading texts and writing' },
    { value: 'mixed', label: 'Mixed', description: 'Combination of different learning styles' }
  ];

  const targetLevelOptions = [
    'beginner', 'intermediate', 'advanced', 'expert', 'native'
  ];

  const focusAreaOptions = [
    'speaking', 'listening', 'reading', 'writing', 'grammar',
    'vocabulary', 'pronunciation', 'business-english', 'academic-english'
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
        <Target className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -2, 2, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <BookOpen className="h-5 w-5 drop-shadow-lg" />
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
        <Clock className="h-6 w-6 drop-shadow-lg" />
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
            <Target className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Learning Preferences
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Customize your learning experience and goals
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Learning Style */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Learning Style</span>
            </motion.div>

            <div className="space-y-2">
              <Label>Preferred Learning Style</Label>
              <Select
                value={learningPreferences.preferredLearningStyle}
                onValueChange={(value) => onUpdate('preferredLearningStyle', value)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {learningStyleOptions.map(style => (
                    <SelectItem key={style.value} value={style.value}>
                      <div>
                        <div className="font-medium">{style.label}</div>
                        <div className="text-xs text-slate-500">{style.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Learning Goals */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Learning Goals</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyGoal">Daily Learning Goal (minutes)</Label>
                <Input
                  id="dailyGoal"
                  type="number"
                  value={learningPreferences.dailyLearningGoal}
                  onChange={(e) => onUpdate('dailyLearningGoal', parseInt(e.target.value) || 30)}
                  min="5"
                  max="180"
                  className="bg-white dark:bg-slate-700"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended: 30-60 minutes per day
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyGoal">Weekly Learning Goal (minutes)</Label>
                <Input
                  id="weeklyGoal"
                  type="number"
                  value={learningPreferences.weeklyLearningGoal}
                  onChange={(e) => onUpdate('weeklyLearningGoal', parseInt(e.target.value) || 210)}
                  min="35"
                  max="1260"
                  className="bg-white dark:bg-slate-700"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Recommended: 3-4 hours per week
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Target English Level */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 mb-3"
            >
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Target English Level</span>
            </motion.div>

            <div className="space-y-2">
              <Label>Target English Level</Label>
              <Select
                value={learningPreferences.targetEnglishLevel}
                onValueChange={(value) => onUpdate('targetEnglishLevel', value)}
              >
                <SelectTrigger className="bg-white dark:bg-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {targetLevelOptions.map(level => (
                    <SelectItem key={level} value={level}>
                      <div>
                        <div className="font-medium capitalize">{level}</div>
                        <div className="text-xs text-slate-500">
                          {level === 'beginner' && 'Just starting your English journey'}
                          {level === 'intermediate' && 'Building conversational skills'}
                          {level === 'advanced' && 'Professional and academic level'}
                          {level === 'expert' && 'Near-native proficiency'}
                          {level === 'native' && 'Native or near-native level'}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Focus Areas */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-3"
            >
              <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Focus Areas</span>
            </motion.div>

            <div className="space-y-3">
              <Label>Skills to Focus On</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {focusAreaOptions.map(area => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={learningPreferences.focusAreas.includes(area)}
                      onCheckedChange={() => onToggleArray('focusAreas', area)}
                    />
                    <Label htmlFor={area} className="text-sm">
                      {area.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Learning Tips</h4>
                <ul className="text-sm text-emerald-600 dark:text-emerald-400 space-y-1">
                  <li>• Consistent daily practice is more effective than long study sessions</li>
                  <li>• Focus on your weaker areas while maintaining strengths</li>
                  <li>• Mix different skills (speaking, listening, reading, writing) for balanced progress</li>
                  <li>• Regular practice with native speakers accelerates improvement</li>
                </ul>
              </div>
            </div>
          </motion.div>

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
                  Saving Learning Preferences...
                </>
              ) : (
                <>
                  Save Learning Preferences
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditLearningPreferences;
