/** A pen-drawn arrow: a slightly wavering shaft and an open head. */
export function InkArrow({ dir = "right", className = "" }: { dir?: "left" | "right" | "up"; className?: string }) {
  const rotate = dir === "left" ? "rotate(180 24 12)" : dir === "up" ? "rotate(-90 24 12)" : undefined;
  return (
    <svg viewBox="0 0 48 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <g transform={rotate}>
        <path d="M6 13c9-1.5 18 .5 28-1 3-.4 5-.6 7-.8" />
        <path d="M33 5.5c2.6 2.4 5.4 4.6 8.4 6.3-3 1.6-6 3.7-8.8 6.4" />
      </g>
    </svg>
  );
}

/** A pen-drawn play mark: a soft triangle, its first stroke overshooting. */
export function InkPlay({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
      <path d="M8.6 5.2c4 2.1 7.4 4.3 10.3 6.6-3 2.4-6.4 4.7-10.3 6.9-.3-4.6-.3-9 0-13.5Z" />
    </svg>
  );
}
