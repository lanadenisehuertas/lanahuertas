"use client";

import { profile, socials } from "@/lib/content";
import Folder from "./Folder";
import SectionTitle from "./SectionTitle";

export default function Contact() {
  return (
    <section id="contact" className="px-4 pb-28 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionTitle id="contact-heading" lead="get in" accent="touch" />

        <Folder
          tabs={[{ id: "contact", label: "get in touch", accent: "fawn" }]}
          active="contact"
          labelledBy="contact-heading"
        >
          <h3 className="type-display text-4xl sm:text-6xl">
            Let&apos;s make something cool together.
          </h3>

          <p className="mt-5 max-w-2xl text-sm text-ink/80 sm:text-base">
            Whether you need a brand refresh, event visuals, or just want to chat about design,
            my inbox is always open.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="font-display press flex min-h-[44px] cursor-pointer items-center rounded-full border-2 border-ink bg-maize px-6 text-sm font-bold shadow-hard-sm hover:bg-eminence hover:text-maize"
              >
                {s.label}
              </a>
            ))}
          </div>

          <p className="type-display mt-10 text-[1.75rem]">{profile.name}</p>
          <p className="mt-1 text-base text-ink/70">
            {profile.location} · {profile.email}
          </p>
        </Folder>
      </div>
    </section>
  );
}
