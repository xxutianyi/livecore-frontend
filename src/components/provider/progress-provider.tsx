'use client';

import { AppProgressProvider, AppProgressProviderProps } from '@bprogress/next';

export function ProgressProvider({ children, ...props }: AppProgressProviderProps) {
  return <AppProgressProvider {...props}>{children}</AppProgressProvider>;
}
