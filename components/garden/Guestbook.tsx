"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { COLORS, COLOR_KEYS, KINDS, KIND_LABEL, LIMITS, SEEDS, flowerSvg, hashOf, type ColorKey, type Flower, type Kind } from "@/lib/garden/flowers";
import { chime } from "@/lib/dusk/skySong";
import { oops } from "@/lib/dusk/sound";

/**
 * The guestbook garden, at the foot of the contact section: every visitor
 * who wants to can plant a pixel flower with their name and a short note,
 * and it grows in the bed for everyone who comes after. Hover, focus or tap
 * a flower to read it; each one chimes a note of the page's key.
 *
 * Flowers go through Lana first (see lib/garden/store.ts): yours shows
 * straight away in your own browser, marked "waiting to bloom", and joins
 * everyone's garden once she lets it. With no store configured the garden
 * runs offline and keeps your flower in this browser.
 */
const MINE = "garden-mine-v1";
const KIND_NOTE: Record<Kind, number> = { daisy: 2, tulip: 4, cosmos: 5, lotus: 3, bell: 6, heart: 7 };
const fmt = (t: number) => new Date(t).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });

const svgOf = (f: { kind: Kind; color: ColorKey; id: string }) => flowerSvg(f.kind, f.color, f.id);

function Pixel({ f, cell }: { f: { kind: Kind; color: ColorKey; id: string }; cell: number }) {
  const { svg, w, h } = svgOf(f);
  return <span className="gb-px" style={{ width: w * cell, height: h * cell }} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export default function Guestbook() {
  const root = useRef<HTMLDivElement>(null);
  const [flowers, setFlowers] = useState<Flower[]>(SEEDS);
  const [mine, setMine] = useState<Flower[]>([]);
  const [status, setStatus] = useState<{ live: boolean; moderated: boolean }>({ live: false, moderated: true });
  const [active, setActive] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [open, setOpen] = useState<"plant" | "all" | null>(null);
  const [phone, setPhone] = useState(false);

  // "Plant a flower" from the gallery lands on /#plant: open the planting dialog
  useEffect(() => {
    if (location.hash !== "#plant") return;
    root.current?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the URL on arrival
    setOpen("plant");
    history.replaceState(null, "", location.pathname + location.search + "#garden");
  }, []);

  // fetch the garden once it's nearly in view, and read back your own flowers
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MINE);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one read of this browser's flowers
      if (raw) setMine(JSON.parse(raw));
    } catch {}
    const mq = matchMedia("(max-width: 639px)");
    setPhone(mq.matches);
    const onMq = () => setPhone(mq.matches);
    mq.addEventListener("change", onMq);
    const el = root.current;
    if (!el) return () => mq.removeEventListener("change", onMq);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        fetch("/api/garden")
          .then((r) => r.json())
          .then((d: { live: boolean; moderated: boolean; flowers: Flower[] }) => {
            setFlowers(d.flowers);
            setStatus({ live: d.live, moderated: d.moderated });
          })
          .catch(() => {});
      },
      { rootMargin: "700px 0px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", onMq);
    };
  }, []);

  // your flowers that the garden hasn't taken in yet, then everyone's
  const all = useMemo(() => {
    const own = mine.filter((m) => !flowers.some((f) => f.id === m.id)).map((m) => ({ ...m, pending: m.pending ?? true }));
    return [...own, ...flowers];
  }, [mine, flowers]);
  const shown = all.slice(0, phone ? 12 : 28);
  const cell = phone ? 4 : 6;

  // where each flower stands: spread by the golden ratio, three rows deep
  const spots = useMemo(
    () =>
      shown.map((f, i) => {
        const h = hashOf(f.id),
          row = shown.length < 6 ? 2 : h % 3;
        return { x: 6 + ((i * 0.618034 + 0.31) % 1) * 88, row, h: svgOf(f).h };
      }),
    [shown]
  );

  // tap outside a flower closes its note
  useEffect(() => {
    if (!active) return;
    const off = (e: PointerEvent) => !(e.target as HTMLElement).closest(".gb-f, .gb-tip") && setActive(null);
    window.addEventListener("pointerdown", off);
    return () => window.removeEventListener("pointerdown", off);
  }, [active]);

  const planted = (f: Flower, live: boolean) => {
    const next = [f, ...mine.filter((m) => m.id !== f.id)].slice(0, 12);
    setMine(next);
    try {
      localStorage.setItem(MINE, JSON.stringify(next));
    } catch {}
    setOpen(null);
    setFresh(f.id);
    setActive(f.id);
    [0, 2, 4, 5].forEach((l, k) => chime(l, k * 0.12));
    root.current?.querySelector(".gb-bed")?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    if (!live) setStatus((s) => ({ ...s, live: false }));
  };

  const act = shown.find((f) => f.id === active);
  const actSpot = act ? spots[shown.indexOf(act)] : null;

  return (
    <div ref={root} id="garden" className="gb" aria-labelledby="gb-h">
      <div className="gb-head dusk-panel">
        <p className="gb-k">
          The guestbook garden · {all.length} flower{all.length === 1 ? "" : "s"} planted
        </p>
        <h3 id="gb-h" className="gb-title">
          Leave a <em>flower</em>
        </h3>
        <p className="gb-lede">Before you go, plant one with your name and a short note. It grows here for everyone who visits after you.</p>
        <div className="gb-acts">
          <button type="button" className="btn" onClick={() => setOpen("plant")}>
            Plant a flower <span aria-hidden>✿</span>
          </button>
          {all.length > shown.length && (
            <button type="button" className="link gb-more" onClick={() => setOpen("all")}>
              Walk the whole garden ({all.length})
            </button>
          )}
          <a href="/made-here" className="link gb-more">
            Everything visitors made <span aria-hidden>→</span>
          </a>
        </div>
      </div>

      <div className="gb-bedwrap">
      <ul className="gb-bed" aria-label="Flowers planted by visitors">
        {shown.map((f, i) => {
          const s = spots[i];
          return (
            <li key={f.id} style={{ left: `${s.x}%`, zIndex: 3 + s.row } as CSSProperties} data-row={s.row}>
              <button
                type="button"
                className="gb-f"
                data-fresh={fresh === f.id ? "" : undefined}
                data-pending={f.pending ? "" : undefined}
                aria-expanded={active === f.id}
                aria-label={`${KIND_LABEL[f.kind]} from ${f.name}${f.note ? `: ${f.note}` : ""}${f.pending ? " (waiting to bloom)" : ""}`}
                onClick={() => {
                  setActive(active === f.id ? null : f.id);
                  chime(KIND_NOTE[f.kind] ?? 3);
                }}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(f.id)}
                onFocus={() => setActive(f.id)}
              >
                <Pixel f={f} cell={cell} />
              </button>
            </li>
          );
        })}
      </ul>

      {act && actSpot && (
        <div
          className="gb-tip dusk-panel"
          role="status"
          style={{ "--x": `${actSpot.x}%`, bottom: actSpot.h * cell * [0.72, 0.86, 1][actSpot.row] + [64, 32, 0][actSpot.row] + 18 } as CSSProperties}
        >
          <p className="gb-tname">{act.name}</p>
          <p className="gb-tmeta">
            {KIND_LABEL[act.kind]} · {act.pending ? "waiting to bloom" : fmt(act.t)}
          </p>
          {act.note && <p className="gb-tnote">{act.note}</p>}
          {act.pending && (
            <p className="gb-tfine">
              {status.live && status.moderated ? "Only you can see it until I've checked on the garden, usually within a day." : "Kept in this browser for now."}
            </p>
          )}
        </div>
      )}
      </div>

      {open === "plant" && createPortal(<Plant live={status.live} moderated={status.moderated} onClose={() => setOpen(null)} onPlanted={planted} />, document.body)}
      {open === "all" &&
        createPortal(
          <Modal label="The whole garden" onClose={() => setOpen(null)}>
            <h3 className="gb-dtitle">
              The whole <em>garden</em>
            </h3>
            <ul className="gb-list">
              {all.map((f) => (
                <li key={f.id}>
                  <Pixel f={f} cell={3} />
                  <div>
                    <p className="gb-tname">{f.name}</p>
                    <p className="gb-tmeta">
                      {KIND_LABEL[f.kind]} · {f.pending ? "waiting to bloom" : fmt(f.t)}
                    </p>
                    {f.note && <p className="gb-tnote">{f.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Modal>,
          document.body
        )}
    </div>
  );
}

/** A native modal dialog, dressed as the site's dusk panel. */
function Modal({ label, onClose, children }: { label: string; onClose: () => void; children: React.ReactNode }) {
  const d = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    d.current?.showModal();
  }, []);
  return (
    <dialog
      ref={d}
      className="gb-dlg dusk-panel"
      aria-label={label}
      onClose={onClose}
      onPointerDown={(e) => e.target === e.currentTarget && d.current?.close()}
    >
      <button type="button" className="gb-x" aria-label="Close" onClick={() => d.current?.close()}>
        ×
      </button>
      {children}
    </dialog>
  );
}

function Plant({ live, moderated, onClose, onPlanted }: { live: boolean; moderated: boolean; onClose: () => void; onPlanted: (f: Flower, live: boolean) => void }) {
  const [kind, setKind] = useState<Kind>("daisy");
  const [color, setColor] = useState<ColorKey>("pink");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState<{ field?: "name" | "note"; msg: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const opened = useRef(0);
  const honey = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    opened.current = Date.now();
  }, []);
  const preview = { kind, color, id: `preview-${kind}-${color}` };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErr({ field: "name", msg: "Add your name, so I know who planted it." });
      oops();
      nameRef.current?.focus();
      return;
    }
    setBusy(true);
    setErr(null);
    const body = { name: name.trim(), note: note.trim(), kind, color, website: honey.current?.value ?? "", elapsed: Date.now() - opened.current };
    const local = (): Flower => ({ id: `me-${Date.now().toString(36)}`, name: body.name.slice(0, LIMITS.name), note: body.note.slice(0, LIMITS.note), kind, color, t: Date.now() });
    if (!live) {
      setBusy(false);
      return onPlanted({ ...local(), pending: true }, false);
    }
    try {
      const r = await fetch("/api/garden", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) return onPlanted({ ...(d.flower ?? local()), pending: d.status !== "planted" }, true);
      if (r.status === 503) return onPlanted({ ...local(), pending: true }, false);
      setErr({ field: d.field, msg: d.error || "Something went wrong. Try again?" });
      oops();
      (d.field === "note" ? noteRef : nameRef).current?.focus();
    } catch {
      onPlanted({ ...local(), pending: true }, false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal label="Plant a flower" onClose={onClose}>
      <form className="gb-plant" onSubmit={submit} noValidate>
        <div className="gb-pv" aria-hidden>
          <span className="gb-pvsky" />
          <span key={kind + color} className="gb-pvf">
            <Pixel f={preview} cell={9} />
          </span>
          <span className="gb-pvtag">{name.trim() || "Your name"}</span>
        </div>
        <div className="gb-fields">
          <h3 className="gb-dtitle">
            Plant a <em>flower</em>
          </h3>
          <fieldset>
            <legend>Flower</legend>
            <div className="gb-kinds">
              {KINDS.map((k) => (
                <label key={k} className="gb-opt" title={KIND_LABEL[k]}>
                  <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                  <Pixel f={{ kind: k, color, id: `opt-${k}` }} cell={3} />
                  <span>{KIND_LABEL[k]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Colour</legend>
            <div className="gb-colors">
              {COLOR_KEYS.map((c) => (
                <label key={c} className="gb-sw" style={{ "--c": COLORS[c] } as CSSProperties}>
                  <input type="radio" name="color" value={c} checked={color === c} onChange={() => setColor(c)} />
                  <span className="sr-only">{c}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="gb-field">
            <span>Your name</span>
            <input
              ref={nameRef}
              className="field"
              value={name}
              maxLength={LIMITS.name}
              autoComplete="given-name"
              aria-invalid={err?.field === "name"}
              aria-describedby={err?.field === "name" ? "gb-err" : undefined}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="gb-field">
            <span>
              <span>
                A short note <i>(optional)</i>
              </span>
              <small aria-hidden>
                {note.length}/{LIMITS.note}
              </small>
            </span>
            <textarea
              ref={noteRef}
              className="field"
              rows={2}
              value={note}
              maxLength={LIMITS.note}
              aria-invalid={err?.field === "note"}
              aria-describedby={err?.field === "note" ? "gb-err" : undefined}
              placeholder="Something kind, a song you love, hello from where you are…"
              onChange={(e) => setNote(e.target.value)}
            />
          </label>
          {/* people never see this field; bots fill it in */}
          <div className="gb-hp" aria-hidden>
            <label>
              Website <input ref={honey} name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {err && (
            <p id="gb-err" className="gb-err" role="alert">
              {err.msg}
            </p>
          )}
          <p className="gb-fine">{!live ? "The garden is resting, so your flower stays in this browser for now. " : ""}{moderated && live ? "Your flower shows here straight away and blooms for everyone once I've checked on the garden, usually within a day. Please keep it kind." : "Please keep it kind."} No links or handles.</p>
          <div className="gb-dacts">
            <button type="submit" className="btn" disabled={busy}>
              {busy ? "Planting…" : "Plant it"} <span aria-hidden>✿</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
