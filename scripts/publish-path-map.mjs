import fs from 'node:fs';
import path from 'node:path';

const names = ['path-map.svg', 'path-map-dark.svg', 'path-map-mobile.svg'];
const sourceDir = path.resolve('src/diagrams/get-hired/path-map');
const destDir = path.resolve('public/diagrams/get-hired/path-map');

fs.mkdirSync(destDir, { recursive: true });
for (const name of names) {
	const source = path.join(sourceDir, name);
	if (!fs.existsSync(source)) {
		console.error(`Missing path map SVG: ${path.relative(process.cwd(), source)}`);
		process.exit(1);
	}
	fs.copyFileSync(source, path.join(destDir, name));
}
