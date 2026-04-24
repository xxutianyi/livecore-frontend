'use client';

import { ThemeToggle } from '@/components/provider/theme-provider';
import { useUserContext } from '@/components/provider/user-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/shadcn/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  useSidebar,
} from '@/components/shadcn/sidebar';
import { SidebarMenu as SideMenu } from '@/components/sidebar';
import routes from '@/constant/routes';
import { useRoutes } from '@/hooks/use-routes';
import configs from '@/lib/configs';
import { logout } from '@/service/api/auth';
import { ChevronsUpDownIcon, LogOutIcon, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function UserActions() {
  const { isMobile } = useSidebar();
  const userContext = useUserContext();

  function handleLogout() {
    logout().then(() => {
      window.location.reload();
    });
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
                <AvatarImage alt="avatar" />
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userContext?.user?.name}</span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={4} side={isMobile ? 'bottom' : 'right'}>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <Settings /> 账号设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOutIcon /> 退出账号
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function ConsoleLayout({ children }: PropsWithChildren) {
  const menuItems = useRoutes(routes);

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex h-12 w-full items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                <img alt="logo" src={configs.APP_ADMIN_LOGO} className="size-8 rounded-full" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{configs.APP_NAME}</span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SideMenu menu={menuItems} />
        </SidebarContent>
        <SidebarFooter>
          <UserActions />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="h-screen overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
