// Bundles the sleeping-moon pages. Rebuild with one command, from the repository root:
//
//     node scripts/moon/build.mjs
//
// Run it after editing any stylesheet or script in public/samples/sleeping-moon, and commit what it writes.
//
// Each page lists its own stylesheets and scripts, in their load order, inside a build comment, and the line after
// the comment is the tag that loads the bundle made from them:
//
//     <!-- build:css moon.css journey.css reel.css -->
//     <link rel="stylesheet" href="/samples/sleeping-moon/dist/....css">
//     <!-- /build -->
//
// The script joins the listed files in that order, minifies the result with esbuild, writes it to
// public/samples/sleeping-moon/dist/<first eight hex digits of its SHA-256>.css (or .js), and puts that address
// back into the tag. A bundle is named by its content, so a changed file always gets a new address and the old one
// can be cached for a year (next.config.ts), and two pages that load the same files share one bundle. Bundles that
// no page loads any more are removed. The source files are left as they are; the bundles are the only thing served.
//
// Stylesheets: a relative url() in a source file is written relative to the site folder, so it is rewritten to go
// up one folder from dist/. Scripts: the files stay classic scripts and are joined in order at the top level, so the
// names each one leaves on the page (SM, DATA, BRAND and the rest) are shared exactly as before. esbuild minifies
// without a module format, which keeps every top-level name as it is. The bundle tag stays where the separate tags
// were (the end of the body, or the head for data.js on the brand pages), so the scripts run at the same moment as
// before: the engine's document.readyState checks still see the page loading and still wait for DOMContentLoaded.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, readdirSync, mkdirSync, unlinkSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SITE = join(ROOT, "public", "samples", "sleeping-moon");
const DIST = join(SITE, "dist");
const URL_BASE = "/samples/sleeping-moon/dist/";
const PAGES = ["magic-proto.html", "brands-proto.html", "brand.html"];
const ESBUILD = "esbuild@0.24.2";

// a relative url() in a stylesheet of the site folder, read from dist/ one folder down
function rebase(css) {
  return css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (m, q, u) =>
    /^(data:|https?:|\/|#)/i.test(u) ? m : `url(${q}../${u}${q})`);
}

// MOON_PLAIN=1 joins the files without minifying them, so a profile names the lines of the source files
function minify(code, loader) {
  if (process.env.MOON_PLAIN) return code;
  const r = spawnSync("npx", ["-y", ESBUILD, `--loader=${loader}`, "--minify", "--legal-comments=none", "--charset=utf8"],
    { input: code, encoding: "utf8", shell: process.platform === "win32", maxBuffer: 64 << 20 });
  if (r.status !== 0) throw new Error(`esbuild failed on a ${loader} bundle:\n${r.stderr}`);
  return r.stdout;
}

function bundle(kind, files) {
  const parts = files.map((f) => {
    const src = readFileSync(join(SITE, f), "utf8").replace(/^﻿/, "");
    return kind === "css" ? rebase(src) : src;
  });
  // scripts are joined with a semicolon and a newline, so a file that ends without one cannot run into the next
  const out = minify(parts.join(kind === "css" ? "\n" : "\n;\n"), kind);
  const name = createHash("sha256").update(out).digest("hex").slice(0, 8) + "." + kind;
  mkdirSync(DIST, { recursive: true });
  const path = join(DIST, name);
  if (!existsSync(path) || readFileSync(path, "utf8") !== out) writeFileSync(path, out);
  return { name, bytes: Buffer.byteLength(out), from: parts.reduce((n, p) => n + Buffer.byteLength(p), 0) };
}

const BLOCK = /(<!-- build:(css|js) ([^>]*?) -->\r?\n)([^\r\n]*)(\r?\n<!-- \/build -->)/g;
const used = new Set();
for (const page of PAGES) {
  const file = join(SITE, page);
  const html = readFileSync(file, "utf8");
  const next = html.replace(BLOCK, (m, open, kind, list, tag, close) => {
    // a list may be cut into parts with "|": each part becomes a bundle of its own, loaded by its own tag, in order
    const tags = list.trim().split(/\s*\|\s*/).map((part) => {
      const files = part.split(/\s+/), b = bundle(kind, files);
      used.add(b.name);
      console.log(`${page}: ${kind} ${files.length} files, ${(b.from / 1024).toFixed(1)} KB -> dist/${b.name} ${(b.bytes / 1024).toFixed(1)} KB`);
      const href = URL_BASE + b.name, one = tag.match(kind === "css" ? /<link[^>]*>/ : /<script[^>]*><\/script>/)[0];
      return kind === "css" ? one.replace(/href="[^"]*"/, `href="${href}"`) : one.replace(/src="[^"]*"/, `src="${href}"`);
    });
    return open + tags.join("") + close;
  });
  if (next !== html) writeFileSync(file, next);
}
for (const f of existsSync(DIST) ? readdirSync(DIST) : []) {
  if (/^[0-9a-f]{8}\.(css|js)$/.test(f) && !used.has(f)) { unlinkSync(join(DIST, f)); console.log(`removed dist/${f}`); }
}
