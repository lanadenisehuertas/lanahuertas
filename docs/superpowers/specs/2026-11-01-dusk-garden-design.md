# Dusk garden — design (2026-11-01)

Supersedes the light "butterfly garden" palette. Approved preview:
`.superpowers/brainstorm/915-1793528814/content/garden-v8.html` ("i like the direction. render it
well and apply to the page. make sure to still keep the hover animation on the lana denise").

## Direction
- **Sky:** deep cobalt/violet at the top glowing down into pink and peach at the horizon; soft
  colour blobs (magenta, teal, peach, violet) drifting slowly; a fixed star field; cream `#fdf3e1`
  text, pink `#ffcfe0` accents.
- **Streams:** smooth single-gradient ribbons (canvas) pouring out of a glowing doorway in the hero
  and flowing through the videos and About.
- **Print textures:** ordered halftone dots/squares/diamonds on smooth gradients, Bayer dither bands
  and mesh-filled four-point sparkles. Never random speckle.
- **Painted objects:** matte, grainy illustrations from Codex (`public/art/garden/`): cloud bank,
  lotus cluster, vinyl, earbuds (bare) + note sprites, Peanut asleep/awake, yarn, mic, bass.
- **Everything moves or answers:** confetti twinkles, petals fall, shooting stars cross, layers lean
  with the cursor, planets chime, the door bursts confetti.
- **The guide butterfly** keeps its perch logic (`components/Butterfly.tsx`, unchanged).

## Sections
1. **Hero** — name (MorphName hover/scramble unchanged, plus a small pixel-flower cluster blooming
   round a touched letter), glowing door with double cream outline, streams pouring out, music
   staff across the floor (pluckable E A D G C) running out of the painted bass, clouds and lotus,
   Peanut asleep on a cloud (stroke = hearts + purr, click = wake + meow), type badge orbiting the
   teal planet, click the sky to place stars that join into a constellation.
2. **Branding / posters / UI-UX** — unchanged structure; sit on the dusk sky (colour variables
   remapped so copy is cream on the sky, dark on cream cards).
3. **Videos** — "Moving pictures": copy on the left, the big framed video (Brenia first), a
   Premiere-style timeline (V1 clips, A1 waveform, playhead, timecode, auto-advance, click to jump,
   marching ants on hover), audio level meters, earbuds hanging with rings that orbit through the
   buds, bobbing and drifting notes, sound pulses, spinning vinyl (click to scratch).
4. **About** — halftone tri-tone portrait in a soft oval with a tilted orbit ring; scrolling prints
   it in face-first, then dithers the real photo through it (no hover). Vines climb the portrait,
   flowers bloom, the painted yarn (click to roll) and mic (click to sing). Tabs and cards keep
   their content.
5. **Contact** — on the dusk sky, cream type, cream glass form.

## Performance and access
- Canvas engines pause off screen; one rAF per engine. Lite mode (`html[data-lite]`) and
  `prefers-reduced-motion` freeze ambient motion, skip streams/petals/shooting stars; the portrait
  shows the finished photo.
- Sound only on deliberate clicks/plucks; one shared mute toggle.
- Text contrast AA: cream on the sky (>= 7:1 on the darkest blue, checked on the pink horizon where
  copy sits on a scrim), ink on cream cards.
