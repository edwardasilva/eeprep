// Fails when deploy.yml pins a different Wrangler than package.json.
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const want = pkg.devDependencies?.wrangler;
const deploy = readFileSync('.github/workflows/deploy.yml', 'utf8');
const match = deploy.match(/^\s*wranglerVersion:\s*["']?([^\s"'#]+)/m);

if (!want) {
	console.error('package.json has no wrangler in devDependencies.');
	process.exit(1);
}
if (!match) {
	console.error(
		'::error file=.github/workflows/deploy.yml::wranglerVersion is not set.',
	);
	process.exit(1);
}
if (match[1] !== want) {
	console.error(
		`::error file=.github/workflows/deploy.yml::wranglerVersion is ${match[1]}, but package.json has ${want}.`,
	);
	process.exit(1);
}
console.log(`Wrangler pin matches: ${want}`);
