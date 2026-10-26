"""eeprep.com schemdraw house style — "Clean modern textbook".

Usage:
    from schemdraw_style import eeprep_drawing, LBL, VAL
    with eeprep_drawing("fig-3-4-rc-lowpass.svg") as d:
        ...

Backend: matplotlib (so labels get Newsreader-italic mathtext and live SVG text via eeprep.mplstyle).
Sentinel colours below are swapped to CSS vars by the site's <Diagram> component (see theme-spec §7.6).
"""
from contextlib import contextmanager
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import schemdraw
import schemdraw.elements as elm

STYLE = Path(__file__).with_name("eeprep.mplstyle")
plt.style.use(STYLE)

INK    = "#17181c"   # all wires + symbols        -> var(--eep-dg-ink)
ACCENT = "#a3201d"   # values, current arrows, ONE highlighted element -> var(--eep-dg-accent)
MUTE   = "#8a8d94"   # polarity marks, secondary  -> var(--eep-dg-mute)
FILL   = "#ffffff"   # open terminals, source fill -> var(--eep-dg-fill)

# 1.75px stroke at 1:1. matplotlib lw is in points (1pt = 1.333px at 96dpi) → 1.3pt.
LW = 1.3

schemdraw.use("matplotlib")
schemdraw.config(
    unit=2.6,            # short, textbook-proportioned components
    inches_per_unit=0.64, # → ~560px wide for a one-loop schematic at 1:1
    lw=LW,
    color=INK,
    font="Newsreader",
    fontsize=15,         # component symbols/variables (≈20px)
    lblofst=0.14,
    margin=0.25,
    bgcolor=None,
    fill=None,
)
elm.style(elm.STYLE_IEEE)  # US zig-zag resistors, IEEE symbols

# Label presets
LBL = dict(fontsize=15)                                     # $R$, $C$, $v_{in}$ (mathtext → Newsreader italic)
VAL = dict(fontsize=9, font="JetBrains Mono", color=ACCENT)  # "1 kΩ", "100 nF"
PM  = dict(fontsize=14, font="Inter", color=MUTE)            # "+", "−"
DOT_R = 0.085                                               # node dot radius (drawing units)

@contextmanager
def eeprep_drawing(out: str | None = None, **kw):
    d = schemdraw.Drawing(**kw)
    yield d
    if out:
        # Save through matplotlib with a tight bbox: schemdraw's own bbox over-estimates
        # mathtext label widths ("$v_{\\mathrm{in}}$" counted as raw chars) and leaves dead margins.
        f = d.draw(show=False)
        x1, x2 = f.ax.get_xlim(); y1, y2 = f.ax.get_ylim()
        ipu = d.dwgparams["inches_per_unit"]          # style's figure.figsize would otherwise win
        f.fig.set_size_inches(ipu * (x2 - x1), ipu * (y2 - y1))
        f.fig.savefig(out, bbox_inches="tight", pad_inches=0.08, transparent=True)
        plt.close(f.fig)

def node(d, at):
    """Filled junction dot (ink)."""
    return d.add(elm.Dot(radius=DOT_R).at(at).color(INK))

def terminal(d, at):
    """Open output terminal (ink ring, paper fill)."""
    return d.add(elm.Dot(open=True, radius=0.11).at(at).color(INK).fill(FILL))
