import * as React from "react";
import {
  BookOpen,
  Bot,
  Brain,
  FileText,
  PenTool,
  BookMarked,
  MessageSquare,
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
  const { state: sidebarState, openMobile } = useSidebar();
  const isCollapsed = sidebarState === "collapsed";

  // On mobile the sidebar may be presented as a Sheet (openMobile=true).
  // Treat the mobile sheet as an expanded sidebar for rendering purposes.
  const showFull = !isCollapsed || Boolean(openMobile);

  // Theme is handled at layout-level; sidebar only renders profile and nav

  // Profile dropdown hover/click state (hover opens on pointer devices)
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  // When user clicks the profile trigger, pin the menu open until explicitly closed
  const [profileMenuPinned, setProfileMenuPinned] = React.useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const getInitials = (nameOrEmail?: string) => {
    if (!nameOrEmail) return 'US';
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Defer heavy view changes to idle time to avoid blocking pointer path
  const scheduleViewChange = React.useCallback((id: string) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // requestIdleCallback typing may be missing in some TS configs; cast to unknown then to function
      const ric = (window as unknown as { requestIdleCallback?: (fn: () => void, opts?: { timeout?: number }) => void }).requestIdleCallback;
      if (ric) ric(() => onViewChange(id), { timeout: 200 });
    } else {
      // Fallback for environments without requestIdleCallback
      setTimeout(() => onViewChange(id), 120);
    }
  }, [onViewChange]);

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
            { title: "AI Practice", id: "ai-practice", icon: MessageSquare, isActive: activeView === "ai-practice" },
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
      // On small screens the sidebar becomes an off-canvas panel; on sm+ it is static
      className={cn(
        "border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50",
        // layout + motion handling
        "transform will-change-transform motion-reduce:transition-none motion-safe:transition-transform motion-safe:duration-200",
        // fixed overlay behavior on small screens; if collapsed, hide off-canvas
        isCollapsed ? "-translate-x-full sm:translate-x-0" : "translate-x-0",
        // make it overlay on mobile
        "sm:static fixed sm:z-auto z-40 top-0 left-0 h-full w-64 sm:w-auto"
      )}
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 p-4 h-16 flex items-center">
        <div className="flex items-center justify-between gap-3 w-full overflow-hidden">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white truncate">
            <div className="min-w-[2rem] flex items-center justify-center">
              <Logo size={showFull ? 'xl' : 'sm'} sidebarState={showFull ? 'expanded' : 'collapsed'} className={showFull ? 'w-10 h-10' : 'w-8 h-8'} />
            </div>
            {/* Show brand text when sidebar is expanded or mobile sheet is open */}
            {showFull && <span className="truncate">CognitoSpeak</span>}
          </div>
          
          {/* Theme toggle is provided in the header layout (NewDashboardLayout) */}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
            {/* Main Nav */}
            <div className="space-y-1 mb-6">
            {data.navMain.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    onClick={() => scheduleViewChange(item.id)}
                    className={cn(
                      "flex items-center w-full rounded-xl px-3 text-sm font-medium transition-colors",
                      // larger tap area on mobile
                      "py-3 sm:py-2.5",
                      isCollapsed ? "justify-center" : "justify-start gap-3",
                      item.isActive
                        ? "bg-emerald-500 text-white shadow-sm sm:shadow-md shadow-emerald-500/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", item.isActive ? "text-white" : "")} />
                    {showFull && <span className="inline">{item.title}</span>}
                  </button>
                );
              })}
            </div>

            {/* Secondary Sections */}
            {data.navSecondary.map((section) => (
              <div key={section.title} className="mb-6">
                {showFull && (
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
                        onClick={() => scheduleViewChange(item.id)}
                        className={cn(
                          "relative flex items-center w-full rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                          isCollapsed ? "justify-center" : "justify-start gap-3",
                          item.isActive
                            ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        <Icon className={cn("h-4 w-4 shrink-0", item.isActive ? "text-emerald-500" : "")} />
                        {showFull && (
                          <>
                            <span className="flex-1 text-left truncate">{item.title}</span>
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className={cn(
                                  "text-[10px] px-1.5 py-0 h-5 inline-flex",
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

      <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-3 bg-white/50 dark:bg-slate-900/50">
        {showFull ? (
          <DropdownMenu
            open={profileMenuOpen}
            onOpenChange={(open) => {
              setProfileMenuOpen(open);
              // If closed via outside click or esc, remove pinned state
              if (!open) setProfileMenuPinned(false);
            }}
          >
            <DropdownMenuTrigger asChild>
              <button
                onMouseEnter={() => { if (window.matchMedia('(pointer: fine)').matches && !profileMenuPinned) setProfileMenuOpen(true); }}
                onMouseLeave={() => { if (window.matchMedia('(pointer: fine)').matches && !profileMenuPinned) setProfileMenuOpen(false); }}
                onClick={() => {
                  // Toggle and pin when opened by click so it remains open until user closes
                  setProfileMenuOpen((v) => {
                    const next = !v;
                    setProfileMenuPinned(next);
                    return next;
                  });
                }}
                className={cn(
                  "flex items-center gap-3 w-full rounded-xl px-2",
                  "py-3 sm:py-2",
                  "hover:bg-white dark:hover:bg-slate-800 transition-colors motion-reduce:transition-none",
                  "border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm sm:hover:shadow-sm"
                )}
                aria-expanded={profileMenuOpen}
              >
                <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm">
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
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { setProfileMenuOpen(false); scheduleViewChange('profile'); }}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setProfileMenuOpen(false); scheduleViewChange('edit-profile'); }}><Edit3 className="mr-2 h-4 w-4" /> Edit Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setProfileMenuOpen(false); scheduleViewChange('settings'); }}><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex justify-center">
             <button
               onClick={() => setProfileMenuOpen((v) => { const next = !v; setProfileMenuPinned(next); return next; })}
               onMouseEnter={() => { if (window.matchMedia('(pointer: fine)').matches && !profileMenuPinned) setProfileMenuOpen(true); }}
               onMouseLeave={() => { if (window.matchMedia('(pointer: fine)').matches && !profileMenuPinned) setProfileMenuOpen(false); }}
               className="relative p-2 sm:p-0"
             >
               <Avatar className="h-9 w-9 border-2 border-white dark:border-slate-800 shadow-sm cursor-pointer hover:scale-105 transition-transform">
                 <AvatarImage src={user?.avatar} />
                 <AvatarFallback className="bg-emerald-100 text-emerald-700">{getInitials(user?.fullName || user?.email)}</AvatarFallback>
               </Avatar>
               {/* small accessible toggle indicator */}
               <span className="sr-only">Open profile menu</span>
             </button>
             {/* Small popup for collapsed mode on mobile - reuse DropdownMenuContent visually via absolute element if desired (kept simple here) */}
          </div>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}