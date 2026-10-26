import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "UI/UX & code — Lana Denise Huertas",
  description: "Case studies: products Lana Denise Huertas designed and built, from clinical screening to a math battle game.",
  alternates: { canonical: "/ui-ux" },
};

export default function UiUxPage() {
  return (
    <main id="top">
      <div className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-8">
        <SectionTitle as="h1" id="code-heading" index="03" lead="UI/UX &" accent="code" note="designed, then built" ornament="flourish" />
        <CaseStudy />
      </div>
      <Contact />
      <ScrollFX />
    </main>
  );
}
