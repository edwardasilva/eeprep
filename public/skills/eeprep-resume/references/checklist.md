# The audit

From [eeprep's Cleanup page](https://eeprep.com/advice/resume/cleanup/).

Audit the finished PDF, not the source file. Work top to bottom. Fix what fails, rebuild, and run it again.

## The file

- Extract the text (`pdftotext resume.pdf -`) and read it. Every heading, entry, and bullet comes out whole and in reading order. Watch for "fi" and "fl" ligatures that come out blank or as odd symbols. In pdfLaTeX, `\input{glyphtounicode}` and `\pdfgentounicode=1` fix that. LuaLaTeX and XeLaTeX do not need them.
- Open the PDF properties. The title reads "[Name] Resume" and the author is the user's name. A title left over from a template is a tell.
- Name the file after the person, such as Alex-Doe-Resume.pdf.
- One page.

## The header

- Every link clicked today.
- Links as plain text, no icons, no "Phone:" or "Email:" labels.
- Location present, and "Willing to relocate" if true.
- One email, checked daily.

## Education

- GPA only if the posting sets a minimum the user meets, with matching decimals.
- Graduation date at the right margin, "Expected" if not yet graduated.
- One line of coursework that matches the posting.
- No high school.

## Projects and experience

Read each bullet against three questions. Does it start with a past-tense verb that is not helped, assisted, worked on, or utilized? Does it name the tool? Does it end in a number the user measured and can explain? If the user cannot explain a number, it comes off, because the interviewer will ask.

- Every bullet fills one line or most of two.
- No inflation.
- Unrelated jobs on one line, no bullets.

## Skills

- Every tool in Skills appears in a bullet. Cut what has no bullet.
- No soft skills.
- Exact product names. C and C++ as two items.

## The whole page

- One column, no photo, no icons, no tables.
- Dates right-aligned, one style.
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
[ ] One page

Header
[ ] Every link clicked today
[ ] Links are plain text, no icons, no "Phone:" or "Email:" labels
[ ] Location and "Willing to relocate" present
[ ] One email, checked daily

Education
[ ] GPA only if the posting sets a minimum I meet, decimals matching
[ ] Graduation date at the right margin, "Expected" if not yet graduated
[ ] One line of coursework that matches the posting
[ ] No high school

Projects and experience
[ ] Every bullet: past-tense verb, a tool, a number I can explain
[ ] No helped, assisted, worked on, or utilized
[ ] Every bullet fills one line or most of two
[ ] Unrelated jobs on one line

Skills
[ ] Every tool appears in a bullet
[ ] No soft skills
[ ] Exact product names, C and C++ as two items

Whole page
[ ] One column, no photo, no icons, no tables
[ ] Dates right-aligned, one date style
[ ] Same gap between every pair of sections
[ ] Bold only on titles and labels
[ ] Read by other people, and the general reaction noted
```
