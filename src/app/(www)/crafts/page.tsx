import { Metadata } from 'next';

import {
  generatePageMetadata,
  SITE_NAME,
} from '@/common/tools/seo';

import { getAllCrafts } from '@/modules/crafts/data/crafts';
import { CraftGrid } from '@/modules/crafts/components/craft-grid';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `crafts - ${SITE_NAME}`,
    description: 'A collection of projects and experiments.',
    path: 'crafts',
    type: 'website',
  });
}

export default async function CraftsPage() {
  const crafts = await getAllCrafts();

  const craftData = crafts.map((craft) => ({
    slug: craft.slug,
    title: craft.title,
    description: craft.description,
    year: new Date(craft.publishedAt).getFullYear(),
    tags: craft.tags,
    media: craft.media ?? [],
  }));

  return (
    <div className="container pt-16 pb-32">
      <header className="mb-12">
        <h1 className="text-base font-medium">crafts</h1>
        <p className="mt-2 text-sm text-text-secondary">
          projects, experiments, and things i&apos;ve built.
        </p>
      </header>

      <CraftGrid crafts={craftData} />
    </div>
  );
}
