"use client";

import { useState, type CSSProperties } from "react";
import { profile, socials } from "@/lib/content";
import { Lotus, Leaf, Spiral, Sparkle4, Orb } from "./Botanicals";
import SectionTitle from "./SectionTitle";
import MorphName from "./MorphName";

/* Small glyphs for the bloom buttons — drawn, not emoji, so they match. */
const GLYPH: Record<string, React.ReactNode> = {
  email: <path d="M3 6h18v12H3z M3 6l9 7 9-7" />,
  linkedin: (
    <>
      <path d="M5 9v10 M5 5.5v.5" />
      <path d="M10 19v-6a3 3 0 0 1 6 0v6 M10 9v10" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.6 5.5 2.9 5.5 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.3c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  ),
  "canva site": <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18" />,
};

const PETALS = [0, 60, 120, 180, 240, 300];

/**
 * The end card. It mirrors the hero sheet — gradient band, garden, corner
 * labels like a printed poster — and carries everything you'd act on:
 * the thank-you (morphs like the name), a bloom button per link (hover and
 * petals burst out of the orb), and copy-email with a sparkle burst.
 */
export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="relative px-4 pb-16 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="contact-heading" index="03" lead="Get in" accent="touch" />

        <footer
          aria-labelledby="contact-heading"
          className="end-card sl-curtain bloom-zone relative overflow-visible rounded-[6px] border border-ink/20"
        >
          {/* The printed field */}
          <div
            aria-hidden
            className="absolute inset-0 overflow-hidden rounded-[6px]"
            style={{
              background:
                "radial-gradient(60% 70% at 50% 45%, #fff6ea 0%, transparent 70%), linear-gradient(180deg, #f6d3c3 0%, #f2b8cf 30%, #c9b9ec 64%, #a9b6f0 100%)",
            }}
          >
            <div className="band-grain absolute inset-0" />
          </div>

          {/* Poster corners */}
          <div className="type-pixel relative flex items-start justify-between p-4 text-[10px] text-ink/65 sm:p-6 sm:text-[11px]">
            <span>
              ©2026 {profile.name}
              <br />
              {profile.location}
            </span>
            <a
              href="#top"
              className="rounded-full border border-ink/40 bg-white/40 px-3 py-1 transition-colors hover:bg-iris hover:text-paper"
            >
              Back to top ↑
            </a>
          </div>

          <div className="relative px-4 pt-4 pb-14 text-center sm:px-10 sm:pt-6 sm:pb-20">
            <p className="type-display text-2xl text-eminence italic sm:text-3xl">
              Let&apos;s make something together —
            </p>

            <MorphName
              as="p"
              label="Thank you"
              words={[
                {
                  text: "Thank you",
                  italic: true,
                  className: "type-name mt-1 text-[15vw] whitespace-nowrap text-iris italic xl:text-[10.5rem]",
                },
              ]}
            />

            <p className="mx-auto mt-4 max-w-md text-[15px] text-ink/75">
              Open to UI/UX and design roles, and to freelance brand, event and product work.
            </p>

            {/* Bloom buttons */}
            <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10">
              {socials.map((s, i) => (
                <li key={s.label} className="sl-pop" style={{ "--i": i } as CSSProperties}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="bloom-btn group flex flex-col items-center gap-2"
                  >
                    <span className="relative flex h-[72px] w-[72px] items-center justify-center">
                      {PETALS.map((r) => (
                        <span key={r} aria-hidden className="bloom-petal" style={{ "--r": `${r}deg` } as CSSProperties} />
                      ))}
                      <span className="bloom-orb relative flex h-full w-full items-center justify-center rounded-full">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden
                          className="relative h-7 w-7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {GLYPH[s.label]}
                        </svg>
                      </span>
                    </span>
                    <span className="type-display text-xl text-ink italic capitalize transition-colors group-hover:text-lavender">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Copy email */}
            <div className="mt-10 flex flex-col items-center gap-2">
              <button type="button" onClick={copy} className="gel relative flex min-h-[48px] items-center gap-2 px-6">
                {copied ? "Copied — talk soon" : profile.email}
                {copied &&
                  [0, 1, 2, 3, 4].map((k) => (
                    <Sparkle4 key={k} className="burst pointer-events-none absolute h-3 w-3 text-white" />
                  ))}
              </button>
              <span className="type-pixel text-[10px] text-ink/55">click to copy</span>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email copied to clipboard" : ""}
              </span>
            </div>
          </div>

          {/* Garden, spilling over the card edges like the hero band */}
          <div aria-hidden className="pointer-events-none">
            <div className="px sl-sprout absolute -bottom-6 -left-4 w-[22%] max-w-[190px] sm:-left-8" style={{ "--depth": 18 } as CSSProperties}>
              <Lotus className="sway w-full" deep />
            </div>
            <div className="px sl-sprout absolute -right-4 -bottom-8 w-[26%] max-w-[230px] sm:-right-10" style={{ "--depth": 24, "--i": 2 } as CSSProperties}>
              <Lotus className="sway w-full" />
            </div>
            <div className="px sl-sprout absolute top-[18%] -left-6 hidden w-[14%] sm:block" style={{ "--depth": -10, "--i": 1 } as CSSProperties}>
              <Leaf className="sway w-full -rotate-[20deg]" />
            </div>
            <div className="px sl-sprout absolute top-[8%] -right-6 hidden w-[16%] sm:block" style={{ "--depth": -12, "--i": 3 } as CSSProperties}>
              <Leaf className="sway w-full rotate-[200deg]" />
            </div>
            <Spiral className="spin-slow absolute top-[30%] left-[10%] hidden w-12 sm:block" />
            <Orb className="float-badge absolute top-[44%] right-[12%] h-7 w-7" />
            <Orb className="float-badge absolute bottom-[22%] left-[20%] h-5 w-5" />
            <Sparkle4 className="spin-slow absolute top-[22%] right-[22%] h-6 w-6 text-white" />
            <Sparkle4 className="absolute bottom-[30%] right-[30%] h-4 w-4 text-white/90" />
          </div>
        </footer>
      </div>
    </section>
  );
}
