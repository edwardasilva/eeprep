import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const renderer = path.resolve('diagrams/_style/render-wavedrom.js');
const sources = listSources(path.resolve('src/diagrams'));

if (sources.length === 0) {
	console.error('No WaveDrom sources under src/diagrams.');
	process.exit(1);
}

for (const source of sources) {
	const svg = source.replace(/\.json5$/, '.svg');
	const result = spawnSync(process.execPath, [renderer, source, svg], { stdio: 'inherit' });
	if (result.status !== 0) process.exit(result.status ?? 1);
}

/** @param {string} dir @param {string[]} out */
function listSources(dir, out = []) {
	if (!fs.existsSync(dir)) return out;
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) listSources(full, out);
		else if (ent.name.endsWith('.json5')) out.push(full);
	}
	return out;
}
