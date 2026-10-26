import type { ProjectImage } from "@/lib/content";
import { small } from "@/lib/img";

/**
 * A pubmat at its intrinsic ratio: the 720px copy for small slots, the full
 * file where the slot is wide. Images narrower than the sm copy get one src.
 */
export default function Pic({
  img,
  sizes,
  eager = false,
  className = "",
  alt = "",
}: {
  img: ProjectImage;
  sizes: string;
  eager?: boolean;
  className?: string;
  alt?: string;
}) {
  const sm = small(img.src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.w > 720 ? sm : img.src}
      srcSet={img.w > 720 ? `${sm} 720w, ${img.src} ${img.w}w` : undefined}
      sizes={img.w > 720 ? sizes : undefined}
      width={img.w}
      height={img.h}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
