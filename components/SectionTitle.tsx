import type { CSSProperties } from "react";
import { Sparkle4, Blossom } from "./Botanicals";
import { Star5, Orbit, PixelArt, type PixelArtName } from "./Ethereal";

/**
 * Section opener: the index, then one large headline rising letter by
 * letter. Sub-pages render it as their h1.
 */
export default function SectionTitle({
  lead,
  accent,
  index,
  note,
  id,
  className = "",
  ornament = "ornament",
  as: Heading = "h2",
}: {
  lead: string;
  accent: string;
  index: string;
  note?: string;
  id?: string;
  className?: string;
  /** The dot-matrix ornament set in the right margin. */
  ornament?: PixelArtName;
  /** h1 on a page whose opener this is. */
  as?: "h1" | "h2";
}) {
  return (
    <header className={`relative isolate mb-8 sm:mb-10 ${className}`}>
      {/* A dot screen fading out behind the title, like light through a print. */}
      <span aria-hidden className="halftone pointer-events-none absolute -top-10 -left-16 -z-10 h-[150%] w-[min(760px,90vw)] opacity-[0.22]" />
      <PixelArt
        name={ornament}
        className={`absolute right-0 hidden w-auto opacity-50 md:block ${
          ornament === "flourish" ? "top-16 h-8 lg:h-10" : ornament === "dotButterfly" ? "top-8 h-24 lg:h-28" : "top-2 h-36 lg:h-44"
        }`}
      />
      <div
        data-rv
        style={{ "--d": "120ms" } as CSSProperties}
        className="flex items-end justify-between gap-4"
      >
        <span className="idx">{index}</span>
        {note && <span className="hand text-[1.35rem]">{note}</span>}
      </div>
      <Heading
        id={id}
        aria-label={`${lead} ${accent}`}
        className="group type-display relative mt-6 inline-block text-[15vw] text-iris sm:text-8xl lg:text-9xl"
      >
        <Chars text={lead} />{" "}
        <span className="glow text-lavender italic">
          <Chars text={accent} offset={lead.length + 1} />
        </span>
        <Sparkle4 className="absolute -top-2 -right-9 h-7 w-7 text-sky transition-transform duration-700 ease-out group-hover:rotate-[180deg] group-hover:scale-125 sm:-right-12 sm:h-10 sm:w-10" />
        {/* A small constellation off the accent word: orbit, star, bud */}
        <span aria-hidden className="pointer-events-none absolute -top-6 -right-28 hidden w-36 sm:block lg:-right-36 lg:w-44">
          <Orbit className="w-full -rotate-[12deg] opacity-70" stroke="#a9b6f0" dur="18s" />
        </span>
        <Star5 className="twinkle absolute top-[38%] -right-16 hidden h-3 w-3 text-blush sm:block lg:-right-20" />
        <Blossom className="spin-slow absolute -bottom-1 -right-6 hidden h-6 w-6 sm:block sm:-right-8" />
      </Heading>
    </header>
  );
}

/** Letters as spans so each can rise on its own slice of the scroll. Each
    word is held together: inline-block letters would otherwise let a narrow
    screen break the line mid-word ("pub / mats"). */
function Chars({ text, offset = 0 }: { text: string; offset?: number }) {
  // Each word with the --i of its first letter (the space counts as one).
  const words = text.split(" ").map((word, w, all) => ({
    word,
    at: offset + all.slice(0, w).reduce((n, prev) => n + prev.length + 1, 0),
  }));
  return (
    <span aria-hidden>
      {words.map(({ word, at }, w) => (
        <span key={w}>
          {w > 0 && " "}
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((ch, k) => (
              <span key={k} className="sl-char" style={{ "--i": at + k } as CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}
