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
      <g>
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
      <g>
        <path d="M4 30 C30 2 86 0 116 30 C86 58 30 58 4 30Z" fill="url(#g-leaf)" />
        <path d="M8 30 C40 26 80 26 112 30" stroke="#fff6dc" strokeWidth="2" fill="none" opacity="0.6" />
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
      <g>
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
      <g>
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
