#!/usr/bin/env bash
# Builds jane-doe-resume.pdf and checks: one page, metadata set, sections extract in order.
set -eu
root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root/public/resume"
tex=jane-doe-resume.tex
pdf=jane-doe-resume.pdf
# Build in a temp folder so no .aux, .log, .out or build.log lands in public/, which Astro publishes.
build="$(mktemp -d)"
trap 'rm -rf "$build"' EXIT
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$build" "$tex" >"$build/build.log"
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$build" "$tex" >"$build/build.log"
cp "$build/$pdf" "$pdf"
pages=$(pdfinfo "$pdf" | awk '/^Pages:/{print $2}')
[ "$pages" = 1 ] && echo "PASS one page" || { echo "FAIL $pages pages"; exit 1; }
for f in Title Author Subject Keywords; do
  pdfinfo "$pdf" | grep -q "^$f: *[^ ]" && echo "PASS metadata $f" || { echo "FAIL metadata $f"; exit 1; }
done
txt=$(pdftotext "$pdf" -)
order=$(grep -nxE 'Jane Doe|Projects|Experience|Education|Skills' <<<"$txt" | cut -d: -f2 | tr '\n' ' ')
[ "$order" = "Jane Doe Projects Experience Education Skills " ] && echo "PASS reading order: $order" || { echo "FAIL order: $order"; exit 1; }
hdr=$(sed -n 2p <<<"$txt")
if grep -q 'linkedin.com/in/' <<<"$hdr" && grep -q '\[City, ST\] | \[Work authorization\] | Willing to relocate$' <<<"$hdr"; then echo "PASS header is one line: $hdr"
else echo "FAIL header line: $hdr"; exit 1; fi
if grep -q 'Relevant coursework:' <<<"$txt" && grep -q 'Activities:' <<<"$txt"; then echo "PASS education labels extract"; else echo "FAIL education labels"; exit 1; fi
grep -q '\[Y\] µs' <<<"$txt" && grep -q '\[X\] °C' <<<"$txt" && echo "PASS µ and ° extract as Unicode next to placeholders" || { echo "FAIL µ/° extraction"; exit 1; }
# Join wrapped lines, then require every canonical row as a substring.
flat=$(printf '%s' "$txt" | tr '\n' ' ' | sed -E 's/[[:space:]]+/ /g')
strings="$root/scripts/resume-strings.txt"
missing=0
while IFS= read -r line || [ -n "$line" ]; do
  [ -z "$line" ] && continue
  want=$(printf '%s' "$line" | sed -E 's/[[:space:]]+/ /g')
  if ! grep -F -q -- "$want" <<<"$flat"; then
    echo "FAIL missing string: $want"
    missing=1
  fi
done < "$strings"
[ "$missing" = 0 ] && echo "PASS canonical strings" || exit 1
# Bullet text may keep term dates, the example phone, the GPA scale 4.00,
# and fixed names (STM32, ESP32, INA219, J-STD-001, Basys 3, I and II).
scrubbed=$(printf '%s' "$flat" | sed -E \
  -e 's/\(555\) 555-0142//g' \
  -e 's/Fall 25 - Spring 26//g' \
  -e 's/Fall 24 - Spring 26//g' \
  -e 's/Expected Spring 27//g' \
  -e 's/Spring 25//g' \
  -e 's/Spring 26//g' \
  -e 's/Fall 24//g' \
  -e 's/Fall 25//g' \
  -e 's/Summer 25//g' \
  -e 's/4\.00//g' \
  -e 's/J-STD-001//g' \
  -e 's/STM32//g' \
  -e 's/ESP32//g' \
  -e 's/INA219//g' \
  -e 's/Basys 3//g')
if grep -q '[0-9]' <<<"$scrubbed"; then
  echo "FAIL unexpected digits in resume text"
  grep -oE '.{0,40}[0-9].{0,40}' <<<"$scrubbed" || true
  exit 1
else
  echo "PASS no digits except dates, phone, GPA scale, and fixed names"
fi
if grep -qP '[\x{FB00}-\x{FB06}]|\x{FFFD}' <<<"$txt"; then echo "FAIL ligature or replacement glyphs in text"; exit 1; else echo "PASS no ligature or replacement glyphs"; fi
boxes=$(grep -cE 'Overfull|Underfull' "$build/build.log" || true)
[ "$boxes" = 0 ] && echo "PASS no overfull or underfull boxes" || { echo "FAIL $boxes overfull or underfull boxes"; exit 1; }
