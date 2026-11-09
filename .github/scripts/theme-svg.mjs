// Swap the fixed hex colors in a dvisvgm export for site tokens, so one SVG
// themes in light and dark mode when it is inlined in the page.
// Usage: node theme-svg.mjs in.svg out.svg [id-prefix]
import fs from 'node:fs';
const map = {
	'#16233a': 'var(--eep-dg-ink, #16233a)',
	'#424d63': 'var(--eep-ink-2, #424d63)',
	'#838c9a': 'var(--eep-dg-mute, #838c9a)',
	'#f1f2f3': 'var(--eep-dg-tint, #f1f2f3)',
	'#ffffff': 'var(--eep-dg-fill, #ffffff)',
	'#fff': 'var(--eep-dg-fill, #ffffff)',
	'#000000': 'var(--eep-dg-ink, #16233a)',
	'#000': 'var(--eep-dg-ink, #16233a)',
	// pgfplots sets a gray default fill on tick groups; their paths are fill none.
	'#808080': 'var(--eep-dg-ink, #16233a)',
	// pgfplots sets a light gray default fill on grid groups; their paths are fill none.
	'#c0c0c0': 'var(--eep-dg-mute, #838c9a)',
};
const [, , inFile, outFile] = process.argv;
let svg = fs.readFileSync(inFile, 'utf8');
svg = svg.replace(/<\?xml[^>]*>\s*/, '').replace(/<!--[\s\S]*?-->\s*/g, '');
const unknown = new Set();
svg = svg.replace(
	/<([a-zA-Z]+)(\s[^>]*?)?(\/?)>/g,
	(all, tag, attrs = '', close) => {
		const styles = [];
		attrs = attrs.replace(
			/\s(fill|stroke)=(['"])(#[0-9a-fA-F]{3,6})\2/g,
			(m, prop, q, hex) => {
				const v = map[hex.toLowerCase()];
				if (!v) {
					unknown.add(hex);
					return m;
				}
				styles.push(`${prop}:${v}`);
				return '';
			},
		);
		if (styles.length) {
			if (/\sstyle=(['"])/.test(attrs))
				attrs = attrs.replace(
					/\sstyle=(['"])/,
					(m, q) => ` style=${q}${styles.join(';')};`,
				);
			else attrs += ` style="${styles.join(';')}"`;
		}
		return `<${tag}${attrs}${close}>`;
	},
);
if (unknown.size) {
	console.error(`unmapped colors: ${[...unknown].join(' ')}`);
	process.exit(1);
}
// Untouched glyphs default to black in dvisvgm: give the root the ink fill.
svg = svg
	.replace(
		/<svg([^>]*?)\swidth=(['"])[^'"]*\2\s+height=(['"])[^'"]*\3/,
		'<svg$1',
	)
	.replace(
		/<svg/,
		'<svg class="eep-cover-svg" aria-hidden="true" focusable="false" style="fill:var(--eep-dg-ink, #16233a)"',
	);
// Prefix ids so the inlined glyph defs cannot clash with other SVGs on the page.
const prefix = process.argv[4] || 'hc-';
svg = svg
	.replace(/\sid=(['"])([^'"]+)\1/g, (m, q, id) => ` id=${q}${prefix}${id}${q}`)
	.replace(
		/(xlink:href|href)=(['"])#([^'"]+)\2/g,
		(m, a, q, id) => `${a}=${q}#${prefix}${id}${q}`,
	);
fs.writeFileSync(outFile, svg.trim() + '\n');
console.log(`${outFile}: ${(svg.length / 1024).toFixed(1)} KB`);
