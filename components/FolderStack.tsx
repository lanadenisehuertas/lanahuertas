"use client";

import { useState } from "react";
import { workTabs, type Project } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import ProjectModal from "./ProjectModal";
import MasonryGrid from "./MasonryGrid";
import CaseStudy from "./CaseStudy";
import { Stamp } from "./Paper";
import SectionTitle from "./SectionTitle";

const CASE_ID = "projects";

/** Column spans per breakpoint, derived from the art-directed 12-col value. */
function spanClass(span: 3 | 6 = 3) {
  // Only 3 and 6 — both divide 12 evenly. Mixing in 4s left unfillable holes
  // at laptop widths, which is what made the grid look misaligned there.
  // Column counts: 4 (base) -> 6 (sm) -> 12 (md+). At every step both spans
  // divide the count evenly, so rows always fill: 2/row on phones, 2/row on
  // small tablets, 4/row from tablet up, with features at double width.
  return span === 6
    ? "col-span-4 sm:col-span-6 md:col-span-6"
    : "col-span-2 sm:col-span-3 md:col-span-3";
}

export default function FolderStack() {
  const [active, setActive] = useState(workTabs[0].id);
  const [selected, setSelected] = useState<Project | null>(null);

  const tabs: FolderTab[] = [
    ...workTabs.map((t) => ({ id: t.id, label: t.label, accent: t.accent })),
    { id: CASE_ID, label: "projects", accent: "deep" as const },
  ];

  const tab = workTabs.find((t) => t.id === active);
  const isCase = active === CASE_ID;

  return (
    <section id="work" className="px-4 pb-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <Stamp className="-top-1 right-4 text-fawn sm:right-10" rotate={-9}>
          Portfolio 2026
        </Stamp>
        <SectionTitle id="work-heading" lead="selected" accent="work" />

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="work-heading">
          {isCase ? (
            <CaseStudy />
          ) : (
            tab && (
              <>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="type-display text-4xl sm:text-6xl">
                    {tab.heading}
                  </h3>
                  <span className="text-xs font-semibold text-ink/45">
                    {tab.projects.length} {tab.projects.length === 1 ? "project" : "projects"}
                  </span>
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/75 sm:text-base">
                  {tab.blurb}
                </p>

                <div className="mt-7">
                  <MasonryGrid>
                    {tab.projects.map((p, i) => {
                      const cover = p.images[0];
                      const extra = p.images.length - 1;
                      return (
                        <div key={p.id} className={spanClass(p.span)}>
                          <button
                            type="button"
                            onClick={() => setSelected(p)}
                            aria-label={`View ${p.title}${extra > 0 ? ` — ${p.images.length} pieces` : ""}`}
                            style={{ animationDelay: `${Math.min(i * 28, 340)}ms` }}
                            className={`group card-in paper relative block w-full cursor-pointer overflow-hidden rounded-[3px] border-2 border-ink bg-lavender/20 text-left transition-[transform,border-color] duration-300 ease-out hover:z-10 hover:!rotate-0 hover:-translate-y-1.5 ${["askew-1","askew-2","askew-3",""][i % 4]}`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cover.src}
                              alt={p.title}
                              width={cover.w}
                              height={cover.h}
                              loading={i < 6 ? "eager" : "lazy"}
                              decoding="async"
                              className="block h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                            />

                            {/* Set count */}
                            {extra > 0 && (
                              <span className="absolute top-1.5 left-1.5 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-bold text-maize tabular-nums">
                                +{extra}
                              </span>
                            )}

                            {p.isVideo && (
                              <>
                                <span
                                  aria-hidden
                                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                >
                                  <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-maize/90 pl-0.5 transition-transform duration-300 group-hover:scale-110">
                                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-ink">
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </span>
                                </span>
                                {p.duration && (
                                  <span className="absolute top-1.5 right-1.5 rounded bg-ink/85 px-1.5 py-0.5 text-[10px] font-bold text-maize tabular-nums">
                                    {p.duration}
                                  </span>
                                )}
                              </>
                            )}

                            {/* Caption — slides up on hover, always present for screen readers */}
                            <span className="font-display absolute inset-x-0 bottom-0 translate-y-full bg-ink px-2.5 py-2 text-[11px] leading-tight font-bold text-maize transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0">
                              {p.title}
                              {p.year && (
                                <span className="ml-1.5 font-normal text-maize/55">{p.year}</span>
                              )}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </MasonryGrid>
                </div>
              </>
            )
          )}
        </Folder>
      </div>

      <ProjectModal
        project={selected}
        categoryLabel={tab?.heading ?? ""}
        onClose={() => setSelected(null)}
      />
    </section>
  );
}
