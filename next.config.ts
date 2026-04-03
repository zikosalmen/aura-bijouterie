import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    // Allow Supabase Storage domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qtupyxjrglebbmusxzuo.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
    // Serve modern formats (Next.js auto-converts to WebP/AVIF)
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 7 days (greatly reduces re-processing)
    minimumCacheTTL: 60 * 60 * 24 * 7,
    // Image widths for srcset — tightly matched to our grid breakpoints
    deviceSizes: [375, 430, 640, 768, 1024, 1280, 1536],
    imageSizes: [96, 160, 220, 320, 420],
    // Default quality (75 = good balance between size and quality)
    // Applied per-image via quality prop
  },
};

export default withNextIntl(nextConfig);
