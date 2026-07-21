import type { PropsWithChildren } from 'react';

import { Header } from '@/common/components/core-layout/header';
import { PageBurst } from '@/common/components/core-layout/page-burst';
import { ScrollReset } from '@/common/components/core-layout/scroll-reset';

export function CoreLayout({ children }: PropsWithChildren) {
  return (
    <PageBurst>
      <Header />
      <div
        className="flex flex-1 flex-col overflow-y-auto scroll-smooth [scrollbar-gutter:stable]"
        id="scroll-root"
      >
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <ScrollReset />
    </PageBurst>
  );
}
