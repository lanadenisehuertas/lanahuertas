"use client";

import { useState } from "react";
import { workTabs, type Project } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import ProjectModal from "./ProjectModal";

export default function FolderStack() {
  const [active, setActive] = useState(workTabs[0].id);
  const [selected, setSelected] = useState<Project | null>(null);

  const tab = workTabs.find((t) => t.id === active) ?? workTabs[0];
  const tabs: FolderTab[] = workTabs.map((t) => ({
    id: t.id,
    label: t.label,
    accent: t.accent,
  }));

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
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="font-display text-3xl font-black tracking-tighter sm:text-5xl">
              {tab.heading}
            </h3>
            <span className="text-xs font-semibold text-ink/45">
              {tab.projects.length} {tab.projects.length === 1 ? "piece" : "pieces"}
            </span>
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/80 sm:text-base">
            {tab.blurb}
          </p>

          {/*
           * Masonry columns. Each card keeps its source aspect ratio, so a 16:9
           * banner and a 3:4 poster sit side by side at their true shapes
           * instead of being cropped to a common box.
           */}
          <div className="mt-8 columns-2 gap-3 sm:columns-3 lg:columns-4">
            {tab.projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p)}
                style={{ animationDelay: `${Math.min(i * 32, 400)}ms` }}
                className="group card-in relative mb-3 block w-full cursor-pointer overflow-hidden rounded-lg border-2 border-ink bg-lavender/25 text-left break-inside-avoid shadow-hard-sm transition-transform duration-200 hover:-translate-y-1 hover:rotate-[-1.2deg]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.title}
                  width={p.w}
                  height={p.h}
                  loading={i < 4 ? "eager" : "lazy"}
                  decoding="async"
                  // width/height reserve the box, so nothing shifts as images load.
                  className="block h-auto w-full"
                />

                {p.isVideo && (
                  <>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-maize/90 pl-0.5 shadow-hard-sm transition-transform duration-200 group-hover:scale-110">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-ink">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                    {p.duration && (
                      <span className="absolute top-2 right-2 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-bold text-maize tabular-nums">
                        {p.duration}
                      </span>
                    )}
                  </>
                )}

                <span className="absolute inset-x-0 bottom-0 translate-y-full bg-ink/88 px-2.5 py-2 text-[11px] leading-tight font-semibold text-maize transition-transform duration-200 group-hover:translate-y-0 group-focus-visible:translate-y-0">
                  {p.title}
                  {p.year && <span className="ml-1.5 font-normal text-maize/60">{p.year}</span>}
                </span>
              </button>
            ))}
          </div>
        </Folder>
      </div>

      <ProjectModal project={selected} categoryLabel={tab.heading} onClose={() => setSelected(null)} />
    </section>
  );
}
