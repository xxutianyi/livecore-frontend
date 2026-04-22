'use client'

import { PropsWithChildren } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import configs from '@/lib/configs'
import { ThemeToggle } from '@/components/theme-provider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { WebsiteUserAction } from './components/website-header'

export function WebsiteLayout({ children }: PropsWithChildren) {
    return (
        <>
            <div className="border-border bg-sidebar flex h-16 w-full items-center justify-between border-t border-b px-4 py-4 md:px-8">
                <Link href="/">
                    <div className="flex items-center gap-2">
                        <Image alt="logo" width={32} height={32} src={configs.APP_LOGO} className="inline" />
                        <h1 className="text-base font-bold md:text-xl">{configs.APP_NAME}</h1>
                    </div>
                </Link>
                <div className="space-x-4">
                    <WebsiteUserAction />
                    <ThemeToggle />
                </div>
            </div>
            <ScrollArea className="bg-muted h-[calc(100svh-64px)] overflow-hidden p-4 md:p-8">{children}</ScrollArea>
        </>
    )
}
