/**
 * Full-width micro rail of contact details, evenly distributed edge to edge.
 *
 * Every reference portfolio runs one of these along the top and bottom of the
 * cover. It does two jobs at once: puts the contact details somewhere a viewer
 * will look without a CTA shouting at them, and gives the composition a
 * measured edge so the display type has something to sit against.
 *
 * These are real links, not decoration — so unlike the corner marginalia this
 * is not aria-hidden.
 */
export default function EdgeRail({
  items,
  className = "",
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 border-maize/15 ${className}`}
    >
      {items.map((it) =>
        it.href ? (
          <a
            key={it.label}
            href={it.href}
            target={it.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            // -my-3 py-3 keeps the tap target at 44px without adding rail height.
            className="type-pixel -my-3 inline-flex min-h-[44px] items-center py-3 text-[10px] text-maize/55 transition-colors duration-200 hover:text-maize"
          >
            {it.label}
          </a>
        ) : (
          <span key={it.label} className="type-pixel text-[10px] text-maize/40">
            {it.label}
          </span>
        )
      )}
    </div>
  );
}
