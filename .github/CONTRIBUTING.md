# Contributing

Thanks for helping with [eeprep](https://github.com/edwardasilva/eeprep). Fixes and ideas are welcome from students who used the guide, and from anyone who hires or works as an electrical engineer or computer scientist.

## The best ways to help

The most useful help is a correction with a public source behind it. In order of how much each one helps:

1. Report a mistake. A wrong fact, a dead link, or advice that did not work for you. Name the page, and link a public source if you have one.
2. Say what happened in your own search. If a page helped you land an internship or job, or sent you the wrong way, open an idea and say which page and what happened. Real results shape the next release.
3. Send a source. A public page that backs up or contradicts a claim on the site. Every claim on the site needs one.
4. Fix a small thing yourself. A typo, a dead link, or one unclear sentence. The steps are below, and you only need a GitHub account.

## Suggest an idea or a fix

Open an [issue](https://github.com/edwardasilva/eeprep/issues/new/choose) and pick "Fix something" or "Idea or suggestion". A short description is all it needs. Naming the page and linking a public source help when you can. Maintainers check every claim against a real public source during review.

## Edit a page in your browser

You can fix a page without installing anything:

1. Find the page's file in this repo. Guide pages live in `src/content/docs`, and the file path follows the page address. The page at `eeprep.com/advice/resume/cleanup/` is the file `src/content/docs/advice/resume/cleanup.mdx`. If no file has that name, look for `index.mdx` in the folder of that name.
2. Click the pencil icon (Edit this file). GitHub makes your own copy of the repo the first time.
3. Make one change: one fix, or one page. A small change is quick to review and easy to undo.
4. If you add an outside link, paste it in the pull request too. Maintainers add the source entry for you.
5. Click "Commit changes", then "Propose changes", then "Create pull request". Write a sentence or two on what you changed and why. That is all a pull request needs. An issue link is optional.

## Work on your computer

For a bigger change, or to see a page before you send it. You need Git and the Node version in `.nvmrc` (Node 22).

```bash
git clone --recurse-submodules https://github.com/<your-account>/eeprep.git
cd eeprep
npm ci
npm run dev
```

`npm run dev` serves the site at `http://localhost:4321/` and reloads as you edit. Work on a branch, keep it to one change, and open a pull request into `main`.

### Sources

Every claim needs a public source. Cite it in `src/content/references.bib`, as [STYLE.md](STYLE.md) explains. Each outside URL on a page also needs an entry in `src/data/link-index.json`. If either step is new to you, paste the links in the pull request and a maintainer adds the entries.

### Checks

These are optional for you. Maintainers run them before a change goes in. From the repo root:

```bash
npm run lint              # ESLint, markdownlint, and Prettier
npm run build             # builds the site
npm run check:links       # links between pages
npm run check:link-index  # every outside URL has its src/data/link-index.json entry
```

Vale checks the writing style against [STYLE.md](STYLE.md). To run it, [install Vale](https://vale.sh/docs/install), then run `vale --config .github/vale/.vale.ini src/content/docs public/skills README.md`.

## What happens next

A maintainer reviews the pull request and may ask a question or suggest a change. Each accepted change goes in as one squashed commit. Merges to `main` update a preview site that search engines skip, and eeprep.com updates with the next release.

## Coding agents

Use the `claude` label, or comment `@claude`, to hand an issue or pull request to the coding agent.

Only the repository owner can start the workflow. It works on a branch and opens a pull request. It never pushes to `main`, merges, tags, or cuts a release.

## Conduct

Be kind and assume good intent. To report a problem with someone's behavior, use GitHub's Report content feature or message the repository owner in private.

For a security problem, follow the [security policy](SECURITY.md). Do not open a public issue.

## Releases

Only the repository owner cuts releases. The resume skill version in `public/skills/eeprep-resume/SKILL.md` follows the version in `package.json`. Set both to the release version in the release commit.

## Changelog

Major changes in the companion repositories, [resume-generator](https://github.com/edwardasilva/resume-generator) and [company-lists](https://github.com/edwardasilva/company-lists), are listed here. eeprep release notes stay on the [Releases](https://github.com/edwardasilva/eeprep/releases) page.

| Project          | Change                                                                                                                                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| company-lists    | The list adds one file per state for major employers in all 50 states, next to the seven metro files.                                                                                                                                                                        |
| resume-generator | v0.0.2: Students put Skills last, as the r/EngineeringResumes wiki orders the sections. Jobs and graduation take month dates. A non-engineering job keeps its bullets until the rest of the resume fills the page. The fonts folder ships the TeX Gyre notices and the LPPL. |
| company-lists    | v0.0.2: `ee_relevant` is `true` or empty, never `false`, and the issue form and validator match the schema.                                                                                                                                                                  |
| resume-generator | Each JSON file writes its own PDF. The file is named `[Name]-Resume.pdf`, and extra inputs add the JSON file name, so `examples/new-grad.json` writes `Alex-Doe-Resume-new-grad.pdf`.                                                                                        |
| company-lists    | The list now covers the Denver and Boulder metros in Colorado, the Austin and Houston metros in Texas, the Los Angeles and San Francisco Bay Area metros in California, and Northern Virginia.                                                                               |

## License

By contributing, you agree that content is licensed under [CC BY 4.0](../LICENSE-CONTENT) and code under the [MIT License](../LICENSE). Reuse of content is credited to [eeprep contributors](https://github.com/edwardasilva/eeprep).
