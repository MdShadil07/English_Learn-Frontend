import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
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
  Edit3,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  Calendar,
} from 'lucide-react';
import { PremiumPlanIcon, BasicPlanIcon, FreePlanIcon } from '../Icons';

interface User {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string; // Updated to match auth controller response
  isPremium?: boolean;
  subscriptionStatus?: 'none' | 'free' | 'basic' | 'premium' | 'pro';
  role?: 'student' | 'teacher' | 'admin';
}

interface BasicHeaderProps {
  user?: User | null;
  onLogout?: () => void;
  onSidebarToggle?: (open: boolean) => void;
  showSidebarToggle?: boolean;
  sidebarOpen?: boolean;
  className?: string;
  title?: string;
  subtitle?: string;
}

const BasicHeader: React.FC<BasicHeaderProps> = ({
  user = null,
  onLogout = () => {},
  onSidebarToggle,
  showSidebarToggle = false,
  sidebarOpen = false,
  className = '',
  title = 'CognitoSpeak',
  subtitle = 'AI Learning Platform',
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    onLogout();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out',
    });
  };

  return (
    <>
      {/* Modern Dashboard-style Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-emerald-200/50 dark:border-emerald-800/30 shadow-sm ${className}`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Sidebar toggle and logo */}
            <div className="flex items-center gap-4">
              {showSidebarToggle && (
                <motion.div
                  whileHover={{ scale: 1.05, width: 'auto' }}
                  whileTap={{ scale: 0.95 }}
                  className="transition-all duration-300 hover:rounded-2xl"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 hover:shadow-lg hover:rounded-2xl border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
                    onClick={() => {
                      onSidebarToggle?.(!sidebarOpen);
                    }}
                  >
                    {sidebarOpen ? (
                      <X className="h-6 w-6" />
                    ) : (
                      <Menu className="h-6 w-6" />
                    )}
                  </Button>
                </motion.div>
              )}

              {/* Logo/Brand */}
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="relative">
                  <img
                    src="/logo.svg"
                    alt="CognitoSpeak Logo"
                    className="w-10 h-10 transition-all duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 w-10 h-10 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-lg opacity-0 hover:opacity-100 transition-all duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-emerald-800 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent tracking-tight">
                    {title}
                  </span>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium opacity-80">
                    {subtitle}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Center - Search Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <Input
                  placeholder="Search lessons, words, notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 focus:bg-background focus:border-emerald-300 rounded-xl"
                />
              </div>
            </div>

            {/* Right side - Actions and User profile */}
            <div className="flex items-center gap-2">
              {/* Action buttons */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:shadow-md hover:rounded-2xl relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:shadow-md hover:rounded-2xl"
              >
                <Calendar className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-300 hover:shadow-md hover:rounded-2xl"
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all duration-200 rounded-xl ml-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg border border-emerald-200/30">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'
                      )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {user?.fullName || user?.email?.split('@')[0] || 'User'}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">
                          {user?.role === 'teacher' ? 'Teacher' :
                           user?.role === 'admin' ? 'Admin' :
                           user?.role === 'student' ? 'Student' : 'Student'}
                        </span>
                        {user?.subscriptionStatus === 'premium' && <PremiumPlanIcon size="sm" className="flex-shrink-0" />}
                        {user?.subscriptionStatus === 'basic' && <BasicPlanIcon size="sm" className="flex-shrink-0" />}
                        {user?.subscriptionStatus === 'pro' && <span className="text-xs">⭐</span>}
                        {user?.subscriptionStatus === 'free' && <FreePlanIcon size="sm" className="flex-shrink-0" />}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-emerald-200/50 dark:border-emerald-800/50">
                  <DropdownMenuLabel className="text-slate-900 dark:text-slate-100">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-emerald-200/50 dark:bg-emerald-800/50" />
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300">
                    <UserIcon className="h-4 w-4 mr-2 text-emerald-600" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/edit-profile')} className="hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300">
                    <Edit3 className="h-4 w-4 mr-2 text-emerald-600" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-300">
                    <Settings className="h-4 w-4 mr-2 text-emerald-600" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-emerald-200/50 dark:bg-emerald-800/50" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default BasicHeader;
