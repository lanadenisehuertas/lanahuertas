import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder holds another project's lockfile; without this,
  // Turbopack treats D:\WORK\PORTFOLIO as the workspace root.
  turbopack: { root: __dirname },
  // the sleeping-moon page's pictures, films and loops, and the work images it shows, are cached for a week; their
  // names are not hashed, so they are not marked immutable
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: "/samples/sleeping-moon/art/:path*", headers: week },
      { source: "/samples/sleeping-moon/loops/:path*", headers: week },
      { source: "/samples/brand/fonts/:path*", headers: week },
      { source: "/work/:path*", headers: week },
      { source: "/art/backdrops/:path*", headers: week },
    ];
  },
};

export default nextConfig;
