import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import { Lotus, Leaf, Sparkle4, Orb, Bellflower, Blossom, Fern } from "./Botanicals";
import { Cloud, Orbit, GlowSparkle, Star5, PixelFlower, PixelArt } from "./Ethereal";

/* --depth drives the pointer parallax (PointerFX writes `translate` on .px
   elements only); --sway / --dur / --td set each loop's own pace. */
const at = (depth: number, extra: Record<string, string | number> = {}) => ({ "--depth": depth, ...extra }) as CSSProperties;
const loop = (vars: Record<string, string>) => vars as CSSProperties;

/**
 * The portrait, standing in the garden. No frame: the photo feathers out
 * into the sky, a cloud bank drifts behind its lower half, and the site's
 * own pieces — leaves, lotus, a bellflower, orbs, pixel sparkles, a glow —
 * sit around it at three depths, some behind the photo's edge and some in
 * front, the way the hero's bed rises in front of the name.
 *
 * Motion is the garden's: slow sway, drift and twinkle (paused off screen,
 * while scrolling, in lite mode and for reduced motion), the pointer
 * parallax on `.px`, and the near-pointer reactions on `[data-react]`.
 */
export function GardenPortrait() {
  return (
    <div className="relative isolate mx-auto w-full max-w-[340px] pt-6 pb-10 sm:max-w-[430px] lg:max-w-none lg:pt-2">
      {/* Behind the photo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="about-halo absolute top-[2%] left-[-10%] h-[86%] w-[120%]" />
        <div className="absolute top-[12%] left-[-14%] w-[128%] opacity-60">
          <Orbit className="w-full -rotate-[10deg]" dur="22s" />
        </div>
        <div className="px absolute top-[-2%] right-[-4%] w-[22%]" style={at(-4)}>
          <GlowSparkle className="twinkle dof-far w-full" />
        </div>
        <div className="px absolute bottom-[8%] left-[-30%] w-[100%]" style={at(-4)}>
          <Cloud className="drift-x dof-mid w-full -scale-x-100 opacity-90" style={loop({ "--dur": "24s", "--drift": "18px" })} />
        </div>
        <div className="px absolute bottom-[18%] left-[-8%] w-[13%]" style={at(8, { "--sway": "9s" })}>
          <Fern className="sway w-full -rotate-[14deg]" />
        </div>
        <div className="px absolute top-[34%] right-[-9%] w-[9%]" style={at(10)}>
          <Fern className="sway dof-mid w-full rotate-[16deg]" />
        </div>
        <PixelArt name="swirl" className="absolute top-[4%] left-[-6%] w-[24%] opacity-60" />
        <Star5 className="twinkle absolute top-[16%] right-[2%] h-3 w-3 text-white" />
      </div>

      {/* The photo, feathered into the sky */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/work/lana-portrait.webp"
        alt="Lana Denise Huertas"
        width={1136}
        height={1200}
        loading="lazy"
        decoding="async"
        className="about-photo relative block aspect-[1136/1200] w-full object-cover object-top"
      />

      {/* In front of the photo's edge */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 [&_[data-react]]:pointer-events-auto">
        <div className="px absolute bottom-[-2%] right-[-26%] w-[96%]" style={at(6)}>
          <Cloud className="drift-x w-full" style={loop({ "--dur": "30s", "--drift": "-22px" })} />
        </div>

        <div className="px absolute bottom-[14%] left-[-16%] w-[36%]" style={at(14)} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full -rotate-[30deg]" /></span>
        </div>
        <div className="px absolute right-[-14%] bottom-[30%] w-[30%]" style={at(16, { "--sway": "8s" })} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full -rotate-[150deg]" /></span>
        </div>

        <div className="px absolute bottom-[0%] left-[-6%] w-[34%]" style={at(24, { "--sway": "8.5s" })} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" deep /></span>
        </div>
        <div className="px absolute bottom-[4%] left-[22%] w-[14%]" style={at(30)} data-react="lotus">
          <span className="react block"><Lotus className="w-full" /></span>
        </div>
        <div className="px absolute right-[4%] bottom-[2%] w-[15%]" style={at(26, { "--sway": "7s" })} data-react="bell">
          <span className="react block"><Bellflower className="sway w-full -rotate-[8deg]" /></span>
        </div>
        <div className="px absolute right-[18%] bottom-[6%] w-[9%]" style={at(20, { "--sway": "9.5s" })} data-react="bell">
          <span className="react block"><Bellflower className="sway dof-mid w-full rotate-[10deg]" deep /></span>
        </div>
        <div className="px absolute right-[-6%] bottom-[16%] w-[11%]" style={at(22)} data-react="blossom">
          <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
        </div>

        <div className="px absolute top-[32%] left-[-9%] w-[8%]" style={at(26)} data-react="orb">
          <span className="react block"><Orb className="drift-y w-full [animation-delay:-5s]" /></span>
        </div>
        <div className="px absolute top-[10%] right-[6%] w-[5.5%]" style={at(30)} data-react="orb">
          <span className="react block"><Orb className="drift-y w-full" /></span>
        </div>

        <div className="absolute top-[3%] left-[8%] w-[11%]">
          <PixelArt name="sparkle" className="twinkle w-full" style={loop({ "--tw": "5s" })} />
        </div>
        <PixelArt name="sparkle" className="twinkle absolute top-[54%] right-[-10%] w-[7%]" style={loop({ "--td": "-2s" })} />
        <PixelArt name="heart" className="drift-y absolute top-[22%] right-[-6%] w-[3.4%] min-w-[11px]" style={loop({ "--dur": "9s" })} />
        <PixelArt name="daisy" className="drift-y absolute top-[62%] left-[-12%] w-[6%] min-w-[18px]" style={loop({ "--dur": "11s", "--td": "-4s" })} />
        <div className="px absolute top-[44%] right-[-3%] w-[5%]" style={at(18)} data-react="pixel">
          <span className="react block"><PixelFlower className="w-full" /></span>
        </div>
        <Sparkle4 className="twinkle absolute top-[20%] left-[-4%] h-4 w-4 text-white" />
        <Sparkle4 className="twinkle absolute top-[-1%] right-[24%] h-3 w-3 text-white [animation-delay:-1.8s]" />
      </div>
    </div>
  );
}

/**
 * The "about me" tab: the pitch.
 */
export default function AboutMe() {
  return (
    <div>
      <h3 className="type-display text-[1.85rem] leading-[1.15] text-iris sm:text-[2.4rem]">{profile.aboutHeadline}</h3>
      <p className="type-display mt-3 text-[1.6rem] leading-tight text-eminence italic sm:text-[2rem]">{profile.aboutKicker}</p>
      <p className="mt-6 max-w-[58ch] text-base leading-[1.7] text-ink/85 sm:text-[17px]">
        Publicity art, scalable templates and paced video edits for student organizations and clients, and, as a Computer Science
        student, the interfaces I design I can also build. Detail-obsessed and always on time.
      </p>

    </div>
  );
}
