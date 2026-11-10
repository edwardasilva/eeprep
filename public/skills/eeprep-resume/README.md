<!-- vale Eeprep.SentenceCase = NO -->
# eeprep-resume
<!-- vale Eeprep.SentenceCase = YES -->

A skill for Claude Code, Cursor, Codex, and other coding agents that teaches the agent how to write, review, and tailor a one-page engineering resume to the rules on [eeprep.com](https://eeprep.com), without inventing a single fact.

## Install

Claude Code reads skills from `.claude/skills/<name>/SKILL.md` in a project, or from `~/.claude/skills/` for every project. Copy this folder there:

```bash
dest="$HOME/.claude/skills/eeprep-resume"
base=https://eeprep.com/skills/eeprep-resume
mkdir -p "$dest/references"
curl -fsSL "$base/SKILL.md" -o "$dest/SKILL.md"
for f in inventory rules bullets tailoring checklist humanize resume-generator; do
  curl -fsSL "$base/references/$f.md" -o "$dest/references/$f.md"
done
```

Then say "use the eeprep-resume skill" or ask for a resume. The skill's description tells the agent when to load it.

Cursor and other agents that read a rules file: paste `SKILL.md` into `.cursor/rules/eeprep-resume.mdc` or `AGENTS.md`, and keep the `references/` folder next to it so the agent can open the files it names.

## Files

| File                             | What it holds                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------- |
| `SKILL.md`                       | The workflow and the main rule: never invent a fact                                                 |
| `references/inventory.md`        | The questions that pull real material out of the student                                            |
| `references/rules.md`            | Layout, section order, header, education, projects, experience, skills                              |
| `references/bullets.md`          | Did X with Y to get Z, with the verbs to use and to avoid                                           |
| `references/tailoring.md`        | Tailoring to a posting, the 4 or 5 versions to keep, acronyms and the ATS, and how to use reviewers |
| `references/checklist.md`        | The audit to run on the finished PDF                                                                |
| `references/humanize.md`         | The tells that make a page read as machine-written, and how to remove them                          |
| `references/resume-generator.md` | How to fill `resume.json` for the layout tool                                                       |

## License

CC BY 4.0, the same as the rest of eeprep's content. Credit it to [eeprep contributors](https://github.com/edwardasilva/eeprep). The source is [the eeprep repository](https://github.com/edwardasilva/eeprep), under `public/skills/eeprep-resume/`.
