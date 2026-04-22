'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, User } from 'lucide-react';
import Link from 'next/link';

export function WebsiteUserAction() {
    if (false) {
        return (
            <Button size="lg" asChild>
                <Link href="/login">
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
                    <span>{'auth.user.name'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>设置</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>退出</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
