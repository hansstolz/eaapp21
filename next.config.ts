import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "latest",
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
