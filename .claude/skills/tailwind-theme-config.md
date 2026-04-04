# Tailwind Theme Config

Extract ALL design tokens from Figma and configure Tailwind v4 theme. Nothing should be missed.

## Trigger

- "extract tailwind config from figma"
- "setup tailwind from figma"
- "extract colors from figma"
- "configure theme"

Requires: Figma MCP connection

**Related:** See `tailwind-v4-skill.md` for v4 syntax rules.

---

## Tool Usage

**Required tools:**

1. `get_variable_defs()` → Primary source for ALL design tokens (colors, fonts, sizes)
2. `get_screenshot()` → Visual verification to catch any missing colors

**Optional tool:**

- `get_design_context(dirForAssetWrites: "{project}/public/images")` → Only if you need to export image/SVG assets

**Note:** The `get_design_context` tool returns structural metadata (frames, positions, text) but does NOT include color values. All colors come from `get_variable_defs`.

---

## Step 1: Extract Figma Variables

```text
Call: get_variable_defs()
```

Returns named tokens like:

```text
{'brand/primary': #3b82f6, 'text/secondary': #6b7280, 'font/size/lg': '20', ...}
```

**Store ALL of these.** These become your design tokens for:

- Colors (any key containing hex values like `#xxxxxx`)
- Font families (`font/family/*`)
- Font sizes (`font/size/*`)
- Font weights (`font/weight/*`)
- Typography presets (`heading/*`, `body/*`)
- Tints/opacity (`tint/*`)
- Shadows (`shadow/*`)

---

## Step 2: Take Screenshot for Verification

```text
Call: get_screenshot()
```

Compare the screenshot visually against your extracted variables:

- Identify all visible colors in the design
- Check if any colors appear that are NOT in your variable list

### If Colors Are Missing from Variables

Some designs have hardcoded colors in SVG assets. If you see a color in the screenshot that's not in variables:

1. First, export assets (if not already done):

   ```text
   Call: get_design_context(dirForAssetWrites: "{project}/public/images")
   ```

2. Search for the missing color in exported SVGs:

   ```bash
   grep -ril "#HEXCODE" {project}/public/images/*.svg
   ```

3. Only add design-relevant colors (skip third-party logos like Slack/Google icons)

---

## Step 3: Create Complete Color List

Output a table of all extracted colors:

| Source    | Color   | Variable Name  | Suggested Token   |
| --------- | ------- | -------------- | ----------------- |
| Variables | #3b82f6 | brand/primary  | `--color-primary` |
| Variables | #6b7280 | text/secondary | `--color-muted`   |
| Variables | #ffffff | white          | `--color-white`   |
| SVG Asset | #e32c2c | (none)         | `--color-error`   |

**For colors without semantic variable names:**

- Infer meaning from the variable path or usage
- Or keep as brand color with descriptive name

---

## Step 4: Extract Typography

From `get_variable_defs`, extract:

- `font/family/*` → Font families
- `font/size/*` → Font sizes (convert px to rem: divide by 16)
- `font/weight/*` → Font weights
- `heading/*`, `body/*` → Typography presets (parse the Font() format)

Typography preset format:

```text
Font(family: "FontName", style: StyleName, size: token, weight: number, lineHeight: number, letterSpacing: number)
```

---

## Step 5: Ask Dark Mode Support (Only User Question)

**ASK:** "Does this project support dark mode?"

- No
- Yes

---

## Step 6: Find Project Theme File

Look for existing theme configuration:

- `**/theme.css`
- `**/globals.css`
- `**/tailwind.config.*`

Preserve existing structure (breakpoints, easing, etc.) and add extracted tokens.

---

## Step 7: Update Theme File

### Tailwind v4 Structure

**IMPORTANT:** Group related tokens in single `@theme` directives. All colors belong in ONE `@theme` block.

```css
/* FONTS */
@theme {
  --font-sans: var(--font-{body-font});
  --font-heading: var(--font-{heading-font});
}

/* FONT SIZES */
@theme {
  --font-size-xs: {value}rem;
  --font-size-sm: {value}rem;
  /* ... all sizes from Figma */
}

/* LINE HEIGHTS */
@theme {
  --line-height-tight: {value};
  --line-height-normal: {value};
  /* ... all line heights from Figma */
}

/* COLORS - All in ONE @theme block */
@theme {
  /* Semantic */
  --color-background: {value};
  --color-foreground: {value};
  --color-primary: {value};
  --color-secondary: {value};
  --color-muted: {value};
  --color-border: {value};
  --color-accent: {value};

  /* Scales (50-950) */
  --color-{name}-50: {value};
  --color-{name}-100: {value};
  /* ... complete scale */

  /* Brand */
  --color-{figma-name}: {value};

  /* Tints/Opacity */
  /* ... all tint variations */
}
```

---

## Step 8: Create Font Files (if needed)

For each font family from Figma, determine if it's a **Google Font** or **Custom/Local Font**.

### Option A: Google Fonts

```typescript
// src/lib/fonts.ts
import { Inter, Playfair_Display } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // weights from Figma
  variable: '--font-inter',
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-playfair',
  display: 'swap',
});
```

### Option B: Local/Custom Fonts

Place font files in `src/lib/fonts/` directory, then:

```typescript
// src/lib/fonts.ts
import localFont from 'next/font/local';

export const abcArizona = localFont({
  src: [
    {
      path: './fonts/ABCArizonaText-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/ABCArizonaText-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/ABCArizonaText-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-abc-arizona',
  display: 'swap',
});

// For variable fonts (single file with weight range)
export const customFont = localFont({
  src: './fonts/CustomFontVariable.woff2',
  variable: '--font-custom',
  display: 'swap',
});
```

### Update Layout

```tsx
// src/app/layout.tsx
import { inter, abcArizona } from '@/lib/fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${abcArizona.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### How to Identify Font Type

1. **Google Font** - Common fonts like Inter, Roboto, Open Sans, Poppins, Bebas Neue, DM Mono, etc.
2. **Local Font** - Custom/proprietary fonts, fonts with "Trial" in name, fonts not on Google Fonts

**ASK the user if unsure:** "Is {font-name} a Google Font or do you have local font files?"

---

## Step 9: Create Typography Utilities (if needed)

**IMPORTANT:** Typography utilities go in `utilities.css`, NOT in `theme.css`. Theme file is only for `@theme` blocks (design tokens).

For each typography preset from Figma, add to `utilities.css`:

```css
@utility text-{preset-name} {
  font-family: var(--font-{family});
  font-size: var(--font-size-{size});
  font-weight: {weight};
  line-height: var(--line-height-{height});
}
```

---

## Step 10: Verify Build

Run project build command and check:

- [ ] Build passes
- [ ] Color utilities work
- [ ] Font utilities work
- [ ] Typography utilities work

---

## Extraction Checklist

### From get_variable_defs:

- [ ] All color variables (any value starting with `#`)
- [ ] All `font/*` variables
- [ ] All `heading/*` and `body/*` presets
- [ ] All `tint/*` and `opacity/*` variables
- [ ] All `shadow/*` variables

### From screenshot verification:

- [ ] Compared color list against screenshot
- [ ] Every visible color in screenshot is accounted for
- [ ] If missing colors found, checked SVG assets

### Final Verification:

- [ ] Total unique colors in theme: **\_**
- [ ] All fonts configured
- [ ] All typography presets created

---

## Common Figma → Tailwind Mappings

| Figma Pattern          | Tailwind Token           |
| ---------------------- | ------------------------ |
| `color/{name}/{shade}` | `--color-{name}-{shade}` |
| `text/primary`         | `--color-foreground`     |
| `text/secondary`       | `--color-muted`          |
| `bg/primary`           | `--color-background`     |
| `brand/primary`        | `--color-primary`        |
| `brand/accent`         | `--color-accent`         |
| `border/default`       | `--color-border`         |
| `font/family/heading`  | `--font-heading`         |
| `font/family/body`     | `--font-sans`            |
| `font/size/{name}`     | `--font-size-{name}`     |

---

## Important Rules

1. **All colors come from `get_variable_defs`** - This is the primary source for design tokens
2. **Screenshot is for verification** - Use it to visually confirm all colors are captured
3. **`get_design_context` is optional** - Only use it for asset export, not color extraction
4. **Hex values only** - Convert RGBA to hex, use CSS opacity for transparency
5. **Keep Figma names** - Preserve original naming for brand colors
6. **Semantic mapping** - Map common patterns to semantic tokens
7. **Complete scales** - Include ALL steps in color scales
8. **Preserve existing** - Don't modify breakpoints/easing unless requested
9. **Only one question** - Dark mode support is the only user input needed
