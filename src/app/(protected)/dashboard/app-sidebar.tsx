'use client'

import Link from 'next/link'
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
        href: '/meeting',
    }
]



export function AppSidebar() {
    const {open} = useSidebar();
    const {project, projects, projectid, setProjectId} = useProjects();
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader> 
                Logo
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <Link href={item.href} passHref>
                                        <SidebarMenuButton className={cn("justify-start")}>
                                            <item.icon className="mr-2 h-4 w-4" />
                                            {item.label}
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                      Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {projects?.map((project) => (
                                <SidebarMenuItem key={project.name}>
                                    {/* <Link href={project.} passHref> */}
                                        <SidebarMenuButton className={cn("justify-start", { "bg-black": projectid === project.id, "text-white": projectid === project.id })} onClick={()=>setProjectId(project.id)} >

                                            <Presentation className={cn("mr-2 h-4 w-4", { "text-blue-500": projectid === project.id })} />
                                            {project.name}
                                        </SidebarMenuButton>
                                    {/* </Link> */}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    <Link href="/create" passHref>
                        <Button variant={"outline"} className="w-full mt-2"  >
                            <Plus/>   Create Project
                        </Button>
                    </Link>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
