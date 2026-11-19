import path from "node:path";
import type { NextConfig } from "next";

// The parent folder holds another project's lockfile; without a root,
// Turbopack treats D:\WORK\PORTFOLIO as the workspace root. Local preview
// copies under .claude/worktrees link their node_modules to a sibling copy,
// so for those the root is the main checkout that holds both.
const inWorktree = __dirname.split(path.sep).join("/").match(/^(.*)\/\.claude\/worktrees\//);

// The home page is the static sleeping-moon site in public/samples/sleeping-moon. It is served at "/" without a
// redirect, so its relative links (moon.css, art/..., loops/..., brands-proto.html) resolve against the root; the
// fallback rewrites below send any such request that matches no other file or route into that folder.
const MOON = "/samples/sleeping-moon";

const nextConfig: NextConfig = {
  turbopack: { root: inWorktree ? path.normalize(inWorktree[1]) : __dirname },
  async rewrites() {
    return {
      beforeFiles: [{ source: "/", destination: `${MOON}/magic-proto.html` }],
      afterFiles: [],
      fallback: [
        // the page's stylesheets ask for ../brand/fonts, which from the root is /brand/fonts
        { source: "/brand/fonts/:path*", destination: "/samples/brand/fonts/:path*" },
        { source: "/:path*", destination: `${MOON}/:path*` },
      ],
    };
  },
  // pictures, films, loops and fonts are cached for a week; their names are not hashed, so they are not immutable
  async headers() {
    const week = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return [
      { source: `${MOON}/art/:path*`, headers: week },
      { source: `${MOON}/loops/:path*`, headers: week },
      { source: "/samples/brand/fonts/:path*", headers: week },
      { source: "/work/:path*", headers: week },
      { source: "/art/:path*", headers: week },
      { source: "/loops/:path*", headers: week },
      { source: "/brand/fonts/:path*", headers: week },
      { source: "/logos/:path*", headers: week },
    ];
  },
};

export default nextConfig;
