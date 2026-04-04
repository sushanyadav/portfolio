import { PropsWithChildren } from 'react';

import { CoreLayout } from '@/common/components/core-layout/core-layout';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <CoreLayout>
      {children}
    </CoreLayout>
  );
}
