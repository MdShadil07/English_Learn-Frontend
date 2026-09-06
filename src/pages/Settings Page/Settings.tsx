import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import BasicHeader from '@/components/layout/BasicHeader';
import Footer from '@/components/layout/Footer';
import { Card } from '@/components/ui/card';
import {
  User,
  Settings as SettingsIcon,
  Bell,
  Shield,
  Briefcase,
  Target,
  Palette,
  Volume2,
  CreditCard
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { queryKeys } from '@/utils/queryKeys';
import { resolveUserTier, mapTierToStatus } from '@/utils/tierUtils';

// Lazy load tab components
import ProfileTab from './tabs/ProfileTab';
import AccountTab from './tabs/AccountTab';
import ProfessionalTab from './tabs/ProfessionalTab';
import PrivacySecurityTab from './tabs/PrivacySecurityTab';
import PreferencesTab from './tabs/PreferencesTab';
import AppearanceTab from './tabs/AppearanceTab';
import NotificationsTab from './tabs/NotificationsTab';
import AudioMediaTab from './tabs/AudioMediaTab';
import SubscriptionTab from './tabs/SubscriptionTab';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Pre-fetch profile data at the layout level
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: queryKeys.profile.get(),
    queryFn: async () => {
      const response = await api.profile.get();
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch profile');
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const sidebarLinks = [
    {
      id: 'profile',
      path: '/settings/profile',
      label: 'Public Profile',
      icon: User
    },
    {
      id: 'account',
      path: '/settings/account',
      label: 'Account Details',
      icon: SettingsIcon
    },
    {
      id: 'professional',
      path: '/settings/professional',
      label: 'Professional & Education',
      icon: Briefcase
    },
    {
      id: 'preferences',
      path: '/settings/preferences',
      label: 'Learning Preferences',
      icon: Target
    },
    {
      id: 'security',
      path: '/settings/security',
      label: 'Privacy & Security',
      icon: Shield
    },
    {
      id: 'appearance',
      path: '/settings/appearance',
      label: 'Appearance',
      icon: Palette
    },
    {
      id: 'audio',
      path: '/settings/audio',
      label: 'Audio & Media',
      icon: Volume2
    },
    {
      id: 'notifications',
      path: '/settings/notifications',
      label: 'Notifications',
      icon: Bell
    },
    {
      id: 'subscription',
      path: '/settings/subscription',
      label: 'Pricing & Plans',
      icon: CreditCard
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050C14] transition-colors duration-200">
      <BasicHeader
        user={{
          id: user?.id || '1',
          email: user?.email || 'admin@example.com',
          fullName: user?.fullName || 'User',
          role: (user?.role as 'student' | 'teacher' | 'admin') || 'student',
          isPremium: resolveUserTier(user) === 'premium',
          subscriptionStatus: mapTierToStatus(resolveUserTier(user)) as any,
          tier: resolveUserTier(user),
          avatar: user?.avatar
        }}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24">
              <h2 className="text-2xl font-black uppercase tracking-widest mb-6 text-slate-900 dark:text-white px-2">Settings</h2>
              <nav className="flex flex-col space-y-1">
                {sidebarLinks.map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.id}
                      to={link.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm
                        ${isActive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-emerald-500/5 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                      <link.icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400 dark:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-slate-400 dark:text-slate-500'}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {isProfileLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 dark:border-emerald-500"></div>
              </div>
            ) : profileError ? (
              <Card className="p-8 text-center text-red-400 bg-red-500/10 border-red-500/20 backdrop-blur-md">
                Failed to load profile data. Please refresh.
              </Card>
            ) : (
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="pb-24"
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/settings/profile" replace />} />
                  <Route path="/profile" element={<ProfileTab profileData={profileData} />} />
                  <Route path="/account" element={<AccountTab profileData={profileData} />} />
                  <Route path="/professional" element={<ProfessionalTab profileData={profileData} />} />
                  <Route path="/preferences" element={<PreferencesTab profileData={profileData} />} />
                  <Route path="/security" element={<PrivacySecurityTab profileData={profileData} />} />
                  <Route path="/appearance" element={<AppearanceTab />} />
                  <Route path="/audio" element={<AudioMediaTab />} />
                  <Route path="/notifications" element={<NotificationsTab profileData={profileData} />} />
                  <Route path="/subscription" element={<SubscriptionTab />} />
                </Routes>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer variant="landing" showNewsletter={false} />
    </div>
  );
};

export default SettingsPage;
