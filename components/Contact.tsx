"use client";

import { profile, socials } from "@/lib/content";
import Folder from "./Folder";
import SectionTitle from "./SectionTitle";
import EdgeRail from "./EdgeRail";

/**
 * The page opened with a drafting grid, a ghost word, registration marks and an
 * edge rail. It closed on a bare panel, so the composition never resolved.
 * The same furniture runs here in reverse — ghost word on the opposite side,
 * rail at the very bottom — to bracket the page.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-4 pb-24 sm:px-8">

      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="contact-heading" index="03" lead="Get in" accent="touch" note="Manila, PH" />

        <Folder
          tabs={[{ id: "contact", label: "get in touch", accent: "fawn" }]}
          active="contact"
          labelledBy="contact-heading"
        >
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end">
            <div>
              <h3 data-rv="mask" className="type-display text-4xl sm:text-6xl">
                Let&apos;s make something cool together.
              </h3>

              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/75 sm:text-base">
                Open to UI/UX and design internships, and to freelance work — brand
                refreshes, event visuals, product design. My inbox is always open.
              </p>

              {/*
               * Four pills of differing widths wrapped 2-1-1 on a phone, which
               * reads as an accident rather than a layout. A two-column grid
               * below 640px makes the break deliberate and gives every link the
               * same target; above it they return to sitting on one line.
               */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {socials.map((s, idx) => (
                  <a
                    data-rv
                    style={{ "--d": `${idx * 70}ms` } as React.CSSProperties}
                    key={s.label}
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="gel type-pixel flex min-h-[48px] items-center justify-center gap-2 px-5 text-[11px] sm:justify-start sm:px-6"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Sign-off card */}
            <div className="glass-soft rounded-[4px] p-6">
              <p className="type-display text-xl">{profile.name}</p>
              <dl className="mt-4 space-y-1.5 text-sm">
                <div className="flex gap-2">
                  <dt className="type-pixel w-14 shrink-0 pt-0.5 text-[10px] text-ink/65">Based</dt>
                  <dd className="text-ink/75">{profile.location}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="type-pixel w-14 shrink-0 pt-0.5 text-[10px] text-ink/65">Email</dt>
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
