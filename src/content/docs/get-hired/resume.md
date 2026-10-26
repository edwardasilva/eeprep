---
title: Resume
description: Rules for a one-page electrical engineering resume. Jane Doe is the sample student.
pageType: guide
---

Jane Doe is not a real student. Copy her layout, then replace every line with your own work. Leave invented numbers in brackets, like `[X]%`.

> [!tip] Main idea
> Use five sections in this order: header, projects, experience, education, skills. Edward Silva says that following the wiki got him past automated screeners. Credit that result to his experience. Do not credit the wiki for it. [@edward-silva-2026-resume-advice]

## Section order

Put projects first. Edward treats that section as the strongest proof a student has. [@edward-silva-2026-resume-advice] The finished page has no objective and no interests section. [@edward-silva-2026-resume-advice]

Jane's before draft uses another order. It runs Objective, Education, Skills, Work History, Projects, then Extracurricular Activities and Interests.

## Header

The header is your name plus one contact line. Set the name flush left. Do not center it, and do not draw a rule under it. [@edward-silva-2026-resume-advice]

Write the phone with no label. Write the LinkedIn item as a plain path, with no logo. [@edward-silva-2026-resume-advice] End the line with the words "Willing to relocate". Do not write "Open to relocation". [@edward-silva-2026-resume-advice]

Jane's header is this.

```
Jane Doe
(555) 555-0142 | jdoe@example.com | linkedin.com/in/jane-doe-example | [City, ST] | [Work authorization] | Willing to relocate
```

Her before draft centers the name. It draws a rule under the name, adds "Phone:" and "Email:" labels, and uses a LinkedIn logo.

## Why the objective goes

Cut the objective. It takes lines and it says little. [@edward-silva-2026-resume-advice] Jane's before draft opens with this sentence.

```
Motivated and hardworking electrical engineering student seeking an internship where I can apply my skills and grow as an engineer.
```

The after draft deletes that objective. The freed lines go to her buck converter, her strongest project.

## Projects

Projects take the most lines on the page. List the tools under each project title, and list them again under Skills. The repeat shows where you used each tool. [@edward-silva-2026-resume-advice]

A year-long date uses the form Fall 25 - Spring 26. The command `\hfill` pushes that date to the right margin. [@edward-silva-2026-resume-advice] A bullet fits on one full line, or it fills a second line. [@edward-silva-2026-resume-advice]

Write each bullet in XYZ form. The r/EngineeringResumes wiki writes that form as "Accomplished [X] as measured by [Y], by doing [Z]." [@reddit-engineeringresumes-wiki] Edward tells you to use it. [@edward-silva-2026-resume-advice]

His weak line is "Programmed and optimized drone flight path". His strong line is "Decreased flight path time by x% through a system architecture redesign". Read X as flight path time, Y as x%, and Z as the redesign. [@edward-silva-2026-resume-advice]

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

Name the section Experience. Edward rejects the name Work history. [@edward-silva-2026-resume-advice] Drop unrelated paid work. His example of a cut is a retail job. [@edward-silva-2026-resume-advice] Jane's before draft has that job.

The title line is "Sales Associate, Retail store, 06/2023 - 08/2024". The bullets are "Helped customers" and "Ran the register and stocked shelves." Show a measured result. A task list with no number fails his test. [@edward-silva-2026-resume-advice]

CubeSat team work goes under Experience. Edward's later note puts that team role here, not on the Activities line. [@edward-silva-2026-resume-advice] The buck converter stays in Projects. The team role is the entry below, with the date on the right.

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

## Education

Place Education under Experience and above Skills. The degree line comes first, and the school line sits under it. The GPA stays on the degree line. [@edward-silva-2026-resume-advice]

Jane's degree line is "B.S. Electrical Engineering, GPA: [X.XX]/4.00". The school line names the university in brackets. The graduation date sits on the right and reads Expected Spring 27. Leave stray periods off the degree line and the school line. [@edward-silva-2026-resume-advice]

Add a line named Relevant coursework. Bold that label on the resume. Edward adds the line because recruiters liked it. [@edward-silva-2026-resume-advice] Jane's courses are these.

```
Signals and Systems, Electronics I and II, Power Electronics, Digital Design, Embedded Systems, Control Systems, Electromagnetics, Probability for Engineers, Microcontroller Lab
```

Add an Activities line under coursework. Jane's line is "Tau Beta Pi, IEEE student branch". CubeSat is not on this line. [@edward-silva-2026-resume-advice] Remove knowledge unless you can certify it. Put a topic like orbital mechanics on the coursework line. [@edward-silva-2026-resume-advice]

## Skills

Name the section Skills. Keep one column. Edward keeps about two lines, so projects and experience keep the rest of the page. [@edward-silva-2026-resume-advice] Do not use two columns. He says a two-column list looks like hiding thin experience. [@edward-silva-2026-resume-advice] Order the entries from most important to least important. [@edward-silva-2026-resume-advice]

Label the lines Software and Certifications. Jane's lines are these.

```
Certifications: CSWA (Certified SolidWorks Associate), IPC J-STD-001 soldering
Software: KiCad, LTspice, MATLAB, Vivado, Python, C, Verilog, SolidWorks, Git
```

Cut soft skills. Edward's cuts are communication and problem solving. [@edward-silva-2026-resume-advice] The before draft puts communication, problem solving, Teamwork, Leadership, and Microsoft Office in two columns. Knowledge of orbital mechanics sits in that list too, and it moves to coursework.

## Interests

Make interests specific, or delete them. [@edward-silva-2026-resume-advice] Edward also allows Other interests or Volunteer experience in place of Extracurricular activities and interests. [@edward-silva-2026-resume-advice] Jane's before line is "Reading, music, sports". That line is not specific, so the finished page deletes it and has no interests section.

## Dates and spacing

Keep one gap between sections. Set that gap with `\vspace` and reuse the same value. `\vspace` is the LaTeX length for the gap between sections. [@edward-silva-2026-resume-advice]

A bullet uses one full line or two full lines. [@edward-silva-2026-resume-advice] Too much white space in the body is a red flag, so put leftover lines on the strongest project. [@edward-silva-2026-resume-advice] For Jane, that project is the buck converter, the one with the reached `[X]%` peak efficiency bullet.

Set the text flush left. Do not center a line. [@edward-silva-2026-resume-advice] Class dates keep Edward's form. The buck converter date is Fall 25 - Spring 26, pushed right with `\hfill`.

The before draft mixes six date forms. They are May 2027, 06/2023 - 08/2024, Summer 2025, 2025-2026, Jan 2025 - May 2025, and Fall 2024. It also leaves stray periods, uneven spacing, and short dangling bullets.

## Preamble commands

Add `\pdfgentounicode=1` in the preamble. The command maps characters to Unicode so a parser can read the text. [@edward-silva-2026-resume-advice] An applicant tracking system (ATS) is software that reads a resume before a person does. Edward adds the command so the ATS gets Unicode text. [@edward-silva-2026-resume-advice]

A LaTeX file in the r/EngineeringResumes resume-templates repository sets the same command. Its comment says the line makes the PDF output all-Unicode and machine-readable. [@github-r-engineeringresumes-latex-template]

Add `\hypersetup` in the preamble too. [@edward-silva-2026-resume-advice] The downloadable file below already includes both commands.

## Download the sample

Download [jane-doe-resume.tex](/resume/jane-doe-resume.tex). That file builds [jane-doe-resume.pdf](/resume/jane-doe-resume.pdf). The person in the file is Jane Doe, and the lines match this page.

Use the LaTeX template from the r/EngineeringResumes wiki. The wiki index points to that template. [@reddit-engineeringresumes-wiki] Edward is the one who sends readers there. [@edward-silva-2026-resume-advice]

Copy his format. Use one column. Keep the page black and white. Keep it dense. Put skills on two lines at the bottom. [@edward-silva-2026-resume-advice]

## Checklist

Run this list on a printed draft. Each item is one instruction.

1. Order the sections as header, projects, experience, education, then skills. [@edward-silva-2026-resume-advice]
2. Use Jane's contact line, including the words Willing to relocate. [@edward-silva-2026-resume-advice]
3. Cut the objective. [@edward-silva-2026-resume-advice]
4. List each project's tools under the title and in Skills. [@edward-silva-2026-resume-advice]
5. Write each bullet in XYZ form, as on the buck converter efficiency line. [@edward-silva-2026-resume-advice]
6. Push each project date to the right margin with `\hfill`. [@edward-silva-2026-resume-advice]
7. Keep Skills as two labeled lines in one column. [@edward-silva-2026-resume-advice]
8. Add `\pdfgentounicode=1` so a parser can read Unicode text. [@edward-silva-2026-resume-advice] [@github-r-engineeringresumes-latex-template]
9. Add `\hypersetup` in the preamble. [@edward-silva-2026-resume-advice]
10. Put the CubeSat team role under Experience, not on Activities. [@edward-silva-2026-resume-advice]

## Last reviewed

This page was last reviewed on October 25, 2026. That is the day Edward wrote the notes this page uses. [@edward-silva-2026-resume-advice] Change the date when a rule on the page changes. A typo fix leaves the date as it is.
