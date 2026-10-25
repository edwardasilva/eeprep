#!/usr/bin/env bash
# Builds alex-rivera-resume.pdf and checks: one page, metadata set, sections extract in order.
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/public/resume"
tex=alex-rivera-resume.tex
pdf=alex-rivera-resume.pdf
pdflatex -interaction=nonstopmode -halt-on-error "$tex" >build.log
pdflatex -interaction=nonstopmode -halt-on-error "$tex" >build.log
pages=$(pdfinfo "$pdf" | awk '/^Pages:/{print $2}')
[ "$pages" = 1 ] && echo "PASS one page" || { echo "FAIL $pages pages"; exit 1; }
for f in Title Author Subject Keywords; do
  pdfinfo "$pdf" | grep -q "^$f: *[^ ]" && echo "PASS metadata $f" || { echo "FAIL metadata $f"; exit 1; }
done
txt=$(pdftotext "$pdf" -)
order=$(grep -nxE 'Alex Rivera|Projects|Experience|Education|Skills' <<<"$txt" | cut -d: -f2 | tr '\n' ' ')
[ "$order" = "Alex Rivera Projects Experience Education Skills " ] && echo "PASS reading order: $order" || { echo "FAIL order: $order"; exit 1; }
hdr=$(sed -n 2p <<<"$txt")
if grep -q 'linkedin.com/in/' <<<"$hdr" && grep -q 'US citizen | Willing to relocate$' <<<"$hdr"; then echo "PASS header is one line: $hdr"
else echo "FAIL header line: $hdr"; exit 1; fi
if grep -q 'Relevant coursework:' <<<"$txt" && grep -q 'Activities:' <<<"$txt"; then echo "PASS education labels extract"; else echo "FAIL education labels"; exit 1; fi
grep -q '50 µs' <<<"$txt" && grep -q '20 °C' <<<"$txt" && echo "PASS µ and ° extract as Unicode" || { echo "FAIL µ/° extraction"; exit 1; }
if grep -qP '[\x{FB00}-\x{FB06}]|\x{FFFD}' <<<"$txt"; then echo "FAIL ligature or replacement glyphs in text"; exit 1; else echo "PASS no ligature or replacement glyphs"; fi
grep -cE 'Overfull|Underfull' build.log | sed 's/^/INFO overfull or underfull boxes: /'
