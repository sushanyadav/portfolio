import type { CSSProperties } from 'react';

import { BlurImage } from '@/common/components/blur-image/blur-image';
import { BlurVideo } from '@/common/components/blur-video/blur-video';

export type TileCraft = {
  slug: string;
  title: string;
  year: number;
  media: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
    width?: number;
    aspectRatio?: string;
    displayRatio?: string;
    objectPosition?: string;
  }>;
};

export function mediaRatio(craft: TileCraft): number {
  const first = craft.media[0];
  const raw = first?.displayRatio ?? first?.aspectRatio;
  const [w, h] = raw ? raw.split('/').map((n) => parseFloat(n)) : [16, 10];
  return w && h ? w / h : 1.6;
}

// media fills its card at its own aspect ratio, on every screen size
export function CraftTile({ craft }: { craft: TileCraft }) {
  const first = craft.media[0];
  if (!first) return null;

  const mp4 = craft.media.find((m) => m.src.endsWith('.mp4'))?.src;

  if (first.type !== 'video') {
    return (
      <BlurImage
        alt={first.alt || craft.title}
        className="w-full border border-border"
        sizes="(max-width: 768px) 100vw, 600px"
        src={first.src}
      />
    );
  }

  // tiles cap at ~416px tall; displayRatio and extreme ratios crop in the
  // preview (anchored via objectPosition), the spotlight shows the full frame
  return (
    <div
      style={{ '--pos': first.objectPosition ?? 'center' } as CSSProperties}
    >
      <BlurVideo
        aspectRatio={first.displayRatio ?? first.aspectRatio ?? '16 / 10'}
        className="max-h-104 w-full border border-border [&>video]:size-full [&>video]:object-cover [&>video]:object-(--pos)"
        mp4Src={mp4}
        src={first.src}
      />
    </div>
  );
}
