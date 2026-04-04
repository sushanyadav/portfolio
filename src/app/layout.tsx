import { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import { inter } from '@/common/fonts/inter';
import { cn } from '@/common/functions/cn';
import { SITE_URL } from '@/common/tools/seo';

import '@/common/styles/main.css';

export const viewport: Viewport = {
  themeColor: 'black',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' },
    ],
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
};

const GlobalLayout = ({ children }: PropsWithChildren) => {
  return (
    <html className={cn(inter.variable)} lang="en">
      {/* // TODO: replace with your site name */}
      <meta content="Example" name="apple-mobile-web-app-title" />
      <body>{children}</body>
    </html>
  );
};

export default GlobalLayout;
