# The audit

From [eeprep's Cleanup page](https://eeprep.com/advice/resume/cleanup/).

Audit the finished PDF, not the source file. Work top to bottom. Fix what fails, rebuild, and run it again.

## The file

- Extract the text (`pdftotext Alex-Doe-Resume.pdf -`) and read it. Every heading, entry, and bullet comes out whole and in reading order. Watch for "fi" and "fl" ligatures that come out blank or as odd symbols. In pdfLaTeX, `\input{glyphtounicode}` and `\pdfgentounicode=1` fix that. LuaLaTeX and XeLaTeX do not need them.
- Open the PDF properties. The title reads "[Name] Resume" and the author is the user's name. A title left over from a template is a tell.
- Name the file after the person, such as Alex-Doe-Resume.pdf.
- One page, or two for a graduate-application CV.

## The header

- Every link clicked today.
- Links as plain text, no icons, no "Phone:" or "Email:" labels.
- Location optional, on its own line, with "Willing to relocate" if true.
- One email, checked daily.

## Education

- GPA listed at 3.50 or higher, judged at 3.0 to 3.49, left off below 3.0, with matching decimals. A graduate-application CV lists the overall GPA with its scale.
- Graduation date at the right margin, "Expected" if not yet graduated.
- One line of coursework that matches the posting, with a "Graduate coursework:" line first if there is one.
- No high school after the first year.

## Projects and experience

Read each bullet against three questions. Does it start with a past-tense verb that is not helped, assisted, worked on, or utilized? Does it name the tool? Does it give a number early wherever the user measured one, and can the user explain it? If the user cannot explain a number, it comes off, because the interviewer will ask.

- Every bullet fills one line or most of two.
- Every bullet holds one idea.
- Symbols written as words, such as 3-sigma and 48 degrees.
- No inflation.
- Unrelated jobs keep one or two bullets. They drop to one line only when the engineering work fills the page without those bullets.

## Skills

- Every tool in Skills appears in a bullet. Cut what has no bullet.
- No soft skills.
- Exact product names. C and C++ as two items.

## The whole page

- One column, no photo, no icons, no tables.
- Dates right-aligned, one style per section, months for jobs.
- Same gap between every pair of sections.
- Bold only on titles and labels.
- Read by at least one other person, and better by several.

## The checklist to hand the user

```text
RESUME AUDIT
File
[ ] pdftotext output has every heading, entry, and bullet, whole and in order
[ ] No broken fi or fl ligatures in the text
[ ] PDF title is "[Name] Resume", author is [Name]
[ ] File is named [Name]-Resume.pdf
[ ] One page, or two for a graduate-application CV

Header
[ ] Every link clicked today
[ ] Links are plain text, no icons, no "Phone:" or "Email:" labels
[ ] Location optional, on its own line, with "Willing to relocate" if true
[ ] One email, checked daily

Education
[ ] GPA listed at 3.50 or higher, judged at 3.0 to 3.49, off below 3.0, decimals matching (a CV lists the overall GPA)
[ ] Graduation date at the right margin, "Expected" if not yet graduated
[ ] One line of coursework that matches the posting, graduate coursework first
[ ] No high school after the first year

Projects and experience
[ ] Every bullet: past-tense verb, a tool, a number I can explain wherever I measured one
[ ] No helped, assisted, worked on, or utilized
[ ] Every bullet fills one line or most of two
[ ] Every bullet holds one idea
[ ] Symbols written as words, such as 3-sigma
[ ] Unrelated jobs on one line only when engineering work fills the page

Skills
[ ] Every tool appears in a bullet
[ ] No soft skills
[ ] Exact product names, C and C++ as two items

Whole page
[ ] One column, no photo, no icons, no tables
[ ] Dates right-aligned, one date style per section, months for jobs
[ ] Same gap between every pair of sections
[ ] Bold only on titles and labels
[ ] Read by other people, and the general reaction noted
```
