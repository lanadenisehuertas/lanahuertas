# Handoff — night-garden sketchbook (updated 2026-10-27)

Branch `feat/brand-showcase-cont` (worktree `.claude/worktrees/brand-showcase-cont`).
Design: `docs/superpowers/specs/2026-10-26-night-garden-sketchbook-design.md`.

## Done
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
2. `/design` set gallery still uses the old window chrome (title bars, close
   boxes, `.psd` names, "end of folder", `ProjectBento.tsx`): move it to the
   sketchbook look — needs Lana's call on what replaces it.
3. Contrast audit of type on the brand artboards (see design-decisions).
4. Re-run the Figma plugin snapshot if it is still wanted.

## Gotchas
- Perf numbers from headless Chrome are noisy (software rendering; a busy CPU
  halves them). Compare loop counts and traces, not single fps runs.
- Stopping a backgrounded `npx next start` can leave the node server holding
  the port; free it before restarting.
- Git Bash rewrites a bare `/` argument: set `MSYS_NO_PATHCONV=1` for the screenshot scripts.
- `scripts/shoot-slides.mjs` needs an absolute Chrome `--user-data-dir`.
- Regenerate art: `python -I scripts/backdrop-refs.py` then `gen-backdrops.py`, `backdrop-sizes.py`, `extract-palettes.py`.
