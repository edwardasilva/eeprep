# EE Prep

A prep guide for electrical engineering students. The public site stays `noindex` until launch. Nothing in this repo deploys it.

## Run it locally

Node 22.23.4 or later. The version is pinned in `.nvmrc` and `package.json`.

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`. `npm run preview` serves that build.

Figures are drawn at build time from WaveDrom sources in `src/diagrams/`. After you edit a `.json5` file, run `npm run render:figures` and commit the SVG next to it. CI fails when the SVG does not match the source.

## How the content is organized

Pages live in `src/content/docs/` and build as a Starlight site:

- `get-hired/` for the job guide
- `succeed-in-school/` for school
- `reference/` for study pages

Open `src/content/docs` as an Obsidian vault. Links are `[[wikilinks]]`. Each page can show backlinks and a graph. Callouts use Obsidian syntax (`> [!tip] Main idea`). Math is KaTeX. The bibliography file is added on the citations epic.

The four launch pages (resume, the job market, how to study, signals and DSP) are marked placeholders. So is the sample page, which is there to prove the page tools.

Writing rules are in `docs/STYLE.md`. How epics, branches, and reviews work is in `CONTRIBUTING.md`.

## Stack

Astro and Starlight, with the textbook theme in `src/styles/theme.css`. Exact package versions are pinned in `package.json`. The Obsidian-style pieces are `remark-wiki-link`, `rehype-callouts`, `remark-math`, `rehype-katex`, and `starlight-site-graph`.
