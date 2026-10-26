import type { Metadata } from "next";
import { brands, brandPieces, morePosters } from "@/lib/brands";
import BrandSlide from "@/components/showcase/BrandSlide";
import SetGallery from "@/components/showcase/SetGallery";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import GardenFX from "@/components/GardenFX";

export const metadata: Metadata = {
  title: "Branding & pubmats — Lana Denise Huertas",
  description: "Event identities, campaigns and publication materials by Lana Denise Huertas — every brand and its full set of pubmats.",
  alternates: { canonical: "/design" },
};

export default function DesignPage() {
  const total = brands.length;
  return (
    <main id="top">
      <header className="mx-auto max-w-6xl px-4 pt-32 pb-6 sm:px-8">
        <SectionTitle as="h1" id="design-heading" index="01" lead="Branding &" accent="pubmats" note={`${total} brands · every piece`} ornament="dotButterfly" />
        <nav aria-label="Brands" className="seg flex-wrap !rounded-[24px]">
          {brands.map((b) => (
            <a key={b.slug} href={`#${b.slug}`} className="seg-btn">
              {b.name}
            </a>
          ))}
          <a href="#more" className="seg-btn">
            More posters
          </a>
        </nav>
      </header>

      {brands.map((b, i) => (
        <section key={b.slug} id={b.slug} aria-label={b.name} className="scroll-mt-16">
          <BrandSlide brand={b} n={i + 1} total={total} eager={i === 0} link={false} />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
            <SetGallery items={brandPieces(b)} heading={b.name} blurb={b.brief} eager={i === 0} />
          </div>
        </section>
      ))}

      <section id="more" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:px-8">
        <SectionTitle id="more-heading" index="+" lead="More" accent="posters" note="one-offs and class work" />
        <SetGallery items={morePosters} heading="More posters" blurb="Single posters and announcements that are not part of a larger campaign." />
      </section>

      <Contact />
      <ScrollFX />
      <GardenFX />
    </main>
  );
}
