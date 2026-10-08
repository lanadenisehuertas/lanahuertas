import type { CSSProperties } from "react";
import { Sparkle4 } from "./Botanicals";

/*
 * The sky half of the botanical set: clouds, butterflies, orbit lines with a
 * sparkle riding them, shooting stars and a page-wide field of stars. Same
 * palette and soft grain as Botanicals.tsx.
 *
 * Depth is a vocabulary here, not an effect: `.dof-far` pieces are small,
 * soft and slow; `.dof-near` pieces are large and soft; crisp pieces sit in
 * the focal plane with the work.
 *
 * Performance: every moving part is an HTML box animated with transform or
 * opacity only, so the compositor runs it without repainting. Nothing animates
 * inside an <svg>.
 */

const SPARKLE = "M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z";

/** Eight-point burst star, after the cosmic reference. */
export function StarBurst({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  const pts = Array.from({ length: 16 }, (_, i) => {
    const r = i % 2 === 0 ? 20 : 7;
    const a = (i * Math.PI) / 8 - Math.PI / 2;
    return `${(20 + r * Math.cos(a)).toFixed(2)},${(20 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <polygon points={pts} fill={fill} />
    </svg>
  );
}

/** Small five-point star. */
export function Star5({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 1.5l3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 17.6l-6.4 3.5 1.4-7.1-5.3-5 7.2-.9z" fill={fill} />
    </svg>
  );
}

/** Large, soft four-point glow — the out-of-focus sparkle. */
export function GlowSparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={`overflow-visible ${className}`}>
      <path d={SPARKLE} fill="url(#g-glow)" />
    </svg>
  );
}

/*
 * Butterfly (flat airbrushed art, generated with Codex in the site palette).
 * One image shown twice, each copy clipped to one side of the body and hinged
 * on the centre line, so the wings beat without repainting anything.
 */
export function Butterfly({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <span aria-hidden className={`art-butterfly relative block aspect-[560/460] ${className}`} style={style}>
      {(["l", "r"] as const).map((side) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={side}
          src="/art/butterfly.webp"
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          className={`art-wing art-wing-${side} absolute inset-0 h-full w-full`}
        />
      ))}
    </span>
  );
}

/** Flat cloud bank with stretched wisps underneath (Codex, site palette). */
export function Cloud({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/art/cloud.webp"
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      width={900}
      height={333}
      className={`pointer-events-none max-w-none select-none ${className}`}
      style={style}
    />
  );
}

/*
 * A thin elliptical orbit with a sparkle travelling round it, after the
 * butterfly reference. The line is static SVG; the rider is HTML. It spins on
 * a circle inside a box squashed to the ellipse's ratio, counter-spins so it
 * stays upright, and is pre-stretched so the squash leaves it in proportion —
 * three transforms, all on the compositor.
 */
const ORBIT_K = 60 / 190; // ry / rx of the drawn ellipse

export function Orbit({
  className = "",
  stroke = "#ffffff",
  dur = "16s",
  reverse = false,
}: {
  className?: string;
  stroke?: string;
  dur?: string;
  reverse?: boolean;
}) {
  return (
    <span aria-hidden className={`orbit-ring relative block aspect-[400/160] ${className}`}>
      <svg viewBox="0 0 400 160" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
        <ellipse cx="200" cy="80" rx="190" ry="60" stroke={stroke} strokeWidth="1.3" opacity="0.85" vectorEffect="non-scaling-stroke" />
        <path d={SPARKLE} fill={stroke} transform="translate(56 113) scale(0.6) translate(-12 -12)" />
        <path d={SPARKLE} fill={stroke} transform="translate(330 30) scale(0.45) translate(-12 -12)" />
      </svg>
      <span className="orbit-track absolute inset-0" style={{ transform: `scaleY(${ORBIT_K.toFixed(4)})` }}>
        <span
          className="orbit-spin absolute inset-0"
          style={{ "--dur": dur, animationDirection: reverse ? "reverse" : "normal" } as CSSProperties}
        >
          <span className="absolute top-1/2 right-[2.5%] block h-0 w-0">
            <span
              className="orbit-spin block"
              style={{ "--dur": dur, animationDirection: reverse ? "normal" : "reverse" } as CSSProperties}
            >
              <span className="block" style={{ transform: `scaleY(${(1 / ORBIT_K).toFixed(4)})` }}>
                <svg viewBox="0 0 24 24" className="-mt-2 -ml-2 block h-4 w-4" style={{ color: stroke }}>
                  <path d={SPARKLE} fill="currentColor" />
                </svg>
              </span>
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

/** A comet streak: tapered tail and a sparkle head, crossing on a long loop. */
export function ShootingStar({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden className={`shoot pointer-events-none absolute ${className}`} style={style}>
      <svg viewBox="0 0 220 24" className="w-full overflow-visible">
        <path d="M0 12 C80 11 160 9 206 12 C160 15 80 13 0 12Z" fill="url(#g-streak)" />
        <path d={SPARKLE} fill="#fff" transform="translate(206 12) scale(0.95) translate(-12 -12)" />
      </svg>
    </div>
  );
}

/*
 * The page sky. Fixed behind everything, so the work scrolls over it while
 * the stars hold still, and each one drifts with the pointer at its own depth.
 * Placed in the margins and gutters; `extra` ones are dropped in lite mode.
 */
type Spot = {
  x: string;
  y: string;
  s: number;
  kind: "spark" | "star" | "burst" | "glow" | "note" | "notes" | "px";
  art?: PixelArtName;
  c: string;
  depth: number;
  tw: number;
  extra?: boolean;
};

const SKY: Spot[] = [
  { x: "6%", y: "9%", s: 12, kind: "spark", c: "#ffffff", depth: 6, tw: 4.2 },
  { x: "93%", y: "14%", s: 13, kind: "star", c: "#f2b8cf", depth: 10, tw: 5.1 },
  { x: "88%", y: "6%", s: 7, kind: "spark", c: "#ffffff", depth: 4, tw: 3.6 },
  { x: "3%", y: "32%", s: 8, kind: "star", c: "#ffffff", depth: 8, tw: 4.8 },
  { x: "97%", y: "38%", s: 10, kind: "spark", c: "#e3a88a", depth: 7, tw: 3.9 },
  { x: "95%", y: "58%", s: 8, kind: "burst", c: "#ffffff", depth: 12, tw: 5.6, extra: true },
  { x: "2.5%", y: "62%", s: 12, kind: "spark", c: "#f2b8cf", depth: 9, tw: 4.4 },
  { x: "7%", y: "84%", s: 7, kind: "star", c: "#ffffff", depth: 5, tw: 3.3, extra: true },
  { x: "91%", y: "82%", s: 11, kind: "spark", c: "#ffffff", depth: 11, tw: 4.9 },
  { x: "50%", y: "3%", s: 6, kind: "spark", c: "#ffffff", depth: 3, tw: 3.1, extra: true },
  { x: "74%", y: "95%", s: 8, kind: "star", c: "#f2b8cf", depth: 6, tw: 5.4, extra: true },
  { x: "22%", y: "96%", s: 7, kind: "burst", c: "#ffffff", depth: 8, tw: 4.1, extra: true },
  { x: "97%", y: "26%", s: 46, kind: "glow", c: "", depth: -6, tw: 7 },
  { x: "1%", y: "48%", s: 60, kind: "glow", c: "", depth: -8, tw: 8.5 },
  { x: "94%", y: "72%", s: 38, kind: "glow", c: "", depth: -5, tw: 6.4, extra: true },
  { x: "4.5%", y: "20%", s: 16, kind: "note", c: "#a9b6f0", depth: 7, tw: 6.2 },
  { x: "96%", y: "47%", s: 18, kind: "notes", c: "#f2b8cf", depth: 9, tw: 7.4 },
  { x: "5%", y: "73%", s: 14, kind: "note", c: "#b9379d", depth: 6, tw: 5.8, extra: true },
  { x: "95.5%", y: "8%", s: 30, kind: "px", art: "moon", c: "", depth: 4, tw: 9 },
  { x: "3.5%", y: "41%", s: 34, kind: "px", art: "sparkle", c: "", depth: 7, tw: 6.6 },
  { x: "96.5%", y: "90%", s: 18, kind: "px", art: "sparkle", c: "", depth: 9, tw: 5.2, extra: true },
  { x: "4%", y: "93%", s: 16, kind: "px", art: "heart", c: "", depth: 6, tw: 4.6, extra: true },
];

export function Starfield() {
  return (
    <div aria-hidden className="starfield pointer-events-none fixed inset-0" style={{ zIndex: -1 }}>
      {SKY.map((p, i) => (
        <span
          key={i}
          className={`px absolute block ${p.extra ? "sky-extra" : ""}`}
          style={{ left: p.x, top: p.y, width: p.s, height: p.s, margin: `${-p.s / 2}px 0 0 ${-p.s / 2}px`, "--depth": p.depth } as CSSProperties}
        >
          <span
            className={`block h-full w-full ${p.extra ? "opacity-70" : "twinkle"} ${p.kind === "glow" ? "dof-far" : ""}`}
            style={{ "--tw": `${p.tw}s`, "--td": `${-i * 0.7}s` } as CSSProperties}
          >
            {p.kind === "spark" && <Sparkle4 className="h-full w-full" fill={p.c} />}
            {p.kind === "star" && <Star5 className="h-full w-full" fill={p.c} />}
            {p.kind === "burst" && <StarBurst className="h-full w-full" fill={p.c} />}
            {p.kind === "glow" && <GlowSparkle className="h-full w-full" />}
            {p.kind === "note" && <Note className="h-full w-full opacity-70" fill={p.c} />}
            {p.kind === "notes" && <Note kind="beamed" className="h-full w-full opacity-70" fill={p.c} />}
            {p.kind === "px" && p.art && <PixelArt name={p.art} className="h-full w-full opacity-85" />}
          </span>
        </span>
      ))}
    </div>
  );
}

/*
 * Pixel flower, after the "Unseen Grove" poster: four hollow 3×3 petals round
 * a single centre square, on a 9×9 grid. Static and crisp.
 */
const PIXEL_FLOWER = [
  "...###...",
  "...#.#...",
  "...###...",
  "###...###",
  "#.#.#.#.#",
  "###...###",
  "...###...",
  "...#.#...",
  "...###...",
];

export function PixelFlower({ className = "", fill = "#ffffff" }: { className?: string; fill?: string }) {
  const cells: [number, number][] = [];
  PIXEL_FLOWER.forEach((row, y) => [...row].forEach((ch, x) => ch === "#" && cells.push([x, y])));
  return (
    <svg viewBox="0 0 9 9" aria-hidden className={`pixel-flower ${className}`} shapeRendering="crispEdges">
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" fill={fill} />
      ))}
    </svg>
  );
}

/*
 * Music, kept quiet: drawn note glyphs (never emoji) and a curving staff
 * that drifts through the sky with a few notes resting on it, after the
 * lotus-and-score reference.
 */
export function Note({
  kind = "eighth",
  className = "",
  fill = "currentColor",
}: {
  kind?: "eighth" | "beamed";
  className?: string;
  fill?: string;
}) {
  return kind === "eighth" ? (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <ellipse cx="8.2" cy="18.2" rx="4.4" ry="3.3" transform="rotate(-22 8.2 18.2)" fill={fill} />
      <path d="M11.4 17.4V2.6" stroke={fill} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M11.4 2.6c1.6 2.6 5.6 3.6 5.4 8.2-.6-2.4-2.8-3.8-5.4-4.2z" fill={fill} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <ellipse cx="5.6" cy="19.4" rx="3.8" ry="2.9" transform="rotate(-22 5.6 19.4)" fill={fill} />
      <ellipse cx="17.6" cy="16.6" rx="3.8" ry="2.9" transform="rotate(-22 17.6 16.6)" fill={fill} />
      <path d="M8.6 18.6V5.2M20.6 15.8V2.4" stroke={fill} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M8.6 5.2 20.6 2.4v3.1L8.6 8.3z" fill={fill} />
    </svg>
  );
}

/** A five-line staff on a gentle wave, with a few notes resting on it. */
export function Staff({ className = "", stroke = "#ffffff" }: { className?: string; stroke?: string }) {
  const wave = (dy: number) => `M0 ${60 + dy} C120 ${20 + dy} 220 ${100 + dy} 340 ${58 + dy} S560 ${24 + dy} 640 ${62 + dy}`;
  return (
    <svg viewBox="0 0 640 140" aria-hidden className={`overflow-visible ${className}`} fill="none">
      {[0, 8, 16, 24, 32].map((dy) => (
        <path key={dy} d={wave(dy)} stroke={stroke} strokeWidth="1" opacity="0.7" vectorEffect="non-scaling-stroke" />
      ))}
      {/* notes resting on the lines */}
      <g fill={stroke}>
        <g transform="translate(128 34) scale(1.3)">
          <ellipse cx="8.2" cy="18.2" rx="4.4" ry="3.3" transform="rotate(-22 8.2 18.2)" />
          <path d="M11.4 17.4V2.6" stroke={stroke} strokeWidth="1.6" />
          <path d="M11.4 2.6c1.6 2.6 5.6 3.6 5.4 8.2-.6-2.4-2.8-3.8-5.4-4.2z" />
        </g>
        <g transform="translate(300 52) scale(1.25)">
          <ellipse cx="5.6" cy="19.4" rx="3.8" ry="2.9" transform="rotate(-22 5.6 19.4)" />
          <ellipse cx="17.6" cy="16.6" rx="3.8" ry="2.9" transform="rotate(-22 17.6 16.6)" />
          <path d="M8.6 18.6V5.2M20.6 15.8V2.4" stroke={stroke} strokeWidth="1.5" />
          <path d="M8.6 5.2 20.6 2.4v3.1L8.6 8.3z" />
        </g>
        <g transform="translate(486 18) scale(1.2)">
          <ellipse cx="8.2" cy="18.2" rx="4.4" ry="3.3" transform="rotate(-22 8.2 18.2)" />
          <path d="M11.4 17.4V2.6" stroke={stroke} strokeWidth="1.6" />
        </g>
      </g>
    </svg>
  );
}

/*
 * Pixel and dot-matrix drawings (public/art/*.svg, generated as crisp vector
 * squares and dots): a curling pixel swirl, a dot-matrix candelabra ornament,
 * a Bayer-dithered pixel lotus and a tiny pixel butterfly. Static images, so
 * they cost nothing once loaded.
 */
const PIXEL_ART = {
  swirl: { src: "/art/pixel-swirl.svg", w: 64, h: 40 },
  ornament: { src: "/art/dot-ornament.svg", w: 44, h: 66 },
  lotus: { src: "/art/pixel-lotus.svg", w: 84, h: 60 },
  butterfly: { src: "/art/pixel-butterfly.svg", w: 13, h: 9 },
  sparkle: { src: "/art/pixel-sparkle.svg", w: 41, h: 41 },
  heart: { src: "/art/pixel-heart.svg", w: 9, h: 8 },
  note: { src: "/art/pixel-note.svg", w: 14, h: 11 },
  cloud: { src: "/art/pixel-cloud.svg", w: 60, h: 30 },
  daisy: { src: "/art/pixel-daisy.svg", w: 31, h: 31 },
  moon: { src: "/art/pixel-moon.svg", w: 32, h: 32 },
  dotButterfly: { src: "/art/dot-butterfly.svg", w: 46, h: 34 },
  flourish: { src: "/art/dot-flourish.svg", w: 120, h: 20 },
} as const;

export type PixelArtName = keyof typeof PIXEL_ART;

export function PixelArt({
  name,
  className = "",
  style,
}: {
  name: keyof typeof PIXEL_ART;
  className?: string;
  style?: CSSProperties;
}) {
  const a = PIXEL_ART[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={a.src}
      width={a.w}
      height={a.h}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      draggable={false}
      className={`pointer-events-none max-w-none select-none ${className}`}
      style={style}
    />
  );
}
