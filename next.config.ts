import path from 'path';

import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/crafts', destination: '/making', permanent: true },
      {
        source: '/crafts/:slug',
        destination: '/making/:slug',
        permanent: true,
      },
    ];
  },
  experimental: {
    mdxRs: {
      mdxType: 'gfm',
    },
  },
  images: {
    remotePatterns: [],
  },
  allowedDevOrigins: ['sushans-macbook-pro.local'],
  turbopack: {
    resolveAlias: {
      public: path.resolve(__dirname, 'public'),
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
