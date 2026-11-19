"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-rv]` element on the page. When an element
 * scrolls into view it gets `data-in` once, and CSS does the rest (see
 * "reveal on scroll" in globals.css): a short rise and fade, staggered by --d.
 *
 * An attribute, not a class: React owns `className` and rewrites it on any
 * re-render, which would strip a class and hide the element again.
 *
 * A MutationObserver picks up elements mounted later (a new tab, a new slide).
 */
export default function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => (el.dataset.in = ""));
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    const watch = (root: ParentNode) => root.querySelectorAll("[data-rv]:not([data-in])").forEach((el) => io.observe(el));
    watch(document);

    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-rv]:not([data-in])")) io.observe(n);
          watch(n);
        })
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
