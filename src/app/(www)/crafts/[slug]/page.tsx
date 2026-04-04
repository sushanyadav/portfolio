import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { generatePageMetadata, SITE_NAME } from '@/common/tools/seo';

import {
  getAllCraftSlugs,
  getCraftBySlug,
} from '@/modules/crafts/data/crafts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = getAllCraftSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = await getCraftBySlug(slug);
    return generatePageMetadata({
      title: `${metadata.title} - ${SITE_NAME}`,
      description: metadata.description,
      path: `crafts/${slug}`,
      type: 'article',
      publishedTime: metadata.publishedAt,
      tags: metadata.tags,
    });
  } catch {
    return {};
  }
}

export default async function CraftPage({ params }: PageProps) {
  const { slug } = await params;

  const craft = await getCraftBySlug(slug).catch(() => null);

  if (!craft) {
    notFound();
  }

  const { metadata, Content } = craft;

  return (
    <article className="container pt-16 pb-32">
      <Link
        className="text-xs text-text-tertiary transition-colors duration-150 ease-out hover:text-text-secondary"
        href="/crafts"
      >
        ← crafts
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
        <p className="mt-1 text-sm text-text-secondary">
          {metadata.description}
        </p>
      </header>

      {metadata.coverImage && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-none border border-border">
          <Image
            alt={metadata.title}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 688px) 100vw, 688px"
            src={metadata.coverImage}
          />
        </div>
      )}

      <div className="prose-article">
        <Content />
      </div>
    </article>
  );
}
