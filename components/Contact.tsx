import type { CSSProperties } from "react";
import { profile, socials } from "@/lib/content";
import { Butterfly, Orbit, ShootingStar, GlowSparkle, Star5, StarBurst, PixelFlower, Staff, Note, PixelArt } from "./Ethereal";
import { Sparkle4 } from "./Botanicals";
import { InkArrow } from "./Ink";
import MorphName from "./MorphName";
import ContactForm from "./ContactForm";
import { Art } from "./dusk/Decor";
import { PeanutPeek } from "./dusk/Peanut";
import LetterBloom from "./dusk/LetterBloom";
import SkyNotes from "./dusk/SkyNotes";
import Words from "@/components/Words";
import Guestbook from "./garden/Guestbook";

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


const dp = (depth: number, extra: Record<string, string | number> = {}) => ({ "--depth": depth, ...extra }) as CSSProperties;

/**
 * The end card: the finale that gathers every motif on the page. Sunset at
 * the top fading into the garden's blue, the sky pieces (clouds, an orbit
 * round the thank-you, a comet, stars, bokeh), the print textures (dither,
 * grain) and the whole garden — lotus, bellflowers, blossoms, ferns,
 * pixel flowers, butterflies — spilling over the edges at three depths.
 *
 * It carries everything you'd act on, in two columns at desktop: on the left
 * the thank-you (morphs like the name) and a link per profile, on the right
 * a form that emails Lana directly.
 */
export default function Contact() {
  return (
    <section id="contact" data-tone="dark" className="dk dk-night dk-contact relative px-4 pt-16 pb-24 sm:px-[3.4%] sm:pb-28">
      <SkyNotes />
      <div className="relative mx-auto max-w-6xl lg:max-w-none">
        <header className="relative z-10 mb-8 sm:mb-10">
          <h2 id="contact-heading" data-perch data-rv="mist" className="type-display text-[clamp(3rem,5vw,5.25rem)] leading-none text-iris">
            Let&apos;s <em className="text-lavender italic">talk</em>
          </h2>
        </header>

        <footer aria-labelledby="contact-heading" className="end-card bloom-zone relative overflow-visible">
          {/* The night sky: full-bleed, fading in from the page above and
              running to the very bottom — no frame, like the hero. The
              evening ends here, so it is the deepest sky on the page, with
              the lit horizon kept for the lotus bed at its foot. */}
          <div
            aria-hidden
            className="sheet-fade-top dk-contact-sky absolute -top-[240px] -bottom-24 left-[calc(50%-50vw)] w-screen overflow-hidden sm:-bottom-28"
            style={{
              background:
                "radial-gradient(42% 30% at 50% 30%, rgb(255 214 190 / 0.2) 0%, transparent 72%), linear-gradient(180deg, #1c2160 0%, #22276e 22%, #2a2e84 46%, #36369a 66%, #5a4ab0 82%, #a27ac4 93%, #e3a0c0 100%)",
            }}
          >
            <div className="light-leak absolute inset-0" />

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

            {/* painted clouds along the foot, two depths */}
            <Art name="cloud-bank" w={1400} h={196} className="dk-cloud" style={{ left: "-20%", bottom: "16%", width: "90%", opacity: 0.75, scale: "-1 1", "--t": "28s", "--cx": "-20px" } as CSSProperties} />
            <div className="dither absolute inset-x-0 bottom-0 h-[30%] opacity-70" />
            <PixelArt name="ornament" className="absolute top-[14%] left-[3%] hidden h-48 w-auto opacity-50 md:block" />
            <PixelArt name="ornament" className="absolute top-[14%] right-[3%] hidden h-48 w-auto opacity-50 md:block" />
            <PixelArt name="moon" className="absolute top-[7%] left-[16%] w-12 opacity-90 sm:w-16" />
            <PixelArt name="sparkle" className="twinkle absolute top-[22%] right-[9%] w-10" />
            <div className="band-grain absolute inset-0" />
            <Art name="cloud-bank" w={1400} h={196} className="dk-cloud" style={{ left: "-8%", bottom: "-1%", width: "116%", "--t": "24s", "--cx": "24px" } as CSSProperties} />
          </div>

          {/* Two columns at desktop: the thank-you on the left, the form on
              the right. Phones stack them, thank-you first. */}
          <div className="relative grid items-center gap-14 px-4 pt-4 pb-16 sm:px-10 sm:pt-6 sm:pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
            <div className="relative text-center">
              {/* The thank-you, ringed by an orbit, a pixel swirl beside it */}
              <div className="relative">
                <PixelArt name="swirl" className="absolute top-[4%] right-[2%] hidden w-[22%] -scale-x-100 opacity-80 lg:block" />
                <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 hidden w-[112%] -translate-x-1/2 -translate-y-[46%] sm:block">
                  <Orbit className="w-full -rotate-[6deg]" dur="20s" />
                </span>
                <LetterBloom>
                <MorphName
                  as="p"
                  label="Thank you"
                  words={[
                    {
                      text: "Thank",
                      italic: true,
                      className: "type-name block text-[26vw] !leading-[0.6] whitespace-nowrap text-iris italic sm:text-[9rem] xl:text-[10rem]",
                    },
                    {
                      text: "you",
                      italic: true,
                      className: "type-name -mt-[0.02em] block text-[26vw] !leading-[0.6] whitespace-nowrap text-iris italic sm:text-[9rem] lg:pl-[1.3em] xl:text-[10rem]",
                    },
                  ]}
                />
                </LetterBloom>
              </div>

              <Words
                className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink/85 sm:text-[17px] lg:mt-14"
                text="Open to UI/UX and design roles, and to freelance brand, event and product work."
              />

              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-7 gap-y-1">
                {socials.filter((s) => s.label !== "email").map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="link inline-flex min-h-[44px] items-center gap-2 text-[17px]"
                    >
                      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {GLYPH[s.label]}
                      </svg>
                      {s.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* The form, with Peanut peeking over it */}
            <div className="relative z-20" data-rv>
              <PixelFlower className="pointer-events-none absolute -top-5 left-[8%] z-10 h-7 w-7" />
              <PeanutPeek style={{ left: "38%", top: 2, width: "clamp(108px, 10vw, 156px)" }} />
              <ContactForm />
            </div>
          </div>

          {/* The guestbook: visitors plant pixel flowers in the bed above the lotus */}
          <Guestbook />

          {/* The garden, spilling over the card edges at three depths */}
          <div aria-hidden className="pointer-events-none">

            {/* the painted lotus bed at both corners */}
            <Art name="lotus-cluster" w={1000} h={471} className="dk-sway" style={{ left: "-6%", bottom: "-2%", width: "max(30%, 220px)", "--t": "8s" } as CSSProperties} />
            <Art name="lotus-cluster" w={1000} h={471} className="dk-sway" style={{ right: "-6%", bottom: "-3%", width: "max(26%, 190px)", scale: "-1 1", "--t": "9s" } as CSSProperties} />

            {/* a far butterfly crossing the upper sky */}
            <div className="px absolute top-[12%] left-[20%] w-10 sm:w-12" style={dp(8)} data-react="butterfly">
              <span className="react block">
                <span className="flutter block" style={{ "--dur": "10s", "--td": "-4s" } as CSSProperties}>
                  <Butterfly className="dof-mid w-full -rotate-[14deg]" style={{ "--flap": "1.2s" } as CSSProperties} />
                </span>
              </span>
            </div>

          </div>

          {/* The page's closing line: the credit and the way back up, at the
              very end where they are looked for (they sat under the heading,
              where a "back to top" made no sense yet). It sits in the light strip
              of cloud under the lotus beds, so it is set in plum ink. */}
          <div
            className="type-pixel absolute inset-x-0 -bottom-[86px] z-30 flex items-center justify-center gap-3 px-4 text-center text-[12px] sm:-bottom-[104px] sm:gap-4 sm:text-[13px]"
            style={{ "--color-ink": "#3b2a6e", "--color-iris": "#3b2a6e", color: "#3b2a6e" } as CSSProperties}
          >
            <span>
              ©2026 {profile.name} · {profile.location}
            </span>
            <a href="#top" aria-label="Back to top" className="btn-ghost btn-icon">
              <InkArrow dir="up" className="h-5 w-8" />
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}
