import { getAllCrafts } from '@/modules/crafts/data/crafts';

import { VisualShowcase } from './visual-showcase';

export async function VisualCrafts() {
  const crafts = await getAllCrafts();

  const items = crafts.map((craft) => ({
    slug: craft.slug,
    title: craft.title,
    caption: craft.shortDescription ?? craft.description,
    year: new Date(craft.publishedAt).getFullYear(),
    media: craft.media ?? [],
    visual: craft.visual,
    breakAfter: craft.breakAfter,
  }));

  if (items.length === 0) return null;

  return (
    <section className="container-wide mt-16">
      <h2 className="mb-4 text-sm font-medium">crafts</h2>
      <VisualShowcase crafts={items} />
    </section>
  );
}
