# Handoff — butterfly garden (updated 2026-10-29)

Branch `feat/brand-showcase-cont` (worktree `.claude/worktrees/brand-showcase-cont`).
Design: `docs/superpowers/specs/2026-10-29-butterfly-garden-design.md` (supersedes the sketchbook spec).

## Done 2026-10-29 (butterfly garden)
- Type: Redaction display + Inter Tight body + DM Mono labels; Cormorant, Archivo, pen script gone.
- Branding/videos/UI-UX as full-screen spreads (`components/showcase/Spread.tsx`): wash, index, edge
  zones, drag, keys, filmstrip + lightbox (branding), browser outline with tabs (UI/UX). 10 brands;
  posters row on the homepage (CS Night first). Wash colours live in `components/showcase/tone.ts`.
- Guide butterfly (`components/Butterfly.tsx`, art `public/art/butterfly-wings.webp`): flies the path
  through `[data-perch]` titles, lands beside them, loop on hover, click = next section,
  `butterfly:send` on contact success. Off on touch/<768px/reduced motion.
- Nav hides on scroll down, light over `[data-tone="dark"]`; hero block centred; wing-gradient `.btn`.
- About without scrapbook, portrait in the garden; contact = thank-you left, form right.
- Dead components and 86 dead CSS rules removed. `tsc`, eslint, `next build` pass.

## Earlier
- 13 brands (BiblioBOO and repeated pubmats removed), 10 videos, 3 UI/UX projects as full-bleed slides; artboards drawn by Codex from each key visual; text set straight on the art with a tone wash.
- Videos on the site sky, taped-in posters. Ink controls, pen font, doodles, note-paper form, sketchbook About.
- Perf: root-variable writes removed, no will-change/blur/turbulence, content-visibility on slides, scroll pause for loops, lazy images, lite mode on touch.
- `tsc`, eslint, `next build` pass.

## Done 2026-10-27
- Perf: hero wrappers `overflow-hidden` -> `overflow-clip`, so the 25 `.sl-par`
  parallax layers bind to the page and run on the compositor (they were bound to
  a non-scrolling box on the main thread). Loops running at page top 66 -> 50
  (half the fixed starfield still, smaller hero plants no longer sway).
- Slides fill the carousel height on phones (artwork stopped 300px short after
  visiting a taller slide). Section titles no longer break mid-word.
- Every slide checked at 1440 and 500; `/design`, `/videos`, `/ui-ux` checked;
  no horizontal overflow 320-1920. README and design-decisions updated.

## Next
1. Draft PR open against main; do not merge.
2. Older one-offs from `lib/content.ts` (TechIbig, Student Orgs Fair, ACM Ignition…) are no longer
   shown anywhere — ask Lana whether they join the posters row.
3. Perf: re-profile on a real (GPU) machine with 4x CPU throttle; headless software rendering showed
   the hero garden as the costliest layer and the butterfly at ~15% of frame time.
4. Contrast was checked per wash colour (tone.ts); no automated contrast script yet.
5. `README.md` / `docs/design-decisions.md` still describe the sketchbook.
6. Re-run the Figma plugin snapshot if it is still wanted.

## Gotchas
- Perf numbers from headless Chrome are noisy (software rendering; a busy CPU
  halves them). Compare loop counts and traces, not single fps runs.
- Stopping a backgrounded `npx next start` can leave the node server holding
  the port; free it before restarting.
- Git Bash rewrites a bare `/` argument: set `MSYS_NO_PATHCONV=1` for the screenshot scripts.
- `scripts/shoot-slides.mjs` needs an absolute Chrome `--user-data-dir`.
- Regenerate art: `python -I scripts/backdrop-refs.py` then `gen-backdrops.py`, `backdrop-sizes.py`, `extract-palettes.py`.
