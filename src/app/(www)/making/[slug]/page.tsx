import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BlurVideo } from '@/common/components/blur-video/blur-video';
import { generatePageMetadata, SITE_NAME } from '@/common/tools/seo';

import { getAllCrafts, getCraftBySlug } from '@/modules/crafts/data/crafts';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const crafts = await getAllCrafts();
  return crafts
    .filter((craft) => !craft.visual)
    .map((craft) => ({ slug: craft.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { metadata } = await getCraftBySlug(slug);
    return generatePageMetadata({
      title: `${metadata.title.toLowerCase()} - ${SITE_NAME}`,
      description: metadata.description,
      path: `making/${slug}`,
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

  if (!craft || craft.metadata.visual) {
    notFound();
  }

  const { metadata, Content } = craft;

  return (
    <article className="container pt-16 pb-32">
      <Link
        className="hitbox text-text-tertiary hover:text-text-secondary inline-block origin-left text-xs transition-[color,scale] duration-150 ease-out active:scale-95"
        href="/making"
      >
        ← making
      </Link>

      <header className="mt-8 mb-10 lowercase">
        <time
          className="text-text-tertiary text-xs"
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
        <p className="text-text-secondary mt-1 text-sm">
          {metadata.description}
        </p>
      </header>

      {metadata.coverImage && (
        <div className="border-border relative mb-10 aspect-video overflow-hidden rounded-none border">
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

      {!metadata.coverImage && metadata.media?.[0]?.type === 'video' && (
        <div
          className="mb-10"
          style={
            {
              maxWidth: metadata.media[0].width,
              '--hero-pos': metadata.media[0].objectPosition ?? 'center',
            } as React.CSSProperties
          }
        >
          <BlurVideo
            aspectRatio={metadata.media[0].aspectRatio}
            className="border-border max-h-120 w-full rounded-none border [&>video]:size-full [&>video]:object-cover [&>video]:object-(--hero-pos)"
            mp4Src={metadata.media.find((m) => m.src.endsWith('.mp4'))?.src}
            src={metadata.media[0].src}
          />
        </div>
      )}

      {metadata.wip ? (
        <div className="flex h-32 items-center justify-center">
          <p className="text-text-tertiary text-sm">work in progress.</p>
        </div>
      ) : (
        <div className="prose-article">
          <Content />
        </div>
      )}
    </article>
  );
}
