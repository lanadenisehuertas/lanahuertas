"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

/**
 * Flim-style top bar: mono links spread across a thin strip, a gel button at
 * the end. Turns solid once the page scrolls so it stays legible over work.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled ? "border-maize/15 bg-deep/92" : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="type-pixel mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 text-[11px] sm:px-8"
      >
        <a href="#top" className="flex min-h-[40px] items-center gap-2 text-maize">
          <span aria-hidden className="orb orb-live" />
          Lana Denise Huertas
        </a>

        <ul className="hidden items-center gap-10 sm:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="flex min-h-[40px] items-center text-maize/70 transition-colors hover:text-maize"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className="gel flex min-h-[34px] items-center px-3.5 text-[11px]">
          Hire me
        </a>
      </nav>
    </header>
  );
}
