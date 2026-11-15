"use client";

import { useEffect } from "react";

const STAR =
  '<svg viewBox="0 0 24 24"><path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z"/></svg>';
const COLORS = ["#b9379d", "#e3a88a", "#a9b6f0", "#4f9a78", "#711e7b"];

/**
 * One pointer listener for the whole page:
 *
 *  - writes --px / --py (-1…1 from the viewport centre) on <html>, which
 *    `.px` elements read with their own --depth to drift in parallax;
 *  - drops a short trail of four-point sparkles behind a mouse cursor.
 *
 * Both are skipped for touch input and for reduced motion.
 */
export default function PointerFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    let raf = 0;
    let x = 0;
    let y = 0;
    let last = 0;
    let lastX = 0;
    let lastY = 0;
    let live = 0;

    const spawn = (cx: number, cy: number) => {
      if (live > 18) return;
      const s = document.createElement("span");
      s.className = "trail-star";
      s.innerHTML = STAR;
      const size = 8 + Math.random() * 10;
      s.style.cssText = `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;color:${
        COLORS[(Math.random() * COLORS.length) | 0]
      };--rot:${(Math.random() * 180) | 0}deg;--dx:${(Math.random() - 0.5) * 30}px`;
      document.body.appendChild(s);
      live++;
      s.addEventListener("animationend", () => {
        s.remove();
        live--;
      });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          root.style.setProperty("--px", ((x / window.innerWidth) * 2 - 1).toFixed(3));
          root.style.setProperty("--py", ((y / window.innerHeight) * 2 - 1).toFixed(3));
        });
      }
      const now = performance.now();
      const moved = Math.hypot(x - lastX, y - lastY);
      if (now - last > 45 && moved > 14) {
        last = now;
        lastX = x;
        lastY = y;
        spawn(x, y);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
