# Research A: Eemon Roy, Ayush Dhibar and Himanshu Shakit, studied first-hand

Researched on 2026-11-17 with Playwright driving the installed Chrome, at 1440x900 and 390x844. I scrolled every page in half-screen steps, took bursts of frames wherever something moved, hovered and clicked each kind of element, opened the case studies, read the network log and the computed styles, and read the sites' own shipped CSS and JS in the page to get exact durations and easings. None of the three sites blocked automation or showed a CAPTCHA.

All captures sit under one folder, which is a temporary scratchpad and may be cleared by a reboot:
`C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v6\`
Below, `v6\…` means a path inside that folder. Files whose names start with an underscore are contact sheets; open those first. The scripts are in `v6\scripts\`.

Evidence labels: **[seen]** means I saw it in frames. **[code]** means I read it from the DOM, the CSS or the JS bundle. **[measured]** means I calculated it from scroll positions or timestamps. **[inferred]** means my reading of something I could not fully confirm.

---

## 1. Eemon Roy

### 1.1 What it is

The real site is https://www.eemonroy.com/ (the wallofportfolios page links to it). It is a hand-built Vite and React single-page site for a product designer at Microsoft. It feels like a bright desk drawer of work, with a cardboard box, a pink folder and marker doodles. Each Copilot case study is told through looping screen films. It was an Awwwards nominee, and an Awwwards ribbon is pinned to the right edge.

The home page is 4,638 px tall at desktop. The case studies are 2,800 to 8,700 px. There are seven work pages (`/researcher`, `/notifications`, `/system-tray`, `/error-scenarios`, `/mobile-story`, `/bookings`, `/voice-access`) plus `/sidequests` and `/about`.

### 1.2 Flow

**Home, screen by screen** (`v6\eemon\_sheet_home_desktop.png`, `v6\eemon\motion\_scroll.png`):

1. **Preloader** (`v6\eemon\motion\_load.png`):
   - The screen is flat mint (`#adfff1`).
   - The word "eemon" fades in, in a rounded serif in sky blue (`#66d6fe`).
   - The letters then scale up past the camera until they fill the frame.
   - The mint wipes away to reveal the page. This takes about 2 to 3 s in my capture.
   - It is a video file (`/assets/preloader-CpauUsfh.webm`, 248 KB), with separate portrait versions for phones that the code picks with `(max-aspect-ratio: 1/1)` **[code]**.
   - It plays only on the home page and only on the first load and then every third load in a session (a sessionStorage counter, modulo 3). It is capped at 9 s and never plays under reduced motion **[code]**.
2. **Hero** (0 to about 1,000 px):
   - The heading is a sentence in Averia Serif Libre light at 62 px: "Hi i'm Eemon / a Product Designer at Microsoft / and here's everything i know about".
   - "Product Designer" sits on a yellow text-selection highlight and "Microsoft" on a blue one, like words selected in an editor.
   - Under it, a pink cardboard box drops in and its flaps spring open. Three illustrated cards rise out of the box: "Building in Code", "Designing AI Products" and "Storytelling + Play". Each has a gradient wash and a pencil drawing.
   - Soft glowing coloured dots (red, blue, yellow, green) are scattered around.
   - A small "pause animations" button sits under the hero, and another icon version sits in the header.
3. **Hand-off to Work:**
   - As you scroll, a thick pink ribbon (`#ff94cf`) draws itself in from the left edge, sweeps under the box and continues down the page.
   - The "Work" heading is centred at 42 px, flanked by two small icons (a toolbox and a tree).
   - The ribbon is still drawing when the work grid arrives, so there is no hard cut between the two.
4. **Work grid:**
   - Two columns of 618x373 tiles, eight in all.
   - Each tile is a looping film of the project, with a grey label strip under it (project name left, category and year right, both in small caps).
   - The grid sits inside thin 1 px rule lines.
5. **Testimonials** ("A few kind words from colleagues"):
   - Six cards in three columns. Each has a pastel gradient (pink to yellow, blue to violet), a portrait, a name, a title and 14 px serif text.
   - The ribbon passes behind them.
6. **Sidequests** ("Take a look at my lil' Sidequests <3"):
   - Two small thumbnails on the right: a looping "Ripple Type Generator" film and "In Full Bloom".
7. **Footer:**
   - The band is pale pink (`#fff5fb`).
   - On the left is a glossy pink 3D folder with a clipped sheet of hand lettering ("Eemon's workin'") that sways gently.
   - On the right are serif links in rose (Work, Sidequests, About, Instagram, LinkedIn).
   - At the bottom it says "website coded with love in" followed by a VS Code icon.

**Into a case study** (`v6\eemon\motion\_click.png`):
- A click swaps the route instantly. The new page is already drawn 80 ms later. There is no page-transition animation.
- What makes the arrival feel designed is the case head animating in:
  - The title words fade in one by one, each turning from grey `#d4d4d4` to ink in 0.2 s ease-out, 0.06 s apart.
  - The eyebrow rises 6 px in 0.4 s.
  - The platform chips pop in from 82% scale in 0.3 s, 0.1 s apart **[code]**.
- At the same moment the hero film starts playing.

**Case study, screen by screen** (researcher: `v6\eemon\cs\_sheet_researcher.png`; others: `v6\eemon\cs\_sheet_<slug>.png`):

1. **Head band:**
   - Left: a small caps eyebrow with a green status dot (for example "Copilot app on desktop"), then the title in Plaak, a wide caps grotesque, at 56 px.
   - Right: OS chips, a one-sentence summary, and a 2x2 facts grid (duration, role, users, status). The status reads "Live in Copilot" in green.
2. **Hero band** (1316x501, full column): a film (researcher), a still (system tray), a moving DOM collage (notifications) or drifting rows of error screens (errors).
3. **Overview toggle:** on some pages, a "TL;DR / overview" toggle opens a spec table (problem, role, surfaces, reach, result, status) with a 0.45 s `grid-template-rows` transition.
4. **Opening statement:** one centred sentence in Plaak caps at 22 px (for example "The day Copilot stopped answering questions and started doing work").
5. **Intro:** an image on the left (571x325) and five short serif paragraphs on the right.
6. **The turn:**
   - A second centred statement that ends on a ghosted word ("…the agent effectively disappeared", with "disappeared" in grey).
   - A small rotated arrow, then "(this was a problem)" in tiny caps.
   - This is the hinge into the main story.
7. **The narrative stage:** a pinned two-column story of six or seven steps (section 1.3).
8. **Outcome and closing:** a closing statement and one big stat line ("Researcher agent is used by 2 million people weekly").
9. **Project outro:** "Return to homepage" on the left, the next project's looping tile in the middle, "See related project" on the right. Then the same footer.

The film case studies (mobile story, bookings, voice access) run differently:
- head, then intro, then a YouTube embed;
- then "The process of crafting this video…";
- then a three-column grid of hand-drawn storyboard frames in blue marker;
- then a grid of "3D explorations";
- then the outro.

The error case study uses compare sliders and a carousel instead of a pinned stage.

### 1.3 Motion (with numbers)

**Hero box and cards** **[code]:**
- The box drop is `home2-box-drop`, 1.15 s, `cubic-bezier(0.5, 0, 0.25, 1)`.
- The flaps run `home2-flap-back/front` over 1.3 s with keyframed springs. They start folded (`scaleY(-0.93)`), overshoot to 1.07 at 72%, then settle. The overshoot uses `cubic-bezier(0.35, 0, 0.25, 1)`.
- The cards run `home2-card-rise`: 1.2 s, `cubic-bezier(0.16, 0.7, 0.26, 1)`, from inside the box (per-card `--from-x/--from-y/--from-rotate` at 45% scale) to their place. Their opacity fades in over 0.3 s.
- Hover on a card lifts and scales it by about 3% (`v6\eemon\motion\_zoom_nav_cards.png`).
- The cards are buttons. A click smooth-scrolls to that topic's row in the work grid (instant under reduced motion) **[code]**.

**Glowing dots** **[code]:**
- Each dot is a `home2-star`: a radial gradient from a core colour to an edge colour, blurred by 22% of its size.
- A `pointermove` handler moves them, so they drift with the pointer.
- The requestAnimationFrame loop stops when the hero leaves the viewport or the tab is hidden.
- On phones they split into a back layer and a front layer.

**Scroll ribbon** **[code]:**
- It is one SVG path (`home2-scroll-line__path`) rotated 8.16°.
- Its `stroke-dashoffset` is bound to a scroll-driven custom property, `--home2-line-offset`. A matching mask (`home2-grid-highlight__mask`) reveals a highlight on the grid.
- The ribbon draws continuously with scroll (`v6\eemon\motion\_scroll.png`, frames at y=280 to 720).

**Section reveals** **[code]:**
- `.home2-reveal`: opacity over 0.7 s ease plus `translateY` over 0.85 s `cubic-bezier(0.22, 1, 0.36, 1)`.
- Staggered delays are 0.08, 0.09 and 0.16 s.

**Work tiles** **[code, seen]:**
- Each tile is a muted, looping `<video>` with a webp poster.
- An IntersectionObserver plays it once 15% or more is visible, and pauses it when it leaves or when the tab is hidden.
- It is not hover-gated. My hover test showed the video already playing before and after the pointer (`v6\eemon\motion\home_motion.json`).

**Error-404 tile** **[measured]:**
- This tile is not a video. It is three rows of real error-screen screenshots over a soft glow.
- The rows drift in alternating directions at about 18 px/s (`errors-drift`, linear, infinite, loop lengths 148, 181 and 187 s).
- Reduced motion stops it.

**Footer:**
- The lettered sheet sways ±1.8° in 2.6 s ease-in-out, forever.
- A 1.04 s paper-art mp4 loops under it.

**Case-study narrative stage** (researcher measured in detail: `v6\eemon\screens\researcher_narrative.json`, frames `v6\eemon\screens\researcher_scroll_*.png`) **[code, measured]:**
- `.narrative` is a 5,643 px scroll track. Inside it, `.narrative__sticky` is `position: sticky; top: 67px`, 659 px tall.
- Left: a 658x659 media column with all step media stacked on top of each other: six mp4s and one webp.
- Right: a 555 px copy column with all step texts stacked.
- **Step length:** each step gets about 700 px of scroll (steps change at y = 2377, 3077, 3777, 4477, 5177, 5877).
- **Change-over:**
  - When a step boundary is crossed, the outgoing video pauses and the incoming one resets to 0 and plays.
  - The media crossfade on `opacity 0.5s ease`, and the copy blocks on `opacity 0.35s ease`.
  - So every step's film always starts from its first frame.
- **Copy lines:**
  - Inside a copy block, each paragraph starts at opacity 0 and 12 px low.
  - This is scrubbed by scroll, not timed: at 100 px into a step the first paragraph is at about 84% and 2 px, and at 200 px it is fully in.
- **Progress rail:**
  - A 40 px white rail lists every step title as a button (16 px, set in caps).
  - It slides down 51 px into view (`transform 0.4s ease`) when the stage pins, and back up when the stage releases.
  - A grey line under it grows with scroll from about 790 px to 2,000 px wide.
  - The step buttons jump straight to a step.
- **Phone:** there is no pinned stage. Each step becomes a plain stack of film, then heading, then text (`v6\eemon\phone\_researcher.png`).

**Notifications case study** (`v6\eemon\interact\_int.png`, `v6\eemon\interact\_segs.png`):
- **Hero:** a live DOM collage of about 15 toast screenshots on hot pink, behind "Scalable notifications for Copilot". The toasts drift and swap over time and shift with the pointer.
- **Stage contents:** the same stage holds three kinds of content:
  - a DOM bar chart ("devices in segment", "users in scale") whose red bars grow;
  - a full-width carousel of desktop mock-ups per user segment, with arrows, dots and labels like "1 of 4: Unauthenticated users";
  - two diagrams that build in sequence when they enter. "Restraint is a feature" adds its state-machine nodes and dashed loop arrows one after another. In "A global cap for notifications", the toasts fade in after their arrows.

**Error case study** **[code, seen]:**
- **Compare sliders:**
  - A "Previous look / Current look" image pair.
  - The control is a native `<input type="range">` with an aria-label and a 2 px handle.
  - The old screen sits on a green wash and the new one on a pink wash, so the two halves read as different colours (`v6\eemon\interact\e_slider_*.png`).
- **Scenario carousel:** a compare carousel steps through three error scenarios with arrows and labelled dots.

### 1.4 Interactivity

**Cursor** **[code, seen]:**
- The native cursor is hidden only on devices with a fine pointer and hover.
- In its place is a 12 px red dot.
- Over links a yellow pill label (`#ffd360`, Plaak 12 px caps, 25 px tall) appears at the dot's top-left. It fades in over 0.14 s and scales from 0.55 to 1 over 0.22 s `cubic-bezier(0.16, 1, 0.3, 1)`. Examples: "Read case study" on work tiles, "Try it now!" on sidequests (`v6\eemon\motion\_zoom_labels.png`).
- A 216 px canvas "smear" trails the dot. It is turned off under reduced motion.
- It is small, not a big custom cursor, but it does replace the native one.

**Nav hover** (`v6\eemon\motion\_zoom_nav_cards.png`):
- Each nav word gets its own hand-drawn marker doodle behind it, appearing within about 100 ms:
  - Work: a purple scribbled starburst.
  - Sidequests: a red looped oval, like a marker circle.
  - About: yellow sparkle flecks.
- The footer links do the same with yellow scribble highlights (`footer-*-highlight.webp`).
- In code these are `illustrated-link__art` images, and their transition is removed under reduced motion.

**Other interactions:**
- **Hero cards:** hover lift, and a click jumps to the work row.
- **Work tiles:** the cursor label appears and a click opens the case. The tiles have no lift or zoom.
- **Case pages:** the step-rail buttons, the TL;DR toggle, carousel arrows and dots, and the compare range. All are real buttons or inputs with aria labels **[code]**.

**Motion control:**
- A "Pause site animations" button sits in the header (35 px) and a text version under the hero.
- The pause state is stored in sessionStorage (`poseidon-motion-paused`) and pauses every video and loop.
- Under reduced motion the button reads "Animations paused by reduced motion preference" **[code]**.

**Keyboard:** there is a skip link. The focus outline is 2 px in the link colour.

### 1.5 Animated screens (the main reference)

I checked every work page. Only the researcher case study actually puts looping films inside the case. The others use DOM motion or stills, and their films appear only as home-page tiles. I fetched every image the case pages load and checked them in the page. None is an animated WebP, APNG or GIF. Every moving screen is a `<video>` or live DOM/CSS. There is no Lottie, Rive or canvas animation.

**Researcher** (`/researcher`), 7 films:

| Film | Length | Size (displayed) | What the loop shows |
|---|---|---|---|
| `video/hero.mp4` | 14.57 s | 2432x904 (1316x501) | Copilot sidebar, then Researcher picked, then the prompt typed, then the camera drops to the taskbar where a hover card shows progress, then "Research completed" (`v6\eemon\loops\_stackA.png`, row 1) |
| `user-expectations.mp4` | 16.97 s | 1666x1682 (658x659) | Windows wallpaper, then the Copilot splash window, then "Hi, how can I help you?", then the cursor clicks the input, then "Go through the marketing material…" types out, then "Alright, I've started working on your report" with a plan checklist and cycling coloured progress dots, then the camera pans to the window controls and minimises, then the empty wallpaper again (`v6\eemon\screens\_loop_researcher0.png`) |
| `the-problem.mp4` | 10.23 s | same | A Teams chat, then alt-tab to Copilot to check progress, then back to Teams, repeated. The task-switcher view zooms out between them. It shows "context switching" (`v6\eemon\screens\_loop_researcher1.png`) |
| `confidence.mp4` | 11.8 s | same | A stacked before and after. The top half (pink wallpaper) is the old taskbar with a sticker pill "✕ Low info, low trust". The bottom half (blue wallpaper) is the new one with "✓ Thinking states add trust". The same cursor hover runs in both, and the hover card fills with progress, then "Researcher is complete" (`v6\eemon\screens\_loop_researcher2.png`) |
| `os-layer.mp4` | 11.7 s | same | The cursor rests on the taskbar icon. The hover card cycles four states while a small floating label above names each one: running, input needed, error, complete. The icon's ring changes colour to match (`v6\eemon\loops\_stackA.png`, row 2) |
| `multi-instance.mp4` | 13.93 s | same | Empty wallpaper, then a hover on the taskbar shows three Researcher cards side by side, then they fade (about 0.6 s), then 2 s of quiet desktop, then they come back as three "Research completed" cards, then they fade (`v6\eemon\screens\_loop_researcher4.png`, top) |
| `edge-case.mp4` | 8.53 s | same | Teams, then the taskbar card turns orange with "Researcher needs attention", then a click opens Copilot with clarifying questions, then back to Teams (same sheet, bottom) |

The seventh stage item, "The outcome", is a still photo of the Microsoft Ignite keynote.

**Other case studies:**
- **Notifications:** no films. The hero is a drifting, pointer-reactive DOM collage of real toast images. The stage holds a DOM bar chart, a mock-up carousel and two diagrams that build in sequence. The home tile is a 19.2 s webm.
- **System tray:** no films in the case. Its six stage steps are webp stills on a lime-green wash. Its home tile is a 9.65 s webm in which the green gradient drifts and a caret blinks in "System Tray|".
- **Error 404:** no films. The hero has drifting rows of error screens, then compare sliders and a carousel.

**Home tiles, one webm each** (`v6\eemon\loops\_stackA.png`, `_stackB.png`):

| Tile | Length | Size | File size |
|---|---|---|---|
| Researcher | 16.52 s | 1916x1172 | 16.9 MB |
| Notifications | 19.2 s | | 17.3 MB |
| System tray | 9.65 s | | 1.4 MB |
| Mobile story | 20.73 s | | 5.6 MB |
| Bookings | 26.47 s | | 7.1 MB |
| Voice access | 30.0 s | | 11.7 MB |

- The researcher tile is a mini launch film bookended by a blue gradient title card with the Researcher logo. It starts and ends on that card.
- Mobile story plays a cut-down reel of the film's shots inside a grey laptop frame on yellow. This is the only device frame on the site.
- Bookings is a 3D UI piece with a typing headline ("What is Microsoft Bookings?|").

**How the films are made** **[seen]:**
- They are cropped, zoomed-in screen recordings of the real product, not mock-ups. You can read the real Windows taskbar, real Teams chats and real Copilot UI.
- The cursor is redrawn oversized: a solid indigo arrow about 3% of the frame, tilted. It reads at thumbnail size.
- The "camera" pans and zooms to follow the action, in the manner of tools like Screen Studio.
- Text is typed live.
- Before and after comparisons are stacked inside a single film, each half labelled with a sticker-like verdict pill.

**Frame and setting:**
- No device frame is used in the UX films. Each film sits edge to edge in its square slot.
- The project's own colour world is the wallpaper inside the film: the blue Windows bloom for researcher, pink for notifications, lime for system tray. So the "frame" is a coloured world, not a bezel.
- Typically one hero film plus five or six step films sit in each UX study (seven in researcher).

**Why they feel alive rather than a slideshow:**
1. Each film tells one cause and effect with a real cursor: hover, then card, then state change. The motion carries meaning; nothing animates for decoration.
2. Every film ends on its first frame, so the loop seams are invisible.
3. The stage rewinds the film to 0 every time its step becomes active. The reader always sees the story from its beginning, alongside the matching text.
4. Text and film change together. The 0.5 s crossfade overlaps with the copy lines rising, so the step change reads as one gesture.
5. Small sticker labels inside the film ("Running", "Input needed", "Low info, low trust") replace captions outside it. The page text never repeats what the film says.
6. The camera moves within the film. Zooms and pans follow the cursor, so even a static UI has motion.
7. Playback is in-view only, and there is a pause control, so the motion feels considered, not noisy.

### 1.6 Branding system

**Marks:**
- A round pink-red badge with a small black doodle is the home button (32 px).
- The preloader wordmark "eemon" is set in rounded blue serif.
- The footer's hand-lettered "Eemon's workin'" sits on a clipped sheet in a pink folder.
- Hand-drawn lettering repeats on the Sidequests page header (a marker "Sidequests" with a pencil).

**Type** **[code]:**
- **Averia Serif Libre**, mostly at weight 300, for the voice:
  - hero at 62 px with -1.86 px tracking;
  - section headings at 42 px / 52.5;
  - case prose at 20 px;
  - testimonials at 14 px.
- **Averia Libre** as a display fallback.
- **Plaak 46 Expanded Bold**, a wide caps grotesque from 205TF:
  - case titles at 56 px;
  - section titles at 22.9 px;
  - every label at 12 to 13 px, always uppercase.
- **Mona Sans** for small UI bits, and **Geist Mono** loaded.
- **Pixelify Sans** is loaded but barely used.

**Palette (CSS variables)** **[code]:**
- **Neutrals:** ink `#1f2328`, muted `#59636e`, link `#0969da` and green `#1f883d`. These are GitHub's Primer colours, apt for someone who codes.
- **Accents:**
  - rose `#560e29` and footer links in a lighter rose;
  - highlight yellow `#fee593`;
  - card blush `#fff3f2`;
  - paper `#f6f6f6`;
  - rule `#e5e5e5`.
- **Brand moments:** cursor yellow `#ffd360`, ribbon pink `#ff94cf`, mint `#adfff1`, footer `#fff5fb`.
- Each project then gets its own saturated world: blue bloom, hot pink, lime, a red and green split, and yellow.

**Recurring motifs:**
1. **Text selection and caret:** yellow and blue highlights on words, and boxed words with a blinking caret ("Copilot|", "System Tray|", "What is Microsoft Bookings?|").
2. **Marker doodles:** starburst, loop and sparkles.
3. **Paper objects:** a cardboard box, a folder, a clipped sheet, storyboards.
4. **Soft glowing confetti dots.**
5. **The pink ribbon.**

**Voice:**
- Lowercase and warm on the home page: "Hi i'm Eemon", "lil' Sidequests <3", "website coded with love in".
- Crisp and declarative in the cases: "Restraint is a feature", "(this was a problem)", "The tray was not underperforming. It was underleveraged."

**What makes it feel owned:**
- The marker doodles, lettering and storyboards are clearly his own hand.
- The text-caret motif comes straight from his day job (Copilot input boxes).
- The work is his real recorded product, not mock-ups.
- The motion craft (the box, the springs, the pause control) is hand-coded, not a builder preset.

### 1.7 Case-study structure and how process is shown

**Order:** head band, hero, optional TL;DR, statement, intro, turn, pinned stage of 6 or 7 steps, outcome statement and stat, outro.

**Text and image:**
- In the stage it is about half and half.
- Paragraphs are one to three sentences, 20 px light serif.
- Numbered caps labels ("1. Invisibility", "2. Context switching", "3. Broken flow") break up lists.

**Process is shown as artefacts, not prose:**
- a state table (state and meaning);
- telemetry tables ("I found an insight in telemetry");
- a competitor tray audit ("What the neighbours were doing");
- a screenshot of the actual code branch ("Writing the code");
- state-machine and timing diagrams;
- before and after compare sliders;
- for films, blue-marker storyboard grids and 3D explorations.

### 1.8 Steal for Lana

1. **A pinned product stage for each of the four apps** (PsyClick, Bloom, Algebrawl, Debt Payoff Ledger):
   - A sticky stage of about 660 px with the film or screen on one side and the step text on the other.
   - About 700 px of scroll per step, and five to seven steps per app.
   - Stacked media that crossfade over 0.5 s, and copy lines that rise 12 px, scrubbed by scroll.
   - On phones it collapses to a simple stack. Lana's work shown one piece at a time on its own background is exactly this.
2. **The film recipe:**
   - 8 to 17 s each, cropped and zoomed on the real app, typed input in real time, one cause and effect per film.
   - The first and last frames identical.
   - Rewind to 0 when the step activates and pause when it leaves.
   - Use in-film sticker labels for states, not captions under the film.
   - For Algebrawl, the film can be pixel-art gameplay; for Bloom, the cycle-phase coach changing state.
3. **A per-project colour world inside the film** instead of a device bezel. Each app's film sits on its own wash (PsyClick clinical blue, Bloom blush, Algebrawl arcade night). This fits Lana's "each piece on its own background" and avoids boxes.
4. **A stacked before and after in a single film,** each half with a verdict pill. This is useful for Debt Payoff Ledger iterations or PsyClick screening flow fixes.
5. **The play policy:**
   - Play at 15% visibility and pause off-screen or on a hidden tab.
   - Posters for every film, and `preload="none"` for stage films.
   - A header "pause animations" toggle stored in sessionStorage.
   - Reduced motion pauses everything and says so on the button.
   This meets Lana's reduced-motion rule cleanly.
6. **Hand-drawn hover marks, different for each nav item and link,** appearing within 100 ms behind the label. Lana's version could be a moth sketch, a star burst and a lily outline drawn in a pale ink. This is ornament, not a box.
7. **A scroll-drawn line that threads the whole home page** (one SVG path, `stroke-dashoffset` from scroll). In the night world this could be a silver thread of moonlight or a moth's flight path that leaves the hero and passes behind each section, so Brands, Posters and Films feel connected without borders.
8. **Hero objects that are also jump links,** like Eemon's three cards. Lana already has this with the doors. The detail worth copying is that each card lands you on the exact row, with smooth scroll that becomes instant under reduced motion.
9. **Preloader rationing:** only on the home page, only every third visit, never with reduced motion, capped at 9 s.
10. **Spring-keyframed physical props:** flaps overshoot to 107% at 72% of the timeline, then settle. That is a good model for Lana's envelope opening (Contact) or the seed-packet holder (Brands) when a door is chosen.
11. **Compare sliders built on a native range input,** keyboard accessible with an aria label, for showing a poster or brand before and after.

### 1.9 Avoid

- **The visible 1 px rule grid** around every band, column and tile, and the grey label strip under each tile. It is the boxy, bordered look Lana reads as AI.
- **Small all-caps labels everywhere** (Plaak 12 to 13 px on every tile, every eyebrow, every step title).
- **A centred caps statement opening nearly every case section.**
- **Pill chips** (OS chips, the cursor's pill label).
- **The testimonial grid of gradient cards,** which is the most template-like part of the site.
- **Hiding the native cursor,** even for a small dot. Lana has said no to custom cursors.
- **Weight:** the two biggest home tiles are 16.9 MB and 17.3 MB webm files that start downloading on load. Lana should keep tiles under about 2 to 3 MB, with lower-resolution phone sources (Eemon's code does swap sources on some devices).
- **Text under 16 px** in testimonials and on About (14 px).

---

## 2. Ayush Dhibar (deeper than `docs/v5/research-c.md`)

### 2.1 What it is

The real site is https://ayushdhibardesigns.framer.website/. It is a Framer site (generator `fc3086c`) with Lenis smooth scroll and a Spline 3D hero, for a product design intern from IIT Roorkee. The world is a pastel sky with clay objects. The v5 notes cover the home page; this section covers the works index, the about page, the case pages, the lite mode and the code details.

### 2.2 Flow beyond the home page

**Works page** (`v6\ayush\pages\_works.png`):
1. **Intro:** a purple sky with drifting clouds and "Turning Ambiguity into Clarity" (against, 36.8 px), with "Scroll down to see my projects".
2. **"Stuff I've worked on":**
   - Four clay consoles: Doctor Towels, Swiggy Scenes CRM, Study Portal, Meals.
   - The heading stays put on the left while the consoles pass.
3. **"Wall of Visual Design":**
   - A wooden cork board (704x943) holding twelve event posters.
   - The posters are clipped and taped, each tilted about 1°.
4. **"From the Archives":** two list rows (laptop thumbnail, title, two pill tags).
5. **Footer:** the meadow footer.

**About page** (`v6\ayush\motion\_about.png`, phone `v6\ayush\phone\_about.png`):
1. **Intro:** a paragraph on the lavender sky, with "Let me take you through my personal space. Scroll down to continue."
2. **Fly-through chapters:**
   - **Opening:** a single small polaroid appears at the centre.
   - **Burst:** over the next 370 px of scroll it becomes a ring of four to six polaroids that scale up and spread to the screen edges around a centred paragraph.
   - **Exit:** they pass the camera and fade.
   - **Next chapter:** a new single polaroid seeds at the centre about 600 px after the last.
   - **The chapters:** "me", his university club (SDSLabs), athletics (Inter IIT, the athletics team), and hobbies and art ("School Band", "Hyper-realistic artwork", "Sometimes pastel").
   - White radial speed lines flash at one chapter change.
3. **Close:** "That's all about me :)" holds alone, then the meadow footer.
4. **Phone:** the fly-through works the same way. A giant 400 px Montaga text layer drifts blurred behind it.

**Case pages** (`v6\ayush\pages\_works_swiggy-stride.png`, `_works_study-portal.png`):
1. **Header:** a lavender cloud header with "← Back", the title in against at about 32 px, and a two-line intro.
2. **Hero:** a device hero on a soft gradient card (three phones on peach for Swiggy; a laptop for the admin panel).
3. **Body:**
   - **Left (sticky):** a column at `top: 100px` with client, work and time period, and a black "Documentation" pill.
   - **Right:** Introduction, an org-structure tree, an information-architecture map, then long runs of screens in grey panels.
   - The "Documentation" pill links out to Notion for the full case study.
4. **End:** an "Other Works" list, then the meadow footer.

**Lite mode:** the "Interactive Mode ON" switch links to `/home-lite`. It is the same page without the Spline scene.

### 2.3 Motion

The v5 notes already cover: the hero Spline pointer-follow, the marquee, the polaroid entries, the book spines, the butterflies and the iris page transition.

**New here:**
- **About fly-through:** scroll-linked scale and position. A polaroid grows from about 40 px to about 260 px wide while moving from the centre to the edges, over about 370 px of scroll.
- **Console screens:**
  - The screen is a Framer component named "LED Screen Blank" that cycles variants on a timer.
  - The UI image zooms, pans and swaps in sequence: a dark single screen, then a light screen, then a grid of screens, then a wider shot.
  - The Meals console uses a GIF reel instead (`v6\ayush\follow\_console.png`).
- **Console hover:** the orange knob glows. These are Framer variants "Button hover" and "Button pressed".
- **Hover cards:** the archive list row gets a white rounded card behind it on hover. On case pages a hover card uses `transform 1.2s cubic-bezier(0.23, 1, 0.32, 1)`, `background 0.8s`, `box-shadow 1s` and `backdrop-filter 0.8s` **[code]**.
- **Nav:** Framer's default `all 0.5s ease`.

### 2.4 Interactivity

- **Cork board:** a click opens a lightbox. The page dims and one poster shows large and centred. Escape closes it (`v6\ayush\follow\_cork.png`). Hover shows no visible change.
- **Polaroids** on the about page do not react to hover or click.
- **Lite mode:** the "Interactive Mode" switch swaps to the lite page.
- **Cursor:** the native cursor throughout.

### 2.5 Animated screens

Ayush uses three techniques:
1. **Framer variant cycling** of still PNGs inside the console screens.
2. **GIFs** (`framerusercontent.com/images/*.gif`):
   - the home console GIF at 1920x1026;
   - three GIFs in the Study Portal case at about 1915x1075, showing recorded prototype flows (admin table, then opened document, then a modal; a library list, then a document);
   - the Meals reel (`v6\ayush\motion\_gifs.png`).
3. **Spline** for the hero.

There is no video and no device frame inside the case pages except the hero mock-up. The GIFs are flat recordings without the zoom, cursor emphasis or before and after framing that Eemon's films have, so they read as evidence rather than story.

### 2.6 Branding system (additions)

**Fonts** **[code]:**
- "against" (a high-contrast display serif) for headings;
- Montserrat for body;
- ROTHEFIGHT (condensed) for the hero marquee;
- Caveat for handwritten polaroid captions;
- Montaga for the giant about-page backdrop text;
- Fragment Mono and Inter also loaded.

**What carries the system:** the sky gradient, the clay objects and the handwritten captions hold across the home page, the works index and the about page. The case pages drop most of it and keep only the lavender wash and the footer, so the case pages feel like a different, plainer site.

### 2.7 Case-study structure

- **Order:** a sticky facts column with a Notion link; introduction; diagrams; then screen dumps; then other works.
- **Text and image:** about 15% text. Process appears as the IA map and the org tree. The real narrative lives in Notion or Medium.

### 2.8 Steal for Lana

1. **The about fly-through as a chapter device:**
   - One small item seeds at the centre, then bursts into a ring of its set that flies past the camera.
   - For Lana's Brands section: one pubmat appears small over the night sky and then blooms into a ring of that identity's other pubmats, with the brand name centred. The next brand seeds as the ring leaves.
   - It shows a set at large size without a grid and without boxes.
   - It needs a reduced-motion fallback that lays the ring out flat.
2. **The cork board plus lightbox for Posters:**
   - Lana's equivalent would be posters pinned on a night-garden trellis or a moonlit wall with clips.
   - A click opens one poster big on a dimmed sky, one at a time.
   - Arrow keys step through.
3. **Handwritten captions under photos** (Caveat-style) as the only label. Lana could hand-letter short captions under film stills instead of using caps labels.

### 2.9 Avoid

- **Case pages that drop the world:**
  - The lavender template, grey screen panels and black pills look generic.
  - The real write-up is pushed to Notion.
- **Small pieces of UI furniture:**
  - pill tags in the archive list;
  - the "Open to new opportunities" green dot, which is the "available for work" badge Lana dislikes;
  - the "Made in Framer" badge.
- **Montserrat and Inter body type** with low-contrast white-on-lavender text in places.
- **Phone layout problems:** the journey timeline entries overlap (noted in v5).

---

## 3. Himanshu Shakit

### 3.1 What it is

The real site is https://himanshushakit.com/. It is a single-screen 3D room built with React Three Fiber. The portfolio is the laptop on his desk, and you scroll to open the lid and fly into its screen. It is for a senior product designer in fintech. It has no document scroll at all: the page is 900 px tall, and the wheel drives the scene.

### 3.2 Flow

1. **Loader** (`v6\himanshu\p1\_load.png`):
   - Near-black (`#0e1116`) with "Hey, I'm Himanshu" and "Just a sec, Pulling up a chair…" over a white progress line about 360 px wide.
   - The overlay dims the scene while it loads (about 15 MB: a 10.7 MB `scene.glb`, a 2.3 MB guitar `.glb`, Draco decoder, sky backdrops and textures).
   - Then it fades out.
2. **The room** (`v6\himanshu\home_desktop_001_y0.png`):
   - A window onto a cherry blossom tree and a white clapboard house with a fence.
   - A guitar on the wall and a "The long way" travel poster.
   - A pleated lamp, a camera, a steaming mug, and an acrylic stand showing his experience timeline.
   - A closed laptop with stickers.
   - **Bottom left:** a glass pill segmented control with Morning, Foggy, Rainy, Sunset and Night.
   - **Bottom centre:** "Scroll to open ⌄".
   - **Bottom right:** a round logo button.
3. **Scroll to open** (`v6\himanshu\p1\_wheel.png`):
   - About three wheel notches open the lid.
   - About six more dolly the camera forward until the laptop screen fills the view.
4. **Projects on the screen:**
   - The laptop shows a mini website, one project per screen: a phone mock-up on a dark or green panel at left, and at right a title, a four-line outcome blurb and a black "Read case study" button.
   - The four projects are an NRI wealth home, a Pine Labs POS payments app, a terminal management dashboard and a festive campaign.
   - Each holds for about eight notches, then the screen content scrolls to the next.
5. **The résumé card:** after the fourth project the camera pans left off the laptop to a close-up of the acrylic résumé card on the desk (`v6\himanshu\p2\_endpath.png`).
6. **Back out:** reversing the wheel retraces the whole path and closes the lid.

**Case studies:** "Read case study" opens a Figma prototype deck in a new tab (`figma.com/proto/…/PPTs`). There are no case pages on the site.

### 3.3 Motion

**[code]**
- The camera is eased with `maath`'s exponential `damp`, a critically damped follow with a 0.25 default smoothing time.
- Every wheel step moves a target, and the camera glides to it, so motion never stops abruptly.
- Pointer position orbits the camera a few degrees (`v6\himanshu\p1\_pointer.png`). The mug steams continuously.

**Weather presets** are stored as data. Each sets:
- sun colour and intensity;
- ambient colour and ground bounce;
- fog near and far;
- exposure;
- lamp default and colour;
- a colour grade (night, fog, rain, sunset);
- shadow radius;
- a matching sky-backdrop webp behind the window.

For example: Morning has sun `#ffe8bf` at 3.24, fog `#c4d6ea` 7.5 to 26 m and the lamp off. Night has grade night 1 and the lamp `#ffab52` at 1.35.

**Switching** relights the room in under 0.5 s (`v6\himanshu\p2\_wtrans.png`):
- Rainy plays `rain.webm` (15 s loop, 768x432) as a texture over a grey sky.
- Night brings a full moon, lit windows in the house next door, and the desk lamp on with a warm pool of light (`v6\himanshu\p2\_weather.png`).

**Lamp:** clicking it toggles its light instantly (`v6\himanshu\p2\_clickseq.png`, last row).

### 3.4 Interactivity

- **Input:** the wheel and PageDown drive the journey. The pointer orbits the view.
- **Clickable things:**
  - the weather buttons;
  - the lamp, which toggles;
  - "Read case study", which opens Figma in a new tab;
  - the logo button (the only element with a pointer cursor).
- **Objects that do nothing:** the guitar, camera, mug, poster, tree and résumé card. The cursor never changes over 3D objects, so nothing tells you the lamp can be clicked.
- **Phone:** portrait phones are blocked by a "Rotate to view / Best experienced on a laptop/desktop" gate (`v6\himanshu\phone\home_phone_001_y0.png`).
- **Screen readers:** the real content (name, experience list, case links, email) is in a visually hidden HTML block for crawlers and assistive technology.

### 3.5 Animated screens

There are no recorded screens. The laptop screen is a texture: a 3D plane named `WEBSITE` at 55° field of view, painted with project images (blob webp textures). Its "scroll" is the texture panning. What makes it feel alive is the camera, not the UI.

### 3.6 Branding system

- **Type:** Alan Sans 600 at 10 to 12 px for the few UI pills, in white at 60% on dark glass (`rgba(255,255,255,0.1–0.2)`).
- **Palette:** the lighting presets are the palette. Warm wood, cream brick, blossom pink, sky blue, and at night amber lamplight and moon blue.
- **What makes it his:**
  - The personal objects (his guitar, his camera, the travel poster, the cherry tree).
  - The copy "Pulling up a chair…".
  - The idea that his portfolio is literally on his desk.
- **What weakens it:** there is no logo work, no type system and no voice beyond that one line.

### 3.7 Case-study structure

There are none on the site. Each project is a single screen (image, title, four-line result blurb, button), and the depth lives in Figma prototype decks.

### 3.8 Steal for Lana

1. **Time-of-night presets as data that relight the whole hero:**
   - Lana's sleeping-moon world could offer moon phases or hours (dusk, midnight, the small hours, first light).
   - Each would retint the sky, the moon's face, the glow on the six door objects, and whether the lamps or lilies are lit.
   - It would be a small segmented control placed as ornament, not a pill bar.
   - It needs one data object per preset and a 0.4 s crossfade.
2. **One lightable object:**
   - A lamp or lantern near the doors that you can click to switch on, casting a warm pool on the objects.
   - Give it a real affordance (a pull chain, a pointer cursor, a focus ring), which Himanshu lacks.
3. **"Scroll to open" a door object:**
   - Each of Lana's doors could physically open as you enter its section: the envelope flap lifts for Contact, the projector shutter opens for Films.
   - For Products the phone could do what Himanshu's laptop does: the camera dollies into the phone screen, and the screen becomes the first frame of the product stage (section 1.8, idea 1).
   - Use damped easing (an exponential follow) rather than a fixed-duration tween, so scrolling feels weighty.
4. **Hidden semantic HTML behind a visual scene,** so the content is still crawlable and readable by screen readers. Lana should keep it as visible HTML below the hero.

### 3.9 Avoid

- **Blocking portrait phones.**
- **About 15 MB of 3D** before anything can be read.
- **Case studies that are external Figma decks.**
- **Clickable objects with no hover or cursor affordance.**
- **Tiny 10 to 12 px UI text at 60% white.**
- **A one-screen site with no document scroll:** browser find, scroll position and the back button all lose meaning.

---

## 4. Cross-site synthesis

**The richness comes from a world that continues into the work, not from the hero alone:**
- **Eemon** carries his world in three ways:
  - the ribbon that keeps drawing;
  - a colour world per project that lives inside each film;
  - doodles on every link.
- **Ayush** carries his sky and clay objects through the home, works and about pages, but loses them on the case pages, which then feel generic.
- **Himanshu** never leaves the room: the work is shown inside an object in the world. Its depth goes off-site.

Lana's hero already has the world. The next step is to make each section an object or a scene in that world, not a list below it.

**The best "animated screens" are short cause-and-effect films of the real product, in sync with text.** Eemon's are:
- 8 to 17 s;
- seamless loops;
- with an oversized cursor, live typing, camera zooms and in-film state labels;
- rewound on each step and paused off-screen.

Ayush's GIFs and Himanshu's textured screen show the work but do not explain it. For Lana's four apps, record real sessions, crop and zoom them, add a slightly larger pointer and one or two sticker labels, and pin them in a stage with the text.

**Lana's existing interaction carries over well:**
- one piece at a time;
- each piece on its own background;
- hover that changes a small part, not a whole card.

In all three sites the strongest moments are a single object reacting:
- the box flaps, the console knob and the lamp;
- one ring of polaroids;
- one film per step.

All three avoid card grids for their best work. Their weakest parts are the template-like ones: ruled grids, gradient testimonial cards, pill tags and lavender case templates.

**Motion should be rationed and switchable.** Eemon's site is the model here:
- the preloader only every third visit;
- videos only in view;
- a pause toggle;
- every looping animation and transition removed under reduced motion.

Himanshu's weather presets show that a world can change mood on request rather than move all the time, which suits a sleeping moon.
