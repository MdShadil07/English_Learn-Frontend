"use client"

import { memo } from "react"
import {
  Folder,
  MoreHorizontal,
  Share,
  Trash2,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

// 🔹 Define a reusable Project type for clarity
export interface Project {
  name: string
  url: string
  icon: LucideIcon
}

interface NavProjectsProps {
  projects: Project[]
}

/**
 * Professional Sidebar Projects Navigation
 * Supports responsive dropdown actions for each project.
 */
function NavProjectsComponent({ projects }: NavProjectsProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>

      <SidebarMenu>
        {projects.map((project) => (
          <SidebarMenuItem key={project.name}>
            <SidebarMenuButton asChild>
              <a
                href={project.url}
                className="flex items-center gap-2 transition-colors hover:text-primary"
                aria-label={`Open project ${project.name}`}
              >
                <project.icon className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{project.name}</span>
              </a>
            </SidebarMenuButton>

            {/* Dropdown Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Project options</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-48 rounded-lg shadow-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem asChild>
                  <a href={project.url}>
                    <Folder className="h-4 w-4 text-muted-foreground" />
                    <span>View Project</span>
                  </a>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Share className="h-4 w-4 text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="text-destructive focus:text-destructive">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

// 🔹 Memoize to prevent unnecessary re-renders
export const NavProjects = memo(NavProjectsComponent)
