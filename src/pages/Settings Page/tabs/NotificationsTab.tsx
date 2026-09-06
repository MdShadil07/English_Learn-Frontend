import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useProfileUpdate } from '@/hooks/useProfileMutations';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';

interface NotificationsTabProps {
  profileData: any;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({ profileData }) => {
  const queryClient = useQueryClient();
  const profileUpdateMutation = useProfileUpdate();
  
  const [formData, setFormData] = useState({
    privacySettings: {
      communicationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        weeklyReports: true,
        achievementAlerts: true,
        reminderNotifications: true,
      }
    }
  });

  useEffect(() => {
    if (profileData) {
      const profileInfo = profileData.profile || profileData;
      setFormData({
        privacySettings: {
          communicationPreferences: {
            ...((profileInfo.privacySettings && profileInfo.privacySettings.communicationPreferences) || {
              emailNotifications: true,
              pushNotifications: true,
              smsNotifications: false,
              marketingEmails: false,
              weeklyReports: true,
              achievementAlerts: true,
              reminderNotifications: true,
            })
          }
        }
      });
    }
  }, [profileData]);

  const handleUpdate = (field: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        communicationPreferences: {
          ...prev.privacySettings.communicationPreferences,
          [field]: checked
        }
      }
    }));
  };

  const handleSave = () => {
    profileUpdateMutation.mutate({ privacySettings: formData.privacySettings }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.profile.get() });
      }
    });
  };

  const prefs = formData.privacySettings.communicationPreferences;

  return (
    <div className="space-y-8 pb-4 max-w-3xl">
      <div className="space-y-5">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          Email Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Essential Updates</Label>
              <p className="text-[10px] font-medium text-slate-500">Security alerts and billing information (Cannot be disabled)</p>
            </div>
            <Switch checked={true} disabled={true} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">General Notifications</Label>
              <p className="text-[10px] font-medium text-slate-500">Receive emails for standard platform activities</p>
            </div>
            <Switch 
              checked={prefs.emailNotifications} 
              onCheckedChange={(checked) => handleUpdate('emailNotifications', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Weekly Reports</Label>
              <p className="text-[10px] font-medium text-slate-500">A weekly summary of your learning progress</p>
            </div>
            <Switch 
              checked={prefs.weeklyReports} 
              onCheckedChange={(checked) => handleUpdate('weeklyReports', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Marketing & Offers</Label>
              <p className="text-[10px] font-medium text-slate-500">Promotions, new features, and special offers</p>
            </div>
            <Switch 
              checked={prefs.marketingEmails} 
              onCheckedChange={(checked) => handleUpdate('marketingEmails', checked)} 
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 pt-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 pb-3 border-b border-slate-200 dark:border-emerald-500/10">
          In-App & Push Notifications
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Push Notifications</Label>
              <p className="text-[10px] font-medium text-slate-500">Allow browser push notifications</p>
            </div>
            <Switch 
              checked={prefs.pushNotifications} 
              onCheckedChange={(checked) => handleUpdate('pushNotifications', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Achievement Alerts</Label>
              <p className="text-[10px] font-medium text-slate-500">Get notified when you unlock a new badge or milestone</p>
            </div>
            <Switch 
              checked={prefs.achievementAlerts} 
              onCheckedChange={(checked) => handleUpdate('achievementAlerts', checked)} 
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-slate-300">Study Reminders</Label>
              <p className="text-[10px] font-medium text-slate-500">Reminders to keep up your daily streak</p>
            </div>
            <Switch 
              checked={prefs.reminderNotifications} 
              onCheckedChange={(checked) => handleUpdate('reminderNotifications', checked)} 
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          disabled={profileUpdateMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 font-black uppercase tracking-widest text-xs px-8 py-6 rounded-xl dark:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all active:scale-95"
        >
          {profileUpdateMutation.isPending ? 'Updating...' : 'Update notifications'}
        </Button>
      </div>
    </div>
  );
};

export default NotificationsTab;
