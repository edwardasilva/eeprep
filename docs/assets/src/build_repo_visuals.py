#!/usr/bin/env python3
"""Build the public repo banner and social preview.

Outputs, next to this script's parent directory:

  banner.svg            1280x320 README header
  social-preview.svg    1280x640 source for the social image
  social-preview.png    1280x640, under 1 MB

Glyphs are drawn as paths (HarfBuzz positioning, including kerning), so the
SVG does not ask for a font file or any other external resource.

Fonts, both SIL Open Font License 1.1, live in ./fonts. They are the files
from the brand kit:

  Newsreader-VariableFont_opsz,wght.ttf   wordmark
  Inter-VariableFont_opsz,wght.ttf        tagline

Run from the repo root:

  python3 docs/assets/src/build_repo_visuals.py

Needs the Python packages uharfbuzz, fonttools, cairosvg, and pillow.
"""

from __future__ import annotations

import io
import math
import pathlib

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from PIL import Image

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent
FONTS = HERE / "fonts"

SERIF = "Newsreader-VariableFont_opsz,wght.ttf"
SANS = "Inter-VariableFont_opsz,wght.ttf"

# Light tokens from src/styles/theme.css. The card keeps this paper fill so
# the banner stays readable on GitHub light and dark.
PAPER = "#fdfcfa"
INK = "#17181c"
INK2 = "#4a4d55"
RULE = "#c9c6bf"
ACCENT = "#a3201d"
STROKE = 1.75
PAPER_RGB = (0xFD, 0xFC, 0xFA)

WORD_A = "EE"
WORD_B = "Prep"
TAGLINE = "A practical guide for electrical engineering students in the AI era"
# The line break is wrapping only. Read in order, the lines are the tagline.
TAG_LINES = (
    "A practical guide for electrical",
    "engineering students in the AI era",
)

# Newsreader at the site wordmark settings (site.css .eep-wordmark).
WORD = {"font": SERIF, "var": {"wght": 560, "opsz": 72}, "tracking": -0.03}
# Inter for the smaller line (theme.css --eep-font-sans).
TAG = {"font": SANS, "var": {"wght": 480, "opsz": 18}, "tracking": 0.0}

_faces: dict[str, hb.Face] = {}


def face(name: str) -> hb.Face:
    if name not in _faces:
        _faces[name] = hb.Face(hb.Blob.from_file_path(str(FONTS / name)))
    return _faces[name]


def shape(text: str, fontfile: str, size: float, var: dict | None, tracking: float):
    font = hb.Font(face(fontfile))
    if var:
        font.set_variations(var)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True, "calt": True})
    scale = size / face(fontfile).upem
    x = 0.0
    glyphs = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        glyphs.append((info.codepoint, x + pos.x_offset * scale, pos.y_offset * scale))
        x += pos.x_advance * scale + tracking * size
    if text and tracking:
        x -= tracking * size
    return glyphs, x, font, scale


def draw_text(text: str, role: dict, size: float, x: float, y: float, fill: str):
    """Return (svg, advance, bounds). bounds is (x0, y0, x1, y1) or None."""
    glyphs, adv, font, scale = shape(text, role["font"], size, role.get("var"), role.get("tracking", 0.0))
    svg_pen = SVGPathPen(None)
    bounds_pen = BoundsPen(None)
    for gid, gx, gy in glyphs:
        matrix = (scale, 0, 0, -scale, x + gx, y - gy)
        font.draw_glyph_with_pen(gid, TransformPen(svg_pen, matrix))
        font.draw_glyph_with_pen(gid, TransformPen(bounds_pen, matrix))
    commands = svg_pen.getCommands()
    if not commands:
        return "", adv, None
    path = f'<path fill="{fill}" fill-rule="nonzero" d="{commands}"/>'
    return path, adv, bounds_pen.bounds


def wordmark(x: float, y: float, size: float):
    """EE in ink, Prep in crimson. Same split as SiteTitle.astro, in the wordmark case."""
    space = shape(" ", WORD["font"], size, WORD.get("var"), 0.0)[1]
    ee, w_ee, b_ee = draw_text(WORD_A, WORD, size, x, y, INK)
    prep, w_prep, b_prep = draw_text(WORD_B, WORD, size, x + w_ee + space, y, ACCENT)
    return ee + prep, w_ee + space + w_prep, unite(b_ee, b_prep)


def unite(*boxes):
    pts = [b for b in boxes if b]
    if not pts:
        return None
    return (
        min(b[0] for b in pts),
        min(b[1] for b in pts),
        max(b[2] for b in pts),
        max(b[3] for b in pts),
    )


def stroke(d: str, color: str, width: float = STROKE) -> str:
    return (
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" '
        f'stroke-linecap="round" stroke-linejoin="round"/>'
    )


def motif(left: float, cy: float, width: float) -> tuple[str, tuple]:
    """One horizontal trace: a source, a resistor, a node.

    left, cy is the left edge and the wire's vertical center. The sine inside
    the source is the only crimson mark. There are no values and no labels.
    """
    radius = max(26.0, min(64.0, width * 0.155))
    node_r = max(4.2, radius * 0.11)
    cx = left + radius
    sine_w = radius * 1.05
    sine_amp = radius * 0.36
    x_wire = cx + radius
    node_x = left + width - node_r
    gap = max(14.0, radius * 0.28)
    zig_x0 = x_wire + gap
    zig_x1 = node_x - gap
    if zig_x1 <= zig_x0 + 40:
        raise SystemExit("motif is too narrow for the resistor")
    teeth = 6
    amp = radius * 0.30
    step = (zig_x1 - zig_x0) / teeth
    pts = [(x_wire, cy), (zig_x0, cy)]
    for i in range(teeth):
        peak_y = cy - amp if i % 2 == 0 else cy + amp
        pts.append((zig_x0 + step * (i + 0.5), peak_y))
    pts.append((zig_x1, cy))
    pts.append((node_x, cy))
    wire = "M" + " L".join(f"{x:.2f} {y:.2f}" for x, y in pts)

    samples = 64
    sine = []
    x0 = cx - sine_w / 2
    for i in range(samples + 1):
        t = i / samples
        px = x0 + sine_w * t
        py = cy - math.sin(t * 2 * math.pi) * sine_amp
        sine.append(("M" if i == 0 else "L") + f"{px:.2f} {py:.2f}")

    parts = [
        f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{radius:.2f}" fill="none" stroke="{INK}" stroke-width="{STROKE}"/>',
        stroke(" ".join(sine), ACCENT, 1.5),
        stroke(wire, INK, STROKE),
        f'<circle cx="{node_x:.2f}" cy="{cy:.2f}" r="{node_r:.2f}" fill="{INK}"/>',
    ]
    box = (
        left - STROKE / 2,
        min(cy - radius, cy - amp) - STROKE / 2,
        left + width + STROKE / 2,
        max(cy + radius, cy + amp) + STROKE / 2,
    )
    return "\n".join(parts), box


def svg_doc(w: int, h: int, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" '
        f'viewBox="0 0 {w} {h}" role="img" aria-labelledby="title desc">\n'
        f'<title id="title">EE Prep</title>\n'
        f'<desc id="desc">{TAGLINE}</desc>\n'
        f"{body}\n</svg>\n"
    )


def probe(text: str, role: dict, size: float):
    """Bounds of text drawn on a baseline at y=0. y0 is above, y1 is below."""
    _path, adv, box = draw_text(text, role, size, 0, 0, INK)
    if box is None:
        raise SystemExit(f"no glyphs for {text!r}")
    return adv, box


def layout(w: int, h: int, margin: float, word_size: float, tag_size: float, motif_w: float, gap: float):
    # "Prep" carries the descender. "EE" does not.
    _adv, ee_box = probe(WORD_A, WORD, word_size)
    _adv, prep_box = probe(WORD_B, WORD, word_size)
    word_above = -min(ee_box[1], prep_box[1])
    word_below = max(ee_box[3], prep_box[3])

    tag_above = 0.0
    tag_below = 0.0
    tag_width = 0.0
    for line in TAG_LINES:
        adv, box = probe(line, TAG, tag_size)
        tag_above = max(tag_above, -box[1])
        tag_below = max(tag_below, box[3])
        tag_width = max(tag_width, adv)

    leading = tag_size * 1.32
    block = word_above + word_below + gap + tag_above + leading + tag_below
    top = (h - block) / 2
    word_y = top + word_above
    tag_y0 = word_y + word_below + gap + tag_above
    tag_y1 = tag_y0 + leading

    mark, mark_w, mark_box = wordmark(margin, word_y, word_size)
    parts = [mark]
    boxes = [mark_box]
    for line, baseline in zip(TAG_LINES, (tag_y0, tag_y1)):
        drawn, _adv, box = draw_text(line, TAG, tag_size, margin, baseline, INK2)
        parts.append(drawn)
        boxes.append(box)

    text_w = max(mark_w, tag_width)
    motif_x = w - margin - motif_w
    if motif_x < margin + text_w + 40:
        raise SystemExit(f"motif collides with the tagline on {w}x{h}")
    text_box = unite(*boxes)
    mid = (text_box[1] + text_box[3]) / 2
    drawing, motif_box = motif(motif_x, mid, motif_w)
    parts.append(drawing)
    boxes.append(motif_box)
    return parts, unite(*boxes)


def card(w: int, h: int, radius: float, full_bleed: bool) -> str:
    if full_bleed:
        return f'<rect width="{w}" height="{h}" fill="{PAPER}"/>'
    inset = 1
    inner = radius - inset
    return (
        f'<rect x="{inset}" y="{inset}" width="{w - 2 * inset}" height="{h - 2 * inset}" '
        f'rx="{inner}" ry="{inner}" fill="{PAPER}" stroke="{RULE}" stroke-width="1.5"/>'
    )


def check_bounds(name: str, box, w: int, h: int, margin: float) -> None:
    if box is None:
        raise SystemExit(f"{name}: empty drawing")
    x0, y0, x1, y1 = box
    if x0 < margin or y0 < margin or x1 > w - margin or y1 > h - margin:
        raise SystemExit(
            f"{name}: content {tuple(round(v, 1) for v in box)} leaves the {margin}px margin of {w}x{h}"
        )


def build_banner() -> str:
    w, h = 1280, 320
    parts, content = layout(w, h, margin=72, word_size=68, tag_size=23, motif_w=292, gap=16)
    check_bounds("banner", content, w, h, margin=48)
    body = card(w, h, 16, full_bleed=False) + "\n" + "\n".join(parts)
    return svg_doc(w, h, body)


def build_social() -> str:
    w, h = 1280, 640
    parts, content = layout(w, h, margin=80, word_size=100, tag_size=30, motif_w=400, gap=22)
    # The social image keeps a 40px safe margin. The lockup uses 80.
    check_bounds("social", content, w, h, margin=40)
    body = card(w, h, 0, full_bleed=True) + "\n" + "\n".join(parts)
    return svg_doc(w, h, body)


def assert_svg(text: str) -> None:
    lowered = text.lower()
    if "<text" in lowered or "<foreignobject" in lowered or "@font-face" in lowered or "<image" in lowered:
        raise SystemExit("svg still depends on live text, a font, or an image")
    outside = lowered.replace("http://www.w3.org/2000/svg", "")
    if "http://" in outside or "https://" in outside or "url(" in outside:
        raise SystemExit("svg contains an external reference")
    for banned in ("—", ";", "edward"):
        if banned in lowered:
            raise SystemExit(f"svg copy contains {banned!r}")


def render_png(svg: str, png: pathlib.Path, w: int, h: int) -> None:
    raw = cairosvg.svg2png(bytestring=svg.encode("utf-8"), output_width=w, output_height=h)
    image = Image.open(io.BytesIO(raw)).convert("RGBA")
    if image.size != (w, h):
        raise SystemExit(f"png is {image.size}, expected {(w, h)}")
    flat = Image.new("RGB", (w, h), PAPER_RGB)
    flat.paste(image, mask=image.split()[-1])
    flat.save(png, format="PNG", optimize=True)


def main() -> None:
    for piece in (WORD_A, WORD_B, TAGLINE, *TAG_LINES):
        if "—" in piece or ";" in piece:
            raise SystemExit(f"copy has a banned mark: {piece}")
    if " ".join(TAG_LINES) != TAGLINE:
        raise SystemExit("tagline lines do not rebuild the tagline")

    banner = build_banner()
    social = build_social()
    assert_svg(banner)
    assert_svg(social)
    banner_path = OUT / "banner.svg"
    social_svg = OUT / "social-preview.svg"
    social_png = OUT / "social-preview.png"
    banner_path.write_text(banner, encoding="utf-8")
    social_svg.write_text(social, encoding="utf-8")
    render_png(social, social_png, 1280, 640)
    size = social_png.stat().st_size
    if size >= 1_000_000:
        raise SystemExit(f"social preview is {size} bytes, limit is 1 MB")
    with Image.open(social_png) as image:
        if image.size != (1280, 640) or image.mode != "RGB":
            raise SystemExit(f"social preview is {image.size} {image.mode}")
    print(f"wrote {banner_path}")
    print(f"wrote {social_svg}")
    print(f"wrote {social_png} ({size} bytes)")


if __name__ == "__main__":
    main()
