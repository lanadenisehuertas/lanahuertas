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
 *
 * The section reveals (FX below) work the same way: each heading, block of
 * words and piece of art in a section is tagged data-fx="head|text|art" and
 * gets data-fx-in as it reaches the screen. The CSS ("Scroll effects" in
 * work.css) hides them only once html.fx-on is set here, so without this
 * script, or with reduced motion, nothing is ever hidden. Pieces in a
 * carousel slide or a sideways row that is off to the side reveal as they
 * are slid into view, because the observer sees them clipped until then.
 */
const FX: [string, "head" | "text" | "art"][] = [
  [".pr-title, .mp-title, .sp-name, .sp-title, #about h2, #contact h2", "head"],
  [".sp-copy > :not(.sp-title), .mp-copy > *, .sec-tools, #about h2 ~ p, #contact .end-card p, #contact form", "text"],
  [".sp-piece, .sp-stage--frame, .mp-win, .pr-item", "art"],
];
export default function ScrollFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-rv]").forEach((el) => (el.dataset.in = ""));
      return;
    }

    const html = document.documentElement;
    // what each watched element reveals: itself, or for a heading, the heading
    // inside it (a heading starts fully wiped away by its clip-path, and the
    // observer counts a clipped-away element as not on screen, so its parent
    // is the one watched)
    const reveals = new Map<Element, HTMLElement[]>();
    const fxIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          reveals.get(e.target)?.forEach((el) => (el.dataset.fxIn = ""));
          reveals.delete(e.target);
          fxIo.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    const tag = (root: ParentNode) => {
      for (const [sel, kind] of FX) {
        root.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          if (el.dataset.fx || el.closest(".hero-name")) return;
          el.dataset.fx = kind;
          const watch = kind === "head" ? (el.parentElement ?? el) : el;
          const list = reveals.get(watch);
          if (list) list.push(el);
          else {
            reveals.set(watch, [el]);
            fxIo.observe(watch);
          }
        });
      }
    };
    tag(document);
    html.classList.add("fx-on");

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
          if (n.parentElement) tag(n.parentElement);
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

    // While the page scrolls, the decorative loops hold still (see
    // "data-scrolling" in work.css). The attribute changes twice per scroll,
    // at its start and 180ms after its end, never on every frame.
    let still = 0;
    const onScroll = () => {
      if (!still) html.dataset.scrolling = "";
      else clearTimeout(still);
      still = window.setTimeout(() => {
        still = 0;
        delete html.dataset.scrolling;
      }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      fxIo.disconnect();
      html.classList.remove("fx-on");
      mo.disconnect();
      idle.disconnect();
      window.removeEventListener("scroll", onScroll);
      clearTimeout(still);
      delete html.dataset.scrolling;
    };
  }, []);

  return null;
}
