"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [
  { id: "work", label: "work" },
  { id: "about", label: "about" },
  { id: "contact", label: "contact" },
];

const MANILA = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

/**
 * Masthead, set like the top of a printed poster: the pixel butterfly (the site icon) and
 * the name in italic serif; the sections as a lowercase index (on phones too) with a sparkle
 * that follows where you are; Manila time and a thin "hire me" at the end.
 *
 * Clear over the hero. Once the page scrolls it becomes a pearl band whose
 * lower edge fades out instead of ending on a rule.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [time, setTime] = useState("");
  // on /design and /ui-ux the sections live on the home page
  const home = usePathname() === "/";
  const to = (id: string) => (home ? `#${id}` : `/#${id}`);

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
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setActive(null), { rootMargin: "0px 0px -60% 0px" });
    const hero = document.querySelector("main > section");
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
  }, []);

  return (
    <header className={`masthead fixed inset-x-0 top-0 z-50 ${scrolled ? "is-scrolled" : ""}`}>
      <nav aria-label="Main" className="page-x relative flex items-center justify-between gap-4 py-2 md:grid md:grid-cols-[1fr_auto_1fr]">
        <a href={home ? "#top" : "/"} aria-label="Lana Denise Huertas, home" className="group flex min-h-[44px] min-w-[44px] items-center gap-2.5 text-iris md:justify-self-start">
          {/* the same pixel butterfly as the site icon */}
          <span aria-hidden className="nav-mark" />
          <span className="type-display hidden text-[19px] leading-none italic sm:inline">Lana Denise Huertas</span>
        </a>

        <ul className="flex items-center gap-2 sm:gap-6">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <li key={l.id}>
                <a
                  href={to(l.id)}
                  aria-current={on ? "location" : undefined}
                  className={`nav-link relative flex min-h-[44px] min-w-[44px] items-center justify-center text-[15px] transition-colors ${
                    on ? "text-iris" : "text-ink/80 hover:text-iris"
                  }`}
                >
                  {l.label}
                  <svg aria-hidden viewBox="0 0 24 24" className="nav-spark absolute -bottom-0.5 left-1/2 h-2.5 w-2.5 text-lavender">
                    <path
                      d="M12 0C12.9 7.6 16.4 11.1 24 12C16.4 12.9 12.9 16.4 12 24C11.1 16.4 7.6 12.9 0 12C7.6 11.1 11.1 7.6 12 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4 md:justify-self-end">
          <span className="type-pixel hidden items-center gap-1.5 text-[14px] text-ink/75 lg:flex">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-leaf" />
            Manila {time || " "}
          </span>
          <a href={to("contact")} className="hire flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[17px] italic">
            Hire me <span aria-hidden className="text-[13px] not-italic">↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
