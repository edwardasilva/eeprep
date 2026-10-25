# Resume page outline

This file plans the eeprep.com resume page. The page is for electrical engineering students who want an internship or a first job. Edward Silva wrote the rules for friends on October 25, 2026. [@edward-silva-2026-resume-advice] Edward says that following the wiki got him past automated screeners. Credit that result to Edward's experience. Do not credit the wiki for it. [@edward-silva-2026-resume-advice]

The sample student is Jane Doe. She is fictional. The page, the issue #7 template, and the issue #8 figure use her lines exactly. Do not name the friend. Do not print that friend's resume.

## Section order

The page uses five sections in Edward's order. They are the header, projects, experience, education, and skills. [@edward-silva-2026-resume-advice] Projects lead because Edward treats that section as the strongest proof a student has. Jane's finished page has no objective and no interests section. Her before draft uses another order. That order is Objective, Education, Skills, Work History, Projects, then Extracurricular Activities and Interests.

## Header

The header is the name plus one contact line. No horizontal rule sits under the name. Set the name flush left. Do not center it. [@edward-silva-2026-resume-advice] The phone has no label. The LinkedIn item is the plain path, with no logo. [@edward-silva-2026-resume-advice] The relocation words are "Willing to relocate". Do not write "Open to relocation".

Jane's exact header is this.

```
Jane Doe
(555) 555-0142 | jdoe@example.com | linkedin.com/in/jane-doe-example | Columbus, OH | US citizen | Willing to relocate
```

The before draft centers that name. It draws a rule under the name, writes "Phone:" and "Email:" labels, and uses a LinkedIn logo instead of the URL.

## Why the page cuts the objective

Cut the objective. It takes lines and it says little. [@edward-silva-2026-resume-advice] Jane's before draft opens with this objective.

```
Motivated and hardworking electrical engineering student seeking an internship where I can apply my skills and grow as an engineer.
```

The after draft deletes that objective. The freed lines go to the buck converter, her strongest project.

## Projects

Projects take the most lines on the page. List the tools under each project title and also in Skills. The repeat shows where you used each tool. [@edward-silva-2026-resume-advice] A year-long date uses the form Fall 25 - Spring 26. The command `\hfill` pushes that date to the right margin. `\hfill` is the LaTeX command that does that push. [@edward-silva-2026-resume-advice] A bullet fits on one full line, or it fills a second line. [@edward-silva-2026-resume-advice]

Write each bullet in XYZ form. XYZ means accomplished X as measured by Y by doing Z. [@reddit-engineeringresumes-wiki] Edward tells you to use that form. [@edward-silva-2026-resume-advice] His weak line is "Programmed and optimized drone flight path". His strong line is "Decreased flight path time by x% through a system architecture redesign". Read X as flight path time, Y as x%, and Z as the redesign.

The first project is the buck converter. Its date sits on the right. Its tool line sits under the title.

```
Synchronous Buck Converter for a CubeSat Power Board
Fall 25 - Spring 26
KiCad, LTspice, STM32, Embedded C, bench testing with an electronic load
Reached 92% peak efficiency at a 2 A load, measured on an electronic load, by replacing the catch diode with a synchronous MOSFET stage and tuning dead time to 40 ns with an STM32 timer, up from 84% before
Cut output ripple from 85 mV to 18 mV peak to peak by redesigning the 4-layer PCB in KiCad with a solid ground plane and a tighter switching loop, then resizing the LC output filter for 500 kHz switching
Wrote STM32 firmware in C that samples input current at 1 kHz and shuts the rail down within 50 µs of an overcurrent fault, which kept the board alive through 3 deliberate short-circuit tests at a full 12 V input
Kept the FETs under 50 °C at full load by adding thermal vias and a 2 oz copper pour under them
```

The second project is the equalizer.

```
FPGA Five-Band Audio Equalizer
Spring 25
Verilog, Vivado, MATLAB, Basys 3 FPGA, fixed-point DSP
Processed 48 kHz stereo audio at 0.4 ms latency by pipelining five 64-tap FIR filters in Verilog
Matched the MATLAB response within 0.1 dB from 20 Hz to 20 kHz by testing coefficients in Vivado
Cut LUT use 35% by sharing one multiplier per filter across all 64 taps with time-division scheduling
```

The third project is the battery monitor.

```
Bluetooth Battery Monitor
Fall 24
ESP32, Arduino C++, Python, INA219 current sensor
Tracked 4 Li-ion cells within 10 mV each with an ESP32 monitor that streams to a Python dashboard
Extended pack runtime 15% in field tests by adding a cutoff that drops non-critical loads at 3.3 V
```

## Experience

Name the section Experience. Edward rejects the name Work history. [@edward-silva-2026-resume-advice] Drop unrelated paid work. Edward's example of a cut is a retail job. [@edward-silva-2026-resume-advice] Jane's before draft has that job. The title is Sales Associate, Retail store, and the dates are 06/2023 - 08/2024. The bullets are "Helped customers" and "Ran the register and stocked shelves." Show a measured result. A task list with no number fails the test. [@edward-silva-2026-resume-advice]

CubeSat team work goes under Experience. Edward's later note overrides the Round 2 example that put CubeSat on the Activities line. [@edward-silva-2026-resume-advice] The buck converter stays in Projects. The team role is the entry below, with the date on the right.

```
Power Subsystem Engineer, State University CubeSat Team
Fall 24 - Spring 26
Cut power board mass by 30 g by replacing 6 linear regulators with one buck converter board, which then passed thermal vacuum testing from -20 °C to 60 °C on the first attempt with no board rework needed
Found 2 battery protection faults before launch review by writing a Python test script that runs 200 charge and discharge cycles overnight and flags any cell that drifts more than 20 mV from the pack average
```

The lab role sits under that team entry.

```
Undergraduate Research Assistant, Power Electronics Lab, State University
Summer 25
Reduced GaN switching loss measurement error from 12% to 3% by adding probe deskew calibration to the double-pulse test setup, which the lab now uses as the standard setup for every GaN device it tests
Cut test time per device from 40 to 8 minutes by automating oscilloscope capture with Python and PyVISA
```

## Interests

Make interests specific, or delete them. [@edward-silva-2026-resume-advice] Edward also allows Other interests or Volunteer experience in place of Extracurricular activities and interests. [@edward-silva-2026-resume-advice] Jane's before line is "Reading, music, sports". That line is not specific, so the finished page deletes it and has no interests section.

## Education

Place Education under Experience and above Skills. The degree line comes first, and the school line sits under it. The GPA stays on the degree line. [@edward-silva-2026-resume-advice] Jane's degree line is "B.S. Electrical Engineering, GPA: 3.62/4.00". The school line is State University. The graduation date sits on the right and reads Expected Spring 27. Leave stray periods off the degree line and the school line. [@edward-silva-2026-resume-advice]

Add a line named Relevant coursework. Bold that label on the resume. Edward adds the line because recruiters liked it. [@edward-silva-2026-resume-advice] Jane's courses are these.

```
Signals and Systems, Electronics I and II, Power Electronics, Digital Design, Embedded Systems, Control Systems, Electromagnetics, Probability for Engineers, Microcontroller Lab
```

Add an Activities line under coursework. Jane's line is "Tau Beta Pi, IEEE student branch". CubeSat is not on this line. Edward's later note put that team work in Experience. [@edward-silva-2026-resume-advice] Remove knowledge unless certifiable. Put topics like orbital mechanics in coursework. [@edward-silva-2026-resume-advice]

## Skills

Name the section Skills. Keep one column. Edward keeps about two lines, so projects and experience keep the lines. [@edward-silva-2026-resume-advice] Do not use two columns. Edward says a two-column list looks like hiding thin experience. [@edward-silva-2026-resume-advice] Order the entries from most important to least important. [@edward-silva-2026-resume-advice] Label the lines Software and Certifications. Jane's exact lines are these.

```
Certifications: CSWA (Certified SolidWorks Associate), IPC J-STD-001 soldering
Software: KiCad, LTspice, MATLAB, Vivado, Python, C, Verilog, SolidWorks, Git
```

Cut soft skills. Edward's cuts are communication and problem solving. [@edward-silva-2026-resume-advice] The before draft puts communication, problem solving, Teamwork, Leadership, and Microsoft Office in two columns. Knowledge of orbital mechanics is in that list too, and it moves to coursework.

## Dates and spacing

Keep one gap between sections. Set that gap with `\vspace` and reuse the value. [@edward-silva-2026-resume-advice] `\vspace` is the LaTeX length for the gap between sections. A bullet uses one full line or two full lines. [@edward-silva-2026-resume-advice] Too much white space in the body is a red flag, so put leftover lines on the strongest project. [@edward-silva-2026-resume-advice] For Jane, that project is the buck converter, the one with the 92% efficiency bullet.

Set the text flush left. Do not center a line. [@edward-silva-2026-resume-advice] Class dates keep Edward's form. The buck converter date is Fall 25 - Spring 26, pushed right with `\hfill`. The before draft mixes May 2027, 06/2023 - 08/2024, Summer 2025, 2025-2026, Jan 2025 - May 2025, and Fall 2024. It also leaves stray periods, uneven gaps, and short dangling bullets.

## LaTeX commands

Add `\pdfgentounicode=1` in the preamble. The command maps characters to Unicode so a parser can read the text. [@edward-silva-2026-resume-advice] An application tracking system (ATS) is software that reads a resume before a person does. Edward adds the command so the ATS gets Unicode text. [@edward-silva-2026-resume-advice]

Add `\hypersetup` in the preamble too. [@edward-silva-2026-resume-advice] Edward says resume parsers read the PDF metadata this command writes. [@edward-silva-2026-resume-advice] Issue #7 picks the exact fields inside the command.

## Downloadable template

The page offers jane-doe-resume.tex from issue #7. That file builds jane-doe-resume.pdf. The file uses Edward's format. It already includes `\pdfgentounicode=1` and `\hypersetup`. The person in the file is Jane Doe, and the lines match this outline. Use the LaTeX template from the r/EngineeringResumes wiki. [@reddit-engineeringresumes-wiki] Edward is the one who sends readers there. [@edward-silva-2026-resume-advice]

The file this site ships is the issue #7 template. Do not publish Edward_Silva_Resume.pdf. Ask Edward before the site shows any part of that PDF. [@edward-silva-2026-resume-advice] Copy his format. Use one column. Keep the page black and white. Keep it dense. Put skills on two lines at the bottom. [@edward-silva-2026-resume-advice]

## Annotated teardown

Issue #8 is the before and after figure for Jane Doe. The outline, the template, and the figure all use that one name and these same lines. Numbered callouts mark the rules. The before draft shows seven mistakes. The header mistake is a centered name, a rule under the name, "Phone:" and "Email:" labels, and a LinkedIn logo. The objective is the sentence in the objective section above.

The retail role is Sales Associate at Retail store. The skills mistake is two columns of Communication, Problem solving, Teamwork, Leadership, Microsoft Office, Knowledge of orbital mechanics, KiCad, MATLAB. The interests line is "Reading, music, sports". The dates mix the six forms listed under Dates and spacing, with stray periods and short dangling bullets. The before section order is the one in Section order. The after side uses Edward's order and the one contact line. It also uses the tool lines, the `\hfill` dates, the XYZ bullets, and the two skill lines.

## Checklist

The page closes with a checklist for a printed draft. Each item is one instruction. The list has 10 items.

1. Order the sections as header, projects, experience, education, then skills.
2. Use Jane's contact line, including the words Willing to relocate.
3. Cut the objective.
4. List each project's tools under the title and in Skills.
5. Write each bullet in XYZ form, as on the 92% buck converter line.
6. Push each project date to the right margin with `\hfill`.
7. Keep Skills as two labeled lines in one column.
8. Add `\pdfgentounicode=1` so a parser can read Unicode text.
9. Add `\hypersetup` so resume parsers can read the PDF metadata.
10. Put the CubeSat team role under Experience, not on Activities.

## Last reviewed

The page prints one last-reviewed line. Set the date to October 25, 2026. That is the day Edward wrote the notes this outline uses. Change the date when a rule on the page changes. A typo fix leaves the date as it is.

## Sources

A borrowed rule carries a citation marker in brackets. Put the marker next to the rule it supports. The wiki marker is used in two places only. Those places are the XYZ method and the LaTeX template.

[@edward-silva-2026-resume-advice] Edward Silva, personal communication, Oct 25, 2026.

[@reddit-engineeringresumes-wiki] https://www.reddit.com/r/EngineeringResumes/wiki/index
