'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/common/functions/cn';

type BlurVideoProps = {
  src: string;
  mp4Src?: string;
  className?: string;
  aspectRatio?: string;
};

export function BlurVideo({ src, mp4Src, className, aspectRatio }: BlurVideoProps) {
  const [ready, setReady] = useState(false);
  // sources attach only once the video nears the viewport
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      // fetch well before entry so playback never looks late
      { rootMargin: '600px 0px' },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);

    if (video.readyState >= 2) {
      markReady();
    } else {
      // sources were just added; re-scan and start
      video.load();
      video.play().catch(() => {});
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
  }, [loaded]);

  return (
    <div className={cn('relative overflow-hidden bg-bg-secondary', className)} style={aspectRatio ? { aspectRatio } : undefined}>
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
        preload={loaded ? 'auto' : 'none'}
      >
        {loaded && (
          <>
            <source src={src} type="video/webm" />
            {mp4Src && <source src={mp4Src} type="video/mp4" />}
          </>
        )}
      </video>
    </div>
  );
}
