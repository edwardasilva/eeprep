"""Build FIG 4.1, the path map for eeprep.com sub-issue #15 (epic #4).

Outputs (in ../):
  path-map.svg / path-map.png            desktop, 1040 wide (site 'wide' figure), PNG 1600 px
  path-map-dark.svg / path-map-dark.png  same, dark tokens
  path-map-mobile.svg / path-map-mobile.png  vertical, 400 wide, PNG at 2x (800 px)

Text is converted to SVG paths with HarfBuzz (reuses brand/src/build_brand.py),
so the SVGs render the same without the fonts installed.
Source for every claim: /home/box/edward/eeprep/content-strategy.md (top-20 list).
Run: python3 build_path_map.py
"""
import asyncio, pathlib, re, sys
from playwright.async_api import async_playwright
HERE = pathlib.Path(__file__).resolve().parent
OUT = HERE.parent
# brand/src sits at the repo root. Walk up so this still works from src/diagrams/.
BRAND = next(
    (parent / "brand" / "src" for parent in HERE.parents if (parent / "brand" / "src" / "build_brand.py").is_file()),
    None,
)
if BRAND is None:
    raise SystemExit("build_path_map.py needs brand/src/build_brand.py")
sys.path.insert(0, str(BRAND))
from build_brand import T, M, THEMES, SANS, SERIF, MONO, EYEBROW  # noqa: E402

STROKE = 1.75
TITLE = dict(fontfile=SANS, var={"wght": 600, "opsz": 14}, tracking=-0.005)
BODY = dict(fontfile=SANS, var={"wght": 420, "opsz": 14}, tracking=0.0)
TAG = dict(fontfile=MONO, var={"wght": 500}, tracking=0.02)
HEAD = dict(fontfile=SERIF, var={"wght": 500, "opsz": 36}, tracking=-0.01)
KEYS = dict(fontfile=MONO, var={"wght": 420}, tracking=0.0)

# ------------------------------------------------------------------ content
START = dict(title="No experience yet", tag="Q15",
             body="A first internship comes from proof that you can build and finish something.")
ROUTES = [
    dict(title="Personal hardware project", tag="Q5 Q15 Q18",
         body="Build one you can defend line by line, such as a small version of what your "
              "target company makes. Start free with lab scopes, KiCad and the Altium student license."),
    dict(title="Student design team", tag="Q14 Q17",
         body="Racing and rocket teams count as experience. Join in year one and you have "
              "something real to discuss at a career fair."),
    dict(title="Research with a professor", tag="Q12 Q17",
         body="Undergrad research counts as experience. Many professors can also refer students directly."),
    dict(title="Bench skills in the lab", tag="Q10",
         body="Learn the oscilloscope and function generator until you can use them without help."),
]
TRUNK = [
    dict(title="Resume", tag="Q8 Q10",
         body="Show your year, graduation date, GPA and classes at first glance. "
              "List each tool next to the work you did with it."),
    dict(title="Career fairs and referrals", tag="Q12 Q13",
         body="People get you past the resume stack. Meet companies at fairs, and ask "
              "professors and alumni. Internships post in late summer and fall."),
    dict(title="Hardware interviews", tag="Q6",
         body="Drill digital logic, timing, op-amps and filters. After a rejection, "
              "study the questions you missed first."),
]
LOOP = dict(title="", tag="Q1",
            body="No interviews after 20 applications? Change the resume or the channel.")
FALLBACK = dict(title="If this summer falls through", tag="Q14",
                body="One missed summer is a setback you can recover from. Try a co-op of 8 to 12 "
                     "months, a technologist role or a design team. Long co-ops often lead to "
                     "full-time offers. Then build more proof.")
OFFER = "First internship offer"
PICK = "Pick one or more"
FIG = "FIG 4.1"
CAPTION = ("Routes from no experience to a first internship offer. Solid lines are the main path. "
           "Dashed lines show what to do when a step fails.")
CREDIT = ("Source: eeprep's review of public X and Reddit posts from September 2025 to "
          "October 2026. Q numbers are questions in eeprep's top-20 list.")
KEYLIST = ("Q1 reddit-2026-no-internships-projects   Q5 reddit-2025-resume-project-ee, "
           "reddit-2025-projects-got-hired   Q6 reddit-2026-nvidia-soc-interview   "
           "Q8 reddit-2026-200-internships   Q10 reddit-2026-freshman-skills   "
           "Q12 reddit-2026-2nd-year-internship   Q13 reddit-2026-lack-2027-newgrad   "
           "Q14 reddit-2026-no-internships-projects   Q15 reddit-2026-internships-before-classes   "
           "Q17 reddit-2026-internships-little-experience, reddit-2026-undergrad-research   "
           "Q18 x-princess_yfe-2026-budget, x-blind_via-2026-altium")

# ------------------------------------------------------------------ helpers
def wrap(text, role, size, maxw, sep=" "):
    words, lines, cur = text.split(sep), [], ""
    for w in words:
        t = (cur + sep + w) if cur else w
        if cur and M(t, role, size) > maxw:
            lines.append(cur); cur = w
        else:
            cur = t
    if cur:
        lines.append(cur)
    return lines

class Doc:
    def __init__(self, c):
        self.c, self.b = c, []
    def add(self, s):
        self.b.append(s)
    def path(self, d, color=None, dash=False, w=STROKE):
        da = ' stroke-dasharray="5 5"' if dash else ""
        self.add(f'<path d="{d}" fill="none" stroke="{color or self.c["ink"]}" stroke-width="{w}" '
                 f'stroke-linecap="round" stroke-linejoin="round"{da}/>')
    def dot(self, x, y, r=4.5, hollow=False):
        if hollow:
            self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{self.c["paper"]}" stroke="{self.c["ink"]}" stroke-width="{STROKE}"/>')
        else:
            self.add(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{self.c["ink"]}"/>')
    def arrow(self, x, y, dx, dy, color=None, s=7):
        # filled head with its tip at (x, y), pointing along (dx, dy)
        import math
        n = math.hypot(dx, dy); ux, uy = dx / n, dy / n; px, py = -uy, ux
        bx, by = x - ux * s * 1.5, y - uy * s * 1.5
        self.add(f'<path d="M{x:.2f} {y:.2f} L{bx + px*s*0.62:.2f} {by + py*s*0.62:.2f} '
                 f'L{bx - px*s*0.62:.2f} {by - py*s*0.62:.2f} Z" fill="{color or self.c["ink"]}"/>')
    def text(self, t, role, size, x, y, fill, anchor="start"):
        p, a = T(t, role, size, x, y, fill, anchor=anchor); self.add(p); return a
    def svg(self, w, h, title, desc):
        body = f'<rect width="{w}" height="{h}" fill="{self.c["paper"]}"/>\n' + "\n".join(self.b)
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
                f'role="img" aria-labelledby="t d">\n<title id="t">{title}</title><desc id="d">{desc}</desc>\n{body}\n</svg>\n')

TS, BS, LH, QS = 14.5, 12.5, 17.5, 10.5   # title size, body size, line height, tag size

def block_lines(item, maxw):
    return wrap(item["body"], BODY, BS, maxw)

def title_lines(item, maxw):
    if not item["title"]:
        return []
    tagw = M(item.get("tag", ""), TAG, QS) + 8
    lines = wrap(item["title"], TITLE, TS, maxw)
    if M(lines[-1], TITLE, TS) + tagw > maxw and len(lines) == 1 and " " in lines[0]:
        lines = wrap(item["title"], TITLE, TS, M(lines[0], TITLE, TS) - 1)
    return lines

def block_h(item, maxw):
    n = len(block_lines(item, maxw)); t = len(title_lines(item, maxw))
    return (t * (TS + 4) + 2 if t else 0) + n * LH

def draw_block(d, item, x, top, maxw, body_color=None):
    """Draw title + tag + body with the first baseline under `top`. Returns bottom y."""
    c = d.c; y = top
    tl = title_lines(item, maxw)
    for j, t in enumerate(tl):
        y += TS + (0 if j == 0 else 4)
        a = d.text(t, TITLE, TS, x, y, c["ink"])
        if j == len(tl) - 1 and item.get("tag"):
            d.text(item["tag"], TAG, QS, x + a + 8, y - 0.5, c["mute"])
    if tl:
        y += 6
    for i, ln in enumerate(block_lines(item, maxw)):
        y += LH
        d.text(ln, BODY, BS, x, y - 4, body_color or c["ink2"])
    if not item["title"] and item.get("tag"):
        # tag at end of last line
        last = block_lines(item, maxw)[-1]
        d.text(item["tag"], TAG, QS, x + M(last, BODY, BS) + 8, y - 4.5, c["mute"])
    return y

def caption(d, x, y, w, stacked=False):
    c = d.c
    d.add(f'<path d="M{x} {y+0.5} H{x+w}" stroke="{c["rule"]}" stroke-width="1"/>')
    y += 28
    fw = d.text(FIG, EYEBROW, 12, x, y, c["accent"])
    cx = x + fw + 14
    if stacked:
        cx = x; y += 24
    for i, ln in enumerate(wrap(CAPTION, BODY, 13.5, w - (cx - x))):
        d.text(ln, BODY, 13.5, cx, y + i * 21, c["ink2"])
        last = y + i * 21
    y = last + 26
    for ln in wrap(CREDIT, BODY, 11.5, w - (cx - x)):
        d.text(ln, BODY, 11.5, cx, y, c["mute"]); y += 17
    y += 3
    kw = w - (cx - x)
    # whole entries per line where they fit; an entry too long for one line breaks after a comma
    pieces = []
    for e in KEYLIST.split("   "):
        if M(e, KEYS, 10) <= kw:
            pieces.append(e)
        else:
            parts = e.split(", ")
            pieces.append(parts[0] + ",")
            pieces += ["  " + q for q in parts[1:]]
    cur = ""
    for pc in pieces:
        t = (cur + "   " + pc) if cur else pc
        if cur and (M(t, KEYS, 10) > kw or pc.startswith("  ")):
            d.text(cur, KEYS, 10, cx, y, c["mute"]); y += 15; cur = pc
        else:
            cur = t
    if cur:
        d.text(cur, KEYS, 10, cx, y, c["mute"]); y += 15
    return y

def offer_mark(d, x, y):
    c = d.c
    d.add(f'<circle cx="{x}" cy="{y}" r="10" fill="{c["paper"]}" stroke="{c["accent"]}" stroke-width="2.25"/>')
    d.add(f'<circle cx="{x}" cy="{y}" r="4.5" fill="{c["accent"]}"/>')

# ------------------------------------------------------------------ desktop
def desktop(c):
    W = 1040; d = Doc(c); ink = c["ink"]
    SX = 40                     # spine x
    # start
    y0 = 40
    d.dot(SX, y0, 6)
    d.text(START["title"], HEAD, 22, SX + 20, y0 + 7, ink)
    a = M(START["title"], HEAD, 22)
    d.text(START["tag"], TAG, QS, SX + 20 + a + 10, y0 + 6, c["mute"])
    yb = y0 + 8
    for ln in wrap(START["body"], BODY, BS, 480):
        yb += LH; d.text(ln, BODY, BS, SX + 20, yb, c["ink2"])
    d.text(PICK, TAG, 11, SX + 20, yb + 30, c["accent"] if False else c["mute"])
    # route rows: text block above each line
    RX, RW = 70, 320
    ys = []; y = yb + 44
    for r in ROUTES:
        y += block_h(r, RW) + 14
        ys.append(y)
        y += 22
    yt = round((ys[1] + ys[2]) / 2)          # trunk y
    MX = 470                                  # merge x
    # spine
    d.path(f"M{SX} {y0} V{ys[-1]-12}")
    for r, yy in zip(ROUTES, ys):
        top = yy - 14 - block_h(r, RW)
        draw_block(d, r, RX, top, RW)
        d.path(f"M{SX} {yy-12} Q{SX} {yy} {SX+12} {yy} H{MX-70} C{MX-35} {yy} {MX-35} {yt} {MX} {yt}")
        d.dot(RX + 6, yy, 5, hollow=True)
    d.dot(MX, yt, 5)
    # trunk
    TXS = [500, 670, 840]; OX = 1000
    bw = 154
    ttop = yt - 18 - max(block_h(it, bw) for it in TRUNK)
    d.path(f"M{MX} {yt} H{OX-10}")
    for i, (it, tx) in enumerate(zip(TRUNK, TXS)):
        if i:
            d.arrow(tx - 9, yt, 1, 0)
        d.dot(tx, yt, 5, hollow=True)
        draw_block(d, it, tx - 6, ttop, bw)
    d.arrow(OX - 13, yt, 1, 0)
    offer_mark(d, OX, yt)
    d.text("First internship", HEAD, 20, OX + 12, yt + 38, ink, anchor="end")
    d.text("offer", HEAD, 20, OX + 12, yt + 62, ink, anchor="end")
    # loop: reach -> resume
    r0, r1 = TXS[1], TXS[0]
    d.path(f"M{r0-4} {yt+8} C{r0-30} {yt+56} {r1+30} {yt+56} {r1+5} {yt+12}", dash=True)
    d.arrow(r1 + 4, yt + 10, -0.5, -1)
    lw = 196
    lines = wrap(LOOP["body"], BODY, BS, lw)
    ly = yt + 64
    for i, ln in enumerate(lines):
        ly += LH; d.text(ln, BODY, BS, (r0 + r1) / 2, ly - 4, c["ink2"], anchor="middle")
    lastw = M(lines[-1], BODY, BS)
    d.text(LOOP["tag"], TAG, QS, (r0 + r1) / 2 + lastw / 2 + 8, ly - 4.5, c["mute"])
    # fallback: interview -> back to the spine
    FXv = TXS[2]
    fw = 330
    yf = max(ly + block_h(FALLBACK, fw) + 40, ys[-1] + 60)
    d.path(f"M{FXv} {yt+8} V{yf-12} Q{FXv} {yf} {FXv-12} {yf} H{SX+12} Q{SX} {yf} {SX} {yf-12} V{ys[-1]+10}", dash=True)
    d.arrow(SX, ys[-1] + 8, 0, -1)
    fx = 500
    d.dot(fx + 6, yf, 5, hollow=True)
    draw_block(d, FALLBACK, fx, yf - 14 - block_h(FALLBACK, fw), fw)
    H = caption(d, SX - 8, yf + 44, W - 2 * (SX - 8)) + 24
    return d.svg(W, round(H), "FIG 4.1: routes from no experience to a first internship offer",
                 "A path map. Four routes build proof: a personal hardware project, a student design team, "
                 "research with a professor, and bench skills in the lab. They join one path: resume, career "
                 "fairs and referrals, hardware interviews, then a first internship offer. Dashed lines loop "
                 "back when applications get no interviews, and when a summer falls through."), round(H)

# ------------------------------------------------------------------ mobile
def mobile(c):
    W = 400; d = Doc(c); ink = c["ink"]
    SX, TX, TW = 30, 50, 330
    y = 34
    d.dot(SX, y, 6)
    d.text(START["title"], HEAD, 22, TX, y + 7, ink)
    d.text(START["tag"], TAG, QS, TX + M(START["title"], HEAD, 22) + 10, y + 6, c["mute"])
    yb = y + 8
    for ln in wrap(START["body"], BODY, BS, TW):
        yb += LH; d.text(ln, BODY, BS, TX, yb, c["ink2"])
    y_start = y
    yb += 34
    d.text(PICK, TAG, 11, TX, yb, c["mute"])
    yb += 12
    # routes as stubs off the spine
    RX = 54; RTX = 68; RW = W - RTX - 20
    stubs = []
    for r in ROUTES:
        top = yb + 6
        h = block_h(r, RW)
        sy = top + TS - 4
        stubs.append(sy)
        draw_block(d, r, RTX, top, RW)
        yb = top + h + 12
    merge = yb + 10
    for sy in stubs:
        d.path(f"M{SX} {sy-12} Q{SX} {sy} {SX+12} {sy} H{RX-6}")
        d.dot(RX, sy, 5, hollow=True)
    d.dot(SX, merge, 5)
    # trunk stations
    yy = merge + 26
    st = []
    for i, it in enumerate(TRUNK):
        sy = yy + TS - 4
        st.append(sy)
        bottom = draw_block(d, it, TX, yy, TW)
        yy = bottom + 16
        if i == 1:
            loop_y = yy + TS - 6
            lines = wrap(LOOP["body"], BODY, BS, TW - 20)
            ly = yy
            for ln in lines:
                ly += LH; d.text(ln, BODY, BS, TX, ly - 4, c["ink2"])
            d.text(LOOP["tag"], TAG, QS, TX + M(lines[-1], BODY, BS) + 8, ly - 4.5, c["mute"])
            yy = ly + 18
    oy = yy + 14
    d.path(f"M{SX} {y_start} V{oy-10}")
    for sy in st:
        d.arrow(SX, sy - 9, 0, 1)
        d.dot(SX, sy, 5, hollow=True)
    d.arrow(SX, oy - 13, 0, 1)
    offer_mark(d, SX, oy)
    d.text(OFFER, HEAD, 20, TX, oy + 7, ink)
    # loop: from the loop note back up to resume, on the left
    LXl = 12
    d.path(f"M{SX-6} {loop_y} H{LXl+8} Q{LXl} {loop_y} {LXl} {loop_y-8} V{st[0]+8} Q{LXl} {st[0]} {LXl+8} {st[0]} H{SX-12}", dash=True)
    d.arrow(SX - 8, st[0], 1, 0, s=6)
    # fallback: from interview down the left, below the offer
    fy = oy + 46
    FXl = 12
    d.path(f"M{SX-6} {st[2]+4} Q{FXl} {st[2]+4} {FXl} {st[2]+18} V{fy+TS-4-8} Q{FXl} {fy+TS-4} {FXl+8} {fy+TS-4} H{SX-6}", dash=True)
    d.dot(SX, fy + TS - 4, 5, hollow=True)
    bottom = draw_block(d, FALLBACK, TX, fy, TW)
    H = caption(d, 16, bottom + 30, W - 32, stacked=True) + 20
    return d.svg(W, round(H), "FIG 4.1: routes from no experience to a first internship offer (mobile)",
                 "Vertical path map with the same nodes as the desktop figure."), round(H)

async def render(jobs):
    async with async_playwright() as p:
        br = await p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox"])
        for svg, png, w, h, scale in jobs:
            pg = await br.new_page(viewport={"width": w, "height": h}, device_scale_factor=scale)
            await pg.set_content(f'<html><body style="margin:0">{svg.read_text()}</body></html>')
            await pg.screenshot(path=str(png), clip={"x": 0, "y": 0, "width": w, "height": h})
            await pg.close()
        await br.close()

if __name__ == "__main__":
    # The first-internship page is Markdown, so it loads these URLs from public/.
    published = next(
        (parent / "public" / "diagrams" / "get-hired" / "path-map" for parent in HERE.parents if (parent / "package.json").is_file()),
        None,
    )
    if published is None:
        raise SystemExit("build_path_map.py needs public/diagrams/get-hired/path-map")
    published.mkdir(parents=True, exist_ok=True)
    jobs = []
    for name, fn, theme, w, scale in [
        ("path-map", desktop, "light", 1040, 1600 / 1040),
        ("path-map-dark", desktop, "dark", 1040, 1600 / 1040),
        ("path-map-mobile", mobile, "light", 400, 2),
    ]:
        s, h = fn(THEMES[theme])
        s = re.sub(r"(\d+\.\d)\d+", r"\1", s)
        (OUT / f"{name}.svg").write_text(s)
        (published / f"{name}.svg").write_text(s)
        jobs.append((OUT / f"{name}.svg", OUT / f"{name}.png", w, h, scale))
    asyncio.run(render(jobs))
    print("ok")
