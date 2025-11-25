"use client"

import { memo } from "react"
import { type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Define strong reusable types
export interface SecondaryNavItem {
  title: string
  url: string
  icon: LucideIcon
  badge?: string
  isActive?: boolean
}

export interface SecondaryNavSection {
  title: string
  items: SecondaryNavItem[]
}

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: SecondaryNavSection[]
}

/**
 * 🧭 Professional Secondary Navigation (Sidebar)
 * - Supports badges (New / Live / Pro / Custom)
 * - Fully dark/light mode aware
 * - Clean typography and subtle hover states
 */
function NavSecondaryComponent({ items, className, ...props }: NavSecondaryProps) {
  return (
    <SidebarGroup
      className={cn("mt-4 border-t border-border/40 pt-3", className)}
      {...props}
    >
      {items.map((section) => (
        <div key={section.title} className="mb-3">
          <SidebarGroupLabel className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {section.title}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {section.items.map((item) => {
                const badgeColor =
                  item.badge === "New"
                    ? "bg-emerald-600 text-white"
                    : item.badge === "Live"
                    ? "bg-red-500 text-white"
                    : item.badge === "Pro"
                    ? "bg-amber-500 text-white"
                    : "bg-muted text-foreground"

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={cn(
                        "transition-colors hover:bg-muted/50 data-[active=true]:bg-emerald-100 data-[active=true]:text-emerald-900 dark:data-[active=true]:bg-emerald-950/50 dark:data-[active=true]:text-emerald-100",
                        item.isActive && "bg-emerald-100 text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                      )}
                    >
                      <a
                        href={item.url}
                        className="flex w-full items-center justify-between gap-3 rounded-md px-2 py-1.5"
                        aria-label={`Navigate to ${item.title}`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate text-sm font-medium">{item.title}</span>
                        </div>

                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto text-[10px] font-semibold uppercase tracking-wide",
                              badgeColor
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </div>
      ))}
    </SidebarGroup>
  )
}

// ✅ Memoized for better performance
export const NavSecondary = memo(NavSecondaryComponent)
