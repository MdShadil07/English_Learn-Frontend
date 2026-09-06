import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Calendar, Settings, Sun, Moon } from 'lucide-react';

import { useTheme } from 'next-themes';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '../ui/sidebar';
// Or, if the sidebar components are in a different relative path, adjust accordingly:
// import { SidebarProvider, SidebarInset, SidebarTrigger } from '../../ui/sidebar';
// Update the path below to the correct relative location of app-sidebar.tsx
import { AppSidebar } from '../ui/sidebar/app-sidebar';
// Or, if the file is in a different location, adjust accordingly, for example:
// import { AppSidebar } from '../../ui/sidebar/app-sidebar';
// Update the path below to the correct relative location of AuthContext
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import BasicHeader from '../layout/BasicHeader';

interface NewDashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const NewDashboardLayout = ({ children, activeView, onViewChange }: NewDashboardLayoutProps) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [userStats, setUserStats] = useState({ streak: 12, coins: 240, level: 15 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('correction_coins, current_streak, longest_streak')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setUserStats({
          streak: profile.current_streak || 12,
          coins: profile.correction_coins || 240,
          level: 15 // Calculate based on XP or other metrics
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="fixed inset-0 flex h-screen w-screen overflow-hidden bg-background">
        <AppSidebar activeView={activeView} onViewChange={onViewChange} userStats={userStats} />
        <SidebarInset className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-white dark:bg-[#050C14] transition-[width,margin] duration-200 ease-out">
        {/* Unified Top Navigation Bar */}
        <BasicHeader 
          user={user as any} 
          className="sticky top-0 z-40"
          hideLogo={true}
          leftAccessory={
            <div className="flex-shrink-0">
              <SidebarTrigger className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-sm h-9 w-9 rounded-full" />
            </div>
          }
        />

        {/* Page Content */}
        <main className={`flex-1 bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30 dark:bg-none dark:bg-[#050C14] ${activeView === 'ai-chat' || activeView === 'ai-tutor' ? 'overflow-hidden' : 'overflow-auto'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`h-full min-h-0 ${activeView === 'rooms' || activeView === 'voice-rooms' || activeView === 'ai-chat' || activeView === 'ai-tutor' ? 'p-0' : 'p-3 sm:p-6'}`}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NewDashboardLayout;
