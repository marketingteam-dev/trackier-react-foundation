import type { NextConfig } from 'next';

const mediaOrigin = process.env.WP_MEDIA_ORIGIN;
const media = mediaOrigin ? new URL(mediaOrigin) : undefined;
if (media && (media.protocol !== 'https:' || media.username || media.password || media.pathname !== '/' || media.search || media.hash)) {
  throw new Error('WP_MEDIA_ORIGIN must be a bare HTTPS origin, without credentials, path, query, or fragment.');
}

const config: NextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  // Resolve page existence + SEO before sending response headers, including to browsers.
  // This is intentional: no streaming metadata or route-level loading.tsx here.
  htmlLimitedBots: /.*/,
  images: {
    remotePatterns: media ? [{ protocol: 'https', hostname: media.hostname, port: media.port, pathname: '/wp-content/uploads/**', search: '' }] : [],
    // Remote SVG is deliberately not enabled. Use raster WP uploads.
  },
  async headers() {
    return process.env.SITE_INDEXABLE === 'true' && process.env.CONTENT_MODE === 'wordpress'
      ? []
      : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default config;
