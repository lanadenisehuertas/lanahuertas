/**
 * Logo artwork for the two tools in the kit that are not lettermarks.
 *
 * The Adobe apps brand themselves as two-letter glyphs, so for those the glyph
 * in `ToolBadge` *is* the logo. Canva and Figma do not, and a "Ca" or "Fg" tile
 * is a stand-in nobody recognises — so they use the real artwork, supplied by
 * Lana and served from `public/logos/`.
 *
 * Both files are the full tile rather than a floating glyph, so they fill the
 * badge edge to edge and the badge's own rounding clips them. Figma's export
 * carried a transparent margin (its artwork sat inside 195px of nothing on a
 * 980px canvas); that was cropped away, otherwise the mark would have floated
 * small in the middle of its own tile.
 *
 * 192px square covers the largest badge on the page at 3x.
 */

const MARKS: Record<string, { src: string; w: number; h: number }> = {
  ca: { src: "/logos/canva.webp", w: 192, h: 192 },
  fg: { src: "/logos/figma.webp", w: 192, h: 192 },
};

export const HAS_MARK = new Set(Object.keys(MARKS));

export default function ToolMark({ id, size }: { id: string; size: number }) {
  const mark = MARKS[id];
  if (!mark) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={mark.src}
      alt=""
      width={mark.w}
      height={mark.h}
      // The badge is already role="img" with a label, so this must not be
      // announced a second time.
      aria-hidden
      draggable={false}
      className="block h-full w-full object-cover select-none"
      style={{ width: size, height: size }}
    />
  );
}
