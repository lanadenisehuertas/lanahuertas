import { brands } from "@/lib/brands";
import BrandSlide from "./BrandSlide";
import Spread from "./Spread";
import YourTurnSlide from "./YourTurnSlide";

/**
 * Branding & pubmats: one brand at a time. A carousel on the homepage, a
 * stack on /design. The carousel ends on "Your turn": after every brand, a
 * studio where you can make a pubmat with my palettes and art.
 */
export default function BrandShowcase({ mode = "carousel" }: { mode?: "carousel" | "stack" }) {
  const studio = mode === "carousel";
  const total = brands.length + (studio ? 1 : 0);
  const slides = brands.map((b) => ({ key: b.slug, name: b.name, short: b.short }));
  if (studio) slides.push({ key: "your-turn", name: "Your turn: make a pubmat", short: "Your turn" });
  return (
    <Spread
      id="branding"
      mode={mode}
      label="Brands"
      title={{ lead: "Branding &", accent: "pubmats", n: "01", script: "identity", spec: "butterfly", world: "blue" }}
      head={
        studio
          ? {
              meta: `${brands.length} brands, made in Illustrator and Photoshop`,
              lede: "Event identities and campaigns for student organizations: one key visual, carried through every post, banner and badge.",
              link: { href: "/design", label: "Every brand and its full set" },
            }
          : {
              meta: `${brands.length} brands, made in Illustrator and Photoshop`,
              lede: "Every brand and its full set of publication materials, then the one-off posters.",
              link: { href: "/#branding", label: "Back to the portfolio" },
            }
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
