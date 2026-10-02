import type { CSSProperties } from "react";

/**
 * Section header, after flim.ai: a mono index row on a hairline that draws in
 * as it scrolls into view, then one large tight headline wiping up from a mask.
 */
export default function SectionTitle({
  lead,
  accent,
  index,
  note,
  id,
  className = "",
}: {
  lead: string;
  accent: string;
  index: string;
  note?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={`mb-8 sm:mb-10 ${className}`}>
      <span data-rv="rule" className="block h-px bg-maize/25" />
      <div
        data-rv
        style={{ "--d": "120ms" } as CSSProperties}
        className="type-pixel flex items-center justify-between gap-4 pt-3 text-[11px] text-maize/60"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-fawn">▸</span>({index}) {lead} {accent}
        </span>
        {note && <span>{note}</span>}
      </div>
      <h2
        id={id}
        data-rv="mask"
        style={{ "--d": "180ms" } as CSSProperties}
        className="type-display mt-6 text-[13vw] text-maize sm:text-8xl"
      >
        {lead} <span className="text-fawn">{accent}</span>
      </h2>
    </header>
  );
}
