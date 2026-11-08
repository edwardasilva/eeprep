# Contributing

Thanks for helping with EE Prep. This page covers how a change gets from an idea to the live site.

## Start with an issue

Every change starts as a GitHub issue. Open one with an issue form, or comment on an existing issue to say you are working on it. Status lives on the project board, not in a comment thread.

## Branches and pull requests

Cut a short branch from `main` and open a pull request back into `main`. Keep each pull request small: one page or one fix, about 50 to 300 changed lines.

The pull request body names its issue on its own line:

```
Part of #12
```

CI fails a pull request when that line is missing. Dependabot is exempt, and so is a pull request labeled `no-epic`. Do not add that label to feature work. The check runs again when you edit the body or change a label, so no new push is needed.

Show proof in the pull request: the build output, or before-and-after screenshots at desktop width and at 390 px for anything visual.

Every merge is a squash merge, and the branch is deleted when it merges. Do not push straight to `main`.

## Checks

Pull requests into `main` run these jobs:

- the body contains `Part of #<issue>` (Dependabot and `no-epic` skip this)
- `npm ci`, wikilink check, citation check, production build, and HTML link check
- Vale, using `.github/STYLE.md`, on `src/content/docs` (`vale --config .github/vale/.vale.ini src/content/docs`)
- `npm run lint` (ESLint, markdownlint, and Prettier)

## Releases and deploys

The site has two targets on Cloudflare Workers:

| Trigger                        | Target                                  |
| ------------------------------ | --------------------------------------- |
| A merge to `main`              | The dev site, which search engines skip |
| A version tag such as `v0.2.0` | eeprep.com                              |

A release is one commit with its own version tag. The work merged since the last release is squashed into that commit. The tag publishes it and creates a GitHub release with generated notes.

Deploys use the `production` environment secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Local commands

Clone, install, and serve steps are in the Run it locally section.

`npm run lint` checks ESLint, markdownlint, and Prettier. `npm run format` writes Prettier formatting and applies ESLint fixes.

```bash
npm run lint
npm run format
```

Open `src/content/docs` as an Obsidian vault. Wikilinks stay in `[[wiki]]` form (`useMarkdownLinks` is off). Same-page links use `[text](#heading)`, because `[[#heading]]` has an empty page name and the wikilink check fails the build. Do not commit `.obsidian/workspace.json`.

Write in sentence case. Callout titles are sentence case. Use "Main idea", not "Key idea". External source links in `src/content/docs` are listed in `src/content/references.bib`. A citation is an ordinary Markdown link inside the sentence, with plain words as the link text. `npm run check:citations` fails if a linked source is missing from that file, or if a bibliography entry is linked from no page. It also fails on a Pandoc cite such as `[@key]`. It fails on link text that starts with `reddit-` or `x-`, contains `@`, is a bare URL, or is a single token longer than 20 characters. It fails when page prose contains an `@handle` outside code or a URL. It fails when a content line is made only of Markdown links.

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
npm run build
npm run check:links
npm run check:pr-body
npm run lint
vale --config .github/vale/.vale.ini src/content/docs
```

`npm run check:citations` reads `src/content/docs` and `src/content/references.bib`. It does not need a build. `npm run check:links` needs a `dist/` folder, so run `npm run build` first. `npm run check:pr-body` reads `PR_BODY` from the environment. Vale is a separate program. CI installs Vale 3.25.1 and runs `vale --config .github/vale/.vale.ini src/content/docs`.

<!-- run-locally:end -->
