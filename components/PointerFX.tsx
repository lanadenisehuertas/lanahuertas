"use client";

import { useEffect } from "react";

const STAR =
  '<svg viewBox="0 0 24 24"><path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z"/></svg>';
const COLORS = ["#b9379d", "#e3a88a", "#a9b6f0", "#4f9a78", "#711e7b"];

/**
 * One pointer listener for the whole page:
 *
 *  - writes --px / --py (-1…1 from the viewport centre) on the parallax
 *    elements (`.px`, `.orbit`) that are on screen, which read them with
 *    their own --depth to drift. Writing on <html> instead restyles the
 *    whole page every frame; on-screen elements only cost a few ms;
 *  - drops a short trail of four-point sparkles behind a mouse cursor.
 *
 * Both are skipped for touch input and for reduced motion.
 */
export default function PointerFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Parallax elements currently on screen.
    const visible = new Set<HTMLElement>();
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement))),
      { rootMargin: "100px" }
    );
    document.querySelectorAll<HTMLElement>(".px, .orbit").forEach((el) => io.observe(el));

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
          const px = ((x / window.innerWidth) * 2 - 1).toFixed(3);
          const py = ((y / window.innerHeight) * 2 - 1).toFixed(3);
          visible.forEach((el) => {
            el.style.setProperty("--px", px);
            el.style.setProperty("--py", py);
          });
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
      io.disconnect();
    };
  }, []);

  return null;
}
