"""Jane Doe: a placeholder-name student used as the example on the eeprep.com resume page.
Single source of truth. build.py renders the figure from this file and also writes
/home/box/edward/eeprep/sources/jane-doe-persona.md from it, so they always match."""

NAME = "Jane Doe"
CONTACT = ["(555) 555-0142", "jdoe@example.com", "linkedin.com/in/jane-doe-example",
           "[City, ST]", "[Work authorization]", "Willing to relocate"]

PROJECTS = [
    dict(title="Synchronous Buck Converter for a CubeSat Power Board", dates="Fall 25 - Spring 26",
         skills="KiCad, LTspice, STM32, Embedded C, bench testing with an electronic load",
         bullets=[
            "Reached [X]% peak efficiency at a [Y] A load, measured on an electronic load, by replacing the catch diode with a synchronous MOSFET stage and tuning dead time to [Z] ns with an STM32 timer, up from [W]% before",
            "Cut output ripple from [X] mV to [Y] mV peak to peak by redesigning the [Z]-layer PCB in KiCad with a solid ground plane and a tighter switching loop, then resizing the LC output filter for [W] kHz switching",
            "Wrote STM32 firmware in C that samples input current at [X] kHz and shuts the rail down within [Y] \u00b5s of an overcurrent fault, which kept the board alive through [Z] deliberate short-circuit tests at a full [W] V input",
            "Kept the FETs under [X] \u00b0C at full load by adding thermal vias and a [Y] oz copper pour under them",
         ]),
    dict(title="FPGA [N]-Band Audio Equalizer", dates="Spring 25",
         skills="Verilog, Vivado, MATLAB, Basys 3 FPGA, fixed-point DSP",
         bullets=[
            "Processed [X] kHz stereo audio at [Y] ms latency by pipelining [Z] [W]-tap FIR filters in Verilog",
            "Matched the MATLAB response within [X] dB from [Y] Hz to [Z] kHz by testing coefficients in Vivado",
            "Cut LUT use [X]% by sharing one multiplier per filter across all [Y] taps with time-division scheduling",
         ]),
    dict(title="Bluetooth Battery Monitor", dates="Fall 24",
         skills="ESP32, Arduino C++, Python, INA219 current sensor",
         bullets=[
            "Tracked [X] Li-ion cells within [Y] mV each with an ESP32 monitor that streams to a Python dashboard",
            "Extended pack runtime [X]% in field tests by adding a cutoff that drops non-critical loads at [Y] V",
         ]),
]

EXPERIENCE = [
    dict(role="Power Subsystem Engineer", org="[Student satellite team]", dates="Fall 24 - Spring 26",
         bullets=[
            "Cut power board mass by [X] g by replacing [Y] linear regulators with one buck converter board, which then passed thermal vacuum testing from [Z] \u00b0C to [W] \u00b0C on the first attempt with no board rework needed",
            "Found [X] battery protection faults before launch review by writing a Python test script that runs [Y] charge and discharge cycles overnight and flags any cell that drifts more than [Z] mV from the pack average",
         ]),
    dict(role="Undergraduate Research Assistant", org="[University lab]", dates="Summer 25",
         bullets=[
            "Reduced GaN switching loss measurement error from [X]% to [Y]% by adding probe deskew calibration to the double-pulse test setup, which the lab now uses as the standard setup for every GaN device it tests",
            "Cut test time per device from [X] to [Y] minutes by automating oscilloscope capture with Python and PyVISA",
         ]),
]

EDUCATION = dict(degree="B.S. Electrical Engineering", gpa="[X.XX]/4.00", school="[University]",
                 grad="Expected Spring 27",
                 coursework="Signals and Systems, Electronics I and II, Power Electronics, Digital Design, Embedded Systems, Control Systems, Electromagnetics, Probability for Engineers, Microcontroller Lab",
                 activities="Tau Beta Pi, IEEE student branch")

CERTIFICATIONS = "CSWA (Certified SolidWorks Associate), IPC J-STD-001 soldering"
SOFTWARE = "KiCad, LTspice, MATLAB, Vivado, Python, C, Verilog, SolidWorks, Git"

# Things that appear only on the "Before" version (the mistakes)
BEFORE_OBJECTIVE = ("Motivated and hardworking electrical engineering student seeking an internship "
                    "where I can apply my skills and grow as an engineer.")
BEFORE_RETAIL = dict(role="Sales Associate", org="Retail store", dates="06/2023 - 08/2024",
                     bullets=["Helped customers", "Ran the register and stocked shelves."])
BEFORE_SOFT = ["Communication", "Problem solving", "Teamwork", "Leadership",
               "Microsoft Office", "Knowledge of orbital mechanics"]
BEFORE_INTERESTS = "Reading, music, sports"
