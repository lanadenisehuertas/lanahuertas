"use client";

/*
 * The tools' own tiles (Adobe glyph tiles, Canva and Figma artwork) and their
 * short names. ToolStars draws them as the constellation in About.
 */
import type { CSSProperties } from "react";
import { toolkit } from "@/lib/content";

type Tool = (typeof toolkit)[number];
type ToolId = Tool["id"];

const byId = (id: ToolId) => toolkit.find((t) => t.id === id)!;

/* Canva and Figma are not lettermarks, so they use the real tile artwork. */
const MARKS: Partial<Record<ToolId, string>> = {
  ca: "/logos/canva.webp",
  fg: "/logos/figma.webp",
};

/** Short names for captions under the tiles. */
export const SHORT_NAME: Record<ToolId, string> = {
  ps: "Photoshop",
  ai: "Illustrator",
  pr: "Premiere Pro",
  ae: "After Effects",
  ca: "Canva",
  fg: "Figma",
  py: "Python",
  js: "JavaScript",
};

/**
 * The app's own tile: a rounded square on the product's dark ground. Adobe's
 * apps brand themselves with a two-letter glyph in a heavy grotesk and a rim
 * in the glyph colour, so for those the glyph is the logo; Canva and Figma
 * fill the tile edge to edge with their real artwork.
 */
export function ToolTile({ id, className = "", label = true }: { id: ToolId; className?: string; label?: boolean }) {
  const tool = byId(id);
  const mark = MARKS[id];
  return (
    <span
      role={label ? "img" : undefined}
      aria-label={label ? tool.name : undefined}
      aria-hidden={label ? undefined : true}
      className={`tool-tile ${className}`}
      data-tool={id}
      style={{ "--tile-bg": tool.bg, "--tile-fg": tool.fg } as CSSProperties}
    >
      {mark ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={mark} alt="" aria-hidden width={192} height={192} loading="lazy" decoding="async" />
      ) : (
        // The glyph is drawn from data-glyph in CSS: it is the app's logo, not
        // text, so it must not compete with the button's spoken name.
        <span className="tool-tile-glyph" data-glyph={tool.label} />
      )}
    </span>
  );
}
