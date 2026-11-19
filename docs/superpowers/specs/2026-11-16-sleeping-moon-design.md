# The sleeping moon: site design

Date: 2026-11-16. Status: design approved by Lana in conversation; this file awaits her review. Not committed (Lana commits only when she asks).

## Goal

Lana Huertas's portfolio as one idea carried through every screen: **the site sleeps as a 1-bit lilac bitmap on night and wakes into colour where you bring light to it.** It is experimental, mystical and bitmap (her words), composed like a poster on a strict grid, and it must not be boring, overwhelming or misaligned (her words on the three earlier attempts).

The approved starting point is the first-screen sample at `public/samples/almanac-v4/` ("that's more like it"). This design pushes that screen further and carries it across the whole site.

## Decisions Lana made

1. Push the first screen in all four directions offered: a lantern cursor, more almanac ornament, a moon that reacts, and type that wakes.
2. Structure: one long journey page, plus a page of its own for each of the ten brands.
3. Waking, option A: the pointer is a lantern that wakes what it passes over; each stop's main piece also wakes on arrival; the lantern grows down the page; by the contact stop everything is awake.
4. Design work is done by the main session (Fable). Opus agents build well-specified parts and check the result.

## Out of scope

The Next.js port, a CMS, analytics, a contact form that sends, sound, and any change to the live site. This is a static prototype in `public/samples/sleeping-moon/`.

## 1. The system

Everything below is shared by the journey page and the brand pages, and lives in `moon.css` and `moon.js`.

### Ink and colour

- Night `#0c0620` is the ground. Lilac `#b9a2ff` is the one ink: every sleeping picture, rule, ornament and display letter is drawn in it. Mist `#d9cfff` is reading text. Cream `#fff1c9` marks the awake or current thing (labels, focus ring).
- Colour belongs only to awake things: Lana's real work and the painted objects.
- A brand page swaps the pair: its ground is that brand's darkest palette colour, darkened until it is below 12 percent lightness, and its ink is the brand's accent, lightened until text in it reaches 4.5:1 on that ground. Both are computed and checked in code, not picked by eye.
- The contact stop is dawn: the ground lifts from `#2b1550` through `#d9b8e8` to `#f3c9c0`, and text there is ink-dark `#2b1470`.

### Bitmap

- A picture is a `.pic` holding the full-colour image and a canvas. The canvas has one canvas pixel per cell (cell about 2 CSS px for small pictures, 3 to 4 for large ones) and is scaled with `image-rendering: pixelated`. Each cell knows whether it is inside the shape, whether its ink is on (8×8 Bayer dither of lightness, levelled around the picture's own mean, with a solid outline), and its colour.
- A bitmap is built only when its picture comes within one screen of the viewport, and rebuilt on resize.
- Three states per picture: asleep (1-bit), lit (colour pixels at cell size, wherever the lantern covers it), awake (the sharp full-colour image, after a dither wake of about 300ms; asleep again in about 200ms).

### The lantern

- A circle of light that follows the pointer. Inside it, sleeping pictures show their colour pixels; the edge is dithered with the same Bayer order, never blurred. Radius 9u on the first screen, growing with scroll progress to 22u at the about stop (u is the layout unit, see Grid).
- Hover, keyboard focus or tap wakes the whole item (the awake state). The lantern alone never hides or reveals content that is needed to use the site: every label and every link is readable while asleep.
- Arrival: when a stop's main piece is centred in the viewport it wakes by itself once and stays awake while it is the current stop.
- Phones and touch: there is no pointer, so the lantern sits at the centre of the screen and pictures light up as they scroll through it. The first tap on a door or tile wakes it; the second opens it.
- Only pictures the lantern overlaps are redrawn, at most once per animation frame. Nothing is redrawn while the pointer is still.
- Quiet mode (a switch in the masthead, remembered) and `prefers-reduced-motion`: no lantern, no camera, everything shown awake in colour.

### Type

- Display: Redaction. Asleep it is the coarse cut (Redaction 35); letters inside the lantern, and the whole heading when its stop is current, switch to the smooth cut. Sizes: name `13.4u`, stop title `clamp(44px, 6.2u, 96px)`, item title `clamp(26px, 2.6u, 40px)`.
- Labels: Pixelify Sans, 15 to 16px, lilac. Reading text: Inter Tight 17px, mist, at most 60 characters a line. Reading text is never bitmap and never changes.
- Sentence case everywhere. No text under 14px.

### Frame, masthead, foot

- Every screen sits inside the ruled frame with stair-stepped corners.
- The masthead is fixed at the top of the viewport on the journey and brand pages: left, "The night almanac" and the stop's number; centre, a small bitmap moon whose phase shows how far down the journey you are (full at the top, thin crescent at the about stop, a rising sun at contact), flanked by the six stops as phase marks that are links (Brands, Posters, Films, Products, About, Contact) with the current one in cream; right, the quiet-mode switch. Under 760px it is the moon, a "Menu" button that opens the six stops full-screen, and the switch.
- One live line under the masthead (`aria-live="polite"`) describes whatever is awake, as on the sample.
- On the first screen the masthead's centre shows that line ("UI/UX and graphic designer in Manila" at rest) and no small moon, because the large moon is on screen; the small moon and the six phase links fade in once the first screen has scrolled away.

### Ornament

- Engraved bitmap ornaments from the existing art (`brand/art/e_moth.webp`, `e_lily.webp`), dithered in ink: a moth and a lily in opposite corners of a plate, mirrored on the next plate. They wake under the lantern like everything else.
- Star-chart lines: 1px dotted ink lines that join related things (the six doors to the moon on the first screen; a brand's key visual to its palette on a brand page).
- Pixel stars: a fixed scatter per plate, never over text or pictures.
- No other decoration.

### Grid

- Layout unit `u = min(1vw, 1.6vh)`; a plate is 100u wide. Everything is placed on one centre axis or in mirrored columns, on a 12-column grid with margins of 3.6u, and a spacing scale of 0.6, 1.2, 2.4, 4.2, 6.6u.
- Alignment is checked by a script that reads element boxes: off-axis offsets, mirrored column positions, row pitch, and left and right margins must agree within 1px.

## 2. The first screen, pushed

Keeps the approved composition: the sleeping moon in the centre, the name across the bottom cutting into it with a night halo, six doors in two mirrored columns.

Additions:

- The lantern, and the name waking letter by letter under it.
- A moth and a lily in opposite corners; dotted chart lines from each door to the moon's edge.
- The moon reacts: it has two faces, asleep and awake (eyes open; a second engraving made to match the first). While any door is fully awake the moon opens its eyes, changing through the dither order in about 240ms, and closes them when the door sleeps. On a door click its eyes stay open while the plate wakes and the camera pushes in.
- The headline swap to the door's name becomes a dither wipe, not a fade.
- Clicking a door travels down the same page to that stop (a camera push, then a scroll jump), not to another site.

## 3. The journey: one page, about eight screens

Native scrolling throughout; nothing pinned, nothing that captures the wheel. Each stop is one plate, one screen tall at 1440×900, with one main piece.

| Stop | Main piece | Layout | Interaction |
|---|---|---|---|
| Moon | The moon and the six doors | As above | Lantern, doors |
| I Brands | The ten key visuals | Strict 5×2 grid of equal tiles, each asleep in its own brand's ink on its own brand's ground; name under each | Tile wakes on hover, focus or tap; click opens that brand's page |
| II Posters | Twelve posters | 6×2 contact sheet of equal tiles, numbered in the label font | Click opens the poster in the viewer, with previous and next |
| III Films | One film still, large, awake | The still at about 58u wide on the axis; under it a strip of the ten stills as small sleeping tiles | Choosing a tile wakes it and swaps the large still with a dither wipe; title, role, length and "Watch on Google Drive" beside it |
| IV Products | One device, large, awake | Four tabs on the axis; the device left of centre, the text right, on the grid | Tabs swap the app; small sleeping thumbnails swap the screen |
| V About | Lana's portrait as a bitmap | Portrait left in an engraved oval; statement, four roles, awards and education right | Portrait wakes on arrival and under the lantern; roles open one at a time |
| VI Contact | The letter, at dawn | Sky lifts to dawn; a paper letter on the axis; everything on this plate is awake | "Email Lana", "Copy the address", LinkedIn, GitHub |

- Every stop has the frame's corner ornaments, mirrored alternately, a title set as "II Posters" with the numeral in the label font, and one line of text.
- Phones (under 760px) and upright tablets: the same plates as one column. The brands grid becomes 2 columns, the poster sheet 3 columns, the film strip a sideways row you can swipe, the product and about plates stack picture first, and the moon screen is the column layout of the approved sample.
- The viewer (lightbox) is shared: image, title, count, previous, next, close; arrow keys, Escape, focus returns to the opener.
- Content comes from `data.js` (brands, posters, films) and from the products and roles text already written in `public/samples/almanac/`.

## 4. Brand pages

One template, `brand.html?b=<slug>`, ten brands, in that brand's own ground and ink (see Ink and colour).

- Top: the brand's name very large in Redaction on the axis; label line (number of ten, organisation, date); tagline.
- The key visual, large, on the axis, asleep in the brand's ink and waking on arrival.
- The sheet below, on the 12-column grid: the brief (the full paragraph); the palette as five squares that copy their hex code; roles and tools as label lines; a link to the campaign post where one exists.
- Every pubmat in a strict grid of equal-width tiles, asleep, waking under the lantern and on hover; click opens the viewer.
- Foot: previous brand and next brand as two large links with their key visuals asleep; the masthead moon returns to the journey at the brands stop.
- Without JavaScript the page shows a plain list of the ten brands linking to the journey.

## 5. Files

`public/samples/sleeping-moon/`:

| File | Holds | Built by |
|---|---|---|
| `moon.css`, `moon.js` | The system: tokens, frame, masthead, type, bitmap, lantern, ornament, viewer, quiet mode | Fable |
| `index.html`, `journey.css`, `journey.js` | The journey page; the moon stop and the brands stop | Fable |
| `brand.html`, `brand.css`, `brand.js` | The brand page template | Fable |
| `stops.css`, `stops.js` | Posters, films, products, about, contact, composed from the system | Opus, from a written brief and the two finished stops as the pattern |
| `data.js`, `art/` | Content and art (door pictures from `almanac-v4/art/`, the two moon faces, engraved ornaments) | Fable (scripts) |
| `README.md` | Each shared class and function with a one-line example | Fable |

## 6. Access and speed

- WCAG AA contrast for all text, measured from screenshots on every stop and every brand page.
- Every interactive thing is a real link or button with a name, at least 44px, reachable in visual order by keyboard, with a visible cream focus ring. Hover is never the only way to anything.
- Every image has `width`, `height` and `alt`; nothing shifts as bitmaps draw (pictures reserve their box).
- Nothing moves when the page is left alone.
- No libraries, no WebGL. Bitmaps are built lazily; the lantern redraws only what it overlaps.

## 7. Checks before Lana sees it

A Playwright script set in the scratchpad, run at 1440×900, 1024×768, 768×1024 and 390×844:

1. Alignment measurements per plate (see Grid).
2. Every door, tile, tab, role and button by mouse and by keyboard; the viewer; the brand pages for all ten brands.
3. Lantern: pictures under it light, pictures outside it sleep, no redraw while still.
4. Contrast sampled per stop and per brand page.
5. Five cold loads end pixel-identical; no console errors; no horizontal overflow.
6. Quiet mode, reduced motion, no JavaScript, phone taps.
7. An Opus reviewer grades the result against `docs/v3/rubric.md` and lists defects; defects are fixed before the hand-over.

## 8. Order of work

1. Fable: the system, the pushed moon screen, the brands stop, the brand template; checks 1 to 6 on those.
2. Opus: the five remaining stops from the brief; same checks.
3. Opus reviewer: check 7. Fable fixes.
4. Hand to Lana with the measured results and the known limits.

## 9. Changes after Lana's first review of the build (2026-11-16)

Lana's notes, and what replaced the sections above:

1. "When you scroll through the brands, you can see one by one, with its respective backgrounds, like before. Same with the posters, and same with the UI/UX code." The brands grid became a **reel**: the stop is tall, its stage sticks to the window, and scrolling shows one brand at a time. A plate echoes the moon screen (the key visual in the centre, the name across the bottom, facts in two mirrored columns), sits on that brand's own backdrop cut into two flat tones, and takes that brand's two colours; the window's frame, masthead and foot take them too. One plate dissolves into the next through large dither tiles, driven by the scroll; the wheel is never captured. Numerals, two arrows and the arrow keys jump between plates. Products use the same reel.
2. "The branding sheet previews must show a few pubmats at a time, like before." Each brand plate shows three pubmats from its sheet in plain colour and a link to the rest; each opens in the viewer.
3. "The individual posters, make them like a carousel instead, like before." Posters are a carousel: one row, the middle poster awake and full size, its neighbours asleep and smaller; drag, swipe, arrows, arrow keys or a click on a neighbour move it; the middle one opens large. The stop takes the middle poster's two colours.
4. "Films should be video editing theme." Films is an editor: a monitor with a timecode readout, and a timeline with a ruler, one video track of ten clips sized by length, a waveform track and a playhead.
5. "The bitmap in some areas makes my eyes hurt." Photographs dither at higher contrast (fewer mid-grey checkerboards) and with coarser pixels when small; backdrops are smoothed and cut into two flat tones with no dither; small previews are shown in colour; dissolves use large tiles.
6. "The cursor is too big, maybe change the hover mechanism?" The lantern circle was removed. A picture wakes whole when you point at it, focus it or tap it. Letters of a heading still take the smooth cut close to the pointer.
7. "The about section is short, copy the old one." About now carries everything from `lib/content.ts`: the statement, six roles with their points, education, awards, certifications, seven skill groups and the toolkit.

## 10. Changes after Lana's second and third reviews (2026-11-16 and 2026-11-17)

Lana's notes: "the ui ux part should have like options for the screens", "the hero section picking transition should be more animated", "check the ui slop elements and change them", "fix the about and the footer layout, they're too boring and not organized", "the border is giving ai", and then "I like the branding sheet before, so put the brand name on the side, then the pubmats, 3 or 4 at a time, on the right". What replaced the sections above:

1. **No borders.** The window frame and its corner marks are gone (`--edge: 0`), and so are dashed rules, outlines on pictures, thumbnails and carousel items, and offset button shadows. Things are separated by space, type and colour. `.btn.solid` is a plain block in ink; `.btn.line` is an underline that draws away on hover. Buttons rise 2px on hover and press to 0.98.
2. **Travelling between stops.** `SM.travel(id, point)` closes a dither iris in the destination's ground colour from the point that was clicked (460ms), shows the stop's numeral and name in its ink, jumps, and opens from the centre (440ms). The masthead links use it.
3. **Picking a door on the first screen.** The chosen door wakes and flies to the centre at 42% of the window height; the other doors fall outward, rotating, 35ms apart; the moon opens its eyes and wakes; the name breaks apart; then the iris carries you to the stop.
4. **Products show their screens as options.** Each app lists its screens by name ("Dashboard", "Client list", "Intake"…) with a small preview in colour; choosing one swaps the main screen with a dither wipe. Previous and next arrows sit on the screen itself.
5. **About is a scene and a timeline,** after Lana's references (Ayush's "journey so far", Manisha's collage, Adya's framed portrait): the portrait stands on the axis where the moon stands on the first screen, with "Hello, I'm Lana" across it, the statement on the left and the present on the right; then the six roles alternate along an axis with moon-phase nodes (full now, thinner going back), the axis filling as you scroll; then three columns of study, awards and certifications; then the skills as one wall of type.
6. **Contact is the dawn and the foot.** "Let's talk", the address set large with a copy button, and the sleeping moon setting behind a band of ground that holds the links and the sign-off.
7. **A brand plate is its sheet.** The name, date, line, a sentence and what Lana made sit in a left column of 27u, with "Open the sheet". On the right a strip of the pubmats themselves, 18.5u tall, so three squares or four portraits are in view, moved by the arrows, the arrow keys, a swipe or a trackpad; the line under it says which are in view ("4 to 6 of 10"); each opens in the viewer. The name is sized so its longest word fits the column. On a phone the name, line and button come first and the strip below shows one and a half pieces.

## 11. About as a moon calendar, and the templated parts removed (2026-11-17)

Lana: "recheck the AI slop, because they all look AI slop", especially About. What read as generated: every part of About opened with a huge centred heading; the timeline alternated left and right around dots on a line; awards sat in three centred columns with an icon on top; small labels sat above every heading; a status badge with a square dot; and the foot line repeated the tagline already on screen. Lana chose the moon calendar and asked to keep the stars and the moths.

1. **Who.** One left edge: the portrait on the left, Lana's statement and "And I can do it for you, too." set large beside it, and the roles and city as one plain sentence. "Hello, I'm Lana" and the right-now/studying/won trio are gone.
2. **Year by year.** Six moons in a row (2026, 2025, 2023, 2022, 2020, 2019), full for 2026 and thinner going back, as a tab list (click, arrow keys, Home, End). The chosen year's page wipes in: the year set large on the left, and on the right its entries written as almanac lines ("Started as…", "Won…", "Certified:…", "Graduated from…"), each with its dates and points. Study, scholarships, awards and certificates are filed under their year with the roles.
3. **What I work with.** A plain left-aligned index, one skill group a line. The "Every day" row is gone; every tool in it is in the index.
4. **Elsewhere.** The foot line on a reel names the next piece ("Next: Tabitayo") instead of repeating the tagline. "What I made" on a brand plate is a sentence ("I made its logo, key visual and merch."). The contact status is part of the sentence under "Let's talk".

## 12. Round 5: rooms behind the doors (Brands first)

Lana's note: the hero's interaction is good but the rest of the page does not carry it; it looks too plain. Research on her reference sites (docs/v5/research-a.md, research-b.md, research-c.md) pointed one way: the hero's world holds every section, lists become objects, and pointing at an object wakes one part of it. Lana chose "Rooms from the doors" and "One section first": each door object on the first screen becomes its section's room, built one at a time, starting with Brands.

1. **The Brands room.** The brands door is a holder of seed packets, so in the room each brand is a packet. A carved wooden holder (art/holder-back.webp behind, art/holder.webp in front, the ten packet backs from art/packets/p0–p9.webp between) stands along the bottom of the window. Arriving deals the packets into it, 40ms apart. The current brand's packet is drawn out and turns over (rotateY): its face is the key visual in a window, waking from bitmap into colour, under a scalloped top with the brand's name and a numeral on the label. Pointing at the drawn packet tilts it a few degrees towards the pointer with a sheen that follows. Beside it: the date line, the tagline, one sentence of what the brand is and what I made, the sheet button, and the pubmat strip as before. The packets in the holder replace the 01–10 numerals: pointing at one lifts it and names it, choosing it draws that brand. Scroll still steps one brand at a time.
2. **The guide.** A small moon (guide.js, guide.css) comes down from the big one when you leave the first screen and sits on the drawn packet's corner, or beside a stop's heading. It sleeps in lilac and opens its eyes (the painted moon) while you point at a piece of work. At the contact stop it sets. It moves only by transform and only on scroll, a stop change or a pointer; quiet mode places it without travel.
3. **Phone.** The packet sits left of the text in a third of the width, the strip below at 30svh, the holder along the bottom; no tilt. The guide sits on the packet's left corner.
4. **Next.** If Lana likes the room: Posters on the easel, Films on the projector beam, Products on the phone, About in the hand mirror, Contact as an envelope.

**Revision, same day.** Lana did not like the drawn packet's shape (it read as a book) but liked the idea. The card is gone: the brand's key visual itself, frameless, rises out of its own packet in the holder (it starts small at the packet's mouth, measured per layout in reel.js as `--fx`/`--fy`, and grows into place; leaving, it sinks back faster). The chosen packet stays lifted. The brand name moved into the text, set large. Lana also found the realistic moon face creepy; `art/moon-asleep.webp` and `art/moon-awake.webp` are now a storybook face on the same engraved moon (lash curves and rosy cheeks asleep, small round eyes awake). The old faces are kept in the scratchpad (`v5/moon2/ref.webp`, `old-awake.webp`).
