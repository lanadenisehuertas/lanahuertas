"""Smaller copies of the site's pictures, for srcset.

    python scripts/moon/variants.py [--widths 320,480,960,1600] [--quality 82] [--force] <image or glob> ...

Each picture is given as a path or a glob, either relative to public/ or absolute (for example
"work/sm/brands/*/*.webp" or "art/backdrops/*.webp"). For every width in --widths that is narrower than the
picture itself, a WebP copy that wide is written to

    public/samples/sleeping-moon/art/w/<the picture's path under public/, without its extension>-<width>.webp

so /work/sm/brands/neostalgia/7-lana.webp at 480 wide becomes
/samples/sleeping-moon/art/w/work/sm/brands/neostalgia/7-lana-480.webp. A picture is never made larger: a width at
or above its own is skipped, and the page lists the original itself as the widest choice. The pages work out the
same names from a picture's path and width (see variant() in brands-proto.js and brand.js), so the two must agree.

A copy already newer than its original is left alone unless --force is given, so the script can be run again after
new pictures are added. Transparency is kept. Quality 82 with the slowest, best WebP method keeps the pictures
looking as they did."""
import argparse, glob, os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.normpath(os.path.join(HERE, "..", "..", "public"))
OUT = os.path.join(PUBLIC, "samples", "sleeping-moon", "art", "w")


def expand(patterns):
    """every file the paths and globs name, once each, leaving out the copies this script wrote"""
    seen, files = set(), []
    for pat in patterns:
        full = pat if os.path.isabs(pat) else os.path.join(PUBLIC, pat.lstrip("/\\"))
        hits = sorted(glob.glob(full, recursive=True)) or ([full] if os.path.isfile(full) else [])
        if not hits:
            print(f"nothing matches {pat}", file=sys.stderr)
        for f in hits:
            f = os.path.normpath(f)
            if f in seen or not os.path.isfile(f) or os.path.commonpath([f, OUT]) == OUT:
                continue
            seen.add(f)
            files.append(f)
    return files


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("images", nargs="+", help="pictures or globs, relative to public/ or absolute")
    ap.add_argument("--widths", default="320,480,960,1600", help="comma-separated widths in px")
    ap.add_argument("--quality", type=int, default=82)
    ap.add_argument("--force", action="store_true", help="write every copy again, even one that is up to date")
    a = ap.parse_args()
    widths = sorted({int(w) for w in a.widths.split(",") if w.strip()})

    made = kept = 0
    for src in expand(a.images):
        rel = os.path.relpath(src, PUBLIC)
        if rel.startswith(".."):
            print(f"skipped {src}: not under public/", file=sys.stderr)
            continue
        stem = os.path.splitext(rel)[0]
        with Image.open(src) as im:
            im.load()
            W, H = im.size
            alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
            base = im.convert("RGBA" if alpha else "RGB")
        for w in widths:
            if w >= W:
                continue
            dst = os.path.join(OUT, f"{stem}-{w}.webp")
            if not a.force and os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
                kept += 1
                continue
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            h = max(1, round(H * w / W))
            base.resize((w, h), Image.LANCZOS).save(dst, "WEBP", quality=a.quality, method=6)
            made += 1
            print(f"{rel.replace(os.sep, '/')} {W}w -> {w}w  {os.path.getsize(src) // 1024} KiB -> {os.path.getsize(dst) // 1024} KiB")
    print(f"{made} written, {kept} already up to date, in {os.path.relpath(OUT, PUBLIC)}")


if __name__ == "__main__":
    main()
