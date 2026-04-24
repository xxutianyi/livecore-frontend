import { ConsoleLayout } from '@/layouts/console-layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <ConsoleLayout>{children}</ConsoleLayout>;
}
