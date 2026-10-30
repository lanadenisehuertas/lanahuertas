"use client";

import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from "react";

/*
 * Wing art: a symmetric top view, 480 x 470. Each side shows one half of the
 * image (left half on the left wing, right half on the right). The forewing
 * layer is the top half and the hindwing layer the bottom half (they meet at
 * ~50% of the height), so the hindwings can lag a beat behind. The body and
 * antennae are a still strip cut from the centre of BODY_ART. Separate
 * constants so fore, hind and body can each get their own file later.
 */
export const FORE_WING_ART = "/art/butterfly-wings.webp";
export const HIND_WING_ART = "/art/butterfly-wings.webp";
export const BODY_ART = "/art/butterfly-wings.webp";

/** Sections the butterfly flies to on click, in page order. Missing ids are skipped. */
const SECTION_ORDER = ["top", "branding", "posters", "videos", "code", "about", "contact"];

const W = 88; // butterfly box, px (the art is 480 x 470)
const H = 86;
const NAV_H = 72; // fixed nav height plus a little air: the butterfly stays below it
const EDGE = 14; // viewport margin
const READING = 0.35; // reading line, as a fraction of the viewport height
const SETTLE_MS = 350; // scrolling stopped this long: land on a perch
const SLEEP_MS = 3000; // landed and idle this long: hand the wings to CSS and stop the loop
const SPARK_CAP = 36;
const REST_HZ = 0.6;
const HIND_LAG_S = 0.06; // hind wings trail the fore wings by this much

/* ---- whether to run at all: fine pointer, wide screen, motion allowed ---- */

const MQ_COARSE = "(pointer: coarse)";
const MQ_REDUCE = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mqs = [MQ_COARSE, MQ_REDUCE].map((q) => window.matchMedia(q));
  mqs.forEach((m) => m.addEventListener("change", cb));
  window.addEventListener("resize", cb);
  return () => {
    mqs.forEach((m) => m.removeEventListener("change", cb));
    window.removeEventListener("resize", cb);
  };
}
const getSnapshot = () =>
  window.innerWidth >= 768 && !window.matchMedia(MQ_COARSE).matches && !window.matchMedia(MQ_REDUCE).matches;
const getServerSnapshot = () => false;

/**
 * The garden's guide: a CSS-3D butterfly that flies beside what you are
 * reading. Its path runs through the `[data-perch]` titles in page order,
 * bowing out into the nearer margin between them, and its position on that
 * path is set by the scroll position alone, so it never wanders. When
 * scrolling stops it lands on the nearest visible title.
 *
 * Off for touch-first devices, narrow screens and reduced motion.
 */
export default function Butterfly() {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return enabled ? <ButterflyStage /> : null;
}

type Perch = {
  el: Element;
  /** Butterfly box top-left when landed, page coordinates. */
  x: number;
  y: number;
  /** Page y of the title's text top: the path is keyed on this. */
  key: number;
  /** Element top and bottom, page coordinates. */
  top: number;
  bottom: number;
};

type Spark = {
  el: HTMLSpanElement;
  kind: string;
  live: boolean;
  x: number; // page coordinates
  y: number;
  vx: number;
  vy: number;
  life: number;
  rot: number;
  spin: number;
  star: boolean;
};

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const smooth = (u: number) => u * u * (3 - 2 * u);

function ButterflyStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tiltRef = useRef<HTMLSpanElement>(null);
  const foreLRef = useRef<HTMLSpanElement>(null);
  const hindLRef = useRef<HTMLSpanElement>(null);
  const foreRRef = useRef<HTMLSpanElement>(null);
  const hindRRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const layer = sparksRef.current;
    const btn = btnRef.current;
    const tilt = tiltRef.current;
    const foreL = foreLRef.current;
    const hindL = hindLRef.current;
    const foreR = foreRRef.current;
    const hindR = hindRRef.current;
    const label = labelRef.current;
    if (!root || !layer || !btn || !tilt || !foreL || !hindL || !foreR || !hindR || !label) return;

    const lite = document.documentElement.hasAttribute("data-lite");

    /* ---------------- perches: measured in one batch, off the frame ---------------- */

    let perches: Perch[] = [];
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let docH = document.documentElement.scrollHeight;
    const range = document.createRange();

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      docH = document.documentElement.scrollHeight;
      const sy = window.scrollY;
      const list: Perch[] = [];
      document.querySelectorAll<HTMLElement>("[data-perch]").forEach((el) => {
        if (el.closest("[inert]")) return;
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        // On screen horizontally: inactive carousel slides sit left or right of it.
        if (r.left < -2 || r.left > vw - 24 || r.right < 24) return;

        // The real end of the text: the right edge of its last line.
        const lines: DOMRect[] = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let n = 0;
        for (let t = walker.nextNode(); t && n < 40; t = walker.nextNode(), n++) {
          if (!t.nodeValue || !t.nodeValue.trim()) continue;
          range.selectNodeContents(t);
          for (const rr of range.getClientRects()) if (rr.width > 0 && rr.height > 0) lines.push(rr);
        }
        let endX = r.right;
        let lastTop = r.top;
        let top = r.top;
        if (lines.length) {
          let maxBottom = -Infinity;
          for (const l of lines) maxBottom = Math.max(maxBottom, l.bottom);
          endX = -Infinity;
          for (const l of lines)
            if (l.bottom > maxBottom - l.height * 0.5 && l.right > endX) {
              endX = l.right;
              lastTop = l.top;
            }
          top = Infinity;
          for (const l of lines) if (l.right > endX - W && l.left < endX + W) top = Math.min(top, l.top);
        }
        if (endX > vw + 4) return; // runs off the right edge: not really on screen
        // Rest just past the end of the last line, beside the letters, never on
        // them. With no room on the right, sit above the line's end instead.
        const beside = endX + 8 + W <= vw - EDGE;
        list.push({
          el,
          x: beside ? endX + 8 : clamp(endX - W, EDGE, vw - W - EDGE),
          // Seen from above at ~62deg the art fills the middle ~half of the box.
          y: (beside ? lastTop - H * 0.32 : top - H * 0.78) + sy,
          key: top + sy,
          top: r.top + sy,
          bottom: r.bottom + sy,
        });
      });
      list.sort((a, b) => a.key - b.key);
      perches = list;
      if (settleOn) settleOn = perches.find((p) => p.el === settleOn!.el) ?? null;
    };

    /* ---------------- the path through the perches ---------------- */

    const home = () => ({ x: vw - W - 48, y: NAV_H + 36 });

    /** Point on the cubic arc from a to b that bows out to the nearer page margin. */
    const arc = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => {
      const dy = b.y - a.y;
      const mid = (a.x + b.x) / 2 + W / 2;
      const mx = mid < vw / 2 ? EDGE + 6 : vw - W - EDGE - 6;
      const bow = clamp(Math.abs(dy) / (vh * 0.6), 0, 1); // short hops barely bow
      const c1x = a.x + (mx - a.x) * bow;
      const c2x = b.x + (mx - b.x) * bow;
      const u = 1 - t;
      const k0 = u * u * u;
      const k1 = 3 * u * u * t;
      const k2 = 3 * u * t * t;
      const k3 = t * t * t;
      return {
        x: k0 * a.x + k1 * c1x + k2 * c2x + k3 * b.x,
        y: k0 * a.y + k1 * (a.y + dy * 0.25) + k2 * (a.y + dy * 0.75) + k3 * b.y,
      };
    };

    /** Where the reading line puts the butterfly, viewport coordinates. */
    const pathTarget = (sy: number) => {
      if (!perches.length) return home();
      const hm = home();
      const pts: { x: number; y: number; key: number }[] = perches.slice();
      // No title on the first screen: start from the top-right corner.
      if (pts[0].key > vh * 0.9) pts.unshift({ x: hm.x, y: hm.y, key: vh * READING });
      // Last title well above the bottom: end at the corner again.
      const endKey = docH - vh * (1 - READING);
      if (endKey - pts[pts.length - 1].key > vh * 0.6)
        pts.push({ x: hm.x, y: docH - vh + hm.y, key: endKey });
      const R = sy + vh * READING;
      let p: { x: number; y: number };
      if (R <= pts[0].key) p = pts[0];
      else if (R >= pts[pts.length - 1].key) p = pts[pts.length - 1];
      else {
        let i = 0;
        while (i < pts.length - 2 && pts[i + 1].key <= R) i++;
        const a = pts[i];
        const b = pts[i + 1];
        const u = (R - a.key) / Math.max(1, b.key - a.key);
        // Part smoothstep: lingers a little at each title, never races.
        p = arc(a, b, u + (smooth(u) - u) * 0.65);
      }
      return { x: p.x, y: p.y - sy };
    };

    /** Nearest perch whose title is wholly on screen, below the nav. */
    const nearestVisible = (sy: number, fx: number, fy: number) => {
      let best: Perch | null = null;
      let bd = Infinity;
      for (const p of perches) {
        const top = p.top - sy;
        const bottom = p.bottom - sy;
        if (top < NAV_H || bottom > vh - 16 || p.y - sy < NAV_H - 8) continue;
        const d = Math.hypot(p.x - fx, p.y - sy - fy);
        if (d < bd) {
          bd = d;
          best = p;
        }
      }
      return best;
    };

    /* ---------------- sparkles: a fixed pool of nodes ---------------- */

    const sparks: Spark[] = [];
    if (!lite) {
      for (let i = 0; i < SPARK_CAP; i++) {
        const el = document.createElement("span");
        el.className = "bf-spark";
        el.style.opacity = "0";
        layer.appendChild(el);
        sparks.push({ el, kind: "", live: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, rot: 0, spin: 0, star: false });
      }
    }
    let alive = 0;

    const spark = (kind: "star" | "dot", px: number, py: number, vx0: number, vy0: number, life: number) => {
      const s = sparks.find((q) => !q.live);
      if (!s) return;
      const cls = kind === "star" ? (Math.random() < 0.5 ? "bf-spark star pink" : "bf-spark star") : "bf-spark dot";
      if (s.kind !== cls) {
        s.el.className = cls;
        s.kind = cls;
      }
      s.live = true;
      s.star = kind === "star";
      s.x = px;
      s.y = py + window.scrollY;
      s.vx = vx0;
      s.vy = vy0;
      s.life = life;
      s.rot = Math.random() * 90;
      s.spin = (Math.random() - 0.5) * 180;
      alive++;
    };

    const burst = (n: number) => {
      const cx = x + W / 2;
      const cy = y + H / 2;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const sp = 90 + Math.random() * 70;
        spark("star", cx, cy, Math.cos(a) * sp, Math.sin(a) * sp, 1.2);
      }
    };

    /* ---------------- state ---------------- */

    let x = 0;
    let y = 0;
    let vx = 0;
    let vy = 0;
    let started = false;
    let phase = 0;
    let ampS = 30;
    let baseS = 20;
    let flight = 1; // 0 resting .. 1 flying, smoothed
    let pitchS = 48;
    let lastSy = window.scrollY;
    let lastScrollAt = performance.now() - SETTLE_MS; // start settled
    let settleOn: Perch | null = null;
    let landedAt = 0; // 0 = not landed
    let lift = 0; // take-off kick, decays
    let awayUntil = 0;
    let act: { t0: number; x: number; y: number } | null = null;
    let dart: { until: number; dx: number; dy: number } | null = null;
    let hover = false;
    let focused = false;
    let sparkT = 0;

    // pointer, for darting from a fast-approaching cursor
    let mx = -9999;
    let my = -9999;
    let pvx = 0;
    let pvy = 0;
    let pT = 0;

    /* ---------------- the loop ---------------- */

    let raf = 0;
    let last = performance.now();
    let sleeping = false;
    let sleptAt = 0;

    const wake = () => {
      if (sleeping) {
        sleeping = false;
        root.classList.remove("is-resting");
        phase += ((performance.now() - sleptAt) / 1000) * REST_HZ * Math.PI * 2;
        landedAt = performance.now();
      }
      if (!raf && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const sleep = (now: number) => {
      sleeping = true;
      sleptAt = now;
      // Hand the slow open/close to CSS, starting where the loop left off.
      const cyc = (((phase + Math.PI / 2) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      const period = 1 / REST_HZ;
      const delay = -(cyc / (Math.PI * 2)) * period;
      root.style.setProperty("--bf-rest-delay", `${delay.toFixed(3)}s`);
      root.style.setProperty("--bf-rest-delay-hind", `${(delay + HIND_LAG_S).toFixed(3)}s`);
      root.classList.add("is-resting");
    };

    const showLabel = (on: boolean) => {
      label.classList.toggle("on", on);
      if (on) placeLabel();
    };
    let labelW = 0;
    const placeLabel = () => {
      if (!labelW) labelW = label.offsetWidth || 200;
      const lx = x + W * 0.85 + labelW > vw - EDGE ? x - labelW - 6 : x + W * 0.85;
      label.style.transform = `translate3d(${lx.toFixed(1)}px,${(y - 4).toFixed(1)}px,0)`;
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const sy = window.scrollY;
      if (sy !== lastSy) {
        lastSy = sy;
        lastScrollAt = now;
      }
      const idle = now - lastScrollAt;
      const away = now < awayUntil;

      if (act && now - act.t0 > 1000) act = null;

      /* where it wants to be */
      let tx: number;
      let ty: number;
      let landing = false;
      if (away) {
        tx = vw + 160;
        ty = -200;
      } else if (act) {
        tx = act.x;
        ty = act.y;
      } else if (idle > SETTLE_MS && lift < 0.05) {
        if (!settleOn) settleOn = nearestVisible(sy, x, y);
        if (settleOn) {
          tx = settleOn.x;
          ty = settleOn.y - sy;
        } else if (!perches.length) {
          ({ x: tx, y: ty } = home());
        } else {
          ({ x: tx, y: ty } = pathTarget(sy));
        }
        landing = true;
      } else {
        settleOn = null;
        ({ x: tx, y: ty } = pathTarget(sy));
      }

      // Dart aside, only from a cursor coming at it fast.
      if (dart && now > dart.until) dart = null;
      if (dart && !away) {
        tx += dart.dx;
        ty += dart.dy;
        landing = false;
      }
      if (lift > 0) {
        ty -= 170 * lift;
        lift = Math.max(0, lift - dt * 1.2);
      }
      if (!away) {
        tx = clamp(tx, EDGE, vw - W - EDGE);
        ty = clamp(ty, NAV_H, vh - H - EDGE);
      }

      if (!started) {
        x = tx;
        y = ty;
        started = true;
      }

      /* critically damped spring: no overshoot */
      // Landing is stiffer so it arrives quickly and stops dead, still with no overshoot.
      const w = away ? 3.2 : landing ? 10 : 6;
      const ex = x - tx;
      const ey = y - ty;
      const e = Math.exp(-w * dt);
      const kx = (vx + w * ex) * dt;
      const ky = (vy + w * ey) * dt;
      x = tx + (ex + kx) * e;
      y = ty + (ey + ky) * e;
      vx = (vx - w * kx) * e;
      vy = (vy - w * ky) * e;

      const speed = Math.hypot(vx, vy);
      const gap = Math.hypot(tx - x, ty - y);
      const resting = landing && !act && gap < 3 && speed < 20;
      if (resting && !landedAt) landedAt = now;
      if (!resting) landedAt = 0;

      /* wings: a few soft beats, then a glide; slow open/close at rest */
      let freq: number;
      let amp: number;
      let base: number;
      if (act) {
        freq = 3.2;
        amp = 60;
        base = 8;
      } else if (resting) {
        freq = REST_HZ;
        amp = 55;
        base = 10;
      } else {
        freq = 2.1;
        const glide = 0.5 + 0.5 * Math.sin(now / 1400);
        amp = 8 + 32 * glide * glide;
        base = 30 - amp / 3;
      }
      // Fold into the resting pose quickly once landed.
      const ease = 1 - Math.exp(-dt * (landing ? 10 : 4));
      ampS += (amp - ampS) * ease;
      baseS += (base - baseS) * ease;
      flight += ((resting ? 0 : 1) - flight) * ease;
      phase += dt * freq * Math.PI * 2;
      const openF = (0.5 + 0.5 * Math.sin(phase)) * ampS + baseS;
      foreL.style.transform = `rotateY(${openF.toFixed(2)}deg)`;
      foreR.style.transform = `rotateY(${(-openF).toFixed(2)}deg)`;
      if (!lite) {
        const openH = (0.5 + 0.5 * Math.sin(phase - HIND_LAG_S * freq * Math.PI * 2)) * ampS + baseS;
        hindL.style.transform = `rotateY(${openH.toFixed(2)}deg)`;
        hindR.style.transform = `rotateY(${(-openH).toFixed(2)}deg)`;
      }

      /* body: 3/4 view from above; bank and heading follow horizontal speed */
      const bank = clamp(vx * 0.05, -30, 30);
      const heading = clamp(vx * 0.04, -24, 24);
      pitchS += (62 - 14 * flight - clamp(vy * 0.03, -12, 12) * flight - pitchS) * ease;
      let pitch = pitchS;
      let ly = 0;
      if (act) {
        const k = Math.min(1, (now - act.t0) / 900);
        pitch += 360 * (1 - Math.pow(1 - k, 3));
        ly = -Math.sin(k * Math.PI) * 50;
      }
      const z = 40 * Math.sin(now / 1700) * flight;
      const bob = Math.sin(phase) * 3 * flight;
      btn.style.transform = `translate3d(${x.toFixed(1)}px,${(y + bob + ly).toFixed(1)}px,0)`;
      tilt.style.transform = `translateZ(${z.toFixed(1)}px) rotateZ(${heading.toFixed(2)}deg) rotateX(${pitch.toFixed(2)}deg) rotateY(${bank.toFixed(2)}deg)`;
      if (hover || focused) placeLabel();

      /* trail: sparkles only, left in the page where it flew */
      if (!lite) {
        sparkT += dt;
        if (!resting && !away && speed > 25 && sparkT > 0.07) {
          sparkT = 0;
          const cx = x + W / 2;
          const cy = y + H * 0.55;
          spark(
            Math.random() < 0.55 ? "star" : "dot",
            cx + (Math.random() - 0.5) * 34,
            cy + (Math.random() - 0.5) * 16,
            (Math.random() - 0.5) * 10,
            10,
            1
          );
        }
        if (alive) {
          const fa = Math.pow(0.15, dt);
          for (const s of sparks) {
            if (!s.live) continue;
            s.life -= dt * 0.4;
            if (s.life <= 0) {
              s.live = false;
              alive--;
              s.el.style.opacity = "0";
              continue;
            }
            s.vx *= fa;
            s.vy = s.vy * fa + 12 * dt;
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.rot += s.spin * dt;
            const tw = s.star ? 0.75 + 0.25 * Math.sin(now / 90 + s.rot) : 1;
            const sc = (0.35 + Math.min(1, s.life) * 0.75) * tw;
            s.el.style.transform = `translate3d(${s.x.toFixed(1)}px,${(s.y - sy).toFixed(1)}px,0) rotate(${s.rot.toFixed(1)}deg) scale(${sc.toFixed(3)})`;
            s.el.style.opacity = Math.min(1, s.life).toFixed(3);
          }
        }
      }

      // Landed and nothing going on: stop the loop and let CSS breathe the wings.
      if (resting && !hover && !focused && !alive && !dart && now - landedAt > SLEEP_MS) {
        sleep(now);
        return;
      }
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };

    /* ---------------- events ---------------- */

    let measureTimer = 0;
    const markDirty = () => {
      if (measureTimer) return;
      measureTimer = window.setTimeout(() => {
        measureTimer = 0;
        measure();
        wake();
      }, 120);
    };

    const onScroll = (e: Event) => {
      if (e.target === document || e.target === document.documentElement) {
        lastScrollAt = performance.now();
        settleOn = null;
        wake();
      } else {
        markDirty(); // a carousel moved: its active title may have changed
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const t = e.timeStamp;
      const ddt = Math.max(8, t - pT) / 1000;
      const nvx = (e.clientX - mx) / ddt;
      const nvy = (e.clientY - my) / ddt;
      if (pT && t - pT < 100) {
        pvx = pvx * 0.6 + nvx * 0.4;
        pvy = pvy * 0.6 + nvy * 0.4;
      } else {
        pvx = pvy = 0;
      }
      pT = t;
      mx = e.clientX;
      my = e.clientY;
      if (act || hover || now() < awayUntil) return;
      const dx = x + W / 2 - mx;
      const dy = y + H / 2 - my;
      const d = Math.hypot(dx, dy) || 1;
      const sp = Math.hypot(pvx, pvy);
      // Fast, close and heading for it.
      if (d < 170 && sp > 1400 && (pvx * dx + pvy * dy) / (sp * d) > 0.5) {
        dart = { until: now() + 650, dx: (dx / d) * 140, dy: (dy / d) * 90 };
        wake();
      }
    };
    const now = () => performance.now();

    const fly = () => {
      act = null;
      showLabel(false);
      if (now() < awayUntil) return;
      const els = SECTION_ORDER.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
      if (!els.length) return;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const atEnd = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2;
      const next = atEnd
        ? undefined
        : els.find((el) => {
            const m = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
            return el.getBoundingClientRect().top > Math.max(NAV_H, pad + m) + 24;
          });
      lift = 1;
      vy -= 300;
      settleOn = null;
      lastScrollAt = now();
      if (next && next !== els[0]) next.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
      wake();
    };

    const onEnter = () => {
      hover = true;
      wake();
      if (!act && now() >= awayUntil) {
        act = { t0: now(), x, y };
        burst(18);
      }
      showLabel(true);
    };
    let leaveTimer = 0;
    const onLeave = () => {
      window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(() => {
        hover = false;
        if (!focused) showLabel(false);
      }, 180);
    };
    const onLabelEnter = () => {
      window.clearTimeout(leaveTimer);
      hover = true;
    };
    const onFocus = () => {
      if (!btn.matches(":focus-visible")) return;
      focused = true;
      wake();
      showLabel(true);
    };
    const onBlur = () => {
      focused = false;
      if (!hover) showLabel(false);
    };

    const onSend = () => {
      act = null;
      showLabel(false);
      wake();
      burst(26);
      awayUntil = now() + 4000;
      vx += 260;
      vy -= 420;
      settleOn = null;
      lastScrollAt = now() - SETTLE_MS; // come back to the nearest perch
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else if (!sleeping) wake();
    };

    const onResize = () => {
      labelW = 0;
      markDirty();
    };

    // Re-measure while idle (cheap), and wake if the perch it sits on moved.
    const interval = window.setInterval(() => {
      if (document.hidden) return;
      const before = settleOn ? { x: settleOn.x, y: settleOn.y, el: settleOn.el } : null;
      measure();
      if (sleeping && (!settleOn || !before || Math.abs(settleOn.x - before.x) > 2 || Math.abs(settleOn.y - before.y) > 2)) wake();
    }, 500);

    const ro = new ResizeObserver(markDirty);
    ro.observe(document.body);
    const mo = new MutationObserver(markDirty);
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["data-active", "inert", "data-perch"] });

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("perch:change", markDirty);
    window.addEventListener("butterfly:send", onSend);
    document.addEventListener("visibilitychange", onVisibility);
    btn.addEventListener("click", fly);
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("focus", onFocus);
    btn.addEventListener("blur", onBlur);
    label.addEventListener("pointerenter", onLabelEnter);
    label.addEventListener("pointerleave", onLeave);
    label.addEventListener("click", fly);

    measure();
    wake();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.clearInterval(interval);
      window.clearTimeout(measureTimer);
      window.clearTimeout(leaveTimer);
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("perch:change", markDirty);
      window.removeEventListener("butterfly:send", onSend);
      document.removeEventListener("visibilitychange", onVisibility);
      btn.removeEventListener("click", fly);
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("focus", onFocus);
      btn.removeEventListener("blur", onBlur);
      label.removeEventListener("pointerenter", onLabelEnter);
      label.removeEventListener("pointerleave", onLeave);
      label.removeEventListener("click", fly);
      sparks.forEach((s) => s.el.remove());
    };
  }, []);

  const art = {
    "--bf-fore": `url(${FORE_WING_ART})`,
    "--bf-hind": `url(${HIND_WING_ART})`,
    "--bf-body": `url(${BODY_ART})`,
    "--bf-w": `${W}px`,
    "--bf-h": `${H}px`,
  } as CSSProperties;

  return (
    <div ref={rootRef} className="bf-stage" style={art}>
      <div ref={sparksRef} className="bf-sparks" aria-hidden="true" />
      <button ref={btnRef} type="button" className="bf-fly" aria-label="Fly to the next section">
        <span className="bf-persp" aria-hidden="true">
          <span ref={tiltRef} className="bf-tilt">
            <span className="bf-side bf-l">
              <span ref={hindLRef} className="bf-wing bf-hind" />
              <span ref={foreLRef} className="bf-wing bf-fore" />
            </span>
            <span className="bf-side bf-r">
              <span ref={hindRRef} className="bf-wing bf-hind" />
              <span ref={foreRRef} className="bf-wing bf-fore" />
            </span>
            <span className="bf-body" />
          </span>
        </span>
      </button>
      <span ref={labelRef} className="bf-label" aria-hidden="true">
        hi! click me to fly ahead
      </span>
    </div>
  );
}
