"""Build the eeprep resume teardown figure (issue #8).
python3 build.py  -> writes HTML variants next to this file + the persona markdown.
Then run render.py to make PNGs/SVG."""
import html, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import persona as P

HERE = pathlib.Path(__file__).parent
E = html.escape

# ---------------- numbered callouts (After page) ----------------
# n: (side, callout text, wiki-sourced?)
KEY = {
 1: ("l", "Put your name at the top left. Center nothing and leave the line out from under it.", False),
 2: ("r", "Keep contact info on one line with the full linkedin.com URL. Add your work authorization, such as US citizen, and Willing to relocate, and skip the logo and the \"Phone:\" label.", False),
 3: ("l", "Cut the objective. Lead with projects, then experience, education and skills.", False),
 4: ("l", "List the skills you used under each project title. Repeating them in Skills is fine, because it shows where you used them.", False),
 5: ("r", "Right-align dates by semester. A year-long project is Fall 25 - Spring 26.", False),
 6: ("l", "Write bullets with the XYZ method. Say what you did, the number that proves it, and how you did it.", True),
 7: ("l", "Fill the second line of a bullet or fit it on one. Ragged white space looks thin.", False),
 8: ("l", "Call it Experience. Move real team work like CubeSat here and drop the retail job.", False),
 9: ("r", "Keep the space between sections equal. Use the same \\vspace everywhere.", False),
 10: ("l", "Put the degree first with the GPA on the same line. The school goes underneath.", False),
 11: ("l", "Bold Relevant coursework, because recruiters liked it. Add an Activities line the same way.", False),
 12: ("l", "Keep skills to two labeled lines, Certifications and Software. Cut fluff like communication.", False),
}

def co(n):
    return f' data-co="{n}" data-side="{KEY[n][0]}"'

# ---------------- AFTER resume ----------------
def after_page():
    o = []
    o.append(f'<div class="nm"{co(1)}>{E(P.NAME)}</div>')
    c = P.CONTACT
    parts = [E(x) for x in c]
    o.append('<div class="contact"><span class="cl">' + ' <span class="sep">|</span> '.join(parts[:-1]) +
             f' <span class="sep">|</span> </span><span{co(2)}>{parts[-1]}</span></div>')
    o.append(f'<h2><span{co(3)}>Projects</span></h2>')
    for i, p in enumerate(P.PROJECTS):
        o.append('<div class="ent">')
        o.append(f'<div class="row"><b>{E(p["title"])}</b><span class="dt"{co(5) if i==0 else ""}>{E(p["dates"])}</span></div>')
        o.append(f'<div class="sk"><span{co(4) if i==0 else ""}>{E(p["skills"])}</span></div>')
        o.append('<ul>')
        for j, b in enumerate(p["bullets"]):
            tag = co(6) if (i == 0 and j == 0) else (co(7) if (i == 1 and j == 0) else "")
            o.append(f'<li{tag}>{E(b)}</li>')
        o.append('</ul></div>')
    o.append(f'<h2 id="h-exp"><span{co(8)}>Experience</span></h2>')
    for e in P.EXPERIENCE:
        o.append('<div class="ent">')
        # .tex (PR #21): \entry{Role, Org}{dates}, one bold line, no italic org row
        o.append(f'<div class="row"><b>{E(e["role"])}, {E(e["org"])}</b><span class="dt">{E(e["dates"])}</span></div><ul>')
        for b in e["bullets"]:
            o.append(f'<li>{E(b)}</li>')
        o.append('</ul></div>')
    ed = P.EDUCATION
    o.append(f'<h2 id="h-edu" data-co="9" data-side="r" data-gap="1">Education</h2>')
    o.append('<div class="ent">')
    o.append(f'<div class="row"><span{co(10)}><b>{E(ed["degree"])}, GPA: {E(ed["gpa"])}</b></span><span class="dt">{E(ed["grad"])}</span></div>')
    o.append(f'<div class="row"><span>{E(ed["school"])}</span></div>')
    o.append(f'<div class="ln"><b{co(11)}>Relevant coursework:</b> {E(ed["coursework"])}</div>')
    o.append(f'<div class="ln"><b>Activities:</b> {E(ed["activities"])}</div>')
    o.append('</div>')
    o.append('<h2>Skills</h2>')
    o.append(f'<div class="ln"><b{co(12)}>Certifications:</b> {E(P.CERTIFICATIONS)}</div>')
    o.append(f'<div class="ln"><b>Software:</b> {E(P.SOFTWARE)}</div>')
    return '<div class="page after-pg">' + "\n".join(o) + '</div>'

# ---------------- BEFORE resume (the common mistakes) ----------------
def before_page():
    pr = P.PROJECTS; ex = P.EXPERIENCE; ed = P.EDUCATION
    s = []
    s.append(f'<div class="b-nm">{E(P.NAME.upper())}</div><div class="b-rule"></div>')
    s.append('<div class="b-contact">Phone: (555) 555-0142 &nbsp;|&nbsp; Email: jdoe@example.com &nbsp;|&nbsp; '
             '<span class="inlogo">in</span> LinkedIn</div>')
    s.append('<h2 style="margin-top:26px">Objective</h2>')
    s.append(f'<p class="obj">{E(P.BEFORE_OBJECTIVE)}</p>')
    s.append('<h2 style="margin-top:12px">Education</h2>')
    s.append(f'<div class="row"><b>{E(ed["school"])}.</b><span class="dt">May 2027</span></div>')
    s.append('<div>Bachelor of Science in Electrical Engineering.</div><div>GPA: [X.XX].</div>')
    s.append('<h2 style="margin-top:30px">Skills</h2><div class="twocol">')
    soft = P.BEFORE_SOFT + ["KiCad", "MATLAB"]
    s.append(''.join(f'<div>\u2022 {E(x)}</div>' for x in soft))
    s.append('</div>')
    s.append('<h2 style="margin-top:8px">Work History</h2>')
    r = P.BEFORE_RETAIL
    s.append(f'<div class="row"><b>{E(r["role"])}, {E(r["org"])}</b><span class="dt">{E(r["dates"])}</span></div><ul>')
    s.append(''.join(f'<li>{E(b)}</li>' for b in r["bullets"]) + '</ul>')
    s.append(f'<div class="row" style="margin-top:14px"><b>Research Assistant, {E(ex[1]["org"])}</b><span class="dt">Summer 2025</span></div><ul>')
    s.append('<li>Did measurements on GaN transistors</li><li>Wrote Python scripts for the lab.</li></ul>')
    s.append('<h2 style="margin-top:22px">Projects</h2>')
    s.append('<div class="row"><b>Buck converter</b><span class="dt">2025-2026</span></div><ul>'
             '<li>Designed a buck converter for the CubeSat team</li><li>Made a PCB</li>'
             '<li>Programmed and optimized the microcontroller code to monitor current and keep the converter safe when</li>'
             '<li style="list-style:none;margin-left:-4px">there is a fault.</li></ul>')
    s.append('<div class="row" style="margin-top:4px"><b>FPGA equalizer</b><span class="dt">Jan 2025 - May 2025</span></div><ul>'
             '<li>Programmed and optimized an audio filter</li></ul>')
    s.append('<div class="row" style="margin-top:12px"><b>Battery monitor</b><span class="dt">Fall 2024</span></div><ul>'
             '<li>Built a battery monitor with an ESP32</li></ul>')
    s.append('<h2 style="margin-top:34px">Extracurricular Activities and Interests</h2>')
    s.append(f'<div>CubeSat team member, Tau Beta Pi, IEEE.</div><div>Interests: {E(P.BEFORE_INTERESTS)}</div>')
    return '<div class="page before-pg">' + "\n".join(s) + '</div>'

CAPTION = ("Fig A is a typical first draft. Fig B is the same placeholder student after the rules from the site's author, "
           "on the r/EngineeringResumes LaTeX template. Each number marks one change.")

def key_html():
    items = []
    for n, (_, t, wiki) in KEY.items():
        w = ' <span class="wiki">wiki</span>' if wiki else ''
        items.append(f'<li><span class="kn">{n}</span><span>{E(t)}{w}</span></li>')
    return '<ol class="key">' + "".join(items) + '</ol>'

CREDIT = ('The advice comes from the site\'s author. Rule 6 and the page layout follow the '
          '<a>r/EngineeringResumes wiki</a> (reddit.com/r/EngineeringResumes/wiki/index) and its LaTeX template. '
          'Jane Doe is a placeholder name.')

CSS = (HERE / "figure.css").read_text()
JS = (HERE / "callouts.js").read_text()

def page(mode, layout):
    return f"""<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>eeprep resume teardown</title><style>{CSS}</style></head>
<body class="{mode} {layout}">
<figure class="eep-fig wide" id="fig">
  <div class="pair">
    <div class="panel before"><div class="plabel"><span class="pl">Fig A</span> Before</div>
      <div class="stage"><div class="gut"></div><div class="pagewrap">{before_page()}</div><div class="gut"></div></div></div>
    <div class="panel after"><div class="plabel"><span class="pl">Fig B</span> After</div>
      <div class="stage" id="stageB"><div class="gut"></div><div class="pagewrap">{after_page()}</div><div class="gut"></div>
      <svg class="leaders" id="leaders"></svg></div></div>
  </div>
  <figcaption><b>FIG 1</b><span>{E(CAPTION)}</span></figcaption>
  {key_html()}
  <p class="credit">{CREDIT}</p>
</figure>
<script>{JS}</script></body></html>"""

def persona_md():
    p = P
    L = ["# Jane Doe: placeholder-name example student (NOT A REAL PERSON)", "",
         "**This is a fictional example.** Jane Doe and every project below are invented, and the school, team and lab are placeholders "
         "for the eeprep.com resume page (issue #8, epic #3). Do not replace any of it with a real person, a real LinkedIn URL, "
         "or the friend from the notes. The contact details use the reserved 555-01xx phone range and example.com. "
         "Every number in the bullets and the GPA is a bracketed placeholder ([X], [Y], [Z], [W] in order within each bullet, [N] in a title), "
         "so nothing is made up. Replace each one with your own measured value.", "",
         "Source of truth: `/workspace/eeprep-mockups/figures/resume-teardown/src/persona.py`. This file is generated from it "
         "by `build.py`, and the resume teardown figure renders from the same data. Engineer Bot's LaTeX template (#7) and "
         "Strategy Bot's outline (#6) must use these exact strings so all three match.", "",
         "## Header", "", f"- Name: {p.NAME}", f"- Contact line (one line, left-justified, in this order): {' | '.join(p.CONTACT)}", "",
         "## Section order", "", "Name, Projects, Experience, Education, Skills. No objective. No interests section.", "",
         "## Projects", ""]
    for pr in p.PROJECTS:
        L += [f"### {pr['title']}", "", f"- Dates (right-aligned): {pr['dates']}", f"- Skills line under the title: {pr['skills']}", "- Bullets (XYZ method):"]
        L += [f"  - {b}" for b in pr["bullets"]] + [""]
    L += ["## Experience", ""]
    for e in p.EXPERIENCE:
        L += [f"### {e['role']}, {e['org']}", "", f"- Dates (right-aligned): {e['dates']}", "- Bullets (XYZ method):"]
        L += [f"  - {b}" for b in e["bullets"]] + [""]
    ed = p.EDUCATION
    L += ["## Education", "", f"- School: {ed['school']}", f"- Degree line: {ed['degree']}, GPA: {ed['gpa']}",
          f"- Graduation (right-aligned): {ed['grad']}", f"- **Relevant coursework:** {ed['coursework']}",
          f"- **Activities:** {ed['activities']}", "",
          "## Skills (two labeled lines)", "", f"- Certifications: {p.CERTIFICATIONS}", f"- Software: {p.SOFTWARE}", "",
          "## Only on the \"Before\" draft (the mistakes)", "",
          f"- Objective: \"{p.BEFORE_OBJECTIVE}\"",
          f"- Retail job: {p.BEFORE_RETAIL['role']}, {p.BEFORE_RETAIL['org']}, {p.BEFORE_RETAIL['dates']}. Bullets: " + " / ".join(p.BEFORE_RETAIL['bullets']),
          f"- Two-column skills with fluff: {', '.join(p.BEFORE_SOFT)}, KiCad, MATLAB",
          f"- Interests: {p.BEFORE_INTERESTS}",
          "- Centered header with a rule under the name, \"Phone:\" and \"Email:\" labels, a LinkedIn logo instead of the URL",
          "- Mixed date formats (May 2027, 06/2023 - 08/2024, Summer 2025, 2025-2026, Jan 2025 - May 2025, Fall 2024), stray periods, uneven spacing, short dangling bullets",
          "- Section order: Objective, Education, Skills, Work History, Projects, Extracurricular Activities and Interests", ""]
    return "\n".join(L)

if __name__ == "__main__":
    for mode, layout, name in [
        ("light", "desktop", "before-after"),
        ("light", "mobile", "before-after-mobile"),
        ("dark", "desktop", "before-after-dark"),
        ("dark", "mobile", "before-after-mobile-dark"),
    ]:
        (HERE / f"{name}.html").write_text(page(mode, layout))
    # The persona markdown is a side file for the notes repo. Skip it when that
    # directory is not on this machine, so the figure still builds.
    src = pathlib.Path("/home/box/edward/eeprep/sources")
    if src.is_dir():
        md = persona_md()
        (src / "jane-doe-persona.md").write_text(md)
        # Old path kept so existing links still resolve; it points at the new file.
        (src / "alex-rivera-persona.md").write_text(
            "> Superseded by jane-doe-persona.md. Edit that file's source, not this one.\n\n" + md)
    print("built")
