import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const styleDir = path.resolve('src/diagrams/style');
const renderer = path.join(styleDir, 'render-wavedrom.js');
const sources = listSources(path.resolve('src/diagrams'));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'eeprep-figures-'));
let failed = false;

if (sources.length === 0) {
	console.error('No WaveDrom sources under src/diagrams.');
	process.exit(1);
}

for (const source of sources) {
	const svg = source.replace(/\.json5$/, '.svg');
	const fresh = path.join(tmp, path.basename(svg));
	const result = spawnSync(process.execPath, [renderer, source, fresh], { stdio: 'inherit' });
	if (result.status !== 0) process.exit(result.status ?? 1);
	if (!fs.existsSync(svg)) {
		console.error(`Missing figure SVG for ${path.relative(process.cwd(), source)}. Run npm run render:figures.`);
		failed = true;
		continue;
	}
	const expected = fs.readFileSync(fresh);
	const actual = fs.readFileSync(svg);
	if (!expected.equals(actual)) {
		console.error(`Figure SVG is stale: ${path.relative(process.cwd(), svg)}. Run npm run render:figures.`);
		failed = true;
	}
}

fs.rmSync(tmp, { recursive: true, force: true });
if (failed) process.exit(1);
console.log(`Figure SVGs match ${sources.length} source${sources.length === 1 ? '' : 's'}.`);

/** @param {string} dir @param {string[]} out */
function listSources(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		// Style samples sit next to the renderer and are not page figures.
		if (path.resolve(full) === styleDir) continue;
		if (ent.isDirectory()) listSources(full, out);
		else if (ent.name.endsWith('.json5')) out.push(full);
	}
	return out;
}
