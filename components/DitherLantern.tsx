"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

// Tinted copies of the white pixel art, so they read on the pale sky; the heart last.
const ART = ["/art/pixel-daisy-lilac.svg", "/art/pixel-sparkle-pink.svg", "/art/pixel-sparkle-violet.svg", "/art/pixel-daisy.svg", "/art/pixel-heart.svg"];
const HEART = ART.length - 1;
const POOL = 12;

/** One lantern: two halftone rings and a slot for pixel flowers. */
function Rings({ fixed }: { fixed?: boolean }) {
  return (
    <div aria-hidden className={`al-root ${fixed ? "al-fixed" : "al-hosted"}`}>
      <div className="al-ring al-ring-wide">
        <div className="al-dots" />
      </div>
      <div className="al-ring al-ring-core">
        <div className="al-dots" />
      </div>
      <div className="al-flowers" />
    </div>
  );
}

/**
 * Dither lantern: a halftone glow that follows the mouse across the sky, and
 * pixel flowers that open where it lingers.
 *
 * It lives behind the page content (z-index -1, above the ground and the dusk),
 * so it only shows where the page is sky — never over art, photos or copy.
 * A section whose sky is its own painted layer (the hero) can host a copy by
 * putting `data-lantern-host` on that layer; the copy is portalled in there.
 *
 * Cost: per frame at most two custom properties per lantern (--mx/--my), read
 * by transforms only. Each ring is a masked window that moves to the pointer
 * while the dot screen inside moves back, so the dots stay put on the page and
 * nothing repaints. Flowers come from a pool of 12 nodes and animate with
 * the Web Animations API (opacity + transform).
 *
 * Mouse only; off for reduced motion and lite mode.
 */
export default function DitherLantern() {
  const pathname = usePathname();
  const fixedRef = useRef<HTMLDivElement>(null);
  const [hosts, setHosts] = useState<HTMLElement[]>([]);
  const [enabled, setEnabled] = useState(false);

  // After the page has painted: find out whether to light up, and where.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const ok =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !document.documentElement.hasAttribute("data-lite");
      setEnabled(ok);
      setHosts(ok ? Array.from(document.querySelectorAll<HTMLElement>("[data-lantern-host]")) : []);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    const fixed = fixedRef.current?.querySelector<HTMLElement>(".al-root");
    if (!enabled || !fixed) return;
    const hosted = hosts
      .map((h) => ({ host: h, root: h.querySelector<HTMLElement>(":scope > .al-root") }))
      .filter((x): x is { host: HTMLElement; root: HTMLElement } => !!x.root);
    const roots = [fixed, ...hosted.map((x) => x.root)];

    // Flower pool: wrappers are placed with transform, the image animates.
    const pool = Array.from({ length: POOL }, () => {
      const wrap = document.createElement("span");
      wrap.className = "al-flower";
      const img = document.createElement("img");
      img.alt = "";
      img.decoding = "async";
      img.draggable = false;
      wrap.appendChild(img);
      return { wrap, img, anim: null as Animation | null };
    });
    let next = 0;

    let x = -1000;
    let y = -1000;
    let px = x;
    let py = y;
    let pt = 0;
    let lastSpawn = 0;
    let raf = 0;
    let lit = false;
    let still = 0;
    let dim = 0;
    let stillCount = 0;

    const setLit = (on: boolean) => {
      if (on === lit) return;
      lit = on;
      roots.forEach((r) => r.classList.toggle("on", on));
    };

    // Which lantern is under the pointer: a host whose box contains it, else the page one.
    const target = () => {
      for (const h of hosted) {
        const r = h.host.getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return { root: h.root, ox: r.left, oy: r.top };
      }
      return { root: fixed, ox: 0, oy: 0 };
    };

    const spawn = () => {
      const now = performance.now();
      if (now - lastSpawn < 240) return;
      lastSpawn = now;
      const f = pool[next];
      next = (next + 1) % POOL;
      const t = target();
      const k = Math.floor(Math.random() * ART.length);
      const size = k === HEART ? 14 + Math.random() * 8 : 22 + Math.random() * 18;
      const a = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 42;
      const fx = x - t.ox + Math.cos(a) * r - size / 2;
      const fy = y - t.oy + Math.sin(a) * r - size / 2;
      if (f.img.getAttribute("src") !== ART[k]) f.img.src = ART[k];
      f.wrap.style.width = `${size}px`;
      f.wrap.style.transform = `translate3d(${fx.toFixed(0)}px, ${fy.toFixed(0)}px, 0)`;
      const slot = t.root.querySelector(".al-flowers");
      if (slot && f.wrap.parentNode !== slot) slot.appendChild(f.wrap);
      f.anim?.cancel();
      const spin = (Math.random() - 0.5) * 50;
      f.anim = f.img.animate(
        [
          { opacity: 0, transform: `scale(0.3) rotate(${spin}deg)` },
          { opacity: 0.95, transform: "scale(1.08) rotate(0deg)", offset: 0.28 },
          { opacity: 0.9, transform: "scale(1) rotate(0deg)", offset: 0.62 },
          { opacity: 0, transform: `scale(0.7) rotate(${-spin / 2}deg)` },
        ],
        { duration: 1400, easing: "ease-out", fill: "both" }
      );
    };

    const frame = () => {
      raf = 0;
      fixed.style.setProperty("--mx", `${x}px`);
      fixed.style.setProperty("--my", `${y}px`);
      for (const h of hosted) {
        const r = h.host.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue;
        h.root.style.setProperty("--mx", `${x - r.left}px`);
        h.root.style.setProperty("--my", `${y - r.top}px`);
      }
    };
    const ask = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    // Lingering: a still pointer keeps sprouting a few flowers, then rests.
    const linger = () => {
      spawn();
      if (++stillCount < 4) still = window.setTimeout(linger, 520);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      const now = e.timeStamp;
      const dt = Math.max(1, now - pt);
      const speed = Math.hypot(x - px, y - py) / dt;
      px = x;
      py = y;
      pt = now;
      setLit(true);
      ask();
      if (speed < 0.3) spawn();
      window.clearTimeout(still);
      window.clearTimeout(dim);
      stillCount = 0;
      still = window.setTimeout(linger, 380);
      dim = window.setTimeout(() => setLit(false), 3200);
    };
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setLit(false);
        window.clearTimeout(still);
      }
    };
    const onScroll = () => {
      if (lit && hosted.length) ask();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(still);
      window.clearTimeout(dim);
      cancelAnimationFrame(raf);
      pool.forEach((f) => {
        f.anim?.cancel();
        f.wrap.remove();
      });
      roots.forEach((r) => r.classList.remove("on"));
    };
  }, [enabled, hosts]);

  if (!enabled) return null;
  return (
    <>
      <div ref={fixedRef} className="contents">
        <Rings fixed />
      </div>
      {hosts.map((h, i) => createPortal(<Rings />, h, `al-${i}`))}
    </>
  );
}
