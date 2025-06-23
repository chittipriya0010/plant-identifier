/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
    appDir: true,
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },

  // Optimize images for PWA
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Enable compression
  compress: true,

  // Generate static files for offline capability
  trailingSlash: false,
  
  // Configure service worker
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/_next/static/sw.js',
      },
    ];
  },
};

export default nextConfig;
