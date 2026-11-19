# Research: Lana's seven reference portfolios

Studied 2026-11-16 in a real browser (Playwright, Chrome, headless) at 1440×900 and 390×844, following `rubric.md`. Every site was loaded, reloaded and filmed on load (12 frames about 150 ms apart plus late frames at 2.5–10 s), scrolled with the mouse wheel in one-viewport steps (1.5 s wait), scrolled in ten 30 px wheel steps at three depths, hovered on its main controls (frames at 0, ~100, ~400 and ~1300 ms), and left idle (two frames 1.5 s apart after 3 s still). One project page per site was opened and filmed top to bottom. All screenshots were looked at before scoring.

Evidence lives in the scratchpad, one folder per site: `C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v3\picks\<site>\` (`s1440-XX.png` stills, `s390-XX.png` phone, `load-XX.jpg`, `scroll-P-XX.jpg`, `hover-N-X.jpg`, `idle-a/b.png`, `case-XX.png`, `sheet-*.jpg` contact sheets, `info.json` with DOM measurements).

How the motion numbers were made: "idle" is the percentage of pixels that changed between two frames 1.5 s apart with nobody touching the page. "Scroll tiles" compares each 30 px wheel step: every textured 240×80 px tile is matched against the previous frame and classed as moving with the page, staying fixed, moving at another speed (parallax; the factor is given as a multiple of page speed), or changed (scrubbed, revealed, or moving sideways).

Busyness numbers come from `metrics.py` on the 1440 stills (duplicates at the bottom of the page removed). Calm and busy are percentages of 48 px tiles.

---

## 1. Adya Srivastava — adyasrivastava.framer.website

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 58% (34–79) |
| Busy (median, range) | 11% (0–19) |
| Hues / saturation / lightness (median) | 4 / 71 / 19 (dark and saturated) |
| Page length | 10.2 screens (9,144 px); Lenis smooth scroll, a 900 px wheel moves 1,080 px |
| Fonts | 4 families: Instrument Serif (display, often italic), DM Sans (body), DM Mono (nav and labels), Inter; plus a hand-made chrome lettering image for the title |
| Things competing on the first screen | 4: the chrome "Adya's Cosmos" lockup with a painted girl, the painted planets, the nav bar, the Framer badge |
| Work visible on the first screen | 0 |
| From the first screen to a real piece of work | 5 wheel screens (first card at ~5,400 px), or 1 click on "The universe" in the nav |
| Idle motion | 17% of the screen, all inside the title lockup (x 124–1334, y 128–502): the chrome letters shimmer and flicker forever |
| Phone | 2.4 screens of painting and a line "To see my universe more closely, meet me on a larger screen." No work on phone. |

**First screen.** A full-bleed painted night sky (indigo #1b1f5c to violet) with five glossy planets and about ten shooting stars. Centred at 15–50% height is a lettering image "ADYA'S" about 1,150 px wide in iridescent chrome script with swashes, a painted girl in an orange dress floating through the "D", and "COSMOS" in spaced chrome capitals under it. The nav is a 64 px bar across the top: a monogram at the left, "ADYA SRIVASTAVA" in 14 px DM Mono capitals, then four 224 px cells with hairline dividers: "THE UNIVERSE", "ABOUT ME", "THE LIFE BEYOND", "CONTROL ROOM". The cursor leaves a long white comet trail.

**Motion on load.** Black for about 2.5 s. The painting appears, the girl first, then the chrome title glitches in over roughly 1 s (frames 3–5) and keeps shimmering. Screenshots took 1–6 s each on this page because of ten canvases, so the page is heavy.

**Motion on scroll.** At the top the title fades and lifts away within the first 150 px. The painting then reads as a camera descending: planets move at 0.4×–0.8× page speed, the near planet rim at 1.5×–1.9×, and three captions in 50 px Instrument Serif fade in one at a time at different depths: "Leaving the surface…", "Gathering the fragments…", "You've arrived." The girl walks down a painted staircase through pastel clouds; the third stop is a giant painted hand holding lilies with a purple "ENTER UNIVERSE" pill button. A torn-paper edge then drops into a black starfield. In the works section the cards scroll at page speed while the 90 px "Featured Works" title and two big sparkle stars move behind them at about 0.6×.

**Motion on hover and click.** Logo: a small bio card fades in under it (~300 ms). Nav item: text turns violet. Project card: a 2 px violet border with a ~20 px outer glow appears and the corner arrow turns violet, complete by 400 ms.

**A project page** (`/love`, "Yours Truly, Love"). 3.7 screens, 130 words, 4 images and an embedded flip-book viewer. First screen: left 40% holds the book's own lettered title, a 25 px italic serif subtitle, a 3-line blurb, and a three-row spec table (Course, Year, Category) with hairline rules; the right 60% is the painted cover art bleeding off the edge into orange clouds. Second screen: "View the full project here" in 93 px serif, a "View PDF" pill, and a tilted book mock-up. Third: the flip-book. Then the shared contact footer.

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 3 | Name only in 14 px nav; the first screen says "cosmos", not "graphic designer"; no call to action until the "Enter universe" button 3 screens down. |
| A2 | 2 | First project card at about 5 wheel screens; nav "The universe" is the only shortcut. |
| A3 | 4 | Fixed 64 px nav with four named cells on every screen, plus a round back-to-top button. |
| A4 | 3 | Body 14–16 px DM Sans on black is fine; captions sit on busy paintings; nav is 14 px mono capitals. |
| A5 | 4 | Each screen is one painting or one card with a title; calm median 58%, busy 11%. |
| A6 | 4 | All project cards share mono tag chips, an italic 44 px title, an arrow and the same glow on hover. |
| A7 | 2 | Phone shows only the painting and "meet me on a larger screen"; no work. |
| A8 | 2 | No work on phone and no low-motion path; ten canvases. |
| B1 | 5 | "Adya's cosmos": a journey from space down to her universe; projects are labelled "Planet C", "Comet A", "Constellation A". |
| B2 | 4 | One lockup, one painting, one card per screen. |
| B3 | 4 | Indigo, violet and black with orange accents; 4 hues. |
| B4 | 4 | Chrome lettering, Instrument Serif italic and DM Mono labels make a clear scale; 4 families. |
| B5 | 5 | All paintings are by the same hand in the same pastel-cosmic palette. |
| B6 | 5 | Dense paintings, then a black starfield with one card at a time; calm runs 34% to 79%. |
| B7 | 4 | Precise torn-paper edge and card glow; the Framer badge sits on every screen. |
| C1 | 4 | Scroll drives the descent and the captions; the title shimmer has no cause. |
| C2 | 3 | Mostly still between scrolls, but the title flickers forever (17% of the screen) and the cursor trails a comet. |
| C3 | 4 | Hover glow about 300 ms, eased; smooth scroll without lag. |
| C4 | 5 | The clearest sense of travel of the seven: space, clouds, staircase, a hand, "You've arrived.", then the works. |
| C5 | 4 | Nav, cards and logo all respond within 400 ms. |
| C6 | 4 | 2.5 s of black, then the painting and a 1 s title reveal, once. |
| C7 | 3 | Everything settles except the title shimmer. |

**What makes it work**
1. The page is one long painting that the scroll descends through. Three short captions (50 px serif, centred, white) mark the stages, so the reader knows they are travelling.
2. Several painted layers move at different speeds (0.4×, 0.8×, 1.9×), which gives depth without any 3D.
3. A hard change of ground marks arrival: a torn-paper edge drops from the pastel painting into a black starfield where the works start.
4. Works are a zig-zag of single cards (about 520 px wide) on black, each with mono category chips, a 44 px italic serif title, and a violet glow on hover. A sparkle star sits beside each.
5. The nav names are part of the world ("The universe", "The life beyond", "Control room").

**What it avoids**: no grid of thumbnails, no paragraph on the first screen, no stats, no skills list; one project per screen.

---

## 2. Sudarvel K — sudarveldesignportfolio.framer.website

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 41% (6–56) |
| Busy (median, range) | 27% (16–52) |
| Hues / saturation / lightness | 6 / 38 / 60 |
| Page length | 3.7 screens (3,331 px), native scroll |
| Fonts | 7 families: Geist, Geist Mono, Inter, Cormorant Garamond, DM Serif Display, VT323, Caveat; plus a 3D chrome "Build." image |
| Things competing on the first screen | 8: headline, CRT monitor with portrait, two floating objects, drawer stack, "currently:" ticker chip, corner labels, nav pill |
| Work visible on the first screen | 2 card tops peek in at the bottom |
| To real work | 1 scroll |
| Idle motion | 2.4% of the screen: the two floating objects left and right swap every ~0.7 s (paper sheet, Walkman, Game Boy, iPod, phone), and the ticker types |
| Phone | Designed: hero kept, nav pill gets a menu button, cards stack to one column. |

**First screen.** A blue-sky photograph with clouds as the ground. A frosted nav pill (about 390 px) floats at top centre: "K Sudarvel / Product Designer" left, "velsudar76@gmail.com · Resume · LinkedIn" right. Corner labels in 11 px mono: "+ NO. 001 — PORTFOLIO ISSUE" and "CHENNAI, IN — PRODUCT DESIGNER +". Centre: a green mono chip "currently: prototyping in Figma", then "Design." (88 px DM Serif Display, white), a chrome-and-wood 3D "Build." and "Tell Stories." (100 px Cormorant Garamond italic). One line of intro with lime highlighter chips on "every problem" and "design". Below, a beige retro CRT whose screen shows his black-and-white photo, with a stack of labelled drawers ("Research, Design, Iterate, Impact", "Pull a drawer to open it"). Floating paper sheets carry green labels "Concept 85%" and "Feedback 77%".

**Motion on load.** White until the page arrives, then the hero in one cut; the floating objects then begin cycling.

**Motion on scroll.** The sky photo stays fixed while the hero and cards scroll over it (89 fixed tiles at the top). The work grid scrolls plainly. The "making of experiences" bookshelf near the end has layers at 0.6×–0.87×.

**Motion on hover and click.** Project card: the title line is replaced by "See What I Built" and the card darkens slightly (by 400 ms). The cursor is a small robot figurine. The bookshelf is a 3D cover-flow of seven book covers; a click on a side book rotates the shelf one step in about 400 ms.

**A project page** (`/oncosmart`). Very long: about 40 screens (36,227 px), 4,967 words, 51 images. Cream paper ground and a magenta accent, set like a magazine: a numbered contents table in mono (00 Context, 01 …), a title in 32 px, chapter heads at 28–30 px, 12–13 px mono body, 3D-rendered character scenes ("A Tuesday evening in Chennai"), a pixel-screen prototype with Back/Next, and decision cards ("Decision 02: Pain closes every session", with "Why I rejected / Alternatives considered / Trade-off").

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 5 | Name and role in the nav pill, a three-word promise, a one-line intro, and work peeking in at the bottom. |
| A2 | 5 | Four project cards begin at y ≈ 830 px. |
| A3 | 3 | Nav pill stays, but it holds only email, résumé and LinkedIn; no section links. |
| A4 | 4 | Card titles 16 px dark on white; hero intro is 14–15 px on sky with highlighter chips. |
| A5 | 2 | 8 things compete in the hero; the card grid is 52% busy. |
| A6 | 4 | Four identical cards: year chip, outcome title, tag chips. |
| A7 | 4 | Phone keeps the hero and stacks the cards cleanly. |
| A8 | 3 | Content is plain HTML, but the hero objects never stop moving. |
| B1 | 4 | A retro collage "portfolio issue No. 001", carried into the magazine-style case study. |
| B2 | 3 | Hero has no single first thing: headline, CRT and floating objects are similar in weight. |
| B3 | 3 | Sky blue ground, but red, orange and cream thumbnails; up to 8 hues. |
| B4 | 2 | Seven families plus a 3D word in one headline. |
| B5 | 4 | Halftone retro collage thumbnails are consistent with each other. |
| B6 | 3 | Hero, grid and shelf are all full; no quiet screen. |
| B7 | 4 | Clean cards and pill; the shelf is precise. |
| C1 | 3 | Card hover has a reason; the cycling gadgets do not. |
| C2 | 2 | Two objects swap every ~0.7 s, the ticker types, the robot cursor follows. |
| C3 | 4 | Hover and shelf rotation about 400 ms, eased. |
| C4 | 3 | Fixed sky gives some depth; otherwise a plain 3.7-screen scroll. |
| C5 | 4 | Card text swap and robot cursor. |
| C6 | 3 | A single cut; nothing composed. |
| C7 | 2 | The hero never settles. |

**What makes it work**
1. Work is above the fold: the first row of cards starts at 92% of the first screen.
2. Each card title is an outcome sentence ("Designing a guided recovery app to support 3 key cancer-care outcomes") over a poster-like thumbnail made for that project.
3. A fixed sky photograph behind everything makes the page feel like one place.
4. The case study is set as an editorial magazine with a contents table and decision cards.

**What it avoids**: no long about section, no skills list on the home page; the home page is short (3.7 screens).

---

## 3. Chi Quach — chiquach.com

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 76% (46–80) |
| Busy (median, range) | 8% (6–25) |
| Hues / saturation / lightness | 4 / 7 / 94 (white page) |
| Page length | 4.7 screens of vertical wheel travel (4,268 px), which moves a horizontal strip sideways |
| Fonts | 4: ABC Arizona Flare Light (display), Neutral Sans (labels), Apfel Grotezk, SF Pro Display (one line) |
| Things competing on the first screen | 3: the name, the x-ray bag, the two-column link list |
| Work visible on the first screen | about 10: every object inside the bag is a project |
| To real work | 0 (hover an object); 1 click to a project page |
| Idle motion | 0% |
| Phone | Vertical stack of the same x-ray objects with generous space; the labels (hover only) disappear. |

**First screen.** White. "CHI / QUÁCH" in 160 px ABC Arizona Flare Light, letter-spacing −8 px, line height 128 px, black, top-left at x 8, y 58. Below it at y ≈ 300, two columns of 12 px uppercase labels: roles (Emerging hardware, Design system, Growth, Community) and links with ↗ (Meta 2026, MongoDB 2025, Playbook 2022, Design meetup, Creative work, Toolings), plus a hand-drawn question-mark icon. The rest of the screen (about x 260 to 1410, the full height) is one x-ray photograph of a transparent cyan bag; inside, in magenta, violet and cyan x-ray: a phone, glasses, a mug, a portrait polaroid, earphones, a lip gloss, a figurine, a business card.

**Motion on load.** At 0.8 s the name and one pair of glasses; the bag and its contents pop in one by one by 1.9 s; the name then scrambles through random letters ("CLO QQHQU", "CHE QUOÁU") and resolves by about 2.5 s. Then nothing moves.

**Motion on scroll.** The vertical wheel moves a horizontal track at 1:1: the bag slides left off screen and a row of x-ray objects (Meta glasses, Config tickets, a Peercam, insoles, a lamp, a pink card) passes from right to left, each about 200–400 px wide with 200–400 px of white between them. It ends on a small centred contact block.

**Motion on hover and click.** Hovering an object in the bag: the object swaps from x-ray to its real photograph, a hairline cyan box with a faint grid draws around it, and a black label tag appears at its bottom-left ("2025–2026 / META, REALITY LABS / HARDWARE"). At the same moment the 160 px headline scrambles from "CHI QUÁCH" to "WHAT'S IN MY BAG" in about 600 ms, and scrambles back when the pointer leaves. The same hover works on the strip.

**A project page** (`/lamp`, "Rock Paper Scissor Lamp"). 5.6 screens of wheel travel, 66 words, 5 photographs. Again a horizontal strip: a left column with a 64 px serif title, a "TOOL" list (Arduino, C++, ChatGPT, VSCode) and a 50-word story in 12 px; then five full-height product photographs on a warm beige backdrop sliding past; a "×" at top-left closes it.

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 4 | Name at 160 px, roles and employers listed; the "what she does" is in 12 px labels, so it takes a moment. |
| A2 | 5 | The bag contents are the work; hover shows each one, a click opens it. |
| A3 | 3 | No persistent nav and no progress indicator on the sideways strip; project pages have only "×". |
| A4 | 2 | All small text is 12 px, much of it uppercase. |
| A5 | 5 | One object or one bag per screen; calm median 76%, busy 8%. |
| A6 | 5 | Every object behaves the same: x-ray, then real photo with frame and black tag on hover. |
| A7 | 3 | Phone keeps the objects and space but loses the labels, so the work is unnamed. |
| A8 | 3 | Little motion, but names only appear on hover. |
| B1 | 5 | "What's in my bag": an airport x-ray of her bag, every item a project. |
| B2 | 5 | Name first, bag second, labels third. |
| B3 | 5 | White ground; cyan, magenta and violet only inside the x-rays; saturation 7. |
| B4 | 4 | A light serif at 160 px against tiny grotesk labels; 4 families. |
| B5 | 5 | Every object shot and treated the same way. |
| B6 | 5 | A full bag, then a sparse strip with as much white as object. |
| B7 | 5 | Hairline frames, precise tags, exact alignment. |
| C1 | 5 | Everything moves because you scrolled or pointed, and the headline change tells you what you are looking at. |
| C2 | 5 | One thing at a time; 0% idle. |
| C3 | 5 | Scramble ~600 ms, pop-ins staggered over 1.2 s. |
| C4 | 4 | The wheel carries you sideways along a row of objects at 1:1; it never fights, though sideways travel may surprise. |
| C5 | 4 | Clear hover state on every object; links show only underline arrows. |
| C6 | 5 | Bag packs itself, name scrambles in, done by 2.5 s. |
| C7 | 5 | Completely still at rest. |

**What makes it work**
1. One idea makes the navigation: the projects are physical things in her bag, each shown as an x-ray (identical treatment) and revealed as the real thing on hover.
2. Hover changes two things at once, the object and the headline ("WHAT'S IN MY BAG"), so the page explains itself.
3. Scrolling is a sideways walk past objects laid out on white with large gaps; one object is in focus at a time.
4. Big quiet display serif (160 px, light weight) against very small labels gives a strong, simple hierarchy.
5. Project pages repeat the same strip: a short story column, then big photographs.

**What it avoids**: no cards, no borders, no background colour, no paragraphs on the home page, no nav bar, no section headings, no ambient motion.

---

## 4. Vibhor Mathur — onlyvibhor.com

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 44% (16–47); landing 42–47%, inside the tour 16–18% |
| Busy (median, range) | 19% (16–39); tour frames 37–39% |
| Hues / saturation / lightness | 4 / 19 / 64 |
| Page length | 1 screen; the page does not scroll. A 900 px wheel step did not move the camera in my runs. |
| Fonts | Inter and Inter Tight in use (DM Mono, Bricolage Grotesque and Instrument Serif are loaded but barely used) |
| Things competing on the first screen | 5: menu panel, 95 px headline, stat tiles, key legend, the island with dozens of buildings |
| Work visible on the first screen | none legible; billboards on the island are too small to read |
| To real work | 1 click ("Guided tour"), a camera flight of about 3 s, and stop 1 of 10 says "No projects here"; projects start at later stops |
| Loader | 19 s on the first headless visit; 107–157 s on three later headless runs (software WebGL); not measured on a real GPU |
| Idle motion | 15% of the screen; the camera orbits the island continuously |
| Phone | Its own layout: island image, the headline, "Explore the 3D island" (green) and "Browse my work" (white) buttons, About and Work-with-me links. |

**First screen.** A low-poly 3D island fills the window: green lawn, radial white paths from a central tree, about ten round plazas each with a small building, billboards and flags, sea and pale mountains behind. Over it on the left, a 340 px dark rounded panel (#22262a): his photo, "Vibhor Mathur / Creative director & design leader", a bright green button "Enter the island / Walk it at your own pace", then four dark rows with icons ("Guided tour / Every place, one after another", "Run a campaign", "About Vibhor", "Work with me"), three stat tiles at the bottom (11 years, 10+ product lines, 4 in-house AI tools) and a key legend (WASD walk, E interact, J journal, C camera). Bottom-left of the island area: a 14 px line "Communication Design Senior Manager, Razorpay", the headline "A portfolio / you can walk through." in 95 px Inter Tight semibold with −3.8 px tracking, and a two-line intro.

**Motion on load.** A dark screen with "Vibhor Mathur / A portfolio you can walk through" and a thin green progress line; then a cut to the island, which slowly orbits.

**Guided tour (click).** The left panel collapses to a 72 px icon rail (About, Explore, End tour in orange, Map, Journal, Classic, a clock, Sound, Keys, Hire me in green). The camera flies down from the overview to the central tree in about 3 s. Floating label pills name nearby places ("Creative Direction & Culture / The Jamun Tree", "AI Lab / Tools, films & automation", "Vibhor's Home / Jaipur Pink House"). A 340 px dark panel on the right shows the stop: "Island pass / The Jamun Tree", a 30 px title, a 40-word lede, three small fact tiles, "What I do" with five bullets, tag chips, the stat tiles, and "Stop 1 of 10". At the bottom centre: ← and → buttons around an orange progress bar, and "Explore from here". Sound is part of the design ("Music is composed live as you walk: a tanpura raga by day…").

**A project page.** None found as a separate page; work is shown in the stop panels inside the island. I did not reach a project stop (see "Could not check").

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 4 | Name, role, a clear headline and five labelled options; spoiled by the loader wait. |
| A2 | 2 | Loader (19–157 s headless), a click, a 3 s flight, and stop 1 has no projects. |
| A3 | 4 | Icon rail, map, "Stop 1 of 10", floating place labels. |
| A4 | 3 | Panels are 14 px white on charcoal, good; the 11 px key legend and small stat text are not. |
| A5 | 3 | The panel and headline are clear, but the island is full of small objects; tour frames 37–39% busy. |
| A6 | 4 | Every panel, rail and button uses the same dark rounded style with a green or orange accent. |
| A7 | 4 | Phone has its own layout with a "Browse my work" path. |
| A8 | 4 | "Browse my work" and a "Classic" mode exist; the desktop landing still waits for WebGL. |
| B1 | 5 | His career as an island; each place is a part of the job. |
| B2 | 3 | The headline is first, but the island competes everywhere. |
| B3 | 3 | Green, sea blue and many building colours, plus green and orange UI accents. |
| B4 | 3 | One family (Inter / Inter Tight), clear scale, no character. |
| B5 | 4 | A consistent low-poly world with real detail. |
| B6 | 2 | The same density everywhere; no quiet screen. |
| B7 | 4 | Panels and rail are precise. |
| C1 | 4 | Camera flights are caused by clicks; the idle orbit is not. |
| C2 | 2 | The whole screen moves while idle (15%). |
| C3 | 4 | Camera flights are eased, about 3 s. |
| C4 | 2 | There is no scroll; travel happens by buttons and keys. |
| C5 | 4 | Menu rows highlight on hover. |
| C6 | 2 | A long loader, then a cut. |
| C7 | 2 | The orbit never stops on the landing. |

**What makes it work**
1. A literal world: one 3D island, places named after parts of his work, floating labels.
2. Three ways in, from easy to free: "Guided tour" (next/previous with a progress bar), "Enter the island" (walk with keys), "Browse my work" (plain, on phone).
3. A fixed UI frame over the world: a dark side panel for what you are looking at, a rail for where you can go, and a bottom bar for the tour.

**What it avoids**: no scrolling page at all; no cards or grids on the landing.

---

## 5. Manisha Koranga — manisha.design

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 51% (1–68) |
| Busy (median, range) | 27% (11–66) |
| Hues / saturation / lightness | 5 / 21 / 79 |
| Page length | 9.1 screens (8,212 px), native scroll |
| Fonts | 2: Archivo (everything, headings at 119–144 px), Homemade Apple (handwriting) |
| Things competing on the first screen | 8: painted meadow, name, chip, headline, nav pill, iced coffee, photo card, music-player card, dog in sunglasses, flower |
| Work visible on the first screen | 0 |
| To real work | 2 wheel screens, or 1 click on "Work" |
| Idle motion | 0.02% |
| Phone | Not responsive: the 390 px view is the desktop page scaled down to about 27% (phone page height 2,224 px = 8,212 × 390/1440); text is about 4–5 px. |

**First screen.** A painted golden-hour meadow with cows fills the screen. A white frosted nav pill (about 760 px) at the top: "mk" script logo left, "Work · About · Contact" and a lilac "Let's chat →" button right. Centred at about 45% height: "manisha koranga" in 42 px Homemade Apple with a small lilac "Product Designer" chip, then "AI-assisted. Human-obsessed." in 65 px Archivo, light lilac. Along the bottom, a collage of cut-out photo objects: an iced coffee, a lily, a landscape photo card, an orange "Now playing" music card with AirPods, a dog in sunglasses and headscarf.

**Projects section ("projects / things i've designed").** The section is a fake macOS desktop on a painted flower-meadow wallpaper. A browser window about 824 px wide (x 308–1132) shows a recording of the real product playing (Flebo lab-booking flow) with a pink click dot. Under it a caption bar: "Re-design Flebo" 26 px left; "UX Designer · Figma, Claude · 2026" right. Below, a dock holds Finder, one app icon per project (Flebo, Menteiz, Kargo360) and the Trash. Desktop widgets add character: a calendar widget "Apple Keynote 10:00–11:30", a "survival.jpg" thumbnail, a "drafts" folder, a cartoon dog in a beret.

**Motion.** No entrance animation; no parallax (579 of 583 textured tiles move with the page at all three depths). Over the window the cursor becomes a 56 px lilac circle with "view" in script. Clicking a dock icon swaps the window to that project in under 100 ms.

**Rest of the page.** "A little about me" (100+ px Archivo) with a portrait and two short paragraphs on graph paper; "side quests / monthly recap" with scattered photos and folders; a "life in a cart" collage (shopping trolley, Diet Coke, boxing gloves); "a sneak peek at my procreate" with stickers and drawings; "let's talk" on pink; a closing photo of a dog, cat and duck in sunglasses on a grassy hill.

**A project page** (`/flebo.html`). About 19 screens (16,929 px), 1,612 words, 13 images, 1 video. Graph-paper ground. Tabs as chips (Flebo, UX, Conversion optimisation, AI summary, Booking flow); a 97 px Archivo headline "Designing trust into diagnostics from booking to understanding your results."; three coloured metrics "58→63%", "-fatigue", "72→91%"; a meta row (role, timeline, tools, platform); a laptop mock-up on a blue textured ground; section heads at 46 px with a yellow highlighter; key insights as pull quotes with a red left rule; annotated screens with handwritten white notes on blue.

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 4 | Name, role chip, a sharp line and a "Let's chat" button. |
| A2 | 4 | Projects at 2 screens; nav "Work" jumps there. |
| A3 | 3 | Nav pill only at the top; it is not visible once you scroll. |
| A4 | 3 | Body text is fine on graph paper; the hero line sits on a busy painting; script is hard to read. |
| A5 | 2 | Hero is 66% busy and 1% calm; the projects screen 56% busy. |
| A6 | 3 | Each section uses a different idiom (desktop, folders, cart, stickers). |
| A7 | 1 | No phone layout; the desktop page is shrunk to about 27%. |
| A8 | 4 | Plain scroll, nothing hidden behind motion; project switching needs the dock. |
| B1 | 3 | A scrapbook of her life plus a Mac desktop; no single idea. |
| B2 | 3 | Big headings lead, but collages compete. |
| B3 | 2 | Photographic collage colours everywhere, up to 7 hues. |
| B4 | 4 | Two families; the 119–144 px Archivo headings have presence. |
| B5 | 3 | Painted meadow, real photos, cut-outs, 3D cart and drawings do not share one world. |
| B6 | 3 | Alternates busy photo screens with white graph-paper screens (calm 1% to 68%). |
| B7 | 3 | Collages are loose by design; some edges look unresolved. |
| C1 | 4 | The only motion is the product recordings and the cursor, both meaningful. |
| C2 | 4 | Nearly nothing moves (idle 0.02%). |
| C3 | 4 | The dock switch is instant. |
| C4 | 2 | Plain scroll; no sense of travel. |
| C5 | 3 | "view" cursor and dock; the nav barely reacts. |
| C6 | 1 | No entrance. |
| C7 | 5 | Fully at rest. |

**What makes it work**
1. Work shown as working software: a browser window on a fake desktop plays a recording of the product, and a dock switches projects.
2. Huge 119–144 px sentence-case headings in one grotesk, paired with one handwriting face.
3. Personality sections (cart, Procreate, monthly recap) after the work, not before it.

**What it avoids**: no motion effects, no scroll tricks, no loader.

---

## 6. Frances Zhao — franceszhao.ca

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 60% (21–84); 84% just after load, 55% after 30 s, 21% after a minute of flowers |
| Busy (median, range) | 9% (6–13) |
| Hues / saturation / lightness | 4 / 9 / 95 |
| Page length | 1 screen (900 px); Lenis is present but there is nothing to scroll |
| Fonts | 1: General Sans (Hedvig Letters Serif appears in the project pages) |
| Things competing on the first screen | 2: the text column and the flower field |
| Work visible on the first screen | 4 project names |
| To real work | 0 scrolls; hover a name for a preview, 1 click for the project |
| Idle motion | 2% at 20 s after load, but the flowers keep growing for over a minute |
| Phone | Designed: a single column with name, bio, then each project as a thumbnail with a one-line question ("What if hacker applications was part of the experience?"), flowers at the edges. |

**First screen.** White. A left column 270 px wide at x 30: a line-drawn flower logo, "Frances Zhao" in 22 px General Sans medium, three short paragraphs in 12 px (what she does, where she is, "Open to Winter and Fall 2027 internships!"), then three accordions with + and ×: "Works" (open, listing four projects), "Extras", "Contact". Bottom-left: a reset icon, three coloured dots and "(CLICK THE SPACE TO GROW)" in 12 px capitals. Bottom-right: "Toronto." and a live clock. The rest of the screen is empty white that fills with flowers.

**The flowers.** Each flower is a soft, generative dot-matrix bloom (a halftone ring of petals 150–250 px across, with scattered confetti dots) in pink, cyan, lime and yellow. They start growing from the bottom-right corner about 3 s after load and keep appearing, so after 30 s they cover about half of the right side and after a minute almost all of it. A click on empty space grows a new bloom at the pointer; it unfurls from nothing to full size in about 1.5 s. The reset icon clears them.

**Motion on load.** The text column fades in at about 1.4 s, the lower accordion rows a beat later; then the first bloom.

**Motion on hover.** Hovering a project name: the name gains an em-dash, indents and turns medium weight, and a preview card (832 × 468 px, 16:9, 16 px radius) appears in the middle of the right area (x 465–1297, y 216–684). At 100 ms the card is a white placeholder, by 400 ms the project video plays in it (for example the "Select a beat." music toy). It disappears when the pointer leaves.

**A project page** (`/works/hack-the-north-2026`). About 6 screens (5,345 px), 1,094 words, 15 images, 6 videos. A rounded full-width banner video (record player in a green garden scene) with a one-line 17 px serif title on it. Below, two columns: a sticky contents list on the left in 12 px (Back, Overview, TL;DR, The Problem, Product 01, Product 02, …, Key Takeaways, Check it out) and an 800 px content column: a meta row (Role, Timeline, Team, Software), a question as the lede ("How do you translate an evolving creative direction into a cohesive digital experience?"), 12 px body, bulleted contributions, project screens and videos, a green call-out with live links, and "Back to top".

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 4 | Name, what she does, where, and that she is hiring-ready, all on screen; only 12 px. |
| A2 | 5 | Four project names on the first screen; hover previews, one click opens. |
| A3 | 4 | One screen with accordions; project pages have a sticky contents list and Back. |
| A4 | 2 | Body text is 12 px. |
| A5 | 4 | A narrow text column and an open field; calm 84% at first, falling as flowers accumulate. |
| A6 | 5 | Every project name behaves the same; the same preview card every time. |
| A7 | 4 | Phone layout with thumbnails and one-line questions. |
| A8 | 4 | Everything is plain links; the flowers can be cleared. |
| B1 | 5 | A garden that you grow by clicking; the flower logo carries it. |
| B2 | 4 | Name, then works, then the field. |
| B3 | 4 | White ground; colour only in the soft halftone blooms; saturation 9. |
| B4 | 4 | One family, small and exact; little display character. |
| B5 | 5 | The generative blooms are distinctive and consistent. |
| B6 | 4 | The left 300 px is dense, the right is open until you fill it. |
| B7 | 5 | Exact alignment, tidy accordions, careful corners. |
| C1 | 4 | Clicks grow flowers and hovers preview work; flowers also appear on their own. |
| C2 | 3 | Blooms keep growing by themselves for over a minute. |
| C3 | 5 | Preview within 100–400 ms; blooms unfurl in about 1.5 s. |
| C4 | 2 | No scroll on the home page. |
| C5 | 5 | Hover indent, dash and weight change, plus the preview card. |
| C6 | 5 | Text first, then a single bloom from the corner. |
| C7 | 3 | The screen fills up unless you press reset. |

**What makes it work**
1. Hover a project name and its video plays large in the empty space, so the work is one gesture away.
2. A narrow, quiet text column (12 px, 270 px wide) against a big empty field.
3. The decoration is generative and owned by the visitor: click to grow; it is soft (dot-matrix, low contrast), never covering the text column.
4. Project pages use a sticky contents list and lead with a question.

**What it avoids**: no headings on the home page, no images until you hover, no nav bar, no scroll.

---

## 7. Ayush Dhibar — ayushdhibardesigns.framer.website

**Numbers**

| Measure | Value |
|---|---|
| Calm (median, range) | 72% (59–83) |
| Busy (median, range) | 7% (1–20) |
| Hues / saturation / lightness | 3 / 25 / 69 |
| Page length | 10.2 screens (9,201 px), Lenis smooth scroll |
| Fonts | 5: Montserrat (body), "against" (display serif), ROTHEFIGHT (marquee), Inter, Caveat |
| Things competing on the first screen | 5: "Hi, I'm Ayush" heading, the 224 px marquee, the clay computer, the left nav, the mode toggle |
| Work visible on the first screen | 0 |
| To real work | 3 wheel screens, or 1 click on "Works" |
| Loader | A "0%" counter on a lavender sky, counting to 100% in about 4–6 s in headless Chrome; skipped in "Interactive mode OFF" |
| Idle motion | 20% of the screen (the marquee band and clouds) |
| Phone | Mostly designed, with overlaps: in "Let's build something meaningful together" the button covers the heading; the timeline heading overlaps entries. |

**First screen.** A bright blue sky (#2f6bff) fading to lavender at the bottom, with soft clouds. Top centre: "Hi, I'm" small and "Ayush" in 72 px "against" serif, white, then a two-line intro. Behind the middle runs a marquee of 224 px condensed capitals, white at low opacity: "PRODUCT · UI/UX · ILLUSTRATIONS · GRAPHICS · 3D · VIBE CODING". In front, a pastel clay 3D retro computer (about 600 px wide) on a white plinth, its screen showing "Hello There, Visitor", with a red mug with eyes, a sticky note, a green ball, and a "VIEW RÉSUMÉ" label on the base. Bottom-left, a vertical nav in 12–13 px white: Home, Works, About me, Resume, and an "Interactive mode ON" switch.

**Motion on load.** The counter loader (0%, 23%, 62%, 76%…) on a lavender sky with a cloud bank, then a cut to the hero. The marquee scrolls sideways continuously.

**Motion on scroll.** The computer rises at about 0.35×–0.5× page speed while polaroid photos slide in from below ("Who am I?"). The sky colour changes slowly down the page from blue to lavender to pale lilac. "Stuff I've worked on" (48 px serif, left) stays put at about 0.17× while project cards scroll past on the right; each card is a clay handheld console whose screen holds the project image and whose side panel names the result ("Improving Doctor Towels' conversion rate by 41.9%"). "Journey so far" stays pinned left while a vertical timeline with logo entries (SDSLabs, ownpath, Swiggy, Doctor Towels) scrolls on the right. The page ends on a grassy hill with wildflowers and butterflies holding three social icons.

**Motion on hover.** On a console card the round right-hand button lights orange and the screen does a short power-off and power-on before showing the image (about 400 ms).

**Interactive mode OFF** (`/home-lite`). Same layout and content, no counter loader (hero in about 2 s), no animated sky canvas.

**A project page** (`/works/swiggy-stride`). About 8.5 screens (7,631 px), 282 words, 25 images. Same lavender sky and left nav. Title 40 px serif ("Improving the workflow of the Swiggy Dineout sales team — a case study"), a 3-line intro, a hero image of the app icon and phones. Below, a sticky left column (Client, Work, Time period, a black "Documentation" button) while the right column shows an org chart, user flows and phone screens. Ends with "Other works" and the same meadow footer.

**Scores**

| # | Score | Evidence |
|---|---|---|
| A1 | 5 | "Hi, I'm Ayush", a one-line role, "View résumé" and a visible nav. |
| A2 | 3 | Work at 3 screens; "Works" in the nav is one click. |
| A3 | 5 | The left nav and mode switch are on every screen. |
| A4 | 3 | 12–13 px white Montserrat on lavender has weak contrast. |
| A5 | 4 | One object per screen; calm median 72%, busy 7%. |
| A6 | 4 | Every project is the same console card. |
| A7 | 3 | Phone layout exists but has overlapping text in two places. |
| A8 | 5 | "Interactive mode" switch removes the loader and canvas. |
| B1 | 4 | A sky you descend through, from blue to a meadow, with clay objects. |
| B2 | 4 | One heading and one object per screen. |
| B3 | 4 | Blue to lavender gradient with small orange accents; 3 hues. |
| B4 | 3 | Five families; the marquee face fights the serif. |
| B5 | 4 | Clay 3D objects are consistent; photos and the meadow less so. |
| B6 | 4 | Calm 59–83%; the hero and footer are richer than the middle. |
| B7 | 4 | Clean, except the phone overlaps and the Framer badge. |
| C1 | 3 | Scroll effects have a cause; the marquee does not. |
| C2 | 3 | The marquee and clouds move all the time (20%). |
| C3 | 4 | Smooth, eased scroll and hover. |
| C4 | 4 | The sky changes colour as you go down and ends on the ground; sticky headings with moving cards. |
| C5 | 3 | Only the console button lights; nav barely reacts. |
| C6 | 3 | A percentage loader, then a cut. |
| C7 | 3 | The marquee never stops. |

**What makes it work**
1. The background tells you where you are: the sky goes from bright blue at the top to lavender to a grassy meadow at the bottom, so the page reads as a descent from sky to ground.
2. Sticky left heading, moving right column: "Stuff I've worked on" and "Journey so far" stay while cards and timeline scroll.
3. Each project is a toy-like object (a clay console) holding the screenshot, so work belongs to the same world as the hero.
4. A visible switch for a lighter mode.

**What it avoids**: no grid of cards, no paragraphs longer than five lines on the home page.

---

## Cross-site summary

### Facts at a glance

| Site | Calm median (range) | Busy median (range) | Idle motion | Page length | To real work | Fonts |
|---|---|---|---|---|---|---|
| Adya | 58 (34–79) | 11 (0–19) | 17% (title shimmer) | 10.2 screens | 5 screens | 4 |
| Sudarvel | 41 (6–56) | 27 (16–52) | 2.4% (gadgets cycle) | 3.7 | 1 scroll | 7 |
| Chi | 76 (46–80) | 8 (6–25) | 0% | 4.7 (sideways) | 0 | 4 |
| Vibhor | 44 (16–47) | 19 (16–39) | 15% (camera orbit) | 1 (no scroll) | loader + 1 click + flight | 2 |
| Manisha | 51 (1–68) | 27 (11–66) | 0.02% | 9.1 | 2 screens / 1 click | 2 |
| Frances | 60 (21–84) | 9 (6–13) | 2%, growing | 1 | 0 (hover) | 1 |
| Ayush | 72 (59–83) | 7 (1–20) | 20% (marquee) | 10.2 | 3 screens / 1 click | 5 |

### Median score per criterion (seven sites)

| Criterion | Median | Adya | Sudarvel | Chi | Vibhor | Manisha | Frances | Ayush |
|---|---|---|---|---|---|---|---|---|
| A1 First screen | 4 | 3 | 5 | 4 | 4 | 4 | 4 | 5 |
| A2 Path to work | 4 | 2 | 5 | 5 | 2 | 4 | 5 | 3 |
| A3 Orientation | 4 | 4 | 3 | 3 | 4 | 3 | 4 | 5 |
| A4 Reading | 3 | 3 | 4 | 2 | 3 | 3 | 2 | 3 |
| A5 Calm | 4 | 4 | 2 | 5 | 3 | 2 | 4 | 4 |
| A6 Consistency | 4 | 4 | 4 | 5 | 4 | 3 | 5 | 4 |
| A7 Phone | 3 | 2 | 4 | 3 | 4 | 1 | 4 | 3 |
| A8 Plain path | 4 | 2 | 3 | 3 | 4 | 4 | 4 | 5 |
| B1 Idea | 5 | 5 | 4 | 5 | 5 | 3 | 5 | 4 |
| B2 Composition | 4 | 4 | 3 | 5 | 3 | 3 | 4 | 4 |
| B3 Colour | 4 | 4 | 3 | 5 | 3 | 2 | 4 | 4 |
| B4 Type | 4 | 4 | 2 | 4 | 3 | 4 | 4 | 3 |
| B5 Image-making | 4 | 5 | 4 | 5 | 4 | 3 | 5 | 4 |
| B6 Space | 4 | 5 | 3 | 5 | 2 | 3 | 4 | 4 |
| B7 Finish | 4 | 4 | 4 | 5 | 4 | 3 | 5 | 4 |
| C1 Purpose | 4 | 4 | 3 | 5 | 4 | 4 | 4 | 3 |
| C2 Amount | 3 | 3 | 2 | 5 | 2 | 4 | 3 | 3 |
| C3 Timing | 4 | 4 | 4 | 5 | 4 | 4 | 5 | 4 |
| C4 Scroll | 3 | 5 | 3 | 4 | 2 | 2 | 2 | 4 |
| C5 Feedback | 4 | 4 | 4 | 4 | 4 | 3 | 5 | 3 |
| C6 Entrance | 3 | 4 | 3 | 5 | 2 | 1 | 5 | 3 |
| C7 Rest | 3 | 3 | 2 | 5 | 2 | 5 | 3 | 3 |

The weakest shared criteria are A4 (reading: 12 px text on three sites), C2 (amount of motion) and C7 (rest). The strongest are B1 (idea, median 5): six of the seven are built around one concept you can say in a sentence.

### Patterns of the sites that score 4 or more on A5, B6 and C2

Only **Chi Quach** scores 4+ on all three (5, 5, 5). Adya, Frances and Ayush score 4+ on A5 and B6 but 3 on C2, each because of one piece of motion that never stops (title shimmer, self-growing flowers, marquee). Remove that one loop and they qualify. The patterns shared by Chi and these three near-misses:

1. **One focal thing per screen on a quiet ground.** A bag on white (Chi), one painting or one card on black (Adya), one clay object on a sky gradient (Ayush), one text column beside an empty field (Frances). Their calm medians are 58–76%; the two busy sites (Sudarvel, Manisha) are 41% and 51%.
2. **The work is an object in the world, not a card in a grid.** Chi's projects are things in her bag; Adya's are planets and comets ("Planet C"); Ayush's are clay consoles; Frances's open as a large video in the empty field; Vibhor's are places on an island; Manisha's are apps in a dock. Nobody uses a plain thumbnail grid except Sudarvel.
3. **Scrolling moves a camera or a path, and the ground tells you how far you have come.** Adya descends from space through clouds to a hand, with three captions; Ayush's sky turns from blue to lavender to a meadow; Chi's wheel walks you sideways past the objects. All follow the wheel 1:1 with smooth scrolling and none of them scroll-jack.
4. **Motion is caused and short.** Hover reveals are the main motion: Chi's x-ray turns into the real photo with a label and the headline scrambles to "WHAT'S IN MY BAG" (~600 ms); Frances's preview video appears in 100–400 ms; Adya's cards glow in ~300 ms. Entrances happen once and finish within 2.5 s (Chi) or come from one corner (Frances).
5. **One display voice, one small UI voice.** Chi: a light serif at 160 px plus 12 px grotesk labels. Adya: Instrument Serif italic plus DM Mono capitals. Frances: one family only. Sudarvel, with seven families, scores lowest on type.
6. **Density changes between screens.** Rich screens (the bag, the painting, the clay hero) are followed by sparse ones (white strip, black starfield, timeline on plain lavender), with calm ranges of 30+ points.

### Could not check

- **Vibhor:** the loader took 19 s on the first visit and 107–157 s on later visits in headless Chrome (software WebGL); real-GPU timing is unknown. "Enter the island" did not open free-walk mode in my run, the wheel did not visibly move the camera, and I did not advance past stop 1 of 10, so I did not see how a single project is presented on the island. Sound was not checked.
- **Sudarvel:** the "pull a drawer" hero interaction was not triggered (my click hit an off-screen element).
- **Ayush:** hover on the side nav was not captured (script error); the card hover was.
- **Chi:** "LEARN MORE" showed no visible change when hovered or clicked.
- **All sites:** `prefers-reduced-motion` was not tested. Load timings come from headless screenshots, which were slow on the heavy pages (Adya, Ayush, Vibhor); treat them as order-of-magnitude.
- No site blocked the browser.
