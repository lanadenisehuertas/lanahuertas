import { backdropSrc } from "@/lib/brands";

/**
 * The ground behind a slide and the feathered wash the copy sits on. Brand
 * slides pass their slug and get their own artboard edge to edge; slides
 * without one (UI/UX & code) sit on the site's dawn sky, drawn in work.css.
 */
export default function Backdrop({ slug, eager = false }: { slug?: string; eager?: boolean }) {
  const src = slug ? backdropSrc(slug) : null;
  return (
    <>
      <div aria-hidden className="sp-bg">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            srcSet={`${src.replace("/backdrops/", "/backdrops/sm/")} 960w, ${src} 1536w`}
            sizes="100vw"
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
          />
        )}
      </div>
      <div aria-hidden className="sp-wash" />
    </>
  );
}
