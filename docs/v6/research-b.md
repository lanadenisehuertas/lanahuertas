# Research B: Himani Bindal, Prerna Athia and Ishant Periwal, studied first-hand

Researched on 2026-11-17 with Playwright driving the installed Chrome, at 1440x900 and 390x844. On each site I did the following:

- I scrolled every page in half-screen steps.
- I recorded video and cut bursts of frames every 100 to 150 ms wherever something moved.
- I hovered over each kind of interactive element, with a capture before and after.
- I clicked into at least two case studies.
- I read the network log and the computed styles.
- I read the motion values out of each site's own shipped code: Framer's appear-animation JSON and page modules, and the hand-written CSS on Ishant's pages.

**Blocks:** Medium showed a Cloudflare "performing security verification" page. I stopped on Medium there and did not retry. This affects two of Himani's case studies (Rizzl and Manifest.ai) and Prerna's donor-app case study. Everything else loaded without a block or a CAPTCHA.

**Where the captures are:** all captures sit under one folder. It is a temporary scratchpad and a reboot may clear it:
`C:\Users\Lana\AppData\Local\Temp\claude\a106e1d8ce434dbd\493cf6da-5ec2-4eb5-9ea2-65787c2c5136\scratchpad\v6\`
Below, `v6\…` means a path inside that folder. Files named `sheet-*`, `seq-*` and `burst-*` are contact sheets, so open those first. The scripts are in `v6\scripts\` and start with `b_`.

**Evidence labels:**
- **[seen]** means I saw it in frames.
- **[code]** means I read it from the DOM, the CSS, the JS or the network log.
- **[measured]** means I calculated it from frames, scroll positions or timestamps.
- **[inferred]** means my reading of something I could not fully confirm.

When a site sets a word in capitals, I quote it here in sentence case and say that it is set in capitals.

---

## 1. Himani Bindal

### 1.1 What it is

The real site is https://himanibindal.com/. It is a one-page Framer site for a founding product designer who trained as an architect. It tells their story as travel paper: a passport, a spiral notebook, notepad cards held on with washi tape, and a red envelope over a beach.

The page is 7,804 px tall at desktop. The tab title is "Himani's Portfolio". There are no case studies on the site itself. The project links go out to Medium, Wix and Behance [code].

### 1.2 Flow

**Desktop, screen by screen.** The sheets are `v6\himani\sheet-scroll-d.jpg` (half-screen steps) and `v6\himani\sheet-fine-d-0.jpg` to `-4.jpg` (150 px steps). The stills are in `v6\himani\scroll-d\`.

1. **Intro**
   - Captures: `v6\himani\burst-intro-d.jpg`, `burst-intro-stamps-d.jpg` and `burst-intro-open-d.jpg`.
   - The screen is a textured mustard paper field, roughly `#bb9a1a`.
   - About fifteen vintage postage stamps pop in at scattered spots.
   - A small red passport with a postmark sits in the middle. Its cover word, "portfolio", is set in capitals.
   - The passport grows in two steps between about 2.3 s and 2.75 s, then cuts to its open inner pages at about 3.1 s [measured].
2. **The open passport (the real hero)**
   - The data page has typed fields: forename Himani, surname Bindal, residence Gurgaon, a photo and "date issued April '26".
   - A blue round stamp reads "certified" (set in capitals). Its ring text reads "founder / architect / designer".
   - The facing page is titled "Identification as of late". It holds six illustrated stamps of things they love: a McLaren, Catan, California Cupcakes, a beagle named Toto Wolff, Diet Coke and the book Shoe Dog [seen].
3. **"Hello!" paragraph**
   - The intro paragraph sits in a soft radial spotlight, flanked by six watercolour doodle icons.
   - As you scroll, its words fill from grey to dark ink one by one.
   - The paragraph is held in a 900 px sticky box inside a 1,140 px section, so it pins for about 240 px of scroll while the fill runs [code, measured].
4. **"Take a look"**
   - A short line, "the best work I've done & things I've learned", sits over a red torn-tape button. The button's label, "download resume", is set in capitals.
5. **Spiral notebook**
   - A kraft-paper notebook holds three project rows: Rizzl, Manifest.ai and Neuliv.
   - Each row has a title, a line of text and a tilted screenshot. The rows link out to Medium and Wix.
6. **Torn paper edge into a white dotted section**
   - The section is titled "Some more cool things I've done".
   - A ticker of notepad cards with pink washi tape runs across it: CoolAnt, Sampark, Neuliv, Blu Smart and Kaarigari, all linking to Wix.
   - A second ticker, "…and from my stint as an Architect!", links to Behance.
7. **Torn edge into a beach**
   - The section is titled "Life outside of pixels / the last year in a nutshell! (or envelope)".
   - The background is one tall photograph, 2,799 px, that runs from sky to sea to sand.
   - A red envelope stays pinned: a 900 px sticky box in a 1,620 px section, so it holds for about 720 px of scroll [code, measured].
   - Because the beach scrolls behind the pinned envelope, you feel you are sinking from sky to sea to sand.
   - Items spring out of the envelope one after another: an app screenshot, polaroids, Coldplay tickets, the beagle, a business-school photo, a Formula 1 trophy and food. Capture: `v6\himani\seq-envelope-enter.jpg`.
8. **Footer postcard on the sand**
   - The postcard has a paperclip and a "What I'm looking for" list with tick boxes.
   - It also carries an India Post Delhi stamp and a "get in touch" postmark.
   - The contacts are email, phone, LinkedIn and résumé, signed off "tailored with love <3".

**Phone** (`v6\himani\sheet-scroll-m.jpg`, `burst-intro-m.jpg`, `phone-menu.jpg`):
- The passport shrinks into an otherwise empty mustard hero.
- The sections stack in the same order.
- The menu button opens a blurred band with four links at once, with no animation [seen].

### 1.3 Motion

| What moves | Trigger | Duration and easing | Distance |
|---|---|---|---|
| Stamps on load | Page load | Opacity spring, 0.4 s, bounce 0.2. Delays of 0, 0.1, 0.4, 0.8 and 1.2 s [code] | Fade with a slight pop, no travel [seen] |
| Passport cover | Load, at about 2.3 s | Two scale steps over about 0.45 s, then a hard cut to the open pages at about 3.1 s [measured] | Grows to roughly double its size [seen] |
| Hello paragraph | Scroll-linked | Each word fills grey to ink as it reaches the reading line. The whole fill runs over about 240 px of pinned scroll [measured] | No movement, colour only |
| Notebook row hover | Pointer enter | Image tilts by ±1° and fades to 0.7 or 0.8 opacity [code] | About 1° of rotation |
| Résumé tape button | Hover | Rises with a spring, 0.4 s, bounce 0.2 [code] | 5 px up |
| Ticker one | Always on | 101 px/s to the left. On hover it slows to 51 px/s instead of stopping [measured] | Endless |
| Ticker two | Always on | 127 px/s to the left, 63 px/s on hover [measured] | Endless |
| Envelope contents | Section enters view | Springs of 1.5 s with delays from 0 to 1 s. The items then drift slightly [code, seen] | Each item travels roughly 100 to 300 px out of the envelope, judged by eye from frames [inferred] |
| Certified stamp | Unclear | About 0.5° in 0.68 s, so it is either static or a very slow spin [measured, inconclusive] | Not applicable |

Framer's runtime checks `prefers-reduced-motion` for its appear effects [code]. I did not check whether the tickers stop under reduced motion.

### 1.4 Interactivity

The hover captures are `v6\himani\hover-nav.jpg` and `hover-misc.jpg`, the bursts are in `v6\himani\hover-dmotion\`, and the ticker pairs are in `v6\himani\extra\` (for example `t1-hover-full.png`).

- **Nav (Home, About, Work, Contact):**
  - On hover the word disappears. A small red hand-drawn doodle takes its place: a house, a face, a laptop or a phone.
  - The label is set in an arc under the drawing, using Framer's circular-text component [seen, code].
  - This is the most charming detail on the site.
- **Notebook rows:**
  - A paper sticker shaped like a big quotation mark follows the pointer, and the screenshot tilts.
  - The system cursor stays visible [seen].
- **Ticker cards:**
  - A ticket-stub sticker that reads "check it out" (set in capitals) follows the pointer.
  - The ticker drops to half speed [seen, measured].
- **Postcard:** a tick box fills light red, and the email link fades [seen].
- **No hover response:** the passport stamps and the passport fields [seen].

### 1.5 Animated screens

- **Home page:**
  - The home page has no device screens and no video at all.
  - The network log shows 65 AVIF images and 13 WebP images, and no media requests [code].
  - The page feels alive through the tickers, the pinned envelope, the drifting contents and the pointer stickers, not through screens.
- **Neuliv case study on Wix** (`v6\himani\sheet-cs-wix-neuliv-0.jpg` to `-2.jpg`):
  - **Media count:** 21 AVIF images, one GIF of 5.3 MB at 487x304, and two MP4 files totalling 25.2 MB [code].
  - **Screen recording:** a 45 s autoplaying, muted recording sits in a video player with its controls showing.
  - **Phone video:** a 200x398 phone video.
  - **Final product video:** a 175 s, 22 MB "final product video" sits in a laptop frame with player controls [code, seen].
  - **Loops:** the GIF loops. The videos do not, as far as I saw.
  - **Overall feel:** this is a stock Wix template feel, and it is far below the home page.

### 1.6 Branding system

- **Type** [code]:
  - THICCCBOI is used for nearly everything. Headings are Bold 700 at 44 px with -1.76 px tracking (-0.04em). Medium, Semi Bold, Extra Bold and Black are also loaded.
  - Minims and Inter are loaded as well.
- **Colour** [code]:
  - Red `#ca3400` is the accent: passport, envelope, nav doodles and tape.
  - Mustard `#bb9a1a`, blue `#335cee`, navy `#1d278e`, grey `#d9d9d9` and white.
- **Materials:**
  - Textured paper, kraft card, torn edges, washi tape, postage stamps, postmarks, polaroids and a paperclip.
  - Each section is a different paper, and the torn edges join them, so there are no boxes or rules between sections.
- **Voice:** chatty and personal, for example "(or envelope)" and "tailored with love <3".

### 1.7 Case-study structure

- **Medium (Rizzl, Manifest.ai):** blocked by Cloudflare. I stopped there (`v6\himani\cs-medium-rizzl\` holds only the block page).
- **Neuliv (Wix)** (`v6\himani\cs-wix-neuliv\`):
  - The heading reads "Neuliv Designed and Delivered" in Helvetica at 100 px.
  - Then the overview, as three centred icon columns (client, date and product category).
  - Then: team structure, a "how might we" line over a photo, a stakeholder table under "Define / Building empathy", personas, a journey map, pain points, the brand identity, a style guide, sprint planning, the screens, and the final product video.
- **BluSmart (Wix)** (`v6\himani\cs-wix-blusmart\`, `sheet-cs-wix-blusmart-0.jpg` to `-2.jpg`):
  - It follows the same template: a three-column overview, design-process icons, personas and competitor analysis.
  - It has 18 images and no motion.
- **What this shows:** process is shown as a stack of standard sections. The playful world of the home page stops at the link.

### 1.8 Steal for Lana

1. **A pinned object over a scene that keeps moving.**
   - Himani's envelope stays still while one tall beach scrolls behind it.
   - For the sleeping moon, the page can sink through one night: moon sky, then treetops, then a lily pond, then the ground at the footer.
   - Each section keeps its door-object pinned while the scene passes behind it.
   - This joins the sections without boxes or bands, which is what makes the rest of the page feel part of the hero.
2. **Things that spring out of a container and then drift.**
   - Lana's contact envelope can open, and a letter, a pressed lily and a moth stamp can spring out.
   - Use staggered delays of 0 to 1 s, then a slow drift of a few pixels.
3. **Nav words that turn into small drawings with a curved label.**
   - Lana's nav can swap each word for a tiny engraved version of its door-object, with the label curved under it.
   - This is ornament without a border. Keep the text in the DOM for screen readers.
4. **A ticker that slows to half speed on hover instead of stopping.**
   - This suits a run of brand pubmats or posters.
   - Add a visible pause control, because moving content that runs longer than 5 s needs one under WCAG 2.2.2.
5. **An illustrated "as of late" grid of personal things.**
   - Six engraved stamps of what Lana loves would fit the About mirror better than a list of facts.
6. **A small paper sticker that trails the pointer over a card.** This one is optional.
   - Keep it under about 90 px, show it only over cards, and leave the system cursor visible.
   - Lana dislikes big custom cursors, so test this before keeping it.

### 1.9 Avoid

- **Case studies that leave the site for Medium or Wix templates.** The world ends at the click, and Medium can block visitors.
- **Overview grids with three centred icon columns.** This is on Lana's list of things that read as AI.
- **Video in a player with visible controls, or in a laptop frame,** plus a 5.3 MB GIF and a 22 MB video in one case study.
- **A phone hero that is mostly empty colour** around a small object.
- **Labels set in capitals** on buttons and stickers.
- **A grey unfilled state in the word-fill paragraph that fails contrast.** If Lana uses a word fill, the unfilled words still need 4.5:1, or the effect should be kept to large text.

---

## 2. Prerna Athia

### 2.1 What it is

The real site is https://prernaathia.framer.website/. It is a Framer site for a product designer at a crypto app, built around a green wallet that holds their cards. The theme is cream paper with a faint grid, an italic serif name and sticky notes.

- **Size:** the page is 11,252 px tall at desktop.
- **Scrolling:** it uses Lenis smooth scrolling [code].
- **Leftovers:** the tab title is still Framer's default, "My Framer Site", and a "Made in Framer" badge sits in the corner [code, seen].

### 2.2 Flow

The sheets are `v6\prerna\sheet-scroll-d.jpg` and `sheet-scroll-m.jpg`. The stills are in `v6\prerna\scroll-d\` and `scroll-m\`.

1. **Hero** (`v6\prerna\burst-intro-d.jpg`, `recon-top.png`):
   - A small letter-spaced label, "design journey", is set in capitals.
   - Below it, the large name "Prerna Athia's" is in italic DM Serif Display, with four-point star sparkles around it.
   - A green wallet holds four cards. Each card peeks out of the wallet:
     - a photo of them;
     - a note: "currently working as a product designer at Mudrex, ex GrowthSchool";
     - a phone screenshot for Outskill;
     - a map card for Bengaluru.
   - A greeting inside the wallet cycles through Hello, नमस्ते, こんにちは, ನಮಸ್ಕಾರ, Ciao and Hola.
   - A down arrow bobs under the wallet.
   - The hero fades in late, at about 2.7 to 3.45 s after load [measured].
2. **About**
   - The about text is a sentence with small pictures set inline among the words:
     - a "product designer" sticker;
     - a tea emoji;
     - a scenic photo.
   - Under it is a bento of cards:
     - "For sanity", with travel and food polaroids;
     - "Learning", with a heap of skill pills;
     - "Reading", with Design as Art by Munari;
     - "Writings".
3. **Work**
   - **Mudrex:** bordered cards, each with a phone, year, tag, title, bullets, a metric (70 to 80 percent, 500M+) and a sand-coloured "view project" bar.
   - **GrowthSchool:** an "app rebranding" project with app store badges.
   - **Others:** the Outskill home screen, a product card, a Spotify podcast and the donor app.
4. **Memory lane:** a photo grid with italic serif captions.
5. **Get in touch**
   - Sticky notes are pinned to a board, next to a big, chunky 3D "book a call" button.
   - The footer is a large serif "Prerna Athia" with social buttons.

**Phone:** the same order stacks into one column. The wallet stays the hero, and the bento collapses into a list [seen].

### 2.3 Motion

The values come from the appear JSON and the page module [code]. The bursts are in `v6\prerna\hover-dmotion\`.

| What moves | Trigger | Duration and easing | Distance |
|---|---|---|---|
| Greeting cycler | Always on | Each word holds about 1.2 s, then rolls up in 0.3 to 0.4 s. The full cycle takes about 9.6 s [measured] (`burst-greeting-cycle.jpg`) | One line height, vertical |
| Down arrow | Always on | Loop, mirrored, spring 0.7 s, bounce 0.3 [code] | 10 px |
| Wallet cards | Hover | Spring 0.45 s, bounce 0.25 [code] | Scale 1.1, rotate ±9°, x of 29 or -11 px, y of -60 or -45 px |
| Section content | Scroll into view | Opacity from 0.001, springs of 1 to 2 s, bounce 0.2 to 0.3, stagger delays 0 to 0.4 s. It replays each time you pass, because `animateOnce` is false [code] | y of 40, 60 or 80 px, or x of -40, -60 or -80 px |
| Hero | Load | Fade, landing about 2.7 to 3.45 s after load [measured] | None |
| Smooth scroll (Lenis) | Wheel | A 400 px wheel step covers 44 percent at 100 ms, 72 percent at 200 ms, 85 percent at 300 ms and 96 percent at 500 ms, and settles at about 900 ms. This matches the default lerp of about 0.1 [measured] | Not applicable |

### 2.4 Interactivity

The captures are `v6\prerna\hover-wallet.jpg`, `hover-about.jpg` and the pairs in `v6\prerna\hover-dmotion\`.

- **Wallet cards:**
  - Each card rises out of the wallet and tilts.
  - The photo card reveals a handwritten caption, "Hey, it's me" [seen].
- **Inline sentence pictures:**
  - The "product designer" sticker swaps to an illustration of them.
  - The tea emoji swaps to the word "tea" on a red label.
  - The scenic chip grows [seen].
- **Bento:**
  - The travel and food polaroids fan out.
  - The Munari book lifts [seen].
- **Nav:** a fixed white pill nav with a "P." logo. A hovered item gets a soft background [seen].
- **Book a call:** the chunky button presses down [seen].

### 2.5 Animated screens

- **Home page:**
  - The phones on the home page are still images.
  - The network log shows only AVIF, WebP and SVG images, with no media requests [code].
  - The site feels alive through the greeting cycler, the bobbing arrow, the hover springs and the replaying scroll appears, not through screens.
- **Case studies:** these are Figma Slides decks. The "view project" bars open them.
- **Homescreen revamp deck** (`v6\prerna\sheet-deck-homescreen.jpg`, `v6\prerna\deckprobe\homescreen-s02-0.png` and `-3.png`):
  - Slides 1, 2, 8 and 9 hold playing screen recordings.
  - Each shows three phones side by side, scrolling the same screen in step [seen, measured with frame diffs].
  - **Technique:** recorded screen video inside the slide. I did not log the file type the deck streams [inferred].
  - **Loop:** yes, the recordings repeat [seen].
  - **What they show:** the home-screen redesign, scrolled in real time.
  - **Frame:** plain rounded phone screens with no hardware frame, three in a row, centred on the slide.
  - **Flaws:** the desktop arrow cursor shows inside the phone recordings, and a "Banner" placeholder is still visible [seen].
- **Futures order placement deck** (`v6\prerna\sheet-deck-futures.jpg`): 18 slides. The slides I probed did not move [measured].

### 2.6 Branding system

- **Type** [code]:
  - DM Serif Display for display; the italic sets the hero name.
  - Bricolage Grotesque for body.
  - IBM Plex Sans, Spline Sans and Inter as utility faces.
  - Tiro Devanagari Hindi and Noto Sans Kannada, loaded only for the greetings.
- **Colour:**
  - Cream `#fcf8f0` with a faint grid and diamond sparkles.
  - An orange-red accent, about `#e05a3a`.
  - An olive-green wallet and sand-coloured buttons [code, seen].
- **Materials:** a leather wallet, polaroids, sticky notes, pins and a chunky 3D button. These are softer than Himani's, but the work section falls back to bordered cards.

### 2.7 Case-study structure

- **Futures order placement** (18 slides). The sequence is:
  1. Context, goals and challenges.
  2. Insights and terminology.
  3. The issues with the old flow.
  4. References, including a hand-drawn wireframe.
  5. Flows.
  6. The final design.
  7. Results.
  - The slides are text-heavy serif pages.
- **Homescreen revamp** (9 slides): the same arc, shorter, carried by the three-phone recordings.
- **Donor app:** links to Medium, which was blocked. I stopped there.
- **What this shows:** process is shown as a talk deck, so the site's charm does not carry into the work.

### 2.8 Steal for Lana

1. **Cards that rise out of a holder and tilt on hover.**
   - This is a near-exact fit for the seed-packet holder (Brands): each packet rises and tilts, showing one brand.
   - Use about 0.45 s with a light spring, a rise of 45 to 60 px and a tilt under 9°.
2. **A one-line greeting that rolls through words.**
   - For a night world, use something like "Magandang gabi", "Good evening" and "Kumusta".
   - Hold each about 1.2 s and roll in about 0.35 s.
   - Show one still word under reduced motion. Mark the cycler `aria-hidden` and give screen readers a single static greeting.
3. **Small pictures set inside a sentence that swap on hover.**
   - For About, Lana's sentence can carry tiny engraved images (a moth, a lily, the moon) that wake into colour on hover.
   - These are pictures in the line of text, not text pills.
4. **Polaroids that fan out on hover.** These work for a stack of posters or for personal photos in About.
5. **Several phones scrolling one product in step.**
   - Where a live embed is too heavy, three phones of the same app scrolling together show a flow quickly.
   - Record them without a cursor and with real content.

### 2.9 Avoid

- **Bordered work cards** with bullets, metrics and a "view project" bar.
- **A heap of skill pills.**
- **A letter-spaced label in capitals over the name.**
- **The "Made in Framer" badge and the default tab title.**
- **Scroll appears that replay every time you scroll past.** With 40 to 80 px of travel on 1 to 2 s springs, the page never settles.
- **Smooth-scroll hijacking.** It takes about 900 ms to settle after each wheel step, which feels floaty and can upset people with vestibular disorders.
- **A hero that waits about 3 s before it appears.**
- **Case studies as external slide decks.**
- **Screen recordings that show a desktop cursor or a placeholder.**

---

## 3. Ishant Periwal

### 3.1 What it is

The real site is https://ishantp.com/, titled "Ishant's Computer". It is hand-built, using GSAP 3.12.2, Tailwind from a CDN and three.js 0.157 with a glTF loader [code].

- **Who:** a principal product designer at Titan Email who previously worked at Zeta.
- **Idea:** the site is a computer you switch on. A power button boots an old-school operating system, and the camera pulls back to a 3D isometric desk diorama that you explore.
- **Case studies:** separate hand-made pages on `ishantperiwal.github.io`.

### 3.2 Flow

1. **Landing** (`v6\ishant\recon-top.png`, `seq-landing-scroll.jpg`):
   - **The room:** a dark room drawn in white lines, with a hanging lamp and its light cone, picture frames of cars, a clock, a bin and a ball.
   - **Live clock:** it reads "Bangalore 1:09 AM" [seen].
   - **Centre card:** it reads "Ishant's computer" (set in capitals). It holds a large power button inside a ring of slowly turning green text: "principal product designer at Titan Email · previously at Zeta".
   - **Under the button:** a mute toggle, "Hi, I am Ishant", a short bio, and résumé, LinkedIn and X links.
   - **Inside the card:** the card scrolls on its own to Featured work, then "8+ years experience" (Titan, Zeta, GeeksforGeeks), then a doodle footer. The footer has a floppy disk and a handwritten note, "More about me in the computer".
   - Featured work has four cards: Zapp Account, Motion Ops, IPL, and a CRM tool marked in progress.
2. **Boot** (`v6\ishant\seq-boot-1s.jpg`, `v6\ishant\hover-dboot\burst-boot.jpg`):

   | Time after the power click | What you see |
   |---|---|
   | 0.4 to 0.7 s | The ring fills green, then the screen flashes to black. |
   | 1.2 to 3 s | A CRT boot log in mono type, with a "Capsule Corp" logo. |
   | About 5 s | A "fairOS" splash with a progress bar. |
   | About 6 s | A blue "Welcome" screen. |
   | About 7 s | A desktop with a green-hill wallpaper and icons: my_documents, my_computer, recycle_bin, internet and figma. |
   | About 8 s | The camera pulls back to show the CRT in a room. |
   | 9 s on | The 3D desk [measured]. |

3. **The desk** (`v6\ishant\hover-ddesk\boot-15.png`, `v6\ishant\hover-dmenu\fun-4.png`):
   - **On the desk:**
     - a cream "Capsule Corp" computer with stickers (a Dragon Ball, a Pokéball, pixel hearts and a sticky note);
     - a keyboard and mouse;
     - a blue mug with steam;
     - an AE86 toy car;
     - a yellow vase of daisies with a 3D bee flying around it;
     - a green dinosaur figure;
     - a stack of motion cards;
     - a pencil and a ruler.
   - **On the walls:** blinds, a clock, shelves with a speaker and books, and an ID badge, all drawn in white lines.
   - **Text printed on the desk:** "Ishant, product designer" and the menu (work, fun, résumé, chat), set in capitals in isometric perspective.
   - **Controls:** a zoom button top left and a sound button top right.
   - **Music shortcuts:** a hint lists space for play and pause, N for the next track and B for the previous one.
4. **Going into a menu item** (`v6\ishant\hover-dmenu\burst-open-work.jpg`, `burst-open-resume.jpg`, `work-3.png`, `resume-4.png`, `chat-4.png`):
   - Clicking "work" dollies the camera from the isometric view to face the computer. It takes about 2.4 to 2.7 s [measured].
   - On the way it passes a cork-grid wall with pinned notes ("remember paint?", "camera roll", "side projects") and a polaroid captioned "Outstanding!".
   - The CRT then fills the screen, and an OS window opens about 0.1 to 0.3 s later.
   - **Work** opens `my_computer\work` with three folders: zeta [2021–2026], titan email [2026–now] and geeksforgeeks [2019–2021], plus the hint "3 items, double click to open".
   - **Messenger:** another click in my session landed on a Messenger window:
     - The first chat is "Me (Ishant)", with a guided-tour message.
     - It offers three quick links: Building Zapp Account, Lottiemon and Motion Design Guidelines.
     - The input reads "Send me a message, it actually reaches me…".
     - The contact list shows colleagues with roles: Anoop, design manager; Vibhore, "the wingman"; Aditya, designer; Manoj, lead product manager. I take these to be testimonials told as chats [inferred].
   - I could not confirm which desk word opens which window in every case, because the label positions change after the camera moves.
   - After you leave, the CRT on the desk shows a lock screen with an avatar, as if the computer went to sleep [seen, `zoom-3.png`].
5. **Phone** (`v6\ishant\sheet-scroll-m.jpg`, `seq-phone-boot.jpg`):
   - The landing card fills the phone and scrolls inside itself, 3,129 px of content in an 844 px box [code].
   - The order is: power button, résumé and LinkedIn, the intro, Featured work cards with small mono tags set in capitals, the experience list, and "Get in touch" with three icon buttons over a dark hill with specks of light.
   - **Tapping the power button:** it runs the boot log, which then reports an error in character:
     - "failed to initialize 3D environment, experience not available on phone";
     - a sad pixel computer;
     - "open ishantp.com on desktop";
     - "tap to return" (all set in capitals) [seen].
   - The root element has the classes `has-phone-dither` and `is-grain-running` [code].

### 3.3 Motion

| What moves | Trigger | Duration and easing | Distance |
|---|---|---|---|
| Power button press | Pointer down and up | Press 0.08 s, release 0.25 s, from CSS custom properties [code] | A small press-in |
| Ring of text | Always on | A slow continuous turn [seen] | Rotation |
| Boot sequence | Power click | About 9 s in total before the desk can be used [measured]. The bloom fade uses `power2.inOut` [code] | Full-screen scene changes |
| Background grid build | Load | `cubic-bezier(0.2, 0, 0.8, 1)` [code] | Grid lines draw in |
| Desk camera | Pointer move | Follows the pointer with a soft lag [seen] | 25 to 40 px of parallax [measured] |
| Camera dolly into the computer | Menu click | About 2.4 to 2.7 s, eased in and out [measured] | From the isometric desk to a full-screen CRT |
| OS window | After the dolly | Appears in about 0.1 to 0.3 s [measured] | Pops in place |
| Bee, steam, clock | Always on | Continuous loops [seen] | Small |
| Case-study reveals | Scroll into view | 0.45 s `cubic-bezier(0.22, 1, 0.36, 1)`; 0.9 s `cubic-bezier(0.2, 0.7, 0.2, 1)`; 2.1 s `cubic-bezier(0.16, 0.7, 0.2, 1)`; a filter and opacity reveal over 1.9 s and 1.3 s [code] | Fade and rise |
| Case-study page entry | Load | `page-reveal-in` 1.15 s `cubic-bezier(0.16, 1, 0.3, 1)`; `app-open` 0.65 s [code] | Fade and rise |
| Case-study ambient loops | Always on | Background orbs drift on 11 s and 14 s loops; `hero-float` 5 s; `z3d-float` 9 s; arrow-key hint 4 s [code] | A few pixels |

### 3.4 Interactivity

The captures are `v6\ishant\hover-scene.jpg`, `clicks-scene.jpg`, and the pairs in `v6\ishant\hover-dscene\` and `hover-dboot\`.

- **Object tooltips:**
  - Each desk object shows a tiny mono tooltip beside it on hover, for example "Take a sip" on the mug and "1983 Toyota AE86 Trueno" on the car.
  - The tooltips are one line, small and quiet [seen].
- **ID badge:** a line drawing that turns into a real photo on hover [seen]. This is the closest thing to Lana's dither-to-colour wake.
- **Menu words on the desk:** brighten and turn bold on hover [seen].
- **Clicks on objects:**
  - The car gets a small nudge.
  - The orange power button on the computer shuts it down: the room dims and the CRT shows "shutting down".
- **Sound:**
  - About 25 sound files are loaded: boot, click, hover, select, horn, zoom, floppy, bomb, wobble, space bar, cup slide, sip, pour, six key presses, focus mode, fan ambience, car start and a welcome clip [code].
  - A mute toggle is always in view.
- **Cursor:** the cursor stays the system cursor [seen].
- **Menu bar:** after zooming in, a pill menu bar (work, fun, résumé, chat) sits at the top centre like an OS menu bar [code, seen].

### 3.5 Animated screens

This is the strongest of the three for animated screens. The captures are in `v6\ishant\hover-dcs\` and `v6\ishant\seq-zapp-solve.jpg`.

- **Zapp Account case study** (`burst-zapp-proto-0.jpg` to `-6.jpg`, `zapp-solve-08.png`):
  - **Technique:** live HTML prototypes in iframes, not video. There are seven of them at 291x604: a carousel, video KYC, an intro animation, and the Zapp home screen with its actions, quick and rewards sections [code].
  - **Placement:** they sit in one fixed phone (`aside.execution-phone-floating`) on the right that stays put while you scroll.
  - **Rail:** on the left, a vertical rail with dot milestones lists the steps. The active step card turns solid navy with an arrow notch pointing at the phone, and the phone swaps to that step's prototype.
  - **What the prototypes do:** they keep moving on their own. For example, the 3D shopping-bag illustration bobs a few pixels [seen].
  - **Loop:** yes.
  - **Frame:** a clean black phone frame.
  - **Count:** one phone at a time.
  - **Network:** 33 PNGs (23 MB), 13 Lottie JSON files, 22 HTML documents for the iframes and one GIF [code].
- **IPL themification** (`burst-ipl-anim-0.jpg` to `-7.jpg`):
  - **Phones on the right:** a 15.7 s autoplaying, looping promo MP4 (about 4 MB), plus Lottie animations: QR scanning, transaction runs, payment success, a splash screen and user referral [code].
  - **Live scanner prototypes:**
    - The cricket version runs a "Four!" banner along a blue band under the QR frame, with small sparkles [seen, `burst-ipl-anim-1.jpg`].
    - The festive version shows a Christmas wreath frame that cross-fades, at about 0.8 to 1.2 s, into a Diwali frame of marquee bulbs with a lit diya, and the bulbs twinkle [seen, `burst-ipl-anim-6.jpg`].
  - Each theme is shown in the real product screen, which makes the theming system easy to grasp.
- **Motion Ops** (`burst-mo-*.jpg`):
  - **Hero:** a fanned stack of navy "motion cards". Each card shows a bezier curve, "0.1, 0.1, 0.1, 1" and "250 ms". The stack sways slightly [seen].
  - **Videos:**
    - a 28 s plugin demo at 336x493;
    - an 11 s workshop clip;
    - three Lottiemon screen recordings of 39 s, 24 s and 20 s;
    - a 27 s example in a 248x416 phone.
  - **Lottiemon section:** each "in Lottiemon" recording sits rounded and frameless on a dark panel, next to an "in code" panel with the matching Dart snippet [seen].
  - **Weight:** the network log counted 14 MP4 responses, totalling about 195 MB as reported. Some may be repeated range requests, but the page is heavy either way [code].
- **The home desk:** the CRT in the 3D scene shows the live desktop, and later the lock screen, so the hero object is itself an animated screen [seen].

### 3.6 Branding system

- **Home type** [code]:
  - Aldrich for display: the hero heading is 192 px, and labels are set in capitals at 16 px.
  - "IBM Plex Sans Portfolio" for body at 15 px.
  - Micro 5, Press Start 2P and VT323 for the pixel and OS parts.
  - Caveat for handwritten notes.
  - Inter as a utility face.
- **Home colour:** near-black with white line drawings, a teal LED (`--startup-led-teal: #00ffaa`), an orange power button, a cream computer and toy-coloured props. There is also an SVG noise grain [code, seen].
- **Case-study type:** Fraunces for headings (H1 56 px, with one accent word in italic) and Instrument Sans for body at 16/26 px [code].
- **Case-study colour:** a light background with dots, a navy accent of about `#2b4a6b`, and soft drifting orbs.
- **Character:** the world is built from the designer's real objects and fandoms (Dragon Ball, Pokémon, the Initial D car, a mug with a cartoon face), so it reads as one person and not a template.

### 3.7 Case-study structure

- **Zapp Account** (`v6\ishant\sheet-cs-zapp-0.jpg` and `-1.jpg`; about 21,000 characters of text, 42 images and two GIFs):
  1. A heading, "Building Zapp Account", with stats (2.1x, 1.5x, #5) and a phone.
  2. Collapsible context sections.
  3. Competitors, usage patterns and key experience drivers.
  4. The execution scrollytelling with the floating phone.
  5. Results and other explorations.
  6. A footer with cards for the next case studies.
- **Motion Ops** (`v6\ishant\sheet-cs-motionops-0.jpg` and `-1.jpg`; 33 shots, about 8,400 characters and 38 images):
  1. Two initiative cards.
  2. Motion design guidelines and the motion cards.
  3. The plugin video.
  4. Interactions.
  5. Printed physical cards and a workshop video.
  6. Lottiemon, shown in the tool and in code side by side.
  7. A state-machine section.
  8. Impact, with the example video.
- **IPL themification** (`v6\ishant\sheet-cs-ipl-0.jpg`):
  1. Role, duration and focus.
  2. The brief.
  3. Campaign cards.
  4. Design tasks, with the phones on the right.
  5. A conclusion with the live themed scanners.
- **What this shows:** process is shown through working artefacts (prototypes, Lottie files, code, printed cards) rather than through personas and journey maps. That is why these pages feel credible.

### 3.8 Steal for Lana

1. **The work opens inside the object you chose.**
   - Clicking "work" flies into the computer, and the work appears on its screen, so you always know where you are.
   - For the sleeping moon, each section can keep its door-object as its frame:
     - films play in the projector's beam on a dark wall;
     - posters stand on the easel, one at a time on their own background;
     - the four apps run inside the same phone;
     - brands come out of the seed packets;
     - About is seen in the hand mirror;
     - Contact is the letter in the envelope.
   - This is the clearest fix for the plain feel after the hero.
   - Keep the flight under about 900 ms. Ishant's 2.4 to 2.7 s is fine once, but tiring on every click.
2. **Live prototypes in one pinned phone, changed by the text beside it.**
   - Lana's four products are real builds, so embed the real apps in the phone and swap them as each step scrolls past.
   - Load each iframe only when its step is near, and show a still image first.
   - Mark the active step with full-ink text and dim the others, instead of Ishant's bordered cards and dotted rail.
3. **Small, constant life in the scene.**
   - A bee around the flowers, steam from the mug and a live local clock.
   - For Lana, this could be a moth circling a lantern, one slow firefly, and a live "Manila, 1:09 am" line.
   - Pause each loop off screen and under reduced motion.
4. **One-line tooltips beside objects.**
   - Each door-object can get a quiet line in Lana's voice, in sentence case, for example "Ten brands, in seed packets".
   - The same text can be the object's accessible name.
5. **A line drawing that turns into a photo on hover.**
   - This matches Lana's dither-to-colour wake. It is the right move for the hand mirror revealing Lana's portrait.
6. **Sleep and wake.**
   - The computer boots on demand and shows a lock screen when you leave.
   - Lana's moon is already asleep: it can open its eyes at the first pointer move and close them again after a quiet minute. This is cheap, on theme and needs no wait.
7. **Showing work in the tool and in code side by side.**
   - This suits a designer who also builds. A Figma frame next to the shipped component, or next to the live app, tells that story in one glance.
8. **An honest, in-character phone message.**
   - Lana should not lock phones out of the world. But when something truly cannot run on a phone, say so in the world's own voice, as Ishant does.

### 3.9 Avoid

- **A forced 9 s boot** before you can do anything on the desk.
- **Body text at 15 px.** Lana's floor is 16 px.
- **Display type and labels set in capitals:** the Aldrich headings, the desk menu, the mono tags and the phone error screen.
- **Bordered step cards with a dotted rail** in the case-study scrollytelling. This is on Lana's list of things that read as AI.
- **Video weight:** about 195 MB of MP4 responses on one case study.
- **Sound as a core part of the experience.** If Lana adds any, it should be off until asked for.
- **Case studies that switch to a different look** (light, Fraunces, navy) from the dark desk world.
- **A phone visit that loses the world entirely.** Ishant's phone gets a tidy card list and an error screen, not the desk.

---

## 4. Cross-site synthesis

1. **Every world stops at the work.**
   - All three wrap the person in one object: a passport, a wallet, a computer.
   - All three drop it when you click into the work: Medium and Wix templates, Figma Slides decks, separate GitHub pages in another style.
   - Lana's biggest opening is to keep the night world going. Each section should open from its door-object and keep that object as its frame (sections 1.8 and 3.8).
   - Joining the sections through one descending night scene, instead of boxes or bands, follows Himani's pinned envelope over the beach.
2. **Ranking the ways to show screens:**
   - **Best:** live prototypes in one pinned phone (Ishant's Zapp page).
   - **Next:** themed live prototypes that switch their theme in place (Ishant's IPL page).
   - **Then:** short looping recordings, or several phones scrolling in step (Prerna's deck).
   - **Last:** videos in a player with controls, laptop frames and big GIFs (Himani's Wix pages).
   - For Lana: the four products get live embeds, the films get the projector, and posters and pubmats stay as large stills, one at a time.
3. **Motion values that fit Lana's taste**, drawn from what felt best here:
   - **Hovers:** 0.25 to 0.45 s, with a light spring (bounce 0.2 to 0.25) or `cubic-bezier(0.22, 1, 0.36, 1)`.
   - **Hover travel:** 5 px for buttons, 45 to 60 px for cards rising out of a holder, and a tilt under 9°.
   - **Reveals:** 0.6 to 1.15 s with `cubic-bezier(0.16, 1, 0.3, 1)`. Play them once, not on every pass.
   - **Flights between sections:** under 0.9 s. Skip them under reduced motion.
   - **Ambient loops:** 4 to 14 s, a few pixels of travel, paused off screen.
4. **All three make you wait.**
   - Himani's passport opens at about 3.1 s, Prerna's hero lands at about 3 s, and Ishant's desk arrives at about 9 s.
   - Lana's moon is already the hero and can be usable at once. Any entrance should finish in under 1 s, and play at most once per session.
5. **Phone is the weak spot everywhere.**
   - Himani shrinks the passport into empty colour, Prerna stacks the page, and Ishant drops the world.
   - Lana's phone version should be its own composition: the moon on top and the six objects in a gentle vertical path, each still waking into colour when tapped.
6. **Accessibility gaps worth not copying:**
   - labels in capitals on all three sites;
   - 15 px body text at Ishant's;
   - tickers and cyclers with no pause control;
   - scroll appears that replay;
   - a word-fill paragraph whose unfilled grey may fail contrast.
   - Framer's runtime checks `prefers-reduced-motion` for appear effects [code], but none of the three offers a visible pause or a reduced version of their loops that I could find.
7. **What made each feel like one person:**
   - real belongings and fandoms (the beagle, Coldplay tickets, Dragon Ball stickers, the AE86);
   - a chatty voice;
   - small surprises on hover.
   - Lana's moths, lilies, stars and the storybook moon already do this. The work sections should carry the same belongings, not switch to neutral cards.
