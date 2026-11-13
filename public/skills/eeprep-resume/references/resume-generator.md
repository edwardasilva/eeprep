# Filling in resume.json for resume-generator

[resume-generator](https://github.com/edwardasilva/resume-generator) turns one JSON file into a one-page PDF with the layout from eeprep's resume page. It does the layout and the one-page fit. You write the content. Its README has the full field guide. This is the short version, so you can fill the file from an inventory.

## Shape

```json
{
  "settings": {
    "sectionOrder": ["education", "projects", "experience", "skills"],
    "font": "libertinus",
    "dateStyle": { "education": "month", "projects": "semester", "experience": "month" }
  },
  "header": {
    "name": "Alex Doe",
    "phone": "(555) 555-0142",
    "email": "alex.doe@example.com",
    "linkedin": "linkedin.com/in/alex-doe-example",
    "github": "github.com/alex-doe-example",
    "website": "",
    "location": "Springfield, ST",
    "relocate": true
  },
  "education": [
    {
      "degree": "B.S. Electrical Engineering",
      "gpa": "",
      "school": "Example State University",
      "gradDate": "Expected May 2027",
      "coursework": ["Power Electronics", "Embedded Systems"],
      "activities": ["IEEE student branch"]
    }
  ],
  "projects": [
    {
      "title": "CubeSat Power Board",
      "tools": ["KiCad", "LTspice"],
      "start": "Fall 2025",
      "end": "Spring 2026",
      "bullets": [
        "Designed a [X] W CubeSat buck converter in KiCad and LTspice, measured at [X]% efficiency on an electronic load"
      ]
    }
  ],
  "experience": [
    {
      "title": "Sales Associate",
      "company": "Retail store",
      "location": "Springfield, ST",
      "start": "May 2023",
      "end": "Aug 2024",
      "engineering": false,
      "bullets": [
        "Processed about [X] sales and returns a shift at the register",
        "Trained [X] new hires on the register and the closing checklist"
      ]
    }
  ],
  "skills": {
    "software": ["KiCad", "LTspice", "C", "Python"],
    "hardwareLab": ["Oscilloscope", "Electronic load"],
    "certifications": []
  }
}
```

## Rules the build enforces

- Every date in a section uses that section's date style, `semester` (Fall 2025) or `month` (Sept 2025, and Sep 2025 also works). Mixing them stops the build.
- A blank field or an empty list is left out of the PDF.
- `engineering: false` keeps a job's bullets while the page has room for them. Once another job has `"engineering": true` and the rest of the resume fills the page, the false one drops to one line and loses its bullets, with a note. So give a job outside engineering one or two bullets, and let the build decide.
- `hide: true` leaves an entry out without deleting it. Use it for a version aimed at one niche.
- Links must be web addresses, `mailto:`, or `tel:`. Inside a bullet, `[text](url)` links the text.
- The build keeps the margins at 0.5 in and steps text from 11 pt to 10 pt until the page fits, then fills the page by growing the spacing. It never shrinks spacing below the eeprep limits. If it still does not fit, it says about how many lines to cut.
- The PDF is named after the header name, so Alex Doe gives `Alex-Doe-Resume.pdf`.
- When `pdftotext` is installed, each build extracts the text and checks that every heading, entry, and bullet comes out whole.

## Versions

Keep one JSON file per version, such as `resume-firmware.json` and `resume-test.json`, and build each with `./run resume-firmware.json`. The facts stay the same across files. What changes is the order, which entries are hidden, which bullets get the second line, and the Skills lines.

## What you still do by hand

The tool does not write bullets, pick the section order for the user, or decide what to leave off. Those come from `rules.md`, `bullets.md`, and `tailoring.md`. Run `checklist.md` on the PDF it writes.
