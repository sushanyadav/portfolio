'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// the app scrolls an inner container, which Next's router doesn't reset on
// navigation the way it resets window scroll
export function ScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    document.getElementById('scroll-root')?.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
