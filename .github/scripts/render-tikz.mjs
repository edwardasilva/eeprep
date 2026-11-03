// Rebuild resume TikZ figures to SVG. The site build does not run TeX.
// Needs LuaLaTeX, dvisvgm (with mutool), and Newsreader, Inter, and JetBrains Mono.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const root = path.resolve('src/diagrams/resume');
const figures = ['bullet'];

for (const tool of ['lualatex', 'dvisvgm']) {
	if (spawnSync(tool, ['--version'], { encoding: 'utf8' }).status !== 0) {
		console.error(
			`Missing ${tool}. Install LuaLaTeX and dvisvgm, then run this again.`,
		);
		process.exit(1);
	}
}

for (const name of figures) {
	render(name, false);
	render(name, true);
}

console.log(`Rebuilt ${figures.length * 2} resume SVGs.`);

/**
 * @param {string} name
 * @param {boolean} dark
 */
function render(name, dark) {
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eeprep-tikz-'));
	const job = dark ? `${name}-dark` : name;
	const prefix = dark ? '\\def\\eepdark{1}' : '';
	const result = spawnSync(
		'lualatex',
		[
			'-interaction=nonstopmode',
			'-halt-on-error',
			`-output-directory=${tmp}`,
			`-jobname=${job}`,
			`${prefix}\\input{${name}.tex}`,
		],
		{
			cwd: root,
			env: { ...process.env, SOURCE_DATE_EPOCH: '0' },
			encoding: 'utf8',
		},
	);
	if (result.status !== 0) {
		process.stdout.write(result.stdout ?? '');
		process.stderr.write(result.stderr ?? '');
		console.error(`LuaLaTeX failed for ${job}.`);
		process.exit(result.status ?? 1);
	}
	const pdf = path.join(tmp, `${job}.pdf`);
	const raw = path.join(tmp, `${job}.svg`);
	const svg = spawnSync(
		'dvisvgm',
		['--pdf', '--no-fonts', '--exact', '-o', raw, pdf],
		{ encoding: 'utf8' },
	);
	if (svg.status !== 0) {
		process.stdout.write(svg.stdout ?? '');
		process.stderr.write(svg.stderr ?? '');
		console.error(`dvisvgm failed for ${job}.`);
		process.exit(svg.status ?? 1);
	}
	const cleaned = stabilize(fs.readFileSync(raw, 'utf8'));
	if (/\/(?:home|usr|opt|tmp|Users)\//.test(cleaned)) {
		console.error(`${job}.svg contains a filesystem path.`);
		process.exit(1);
	}
	fs.writeFileSync(path.join(root, `${job}.svg`), cleaned);
	fs.rmSync(tmp, { recursive: true, force: true });
	console.log(`wrote src/diagrams/resume/${job}.svg`);
}

/** @param {string} svg */
function stabilize(svg) {
	let text = svg.replace(/<!--[\s\S]*?-->/g, '');
	text = text.replace(/<\?xml[^>]*\?>/, '');
	text = text.replace(/<defs>([\s\S]*?)<\/defs>/, (_, inner) => {
		const elems = [...inner.matchAll(/<(?:path|use)\b[^>]*\/>/g)].map(
			(match) => match[0],
		);
		elems.sort((a, b) => {
			const idA = /id='([^']+)'/.exec(a)?.[1] ?? a;
			const idB = /id='([^']+)'/.exec(b)?.[1] ?? b;
			if (idA < idB) return -1;
			if (idA > idB) return 1;
			return 0;
		});
		const rest = inner
			.replace(/<(?:path|use)\b[^>]*\/>/g, '')
			.replace(/^\s*\n/gm, '')
			.trim();
		if (rest) {
			throw new Error(
				`Unexpected defs content left after sorting: ${rest.slice(0, 120)}`,
			);
		}
		return `<defs>\n${elems.join('\n')}\n</defs>`;
	});
	text = text
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{2,}/g, '\n')
		.trim();
	return `${text}\n`;
}
