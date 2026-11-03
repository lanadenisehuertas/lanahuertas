"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { KEYS, LANES, LANE_LABEL, MAX_STARS, STEPS, STEP_MS, chime, cleanTitle, encode, shareUrl, sortStars, type Star } from "@/lib/dusk/skySong";
import { MADE_LIMITS, pieceUrl, type Made } from "@/lib/made/kinds";
import { localId, sendPiece } from "@/lib/made/client";
import { tone } from "@/lib/dusk/sound";

/**
 * "Write a song in the stars": the hero's sky turns into a score. Eight faint
 * rows (one octave of the D major scale, low to high) run across the sky; a click puts a
 * star where it lands, snapped to its row and beat, and the stars join into a
 * constellation in the order they play. Keys A to K write at a moving caret
 * too. Play sweeps a light across and each star chimes as it passes.
 *
 * "Listen" mode is what someone sees opening a shared link: the sender's
 * constellation already in the sky, its name, and a button to hear it.
 */
export default function SkyComposer({
  mode: startMode,
  initial = [],
  initialTitle = "",
  onClose,
}: {
  mode: "write" | "listen";
  initial?: Star[];
  initialTitle?: string;
  onClose: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const score = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState(startMode);
  const [stars, setStars] = useState<Star[]>(() => sortStars(initial));
  const [title, setTitle] = useState(initialTitle);
  const [ghost, setGhost] = useState<Star | null>(null);
  const [caret, setCaret] = useState(() => (initial.length ? Math.min(STEPS - 1, Math.max(...initial.map((s) => s.c)) + 1) : 0));
  const [lit, setLit] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [say, setSay] = useState("");
  const [toast, setToast] = useState("");
  const [away, setAway] = useState(false);
  // saving to the gallery: the dock turns over to a short form, then a link to the piece
  const [save, setSave] = useState<null | { at: number; name: string; note: string; busy?: boolean; err?: string; field?: string; done?: { status: string; piece: Made } }>(null);
  const hp = useRef<HTMLInputElement>(null);
  const raf = useRef(0);
  const starsRef = useRef(stars);
  useEffect(() => {
    starsRef.current = stars;
  }, [stars]);

  // the hero hands its sky over while the composer is open; the dock (fixed to
  // the screen, outside the hero's dithered foot) steps aside when the hero
  // scrolls away, and comes back with your song intact
  useEffect(() => {
    const hero = root.current?.parentElement;
    if (!hero) return;
    hero.setAttribute("data-compose", "");
    const io = new IntersectionObserver(
      ([e]) => {
        const gone = e.intersectionRatio < 0.4;
        setAway(gone);
        if (gone) {
          cancelAnimationFrame(raf.current);
          setPlaying(false);
          setLit(null);
        }
      },
      { threshold: [0, 0.4, 1] }
    );
    io.observe(hero);
    return () => {
      hero.removeAttribute("data-compose");
      io.disconnect();
    };
  }, []);

  const loopRef = useRef(loop);
  useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
    setLit(null);
    if (head.current) head.current.style.opacity = "0";
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = useCallback(() => {
    const s = starsRef.current;
    if (!s.length) return;
    cancelAnimationFrame(raf.current);
    setPlaying(true);
    const len = Math.min(STEPS, Math.max(8, Math.max(...s.map((x) => x.c)) + 2));
    let t0 = performance.now(),
      last = -1;
    const frame = (now: number) => {
      const el = now - t0,
        step = Math.floor(el / STEP_MS);
      if (step >= len) {
        if (loopRef.current) {
          t0 = now;
          last = -1;
        } else return stop();
      }
      const k = Math.min(step, len - 1);
      if (k !== last) {
        last = k;
        starsRef.current.filter((x) => x.c === k).forEach((x) => chime(x.l));
        setLit(k);
      }
      if (head.current) {
        head.current.style.opacity = "1";
        head.current.style.transform = `translateX(${(el / STEP_MS / STEPS) * (score.current?.clientWidth ?? 0)}px)`;
      }
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  }, [stop]);

  const flash = (m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((t) => (t === m ? "" : t)), 2800);
  };

  /** add the star, or take it away if one is there already */
  const toggle = useCallback((st: Star, from: "key" | "click") => {
    const cur = starsRef.current,
      has = cur.some((x) => x.c === st.c && x.l === st.l);
    if (has && from === "click") {
      setSay(`Removed the star at ${LANE_LABEL[st.l]}, beat ${st.c + 1}.`);
      setStars(cur.filter((x) => !(x.c === st.c && x.l === st.l)));
      return;
    }
    if (has || cur.length >= MAX_STARS) return;
    chime(st.l);
    setSay(`Star at ${LANE_LABEL[st.l]}, beat ${st.c + 1}.`);
    const next = sortStars([...cur, st]);
    starsRef.current = next;
    setStars(next);
  }, []);

  const cell = (e: { clientX: number; clientY: number }): Star | null => {
    const r = score.current?.getBoundingClientRect();
    if (!r) return null;
    const x = (e.clientX - r.left) / r.width,
      y = (e.clientY - r.top) / r.height;
    if (x < 0 || x >= 1 || y < 0 || y >= 1) return null;
    return { c: Math.floor(x * STEPS), l: 7 - Math.floor(y * 8) };
  };

  // keys A-K write at the caret; Space plays; Backspace undoes; Esc leaves
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, dialog") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") return onClose();
      if (mode !== "write") return;
      const i = KEYS.indexOf(e.key.toLowerCase());
      if (i >= 0) {
        e.preventDefault();
        toggle({ c: caret, l: i }, "key");
        setCaret((c) => (c + 1) % STEPS);
      } else if (e.key === " " && !t.closest("button")) {
        e.preventDefault();
        if (playing) stop();
        else play();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        setStars((cur) => cur.slice(0, -1));
        setCaret((c) => Math.max(0, c - 1));
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        setCaret((c) => (c + (e.key === "ArrowRight" ? 1 : STEPS - 1)) % STEPS);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, caret, playing, play, stop, toggle, onClose]);

  const saveSong = async () => {
    if (!save || save.busy) return;
    setSave({ ...save, busy: true, err: undefined, field: undefined });
    const code = encode(sortStars(stars)),
      t = cleanTitle(title);
    const r = await sendPiece(
      { kind: "song", title: t, name: save.name, note: save.note, code, website: hp.current?.value ?? "", elapsed: Date.now() - save.at },
      () => ({ id: localId(), kind: "song", title: t, name: save.name.trim(), note: save.note.trim(), code, t: Date.now() })
    );
    if (r.ok) {
      setSave((v) => v && { ...v, busy: false, done: r });
      [784, 988, 1175].forEach((f, k) => tone(f, { type: "sine", vol: 0.04, dur: 0.8, at: k * 0.07 }));
    } else setSave((v) => v && { ...v, busy: false, err: r.error, field: r.field });
  };

  const share = async () => {
    if (!stars.length) return flash("Put a few stars in the sky first.");
    const url = shareUrl(stars, title);
    const name = cleanTitle(title);
    try {
      if (matchMedia("(pointer: coarse)").matches && navigator.share) {
        await navigator.share({ title: name || "A song in the stars", text: "I wrote you a song in the stars ✦", url });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      flash("Link copied. Whoever opens it hears your song.");
    } catch {
      window.prompt("Copy your song's link:", url);
    }
    [784, 988, 1175].forEach((f, k) => tone(f, { type: "sine", vol: 0.04, dur: 0.8, at: k * 0.07 }));
  };

  const write = () => {
    stop();
    setMode("write");
    setStars([]);
    setTitle("");
    setCaret(0);
    history.replaceState(null, "", location.pathname + location.hash);
  };

  // the constellation joins the stars in playing order
  const pts = stars.map((s) => `${((s.c + 0.5) / STEPS) * 100},${((7 - s.l + 0.5) / 8) * 100}`).join(" ");

  return (
    <div ref={root} className="sc" data-mode={mode} data-playing={playing ? "" : undefined}>
      <div
        ref={score}
        className="sc-score"
        data-nosky
        aria-hidden
        onPointerMove={(e) => mode === "write" && e.pointerType === "mouse" && setGhost(cell(e))}
        onPointerLeave={() => setGhost(null)}
        onClick={(e) => {
          if (mode !== "write") return;
          const st = cell(e);
          if (!st) return;
          toggle(st, "click");
          setCaret((st.c + 1) % STEPS);
        }}
      >
        {LANES.map((n, i) => (
          <span key={n} className="sc-lane" style={{ top: `${((7 - i + 0.5) / 8) * 100}%` } as CSSProperties}>
            <b>{LANE_LABEL[i]}</b>
          </span>
        ))}
        {[8, 16, 24].map((c) => (
          <span key={c} className="sc-bar" style={{ left: `${(c / STEPS) * 100}%` }} />
        ))}
        {mode === "write" && <span className="sc-caret" style={{ left: `${((caret + 0.5) / STEPS) * 100}%` }} />}
        <svg className="sc-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
          {stars.length > 1 && <polyline points={pts} />}
        </svg>
        {stars.map((s) => (
          <span
            key={`${s.c}-${s.l}`}
            className="sc-star"
            data-lit={lit === s.c ? "" : undefined}
            style={{ left: `${((s.c + 0.5) / STEPS) * 100}%`, top: `${((7 - s.l + 0.5) / 8) * 100}%`, "--h": s.l } as CSSProperties}
          />
        ))}
        {ghost && !stars.some((s) => s.c === ghost.c && s.l === ghost.l) && (
          <span className="sc-star sc-ghost" style={{ left: `${((ghost.c + 0.5) / STEPS) * 100}%`, top: `${((7 - ghost.l + 0.5) / 8) * 100}%` }} />
        )}
        <div ref={head} className="sc-head" />
      </div>

      {createPortal(
      <div className="sc-dock dusk-panel" data-away={away ? "" : undefined} inert={away} role="region" aria-label={mode === "write" ? "Write a song in the stars" : "A song someone wrote you"}>
        {mode === "listen" ? (
          <>
            <p className="sc-k">Someone wrote you a song in the stars</p>
            <p className="sc-title">{title ? `“${title}”` : "Untitled constellation"}</p>
            <p className="sc-help">
              {stars.length} star{stars.length === 1 ? "" : "s"}, played left to right across the sky.
            </p>
            <div className="sc-row">
              <button type="button" className="btn btn-sm" onClick={playing ? stop : play}>
                {playing ? "Stop" : "Listen"} <span aria-hidden>{playing ? "■" : "▶"}</span>
              </button>
              <button type="button" className="sc-ghostbtn" onClick={write}>
                Write one back
              </button>
              <button type="button" className="sc-ghostbtn" onClick={onClose}>
                Close
              </button>
            </div>
            <a className="sc-more" href="/made-here#songs">
              More songs people wrote here <span aria-hidden>→</span>
            </a>
          </>
        ) : save ? (
          <form
            className="sc-save"
            onSubmit={(e) => {
              e.preventDefault();
              void saveSong();
            }}
          >
            <div className="sc-top">
              <p className="sc-title">{save.done ? "Saved to the gallery" : `Save “${cleanTitle(title) || "your song"}”`}</p>
              <button type="button" className="sc-x" aria-label="Back to the composer" onClick={() => setSave(null)}>
                ×
              </button>
            </div>
            {save.done ? (
              <>
                <p className="sc-help" role="status">
                  {save.done.status === "shown"
                    ? "It's in the gallery now, with your name on it."
                    : save.done.status === "pending"
                      ? "It's in. Lana listens to new songs first, so it shows in the gallery once she has. It shows for you there now, marked as waiting."
                      : "The gallery's store isn't connected on this copy of the site, so your song is saved in this browser and shows for you in the gallery."}
                </p>
                <div className="sc-row">
                  <a className="btn btn-sm" href={pieceUrl(save.done.piece)}>
                    See it in the gallery <span aria-hidden>→</span>
                  </a>
                  <button type="button" className="sc-ghostbtn" onClick={share}>
                    Copy its link
                  </button>
                  <button type="button" className="sc-ghostbtn" onClick={() => setSave(null)}>
                    Keep writing
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="sc-help">It goes in the visitors&apos; gallery with your name on it, where anyone can play it.</p>
                <label className="sc-field">
                  <span>Your name</span>
                  <input required maxLength={MADE_LIMITS.name} value={save.name} autoComplete="given-name" placeholder="First name is fine" aria-invalid={save.field === "name" || undefined} onChange={(e) => setSave({ ...save, name: e.target.value })} autoFocus />
                </label>
                <label className="sc-field">
                  <span>
                    A line about it <i>(optional)</i>
                  </span>
                  <input maxLength={MADE_LIMITS.note} value={save.note} placeholder="For my sister, who hums this" aria-invalid={save.field === "note" || undefined} onChange={(e) => setSave({ ...save, note: e.target.value })} />
                </label>
                <input ref={hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="sc-hp" />
                {save.err && (
                  <p className="sc-err" role="alert">
                    {save.err}
                  </p>
                )}
                <div className="sc-row">
                  <button type="submit" className="btn btn-sm" disabled={save.busy}>
                    {save.busy ? "Saving…" : "Save to the gallery"}
                  </button>
                  <button type="button" className="sc-ghostbtn" onClick={() => setSave(null)}>
                    Back
                  </button>
                </div>
              </>
            )}
          </form>
        ) : (
          <>
            <div className="sc-top">
              <p className="sc-title">Write a song in the stars</p>
              <button type="button" className="sc-x" aria-label="Close the composer" onClick={onClose}>
                ×
              </button>
            </div>
            <p className="sc-help">Click the sky to place a star: higher sings higher, further right plays later. Or type the keys below.</p>
            <div className="sc-keys" role="group" aria-label="Notes: press A to K, or tap">
              {LANES.map((n, i) => (
                <button
                  key={n}
                  type="button"
                  className="sc-key"
                  style={{ "--h": i } as CSSProperties}
                  aria-label={`${n}, key ${KEYS[i].toUpperCase()}`}
                  onClick={() => {
                    toggle({ c: caret, l: i }, "key");
                    setCaret((c) => (c + 1) % STEPS);
                  }}
                >
                  <kbd>{KEYS[i].toUpperCase()}</kbd>
                  <span>{LANE_LABEL[i]}</span>
                </button>
              ))}
            </div>
            <div className="sc-row">
              <button type="button" className="btn btn-sm" disabled={!stars.length} onClick={playing ? stop : play}>
                {playing ? "Stop" : "Play"} <span aria-hidden>{playing ? "■" : "▶"}</span>
              </button>
              <label className="sc-loop">
                <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} /> Loop
              </label>
              <button type="button" className="sc-ghostbtn" disabled={!stars.length} onClick={() => setStars((s) => s.slice(0, -1))}>
                Undo
              </button>
              <button
                type="button"
                className="sc-ghostbtn"
                disabled={!stars.length}
                onClick={() => {
                  stop();
                  setStars([]);
                  setCaret(0);
                }}
              >
                Clear
              </button>
            </div>
            <div className="sc-row sc-row--share">
              <label className="sc-name">
                <span className="sr-only">Name your constellation</span>
                <input value={title} maxLength={40} placeholder="Name your constellation" onChange={(e) => setTitle(e.target.value)} />
              </label>
              <button
                type="button"
                className="btn btn-sm"
                disabled={stars.length < 2}
                onClick={() => {
                  stop();
                  if (!cleanTitle(title)) return flash("Name your constellation first.");
                  setSave({ at: Date.now(), name: "", note: "" });
                }}
              >
                Save <span aria-hidden>✦</span>
              </button>
              <button type="button" className="sc-ghostbtn" onClick={share} disabled={!stars.length}>
                Copy link
              </button>
            </div>
            <p className="sc-count" aria-hidden>
              {stars.length} / {MAX_STARS} stars · Space plays · Backspace undoes · Esc closes
            </p>
          </>
        )}
        <p className="sr-only" aria-live="polite">
          {say}
        </p>
        {toast && (
          <p className="sc-toast" role="status">
            {toast}
          </p>
        )}
      </div>,
      document.body
      )}
    </div>
  );
}
