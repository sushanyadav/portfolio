# Sequence Animation Builder

Build GSAP-powered sequence animations from natural language descriptions. Creates timeline-based animations with cursor interactions, typing effects, and multi-step UI reveals.

## Usage

```text
"build a sequence animation"
"create an animation sequence for..."
"animate the onboarding flow"
```

---

## How It Works

1. **Describe the animation** in natural language
2. **Choose output type**: Full component or timeline only
3. **Review and refine** the generated code

---

## Animation Pattern Reference

### Core Dependencies

```tsx
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import { gsap } from '@/common/lib/gsap'; // Custom GSAP setup with effects
```

### Timeline Structure

```tsx
const tl = gsap.timeline({
  onStart: () => {
    // Reset state, hide interactive elements
  },
  onComplete: () => {
    // Set animation complete, show interactive elements
  },
  defaults: {
    duration: 0.15,
    ease: 'easeOutQuad',
  },
});
```

### Common Animation Phases

| Phase           | Description                              | Typical Duration |
| --------------- | ---------------------------------------- | ---------------- |
| Element appears | Fade in, optionally with position offset | 0.2-0.35s        |
| Cursor moves    | Animate to new position                  | 0.3-0.5s         |
| Cursor click    | Scale down/up effect                     | 0.2s             |
| Text typing     | Character reveal with caret              | 0.05s per char   |
| Container slide | Translate to reveal content              | 0.35s            |
| Step transition | Fade out/in with indicators              | 0.2s             |

### Entrance Animations

```tsx
// Simple fade in
tl.to('#element', { opacity: 1, duration: 0.2 });

// Fade in with slide up
tl.to('#element', { opacity: 1, y: 0, duration: 0.3, ease: 'easeOutQuad' });

// Bounce entrance (for emphasis)
tl.to('#element', { opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.2)' });

// Scale in
tl.fromTo(
  '#element',
  { scale: 0.8, opacity: 0 },
  { scale: 1, opacity: 1, duration: 0.25 },
);
```

### Overlapping Elements (Grid Stack)

When elements need to overlap and swap visibility, **always use grid with `[grid-area:1/1]`**:

```tsx
// JSX - elements stacked in same position
<div className="grid">
  <div className="[grid-area:1/1]" id="state-1" style={{ opacity: 1 }}>
    First state content
  </div>
  <div className="[grid-area:1/1]" id="state-2" style={{ opacity: 0 }}>
    Second state content
  </div>
  <div className="[grid-area:1/1]" id="state-3" style={{ opacity: 0 }}>
    Third state content
  </div>
</div>;

// Timeline - swap between states
tl.to('#state-1', { opacity: 0, duration: 0.2 })
  .to('#state-2', { opacity: 1, duration: 0.2 }, '<+=0.1')
  // Later...
  .to('#state-2', { opacity: 0, duration: 0.2 })
  .to('#state-3', { opacity: 1, duration: 0.2 }, '<+=0.1');
```

**Use cases:**

- Swapping text content (e.g., "Loading..." → "Done!")
- Multi-step forms showing one step at a time
- Typing indicator → actual message
- Loading skeleton → real content

### Typing Animation

```tsx
// Container setup (JSX)
<span id="typed-text-container" style={{ width: 0, overflow: 'hidden' }}>
  {TYPED_TEXT}
</span>
<span className="input-caret" style={{ opacity: 0 }}>|</span>

// Timeline
const textLength = TYPED_TEXT.length;
const fullWidth = typedTextContainer.scrollWidth;

tl.to('.input-caret', { opacity: 1, duration: 0.1 })
  .to(typedTextContainer, {
    width: fullWidth,
    duration: textLength * 0.05,
    ease: `steps(${textLength})`,
  }, '<+=0.1')
  .to('.input-caret', {
    keyframes: [
      { opacity: 1 }, { opacity: 0 },
      { opacity: 1 }, { opacity: 0 },
    ],
    duration: 1.6,
    ease: 'none',
  }, '<');
```

### Custom Cursor Setup

The animated cursor must be:

- **Absolutely positioned** within the animation scope
- **pointer-events-none** so it doesn't block clicks on actual elements
- **High z-index** to appear above all content
- **Initially hidden** (opacity: 0) until animation reveals it
- **Has a ref** for GSAP targeting and position updates

```tsx
// CustomCursor component
export function CustomCursor({
  ref,
}: {
  ref?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="pointer-events-none absolute z-50"
      id="cursor-icon"
      style={{ opacity: 0 }}
    >
      {/* Your cursor icon - SVG or image */}
      <CursorIcon className="size-5 md:size-7" />
    </div>
  );
}

// Usage in parent component
const cursorRef = useRef<HTMLDivElement>(null);

return (
  <div ref={scopeRef} className="relative">
    {/* Animation content */}
    <CustomCursor ref={cursorRef} />
  </div>
);
```

### Cursor Movement & Click (FLIP Pattern)

When cursor moves to different parts of the component, use this FLIP-style pattern:

1. **Hide** cursor (opacity 0)
2. **Reposition** cursor to new location (via CSS classes)
3. **Offset** cursor from target (x/y offset)
4. **Reveal** cursor while animating offset to 0 (creates "moving towards" effect)

```tsx
// Cursor position setter utility
const setCursorPosition = createCursorPositionSetter(cursorRef);

// FLIP pattern: Cursor "teleports" to new area, then animates in
tl.to('#cursor-icon', { opacity: 0, scale: 0.8, duration: 0.15 }) // Hide
  .set('#cursor-icon', {
    x: 40, // Offset from target
    y: 40,
    scale: 1,
    onComplete: () => setCursorPosition('bottom-4 right-8'), // New position
  })
  .to('#cursor-icon', {
    x: 0, // Animate offset to 0
    y: 0,
    opacity: 1, // Reveal while moving
    duration: 0.3,
    ease: 'easeOutQuad',
  });

// Alternative: Use keyframes for cleaner syntax
tl.to('#cursor-icon', {
  keyframes: [
    { x: 40, y: 40, opacity: 0, duration: 0 }, // Instant: offset + hidden
    { x: 0, y: 0, opacity: 1, duration: 0.3, ease: 'easeOutQuad' }, // Animate in
  ],
  onStart: () => setCursorPosition('bottom-4 right-8'),
});

// Click effect (registered GSAP effect)
tl.cursorClick('#cursor-icon').buttonPress(
  '#target-button',
  { scaleDown: 0.9 },
  '<',
);

// After click, hide cursor before next move
tl.to('#cursor-icon', { opacity: 0, scale: 0.8, duration: 0.15 });
```

**Why this pattern:**

- Avoids animating cursor across entire screen (looks unnatural)
- Creates illusion of cursor "arriving" from off-screen direction
- Offset direction should match where cursor "came from"

### Multi-Step Query Card

```tsx
// Step data structure
const STEPS = [
  {
    question: 'What should the page include?',
    suggestions: [['Option A', 'Option B'], ['Option C']],
    selectedIndex: 0,
    selectedItemIndex: 1,
  },
  // ... more steps
];

// Transition between steps
tl.to('#step-1', { opacity: 0, duration: 0.2 })
  .to('#step-2', { opacity: 1, duration: 0.2 }, '<+=0.1')
  .to('#indicator-1', { width: 8, duration: 0.25 }, '<')
  .to('#indicator-2', { width: 30, duration: 0.25 }, '<');
```

### Container Translation (Reveal Content)

```tsx
// Calculate heights for translation
const h = {
  message1: getHeight('#message-1'),
  response: getHeight('#response'),
  card: getHeight('#card'),
};

const totalHeight = h.message1 + h.response + h.card;

// Start pushed down, translate up to reveal
tl.set('#container', { y: totalHeight })
  .to('#message-1', iosPopIn)
  .to('#container', { y: totalHeight - h.message1, duration: 0.35 }, '<');
```

### Responsive Breakpoints

```tsx
useGSAP(
  () => {
    const mm = gsap.matchMedia();

    mm.add('(max-width: 767px)', () => {
      const tl = buildTimeline(true); // isMobile = true
      return tl;
    });

    mm.add('(min-width: 768px)', () => {
      const tl = buildTimeline(false); // isMobile = false
      return tl;
    });

    return () => mm.revert();
  },
  { scope: scopeRef },
);
```

### State Management (Optional - Zustand Store)

**When you need a store:**

- Replay functionality (user can restart animation)
- Interactive elements after animation completes
- Multiple components need to know animation state
- Dynamic content that changes during animation

**When you DON'T need a store:**

- Simple one-shot animations
- No replay button
- No post-animation interactivity

```tsx
// Store definition (only if needed)
import { create } from 'zustand';

type AnimationStore = {
  isAnimationComplete: boolean;
  setAnimationComplete: (value: boolean) => void;
  replay: () => void;
  // Add more state as needed for your specific animation
};

export const useAnimationStore = create<AnimationStore>((set) => ({
  isAnimationComplete: false,
  setAnimationComplete: (value) => set({ isAnimationComplete: value }),
  replay: () => set({ isAnimationComplete: false }),
}));

// Usage in component
const { isAnimationComplete, setAnimationComplete, replay } =
  useAnimationStore();

// In timeline callbacks
const tl = gsap.timeline({
  onStart: () => setAnimationComplete(false),
  onComplete: () => setAnimationComplete(true),
});

// Replay button
useEffect(() => {
  if (!isAnimationComplete && timelineRef.current) {
    timelineRef.current.restart();
  }
}, [isAnimationComplete]);
```

---

## Required Setup (Auto-Create If Missing)

Before generating animation code, check if these files exist. **If not, create them automatically.**

### 1. GSAP Setup - `src/common/lib/gsap.ts`

Check: `src/common/lib/gsap.ts`

If missing, create with:

```tsx
'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger, CustomEase);

CustomEase.create('easeOutQuad', '0,0,0.2,1');
CustomEase.create('easeOutSmooth', '0.68, -0.05, 0.22, 1.1');

gsap.defaults({
  duration: 0.4,
  ease: 'easeOutQuad',
});

// Cursor click effect
gsap.registerEffect({
  name: 'cursorClick',
  effect: (targets, config) => {
    return gsap.to(targets, {
      keyframes: [
        { scale: config.scaleDown, duration: config.duration / 2 },
        { scale: 1, duration: config.duration / 2 },
      ],
      transformOrigin: '0% 0%',
    });
  },
  defaults: { scaleDown: 0.8, duration: 0.2 },
  extendTimeline: true,
});

// Button press effect
gsap.registerEffect({
  name: 'buttonPress',
  effect: (targets, config) => {
    return gsap.to(targets, {
      keyframes: [
        { scale: config.scaleDown, duration: config.duration / 2 },
        { scale: 1, duration: config.duration / 2 },
      ],
    });
  },
  defaults: { scaleDown: 0.9, duration: 0.2 },
  extendTimeline: true,
});

export { gsap, ScrollTrigger, useGSAP };
```

### 2. Animation Utils - `src/common/lib/animation-utils.ts`

Check: `src/common/lib/animation-utils.ts`

If missing, create with:

```tsx
const POSITION_CLASS_REGEX =
  /\b(max-)?(md:|lg:|xl:|)?(top|right|bottom|left)-[^\s]+/g;

export const createCursorPositionSetter = (
  cursorRef: React.RefObject<HTMLElement | null>,
) => {
  return (classes: string) => {
    const el = cursorRef.current;
    if (!el) return;
    el.className = `${el.className.replace(POSITION_CLASS_REGEX, '').trim()} ${classes}`;
  };
};
```

### 3. NPM Packages

Check if GSAP packages are installed. If not, install:

```bash
pnpm add gsap @gsap/react
```

---

## Workflow

When generating a sequence animation:

1. **Check setup** - Verify files exist, create if missing, install packages if needed
2. **Ask output type** - Full component or timeline only?
3. **Understand the animation** - What should happen step by step?
4. **Generate code** - Following patterns above

**Questions to ask the user:**

1. **Output type**: Full component or timeline only?
2. **Animation description**: What should happen step by step?
3. **Elements involved**: Chat messages, cards, buttons, etc.?
4. **Responsive needs**: Different behavior on mobile?

Then generate code following the patterns above, with:

- Unique element IDs for all animated elements
- Proper timing and easing
- State management integration (if needed)
- Replay functionality (if needed)
- Responsive breakpoints if needed

---

## Example Prompts

- "Create an animation where a user types a message, sends it, and gets a response with a typing indicator"
- "Build a multi-step form animation with 3 questions and cursor clicking through suggestions"
- "Animate a card sliding in, expanding to show details, then a button being clicked"
