import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import MorphName from "./MorphName";
import { Lotus, Leaf, Spiral, Sparkle4, Orb, LongVine, Bellflower, Blossom, Fern } from "./Botanicals";
import { Cloud, Butterfly, Orbit, ShootingStar, GlowSparkle, Star5, StarBurst, PixelFlower, Staff, PixelArt } from "./Ethereal";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const depth = (n: number, sway?: string) =>
  ({ "--depth": n, ...(sway ? { "--sway": sway } : {}) }) as CSSProperties;

/**
 * Poster-style opener, after the botanical portfolio covers: a date line, the
 * name on one line in a thin serif, then a gradient band with flowers spilling
 * over its edges. Corner labels pin the composition like a printed sheet.
 *
 * Interactive layers: the name (hover decays letters, the cursor lifts them,
 * click scrambles) and the garden (drifts with the pointer, lotus blooms on
 * hover, and the band widens as the page scrolls).
 */
export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Name — one line, one size */}
        <div data-rv style={d(80)} className="relative mt-6 text-center sm:mt-10">
          <MorphName
            label={profile.name}
            words={[
              {
                text: "Lana Denise",
                italic: false,
                className: "type-name text-[17vw] whitespace-nowrap text-iris xl:text-[13.5rem]",
              },
            ]}
          />
          <Sparkle4 className="spin-slow pointer-events-none absolute top-[6%] right-[4%] h-8 w-8 text-sky sm:h-12 sm:w-12" />
          <Sparkle4 className="pointer-events-none absolute bottom-[8%] left-[3%] h-5 w-5 text-lavender sm:h-7 sm:w-7" />
        </div>
      </div>

      {/* Garden band. No frame: the dawn sky behind it runs edge to edge and
          dissolves into the page on every side, so the garden grows out of
          the hero instead of sitting on it in a box. The end card closes the
          page on the same sky at dusk. */}
      <div data-rv style={d(260)} className="relative mx-auto mt-2 max-w-6xl px-4 sm:px-8">
        <div className="bloom-zone relative h-[50vw] max-h-[460px] min-h-[260px]">
          {/* The sky: full-bleed, edges dissolved */}
          <div
            aria-hidden
            className="sheet-fade absolute top-[2%] -bottom-[10%] left-[calc(50%-50vw)] w-screen overflow-hidden"
            style={{
              background:
                "radial-gradient(42% 58% at 50% 64%, #fff6ea 0%, transparent 72%), linear-gradient(180deg, #c8d0f6 0%, #c9b9ec 34%, #f2b8cf 64%, #f6d3c3 84%, #f3dccf 100%)",
            }}
          >
            {/* Sky inside the sheet: far clouds, an orbit, a comet */}
            <div className="px absolute top-[6%] right-[10%] w-[26%]" style={depth(-3)}>
              <Cloud className="drift-x dof-far w-full opacity-70" style={{ "--dur": "26s" } as CSSProperties} />
            </div>
            <div className="px absolute top-[30%] -left-[12%] w-[46%]" style={depth(-4)}>
              <Cloud className="drift-x dof-mid w-full -scale-x-100 opacity-85" style={{ "--dur": "22s", "--td": "-8s" } as CSSProperties} />
            </div>
            <div className="px absolute -right-[14%] bottom-[2%] w-[70%]" style={depth(-6)}>
              <Cloud className="drift-x w-full" style={{ "--dur": "30s", "--drift": "-36px" } as CSSProperties} />
            </div>
            {/* A staff of music drifting through the sky, behind the bed */}
            <div className="absolute top-[30%] -left-[6%] w-[112%] opacity-50">
              <Staff className="drift-x w-full" />
            </div>
            <Orbit className="absolute top-[10%] left-[18%] w-[64%] opacity-80" />
            <ShootingStar className="top-[10%] left-[8%] w-[22%]" style={{ "--every": "9s", "--td": "1.5s" } as CSSProperties} />
            <div className="absolute top-[18%] right-[8%] h-16 w-16 sm:h-24 sm:w-24">
              <GlowSparkle className="twinkle dof-far h-full w-full" />
            </div>
            <Star5 className="twinkle absolute top-[12%] left-[42%] h-2.5 w-2.5 text-white" />
            <Star5 className="twinkle absolute top-[58%] left-[8%] h-3 w-3 text-white/90" />
            <StarBurst className="twinkle absolute top-[22%] left-[62%] h-4 w-4 text-white" />

            {/* Print textures: a light leak, bokeh, and fine pixel dither
                dissolving in from the top and settling at the ground. */}
            <div className="light-leak absolute inset-0" />
            <span className="bokeh drift-y absolute top-[8%] left-[6%] h-24 w-24 opacity-60" style={{ "--bk": "#ffffff", "--dur": "14s" } as CSSProperties} />
            <span className="bokeh drift-y absolute top-[40%] right-[3%] h-32 w-32 opacity-50" style={{ "--bk": "#f2b8cf", "--dur": "17s", "--td": "-5s" } as CSSProperties} />
            <span className="bokeh-ring drift-y absolute top-[14%] left-[34%] h-10 w-10" style={{ "--dur": "11s" } as CSSProperties} />
            <div className="dither absolute inset-x-0 bottom-0 h-[42%] opacity-70" />
            <div className="dither absolute inset-x-0 top-0 h-[30%] -scale-y-100 opacity-60" />
            {/* Pixel drawings in the sky, after the swirl and grove posters */}
            <PixelArt name="swirl" className="absolute top-[12%] left-[8%] w-[13%] min-w-[90px] opacity-80" />
            <PixelArt name="swirl" className="absolute top-[18%] right-[9%] w-[11%] min-w-[80px] -scale-x-100 opacity-70" />
            <PixelArt name="butterfly" className="drift-y absolute top-[9%] left-[46%] w-[2.2%] min-w-[20px] opacity-90" />
            <PixelArt name="cloud" className="drift-x absolute top-[22%] left-[28%] w-[9%] min-w-[64px] opacity-75" style={{ "--dur": "20s", "--drift": "40px" } as CSSProperties} />
            <PixelArt name="daisy" className="drift-y absolute top-[40%] right-[16%] w-[2.6%] min-w-[22px] opacity-90" style={{ "--dur": "9s" } as CSSProperties} />
            <PixelArt name="heart" className="absolute top-[30%] left-[18%] w-[1.4%] min-w-[12px] opacity-90" />
            <PixelArt name="sparkle" className="twinkle absolute top-[6%] left-[64%] w-[3%] min-w-[26px]" />
            <div className="band-grain absolute inset-0" />
            <Sparkle4 className="px sl-par absolute top-[16%] left-[24%] h-4 w-4 text-white" />
            <Sparkle4 className="px sl-par spin-slow absolute top-[48%] right-[20%] h-7 w-7 text-white/90" />
            <Sparkle4 className="px sl-par absolute top-[26%] right-[38%] h-3 w-3 text-white" />
            <Sparkle4 className="px sl-par absolute bottom-[20%] left-[38%] h-5 w-5 text-white/80" />
          </div>

          {/* Back layer: one long vine weaving the width of the garden,
              drawing itself in, then sprouting leaves along its length */}
          <div className="px sl-par absolute top-[2%] -left-[6%] w-[112%]" style={depth(-8)}>
            <LongVine className="w-full" />
          </div>

          {/* Mid layer: leaves, spirals, beads */}
          <div className="px sl-par absolute bottom-[0%] -left-[2%] w-[24%] sm:w-[18%]" style={depth(14)} data-react="leaf">
            <span className="react block"><Leaf className="sway w-full -rotate-[28deg]" /></span>
          </div>
          <div className="px sl-par absolute top-[8%] right-[6%] w-[20%] sm:w-[15%]" style={depth(16)} data-react="leaf">
            <span className="react block"><Leaf className="sway w-full rotate-[152deg]" /></span>
          </div>
          <div className="px sl-par absolute right-[2%] bottom-[2%] w-[18%] sm:w-[13%]" style={depth(12, "8s")} data-react="leaf">
            <span className="react block"><Leaf className="sway w-full -rotate-[150deg]" /></span>
          </div>
          <div className="px sl-par absolute top-[8%] left-[28%] w-[7%]" style={depth(22)}>
            <Spiral className="spin-slow w-full" />
          </div>
          <div className="px sl-par absolute top-[30%] right-[30%] w-[5%]" style={depth(20)}>
            <Spiral className="spin-slow w-full" stroke="#b9379d" />
          </div>
          <div className="px sl-par absolute right-[27%] bottom-[6%] w-[5%]" style={depth(26)} data-react="orb">
            <span className="react block"><Orb className="float-badge w-full" /></span>
          </div>
          <div className="px sl-par absolute top-[22%] left-[13%] w-[3.5%]" style={depth(30)} data-react="orb">
            <span className="react block"><Orb className="float-badge w-full" /></span>
          </div>
          <div className="px sl-par absolute top-[40%] left-[42%] w-[2.5%]" style={depth(34)} data-react="orb">
            <span className="react block"><Orb className="float-badge w-full" /></span>
          </div>

          {/* Ferns rising off both edges, behind the bed */}
          <div className="px sl-par absolute bottom-[4%] left-[4%] w-[9%] sm:w-[7%]" style={depth(10, "9s")} data-react="leaf">
            <span className="react block"><Fern className="sway w-full -rotate-[14deg]" /></span>
          </div>
          <div className="px sl-par absolute right-[5%] bottom-[6%] w-[8%] sm:w-[6%]" style={depth(10, "10s")} data-react="leaf">
            <span className="react block"><Fern className="sway w-full rotate-[12deg]" /></span>
          </div>
          <div className="px sl-par absolute bottom-[10%] left-[60%] w-[5%] sm:w-[4%]" style={depth(8, "7.5s")} data-react="leaf">
            <span className="react block"><Fern className="sway dof-mid w-full rotate-[6deg] opacity-80" /></span>
          </div>

          {/* Poster flowers among the lotus, three sizes */}
          <div className="px sl-par absolute bottom-[2%] left-[19%] w-[15%] sm:w-[11%]" style={depth(28, "8.5s")} data-react="bell">
            <span className="react block"><Bellflower className="sway w-full" /></span>
          </div>
          <div className="px sl-par absolute right-[20%] bottom-[8%] w-[11%] sm:w-[8.5%]" style={depth(26, "7s")} data-react="bell">
            <span className="react block"><Bellflower className="sway w-full -rotate-[8deg]" deep /></span>
          </div>
          <div className="px sl-par absolute right-[35%] bottom-[18%] w-[6%] sm:w-[4.5%]" style={depth(18, "6s")} data-react="bell">
            <span className="react block"><Bellflower className="sway dof-mid w-full rotate-[10deg]" /></span>
          </div>
          <div className="px sl-par absolute top-[30%] left-[6%] w-[7%] sm:w-[5%]" style={depth(24)} data-react="blossom">
            <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
          </div>
          <div className="px sl-par absolute top-[50%] right-[12%] w-[5%] sm:w-[3.5%]" style={depth(20)} data-react="blossom">
            <span className="react block"><Blossom className="w-full" /></span>
          </div>
          <div className="px sl-par absolute top-[22%] left-[52%] w-[3%] sm:w-[2.2%]" style={depth(12)} data-react="blossom">
            <span className="react block"><Blossom className="dof-far w-full" /></span>
          </div>

          {/* Pixel flowers, three sizes, pinned over the sheet like stickers */}
          <div className="px absolute top-[9%] left-[40%] w-[5%] sm:w-[3.6%]" style={depth(22)} data-react="pixel">
            <span className="react block"><PixelFlower className="drift-y w-full" /></span>
          </div>
          <div className="px absolute top-[52%] left-[2%] w-[3.4%] sm:w-[2.4%]" style={depth(16)} data-react="pixel">
            <span className="react block"><PixelFlower className="w-full opacity-90" /></span>
          </div>
          <div className="px absolute right-[9%] bottom-[30%] w-[2.6%] sm:w-[1.8%]" style={depth(12)} data-react="pixel">
            <span className="react block"><PixelFlower className="w-full opacity-80" /></span>
          </div>

          {/* Butterflies: one near and crisp, one far and soft */}
          <div className="px absolute top-[10%] right-[19%] w-[15%] sm:w-[11%]" style={depth(36)} data-react="butterfly">
            <span className="react block">
              <span className="flutter block">
                <Butterfly className="w-full rotate-[16deg]" />
              </span>
            </span>
          </div>
          <div className="px absolute top-[42%] left-[24%] w-[5%] sm:w-[3.5%]" style={{ ...depth(10), "--dur": "9s", "--td": "-3s", "--flap": "1.2s" } as CSSProperties} data-react="butterfly">
            <span className="react block">
              <span className="flutter block">
                <Butterfly className="dof-mid w-full -rotate-[18deg]" style={{ "--flap": "1.3s" } as CSSProperties} />
              </span>
            </span>
          </div>

          {/* Front: the lotus bed */}
          <div className="px sl-par absolute bottom-0 left-[31%] w-[38%] sm:left-[35%] sm:w-[30%]" style={depth(24)} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" /></span>
          </div>
          <div className="px sl-par absolute right-[13%] bottom-[5%] w-[17%] sm:w-[13%]" style={depth(34, "9s")} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" deep /></span>
          </div>
          <div className="px sl-par absolute bottom-[8%] left-[16%] w-[13%] sm:w-[10%]" style={depth(30, "8s")} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" deep /></span>
          </div>
          <div className="px sl-par absolute bottom-[4%] left-[30%] w-[9%] sm:w-[7%]" style={depth(38, "10s")} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" /></span>
          </div>
          <div className="px sl-par absolute right-[28%] bottom-[2%] w-[8%] sm:w-[6%]" style={depth(40, "6.5s")} data-react="lotus">
            <span className="react block"><Lotus className="sway w-full" /></span>
          </div>

          {/* Out-of-focus foreground: closest to the viewer, so the softest */}
          <div className="px pointer-events-none absolute -bottom-[10%] -left-[4%] w-[16%] sm:w-[12%]" style={depth(60)}>
            <Blossom className="dof-near w-full" deep />
          </div>
          <div className="px pointer-events-none absolute -right-[3%] -bottom-[6%] w-[9%] sm:w-[7%]" style={depth(56)}>
            <Blossom className="dof-near w-full" />
          </div>
        </div>
      </div>

      {/* Subline, after ref 1's "GRAPHIC DESIGN / Graphic / Visual / …" */}
      <div className="mx-auto mt-12 max-w-6xl px-4 text-center sm:px-8">

        <p
          data-rv
          style={d(420)}
          className="type-display mx-auto mt-8 max-w-2xl text-3xl leading-tight text-ink italic sm:text-[2.6rem]"
        >
          {profile.heroShort}
        </p>

        <div data-rv style={d(480)} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#work" className="gel flex min-h-[46px] items-center gap-2 px-5">
            See the work <span aria-hidden>↓</span>
          </a>
        </div>

      </div>

    </section>
  );
}
