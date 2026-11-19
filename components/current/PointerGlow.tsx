"use client";

import { useEffect, useRef } from "react";

/**
 * A soft light that follows the mouse across the dark, like a lamp held over
 * the page, and a few sparks that fall from it when it moves fast. It sits in
 * the fixed scene behind the content, so it lights the ground and never the
 * text. The native cursor is untouched.
 *
 * One element moved by transform, written at most once per frame and only
 * while the mouse moves; the sparks are a small pool of elements reused in
 * turn. Mouse only: touch, reduced motion and "pause motion" get none of it.
 */
export default function PointerGlow() {
  const glow = useRef<HTMLDivElement>(null);
  const pool = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = glow.current,
      box = pool.current;
    if (!el || !box) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sparks = [...box.children] as HTMLElement[];
    let x = 0,
      y = 0,
      lx = 0,
      ly = 0,
      frame = 0,
      next = 0,
      lastSpark = 0;
    const draw = () => {
      frame = 0;
      if (document.documentElement.hasAttribute("data-still")) return;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      el.style.opacity = "1";
      // a quick stroke of the mouse sheds a spark, at most one every 70ms
      const speed = Math.hypot(x - lx, y - ly),
        now = performance.now();
      lx = x;
      ly = y;
      if (speed > 26 && now - lastSpark > 70) {
        lastSpark = now;
        const s = sparks[next++ % sparks.length];
        s.style.left = `${x + (Math.random() - 0.5) * 30}px`;
        s.style.top = `${y + (Math.random() - 0.5) * 30}px`;
        s.style.setProperty("--dx", `${(Math.random() - 0.5) * 40}px`);
        s.style.setProperty("--s", (0.5 + Math.random() * 0.9).toFixed(2));
        s.removeAttribute("data-on");
        void s.offsetWidth;
        s.setAttribute("data-on", "");
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onLeave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={glow} aria-hidden className="ptr-glow" />
      <div ref={pool} aria-hidden className="ptr-sparks">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="ptr-spark" />
        ))}
      </div>
    </>
  );
}
