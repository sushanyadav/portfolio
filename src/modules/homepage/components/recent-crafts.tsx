import Link from 'next/link';

import { getAllCrafts } from '@/modules/crafts/data/crafts';

import { CraftList } from './craft-list';

export type CraftPreviewItem = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  previewSrc: string | null;
  previewType: 'image' | 'video' | null;
};

function getPreview(craft: {
  coverImage?: string;
  media?: { type: string; src: string }[];
}): { src: string; type: 'image' | 'video' } | null {
  if (craft.coverImage) return { src: craft.coverImage, type: 'image' };
  const first = craft.media?.[0];
  if (first && (first.type === 'image' || first.type === 'video')) {
    return { src: first.src, type: first.type as 'image' | 'video' };
  }
  return null;
}

export async function RecentCrafts() {
  const crafts = await getAllCrafts();
  const recent = crafts.slice(0, 5);

  if (recent.length === 0) return null;

  const items: CraftPreviewItem[] = recent.map((craft) => {
    const preview = getPreview(craft);
    return {
      slug: craft.slug,
      title: craft.title,
      description: craft.description,
      publishedAt: craft.publishedAt,
      previewSrc: preview?.src ?? null,
      previewType: preview?.type ?? null,
    };
  });

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">crafts</h2>
        <Link
          className="text-xs text-text-tertiary transition-colors duration-150 ease-out hover:text-text-secondary"
          href="/crafts"
        >
          view all
        </Link>
      </div>
      <CraftList crafts={items} />
    </section>
  );
}
