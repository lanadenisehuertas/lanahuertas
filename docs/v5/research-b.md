# Research B: how three portfolios carry play below the first screen

Studied 2026-11-17 in Chrome through Playwright (Python), headless, 1440×900 and 390×844. Every section was scrolled into view with the mouse wheel and filmed at 0, about 100–150, 400–450 ms and later; hovers and clicks were filmed the same way. Onlyvibhor.com was run with the real GPU (`--use-angle=d3d11`), which cut the loader from 107–157 s (earlier runs, software WebGL) to about 42 s. Manisha's site is a static page whose HTML and CSS were read in full, so durations and easings below are exact for her. Frances's durations come from computed styles. Everything not seen in a screenshot or read from code is marked **(inferred)**.

This file goes deeper than `docs/v3/research-picks.md` sections 4–6 and does not repeat their scoring. Note: both Manisha's and Vibhor's sites have changed since the v3 notes (Manisha now has entrance choreography and a custom cursor; Vibhor's island now renders fully and has ten tour stops with project lists).

Evidence: `C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v5\` with one folder per site (`manisha\`, `frances\`, `vibhor\`). Contact sheets are the `sh-*.jpg` files. Scripts sit in the `v5\` folder.

---

## 1. Vibhor Mathur — onlyvibhor.com

### The thread

The title screen sets up **his career as a walkable low-poly island**: every department he worked with is a place with a gate, billboards of the work and a floating name label, and a dark UI frame (side panel, icon rail, minimap) sits over the live 3D scene. The page never scrolls; the "sections below the first screen" are the places on the island, and every one of them is reached by the same mechanic (the camera flies there and a "pass" panel slides in), so the hero's world is literally the container for all content. The UI keeps game vocabulary throughout: passes, stops, missions, campaigns, secrets, a progress percentage.

### Section by section

The order below is the guided tour order ("Stop 1 of 10" to "Stop 10 of 10"), then the menus that sit outside the tour.

**0. Loader and title screen.**
- Loader: charcoal `#1e2226` full screen, "Vibhor Mathur" Inter Tight 600 22 px, "A portfolio you can walk through" 12 px at 50% white, a 1 px track with a green `#3dd36d` fill (`scaleX`, 0.45 s `cubic-bezier(.2,.8,.2,1)`), step text and percentage in DM Mono 10.5 px ("Setting the type 1%"). It fades out over 0.8 s when ready. With a real GPU: about 42 s on desktop, 46 s on phone emulation (network-bound; earlier software-WebGL runs took 107–157 s). If the island fails, the loader offers "Open the light island" (`?mini`).
- Title: the island seen from above at an angle, slowly orbiting while idle (two frames 1.5 s apart differ). Left, a 340 px dark panel radius about 24: avatar, "Vibhor Mathur / Creative director & design leader", a bright green primary row "Enter the island / Walk it at your own pace", four dark rows with icons ("Guided tour", "Run a campaign", "About Vibhor", "Work with me", each with a grey second line), three stat tiles (11, 10+, 4) and a key legend with `kbd` chips. Bottom left of the island: eyebrow "Communication Design Senior Manager, Razorpay" 14 px, headline "A portfolio / you can walk through." Inter Tight about 95 px, tracking about −3.8 px, near black; two-line intro 18 px.
- Hover: menu rows lighten (subtle). No cursor change.

**Tour mechanics (shared by every stop).**
- Clicking "Guided tour" turns the left panel into a 72 px icon rail (About with avatar, Explore, End tour in orange, Map, Journal with a green progress badge "4%", Classic, a clock showing in-game time with a sun icon, Sound, Keys, and "Hire me" in green at the bottom) and puts a minimap card bottom-right ("Vibhor's island / Exploring", a 200 px canvas with orange place dots and a blue you-are-here arrow).
- Bottom centre: a round ← button, a thin track whose orange fill grows one tenth per stop, a round → button, and a dark pill "Explore from here" (leave the tour and walk from this spot).
- On → click the **right panel swaps content instantly** (already new at 100 ms) while **the camera flies** at walking height along the paths to the next place: in motion at 100 ms and 500 ms, nearly framed at 1.2 s, settled by about 2.2 s; it feels ease-in-out (inferred from the frame spacing). From the title to stop 1 the camera dives from the overview to the central tree over about 2 s and settles by 3.5 s.
- Floating label pills in the 3D scene (white dot, dark pill, two lines such as "Brand / The Arena", "AI Lab / Tools, films & automation") name the places in view and stay attached to their buildings as the camera moves.
- The right panel (about 340 px wide, dark `#22262a`-ish, radius about 24, full height minus 16 px margins) has the same structure at every stop: a round coloured emoji badge plus a two-line "pass" ("Department pass / The Arena"), the department name as a 26–30 px title, a one-sentence lede, three fact tiles (count of projects, two focus tags, "New / visit" which becomes "Again / visit" on a second pass), a "How I work with this team" list with coloured bullets, tag chips, then "Work shipped together · N projects" as rows (56 px thumbnail, title, a green one-line stat such as "30 AI-led ad films", a chevron). Row hover lightens the row background. Closing × top right.
- Every department has its **own accent colour that appears on the gate, the badge, the bullets and the phone chips**: Brand blue, Product Launches teal, Social pink, Mentorship yellow-ochre (seen on gates and panels).

**Stop 1: "Creative Direction & Culture" (Island pass / The Jamun Tree).** A big low-poly tree in a round plaza, people standing about, a heart speech bubble over one figure. Panel lede: "No projects here: this is how the studio thinks." Lists five beliefs, tag chips, and the three stat tiles. Nearby labels: "AI Lab", "Vibhor's Home".

**Stop 2: "Brand" (Department pass / The Arena).** A white wall with a large "BRAND / THE ARENA" sign and a scalloped arch outlined in blue, white crenellations, and a billboard of "Break To Build" behind. Panel: 6 projects (Break To Build, Backing India's Start-Up Champions, Grofers films…).

**Stop 3: "Product Launches" (Launch Field).** Same gate type with a teal scalloped arch, tilted billboards for "Back in the Ring", a domed pavilion, a floating teal sphere. 18 projects in the panel.

**Stop 4: "Social" (Beacon Hill).** Gate with a pink arch; small screens on the wall show social posts. 9 projects.

**Stop 5: "Mentorship" (The Mentors' Court).** Gate with an ochre arch; 8 talks and workshops listed.

**Stop 6: "The Night Lab" (By the pond).** A curved row of framed artworks on easels around a pond with a bench; a sign "Our mentors" nearby. Lede: "After hours, by the water: art to sit with." The panel adds "Sit on the bench and watch the work, one piece at a time". 6 pieces.

**Stop 7: "The Playground" (Art & play).** A glass dome with signboards. 8 pieces plus "Films & references that shaped the work" (e.g. "Damini 1993").

**Stop 8: "Vibhor's Home" (Home pass / Jaipur Pink House).** A pink Jaipur-style house with arches; the panel is the About in short and ends with two big buttons, a white "✉️ Write to Vibhor" and a dark "🚲 Ride my bicycle".

**Stop 9: "AI Lab" (Lab pass / Tools, films & automation).** An orange gate with "AI LAB" on a black sign and a glass dome; a large pigeon cut-out stands at the side. 5 projects.

**Stop 10: "Hall of Fame" (Hall pass / Awards & recognition).** Gate in orange and green under a big dome, a "Trial of the Century" award billboard, a gold trophy above. 3 award-winning projects. After stop 10, → wraps to stop 1.

**Case study (opened from any project row).**
- A dark navy dialog fills the window minus a 60 px margin, radius about 24, over the dimmed island. Top bar: a coloured dot plus breadcrumb "Product Launches · Launch Field", and a "Close Esc" pill. It appears in one frame (no visible motion at 0 ms).
- Content (scrolls inside the dialog): a 60 px or so two-line title "BACK IN / THE RING", a meta row of four dark tiles in mono caps (CLIENT, ROLE, YEAR, TYPE), a wide hero image, then a 64 px or so statement headline ("A fallen champion, written off by one-tap payments, gets its redemption arc."), a white pill button "🎮 Play the Netbanking game ↗", a "HOW IT WAS CRACKED" card with a teal top edge (THE PROBLEM / THE IDEA / THE CRAFT columns, then four cards each with a coloured left bar and a mono label: "MAKE IT WORK" blue, "CONVERT" green, "LEAVE AN IMPRESSION" pink, "SHAPE THE BRAND" yellow), "THE BRIEF", "THREE PIECES, ONE STORY" as numbered rows ("01 The film", "02 The arena", "03 The game"), the film, and so on. External pieces open in an in-site "webpop" iframe card with "Open in a new tab ↗" (seen in the HTML).

**About (modal, from the title menu, the rail or "Hire me").**
- A wide dark sheet (about 1180 px) with a left column: a photo card with a "Jaipur → Bengaluru" chip, name 30 px, role in green, a green "✉️ Write to me" button, and **two buttons that send you back into the world: "🏡 Walk to Home" and "🚲 Ride my bicycle"**; under them an in-sheet contents list (Impact, Awards, Path, What I bring, How I lead, Mentoring, After hours, Work with me).
- Right column scrolls: "About", a 64 px headline "Designing narratives by day. Crafting emotions through **art** by night." with "art" in green; three info tiles; "Impact" as a bento of stat tiles (the first one green "3 businesses on one visual system", then "10+", "4", "1→3", "81", "Gold"); "Numbers the work moved" with each stat linking to its project ("8.1M unique viewers / Backing India's Start-Up Champions →"); "Awards" with a big orange-gradient tile "7 awards in 2026" and coloured result pills (Winner, Gold Honor, Finalist, First List); "Path" as a three-row timeline; "What I bring" as five icon cards; "How I lead" as chips; "After hours" as a photo grid; "Work with me" ends in a contact form (name, email, a select "A full-time role", message, "Send message").

**Run a campaign.**
- Clicking it drops you onto the island as a walking avatar (a person in white beside a delivery scooter rider), next to an in-world noticeboard "The studio method" (Brief, Insight, Idea, Craft, Scale, Proof, with "Walk round the board to pick up a brief"). A toast at the top: "Welcome to the village." with the line "Walk up to a billboard to open a project." The Journal flies out on the left on its "Campaigns 0/4" tab: four cards with a coloured left edge ("Trial of the Century", "Start-Up Champions", "Back in the Ring", "MoneySaver launch"), each with its route through the departments ("Brand → AI Lab → Social") and a white "Take this brief · 4 stops" button.

**Journal (J).** A dark flyout with a progress ring ("8%"), three tabs "Missions 0/5", "Campaigns 0/4", "Secrets 0/6", and missions with counters: "Meet every department 4/10" (with a chip per department, visited ones lit), "Open project files 1/62", "Ship the campaigns 0/4", "Find the hidden places 0/2", "Find the golden trophies 0/4". Visiting stops and opening projects fill these counters and the rail badge, so browsing the portfolio is the game's score.

**Map (O).** The camera rises to a near top-down view of the whole island; the paths form a star of radial roads with a ring road and the sea around; every place has its label pill; a hint at the top says to click a place to fly in (cut off in my frame).

**Time and sound.** The rail clock is the island's time. Clicking it fast-forwards the day (10:58 to 11:30 within 3 s; a second click jumped to 14:19 and ran on to 16:47 in 3 s); the light shifts slightly. Sound is generative ("Music is composed live as you walk: a tanpura raga by day, a hush by night, a theme for every room."). "Classic" camera mode: I could not see what it changed.

**Walking.** WASD, Shift to run, Space to jump, E to interact, F to wave; a bicycle with a ride bar ("km/h", B for the bell). Touch: a thumb stick on the left, "Use", "Jump", bell and "Off" buttons. (From the HTML; I did not walk in the headless runs.)

### Section transitions

- Every hand-over is **a camera flight through one continuous world**: about 2 s, low over the paths, while the side panel swaps immediately. The world never cuts.
- Overlays (case study, About, Journal) open over a dimmed island, so the world stays visible at the edges.
- The minimap and the orange tour progress bar make position explicit at every moment.
- About links back into the world ("Walk to Home", "Ride my bicycle"), and the Home stop links to the About content, so the two are two ends of one loop.

### Content presentation

- Work: billboards and screens inside the 3D world, then rows in a department "pass", then a full case dialog with a statement headline, meta tiles in mono caps, and colour-coded "how it was cracked" cards. Each project row shows a stat line in green instead of a date.
- Experience: departments as places; career path as a three-row timeline inside About.
- Awards: their own place on the island ("Hall of Fame" with a trophy) and an orange "7 awards in 2026" tile.
- Contact: "Hire me" in the rail, "Write to Vibhor" at his house, and a form at the end of About. There is no footer.

### What makes it feel rich, not plain

1. **One container for everything.** The hero's world is where every section lives; navigation is camera movement, not scrolling.
2. **A per-department colour key** carried by the 3D gate arch, the panel badge, the bullet points and the phone chips.
3. **A repeating "pass" panel template**: badge, two-line pass name, title, lede, three fact tiles, how-I-work bullets, tags, project rows with green stat lines.
4. **Game scoring over a portfolio.** Missions, campaigns, secrets, a percentage badge on the Journal, "New / visit" turning into "Again / visit".
5. **Guided and free paths side by side.** Tour with ← → and a progress bar; "Explore from here" to walk; "Take this brief · 4 stops" to follow one campaign across departments.
6. **Ambient life.** Idle orbit, people standing in the plazas, time of day you can fast-forward, generative music by place.
7. **Projects told as stories with labelled mechanics**: "THE PROBLEM / THE IDEA / THE CRAFT", then four colour-barred outcome cards.

### Phone (390×844)

The title becomes the island image with "A portfolio you can walk through.", a lead line, a green "Explore the 3D island →" and a white "Browse my work". "Browse my work" opens a dark scrolling sheet: header with avatar, a green "3D island" pill and ×; a horizontal row of department chips (stickiness not checked) each with its colour dot (Brand blue, Product Launches teal, Social pink, Mentorship yellow); "Selected work" 30 px; the three stat tiles; then per department a heading with its coloured badge, a project count and tags, the lede, and a horizontal carousel of project cards (image, title, green stat line). The world's colour key survives in plain list form.

---

## 2. Manisha Koranga — manisha.design

### The thread

The hero sets up **her desktop and her camera roll laid over a painted landscape**: a meadow wallpaper, cut-out objects from her life, and a hand-drawn cursor. Below, every section is another "screen" of the same personal computer and the same scrapbook: a macOS desktop for the work, a design-tool selection box over a photo dump, a shopping cart for her life, a drawing canvas, and a closing hill. Two things travel the whole page and tie it together: **the custom cursor** (it changes shape over every kind of object, in every section) and **the entrance choreography**, where each section's objects arrive in a way that matches what the section is (thrown into a cart, dragged open by a cursor, painted in by a brush).

### The global layer: one cursor for the whole page

- The native cursor is hidden (`cursor: none !important` on everything); a fixed `#cursor` element follows the pointer with lerp smoothing: each frame `x += (target − x) × 0.35`. So it trails very slightly and feels soft.
- Five states, swapped by what is under the pointer (JS reads `closest()` on each mousemove). Each part transitions `opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)` (a springy overshoot):
  - **Default:** a 32 px hollow hand-drawn arrow (black 2 px stroke, no fill).
  - **Heading** (any section title): the same arrow scales to 1.7× and tilts −14°. Seen over "AI-assisted. Human-obsessed."
  - **Link** (nav links): the arrow shrinks out; a 36 px lilac ring (`#e0b9e2`, 3 px border) with a 5 px black centre dot pops in.
  - **CTA** (buttons, project window, dock icons, contact pills): a 56 px filled lilac disc with a **handwritten verb** in Homemade Apple 12 px. The word is per element, set in `data-cursor-label`: "chat" on Let's chat, "view" on the project window, "prev", "next", "pause"/"play" on the browser buttons, "flebo", "menteiz", "kargo360" on the dock icons, "cv" on Resume, "say hi" on the email pill, "connect" on LinkedIn.
  - **Photo** (every cut-out, polaroid, artwork, cart item): a 36 px green four-point star image that spins (`c-spin 5s linear infinite`).
- Press: the whole cursor scales to 0.85 on mousedown (0.15 s ease).
- Why it matters for the thread: the same star sits next to captions all page long ("drafts✦", "late night experiments✦", "side quests✦"), so the cursor and the captions share one motif.

### The global layer: entrance choreography

All sections use one system: each element gets offsets (`--rvx`, `--rvy`, `--rvr`, `--rvs`, `--rvd`) and starts at opacity 0. When it is 8% into the viewport (IntersectionObserver, root margin −8% bottom), it gets `.in` and transitions to rest: `translate` over `--rvd` (default 0.85 s) with `cubic-bezier(0.22, 0.9, 0.3, 1)` (fast out, long settle); `rotate` and `scale` with `cubic-bezier(0.34, 1.35, 0.5, 1)` (slight overshoot); opacity over 0.8 × duration. Offsets are computed from each element's position relative to a section centre, so things fan out from, or fly back to, a focal object. Reduced motion skips all of it. The site has no scroll-linked (scrubbed) motion and no parallax; everything is "enter once, then rest".

### Section by section

**1. Hero (0–960 px, 1440 px canvas).**
- On screen: a full-bleed painted golden-hour meadow with cows (960 px tall). A frosted nav pill 823×96 px, radius 999, white at 16–18% opacity: "mk" in Homemade Apple 28 px olive (`#5a6010`), links "Work · About · Contact" Archivo 600 16 px, a lilac "Let's chat →" pill 44 px tall. Centred at y 358: "manisha koranga" Homemade Apple 42 px pale yellow (`#f2f5cf`) with a soft dark text shadow, next to a lilac label "Product Designer" (Archivo 600 15 px on `#e0b9e2`, square corners). Below: "AI-assisted. Human-obsessed." Archivo 65 px, lilac `#e0b9e2`, tracking −2.37 px. Along the bottom a collage of cut-outs: a framed portrait card 467×515 (8 px off-white frame) in the centre, an iced coffee, a lily, a landscape photo, a Spotify "Now playing" card with AirPods, a dog in sunglasses and headscarf (379×506).
- Entrance: nav drops from −26 px (0.7 s); name rises 22 px (delay 140 ms); tagline slides in from −60 px left (280 ms); the portrait rises 26 px from 0.85 scale (380 ms); then every other cut-out **fans out from the portrait centre** (each starts 25% of its distance closer to the portrait, at 0.82 scale, rotated ±7°, delay 480 ms + distance × 0.55 ms, so outer objects land last).
- Hover: cursor states only (star on every cut-out, tilt on the headline, ring on links, "chat" disc on the CTA). Clicks: nav links smooth-scroll to fixed y positions.
- **The collage spills past the hero's bottom edge** into the white About section (portrait runs to y 1174, the lily to about y 1100).

**2. About ("A little about me", 959–1698).**
- On screen: white with an 80 px grid of 7%-black lines (graph paper). Left: "A little / about me" Archivo 119 px, tracking −5.4 px, `#141414`. Right: two paragraphs Archivo 18/27 px, then a handwritten line "i design for humans. Ai is just my new coworker." in Homemade Apple 17 px, dark green `#2e5c3a`. The text block is framed only by **two 20 px corner brackets** (top-right and bottom-left, 2 px black), like a selection or crop mark.
- Entrance: heading slides in from −70 px; the two corner brackets start together in the centre of the text block and **fly out to their corners** (±256 px x, ±134 px y, 0.75 s, delay 180 ms), "opening the frame"; then the paragraphs fade in at 500 ms + 120 ms each, 0.9 s. Seen in the 0 / 150 / 450 ms frames: brackets moving, text arriving.
- Echo: the hero's cut-outs overhang this section's top; the corner brackets are the first design-tool motif, picked up again in the recap.

**3. Projects ("projects / things i've designed", 1694–2738) — a macOS desktop.**
- On screen: a painted wallpaper of sky, clouds and a flower meadow (1449×1044). Title "projects" Archivo 119 px black, with "things i've designed" Homemade Apple 42 px white, rotated −3°, laid across it like a signature. Desktop furniture: a calendar widget (155 px, "22 / Apple Keynote / Online / 10:00–11:30") top-left; a blue "drafts✦" folder with a Miffy clip and a "survival.jpg" thumbnail top-right; a cartoon dog in a beret and checked jumper bottom-right (238×220).
- The work object: a browser window 824 px wide at x 308, radius 22, shadow `0 18px 36px rgba(0,0,0,.16)`. Grey title bar 54 px with traffic lights (15 px red/yellow/green), back and forward buttons (28 px circles), an address field showing the project URL ("flebo.in", "menteizaviation.com", "kargo360 · a2a + d2d"), three dots, a search glyph, and a pause button. The viewport (960:656) plays a **screen recording of the real product** at 1.25× speed. Under it a caption bar 58 px: title 26 px Archivo 600 ("Re-design Flebo") left; role, tools, year right at 15 px. Below the window a macOS dock (467×111) with Finder, one app icon per project, and the Trash; a 6 px white "running app" dot sits under the active icon.
- Behaviour:
  - The recording plays only while the window is at least 40% visible. When it ends, the window **moves on to the next project by itself**. The address-bar dots double as a progress bar: the active dot stretches from 7 to 28 px (0.4 s, `cubic-bezier(0.22, 0.9, 0.3, 1)`) and fills black left-to-right with playback.
  - Hovering the window keeps the current recording looping (no auto-advance), and the cursor becomes the "view" disc. Click opens the case study page.
  - Clicking a dock icon or back/forward crossfades the slide (opacity 0.45 s ease; at 100 ms the new project is already mostly visible in my frames), changes the address-bar URL, and **slides the running-app dot to the new icon** (0.35 s). Kargo360 is a phone recording masked to an iPhone shape, standing on a dimmed backdrop inside the same window.
  - Bar buttons go from `#f8f8f8` to white with black icon on hover (0.2 s).
- Entrance: title rises 36 px; the script signs over it from −14 px (280 ms); the window rises 70 px from 0.94 scale (180 ms); calendar slides from the left, folder drops, survival.jpg slides from the right, **dock slides up 90 px** (540 ms), the dog walks in from the right 80 px (680 ms).
- Echo: same painted-meadow world as the hero but in daylight; the hero's "Spotify card" idea (a real UI as a collage object) grows into the main event; the dog character returns (hero dog in sunglasses, desktop dog in a beret, three animals at the end).

**4. Monthly recap ("side quests / monthly recap", about 2826–4030) — a design-tool canvas.**
- On screen: white, no grid. Centred: "side quests✦" Homemade Apple 50 px lilac with the green star, then "monthly" and "recap" Archivo 144 px stacked. Around them, scattered like files on a canvas: three photo frames with filename captions in Archivo 16 px ("mountains.jpg", "survival.jpg", "favourite *ramen*.jpg" with "ramen" in script and a 4 px pale-yellow frame), a pixel-art chef "late night experiments✦", a blue folder with Miffy "drafts✦", a pink-tab folder with a cartoon face "My Creative Dump.✦", a rotated cut-out avocado-toast collage.
- The set piece: a **lilac selection box** (2.4 px `#e0b9e2` border) with eight white square handles sits around the word "recap", and a drawn cursor icon (48 px) sits at its corner, exactly as if the word was just selected in Figma.
- Entrance (seen in the 0–1600 ms frames): headings rise (24–34 px, staggered 100 ms); **every photo and folder flies out from behind "monthly recap"** to its spot (each starts at the heading centre at 0.35 scale, 0.9 s, delays 350 ms + 110 ms each); then at 1150 ms the cursor appears at the box's top-left and **drags the selection box open** over 735 ms (box scales from 0.02 from its top-left corner, `cubic-bezier(0.25, 0.1, 0.25, 1)`), the handles pop in one by one (45 ms apart, from 0.3 scale) starting 20% into the drag, and the cursor eases off to its resting spot.
- Hover: star cursor on every photo/folder, tilted arrow on the headings. Nothing is clickable here.
- Echo: the drawn cursor is the same arrow as the live custom cursor; the folders and ".jpg" names continue the desktop; the corner brackets from About become a full selection box.

**5. Life in a cart ("life in a cart", 3971–5160).**
- On screen: a pink wire shopping trolley (1056×1358 cut-out) tilted across the screen, over a painted background (888 px band) that is sharp top-right and blurred to 30 px bottom-left (a blurred copy plus a masked sharp copy, 81% opacity). The band fades into white at top and bottom. Eleven cut-out objects sit in the cart: boxing gloves, a teddy keyring, a Kafka "La Metamorfosis" book, eggs, a protein tub, creatine, a Diet Coke, a ping-pong bat, a "Luckiest Girl" heart tag, a pink tote "Everything is OK!", gold felt stars. Title "life in a *cart*" Archivo 144 px white with "cart" in script, a 25 px soft drop shadow, laid over the items.
- Entrance (seen at 150 / 450 / 900 ms): the cart rises 50 px from 0.94; then **each item is thrown into the cart along an arc** from its nearer side: start 220–340 px out sideways and 60 px up, apex 140–220 px above the landing spot (a sine arc in 16 keyframes), spinning from ±14–24° to 0, scale 0.9 to 1, 680 ms linear; the lowest items land first, 130 ms apart. **Each landing makes the basket wobble** (rotate 0 → −1.3° → 0.8° → 0, 260 ms ease-out, additive). Title slides in from +60 px at 400 ms.
- Hover: star cursor on every item.
- Echo: same cut-out-object language as the hero collage; the gold stars repeat the star motif. The cart's bottom overhangs the next section.

**6. Procreate ("a sneak peek at my procreate", 5163–6910).**
- On screen: graph paper again (80 px grid). A huge pale-pink starburst (1058 px, 42% opacity) behind everything. Heading Archivo 119 px left, three lines. Four artworks: a ramen-bowl drawing rotated 15.7°, a tall pill-shaped landscape (blue hills, a house), a sticker-sheet doodle page 688 px square ("MAYBE YOU DON'T NOTICE YOUR PROGRESS"), and a Luffy ink portrait 565×798. Under the doodle page, a quote in Homemade Apple 18/33 px dark green, starting "Not everything here is portfolio-grade, and it doesn't need to be."
- Entrance: heading rises 30 px; the artworks **reveal with brush-stroke wipes** (clip-path inset from 100% to 0, 0.9 s `cubic-bezier(0.4, 0, 0.2, 1)`), each in the direction of its side of the spread: ramen wipes down (150 ms), landscape wipes from the right edge leftward (350 ms), doodle page wipes left-to-right (550 ms), Luffy from the right (750 ms); the quote fades in last (900 ms delay, 1.2 s). Seen in the 0 / 450 / 900 ms frames: the doodle page is a sliver at 450 ms and half revealed at 900 ms.
- Hover: star cursor on every artwork.
- Echo: graph paper ties it to About; the handwritten quote matches the hero's script name.

**7. Let's talk + footer (6910–8212) — one closing scene.**
- On screen: blush pink `#fce8ee`. "let's talk" Archivo 119 px centred; under it two handwritten lines in Homemade Apple 25 px green ("connection. presence: join the conversation", "there is a place for every idea"). A photo scene fills the rest: a grassy hill with a golden retriever, a white cat and a duck, all in sunglasses, an empty armchair with a white chalk stick-figure drawn sitting in it, a side table with a MacBook. The links are objects in the scene: a blue pill "Resume" (238×62, rotated −8°), a yellow pill with the email address (382×62, rotated −10°), and a round LinkedIn sticker (130 px). At the bottom, "made with too much chai" Homemade Apple 25 px in acid yellow `#ecff18` on the grass. There is no separate footer; this scene is the footer.
- Entrance (seen at 0–900 ms): the scene rises 26 px (1 s); heading rises 34 px (150 ms); **the pills are tossed on** from 80 px above with a spin (Resume from −14°, 460 ms; email from 12°, 620 ms); **the LinkedIn sticker bounces in like a basketball**: drops from 200 px right and 560 px up spinning 240°, squashes on the first bounce (1.08×0.9), hops 150 px, bounces twice more with smaller squashes, 1.4 s total; **the chai line writes itself out** left-to-right (clip wipe 1.6 s, delay 300 ms).
- Hover: "cv", "say hi", "connect" discs on the three links; star cursor on the scene.
- Echo: animals in sunglasses close the loop with the hero's dog in sunglasses; the hill closes the meadow that opened the page.

### Section transitions

- Hero to About: **overlap**. The hero collage hangs about 200 px into the white section, so the cut is hidden behind objects.
- About to Projects: **hard cut** to the painted wallpaper, softened because the wallpaper is the same painted-meadow world as the hero.
- Projects to Recap: hard cut from painting to white; the dock and the dog sit right on the edge.
- Recap to Cart: **fade**. The cart's painted band has white fading in from the top, and the cart and gold stars overlap the recap's last photos.
- Cart to Procreate: **overlap**. The cart's bottom (gold stars, wire) runs over the procreate grid.
- Procreate to Let's talk: hard cut to blush pink.
- No pinned sections, no scroll-scrubbed motion, no shared object that travels. The continuity comes from the cursor, the repeated star, the repeated handwriting, the repeated animals and the "every section arrives in its own way" choreography.

### Content presentation

- Work: one live browser window on a desktop, with a dock as the project switcher; the recording is the thumbnail. Captions name role, tools and year. Case pages are separate (`/flebo.html`, see v3 notes).
- About: a big heading plus a corner-bracket "selected" text block, a portrait card hanging down from the hero, and the handwritten aside.
- Personality: a photo dump styled as files on a canvas with a live selection box; a shopping cart of objects; a drawing spread with a starburst.
- Contact and footer: a staged photo scene where the links are props (rotated pills, a sticker), and the sign-off "made with too much chai".

### What makes it feel rich, not plain

1. **A cursor with a vocabulary.** Five states (arrow, tilted big arrow, ring, verb disc, spinning star), springy 0.22 s swaps, lerp 0.35, and a different handwritten verb per CTA ("view", "say hi", "connect").
2. **Each section enters in its own story.** Fan out from the portrait; brackets open a frame; files fly out from behind a heading and a cursor drags a selection box; items are tossed into a cart that wobbles on each landing; artworks are brushed in; a sticker bounces like a ball; a line writes itself.
3. **Offsets computed from a focal point.** Every entrance offset is derived from the element's distance to a section centre (`dx = −fx × 0.25`, delay = 480 + distance × 0.55 ms), so a single rule produces a hand-choreographed look.
4. **Real work playing inside an object.** Product recordings at 1.25× in a browser window, auto-advancing, with progress shown in the address-bar dots and a dock that switches projects.
5. **One recurring cast and motif set.** Dogs and animals in sunglasses, the green four-point star, Homemade Apple handwriting, lilac `#e0b9e2`, graph paper: each section reuses two or three of these.
6. **Objects that break section edges.** Cut-outs and the cart overhang neighbouring sections so the page reads as one collage.
7. **Links as props.** Rotated pills and a sticker in the closing scene, each with its own cursor word.

### Phone (390×844)

Not responsive: the 1440 px canvas is scaled to 27% (page 2,224 px tall), so the same layout appears in miniature. The custom cursor is off on touch (`pointer: fine` check), so all hover meaning is lost; the entrance choreography still runs as you scroll. Text is about 4–5 px.

---

## 3. Frances Zhao — franceszhao.ca

### The thread

The home screen sets up **a garden you grow**: a white field where generative dot-matrix blooms appear and where a click plants a new one, beside a tiny text column whose project names open video previews. Below and beyond the first screen (her home page itself does not scroll), the idea is carried by **"play" as the brand of every page**: each case study opens with a playable banner (a working MIDI beat maker, a working record player) set in a painted garden, the footer of every page grows its own small bloom field and counts how long you have been there, and the About and Playground pages turn photos and side projects into objects that lift, caption and expand. A flower mark is on every page: line-drawn at the top of the home and About pages, a halftone bloom in every footer.

### Section by section

**1. Home field (the one screen, 1440×900).**
- Left column 270 px at x 30, all General Sans: a 32 px line-drawn flower logo; "Frances Zhao" 22 px 500; three paragraphs 12 px 400 black; inline links "@ Hack the North", "@ Figma", "@ University of Waterloo"; then three accordions with + / × glyphs: "Works" (open), "Extras", "Contact". Bottom-left: a 14 px reset icon, a palette button of three 5 px dots (pink `rgb(240,20,140)`, lime `rgb(195,222,43)`, cyan `rgb(55,190,228)`) and "(CLICK THE SPACE TO GROW)" 11 px. Bottom-right: "Toronto." and a live clock (12 px, seconds ticking).
- The field: one full-window `<canvas>` (1440×900) behind the column.
  - Load: the column fades in (rows still pale at 500 ms, solid by 1 s); a soft cyan dot appears bottom-right at about 0.5 s; from 1.5 s blooms start opening from the bottom-right corner and keep coming (about half the right side covered at 9 s).
  - **Click empty space**: a bloom starts as a few confetti dots at the pointer (0–400 ms), becomes a dense cluster of coloured dots by 1 s, grows radial halftone petals by 1.5–2.5 s and reaches about 400 px across (petals plus scattered dots) by about 4 s. Petals are soft, blurred, low-opacity rays; the centre is dense confetti dots of every palette colour.
  - **Drag**: dragging across the field plants a trail of blooms along the path (a 600 px drag left about six overlapping blooms).
  - **Palette button**: each click switches to the next named palette (the aria-label starts as "Flower colours: Bloom"; one click gave lilac and violet blooms, a second gave coral, orange and yellow and the label read "Citrus") and new blooms use it; old blooms keep theirs, so the field becomes a mixed bouquet. Hover nudges the outer dots 1 px apart (`--rest`), opacity 0.75.
  - **Reset**: clears the canvas at once; within 400 ms a new bloom starts again from the bottom-right corner.
  - **Text selection is part of the palette**: selecting text in the column highlights each line in a different pastel of the current flower palette (green, salmon, blue, blue, pink in my capture), via `::selection` with `--select-bg` / `--select-ink` variables.
- Hover on project names: the name slides right 14 px, gains weight (variable font, `calc(400 + var(--ink-gain))`), and an 8 px dash grows in front at 45% opacity (0.24 s `cubic-bezier(0.22, 0.61, 0.36, 1)`). At the same time a **preview card** opens in the empty field: fixed, centred vertically and centred in the space right of 22 rem (x 465–1297 at 1440 px), width up to 52 rem (832 px), 16:9, radius 20 px, from 0.97 scale and transparent to 1 and opaque (opacity 0.28 s, transform 0.36 s, same easing). At 100 ms the card shows the poster or a white placeholder; by 400 ms the project video is playing (Hack the North site, the "Select a beat." MIDI toy, the Hacker Directory UI, a glowing globe). Leaving fades it out within about 150 ms. The card sits **over** the flowers, so the work literally appears in the garden.
- Hover on "Open to Winter and Fall 2027 internships!": a second line "click to email me!" fades and slides in under it (0.24 s).
- Accordion click (Extras): the + turns to ×, two rows ("About Me", "Playground") appear under it and the next accordion moves down; instant in my 100 ms frame.

**2. Case study page (e.g. `/works/gamified-hacker-applications`, about 6,200 px; `/works/hack-the-north-2026`).**
- **Banner as a toy.** Full-width, 485 px tall painted scene. Gamified Hacker Applications: a grassy hill with the Hack Pal characters (a red hooded creature, a yellow sun-face with a flower, a boombox) and floating musical notes around a **working teal MIDI beat maker** (3×3 grid of sound buttons "BEAT / CHORDS / MELODY" with a volume slider). The banner title is serif, white, 17 px: "An application you could actually play." Clicking a key lights it yellow and the panel header changes ("Every signal begins with a beat." to "Now select your chords."). Hack the North 2026: a top-down garden with white flowers and bushes and a **working red record player**; leaves sway (`htn-leaf` / `leaf-sway` keyframes), the disc spins (`vinyl-spin`), title "Canada's largest hackathon, reimagined through sound, play, and the web." A small credit at the banner's bottom-right names the developer who coded the toy.
- Below: a sticky contents column on the left (General Sans 12 px: Back, Overview, TL;DR, The Problem, Product 01…, Key Takeaways). The current section is set in a heavier weight as you scroll ("Making the Music" turned bold while I was in it). Hover: same 14 px slide plus dash as the home list.
- Content column (836 px wide, x 317): a meta row (Role, Timeline, Team, Software, Scale) with labels in Hedvig Letters Serif and values in General Sans; a question as the lede, in the serif; kickers in the serif at 12 px ("Product 02: The Basic Info") over sans section heads at 16 px 500 ("Extending the world"); body General Sans 12 px. Images and videos run full column width. One image is a sprite sheet of all MIDI buttons in their idle, lit and glow states, captioned "each color allocated to a unique audio track".
- "↑ BACK TO TOP" is fixed bottom-right (hover: arrow nudges up 2 px).
- Footer: hairline rule; left a **bloom as the logo** (a round halftone flower, colour per page: salmon on the case page, a dark multicolour rosette on About); centre Email, LinkedIn, Twitter; right "You've been here 0:23", a live visit timer. **A small bloom field grows in the footer's top-right corner** after you arrive at the bottom: one cyan bloom at 0:23, several pink, yellow and lime blooms by 0:26 (observed). So the home-page garden returns at the end of every page.

**3. About (`/about`, dark, 1,218 px).**
- Ground `#171717`-ish, light text. Left: the flower logo, then four short lowercase paragraphs in 13 px with **dotted-underlined glosses** ("systems design engineering¹", "physical spaces²", "no.1 community enjoyer³", "the occasional machine shop⁴"). Centre: an experience list as app-icon rows (32 px rounded icon, company in white 600, role in grey, dates right-aligned): Figma, Hack the North, PRISM Collective, Framer, Descartes, Cresta, Clear Spider; then a green line "open to winter and fall 2027 internships!".
- Gloss click: a margin note opens in a fourth column to the right of the list: "1 systems design engineering" then an italic quote and attribution. It reads like a sidenote in a book.
- Experience row hover: a white chip with the company name and ↗ (e.g. "FIGMA ↗") appears beside the row; the company name brightens; the icon dims to 82%.
- Below: a numbered photo grid, 8 per row (each about 160 px wide, varied heights), labelled "01"…"14" in small numerals, ending in a dashed empty frame "?? check back soon". Hover: the photo lifts 4 px and its caption appears next to the number ("02 oreo, missing u daily"). Click: the photo opens large to the right of the experience list with a longer caption ("the day we brought him home, still small enough to fit in the crate…"), and the grid reflows underneath.
- Footer as above, dark, with a multicolour bloom logo and a gold and teal bloom cluster top-right.

**4. Playground (`/playground`, dark, 3,842 px).**
- Intro line "Client work, personal experiments, and everything in between. Built for the fun of it!" then a masonry of tiles with mixed widths (one, two or three per row), each a framed image or video with a lowercase caption and ↗: "portfolio exploration – apple edition", "happy canada day! here's some poutine via figma motion", "keychains made in figma!", "something clean like the sky", "a figma whirlwind", "fish fish fishy!", "blooming pixels" (a pixel-flower field, the same motif in pixels), merch, logos, zines.
- Tile hover: the frame lifts 4 px and a "VIEW POST ↗" pill appears on the image; the ↗ in the caption brightens. Click opens a lightbox (`lightbox-in`, `lightbox-rise` keyframes; close, sound and step buttons) (lightbox seen in CSS; my click frames show the hover state only, so the lightbox look is **inferred**).
- Many tiles are videos that play in place (the poutine fork animates, the fish swim).

### Section transitions

- The home page has no sections and no scroll. "Transitions" are between pages: a project name hover puts the project's video into the garden, and the click carries you into a page whose banner is a painted garden of that project. That is a shared-world handover (flowers to garden banner) rather than an animation.
- Inside the case page: a hard edge from the painted banner to white; sections are separated only by space and a serif kicker ("Product 02: The Basic Info") above a sans heading ("Extending the world").
- Every page ends on the same footer, whose bloom field is the home garden in miniature.

### Content presentation

- Works: a list of four names that each play a video preview in the empty field; on phones, cards with the thumbnail and a one-line question ("What if hacker applications was part of the experience, not something you had to get through?").
- Case studies: lead with a playable artefact, then a question, then a sticky contents list.
- About: the bio with sidenotes, experience as app-icon rows with an outbound chip, life as a numbered photo grid with one empty "check back soon" slot.
- Side work: a masonry "Playground" of living tiles.
- Footer: a bloom logo and a "You've been here" timer; the garden regrows there.

### What makes it feel rich, not plain

1. **A generative signature you can play with everywhere.** Canvas blooms: plant by click, plant a trail by drag, cycle named palettes, reset; and a mini field that regrows in every footer.
2. **The palette leaks into the UI.** Text selection colours come from the current flower palette; the palette is a three-dot button.
3. **Hover puts the work in the world.** A 16:9 card opens over the garden and the project video plays inside 400 ms.
4. **Case studies open with a working toy.** A MIDI beat maker you can press, a record player that spins, in a painted scene with idle motion (swaying leaves, floating notes).
5. **Small time-based life.** Live Toronto clock on the home page, a "You've been here" counter in every footer.
6. **One micro-interaction for all lists.** 14 px slide, weight gain through a variable axis, 8 px dash, 0.24 s, used on the home list, the case contents and the footer link rows.
7. **Objects with a hidden second layer.** Photos lift and reveal captions, glosses open sidenotes, experience rows show an outbound chip, tiles show "VIEW POST".

### Phone (390×844)

A designed single column: name and bio, accordions, the palette dots and reset icon at the end of the column, then each project as a full-width card (thumbnail plus one-line question). Blooms grow at the screen edges behind the cards. The hover preview is switched off (`@media (hover: none), (max-width: 900px) { .preview { display: none } }`); a tap goes straight to the case page, whose banner (the record player) still works. The footer keeps the Toronto clock.

---
## Cross-site: mechanics that recur

1. **The hero's world is the container, not just the backdrop.**
   - Vibhor: every stop is a place on the hero island; the camera flies between them.
   - Manisha: every section is another screen or surface of her world (desktop, design canvas, cart, sketchbook, hill), painted in the hero's meadow palette at the start and end.
   - Frances: each case-study banner is a painted garden; every footer regrows a bloom field.
2. **Work shown as a live object, not a thumbnail.**
   - Vibhor: billboards in the world, then a case dialog with "Play the Netbanking game ↗".
   - Manisha: Projects section, product recordings playing in a browser window with a dock.
   - Frances: home hover preview (video in a 16:9 card over the garden); case banners (working MIDI beat maker, spinning record player); Playground tiles that play in place.
3. **A recurring signature motif, repeated in small sizes everywhere.**
   - Vibhor: per-department colour (gate arch, badge, bullets, phone chips), on every stop, the case breadcrumb dot and the phone list.
   - Manisha: the green four-point star (cursor on photos, every caption "drafts✦", recap heading, cart stars), the lilac `#e0b9e2`, the handwriting.
   - Frances: the bloom (home field, line-drawn logo on home and About, bloom logo in every footer, footer field, "blooming pixels" tile, selection colours).
4. **A persistent cursor or frame that reacts to content type.**
   - Vibhor: the fixed rail, minimap and tour bar over every stop.
   - Manisha: the five-state cursor over every section (hero, about, projects, recap, cart, procreate, talk).
   - Frances: the same list hover (14 px slide, weight gain, dash) on the home list, case contents and footer links.
5. **Section-specific entrances that act out the section's idea.**
   - Manisha: fan-out (hero), opening brackets (about), dock slides up (projects), selection drag (recap), toss into a wobbling cart (cart), brush wipes (procreate), bouncing sticker and self-writing line (talk).
   - Vibhor: the camera dive from overview to the tree (tour start), the flights between gates (every stop), the rise to top-down (map).
   - Frances: blooms opening in the footer when you arrive (every page end).
6. **Objects that hide a second layer behind hover or click.**
   - Manisha: verb discs on CTAs; dock icons switch the window.
   - Frances: glosses open sidenotes, photos lift and caption then enlarge, experience rows show an outbound chip, tiles show "VIEW POST ↗" (About, Playground).
   - Vibhor: project rows open the case dialog; the About's "Walk to Home" and "Ride my bicycle" drop you back into the world.
7. **A recurring character or cast.**
   - Manisha: dogs and animals in sunglasses (hero dog, desktop dog in a beret, closing hill with dog, cat and duck); the drawn arrow cursor appears as an actor in the recap.
   - Vibhor: villagers in the plazas, the scooter rider, the walking avatar (campaign mode, walking).
   - Frances: the Hack Pals around the beat maker (case banner and case images).
8. **Small time-based life.**
   - Frances: live Toronto clock (home), "You've been here 0:23" (every footer).
   - Vibhor: in-game clock and fast-forwarded day (rail), music by time of day.
   - Manisha: recording progress filling the address-bar dots (projects).
9. **Edges softened by overlap or a shared world rather than dividers.**
   - Manisha: hero collage overhangs About; cart overhangs Procreate; a white fade over the cart band.
   - Vibhor: no edges at all, one continuous scene; overlays keep the world visible at the margins.
   - Frances: no dividers on the case page, just space and a serif kicker; footer separated by a hairline with blooms crossing it.
10. **Gamified or toy-like progress.**
   - Vibhor: Journal missions and percentage, tour progress bar, "New / visit".
   - Manisha: address-bar dots as a playback bar, running-app dot under the active dock icon.
   - Frances: palette cycling and reset as a toy; the visit timer.
