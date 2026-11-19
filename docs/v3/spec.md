# Night Almanac v3: the calm redo

Lana Huertas is a UI/UX and graphic designer in Manila. Her brand is purple, magical and mystical. This is the third attempt at her portfolio as "a night garden you travel through". She liked the idea of the second attempt and rejected the execution: "It looks incomplete and rushed. This is too overwhelming."

Three studies sit beside this file and are the evidence for every decision here. Read their summaries before building:

- `research-picks.md`: the seven sites Lana chose as her taste, studied in a browser (cross-site summary at the end).
- `research-wall.md`: fifteen sites from the wall she pointed to (section "Across the 15 sites").
- `grade-v2.md`: the second attempt graded on `rubric.md`: interface 2.25, graphic design 2.0, movement 2.86 out of 5, with 48 defects (section 9, "What a redo must change").

## What went wrong, in numbers

The same busyness measure (`metrics.py`, see `rubric.md`) on 1440×900 screens:

| | Calm | Busy | Home page length |
|---|---|---|---|
| Lana's best-scoring references (Chi, Ayush, Royden, Adya) | 58 to 76 | 7 to 11 | 5 to 10 screens |
| Second attempt | 23 | 38 | 24 screens |

The second attempt put a detailed painting behind every screen, 25 or more things in a brand room, eight art styles side by side, and nine kinds of button. The references do the opposite: one rich screen, then quiet ones; one focal thing per screen; one art style; motion only when the visitor causes it.

## The idea, restated

**One night sky that you travel down, from the garden gate at dusk to first light.** The sky is a plain, deep ground that slowly changes colour as you go, so it always tells you how far you have come. The painted garden appears only where you arrive (the gate at the top) and where you leave (dawn at the bottom). In between, each stop holds exactly one thing: a piece of Lana's work, large, with room around it.

## Targets the build must meet

Measured on 1440×900 stills taken one viewport apart, in normal mode:

1. Median calm 55 or more; median busy 15 or less. No screen under calm 40.
2. At most six things competing for attention on any screen (a heading with its line of text counts as one; a row of thumbnails counts as one).
3. Home page 11 to 13 screens long on desktop, 14 or fewer on a phone (390×844).
4. Real work one click from the first screen, and at most 1.6 screens of scrolling away.
5. Nothing moves when the page is left alone (0 percent idle change), anywhere.
6. Every text block reaches WCAG AA against what is behind it, measured from a screenshot.
7. Zero console errors, zero horizontal overflow at 1440, 1024, 768 and 390; no image without `width`, `height` and `alt`.
8. A rubric self-score of 4 or more on A5, B2, B6, B7, C2 and C7, with evidence.

## One image language

Only two kinds of image appear: **gouache painting** (the existing scenes and the repainted props) and **Lana's real work** in true colour. Nothing photoreal, no glass renders, no paper cut-outs, no stickers. Painted pieces have soft edges that fade into the sky with a static CSS mask; they never sit in a box.

Art available (all WebP; paths relative to `public/samples/`):

| File | What | Use |
|---|---|---|
| `almanac/art/s_hero.webp` (1672×941, `-sm` 960 wide) | The garden at night, moon left, glasshouse far away | Gate: lower part of the first screen only |
| `almanac/art/s_dawn.webp` (+ `-sm`) | The garden at first light | Contact: lower part of the last screen only |
| `almanac/art/s_pond.webp` (+ `-sm`) | Night pond | Products: a low strip along the bottom, faded |
| `almanac-v2/art/gate-l.webp`, `gate-r.webp` (706×920, 707×920) | Two halves of a painted iron gate | Gate |
| `almanac-v2/art/f_corner.webp` (900×962) | Painted lilies growing from a bottom-left corner | Gate foreground, mirrored for the right |
| `almanac-v3/art/lantern.webp`, `frame.webp`, `balloon.webp` | Painted magic lantern, painted oval frame (opening transparent), painted balloon | Films, About, Contact. Being generated; if a file is missing when you need it, leave its slot empty with the layout still correct and say so in your report |
| `/art/backdrops/<slug>.webp` | One painted backdrop per brand | Brand rooms, always under a heavy tint |
| `/work/…` | Lana's work (paths in `data.js`) | Everywhere |

Do not use anything from `brand/art/`, nor `o_*.webp`, `pad.webp`, `sheet.webp`, `ledger.webp`, `arch.webp`, `lana.webp`, `f_wisteria.webp`, `drawer.webp`.

## The design system (small on purpose)

Build it once in `v3.css`; every chapter uses only these.

- **Ground.** `<body>` carries one tall gradient for the whole page: `#0c0620` at the top, `#140a2c` by the brands, `#1d1040` by the films, `#2b1550` by the about section, then lifting to `#5a3a9a` and a soft `#d9b8e8` to `#f3c9c0` dawn behind the contact section. A sparse, static starfield (two or three layers of small CSS radial dots, low opacity) lies over the dark part and thins out toward dawn. No texture, no grain.
- **Colour.** Cream `#fff1c9` for headings on the dark ground, mist `#d9cfff` for body text, lilac `#b9a2ff` for small labels and focus rings, orchid `#c04bff` for glow only (never text), ink `#2b1470` for text on light surfaces. One light surface colour, card `#fffdf8`, used only for the contact letter. That is the whole palette outside the brand rooms.
- **Type.** Redaction (files in `brand/fonts/`, including cuts 70, 35 and 10 for the "worn letters" hover) for headings; Inter Tight for everything else; DM Mono for small labels. No script face. Scale: display `clamp(64px, 10.5vw, 176px)`, h2 `clamp(40px, 5vw, 76px)`, h3 `clamp(28px, 3vw, 44px)`, lead 20px, body 17px, label 14px. Line length 60 characters at most. Sentence case everywhere, never all caps.
- **Shape.** Three radii only: 6px (images), 14px (controls), 999px (pills). One shadow for anything lifted: `0 24px 48px -20px rgb(4 2 14 / .8)`.
- **Buttons.** Two only. Primary: the violet glass pill from v2 (`.btn.glass` in `almanac/almanac.css`), one per screen. Secondary: a plain cream outline pill. Both 52px tall, 16px semibold, lift 2px on hover in 140ms, `scale(.98)` on press, lilac focus ring.
- **Labels.** A mono line such as `02 / 10 · FEU Tech ACM · Mar 2024`. Tools and roles are written as a plain mono line separated by middots, not as chips.
- **Section head.** A small moon-phase icon and mono label ("Posters"), then the h2, then at most one line of lead text. Nothing else.
- **No boxes.** Text sits on the ground. No cards, panels, borders or paper sheets, except the single contact letter.
- **Route bar.** A solid pill fixed at the top, 56px tall: Lana's mark and name on the left, the six stops with their moon-phase icons (Brands, Posters, Films, Products, About, Contact), the current one filled cream, and the quiet-mode switch. It is opaque (`#140a2c`), so text never shows through it. Under 860px it becomes a mark, a "Menu" button and the switch; the menu is a full-screen list of the six stops with labels. No guided tour.
- **Lightbox.** One shared full-screen viewer for any piece of work (image, title, count, previous, next, close; arrow keys; Escape; focus returns to the opener). `almanac-v2/v2.js` has a working one to adapt.

## Movement (little, caused, finished)

- **Scrolling is native.** No snapping, no wheel capture, no smooth-scroll override. Two places are pinned and scrubbed by the scroll: the gate (about 1.5 screens) and the brand corridor (about 6 screens). Everywhere else the page simply scrolls.
- **Depth at the gate:** three painted layers at different speeds (the garden slowest, the gate in the middle, the corner lilies fastest), as in Adya Srivastava's site. No 3D camera elsewhere.
- **One entrance per stop, once:** as a stop first enters the view, its head and its one object rise 16px and fade in over 400ms (`cubic-bezier(.23,1,.32,1)`), staggered by 80ms. They never replay.
- **Hover and press** on everything pressable: lift 2px or zoom the image 1.02 inside its frame in 140ms; press `scale(.98)`. Colour changes are instant.
- **Worn letters** stay: touching a letter of a heading runs it through Redaction 70, 35, 10 and back in about 400ms.
- **Nothing loops.** No marquee, no floating motes, no bobbing, no shimmer, no flicker, no auto-advance.
- **No loader.** The first screen shows its text within a second. The name, then the line, then the button settle in over at most 1.2s.
- **Quiet mode and reduced motion:** the two pinned stops become plain sections (the gate shown open; the brand corridor becomes a sideways strip you step through with previous and next), entrances are off, everything is reachable. Quiet mode is remembered.
- Easing: enter `cubic-bezier(.23,1,.32,1)`, move `cubic-bezier(.77,0,.175,1)`. Transitions name their properties. No `filter` on anything that moves with the scroll.

## The route: seven stops, about twelve screens

Each stop lists the one thing the eye lands on, what else may be on screen, and the one interaction. Stick to the item counts.

### 1. The gate (pinned, 1.5 screens) — `#gate`

- **Focal:** the name "Lana Denise Huertas" in Redaction cream, two lines ("Lana Denise" / *Huertas* italic), in the upper half, on plain sky.
- **Also:** one line under it ("UI/UX and graphic designer in Manila. I design brands, posters, films and product screens, and build some of them in code."), a primary button "See the work" (travels to the first brand room) and a secondary "Email Lana" (travels to contact). That is all the text. No corner labels, no glass bloom, no "plant a flower", no motes.
- **Scene:** the garden painting fills only the lower 55 percent of the screen and fades up into the plain sky through a static mask, with a night tint over it so it sits back. The gate stands closed across the bottom, about 45 percent of the screen tall, centred, with the lilies in the two bottom corners.
- **Interaction:** scrolling swings the two gate halves open on their outer hinges and the three layers part at different speeds; by the end of the pin the painting has sunk away and you are in open sky above the first brand room. The text fades out during the first third.
- **Phone:** name at about 17vw, the same order, gate smaller; pin kept at 1.3 screens.

### 2. The brand corridor (pinned, about 6 screens) — `#brands`

The heart of the site. Lana's words: "each branding has its own background, like you can see each branding sheet laid out, not just capsules."

- **Head:** shown on the first room only, small: moon icon, "Brands", and the counter.
- **Ten rooms in a sideways track,** one viewport wide each. Scrolling down walks the track sideways (half a screen of scroll per room). No arches, no gaps, no dimming overlays: one room is on screen at rest.
- **A room is one composed sheet, in that brand's own colours, with at most six things:**
  1. **Ground:** the brand's backdrop image filling the room under a tint of the darkest colour in that brand's palette at 72 to 80 percent, so the room clearly has its own colour and stays calm. Text on it is always cream or mist; verify AA per room and raise the tint where it fails.
  2. **The key visual** (`imgs[0]`), large: up to 68 percent of the room's height, on the left (rooms alternate sides), 6px radius, the one shadow. It is the focal point. Clicking opens the lightbox on that brand's set.
  3. **The label line** in mono: `02 / 10 · FEU Tech ACM · Mar 2024`.
  4. **The name** (h3 in Redaction, large) with the tagline under it in Redaction italic.
  5. **The brief,** cut to two lines at most (use the first sentence of `brief`), then roles and tools as one mono line.
  6. **One strip:** the five palette dots (each copies its hex code and says "Copied") followed by three small thumbnails of other pieces and, if there are more, a "+N" tile; all open the lightbox.
  Nothing else: no chips, no panels, no "museum label", no campaign link in the room (put that link in the lightbox caption or drop it).
- **Controls,** fixed at the bottom centre of the stage, one row: previous, "3 / 10 Brand name", next. Left and right arrow keys work when the corridor is in view. No dot row.
- **Phone, quiet mode and reduced motion:** not pinned. The rooms sit in a native sideways strip with scroll-snap, one room per screen width, stepped with the same previous and next buttons or a swipe; the section is one screen tall. Each room stacks: key visual (max 46 percent of the height), label, name, tagline, strip.

### 3. Posters (about 1.2 screens) — `#posters`

- **Focal:** one poster, large and upright in the centre.
- **Layout:** the twelve posters in a single sideways row on the plain sky, with wide gaps. The centre one is full size (about 62 percent of the screen height) and fully lit; its neighbours are smaller (about 78 percent of its size) and dimmed by a dark overlay, not by a filter. Under the centre poster: its title, and client and year in mono.
- **Interaction:** the row is a native sideways scroller with scroll-snap to centre; dragging, the trackpad, the previous and next buttons and the arrow keys all move it; clicking a neighbour brings it to the centre; clicking the centre poster opens the lightbox. No tape, no rotation, no sticky notes, no board.

### 4. Films (1 screen) — `#films`

- **Focal:** the current film's still, 16:9, about 56 percent of the screen width, centred slightly right.
- **Also:** the painted lantern at the lower left, about 22 percent of the screen width, with a faint static beam toward the picture; under the picture the film's title (h3), role and length in mono, and a primary button "Watch on Google Drive" (new tab); under that, the ten films as one row of small thumbnails with their lengths.
- **Interaction:** choosing a thumbnail cross-fades the big picture in 220ms and updates the caption. Everything above stays in one viewport at 1440×900 so the result of the click is always visible. The chosen thumbnail is marked (`aria-pressed`, cream outline).
- **Phone:** picture full width, caption, button, then the thumbnails as a sideways strip; lantern hidden.

### 5. Products (about 1.2 screens) — `#products`

- **Focal:** the chosen app's screen: a desktop screenshot in a plain 6px-radius frame, or a phone screenshot in a plain rounded phone outline. No bell jar, no lily pads.
- **Also:** four pill tabs (PsyClick, Bloom, Algebrawl, Debt Payoff Ledger); beside the screen: the name (h3), a one-line tagline in italic, two or three lines of description, role and year in mono, the stack as one mono line, and a primary button to the live site. A row of up to four small thumbnails of other screens of that app under the main screen; clicking one swaps the main screen, clicking the main screen opens the lightbox.
- **Scene:** the pond painting as a low strip (about 22 percent of the height) along the bottom of the section, faded at its top edge and tinted, behind nothing important.
- **Interaction:** tabs switch the app in place with a 200ms cross-fade; arrow keys move between tabs. Text for the four apps is in `almanac/almanac.js` (the `PRODUCTS` array).

### 6. About (about 1.2 screens) — `#about`

- **Focal:** Lana's portrait (`/work/lana-portrait.webp`) inside the painted oval frame, left, about 30 percent of the width.
- **Also, right:** the h2 "About Lana"; one statement in Redaction at about 30px ("I build visual content and adaptable designs for brands that want to stand out, and I can do it for you, too."); four roles as a ruled list (role and dates on one line; clicking a role opens its one or two lines of detail under it, one open at a time, the first open by default); then one mono line for the awards ("1st runner-up, GCash ImaGnation 2026 · Elite Scholar, FEU Tech · DOST scholar") and one for education ("B.S. Computer Science, FEU Institute of Technology, 2027").
- No stickers, no ledger book, no stamps, no book card. Role text is in `almanac/index.html`.

### 7. Contact at first light (1 screen) — `#talk`

- **Focal:** one letter: a card-coloured sheet, centred, about 560px wide, 14px radius, the one shadow. On it: h2 "Let's talk", one line ("Hiring for UI/UX, brand or motion work, or need publicity for your org? Write to me. I reply within two days."), primary button "Email Lana" (`mailto:lanadenisehuertas@gmail.com`), secondary "Copy the address" (changes to "Copied" for two seconds), and two text links (LinkedIn `https://www.linkedin.com/in/lana-denise-huertas/`, GitHub `https://github.com/lanadenisehuertas/`).
- **Scene:** by here the sky has turned to dawn. The dawn painting fills the lower 45 percent of the screen, faded at its top edge. The painted balloon sits small in the upper right of the sky, still.
- **Footer** under it, one quiet line: "Made in Manila by Lana Huertas, 2026" and a link to the design system page.

## Files

Folder `public/samples/almanac-v3/`. Plain HTML, CSS and JavaScript; no libraries, no build step. Served at `http://127.0.0.1:3900/samples/almanac-v3/index.html` by a dev server that is already running (never start, stop or restart a server; never run a git command that changes anything; never commit).

| File | Holds |
|---|---|
| `index.html` | The whole page's markup (static HTML for all text, so it reads without JavaScript; rooms, posters and films may be rendered from `data.js`) |
| `v3.css` | The system: ground, type, buttons, labels, section head, route bar, lightbox, entrance, quiet mode |
| `v3.js` | Scroll progress for the two pinned stops, route bar, quiet mode, entrance, worn letters, lightbox |
| `gate.css/js`, `brands.css/js` | Stops 1 and 2 |
| `stops.css/js` | Stops 3 to 7 |
| `data.js` | Already there: `DATA.brands`, `DATA.posters`, `DATA.films` (same shape as described in `almanac-v2/BUILD.md`) |

The second attempt (`almanac-v2/`) is there to borrow working code from (scroll progress in `v2.js`, the gate swing in `ch-gate.css`, the corridor track in `ch-brands.js`). Borrow mechanisms, never its look.

Privacy: the only personal details on the page are Lana's name, city, email and the two profile links above. Never add a phone number, birthday, family names or street address.

## How to check your own work

Use Playwright (Python, `sync_playwright`, `channel="chrome"`). Keep scripts and screenshots in `C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v3\build\`, never in the project. Take stills one viewport apart down the whole page at 1440×900 and 390×844, run `metrics.py` on the 1440 ones (path in `rubric.md`), and look at every still with the Read tool. A stop is done when its stills meet the targets above, its interaction works with mouse, keyboard and touch-sized targets, it works in quiet mode, and you would not be embarrassed to show it to an art director: check alignment to a common left edge, even spacing, that nothing is clipped or overlapping, that images do not pop in, and that nothing looks like a placeholder.
