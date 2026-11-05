// Fails when src/data/link-index.json, the table on the Sources page, and
// the outside links on the built site disagree. Run `npm run build` first.
//
// URLs are compared after normalizing: the scheme and host are lowercased, a
// leading "www." is stripped, the fragment and any utm_* query parameters are
// dropped, and a trailing slash is dropped. A page is its path under dist
// without index.html, and the home page is "index".
//
// DIST_DIR and LINK_INDEX override the paths, for the fixture tests.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.env.DIST_DIR ?? 'dist');
const indexPath = path.resolve(
	process.env.LINK_INDEX ?? 'src/data/link-index.json',
);
const indexName = 'src/data/link-index.json';
// The page that renders the table. Its links are the table itself.
const selfPage = 'help-links/all-links';

if (!fs.existsSync(dist)) {
	console.error(
		`${path.relative('.', dist) || dist}/ is missing. Run npm run build first.`,
	);
	process.exit(1);
}
if (!fs.existsSync(indexPath)) {
	console.error(`${indexName} not found.`);
	process.exit(1);
}

/** @type {{ url: string, pages: string[] }[]} */
let entries;
try {
	entries = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
} catch (error) {
	console.error(`${indexName} is not valid JSON: ${error.message}`);
	process.exit(1);
}
if (!Array.isArray(entries)) {
	console.error(`${indexName} must be a JSON array of entries.`);
	process.exit(1);
}

// Where each outside URL appears on the built site: normalized URL to the
// href as written and the set of pages.
/** @type {Map<string, { href: string, pages: Set<string> }>} */
const site = new Map();
let pageCount = 0;
for (const file of listHtml(dist)) {
	let html = fs.readFileSync(file, 'utf8');
	if (/http-equiv="refresh"/i.test(html)) continue; // redirect stub
	const page = pageOf(path.relative(dist, file));
	if (page === selfPage) continue;
	pageCount++;
	// The footer's license notice (CC BY 4.0 and MIT) is on every page.
	html = html.replace(/<p\b[^>]*class="[^"]*\beep-license\b[\s\S]*?<\/p>/g, '');
	for (const match of html.matchAll(/<a\b[^>]*?\shref="([^"]*)"/g)) {
		const href = decode(match[1] ?? '');
		const key = normalize(href);
		if (!key || isOwn(key)) continue;
		const seen = site.get(key) ?? { href, pages: new Set() };
		seen.pages.add(page);
		site.set(key, seen);
	}
}

const problems = [];
/** @type {Map<string, { url: string, pages: string[] }>} */
const byKey = new Map();
entries.forEach((entry, i) => {
	const url = typeof entry?.url === 'string' ? entry.url : '';
	const key = normalize(url);
	if (!key) {
		problems.push(
			`Entry ${i + 1} in ${indexName} has no valid http(s) "url". Fix its "url" or remove the entry.`,
		);
		return;
	}
	const first = byKey.get(key);
	if (first) {
		problems.push(
			`${url}: two entries share the normalized URL ${key} (the other is ${first.url}). Remove one of them from ${indexName} and merge its "pages" into the other.`,
		);
		return;
	}
	const pages = Array.isArray(entry.pages) ? entry.pages : [];
	byKey.set(key, { url, pages });
});

for (const [key, { href, pages }] of site) {
	if (byKey.has(key)) continue;
	problems.push(
		`${href}: linked on the site but has no entry. Add an entry to ${indexName} with "url": ${JSON.stringify(href)} and "pages": ${JSON.stringify(sortPages(pages))}.`,
	);
}

for (const [key, { url, pages }] of byKey) {
	const actual = site.get(key);
	if (!actual) {
		problems.push(
			`${url}: has an entry but is not linked on any page. Remove its entry from ${indexName}.`,
		);
		continue;
	}
	const listed = new Set(pages);
	const add = sortPages(actual.pages).filter((p) => !listed.has(p));
	const remove = [...listed].filter((p) => !actual.pages.has(p));
	if (add.length || remove.length) {
		const steps = [];
		if (add.length) steps.push(`add ${quoteList(add)} to its "pages"`);
		if (remove.length)
			steps.push(`remove ${quoteList(remove)} from its "pages"`);
		problems.push(
			`${url}: "pages" differs from where it is linked. In ${indexName}, ${steps.join(' and ')}.`,
		);
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) process.exit(1);
console.log(
	`Link index matches ${site.size} outside URLs across ${pageCount} pages.`,
);

/**
 * Lowercase scheme and host, strip a leading www., drop the fragment and
 * utm_* parameters, and drop a trailing slash. Returns '' for anything that
 * isn't an http(s) URL.
 * @param {string} href
 */
function normalize(href) {
	let url;
	try {
		url = new URL(href.trim());
	} catch {
		return '';
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
	const host = url.host.toLowerCase().replace(/^www\./, '');
	// Keep the rest of the query as written, so encoding differences between
	// the data file and the page don't matter more than they do in the href.
	const query = url.search
		.slice(1)
		.split('&')
		.filter((part) => part && !/^utm_/i.test(part))
		.join('&');
	const pathname = url.pathname.replace(/\/+$/, '');
	return `${url.protocol}//${host}${pathname}${query ? `?${query}` : ''}`;
}

/** eeprep's own hosts and Cloudflare preview hosts. @param {string} key */
function isOwn(key) {
	const host = new URL(key).hostname;
	return (
		host === 'eeprep.com' ||
		host.endsWith('.eeprep.com') ||
		host === 'workers.dev' ||
		host.endsWith('.workers.dev')
	);
}

/** dist-relative file to page slug. @param {string} rel */
function pageOf(rel) {
	const slug = rel
		.split(path.sep)
		.join('/')
		.replace(/(^|\/)index\.html$/, '')
		.replace(/\.html$/, '');
	return slug || 'index';
}

/** @param {Iterable<string>} pages */
function sortPages(pages) {
	return [...pages].sort();
}

/** @param {string[]} list */
function quoteList(list) {
	return list.map((p) => JSON.stringify(p)).join(', ');
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
