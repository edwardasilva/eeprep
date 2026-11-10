# Contributing

Thanks for helping with [eeprep](https://github.com/edwardasilva/eeprep). Fixes and ideas are welcome from students who used the guide, and from anyone who hires or works as an electrical engineer or computer scientist.

## Suggest an idea or a fix

Open an [issue](https://github.com/edwardasilva/eeprep/issues/new/choose) and describe what you would change. A short description is all it needs. Naming the page and linking a public source help when you can. Every claim needs a real public source before it goes on the site, and maintainers check that during review.

## Edit a page

1. Fork the repo (or cut a short branch if you have write access).
2. Edit one page or one fix. Guide pages live in `src/content/docs`. Outside links go in `src/content/references.bib` too, and maintainers can add that entry during review.
3. Open a pull request into `main` with a short description of what changed and why. That is all a pull request needs. An issue link is optional. Maintainers review the change.

If you can, build it before you push, from the repo root:

```bash
npm ci
npm run build
```

Vale checks the writing style. To run it locally, [install Vale](https://vale.sh/docs/install), then run `vale --config .github/vale/.vale.ini src/content/docs public/skills README.md`. If you skip either step, maintainers run the checks before merging. Merges are squash merges.

## Coding agents

Use the `gemini` label, or comment `@gemini-cli`, for easy tasks: low severity, small, one or two files, docs, wording, config, tests, or polish.

Use the `claude` label, or comment `@claude`, for harder work: medium or high severity, multi-file changes, design, security, workflows, or anything that needs judgment.

Only the repository owner can start either workflow. Both work on a branch and open a pull request. Neither pushes to `main`, merges, tags, or cuts a release.

## Conduct

Be kind and assume good intent. To report a problem with someone's behavior, use GitHub's Report content feature or message the repository owner in private.

For a security problem, follow the [security policy](SECURITY.md). Do not open a public issue.

## Releases

Only the repository owner cuts releases. The resume skill version in `public/skills/eeprep-resume/SKILL.md` follows the version in `package.json`. Set both to the release version in the release commit.

## Changelog

Major changes in the companion repositories, [resume-generator](https://github.com/edwardasilva/resume-generator) and [company-lists](https://github.com/edwardasilva/company-lists), are listed here. eeprep release notes stay on the [Releases](https://github.com/edwardasilva/eeprep/releases) page.

| Project          | Change                                                                                                                                                                                                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resume-generator | After v0.0.2, each JSON file writes its own PDF. The file is named `[Name]-Resume.pdf`, and extra inputs add the JSON file name, so `examples/new-grad.json` writes `Alex-Doe-Resume-new-grad.pdf`. In v0.0.1 the PDF used the JSON file's name (`resume.pdf`, `new-grad.pdf`). |
| company-lists    | The list now covers the Denver and Boulder metros in Colorado, the Austin and Houston metros in Texas, the Los Angeles and San Francisco Bay Area metros in California, and Northern Virginia.                                                                                  |

## License

By contributing, you agree that content is licensed under [CC BY 4.0](../LICENSE-CONTENT) and code under the [MIT License](../LICENSE). Reuse of content is credited to [eeprep contributors](https://github.com/edwardasilva/eeprep).
