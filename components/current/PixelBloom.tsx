import type { CSSProperties } from "react";

/*
 * A flower drawn on a grid, in code: nothing is traced from a picture.
 *
 * The head is two rings of petals round a disc, on a stem with two leaves.
 * Each cell of the grid asks where it falls: disc, inner petal, outer petal,
 * the dissolving rim, or the loose cells that have drifted off it. The rim
 * thins out through an ordered (Bayer) dither, so the bloom breaks up into
 * single squares at its edge the way a pixel poster does.
 *
 * It is one <svg> of <rect>s. Colours come from CSS custom properties on the
 * wrapper (--b1 inner, --b2 outer, --b3 rim outline, --b4 disc, --b5 stray),
 * so the same flower takes the palette of whichever tile it sits in. Each
 * cell carries its ring (--r), which staggers the opening when the bloom
 * first shows and the ripple when it is hovered (bloom.css).
 */

const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

type Cell = { x: number; y: number; tone: 1 | 2 | 3 | 4 | 5; ring: number };

function grow(n: number, petals: number, turn: number): Cell[] {
  const cells: Cell[] = [];
  const cx = 0,
    cy = -0.28,
    R = 0.62;
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const x = ((i + 0.5) / n) * 2 - 1,
        y = ((j + 0.5) / n) * 2 - 1;
      const b = BAYER[j % 4][i % 4] / 16;
      const dx = x - cx,
        dy = y - cy,
        r = Math.hypot(dx, dy),
        th = Math.atan2(dy, dx) + turn;
      // the outline of each ring of petals, as a radius for this angle
      const lobe = (k: number, phase: number) => Math.abs(Math.cos((k * (th + phase)) / 2)) ** 0.55;
      const outer = R * (0.52 + 0.48 * lobe(petals, 0));
      const inner = R * 0.62 * (0.5 + 0.5 * lobe(petals, Math.PI / petals));
      const ring = Math.min(15, Math.round(r * 14));
      let tone: Cell["tone"] | 0 = 0;
      if (r < 0.11) tone = 4;
      else if (r < inner * 0.92) tone = 1;
      else if (r < inner) tone = b > 0.3 ? 1 : 0; // a broken seam between the two rings
      else if (r < outer * 0.8) tone = 2;
      else if (r < outer) tone = b > (r / outer - 0.8) / 0.2 ? 3 : 0; // the rim dissolves
      else if (r < outer * 1.22 && b > 0.86) tone = 5; // strays
      // stem and leaves, under the head
      if (!tone && y > cy + 0.2) {
        const bend = 0.05 * Math.sin((y - cy) * 3.4);
        if (Math.abs(x - bend) < 1.3 / n && y < 0.98) tone = 2;
        const leaf = (lx: number, ly: number, ang: number) => {
          const u = (x - lx) * Math.cos(ang) + (y - ly) * Math.sin(ang),
            v = -(x - lx) * Math.sin(ang) + (y - ly) * Math.cos(ang);
          return (u / 0.26) ** 2 + (v / 0.085) ** 2;
        };
        const l = Math.min(leaf(0.27, 0.5, -0.5), leaf(-0.25, 0.68, 0.55));
        if (l < 0.72) tone = 1;
        else if (l < 1 && b > (l - 0.72) / 0.28) tone = 3;
      }
      if (tone) cells.push({ x: i, y: j, tone, ring });
    }
  }
  return cells;
}

export default function PixelBloom({
  size = 40,
  petals = 6,
  turn = 0.3,
  className = "",
  style,
}: {
  /** Cells across. */
  size?: number;
  petals?: number;
  /** Rotation of the head, in radians. */
  turn?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const cells = grow(size, petals, turn);
  const g = 0.12; // the gap round each cell, in cell units
  return (
    <svg viewBox={`0 0 ${size} ${size}`} aria-hidden className={`bloom ${className}`} style={style} shapeRendering="crispEdges">
      {cells.map((c) => (
        <rect
          key={`${c.x}-${c.y}`}
          className={`bl bl-${c.tone}`}
          x={c.x + g}
          y={c.y + g}
          width={1 - g * 2}
          height={1 - g * 2}
          style={{ "--r": c.ring } as CSSProperties}
        />
      ))}
    </svg>
  );
}
