# Master prompt: The Night Almanac

A single brief for designing and building Lana Denise Huertas's portfolio site. It merges three brand sheets Lana chose (2 Night bloom, 3 Pop-up herbarium, 4 Lunar almanac) into one system. It is written for a designer or an AI model to follow from start to finish. Every rule here is a decision, not a suggestion.

---

## 0. Role

You are three people at one desk:

- **A graphic designer** who owns the identity: type, colour, image making, the grid and the print-like finish of every surface.
- **A motion designer** who owns time: what moves, why, how fast, on what curve, and what never moves.
- **A senior UI/UX designer** who owns use: the order of information, how a recruiter finds the work in under ten seconds, accessibility, phone behaviour and performance.

When the three disagree, the order is: use first, then identity, then motion. A beautiful moment that hides the work is cut.

## 1. Client and goal

- **Who:** Lana Denise Huertas (they/them), UI/UX designer, graphic designer, video editor and software engineering student in Manila. UI/UX design intern at Eden Holdings Philippines.
- **Who visits:** recruiters and studio leads (UI/UX, brand, motion), and student organisations who might hire them.
- **What they must leave with:** Lana designs brands, posters, motion and real product interfaces, with taste and craft, and builds some in code. They are open to work.
- **Main action:** see the work. **Second action:** get in touch (email, CV).
- **Personality:** purple, magical, mystical, but precise. It should feel like an object made by hand, not a template. Never cute, never corporate.

## 2. The concept in one sentence

**The site is a pop-up almanac of a night garden: engraved plates printed on cut-paper pages that stand up when opened, lit by glass flowers and slow orchid light.**

The three sheets each give one material:

| Layer | From | Role in the system |
|---|---|---|
| **Light** | 2 Night bloom | The moving orchid light behind everything (one GPU shader), and glass objects (bud, bloom, moon) that are always the thing you can press or open. |
| **Paper** | 3 Pop-up herbarium | The physical layer: lavender card with a white die-cut edge, tape, folder tabs, stickers. Things hinge up from the page when they arrive. |
| **Line** | 4 Lunar almanac | The printed layer: engraved plates in one cream (on night) or violet ink (on paper), double rules, tarot cards, moon phases as the table of contents. |

Rule of materials: **night is the ground, paper is the surface, line is the print, glass is the action.** If something is clickable and important, it is glass or carries a glass object. If it is content, it is printed on paper. If it is atmosphere, it is light.

## 3. What the references teach (research summary)

Added after Lana's "not just flat" note: the seven Wall of Portfolios references and the depth layer they led to are in `docs/reference-analysis-depth-portfolios.md`. In short, the site is a painted world you travel through, and photographed objects (a seed cabinet, a magic lantern, a bell jar, a gilded frame, an almanac) are the interface.

From Lana's 11 Behance references (portfolio galleries 254509701, 256721649, 257348537, 238261123, 252294557, 256457213, 242975455, 231470363, 257600515, 252350921, 231540647):

1. The cover is one illustrated scene, not a layout of boxes.
2. The contents are a map inside that scene (shelves, a winding path, folders).
3. Every section opens with the same scene motif, so pages connect.
4. Ticker strips, and script type paired with a display face.
5. Physical objects and cut-outs: paper, tape, folders, stickers.
6. Bitmap and garden imagery.

From scrolltide.co ("make it impactful"):

1. Huge display type with an object breaking through the letters (an object in front of some letters and behind others).
2. Buttons that are small scenes or glowing objects, not flat rectangles.
3. GPU shader grounds used as quiet motion behind everything.
4. Collectible cards with real depth and a satisfying hover.
5. One strong idea per section; the rest stays disciplined.

How the system answers them: the hero is the scene (2.1), the contents are the moon's phases and a tarot spread (2.2), every section opens with a paper folder tab, a phase glyph and a bud that blooms (2.3), tickers sit on washi tape (2.4), and pop-up paper carries the work (2.5).

## 4. Graphic design system

### 4.1 Colour (purple first, measured for WCAG AA)

| Token | Hex | Use |
|---|---|---|
| `--night` | `#140a2c` | Ground of the whole site. |
| `--plum` | `#2b1550` | Night cards, plates, tarot faces. |
| `--velvet` | `#3a1290` | Shader bands, deep panels. |
| `--paper` | `#efe8ff` | Paper pages and cards (lavender card). |
| `--card` | `#fffdf8` | Brightest paper, die-cut edges. |
| `--ink` | `#2b1470` | Text and engraving on paper. |
| `--cream` | `#fff1c9` | Text and engraving on night. |
| `--iris` | `#6b46e0` | Buttons on paper, links, script on paper. |
| `--lilac` | `#b9a2ff` | Script on night, the living part of an icon, tape. |
| `--orchid` | `#c04bff` | Glow, the light, focus halos. Never small text. |
| `--rose` | `#ee8be4` | Stickers and stamps only. Rare. |

Rules: no red; pink is a sticker, never a warning. Text pairs: cream on night, ink on paper, card on iris. Orchid and rose are never used for text under 24px. Measure every pair; the system page shows the ratio live.

### 4.2 Type

| Role | Face | Size and use |
|---|---|---|
| Display | **Redaction** (Lana's own, from the live site), with its degraded cuts 70, 35, 10 | Names and titles, 40px and up. Touched letters wear down through the cuts and come back. |
| Second voice | **Redaction Italic** | Counts, captions, the ticker. |
| Script | **Pinyon Script** | Signatures under titles, 32px and up only. Never carries information alone. |
| Reading and UI | **Inter Tight** | Body 17px, line height 1.55; labels 14px minimum; buttons 16px. |

Sentence case everywhere. No all caps. No single italic word used as an accent inside a sentence-style headline. No eyebrow label above every heading.

### 4.3 Image making

- **Engraved plates** (moon face, lily, moth, plus new ones as needed): one colour of line, cross-hatching, no fill. Cream on night, violet ink when printed on paper.
- **Cut paper** (bloom, bud, moon in clouds, butterfly): layered card, crisp scissor edges, a white die-cut border, a small real shadow.
- **Glass** (bud, bloom, moon): iridescent lilac glass with white rim light. Only for objects that open or are pressed.
- **Lana's real work** is shown in true colour, never tinted, inside the frames the system gives it.
- Image generation: Codex. Every element in one set shares the palette in 4.1.

### 4.4 Shapes and surfaces

- **Double rule:** a 1px line, a gap, a 1px line (outline-offset). Used on plates, tarot cards, ledgers and the primary button. Hover widens the gap.
- **Die-cut edge:** 4–5px white ring plus a soft shadow. Used on paper cards and stickers.
- **Arch window:** the work image sits in an arch (round top, square bottom) on tarot and work cards.
- **Folder tab:** each section is a folder, its tab carrying the section name and moon phase.
- **Radius scale:** 4 (inner), 14 (buttons, inputs), 20 (cards), 999 (pills). Nothing else.
- No grain, no noise overlays, no glassmorphism blur panels.

### 4.5 Grid

12 columns, max width 1440, gutter 16–22px, outer margin 4vw. Equal left and right edges. Sections are one or two screens tall at 1440×900. Hero alone on the first screen.

## 5. Motion system

### 5.1 Principles (the 12 principles of animation, applied)

| Principle | Where it lives |
|---|---|
| Squash and stretch | Paper pieces overshoot a few degrees when they stand up, then settle (within 0.95–1.05 scale). |
| Anticipation | Before the almanac opens, the cover lifts 2 degrees and the bud tightens (scale 0.97) for 120ms. |
| Staging | One moment at a time. When the hero opens, the shader slows and dims so the opening is the only motion. |
| Straight ahead and pose to pose | Pose to pose for UI (two states, one transition). Straight ahead only for the orchid light. |
| Follow through and overlap | Petals open in a 40ms cascade; the six section cards land after the bloom, not with it. |
| Slow in and slow out | Enter `cubic-bezier(0.23, 1, 0.32, 1)`, move on screen `cubic-bezier(0.77, 0, 0.175, 1)`; pop-up hinge `cubic-bezier(0.3, 1.45, 0.5, 1)`. |
| Arcs | Cards fly from the bloom's heart to their places on curved paths (rotate inside a translate), never straight lines. |
| Secondary action | A sticker spins as its card lifts; the moon's ring of words keeps turning slowly behind the cards. |
| Timing | Hover and press 120–180ms; small state 180–260ms; user-started motion never over 300ms, except the one hero opening (up to 1.6s, skippable). |
| Exaggeration | Only once: the hero opening. Everything after is calm. |
| Solid drawing | Real 3D for hinges and card flips (CSS perspective and preserve-3d), correct shadows that follow the angle. |
| Appeal | Every object has weight: paper has a shadow, glass has a rim light, line has no shadow at all. |

### 5.2 Rules

- Hover colour changes are instant. Movement on hover is 2px lift or a 1.02 zoom inside a frame.
- Press scales to 0.98 or presses the paper edge down 4px.
- Nothing grows from zero; entrances start at scale 0.95 or a hinge angle.
- Closes are faster than opens.
- No fade-in on every section. The only scroll-linked motion: each section's folder flower stands up once when the section arrives, and the moon in the contents bar fills as you read.
- The orchid shader runs only on screen, pauses when hidden, and draws one still frame under reduced motion.
- Never put filter, mask or clip-path on anything that animates forever. Never write per-frame CSS variables on `<html>`.
- Reduced motion: every movement becomes an opacity change, delays become zero, and nothing stays hidden.

### 5.3 Signature moments (three, no more)

1. **Open the almanac** (hero): the cover hinges open, the glass bud blooms, cut-paper garden stands up, the six sections are dealt as tarot cards from the bloom's heart.
2. **Wear the letters** (every title): touched letters run through Redaction 70, 35, 10 and back in 420ms.
3. **The folder stands up** (every section start): its paper flower hinges up from the folder edge once.

## 6. UX structure (the site, in order)

1. **Hero, "the cover":** the name huge in Redaction with the glass bud breaking through the letters; one line saying what Lana does and where; the button "Open the almanac". Scroll also opens it. After opening, six tarot cards = the contents.
2. **Contents bar (sticky):** six moon phases, one per section, with labels. The current phase fills. Keyboard and screen-reader friendly.
3. **Branding and pubmats:** brands as a deck of collectible cards (arch window, die-cut edge, sticker). Click opens a plate sheet with the brand's pubmats.
4. **One-off posters:** pinned to paper with tape, like a herbarium wall. True colour.
5. **Moving pictures:** films as tarot cards with a glass play button; poster frames, real video in a lightbox.
6. **UI/UX and code:** four products (PsyClick, Bloom, Algebrawl, Debt Payoff Ledger) as almanac spreads: device frames on paper, a short case line, the role, the stack.
7. **About:** portrait in an engraved cameo frame, a short honest paragraph, experience as a ledger with double rules, education, certifications and awards (1st runner-up, ImaGnation: GCash Innovation Challenge 2026; Elite Scholar; DOST Scholar).
8. **Let's talk:** a paper letter that unfolds: email, CV, socials, a short form. Footer with the moon's phases and "Made in Manila".

UX rules: a recruiter reaches real work within one scroll or one click; every gesture has a button; every control has a visible focus ring and a name; 44px minimum touch targets; body text 16px or more; CLS 0 (every image has width and height); no horizontal scroll at 390px; phone gets one column and the same story, never a cut-down one.

## 7. Copy voice

Plain, warm, specific. The almanac metaphor appears in the button labels and section signatures, never in place of a fact. Every heading names a thing. Buttons are a verb and an object ("Open the almanac", "See the posters", "Email Lana"). Never use the word "portfolio" in the hero.

## 8. Performance budget

- One WebGL context per page; canvas at half resolution; paused off screen.
- Hero art under 300 KB total; WebP with alpha; lazy-load everything below the hero.
- Fonts: preload Redaction regular only; the rest swap.
- Lighthouse on a mid phone: LCP under 2.5s, CLS 0, no long task over 200ms during the opening.

## 9. Deliverables

1. `system.html`: the brand and design system, rendered: concept, materials, colour with live contrast, type scale, the three surfaces, buttons in every state, components, icons, motion tokens with live demos, do and don't.
2. `index.html`: the full sample site with real content and real images, built to this prompt.
3. A short report: what was checked (1440, 1024, 768, 390; reduced motion; console; overflow), what is still a stand-in, and what is next for the Next.js build.

## 10. Never

- A template look: identical rounded cards with grey shadows, eyebrow labels, numbered markers that are not a real sequence, an arrow on every link.
- Grain overlays, glassmorphism blur, neon everything.
- Lime, red, or any colour world that pushes purple out.
- Motion without a cause. Anything that blinks at random.
- Lana's phone number, birthday, family names or street address.
