import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Preform images are pre-encoded AVIF/WebP (scripts/render-preforms.mjs).
  images: { unoptimized: true },
  // Lets a verification build run beside `next dev` without clobbering .next/.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  sassOptions: { includePaths: [path.join(process.cwd(), 'styles')] },
  // inlineCss removes the render-blocking stylesheet round trip (CSS is ~36 KB, ~7 KB gzipped).
  experimental: { optimizePackageImports: ['gsap'], inlineCss: true },
  async headers() {
    return [
      {
        source: '/:dir(images|models)/:path*',
        // File names aren't content-hashed (re-renders keep their names), so no `immutable`.
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default nextConfig;
