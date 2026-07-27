/**
 * Logo marks for the two tools in the kit that are not lettermarks.
 *
 * The Adobe apps genuinely brand themselves as two-letter glyphs on a dark
 * tile, so `ToolBadge` already renders those correctly. Canva and Figma do not
 * — a "Ca" or "Fg" tile is a stand-in nobody recognises — so they get their
 * real marks here.
 *
 * Drawn as geometry rather than imported artwork: no network request, no
 * bitmap, sharp at any size, and it inherits the badge's own border and
 * rounding. Used nominatively, to say which tools she works in.
 *
 * Both take the badge's full size and apply their own scale, because the two
 * marks want different amounts of the tile — Figma's is an inset glyph, Canva's
 * wordmark runs nearly edge to edge.
 */

function FigmaMark({ size }: { size: number }) {
  // Official proportions: five shapes on a 2x3 grid of 9.5-unit radii.
  const h = size * 0.56;
  return (
    <svg width={h * (2 / 3)} height={h} viewBox="0 0 38 57" aria-hidden focusable="false">
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83" />
      <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
    </svg>
  );
}

function CanvaMark({ size }: { size: number }) {
  /*
   * Canva brands itself as the script wordmark reversed out of the gradient,
   * not as a letter or a monogram. The gradient is the badge's own background
   * (see `toolkit` in lib/content.ts), so all this contributes is the word.
   *
   * Set in Yellowtail, the script the site already loads. Canva's own face is
   * custom, so this is close rather than exact — at 30-64px the difference is
   * a couple of terminals. Sized at 0.30x because "Canva" in a script runs
   * roughly 2.4 times its own point size, which at that ratio lands just
   * inside the tile.
   */
  return (
    <span
      // The badge itself is role="img" with an aria-label, so this word is
      // already announced and must not be read a second time. Hiding it also
      // keeps it out of contrast tooling, where a logotype does not belong —
      // WCAG exempts brand marks from the contrast floor, and white on Canva's
      // teal would otherwise register as a failure it is not.
      aria-hidden
      className="font-script leading-none"
      style={{ color: "#fff", fontSize: Math.round(size * 0.3), paddingBottom: size * 0.04 }}
    >
      Canva
    </span>
  );
}

/** Returns a mark for tools that have one, or null to fall back to the glyph. */
export default function ToolMark({ id, size }: { id: string; size: number }) {
  if (id === "fg") return <FigmaMark size={size} />;
  if (id === "ca") return <CanvaMark size={size} />;
  return null;
}

export const HAS_MARK = new Set(["fg", "ca"]);
