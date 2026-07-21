import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/common/tools/seo';

import { getAllCrafts } from '@/modules/crafts/data/crafts';
import { getAllThoughtSlugs } from '@/modules/thoughts/data/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const thoughtSlugs = getAllThoughtSlugs();
  const crafts = await getAllCrafts();
  // visual crafts have no pages
  const craftSlugs = crafts
    .filter((craft) => !craft.visual)
    .map((craft) => craft.slug);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/thoughts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...thoughtSlugs.map((slug) => ({
      url: `${SITE_URL}/thoughts/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    {
      url: `${SITE_URL}/making`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...craftSlugs.map((slug) => ({
      url: `${SITE_URL}/making/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
