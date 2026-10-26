import type { Project } from "@/lib/content";
import { small } from "@/lib/img";
import Pic from "./Pic";

const pad = (n: number) => String(n).padStart(2, "0");

/** One video, one screen: the poster in a player frame over its own blurred light. */
export default function VideoSlide({ p, n, total, eager = false }: { p: Project; n: number; total: number; eager?: boolean }) {
  const img = p.images[0];
  return (
    <article aria-label={p.title} className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]">
      <div aria-hidden className="bs-backdrop absolute inset-0 -z-10 overflow-hidden bg-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={small(img.src)} alt="" loading={eager ? "eager" : "lazy"} className="bs-blur h-full w-full scale-125 object-cover opacity-80 blur-3xl saturate-150" />
        <div className="absolute inset-0 bg-paper/30" />
        <div className="band-grain absolute inset-0" />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <a
          href={`/videos#${p.id}`}
          aria-label={`Watch ${p.title}`}
          className={`group relative block lg:col-span-8 ${n % 2 === 0 ? "lg:col-start-5 lg:row-start-1" : ""}`}
        >
          <span className="block overflow-hidden rounded-[14px] border border-ink/25 bg-ink shadow-[0_40px_70px_-40px_rgb(27_7_48/0.8)]">
            <span className="titlebar type-pixel flex h-7 items-center gap-2 px-3 text-[10px]">
              <span aria-hidden className="closebox" />
              <span className="tb-label mx-auto truncate normal-case">{p.id.replace(/-/g, "_")}.mov</span>
              <span className="tb-label tabular-nums">{p.duration}</span>
            </span>
            <Pic img={img} eager={eager} sizes="(min-width: 1024px) 60vw, 92vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
          </span>
          <span
            aria-hidden
            className="gel !absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center !p-0 after:hidden"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
        <div className={`bs-card relative rounded-[20px] p-6 sm:p-8 lg:col-span-4 ${n % 2 === 0 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
          <p className="type-pixel flex flex-wrap gap-x-2 text-[10px] text-ink/60">
            <span>
              {pad(n)} / {pad(total)}
            </span>
            <span aria-hidden>·</span>
            <span>{p.year}</span>
            <span aria-hidden>·</span>
            <span>{p.duration}</span>
          </p>
          <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl">{p.title}</h3>
          <p className="type-display mt-2 text-xl text-eminence italic">{p.role}</p>
          <p className="mt-4 line-clamp-5 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
          <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {p.tools?.join(" · ")}</p>
          <a href={`/videos#${p.id}`} className="gel mt-6 inline-flex min-h-[44px] items-center gap-2 px-5">
            Watch it <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
