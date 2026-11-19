# Research A: how three portfolios carry the hero's world through every section

Studied 2026-11-17 in headless Chrome (Playwright) at 1440×900 and 390×844 (touch). Every section was scrolled with the mouse wheel in small steps; scroll effects were captured as ten 30 px wheel steps; hovers were shot at about 0–150, 400 and 800–1000 ms; clicks and drags were filmed (webm, frames pulled with cv2). All descriptions come from screenshots I looked at; DOM numbers (sizes, fonts, transforms, blend modes) are added where they help. Things I infer rather than saw are marked *(inferred)*.

This file does not repeat `docs/v3/research-picks.md`; it goes section by section and interaction by interaction.

Evidence: `C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v5\{adya,sudarvel,chi}\` (contact sheets are the `x-*.jpg` files, scroll-video sheets are in `vf\`). Scripts are in `...\scratchpad\v5\_a\`.

---

## 1. Adya Srivastava — adyasrivastava.framer.website

### The thread
The hero sets up "Adya's cosmos" with a painted girl floating in it. The girl is pinned to the screen while the painted world scrolls past beneath her, so the scroll reads as her journey down: from space, down a staircase of clouds, to a giant hand and "You've arrived." After a torn-paper edge, the works are named as celestial bodies ("Planet C", "Comet A") in a black starfield, and the starry, glowing language carries on into the about and contact sections.

### Section by section

**S1. Hero, "Adya's cosmos" (0–~600 px).**
- On screen: a full-bleed painted night sky (indigo `#1b1f5c` to violet) with five glossy planets and shooting stars. The title is a chrome-script lockup in a 1284×649 video layer (`mix-blend-mode: screen`) about 1,150 px wide. The girl in the orange dress is a separate 443×404 transparent video at x 499, y 90 (`position: sticky`, `mix-blend-mode: lighten`).
- Nav: a fixed 64 px bar with a monogram and "ADYA SRIVASTAVA", then four 224 px cells divided by hairlines: "THE UNIVERSE", "ABOUT ME", "THE LIFE BEYOND", "CONTROL ROOM" (14 px DM Mono capitals, white at reduced opacity). The bar has a 12 px backdrop blur.
- **Title idle loop:** the chrome letters keep breaking into pixel blocks (a blocky dissolve, like a bitmap glitch), vanishing almost completely, then reassembling. One cycle takes a few seconds and it never stops.
- **Cursor:** a comet trail, a straight line 300–500 px long that points back along the direction of travel. Its head is white and the tail shifts to blue, violet and pink as it fades over about 0.6–1 s. It shows on every section, so the cosmos follows the pointer down the whole page.
- **Hover on a nav cell:** the cell darkens to a solid navy tab and drops about 16 px below the bar, like a pulled-down tag, and a "↗" appears at its right edge. It is complete by 100 ms. Hovering "ADYA SRIVASTAVA" turns the text violet.
- **Hover on the monogram:** a frosted, rounded bio card (about 190×170 px) fades in under it within 100 ms: "Adya S. or 'Vill', is a young graphic designer, stepping into the visual world…".
- **Scroll (first 300 px):** the title lifts and dissolves away (gone by about 270 px). The girl stays where she is, because she is sticky, while the planets slide up under her, so she now looks as if she is standing on a planet's rim. The caption "Leaving the surface…" rises into view.

**S2. The descent (~600–2,400 px).**
- On screen: one tall painting split into stacked layers: a planet horizon, a winding white-and-pastel staircase through pink, blue and orange clouds, and a particle canvas (1441×3464, `position: absolute`) for twinkling dots. Captions are `<mark>` elements in 50 px Instrument Serif, white, centred: "Leaving the surface…" and "Gathering the fragments...".
- **Scroll:** each layer has its own small parallax offset, linear in scroll. At scrollY 936 and 1296, the cloud and staircase layer lags by +0.08× (+75 px, then +104 px), the horizon layer leads by −0.03×, the far planet layer leads by −0.1× (−94, then −130 px), and the particle canvas lags by +0.06×. Captions move at page speed. The girl stays pinned at y 90, so she appears to walk down the staircase as the stairs flow up beneath her.
- **Echo of the hero:** the same girl, the same painter's palette and the same planets; the hero is literally the top of this painting.
- **Phone (390):** the painting is a single column with the girl at the top, plus the line "Finding my true form…". The work section is replaced by "To see my universe more closely, meet me on a larger screen."

**S3. "You've arrived." (~2,400–4,100 px).**
- On screen: a lighter, warmer scene with a giant lavender painted hand reaching up, orange-and-pink lilies, spirals and dotted swirl lines. "You've arrived." is a 50 px serif caption. Under it is the "ENTER UNIVERSE" pill: 393×75 px, fully rounded, deep indigo with a lighter rim, 24 px DM Mono capitals.
- **Scroll:** the pill is sticky. It stays near the top of the screen (y ≈ 160) while the hand and lilies scroll up beneath it, for about 1,300 px of scroll. Three 366×212 canvases ride with it (one blurred at opacity 0). They are probably a shimmer or glow layer *(inferred)*.
- The girl fades out here *(inferred cause: `lighten` blending against a pale background makes her invisible)*.
- **Hover on the pill:** no visible change in my captures.
- **Click:** `href="./#world"`. In my run it scrolled the page smoothly back to y 0 (the hero), in about 1.5 s.

**S4. Torn-paper edge (~4,100–4,300 px).**
- On screen: a 1440×129 canvas with a ragged torn-paper edge. Below it the ground is near-black `#050112` with small white stars.
- **Scroll:** the black rises over the painting like a page being torn away. Over ten 30 px steps it climbs from the bottom of the screen to about a third of the way up.

**S5. "Featured Works" (~4,300–7,400 px).**
- On screen: the title "Featured *Works*" in 90 px Instrument Serif ("Works" italic, white), flanked by two large cream eight-point sparkle stars (273 and 310 px images, rotated 60° and −112°). Behind it sits a sticky 1169×616 canvas, a starfield *(inferred)*.
- **Pinned title:** the title, the stars and the canvas are all `position: sticky` (title at y ≈ 313–398). The project cards scroll up over them. Once a card covers the title, the title gets `filter: blur(6px)` and the stars `blur(5px)`, so the heading sinks behind the passing work like a distant constellation. The title also carries a `matrix3d` perspective transform.
- **Cards** (zig-zag; one card about every 480 px of scroll):
  - Each card has a small mono label above the image naming it as a body in the sky ("CONSTELLATION A", "PLANET C", "PLANET B", "COMET A", "PLANET D"; 14 px DM Mono capitals).
  - The image is 653–760 px wide and 295–333 px tall, with a slight `perspective(1200px)` 3D transform.
  - Under the image: two dark pill chips ("DESIGN PROJECT", "UNIVERSAL DESIGN"; 14 px DM Mono).
  - Then the title in 44 px Instrument Serif italic with `mix-blend-mode: difference`, and an "↗" at the right.
  - Card x positions alternate: 365, 135, 366, 135 and 399.
  - Projects: Landor India, KitKat Gifting Portfolio, Haldiram's Rakhi 2025, Yours Truly, Love – The Book, Kaithi – A Calligraphy Manual. The first three link to `./404`, the others to `./love` and `./kaithi`.
- **Card hover** (done by 100 ms): the image insets slightly (about 10% shorter), takes about 12 px rounded corners, a 2 px violet (`#9a7bf2`) border and a soft violet outer glow of about 20–30 px. The chips and title move up with it, and the arrow grows and turns violet. The comet cursor drawn across the card adds to the effect.

**S6. "More about *myself*" (~7,400–8,000 px).**
- On screen: a panel on `#050112` with a faint fine grid (a graph-paper line pattern) and hairline rules above and below.
  - Left: the heading (44 px Instrument Serif, "myself" italic), then 16 px DM Sans body ending "each entry a star in my creative sky", then two outline pills, "Know More" (folder icon) and "My Resume" (document icon).
  - Right: a 578×345 photo in a dark rounded frame, black and white, with a violet glow pooled beneath it. A chrome iridescent heart sticker (about 120 px) overlaps its left edge, and two cream sparkle stars sit at its top-right corner.
- **Photo hover:** it turns from black and white to full colour by 100 ms. The site's own words describe this effect: "each entry a star".
- **Button hover:** the icon shifts slightly; there is no fill change.
- **Echo:** the same sparkle stars and violet glow as the cards, and the same chrome material as the hero title (the heart).

**S7. Contact and footer (~8,000–9,144 px).**
- On screen: "This is me, so far." (16 px italic between two hairlines), then "Let's Stay *Connected*" (44 px serif), a one-line note, and a "Contact Me" pill with a star icon. All of it sits on a large radial violet glow centred behind the text.
- Below: a four-cell social grid (about 240×118 px cells with hairline borders) for Instagram, Behance, LinkedIn and Substack, each a white line icon. Then the email address, and a footer: "© 2026 Adya Srivastava", "Portfolio | 2020 - 2026", "Built with love, in Framer".
- **Social cell hover** (by 100 ms): the white outline icon becomes the brand's full-colour tile (Behance blue, the Instagram gradient, LinkedIn blue, Substack orange) and rises about 10 px. The network's name appears under it, and the cell fills with a twinkling dot-matrix of tiny stars.
- **Contact Me hover:** the label and arrow shift.
- **Back-to-top:** a fixed 60 px violet (`#7b48ff`) circle with a chevron at the bottom centre, on every screen. A click scrolls smoothly to the top (8,244 → 0 in about 1.2 s, easing out: 4081, 3630, 598, 63, 9, 0 at 250 ms intervals).

### Section transitions
1. Hero to descent: the title dissolves while the girl stays pinned. **A shared character travels.**
2. Descent to arrival: one continuous painting with three caption stops. **No cuts.**
3. Arrival to works: the sticky button holds while the scene scrolls, then a **torn-paper edge** drops a black ground over it. A hard change of material.
4. Into the works: a **pinned title that blurs** as the cards pass over it.
5. Works to about: hairline rules plus the faint grid. The ground and the sparkle stars carry over.
6. About to contact: a **radial glow** grows behind the contact heading.

### Content presentation
- Work items are heavenly bodies. The label above each image ("PLANET C", "COMET A") turns the list into a star map. Each card glows when touched, like a body catching light.
- The About is a framed, glowing memory: a black-and-white photo that wakes to colour, decorated with a chrome heart sticker and stars.
- The nav cells are part of the world ("The universe", "Control room"), and the logo opens a small bio card on hover.
- The footer is a constellation of four cells that light up in their brand colour inside a star-dot field.

### What makes it feel rich, not plain
1. **A pinned character over a moving world.** A sticky transparent video of the protagonist, with the painted scene scrolling under it, turns plain scrolling into her journey.
2. **A pinned section title that blurs as content covers it.** Use `position: sticky` plus `filter: blur(6px)` once the first card overlaps it; the stars blur 5 px with it.
3. **Five-layer parallax with very small factors** (−0.1× to +0.08×). Depth without nausea.
4. **A torn-paper edge as a section divider.** A canvas or SVG with a ragged top edge in the next section's colour, rising over the painting.
5. **A cursor comet trail.** A 300–500 px line from the pointer, white at the head and fading through blue and violet in about 0.8 s, so the world follows you into every section.
6. **Wake on hover.** Black-and-white to colour (the about photo), outline to brand colour plus a star-dot field (the socials), a glow border (the cards). The same verb, "light up", is used everywhere.
7. **Names from the world** for every label: project labels, nav and captions.
8. **One material repeated:** chrome or iridescence in the title, the heart sticker and the sparkle stars, with a violet glow under every focal object.

---

## 2. Sudarvel K — sudarveldesignportfolio.framer.website

### The thread
The hero is a retro-hardware collage in a blue sky: a CRT that "scans" his portrait, gadgets tagged like an object-detection feed ("Digital watch 71%"), a filing-drawer stack of his process, and a headline whose "Build." is assembled from circuit parts with a tiny robot perched on it. Every section below reuses those exact pieces: the same sky, project posters of retro gadgets, a second title built from hardware letters that break apart when clicked, books opened with cassette-deck controls, and the same robot wandering the whole page.

### Section by section

**S1. Hero, "Design. Build. Tell Stories." (0–~880 px).**
- On screen: a blue-sky photograph with clouds (`#56a8ce` to `#9ec4d7`).
  - A frosted nav pill (about 760×34 px, fixed, top centre) holds "K Sudarvel / Product Designer" on the left and the email, Resume and LinkedIn on the right.
  - Corner labels in 11 px Geist Mono, white: "+ NO. 001 — PORTFOLIO ISSUE" and "CHENNAI, IN — PRODUCT DESIGNER +".
  - A ticker chip: "currently: …" in 13 px Geist Mono, white, on a hairline box with a green dot.
  - The headline: "Design." in 88 px DM Serif Display, white. "Build." is an image of letters made of electronic parts (a CRT "B", speakers, circuit boards) with a hand-drawn lime underline. "Tell Stories." is 100 px Cormorant Garamond italic.
  - One line of intro in 16 px Inter, with lime highlighter chips on "every problem" and "design".
- **Ticker:** types out a phrase with a lime block caret, holds, deletes, types the next ("designing for humans", "prototyping in Figma", "shipping t…", "building with AI"). About 1.5–2 s per phrase.
- **Floating gadgets left and right** (about 150–200 px each): every ~0.7 s each slot swaps to another object (paper sheets, a Walkman, a Game Boy, an iPod, a digital watch, a cassette recorder, a CRT radio). Each object sits inside a lime object-detection box (a 1 px lime frame with corner ticks, slightly rotated) and carries a lime tag with a label and a confidence score ("Wrist TV 78%", "Voice recorder 92%", "Feedback 77%").
  - Under the left slot: "ideas never stay on one page ↗" (15 px white).
  - Under the right slot: "loading curiosity…" with a thin progress bar and a mono status line under it.
- **CRT:** a beige 1980s monitor (410×340) whose screen shows his halftone portrait.
  - Lime corner brackets frame the screen, with a tag "ID · SUDAR".
  - A status chip cycles "SCANNING ▬ 32%", then 44%, then "✓ DESIGNER 99.9%" over about 3 s, then repeats. A green scan bar sweeps over the face.
- **Drawer stack** (bottom-left, 324×216 image): four wooden drawers labelled Research, Design, Iterate and Impact, tangled in a cable. A cream note above reads "MY PROCESS · 4 DRAWERS / Pull a drawer to open it ↓".
  - **Hover on a drawer** (by 150 ms): that drawer slides out about 8 px, its small LED turns green, and the note text changes:
    - "01 · RESEARCH — Listen first. Find the real problem."
    - "02 · DESIGN — Shape ideas into flows people get."
    - "03 · ITERATE — Test, learn, refine. Then again."
    - "04 · IMPACT — Ship it, and measure what changed."
  - Moving off restores "Pull a drawer…".
- **The robot:** a 31×46 px figurine (`position: fixed; pointer-events: none`). It stood on top of "Build." for about 4 s, then flew off across the page (positions (847,147), then (715,18), then (421,39) within 0.5 s) and later perched on cards and the nav. It did not follow the pointer in my samples. It appears on every section and on the /resume page.
- **Tabs at the hero's bottom edge:** a dark tab bar, "● DESIGN PROJECTS 04 | ● BUILD EXPERIMENTS 01" (12 px Geist Mono). The active tab is cream with a lime dot. It sits on the hero like a folder tab sticking out of the collage.

**S2. Work grid (~880–2,250 px).**
- On screen: a two-column grid of 685×542 cards on the same pale sky gradient.
  - Each card is a white rounded panel.
  - The image is a 668×452 poster collage built for the project, using the hero's vocabulary of retro hardware in halftone: an old PC for OncoSmart, a Nokia phone for attendance, an SD card for exam scheduling, a CRT for the AI assistant.
  - A year chip ("2025") sits at the top-left of each image.
  - Below the image: an outcome title (18 px Geist medium) and tag chips (13 px).
- **Card hover:** the title line is replaced by "See What I Built" by about 250 ms. The NDA card shows "Under NDA - Please email me for details." instead.
- **Tab click "Build experiments":** the grid swaps instantly to one card, "SAMAYAL" (an old pager on a banana leaf with idli and dosa: "Designing a meal planner…"). Its hover text is "See the experiment". The page shortens from 3,413 to 2,872 px.
- **Echo:** the same sky, the same hardware props, the same lime accents; the robot sits on card edges.

**S3. "The *MAKING* of experiences" (~2,250–3,413 px).**
- On screen: on flat sky blue (`#58a6cd`), the title.
  - "The" is 80 px Cormorant Garamond italic, white.
  - Then "MAKING of" and "experiences" in hardware-part letters (each a 66–79×80 px div of photographed parts, with a `drop-shadow`). The robot is part of the "M".
  - Side copy at left and right in 17 px Cormorant Garamond italic: "From college stages to buildathon wins — a shelf of moments…" and "Seven covers, seven chapters. Click the book in the centre…".
  - Handwritten notes: "real devices / real stories" and "assembled from memories".
  - A pill: "CLICK ANY LETTER TO POWER IT ON" (13 px VT323).
  - A lime tag that types in: "THAT SHAPED THE DESIGNER".
- **Scroll entry:** the letters assemble one at a time, like typing ("The", then "The M…", then "The MAKIN…"), over about 3 s as the section enters. Each letter arrives from blur with a drop-shadow. Then the lime tag types in.
- **Click a letter:** it bursts into its parts, which scatter about 20–40 px with green sparkle dots, then snap back within about 1 s. A lime tag pops above it naming a UX term with that initial: "M · MENTAL MODEL", "A · AFFORDANCE", "K · KEY TASKS", "I · INTERVIEWS", "N · NAVIGATION".
- **Bookshelf:** a WebGL canvas (1440×1027, `cursor: grab`) showing seven book covers (about 300×420 px each) in a curved 3D cover-flow, each a collage about one chapter ("The Art…", "New Ground", "Design Build Tell Stories", "Design Events", "Finding Direction", a CRT "Loading my reality"). Bottom-left: a barcode with "THE MAKING OF — 001/007" and "SCAN · OPEN · FLIP →" (11 px mono).
  - **Idle:** the ring kept turning while the pointer rested near the right edge, but was almost still with the pointer at the bottom centre *(possibly steered by the pointer; not confirmed)*.
  - **Drag:** grabbing and pulling 440 px left rotated the ring about one cover.
  - **Click a side book:** the ring rotates to bring it to the centre in about 400–800 ms.
  - **Click the centre book:** a full-screen reader opens over a blurred sky.
    - Top-left: a lime "▶ BOOK 02 / 07" tag and the book title ("Design in Motion", about 28 px serif).
    - Top-right: an on/off toggle switch labelled "CLOSE · ESC".
    - Centre: the closed book, about 370×520 px.
    - Below: a beige cassette-deck control panel with "◀◀ BACK", a green LCD showing "PLAY ▶ 01/02", and a lime "▶ NEXT". Under that: "‹ PREV BOOK", seven LED dots (the current one lit), "NEXT BOOK ›", and the hint "[ ← → ] TURN PAGES · [ CLICK ] THE BOOK · [ ESC ] CLOSE".
    - **Clicking the book** opens it to a spread: the left page is a photo mounted in an iPod-like frame with earphone cables and a dice; the right page has a serif heading "Design" with "in Motion." in script, then a story with yellow highlighter marks. The next click turns to the next spread. Esc closes.
- **End of page:** a cloud bank image (1440×234) is the floor and footer. There is no footer text; the nav pill stays as the contact. In the last frames a short lime bar shows at the top centre above the nav *(probably scroll progress; inferred)*.
- **Phone (390):** the hero stacks (ticker, headline, intro, CRT, drawers) with the paper-sheet gadgets at the edges. The tabs stay, the cards are one column, the title still assembles letter by letter, and the shelf shows one large cover at a time, still turning.

### Section transitions
1. Hero to grid: the folder tabs at the hero's bottom edge become the grid's header. The cards scroll up over the hero on the **same sky**, with no divider.
2. Grid to Making: again no divider. The sky continues and the next title **assembles itself** as the handover.
3. Making to end: the shelf sits on a **cloud bank** that closes the page.
4. Across all of it: the **robot** flies between sections, and the nav pill is fixed.

### Content presentation
- Case studies are magazine-cover posters built from the same retro-hardware kit as the hero, with an outcome sentence as the title. Hover rewrites the line as an invitation ("See What I Built").
- Process is a physical drawer stack you pull open, one drawer per step, with a note card that changes.
- Experience and milestones are books on a 3D shelf, opened in a reader with cassette-deck controls (Back, Play counter, Next, LED dots).
- Skills vocabulary is hidden in the title letters (a click gives "Mental model", "Affordance").
- The résumé (`/resume`) is a printer printing a page, under the headline "Worth a page. Worth a call."

### What makes it feel rich, not plain
1. **One prop kit everywhere.** Retro gadgets, lime tags, mono labels and halftone photos in the hero, the posters, the title letters, the reader controls and the résumé printer.
2. **Fake system UI as decoration.** Object-detection boxes with confidence scores, a "SCANNING 32%" to "✓ DESIGNER 99.9%" loop, typing tickers, "loading curiosity…" progress bars. Every label behaves like a machine readout.
3. **Physical metaphors for lists.** Drawers for process, a bookshelf for milestones, a reader with deck buttons for stories.
4. **Letters as objects.** A display title built from photographed parts that assemble on entry and burst apart on click with a word tag.
5. **A roaming mascot.** One small fixed sprite that perches on headings and cards and flies between them.
6. **Hover rewrites copy.** The drawer note changes; the card title becomes "See What I Built".
7. **A shared ground.** One sky from top to bottom, ending on clouds, so no section feels like a new page.

---

## 3. Chi Quach — chiquach.com

### The thread
The hero is an airport x-ray of her bag: every object inside is a project, shown in x-ray colour until touched. Scrolling slides the same white x-ray table sideways, so the bag passes out of frame and more x-rayed objects follow on the conveyor. Every object below behaves exactly like the ones in the bag. The final object is her business card, followed by the contact links.

### Section by section

**S1. Hero, the bag (scroll 0–~600 px of a 3,368 px track).**
- On screen: white.
  - "CHI / QUÁCH" in 160 px ABC Arizona Flare Light at top-left (x 8, y 58; line height 128 px; tight negative tracking).
  - At y ≈ 568: two columns of 12 px Neutral Sans capitals. Roles on the left (EMERGING HARDWARE, DESIGN SYSTEM, GROWTH, COMMUNITY, LEARN MORE) and links with ↗ on the right (META, 2026; MONGODB, 2025; PLAYBOOK, 2022; DESIGN MEETUP; CREATIVE WORK; TOOLINGS).
  - A hand-drawn question-mark doodle (64 px).
  - The bag: a 947×1072 cyan x-ray photo at x 493 holding about ten x-ray objects in cyan, magenta and violet: a phone, lip gloss, a pen, glasses, a coffee filter, a polaroid, a figurine, earphones, a hand sanitiser and more.
- **Hover on an object** (each one I tried):
  - At about 50 ms the x-ray image is swapped for the real colour photograph of the same object.
  - At the same time a pale cyan hairline frame with a faint inner grid (like a 3×3 viewfinder) draws around it, a few px larger than the object.
  - A black label tag appears at the frame's bottom-left: white 12 px capitals, height 14 px, padding 0 4px 0 2px. Its text scrambles through random letters before settling ("IPHONE 17", "CHAPSTICK", "PEN", "GLASSES", "VIETNAM PHIN", "HEYY", "FRIENDS", "HEADPHONES").
- **The headline reacts to the bag:** entering any part of the bag (even its empty edge) starts a letter scramble on the 160 px name. It cycles random capitals across three lines ("WHGBGG / IN MY / BAG") and settles on "WHAT'S / IN MY / BAG" after about 1.4–2.0 s. Leaving the bag scrambles it back to "CHI / QUÁCH" ("OOH HCÁQH", "OLL QOÁÁU"), settling after about 1 s. Each new object hover re-triggers the scramble.
- **Leaving an object:** it returns to x-ray at once; the frame and tag vanish.
- **Links:** only the cursor changes; there is no visible hover state. Clicks on "?", "LEARN MORE" and the bag objects did not navigate in my headless run.

**S2. The conveyor strip (scroll ~600–3,000 px).**
- **Scroll mechanic:** the vertical wheel moves everything sideways 1:1 (a 600 px wheel moves the track 600 px left). There is no vertical motion and no parallax. The name, the link columns and the bag slide off to the left together, and the strip enters from the right.
- On screen: single objects on white, vertically centred around y ≈ 450, each 290–560 px tall with 150–250 px of white between them. At rest each is an x-ray:
  - cyan glasses;
  - cyan event tickets in a pouch ("events and conferences");
  - a violet Peercam device;
  - pink insoles;
  - a violet lamp;
  - a pink business card.
- **Hover on a strip object:** the same three-part reveal as in the bag. The x-ray swaps to the real photo, which is often a different-looking real thing: the cyan frames become Meta Ray-Ban sunglasses in black, the pink insoles become lilac smart insoles, the violet lamp becomes a beige peg-board lamp. The cyan viewfinder frame and grid draw around it, and the black tag shows year and project, scrambling in: "2025 – 2026 / META, REALITY LABS / HARDWARE", "CONVERSATION DESIGN 101", "PEERCAM / PARTY ICE BREAKER", "STRIDE / SMART INSOLES", "2024 / ROCK PAPER SCISSORS LAMP", "2025 / PORTFOLIO".
- **The last object, her card:** the pink x-ray card turns into a silver business card ("chi quach", "/chi-chi", "design and build") with a tiny audio player readout "0:00 / 0:00".
- **Phone (390):** the strip becomes a vertical stack. Because there is no hover, the reveal is scroll-triggered: as each object reaches the middle of the screen it swaps to its real photo and gets the viewfinder frame and scrambled tag, then reverts as it leaves.

**S3. Contact (end of track).**
- On screen: centred in white space to the right of the card: "Open to creative projects!" (12.8 px SF Pro Display Light) and two columns of 12 px capital links with ↗: EMAIL, X, LINKEDIN / PINTEREST, COSMOS.
- No hover state was visible.

### Section transitions
- One continuous **horizontal conveyor**. The hero itself (name, links, bag) is the first stretch of the track and slides out sideways as the strip enters. There are no dividers and no colour shifts; the shared ground is the white x-ray table.

### Content presentation
- Every project is a physical object, first in x-ray (identity hidden), then revealed as the real thing with a viewfinder frame and a scanner tag.
- The headline narrates what you are doing ("WHAT'S IN MY BAG") instead of a section title.
- Even the About is an object (the polaroid tagged "HEYY"), and so are the friends (the figurine tagged "FRIENDS").
- The footer is her business card, then a two-column link list.

### What makes it feel rich, not plain
1. **Two images per object.** An x-ray (a tinted, translucent PNG) and the real photo, swapped on hover, so every object holds a small reveal.
2. **A viewfinder on hover.** A hairline frame with a faint inner grid, sized to the object plus a few px, with a black tag pinned to its bottom-left corner.
3. **Scrambled text everywhere.** The 160 px headline (1–2 s) and the 12 px tags (about 400–900 ms) both decode through random letters, so all copy behaves like a scanner readout.
4. **The headline answers the pointer.** Hovering the world changes the page title.
5. **A horizontal conveyor at 1:1 wheel speed.** The vertical wheel walks you past one object at a time, with lots of white between them.
6. **Scroll-position reveal on phone.** The same hover state is triggered when an object reaches the viewport centre.
7. **One colour code.** Cyan, magenta and violet appear only in x-rays, and the real colour appears only on reveal.

---

## Cross-site mechanics (recurring) and where each is used

| Mechanic | Adya | Sudarvel | Chi |
|---|---|---|---|
| **Hover "wakes" an object (dull or encoded to real colour, plus a frame or glow)** | Cards (violet border and glow), about photo (black and white to colour), social cells (outline to brand colour plus star-dots) | Drawers (LED lights, drawer slides) | Every object, in the bag and on the strip (x-ray to photo, plus viewfinder and tag) |
| **Hover or click rewrites copy** | Logo opens a bio card; nav cell gains "↗" | Drawer note text; card title becomes "See What I Built"; letter click shows a UX-term tag | Headline scrambles to "WHAT'S IN MY BAG"; tags decode |
| **A recurring character or mascot across sections** | The girl (sticky video) through hero, descent and arrival | The robot (fixed sprite) on hero, cards, title "M" and the résumé page | (none; the bag's objects return as the strip) |
| **A shared ground that never cuts** | One painting from hero to arrival, then one black starfield from works to footer | One sky from hero to clouds at the end | One white x-ray table, sideways |
| **Pinned element while the world scrolls** | Girl (hero to arrival), ENTER UNIVERSE pill (arrival), Featured Works title and stars (works) | Nav pill only | The whole page is a pinned horizontal track |
| **Machine or system labels as decoration** | Mono labels "PLANET C", "COMET A"; DM Mono nav | Detection boxes with %, SCANNING loop, typing ticker, barcode "001/007", LCD "01/02" | Scanner tags, scrambled text |
| **Labels named after the world** | Planets, comets, constellations; "Control room"; captions | "Portfolio issue No. 001", "The making of", "Book 02 / 07" | "What's in my bag", object names |
| **Physical metaphor for a list** | Star map of works | Drawers (process), bookshelf and reader (milestones), printer (résumé) | Bag and conveyor (projects), business card (contact) |
| **Text that assembles or decodes** | Title pixel-dissolve loop | Hardware letters type in on entry and burst on click; ticker types | Headline and tag letter-scramble |
| **Material or texture divider between sections** | Torn-paper edge; radial glow behind contact | Cloud bank at the end | (none; white space) |
| **Cursor as part of the world** | Comet trail on every section | (robot roams, not cursor-bound) | (system cursor) |
| **Phone keeps the reveal without hover** | (works removed on phone) | Title assembly and shelf rotation kept | Scroll-centre reveal replaces hover |
