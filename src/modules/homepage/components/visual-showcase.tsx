'use client';

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'motion/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { BlurVideo } from '@/common/components/blur-video/blur-video';
import {
  CraftTile,
  mediaRatio,
  type TileCraft,
} from '@/modules/crafts/components/craft-tile';

export type ShowcaseCraft = TileCraft & { visual?: boolean; caption?: string };

type VisualShowcaseProps = {
  crafts: ShowcaseCraft[];
};

const spring = { type: 'spring', stiffness: 300, damping: 30 } as const;

// shared-layout morphs must not crossfade: the see-through mid-flight looks
// broken. geometry springs, opacity snaps.
const morph = { ...spring, opacity: { duration: 0 } } as const;

// fill the screen: height drives on wide viewports, the overlay padding
// caps width on tall ones; media keeps its true ratio
function spotlightMaxWidth(craft: ShowcaseCraft): string {
  const raw = craft.media[0]?.aspectRatio;
  const [w, h] = raw ? raw.split('/').map((n) => parseFloat(n)) : [16, 10];
  const ratio = w && h ? w / h : 1.6;
  return `calc((100dvh - 7rem) * ${ratio})`;
}

function TileCaption({
  craft,
  readable,
}: {
  craft: ShowcaseCraft;
  readable?: boolean;
}) {
  return (
    <div className="mt-2 flex items-center gap-2">
      {readable && (
        <span
          aria-hidden
          className="bg-accent size-2.5 shrink-0 transition-[clip-path] duration-200 ease-out [clip-path:polygon(0%_100%,0%_0%,35%_0%,35%_0%,100%_0%,100%_65%,100%_100%,90%_100%,10%_100%)] group-hover:[clip-path:polygon(0%_90%,80%_10%,35%_10%,35%_0%,100%_0%,100%_65%,90%_65%,90%_10%,10%_100%)]"
        />
      )}
      <span className="text-text-tertiary group-hover:text-text-secondary truncate text-xs lowercase transition-colors duration-150 ease-out">
        {craft.title}
      </span>
      <span className="text-text-tertiary ml-auto shrink-0 text-xs tabular-nums">
        {craft.year}
      </span>
    </div>
  );
}

export function VisualShowcase({ crafts }: VisualShowcaseProps) {
  const [active, setActive] = useState<ShowcaseCraft | null>(null);

  // description follows the cursor while hovering a card
  const [hoverCaption, setHoverCaption] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const capX = useSpring(mouseX, { stiffness: 1300, damping: 70 });
  const capY = useSpring(mouseY, { stiffness: 1300, damping: 70 });

  useEffect(() => {
    setCanHover(
      window.matchMedia('(pointer: fine) and (hover: hover)').matches,
    );
  }, []);

  const onGridMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mouseX.set(e.clientX + 16);
      mouseY.set(e.clientY + 18);
    },
    [mouseX, mouseY],
  );

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    const scroller = document.getElementById('scroll-root');
    if (scroller) scroller.style.overflowY = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      if (scroller) scroller.style.overflowY = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active]);

  return (
    <>
      <div
        className="flex flex-wrap items-start gap-8"
        onMouseLeave={() => setHoverCaption(null)}
        onMouseMove={canHover ? onGridMouseMove : undefined}
      >
        {crafts.map((craft) => {
          // justified rows: growth proportional to aspect ratio makes every
          // card in a row share one height, so rows fill the container with
          // no voids; heights differ between rows, not within them.
          const ratio = mediaRatio(craft);
          const cardClass =
            'max-md:w-full min-w-0 md:grow-(--grow) md:basis-(--basis)';
          const cardStyle = {
            '--grow': ratio * 100,
            '--basis': `${ratio * 15}rem`,
          } as unknown as React.CSSProperties;

          if (!craft.visual) {
            return (
              <Link
                key={craft.slug}
                className={`group block ${cardClass}`}
                href={`/making/${craft.slug}`}
                style={cardStyle}
                onMouseEnter={() => setHoverCaption(craft.caption ?? null)}
                onMouseLeave={() => setHoverCaption(null)}
              >
                <CraftTile craft={craft} />
                <TileCaption craft={craft} readable />
              </Link>
            );
          }

          return (
            <div
              key={craft.slug}
              className={`group ${cardClass}`}
              style={cardStyle}
              onMouseEnter={() => setHoverCaption(craft.caption ?? null)}
              onMouseLeave={() => setHoverCaption(null)}
            >
              <motion.button
                aria-label={`view ${craft.title}`}
                className="focus-ring bg-bg block w-full cursor-zoom-in text-left"
                layoutId={`visual-${craft.slug}`}
                style={{
                  visibility:
                    active?.slug === craft.slug ? 'hidden' : undefined,
                }}
                transition={morph}
                type="button"
                onClick={() => setActive(craft)}
              >
                <CraftTile craft={craft} />
              </motion.button>
              <TileCaption craft={craft} />
            </div>
          );
        })}
      </div>

      {canHover && (
        <AnimatePresence>
          {hoverCaption && !active && (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="border-border bg-bg text-text-secondary pointer-events-none fixed top-0 left-0 z-40 max-w-64 border px-2 py-1 text-xs lowercase"
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.1 } }}
              initial={{ opacity: 0, scale: 0.96 }}
              style={{ x: capX, y: capY }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {hoverCaption}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            aria-modal="true"
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center p-6"
            role="dialog"
            onClick={() => setActive(null)}
          >
            <motion.div
              animate={{ opacity: 1 }}
              aria-hidden
              className="bg-bg/80 absolute inset-0 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            />
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="close"
              className="hitbox text-text-tertiary hover:text-text-primary fixed top-6 right-6 flex size-8 items-center justify-center transition-colors duration-150 ease-out"
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={() => setActive(null)}
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="5" x2="19" y1="5" y2="19" />
                <line x1="19" x2="5" y1="5" y2="19" />
              </svg>
            </motion.button>
            <motion.button
              animate={{ opacity: 1 }}
              className="hitbox text-text-tertiary hover:text-text-primary fixed right-6 bottom-6 text-xs tracking-widest uppercase transition-colors duration-150 ease-out"
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={() => setActive(null)}
            >
              close
            </motion.button>
            <motion.div
              className="bg-bg relative w-full cursor-zoom-out"
              layoutId={`visual-${active.slug}`}
              style={{ maxWidth: spotlightMaxWidth(active) }}
              transition={morph}
            >
              <BlurVideo
                aspectRatio={active.media[0]?.aspectRatio ?? '16 / 10'}
                className="border-border w-full border"
                mp4Src={active.media.find((m) => m.src.endsWith('.mp4'))?.src}
                src={active.media[0]?.src ?? ''}
              />
              <p className="text-text-tertiary mt-2 text-xs lowercase">
                {active.title}
                {active.caption && <span> &middot; {active.caption}</span>}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
