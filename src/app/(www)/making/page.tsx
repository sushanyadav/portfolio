import { Metadata } from 'next';

import { generatePageMetadata, SITE_NAME } from '@/common/tools/seo';

import {
  CraftList,
  type CraftPreviewItem,
} from '@/modules/crafts/components/craft-list';
import { getAllCrafts, type CraftMeta } from '@/modules/crafts/data/crafts';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `making - ${SITE_NAME}`,
    description: 'Written breakdowns of things i built.',
    path: 'making',
    type: 'website',
  });
}

function getPreview(
  craft: CraftMeta,
): { src: string; type: 'image' | 'video' } | null {
  if (craft.coverImage) return { src: craft.coverImage, type: 'image' };
  const first = craft.media?.[0];
  if (first && (first.type === 'image' || first.type === 'video')) {
    return { src: first.src, type: first.type };
  }
  return null;
}

export default async function CraftsPage() {
  const crafts = await getAllCrafts();

  const items: CraftPreviewItem[] = crafts
    .filter((craft) => !craft.visual)
    .map((craft) => {
      const preview = getPreview(craft);
      return {
        slug: craft.slug,
        title: craft.title,
        description: craft.shortDescription ?? craft.description,
        publishedAt: craft.publishedAt,
        previewSrc: preview?.src ?? null,
        previewType: preview?.type ?? null,
      };
    });

  return (
    <div className="container pt-16 pb-32">
      <header className="mb-8">
        <h1 className="text-base font-medium">making</h1>
        <p className="text-text-secondary mt-2 text-sm">
          written breakdowns of things i&apos;ve built.
        </p>
      </header>

      <CraftList crafts={items} />
    </div>
  );
}
