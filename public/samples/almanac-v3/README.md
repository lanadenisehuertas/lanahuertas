# Night Almanac v3: the shared system

One night sky you travel down, from the garden gate to first light. `docs/v3/spec.md` is the contract. This file covers what is already built and how the stops 3 to 7 plug into it.

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Route bar, phone menu, all seven stops with ids, heads and mounts, footer. Script order: `data.js`, `v3.js`, `gate.js`, `brands.js`, `stops.js`. |
| `v3.css` | Tokens, ground and starfield, type, buttons, frames, route bar, menu, pins, stops, entrance, worn letters, lightbox, footer, quiet mode. |
| `v3.js` | The global `V3` (below). |
| `data.js` | The global `DATA`: `brands`, `posters`, `films`. |
| `gate.css`, `gate.js` | Stop 1, finished. |
| `brands.css`, `brands.js` | Stop 2, finished. |
| `stops.css`, `stops.js` | Empty. Stops 3 to 7 go here. |
| `art/` | `lantern.webp`, `frame.webp`, `balloon.webp`. The gate art comes from `../almanac-v2/art/`; the brand backdrops come from `/art/backdrops/`. |

## Where stops 3 to 7 go

Each stop is a `section.stop` with a finished head and an empty mount. Render into the mount; leave the head alone.

| Stop | Section | Mount | Source |
| --- | --- | --- | --- |
| 3 Posters | `#posters` | `#posters-mount` | `DATA.posters` |
| 4 Films | `#films` | `#films-mount` | `DATA.films` |
| 5 Products | `#products` | `#products-mount` | `PRODUCTS` in `../almanac/almanac.js` (copy the text, do not load that file) |
| 6 About | `#about` | `#about-mount` | the about text in `../almanac/index.html` |
| 7 Contact | `#talk` | `#talk-mount` | the spec's contact section |

After rendering, call `V3.moons(mount); V3.wearAll(mount); V3.enter(mount);`.

## Tokens (`:root` in v3.css)

- Ground: `--sky-0` #0c0620, `--sky-1` #140a2c, `--sky-2` #1d1040, `--sky-3` #2b1550, `--dusk` #5a3a9a, `--dawn-1` #d9b8e8, `--dawn-2` #f3c9c0.
- Colour: `--cream` headings, `--mist` body text, `--lilac` labels and focus rings, `--orchid` glow only (never text), `--ink` text on light surfaces, `--card` the contact letter, `--ink-label` labels on the card.
- Type: `--display` Redaction, `--body` Inter Tight, `--mono` DM Mono; sizes `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-lead` 20, `--fs-body` 17, `--fs-label` 14.
- Shape: radii `--r-img` 6, `--r-ctl` 14, `--r-pill` 999; the one shadow `--lift`.
- Space: `--s1` to `--s6` = 8, 16, 24, 40, 64, 104. `--margin` 64/40/24, `--gutter` 24/16.
- Route bar: `--bar-top`, `--bar-h`, `--bar-zone` (72px on desktop). Keep content below `--bar-zone`.
- Motion: `--enter` (ease out), `--move` (ease in out), `--fast` 140ms.

## Shared classes

Layout
- `.wrap`: the page column, margins on both sides, max 1312px. `<div class="wrap">…</div>`
- `.grid`: the 12-column grid with the gutter. `<div class="grid">…</div>`
- `.stop`: a plain section with 104px above and below. `<section class="stop" id="posters">`
- `.pin` + `.stage`: a pinned stop. `--len` sets its height in screens and `.stage` sticks for the whole length. `<section class="pin" style="--len:3"><div class="stage">…</div></section>`
- `.head`: a stop's heading block (label, h2, lead). `<header class="head" data-enter>…</header>`

Type
- `.display`: the gate name size. `<h1 class="display">`
- `.h2`, `.h3`: stop and item headings in Redaction. `<h2 class="h2">Films and motion</h2>`
- `.lead`: the 20px line under a heading. `<p class="lead">…</p>`
- `.label`: 14px DM Mono line in lilac, flex with an 8px gap. `<p class="label"><span class="moon" data-phase="0.5"></span>Films</p>`
- `.label .sep`: the ` · ` between label parts. `02 / 10<span class="sep"> · </span>FEU Tech ACM`
- `.italic`: Redaction italic (taglines). `<p class="italic">Chrome hands, reaching back in.</p>`
- `.wear`: worn letters on a heading (see `V3.wear`). `<h2 class="h2 wear">Let's talk</h2>`
- `.vh`: visually hidden, still read aloud. `<span class="vh">(opens in a new tab)</span>`
- `.skip`: the skip link, shown on focus. Already in the page.

Icons
- `.moon[data-phase]`: a moon-phase icon, 0 new to 1 full; `V3.moons()` fills it. `<span class="moon" data-phase="0.66"></span>`

Buttons (52px tall; there are only two kinds)
- `.btn.primary`: violet glass, one per screen at most. `<a class="btn primary" href="#brands">See the work</a>`
- `.btn.secondary`: cream outline. `<a class="btn secondary" href="#talk">Email Lana</a>`
- `.btn.icon`: a 52px square icon button, add to either kind. `<button class="btn secondary icon" aria-label="Next">${V3.ICON.next}</button>`
- `[disabled]` or `[aria-disabled="true"]` dims a button.

Images
- `.frame`: a 6px-radius image box with the one shadow; the img covers it. `<div class="frame">${V3.pic({...})}</div>`
- `.press`: makes a frame a control: zoom 1.02 on hover, press 0.98, focus ring. `<button class="press" type="button"><span class="frame">…</span></button>`

On the light card
- `.on-card`: switches text inside to ink (`h2`, `h3`, `p`, `.label`, `.btn.secondary`, focus ring). `<div class="letter on-card">…</div>`

Entrance
- `[data-enter]`: rises 16px and fades in over 400ms the first time it is seen, 80ms apart, never again. Put it on wrappers (a head, a figure), never on buttons. `<figure data-enter>…</figure>`

Route bar, menu and viewer (already in the page; do not add more)
- `.route`, `.route-mark`, `.route-stops`, `.route-menu`, `.switch` (quiet mode), `dialog.menu`, `.menu-close`.
- `dialog.lightbox` with `.lb-fig`, `.lb-bar`, `.lb-title`, `.lb-count`, `.lb-link`, `.lb-x`, `.lb-prev`, `.lb-next`: built by `V3.lightbox`.
- `.foot`: the footer, ink on the dawn.

Quiet mode
- `html.quiet` is set from `localStorage["v3-quiet"]`, or by reduced motion when nothing is stored. It turns pins into one plain screen each, turns entrances off and stops all transitions. Style quiet variants as `.quiet .your-thing { … }`.

## V3 functions (v3.js)

- `V3.RM`: true when the reader asked for reduced motion. `if (V3.RM) …`
- `V3.$(sel, el?)` and `V3.$$(sel, el?)`: one element, or an array of them. `V3.$$(".poster", mount).forEach(…)`
- `V3.clamp(v, a = 0, b = 1)`: clamp a number. `V3.clamp(p * 2)`
- `V3.esc(s)`: escape text for HTML. `` `<h3>${V3.esc(film.title)}</h3>` ``
- `V3.still()`: true in quiet mode; nothing should move. `behavior: V3.still() ? "instant" : "smooth"`
- `V3.phone`: the `(max-width: 860px)` media query. `V3.phone.matches`
- `V3.moon(f)`: SVG markup for a moon at phase f (0 to 1). `el.innerHTML = V3.moon(0.5)`
- `V3.moons(scope?)`: fill every empty `.moon[data-phase]` in scope. `V3.moons(mount)`
- `V3.pic({src, w, h, alt, cls, srcset, sizes, lazy = true, priority})`: an `<img>` string that always carries width, height, alt and lazy loading. `V3.pic({ src: p.img, w: 1080, h: 1350, alt: p.alt })`
- `V3.pin(el, fn)`: call `fn(p, rect)` when the pinned section `el` moves; p is 0 at the pin's start and 1 at its end. It runs once a frame at most, only when p changes. `V3.pin(sec, (p) => stage.style.setProperty("--p", p))` (write on the stage, never on `<html>`)
- `V3.tick()`: ask for one pin update on the next frame. `V3.tick()`
- `V3.refresh()`: run every pin callback again on the next frame, after a layout change. `V3.refresh()`
- `V3.goTo(id | el, {at = 0, smooth})`: scroll to a stop; `at` picks a point in a pin's travel. `V3.goTo("films")`, `V3.goTo(sec, { at: 0.5 })`
- `V3.ground()`: put the sky's colour stops where the sections really are. It already runs on load, resize, font load and any body size change; call it yourself only after a change it cannot see. `V3.ground()`
- `V3.setQuiet(on)`: turn quiet mode on or off and keep the reader's place. It fires `v3:quiet` (below). `V3.setQuiet(true)`
- `V3.enter(scope?)`: register the `[data-enter]` elements in scope; in quiet mode they show at once. `V3.enter(mount)`
- `V3.wear(el)`: split a heading into letters that wear through Redaction 70, 35 and 10 when the pointer touches them; the heading keeps an `aria-label`. `V3.wear(h3)`
- `V3.wearAll(scope?)`: `V3.wear` every `.wear` in scope. `V3.wearAll(mount)`
- `V3.copy(text)`: copy to the clipboard; resolves to true or false. `if (await V3.copy("#c04bff")) say("Copied")`
- `V3.lightbox(items, i = 0, opener?)`: open the shared viewer at item i. Each item is `{src, sm?, w, h, alt, title?, link?: {href, text}}`; `sm` shows first, then the big copy swaps in. Arrow keys, Escape and focus return work. `V3.lightbox(posters.map(toItem), 3, button)`
- `V3.viewerOpen()`: true while the viewer or the phone menu is open; check it before handling arrow keys. `if (V3.viewerOpen()) return;`
- `V3.ICON`: `x`, `prev`, `next` SVG strings for icon buttons. `` `<button class="btn secondary icon" aria-label="Close">${V3.ICON.x}</button>` ``

Built in, nothing to call
- Every `a[href^="#"]` to a stop travels there with `V3.goTo` and closes the phone menu first.
- The route bar marks the current stop (`aria-current="true"`) as you scroll.

## The `v3:quiet` event

`document.addEventListener("v3:quiet", (e) => …)`. `e.detail` is `{ on, anchor, handled }`. `anchor` is the section under the line 30% down the screen before the switch. If your stop is the anchor and you put the reader back yourself, set `e.detail.handled = true`; otherwise `setQuiet` keeps the same point of that section on screen. See the handler in `brands.js`.

## Things to know

- The brand corridor overlaps the end of the gate: `.brands.pinned` has `margin-top: -25svh`. This removes a half screen of empty sky. Pin maths uses the section's own box, so nothing else needs to know.
- The sky's colour stops follow the sections (`--g1` to `--g5` on `body`). The dawn starts at the top of `#talk` and is full halfway through it. Text in `#talk` and the footer sits on light ground and must use ink.
- The contact head (label, "Let's talk", the line) belongs on the letter, the one `--card` surface. It carries `.on-card` already. The heading and line pass AA on the bare dawn; the label does not (2.2:1) until it sits on the card.
- The footer links to this README as "The design system behind this page" because v3 has no system page. Change the link if one is made.
- Page length: the gate and the corridor take about 6.75 screens (1.5 + 5.5, less the 0.25 overlap). The spec's 11 to 13 screens on desktop leave about 4.25 to 6.25 screens for stops 3 to 7 and the footer together. The page is 9.2 screens now with only the heads in place.
- Everything at rest is still. No idle loops anywhere, nothing per frame on `<html>`, no filter, mask or clip-path on anything that animates. Pins write one custom property on their own stage.
- Add `width`, `height` and `alt` to every image (`V3.pic` does it). Use `loading="lazy"` for anything below the first screen.
