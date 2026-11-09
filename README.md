# eeprep

eeprep is a free guide for electrical engineering students and new grads. It shows how to build a resume that works, find real experience, and land a first internship or full-time role.

Status: active development. Content and code are updated regularly.

## Why it exists

EE courses teach circuits and signals, but they rarely teach you how to turn coursework into a first job. eeprep puts that advice in one place, written plainly, with sources you can check.

## What you'll find

- Advice covers projects and a portfolio, resumes, networking and getting hired for an internship or a first full-time role, interviews, graduate study, and professional societies. Quick setup is the whole guide on one page, and Author's story is how the author got from school to a first embedded software job.
- Help has the job boards and where each one misleads, the repos and lists behind the site, pay data and forums, and where an AI tool helps in the search.
- Roadmap lists what is coming next and how to contribute.

## How sources are handled

Every claim links to the source behind it, so you can check it yourself. If a claim can't be backed up, it stays off the site. The linked sources are listed in [`src/content/references.bib`](src/content/references.bib).

## Read it

The site is live at [eeprep.com](https://eeprep.com).

## Get the code

The repo includes [resume-generator](https://github.com/edwardasilva/resume-generator) as a submodule. Clone both at once:

```sh
git clone --recurse-submodules https://github.com/edwardasilva/eeprep.git
```

The site builds without the submodule, so a plain clone also works.

To help with the guide, see [CONTRIBUTING](.github/CONTRIBUTING.md).

## License

The repo has two licenses, one for content and one for code.

Content is licensed under [CC BY 4.0](LICENSE-CONTENT). You may share and adapt it if you give credit and link the license. Content means:

- the guide pages and their sources in `src/content/`
- the words and drawings shown by the figures in `src/components/advice/`, `src/components/hired/`, `src/components/interview/`, `src/components/projects/`, and `src/components/resume/`

Code is licensed under the [MIT License](LICENSE). Code means everything else, including the components, plugins, styles, scripts, worker, and config files. The resume-generator submodule has its own MIT license.

The eeprep name and logo files in `src/brand/` and `public/brand/` are not covered by either license.
