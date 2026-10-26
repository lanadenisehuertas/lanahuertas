import type { Brand } from "@/lib/brands";
import { palettes } from "@/lib/palettes";
import BrandCollage from "./BrandCollage";
import ProjectText from "./ProjectText";
import SlideShell from "./SlideShell";

/** A brand's words: the shared project text with its copy and palette. */
export function BrandText({ brand, n, total, link = true }: { brand: Brand; n: number; total: number; link?: boolean }) {
  return (
    <ProjectText
      n={n}
      total={total}
      meta={[brand.org, brand.date]}
      title={brand.name}
      tagline={brand.tagline}
      body={brand.brief}
      roles={brand.roles}
      tools={brand.tools}
      palette={palettes[brand.slug]}
      actions={
        <>
          {link && (
            <a href={`/design#${brand.slug}`} className="btn inline-flex min-h-[44px] items-center gap-2 px-5">
              View the full set <span aria-hidden>→</span>
            </a>
          )}
          {brand.href && (
            <a href={brand.href} target="_blank" rel="noopener noreferrer" className="link text-[15px] text-[var(--t-title)]">
              See the post ↗
            </a>
          )}
        </>
      }
    />
  );
}

/** One brand, one screen: its own backdrop edge to edge, the real pubmats on it, the words beside. */
export default function BrandSlide({
  brand,
  n,
  total,
  eager = false,
  link = true,
}: {
  brand: Brand;
  n: number;
  total: number;
  eager?: boolean;
  link?: boolean;
}) {
  return (
    <SlideShell
      slug={brand.slug}
      n={n}
      label={brand.name}
      eager={eager}
      art={<BrandCollage brand={brand} eager={eager} />}
      text={() => <BrandText brand={brand} n={n} total={total} link={link} />}
    />
  );
}
