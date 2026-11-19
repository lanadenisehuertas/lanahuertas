"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { awards, certifications, education, experience, languages, profile, skillGroups, toolkit } from "@/lib/content";
import SkyNotes from "./dusk/SkyNotes";
import { Heading } from "./current/Ornaments";

const TABS = [
  { id: "about", label: "About me" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education and certs" },
  { id: "skills", label: "Skills" },
] as const;

type TabId = (typeof TABS)[number]["id"];

/** Capital first letter, for the lower-case labels in the content file. */
const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/**
 * About: the portrait on the left, lit by the current passing behind it, and
 * Lana's introduction beside it from the first line. Experience, education
 * and skills sit behind tabs (a real tablist: arrow keys, Home and End move
 * along it), so nothing here is pinned or needs scrolling through. With
 * scripts off, every part shows one after another.
 */
export default function AboutPanel() {
  const [active, setActive] = useState<TabId>("about");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const to = e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : (i + step + TABS.length) % TABS.length;
    setActive(TABS[to].id);
    tabs.current[to]?.focus();
  };

  return (
    <section id="about" data-scene="about" aria-labelledby="about-heading" className="sec about">
      <SkyNotes />
      <div className="about-grid">
        <figure className="about-portrait" data-rv tabIndex={0}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/work/lana-portrait.webp" alt="Lana Denise Huertas" width={1136} height={1200} loading="lazy" decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="about-dither" src="/art/pixel/portrait-dark.png" alt="" width={284} height={300} loading="lazy" decoding="async" />
          <figcaption>Lana, in Manila</figcaption>
        </figure>

        <div className="about-body backing">
          <div className="about-head" data-rv>
            <p className="t-meta">Manila, Philippines. They/them.</p>
            <Heading id="about-heading" lead="About" accent="me" n="05" script="hello" />
          </div>

          <div role="tablist" aria-label="About Lana" className="tabs" data-rv style={{ "--d": "80ms" } as CSSProperties}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active === t.id}
                aria-controls={`panel-${t.id}`}
                tabIndex={active === t.id ? 0 : -1}
                onClick={() => setActive(t.id)}
                onKeyDown={(e) => onKey(e, i)}
                className="tab"
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" id="panel-about" aria-labelledby="tab-about" hidden={active !== "about"} tabIndex={0} className="panel">
            <p className="about-lead">{profile.aboutHeadline}</p>
            <p className="about-kicker">{profile.aboutKicker}</p>
            <p className="about-text">
              Publicity art, scalable templates and paced video edits for student organizations and clients, and, as a Computer Science student, the
              interfaces I design I can also build. Detail-obsessed and always on time.
            </p>
            <h3 className="list-label">The tools I use</h3>
            <ul className="tools">
              {toolkit.map((t) => (
                <li key={t.id}>
                  <span aria-hidden className="tool-chip" style={{ background: t.bg, color: t.fg }}>
                    {t.label}
                  </span>
                  {t.name}
                </li>
              ))}
            </ul>
          </div>

          <div role="tabpanel" id="panel-experience" aria-labelledby="tab-experience" hidden={active !== "experience"} tabIndex={0} className="panel">
            <ol className="rows">
              {experience.map((e) => (
                <li key={`${e.role}-${e.org}`} className="row">
                  <p className="row-when">
                    {e.period}
                    <span>{e.place}</span>
                  </p>
                  <div>
                    <h3 className="row-title">{e.role}</h3>
                    <p className="row-org">{e.org}</p>
                    <ul className="row-points">
                      {e.points.slice(0, 2).map((pt) => (
                        <li key={pt}>{pt}</li>
                      ))}
                    </ul>
                    {e.points.length > 2 && (
                      <details className="row-more">
                        <summary>
                          <span className="more-closed">{e.points.length - 2} more</span>
                          <span className="more-open">Show less</span>
                        </summary>
                        <ul className="row-points">
                          {e.points.slice(2).map((pt) => (
                            <li key={pt}>{pt}</li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div role="tabpanel" id="panel-education" aria-labelledby="tab-education" hidden={active !== "education"} tabIndex={0} className="panel">
            <ul className="rows">
              {education.map((e) => (
                <li key={e.school} className="row">
                  <p className="row-when">
                    {e.period}
                    <span>{e.place}</span>
                  </p>
                  <div>
                    <h3 className="row-title">{e.school}</h3>
                    <p className="row-text">{e.detail}</p>
                    {e.coursework && (
                      <p className="row-text">
                        <span className="row-k">Coursework</span>
                        {e.coursework.split(" · ").join(", ")}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="list-label">Awards</h3>
            <ul className="rows rows--tight">
              {awards.map((a) => (
                <li key={a.title + a.from} className="row">
                  <p className="row-when">{a.year || "Scholarship"}</p>
                  <div>
                    <p className="row-title row-title--sm">{a.title}</p>
                    <p className="row-text">{a.from}</p>
                  </div>
                </li>
              ))}
            </ul>

            <h3 className="list-label">Certifications</h3>
            <ul className="rows rows--tight">
              {certifications.map((c) => (
                <li key={c.name} className="row">
                  <p className="row-when">{c.date}</p>
                  <div>
                    <p className="row-title row-title--sm">{c.name}</p>
                    <p className="row-text">{c.issuer.replace(" · ", ", ")}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div role="tabpanel" id="panel-skills" aria-labelledby="tab-skills" hidden={active !== "skills"} tabIndex={0} className="panel">
            <dl className="skills">
              {[...skillGroups, { label: "languages", items: languages }].map((g) => (
                <div key={g.label} className="skill">
                  <dt>{cap(g.label)}</dt>
                  <dd>{g.items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
