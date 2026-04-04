import fs from 'fs';
import path from 'path';

export type ThoughtMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
};

const POSTS_DIR = path.join(
  process.cwd(),
  'src/app/(www)/thoughts/(content)',
);

export function getAllThoughtSlugs(): string[] {
  try {
    return fs
      .readdirSync(POSTS_DIR)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''));
  } catch {
    return [];
  }
}

export async function getThoughtBySlug(slug: string) {
  const post = await import(
    `@/app/(www)/thoughts/(content)/${slug}.mdx`
  );
  const metadata = post.metadata as Omit<ThoughtMeta, 'slug'>;

  return {
    slug,
    metadata,
    Content: post.default as React.ComponentType,
  };
}

export async function getAllThoughts(): Promise<ThoughtMeta[]> {
  const slugs = getAllThoughtSlugs();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(
        `@/app/(www)/thoughts/(content)/${slug}.mdx`
      );
      return { slug, ...metadata } as ThoughtMeta;
    }),
  );

  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime(),
  );
}
