"use client";

import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValue,
  useSpring,
} from "motion/react";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import {
  CraftTile,
  mediaRatio,
  type TileCraft,
} from "@/modules/crafts/components/craft-tile";

export type ShowcaseCraft = TileCraft & {
  visual?: boolean;
  caption?: string;
  breakAfter?: boolean;
};

type VisualShowcaseProps = {
  crafts: ShowcaseCraft[];
};

const spring = { type: "spring", stiffness: 300, damping: 30 } as const;

// the expanded card fills the screen: height drives on wide viewports, the
// viewport width caps tall ones, and it never upscales past ~native pixels
function expandedMaxWidth(
  craft: ShowcaseCraft,
  naturalWidth: number | null,
): string {
  const raw = craft.media[0]?.aspectRatio;
  const [w, h] = raw ? raw.split("/").map((n) => parseFloat(n)) : [16, 10];
  const ratio = w && h ? w / h : 1.6;
  const parts = [`calc((100dvh - 7rem) * ${ratio})`, "calc(100vw - 3rem)"];
  if (naturalWidth) parts.push(`${Math.round(naturalWidth * 1.25)}px`);
  return `min(${parts.join(", ")})`;
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
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  // keeps the collapsing card above its siblings until it lands
  const [elevated, setElevated] = useState<string | null>(null);
  const elevationTimer = useRef<number | null>(null);

  // description follows the cursor while hovering a card
  const [hoverCaption, setHoverCaption] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const capX = useSpring(mouseX, { stiffness: 1300, damping: 70 });
  const capY = useSpring(mouseY, { stiffness: 1300, damping: 70 });

  useEffect(() => {
    setCanHover(
      window.matchMedia("(pointer: fine) and (hover: hover)").matches,
    );
  }, []);

  const close = useCallback(() => {
    setActive(null);
    // onLayoutAnimationComplete is unreliable for the collapse; drop the
    // elevation once the return spring has visually settled. track the timer
    // so opening another card can cancel it (a stale timer would wipe the
    // new card's elevation mid-flight)
    if (elevationTimer.current) window.clearTimeout(elevationTimer.current);
    elevationTimer.current = window.setTimeout(() => setElevated(null), 700);
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
      if (e.key === "Escape") close();
    };
    const scroller = document.getElementById("scroll-root");
    if (scroller) scroller.style.overflowY = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      if (scroller) scroller.style.overflowY = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <MotionConfig reducedMotion="never">
      <div
        className="-mb-8 flex flex-wrap items-start gap-x-8"
        onMouseLeave={() => setHoverCaption(null)}
        onMouseMove={canHover ? onGridMouseMove : undefined}
      >
        {crafts.map((craft) => {
          // justified rows: growth proportional to aspect ratio makes every
          // card in a row share one height, so rows fill the container with
          // no voids; heights differ between rows, not within them.
          const ratio = mediaRatio(craft);
          // cards carry the row gap as margin so the zero-height break line
          // doesn't double it the way row-gap would
          const cardClass =
            "mb-8 max-md:w-full min-w-0 md:grow-(--grow) md:basis-(--basis)";
          const cardStyle = {
            "--grow": ratio * 100,
            "--basis": `${ratio * 15}rem`,
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

          const isActive = active?.slug === craft.slug;

          return (
            <Fragment key={craft.slug}>
              <div
                className={`group ${cardClass}`}
                style={cardStyle}
                onMouseEnter={() => setHoverCaption(craft.caption ?? null)}
                onMouseLeave={() => setHoverCaption(null)}
              >
                {/* placeholder holds the grid slot while the tile is expanded */}
                {isActive && (
                  <div
                    aria-hidden
                    className="invisible w-full"
                    style={{ aspectRatio: ratio }}
                  />
                )}
                {/* one persistent element: the tile itself morphs into the
                  spotlight, so playback continues and nothing crossfades */}
                <motion.button
                  layout
                  aria-label={isActive ? "close" : `view ${craft.title}`}
                  className={
                    isActive
                      ? "fixed inset-0 z-50 m-auto block h-fit w-full cursor-zoom-out text-left"
                      : `focus-ring bg-bg block w-full cursor-zoom-in text-left ${
                          elevated === craft.slug ? "relative z-50" : ""
                        }`
                  }
                  style={
                    isActive
                      ? { maxWidth: expandedMaxWidth(craft, naturalWidth) }
                      : undefined
                  }
                  transition={spring}
                  type="button"
                  onClick={(e) => {
                    if (isActive) {
                      close();
                      return;
                    }
                    const video = e.currentTarget.querySelector("video");
                    setNaturalWidth(video?.videoWidth || null);
                    if (elevationTimer.current)
                      window.clearTimeout(elevationTimer.current);
                    setElevated(craft.slug);
                    setActive(craft);
                  }}
                >
                  <CraftTile craft={craft} expanded={isActive} />
                  {isActive ? (
                    <p className="from-bg via-bg/70 to-bg/0 -mx-3 bg-linear-to-b px-3 pt-2 pb-6 text-xs lowercase text-[color-mix(in_oklab,var(--color-text-tertiary),var(--color-text-secondary))]">
                      {craft.title}
                      {craft.caption && <span> &middot; {craft.caption}</span>}
                    </p>
                  ) : (
                    <TileCaption craft={craft} />
                  )}
                </motion.button>
              </div>
              {/* zero-height full-width flex item forces the next row */}
              {craft.breakAfter && (
                <div aria-hidden className="hidden h-0 w-full md:block" />
              )}
            </Fragment>
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
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              {hoverCaption}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden
            className="bg-bg/90 fixed inset-0 z-40 cursor-zoom-out backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={close}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="close"
              className="hitbox text-text-tertiary hover:text-text-primary fixed top-6 right-6 z-60 flex size-8 items-center justify-center transition-colors duration-150 ease-out"
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={close}
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
              className="hitbox text-text-tertiary hover:text-text-primary fixed right-6 bottom-6 z-60 text-xs tracking-widest uppercase transition-colors duration-150 ease-out"
              exit={{ opacity: 0, transition: { duration: 0.08 } }}
              initial={{ opacity: 0 }}
              type="button"
              onClick={close}
            >
              close
            </motion.button>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
