// Fails when a static copy of a theme colour drifts from src/styles/theme.css.
// Every 6-digit hex in theme.css is the palette. The files below hold colours
// that cannot read the CSS tokens (the build config, the code-block themes,
// the brand renderer, and the logo and favicon SVGs), so each colour in them
// must be in the palette or in the allow list. Colours are read in three
// forms: #rrggbb, {HTML}{RRGGBB}, and [0xRR, 0xGG, 0xBB].
import fs from 'node:fs';
import path from 'node:path';

const svgsIn = (dir) =>
	fs
		.readdirSync(dir)
		.filter((name) => name.endsWith('.svg'))
		.map((name) => path.join(dir, name));

const files = [
	'astro.config.mjs',
	'src/styles/ec-eeprep-light.json',
	'src/styles/ec-eeprep-dark.json',
	'.github/scripts/render-brand.mjs',
	...svgsIn('src/brand'),
	...svgsIn('public/brand'),
	'public/favicon.svg',
];

// Colours a file may use that are not in the palette, as file: { colour:
// 'why' }. Lower-case #rrggbb. Empty while every copy matches theme.css.
const allowed = {};

const forms = [
	/#([0-9a-f]{6})(?![0-9a-f])/gi,
	/\{HTML\}\{([0-9a-f]{6})\}/gi,
	/\[\s*0x([0-9a-f]{2}),\s*0x([0-9a-f]{2}),\s*0x([0-9a-f]{2})\s*\]/gi,
];

/** @param {string} text @returns {string[]} lower-case #rrggbb colours */
function coloursIn(text) {
	return forms.flatMap((form) =>
		[...text.matchAll(form)].map(
			(m) => `#${m.slice(1).join('').toLowerCase()}`,
		),
	);
}

const palette = new Set(
	coloursIn(fs.readFileSync('src/styles/theme.css', 'utf8')),
);
const problems = [];
let checked = 0;
for (const file of files) {
	const ok = allowed[file] ?? {};
	for (const colour of new Set(coloursIn(fs.readFileSync(file, 'utf8')))) {
		checked++;
		if (!palette.has(colour) && !(colour in ok)) {
			problems.push(`${file}: ${colour} is not a colour in theme.css`);
		}
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
console.log(
	`${checked} colours in ${files.length} files match the ${palette.size}-colour palette in theme.css.`,
);
