---
title: Signals and DSP
description: What to study in signals and DSP, in which order, and how to check the math.
pageType: study
keyTerms:
  - convolution
  - sampling
  - aliasing
  - DFT
  - z-transform
---

> [!tip] Main idea
> Follow the fall 2011 lectures for 6.003, then check one sum in Python.

## Learn this first

MIT 6.003 in fall 2011 is the undergraduate course to follow. Professor Dennis Freeman taught it. Lectures met twice a week, and recitations met twice a week. The textbook is Oppenheim and Willsky, Signals and Systems, 2nd edition, Prentice Hall, 1996. [@mit-ocw-6003-2011-syllabus]

The course covers continuous-time and discrete-time signals. It covers Fourier representations, the Laplace transform, the z-transform, and sampling. It also covers linear time-invariant systems, convolution, and frequency response. [@mit-ocw-6003-2011-syllabus]

Do not open a DFT chapter on day one. In that term the z-transform is lecture 5. Convolution is lecture 8. Fourier representations start at lecture 14. Sampling is lecture 21. [@mit-ocw-6003-2011-handouts]

The reading list puts each topic on a textbook section. Convolution is sections 2.0 through 2.6. The z-transform is sections 10.1 through 10.10. Sampling is sections 7.0 through 7.6. [@mit-ocw-6003-2011-readings]

Use Steven W. Smith's free book for the discrete work you can code. Read chapter 3 for sampling. Read chapter 6 for convolution. Read chapter 8 for the discrete Fourier transform. Read chapter 16 for a filter kernel you can type in. The book is The Scientist and Engineer's Guide to Digital Signal Processing, at dspguide.com. [@smith-dspguide-ch3] [@smith-dspguide-ch6] [@smith-dspguide-ch8] [@smith-dspguide-ch16]

Learn those topics before the graduate course. That course is MIT 6.341, Discrete-Time Signal Processing, fall 2005, taught by Alan V. Oppenheim. It assumes fluency with linear time-invariant systems, discrete-time signals, sampling, Fourier transforms, and the bilateral z-transform. The syllabus names 6.011 as the prerequisite. [@mit-ocw-6341-2005-syllabus]

Lecture 2 is phase and group delay. The discrete Fourier transform is lecture 15. [@mit-ocw-6341-2005-syllabus]

## Convolution

A linear time-invariant system has one complete description. That description is the impulse response, the output when the input is a unit impulse. Freeman's lecture 8 builds the output as weighted, shifted copies of that response. The operation is convolution. [@mit-ocw-6003-2011-lec08]

For a discrete-time input $x[n]$ and impulse response $h[n]$,

$$
y[n] = \sum_{k=-\infty}^{\infty} x[k]\, h[n-k]
\tag{1.1}
$$

For a continuous-time input the sum becomes an integral,

$$
y(t) = \int_{-\infty}^{\infty} x(\tau)\, h(t-\tau)\, d\tau
\tag{1.2}
$$

[@mit-ocw-6003-2011-lec08]

Smith says the same thing in words. The input convolved with the impulse response equals the output. In an equation the star means convolution. In Python the star means multiplication. [@smith-dspguide-ch6]

Lyons states the discrete case the same way. Know the unit impulse response, and the output for any input is the convolution of that input with the impulse response. [@lyons-2011-understanding-dsp]

Here is a sum you can finish by hand. Let $x[0] = 1$, $x[1] = 2$, $x[2] = 3$, and let $h[0] = 1$, $h[1] = -1$. Every other sample is 0.

$y[0] = 1$. $y[1] = -1 + 2 = 1$. $y[2] = -2 + 3 = 1$. $y[3] = -3$.

The four numbers are $1, 1, 1, -3$. SciPy calls this the full convolution. Lengths $N$ and $M$ produce length $N + M - 1$. The direct method is the sum in the definition. [@scipy-signal-convolve]

A causal filter and a causal input use a shorter limit. Julius O. Smith writes

$$
y(n) = \sum_{i=0}^{n} h(i)\, x(n-i)
$$

for $n \ge 0$. He reads $h(i)$ as the weight on the copy of the input from $i$ samples ago. Parentheses in his book are brackets in equation (1.1). Convolution is commutative, so the two orders match. [@jos-filters-convolution]

## Sampling and aliasing

Shannon published the sampling statement in 1949. If a function contains no frequencies higher than $W$ cycles per second, the samples determine it. The samples are spaced $1/(2W)$ seconds apart. He calls that fact common knowledge in the communication art, and he credits earlier mathematicians, including Whittaker. [@shannon-1949-noise]

Smith states the sampling theorem this way. A continuous signal is sampled properly only when it has no frequency above half the sampling rate. At 2000 samples per second, the analog signal must stay below 1000 cycles per second. A higher frequency folds into the range from 0 to 1000 and adds to whatever was already there. [@smith-dspguide-ch3]

His concrete alias is a sine at 0.95 of the sampling rate. The samples look like a sine at 0.05 of the sampling rate. Nothing in the record tells you which sine you had. He names that aliasing. [@smith-dspguide-ch3]

Allen Downey gives a numeric alias. A 5500 Hz cosine, sampled at 10000 frames per second, is indistinguishable from 4500 Hz. Half of 10000 is 5000. He calls 5000 Hz the folding frequency, and also the Nyquist frequency. [@downey-thinkdsp]

Smith says the names Nyquist frequency and Nyquist rate are not standardized. Smith takes a signal whose highest frequency is 3 kHz and a sampling rate of 8 kHz. Twice 3 kHz is 6 kHz. Half of 8 kHz is 4 kHz. Authors pick different ones of those numbers and call it the Nyquist frequency. In his book, both Nyquist frequency and Nyquist rate mean half the sampling rate. [@smith-dspguide-ch3]

Lyons calls periodic sampling the most frequently misunderstood process in digital signal processing. His chapter 2 explains that ambiguity, and he calls it aliasing. [@lyons-2011-understanding-dsp]

Put a low-pass filter in front of the converter, before any sample exists. Smith calls that filter the antialias filter. It removes frequencies above half the sampling rate. A second low-pass after the converter is the reconstruction filter. [@smith-dspguide-ch3]

The [[Sample page#Cutoff frequency|series RC low-pass]] is one capacitor and one resistor. Smith shows why a gentle cutoff spends bandwidth on the slope. Take a 12-bit converter at 10000 samples per second. He wants every frequency above 5 kHz reduced by a factor of 100. An 8-pole Chebyshev then has its cutoff set to 3.7 kHz. The band from 3.7 kHz to 5 kHz is spent on the roll-off. [@smith-dspguide-ch3]

Keep sampling and quantization apart. Sampling drops what happens between the sample times. Quantization rounds each held voltage. Smith bounds that rounding by half of one least significant bit. He models it as noise with standard deviation about 0.29 of that step. An 8-bit converter then adds rms noise of about 1/900 of full scale. [@smith-dspguide-ch3]

## Check the forward sum

NumPy's forward transform, for $n$ samples $a_m$, is

$$
A_k = \sum_{m=0}^{n-1} a_m \exp\left(-2\pi i \frac{m k}{n}\right)
\tag{1.3}
$$

for $k = 0, \ldots, n-1$. The inverse puts $1/n$ on the sum and flips the sign in the exponent,

$$
a_m = \frac{1}{n} \sum_{k=0}^{n-1} A_k \exp\left(2\pi i \frac{m k}{n}\right)
\tag{1.4}
$$

[@numpy-fft]

There is more than one DFT. The sign in the exponent can flip, and the factor $1/n$ can sit on either sum. NumPy's default, called backward, leaves the forward sum alone and scales the inverse by $1/n$. [@numpy-fft]

Julius O. Smith writes that same pair. The forward sum measures how much of each complex sinusoid is in the signal, and at what phase. The inverse rebuilds the signal as the sum of those pieces, each divided by $N$. [@jos-dft]

Bin 0 is the sum of the samples. For a real input it is real. For even $n$, bin $n/2$ is the Nyquist bin, and it is real for a real input. `np.fft.fftfreq(n, d)` returns the frequency of each bin for sample spacing $d$. [@numpy-fft]

Check $N = 4$ and $x = [1, 0, -1, 0]$. Those samples are $\cos(2\pi n / 4)$. Equation (1.3) gives the bins $0, 2, 0, 2$. Bin 1 is the one to expand. Samples $n = 1$ and $n = 3$ are 0, so they add nothing. The $n = 0$ term is $1$. The $n = 2$ term is $(-1)$ times $e^{-j\pi}$, and $e^{-j\pi} = -1$, so that term is $1$. The two terms add to $2$.

Smith's chapter 8 is a different arrangement of the same idea. He teaches the real DFT first. $N$ time points become two arrays, cosine amplitudes and sine amplitudes, each of length $N/2 + 1$. He says the claim that a DFT turns $N$ time points into $N$ frequency points is about the complex DFT. He saves that form for chapter 31. NumPy computes the complex form. [@smith-dspguide-ch8]

If a hand sum and a library call disagree, compare the sign and the $1/n$ before you edit the algebra. [@numpy-fft]

## The z-transform

Julius O. Smith defines the bilateral z-transform of $x(n)$ as

$$
X(z) = \sum_{n=-\infty}^{\infty} x(n)\, z^{-n}
\tag{1.5}
$$

$z$ is complex. When the signal is zero for negative time, the lower limit is 0. That unilateral sum is the form he says is most common. [@jos-filters-z]

The transfer function is $H(z) = Y(z) / X(z)$. It is the z-transform of the impulse response. For causal signals, convolution in time is a product of z-transforms. [@jos-filters-transfer] [@jos-filters-convolution-theorem]

The frequency response is that function on the unit circle. Set $z = e^{j\omega T}$, with $T$ the sample period. The result is the discrete-time Fourier transform of the impulse response. Add an integer number of sampling rates to $\omega$ and the value repeats. That step walks whole turns around the unit circle. [@jos-filters-frequency]

Stability is a statement about the impulse response. Julius O. Smith defines a stable filter as one whose impulse response decays to 0 as time goes to infinity. For an irreducible transfer function, every pole must lie inside the unit circle. He calls an isolated pole on the unit circle marginally stable. The impulse response from that pole neither decays nor grows. A pole outside the circle grows like $R^n$ with $R > 1$. [@jos-filters-stability]

## A filter you can finish

The ideal low-pass passes every frequency below the cutoff with gain 1, and it blocks the rest. The impulse response of that shape is a sinc that never reaches 0. Smith truncates the sinc. He then multiplies by a smooth window, because a hard cut changes the frequency response. Convolution with the finite kernel is the filter. The filter is stable. The step response has ripple and overshoot. [@smith-dspguide-ch16]

A recursive filter feeds earlier outputs back into the sum. SciPy's `lfilter` implements this difference equation,

$$
a[0]\, y[n] = \sum_{k=0}^{M} b[k]\, x[n-k] - \sum_{k=1}^{N} a[k]\, y[n-k]
\tag{1.6}
$$

[@scipy-lfilter]

`scipy.signal.butter(N, Wn)` designs a Butterworth filter. At $W_n$ the gain is $1/\sqrt{2}$ times the passband gain. The page calls that the $-3$ dB point. For a digital filter, if you omit `fs`, $W_n$ runs from 0 to 1, and 1 is the Nyquist frequency. The passband of a Butterworth filter is maximally flat. [@scipy-butter]

Do not use a high-order narrowband design in numerator and denominator form. SciPy says that conversion from roots to polynomial coefficients is numerically sensitive for order 4 and up. The same note says that form can come out unstable or wrong. Ask for `output='sos'`. Then check the curve with `freqz`, which computes $H(e^{j\omega}) = B(e^{j\omega}) / A(e^{j\omega})$. [@scipy-butter] [@scipy-freqz]

The course describes these designs as recursive (IIR) and non-recursive (FIR). IIR design is lecture 8. FIR design is lecture 9. Filter structures are lecture 7. [@mit-ocw-6341-2005] [@mit-ocw-6341-2005-syllabus]

## How to practice

Work the problems on paper before you open a solution. The fall 2011 6.003 site posted homework sets 1 through 14, and it posted a solution for each one. [@mit-ocw-6003-2011-handouts]

When homework is graded, problem sets are 15 percent of the preliminary grade. When it is not graded, they are 0. Oppenheim says working the problems has a major effect on how well you understand the material. The staff writes exams on the assumption that you worked every assigned problem. One problem on each exam is usually based on a homework problem. You may solve a problem with one or two classmates. The write-up has to be yours. [@mit-ocw-6341-2005-syllabus]

He also wants the ideas explored in MATLAB. The course has two MATLAB projects. You need the project write-up to pass, on either homework option. [@mit-ocw-6341-2005-syllabus]

If you already write Python, use Allen Downey's Think DSP for the same ideas. His premise is that programming is a way to learn the subject, and that the usual course starts at phasors. By the end of his chapter 1 you can pull the harmonics out of a sound and build a new one. The book is free. The general study habit sits on [[How to study]]. [@downey-thinkdsp]

Check the two hand results in one file. `method='direct'` forces the sum from the definition.

```python
import numpy as np
from scipy.signal import convolve

x = np.array([1.0, 2.0, 3.0])
h = np.array([1.0, -1.0])
print(convolve(x, h, mode="full", method="direct"))

x4 = np.array([1.0, 0.0, -1.0, 0.0])
print(np.fft.fft(x4))
```

The first print is `1, 1, 1, -3`. The second is the bins `0, 2, 0, 2`. [@scipy-signal-convolve] [@numpy-fft]

## Where a chat tool helps

Frieder and coauthors tested two ChatGPT releases, 9 January 2023 and 30 January 2023, and they tested GPT-4. The problems were written by working mathematicians. The 9 January model scored 3.20 out of 5 on average, with standard deviation 1.23. It was weak on proofs and on complicated symbolic calculations. It was stronger when the task was to state a fact or to fill a gap. The abstract says ChatGPT is most successful when the task is to look up a fact. It says GPT-4 can be used on undergraduate mathematics and still fails at graduate difficulty. [@frieder-2023-chatgpt-math]

That paper does not score a model from 2026. Treat a newer chat window as untested by this result.

Use the tool to draft a SciPy call or to name a chapter. Then recompute the sum, and run the call. Compare the exponent and the $1/n$ with equations (1.3) and (1.4) before you trust a generated transform. [@numpy-fft]

Do not paste a high-order `butter` result into a project and move on. The library's own warning is that the `b, a` form can be unstable. Plot `freqz`, or use second-order sections. [@scipy-butter]

Keep the 6.341 write-up rule for a generated solution. You may talk the problem through. The lines you hand in still have to be yours. [@mit-ocw-6341-2005-syllabus]

## Books and courses

Use these in the order above. Each one is a primary source for a piece of this page.

1. MIT OpenCourseWare 6.003, Signals and Systems, fall 2011, for the lecture order and the 14 homework sets. [@mit-ocw-6003-2011-syllabus] [@mit-ocw-6003-2011-handouts]
2. Oppenheim and Willsky, Signals and Systems, 2nd edition, the textbook that course assigns. [@mit-ocw-6003-2011-readings]
3. Steven W. Smith, The Scientist and Engineer's Guide to Digital Signal Processing, free at dspguide.com. [@smith-dspguide-ch3]
4. Julius O. Smith III, Mathematics of the DFT and Introduction to Digital Filters, free at CCRMA. [@jos-dft] [@jos-filters-z]
5. Allen B. Downey, Think DSP, free, for the Python path and the 5500 Hz alias. [@downey-thinkdsp]
6. Richard G. Lyons, Understanding Digital Signal Processing, 3rd edition, Pearson, 2011, for a long treatment of periodic sampling and aliasing. [@lyons-2011-understanding-dsp]
7. MIT OpenCourseWare 6.341, fall 2005, after the background list in its syllabus, for filter design and the MATLAB projects. [@mit-ocw-6341-2005-syllabus]
8. The NumPy FFT manual and the SciPy `signal` pages for `convolve`, `lfilter`, `butter`, and `freqz`. [@numpy-fft] [@scipy-signal-convolve]
