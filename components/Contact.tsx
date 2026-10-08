import type { CSSProperties } from "react";
import { profile, socials } from "@/lib/content";
import { Lotus, Leaf, Spiral, Sparkle4, Orb, Bellflower, Blossom, Fern, LongVine } from "./Botanicals";
import { Cloud, Butterfly, Orbit, ShootingStar, GlowSparkle, Star5, StarBurst, PixelFlower, Staff, Note, PixelArt } from "./Ethereal";
import SectionTitle from "./SectionTitle";
import MorphName from "./MorphName";
import ContactForm from "./ContactForm";

/* Small glyphs for the bloom buttons — drawn, not emoji, so they match. */
const GLYPH: Record<string, React.ReactNode> = {
  email: <path d="M3 6h18v12H3z M3 6l9 7 9-7" />,
  linkedin: (
    <>
      <path d="M5 9v10 M5 5.5v.5" />
      <path d="M10 19v-6a3 3 0 0 1 6 0v6 M10 9v10" />
    </>
  ),
  github: (
    <path d="M9 19c-4 1.3-4-2-6-2.5m12 4.5v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.6 5.5 2.9 5.5 2.9a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.3c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21" />
  ),
  "canva site": <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M3 12h18 M12 3c3 3.5 3 14.5 0 18 M12 3c-3 3.5-3 14.5 0 18" />,
};

const PETALS = [0, 60, 120, 180, 240, 300];

const dp = (depth: number, extra: Record<string, string | number> = {}) => ({ "--depth": depth, ...extra }) as CSSProperties;

/**
 * The end card: the finale that gathers every motif on the page. Sunset at
 * the top fading into the garden's blue, the sky pieces (clouds, an orbit
 * round the thank-you, a comet, stars, bokeh), the print textures (dither,
 * grain) and the whole garden — lotus, bellflowers, blossoms, ferns,
 * pixel flowers, butterflies — spilling over the edges at three depths.
 *
 * It carries everything you'd act on: the thank-you (morphs like the name),
 * a bloom button per link, and a form that emails Lana directly.
 */
export default function Contact() {
  return (
    <section id="contact" className="relative px-4 pb-24 sm:px-8 sm:pb-28">
      <div className="relative mx-auto max-w-6xl">
        <SectionTitle id="contact-heading" index="03" lead="Get in" accent="touch" ornament="flourish" />

        <footer aria-labelledby="contact-heading" className="end-card bloom-zone relative overflow-visible">
          {/* The dusk sky: full-bleed, fading in from the page above and
              running to the very bottom — no frame, like the hero. */}
          <div
            aria-hidden
            className="sheet-fade-top absolute -top-[6%] -bottom-24 left-[calc(50%-50vw)] w-screen overflow-hidden sm:-bottom-28"
            style={{
              background:
                "radial-gradient(42% 30% at 50% 24%, #fff6ea 0%, transparent 72%), linear-gradient(180deg, #e6ebfb 0%, #f6d3c3 12%, #f2b8cf 28%, #c9b9ec 50%, #b3c0f2 74%, #9fb0ee 100%)",
            }}
          >
            <div className="light-leak absolute inset-0" />
            <span className="bokeh drift-y absolute top-[4%] left-[8%] h-28 w-28 opacity-60" style={{ "--bk": "#ffffff", "--dur": "15s" } as CSSProperties} />
            <span className="bokeh drift-y absolute top-[30%] right-[4%] h-40 w-40 opacity-45" style={{ "--bk": "#f2b8cf", "--dur": "18s", "--td": "-6s" } as CSSProperties} />
            <span className="bokeh drift-y absolute bottom-[26%] left-[3%] h-32 w-32 opacity-40" style={{ "--bk": "#a9b6f0", "--dur": "16s", "--td": "-3s" } as CSSProperties} />
            <span className="bokeh-ring drift-y absolute top-[18%] right-[22%] h-12 w-12" style={{ "--dur": "12s" } as CSSProperties} />
            <span className="bokeh-ring drift-y absolute bottom-[34%] left-[18%] h-8 w-8" style={{ "--dur": "10s", "--td": "-4s" } as CSSProperties} />

            {/* Stars and a comet in the upper sky */}
            <div className="absolute top-[6%] right-[10%] h-20 w-20 sm:h-28 sm:w-28">
              <GlowSparkle className="twinkle dof-far h-full w-full" />
            </div>
            <Star5 className="twinkle absolute top-[9%] left-[30%] h-3 w-3 text-white" />
            <Star5 className="twinkle absolute top-[22%] left-[14%] h-2.5 w-2.5 text-white/90 [animation-delay:-1.6s]" />
            <StarBurst className="twinkle absolute top-[14%] right-[30%] h-4 w-4 text-white [animation-delay:-2.4s]" />
            <Sparkle4 className="twinkle absolute top-[40%] left-[7%] h-4 w-4 text-white [animation-delay:-0.8s]" />
            <Sparkle4 className="twinkle absolute top-[48%] right-[8%] h-5 w-5 text-white [animation-delay:-3s]" />
            <ShootingStar className="top-[6%] left-[52%] w-[24%]" style={{ "--every": "12s", "--td": "4s", "--angle": "22deg" } as CSSProperties} />

            {/* The staff returns, lower, as the page's closing line */}
            <div className="absolute bottom-[30%] -left-[6%] w-[112%] opacity-45">
              <Staff className="drift-x w-full -scale-x-100" />
            </div>
            <Note className="drift-y absolute top-[26%] left-[24%] h-5 w-5 text-white/80" />
            <Note kind="beamed" className="drift-y absolute top-[34%] right-[18%] h-6 w-6 text-white/70 [animation-delay:-4s]" />

            {/* Cloud bank along the bottom, three depths */}
            <div className="px absolute -left-[14%] bottom-[10%] w-[60%]" style={dp(-4)}>
              <Cloud className="drift-x dof-mid w-full opacity-80" style={{ "--dur": "24s" } as CSSProperties} />
            </div>
            <div className="px absolute -right-[16%] bottom-[16%] w-[54%]" style={dp(-3)}>
              <Cloud className="drift-x dof-far w-full -scale-x-100 opacity-70" style={{ "--dur": "28s", "--td": "-9s" } as CSSProperties} />
            </div>
            <div className="px absolute -bottom-[3%] left-[14%] w-[76%]" style={dp(-6)}>
              <Cloud className="drift-x w-full" style={{ "--dur": "32s", "--drift": "-34px" } as CSSProperties} />
            </div>

            <div className="dither absolute inset-x-0 bottom-0 h-[30%] opacity-70" />
            <div className="dither absolute inset-x-0 top-[6%] h-[18%] -scale-y-100 opacity-50" />
            <PixelArt name="ornament" className="absolute top-[14%] left-[3%] hidden h-48 w-auto opacity-50 md:block" />
            <PixelArt name="ornament" className="absolute top-[14%] right-[3%] hidden h-48 w-auto opacity-50 md:block" />
            <PixelArt name="butterfly" className="drift-y absolute top-[40%] left-[30%] w-5 opacity-90" />
            <PixelArt name="moon" className="absolute top-[7%] left-[16%] w-12 opacity-90 sm:w-16" />
            <PixelArt name="note" className="drift-y absolute top-[56%] left-[12%] w-7 opacity-80" style={{ "--dur": "8s" } as CSSProperties} />
            <PixelArt name="note" className="drift-y absolute top-[60%] right-[14%] w-5 opacity-70" style={{ "--dur": "10s", "--td": "-3s" } as CSSProperties} />
            <PixelArt name="heart" className="absolute top-[33%] right-[27%] w-3.5 opacity-90" />
            <PixelArt name="heart" className="absolute top-[37%] left-[25%] w-2.5 opacity-80" />
            <PixelArt name="sparkle" className="twinkle absolute top-[22%] right-[9%] w-10" />
            <PixelArt name="cloud" className="drift-x absolute bottom-[38%] left-[6%] w-28 opacity-70" style={{ "--dur": "24s", "--drift": "30px" } as CSSProperties} />
            <PixelArt name="daisy" className="absolute bottom-[30%] right-[30%] w-6 opacity-90" />
            <div className="band-grain absolute inset-0" />
          </div>

          {/* Poster corners */}
          <div className="type-pixel relative flex items-start justify-between p-4 text-[10px] text-ink/65 sm:p-6 sm:text-[11px]">
            <span>
              ©2026 {profile.name}
              <br />
              {profile.location}
            </span>
            <a
              href="#top"
              className="rounded-full border border-ink/40 bg-white/40 px-3 py-1 transition-colors hover:bg-iris hover:text-paper"
            >
              Back to top ↑
            </a>
          </div>

          <div className="relative px-4 pt-4 pb-40 text-center sm:px-10 sm:pt-6 sm:pb-52">
            {/* The thank-you, ringed by an orbit and flanked by pixel swirls */}
            <div className="relative">
              <PixelArt name="swirl" className="absolute top-[18%] -left-2 hidden w-[12%] opacity-80 lg:block" />
              <PixelArt name="swirl" className="absolute top-[18%] -right-2 hidden w-[12%] -scale-x-100 opacity-80 lg:block" />
              <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[92%] -translate-x-1/2 -translate-y-[46%] sm:block">
                <Orbit className="w-full -rotate-[6deg]" dur="20s" />
              </span>
              <MorphName
                as="p"
                label="Thank you"
                words={[
                  {
                    text: "Thank you",
                    italic: true,
                    className: "type-name mt-1 text-[15vw] whitespace-nowrap text-iris italic xl:text-[10.5rem]",
                  },
                ]}
              />
            </div>

            <p className="mx-auto mt-4 max-w-md text-[15px] text-ink/75">
              Open to UI/UX and design roles, and to freelance brand, event and product work.
            </p>

            {/* Bloom buttons */}
            <ul className="mx-auto mt-10 flex max-w-2xl flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10">
              {socials.filter((s) => s.label !== "email").map((s, i) => (
                <li key={s.label} className="sl-pop" style={{ "--i": i } as CSSProperties}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="bloom-btn group flex flex-col items-center gap-2"
                  >
                    <span className="relative flex h-[72px] w-[72px] items-center justify-center">
                      {PETALS.map((r) => (
                        <span key={r} aria-hidden className="bloom-petal" style={{ "--r": `${r}deg` } as CSSProperties} />
                      ))}
                      <span className="bloom-orb relative flex h-full w-full items-center justify-center rounded-full">
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden
                          className="relative h-7 w-7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          {GLYPH[s.label]}
                        </svg>
                      </span>
                    </span>
                    <span className="type-display text-xl text-ink italic capitalize transition-colors group-hover:text-lavender">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* The form, with a butterfly resting on its corner */}
            <div className="relative z-20 mt-12" data-rv>
              <span aria-hidden data-react="butterfly" className="pointer-events-none absolute -top-10 right-[6%] z-10 w-16 sm:-top-12 sm:right-[calc(50%-18rem)] sm:w-20">
                <span className="react block">
                  <span className="flutter block" style={{ "--dur": "8s" } as CSSProperties}>
                    <Butterfly className="w-full rotate-[18deg]" style={{ "--flap": "1.4s" } as CSSProperties} />
                  </span>
                </span>
              </span>
              <PixelFlower className="pointer-events-none absolute -top-5 left-[8%] z-10 h-7 w-7 sm:left-[calc(50%-17rem)]" />
              <ContactForm />
            </div>
          </div>

          {/* The garden, spilling over the card edges at three depths */}
          <div aria-hidden className="pointer-events-none">
            {/* one vine weaving the whole bed together */}
            <div data-rv className="absolute bottom-[4%] left-[-3%] w-[106%]">
              <LongVine className="w-full" flip />
            </div>
            {/* back: ferns and leaves */}
            <div className="px sl-sprout absolute bottom-[2%] left-[9%] w-[9%] max-w-[80px]" style={dp(10, { "--i": 1, "--sway": "9s" })} data-react="leaf">
              <span className="react block"><Fern className="sway w-full -rotate-[10deg]" /></span>
            </div>
            <div className="px sl-sprout absolute right-[12%] bottom-[3%] w-[8%] max-w-[72px]" style={dp(10, { "--i": 2, "--sway": "10s" })} data-react="leaf">
              <span className="react block"><Fern className="sway w-full rotate-[12deg]" /></span>
            </div>
            <div className="px sl-sprout absolute top-[18%] -left-6 hidden w-[14%] sm:block" style={dp(-10, { "--i": 1 })} data-react="leaf">
              <span className="react block"><Leaf className="sway w-full -rotate-[20deg]" /></span>
            </div>
            <div className="px sl-sprout absolute top-[8%] -right-6 hidden w-[16%] sm:block" style={dp(-12, { "--i": 3 })} data-react="leaf">
              <span className="react block"><Leaf className="sway w-full rotate-[200deg]" /></span>
            </div>

            {/* mid: the flower bed */}
            <div className="px sl-sprout absolute -bottom-6 -left-4 w-[22%] max-w-[190px] sm:-left-8" style={dp(18)} data-react="lotus">
              <span className="react block"><Lotus className="sway w-full" deep /></span>
            </div>
            <div className="px sl-sprout absolute -right-4 -bottom-8 w-[26%] max-w-[230px] sm:-right-10" style={dp(24, { "--i": 2 })} data-react="lotus">
              <span className="react block"><Lotus className="sway w-full" /></span>
            </div>
            <div className="px sl-sprout absolute bottom-0 left-[17%] w-[11%] max-w-[110px]" style={dp(22, { "--i": 2, "--sway": "8.5s" })} data-react="bell">
              <span className="react block"><Bellflower className="sway w-full" /></span>
            </div>
            <div className="px sl-sprout absolute right-[22%] bottom-0 w-[9%] max-w-[90px]" style={dp(20, { "--i": 3, "--sway": "7.5s" })} data-react="bell">
              <span className="react block"><Bellflower className="sway w-full -rotate-[6deg]" deep /></span>
            </div>
            <div className="px sl-sprout absolute right-[33%] bottom-[2%] w-[5%] max-w-[52px]" style={dp(14, { "--i": 4, "--sway": "6.5s" })} data-react="bell">
              <span className="react block"><Bellflower className="sway dof-mid w-full rotate-[8deg]" /></span>
            </div>
            <div className="px absolute bottom-[10%] left-[28%] w-[5%] max-w-[54px]" style={dp(16)} data-react="blossom">
              <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
            </div>
            <div className="px absolute right-[8%] bottom-[22%] w-[4%] max-w-[44px]" style={dp(14)} data-react="blossom">
              <span className="react block"><Blossom className="w-full" /></span>
            </div>
            <div className="px absolute bottom-[6%] left-[42%] w-[3%] max-w-[34px]" style={dp(12)} data-react="pixel">
              <span className="react block"><PixelFlower className="w-full" /></span>
            </div>
            <div className="px absolute right-[40%] bottom-[14%] w-[2.2%] max-w-[24px]" style={dp(10)} data-react="pixel">
              <span className="react block"><PixelFlower className="w-full opacity-80" /></span>
            </div>
            <Spiral className="spin-slow absolute top-[30%] left-[10%] hidden w-12 sm:block" />
            <Orb className="float-badge absolute top-[44%] right-[12%] h-7 w-7" />
            <Orb className="float-badge absolute bottom-[26%] left-[22%] h-5 w-5" />

            {/* a far butterfly crossing the upper sky */}
            <div className="px absolute top-[12%] left-[20%] w-10 sm:w-12" style={dp(8)} data-react="butterfly">
              <span className="react block">
                <span className="flutter block" style={{ "--dur": "10s", "--td": "-4s" } as CSSProperties}>
                  <Butterfly className="dof-mid w-full -rotate-[14deg]" style={{ "--flap": "1.2s" } as CSSProperties} />
                </span>
              </span>
            </div>

            {/* front: out of focus, closest to the viewer */}
            <div className="px absolute -bottom-[4%] left-[30%] w-[12%] max-w-[120px]" style={dp(50)}>
              <Blossom className="dof-near w-full" />
            </div>
            <div className="px absolute right-[2%] -bottom-[3%] w-[9%] max-w-[90px]" style={dp(46)}>
              <Blossom className="dof-near w-full" deep />
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
