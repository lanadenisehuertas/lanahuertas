import { BAYER } from "./dither";

/**
 * The halftone portrait. The photo is printed as a three-tone diamond-mesh
 * (pink midtones, indigo shadows, on cream paper) inside a soft oval that
 * fades into the sky. Scroll drives it: as the portrait comes up the screen
 * the print dithers in, face first; further on, the real photo dithers
 * through the print, again from the face outwards. Scrolling back runs it in
 * reverse. `onProgress(p)` lets the page draw its frame lines along.
 *
 * Drawn at device resolution (capped at 2x). Reduced motion: the finished
 * photo, no dissolve.
 */
export type PortraitOpts = {
  src: string;
  /** CSS size of the canvas */
  W: number;
  H: number;
  zoom?: number;
  /** point of the photo (0..1) placed at `at` (0..1 of the canvas) */
  focus: [number, number];
  at: [number, number];
  /** ink weight 0..1 at CSS point (x, y): the soft shape of the print */
  weight: (x: number, y: number) => number;
  onProgress?: (p: number) => void;
  /** progress (0..1) from outside, e.g. a sticky section's scroll; default: the canvas's own place on screen */
  getP?: () => number;
  /** extra resolution when the canvas is shown larger than W x H */
  res?: number;
  still?: boolean;
};

export function portrait(cv: HTMLCanvasElement, o: PortraitOpts) {
  const S = Math.min(2, window.devicePixelRatio || 1) * (o.res || 1);
  const W = Math.round(o.W * S),
    H = Math.round(o.H * S);
  cv.width = W;
  cv.height = H;
  const x = cv.getContext("2d");
  if (!x) return () => {};
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    return [c, c.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D] as const;
  };
  const wt = (a: number, b: number) => o.weight(a / S, b / S);

  let dead = false,
    raf = 0,
    p = 0;
  let cleanup = () => {};
  const img = new Image();
  img.decoding = "async";
  img.src = o.src;
  img.onload = () => {
    if (dead) return;
    // photo, cover-fitted around the face
    const [photo, px] = mk();
    const s = Math.max(W / img.width, H / img.height) * (o.zoom || 1),
      iw = img.width * s,
      ih = img.height * s;
    px.drawImage(img, o.at[0] * W - o.focus[0] * iw, o.at[1] * H - o.focus[1] * ih, iw, ih);
    const d = px.getImageData(0, 0, W, H).data,
      L = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) L[i] = (d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11) / 255;
    const so = Float32Array.from(L).sort(),
      lo = so[(L.length * 0.02) | 0],
      hi = so[(L.length * 0.985) | 0];
    for (let i = 0; i < L.length; i++) L[i] = Math.pow(Math.min(1, Math.max(0, (L[i] - lo) / (hi - lo))), 0.85);
    const lum = (a: number, b: number) => L[Math.min(H - 1, Math.max(0, b | 0)) * W + Math.min(W - 1, Math.max(0, a | 0))];

    // weight map once (the soft oval)
    const Wm = new Float32Array(W * H);
    for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) Wm[yy * W + xx] = wt(xx, yy);
    const wAt = (a: number, b: number) => Wm[Math.min(H - 1, Math.max(0, b | 0)) * W + Math.min(W - 1, Math.max(0, a | 0))];

    // the print: cream paper where there is ink weight, then two diamond plates
    const [base, bx] = mk();
    const paper = bx.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      paper.data[i * 4] = 253;
      paper.data[i * 4 + 1] = 243;
      paper.data[i * 4 + 2] = 225;
      paper.data[i * 4 + 3] = Math.round(255 * Math.min(1, Wm[i] * 1.15));
    }
    bx.putImageData(paper, 0, 0);
    const step = 6 * S;
    // each plate is one path of diamonds, filled once
    const plate = (color: string, ang: number, curve: (t: number) => number) => {
      const path = new Path2D();
      const ca = Math.cos(ang),
        sa = Math.sin(ang);
      for (let j = -H; j < H * 2; j += step)
        for (let i = -W; i < W * 2; i += step) {
          const qx = i * ca - j * sa + W / 2,
            qy = i * sa + j * ca - H / 2;
          if (qx < -step || qy < -step || qx > W + step || qy > H + step) continue;
          const a = curve(1 - lum(qx, qy)) * step * 0.95 * wAt(qx, qy);
          if (a < 0.6 * S) continue;
          const r = a * Math.SQRT1_2;
          path.moveTo(qx, qy - r);
          path.lineTo(qx + r, qy);
          path.lineTo(qx, qy + r);
          path.lineTo(qx - r, qy);
          path.closePath();
        }
      bx.fillStyle = color;
      bx.fill(path);
    };
    bx.globalCompositeOperation = "multiply";
    plate("#ff7cb8", 0.26, (t) => Math.min(1, t * 1.25));
    plate("#3a3fc9", 0.62, (t) => Math.max(0, (t - 0.4) * 1.8));
    bx.globalCompositeOperation = "source-over";

    // the real photo inside the same soft shape
    const [photoW, pwx] = mk();
    const wd = pwx.createImageData(W, H);
    for (let i = 0; i < W * H; i++) wd.data[i * 4 + 3] = Math.round(255 * Math.min(1, Wm[i] * 1.4));
    pwx.putImageData(wd, 0, 0);
    pwx.globalCompositeOperation = "source-in";
    pwx.drawImage(photo, 0, 0);

    const [m, mx] = mk(),
      [t, tx] = mk();
    const fx = o.at[0] * W,
      fy = o.at[1] * H,
      dmax = Math.hypot(Math.max(fx, W - fx), Math.max(fy, H - fy));
    const dissolve = (src: HTMLCanvasElement, e: number, cell: number) => {
      if (e <= 0) return;
      if (e >= 1) {
        x.drawImage(src, 0, 0);
        return;
      }
      mx.clearRect(0, 0, W, H);
      mx.fillStyle = "#000";
      for (let yy = 0; yy < H; yy += cell)
        for (let xx = 0; xx < W; xx += cell) {
          const dd = Math.hypot(xx - fx, yy - fy) / dmax;
          if (BAYER[Math.floor(yy / cell) % 8][Math.floor(xx / cell) % 8] / 64 < e * 1.55 - dd * 0.55) mx.fillRect(xx, yy, cell, cell);
        }
      tx.clearRect(0, 0, W, H);
      tx.globalCompositeOperation = "source-over";
      tx.drawImage(src, 0, 0);
      tx.globalCompositeOperation = "destination-in";
      tx.drawImage(m, 0, 0);
      x.drawImage(t, 0, 0);
    };
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    const frame = () => {
      raf = 0;
      x.clearRect(0, 0, W, H);
      // stage 1: the print dithers in; stage 2: the real photo dithers through it
      const e1 = clamp(p / 0.45),
        e2 = clamp((p - 0.5) / 0.5);
      if (e2 < 1) dissolve(base, e1, Math.round(5 * S));
      dissolve(photoW, e2, Math.round(4 * S));
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    if (o.still) {
      p = 1;
      o.onProgress?.(1);
      kick();
      return;
    }
    // 0 when the top of the portrait reaches the bottom of the screen,
    // 1 when its middle has risen to a third of the way down
    const read = () => {
      let v: number;
      if (o.getP) v = clamp(o.getP());
      else {
        const b = cv.getBoundingClientRect(),
          vh = innerHeight,
          a = vh * 0.95,
          z = vh * 0.33 - b.height * 0.5;
        v = clamp((a - b.top) / (a - z));
      }
      const np = v * v * (3 - 2 * v);
      if (Math.abs(np - p) > 0.002 || np === 0 || np === 1) {
        if (np === p) return;
        p = np;
        o.onProgress?.(p);
        kick();
      }
    };
    addEventListener("scroll", read, { passive: true });
    addEventListener("resize", read);
    read();
    o.onProgress?.(p);
    kick();
    cleanup = () => {
      removeEventListener("scroll", read);
      removeEventListener("resize", read);
    };
  };

  return () => {
    dead = true;
    cancelAnimationFrame(raf);
    cleanup();
  };
}
