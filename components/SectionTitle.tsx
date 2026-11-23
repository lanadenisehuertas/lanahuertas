import type { CSSProperties } from "react";
import { Sparkle4 } from "./Botanicals";
import { Orbit, PixelArt, type PixelArtName } from "./Ethereal";

/**
 * Section header, after flim.ai: one large tight headline wiping up from a mask,
 * with an optional mono note above it.
 */
export default function SectionTitle({
  lead,
  accent,
  note,
  id,
  className = "",
  ornament = "ornament",
}: {
  lead: string;
  accent: string;
  /** Kept so callers need not change; the numbered row is no longer drawn. */
  index?: string;
  note?: string;
  id?: string;
  className?: string;
  /** The dot-matrix ornament set in the right margin. */
  ornament?: PixelArtName;
}) {
  return (
    <header className={`relative mb-10 ${className}`}>
      <PixelArt
        name={ornament}
        className={`absolute right-0 hidden w-auto opacity-50 md:block ${
          ornament === "flourish" ? "top-16 h-8 lg:h-10" : ornament === "dotButterfly" ? "top-8 h-24 lg:h-28" : "top-2 h-36 lg:h-44"
        }`}
      />
      {note && (
        <p data-rv className="type-pixel text-[14px] text-ink/70">
          {note}
        </p>
      )}
      <h2
        id={id}
        aria-label={`${lead} ${accent}`}
        className="group type-display relative mt-2 inline-block text-[15vw] text-iris sm:text-7xl lg:text-8xl"
      >
        <Chars text={lead} />{" "}
        <span className="text-lavender italic">
          <Chars text={accent} offset={lead.length + 1} />
        </span>
        <Sparkle4 className="absolute -top-2 -right-9 h-7 w-7 text-sky transition-transform duration-700 ease-out group-hover:rotate-[180deg] group-hover:scale-125 sm:-right-12 sm:h-10 sm:w-10" />
        {/* One ring off the accent word */}
        <span aria-hidden className="pointer-events-none absolute -top-6 -right-28 hidden w-36 sm:block lg:-right-36 lg:w-44">
          <Orbit className="w-full -rotate-[12deg] opacity-70" stroke="#a9b6f0" dur="18s" />
        </span>
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
