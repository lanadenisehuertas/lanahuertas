"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-rv]` element on the page. When an element
 * scrolls into view it gets `data-in`, and the CSS variant does the rest (see
 * "Scroll reveal" in globals.css).
 *
 * An attribute, not a class: React owns `className` and rewrites it on any
 * re-render that touches it, which silently stripped a `.in` class and left
 * the element invisible. React never touches attributes it did not set.
 *
 * A MutationObserver picks up elements mounted later — switching a tab
 * renders new tiles, and they should animate in too.
 */
export default function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => (el.dataset.in = ""));
      return;
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const watch = (root: ParentNode) =>
      root.querySelectorAll("[data-rv]:not([data-in])").forEach((el) => io.observe(el));

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

    // Sections well off screen pause their ambient loops (see [data-idle]).
    const idle = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) delete el.dataset.idle;
          else el.dataset.idle = "";
        }),
      { rootMargin: "200px 0px" }
    );
    document.querySelectorAll("main > section").forEach((s) => idle.observe(s));

    return () => {
      io.disconnect();
      mo.disconnect();
      idle.disconnect();
    };
  }, []);

  return null;
}
