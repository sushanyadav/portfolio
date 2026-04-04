'use client';

import type { PropsWithChildren } from 'react';

import { useClickBurst } from '@/common/hooks/use-click-burst';

export function PageBurst({ children }: PropsWithChildren) {
  const burst = useClickBurst();

  return (
    <div
      className="relative flex min-h-screen flex-col"
      onPointerDown={burst.onPointerDown}
      onTouchStart={burst.onTouchStart}
    >
      {children}
    </div>
  );
}
