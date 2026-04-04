'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/common/functions/cn';

type BlurVideoProps = {
  src: string;
  className?: string;
};

export function BlurVideo({ src, className }: BlurVideoProps) {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);

    if (video.readyState >= 2) {
      markReady();
      return;
    }

    video.addEventListener('loadeddata', markReady);
    video.addEventListener('canplay', markReady);
    video.addEventListener('playing', markReady);

    // iOS fallback — video readiness events don't always fire
    const timeout = setTimeout(markReady, 3000);

    return () => {
      video.removeEventListener('loadeddata', markReady);
      video.removeEventListener('canplay', markReady);
      video.removeEventListener('playing', markReady);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={cn('relative overflow-hidden bg-bg-secondary', className)}>
      <video
        ref={videoRef}
        autoPlay
        className={cn(
          'w-full transition-[filter,opacity] duration-700 ease-out',
          ready ? 'opacity-100 blur-0' : 'opacity-40 blur-xl',
        )}
        loop
        muted
        playsInline
        preload="auto"
        webkit-playsinline=""
      >
        <source src={src} />
      </video>
    </div>
  );
}
