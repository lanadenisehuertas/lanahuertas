// Builds the current portfolio design as editable Figma layers.
//
// Figma has no write REST API — a plugin running inside Figma is the only way
// to author a file programmatically.
//
// Install: Figma Desktop -> Tools (or main menu) -> Development ->
// Import plugin from manifest... -> pick figma-plugin/manifest.json
//
// SIZING RULES, learned from earlier versions that shipped broken:
//  1. resize() on an auto-layout frame FORCES that axis to FIXED. Never use it
//     on a frame that must hug. Create plain -> resize -> THEN set layoutMode.
//  2. layoutSizing* only applies AFTER the node is appended to a layout parent.
//  3. Decorative shapes inside auto-layout need layoutPositioning = "ABSOLUTE",
//     or they become flow items and displace their siblings.

// --- Palette (matches app/globals.css @theme) -----------------------------
const C = {
  deep: "330C4B", // page ground
  iris: "51017C", // lifted surface
  eminence: "711E7B", // accent, labels
  lavender: "B9379D", // DECORATIVE ONLY — 3.16:1, never behind text
  fawn: "E3A88A", // warm accent, secondary text on dark
  maize: "EEDAA5", // light panels, display type
  ink: "1B0730", // borders, shadows, text on light
};

const W = 1440;
const PAD = 80;
const PANEL_W = W - PAD * 2;

// --- Content (mirrors lib/content.ts) -------------------------------------
const PROFILE = {
  name: "Lana Denise Huertas",
  email: "lanadenisehuertas@gmail.com",
  location: "Manila, PH",
  heroLead: "I make work that's",
  heroAccent: "hard to scroll past.",
  heroSub:
    "Manila-based · 7+ years in Photoshop and Premiere · CS student building what she designs.",
  aboutHeadline:
    "I build high-quality visual content and adaptable designs for brands that want to stand out.",
  aboutKicker: "And I can do it for you, too.",
};

const TOOLS = ["Ps", "Ai", "Pr", "Ae", "Ca", "Py", "Js"];

const WORK_TABS = [
  {
    label: "graphic design",
    heading: "Graphic Design",
    accent: "eminence",
    blurb:
      "Campaign key art and announcement sets for student organizations and campus offices. Built in Photoshop and Illustrator, sized for every platform each one had to run on.",
    count: 21,
  },
  {
    label: "brand systems",
    heading: "Brand Systems",
    accent: "fawn",
    blurb:
      "Apparel, print, and template systems built for handoff — production-ready artwork and files a client can keep using without coming back to me.",
    count: 4,
  },
  {
    label: "videos",
    heading: "Videos",
    accent: "iris",
    blurb:
      "Documentary essays, instructional series, retrospectives, and narrative shorts — cut in Premiere Pro, finished in After Effects.",
    count: 10,
  },
  {
    label: "projects",
    heading: "PsyClick",
    accent: "deep",
    blurb:
      "Calmer clinical screening. A clinician-guided companion that turns questionnaires, typing rhythm, and mouse dynamics into decision-support reports.",
    count: 1,
  },
];

const ABOUT_TABS = ["about me", "experience", "education & certs", "skills"];

// --- Helpers ---------------------------------------------------------------

function rgb(hex) {
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

function solid(hex) {
  return [{ type: "SOLID", color: rgb(hex) }];
}

// Resolved at run time. Figma ships the Google Fonts library, but a user may
// not have them cached, so every face falls back rather than throwing.
const F = { display: "Inter", script: "Inter", pixel: "Inter", body: "Inter" };

async function pick(candidates, styles) {
  for (const family of candidates) {
    try {
      for (const style of styles) {
        await figma.loadFontAsync({ family: family, style: style });
      }
      return family;
    } catch (e) {
      /* try the next one */
    }
  }
  return null;
}

async function loadFonts() {
  F.display = (await pick(["Bricolage Grotesque", "Archivo", "Inter"], ["Regular", "Bold", "ExtraBold"])) || "Inter";
  F.body = (await pick(["Poppins", "Inter"], ["Regular", "Medium", "SemiBold", "Bold"])) || "Inter";
  F.script = (await pick(["Yellowtail", "Pacifico", "Inter"], ["Regular"])) || "Inter";
  F.pixel = (await pick(["Silkscreen", "VT323", "Inter"], ["Regular"])) || "Inter";
}

function text(chars, opts) {
  const t = figma.createText();
  t.fontName = { family: opts.family || F.body, style: opts.style || "Regular" };
  t.characters = chars;
  t.fontSize = opts.size;
  t.fills = solid(opts.color || C.maize);
  if (opts.spacing !== undefined) t.letterSpacing = { unit: "PERCENT", value: opts.spacing };
  if (opts.lineHeight) t.lineHeight = { unit: "PERCENT", value: opts.lineHeight };
  return t;
}

/** Display type: Bricolage ExtraBold, tight. */
function display(chars, size, color, lh) {
  return text(chars, {
    family: F.display,
    style: "ExtraBold",
    size: size,
    color: color || C.maize,
    spacing: -4.5,
    lineHeight: lh || 88,
  });
}

/** The overlapping accent word. */
function script(chars, size, color) {
  return text(chars, { family: F.script, style: "Regular", size: size, color: color || C.fawn });
}

/** Tracked-out uppercase marginalia. */
function pixel(chars, size, color) {
  return text(chars.toUpperCase(), {
    family: F.pixel,
    style: "Regular",
    size: size || 10,
    color: color || C.maize,
    spacing: 16,
  });
}

function frame(name, direction, opts) {
  opts = opts || {};
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = direction;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.itemSpacing = opts.gap === undefined ? 16 : opts.gap;
  f.paddingTop = opts.padTop === undefined ? opts.padY || 0 : opts.padTop;
  f.paddingBottom = opts.padBottom === undefined ? opts.padY || 0 : opts.padBottom;
  f.paddingLeft = opts.padLeft === undefined ? opts.padX || 0 : opts.padLeft;
  f.paddingRight = opts.padRight === undefined ? opts.padX || 0 : opts.padRight;
  f.fills = opts.fill ? solid(opts.fill) : [];
  f.cornerRadius = opts.radius || 0;
  f.clipsContent = false;
  if (opts.align) f.counterAxisAlignItems = opts.align;
  if (opts.justify) f.primaryAxisAlignItems = opts.justify;
  if (opts.wrap) f.layoutWrap = "WRAP";
  return f;
}

/** Append first, then set sizing — layoutSizing* needs a layout parent. */
function add(parent, child, h, v) {
  parent.appendChild(child);
  if (h) child.layoutSizingHorizontal = h;
  if (v) child.layoutSizingVertical = v;
  return child;
}

function pill(label, bg, fg, size, radius) {
  const f = frame("pill", "HORIZONTAL", { padX: 18, padY: 9, gap: 0, fill: bg });
  f.cornerRadius = radius === undefined ? 999 : radius;
  f.appendChild(pixel(label, size || 10, fg));
  return f;
}

function chip(label) {
  const f = frame("chip", "HORIZONTAL", { padX: 14, padY: 7, gap: 0 });
  f.cornerRadius = 999;
  f.fills = [];
  f.strokes = solid(C.ink);
  f.strokeWeight = 1;
  f.appendChild(text(label, { size: 12, color: C.ink }));
  return f;
}

function sparkle(size, hex) {
  const s = figma.createStar();
  s.pointCount = 4;
  s.innerRadius = 0.28;
  s.resize(size, size);
  s.fills = solid(hex);
  s.name = "sparkle";
  return s;
}

/** Full-width micro rail of contact details. */
function edgeRail(items, ruleOnTop) {
  const wrap = frame("edge rail", "VERTICAL", { gap: 12 });
  if (ruleOnTop) {
    const r = figma.createRectangle();
    r.resize(PANEL_W, 1);
    r.fills = solid(C.maize);
    r.opacity = 0.15;
    r.name = "rule";
    add(wrap, r, "FILL", "FIXED");
    r.resize(r.width, 1);
  }
  const row = frame("items", "HORIZONTAL", { gap: 24 });
  row.primaryAxisAlignItems = "SPACE_BETWEEN";
  add(wrap, row, "FILL", "HUG");
  items.forEach(function (s) {
    const t = pixel(s, 10, C.maize);
    t.opacity = 0.55;
    row.appendChild(t);
  });
  if (!ruleOnTop) {
    const r = figma.createRectangle();
    r.resize(PANEL_W, 1);
    r.fills = solid(C.maize);
    r.opacity = 0.15;
    r.name = "rule";
    add(wrap, r, "FILL", "FIXED");
    r.resize(r.width, 1);
  }
  return wrap;
}

/**
 * Section title lockup: heavy word with a script word overlapping from
 * below-right. The overlap is the point — stacked they read as heading plus
 * subtitle; overlapped they read as one drawn mark.
 */
function sectionTitle(lead, accent) {
  const wrap = frame("title: " + lead + " " + accent, "VERTICAL", { gap: 0 });
  const leadT = display(lead, 72, C.maize, 86);
  add(wrap, leadT, "HUG", "HUG");

  const acc = script(accent, 72, C.fawn);
  wrap.appendChild(acc);
  acc.layoutPositioning = "ABSOLUTE";
  acc.x = leadT.width - 40;
  acc.y = leadT.height - 46;

  return wrap;
}

/**
 * A folder: tab strip along one edge, then the panel. Tabs overlap by 10px;
 * the active one sits flush while the rest drop 9px and dim.
 */
function folder(tabs, activeIdx, accentOf, buildBody) {
  const wrap = frame("folder", "VERTICAL", { gap: 0 });

  // Negative spacing is the only way to overlap auto-layout children;
  // setting .x on them is ignored by the layout engine.
  const strip = frame("tabs", "HORIZONTAL", { gap: -10, padLeft: 12 });
  strip.counterAxisAlignItems = "MAX";
  add(wrap, strip, "HUG", "HUG");

  const tabNodes = [];
  tabs.forEach(function (label, i) {
    const active = i === activeIdx;
    const acc = accentOf(i);
    const onDark = acc === "eminence" || acc === "iris" || acc === "deep";
    const t = frame("tab: " + label, "HORIZONTAL", {
      padX: 20,
      padY: 14,
      gap: 0,
      fill: C[acc],
    });
    t.cornerRadius = 12;
    t.bottomLeftRadius = 0;
    t.bottomRightRadius = 0;
    t.strokes = solid(C.ink);
    t.strokeWeight = 2;
    t.strokeBottomWeight = 0;
    t.appendChild(
      text(label, {
        family: F.display,
        style: "ExtraBold",
        size: 13,
        color: onDark ? C.maize : C.ink,
      })
    );
    strip.appendChild(t);
    if (!active) t.opacity = 0.62;
    tabNodes.push(t);
  });

  // Folder front
  const front = frame("folder front", "VERTICAL", {
    gap: 0,
    padX: 18,
    padY: 18,
    fill: C[accentOf(activeIdx)],
    radius: 24,
  });
  front.topLeftRadius = 0;
  front.strokes = solid(C.ink);
  front.strokeWeight = 2;
  front.effects = [
    {
      type: "DROP_SHADOW",
      color: Object.assign({}, rgb(C.ink), { a: 1 }),
      offset: { x: 8, y: 8 },
      radius: 0,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
  add(wrap, front, "FILL", "HUG");

  const sheet = frame("sheet", "VERTICAL", {
    gap: 24,
    padX: 40,
    padY: 40,
    fill: C.maize,
    radius: 16,
  });
  sheet.strokes = solid(C.ink);
  sheet.strokeWeight = 2;
  add(front, sheet, "FILL", "HUG");

  buildBody(sheet);
  return { wrap: wrap, tabs: tabNodes, sheet: sheet };
}

// --- Sections --------------------------------------------------------------

function buildHero(page) {
  const hero = frame("Hero", "VERTICAL", {
    gap: 0,
    padY: 100,
    padX: PAD,
    fill: C.deep,
  });
  add(page, hero, "FILL", "HUG");

  add(hero, edgeRail([PROFILE.email, PROFILE.location, "Graphic design · Video · Code", "Portfolio Vol. 01"], false), "FILL", "HUG");

  const spacerA = frame("s", "VERTICAL", { gap: 0, padY: 24 });
  add(hero, spacerA, "FILL", "HUG");

  add(hero, pixel("Hi, I'm", 12, C.fawn), "HUG", "HUG");

  const nameT = display("Lana", 208, C.maize, 80);
  add(hero, nameT, "HUG", "HUG");

  const spacerB = frame("s", "VERTICAL", { gap: 0, padY: 10 });
  add(hero, spacerB, "FILL", "HUG");

  add(hero, display(PROFILE.heroLead, 72, C.maize, 95), "HUG", "HUG");
  add(hero, script(PROFILE.heroAccent, 128, C.fawn), "HUG", "HUG");

  const spacerC = frame("s", "VERTICAL", { gap: 0, padY: 16 });
  add(hero, spacerC, "FILL", "HUG");

  const sub = text(PROFILE.heroSub, { size: 18, color: C.maize, lineHeight: 160 });
  add(hero, sub, "FILL", "HUG");
  sub.textAutoResize = "HEIGHT";
  sub.opacity = 0.9;

  const spacerD = frame("s", "VERTICAL", { gap: 0, padY: 16 });
  add(hero, spacerD, "FILL", "HUG");

  const toolRow = frame("tools", "HORIZONTAL", { gap: 8 });
  add(hero, toolRow, "HUG", "HUG");
  TOOLS.forEach(function (s) {
    const box = frame("tool", "HORIZONTAL", {
      gap: 0,
      fill: C.ink,
      align: "CENTER",
      justify: "CENTER",
    });
    box.cornerRadius = 10;
    add(toolRow, box, "FIXED", "FIXED");
    box.resize(40, 40);
    box.appendChild(
      text(s, { family: F.display, style: "ExtraBold", size: 12, color: C.maize })
    );
  });

  const spacerE = frame("s", "VERTICAL", { gap: 0, padY: 18 });
  add(hero, spacerE, "FILL", "HUG");

  const ctas = frame("ctas", "HORIZONTAL", { gap: 12 });
  add(hero, ctas, "HUG", "HUG");
  const primary = pill("See the work →", C.fawn, C.ink, 11);
  primary.paddingLeft = primary.paddingRight = 34;
  primary.paddingTop = primary.paddingBottom = 18;
  primary.strokes = solid(C.ink);
  primary.strokeWeight = 2;
  ctas.appendChild(primary);

  const secondary = pill("Contact me", C.deep, C.maize, 11);
  secondary.paddingLeft = secondary.paddingRight = 34;
  secondary.paddingTop = secondary.paddingBottom = 18;
  secondary.strokes = solid(C.maize);
  secondary.strokeWeight = 2;
  secondary.opacity = 0.9;
  ctas.appendChild(secondary);

  const spacerF = frame("s", "VERTICAL", { gap: 0, padY: 28 });
  add(hero, spacerF, "FILL", "HUG");

  add(hero, edgeRail(["Graphic design", "Video editing", "Software engineering", "Est. 2019"], true), "FILL", "HUG");

  // Decoration
  const sp = sparkle(52, C.maize);
  hero.appendChild(sp);
  sp.layoutPositioning = "ABSOLUTE";
  sp.x = 1160;
  sp.y = 240;
  sp.opacity = 0.55;
  return hero;
}

function buildWork(page) {
  const sec = frame("Selected work", "VERTICAL", {
    gap: 28,
    padX: PAD,
    padBottom: 110,
    fill: C.deep,
  });
  add(page, sec, "FILL", "HUG");
  add(sec, sectionTitle("selected", "work"), "HUG", "HUG");

  const f = folder(
    WORK_TABS.map(function (t) {
      return t.label;
    }),
    0,
    function (i) {
      return WORK_TABS[i].accent;
    },
    function (sheet) {
      const head = frame("head", "HORIZONTAL", { gap: 16 });
      head.primaryAxisAlignItems = "SPACE_BETWEEN";
      head.counterAxisAlignItems = "CENTER";
      add(sheet, head, "FILL", "HUG");
      head.appendChild(display(WORK_TABS[0].heading, 60, C.ink, 94));
      head.appendChild(pixel(WORK_TABS[0].count + " projects", 10, C.ink));

      const blurb = text(WORK_TABS[0].blurb, { size: 17, color: C.ink, lineHeight: 165 });
      add(sheet, blurb, "FILL", "HUG");
      blurb.textAutoResize = "HEIGHT";
      blurb.opacity = 0.7;

      // Mosaic: two card widths, the wide one exactly double the narrow plus
      // the gutter — the same rule the site's grid follows.
      const NARROW = 250;
      const WIDE = NARROW * 2 + 6;
      const rows = [
        [NARROW, NARROW, WIDE],
        [WIDE, NARROW, NARROW],
        [NARROW, NARROW, NARROW, NARROW],
      ];
      rows.forEach(function (r, ri) {
        const row = frame("grid row", "HORIZONTAL", { gap: 6 });
        add(sheet, row, "FILL", "HUG");
        r.forEach(function (w, ci) {
          const cell = figma.createFrame();
          cell.name = "work " + (ri * 4 + ci + 1);
          cell.cornerRadius = 3;
          cell.fills = solid(C.lavender);
          cell.opacity = 0.25;
          cell.strokes = solid(C.ink);
          cell.strokeWeight = 2;
          row.appendChild(cell);
          cell.resize(w, ri === 1 ? 200 : 320);
        });
      });
    }
  );
  add(sec, f.wrap, "FILL", "HUG");
  return sec;
}

function buildAbout(page) {
  const sec = frame("About me", "VERTICAL", {
    gap: 28,
    padX: PAD,
    padBottom: 110,
    fill: C.deep,
  });
  add(page, sec, "FILL", "HUG");
  add(sec, sectionTitle("about", "me"), "HUG", "HUG");

  const f = folder(
    ABOUT_TABS,
    0,
    function (i) {
      return ["eminence", "iris", "deep", "fawn"][i];
    },
    function (sheet) {
      const cols = frame("about cols", "HORIZONTAL", { gap: 80 });
      cols.counterAxisAlignItems = "CENTER";
      add(sheet, cols, "FILL", "HUG");

      // Portrait with badges floating clear on both sides
      const left = frame("portrait col", "VERTICAL", { gap: 0, padX: 78 });
      add(cols, left, "HUG", "HUG");

      const photo = figma.createFrame();
      photo.name = "portrait — replace with photo";
      photo.fills = solid(C.iris);
      photo.strokes = solid(C.maize);
      photo.strokeWeight = 2;
      add(left, photo, "FIXED", "FIXED");
      photo.resize(300, 437);

      const badges = [
        { l: "Ps", s: 64, x: -70, y: 26 },
        { l: "Pr", s: 58, x: -64, y: 166 },
        { l: "Ai", s: 54, x: -60, y: 306 },
        { l: "Ae", s: 64, x: 306, y: 61 },
        { l: "Ca", s: 58, x: 306, y: 201 },
        { l: "Fg", s: 54, x: 306, y: 332 },
      ];
      badges.forEach(function (b) {
        const box = frame("badge " + b.l, "HORIZONTAL", {
          gap: 0,
          fill: C.ink,
          align: "CENTER",
          justify: "CENTER",
        });
        box.cornerRadius = Math.round(b.s * 0.22);
        photo.appendChild(box);
        box.layoutPositioning = "ABSOLUTE";
        box.resize(b.s, b.s);
        box.x = b.x;
        box.y = b.y;
        box.appendChild(
          text(b.l, { family: F.display, style: "ExtraBold", size: 18, color: C.maize })
        );
      });

      // Copy
      const right = frame("copy col", "VERTICAL", { gap: 16 });
      add(cols, right, "FILL", "HUG");

      const h = display(PROFILE.aboutHeadline, 37, C.ink, 114);
      add(right, h, "FILL", "HUG");
      h.textAutoResize = "HEIGHT";

      add(right, script(PROFILE.aboutKicker, 45, C.eminence), "HUG", "HUG");

      const body = text(
        "I pride myself on being a highly adaptable creative. I bring a meticulous eye for detail and a versatile skill set, backed by 7+ years of experience in Adobe Photoshop, 6 years in Premiere Pro, and a sharp command of Illustrator. From crafting high-impact publicity materials and scalable templates to pacing dynamic video edits, I handle the creative heavy lifting so you don't have to.",
        { size: 17, color: C.ink, lineHeight: 180 }
      );
      add(right, body, "FILL", "HUG");
      body.textAutoResize = "HEIGHT";
      body.textAlignHorizontal = "JUSTIFIED";
      body.opacity = 0.85;
    }
  );
  add(sec, f.wrap, "FILL", "HUG");
  return sec;
}

function buildContact(page) {
  const sec = frame("Contact", "VERTICAL", {
    gap: 28,
    padX: PAD,
    padBottom: 96,
    fill: C.deep,
  });
  add(page, sec, "FILL", "HUG");
  add(sec, sectionTitle("get in", "touch"), "HUG", "HUG");

  const f = folder(
    ["get in touch"],
    0,
    function () {
      return "fawn";
    },
    function (sheet) {
      const cols = frame("contact cols", "HORIZONTAL", { gap: 40 });
      add(sheet, cols, "FILL", "HUG");

      const left = frame("left", "VERTICAL", { gap: 20 });
      add(cols, left, "FILL", "HUG");
      const h = display("Let's make something cool together.", 60, C.ink, 100);
      add(left, h, "FILL", "HUG");
      h.textAutoResize = "HEIGHT";
      const p = text(
        "Whether you need a brand refresh, event visuals, or just want to chat about design, my inbox is always open.",
        { size: 16, color: C.ink, lineHeight: 165 }
      );
      add(left, p, "FILL", "HUG");
      p.textAutoResize = "HEIGHT";
      p.opacity = 0.75;

      const links = frame("links", "HORIZONTAL", { gap: 12 });
      add(left, links, "HUG", "HUG");
      ["email", "portfolio"].forEach(function (l) {
        const b = pill(l, C.maize, C.ink, 11);
        b.strokes = solid(C.ink);
        b.strokeWeight = 2;
        b.paddingLeft = b.paddingRight = 28;
        b.paddingTop = b.paddingBottom = 16;
        links.appendChild(b);
      });

      const card = frame("card", "VERTICAL", {
        gap: 14,
        padX: 24,
        padY: 24,
        radius: 12,
      });
      card.fills = solid(C.lavender);
      card.opacity = 1;
      card.strokes = solid(C.ink);
      card.strokeWeight = 2;
      add(cols, card, "FIXED", "HUG");
      card.resize(360, card.height);
      card.appendChild(display(PROFILE.name, 22, C.ink, 110));
      card.appendChild(text(PROFILE.location, { size: 14, color: C.ink }));
      card.appendChild(text(PROFILE.email, { size: 14, color: C.ink }));
    }
  );
  add(sec, f.wrap, "FILL", "HUG");

  add(sec, edgeRail(["lana denise huertas", "Portfolio Vol. 01", "Manila, PH", "Back to top"], true), "FILL", "HUG");
  return sec;
}

// --- Entry -----------------------------------------------------------------

async function build() {
  await loadFonts();

  // Plain frame first: resize for width, THEN auto-layout so height hugs.
  const page = figma.createFrame();
  page.name = "lana denise huertas — portfolio";
  page.resize(W, 100);
  page.layoutMode = "VERTICAL";
  page.counterAxisSizingMode = "FIXED";
  page.primaryAxisSizingMode = "AUTO";
  page.itemSpacing = 0;
  page.fills = solid(C.deep);
  page.clipsContent = true;
  figma.currentPage.appendChild(page);

  buildHero(page);
  buildWork(page);
  buildAbout(page);
  buildContact(page);

  page.x = 0;
  page.y = 0;

  figma.currentPage.flowStartingPoints = [{ nodeId: page.id, name: "Portfolio" }];
  figma.viewport.scrollAndZoomIntoView([page]);

  const missing = [];
  if (F.display !== "Bricolage Grotesque") missing.push("Bricolage Grotesque");
  if (F.script !== "Yellowtail") missing.push("Yellowtail");
  if (F.pixel !== "Silkscreen") missing.push("Silkscreen");
  if (F.body !== "Poppins") missing.push("Poppins");

  figma.closePlugin(
    missing.length
      ? "Built with substitutes for: " + missing.join(", ") + ". Install them for the real thing."
      : "Built " + Math.round(page.width) + "x" + Math.round(page.height) + " with all four fonts."
  );
}

build().catch(function (e) {
  figma.closePlugin("Failed: " + e.message);
});
