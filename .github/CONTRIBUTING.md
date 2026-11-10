# Contributing

Thanks for helping with eeprep. Fixes and ideas are welcome from students who used the guide, and from anyone who hires or works as an electrical engineer or computer scientist.

## Suggest an idea or a fix

Open an [issue](https://github.com/edwardasilva/eeprep/issues/new/choose) and pick a template. Name the page, say what you would change, and say why. Link a public source when you can. Every claim on the site needs a real public source, and a claim that can't be backed up stays off the site.

## Edit a page

1. Fork the repo (or cut a short branch if you have write access).
2. Edit one page or one fix. Guide pages live in `src/content/docs`. Outside links also need an entry in `src/content/references.bib`.
3. Open a pull request into `main`. Keep it small.

Before you push, from the repo root:

```bash
npm ci
npm run build
vale --config .github/vale/.vale.ini src/content/docs
```

CI runs the same checks on the pull request. Merges are squash merges.

## Coding agents

Use the `gemini` label, or comment `@gemini-cli`, for easy tasks: low severity, small, one or two files, docs, wording, config, tests, or polish.

Use the `claude` label, or comment `@claude`, for harder work: medium or high severity, multi-file changes, design, security, workflows, or anything that needs judgment.

Only the repository owner can start either workflow. Both work on a branch and open a pull request. Neither pushes to `main`, merges, tags, or cuts a release.

## Conduct

Be kind and assume good intent. To report a problem with someone's behavior, use GitHub's Report content feature or message the repository owner in private.

For a security problem, follow the [security policy](SECURITY.md). Do not open a public issue.

## Releases

Only the repository owner cuts releases.

## License

By contributing, you agree that content is licensed under [CC BY 4.0](../LICENSE-CONTENT) and code under the [MIT License](../LICENSE).
