# The night table: first-screen sample

Lana Huertas is a UI/UX and graphic designer in Manila; her brand is purple, magical and mystical. This is a sample of one screen, made to test a new idea for her portfolio's home page before the whole site is rebuilt around it.

## Where we are

- Attempt 2 (`public/samples/almanac-v2/`) was a rich painted world. Lana: "too overwhelming", "incomplete and rushed". Measured: 23 percent calm space per screen, 25 or more things on a screen, eight art styles.
- Attempt 3 (`public/samples/almanac-v3/`) fixed the overload with a plain night sky, one thing per stop. Lana: "I like it a bit", then "this seems too boring, and the elements don't align."
- So the target sits between them: **as calm as attempt 3, with the world and the objects of attempt 2, and precisely aligned.**

Evidence for what works, from studying 22 reference sites Lana pointed to: `docs/v3/research-picks.md` and `docs/v3/research-wall.md` (read the two cross-site summaries, and the notes on Chi Quach, Failenn Aselta, Shashank Khambhaita, Himanshu Shakit and Royden So). The pattern that scores best: one hero scene covering 30 to 50 percent of the first screen on a single flat ground; the objects in it are the doors to the work; hovering an object explains it within 100ms (an outline plus a one-line caption, and the headline changes); clicking moves the camera into it; a plain nav exists as well; nothing moves when the page is left alone.

## Lana's latest note: "I like experimental, mystical, bitmap"

This changes the look of the sample and gives it its one experimental idea. Earlier in the project Lana also picked a sketch called "Moon spell" (a 1-bit lilac bitmap garden that woke into colour) as a favourite, so this is a taste she has shown twice.

**The table sleeps in bitmap and wakes in colour where you touch it.**

- **At rest** the whole scene (table and all six objects, including the real poster, screenshot and portrait fitted into them) is drawn as a 1-bit bitmap: lilac `#b9a2ff` pixels on the night sky, ordered (Bayer) dither, chunky pixels of about 3 CSS px, `image-rendering: pixelated`, no anti-aliasing. It should look like an old dot-matrix print or an early Mac screen, glowing faintly. The moon glow behind it may be a dithered disc as well.
- **On hover or focus** the object under the pointer wakes: its painted colour version appears through the same dither pattern (pixels switch on in Bayer order over about 300ms, not a smooth opacity fade), and it sleeps again in about 200ms when the pointer leaves. The lift, the caption and the name swap described below still happen. Only the touched object is ever in colour, so the screen stays calm and the colour is a reward.
- **On click** the wake spreads outward from the object across the scene as a ring while the camera pushes in.
- **Type joins in.** Lana's display face, Redaction, ships with bitmap-degraded cuts (files in `public/samples/brand/fonts/`: Redaction 100, 70, 35, 10, plus the smooth regular and italic). Set the name in a coarse cut (try Redaction 70 or 100) at rest, and let it resolve to the smooth cut on hover of the name, or when any object wakes; choose whichever reads best and say what you chose. Small labels and the caption line may use a pixel face (Pixelify Sans from Google Fonts) instead of DM Mono; body text stays Inter Tight for reading.
- **Mystical, lightly:** the six objects may carry tiny moon-phase marks in the caption line (first object new moon, last object full), and the caption can be worded as an almanac entry. No tarot cards, no zodiac wheels, no extra ornaments: the bitmap is the magic.
- **How to build it:** do the dithering in the browser on a `<canvas>` per object from the colour art (an earlier sketch has a working Bayer ditherer and matrix to borrow: `public/samples/brand/sheet.js`, `B8` and `dither()`), or pre-compute 1-bit PNGs with Python and Pillow into `art/` if that is crisper; either way the bitmap must stay sharp at every device pixel ratio and the page must not jump while it draws. Draw each object once; animate the wake with a threshold, not by re-reading images every frame. In quiet mode and reduced motion the wake is instant.
- **Measuring:** a dithered image counts as "busy" in `metrics.py` even when it looks calm, so for this sample report the numbers but judge calm by the item count and by eye: one scene, one text block, one caption, the bar.
- **Without JavaScript** the scene shows in colour and the links work.

## The idea

**A gardener's table under the moon. Everything Lana makes is on it.** Six painted objects stand on one painted table against a plain night sky. Each object is a door to one part of her work, and three of them already show real work on the first screen.

| Object | Art | Door to | Real work shown on it |
|---|---|---|---|
| Seed packets | `art/packets.webp` | Brands | (none: the packets are painted) |
| Easel | `art/easel.webp` (blank cream canvas) | Posters | One real poster fitted exactly onto the canvas |
| Magic lantern | `../almanac-v3/art/lantern.webp` | Films | (none) |
| Phone on a stand | `art/phone.webp` (blank dark screen) | Products | One real app screenshot fitted exactly onto the screen |
| Framed portrait | `../almanac-v3/art/frame.webp` (oval opening transparent) | About | Lana's portrait `/work/lana-portrait.webp` behind the opening |
| Sealed letter | `art/letter.webp` | Contact | (none) |
| The table | `art/table.webp` | | |

All art is gouache on transparent WebP, in `public/samples/almanac-v4/art/` unless a path says otherwise. Sizes are in `art/sizes.txt`. Look at every piece with the Read tool before composing: find the table's top surface line, each object's base, the canvas rectangle on the easel and the screen rectangle on the phone, by measuring the pixels, not by eye. If a piece is unusable (wrong angle, cut off, clashing style), say so in your report and compose without it; do not use any other art style to fill the gap.

## The screen

One viewport, 1440×900 first, no scrolling needed to understand it.

- **Ground:** the plain night sky from attempt 3 (`../almanac-v3/v3.css` has the tokens, the gradient and the starfield; reuse its type scale, two buttons, label style and route bar by linking that stylesheet, and put everything new in `table.css`). A large soft moon glow (a static radial gradient, no image) sits behind the table to give the scene a centre of light.
- **The scene:** the table stands on the lower part of the screen, centred or slightly right, with the six objects standing on its top. Scene plus objects cover 35 to 50 percent of the screen. The objects vary in height so the row has a rhythm (tall easel, low letter), they do not overlap by more than a few pixels, and every base sits exactly on the table's top surface line. Each object casts a soft contact shadow on the table (a blurred dark ellipse, static).
- **The words:** the name "Lana Denise Huertas" in Redaction, large, with one line under it ("UI/UX and graphic designer in Manila. I design brands, posters, films and product screens, and build some of them in code.") and one primary button, "See the work". Nothing else: no second button, no corner labels.
- **The caption line:** a fixed place near the scene (for example directly under the table, centred on it) that says "Six things on the table. Pick one." at rest and changes to the hovered object's line.

### Alignment is a deliverable

Lana said of attempt 3 that "the elements don't align". Treat alignment as something you prove, not something you eyeball:

- Use one 12-column grid with 64px side margins and one spacing scale (8, 16, 24, 40, 64, 104). The name, the line under it and the button share one left edge. The scene is centred on a column line or on the page centre, and the caption is centred on the scene.
- The six objects are spaced by a rule you can state (equal gaps between their visual edges, or centres on equal steps), not placed by hand one at a time.
- The route bar, the words and the scene sit on a clear vertical rhythm: equal or deliberately stepped gaps, measured.
- Write a small Playwright check that reads `getBoundingClientRect` for these elements and prints the left edges, the bases relative to the table line, and the gaps, and include its output in your report. Any difference over 1px that is not deliberate is a defect.

### What each object does

- **Rest:** fully still. Nothing loops.
- **Hover or keyboard focus** (each object is a real link or button with a name, 44px or more, focusable in left-to-right order): the object lifts 6px with a lilac outline that follows its painted shape (a `drop-shadow` outline on the image is fine since it only changes on hover), the others dim slightly, the caption line changes to that object's line within 100ms, and the big name's second line swaps to the door's name ("Brands", "Posters", and so on) with a 180ms cross-fade, then returns when the pointer leaves. Captions: "Ten brands, each with its own room." / "Twelve one-off posters." / "Ten films and edits." / "Four apps I designed and built." / "Who I am and where I have worked." / "Write to me. I reply within two days."
- **Click or Enter:** the camera pushes into that object for about 500ms (scale the scene toward the object's centre and fade the rest to the night colour), then the browser goes to that part of the existing attempt-3 page: `../almanac-v3/index.html#brands`, `#posters`, `#films`, `#products`, `#about`, `#talk`. In quiet mode or reduced motion it goes there at once.
- **Entrance, once:** the sky is there at once; the name settles in, then the table rises a little and the objects land on it one after another (about 70ms apart, each a small drop of 12px with a soft settle), all finished within 1.4s. Then stillness.
- **Route bar:** the same six doors as plain links for people who do not want to play, and the quiet-mode switch.
- **Phone (390×844):** the words on top, then the table scene scaled to fit the width with all six objects still readable and tappable (if six do not fit in one row at a comfortable size, use two rows of three on two shelf lines, still aligned), then the caption line. Tapping an object shows its caption and outline; a second tap, or a "Go" button that appears by the caption, opens it.

## Targets

- Busyness (`metrics.py`, see `docs/v3/rubric.md`): calm 50 or more and busy 22 or less on the 1440×900 still at rest.
- At most six things competing for attention: the name block, the scene, the caption, the route bar.
- Text contrast AA, measured from a screenshot.
- No console errors, no horizontal overflow at 1440, 1024, 768 and 390; every image has `width`, `height` and `alt`; no layout jump as images load.
- It must not be boring: judge it against attempt 3's first screen side by side and against the reference notes. The scene should make someone want to touch it.

## Files and rules

- Folder `public/samples/almanac-v4/`: `index.html`, `table.css`, `table.js`, `art/`. Plain HTML, CSS and JavaScript, no libraries. Served at http://127.0.0.1:3900/samples/almanac-v4/index.html by a dev server that is already running: never start, stop or restart a server, never run a git command that changes anything, never commit.
- Do not edit anything in `almanac-v3/` (another builder is working there). Link its stylesheet and copy any JavaScript you need into `table.js`.
- Test scripts and screenshots go in `C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v4\`, never in the project.
- The only personal details on the page are Lana's name and city.
