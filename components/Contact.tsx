import { profile, socials } from "@/lib/content";
import ContactForm from "./ContactForm";
import SkyNotes from "./dusk/SkyNotes";
import Guestbook from "./garden/Guestbook";
import MotionToggle from "./current/MotionToggle";
import Peanut from "./current/Peanut";
import { Heading } from "./current/Ornaments";

const NAME: Record<string, string> = { linkedin: "LinkedIn", github: "GitHub", "canva site": "Canva site" };

const ARCHIVE = [
  { href: "/design", label: "Branding and posters" },
  { href: "/videos", label: "Videos" },
  { href: "/ui-ux", label: "UI/UX case studies" },
  { href: "/made-here", label: "Made here, by visitors" },
];

/**
 * The last section is one invitation, set as wide as the page. Under it, the
 * ways to reach Lana on the left and the form on the right, straight on the
 * colour. Then the guestbook garden (visitors plant pixel flowers), and the
 * footer: the archive pages, the motion switch and the way back up.
 */
export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="contact">
      <SkyNotes />
      <div className="contact-title">
        <Heading id="contact-heading" lead="Let’s" accent="talk" size="display" />
      </div>

      <div className="sec contact-top">
        <div className="contact-lead">
          <p className="t-lede" data-rv>
            Open to UI/UX and design roles, and to freelance work. A role, a brand, an event or a product that needs designing: tell me about it. I
            reply within a few days.
          </p>
          <ul className="contact-links" data-rv style={{ "--d": "80ms" } as React.CSSProperties}>
            <li>
              <a href={`mailto:${profile.email}`} className="link">
                {profile.email}
              </a>
            </li>
            {socials
              .filter((s) => s.label !== "email")
              .map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link">
                    {NAME[s.label] ?? s.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <div className="contact-form" data-rv style={{ "--d": "120ms" } as React.CSSProperties}>
          <ContactForm />
        </div>
      </div>

      {/* the guestbook: visitors plant pixel flowers along the baseline */}
      <Guestbook />

      <footer className="foot">
        <nav aria-label="Archive" className="foot-nav">
          <ul>
            {ARCHIVE.map((a) => (
              <li key={a.href}>
                <a href={a.href} className="link">
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="foot-line">
          <p className="t-meta">
            ©2026 {profile.name}, {profile.location}
          </p>
          <div className="foot-tools">
            <Peanut />
            <MotionToggle />
            <a href="#top" className="link">
              Back to top <span aria-hidden>↑</span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
