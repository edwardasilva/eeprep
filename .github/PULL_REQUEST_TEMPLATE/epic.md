## Epic merge

This pull request merges an epic into `main`.

This template opens when the compare URL includes `?template=epic.md`.

`https://github.com/edwardasilva/eeprep/compare/main...epic/name?template=epic.md`

Part of #

Add the `epic:` label for this epic and one `type:` label. Choose `type: content`, `type: figure`, `type: design`, `type: ci`, or `type: research`.

## Summary

Write what changed and why.

## Checklist

- [ ] The base branch is `main`.
- [ ] The pull request has its `epic:` label and one `type:` label.
- [ ] Every claim, quote, or lesson cites a source in `references.bib`.
- [ ] The prose passes the self-check in `.github/STYLE.md`. It has no em dashes or semicolons, no cut words, and sentence-case headings.
- [ ] Technical content (math, circuits, code) is flagged for an engineering review with the `technical-accuracy` label.
- [ ] Figures were re-rendered from source.
- [ ] Nothing gets published or deployed.

## Sign-off

Reviewers share one GitHub account. A GitHub review cannot show which reviewer approved.

Each reviewer ticks their own box and leaves a comment that says what they checked.

The maintainer ticks the last box only after the other three are ticked. The maintainer then tags `@edwardasilva`. Edward reviews the pull request only after that tag.

- [ ] Content reviewer: content and sources
- [ ] Engineering reviewer: technical accuracy and CI
- [ ] Design reviewer: design and figures
- [ ] Maintainer: final approval, ticked last, only after the other three are ticked
