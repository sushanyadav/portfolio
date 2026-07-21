import { Metadata } from 'next';
import Link from 'next/link';

import { generatePageMetadata, SITE_NAME } from '@/common/tools/seo';

import { getAllThoughts } from '@/modules/thoughts/data/posts';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: `thoughts - ${SITE_NAME}`,
    description:
      'Writing about design, development, and everything in between.',
    path: 'thoughts',
    type: 'website',
  });
}

export default async function ThoughtsPage() {
  const thoughts = await getAllThoughts();

  return (
    <div className="container pt-16 pb-32">
      <header className="mb-12">
        <h1 className="text-base font-medium">thoughts</h1>
        <p className="text-text-secondary mt-2 text-sm">
          writing about design, development, and everything in between.
        </p>
      </header>

      {thoughts.length === 0 ? (
        <p className="text-text-tertiary text-sm">no thoughts atm,</p>
      ) : (
        <div className="flex flex-col">
          {thoughts.map((thought) => (
            <Link
              key={thought.slug}
              className="group border-border phover:hover:bg-surface-hover -mx-3 flex items-baseline justify-between gap-4 border-b px-3 py-3 transition-colors duration-150 ease-out last:border-b-0"
              href={`/thoughts/${thought.slug}`}
            >
              <span className="text-text-secondary group-hover:text-text-primary text-sm transition-colors duration-150 ease-out">
                {thought.title}
              </span>
              <span className="text-text-tertiary shrink-0 text-xs tabular-nums">
                {new Date(thought.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
