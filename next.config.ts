import path from 'path';

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  turbopack: {
    resolveAlias: {
      public: path.resolve(__dirname, 'public'),
    },
  },
};

export default nextConfig;
