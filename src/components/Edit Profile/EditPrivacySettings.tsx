import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Eye,
  EyeOff,
  Lock,
  Users,
  Globe,
  Settings,
  Download,
  Upload,
  Clock,
  Bell,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Key,
  Database,
  Activity,
  Mail,
  MessageSquare,
  BookOpen,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PrivacySettingsData {
  profileVisibility: 'public' | 'friends-only' | 'private';
  showContactInfo: boolean;
  showEducation: boolean;
  showCertifications: boolean;
  showAchievements: boolean;
  // Advanced privacy settings
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
    dataRetentionPeriod: number; // in months
    downloadData: boolean;
    deleteAccount: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
    loginAlerts: boolean;
    suspiciousActivityAlerts: boolean;
    sessionTimeout: number; // in minutes
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
  const [activeTab, setActiveTab] = useState('visibility');
  const [showDataExport, setShowDataExport] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  const visibilityOptions = [
    {
      value: 'public',
      label: 'Public',
      description: 'Anyone can see your profile and activities',
      icon: Globe,
      color: 'from-green-500 to-emerald-600'
    },
    {
      value: 'friends-only',
      label: 'Connections Only',
      description: 'Only your connections can see your profile',
      icon: Users,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      value: 'private',
      label: 'Private',
      description: 'Only you can see your profile and activities',
      icon: Lock,
      color: 'from-red-500 to-red-600'
    }
  ];

  const retentionOptions = [
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' },
    { value: 24, label: '2 years' },
    { value: 36, label: '3 years' },
    { value: 60, label: '5 years' },
    { value: -1, label: 'Forever' }
  ];

  const handleExportData = async () => {
    try {
      // Simulate data export
      const data = {
        profile: privacySettings,
        exportDate: new Date().toISOString(),
        dataTypes: ['profile', 'activities', 'preferences', 'settings']
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `privacy-settings-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Privacy settings exported successfully!');
    } catch (error) {
      alert('Failed to export data. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Simulate account deletion
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Account deletion request submitted. You will receive a confirmation email.');
        setShowDeleteAccount(false);
      } catch (error) {
        alert('Failed to submit deletion request. Please try again.');
      }
    }
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
        <Shield className="h-6 w-6 drop-shadow-lg" />
      </motion.div>

      <motion.div
        className="absolute top-6 right-6 text-teal-500/40 dark:text-teal-400/30 hidden sm:block"
        animate={{
          y: [8, -8, 8],
          rotate: [0, -2, 2, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Lock className="h-5 w-5 drop-shadow-lg" />
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
        <Eye className="h-6 w-6 drop-shadow-lg" />
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
            <Shield className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
              Advanced Privacy Settings
            </h3>
            <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Comprehensive control over your data and privacy
            </p>
          </div>
        </motion.div>

        <CardContent className="space-y-6">
          {/* Tabbed Interface for Advanced Settings */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/50 dark:bg-slate-800/50">
              <TabsTrigger value="visibility" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Visibility</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Communication</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Visibility Tab */}
            <TabsContent value="visibility" className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Eye className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Profile Visibility</span>
                </motion.div>

                <div className="space-y-2">
                  <Label>Who can see your profile?</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value) => onUpdate('profileVisibility', value)}
                  >
                    <SelectTrigger className="bg-white dark:bg-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibilityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${option.color}`}></div>
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-slate-500">{option.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Information Visibility */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Information Visibility</span>
                </motion.div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showContactInfo"
                      checked={privacySettings.showContactInfo}
                      onCheckedChange={(checked) => onUpdate('showContactInfo', checked)}
                    />
                    <Label htmlFor="showContactInfo" className="text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Show contact information (phone, address)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showEducation"
                      checked={privacySettings.showEducation}
                      onCheckedChange={(checked) => onUpdate('showEducation', checked)}
                    />
                    <Label htmlFor="showEducation" className="text-sm flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Show education information
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showCertifications"
                      checked={privacySettings.showCertifications}
                      onCheckedChange={(checked) => onUpdate('showCertifications', checked)}
                    />
                    <Label htmlFor="showCertifications" className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Show certifications
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="showAchievements"
                      checked={privacySettings.showAchievements}
                      onCheckedChange={(checked) => onUpdate('showAchievements', checked)}
                    />
                    <Label htmlFor="showAchievements" className="text-sm flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Show achievements and awards
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Activity Tracking Tab */}
            <TabsContent value="activity" className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Activity Tracking</span>
                </motion.div>

                <Alert className="border-blue-200 dark:border-blue-800">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Control what learning activities and data are tracked for your account.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackLearningProgress" className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Track Learning Progress
                    </Label>
                    <Switch
                      id="trackLearningProgress"
                      checked={privacySettings.activityTracking.trackLearningProgress}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackLearningProgress', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackTimeSpent" className="text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Track Time Spent Learning
                    </Label>
                    <Switch
                      id="trackTimeSpent"
                      checked={privacySettings.activityTracking.trackTimeSpent}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackTimeSpent', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackCourseCompletions" className="text-sm flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Track Course Completions
                    </Label>
                    <Switch
                      id="trackCourseCompletions"
                      checked={privacySettings.activityTracking.trackCourseCompletions}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackCourseCompletions', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackQuizResults" className="text-sm flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Track Quiz Results
                    </Label>
                    <Switch
                      id="trackQuizResults"
                      checked={privacySettings.activityTracking.trackQuizResults}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackQuizResults', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackLoginHistory" className="text-sm flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Track Login History
                    </Label>
                    <Switch
                      id="trackLoginHistory"
                      checked={privacySettings.activityTracking.trackLoginHistory}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackLoginHistory', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackDeviceInfo" className="text-sm flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      Track Device Information
                    </Label>
                    <Switch
                      id="trackDeviceInfo"
                      checked={privacySettings.activityTracking.trackDeviceInfo}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackDeviceInfo', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trackLocationData" className="text-sm flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Track Location Data
                    </Label>
                    <Switch
                      id="trackLocationData"
                      checked={privacySettings.activityTracking.trackLocationData}
                      onCheckedChange={(checked) => onUpdateNested('activityTracking', 'trackLocationData', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Communication Preferences Tab */}
            <TabsContent value="communication" className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Communication Preferences</span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Notification Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications" className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Notifications
                        </Label>
                        <Switch
                          id="emailNotifications"
                          checked={privacySettings.communicationPreferences.emailNotifications}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'emailNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pushNotifications" className="text-sm flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Push Notifications
                        </Label>
                        <Switch
                          id="pushNotifications"
                          checked={privacySettings.communicationPreferences.pushNotifications}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'pushNotifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smsNotifications" className="text-sm flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          SMS Notifications
                        </Label>
                        <Switch
                          id="smsNotifications"
                          checked={privacySettings.communicationPreferences.smsNotifications}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'smsNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Content Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="marketingEmails" className="text-sm">Marketing Emails</Label>
                        <Switch
                          id="marketingEmails"
                          checked={privacySettings.communicationPreferences.marketingEmails}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'marketingEmails', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="weeklyReports" className="text-sm">Weekly Reports</Label>
                        <Switch
                          id="weeklyReports"
                          checked={privacySettings.communicationPreferences.weeklyReports}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'weeklyReports', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="achievementAlerts" className="text-sm">Achievement Alerts</Label>
                        <Switch
                          id="achievementAlerts"
                          checked={privacySettings.communicationPreferences.achievementAlerts}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'achievementAlerts', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="reminderNotifications" className="text-sm">Reminder Notifications</Label>
                        <Switch
                          id="reminderNotifications"
                          checked={privacySettings.communicationPreferences.reminderNotifications}
                          onCheckedChange={(checked) => onUpdateNested('communicationPreferences', 'reminderNotifications', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Key className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Security Settings</span>
                </motion.div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorEnabled" className="text-sm flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Two-Factor Authentication
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={privacySettings.security.twoFactorEnabled ? "default" : "secondary"}>
                        {privacySettings.security.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        id="twoFactorEnabled"
                        checked={privacySettings.security.twoFactorEnabled}
                        onCheckedChange={(checked) => onUpdateNested('security', 'twoFactorEnabled', checked)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="loginAlerts" className="text-sm flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Login Alerts
                    </Label>
                    <Switch
                      id="loginAlerts"
                      checked={privacySettings.security.loginAlerts}
                      onCheckedChange={(checked) => onUpdateNested('security', 'loginAlerts', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="suspiciousActivityAlerts" className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Suspicious Activity Alerts
                    </Label>
                    <Switch
                      id="suspiciousActivityAlerts"
                      checked={privacySettings.security.suspiciousActivityAlerts}
                      onCheckedChange={(checked) => onUpdateNested('security', 'suspiciousActivityAlerts', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Select
                      value={privacySettings.security.sessionTimeout.toString()}
                      onValueChange={(value) => onUpdateNested('security', 'sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="240">4 hours</SelectItem>
                        <SelectItem value="480">8 hours</SelectItem>
                        <SelectItem value="1440">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Data Management */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Data Management</span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Data Retention Period</Label>
                    <Select
                      value={privacySettings.dataManagement.dataRetentionPeriod.toString()}
                      onValueChange={(value) => onUpdateNested('dataManagement', 'dataRetentionPeriod', parseInt(value))}
                    >
                      <SelectTrigger className="bg-white dark:bg-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {retentionOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoDeleteInactive" className="text-sm">Auto-delete inactive accounts</Label>
                    <Switch
                      id="autoDeleteInactive"
                      checked={privacySettings.dataManagement.autoDeleteInactive}
                      onCheckedChange={(checked) => onUpdateNested('dataManagement', 'autoDeleteInactive', checked)}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDataExport(!showDataExport)}
                    className="w-full justify-start"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Privacy Settings
                  </Button>

                  {showDataExport && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                    >
                      <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                        Export your privacy settings and data for backup or migration.
                      </p>
                      <Button onClick={handleExportData} size="sm">
                        Download Export
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Emergency Contact */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <AlertTriangle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-300">Emergency Contact</span>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={privacySettings.emergency.emergencyContact}
                      onChange={(e) => onUpdateNested('emergency', 'emergencyContact', e.target.value)}
                      placeholder="Full name"
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                    <Input
                      id="emergencyPhone"
                      value={privacySettings.emergency.emergencyPhone}
                      onChange={(e) => onUpdateNested('emergency', 'emergencyPhone', e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-white dark:bg-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyEmail">Emergency Email</Label>
                  <Input
                    id="emergencyEmail"
                    type="email"
                    value={privacySettings.emergency.emergencyEmail}
                    onChange={(e) => onUpdateNested('emergency', 'emergencyEmail', e.target.value)}
                    placeholder="emergency@example.com"
                    className="bg-white dark:bg-slate-700"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowEmergencyAccess" className="text-sm">Allow emergency access to account</Label>
                  <Switch
                    id="allowEmergencyAccess"
                    checked={privacySettings.emergency.allowEmergencyAccess}
                    onCheckedChange={(checked) => onUpdateNested('emergency', 'allowEmergencyAccess', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Account Deletion */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 mb-3"
                >
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-red-700 dark:text-red-300">Account Management</span>
                </motion.div>

                <Alert className="border-red-200 dark:border-red-800">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    Account deletion is permanent and cannot be undone. All your data will be permanently removed.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteAccount(!showDeleteAccount)}
                    className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Request Account Deletion
                  </Button>

                  {showDeleteAccount && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                        This will permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <div className="flex gap-2">
                        <Button onClick={handleDeleteAccount} size="sm" variant="destructive">
                          Confirm Deletion
                        </Button>
                        <Button onClick={() => setShowDeleteAccount(false)} size="sm" variant="outline">
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Current Settings Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30"
          >
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-3">Current Settings Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600 dark:text-slate-400">Profile Visibility:</span>
                <Badge className="ml-2" variant={privacySettings.profileVisibility === 'public' ? 'default' : 'secondary'}>
                  {privacySettings.profileVisibility.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">2FA Status:</span>
                <Badge className="ml-2" variant={privacySettings.security.twoFactorEnabled ? 'default' : 'secondary'}>
                  {privacySettings.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Activity Tracking:</span>
                <Badge className="ml-2" variant={privacySettings.activityTracking.trackLearningProgress ? 'default' : 'secondary'}>
                  {privacySettings.activityTracking.trackLearningProgress ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div>
                <span className="text-slate-600 dark:text-slate-400">Notifications:</span>
                <Badge className="ml-2" variant={privacySettings.communicationPreferences.emailNotifications ? 'default' : 'secondary'}>
                  {privacySettings.communicationPreferences.emailNotifications ? 'Enabled' : 'Disabled'}
                </Badge>
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
                  Saving Privacy Settings...
                </>
              ) : (
                <>
                  Save Privacy Settings
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </div>
    </motion.div>
  );
};

export default EditPrivacySettings;
