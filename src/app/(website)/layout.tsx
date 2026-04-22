import { WebsiteLayout } from '@/layouts/website-layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
    return <WebsiteLayout>{children}</WebsiteLayout>;
}
