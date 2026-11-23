"use client";

import { useEffect } from "react";

const STAR =
  '<svg viewBox="0 0 24 24"><path d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z"/></svg>';
const COLORS = ["#b9379d", "#e3a88a", "#a9b6f0", "#4f9a78", "#711e7b"];
const DRIFT = ":is(.px, .orbit):not([data-idle] *)";

/**
 * One pointer listener for the whole page:
 *
 *  - writes --px / --py (-1…1 from the viewport centre) on every on-screen
 *    `.px` / `.orbit` element, which reads them with its own --depth to
 *    drift in parallax;
 *  - drops a short trail of four-point sparkles behind a mouse cursor.
 *
 * Both are skipped for touch input and for reduced motion.
 */
export default function PointerFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let last = 0;
    let lastX = 0;
    let lastY = 0;
    let live = 0;

    const spawn = (cx: number, cy: number) => {
      if (live > 5) return;
      const s = document.createElement("span");
      s.className = "trail-star";
      s.innerHTML = STAR;
      const size = 6 + Math.random() * 5;
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
          // Written on each drifting element that is on screen, not on
          // <html>: a custom property changed on the root restyles the whole
          // page every frame. Sections off screen ([data-idle]) are skipped.
          const vx = ((x / window.innerWidth) * 2 - 1).toFixed(3);
          const vy = ((y / window.innerHeight) * 2 - 1).toFixed(3);
          document.querySelectorAll<HTMLElement>(DRIFT).forEach((el) => {
            el.style.setProperty("--px", vx);
            el.style.setProperty("--py", vy);
          });
        });
      }
      const now = performance.now();
      const moved = Math.hypot(x - lastX, y - lastY);
      if (now - last > 140 && moved > 48) {
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
