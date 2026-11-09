// Fails when a figure component breaks the figure rules in .github/STYLE.md
// section 7: no crimson in a figure (the accent tokens stay on site chrome),
// no gradients, no glows or colored shadows, and no emphasis italics. Every
// figure also needs text a screen reader can use: real text in the markup,
// or a .sr-only description next to an aria-hidden drawing.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/components');
// Folders whose components are figures. The site chrome lives beside them.
const figureDirs = [
	'about',
	'advice',
	'hired',
	'interview',
	'links',
	'projects',
	'resume',
	'simple',
];
const problems = [];
let checked = 0;

for (const dir of figureDirs) {
	const full = path.join(root, dir);
	if (!fs.existsSync(full)) continue;
	for (const name of fs.readdirSync(full)) {
		if (!name.endsWith('.astro')) continue;
		const file = path.join(full, name);
		const rel = path.relative(process.cwd(), file);
		const text = fs.readFileSync(file, 'utf8');
		checked++;
		for (const [pattern, why] of [
			[
				/var\(--eep-(?:dg-)?accent(?:-hover|-soft)?\)/,
				'uses the crimson accent',
			],
			[/#(?:a3201d|7d1714|e06a5f|f08b81)\b/i, 'uses a crimson hex value'],
			[/gradient\(/, 'uses a gradient'],
			[/box-shadow:\s*(?!inset\b)(?!none)/, 'uses a drop shadow or glow'],
			[/font-style:\s*italic/, 'uses italics for emphasis'],
		]) {
			if (pattern.test(text)) problems.push(`${rel}: ${why}`);
		}
		// A drawing hidden as a whole needs a spoken description beside it. A pin
		// or an icon hidden on its own sits inside real text and needs nothing.
		const hidesDrawing =
			/<(?:div|ol|ul)\b[^>]*\bnot-content\b[^>]*\baria-hidden="true"/.test(
				text,
			);
		if (hidesDrawing && !/sr-only/.test(text)) {
			problems.push(
				`${rel}: hides its drawing from screen readers with no .sr-only text`,
			);
		}
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
console.log(`${checked} figure components follow the figure rules.`);
