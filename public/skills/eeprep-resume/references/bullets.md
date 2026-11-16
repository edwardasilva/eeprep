# Bullets: action, method, and result

Write results, not duties. Build every bullet with one of the three formulas the wiki asks for: XYZ, CAR, or STAR. All three include a result, measured where the user has a number, and the number goes toward the front.

## XYZ, CAR, and STAR

- XYZ: "accomplished X, as measured by Y, by doing Z". Inc. traces it to Google's resume advice. X is the result, Y is the number that measures it, and Z is what the user did, with the tool or method. It fits most project bullets.
- CAR: challenge, action, result. The challenge is a problem, something that needed doing and had not been done. It fits a fault the user tracked down, a failed or stalled project, or a spec they missed and recovered from. TopResume asks for a result you can count, not one that "went well".
- STAR: situation, task, action, result. It is the formula for behavioral interview answers, and it works on a resume when the situation and task shrink to a few words. One STAR story can become one bullet or several. Keep the full story for the interview.

Number first (author's rule). If the user measured the result, move the number toward the start of the bullet, whichever formula you use. TopResume says to front-load the important information and not hide the payoff at the end. Eleven Recruiting orders an XYZ bullet as an action verb, the achievement, the measurement, and then what the user did. The letters name the parts a bullet needs, not their order. The number-first rule is for a measured result, not for a spec the user could copy from a datasheet.

The short form, did X with Y to get Z, is XYZ written in the order the work happened: X is the action, Y is the tool or method, and Z is the result. Screeners filter on the action and the tool. Hiring managers choose from the results. Use the short form when there is no number worth leading with.

## The pattern on one bullet

Before: "Worked on a buck converter for a CubeSat using LTspice and KiCad"

After, number first (XYZ): "Reached [X]% efficiency on a [X] W CubeSat buck converter, measured on an electronic load, by designing it in KiCad and LTspice"

The rewrite names the result, one spec that shows difficulty, the check against the real board, and the tools. Every `[X]` is a number the user measures. Never fill one in yourself.

The same facts in the short form, as on eeprep's bullet figure, end on the number: "Designed a [X] W CubeSat buck converter in KiCad and LTspice, measured at [X]% efficiency on an electronic load". Prefer the number-first version when the user measured the result.

A CAR bullet, number first: "Cut I2C read errors on a rover sensor board from [X] to [X] an hour by finding a missing pull-up resistor with a logic analyzer"

## Rules for each bullet

- Start with a past-tense verb: designed, built, measured, cut, reduced, raised, found, fixed. Not helped, assisted, worked on, utilized, participated, exposed to, or gained experience.
- Fill one line, or most of a second. Two words alone on a second line are wasted space. If a bullet spills a word or two, cut it to one line or add a detail that fills both.
- Say how the parts work together. A parts list, such as a Raspberry Pi and a stepper motor, tells the reader little.
- Mention a hand calculation that checked a simulation. For EE, SPICE output checked against the user's own math. The wiki says engineers like that check and says to bring it up in the interview.
- Say what happened next. Did the design fix the problem?
- Do not inflate. An intern who claims two million dollars in savings will be asked to justify it. A smaller number the user can defend beats a larger one they cannot.
- One idea per bullet (author's advice). Keep the result that matters most, and do not join a second one with "and" or "plus". Give the second its own bullet, or cut it.
- Symbols as words (author's advice). Write 3-sigma instead of the Greek letter, 48 degrees instead of the degree sign, and at most 1 m/s instead of the less-than-or-equal sign.
- Do not force a number. "Designed a PCB in KiCad" says more than trivia such as an exact step-down voltage. A spec belongs in the bullet when it shows difficulty, such as register-level setup of an SPI peripheral.
- Use digits, not words, for numbers. No personal pronouns. No trailing period.
- Avoid the puffed-up verbs: spearheaded, revolutionized, orchestrated, pioneered, `leveraged`, transformed, honed, crafted, elevated.

## Examples written the eeprep way

These are from eeprep's made-up students. Brackets are numbers the student measures.

- Raised peak efficiency from [W]% to [X]% at [Y] A on an electronic load by replacing the catch diode with a synchronous MOSFET and tuning dead time to [Z] ns on an STM32 timer
- Cut output ripple from [X] mV to [Y] mV peak to peak with a [Z]-layer KiCad layout that has a solid ground plane, a smaller switching loop, and an LC filter sized for [W] kHz
- Kept the board alive through [Z] deliberate shorts at [W] V input with STM32 firmware in C that samples input current at [X] kHz and cuts the rail within [Y] microseconds of a fault
- Tracked [X] Li-ion cells within [Y] mV each on an ESP32 that streams to a Python dashboard
- Processed [X] kHz stereo audio at [Y] ms latency by pipelining [Z] [W]-tap FIR filters in Verilog
- Found [X] battery protection faults before launch review with a Python script that runs [Y] overnight charge cycles and flags any cell that drifts over [Z] mV from the pack average

## Software bullets

Write a software line the way you write a hardware line: the action, the tool, and a measured result where there is one, with the number near the front. A bug hunt fits CAR: the fault, how the user found it, and the number that changed. Firmware on a microcontroller, Python that runs a lab instrument, or a testbench for an FPGA design all count as EE software. Name the protocol, the clock rate, the latency, or the test count.

## Vary the shape

A section where every bullet is the same length and follows the identical template reads as machine-made. Some bullets are terse. Some carry a technical clause. Lengths differ inside the one-to-two-line limit. Read the section aloud before you hand it back. See `humanize.md`.

## When the user gives you a task, not a result

Ask: "What did you measure, and what number came out?" If they have no number yet, write `[X]` and say: measure it before you send this. Do not guess it, and do not write a plausible-sounding value.
