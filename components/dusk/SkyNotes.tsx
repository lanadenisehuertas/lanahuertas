"use client";

import { useEffect, useRef } from "react";
import { playNextNote } from "@/lib/dusk/skyTune";

/* Clicks on these place no star: anything you can read, press or look at. */
const SKIP =
  "a,button,input,textarea,select,label,form,img,picture,video,iframe,p,h1,h2,h3,h4,li,dt,dd,figure,[role=tab],.pearl-card,.tb,.morph-name,.dk-obj,.dk-portal,[data-nosky]";

/**
 * The constellation you draw on the sky: click empty sky in a section for a
 * star joined to the last one, and each star plays the next note of the
 * page's tune (lib/dusk/skyTune.ts), like pressing one key at a time. Put
 * one inside any positioned section; it listens on its parent. `maxY` keeps
 * stars above a floor, as a fraction of the section's height.
 */
export default function SkyNotes({ skip = "", maxY = 1 }: { skip?: string; maxY?: number }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const lines = svg.current,
      host = lines?.parentElement;
    if (!lines || !host) return;
    const sel = skip ? `${SKIP},${skip}` : SKIP;
    const placed: [number, number, HTMLElement, SVGLineElement | null][] = [];
    let lastAt = 0;
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest(sel) || host.hasAttribute("data-compose")) return;
      const b = host.getBoundingClientRect(),
        x = e.clientX - b.left,
        y = e.clientY - b.top;
      if (y > host.clientHeight * maxY) return;
      const st = document.createElement("div");
      st.className = "dk-ustar";
      st.setAttribute("aria-hidden", "true");
      st.style.left = `${x}px`;
      st.style.top = `${y}px`;
      host.appendChild(st);
      // join to the last star unless it was placed long ago
      const now = performance.now(),
        prev = now - lastAt < 20000 ? placed[placed.length - 1] : undefined;
      lastAt = now;
      let line: SVGLineElement | null = null;
      if (prev) {
        line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(prev[0]));
        line.setAttribute("y1", String(prev[1]));
        line.setAttribute("x2", String(x));
        line.setAttribute("y2", String(y));
        lines.appendChild(line);
      }
      placed.push([x, y, st, line]);
      if (placed.length > 9) {
        const old = placed.shift();
        old?.[2].remove();
        placed[0]?.[3]?.remove();
        if (placed[0]) placed[0][3] = null;
      }
      playNextNote();
      host.dispatchEvent(new CustomEvent("skynote"));
    };
    host.addEventListener("click", onClick);
    return () => {
      host.removeEventListener("click", onClick);
      placed.forEach((p) => {
        p[2].remove();
        p[3]?.remove();
      });
    };
  }, [skip, maxY]);
  return <svg ref={svg} aria-hidden className="dk-constel" />;
}
