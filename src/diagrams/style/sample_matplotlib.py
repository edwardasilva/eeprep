"""Fig 3.5 reference plot: RC low-pass magnitude response in eeprep house style."""
import numpy as np, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
plt.style.use("eeprep.mplstyle")
ACCENT, MUTE = "#a3201d", "#8a8d94"
R, C = 1e3, 100e-9; fc = 1 / (2*np.pi*R*C)
f = np.logspace(1, 6, 600); H = 20*np.log10(1/np.sqrt(1 + (f/fc)**2))
fig, ax = plt.subplots()
ax.semilogx(f, H, label=r"$|H(j\omega)|$")
ax.semilogx([10, fc, 1e6], [0, 0, -20*np.log10(1e6/fc)], ls=(0, (4, 3)), lw=1, color=MUTE, label="asymptotes")
ax.axvline(fc, color=ACCENT, lw=1, ls=(0, (2, 3)))
ax.plot(fc, -3.01, "o", color=ACCENT, mfc="white", mew=1.5, zorder=5)
ax.annotate("−3 dB at $f_c$ = 1.59 kHz", (fc, -3.01), xytext=(-10, -26), textcoords="offset points", ha="right",
            family="JetBrains Mono", fontsize=8.5, color=ACCENT)
ax.annotate("−20 dB/decade", (6e4, -20), family="JetBrains Mono", fontsize=8.5, color="#4a4d55")
ax.set(xlim=(10, 1e6), ylim=(-62, 6), xlabel="Frequency (Hz)", ylabel="Magnitude (dB)")
ax.set_yticks([0, -20, -40, -60]); ax.set_yticklabels(["0", "−20", "−40", "−60"])
ax.grid(which="minor", lw=0.4, color="#f0eee9")
ax.legend(loc="lower left")
fig.savefig("sample-matplotlib.svg")
plt.style.use("eeprep-dark.mplstyle")
