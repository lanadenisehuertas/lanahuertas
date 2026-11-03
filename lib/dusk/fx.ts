import { textureUrl, type DitherFn } from "./dither";

/** Calm modes: reduced motion, or the lite flag set before paint in layout.tsx. */
export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const lite = () => typeof document !== "undefined" && document.documentElement.hasAttribute("data-lite");
export const calm = () => reducedMotion() || lite();

export const PALETTE = ["#fdf3e1", "#ffcfe0", "#a8e6dc", "#ffd98a", "#c9b8ff"];

/** Confetti shapes: dot, cross, squiggle, four-point star, curl. */
export const SHAPES = [
  (c: string) => `<svg width="10" height="10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="${c}"/></svg>`,
  (c: string) => `<svg width="14" height="14" aria-hidden="true"><path d="M2 2L12 12M12 2L2 12" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  (c: string) => `<svg width="34" height="14" aria-hidden="true"><path d="M2 9 Q 7 1 12 8 T 22 8 T 32 6" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  (c: string) => `<svg width="18" height="18" aria-hidden="true"><path d="M9 0L10.6 7.4L18 9L10.6 10.6L9 18L7.4 10.6L0 9L7.4 7.4Z" fill="${c}"/></svg>`,
  (c: string) => `<svg width="26" height="26" aria-hidden="true"><path d="M4 22 C 4 10 20 6 20 14 C 20 20 12 20 12 14" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
];

/** Confetti pieces flying out of a point with a little gravity. */
export function burst(box: HTMLElement, x0: number, y0: number, n: number, cols = PALETTE, kind: "mix" | "star" = "mix") {
  if (reducedMotion()) return;
  const parts = Array.from({ length: n }, (_, k) => {
    const e = document.createElement("div");
    e.className = "dk-burst";
    e.innerHTML = kind === "star" ? SHAPES[3](cols[k % cols.length]) : SHAPES[k % SHAPES.length](cols[k % cols.length]);
    box.appendChild(e);
    const a = Math.random() * Math.PI * 2,
      v = 160 + Math.random() * 260;
    return { e, x: x0, y: y0, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 180, r: Math.random() * 360, vr: (Math.random() - 0.5) * 600, l: 1 };
  });
  let t0 = performance.now();
  const step = (now: number) => {
    const dt = Math.min(0.04, (now - t0) / 1000);
    t0 = now;
    let alive = 0;
    for (const p of parts) {
      if (p.l <= 0) continue;
      p.l -= dt * 0.62;
      p.vy += 420 * dt;
      p.vx *= Math.pow(0.4, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.r += p.vr * dt;
      if (p.l <= 0) {
        p.e.remove();
        continue;
      }
      alive++;
      p.e.style.transform = `translate3d(${p.x}px,${p.y}px,0) rotate(${p.r}deg) scale(${0.6 + p.l * 0.6})`;
      p.e.style.opacity = String(Math.min(1, p.l * 2));
    }
    if (alive) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** A word or note that floats up out of a point and fades. */
export function floatText(box: HTMLElement, x: number, y: number, txt: string, color = "#fdf3e1") {
  const el = document.createElement("div");
  el.className = "dk-float";
  el.textContent = txt;
  el.style.color = color;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.setProperty("--dx", `${Math.random() * 30 - 15}px`);
  el.setAttribute("aria-hidden", "true");
  box.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

/** Point relative to a box. */
export const local = (box: HTMLElement, cx: number, cy: number) => {
  const r = box.getBoundingClientRect();
  return [cx - r.left, cy - r.top] as const;
};

const petalSvg = (c1: string, c2: string) =>
  `<svg width="22" height="30" viewBox="0 0 22 30" aria-hidden="true"><path d="M11 1 C 20 8 20 22 11 29 C 2 22 2 8 11 1Z" fill="${c1}"/><path d="M11 1 C 17 8 18 20 11 29 C 15 20 15 9 11 1Z" fill="${c2}"/><path d="M8 6 C 6 12 6 18 8 23" stroke="#fff6ee" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/></svg>`;
const PETALS = [
  ["#ffc4d9", "#ff8fb8"],
  ["#ffd9b8", "#ffa77a"],
  ["#e3d6ff", "#b39bff"],
  ["#fff1dc", "#ffcfa8"],
];

export type TexSpec = [DitherFn, unknown[], string, ("spark" | "twk" | "")?];

export type AmbientOpts = {
  /** confetti spots, [left%, top%] */
  confetti?: [number, number][];
  petals?: number;
  /** fireflies drifting up through the section (thinned to about two thirds, a third on phones) */
  motes?: number;
  /** shooting stars, on average every N ms (0 = none) */
  shooting?: number;
  textures?: TexSpec[];
  /** element the pointer leans (defaults to the host) */
  leanEl?: HTMLElement;
};

/**
 * The ambient life of one dusk section: confetti, print textures, falling
 * petals and shooting stars added into `host`, and the cursor lean (--mx/--my
 * eased on the host). Everything pauses while the host is off screen; in the
 * calm modes only the static pieces are placed.
 */
export function ambient(host: HTMLElement, o: AmbientOpts) {
  const made: Element[] = [];
  const add = (el: Element) => {
    host.appendChild(el);
    made.push(el);
  };
  (o.textures || []).forEach(([fn, args, css, k]) => {
    // A canvas, not an img: these are decoration, drawn late in idle time,
    // and as images they were counted as the page's main content, so the
    // largest-paint timing waited on them.
    const im = document.createElement("canvas");
    im.className = "dk-tex";
    im.setAttribute("aria-hidden", "true");
    if (k) im.dataset.k = k;
    im.style.cssText += css;
    // drawn in idle time and cached, then faded in (.dk-tex[data-in])
    void textureUrl(fn, args).then(async (url) => {
      const src = new Image();
      src.src = url;
      await src.decode().catch(() => {});
      im.width = src.naturalWidth || 1;
      im.height = src.naturalHeight || 1;
      im.getContext("2d")?.drawImage(src, 0, 0);
      im.dataset.in = "";
    });
    add(im);
  });
  (o.confetti || []).forEach(([x, y], i) => {
    const d = document.createElement("div");
    d.className = "dk-confetti";
    d.setAttribute("aria-hidden", "true");
    d.style.left = `${x}%`;
    d.style.top = `${y}%`;
    d.style.setProperty("--t", `${7 + (i % 5)}s`);
    d.style.setProperty("--tw", `${3 + (i % 4)}s`);
    d.style.setProperty("--x", `${((i % 3) - 1) * 10}px`);
    d.style.animationDelay = `${-i * 0.7}s`;
    d.innerHTML = SHAPES[i % SHAPES.length](PALETTE[i % PALETTE.length]);
    add(d);
  });
  if (calm()) return () => made.forEach((e) => e.remove());

  const phone = window.matchMedia("(max-width: 640px)").matches,
    lite = document.documentElement.hasAttribute("data-lite");
  const petals = lite ? 0 : Math.round((o.petals || 0) * (phone ? 0.4 : 0.7));
  for (let k = 0; k < petals; k++) {
    const e = document.createElement("div");
    e.className = "dk-petal";
    e.setAttribute("aria-hidden", "true");
    e.style.left = `${Math.random() * 90}%`;
    e.style.setProperty("--t", `${13 + Math.random() * 9}s`);
    e.style.setProperty("--dl", `${-Math.random() * 20}s`);
    e.style.setProperty("--fx", `${(Math.random() - 0.3) * 260}px`);
    e.style.setProperty("--f", `${2 + Math.random() * 1.6}s`);
    e.style.scale = String(0.7 + Math.random() * 0.5);
    e.innerHTML = petalSvg(PETALS[k % PETALS.length][0], PETALS[k % PETALS.length][1]);
    add(e);
  }

  for (let k = 0; k < Math.round((o.motes || 0) * (lite ? 0.25 : phone ? 0.35 : 0.65)); k++) {
    const e = document.createElement("i");
    e.className = "dk-mote";
    e.setAttribute("aria-hidden", "true");
    e.style.left = `${4 + Math.random() * 92}%`;
    e.style.top = `${55 + Math.random() * 45}%`;
    e.style.setProperty("--s", `${3 + Math.random() * 4}px`);
    e.style.setProperty("--t", `${16 + Math.random() * 14}s`);
    e.style.setProperty("--dl", `${-Math.random() * 30}s`);
    e.style.setProperty("--w1", `${(Math.random() - 0.5) * 120}px`);
    e.style.setProperty("--w2", `${(Math.random() - 0.5) * 160}px`);
    e.style.setProperty("--rise", `${260 + Math.random() * 420}px`);
    add(e);
  }

  let vis = false;
  const io = new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    if (vis) loop();
  });
  io.observe(host);

  let timer = 0;
  const shoot = () => {
    timer = window.setTimeout(shoot, (o.shooting || 5000) * (0.6 + Math.random() * 0.8));
    if (!vis || document.visibilityState !== "visible") return;
    const w = host.clientWidth,
      h = host.clientHeight,
      top = Math.random() * h * 0.35,
      // only where it can be seen: a star launched into the part of the host
      // that has scrolled away is never seen, and if the browser has stopped
      // rendering that part (content-visibility) it animates on the main thread
      at = host.getBoundingClientRect().top + top;
    if (at < 0 || at > window.innerHeight) return;
    const e = document.createElement("div");
    e.className = "dk-shoot";
    e.setAttribute("aria-hidden", "true");
    e.style.left = `${Math.random() * w * 0.6}px`;
    e.style.top = `${top}px`;
    e.style.setProperty("--a", `${18 + Math.random() * 20}deg`);
    e.style.setProperty("--dist", `${260 + Math.random() * 260}px`);
    host.appendChild(e);
    setTimeout(() => e.remove(), 1300);
  };
  if (o.shooting) timer = window.setTimeout(shoot, 1500 + Math.random() * 2000);

  // the cursor lean
  const leanEl = o.leanEl || host;
  let tx = 0,
    ty = 0,
    x = 0,
    y = 0,
    raf = 0,
    last = 0;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const b = leanEl.getBoundingClientRect();
    tx = ((e.clientX - b.left) / b.width) * 2 - 1;
    ty = ((e.clientY - b.top) / b.height) * 2 - 1;
    loop();
  };
  const onLeave = () => {
    tx = 0;
    ty = 0;
    loop();
  };
  const frame = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    x += (tx - x) * Math.min(1, dt * 4);
    y += (ty - y) * Math.min(1, dt * 4);
    host.style.setProperty("--mx", x.toFixed(3));
    host.style.setProperty("--my", y.toFixed(3));
    if (vis && (Math.abs(tx - x) > 0.002 || Math.abs(ty - y) > 0.002)) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  function loop() {
    if (!raf && vis) raf = requestAnimationFrame(frame);
  }
  leanEl.addEventListener("pointermove", onMove);
  leanEl.addEventListener("pointerleave", onLeave);

  return () => {
    io.disconnect();
    clearTimeout(timer);
    cancelAnimationFrame(raf);
    leanEl.removeEventListener("pointermove", onMove);
    leanEl.removeEventListener("pointerleave", onLeave);
    made.forEach((e) => e.remove());
  };
}

/** Run `fn` every `ms` while `el` is on screen and the tab is visible. */
export function whileVisible(el: HTMLElement, ms: number, fn: () => void) {
  let vis = false;
  const io = new IntersectionObserver(([e]) => (vis = e.isIntersecting));
  io.observe(el);
  const id = window.setInterval(() => vis && document.visibilityState === "visible" && fn(), ms);
  return () => {
    io.disconnect();
    clearInterval(id);
  };
}
