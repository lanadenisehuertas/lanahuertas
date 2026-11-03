import { brands } from "@/lib/brands";
import BrandSlide from "./BrandSlide";
import Spread from "./Spread";
import YourTurnSlide from "./YourTurnSlide";
import { toneOf, WASH } from "./tone";

/**
 * Branding & pubmats: one brand per screen. Carousel on the homepage, a stack
 * on /design. The carousel ends on "Your turn": after every brand, a studio
 * where you can make a pubmat with my palettes and art.
 */
export default function BrandShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  const studio = mode === "carousel";
  const total = brands.length + (studio ? 1 : 0);
  const slides = brands.map((b) => ({ key: b.slug, name: b.name, short: b.short, tone: toneOf(b.slug), wash: WASH[b.slug] }));
  if (studio) slides.push({ key: "your-turn", name: "Your turn: make a pubmat", short: "Your turn ✦", tone: "dark", wash: "40 38 120" });
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
      slides={slides}
    >
      {brands.map((b, i) => (
        <BrandSlide key={b.slug} brand={b} n={i + 1} total={total} link={mode === "carousel"} />
      ))}
      {studio && <YourTurnSlide n={total} total={total} />}
    </Spread>
  );
}
