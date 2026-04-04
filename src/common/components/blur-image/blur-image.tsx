'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/common/functions/cn';

type BlurImageProps = {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function BlurImage({
  src,
  alt,
  sizes,
  priority,
  className,
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // If image loaded before hydration, onLoad won't fire — check manually
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, []);

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        ref={imgRef}
        alt={alt}
        className={cn(
          'w-full transition-[filter,opacity] duration-700 ease-out',
          loaded
            ? 'opacity-100 blur-0'
            : 'opacity-100 blur-xl scale-110',
        )}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={() => setLoaded(true)}
        sizes={sizes}
        src={src}
        style={{ width: '100%', height: 'auto' }}
        unoptimized
        width={1200}
        height={800}
      />
    </div>
  );
}
