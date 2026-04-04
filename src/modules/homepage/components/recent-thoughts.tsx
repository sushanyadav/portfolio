import Link from 'next/link';

import { getAllThoughts } from '@/modules/thoughts/data/posts';

export async function RecentThoughts() {
  const thoughts = await getAllThoughts();
  const recent = thoughts.slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">thoughts</h2>
        <Link
          className="text-xs text-text-tertiary transition-colors duration-150 ease-out hover:text-text-secondary"
          href="/thoughts"
        >
          view all
        </Link>
      </div>
      <div className="mt-4 flex flex-col">
        {recent.map((thought) => (
          <Link
            key={thought.slug}
            className="group -mx-3 flex items-baseline justify-between gap-4 rounded-none px-3 py-2.5 transition-colors duration-150 ease-out phover:hover:bg-surface-hover"
            href={`/thoughts/${thought.slug}`}
          >
            <span className="text-sm text-text-secondary transition-colors duration-150 ease-out group-hover:text-text-primary">
              {thought.title}
            </span>
            <span className="shrink-0 text-xs tabular-nums text-text-tertiary">
              {new Date(thought.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
