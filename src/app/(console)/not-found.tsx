'use client';

import { PageContainer } from '@/components/container';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <PageContainer>
      <div className="m-auto flex h-[calc(100vh-240px)] w-full max-w-5xl overflow-hidden">
        <Empty className="m-auto border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Info />
            </EmptyMedia>
            <EmptyTitle>页面不存在</EmptyTitle>
          </EmptyHeader>
          <EmptyDescription>您访问的链接有误，或对应的资源已删除。</EmptyDescription>
          <EmptyContent>
            <Button variant="link" className="text-foreground">
              <Link href="/broadcast/streaming">返回首页</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    </PageContainer>
  );
}
