# Grade: Night Almanac v2 prototype

Graded on 2026-11-16 against `docs/v3/rubric.md`. Page: http://127.0.0.1:3900/samples/almanac-v2/index.html. Brief: `docs/night-almanac-master-prompt-v2.md`.

Lana's verdict was: "I like the idea, but it looks incomplete and rushed. This is too overwhelming." The measurements below agree with her. The page is about twice as busy as the sites she chose. It has no quiet screen anywhere. It also carries around forty visible finish defects, and nine of the ones in the defect list are serious.

All evidence files sit under
`C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v3\grade\`
in `shots/` (stills), `motion/` (load, idle and scroll), `inter/` (interactions) and `contrast/` (contrast). The scripts that made them sit in the same folder: `stills.py`, `motion.py`, `inter.py`, `verify.py`, `contrast.py`, `csum.py` and `phonebar.py`.

---

## 1. Facts from "How to look" (numbers first)

| Fact | 1440 × 900 | 390 × 844 |
|---|---|---|
| Page length | 21,945 px = **24.4 screens** (19.9 in quiet mode) | 25,645 px = **30.4 screens** |
| Busyness, median of all stills | **calm 23, busy 38** (25 stills) | **calm 7, busy 59** (32 stills) |
| Busyness range | calm 2 to 41, busy 24 to 63 | calm 1 to 30, busy 37 to 76 |
| Quiet mode, median | calm 27, busy 34 (20 stills) | not measured |
| Hue families per screen | 3 to 8 (median 6) | 4 to 8 |
| Font families | 4 on the page (Redaction, Inter Tight, DM Mono, Pinyon Script), up to 3 per screen | same |
| Things competing per screen | 15 to 30 (see chapter table) | 8 to 15 |
| Pieces of work visible on screen 1 | **0** | 0 |
| To the first real piece of work | 5 scrolls (4,500 px, ACM Revival room) or **2 clicks** ("Branding" in the route bar lands on an intro panel with no work, then "Enter the first room") | 4.4 screens of scrolling |
| Console errors / horizontal overflow | none / 0 px | none / 0 px |

**Reference comparison.** These are Lana's taste sites, measured the same way:

| Site | Calm | Busy |
|---|---|---|
| Adya Srivastava, hero | 50 | 9 |
| Adya Srivastava, work section | 86 | 6 |
| Sudarvel K, hero | 48 | 21 |
| Chi Quach | 46 | 25 |
| Ayush Dhibar | 92 | 0 |
| **This prototype, median screen** | **23** | **38** |
| **This prototype, calmest screen** | **41** | **24** (films heading) |

The calmest screen here is still busier than the busiest reference.

### Measurements per chapter (1440 stills, scroll position in px)

| Chapter | Still (`shots/`) | scrollY | Calm | Busy | Hues | Competing things |
|---|---|---|---|---|---|---|
| Gate | s1440-00 | 0 | 13 | 51 | 4 | ~16 |
| Gate, half open | s1440-01 | 900 | 15 | 29 | 4 | ~16 |
| Cabinet, arriving | s1440-02 | 1800 | 6 | 46 | 6 | ~14 |
| Cabinet | s1440-03 | 2700 | 9 | 37 | 5 | ~13 |
| Brands intro | s1440-04 | 3600 | 7 | 50 | 4 | ~12 |
| Room 1, ACM Revival X | s1440-05 | 4500 | 25 | 44 | 5 | ~25 |
| Room 2, Into the Code | s1440-06 | 5400 | 22 | 40 | 3 | ~27 |
| Room 3, NEOSTALGIA | s1440-07 | 6300 | 20 | 39 | 8 | ~27 |
| Room 4, Tabitayo | s1440-08 | 7200 | 26 | 39 | 7 | ~25 |
| Room 5, Rock of Aces | s1440-09 | 8100 | **2** | **56** | 6 | ~28 |
| Room 6, Battle of the Bands | s1440-10 | 9000 | **3** | **63** | 6 | ~28 |
| Room 7, TechnoRun | s1440-11 | 9900 | 28 | 38 | 7 | ~24 |
| Room 8, Kulay PACSA | s1440-12 | 10800 | 23 | 38 | 6 | ~24 |
| Room 9, ACM Elysium | s1440-13 | 11700 | 9 | 40 | 6 | ~27 |
| Room 10, Techno Week | s1440-14 | 12600 | 24 | 38 | 7 | ~22 |
| Rooms, median | | | 22.5 | 39.5 | | |
| Posters | s1440-15 / 16 | 13500 / 14400 | 25 / 24 | 39 / 37 | 7 | ~22 (12 posters, 4 notes) |
| Films | s1440-17 / 18 | 15300 / 16200 | 41 / 18 | 24 / 44 | 5 | ~10 / ~20 |
| Products | s1440-19 / 20 | 17100 / 18000 | 38 / 21 | 31 / 24 | 4 to 5 | ~14 / ~18 |
| About | s1440-21 | 18900 | 38 | 31 | 5 | ~22 |
| About into contact, seam | s1440-22 | 19800 | 30 | 33 | 5 | ~8, mostly wisteria |
| Contact | s1440-23 / 24 | 20700 / 21045 | 31 / 24 | 29 / 29 | 5 to 6 | ~14 |

The first measurements in the brief all reproduce: gate 13 / 51 and cabinet 9 / 37. The rooms spread far wider than the single room in the brief (16 / 33). Rock of Aces and Battle of the Bands reach calm 2 to 3 and busy 56 to 63, the worst screens on the page.

### Motion facts

- **On load** (`motion/load-00` to `load-11`). Frame 0 is the loader, a moon on night with "Waking the garden" and **"-2%"**. In frame 1 the whole hero is simply there: 88.7% of the pixels change at once. Frames 2 to 11 show 0.0% change. Nothing composes the arrival: no name settling and no gate appearing.
- **On scroll** (`motion/scroll-*`, wheel 30 px × 10). The measure is the share of pixels that change on each step.
  - Gate: 17 to 19% per step. Three things are scrubbed by the scroll: the gate halves rotate on their hinges, the name block rises and fades, and the corner lilies slide outward. The far painting also scales up.
  - Brands: 24 to 29% per step. The section is pinned and the corridor of rooms moves sideways. 100 px of wheel moves it 160 px, and each room costs 900 px of scrolling.
  - About: 22 to 23% per step. This is plain scrolling over a sticky painting. At each chapter seam a wisteria curtain wipes past faster than the scroll.
- **Idle** (3 s still, then two shots 1.5 s apart). Six of eight positions change 0.0%. Products changes 3.6% because the pads bob forever, and contact changes 0.9% because of the ribbon marquee. The 14 hero "motes" are invisible: they carry class `g-motes`, but the CSS only styles `.motes`.
- **Hover and click.** Measured from the screenshots and the CSS:
  - Tiles, the key visual, slides, pads and stamps lift in 140 ms.
  - The drawer front bumps in 220 ms on the hinge curve.
  - The lightbox fades in 220 ms.
  - The product spread fades in 220 ms.
  - The ledger page fades out for 120 ms, then back in.
  - Route-bar and drawer links smooth-scroll across up to 13,000 px. During the trip, blank night frames appear (`inter/cab-click-400.png`, `inter/gate-open-100.png`).

---

## 2. Scores

Scale: 1 is poor, 5 is excellent.

### A. Interface and experience: average **2.25**

| # | Criterion | Score | Evidence |
|---|---|---|---|
| A1 | First screen | 3 | In five seconds you get the name (135 px), the trade and the city (s1440-00). The next step is unclear. There are three buttons of three different kinds ("Open the gate", "Email Lana", "Plant a flower"), and "Open the gate" does not say where it goes. No work shows. |
| A2 | Path to the work | 2 | Screen 1 shows 0 pieces of work. The first one is 4,500 px (5 screens) down, or 2 clicks away, because "Branding" in the route bar lands on an intro panel with no work (s1440-04). On a phone it is 4.4 screens. The only earlier sight of work is a 120 px thumbnail in the cabinet peek card. |
| A3 | Orientation | 3 | The route bar marks the current chapter and a progress line grows. The corridor has a counter and dots (s1440-05). The phone bar hides every label and shows moons only, and its quiet switch sits at x 370 to 434 in a 390 px screen (`shots/phone-bar.png`). The gate and the cabinet are not in the route bar at all. |
| A4 | Reading | 2 | Body text is 16 to 21 px, and the room panels pass AA at 5.7 to 18:1. But the hero labels fall to 2.4:1, the "Email Lana" line button over the gate to 1.7:1, and the product taglines (lilac script on paper) to 1.8:1. Headings slide under the see-through route bar, which leaves 1.0:1 in places (`contrast/c1440-films.png`). The wisteria curtain lies over the education card and the product spread (s1440-22, s390-27). Pubmat tiles are 180 px, too small to read. |
| A5 | Calm | 1 | The median screen is calm 23, busy 38; the references run calm 46 to 92, busy 0 to 25. A brand room holds about 25 to 28 competing items. No screen has a single focus with room around it. |
| A6 | Consistency | 2 | Buttons come in glass, line, paper, a mono pill ("Plant a flower"), chips, stamps, stickers, tabs and lily pads. There are two "Guided tour" buttons in two styles, two counters per room ("Room 1 of 10" and "1 of 10"), and tabs that repeat the pads. Corner radii seen: 3, 4, 6, 8, 12, 14, 18, 20, 26 and 160 px, against a brief that allows 4, 14, 20 and pill. Each room uses three different card treatments. |
| A7 | Phone | 2 | Nothing overflows sideways, but the page runs 30.4 screens and the brands alone take 16.8. The median phone screen is calm 7, busy 59. The route bar overflows (see A3). The wisteria lies over the text. "Tidy the stickers" sits on top of a sticker (1.1:1). It reads as the desktop page squeezed into one column. |
| A8 | Plain path | 3 | Quiet mode works. It is remembered, switches on by itself for reduced motion, keeps all content and every interaction, and shortens the page to 19.9 screens. "Skip to the work" exists. The guided tour, though, crawls at about 12 px/s (about 30 minutes for the page). In quiet mode the brands intro sits on a blown-up, blurred painting (`shots/s1440q-02.png`). |

### B. Graphic design: average **2.0**

| # | Criterion | Score | Evidence |
|---|---|---|---|
| B1 | Idea | 3 | "A walk through Lana's night-garden almanac" can be said in one sentence, and the chapters follow it from gate to dawn. Lana likes the idea. The carry-through breaks in four places: the brand rooms become UI cards on wallpaper (s1440-05 to s1440-14), the posters sit on a lined web card, the products sit on neon pads, and the footer is a flat strip. |
| B2 | Composition | 2 | Only the cabinet (heading left, object right) and the contact letter have a clear first read. In the gate the glare of the glass bloom, the gate, the lilies and the name compete. A room is three columns of four similar-weight boxes, and the key visual is not the first thing you see. On the brands intro the eye lands on Lana's white sticker in the middle (s1440-04). |
| B3 | Colour | 2 | Purple holds the garden chapters, but each screen holds 3 to 8 hue families and saturation of 49 to 72. The painting covers the whole ground, so ground colour never dominates. The rooms bring in ten palettes plus a violet stained-glass arch that clashes with wine (Tabitayo), teal (NEOSTALGIA) and rainbow (TechnoRun). |
| B4 | Type | 3 | Redaction has character, and the name in the hero is the best typographic moment. The page uses four families plus typewriter-style mono labels. Pinyon Script appears four times, and twice it fails contrast. The brief's brand display faces are missing: every brand name is set in Redaction. In rooms the scale is weak, with five text levels in the title panel. |
| B5 | Image-making | 2 | At least eight rendering languages sit side by side: gouache scenes, photoreal props (cabinet, lantern, brass, gilt frame), a glossy 3D glass bloom, flat paper-cut flowers, a circular photo sticker with a scalloped edge, neon lily-pad textures, a stained-glass arch, AI brand backdrops and CSS chips. The cinema-sheet art shows its rectangular crop edge (s1440-17). |
| B6 | Space | 1 | No screen is empty on purpose. The calmest reaches 41%. Density never drops: rich, rich, rich for 24 screens. The poster board alone is 1,422 px of collage. |
| B7 | Finish | 1 | More than forty visible defects (section 4): clipped cards, empty grid cells, overlaps, hard seams, a "-2%" loader, a blank letter on arrival, a button under the route bar and a phone switch off-screen. |

### C. Movement: average **2.86**

| # | Criterion | Score | Evidence |
|---|---|---|---|
| C1 | Purpose | 3 | The gate swing, the sideways corridor and the letter flap all have a cause (the scroll) and carry meaning. The wisteria curtain moves on every seam yet tells nothing and covers content. The pads bob and the ribbon runs forever. |
| C2 | Amount | 3 | At rest the page is still: 0.0% change at six of eight positions. During scroll 18 to 29% of the pixels change per 30 px step, because several layers move at once (gate halves, name, lilies and the far plane). |
| C3 | Timing | 2 | Small transitions are right: 140 to 220 ms, eased. The large ones are wrong. "Open the gate" smooth-scrolls 1,980 px in under 300 ms, so the 1.6 s opening is never seen. Long trips flash blank night. Lazy images pop in after a room arrives (`inter/room-next-150.png`). The tour crawls at 12 px/s. |
| C4 | Scroll | 3 | The wheel is never hijacked, and the corridor follows it exactly. You do have to scroll 11 screens of pin to leave the brands. Each seam is a hard horizontal cut with wisteria pasted on top (s1440-02 at y 180, s1440-17 at y 140, s1440-22 at y 515). |
| C5 | Feedback | 3 | Hover lifts and a 0.98 press scale are on tiles, slides, pads and stamps, and "Copied #3d3858" works. Two main interactions report off-screen, though. Picking a film changes a sheet sitting 136 to 525 px above the viewport (`inter/films-tray-view.png`). Picking a pad changes a spread whose top is at 737 px (`inter/pond-click.png`). |
| C6 | Entrance | 2 | The loader shows "-2%" (`motion/load-00.png`), then the hero appears in one hard cut. The contact letter arrives as an empty box (`inter/talk-p000.png`). |
| C7 | Rest | 4 | When you stop scrolling, everything settles, apart from the pond bob (3.6%) and the ribbon (0.9%). |

---

## 3. Chapter by chapter

Each chapter lists what competes, where the eye goes, and what can go without losing content.

### 3.1 Gate (s1440-00, s1440-01; phone s390-00)

- **Competes (~16):** the name at 135 px, the glass bloom glaring inside "Denise", two mono label blocks, the lede, three buttons in three styles, a route bar of nine items plus the tour button and the switch, the iron gate, the moon, the glasshouse, three moths or butterflies, lilies in both lower corners, wisteria in both upper corners, and Lana's sticker.
- **Eye lands:** on the bloom glare and the broken word "D◆nise", then drops to the gate and the lilies. It should land on the name and then on one action. It does not.
- **Remove:** both mono label blocks; the "Plant a flower" button (planting can stay hidden as a delight); "Email Lana", which repeats "Contact"; one corner plane, either the front lilies or the wisteria; and the sticker.
- **Scroll:** half-way through the pin, the name stays at 40% opacity and slides under the see-through route bar (s1440-01), which looks like a mistake.

### 3.2 Seed cabinet (s1440-02, s1440-03)

- **Competes (~13):** the heading at 86 px, the script line, the lede, a second "Guided tour" button, the peek card, the cabinet with six labels, a duplicate Lana, the moon, the wisteria and the glowing stair lamps. On arrival a strip of the gate scene and a second Lana sticker are still visible above a hard seam at y 180 (s1440-02).
- **Eye lands:** on the cabinet, the one warm saturated object, then on the heading. This is the best composition on the page.
- **Remove:** the duplicate tour button, the script line and the extra Lana. Build the peek into the drawer itself.
- **Drawer hover:** the drawer front bumps 6% and a tiny paper moth peeks out (`inter/cab-hover-400.png`). Nothing slides out, and no sprout of the section's work grows as the brief asked. The real work only shows in the peek card at the bottom left, and on arrival that card is cut off at the bottom edge.

### 3.3 Glasshouse gallery: intro and 10 rooms (s1440-04 to s1440-14)

- **Intro competes (~12):** the heading, the lede, the glass button, a mono hint, a large Lana sticker in the middle of the screen, a dense glasshouse painting (plants, table, pots, ferns, butterflies) and the control bar with 10 dots.
  - The eye lands on the sticker.
  - Remove the sticker and the hint, and quieten the painting.
- **A room competes (~25 to 28):**
  - the route bar, the bay frame and the busy backdrop art;
  - the stained-glass arch and the key visual;
  - five swatches with hex labels in a box;
  - the title panel (counter, name, tagline, meta, rule and brief);
  - a board of 2 to 6 tiles plus "+n more";
  - the label card (Roles, 3 to 5 chips, Tools, 2 chips, a link);
  - the control bar (prev, count, next, 10 dots).
- **Eye lands:** on the title panel, the largest text in the middle, or on the loudest pubmat. The key visual is pushed into a side column and inside an arch, so it is never first, though it is the reason the room exists.
- **Remove:** the "Room n of 10" line (the bar already counts), the label card (fold roles into one line), the hex labels (show them on hover or copy), the arch on non-violet brands, and the box behind the swatches.
- **Layout:** it changes from room to room, three columns flipping left and right, so the eye relearns it ten times. Room 2 and room 6 have their label cards clipped by the bay edge (s1440-06, s1440-10). Room 2 and room 7 have holes in their tile grids. Missing from the brief: the brand display type, the physical mockups on a rail or easel, the "Next room" sign, the room lighting up with its door sliding open, and the "More from the archive" room.

### 3.4 Posters (s1440-15, s1440-16)

- **Competes (~22):** the heading, the script, two buttons, Lana, 12 taped posters and 4 sticky notes on a 1,422 px lavender ruled board with a 7 px white border.
- **Eye lands:** on CS Night, the largest top-left poster, then scatters. With no size hierarchy, the twelve read as equal.
- **Remove:** the notes, the sticker and the ruled lines. Show six posters large, with the rest behind "more".
- **The tidy layout itself overlaps:** "made in one night" covers the corner of Tech Ibig, and two poster pairs overlap. The board looks like a web card rather than a shed wall.

### 3.5 Films (s1440-17, s1440-18)

- **Competes (~10, then ~20):** the heading, the lede, Lana, the sheet painting (two trees, a canopy and a flower bed), the brass lantern, the beam, the still, the caption card, the button and 10 slides in a wooden box.
- **Eye lands:** on the still on the sheet. That is right.
- **The trouble:**
  - The slide box sits a full screen below the sheet, so choosing a film changes something you cannot see (`inter/films-tray-view.png`: the sheet sits at -525 to -136 px).
  - The still is a small thumbnail stretched to 750 px, and it looks blurred (`inter/films-pick-400.png`).
  - The sheet art shows its square crop: the leaf canopy is cut in a straight line at the top, and the art box shows at x 130 and x 1310 (s1440-17).
- **Remove:** the caption card box (set the caption on the night), the duplicate sticker, and the lantern or the beam.

### 3.6 Products (s1440-19, s1440-20)

- **Competes (~14, then ~18):**
  - the heading at 66 px and Lana;
  - four pads, each with a neon radial texture, a jar or a device, and a label;
  - tabs that repeat the pads;
  - a spread with the device, 4 to 6 thumbnails, text, a script tagline, chips and a button.
- **Eye lands:** on the glowing pads. The products themselves, the screenshots, are 60 to 150 px wide on them.
- **Remove:** either the pads or the tabs (both select the product), and the bell jars.
- **More trouble:**
  - The pads are cut by the bottom of the first view.
  - The spread starts at y 737 when the pads are centred, so a click on a pad changes something below the fold.
  - The left page of the spread has a double border, and its bottom edge dissolves into the wisteria.

### 3.7 About (s1440-21)

- **Competes (~22):** 9 tool stickers, the gilt-framed portrait, the heading, the bio, the open ledger and its pager, 3 stamps and their note, the education card and the "Tidy the stickers" button.
- **Eye lands:** on the gilt frame, then on the heading. That is acceptable.
- **The trouble:**
  - The ledger is 70% empty ruled paper, with two to four short lines on a whole spread.
  - "Tidy the stickers" overlaps the TypeScript sticker.
  - The stamps are three 124 px discs with text rotated and wrapped differently in each.
  - The education card scrolls under the wisteria and becomes unreadable (s1440-22).
  - The brief's almanac is not clickable.
- **Remove:** the stickers (use a simple tools line) and the stamps (use a three-line awards list). Make the ledger page carry all four roles at a readable size.

### 3.8 Contact (s1440-23, s1440-24; `inter/talk-p000` to `p100`)

- **Competes (~14):** "Bring the morning", the letter (heading, script, lede, two buttons, two links), the balloon with a tiny Lana, the ribbon marquee and a dense flower field.
- **Eye lands:** on "Let's talk". That is right, and this is the second-best screen.
- **The trouble:**
  - On arrival the letter is an empty lavender box with a darker band (`inter/talk-p000.png`). In mid-flip, "Let's talk" renders squashed and sheared (`inter/talk-p020.png`).
  - At the end of the page, "Bring the morning" slides under the route bar (s1440-24).
  - "Bring the morning" only lays a weak orange glow in one corner. The moon does not set (`inter/sun-500.png`).
- **Remove:** "Bring the morning" and the ribbon. The footer is a flat dark strip, against the brief's "no flat section".

---

## 4. Interactions (brief, section 5)

| Interaction | Works | Discoverable | Finished | Keep |
|---|---|---|---|---|
| Gate opens on scroll | Yes, scrubbed by the scroll. The halves rotate up to 78°, and the path and glasshouse show through (`inter/g-gate.png`). | Yes, you simply scroll. | Mostly. The name ghosts under the route bar. The brief's moths never scatter: the motes are unstyled and the moths are painted. | **Keep.** It is the best moment on the page. |
| "Open the gate" button | It scrolls to the cabinet (0 to 1,980 px). | The label does not say where it goes. | No. It jumps past the opening in under 300 ms with a blank frame (`inter/gate-open-100.png`). | Keep as "See the work"; let it play the opening. |
| Plant flowers (sky click and button) | Yes, capped at 16. | The sky click is hidden; the button is clear but odd. | No. Flat paper cut-outs land on the painted lilies. The stage widens to 1,528 px, and once the hero shifted about 40 px sideways and cut the label (`inter/plant-many.png`). | Cut, or keep hidden as a small delight. |
| Drawers (hover, click, Tab and Enter) | Yes. Hover updates the peek card; a click or Enter travels to the chapter. | Yes, the labels are clear. | No. It bumps rather than pulls out, the "sprout" is a moth, and the trip flashes blank night. | Keep the drawers as the contents page; fix the motion. |
| Room navigation (scroll, arrows, dots, keys) | Yes. "1 of 10" moves to "2 of 10" and so on. The dot to room 8 works. Arrow keys work only when focus is inside the section; with focus on the body they do nothing. | Prev, next and dots are clear. The hint line repeats them. | Partly. Images pop in after arrival. Fast scrolling back and forth settles correctly ("6 of 10", no errors). Resizing to 1000 and back re-syncs. | Keep the counter, prev and next. Shorten the walk. |
| Lightbox | Yes. It opens at the right item ("2 of 5"), ArrowRight steps, Tab stays inside the dialog, and Escape closes and returns focus to the tile. | Yes, everything looks clickable. | Yes. | **Keep.** |
| Swatch copy | Yes: "Copied #3d3858", and the clipboard holds `#3d3858`. | Low. Hex labels look like captions, not buttons. | Fine. | Keep, but fold it into fewer, smaller swatches. |
| Drag posters | Yes. A 250 × 180 px drag moves exactly that far, the poster lifts with a shadow, and a click opens the lightbox ("4 of 12"). Arrow keys move a focused poster (3% to 4.8%). | Nothing says the posters are draggable. | No. Double-click to tidy is not implemented. | Optional; it is not what Lana needs. |
| Tidy and Shuffle | Both work, with a 260 ms glide. | Yes. | No. After Shuffle, 22 poster pairs overlap and one poster is 96% hidden (`inter/wall-shuffle.png`). Even the tidy layout has 2 overlapping pairs. | Cut Shuffle; make the tidy layout clean. |
| Pick a film (click and drag) | Clicking a slide changes the sheet (Breaking Barriers to BaSICK Math, 220 ms crossfade and a flicker). | Yes. | No. The sheet is off-screen while you pick, the still is blurred, and the drag only works if the sheet is in view. | Keep the idea, with the sheet and the box in one view. |
| Lily pads and tabs | Yes. The pad sets the spread (0010), tabs take ArrowRight, Home and End, thumbnails swap the screenshot, and the device opens the lightbox. | Pads yes, tabs redundant. | No. The spread changes below the fold, the ripple is faint, and nothing lifts the jar. | Keep one selector (tabs or pads), not both. |
| Ledger pages | Yes. "1 of 4" goes to "2 of 4" with a 120 ms fade. | Yes. | The pages are 70% empty, and there is no page-turn. | Keep only if each page is full; otherwise make a plain list. |
| Stickers | Drag works (150, 250), arrow keys and Tidy work. | Yes. | The Tidy button overlaps a sticker. | Cut; tools are a line of text. |
| Stamps | Yes. The note reads "Won first runner-up at the GCash ImaGnation…". | Yes. | The discs are uneven. | Make a list. |
| Letter | It unfolds with the scroll and then reads well. | Passive. | No. It is an empty box on arrival and squashed in mid-flip. | Keep the final letter and drop the flap. |
| Balloon | It rises with the scroll. You cannot click it. | Not interactive. | Lana in the basket is 30 px. | Optional. |
| "Bring the morning" | It toggles a warm overlay. | Yes. | Barely visible. No moon set. It slides under the route bar at the end. | Cut. |
| Guided tour | It starts and the label changes to "Pause tour". The wheel stops it. | Yes, in the route bar and again in the cabinet. | **Broken in practice.** It moves about 12 px/s (16 to 128 px in 10 s). `scroll-behavior: smooth` on `html` (almanac.css:48) swallows its per-frame `scrollBy`, so the page would take about 30 minutes. It makes no 4 s stops. | Rebuild as chapter-by-chapter jumps. |
| Quiet mode | Yes. Switching mid-corridor keeps you in the brands (8100 to 8093 px). It is remembered and turns on by itself for reduced motion. | Yes. | The brands intro sits on a blown-up, blurred glasshouse (`shots/s1440q-02.png`). On phones the switch is half off-screen. | **Keep.** |
| Keyboard | The Tab order is logical: skip link, route bar, gate, cabinet, rooms. Focus follows into the pinned rooms after the smooth scroll ("2 of 10" for a swatch in room 2). Focus rings show. | | Each room adds 9 to 12 tab stops (5 swatches, tiles, link), so 10 rooms cost more than 100 Tabs. | Keep; fewer stops per room. |

---

## 5. Contrast (WCAG)

**Method.** Text was hidden, the page re-captured, and the pixels inside each text box sampled. "Worst" is the 5th-percentile contrast of the text colour against those pixels; "median" is the typical value. The full tables are in `contrast/contrast-1440.json` and `contrast/contrast-390.json`.

| Where | Text | Size | Worst / median | Needed | Result |
|---|---|---|---|---|---|
| Gate | "Almanac no. 01…" labels | 14 px | 2.41 / 8.75 | 4.5 | **Fail** (wisteria behind) |
| Gate | "Manila, Philippines / Open to work" | 14 px | 2.52 / 7.04 | 4.5 | **Fail** |
| Gate | Lede | 21 px | 2.65 / 12.40 | 4.5 | **Fail** on 8% of the box (the moon) |
| Gate | "Email Lana" line button | 16 px | 1.69 / 8.40 | 4.5 | **Fail** (gate ironwork through the button) |
| Gate | "Denise", the letters under the glass bloom | 135 px | 1.40 / 10.34 | 3.0 | **Fail** |
| Cabinet | All text | | ≥ 5.5 | | Pass |
| Brands intro | All text | | ≥ 7.7 | | Pass |
| Room 1, ACM Revival X | Panel text | 14 to 49 px | 18.05 | 4.5 | Pass |
| Room 3, NEOSTALGIA | Panel text | | 6.18 | 4.5 | Pass |
| Room 5, Rock of Aces | Panel text | | 13.93 | 4.5 | Pass |
| Room 7, TechnoRun | Panel text | | 6.82 | 4.5 | Pass |
| Room 10, Techno Week | Panel text | | 5.72 | 4.5 | Pass, narrowly |
| Posters | Heading under the route bar | 86 px | 2.96 | 3.0 | **Fail** while passing under it |
| Films / products | Headings under the route bar | 66 to 86 px | 1.00 | 3.0 | **Fail** while passing under it |
| Products | "calmer clinical screening", all four taglines | 46 px | 1.82 / 1.82 | 3.0 | **Fail**: lilac `#b9a2ff` on paper |
| About | Tool stickers and ledger | 14 to 31 px | ≥ 5.2 | | Pass |
| About and contact seam | "Bring the morning" over wisteria | 16 px | 2.62 / 9.71 | 4.5 | **Fail** |
| About and contact seam | Education card under the curtain | 16 to 24 px | not measurable | | **Fail** by eye (s1440-22) |
| Phone gate | "Denise" under the bloom | 66 px | 1.47 | 3.0 | **Fail** |
| Phone about | "Tidy the stickers" on a sticker | 16 px | 1.11 | 4.5 | **Fail** |

**What this means.** The rooms pass only because every word sits on an opaque panel in the brand's darkest colour. That is also why they read as boxed UI on wallpaper rather than as a brand-book page.

---

## 6. Phone (390 × 844)

- **Length:** 30.4 screens. The brands alone take 16.8, ten stacked rooms of about 1.7 screens each (s390-04 to s390-20). The first room's key visual sits 4.4 screens down.
- **Busyness:** median calm 7, busy 59, the busiest numbers measured anywhere. Every screen is either a painting or a tile wall.
- **Route bar:**
  - It holds moons only, with no labels.
  - The quiet switch spans x 370 to 434, so it is half off-screen (`shots/phone-bar.png`).
  - The bar is 370 px wide, and its ends cut the page content beneath it.
- **Wisteria over content:** the curtain sits over the product spread ("Visit the live site" under flowers, s390-27), the education card (s390-29) and the room-10 label card (s390-21).
- **Overlap:** "Tidy the stickers" sits on top of the TypeScript sticker (s390-28, contrast 1.1:1).
- **Gate:** the hero is legible (s390-00), but the bloom still breaks "Denise".
- **Contact:** the letter is good once open (s390-30). The balloon is clipped by the ribbon.
- **Verdict:** the brands, the films box and the pads are the desktop layout collapsed into a column, not a phone design.

---

## 7. Defect list

Paths are relative to the evidence folder. "y" is scrollY at 1440 unless noted.

| # | Chapter | y (px) | Defect | Screenshot |
|---|---|---|---|---|
| 1 | Loader | 0 | The loader reads "-2%". `performance.now()` is taken after the first rAF timestamp. | motion/load-00.png |
| 2 | Load | 0 | The hero appears in one hard cut. Nothing animates in. | motion/load-01.png |
| 3 | Gate | 0 | The glass bloom covers the "e" of Denise (1.4:1). | shots/s1440-00.png |
| 4 | Gate | 0 | The "Email Lana" line button is transparent over the ironwork (1.7:1). | shots/s1440-00.png |
| 5 | Gate | 0 | The mono labels sit on wisteria (2.4:1). | shots/s1440-00.png |
| 6 | Gate | 900 | The name ghosts at 40% opacity under the see-through route bar. | shots/s1440-01.png |
| 7 | Gate | 0 | The 14 motes are unstyled (`g-motes` against `.motes`), so they are invisible. | code: ch-gate.js:36, almanac.css:234 |
| 8 | Gate | 0 | After many plants the stage widens to 1,528 px. The hero shifted about 40 px and cut the labels. | inter/plant-many.png |
| 9 | Gate and cabinet | 1800 | A hard horizontal seam at y 180, with the gate strip and a second Lana sticker showing above it. | shots/s1440-02.png |
| 10 | Cabinet | 1800 | The peek card is cut off at the bottom of the screen. | shots/s1440-02.png |
| 11 | Cabinet | 2700 | Drawer hover bumps the front; nothing pulls out and no work sprouts. | inter/cab-hover-400.png |
| 12 | Travel | any | A long smooth scroll shows blank night frames. | inter/cab-click-400.png, inter/gate-open-100.png |
| 13 | Brands intro | 3600 | Lana's sticker is the focal point of the screen. | shots/s1440-04.png |
| 14 | Room 1 | 4500 | The key visual sits low in the arch, and the top of the arch opening is empty. | shots/s1440-05.png |
| 15 | Room 2 | 5400 | The label card is cut by the bay edge and the control bar (the Tools chips are halved). | shots/s1440-06.png |
| 16 | Room 2 | 5400 | Five tiles in two columns leave a hole. | shots/s1440-06.png |
| 17 | Room 6 | 9000 | The label card and the palette panel are both clipped at the bottom. | shots/s1440-10.png |
| 18 | Room 7 | 9900 | Four tiles in three columns leave two holes. | shots/s1440-11.png |
| 19 | Rooms 3, 4, 7, 10 | 6300 to 12600 | The violet stained-glass arch clashes with teal, wine, rainbow and pastel palettes. | shots/s1440-07, 08, 11, 14 |
| 20 | Every room | 4500 to 12600 | Three card treatments per room: a 20 px translucent panel, a 4 px white label and a 20 px tile board. | shots/s1440-05 |
| 21 | Every room | 4500 to 12600 | The counter appears twice ("Room 1 of 10" and "1 of 10"). | shots/s1440-05 |
| 22 | Rooms | in travel | The key visual and the tiles are blank for about 150 ms after arrival (lazy images pop in). | inter/room-next-150.png |
| 23 | Room 8 | 10800 | "Kulay / PACSA 2025" breaks awkwardly across lines. | shots/s1440-12.png |
| 24 | Room 10 to posters | 12600 to 13500 | Wisteria crosses the control bar, and the brands control bar then rides under the route bar at the posters' top. | shots/s1440-14.png, inter/wall-shuffle.png |
| 25 | Posters | 13500 | The tidy layout overlaps: the note covers Tech Ibig, and two poster pairs overlap. | shots/s1440-15.png |
| 26 | Posters | 14400 | An empty ruled band at the foot of the board, which reads as a web card. | shots/s1440-16.png |
| 27 | Posters | after Shuffle | 22 overlapping pairs; one poster is 96% hidden. | inter/wall-shuffle.png |
| 28 | Films | 15300 | The sheet art shows its rectangular crop (the canopy cut straight at the top, the box edges at x 130 and x 1310). | shots/s1440-17.png |
| 29 | Films | 15300 | The heading slides under the route bar (1.0:1). | contrast/c1440-films.png |
| 30 | Films | 16200 | The still on the sheet is an upscaled thumbnail and looks blurred. | inter/films-pick-400.png |
| 31 | Films | 16200 | The sheet is off-screen while you pick from the slide box. | inter/films-tray-view.png |
| 32 | Products | 17100 | The lily pads are a neon radial render in another style, and the pad labels are cut by the viewport. | shots/s1440-19.png |
| 33 | Products | 18000 | The script taglines are lilac on paper (1.8:1). | shots/s1440-20.png |
| 34 | Products | 18000 | The spread's left page has a double border, and its bottom edge dissolves into the wisteria. | shots/s1440-20.png |
| 35 | Products | 17500 | Picking a pad changes a spread below the fold. | inter/pond-click.png |
| 36 | About | 18900 | The ledger spread is 70% empty. | shots/s1440-21.png |
| 37 | About | 18900 | "Tidy the stickers" overlaps the TypeScript sticker. | shots/s1440-21.png, s390-28 |
| 38 | About | 18900 | The stamp text is rotated, sized and wrapped differently on each disc. | inter/stamps-click.png |
| 39 | About and contact | 19800 | The education card lies under the wisteria curtain and cannot be read. | shots/s1440-22.png |
| 40 | Contact | 19800 to 20100 | The letter arrives as an empty box; in mid-flip the heading is squashed. | inter/talk-p000.png, talk-p020.png |
| 41 | Contact | 21045 | "Bring the morning" slides under the route bar. | shots/s1440-24.png |
| 42 | Contact | 20700 | "Bring the morning" barely changes the sky, and the moon stays. | inter/sun-500.png |
| 43 | Footer | 21045 | A flat dark strip. | shots/s1440-24.png |
| 44 | Everywhere | all | Lana appears 9 times as the same 100 px circular photo sticker with a scalloped edge. It reads as a placeholder; the brief asked for six paper-cut poses. | shots/s1440-00 to 24 |
| 45 | Quiet mode | 900 | The brands intro sits on a giant, blurred crop of the glasshouse painting. | shots/s1440q-02.png |
| 46 | Phone | all | The quiet switch is half off-screen (x 370 to 434 of 390), and the route bar has no labels. | shots/phone-bar.png |
| 47 | Phone | several | The wisteria curtain covers the product spread, the education card and a room label. | shots/s390-21, 27, 29 |
| 48 | Tour | all | It moves about 12 px/s, so the whole page would take about 30 minutes. | (verify.py output) |

---

## 8. What is genuinely good and must be kept

1. **The idea and the route.** The page is a night garden walked from gate to dawn, with a cabinet as the table of contents. Lana likes it, and it is a sentence.
2. **The scroll-scrubbed gate.** Two iron halves swing on real hinges and reveal the glasshouse path (`inter/g-gate.png`). Of everything on the page, this best does what the brief asked.
3. **The painted scenes.** The hero garden, the flower stair, the attic and the dawn field are well made and on-brand. Used quietly, they are the asset.
4. **The cabinet as contents.** It is the best composition: heading left, one object right. The peek card showing real work on hover is a good idea.
5. **One brand per room with its own backdrop and real pubmats.** The structure answers Lana's "each branding has its own background". It also has a working counter, prev/next and dots, and room text that passes AA (5.7 to 18:1).
6. **The shared lightbox.** It steps with arrows, closes on Escape, keeps Tab inside the dialog and returns focus.
7. **Quiet mode.** It is remembered, honours reduced motion, keeps every interaction, and switches mid-corridor without losing your place.
8. **Stillness at rest.** Six of eight positions show 0% idle motion.
9. **The finished contact letter.** "Let's talk" with a script line, one glass action, "Copy the address" that turns into "Copied", and two links.
10. **Clean plumbing.** No console errors, no horizontal overflow at 1440 or 390, and a logical Tab order with a skip link.

---

## 9. What a redo must change (ranked)

1. **Halve what is on every screen: one focal object per screen, with the painting pushed back (darkened, softened or cropped to a calm half).**
   The median screen is calm 23 / busy 38 against Lana's references at calm 46 to 92 / busy 0 to 25, and that gap is "too overwhelming".
2. **Put real work on the first screen, or one scroll from it, for example by letting the cabinet or a key visual live in the hero.**
   Today the first piece of work is 4,500 px or two clicks away, and the route bar's "Branding" lands on a panel with no work.
3. **Rebuild each brand room as one composed sheet: the key visual large, three or four pubmats, one caption line, and no boxed panels, label card or arch.**
   A room now holds 25 to 28 items in three card styles, with clipped label cards, holes in the grids and an arch that clashes with six of the ten palettes.
4. **Shorten the journey to about 10 to 12 screens on desktop: brand rooms at about half a screen each, or pages you step through without an 11-screen pin.**
   The page is 24.4 screens on desktop and 30.4 on a phone, where the brands alone take 16.8. Nobody reaches the contact letter.
5. **Choose one image language, gouache painting plus Lana's real work, and repaint or drop the photoreal props, the glass renders, the neon pads, the stained arch and the circle stickers.**
   Eight rendering styles side by side read as a collage of assets, not one world, and this mixture is most of what makes it look unfinished.
6. **Remove the wisteria curtain passages, or keep them strictly away from text, and blend seams instead of cutting them.**
   The curtain covers the education card, the product spread and phone content, and every seam shows a hard horizontal edge (y 180, 140, 515).
7. **Do a finish pass on every item in the defect list before showing anything: the loader, the empty letter, the clipped cards, the overlaps, the route-bar collisions, the image pop-in and the art crop edges.**
   These small breaks are exactly what Lana means by "rushed", and there are 48 of them.
8. **Make every interaction show its result in the same view: the sheet and the slide box together, the product page replacing the pads in place, the letter readable on arrival.**
   Today the film sheet sits up to 525 px above the screen when you pick, and the product spread starts at 737 px, so the main interactions look like they do nothing.
9. **Rebuild the guided tour as stop-by-stop jumps with a 4 s pause and a visible Pause, and remove `scroll-behavior: smooth` from its path.**
   At 12 px/s it is broken, and it is the plain path for people in a hurry.
10. **Make the route bar solid and give phones a labelled bar that fits inside 390 px.**
    Headings pass under the see-through bar at 1.0:1, and the phone quiet switch is half off-screen.
11. **Use one component system: three radii, one shadow, one paper colour, one button per role, and no duplicates (one tour button, one counter, tabs or pads, not both).**
    The page shows ten radii, nine button kinds and duplicated controls, which reads as pieces built separately.
12. **Fix the contrast failures: the hero labels, the "Email Lana" line button, the product taglines, "Bring the morning", and the letters hidden by the bloom.**
    They measure 1.4 to 2.65:1, below the AA rule Lana set herself.
13. **Make Lana one well-made paper-cut figure in two or three chosen places, not the same 100 px circle sticker nine times.**
    The repeated sticker reads as a placeholder and often becomes the focal point, as on the brands intro.
14. **Compose the entrance once: the name settles, then the gate, then one action, within 1.2 s, with no percentage counter.**
    Today the loader shows "-2%" and the hero arrives in one hard cut.
15. **Give quiet mode a proper still scene per chapter, fitted to the section rather than stretched across a nine-screen stack.**
    The quiet brands intro sits on a giant blurred crop of the glasshouse, and quiet mode is the version a hurried recruiter may see.
