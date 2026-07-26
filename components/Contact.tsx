"use client";

import { profile, socials } from "@/lib/content";
import Folder from "./Folder";
import SectionTitle from "./SectionTitle";
import Sparkle from "./Sparkle";
import EdgeRail from "./EdgeRail";
import { RegMark, GhostWord } from "./Marginalia";

/**
 * The page opened with a drafting grid, a ghost word, registration marks and an
 * edge rail. It closed on a bare panel, so the composition never resolved.
 * The same furniture runs here in reverse — ghost word on the opposite side,
 * rail at the very bottom — to bracket the page.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-4 pb-24 sm:px-8">
      <GhostWord className="-bottom-10 -left-8 text-[30vw] sm:-left-12 sm:text-[17vw]">
        thanks
      </GhostWord>
      <RegMark className="top-[12%] right-[5%]" />
      <RegMark className="bottom-[22%] left-[7%]" />
      <Sparkle size={34} className="absolute top-[8%] left-[10%] text-fawn/45 sm:size-10" />
      <Sparkle size={20} className="absolute right-[12%] bottom-[30%] text-maize/40 sm:size-7" />

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="contact-heading" lead="get in" accent="touch" />

        <Folder
          tabs={[{ id: "contact", label: "get in touch", accent: "fawn" }]}
          active="contact"
          labelledBy="contact-heading"
        >
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <h3 className="type-display text-4xl sm:text-6xl">
                Let&apos;s make something cool together.
              </h3>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
                Whether you need a brand refresh, event visuals, or just want to chat about
                design, my inbox is always open.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="type-pixel press flex min-h-[50px] cursor-pointer items-center rounded-full border-2 border-ink bg-maize px-7 text-[11px] shadow-hard-sm hover:bg-eminence hover:text-maize"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Sign-off card */}
            <div className="rounded-xl border-2 border-ink/20 bg-lavender/10 p-6">
              <p className="type-pixel text-[10px] text-eminence">Signed</p>
              <p className="type-script mt-2 text-[2.4rem] leading-[0.95] text-eminence sm:text-5xl">
                Lana
              </p>
              <p className="type-display mt-3 text-lg">{profile.name}</p>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="type-pixel w-14 shrink-0 pt-0.5 text-[10px] text-ink/40">Based</dt>
                  <dd className="text-ink/75">{profile.location}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="type-pixel w-14 shrink-0 pt-0.5 text-[10px] text-ink/40">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${profile.email}`}
                      className="break-all text-ink/75 underline decoration-eminence/40 underline-offset-2 hover:text-eminence"
                    >
                      {profile.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Folder>

        {/* Closes the bracket the hero opened. */}
        <EdgeRail
          className="mt-14 border-t pt-4"
          items={[
            { label: "lana denise huertas" },
            { label: "Portfolio Vol. 01" },
            { label: "Manila, PH" },
            { label: "Back to top", href: "#top" },
          ]}
        />
      </div>
    </section>
  );
}
