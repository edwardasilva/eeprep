// Checks the robots meta tag in the build. A dev build (SITE_ENV=dev) must
// have <meta name="robots" content="noindex"> on every page. Any other build
// must have it on none. Canonical links must point at https://eeprep.com in both.
// Run `npm run build` first.
import fs from 'node:fs';
import path from 'node:path';

const dev = process.env.SITE_ENV === 'dev';
const dist = path.resolve('dist');
const noindex = /<meta name="robots" content="noindex"\s*\/?>/;
if (!fs.existsSync(dist)) {
	console.error('dist/ is missing. Run npm run build first.');
	process.exit(1);
}
const problems = [];
let pages = 0;

for (const file of listHtml(dist)) {
	const html = fs.readFileSync(file, 'utf8');
	if (/http-equiv="refresh"/i.test(html)) continue; // redirect stub
	pages++;
	const rel = path.relative(dist, file);
	if (dev !== noindex.test(html)) {
		problems.push(`${rel}: ${dev ? 'missing' : 'has'} the noindex meta tag`);
	}
	const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html);
	if (canonical && !canonical[1].startsWith('https://eeprep.com/')) {
		problems.push(`${rel}: canonical is ${canonical[1]}`);
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
if (pages === 0) {
	console.error('dist/ has no pages. Run npm run build first.');
	process.exit(1);
}
console.log(
	`${pages} pages ${dev ? 'have' : 'do not have'} the noindex meta tag (${dev ? 'dev' : 'production'} build).`,
);

/** @param {string} dir @returns {string[]} */
function listHtml(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((ent) => {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) return listHtml(full);
		return ent.name.endsWith('.html') ? [full] : [];
	});
}
