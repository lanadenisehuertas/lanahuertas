/**
 * The site mark in the nav: a pixel butterfly (Lana's pick over the pearl
 * lotus). One 16-cell silhouette, crisp at any size, its wings shaded from
 * pink at the tips to lavender at the body, a cream body and two antenna
 * pixels. On hover the wings beat once (globals.css, "Masthead").
 */
const SHAPE =
  "M2 3h3v1h1v1h1v2h2V5h1V4h1V3h3v4h-1v1h-1v1h1v3h-2v-1h-1v-1H9v2H7v-2H6v1H5v1H3V9h1V8H3V7H2z";

export default function NavEmblem() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="masthead-mark" shapeRendering="crispEdges">
      <defs>
        <linearGradient id="nm-wing" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ff9ec4" />
          <stop offset="0.42" stopColor="#c9b8ff" />
          <stop offset="0.58" stopColor="#c9b8ff" />
          <stop offset="1" stopColor="#ff9ec4" />
        </linearGradient>
      </defs>
      <g className="nm-wings">
        <path d={SHAPE} fill="url(#nm-wing)" />
        {/* lit pixels on the upper wings, a darker pixel at each lower tip */}
        <path d="M3 4h1v1H3zM12 4h1v1h-1zM4 5h1v1H4zM11 5h1v1h-1z" fill="#ffe8f1" />
        <path d="M4 10h1v1H4zM11 10h1v1h-1z" fill="#9a6fd8" />
      </g>
      {/* body and antennae */}
      <path d="M7 5h2v6H7z" fill="#fdf3e1" />
      <path className="nm-ant" d="M6 3h1v1H6zM9 3h1v1H9zM5 2h1v1H5zM10 2h1v1h-1z" fill="#ffd98a" />
    </svg>
  );
}
