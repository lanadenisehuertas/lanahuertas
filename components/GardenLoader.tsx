/*
 * Opening screen: the garden waking up. A pixel flower blooms square by
 * square in Bayer-dither order on the dawn sky, over "planting pixels" and a
 * small beating pixel heart.
 *
 * Server-rendered HTML and CSS only, so it is there on the very first paint
 * with no JavaScript. The inline script in the layout lifts it once the page
 * has loaded (never sooner than ~0.7s, so it doesn't flash), and skips it on
 * later visits in the same session. If scripts fail, CSS lifts it at 4.5s.
 */
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

const SPARKLE = "M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z";

export default function GardenLoader() {
  const cells: { x: number; y: number; i: number }[] = [];
  FLOWER.forEach((row, y) => [...row].forEach((ch, x) => ch === "#" && cells.push({ x, y, i: BAYER[y % 8][x % 8] })));
  return (
    <div id="garden-loader" aria-hidden>
      <div className="loader-stage">
        <svg viewBox="0 0 9 9" className="loader-px" shapeRendering="crispEdges">
          {cells.map(({ x, y, i }) => (
            <rect key={`${x}-${y}`} x={x + 0.08} y={y + 0.08} width="0.84" height="0.84" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </svg>
        <svg viewBox="0 0 24 24" className="loader-spark loader-spark-a">
          <path d={SPARKLE} />
        </svg>
        <svg viewBox="0 0 24 24" className="loader-spark loader-spark-b">
          <path d={SPARKLE} />
        </svg>
      </div>
      <p className="loader-text">
        planting pixels
        <svg viewBox="0 0 9 8" className="loader-heart" shapeRendering="crispEdges">
          <path d="M1 0h2v1H1zM6 0h2v1H6zM0 1h4v1H0zM5 1h4v1H5zM0 2h9v2H0zM1 4h7v1H1zM2 5h5v1H2zM3 6h3v1H3zM4 7h1v1H4z" />
        </svg>
      </p>
    </div>
  );
}
