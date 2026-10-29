import { backdropSrc } from "@/lib/brands";

/** The artboard behind a slide, edge to edge, and the feathered wash the copy sits on. */
export default function Backdrop({ slug, eager }: { slug: string; eager: boolean }) {
  const src = backdropSrc(slug);
  return (
    <>
      <div aria-hidden className="sp-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          srcSet={`${src.replace("/backdrops/", "/backdrops/sm/")} 960w, ${src} 1536w`}
          sizes="100vw"
          alt=""
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      </div>
      <div aria-hidden className="sp-wash" />
    </>
  );
}
