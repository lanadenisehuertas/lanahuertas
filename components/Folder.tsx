"use client";

import { useEffect, useRef } from "react";

export type FolderTab = {
  id: string;
  label: string;
  accent: keyof typeof folderColor;
};

/*
 * Every pairing below clears 4.5:1. Sunset Lavender is deliberately absent —
 * ink on lavender measures 3.66:1, so it is never used behind a label.
 */
export const folderColor = {
  eminence: { bg: "bg-eminence", text: "text-maize" }, //  7.00:1
  iris: { bg: "bg-iris", text: "text-maize" }, //  9.24:1
  deep: { bg: "bg-deep", text: "text-maize" }, // 11.74:1
  fawn: { bg: "bg-fawn", text: "text-ink" }, //  9.14:1
  maize: { bg: "bg-maize", text: "text-ink" }, // 13.58:1
} as const;

/**
 * A manila folder. Tabs are rounded rectangles overlapping along one top edge.
 *
 * Switching re-keys the panel so React remounts it and the placement animation
 * replays. The direction is derived from the tab's index, so pressing a
 * different tab brings its folder in from a different side rather than
 * repeating one motion.
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
  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.id === active)
  );
  const activeTab = tabs[activeIndex] ?? tabs[0];
  const body = folderColor[activeTab.accent];
  const interactive = tabs.length > 1 && onSelect;

  // 4 directions, cycled by index: bottom-right, bottom-left, top-right, top-left.
  const direction = activeIndex % 4;

  /*
   * Keep the folder you just opened in view.
   *
   * Holding the scroll position fixed across a switch sounds like the safe
   * behaviour, and it was the original one — but panels differ enormously in
   * height (22 posters vs 2 case studies is a 673px drop). Hold the scroll and
   * the content shrinks out from under the reader instead, landing them in the
   * *next* section, looking at something they did not ask for.
   *
   * So the invariant is the tab strip, not the scrollport: if switching pushes
   * the strip above the top of the window, pull it back down. Anything still
   * on screen is left alone, because scrolling a reader who can already see the
   * panel is its own kind of rude.
   */
  const stripRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // never scroll on mount — the page has its own starting position
    }
    const strip = stripRef.current;
    if (!strip) return;

    const top = strip.getBoundingClientRect().top;
    if (top >= 0) return; // still visible; leave the reader where they are

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: window.scrollY + top - 16,
      behavior: reduced ? "auto" : "smooth",
    });
  }, [active]);

  return (
    <div className="relative">
      {/*
       * Scrollable tab strip. Four tabs no longer fit 375px, and wrapping puts a
       * second row of tabs through the panel edge. `pb-[9px]` makes room for the
       * inactive tabs' downward offset, which would otherwise overflow the
       * scroll container and clip.
       */}
      <div
        ref={stripRef}
        className="flex items-end overflow-x-auto pb-[9px] pl-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role={interactive ? "tablist" : undefined}
      >
        {tabs.map((t, i) => {
          const isActive = t.id === active;
          const c = folderColor[t.accent];
          const shared =
            "font-display paper relative flex min-h-[46px] shrink-0 items-center rounded-t-xl border-2 border-b-0 border-ink px-5 text-[12px] font-black tracking-[-0.01em] whitespace-nowrap lowercase sm:text-sm";

          const style = {
            marginLeft: i === 0 ? 0 : "-10px",
            zIndex: isActive ? 40 : 10 + i,
            // Inactive tabs sit lower AND further back. The brightness drop is
            // what actually reads at a glance — position alone was too subtle
            // once every tab carried its own accent colour.
            transform: isActive ? "translateY(0)" : "translateY(9px) scale(0.97)",
          } as const;

          if (!interactive) {
            return (
              <span key={t.id} style={style} className={`${shared} ${c.bg} ${c.text}`}>
                {t.label}
              </span>
            );
          }

          return (
            <button
              // Key includes active state so the tab remounts when it becomes
              // active, replaying `tab-in`. Without this the animation only
              // ever runs on first render.
              key={`${t.id}-${isActive}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${t.id}`}
              onClick={() => onSelect(t.id)}
              style={style}
              className={`${shared} press-sm cursor-pointer ${c.bg} ${c.text} ${
                isActive
                  ? "tab-in"
                  : "brightness-[0.62] saturate-[0.75] transition-[transform,filter] duration-300 ease-out hover:brightness-90 hover:saturate-100"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* The stack the new sheet lands on. Decorative only. */}
      <div className="relative -mt-[9px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-y-2.5 rotate-[0.5deg] rounded-2xl border-2 border-ink/35 bg-iris/50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-y-1 -rotate-[0.3deg] rounded-2xl border-2 border-ink/50 bg-iris/75"
        />

        <div
          key={activeTab.id}
          id={`panel-${activeTab.id}`}
          role={interactive ? "tabpanel" : undefined}
          aria-labelledby={labelledBy}
          className={`place-${direction} paper relative z-30 rounded-2xl rounded-tl-none border-2 border-ink p-4 shadow-hard sm:p-5 ${body.bg}`}
        >
          <div className="paper-content paper relative rounded-xl border-2 border-ink bg-maize p-6 text-ink sm:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
