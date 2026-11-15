/*
 * Opening screen: the site's pixel butterfly (the same 13 x 9 cells as the
 * nav mark and the site icon) flutters over the dawn sky while a short trail
 * of pixel dots fills in under it, above "Opening the garden".
 *
 * Server-rendered HTML and CSS only, so it is there on the very first paint
 * with no JavaScript. The inline script in the layout lifts it, and skips it
 * on later visits in the same session. If scripts fail, CSS lifts it at 4.5s.
 *
 * Everything that moves is transform or opacity on plain SVG groups: no
 * filter, mask or clip-path, and it all stops once the screen has lifted.
 */
const BUTTERFLY = [
  ".##.......##.",
  "####.#.#.####",
  "#####.#.#####",
  "######.######",
  ".#####.#####.",
  "..####.####..",
  ".#####.#####.",
  "#####...#####",
  ".###.....###.",
];

// one path per part, so each wing can fold on its own about the body
function cells(test: (x: number) => boolean) {
  let d = "";
  BUTTERFLY.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === "#" && test(x)) d += `M${x} ${y}h1v1h-1z`;
    })
  );
  return d;
}

const LEFT = cells((x) => x < 6);
const BODY = cells((x) => x === 6);
const RIGHT = cells((x) => x > 6);

export default function GardenLoader() {
  return (
    <div id="garden-loader" aria-hidden>
      <div className="loader-glow" />
      <div className="loader-fly">
        <svg viewBox="0 0 13 9" className="loader-bf" shapeRendering="crispEdges">
          <path className="loader-wing loader-wing-l" d={LEFT} />
          <path d={BODY} />
          <path className="loader-wing loader-wing-r" d={RIGHT} />
        </svg>
      </div>
      <div className="loader-trail">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <p className="loader-text">Opening the garden</p>
    </div>
  );
}
