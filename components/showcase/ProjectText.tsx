import type { CSSProperties, ReactNode } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A project's words, set straight on its backdrop — no card. Colours come
 * from the .on-dark / .on-light tone the slide puts around it. Brands,
 * videos and UI/UX all read the same way: index and meta, title, tagline,
 * brief, role, tools and palette, then the actions.
 */
export default function ProjectText({
  n,
  total,
  meta,
  title,
  tagline,
  body,
  roles = [],
  tools = [],
  toolsLabel = "Tools",
  palette = [],
  clamp = false,
  heading: Heading = "h3",
  actions,
}: {
  n?: number;
  total?: number;
  meta: string[];
  title: string;
  tagline?: string;
  body: string;
  roles?: string[];
  tools?: string[];
  toolsLabel?: string;
  palette?: string[];
  clamp?: boolean;
  heading?: "h2" | "h3";
  actions?: ReactNode;
}) {
  const head = [n !== undefined && total !== undefined ? `${pad(n)} / ${pad(total)}` : "", ...meta].filter(Boolean);
  return (
    <div className="max-w-[34rem]">
      <p className="type-pixel flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-[var(--t-muted)]">
        {head.map((m, i) => (
          <span key={m} className="flex items-center gap-2.5">
            {i > 0 && <span aria-hidden className="opacity-60">/</span>}
            {m}
          </span>
        ))}
      </p>
      <Heading className="type-display mt-4 text-5xl text-[var(--t-title)] sm:text-6xl xl:text-7xl">{title}</Heading>
      {tagline && <p className="type-display mt-3 text-xl text-[var(--t-accent)] italic sm:text-2xl">{tagline}</p>}
      <p className={`mt-5 text-[15px] leading-relaxed text-[var(--t-body)] ${clamp ? "line-clamp-5" : ""}`}>{body}</p>
      {roles.length > 0 && (
        <p className="hand mt-5 text-[1.4rem] text-[var(--t-accent)]">
          <span aria-hidden>my part — </span>
          <span className="sr-only">Role: </span>
          {roles.join(", ").toLowerCase()}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-3">
        {tools.length > 0 && (
          <p className="type-pixel text-[10px] text-[var(--t-muted)]">
            {toolsLabel} · {tools.join(" · ")}
          </p>
        )}
        {palette.length > 0 && (
          <ul aria-label="Palette" className="flex gap-1.5">
            {palette.map((c) => (
              <li key={c} title={c} className="swatch-dot" style={{ "--sw": c } as CSSProperties} />
            ))}
          </ul>
        )}
      </div>
      {actions && <div className="mt-7 flex flex-wrap items-center gap-5">{actions}</div>}
    </div>
  );
}
