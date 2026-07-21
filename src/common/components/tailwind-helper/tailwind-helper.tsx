'use client';

import { useEffect, useState } from 'react';

// Matches --breakpoint-* in src/common/styles/theme.css (in px)
const BREAKPOINTS = [
  { name: '3xl', min: 2000 },
  { name: '2xl', min: 1440 },
  { name: 'xl', min: 1280 },
  { name: 'lg', min: 1024 },
  { name: 'md', min: 768 },
  { name: 'sm', min: 640 },
  { name: 'xs', min: 350 },
] as const;

const activeBreakpoint = (width: number) =>
  BREAKPOINTS.find((b) => width >= b.min)?.name ?? '<xs';

export const TailwindHelper = () => {
  return (
    <div className="fixed right-0 bottom-0 z-9999 border border-t-0 border-white/30 bg-[#f00]">
      <div className="*:p-1 *:text-xs *:font-bold *:text-white">
        <WindowSize />
      </div>
    </div>
  );
};

const WindowSize = () => {
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!size) return null;

  return (
    <div>
      {activeBreakpoint(size.width)} &middot; {size.width} &times; {size.height}
    </div>
  );
};
