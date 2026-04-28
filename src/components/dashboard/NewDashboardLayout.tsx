import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Calendar, Settings } from 'lucide-react';
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

interface NewDashboardLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const NewDashboardLayout = ({ children, activeView, onViewChange }: NewDashboardLayoutProps) => {
  const { user } = useAuth();
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
        <SidebarInset className="flex-1 min-w-0 flex flex-col relative overflow-hidden bg-white dark:bg-slate-950">
        {/* Top Navigation Bar */}
        <header className="h-16 w-full border-b border-emerald-200/50 dark:border-emerald-800/30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center gap-2 sm:gap-4 px-3 sm:px-6 sticky top-0 z-40 shadow-sm shrink-0">
          <div className="flex-shrink-0">
            <SidebarTrigger className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 hover:shadow-md h-9 w-9" />
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <div className="relative w-full max-w-[120px] xs:max-w-[200px] sm:max-w-md transition-all duration-300">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 sm:pl-9 h-9 sm:h-10 text-xs sm:text-sm bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 focus:bg-background focus:border-emerald-300 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* User greeting and role */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-emerald-200 dark:border-emerald-800 shadow-sm">
                  <AvatarImage src={user?.avatar} alt={user?.fullName || 'User'} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold">
                    {user?.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                    {user?.fullName || 'User'}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {user?.role === 'teacher' ? 'Teacher' :
                       user?.role === 'admin' ? 'Admin' :
                       user?.role === 'student' ? 'Student' : 'Student'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button className="p-1.5 sm:p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 relative transition-all duration-200 hover:shadow-sm">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </button>
              
              <button className="p-1.5 sm:p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 hover:shadow-sm hidden xs:flex">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              <button className="p-1.5 sm:p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 hover:shadow-sm">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30 dark:from-emerald-950/10 dark:via-slate-950 dark:to-teal-950/10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`h-full ${activeView === 'rooms' || activeView === 'voice-rooms' ? 'p-0' : 'p-3 sm:p-6'}`}
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
