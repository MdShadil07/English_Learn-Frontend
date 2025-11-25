import * as React from "react";
import { type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

/**
 * Professional, theme-aware NavMain component
 * - Subtle glow + gradient for active item
 * - Smooth hover transitions
 * - Light/dark adaptive styles
 * - Fully keyboard-accessible
 * - Future-ready for nested menus
 */
export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: { title: string; url: string }[];
  }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs uppercase tracking-wide font-semibold text-slate-500 dark:text-slate-400 mb-1">
        Main
      </SidebarGroupLabel>

      <SidebarMenu className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl transition-all duration-200 text-sm font-medium px-3 py-2.5",
                  // default state
                  "text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-slate-800/50",
                  // active state
                  item.isActive &&
                    "bg-gradient-to-r from-emerald-500/80 to-emerald-400/70 text-white shadow-md hover:from-emerald-500/90 hover:to-emerald-400/80"
                )}
              >
                {/* Optional active glow behind */}
                {item.isActive && (
                  <span
                    aria-hidden
                    className="absolute -inset-[1px] rounded-xl bg-emerald-500/25 blur-md"
                  />
                )}

                <a
                  href={item.url}
                  className={cn(
                    "relative z-10 flex items-center w-full gap-3",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded-lg"
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        item.isActive
                          ? "text-white"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
                        "group-hover:scale-110"
                      )}
                    />
                  )}
                  <span className="relative z-10">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
