"""Painted art for the ribbon-garden redesign, generated with Codex.

Every asset shares one style sheet (STYLE) and the same reference posters, so
the set reads as one illustrator's hand. Output: raw PNGs in a work folder;
pick, clean and convert the keepers to webp under public/art/garden/.

Run one asset:  python -I scripts/gen-garden-art.py <name> <workdir> [refs...]
Names: see ASSETS.
"""
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from codex_image import generate_png  # noqa: E402

STYLE = (
    "Style: MATTE hand-painted illustration in the manner of the attached posters (the earphones-on-vinyl "
    "poster and the headphone-girl illustrations): soft airbrushed gradient shading that gives gentle "
    "volume, a clearly visible fine grain / noise texture over every surface like risograph or gouache on "
    "paper, clean soft edges, muted dreamy pastel palette (aqua #9fd8d0, periwinkle #9aa6e8, lavender "
    "#b7a3e6, dusty pink #e9a6c4, peach #f2c4a8, soft cream #fbefd8). Absolutely NO glossy highlights, "
    "NO shine, NO glow, NO bloom, NO sparkles, NO glitter, NO lens flare, NO 3D render look, NOT a game "
    "asset. Natural and calm. On a fully TRANSPARENT background (PNG with alpha): no backdrop, no frame, "
    "no text, no letters, no watermark."
)

ASSETS = {
    "ribbon-wrap": "ONE long satin silk ribbon forming a loose open spiral loop, as if it is wrapping "
    "around an invisible tall arched window: it passes behind on the left, curls forward across the "
    "middle, and trails off at the top right. Pink at one end fading through lavender to white, "
    "visible folds and twists where the back of the ribbon shows slightly darker, tapered fluttering "
    "ends. Portrait canvas, ribbon filling most of it.",
    "ribbon-sweep": "ONE long satin silk ribbon flowing horizontally in a lazy S-curve across a wide "
    "canvas, with two soft twists and one fold; colour shifting lavender to pink to peach to aqua along "
    "its length; tapered ends that flutter; a few tiny sparkles caught on it. Wide landscape canvas, "
    "ribbon spanning edge to edge.",
    "earbuds": "TWO white wired earbuds hanging straight down on long thin white cords that come from "
    "the very top edge of the canvas, at slightly different heights, each with a small pink accent "
    "stripe and a glowing warm-gold thin orbit ring circling it at a tilt. A few small white music notes "
    "float near them. Tall portrait canvas.",
    "vinyl": "A vinyl record seen exactly from straight above (a perfect circle, so it can be rotated), "
    "deep muted indigo with subtle concentric grooves, a dusty pink and cream label with a small lotus "
    "drawn on it, no tonearm, nothing else. Square canvas, record filling it.",
    "arch-frame": "An ornate tall arched window frame made of pearlescent glass with teal and soft gold "
    "trim, a lotus motif at the top keystone, small glowing stars on the frame, the INSIDE of the arch "
    "completely empty and transparent (a hole) so a photo can show through it. Portrait canvas, frame "
    "filling it.",
    "lotus-cluster": "A cluster of painted lotus flowers in pink and white with two lotus buds, three "
    "round teal lily pads, and a few reeds, gentle glow on the petals, arranged as a low wide bed. "
    "Landscape canvas.",
    "cloud-bank": "A long low bank of soft painted clouds in pink, lavender and peach with white "
    "highlighted tops and a teal shadow underneath, flat bottom edge so it can sit along the bottom of "
    "a page. Very wide landscape canvas.",
    "crane": "A graceful red-crowned crane in flight, white wings with pink and peach painted feather "
    "tips, a long pink silk ribbon trailing from its body in a curve behind it. Landscape canvas.",
    "peanut-sleep": "Peanut, a small fluffy ORANGE tabby cat (ginger with soft darker orange stripes, cream "
    "chin and paws, pink nose), curled up asleep in a round loaf, eyes gently closed, tail wrapped around "
    "her paws, sitting on a small soft pink-and-lavender cloud cushion. Seen from the side, slightly above. "
    "Same painted matte grainy treatment as the attached earbuds, lotus and clouds. Square canvas.",
    "peanut-awake": "Peanut, a small fluffy ORANGE tabby cat (ginger with soft darker orange stripes, cream "
    "chin and paws, pink nose, round amber eyes), sitting upright and alert on a small soft pink-and-lavender "
    "cloud cushion, head tilted curiously, one paw slightly raised, tail curling up. Same painted matte grainy "
    "treatment as the attached earbuds, lotus and clouds. Square canvas.",
    "yarn": "A plump ball of soft pastel pink yarn with visible wound strands, a lavender crochet hook pushed "
    "through it, a small crocheted cream flower with a peach centre resting beside it, and a loose yarn tail "
    "trailing off to the right edge of the canvas. Same painted matte grainy treatment as the attached "
    "earbuds, lotus and clouds. Landscape canvas.",
    "mic": "A vintage round studio microphone (cream and soft gold mesh head) on a short stand, with a small "
    "spray of pink lotus buds and leaves tucked around its stand, two small white music notes beside it. "
    "Same painted matte grainy treatment as the attached earbuds, lotus and clouds. Portrait canvas.",
    "bass": "The headstock and upper neck of an electric bass guitar, four tuning pegs, pale periwinkle "
    "lacquer with a cream fretboard and four strings, angled diagonally from bottom-left to top-right, with "
    "a soft pink ribbon tied around the neck. Same painted matte grainy treatment as the attached earbuds, "
    "lotus and clouds. Landscape canvas, the neck running off the bottom-left edge.",
    "peanut-perch": "Peanut, the SAME small fluffy ORANGE tabby cat as the attached Peanut reference (ginger with "
    "soft darker orange stripes, cream chin and paws, pink nose, round amber eyes), sitting on the very edge of an "
    "invisible shelf, seen in three-quarter view facing the viewer, front paws together, her long striped tail hanging "
    "straight DOWN below the edge. Nothing under her: the bottom of her body is a clean horizontal line where she sits. "
    "Same painted matte grainy treatment as the attached art. Portrait canvas.",
    "peanut-play": "Peanut, the SAME small fluffy ORANGE tabby cat as the attached Peanut reference (ginger with soft "
    "darker orange stripes, cream chin and paws, pink nose, round amber eyes), crouched low in a playful pounce, rear "
    "up, one front paw raised to bat at something to her right, ears forward, tail curled up. No ground, no shadow, "
    "no props. Same painted matte grainy treatment as the attached art. Landscape canvas.",
    "peanut-peek": "Peanut, the SAME small fluffy ORANGE tabby cat as the attached Peanut reference (ginger with soft "
    "darker orange stripes, cream chin and paws, pink nose, round amber eyes), peeking up over a horizontal edge: only "
    "her head, ears and two front paws resting on the edge are visible, the rest of her hidden below, so the image is "
    "cut by a clean straight horizontal line at the bottom. Curious, eyes wide. Same painted matte grainy treatment as "
    "the attached art. Landscape canvas.",
    # Second pass at Peanut: the first ones read as realistic fur. These are
    # stylised like the lotus and clouds: simple shapes, no fur strands.
    "peanut2-sleep": "Peanut, a small ORANGE tabby cat, curled up asleep in a round loaf on a small soft pink-and-lavender "
    "cloud cushion, eyes closed as two little curved lines, tail wrapped around her. " + "{CAT}" + " Square canvas.",
    "peanut2-perch": "Peanut, a small ORANGE tabby cat, sitting upright on the very edge of an invisible shelf, facing the "
    "viewer in three-quarter view, front paws together, head tilted a little, her long striped tail hanging straight DOWN "
    "below the edge. Nothing under her: the bottom of her body is a clean horizontal line. " + "{CAT}" + " Portrait canvas.",
    "peanut2-awake": "Peanut, the SAME stylised small ORANGE tabby cat as the attached sleeping Peanut, now awake and "
    "sitting up on the SAME soft pink-and-lavender cloud cushion, head tilted curiously, round eyes open, one paw slightly "
    "raised, tail curling around. Same framing, size and cushion as the sleeping one, so the two can cross-fade. " + "{CAT}"
    + " Landscape canvas, about 5:4.",
    "peanut2-peek": "Peanut, a small ORANGE tabby cat, peeking up over a horizontal edge: only her head, ears and two front "
    "paws resting on the edge are visible, cut by a clean straight horizontal line at the bottom. Curious. " + "{CAT}"
    + " Landscape canvas.",
}

# Third pass: v1 read as a photo, v2 as a flat cartoon. The middle: painted
# like the lotus, earbuds and yarn, about one-fifth realistic.
CAT3 = (
    "Paint her SEMI-STYLISED, about 20% realistic and 80% illustration, in EXACTLY the same matte airbrushed technique "
    "as the attached lotus flowers, earbuds and yarn: soft volumetric airbrush shading that gives real roundness, a "
    "visible fine paper grain over everything, gentle pastel light from the upper left with a faint lavender bounce "
    "light in the shadows. Real kitten proportions, slightly simplified and softened. Fur suggested by soft gradient "
    "shading plus a few painted tufts at the cheeks, chest and tail tip; NO individual strand-by-strand fur, NO photo "
    "detail, but also NOT flat vector cartoon shapes and NO outlines. Warm amber eyes with one small soft highlight, "
    "small pink nose, cream muzzle and paws, ginger body with soft darker orange tabby bands."
)
for _n, _d in {
    "peanut3-sleep": "Peanut, a small ORANGE tabby cat, curled up asleep in a round loaf on a small soft pink-and-lavender "
    "cloud cushion, eyes closed, tail wrapped around her. Square canvas.",
    "peanut3-awake": "Peanut, the SAME cat as the attached sleeping Peanut, now awake and sitting up on the SAME cloud "
    "cushion, head tilted curiously, eyes open, one paw slightly raised, tail curled around. Same framing and size as "
    "the sleeping one so the two can cross-fade. Landscape canvas, about 5:4.",
    "peanut3-perch": "Peanut, the SAME cat as the attached sleeping Peanut, sitting upright on the very edge of an "
    "invisible shelf, three-quarter view facing the viewer, front paws together, head tilted a little, her long striped "
    "tail hanging straight DOWN below the edge. Nothing under her: the bottom of her body is a clean horizontal line. "
    "Portrait canvas.",
    "peanut3-peek": "Peanut, the SAME cat as the attached sleeping Peanut, peeking up over a horizontal edge: only her "
    "head, ears and two front paws resting on the edge are visible, cut by a clean straight horizontal line at the "
    "bottom. Curious. Landscape canvas.",
}.items():
    ASSETS[_n] = _d + " " + CAT3

# Fourth pass: v3 read as a 3D render. Lana likes the flying butterfly, so
# Peanut is drawn in the butterfly's hand and gets her own style sheet.
STYLE4 = (
    "Style: EXACTLY the hand of the attached pastel butterfly illustration. A FLAT 2D illustration, NOT 3D, NOT a "
    "render, NO volumetric shading, NO fur texture, NO grain. Smooth simplified shapes filled with soft watercolour-like "
    "pastel gradients that drift between hues (warm apricot and peach melting into cream, with pink and lavender "
    "blushes in the shadows and a hint of aqua), a thin soft cream-white rim along every outer edge like the "
    "butterfly's wing edges, a few fine thin cream-white lines for inner details (tabby stripes, ear folds, paw lines) "
    "like the butterfly's wing veins, and two or three tiny four-point sparkles near her like the ones on the wings. "
    "Matte and calm: no glossy highlights, no bloom halo, no lens flare. On a fully TRANSPARENT background (PNG with "
    "alpha): no backdrop, no frame, no text, no watermark."
)
CAT4 = (
    "Peanut is a small ORANGE tabby cat: apricot-orange body, cream muzzle, chest and paws, small pink nose, simple "
    "rounded kitten silhouette with big soft ears. Her stripes are a few soft slightly darker apricot bands traced with "
    "fine cream lines, never fur strands."
)
for _n, _d in {
    "peanut4-sleep": "Peanut curled up asleep in a round loaf on a small soft pink-and-lavender cloud cushion drawn in the "
    "same flat pastel way, eyes closed as two gentle curved lines, tail wrapped around her. Seen from the side. Square canvas.",
    "peanut4-awake": "Peanut, the SAME cat as the attached sleeping Peanut, now awake and sitting up on the SAME cloud "
    "cushion, head tilted curiously, round warm amber eyes open, one paw slightly raised, tail curled around. Same framing, "
    "size and cushion as the sleeping one so the two can cross-fade. Square canvas.",
    "peanut4-perch": "Peanut, the SAME cat as the attached sleeping Peanut, sitting upright on the very edge of an invisible "
    "shelf, three-quarter view facing the viewer, front paws together, head tilted a little, round warm amber eyes, her long "
    "striped tail hanging straight DOWN below the edge. Nothing under her: the bottom of her body is a clean horizontal line. "
    "Portrait canvas.",
    "peanut4-peek": "Peanut, the SAME cat as the attached sleeping Peanut, peeking up over a horizontal edge: only her head, "
    "ears and two front paws resting on the edge are visible, cut by a clean straight horizontal line at the bottom. "
    "Curious, round warm amber eyes. Landscape canvas.",
}.items():
    ASSETS[_n] = _d + " " + CAT4

CAT = (
    "Draw her as a STYLISED storybook character, NOT a realistic cat: a smooth simple rounded silhouette built from a few "
    "soft shapes, flat matte colour areas with gentle airbrushed shading only at the edges, stripes as a few broad soft "
    "painted bands, NO individual fur strands, NO fluffy fur texture, NO whiskers detail beyond 2-3 thin lines, simple "
    "small eyes (warm amber, one tiny soft highlight at most), small pink nose, cream muzzle and paws. Exactly as simple "
    "and painterly as the attached lotus flowers and clouds; the attached cat image is ONLY a reference for her colouring."
)
for _k in [k for k in ASSETS if k.startswith("peanut2-")]:
    ASSETS[_k] = ASSETS[_k].replace("{CAT}", CAT)


def main() -> None:
    name, work = sys.argv[1], Path(sys.argv[2])
    refs = [Path(r) for r in sys.argv[3:]]
    style = STYLE4 if name.startswith("peanut4-") else STYLE
    prompt = f"Use your image generation tool to create ONE image: {ASSETS[name]} {style}"
    png = generate_png(prompt, work / name, refs=refs)
    dest = work / f"{name}.png"
    shutil.copy(png, dest)
    print(dest)


if __name__ == "__main__":
    main()
