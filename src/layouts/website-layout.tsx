'use client';

import { useAuth } from '@/components/provider/auth-provider';
import { ThemeToggle } from '@/components/provider/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import configs from '@/lib/configs';
import { logout } from '@/service/requests';
import { LogIn, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

export function UserAction() {
  const auth = useAuth();

  function handleLogout() {
    logout().then(() => {
      window.location.reload();
    });
  }

  if (!auth || !auth.data) {
    return (
      <Button size="lg" asChild>
        <Link href="/sign-in">
          <LogIn /> 登录
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg">
          <User />
          <span>{auth?.data?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">设置</Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>退出</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function WebsiteLayout({ children }: PropsWithChildren) {
  return (
    <>
      <div className="flex h-16 w-full items-center justify-between border-t border-b border-border bg-sidebar px-4 py-4 md:px-8">
        <Link href="/">
          <div className="flex items-center gap-2">
            <Image alt="logo" width={32} height={32} src={configs.APP_LOGO} className="inline" />
            <h1 className="text-base font-bold md:text-xl">{configs.APP_NAME}</h1>
          </div>
        </Link>
        <div className="space-x-4">
          <UserAction />
          <ThemeToggle />
        </div>
      </div>
      <ScrollArea className="h-[calc(100svh-64px)] overflow-hidden bg-muted/20 p-4 md:p-8">{children}</ScrollArea>
    </>
  );
}
