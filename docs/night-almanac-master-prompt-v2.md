# Master prompt v2: The Night Almanac, one continuous world

This brief is for designing and building Lana Denise Huertas's portfolio. It replaces the section plan in `night-almanac-master-prompt.md` and keeps that file's tokens and rules. It is written so that a designer, a developer or an AI model can follow it from start to finish. Every line is a decision.

Lana's words on the first sample (`public/samples/almanac/`): "I like the concept, but make it more like a whole scene, and well put together. Each branding has its own background, like you can see each branding sheet laid out, not just capsules. Not only the hero section is laid out. Each section must be interactive. Follow what each of the 7 portfolios share, like scrolling feels like travelling."

---

## 0. Who you are

Work as four people at one desk, and settle disagreements in this order:

1. **Senior UI/UX designer.** A recruiter finds real work in under ten seconds, on a phone, with a keyboard, with motion turned off.
2. **Art director and graphic designer.** One world, one palette, one type system; every brand shown at the quality of a printed brand book.
3. **Motion designer.** The camera, not the content, does the travelling. Each movement has a cause.
4. **Creative developer.** Smooth at 60 fps on a mid-range phone, no layout shift, one GPU budget.

## 1. The goal in one paragraph

The site is a single painted night garden that you travel through from top to bottom. Scrolling moves a camera along a path: through the gate, down the flower stair, into the glasshouse, along a gallery of brand rooms, past the lily pond, up to the attic study, and out into first light. Nothing sits on a plain background. Every stop is a composed scene with objects you can touch, and every stop does something when you touch it. Lana's real work is the subject of every scene.

## 2. Research: what fourteen portfolios share

Studied on 2026-11-16 by capturing each live site while scrolling. The first seven are the ones Lana picked; the second seven are the whole Creative wall at wallofportfolios.in/creative (the wall listed nine, two of them repeats). Full notes on the first seven: `docs/reference-analysis-depth-portfolios.md`.

| Site | The idea worth taking |
|---|---|
| Adya Srivastava | A painted world; the scroll is a story told in chapters ("Leaving surface", "You've arrived"). |
| Sudarvel K | Photographed objects as interface: a CRT frames the portrait, cassette drawers are the process, matchbox books form a shelf. |
| Chi Quach | One photograph holds every project: each object in the x-rayed bag is a link. |
| Vibhor Mathur | A 3D island you walk through, with a guided-tour button for people in a hurry. |
| Manisha Koranga | Painted meadow plus photographed cut-outs; each section is a different collage (a desktop, a shopping cart). |
| Frances Zhao | Clicking the empty space grows a flower. |
| Ayush Dhibar | Work shown inside a physical device; an "interactive mode" switch for a plain fast path. |
| Rezwanul Choudhury | The home page is a desk you can rearrange: drag the objects, arrows point to the four directions of the site. |
| Royden So | Hands hold the work up to you; each project gets its own full-bleed colour world. |
| Loveleen Pereira | A scrapbook desk: cassette "tap to play", small draggable windows, a washi-tape ticker, script with mono. |
| Sahil Betigeri | Every piece fills its own world; the archive is a dense collage wall, not a grid of equal cards. |
| Rolan Gomes | Paper sheets pinned to a board; stats on sticky notes; tool stickers you can drag around. |
| Harshini P Rajan | Restraint: one shape, one colour, an index you read as a list. Proof that one strong idea is enough. |
| Shalmali Gaikwad | The designer herself rides a hot-air balloon through the clouds; scalloped edges; a marquee footer with her cut-out photo. |

**What they share, as rules for this site:**

1. **The page is a place.** Each screen is a composed scene with depth: a painted ground, objects with real shadows, and quiet interface on top.
2. **Scrolling is travel.** The scroll moves you through the place, and the place changes as you go (sky, stair, glass, water, attic, dawn).
3. **Objects are the interface.** You press, open, drag, play or pull the thing itself.
4. **Each piece of work gets its own world.** A brand is never a thumbnail in a row of equal capsules; it gets a room in its own colours.
5. **The designer is in the scene.** Adya walks her cosmos, Shalmali rides her balloon, Sudar sits in his TV. Lana appears too.
6. **One plain path.** A switch or a tour button gives a fast, still version.
7. **Hand-made texture** (tape, stickers, notes, script) sits next to precise interface (mono labels, lists).

## 3. The world map (the route)

One continuous vertical journey. Each stop is a pinned scene ("chapter") that the camera moves through, joined by short passages so there is no hard cut between chapters.

| # | Chapter | Scene | Passage into the next |
|---|---|---|---|
| 1 | **The gate** (hero) | The night garden, full moon, the far glasshouse glowing | The gate swings open and the camera pushes through it |
| 2 | **The seed cabinet** (contents) | The flower stair, the cabinet standing on the landing | The camera follows the stair down to the glasshouse door |
| 3 | **The glasshouse gallery** (branding, ten brand rooms) | Inside the conservatory; a long glazed corridor of rooms | The far door opens onto the pond |
| 4 | **The pinned wall** (one-off posters) | The potting shed wall beside the pond | Paper lanterns lead to the clearing |
| 5 | **The lantern clearing** (films) | Forest clearing, a sheet hung between two trees | Fireflies rise; the camera tilts up to the pond |
| 6 | **The lily pond** (products) | Dark water; four lily pads, one per app | Stepping stones to the house |
| 7 | **The attic study** (about) | The round window, the desk, the shelves | The window opens; the camera flies out |
| 8 | **First light** (contact) | The garden at dawn, Lana's balloon or kite lifting off | End |

Lana appears once per chapter as a small cut-out figure made from her real portrait (paper-cut style, not a cartoon): at the gate holding a lantern, on the stair, in the glasshouse doorway, sitting on the pond's bank, at the desk, waving from the dawn hill. She is the guide; she never covers the work.

## 4. How the travel works (motion system)

- **Camera, not cards.** Each chapter is a full-viewport stage with three to five depth planes: far (sky), mid (garden or room), near (objects and work), front (leaves, glass, frame edges). Scrolling through the chapter moves the planes at different speeds and slightly scales the far plane, so it feels like walking forward. Content never slides in from the side; the camera arrives at it.
- **Passages.** Between chapters, a 60 to 100vh passage where the front plane wipes past the camera (wisteria curtain, a doorframe, glass panes, water surface) and hides the switch of scene. No fade-to-black.
- **Pinned only where it earns it.** The hero, the glasshouse gallery and the pond are pinned and scrubbed by scroll. The posters wall, the study and the contact scroll normally inside their scenes.
- **The glasshouse gallery moves sideways.** While pinned, vertical scroll walks the camera along the corridor of ten brand rooms, left to right. A room counter and arrow buttons let you jump rooms; keyboard left and right do the same.
- **Easing.** Enter `cubic-bezier(0.23, 1, 0.32, 1)`; move `cubic-bezier(0.77, 0, 0.175, 1)`; paper hinge `cubic-bezier(0.3, 1.45, 0.5, 1)`. Scrubbed motion follows the scroll exactly, with no lag smoothing over 0.08 s.
- **Durations.** Hover and press 120 to 180 ms. Small state changes 180 to 260 ms. A room or a sheet opening up to 400 ms. The one-off gate opening up to 1.6 s and skippable.
- **Reduced motion and quiet mode.** No pinning, no scrubbing, no parallax. Chapters become normal stacked sections with their still scene picture, the gallery becomes a vertical list of rooms, and every interaction still works.
- **Never.** Filters, masks or clip-paths on anything that animates forever; per-frame CSS variables on `<html>`; fade-in on every block; random blinking; tilt on hover.

## 5. Chapter by chapter

Every chapter lists its scene, its content, its main interaction and the button version of that interaction.

### 5.1 The gate (hero)

- **Scene:** the painted garden, a wrought-iron gate in the foreground, the full moon left, the glasshouse glowing far away.
- **Content:** the name in Redaction, very large, with the glass bloom breaking through the letters; one line ("UI/UX and graphic designer in Manila. I design brands, posters, films and real product screens, and I build some of them in code."); "Open the gate" (glass button) and "Email Lana" (line button).
- **Interaction:** pressing the button or starting to scroll opens the gate. The two halves swing on real hinges (CSS 3D), the camera pushes through, and the moths scatter. Clicking the sky plants Lana's paper flowers (up to 16).
- **Button version:** "Open the gate" scrolls to chapter 2; "Plant a flower" plants one at random.
- **Loader:** a moon filling with "Waking the garden", never longer than 1.2 s, once per session.

### 5.2 The seed cabinet (contents)

- **Scene:** the flower stair with the cabinet on its landing. Lana stands beside it.
- **Content:** the six drawers, labelled Branding, Posters, Films, Products, About, Contact.
- **Interaction:** hovering a drawer slides it open a few centimetres (a separate drawer-front image moves out with a real shadow) and a sprout of that section's work rises from it. Clicking pulls the drawer fully out, then the camera travels to that chapter.
- **Button version:** the drawers are links; Tab and Enter work. A "Guided tour" button travels the route automatically, stop by stop, with a visible Pause.

### 5.3 The glasshouse gallery (branding): each brand gets a room

This is the heart of the site and answers "each branding has its own background, like you can see each branding sheet laid out".

- **Scene:** a long glazed corridor inside the conservatory. Each bay of the corridor is a **brand room**: an alcove whose back wall is that brand's own backdrop (the existing `public/art/backdrops/<slug>.webp` set, generated per brand by `scripts/gen-backdrops.py`) and whose light takes on the brand's accent colour from `lib/brands.ts`.
- **Each room is the brand sheet, laid out like a page of a brand book, in the brand's own colours:**
  - the key visual, large, pinned to the back wall;
  - the brand name in its own display type (from the brand's fonts sheet where one exists, for example `botb-x-roa-fonts.webp`), the tagline, the organisation and the date;
  - a palette strip of three to five colours sampled from the key visual;
  - the social posts as a tidy grid of real pubmats on a board;
  - one or two physical mockups where the brand had them (TechnoRun jerseys and race bibs on a rail, PACSA certificate and photo frame on an easel, Tabitayo app on a phone);
  - roles and tools on a small museum label ("Key visual, event branding, speaker cards. Photoshop, Illustrator.").
- **Interaction:** walking (scrolling) moves along the corridor; the room you stand in lights up and its glass door slides open. Inside a room: hover lifts a pubmat; click opens it full size in a lightbox you can step through with arrows; the palette swatches copy their hex code; a "Next room" sign at the room's edge walks you on.
- **Button version:** room counter (1 of 10), previous and next buttons, and keyboard arrows. With reduced motion the rooms stack vertically, each still a full laid-out sheet on its own backdrop.
- **Order:** ACM Revival X, Into the Code, NEOSTALGIA, Tabitayo, Rock of Aces, Battle of the Bands, TechnoRun, Kulay PACSA, ACM Elysium, Techno Week. A bonus last room holds the rest ("More from the archive").

### 5.4 The pinned wall (one-off posters)

- **Scene:** the potting-shed wall by the pond, lavender paper pinned to old boards, string lights.
- **Content:** the twelve posters, taped at small angles, in a dense collage (Sahil, Rolan), not an even grid; a few sticky notes in Lana's voice ("made in one night", "my favourite type").
- **Interaction:** drag any poster to rearrange the wall (it keeps a little rotation and casts a shadow while lifted); click to open it large with its client and year; double-click or the "Tidy the wall" button snaps everything back.
- **Button version:** each poster is a button that opens it; "Tidy the wall" and "Shuffle" buttons; arrow keys move a focused poster.

### 5.5 The lantern clearing (films)

- **Scene:** the forest clearing, a white sheet hung between two trees, the brass magic lantern on a tree stump.
- **Content:** ten films as glass lantern slides in a wooden slide box.
- **Interaction:** drag a slide into the lantern, or click it; the lantern's beam lights up and the sheet plays the film's poster frame with a soft flicker, then shows the title, role and length with "Watch on Google Drive". The slide box can be flipped through like records.
- **Button version:** each slide is a toggle button; the current one is pressed.

### 5.6 The lily pond (products)

- **Scene:** dark water with the moon's reflection, four large lily pads.
- **Content:** PsyClick, Bloom, Algebrawl, Debt Payoff Ledger. Each pad carries its app in a device under a glass bell jar (phones) or on a small easel (desktop apps).
- **Interaction:** hovering a pad makes the water ripple outward from it and the bell jar glow; clicking lifts the jar off and opens the app's almanac spread (a two-page book: the device on the night page, the story, role, stack and live link on the paper page). Inside the spread, the screenshots can be stepped through like pages.
- **Button version:** four folder tabs above the spread, arrow-key navigation, "Open the live app" links.

### 5.7 The attic study (about)

- **Scene:** the attic with the round window, desk and shelves.
- **Content:** the portrait in the gilded frame; a short bio; experience as entries in an open ledger on the desk; awards as wax seals; education in the almanac book on the shelf; tools as stickers on the window.
- **Interaction:** turn the ledger's pages (each page one role); drag the tool stickers around the window (Rolan); click the almanac to open education and certificates; click a seal to see what it was for.
- **Button version:** "Previous page" and "Next page" on the ledger, each sticker and seal a button.

### 5.8 First light (contact)

- **Scene:** the garden at dawn; Lana's cut-out in a paper hot-air balloon or on the hill with a kite (Shalmali's idea in Lana's world).
- **Content:** a paper letter: "Let's talk", "from Manila, open to work", a sentence on what to write about, "Email Lana" (glass), "Copy the address" (paper, with a cross-fading "Copied"), LinkedIn and GitHub.
- **Interaction:** the letter unfolds as you arrive; a marquee ribbon of Lana's roles runs along the hill; clicking the sun brings morning forward (the sky warms, the moon sets).
- **Footer:** the six moon phases as a mini map of the route, "Made in Manila", the design-system link and the quiet-mode switch.

## 6. Always-on interface

- **The route bar** (top on desktop, bottom on phones): Lana's mark, the eight chapters as moon phases with labels, the current one filled, and the quiet-mode switch. A thin vine along it grows with scroll progress.
- **Guided tour** button in the route bar: travels the route stop by stop and pauses on each for 4 s; Pause and Stop are always visible.
- **Quiet mode** switch: everything still, all content reachable, remembered in local storage. On by default when the system asks for reduced motion.
- **Skip link** to the brand gallery ("Skip to the work").

## 7. Design system (kept from v1, extended)

- **Layers:** depth (painted scenes, photographed objects), light (orchid glow), paper (lavender card, die-cut edge, tape, stickers), line (engraving, double rules, moon phases), glass (only on what acts).
- **Colour:** night `#140a2c`, plum `#2b1550`, velvet `#3a1290`, paper `#efe8ff`, card `#fffdf8`, ink `#2b1470`, cream `#fff1c9`, iris `#6b46e0`, lilac `#b9a2ff`, orchid `#c04bff` (glow only), rose `#ee8be4` (stamps only), mist `#d9cfff`. **Brand rooms are the one exception:** inside a room the brand's own palette leads, framed by the glasshouse's violet glazing so the site still reads as one world.
- **Type:** Redaction with its 70, 35 and 10 cuts (touched letters wear and return), Redaction Italic, Pinyon Script at 32 px and up, Inter Tight for reading (body 17 px, labels 14 px minimum), DM Mono 14 px for labels. Brand rooms may show the brand's own display face as an image.
- **Buttons:** glass (one main action per screen), paper (secondary on paper), line (quiet on night). Rest, hover, pressed, focus and disabled defined in `public/samples/almanac/system.html`.
- **Radius:** 4, 14, 20, pill. Nothing else.
- **Scrims:** text over a painting always sits on a side gradient or on paper.

## 8. Art to make (Codex image generation)

Existing: seven chapter scenes and five objects in `public/samples/almanac/art/`; ten brand backdrops in `public/art/backdrops/`; paper, glass and engraved elements in `public/samples/brand/art/`. Still needed, all in the gouache storybook style of the existing scenes, objects as photoreal cut-outs on chroma green:

1. Depth planes for each pinned chapter: the same scene split into far, mid and near layers (sky; garden or room; foreground leaves or frame), so the camera can move through them.
2. The gate: two wrought-iron gate halves, separately.
3. The glasshouse corridor: an empty alcove bay (repeated per room) with glass doors that can slide, and the long corridor view.
4. Pond: four lily pads seen from above, water ripple sprites.
5. Clearing: a white sheet between two trees, a wooden lantern-slide box.
6. Study: an open ledger book (left and right pages separately), wax seals, a window with removable stickers.
7. Dawn: a paper hot-air balloon.
8. Lana: six paper-cut figures from her real portrait, one pose per chapter, made from her photo, never invented features.
9. One cabinet drawer front, separately, so it can slide out.

Keep each scene's centre or one side calm for content. Export WebP, a 960 px cut for phones, sizes recorded for every image.

## 9. Build notes

- **Stack:** the real site is Next.js 16 App Router with React 19 and Tailwind 4 (this repo). Prototype first as static HTML in `public/samples/almanac-v2/`, then port.
- **Scroll engine:** native scroll; pinned chapters with `position: sticky` and a tall track; progress read once per frame from `getBoundingClientRect`, written as transforms on the chapter's own layers (never on `<html>`). CSS scroll-driven animations (`animation-timeline: view()`) where supported, with the JavaScript path as the fallback. No scroll hijacking: the wheel and the keyboard always scroll the page at native speed.
- **Performance:** at most one WebGL context (only if a shader is truly needed; none is planned); scene layers as WebP under 300 KB each on desktop and 120 KB on phones; lazy-load chapters two ahead; `content-visibility: auto` on chapters far away; CLS 0.
- **Accessibility:** WCAG AA contrast; 44 px targets; visible focus; headings in order (one h2 per chapter, h3 per brand room); every drag has buttons and keys; the lightbox traps focus and closes on Escape; alt text on every piece of work; the guided tour can be paused.
- **Privacy:** no phone number, birthday, family names or street address anywhere.

## 10. Acceptance

The prototype is done when all of these hold:

1. Scrolling from top to bottom at 1440 and 390 wide feels like one walk through one place, with no flat section anywhere.
2. Each of the ten brands has its own laid-out room in its own colours, with its key visual, palette, pubmats and mockups visible at a glance.
3. Every chapter has a working interaction and its button version.
4. Quiet mode and reduced motion give a still, complete, readable page.
5. No console errors, no horizontal overflow, CLS 0, AA contrast on every text block.
6. A recruiter can reach a piece of real work in one click from the first screen.
