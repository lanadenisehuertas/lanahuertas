/**
 * Print-texture ornaments, drawn once to images (no per-frame cost):
 * ordered halftone gradients (dots, squares, diamonds), Bayer dither bands,
 * mesh-filled four-point sparkles, dot-matrix stars and dotted diamonds.
 */
const mk = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d") as CanvasRenderingContext2D] as const;
};

export const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const sm = (t: number) => {
  t = Math.min(1, Math.max(0, t));
  return t * t * (3 - 2 * t);
};

/** 0..1 gradient from a corner ("bl"), an edge ("b") or the centre ("radial") */
const grad = (dir: string, x: number, y: number, w: number, h: number) => {
  if (dir === "radial") return sm(1 - Math.hypot(x / w - 0.5, y / h - 0.5) * 2);
  const fx = dir.includes("l") ? 1 - x / w : dir.includes("r") ? x / w : null;
  const fy = dir.includes("t") ? 1 - y / h : dir.includes("b") ? y / h : null;
  const v = fx !== null && fy !== null ? (fx + fy) / 2 : (fx ?? fy ?? 0);
  return sm((v - 0.25) / 0.75);
};

export type Shape = "dot" | "square" | "diamond";

// Each texture is one path filled once: a few thousand dots drawn as a single
// fill instead of a fill per dot, which is what made them slow on load.
const dotAt = (p: Path2D, x: number, y: number, r: number) => {
  p.moveTo(x + r, y);
  p.arc(x, y, r, 0, Math.PI * 2);
};
const diamondAt = (p: Path2D, x: number, y: number, a: number) => {
  // a square of side a, turned 45 degrees: its corners sit a/sqrt(2) out
  const r = a * Math.SQRT1_2;
  p.moveTo(x, y - r);
  p.lineTo(x + r, y);
  p.lineTo(x, y + r);
  p.lineTo(x - r, y);
  p.closePath();
};

export function halftoneFade(w: number, h: number, { color = "#fdf3e1", step = 10, shape = "dot" as Shape, dir = "bl", angle = 0 } = {}) {
  const [c, x] = mk(w, h);
  const p = new Path2D();
  const ca = Math.cos(angle),
    sa = Math.sin(angle);
  for (let j = -h; j < h * 2; j += step)
    for (let i = -w; i < w * 2; i += step) {
      const px = i * ca - j * sa,
        py = i * sa + j * ca;
      if (px < -step || py < -step || px > w + step || py > h + step) continue;
      const a = grad(dir, px, py, w, h) * step * (shape === "dot" ? 0.62 : 0.9);
      if (a < 0.5) continue;
      if (shape === "dot") dotAt(p, px, py, a);
      else if (shape === "square") p.rect(px - a / 2, py - a / 2, a, a);
      else diamondAt(p, px, py, a);
    }
  x.fillStyle = color;
  x.fill(p);
  return c;
}

export function bayerFade(w: number, h: number, { color = "#fdf3e1", cell = 4, dir = "b" } = {}) {
  const [c, x] = mk(w, h);
  const p = new Path2D();
  for (let y = 0; y < h; y += cell)
    for (let px = 0; px < w; px += cell)
      if (grad(dir, px, y, w, h) * 64 > BAYER[(y / cell) % 8][(px / cell) % 8] + 0.5) p.rect(px, y, cell, cell);
  x.fillStyle = color;
  x.fill(p);
  return c;
}

export function meshStar(R: number, color = "#fff", step = 7) {
  const S = R * 2 + 4,
    [c, x] = mk(S, S),
    cx = S / 2;
  x.beginPath();
  x.moveTo(cx, cx - R);
  x.bezierCurveTo(cx + R * 0.12, cx - R * 0.3, cx + R * 0.3, cx - R * 0.12, cx + R, cx);
  x.bezierCurveTo(cx + R * 0.3, cx + R * 0.12, cx + R * 0.12, cx + R * 0.3, cx, cx + R);
  x.bezierCurveTo(cx - R * 0.12, cx + R * 0.3, cx - R * 0.3, cx + R * 0.12, cx - R, cx);
  x.bezierCurveTo(cx - R * 0.3, cx - R * 0.12, cx - R * 0.12, cx - R * 0.3, cx, cx - R);
  x.clip();
  const p = new Path2D();
  for (let y = 0; y < S; y += step)
    for (let px = 0; px < S; px += step) {
      const d = Math.hypot(px - cx, y - cx) / R,
        a = Math.max(0, 1 - d * 1.15) * step * 1.05 + 1;
      diamondAt(p, px, y, a);
    }
  x.fillStyle = color;
  x.fill(p);
  return c;
}

export function dotStar(R: number, color = "#fdf3e1", step = 5, dot = 1.7) {
  const S = R * 2 + 4,
    [c, x] = mk(S, S),
    cx = S / 2;
  // inside the five-point star, tested with plain geometry (no isPointInPath per dot)
  const pts: [number, number][] = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5,
      r = k % 2 ? R * 0.42 : R;
    pts.push([cx + Math.cos(a) * r, cx + Math.sin(a) * r]);
  }
  const inside = (px: number, py: number) => {
    let hit = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const [xi, yi] = pts[i],
        [xj, yj] = pts[j];
      if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) hit = !hit;
    }
    return hit;
  };
  const p = new Path2D();
  for (let py = step / 2; py < S; py += step)
    for (let px = step / 2; px < S; px += step) if (inside(px, py)) dotAt(p, px, py, dot);
  x.fillStyle = color;
  x.fill(p);
  return c;
}

export function dotDiamond(R: number, color = "#fdf3e1", step = 6, dot = 1.4) {
  const S = R * 2 + 4,
    [c, x] = mk(S, S),
    cx = S / 2;
  const k4: [number, number][] = [
    [cx, cx - R],
    [cx + R, cx],
    [cx, cx + R],
    [cx - R, cx],
  ];
  const p = new Path2D();
  for (let k = 0; k < 4; k++) {
    const a = k4[k],
      b = k4[(k + 1) % 4],
      n = Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step);
    for (let i = 0; i < n; i++) {
      const t = i / n;
      dotAt(p, a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, dot);
    }
  }
  x.fillStyle = color;
  x.fill(p);
  return c;
}

const draw = { halftoneFade, bayerFade, meshStar, dotStar, dotDiamond };
export type DitherFn = keyof typeof draw;

/*
 * The textures as image URLs. Each is drawn once per page and cached by its
 * arguments; the PNG is encoded off the main thread (toBlob) and handed back
 * as a blob URL. It waits for an idle moment first, so first paint and scroll
 * never wait on a texture, and it is kept in Cache Storage, so a second visit
 * reads the PNG back instead of drawing it. Bump VERSION when a drawing changes.
 */
const VERSION = "dusk-tex-v1";
const made = new Map<string, Promise<string>>();
const idle = () =>
  new Promise<void>((r) => {
    const w = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => r(), { timeout: 1500 });
    else setTimeout(r, 60);
  });
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(36);
};
const store = () => ("caches" in window ? caches.open(VERSION).catch(() => null) : Promise.resolve(null));

export function textureUrl(fn: DitherFn, args: unknown[]): Promise<string> {
  const key = fn + JSON.stringify(args);
  let p = made.get(key);
  if (!p) {
    const req = `/__dusk-tex/${hash(key)}.png`;
    p = store().then(async (cache) => {
      const hit = await cache?.match(req).catch(() => undefined);
      if (hit) return URL.createObjectURL(await hit.blob());
      await idle();
      const c = (draw[fn] as (...a: unknown[]) => HTMLCanvasElement)(...args);
      const blob = await new Promise<Blob | null>((r) => c.toBlob(r));
      if (!blob) return c.toDataURL();
      void cache?.put(req, new Response(blob, { headers: { "Content-Type": "image/png" } })).catch(() => {});
      return URL.createObjectURL(blob);
    });
    made.set(key, p);
  }
  return p;
}

/** the drawing functions, for code that wants the canvas itself */
export const dither = draw;
