# Contributing

Work on EE Prep is grouped into epics. An epic is one GitHub issue plus a long-lived branch named `epic/<name>`, cut from `main`.

Small changes use branches named `feat/<name>/<change>` (the epic name stays in the branch) and open pull requests into that epic branch. About ten of those can land in one epic. When the epic is done, one pull request from `epic/<name>` into `main` goes to Edward. Only Edward merges to `main`. Delete the branch after it merges.

Keep at most three epics open.

## Claim before you start

Every piece of work is a GitHub issue. Assign it, label it, and mark it in progress before you open a branch or hand it to an agent. A claimed issue is off limits to everyone else.

GitHub issues are currently disabled on this repository. Document the claim in the epic issue thread once issues are on. Do not change repository settings to turn them on.

Status lives on the GitHub Project board, not in a comment thread.

## Pull requests

Every pull request body says which epic it belongs to, on its own line:

```
Part of #2
```

Use the epic's issue number. CI fails a pull request into `main` or `epic/**` when that line is missing.

Dependabot is exempt, and so is a pull request labeled `no-epic`. That label is the exemption. Do not add it to feature work.

This repository's issue templates and pull request template are owned by a separate change. Do not add them here.

## Branches

| Branch                 | What lands there                         |
| ---------------------- | ---------------------------------------- |
| `main`                 | Finished epics, merged by Edward         |
| `epic/<name>`          | The long-lived epic branch               |
| `feat/<name>/<change>` | One small change, reviewed into the epic |

Git stores a branch as a file under `refs/heads/`. While `epic/site-foundation` exists, Git cannot also create `epic/site-foundation/skeleton`, because that path would have to be both a file and a directory. Put the epic name in a `feat/<name>/<change>` branch, and open the pull request into `epic/<name>`.

Do not push straight to `main` or to someone else's epic branch.

## Lanes

Lane ownership is this table, not a `CODEOWNERS` file. The lane owner resolves conflicts in that lane.

| Lane        | Paths                                                    | Owner        |
| ----------- | -------------------------------------------------------- | ------------ |
| Design      | `src/styles/`, figure styles under `src/diagrams/style/` | Creative Bot |
| Content     | `src/content/`                                           | Strategy Bot |
| Engineering | config, CI, and the build                                | Engineer Bot |

## Checks

Pull requests into `main` and `epic/**` run four jobs:

- the body contains `Part of #<issue>` (Dependabot and `no-epic` skip this)
- `npm ci`, wikilink check, citation check, figure regeneration check, production build, and HTML link check
- Vale, using `.github/STYLE.md`, on `src/content/docs` (`vale --config .github/vale/.vale.ini src/content/docs`)
- `npm run lint` (ESLint, markdownlint, and Prettier)

The deploy workflow is manual. Edward runs `.github/workflows/deploy.yml` when he decides to publish. Do not run that workflow, change DNS, or turn on GitHub Pages.

## Local commands

Clone, install, and serve steps are in the Run it locally section.

After you edit a `.json5` figure, run `npm run render:figures` and commit the SVG next to it.

`npm run lint` checks ESLint, markdownlint, and Prettier. `npm run format` writes Prettier formatting and applies ESLint fixes.

```bash
npm run lint
npm run format
```

Open `src/content/docs` as an Obsidian vault. Wikilinks stay in `[[wiki]]` form (`useMarkdownLinks` is off). Same-page links use `[text](#heading)`, because `[[#heading]]` has an empty page name and the wikilink check fails the build. Do not commit `.obsidian/workspace.json`.

Write in sentence case. Callout titles are sentence case. Use "Main idea", not "Key idea". External source links in `src/content/docs` are listed in `src/content/references.bib`. `npm run check:citations` fails if a linked source is missing from that file, or if a bibliography entry is linked from no page.

<!-- run-locally:start -->

## Run it locally

You need Git and Node 22.23.4 or later in the 22 line. The range is in `package.json` under `engines`.

Clone the repo and install the lockfile:

```bash
git clone https://github.com/edwardasilva/eeprep.git
cd eeprep
npm ci
npm run dev
```

The dev server listens at <http://localhost:4321>.

Build the static site and serve `dist/`:

```bash
npm run build && npm run preview
```

`npm ci` is the only step that needs the network. The other three commands need no secrets and no network.

Check out pull request number `<n>` with either of these:

```bash
gh pr checkout <n>
```

```bash
git fetch origin pull/<n>/head:pr-<n>
git checkout pr-<n>
```

The fetch command creates a local branch named `pr-<n>`.

Run the checks from the repo root:

```bash
npm run test:wikilinks
npm run check:wikilinks
npm run test:citations
npm run check:citations
npm run check:figures
npm run build
npm run check:links
npm run check:pr-body
npm run lint
vale --config .github/vale/.vale.ini src/content/docs
```

`npm run check:citations` reads `src/content/docs` and `src/content/references.bib`. It does not need a build. `npm run check:links` needs a `dist/` folder, so run `npm run build` first. `npm run check:pr-body` reads `PR_BODY` from the environment. Vale is a separate program. CI installs Vale 3.25.1 and runs `vale --config .github/vale/.vale.ini src/content/docs`.

<!-- run-locally:end -->
