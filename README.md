<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/eeprep-lockup-dark-outlined.svg">
  <img src="public/brand/eeprep-lockup-outlined.svg" alt="eeprep" width="320">
</picture>

eeprep is a free guide for EECS students and new grads. It shows how to build a resume that works, find real experience, and land a first internship or full-time role.

Status: active development.

## Why it exists

Courses teach circuits and signals, but they rarely teach how to turn coursework into a first job. eeprep puts that advice in one place.

## What you'll find

- Advice covers projects and a portfolio, resumes, networking and getting hired for an internship or a first full-time role, interviews, graduate study, and professional societies. Quick setup is the whole guide on one page, and Author's story is a short note on where the advice comes from.
- Help has the job boards and where each one misleads, the repos and lists behind the site, pay data and forums, and where an AI tool helps in the search.
- Roadmap lists what is coming next and how to contribute.

## How sources are handled

Claims link to the sources behind them, so you can check them yourself. If a claim can't be backed up, it stays off the site. The linked sources are listed in [`src/content/references.bib`](src/content/references.bib).

## Read it

The site is live at [eeprep.com](https://eeprep.com).

## Related projects

- [resume-generator](https://github.com/edwardasilva/resume-generator): turns one JSON file into the one-page resume the resume pages describe.
- [company-lists](https://github.com/edwardasilva/company-lists): a plain list of companies by region, starting with the Denver metro.

## Get the code

The repo includes [resume-generator](https://github.com/edwardasilva/resume-generator) and [company-lists](https://github.com/edwardasilva/company-lists) as submodules. Clone them all at once:

```sh
git clone --recurse-submodules https://github.com/edwardasilva/eeprep.git
```

The site builds without the submodules, so a plain clone also works.

To help with the guide, see [CONTRIBUTING](.github/CONTRIBUTING.md).

## License

The repo has two licenses, one for content and one for code.

Content is licensed under [CC BY 4.0](LICENSE-CONTENT). You may share and adapt it if you give credit and link the license. Credit it to [eeprep contributors](https://github.com/edwardasilva/eeprep). Content means:

- the guide pages and their sources in `src/content/`
- the words and drawings shown by the figures in `src/components/advice/`, `src/components/guide/`, `src/components/home/`, `src/components/hired/`, `src/components/interview/`, `src/components/links/`, `src/components/projects/`, `src/components/resume/`, and `src/components/simple/`
- the resume skill in `public/skills/eeprep-resume/`

Code is licensed under the [MIT License](LICENSE). Code means everything else, including the components, plugins, styles, scripts, worker, and config files. The resume-generator submodule has its own licenses: MIT for code and CC BY 4.0 for its examples and docs. The company-lists submodule is licensed under MIT.

The eeprep name and logo files in `src/brand/` and `public/brand/` are not covered by either license.

Other repos carry their own licenses.
