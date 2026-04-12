import fs from 'fs';
import path from 'path';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
};

export type CraftMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  media?: MediaItem[];
  coverImage?: string;
  url?: string;
  wip?: boolean;
};

const CRAFTS_DIR = path.join(
  process.cwd(),
  'src/app/(www)/crafts/(content)',
);

export function getAllCraftSlugs(): string[] {
  try {
    return fs
      .readdirSync(CRAFTS_DIR)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  } catch {
    return [];
  }
}

export async function getCraftBySlug(slug: string) {
  const post = await import(
    `@/app/(www)/crafts/(content)/${slug}.mdx`
  );
  const metadata = post.metadata as Omit<CraftMeta, 'slug'>;

  return {
    slug,
    metadata,
    Content: post.default as React.ComponentType,
  };
}

export async function getAllCrafts(): Promise<CraftMeta[]> {
  const slugs = getAllCraftSlugs();

  const crafts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(
        `@/app/(www)/crafts/(content)/${slug}.mdx`
      );
      return { slug, ...metadata } as CraftMeta;
    }),
  );

  return crafts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime(),
  );
}
