'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, LayoutDashboardIcon, Plus, Presentation, ProjectorIcon } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "~/components/ui/sidebar"
import { cn } from "~/lib/utils"
import { Button } from '~/components/ui/button'
import useProjects from '~/hooks/use-projects'

const items = [
    {
        label: 'Dashboard',
        icon : LayoutDashboardIcon,
        href: '/dashboard',
    },
       {
        label: 'QnA',
        icon : Bot,
        href: '/QA',
    },
    {
        label : 'Meeting',
        icon : Presentation,
        href: '/meetings',
    }
]



export function AppSidebar() {
    const {open} = useSidebar();
    const pathname = usePathname();
    const {project, projects, projectid, setProjectId} = useProjects();
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader> 
                Git Summary
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <SidebarMenuItem key={item.label}>
                                        <Link href={item.href} passHref>
                                            <SidebarMenuButton 
                                                className={cn(
                                                    "justify-start transition-all duration-200",
                                                    "hover:bg-gray-100 hover:text-gray-900",
                                                    "data-[state=open]:bg-gray-100",
                                                    isActive && [
                                                        "bg-primary text-primary-foreground",
                                                        "hover:bg-primary/90 hover:text-primary-foreground"
                                                    ]
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "mr-2 h-4 w-4 transition-colors",
                                                    isActive && "text-primary-foreground"
                                                )} />
                                                {item.label}
                                            </SidebarMenuButton>
                                        </Link>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                      Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map((proj) => {
                                const isSelected = projectid === proj.id;
                                return (
                                    <SidebarMenuItem key={proj.name}>
                                        <SidebarMenuButton 
                                            className={cn(
                                                "justify-start transition-all duration-200",
                                                "hover:bg-gray-100 hover:text-gray-900",
                                                "focus:bg-gray-100 focus:text-gray-900",
                                                isSelected && [
                                                    "bg-primary text-primary-foreground",
                                                    "hover:bg-primary/90 hover:text-primary-foreground",
                                                    "focus:bg-primary/90 focus:text-primary-foreground"
                                                ]
                                            )} 
                                            onClick={() => setProjectId(proj.id)}
                                        >
                                            <Presentation className={cn(
                                                "mr-2 h-4 w-4 transition-colors",
                                                isSelected && "text-primary-foreground"
                                            )} />
                                            {proj.name}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <Link href="/create" passHref>
                        <Button 
                            variant="outline" 
                            className={cn(
                                "w-full mt-2 transition-all duration-200",
                                "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                                "focus:bg-primary focus:text-primary-foreground focus:border-primary"
                            )}
                        >
                            <Plus className="mr-2 h-4 w-4" />   
                            Create Project
                        </Button>
                    </Link>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
