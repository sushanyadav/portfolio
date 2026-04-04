'use client';

import { useEffect, useState } from 'react';

export const TailwindHelper = () => {
  return (
    <div className="fixed right-0 bottom-0 z-999 border border-t-0 border-white/30 bg-[#f00]">
      <div className="*:p-1 *:text-sm *:font-bold *:text-white">
        <div className="sm:hidden"> &lt;sm</div>
        <div className="hidden sm:block md:hidden">sm</div>
        <div className="hidden md:block lg:hidden">md</div>
        <div className="hidden lg:block xl:hidden">lg</div>
        <div className="hidden xl:block 2xl:hidden">xl</div>
        <div className="3xl:hidden hidden 2xl:block">2xl</div>
        <div className="3xl:block hidden">3xl</div>
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
    <div className="border-t border-white/30 text-xs!">
      {size.width} &times; {size.height}
    </div>
  );
};
