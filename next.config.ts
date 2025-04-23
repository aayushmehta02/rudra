import type { NextConfig } from "next";

const nextConfig = {
  /* config options here */
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
} as NextConfig;

export default nextConfig;
