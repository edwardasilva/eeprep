# Bullets: did X with Y to get Z

Write results, not duties. X is the action, Y is the tool or method, Z is the measured result. The wiki teaches the same pattern as XYZ, STAR, and CAR. Screeners filter on X and Y. Hiring managers choose from the Zs. Put the number early.

## The pattern on one bullet

Before: "Worked on a buck converter for a CubeSat using LTspice and KiCad"

After: "Designed a [X] W CubeSat buck converter in KiCad and LTspice, measured at [X]% efficiency on an electronic load"

The rewrite names the action, the tools, one spec that shows difficulty, and a check against the real board. Every `[X]` is a number the user measures. Never fill one in yourself.

## Rules for each bullet

- Start with a past-tense verb: designed, built, measured, cut, reduced, raised, found, fixed. Not helped, assisted, worked on, utilized, participated, exposed to, or gained experience.
- Fill one line, or most of a second. Two words alone on a second line are wasted space. If a bullet spills a word or two, cut it to one line or add a detail that fills both.
- Say how the parts work together. A parts list, such as a Raspberry Pi and a stepper motor, tells the reader little.
- Mention a hand calculation that checked a simulation. For EE, SPICE output checked against the user's own math.
- Say what happened next. Did the design fix the problem?
- Do not inflate. An intern who claims two million dollars in savings will be asked to justify it. A smaller number the user can defend beats a larger one they cannot.
- One idea per bullet. Keep the result that matters most, and do not join a second one with "and" or "plus". Give the second its own bullet, or cut it.
- Do not force a number. "Designed a PCB in KiCad" says more than trivia such as an exact step-down voltage. A spec belongs in the bullet when it shows difficulty, such as register-level setup of an SPI peripheral.
- Use digits, not words, for numbers. No personal pronouns. No trailing period.
- Avoid the puffed-up verbs: spearheaded, revolutionized, orchestrated, pioneered, `leveraged`, transformed, honed, crafted, elevated.

## Examples written the eeprep way

These are from eeprep's made-up students. Brackets are numbers the student measures.

- Raised peak efficiency from [W]% to [X]% at [Y] A on an electronic load by replacing the catch diode with a synchronous MOSFET and tuning dead time to [Z] ns on an STM32 timer
- Cut output ripple from [X] mV to [Y] mV peak to peak with a [Z]-layer KiCad layout that has a solid ground plane, a smaller switching loop, and an LC filter sized for [W] kHz
- Kept the board alive through [Z] deliberate shorts at [W] V input with STM32 firmware in C that samples input current at [X] kHz and cuts the rail within [Y] µs of a fault
- Tracked [X] Li-ion cells within [Y] mV each on an ESP32 that streams to a Python dashboard
- Processed [X] kHz stereo audio at [Y] ms latency by pipelining [Z] [W]-tap FIR filters in Verilog
- Found [X] battery protection faults before launch review with a Python script that runs [Y] overnight charge cycles and flags any cell that drifts over [Z] mV from the pack average

## Software bullets

Write a software line the way you write a hardware line: the action, the tool, and a measured result. Firmware on a microcontroller, Python that runs a lab instrument, or a testbench for an FPGA design all count as EE software. Name the protocol, the clock rate, the latency, or the test count.

## Vary the shape

A section where every bullet is the same length and follows the identical template reads as machine-made. Some bullets are terse. Some carry a technical clause. Lengths differ inside the one-to-two-line limit. Read the section aloud before you hand it back. See `humanize.md`.

## When the user gives you a task, not a result

Ask: "What did you measure, and what number came out?" If they have no number yet, write `[X]` and say: measure it before you send this. Do not guess it, and do not write a plausible-sounding value.
