"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Lotus } from "./Botanicals";

const SECTIONS = ["branding", "posters", "videos", "code", "about", "contact"];

type Leaf = { x: number; y: number; side: 1 | -1; len: number; tilt: number };
type Bloom = { x: number; y: number; deep: boolean };
type Geo = { w: number; h: number; s: number; d: string; curls: string[]; leaves: Leaf[]; blooms: Bloom[]; cx: number; amp: number };

/** The stem's centre line: a slow S with a longer second wave so it never looks machined. */
const stemX = (y: number, cx: number, amp: number) =>
  cx + amp * Math.sin((y / 560) * Math.PI * 2) + amp * 0.35 * Math.sin((y / 1430) * Math.PI * 2 + 1.2);

/**
 * A fat vine down the left margin of the homepage that grows as you read.
 *
 * Desktop only (≥1280px, fine pointer): on smaller screens the margin is the
 * content. The vine lives in the document (absolute, full page height), so it
 * scrolls with the page for free; only its growing tip moves.
 *
 * Growth is a compositor-only reveal: a window box with overflow hidden is
 * slid down by `--tip` while the stem inside is slid back up by the same
 * amount, so the painted stem never repaints. Leaves unfurl (a CSS transition)
 * and lotuses bloom by a class flip when the tip passes them. Per scroll frame
 * the only writes are two custom properties on the vine root plus class flips
 * that actually change.
 *
 * It stays inside the gutter left of the copy (spread copy starts at 3.4% of
 * the width, ~49px at 1440), so its width tracks that gutter.
 */
export default function ScrollVine() {
  const root = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);

  // Geometry: measured once and on resize (lazy images change the page height).
  useEffect(() => {
    const desk = window.matchMedia("(min-width: 1280px) and (hover: hover) and (pointer: fine)");
    let raf = 0;
    let last = "";
    const measure = () => {
      raf = 0;
      if (!desk.matches) {
        setGeo(null);
        last = "";
        return;
      }
      const vw = window.innerWidth;
      const h = document.body.offsetHeight;
      const key = `${vw}x${h}`;
      if (key === last) return;
      last = key;
      // The gutter left of the spread copy, less a little air.
      const gutter = Math.max(44, vw * 0.034 - 4);
      const s = Math.min(1.9, Math.max(0.95, gutter / 46));
      const cx = 19 * s;
      const amp = 4 * s;
      const w = Math.ceil(gutter + 8);

      const y0 = 56;
      let d = `M${stemX(y0, cx, amp).toFixed(1)} ${y0}`;
      for (let y = y0 + 12; y <= h; y += 12) d += `L${stemX(y, cx, amp).toFixed(1)} ${y}`;

      const blooms: Bloom[] = [];
      SECTIONS.forEach((id, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const y = Math.round(el.getBoundingClientRect().top + window.scrollY + 118);
        blooms.push({ x: stemX(y, cx, amp), y, deep: i % 2 === 1 });
      });

      const leaves: Leaf[] = [];
      const curls: string[] = [];
      let side: 1 | -1 = 1;
      let n = 0;
      for (let y = 170; y < h - 40; y += 104 + ((n * 37) % 40)) {
        n++;
        if (blooms.some((b) => y > b.y - 90 && y < b.y + 40)) continue;
        const x = stemX(y, cx, amp);
        // Right-hand leaves stand steep so they stay clear of the copy; left-hand
        // ones lean out over the screen edge, which reads as a bigger plant.
        leaves.push(
          side === 1
            ? { x, y, side, len: (38 + ((n * 13) % 9)) * s, tilt: 62 + ((n * 17) % 10) }
            : { x, y, side, len: (48 + ((n * 13) % 12)) * s, tilt: 34 + ((n * 17) % 18) }
        );
        // Every third leaf, a tendril curls out the other side.
        if (n % 3 === 0) {
          const dir = -side;
          const cy = y + 26;
          const sx = stemX(cy, cx, amp) + dir * 6 * s;
          let c = `M${sx.toFixed(1)} ${cy}`;
          for (let t = 0; t <= Math.PI * 3.2; t += 0.3) {
            const r = 9 * s * (1 - t / (Math.PI * 3.6));
            c += `L${(sx + dir * (9 * s - r * Math.cos(t))).toFixed(1)} ${(cy - r * Math.sin(t) - t * 1.4).toFixed(1)}`;
          }
          curls.push(c);
        }
        side = side === 1 ? -1 : 1;
      }
      setGeo({ w, h, s, d, curls, leaves, blooms, cx, amp });
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    const ro = new ResizeObserver(ask);
    ro.observe(document.body);
    desk.addEventListener("change", ask);
    return () => {
      ro.disconnect();
      desk.removeEventListener("change", ask);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Growth: the tip follows the reader. Writes --tip/--tx on the vine only.
  useEffect(() => {
    const el = root.current;
    if (!geo || !el) return;
    const leaves = Array.from(el.querySelectorAll<HTMLElement>(".av-leaf"));
    const blooms = Array.from(el.querySelectorAll<HTMLElement>(".av-bloom"));
    const all = [...leaves, ...blooms].map((node) => ({ node, y: Number(node.dataset.y), open: false, near: false }));
    const still =
      document.documentElement.hasAttribute("data-lite") || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (tip: number, mid: number, span: number) => {
      el.style.setProperty("--tip", tip.toFixed(1));
      el.style.setProperty("--tx", stemX(tip, geo.cx, geo.amp).toFixed(1));
      for (const it of all) {
        const open = it.y < tip - 12;
        if (open !== it.open) {
          it.open = open;
          it.node.classList.toggle("open", open);
        }
        const near = Math.abs(it.y - mid) < span;
        if (near !== it.near) {
          it.near = near;
          it.node.classList.toggle("near", near);
        }
      }
    };

    if (still) {
      paint(geo.h, 0, 0);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const tip = Math.min(geo.h, Math.max(120, window.scrollY + vh * (0.4 + 0.58 * p)));
      paint(tip, window.scrollY + vh / 2, vh);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [geo]);

  if (!geo) return <div ref={root} aria-hidden className="av-vine" />;
  const { w, h, s } = geo;

  return (
    <div
      ref={root}
      aria-hidden
      className="av-vine"
      style={{ width: w, height: h, "--h": h, "--s": s } as CSSProperties}
    >
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <linearGradient id="av-leaf-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2f7a5c" />
            <stop offset="0.55" stopColor="#6fc39a" />
            <stop offset="1" stopColor="#9fdcbc" />
          </linearGradient>
          <linearGradient id="av-bud-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2f7a5c" />
            <stop offset="0.45" stopColor="#7cc9a2" />
            <stop offset="1" stopColor="#2f7a5c" />
          </linearGradient>
        </defs>
      </svg>

      {/* The stem, painted once; the window reveals it down to the tip. */}
      <div className="av-win" style={{ width: w, height: h }}>
        <svg className="av-stem" width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={geo.d} stroke="#1f4a3c" strokeOpacity="0.2" strokeWidth={21 * s} transform={`translate(${3 * s} 3)`} />
          {geo.curls.map((c, i) => (
            <path key={i} d={c} stroke="#3f8a69" strokeWidth={2.4 * s} />
          ))}
          <path d={geo.d} stroke="#2f7a5c" strokeWidth={20 * s} />
          <path d={geo.d} stroke="#4f9a78" strokeWidth={14 * s} transform={`translate(${-1 * s} 0)`} />
          <path d={geo.d} stroke="#7cc9a2" strokeWidth={7 * s} transform={`translate(${-2.4 * s} 0)`} />
          <path d={geo.d} stroke="#d8ffe9" strokeOpacity="0.85" strokeWidth={2 * s} transform={`translate(${-4.4 * s} 0)`} />
        </svg>
      </div>

      {geo.leaves.map((l, i) => (
        <div
          key={i}
          className="av-leaf"
          data-y={l.y}
          style={
            {
              transform: `translate(${l.x.toFixed(1)}px, ${l.y}px) scaleX(${l.side}) rotate(${-l.tilt}deg)`,
              "--sd": `${5.5 + (i % 5) * 0.7}s`,
              "--sdl": `${-(i % 7) * 0.9}s`,
            } as CSSProperties
          }
        >
          <div className="av-sway">
            <svg className="av-blade" width={l.len} height={l.len * 0.67} style={{ top: -l.len * 0.335 }} viewBox="0 -12 36 24" overflow="visible">
              <path d="M0 0C6-11 22-14 35-2C24 9 8 9 0 0Z" fill="url(#av-leaf-g)" />
              <path d="M0 0C8-10 22-12 35-2C22-4 10-2 0 0Z" fill="#b9ecd2" opacity="0.5" />
              <path d="M1 0C12-2 24-3 34-2" stroke="#e5fff0" strokeWidth="0.9" fill="none" />
              <path d="M12-1.5L17-7M20-2L25-7M13-1L17 4" stroke="#e5fff0" strokeWidth="0.6" opacity="0.7" fill="none" />
            </svg>
          </div>
        </div>
      ))}

      {geo.blooms.map((b, i) => (
        <div
          key={i}
          className="av-bloom"
          data-y={b.y}
          style={{ transform: `translate(${(b.x - 32 * s).toFixed(1)}px, ${(b.y - 62 * s).toFixed(1)}px)`, width: 64 * s, height: 64 * s } as CSSProperties}
        >
          <div className="av-bloom-in">
            <Lotus deep={b.deep} className="h-full w-full" />
          </div>
        </div>
      ))}

      {/* The growing tip: a curled bud riding the end of the stem. */}
      <div className="av-tip">
        <svg width={30 * s} height={40 * s} viewBox="-11 -6 22 30" overflow="visible">
          <path d="M0-6C6-6 8 2 7 9C6 15 2 20 0 24C-2 20-6 15-7 9C-8 2-6-6 0-6Z" fill="url(#av-bud-g)" />
          <path d="M-3-2C-4 4-3 12 0 19" stroke="#d8ffe9" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.85" />
          <path d="M5 4C11 2 14 8 11 11C9 13 6 11 8 9" stroke="#3f8a69" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
