# Rooms behind the doors: design

Date: 2026-11-17. Site: `public/samples/sleeping-moon/` in the `pixel-bloom` worktree (http://127.0.0.1:3900/samples/sleeping-moon/index.html). Research: `docs/v6/research-a.md`, `research-b.md`, `research-c.md`. Mockups: `public/samples/rooms-mock/`.

## Why

Lana likes the first screen (the sleeping moon, the six door objects that wake from a lilac bitmap into colour, the door flying you into its stop) and finds everything after it plain. The research found the same pattern on every reference portfolio: one world wraps the person, and the work drops out of it into a template. Lana chose to keep the world: each door object becomes its section's room, the four apps get films of the real product plus one working piece each, and the type moves to Redaction plus one quiet sans. Lana approved the direction from the mockups and asked for it to be built "immersive" and "rendered well, not cheap".

## What "not cheap" means here

The mockups looked cheap because the door art was scaled up from 520 px, the light was flat CSS, the sky was a gradient with dot stars, and things were placed rather than staged. The build answers each:

1. **Art at size.** Every room object is new painted art at 2–3 times its display size, made with Codex from the door art as reference: an empty easel, the projector, the hand mirror's frame with an empty oval (Lana's portrait is never sent to an image service; the real photo goes into the oval in the page), an open envelope, a clothespin. Keyed to transparency and saved as WebP.
2. **The hero's language everywhere.** Each room's object is a `.pic` bitmap: it sleeps in the lilac 1-bit ink like the doors on the first screen and wakes into colour when you arrive (it is the stop's `data-main`). That is what ties the rooms to the hero; nothing new is invented for it.
3. **Light that is painted, not drawn.** The projector beam is layered radial and linear gradients with a soft dither at its edge and a few dust motes, the screen glows onto the floor, the dawn has a sun disc, the night has the hero's stars. No outlines anywhere.
4. **Staging.** Each room has one object big enough to be the room, and the work sits on or in it.

## The system

- **Type.** Redaction (display, titles), Redaction italic (the voice lines and text buttons), Redaction 35 for labels at 16 px or more, Redaction 70 for nav words while asleep (they wake into plain Redaction when hovered or current). Body text: Atkinson Hyperlegible Next, 17 px, line height 1.55. Pixelify Sans and Inter Tight are removed from the stylesheets and the font request.
- **Controls.** No filled blocks, no tinted squares. Buttons are italic Redaction with a 1 px line under them that draws across on hover (`.go`). Arrows are thin drawn arrows in a 44 px hit area (`.arw`). The current stop in the masthead gets a small moon-phase mark under its name instead of an underline.
- **Motion.** Hover pops 0.35 s on `cubic-bezier(0.34, 1.56, 0.64, 1)`; entrances 0.6–0.8 s on `cubic-bezier(0.16, 1, 0.3, 1)`, played once; exits 60–70 percent of their entrance; nothing replays on scrolling back. Transform and opacity only. Quiet mode and reduced motion show every end state at once, swap animated WebP for its poster, and stop the projector's dust.
- **Night.** The sky is continuous: every stop's ground is transparent over one fixed sky layer whose colour follows the current stop (deep night for the first stops, the pond's blue for About, the dawn for Contact), so moving between rooms never shows a box edge. Brand plates and app stages keep their own colour world inside the room.
- **The guide moon is removed.** The big moon on the first screen opens its eyes on the first pointer move and closes them after a quiet minute.

## The rooms

1. **Brands: the seed-packet holder.** As built in round 5 (the key visual rises out of its packet), with the brand name moved onto the date line in Redaction so the pubmat strip gets the height, and the packets in the holder lifting on hover with the pop curve and a 6° tilt.
2. **Posters: the easel.** The twelve posters hang small on a line that sags across the top of the sky, each held by a painted clothespin, in plain colour (no dither on small pieces). The chosen poster stands big on the easel, which is the room's sleeping-then-waking object. Choosing another from the line flies it from its place on the line onto the easel (a shared-element flight, 0.6 s) while the one on the easel returns to its gap. Arrows and the arrow keys step through; "See it large" opens the viewer. Phone: the line becomes a row you can swipe, the easel stands under it.
3. **Films: the projector.** The projector stands on the left and throws a beam onto a screen on the right, where the chosen film's frame shows. Choosing a film from the strip below makes the beam flicker (two quick dips over 0.25 s) and the frame changes. The film's title, role and length sit under the screen with "Watch it" (opens the Drive link in a new tab). The old editor timeline is replaced by this strip. Phone: the screen on top, the projector small beside the title, the strip as a swipeable row.
4. **Products: inside the phone.** The phone door flies you in. Each app has a pinned stage, one screen tall per step: the app's name and steps on the left (the current step bright, the others at 45 percent), a rail of step names on the far left, and on the right a film of the real app on the app's own colour, with a small paper note inside it, and the working piece under it. Films are 2x animated WebP at 15 fps from Lana's live apps with a poster for reduced motion and a pause button. Working pieces: PsyClick, type a line and see the rhythm bars and pauses; Bloom, tap days on a cycle ring to log them; Algebrawl, answer the battle question and see the hit or the taunt; Debt Ledger, drag the allowance and watch it split across two debts. Phone: steps stack, the film above each step.
5. **About: the hand mirror.** The painted mirror frame holds Lana's photo in its oval. The photo starts as the engraved line bitmap and wakes into the photo under the pointer and on arrival. Beside it the statement, the kicker and the roles sentence, then the moon calendar and the skills index as now.
6. **Contact: the envelope at dawn.** On arrival the envelope (open, flap up) is on the ground and the letter rises out of it to stand above it: "Let's talk", the line about work, and the address in Redaction italic. "Copy the address" is the wax seal, which presses (scale 0.94, then back) and says "Copied". LinkedIn and GitHub sit on the ground either side of the envelope; "Back to the moon" is the last line.

## Accessibility and performance

WCAG AA contrast for every text and control; body 17 px, labels 16 px; every image with width, height and alt; CLS 0; keyboard access to every room (arrows on the easel and film strip, tab order matching the layout); each animated loop has a pause control and a reduced-motion poster; no filter, mask or clip-path on anything that animates continuously; no per-frame custom properties on `<html>`. Loops load lazily and only play while on screen.

## Out of scope

The brand detail page (`brand.html`) keeps its layout; it only takes the new type and controls. Nothing is committed or pushed until Lana asks. (Superseded below: the brand page was rebuilt in the cohesion pass.)

## Cohesion pass: everything matched to the first screen

Lana found the built rooms disconnected from the hero and from each other, and said: "i like the hero section already. match everything from that. maybe add another intro before the hero section?" The hero itself was not changed. Where this section disagrees with the ones above, this section wins.

### The rule

Every screen is the first screen's night: a black ground (`#000`), lilac 1-bit objects (`#b9a2ff`), text in `#d9cfff`, marks in `#fff1c9`. Colour appears only in the work itself, and as a soft radial light of the current work's own colour behind it (never a box). Every room's object sleeps in lilac and wakes into colour when you arrive or point at it, exactly like the doors. The pond-blue sky for About and the tinted per-brand grounds are gone; the only other ground is the dawn at Contact.

### Shared parts

- **Board.** Every room is a 100u by 62.5u board, the same as the first screen, with the words in a left column (10u from the edge) and the work to the right.
- **Corners.** The hero's moth and lily stand in the four corners of every board (`SM.corners`). Their sizes now live in `moon.css`, so the brand page gets them too.
- **One control.** Every room that steps through work uses the same control: "n of N" in Redaction with the current number in the mark colour, and two thin arrows (`SM.steps`, `SM.setSteps`). No "01 / 12" numbering anywhere.
- **Meta lines.** "Organisation, Month Year" in plain text. No middle-dot strings, and no arrow on internal links (only links that leave the site carry the small out-arrow).
- **Lines.** The only lines are dotted lilac (`stroke-dasharray: 2 7`), as on the hero's chart: the posters' clothesline, the projector's beam edges, the moonrise horizon.

### The moonrise intro

Before the hero there is one screen of night on wide screens: "Night falls in Manila." with one line under it, and the moon below a dotted horizon. Scrolling raises the moon (eased, `1 - (1 - p)^2`) while the words lift and fade; when the moon is up, the doors, chart and name come in exactly as before. The hero stop is two screens tall while this runs and its content is pinned. Phones, column layouts and reduced motion skip the intro and open on the hero as it was. Door travel and "Back to the moon" land on the risen hero (the stop's last screen, `data-land="end"`).

### The rooms after the pass

1. **Brands.** The holder and packets sleep in lilac; the current brand's packet is awake. The key visual rises out of its packet. The pubmat row is laid out in board units: a piece stands at full height when it fits, a piece that does not shares a column with the next at half height, and what still does not fit is hidden on a desktop and shown in the phone's scrolling row.
2. **Posters.** The clothesline posters hang as small sleeping bitmaps on a dotted line that clears the easel; the easel sleeps, the poster on it is in colour.
3. **Films.** The projector sleeps; the beam is one faint warm gradient with dotted edges; the screen keeps 16:9 and crops the still. Clips in the strip sleep and wake on pointing; the current one stays awake and carries a small crescent under it.
4. **Products.** Now a reel like Brands: one app per step, its film large, its working piece beside or under it, the room's phone object sleeping on the ground at the right. On phones the four apps stack one under another and every film plays only while on screen.
5. **About.** The mirror frame sleeps like the doors; the portrait wakes. The year tabs are six small moon bitmaps in their phases (`data-phase` on a moon `.pic` draws the terminator), lilac until chosen. The skills index is running text, each group a sentence led by its name in italic.
6. **Contact.** Unchanged: the dawn, reached after a stretch of empty night at the end of About.

### The brand page

`brand.html` now follows the same rule: black night, the words in the left column (name, "Organisation, Month Year", the tag line, the brief, "I made its … in …", the palette chips, the campaign link), the key visual large on the right with a light of the brand's own colour behind it, the moth and lily in the corners. The other pieces follow in their own colours at their own shapes, one height to a row, and open in the viewer. The page ends with "All ten brands" and the brands before and after, whose key visuals sleep in lilac and wake when pointed at. The "Brand 01 / 10" label, the huge centred headings and the per-brand grounds are gone.

### Checked

Screenshots at 1440 by 900, 1280 by 720, 390 by 844 and with reduced motion: no horizontal overflow, no text under 16 px, no console errors. Door travel lands on the section's first screen; "Back to the moon" lands on the risen hero.

## Scroll pass: every scroll moves something

Lana liked the direction of the cohesion pass but said the scrolling caught them off guard, the single posters looked off, the brands had lost their own backgrounds, the films no longer read as a timeline, and the About moons did not say what they stood for. Their rule: "each movement in the website must be smooth, every scroll must be intentional, not a static moment in the site." Where this section disagrees with the ones above, this section wins.

### The rule

Nothing that the scroll reaches runs on a timer any more. Every room is moved by the scroll itself, so it moves exactly as far as you scroll and goes back when you scroll back. Timed motion is left only for things you start yourself (hover, a click, the door flight, the viewer) and for the page's first load.

### The engine (moon.js)

- **Gliding wheel.** A wheel or trackpad turn moves a target, and the page eases toward it every frame (time constant about 105 ms). This applies to desktop pointers only. Keyboard, scrollbar, touch, quiet mode and reduced motion keep the browser's own scrolling. A box inside the page that can still scroll keeps the wheel. `SM.glide(y)` is the one way the site moves the page.
- **Scrubbing.** `SM.scrub(fn)` registers a function that runs once a frame while the page moves. `SM.where(el)` gives an element's place in the window: `p`, `arrive` and `leave`.
- **Bitmaps.** A bitmap now has a `floor` (how far the scroll has woken it), as well as the `wake` that comes from pointing at it. It shows the larger of the two. `setFloor`, `setShow` and `setPhase` set these from the scroll in Bayer steps. `recolour()` reads `--ink` and `--ground` again.
- **Main pieces.** A stop's main piece is awake in proportion to how much of the window the stop fills.
- **Dissolves.** `SM.applyMask(el, cover)` lays a dither of big Bayer tiles (cell about 0.9u, at least 8 px) over an element at any coverage from 0 to 1.

### The rooms

1. **Brands: worlds again.** Each brand plate is the brand's own world: its ground colour, its ink, and its backdrop cut into flat tones (`data-flat`, cell 3), with a fall of the ground colour behind the words.
   - The next world dissolves in through the big tiles as you scroll. The words leave before the dissolve starts and come back as it ends, so two sets of words never show through each other.
   - While a plate is shown, it drifts: the backdrop slowest, then the words, then the pieces, each piece a little faster than the last.
   - The key visual rises out of its packet as far as the scroll has brought its world in.
   - The current brand's packet stands up out of the holder, with its neighbours part way up. The holder takes the world's ink, and each packet sleeps in its own brand's ink.
   - The masthead and foot take the world's colours.
   - Products uses the same reel, so each app has its world too: its own ground, ink and backdrop.
2. **Posters: the line.** The easel is gone.
   - The twelve posters hang large (43u tall), each at its own shape, on a dotted line, held by painted clothespins.
   - The stop is pinned, and scrolling draws the line along. The line slows as each poster reaches the middle, so every poster has its own moment.
   - The poster in the middle hangs straight and wakes into colour. The others swing on their pins, step back to half opacity, and sleep as flat lilac shapes in a dimmer ink (`#7f6bcf`), never a fine dither.
   - A light of the poster's colour stands behind it, blending between posters as you scroll.
   - Clicking the middle poster opens it large; clicking another draws the line to it.
3. **Films: the edit.** The projector is gone, and the editor's timeline is back.
   - The timeline has a ruler of minutes, the ten films on V1 each as long as it runs, a stepped waveform on A1, and a playhead with a flag.
   - Scrolling plays the timeline: the playhead runs along it and the timecode counts in frames.
   - The film under the playhead fills the monitor and pushes in slowly as it runs. At each cut the next film dissolves in over the last fifth of the clip, as a cross-dissolve would.
   - Clicking a clip moves the playhead to it.
4. **About: the moon is the year.** The years now run forward, 2019 to 2026, down the right.
   - On the left, one moon stays in the window while you read: the hero's moon without its face (`art/moon-plain.webp`). Its phase follows the scroll, from a thin crescent in 2019 to full in 2026, when it wakes into colour.
   - Under it the year rolls on, and a row of six small moons marks where you are. Each small moon is a link to its year.
   - One plain line says it: "One moon for each year. It fills as the years go by: a thin crescent in 2019, full in 2026."
   - On phones the moon, the year and the six moons ride in a bar at the top of the window.
5. **Contact.** The letter rises out of the envelope as the dawn comes up the window.
6. **The moonrise.** As the moon comes up, the chart lines, then the name, then the doors one after another are drawn in by the scroll, and drawn out again if you scroll back.
7. **The brand page.** The page takes the brand's world: its ground and ink on the page, the masthead and the foot, and its backdrop in flat tones fixed behind everything, drifting with the scroll.

### Checked

- Screenshots at 1440 by 900, 1280 by 720 and 390 by 844, and with reduced motion.
- No console errors, no horizontal overflow and no text under 16 px.
- No stop moves after load: products builds all its plates at once on phones.
- Frame times while wheel-scrolling each pinned room: a mean of 7 to 8 ms, and at most one frame over 34 ms.

## Interaction pass: every element, state and motion checked

Lana liked the scroll pass and asked for another pass over the interactions, the elements, the animations and anything that reads as generated. Every control was driven in a browser (doors, packets, pieces, the viewer, posters, clips, the year moons, the route, travel, quiet mode, copy). The keyboard was tabbed through the whole page. All of these worked, and no focus target was hidden or faded. What changed:

### Motion

1. **First light follows the scroll.** The contact stop's sky no longer cross-fades over 900 ms when the stop becomes current. A dawn layer comes up the window with the stop's top edge. Its edge is cut in big pixels like a far ridge (ten rows of cells filling in the Bayer order along a wavy line), never an even band. It covers the night and its stars as far as you have scrolled, and goes back down when you scroll back. The `body.dawn` class and the `data-sky` switch are gone.
2. **The bands follow what is behind them.** The masthead and the foot take the colours of the stop under each band's line, through `SM.band(tone, which)` in moon.js. A reel gives the tone of its world as the scroll has blended it (`stop._tone(y)`), so the bands change with the dissolve instead of snapping when the current plate changes. Leaving a reel, the masthead keeps the reel's world until the reel has gone past it. The dawn blends each band as its edge passes. The five colours are typed with `@property`, so a change that is not driven by the scroll cross-fades over 240 ms.
3. **The viewer.** A picture comes in through big dither tiles over 220 ms when it is asked for, and at once in quiet mode. The page under the open viewer no longer scrolls; the scrollbar's room is kept, so nothing shifts.
4. **Shorter travel.** The dither iris closes in 380 ms, holds 70 ms and opens in 340 ms, down from 460, 90 and 440. The copy button's press is a 0.97 scale over 220 ms.

### Elements and states

1. The statement in About and the skills index come up as the scroll brings them into the window. Before, they were the last still text on the page.
2. The posters say which one is in the middle (`aria-current`). That poster shows a zoom cursor and opens large. The others show a pointer and are drawn to the middle; their labels say so.
3. Sleeping clips on the films timeline are drawn in a dimmer lilac, so the monitor and the current clip lead.

### What read as generated

1. The masthead's "no. 01" issue number on the first screen is gone; the label is empty there. Travel to the first screen names it "The moon" (`data-name`).
2. The page title uses a comma instead of a middle dot.
3. The viewer said the count twice ("Rock of Aces 6.0, 1 of 6" and "1 / 6"). It now shows the name, then "1 of 6", the same form as every room's control, and no count for a single picture.

### Checked

- Screenshots at 1440 by 900, 1280 by 720 and 390 by 844, and in quiet mode, including the boundaries between worlds and five points of the dawn.
- No console errors, no horizontal overflow and no text under 16 px. No stop moves after load.
- Frame times while wheel-scrolling: a mean of 7 to 8 ms.
- The brand page keeps its world in the masthead and foot.
