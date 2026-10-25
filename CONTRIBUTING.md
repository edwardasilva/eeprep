# Contributing

Work on EE Prep is grouped into epics. An epic is one GitHub issue plus a long-lived branch named `epic/<name>`, cut from `main`.

Small changes use branches named `epic/<name>/<change>` (or `feat/...` and `fix/...` that still include the epic name) and open pull requests into that epic branch. About ten of those can land in one epic. When the epic is done, one pull request from `epic/<name>` into `main` goes to Edward. Only Edward merges to `main`. Delete the branch after it merges.

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

| Branch | What lands there |
| --- | --- |
| `main` | Finished epics, merged by Edward |
| `epic/<name>` | The long-lived epic branch |
| `epic/<name>/<change>` | One small change, reviewed into the epic |

Do not push straight to `main` or to someone else's epic branch.

## Lanes

Lane ownership is this table, not a `CODEOWNERS` file. The lane owner resolves conflicts in that lane.

| Lane | Paths | Owner |
| --- | --- | --- |
| Design | `src/styles/`, figure styles under `diagrams/_style/` | Creative Bot |
| Content | `src/content/` | Strategy Bot |
| Engineering | config, CI, and the build | Engineer Bot |

## Checks

Pull requests into `main` and `epic/**` run three jobs:

- the body contains `Part of #<issue>` (Dependabot and `no-epic` skip this)
- `npm ci`, wikilink check, figure regeneration check, production build, and HTML link check
- Vale, using `docs/STYLE.md`, on `src/content/docs`

There is no deploy workflow. Do not publish the site, change DNS, or turn on GitHub Pages.

## Local commands

```bash
npm install
npm run dev
npm run render:figures
npm run build
```

Open `src/content/docs` as an Obsidian vault. Wikilinks stay in `[[wiki]]` form (`useMarkdownLinks` is off). Do not commit `.obsidian/workspace.json`.

Write in sentence case. Callout titles are sentence case. Use "Main idea", not "Key idea". The bibliography placeholder is `src/content/references.bib`.
