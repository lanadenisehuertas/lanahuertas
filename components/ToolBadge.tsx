import { toolkit } from "@/lib/content";
import ToolMark, { HAS_MARK } from "./ToolMark";

type Tool = (typeof toolkit)[number];

/**
 * App-icon style badge: rounded square, the product's own dark ground, and its
 * mark on top.
 *
 * The Adobe apps brand themselves as two-letter glyphs, so for those the glyph
 * *is* the logo. Canva and Figma do not, so those two use the real artwork (see
 * `ToolMark`), filling the tile edge to edge with the badge's own rounding
 * clipping it — which is what makes them sit in the same set as the rest
 * rather than looking like stickers.
 */
export default function ToolBadge({
  tool,
  size = 64,
  className = "",
  style,
}: {
  tool: Tool;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const hasMark = HAS_MARK.has(tool.id);

  return (
    <span
      role="img"
      aria-label={tool.name}
      title={tool.name}
      className={`font-display inline-flex items-center justify-center overflow-hidden rounded-[22%] border-2 border-ink/70 font-black select-none ${className}`}
      style={{
        width: size,
        height: size,
        // Artwork covers this for the two marked tools; it stays as the ground
        // underneath so a failed image leaves the right colour, not a hole.
        background: tool.bg,
        color: tool.fg,
        // Quantised: three glyph sizes total, so badge boxes of
        // similar size do not each mint their own font size.
        fontSize: size >= 56 ? 22 : size >= 40 ? 18 : 11,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {hasMark ? <ToolMark id={tool.id} size={size} /> : tool.label}
    </span>
  );
}
