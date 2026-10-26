import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  sassOptions: { includePaths: [path.join(process.cwd(), 'styles')] },
  experimental: { optimizePackageImports: ['gsap'] },
  async headers() {
    return [
      {
        source: '/:dir(images|models|draco)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
