'use client';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-screen">
      <Empty className="m-auto max-w-5xl border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Info />
          </EmptyMedia>
          <EmptyTitle>页面不存在</EmptyTitle>
        </EmptyHeader>
        <EmptyDescription>您访问的链接有误，或对应的资源已删除。</EmptyDescription>
        <EmptyContent>
          <Button variant="link" className="text-foreground">
            <Link href="/">返回首页</Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
