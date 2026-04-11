// import { Logo } from "../Icons/Logo";
// import {
//   BookOpen,
//   Home,
//   Brain,
//   FileText,
//   PenTool,
//   BookMarked,
//   Bot,
//   MessageSquare,
//   Zap,
//   Users,
//   Focus,
//   StickyNote,
//   Globe,
//   ChevronLeft,
//   ChevronRight,
//   Settings,
//   LogOut,
//   User,
//   Trophy,
//   Flame,
//   Coins,
//   GraduationCap,
//   Headphones,
//   Mic,
//   Video
// } from 'lucide-react';
// import { useIsMobile } from "../../hooks/use-mobile";
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { cn } from '../../lib/utils';
// import { Button } from '../ui/button';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Badge } from '../ui/badge';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
// import { useAuth, User as AuthUser } from '../../contexts/AuthContext';
// import { useToast } from '../../hooks/use-toast';

// interface SidebarProps {
//   activeView: string;
//   onViewChange: (view: string) => void;
//   userStats?: {
//     streak: number;
//     coins: number;
//     level: number;
//   };
// }

// interface NavItem {
//   id: string;
//   label: string;
//   icon: React.ElementType;
//   badge?: { text: string; variant?: 'default' | 'success' | 'warning' | 'destructive' };
//   isNew?: boolean;
// }

// interface NavSection {
//   title: string;
//   items: NavItem[];
// }

// const NewDashboardSidebar = ({ activeView, onViewChange, userStats }: SidebarProps) => {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const isMobile = useIsMobile();

//   // Navigation sections organized by category
//   const navSections: NavSection[] = [
//     {
//       title: 'Main',
//       items: [
//         { id: 'home', label: 'Dashboard', icon: Home },
//         { id: 'analytics', label: 'Analytics', icon: Trophy },
//       ]
//     },
//     {
//       title: 'Core Learning',
//       items: [
//         { id: 'grammar', label: 'Grammar', icon: BookOpen },
//         { id: 'vocabulary', label: 'Vocabulary', icon: Brain },
//         { id: 'writing', label: 'Writing', icon: PenTool },
//         { id: 'reading', label: 'Reading', icon: FileText },
//         { id: 'listening', label: 'Listening', icon: Headphones },
//         { id: 'speaking', label: 'Speaking', icon: Mic },
//       ]
//     },
//     {
//       title: 'AI-Powered',
//       items: [
//         { id: 'ai-chat', label: 'AI Chat', icon: Bot, badge: { text: 'New' }, isNew: true },
//         { id: 'ai-practice', label: 'AI Practice', icon: MessageSquare },
//         { id: 'ai-tutor', label: 'AI Tutor', icon: GraduationCap, badge: { text: 'Pro' } },
//       ]
//     },
//     {
//       title: 'Practice & Community',
//       items: [
//         { id: 'rooms', label: 'Practice Rooms', icon: Users, badge: { text: 'Live', variant: 'destructive' } },
//         { id: 'voice-rooms', label: 'Voice Rooms', icon: Video },
//         { id: 'community', label: 'Community', icon: Globe },
//       ]
//     },
//     {
//       title: 'Tools',
//       items: [
//         { id: 'notes', label: 'My Notes', icon: StickyNote },
//         { id: 'focus', label: 'Focus Mode', icon: Focus },
//         { id: 'bookmarks', label: 'Bookmarks', icon: BookMarked },
//       ]
//     }
//   ];

//   const handleLogout = async () => {
//     try {
//       await signOut();
//       toast({
//         title: 'Signed out',
//         description: 'You have been successfully signed out',
//       });
//       navigate('/');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       toast({
//         title: 'Error',
//         description: 'There was an error signing out. Please try again.',
//         variant: 'destructive',
//       });
//     }
//   };

//   const NavItemComponent = React.memo(({ item, collapsed }: { item: NavItem; collapsed: boolean }) => {
//     const isActive = activeView === item.id;

//     const button = (
//       <div className="relative group">
//         <Button
//           variant={isActive ? 'default' : 'ghost'}
//           className={cn(
//             'w-full transition-all duration-300 relative rounded-2xl',
//             collapsed ? 'justify-center px-2 py-3' : 'justify-start px-4 py-3',
//             isActive
//               ? 'bg-gradient-to-r from-emerald-500/90 to-teal-500/80 text-white shadow-lg hover:shadow-xl hover:from-emerald-600/95 hover:to-teal-600/85 border-0'
//               : 'hover:bg-white/70 dark:hover:bg-slate-800/70 hover:text-emerald-700 dark:hover:text-emerald-300 hover:shadow-md border border-emerald-200/30 dark:border-emerald-700/30'
//           )}
//           onClick={() => onViewChange(item.id)}
//         >
//           <div className="flex items-center gap-3">
//             <div
//               className={cn(
//                 'p-2 rounded-xl transition-all duration-300',
//                 isActive
//                   ? 'bg-white/20 text-white'
//                   : 'bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-200/60 dark:group-hover:bg-emerald-800/40 group-hover:scale-110'
//               )}
//             >
//               <item.icon className="h-4 w-4" />
//             </div>
//             {!collapsed && (
//               <span className={cn(
//                 'flex-1 text-left font-medium transition-colors duration-300',
//                 isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-300'
//               )}>
//                 {item.label}
//               </span>
//             )}
//           </div>

//           {/* Active indicator */}
//           {isActive && (
//             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white/80 to-emerald-200/60 rounded-r-full" />
//           )}

//           {/* Hover glow effect */}
//           <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400/0 via-teal-400/0 to-cyan-400/0 group-hover:from-emerald-400/10 group-hover:via-teal-400/10 group-hover:to-cyan-400/10 transition-all duration-300 -z-10"></div>
//         </Button>

//         {!collapsed && item.badge && (
//           <div className="absolute -top-1 -right-1">
//             <Badge
//               variant={item.badge.variant === 'destructive' ? 'destructive' : 'default'}
//               className={cn(
//                 "text-xs px-2 py-0.5 h-5 shadow-lg border-0",
//                 item.badge.variant === 'destructive'
//                   ? 'bg-red-500/90 text-white hover:bg-red-600/90'
//                   : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
//               )}
//             >
//               {item.badge.text}
//             </Badge>
//           </div>
//         )}

//         {!collapsed && item.isNew && (
//           <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full shadow-lg" />
//         )}
//       </div>
//     );

//     if (collapsed) {
//       return (
//         <TooltipProvider delayDuration={0}>
//           <Tooltip>
//             <TooltipTrigger asChild>{button}</TooltipTrigger>
//             <TooltipContent side="right" className="font-medium bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-200/30 dark:border-emerald-700/30 shadow-lg">
//               <div className="flex items-center gap-2">
//                 {item.label}
//                 {item.badge && (
//                   <Badge
//                     variant={item.badge.variant === 'destructive' ? 'destructive' : 'default'}
//                     className="text-xs bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
//                   >
//                     {item.badge.text}
//                   </Badge>
//                 )}
//               </div>
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       );
//     }

//     return button;
//   });
//   NavItemComponent.displayName = 'NavItemComponent';

//   return (
//     <motion.aside
//       initial={false}
//       animate={{ width: isCollapsed ? '5rem' : '18rem' }}
//       transition={{ duration: 0.3, ease: 'easeInOut' }}
//       className="fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r border-emerald-200/30 dark:border-emerald-700/30 bg-gradient-to-b from-white/90 via-emerald-50/50 to-teal-50/80 dark:from-slate-900/90 dark:via-emerald-900/30 dark:to-teal-900/40 backdrop-blur-xl shadow-2xl"
//     >
//       {/* Background decorative elements */}
//       <div className="absolute inset-0 -z-10">
//         <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-200/20 to-emerald-200/20 dark:from-cyan-800/10 dark:to-emerald-800/10 blur-3xl animate-pulse delay-1000"></div>

//         {/* Floating geometric shapes */}
//         <div className="absolute top-[20%] right-[10%] w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-300/20 to-teal-300/20 dark:from-emerald-700/20 dark:to-teal-700/20 rotate-45 animate-float"></div>
//         <div className="absolute bottom-[30%] left-[5%] w-16 h-16 rounded-full bg-gradient-to-br from-cyan-300/20 to-emerald-300/20 dark:from-cyan-700/20 dark:to-emerald-700/20 animate-float-delayed"></div>
//         <div className="absolute top-[60%] right-[30%] w-12 h-12 rounded-xl bg-gradient-to-br from-teal-300/20 to-cyan-300/20 dark:from-teal-700/20 dark:to-cyan-700/20 rotate-12 animate-float"></div>
//       </div>
//       {/* Logo Section */}
//       <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-200/30 dark:border-emerald-700/30 relative z-10">
//         <AnimatePresence mode="wait">
//           {!isCollapsed ? (
//             <motion.div
//               key="full-logo"
//               className="flex items-center gap-2"
//             >
//               <div className="rounded-lg bg-white/90 dark:bg-slate-800/90 border border-emerald-200/40 dark:border-emerald-700/40 p-2 shadow-lg backdrop-blur-sm">
//                 <Logo
//                   size="lg"
//                   variant="adaptive"
//                   animated={false}
//                   sidebarState="expanded"
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-lg font-bold bg-gradient-to-r from-emerald-800 via-teal-700 to-cyan-700 dark:from-emerald-100 dark:via-teal-200 dark:to-cyan-200 bg-clip-text text-transparent">
//                   CognitoSpeak
//                 </span>
//                 <span className="text-xs text-emerald-600 dark:text-emerald-400 -mt-1">AI Learning</span>
//               </div>
//             </motion.div>
//           ) : (
//             <motion.div
//               key="collapsed-logo"
//               className="rounded-lg bg-white/90 dark:bg-slate-800/90 border border-emerald-200/40 dark:border-emerald-700/40 p-2 shadow-lg backdrop-blur-sm mx-auto"
//             >
//               <Logo
//                 size="lg"
//                 variant="adaptive"
//                 animated={false}
//                 sidebarState="collapsed"
//               />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {!isCollapsed && (
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </Button>
//         )}
//       </div>

//       {/* Collapsed Toggle Button */}
//       {isCollapsed && (
//         <div className="px-4 py-2">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="w-full h-8"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       )}

//       {/* Enhanced Hero Stats Section - Top Position with User Info */}
//       {!isCollapsed && userStats && (
//         <motion.div
//           className="px-4 py-4 relative z-10"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3, duration: 0.6 }}
//         >
//           <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 via-emerald-50/80 to-teal-50/90 dark:from-slate-800/90 dark:via-emerald-900/40 dark:to-teal-900/50 backdrop-blur-xl border border-emerald-200/40 dark:border-emerald-700/40 shadow-2xl">
//             {/* Background decorative elements */}
//             <div className="absolute inset-0 -z-10">
//               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-700/20 dark:to-teal-700/20 blur-xl animate-pulse"></div>
//               <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200/30 to-emerald-200/30 dark:from-cyan-700/20 dark:to-emerald-700/20 blur-lg animate-pulse delay-1000"></div>
//             </div>

//             {/* User Info Header */}
//             <div className="p-4 pb-2 border-b border-emerald-200/30 dark:border-emerald-700/30">
//               <div className="flex items-center gap-3">
//                 <motion.div
//                   whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <Avatar className="h-12 w-12 border-2 border-emerald-200/40 dark:border-emerald-600/40 shadow-lg">
//                     <AvatarImage src={user?.avatar || undefined} alt={user?.fullName || "User"} />
//                     <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800 dark:to-teal-800 text-emerald-700 dark:text-emerald-300 font-semibold">
//                       {user?.fullName?.charAt(0) || "U"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </motion.div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-bold truncate text-emerald-900 dark:text-emerald-100">
//                     {user?.fullName || "Student"}
//                   </p>
//                   <p className="text-xs truncate text-emerald-600 dark:text-emerald-400">
//                     {user?.email}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
//                   <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Your Progress</span>
//                 </div>
//                 <motion.div
//                   className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400"
//                   animate={{ scale: [1, 1.1, 1] }}
//                   transition={{ duration: 2, repeat: Infinity }}
//                 >
//                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
//                   <span>Live</span>
//                 </motion.div>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <motion.div
//                   className="flex flex-col items-center p-4 bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-slate-700/80 dark:to-emerald-900/60 rounded-2xl border border-emerald-200/40 dark:border-emerald-600/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   whileHover={{ y: -4, rotate: 2 }}
//                   transition={{ type: "spring", stiffness: 300 }}
//                 >
//                   <motion.div
//                     className="p-3 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-lg mb-3"
//                     animate={{ rotate: [0, 10, -10, 0] }}
//                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//                   >
//                     <Flame className="h-6 w-6" />
//                   </motion.div>
//                   <span className="text-xl font-bold text-orange-600 dark:text-orange-400 mb-1">{userStats.streak}</span>
//                   <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Day Streak</span>
//                 </motion.div>

//                 <motion.div
//                   className="flex flex-col items-center p-4 bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-slate-700/80 dark:to-emerald-900/60 rounded-2xl border border-emerald-200/40 dark:border-emerald-600/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   whileHover={{ y: -4, rotate: -2 }}
//                   transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
//                 >
//                   <motion.div
//                     className="p-3 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg mb-3"
//                     animate={{ scale: [1, 1.2, 1] }}
//                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
//                   >
//                     <Coins className="h-6 w-6" />
//                   </motion.div>
//                   <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{userStats.coins}</span>
//                   <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Total Coins</span>
//                 </motion.div>

//                 <motion.div
//                   className="flex flex-col items-center p-4 bg-gradient-to-br from-white/80 to-emerald-50/80 dark:from-slate-700/80 dark:to-emerald-900/60 rounded-2xl border border-emerald-200/40 dark:border-emerald-600/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
//                   whileHover={{ y: -4, rotate: 2 }}
//                   transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
//                 >
//                   <motion.div
//                     className="p-3 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg mb-3"
//                     animate={{ y: [0, -3, 0] }}
//                     transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
//                   >
//                     <Trophy className="h-6 w-6" />
//                   </motion.div>
//                   <span className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-1">{userStats.level}</span>
//                   <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Current Level</span>
//                 </motion.div>
//               </div>

//               {/* Progress indicators */}
//               <div className="mt-4 flex items-center justify-center gap-2">
//                 <span className="text-xs text-emerald-600 dark:text-emerald-400">Keep it up! 🔥</span>
//                 <div className="flex gap-1">
//                   {Array.from({ length: Math.min(5, Math.floor(userStats.level / 10) + 1) }, (_, i) => (
//                     <motion.div
//                       key={i}
//                       className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
//                       animate={{ opacity: [0.5, 1, 0.5] }}
//                       transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       )}
//       <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-emerald-300/30 scrollbar-track-transparent [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden relative z-10">
//         {navSections.map((section) => (
//           <div key={section.title} className="px-3">
//             {!isCollapsed && (
//               <motion.h3
//                 className="px-3 mb-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider"
//                 initial={{ opacity: 0, x: -10 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ delay: 0.2 + navSections.indexOf(section) * 0.1 }}
//               >
//                 {section.title}
//               </motion.h3>
//             )}
//             <nav className="space-y-2">
//               {section.items.map((item, itemIndex) => (
//                 <motion.div
//                   key={item.id}
//                   initial={{ opacity: 0, x: -20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ delay: 0.3 + navSections.indexOf(section) * 0.1 + itemIndex * 0.05 }}
//                 >
//                   <NavItemComponent item={item} collapsed={isCollapsed} />
//                 </motion.div>
//               ))}
//             </nav>
//           </div>
//         ))}
//       </div>
//     </motion.aside>
//   );
// };

// export default NewDashboardSidebar;
