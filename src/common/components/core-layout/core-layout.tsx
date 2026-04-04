import type { PropsWithChildren } from 'react';

import { Header } from '@/common/components/core-layout/header';
import { PageBurst } from '@/common/components/core-layout/page-burst';

export function CoreLayout({ children }: PropsWithChildren) {
  return (
    <PageBurst>
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </PageBurst>
  );
}

