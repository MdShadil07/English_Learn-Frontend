import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Bell, Moon, Sun, Volume2, Eye } from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  soundEffects: boolean;
  voiceOutput: boolean;
  autoplay: boolean;
  studyReminders: boolean;
  weeklyReports: boolean;
  privacyMode: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
}

interface ProfileSettingsProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ preferences, onUpdatePreferences }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg">
          <Settings className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your preferences</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Notifications</span>
            </div>
            <Button variant="outline" size="sm">
              {preferences.notifications ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Receive notifications about your progress</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-green-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Sound Effects</span>
            </div>
            <Button variant="outline" size="sm">
              {preferences.soundEffects ? 'On' : 'Off'}
            </Button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Play sounds for interactions and feedback</p>
        </div>

        <div className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Privacy Mode</span>
            </div>
            <Button variant="outline" size="sm">
              {preferences.privacyMode ? 'Active' : 'Inactive'}
            </Button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">Hide your activity from other users</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
