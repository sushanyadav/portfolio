# Responsive Component

Generate a responsive React component from 1-3 Figma frames (desktop, tablet, mobile).

## Trigger

Say any of these:

- "create responsive component"
- "build component from figma"
- "extract component"
- "use responsive-component skill"

Requires: Figma MCP connection

---

## Dependencies

**This skill uses Tailwind CSS v4.** Always follow the rules in `tailwind-v4-skill.md`:

- Use v4 utility names (e.g., `bg-linear-*` not `bg-gradient-*`, `shadow-xs` not `shadow-sm`)
- Use line-height modifiers (`text-base/7` not `leading-7`)
- Use gap utilities (not `space-x-*`)
- Use opacity modifiers (`bg-black/50` not `bg-opacity-50`)
- Use `min-h-dvh` (not `min-h-screen`)

Refer to tailwind-v4-skill.md for full breakdown.

---

## Figma Tools (Auto-Adapt)

The skill automatically adapts based on selection complexity:

### Small/Medium Components (< 50 layers)

- **`get_design_context`** - Extract structure, spacing, typography, layout details
- **`get_screenshot`** - Visual reference

### Large/Complex Components (50+ layers)

- **`get_screenshot` only** - Avoid token limit errors
- Estimate values visually from screenshot

### How to Detect

1. First call `get_design_context`
2. If it succeeds → use the data
3. If token error or truncated → fall back to `get_screenshot` only

---

## Execution Checklist (MUST FOLLOW)

**Every time this skill runs, follow these steps in order:**

### Step 1: Ask User to Select Desktop Design

- [ ] **ASK:** "Please select the **desktop** version of your component in Figma, then say 'ready'."
- [ ] **CRITICAL: NEVER call ANY Figma MCP tools before user confirms "ready"**
- [ ] **DO NOT assume anything is pre-selected** - always ask first, even if user seems to have selected something
- [ ] **If user has already selected**, they will mention it - but still wait for explicit "ready" confirmation
- [ ] Wait for user response before proceeding

### Step 2: Get Desktop Design

- [ ] **FIRST: Call `get_design_context`** to get actual values (font sizes, spacing, colors)
- [ ] **NEVER guess values from screenshots alone** - always try `get_design_context` first
- [ ] If successful → use the actual data (e.g., `60px` not "looks like text-6xl")
- [ ] If token error → fall back to `get_screenshot` only, then you may estimate
- [ ] Call `get_screenshot` for visual reference
- [ ] Describe the component structure with actual values from design context
- [ ] Identify key elements (layout, text, images, buttons, etc.)

### Step 3: Ask for Tablet

- [ ] **ASK:** "Now select the **tablet** version of this component in Figma, then say 'ready'. Or say 'skip' if not available."
- [ ] Wait for user response
- [ ] If "ready" → call `get_design_context` to get actual tablet values, then `get_screenshot`
- [ ] If "skip" → proceed to Step 4

### Step 4: Ask for Mobile

- [ ] **ASK:** "Now select the **mobile** version of this component in Figma, then say 'ready'. Or say 'skip' if not available."
- [ ] Wait for user response
- [ ] If "ready" → call `get_design_context` to get actual mobile values, then `get_screenshot`
- [ ] If "skip" → proceed to Step 5

### Step 5: Ask for Component Name

- [ ] **ASK:** "What should this component be called? (e.g., FeatureCard, TestimonialBlock)"
- [ ] Wait for user response

### Step 6: Ask About Text Content

- [ ] **If the component contains text content**, ASK: "Should the text be hardcoded or passed as children?"
  - **Hardcode text** - The exact text from Figma is built into the component
  - **Pass as children** - Component accepts children prop for flexible text content
- [ ] Wait for user response
- [ ] Skip this step if component has no significant text content (e.g., icon-only, image-only)

### Step 7: Check Existing Structure & Ask for Output Path

- [ ] **FIRST:** Run `ls src/modules/` to see existing page modules
- [ ] **FIRST:** Run `ls src/common/components/` to see existing shared components
- [ ] **ASK:** "Where should this component live?" and **list existing folders**:
  - `src/common/components/[component-name]/` (shared component)
  - `src/modules/[existing-page]/components/` (list actual existing modules like `homepage`)
- [ ] **IMPORTANT:** If user says a name similar to an existing folder (e.g., "home" when "homepage" exists), use the existing folder
- [ ] Wait for user response

### Step 8: Analyze & Generate

- [ ] Determine if compound components are needed (complex layouts with distinct parts)
- [ ] Generate mobile-first responsive code
- [ ] Create component file(s)

**CRITICAL:**

- **ALWAYS ask for tablet/mobile** - never skip asking, even for simple components
- **Tablet/mobile are optional** - user can say "skip" and that's fine
- **Only interpolate AFTER user says skip** - never guess without asking first
- If user skips, you may interpolate reasonable responsive values

---

## Code Generation Rules

### Use Exact Figma Values (1:1)

**Match Figma values exactly - no rounding.**

Convert px to rem (divide by 16) and use predefined utility if it matches exactly:

| Figma px | rem      | Tailwind Class (if exact match) |
| -------- | -------- | ------------------------------- |
| 12px     | 0.75rem  | `text-xs`                       |
| 14px     | 0.875rem | `text-sm`                       |
| 16px     | 1rem     | `text-base`                     |
| 18px     | 1.125rem | `text-lg`                       |
| 20px     | 1.25rem  | `text-xl`                       |
| 24px     | 1.5rem   | `text-2xl`                      |
| 30px     | 1.875rem | `text-3xl`                      |
| 36px     | 2.25rem  | `text-4xl`                      |
| 48px     | 3rem     | `text-5xl`                      |
| 60px     | 3.75rem  | `text-6xl`                      |
| 72px     | 4.5rem   | `text-7xl`                      |
| 96px     | 6rem     | `text-8xl`                      |
| 128px    | 8rem     | `text-9xl`                      |

**Rules:**

1. **1:1 with Figma** - never round or approximate values
2. Use predefined utility ONLY if Figma value matches exactly (e.g., 60px → `text-6xl`)
3. Use arbitrary rem value if no exact match (e.g., 58px → `text-[3.625rem]`)
4. Always convert px to rem: `px / 16 = rem`
5. Same applies to spacing, sizing, etc.

### Mobile-First Responsive

Always start with mobile styles as base, then add breakpoint modifiers:

```tsx
// ✅ Correct: mobile-first
className = 'flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8';

// ❌ Wrong: desktop-first
className = 'flex flex-row gap-8 max-md:flex-col max-md:gap-4';
```

### Breakpoint Mapping

| Frames Available | Approach                                                 |
| ---------------- | -------------------------------------------------------- |
| Desktop only     | Base styles, interpolate responsive values               |
| Desktop + Mobile | Mobile as base, `lg:` for desktop                        |
| Desktop + Tablet | Mobile interpolated, `md:` for tablet, `lg:` for desktop |
| All three        | Mobile as base, `md:` for tablet, `lg:` for desktop      |

### Use cn() Utility

Always use `cn()` for class merging:

```tsx
import { cn } from '@/common/functions/cn';

export function Component({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        'md:flex-row md:gap-6',
        'lg:gap-8',
        className,
      )}
    >
      {/* content */}
    </div>
  );
}
```

### Named Exports Only

```tsx
// ✅ Correct
export function FeatureCard() {}

// ❌ Wrong
export default function FeatureCard() {}
```

### Props Pattern

```tsx
import { type PropsWithChildren } from 'react';

type ComponentProps = PropsWithChildren<{
  className?: string;
}>;

export function Component({ children, className }: ComponentProps) {
  // ...
}
```

---

## Compound Components

When the component has distinct parts (media, content, actions), split into composable sub-components:

### When to Use Compound Components

- Component has 3+ distinct sections
- Sections might be reordered or hidden in different contexts
- Complex layout with nested flex/grid structures

### Naming Convention

```tsx
// Root container
export function CardRoot({ children, className }: ComponentProps) {}

// Sub-components
export function CardMedia({ children, className }: ComponentProps) {}
export function CardContent({ children, className }: ComponentProps) {}
export function CardActions({ children, className }: ComponentProps) {}
```

### Example: Feature Card

```tsx
import { cn } from '@/common/functions/cn';
import { type PropsWithChildren } from 'react';

type FeatureCardProps = PropsWithChildren<{ className?: string }>;

export function FeatureCardRoot({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        'md:flex-row md:gap-6',
        'lg:gap-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureCardMedia({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'order-last aspect-video w-full',
        'md:order-first md:w-1/2',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function FeatureCardContent({ children, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-3',
        'md:w-1/2',
        className,
      )}
    >
      {children}
    </div>
  );
}
```

### Usage

```tsx
<FeatureCardRoot>
  <FeatureCardMedia>
    <Image src="..." alt="..." fill className="object-cover" />
  </FeatureCardMedia>
  <FeatureCardContent>
    <h3>Title</h3>
    <p>Description</p>
  </FeatureCardContent>
</FeatureCardRoot>
```

---

## Common Responsive Patterns

### Order Changes

```tsx
// Mobile: content first, media last
// Desktop: media first, content last
className = 'order-last md:order-first';
```

### Width Constraints

```tsx
// Mobile: full width
// Tablet: fixed width
// Desktop: flex-based
className = 'w-full md:w-60 lg:flex-1';
```

### Display/Visibility

```tsx
// Hidden on mobile, visible on tablet+
className = 'hidden md:block';

// Visible on mobile, hidden on tablet+
className = 'md:hidden';
```

### Sizing

```tsx
// Responsive icon/avatar sizes
className = 'size-10 md:size-12 lg:size-14';
```

### Spacing

```tsx
// Responsive gaps
className = 'gap-4 md:gap-6 lg:gap-8';

// Responsive padding
className = 'p-4 md:p-6 lg:p-8';
```

### Typography

```tsx
// Responsive text sizes
className = 'text-sm md:text-base lg:text-lg';

// Responsive headings
className = 'text-xl md:text-2xl lg:text-3xl';
```

### Flex Direction

```tsx
// Stack on mobile, row on desktop
className = 'flex flex-col md:flex-row';
```

### Grid Columns

```tsx
// 1 col mobile, 2 col tablet, 3 col desktop
className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
```

---

## Output Structure

### Simple Component

```text
src/common/components/
└── feature-card/
    └── index.tsx
```

### Compound Component

```text
src/common/components/
└── feature-card/
    ├── index.tsx          # Re-exports all parts
    ├── feature-card-root.tsx
    ├── feature-card-media.tsx
    └── feature-card-content.tsx
```

Or all in one file if small:

```text
src/common/components/
└── feature-card/
    └── index.tsx          # All compound parts in one file
```

### Page-Specific Component

```text
src/modules/[page]/components/
└── testimonial-card.tsx
```

---

## Simple Component Template

```tsx
import { cn } from '@/common/functions/cn';
import { type PropsWithChildren } from 'react';

type ComponentNameProps = PropsWithChildren<{
  className?: string;
}>;

export function ComponentName({ children, className }: ComponentNameProps) {
  return (
    <div
      className={cn(
        // Mobile styles (base)
        'flex flex-col gap-4 p-4',
        // Tablet styles
        'md:flex-row md:gap-6 md:p-6',
        // Desktop styles
        'lg:gap-8 lg:p-8',
        // Allow override
        className,
      )}
    >
      {children}
    </div>
  );
}
```

---

## Conversation Flow Example

```text
Claude: "Please select the **desktop** version of your component in Figma, then say 'ready'."

User:   "ready"

Claude: [Gets desktop design context + screenshot]
        "I see a feature card with:
        - Left side: image/illustration (320x200)
        - Right side: heading (24px), description (16px), CTA button
        - Gap: 24px, padding: 32px

        Now select the **tablet** version of this component."

User:   "ready"

Claude: [Gets tablet design context + screenshot]
        "Got it. Tablet shows same layout but:
        - Gap reduced to 16px
        - Padding: 24px

        Now select the **mobile** version."

User:   "ready"

Claude: [Gets mobile design context + screenshot]
        "Mobile stacks vertically:
        - Image on top (full width)
        - Content below
        - Gap: 12px, padding: 16px

        What should this component be called?"

User:   "FeatureCard"

Claude: "Should the text be hardcoded or passed as children?
        - Hardcode text (built into component)
        - Pass as children (flexible content)"

User:   "Pass as children"

Claude: "Where should this component live?
        - src/common/components/feature-card/ (shared)
        - src/modules/[page]/components/ (page-specific)"

User:   "common/components"

Claude: [Generates responsive component code]
        "Created FeatureCard with compound components:
        - FeatureCardRoot
        - FeatureCardMedia
        - FeatureCardContent"
```

---

## Important Notes

- **ALWAYS use `get_design_context` first**: Get actual values (px, colors), never guess from screenshots
- **Mobile-first always**: Base styles are mobile, add `md:` and `lg:` for larger
- **Use `cn()` for all classes**: Never string interpolation
- **Named exports only**: No default exports
- **Compound when complex**: Split into parts for flexibility
- **ALWAYS ask for tablet/mobile**: Never skip, never guess - let user decide to skip
- **Check existing folders**: Always check `src/modules/` and `src/common/components/` before creating new directories
- **Match existing naming**: If user says "home" but "homepage" exists, use "homepage"
- **Follow Tailwind v4 rules**: Reference `tailwind-v4-skill.md` for all CSS utilities
- **1:1 with Figma**: Never round - use exact values from design
- **Use predefined utilities only if exact match**: 60px = `text-6xl`, but 58px = `text-[3.625rem]`
- **Always use rem**: Convert px to rem (px / 16), never use px in code
