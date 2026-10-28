import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { listFigureSources } from './lib/figure-sources.mjs';

const styleDir = path.resolve('src/diagrams/style');
const renderer = path.join(styleDir, 'render-wavedrom.js');
const sources = listFigureSources(path.resolve('src/diagrams'), styleDir);

if (sources.length === 0) {
	console.log('No WaveDrom sources under src/diagrams.');
	process.exit(0);
}

for (const source of sources) {
	const svg = source.replace(/\.json5$/, '.svg');
	const result = spawnSync(process.execPath, [renderer, source, svg], {
		stdio: 'inherit',
	});
	if (result.status !== 0) process.exit(result.status ?? 1);
}
