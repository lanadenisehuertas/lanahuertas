/*
 * Hand-drawn botanical set, after the reference posters: flat vector shapes
 * with soft two-stop gradients and a riso speckle on top. Everything is SVG so
 * it stays crisp, weighs almost nothing, and can sway and bloom.
 *
 * <BotanicalDefs/> renders the shared gradients and the speckle filter once
 * per page; every shape below points at those ids.
 */

export function BotanicalDefs() {
  return (
    <svg width="0" height="0" aria-hidden className="absolute">
      <defs>
        <linearGradient id="g-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2b8cf" />
          <stop offset="0.55" stopColor="#f6d3c3" />
          <stop offset="1" stopColor="#eedaa5" />
        </linearGradient>
        <linearGradient id="g-petal-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9379d" />
          <stop offset="1" stopColor="#f2b8cf" />
        </linearGradient>
        <linearGradient id="g-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a9b6f0" />
          <stop offset="1" stopColor="#f2b8cf" />
        </linearGradient>
        <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4f9a78" />
          <stop offset="1" stopColor="#b9e4cf" />
        </linearGradient>
        <radialGradient id="g-orb" cx="0.38" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.5" stopColor="#f2b8cf" />
          <stop offset="1" stopColor="#a9b6f0" />
        </radialGradient>

        {/* Ethereal set (Ethereal.tsx) and the poster flowers below. */}
        <radialGradient id="g-cloud" cx="0.35" cy="0.25" r="0.85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#fff6ea" />
          <stop offset="1" stopColor="#c9d0f4" />
        </radialGradient>
        <linearGradient id="g-bell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2b8cf" />
          <stop offset="0.55" stopColor="#f6d3c3" />
          <stop offset="1" stopColor="#e9f0b4" />
        </linearGradient>
        <linearGradient id="g-bell-deep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9b6f0" />
          <stop offset="0.6" stopColor="#f2b8cf" />
          <stop offset="1" stopColor="#fff6dc" />
        </linearGradient>
        <radialGradient id="g-blossom" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.4" stopColor="#f6d3c3" />
          <stop offset="1" stopColor="#f2b8cf" />
        </radialGradient>
        <radialGradient id="g-blossom-deep" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.35" stopColor="#f2b8cf" />
          <stop offset="1" stopColor="#b9379d" />
        </radialGradient>
        <linearGradient id="g-fern" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4f9a78" />
          <stop offset="0.5" stopColor="#b9e4cf" />
          <stop offset="1" stopColor="#a9b6f0" />
        </linearGradient>
        <linearGradient id="g-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a9b6f0" />
          <stop offset="0.45" stopColor="#f2b8cf" />
          <stop offset="0.8" stopColor="#e3a88a" />
          <stop offset="1" stopColor="#b9e4cf" />
        </linearGradient>
        <radialGradient id="g-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.35" stopColor="#e3a88a" />
          <stop offset="1" stopColor="#f2b8cf" />
        </radialGradient>
        <linearGradient id="g-streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>

        {/* Soft print grain: sparse light specks clipped to the shape, the
            same airbrushed grain as the page, never dark pepper. */}
        <filter id="speckle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.95  0 0 0 -2.6 1.06"
            result="dots"
          />
          <feComposite in="dots" in2="SourceAlpha" operator="in" result="clip" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="clip" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

/** Four-point sparkle, the reference posters' star. */
export function Sparkle4({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z" fill={fill} />
    </svg>
  );
}

/**
 * Lotus. Petals are separate groups rotated about the flower's base, so
 * `.bloom` on hover (or a parent's) fans them open.
 */
export function Lotus({ className = "", deep = false }: { className?: string; deep?: boolean }) {
  const petal = deep ? "url(#g-petal-deep)" : "url(#g-petal)";
  const outer = [-58, -30, 30, 58];
  return (
    <svg viewBox="0 0 200 200" aria-hidden className={`lotus ${className}`}>
      <g filter="url(#speckle)">
        {/* stem */}
        <path d="M100 196 C98 170 102 150 100 128" stroke="#4f9a78" strokeWidth="6" fill="none" strokeLinecap="round" />
        {/* sepals */}
        <path d="M100 136 C70 140 52 126 44 108 C66 112 86 118 100 136Z" fill="url(#g-leaf)" />
        <path d="M100 136 C130 140 148 126 156 108 C134 112 114 118 100 136Z" fill="url(#g-leaf)" />
        {outer.map((r) => (
          <g key={r} className="petal" style={{ "--r": `${r}deg` } as React.CSSProperties}>
            <path d="M100 132 C78 112 76 72 100 40 C124 72 122 112 100 132Z" fill={petal} />
          </g>
        ))}
        <g className="petal" style={{ "--r": "0deg" } as React.CSSProperties}>
          <path d="M100 134 C74 108 78 56 100 22 C122 56 126 108 100 134Z" fill={petal} />
          <path d="M100 126 C92 100 94 66 100 46 C106 66 108 100 100 126Z" fill="#fff6dc" opacity="0.55" />
        </g>
      </g>
    </svg>
  );
}

/** A leaf blade — pointed ellipse with a centre vein. */
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" aria-hidden className={className}>
      <g filter="url(#speckle)">
        <path d="M4 30 C30 2 86 0 116 30 C86 58 30 58 4 30Z" fill="url(#g-leaf)" />
        <path d="M8 30 C40 26 80 26 112 30" stroke="#fff6dc" strokeWidth="2" fill="none" opacity="0.6" />
      </g>
    </svg>
  );
}

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

/**
 * Trumpet flower, after the Korean festival poster: a flared cup on a curved
 * stem, pink at the lip fading to a lit, yellow-green throat.
 */
export function Bellflower({ className = "", deep = false }: { className?: string; deep?: boolean }) {
  return (
    <svg viewBox="0 0 120 200" aria-hidden className={className}>
      <g filter="url(#speckle)">
        <path d="M60 198 C56 170 68 140 60 96" stroke="#4f9a78" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M61 160 C80 150 98 156 106 140 C88 134 70 140 61 160Z" fill="url(#g-leaf)" />
        <path
          d="M60 100 C54 82 40 58 10 42 C30 30 48 40 60 26 C72 40 90 30 110 42 C80 58 66 82 60 100Z"
          fill={deep ? "url(#g-bell-deep)" : "url(#g-bell)"}
        />
        <ellipse cx="60" cy="38" rx="34" ry="6" fill={deep ? "#711e7b" : "#b9379d"} opacity="0.28" />
        <path d="M60 94 C58 76 56 60 60 44 C64 60 62 76 60 94Z" fill="#fff6dc" opacity="0.6" />
      </g>
    </svg>
  );
}

/**
 * Five-petal round blossom with a glowing centre. Petals are one group, so
 * a hover on the flower (or a .bloom-zone ancestor) turns them a little.
 */
export function Blossom({ className = "", deep = false }: { className?: string; deep?: boolean }) {
  const fill = deep ? "url(#g-blossom-deep)" : "url(#g-blossom)";
  return (
    <svg viewBox="0 0 100 100" aria-hidden className={`blossom ${className}`}>
      <g filter="url(#speckle)">
        <g className="blossom-petals">
          {[0, 72, 144, 216, 288].map((a) => (
            <circle
              key={a}
              cx={50 + 24 * Math.sin((a * Math.PI) / 180)}
              cy={50 - 24 * Math.cos((a * Math.PI) / 180)}
              r="23"
              fill={fill}
            />
          ))}
        </g>
        <circle cx="50" cy="50" r="11" fill="url(#g-orb)" />
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
        style={{ "--d": "900ms" } as React.CSSProperties}
      />
      <g filter="url(#speckle)">
        {LONG_LEAVES.map((l, i) => (
          <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r}) scale(${l.s})`}>
            <g className="vine-sprout" style={{ "--d": `${900 + i * 140}ms` } as React.CSSProperties}>
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
          <circle key={i} className="vine-sprout" cx={x} cy={y} r={r} fill="url(#g-orb)" style={{ "--d": `${1500 + i * 160}ms` } as React.CSSProperties} />
        ))}
      </g>
    </svg>
  );
}
