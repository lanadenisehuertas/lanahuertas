# Grading rubric for the portfolio and its references

The same rubric is used on Lana's reference sites and on our own build, so the scores can be compared. Score each criterion from 1 (poor) to 5 (excellent) and give one line of evidence for each score: what you saw, where, and a number where one exists. A score without evidence does not count.

## How to look

Use Playwright (Python, `sync_playwright`, `channel="chrome"`, headless) at 1440×900 and at 390×844.

1. **Stills.** Scroll the page from top to bottom in steps of one viewport, waiting 1.5 s at each step, and save a PNG of each. For pages that scroll inside a container or ignore `scrollTo`, use `page.mouse.wheel`.
2. **Busyness.** Run `python "C:/Users/Lana/AppData/Local/Temp/claude/a106e1d8ce434dbd/493cf6da-5ec2-4eb5-9ea2-65787c2c5136/scratchpad/v3/metrics.py" <png…>` on the 1440 stills. It prints `calm` (percent of the screen with almost no detail), `busy` (percent with heavy detail), `hues`, `sat`, `lum`. Report the median and the range per site.
3. **Motion on load.** Reload, then take 12 screenshots 150 ms apart. Describe what changes between them.
4. **Motion on scroll.** At three places down the page, scroll 300 px with the wheel in ten small steps, with a screenshot after each. Say what moves relative to the page: nothing (plain scroll), a layer at a different speed, something pinned, something scrubbed by the scroll, something revealed once.
5. **Motion on hover and click.** Hover and click the three or four most prominent interactive things (navigation, a project, the hero object). Screenshot before, during (100 ms and 400 ms) and after. Say what responds and roughly how long it takes.
6. **Idle motion.** Leave the page still for 3 s and compare two screenshots 1.5 s apart: does anything move on its own, and how much of the screen?
7. **Count.** Per 1440×900 screen: how many separate things compete for attention (headings, images, objects, buttons), how many font families, how many pieces of work are visible. Page length in screens. Clicks or scrolls from the first screen to a real piece of work.

Look at your screenshots with the Read tool before you score. Do not score from the DOM alone.

## A. Interface and experience

| # | Criterion | 5 means |
|---|---|---|
| A1 | First screen | In five seconds you know who this is, what they do and what to do next. |
| A2 | Path to the work | Real work is one scroll or one click from the first screen. |
| A3 | Orientation | You always know where you are and how to get elsewhere. |
| A4 | Reading | Text is large enough, short enough per line, and has strong contrast with what is behind it. |
| A5 | Calm | Each screen has one clear focus and room around it; nothing fights for attention. |
| A6 | Consistency | Buttons, cards and labels look and behave the same everywhere. |
| A7 | Phone | The 390 px version is a designed page, not a squeezed one. |
| A8 | Plain path | Someone in a hurry, or with motion turned off, still gets everything. |

## B. Graphic design

| # | Criterion | 5 means |
|---|---|---|
| B1 | Idea | One concept you can say in a sentence, carried through the whole site. |
| B2 | Composition | Every screen has a clear hierarchy: one thing first, then second, then the rest. |
| B3 | Colour | A small, deliberate palette; most of the screen is the ground colour, accents are rare. |
| B4 | Type | Few faces, a clear scale, and the display type has character. |
| B5 | Image-making | Illustration, photography and objects are well made and belong to one world. |
| B6 | Space | Empty space is used on purpose; density changes from screen to screen (rich, then quiet). |
| B7 | Finish | Edges, alignment, shadows and spacing are precise; nothing looks unfinished. |

## C. Movement

| # | Criterion | 5 means |
|---|---|---|
| C1 | Purpose | Everything that moves has a cause (you scrolled, pointed, clicked) and tells you something. |
| C2 | Amount | Few things move at once; long stretches are still. |
| C3 | Timing | Movement is quick and eased; nothing drags or snaps. |
| C4 | Scroll | Scrolling feels like going somewhere, and never fights the wheel. |
| C5 | Feedback | Things you can press show it on hover and on press. |
| C6 | Entrance | The page arrives in a composed way, once. |
| C7 | Rest | After a moment of motion the screen settles so you can read. |

## What to hand back

A Markdown file with, for each site: the facts from "How to look" (numbers first), the three score tables with evidence, and then **"What makes it work"** (three to five concrete techniques, each described precisely enough to rebuild: what is on screen, where, how big, what moves and how) and **"What it avoids"** (things it leaves out that a busier site would add). End the file with a cross-site summary: the median score per criterion, and the patterns shared by the sites that score 4 or more on A5, B6 and C2.
