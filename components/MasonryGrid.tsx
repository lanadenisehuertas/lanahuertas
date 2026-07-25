"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const ROW = 4; // px per implicit grid row
const GAP = 6; // px gutter — tight on purpose

/**
 * Mosaic grid: items keep their true aspect ratio (no cropping) AND can span
 * different column widths, which plain CSS columns cannot do.
 *
 * Each child declares how many of the 12 columns it wants via `data-span`.
 * After layout, we measure real rendered heights and convert them into
 * `grid-row: span N` over a 4px row unit, which packs the columns tightly with
 * no ragged gaps. This is the standard grid-masonry technique; it needs the
 * measure pass because row spans depend on rendered width.
 */
export default function MasonryGrid({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  const measure = useCallback(() => {
    const grid = ref.current;
    if (!grid) return;
    const items = Array.from(grid.children) as HTMLElement[];
    for (const item of items) {
      // Measure the content, not the item — the item's own height is what we set.
      const inner = item.firstElementChild as HTMLElement | null;
      const h = inner ? inner.getBoundingClientRect().height : 0;
      if (!h) continue;
      const span = Math.max(1, Math.round((h + GAP) / (ROW + GAP)));
      item.style.gridRowEnd = `span ${span}`;
    }
  }, []);

  useEffect(() => {
    measure();

    const grid = ref.current;
    if (!grid) return;

    // Re-measure when anything resizes: viewport, fonts, or images decoding.
    const ro = new ResizeObserver(() => measure());
    ro.observe(grid);
    Array.from(grid.children).forEach((c) => {
      const inner = c.firstElementChild;
      if (inner) ro.observe(inner);
    });

    // Images change height the moment they decode.
    const imgs = Array.from(grid.querySelectorAll("img"));
    const onLoad = () => measure();
    imgs.forEach((i) => {
      if (!i.complete) i.addEventListener("load", onLoad);
    });

    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      imgs.forEach((i) => i.removeEventListener("load", onLoad));
      window.removeEventListener("resize", measure);
    };
  }, [measure, children]);

  // Nudge a re-measure once fonts settle.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) {
        measure();
        force((n) => n + 1);
      }
    });
    return () => {
      alive = false;
    };
  }, [measure]);

  return (
    <div
      ref={ref}
      className="mosaic grid grid-flow-row-dense grid-cols-4 sm:grid-cols-6 md:grid-cols-12"
      style={{ gap: GAP, gridAutoRows: `${ROW}px` }}
    >
      {children}
    </div>
  );
}
