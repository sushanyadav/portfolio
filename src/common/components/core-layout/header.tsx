import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-10 h-(--header-height) shrink-0 bg-gray-100">
      <div className="container flex items-center justify-between gap-8 py-6">
        <Link href="/">Home</Link>
      </div>
    </header>
  );
}
