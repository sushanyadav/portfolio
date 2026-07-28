import fs from 'fs';
import path from 'path';

type MediaItem = {
  type: 'image' | 'video';
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  /** tile-only ratio override; media cover-crops inside it */
  displayRatio?: string;
  /** tile ratio below md, overrides displayRatio there */
  mobileDisplayRatio?: string;
  /** crop anchor when displayRatio crops, e.g. "right" */
  objectPosition?: string;
};

export type CraftMeta = {
  slug: string;
  title: string;
  description: string;
  shortDescription?: string;
  publishedAt: string;
  tags: string[];
  media?: MediaItem[];
  coverImage?: string;
  url?: string;
  wip?: boolean;
  /** video-only piece: shown big, never gets a detail page */
  visual?: boolean;
  /** explicit homepage position; unordered items follow by date */
  order?: number;
  /** force the next showcase card onto a new row */
  breakAfter?: boolean;
};

const CRAFTS_DIR = path.join(process.cwd(), 'src/app/(www)/making/(content)');

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
  const post = await import(`@/app/(www)/making/(content)/${slug}.mdx`);
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
        `@/app/(www)/making/(content)/${slug}.mdx`
      );
      return { slug, ...metadata } as CraftMeta;
    }),
  );

  return crafts.sort((a, b) => {
    const ao = a.order ?? Number.MAX_SAFE_INTEGER;
    const bo = b.order ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}
