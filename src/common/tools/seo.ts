import type { Metadata } from 'next';

// Base URL for the site
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'https://sushan.xyz');

export const SITE_NAME = 'sushan.';
export const SITE_DESCRIPTION = 'design engineer';
export const TWITTER_HANDLE = '@__sushan';
export const DEFAULT_OG_IMAGE = '/opengraph-image.png';
export const DEFAULT_OG_TWITTER_IMAGE = '/twitter-image.png';

// Helper function to get full URL
export function getFullUrl(path: string): string {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SITE_URL}/${cleanPath}`;
}

// Generate metadata configuration
type GenerateMetadataConfig = {
  title?: string;
  description?: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  useDefaultImage?: boolean;
};

export function generatePageMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  path,
  image,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  useDefaultImage = true,
}: GenerateMetadataConfig): Metadata {
  const url = getFullUrl(path);
  const imageUrl =
    image || (useDefaultImage ? `${SITE_URL}${DEFAULT_OG_IMAGE}` : undefined);
  const twitterImageUrl =
    image ||
    (useDefaultImage ? `${SITE_URL}${DEFAULT_OG_TWITTER_IMAGE}` : undefined);

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'en_US',
      type,
      ...(imageUrl && {
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
      ...(type === 'article' &&
        publishedTime && {
          publishedTime,
        }),
      ...(type === 'article' &&
        modifiedTime && {
          modifiedTime,
        }),
      ...(type === 'article' &&
        authors && {
          authors,
        }),
      ...(type === 'article' &&
        tags && {
          tags,
        }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: TWITTER_HANDLE,
      ...(twitterImageUrl && {
        images: [twitterImageUrl],
      }),
    },
  };

  return metadata;
}
