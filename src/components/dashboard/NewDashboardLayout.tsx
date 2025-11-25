import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Calendar, Sun, Moon } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    try { localStorage.setItem('theme', theme); } catch (err) { void err; }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

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
    // Start sidebar collapsed by default; hover over the rail will reveal labels (handled in AppSidebar)
    <SidebarProvider defaultOpen={false}>
      <AppSidebar activeView={activeView} onViewChange={onViewChange} userStats={userStats} />
      <SidebarInset>
        {/* Top Navigation Bar */}
        <header className="h-16 border-b border-emerald-200/50 dark:border-emerald-800/30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center gap-4 px-6 sticky top-0 z-40 shadow-sm">
          <div className="transition-transform duration-200 hover:rounded-2xl">
            <SidebarTrigger className="text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 hover:shadow-md hover:rounded-2xl" />
          </div>
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lessons, words, notes..."
                className="pl-9 h-10 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 focus:bg-background focus:border-emerald-300"
              />
            </div>
          </div>

          {/* User info and actions */}
          <div className="flex items-center gap-3">
            {/* User greeting and role */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  {user?.fullName || 'User'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {user?.role === 'teacher' ? 'Teacher' :
                   user?.role === 'admin' ? 'Admin' :
                   user?.role === 'student' ? 'Student' : 'Student'}
                </span>
              </div>
            </div>

            {/* Right side actions */}
              <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 relative transition-transform duration-200 hover:shadow-md hover:rounded-2xl w-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </button>

              <button className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-transform duration-200 hover:shadow-md hover:rounded-2xl w-full">
                <Calendar className="h-5 w-5" />
              </button>

              <button
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-transform duration-200 hover:shadow-md hover:rounded-2xl w-full"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-500" />}
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
              className="h-full p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default NewDashboardLayout;
