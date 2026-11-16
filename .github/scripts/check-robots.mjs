// Checks the robots meta tag in the build. A dev build (SITE_ENV=dev) must
// have <meta name="robots" content="noindex"> on every page. Any other build
// must have it on none, except 404.html, which has it in every build.
// Canonical links must point at https://eeprep.com in both, and the 404 page
// has none. robots.txt must allow every crawler in every group, have a group
// for *, keep its group of named AI crawlers, and list the sitemap.
// robots.txt is the one list of crawler names; this check does not repeat it.
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
	const expected = dev || rel === '404.html';
	if (expected !== noindex.test(html)) {
		problems.push(
			`${rel}: ${expected ? 'missing' : 'has'} the noindex meta tag`,
		);
	}
	const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html);
	if (canonical && rel === '404.html') {
		problems.push(
			`${rel}: has a canonical link, but it is served for every missing URL`,
		);
	} else if (canonical && !canonical[1].startsWith('https://eeprep.com/')) {
		problems.push(`${rel}: canonical is ${canonical[1]}`);
	}
}

problems.push(...robotsTxtProblems(path.join(dist, 'robots.txt')));

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
if (pages === 0) {
	console.error('dist/ has no pages. Run npm run build first.');
	process.exit(1);
}
console.log(
	`${pages} pages pass the noindex check (${dev ? 'dev' : 'production'} build), and robots.txt allows every crawler.`,
);

/** @param {string} dir @returns {string[]} */
function listHtml(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((ent) => {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) return listHtml(full);
		return ent.name.endsWith('.html') ? [full] : [];
	});
}

/**
 * Parses robots.txt into groups (RFC 9309: user-agent lines, then rules) and
 * checks that every crawler is allowed everywhere.
 * @param {string} file
 * @returns {string[]}
 */
function robotsTxtProblems(file) {
	if (!fs.existsSync(file)) return ['robots.txt is missing from dist/'];
	const found = [];
	/** @type {{ agents: string[], rules: string[] }[]} */
	const groups = [];
	let sitemap = false;
	let group = null;
	for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
		const line = raw.replace(/#.*/, '').trim();
		if (!line) continue;
		const [key, ...rest] = line.split(':');
		const field = key.trim().toLowerCase();
		const value = rest.join(':').trim();
		if (field === 'user-agent') {
			if (!group || group.rules.length) {
				group = { agents: [], rules: [] };
				groups.push(group);
			}
			group.agents.push(value.toLowerCase());
		} else if (field === 'allow' || field === 'disallow') {
			if (!group)
				found.push(`robots.txt: "${line}" comes before any user-agent`);
			else group.rules.push(`${field}:${value}`);
		} else if (field === 'sitemap') {
			sitemap = value === 'https://eeprep.com/sitemap-index.xml';
		}
	}
	for (const g of groups) {
		if (
			g.rules.some(
				(rule) => rule.startsWith('disallow:') && rule !== 'disallow:',
			)
		) {
			found.push(
				`robots.txt: the group for ${g.agents.join(', ')} disallows a path`,
			);
		}
	}
	for (const g of groups) {
		if (!g.rules.includes('allow:/')) {
			found.push(
				`robots.txt: the group for ${g.agents.join(', ')} does not say "Allow: /"`,
			);
		}
	}
	if (!groups.some((g) => g.agents.includes('*'))) {
		found.push('robots.txt: no group for User-agent: *');
	}
	// The named crawlers share one group, so the choice to allow them stays
	// explicit even if the list is edited.
	if (!groups.some((g) => g.agents.filter((a) => a !== '*').length > 1)) {
		found.push('robots.txt: no group names more than one crawler');
	}
	if (!sitemap) {
		found.push(
			'robots.txt: missing "Sitemap: https://eeprep.com/sitemap-index.xml"',
		);
	}
	return found;
}
