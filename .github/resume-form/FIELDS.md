# Resume fields spec

This is the field list for a planned resume fill-in form. The workshop handouts on `get-hired/resume-workshop.mdx` use the same labels, so a student can move from paper to the form without renaming anything. Each rule below comes from the resume page (`get-hired/resume.mdx`) or from a source that page cites.

Alex Doe is a made-up student. Alex's values are the examples, and they match Figure 3 on the resume page. Brackets such as `[X]` stay brackets in the example data.

## How the form behaves

1. The form runs in the browser only. It sends nothing to a server and stores nothing outside the student's own browser. That keeps the site free of data collection.
2. The output is one page in the layout of Alex's finished page: centered header, then left-aligned sections with dates at the right margin.
3. The form makes two outputs: a LaTeX file built on the r/EngineeringResumes wiki template's preamble, and plain text in the order of Alex's page.
4. Rules come in two levels. An error blocks the output, because the page says "never" or "do not". A warning shows next to the field and lets the student continue.
5. The prefill button loads Alex's data and labels it "Made-up example".

## Field reference

The "Label" column is the exact text on the handouts, up to any colon or parenthesis. The "Key" column is the name for code.

### Header

| Label               | Key                 | Type   | Required | Alex's example                   |
| ------------------- | ------------------- | ------ | -------- | -------------------------------- |
| Name                | `header.name`       | text   | yes      | Alex Doe                         |
| Phone               | `header.phone`      | text   | no       | [phone]                          |
| Email               | `header.email`      | text   | yes      | alex.doe@[school].edu            |
| LinkedIn            | `header.linkedin`   | text   | no       | linkedin.com/in/alex-doe-example |
| GitHub              | `header.github`     | text   | no       | github.com/alex-doe-example      |
| Location            | `header.location`   | text   | no       | City, ST                         |
| Work status         | `header.workStatus` | text   | no       | (blank)                          |
| Willing to relocate | `header.relocate`   | yes/no | no       | yes                              |
| Clearance           | `header.clearance`  | text   | no       | (blank)                          |

Rules:

- Name is centered in large type. The contact line goes under it, with no rule line between them. Items are separated by " | ". Source: eeprep's author, resume page "Header".
- Contact line order: phone, email, LinkedIn, GitHub. Skip blank items without leaving an empty separator.
- Error: a label such as "Phone:", "Cell:", "Email:", or an icon. Source: [the wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index/), Contact Information.
- Strip a leading `https://`, `http://`, or `www.` from LinkedIn and GitHub, and show the link as plain text. Source: resume page "Header".
- Warning on any link: "Click this link before you send." Source: [a hiring manager who sees dead links](https://www.reddit.com/r/EngineeringResumes/comments/1hw10ms/12_yoe_some_long_direct_advice_in_tech_from_a/).
- Strip a leading `+1` from a US or Canadian phone number. Source: the wiki, Contact Information.
- Second centered line: location, then work status, then "Willing to relocate" if yes, then clearance. Omit the line when all four are blank. Source: resume page "Header" and Alex's page.
- Work status is free text with a hint: "Only if true. Never claim you need no sponsorship when you do." Source: [one manager on the lie that ends the process](https://www.reddit.com/r/EngineeringResumes/comments/1hw10ms/12_yoe_some_long_direct_advice_in_tech_from_a/).
- The wiki calls phone, LinkedIn, and a non-local location unnecessary. eeprep's author lists phone and LinkedIn. The form follows the resume page, so all three stay optional and shown.

### Education

`education` is a list of 1 to 2 entries. A second entry is for a master's degree, which keeps the bachelor's line. Source: [a hiring manager's advice](https://www.reddit.com/r/EngineeringResumes/comments/1si2l4m/resume_advice_from_a_hiring_manager/).

| Label               | Key                      | Type             | Required | Alex's example                                                                    |
| ------------------- | ------------------------ | ---------------- | -------- | --------------------------------------------------------------------------------- |
| Degree              | `education[].degree`     | text             | yes      | B.S. Electrical Engineering                                                       |
| GPA                 | `education[].gpa`        | text             | no       | [X.XX]/4.00                                                                       |
| School              | `education[].school`     | text             | yes      | [University]                                                                      |
| Graduation date     | `education[].gradDate`   | date (see Dates) | yes      | Expected Spring 2027                                                              |
| Relevant coursework | `education[].coursework` | list of text     | no       | Embedded Systems, Introduction to High Power Electronics, Advanced Digital Design |
| Activities          | `education[].activities` | list of text     | no       | CubeSat team, IEEE student branch                                                 |

Rules:

- Line 1: degree, then ", GPA " and the GPA on the same line, then the graduation date at the right margin. Line 2: school. Source: eeprep's author, resume page "Education".
- GPA format is `N.NN/4.00`. Error if the two numbers have different decimal places, such as 3.3/4.00. Source: [an intern's resume review](https://www.reddit.com/r/EngineeringResumes/comments/15i3d8v/my_boss_said_my_resume_could_use_a_lot_of_work/).
- GPA hint: "List it when the posting sets a minimum you meet." Source: eeprep's rule from "Your first internship", repeated on the resume page.
- Coursework and activities each print as one line, with the label "Relevant coursework:" or "Activities:" in bold. Both lines are omitted when blank. Source: eeprep's author.
- Coursework hint: "Upper-level electives that match the posting." Source: [an ECE interviewer](https://www.reddit.com/r/EngineeringResumes/comments/q4d5op/electrical_engineering_senior_no_experience/).
- Warning if an activity looks like a technical build team. The hint says to move real build work into Projects with bullets. Source: resume page "Projects".
- Error on a high school entry. Source: the wiki.

### Projects

`projects` is a list of 0 to 4 entries. Order is the student's choice. Best first.

| Label                   | Key                    | Type                 | Required   | Alex's example      |
| ----------------------- | ---------------------- | -------------------- | ---------- | ------------------- |
| Project title           | `projects[].title`     | text                 | yes        | CubeSat Power Board |
| Tools                   | `projects[].tools`     | list of text         | yes        | KiCad, LTspice      |
| Start date              | `projects[].start`     | date                 | yes        | Fall 2025           |
| End date                | `projects[].end`       | date or "Present"    | yes        | Spring 2026         |
| Bullet 1, Bullet 2, ... | `projects[].bullets[]` | bullet (see Bullets) | at least 1 | see below           |

Rules:

- Title line: title in bold, then the tools in parentheses, then the date range at the right margin. LaTeX: `\textbf{CubeSat Power Board} (KiCad, LTspice) \hfill Fall 2025 -- Spring 2026`. Source: eeprep's author, resume page "Projects".
- Error if the title contains the word "project", in any case. Source: [the wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index/), Projects.
- 1 to 4 bullets per project. Warning when a weaker project has more bullets than the first project. Source: eeprep's author adds bullets to the best projects and does not add weak ones.

### Experience

`experience` is a list of 0 to 4 entries.

| Label            | Key                        | Type              | Required            | Alex's example  |
| ---------------- | -------------------------- | ----------------- | ------------------- | --------------- |
| Job title        | `experience[].title`       | text              | yes                 | Sales Associate |
| Company          | `experience[].company`     | text              | yes                 | [Retail store]  |
| Location         | `experience[].location`    | text              | no                  | (blank)         |
| Start date       | `experience[].start`       | date              | yes                 | Summer 2023     |
| End date         | `experience[].end`         | date or "Present" | yes                 | Summer 2024     |
| Engineering role | `experience[].engineering` | yes/no            | yes                 | no              |
| Bullet 1, ...    | `experience[].bullets[]`   | bullet            | only if engineering | none            |

Rules:

- Engineering role, yes: bold title and company, dates at the right margin, then the location, then the bullets. Source: resume page "Experience".
- Engineering role, no: one line with title, company, and dates, and no bullets. The form hides the bullet fields. Source: [a commenter in the top 5 thread](https://www.reddit.com/r/EngineeringResumes/comments/1pkixp9/today_i_made_a_top_5_list/).
- The section heading is always "Experience", never "Work History". Source: resume page.

### Bullets

Each bullet has a final `text` and optional helper parts. The parts fill the XYZ handout, and the form joins them into a first draft of `text`. The student can then edit `text` freely, and every check runs on `text`.

| Label                              | Key             | Type           | Alex's example                                                                                                                                                      |
| ---------------------------------- | --------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Verb                               | `bullet.verb`   | text           | Designed                                                                                                                                                            |
| What you built or changed          | `bullet.what`   | text           | a [X] W synchronous buck converter                                                                                                                                  |
| Tool or method                     | `bullet.tool`   | text           | KiCad                                                                                                                                                               |
| Result, with a number you measured | `bullet.result` | text           | measured [X]% efficiency                                                                                                                                            |
| How you checked it                 | `bullet.check`  | text, optional | on an electronic load, within [X]% of the LTspice model                                                                                                             |
| Bullet text                        | `bullet.text`   | text           | Designed a [X] W synchronous buck converter in KiCad for a CubeSat power board and measured [X]% efficiency on an electronic load, within [X]% of the LTspice model |

Alex's second bullet, written as free text: "Shrank the switching loop on the second board revision and cut output ripple from [X] mV to [X] mV on an oscilloscope, within [X]% of a hand calculation".

Draft join: `{verb} {what} in {tool} and {result} {check}`. Drop "in {tool}" when the tool is blank, and drop "{check}" when it is blank. Do not add a period at the end, to match Alex's bullets.

Rules:

- Error if `text` starts with helped, assisted, worked on, or utilized. Source: resume page "Bullets".
- Warning if the first word does not end in "ed" and is not on an irregular past-tense list (built, cut, wrote, led, ran, made, drew, set, found, taught, brought). Source: the page asks for a past-tense verb.
- Warning if `text` has no digit and no `[X]`. Hint: "Add a number you measured. Do not force one." Source: [a recruiter on numbers](https://x.com/randomrecruiter/status/1759685173044498630) and [a reviewer on artificial metrics](https://www.reddit.com/r/EngineeringResumes/comments/1w1e5dp/student_100_embeddedhardware_intern_applications/).
- Error if `text` contains bold markup. Source: the wiki says never bold keywords in a bullet.
- Length warning. Set `LINE_CHARS` by measuring one full line in the rendered template, then warn when the last line holds fewer than about 15 characters, which is two short words. Also warn above two full lines. Source: eeprep's author calls two words alone on a line wasted space.

### Skills

| Label          | Key                     | Type         | Alex's example                |
| -------------- | ----------------------- | ------------ | ----------------------------- |
| Software       | `skills.software`       | list of text | KiCad, LTspice                |
| Hardware/Lab   | `skills.hardwareLab`    | list of text | oscilloscope, electronic load |
| Certifications | `skills.certifications` | list of text | (blank)                       |

Rules:

- One line per non-empty group, with a bold label and a comma-separated list, in the order typed. The hint says "Most important first." Source: eeprep's author.
- Warning on a soft skill: communication, teamwork, leadership, problem solving, time management. Source: eeprep's author cuts soft skills such as communication.
- Error on "C/C++". Hint: write "C, C++". Source: [the wiki's skill-name page](https://www.reddit.com/r/EngineeringResumes/wiki/typo/).
- Warning for each skill that appears in no bullet `text` and in no project's Tools, case-insensitive. Source: [a recruiter quoting hiring managers](https://x.com/randomrecruiter/status/2007074490233053671).
- Certifications hint: "Only ones you can prove."

### Page settings

| Label         | Key            | Type                  | Alex's example                           |
| ------------- | -------------- | --------------------- | ---------------------------------------- |
| Target role   | `targetRole`   | text, not printed     | summer 2027 embedded firmware internship |
| Date style    | `dateStyle`    | `semester` or `month` | semester                                 |
| Section order | `sectionOrder` | list                  | Education, Projects, Experience, Skills  |

Rules:

- Target role is never printed. It drives the hints, such as "matches the posting" on coursework.
- Section order allows these 4 presets, plus drag to reorder:
  1. Education, Projects, Experience, Skills. Wiki default with no technical job. Alex uses it.
  2. Projects, Experience, Education, Skills. eeprep's author, when projects are strongest.
  3. Experience, Projects, Education, Skills. eeprep's author's own order as a working engineer.
  4. Education, Experience, Projects, Skills. Wiki student default with work experience.
- Empty sections are not printed.
- The form has no objective or summary field. The resume page says to cut it.

### Dates

- Semester style: `Fall 2025`, `Spring 2026`, `Summer 2023`. Month style: `Mar 2026`. Error if one resume mixes the two styles. Source: [the wiki, Dates](https://www.reddit.com/r/EngineeringResumes/wiki/index/), and eeprep's author.
- Month abbreviations: Jan, Feb, Mar, Apr, May, June, July, Aug, Sept, Oct, Nov, Dec, with no period. Source: the wiki, Dates.
- Full 4-digit years only. Error on '25 or 9/2025. Source: the wiki, Dates.
- Ranges use an en dash with a space on each side: `Fall 2025 – Spring 2026`. In LaTeX, write `--`. Source: the wiki, Dates.
- An ongoing item ends in "Present". Error on Current, Now, or Ongoing. Source: the wiki, Dates.
- Graduation date may start with "Expected". Source: Alex's page.
- All dates sit at the right margin. Source: the wiki and Figure 4.

## Layout output

Fixed by the form. Students cannot change these:

- 1 page and 1 column, black text, no icons, photo, or tables. Error if the output runs past one page. Source: the wiki and resume page "Layout".
- Text at 10 to 11 pt. Start at 11 pt and go no lower than 10 pt. Source: resume page "Layout". The wiki asks for 10.5 pt or larger.
- Margins at 0.4 to 0.75 in. Start at 0.5 in and go no lower than 0.4 in. Source: resume page "Layout" and the wiki's 0.4 in minimum.
- One `\vspace` value between every pair of sections. Source: eeprep's author.
- Section titles in bold with a full-width rule. Entry titles and the coursework and activities labels are bold. Nothing else is bold. Source: resume page, under Alex's page.
- PDF metadata: `\hypersetup{pdftitle={<Name> Resume}, pdfauthor={<Name>}}`. Source: eeprep's author.

### Template license

The wiki's LaTeX template is published on GitHub at [r-engineeringresumes/resume-templates](https://github.com/r-engineeringresumes/resume-templates) under the MIT License, copyright 2024 r-engineeringresumes. The preamble may be adapted. Keep the copyright line and the MIT notice in the generated `.tex` file as a comment, and in the repo next to the generator. Do not copy the template's sample text, such as its sample name or its advice bullets.

## Handout-to-field map

| Handout                  | Fields it fills                                                                                 |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| Resume fields sheet      | Every field above                                                                               |
| XYZ bullet fill-in       | `bullet.verb`, `bullet.what`, `bullet.tool`, `bullet.result`, `bullet.check`, `bullet.text`     |
| Bullet rewrite worksheet | Practice only. No fields                                                                        |
| Peer-review sheet        | None. Its lines match the error and warning rules above                                         |
| Project inventory        | `projects[].title`, `projects[].tools`, `projects[].start`, `projects[].end`, and draft bullets |
| This week                | None                                                                                            |
