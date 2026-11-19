# Almanac v2: build contract

A static prototype of Lana Huertas's portfolio as one painted night garden you travel through by scrolling. The full brief is `docs/night-almanac-master-prompt-v2.md` (repo root of this worktree); read the sections named in your task. This file is the contract every chapter builder follows.

- Served at http://127.0.0.1:3900/samples/almanac-v2/index.html (a Next dev server already runs on 3900; it serves `public/` as static files; do not start, stop or restart any server or process).
- Folder: `public/samples/almanac-v2/`. Plain HTML, CSS and JavaScript. No build step, no libraries, no CDN scripts.

## Who owns what

| File | Owner |
|---|---|
| `index.html`, `v2.css`, `v2.js`, `data.js`, `BUILD.md`, `art/` | Core. **Do not edit.** If you need a change, say so in your final report. |
| `ch-gate.css`, `ch-gate.js` | Chapters `#gate` and `#cabinet` |
| `ch-brands.css`, `ch-brands.js` | Chapter `#brands` |
| `ch-wall.css`, `ch-wall.js` | Chapters `#posters` and `#films` |
| `ch-pond.css`, `ch-pond.js` | Chapters `#products`, `#about` and `#talk` |

Only create and edit your own two files. Other builders are working in this folder at the same time. Never commit, never run git commands that change anything.

## How a chapter works

`index.html` already holds each chapter:

```html
<section class="chapter" id="brands" style="--len: 11">   <!-- pinned: the section is 11 screens tall -->
  <div class="curtain">…</div>                           <!-- wisteria passage, handled by core -->
  <div class="stage">                                    <!-- sticks to the viewport, 100svh, overflow hidden -->
    <div class="plane far"><img the painted scene></div> <!-- moves a little with --p, handled by core -->
    <div class="mount" id="m-brands"></div>              <!-- YOU fill this from your ch-*.js -->
  </div>
</section>
```

- **Pinned chapters** (`#gate` 2.2 screens, `#cabinet` 1.8, `#brands` 11, `#talk` 1.7): the stage stays on screen while you scroll through the section. Core writes `--p` (0 to 1 across the pin) and `--in` (0 to 1 while the chapter arrives) on the `<section>`. Use them in CSS (`transform: translateX(calc(var(--p) * -50%))`) or subscribe in JS: `ALM.on("brands", (p, enter) => { … })`.
- **Flow chapters** (`class="chapter flow"`: `#posters`, `#films`, `#products`, `#about`): the scene stays put (sticky) and your content scrolls over it normally. `--p` still runs 0 to 1 across the chapter.
- You may change your chapter's `--len` from your JS (`section.style.setProperty("--len", n)`), then call `ALM.tick()`.
- Put your content in `.mount`. Give the mount `position: absolute; inset: 0` in a pinned chapter, or normal flow in a flow chapter. Use `<div class="body">` for the centred content column (width `var(--wrap)`), `.scrim.left` / `.scrim.all` / `.scrim.ends` behind text that sits on the painting, and extra planes if you want depth: `<div class="plane near">` (z 3) and `<div class="plane front">` (z 6, grows toward the camera with `--p`).
- **Still mode** (quiet mode switch or `prefers-reduced-motion`): core adds `.quiet` on `<html>`, un-pins every chapter (`height: auto`, stage becomes a normal block with `min-height: 100svh`), and reports `--p: 0`, `--in: 1`. Your chapter must then be a complete, readable, normal section: nothing hidden, nothing depending on `--p`. Write the rules under `.quiet …` (core adds `.quiet` for reduced motion too, so one selector covers both). `ALM.still()` tells you in JS; the event `alm:quiet` on `document` fires when the switch flips.

## What core gives you (`ALM`)

`ALM.$`, `ALM.$$`, `ALM.clamp(v)`, `ALM.still()`, `ALM.on(id, fn)`, `ALM.goTo(id, at = 0)` (travel to a chapter, `at` is 0 to 1 inside its pin), `ALM.moonSvg(f)`, `ALM.wear(el)` / `ALM.wearAll(scope)` (the worn-letter effect; call it on headings you inject with class `wear`), `ALM.tick()`, and `ALM.lightbox([{ src, w, h, alt, cap }], index)` (the shared full-screen viewer with previous, next, arrow keys and Escape; use it for every "open large").

`DATA` (from `data.js`): `DATA.brands[]` = `{ slug, name, org, date, tag, brief, roles[], tools[], accent, href, backdrop, palette[5 hex], imgs[[smallSrc, fullSrc, w, h], …] }` (imgs[0] is the key visual); `DATA.posters[]` = `{ id, t, m, y, img: [smallSrc, fullSrc, w, h] }`; `DATA.films[]` = `{ id, t, url, d, role, img: [src, w, h] }`.

## Design system (from `../almanac/almanac.css`, already loaded)

Rendered reference: http://127.0.0.1:3900/samples/almanac/system.html. The earlier flat version of every chapter is `../almanac/index.html` + `almanac.css` + `almanac.js`; reuse its markup and classes where they fit.

- Tokens: `--night #140a2c`, `--plum`, `--velvet`, `--paper #efe8ff`, `--card #fffdf8`, `--ink #2b1470`, `--cream #fff1c9`, `--iris`, `--lilac`, `--orchid` (glow only), `--rose` (stamps only), `--mist`; fonts `--display` (Redaction), `--script` (Pinyon Script, 32px and up), `--body` (Inter Tight), `--mono` (DM Mono); radius `--r-in 4px`, `--r-ctl 14px`, `--r-card 20px`; easing `--enter`, `--move`, `--hinge`; durations `--fast 140ms`, `--small 220ms`.
- Classes: `.display`, `.sig`, `.lede`, `.hud`, `.btn.glass` (one main action per screen), `.btn.paper`, `.btn.line`, `.paper`, `.plate`, `.tape`, `.chip`, `.stamp`, `.wear`, `.lana` (Lana's sticker, `art/lana.webp`, 520×520: place it once in each chapter as the guide, never over the work).
- Rules: sentence case, never all caps; body text 16px or more, labels 14px or more; WCAG AA contrast (cream or card on night, ink on paper; never small text in orchid or rose); no red; 44px minimum targets; visible focus (already styled); every image has `width` and `height` and `alt`; `loading="lazy"` below the first screen.
- Motion: hover lift 2px or zoom 1.02 to 1.03 in 140ms; press `scale(0.98)`; small state changes 180 to 260ms; nothing you start runs over 300ms except one opening per chapter (up to 600ms). Name the transitioned properties (never `transition: all`). Never put `filter`, `mask` or `clip-path` on something that animates forever. Never write CSS variables on `<html>` per frame. No fade-in-on-scroll for every block. Hover colour changes are instant.
- Every drag has a button and keyboard version. Every interaction works in still mode.
- No horizontal page scroll at any width from 360 to 1440. Phones (under 860px) get the same story in one column; the route bar sits at the bottom there, so keep 90px clear at the bottom of pinned stages.
- Privacy: never show a phone number, birthday, family names or street address. The only contact is the email already in `../almanac/index.html`.

## Art you can use

In `art/` (this folder), all transparent WebP: `f_wisteria` 1600×671 (hanging curtain), `f_corner` 900×962 (lilies growing from the bottom-left corner; mirror it for the right), `gate-l` 706×920 and `gate-r` 707×920 (two halves of the iron gate; they meet at the centre), `pad` 640×640 (lily pad from above), `sheet` 1400×788 (white cinema sheet between two trees with flowers below; the white rectangle is about x 17% to 82%, y 20% to 79%), `ledger` 1200×902 (open blank book from above), `balloon` 520×877 (paper hot-air balloon), `arch` 892×1418 (conservatory doorway arch; its opening is transparent), `lana` 520×520, `drawer` 324×225 (one drawer front of the cabinet).

In `../almanac/art/`: scenes `s_hero`, `s_path`, `s_glass`, `s_clear`, `s_pond`, `s_study`, `s_dawn` (1672×941, each with a `-sm` 960px cut); objects `o_cabinet` 821×900, `o_lantern` 850×1079, `o_frame` 760×1052 (oval opening transparent), `o_book` 760×789, `o_jar` 631×1329 (glass bell jar; use `mix-blend-mode: screen` on dark).

In `../brand/art/`: paper cut-outs `p_bloom`, `p_bud`, `p_moon`, `p_fly`; glass `g_bloom`, `g_bud`, `g_moon`; engravings `e_moon`, `e_lily`, `e_moth` (cream line on transparent).

Brand backdrops: `/art/backdrops/<slug>.webp` (already in `DATA.brands[].backdrop`). Real work: `/work/…` paths from `DATA`; products: `/work/psyclick/app-dashboard-sm.webp` 960×600, `/work/bloom/today.webp` 500×1082, `/work/algebrawl/battle.webp` 1040×780, `/work/shot-debtledger.webp` 500×1140, plus the other files in `public/work/psyclick`, `public/work/bloom`, `public/work/algebrawl`.

## Checking your work

```bash
python "C:/Users/Lana/AppData/Local/Temp/claude/a106e1d8ce434dbd/493cf6da-5ec2-4eb5-9ea2-65787c2c5136/scratchpad/qa-lc/v2shot.py" <chapterId> <width> <height> [rm]
```

It opens the page, travels to the chapter, and saves screenshots at several points of its scroll to `…/qa-lc/shots/v2-<chapterId>-<width>-<n>.png`, then prints console errors, broken images and horizontal overflow. Add `rm` for reduced motion. Look at the screenshots with the Read tool. Check at least `1440 900`, `390 844` and `1440 900 rm`. For clicks and drags write your own short Playwright script next to it (Python, `sync_playwright`, `channel="chrome"`), and keep such scripts in that scratchpad folder, not in the repo.

Until the other builders finish, their chapters are empty and their CSS or JS files may be missing (404 for those files is expected; any other console error in your chapter is yours to fix).

## Your final report

Under 200 words: what you built per chapter, the interactions and their button or keyboard versions, what you verified (widths, still mode, errors), anything unfinished or any change you need in a core file.
