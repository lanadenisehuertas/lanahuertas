/**
 * Gradient streams: smooth ribbons whose colour runs along their length and
 * slides slowly outward. Matte, like printed ribbon: a flat colour run and one
 * soft shade on the far edge, no white rim and no highlight line.
 * A ribbon either pours out of a point (`from` → `ctrl` → `to`, a quadratic)
 * or runs across the canvas at height `y`. Positions are fractions of the
 * canvas. Draws only while the canvas is on screen.
 */
export type Ribbon = {
  from?: [number, number];
  ctrl?: [number, number];
  to?: [number, number];
  y?: number;
  colors: string[];
  /** wave amplitude, fraction of height */
  amp: number;
  /** half-width, fraction of height */
  w: number;
  twist: number;
  p1?: number;
  p2?: number;
  k1?: number;
  k2?: number;
  tilt?: number;
  alpha?: number;
  delay?: number;
  span?: number;
  offset?: number;
  drift?: number;
  speed?: number;
};

type Live = Ribbon & { cols: number[][] };

const hex = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((v, k) => v + (b[k] - v) * t);
/** ping-pong along the stops, so the sliding colour never jumps */
const colAt = (cols: number[][], t: number) => {
  t = ((t % 2) + 2) % 2;
  if (t > 1) t = 2 - t;
  const s = t * (cols.length - 1),
    i = Math.min(cols.length - 2, Math.floor(s));
  return mix(cols[i], cols[i + 1], s - i);
};

export function streams(cv: HTMLCanvasElement, ribbons: Ribbon[], { still = false } = {}) {
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  const live: Live[] = ribbons.map((r) => ({ ...r, cols: r.colors.map(hex) }));
  // lite devices (touch, few cores, Save-Data) draw at 1x and about 15 fps after the pour
  const lite = document.documentElement.hasAttribute("data-lite");
  const maxDpr = lite ? 1 : Math.min(1.5, window.devicePixelRatio || 1);
  const gap = lite ? 62 : 44;
  let W = 0,
    H = 0,
    dpr = maxDpr;
  const size = () => {
    const b = cv.getBoundingClientRect();
    W = Math.round(b.width);
    H = Math.round(b.height);
    // soft ribbons: cap the backing store near 1.6M pixels (a tall canvas
    // otherwise costs ~40MB of GPU memory, and every frame refills all of it)
    dpr = Math.max(0.5, Math.min(maxDpr, Math.sqrt(1.6e6 / Math.max(1, W * H))));
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(cv);

  // 56 points per ribbon, joined by smooth curves (see band): as round as
  // 160 straight segments were, at about a third of the GPU's path work
  const N = 56;
  const path = (r: Live, now: number) => {
    const pts: [number, number][] = [];
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      let x: number, y: number;
      if (r.from && r.to && r.ctrl) {
        const q = 1 - u,
          bx = q * q * r.from[0] + 2 * q * u * r.ctrl[0] + u * u * r.to[0],
          by = q * q * r.from[1] + 2 * q * u * r.ctrl[1] + u * u * r.to[1];
        x = bx * W + Math.cos(u * Math.PI * 1.2 + now / (r.p2 || 9000)) * r.amp * W * 0.25 * u;
        y = by * H + Math.sin(u * Math.PI * 1.4 + now / (r.p1 || 7000)) * r.amp * H * u;
      } else {
        x = -80 + u * (W + 160);
        y =
          (r.y ?? 0.5) * H +
          Math.sin(u * Math.PI * 2 * (r.k1 || 1.1) + now / (r.p1 || 8000)) * r.amp * H +
          Math.sin(u * Math.PI * 2 * (r.k2 || 2.3) - now / (r.p2 || 11000)) * r.amp * 0.35 * H +
          (r.tilt || 0) * (u - 0.5) * H;
      }
      pts.push([x, y]);
    }
    return pts;
  };

  // the ribbons pour out of the door as the opening curtain lifts, not
  // unseen behind it (see GardenLoader); later mounts start at once
  let born = performance.now();
  const w = window as Window & { __gardenReady?: boolean };
  if (!w.__gardenReady) window.addEventListener("garden:ready", () => (born = performance.now() + 250), { once: true });
  const draw = (r: Live, now: number) => {
    const all = path(r, now);
    const grow = still ? 1 : Math.min(1, Math.max(0, (performance.now() - born - (r.delay || 0)) / 2200));
    const g = 1 - Math.pow(1 - grow, 3);
    const pts = all.slice(0, Math.max(2, Math.round(all.length * g))),
      n = pts.length,
      w = r.w * H;
    const nor = pts.map((_, i) => {
      const a = pts[Math.max(0, i - 1)],
        b = pts[Math.min(n - 1, i + 1)];
      const nx = -(b[1] - a[1]),
        ny = b[0] - a[0],
        l = Math.hypot(nx, ny) || 1;
      return [nx / l, ny / l];
    });
    const th = pts.map((_, i) => (i / (n - 1)) * Math.PI * r.twist + now / (r.speed || 11000));
    const taper = (i: number) => {
      const u = i / (n - 1);
      return r.from ? Math.min(1, u * 3) ** 0.6 * Math.min(1, (1 - u) * 6) ** 0.5 : Math.min(1, u * 6, (1 - u) * 6) ** 0.6;
    };
    const E = (i: number, s: number): [number, number] => {
      const c = (0.55 + 0.45 * Math.abs(Math.cos(th[i]))) * w * taper(i) * s;
      return [pts[i][0] + nor[i][0] * c, pts[i][1] + nor[i][1] * c];
    };
    // one edge through its points as a smooth curve: each point is a control
    // point and the curve passes through the midpoints between them
    const edge = (P: Path2D, q: [number, number][], first: boolean) => {
      if (first) P.moveTo(q[0][0], q[0][1]);
      else P.lineTo(q[0][0], q[0][1]);
      for (let i = 1; i < q.length - 1; i++) P.quadraticCurveTo(q[i][0], q[i][1], (q[i][0] + q[i + 1][0]) / 2, (q[i][1] + q[i + 1][1]) / 2);
      const z = q[q.length - 1];
      P.lineTo(z[0], z[1]);
    };
    const band = (a: number, b: number) => {
      const P = new Path2D();
      const top: [number, number][] = [],
        bot: [number, number][] = [];
      for (let i = 0; i < n; i++) top.push(E(i, a));
      for (let i = n - 1; i >= 0; i--) bot.push(E(i, b));
      edge(P, top, true);
      edge(P, bot, false);
      P.closePath();
      return P;
    };
    const A = r.alpha ?? 0.9;
    const gr = ctx.createLinearGradient(pts[0][0], pts[0][1], pts[n - 1][0], pts[n - 1][1]);
    const shift = (now / (r.drift || 7000)) % 1;
    for (let k = 0; k <= 6; k++) {
      const t = k / 6,
        c = colAt(r.cols, t * (r.span || 1) * 1.4 - shift * 2);
      gr.addColorStop(t, `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`);
    }
    ctx.globalAlpha = A;
    ctx.fillStyle = gr;
    ctx.fill(band(1, -1));
    ctx.globalAlpha = A * 0.16;
    ctx.fillStyle = "#3a2a8a";
    ctx.fill(band(-0.4, -1));
    ctx.globalAlpha = 1;
  };

  // full frame rate while the ribbons pour in, then about 22 fps: they drift
  // over 7 to 11 seconds, so the eye cannot tell, and the GPU fills far less.
  // Between drawn frames the loop waits on a timer, not on animation frames:
  // a frame requested only to be skipped still makes the browser run a whole
  // main-thread frame, restyling every CSS animation on the page with it.
  // While the page is being scrolled (ScrollFX sets html[data-scrolling]) the
  // ribbons hold still and their clock stops, so the scroll gets the whole
  // frame, and they carry on from the same place, with no jump, once it settles.
  const root = document.documentElement;
  let raf = 0,
    wake = 0,
    vis = false,
    last = 0,
    prev = 0,
    clock = performance.now();
  const frame = (now: number) => {
    raf = 0;
    const dt = prev ? Math.min(100, now - prev) : 0;
    prev = now;
    const intro = still || now - born <= 3200;
    if (!intro && (root.hasAttribute("data-scrolling") || now - last < gap)) {
      if (!root.hasAttribute("data-scrolling")) clock += dt;
      later(Math.max(8, gap - (now - last)));
      return;
    }
    clock += dt;
    last = now;
    ctx.clearRect(0, 0, W, H);
    live.forEach((r) => draw(r, clock + (r.offset || 0)));
    if (still) return;
    if (intro) {
      if (vis) raf = requestAnimationFrame(frame);
    } else later(gap);
  };
  // the next frame after `ms`, if the canvas is still on screen by then
  const later = (ms: number) => {
    if (!vis || wake) return;
    wake = window.setTimeout(() => {
      wake = 0;
      if (vis && !raf) raf = requestAnimationFrame(frame);
    }, ms);
  };
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis && !raf && !wake) raf = requestAnimationFrame(frame);
  });
  io.observe(cv);
  if (still) raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.clearTimeout(wake);
    io.disconnect();
    ro.disconnect();
  };
}
