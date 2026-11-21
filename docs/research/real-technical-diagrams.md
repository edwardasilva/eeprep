# Real technical diagrams for every page

This report answers issue #1116. It is research only. It changes no site code, styles, content pages, or components, and it adds no diagrams and no figure-numbering fix.

Repository links point at commit `47fabea` (the v0.0.1 release on `main`), so the line numbers stay correct. The build output was produced by running `npm ci` and `npm run build` on that commit.

## Summary

- The site already has 40 figures. They are hand-authored Astro components that use the site color tokens, so "add images" means "add technical figures to a site that has a figure system".
- Most pages are career advice, not circuit theory. Real schematics, waveforms, and Bode plots fit 6 or 7 of the 35 pages. The other pages already have a process or data figure, or need none.
- The numbering defect is confirmed in the code and has two separate causes. A cascade-order bug makes each page restart at 1. A containment rule may hide the number in WebKit, and that part is not reproduced.
- Web access was limited in this session. Only the repository, the build output, and MDN pages could be read. Every claim about an outside tool is listed as unverified in its own section, with the URL to check.

## Verified facts

### What the repository has now

1. The docs collection has 34 content files plus a 404 page. The build reports 35 pages. Source: [src/content/docs](https://github.com/edwardasilva/eeprep/tree/47fabea/src/content/docs).
2. Figures are Astro components in subfolders of `src/components`, each with one `<figure class="eep-fig">` tag. Source: [src/components](https://github.com/edwardasilva/eeprep/tree/47fabea/src/components). Thirteen of them contain an inline `<svg>` and the rest are HTML and CSS.
3. The page walk in `figure-numbers.ts` counts 40 figures. The last page in sidebar order gets a start value of 40 in the built HTML. Source: [src/lib/figure-numbers.ts](https://github.com/edwardasilva/eeprep/blob/47fabea/src/lib/figure-numbers.ts).
4. `check-figures.mjs` bans crimson, gradients, glows, and italics in a figure, and requires `.sr-only` text next to a drawing hidden from screen readers. Source: [.github/scripts/check-figures.mjs](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/scripts/check-figures.mjs).
5. [STYLE.md section 7](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/STYLE.md) says figures use ink, the mute border, and the 6% tint, give every box the same treatment, and end every line on something.
6. The roadmap lists "Better graphics. Clearer figures and diagrams will appear across the site." Source: [src/content/docs/roadmap.md](https://github.com/edwardasilva/eeprep/blob/47fabea/src/content/docs/roadmap.md).

### Diagram tooling in the repository

1. No diagram tool is installed. A search of the repository, excluding `package-lock.json`, for schemdraw, CircuiTikZ, WaveDrom, Mermaid, D2, Graphviz, and TikZ finds one hit: the word "WaveDrom" in the Vale word list at [`.github/vale/styles/Eeprep/SentenceCase.yml`](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/vale/styles/Eeprep/SentenceCase.yml). It is a leftover spelling exception. Nothing renders WaveDrom.
2. The git history has one commit, so earlier tooling cannot be checked. The report cannot say what the site "used to have".
3. KiCad appears only as page content, such as the buck converter line in [hardware.mdx](https://github.com/edwardasilva/eeprep/blob/47fabea/src/content/docs/advice/projects/hardware.mdx#L36) and the entry in [src/content/references.bib](https://github.com/edwardasilva/eeprep/blob/47fabea/src/content/references.bib). It is not build tooling.
4. Build-time rendering already exists for math. KaTeX, `remark-math`, and `rehype-katex` are dependencies, and [src/plugins/rehype-eq-ids.mjs](https://github.com/edwardasilva/eeprep/blob/47fabea/src/plugins/rehype-eq-ids.mjs) post-processes the output. Source: [package.json](https://github.com/edwardasilva/eeprep/blob/47fabea/package.json).
5. `@resvg/resvg-js` renders SVG to PNG in [.github/scripts/render-brand.mjs](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/scripts/render-brand.mjs). Playwright is a dev dependency. Both could support a figure preview or a test.
6. [.github/scripts/check-theme.mjs](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/scripts/check-theme.mjs) fails when a static color in a brand SVG is not in the `theme.css` palette. A new diagram folder of static SVG files would need the same rule, or inline SVG that reads CSS variables.

### Figure numbering today

The numbering code spans five files.

| File                                | Lines   | What it does                                                                                                                                                                                                                                                                   |
| ----------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/lib/figure-numbers.ts`         | whole   | Walks the sidebar and returns, for each page, how many figures come before it. Source: [figure-numbers.ts at 47fabea](https://github.com/edwardasilva/eeprep/blob/47fabea/src/lib/figure-numbers.ts).                                                                          |
| `src/route-data.ts`                 | 14-21   | Pushes an inline `<style>` with `.sl-markdown-content{counter-reset:eep-fig N}` for each page whose start is not 0. Source: [route-data.ts at 47fabea](https://github.com/edwardasilva/eeprep/blob/47fabea/src/route-data.ts#L14-L21).                                         |
| `src/styles/theme.css`              | 363-374 | Declares `.sl-markdown-content { counter-reset: eep-fig; }`, `counter-increment` on `figure.eep-fig`, and the label `content: 'Figure ' counter(eep-fig)`. Source: [theme.css at 47fabea](https://github.com/edwardasilva/eeprep/blob/47fabea/src/styles/theme.css#L363-L374). |
| `src/styles/theme.css`              | 381-382 | Sets `container: eep-fig / inline-size` on `figure.eep-fig`. Source: [theme.css at 47fabea](https://github.com/edwardasilva/eeprep/blob/47fabea/src/styles/theme.css#L381-L382).                                                                                               |
| `src/components/SiteContents.astro` | 42-53   | Reads the same `figureStarts` to print figure numbers in the table of contents. Source: [SiteContents.astro at 47fabea](https://github.com/edwardasilva/eeprep/blob/47fabea/src/components/SiteContents.astro#L42-L53).                                                        |

Findings from the code and the built HTML in `dist/`:

1. Cascade order is wrong. In `dist/advice/projects/hardware/index.html` the inline style `.sl-markdown-content{counter-reset:eep-fig 5}` is on line 1 of the document, and the stylesheet `middleware.*.css` is linked on line 27. The stylesheet holds the `theme.css` rule `.sl-markdown-content{counter-reset:eep-fig}` with the same selector and the same specificity. The later rule wins, so the counter resets to 0 and the page counts 1, 2, 3. This is ordinary cascade behavior, so it does not depend on the browser. The reviewer saw it in Chrome. MDN states that `counter-reset` is a normal cascading declaration, so source order decides between equal selectors. Source: [MDN counter-reset](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/counter-reset).
2. The first page in sidebar order has start 0 and gets no inline style, so `route-data.ts` skips it (`if (start)`). That page is correct under both rules.
3. The table of contents and the pages disagree today. `SiteContents.astro` uses the site-wide starts, so `/sitemap/contents/` shows site-wide numbers while each page shows per-page numbers. The comment in `figure-numbers.ts` says the two "cannot disagree". That is not true in the current build.
4. The repository states two intents. The comments in `figure-numbers.ts`, `route-data.ts`, and `theme.css` say site-wide numbering. The comment in `check-figures.mjs` (lines 39-41) says "each page counts 1, 2, 3 in page order". Neither is the owner's decision. The issue leaves the choice open.
5. About 41 `id` attributes use a chapter-style pattern such as `fig-3-1` and `fig-21-1` (for example `HardwareProofFigure.astro` and `GradFundingFigure.astro`). The comment in `check-figures.mjs` says such ids "would bring back chapter-style numbering", and the file bans prose references of the form N.M. The ids are still unique anchors that the contents list reads. They no longer match any number the reader sees.
6. `figure.eep-fig` has `container: eep-fig / inline-size` (theme.css line 382). Several components also set their own `container-type: inline-size`, for example `PathFigure.astro` and `LabScriptFigure.astro`.
7. MDN says `container-type: inline-size` applies style and inline-size containment. MDN also says style containment makes `counter-increment` and `counter-set` create new counters scoped to the subtree. Sources: [MDN container-type](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/container-type) and [MDN CSS containment](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Using_CSS_containment). The figure is both the element that increments and the element with containment. That gives a plausible mechanism for a wrong number in some engines. See the unverified list for the WebKit report.
8. The home page has its own reset at [src/styles/site.css line 164](https://github.com/edwardasilva/eeprep/blob/47fabea/src/styles/site.css#L164), and `HomeCoverFigure` is not in the sidebar walk. Either numbering scheme needs a rule for it.
9. `figure-numbers.ts` finds figures by reading MDX `import` lines and the first `<figure class="eep-fig">` tag in each imported component (`itemsOf` in [src/lib/site-index.mjs](https://github.com/edwardasilva/eeprep/blob/47fabea/src/lib/site-index.mjs#L47-L64)). A component can hold one figure, and it must have an `id` and an `.eep-kicker` title.

### Accessibility and theming facts from MDN

1. A `<figcaption>` gives the parent `<figure>` its accessible name. Source: [MDN figure](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figure).
2. For an SVG with visible text, MDN recommends `aria-labelledby` that points at the text over a `<title>` element. Source: [MDN SVG title](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/title).
3. `prefers-color-scheme` works inside an SVG that is embedded with `<img>`, and it follows the `color-scheme` of the parent element. MDN says the SVG must be embedded, not inlined. Source: [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme).
4. The site's theme toggle writes `data-theme` on the root element (see [theme.css lines 5 and 71](https://github.com/edwardasilva/eeprep/blob/47fabea/src/styles/theme.css#L5)). A search of `src/` finds no `color-scheme` declaration. Whether an `<img>` SVG follows the toggle or only the operating system setting is therefore unknown and needs a test.

### Licenses recorded in the repository

Content is CC BY 4.0 and code is MIT. Source: [CONTRIBUTING.md, License section](https://github.com/edwardasilva/eeprep/blob/47fabea/.github/CONTRIBUTING.md#license) and the `license` field in [package.json](https://github.com/edwardasilva/eeprep/blob/47fabea/package.json).

## Not verified in this session

Web search and general web fetch were refused, and the npm and PyPI commands needed approval. Nothing below was read from its source. Check each item at the URL before the owner relies on it.

1. WebKit bug 282934 and what it says about counters and containment: <https://bugs.webkit.org/show_bug.cgi?id=282934>. The issue reports it. The report did not read it.
2. Whether any browser shows "Figure 0". No browser ran in this session. The reviewer's report is the only evidence.
3. For schemdraw: license, output formats (SVG backend), and dark mode support. Check <https://schemdraw.readthedocs.io/en/stable/> and <https://github.com/cdelker/schemdraw>.
4. For CircuiTikZ: license, and the path from LaTeX to SVG. Check <https://www.ctan.org/pkg/circuitikz>.
5. For WaveDrom: license, a command-line renderer, and SVG output. Check <https://wavedrom.com/> and <https://www.npmjs.com/package/wavedrom>.
6. For Mermaid: license, whether it renders at build time or in the browser, and its theming. Check <https://mermaid.js.org/> and <https://www.npmjs.com/package/mermaid>.
7. For D2: license, SVG output, and theme support. Check <https://d2lang.com/>.
8. For KiCad: schematic export formats, the license of its symbol libraries, and the terms for exported images. Check <https://www.kicad.org/> and <https://docs.kicad.org/>.
9. How well each tool's SVG works as inline SVG with CSS variables, and whether it adds `<title>` and `<desc>` text. No tool was run.
10. Whether MDX component output is visible to a rehype plugin. The report assumes it is not, because Astro renders a component after the Markdown pipeline. That is untested.
11. Whether Starlight sets `color-scheme` on the page. It is not in `src/`, but a framework stylesheet could set it.

## Tooling options

The table lists what to test for each tool. It states no capability as fact. The "Check" column says what a spike must confirm.

| Tool              | Drawn from                           | Fits                                             | Check in a spike                                                                              |
| ----------------- | ------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| schemdraw         | Python code                          | Schematics, block diagrams, logic, signal chains | SVG output, whether strokes and fills can use `currentColor` or CSS variables, license        |
| CircuiTikZ        | LaTeX source                         | Schematics with standard symbols                 | A LaTeX plus a DVI-to-SVG step in CI, font handling, license                                  |
| WaveDrom          | JSON text                            | Digital timing diagrams, register layouts        | A command-line renderer, SVG output, theme control, license                                   |
| KiCad exports     | A real KiCad project                 | The schematic of a real student board            | Export format, symbol library license, color remapping, metadata that names a person          |
| Mermaid           | Text in the page                     | Flowcharts, sequence diagrams                    | Whether it needs the browser at view time, theme variables, a fit with the figure rules       |
| Hand-authored SVG | A person, in an editor or text       | Bode plots, waveforms, any one-off figure        | Nothing to install. Must read as one style, and the author must keep the file small and clean |
| D2                | Text file and a command-line program | Block diagrams, architecture                     | A program in CI, SVG themes, layout engines, license                                          |

For the repository's own needs, these points apply to every option:

1. Output quality. The site draws in ink, a mute border, and a 6% tint, with no gradients (STYLE.md section 7). A tool whose default style cannot be turned off will produce figures that fail `check-figures.mjs`. The spike must test the default output against that script.
2. Build time versus runtime. The site is static (`output: "static"` in the build log) and the existing math is rendered at build time. A diagram that needs JavaScript in the reader's browser adds weight and a flash before it draws, and it needs a no-script fallback. Build-time SVG avoids both.
3. Accessibility. Every figure needs a caption (the `<figcaption>` becomes its accessible name) and text a screen reader can use. A diagram of a circuit also needs a description of the connections, such as "the inductor connects the switch node to the output". The checker already requires `.sr-only` text next to a hidden drawing.
4. Theming. The site has a manual light and dark toggle. Inline SVG that reads the existing CSS variables follows the toggle with no extra work, and the existing inline-SVG figures show that pattern. A separate `.svg` file in `<img>` needs a test (see the verified facts above).
5. Maintenance. Text sources (code, JSON, D2) diff well in a pull request. A drawn SVG diffs badly but needs no toolchain. A LaTeX or Python toolchain adds a CI dependency that the owner must keep current, and the repository pins its Node version in `.nvmrc`.

## Recommendations

These are opinions. They rest on the verified facts above and must be re-checked against the unverified list.

1. Keep inline SVG inside Astro components as the output form, since it already matches the figure rules, the theme tokens, and the checker. Treat each tool as a source that produces SVG, which a script cleans and a component embeds.
2. Do not start with a toolchain. Prove one figure of each type by hand first, then ask whether a tool saves time. A wrong tool choice costs more than ten hand-drawn figures.
3. Pick the tool by figure type, not one tool for all:
   - Timing diagrams: WaveDrom, if its SVG passes the spike.
   - Schematics: schemdraw if the owner prefers Python, CircuiTikZ if they prefer LaTeX. Test both on the buck converter and keep one.
   - Block diagrams and flows: hand-authored SVG or an existing component, since the site already has flow-style figures such as `FlowFigure` and `ProcessFigure`.
   - Bode plots and waveforms: hand-authored SVG from a short script, so the curves come from the equation and not from a sketch.
4. Do not use Mermaid for the site's figures unless the spike shows build-time SVG that obeys the figure rules. Its main strength is flowcharts, and the site has many of those.
5. Do not export a KiCad schematic for any page as a teaching figure. A real board belongs on a student's own portfolio. The hardware page can show an original schematic.
6. Add a build-time check that every diagram has a caption, a description, and no color outside the palette. Extend `check-figures.mjs` and `check-theme.mjs`, since both exist already.

## Page inventory

The list covers the 35 pages the build creates. "Now" is the count of figure components the page uses in MDX, with `ExamplePage` counted as one on the resume page. Together they give the 40 that the build counts. A page gets a technical diagram only where its text names a technical subject. Line references are to the MDX source.

| Page                                      | Now | Recommendation                                                                                                                                                                                                                                          |
| ----------------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Advice (`advice.mdx`)                     | 1   | None. It is a map of the guide, and `MapFigure` already does that.                                                                                                                                                                                      |
| Author's story                            | 0   | None. It is a personal account.                                                                                                                                                                                                                         |
| Projects (`projects/index.mdx`)           | 2   | A block diagram of one full system project (power stage, sensor, firmware, host script). The roadmap lists a "Full system project" guide, so this figure fits there. The page text at line 38 already uses a CubeSat buck converter.                    |
| Hardware (`projects/hardware.mdx`)        | 1   | A schematic of a synchronous buck converter, and an illustrative output ripple waveform with `[X]` and `[Y]` placeholders. The page names the converter, the ripple, and the LC filter at lines 36-38. This is the best first figure.                   |
| Software (`projects/software.mdx`)        | 1   | A timing diagram of a testbench stimulus and response for the FPGA and HDL section (line 43). A byte on a serial bus fits as well, since the interview page names SPI, I2C, and UART.                                                                   |
| Portfolio (`projects/portfolio.mdx`)      | 2   | An annotated waveform capture mock-up for the "scope capture" advice at lines 18 and 116, labeled as illustrative. A mock-up must not pass for real data.                                                                                               |
| Getting hired (`getting-hired/index.mdx`) | 1   | None. It is about process and numbers, and the apply figure covers it.                                                                                                                                                                                  |
| Career paths                              | 0   | A single signal-chain block diagram (sensor, analog front end, converter, processor, power) that places the eleven paths on one chain. The page covers embedded, power, and test, among others.                                                         |
| First internship                          | 2   | None. A calendar and a timeline already carry it.                                                                                                                                                                                                       |
| How to interview                          | 3   | An RC filter schematic with its Bode plot for the "fundamentals" list (lines 70-72 and the list at line 211 name RC filters and op-amp gain). A shift register or an I2C transaction timing diagram for the "trace it from the pin" example at line 80. |
| Job market                                | 1   | None. Data charts belong here, not circuit diagrams.                                                                                                                                                                                                    |
| Networking                                | 1   | None.                                                                                                                                                                                                                                                   |
| Non-technical skills                      | 0   | None.                                                                                                                                                                                                                                                   |
| Startups                                  | 0   | None.                                                                                                                                                                                                                                                   |
| First full-time role                      | 3   | None.                                                                                                                                                                                                                                                   |
| Resume (`advice/resume.mdx`)              | 7   | None. The page shows resumes, which are themselves the diagrams.                                                                                                                                                                                        |
| Quick setup                               | 1   | None.                                                                                                                                                                                                                                                   |
| Walkthrough                               | 3   | None.                                                                                                                                                                                                                                                   |
| Cleanup                                   | 1   | None.                                                                                                                                                                                                                                                   |
| Workshop                                  | 1   | None.                                                                                                                                                                                                                                                   |
| Forever learning                          | 1   | An annotated datasheet-style page is possible for the "datasheets and errata" topic. It must be an original drawing, not a copy of a vendor page. Low priority.                                                                                         |
| Graduate study                            | 3   | None.                                                                                                                                                                                                                                                   |
| Professional societies                    | 1   | None.                                                                                                                                                                                                                                                   |
| Help (`help.mdx`)                         | 1   | None.                                                                                                                                                                                                                                                   |
| Job boards                                | 1   | None.                                                                                                                                                                                                                                                   |
| Resources                                 | 1   | None.                                                                                                                                                                                                                                                   |
| AI use                                    | 1   | None.                                                                                                                                                                                                                                                   |
| Sources (`all-links.mdx`)                 | 0   | None. It is a generated list.                                                                                                                                                                                                                           |
| Company list                              | 0   | None. It is a table with filters.                                                                                                                                                                                                                       |
| Roadmap                                   | 0   | None. It is a table of plans.                                                                                                                                                                                                                           |
| Contributing                              | 0   | None.                                                                                                                                                                                                                                                   |
| Sitemap                                   | 0   | None. It is a generated table.                                                                                                                                                                                                                          |
| Table of contents                         | 0   | None. It lists figures and has none of its own.                                                                                                                                                                                                         |
| Page not found                            | 0   | None.                                                                                                                                                                                                                                                   |

The reviewer's request was one image per page. The inventory finds that about 6 pages have a technical subject that a real diagram can serve: Projects, Hardware, Software, Portfolio, Career paths, and How to interview. The other pages are about hiring. An invented circuit on a page about networking would be decoration, which the issue rules out. The owner can decide to accept fewer, better figures, or to add non-technical visuals for the other pages. This report does not decide that.

## Figure numbering

This section presents two schemes. It does not pick one. The repository owner has not decided.

### Shared work for either scheme

1. Render the number at build time. Give a helper a figure `id` and return its number. Both schemes work from the same list: `itemsOf` already returns each page's figures in order. For per-page numbering the number is the index plus 1. For site-wide numbering it is the page start from `figureStarts` plus the index plus 1.
2. The figure component then prints the number as text, so no CSS counter and no containment rule can change it. This also removes the stale `counter-reset` in `route-data.ts`, the matching rule in `theme.css`, and the counter on the home page, once the home figure has a rule (below).
3. `check-figures.mjs` line 42 flags any text inside `.eep-fignum`. The check must change in the same pull request that prints a number there.
4. The contents table (`SiteContents.astro`) already reads the same starts, so site-wide numbers there would then match the pages. For per-page numbering that component must change to restart at 1 on each page.
5. The home cover figure sits outside the sidebar walk. The owner must pick: leave it unnumbered, or number it and shift every other figure under the site-wide scheme.
6. How a component gets its number is untested. A component can read route data through `Astro.locals`, or MDX can pass the number as a prop. The first keeps "adding a figure needs no manual fix". The second does not.
7. The chapter-style ids such as `fig-3-1` can stay as anchors. Renaming them would break any link to the old anchor, so search for inbound links before any rename.

### Site-wide numbering

Figures run 1 to N through the whole site in sidebar order. That is what `figure-numbers.ts` was written for.

1. Staying correct. Adding a figure to any page changes the number of every figure after it. Prose never refers to a figure by number (the checker bans it), so no sentence goes stale. The cost is that a figure number a reader noted or cited elsewhere changes with each release.
2. Interaction with the build-time approach. The helper uses `figureStarts`, which is cached once per build and reads the sidebar. A page that moves in the sidebar renumbers by itself.
3. Size. With 40 figures now and the inventory above adding about 8, numbers reach the high 40s. Pages deep in the sidebar start at "Figure 36".
4. Result. A reader sees a number that is unique across the site, which suits "see Figure 12" in an outside post.

### Per-page numbering

Each page counts 1, 2, 3 from the top.

1. Staying correct. Adding a figure renumbers only the later figures on the same page, so a change stays local to one file's neighbors.
2. Interaction with the build-time approach. The helper needs only the page's own figure list, so `figureStarts` is no longer needed for the labels. It would still serve the contents table if that table shows the page name next to each number.
3. Size. Numbers stay small. A figure reference outside the site needs the page name too, such as "Hardware, Figure 2".
4. Result. This is what the pages display now in the browser the reviewer used, because of the cascade bug. It is also what the comment in `check-figures.mjs` describes.

### How to confirm the browser findings

The WebKit part is a hypothesis. A reviewer must load a page with at least two figures in Safari and in Chrome, record each label, and then remove the `container` rule from `theme.css` locally and load it again. If the number changes only in WebKit, the report's containment mechanism is confirmed.

## Licensing

### Recommendations

1. Original diagrams drawn for the site: license them as CC BY 4.0, the same as the content. Keep the source (SVG, WaveJSON, or script) in the repository so the file is reusable.
2. Exported tool output: the output of a tool is not automatically free of the tool's terms. Before any export goes in, read the tool's license for output and for bundled symbols or fonts. This report could not read them (see the unverified list).
3. Third-party parts, such as a symbol or a vendor graphic: accept only CC0, public domain, or CC BY. Ask the owner before accepting CC BY-SA, because it may conflict with the site's own license. Reject non-commercial, no-derivatives, and unlicensed material. A manufacturer datasheet figure is copyrighted, so redraw it.
4. Strip metadata. Editors and tools can write a file path or an author name into an SVG. The site is pseudonymous (AGENTS.md), so every committed diagram must be checked for a real name, a personal path, or an employer.
5. Use neutral examples. A schematic label or a sample resume value uses Alex Doe with they and them, per AGENTS.md.

### Recording the license

1. Cite the outside source or standard for each claim a diagram makes in `src/content/references.bib`, per AGENTS.md. A schematic of a standard topology still needs a cited source.
2. Add each outside URL to `src/data/link-index.json` and run `npm run check:link-index`.
3. Add one line to the figure caption or the page footer that names the license and the source file for any figure that uses a third-party part.
4. Keep a ledger of figure sources. This is a proposal for the owner and is not created in this pull request. A JSON file with one row per figure would hold the figure id, the source file, the tool, the license, the author credit, and the date.

## Rollout plan

The effort estimates are rough and assume one person who knows the repository.

### Phase 0: decisions (about 1 day)

1. The owner picks site-wide or per-page numbering, and a rule for the home cover.
2. The owner decides whether pages without a technical subject stay without a diagram.
3. Fix the numbering with the shared build-time approach in its own pull request. This comes first, because every new figure inherits the number.

### Phase 1: prove the method (2 to 4 days)

1. Hand-draw the buck converter schematic and the ripple waveform for the Hardware page as inline SVG, and run `check:figures` and `check:theme` on them.
2. Test the theme toggle with that figure in light and dark.
3. In a throwaway branch, render the same schematic with schemdraw and CircuiTikZ and a timing diagram with WaveDrom. Compare output size, style control, and whether `currentColor` works.
4. Decide on tools from that comparison, and write the decision in a short follow-up note.

### Phase 2: pages with a clear subject (about 1 week)

1. Hardware: the converter schematic and the waveform (from phase 1).
2. Software: a testbench timing diagram.
3. How to interview: an RC filter with its Bode plot, and a bus timing diagram.
4. Projects: the full system block diagram.

### Phase 3: remaining technical pages (3 to 5 days)

1. Career paths: the signal-chain map.
2. Portfolio: the annotated capture mock-up.
3. Forever learning: the datasheet-style figure, if the owner still wants it.

### What can wait

1. A shared diagram toolchain in CI. Adopt it only if phase 1 shows a clear saving over hand-drawn SVG.
2. A figure source ledger as a script. A hand-kept JSON file is enough for fewer than 15 diagrams.
3. Any diagram on a page without a technical subject.

## Open questions for the owner

1. Site-wide or per-page numbering?
2. Should the home cover figure be numbered?
3. Are about 6 technical diagrams acceptable in place of one image per page?
4. Is CC BY-SA third-party material allowed?
5. Does the owner want a ledger of figure sources, and where will it live?
