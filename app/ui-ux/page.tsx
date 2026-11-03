import type { Metadata } from "next";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "UI/UX & code — Lana Denise Huertas",
  description: "Case studies: products Lana Denise Huertas designed and built, from clinical screening to a math battle game.",
  alternates: { canonical: "/ui-ux" },
};

/** Every product as a full spread, one after another. */
export default function UiUxPage() {
  return (
    <main id="top">
      <CodeShowcase mode="stack" />
      <Contact />
      <ScrollFX />
    </main>
  );
}
