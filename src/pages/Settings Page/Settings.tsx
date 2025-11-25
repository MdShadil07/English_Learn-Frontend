import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BasicHeader from '@/components/layout/BasicHeader';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Settings,
  Bell,
  Moon,
  Sun,
  Volume2,
  Eye,
  Shield,
  Database,
  Mail,
  Globe,
  Headphones,
  Smartphone,
  Save,
  User,
  Lock,
  Key
} from 'lucide-react';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
  soundEffects: boolean;
  voiceOutput: boolean;
  autoplay: boolean;
  studyReminders: boolean;
  weeklyReports: boolean;
  privacyMode: boolean;
  dataCollection: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'friends' | 'private';
  showOnlineStatus: boolean;
  allowMessages: boolean;
}

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: 'auto',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      sms: false,
      inApp: true,
    },
    soundEffects: true,
    voiceOutput: true,
    autoplay: false,
    studyReminders: true,
    weeklyReports: true,
    privacyMode: false,
    dataCollection: true,
    marketingEmails: false,
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: 'Settings saved!',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNotificationPreference = (key: keyof UserPreferences['notifications'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30 dark:from-slate-900/30 dark:via-emerald-900/20 dark:to-teal-900/30">
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'admin@example.com',
          fullName: user?.fullName || 'Administrator',
          role: (user?.role as 'student' | 'teacher' | 'admin') || 'admin',
          isPremium: false,
          subscriptionStatus: 'none',
        }}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
            >
              <Settings className="h-10 w-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-700 dark:from-emerald-100 dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-lg text-emerald-600 dark:text-emerald-400 mt-2">
                Manage your AI learning preferences
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Appearance Settings */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sun className="h-5 w-5 text-white" />
                  </div>
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Theme
                  </Label>
                  <Select value={preferences.theme} onValueChange={(value: any) => updatePreference('theme', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Language
                  </Label>
                  <Select value={preferences.language} onValueChange={(value: any) => updatePreference('language', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="pt">Português</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audio & Media Settings */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Volume2 className="h-5 w-5 text-white" />
                  </div>
                  Audio & Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Sound Effects
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Play sounds for interactions
                    </p>
                  </div>
                  <Switch
                    checked={preferences.soundEffects}
                    onCheckedChange={(checked) => updatePreference('soundEffects', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Voice Output
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Enable text-to-speech features
                    </p>
                  </div>
                  <Switch
                    checked={preferences.voiceOutput}
                    onCheckedChange={(checked) => updatePreference('voiceOutput', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Autoplay Media
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Automatically play audio/video content
                    </p>
                  </div>
                  <Switch
                    checked={preferences.autoplay}
                    onCheckedChange={(checked) => updatePreference('autoplay', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Notifications
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => updateNotificationPreference('email', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Push Notifications
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Browser push notifications
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) => updateNotificationPreference('push', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Study Reminders
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Daily practice reminders
                    </p>
                  </div>
                  <Switch
                    checked={preferences.studyReminders}
                    onCheckedChange={(checked) => updatePreference('studyReminders', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Weekly Reports
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Progress summary emails
                    </p>
                  </div>
                  <Switch
                    checked={preferences.weeklyReports}
                    onCheckedChange={(checked) => updatePreference('weeklyReports', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Profile Visibility
                  </Label>
                  <Select value={preferences.profileVisibility} onValueChange={(value: any) => updatePreference('profileVisibility', value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Show Online Status
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Let others see when you're online
                    </p>
                  </div>
                  <Switch
                    checked={preferences.showOnlineStatus}
                    onCheckedChange={(checked) => updatePreference('showOnlineStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Allow Messages
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive messages from other users
                    </p>
                  </div>
                  <Switch
                    checked={preferences.allowMessages}
                    onCheckedChange={(checked) => updatePreference('allowMessages', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Privacy Mode
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Hide activity from other users
                    </p>
                  </div>
                  <Switch
                    checked={preferences.privacyMode}
                    onCheckedChange={(checked) => updatePreference('privacyMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data & Marketing */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-emerald-200/30 dark:border-emerald-700/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-emerald-800 dark:text-emerald-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-slate-600 rounded-xl flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  Data & Marketing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Data Collection
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Help improve our service
                    </p>
                  </div>
                  <Switch
                    checked={preferences.dataCollection}
                    onCheckedChange={(checked) => updatePreference('dataCollection', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Marketing Emails
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive promotional content
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) => updatePreference('marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center pt-8"
          >
            <Button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Save All Settings
                </div>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <Footer variant="landing" showNewsletter={false} />
    </div>
  );
};

export default SettingsPage;
