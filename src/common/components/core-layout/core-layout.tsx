import { PropsWithChildren } from 'react';

import { Footer } from '@/common/components/core-layout/footer';
import { Header } from '@/common/components/core-layout/header';

interface CoreLayoutProps {}

export function CoreLayout({ children }: PropsWithChildren<CoreLayoutProps>) {
  return (
    <div className="relative flex h-full min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col [&>div]:flex-1">{children}</main>
      <Footer />
    </div>
  );
}
