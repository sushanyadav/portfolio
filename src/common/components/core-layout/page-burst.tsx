'use client';

import type { PropsWithChildren } from 'react';

import { useClickBurst } from '@/common/hooks/use-click-burst';

export function PageBurst({ children }: PropsWithChildren) {
  const burst = useClickBurst();

  return (
    <div
      className="relative flex h-dvh flex-col overflow-hidden"
      onPointerDown={burst.onPointerDown}
      onTouchStart={burst.onTouchStart}
    >
      {children}
    </div>
  );
}
