import { PropsWithChildren } from 'react';

import { CoreLayout } from '@/common/components/core-layout/core-layout';
import { TailwindHelper } from '@/common/components/tailwind-helper';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <CoreLayout>{children}</CoreLayout>
      {process.env.NODE_ENV === 'development' && <TailwindHelper />}
    </>
  );
}
