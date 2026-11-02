---
title: How to study
description: How to study circuits, signals, and analog design, and how to check work a model wrote.
pageType: study
---

Alex Doe is the example student on this page, at [University] with a GPA of [X.XX]/4.00. A number that belongs to Alex stays in brackets, like [X] hours. This page gives no hour count for Alex's week.

> [!tip] Main idea
> Write how the circuit works, in your own words, as an [analog design post](https://x.com/siliconcodesign/status/2080669341016805488) says. Then check the drawing. A plan can look finished and still leave a porch light with no wire, as an [EE and AI thread](https://www.reddit.com/r/ElectricalEngineering/comments/1sujlpy/will_ai_slowly_replace_some_electrical/) describes.

## Circuits

One person says EE students and hobbyists get stuck on real wires versus ideal wires, in a [wires and nets post](https://x.com/lukeweston/status/2080532775539798421). EDA software stores a netlist. EDA means electronic design automation. A netlist is a list of abstract nets. The translation of an abstract net into a real conductor makes the difference. The poster says the netlist concept may be unhelpful for seeing that translation.

Alex draws the schematic first. That drawing is the ideal wire. The next question is where the net becomes copper. The poster gave no trace width, so Alex's width stays blank.

## Signals and systems

One student calls Signals and Systems their least favorite course in a [signals course post](https://x.com/EmperorChi9617/status/2101555675243725149). A week after it ended, they had forgotten how to take a Fourier transform.

One student missed the first class on Fourier series, in a [missed lecture post](https://x.com/joseph_ofofon/status/2003009472520978548). The class had reached the Fourier transform, and they still understood none of it.

One student tried hard to understand signals and systems in the year they called 300L, in a [signals year post](https://x.com/baby__engineer/status/2091598743619469406). Some parts stuck. Some did not. Applications showed up later, when they started what they called IT.

One student says a closed-book exam was much easier, in an [exam format post](https://x.com/yoruis27/status/2092075207012098440). The exams were written so a student could finish in the sitting. One take-home in signals and systems filled the exam from a PhD thesis. They say 80% of that class failed.

The signals course page is [[Signals and DSP]].

## Analog design

One person calls analog design one of the hardest EE specialties, and says it is taught inefficiently, in an [analog design post](https://x.com/siliconcodesign/status/2080669341016805488). People treat it as a "black art" that takes years of experience to fully get. A lot of the intuition comes from Cadence simulation and from leading-edge PDKs. A PDK is the process design kit for a chip process. Those kits are hard to get outside a job.

They give four study steps in that [analog design post](https://x.com/siliconcodesign/status/2080669341016805488).

1. Pick one foundational book or course and finish it. They name [Razavi](https://www.seas.ucla.edu/brweb/) for analog design, and Andrew Ng when the subject is AI.
2. After each chapter, write a bottom-up summary in your own words. Describe how one circuit works, step by step.
3. When the book is done, map the topologies for each block. Record the pros and cons of each.
4. Build harder blocks on top of simpler ones. Their example is a folded cascode OTA, in that [analog design post](https://x.com/siliconcodesign/status/2080669341016805488). An OTA is an operational transconductance amplifier.

They say a reasoning model can shorten the learning curve, because it can show what it is doing, in that [analog design post](https://x.com/siliconcodesign/status/2080669341016805488). You still write step 2 in your own words.

Alex writes step 2 on paper, in their own words.

## When a model writes the work

An incoming student posted a house wiring plan from ChatGPT and asked if AI would replace electrical engineers, on an [EE and AI thread](https://www.reddit.com/r/ElectricalEngineering/comments/1sujlpy/will_ai_slowly_replace_some_electrical/). One commenter answered on that thread. Looks good and is good are different. On the drawing, the range outlet went to the fridge. One light switch went to another switch. The porch light was not connected at all. They say you will use AI, whatever your career is. They say it will not replace engineers for a very long time. It will not replace them in your career.

One person says programs still train the junior rung, in a [junior rung post](https://x.com/hilmybox/status/2067277355111092413). That rung is CAD, PCB layout, test scripts, and basic analysis. The poster says AI automates that rung first.

One student lists one model beside each course they are learning, and says that mix enabled their 4.0, in a [study mix post](https://x.com/T4roRoot/status/2045351462541156386). FPGA programming uses Gemini. Power systems uses Claude and Gemini. Analog design uses Claude Projects and ChatGPT. They call embedded a gamble. The prompt list is in the replies under that post.

One person says AI will not replace electrical engineers, in an [AI tool post](https://x.com/Kila_Tech/status/2061704871456145812). It will replace engineers who refuse to use it. The engineer who uses it as a tool outpaces the one who fears it.

Before you trust a model-drawn plan, look for the miss one commenter found on an [EE and AI thread](https://www.reddit.com/r/ElectricalEngineering/comments/1sujlpy/will_ai_slowly_replace_some_electrical/). On that plan the porch light had no connection. Then write the circuit the way step 2 says in the [analog design post](https://x.com/siliconcodesign/status/2080669341016805488).

## Homework and exams

One commenter on a [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/) says an interviewer rejected EE candidates who could not identify a diode symbol on a schematic. Learn the symbol. Learn to read one.

One student says a closed-book signals exam was much easier, because the exam was designed to be finished in the time, in an [exam format post](https://x.com/yoruis27/status/2092075207012098440).

## The bench

One person calls out EE students who cannot run an oscilloscope or a function generator, in a [bench skills post](https://x.com/OnosSpeaks/status/2001938854585270650).

One person says college EE labs are moving onto software, in a [lab skills post](https://x.com/labs_yy/status/1984368758216147412). Few students have real lab skills.

One commenter names four bench skills on a [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/).

- On a DMM, current and voltage are read in different ways. A DMM is a digital multimeter. Learn both readings.
- On a scope, learn AC coupling, DC coupling, and what triggering does.
- Learn what a spectrum analyzer shows, when you can use one, and why.
- Do not start a fire. Practice soldering.

The same commenter also says to learn [LTspice](https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html), on that [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/). Lay out the circuit in it. Analyze it there. Check that the simulation works in theory before you build.

## Builds you can show

One person says the line "you need the right tools before you can start" is a lie they used to believe, in a [student budget post](https://x.com/princess_yfe/status/2052407178993029236). Waiting for a perfect setup means nothing gets built. An STM32 Nucleo, a logic analyzer, and a soldering station add up fast.

They give four moves for a student budget in that [student budget post](https://x.com/princess_yfe/status/2052407178993029236).

1. Start in a simulator. [Wokwi](https://wokwi.com/) is free. It runs Arduino, ESP32, and STM32 in the browser. Their examples are a temperature monitor, an LED matrix, and UART between two virtual microcontrollers. UART is a serial link between chips. A simulation is not real hardware. It still builds understanding you can show.
2. Use gear the department already owns. Oscilloscopes, dev kits, and parts sit unused outside class. Ask the lecturer. Ask the lab technician.
3. Write the project down. Record the goal, what you built, what went wrong, what you learned, and how you fixed it. Put that on GitHub. A documented small project beats an undocumented complex one.
4. Split the cost with other students. Five people can share one dev kit.

An entry-level portfolio does not need a satellite, they say, in that [student budget post](https://x.com/princess_yfe/status/2052407178993029236). It needs evidence that you can break a problem down, build a fix, and explain the work.

One engineer has 35 years or more in EE and RF, and teaches in a university EE and computer engineering program, in a [KiCad teaching post](https://x.com/BackwoodsEnginr/status/2061281029155918079). They start students on [KiCad](https://www.kicad.org/). That includes co-op and intern students at work. They have used Cadence, OrCad, Allegro, Mentor, Altium, Eagle, and older tools. Their students later ask why the next package is less intuitive than KiCad.

One person says an engineering student can request an [Altium student license](https://www.altium.com/education/students) and practice the tool before the job search, in an [Altium license post](https://x.com/blind_via/status/2061016080370573758).

One commenter on a [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/) says KiCad is the right tool when it is the one you can get. Use it to learn schematics and how a PCB is laid out. A PCB is a board you design. If you can get a student copy of Altium, the commenter recommends that and calls Altium the industry tool. Either way, design a board, have it built, assemble it, and show it working. The commenter says you are unlikely to be marked down for a KiCad board instead of an Altium board. Demonstrated Altium use gets more attention.

One person says a plain Arduino or Pi project will not carry you, in a [project depth post](https://x.com/joelteply/status/1995534628065780018). Dig into the EE. The poster wants a degree in electrical or computer engineering for that work.

An EE student is not building hardware, because the parts cost too much, in a [parts cost post](https://x.com/CodeWithOnari/status/2006474598318252292).

One person says learning hardware costs more than learning software, in a [hardware cost post](https://x.com/karanbhilhatiya/status/2078038754368065816). Software needs a computer and a network connection. Hardware needs a scope, diodes, transistors, and breadboards, plus a computer if the work is embedded.

One commenter says learn Python for automation, and show the thinking by splitting one large project into small ones, on a [freshman skills thread](https://www.reddit.com/r/EngineeringStudents/comments/1si0rp5/as_a_freshman_ee_student_what_skills_should_i/). Their freshman summer was an FPGA project. They designed and simulated an 8-bit CPU. That single project used Python, data notes, Excel, system design, and design verification.

Another commenter says bring working demos to interviews, on that [freshman skills thread](https://www.reddit.com/r/EngineeringStudents/comments/1si0rp5/as_a_freshman_ee_student_what_skills_should_i/). They carry a briefcase with the last two or three projects and a power strip.

## When the term is too full

One commenter on a [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) says you need friends in the program who help you do homework and study. If a low GPA comes from not studying, the work starts next term. If you are overextended, drop extras.

Another commenter on the [freshman skills thread](https://www.reddit.com/r/EngineeringStudents/comments/1si0rp5/as_a_freshman_ee_student_what_skills_should_i/) says buy an Arduino kit and play with it. They would not fill the summer with intense math or physics study. If you study during the summer anyway, they name [3Blue1Brown](https://www.3blue1brown.com/) and Walter Lewin.

Another commenter says a little C or Python, plus an Arduino, is enough, on that [freshman skills thread](https://www.reddit.com/r/EngineeringStudents/comments/1si0rp5/as_a_freshman_ee_student_what_skills_should_i/). The courses teach the rest. Enjoy that summer. The next four summers or so will not be as free.

## A posted grade minimum

The freshman who opened the [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) did the arithmetic. A good case was about 2.99. A bad case was 2.6. They can program a PLC, solder, and use AutoCAD and SolidWorks. They are one of two people in charge of communications for a school lunar robot. They asked if that file can beat the grade.

Another commenter says GPA matters when the job posts a minimum, on that [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/). Otherwise leave it off unless they ask.

A student writing from another country asked professors, teaching assistants, and alumni, on that [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/). Those people said to aim for a GPA of 3. The projects and the CAD work are what show that you applied the course.

A commenter who hires interns wants a GPA on an intern application, on that [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/). It shows that you are serious about school. It also shows they are less likely to have to teach you every concept for your year. They have had interns who could not do basic concepts, and that summer was a waste. A low GPA is likely filtered online at a large company, before a person sees the resume. Apply where a person can hear the rest of the file.

Alex compares their [X.XX] with any minimum the posting prints. If Alex is under it, Alex talks to a person, as that [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) says.

Where the resume prints that number is on [[Resume]].

## Checklist

Run this list on the current course. Each line is one instruction from a source above.

1. After each analog chapter, write how one circuit works, in your own words, as an [analog design post](https://x.com/siliconcodesign/status/2080669341016805488) says.
2. Map the topologies, then add a harder block such as a folded cascode OTA, as that [analog design post](https://x.com/siliconcodesign/status/2080669341016805488) says.
3. On a model-drawn plan, look for a load on the wrong circuit and a light with no connection. That is what one commenter found on an [EE and AI thread](https://www.reddit.com/r/ElectricalEngineering/comments/1sujlpy/will_ai_slowly_replace_some_electrical/).
4. Learn to use an oscilloscope and a function generator, as a [bench skills post](https://x.com/OnosSpeaks/status/2001938854585270650) says.
5. On a DMM, practice current and voltage as separate measurements, as a [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/) says.
6. On a scope, practice AC coupling, DC coupling, and triggering, as that [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/) says.
7. Identify a diode on a schematic, as that [KiCad learning thread](https://www.reddit.com/r/ElectricalEngineering/comments/1rw9i3j/kicad_online_learning/) says.
8. If you own no board yet, start in Wokwi, as a [student budget post](https://x.com/princess_yfe/status/2052407178993029236) says.
9. Ask the lab technician for a scope that sits unused outside class, as that [student budget post](https://x.com/princess_yfe/status/2052407178993029236) says.
10. Write the goal, the failure, and the fix, as that [student budget post](https://x.com/princess_yfe/status/2052407178993029236) says.
11. Start board layout in KiCad, as a [KiCad teaching post](https://x.com/BackwoodsEnginr/status/2061281029155918079) says.
12. If a posting lists a GPA minimum and Alex's [X.XX] is under it, talk to a person, as a [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) says.
13. If the term is too full, drop an extra and do the homework with classmates, as that [GPA advice thread](https://www.reddit.com/r/ElectricalEngineering/comments/1oyd4a7/how_much_does_gpa_matter_when_applying_for/) says.
