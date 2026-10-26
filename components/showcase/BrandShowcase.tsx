import { brands } from "@/lib/brands";
import SectionTitle from "../SectionTitle";
import BrandSlide from "./BrandSlide";
import Carousel from "./Carousel";
import EndSlide from "./EndSlide";

export default function BrandShowcase() {
  const total = brands.length;
  return (
    <section id="branding" className="relative pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="branding-heading" index="01" lead="Branding &" accent="pubmats" note={`${total} brands · swipe →`} ornament="dotButterfly" />
      </div>
      <Carousel label="Brands">
        {brands.map((b, i) => (
          <BrandSlide key={b.slug} brand={b} n={i + 1} total={total} eager={i === 0} />
        ))}
        <EndSlide note={`${total} brands · every pubmat`} title="See the" accent="full sets" href="/design" label="Open branding & pubmats" />
      </Carousel>
    </section>
  );
}
