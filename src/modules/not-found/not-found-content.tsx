'use client';

import { motion, useMotionValue, useTransform } from 'motion/react';
import Link from 'next/link';

import { Logo } from '@/common/components/logo/logo';

// Plain offset constraints (no DOM measuring) so drag state is just x/y
// motion values — nothing goes stale on window resize.
const DRAG_BOUNDS = { top: -120, right: 140, bottom: 120, left: -140 };

export function NotFoundContent() {
  // tilt with the drag: further pull, more lean; untwists on snap-back
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-150, 150], [-20, 20]);

  return (
    <section className="grid flex-1 place-content-center justify-items-center gap-8 overflow-clip pb-24">
      <div className="flex items-center gap-3 text-7xl font-bold tracking-tight select-none md:gap-5 md:text-9xl">
        <span>4</span>
        <motion.div
          className="cursor-grab outline-none active:cursor-grabbing"
          drag
          style={{ x, rotate }}
          dragConstraints={DRAG_BOUNDS}
          dragElastic={0.2}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 400, bounceDamping: 24 }}
          transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          whileTap={{ scale: 0.85 }}
        >
          <Logo className="size-18 md:size-26" />
        </motion.div>
        <span>4</span>
      </div>

      <p className="text-text-secondary text-sm">
        this page doesn&apos;t exist.
      </p>

      <Link
        className="text-text-tertiary hover:text-text-secondary text-xs transition-colors duration-150 ease-out"
        href="/"
      >
        ← back home
      </Link>
    </section>
  );
}
