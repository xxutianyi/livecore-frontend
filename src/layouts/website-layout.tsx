'use client';

import { ThemeToggle } from '@/components/provider/theme-provider';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import configs from '@/lib/configs';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { WebsiteUserAction } from './components/website-header';

export function WebsiteLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="flex h-16 w-full items-center justify-between border-t border-b border-border bg-sidebar px-4 py-4 md:px-8">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Image
                            alt="logo"
                            width={32}
                            height={32}
                            src={configs.APP_LOGO}
                            className="inline"
                        />
                        <h1 className="text-base font-bold md:text-xl">{configs.APP_NAME}</h1>
                    </div>
                </Link>
                <div className="space-x-4">
                    <WebsiteUserAction />
                    <ThemeToggle />
                </div>
            </div>
            <ScrollArea className="h-[calc(100svh-64px)] overflow-hidden bg-muted/20 p-4 md:p-8">
                {children}
            </ScrollArea>
        </>
    );
}
