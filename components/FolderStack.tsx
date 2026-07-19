"use client";

import { useState } from "react";
import { workTabs, type Project } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import ProjectModal from "./ProjectModal";

export default function FolderStack() {
  const [active, setActive] = useState(workTabs[0].id);
  const [selected, setSelected] = useState<Project | null>(null);
  const [slot, setSlot] = useState<number | null>(null);

  const tab = workTabs.find((t) => t.id === active) ?? workTabs[0];

  const tabs: FolderTab[] = workTabs.map((t) => ({
    id: t.id,
    label: t.label,
    accent: t.accent,
  }));

  const close = () => {
    setSelected(null);
    setSlot(null);
  };

  const cardBase =
    "group relative flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 text-[10px] font-semibold transition duration-200 hover:-translate-y-1 hover:rotate-[-1.5deg] hover:shadow-hard-sm";

  return (
    <section id="work" className="px-4 pb-20 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <h2
          id="work-heading"
          className="font-display mb-6 pl-2 text-xs font-bold tracking-[0.22em] text-fawn uppercase"
        >
          projects
        </h2>

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="work-heading">
          <h3 className="font-display text-3xl font-black tracking-tighter sm:text-5xl">
            {tab.heading}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80 sm:text-base">
            {tab.blurb}
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {tab.projects.length === 0
              ? Array.from({ length: 8 }).map((_, n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setSlot(n + 1)}
                    aria-label={`Empty project slot ${n + 1}`}
                    className={`${cardBase} border-ink/20 bg-lavender/35 text-ink/40 hover:border-ink hover:bg-lavender/60`}
                  >
                    {String(n + 1).padStart(2, "0")}
                  </button>
                ))
              : tab.projects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelected(p)}
                    aria-label={`View details for ${p.title}`}
                    className={`${cardBase} border-ink bg-lavender/35 shadow-hard-sm`}
                  >
                    {p.image && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={p.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}

                    {/* Caption bar, lifts in on hover. */}
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/85 px-2 py-1.5 text-left text-[11px] font-semibold text-maize transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      {p.title}
                    </span>
                  </button>
                ))}
          </div>
        </Folder>
      </div>

      <ProjectModal
        project={selected}
        slotNumber={slot}
        categoryLabel={tab.heading}
        onClose={close}
      />
    </section>
  );
}
