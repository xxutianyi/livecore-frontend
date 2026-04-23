'use client';

import { useUserContext } from '@/components/provider/user-provider';
import { Button } from '@/components/shadcn/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import { logout } from '@/service/api/auth';
import { LogIn, User } from 'lucide-react';
import Link from 'next/link';

export function WebsiteUserAction() {
    const user = useUserContext();

    function handleLogout() {
        logout().then(() => {
            window.location.reload();
        });
    }

    if (!user) {
        return (
            <Button size="lg" asChild>
                <Link href="/sign-in">
                    <LogIn />
                    <span>登录</span>
                </Link>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="lg">
                    <User />
                    <span>{user.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/profile">设置</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>退出</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
