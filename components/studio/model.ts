/*
 * The studio's document: a stack of layers drawn bottom to top on a canvas,
 * the way Photoshop composites them. Everything is plain data (so history is
 * a list of snapshots and a draft survives a reload); the renderer and the
 * hit test below are the only code that knows how a layer looks.
 *
 * Positions are in document pixels (1080 wide), measured to the layer's
 * centre, so rotating and scaling happen about the middle like Free Transform.
 */

export type Blend = "normal" | "multiply" | "screen" | "overlay" | "soft-light";
export type FontKey = "redaction" | "redaction-italic" | "redaction-bold" | "redaction-35" | "redaction-70" | "inter" | "mono";
export type ShapeKind = "rect" | "ellipse" | "sparkle";
export type FxKind = "grain" | "halftone" | "dither";

type Common = { id: string; name: string; visible: boolean; opacity: number; blend: Blend; shadow?: boolean };
export type FillLayer = Common & { kind: "fill"; mode: "solid" | "linear" | "radial"; a: string; b: string };
export type TextLayer = Common & {
  kind: "text";
  x: number;
  y: number;
  rot: number;
  text: string;
  font: FontKey;
  size: number;
  color: string;
  align: "left" | "center" | "right";
  /** tracking in 1/1000 em, as in the Character panel */
  track: number;
  /** leading as a multiple of the size */
  lead: number;
};
export type ShapeLayer = Common & { kind: "shape"; shape: ShapeKind; x: number; y: number; w: number; h: number; rot: number; fill: string; radius: number };
export type ImageLayer = Common & { kind: "image"; src: string; pixel?: boolean; x: number; y: number; w: number; h: number; rot: number };
export type FxLayer = Common & { kind: "fx"; fx: FxKind; amount: number };
export type Layer = FillLayer | TextLayer | ShapeLayer | ImageLayer | FxLayer;
export type Placed = TextLayer | ShapeLayer | ImageLayer;
export type Doc = { name: string; w: number; h: number; layers: Layer[] };

export const isPlaced = (l: Layer): l is Placed => l.kind === "text" || l.kind === "shape" || l.kind === "image";

let seq = 0;
export const uid = () => `l${Date.now().toString(36)}${(seq++).toString(36)}`;

/* ---------- fonts ---------- */

export const FONTS: { key: FontKey; label: string; v: string; style: string; weight: number }[] = [
  { key: "redaction", label: "Redaction", v: "--font-redaction", style: "normal", weight: 400 },
  { key: "redaction-italic", label: "Redaction Italic", v: "--font-redaction", style: "italic", weight: 400 },
  { key: "redaction-bold", label: "Redaction Bold", v: "--font-redaction", style: "normal", weight: 700 },
  { key: "redaction-35", label: "Redaction 35 (worn)", v: "--font-r35", style: "normal", weight: 400 },
  { key: "redaction-70", label: "Redaction 70 (pixel worn)", v: "--font-r70", style: "normal", weight: 400 },
  { key: "inter", label: "Inter Tight", v: "--font-inter-tight", style: "normal", weight: 500 },
  { key: "mono", label: "DM Mono", v: "--font-pixel", style: "normal", weight: 500 },
];
const family = new Map<string, string>();
const fam = (v: string) => {
  if (!family.has(v) && typeof document !== "undefined")
    family.set(v, getComputedStyle(document.documentElement).getPropertyValue(v).trim() || "Georgia, serif");
  return family.get(v) || "Georgia, serif";
};
export const fontCss = (key: FontKey, size: number) => {
  const f = FONTS.find((x) => x.key === key) ?? FONTS[0];
  return `${f.style} ${f.weight} ${size}px ${fam(f.v)}`;
};
/** Ask the browser for every face the studio offers; resolves once they can draw. */
export const loadFonts = () =>
  typeof document === "undefined" ? Promise.resolve() : Promise.all(FONTS.map((f) => document.fonts.load(fontCss(f.key, 40), "Aa")).map((p) => p.catch(() => null))).then(() => undefined);

/* ---------- stickers: Lana's own art, the site's Libraries ---------- */

export type Sticker = { src: string; label: string; ar: number; pixel?: boolean; w: number };
export const STICKERS: Sticker[] = [
  { src: "/art/pixel-butterfly.svg", label: "Pixel butterfly", ar: 13 / 9, pixel: true, w: 220 },
  { src: "/art/pixel-lotus.svg", label: "Pixel lotus", ar: 84 / 60, pixel: true, w: 300 },
  { src: "/art/pixel-moon.svg", label: "Pixel moon", ar: 1, pixel: true, w: 200 },
  { src: "/art/pixel-heart.svg", label: "Pixel heart", ar: 9 / 8, pixel: true, w: 120 },
  { src: "/art/pixel-note.svg", label: "Pixel note", ar: 14 / 11, pixel: true, w: 140 },
  { src: "/art/pixel-daisy.svg", label: "Pixel daisy", ar: 1, pixel: true, w: 180 },
  { src: "/art/pixel-daisy-lilac.svg", label: "Lilac daisy", ar: 1, pixel: true, w: 180 },
  { src: "/art/pixel-sparkle.svg", label: "Sparkle", ar: 1, pixel: true, w: 160 },
  { src: "/art/pixel-sparkle-pink.svg", label: "Pink sparkle", ar: 1, pixel: true, w: 160 },
  { src: "/art/pixel-sparkle-violet.svg", label: "Violet sparkle", ar: 1, pixel: true, w: 160 },
  { src: "/art/pixel-cloud.svg", label: "Pixel cloud", ar: 2, pixel: true, w: 360 },
  { src: "/art/pixel-swirl.svg", label: "Pixel swirl", ar: 64 / 40, pixel: true, w: 300 },
  { src: "/art/peanut/sleep.svg", label: "Peanut, asleep", ar: 52 / 35, pixel: true, w: 320 },
  { src: "/art/peanut/awake.svg", label: "Peanut, awake", ar: 52 / 35, pixel: true, w: 320 },
  { src: "/art/peanut/peek.svg", label: "Peanut, peeking", ar: 48 / 31, pixel: true, w: 320 },
  { src: "/art/butterfly.webp", label: "Butterfly", ar: 560 / 460, w: 300 },
  { src: "/art/garden/lotus-cluster.webp", label: "Lotus bed", ar: 1000 / 471, w: 640 },
  { src: "/art/garden/cloud-bank.webp", label: "Cloud bank", ar: 1400 / 196, w: 1080 },
  { src: "/art/garden/vinyl.webp", label: "Vinyl", ar: 1, w: 420 },
  { src: "/art/garden/bass.webp", label: "Bass", ar: 640 / 425, w: 520 },
  { src: "/art/garden/mic.webp", label: "Mic", ar: 360 / 528, w: 260 },
  { src: "/art/garden/yarn.webp", label: "Yarn", ar: 460 / 260, w: 320 },
  { src: "/art/garden/crane.webp", label: "Paper crane", ar: 1400 / 689, w: 520 },
  { src: "/art/garden/note-1.webp", label: "Note", ar: 81 / 109, w: 120 },
  { src: "/art/garden/note-0.webp", label: "Quaver", ar: 90 / 109, w: 120 },
  { src: "/art/garden/note-3.webp", label: "Little note", ar: 79 / 87, w: 110 },
  { src: "/art/cloud.webp", label: "Soft cloud", ar: 900 / 333, w: 620 },
  { src: "/art/garden/earbuds.webp", label: "Earbuds", ar: 719 / 1330, w: 260 },
];

/** Images by src. SVGs get a real size first, so every browser can draw them on a canvas. */
const imgs = new Map<string, HTMLImageElement>();
const pending = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string): Promise<HTMLImageElement> {
  const have = imgs.get(src);
  if (have) return Promise.resolve(have);
  if (pending.has(src)) return pending.get(src)!;
  const p = (async () => {
    let url = src;
    if (src.endsWith(".svg")) {
      const txt = await (await fetch(src)).text();
      const vb = txt.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      const k = vb ? Math.max(1, Math.round(1200 / Math.max(+vb[1], +vb[2]))) : 8;
      const sized = vb ? txt.replace("<svg ", `<svg width="${+vb[1] * k}" height="${+vb[2] * k}" `) : txt;
      url = URL.createObjectURL(new Blob([sized], { type: "image/svg+xml" }));
    }
    const im = new Image();
    im.decoding = "async";
    im.src = url;
    await im.decode();
    imgs.set(src, im);
    return im;
  })();
  pending.set(src, p);
  return p;
}

/* ---------- swatches: every brand palette, as swatch groups ---------- */

export const SITE_SWATCHES = ["#fdf3e1", "#ffcfe0", "#ff9ec4", "#c9b8ff", "#9fe3d6", "#ffd98a", "#2d3b97", "#330c4b", "#51017c", "#1b0730", "#ffffff", "#000000"];

/* ---------- text metrics ---------- */

let mctx: CanvasRenderingContext2D | null = null;
const mc = () => (mctx ||= document.createElement("canvas").getContext("2d")!);
const setFont = (c: CanvasRenderingContext2D, l: TextLayer) => {
  c.font = fontCss(l.font, l.size);
  (c as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = `${(l.track / 1000) * l.size}px`;
};
/** A text layer's box: the widest line by the lines' height. */
export function textBox(l: TextLayer) {
  const c = mc();
  setFont(c, l);
  const lines = l.text.split("\n");
  const w = Math.max(l.size * 0.3, ...lines.map((s) => c.measureText(s || " ").width));
  return { w: w + l.size * 0.08, h: Math.max(1, lines.length) * l.size * l.lead, lines };
}
export const boxOf = (l: Placed) => (l.kind === "text" ? textBox(l) : { w: l.w, h: l.h });

/* ---------- hit testing ---------- */

/** The point in a layer's own frame (centre origin, unrotated). */
export function toLocal(l: Placed, px: number, py: number) {
  const a = (-l.rot * Math.PI) / 180,
    dx = px - l.x,
    dy = py - l.y;
  return [dx * Math.cos(a) - dy * Math.sin(a), dx * Math.sin(a) + dy * Math.cos(a)];
}
export function hit(doc: Doc, px: number, py: number): Placed | null {
  for (let i = doc.layers.length - 1; i >= 0; i--) {
    const l = doc.layers[i];
    if (!l.visible || !isPlaced(l)) continue;
    const { w, h } = boxOf(l),
      [lx, ly] = toLocal(l, px, py),
      pad = 8;
    if (Math.abs(lx) <= w / 2 + pad && Math.abs(ly) <= h / 2 + pad) return l;
  }
  return null;
}

/* ---------- drawing ---------- */

const OP: Record<Blend, GlobalCompositeOperation> = { normal: "source-over", multiply: "multiply", screen: "screen", overlay: "overlay", "soft-light": "soft-light" };

function sparkle(c: CanvasRenderingContext2D, w: number, h: number) {
  const rx = w / 2,
    ry = h / 2,
    k = 0.16;
  c.beginPath();
  c.moveTo(0, -ry);
  c.quadraticCurveTo(rx * k, -ry * k, rx, 0);
  c.quadraticCurveTo(rx * k, ry * k, 0, ry);
  c.quadraticCurveTo(-rx * k, ry * k, -rx, 0);
  c.quadraticCurveTo(-rx * k, -ry * k, 0, -ry);
  c.closePath();
}

function drawPlaced(c: CanvasRenderingContext2D, l: Placed) {
  c.translate(l.x, l.y);
  c.rotate((l.rot * Math.PI) / 180);
  if (l.kind === "shape") {
    c.fillStyle = l.fill;
    c.beginPath();
    if (l.shape === "rect") c.roundRect(-l.w / 2, -l.h / 2, l.w, l.h, Math.min(l.radius, l.w / 2, l.h / 2));
    else if (l.shape === "ellipse") c.ellipse(0, 0, l.w / 2, l.h / 2, 0, 0, Math.PI * 2);
    else sparkle(c, l.w, l.h);
    c.fill();
  } else if (l.kind === "image") {
    const im = imgs.get(l.src);
    if (im) {
      c.imageSmoothingEnabled = !l.pixel;
      c.drawImage(im, -l.w / 2, -l.h / 2, l.w, l.h);
    }
  } else {
    const { w, h, lines } = textBox(l);
    setFont(c, l);
    c.fillStyle = l.color;
    c.textBaseline = "middle";
    c.textAlign = l.align;
    const x = l.align === "left" ? -w / 2 : l.align === "right" ? w / 2 : 0,
      lh = l.size * l.lead;
    lines.forEach((s, i) => c.fillText(s, x, -h / 2 + lh * (i + 0.5) + l.size * 0.04));
  }
}

/* adjustment layers work on everything below them, like Photoshop's */
const hash = (x: number, y: number) => {
  let h = (x * 374761393 + y * 668265263) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) & 255) / 255;
};
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
function applyFx(c: CanvasRenderingContext2D, l: FxLayer, scale: number) {
  const W = c.canvas.width,
    H = c.canvas.height,
    amt = Math.max(0, Math.min(1, l.amount)) * l.opacity;
  if (!amt) return;
  if (l.fx === "halftone") {
    // sample the composite, then print darker dots over it, sized by how dark each cell is
    const cell = Math.max(3, 11 * scale),
      src = c.getImageData(0, 0, W, H).data,
      t = document.createElement("canvas");
    t.width = W;
    t.height = H;
    const g = t.getContext("2d")!;
    for (let y = 0, row = 0; y < H + cell; y += cell * 0.866, row++)
      for (let x = (row % 2) * (cell / 2); x < W + cell; x += cell) {
        const sx = Math.min(W - 1, Math.round(x)),
          sy = Math.min(H - 1, Math.round(y)),
          i = (sy * W + sx) * 4,
          r = src[i],
          gg = src[i + 1],
          b = src[i + 2],
          lum = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
        g.fillStyle = `rgb(${r * 0.55} ${gg * 0.5} ${b * 0.6})`;
        g.beginPath();
        g.arc(x, y, (cell / 2) * (0.25 + 0.75 * Math.sqrt(1 - lum)), 0, Math.PI * 2);
        g.fill();
      }
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.globalAlpha = amt;
    c.globalCompositeOperation = "multiply";
    c.drawImage(t, 0, 0);
    c.restore();
    return;
  }
  const im = c.getImageData(0, 0, W, H),
    d = im.data,
    inv = 1 / scale;
  if (l.fx === "grain") {
    const k = 90 * amt,
      gs = 1.5 * inv;
    for (let y = 0; y < H; y++) {
      const gy = Math.floor(y * gs);
      for (let x = 0; x < W; x++) {
        const n = (hash(Math.floor(x * gs), gy) - 0.5) * k,
          i = (y * W + x) * 4;
        d[i] += n;
        d[i + 1] += n;
        d[i + 2] += n;
      }
    }
  } else {
    // ordered dither in 3px cells, three levels a channel: the site's print look
    const cell = Math.max(1, Math.round(3 * scale)),
      lv = 2;
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4,
          t = (BAYER[((Math.floor(y / cell) & 3) << 2) | (Math.floor(x / cell) & 3)] + 0.5) / 16 - 0.5;
        for (let ch = 0; ch < 3; ch++) {
          const v = d[i + ch] / 255,
            q = Math.round(Math.min(1, Math.max(0, v + t / lv)) * lv) / lv;
          d[i + ch] = v * 255 + (q * 255 - v * 255) * amt;
        }
      }
  }
  c.putImageData(im, 0, 0);
}

/**
 * Draw the document at `scale` (canvas pixels per document pixel). `hide`
 * leaves one layer out: the text being typed, which shows in its editor.
 */
export function render(c: CanvasRenderingContext2D, doc: Doc, scale: number, hide?: string) {
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  for (const l of doc.layers) {
    if (!l.visible || l.id === hide) continue;
    if (l.kind === "fx") {
      applyFx(c, l, scale);
      continue;
    }
    c.save();
    c.setTransform(scale, 0, 0, scale, 0, 0);
    c.globalAlpha = l.opacity;
    c.globalCompositeOperation = OP[l.blend];
    if (l.kind === "fill") {
      let fill: string | CanvasGradient = l.a;
      if (l.mode === "linear") {
        const g = c.createLinearGradient(0, 0, 0, doc.h);
        g.addColorStop(0, l.a);
        g.addColorStop(1, l.b);
        fill = g;
      } else if (l.mode === "radial") {
        const g = c.createRadialGradient(doc.w / 2, doc.h * 0.42, 0, doc.w / 2, doc.h * 0.42, Math.hypot(doc.w, doc.h) * 0.6);
        g.addColorStop(0, l.a);
        g.addColorStop(1, l.b);
        fill = g;
      }
      c.fillStyle = fill;
      c.fillRect(0, 0, doc.w, doc.h);
    } else {
      if (l.shadow) {
        c.shadowColor = "rgb(20 8 40 / 0.45)";
        c.shadowBlur = 36 * scale;
        c.shadowOffsetY = 14 * scale;
      }
      drawPlaced(c, l);
    }
    c.restore();
  }
}

/* ---------- starting points ---------- */

const base = (name: string): Common => ({ id: uid(), name, visible: true, opacity: 1, blend: "normal" });
const bg = (mode: FillLayer["mode"], a: string, b: string): FillLayer => ({ ...base("Background"), kind: "fill", mode, a, b });
const txt = (name: string, o: Partial<TextLayer> & { x: number; y: number; text: string }): TextLayer => ({
  ...base(name),
  kind: "text",
  rot: 0,
  font: "redaction",
  size: 80,
  color: "#fdf3e1",
  align: "center",
  track: 0,
  lead: 1.1,
  ...o,
});
const shape = (name: string, o: Partial<ShapeLayer> & { x: number; y: number; w: number; h: number; fill: string }): ShapeLayer => ({
  ...base(name),
  kind: "shape",
  shape: "rect",
  rot: 0,
  radius: 0,
  ...o,
});
export const stickerLayer = (s: Sticker, x: number, y: number, w = s.w): ImageLayer => ({
  ...base(s.label),
  kind: "image",
  src: s.src,
  pixel: s.pixel,
  x,
  y,
  w,
  h: w / s.ar,
  rot: 0,
});
const st = (src: string) => STICKERS.find((s) => s.src.endsWith(src))!;
const fx = (fx: FxKind, amount: number, name: string): FxLayer => ({ ...base(name), kind: "fx", fx, amount });

export type TemplateCat = "events" | "socials" | "blank";
export type Template = { key: string; name: string; note: string; cat: TemplateCat; make: (w: number, h: number) => Layer[] };
export const TEMPLATE_CATS: { key: TemplateCat | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "events", label: "Events" },
  { key: "socials", label: "Socials" },
  { key: "blank", label: "Blank" },
];

/** a rounded label: the pill and its words, as two layers */
const pill = (name: string, x: number, y: number, w: number, h: number, fill: string, text: string, color: string, size = 30, font: FontKey = "mono"): Layer[] => [
  shape(`${name} pill`, { x, y, w, h, fill, radius: h / 2 }),
  txt(name, { x, y, text, font, size, track: font === "mono" ? 160 : 0, color }),
];
const rule = (name: string, x: number, y: number, w: number, color: string, opacity = 0.35): ShapeLayer => ({ ...shape(name, { x, y, w, h: 2, fill: color }), opacity });

export const TEMPLATES: Template[] = [
  {
    key: "dusk-fest",
    name: "Dusk Fest",
    note: "Event pubmat in the garden's own sunset",
    cat: "events",
    make: (W, H) => [
      bg("linear", "#2d3b97", "#e3a0c0"),
      { ...shape("Moon glow", { x: W / 2, y: H * 0.36, w: W * 0.9, h: W * 0.9, fill: "#ffd6be", shape: "ellipse" }), opacity: 0.22, blend: "screen" },
      txt("Presents", { x: W / 2, y: H * 0.075, text: "THE GARDEN PRESENTS", font: "mono", size: 26, track: 320, color: "#ffcfe0" }),
      { ...stickerLayer(st("pixel-moon.svg"), W * 0.8, H * 0.15, 150) },
      { ...stickerLayer(st("pixel-sparkle-pink.svg"), W * 0.17, H * 0.21, 110) },
      txt("DUSK FEST", { x: W / 2, y: H * 0.36, text: "Dusk\nFest", font: "redaction-bold", size: 230, lead: 0.86, color: "#fdf3e1", shadow: true }),
      txt("a night in the garden", { x: W / 2, y: H * 0.555, text: "a night in the garden", font: "redaction-italic", size: 64, color: "#ffcfe0" }),
      ...pill("Details", W / 2, H * 0.64, 640, 72, "#fdf3e1", "NOV 28 · 6 PM · THE GARDEN", "#2d3b97", 28),
      stickerLayer(st("lotus-cluster.webp"), W * 0.22, H - W * 0.17, 560),
      { ...stickerLayer(st("lotus-cluster.webp"), W * 0.84, H - W * 0.13, 460) },
      { ...stickerLayer(st("pixel-butterfly.svg"), W * 0.72, H * 0.75, 150), rot: 12 },
      fx("grain", 0.35, "Grain"),
    ],
  },
  {
    key: "workshop",
    name: "Workshop Series",
    note: "Three days, three cards, one look",
    cat: "events",
    make: (W, H) => [
      bg("radial", "#3a3fc9", "#0e1033"),
      { ...stickerLayer(st("pixel-sparkle.svg"), W * 0.12, H * 0.08, 90) },
      { ...stickerLayer(st("pixel-sparkle-violet.svg"), W * 0.9, H * 0.15, 120) },
      txt("Series", { x: W / 2, y: H * 0.1, text: "A THREE-DAY LEARNING SERIES", font: "mono", size: 26, track: 280, color: "#c9b8ff" }),
      txt("Title", { x: W / 2, y: H * 0.27, text: "Make it\nby hand", font: "redaction-bold", size: 170, lead: 0.9, color: "#fdf3e1", shadow: true }),
      txt("Tagline", { x: W / 2, y: H * 0.44, text: "type, colour and layout, from scratch", font: "redaction-italic", size: 50, color: "#ffcfe0" }),
      ...[0, 1, 2].flatMap((i): Layer[] => {
        const x = W * (0.2 + i * 0.3),
          y = H * 0.65,
          days = ["20", "22", "24"],
          what = ["Type", "Colour", "Layout"];
        return [
          { ...shape(`Day ${i + 1} card`, { x, y, w: W * 0.26, h: H * 0.22, fill: "#fdf3e1", radius: 34 }), shadow: true },
          txt(`Day ${i + 1}`, { x, y: y - H * 0.065, text: `DAY ${i + 1}`, font: "mono", size: 24, track: 220, color: "#76389b" }),
          txt(`Date ${i + 1}`, { x, y: y + H * 0.005, text: days[i], font: "redaction-bold", size: 120, color: "#2d3b97" }),
          txt(`Topic ${i + 1}`, { x, y: y + H * 0.07, text: what[i], font: "redaction-italic", size: 40, color: "#924050" }),
        ];
      }),
      rule("Rule", W / 2, H * 0.86, W * 0.76, "#c9b8ff"),
      txt("Details", { x: W / 2, y: H * 0.91, text: "JANUARY 2026 · ROOM 801 · FREE FOR MEMBERS", font: "mono", size: 26, track: 160, color: "#fdf3e1" }),
      fx("grain", 0.3, "Grain"),
    ],
  },
  {
    key: "save-the-date",
    name: "Save the Date",
    note: "A big number on a peach-to-lilac sky",
    cat: "events",
    make: (W, H) => [
      bg("linear", "#ffe0cc", "#c9b8ff"),
      { ...shape("Sun", { x: W / 2, y: H * 0.47, w: W * 0.82, h: W * 0.82, fill: "#fff6ea", shape: "ellipse" }), opacity: 0.7 },
      { ...stickerLayer(st("pixel-moon.svg"), W * 0.84, H * 0.1, 130) },
      txt("Save the date", { x: W / 2, y: H * 0.17, text: "save the date", font: "redaction-italic", size: 100, color: "#51017c" }),
      txt("Day", { x: W / 2, y: H * 0.46, text: "28", font: "redaction-bold", size: 520, color: "#ff9ec4", shadow: true }),
      txt("Month", { x: W / 2, y: H * 0.665, text: "NOVEMBER", font: "mono", size: 46, track: 520, color: "#51017c" }),
      txt("Event", { x: W / 2, y: H * 0.75, text: "Lantern Night in the Garden", font: "redaction", size: 60, color: "#2d3b97" }),
      { ...stickerLayer(st("cloud-bank.webp"), W / 2, H - W * 0.06, W * 1.2), opacity: 0.95 },
      { ...stickerLayer(st("pixel-butterfly.svg"), W * 0.17, H * 0.6, 130), rot: -14 },
      fx("dither", 0.22, "Dither"),
    ],
  },
  {
    key: "gig-night",
    name: "Gig Night",
    note: "Band-night poster, worn type and halftone",
    cat: "events",
    make: (W, H) => [
      bg("radial", "#924050", "#232424"),
      { ...shape("Sun", { x: W / 2, y: H * 0.45, w: W * 0.68, h: W * 0.68, fill: "#f0e8a4", shape: "ellipse" }), opacity: 0.9 },
      { ...stickerLayer(st("bass.webp"), W * 0.5, H * 0.48, 860), rot: -18, shadow: true },
      fx("halftone", 0.6, "Color Halftone"),
      txt("LIVE AT DUSK", { x: W / 2, y: H * 0.1, text: "LIVE AT DUSK", font: "redaction-35", size: 118, color: "#f0e8a4", track: -10 }),
      txt("Line-up", { x: W / 2, y: H * 0.8, text: "the strays · peanut & the purrs\nmoonlit bass club", font: "redaction-italic", size: 52, lead: 1.25, color: "#f0e8a4" }),
      txt("Details", { x: W / 2, y: H * 0.92, text: "SAT · DOORS 7PM · FREE", font: "mono", size: 30, track: 200, color: "#b58c86" }),
      fx("grain", 0.3, "Grain"),
    ],
  },
  {
    key: "line-up",
    name: "Tonight's Line-up",
    note: "A running order, set like a programme",
    cat: "events",
    make: (W, H) => {
      const rows = [
        ["7:00", "Doors open"],
        ["7:30", "The Strays"],
        ["8:15", "Peanut & the Purrs"],
        ["9:00", "Moonlit Bass Club"],
      ];
      const top = H * 0.44,
        gap = H * 0.105;
      return [
        bg("linear", "#1b0730", "#330c4b"),
        { ...stickerLayer(st("vinyl.webp"), W * 0.97, H * 0.03, 360), rot: 14, opacity: 0.85 },
        txt("Kicker", { x: W / 2, y: H * 0.08, text: "FRIDAY · THE GARDEN STAGE", font: "mono", size: 26, track: 260, color: "#ffcfe0" }),
        txt("Title", { x: W / 2, y: H * 0.22, text: "Tonight's\nline-up", font: "redaction-bold", size: 150, lead: 0.92, color: "#ffd98a", shadow: true }),
        ...rows.flatMap(([t, act], i): Layer[] => {
          const y = top + i * gap;
          return [
            rule(`Rule ${i + 1}`, W / 2, y - gap / 2, W * 0.8, "#fdf3e1", 0.22),
            txt(`Time ${i + 1}`, { x: W * 0.2, y, text: t, font: "mono", size: 40, color: "#ffcfe0" }),
            txt(`Act ${i + 1}`, { x: W * 0.6, y, text: act, font: i === 0 ? "redaction-italic" : "redaction", size: 58, color: "#fdf3e1" }),
          ];
        }),
        rule("Rule end", W / 2, top + gap * 3.5, W * 0.8, "#fdf3e1", 0.22),
        { ...stickerLayer(st("note-1.webp"), W * 0.12, H * 0.91, 90), rot: -12 },
        { ...stickerLayer(st("note-3.webp"), W * 0.88, H * 0.91, 90), rot: 10 },
        txt("Details", { x: W / 2, y: H * 0.91, text: "FREE ENTRY · BRING A FRIEND", font: "mono", size: 28, track: 220, color: "#fdf3e1" }),
        fx("grain", 0.3, "Grain"),
      ];
    },
  },
  {
    key: "speaker",
    name: "Speaker Spotlight",
    note: "An arch to place their photo in",
    cat: "socials",
    make: (W, H) => [
      bg("linear", "#1b1650", "#3a2a8a"),
      txt("Kicker", { x: W / 2, y: H * 0.07, text: "SPEAKER SPOTLIGHT", font: "mono", size: 28, track: 320, color: "#ffcfe0" }),
      { ...shape("Arch glow", { x: W / 2, y: H * 0.38, w: W * 0.7, h: H * 0.5, fill: "#ff9ec4", radius: W * 0.35 }), opacity: 0.35, blend: "screen" },
      shape("Photo arch", { x: W / 2, y: H * 0.385, w: W * 0.6, h: H * 0.46, fill: "#ffcfe0", radius: W * 0.3 }),
      stickerLayer(st("peanut/awake.svg"), W / 2, H * 0.53, 420),
      stickerLayer(st("pixel-sparkle-pink.svg"), W * 0.16, H * 0.24, 110),
      stickerLayer(st("pixel-sparkle.svg"), W * 0.85, H * 0.5, 90),
      txt("Name", { x: W / 2, y: H * 0.7, text: "Peanut Huertas", font: "redaction-bold", size: 110, color: "#fdf3e1", shadow: true }),
      txt("Role", { x: W / 2, y: H * 0.77, text: "Head of Naps, The Garden", font: "redaction-italic", size: 50, color: "#ffcfe0" }),
      ...pill("Talk", W / 2, H * 0.855, 760, 84, "#fdf3e1", "“How to sit in a sunbeam”", "#3a2a8a", 38, "redaction-italic"),
      txt("Details", { x: W / 2, y: H * 0.935, text: "JAN 22 · 2 PM · ROOM 801", font: "mono", size: 26, track: 220, color: "#c9b8ff" }),
      fx("grain", 0.3, "Grain"),
    ],
  },
  {
    key: "recruiting",
    name: "Now Recruiting",
    note: "A call for members, cream and teal",
    cat: "socials",
    make: (W, H) => [
      bg("solid", "#fef5da", "#fef5da"),
      { ...shape("Band", { x: W / 2, y: H * 0.5, w: W * 1.4, h: H * 0.34, fill: "#add7c9", rot: -6 }), opacity: 0.85 },
      ...pill("Badge", W / 2, H * 0.12, 520, 84, "#f99e30", "NOW RECRUITING", "#fef5da", 32),
      txt("Title", { x: W / 2, y: H * 0.35, text: "Join the\ncore team", font: "redaction-bold", size: 148, lead: 0.92, color: "#084a5d" }),
      txt("Roles", { x: W / 2, y: H * 0.56, text: "designers · editors · developers", font: "redaction-italic", size: 54, color: "#924050" }),
      stickerLayer(st("pixel-heart.svg"), W / 2, H * 0.71, 220),
      { ...stickerLayer(st("pixel-daisy.svg"), W * 0.13, H * 0.62, 140), rot: -10 },
      { ...stickerLayer(st("pixel-daisy-lilac.svg"), W * 0.87, H * 0.7, 120), rot: 8 },
      ...pill("Apply", W / 2, H * 0.875, 760, 92, "#084a5d", "APPLY BY DEC 5 · LINK IN BIO", "#fef5da", 30),
      fx("grain", 0.25, "Grain"),
    ],
  },
  {
    key: "countdown",
    name: "Countdown",
    note: "Days to go, one huge number",
    cat: "socials",
    make: (W, H) => [
      bg("radial", "#76389b", "#1b0730"),
      txt("Kicker", { x: W / 2, y: H * 0.1, text: "THE COUNTDOWN", font: "mono", size: 30, track: 360, color: "#ffcfe0" }),
      { ...shape("Glow", { x: W / 2, y: H * 0.44, w: W * 0.8, h: W * 0.8, fill: "#ff9ec4", shape: "ellipse" }), opacity: 0.18, blend: "screen" },
      txt("Number", { x: W / 2, y: H * 0.43, text: "3", font: "redaction-bold", size: 720, color: "#ffcfe0", shadow: true }),
      txt("Days to go", { x: W / 2, y: H * 0.7, text: "days to go", font: "redaction-italic", size: 120, color: "#fdf3e1" }),
      stickerLayer(st("pixel-sparkle-pink.svg"), W * 0.2, H * 0.3, 130),
      stickerLayer(st("pixel-sparkle-violet.svg"), W * 0.8, H * 0.56, 110),
      stickerLayer(st("pixel-sparkle.svg"), W * 0.78, H * 0.2, 80),
      txt("Event", { x: W / 2, y: H * 0.88, text: "UNTIL DUSK FEST · NOV 28", font: "mono", size: 30, track: 240, color: "#ffd98a" }),
      fx("dither", 0.3, "Dither"),
    ],
  },
  {
    key: "thank-you",
    name: "Thank You",
    note: "For after the event, with a paper crane",
    cat: "socials",
    make: (W, H) => [
      bg("linear", "#2d3b97", "#ff9ec4"),
      stickerLayer(st("pixel-moon.svg"), W * 0.16, H * 0.11, 120),
      txt("Thank you", { x: W / 2, y: H * 0.33, text: "Thank\nyou", font: "redaction-italic", size: 270, lead: 0.86, color: "#fdf3e1", shadow: true }),
      txt("Line", { x: W / 2, y: H * 0.545, text: "for making Dusk Fest a night to remember", font: "inter", size: 40, color: "#fdf3e1" }),
      txt("Count", { x: W / 2, y: H * 0.61, text: "320 GUESTS · 4 BANDS · 1 VERY HAPPY CAT", font: "mono", size: 24, track: 200, color: "#ffcfe0" }),
      { ...stickerLayer(st("crane.webp"), W * 0.68, H * 0.73, 420), rot: -8, shadow: true },
      stickerLayer(st("cloud-bank.webp"), W / 2, H - W * 0.05, W * 1.25),
      { ...stickerLayer(st("pixel-butterfly.svg"), W * 0.24, H * 0.76, 130), rot: -10 },
      fx("grain", 0.3, "Grain"),
    ],
  },
  {
    key: "quote-card",
    name: "Quote Card",
    note: "Soft and bright, a Neostalgia palette",
    cat: "socials",
    make: (W, H) => [
      bg("solid", "#fef5da", "#fef5da"),
      shape("Arch", { x: W / 2, y: H * 0.47, w: W * 0.78, h: H * 0.7, fill: "#add7c9", radius: W * 0.39 }),
      { ...stickerLayer(st("pixel-daisy.svg"), W * 0.2, H * 0.17, 170), rot: -10 },
      { ...stickerLayer(st("pixel-daisy-lilac.svg"), W * 0.83, H * 0.79, 150), rot: 8 },
      txt("Quote", { x: W / 2, y: H * 0.45, text: "make the\nlittle things\nlovely", font: "redaction-italic", size: 120, lead: 1.0, color: "#084a5d" }),
      txt("Credit", { x: W / 2, y: H * 0.9, text: "— A NOTE TO SELF", font: "mono", size: 30, track: 200, color: "#f99e30" }),
      fx("dither", 0.4, "Dither"),
    ],
  },
  {
    key: "blank",
    name: "Night sky",
    note: "Blank: the garden's night",
    cat: "blank",
    make: () => [bg("linear", "#330c4b", "#2d3b97")],
  },
  {
    key: "blank-sunset",
    name: "Sunset",
    note: "Blank: pink into gold",
    cat: "blank",
    make: () => [bg("linear", "#ffcfe0", "#ffd98a")],
  },
  {
    key: "blank-paper",
    name: "Paper",
    note: "Blank: cream, with grain",
    cat: "blank",
    make: () => [bg("solid", "#fdf3e1", "#fdf3e1"), fx("grain", 0.25, "Grain")],
  },
];
export const SIZES = [
  { key: "post", label: "Portrait post", w: 1080, h: 1350 },
  { key: "story", label: "Story", w: 1080, h: 1920 },
  { key: "square", label: "Square", w: 1080, h: 1080 },
];
export function newDoc(t: Template, size = SIZES[0]): Doc {
  return { name: `${t.key}.psd`, w: size.w, h: size.h, layers: t.make(size.w, size.h) };
}
