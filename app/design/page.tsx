import type { Metadata } from "next";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import PosterRow from "@/components/showcase/PosterRow";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import GardenFX from "@/components/GardenFX";

export const metadata: Metadata = {
  title: "Branding & pubmats — Lana Denise Huertas",
  description: "Event identities, campaigns and publication materials by Lana Denise Huertas — every brand and its full set of pubmats, and the one-off posters.",
  alternates: { canonical: "/design" },
};

/** Every brand as a full spread, one after another, then the posters row. */
export default function DesignPage() {
  return (
    <main id="top">
      <BrandShowcase mode="stack" />
      <PosterRow />
      <Contact />
      <ScrollFX />
      <GardenFX />
    </main>
  );
}
