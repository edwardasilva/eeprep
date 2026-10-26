"""Build the eeprep.com GitHub brand images.

Outputs (in ../):
  social-preview.svg / social-preview.png  1280x640, GitHub social preview
  readme-banner.svg / readme-banner-dark.svg  1280x320, README header

Every glyph is converted to an SVG path with HarfBuzz (kerning and ligatures
applied), so the SVGs render the same without the fonts installed.
Fonts (SIL OFL 1.1): Newsreader, Inter, JetBrains Mono, copied into ./fonts.

Run:  python3 build_brand.py      (needs uharfbuzz, fonttools, playwright + Chrome)
"""
import asyncio, pathlib
from playwright.async_api import async_playwright
import uharfbuzz as hb
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent
FONTS = HERE / "fonts"

THEMES = {
    "light": dict(paper="#fdfcfa", ink="#17181c", ink2="#4a4d55", mute="#6f727a",
                  rule="#e7e5e0", accent="#a3201d"),
    "dark":  dict(paper="#151412", ink="#efebe4", ink2="#b3ada3", mute="#8c867c",
                  rule="#2e2c28", accent="#e06a5f"),
}
STROKE = 1.75  # diagram stroke, px at 1:1 (theme spec)

TAGLINE_A = "A practical guide for EE students who want the "
TAGLINE_B = "job"  # set in Newsreader italic
TAGLINE_END = "."

# ---------------------------------------------------------------- text → path
_faces = {}
def face(name):
    if name not in _faces:
        blob = hb.Blob.from_file_path(str(FONTS / name))
        _faces[name] = hb.Face(blob)
    return _faces[name]

SERIF = "Newsreader-VariableFont_opsz,wght.ttf"
SERIF_I = "Newsreader-Italic-VariableFont_opsz,wght.ttf"
SANS = "Inter-VariableFont_opsz,wght.ttf"
MONO = "JetBrainsMono-VariableFont_wght.ttf"

def shape(text, fontfile, size, var=None, tracking=0.0, features=None):
    """Return (list of (gid, x_offset_px, y_offset_px), advance_px, hb.Font)."""
    f = hb.Font(face(fontfile))
    if var:
        f.set_variations(var)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(f, buf, features or {"kern": True, "liga": True})
    s = size / face(fontfile).upem
    x = 0.0; out = []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        out.append((info.codepoint, x + pos.x_offset * s, pos.y_offset * s))
        x += pos.x_advance * s + tracking * size
    if tracking:
        x -= tracking * size  # no trailing tracking
    return out, x, f, s

def text(t, fontfile, size, x, y, fill, var=None, tracking=0.0, features=None, anchor="start"):
    glyphs, adv, f, s = shape(t, fontfile, size, var, tracking, features)
    if anchor == "end":
        x -= adv
    elif anchor == "middle":
        x -= adv / 2
    pen = SVGPathPen(None)
    for gid, gx, gy in glyphs:
        tp = TransformPen(pen, (s, 0, 0, -s, x + gx, y - gy))
        f.draw_glyph_with_pen(gid, tp)
    d = pen.getCommands()
    return f'<path fill="{fill}" d="{d}"/>', adv

def measure(t, fontfile, size, var=None, tracking=0.0):
    return shape(t, fontfile, size, var, tracking)[1]

# font settings per role (theme spec §3)
WORD = dict(fontfile=SERIF, var={"wght": 500, "opsz": 72}, tracking=-0.025)
LEDE = dict(fontfile=SERIF, var={"wght": 400, "opsz": 36}, tracking=-0.005)
LEDE_I = dict(fontfile=SERIF_I, var={"wght": 400, "opsz": 36}, tracking=-0.005)
EYEBROW = dict(fontfile=MONO, var={"wght": 500}, tracking=0.12)
LABEL = dict(fontfile=MONO, var={"wght": 450}, tracking=0.0)
CAPTION = dict(fontfile=SANS, var={"wght": 420, "opsz": 14}, tracking=0.0)
VAR_I = dict(fontfile=SERIF_I, var={"wght": 400, "opsz": 24})
VAR_R = dict(fontfile=SERIF, var={"wght": 400, "opsz": 14})

def T(t, role, size, x, y, fill, **kw):
    return text(t, role["fontfile"], size, x, y, fill, role.get("var"), role.get("tracking", 0.0), **kw)

def M(t, role, size):
    return measure(t, role["fontfile"], size, role.get("var"), role.get("tracking", 0.0))

# ---------------------------------------------------------------- RC circuit
def rc_circuit(ox, oy, k, c, show_values=True):
    """First-order RC low-pass in the schemdraw house style.
    Geometry is scaled by k, strokes stay at 1.75px. Only crimson element:
    the current arrow and its label i."""
    P = lambda x, y: (ox + x * k, oy + y * k)
    def line(*pts):
        d = "M" + " L".join(f"{P(*p)[0]:.2f} {P(*p)[1]:.2f}" for p in pts)
        return f'<path d="{d}" fill="none" stroke="{c["ink"]}" stroke-width="{STROKE}" stroke-linecap="round" stroke-linejoin="round"/>'
    def dot(x, y, r=4.6, fill=None):
        cx, cy = P(x, y)
        if fill is None:
            return f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{c["ink"]}"/>'
        return f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r:.2f}" fill="{fill}" stroke="{c["ink"]}" stroke-width="{STROKE}"/>'
    g = []
    top, bot = 0, 180
    sx, sy, sr = 0, 90, 28           # source
    rx0, rx1 = 112, 182              # resistor span
    nx = 272                         # node / capacitor x
    tx = 420                         # output terminals
    gx = 128                         # ground x
    # wires
    g.append(line((sx, sy - sr), (sx, top), (rx0, top)))
    zz = [(rx0, top)]
    n = 6; w = (rx1 - rx0) / n
    for i in range(n):
        zz.append((rx0 + w * (i + 0.5), top + (-11 if i % 2 == 0 else 11)))
    zz.append((rx1, top))
    g.append(line(*zz))
    g.append(line((rx1, top), (tx - 5.5 / k, top)))
    g.append(line((sx, sy + sr), (sx, bot), (tx - 5.5 / k, bot)))
    # capacitor
    cy0, cy1 = 84, 96
    g.append(line((nx, top), (nx, cy0)))
    g.append(line((nx - 22, cy0), (nx + 22, cy0)))
    g.append(line((nx - 22, cy1), (nx + 22, cy1)))
    g.append(line((nx, cy1), (nx, bot)))
    # source circle + sine
    cx, cy = P(sx, sy)
    g.append(f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{sr*k:.2f}" fill="none" stroke="{c["ink"]}" stroke-width="{STROKE}"/>')
    a, h = 14, 9
    d = (f"M{P(sx-a, sy)[0]:.2f} {P(sx-a, sy)[1]:.2f} "
         f"C{P(sx-a*0.62, sy-h*1.75)[0]:.2f} {P(0, sy-h*1.75)[1]:.2f} {P(sx-a*0.38, sy-h*1.75)[0]:.2f} {P(0, sy-h*1.75)[1]:.2f} {P(sx, sy)[0]:.2f} {P(sx, sy)[1]:.2f} "
         f"C{P(sx+a*0.38, sy+h*1.75)[0]:.2f} {P(0, sy+h*1.75)[1]:.2f} {P(sx+a*0.62, sy+h*1.75)[0]:.2f} {P(0, sy+h*1.75)[1]:.2f} {P(sx+a, sy)[0]:.2f} {P(sx+a, sy)[1]:.2f}")
    g.append(f'<path d="{d}" fill="none" stroke="{c["ink"]}" stroke-width="{STROKE}" stroke-linecap="round"/>')
    # ground
    g.append(line((gx, bot), (gx, bot + 22)))
    for i, half in enumerate((20, 13, 6)):
        g.append(line((gx - half, bot + 22 + i * 8), (gx + half, bot + 22 + i * 8)))
    # nodes and terminals
    g += [dot(nx, top), dot(nx, bot), dot(gx, bot)]
    g += [dot(tx, top, 5.5, c["paper"]), dot(tx, bot, 5.5, c["paper"])]
    # current arrow: the single crimson element
    ay = top - 24
    x0, y0 = P(30, ay); x1, _ = P(70, ay)
    g.append(f'<path d="M{x0:.2f} {y0:.2f} L{x1-10:.2f} {y0:.2f}" stroke="{c["accent"]}" stroke-width="{STROKE}" stroke-linecap="round"/>')
    g.append(f'<path d="M{x1-12:.2f} {y0-5:.2f} L{x1+1:.2f} {y0:.2f} L{x1-12:.2f} {y0+5:.2f} Z" fill="{c["accent"]}"/>')
    lx, ly = P(50, ay - 12)
    g.append(T("i", VAR_I, 22 * max(k, 0.8), lx, ly, c["accent"], anchor="middle")[0])
    # labels
    fs = 22 * max(k, 0.8)
    lx, ly = P((rx0 + rx1) / 2, top - 22)
    g.append(T("R", VAR_I, fs, lx, ly, c["ink"], anchor="middle")[0])
    lx, ly = P(nx - 34, 98)
    g.append(T("C", VAR_I, fs, lx, ly, c["ink"], anchor="end")[0])
    if show_values:
        vs = 14 * max(k, 0.85)
        lx, ly = P((rx0 + rx1) / 2, top + 34)
        g.append(T("1 kΩ", LABEL, vs, lx, ly, c["mute"], anchor="middle")[0])
        lx, ly = P(nx + 34, 96)
        g.append(T("100 nF", LABEL, vs, lx, ly, c["mute"])[0])
    # v_in / v_out
    def vlabel(sub, x, y, anchor):
        w1 = M("v", VAR_I, fs); w2 = M(sub, VAR_R, fs * 0.68)
        tot = w1 + w2 + 1
        X, Y = P(x, y)
        if anchor == "end":
            X -= tot
        elif anchor == "middle":
            X -= tot / 2
        out = T("v", VAR_I, fs, X, Y, c["ink"])[0]
        out += T(sub, VAR_R, fs * 0.68, X + w1 + 1, Y + fs * 0.22, c["ink"])[0]
        return out
    g.append(vlabel("in", sx - sr - 14, sy + 7, "end"))
    g.append(vlabel("out", tx, sy + 7, "middle"))
    return "\n".join(g)

def svg_doc(w, h, body, title, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-labelledby="t d">\n'
            f'<title id="t">{title}</title><desc id="d">{desc}</desc>\n{body}\n</svg>\n')

def hline(x0, x1, y, color):
    return f'<path d="M{x0} {y+0.5} H{x1}" stroke="{color}" stroke-width="1"/>'

# ---------------------------------------------------------------- social preview 1280x640
def social(c):
    W, H, L, R = 1280, 640, 96, 1184
    b = [f'<rect width="{W}" height="{H}" fill="{c["paper"]}"/>']
    # top row
    b.append(T("THE EE FIELD GUIDE", EYEBROW, 15, L, 100, c["accent"])[0])
    b.append(T("eeprep.com", LABEL, 15, R, 100, c["mute"], anchor="end")[0])
    b.append(hline(L, R, 124, c["rule"]))
    # wordmark: "ee" ink, "prep" accent (matches the site logo)
    ws = 176; wy = 316
    p, w1 = T("ee", WORD, ws, L - 4, wy, c["ink"])
    b.append(p)
    b.append(T("prep", WORD, ws, L - 4 + w1 - 2, wy, c["accent"])[0])
    # tagline, two lines, italic "job"
    ts = 42; ty1 = 412; ty2 = ty1 + 56
    b.append(T("A practical guide for EE students", LEDE, ts, L, ty1, c["ink2"])[0])
    p, a = T("who want the ", LEDE, ts, L, ty2, c["ink2"]); b.append(p)
    p, a2 = T(TAGLINE_B, LEDE_I, ts, L + a, ty2, c["ink"]); b.append(p)
    b.append(T(TAGLINE_END, LEDE, ts, L + a + a2 + 1, ty2, c["ink2"])[0])
    # figure on the right
    k = 0.92
    ox, oy = R - 5.5 - 420 * k, 214
    b.append(rc_circuit(ox, oy, k, c))
    # caption under figure
    cy = 470
    cx0 = ox - 70 * k
    p, fw = T("FIG 0.1", EYEBROW, 13, cx0, cy, c["accent"]); b.append(p)
    b.append(T("First-order RC low-pass, cutoff 1.59 kHz", CAPTION, 15, cx0 + fw + 14, cy, c["mute"])[0])
    # bottom row
    b.append(hline(L, R, 536, c["rule"]))
    topics = "JOBS   RESUMES   STUDY GUIDES   RESOURCES"
    b.append(T(topics, EYEBROW, 13, L, 572, c["mute"])[0])
    b.append(T("github.com/edwardasilva/eeprep", LABEL, 13, R, 572, c["mute"], anchor="end")[0])
    return svg_doc(W, H, "\n".join(b), "eeprep: " + TAGLINE_A + TAGLINE_B + TAGLINE_END,
                   "Wordmark and tagline beside a line drawing of an RC low-pass circuit.")

# ---------------------------------------------------------------- README banner 1280x320
def banner(c):
    W, H, L, R = 1280, 320, 64, 1216
    b = [f'<rect width="{W}" height="{H}" fill="{c["paper"]}"/>']
    b.append(T("THE EE FIELD GUIDE", EYEBROW, 14, L, 90, c["accent"])[0])
    ws = 132; wy = 208
    p, w1 = T("ee", WORD, ws, L - 3, wy, c["ink"]); b.append(p)
    b.append(T("prep", WORD, ws, L - 3 + w1 - 2, wy, c["accent"])[0])
    ts = 30; ty = 264
    p, a = T(TAGLINE_A, LEDE, ts, L, ty, c["ink2"]); b.append(p)
    p, a2 = T(TAGLINE_B, LEDE_I, ts, L + a, ty, c["ink"]); b.append(p)
    b.append(T(TAGLINE_END, LEDE, ts, L + a + a2 + 1, ty, c["ink2"])[0])
    b.append(rc_circuit(R - 5.5 - 420 * 0.8, 100, 0.8, c, show_values=True))
    return svg_doc(W, H, "\n".join(b), "eeprep: " + TAGLINE_A + TAGLINE_B + TAGLINE_END,
                   "Wordmark and tagline beside a line drawing of an RC low-pass circuit.")

async def render(pairs):
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for svg, png, w, h, scale in pairs:
            pg = await br.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            await pg.set_content(f'<html><body style="margin:0">{svg.read_text()}</body></html>')
            await pg.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": w, "height": h})
            await pg.close()
        await br.close()

if __name__ == "__main__":
    (OUT / "social-preview.svg").write_text(social(THEMES["light"]))
    (OUT / "readme-banner.svg").write_text(banner(THEMES["light"]))
    (OUT / "readme-banner-dark.svg").write_text(banner(THEMES["dark"]))
    prev = OUT / "previews"; prev.mkdir(exist_ok=True)
    asyncio.run(render([
        (OUT / "social-preview.svg", OUT / "social-preview.png", 1280, 640, 1),
        (OUT / "readme-banner.svg", prev / "readme-banner.png", 1280, 320, 1),
        (OUT / "readme-banner-dark.svg", prev / "readme-banner-dark.png", 1280, 320, 1),
    ]))
    print("ok")
