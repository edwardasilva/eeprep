// Rebuild the favicon and README logo PNGs from their SVG sources.
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const jobs = [
	['src/brand/favicon-16.svg', 'public/favicon-16.png', 16],
	['src/brand/favicon-16-dark.svg', 'public/favicon-16-dark.png', 16],
	['src/brand/favicon-32.svg', 'public/favicon-32.png', 32],
	['src/brand/favicon-32-dark.svg', 'public/favicon-32-dark.png', 32],
	[
		'src/brand/apple-touch-icon-180.svg',
		'public/apple-touch-icon-180.png',
		180,
	],
	[
		'public/brand/eeprep-lockup-stacked-outlined.svg',
		'public/brand/eeprep-lockup-stacked.png',
		486,
	],
	[
		'public/brand/eeprep-lockup-stacked-dark-outlined.svg',
		'public/brand/eeprep-lockup-stacked-dark.png',
		486,
	],
];

for (const [source, target, width] of jobs) {
	const svg = fs.readFileSync(source, 'utf8');
	const png = new Resvg(svg, {
		fitTo: { mode: 'width', value: width },
		font: { loadSystemFonts: false },
	})
		.render()
		.asPng();
	fs.writeFileSync(target, png);
	console.log(`wrote ${target}`);
}
