// Fails when a figure component breaks the figure rules in .github/STYLE.md
// section 7: no crimson in a figure (the accent tokens stay on site chrome),
// no gradients, no glows or colored shadows, and no emphasis italics. Every
// figure also needs text a screen reader can use: real text in the markup,
// or a .sr-only description next to an aria-hidden drawing.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src/components');
// Every component in a subfolder is a figure. The site chrome sits beside them
// at the top level, and the sidebar has its own folder.
const figureFiles = fs
	.readdirSync(root, { recursive: true, withFileTypes: true })
	.filter(
		(ent) =>
			ent.isFile() &&
			ent.name.endsWith('.astro') &&
			path.basename(ent.parentPath ?? ent.path) !== 'sidebar' &&
			(ent.parentPath ?? ent.path) !== root,
	)
	.map((ent) => path.join(ent.parentPath ?? ent.path, ent.name))
	.sort();
const problems = [];
let checked = 0;

for (const file of figureFiles) {
	const rel = path.relative(process.cwd(), file);
	const text = fs.readFileSync(file, 'utf8');
	checked++;
	for (const [pattern, why] of [
		[/var\(--eep-(?:dg-)?accent(?:-hover|-soft)?\)/, 'uses the crimson accent'],
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
		/<(?:div|ol|ul)\b[^>]*\bnot-content\b[^>]*\baria-hidden="true"/.test(text);
	if (hidesDrawing && !/sr-only/.test(text)) {
		problems.push(
			`${rel}: hides its drawing from screen readers with no .sr-only text`,
		);
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
console.log(`${checked} figure components follow the figure rules.`);
