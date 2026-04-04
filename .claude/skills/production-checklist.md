# Production Readiness Check

Automated production readiness validation for Next.js projects built from the `nextjs-template`.

## Usage

```text
"run production checklist"
"check if this is production ready"
"production readiness check"
```

---

> **Note:** This checklist is typically run before launch. Most items should already be addressed.
> The goal is to catch anything that slipped through, not to find a long list of issues.

## Checks to Perform

### 1. Template Placeholders

**These values MUST be replaced before production:**

| File                              | Placeholder                                                    | Action                                    |
| --------------------------------- | -------------------------------------------------------------- | ----------------------------------------- |
| `package.json`                    | `"name": "example"`                                            | Replace with project name                 |
| `src/common/tools/seo.ts`         | `SITE_URL` fallback `'https://example.com'`                    | Set production domain                     |
| `src/common/tools/seo.ts`         | `SITE_NAME = 'Example'`                                        | Replace with site name                    |
| `src/common/tools/seo.ts`         | `SITE_DESCRIPTION = 'Example site description'`                | Replace with site description             |
| `src/common/tools/seo.ts`         | `TWITTER_HANDLE = '@wilsonhou'`                                | Add project's Twitter handle if different |
| `src/app/layout.tsx`              | `<meta content="Example" name="apple-mobile-web-app-title" />` | Replace with app name                     |
| `public/favicon/site.webmanifest` | `"name": ""` and `"short_name": ""`                            | Add app name                              |

**Assets to replace:**

- `public/opengraph-image.png` - Replace with custom OG image (1200x630)
- `public/twitter-image.png` - Replace with custom Twitter image
- `public/favicon/*` - Replace all favicon files with project branding

### 2. SEO & Meta

**Metadata on pages:**

- Find all `page.tsx` files in `src/app/`
- Verify each has `generateMetadata` or `metadata` export
- Check for: `title`, `description`, `og:*`, `twitter:*`, canonical URL

**Technical SEO files:**

- `robots.ts` exists with `allow: '/'` rule
- `sitemap.ts` exists and includes all public routes
- Structured data exists if needed (JSON-LD with Organization/Website schema)

### 3. Placeholder Content

Search entire `src/` for content that shouldn't ship:

```text
example.com
localhost
127.0.0.1
.vercel.app (in SITE_URL - should be production domain)
Lorem ipsum
placeholder.png
via.placeholder.com
```

**Check fallback descriptions** - ensure no project-unrelated copy:

- `src/app/(www)/page.tsx` - metadata should be project-specific, not "Example"

**README cleanup:**

- Remove or update template author references
- Update project description and setup instructions

### 4. Security Headers

In `next.config.ts`, verify `headers()` returns:

```text
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-DNS-Prefetch-Control: on
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Note: Vercel adds HSTS automatically on production.

### 5. Assets

**Final verification** - confirm these were replaced from template defaults:

> **Automated check**: Verifies files exist. Visual inspection required to confirm branding.

```text
public/favicon/favicon.ico
public/favicon/apple-touch-icon.png (180x180)
public/favicon/site.webmanifest (with name and short_name filled)
public/opengraph-image.png (1200x630)
public/twitter-image.png
```

### 5.5 Asset Optimization

**Run the asset optimization skill** to verify all assets meet production standards.

```text
"run asset optimization"
"check my assets"
```

> See `.claude/skills/asset-optimization.md` for full details on format recommendations, size limits, and fix commands.

**Quick reference - Key thresholds:**

| Asset Type     | Max Size | Format |
| -------------- | -------- | ------ |
| Hero/LCP Image | 200KB    | WebP   |
| Content Images | 150KB    | WebP   |
| Videos         | 2MB      | WebM   |

### 6. Code Quality

**Run commands (must exit with code 0):**

```bash
pnpm lint        # No errors (warnings acceptable)
pnpm check-types # No type errors
```

**Common blockers:**

- `@typescript-eslint/no-explicit-any` errors
- Missing type definitions
- Unused variables/imports

**Search for issues:**

- `console.log` statements (except in error handlers)
- Hardcoded API keys, tokens, secrets
- `TODO` or `FIXME` comments on critical paths
- Commented-out code blocks

### 7. Error Handling

**Verify 404 page exists:**

- `src/app/not-found.tsx` - 404 page should be branded, not default Next.js
- `src/app/error.tsx` - optional, add if custom error UI needed

### 8. Performance

**Check for:**

- Hero images have `priority` prop on `<Image>`
- Fonts use `next/font`
- Heavy components use `dynamic()` import
- All images use Next.js `<Image>` component with `width` and `height`

### 9. Accessibility

**Search for:**

- `aria-label` on icon-only buttons
- `alt` attribute on all `<Image>` and `<img>`
- Semantic elements: `<main>`, `<nav>`, `<section>`, `<article>`
- Single `<h1>` per page, proper heading hierarchy

---

## Output Format

```markdown
## Production Readiness Report

### ✅ Passing

- List passing checks

### ⚠️ Warnings

- List warnings with suggested fixes

### ❌ Issues

- List critical issues that must be fixed

### 🖼️ Asset Optimization Summary

| Metric                | Value                     |
| --------------------- | ------------------------- |
| Total assets          | X files                   |
| Total size            | X.X MB                    |
| Non-optimized formats | X files (JPEG/PNG → WebP) |
| Oversized assets      | X files                   |
| Potential savings     | X.X MB (XX%)              |

**Top issues to fix:**
| File | Issue | Fix Command |
| ---- | ----- | ----------- |
| ... | ... | ... |

### Summary

**Ready/Not ready** - X issues, Y warnings, X asset optimizations needed

### 🔧 Quick Fix Commands

    # Install required tools
    brew install webp ffmpeg imagemagick

    # Run generated fix commands
    [Commands from asset audit]

### Suggested Manual Checks

- Run Lighthouse in Chrome DevTools (target: Performance 90+, LCP <2.5s)
- Test social preview: socialsharepreview.com
- Check headers: securityheaders.com
- Verify images load correctly after WebP conversion
- Test video playback on mobile devices
```
