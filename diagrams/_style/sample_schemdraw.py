"""Fig 3.4 reference schematic: RC low-pass in eeprep house style."""
import schemdraw.elements as elm
from schemdraw_style import eeprep_drawing, LBL, VAL, PM, ACCENT, node, terminal
with eeprep_drawing("sample-schemdraw.svg") as d:
    src = d.add(elm.SourceSin().up().label("$v_{\\mathrm{in}}$", loc="top", ofst=0.3, **LBL)
                .label(("−", "", "+"), loc="bottom", ofst=0.12, **PM))
    w = d.add(elm.Line().right(1.2))
    d.add(elm.CurrentLabel(top=True, ofst=0.3, length=0.7).at(w).color(ACCENT).label("$i$", color=ACCENT, fontsize=13))
    d.add(elm.Resistor().right().label("$R$", **LBL).label("1 kΩ", loc="bottom", **VAL))
    d.add(elm.Line().right(0.6)); a = d.here; node(d, a)
    d.add(elm.Line().right(2.3)); top = d.here; terminal(d, top)
    c = d.add(elm.Capacitor().at(a).down().toy(src.start).label("$C$", loc="top", ofst=0.15, **LBL)
              .label("100 nF", loc="bottom", ofst=0.15, **VAL))
    node(d, c.end)
    d.add(elm.Line().at(src.start).tox(top[0])); terminal(d, d.here)
    gx = (src.start[0] + 1.7, src.start[1])
    d.add(elm.Ground().at(gx)); node(d, gx)
    d.add(elm.Gap().at(top).down().toy(src.start).label(("+", "$v_{\\mathrm{out}}$", "−"), loc="bottom", ofst=0.3, **LBL))
