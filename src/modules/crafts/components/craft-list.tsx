'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/common/functions/cn';

export type CraftPreviewItem = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  previewSrc: string | null;
  previewType: 'image' | 'video' | null;
};

const MAX_W = 200;
const THUMB_W = 44;
const THUMB_H = Math.round(THUMB_W * (9 / 16));

const springX = { stiffness: 150, damping: 20, mass: 1 };
const springY = { stiffness: 800, damping: 35, mass: 0.3 };

const springScale = { stiffness: 400, damping: 35, mass: 0.8 };

function MediaEl({
  craft,
  className,
  loading,
  onLoad,
}: {
  craft: CraftPreviewItem;
  className?: string;
  loading?: 'eager' | 'lazy';
  onLoad?: (slug: string, w: number, h: number) => void;
}) {
  if (!craft.previewSrc) return null;

  if (craft.previewType === 'video') {
    return (
      <video
        autoPlay
        className={cn('h-full w-full object-cover', className)}
        loop
        muted
        onLoadedMetadata={
          onLoad
            ? (e) =>
                onLoad(
                  craft.slug,
                  e.currentTarget.videoWidth,
                  e.currentTarget.videoHeight,
                )
            : undefined
        }
        playsInline
        src={craft.previewSrc}
      />
    );
  }

  return (
    <Image
      alt=""
      className={cn('object-cover', className)}
      fill
      loading={loading}
      onLoad={
        onLoad
          ? (e) =>
              onLoad(
                craft.slug,
                e.currentTarget.naturalWidth,
                e.currentTarget.naturalHeight,
              )
          : undefined
      }
      src={craft.previewSrc}
      unoptimized
    />
  );
}

export function CraftList({ crafts }: { crafts: CraftPreviewItem[] }) {
  const [canHover, setCanHover] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>(
    {},
  );

  useEffect(() => {
    setCanHover(
      window.matchMedia('(pointer: fine) and (hover: hover)').matches,
    );
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, springX);
  const y = useSpring(mouseY, springY);
  const scale = useSpring(0, springScale);

  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isActive = useRef(false);
  const isSwitching = useRef(false);

  const onMediaLoad = useCallback(
    (slug: string, naturalW: number, naturalH: number) => {
      const aspect = naturalH / naturalW;
      setSizes((prev) => ({
        ...prev,
        [slug]: { w: MAX_W, h: Math.round(MAX_W * aspect) },
      }));
    },
    [],
  );

  const handleEnter = useCallback(
    (i: number) => {
      if (!canHover) return;
      if (!isActive.current) {
        // First hover — jump to thumb position, spring to cursor
        const thumb = thumbRefs.current[i];
        if (thumb) {
          const rect = thumb.getBoundingClientRect();
          x.jump(rect.left);
          y.jump(rect.top);
        }
        scale.jump(THUMB_W / MAX_W);
        scale.set(1);
        isActive.current = true;
        isSwitching.current = false;
      } else {
        isSwitching.current = true;
      }
      setHovered(i);
    },
    [x, y, scale, canHover],
  );

  const handleLeave = useCallback(() => {
    if (!canHover) return;
    scale.set(0);
    isActive.current = false;
    isSwitching.current = false;
    setHovered(null);
  }, [scale, canHover]);

  const listHovered = hovered !== null;
  const activeCraft = hovered !== null ? crafts[hovered] : null;
  const defaultSize = { w: MAX_W, h: Math.round(MAX_W * (9 / 16)) };
  const activeSize = activeCraft ? (sizes[activeCraft.slug] ?? defaultSize) : defaultSize;

  return (
    <>
      {/* Floating preview */}
      {canHover && <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-50 overflow-hidden transition-[width,height] duration-500 ease-out-quart"
        style={{
          x,
          y,
          scale,
          width: activeSize.w,
          height: activeSize.h,
          transformOrigin: 'top left',
        }}
      >
        {crafts.map((c, i) => {
          if (!c.previewSrc) return null;
          return (
            <div
              key={c.slug}
              className={cn(
                'absolute inset-0',
                isSwitching.current &&
                  'transition-opacity duration-500 ease-out',
              )}
              style={{
                opacity: hovered === i ? 1 : 0,
                zIndex: hovered === i ? 1 : 0,
              }}
            >
              <MediaEl craft={c} onLoad={onMediaLoad} />
            </div>
          );
        })}
      </motion.div>}

      {/* Craft rows */}
      <div
        className="mt-4 flex flex-col"
        onMouseLeave={handleLeave}
        onMouseMove={
          canHover
            ? (e) => {
                mouseX.set(e.clientX + 20);
                mouseY.set(e.clientY - 70);
              }
            : undefined
        }
      >
        {crafts.map((c, i) => {
          const isItemActive = hovered === i;

          return (
            <Link
              key={c.slug}
              className={cn(
                'group -mx-3 flex items-center justify-between gap-4 rounded-none px-3 py-2.5 transition-[colors,opacity] duration-200 ease-out phover:hover:bg-surface-hover',
                listHovered && !isItemActive && 'opacity-30',
              )}
              href={`/crafts/${c.slug}`}
              onMouseEnter={() => handleEnter(i)}
            >
              <div className="flex items-center gap-3">
                {c.previewSrc && (
                  <div
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    className="relative grid shrink-0 place-items-center overflow-hidden"
                    style={{ width: THUMB_W, height: THUMB_H }}
                  >
                    {/* Dot → arrow morph via clip-path (behind image) */}
                    <span
                      className={cn(
                        'pointer-events-none [grid-area:1/1] bg-accent',
                        isItemActive
                          ? '[clip-path:polygon(0%_90%,80%_10%,35%_10%,35%_0%,100%_0%,100%_65%,90%_65%,90%_10%,10%_100%)]'
                          : '[clip-path:polygon(0%_100%,0%_0%,35%_0%,35%_0%,100%_0%,100%_65%,100%_100%,90%_100%,10%_100%)]',
                      )}
                      style={{
                        width: 14,
                        height: 14,
                        marginTop: 1,
                        transition: isItemActive
                          ? 'clip-path 200ms ease-out 120ms'
                          : 'clip-path 150ms ease-out',
                      }}
                    />
                    {/* Thumbnail image (on top) */}
                    <div
                      className={cn(
                        'relative [grid-area:1/1] overflow-hidden transition-opacity duration-200 ease-out',
                        isItemActive && 'opacity-0',
                      )}
                      style={{ width: THUMB_W, height: THUMB_H }}
                    >
                      <MediaEl craft={c} loading="eager" />
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm text-text-secondary transition-colors duration-150 ease-out group-hover:text-text-primary">
                    {c.title}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {c.description}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-xs tabular-nums text-text-tertiary">
                {new Date(c.publishedAt).getFullYear()}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
