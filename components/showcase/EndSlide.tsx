import { Bellflower, Lotus, Sparkle4 } from "../Botanicals";
import { Cloud, PixelArt, Star5 } from "../Ethereal";

/** The closing slide of a carousel: the garden sky and one way onward. */
export default function EndSlide({ title, accent, note, href, label }: { title: string; accent: string; note: string; href: string; label: string }) {
  return (
    <article className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(40% 50% at 50% 55%, #fff6ea 0%, transparent 70%), linear-gradient(180deg, #c8d0f6 0%, #c9b9ec 38%, #f2b8cf 70%, #f6d3c3 100%)" }}
      >
        <Cloud className="drift-x absolute bottom-[4%] -left-[10%] w-[60%] opacity-90" />
        <Cloud className="drift-x absolute -right-[12%] bottom-[12%] w-[50%] -scale-x-100 opacity-80" />
        <div className="dither absolute inset-x-0 bottom-0 h-1/2 opacity-50" />
        <div className="band-grain absolute inset-0" />
        <Star5 className="twinkle absolute top-[18%] left-[22%] h-3 w-3 text-white" />
        <PixelArt name="sparkle" className="twinkle absolute top-[14%] right-[24%] w-8" />
        <Lotus className="sway absolute bottom-0 left-[12%] w-[18%] max-w-[220px]" deep />
        <Bellflower className="sway absolute right-[14%] bottom-0 w-[10%] max-w-[120px]" />
      </div>
      <div className="relative px-6 text-center">
        <p className="type-pixel text-[11px] text-ink/60">{note}</p>
        <p className="type-display mt-4 text-6xl text-iris sm:text-8xl">
          {title} <span className="text-lavender italic">{accent}</span>
        </p>
        <a href={href} className="btn mx-auto mt-8 inline-flex min-h-[48px] items-center gap-2 px-6">
          {label} <span aria-hidden>→</span>
        </a>
        <Sparkle4 className="spin-slow absolute -top-6 right-2 h-8 w-8 text-white" />
      </div>
    </article>
  );
}
