---
title: Resume
description: How an electrical engineering student writes a resume, with Jane Doe's sample lines and a checklist.
pageType: guide
---

Edward Silva wrote these rules for friends on October 25, 2026. The page is for electrical engineering students who want an internship or a first job. He says that following the r/EngineeringResumes wiki got him past automated screeners. Credit that result to Edward's experience. Do not credit the wiki for it.

The sample student is Jane Doe. She is fictional. Every number in her bullets and her GPA is a bracketed placeholder, such as [X], [Y], [Z], [W], or [N]. Replace each one with a value you measured.

## Section order

The page uses five sections in Edward's order. They are the header, projects, experience, education, and skills. Projects lead because Edward treats that section as the strongest proof a student has.

Jane's finished page has no objective and no interests section. Her before draft uses another order. That order is Objective, Education, Skills, Work History, Projects, then Extracurricular Activities and Interests.

## Header

The header is the name plus one contact line. No horizontal rule sits under the name. Set the name flush left. Do not center it.

The phone has no label. The LinkedIn item is the plain path, with no logo. The relocation words are "Willing to relocate". Do not write "Open to relocation".

Jane's exact header is this.

```
Jane Doe
(555) 555-0142 | jdoe@example.com | linkedin.com/in/jane-doe-example | [City, ST] | [Work authorization] | Willing to relocate
```

The before draft centers that name. It draws a rule under the name, writes "Phone:" and "Email:" labels, and uses a LinkedIn logo instead of the URL.

## Why the page cuts the objective

Cut the objective. It takes lines and it says little. Jane's before draft opens with this objective.

```
Motivated and hardworking electrical engineering student seeking an internship where I can apply my skills and grow as an engineer.
```

The after draft deletes that objective. The freed lines go to the buck converter, her strongest project.

## Projects

Projects take the most lines on the page. List the tools under each project title and also in Skills. The repeat shows where you used each tool.

A year-long date uses the form Fall 25 - Spring 26. The command `\hfill` pushes that date to the right margin. `\hfill` is the LaTeX command that does that push.

A bullet fits on one full line, or it fills a second line. Write each bullet in XYZ form. XYZ means accomplished X as measured by Y by doing Z. The [r/EngineeringResumes wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index) is the source of that form. Edward tells you to use it.

His weak line is "Programmed and optimized drone flight path". His strong line is "Decreased flight path time by x% through a system architecture redesign". Read X as flight path time, Y as x%, and Z as the redesign.

The first project is the buck converter. Its date sits on the right. Its tool line sits under the title.

```
Synchronous Buck Converter for a CubeSat Power Board
Fall 25 - Spring 26
KiCad, LTspice, STM32, Embedded C, bench testing with an electronic load
Reached [X]% peak efficiency at a [Y] A load, measured on an electronic load, by replacing the catch diode with a synchronous MOSFET stage and tuning dead time to [Z] ns with an STM32 timer, up from [W]% before
Cut output ripple from [X] mV to [Y] mV peak to peak by redesigning the [Z]-layer PCB in KiCad with a solid ground plane and a tighter switching loop, then resizing the LC output filter for [W] kHz switching
Wrote STM32 firmware in C that samples input current at [X] kHz and shuts the rail down within [Y] µs of an overcurrent fault, which kept the board alive through [Z] deliberate short-circuit tests at a full [W] V input
Kept the FETs under [X] °C at full load by adding thermal vias and a [Y] oz copper pour under them
```

The second project is the equalizer.

```
FPGA [N]-Band Audio Equalizer
Spring 25
Verilog, Vivado, MATLAB, Basys 3 FPGA, fixed-point DSP
Processed [X] kHz stereo audio at [Y] ms latency by pipelining [Z] [W]-tap FIR filters in Verilog
Matched the MATLAB response within [X] dB from [Y] Hz to [Z] kHz by testing coefficients in Vivado
Cut LUT use [X]% by sharing one multiplier per filter across all [Y] taps with time-division scheduling
```

The third project is the battery monitor.

```
Bluetooth Battery Monitor
Fall 24
ESP32, Arduino C++, Python, INA219 current sensor
Tracked [X] Li-ion cells within [Y] mV each with an ESP32 monitor that streams to a Python dashboard
Extended pack runtime [X]% in field tests by adding a cutoff that drops non-critical loads at [Y] V
```

## Experience

Name the section Experience. Edward rejects the name Work history. Drop unrelated paid work.

Edward's example of a cut is a retail job. Jane's before draft has that job. The title line is "Sales Associate, Retail store, 06/2023 - 08/2024".

The bullets are "Helped customers" and "Ran the register and stocked shelves." Show a measured result. A task list with no number fails the test.

CubeSat team work goes under Experience. Edward's later note overrides the Round 2 example that put CubeSat on the Activities line. The buck converter stays in Projects. The team role is the entry below, with the date on the right.

```
Power Subsystem Engineer, [Student satellite team]
Fall 24 - Spring 26
Cut power board mass by [X] g by replacing [Y] linear regulators with one buck converter board, which then passed thermal vacuum testing from [Z] °C to [W] °C on the first attempt with no board rework needed
Found [X] battery protection faults before launch review by writing a Python test script that runs [Y] charge and discharge cycles overnight and flags any cell that drifts more than [Z] mV from the pack average
```

The lab role sits under that team entry.

```
Undergraduate Research Assistant, [University lab]
Summer 25
Reduced GaN switching loss measurement error from [X]% to [Y]% by adding probe deskew calibration to the double-pulse test setup, which the lab now uses as the standard setup for every GaN device it tests
Cut test time per device from [X] to [Y] minutes by automating oscilloscope capture with Python and PyVISA
```

## Interests

Make interests specific, or delete them. Edward also allows Other interests or Volunteer experience in place of Extracurricular activities and interests. Jane's before line is "Reading, music, sports".

That line is not specific, so the finished page deletes it and has no interests section.

## Education

Place Education under Experience and above Skills. The degree line comes first, and the school line sits under it. The GPA stays on the degree line.

Jane's degree line is "B.S. Electrical Engineering, GPA: [X.XX]/4.00". The school line is [University]. The graduation date sits on the right and reads Expected Spring 27.

Leave stray periods off the degree line and the school line. Add a line named Relevant coursework. The resume bolds that label. Edward adds the line because recruiters liked it.

```
Signals and Systems, Electronics I and II, Power Electronics, Digital Design, Embedded Systems, Control Systems, Electromagnetics, Probability for Engineers, Microcontroller Lab
```

Add an Activities line under coursework. Jane's line is "Tau Beta Pi, IEEE student branch". CubeSat is not on this line.

Edward's later note put that team work in Experience. Remove knowledge unless certifiable. Put topics like orbital mechanics in coursework.

## Skills

Name the section Skills. Keep one column. Edward keeps about two lines, so projects and experience keep the lines.

Do not use two columns. Edward says a two-column list looks like hiding thin experience. Order the entries from most important to least important.

Label the lines Software and Certifications. Jane's exact lines are these.

```
Certifications: CSWA (Certified SolidWorks Associate), IPC J-STD-001 soldering
Software: KiCad, LTspice, MATLAB, Vivado, Python, C, Verilog, SolidWorks, Git
```

Cut soft skills. Edward's cuts are communication and problem solving. The before draft puts communication, problem solving, Teamwork, Leadership, and Microsoft Office in two columns.

Knowledge of orbital mechanics is in that list too, and it moves to coursework.

## Dates and spacing

Keep one gap between sections. Set that gap with `\vspace` and reuse the value. `\vspace` is the LaTeX length for the gap between sections.

A bullet uses one full line or two full lines. Too much white space in the body is a red flag, so put leftover lines on the strongest project. For Jane, that project is the buck converter, the one with the Reached [X]% peak efficiency bullet.

Set the text flush left. Do not center a line. Class dates keep Edward's form.

The buck converter date is Fall 25 - Spring 26, pushed right with `\hfill`. The before draft mixes May 2027, 06/2023 - 08/2024, Summer 2025, 2025-2026, Jan 2025 - May 2025, Fall 2024. It also leaves stray periods, uneven spacing, and short dangling bullets.

## Preamble commands

Add `\pdfgentounicode=1` in the preamble. The command maps characters to Unicode so a parser can read the text. An application tracking system (ATS) is software that reads a resume before a person does.

Edward adds the command so the ATS gets Unicode text. Add `\hypersetup` in the preamble too. Edward says resume parsers read the PDF metadata this command writes.

The downloadable template sets the fields inside `\hypersetup`.

## Downloadable template

Download [jane-doe-resume.tex](/resume/jane-doe-resume.tex). That file builds [jane-doe-resume.pdf](/resume/jane-doe-resume.pdf). The file uses Edward's format.

It already includes `\pdfgentounicode=1` and `\hypersetup`. The person in the file is Jane Doe, and the lines match this page. Use the LaTeX template from the [r/EngineeringResumes wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index).

Edward is the one who sends readers there. This site ships that template. It does not ship Edward Silva's own resume file.

Copy his format. Use one column. Keep the page black and white. Keep it dense. Put skills on two lines at the bottom.

## Before and after

This page and the template use Jane Doe and the same lines. The before draft shows seven mistakes.

1. The header centers the name, draws a rule under the name, writes "Phone:" and "Email:" labels, and uses a LinkedIn logo.
2. The objective is the sentence in the objective section above.
3. The retail role is "Sales Associate, Retail store, 06/2023 - 08/2024".
4. The skills block is two columns of Communication, Problem solving, Teamwork, Leadership, Microsoft Office, Knowledge of orbital mechanics, KiCad, and MATLAB.
5. The interests line is "Reading, music, sports".
6. The dates mix the six forms under Dates and spacing, with stray periods and short dangling bullets.
7. The before section order is the one under Section order.

The after side uses Edward's order and the one contact line. It also uses the tool lines, the `\hfill` dates, the XYZ bullets, and the two skill lines.

## Checklist

Run this list on a printed draft. Each item is one instruction. The list has 10 items.

1. Order the sections as header, projects, experience, education, then skills.
2. Use Jane's contact line, including the words Willing to relocate.
3. Cut the objective.
4. List each project's tools under the title and in Skills.
5. Write each bullet in XYZ form, as on the Reached [X]% peak efficiency line.
6. Push each project date to the right margin with `\hfill`.
7. Keep Skills as two labeled lines in one column.
8. Add `\pdfgentounicode=1` so a parser can read Unicode text.
9. Add `\hypersetup` so resume parsers can read the PDF metadata.
10. Put the CubeSat team role under Experience, not on Activities.

## Last reviewed

Last reviewed October 25, 2026. That is the day Edward Silva wrote the notes this page uses. Change the date when a rule on the page changes. A typo fix leaves the date as it is.
