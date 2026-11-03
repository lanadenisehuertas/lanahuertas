"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- links home are full loads on purpose: the home page reads ?studio, ?compose, ?remix and #plant once, on arrival, after its opening screen */
/* eslint-disable @next/next/no-img-element -- pubmats come from the gallery's own image route and from this browser (data URLs), which next/image can't optimise */

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { KIND_LABEL, SEEDS, flowerSvg, type Flower } from "@/lib/garden/flowers";
import { STEPS, STEP_MS, chime, decode } from "@/lib/dusk/skySong";
import { forgetMine, imageUrl, pieceUrl, readMine, songUrl, when, type Mine, type Pubmat, type Song } from "@/lib/made/kinds";
import "./made.css";

/*
 * /made-here: everything visitors made on the site, in one place.
 *   Pubmats  from the studio (the carousel's "Your turn" slide)
 *   Songs    written in the stars (the hero's composer)
 *   Flowers  planted in the guestbook garden (the foot of the page)
 *
 * The page reads top to bottom: what this is and how many pieces it holds,
 * three ways to make one, a shelf of your own pieces (only when this browser
 * made some), then the wall itself, one kind at a time, newest first.
 * Every card leads somewhere: open a pubmat large, download or remix it;
 * play a song here or in the sky it was written in; plant a flower.
 */

type Tab = "pubmats" | "songs" | "flowers";
const KINDS: Record<Tab, { label: string; one: string; icon: string; blurb: string; make: { href: string; label: string } }> = {
  pubmats: {
    label: "Pubmats",
    one: "pubmat",
    icon: "/art/pixel-sparkle-pink.svg",
    blurb: "Made in the studio, from my layouts, palettes and art.",
    make: { href: "/?studio=1#branding", label: "Make a pubmat" },
  },
  songs: {
    label: "Songs",
    one: "song",
    icon: "/art/pixel-note.svg",
    blurb: "Written in the stars over the hero: tap play to hear one here.",
    make: { href: "/?compose=1", label: "Write a song" },
  },
  flowers: {
    label: "Flowers",
    one: "flower",
    icon: "/art/pixel-daisy.svg",
    blurb: "Planted in the guestbook garden, each with a name and a note.",
    make: { href: "/#plant", label: "Plant a flower" },
  },
};
const ORDER: Tab[] = ["pubmats", "songs", "flowers"];
const GARDEN_MINE = "garden-mine-v1";

type Piece<T> = T & { thumb?: string; local?: boolean };
const srcOf = (p: Piece<Pubmat>) => (p.local || (p.pending && p.thumb) ? p.thumb! : imageUrl(p.id));

export default function MadeHere() {
  const [tab, setTab] = useState<Tab>("pubmats");
  const [newest, setNewest] = useState(true);
  const [data, setData] = useState<{ live: boolean; moderated: boolean; songs: Song[]; pubmats: Pubmat[]; flowers: Flower[] } | null>(null);
  const [mine, setMine] = useState<Mine[]>([]);
  const [myFlowers, setMyFlowers] = useState<Flower[]>([]);
  const [open, setOpen] = useState<Piece<Pubmat> | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const say = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((t) => (t === m ? "" : t)), 2600);
  }, []);

  // the tab follows the address (#pubmats, #songs, #flowers), so links land on the right shelf
  useEffect(() => {
    const read = () => {
      const h = location.hash.slice(1) as Tab;
      if (ORDER.includes(h)) setTab(h);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- this browser's own pieces, read once */
    setMine(readMine());
    try {
      setMyFlowers(JSON.parse(localStorage.getItem(GARDEN_MINE) ?? "[]"));
    } catch {}
    /* eslint-enable react-hooks/set-state-in-effect */
    Promise.all([fetch("/api/made").then((r) => r.json()), fetch("/api/garden").then((r) => r.json())])
      .then(([m, g]) => setData({ live: !!m.live, moderated: !!m.moderated, songs: m.songs ?? [], pubmats: m.pubmats ?? [], flowers: g.flowers ?? SEEDS }))
      .catch(() => setData({ live: false, moderated: true, songs: [], pubmats: [], flowers: SEEDS }));
  }, []);

  // the wall: what the gallery shows, plus this browser's pieces it doesn't show (yet)
  const pubmats = useMemo<Piece<Pubmat>[]>(() => {
    const got = data?.pubmats ?? [];
    const own = mine.filter((m): m is Mine & Pubmat => m.kind === "pubmat" && !got.some((g) => g.id === m.id)).map((m) => ({ ...m, pending: true, local: m.id.startsWith("local") }));
    return [...own, ...got.map((g) => ({ ...g, thumb: mine.find((m) => m.id === g.id)?.thumb }))];
  }, [data, mine]);
  const songs = useMemo<Piece<Song>[]>(() => {
    const got = data?.songs ?? [];
    const own = mine.filter((m): m is Mine & Song => m.kind === "song" && !got.some((g) => g.id === m.id)).map((m) => ({ ...m, pending: true, local: m.id.startsWith("local") }));
    return [...own, ...got];
  }, [data, mine]);
  const flowers = useMemo<Flower[]>(() => {
    const got = data?.flowers ?? SEEDS;
    return [...myFlowers.filter((f) => !got.some((g) => g.id === f.id)).map((f) => ({ ...f, pending: true })), ...got];
  }, [data, myFlowers]);
  const count: Record<Tab, number> = { pubmats: pubmats.length, songs: songs.length, flowers: flowers.length };
  const order = useCallback(<T extends { t: number }>(xs: T[]) => [...xs].sort((a, b) => (newest ? b.t - a.t : a.t - b.t)), [newest]);

  // your own pieces, newest first, for the shelf at the top
  const yours = useMemo(() => {
    const ids = new Set(mine.map((m) => m.id));
    const p = pubmats.filter((x) => ids.has(x.id)).map((x) => ({ kind: "pubmat" as const, t: x.t, p: x }));
    const s = songs.filter((x) => ids.has(x.id)).map((x) => ({ kind: "song" as const, t: x.t, s: x }));
    return [...p, ...s].sort((a, b) => b.t - a.t).slice(0, 8);
  }, [mine, pubmats, songs]);

  // a link to one piece (?p=<id> or ?s=<id>) opens or points at it
  useEffect(() => {
    if (!data) return;
    const q = new URLSearchParams(location.search),
      p = q.get("p"),
      s = q.get("s");
    /* eslint-disable react-hooks/set-state-in-effect -- the address is read once the pieces are in */
    if (p) {
      const hit = pubmats.find((x) => x.id === p);
      if (hit) setOpen(hit);
    }
    if (s) setFocus(s);
    /* eslint-enable react-hooks/set-state-in-effect */
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the data first arrives
  }, [data]);
  useEffect(() => {
    if (!focus) return;
    document.getElementById(`song-${focus}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [focus, tab]);

  const pick = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", `/made-here#${t}`);
  };
  const copy = async (path: string) => {
    const url = new URL(path, location.origin).toString();
    try {
      await navigator.clipboard.writeText(url);
      say("Link copied.");
    } catch {
      window.prompt("Copy the link:", url);
    }
  };
  const forget = (id: string) => {
    forgetMine(id);
    setMine(readMine());
    setOpen(null);
    say("Removed from this browser.");
  };
  const k = KINDS[tab];

  return (
    <main id="top" className="mh" data-tone="dark">
      <div aria-hidden className="mh-sky" />

      {/* 1. what this is */}
      <header className="mh-head">
        <div className="mh-intro">
          <p className="mh-k">The visitors&apos; gallery</p>
          <h1 className="mh-title">
            Made <em>here</em>
          </h1>
          <p className="mh-lede">Everything people made while they visited: pubmats from the studio, songs written in the stars, and flowers from the garden. Make one and it hangs here with your name on it.</p>
          <dl className="mh-stats" aria-label="In the gallery">
            {ORDER.map((t) => (
              <div key={t}>
                <dt>{KINDS[t].label}</dt>
                <dd>{data ? count[t] : "·"}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* 2. three ways to make one */}
        <nav className="mh-make dusk-panel" aria-label="Make something">
          <p className="mh-k">Make something</p>
          {ORDER.map((t) => (
            <a key={t} className="mh-mk" href={KINDS[t].make.href}>
              <img src={KINDS[t].icon} alt="" className="mh-mkic" width={36} height={36} />
              <span>
                <b>{KINDS[t].make.label}</b>
                <small>{t === "pubmats" ? "In a studio laid out like Photoshop" : t === "songs" ? "Place stars in the sky, hear them play" : "Leave your name and a short note"}</small>
              </span>
              <i aria-hidden>→</i>
            </a>
          ))}
        </nav>
      </header>

      {data && !data.live && <p className="mh-off">This copy of the site has no gallery store connected, so it shows the pieces saved in your browser.</p>}

      {/* 3. yours, when this browser made some */}
      {yours.length > 0 && (
        <section className="mh-yours" aria-labelledby="mh-yours-h">
          <div className="mh-rowhead">
            <h2 id="mh-yours-h" className="mh-h2">
              Yours
            </h2>
            <p>Saved from this browser. Pieces marked waiting show to everyone once Lana has seen them.</p>
          </div>
          <ul className="mh-shelf">
            {yours.map((y) =>
              y.kind === "pubmat" ? (
                <li key={y.p.id}>
                  <button type="button" className="mh-yc" onClick={() => setOpen(y.p)}>
                    <img src={srcOf(y.p)} alt="" style={{ aspectRatio: `${y.p.w} / ${y.p.h}` }} />
                    <span className="mh-yt">{y.p.title}</span>
                    <Status p={y.p} />
                  </button>
                </li>
              ) : (
                <li key={y.s.id}>
                  <a className="mh-yc mh-yc--song" href={`/made-here?s=${y.s.id}#songs`} onClick={() => (pick("songs"), setFocus(y.s.id))}>
                    <MiniSky code={y.s.code} />
                    <span className="mh-yt">“{y.s.title}”</span>
                    <Status p={y.s} />
                  </a>
                </li>
              )
            )}
          </ul>
        </section>
      )}

      {/* 4. the wall, one kind at a time */}
      <div className="mh-bar">
        <div className="mh-tabs" role="tablist" aria-label="Kinds of things made here">
          {ORDER.map((t) => (
            <button key={t} type="button" role="tab" id={`tab-${t}`} aria-controls="mh-panel" aria-selected={tab === t} onClick={() => pick(t)}>
              {KINDS[t].label} <span className="mh-n">{data ? count[t] : "·"}</span>
            </button>
          ))}
        </div>
        <div className="mh-sort" role="group" aria-label="Order">
          <button type="button" aria-pressed={newest} onClick={() => setNewest(true)}>
            Newest
          </button>
          <button type="button" aria-pressed={!newest} onClick={() => setNewest(false)}>
            Oldest
          </button>
        </div>
      </div>

      <section id="mh-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="mh-panel" key={tab}>
        <div className="mh-rowhead">
          <p>{k.blurb}</p>
          <a className="mh-cta" href={k.make.href}>
            {k.make.label} <span aria-hidden>→</span>
          </a>
        </div>

        {!data ? (
          <ul className="mh-mats mh-skel" aria-label="Loading">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} />
            ))}
          </ul>
        ) : count[tab] === 0 ? (
          <Empty icon={k.icon} title={`No ${k.label.toLowerCase()} yet`} text={`Be the first: the gallery hangs your ${k.one} with your name on it.`} href={k.make.href} cta={k.make.label} />
        ) : tab === "pubmats" ? (
          <ul className="mh-mats">
            {order(pubmats).map((p) => (
              <li key={p.id}>
                <button type="button" className="mh-mat" onClick={() => setOpen(p)} aria-label={`Open “${p.title}” by ${p.name}`}>
                  <span className="mh-matimg" style={{ aspectRatio: `${p.w} / ${p.h}` }}>
                    <img src={srcOf(p)} alt="" loading="lazy" decoding="async" />
                    <span className="mh-open" aria-hidden>
                      Open
                    </span>
                    {p.pending && <Status p={p} on />}
                  </span>
                  <span className="mh-cap">
                    <b>{p.title}</b>
                    <span>
                      {p.name} · {when(p.t)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : tab === "songs" ? (
          <ul className="mh-songs">
            {order(songs).map((s) => (
              <SongCard key={s.id} s={s} focus={focus === s.id} onCopy={() => copy(songUrl(s))} onForget={s.local ? () => forget(s.id) : undefined} />
            ))}
          </ul>
        ) : (
          <ul className="mh-flowers">
            {order(flowers).map((f) => (
              <li key={f.id} className="mh-flower">
                <span className="mh-bed" aria-hidden>
                  <FlowerPx f={f} />
                </span>
                <p className="mh-fname">{f.name}</p>
                <p className="mh-fmeta">
                  {KIND_LABEL[f.kind]} · {f.pending ? "waiting to bloom" : when(f.t)}
                </p>
                {f.note && <p className="mh-fnote">{f.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="mh-foot">
        <img src="/art/garden/cloud-bank.webp" alt="" className="mh-clouds" width={1400} height={196} loading="lazy" />
        <div className="mh-footin">
          <a className="link" href="/">
            <span aria-hidden>←</span> Back to the portfolio
          </a>
          <a className="link" href="/#contact">
            Work with me <span aria-hidden>→</span>
          </a>
        </div>
      </footer>

      {open && <Lightbox p={open} onClose={() => setOpen(null)} onCopy={() => copy(pieceUrl(open))} onForget={open.local ? () => forget(open.id) : undefined} />}
      {toast && (
        <p className="mh-toast" role="status">
          {toast}
        </p>
      )}
    </main>
  );
}

function Status({ p, on }: { p: { pending?: boolean; local?: boolean }; on?: boolean }) {
  if (!p.pending) return <span className={`mh-badge mh-badge--ok${on ? " mh-badge--on" : ""}`}>In the gallery</span>;
  return <span className={`mh-badge${on ? " mh-badge--on" : ""}`}>{p.local ? "Saved in this browser" : "Waiting for Lana"}</span>;
}

function Empty({ icon, title, text, href, cta }: { icon: string; title: string; text: string; href: string; cta: string }) {
  return (
    <div className="mh-empty dusk-panel">
      <img src={icon} alt="" width={56} height={56} className="mh-eic" />
      <p className="mh-etitle">{title}</p>
      <p>{text}</p>
      <a className="btn" href={href}>
        {cta} <span aria-hidden>→</span>
      </a>
    </div>
  );
}

function FlowerPx({ f }: { f: Flower }) {
  const { svg, w, h } = useMemo(() => flowerSvg(f.kind, f.color, f.id), [f.kind, f.color, f.id]);
  return <span className="mh-fpx" style={{ width: w * 6, height: h * 6 }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

/** a song's constellation, small: the stars joined in the order they play */
function MiniSky({ code, step = -1 }: { code: string; step?: number }) {
  const stars = useMemo(() => decode(code), [code]);
  const pts = stars.map((x) => [((x.c + 0.5) / STEPS) * 320, ((7 - x.l + 0.5) / 8) * 96] as const);
  return (
    <svg className="mh-sky-mini" viewBox="0 0 320 96" role="img" aria-label={`${stars.length} stars`}>
      {[1, 2, 3].map((b) => (
        <line key={b} x1={b * 80} x2={b * 80} y1="6" y2="90" stroke="rgb(253 243 225 / .08)" strokeWidth="1" />
      ))}
      <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="rgb(255 207 224 / .5)" strokeWidth="1" />
      {step >= 0 && <line x1={((step + 0.5) / STEPS) * 320} x2={((step + 0.5) / STEPS) * 320} y1="0" y2="96" stroke="rgb(255 217 138 / .7)" strokeWidth="1.5" />}
      {stars.map((x, i) => {
        const lit = x.c === step;
        return (
          <g key={i} transform={`translate(${pts[i][0]} ${pts[i][1]})`}>
            {lit && <circle r="7" fill="rgb(255 217 138 / .35)" />}
            <rect x="-1.5" y="-4.5" width="3" height="9" fill={lit ? "#ffd98a" : "#fdf3e1"} />
            <rect x="-4.5" y="-1.5" width="9" height="3" fill={lit ? "#ffd98a" : "#fdf3e1"} />
          </g>
        );
      })}
    </svg>
  );
}

/** A song as its constellation: tap play to hear it here, or open it in the sky it was written in. */
function SongCard({ s, focus, onCopy, onForget }: { s: Piece<Song>; focus: boolean; onCopy: () => void; onForget?: () => void }) {
  const stars = useMemo(() => decode(s.code), [s.code]);
  const [step, setStep] = useState(-1);
  const timer = useRef(0);
  const stop = useCallback(() => {
    window.clearInterval(timer.current);
    setStep(-1);
  }, []);
  useEffect(() => stop, [stop]);
  const play = () => {
    if (step >= 0) return stop();
    const last = Math.max(...stars.map((x) => x.c));
    let c = 0;
    const tickOnce = () => {
      if (c > last) return stop();
      stars.filter((x) => x.c === c).forEach((x) => chime(x.l));
      setStep(c);
      c++;
    };
    tickOnce();
    timer.current = window.setInterval(tickOnce, STEP_MS);
  };
  return (
    <li id={`song-${s.id}`} className="mh-song dusk-panel" data-focus={focus ? "" : undefined}>
      <MiniSky code={s.code} step={step} />
      <div className="mh-stxt">
        <p className="mh-stitle">“{s.title}”</p>
        <p className="mh-smeta">
          {s.name} · {stars.length} stars · {when(s.t)}
        </p>
        {s.note && <p className="mh-snote">{s.note}</p>}
        {s.pending && <Status p={s} />}
      </div>
      <div className="mh-sacts">
        <button type="button" className="btn btn-sm" onClick={play} aria-pressed={step >= 0}>
          {step >= 0 ? "Stop" : "Play"} <span aria-hidden>{step >= 0 ? "■" : "▶"}</span>
        </button>
        <a className="link mh-slink" href={songUrl(s)}>
          Open in the sky <span aria-hidden>↗</span>
        </a>
        <button type="button" className="link mh-slink" onClick={onCopy}>
          Copy link
        </button>
        {onForget && (
          <button type="button" className="link mh-slink" onClick={onForget}>
            Remove
          </button>
        )}
      </div>
    </li>
  );
}

function Lightbox({ p, onClose, onCopy, onForget }: { p: Piece<Pubmat>; onClose: () => void; onCopy: () => void; onForget?: () => void }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    d.current?.showModal();
  }, []);
  const src = srcOf(p);
  const file = `${p.title.replace(/[^\w\- ]+/g, "").trim() || "pubmat"}.jpg`;
  const act: ReactNode[] = [
    <a key="dl" className="btn btn-sm" href={src} download={file}>
      Download <span aria-hidden>↓</span>
    </a>,
  ];
  if (p.remix && !p.local)
    act.push(
      <a key="rx" className="link mh-slink" href={`/?remix=${p.id}#branding`}>
        Remix in the studio <span aria-hidden>↗</span>
      </a>
    );
  if (!p.local)
    act.push(
      <button key="cp" type="button" className="link mh-slink" onClick={onCopy}>
        Copy link
      </button>
    );
  if (onForget)
    act.push(
      <button key="fg" type="button" className="link mh-slink" onClick={onForget}>
        Remove from this browser
      </button>
    );
  return createPortal(
    <dialog ref={d} className="mh-box dusk-panel" aria-label={`“${p.title}” by ${p.name}`} onClose={onClose} onClick={(e) => e.target === e.currentTarget && d.current?.close()}>
      <button type="button" className="mh-x" aria-label="Close" onClick={() => d.current?.close()}>
        ×
      </button>
      <div className="mh-boxin">
        <div className="mh-bigwrap">
          <img className="mh-big" src={src} alt={`“${p.title}”, a pubmat by ${p.name}`} style={{ aspectRatio: `${p.w} / ${p.h}` }} />
        </div>
        <div className="mh-boxtxt">
          <p className="mh-k">
            Pubmat · {p.w} × {p.h}
          </p>
          <h2 className="mh-btitle">{p.title}</h2>
          <p className="mh-smeta">
            {p.name} · {when(p.t)}
          </p>
          {p.note && <p className="mh-bnote">{p.note}</p>}
          {p.pending && <Status p={p} />}
          <div className="mh-bacts">{act}</div>
          {p.remix && !p.local && <p className="mh-fine">Its maker lets anyone open the layers in the studio and make their own version.</p>}
        </div>
      </div>
    </dialog>,
    document.body
  );
}
