import { brands } from "@/lib/brands";
import BrandSlide from "./BrandSlide";
import Spread from "./Spread";
import { toneOf, WASH } from "./tone";

/** Branding & pubmats: one brand per screen. Carousel on the homepage, a stack on /design. */
export default function BrandShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  const total = brands.length;
  return (
    <Spread
      id="branding"
      mode={mode}
      label="Brands"
      title={
        <>
          Branding &amp; <em>pubmats</em>
        </>
      }
      slides={brands.map((b) => ({ key: b.slug, name: b.name, short: b.short, tone: toneOf(b.slug), wash: WASH[b.slug] }))}
    >
      {brands.map((b, i) => (
        <BrandSlide key={b.slug} brand={b} n={i + 1} total={total} link={mode === "carousel"} />
      ))}
    </Spread>
  );
}
