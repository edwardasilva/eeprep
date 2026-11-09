#!/usr/bin/env bash
# Rebuild the two home cover SVGs from src/figures/home-cover/home-cover.tex.
# Needs xelatex (TeX Live 2025 or later, with pgf, xcolor, colortbl and fontspec) and dvisvgm 3.x.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
fonts="$root/.cache/fonts"
if [ ! -d "$fonts/source-serif-4.005_Desktop" ]; then
	mkdir -p "$fonts"
	curl -fsSL -o "$fonts/ss4.zip" https://github.com/adobe-fonts/source-serif/releases/download/4.005R/source-serif-4.005_Desktop.zip
	unzip -q "$fonts/ss4.zip" -d "$fonts"
fi
cd "$root/src/figures/home-cover"
xelatex -interaction=nonstopmode -halt-on-error -no-pdf home-cover.tex >/dev/null
if grep -q "Missing character" home-cover.log; then
	echo "home-cover.tex: a glyph is missing from the font" >&2
	exit 1
fi
dvisvgm --no-fonts --bbox=papersize --precision=3 --optimize=all -p1- -o 'home-cover-%p.raw.svg' home-cover.xdv
node "$root/.github/scripts/theme-svg.mjs" home-cover-1.raw.svg home-cover-full.svg hcf-
node "$root/.github/scripts/theme-svg.mjs" home-cover-2.raw.svg home-cover-mobile.svg hcm-
rm -f home-cover.aux home-cover.log home-cover.xdv home-cover-1.raw.svg home-cover-2.raw.svg
