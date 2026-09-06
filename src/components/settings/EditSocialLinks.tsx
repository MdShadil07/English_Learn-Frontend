import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Github, Twitter, Linkedin, Instagram, Youtube, Globe, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SocialLinksData {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  portfolio?: string;
  other?: string;
}

interface EditSocialLinksProps {
  socialLinks: SocialLinksData;
  onUpdate: (field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditSocialLinks: React.FC<EditSocialLinksProps> = ({
  socialLinks,
  onUpdate,
  onSave,
  isSaving
}) => {
  const socialPlatforms = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/yourprofile',
      icon: Linkedin,
      color: 'from-blue-600 to-blue-700'
    },
    {
      key: 'github',
      label: 'GitHub',
      placeholder: 'https://github.com/yourusername',
      icon: Github,
      color: 'from-gray-800 to-gray-900'
    },
    {
      key: 'twitter',
      label: 'Twitter/X',
      placeholder: 'https://twitter.com/yourusername',
      icon: Twitter,
      color: 'from-blue-400 to-blue-500'
    },
    {
      key: 'website',
      label: 'Personal Website',
      placeholder: 'https://yourwebsite.com',
      icon: Globe,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'https://instagram.com/yourusername',
      icon: Instagram,
      color: 'from-pink-500 to-purple-600'
    },
    {
      key: 'youtube',
      label: 'YouTube',
      placeholder: 'https://youtube.com/yourchannel',
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    },
    {
      key: 'portfolio',
      label: 'Portfolio',
      placeholder: 'https://yourportfolio.com',
      icon: FileText,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      key: 'other',
      label: 'Other Links',
      placeholder: 'Any other relevant links',
      icon: LinkIcon,
      color: 'from-cyan-600 to-teal-600'
    }
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
        <LinkIcon className="h-6 w-6 drop-shadow-lg" />
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
        <FileText className="h-6 w-6 drop-shadow-lg" />
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
            <LinkIcon className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Social Links & Portfolio
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Connect your social media and showcase your work
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Professional Platforms */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-3"
            >
              <Linkedin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Professional Platforms</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.slice(0, 4).map((platform) => (
                <motion.div
                  key={platform.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: platform.key === 'linkedin' ? 0.2 : 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor={platform.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                      <platform.icon className="w-2.5 h-2.5 text-white" />
                    </div>
                    {platform.label}
                  </Label>
                  <Input
                    id={platform.key}
                    value={socialLinks[platform.key as keyof SocialLinksData] || ''}
                    onChange={(e) => onUpdate(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="bg-white dark:bg-slate-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Social Media */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mb-3"
            >
              <Instagram className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Social Media</span>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {socialPlatforms.slice(4, 7).map((platform) => (
                <motion.div
                  key={platform.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (socialPlatforms.indexOf(platform) - 4) * 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor={platform.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${platform.color} flex items-center justify-center`}>
                      <platform.icon className="w-2.5 h-2.5 text-white" />
                    </div>
                    {platform.label}
                  </Label>
                  <Input
                    id={platform.key}
                    value={socialLinks[platform.key as keyof SocialLinksData] || ''}
                    onChange={(e) => onUpdate(platform.key, e.target.value)}
                    placeholder={platform.placeholder}
                    className="bg-white dark:bg-slate-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Links */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-2 mb-3"
            >
              <LinkIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">Additional Links</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-2"
            >
              <Label htmlFor="other" className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center justify-center">
                  <LinkIcon className="w-2.5 h-2.5 text-white" />
                </div>
                Other Links
              </Label>
              <Input
                id="other"
                value={socialLinks.other || ''}
                onChange={(e) => onUpdate('other', e.target.value)}
                placeholder="Any other relevant links"
                className="bg-white dark:bg-slate-700"
              />
            </motion.div>
          </div>

          {/* Preview Section */}
          {Object.values(socialLinks).some(link => link) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30"
            >
              <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3">Link Preview</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(socialLinks).map(([key, value]) => {
                  if (!value) return null;
                  const platform = socialPlatforms.find(p => p.key === key);
                  if (!platform) return null;

                  return (
                    <div
                      key={key}
                      className={`px-3 py-1 rounded-full text-xs bg-gradient-to-r ${platform.color} text-white flex items-center gap-1`}
                    >
                      <platform.icon className="w-3 h-3" />
                      {platform.label}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Save Button */}
          <motion.div
            className="pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Button
              onClick={onSave}
              disabled={isSaving}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving Social Links...
                </>
              ) : (
                <>
                  Save Social Links
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditSocialLinks;
