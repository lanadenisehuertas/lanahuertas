/*
 * Opening screen: "Lana Denise" written onto the dusk sky. Each letter rises
 * out of a soft blur in turn, a thread of light draws under the name, two
 * pixel flowers bloom at its ends in Bayer-dither order, and a few stars
 * twinkle. Then an iris opens from the middle and the hero is behind it.
 *
 * Server-rendered HTML and CSS only, so it is there on the very first paint
 * with no JavaScript. The inline script in the layout lifts it once the page
 * has loaded and the name has finished writing (about 1.9s at the soonest,
 * 4s at the latest). If scripts fail, CSS lifts it at 5s.
 */
import type { CSSProperties } from "react";

const FLOWER = [
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

const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

const SPARKLE = "M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z";

function PixelFlower({ className, center }: { className: string; center: string }) {
  const cells: { x: number; y: number; i: number }[] = [];
  FLOWER.forEach((row, y) => [...row].forEach((ch, x) => ch === "#" && cells.push({ x, y, i: BAYER[y % 8][x % 8] })));
  return (
    <svg viewBox="0 0 9 9" className={`loader-px ${className}`} shapeRendering="crispEdges" aria-hidden>
      {cells.map(({ x, y, i }) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" style={{ "--i": i } as CSSProperties} />
      ))}
      <rect x="4" y="4" width="1" height="1" fill={center} className="loader-px-c" />
    </svg>
  );
}

export default function GardenLoader() {
  const words: [string, string][] = [
    ["Lana", "loader-w1"],
    ["Denise", "loader-w2"],
  ];
  let n = 0;
  return (
    <div id="garden-loader" aria-hidden>
      <div className="loader-stars" />
      <svg viewBox="0 0 24 24" className="loader-spark loader-spark-a"><path d={SPARKLE} /></svg>
      <svg viewBox="0 0 24 24" className="loader-spark loader-spark-b"><path d={SPARKLE} /></svg>
      <svg viewBox="0 0 24 24" className="loader-spark loader-spark-c"><path d={SPARKLE} /></svg>

      <div className="loader-stage">
        <p className="loader-name">
          {words.map(([w, cls]) => (
            <span key={w} className={`loader-word ${cls}`}>
              {[...w].map((ch) => (
                <span key={n} className="loader-ch" style={{ "--n": n++ } as CSSProperties}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
        <span className="loader-thread" />
        <PixelFlower className="loader-px-l" center="#ffd98a" />
        <PixelFlower className="loader-px-r" center="#ff9ec4" />
      </div>
    </div>
  );
}
