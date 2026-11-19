# The sleeping moon: implementation plan

> **For agentic workers:** this plan departs from the usual template in three ways that Lana set: no commits (she commits only when she asks); the execution split is fixed (Fable builds the system and the design-critical screens inline, Opus builds the remaining stops from a brief and reviews); and steps do not carry pre-written code, because each screen is designed by looking at it and adjusting. Every task instead ends with checks that must pass.

**Goal:** a static prototype of Lana Huertas's portfolio where everything sleeps as a 1-bit lilac bitmap and wakes into colour under a lantern cursor, on arrival, and on touch, as one journey page plus a page per brand.

**Architecture:** plain HTML, CSS and JavaScript in `public/samples/sleeping-moon/`, served by the dev server on port 3900. One shared system (`moon.css`, `moon.js`) owns the bitmap, the lantern, type, frame, masthead and viewer; page files only compose it. Content comes from `data.js`.

**Tech stack:** no libraries. Canvas 2D for bitmaps. Playwright (Python) for checks, kept in the scratchpad.

**Spec:** `docs/superpowers/specs/2026-11-16-sleeping-moon-design.md`.

---

## Files

| File | Responsibility |
|---|---|
| `moon.css` | Tokens, grid unit, fixed frame, masthead, foot, type, picture states, ornament, viewer, quiet mode, phone rules |
| `moon.js` | `Bitmap` (build, draw, show, wake, face), the lantern loop, lazy building, letter waking, stop arrival, masthead moon and nav, viewer, quiet mode. Exposes `SM`. |
| `index.html`, `journey.css`, `journey.js` | The journey: moon stop and brands stop (Fable); mounts for the other five |
| `brand.html`, `brand.css`, `brand.js` | The brand page template |
| `stops.css`, `stops.js` | Posters, films, products, about, contact (Opus) |
| `data.js`, `art/` | Content and art |
| `README.md` | The system's classes and `SM` functions, one line each, for the Opus builder |

## Task 1: art (Fable)

- [ ] Cut the two moon faces from the matched pair to identical discs: `art/moon-asleep.webp`, `art/moon-awake.webp`.
- [ ] Copy the six door pictures from `almanac-v4/art/` and the engraved moth and lily from `brand/art/`.
- [ ] Copy `data.js` and add each brand's ground and ink (computed, contrast 4.5:1 or more).

Check: every file opens; the two moon discs overlay within 2px.

## Task 2: the system (Fable)

- [ ] `moon.css` and `moon.js` as in the spec, sections 1.
- [ ] `Bitmap`: kinds `paint` (shape from alpha), `photo` (whole rectangle), `line` (engraving), `moon` (disc, two faces); per-picture ink and paper from CSS variables; built lazily; drawn in once.
- [ ] Lantern: pointer circle with a dithered edge, radius from scroll progress; redraws only overlapped pictures; centre-of-screen lantern on touch devices; off in quiet mode.
- [ ] Letter waking for `.type` headings; stop arrival; masthead moon and six phase links; viewer; quiet switch.

Checks: a test page with one picture of each kind shows asleep, lit and awake correctly; no redraw while the pointer is still; no console errors.

## Task 3: the moon stop (Fable)

- [ ] Port the approved v4 composition onto the system.
- [ ] Add the lantern, corner moth and lily, chart lines, the moon's two faces, letter waking, the dither headline swap, and travel to stops on the same page.

Checks: measured alignment (axis offsets 0, mirrored columns, equal row pitch, equal margins); all six doors by mouse and keyboard; moon eyes open only while a door is awake; five cold loads identical; idle screen still; phone taps; quiet mode.

## Task 4: the brands stop and the brand page (Fable)

- [ ] Brands stop: 5×2 tiles in each brand's ground and ink, names under them, links to `brand.html?b=<slug>`.
- [ ] Brand page template as in the spec, section 4, checked for all ten brands.

Checks: alignment of the grid; contrast per brand; viewer; previous and next; phone layout; no overflow.

## Task 5: README and brief, then the five remaining stops (Opus)

- [ ] Fable writes `README.md` and a brief that names the two finished stops as the pattern.
- [ ] Opus builds posters, films, products, about and contact in `stops.css` and `stops.js`, and runs the same checks.

## Task 6: review and fixes

- [ ] An Opus reviewer grades the whole prototype against `docs/v3/rubric.md` and lists defects with screenshots.
- [ ] Fable fixes them and reruns the checks.

## Task 7: hand-over

- [ ] Report to Lana: the URL, what was checked with numbers, known limits. Update the project memory.
