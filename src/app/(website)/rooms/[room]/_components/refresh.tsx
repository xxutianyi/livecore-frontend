'use client';

import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export function RefreshButton() {
  return (
    <Button onClick={() => window.location.reload()}>
      刷新状态
      <RefreshCcw />
    </Button>
  );
}
