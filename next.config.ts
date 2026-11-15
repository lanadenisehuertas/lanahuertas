import path from "node:path";
import type { NextConfig } from "next";

// The parent folder holds another project's lockfile; without a root,
// Turbopack treats D:\WORK\PORTFOLIO as the workspace root. Local preview
// copies under .claude/worktrees link their node_modules to a sibling copy,
// so for those the root is the main checkout that holds both.
const inWorktree = __dirname.split(path.sep).join("/").match(/^(.*)\/\.claude\/worktrees\//);

const nextConfig: NextConfig = {
  turbopack: { root: inWorktree ? path.normalize(inWorktree[1]) : __dirname },
};

export default nextConfig;
