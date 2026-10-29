import type { CSSProperties, ReactNode } from "react";

/**
 * A project's words in the spread's left column, set on the wash: meta
 * label, title (a butterfly perch), italic tagline, brief, palette, "my part"
 * as a ✦ list, then the actions. Colours come from the slide's tone.
 */
export default function SpreadCopy({
  meta,
  title,
  heading: Heading = "h3",
  tagline,
  body,
  palette = [],
  parts = [],
  partsLabel = "My part",
  extra,
  actions,
}: {
  meta: string;
  title: string;
  heading?: "h2" | "h3";
  tagline?: string;
  body: string;
  palette?: string[];
  parts?: string[];
  partsLabel?: string;
  /** A last small line, e.g. the stack. */
  extra?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="sp-copy">
      <p className="sp-meta">{meta}</p>
      <Heading data-perch className={`sp-title ${title.length > 13 ? "sp-title--long" : ""}`}>
        {title}
      </Heading>
      {tagline && <p className="sp-tag">{tagline}</p>}
      <p className="sp-body">{body}</p>
      {palette.length > 0 && (
        <div className="sp-row">
          <span className="sp-label" aria-hidden>
            Palette
          </span>
          <ul className="sp-swatches" aria-label="Palette">
            {palette.map((c) => (
              <li key={c} title={c} style={{ "--sw": c } as CSSProperties} />
            ))}
          </ul>
        </div>
      )}
      {parts.length > 0 && (
        <div className="sp-part">
          <span className="sp-label">{partsLabel}</span>
          <ul className="sp-parts">
            {parts.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}
      {extra}
      {actions && <div className="sp-acts">{actions}</div>}
    </div>
  );
}
