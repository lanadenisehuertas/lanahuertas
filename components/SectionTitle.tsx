import type { CSSProperties } from "react";
import { Sparkle4 } from "./Botanicals";

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
      <div
        data-rv
        style={{ "--d": "120ms" } as CSSProperties}
        className="type-pixel flex items-center justify-between gap-4 text-[11px] text-ink/55"
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className="text-lavender">✦</span>
          {index}
        </span>
        {note && <span>{note}</span>}
      </div>
      <h2
        id={id}
        aria-label={`${lead} ${accent}`}
        className="group type-display relative mt-6 inline-block text-[15vw] text-iris sm:text-8xl lg:text-9xl"
      >
        <Chars text={lead} />{" "}
        <span className="text-lavender italic">
          <Chars text={accent} offset={lead.length + 1} />
        </span>
        <Sparkle4 className="absolute -top-2 -right-9 h-7 w-7 text-sky transition-transform duration-700 ease-out group-hover:rotate-[180deg] group-hover:scale-125 sm:-right-12 sm:h-10 sm:w-10" />
      </h2>
    </header>
  );
}

/** Letters as spans so each can rise on its own slice of the scroll. */
function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <span aria-hidden>
      {Array.from(text).map((ch, i) => (
        <span key={i} className="sl-char" style={{ "--i": offset + i } as CSSProperties}>
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}
