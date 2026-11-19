# Research C: Kaustubh Barhate and Shreyas Vyas, plus Lana's four apps as moving screens

I did this research on 2026-11-17. Playwright drove the installed Chrome at 1440x900 and 390x844. On every page I did the following:

- Scrolled in half-screen steps.
- Took bursts of frames (100 to 150 ms apart) wherever something moved.
- Captured each kind of hover before and after.
- Opened the case studies and captured them top to bottom.
- Logged the network.
- Read the computed styles, the CSS custom properties, and the shipped JS and CSS to get real durations and easings.

Neither site blocked automation or showed a CAPTCHA. I typed nothing about Lana into either site. In Lana's apps I used only local demo data. Before typing anything I checked that each app keeps data on the device.

Every capture is in one folder. It is a temporary scratchpad, so a reboot may clear it:
`C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v6\`

Below, `v6\…` means a path inside that folder. Files named `sheet_*.png` are contact sheets, so open those first. My scripts for this report start with `c_` and are in `v6\scripts\`.

Evidence labels:

- **[seen]**: I saw it in frames.
- **[code]**: I read it from the DOM, the CSS or the JS bundle.
- **[measured]**: I calculated it from timestamps, file sizes or scroll positions.
- **[inferred]**: my reading of something I could not fully confirm.

---

## 1. Kaustubh Barhate

### 1.1 What it is

The wallofportfolios entry links to **https://kaustubh.work/**, a hand-built Vite single-page site. Kaustubh calls himself a "Product designer + builder + artist". The whole site is a Persona 5-style "phantom thief" game menu set in a 3D bedroom. A cel-shaded version of him lives in the room, and the menus are skewed black and yellow plates.

The routes are `/` (the room), `/work` (a carousel of six projects), `/work/<slug>` (the case studies), `/archive`, `/about`, `/contact` and `/ask` (a chatbot marked as a work in progress).

### 1.2 Flow

**Load** (`v6\kaustubh\load\sheet_load.png`) **[seen]**:

1. A black screen with a pulsing star loader holds for about 2 s.
2. A diagonal slash wipe in yellow, orange and black cuts across the screen.
3. The 3D character (three.js, `thief.glb`, 863 KB, with a yellow outline shader) jumps into the bedroom scene, waves, then settles into an idle loop.

The whole intro takes 3.5 to 6 s, depending on how fast the model loads. At first, Playwright's "network idle" fired while the loader was still showing, so every capture waits 9 s.

**Home**: one viewport, no scrolling (`v6\kaustubh\home\`):

- Bottom left: three skewed black plates, WORK, ARCHIVE and CONTACT, each with an arrow. They sit at -2deg, 1.2deg and -1.4deg **[code]**.
- Top right: an "Open to work" chip, a sound toggle and a burger button.
- A name plate, "Kaustubh Barhate" in Grovio, with a yellow tag underneath.
- On the desk monitor, a "NOW SHOWING <project>" board cycles through projects (`sheet_board.png`).

**Menu** (`sheet_menu_open.png`):

1. The character jumps to the centre over a yellow lightning starburst.
2. Six numbered plates fly in around him, each with a one-line gloss. For example, "Work: case studies", "Archive: experiments" and "Ask me: anything at all".

**Work** (`v6\kaustubh\work\`): a carousel of six projects, with a marquee of huge skewed project names along the top.

- **Projects:** GoldBoost, Gold SIP, Copy Trade (0xPPL), Wizely Rebrand, A Bit Smart (Tankr) and OneCard Icons.
- **The card:** each card is 600x400 with a yellow offset shadow, a centred description, arrows and an "03/06" counter.
- **Decoration:** ransom-note "WORK" letters, and a yellow silhouette of the character saying "Scroll, drag or use the arrows".

**Case studies:** long, scrolling pages, described in 1.7.

**Archive** (`v6\kaustubh\page-archive\`): an endless, slowly drifting wall of tilted cards. Some cards hold phone frames playing small looping mp4s (16 to 777 KB each). The caption reads "Everything I couldn't find a place for… It goes on forever, so wander."

**About** (`v6\kaustubh\page-about\`) has:

- a photo labelled "Hover for the real one";
- a "Right now" row: the game, the music, the anime and the drink he is into, each with a progress bar;
- a "Journey" timeline of cards;
- an "Open to work" banner.

**Contact** (`v6\kaustubh\page-contact\`) has:

- a skewed black "CALLING CARD" with the email address, a COPY button and his local time ("PUNE · 03:25");
- a "FIND ME" list of links;
- an "ASK ME ANYTHING" plate.

**Phone** (`v6\kaustubh\mobile\`): the same intro and 3D scene, in portrait. The case studies stack in one column with the same phone frames.

### 1.3 Motion (with numbers)

**Tokens and engines** **[code]**:

- `:root{--k:#111;--y:#ffe745;--o:#d9480f;--w:#fff;--skew:-12deg;--edge-x:48px;--u:clamp(1px,min(100vw/1440,100vh/760),1.6px)}`.
- `--u` is a single scale unit, so the whole stage resizes as one piece.
- Engines: GSAP with ScrollTrigger, Three.js r179 for the room, lottie_svg loaded lazily, CSS keyframes, and CSS `linear()` springs.

**Plate hover** (`v6\kaustubh\home\sheet_plate0..2.png`) **[seen][code]**:

- The plate turns yellow and gains an orange offset shadow.
- It scales to about 1.04 and lifts 6 px.
- The transition is `translate .35s cubic-bezier(0.34,1.56,0.64,1)`, an overshooting back-out. The same curve runs on rotate, scale and box-shadow across the site, almost always at 0.35 s (16 elements use it on the GoldBoost page alone).

**Camera** **[code][seen]**:

- Hovering WORK dollies the camera into the desk monitor, which then shows real project content (the Wizely rebrand). Hovering ARCHIVE swings the camera to the bed, which is covered in sketches.
- The camera moves take 0.8 s with GSAP `expo.out` or `power3.inOut`.
- Small pops use `back.out(1.4)` to `back.out(3)` over 0.2 to 0.5 s.

**Idle life**:

- The character and props breathe on 2.4 to 3.2 s `sine.inOut` yoyo loops, and one slow 14 s rotation runs.
- A shade layer follows the pointer through `--sx` and `--sy` (`sheet_sweep.png`).
- Over the board, the character points at it and the project changes (`sheet_board.png`).

**Page change**:

1. The camera pushes in.
2. Layered `clip-path` curtains in orange, then yellow, then black wipe across at the `--skew` angle.
3. A title card ("WORK") shows on the black.
4. The new page is revealed under it (`v6\kaustubh\work\sheet_to_work.png`).

The menu's own links timed out under automation. My enter sheets for the secondary pages therefore show a direct page load, not this menu transition.

**Work carousel** (`sheet_autoplay.png`, `sheet_card_hover.png`, `sheet_drag.png`, `sheet_arrow_next.png`):

- Autoplay changes slides every 2.8 s with a crossfade **[measured]**.
- Hovering pauses it and slides out an "Open case study →" plate.
- Drag and the arrows work too.

**Case pages**:

- Body text and media fade and lift into place on scroll.
- The CONTENTS list is a scrollspy. The active item gets a yellow bar that slides between items.

**Reduced motion** **[code]**:

- There are `prefers-reduced-motion` rules that stop the mascot animation and the case top bar.
- A `V` flag in the stage code skips the idle loops.
- I did not find a reduced-motion version of the 3D intro.

### 1.4 Interactivity

The site responds everywhere, and nothing in it is a hover-only gimmick. Every hover changes something that has meaning:

- the camera goes to where the section lives;
- the board changes project when he points at it;
- the carousel pauses so you can read.

The interactive pieces are listed below. Two of them are the most useful finding of this research for Lana:

- **Live prototypes inside phone frames.** GoldBoost and 0xPPL, described in 1.5.
- **A Bit Smart "Make your own face".** An interactive pixel-face builder on a 340x389 canvas inside the brand case study. You choose face, hair, glasses, mouth and colours, and press Shuffle or Save PNG (`v6\kaustubh\case-a-bit-smart\sheet_s_1.png`). It is a brand case study, not a product, and it still gives the visitor a toy built from the brand's own system.
- **Ask.** A chatbot with suggestion prompts, labelled as a work in progress.
- **Contact.** Copy the email address, with a live local-time clock.

### 1.5 Animated screens (the main reference)

Kaustubh uses five techniques. I ranked them by how alive they feel.

**1. A live DOM component in a phone frame (0xPPL Copy Trade)** (`v6\kaustubh\deep-0xppl\sheet_live_0..4.png`):

- **What it is.** Every phone "screenshot" in this case study is one hand-built component (`.cppl`) shown in different states: profile, fixed ratio, fixed amount, review and success.
- **"Try it" section.** The live version (`.cppl--live`) sits on a yellow block tagged "INTERACTIVE: TAP AROUND", next to the line "This is the real flow, working right here."
- **What I could do in it.** Follow, which turns into Followed. Switch the Activity and Portfolio tabs. Open "Copy SABR's Trades", choose Fixed Ratio or Fixed Amount, then Review and Start Copying. That ends on a success screen, "You're now copying SABR", with two avatars and View Portfolio.
- **No loop.** Nothing loops. It is alive because you drive it.

**2. "The delight": micro-animations isolated on dark tiles** (`v6\kaustubh\deep-0xppl\sheet_move0..3.png`):

- **Layout.** Four tiles, each showing one moving detail from the product, alone on its own background **[code][seen]**.
- **Gradient avatar ring:** `cppl-turn 1.6s linear infinite`.
- **Button shine:** `cppl-shine 1.8s ease-in-out`. The sweep moves 0 to 170 px in the first 44.4% of the cycle, then rests, so the shine reads as a glint, not a strobe.
- **"Recommended" chip:** a slow breathing scale.
- **"You and SABR, together":**
  - The two avatars drift about 15 px apart and snap back on a CSS `linear()` spring (`cppl-apart-l` and `cppl-apart-r`, 3.16 s).
  - The user's avatar runs its own small rainbow-face loop.
  - State changes elsewhere use `transform 1.02s` on the same kind of spring.

**3. A real HTML prototype in an iframe inside the phone (GoldBoost)** (`v6\kaustubh\deep-goldboost\sheet_iframe_0..2.png`, `sheet_reload.png`):

- **What it is.** The phone frame holds `/work/goldboost/landing/index.html` at 283x628. It is a working landing page he says he built "with AI".
- **Loading.** A Three.js r128 gold coin spins as a loader for about 1.2 s. Then the landing appears with floating coins, sliders and an FAQ.
- **Labels.** The tag reads "INTERACTIVE: SCROLL IT, SLIDE IT, TAP IT", and a "RELOAD, SEE THE LOADER" button replays the loader.
- **Hosting.** Because he hosts it on his own domain, he controls it fully.

**4. Muted looping mp4s with a webp poster** (GoldBoost hero, A Bit Smart, Archive):

- **GoldBoost hero.** The cover is `autoplay muted loop playsinline`: a 15 s, 325 KB mp4 of coins bouncing, with `cover.webp` as the poster.
- **A Bit Smart.** Five loops: v1 is 2.8 s and 26 KB, v2 is 5.9 s and 171 KB, and v3 to v5 are 254, 152 and 74 KB **[measured]**. The logo builds itself out of bits, and photos are revealed through the same blocky shapes as the mark.
- **Archive.** Loops of 16 to 777 KB, in phone frames.

**5. Static screens made to point** (GoldBoost body) (`v6\kaustubh\case-goldboost\sheet_s_0..1.png`):

- **The frame.** CSS phone frames (`.cphone`, with a dynamic-island `span` and a `.cscr` screen) hold lazy-loaded webp screenshots.
- **Tap rings.** Orange rings (`.cring`) sit at percentage coordinates on the screen and mark where the user taps.
- **Callouts.** "BUSINESS DECISION" yellow callouts and tags such as "DROPPED/SHIPPED" and "BEFORE, TICKED" frame each decision.

**Device frames.** All of them are CSS, not images: rounded black bodies, a dynamic island, and a status bar reading "9:41 LTE". Phones sit on flat yellow or black blocks, one phone per block in the important moments. The case pages never use a gradient or a mock "studio" background.

**What makes them feel alive.** Three things:

- The visitor's hand is in it (live component and iframe).
- One motion is shown at a time on its own tile.
- Loops are short and quiet (1.6 to 3.2 s for the micro-animations), with long rests built into the keyframes.

### 1.6 Branding system

**Palette** **[code]**: ink `#111`, yellow `#ffe745`, orange `#d9480f` and white. Yellow is the "selected" colour everywhere: the active contents item, hovered plates and the "Try it" blocks.

**Type** **[code]**:

- **Display:** Grovio Bold, all caps. Section headings (h2) are 51.84 px with a 49.2 px line height.
- **Everything else:** DM Sans variable. Body text is 18 px with a 29.7 px line height, in `rgba(17,17,17,.78)`.
- **Labels:** 11 to 12 px DM Sans bold at 50% ink, with 0.66 to 1.44 px tracking.

**Shapes**:

- Everything leans at `--skew:-12deg` or is rotated a degree or two.
- Plates and tags are cut with irregular `clip-path` polygons, so they read as stickers or torn paper, not rounded boxes.
- Offset shadows are solid colour with no blur.

**Voice**: first person, short and dry ("A lot of bad ideas first", "What I took from it").

### 1.7 Case-study structure

Every case study uses one template (GoldBoost, 0xPPL, A Bit Smart; `v6\kaustubh\case-*\text.txt`). The 0xPPL case study, for example, runs:

1. **Hero:** "← ALL WORK", the title in Grovio, a one-line pitch, and TYPE, ROLE and DURATION (or STUDIO).
2. **Contents:** a sticky "CONTENTS" scrollspy on the left with 9 to 11 numbered items.
3. **Overview,** ending in one all-caps sentence that states the goal ("MAKE THE PROFILE INSPIRE TRUST, AND MAKE COPYING THE NATURAL, SAFE NEXT STEP").
4. **Brief or pain points** as short titled paragraphs.
5. **"The ideal scenario"** as five plain steps.
6. **"Try it"** (the live component).
7. **Three sections** on the profile, the copy flow and feeling safe.
8. **"The delight"** (the motion tiles).
9. **"What I took from it".**
10. **A black "Next project →" banner** with a yellow offset.

GoldBoost has nine sections, from "The problem" to "Where it landed". Its outcome is one huge word, "SIMPLIFIED", with three results. A Bit Smart has eleven, and it walks through the work in order: bad ideas first, the idea, the logo, drawing a typeface, colour, icons and faces, in the world, motion. That is a good model for Lana's Brands.

### 1.8 Steal for Lana

**His home page is Lana's idea, already shipped.** A room of objects, where hovering an object moves the camera to it and clicking flies you in, is Lana's six door-objects. Three details are worth taking:

- **The hover gives a preview, not a highlight.** The camera move shows what is behind the door before you commit. For Lana: the projector could flicker one film still on the wall, the easel could show the current poster, and the seed packet could tip out a brand mark.
- **The "NOW SHOWING" board.** A small sign that cycles project names on the projector is a direct fit for Films.
- **The transition is three beats.** Camera push (0.8 s), then layered curtain wipes, then a title card. In Lana's world the curtains could be night-blue, moon-cream and lily-white, wiping at the angle of the moonlight.

**Live components instead of screenshots for Products.** Build one small, self-contained, local-only widget per app, inside a CSS phone or laptop frame, and let the visitor use it:

- **PsyClick:** a "type a line, see your rhythm" bar.
- **Bloom:** a cycle calendar you can tap.
- **Debt Ledger:** an allowance split you can change.

This was the most memorable thing in both portfolios, and it costs kilobytes, not megabytes.

**"The delight" tiles.** Show one moving detail per tile, each on its own dark background, with long rests in the keyframes. This is exactly Lana's "one piece at a time on its own background". It suits a night palette better than Kaustubh's black.

**Tap rings on static screens.** Rings at percentage coordinates show the tap without a video. Draw them as a small star or lily ring, not an orange circle.

**A toy made from a brand's own system** (A Bit Smart's face builder). For Brands, one small interaction per brand: recolour the mark, shuffle the pattern, or build something from the brand's shapes.

**One easing, used everywhere.** A single overshoot curve (`cubic-bezier(0.34,1.56,0.64,1)` at 0.35 s) for every small pop makes the site feel like one object. Lana should pick hers once and reuse it.

**Mechanics:**

- A single `--u` scale unit, so the stage resizes as one piece.
- Plates cut with `clip-path` instead of `border-radius`. Rounded boxes and outlines are what Lana says reads as AI.
- Solid offset shadows.

### 1.9 Avoid

- **Small numbered labels.** "01", "02" and so on sit over every heading and every contents item, at 11 to 12 px and 50% ink. `rgba(17,17,17,.5)` on white is about 3.5:1, which fails AA for small text **[measured from the computed colour]**. This is one of the patterns Lana named as AI-looking.
- **"Open to work"** chip and banner, pill counters ("03/06"), and boxed "Right now" cards on About.
- **A 3D model and Three.js before any content.** The site shows nothing useful for 3.5 to 6 s, and the 863 KB `thief.glb` loads first. A sound toggle and a chatbot that says it is unfinished add weight without adding to the work.
- **The archive.** An endless drifting wall is fun but goes against "one piece at a time". If Lana wants an everything-else page, the drift should be slow, pausable, and off under reduced motion.
- **The Grovio all-caps voice everywhere.** Lana's equivalent is Redaction, which she keeps. It should stay the display face only.

---

## 2. Shreyas Vyas

### 2.1 What it is

The wallofportfolios entry links to **https://shreyasvyas.framer.website/**, a Framer site for a Bengaluru product designer at Digit Insurance. The whole portfolio is a cooking metaphor: "Untangling UX Spaghetti", "About the Chef", "Projects Menu", "Let him cook".

### 2.2 Flow

**Load** (`v6\shreyas\home-d\sheet_intro.png`): "LET HIM COOK" on black with a percentage counter, about 1.8 s.

**Hero**:

- A Spline 3D iframe (`my.spline.design`, a 12.6 MB `scene.splinecode`) shows a steaming plate of spaghetti.
- It first appears as a blurred blob for about 1.2 s while the scene loads. It remounts, and reloads, whenever you scroll back up **[seen]**.

**Nav**: a glass pill. Hovering a word swaps it for its kitchen version: About to Chef, Projects to Menu, Resume to Recipe, Contact to Booking (`v6\shreyas\inter\sheet_nav_about.png`, `sheet_nav_projects.png`).

**Down the page** (`v6\shreyas\home-d\sheet_s_0..1.png`):

- **Intro tag:** a yellow "Now that I've got your attention…" tag with an animated emoji. Each emoji is a transparent 45x45 webm, about 30 KB, looping every 2.3 to 3 s.
- **About the Chef:**
  - The headline is in Milker, with "designing" and "cooking" swapping in place.
  - A rotated location tag and a "currently at Digit Insurance" tag.
  - A canvas of wavy sauce lines.
  - Tomato-splash and parsley props.
  - A tomato-red band with a skills marquee.
- **Projects menu** (`v6\shreyas\inter\sheet_tab_*.png`):
  - Each project sits on a cutting board, with sauce bowls and onions as props.
  - A sticky pill tab bar (UI/UX, Virtual Reality, Publication, Miscellaneous, Eye Candy) scrolls you to each category.
  - The READ buttons open case studies in a new tab.
- **"Things that aren't on my resume":** accordions.
- **An olive section:** "The city didn't pose… I drew it anyway", with sketches.
- **Meme cards:** "Hired as a designer, got called 'CMO'".
- **A Yes or No question:** "Should the CMO start a meme page?" The No button runs away from the pointer. Yes plays a GIF in an oval, with confetti (`sheet_no.png`, `sheet_yes.png`).
- **"Why you should let me cook":** three 3D chef cards, then testimonials.
- **Footer:** "Let's cook together", with a Breaking Bad clip (a webm, 1038x584, 6.6 s, 1.2 MB). The contact is a receipt titled "THE BILL", set in Sometype Mono, beside a rotating circular badge.

**Phone** (`v6\shreyas\mobile\`):

- A note says "You're viewing the LITE version".
- The projects menu is replaced by "This section is still cooking on low flame for mobile screen. Please visit on Desktop." On a phone, you cannot reach his work from the home page.

### 2.3 Motion (with numbers)

**Framer Motion values** **[code]**:

- **Default ease:** `[.44,0,.56,1]`, a symmetric ease-in-out, at 0.4 to 0.8 s.
- **Springs:** typed as 0.4, 0.6 and 0.8 s durations.
- **READ buttons:** a spring with stiffness 400 and damping 25 to `scale 1.05`, `brightness 1.1` on hover, and `scale .95` on press (`v6\shreyas\inter\sheet_read0.png`).

**CSS animations** **[code]**: only two, `blink 1s steps(1) infinite` (a cursor) and `gridMove 2.5s linear infinite`.

**Reduced motion and scrolling** **[code]**:

- The site has zero `prefers-reduced-motion` rules.
- Scrolling is native, with no smooth-scroll library.

**Case pages** (`v6\shreyas\case-survey-detail\sheet_oldscreen.png`):

- A "Click to see the old screen" toggle swaps the phone image with a crossfade of about 500 ms.
- A slide carousel steps through research illustrations (`sheet_slide.png`).
- The rest of the motion is Framer's standard fade-up on scroll.

### 2.4 Interactivity

**Interactions on the home page:**

- The nav words swap on hover.
- The tab bar scrolls to sections.
- The accordions open and close.
- The No button runs away, and Yes rewards you with a GIF.
- The hero's 3D spaghetti responds to the pointer (`sheet_hero_ptr.png`).
- The case-study toggles switch between before and after.

**Accessibility problems:**

- The runaway No button cannot be pressed with a mouse. With a keyboard it is just a button, so the joke only works for pointer users.
- Nothing pauses the marquee or the loops.

### 2.5 Animated screens

Shreyas has **no moving app screens** in the two case studies I captured fully: `/survey`, the Digit Edge field-survey app (`v6\shreyas\case1\`, `v6\shreyas\case-survey-detail\`), and `/admissibility`, the Admissibility Portal (`v6\shreyas\case-admissibility\`). Every screen is a static image. Movement comes only from Framer's scroll fade, the before/after toggle and one slide carousel. The only video on the site is the Breaking Bad footer clip and the 45 px emoji loops.

This is useful as a contrast: his case studies feel much less alive than Kaustubh's, even though his home page is busier.

**Device frames:**

- Two static phones in the `/survey` hero.
- A laptop mock on a gradient in the `/admissibility` hero.
- Screens annotated with thin blue callout lines and yellow "Stage" boxes.

### 2.6 Branding system

**Palette** **[code][seen]**: tomato `#C84419`, off-white `#F7F7F5`, ink `#100C08`, yellow `#FFBB00`, plus an olive and a cream used as section backgrounds.

**Type** **[code]**:

- **Display:** Milker (caps). Hero lines are 60 px with a 72 px line height.
- **Accent:** Britney italic.
- **Body:** Mulish, mostly at 14 to 16 px with a 1.2 line height (16.8 and 19.2 px).
- **Receipt:** Sometype Mono.
- **Also loaded:** ROGENZ (brush), GC Palioka, Bricolage, and Inter as a fallback.

**Props**: photographic food cut-outs (tomato, parsley, onion, sauce) used as ornament, and a rotating circular text badge.

### 2.7 Case-study structure

**`/survey`, Digit Edge:**

1. A hero with two phones.
2. A sticky table of contents on the left, with the active item in orange.
3. A "Quick read" summary.
4. An illustrated "road journey" of the field agent.
5. Research, shown as illustrations that look AI-generated, in a slide carousel.
6. Annotated screens, each with a "Click to see the old screen" toggle.
7. "The outcome", with stats.
8. "What I took away".
9. The rotating badge.
10. "Other works" cards.

**`/admissibility`:**

1. A laptop hero.
2. A spot-the-difference image pair to set up the problem.
3. A winding-road story.
4. "The Portal: Before and After", with Problem 1 to 4 tabs and a Solution toggle that reveals callouts.
5. Charts and metric cards.

### 2.8 Steal for Lana

- **Commit to one metaphor in every word.** Shreyas's nav words swap into kitchen words on hover (Projects to Menu, Contact to Booking). Lana's night world could do the same with her door objects:
  - Brands to "seed packets";
  - Films to "the projector";
  - Contact to "send a letter" (the envelope);
  - About to "the mirror".
  - The swap is one word, so it costs nothing and makes the world feel complete.
- **Contact as an object.** His contact is a till receipt ("THE BILL") in a mono face. Lana's envelope door could open into a letter with a postmark and a wax seal. Her email address goes in the address field, and her timezone in the postmark.
- **Tiny transparent loops as ornament.** His 45 px emoji webms are about 30 KB each. Lana's moths and fireflies could be tiny transparent animated WebPs (WebP keeps alpha; the cv2 webm route below does not). Use them as punctuation beside a heading, never as a background.
- **Before and after in the same frame.** "Click to see the old screen" swaps the image inside one phone with a 500 ms crossfade. This is a clean way to show a redesign in Products without two side-by-side boxes.
- **A spring on buttons.** Stiffness 400, damping 25, scale 1.05 on hover and 0.95 on press. Small, quick and physical.

### 2.9 Avoid

- **Body text at 14 px with a 1.2 line height.** It fails Lana's own rule of 16 px or more, and it is tiring to read at length.
- **A 12.6 MB Spline scene as the hero.** It loads as a blur and reloads when you scroll back. There is also no reduced-motion handling anywhere on the site.
- **Desktop-only work.** The phone version hides the projects completely.
- **The runaway No button.** It is a joke that excludes keyboard and touch users.
- **Things Lana named as AI patterns,** all present here:
  - the glass pill nav;
  - the sticky pill tab bar;
  - three chef cards in a row;
  - a testimonials row;
  - AI-looking research illustrations.
- **Seven font families on one site.**

---

## 3. Lana's apps as moving-screen material

### 3.1 How I recorded

`v6\scripts\c_app_rec.py <app> <flow>` drives a flow and records it two ways at once:

- **Playwright's `record_video_dir`:** VP8 webm at 25 fps and 1x, covering the whole session including page load.
- **A Chrome DevTools screencast** (`v6\scripts\c_rec.py`, the `Screencast` class): JPEG frames with timestamps, taken only between the start and end of the flow.

The screencast frames are resampled to a constant 15 fps and can be cropped to one panel. Then they are exported as:

- animated WebP at quality 70 and 50, and a 7.5 fps version at quality 60 (with PIL);
- VP9 and VP8 webm (with OpenCV);
- a poster WebP (the last frame).

Each run also writes `kf_*.png` key frames, a `sheet_flow.png` contact sheet and `sizes.json`.

Options are environment variables:

- `NOVIDEO=1` skips the Playwright video.
- `FORCE2X=1` launches Chrome with `--force-device-scale-factor=2`. This is the only way I found to get 2x screencast frames. The screencast `maxWidth` setting does not upscale.
- `SCALE=0.5` scales the export down.
- `TAG=-x` names the output folder.
- `ALG_ANSWER=7` sets the answer typed in Algebrawl.

There are two things to know about the screencast:

- **It only emits a frame when the screen changes.** A pause at the end of a flow would disappear. The resampler therefore pads to the real start and stop times, so the hold survives.
- **H.264 is not available.** OpenCV writes VP8 and VP9 webm without ffmpeg, but its `avc1` encoder fails here (the OpenH264 DLL is missing). `mp4v` writes, but browsers do not play it reliably.

**Privacy check** **[measured]**: during every recorded flow, I logged every fetch, XHR, WebSocket, beacon and non-GET request. All four apps made **none** while I typed and tapped.

- **PsyClick:** labels its demo "local only".
- **Bloom:** stores everything in IndexedDB (`bloom-db`).
- **Algebrawl:** saves only to `localStorage` (`algebrawl_save_data`: `{playerName, enemies, timestamp}`).
- **Debt Ledger:** says "nothing leaves your device unless you turn on cloud sync". I did not turn sync on.

In Algebrawl, I used the hero name "Moth".

### 3.2 PsyClick (https://psyclick-app.vercel.app/, 1440x900)

**What it is.** The marketing site for the Windows app: Next.js with turbopack, 20,561 px tall.

- **Opening.** An automatic intro of about 7 s types "It worked out fine." with keystroke bars and a moving cursor, then says "The words said fine. The rhythm didn't." A "Skip intro" button skips it.
- **Further down:**
  - a live "PsyClick Monitor" strip that reacts to the mouse and keyboard;
  - a "Type a line. See your rhythm." demo;
  - a mock clinician dashboard;
  - role tabs, the "One calm path" stepper, an eight-step algorithm stepper, an FAQ, and the ByteMe team section.

**Flows** (5 to 10 s each):

1. **"See your rhythm" typing (recorded).** This is the best moving screen of the four apps.
   1. Go to the URL and wait for network idle.
   2. Click the text "Skip intro" if it shows.
   3. Run `document.querySelector('#try-in').scrollIntoView({block:'center'})`, then start capturing.
   4. Click `#try-in`.
   5. Type "Honestly, it was fine." one key at a time, 110 to 180 ms apart. Pause 700 ms after "Honestly," and 1,100 ms before "fine."
   6. Hold for 1.8 s.

   On screen, each key adds a cyan bar, and each pause over 0.6 s adds a taller orange bar. KEYS, AVG FLIGHT, AVG DWELL and PAUSES count up (22 keys, 287 ms, 24 ms, 2 pauses).

   Crop to the panel: at 1x the CSS box is x 120, y 308, 1,200 by 365. To start over, use `.try-reset` ("Clear and try again"). Prompts 1 to 3 are the round buttons at the top left of the panel.

   Recording: `v6\apps\psyclick\rec\try\` (1x, 8.7 s) and `v6\apps\psyclick\rec\try-2x\` (2x, 8.6 s). The contact sheet is `sheet_flow.png`.
2. **The auto intro.** Open the URL with `wait_until="commit"` and record 8.5 s straight away. No input is needed.

   On screen:
   1. A small loading mark shows on dark teal.
   2. "It worked out fine." types itself over a row of keystroke bars. A "0.9 s hesitation" box lights up before "fine".
   3. A rhythm curve draws in, with a "1.18×" readout.
   4. "The words said fine. The rhythm didn't." appears.
   5. The page opens onto the light hero.

   Recorded at half scale: 720x450, 8.7 s, 268 KB as q70 WebP.

   Output: `v6\apps\psyclick\rec\intro\`.
3. **The algorithm stepper.**
   1. Skip the intro.
   2. Scroll to the button whose text contains "Signal Capture".
   3. Click the steps containing "Smooth", "Extract", "Baseline", "Hotelling", "PSI", "Classify" and "Normative", 1 s apart.

   On screen, the active dot moves along the rail. The detail panel blurs out and back in with each step's title, formula and tags. Recorded at 960x316, 7.6 s, 444 KB as q70 WebP.

   Output: `v6\apps\psyclick\rec\algo\`.
4. **The dashboard mock.**
   1. Scroll to `button.pd-new`.
   2. Click the `button.pd-nav` items "Clients", "Audit log", "Security center" and "Dashboard", 1.3 s apart.
   3. Click a `button.pd-row` to open a client.

   On screen, the main panel switches between the client table, the audit log and the security centre. Opening a row slides in a client drawer with a radar chart. Recorded at 960x548, 7.7 s, 528 KB as q70 WebP.

   Output: `v6\apps\psyclick\rec\dash\`.

**Blockers.**

- The intro plays on every fresh load and covers the page for about 7 s, so skip it first.
- The page is very long, so scroll by selector, not by pixel offset.
- I found no other blockers.

### 3.3 Bloom (https://bloom-liart-delta.vercel.app, 390x844)

**What it is.** A pastel phone app for workouts, food and cycle tracking:

- a bottom tab bar (Today, Workout, Food, Cycle, Progress, You);
- big rounded colour cards ("Active Recovery", a pink "Why you're here" card);
- day-streak and water counters.

**Onboarding.** A fresh visitor always lands in onboarding. The fields come prefilled: `#heightCm` 175, `#weightKg` 80, `#age` 21, `#goalWeightKg` 65 and `#goalDate` 2026-10-31.

**Bug to fix.** The prefilled goal date is in the past, so the pace screen says "losing about 1500.0kg a week". My script works around it by filling `#goalDate` with 2027-06-30 before the second Continue, then clicking "Use this plan".

**Flows** (all in a 390x844 phone context with `is_mobile` and `has_touch`):

1. **Logging a period on the cycle calendar (recorded, 7.8 s).**
   1. Do the onboarding.
   2. Click `a:has-text('Cycle')`.
   3. Start capturing.
   4. For each of days 13, 14, 15 and 16: tap `page.locator("button.relative", has_text=day).first`, then the text "Mark as a period day".
   5. Scroll 400 px and tap `a:has-text('Today')`.

   On screen, each day fills crimson. The action turns into a dark "Logged as a period day — tap to remove" pill. The "Does this feel right?" phase chooser appears, and it ends on the Today screen.

   Recording: `v6\apps\bloom\rec\cycle\` (`sheet_flow.png`). This is Bloom's best loop.
2. **Food choices (recorded at 2x, 6.5 s).**
   1. Tap `a:has-text('Food')`.
   2. Tap the button containing "Boiled Eggs". It turns mint with a check, and "Grocery list (1)" counts up.
   3. Scroll and tap "Tinolang", which makes it "Grocery list (2)".

   Tapping a meal adds it to the grocery list. It does **not** fill the calorie ring. A ring-filling loop would need "Quick add calories" or the food search, which I did not test.

   Recording: `v6\apps\bloom\rec\food-2x\`.
3. **Water.** On Today, tap the last button containing "Water" ("+ Water") four times, 0.7 s apart. Each tap adds one to the blue "Cups of water" tile, so it counts 0, 1, 2, 3, 4. Recorded at 390x844, 4.8 s, 53 KB as q70 WebP. It is short and calm, and it works as a small loop. Output: `v6\apps\bloom\rec\water\`.
4. **Not recorded.** The "See this week" plan and the Workout tab's "Complete workout" both look loopable.

**Blockers.**

- Onboarding runs on every fresh context, unless you seed the `bloom-db` IndexedDB first.
- The stale goal date (see above).
- At DPR 2 the screencast still sends 1x frames (390 wide) unless you use `FORCE2X`.

### 3.4 Algebrawl (https://algebrawl.vercel.app, 1440x900)

**What it is.** A pixel-art maths battler. You face Gauss, Newton or Fibonacci over a painted pixel background:

- an enemy portrait and an HP bar;
- a KaTeX question;
- a "Your answer..." input and a Submit Answer button;
- hearts for lives.

Wrong answers draw a taunt. Questions come from `Math.random`.

**Fixing the questions.** To make a recording repeatable, I replace `Math.random` with a seeded generator via `context.add_init_script`. The code is in `SEED` in `c_app_rec.py`. With that seed, Newton's first question is always "x² − 49 = (x − _)(x + _)", so the answer is 7.

**Flows:**

1. **From the enemy pick to the first hit (recorded twice).**
   1. Click "Sound ON" (this mutes the game), then "PLAY", then "START NEW GAME".
   2. Click the `input`, type "Moth" and click "ENTER".
   3. Click at (720, 450) every 0.5 s until "Select an enemy" appears. This steps through the five typewriter story lines.
   4. Start capturing.
   5. Hover Gauss at (498, 463), then Newton at (720, 463), then click Newton.
   6. Click "SKIP" on the intro dialog.
   7. Type the answer into the `input` and click "Submit Answer".

   - **Right answer:** the game shows "Correct!" and "Ah, a clever mind! Well done!", and Newton's HP drops from 100 to 80. Recording: `v6\apps\algebrawl\rec\battle-win\`, at half scale, 8.1 s.
   - **Wrong answer:** the game shows "Incorrect." with the taunt "Another mistake for the sequence of your demise." and you lose a heart. Recording: `v6\apps\algebrawl\rec\battle\`, full frame, 8.3 s.
2. **Title menu hover.** Hover "PLAY", "TUTORIAL" and "ABOUT THE GAME" in turn, then click PLAY.

   On screen, each button darkens under the pointer over the pink, painted, cloudy title screen. PLAY opens "SELECT MODE" (START NEW GAME, CONTINUE GAME, BACK TO MAIN MENU). Recorded at half scale: 720x450, 5.5 s, 331 KB as q70 WebP.

   Output: `v6\apps\algebrawl\rec\title\`.
3. **The typewriter story.** Record the five story lines after ENTER without clicking. Each line types itself out. Earlier frames are in `v6\apps\algebrawl\explore\`.
4. **Continue game.** Seed `localStorage.algebrawl_save_data` before load, to jump straight into a later fight.

**Blockers.**

- Mute first.
- The story and the enemy cards need clicks by coordinate. There are no stable selectors.
- The full-frame painted background is the heaviest thing in this report to compress (see section 4). Crop to the battle box or scale it down.

### 3.5 Debt Payoff Ledger (https://debt-ledger-puce.vercel.app/, 390x844)

**What it is.** A mono, ledger-styled weekly allocator for a student budget:

- three stat tiles (OWED TOTAL, DUE SOONEST, ALLOWANCES LEFT);
- "This Sunday's allowance" (week, amount received, an amount kept for food and school, and "Split this allowance");
- "Your debts";
- "History";
- "Reset all data".

**Flows:**

1. **Two debts, then a split (recorded, 12.5 s).**
   1. Click `input[placeholder='e.g. Credit card']` and type "Tuition balance".
   2. Click `input.ledger-input.mt-1[type=number]` and type 4500.
   3. Click "Add debt". The tiles change to ₱4,500 owed and "Tuition balance" due soonest.
   4. The form collapses, so click "+ Add a debt". Type "GCash loan" and 1200.
   5. Fill `input.ledger-input.mt-1[type=date]` with 2026-12-05, then click "Add debt".
   6. Type 3200 into `input.ledger-input[type=number]` number 0 and 1500 into number 1.
   7. Click "Split this allowance".

   The result is a "Proposed split" (Tuition 1,700, GCash 0, Allocated ₱1,700) and "Confirm & log this week".

   Recordings: `v6\apps\debt-ledger\rec\split\` (1x) and `v6\apps\debt-ledger\rec\split-2x\` (2x, 14.2 s). Trimmed to the last 6 s, it makes a good loop.
2. **Confirm.** Click "Confirm & log this week" so History fills and the "allowances left" count changes. I did not run this, but it stays local.
3. **Remove a debt.** Tap "×" on a debt so the totals fall.

**Bug.** The "Week of (Sunday)" date defaults to **21/11/2026, which is a Saturday**.

- **Cause** **[code]**: the bundle works out next Sunday as `a.setDate(e.getDate()+(7-t)%7)` and then formats it with `a.toISOString().slice(0,10)`. That converts to UTC, so in Manila (UTC+8) between midnight and 8 am the date slips back a day. I ran it at 06:25 local.
- **Fix:** format with local date parts instead of `toISOString`.

**Blockers.**

- The debt form collapses after the first add.
- Otherwise none.

---

## 4. Which format to embed

### 4.1 Measured sizes

These are from `sizes.json` in each recording folder. All loops are 15 fps unless stated. Sizes are in KB.

| Flow (export size, length) | WebP q70 | WebP q50 | WebP 7.5 fps q60 | VP9 webm (cv2) | VP8 webm (cv2) | Poster WebP | Raw Playwright webm |
|---|---|---|---|---|---|---|---|
| PsyClick typing, cropped, 1x (960x292, 8.7 s) | 244 | 188 | 133 | 332 | 368 | 13 | 1,317 (1440x900, 17.8 s, includes load) |
| PsyClick typing, cropped, 2x (1920x584, 8.6 s) | 535 | 424 | 307 | 798 | 940 | 32 | — |
| Bloom cycle, 1x (390x844, 7.8 s) | 267 | 222 | 156 | 777 | 800 | 26 | 1,027 (22.8 s) |
| Bloom food, 2x (780x1688, 6.5 s, mostly still) | 117 | 97 | 116 | 1,054 | 1,075 | 49 | — |
| Debt Ledger split, 1x (390x844, 12.5 s) | 351 | 304 | 291 | 1,055 | 1,047 | 24 | — |
| Debt Ledger split, 2x (780x1688, 14.2 s) | 797 | 676 | 570 | 2,565 | 2,526 | 41 | — |
| Algebrawl win, half scale (720x450, 8.1 s) | 726 | 557 | 359 | 968 | 1,066 | 25 | — |
| Algebrawl miss, full frame (1440x900, 8.3 s) | 1,728 | 1,298 | 825 | 2,590 | 3,056 | 59 | 2,320 (22.6 s) |
| Algebrawl title hover, half scale (720x450, 5.5 s) | 331 | 235 | 193 | 1,126 | 1,132 | 22 | — |
| PsyClick intro, half scale (720x450, 8.7 s) | 268 | 219 | 153 | 489 | 548 | 20 | — |
| PsyClick algorithm stepper, cropped (960x316, 7.6 s) | 444 | 332 | 235 | 928 | 934 | 17 | — |
| PsyClick dashboard, cropped (960x548, 7.7 s) | 528 | 418 | 290 | 1,158 | 1,190 | 37 | — |
| Bloom water, 1x (390x844, 4.8 s) | 53 | 44 | 49 | 309 | 361 | 24 | — |

**Playback check in Chrome** (`v6\scripts\c_fmt_test.py`, results in `v6\apps\_format\format_test.json`). I tested every file:

- Every webm reported a real duration, reached `readyState` 4, and wrapped round with `loop`.
- Every WebP decoded at its full size.

**Quality check:**

- A paused VP9 frame and the source PNG of the same moment look the same (`v6\apps\_format\q_loop_vp9_webm.png` against `q_kf.png`).
- The raw Playwright frame is slightly softer but readable (`q_pw_full.png`).

**Live page weight**, measured as bytes transferred on a fresh load until network idle:

- **PsyClick:** 538 KB (23 requests: 226 KB of script, 118 KB of fonts).
- **Bloom:** 281 KB.
- **Algebrawl:** 757 KB (557 KB of it images).
- **Debt Ledger:** 167 KB.

### 4.2 The options compared

**Raw Playwright webm**:

- **Setup.** Free and needs no extra code.
- **Format.** Always VP8 at 25 fps, at 1x viewport size. The bitrate came out at 0.4 to 0.9 Mbps **[measured]**.
- **Problem.** It includes the page load and every setup click. Trimming it without ffmpeg means decoding and re-encoding through OpenCV, at which point you may as well use the screencast frames.
- **Missing pieces.** No poster, no crop and no 2x.
- **Use.** Fine as a reference recording, not for publishing.

**Webm from screencast frames (OpenCV VP9 or VP8)**:

- **Strengths.**
  - It is cropped, trimmed and can be 2x.
  - It plays and loops in Chrome with `<video autoplay muted loop playsinline poster>`.
  - It can be paused from script, for example when off screen.
- **Size problem.** OpenCV gives **no bitrate or quality control**, so its VP9 is close to lossless. It came out 1.3 to 9 times larger than the q70 WebP of the same frames.
- **Other limits.**
  - No alpha.
  - I could not test Safari here. WebM playback on older iPhones is not guaranteed, so test on a real iPhone or keep a WebP fallback.

**PIL animated WebP**:

- **Size.** Smallest for flat UI in every test: 117 to 351 KB for a 7 to 12 s phone loop at 1x, and 535 KB for the 2x PsyClick panel.
- **Strengths.**
  - Loops natively and plays as a plain `<img>`, with `loading="lazy"` and `decoding="async"`.
  - Supports alpha, so it suits moth and firefly ornaments.
  - Safari has played animated WebP since version 14.
- **Weaknesses.**
  - No real pause: you can only swap in the poster.
  - No seeking.
  - Decoding large 2x frames costs more CPU than video.
  - On painted, full-frame content like Algebrawl's background it loses its advantage, at 1.7 MB for 8 s.

**A live iframe of the deployed app**:

- **Strengths.**
  - Crisp at any size.
  - Truly alive.
  - Weighs 167 to 757 KB per app.
- **Weaknesses.**
  - It runs the whole app inside the portfolio.
  - Lana cannot script, reset or seed it across origins.
  - Bloom would open on onboarding (with the stale goal date), and Algebrawl would play sound.
  - Keyboard focus and scroll get caught inside the frame.
  - Each extra iframe costs a whole app's start-up time.
- **How Kaustubh avoids this.** His live screens are his own components on his own domain (`.cppl`, `/work/goldboost/landing/`), not iframes of deployed products.

### 4.3 Recommendation

**1. Default: cropped animated WebP.**

- **Settings.** 12 to 15 fps, quality 60 to 70, captured at 2x with `FORCE2X`, then scaled to the size it will display at 2x. A phone at 300 CSS px wide becomes 600 px.
- **Crop.** Crop to the part that moves: the rhythm panel, not the whole page.
- **Length.** Keep it to 6 to 8 s of action plus a short hold.
- **Poster.** Ship the poster WebP (13 to 59 KB) next to it.
- **Budget.** Aim for 150 to 450 KB per loop. The numbers in 4.1 show that this is realistic for PsyClick, Bloom and Debt Ledger.

**2. One native live widget per app, in place of the iframe.**

- **PsyClick first.** A self-contained "type a line, see your rhythm" bar is a few kilobytes of code. The visitor drives it, it works locally, and it is the strongest "alive" moment available to Lana.
- **Later, the same for the others.** A tappable cycle calendar for Bloom, and an allowance slider that re-splits two debts for Debt Ledger.
- **Fallback.** Keep the WebP loop as the fallback when reduced motion is on, and for the moment before the widget is used.

**3. Webm only for Algebrawl's painted battle.**

- **Settings.** At half scale (720x450) VP9 is 968 KB, against 726 KB for WebP. At this size both are acceptable, and video can be paused when off screen.
- **Better option.** Better still, crop to the question box and the HP bar. The painted background can be a still image behind it.

**4. Do not iframe the deployed apps on the portfolio pages.** If Lana ever wants one, use a click-to-load poster ("Open the real app"), `loading="lazy"`, and a separate page or a new tab.

### 4.4 Reduced motion and pausing

**Respect the setting in markup, not only in CSS.** CSS cannot stop an `<img>` WebP or a `<video autoplay>`.

For WebP, let the browser choose the still:

```html
<picture>
  <source srcset="/products/psyclick-rhythm.poster.webp" media="(prefers-reduced-motion: reduce)">
  <img src="/products/psyclick-rhythm.webp" width="600" height="183" loading="lazy" decoding="async"
       alt="Typing a line into PsyClick: each key draws a bar, and the two hesitations show as tall amber bars.">
</picture>
```

For video, leave out the `autoplay` attribute and start playback from script, only when motion is allowed and the video is on screen:

```html
<video class="loop" muted loop playsinline preload="none" poster="/products/algebrawl.poster.webp">
  <source src="/products/algebrawl.webm" type="video/webm">
</video>
<script>
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && !still.matches) { v.preload = 'auto'; v.play().catch(() => {}); }
    else v.pause();
  }), { rootMargin: '200px' });
  document.querySelectorAll('video.loop').forEach(v => io.observe(v));
</script>
```

**Give every loop a pause control.** Every loop here runs longer than 5 s, repeats forever and sits beside other content. WCAG 2.2.2 (Pause, Stop, Hide) therefore applies:

- **Videos:** pause from the control.
- **WebP:** the control swaps `src` to the poster and back.

A small moon or star button in the corner of the frame fits Lana's world.

**Alt text.** It should say what the flow shows, not repeat the words on the screen. Lana listed captions that repeat on-screen text as an AI pattern.

### 4.5 Making more loops

To make a new loop:

1. Add a flow function to `v6\scripts\c_app_rec.py`. It should start the screencast, do the steps, stop it, and return a crop box in CSS pixels, or `None` for the full screen.
2. Run it, for example:

   ```
   FORCE2X=1 NOVIDEO=1 python c_app_rec.py psyclick try
   ```

3. The run writes `loop_q70.webp`, `loop_q50.webp`, `loop_q60_7fps.webp`, `loop_vp9.webm`, `loop_vp8.webm`, `poster.webp`, `sheet_flow.png` and `sizes.json` into `v6\apps\<app>\rec\<flow><TAG>\`.

To trim, pass `t0` and `t1` (screencast timestamps) to `Screencast.resample`.

---

## 5. Where the captures are

**Kaustubh** (`v6\kaustubh\`):

- **Main pages:** `load\`, `home\`, `work\`, `page-archive\`, `page-about\`, `page-contact\`, `page-ask\`.
- **Phone:** `mobile\`.
- **Case studies:** `case-goldboost\`, `case-0xppl\` and `case-a-bit-smart\` hold the full scrolls, bursts, `text.txt`, `style.json` and `net.json`.
- **Detail captures:**
  - `deep-goldboost\`: the iframe prototype and the reload loader.
  - `deep-0xppl\`: the live flow and the four delight tiles.
- **Source:** `code\` holds the saved JS and CSS.

**Shreyas** (`v6\shreyas\`):

- **Home and interactions:** `home-d\` (the desktop home scroll, bursts and style) and `inter\` (nav, tabs, READ, Yes and No, hero pointer).
- **Phone:** `mobile\`.
- **Case studies:**
  - `/survey`: `case1\` holds the full scroll, and `case-survey-detail\` holds the toggle, the road, the slider and the bottom of the page.
  - `/admissibility`: `case-admissibility\`.
- **Not a case study:** `case0\` is a home-page capture from a READ click that missed.

**Apps** (`v6\apps\`):

- **Earlier passes for each app:** `recon_*.png`, `scroll\`, `explore\` and `code\`.
- **Recordings:** `rec\<flow>\` for each flow, with `apps\_format\` holding the playback and quality tests.
- **Scripts:** `c_app_rec.py`, `c_rec.py` and `c_fmt_test.py`.

---

## 6. Synthesis

- **Kaustubh's portfolio is the reference for Lana's structure.** It is a world of objects you explore, where hovering an object previews what is behind it and clicking flies you in through a short, three-beat transition. That is Lana's sleeping-moon hero and six door-objects, already shipped and working. Her plan does not need to change. It needs his follow-through:
  - every hover shows real content;
  - the transition is the same every time;
  - one easing curve runs through the whole site.
- **Lana's "the rest feels plain" problem is solved by interaction inside the work, not by more decoration around it.** Kaustubh's 0xPPL live component and "the delight" tiles beat every static or video screen in either portfolio. Shreyas's busy home page, by contrast, leads into case studies that are entirely static.
- **For Products, the plan is:**
  - one native live widget per app, starting with PsyClick's typing rhythm;
  - cropped 2x animated WebP loops of 150 to 450 KB for the other flows, each with a poster;
  - a `<picture>` source for reduced motion;
  - a pause control.
- **Webm only where the picture is painted** (Algebrawl). No iframes of the deployed apps.
- **Fix two app bugs before recording the final loops:**
  - Bloom's prefilled goal date (2026-10-31) is in the past and gives a 1500 kg-a-week pace.
  - Debt Ledger's "Week of (Sunday)" shows a Saturday before 8 am Manila time because of `toISOString`.
- **Ideas from Shreyas worth taking:**
  - word swaps on hover that complete the metaphor;
  - contact as a physical object;
  - tiny transparent ornament loops;
  - before and after inside one frame.
- **What to leave behind:**
  - his 14 px body text;
  - the 12.6 MB 3D hero;
  - the missing reduced-motion support;
  - the desktop-only work;
  - the pills and the three-card rows.
- **What to leave behind from Kaustubh:**
  - the small grey numbered labels, which fail AA;
  - the "Open to work" chip;
  - the multi-second 3D load before anything appears.
