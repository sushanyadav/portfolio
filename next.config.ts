import path from 'path';

import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
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
