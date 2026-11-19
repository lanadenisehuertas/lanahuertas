/*
 * The guestbook garden's flowers: six kinds drawn as pixel art (the same
 * crisp 1px-cell style as the site's pixel butterfly and daisies) and seven
 * petal colours from the site's palette. Shared by the page and the API, so
 * the server only ever accepts a kind and colour the page can draw.
 */

export const KINDS = ["daisy", "tulip", "cosmos", "lotus", "bell", "heart"] as const;
export type Kind = (typeof KINDS)[number];
export const KIND_LABEL: Record<Kind, string> = { daisy: "Daisy", tulip: "Tulip", cosmos: "Cosmos", lotus: "Lotus", bell: "Bellflower", heart: "Heart bloom" };

export const COLORS = { pink: "#ff9ec4", blush: "#ffcfe0", lilac: "#c9b8ff", sky: "#a9b6f0", peach: "#ffc2a1", butter: "#ffd98a", cream: "#fdf3e1" } as const;
export type ColorKey = keyof typeof COLORS;
export const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];

export type Flower = { id: string; name: string; note: string; kind: Kind; color: ColorKey; t: number; pending?: boolean };

export const LIMITS = { name: 24, note: 90 };

/* p petal, d petal shade, c centre */
const HEADS: Record<Kind, string[]> = {
  daisy: ["...p...", ".p.p.p.", "..ppp..", "ppdcdpp", "..ppp..", ".p.p.p.", "...p..."],
  tulip: ["p..p..p", "pp.p.pp", "ppppppp", "pdppppp", ".pdppp.", "..ppp.."],
  cosmos: [".pp.pp.", ".ppdpp.", "..pcp..", ".pdppp.", ".pp.pp."],
  lotus: ["...p...", "..pdp..", "p.ppp.p", "pp.p.pp", ".pdppp.", "..ppp.."],
  bell: ["..ppp..", ".ppppp.", ".pdppp.", "ppppppp", "p.p.p.p"],
  heart: [".pp.pp.", "ppppppp", "pdppppp", ".ppppp.", "..ppp..", "...p..."],
};

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16),
    f = (v: number) => Math.round(v * k);
  return `rgb(${f(n >> 16)} ${f((n >> 8) & 255)} ${f(n & 255)})`;
};

/** small deterministic hash, for each flower's own stem height and leaves */
export const hashOf = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

/**
 * The flower as SVG markup, 7 cells wide, its stem `stem` cells tall. Cells
 * are 1 unit; the SVG scales crisply (shape-rendering: crispEdges).
 */
export function flowerSvg(kind: Kind, color: ColorKey, seed: string, stem?: number) {
  const head = HEADS[kind] ?? HEADS.daisy,
    p = COLORS[color] ?? COLORS.pink,
    h = hashOf(seed),
    s = stem ?? 7 + (h % 6),
    centre = color === "butter" || color === "peach" ? "#fdf3e1" : "#ffd98a",
    fill: Record<string, string> = { p, d: shade(p, 0.84), c: centre },
    rows = head.length,
    H = rows + s,
    r: string[] = [];
  head.forEach((row, y) => [...row].forEach((ch, x) => fill[ch] && r.push(`<rect x="${x}" y="${y}" width="1" height="1" fill="${fill[ch]}"/>`)));
  // the stem, with a leaf or two on alternating sides
  r.push(`<rect x="3" y="${rows}" width="1" height="${s}" fill="#4f9a78"/>`);
  const leaves = [2 + (h % 3), 4 + ((h >> 3) % Math.max(1, s - 5))];
  leaves.forEach((ly, i) => {
    const left = (i + (h >> 6)) % 2 === 0;
    r.push(`<rect x="${left ? 1 : 4}" y="${rows + ly}" width="2" height="1" fill="#7cc4a0"/>`);
    r.push(`<rect x="${left ? 2 : 4}" y="${rows + ly - 1}" width="1" height="1" fill="#b9e4cf"/>`);
  });
  return { svg: `<svg viewBox="0 0 7 ${H}" shape-rendering="crispEdges" aria-hidden="true">${r.join("")}</svg>`, w: 7, h: H };
}

/** Lana's and Peanut's flowers, so the garden is never bare on a fresh deploy. */
export const SEEDS: Flower[] = [
  { id: "seed-lana", name: "Lana", note: "Welcome to my garden. Thank you for staying to the end ✿", kind: "lotus", color: "pink", t: Date.UTC(2026, 10, 1) },
  { id: "seed-peanut", name: "Peanut", note: "meow (she says hi)", kind: "heart", color: "peach", t: Date.UTC(2026, 10, 1) },
];
