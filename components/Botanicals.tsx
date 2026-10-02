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

        {/* Riso speckle: dark grain clipped to the shape and laid over it. */}
        <filter id="speckle" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="1" seed="7" result="n" />
          <feColorMatrix
            in="n"
            type="matrix"
            values="0 0 0 0 0.11  0 0 0 0 0.03  0 0 0 0 0.19  0 0 0 -3.4 1.32"
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
    <svg viewBox="0 0 200 200" aria-hidden className={`lotus ${className}`} filter="url(#speckle)">
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
    </svg>
  );
}

/** A leaf blade — pointed ellipse with a centre vein. */
export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" aria-hidden className={className} filter="url(#speckle)">
      <path d="M4 30 C30 2 86 0 116 30 C86 58 30 58 4 30Z" fill="url(#g-leaf)" />
      <path d="M8 30 C40 26 80 26 112 30" stroke="#fff6dc" strokeWidth="2" fill="none" opacity="0.6" />
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

/**
 * A long vine that sweeps across a section, with leaves along it and a
 * spiral at the end. `pathLength` lets CSS draw it in on scroll.
 */
export function Vine({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 600 300"
      aria-hidden
      className={`vine overflow-visible ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        className="vine-stroke"
        pathLength={1}
        d="M-10 250 C90 260 140 150 230 160 C320 170 330 260 420 230 C500 204 520 120 470 96 C430 78 404 120 432 140 C452 154 476 132 462 116"
        fill="none"
        stroke="#4f9a78"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <g className="vine-leaves">
        <path d="M120 214 C120 180 150 160 176 166 C176 196 150 216 120 214Z" fill="url(#g-leaf)" />
        <path d="M260 168 C276 132 312 124 330 138 C318 168 286 178 260 168Z" fill="url(#g-leaf)" />
        <path d="M352 236 C350 270 376 292 404 288 C406 258 382 236 352 236Z" fill="url(#g-leaf)" />
        <circle cx="236" cy="160" r="10" fill="url(#g-orb)" />
        <circle cx="414" cy="232" r="7" fill="url(#g-orb)" />
      </g>
    </svg>
  );
}

/** Soft gradient orb — the bead/bubble motif. */
export function Orb({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={className} filter="url(#speckle)">
      <circle cx="20" cy="20" r="19" fill="url(#g-orb)" />
      <ellipse cx="14" cy="12" rx="6" ry="3.5" fill="#fff" opacity="0.6" transform="rotate(-30 14 12)" />
    </svg>
  );
}
