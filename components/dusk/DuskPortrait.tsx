"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { portrait } from "@/lib/dusk/portrait";
import { reducedMotion } from "@/lib/dusk/fx";
import { Sparkle4 } from "../Botanicals";
import ToolStars from "./ToolStars";

/* The portrait's own coordinates: the canvas and ring are laid out in
   this box, which is then shown at whatever size the column gives it. */
const W = 380,
  H = 480;

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const sm = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
/**
 * One half of the tilted ring (b: behind the portrait, f: in front), with a
 * little planet riding it. The planet is a plain element moved by a CSS
 * transform along the same ellipse (dusk.css, dk-ride), so the compositor
 * runs it and it pauses off screen like everything else; an SVG animateMotion
 * here repainted the page on the main thread about 40 times a second.
 */
function RingHalf({ half }: { half: "b" | "f" }) {
  const id = `dk-ar-${half}`;
  return (
    <div
      aria-hidden
      className="dk-orbit pointer-events-none absolute"
      style={{ left: `${(-90 / W) * 100}%`, top: `${(260 / H) * 100}%`, width: `${(560 / W) * 100}%`, aspectRatio: "560 / 200", zIndex: half === "b" ? 1 : 3, transformOrigin: "50% 50%" }}
    >
      <svg viewBox="0 0 560 200" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <clipPath id={id}>
            <rect x="0" y={half === "b" ? -20 : 100} width="560" height={half === "b" ? 120 : 140} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id})`}>
          <ellipse className="dk-ringline" pathLength={1} cx="280" cy="100" rx="262" ry="70" fill="none" stroke="#fdf3e1" strokeOpacity=".9" strokeWidth="2" />
          <ellipse
            className="dk-ringline"
            pathLength={1}
            cx="280"
            cy="100"
            rx="276"
            ry="84"
            fill="none"
            stroke="#ffcfe0"
            strokeOpacity=".45"
            strokeWidth="1.2"
            style={{ transform: "scale(-1,1)", transformOrigin: "280px 100px" }}
          />
        </g>
      </svg>
      {/* the same half of the ring's box as the clip above, so the planet
          passes behind the portrait and comes round in front of it */}
      <div className={`dk-rider-clip dk-rider-${half}`}>
        <div className="dk-rider">
          <span />
        </div>
      </div>
    </div>
  );
}

/**
 * About's portrait. On wide screens it stays put (sticky) while the section
 * scrolls past it: over the first third the halftone print develops face
 * first, then the photo comes through it, the portrait grows into place and
 * the ring draws itself round, while the tools light up round it one star at
 * a time (ToolStars reads the --p this sets). On phones the same plays off
 * the portrait's own place on screen.
 */
export default function DuskPortrait() {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current,
      c = cv.current;
    const sec = el?.closest("section");
    if (!el || !c || !sec) return;
    const still = reducedMotion();
    const wide = window.matchMedia("(min-width: 1024px)");
    // who reads --p: the portrait block (portrait, glow, rings, tool stars) and
    // the About streams. Writing it on the section restyled the whole section.
    const readers = [el.parentElement ?? el, ...sec.querySelectorAll<HTMLElement>(".dk-astreams")];
    let lastP = "";

    // the section's scroll progress: 0 as it comes up the screen, 1 as it leaves
    const secP = () => {
      const r = sec.getBoundingClientRect(),
        vh = innerHeight;
      return clamp((vh * 0.85 - r.top) / Math.max(1, r.height - vh * 0.35));
    };
    // phones: the portrait's own place on screen
    const ownP = () => {
      const r = el.getBoundingClientRect(),
        vh = innerHeight;
      return clamp((vh * 0.95 - r.top) / (vh * 0.95 - (vh * 0.3 - r.height * 0.5)));
    };

    // the portrait develops over the first part of the section
    const portraitP = () => (wide.matches ? sm(0, 0.3, secP()) : ownP());

    // the print is drawn (and the photo fetched) only as About comes near
    let off = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        off = start();
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(sec);
    const start = () => portrait(c, {
      src: "/work/lana-portrait.webp",
      W,
      H,
      res: 1.45,
      zoom: 1.05,
      focus: [0.56, 0.3],
      at: [0.5, 0.36],
      weight: (x, y) => sm(1, 0.5, ((x - 190) / 175) ** 2 + ((y - 230) / 235) ** 2),
      getP: portraitP,
      still,
      onProgress: (pr) => {
        const s = pr.toFixed(3);
        if (s === lastP) return;
        lastP = s;
        readers.forEach((r) => r.style.setProperty("--p", s));
      },
    });
    return () => {
      io.disconnect();
      off();
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none">
      <div ref={box} className="dk-portrait relative mx-auto w-[80%] max-w-[560px] lg:w-[78%]" style={{ aspectRatio: `${W} / ${H}` } as CSSProperties}>
        <div aria-hidden className="dk-pglow" />
        <RingHalf half="b" />
        <canvas ref={cv} role="img" aria-label="Lana Denise Huertas" className="dk-print" />
        <RingHalf half="f" />
        <Sparkle4 className="twinkle absolute top-[4%] right-[2%] h-4 w-4 text-[#ffd98a]" />
        <Sparkle4 className="twinkle absolute top-[30%] left-[-8%] h-3 w-3 text-[#fdf3e1] [animation-delay:-1.6s]" />
      </div>

      {/* The app logos as a constellation: round the portrait on desktop, a chain below on phones. */}
      <ToolStars variant="orbit" className="hidden lg:block" />
      <div className="relative z-20 mt-32 sm:mt-40 lg:hidden">
        <p className="type-pixel mb-1 flex items-center justify-center gap-2 text-[13px] text-ink/75">
          <Sparkle4 className="h-2.5 w-2.5 text-eminence" />
          the tools I use · tap a star
        </p>
        <ToolStars variant="row" />
      </div>
    </div>
  );
}
