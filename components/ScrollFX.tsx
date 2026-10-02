"use client";

import { useEffect } from "react";

/**
 * One observer for every `[data-rv]` element on the page. When an element
 * scrolls into view it gets `.in`, and the CSS variant does the rest (see
 * "Scroll reveal" in globals.css).
 *
 * A MutationObserver picks up elements mounted later — switching a tab
 * renders new tiles, and they should animate in too.
 */
export default function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll("[data-rv]").forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const watch = (root: ParentNode) =>
      root.querySelectorAll("[data-rv]:not(.in)").forEach((el) => io.observe(el));

    watch(document);

    const mo = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches("[data-rv]:not(.in)")) io.observe(n);
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
