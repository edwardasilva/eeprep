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
if grep -q 'linkedin.com/in/' <<<"$hdr" && grep -q 'US citizen | Willing to relocate$' <<<"$hdr"; then echo "PASS header is one line: $hdr"
else echo "FAIL header line: $hdr"; exit 1; fi
if grep -q 'Relevant coursework:' <<<"$txt" && grep -q 'Activities:' <<<"$txt"; then echo "PASS education labels extract"; else echo "FAIL education labels"; exit 1; fi
grep -q '\[X\] µs' <<<"$txt" && grep -q '\[X\] °C' <<<"$txt" && echo "PASS µ and ° extract as Unicode next to placeholders" || { echo "FAIL µ/° extraction"; exit 1; }
# Projects and Experience may keep term dates only.
work=$(awk 'BEGIN{s=0} $0=="Projects"{s=1; next} $0=="Education"{s=0} s' <<<"$txt")
scrubbed=$(printf '%s\n' "$work" | sed -E \
  -e 's/Fall 25 - Spring 26//g' \
  -e 's/Fall 24 - Spring 26//g' \
  -e 's/Spring 25//g' \
  -e 's/Spring 26//g' \
  -e 's/Fall 24//g' \
  -e 's/Fall 25//g' \
  -e 's/Summer 25//g')
if grep -q '[0-9]' <<<"$scrubbed"; then
  echo "FAIL unexpected digits in Projects or Experience"
  grep -nE '[0-9]' <<<"$scrubbed" || true
  exit 1
else
  echo "PASS no digits in Projects or Experience except term dates"
fi
if grep -qP '[\x{FB00}-\x{FB06}]|\x{FFFD}' <<<"$txt"; then echo "FAIL ligature or replacement glyphs in text"; exit 1; else echo "PASS no ligature or replacement glyphs"; fi
boxes=$(grep -cE 'Overfull|Underfull' "$build/build.log" || true)
[ "$boxes" = 0 ] && echo "PASS no overfull or underfull boxes" || { echo "FAIL $boxes overfull or underfull boxes"; exit 1; }
