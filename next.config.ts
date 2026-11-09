import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep production verification separate from an already running development server.
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
