# The sleeping moon: system notes

Lana Huertas's portfolio prototype. Everything sleeps as a 1-bit bitmap in one ink on the ground colour, and wakes into colour when you point at it, focus it or tap it, and when its stop arrives. (An earlier lantern circle around the pointer was removed: Lana found it too big.) Design: `docs/superpowers/specs/2026-11-16-sleeping-moon-design.md`.

Served at `http://127.0.0.1:3900/samples/sleeping-moon/index.html`. Plain HTML, CSS and JavaScript, no libraries.

## Files

| File | Holds |
|---|---|
| `moon.css`, `moon.js` | The system. Do not change these from a stop's files. |
| `index.html`, `journey.css`, `journey.js` | The journey page; the moon stop and the brands stop. These two stops are the pattern to follow. |
| `brand.html`, `brand.css`, `brand.js` | One brand's page (`brand.html?b=<slug>`). |
| `reel.css`, `reel.js` | The brands reel and the products reel (one thing at a time as you scroll, each on its own background and in its own two colours, dissolving through large dither tiles) and the posters carousel. Brands is a room of seed packets (`.r-board.room`): the current brand's packet is drawn from a carved holder along the bottom and turns over to show its key visual, tilting towards the pointer, with its pubmats beside it; the packets in the holder are the brand index. A product plate lists the app's screens as options. A reel item can bring its own markup with `board(i, n)`. |
| `guide.css`, `guide.js` | The guide: a small moon that comes down from the big one when you leave the first screen, sits on the element marked `data-perch` (the drawn packet) or beside a stop's heading, opens its eyes while you point at work and sets at dawn. |
| `stops.css`, `stops.js` | Films (an editor: monitor, timecode, timeline of clips), About (the portrait and statement, a moon calendar of years, a skills index) and Contact (the dawn: the address, the setting moon, the links on the ground). They fill `#m-films`, `#m-about`, `#m-talk` in `index.html`. |
| `data.js` | `DATA.brands`, `DATA.posters` (`{ id, t, m, y, img: [small, full, w, h] }`), `DATA.films` (`{ id, t, url, d, role, img: [src, w, h] }`). |

## Layout

- The unit is `--u` = `min(1vw, 1.6vh)`; a plate is `100u` wide and one screen is `62.5u` tall at 16:10. Size and place everything in `calc(N * var(--u))`, so the composition scales as one piece.
- A stop is `<section class="stop" id="…" data-label="II Posters" data-hint="line shown in the foot while this stop is current">` holding one `<div class="plate">`. The plate already has a `<header class="head">` with the numeral, the `h2.display.type` and one line. Put the stop's content after it, inside the mount.
- The window is fixed: masthead (top) and foot (bottom) take `var(--band)` at each end (`--edge` is 0: there is no frame). Between them there are about `51u` of height at 1440×900. A stop's head uses about `13u`, so the content has about `34u` if the whole stop is to sit in one screen, which it should.
- Everything sits on the centre axis or in columns mirrored about it. Use CSS grid with fixed `u` column widths and `justify-content: center` (see `.brand-grid` in `journey.css`, `.spec .plate` in `brand.css`). Spacing steps: 0.6, 1.2, 2.4, 4.2, 6.6 `u`.
- Under 760px wide, or when the window is taller than wide, the page is one column and `--u` is `1vw`. Write those rules under `@media (max-width: 760px), (max-aspect-ratio: 1/1)`.

## Colour and type

- Use the variables, never hex values: `--ground`, `--ink` (the bitmap and display colour), `--text` (reading text), `--mark` (the awake or current thing), `--rule` (lines). The contact stop has `class="stop dawn"`; while it is current the body gets `dawn` and the variables change to a light ground with dark text. Inside `.stop.dawn` set the same variables on the section so it is right even before it is current (copy the values from `body.dawn` in `moon.css`).
- Display type: `class="display type"` (Redaction; coarse cut asleep, smooth cut when its stop is current or the lantern passes). Labels: `class="label"` (Pixelify Sans 16px, ink; an `<i>` inside is a numeral in text colour). Reading text: the body font, 17px, at most 60 characters a line. Never under 14px. Sentence case.
- Buttons: `class="btn solid"` (one per stop, a plain block in ink) and `class="btn line"` (an underline).
- No boxes, cards, borders, outlines, rounded corners, shadows or gradients: Lana reads borders as machine-made. Separate things with space, type and colour. The only lines are the timeline axis and underlines.

## Pictures

```html
<span class="pic box" data-kind="photo"><img class="full" src="…" width="…" height="…" alt="…" loading="lazy"></span>
```

- `.pic` is one picture; `SM.pictures(scope)` turns every `.pic` inside `scope` into a bitmap (call it once after you add markup). The canvas is added for you.
- `data-kind`: `photo` (a rectangle: posters, stills, screenshots, portraits), `paint` (a painted object with a transparent background), `line` (an engraving), `moon`.
- `class="box"` makes the picture a fixed box that the image covers; give the box a size or an `aspect-ratio` in CSS, and `--pos: 50% 20%` to choose the crop. Without `box` the picture takes the image's own shape; size the `.full` image in CSS.
- `data-main` on a `.pic`: it wakes when its stop becomes current and sleeps when you leave. Use it on the one main piece of a stop.
- `data-cell="1.5"` makes that picture's pixels coarser (or `0.7` finer).
- A picture can have its own two colours: `style="--ink:#…;--ground:#…"`.
- A picture that is not inside a link or button wakes by itself under the pointer (`data-still` turns that off). You never draw anything yourself.
- `data-flat` on a `.pic`: two flat tones cut from a smoothed picture, with no dither. Use it for anything large that sits behind text.
- Keep sleeping pictures large and few. Small previews (under about 6u) are shown in plain colour: tiny bitmaps are unreadable and tiring to look at.

## `SM` functions

| Call | Does |
|---|---|
| `SM.pictures(scope)` | Makes bitmaps of the `.pic` elements in `scope`. |
| `SM.wakeable(el, { pic, line, on, off })` | `el` (a link or button) wakes its picture while hovered or focused; on a touch screen the first tap wakes it and the second activates it. `line` (or `data-line` on `el`) is shown in the foot. `pic` names another element whose picture should wake. |
| `SM.bitmap(el)` | The bitmap of `el` or of the first `.pic` in it: `.wakeUp(ms)`, `.sleep(ms)`. |
| `SM.swap(box, newChild)` | Replaces what `box` shows with a dither wipe. |
| `SM.view(list, index)` | Opens the viewer. `list` is `[{ src, w, h, alt, cap }]`. |
| `SM.say(text)` / `SM.say()` | Shows a line in the foot, or returns to the stop's resting line. |
| `SM.go(id)` | Goes to a stop. |
| `SM.travel(id, { x, y }, { onJump })` | Goes to a stop through the dither iris: it closes from the point in the stop's ground colour, shows its numeral and name, jumps (calling `onJump`), and opens. In quiet mode it jumps at once. |
| `SM.onStop(fn)` | `fn(stop, previous)` when the current stop changes. `SM.stop` is the current one. |
| `SM.quiet()` | True in quiet mode or reduced motion: then everything is awake and nothing animates. |
| `SM.type(el)` | Splits a heading into letters so they can wake (done for every `.type` on load; call it for headings you add later). |
| `SM.$`, `SM.$$`, `SM.u()` | Query helpers; the unit in px. |

## Rules

- Nothing moves when the page is left alone. No loops, no auto-advance.
- Hover is never the only way: every interactive thing is a real `<a>` or `<button>` with a name, at least 44px, reachable in visual order by keyboard.
- Every image has `width`, `height` and `alt`, and reserves its space.
- Transitions name their properties and take 140 to 220ms; in quiet mode (`.quiet` on `<html>`) they are off.
- The only personal details on the site are Lana's name, city, email and her two profile links.
