"use client";

import { useEffect, useRef } from "react";
import { Leaf, Blossom, Bellflower, Fern } from "./Botanicals";
import { PixelFlower, PixelArt } from "./Ethereal";

export type FolderTab = {
  id: string;
  label: string;
  accent: keyof typeof folderColor;
};

/*
 * Accent names per tab. No longer rendered, kept so callers still type-check
 * and an accent can come back without touching every section.
 */
export const folderColor = {
  eminence: { dot: "bg-eminence" },
  iris: { dot: "bg-iris" },
  deep: { dot: "bg-lavender" },
  fawn: { dot: "bg-fawn" },
  maize: { dot: "bg-maize" },
} as const;

/**
 * A paper panel with a row of square-cut, numbered mono tabs above it.
 *
 * The name is historical — this used to be a manila folder. The API is the
 * same so every section kept working through the restyle.
 *
 * Switching re-keys the panel so its short fade-up replays.
 */
export default function Folder({
  tabs,
  active,
  onSelect,
  children,
  labelledBy,
}: {
  tabs: FolderTab[];
  active: string;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
  labelledBy?: string;
}) {
  const activeTab = tabs.find((t) => t.id === active) ?? tabs[0];
  const interactive = tabs.length > 1 && onSelect;

  /*
   * Keep the panel you just opened in view. Panels differ a lot in height, so
   * holding the scroll position can drop the reader into the next section.
   * If switching pushes the tab row above the window, pull it back down;
   * anything still on screen is left alone.
   */
  const stripRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const strip = stripRef.current;
    if (!strip) return;

    const top = strip.getBoundingClientRect().top;
    if (top >= 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: window.scrollY + top - 16,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="relative">
      {interactive && (
        <div
          ref={stripRef}
          className="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
        >
          {tabs.map((t, i) => {
            const isActive = t.id === active;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                onClick={() => onSelect(t.id)}
                className={`pill type-pixel flex min-h-[40px] shrink-0 items-center gap-2 px-3.5 text-[11px] whitespace-nowrap ${
                  isActive ? "pill-active" : ""
                }`}
              >
                <span className="tabular-nums opacity-60">{String(i + 1).padStart(2, "0")}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <div
        key={activeTab.id}
        id={`panel-${activeTab.id}`}
        role={interactive ? "tabpanel" : undefined}
        aria-labelledby={labelledBy}
        className="glass sheet-in sl-curtain relative isolate rounded-[6px] p-5 text-ink sm:p-8"
      >
        <PixelArt name="lotus" className="absolute right-4 bottom-4 -z-10 w-28 opacity-[0.13] sm:w-36" />
        {children}
      </div>

      {/* Corner sprigs: outside the keyed panel so they stay put across tabs */}
      <div aria-hidden className="pointer-events-none">
        <div className="absolute -top-7 right-6 hidden w-24 sm:block" data-react="leaf">
          <span className="react block">
            <Leaf className="sway w-full -rotate-[160deg]" />
          </span>
        </div>
        <div className="absolute -top-5 right-24 hidden w-9 sm:block" data-react="blossom">
          <span className="react block">
            <Blossom className="w-full" deep />
          </span>
        </div>
        <div className="absolute -top-9 right-36 hidden w-5 sm:block" data-react="pixel">
          <span className="react block">
            <PixelFlower className="w-full" fill="#a9b6f0" />
          </span>
        </div>
        <div className="absolute -bottom-6 -left-4 w-10 sm:-left-7 sm:w-12" data-react="leaf">
          <span className="react block">
            <Fern className="sway w-full -rotate-[8deg]" />
          </span>
        </div>
        <div className="absolute -bottom-4 left-4 w-9 sm:left-3 sm:w-11" data-react="bell">
          <span className="react block">
            <Bellflower className="sway w-full rotate-[6deg]" />
          </span>
        </div>
      </div>
    </div>
  );
}
