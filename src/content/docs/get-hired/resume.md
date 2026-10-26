---
title: Resume
description: How an electrical engineering student writes a resume, with Jane Doe's sample lines and a checklist.
pageType: guide
---

Edward Silva wrote these rules for friends on October 25, 2026, for electrical engineering students who want an internship or a first job. Edward credits the r/EngineeringResumes wiki's format with getting him past automated screeners.

The sample student is Jane Doe. She is fictional, and every number in her bullets and her GPA is a bracketed placeholder, such as [X], [Y], [Z], [W], or [N]. Replace each one with a value you measured.

## Section order

Projects lead the page. Edward treats that section as the strongest proof a student has, so the order is header, projects, experience, education, and skills. Jane Doe's page follows that order from top to bottom.

## Header

The header is your name plus one contact line, flush left, with no rule under the name. Write the phone with no label, and make the LinkedIn item the plain path, with no logo. Use the words "Willing to relocate", not "Open to relocation".

Jane's header is this.

```
Jane Doe
(555) 555-0142 | jdoe@example.com | linkedin.com/in/jane-doe-example | [City, ST] | [Work authorization] | Willing to relocate
```

## Why the page cuts the objective

Cut the objective, because it takes lines and it says little. Jane's before draft opens with this sentence.

```
Motivated and hardworking electrical engineering student seeking an internship where I can apply my skills and grow as an engineer.
```

The finished page leaves that sentence out.

## Projects

Projects take the most lines on the page. List the tools under each project title and again in Skills, so a reader can see where you used each one. A year-long date uses the form Fall 25 - Spring 26, and `\hfill` pushes that date to the right margin. `\hfill` is the LaTeX command that does that push.

A bullet fills one full line or a second line. Write each bullet in XYZ form, which means accomplished X as measured by Y by doing Z. The [r/EngineeringResumes wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index) defines that form, and Edward tells you to use it. His weak line is "Programmed and optimized drone flight path". His strong line is "Decreased flight path time by x% through a system architecture redesign". Read X as flight path time, Y as x%, and Z as the redesign.

Jane's three projects follow.

```
Synchronous Buck Converter for a CubeSat Power Board
Fall 25 - Spring 26
KiCad, LTspice, STM32, Embedded C, bench testing with an electronic load
Reached [X]% peak efficiency at a [Y] A load, measured on an electronic load, by replacing the catch diode with a synchronous MOSFET stage and tuning dead time to [Z] ns with an STM32 timer, up from [W]% before
Cut output ripple from [X] mV to [Y] mV peak to peak by redesigning the [Z]-layer PCB in KiCad with a solid ground plane and a tighter switching loop, then resizing the LC output filter for [W] kHz switching
Wrote STM32 firmware in C that samples input current at [X] kHz and shuts the rail down within [Y] µs of an overcurrent fault, which kept the board alive through [Z] deliberate short-circuit tests at a full [W] V input
Kept the FETs under [X] °C at full load by adding thermal vias and a [Y] oz copper pour under them
```

```
FPGA [N]-Band Audio Equalizer
Spring 25
Verilog, Vivado, MATLAB, Basys 3 FPGA, fixed-point DSP
Processed [X] kHz stereo audio at [Y] ms latency by pipelining [Z] [W]-tap FIR filters in Verilog
Matched the MATLAB response within [X] dB from [Y] Hz to [Z] kHz by testing coefficients in Vivado
Cut LUT use [X]% by sharing one multiplier per filter across all [Y] taps with time-division scheduling
```

```
Bluetooth Battery Monitor
Fall 24
ESP32, Arduino C++, Python, INA219 current sensor
Tracked [X] Li-ion cells within [Y] mV each with an ESP32 monitor that streams to a Python dashboard
Extended pack runtime [X]% in field tests by adding a cutoff that drops non-critical loads at [Y] V
```

## Experience

Name the section Experience, because Edward rejects Work history, and drop unrelated paid work. His example of a cut is "Sales Associate, Retail store, 06/2023 - 08/2024". The bullets "Helped customers" and "Ran the register and stocked shelves." have no measured result, so they fail the test.

Jane's CubeSat team role goes under Experience, not on Activities, while the buck converter stays in Projects.

```
Power Subsystem Engineer, [Student satellite team]
Fall 24 - Spring 26
Cut power board mass by [X] g by replacing [Y] linear regulators with one buck converter board, which then passed thermal vacuum testing from [Z] °C to [W] °C on the first attempt with no board rework needed
Found [X] battery protection faults before launch review by writing a Python test script that runs [Y] charge and discharge cycles overnight and flags any cell that drifts more than [Z] mV from the pack average
```

```
Undergraduate Research Assistant, [University lab]
Summer 25
Reduced GaN switching loss measurement error from [X]% to [Y]% by adding probe deskew calibration to the double-pulse test setup, which the lab now uses as the standard setup for every GaN device it tests
Cut test time per device from [X] to [Y] minutes by automating oscilloscope capture with Python and PyVISA
```

## Interests

Make interests specific, or delete them. Edward also allows Other interests or Volunteer experience in place of Extracurricular activities and interests. Jane's finished page has no interests section, because a generic hobby list is not specific.

## Education

Place Education under Experience and above Skills, with the degree line first, the school line under it, and the GPA on the degree line. Jane's degree line is "B.S. Electrical Engineering, GPA: [X.XX]/4.00", and her school line is [University]. The date on the right reads Expected Spring 27. Leave stray periods off both lines.

Add a Relevant coursework line, and bold that label on the resume, because recruiters liked it.

```
Signals and Systems, Electronics I and II, Power Electronics, Digital Design, Embedded Systems, Control Systems, Electromagnetics, Probability for Engineers, Microcontroller Lab
```

Under that, add an Activities line. Jane's line is "Tau Beta Pi, IEEE student branch". Remove knowledge unless certifiable, and put a topic like orbital mechanics in coursework.

## Skills

Name the section Skills and keep one column of about two lines, so projects and experience keep the page. A two-column list looks like hiding thin experience, Edward says, so order the entries from most important to least important. Label the lines Software and Certifications.

```
Certifications: CSWA (Certified SolidWorks Associate), IPC J-STD-001 soldering
Software: KiCad, LTspice, MATLAB, Vivado, Python, C, Verilog, SolidWorks, Git
```

Cut soft skills such as communication and problem solving.

## Dates and spacing

Keep one gap between sections by setting `\vspace` once and reusing that value. `\vspace` is the LaTeX length for the gap. Too much white space is a red flag, so put leftover lines on the buck converter, the project with the Reached [X]% peak efficiency bullet. Class dates use the same form as the project dates above.

## Preamble commands

Add `\pdfgentounicode=1` in the preamble. It maps characters to Unicode so a parser can read the text. Edward adds it so an application tracking system (ATS), the software that reads a resume before a person does, gets that text.

Add `\hypersetup` in the preamble too, because Edward says resume parsers read the PDF metadata this command writes.

## Downloadable template

Download [jane-doe-resume.tex](/resume/jane-doe-resume.tex), which builds [jane-doe-resume.pdf](/resume/jane-doe-resume.pdf). That file is this site's template, based on the [r/EngineeringResumes wiki](https://www.reddit.com/r/EngineeringResumes/wiki/index) template. Edward is the one who sends readers to that wiki.

The file already includes `\pdfgentounicode=1` and `\hypersetup`. Jane Doe is the person in it, and her lines match this page. Copy Edward's format in black and white, and keep the page dense.

## Before and after

Jane's before draft shows seven mistakes. The finished sample on this page, and in the template, is the after side.

1. The header centers the name, draws a rule under it, adds "Phone:" and "Email:" labels, and uses a LinkedIn logo.
2. The objective is the sentence quoted above.
3. The retail role is the one quoted in Experience.
4. Skills sit in two columns of Communication, Problem solving, Teamwork, Leadership, Microsoft Office, Knowledge of orbital mechanics, KiCad, and MATLAB.
5. The interests line is "Reading, music, sports".
6. Dates mix May 2027, 06/2023 - 08/2024, Summer 2025, 2025-2026, Jan 2025 - May 2025, and Fall 2024, with stray periods and short dangling bullets.
7. Sections run Objective, Education, Skills, Work History, Projects, then Extracurricular Activities and Interests.

## Checklist

Each of these 10 items is one instruction for a printed draft.

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
