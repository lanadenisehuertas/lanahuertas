import type { CSSProperties } from "react";

/*
 * The first portfolio's hero pieces that the later redesign retired: the
 * spiral tendril, the bead orb, the fern, the long vine and the soft cloud.
 * Restored as they were (commit 0483ddb) for the original hero
 * (components/pastel/OriginalHero.tsx). They draw with the shared gradients
 * and speckle filter from <BotanicalDefs/>.
 */

/** Archimedean spiral tendril, drawn as one stroke. */
export function Spiral({ className = "", stroke = "#4f9a78" }: { className?: string; stroke?: string }) {
  const pts: string[] = [];
  for (let t = 0; t <= 4.2 * Math.PI; t += 0.18) {
    const r = 3 + t * 4.2;
    pts.push(`${(60 + r * Math.cos(t)).toFixed(1)},${(60 + r * Math.sin(t)).toFixed(1)}`);
  }
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      <polyline points={pts.join(" ")} fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Soft gradient orb — the bead/bubble motif. */
export function Orb({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className}>
      <g filter="url(#speckle)">
        <circle cx="20" cy="20" r="19" fill="url(#g-orb)" />
        <ellipse cx="14" cy="12" rx="6" ry="3.5" fill="#fff" opacity="0.6" transform="rotate(-30 14 12)" />
      </g>
    </svg>
  );
}

/** Fern frond — a bowed stem with leaflets shrinking toward the tip. */
export function Fern({ className = "" }: { className?: string }) {
  const leaflets = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    const y = 196 - i * 21;
    const x = 40 + Math.sin(t * 2.4) * 8;
    const len = 30 - t * 20;
    return { x, y, len };
  });
  return (
    <svg viewBox="0 0 80 220" aria-hidden className={className}>
      <g filter="url(#speckle)">
        <path d="M40 218 C40 160 52 90 38 4" stroke="url(#g-fern)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        {leaflets.map(({ x, y, len }, i) => (
          <g key={i} opacity="0.92">
            <path d={`M${x} ${y} C${x - len * 0.5} ${y - 8} ${x - len} ${y - 16} ${x - len * 1.1} ${y - 24} C${x - len * 0.6} ${y - 20} ${x - 6} ${y - 10} ${x} ${y}Z`} fill="url(#g-fern)" />
            <path d={`M${x} ${y - 8} C${x + len * 0.5} ${y - 16} ${x + len} ${y - 24} ${x + len * 1.1} ${y - 32} C${x + len * 0.6} ${y - 28} ${x + 6} ${y - 18} ${x} ${y - 8}Z`} fill="url(#g-fern)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/*
 * The long vine: one stem that weaves the full width of a garden, behind the
 * flowers, with leaves, buds and a tendril along it. It draws itself in when
 * its section arrives ([data-in] from ScrollFX), then the leaves sprout one
 * after another along its length. It is what ties the beds together.
 */
const LONG_VINE = "M-30 150 C80 96 170 178 290 138 S480 52 610 96 S820 184 950 128 S1150 58 1240 92";
const LONG_LEAVES: { x: number; y: number; r: number; s: number }[] = [
  { x: 92, y: 118, r: -38, s: 1 },
  { x: 214, y: 158, r: 150, s: 0.85 },
  { x: 372, y: 104, r: -28, s: 1.1 },
  { x: 520, y: 66, r: 162, s: 0.9 },
  { x: 676, y: 120, r: 24, s: 1 },
  { x: 812, y: 168, r: 196, s: 0.85 },
  { x: 1010, y: 110, r: -32, s: 1.05 },
  { x: 1138, y: 76, r: 170, s: 0.8 },
];

export function LongVine({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 220"
      aria-hidden
      className={`vine overflow-visible ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path className="vine-stroke" pathLength={1} d={LONG_VINE} fill="none" stroke="#4f9a78" strokeWidth="5" strokeLinecap="round" />
      <path
        className="vine-stroke"
        pathLength={1}
        d="M610 96 C640 60 690 58 700 34 C706 20 690 12 682 22 C676 30 686 38 692 32"
        fill="none"
        stroke="#4f9a78"
        strokeWidth="3"
        strokeLinecap="round"
        style={{ "--d": "900ms" } as CSSProperties}
      />
      <g filter="url(#speckle)">
        {LONG_LEAVES.map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
            <g className="vine-sprout" style={{ "--d": `${900 + i * 140}ms` } as CSSProperties}>
              <path d="M0 0 C10 -16 34 -20 52 -8 C38 6 14 10 0 0Z" fill="url(#g-leaf)" />
              <path d="M2 -1 C18 -8 32 -9 46 -7" stroke="#fff6dc" strokeWidth="1.4" fill="none" opacity="0.6" />
            </g>
          </g>
        ))}
        {[
          [290, 138, 9],
          [950, 128, 8],
          [452, 72, 6],
          [1186, 74, 6],
        ].map(([x, y, r], i) => (
          <circle key={i} className="vine-sprout" cx={x} cy={y} r={r} fill="url(#g-orb)" style={{ "--d": `${1500 + i * 160}ms` } as CSSProperties} />
        ))}
      </g>
    </svg>
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
