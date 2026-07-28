import Link from 'next/link';

import { getAllThoughts } from '@/modules/thoughts/data/posts';

export async function RecentThoughts() {
  const thoughts = await getAllThoughts();
  const recent = thoughts.slice(0, 5);

  return (
    <section className="mt-16">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-medium">thoughts</h2>
        {recent.length > 0 && (
          <Link
            className="text-text-tertiary hover:text-text-secondary text-xs transition-colors duration-150 ease-out"
            href="/thoughts"
          >
            view all
          </Link>
        )}
      </div>
      {recent.length === 0 ? (
        <p className="text-text-tertiary mt-4 text-sm">coming soon.</p>
      ) : (
        <div className="mt-4 flex flex-col">
          {recent.map((thought) => (
            <Link
              key={thought.slug}
              className="group phover:hover:bg-surface-hover -mx-3 flex items-baseline justify-between gap-4 rounded-none px-3 py-2.5 transition-colors duration-150 ease-out"
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
    </section>
  );
}
