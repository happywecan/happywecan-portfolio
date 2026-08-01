import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    unoptimized: true,
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost', port: '8001' },
      { protocol: 'http', hostname: '127.0.0.1', port: '8001' },
      { protocol: 'http', hostname: 'backend', port: '8080' },
    ],
  },
  /* config options here */
};

export default nextConfig;

