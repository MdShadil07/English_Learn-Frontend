import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TwoFactorSettings } from './TwoFactorSettings';

interface PrivacySettingsData {
  profileVisibility: 'public' | 'private' | 'connections-only';
  showContactInfo: boolean;
  showEducation: boolean;
  showCertifications: boolean;
  showAchievements: boolean;
  activityTracking: {
    trackLearningProgress: boolean;
    trackTimeSpent: boolean;
    trackCourseCompletions: boolean;
    trackQuizResults: boolean;
    trackLoginHistory: boolean;
    trackDeviceInfo: boolean;
    trackLocationData: boolean;
  };
  communicationPreferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
    achievementAlerts: boolean;
    reminderNotifications: boolean;
  };
  dataSharing: {
    shareWithPartners: boolean;
    shareAnonymousUsage: boolean;
    shareForResearch: boolean;
    allowPersonalization: boolean;
    thirdPartyIntegrations: boolean;
  };
  dataManagement: {
    autoDeleteInactive: boolean;
    dataRetentionPeriod: number;
    downloadData: boolean;
    deleteAccount: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    suspiciousActivityAlerts: boolean;
    sessionTimeout: number;
  };
  emergency: {
    emergencyContact: string;
    emergencyPhone: string;
    emergencyEmail: string;
    allowEmergencyAccess: boolean;
  };
}

interface EditPrivacySettingsProps {
  privacySettings: PrivacySettingsData;
  onUpdate: (field: string, value: any) => void;
  onUpdateNested: (section: string, field: string, value: any) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

const EditPrivacySettings: React.FC<EditPrivacySettingsProps> = ({
  privacySettings,
  onUpdate,
  onUpdateNested,
  onSave,
  isSaving
}) => {
  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Profile Visibility
        </h3>
        
        <div className="space-y-2 max-w-md">
          <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Who can see your profile?</Label>
          <Select
            value={privacySettings.profileVisibility}
            onValueChange={(value) => onUpdate('profileVisibility', value)}
          >
            <SelectTrigger className="bg-white border-slate-200 dark:bg-white/5 dark:border-emerald-500/20 text-slate-900 dark:text-white dark:focus:ring-emerald-500/30 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#050C14] border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white">
              <SelectItem value="public">Public (Everyone)</SelectItem>
              <SelectItem value="connections-only">Connections Only</SelectItem>
              <SelectItem value="private">Private (Only Me)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Show Contact Info</Label>
              <p className="text-[10px] text-slate-500 font-medium">Allow others to see your email and phone number</p>
            </div>
            <Switch
              checked={privacySettings.showContactInfo}
              onCheckedChange={(checked) => onUpdate('showContactInfo', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Show Education</Label>
              <p className="text-[10px] text-slate-500 font-medium">Display your education history on your public profile</p>
            </div>
            <Switch
              checked={privacySettings.showEducation}
              onCheckedChange={(checked) => onUpdate('showEducation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Show Certifications</Label>
              <p className="text-[10px] text-slate-500 font-medium">Display your licenses and certificates</p>
            </div>
            <Switch
              checked={privacySettings.showCertifications}
              onCheckedChange={(checked) => onUpdate('showCertifications', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Activity Tracking
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Track Learning Progress</Label>
              <p className="text-[10px] text-slate-500 font-medium">Keep detailed statistics of your learning activities</p>
            </div>
            <Switch
              checked={privacySettings.activityTracking?.trackLearningProgress ?? true}
              onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackLearningProgress', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Track Device Info</Label>
              <p className="text-[10px] text-slate-500 font-medium">Allow tracking of your login devices for security</p>
            </div>
            <Switch
              checked={privacySettings.activityTracking?.trackDeviceInfo ?? false}
              onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackDeviceInfo', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Data Sharing
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Share Anonymous Usage</Label>
              <p className="text-[10px] text-slate-500 font-medium">Help improve the platform by sharing anonymized usage data</p>
            </div>
            <Switch
              checked={privacySettings.dataSharing?.shareAnonymousUsage ?? true}
              onCheckedChange={(checked) => onUpdateNested('dataSharing', 'shareAnonymousUsage', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Allow Personalization</Label>
              <p className="text-[10px] text-slate-500 font-medium">Use your data to provide personalized content recommendations</p>
            </div>
            <Switch
              checked={privacySettings.dataSharing?.allowPersonalization ?? true}
              onCheckedChange={(checked) => onUpdateNested('dataSharing', 'allowPersonalization', checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Security Settings
        </h3>
        
        <div className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Login Alerts</Label>
              <p className="text-[10px] text-slate-500 font-medium">Get an email when anyone logs into your account from a new device</p>
            </div>
            <Switch
              checked={privacySettings.security?.loginAlerts ?? true}
              onCheckedChange={(checked) => onUpdateNested('security', 'loginAlerts', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Suspicious Activity Alerts</Label>
              <p className="text-[10px] text-slate-500 font-medium">Receive immediate notifications about unusual account activity</p>
            </div>
            <Switch
              checked={privacySettings.security?.suspiciousActivityAlerts ?? true}
              onCheckedChange={(checked) => onUpdateNested('security', 'suspiciousActivityAlerts', checked)}
            />
          </div>

          <div className="pt-2">
            <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest block mb-2">Session Auto-Logout Timeout</Label>
            <Select
              value={privacySettings.security?.sessionTimeout?.toString() || '30'}
              onValueChange={(value) => onUpdateNested('security', 'sessionTimeout', parseInt(value))}
            >
              <SelectTrigger className="bg-white border-slate-200 dark:bg-white/5 dark:border-emerald-500/20 text-slate-900 dark:text-white dark:focus:ring-emerald-500/30 rounded-xl max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#050C14] border-slate-200 dark:border-emerald-500/20 text-slate-900 dark:text-white">
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="60">1 Hour</SelectItem>
                <SelectItem value="1440">24 Hours</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-[10px] text-slate-500 font-medium mt-2">Automatically log out inactive sessions after this duration</p>
          </div>
        </div>

        <TwoFactorSettings 
          isTwoFactorEnabled={privacySettings.security?.twoFactorEnabled ?? false}
          onUpdateNested={onUpdateNested}
        />
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Emergency Contact
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Emergency Contact Name</Label>
            <Input
              value={privacySettings.emergency?.emergencyContact || ''}
              onChange={(e) => onUpdateNested('emergency', 'emergencyContact', e.target.value)}
              className="bg-white border-slate-200 dark:bg-white/5 dark:border-emerald-500/20 text-slate-900 dark:text-white dark:focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Emergency Phone</Label>
            <Input
              value={privacySettings.emergency?.emergencyPhone || ''}
              onChange={(e) => onUpdateNested('emergency', 'emergencyPhone', e.target.value)}
              className="bg-white border-slate-200 dark:bg-white/5 dark:border-emerald-500/20 text-slate-900 dark:text-white dark:focus-visible:ring-emerald-500/30 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {isSaving ? 'Updating...' : 'Update privacy settings'}
        </Button>
      </div>
    </div>
  );
};

export default EditPrivacySettings;
