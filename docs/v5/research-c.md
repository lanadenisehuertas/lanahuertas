# Research C: how Ayush Dhibar and Scrolltide keep the hero's world going below the first screen

Researched 2026-11-17 with headless Chrome (Playwright) at 1440x900 and 390x844. Screenshots and scripts are in
`C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v5\ayush\` and `...\v5\scrolltide\` (scripts in `...\v5\_c\`).

Evidence labels: **[seen]** means I saw it in screenshots or video frames. **[DOM]** means I measured it from the page code. **[copy]** means it comes from the site's own description text. **[inferred]** means my reading of something I could not fully confirm.

Not repeated from `docs/v3/research-picks.md` section 7: the loader, the fonts list, page length, the "Interactive mode" switch and the basic sticky-left layout. This file adds what happens inside each section.

Limits:
- Scrolltide's preview videos are hosted on `pub-…r2.dev`, and that host did not resolve from this machine (in curl, Python or Chrome). So I could not watch the template motion. Template behaviour comes from Scrolltide's own description text **[copy]** plus the poster stills, which did load **[seen]**.
- Scrolltide shows a "Every template for $9 a month" pricing pop-up after a while. I closed it with "Not now" and did not submit anything.

---

## 1. Ayush Dhibar (ayushdhibardesigns.framer.website)

### The thread

The hero sets up **a sky with a toy-like clay world floating in it**: a 3D retro computer with a mug that has eyes, sparkles and a planet ball. The page then **descends through that same sky**: bright blue, then lavender, then pale lilac, then a grassy hill. Every section holds one clay or paper object that lives in that sky:
- polaroids
- handheld consoles
- a row of 3D books
- a timeline
- a meadow with butterflies

Clouds, a hot-air balloon and pink spiral galaxies drift between sections, so the sky never stops.

### Section by section

**0. Hero (0–900 px)**
- **On screen [seen/DOM]:**
  - Background: sky gradient from `#1e6bf5` at the top to `#c9b6f5` at the bottom, with tiny star specks (a "Stars" layer).
  - Top centre: "Hi, I'm" in about 18 px, then "Ayush" in the "against" serif at 72 px, white. The "Ayush" element is `position: sticky`.
  - Below the name, a 2-line description in 14 px Montserrat.
  - Behind the middle: a marquee of 224 px "ROTHEFIGHT" condensed caps in white at about 25% opacity ("PRODUCT · UI/UX · ILLUSTRATIONS · GRAPHICS · 3D · VIBE CODING"). It scrolls left at roughly 110 px/s **[measured from two stills 3.1 s apart; approximate]**.
  - In front: a Spline 3D scene drawn on a 1728x990 canvas, overflowing the viewport. It holds:
    - a pastel-blue CRT computer about 600 px wide on a white tiled plinth
    - a screen reading "Hello There, Visitor"
    - a red mug with googly eyes
    - a mint sticky note, a green 4-point sparkle, a pink sparkle, a green half-ball and a purple star shape
    - a pink "VIEW RESUME" label on the base
  - Fixed bottom-left nav: Home (active, set in the serif), Works, About me, Resume, and an "Interactive Mode ON" switch.
- **Pointer [seen]:**
  - The whole computer turns to face the cursor. With the pointer top-left, the screen faces up-left. With it top-right, the monitor turns and shows its right side panel.
  - The mug's pupils follow the pointer.
  - The sparkles spin on their axes (the green one turns edge-on).
  - This is continuous pointer-follow, not a hover state. Nothing extra happens when you hover the mug, the screen or the "VIEW RESUME" label.
  - A mouse-down on the screen did nothing visible.
- **Nav hover [seen]:** the hovered item ("Works") brightens from about 70% to 100% white and nudges about 4 px left within 100 ms. There is no underline.
- **Scroll out [seen]:**
  - Over the first 600 px of scroll, the computer moves up at about 0.55× scroll speed and fades to about 30% opacity.
  - The marquee keeps running behind it.
  - Polaroids from the next section slide up into the lower right while the computer is still visible, so the two sections overlap.

**1. "Who am I?" (about 900–1,600 px)**
- **On screen [seen/DOM]:**
  - Left column at x=180: "Who am I?" in 48 px serif, then 6 lines of 16 px Montserrat bio, then a "Know more about me ↗" text link.
  - Right side: four white-bordered polaroids, about 224x253 px each and about 349x285 px for the wide one. Each is tilted slightly (0° to about −4°) and overlaps its neighbours.
  - Each has a handwritten Caveat caption: "Me", "Also Me", "My Uni", "And my internship".
  - Background `#baa3f4` lavender.
- **Scroll [seen]:**
  - The polaroids enter one at a time, each starting about 100 px of scroll after the previous: "Me" first, then "Also Me", "My Uni", and last the internship photo.
  - Each slides up from below the fold into its tilted resting place.
  - The heading and bio slide up with them.
  - **[inferred]** These are Framer scroll-triggered "appear" animations with a spring settle.
- **Hover, click, drag:** no visible change on any polaroid **[seen]**, and dragging does nothing. The polaroids are a static collage that is animated on entry.
- **Echo of the hero:** same sky (now lavender), and the physical-object treatment continues (photos as objects with white frames and shadows, the way the hero has clay objects).

**2. Works intro line (about 1,600–2,600 px)**
- **On screen [seen]:**
  - One centred statement over 3 lines in about 32 px serif, white.
  - Brand marks sit inline: "ownpath" as a bold italic wordmark, the Swiggy logo plus the orange "Swiggy" wordmark, and "doctor towels" in the logo's own style.
  - Excerpt: "From designing at ownpath Studios to building for Swiggy…"
  - A large cloud bank (Cloud 2, 1207x522 px) rises from the bottom.
  - A small hot-air balloon (50x69 px) sits on the cloud.
  - A pink spiral galaxy (491x320 px) bleeds in from the left edge.
- **Scroll [seen]:** the balloon holds almost still in the viewport while the clouds scroll past, so it drifts slowly upward relative to the page.
- **Echo of the hero:** the hero's floating-object-in-sky motif, made smaller (balloon, galaxy, cloud).

**3. "Stuff I've worked on" (about 2,600–4,100 px)**
- **On screen [seen/DOM]:**
  - Left: "Stuff I've worked on" in 48 px serif, a 9-line 16 px intro and "View more projects ↗". The heading stays in view while the cards pass.
  - Right: three cards, each 704x462 px and each built as a clay handheld console:
    - a cream rounded body
    - a large rounded screen on the left (about 240x225 px) showing the project
    - a dark round knob top-right
    - a black side panel with the project logo and an LED-style result line, for example "Improving Doctor Towels' Conversion Rate by 41.9%"
    - two round grey buttons bottom-right
  - Each card is a link (to Medium or the case page).
- **Screens [seen]:**
  - Card 1's screen is a still photo.
  - Cards 2 (Swiggy) and 3 (StudyPortal) play a loop: a blank glowing screen (peach on card 2, pale blue on card 3) for about 2 s, then the UI image builds in from the bottom-left and holds for about 2–3 s, then goes blank again. It reads as a device switching channels.
  - The loop runs whether or not you hover.
- **Hover [seen/DOM]:**
  - The right-hand round button turns orange and glows within 100 ms. The DOM has separate "Base/Glow (White, Orange, Purple)" layers and a "Button Hover" variant.
  - On leave it returns to grey within about 150 ms.
  - Mouse-down shows a "Button Pressed" variant (DOM).
- **Click [seen]:**
  - The click goes to the case page.
  - The new page arrives under a white overlay whose hole opens as a growing ellipse from the top centre (an iris reveal). It is about 70% open at 300 ms and complete by about 600 ms.
- **Echo of the hero:** the same clay-toy material and an object-with-a-screen (the hero is a computer showing "Hello There, Visitor"; each project is a console showing the project). The hero's screen becomes the container for every piece of work.

**4. "Wisdom that shaped me" (about 4,100–4,850 px), not in the earlier notes**
- **On screen [seen]:**
  - Left: "Wisdom that shaped me" in 48 px serif, then a Steve Jobs quote in 16 px italic Montserrat.
  - Right: five 3D book spines standing in a row (each 75x253 px): "Refactoring UI", "THE MOM TEST", "INSPIRED", "Preparing for product Interviews", "STEVE JOBS".
  - A cloud behind the books and a galaxy at the left edge.
- **Hover [seen]:**
  - The hovered book turns about 80° on its vertical axis, from spine-on to cover-facing, widening from 75 px to about 180 px.
  - Its neighbours slide right to make room.
  - It is mostly turned by 100 ms and fully turned by 400 ms. It turns back about 400 ms after the pointer leaves.
- **Tap (phone) [seen]:** a tap turns the book the same way and it stays turned.
- **Click:** nothing opens (the URL does not change).
- **Echo of the hero:** another physical, rotatable 3D object (the hero computer turns toward you; the books turn to face you).

**5. "Journey so far" (about 4,850–8,200 px)**
- **On screen [seen]:**
  - Left: "Journey so far" in 48 px serif, deep violet (not white), held in view.
  - Centre: a 1 px white vertical line.
  - Right: entries about 600 px apart, so one or two show per screen. Each entry has:
    - a 12 px date
    - a role in small caps
    - a 36 px serif company name
    - a 64x64 px app-icon logo tile
    - a 2-line description
  - Entries: SDSLabs, ownpath, Swiggy, Doctor Towels.
  - Each entry has a small glowing white dot on the line.
  - Background lightens from `#9d96dc` to `#bdb7e8`.
- **Scroll [seen]:** entries move at 1× while the heading stays put. The glowing dot travels with its entry. There is no fill-on-scroll line effect.
- **Hover:** no visible change.
- **Echo of the hero:** logos as app icons (rounded tiles, like icons on the hero computer's desktop).

**6. Footer meadow (about 8,200–9,200 px)**
- **On screen [seen/DOM]:**
  - A green dot, then "Open to new opportunities" (12 px).
  - "Let's build something meaningful together" in 19 px Montserrat 500.
  - A black pill "Send a Mail" (205x55 px), with the email below.
  - Below that, a grassy hill built from layers: "Back grass", "Middle land", "Front grass" and "white bg cloud" (DOM), full of wildflowers.
  - Three 128 px social app icons (Instagram, LinkedIn, Medium) stand on top of the hill.
  - Six butterfly images (red, blue, yellow, three orange).
  - Two "Flying land" floating grass islands at the edges (visible on the phone).
  - "Dhibar © 2026. Made with love in the dorms of IITR".
  - Background `#ded8f5`, almost white.
- **Idle [seen]:** the butterflies flutter and change position between frames 250 ms apart. One orange butterfly lands on the Instagram icon, then on the Medium icon.
- **Hover:**
  - "Send a Mail" changes from flat black to a deep navy-violet gradient with a small white sparkle on its top edge, within 100 ms.
  - The social icons show no clear change.
- **Scroll in [seen]:** the hill rises from the bottom as the last 600 px of scroll lands. It is the ground the page has been descending towards.
- **Echo of the hero:** the hero is in the sky; the footer is where you land. The app-icon style returns for the social links, and butterflies replace the hero's sparkles.

### Section transitions
- **No hard cuts.** The background colour changes continuously with scroll: `#1e6bf5` (hero), `#baa3f4` (who), `#7f77cf` (works), `#9d96dc` (books), `#bdb7e8` (journey), `#ded8f5` (footer).
- **Cloud banks straddle every boundary.** There are cloud images over 1,000 px wide at the hero bottom, at works start (y≈1,700), at works end (y≈2,900) and at the footer. They act as soft dividers.
- **Overlap hand-off.** The hero computer is still fading out while the polaroids arrive.
- **Held headings hand over to each other.** "Stuff I've worked on" stays, then "Wisdom that shaped me" scrolls in, then "Journey so far" stays.
- **The fixed left nav and switch** are on every screen, so the frame never changes.
- **Into project pages:** the white iris reveal.

### Content presentation
- **Work:** each project is a clay console. The project shot plays on the console's screen like a channel, and the outcome is printed on an LED side panel ("Improving Doctor Towels' Conversion Rate by 41.9%"). One object per project.
- **About:** a scattered stack of polaroids with handwritten captions ("Me", "Also Me", "My Uni", "And my internship").
- **Influences:** a shelf of 3D books that turn to show their covers.
- **Experience:** a vertical timeline where each company is an app icon.
- **Footer:** a meadow hill with app-icon socials standing on it and butterflies flying around, under "Let's build something meaningful together".

### What makes it feel rich, not plain
1. **One shared world and one material.** Every section object is clay, paper or plastic in the same soft pastel sky. Rebuild: pick one material (for example clay renders) and render every content container in it.
2. **A sky you descend through.** The background colour is tied to scroll position across the full page, from bright sky to ground. Rebuild: one full-page gradient tied to scroll progress, with the final colour matching the footer ground.
3. **Drifting props between sections.** Balloon, galaxies and clouds sit on section seams and move at a different speed from the content. Rebuild: absolutely positioned PNG props at 0.3–0.6× scroll speed, placed across boundaries.
4. **Each work item is a device with a living screen.** Screens loop a blank glow, then the image builds in, then blank again (about a 4–5 s cycle). Rebuild: a framed device component whose screen runs a CSS keyframe loop of image fade or clip-in with a short "power-off" blank.
5. **Hover on one small part of an object, not the whole card.** The console's button lights orange; a book spine turns to its cover. Rebuild: hover changes one sub-part with a 100–400 ms transform or colour change, never a whole-card lift.
6. **Pointer-follow in the hero.** The computer turns and the mug's eyes track the cursor. Rebuild: Spline "look at" events, or CSS 3D `rotateY`/`rotateX` mapped to pointer position (±15°) plus pupils positioned along the pointer direction.
7. **Ambient life at the end.** Butterflies flutter and land on the social icons. Rebuild: 4–6 sprite butterflies on looping offset paths with random pauses at icon positions.
8. **Page change as an iris.** A white mask with a growing elliptical hole over about 600 ms.

### Phone (390x844) [seen]
- The hero computer is about 390 px wide behind the name.
- The polaroids stack in one tilted column.
- Each console card fills the full width.
- The books shrink to about 50 px spines; a tap turns one to its cover.
- Journey entries overlap each other (Swiggy and Doctor Towels collide).
- The footer adds floating grass islands at the edges and a "View my Resume ↗" link.
- A hamburger menu replaces the left nav.

---

## 2. Scrolltide (scrolltide.co)

### The thread

The hero sets up **a night-sea of moving things**:
- a full-width WebGL canvas (1440x774) with an amber-to-blue nebula gradient and star specks drifting slowly
- the word "tide." filled with a cyan-to-blue gradient (`#8bf3e6` → `#46b7ff` → `#2e7dff`)

Below that, the homepage is a catalogue. The thread carried down is **"every tile is alive"**: every section is a 3-column grid of looping preview films (109 `<video>` elements). The same gradient word returns at section ends ("launch.", "149", "Ride the tide."). The page closes with a 317 px ghost "scrolltide" wordmark.

**[inferred]** The richness Lana noticed is not in the homepage layout, which repeats one grid pattern. It is in the templates and components it sells. Those show how a world is carried through sections (section 2b below).

### 2a. Homepage, section by section

**Promo bar (0–40 px)** **[seen]:** a cyan-blue bar with a live countdown ("REGIONAL PRICING $29/month — 26% off · 00:58:14 left") and a "Claim →" pill.

**Header (sticky, 65 px)** **[seen]:** logo, 11 text links in 13 px Inter, "Log in", and a white pill "Go Unlimited". It stays on every screen.

**0. Hero (105–879 px)**
- **On screen [seen/DOM]:**
  - Canvas background: warm amber cloud at the left, blue at the right, near-black at the bottom, with small stars.
  - A mono "• FRESH DROPS EVERY FRIDAY →" pill (Space Mono, 256x30 px).
  - Headline in Bricolage Grotesque 88 px / 800, tracking −2.64 px, colour `#f3f5f8`. "tide." uses a gradient text fill.
  - Subline in 16 px Inter.
  - Two pills: white "Go Unlimited →" (158x44 px) and dark outline "Browse the library".
  - An avatar stack with "13,500+ builders shipping faster".
  - A video pill "Why Scrolltide? 3 min 35 sec watch" with a blue play disc.
- **Motion [seen]:** the nebula drifts slowly (stills 1 s apart differ slightly). Moving the pointer to four corners produced no visible reaction.
- **Hover [seen]:**
  - "Go Unlimited" changes from white to a pale-cyan gradient within 100 ms.
  - "Browse the library" brightens its border.
  - The "Why Scrolltide?" pill brightens its border and background.

**1. Tool marquee strip (879–941 px)** **[seen]:**
- A 62 px band with 1 px top and bottom borders.
- Mono caps in about 11 px grey ("TAILWIND ✦ FRAMER MOTION ✦ GSAP ✦ THREE.JS ✦ WEBGL ✦ SHADERS ✦ LENIS ✦ REACT").
- It slides left at about 50 px/s **[approximate]**.
- It divides the hero from the grid.

**2. "The library, at a glance" (941–4,395 px)**
- **On screen [seen/DOM]:**
  - A mono cyan micro-label "149 TEMPLATES IN THE LIBRARY" (Space Mono 12 px), then a 36 px / 700 heading.
  - A right-aligned tab group: Featured, Popular, Recent.
  - A row of filter chips: All, Components →, Sections →, UI →, Shaders →, Landing Page, Hero Section, Portfolio, Ecommerce, 3D Website, Background.
  - A grid of 3 columns × 9 rows. Each tile is about 398x230 px with rounded corners and a 1 px border on `#07080a`.
  - Under each tile: the name in 14 px / 600, the category in 12 px grey, and a "Premium" or "Free" badge.
  - One cell is a text card instead: "THE STUDIO" with "Want a one-of-a-kind site built for you?" and "Start a project →".
  - The grid ends with the pills "Browse all 149 templates →" and "Go Unlimited →".
- **Hover [seen/DOM]:**
  - A dark "Preview →" pill fades in at the tile's bottom-left. Its transition is opacity 0.3 s with `cubic-bezier(0.4,0,0.2,1)`.
  - The tile's video is `paused` until hover. **[inferred]** It plays on hover; I could not confirm because the video host was blocked.
- **Click a chip or tab [seen]:** clicking "Recent" re-sorts the grid with an animated reorder. At 100 ms, tiles are caught mid-move and overlapping; by 400 ms they are settled. **[inferred]** This is a FLIP layout animation.
- **Click a tile:** goes to `/templates/<slug>`. That page shows a 974 px preview, a description, a stack of tags and a "More hero section templates" row.

**3. "One piece at a time", components (4,395–8,084 px)**
- Same frame: micro-label "107 COMPONENTS IN THE LIBRARY", heading, a right paragraph, chips (All, Button, 3D, Navigation, Card, Text, Input, Loader), and a 3x10 grid of 395x247 px tiles.
- Each tile is a single object on a plain field: a glowing pill switch, a phone, a basketball hoop, a toggle full of stars and so on.
- **Hover:** the same "Preview →" pill.
- **Click [seen]:**
  - Opens a modal and sets the URL hash (for example `#c-parapet`).
  - The modal is a 660 px wide dark sheet: preview on top, then the type label, a 26 px name, a 2-line description, "Unlock with Yearly or Lifetime →", a "Why Scrolltide?" pill, heart and share icons, tags, and a "FROM PROMPT TO LIVE SITE" 3-step strip.
  - It fades in over about 300 ms.
- **What the tiles are [copy, seen in posters]:** buttons and cards as tiny worlds. See 2b.

**4. "Motion behind everything", shaders (8,084–11,502 px)**
- Chips: All, Gradient, Halftone, Swirl, Flame.
- Tiles are full-bleed animated shader stills: Tide Swirl (cyan/black ribbons), Rose Swirl, Mono Swirl, Citrus Swirl (orange), Orchid Flow (violet liquid), Noir Mesh, then mesh gradients (Mint Haze, Sunset, Sorbet, Sage…), Halftone and Flame.
- **Click [seen]:** the modal's top area fades from dark to the live shader within about 400 ms (Halftone Tide: red dots swelling on white). It is described as "Screen-print texture that actually moves" **[copy]**.

**5. "Build a page a band at a time", sections (11,502–14,298 px)**
- Chips: All, Features, Pricing, Contact, CTA, Footer.
- Tiles are whole page bands. Many footers are scenes **[copy]**:
  - "Marble Desert" is a footer "set in a sunlit desert film".
  - "Lighthouse Toile" is a footer inside "a living red-ink engraving".
  - "Cosmos Dusk" is a "living painted photograph" with "links pinned in the dark flowers".
  - "Drop a Line" is a giant headline that turns into an inspect mode under the pointer.

**6. "The screen behind the landing page", UI screens (14,298–16,162 px)**
- Chips: Dashboard, Finance, Commerce, and so on.
- Tiles are light-mode dashboard films (Commerce Analytics, Dark Wallet, …).

**7. "Copy, paste, launch.", workflow (16,162–16,919 px)**
- **On screen [seen/DOM]:**
  - A mono "THE WORKFLOW" label and an "01 / 03" counter.
  - A 60 px / 800 heading with "launch." in the tide gradient.
  - Three 400x229 px dark cards, each with:
    - a small round icon chip
    - a 20 px title ("Pick a prompt", "Paste into your AI", "Launch it live")
    - a 14 px grey paragraph
    - a 112 px / 800 ghost numeral "01", "02", "03" at 3% white opacity in the top-right corner
  - A stats bar: "149" (gradient), "8", "13,500+", "100%" in 48 px / 800.
- **Hover [seen]:** a thin cyan line draws left to right across the card top from the icon, and the card surface lightens slightly (about 400 ms).

**8. Footer "Ride the tide." (16,919–18,100 px)**
- **On screen [seen/DOM]:**
  - A radial blue glow at the top centre on `#10212c`.
  - A mono label "START SHIPPING TODAY".
  - "Ride the tide." in 72 px / 800, with "tide." in the gradient.
  - An email field and a "Subscribe newsletter" pill.
  - Logo and blurb, three link columns, and 4 social icons.
  - A ghost wordmark "scrolltide" in 316.8 px / 800, tracking −12.7 px, filled with a vertical gradient from 5% white to transparent, so it dissolves downward.
  - "MADE FOR PEOPLE WHO SHIP".
- **Hover:** the subscribe pill brightens. No reaction to the pointer elsewhere.

**Phone (390x844) [seen]:**
- One column of tiles; the hero headline wraps to 4 lines.
- There is no hover, so the "Preview →" pill never shows and a tap opens the tile.
- The pricing pop-up arrives as a bottom sheet covering the lower half.
- The page grows to 43,640 px.

### 2b. The template and component patterns Lana asked about (sources: [copy] descriptions and [seen] posters)

**Huge display type with a subject breaking through the letters [seen in posters]:**
- **MIRÉ:** a model in red velvet crouches in the gap between giant black condensed "MI" and "RÉ". The letters are about 60% of the frame height, the figure overlaps their inner edges, and her knees sit in front of the baseline.
  - Her head follows the cursor; on scroll she "rises from a crouch and turns a full 360°" **[copy]**.
  - The same model carries on into "a lookbook, manifesto, care label and guest list" **[copy]**.
- **ODDBALL:** a platypus in a bucket hat holding a basketball stands on top of a lime "ODDBALL" wordmark that fills the bottom 45% of the frame. Its body covers the top of the letters.
  - It "dribbles and dunks on the scrollbar as the wordmark falls away" **[copy]**.
  - The game continues into a "flip-card roster", a "whiteboard playbook" and a "shot-clock hero" **[copy]**.
- **RED LINE (Marea):** a helmeted rider between "RED" and "LINE", with the type behind her shoulders. The cursor "pours real liquid" over her visor **[copy]**.
- **MOLT:** a glass figure stands in front of a chrome "MOLT" wordmark and refracts it; on scroll "the glass gives way cell by cell to the real jacket" **[copy]**.
- **PERCH:** parakeets walk across a giant green serif "PERCH". "click to drop a crumb or flick to throw it far" **[copy]**.
- **murk:** lily pads and a goldfish over a serif "murk"; the cursor is an earthworm the fish hunts **[copy]**.
- **Frostpaw:** a cat's goggles and ears break over "NEW SUMMER COLLECTION"; hover dissolves its outfit through a feathered circle **[copy]**.
- **Ephyra:** a jellyfish between italic "…io built to"; it "swims up through frosted-glass project hoops and down to a contact floor" **[copy]**. The character travels through every section.
- **Otis:** a 3D cartoon head bursts out of a blue circle under "HEY, I'M OTIS"; you can "grab his cartoon face and pull it like taffy" **[copy]**.

**Buttons that are tiny scenes or glowing objects [copy, seen in posters]:**
- **Glowcap:** a day/night switch "with a pixel-art moss terrarium inside", where "fireflies climb out of the moss at dusk".
- **Lodestone:** a dark-mode switch full of ferrofluid. It glows violet in the poster, labelled "AFTER DARK", and has a spiky black drop.
- **Primer:** a loader with "a pixel-art paint crew inside" who "stall at 99% watching paint dry"; "Hold it to hurry them".
- **Ink Button:** "pull away from it and strands stretch out… and snap".
- **Myriad:** a switch "poured from tens of thousands of grains" that rebuilds itself as a dial.
- **Swish:** a file uploader "you shoot like a basketball".
- **Pip:** "a soft raymarched figure" that watches the pointer, "grins when poked and dozes off when ignored".

**Collectible cards [copy, seen]:**
- **Bonbon:** a foil pack; "tear it along the top", and "five holo cards with raymarched toy characters" tumble out "and tilt under your pointer". The poster shows five pastel holo cards in a row.
- **Midwater:** a bento where cards "rise in one after another" with a pulsing jellyfish in glass orbs.
- **Signal:** LED-matrix cards ("a comet you can pull off its orbit").
- **Helio:** cards that "flip in 3D to its cost side".
- **Receipt Printer:** a pricing card that prints a receipt you can tear off.
- **Crumple Reveal:** paper balls that smooth out into photos.

**Shader backgrounds:** swirl, mesh, halftone and flame families, each a live GPU background (see section 4 above).

### Section transitions (homepage)
- Hard cuts on one constant near-black (`#07080a`). Each section starts with the same micro-label, heading and chips header, so the repeated header is the divider.
- The marquee strip divides the hero from the grid.
- A radial glow opens the footer, and the ghost wordmark dissolves it at the bottom.
- The gradient word ("tide.", "launch.", "149", "tide.") marks the hero, the workflow and the footer as a set.

### Content presentation
- **Work items:** moving tiles, not thumbnails. Each tile is a film of the piece (paused until hover), with a "Preview →" pill and a Premium/Free badge. Components and shaders open in a hash-addressed modal with a live preview.
- **About:** a "THE STUDIO" text card placed inside the work grid as one of the tiles ("Want a one-of-a-kind site built for you?").
- **Experience and process:** "Copy, paste, launch." uses three cards with giant ghost numerals and a gradient stat row.
- **Footer:** a headline scene ("Ride the tide.") over a glow, ending in the dissolving 317 px wordmark. In the sold footers, the footer is a scene with the links "resting in the sky" **[copy]**.

### What makes it feel rich, not plain
1. **Every tile moves.** 109 looping preview films on one page. Rebuild: `<video muted loop playsinline preload="none">` with a poster; play when hovered or in view (IntersectionObserver), pause when off-screen.
2. **Subject in front of giant type.** Three layers: wordmark behind (60%+ of frame height, condensed or serif, split around the subject), a cut-out subject (transparent PNG/WebM) overlapping the letter edges, and small UI on top. Rebuild: a CSS grid with the wordmark at `z-index:1`, the subject at `z-index:2`, and `margin-top: -15%` so the subject covers the letter tops.
3. **One recurring character across sections.** The MIRÉ model, the ODDBALL platypus and the Ephyra jellyfish appear in each band. Rebuild: one sticky or absolutely moved character whose pose or position is keyed to which section is in view.
4. **Controls are little worlds.** Switches, loaders and buttons hold a scene (terrarium, ferrofluid, paint crew). Rebuild: a pill-shaped `overflow:hidden` container holding a pixel-art or canvas scene whose state (day/night, progress) is the control's value.
5. **Collectible, tiltable cards.** A holo foil card that tilts toward the pointer. Rebuild: `rotateX/rotateY` ±12° from the pointer, plus a moving `linear-gradient` sheen whose position follows the pointer.
6. **One signature gradient word.** The same three-stop gradient appears on one word per key section. Rebuild: `background-clip:text` on a single word per heading.
7. **Ghost type.** 112 px numerals at 3% opacity behind each card, and a 317 px wordmark fading to transparent at the bottom. Rebuild: huge, very low-contrast text as texture behind the content.
8. **Hash-addressed modals.** Each object opens a sheet with a live preview, and the URL updates (`#c-name`). Rebuild: a dialog plus `history.replaceState`.

---

## Cross-site list: mechanics both sites share

| Mechanic | Ayush: sections | Scrolltide: sections |
|---|---|---|
| A living hero backdrop (canvas/WebGL) that moves without input | Hero (Spline scene, animated sky), sky behind every section | Hero nebula shader; shader section; shader modals |
| Each work item is an object with a playing screen or film, not a static thumbnail | "Stuff I've worked on" (console screens loop a blank glow, then the image) | Library, components, sections and UI grids (looping preview films) |
| Hover changes one detail inside the object | Console button turns orange; book spine turns to its cover; "Send a Mail" gains a sparkle | Tile shows a "Preview →" pill; workflow card draws a cyan top line; component scenes react **[copy]** |
| Very large display type used as a layer behind content | Hero 224 px marquee behind the computer | Template wordmarks behind subjects; 112 px ghost numerals; 317 px footer wordmark |
| Pointer-following subject | Hero computer turns and mug eyes track the cursor | MIRÉ head, Whisker Ops head, Pip **[copy]** |
| A continuous marquee band | Hero (behind the computer) | Tool strip between hero and library |
| The footer as a scene, not a link list | Meadow hill with icons and butterflies | "Ride the tide." glow plus dissolving wordmark; sold footers are landscapes with links in the sky **[copy]** |
| One recurring motif that ties sections together | Sky colour, clouds, balloon, galaxies across all sections | Gradient word "tide." / "launch." / "149" / "tide."; the recurring character in templates **[copy]** |
| A sticky or held header frame | Fixed left nav; held section headings (works, journey) | Sticky top nav; the same micro-label, heading and chips header on every section |
| A designed page or modal transition | White iris reveal into case pages | 300 ms modal fade with a hash URL; animated grid reorder on filter |
