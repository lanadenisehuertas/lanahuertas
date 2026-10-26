"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PixelFlower } from "./Ethereal";

const LINKS = [
  { id: "branding", label: "branding", n: "01" },
  { id: "videos", label: "videos", n: "02" },
  { id: "code", label: "ui/ux", n: "03" },
  { id: "about", label: "about", n: "04" },
  { id: "contact", label: "contact", n: "05" },
];

/** The section each sub-page belongs to, so the nav can mark it. */
const PAGE_SECTION: Record<string, string> = { "/design": "branding", "/videos": "videos", "/ui-ux": "code" };

const MANILA = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

/**
 * Masthead, set like the top of a printed poster: a pixel-flower mark and
 * the name in italic serif; the sections as a printed index, the current one
 * underlined (the section in view on the homepage, the page itself on a
 * sub-page); Manila time and the "hire me" button at the end.
 *
 * Clear over the hero. Once the page scrolls it becomes a pearl band whose
 * lower edge fades out instead of ending on a rule.
 */
export default function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const href = (id: string) => (home ? `#${id}` : `/#${id}`);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // The section crossing the middle of the screen is the current one.
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    LINKS.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) spy.observe(el);
    });
    // On the homepage, the hero clears the mark; sub-pages have no hero.
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "0px 0px -60% 0px" });
    const hero = home ? document.querySelector("main > section") : null;
    if (hero) top.observe(hero);

    // Rendered after mount so server and client never disagree on the minute.
    const tick = () => setTime(MANILA.format(new Date()).toLowerCase());
    tick();
    const clock = window.setInterval(tick, 30_000);

    return () => {
      window.removeEventListener("scroll", onScroll);
      spy.disconnect();
      top.disconnect();
      window.clearInterval(clock);
    };
  }, [home]);

  const page = PAGE_SECTION[pathname];

  return (
    <header className={`masthead fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}>
      <nav aria-label="Main" className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-8">
        <a href={home ? "#top" : "/"} className="group flex min-h-[44px] items-center gap-2.5 text-iris">
          <PixelFlower className="h-4 w-4 transition-transform duration-500 group-hover:rotate-90" fill="currentColor" />
          <span className="type-display text-[19px] leading-none italic">Lana Denise Huertas</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => {
            const current = page === l.id ? "page" : active === l.id ? "location" : undefined;
            return (
              <li key={l.id}>
                <a href={href(l.id)} aria-current={current} className="nav-link">
                  <span className="opacity-50">{l.n}</span>
                  {l.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <span className="type-pixel hidden items-center gap-1.5 text-[10px] text-ink/55 lg:flex">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-leaf" />
            manila {time || " "}
          </span>
          <a href="#contact" className="btn inline-flex min-h-[40px] items-center gap-1.5 px-4 text-[16px]">
            Hire me <span aria-hidden className="text-[13px] not-italic">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
