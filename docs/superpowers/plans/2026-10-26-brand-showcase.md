# Brand Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage folder-tab gallery with branded showcases — a 14-brand carousel, a video carousel, deck-style UI/UX screens, a re-composed hero — plus full `/design`, `/videos` and `/ui-ux` pages.

**Architecture:** Pubmats are curated in a JSON manifest and converted once by a Python script into webp files plus a generated `lib/brand-assets.ts`. Hand-written brand copy in `lib/brands.ts` merges with those assets. New presentational pieces live in `components/showcase/`; a generic client `Carousel` (native scroll-snap) wraps server-rendered slides. Backdrops are generated with the Codex CLI and stored as webp.

**Tech Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript, Python 3.12 + Pillow (asset script), Codex CLI (image generation).

**Spec:** `docs/superpowers/specs/2026-10-26-brand-showcase-design.md`

**Testing note:** The repo has no unit-test framework, and these are presentational components. Verification per task is `npx tsc --noEmit`, `npm run lint`, a data/asset check script (`node scripts/check-brands.mjs`), and headless-Chrome screenshots of the running dev server reviewed by eye. The dev server is already running at `http://localhost:3000` (`npm run dev`); restart it if it is not.

**Screenshot helper** (used in many tasks — run from Git Bash):

```bash
shot() { # shot <path> <out.png> [width] [height]
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="${3:-1440},${4:-900}" --virtual-time-budget=8000 \
    --screenshot="$2" "http://localhost:3000$1" 2>/dev/null
}
```

Chrome headless cannot render narrower than ~500px; for phone checks use `shot / out.png 500 1000` and treat it as the small-screen layout.

---

## File map

| File | Status | Responsibility |
|---|---|---|
| `next.config.ts` | modify | pin `turbopack.root` (parent folder has a stray lockfile) |
| `scripts/pubmats.json` | create | curated manifest: which PUBMATS files feed which brand role |
| `scripts/import-pubmats.py` | create | convert manifest files → webp (+ sm copies), write `lib/brand-assets.ts` |
| `scripts/backdrops.json` | create | Codex prompt subject + quiet zone per backdrop |
| `scripts/gen-backdrops.py` | create | run Codex per missing backdrop, convert to webp |
| `scripts/check-brands.mjs` | create | assert every generated asset and backdrop exists |
| `lib/brand-assets.ts` | generated | `{src,w,h}` per brand role and per more-poster |
| `lib/brands.ts` | create | `Brand` type, 14 brands' copy, `brands`, `morePosters`, `videos`, helpers |
| `components/showcase/Pic.tsx` | create | responsive `<img>` with sm/full srcset |
| `components/showcase/Mockups.tsx` | create | `PhoneFrame`, `PrintFrame`, `Sticker`, `LanyardID` |
| `components/showcase/BrandCollage.tsx` | create | the seven layout compositions |
| `components/showcase/BrandSlide.tsx` | create | one brand screen: backdrop + collage + copy card |
| `components/showcase/Carousel.tsx` | create | scroll-snap carousel, arrows, pips, keys |
| `components/showcase/EndSlide.tsx` | create | closing "see everything →" slide |
| `components/showcase/BrandShowcase.tsx` | create | homepage Branding section |
| `components/showcase/VideoSlide.tsx` | create | one video screen |
| `components/showcase/VideoShowcase.tsx` | create | homepage Videos section |
| `components/showcase/CodeSlide.tsx` | create | one UI/UX project screen |
| `components/showcase/CodeShowcase.tsx` | create | homepage UI/UX & code section |
| `components/showcase/SetGallery.tsx` | create | client wrapper: `ProjectBento` + `ProjectModal` for a list |
| `components/showcase/VideoEmbed.tsx` | create | poster → click → Drive iframe |
| `components/CaseStudy.tsx` | modify | export `MOCKS` |
| `components/ProjectModal.tsx` | modify | export `toEmbed` |
| `components/Hero.tsx` | rewrite | one full-screen garden with the name inside it |
| `components/Nav.tsx` | modify | new section links; `/#id` on sub-pages |
| `components/AboutPanel.tsx` | modify | section index `04` |
| `components/Contact.tsx` | modify | "Thank you!" heading, index `05` |
| `app/page.tsx` | modify | new section order, drop `FolderStack` |
| `app/design/page.tsx` | create | all brands + full sets + more posters |
| `app/videos/page.tsx` | create | all videos with players |
| `app/ui-ux/page.tsx` | create | full case studies |
| `app/sitemap.ts` | modify | add the three pages |
| `app/globals.css` | modify | append "Brand showcase" block |
| `components/FolderStack.tsx` | delete | replaced |
| `public/work/brands/**`, `public/work/sm/brands/**` | generated | pubmat images |
| `public/art/backdrops/*.webp` | generated | 17 backdrops |

---

### Task 1: Pin the Turbopack root

The dev server warns that it picked `D:\WORK\PORTFOLIO\package-lock.json` (an older sibling project) as the workspace root. Pin it so module resolution never reaches the parent.

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Edit the config**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The parent folder holds another project's lockfile; without this,
  // Turbopack treats D:\WORK\PORTFOLIO as the workspace root.
  turbopack: { root: __dirname },
};

export default nextConfig;
```

- [ ] **Step 2: Restart the dev server and confirm the warning is gone**

Stop the running `npm run dev`, start it again, then:

Run: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/`
Expected: `200`, and the server log no longer contains "multiple lockfiles".

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore: pin turbopack root to the project folder"
```

---

### Task 2: Asset manifest, import script and check script

**Files:**
- Create: `scripts/pubmats.json`
- Create: `scripts/import-pubmats.py`
- Create: `scripts/check-brands.mjs`
- Generated: `lib/brand-assets.ts`, `public/work/brands/**`, `public/work/sm/brands/**`

- [ ] **Step 1: Write the check script (the failing test)**

`scripts/check-brands.mjs`:

```js
// Asserts every image the site references for brands exists on disk:
// full and sm copies of each pubmat, and one backdrop per brand / code project.
// Run: node scripts/check-brands.mjs
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const pub = (p) => join(root, "public", p.replace(/^\//, ""));
const fail = [];

const assetsFile = join(root, "lib", "brand-assets.ts");
if (!existsSync(assetsFile)) {
  console.error("lib/brand-assets.ts missing — run: python -I scripts/import-pubmats.py");
  process.exit(1);
}
const srcs = [...readFileSync(assetsFile, "utf8").matchAll(/"src": "([^"]+)"/g)].map((m) => m[1]);
if (srcs.length === 0) fail.push("brand-assets.ts lists no images");
for (const s of srcs) {
  if (!existsSync(pub(s))) fail.push(`missing full: ${s}`);
  const sm = s.replace("/work/", "/work/sm/");
  if (!existsSync(pub(sm))) fail.push(`missing sm: ${sm}`);
}

const manifest = JSON.parse(readFileSync(join(root, "scripts", "pubmats.json"), "utf8"));
const backdrops = JSON.parse(readFileSync(join(root, "scripts", "backdrops.json"), "utf8"));
for (const slug of Object.keys(manifest.brands)) {
  if (!backdrops[slug]) fail.push(`no backdrop prompt for brand ${slug}`);
}
for (const slug of Object.keys(backdrops)) {
  if (!existsSync(pub(`/art/backdrops/${slug}.webp`))) fail.push(`missing backdrop: ${slug}.webp`);
}

if (fail.length) {
  console.error(fail.join("\n"));
  console.error(`\n${fail.length} problem(s)`);
  process.exit(1);
}
console.log(`ok — ${srcs.length} images, ${Object.keys(backdrops).length} backdrops`);
```

- [ ] **Step 2: Run it to see it fail**

Run: `node scripts/check-brands.mjs`
Expected: exit 1, `lib/brand-assets.ts missing — run: python -I scripts/import-pubmats.py`

- [ ] **Step 3: Write the manifest**

`scripts/pubmats.json` — paths in `collage`/`set` are relative to the brand's `dir`; paths in `more` are relative to `root`. Roles: `key` (cover art), `print`, `phone`, `sticker`, `id` (lanyard), `item` (kit tile), `card` (wall frame).

```json
{
  "root": "D:/WORK/PORTFOLIO/PUBMATS",
  "brands": {
    "revival-x": {
      "dir": "02 FEU Tech ACM/03 ACM Revival (Jan 2025)",
      "collage": {
        "key": ["FEUTECH ACM 5.jpg"],
        "phone": ["481149552_976832484554048_769970505119435199_n.jpg"],
        "print": ["2025-01-15 facebook 02.jpg"]
      },
      "set": [
        "FEUTECH ACM 5.jpg",
        "2025-01-15 facebook 01.jpg",
        "2025-01-15 facebook 02.jpg",
        "481149552_976832484554048_769970505119435199_n.jpg",
        "481956456_976832327887397_3253310767882497422_n.jpg"
      ]
    },
    "into-the-code": {
      "dir": "02 FEU Tech ACM/26 Into the Code F++ 5.0 (Mar 2024)",
      "collage": {
        "card": [
          "2024-03-12 facebook 01.jpg",
          "481216125_943444407966501_8110898586236233914_n.jpg",
          "480943022_943444411299834_2983571026855481067_n.jpg",
          "481297602_943447034632905_1925747471807246309_n.jpg",
          "480701802_943447334632875_5198496494793374174_n.jpg"
        ]
      },
      "set": [
        "2024-03-12 facebook 01.jpg",
        "480802928_943459784631630_4796821517324185567_n.jpg",
        "480701802_943447334632875_5198496494793374174_n.jpg",
        "480943022_943444411299834_2983571026855481067_n.jpg",
        "481216125_943444407966501_8110898586236233914_n.jpg",
        "481297602_943447034632905_1925747471807246309_n.jpg",
        "481464852_943446994632909_7706815380810392034_n.jpg"
      ]
    },
    "neostalgia": {
      "dir": "01 CS Expo 2026 - NEOSTALGIA",
      "collage": {
        "print": ["01 Key visual, logo & main poster/MAIN POSTER.png"],
        "phone": ["05 Meet the Officers/7 LANA.png"],
        "id": ["08 Team posters & nameplates/BYTEME.png"],
        "sticker": ["03 Stickers/planetcat.png", "03 Stickers/game.png", "03 Stickers/TV.png"]
      },
      "set": [
        "01 Key visual, logo & main poster/MAIN POSTER.png",
        "01 Key visual, logo & main poster/COVER.png",
        "01 Key visual, logo & main poster/PFP.png",
        "01 Key visual, logo & main poster/Artboard 1.png",
        "02 Teaser & sticker-drive teasers/TEASER.png",
        "02 Teaser & sticker-drive teasers/TEASER 2.png",
        "02 Teaser & sticker-drive teasers/STICKER DRIVE PART 1.png",
        "02 Teaser & sticker-drive teasers/STICKER 2.png",
        "03 Stickers/planetcat.png",
        "03 Stickers/game.png",
        "03 Stickers/TV.png",
        "03 Stickers/glasses.png",
        "03 Stickers/csexposticker2background.png",
        "03 Stickers/csexpostickerbackground.png",
        "04 DP Blast (team display pictures)/1.png",
        "04 DP Blast (team display pictures)/2.png",
        "04 DP Blast (team display pictures)/3.png",
        "04 DP Blast (team display pictures)/4.png",
        "04 DP Blast (team display pictures)/BYTEME 1.png",
        "04 DP Blast (team display pictures)/CK.png",
        "04 DP Blast (team display pictures)/CODE-PRITS 1.png",
        "04 DP Blast (team display pictures)/ELEVATE 1.png",
        "04 DP Blast (team display pictures)/HOTFIX 1.png",
        "04 DP Blast (team display pictures)/STOCHASTIC 1.png",
        "04 DP Blast (team display pictures)/DP BLAST 2.png",
        "04 DP Blast (team display pictures)/DP BLAST_3.png",
        "05 Meet the Officers/0 MTO SQUARE.png",
        "05 Meet the Officers/7 LANA.png",
        "05 Meet the Officers/10 JAMES.png",
        "05 Meet the Officers/13 CSYPRES.png",
        "05 Meet the Officers/14 SHY.png",
        "05 Meet the Officers/6 MARIANNE.png",
        "07 Call for Sponsors/Call for Sponsors.png",
        "08 Team posters & nameplates/ByteMe (1080 x 1350 px) (1).png",
        "08 Team posters & nameplates/A woven thread of motion.png",
        "08 Team posters & nameplates/Windows into the pattern.png",
        "08 Team posters & nameplates/Ctrl+C, Ctrl+V.png",
        "08 Team posters & nameplates/BYTEME.png",
        "09 Merch - jackets/JACKET- TEAL.png",
        "09 Merch - jackets/JACKET- NAVY.png",
        "09 Merch - jackets/JACKET- BLACK.png"
      ]
    },
    "tabitayo": {
      "dir": "06 Freelance & clients/01 Tabitayo (seat-finder app)",
      "collage": {
        "print": ["FB 1A.png", "POST2.png", "seating arrangement.png"],
        "phone": ["Layer 2.png"]
      },
      "set": [
        "FB 1A.png",
        "FB 3B.png",
        "FB 3C.png",
        "FB 3D.png",
        "FB 3E.png",
        "POST2.png",
        "POST1.png",
        "Layer 2.png",
        "seating arrangement.png"
      ]
    },
    "rock-of-aces": {
      "dir": "03 FEU Tech SCC/18 ROCK OF ACES 2025",
      "collage": {
        "phone": [
          "485890480_1038198698332880_2237026441107111527_n.jpg",
          "486249497_1038197598332990_6310595202686295411_n.jpg",
          "486249653_1040034958149254_381792705508701673_n.jpg"
        ],
        "key": ["496303697_1238893154916941_2972311716057454172_n.jpg"]
      },
      "set": [
        "496303697_1238893154916941_2972311716057454172_n.jpg",
        "485890480_1038198698332880_2237026441107111527_n.jpg",
        "486035236_1038201021665981_1949268813322141460_n.jpg",
        "486249497_1038197598332990_6310595202686295411_n.jpg",
        "485645831_1038197611666322_2038601161552503484_n.jpg",
        "485728706_1038197318333018_546074348015722220_n.jpg",
        "486288255_1039087391577344_4766816782571373435_n.jpg",
        "486249653_1040034958149254_381792705508701673_n.jpg",
        "BOTB x ROA fonts.png"
      ]
    },
    "battle-of-the-bands": {
      "dir": "03 FEU Tech SCC/02 Battle of the Bands 2024",
      "collage": {
        "print": ["2024-05-09 facebook 01.jpg", "2024-06-08 facebook d-day 01.jpg"],
        "phone": ["2024-06-07 facebook meet 01.jpg"]
      },
      "set": [
        "2024-05-09 facebook 01.jpg",
        "2024-05-10 facebook 01.jpg",
        "2024-05-12 facebook 01.jpg",
        "2024-05-12 facebook 02.jpg",
        "2024-05-12 facebook 03.jpg",
        "2024-05-12 facebook 04.jpg",
        "2024-05-12 facebook 05.jpg",
        "2024-05-25 facebook last 01.jpg",
        "2024-06-07 facebook meet 01.jpg",
        "2024-06-07 facebook meet 02.jpg",
        "2024-06-07 facebook meet 03.jpg",
        "2024-06-07 facebook meet 04.jpg",
        "2024-06-07 facebook meet 05.jpg",
        "2024-06-08 facebook d-day 01.jpg",
        "2024-06-08 facebook now 01.jpg",
        "2024-06-08 facebook champion 01.jpg",
        "2024-06-08 facebook champion 02.jpg",
        "2024-06-08 facebook champion 03.jpg",
        "2024-06-10 facebook band 01.jpg",
        "2024-06-10 facebook thank 01.jpg"
      ]
    },
    "biblioboo": {
      "dir": "04 FEU Tech Library/04 Halloween 2025 - BiblioBOO & The Isolation Room",
      "collage": {
        "print": ["POSTER.png", "PART 2.png"],
        "phone": ["MOVIE 1.png"],
        "sticker": ["BIBLIOBOO scared.png", "5a865d55-38d1-4f51-a8fe-c9b9e0a1bf7d.jpg"]
      },
      "set": [
        "POSTER.png",
        "5a865d55-38d1-4f51-a8fe-c9b9e0a1bf7d.jpg",
        "BIBLIOBOO scared.png",
        "Artboard 1.png",
        "PART 2.png",
        "HALLOWEEN long.png",
        "Library 2.jpg",
        "MOVIE 1.png",
        "MOVIE 2.png",
        "MOVIE 3.png",
        "MOVIE 4.png"
      ]
    },
    "dystopia": {
      "dir": "02 FEU Tech ACM/01 Dystopia (Jun 2024)",
      "collage": {
        "key": ["FEUTECH ACM 1.jpg"],
        "phone": ["2024-07-03 facebook 1783 01.jpg"],
        "print": ["2024-07-03 facebook 8155 02.jpg"]
      },
      "set": [
        "FEUTECH ACM 1.jpg",
        "2024-07-03 facebook 1783 01.jpg",
        "2024-07-03 facebook 1783 02.jpg",
        "2024-07-03 facebook 8155 01.jpg",
        "2024-07-03 facebook 8155 02.jpg"
      ]
    },
    "technorun": {
      "dir": "03 FEU Tech SCC/06 Technorun 2025",
      "collage": {
        "print": ["2025-07-31 facebook 01.jpg"],
        "item": [
          "3K.png",
          "5K.png",
          "10K.png",
          "21K.png",
          "485004285_987718973215459_1496984069015702086_n.png",
          "485124671_2082693738884781_7476618700085019870_n.png",
          "486166051_1310848763478920_3251119603958408455_n.png",
          "486722766_1877324576140011_2043964807489557612_n.png"
        ]
      },
      "set": [
        "2025-07-31 facebook 01.jpg",
        "TECHNORUN INFORMATION.png",
        "1.png",
        "2.png",
        "3K.png",
        "5K.png",
        "10K.png",
        "21K.png",
        "485004285_987718973215459_1496984069015702086_n.png",
        "485124671_2082693738884781_7476618700085019870_n.png",
        "486166051_1310848763478920_3251119603958408455_n.png",
        "486722766_1877324576140011_2043964807489557612_n.png"
      ]
    },
    "pacsa": {
      "dir": "05 PACSA 2025 - Kulay PACSA",
      "collage": {
        "print": ["03 Guest & keynote speakers/ALL SPEAKERS.png"],
        "phone": ["05 Baguio Teachers Camp house rules/BTC HOUSE RULES.png"],
        "id": ["02 Ready for PACSA 2025 DP frames/DP FRAME 2.1.png"]
      },
      "set": [
        "03 Guest & keynote speakers/ALL SPEAKERS.png",
        "03 Guest & keynote speakers/Keynote Speaker - Andrea Strachan.png",
        "03 Guest & keynote speakers/SPEAKER.png",
        "02 Ready for PACSA 2025 DP frames/DP FRAME.png",
        "02 Ready for PACSA 2025 DP frames/DP FRAME 2.1.png",
        "02 Ready for PACSA 2025 DP frames/3.png",
        "04 Announcements & PPT template/ANNOUNCEMENT.png",
        "05 Baguio Teachers Camp house rules/BTC HOUSE RULES.png",
        "05 Baguio Teachers Camp house rules/1.png",
        "05 Baguio Teachers Camp house rules/2.png"
      ]
    },
    "heartwired": {
      "dir": "02 FEU Tech ACM/17 HeartWired - Meet the Hosts (Feb 2025)",
      "collage": {
        "phone": [
          "2025-02-13 facebook 02.jpg",
          "2025-02-13 facebook 01.jpg",
          "2025-02-13 facebook 03.jpg"
        ]
      },
      "set": [
        "2025-02-13 facebook 01.jpg",
        "2025-02-13 facebook 02.jpg",
        "2025-02-13 facebook 03.jpg"
      ]
    },
    "elysium": {
      "dir": "02 FEU Tech ACM/00 ACM Overall Theme 2024-2025",
      "collage": {
        "print": ["2024-08-31 facebook 01.jpg"],
        "item": [
          "2024-08-31 facebook 03.jpg",
          "2024-08-31 facebook 04.jpg",
          "2024-09-19 facebook 01.jpg",
          "2025-04-21 facebook 02.jpg",
          "2025-04-21 facebook 05.jpg",
          "2025-03-06 facebook 01.jpg",
          "2025-04-21 facebook 01.jpg"
        ]
      },
      "set": [
        "2024-08-31 facebook 01.jpg",
        "2024-08-31 facebook 02.jpg",
        "2024-08-31 facebook 03.jpg",
        "2024-08-31 facebook 04.jpg",
        "2024-09-19 facebook 01.jpg",
        "2024-11-04 facebook 01.jpg",
        "2024-11-04 facebook 02.jpg",
        "2024-12-11 facebook 01.jpg",
        "2024-12-27 facebook 01.jpg",
        "2024-12-27 facebook 02.jpg",
        "2024-12-27 facebook 03.jpg",
        "2024-12-27 facebook 04.jpg",
        "2025-03-06 facebook 01.jpg",
        "2025-03-19 facebook 01.jpg",
        "2025-04-21 facebook 01.jpg",
        "2025-04-21 facebook 02.jpg",
        "2025-04-21 facebook 03.jpg",
        "2025-04-21 facebook 04.jpg",
        "2025-04-21 facebook 05.jpg",
        "2025-07-24 facebook 01.jpg",
        "FEUTECH ACM 2.jpg",
        "FEUTECH ACM 7.jpg"
      ]
    },
    "cs-night": {
      "dir": "02 FEU Tech ACM/10 CS Night - performers",
      "collage": { "key": ["PERFORMERS.png"] },
      "set": ["PERFORMERS.png"]
    },
    "techno-week": {
      "dir": "03 FEU Tech SCC/05 Techno Week 2025",
      "collage": {
        "print": ["FEUTECH SCC 6.jpg", "3 (1).png"],
        "phone": ["2025-02-09 facebook 01.jpg"]
      },
      "set": [
        "FEUTECH SCC 6.jpg",
        "2025-02-09 facebook 01.jpg",
        "3 (1).png",
        "476071158_575837482109744_8873126769850518653_n.png"
      ]
    }
  },
  "more": {
    "handog-ngiti": [
      "03 FEU Tech SCC/01 Handog Ngiti 2023/Main Poster (TARP).png",
      "03 FEU Tech SCC/01 Handog Ngiti 2023/THANK YOU.png"
    ],
    "pixels-persona": ["03 FEU Tech SCC/00 SCC General/COSPLAY 3.png"],
    "always-queer": ["03 FEU Tech SCC/00 SCC General/2025-06-28 facebook 01.jpg"],
    "students-recognition": ["03 FEU Tech SCC/00 SCC General/MAIN POSTER 2 (2).png"],
    "womens-month-library": ["04 FEU Tech Library/11 Womens Month/WOMEN'S MONTH LIB.png"],
    "class-work": [
      "07 School & personal/02 Class design work/COPERNICAN REVOLUTION INFOGRAPHIC.png",
      "07 School & personal/02 Class design work/HUERTAS.png",
      "07 School & personal/02 Class design work/HUERTAS_SA3.png",
      "07 School & personal/02 Class design work/Mediocre at best.png",
      "07 School & personal/02 Class design work/MOVIE POSTER.png"
    ]
  }
}
```

- [ ] **Step 4: Write the import script**

`scripts/import-pubmats.py`:

```python
"""Convert the curated PUBMATS files into web images and write lib/brand-assets.ts.

Run from the repo root:  python -I scripts/import-pubmats.py

Reads scripts/pubmats.json. For every file it writes
  public/work/brands/<group>/<name>.webp     long edge <= 1600
  public/work/sm/brands/<group>/<name>.webp  720 wide (the grid tiles load this
                                             copy — see small() in ProjectBento)
and records {src, w, h}. A file used twice (collage and set) is converted once.
Safe to re-run: outputs are overwritten.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True
Image.MAX_IMAGE_PIXELS = None

REPO = Path(__file__).resolve().parent.parent
FULL, SM = 1600, 720


def slugify(name: str) -> str:
    stem = re.sub(r"[^a-z0-9]+", "-", Path(name).stem.lower()).strip("-")
    return stem[:48] or "img"


class Converter:
    def __init__(self) -> None:
        self.done: dict[str, dict] = {}
        self.taken: set[str] = set()

    def __call__(self, src: Path, group: str) -> dict:
        key = str(src.resolve())
        if key in self.done:
            return self.done[key]
        if not src.exists():
            sys.exit(f"missing source file: {src}")

        base = f"/work/brands/{group}/{slugify(src.name)}"
        rel, n = f"{base}.webp", 2
        while rel in self.taken:
            rel, n = f"{base}-{n}.webp", n + 1
        self.taken.add(rel)

        im = Image.open(src)
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        im.thumbnail((FULL, FULL), Image.LANCZOS)
        full = REPO / "public" / rel.lstrip("/")
        full.parent.mkdir(parents=True, exist_ok=True)
        im.save(full, "WEBP", quality=82, method=6)

        sm = im if im.width <= SM else im.resize((SM, round(im.height * SM / im.width)), Image.LANCZOS)
        small = REPO / "public" / rel.replace("/work/", "/work/sm/", 1).lstrip("/")
        small.parent.mkdir(parents=True, exist_ok=True)
        sm.save(small, "WEBP", quality=78, method=6)

        self.done[key] = {"src": rel, "w": im.width, "h": im.height}
        print(f"  {rel}  {im.width}x{im.height}")
        return self.done[key]


def main() -> None:
    manifest = json.loads((REPO / "scripts" / "pubmats.json").read_text(encoding="utf-8"))
    root = Path(manifest["root"])
    convert = Converter()

    brands = {}
    for slug, b in manifest["brands"].items():
        print(slug)
        base = root / b["dir"]
        brands[slug] = {
            "collage": {role: [convert(base / f, slug) for f in files] for role, files in b["collage"].items()},
            "set": [convert(base / f, slug) for f in b["set"]],
        }

    more = {}
    for pid, files in manifest["more"].items():
        print(pid)
        more[pid] = [convert(root / f, "more") for f in files]

    out = REPO / "lib" / "brand-assets.ts"
    out.write_text(
        "// Generated by scripts/import-pubmats.py from scripts/pubmats.json — do not edit by hand.\n"
        'import type { ProjectImage } from "./content";\n\n'
        'export type CollageRole = "key" | "print" | "phone" | "sticker" | "id" | "item" | "card";\n\n'
        "export type BrandAssets = {\n"
        "  collage: Partial<Record<CollageRole, ProjectImage[]>>;\n"
        "  set: ProjectImage[];\n"
        "};\n\n"
        f"export const brandAssets: Record<string, BrandAssets> = {json.dumps(brands, indent=2)};\n\n"
        f"export const moreAssets: Record<string, ProjectImage[]> = {json.dumps(more, indent=2)};\n",
        encoding="utf-8",
    )
    print(f"wrote {out.relative_to(REPO)} — {len(convert.done)} images")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Run the import**

Run: `python -I scripts/import-pubmats.py`
Expected: one line per image, ending `wrote lib/brand-assets.ts — <~170> images`. No `missing source file`.

- [ ] **Step 6: Run the check — images pass, backdrops still fail**

Run: `node scripts/check-brands.mjs`
Expected: exit 1 with `ENOENT … scripts/backdrops.json` (the backdrop manifest arrives in Task 3). Confirm no `missing full:` / `missing sm:` lines would appear by running:
`node -e "const t=require('fs').readFileSync('lib/brand-assets.ts','utf8');console.log((t.match(/\"src\"/g)||[]).length)"`
Expected: a number > 150.

- [ ] **Step 7: Commit**

```bash
git add scripts/pubmats.json scripts/import-pubmats.py scripts/check-brands.mjs lib/brand-assets.ts public/work/brands public/work/sm/brands
git commit -m "feat: import curated pubmats per brand as web images"
```

---

### Task 3: Backdrops with Codex

**Files:**
- Create: `scripts/backdrops.json`, `scripts/gen-backdrops.py`
- Generated: `public/art/backdrops/*.webp`

- [ ] **Step 1: Write the prompt manifest**

`scripts/backdrops.json` — `quiet` names where the copy card sits.

```json
{
  "revival-x": { "quiet": "lower-left", "subject": "a chrome-violet nebula sky with flowing liquid-metal ribbons and soft light trails; deep indigo and violet with silver highlights and tiny four-point sparkles" },
  "into-the-code": { "quiet": "left", "subject": "a deep navy digital space: a perspective grid floor receding to a glowing violet wireframe portal ring, faint scan lines; navy, neon violet and a touch of cyan" },
  "neostalgia": { "quiet": "left", "subject": "a retro-futurist space-age sky: teal sky, a big ringed orange planet, cream cumulus clouds, a small rocket with a looping orange trail, mid-century futurist city silhouettes far below; teal, orange and cream" },
  "tabitayo": { "quiet": "right", "subject": "an elegant event table setting seen from above: wine-red linen, cream plates, candlelight glow, scattered petals, soft champagne highlights; wine, cream and blush" },
  "rock-of-aces": { "quiet": "right", "subject": "a punk zine collage: torn hot-pink and orange paper layers, halftone starbursts, photocopy texture, scattered lightning-bolt and guitar-pick shapes; hot pink, orange, black and cream" },
  "battle-of-the-bands": { "quiet": "right", "subject": "a vintage concert stage: maroon sunburst rays, kraft paper texture, torn tape strips, a vintage microphone silhouette and a guitar headstock at the edges; maroon, cream and mustard" },
  "biblioboo": { "quiet": "centre", "subject": "a moonlit haunted library: tall dark bookshelves, a cork board with pinned notes and red string, a full moon through an arched window, a few tiny cute floating ghosts; plum, warm brown and cream" },
  "dystopia": { "quiet": "lower-left", "subject": "a chrome cyberpunk city skyline at magenta-violet dusk, glowing windows, light fog, a big gradient sun, a reflective wet street; magenta, violet and silver" },
  "technorun": { "quiet": "left", "subject": "bright running-track lanes curving across the frame at sunrise, rainbow lane stripes in red, orange, green and blue, soft sky and sun rays; bright primaries on white" },
  "pacsa": { "quiet": "left", "subject": "Baguio pine-tree hills under golden clouds, framed by a bold Filipino woven textile pattern border in orange, blue, yellow and red; festive and warm" },
  "heartwired": { "quiet": "right", "subject": "pink grid notebook paper with washi tape, doodled hearts and stars, a ribbon bow and scattered heart stickers; pastel pink, red and white" },
  "elysium": { "quiet": "left", "subject": "lavender aurora heavens: soft violet and pink aurora curtains, glowing nebula haze, gentle chrome sparkles and a faint halo arch; lavender, violet and pearl" },
  "cs-night": { "quiet": "lower-left", "subject": "an art-deco grand staircase at midnight with gold geometric fan patterns and marquee light bulbs, an elegant ballroom mood; midnight navy and gold" },
  "techno-week": { "quiet": "left", "subject": "a pastel Memphis pattern: overlapping colour blocks, squiggles, dots, confetti and floating rounded-square shapes; pastel pink, mint, lilac, yellow and blue" },
  "code-psyclick": { "quiet": "left", "subject": "a calm lavender field with soft flowing waveform lines and gentle concentric pulse rings; lavender, periwinkle and pearl" },
  "code-debt-ledger": { "quiet": "right", "subject": "pale ledger-paper grid with soft green ink lines, a few floating coins and a gentle rising curve; mint, sage and cream" },
  "code-algebrawl": { "quiet": "left", "subject": "a pixel-art arena sky at dusk with chunky pixel clouds, pixel stars and floating plus and times sign shapes; purple, pink and gold" }
}
```

- [ ] **Step 2: Write the generator**

`scripts/gen-backdrops.py`:

```python
"""Generate missing slide backdrops with the Codex CLI.

Run from the repo root:  python -I scripts/gen-backdrops.py [slug ...]

With no slugs, generates every backdrop in scripts/backdrops.json that does not
yet exist in public/art/backdrops/. Pass slugs to (re)generate just those.
Codex saves into its own generated_images folder (its exec sandbox is
read-only); this script takes the newest PNG from there and converts it.
"""
import json
import subprocess
import sys
import time
from pathlib import Path

from PIL import Image

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "public" / "art" / "backdrops"
CODEX_BIN = Path.home() / "AppData/Local/OpenAI/Codex/bin"
IMAGE_DIRS = [
    Path.home() / "AppData/Roaming/orca/codex-runtime-home/home/generated_images",
    Path.home() / ".codex/generated_images",
]

QUIET = {
    "left": "Keep the left 40% of the frame calm, darker and low-detail, because a text card sits there.",
    "right": "Keep the right 40% of the frame calm and low-detail, because a text card sits there.",
    "lower-left": "Keep the lower-left quarter of the frame calm and low-detail, because a text card sits there.",
    "centre": "Keep the centre of the frame calm and low-detail, because a text card sits there.",
}


def codex_exe() -> Path:
    found = sorted(CODEX_BIN.glob("*/codex.exe"), key=lambda p: p.stat().st_mtime)
    if not found:
        sys.exit(f"codex.exe not found under {CODEX_BIN}")
    return found[-1]


def newest_png(since: float) -> Path | None:
    pngs = [p for d in IMAGE_DIRS if d.exists() for p in d.rglob("*.png") if p.stat().st_mtime >= since]
    return max(pngs, key=lambda p: p.stat().st_mtime) if pngs else None


def generate(slug: str, spec: dict) -> None:
    prompt = (
        "Use your image generation tool to create ONE image and nothing else. "
        "A 16:9 landscape background illustration for a portfolio slide. "
        "Style: flat 2D poster illustration with soft risograph-like grain and gentle gradients, "
        "dreamy and calm, simple shapes, not photorealistic. "
        f"Subject: {spec['subject']}. {QUIET[spec['quiet']]} "
        "No text, no letters, no numbers, no logos, no people, no faces, no hands. "
        "When done, reply with only the absolute path of the saved image file."
    )
    start = time.time() - 1
    scratch = REPO / ".codex-scratch"
    scratch.mkdir(exist_ok=True)
    subprocess.run(
        [str(codex_exe()), "exec", "--skip-git-repo-check", "-C", str(scratch), prompt],
        check=True,
        timeout=600,
    )
    png = newest_png(start)
    if png is None:
        sys.exit(f"{slug}: codex finished but no new PNG was found in {IMAGE_DIRS}")
    im = Image.open(png).convert("RGB")
    if im.width > 1920:
        im = im.resize((1920, round(im.height * 1920 / im.width)), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{slug}.webp", "WEBP", quality=78, method=6)
    print(f"{slug}: {png.name} -> public/art/backdrops/{slug}.webp")


def main() -> None:
    specs = json.loads((REPO / "scripts" / "backdrops.json").read_text(encoding="utf-8"))
    wanted = sys.argv[1:] or [s for s in specs if not (OUT / f"{s}.webp").exists()]
    for slug in wanted:
        if slug not in specs:
            sys.exit(f"unknown backdrop: {slug}")
        generate(slug, specs[slug])


if __name__ == "__main__":
    main()
```

Add `.codex-scratch/` to `.gitignore`.

- [ ] **Step 3: Seed Revival X from the approved test render**

The Revival X backdrop was already generated and reviewed during brainstorming:

```bash
python -I -c "from PIL import Image; im=Image.open(r'C:/Users/Lana/AppData/Roaming/orca/codex-runtime-home/home/generated_images/01a17729-aa1b-78e3-9c4b-8e65508eb817/exec-a23a80d9-009a-41f9-bfe0-beab5a798b3e.png').convert('RGB'); import os; os.makedirs('public/art/backdrops',exist_ok=True); im.save('public/art/backdrops/revival-x.webp','WEBP',quality=78,method=6)"
```

- [ ] **Step 4: Generate the other 16 (background, ~1–2 min each)**

Run: `python -I scripts/gen-backdrops.py` (use `run_in_background`)
Expected: 16 lines `<slug>: exec-….png -> public/art/backdrops/<slug>.webp`.

- [ ] **Step 5: Review every backdrop by eye**

Build one contact sheet and look at it:

```bash
python -I -c "
from PIL import Image; from pathlib import Path
fs=sorted(Path('public/art/backdrops').glob('*.webp')); W=480
ims=[Image.open(f).convert('RGB') for f in fs]; [i.thumbnail((W,W)) for i in ims]
s=Image.new('RGB',(W*3,(len(ims)+2)//3*280),'white')
[s.paste(im,((k%3)*W,(k//3)*280)) for k,im in enumerate(ims)]
s.save('.codex-scratch/backdrops-sheet.jpg'); print([f.stem for f in fs])"
```

Reject any backdrop with visible text/letters, people or faces, a busy quiet zone, or a photoreal look that clashes with the garden; regenerate it with `python -I scripts/gen-backdrops.py <slug>`.

- [ ] **Step 6: Check passes**

Run: `node scripts/check-brands.mjs`
Expected: `ok — <n> images, 17 backdrops`

- [ ] **Step 7: Commit**

```bash
git add scripts/backdrops.json scripts/gen-backdrops.py public/art/backdrops .gitignore
git commit -m "feat: generated backdrops for each brand and code project"
```

---

### Task 4: Brand data

**Files:**
- Create: `lib/brands.ts`
- Modify: `components/ProjectModal.tsx` (export `toEmbed`), `components/CaseStudy.tsx` (export `MOCKS`)

- [ ] **Step 1: Export the two helpers other files will reuse**

In `components/ProjectModal.tsx` change `function toEmbed(` to `export function toEmbed(`.
In `components/CaseStudy.tsx` change `const MOCKS = {` to `export const MOCKS = {`.

- [ ] **Step 2: Write `lib/brands.ts`**

```ts
// The branding showcase: 14 brands in showcase order, strongest first.
// Copy lives here; images come from the generated lib/brand-assets.ts
// (scripts/import-pubmats.py). Adding a brand = an entry in
// scripts/pubmats.json + scripts/backdrops.json + COPY below.
import { brandAssets, moreAssets, type CollageRole } from "./brand-assets";
import { workTabs, type Project, type ProjectImage } from "./content";

export type BrandLayout = "spread" | "mirror" | "cover" | "fan" | "stickers" | "kit" | "wall";

export type Brand = {
  slug: string;
  name: string;
  org: string;
  /** Shown on the phone mockups' header. */
  handle: string;
  /** Display date on the slide. */
  date: string;
  /** Four-digit year, for the gallery's range label. */
  year: string;
  tagline: string;
  brief: string;
  roles: string[];
  tools: string[];
  layout: BrandLayout;
  /** Brand colour: decorative only (pips, card hairline) — never text. */
  accent: string;
  href?: string;
  collage: Partial<Record<CollageRole, ProjectImage[]>>;
  set: ProjectImage[];
};

type BrandCopy = Omit<Brand, "collage" | "set">;

const ACM = "FEU Tech ACM";
const SCC = "FEU Tech SCC";

const COPY: BrandCopy[] = [
  {
    slug: "revival-x",
    name: "ACM Revival X",
    org: ACM,
    handle: "feutechacm",
    date: "Jan 2025",
    year: "2025",
    tagline: "Chrome hands, reaching back in.",
    brief:
      "A three-day learning series — Data Dominance, Digital Frontiers, Git Grimoire. Reaching chrome hands and light-trail ribbons carry from the key visual into the day line-up and every speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "cover",
    accent: "#8f7cf0",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02ZnYurdY6YJNYMyhsNSbQRwEyuxygKd18zR3pB7BnKVLSi2MBWRrbHmAR8um12raul",
  },
  {
    slug: "into-the-code",
    name: "Into the Code F++ 5.0",
    org: ACM,
    handle: "feutechacm",
    date: "Mar 2024",
    year: "2024",
    tagline: "A quantum odyssey in neon wireframe.",
    brief:
      "Outreach event built around a wireframe face dissolving into a light portal. The same neon violet runs through the main poster, the Zero to Hero, Quantum Odyssey and Quantum Revelry sessions, and every keynote and speaker card.",
    roles: ["Key visual", "Event branding", "Speaker cards"],
    tools: ["Photoshop", "Illustrator"],
    layout: "wall",
    accent: "#b57cff",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02EDRQRLTiuXJojj9kX4wXLjsW1Vq65CAtnocZGYRVhX7KdfkpBU94apMnBgLvom85l",
  },
  {
    slug: "neostalgia",
    name: "NEOSTALGIA",
    org: "CS Expo 2026",
    handle: "csexpo",
    date: "2026",
    year: "2026",
    tagline: "Retro-futurism for a computer science expo.",
    brief:
      "The full identity: a space-age key visual and logo, teasers and a sticker drive, die-cut stickers, fifty-plus team display pictures, officer intros, team posters and nameplates, a sponsor call, and jackets in three colourways.",
    roles: ["Logo", "Key visual", "Stickers", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    layout: "spread",
    accent: "#f08a2c",
  },
  {
    slug: "tabitayo",
    name: "Tabitayo",
    org: "Client",
    handle: "tabitayo.ph",
    date: "2026",
    year: "2026",
    tagline: "“Anong table ko?” — answered in seconds.",
    brief:
      "Brand and launch campaign for a Philippine event seat-finder: guests scan a QR code, search their name and walk to their seat. Wine-and-cream editorial type across the teaser, the how-it-works series, the app screens and the printed seating card.",
    roles: ["Brand identity", "Launch campaign", "Product marketing", "Print"],
    tools: ["Photoshop", "Illustrator"],
    layout: "mirror",
    accent: "#7a1f3d",
    href: "https://www.facebook.com/tabitayo.ph",
  },
  {
    slug: "rock-of-aces",
    name: "Rock of Aces 6.0",
    org: SCC,
    handle: "feutechscc",
    date: "2025",
    year: "2025",
    tagline: "Hot pink, loud on purpose.",
    brief:
      "The sixth annual band competition, staged for Technoweek 2025. Guitars, drums and keys burst out of a halftone starburst in hot pink and orange — carried through the band intros, partner posts, results and the thank-you.",
    roles: ["Event branding", "Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "fan",
    accent: "#ff3d8b",
    href: "https://www.facebook.com/share/p/1KiZ7sbrdp/",
  },
  {
    slug: "battle-of-the-bands",
    name: "Battle of the Bands",
    org: SCC,
    handle: "feutechscc",
    date: "Jun 2024",
    year: "2024",
    tagline: "Print, tape and torn paper.",
    brief:
      "A campus band competition at the Student Plaza. A print-and-tape collage of amps, cassette decks and vintage mics under torn-paper lettering, run across twenty posts — registration and rules, band intros, D-Day, the champions.",
    roles: ["Event branding", "Social media", "Layout"],
    tools: ["Photoshop", "Illustrator"],
    layout: "mirror",
    accent: "#a3243b",
    href: "https://www.facebook.com/share/p/1JqSHiJsb7/",
  },
  {
    slug: "biblioboo",
    name: "BiblioBOO",
    org: "FEU Tech Library",
    handle: "feutechlibrary",
    date: "Oct 2025",
    year: "2025",
    tagline: "A haunted book nook and The Isolation Room.",
    brief:
      "Halloween at the library: a ghost mascot, a detective corkboard whose game rules double as the layout, and a four-film screening series for The Isolation Room.",
    roles: ["Mascot", "Campaign", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "stickers",
    accent: "#c7924a",
  },
  {
    slug: "dystopia",
    name: "Dystopia",
    org: ACM,
    handle: "feutechacm",
    date: "Jun 2024",
    year: "2024",
    tagline: "Celebrating tech beyond the horizon.",
    brief:
      "Flagship poster for a week-long tech celebration: distressed chrome lettering over a magenta-lit skyline, with the title ghosted in reflection — carried into the sponsor thank-yous.",
    roles: ["Key visual", "Sponsor posts"],
    tools: ["Photoshop", "Illustrator"],
    layout: "cover",
    accent: "#e0399a",
    href: "https://www.facebook.com/feutechACM/posts/pfbid02YKV4nN6cKVUwPYQzWnsBac3iA8gyuX2jJfcovPQBxXt68AwZNwmZXmGkFM3Jxkvl",
  },
  {
    slug: "technorun",
    name: "TechnoRun 2025",
    org: SCC,
    handle: "feutechscc",
    date: "Sep 2025",
    year: "2025",
    tagline: "A run for a healthier FEUture.",
    brief:
      "A charity fun run at the Quirino Grandstand: an announcement carrying every distance, price and registration step, then the race kit — singlets and bibs in four colourways, one per distance.",
    roles: ["Event branding", "Apparel", "Print"],
    tools: ["Illustrator", "Photoshop"],
    layout: "kit",
    accent: "#1f9bd8",
    href: "https://www.facebook.com/share/p/19F1hRVPpk/",
  },
  {
    slug: "pacsa",
    name: "Kulay PACSA 2025",
    org: "PACSA",
    handle: "pacsa.ph",
    date: "2025",
    year: "2025",
    tagline: "Woven colour for a national convention.",
    brief:
      "A national convention of campus student advisers in Baguio. One border drawn from Filipino woven textiles carries the DP frames, the speaker line-up, announcements and slide template, and the Teachers Camp house rules.",
    roles: ["Event branding", "Templates", "DP frames"],
    tools: ["Illustrator", "Photoshop"],
    layout: "spread",
    accent: "#f07c1f",
  },
  {
    slug: "heartwired",
    name: "HeartWired",
    org: ACM,
    handle: "feutechacm",
    date: "Feb 2025",
    year: "2025",
    tagline: "Meet the hosts, scrapbook style.",
    brief:
      "A Valentine's event host reveal built as a pink scrapbook — tape, stickers, snapshots and hand-drawn hearts around each host.",
    roles: ["Social media", "Layout"],
    tools: ["Photoshop"],
    layout: "fan",
    accent: "#ff7fb0",
    href: "https://www.facebook.com/feutechACM/posts/pfbid036JJNmdNpw2UvffDhK9PmQog9RrZanMy6JWUDUudr45aLg6QowP8UH2oZUYeKt1aZl",
  },
  {
    slug: "elysium",
    name: "ACM Elysium",
    org: ACM,
    handle: "feutechacm",
    date: "2024–25",
    year: "2024",
    tagline: "One violet glow for a whole year.",
    brief:
      "The chapter's look for the 2024–25 year: soft violet gradients, chrome and script. It ran from What is ACM, the vision and the mission through the kick-off, merch, sponsors, congratulations and greetings.",
    roles: ["Org identity", "Social media", "Merch"],
    tools: ["Photoshop", "Illustrator"],
    layout: "kit",
    accent: "#9b5de5",
    href: "https://www.facebook.com/feutechACM/posts/pfbid022vVEsU35o3qXJByNrH2cEGbuNy3oYkvEF17znYsmv7BadJJK5bY73vo2jJK9U4tPl",
  },
  {
    slug: "cs-night",
    name: "CS Night 2026",
    org: ACM,
    handle: "feutechacm",
    date: "Jun 2026",
    year: "2026",
    tagline: "A masquerade for the 19th anniversary.",
    brief:
      "Performer line-up for the chapter's 19th anniversary, staged as a masquerade ball: eight acts and two hosts in gilded frames up a staircase — a billing order that reads without a single label.",
    roles: ["Key visual", "Compositing"],
    tools: ["Photoshop"],
    layout: "cover",
    accent: "#d4a64a",
    href: "https://www.facebook.com/share/p/1DqJRPbhVz/",
  },
  {
    slug: "techno-week",
    name: "Techno Week 2025",
    org: SCC,
    handle: "feutechscc",
    date: "Feb 2025",
    year: "2025",
    tagline: "Pastel Memphis, all week long.",
    brief:
      "Festival-week poster in a pastel Memphis style — overlapping colour blocks, floating app icons and a ribbon carrying the dates — with the matching frame and schedule posts.",
    roles: ["Key visual", "Social media"],
    tools: ["Photoshop", "Illustrator"],
    layout: "spread",
    accent: "#5b8def",
  },
];

export const brands: Brand[] = COPY.map((c) => {
  const a = brandAssets[c.slug];
  if (!a) throw new Error(`No assets for brand "${c.slug}" — run scripts/import-pubmats.py`);
  return { ...c, ...a };
});

export const backdropSrc = (slug: string) => `/art/backdrops/${slug}.webp`;

/** A brand's full set as one lightbox entry per piece, for /design. */
export function brandPieces(b: Brand): Project[] {
  return b.set.map((img, i) => ({
    id: `${b.slug}-${i + 1}`,
    title: `${b.name} — ${String(i + 1).padStart(2, "0")}`,
    year: b.year,
    client: b.org,
    role: b.roles.join(", "),
    tools: b.tools,
    description: b.brief,
    href: b.href,
    hrefLabel: b.href ? "See the post" : undefined,
    images: [img],
  }));
}

/* ---- More posters: one-offs that are not a brand of their own ---------- */

// Existing graphic-design entries that no brand covers, in this order.
const KEEP = [
  "techibig",
  "student-orgs-fair",
  "acm-ignition",
  "spooktechular",
  "never-again",
  "back-to-school",
  "pride-month",
  "feu-library",
  "certified-organization",
  "project-horizon",
  "artist-connection-sizes",
];

const existing = workTabs.flatMap((t) => t.projects);

const kept: Project[] = KEEP.map((id) => {
  const p = existing.find((x) => x.id === id);
  if (!p) throw new Error(`morePosters: no project "${id}" in content.ts`);
  if (id !== "feu-library") return p;
  // BiblioBOO is its own brand now; the library entry keeps the rest.
  return {
    ...p,
    images: p.images.filter((i) => !i.src.includes("biblioboo")),
    description:
      "An ongoing series for the campus library, where the brief was almost always the same: make an administrative notice worth stopping for.\n\nThe database announcement became a what-this-means-for-you list. Finals-week opening hours arrived disguised as a multiple-choice question — the schedule only turns up after the joke has landed.",
  };
});

const added: Project[] = [
  {
    id: "handog-ngiti",
    title: "Handog Ngiti 2023",
    year: "2023",
    client: "Student Coordinating Council — FEU Tech",
    role: "Event poster and thank-you post",
    tools: ["Photoshop"],
    description:
      "A Christmas gift-giving drive. Ornaments and pine set the season, and the event details sit on a red bauble so they read at a glance.",
    images: moreAssets["handog-ngiti"],
  },
  {
    id: "pixels-persona",
    title: "Pixels Persona",
    client: "Student Coordinating Council — FEU Tech",
    role: "Poster design",
    tools: ["Photoshop"],
    description: "Cosplay showdown poster — neon violet game-art characters under pixel title lettering.",
    images: moreAssets["pixels-persona"],
  },
  {
    id: "always-queer",
    title: "Always Queer",
    year: "2025",
    client: "Student Coordinating Council — FEU Tech",
    role: "Collage and layout",
    tools: ["Photoshop"],
    description: "Pride Month collage: cut-paper type, stickers and scrawled notes layered into one loud page.",
    images: moreAssets["always-queer"],
  },
  {
    id: "students-recognition",
    title: "Annual Students' Recognition 2025",
    year: "2025",
    client: "Student Coordinating Council — FEU Tech",
    role: "Poster design",
    tools: ["Photoshop", "Illustrator"],
    description: "Awards-night poster framed in Filipino woven patterns, in warm orange and gold.",
    images: moreAssets["students-recognition"],
  },
  {
    id: "womens-month-library",
    title: "Women's Month",
    year: "2025",
    client: "FEU Tech Library",
    role: "Design and retouching",
    tools: ["Photoshop"],
    description: "Women's Month feature for the library: archival portraits graded into one violet field.",
    images: moreAssets["womens-month-library"],
  },
  {
    id: "class-work",
    title: "Class design work",
    role: "Coursework",
    tools: ["Photoshop", "Illustrator"],
    description:
      "Pieces from design classes: an infographic on the Copernican revolution, a self-portrait collage, and three posters.",
    images: moreAssets["class-work"],
  },
];

export const morePosters: Project[] = [...kept, ...added];

/* ---- Videos --------------------------------------------------------------- */

export const videos: Project[] = workTabs.find((t) => t.id === "videos")?.projects ?? [];
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add lib/brands.ts components/ProjectModal.tsx components/CaseStudy.tsx
git commit -m "feat: brand showcase data — 14 brands, more posters, videos"
```

---

### Task 5: Showcase CSS

**Files:**
- Modify: `app/globals.css` (append at the end)

Unlayered CSS beats Tailwind's `@layer utilities`, so these rules never set width, position or layout on elements that also carry Tailwind classes — only frame chrome, filters and motion.

- [ ] **Step 1: Append the block**

```css
/* --- Brand showcase -------------------------------------------------------
 * Slides, mockup frames and the carousel. See components/showcase/.
 */

.bs-card {
  background-color: color-mix(in srgb, #fffaf0 90%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid color-mix(in srgb, var(--color-ink) 12%, transparent);
  box-shadow: 0 30px 60px -36px rgb(27 7 48 / 0.55);
}
/* Brand-coloured hairline across the card's top edge — decoration only. */
.bs-card::before {
  content: "";
  position: absolute;
  inset: 0 24px auto;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: var(--accent, var(--color-lavender));
}

/* Collage pieces: placed by inline style, rotated by --r. */
.bs-piece {
  position: absolute;
  transform: rotate(var(--r, 0deg));
  transition: transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
.bs-piece:hover { transform: rotate(var(--r, 0deg)) translateY(-6px) scale(1.02); z-index: 30; }

/* Inside the carousel, the backdrop fades in and pieces drop into place as
   their slide arrives; the first slide is marked active on the server. */
.carousel-slide .bs-backdrop > img { opacity: 0; transform: scale(1.04); transition: opacity 800ms ease, transform 1400ms ease; }
.carousel-slide[data-active] .bs-backdrop > img { opacity: 1; transform: none; }
.carousel-slide .bs-piece { opacity: 0; translate: 0 22px; transition: opacity 600ms ease, translate 700ms cubic-bezier(0.22, 1, 0.36, 1), transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1); transition-delay: calc(var(--i, 0) * 90ms + 150ms); }
.carousel-slide[data-active] .bs-piece { opacity: 1; translate: 0 0; }

.carousel-track { scrollbar-width: none; }
.carousel-track::-webkit-scrollbar { display: none; }

/* Phone: a feed post inside a handset. */
.phone {
  aspect-ratio: 9 / 19;
  padding: 3.2%;
  border-radius: 13% / 6%;
  background: linear-gradient(160deg, #2b2340, #120a1f);
  box-shadow: 0 30px 50px -28px rgb(27 7 48 / 0.7), inset 0 0 0 1px rgb(255 255 255 / 0.12);
}
.phone-screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 10.5% / 5%;
  background: #fff;
}
.phone-screen::before { /* the island */
  content: "";
  position: absolute;
  top: 1.6%;
  left: 50%;
  width: 30%;
  height: 2.6%;
  translate: -50% 0;
  border-radius: 999px;
  background: #120a1f;
  z-index: 2;
}

/* Printed poster: white edge, soft lift, a light sheen. */
.print { background: #fff; box-shadow: 0 28px 50px -28px rgb(27 7 48 / 0.6), 0 2px 6px rgb(27 7 48 / 0.18); }
.print-sheen { position: absolute; inset: 0; pointer-events: none; background: linear-gradient(115deg, rgb(255 255 255 / 0.28) 0%, transparent 32%, transparent 70%, rgb(27 7 48 / 0.08) 100%); }
.print-tape {
  position: absolute;
  top: -10px;
  left: 50%;
  width: 34%;
  height: 22px;
  translate: -50% 0;
  rotate: -3deg;
  background: color-mix(in srgb, #fffaf0 70%, transparent);
  box-shadow: 0 1px 2px rgb(27 7 48 / 0.15);
  z-index: 2;
}

/* Die-cut sticker: white outline traced by stacked shadows. */
.sticker {
  filter: drop-shadow(3px 0 0 #fff) drop-shadow(-3px 0 0 #fff) drop-shadow(0 3px 0 #fff) drop-shadow(0 -3px 0 #fff)
    drop-shadow(0 14px 16px rgb(27 7 48 / 0.3));
}

/* Lanyard ID: strap, punched card, photo. */
.lanyard-strap { position: absolute; left: 50%; bottom: 100%; width: 14%; height: 60%; translate: -50% 0; background: linear-gradient(90deg, #51017c, #b9379d); }
.lanyard-card { position: relative; border-radius: 10px; background: #fff; padding: 9% 7% 7%; box-shadow: 0 24px 40px -24px rgb(27 7 48 / 0.6); }
.lanyard-card::before { content: ""; position: absolute; top: 3.5%; left: 50%; width: 22%; height: 3.5%; translate: -50% 0; border-radius: 999px; background: color-mix(in srgb, var(--color-ink) 18%, transparent); }

/* Kit tile and wall frame. */
.kit-tile { background: color-mix(in srgb, #ffffff 82%, transparent); box-shadow: 0 18px 30px -22px rgb(27 7 48 / 0.55); }
.wall-frame { background: #fffaf0; padding: 4%; box-shadow: 0 0 0 3px #1b0730, 0 26px 40px -26px rgb(27 7 48 / 0.7); }
.wall-frame::before { content: ""; position: absolute; left: 50%; bottom: 100%; width: 40%; height: 18px; translate: -50% 0; border: 1px solid color-mix(in srgb, var(--color-ink) 45%, transparent); border-bottom: 0; clip-path: polygon(0 100%, 50% 0, 100% 100%); }

html[data-lite] .bs-card { backdrop-filter: none; -webkit-backdrop-filter: none; }
html[data-lite] .sticker { filter: drop-shadow(0 8px 10px rgb(27 7 48 / 0.3)); }
html[data-lite] .bs-blur { filter: none; }

@media (prefers-reduced-motion: reduce) {
  .bs-piece,
  .carousel-slide .bs-piece,
  .carousel-slide .bs-backdrop > img { transition: none; }
  .carousel-slide .bs-piece { opacity: 1; translate: 0 0; }
  .carousel-slide .bs-backdrop > img { opacity: 1; transform: none; }
}
```

- [ ] **Step 2: Confirm CSS still compiles**

Run: `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/`
Expected: `200` and no CSS error in the dev-server log.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: showcase styles — mockup frames, slide motion, carousel"
```

---

### Task 6: Picture and mockup primitives

**Files:**
- Create: `components/showcase/Pic.tsx`, `components/showcase/Mockups.tsx`

- [ ] **Step 1: `Pic.tsx`**

```tsx
import type { ProjectImage } from "@/lib/content";
import { small } from "../ProjectBento";

/**
 * A pubmat at its intrinsic ratio: the 720px copy for small slots, the full
 * file where the slot is wide. Images narrower than the sm copy get one src.
 */
export default function Pic({
  img,
  sizes,
  eager = false,
  className = "",
  alt = "",
}: {
  img: ProjectImage;
  sizes: string;
  eager?: boolean;
  className?: string;
  alt?: string;
}) {
  const sm = small(img.src);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={img.w > 720 ? sm : img.src}
      srcSet={img.w > 720 ? `${sm} 720w, ${img.src} ${img.w}w` : undefined}
      sizes={img.w > 720 ? sizes : undefined}
      width={img.w}
      height={img.h}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
```

- [ ] **Step 2: `Mockups.tsx`**

```tsx
import type { CSSProperties } from "react";
import type { ProjectImage } from "@/lib/content";
import Pic from "./Pic";

type Common = { img: ProjectImage; className?: string; style?: CSSProperties; eager?: boolean; sizes?: string };

/** A feed post inside a handset: header, the post at its own ratio, actions. */
export function PhoneFrame({ img, handle, className = "", style, eager, sizes = "(min-width: 1024px) 18vw, 40vw" }: Common & { handle: string }) {
  return (
    <figure className={`bs-piece phone ${className}`} style={style}>
      <div className="phone-screen flex flex-col">
        <div className="flex items-center gap-1.5 px-[7%] pt-[16%] pb-[4%]">
          <span aria-hidden className="h-[1.1em] w-[1.1em] shrink-0 rounded-full bg-linear-to-br from-sky to-blush" />
          <span className="type-pixel truncate text-[clamp(6px,0.7vw,9px)] text-ink/70 normal-case">{handle}</span>
        </div>
        <Pic img={img} sizes={sizes} eager={eager} className="block h-auto w-full" />
        <div aria-hidden className="flex gap-[6%] px-[7%] pt-[5%]">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[0.9em] w-[0.9em] rounded-full border-[1.5px] border-ink/50" />
          ))}
        </div>
        <div aria-hidden className="space-y-[4%] px-[7%] pt-[5%]">
          <span className="block h-[0.35em] w-[70%] rounded-full bg-ink/15" />
          <span className="block h-[0.35em] w-[45%] rounded-full bg-ink/10" />
        </div>
      </div>
    </figure>
  );
}

/** A printed poster, taped up, with a paper sheen. */
export function PrintFrame({ img, className = "", style, eager, tape = true, sizes = "(min-width: 1024px) 30vw, 60vw" }: Common & { tape?: boolean }) {
  return (
    <figure className={`bs-piece print ${className}`} style={style}>
      {tape && <span aria-hidden className="print-tape" />}
      <Pic img={img} sizes={sizes} eager={eager} className="block h-auto w-full" />
      <span aria-hidden className="print-sheen" />
    </figure>
  );
}

/** Die-cut: the image itself with a traced white edge. */
export function Sticker({ img, className = "", style, sizes = "(min-width: 1024px) 12vw, 25vw" }: Common) {
  return (
    <figure className={`bs-piece ${className}`} style={style}>
      <Pic img={img} sizes={sizes} className="sticker block h-auto w-full" />
    </figure>
  );
}

/** Event ID on a strap — for DP frames and nameplates. */
export function LanyardID({ img, className = "", style, sizes = "(min-width: 1024px) 14vw, 30vw" }: Common) {
  return (
    <figure className={`bs-piece ${className}`} style={style}>
      <span aria-hidden className="lanyard-strap" />
      <div className="lanyard-card">
        <Pic img={img} sizes={sizes} className="block h-auto w-full rounded-[6px]" />
      </div>
    </figure>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npx eslint components/showcase`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/showcase/Pic.tsx components/showcase/Mockups.tsx
git commit -m "feat: mockup primitives — phone, print, sticker, lanyard"
```

---

### Task 7: Brand collage (seven layouts)

**Files:**
- Create: `components/showcase/BrandCollage.tsx`

- [ ] **Step 1: Write the component**

```tsx
import type { CSSProperties } from "react";
import type { Brand } from "@/lib/brands";
import type { ProjectImage } from "@/lib/content";
import { LanyardID, PhoneFrame, PrintFrame, Sticker } from "./Mockups";
import Pic from "./Pic";

/** A spot in the collage box, in % of the box. `hideSm` drops it on phones. */
type Spot = { l?: string; r?: string; t?: string; b?: string; w: string; rot: number; z?: number; hideSm?: boolean };

function place(s: Spot, i: number, flip = false): CSSProperties {
  return {
    left: flip ? s.r : s.l,
    right: flip ? s.l : s.r,
    top: s.t,
    bottom: s.b,
    width: s.w,
    zIndex: s.z,
    "--r": `${flip ? -s.rot : s.rot}deg`,
    "--i": i,
  } as CSSProperties;
}

const hide = (s: Spot) => (s.hideSm ? "hidden sm:block" : "");

/* Spread: poster left, phone right, an ID and stickers around them. Mirror
   is the same arrangement flipped. */
const SPREAD = {
  print: [
    { l: "2%", t: "4%", w: "50%", rot: -4, z: 2 },
    { r: "0%", b: "0%", w: "34%", rot: 3, z: 1, hideSm: true },
    { l: "28%", b: "-2%", w: "26%", rot: -2, z: 1, hideSm: true },
  ],
  phone: [{ r: "6%", t: "4%", w: "30%", rot: 5, z: 3 }],
  id: [{ l: "42%", b: "-6%", w: "19%", rot: -8, z: 4, hideSm: true }],
  sticker: [
    { l: "-2%", b: "4%", w: "18%", rot: -10, z: 5 },
    { r: "33%", t: "-5%", w: "14%", rot: 12, z: 5, hideSm: true },
    { r: "-3%", b: "22%", w: "15%", rot: 8, z: 5, hideSm: true },
  ],
} satisfies Record<string, Spot[]>;

const FAN_PHONES: Spot[] = [
  { l: "34%", t: "0%", w: "32%", rot: 0, z: 3 },
  { l: "4%", t: "9%", w: "30%", rot: -9, z: 2 },
  { r: "4%", t: "9%", w: "30%", rot: 9, z: 2 },
];

const STICKERS = {
  print: [
    { l: "1%", t: "6%", w: "24%", rot: -5, z: 2 },
    { r: "2%", b: "2%", w: "22%", rot: 4, z: 2, hideSm: true },
  ],
  phone: [{ r: "5%", t: "0%", w: "16%", rot: 6, z: 3 }],
  sticker: [
    { l: "6%", b: "0%", w: "19%", rot: -8, z: 4 },
    { r: "27%", b: "-4%", w: "14%", rot: 10, z: 4, hideSm: true },
    { l: "28%", t: "-2%", w: "12%", rot: -12, z: 4, hideSm: true },
  ],
} satisfies Record<string, Spot[]>;

const WALL: Spot[] = [
  { l: "2%", t: "2%", w: "30%", rot: -2, z: 1 },
  { l: "35%", t: "7%", w: "30%", rot: 1, z: 1 },
  { l: "68%", t: "0%", w: "30%", rot: 2, z: 1, hideSm: true },
  { l: "16%", t: "53%", w: "30%", rot: 2, z: 1, hideSm: true },
  { l: "52%", t: "55%", w: "30%", rot: -1, z: 1, hideSm: true },
];

function Spread({ brand, eager, flip }: { brand: Brand; eager: boolean; flip: boolean }) {
  const c = brand.collage;
  let i = 0;
  return (
    <div className="relative aspect-[6/5]">
      {c.print?.slice(0, 3).map((img, k) => (
        <PrintFrame key={img.src} img={img} eager={eager && k === 0} className={hide(SPREAD.print[k])} style={place(SPREAD.print[k], i++, flip)} />
      ))}
      {c.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} eager={eager} style={place(SPREAD.phone[0], i++, flip)} />
      ))}
      {c.id?.slice(0, 1).map((img) => (
        <LanyardID key={img.src} img={img} className={hide(SPREAD.id[0])} style={place(SPREAD.id[0], i++, flip)} />
      ))}
      {c.sticker?.slice(0, 3).map((img, k) => (
        <Sticker key={img.src} img={img} className={hide(SPREAD.sticker[k])} style={place(SPREAD.sticker[k], i++, flip)} />
      ))}
    </div>
  );
}

/* Cover: the key visual huge on the right, sized to the box height so it
   bleeds off the right edge without losing its bottom. */
function Cover({ brand, eager }: { brand: Brand; eager: boolean }) {
  const key = brand.collage.key?.[0];
  if (!key) return null;
  const ar = key.w / key.h;
  const w = Math.min(64, 95 * (9 / 16) * ar);
  return (
    <div className="relative aspect-[16/9]">
      <PrintFrame img={key} eager={eager} tape={false} sizes="(min-width: 1024px) 60vw, 90vw" style={place({ r: "-3%", t: "2%", w: `${w}%`, rot: 2, z: 1 }, 0)} />
      {brand.collage.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} className="hidden sm:block" style={place({ l: "38%", b: "-8%", w: "16%", rot: -6, z: 3 }, 1)} />
      ))}
      {brand.collage.print?.slice(0, 1).map((img) => (
        <PrintFrame key={img.src} img={img} className="hidden lg:block" style={place({ l: "2%", t: "-2%", w: "20%", rot: -6, z: 0 }, 2)} />
      ))}
    </div>
  );
}

function Fan({ brand, eager }: { brand: Brand; eager: boolean }) {
  const key = brand.collage.key?.[0];
  return (
    <div className="relative aspect-[6/5]">
      {key && <PrintFrame img={key} tape={false} className="hidden sm:block" style={place({ l: "6%", b: "0%", w: "88%", rot: -2, z: 0 }, 0)} />}
      {brand.collage.phone?.slice(0, 3).map((img, k) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} eager={eager && k === 0} style={place(FAN_PHONES[k], k + 1)} />
      ))}
    </div>
  );
}

function StickerSheet({ brand, eager }: { brand: Brand; eager: boolean }) {
  const c = brand.collage;
  let i = 0;
  return (
    <div className="relative aspect-[4/3] sm:aspect-[2/1]">
      {c.print?.slice(0, 2).map((img, k) => (
        <PrintFrame key={img.src} img={img} eager={eager && k === 0} className={hide(STICKERS.print[k])} style={place(STICKERS.print[k], i++)} />
      ))}
      {c.phone?.slice(0, 1).map((img) => (
        <PhoneFrame key={img.src} img={img} handle={brand.handle} style={place(STICKERS.phone[0], i++)} />
      ))}
      {c.sticker?.slice(0, 3).map((img, k) => (
        <Sticker key={img.src} img={img} className={hide(STICKERS.sticker[k])} style={place(STICKERS.sticker[k], i++)} />
      ))}
    </div>
  );
}

/* Kit: a flat-lay grid. The lead piece spans two by two. */
function Kit({ brand, eager }: { brand: Brand; eager: boolean }) {
  const lead = brand.collage.print?.[0];
  const items: ProjectImage[] = brand.collage.item ?? [];
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3">
      {lead && (
        <figure className="bs-piece print relative col-span-2 row-span-2 self-start" style={{ position: "relative", "--i": 0 } as CSSProperties}>
          <Pic img={lead} eager={eager} sizes="(min-width: 1024px) 28vw, 60vw" className="block h-auto w-full" />
          <span aria-hidden className="print-sheen" />
        </figure>
      )}
      {items.slice(0, 8).map((img, k) => (
        <figure
          key={img.src}
          className={`bs-piece kit-tile relative flex aspect-square items-center justify-center rounded-[14px] p-2 ${k >= 4 ? "hidden sm:flex" : ""}`}
          style={{ position: "relative", "--i": k + 1 } as CSSProperties}
        >
          <Pic img={img} sizes="(min-width: 1024px) 12vw, 28vw" className="max-h-full w-auto max-w-full object-contain" />
        </figure>
      ))}
    </div>
  );
}

/* Wall: framed pieces hung salon-style. */
function Wall({ brand, eager }: { brand: Brand; eager: boolean }) {
  return (
    <div className="relative aspect-[6/5]">
      {brand.collage.card?.slice(0, 5).map((img, k) => (
        <figure key={img.src} className={`bs-piece wall-frame ${hide(WALL[k])}`} style={place(WALL[k], k)}>
          <Pic img={img} eager={eager && k === 0} sizes="(min-width: 1024px) 18vw, 40vw" className="block h-auto w-full" />
        </figure>
      ))}
    </div>
  );
}

export default function BrandCollage({ brand, eager = false }: { brand: Brand; eager?: boolean }) {
  switch (brand.layout) {
    case "spread":
      return <Spread brand={brand} eager={eager} flip={false} />;
    case "mirror":
      return <Spread brand={brand} eager={eager} flip />;
    case "cover":
      return <Cover brand={brand} eager={eager} />;
    case "fan":
      return <Fan brand={brand} eager={eager} />;
    case "stickers":
      return <StickerSheet brand={brand} eager={eager} />;
    case "kit":
      return <Kit brand={brand} eager={eager} />;
    case "wall":
      return <Wall brand={brand} eager={eager} />;
  }
}
```

Note: `.bs-piece` sets `position: absolute` (unlayered CSS); the kit grid overrides it with an inline `position: relative`, which beats the stylesheet.

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npx eslint components/showcase`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/showcase/BrandCollage.tsx
git commit -m "feat: seven collage layouts for brand slides"
```

---

### Task 8: Brand slide and copy card

**Files:**
- Create: `components/showcase/BrandSlide.tsx`

- [ ] **Step 1: Write the component**

```tsx
import type { CSSProperties } from "react";
import { backdropSrc, type Brand, type BrandLayout } from "@/lib/brands";
import { PixelArt } from "../Ethereal";
import BrandCollage from "./BrandCollage";

/*
 * Where the collage and the card sit, per layout, on large screens. Below lg
 * every layout stacks: collage first, then the card.
 */
const SHELL: Record<BrandLayout, { art: string; card: string }> = {
  spread: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  kit: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  wall: { art: "lg:col-span-7 lg:col-start-6 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1" },
  mirror: { art: "lg:col-span-7 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-8 lg:row-start-1" },
  fan: { art: "lg:col-span-7 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-8 lg:row-start-1" },
  cover: { art: "lg:col-span-12 lg:col-start-1 lg:row-start-1", card: "lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-end lg:z-10" },
  stickers: { art: "lg:col-span-12 lg:col-start-1 lg:row-start-1", card: "lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:self-center lg:z-10" },
};

const pad = (n: number) => String(n).padStart(2, "0");

/** The generated scene behind a slide, with the site's grain and sparkles over it. */
export function Backdrop({ src, eager = false }: { src: string; eager?: boolean }) {
  return (
    <div aria-hidden className="bs-backdrop absolute inset-0 -z-10 overflow-hidden bg-deep">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading={eager ? "eager" : "lazy"} decoding="async" className="h-full w-full object-cover" />
      <div className="band-grain absolute inset-0" />
      <PixelArt name="sparkle" className="twinkle absolute top-[10%] right-[6%] w-6 opacity-80" />
      <PixelArt name="sparkle" className="twinkle absolute bottom-[14%] left-[46%] w-4 opacity-70 [animation-delay:-1.8s]" />
    </div>
  );
}

export function CopyCard({ brand, n, total, link = true }: { brand: Brand; n: number; total: number; link?: boolean }) {
  return (
    <div className="bs-card relative rounded-[20px] p-6 sm:p-8" style={{ "--accent": brand.accent } as CSSProperties}>
      <p className="type-pixel flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-ink/60">
        <span>
          {pad(n)} / {pad(total)}
        </span>
        <span aria-hidden>·</span>
        <span>{brand.org}</span>
        <span aria-hidden>·</span>
        <span>{brand.date}</span>
      </p>
      <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl xl:text-7xl">{brand.name}</h3>
      <p className="type-display mt-2 text-xl text-eminence italic sm:text-2xl">{brand.tagline}</p>
      <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{brand.brief}</p>
      <ul aria-label="Role" className="mt-5 flex flex-wrap gap-1.5">
        {brand.roles.map((r) => (
          <li key={r} className="rounded-full border border-ink/15 bg-white/60 px-2.5 py-0.5 text-xs text-ink/80">
            {r}
          </li>
        ))}
      </ul>
      <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {brand.tools.join(" · ")}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {link && (
          <a href={`/design#${brand.slug}`} className="gel inline-flex min-h-[44px] items-center gap-2 px-5">
            View the full set <span aria-hidden>→</span>
          </a>
        )}
        {brand.href && (
          <a
            href={brand.href}
            target="_blank"
            rel="noopener noreferrer"
            className="type-pixel inline-flex min-h-[44px] items-center text-[11px] text-iris underline decoration-lavender/60 underline-offset-4"
          >
            See the post ↗
          </a>
        )}
      </div>
    </div>
  );
}

/** One brand, one screen: generated backdrop, the real pubmats, the copy. */
export default function BrandSlide({
  brand,
  n,
  total,
  eager = false,
  link = true,
}: {
  brand: Brand;
  n: number;
  total: number;
  eager?: boolean;
  link?: boolean;
}) {
  const shell = SHELL[brand.layout];
  return (
    <article
      aria-label={brand.name}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]"
    >
      <Backdrop src={backdropSrc(brand.slug)} eager={eager} />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className={shell.art}>
          <BrandCollage brand={brand} eager={eager} />
        </div>
        <div className={shell.card}>
          <CopyCard brand={brand} n={n} total={total} link={link} />
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Type-check and lint**

Run: `npx tsc --noEmit && npx eslint components/showcase`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/showcase/BrandSlide.tsx
git commit -m "feat: brand slide with backdrop and copy card"
```

---

### Task 9: Carousel and end slide

**Files:**
- Create: `components/showcase/Carousel.tsx`, `components/showcase/EndSlide.tsx`

- [ ] **Step 1: `Carousel.tsx`**

```tsx
"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * One slide per screen, moved by swipe, trackpad, the arrows, the pips or
 * ←/→. Native scroll-snap does the moving, so it scrolls even before JS;
 * JS tracks the current slide and marks it `data-active`, which the slides'
 * CSS uses to fade the backdrop in and drop the pieces into place.
 */
export default function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { root: el, threshold: 0.6 }
    );
    Array.from(el.children).forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [count]);

  const go = useCallback(
    (i: number) => {
      const el = track.current;
      if (!el) return;
      const next = ((i % count) + count) % count;
      const target = el.children[next] as HTMLElement | undefined;
      if (!target) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: target.offsetLeft, behavior: reduce ? "auto" : "smooth" });
    },
    [count]
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          go(active + 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          go(active - 1);
        }
      }}
    >
      <div
        ref={track}
        tabIndex={0}
        aria-label={`${label}: use the arrow keys to move between slides`}
        className="carousel-track relative flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain focus-visible:outline-offset-[-4px]"
      >
        {slides.map((s, i) => (
          <div
            key={i}
            data-i={i}
            data-active={i === active ? "" : undefined}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            className="carousel-slide relative w-full shrink-0 snap-start snap-always"
          >
            {s}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center px-4">
        <div className="glass pointer-events-auto flex max-w-full items-center gap-2 rounded-full px-2 py-1.5 shadow-[0_14px_30px_-20px_rgb(27_7_48/0.6)]">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Previous slide"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-iris transition-colors hover:bg-white/70"
          >
            <span aria-hidden>←</span>
          </button>
          <ol className="flex items-center gap-1 overflow-x-auto">
            {slides.map((_, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  className="flex h-11 w-4 cursor-pointer items-center justify-center sm:w-5"
                >
                  <span
                    aria-hidden
                    className={`block rounded-full transition-all duration-300 ${
                      i === active ? "h-2.5 w-2.5 bg-iris" : "h-1.5 w-1.5 bg-ink/30"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>
          <span className="type-pixel hidden w-14 shrink-0 text-center text-[10px] text-ink/60 tabular-nums sm:inline">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Next slide"
            className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-iris transition-colors hover:bg-white/70"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: `EndSlide.tsx`**

```tsx
import { Bellflower, Lotus, Sparkle4 } from "../Botanicals";
import { Cloud, PixelArt, Star5 } from "../Ethereal";

/** The closing slide of a carousel: the garden sky and one way onward. */
export default function EndSlide({ title, accent, note, href, label }: { title: string; accent: string; note: string; href: string; label: string }) {
  return (
    <article className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(40% 50% at 50% 55%, #fff6ea 0%, transparent 70%), linear-gradient(180deg, #c8d0f6 0%, #c9b9ec 38%, #f2b8cf 70%, #f6d3c3 100%)" }}
      >
        <Cloud className="drift-x absolute bottom-[4%] -left-[10%] w-[60%] opacity-90" />
        <Cloud className="drift-x absolute -right-[12%] bottom-[12%] w-[50%] -scale-x-100 opacity-80" />
        <div className="dither absolute inset-x-0 bottom-0 h-1/2 opacity-50" />
        <div className="band-grain absolute inset-0" />
        <Star5 className="twinkle absolute top-[18%] left-[22%] h-3 w-3 text-white" />
        <PixelArt name="sparkle" className="twinkle absolute top-[14%] right-[24%] w-8" />
        <Lotus className="sway absolute bottom-0 left-[12%] w-[18%] max-w-[220px]" deep />
        <Bellflower className="sway absolute right-[14%] bottom-0 w-[10%] max-w-[120px]" />
      </div>
      <div className="relative px-6 text-center">
        <p className="type-pixel text-[11px] text-ink/60">{note}</p>
        <p className="type-display mt-4 text-6xl text-iris sm:text-8xl">
          {title} <span className="text-lavender italic">{accent}</span>
        </p>
        <a href={href} className="gel mx-auto mt-8 inline-flex min-h-[48px] items-center gap-2 px-6">
          {label} <span aria-hidden>→</span>
        </a>
        <Sparkle4 className="spin-slow absolute -top-6 right-2 h-8 w-8 text-white" />
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Type-check and lint**

Run: `npx tsc --noEmit && npx eslint components/showcase`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/showcase/Carousel.tsx components/showcase/EndSlide.tsx
git commit -m "feat: scroll-snap carousel and closing slide"
```

---

### Task 10: Branding section on the homepage

**Files:**
- Create: `components/showcase/BrandShowcase.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: `BrandShowcase.tsx`**

```tsx
import { brands } from "@/lib/brands";
import SectionTitle from "../SectionTitle";
import BrandSlide from "./BrandSlide";
import Carousel from "./Carousel";
import EndSlide from "./EndSlide";

export default function BrandShowcase() {
  const total = brands.length;
  return (
    <section id="branding" className="relative pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="branding-heading" index="01" lead="Branding &" accent="pubmats" note={`${total} brands · swipe →`} ornament="dotButterfly" />
      </div>
      <Carousel label="Brands">
        {brands.map((b, i) => (
          <BrandSlide key={b.slug} brand={b} n={i + 1} total={total} eager={i === 0} />
        ))}
        <EndSlide note={`${total} brands · every pubmat`} title="See the" accent="full sets" href="/design" label="Open branding & pubmats" />
      </Carousel>
    </section>
  );
}
```

- [ ] **Step 2: Put it on the homepage (temporarily alongside FolderStack)**

In `app/page.tsx` import `BrandShowcase from "@/components/showcase/BrandShowcase"` and render `<BrandShowcase />` directly after `<Hero />`. (Task 15 removes `FolderStack`.)

- [ ] **Step 3: Screenshot every slide at desktop size**

The carousel is horizontally scrolled, so screenshot slide `k` by adding a tiny debug hook: open `http://localhost:3000/#branding` and use the pips. With headless Chrome, capture the section by scrolling the page to it:

```bash
shot "/#branding" .codex-scratch/branding-1440.png 1440 1000
```

Then review slides 2–15 with a short Node + Chrome DevTools script (no new dependency — Chrome's `--remote-debugging-port` and `fetch`):

`scripts/shoot-slides.mjs`:

```js
// Screenshots each slide of the carousel inside a section.
// Usage: node scripts/shoot-slides.mjs <sectionId> <outPrefix> [width] [height]
// Needs Chrome; talks to it over the DevTools protocol.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [section = "branding", prefix = ".codex-scratch/slide", W = "1440", H = "900"] = process.argv.slice(2);
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", `--window-size=${W},${H}`,
  "--remote-debugging-port=9333", "--user-data-dir=.codex-scratch/chrome", "about:blank",
]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(1500);
const [page] = await (await fetch("http://127.0.0.1:9333/json")).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d.result); };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });
const run = (expression) => send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });

await send("Page.enable");
await send("Page.navigate", { url: "http://localhost:3000/" });
await wait(5000);
await run(`document.getElementById(${JSON.stringify(section)}).querySelector('.carousel-track').scrollIntoView({block:'start'})`);
const n = (await run(`document.getElementById(${JSON.stringify(section)}).querySelectorAll('.carousel-slide').length`)).result.value;
for (let i = 0; i < n; i++) {
  await run(`(()=>{const t=document.getElementById(${JSON.stringify(section)}).querySelector('.carousel-track');t.scrollTo({left:t.children[${i}].offsetLeft,behavior:'auto'});})()`);
  await wait(1600);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(`${prefix}-${String(i + 1).padStart(2, "0")}.png`, Buffer.from(shot.data, "base64"));
}
ws.close();
chrome.kill();
console.log(`${n} slides`);
```

Run: `node scripts/shoot-slides.mjs branding .codex-scratch/brand 1440 900`
Expected: `15 slides`. Open each PNG. For every slide check: backdrop visible; copy card fully readable and not clipped; no piece covering the card's text; nothing cut off at the top under the nav; pips visible. Then run at `500 1000` and check the stacked mobile layout the same way.

Fix any overlap by adjusting that layout's `Spot` values in `BrandCollage.tsx` (positions are % of the collage box). Re-shoot until clean.

- [ ] **Step 4: Commit**

```bash
git add components/showcase/BrandShowcase.tsx app/page.tsx scripts/shoot-slides.mjs
git commit -m "feat: branding carousel on the homepage"
```

---

### Task 11: Videos section

**Files:**
- Create: `components/showcase/VideoSlide.tsx`, `components/showcase/VideoShowcase.tsx`

- [ ] **Step 1: `VideoSlide.tsx`**

```tsx
import type { Project } from "@/lib/content";
import { small } from "../ProjectBento";
import Pic from "./Pic";

const pad = (n: number) => String(n).padStart(2, "0");

/** One video, one screen: the poster in a player frame over its own blurred light. */
export default function VideoSlide({ p, n, total, eager = false }: { p: Project; n: number; total: number; eager?: boolean }) {
  const img = p.images[0];
  return (
    <article aria-label={p.title} className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:h-[100svh] lg:max-h-[960px] lg:min-h-[700px]">
      <div aria-hidden className="bs-backdrop absolute inset-0 -z-10 overflow-hidden bg-deep">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={small(img.src)} alt="" loading={eager ? "eager" : "lazy"} className="bs-blur h-full w-full scale-125 object-cover opacity-80 blur-3xl saturate-150" />
        <div className="absolute inset-0 bg-paper/30" />
        <div className="band-grain absolute inset-0" />
      </div>
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 pt-24 pb-28 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <a
          href={`/videos#${p.id}`}
          aria-label={`Watch ${p.title}`}
          className={`group relative block lg:col-span-8 ${n % 2 === 0 ? "lg:col-start-5 lg:row-start-1" : ""}`}
        >
          <span className="block overflow-hidden rounded-[14px] border border-ink/25 bg-ink shadow-[0_40px_70px_-40px_rgb(27_7_48/0.8)]">
            <span className="titlebar type-pixel flex h-7 items-center gap-2 px-3 text-[10px]">
              <span aria-hidden className="closebox" />
              <span className="tb-label mx-auto truncate normal-case">{p.id.replace(/-/g, "_")}.mov</span>
              <span className="tb-label tabular-nums">{p.duration}</span>
            </span>
            <Pic img={img} eager={eager} sizes="(min-width: 1024px) 60vw, 92vw" className="block h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
          </span>
          <span
            aria-hidden
            className="gel absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center !p-0 after:hidden"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </a>
        <div className={`bs-card relative rounded-[20px] p-6 sm:p-8 lg:col-span-4 ${n % 2 === 0 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
          <p className="type-pixel flex flex-wrap gap-x-2 text-[10px] text-ink/60">
            <span>
              {pad(n)} / {pad(total)}
            </span>
            <span aria-hidden>·</span>
            <span>{p.year}</span>
            <span aria-hidden>·</span>
            <span>{p.duration}</span>
          </p>
          <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl">{p.title}</h3>
          <p className="type-display mt-2 text-xl text-eminence italic">{p.role}</p>
          <p className="mt-4 line-clamp-5 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
          <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {p.tools?.join(" · ")}</p>
          <a href={`/videos#${p.id}`} className="gel mt-6 inline-flex min-h-[44px] items-center gap-2 px-5">
            Watch it <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: `VideoShowcase.tsx`**

```tsx
import { videos } from "@/lib/brands";
import SectionTitle from "../SectionTitle";
import Carousel from "./Carousel";
import EndSlide from "./EndSlide";
import VideoSlide from "./VideoSlide";

export default function VideoShowcase() {
  return (
    <section id="videos" className="relative pt-16 pb-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="videos-heading" index="02" lead="Moving" accent="pictures" note={`${videos.length} edits · swipe →`} />
      </div>
      <Carousel label="Videos">
        {videos.map((p, i) => (
          <VideoSlide key={p.id} p={p} n={i + 1} total={videos.length} />
        ))}
        <EndSlide note="cut in Premiere Pro, finished in After Effects" title="Watch" accent="them all" href="/videos" label="Open the video page" />
      </Carousel>
    </section>
  );
}
```

- [ ] **Step 3: Add to the homepage after `<BrandShowcase />`, then shoot**

Run: `node scripts/shoot-slides.mjs videos .codex-scratch/video 1440 900`
Expected: `8 slides`; poster and card side by side, alternating sides; text readable over the blur.

- [ ] **Step 4: Commit**

```bash
git add components/showcase/VideoSlide.tsx components/showcase/VideoShowcase.tsx app/page.tsx
git commit -m "feat: video carousel on the homepage"
```

---

### Task 12: UI/UX & code section

**Files:**
- Create: `components/showcase/CodeSlide.tsx`, `components/showcase/CodeShowcase.tsx`

- [ ] **Step 1: `CodeSlide.tsx`**

```tsx
import type { EngineeringProject } from "@/lib/content";
import { backdropSrc } from "@/lib/brands";
import { MOCKS } from "../CaseStudy";
import SiteMockup from "../SiteMockup";
import { Backdrop } from "./BrandSlide";

const pad = (n: number) => String(n).padStart(2, "0");

/** One software project as a deck screen, after ref 1's brand intro. */
export default function CodeSlide({ p, n, total }: { p: EngineeringProject; n: number; total: number }) {
  const m = MOCKS[p.visual];
  const flip = n % 2 === 0;
  return (
    <article id={`code-${p.id}`} aria-label={p.title} className="relative isolate flex min-h-[100svh] items-center overflow-hidden lg:min-h-[760px]">
      <Backdrop src={backdropSrc(`code-${p.id}`)} />
      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-8 px-4 py-24 sm:px-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div data-rv className={`focus-rv lg:col-span-7 ${flip ? "lg:col-start-1" : "lg:col-start-6"} lg:row-start-1`}>
          <SiteMockup kind={m.kind} src={m.src} src2={m.src2} alt2={`${p.title} — website intro`} url={m.url} href={p.href} alt={`${p.title} — live site`} />
        </div>
        <div className={`bs-card relative rounded-[20px] p-6 sm:p-8 lg:col-span-5 ${flip ? "lg:col-start-8" : "lg:col-start-1"} lg:row-start-1`}>
          <p className="type-pixel flex flex-wrap gap-x-2 text-[10px] text-ink/60">
            <span>
              {pad(n)} / {pad(total)}
            </span>
            <span aria-hidden>·</span>
            <span>{p.year}</span>
          </p>
          <h3 className="type-display mt-3 text-5xl text-iris sm:text-6xl xl:text-7xl">{p.title}</h3>
          <p className="type-display mt-2 text-xl text-eminence italic sm:text-2xl">{p.tagline}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
          <ul aria-label="Role" className="mt-5 flex flex-wrap gap-1.5">
            {p.role
              .split(" — ")[0]
              .split(" · ")
              .map((r) => (
                <li key={r} className="rounded-full border border-ink/15 bg-white/60 px-2.5 py-0.5 text-xs text-ink/80">
                  {r}
                </li>
              ))}
          </ul>
          <p className="type-pixel mt-3 text-[10px] text-ink/55">Stack · {p.stack.slice(0, 5).join(" · ")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`/ui-ux#${p.id}`} className="gel inline-flex min-h-[44px] items-center gap-2 px-5">
              Read the case study <span aria-hidden>→</span>
            </a>
            {p.href && (
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="type-pixel inline-flex min-h-[44px] items-center text-[11px] text-iris underline decoration-lavender/60 underline-offset-4">
                {p.hrefLabel ?? "Visit"} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
```

`EngineeringProject` must be exported from `lib/content.ts` — it is declared `export type EngineeringProject` already; confirm with `grep -n "export type EngineeringProject" lib/content.ts`.

- [ ] **Step 2: `CodeShowcase.tsx`** — stacked screens, not a carousel (spec: "same format as the reference", one screen per project)

```tsx
import { engineeringProjects } from "@/lib/content";
import SectionTitle from "../SectionTitle";
import CodeSlide from "./CodeSlide";

export default function CodeShowcase() {
  const total = engineeringProjects.length;
  return (
    <section id="code" className="relative pt-16 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        <SectionTitle id="code-heading" index="03" lead="UI/UX &" accent="code" note="designed, then built" ornament="flourish" />
      </div>
      {engineeringProjects.map((p, i) => (
        <CodeSlide key={p.id} p={p} n={i + 1} total={total} />
      ))}
      <div className="mt-10 text-center">
        <a href="/ui-ux" className="gel inline-flex min-h-[48px] items-center gap-2 px-6">
          All case studies <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to the homepage after `<VideoShowcase />`; screenshot**

```bash
shot "/#code" .codex-scratch/code-1440.png 1440 2600
```

Expected: three full screens, mockup and card alternating sides, backdrop visible, nothing overlapping.

- [ ] **Step 4: Commit**

```bash
git add components/showcase/CodeSlide.tsx components/showcase/CodeShowcase.tsx app/page.tsx
git commit -m "feat: UI/UX and code screens on the homepage"
```

---

### Task 13: Hero — the name inside the garden

**Files:**
- Rewrite: `components/Hero.tsx`

- [ ] **Step 1: Replace the file**

```tsx
import type { CSSProperties } from "react";
import { profile } from "@/lib/content";
import MorphName from "./MorphName";
import { Lotus, Leaf, Spiral, Sparkle4, Orb, LongVine, Bellflower, Blossom, Fern } from "./Botanicals";
import { Cloud, Butterfly, Orbit, ShootingStar, GlowSparkle, Star5, StarBurst, PixelFlower, Staff, PixelArt } from "./Ethereal";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const depth = (n: number, sway?: string) =>
  ({ "--depth": n, ...(sway ? { "--sway": sway } : {}) }) as CSSProperties;

/* The vine passes in front of the name in two stretches and behind it
   elsewhere: the front copy is masked down to those stretches. */
const VINE_FRONT: CSSProperties = {
  maskImage: "linear-gradient(90deg, transparent 0 16%, #000 16% 29%, transparent 29% 57%, #000 57% 70%, transparent 70%)",
  WebkitMaskImage: "linear-gradient(90deg, transparent 0 16%, #000 16% 29%, transparent 29% 57%, #000 57% 70%, transparent 70%)",
};

/**
 * One screen of garden with the name grown into it. The dawn sky fills the
 * hero; far clouds, the orbit and the pixel swirls sit behind the letters,
 * the vine weaves through them, a butterfly rests on the D, and the bed of
 * lotus and bellflowers rises in front of their lower edge. The subline and
 * the one call to action stand on the garden floor.
 *
 * Interactive layers are unchanged: the name morphs and scrambles, and the
 * garden drifts with the pointer and reacts when it comes near.
 */
export default function Hero() {
  return (
    <section className="bloom-zone relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-20">
      {/* The sky, edge to edge, fading into the page at the bottom */}
      <div
        aria-hidden
        className="sheet-fade absolute inset-0 -z-10 overflow-hidden"
        style={{
          background:
            "radial-gradient(46% 40% at 50% 34%, #fff6ea 0%, transparent 72%), linear-gradient(180deg, #dfe4fb 0%, #c8d0f6 22%, #c9b9ec 46%, #f2b8cf 70%, #f6d3c3 86%, #f3dccf 100%)",
        }}
      >
        <div className="px absolute top-[8%] right-[6%] w-[26%]" style={depth(-3)}>
          <Cloud className="drift-x dof-far w-full opacity-70" style={{ "--dur": "26s" } as CSSProperties} />
        </div>
        <div className="px absolute top-[30%] -left-[12%] w-[46%]" style={depth(-4)}>
          <Cloud className="drift-x dof-mid w-full -scale-x-100 opacity-85" style={{ "--dur": "22s", "--td": "-8s" } as CSSProperties} />
        </div>
        <div className="px absolute -right-[14%] bottom-[18%] w-[70%]" style={depth(-6)}>
          <Cloud className="drift-x w-full" style={{ "--dur": "30s", "--drift": "-36px" } as CSSProperties} />
        </div>
        <div className="absolute top-[52%] -left-[6%] w-[112%] opacity-50">
          <Staff className="drift-x w-full" />
        </div>
        <Orbit className="absolute top-[14%] left-[14%] w-[72%] opacity-70" />
        <ShootingStar className="top-[8%] left-[8%] w-[22%]" style={{ "--every": "9s", "--td": "1.5s" } as CSSProperties} />
        <div className="absolute top-[12%] right-[8%] h-16 w-16 sm:h-24 sm:w-24">
          <GlowSparkle className="twinkle dof-far h-full w-full" />
        </div>
        <Star5 className="twinkle absolute top-[10%] left-[42%] h-2.5 w-2.5 text-white" />
        <Star5 className="twinkle absolute top-[48%] left-[8%] h-3 w-3 text-white/90" />
        <StarBurst className="twinkle absolute top-[18%] left-[64%] h-4 w-4 text-white" />

        <div className="light-leak absolute inset-0" />
        <span className="bokeh drift-y absolute top-[8%] left-[6%] h-24 w-24 opacity-60" style={{ "--bk": "#ffffff", "--dur": "14s" } as CSSProperties} />
        <span className="bokeh drift-y absolute top-[44%] right-[3%] h-32 w-32 opacity-50" style={{ "--bk": "#f2b8cf", "--dur": "17s", "--td": "-5s" } as CSSProperties} />
        <span className="bokeh-ring drift-y absolute top-[14%] left-[34%] h-10 w-10" style={{ "--dur": "11s" } as CSSProperties} />
        <div className="dither absolute inset-x-0 bottom-0 h-[34%] opacity-70" />
        <div className="dither absolute inset-x-0 top-0 h-[22%] -scale-y-100 opacity-50" />
        <PixelArt name="swirl" className="absolute top-[14%] left-[5%] w-[12%] min-w-[80px] opacity-75" />
        <PixelArt name="swirl" className="absolute top-[20%] right-[6%] w-[10%] min-w-[70px] -scale-x-100 opacity-65" />
        <PixelArt name="cloud" className="drift-x absolute top-[26%] left-[26%] w-[8%] min-w-[56px] opacity-75" style={{ "--dur": "20s", "--drift": "40px" } as CSSProperties} />
        <PixelArt name="daisy" className="drift-y absolute top-[46%] right-[16%] w-[2.4%] min-w-[20px] opacity-90" style={{ "--dur": "9s" } as CSSProperties} />
        <PixelArt name="heart" className="absolute top-[40%] left-[18%] w-[1.3%] min-w-[11px] opacity-90" />
        <PixelArt name="sparkle" className="twinkle absolute top-[7%] left-[62%] w-[2.6%] min-w-[24px]" />
        <div className="band-grain absolute inset-0" />
        <Sparkle4 className="px sl-par absolute top-[16%] left-[24%] h-4 w-4 text-white" />
        <Sparkle4 className="px sl-par spin-slow absolute top-[50%] right-[20%] h-7 w-7 text-white/90" />
        <Sparkle4 className="px sl-par absolute top-[28%] right-[38%] h-3 w-3 text-white" />
      </div>

      {/* Vine, behind the name */}
      <div aria-hidden className="px sl-par pointer-events-none absolute top-[27%] -left-[6%] w-[112%] sm:top-[30%]" style={depth(-8)}>
        <LongVine className="w-full" />
      </div>

      {/* The name, in the sky */}
      <div data-rv style={d(80)} className="relative z-10 mx-auto mt-[9svh] w-full max-w-6xl px-4 text-center sm:mt-[12svh] sm:px-8">
        <div className="px relative inline-block" style={depth(4)}>
          <MorphName
            label={profile.name}
            words={[
              { text: "Lana", italic: false, className: "type-name text-[30vw] whitespace-nowrap text-iris sm:mr-[0.22em] sm:inline-block sm:text-[15vw] xl:text-[13.5rem]" },
              { text: "Denise", italic: false, className: "type-name text-[30vw] whitespace-nowrap text-iris sm:inline-block sm:text-[15vw] xl:text-[13.5rem]" },
            ]}
          />
          {/* Resting on the D */}
          <div className="absolute top-[38%] left-[2%] w-[16%] sm:top-[-14%] sm:left-[43%] sm:w-[9%]" data-react="butterfly">
            <span className="react block">
              <span className="flutter block">
                <Butterfly className="w-full rotate-[16deg]" />
              </span>
            </span>
          </div>
          <Sparkle4 className="spin-slow pointer-events-none absolute top-[4%] -right-[4%] h-8 w-8 text-sky sm:h-12 sm:w-12" />
          <Sparkle4 className="pointer-events-none absolute bottom-[8%] -left-[3%] h-5 w-5 text-lavender sm:h-7 sm:w-7" />
        </div>
      </div>

      {/* Vine, in front of the name where it crosses */}
      <div aria-hidden className="px sl-par pointer-events-none absolute top-[27%] -left-[6%] z-20 w-[112%] sm:top-[30%]" style={{ ...depth(-8), ...VINE_FRONT }}>
        <LongVine className="w-full" />
      </div>

      {/* Garden floor: the bed rises into the lower edge of the letters */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto h-[56%] max-w-[1500px] sm:h-[60%] [&_[data-react]]:pointer-events-auto">
        <div className="px sl-par absolute top-[14%] -left-[2%] w-[22%] sm:w-[15%]" style={depth(14)} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full -rotate-[28deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[6%] right-[4%] w-[20%] sm:w-[13%]" style={depth(16)} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full rotate-[152deg]" /></span>
        </div>
        <div className="px sl-par absolute right-[2%] bottom-[2%] w-[18%] sm:w-[12%]" style={depth(12, "8s")} data-react="leaf">
          <span className="react block"><Leaf className="sway w-full -rotate-[150deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[4%] left-[30%] w-[6%]" style={depth(22)}>
          <Spiral className="spin-slow w-full" />
        </div>
        <div className="px sl-par absolute top-[22%] right-[30%] w-[4.5%]" style={depth(20)}>
          <Spiral className="spin-slow w-full" stroke="#b9379d" />
        </div>
        <div className="px sl-par absolute right-[27%] bottom-[8%] w-[4.5%]" style={depth(26)} data-react="orb">
          <span className="react block"><Orb className="float-badge w-full" /></span>
        </div>
        <div className="px sl-par absolute top-[18%] left-[13%] w-[3.2%]" style={depth(30)} data-react="orb">
          <span className="react block"><Orb className="float-badge w-full" /></span>
        </div>

        <div className="px sl-par absolute bottom-[4%] left-[4%] w-[9%] sm:w-[7%]" style={depth(10, "9s")} data-react="leaf">
          <span className="react block"><Fern className="sway w-full -rotate-[14deg]" /></span>
        </div>
        <div className="px sl-par absolute right-[5%] bottom-[6%] w-[8%] sm:w-[6%]" style={depth(10, "10s")} data-react="leaf">
          <span className="react block"><Fern className="sway w-full rotate-[12deg]" /></span>
        </div>
        <div className="px sl-par absolute bottom-[10%] left-[60%] w-[5%] sm:w-[4%]" style={depth(8, "7.5s")} data-react="leaf">
          <span className="react block"><Fern className="sway dof-mid w-full rotate-[6deg] opacity-80" /></span>
        </div>

        <div className="px sl-par absolute bottom-[2%] left-[19%] w-[15%] sm:w-[10%]" style={depth(28, "8.5s")} data-react="bell">
          <span className="react block"><Bellflower className="sway w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[20%] bottom-[8%] w-[11%] sm:w-[8%]" style={depth(26, "7s")} data-react="bell">
          <span className="react block"><Bellflower className="sway w-full -rotate-[8deg]" deep /></span>
        </div>
        <div className="px sl-par absolute top-[10%] left-[44%] w-[6%] sm:w-[4%]" style={depth(18, "6s")} data-react="bell">
          <span className="react block"><Bellflower className="sway dof-mid w-full rotate-[10deg]" /></span>
        </div>
        <div className="px sl-par absolute top-[24%] left-[6%] w-[7%] sm:w-[4.5%]" style={depth(24)} data-react="blossom">
          <span className="react block"><Blossom className="spin-slow w-full" deep /></span>
        </div>
        <div className="px sl-par absolute top-[36%] right-[12%] w-[5%] sm:w-[3.2%]" style={depth(20)} data-react="blossom">
          <span className="react block"><Blossom className="w-full" /></span>
        </div>

        <div className="px absolute top-[2%] left-[38%] w-[5%] sm:w-[3.2%]" style={depth(22)} data-react="pixel">
          <span className="react block"><PixelFlower className="drift-y w-full" /></span>
        </div>
        <div className="px absolute top-[40%] left-[2%] w-[3.4%] sm:w-[2.2%]" style={depth(16)} data-react="pixel">
          <span className="react block"><PixelFlower className="w-full opacity-90" /></span>
        </div>

        <div className="px absolute top-[30%] left-[24%] w-[5%] sm:w-[3.2%]" style={{ ...depth(10), "--dur": "9s", "--td": "-3s", "--flap": "1.2s" } as CSSProperties} data-react="butterfly">
          <span className="react block">
            <span className="flutter block">
              <Butterfly className="dof-mid w-full -rotate-[18deg]" style={{ "--flap": "1.3s" } as CSSProperties} />
            </span>
          </span>
        </div>

        <div className="px sl-par absolute bottom-0 left-[31%] w-[38%] sm:left-[36%] sm:w-[28%]" style={depth(24)} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[13%] bottom-[5%] w-[17%] sm:w-[12%]" style={depth(34, "9s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" deep /></span>
        </div>
        <div className="px sl-par absolute bottom-[8%] left-[16%] w-[13%] sm:w-[9%]" style={depth(30, "8s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" deep /></span>
        </div>
        <div className="px sl-par absolute bottom-[4%] left-[30%] w-[9%] sm:w-[6%]" style={depth(38, "10s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" /></span>
        </div>
        <div className="px sl-par absolute right-[28%] bottom-[2%] w-[8%] sm:w-[5.5%]" style={depth(40, "6.5s")} data-react="lotus">
          <span className="react block"><Lotus className="sway w-full" /></span>
        </div>

        <div className="px pointer-events-none absolute -bottom-[8%] -left-[4%] w-[16%] sm:w-[11%]" style={depth(60)}>
          <Blossom className="dof-near w-full" deep />
        </div>
        <div className="px pointer-events-none absolute -right-[3%] -bottom-[4%] w-[9%] sm:w-[6%]" style={depth(56)}>
          <Blossom className="dof-near w-full" />
        </div>
      </div>

      {/* On the garden floor: the subline and the one call to action */}
      <div className="relative z-30 mx-auto mt-auto mb-[7svh] w-full max-w-3xl px-4 text-center">
        <div className="rounded-[28px] bg-[radial-gradient(closest-side,rgb(255_250_240/0.9),rgb(255_250_240/0.55)_70%,transparent)] px-6 py-6">
          <p data-rv style={d(420)} className="type-display text-2xl leading-tight text-ink italic sm:text-[2.4rem]">
            {profile.heroShort}
          </p>
          <div data-rv style={d(480)} className="mt-6 flex justify-center">
            <a href="#branding" className="gel flex min-h-[46px] items-center gap-2 px-5">
              See the work <span aria-hidden>↓</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Screenshot desktop and small screen; tune**

```bash
shot / .codex-scratch/hero-1440.png 1440 900
shot / .codex-scratch/hero-500.png 500 1000
```

Check: the name sits in the sky with clouds/orbit visibly behind it; the vine passes in front of two letter stretches and behind the rest; the butterfly rests on top of the "D"; leaves/flowers overlap only the lower edge of the letters and never cover more than ~20% of any letter; subline and button fully visible inside the first screen; on 500px the name is two lines. Adjust `top-[…]` of the vine copies (both must match), the butterfly position, and the floor `h-[…]` until it reads well.

- [ ] **Step 3: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: hero as one garden scene with the name grown into it"
```

---

### Task 14: Nav, About index, Thank-you

**Files:**
- Modify: `components/Nav.tsx`, `components/AboutPanel.tsx:36`, `components/Contact.tsx:42`

- [ ] **Step 1: Nav links**

Replace the `LINKS` array and make hrefs work from sub-pages:

```tsx
const LINKS = [
  { id: "branding", label: "branding", n: "01" },
  { id: "videos", label: "videos", n: "02" },
  { id: "code", label: "ui/ux", n: "03" },
  { id: "about", label: "about", n: "04" },
  { id: "contact", label: "contact", n: "05" },
];
```

Add `import { usePathname } from "next/navigation";`, then at the top of `Nav()`:

```tsx
const pathname = usePathname();
const home = pathname === "/";
const href = (id: string) => (home ? `#${id}` : `/#${id}`);
```

In the JSX make exactly these three edits:

- `<a href="#top" className="group flex …">` → `<a href={home ? "#top" : "/"} className="group flex …">`
- `<li key={l.href}>` → `<li key={l.id}>`
- `<a href={l.href}` → `<a href={href(l.id)}`

Leave `href="#contact"` on "Hire me" as it is — every page ends with the contact section.

- [ ] **Step 2: Section indices and the closing title**

`components/AboutPanel.tsx`: `index="02"` → `index="04"`.

`components/Contact.tsx`: replace the SectionTitle line with

```tsx
<SectionTitle id="contact-heading" index="05" lead="Thank" accent="you!" note="let's make something" ornament="flourish" />
```

- [ ] **Step 3: Lint and screenshot the nav on `/` and on a sub-page (after Task 16)**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/Nav.tsx components/AboutPanel.tsx components/Contact.tsx
git commit -m "feat: nav for the new sections, thank-you closing"
```

---

### Task 15: Homepage order, remove FolderStack

**Files:**
- Modify: `app/page.tsx`
- Delete: `components/FolderStack.tsx`

- [ ] **Step 1: Final `app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import BrandShowcase from "@/components/showcase/BrandShowcase";
import VideoShowcase from "@/components/showcase/VideoShowcase";
import CodeShowcase from "@/components/showcase/CodeShowcase";
import AboutPanel from "@/components/AboutPanel";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import ScrollVine from "@/components/ScrollVine";
import GardenFX from "@/components/GardenFX";

export default function Home() {
  return (
    <main id="top">
      {/* intro -> branding -> videos -> ui/ux & code -> about -> thank you */}
      <Hero />
      <BrandShowcase />
      <VideoShowcase />
      <CodeShowcase />
      <AboutPanel />
      <Contact />
      <ScrollFX />
      <ScrollVine />
      <GardenFX />
    </main>
  );
}
```

- [ ] **Step 2: Delete `components/FolderStack.tsx` and confirm nothing imports it**

Run: `git rm components/FolderStack.tsx && grep -rn "FolderStack" app components lib`
Expected: no matches.

- [ ] **Step 3: Full-page screenshot**

```bash
shot / .codex-scratch/home-full.png 1440 9000
```

Expected order: hero → Branding & pubmats → Moving pictures → UI/UX & code → About me → Thank you!

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: homepage in showcase order; retire the folder tabs"
```

---

### Task 16: `/design`, `/videos`, `/ui-ux` pages

**Files:**
- Create: `components/showcase/SetGallery.tsx`, `components/showcase/VideoEmbed.tsx`
- Create: `app/design/page.tsx`, `app/videos/page.tsx`, `app/ui-ux/page.tsx`
- Modify: `app/sitemap.ts`

- [ ] **Step 1: `SetGallery.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import ProjectBento from "../ProjectBento";
import ProjectModal from "../ProjectModal";

/** The justified gallery and its lightbox, for one list of pieces. */
export default function SetGallery({ items, heading, blurb }: { items: Project[]; heading: string; blurb: string }) {
  const [sel, setSel] = useState<Project | null>(null);
  return (
    <>
      <ProjectBento projects={items} heading={heading} blurb={blurb} onOpen={setSel} />
      <ProjectModal project={sel} categoryLabel={heading} onClose={() => setSel(null)} />
    </>
  );
}
```

- [ ] **Step 2: `VideoEmbed.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Project } from "@/lib/content";
import { toEmbed } from "../ProjectModal";
import Pic from "./Pic";

/** Poster first; the Drive player loads only when asked for. */
export default function VideoEmbed({ p }: { p: Project }) {
  const [on, setOn] = useState(false);
  const src = p.videoUrl ? toEmbed(p.videoUrl) : null;
  return (
    <div className="relative overflow-hidden rounded-[14px] border border-ink/25 bg-ink" style={{ aspectRatio: "16 / 9" }}>
      {on && src ? (
        <iframe src={src} title={p.title} allow="autoplay; fullscreen" allowFullScreen className="absolute inset-0 h-full w-full" />
      ) : (
        <button type="button" onClick={() => setOn(true)} disabled={!src} aria-label={`Play ${p.title}`} className="group absolute inset-0 cursor-pointer">
          <Pic img={p.images[0]} sizes="(min-width: 1024px) 60vw, 92vw" className="h-full w-full object-cover" />
          <span aria-hidden className="gel absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center !p-0 after:hidden">
            <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: `app/design/page.tsx`**

```tsx
import type { Metadata } from "next";
import { brands, brandPieces, morePosters } from "@/lib/brands";
import BrandSlide from "@/components/showcase/BrandSlide";
import SetGallery from "@/components/showcase/SetGallery";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";
import GardenFX from "@/components/GardenFX";

export const metadata: Metadata = {
  title: "Branding & pubmats — Lana Denise Huertas",
  description: "Event identities, campaigns and publication materials by Lana Denise Huertas — every brand and its full set of pubmats.",
  alternates: { canonical: "/design" },
};

export default function DesignPage() {
  const total = brands.length;
  return (
    <main id="top">
      <header className="mx-auto max-w-6xl px-4 pt-32 pb-6 sm:px-8">
        <SectionTitle id="design-heading" index="01" lead="Branding &" accent="pubmats" note={`${total} brands · every piece`} ornament="dotButterfly" />
        <nav aria-label="Brands" className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <a key={b.slug} href={`#${b.slug}`} className="rounded-full border border-ink/15 bg-white/60 px-3 py-1.5 text-sm text-ink/80 transition-colors hover:border-lavender hover:text-iris">
              {b.name}
            </a>
          ))}
          <a href="#more" className="rounded-full border border-ink/15 bg-white/60 px-3 py-1.5 text-sm text-ink/80 transition-colors hover:border-lavender hover:text-iris">
            More posters
          </a>
        </nav>
      </header>

      {brands.map((b, i) => (
        <section key={b.slug} id={b.slug} aria-label={b.name} className="scroll-mt-16">
          <BrandSlide brand={b} n={i + 1} total={total} eager={i === 0} link={false} />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-8">
            <SetGallery items={brandPieces(b)} heading={b.name} blurb={b.brief} />
          </div>
        </section>
      ))}

      <section id="more" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16 sm:px-8">
        <SectionTitle id="more-heading" index="+" lead="More" accent="posters" note="one-offs and class work" />
        <SetGallery items={morePosters} heading="More posters" blurb="Single posters and announcements that are not part of a larger campaign." />
      </section>

      <Contact />
      <ScrollFX />
      <GardenFX />
    </main>
  );
}
```

- [ ] **Step 4: `app/videos/page.tsx`**

```tsx
import type { Metadata } from "next";
import { videos } from "@/lib/brands";
import VideoEmbed from "@/components/showcase/VideoEmbed";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "Videos — Lana Denise Huertas",
  description: "Documentary essays, instructional series, trailers and music videos edited by Lana Denise Huertas.",
  alternates: { canonical: "/videos" },
};

export default function VideosPage() {
  return (
    <main id="top">
      <div className="mx-auto max-w-6xl px-4 pt-32 sm:px-8">
        <SectionTitle id="videos-heading" index="02" lead="Moving" accent="pictures" note={`${videos.length} edits`} />
      </div>
      <div className="mx-auto max-w-6xl divide-y divide-ink/10 px-4 sm:px-8">
        {videos.map((p) => (
          <article key={p.id} id={p.id} className="grid scroll-mt-20 gap-8 py-14 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <VideoEmbed p={p} />
            </div>
            <div className="lg:col-span-4">
              <p className="type-pixel text-[10px] text-ink/60">
                {p.year} · {p.duration}
              </p>
              <h2 className="type-display mt-3 text-5xl text-iris">{p.title}</h2>
              <p className="type-display mt-2 text-xl text-eminence italic">{p.role}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink/80">{p.description}</p>
              <p className="type-pixel mt-3 text-[10px] text-ink/55">Tools · {p.tools?.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
      <Contact />
      <ScrollFX />
    </main>
  );
}
```

- [ ] **Step 5: `app/ui-ux/page.tsx`**

```tsx
import type { Metadata } from "next";
import CaseStudy from "@/components/CaseStudy";
import SectionTitle from "@/components/SectionTitle";
import Contact from "@/components/Contact";
import ScrollFX from "@/components/ScrollFX";

export const metadata: Metadata = {
  title: "UI/UX & code — Lana Denise Huertas",
  description: "Case studies: products Lana Denise Huertas designed and built, from clinical screening to a math battle game.",
  alternates: { canonical: "/ui-ux" },
};

export default function UiUxPage() {
  return (
    <main id="top">
      <div className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-8">
        <SectionTitle id="code-heading" index="03" lead="UI/UX &" accent="code" note="designed, then built" ornament="flourish" />
        <CaseStudy />
      </div>
      <Contact />
      <ScrollFX />
    </main>
  );
}
```

The homepage `CodeSlide` links to `/ui-ux#<id>`. Give each case-study article that anchor: in `components/CaseStudy.tsx` add `id={p.id}` and `className="… scroll-mt-20"` to the `<article>`.

- [ ] **Step 6: Sitemap**

```ts
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: siteUrl, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/design`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/videos`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/ui-ux`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
```

- [ ] **Step 7: Screenshot the pages**

```bash
shot /design .codex-scratch/design.png 1440 6000
shot /videos .codex-scratch/videos.png 1440 4000
shot /ui-ux .codex-scratch/uiux.png 1440 4000
shot /design .codex-scratch/design-500.png 500 4000
```

Check: brand jump-links work; each brand shows its slide then its full gallery; the lightbox opens on click (test manually at http://localhost:3000/design); the video poster swaps to the player on click; nav links go back to `/#…`.

- [ ] **Step 8: Commit**

```bash
git add components/showcase/SetGallery.tsx components/showcase/VideoEmbed.tsx app/design app/videos app/ui-ux app/sitemap.ts components/CaseStudy.tsx
git commit -m "feat: full design, video and UI/UX pages"
```

---

### Task 17: Verification

- [ ] **Step 1: Asset check**

Run: `node scripts/check-brands.mjs`
Expected: `ok — <n> images, 17 backdrops`

- [ ] **Step 2: Types, lint, production build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass; build lists `/`, `/design`, `/videos`, `/ui-ux`.

- [ ] **Step 3: No horizontal overflow**

`scripts/check-overflow.mjs` (same DevTools pattern as `shoot-slides.mjs`):

```js
// Fails if any page scrolls sideways at common widths.
// Usage: node scripts/check-overflow.mjs
import { spawn } from "node:child_process";

const PAGES = ["/", "/design", "/videos", "/ui-ux"];
const WIDTHS = [500, 768, 1024, 1440, 1920];
const chrome = spawn("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new", "--disable-gpu", "--hide-scrollbars", "--window-size=1440,900",
  "--remote-debugging-port=9334", "--user-data-dir=.codex-scratch/chrome-ovf", "about:blank",
]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(1500);
const [page] = await (await fetch("http://127.0.0.1:9334/json")).json();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); pending.get(d.id)?.(d.result); };
const send = (method, params = {}) => new Promise((r) => { pending.set(++id, r); ws.send(JSON.stringify({ id, method, params })); });

let bad = 0;
for (const w of WIDTHS) {
  await send("Emulation.setDeviceMetricsOverride", { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 768 });
  for (const p of PAGES) {
    await send("Page.navigate", { url: `http://localhost:3000${p}` });
    await wait(3500);
    const r = await send("Runtime.evaluate", { expression: "document.documentElement.scrollWidth - innerWidth", returnByValue: true });
    const over = r.result.value;
    if (over > 0) { bad++; console.log(`OVERFLOW ${p} @ ${w}px: ${over}px`); }
  }
}
ws.close();
chrome.kill();
console.log(bad ? `${bad} overflow(s)` : "no horizontal overflow");
process.exit(bad ? 1 : 0);
```

Run: `node scripts/check-overflow.mjs`
Expected: `no horizontal overflow`. (Chrome's emulation goes below its 500px window minimum, so you can also add 375 and 320 to `WIDTHS`.)

- [ ] **Step 4: Keyboard pass (manual, in a real browser)**

Tab to the branding carousel; ←/→ move slides; Tab reaches arrows and pips; on `/design`, Enter on a tile opens the lightbox, Esc closes it and focus returns.

- [ ] **Step 5: Reduced motion**

In Chrome DevTools → Rendering → "Emulate prefers-reduced-motion: reduce", reload: slides switch without crossfade, pieces are visible immediately.

- [ ] **Step 6: Update docs**

In `docs/design-decisions.md` replace the "Page order" list with the new order and add a short "Brand showcase" section pointing to the spec. In `README.md` replace the "Adding a project" section's first paragraph with: brands are added via `scripts/pubmats.json` + `scripts/backdrops.json` + `COPY` in `lib/brands.ts`, then `python -I scripts/import-pubmats.py` and `python -I scripts/gen-backdrops.py`.

- [ ] **Step 7: Commit**

```bash
git add docs/design-decisions.md README.md scripts/check-overflow.mjs
git commit -m "docs: brand showcase structure and how to add a brand"
```
