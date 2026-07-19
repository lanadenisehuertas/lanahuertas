// Builds the portfolio as editable Figma layers, with working in-place
// tab-switching.
//
// Figma cannot run the site's React state. What it CAN do is interactive
// components: the work section is a COMPONENT SET with one variant per tab, and
// each tab pill fires CHANGE_TO to swap the variant in place.
//
// This replaced an earlier NAVIGATE-between-pages approach that jumped to the
// top of the page on every click. preserveScrollPosition is unreliable when
// destination frames differ in height, and these do (blurbs vary in length).
// CHANGE_TO never navigates, so there is no scroll position to lose.
//
// Install: Figma Desktop -> Tools -> Development -> Import plugin from
// manifest... -> pick figma-plugin/manifest.json
//
// SIZING RULES:
//  1. resize() on an auto-layout frame FORCES that axis to FIXED. Never use it
//     on a frame that must hug. Use layoutSizing* instead.
//  2. layoutSizing* only works AFTER the node is appended to an auto-layout parent.
//  3. Decorative shapes inside auto-layout need layoutPositioning = "ABSOLUTE".

const HEX = {
  honeydew: "F6FFE9",
  custard: "F2E0A4",
  periwinkle: "CAC5E5",
  amethyst: "A230A4",
  ultramarine: "290087",
  ink: "180047",
};

const W = 1440;
const PAD = 80;
const PANEL_W = W - PAD * 2;

// ---------------------------------------------------------------------------
// Content — mirrors lib/content.ts
// ---------------------------------------------------------------------------

const PROFILE = {
  years: "7+ years",
  heading: "Hi! I am Lana, a graphic designer and video editor from Manila.",
  summary:
    "Detail-oriented and versatile creative professional with hands-on experience in video editing, graphic design, and digital marketing. I work across Adobe Premiere Pro, After Effects, Photoshop, and Illustrator, building promotional videos, social content, and branded assets. Currently pursuing a B.S. in Computer Science - Software Engineering, adding Python and JavaScript to a creative skill set.",
  email: "lanadenisehuertas@gmail.com",
  location: "Manila, Philippines",
};

const EXPERIENCE = [
  ["2020 - Present", "Multimedia Team Editor", "Lord Jesus Fellowship Church - Bataan, PH"],
  [
    "Sep 2023 - Jul 2025",
    "Creatives Committee Head",
    "Student Coordinating Council, FEU Tech - Manila, PH",
  ],
  ["Sep 2023 - Jul 2025", "Creatives Committee Head", "ACM FEU Tech Chapter - Manila, PH"],
  [
    "Oct 2022 - Jul 2023",
    "Editing Committee Leader",
    "CybeRS Robotics Club, RSHS III - Zambales, PH",
  ],
];

const EDUCATION = [
  [
    "Aug 2023 - Present",
    "FEU Institute of Technology",
    "B.S. Computer Science - Software Engineering (Expected July 2027)",
    ["Elite Scholar - FEU Tech", "DOST Scholar - Dept. of Science and Technology"],
  ],
  [
    "Graduated July 2023",
    "Regional Science High School III",
    "Senior High School Diploma - High Honors (GWA: 96)",
    [],
  ],
];

const SKILLS = [
  ["video editing", ["Premiere Pro", "After Effects", "color grading", "motion graphics"]],
  ["graphic design", ["Photoshop", "Illustrator", "Canva", "brand identity", "typography"]],
  ["marketing", ["social media management", "content strategy", "copywriting"]],
  ["technical", ["Python", "JavaScript", "Google Workspace"]],
];

const SOFTWARE = ["Ps", "Ai", "Pr", "Ae", "Ca", "Py", "Js"];

const WORK_TABS = [
  [
    "publicity materials",
    "Publicity Materials",
    "Crafted with Photoshop and Illustrator for high-impact design, and delivered as Canva templates for seamless, on-the-go client editing.",
    8,
  ],
  [
    "mockups",
    "Mockups",
    "A look at recent design mockups showing how these brands live and breathe off the screen. Crafted in Photoshop to give clients a true sense of their visual identity in action.",
    8,
  ],
  [
    "templates",
    "Templates",
    "Recent template systems designed for seamless client handoff. Crafted in Ps and Ai, delivered in Canva for easy, on-the-go editing.",
    8,
  ],
  [
    "videos",
    "Videos",
    "Motion, pacing, and impact. Cut in Premiere Pro and polished in After Effects to keep eyes glued to the screen.",
    8,
  ],
  [
    "engineering",
    "Software Engineering",
    "Computer Science at FEU Tech, specialising in Software Engineering. Building in Python and JavaScript - projects landing here as they ship.",
    8,
  ],
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

let FAMILY = "Poppins";
const WEIGHTS = ["Regular", "SemiBold", "Bold", "ExtraBold", "Black"];

async function tryFamily(family) {
  for (const style of WEIGHTS) {
    await figma.loadFontAsync({ family: family, style: style });
  }
}

async function loadFonts() {
  try {
    await tryFamily("Poppins");
    FAMILY = "Poppins";
  } catch (e) {
    await tryFamily("Inter");
    FAMILY = "Inter";
  }
}

function text(chars, opts) {
  const t = figma.createText();
  t.fontName = { family: FAMILY, style: opts.style || "Bold" };
  t.characters = chars;
  t.fontSize = opts.size;
  t.fills = solid(opts.color || HEX.honeydew);
  if (opts.spacing) t.letterSpacing = { unit: "PERCENT", value: opts.spacing };
  if (opts.lineHeight) t.lineHeight = { unit: "PERCENT", value: opts.lineHeight };
  return t;
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
  f.paddingLeft = f.paddingRight = opts.padX || 0;
  f.fills = opts.fill ? solid(opts.fill) : [];
  f.cornerRadius = opts.radius || 0;
  f.clipsContent = false;
  if (opts.align) f.counterAxisAlignItems = opts.align;
  if (opts.justify) f.primaryAxisAlignItems = opts.justify;
  if (opts.wrap) f.layoutWrap = "WRAP";
  return f;
}

/** Append first, then set sizing — layoutSizing* requires a layout parent. */
function add(parent, child, horizontal, vertical) {
  parent.appendChild(child);
  if (horizontal) child.layoutSizingHorizontal = horizontal;
  if (vertical) child.layoutSizingVertical = vertical;
  return child;
}

function pill(label, bg, fg, size, radius) {
  const f = frame("pill", "HORIZONTAL", { padX: 18, padY: 9, gap: 0, fill: bg });
  f.cornerRadius = radius === undefined ? 999 : radius;
  f.appendChild(text(label, { size: size || 14, style: "Bold", color: fg }));
  return f;
}

function outlineChip(label) {
  const f = frame("chip", "HORIZONTAL", { padX: 14, padY: 7, gap: 0 });
  f.cornerRadius = 999;
  f.fills = [];
  f.strokes = solid(HEX.ink);
  f.strokeWeight = 1;
  f.appendChild(text(label, { size: 13, style: "Regular", color: HEX.ink }));
  return f;
}

function sparkle(size, hex) {
  const star = figma.createStar();
  star.pointCount = 4;
  star.innerRadius = 0.28;
  star.resize(size, size);
  star.fills = solid(hex);
  star.name = "sparkle";
  return star;
}

function panelHeading(parent, label) {
  return add(
    parent,
    text(label, { size: 30, style: "Black", color: HEX.ink, spacing: -1 }),
    "HUG",
    "HUG"
  );
}

// ---------------------------------------------------------------------------
// Work section: one COMPONENT per tab, combined into a variant set.
// ---------------------------------------------------------------------------

function buildWorkVariant(activeIdx) {
  // Plain component first: resize for width, THEN auto-layout so height hugs.
  const c = figma.createComponent();
  c.name = "tab=" + WORK_TABS[activeIdx][0];
  c.resize(PANEL_W, 100);
  c.layoutMode = "VERTICAL";
  c.counterAxisSizingMode = "FIXED";
  c.primaryAxisSizingMode = "AUTO";
  c.itemSpacing = 0;
  c.fills = [];
  c.clipsContent = false;

  const tabRow = frame("work tabs", "HORIZONTAL", { gap: 8 });
  tabRow.paddingLeft = 28;
  add(c, tabRow, "HUG", "HUG");

  const tabNodes = [];
  WORK_TABS.forEach(function (t, i) {
    const active = i === activeIdx;
    const p = pill(
      t[0],
      active ? HEX.amethyst : HEX.ink,
      active ? HEX.honeydew : HEX.periwinkle,
      14,
      14
    );
    p.name = "tab:" + i;
    tabRow.appendChild(p);
    tabNodes.push(p);
  });

  const panel = frame("Work panel", "VERTICAL", {
    gap: 22,
    padX: 56,
    padY: 56,
    fill: HEX.honeydew,
    radius: 28,
  });
  add(c, panel, "FILL", "HUG");

  add(
    panel,
    text(WORK_TABS[activeIdx][1], {
      size: 62,
      style: "Black",
      color: HEX.ink,
      spacing: -2,
      lineHeight: 105,
    }),
    "HUG",
    "HUG"
  );

  const wb = text(WORK_TABS[activeIdx][2], {
    size: 18,
    style: "Regular",
    color: HEX.ink,
    lineHeight: 155,
  });
  add(panel, wb, "FILL", "HUG");
  wb.textAutoResize = "HEIGHT";

  const total = WORK_TABS[activeIdx][3];
  let rowFrame = null;
  for (let i = 0; i < total; i++) {
    if (i % 4 === 0) {
      rowFrame = frame("grid row", "HORIZONTAL", { gap: 18 });
      add(panel, rowFrame, "FILL", "HUG");
    }
    const cell = figma.createFrame();
    cell.name = "work " + String(i + 1).padStart(2, "0");
    cell.cornerRadius = 14;
    cell.fills = solid(HEX.periwinkle);
    add(rowFrame, cell, "FILL", "FIXED");
    cell.resize(cell.width, 340);
  }

  return { component: c, tabs: tabNodes };
}

// ---------------------------------------------------------------------------
// The single page
// ---------------------------------------------------------------------------

function buildPage(workInstance) {
  const page = figma.createFrame();
  page.name = "Portfolio";
  page.resize(W, 100);
  page.layoutMode = "VERTICAL";
  page.counterAxisSizingMode = "FIXED";
  page.primaryAxisSizingMode = "AUTO";
  page.itemSpacing = 0;
  page.fills = solid(HEX.ultramarine);
  page.clipsContent = true;
  figma.currentPage.appendChild(page);

  // ---- Hero -----------------------------------------------------------
  const hero = frame("Hero", "VERTICAL", {
    gap: 10,
    padY: 150,
    padX: PAD,
    fill: HEX.ultramarine,
    align: "CENTER",
    justify: "CENTER",
  });
  add(page, hero, "FILL", "HUG");

  const bloom = figma.createEllipse();
  bloom.name = "aurora bloom";
  bloom.fills = [
    {
      type: "GRADIENT_RADIAL",
      gradientTransform: [
        [1, 0, 0],
        [0, 1, 0],
      ],
      gradientStops: [
        { position: 0, color: Object.assign({}, rgb(HEX.amethyst), { a: 0.7 }) },
        { position: 1, color: Object.assign({}, rgb(HEX.amethyst), { a: 0 }) },
      ],
    },
  ];
  hero.appendChild(bloom);
  bloom.layoutPositioning = "ABSOLUTE";
  bloom.resize(1180, 640);
  bloom.x = -60;
  bloom.y = -110;

  const s1 = sparkle(58, HEX.custard);
  hero.appendChild(s1);
  s1.layoutPositioning = "ABSOLUTE";
  s1.x = 150;
  s1.y = 190;

  const s2 = sparkle(34, HEX.periwinkle);
  hero.appendChild(s2);
  s2.layoutPositioning = "ABSOLUTE";
  s2.x = 1180;
  s2.y = 470;

  add(hero, text("graphic design", { size: 54, style: "ExtraBold" }), "HUG", "HUG");
  add(
    hero,
    text("PORTFOLIO", {
      size: 200,
      style: "Black",
      color: HEX.custard,
      spacing: -4,
      lineHeight: 88,
    }),
    "HUG",
    "HUG"
  );
  add(hero, text("video editing", { size: 54, style: "ExtraBold" }), "HUG", "HUG");

  const badge = frame("badge", "HORIZONTAL", {
    gap: 10,
    padX: 26,
    padY: 12,
    fill: HEX.ink,
    align: "CENTER",
  });
  badge.cornerRadius = 999;
  add(hero, badge, "HUG", "HUG");
  badge.appendChild(text("lana huertas", { size: 17, style: "SemiBold" }));
  badge.appendChild(sparkle(15, HEX.custard));
  badge.appendChild(text("2026", { size: 17, style: "SemiBold" }));

  add(
    hero,
    text("Let us create something great.", {
      size: 19,
      style: "Regular",
      color: HEX.periwinkle,
    }),
    "HUG",
    "HUG"
  );

  // ---- About ----------------------------------------------------------
  const aboutWrap = frame("About", "VERTICAL", {
    gap: 0,
    padX: PAD,
    padBottom: 110,
    fill: HEX.ultramarine,
  });
  add(page, aboutWrap, "FILL", "HUG");

  const aboutTabs = frame("about tabs", "HORIZONTAL", { gap: 8 });
  aboutTabs.paddingLeft = 28;
  add(aboutWrap, aboutTabs, "HUG", "HUG");
  aboutTabs.appendChild(pill("about me", HEX.amethyst, HEX.honeydew, 14, 14));
  aboutTabs.appendChild(pill(PROFILE.years, HEX.custard, HEX.ink, 14, 14));

  const about = frame("About panel", "VERTICAL", {
    gap: 44,
    padX: 56,
    padY: 56,
    fill: HEX.honeydew,
    radius: 28,
  });
  add(aboutWrap, about, "FILL", "HUG");

  const introRow = frame("intro", "HORIZONTAL", { gap: 40 });
  add(about, introRow, "FILL", "HUG");

  const portrait = figma.createFrame();
  portrait.name = "portrait - replace with photo";
  portrait.cornerRadius = 16;
  portrait.fills = solid(HEX.custard);
  add(introRow, portrait, "FIXED", "FIXED");
  portrait.resize(240, 320);

  const bio = frame("bio", "VERTICAL", { gap: 16 });
  add(introRow, bio, "FILL", "HUG");
  const bioH = text(PROFILE.heading, {
    size: 34,
    style: "Black",
    color: HEX.ink,
    spacing: -1,
    lineHeight: 120,
  });
  add(bio, bioH, "FILL", "HUG");
  bioH.textAutoResize = "HEIGHT";
  const bioB = text(PROFILE.summary, {
    size: 17,
    style: "Regular",
    color: HEX.ink,
    lineHeight: 160,
  });
  add(bio, bioB, "FILL", "HUG");
  bioB.textAutoResize = "HEIGHT";

  const histRow = frame("history", "HORIZONTAL", { gap: 40 });
  add(about, histRow, "FILL", "HUG");

  const expCol = frame("experience", "VERTICAL", { gap: 18 });
  add(histRow, expCol, "FILL", "HUG");
  panelHeading(expCol, "experience");
  EXPERIENCE.forEach(function (e) {
    const item = frame("item", "VERTICAL", { gap: 3 });
    add(expCol, item, "FILL", "HUG");
    add(item, text(e[0], { size: 12, style: "SemiBold", color: HEX.amethyst }), "HUG", "HUG");
    add(item, text(e[1], { size: 15, style: "Bold", color: HEX.ink }), "HUG", "HUG");
    const org = text(e[2], { size: 14, style: "Regular", color: HEX.ink });
    add(item, org, "FILL", "HUG");
    org.textAutoResize = "HEIGHT";
  });

  const eduCol = frame("education", "VERTICAL", { gap: 18 });
  add(histRow, eduCol, "FILL", "HUG");
  panelHeading(eduCol, "education");
  EDUCATION.forEach(function (e) {
    const item = frame("item", "VERTICAL", { gap: 3 });
    add(eduCol, item, "FILL", "HUG");
    add(item, text(e[0], { size: 12, style: "SemiBold", color: HEX.amethyst }), "HUG", "HUG");
    add(item, text(e[1], { size: 15, style: "Bold", color: HEX.ink }), "HUG", "HUG");
    const det = text(e[2], { size: 14, style: "Regular", color: HEX.ink });
    add(item, det, "FILL", "HUG");
    det.textAutoResize = "HEIGHT";
    e[3].forEach(function (h) {
      add(item, text("* " + h, { size: 12, style: "Regular", color: HEX.ink }), "HUG", "HUG");
    });
  });

  const skillRow = frame("skills row", "HORIZONTAL", { gap: 40 });
  add(about, skillRow, "FILL", "HUG");

  const skillCol = frame("skills", "VERTICAL", { gap: 16 });
  add(skillRow, skillCol, "FILL", "HUG");
  panelHeading(skillCol, "skills");
  SKILLS.forEach(function (g) {
    const grp = frame("group", "VERTICAL", { gap: 8 });
    add(skillCol, grp, "FILL", "HUG");
    add(
      grp,
      text(g[0].toUpperCase(), { size: 11, style: "Bold", color: HEX.amethyst, spacing: 6 }),
      "HUG",
      "HUG"
    );
    const chips = frame("chips", "HORIZONTAL", { gap: 7, wrap: true });
    add(grp, chips, "FILL", "HUG");
    g[1].forEach(function (sk) {
      chips.appendChild(outlineChip(sk));
    });
  });

  const softCol = frame("software", "VERTICAL", { gap: 16 });
  add(skillRow, softCol, "HUG", "HUG");
  panelHeading(softCol, "software");
  const softRow = frame("software chips", "HORIZONTAL", { gap: 8, wrap: true });
  add(softCol, softRow, "HUG", "HUG");
  SOFTWARE.forEach(function (sw) {
    const box = frame("sw", "HORIZONTAL", {
      gap: 0,
      fill: HEX.ink,
      align: "CENTER",
      justify: "CENTER",
    });
    box.cornerRadius = 10;
    add(softRow, box, "FIXED", "FIXED");
    box.resize(46, 46);
    box.appendChild(text(sw, { size: 14, style: "Black", color: HEX.custard }));
  });

  // ---- Work: instance of the variant set --------------------------------
  const workWrap = frame("Work", "VERTICAL", {
    gap: 0,
    padX: PAD,
    padBottom: 110,
    fill: HEX.ultramarine,
  });
  add(page, workWrap, "FILL", "HUG");
  add(workWrap, workInstance, "FILL", "HUG");

  // ---- Contact ----------------------------------------------------------
  const contactWrap = frame("Contact", "VERTICAL", {
    gap: 0,
    padX: PAD,
    padBottom: 120,
    fill: HEX.ultramarine,
  });
  add(page, contactWrap, "FILL", "HUG");

  const card = frame("Contact card", "VERTICAL", {
    gap: 20,
    padX: 56,
    padY: 56,
    fill: HEX.custard,
    radius: 28,
  });
  add(contactWrap, card, "FILL", "HUG");

  const ch = text("Let us make something cool together.", {
    size: 58,
    style: "Black",
    color: HEX.ink,
    spacing: -2,
    lineHeight: 105,
  });
  add(card, ch, "FILL", "HUG");
  ch.textAutoResize = "HEIGHT";

  const cb = text(
    "Whether you need a brand refresh, event visuals, or just want to chat about design, my inbox is always open.",
    { size: 18, style: "Regular", color: HEX.ink, lineHeight: 155 }
  );
  add(card, cb, "FILL", "HUG");
  cb.textAutoResize = "HEIGHT";

  const links = frame("links", "HORIZONTAL", { gap: 10 });
  add(card, links, "HUG", "HUG");
  links.appendChild(pill(PROFILE.email, HEX.honeydew, HEX.ink));
  links.appendChild(pill(PROFILE.location, HEX.honeydew, HEX.ink));

  return page;
}

// ---------------------------------------------------------------------------

async function build() {
  await loadFonts();

  // 1. One component per tab, combined into a variant set.
  const variants = WORK_TABS.map(function (_, i) {
    return buildWorkVariant(i);
  });

  const set = figma.combineAsVariants(
    variants.map(function (v) {
      return v.component;
    }),
    figma.currentPage
  );
  set.name = "Work Section";
  set.layoutMode = "VERTICAL";
  set.itemSpacing = 60;
  set.paddingTop = 60;
  set.paddingBottom = 60;
  set.paddingLeft = 60;
  set.paddingRight = 60;

  // 2. Tab clicks swap the variant IN PLACE. CHANGE_TO does not navigate, so
  //    scroll position is never touched.
  for (let v = 0; v < variants.length; v++) {
    for (let t = 0; t < variants[v].tabs.length; t++) {
      if (t === v) continue;
      await variants[v].tabs[t].setReactionsAsync([
        {
          trigger: { type: "ON_CLICK" },
          actions: [
            {
              type: "NODE",
              destinationId: variants[t].component.id,
              navigation: "CHANGE_TO",
              transition: {
                type: "SMART_ANIMATE",
                easing: { type: "EASE_IN_AND_OUT" },
                duration: 0.25,
              },
              preserveScrollPosition: false,
              resetVideoPosition: false,
              resetScrollPosition: false,
              resetInteractiveComponents: false,
            },
          ],
        },
      ]);
    }
  }

  // 3. One page holding one instance of the set.
  const instance = variants[0].component.createInstance();
  const page = buildPage(instance);
  page.x = 0;
  page.y = 0;

  // Park the component set beside the page.
  set.x = W + 260;
  set.y = 0;

  figma.currentPage.flowStartingPoints = [{ nodeId: page.id, name: "Portfolio" }];
  figma.viewport.scrollAndZoomIntoView([page]);
  figma.closePlugin(
    "Built in " + FAMILY + " - 1 page + " + variants.length + " tab variants."
  );
}

build().catch(function (e) {
  figma.closePlugin("Failed: " + e.message);
});
