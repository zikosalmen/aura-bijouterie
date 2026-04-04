import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtupyxjrglebbmusxzuo.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Cache 30 jours côté Next.js Image Optimizer
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [375, 430, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 160, 220, 320, 420],
  },

};

export default withNextIntl(nextConfig);
