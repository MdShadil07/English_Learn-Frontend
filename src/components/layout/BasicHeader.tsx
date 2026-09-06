import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User as UserIcon,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Calendar,
  BadgeCheck,
  Moon,
  Sun,
  LayoutDashboard,
} from 'lucide-react';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon, ProPlanIcon } from '../Icons';
import { NotificationDropdown } from './NotificationDropdown';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  isPremium?: boolean;
  isVerified?: boolean;
  tier?: 'free' | 'pro' | 'premium';
  subscriptionStatus?: 'none' | 'free' | 'basic' | 'premium' | 'pro';
  role?: 'student' | 'teacher' | 'admin';
}

interface BasicHeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onSidebarToggle?: (open: boolean) => void;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  leftAccessory?: React.ReactNode; // Useful for passing generic dashboard sidebar triggers
  className?: string;
  title?: string;
  subtitle?: string;
  hideLogo?: boolean;
}

const BasicHeader: React.FC<BasicHeaderProps> = ({
  user = null,
  onLogout,
  onSidebarToggle,
  showSidebarToggle = false,
  sidebarOpen = false,
  leftAccessory,
  className = '',
  title = 'CognitoSpeak',
  hideLogo = false,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const { signOut } = useAuth();

  // Determine positioning classes. If the caller provides positioning like 'sticky', we omit the default 'fixed top-0 left-0 right-0'
  const isCustomPositioning = className.includes('sticky') || className.includes('absolute') || className.includes('relative');
  const positionClasses = isCustomPositioning ? '' : 'fixed top-0 left-0 right-0';

  const handleLogout = async () => {
    try {
      onLogout?.();
      await signOut();
      navigate('/login');
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out',
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: 'Logout Failed',
        description: 'There was an error signing you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className={`${positionClasses} z-40 bg-white/70 dark:bg-[#050C14]/80 backdrop-blur-2xl saturate-[1.2] border-b border-slate-200/50 dark:border-emerald-500/10 transition-colors duration-300 overflow-hidden ${className}`}>
      {/* Noise Texture Overlay for Holographic Feel */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay z-0"></div>
      
      <div className="w-full px-4 sm:px-6 relative z-10">
        <div className="flex items-center justify-between h-16">
          
          {/* Left side - Sidebar toggle, Accessory, and logo */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            {leftAccessory}
            
            {showSidebarToggle && !leftAccessory && (
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-emerald-500/10 rounded-full transition-colors"
                onClick={() => onSidebarToggle?.(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}

            {!hideLogo && (
              <motion.div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img
                  src="/logo.svg"
                  alt="CognitoSpeak Logo"
                  className="w-8 h-8"
                />
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                    {title}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Center - Clean Search Bar */}
          <div className="flex-1 max-w-xl mx-4 sm:mx-8 hidden sm:flex items-center justify-center">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 h-10 bg-black/[0.04] dark:bg-white/[0.04] border-transparent hover:bg-black/[0.06] dark:hover:bg-white/[0.06] focus:bg-white dark:focus:bg-[#050C14] focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 rounded-full text-sm transition-all shadow-none placeholder:text-slate-500 dark:placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>

          {/* Right side - Actions and User profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Action buttons */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-emerald-500/10 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <NotificationDropdown />

            <button
              onClick={() => navigate('/settings')}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-black/5 dark:hover:bg-emerald-500/10 transition-colors hidden xs:block"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 py-1.5 hover:bg-black/5 dark:hover:bg-emerald-500/10 transition-colors rounded-full ml-1 h-auto">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex-shrink-0 shadow-sm border border-emerald-200 dark:border-emerald-500/30 overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                    )}
                  </div>
                  <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block mr-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-white/80 dark:bg-[#050C14]/90 backdrop-blur-3xl saturate-[1.2] border border-black/5 dark:border-emerald-500/20 rounded-2xl shadow-[0_16px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.6)]">
                <div className="px-2 py-3 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {user?.fullName || user?.email?.split('@')[0] || 'User'}
                    </span>
                    {user?.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                      {user?.role || 'Student'}
                    </span>
                    <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                    {user?.tier === 'premium' && (
                      <div className="flex items-center gap-1">
                        <PremiumPlanIcon size="sm" className="text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Premium</span>
                      </div>
                    )}
                    {user?.tier === 'pro' && (
                      <div className="flex items-center gap-1">
                        <ProPlanIcon size="sm" className="text-blue-500" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Pro</span>
                      </div>
                    )}
                    {(!user?.tier || user?.tier === 'free') && (
                      <div className="flex items-center gap-1">
                        <FreePlanIcon size="sm" className="text-slate-400" />
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Free</span>
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-black/5 dark:bg-emerald-500/10 my-1" />
                
                <div className="p-1 space-y-0.5">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} className="rounded-xl cursor-pointer focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-500/10 dark:focus:text-blue-300 outline-none transition-colors group">
                    <LayoutDashboard className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="rounded-xl cursor-pointer focus:bg-emerald-50 focus:text-emerald-700 dark:focus:bg-emerald-500/10 dark:focus:text-emerald-300 outline-none transition-colors group">
                    <UserIcon className="h-4 w-4 mr-2 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Your Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="rounded-xl cursor-pointer focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-slate-800 dark:focus:text-white outline-none transition-colors group">
                    <Settings className="h-4 w-4 mr-2 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">Settings</span>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator className="bg-black/5 dark:bg-emerald-500/10 my-1" />
                
                <div className="p-1">
                  <DropdownMenuItem onClick={handleLogout} className="rounded-xl cursor-pointer text-rose-600 focus:bg-rose-50 focus:text-rose-700 dark:text-rose-400 dark:focus:bg-rose-500/10 dark:focus:text-rose-300 transition-colors group">
                    <LogOut className="h-4 w-4 mr-2 text-rose-500 dark:text-rose-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BasicHeader;
