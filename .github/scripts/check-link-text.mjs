// Fails when a link in page content or the header shows raw link syntax
// instead of words: a "#", a URL, a path, or a bare hyphenated slug.
// Run `npm run build` first.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
if (!fs.existsSync(dist)) {
	console.error('dist/ is missing. Run npm run build first.');
	process.exit(1);
}

// Project names that are hyphenated on purpose.
const names = new Set(['resume-generator']);

const problems = [];
let checked = 0;
for (const file of listHtml(dist)) {
	const html = fs.readFileSync(file, 'utf8');
	if (/http-equiv="refresh"/i.test(html)) continue; // redirect stub
	const rel = path.relative(dist, file);
	for (const region of regions(html)) {
		for (const match of region.matchAll(/<a\b[^>]*>([\s\S]*?)<\/a>/g)) {
			const text = decode(match[1].replace(/<[^>]+>/g, ''))
				.replace(/\s+/g, ' ')
				.trim();
			if (!text) continue;
			checked++;
			const reason = rawReason(text);
			if (reason) problems.push(`${rel}: link text "${text}" ${reason}`);
		}
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
console.log(`Link text is plain words in ${checked} links.`);

/** @param {string} text */
function rawReason(text) {
	if (text.includes('#')) return 'contains "#"';
	if (/https?:|www\./i.test(text)) return 'is a URL';
	if (!/\s/.test(text) && text.includes('/')) return 'is a path';
	if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(text) && !names.has(text))
		return 'is a slug';
	return '';
}

/** Page content and the site header. @param {string} html */
function regions(html) {
	const out = [];
	const header = /<header\b[\s\S]*?<\/header>/.exec(html);
	if (header) out.push(header[0]);
	const main = /<main\b[\s\S]*?<\/main>/.exec(html);
	if (main) out.push(main[0]);
	return out;
}

/** @param {string} text */
function decode(text) {
	return text
		.replace(/&#x([0-9a-f]+);/gi, (_, h) =>
			String.fromCodePoint(parseInt(h, 16)),
		)
		.replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
		.replace(/&quot;/g, '"')
		.replace(/&apos;|&#39;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&');
}

/** @param {string} dir @returns {string[]} */
function listHtml(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((ent) => {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) return listHtml(full);
		return ent.name.endsWith('.html') ? [full] : [];
	});
}
