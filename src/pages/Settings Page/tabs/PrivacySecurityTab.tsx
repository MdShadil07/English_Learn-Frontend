import React, { useState, useEffect } from 'react';
import { EditPrivacySettings } from '@/components/settings';
import { 
  SecureEmailVerificationSection, 
  ActiveSessionsSection, 
  ChangePasswordSection, 
  LoginHistorySection, 
  DangerZoneSection 
} from '@/components/settings';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface PrivacySecurityTabProps {
  profileData: any;
}

const PrivacySecurityTab: React.FC<PrivacySecurityTabProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    privacySettings: {
      profileVisibility: 'public',
      showContactInfo: true,
      showEducation: true,
      showCertifications: true,
      showAchievements: true,
      activityTracking: {
        trackLearningProgress: true,
        trackTimeSpent: true,
        trackCourseCompletions: true,
        trackQuizResults: true,
        trackLoginHistory: true,
        trackDeviceInfo: false,
        trackLocationData: false,
      },
      communicationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        weeklyReports: true,
        achievementAlerts: true,
        reminderNotifications: true,
      },
      dataSharing: {
        shareWithPartners: false,
        shareAnonymousUsage: true,
        shareForResearch: false,
        allowPersonalization: true,
        thirdPartyIntegrations: false,
      },
      dataManagement: {
        autoDeleteInactive: false,
        dataRetentionPeriod: 365,
        downloadData: true,
        deleteAccount: false,
      },
      security: {
        twoFactorEnabled: false,
        loginAlerts: true,
        suspiciousActivityAlerts: true,
        sessionTimeout: 30,
      },
      emergency: {
        emergencyContact: '',
        emergencyPhone: '',
        emergencyEmail: '',
        allowEmergencyAccess: false,
      },
      // Mock features for future implementation
      showOnlineStatus: true,
      allowMessages: true,
      privacyMode: false,
    }
  });

  useEffect(() => {
    if (profileData) {
      const profileInfo = profileData.profile || profileData;
      const userData = profileData.user || profileData;
      
      setFormData({
        privacySettings: {
          ...(profileInfo.privacySettings || {
            profileVisibility: 'public',
            showContactInfo: true,
            showEducation: true,
            showCertifications: true,
            showAchievements: true,
            activityTracking: {
              trackLearningProgress: true,
              trackTimeSpent: true,
              trackCourseCompletions: true,
              trackQuizResults: true,
              trackLoginHistory: true,
              trackDeviceInfo: false,
              trackLocationData: false,
            },
            communicationPreferences: {
              emailNotifications: true,
              pushNotifications: true,
              smsNotifications: false,
              marketingEmails: false,
              weeklyReports: true,
              achievementAlerts: true,
              reminderNotifications: true,
            },
            dataSharing: {
              shareWithPartners: false,
              shareAnonymousUsage: true,
              shareForResearch: false,
              allowPersonalization: true,
              thirdPartyIntegrations: false,
            },
            dataManagement: {
              autoDeleteInactive: false,
              dataRetentionPeriod: 365,
              downloadData: true,
              deleteAccount: false,
            },
            security: {
              twoFactorEnabled: false,
              loginAlerts: true,
              suspiciousActivityAlerts: true,
              sessionTimeout: 30,
            },
            emergency: {
              emergencyContact: '',
              emergencyPhone: '',
              emergencyEmail: '',
              allowEmergencyAccess: false,
            },
          }),
          security: {
            ...((profileInfo.privacySettings && profileInfo.privacySettings.security) || {
              twoFactorEnabled: false,
              loginAlerts: true,
              suspiciousActivityAlerts: true,
              sessionTimeout: 30,
            }),
            twoFactorEnabled: userData.securitySettings?.twoFactorEnabled || false,
          },
          showOnlineStatus: true,
          allowMessages: true,
          privacyMode: false,
        }
      });
    }
  }, [profileData]);

  const handleUpdatePrivacy = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [field]: value
      }
    }));
  };

  const handleUpdateNestedPrivacy = (section: string, field: string, value: any) => {
    setFormData(prev => {
      const currentSection = prev.privacySettings[section as keyof typeof prev.privacySettings];
      if (currentSection && typeof currentSection === 'object') {
        return {
          ...prev,
          privacySettings: {
            ...prev.privacySettings,
            [section]: {
              ...currentSection,
              [field]: value
            }
          }
        };
      }
      return prev;
    });
  };

  const handleSave = () => {
    profileUpdateMutation.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
      }
    });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900 dark:text-white">Privacy & Security</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Manage your account security and control who sees your information.</p>
      </div>

      <div className="space-y-4">
        <ChangePasswordSection />
        <SecureEmailVerificationSection />
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <EditPrivacySettings
          privacySettings={formData.privacySettings}
          onUpdate={handleUpdatePrivacy}
          onUpdateNested={handleUpdateNestedPrivacy}
          onSave={handleSave}
          isSaving={profileUpdateMutation.isPending}
        />
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Social Privacy Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Show Online Status</Label>
              <p className="text-[10px] text-slate-500 font-medium">Let others see when you are active on the platform</p>
            </div>
            <Switch
              checked={formData.privacySettings.showOnlineStatus}
              onCheckedChange={(checked) => handleUpdatePrivacy('showOnlineStatus', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Allow Messages</Label>
              <p className="text-[10px] text-slate-500 font-medium">Receive direct messages from other users</p>
            </div>
            <Switch
              checked={formData.privacySettings.allowMessages}
              onCheckedChange={(checked) => handleUpdatePrivacy('allowMessages', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-900 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest">Incognito Mode</Label>
              <p className="text-[10px] text-slate-500 font-medium">Hide your activity and progress from public feeds completely</p>
            </div>
            <Switch
              checked={formData.privacySettings.privacyMode}
              onCheckedChange={(checked) => handleUpdatePrivacy('privacyMode', checked)}
            />
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Login History Log Section */}
      <LoginHistorySection />

      <Separator className="my-8" />

      {/* Logged in Devices Section */}
      <ActiveSessionsSection />

      <Separator className="my-8" />
      
      {/* GDPR Danger Zone Section */}
      <DangerZoneSection />
    </div>
  );
};

export default PrivacySecurityTab;
