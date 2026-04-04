'use client';

import { motion, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/common/functions/cn';

import type { CraftPreviewItem } from './recent-crafts';

const MAX_W = 200;
const THUMB_W = 44;
const THUMB_H = Math.round(THUMB_W * (9 / 16));

const springConfig = { stiffness: 400, damping: 35, mass: 0.8 };

function MediaEl({
  craft,
  className,
  onLoad,
}: {
  craft: CraftPreviewItem;
  className?: string;
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
      className={cn('h-full w-full object-cover', className)}
      height={THUMB_H}
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
      width={THUMB_W}
    />
  );
}

export function CraftList({ crafts }: { crafts: CraftPreviewItem[] }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [sizes, setSizes] = useState<Record<string, { w: number; h: number }>>(
    {},
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  const scale = useSpring(0, springConfig);

  const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isActive = useRef(false);

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
      if (!isActive.current) {
        // First hover — spring from thumb to cursor
        const thumb = thumbRefs.current[i];
        if (thumb) {
          const rect = thumb.getBoundingClientRect();
          x.jump(rect.left);
          y.jump(rect.top);
        }
        scale.jump(THUMB_W / MAX_W);
        scale.set(1);
        isActive.current = true;
      }
      setHovered(i);
    },
    [x, y, scale],
  );

  const handleLeave = useCallback(() => {
    scale.set(0);
    isActive.current = false;
    setHovered(null);
  }, [scale]);

  const listHovered = hovered !== null;
  const activeCraft = hovered !== null ? crafts[hovered] : null;
  const defaultSize = { w: MAX_W, h: Math.round(MAX_W * (9 / 16)) };
  const activeSize = activeCraft ? (sizes[activeCraft.slug] ?? defaultSize) : defaultSize;

  return (
    <>
      {/* Floating preview */}
      <motion.div
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
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{
                opacity: hovered === i ? 1 : 0,
                zIndex: hovered === i ? 1 : 0,
              }}
            >
              <MediaEl craft={c} onLoad={onMediaLoad} />
            </div>
          );
        })}
      </motion.div>

      {/* Craft rows */}
      <div
        className="mt-4 flex flex-col"
        onMouseLeave={handleLeave}
        onMouseMove={(e) => {
          mouseX.set(e.clientX + 20);
          mouseY.set(e.clientY - 70);
        }}
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
                    className="shrink-0 overflow-hidden"
                    style={{ width: THUMB_W, height: THUMB_H }}
                  >
                    <MediaEl
                      className={isItemActive ? 'opacity-0' : undefined}
                      craft={c}
                    />
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
