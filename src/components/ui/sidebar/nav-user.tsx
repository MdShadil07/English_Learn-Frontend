"use client"

import { memo } from "react"
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { SubscriptionDetails } from "@/types/user"

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  role?: string
  tier?: 'free' | 'pro' | 'premium'
  subscriptionDetails?: SubscriptionDetails
}

interface NavUserProps {
  user: UserProfile
}

/**
 * 👤 Modern Sidebar User Profile
 * - Responsive, theme-aware, and accessible
 * - Matches modern SaaS dashboard sidebars
 */
function NavUserComponent({ user }: NavUserProps) {
  const { isMobile } = useSidebar()

  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"

  const isPaid = user.tier === 'pro' || user.tier === 'premium';
  const expiryDate = user.subscriptionDetails?.expiresAt 
    ? new Date(user.subscriptionDetails.expiresAt).toLocaleDateString() 
    : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          {/* ---- Profile Dropdown Trigger ---- */}
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition-all",
                "hover:bg-muted/60 hover:border-border data-[state=open]:bg-emerald-100 data-[state=open]:text-emerald-900",
                "dark:data-[state=open]:bg-emerald-950/50 dark:data-[state=open]:text-emerald-100"
              )}
            >
              <Avatar className="h-9 w-9 rounded-lg ring-2 ring-emerald-200 dark:ring-emerald-900">
                {user.avatar ? (
                  <AvatarImage src={user.avatar} alt={user.name} />
                ) : (
                  <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex flex-1 flex-col text-left leading-tight">
                <span className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs text-emerald-600 dark:text-emerald-400">
                  {user.email}
                </span>
              </div>

              <ChevronsUpDown
                className="ml-auto size-4 text-muted-foreground group-hover:text-foreground"
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          {/* ---- Dropdown Menu ---- */}
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-xl border border-border/50 bg-background/95 shadow-lg backdrop-blur-sm"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-3 font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-lg ring-1 ring-emerald-200 dark:ring-emerald-800">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 font-semibold text-white">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col text-sm leading-tight">
                  <span className="truncate font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </span>
                  <span className="truncate text-xs text-emerald-600 dark:text-emerald-400">
                    {user.email}
                  </span>
                  {isPaid && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {user.tier?.toUpperCase()} {expiryDate && `• Exp: ${expiryDate}`}
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* ---- Main Account Options ---- */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2">
                <Sparkles className="h-4 w-4 text-emerald-500" />
                <span>{isPaid ? 'Manage Subscription' : 'Upgrade to Pro'}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <BadgeCheck className="h-4 w-4 text-blue-500" />
                <span>Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <CreditCard className="h-4 w-4 text-purple-500" />
                <span>Billing</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Bell className="h-4 w-4 text-orange-500" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* ---- Logout ---- */}
            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export const NavUser = memo(NavUserComponent)
