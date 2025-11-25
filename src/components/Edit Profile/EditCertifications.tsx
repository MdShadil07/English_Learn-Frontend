import React from 'react';
import { motion } from 'framer-motion';
import { Award, Plus, Trash2, Calendar, ExternalLink, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';

interface Certification {
  name: string;
  issuer: string;
  issueDate: string | Date | null;
  expiryDate?: string | Date | null;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
  isVerified: boolean;
}

interface EditCertificationsProps {
  certifications: Certification[];
  onAddCertification: () => void;
  onRemoveCertification: (index: number) => void;
  onUpdateCertification: (index: number, field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditCertifications: React.FC<EditCertificationsProps> = ({
  certifications,
  onAddCertification,
  onRemoveCertification,
  onUpdateCertification,
  onSave,
  isSaving
}) => {
  const skillOptions = [
    'English Proficiency', 'Teaching Skills', 'Business Communication',
    'Academic Writing', 'Technical Writing', 'Presentation Skills',
    'Grammar', 'Vocabulary', 'Pronunciation', 'Listening Skills',
    'Speaking Skills', 'Reading Comprehension', 'Cultural Awareness'
  ];

  // Helper function to normalize date values for HTML input
  const getDateValue = (date: string | Date | null | undefined): string => {
    if (!date) return '';
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return '';
  };

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
        <Award className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -2, 2, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Shield className="h-5 w-5 drop-shadow-lg" />
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
        <ExternalLink className="h-6 w-6 drop-shadow-lg" />
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
              <Award className="h-8 w-8 text-white drop-shadow-lg" />
            </motion.div>
            <div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                Certifications
              </h3>
              <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                Your language certifications and qualifications
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={onAddCertification}
              size="sm"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </Button>
          </motion.div>
        </motion.div>

        <CardContent className="space-y-6">
          {certifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Certifications Added</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">Add your language certifications like TOEFL, IELTS, or other qualifications</p>
              <Button onClick={onAddCertification} variant="outline">
                Add Your First Certification
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {certifications.map((cert, index) => (
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
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">Certification #{index + 1}</h4>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {cert.name} from {cert.issuer}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => onRemoveCertification(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Certification Name *</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => onUpdateCertification(index, 'name', e.target.value)}
                        placeholder="TOEFL, IELTS, etc."
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issuing Organization *</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => onUpdateCertification(index, 'issuer', e.target.value)}
                        placeholder="ETS, British Council, etc."
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Issue Date *</Label>
                      <Input
                        type="date"
                        value={getDateValue(cert.issueDate)}
                        onChange={(e) => onUpdateCertification(index, 'issueDate', e.target.value)}
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input
                        type="date"
                        value={getDateValue(cert.expiryDate)}
                        onChange={(e) => onUpdateCertification(index, 'expiryDate', e.target.value)}
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credential ID</Label>
                      <Input
                        value={cert.credentialId || ''}
                        onChange={(e) => onUpdateCertification(index, 'credentialId', e.target.value)}
                        placeholder="Certificate number"
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Credential URL</Label>
                      <Input
                        value={cert.credentialUrl || ''}
                        onChange={(e) => onUpdateCertification(index, 'credentialUrl', e.target.value)}
                        placeholder="https://verify.certification.com"
                        className="bg-white dark:bg-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label>Description</Label>
                    <Textarea
                      value={cert.description || ''}
                      onChange={(e) => onUpdateCertification(index, 'description', e.target.value)}
                      placeholder="Describe what this certification covers..."
                      rows={2}
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>

                  <div className="space-y-3 mt-4">
                    <Label>Related Skills</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skillOptions.map(skill => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${skill}-${index}`}
                            checked={cert.skills?.includes(skill) || false}
                            onCheckedChange={() => {
                              const currentSkills = cert.skills || [];
                              const updatedSkills = currentSkills.includes(skill)
                                ? currentSkills.filter(s => s !== skill)
                                : [...currentSkills, skill];
                              onUpdateCertification(index, 'skills', updatedSkills);
                            }}
                          />
                          <Label htmlFor={`${skill}-${index}`} className="text-sm">{skill}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <Checkbox
                      id={`verified-${index}`}
                      checked={cert.isVerified}
                      onCheckedChange={(checked) => onUpdateCertification(index, 'isVerified', checked)}
                    />
                    <Label htmlFor={`verified-${index}`} className="text-sm">Verified Certification</Label>
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
              disabled={isSaving}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Certifications...
                </>
              ) : (
                <>
                  Save Certifications
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditCertifications;
