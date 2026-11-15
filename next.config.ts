import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder holds another project's lockfile; without this,
  // Turbopack treats D:\WORK\PORTFOLIO as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
