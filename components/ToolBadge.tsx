import { toolkit } from "@/lib/content";

type Tool = (typeof toolkit)[number];

/**
 * App-icon style badge: rounded square, product's own dark ground, two-letter
 * mark in its accent colour. A nominative reference to the tool, not a copy of
 * anyone's logo artwork.
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
  return (
    <span
      role="img"
      aria-label={tool.name}
      title={tool.name}
      className={`font-display inline-flex items-center justify-center rounded-[22%] border-2 border-ink/70 font-black select-none ${className}`}
      style={{
        width: size,
        height: size,
        background: tool.bg,
        color: tool.fg,
        fontSize: size * 0.38,
        letterSpacing: "-0.02em",
        ...style,
      }}
    >
      {tool.label}
    </span>
  );
}
