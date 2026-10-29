import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import MorphName from "./MorphName";
import { Lotus, Leaf, Spiral, Sparkle4, Orb, LongVine, Bellflower, Blossom, Fern } from "./Botanicals";
import { Cloud, Orbit, ShootingStar, GlowSparkle, Star5, StarBurst, PixelFlower, Staff, PixelArt } from "./Ethereal";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const depth = (n: number, sway?: string) =>
  ({ "--depth": n, ...(sway ? { "--sway": sway } : {}) }) as CSSProperties;

/* The vine passes in front of the name in two stretches and behind it
   elsewhere: the front copy is masked down to those stretches. */
const VINE_FRONT: CSSProperties = {
  maskImage: "linear-gradient(90deg, transparent 0 16%, #000 16% 29%, transparent 29% 57%, #000 57% 70%, transparent 70%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0 16%, #000 16% 29%, transparent 29% 57%, #000 57% 70%, transparent 70%)",
};

/**
 * One screen of garden with the name grown into it. The dawn sky fills the
 * hero; far clouds, the orbit and the pixel swirls sit behind the letters,
 * the vine weaves through them, and the bed of lotus and bellflowers forms
 * the lower border. The name, subline and call to action are one block,
 * centred in the screen. The guide butterfly (Butterfly.tsx) starts perched
 * on the name.
 *
 * Interactive layers are unchanged: the name morphs and scrambles, and the
 * garden drifts with the pointer and reacts when it comes near.
 */
export default function Hero() {
  // overflow-clip, not -hidden: a hidden box is a scroll container, and the
  // .sl-par layers' view() timeline would bind to it instead of the page.
  return (
    <section className="bloom-zone relative isolate flex min-h-[100svh] flex-col justify-center overflow-clip pt-16 pb-[14svh]">
      {/* The sky, edge to edge, fading into the page at the bottom */}
      <div
        aria-hidden
        className="sheet-fade absolute inset-0 -z-10 overflow-clip"
        style={{
          background:
            "radial-gradient(46% 40% at 50% 34%, #fff6ea 0%, transparent 72%), linear-gradient(180deg, #dfe4fb 0%, #c8d0f6 22%, #c9b9ec 46%, #f2b8cf 70%, #f6d3c3 86%, #f3dccf 100%)",
        }}
      >
        <div className="px absolute top-[8%] right-[6%] w-[26%]" style={depth(-3)}>
          <Cloud priority className="drift-x dof-far w-full opacity-70" style={{ "--dur": "26s" } as CSSProperties} />
        </div>
        <div className="px absolute top-[30%] -left-[12%] w-[46%]" style={depth(-4)}>
          <Cloud priority className="drift-x dof-mid w-full -scale-x-100 opacity-85" style={{ "--dur": "22s", "--td": "-8s" } as CSSProperties} />
        </div>
        <div className="px absolute -right-[14%] bottom-[18%] w-[70%]" style={depth(-6)}>
          <Cloud className="drift-x w-full" style={{ "--dur": "30s", "--drift": "-36px" } as CSSProperties} />
        </div>
        <div className="absolute top-[52%] -left-[6%] w-[112%] opacity-50">
          <Staff className="drift-x w-full" />
        </div>
        <Orbit className="absolute top-[14%] left-[14%] w-[72%] opacity-70" />
        <ShootingStar className="top-[8%] left-[8%] w-[22%]" style={{ "--every": "9s", "--td": "1.5s" } as CSSProperties} />
        <div className="absolute top-[12%] right-[8%] h-16 w-16 sm:h-24 sm:w-24">
          <GlowSparkle className="twinkle dof-far h-full w-full" />
        </div>
        <Star5 className="twinkle absolute top-[10%] left-[42%] h-2.5 w-2.5 text-white" />
        <Star5 className="twinkle absolute top-[48%] left-[8%] h-3 w-3 text-white/90" />
        <StarBurst className="twinkle absolute top-[18%] left-[64%] h-4 w-4 text-white" />

        <div className="light-leak absolute inset-0" />
        <span className="bokeh drift-y absolute top-[8%] left-[6%] h-24 w-24 opacity-60" style={{ "--bk": "#ffffff", "--dur": "14s" } as CSSProperties} />
        <span className="bokeh drift-y absolute top-[44%] right-[3%] h-32 w-32 opacity-50" style={{ "--bk": "#f2b8cf", "--dur": "17s", "--td": "-5s" } as CSSProperties} />
        <span className="bokeh-ring absolute top-[14%] left-[34%] h-10 w-10" />
        <div className="dither absolute inset-x-0 bottom-0 h-[34%] opacity-70" />
        <div className="dither absolute inset-x-0 top-0 h-[22%] -scale-y-100 opacity-50" />
        <PixelArt name="swirl" className="absolute top-[14%] left-[5%] w-[12%] min-w-[80px] opacity-75" />
        <PixelArt name="swirl" className="absolute top-[20%] right-[6%] w-[10%] min-w-[70px] -scale-x-100 opacity-65" />
        <PixelArt name="cloud" className="drift-x absolute top-[26%] left-[26%] w-[8%] min-w-[56px] opacity-75" style={{ "--dur": "20s", "--drift": "40px" } as CSSProperties} />
        <PixelArt name="daisy" className="drift-y absolute top-[46%] right-[16%] w-[2.4%] min-w-[20px] opacity-90" style={{ "--dur": "9s" } as CSSProperties} />
        <PixelArt name="heart" className="absolute top-[40%] left-[18%] w-[1.3%] min-w-[11px] opacity-90" />
        <PixelArt name="sparkle" className="twinkle absolute top-[7%] left-[62%] w-[2.6%] min-w-[24px]" />
        <div className="band-grain absolute inset-0" />
        <Sparkle4 className="px sl-par absolute top-[16%] left-[24%] h-4 w-4 text-white" />
        <Sparkle4 className="px sl-par absolute top-[50%] right-[20%] h-7 w-7 text-white/90" />
        <Sparkle4 className="px sl-par absolute top-[28%] right-[38%] h-3 w-3 text-white" />
      </div>

      {/* Vine, behind the name */}
      <div aria-hidden data-rv className="px sl-par pointer-events-none absolute top-[33%] -left-[6%] w-[112%] sm:top-[35%]" style={depth(-8)}>
        <LongVine className="w-full" />
      </div>

      {/* The name, in the sky */}
      <div data-rv style={d(80)} className="relative z-10 mx-auto w-full max-w-6xl px-4 text-center sm:px-8">
        <div data-perch className="px relative inline-block" style={depth(4)}>
          <MorphName
            label={profile.name}
            words={[
              { text: "Lana", italic: false, className: "type-name text-[24vw] whitespace-nowrap text-iris sm:mr-[0.2em] sm:inline-block sm:text-[11vw] xl:text-[10.5rem]" },
              { text: "Denise", italic: false, className: "type-name text-[24vw] whitespace-nowrap text-iris sm:inline-block sm:text-[11vw] xl:text-[10.5rem]" },
            ]}
          />
          <Sparkle4 className="spin-slow pointer-events-none absolute top-[4%] -right-[4%] h-8 w-8 text-sky sm:h-12 sm:w-12" />
          <Sparkle4 className="pointer-events-none absolute bottom-[8%] -left-[3%] h-5 w-5 text-lavender sm:h-7 sm:w-7" />
        </div>
      </div>

      {/* Vine, in front of the name where it crosses */}
      <div aria-hidden data-rv className="px sl-par pointer-events-none absolute top-[33%] -left-[6%] z-20 w-[112%] sm:top-[35%]" style={{ ...depth(-8), ...VINE_FRONT }}>
        <LongVine className="w-full" />
      </div>

      {/* Garden floor: the bed rises into the lower edge of the letters */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto h-[56%] max-w-[1500px] sm:h-[60%] [&_[data-react]]:pointer-events-auto">
        <div className="px sl-par absolute top-[14%] -left-[2%] w-[22%] sm:w-[15%]" style={depth(14)} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full -rotate-[28deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[6%] right-[4%] w-[20%] sm:w-[13%]" style={depth(16)} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full rotate-[152deg]" /></span>
        </div>
        <div className="px sl-par absolute right-[2%] bottom-[2%] w-[18%] sm:w-[12%]" style={depth(12)} data-react="leaf">
          <span className="react block"><Leaf className="w-full -rotate-[150deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[4%] left-[30%] w-[6%]" style={depth(22)}>
          <Spiral className="spin-slow w-full" />
        </div>
        <div className="px sl-par absolute top-[22%] right-[30%] w-[4.5%]" style={depth(20)}>
          <Spiral className="w-full" stroke="#b9379d" />
        </div>
        <div className="px sl-par absolute right-[27%] bottom-[8%] w-[4.5%]" style={depth(26)} data-react="orb">
          <span className="react block"><Orb className="float-badge w-full" /></span>
        </div>
        <div className="px sl-par absolute top-[18%] left-[13%] w-[3.2%]" style={depth(30)} data-react="orb">
          <span className="react block"><Orb className="float-badge w-full" /></span>
        </div>

        <div className="px sl-par absolute bottom-[4%] left-[4%] w-[9%] sm:w-[7%]" style={depth(10, "9s")} data-react="leaf">
          <span className="react block"><Fern className="sway w-full -rotate-[14deg]" /></span>
        </div>
        <div className="px sl-par absolute right-[5%] bottom-[6%] w-[8%] sm:w-[6%]" style={depth(10)} data-react="leaf">
          <span className="react block"><Fern className="w-full rotate-[12deg]" /></span>
        </div>
        <div className="px sl-par absolute bottom-[10%] left-[60%] w-[5%] sm:w-[4%]" style={depth(8)} data-react="leaf">
          <span className="react block"><Fern className="dof-mid w-full rotate-[6deg] opacity-80" /></span>
        </div>

        <div className="px sl-par absolute bottom-[2%] left-[19%] w-[15%] sm:w-[10%]" style={depth(28, "8.5s")} data-react="bell">
          <span className="react block"><Bellflower className="sway w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[20%] bottom-[8%] w-[11%] sm:w-[8%]" style={depth(26, "7s")} data-react="bell">
          <span className="react block"><Bellflower className="sway w-full -rotate-[8deg]" deep /></span>
        </div>
        <div className="px sl-par absolute top-[10%] left-[44%] w-[6%] sm:w-[4%]" style={depth(18)} data-react="bell">
          <span className="react block"><Bellflower className="dof-mid w-full rotate-[10deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[24%] left-[6%] w-[7%] sm:w-[4.5%]" style={depth(24)} data-react="blossom">
          <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
        </div>
        <div className="px sl-par absolute top-[36%] right-[12%] w-[5%] sm:w-[3.2%]" style={depth(20)} data-react="blossom">
          <span className="react block"><Blossom className="w-full" /></span>
        </div>

        <div className="px absolute top-[2%] left-[38%] w-[5%] sm:w-[3.2%]" style={depth(22)} data-react="pixel">
          <span className="react block"><PixelFlower className="w-full" /></span>
        </div>
        <div className="px absolute top-[40%] left-[2%] w-[3.4%] sm:w-[2.2%]" style={depth(16)} data-react="pixel">
          <span className="react block"><PixelFlower className="w-full opacity-90" /></span>
        </div>

        <div className="px sl-par absolute bottom-0 left-[31%] w-[38%] sm:left-[36%] sm:w-[28%]" style={depth(24)} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[13%] bottom-[5%] w-[17%] sm:w-[12%]" style={depth(34, "9s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" deep /></span>
        </div>
        <div className="px sl-par absolute bottom-[8%] left-[16%] w-[13%] sm:w-[9%]" style={depth(30, "8s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" deep /></span>
        </div>
        <div className="px sl-par absolute bottom-[4%] left-[30%] w-[9%] sm:w-[6%]" style={depth(38)} data-react="lotus">
          <span className="react block"><Lotus className="w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[28%] bottom-[2%] w-[8%] sm:w-[5.5%]" style={depth(40)} data-react="lotus">
          <span className="react block"><Lotus className="w-full" /></span>
        </div>

        <div className="px pointer-events-none absolute -bottom-[8%] -left-[4%] w-[16%] sm:w-[11%]" style={depth(60)}>
          <Blossom className="dof-near w-full" deep />
        </div>
        <div className="px pointer-events-none absolute -right-[3%] -bottom-[4%] w-[9%] sm:w-[6%]" style={depth(56)}>
          <Blossom className="dof-near w-full" />
        </div>
      </div>

      {/* Right under the name: the subline and the one call to action */}
      <div className="relative z-30 mx-auto mt-2 w-full max-w-3xl px-4 text-center sm:mt-4">
        <div className="bg-[radial-gradient(closest-side,rgb(255_250_240/0.85),rgb(255_250_240/0.5)_70%,transparent)] px-6 py-5">
          <p data-rv style={d(420)} className="type-display text-2xl leading-tight text-ink italic sm:text-[2.4rem]">
            {profile.heroShort}
          </p>
          <div data-rv style={d(480)} className="mt-6 flex justify-center">
            <a href="#branding" className="btn">
              See the work <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
