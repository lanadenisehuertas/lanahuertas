import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import { Lotus, Leaf, Sparkle4, Bellflower, Blossom, Fern } from "./Botanicals";
import { Cloud, Orbit, GlowSparkle, Star5, PixelFlower, PixelArt } from "./Ethereal";
import ToolBubbles from "./ToolBubbles";

/* --depth drives the pointer parallax (PointerFX writes `translate` on .px
   elements only); --sway / --dur / --td set each loop's own pace. */
const at = (depth: number, extra: Record<string, string | number> = {}) => ({ "--depth": depth, ...extra }) as CSSProperties;
const loop = (vars: Record<string, string>) => vars as CSSProperties;

/**
 * The portrait, framed as an arched window standing in the garden: a tall
 * arch with a pearl rim (lavender, pink, peach, mint) and a white hairline,
 * a soft lavender glow, a cloud bank behind its foot and the site's own
 * pieces — leaves, lotus, bell flowers, pixel sparkles — around it, some in
 * front of the frame's lower edge.
 *
 * The app logos float in the column's margins as bubbles you can pop
 * (ToolBubbles); on phones and tablets they gather under the portrait.
 *
 * Motion is the garden's: slow sway, drift and twinkle (paused off screen,
 * in lite mode and for reduced motion), the pointer parallax on `.px`, and
 * the near-pointer reactions on `[data-react]`.
 */
export function GardenPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[460px] lg:max-w-none">
      <div className="relative isolate mx-auto w-[80%] pt-8 pb-12 lg:w-[66%] lg:pt-4">
        {/* Behind the frame */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="about-halo absolute top-[0%] left-[-22%] h-[90%] w-[144%]" />
          <div className="absolute top-[14%] left-[-26%] w-[152%] opacity-55">
            <Orbit className="w-full -rotate-[10deg]" dur="22s" />
          </div>
          <div className="px absolute top-[-1%] right-[-12%] w-[24%]" style={at(-4)}>
            <GlowSparkle className="twinkle dof-far w-full" />
          </div>
          <div className="px absolute bottom-[6%] left-[-40%] w-[120%]" style={at(-4)}>
            <Cloud className="drift-x dof-mid w-full -scale-x-100 opacity-90" style={loop({ "--dur": "24s", "--drift": "18px" })} />
          </div>
          <div className="px absolute bottom-[16%] left-[-12%] w-[14%]" style={at(8, { "--sway": "9s" })}>
            <Fern className="sway w-full -rotate-[14deg]" />
          </div>
          <div className="px absolute top-[40%] right-[-11%] w-[10%]" style={at(10)}>
            <Fern className="sway dof-mid w-full rotate-[16deg]" />
          </div>
          <PixelArt name="swirl" className="absolute top-[2%] left-[-16%] w-[26%] opacity-60" />
          <Star5 className="twinkle absolute top-[10%] right-[-6%] h-3 w-3 text-white" />
        </div>

        {/* The arched window */}
        <div className="about-arch">
          <div className="about-arch-pane">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/work/lana-portrait.webp"
              alt="Lana Denise Huertas"
              width={1136}
              height={1200}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>

        {/* In front of the frame's foot */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-10 [&_[data-react]]:pointer-events-auto">
          <div className="px absolute right-[-34%] bottom-[-3%] w-[100%]" style={at(6)}>
            <Cloud className="drift-x w-full" style={loop({ "--dur": "30s", "--drift": "-22px" })} />
          </div>

          <div className="px absolute bottom-[12%] left-[-20%] w-[36%]" style={at(14)} data-react="leaf">
            <span className="react block"><Leaf className="sway w-full -rotate-[30deg]" /></span>
          </div>
          <div className="px absolute right-[-18%] bottom-[26%] w-[28%]" style={at(16, { "--sway": "8s" })} data-react="leaf">
            <span className="react block"><Leaf className="sway w-full -rotate-[150deg]" /></span>
          </div>

          <div className="px absolute bottom-[0%] left-[-12%] w-[36%]" style={at(24, { "--sway": "8.5s" })} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" deep /></span>
          </div>
          <div className="px absolute bottom-[3%] left-[20%] w-[15%]" style={at(30)} data-react="lotus">
            <span className="react block"><Lotus className="w-full" /></span>
          </div>
          <div className="px absolute right-[0%] bottom-[1%] w-[16%]" style={at(26, { "--sway": "7s" })} data-react="bell">
            <span className="react block"><Bellflower className="sway w-full -rotate-[8deg]" /></span>
          </div>
          <div className="px absolute right-[16%] bottom-[5%] w-[10%]" style={at(20, { "--sway": "9.5s" })} data-react="bell">
            <span className="react block"><Bellflower className="sway dof-mid w-full rotate-[10deg]" deep /></span>
          </div>
          <div className="px absolute right-[-12%] bottom-[14%] w-[12%]" style={at(22)} data-react="blossom">
            <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
          </div>

          <div className="absolute top-[1%] left-[2%] w-[12%]">
            <PixelArt name="sparkle" className="twinkle w-full" style={loop({ "--tw": "5s" })} />
          </div>
          <PixelArt name="heart" className="drift-y absolute top-[24%] right-[-9%] w-[3.6%] min-w-[11px]" style={loop({ "--dur": "9s" })} />
          <PixelArt name="daisy" className="drift-y absolute top-[60%] left-[-14%] w-[6%] min-w-[18px]" style={loop({ "--dur": "11s", "--td": "-4s" })} />
          <div className="px absolute top-[50%] right-[-6%] w-[5.5%]" style={at(18)} data-react="pixel">
            <span className="react block"><PixelFlower className="w-full" /></span>
          </div>
          <Sparkle4 className="twinkle absolute top-[18%] left-[-6%] h-4 w-4 text-white" />
          <Sparkle4 className="twinkle absolute top-[-2%] right-[22%] h-3 w-3 text-white [animation-delay:-1.8s]" />
        </div>
      </div>

      {/* The app logos: in the margins on desktop, a cluster below on phones. */}
      <ToolBubbles variant="orbit" className="hidden lg:block" />
      <div className="relative z-20 mt-5 lg:hidden">
        <p className="type-pixel mb-1 flex items-center justify-center gap-2 text-[13px] text-ink/75">
          <Sparkle4 className="h-2.5 w-2.5 text-eminence" />
          the tools I use · tap to pop
        </p>
        <ToolBubbles variant="row" />
      </div>
    </div>
  );
}

/**
 * The "about me" tab: the pitch, then (on desktop) two more tool bubbles in
 * the space below it.
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

      <div className="mt-10 hidden lg:block">
        <p className="type-pixel flex items-center gap-2 text-[13px] text-ink/75">
          <Sparkle4 className="h-2.5 w-2.5 text-eminence" />
          the tools I use · pop a bubble
        </p>
        <ToolBubbles variant="meadow" />
      </div>
    </div>
  );
}
