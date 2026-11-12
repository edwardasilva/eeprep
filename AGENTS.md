# Rules for the coding agent

This repo is the eeprep guide. Read `.github/CONTRIBUTING.md` and `.github/STYLE.md` before you change anything, and follow them. The rules below are the same ones that apply to every coding agent in this repo.

## Routing

Use the `claude` label, or comment `@claude`, to hand an issue or pull request to the coding agent.

Only the repository owner can start the workflow. It works on a branch and opens a pull request. It never pushes to `main`, merges, tags, or cuts a release.

## Git

- Work on a branch. Never push to `main`.
- Every change reaches `main` through a pull request, and every merge is a squash merge. Only the repository owner merges.
- When you work from an issue, name it in the pull request body on its own line, as `Part of #N`, and add `Closes #N` when the pull request finishes the issue. Outside contributors do not need an issue link. A short description is enough.
- Keep each pull request to one change.
- Do not create tags. Do not force-push or rewrite pushed history.
- A release is cut only when the repository owner says so.

## Site and writing

- No emoji anywhere: files, commits, pull requests, comments, or output.
- Do not put bot or tool names in repo text or commit messages.
- Keep examples neutral, such as Alex Doe with they and them.
- This site is pseudonymous. Never add a real name, a personal site, or an employer, and never link to another site of the owner.
- Never mention visas or security clearances.
- Cite every claim in `src/content/references.bib`, as the style guide says.
- When you add an outside URL, add it to `src/data/link-index.json` too, and run `npm run check:link-index` before you push.

## Checks

Before you push, from the repo root:

```bash
npm ci
npm run build
vale --config .github/vale/.vale.ini src/content/docs
```

## Secrets

Never print or commit secrets, tokens, or environment variables.
