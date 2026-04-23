'use client';

import { ScrollArea } from '@/components/shadcn/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/shadcn/sidebar';
import routes from '@/constant/routes';
import { useRoutes } from '@/hooks/use-routes';
import { PropsWithChildren } from 'react';
import { AdminHeader } from './components/admin-header';
import { AdminSidebar } from './components/admin-sidebar';

export function ConsoleLayout({ children }: PropsWithChildren) {
    const menuItems = useRoutes(routes);

    return (
        <SidebarProvider>
            <AdminSidebar menu={menuItems} />
            <SidebarInset className="h-screen overflow-hidden">
                <AdminHeader title="" menu={menuItems} />
                <ScrollArea className="h-[calc(100vh-64px)] w-full">{children}</ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    );
}
