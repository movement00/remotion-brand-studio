import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@remotion/renderer', '@remotion/cli'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
