/**
 * The bass strings as a flowing music staff: four glowing cream lines, one
 * per string, on one cubic curve, with notes riding along them. Running the pointer across a
 * line plucks it — it ripples and `onPluck(string, event)` fires.
 */
type Pt = [number, number];
export type StaffOpts = {
  from: Pt;
  c1: Pt;
  c2: Pt;
  to: Pt;
  /** line spacing, fraction of height */
  gap: number;
  strings: number;
  hitEl?: HTMLElement;
  onPluck?: (i: number, e: PointerEvent) => void;
  still?: boolean;
};

export function staff(cv: HTMLCanvasElement, o: StaffOpts) {
  const ctx = cv.getContext("2d");
  if (!ctx) return () => {};
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  let W = 0,
    H = 0;
  const size = () => {
    const b = cv.getBoundingClientRect();
    W = Math.round(b.width);
    H = Math.round(b.height);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  size();
  const ro = new ResizeObserver(size);
  ro.observe(cv);

  const lines = Array.from({ length: o.strings }, (_, i) => ({ i, kick: -1e5, P: [] as Pt[] }));
  const bez = (t: number, now: number): Pt => {
    const q = 1 - t,
      b = (k: 0 | 1) => q * q * q * o.from[k] + 3 * q * q * t * o.c1[k] + 3 * q * t * t * o.c2[k] + t * t * t * o.to[k];
    return [b(0) * W, b(1) * H + Math.sin(t * Math.PI * 2 + now / 6000) * H * 0.012];
  };
  const riders = Array.from({ length: 9 }, (_, k) => ({ t: k / 9, line: k % o.strings, kind: k % 3 }));
  const note = (x: number, y: number, kind: number, a: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(a);
    ctx.fillStyle = ctx.strokeStyle = "#fdf3e1";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(255,200,230,.9)";
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4.4, -0.4, 0, 7);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(5.2, -1.5);
    ctx.lineTo(5.2, -24);
    ctx.stroke();
    if (kind) {
      ctx.beginPath();
      ctx.moveTo(5.2, -24);
      ctx.quadraticCurveTo(14, -18, 12, -10);
      ctx.stroke();
    }
    if (kind === 2) {
      ctx.beginPath();
      ctx.moveTo(5.2, -18);
      ctx.quadraticCurveTo(14, -12, 12, -4);
      ctx.stroke();
    }
    ctx.restore();
  };

  const N = 120,
    born = performance.now();
  // full frame rate while it draws in or a string is ringing
  let raf = 0,
    vis = false,
    lastDraw = 0;
  const frame = (now: number) => {
    raf = 0;
    // ~30 fps once drawn in, and held still while the page scrolls (ScrollFX
    // sets html[data-scrolling]), unless a string is still ringing
    const busy = now - lastDraw < 28 || document.documentElement.hasAttribute("data-scrolling");
    if (!o.still && now - born > 2800 && busy && lines.every((ln) => now - ln.kick > 1500)) {
      if (vis) raf = requestAnimationFrame(frame);
      return;
    }
    // the notes ride at the same speed whatever the frame rate
    const step = lastDraw ? Math.min(4, (now - lastDraw) / 16.7) : 1;
    lastDraw = now;
    ctx.clearRect(0, 0, W, H);
    const grow = o.still ? 1 : Math.min(1, (now - born) / 2600),
      g = 1 - Math.pow(1 - grow, 3),
      gap = o.gap * H;
    const pts: Pt[] = [],
      nor: Pt[] = [];
    for (let i = 0; i <= N; i++) pts.push(bez(i / N, now));
    for (let i = 0; i <= N; i++) {
      const a = pts[Math.max(0, i - 1)],
        b = pts[Math.min(N, i + 1)],
        nx = -(b[1] - a[1]),
        ny = b[0] - a[0],
        l = Math.hypot(nx, ny) || 1;
      nor.push([nx / l, ny / l]);
    }
    const m = Math.round(N * g);
    ctx.lineCap = "round";
    lines.forEach((ln) => {
      const age = (now - ln.kick) / 1000,
        kick = age < 3 ? Math.exp(-age * 2.4) * Math.sin(age * 34) * 9 : 0,
        off = (ln.i - (o.strings - 1) / 2) * gap;
      const P: Pt[] = [];
      for (let i = 0; i <= m; i++) {
        const r = off + Math.sin((i / N) * Math.PI) * kick;
        P.push([pts[i][0] + nor[i][0] * r, pts[i][1] + nor[i][1] * r]);
      }
      ln.P = P;
      const stroke = (style: string, w: number) => {
        ctx.strokeStyle = style;
        ctx.lineWidth = w;
        ctx.beginPath();
        P.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.stroke();
      };
      stroke("rgba(255,190,225,.25)", 6);
      stroke("rgba(253,243,225,.92)", 1.6);
    });
    riders.forEach((r) => {
      if (!o.still) r.t = (r.t + 0.00045 * step) % 1;
      if (r.t > g) return;
      const i = Math.round(r.t * N),
        ln = lines[r.line],
        p = ln.P[Math.min(i, ln.P.length - 1)];
      if (!p) return;
      note(p[0], p[1], r.kind, Math.atan2(nor[i][0], -nor[i][1]) * 0.3);
    });
    if (vis && !o.still) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis && !raf) raf = requestAnimationFrame(frame);
  });
  io.observe(cv);

  let last = 0;
  const onMove = (e: PointerEvent) => {
    const b = cv.getBoundingClientRect(),
      x = e.clientX - b.left,
      y = e.clientY - b.top,
      now = performance.now();
    lines.forEach((ln) => {
      if (!ln.P.length || now - ln.kick < 500 || now - last < 90) return;
      let best = 1e9;
      for (const p of ln.P) best = Math.min(best, Math.hypot(p[0] - x, p[1] - y));
      if (best < 8) {
        last = now;
        ln.kick = now;
        o.onPluck?.(ln.i, e);
        if (!raf) raf = requestAnimationFrame(frame);
      }
    });
  };
  o.hitEl?.addEventListener("pointermove", onMove);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    ro.disconnect();
    o.hitEl?.removeEventListener("pointermove", onMove);
  };
}
