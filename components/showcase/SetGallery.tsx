"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import ProjectBento from "../ProjectBento";
import ProjectModal from "../ProjectModal";

/** The justified gallery and its lightbox, for one list of pieces. */
export default function SetGallery({ items, heading, blurb }: { items: Project[]; heading: string; blurb: string }) {
  const [sel, setSel] = useState<Project | null>(null);
  return (
    <>
      <ProjectBento projects={items} heading={heading} blurb={blurb} onOpen={setSel} />
      <ProjectModal project={sel} categoryLabel={heading} onClose={() => setSel(null)} />
    </>
  );
}
