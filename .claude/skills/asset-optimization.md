# Asset Optimization

Automated asset verification and optimization for production-ready performance based on Google Web.dev and Core Web Vitals standards.

## Usage

```text
"run asset optimization"
"check my assets"
"optimize images for production"
"audit asset sizes"
```

---

## Format Recommendations (Google Web.dev Standards)

| Asset Type             | Recommended Format  | Fallback    | Notes                                  |
| ---------------------- | ------------------- | ----------- | -------------------------------------- |
| Photos/Images          | WebP                | JPEG        | WebP provides ~30% smaller files       |
| Graphics/Illustrations | WebP or SVG         | PNG         | Use SVG for vector graphics            |
| Icons/Logos            | SVG                 | WebP        | SVG scales perfectly, tiny file size   |
| Animations             | WebP (animated)     | GIF         | Animated WebP is ~50% smaller than GIF |
| Videos                 | WebM (VP9/AV1)      | MP4 (H.264) | WebM provides better compression       |
| Hero Videos            | WebM + poster image | MP4         | Always include poster for LCP          |

## File Size Limits (Core Web Vitals Targets)

| Asset Type        | Max Size | Ideal Size | LCP Impact     |
| ----------------- | -------- | ---------- | -------------- |
| Hero/LCP Image    | 200KB    | <100KB     | Critical       |
| Content Images    | 150KB    | <80KB      | High           |
| Thumbnails        | 50KB     | <30KB      | Medium         |
| Icons/Logos       | 10KB     | <5KB       | Low            |
| OG/Twitter Images | 300KB    | <150KB     | N/A (external) |
| Background Videos | 2MB      | <1MB       | Critical       |
| Inline Videos     | 5MB      | <2MB       | High           |

## Resolution Guidelines

| Asset Type     | Recommended Size        | Max Size  | Notes                       |
| -------------- | ----------------------- | --------- | --------------------------- |
| Hero Images    | 1920x1080               | 2560x1440 | Serve responsive sizes      |
| Content Images | 800x600                 | 1200x900  | Use `srcset` for responsive |
| Thumbnails     | 400x300                 | 600x450   | Fixed size OK               |
| OG Images      | 1200x630                | 1200x630  | Exact size required         |
| Twitter Images | 1200x600                | 1200x600  | Exact size required         |
| Favicons       | 32x32, 192x192, 512x512 | -         | Multiple sizes required     |

---

## Checks to Perform

### 1. Find Non-Optimized Formats

```bash
# Find JPEG/PNG that should be WebP
find public src -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) ! -name "*.ico" 2>/dev/null

# Find GIF animations that should be WebM/WebP
find public src -type f -iname "*.gif" 2>/dev/null

# Find MP4 videos without WebM alternatives
find public src -type f -iname "*.mp4" 2>/dev/null
```

### 2. Check File Sizes

```bash
# Find images over 200KB
find public src -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) -size +200k 2>/dev/null

# Find videos over 2MB
find public src -type f \( -iname "*.mp4" -o -iname "*.webm" \) -size +2M 2>/dev/null
```

### 3. Get Detailed Asset Report

```bash
# List all assets with sizes (sorted by size, largest first)
find public -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" -o -iname "*.gif" -o -iname "*.svg" -o -iname "*.mp4" -o -iname "*.webm" \) -exec ls -lh {} \; | sort -k5 -hr
```

---

## Fix Commands

### Convert Images to WebP

Requires `cwebp` from libwebp: `brew install webp` (macOS) or `apt install webp` (Linux)

```bash
# Convert single image
cwebp -q 80 input.png -o output.webp

# Convert all PNGs in public/images
for f in public/images/*.png; do cwebp -q 80 "$f" -o "${f%.png}.webp"; done

# Convert all JPEGs in public/images
for f in public/images/*.jpg; do cwebp -q 85 "$f" -o "${f%.jpg}.webp"; done
```

### Convert Videos to WebM

Requires `ffmpeg`: `brew install ffmpeg` (macOS) or `apt install ffmpeg` (Linux)

```bash
# Convert MP4 to WebM (VP9, good quality)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm

# Extract poster image from video
ffmpeg -i input.mp4 -ss 00:00:01 -vframes 1 poster.webp
```

### Optimize Existing Images

Requires `imagemagick`: `brew install imagemagick` (macOS) or `apt install imagemagick` (Linux)

```bash
# Resize oversized images
convert input.jpg -resize "1920x1080>" -quality 85 output.jpg

# Compress WebP further
cwebp -q 75 -m 6 input.webp -o output.webp
```

### Generate Responsive Image Sizes

```bash
# Create multiple sizes for srcset
for size in 400 800 1200 1600; do
  convert input.jpg -resize "${size}x>" "output-${size}w.jpg"
done
```

---

## Code Updates After Conversion

### Update Image Imports

```tsx
// Before
<Image src="/images/hero.jpg" ... />

// After
<Image src="/images/hero.webp" ... />
```

### Add WebM Video with Fallback

```tsx
<video autoPlay muted loop playsInline poster="/videos/hero-poster.webp">
  <source src="/videos/hero.webm" type="video/webm" />
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>
```

### Responsive Images with Next.js

```tsx
<Image
  src="/images/hero.webp"
  alt="Hero image"
  width={1920}
  height={1080}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
/>
```

---

## Output Format

```markdown
## Asset Optimization Report

### 📊 Summary

- Total assets scanned: X
- Total size: X.X MB
- Potential savings: X.X MB (XX%)

### ❌ Critical Issues (Must Fix)

| File            | Issue        | Current   | Target      | Fix Command                                       |
| --------------- | ------------ | --------- | ----------- | ------------------------------------------------- |
| public/hero.png | Wrong format | PNG 1.2MB | WebP <200KB | `cwebp -q 80 public/hero.png -o public/hero.webp` |

### ⚠️ Warnings (Should Fix)

| File          | Issue     | Current | Target | Fix Command                                   |
| ------------- | --------- | ------- | ------ | --------------------------------------------- |
| public/bg.jpg | Oversized | 450KB   | <200KB | `cwebp -q 75 public/bg.jpg -o public/bg.webp` |

### ✅ Optimized Assets

- List of properly optimized assets

### 🔧 Batch Fix Commands

    # Install required tools
    brew install webp ffmpeg imagemagick

    # Run these commands to fix all issues:
    [Generated commands based on findings]

### 📱 Responsive Image Audit

| Image | Has srcset | Sizes Provided | Recommendation          |
| ----- | ---------- | -------------- | ----------------------- |
| Hero  | ❌         | -              | Add responsive variants |
```
