'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/common/functions/cn';

import { Logo } from '@/common/components/logo/logo';
import { ThemeToggle } from '@/common/components/theme-toggle/theme-toggle';

const NAV_ITEMS = [
  { href: '/making', label: 'making' },
  { href: '/thoughts', label: 'thoughts' },
];

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      className={cn(
        "relative rounded-none px-3 py-1.5 text-sm transition-colors duration-150 ease-out before:absolute before:-inset-2 before:content-['']",
        isActive
          ? 'text-text-primary'
          : 'text-text-tertiary hover:text-text-secondary',
      )}
      href={href}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-bg sticky top-0 z-10 h-(--header-height) shrink-0 border-b">
      <div className="container-wide flex h-full items-center justify-between">
        <Link
          className="hitbox flex items-center transition-opacity duration-150 ease-out hover:opacity-70"
          href="/"
        >
          <Logo className="size-5" />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label }) => {
            const isActive =
              pathname === href || pathname.startsWith(`${href}/`);

            return (
              <NavLink
                key={href}
                href={href}
                isActive={isActive}
                label={label}
              />
            );
          })}
          <div className="border-border ml-2 border-l pl-2">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
