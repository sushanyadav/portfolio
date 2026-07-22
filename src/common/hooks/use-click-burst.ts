'use client';

import { useCallback, useEffect, useRef } from 'react';

type UseClickBurstOptions = {
  count?: number;
  distance?: number;
  duration?: number;
  cooldown?: number;
};

export function useClickBurst(options: UseClickBurstOptions = {}) {
  const {
    count = 6,
    distance = 36,
    duration = 450,
    cooldown = 100,
  } = options;

  const isAnimating = useRef(false);
  const styleSheet = useRef<HTMLStyleElement | null>(null);
  const insertedAnimations = useRef<Set<string>>(new Set());

  const getStyleSheet = useCallback(() => {
    if (!styleSheet.current) {
      styleSheet.current = document.createElement('style');
      document.head.appendChild(styleSheet.current);
    }
    return styleSheet.current;
  }, []);

  useEffect(() => {
    return () => {
      if (styleSheet.current?.parentNode) {
        styleSheet.current.parentNode.removeChild(styleSheet.current);
      }
    };
  }, []);

  const ensureAnimation = useCallback(
    (name: string, keyframes: string) => {
      if (insertedAnimations.current.has(name)) return;

      const sheet = getStyleSheet();
      if (!sheet.sheet) return;

      sheet.sheet.insertRule(
        `@keyframes ${name} { ${keyframes} }`,
        sheet.sheet.cssRules.length,
      );
      insertedAnimations.current.add(name);
    },
    [getStyleSheet],
  );

  const makeBlock = useCallback(
    (pos: { x: number; y: number }, angle: number, dist: number, size: number, delay: number) => {
      const el = document.createElement('div');
      const tx = Math.cos((angle * Math.PI) / 180) * dist;
      const ty = Math.sin((angle * Math.PI) / 180) * dist;
      const name = `block_${Math.round(angle)}_${Math.round(dist)}`;

      ensureAnimation(
        name,
        `0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
         100% { transform: translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0); opacity: 0; }`,
      );

      el.setAttribute('aria-hidden', 'true');
      el.style.cssText = `position:absolute;left:${pos.x}px;top:${pos.y}px;width:${size}px;height:${size}px;pointer-events:none;z-index:50;background:var(--color-accent);animation:${name} ${duration}ms ease-out ${delay}ms both;`;

      document.body.append(el);
      setTimeout(() => el.remove(), duration + delay + 100);
    },
    [ensureAnimation, duration],
  );

  const doBurst = useCallback(
    (x: number, y: number) => {
      if (isAnimating.current) return;

      const pos = { x, y };

      for (let i = 0; i < count; i++) {
        const angle = (360 / count) * i + (Math.random() * 30 - 15);
        const dist = distance * (0.6 + Math.random() * 0.6);
        const size = 4 + Math.random() * 6;
        const delay = Math.random() * 50;
        makeBlock(pos, angle, dist, size, delay);
      }

      isAnimating.current = true;
      setTimeout(() => {
        isAnimating.current = false;
      }, cooldown);
    },
    [count, distance, makeBlock, cooldown],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'touch') return;
      if (e.button > 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
        return;
      if ((e.target as Element).closest?.('[role="dialog"]')) return;
      doBurst(e.pageX, e.pageY);
    },
    [doBurst],
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      // bursting inside a modal mutates the DOM mid-tap, which makes iOS
      // swallow the tap's click — the overlay then needs a second tap to close
      if ((e.target as Element).closest?.('[role="dialog"]')) return;
      doBurst(touch.pageX, touch.pageY);
    },
    [doBurst],
  );

  return { onPointerDown, onTouchStart };
}
