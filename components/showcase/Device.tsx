"use client";

import { useRef, useState } from "react";

export type Screen = {
  label: string;
  /** Full-size file. */
  src: string;
  /** Smaller copy for narrow slots, if there is one. */
  sm?: string;
  w: number;
  h: number;
};

/**
 * A thin outline around real screenshots: a browser (2px ink border, a small
 * bar whose tabs switch pages) for desktop screens, a phone for genuinely
 * mobile ones. The screen scrolls inside the outline.
 */
export default function Device({
  kind,
  screens,
  title,
  url,
  eager = false,
}: {
  kind: "browser" | "phone";
  screens: Screen[];
  /** Product name, for labels. */
  title: string;
  url?: string;
  eager?: boolean;
}) {
  const [i, setI] = useState(0);
  const screen = useRef<HTMLDivElement>(null);
  const s = screens[i];

  const img = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      key={s.src}
      src={s.sm ?? s.src}
      srcSet={s.sm ? `${s.sm} 960w, ${s.src} ${s.w}w` : undefined}
      sizes={s.sm ? "(min-width: 768px) 60vw, 92vw" : undefined}
      width={s.w}
      height={s.h}
      alt={`${title}: ${s.label}`}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
    />
  );

  if (kind === "phone") {
    return (
      <div className="dev-phone">
        <div ref={screen} className="dev-screen" tabIndex={0} aria-label={`${title}: ${s.label}, scrollable`}>
          {img}
        </div>
      </div>
    );
  }

  return (
    <div className="dev-browser">
      <div className="dev-bar">
        <span aria-hidden className="dev-dots">
          <i />
          <i />
          <i />
        </span>
        {screens.length > 1 ? (
          <div className="dev-tabs" role="group" aria-label={`${title} pages`}>
            {screens.map((x, k) => (
              <button
                key={x.src}
                type="button"
                aria-pressed={k === i}
                className="dev-tab"
                onClick={() => {
                  setI(k);
                  if (screen.current) screen.current.scrollTop = 0;
                }}
              >
                {x.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="dev-tabs">
            <span className="dev-tab" aria-current="page">
              {s.label}
            </span>
          </span>
        )}
        {url && <span className="dev-url">{url}</span>}
      </div>
      <div ref={screen} className="dev-screen" tabIndex={0} aria-label={`${title}: ${s.label}, scrollable`}>
        {img}
      </div>
    </div>
  );
}
