import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/common/tools/seo';

import { getAllCraftSlugs } from '@/modules/crafts/data/crafts';
import { getAllThoughtSlugs } from '@/modules/thoughts/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const thoughtSlugs = getAllThoughtSlugs();
  const craftSlugs = getAllCraftSlugs();

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
      url: `${SITE_URL}/crafts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...craftSlugs.map((slug) => ({
      url: `${SITE_URL}/crafts/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
