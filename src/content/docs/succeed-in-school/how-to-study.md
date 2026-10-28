---
title: How to study
description: How to study circuits, signals, and analog design, and how to check work a model wrote.
pageType: study
---

Jane Doe is the example student on this page. Her school is [University]. Her GPA is [X.XX]/4.00. A number that belongs to her stays in brackets, like [X] hours. Her week has no hour count here.

> [!tip] Main idea
> Write how the circuit works, in your own words. Then check the drawing. A plan can look finished and still leave a porch light with no wire. [@x-siliconcodesign-2026-analog] [@reddit-2026-ai-replace-ee]

## Circuits

@lukeweston says EE students and hobbyists get stuck on real wires versus ideal wires. EDA software stores a netlist. EDA means electronic design automation. A netlist is a list of abstract nets. The translation of an abstract net into a real conductor makes the difference. He says the netlist concept may be unhelpful for seeing that translation. [@x-lukeweston-2026-wires]

Jane draws the schematic first. That drawing is the ideal wire. Her next question is where the net becomes copper. He gave no trace width, so her width stays blank.

## Signals and systems

@EmperorChi9617 calls Signals and Systems their least favorite course. A week after it ended, they had forgotten how to take a Fourier transform. [@x-EmperorChi9617-2026-fourier]

@joseph_ofofon missed the first class on Fourier series. The class had reached the Fourier transform, and they still understood none of it. [@x-joseph_ofofon-2025-missed]

@baby__engineer tried hard to understand signals and systems in the year they called 300L. Some parts stuck. Some did not. Applications showed up later, when they started what they called IT. [@x-baby__engineer-2026-s300l]

@yoruis27 says a closed-book exam was much easier. The exams were written so a student could finish in the sitting. One take-home in signals and systems filled the exam from a PhD thesis. They say 80% of that class failed. [@x-yoruis27-2026-takehome]

The signals course page is [[Signals and DSP]].

## Analog design

@siliconcodesign calls analog design one of the hardest EE specialties, and says it is taught inefficiently. People treat it as a "black art" that takes years of experience to fully get. A lot of the intuition comes from Cadence simulation and from leading-edge PDKs. A PDK is the process design kit for a chip process. Those kits are hard to get outside a job. [@x-siliconcodesign-2026-analog]

They give four study steps.

1. Pick one foundational book or course and finish it. They name Razavi for analog design, and Andrew Ng when the subject is AI.
2. After each chapter, write a bottom-up summary in your own words. Describe how one circuit works, step by step.
3. When the book is done, map the topologies for each block. Record the pros and cons of each.
4. Build harder blocks on top of simpler ones. Their example is a folded cascode OTA. An OTA is an operational transconductance amplifier. [@x-siliconcodesign-2026-analog]

They say a reasoning model can shorten the learning curve, because it can show what it is doing. You still write step 2 in your own words. [@x-siliconcodesign-2026-analog]

Jane writes step 2 on paper, in her own words.

## When a model writes the work

An incoming student posted a house wiring plan from ChatGPT and asked if AI would replace electrical engineers. The commenter socal_nerdtastic answered on that thread. Looks good and is good are different. On the drawing, the range outlet went to the fridge. One light switch went to another switch. The porch light was not connected at all. They say you will use AI, whatever your career is. They say it will not replace engineers for a very long time. It will not replace them in your career. [@reddit-2026-ai-replace-ee]

@hilmybox says programs still train the junior rung. That rung is CAD, PCB layout, test scripts, and basic analysis. He says AI automates that rung first. [@x-hilmybox-2026-curricula]

@T4roRoot lists one model beside each course they are learning, and says that mix enabled their 4.0. FPGA programming uses Gemini. Power systems uses Claude and Gemini. Analog design uses Claude Projects and ChatGPT. They call embedded a gamble. The prompt list is in the replies under that post. [@x-T4roRoot-2026-aistudy]

@Kila_Tech says AI will not replace electrical engineers. It will replace engineers who refuse to use it. The engineer who uses it as a tool outpaces the one who fears it. [@x-Kila_Tech-2026-adapt]

Before you trust a model-drawn plan, look for the miss socal_nerdtastic found. On that plan the porch light had no connection. [@reddit-2026-ai-replace-ee] Then write the circuit the way step 2 says. [@x-siliconcodesign-2026-analog]

## Homework and exams

Bupod, on the KiCad thread, says an interviewer rejected EE candidates who could not identify a diode symbol on a schematic. Learn the symbol. Learn to read one. [@reddit-2026-kicad-learning]

@yoruis27 says a closed-book signals exam was much easier, because the exam was designed to be finished in the time. [@x-yoruis27-2026-takehome]

## The bench

@OnosSpeaks calls out EE students who cannot run an oscilloscope or a function generator. [@x-OnosSpeaks-2025-scope]

@labs_yy says college EE labs are moving onto software. Few students have real lab skills. [@x-labs_yy-2025-labs]

Bupod names four bench skills.

- On a DMM, current and voltage are read in different ways. A DMM is a digital multimeter. Learn both readings.
- On a scope, learn AC coupling, DC coupling, and what triggering does.
- Learn what a spectrum analyzer shows, when you can use one, and why.
- Do not start a fire. Practice soldering.

Bupod also says to learn LTspice. Lay out the circuit in it. Analyze it there. Check that the simulation works in theory before you build. [@reddit-2026-kicad-learning]

## Builds you can show

@princess_yfe says the line "you need the right tools before you can start" is a lie they used to believe. Waiting for a perfect setup means nothing gets built. An STM32 Nucleo, a logic analyzer, and a soldering station add up fast. [@x-princess_yfe-2026-budget]

They give four moves for a student budget.

1. Start in a simulator. Wokwi is free. It runs Arduino, ESP32, and STM32 in the browser. Their examples are a temperature monitor, an LED matrix, and UART between two virtual microcontrollers. UART is a serial link between chips. A simulation is not real hardware. It still builds understanding you can show.
2. Use gear the department already owns. Oscilloscopes, dev kits, and parts sit unused outside class. Ask the lecturer. Ask the lab technician.
3. Write the project down. Record the goal, what you built, what went wrong, what you learned, and how you fixed it. Put that on GitHub. A documented small project beats an undocumented complex one.
4. Split the cost with other students. Five people can share one dev kit.

An entry-level portfolio does not need a satellite, they say. It needs evidence that you can break a problem down, build a fix, and explain the work. [@x-princess_yfe-2026-budget]

@BackwoodsEnginr has 35 years or more in EE and RF, and teaches in a university EE and computer engineering program. He starts students on KiCad. That includes co-op and intern students at work. He has used Cadence, OrCad, Allegro, Mentor, Altium, Eagle, and older tools. His students later ask why the next package is less intuitive than KiCad. [@x-BackwoodsEnginr-2026-kicad]

@blind_via says an engineering student can request an Altium student license and practice the tool before the job search. [@x-blind_via-2026-altium]

Bupod says KiCad is the right tool when it is the one you can get. Use it to learn schematics and how a PCB is laid out. A PCB is a board you design. If you can get a student copy of Altium, he recommends that, and he calls Altium the industry tool. Either way, design a board, have it built, assemble it, and show it working. He says you are unlikely to be marked down for a KiCad board instead of an Altium board. Demonstrated Altium use gets more attention. [@reddit-2026-kicad-learning]

@joelteply says a plain Arduino or Pi project will not carry you. Dig into the EE. He wants a degree in electrical or computer engineering for that work. [@x-joelteply-2025-arduinocut]

@CodeWithOnari is an EE student who is not building hardware, because the parts cost too much. [@x-CodeWithOnari-2025-expensive]

@karanbhilhatiya says learning hardware costs more than learning software. Software needs a computer and a network connection. Hardware needs a scope, diodes, transistors, and breadboards, plus a computer if the work is embedded. [@x-karanbhilhatiya-2026-oppcost]

AtmosphereLucky164 says learn Python for automation, and show the thinking by splitting one large project into small ones. Their freshman summer was an FPGA project. They designed and simulated an 8-bit CPU. That single project used Python, data notes, Excel, system design, and design verification. [@reddit-2026-freshman-skills]

EffectiveClient5080 says bring working demos to interviews. They carry a briefcase with the last two or three projects and a power strip. [@reddit-2026-freshman-skills]

## When the term is too full

Amadeus3698, on the GPA thread, says you need friends in the program who help you do homework and study. If a low GPA comes from not studying, the work starts next term. If you are overextended, drop extras. [@reddit-2025-gpa-matter]

HoldOptimal5595, on the freshman skills thread, says buy an Arduino kit and play with it. They would not fill the summer with intense math or physics study. If you study during the summer anyway, they name 3Blue1Brown and Walter Lewin. [@reddit-2026-freshman-skills]

TopCompany9406 says a little C or Python, plus an Arduino, is enough. The courses teach the rest. Enjoy that summer. The next four summers or so will not be as free. [@reddit-2026-freshman-skills]

## A posted grade minimum

The freshman who opened the GPA thread did the arithmetic. A good case was about 2.99. A bad case was 2.6. They can program a PLC, solder, and use AutoCAD and SolidWorks. They are one of two people in charge of communications for a school lunar robot. They asked if that file can beat the grade. [@reddit-2025-gpa-matter]

saplinglearningsucks says GPA matters when the job posts a minimum. Otherwise leave it off unless they ask. [@reddit-2025-gpa-matter]

almotnw3, writing from another country, asked professors, teaching assistants, and alumni. Those people said to aim for a GPA of 3. The projects and the CAD work are what show that you applied the course. [@reddit-2025-gpa-matter]

Amadeus3698 wants a GPA on an intern application. It shows that you are serious about school. It also shows they are less likely to have to teach you every concept for your year. They have had interns who could not do basic concepts, and that summer was a waste. A low GPA is likely filtered online at a large company, before a person sees the resume. Apply where a person can hear the rest of the file. [@reddit-2025-gpa-matter]

Jane compares her [X.XX] with any minimum the posting prints. If she is under it, she talks to a person. [@reddit-2025-gpa-matter]

Where the resume prints that number is on [[Resume]].

## Checklist

Run this list on the current course. Each line is one instruction from a source above.

1. After each analog chapter, write how one circuit works, in your own words. [@x-siliconcodesign-2026-analog]
2. Map the topologies, then add a harder block such as a folded cascode OTA. [@x-siliconcodesign-2026-analog]
3. On a model-drawn plan, look for a load on the wrong circuit and a light with no connection. That is what socal_nerdtastic found. [@reddit-2026-ai-replace-ee]
4. Learn to use an oscilloscope and a function generator. [@x-OnosSpeaks-2025-scope]
5. On a DMM, practice current and voltage as separate measurements. [@reddit-2026-kicad-learning]
6. On a scope, practice AC coupling, DC coupling, and triggering. [@reddit-2026-kicad-learning]
7. Identify a diode on a schematic. [@reddit-2026-kicad-learning]
8. If you own no board yet, start in Wokwi. [@x-princess_yfe-2026-budget]
9. Ask the lab technician for a scope that sits unused outside class. [@x-princess_yfe-2026-budget]
10. Write the goal, the failure, and the fix. [@x-princess_yfe-2026-budget]
11. Start board layout in KiCad. [@x-BackwoodsEnginr-2026-kicad]
12. If a posting lists a GPA minimum and Jane's [X.XX] is under it, talk to a person. [@reddit-2025-gpa-matter]
13. If the term is too full, drop an extra and do the homework with classmates. [@reddit-2025-gpa-matter]
