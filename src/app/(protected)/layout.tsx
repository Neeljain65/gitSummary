import { UserButton } from '@clerk/nextjs';
import React from 'react'
import { SidebarProvider } from '~/components/ui/sidebar';
import { AppSidebar } from './dashboard/app-sidebar';

type Props = {
  children: React.ReactNode;
}
const sideBarLayout = ({children}: Props) => {
  return (
    <SidebarProvider>
                <AppSidebar />
                <main className="w-full m-2">
                    <div className='flex item-center gap-2 border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4 '>
                        <div className='ml-auto'>
                            <UserButton />
                        </div>
                    </div>
                    <div className="h-4">
                        <div className='border-sidebar-border bg-sidebar border shadow rounded-md p-2 px-4 mt-2'>
                            {children}
                        </div>
                    </div>
                </main>
          
    </SidebarProvider>
  )
}

export default sideBarLayout