"use client";

import { useEffect } from "react";

/**
 * One pointer listener for the whole page: it drifts the parallax elements
 * that are on screen. `.px` get their `translate` written directly from
 * their --depth (not inherited, so the SVG inside them never restyles);
 * `.orbit` icons get --px / --py, which their CSS combines with a hover
 * spring. Writing on <html> instead would restyle the whole page every frame.
 * (The cursor sparkle trail is gone: the guide butterfly sheds the sparkles.)
 *
 * Skipped for touch input and for reduced motion.
 */
export default function PointerFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Parallax elements currently on screen, with their depth read once.
    const visible = new Map<HTMLElement, number>();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (!e.isIntersecting) visible.delete(el);
          else if (!visible.has(el)) visible.set(el, parseFloat(getComputedStyle(el).getPropertyValue("--depth")) || 10);
        }),
      { rootMargin: "100px" }
    );
    document.querySelectorAll<HTMLElement>(".px, .orbit").forEach((el) => io.observe(el));

    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const px = (x / window.innerWidth) * 2 - 1;
          const py = (y / window.innerHeight) * 2 - 1;
          visible.forEach((depth, el) => {
            if (el.classList.contains("orbit")) {
              el.style.setProperty("--px", px.toFixed(3));
              el.style.setProperty("--py", py.toFixed(3));
            } else {
              // 0.4px per depth unit, as in the .px rule.
              el.style.translate = `${(px * depth * 0.4).toFixed(1)}px ${(py * depth * 0.4).toFixed(1)}px`;
            }
          });
        });
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
