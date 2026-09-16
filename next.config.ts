import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // @ts-ignore - allowedDevOrigins might not be in NextConfig types yet but is required for local network testing in Next.js 15+
  allowedDevOrigins: ['192.168.1.229']
};

export default nextConfig;
