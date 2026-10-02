"use client";

import { useState } from "react";
import { workTabs, type Project } from "@/lib/content";
import Folder, { type FolderTab } from "./Folder";
import ProjectModal from "./ProjectModal";
import ProjectBento from "./ProjectBento";
import CaseStudy from "./CaseStudy";
import SectionTitle from "./SectionTitle";

const CASE_ID = "projects";

export default function FolderStack() {
  const [active, setActive] = useState(workTabs[0].id);
  const [selected, setSelected] = useState<Project | null>(null);

  const tabs: FolderTab[] = [
    ...workTabs.map((t) => ({ id: t.id, label: t.label, accent: t.accent })),
    { id: CASE_ID, label: "ui/ux & code", accent: "deep" as const },
  ];

  const tab = workTabs.find((t) => t.id === active);
  const isCase = active === CASE_ID;

  return (
    <section id="work" className="px-4 pb-20 sm:px-8">
      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="work-heading" index="01" lead="Selected" accent="work" />

        <Folder tabs={tabs} active={active} onSelect={setActive} labelledBy="work-heading">
          {isCase ? (
            <CaseStudy />
          ) : (
            tab && (
              <>
                {/* Keyed by tab so tiles replay their entrance on switch */}
                <ProjectBento
                  key={tab.id}
                  projects={tab.projects}
                  heading={tab.heading}
                  blurb={tab.blurb}
                  onOpen={setSelected}
                />
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
