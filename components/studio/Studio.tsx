"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as RPointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { brands } from "@/lib/brands";
import { palettes } from "@/lib/palettes";
import {
  FONTS,
  SITE_SWATCHES,
  SIZES,
  STICKERS,
  TEMPLATES,
  TEMPLATE_CATS,
  boxOf,
  hit,
  isPlaced,
  loadFonts,
  loadImage,
  newDoc,
  render,
  stickerLayer,
  fontCss,
  uid,
  type Blend,
  type Doc,
  type FxKind,
  type Layer,
  type Placed,
  type ShapeKind,
  type TextLayer,
} from "./model";
import * as Ic from "./icons";
import { MADE_LIMITS, docUrl, pieceUrl, type Made } from "@/lib/made/kinds";
import { localId, packImage, sendPiece, thumbOf } from "@/lib/made/client";
import "./studio.css";

/*
 * "Make a pubmat with me": a small studio laid out like Photoshop, the tool
 * Lana designs every pubmat in. Menu bar, options bar for the current tool,
 * the toolbar down the left with the colour chips, the document in the
 * middle, and panels on the right (Swatches holding every brand palette as a
 * swatch group, Properties, Libraries with her own art, Layers, History).
 * Shortcuts are Photoshop's. It opens on a New Document screen, keeps a
 * draft in this browser, and exports a full-size PNG.
 *
 * An homage only: no Adobe marks, and the About item says so.
 */

type Tool = "move" | "type" | "rect" | "ellipse" | "sparkle" | "eyedropper" | "hand";
const TOOLS: { key: Tool; label: string; kbd: string; icon: ReactNode }[] = [
  { key: "move", label: "Move Tool", kbd: "V", icon: <Ic.IconMove /> },
  { key: "type", label: "Horizontal Type Tool", kbd: "T", icon: <Ic.IconType /> },
  { key: "rect", label: "Rectangle Tool", kbd: "U", icon: <Ic.IconRect /> },
  { key: "ellipse", label: "Ellipse Tool", kbd: "U", icon: <Ic.IconEllipse /> },
  { key: "sparkle", label: "Custom Shape Tool: sparkle", kbd: "U", icon: <Ic.IconSparkle /> },
  { key: "eyedropper", label: "Eyedropper Tool", kbd: "I", icon: <Ic.IconDropper /> },
  { key: "hand", label: "Hand Tool", kbd: "H", icon: <Ic.IconHand /> },
];
const MENU_NAMES = ["File", "Edit", "Image", "Layer", "Filter", "View", "Help"] as const;
const BLENDS: Blend[] = ["normal", "multiply", "screen", "overlay", "soft-light"];
const FX_NAME: Record<FxKind, string> = { grain: "Add Noise", halftone: "Color Halftone", dither: "Dither" };
const DRAFT = "studio-draft-v1";
const SWATCH_GROUPS = [
  { name: "Dusk garden (this site)", colors: SITE_SWATCHES },
  ...brands.map((b) => ({ name: b.short ?? b.name, colors: palettes[b.slug] ?? [] })),
  { name: "Bloom", colors: palettes["code-bloom"] ?? [] },
  { name: "PsyClick", colors: palettes["code-psyclick"] ?? [] },
  { name: "Algebrawl", colors: palettes["code-algebrawl"] ?? [] },
].filter((g) => g.colors.length);

const clone = (d: Doc): Doc => JSON.parse(JSON.stringify(d));
const pct = (n: number) => `${Math.round(n * 1000) / 10}%`;
const isMac = () => typeof navigator !== "undefined" && /Mac|iP(hone|ad)/.test(navigator.platform);
const mod = (e: KeyboardEvent | React.KeyboardEvent) => e.ctrlKey || e.metaKey;

type Drag =
  | { kind: "move"; id: string; px: number; py: number; ox: number; oy: number; moved: boolean }
  | { kind: "scale"; id: string; d0: number; w: number; h: number; size: number }
  | { kind: "rotate"; id: string }
  | { kind: "draw"; id: string; x0: number; y0: number }
  | { kind: "pan"; sx: number; sy: number; cx: number; cy: number };

const Chip = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
  <label className="ps-chip" style={{ "--c": value } as CSSProperties} title={label}>
    <span className="sr-only">{label}</span>
    <input type="color" value={value.length === 7 ? value : "#000000"} onChange={(e) => onChange(e.target.value)} />
  </label>
);
const Num = ({ label, value, onChange, step = 1, min, max, unit }: { label: string; value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; unit?: string }) => (
  <label className="ps-num">
    <span>{label}</span>
    <input
      type="number"
      inputMode="decimal"
      value={Math.round(value * 10) / 10}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        if (!Number.isNaN(v)) onChange(v);
      }}
    />
    {unit && <i>{unit}</i>}
  </label>
);


export default function Studio({ onClose, remix }: { onClose: () => void; remix?: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const vp = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const drag = useRef<Drag | null>(null);

  const [doc, setDoc] = useState<Doc | null>(null);
  const [h, setH] = useState<{ list: { label: string; doc: Doc }[]; i: number }>({ list: [], i: 0 });
  const [sel, setSel] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>("move");
  const [fg, setFg] = useState("#fdf3e1");
  const [bgc, setBgc] = useState("#330c4b");
  const [editing, setEditing] = useState<string | null>(null);
  const [menu, setMenu] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [fit, setFit] = useState(0.4);
  const [tab1, setTab1] = useState<"swatches" | "color">("swatches");
  const [tab2, setTab2] = useState<"properties" | "libraries">("libraries");
  const [tab3, setTab3] = useState<"layers" | "history">("layers");
  const [sheet, setSheet] = useState<"layers" | "properties" | "swatches" | "libraries" | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [newOpen, setNewOpen] = useState(true);
  const [help, setHelp] = useState<"keys" | "about" | null>(null);
  const [draft, setDraft] = useState<Doc | null>(null);
  const [rename, setRename] = useState<string | null>(null);
  const [share, setShare] = useState<{ img: string; thumb: string; json: string } | null>(null);
  const [menuAt, setMenuAt] = useState<[number, number]>([0, 0]);
  const openMenu = (m: string | null, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    setMenuAt([r.left, r.bottom + 2]);
    setMenu(m);
  };

  const docRef = useRef(doc);
  const hRef = useRef(h);
  useLayoutEffect(() => {
    docRef.current = doc;
    hRef.current = h;
  });

  const scale = fit * zoom;
  const layer = doc?.layers.find((l) => l.id === sel) ?? null;
  const placed = layer && isPlaced(layer) ? layer : null;

  /* ---------- open / close ---------- */

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    d.showModal();
    const root = document.documentElement,
      was = root.style.overflow;
    root.style.overflow = "hidden";
    try {
      const raw = localStorage.getItem(DRAFT);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one read of storage on open
      if (raw) setDraft(JSON.parse(raw));
    } catch {}
    void loadFonts().then(() => setTick((t) => t + 1));
    return () => {
      root.style.overflow = was;
    };
  }, []);

  const flash = useCallback((m: string) => {
    setToast(m);
    window.setTimeout(() => setToast((t) => (t === m ? null : t)), 2600);
  }, []);

  /* ---------- history ---------- */

  const commit = useCallback((label: string, next: Doc) => {
    setDoc(next);
    setH(({ list, i }) => {
      const l = [...list.slice(0, i + 1), { label, doc: clone(next) }].slice(-60);
      return { list: l, i: l.length - 1 };
    });
  }, []);
  const change = useCallback(
    (label: string, fn: (d: Doc) => void) => {
      const cur = docRef.current;
      if (!cur) return;
      const next = clone(cur);
      fn(next);
      commit(label, next);
    },
    [commit]
  );
  const setLayer = useCallback(
    (id: string, patch: Partial<Layer>, label = "Edit Layer") =>
      change(label, (d) => {
        const l = d.layers.find((x) => x.id === id);
        if (l) Object.assign(l, patch);
      }),
    [change]
  );
  const jump = (i: number) => {
    const it = hRef.current.list[i];
    if (!it) return;
    setH((s) => ({ ...s, i }));
    setDoc(clone(it.doc));
    setEditing(null);
  };
  const undo = () => jump(hRef.current.i - 1);
  const redo = () => jump(hRef.current.i + 1);

  const start = (d: Doc, label = "New") => {
    setDoc(d);
    setH({ list: [{ label, doc: clone(d) }], i: 0 });
    setSel(null);
    setEditing(null);
    setNewOpen(false);
    setZoom(1);
  };

  // "Remix in the studio" from the gallery: open that pubmat's layers
  useEffect(() => {
    if (!remix) return;
    let on = true;
    fetch(docUrl(remix))
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: Doc) => {
        if (!on || !d?.layers) return;
        void Promise.all(d.layers.map((l) => (l.kind === "image" ? loadImage(l.src).catch(() => null) : null))).then(() => on && setTick((t) => t + 1));
        start({ ...d, name: d.name.replace(/(\.psd)?$/, " remix.psd") }, "Open Remix");
      })
      .catch(() => on && flash("That pubmat can't be remixed. Start from a layout instead."));
    return () => {
      on = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the studio opens on a remix
  }, [remix]);

  // keep a draft in this browser (placed photos are left out: they live only in this tab)
  useEffect(() => {
    if (!doc || !h.list.length) return;
    const t = window.setTimeout(() => {
      try {
        const keep = { ...doc, layers: doc.layers.filter((l) => !(l.kind === "image" && l.src.startsWith("blob:"))) };
        localStorage.setItem(DRAFT, JSON.stringify(keep));
      } catch {}
    }, 400);
    return () => clearTimeout(t);
  }, [h, doc]);

  /* ---------- fit and draw ---------- */

  useLayoutEffect(() => {
    const el = vp.current;
    if (!el || !doc) return;
    const measure = () => setFit(Math.max(0.05, Math.min((el.clientWidth - 48) / doc.w, (el.clientHeight - 48) / doc.h)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [doc?.w, doc?.h, doc]);

  // images the document uses: draw again as each arrives
  useEffect(() => {
    if (!doc) return;
    doc.layers.forEach((l) => {
      if (l.kind === "image") void loadImage(l.src).then(() => setTick((t) => t + 1)).catch(() => {});
    });
  }, [doc]);

  useEffect(() => {
    const c = cv.current;
    if (!c || !doc) return;
    const id = requestAnimationFrame(() => {
      const dpr = Math.min(2, window.devicePixelRatio || 1),
        k = scale * dpr,
        W = Math.round(doc.w * k),
        H = Math.round(doc.h * k);
      if (c.width !== W || c.height !== H) {
        c.width = W;
        c.height = H;
      }
      render(c.getContext("2d", { willReadFrequently: true })!, doc, k, editing ?? undefined);
    });
    return () => cancelAnimationFrame(id);
  }, [doc, scale, editing, tick]);

  /* ---------- pointer on the document ---------- */

  const toDoc = (e: { clientX: number; clientY: number }) => {
    const r = cv.current!.getBoundingClientRect();
    return [(e.clientX - r.left) / scale, (e.clientY - r.top) / scale] as const;
  };

  const addLayer = (l: Layer, label: string) => {
    change(label, (d) => {
      // above the selected layer, or on top
      const at = d.layers.findIndex((x) => x.id === sel);
      d.layers.splice(at >= 0 ? at + 1 : d.layers.length, 0, l);
    });
    setSel(l.id);
  };

  const newText = (x: number, y: number) => {
    const l: TextLayer = {
      id: uid(),
      name: "Your text",
      visible: true,
      opacity: 1,
      blend: "normal",
      kind: "text",
      x,
      y,
      rot: 0,
      text: "Your text",
      font: "redaction-italic",
      size: 96,
      color: fg,
      align: "center",
      track: 0,
      lead: 1.1,
    };
    addLayer(l, "Type Layer");
    setEditing(l.id);
  };

  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (!doc || e.button > 0) return;
    setMenu(null);
    if (editing) {
      setEditing(null);
      commitText();
      if (tool === "type") return;
    }
    const [x, y] = toDoc(e);
    if (tool === "hand") {
      const el = vp.current!;
      drag.current = { kind: "pan", sx: el.scrollLeft, sy: el.scrollTop, cx: e.clientX, cy: e.clientY };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (tool === "eyedropper") {
      const c = cv.current!,
        r = c.getBoundingClientRect(),
        px = c.getContext("2d")!.getImageData(Math.round(((e.clientX - r.left) / r.width) * c.width), Math.round(((e.clientY - r.top) / r.height) * c.height), 1, 1).data;
      const hex = `#${[px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
      if (e.altKey) setBgc(hex);
      else setFg(hex);
      flash(`Sampled ${hex}`);
      return;
    }
    if (tool === "type") {
      // keep focus from leaving for the canvas: the type editor takes it
      e.preventDefault();
      const t = hit(doc, x, y);
      if (t && t.kind === "text") {
        setSel(t.id);
        setEditing(t.id);
      } else newText(x, y);
      return;
    }
    if (tool === "rect" || tool === "ellipse" || tool === "sparkle") {
      const l = {
        id: uid(),
        name: tool === "rect" ? "Rectangle" : tool === "ellipse" ? "Ellipse" : "Sparkle",
        visible: true,
        opacity: 1,
        blend: "normal" as Blend,
        kind: "shape" as const,
        shape: (tool === "rect" ? "rect" : tool) as ShapeKind,
        x,
        y,
        w: 1,
        h: 1,
        rot: 0,
        fill: fg,
        radius: 0,
      };
      setDoc({ ...doc, layers: [...doc.layers, l] });
      setSel(l.id);
      drag.current = { kind: "draw", id: l.id, x0: x, y0: y };
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    // Move Tool, auto-select on
    const t = hit(doc, x, y);
    setSel(t?.id ?? null);
    if (t) {
      drag.current = { kind: "move", id: t.id, px: x, py: y, ox: t.x, oy: t.y, moved: false };
      e.currentTarget.setPointerCapture(e.pointerId);
    }
  };

  const patchLive = (id: string, fn: (l: Placed) => void) =>
    setDoc((d) => {
      if (!d) return d;
      const layers = d.layers.map((l) => {
        if (l.id !== id || !isPlaced(l)) return l;
        const n = { ...l };
        fn(n);
        return n;
      });
      return { ...d, layers };
    });

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g || !doc) return;
    if (g.kind === "pan") {
      vp.current!.scrollLeft = g.sx - (e.clientX - g.cx);
      vp.current!.scrollTop = g.sy - (e.clientY - g.cy);
      return;
    }
    const [x, y] = toDoc(e);
    if (g.kind === "move") {
      let nx = g.ox + x - g.px,
        ny = g.oy + y - g.py;
      if (Math.hypot(x - g.px, y - g.py) > 2) g.moved = true;
      // snap to the document's centre lines, like Smart Guides
      if (Math.abs(nx - doc.w / 2) < 10 / scale) nx = doc.w / 2;
      if (Math.abs(ny - doc.h / 2) < 10 / scale) ny = doc.h / 2;
      if (e.shiftKey) {
        if (Math.abs(x - g.px) > Math.abs(y - g.py)) ny = g.oy;
        else nx = g.ox;
      }
      patchLive(g.id, (l) => {
        l.x = nx;
        l.y = ny;
      });
    } else if (g.kind === "draw") {
      let w = Math.abs(x - g.x0),
        hh = Math.abs(y - g.y0);
      if (e.shiftKey) w = hh = Math.max(w, hh);
      patchLive(g.id, (l) => {
        if (l.kind !== "shape") return;
        l.w = w;
        l.h = hh;
        l.x = g.x0 + (x < g.x0 ? -w / 2 : w / 2);
        l.y = g.y0 + (y < g.y0 ? -hh / 2 : hh / 2);
      });
    } else if (g.kind === "scale") {
      const l = doc.layers.find((x) => x.id === g.id);
      if (!l || !isPlaced(l)) return;
      const k = Math.max(0.05, Math.hypot(x - l.x, y - l.y) / g.d0);
      patchLive(g.id, (n) => {
        if (n.kind === "text") n.size = Math.max(6, Math.round(g.size * k));
        else {
          n.w = Math.max(4, g.w * k);
          n.h = Math.max(4, g.h * k);
        }
      });
    } else if (g.kind === "rotate") {
      const l = doc.layers.find((x) => x.id === g.id);
      if (!l || !isPlaced(l)) return;
      let a = (Math.atan2(y - l.y, x - l.x) * 180) / Math.PI + 90;
      if (e.shiftKey) a = Math.round(a / 15) * 15;
      a = ((a + 540) % 360) - 180;
      patchLive(g.id, (n) => {
        n.rot = Math.round(a * 10) / 10;
      });
    }
  };

  const onUp = () => {
    const g = drag.current;
    drag.current = null;
    if (!g || !doc || g.kind === "pan") return;
    if (g.kind === "move" && !g.moved) return;
    if (g.kind === "draw") {
      const l = doc.layers.find((x) => x.id === g.id);
      // a click without a drag places a 260px shape
      if (l && l.kind === "shape" && l.w < 8 && l.h < 8) {
        commit(l.name, { ...doc, layers: doc.layers.map((x) => (x.id === l.id ? { ...l, w: 260, h: 260, x: g.x0, y: g.y0 } : x)) });
        return;
      }
      commit(l?.name ?? "Shape", doc);
      return;
    }
    commit(g.kind === "move" ? "Move" : g.kind === "scale" ? "Free Transform" : "Rotate", doc);
  };

  const handleDown = (kind: "scale" | "rotate") => (e: RPointerEvent) => {
    e.stopPropagation();
    if (!placed) return;
    const [x, y] = toDoc(e);
    const b = boxOf(placed);
    drag.current =
      kind === "scale"
        ? { kind, id: placed.id, d0: Math.max(1, Math.hypot(x - placed.x, y - placed.y)), w: b.w, h: b.h, size: placed.kind === "text" ? placed.size : 0 }
        : { kind, id: placed.id };
    (e.currentTarget.closest(".ps-art") as HTMLElement).setPointerCapture(e.pointerId);
  };

  /* ---------- text editing ---------- */

  const editRef = useRef<HTMLTextAreaElement>(null);
  const editStart = useRef<string>("");
  useEffect(() => {
    const t = editRef.current;
    if (!editing || !t) return;
    editStart.current = t.value;
    const id = requestAnimationFrame(() => {
      t.focus();
      t.select();
    });
    return () => cancelAnimationFrame(id);
  }, [editing]);
  const commitText = () => {
    const d = docRef.current,
      id = editing;
    if (!d || !id) return;
    const l = d.layers.find((x) => x.id === id);
    if (l && l.kind === "text") {
      const name = l.text.split("\n")[0].slice(0, 28) || "Text";
      if (!l.text.trim()) {
        commit("Delete Layer", { ...d, layers: d.layers.filter((x) => x.id !== id) });
        setSel(null);
      } else commit("Edit Type Layer", { ...d, layers: d.layers.map((x) => (x.id === id ? { ...l, name } : x)) });
    }
    setEditing(null);
  };
  const cancelText = () => {
    if (!editing) return;
    patchLive(editing, (l) => {
      if (l.kind === "text") l.text = editStart.current;
    });
    setEditing(null);
  };

  /* ---------- layer actions ---------- */

  const dupLayer = () => {
    if (!layer || layer.kind === "fill") return;
    const n = { ...clone({ name: "", w: 0, h: 0, layers: [layer] }).layers[0], id: uid(), name: `${layer.name} copy` } as Layer;
    if (isPlaced(n)) {
      n.x += 24;
      n.y += 24;
    }
    addLayer(n, "Duplicate Layer");
  };
  const delLayer = () => {
    if (!layer || layer.kind === "fill") return;
    change("Delete Layer", (d) => {
      d.layers = d.layers.filter((l) => l.id !== layer.id);
    });
    setSel(null);
  };
  const arrange = (by: number) => {
    if (!layer) return;
    change(by > 0 ? "Bring Forward" : "Send Backward", (d) => {
      const i = d.layers.findIndex((l) => l.id === layer.id),
        j = Math.max(1, Math.min(d.layers.length - 1, i + by));
      if (i < 1) return;
      const [l] = d.layers.splice(i, 1);
      d.layers.splice(j, 0, l);
    });
  };
  const addFx = (fx: FxKind) => {
    const l: Layer = { id: uid(), name: FX_NAME[fx], visible: true, opacity: 1, blend: "normal", kind: "fx", fx, amount: fx === "grain" ? 0.35 : 0.5 };
    change(FX_NAME[fx], (d) => {
      d.layers.push(l);
    });
    setSel(l.id);
    setTab2("properties");
  };
  const addSticker = (i: number, x?: number, y?: number) => {
    if (!doc) return;
    const s = STICKERS[i];
    const w = Math.min(s.w, doc.w * 0.8);
    void loadImage(s.src).then(() => setTick((t) => t + 1));
    addLayer(stickerLayer(s, x ?? doc.w / 2, y ?? doc.h / 2, w), `Place ${s.label}`);
    setTool("move");
  };
  const placeFile = (f: File) => {
    if (!doc || !f.type.startsWith("image/")) return;
    const url = URL.createObjectURL(f);
    void loadImage(url).then((im) => {
      const w = Math.min(doc.w * 0.8, im.naturalWidth),
        hh = (w * im.naturalHeight) / im.naturalWidth;
      addLayer({ id: uid(), name: f.name.replace(/\.[^.]+$/, "").slice(0, 28), visible: true, opacity: 1, blend: "normal", kind: "image", src: url, x: doc.w / 2, y: doc.h / 2, w, h: hh, rot: 0 }, "Place Embedded");
      setTool("move");
    });
  };
  /** A swatch click: the new foreground colour, and the selected layer takes it too. */
  const pickColor = (c: string) => {
    setFg(c);
    if (!layer) return;
    if (layer.kind === "text") setLayer(layer.id, { color: c }, "Color");
    else if (layer.kind === "shape") setLayer(layer.id, { fill: c }, "Color");
    else if (layer.kind === "fill") setLayer(layer.id, layer.mode === "solid" ? { a: c, b: c } : { a: c }, "Color");
  };
  const align = (axis: "x" | "y") => {
    if (!placed || !doc) return;
    setLayer(placed.id, axis === "x" ? { x: doc.w / 2 } : { y: doc.h / 2 }, "Align");
  };

  /* ---------- export ---------- */

  /** the document at full size, fonts and pictures loaded */
  const flatten = async (d: Doc) => {
    await loadFonts();
    await Promise.all(d.layers.map((l) => (l.kind === "image" ? loadImage(l.src).catch(() => null) : null)));
    const c = document.createElement("canvas");
    c.width = d.w;
    c.height = d.h;
    render(c.getContext("2d", { willReadFrequently: true })!, d, 1);
    return c;
  };
  const openShare = async () => {
    if (!doc) return;
    if (editing) commitText();
    const c = await flatten(doc);
    setShare({ img: packImage(c), thumb: thumbOf(c), json: JSON.stringify(doc) });
  };
  const exportPng = async () => {
    if (!doc) return;
    if (editing) commitText();
    const c = await flatten(doc);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
    if (!blob) return flash("Export failed: try again");
    const name = `${doc.name.replace(/\.psd$/, "")}.png`;
    const f = new File([blob], name, { type: "image/png" });
    const nav = navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean };
    if (matchMedia("(pointer: coarse)").matches && nav.canShare?.({ files: [f] })) {
      try {
        await navigator.share({ files: [f], title: name });
        return;
      } catch {}
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    flash(`Exported ${name} · ${doc.w} × ${doc.h} px`);
  };

  /* ---------- keyboard: Photoshop's shortcuts ---------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, select");
      if (e.key === "Escape") {
        e.preventDefault();
        if (menu) return setMenu(null);
        if (share) return setShare(null);
        if (help) return setHelp(null);
        if (editing) return commitText();
        if (sheet) return setSheet(null);
        if (sel) return setSel(null);
        if (newOpen && doc) return setNewOpen(false);
        if (doc) return;
        return onClose();
      }
      if (typing || newOpen || share) return;
      const k = e.key.toLowerCase();
      if (mod(e)) {
        if (k === "z") {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        } else if (k === "y") {
          e.preventDefault();
          redo();
        } else if (k === "j") {
          e.preventDefault();
          dupLayer();
        } else if (k === "]" || k === "[") {
          e.preventDefault();
          arrange(k === "]" ? 1 : -1);
        } else if (k === "0") {
          e.preventDefault();
          setZoom(1);
        } else if (k === "=" || k === "+") {
          e.preventDefault();
          setZoom((z) => Math.min(4, z * 1.25));
        } else if (k === "-") {
          e.preventDefault();
          setZoom((z) => Math.max(0.25, z / 1.25));
        } else if (k === "s" || (k === "w" && e.shiftKey && e.altKey)) {
          e.preventDefault();
          void exportPng();
        } else if (k === "n") {
          e.preventDefault();
          setNewOpen(true);
        } else if (k === "d") {
          e.preventDefault();
          setSel(null);
        }
        return;
      }
      if (k === "delete" || k === "backspace") {
        e.preventDefault();
        delLayer();
      } else if (k.startsWith("arrow") && placed) {
        e.preventDefault();
        const s = e.shiftKey ? 10 : 1;
        setLayer(placed.id, { x: placed.x + (k === "arrowleft" ? -s : k === "arrowright" ? s : 0), y: placed.y + (k === "arrowup" ? -s : k === "arrowdown" ? s : 0) }, "Nudge");
      } else if (k === "x") {
        setFg(bgc);
        setBgc(fg);
      } else if (k === "d") {
        setFg("#000000");
        setBgc("#ffffff");
      } else if (k === "v") setTool("move");
      else if (k === "t") setTool("type");
      else if (k === "u") setTool((tl) => (tl === "rect" ? "ellipse" : tl === "ellipse" ? "sparkle" : "rect"));
      else if (k === "i") setTool("eyedropper");
      else if (k === "h") setTool("hand");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  /* ---------- menus ---------- */

  type Item = { label: string; kbd?: string; run?: () => void; off?: boolean } | "-" | { head: string };
  const K = isMac() ? { c: "⌘", s: "⇧", a: "⌥" } : { c: "Ctrl+", s: "Shift+", a: "Alt+" };
  const MENUS: Record<string, Item[]> = {
    File: [
      { label: "New…", kbd: `${K.c}N`, run: () => setNewOpen(true) },
      { label: "Place Embedded…", run: () => file.current?.click(), off: !doc },
      "-",
      { label: "Export As PNG…", kbd: `${K.a}${K.s}${K.c}W`, run: () => void exportPng(), off: !doc },
      { label: "Share to the Gallery…", run: () => void openShare(), off: !doc },
      "-",
      { label: "Close Studio", kbd: "Esc", run: onClose },
    ],
    Edit: [
      { label: `Undo ${h.list[h.i]?.label ?? ""}`.trim(), kbd: `${K.c}Z`, run: undo, off: h.i < 1 },
      { label: "Redo", kbd: `${K.s}${K.c}Z`, run: redo, off: h.i >= h.list.length - 1 },
      "-",
      { label: "Deselect", kbd: `${K.c}D`, run: () => setSel(null), off: !sel },
      { label: "Clear", kbd: "Delete", run: delLayer, off: !layer || layer.kind === "fill" },
    ],
    Image: [
      { head: "Canvas size" },
      ...SIZES.map((s) => ({
        label: `${s.label} · ${s.w} × ${s.h}`,
        off: !doc || (doc.w === s.w && doc.h === s.h),
        run: () =>
          change("Canvas Size", (d) => {
            const ky = s.h / d.h;
            d.layers.forEach((l) => {
              if (isPlaced(l)) l.y *= ky;
            });
            d.w = s.w;
            d.h = s.h;
          }),
      })),
    ],
    Layer: [
      { label: "New Type Layer", run: () => doc && newText(doc.w / 2, doc.h / 2), off: !doc },
      { label: "Duplicate Layer", kbd: `${K.c}J`, run: dupLayer, off: !layer || layer.kind === "fill" },
      { label: "Delete Layer", run: delLayer, off: !layer || layer.kind === "fill" },
      "-",
      { label: "Bring Forward", kbd: `${K.c}]`, run: () => arrange(1), off: !layer || layer.kind === "fill" },
      { label: "Send Backward", kbd: `${K.c}[`, run: () => arrange(-1), off: !layer || layer.kind === "fill" },
      "-",
      { label: placed?.shadow ? "Layer Style: Clear Drop Shadow" : "Layer Style: Drop Shadow…", run: () => placed && setLayer(placed.id, { shadow: !placed.shadow }, "Drop Shadow"), off: !placed },
    ],
    Filter: [
      { head: "Noise" },
      { label: "Add Noise…", run: () => addFx("grain"), off: !doc },
      { head: "Pixelate" },
      { label: "Color Halftone…", run: () => addFx("halftone"), off: !doc },
      { head: "Stylize" },
      { label: "Dither…", run: () => addFx("dither"), off: !doc },
    ],
    View: [
      { label: "Zoom In", kbd: `${K.c}+`, run: () => setZoom((z) => Math.min(4, z * 1.25)) },
      { label: "Zoom Out", kbd: `${K.c}−`, run: () => setZoom((z) => Math.max(0.25, z / 1.25)) },
      { label: "Fit on Screen", kbd: `${K.c}0`, run: () => setZoom(1) },
    ],
    Help: [
      { label: "Keyboard Shortcuts", run: () => setHelp("keys") },
      { label: "About This Studio", run: () => setHelp("about") },
    ],
  };

  /* ---------- pieces ---------- */

  const thumb = (l: Layer) => {
    // eslint-disable-next-line @next/next/no-img-element -- a layer thumbnail: blob and site-art URLs, drawn tiny
    if (l.kind === "image") return <img src={l.src} alt="" className={l.pixel ? "px" : ""} />;
    if (l.kind === "text") return <b className="ps-tthumb">T</b>;
    if (l.kind === "fx") return <span className="ps-fxthumb"><Ic.IconAdjust /></span>;
    if (l.kind === "shape") return <span className={`ps-sthumb ps-sthumb--${l.shape}`} style={{ "--c": l.fill } as CSSProperties} />;
    return <span className="ps-fthumb" style={{ background: l.mode === "solid" ? l.a : `linear-gradient(${l.a}, ${l.b})` }} />;
  };

  const optionsBar = () => {
    if (editing && layer?.kind === "text")
      return (
        <>
          {typeOptions(layer)}
          <span className="ps-grow" />
          <button type="button" className="ps-ib" title="Cancel (Esc keeps it)" aria-label="Cancel type edits" onClick={cancelText}>
            <Ic.IconCancel />
          </button>
          <button type="button" className="ps-ib ps-ib--ok" title="Commit (Esc)" aria-label="Commit type edits" onClick={commitText}>
            <Ic.IconCheck />
          </button>
        </>
      );
    if (tool === "type") return layer?.kind === "text" ? typeOptions(layer) : <span className="ps-hint">Click the document to add text. Click a text layer to edit it.</span>;
    if (tool === "rect" || tool === "ellipse" || tool === "sparkle")
      return (
        <>
          <span className="ps-lab">Fill</span>
          <Chip value={fg} onChange={setFg} label="Fill colour" />
          <span className="ps-hint">Drag to draw. Hold Shift for a square. A click places one 260 px wide.</span>
        </>
      );
    if (tool === "eyedropper") return <span className="ps-hint">Click to sample a colour. Alt-click samples the background colour.</span>;
    if (tool === "hand") return <span className="ps-hint">Drag to scroll around the document. {K.c}0 fits it back on screen.</span>;
    return (
      <>
        <label className="ps-check">
          <input type="checkbox" checked readOnly /> Auto-Select: Layer
        </label>
        <span className="ps-sep" />
        <button type="button" className="ps-ib" title="Align horizontal centres" aria-label="Align to horizontal centre" disabled={!placed} onClick={() => align("x")}>
          <Ic.IconCenterH />
        </button>
        <button type="button" className="ps-ib" title="Align vertical centres" aria-label="Align to vertical centre" disabled={!placed} onClick={() => align("y")}>
          <Ic.IconCenterV />
        </button>
        <span className="ps-sep" />
        <span className="ps-hint">{placed ? "Drag to move · corners scale · the knob rotates (Shift snaps)" : "Click a layer on the document to select it"}</span>
      </>
    );
  };

  const typeOptions = (l: TextLayer) => {
    return (
      <>
        <select className="ps-sel" aria-label="Font" value={l.font} onChange={(e) => setLayer(l.id, { font: e.target.value as TextLayer["font"] }, "Font")}>
          {FONTS.map((f) => (
            <option key={f.key} value={f.key}>
              {f.label}
            </option>
          ))}
        </select>
        <Num label="Size" value={l.size} min={6} max={600} onChange={(v) => setLayer(l.id, { size: Math.max(6, v) }, "Font Size")} unit="px" />
        <span className="ps-seg" role="group" aria-label="Alignment">
          {(["left", "center", "right"] as const).map((a) => (
            <button key={a} type="button" className="ps-ib" aria-pressed={l.align === a} aria-label={`Align ${a}`} onClick={() => setLayer(l.id, { align: a }, "Paragraph")}>
              {a === "left" ? <Ic.IconAlignL /> : a === "center" ? <Ic.IconAlignC /> : <Ic.IconAlignR />}
            </button>
          ))}
        </span>
        <Chip value={l.color} onChange={(c) => setLayer(l.id, { color: c }, "Color")} label="Text colour" />
      </>
    );
  }

  const properties = () => {
    if (!layer) return <p className="ps-empty">Select a layer to see its properties.</p>;
    const id = layer.id;
    return (
      <div className="ps-props">
        <p className="ps-ptitle">
          {layer.kind === "text" ? "Type layer" : layer.kind === "shape" ? "Shape layer" : layer.kind === "image" ? "Embedded image" : layer.kind === "fx" ? "Adjustment" : "Background"}
        </p>
        {isPlaced(layer) && (
          <div className="ps-grid">
            <Num label="X" value={layer.x} onChange={(v) => setLayer(id, { x: v }, "Move")} unit="px" />
            <Num label="Y" value={layer.y} onChange={(v) => setLayer(id, { y: v }, "Move")} unit="px" />
            {layer.kind !== "text" && (
              <>
                <Num label="W" value={layer.w} min={4} onChange={(v) => setLayer(id, layer.kind === "image" ? { w: v, h: (v * layer.h) / layer.w } : { w: v }, "Free Transform")} unit="px" />
                <Num label="H" value={layer.h} min={4} onChange={(v) => setLayer(id, layer.kind === "image" ? { h: v, w: (v * layer.w) / layer.h } : { h: v }, "Free Transform")} unit="px" />
              </>
            )}
            <Num label="∠" value={layer.rot} min={-180} max={180} onChange={(v) => setLayer(id, { rot: v }, "Rotate")} unit="°" />
          </div>
        )}
        {layer.kind === "text" && (
          <>
            <label className="ps-field">
              <span>Text</span>
              <textarea rows={3} value={layer.text} onChange={(e) => setDoc((d) => d && { ...d, layers: d.layers.map((x) => (x.id === id ? { ...x, text: e.target.value } : x)) })} onBlur={() => doc && commit("Edit Type Layer", doc)} />
            </label>
            <label className="ps-field">
              <span>Font</span>
              <select className="ps-sel" value={layer.font} onChange={(e) => setLayer(id, { font: e.target.value as TextLayer["font"] }, "Font")}>
                {FONTS.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="ps-grid">
              <Num label="Size" value={layer.size} min={6} max={600} onChange={(v) => setLayer(id, { size: Math.max(6, v) }, "Font Size")} unit="px" />
              <Num label="VA" value={layer.track} step={10} min={-200} max={800} onChange={(v) => setLayer(id, { track: v }, "Tracking")} />
              <Num label="Lead" value={layer.lead} step={0.05} min={0.6} max={3} onChange={(v) => setLayer(id, { lead: v }, "Leading")} unit="×" />
              <label className="ps-num">
                <span>Color</span>
                <Chip value={layer.color} onChange={(c) => setLayer(id, { color: c }, "Color")} label="Text colour" />
              </label>
            </div>
          </>
        )}
        {layer.kind === "shape" && (
          <div className="ps-grid">
            <label className="ps-num">
              <span>Fill</span>
              <Chip value={layer.fill} onChange={(c) => setLayer(id, { fill: c }, "Color")} label="Shape fill" />
            </label>
            {layer.shape === "rect" && <Num label="Radius" value={layer.radius} min={0} onChange={(v) => setLayer(id, { radius: Math.max(0, v) }, "Corner Radius")} unit="px" />}
          </div>
        )}
        {layer.kind === "fill" && (
          <>
            <span className="ps-seg ps-seg--wide" role="group" aria-label="Fill type">
              {(["solid", "linear", "radial"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={layer.mode === m} onClick={() => setLayer(id, { mode: m }, "Fill Type")}>
                  {m === "solid" ? "Solid" : m === "linear" ? "Gradient" : "Radial"}
                </button>
              ))}
            </span>
            <div className="ps-grid">
              <label className="ps-num">
                <span>{layer.mode === "solid" ? "Color" : "From"}</span>
                <Chip value={layer.a} onChange={(c) => setLayer(id, layer.mode === "solid" ? { a: c, b: c } : { a: c }, "Color")} label="First colour" />
              </label>
              {layer.mode !== "solid" && (
                <label className="ps-num">
                  <span>To</span>
                  <Chip value={layer.b} onChange={(c) => setLayer(id, { b: c }, "Color")} label="Second colour" />
                </label>
              )}
            </div>
          </>
        )}
        {layer.kind === "fx" && (
          <label className="ps-field">
            <span>
              Amount <output>{Math.round(layer.amount * 100)}%</output>
            </span>
            <input type="range" min={0} max={1} step={0.01} value={layer.amount} onChange={(e) => setDoc((d) => d && { ...d, layers: d.layers.map((x) => (x.id === id ? { ...x, amount: +e.target.value } : x)) })} onPointerUp={() => doc && commit(layer.name, doc)} onKeyUp={() => doc && commit(layer.name, doc)} />
          </label>
        )}
        {isPlaced(layer) && (
          <label className="ps-check">
            <input type="checkbox" checked={!!layer.shadow} onChange={() => setLayer(id, { shadow: !layer.shadow }, "Drop Shadow")} /> Drop shadow
          </label>
        )}
      </div>
    );
  };

  const swatches = () => (
    <div className="ps-swatches">
      {SWATCH_GROUPS.map((g, gi) => (
        <details key={g.name} open={gi < 3}>
          <summary>{g.name}</summary>
          <div className="ps-sw">
            {g.colors.map((c) => (
              <button key={c} type="button" title={`${c} · sets the foreground and the selected layer`} aria-label={`Use ${c}`} style={{ "--c": c } as CSSProperties} onClick={() => pickColor(c)} />
            ))}
          </div>
        </details>
      ))}
    </div>
  );
  const colorPanel = () => (
    <div className="ps-color">
      <Chip value={fg} onChange={pickColor} label="Foreground colour" />
      <label className="ps-field">
        <span>Hex</span>
        <input value={fg} maxLength={7} spellCheck={false} onChange={(e) => /^#[0-9a-f]{6}$/i.test(e.target.value) ? pickColor(e.target.value) : setFg(e.target.value)} />
      </label>
    </div>
  );
  const libraries = () => (
    <div className="ps-lib">
      <p className="ps-libhead">Lana&apos;s garden · {STICKERS.length} graphics</p>
      <div className="ps-libgrid">
        {STICKERS.map((s, i) => (
          <button
            key={s.src}
            type="button"
            title={`${s.label} · click to place, or drag onto the document`}
            aria-label={`Place ${s.label}`}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/x-sticker", String(i))}
            onClick={() => addSticker(i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.src} alt="" className={s.pixel ? "px" : ""} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
  const layersPanel = () =>
    doc && (
      <div className="ps-layers">
        <div className="ps-lrow1">
          <select className="ps-sel" aria-label="Blend mode" disabled={!layer || layer.kind === "fx"} value={layer?.blend ?? "normal"} onChange={(e) => layer && setLayer(layer.id, { blend: e.target.value as Blend }, "Blending Change")}>
            {BLENDS.map((b) => (
              <option key={b} value={b}>
                {b === "soft-light" ? "Soft Light" : b[0].toUpperCase() + b.slice(1)}
              </option>
            ))}
          </select>
          <Num label="Opacity" value={Math.round((layer?.opacity ?? 1) * 100)} min={0} max={100} onChange={(v) => layer && setLayer(layer.id, { opacity: Math.max(0, Math.min(100, v)) / 100 }, "Opacity Change")} unit="%" />
        </div>
        <ol className="ps-llist" aria-label="Layers, top first">
          {[...doc.layers].reverse().map((l) => (
            <li key={l.id} aria-current={l.id === sel ? "true" : undefined} data-hidden={l.visible ? undefined : ""}>
              <button type="button" className="ps-eye" aria-label={`${l.visible ? "Hide" : "Show"} ${l.name}`} aria-pressed={l.visible} onClick={() => setLayer(l.id, { visible: !l.visible }, l.visible ? "Hide Layer" : "Show Layer")}>
                {l.visible ? <Ic.IconEye /> : <Ic.IconEye off />}
              </button>
              <button
                type="button"
                className="ps-lbtn"
                onClick={() => {
                  setSel(l.id);
                  if (l.kind !== "fill" || tab2 !== "libraries") setTab2("properties");
                }}
                onDoubleClick={() => l.kind !== "fill" && setRename(l.id)}
              >
                <span className="ps-thumb">{thumb(l)}</span>
                {rename === l.id ? (
                  <input
                    className="ps-rename"
                    defaultValue={l.name}
                    autoFocus
                    maxLength={40}
                    aria-label="Layer name"
                    onBlur={(e) => {
                      setRename(null);
                      if (e.target.value.trim() && e.target.value !== l.name) setLayer(l.id, { name: e.target.value.trim() }, "Rename Layer");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur();
                    }}
                  />
                ) : (
                  <span className={`ps-lname ${l.kind === "fill" ? "ps-lname--bg" : ""}`}>{l.name}</span>
                )}
                {isPlaced(l) && l.shadow && <span className="ps-fxb" title="Drop shadow">fx</span>}
                {l.kind === "fill" && (
                  <span className="ps-lock" title="Background is locked in place">
                    <Ic.IconLock />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ol>
        <div className="ps-lfoot">
          <button type="button" className="ps-ib" title="Layer style: drop shadow" aria-label="Toggle drop shadow" disabled={!placed} onClick={() => placed && setLayer(placed.id, { shadow: !placed.shadow }, "Drop Shadow")}>
            <Ic.IconFx />
          </button>
          <span className="ps-adj">
            <button type="button" className="ps-ib" title="New adjustment layer" aria-label="New adjustment layer" aria-haspopup="menu" aria-expanded={menu === "adj"} onClick={() => setMenu(menu === "adj" ? null : "adj")}>
              <Ic.IconAdjust />
            </button>
            {menu === "adj" && (
              <span className="ps-menu ps-menu--up" role="menu">
                {(["grain", "halftone", "dither"] as FxKind[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      addFx(f);
                      setMenu(null);
                    }}
                  >
                    {FX_NAME[f]}
                  </button>
                ))}
              </span>
            )}
          </span>
          <button type="button" className="ps-ib" title="Bring forward" aria-label="Bring layer forward" disabled={!layer || layer.kind === "fill"} onClick={() => arrange(1)}>
            <Ic.IconUp />
          </button>
          <button type="button" className="ps-ib" title="Send backward" aria-label="Send layer backward" disabled={!layer || layer.kind === "fill"} onClick={() => arrange(-1)}>
            <Ic.IconDown />
          </button>
          <button type="button" className="ps-ib" title="New type layer" aria-label="New type layer" onClick={() => newText(doc.w / 2, doc.h / 2)}>
            <Ic.IconNewText />
          </button>
          <button type="button" className="ps-ib" title="Duplicate layer" aria-label="Duplicate layer" disabled={!layer || layer.kind === "fill"} onClick={dupLayer}>
            <Ic.IconDup />
          </button>
          <button type="button" className="ps-ib" title="Delete layer" aria-label="Delete layer" disabled={!layer || layer.kind === "fill"} onClick={delLayer}>
            <Ic.IconTrash />
          </button>
        </div>
      </div>
    );
  const history = () => (
    <ol className="ps-hist">
      {h.list.map((it, i) => (
        <li key={i}>
          <button type="button" aria-current={i === h.i ? "true" : undefined} data-after={i > h.i ? "" : undefined} onClick={() => jump(i)}>
            {it.label}
          </button>
        </li>
      ))}
    </ol>
  );

  /* the transform box and the type editor, in screen pixels over the canvas */
  const overlay = () => {
    if (!placed || !doc) return null;
    const b = boxOf(placed);
    const box: CSSProperties = {
      left: placed.x * scale,
      top: placed.y * scale,
      width: b.w * scale,
      height: b.h * scale,
      transform: `translate(-50%, -50%) rotate(${placed.rot}deg)`,
    };
    if (editing === placed.id && placed.kind === "text") {
      const s = placed.size * scale;
      return (
        <textarea
          ref={editRef}
          className="ps-typed"
          aria-label="Type"
          wrap="off"
          spellCheck={false}
          defaultValue={placed.text}
          rows={placed.text.split("\n").length}
          style={{
            ...box,
            width: Math.max(b.w * scale + s, 80),
            height: b.h * scale + s * 0.2,
            font: fontCss(placed.font, s),
            lineHeight: placed.lead,
            letterSpacing: `${(placed.track / 1000) * s}px`,
            color: placed.color,
            textAlign: placed.align,
          }}
          onChange={(e) => {
            const v = e.target.value;
            e.target.rows = v.split("\n").length;
            patchLive(placed.id, (l) => {
              if (l.kind === "text") l.text = v;
            });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && mod(e)) {
              e.preventDefault();
              commitText();
            }
          }}
          onPointerDown={(e) => e.stopPropagation()}
        />
      );
    }
    return (
      <div className="ps-box" style={box} aria-hidden>
        {(["nw", "ne", "sw", "se"] as const).map((c) => (
          <span key={c} className={`ps-h ps-h--${c}`} onPointerDown={handleDown("scale")} />
        ))}
        <span className="ps-rot" onPointerDown={handleDown("rotate")} />
      </div>
    );
  };

  const toolbar = (
    <div className="ps-tools" role="toolbar" aria-label="Tools" aria-orientation="vertical">
      {TOOLS.map((t) => (
        <button key={t.key} type="button" className="ps-tool" aria-pressed={tool === t.key} title={`${t.label} (${t.kbd})`} aria-label={`${t.label} (${t.kbd})`} onClick={() => setTool(t.key)}>
          {t.icon}
        </button>
      ))}
      <div className="ps-fgbg">
        <label className="ps-fg" style={{ "--c": fg } as CSSProperties} title="Set foreground colour">
          <span className="sr-only">Foreground colour</span>
          <input type="color" value={/^#[0-9a-f]{6}$/i.test(fg) ? fg : "#000000"} onChange={(e) => pickColor(e.target.value)} />
        </label>
        <label className="ps-bg" style={{ "--c": bgc } as CSSProperties} title="Set background colour">
          <span className="sr-only">Background colour</span>
          <input type="color" value={bgc} onChange={(e) => setBgc(e.target.value)} />
        </label>
        <button
          type="button"
          className="ps-swap"
          title="Switch foreground and background colours (X)"
          aria-label="Switch foreground and background colours"
          onClick={() => {
            setFg(bgc);
            setBgc(fg);
          }}
        >
          <Ic.IconSwap />
        </button>
      </div>
    </div>
  );

  const docTitle = doc ? `${doc.name} @ ${pct(scale)} (${layer ? layer.name : "RGB"}/8)` : "No document";

  return createPortal(
    <dialog
      ref={dlg}
      className="ps"
      aria-label="Pubmat studio"
      data-nodrag
      onCancel={(e) => e.preventDefault()}
      onPointerDown={(e) => {
        if (menu && !(e.target as HTMLElement).closest(".ps-menu, .ps-mbtn, .ps-adj")) setMenu(null);
      }}
    >
      <div className="ps-app" data-doc={doc ? "" : undefined}>
        {/* menu bar */}
        <header className="ps-bar">
          <span className="ps-logo" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/art/pixel-butterfly.svg" alt="" />
          </span>
          <nav className="ps-menus" aria-label="Menu bar">
            {/* the menu items' actions read refs when clicked, never while rendering */}
            {/* eslint-disable-next-line react-hooks/refs */}
            {MENU_NAMES.map((m) => (
              <span key={m} className="ps-mwrap" data-m={m}>
                <button
                  type="button"
                  className="ps-mbtn"
                  aria-haspopup="menu"
                  aria-expanded={menu === m}
                  onClick={(e) => openMenu(menu === m ? null : m, e.currentTarget)}
                  onPointerEnter={(e) => menu && menu !== "adj" && openMenu(m, e.currentTarget)}
                >
                  {m}
                </button>
                {menu === m && (
                  <span className="ps-menu" role="menu" aria-label={m} style={{ left: Math.min(menuAt[0], window.innerWidth - 248), top: menuAt[1] }}>
                    {MENUS[m].map((it, i) =>
                      it === "-" ? (
                        <hr key={i} />
                      ) : "head" in it ? (
                        <span key={i} className="ps-mhead">
                          {it.head}
                        </span>
                      ) : (
                        <button
                          key={i}
                          type="button"
                          role="menuitem"
                          disabled={it.off}
                          onClick={() => {
                            setMenu(null);
                            it.run?.();
                          }}
                        >
                          <span>{it.label}</span>
                          {it.kbd && <kbd>{it.kbd}</kbd>}
                        </button>
                      )
                    )}
                  </span>
                )}
              </span>
            ))}
          </nav>
          <span className="ps-grow" />
          <button type="button" className="ps-share" disabled={!doc} onClick={() => void openShare()} title="Hang it in the visitors' gallery">
            <Ic.IconShare /> <span>Share</span>
          </button>
          <button type="button" className="ps-export" disabled={!doc} onClick={() => void exportPng()}>
            <Ic.IconExport /> <span>Export PNG</span>
          </button>
          <button type="button" className="ps-x" aria-label="Close the studio" title="Close (your draft stays in this browser)" onClick={onClose}>
            <Ic.IconClose />
          </button>
        </header>

        {/* options bar */}
        <div className="ps-opts" role="group" aria-label="Tool options">
          <span className="ps-curtool" aria-hidden>
            {TOOLS.find((t) => t.key === tool)?.icon}
          </span>
          {doc ? optionsBar() : <span className="ps-hint">Start a document to begin.</span>}
        </div>

        {toolbar}

        {/* the document */}
        <main className="ps-main">
          <div className="ps-tabs" role="tablist" aria-label="Documents">
            <span role="tab" aria-selected="true" className="ps-doctab">
              {docTitle}
            </span>
          </div>
          <div
            ref={vp}
            className="ps-vp"
            data-tool={tool}
            onDragOver={(e) => e.dataTransfer.types.some((t) => t === "text/x-sticker" || t === "Files") && e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const s = e.dataTransfer.getData("text/x-sticker");
              if (s && cv.current) {
                const [x, y] = toDoc(e);
                addSticker(+s, x, y);
              } else if (e.dataTransfer.files[0]) placeFile(e.dataTransfer.files[0]);
            }}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget && !editing) setSel(null);
            }}
          >
            {doc && (
              <div className="ps-stage" style={{ width: Math.max(doc.w * scale + 48, 0), height: doc.h * scale + 48 }}>
                <div className="ps-art" style={{ width: doc.w * scale, height: doc.h * scale }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onDoubleClick={(e) => {
                  const [x, y] = toDoc(e);
                  const t = hit(doc, x, y);
                  if (t?.kind === "text") {
                    setSel(t.id);
                    setEditing(t.id);
                  }
                }}>
                  <canvas ref={cv} aria-label={`Your pubmat, ${doc.layers.length} layers`} role="img" />
                  {overlay()}
                </div>
              </div>
            )}
          </div>
          <footer className="ps-status">
            <span>{pct(scale)}</span>
            <span>{doc ? `${doc.w} px × ${doc.h} px (72 ppi)` : ""}</span>
            <span className="ps-grow" />
            <span className="ps-saved">{doc ? "Draft saved in this browser" : ""}</span>
          </footer>
        </main>

        {/* panels */}
        <aside className="ps-panels" aria-label="Panels" data-sheet={sheet ?? undefined}>
          <section className="ps-panel ps-panel--sw" data-tab={tab1} data-on={sheet === "swatches" ? "" : undefined}>
            <div className="ps-ptabs" role="tablist">
              {(["swatches", "color"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab1 === t} onClick={() => setTab1(t)}>
                  {t === "swatches" ? "Swatches" : "Color"}
                </button>
              ))}
            </div>
            <div className="ps-pbody">{tab1 === "swatches" ? swatches() : colorPanel()}</div>
          </section>
          <section className="ps-panel ps-panel--pr" data-on={sheet === "properties" || sheet === "libraries" ? "" : undefined}>
            <div className="ps-ptabs" role="tablist">
              {(["properties", "libraries"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={(sheet === "libraries" ? "libraries" : sheet === "properties" ? "properties" : tab2) === t} onClick={() => (sheet ? setSheet(t) : setTab2(t))}>
                  {t === "properties" ? "Properties" : "Libraries"}
                </button>
              ))}
            </div>
            <div className="ps-pbody">{(sheet === "libraries" ? "libraries" : sheet === "properties" ? "properties" : tab2) === "properties" ? properties() : libraries()}</div>
          </section>
          <section className="ps-panel ps-panel--ly" data-on={sheet === "layers" ? "" : undefined}>
            <div className="ps-ptabs" role="tablist">
              {(["layers", "history"] as const).map((t) => (
                <button key={t} type="button" role="tab" aria-selected={tab3 === t} onClick={() => setTab3(t)}>
                  {t === "layers" ? "Layers" : "History"}
                </button>
              ))}
            </div>
            <div className="ps-pbody">{tab3 === "layers" ? layersPanel() : history()}</div>
          </section>
        </aside>

        {/* phones: the panels come up as a sheet from this bar */}
        <nav className="ps-dock" aria-label="Panels">
          {(["layers", "properties", "libraries", "swatches"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={sheet === s} onClick={() => setSheet(sheet === s ? null : s)}>
              {s[0].toUpperCase() + s.slice(1)}
            </button>
          ))}
        </nav>

        {toast && (
          <p className="ps-toast" role="status">
            {toast}
          </p>
        )}

        <input ref={file} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.[0] && placeFile(e.target.files[0])} />

        {/* New Document, Photoshop's start screen */}
        {newOpen && (
          <div className="ps-scrim">
            <div className="ps-new" role="dialog" aria-modal="true" aria-labelledby="ps-new-h">
              <h2 id="ps-new-h">New Document</h2>
              <p className="ps-newsub">Start from one of my layouts, or a blank page. Everything stays editable: every layer, every colour.</p>
              <NewDoc draft={draft} onPick={start} onCancel={doc ? () => setNewOpen(false) : onClose} />
            </div>
          </div>
        )}

        {share && doc && <ShareDoc doc={doc} {...share} onClose={() => setShare(null)} onExport={() => void exportPng()} />}

        {help && (
          <div className="ps-scrim" onPointerDown={(e) => e.target === e.currentTarget && setHelp(null)}>
            <div className="ps-new ps-help" role="dialog" aria-modal="true" aria-labelledby="ps-help-h">
              <h2 id="ps-help-h">{help === "keys" ? "Keyboard Shortcuts" : "About This Studio"}</h2>
              {help === "keys" ? (
                <dl className="ps-keys">
                  {[
                    ["V · T · U · I · H", "Move, Type, Shape (press again to cycle), Eyedropper, Hand"],
                    ["X / D", "Swap colours / default black and white"],
                    [`${K.c}Z · ${K.s}${K.c}Z`, "Undo / redo"],
                    [`${K.c}J`, "Duplicate layer"],
                    [`${K.c}[ · ${K.c}]`, "Send backward / bring forward"],
                    ["Arrows (Shift)", "Nudge 1 px (10 px)"],
                    ["Delete", "Delete layer"],
                    ["Esc", "Commit type · deselect"],
                    [`${K.c}0 · ${K.c}+ · ${K.c}−`, "Fit / zoom in / zoom out"],
                    [`${K.a}${K.s}${K.c}W`, "Export as PNG"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>
                        <kbd>{k}</kbd>
                      </dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="ps-newsub">
                  I design every pubmat in Photoshop, so this little studio is laid out the same way: the tools on the left, the panels on the right, the shortcuts in my fingers. The swatches are the palettes from my brand work, and the Libraries panel holds the art drawn for this site. It&apos;s an homage, made by me, and not affiliated with Adobe.
                </p>
              )}
              <div className="ps-newacts">
                <button type="button" className="ps-btn ps-btn--blue" onClick={() => setHelp(null)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>,
    document.body
  );
}

/** The New Document screen: presets across the top, my layouts as thumbnails. */
function NewDoc({ draft, onPick, onCancel }: { draft: Doc | null; onPick: (d: Doc, label?: string) => void; onCancel: () => void }) {
  const [size, setSize] = useState(SIZES[0]);
  const [pick, setPick] = useState(TEMPLATES[0].key);
  const [cat, setCat] = useState<(typeof TEMPLATE_CATS)[number]["key"]>("all");
  const shown = cat === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.cat === cat);
  const shots = useRef<Record<string, HTMLCanvasElement | null>>({});
  const [tick, setTick] = useState(0);

  // draw each layout small, as the thumbnail
  useEffect(() => {
    let live = true;
    void Promise.all([loadFonts(), ...STICKERS.map((s) => loadImage(s.src).catch(() => null))]).then(() => live && setTick((t) => t + 1));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    const all = [...TEMPLATES.map((t) => [t.key, newDoc(t, size)] as const), ...(draft ? [["draft", draft] as const] : [])];
    all.forEach(([k, d]) => {
      const c = shots.current[k];
      if (!c) return;
      const k2 = 150 / d.w;
      c.width = 150 * 2;
      c.height = Math.round(d.h * k2 * 2);
      render(c.getContext("2d", { willReadFrequently: true })!, d, k2 * 2);
    });
  }, [size, draft, tick, cat]);

  const go = () => {
    if (pick === "draft" && draft) return onPick(draft, "Open Draft");
    const t = TEMPLATES.find((x) => x.key === pick) ?? TEMPLATES[0];
    onPick(newDoc(t, size), `New from ${t.name}`);
  };

  return (
    <>
      <div className="ps-sizes" role="radiogroup" aria-label="Document size">
        {SIZES.map((s) => (
          <button key={s.key} type="button" role="radio" aria-checked={size.key === s.key} onClick={() => setSize(s)}>
            <span className="ps-sizebox" style={{ aspectRatio: `${s.w} / ${s.h}` }} />
            <b>{s.label}</b>
            <small>
              {s.w} × {s.h} px
            </small>
          </button>
        ))}
      </div>
      <div className="ps-cats" role="tablist" aria-label="Kinds of layout">
        {TEMPLATE_CATS.map((c) => (
          <button key={c.key} type="button" role="tab" aria-selected={cat === c.key} onClick={() => setCat(c.key)}>
            {c.label} <span>{c.key === "all" ? TEMPLATES.length : TEMPLATES.filter((t) => t.cat === c.key).length}</span>
          </button>
        ))}
      </div>
      <div className="ps-temps" role="radiogroup" aria-label="Start from">
        {draft && cat === "all" && (
          <button type="button" role="radio" aria-checked={pick === "draft"} onClick={() => setPick("draft")} onDoubleClick={() => onPick(draft, "Open Draft")}>
            <canvas ref={(el) => void (shots.current.draft = el)} />
            <b>Your draft</b>
            <small>Pick up where you left off</small>
          </button>
        )}
        {shown.map((t) => (
          <button key={t.key} type="button" role="radio" aria-checked={pick === t.key} onClick={() => setPick(t.key)} onDoubleClick={() => onPick(newDoc(t, size), `New from ${t.name}`)}>
            <canvas ref={(el) => void (shots.current[t.key] = el)} />
            <b>{t.name}</b>
            <small>{t.note}</small>
          </button>
        ))}
      </div>
      <div className="ps-newacts">
        <button type="button" className="ps-btn" onClick={onCancel}>
          Close
        </button>
        <button type="button" className="ps-btn ps-btn--blue" onClick={go} autoFocus>
          {pick === "draft" ? "Open" : "Create"}
        </button>
      </div>
    </>
  );
}

/**
 * File > Share to the Gallery: Photoshop's export dialog, pointed at the
 * visitors' gallery (/made-here). The maker names it, signs it, adds a line,
 * and chooses whether others may open its layers to remix. It saves to the
 * gallery's store (or, with no store, to this browser) and links to it.
 */
function ShareDoc({ doc, img, thumb, json, onClose, onExport }: { doc: Doc; img: string; thumb: string; json: string; onClose: () => void; onExport: () => void }) {
  const opened = useRef(0);
  // "dusk-fest.psd" reads as "Dusk Fest"; an untitled document starts blank
  const [title, setTitle] = useState(() =>
    doc.name
      .replace(/\.psd$/i, "")
      .replace(/^Untitled.*$/i, "")
      .replace(/[-_]+/g, " ")
      .replace(/(^|\s)\w/g, (c) => c.toUpperCase())
      .trim()
      .slice(0, MADE_LIMITS.title)
  );
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [remix, setRemix] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<{ error: string; field?: string } | null>(null);
  const [done, setDone] = useState<{ status: string; piece: Made } | null>(null);
  const hp = useRef<HTMLInputElement>(null);
  useEffect(() => {
    opened.current = Date.now();
  }, []);
  const kb = Math.round(((img.length - 23) * 3) / 4 / 1024);

  const send = async () => {
    setBusy(true);
    setErr(null);
    const body = { kind: "pubmat", title, name, note, image: img, w: doc.w, h: doc.h, remix, doc: remix ? json : undefined, website: hp.current?.value ?? "", elapsed: Date.now() - opened.current };
    const r = await sendPiece(body, () => ({ id: localId(), kind: "pubmat", title: title.trim(), name: name.trim(), note: note.trim(), w: doc.w, h: doc.h, remix: false, t: Date.now() }), thumb);
    setBusy(false);
    if (r.ok) setDone(r);
    else setErr(r);
  };

  return (
    <div className="ps-scrim" onPointerDown={(e) => e.target === e.currentTarget && !busy && onClose()}>
      <div className="ps-new ps-share-dlg" role="dialog" aria-modal="true" aria-labelledby="ps-share-h">
        <h2 id="ps-share-h">{done ? "Shared to the Gallery" : "Share to the Gallery"}</h2>
        <div className="ps-share-body">
          <figure className="ps-share-pv">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={`Preview of ${title || "your pubmat"}`} />
            <figcaption>
              JPEG · {doc.w} × {doc.h} px · {kb} KB
            </figcaption>
          </figure>
          {done ? (
            <div className="ps-share-done" role="status">
              <p className="ps-newsub">
                {done.status === "shown"
                  ? "It's hanging in the visitors' gallery now, with your name on it."
                  : done.status === "pending"
                    ? "It's in. Lana sees new pieces first, so it shows in the gallery once she's had a look. Until then it shows for you here, marked as waiting."
                    : "The gallery's store isn't connected on this copy of the site, so your pubmat is saved in this browser. It shows in the gallery for you, marked as saved here."}
              </p>
              <div className="ps-newacts">
                <button type="button" className="ps-btn" onClick={onClose}>
                  Keep editing
                </button>
                <a className="ps-btn ps-btn--blue ps-btn--a" href={pieceUrl(done.piece)}>
                  See it in the gallery <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          ) : (
            <form
              className="ps-share-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!busy) void send();
              }}
            >
              <p className="ps-newsub">It goes up in the visitors&apos; gallery with your name on it. Lana sees new pieces before they show.</p>
              <label className="ps-field">
                <span>Title</span>
                <input required maxLength={MADE_LIMITS.title} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Dusk Fest" aria-invalid={err?.field === "title" || undefined} autoFocus />
              </label>
              <label className="ps-field">
                <span>Your name</span>
                <input required maxLength={MADE_LIMITS.name} value={name} onChange={(e) => setName(e.target.value)} placeholder="First name is fine" autoComplete="given-name" aria-invalid={err?.field === "name" || undefined} />
              </label>
              <label className="ps-field">
                <span>
                  A line about it <i>(optional)</i>
                  <small>
                    {note.length}/{MADE_LIMITS.note}
                  </small>
                </span>
                <textarea rows={2} maxLength={MADE_LIMITS.note} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Made this for my org's acquaintance party" aria-invalid={err?.field === "note" || undefined} />
              </label>
              <label className="ps-check">
                <input type="checkbox" checked={remix} onChange={(e) => setRemix(e.target.checked)} />
                <span>
                  Let others remix it
                  <small>They can open its layers in the studio. Photos you placed stay with you.</small>
                </span>
              </label>
              <input ref={hp} name="website" tabIndex={-1} autoComplete="off" aria-hidden className="ps-hp" />
              {err && (
                <p className="ps-err" role="alert">
                  {err.error}
                </p>
              )}
              <div className="ps-newacts">
                <button type="button" className="ps-btn" onClick={onExport}>
                  Export PNG instead
                </button>
                <button type="button" className="ps-btn" onClick={onClose} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="ps-btn ps-btn--blue" disabled={busy}>
                  {busy ? "Sharing…" : "Share"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
