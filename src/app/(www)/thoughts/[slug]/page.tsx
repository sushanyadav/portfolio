import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { generatePageMetadata, SITE_NAME } from '@/common/tools/seo';

import {
  getAllThoughtSlugs,
  getThoughtBySlug,
} from '@/modules/thoughts/data/posts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllThoughtSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = await getThoughtBySlug(slug);
    return generatePageMetadata({
      title: `${metadata.title} - ${SITE_NAME}`,
      description: metadata.description,
      path: `thoughts/${slug}`,
      type: 'article',
      publishedTime: metadata.publishedAt,
      tags: metadata.tags,
    });
  } catch {
    return {};
  }
}

export default async function ThoughtPage({ params }: PageProps) {
  const { slug } = await params;

  const thought = await getThoughtBySlug(slug);

  if (!thought) {
    notFound();
  }

  const { metadata, Content } = thought;

  return (
    <article className="container pt-16 pb-32">
      <Link
        className="hitbox inline-block origin-left text-xs text-text-tertiary transition-[color,scale] duration-150 ease-out hover:text-text-secondary active:scale-95"
        href="/thoughts"
      >
        ← thoughts
      </Link>

      <header className="mt-8 mb-10">
        <time
          className="text-xs text-text-tertiary"
          dateTime={metadata.publishedAt}
        >
          {new Date(metadata.publishedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="mt-2 text-xl font-medium tracking-tight">
          {metadata.title}
        </h1>
      </header>

      <div className="prose-article">
        <Content />
      </div>
    </article>
  );
}
