import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Bot,
  Brain,
  FileText,
  PenTool,
  BookMarked,
  Volume2,
  Users,
  Focus,
  StickyNote,
  Globe,
  GraduationCap,
  Headphones,
  Mic,
  Video,
  Home,
  BarChart3,
  Trophy,
  Flame,
  Sun,
  Moon,
  Settings,
  User,
  LogOut,
  Edit3,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Logo } from '@/components/Icons/Logo';
import { useAuth } from '@/contexts';
// Assuming standard shadcn/ui sidebar structure
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

// Use real AuthContext (falls back to cached data inside provider)

export function AppSidebar({
  activeView,
  onViewChange,
  userStats,
  ...props
}) {
  const { user, signOut } = useAuth();
  const { state: sidebarState, isMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed" && !isMobile;
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleNavigation = (viewId: string) => {
    if (viewId === "pronunciation") {
      navigate("/pronunciation");
    } else {
      navigate(`/dashboard?view=${viewId}`);
    }
    onViewChange(viewId);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (nameOrEmail?: string) => {
    if (!nameOrEmail) return 'US';
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Navigation data structure
  const data = React.useMemo(
    () => ({
      teams: [
        {
          name: "CognitoSpeak",
          plan: "AI-Powered Learning",
        },
      ],
      navMain: [
        {
          title: "Dashboard",
          url: "#",
          icon: Home,
          id: "home",
          isActive: activeView === "home",
        },
        {
          title: "Analytics",
          url: "#",
          icon: BarChart3,
          id: "analytics",
          isActive: activeView === "analytics",
        },
      ],
      navSecondary: [
        {
          title: "Core Learning",
          items: [
            { title: "Grammar", id: "grammar", icon: BookOpen, isActive: activeView === "grammar" },
            { title: "Vocabulary", id: "vocabulary", icon: Brain, isActive: activeView === "vocabulary" },
            { title: "Writing", id: "writing", icon: PenTool, isActive: activeView === "writing" },
            { title: "Reading", id: "reading", icon: FileText, isActive: activeView === "reading" },
            { title: "Speaking", id: "speaking", icon: Mic, isActive: activeView === "speaking" },
          ],
        },
        {
          title: "AI-Powered",
          items: [
            { title: "AI Chat", id: "ai-chat", icon: Bot, badge: "New", isActive: activeView === "ai-chat" },
            { title: "Pronunciation", id: "pronunciation", icon: Volume2, isActive: activeView === "pronunciation" },
            { title: "AI Tutor", id: "ai-tutor", icon: GraduationCap, badge: "Pro", isActive: activeView === "ai-tutor" },
          ],
        },
        {
          title: "Practice & Community",
          items: [
            { title: "Practice Rooms", id: "rooms", icon: Users, badge: "Live", isActive: activeView === "rooms" },
            { title: "Voice Rooms", id: "voice-rooms", icon: Video, isActive: activeView === "voice-rooms" },
            { title: "Community", id: "community", icon: Globe, isActive: activeView === "community" },
          ],
        },
        {
          title: "Tools",
          items: [
            { title: "My Notes", id: "notes", icon: StickyNote, isActive: activeView === "notes" },
            { title: "Focus Mode", id: "focus", icon: Focus, isActive: activeView === "focus" },
            { title: "Bookmarks", id: "bookmarks", icon: BookMarked, isActive: activeView === "bookmarks" },
          ],
        },
      ],
    }),
    [activeView]
  );

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-slate-200 dark:border-emerald-500/20 bg-slate-50/80 dark:bg-[#050C14] backdrop-blur-xl [&_[data-sidebar=sidebar]]:bg-transparent"
      {...props}
    >
      {/* Background Glow Orbs for Analytics Theme Match */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[150%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[150%] h-[30%] bg-teal-500/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 dark:border-emerald-500/10 p-4 h-16 flex items-center relative z-20">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between gap-3 w-full overflow-hidden relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:opacity-80 transition-opacity group"
            type="button"
          >
            <div className="relative flex items-center justify-center shrink-0 w-7 h-7">
              <img
                src="/logo.svg"
                alt="CognitoSpeak Logo"
                className="w-6 h-6 object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
            </div>
            {!isCollapsed && (
              <div className="text-left min-w-0">
                <span className="text-lg font-bold bg-gradient-to-r from-slate-900 to-emerald-800 dark:from-white dark:to-emerald-400 bg-clip-text text-transparent tracking-tight block leading-tight">
                  CognitoSpeak
                </span>
                <p className="hidden sm:block text-[11px] text-emerald-600 dark:text-emerald-400 font-medium opacity-80 leading-tight">
                  AI Learning Platform
                </p>
              </div>
            )}
          </button>
          
          {!isCollapsed && (
            <button
              aria-label="Toggle theme"
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-500" />
              )}
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {/* Main Nav */}
            <div className="space-y-1 mb-6">
              {data.navMain.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => handleNavigation(item.id)}
                    className={cn(
                      "relative flex items-center w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 z-10",
                      isCollapsed ? "justify-center" : "justify-start gap-3",
                      item.isActive
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-500/30 dark:shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-emerald-500/10 hover:text-slate-900 dark:hover:text-emerald-300 border border-transparent dark:hover:border-emerald-500/30"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", item.isActive ? "text-white" : "")} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </button>
                );
              })}
            </div>

            {/* Secondary Sections */}
            {data.navSecondary.map((section) => (
              <div key={section.title} className="mb-6">
                {!isCollapsed && (
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                    {section.title}
                  </h4>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.title}
                        onClick={() => handleNavigation(item.id)}
                        className={cn(
                          "relative flex items-center w-full rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 z-10",
                          isCollapsed ? "justify-center" : "justify-start gap-3",
                          item.isActive
                            ? "bg-white dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-emerald-500/30 dark:shadow-[inset_0_0_15px_rgba(16,185,129,0.1)]"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-emerald-500/10 border border-transparent dark:hover:border-emerald-500/30"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110", item.isActive ? "text-emerald-500 dark:text-emerald-400" : "")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left truncate text-xs sm:text-sm">{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-4 sm:h-5",
                                  item.badge === "New" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                                  item.badge === "Live" && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
                                  item.badge === "Pro" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-200 dark:border-emerald-500/10 p-3 bg-white/50 dark:bg-transparent relative z-50 backdrop-blur-xl">
        {!isCollapsed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center gap-3 w-full rounded-xl px-2 py-2 hover:bg-slate-100 dark:hover:bg-emerald-500/10 transition-all border border-transparent hover:border-slate-200 dark:hover:border-emerald-500/30 hover:shadow-sm cursor-pointer"
                type="button"
              >
                <Avatar className="h-9 w-9 border-2 border-white dark:border-emerald-500/20 shadow-sm">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">{getInitials(user?.fullName || user?.email)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user?.fullName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="top"
              sideOffset={8}
              className="w-56 z-[100]"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex justify-center w-full cursor-pointer" type="button">
                <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">{getInitials(user?.fullName || user?.email)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              side="right"
              sideOffset={12}
              className="w-48 z-[100]"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}