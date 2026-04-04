import Link from 'next/link';

import { BlurImage } from '@/common/components/blur-image/blur-image';
import { BlurVideo } from '@/common/components/blur-video/blur-video';

type CraftData = {
  slug: string;
  title: string;
  description: string;
  year: number;
  tags: string[];
  media: Array<{
    type: 'image' | 'video';
    src: string;
    alt?: string;
  }>;
};

type CraftGridProps = {
  crafts: CraftData[];
};

export function CraftGrid({ crafts }: CraftGridProps) {
  return (
    <div className="columns-1 gap-3 sm:columns-2">
      {crafts.map((craft, index) => {
        const firstMedia = craft.media[0];

        return (
          <Link
            key={craft.slug}
            className="group mb-3 block break-inside-avoid"
            href={`/crafts/${craft.slug}`}
          >
            {firstMedia?.type === 'video' ? (
              <BlurVideo src={firstMedia.src} />
            ) : firstMedia ? (
              <BlurImage
                alt={firstMedia.alt || craft.title}
                priority={index < 4}
                sizes="(max-width: 688px) 100vw, 344px"
                src={firstMedia.src}
              />
            ) : (
              <div className="aspect-video w-full bg-bg-secondary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
