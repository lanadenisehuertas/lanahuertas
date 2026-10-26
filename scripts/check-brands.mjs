// Asserts every image the site references for brands exists on disk:
// full and sm copies of each pubmat, and one backdrop per brand / code project.
// Run: node scripts/check-brands.mjs
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const pub = (p) => join(root, "public", p.replace(/^\//, ""));
const fail = [];

const assetsFile = join(root, "lib", "brand-assets.ts");
if (!existsSync(assetsFile)) {
  console.error("lib/brand-assets.ts missing — run: python -I scripts/import-pubmats.py");
  process.exit(1);
}
const srcs = [...readFileSync(assetsFile, "utf8").matchAll(/"src": "([^"]+)"/g)].map((m) => m[1]);
if (srcs.length === 0) fail.push("brand-assets.ts lists no images");
for (const s of srcs) {
  if (!existsSync(pub(s))) fail.push(`missing full: ${s}`);
  const sm = s.replace("/work/", "/work/sm/");
  if (!existsSync(pub(sm))) fail.push(`missing sm: ${sm}`);
}

const manifest = JSON.parse(readFileSync(join(root, "scripts", "pubmats.json"), "utf8"));
const backdrops = JSON.parse(readFileSync(join(root, "scripts", "backdrops.json"), "utf8"));
for (const slug of Object.keys(manifest.brands)) {
  if (!backdrops[slug]) fail.push(`no backdrop prompt for brand ${slug}`);
}
for (const slug of Object.keys(backdrops)) {
  if (!existsSync(pub(`/art/backdrops/${slug}.webp`))) fail.push(`missing backdrop: ${slug}.webp`);
}

if (fail.length) {
  console.error(fail.join("\n"));
  console.error(`\n${fail.length} problem(s)`);
  process.exit(1);
}
console.log(`ok — ${srcs.length} images, ${Object.keys(backdrops).length} backdrops`);
