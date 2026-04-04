import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';

import { geistMono, geistSans } from '@/common/fonts/geist';
import { cn } from '@/common/functions/cn';
import { ThemeProvider } from '@/common/providers/theme-provider';
import { SITE_URL } from '@/common/tools/seo';

import '@/common/styles/main.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
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

export default function GlobalLayout({ children }: PropsWithChildren) {
  return (
    <html
      className={cn(geistSans.variable, geistMono.variable)}
      data-scroll-behavior="smooth"
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
