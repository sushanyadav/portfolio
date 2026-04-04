# Page Layout

> **DO NOT call `get_design_context` or `get_metadata`**
>
> These tools return 80k+ tokens and WILL cause "file exceeds maximum tokens" errors.
>
> **ONLY call `mcp__figma-desktop__get_screenshot`** - nothing else.
>
> This is a VISUAL workflow. Screenshots provide all the information needed.

---

Extract layout structure from Figma **one level at a time** based on what's selected.

## Trigger

Say any of these:

- "extract page layout"
- "extract sections from figma"
- "build page structure"
- "use page-layout skill"

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

## Execution Checklist (MUST FOLLOW)

**Every time this skill runs, follow these steps in order:**

### Step 1: Get Desktop Screenshot

- [ ] Call `get_screenshot`
- [ ] List identified sections (exclude header/footer)
- [ ] Show sections table

### Step 2: Ask for Tablet

- [ ] **ASK:** "Now select the **tablet** version of this same frame in Figma, then say 'ready'. Or say 'skip' if not available."
- [ ] Wait for user response
- [ ] If "ready" → get screenshot
- [ ] If "skip" → proceed to Step 3

### Step 3: Ask for Mobile

- [ ] **ASK:** "Now select the **mobile** version of this same frame in Figma, then say 'ready'. Or say 'skip' if not available."
- [ ] Wait for user response
- [ ] If "ready" → get screenshot
- [ ] If "skip" → proceed to Step 4

### Step 4: Check Existing Modules & Ask for Page Name

- [ ] **FIRST:** Run `ls src/modules/` to see existing page modules
- [ ] **ASK:** "Which page should these sections go in?" and **list existing modules** (e.g., if `homepage` exists, show it as an option)
- [ ] **IMPORTANT:** If user says a name similar to an existing folder (e.g., "home" when "homepage" exists), use the existing folder
- [ ] Wait for user response

### Step 5: Generate Code

- [ ] Create section wrapper files in `src/modules/[page-name]/components/`
- [ ] Update page.tsx with imports

**IMPORTANT:** Do NOT skip asking for tablet/mobile. Always ask, let user decide to skip.

---

## Core Concept: Progressive Depth

**Always extract 1 level deep from whatever is selected.**

| Selection              | Output                              |
| ---------------------- | ----------------------------------- |
| Full page frame        | Section wrappers (`<section>` only) |
| Section frame (Hero)   | Section's immediate children        |
| Element inside section | That element's immediate children   |

This allows you to progressively build up detail by drilling into specific frames.

---

## Workflow

### Phase 1: Gather Breakpoints

**IMPORTANT:** Collect available breakpoints before generating code.

#### Step 1: Get Desktop Screenshot

1. Call `get_screenshot` for current selection
2. Identify what's selected (full page, section, or element)
3. List identified sections/elements

#### Step 2: Ask for Tablet & Mobile

After desktop screenshot, **ask once:**

> "Select **tablet** version and say 'ready', or say 'skip' if not available.
> Then we'll do **mobile**."

User can respond:

- "ready" → get screenshot, then ask for mobile
- "skip" / "don't have it" → proceed to mobile
- "skip tablet and mobile" → generate with desktop only

#### Step 3: Generate Code

Generate responsive code based on available breakpoints:

| Available                 | Approach                                   |
| ------------------------- | ------------------------------------------ |
| Desktop only              | Base styles, interpolate responsive values |
| Desktop + Mobile          | Mobile-first with `lg:` modifiers          |
| Desktop + Tablet + Mobile | Full responsive with `md:` and `lg:`       |

**Note:** Tablet and mobile are optional. If user wants to skip, proceed with what's available.

---

### Phase 2: Progressive Depth

#### Full Page → Section Wrappers

**Output:** Only `<section>` containers with responsive spacing

```tsx
export const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">{/* content */}</div>
    </section>
  );
};
```

#### Section Frame → Section Children

**Output:** Section's immediate children only

```tsx
export const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          {/* Left content */}
          {/* Right content */}
        </div>
      </div>
    </section>
  );
};
```

#### Element Frame → Element Children

**Output:** That element's immediate children

```tsx
<header className="flex flex-col gap-6 lg:flex-1">
  {/* Heading */}
  {/* Subtext */}
  {/* CTA buttons */}
</header>
```

---

## Conversation Flow Example

```text
Claude: [Gets desktop screenshot]
        "I can see a full page with 7 sections: Hero, Logo Bar, Features...

        Now select the **tablet** version of this same frame in Figma."

User:   "ready"

Claude: [Gets tablet screenshot]
        "Got it. Now select the **mobile** version."

User:   "done"

Claude: [Gets mobile screenshot]
        "Perfect. Here's the responsive section structure..."
        [Generates code with all breakpoint styles]
```

---

## Quick Reference: What to Ask

| After              | Ask                                                                    |
| ------------------ | ---------------------------------------------------------------------- |
| Desktop screenshot | "Select **tablet** version, then say ready"                            |
| Tablet screenshot  | "Select **mobile** version, then say ready"                            |
| Mobile screenshot  | Generate code                                                          |
| Code generated     | "Which section to drill into?" or "Select [section] frame for details" |

---

## Section Naming

When extracting full page:

| Visual Cue                        | Section Name              | File Name          |
| --------------------------------- | ------------------------- | ------------------ |
| Large text + CTA at top           | Hero                      | `hero.tsx`         |
| Row of logos                      | Logo Bar                  | `logo-bar.tsx`     |
| Multiple alternating 2-col blocks | Features (single section) | `features.tsx`     |
| Grid of cards/capabilities        | Capabilities              | `capabilities.tsx` |
| Integrations / Support            | Enterprise                | `enterprise.tsx`   |
| Pricing tables                    | Pricing                   | `pricing.tsx`      |
| Final CTA                         | CTA                       | `cta.tsx`          |

### Grouping Rules

**Combine visually similar consecutive blocks into ONE section:**

- ✅ 3 alternating text/image blocks → 1 `features.tsx` with all 3 inside
- ✅ 4 capability cards in a grid → 1 `capabilities.tsx`
- ❌ Don't create `feature-1.tsx`, `feature-2.tsx`, `feature-3.tsx`

**When to group:**

- Same visual pattern (alternating layouts, card grids, etc.)
- Consecutive in the page flow
- Conceptually related (all "features", all "benefits", etc.)

### Skip These (Root Layout Components)

**Always skip header and footer** - they belong in the root layout, not page-specific sections:

- ❌ Header / Navigation
- ❌ Footer

These are extracted separately as layout components, not page sections.

### Naming Rules

1. **Generic names** - not content-specific
2. **Group similar layouts** - multiple alternating sections = one file
3. **Kebab-case files** - `logo-bar.tsx`
4. **PascalCase components** - `LogoBar`

---

## Output Structure

```text
src/modules/[page-name]/components/
├── hero.tsx
├── logo-bar.tsx
├── features.tsx        # All feature blocks in one file
├── capabilities.tsx    # Grid of capability cards
├── enterprise.tsx
├── pricing.tsx
└── cta.tsx
```

**Note:** Header and footer live in `src/components/layout/` or similar, not in page modules.

---

## Spacing Guide

| Section Type       | Spacing                   |
| ------------------ | ------------------------- |
| Hero / CTA         | `py-16 md:py-24 lg:py-32` |
| Standard sections  | `py-16 md:py-24`          |
| Compact (logo bar) | `py-8 md:py-12`           |

---

## Example: Progressive Extraction

### Pass 1: Full Page Selected

```tsx
export const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">{/* content */}</div>
    </section>
  );
};
```

### Pass 2: Hero Frame Selected

```tsx
export const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          {/* Left: content area */}
          {/* Right: media area */}
        </div>
      </div>
    </section>
  );
};
```

### Pass 3: Hero Content Area Selected

```tsx
export const Hero = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          <header className="flex flex-col gap-6 text-center lg:flex-1 lg:text-left">
            {/* Heading */}
            {/* Subtext */}
            {/* CTA buttons */}
          </header>
          {/* Right: media area */}
        </div>
      </div>
    </section>
  );
};
```

### Pass 4: CTA Buttons Area Selected

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
  {/* Primary button */}
  {/* Secondary button */}
</div>
```

---

## Important Notes

- **NEVER use `get_design_context`**: It returns 80k+ tokens and will error. Use `get_screenshot` ONLY.
- **1 level at a time**: Only extract immediate children of selection
- **Progressive detail**: User controls depth by selecting deeper frames
- **Screenshots only**: Use `get_screenshot` for minimal tokens
- **Verify consistency**: Same element across all 3 breakpoints
- **Generic naming**: Not content-specific
- **Comments as placeholders**: `{/* content */}` for unexpanded areas
- **Check existing folders**: Always check `src/modules/` before creating new directories
- **Match existing naming**: If user says "home" but "homepage" exists, use "homepage"
- **Follow Tailwind v4 rules**: Reference `tailwind-v4-skill.md` for all CSS utilities
