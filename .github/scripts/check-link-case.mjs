// Fails when a link in running text starts with a capital letter that the
// sentence doesn't call for. Link text is written as if it weren't a link:
// capital only at the start of a sentence, list item, table cell or heading,
// or for a proper noun, acronym or brand. Run `npm run build` first.
//
// The check reads the built pages, so it sees wikilinks with an explicit
// alias, bare [[Page]] links with an automatic label, markdown links and links
// that components write. It looks only at page content (not the header,
// sidebar, table of contents, pagination, headings or link cards).
//
// A link starts a sentence when the text before it, inside the same block
// (paragraph, list item, table cell and so on), is empty or ends in ".", "?"
// or "!". An opening quote or bracket doesn't count as text. A colon doesn't
// end a sentence, so "Next: the resume page" stays lowercase.
//
// A first word is fine when it is all capitals (IEEE, AI), has a capital
// inside (LinkedIn, GitHub), or is in the names list below. Add a name to the
// list only when it is a real proper noun.
//
// A folder given as the first argument, or DIST_DIR, replaces dist/. That
// lets you check one section, such as `npm run check:link-case -- dist/help`.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.argv[2] ?? process.env.DIST_DIR ?? 'dist');
if (!fs.existsSync(dist)) {
	console.error(
		`${path.relative('.', dist) || dist}/ is missing. Run npm run build first.`,
	);
	process.exit(1);
}

// Proper nouns, brands and the pronoun "I". An entry matches the start of the
// link text on a word boundary, so "Alex" also covers "Alex's finished page".
// Use a longer phrase when the first word is an ordinary word on its own, such
// as "Ask a Manager" or "University of".
const names = [
	'Alex',
	'Altium',
	'Ansys',
	'Ashby',
	'Ask a Manager',
	'Berkeley',
	'Beta',
	'Blue Canyon',
	'Bureau of Labor Statistics',
	'Cornell',
	'Doe',
	'Drexel',
	'Georgia Tech',
	'Greenhouse',
	'Handshake',
	'Harvard',
	'HDLBits',
	'I',
	'Illinois',
	'Indeed',
	"Interrupt's",
	'Ladders',
	'Lockheed Martin',
	'Michigan',
	'Mines',
	'Nigel Jones',
	'Obsidian',
	'Ohio State',
	'Optica',
	'Oregon Tech',
	'Overleaf',
	'Pathways internship',
	'Pathways recent',
	'Pi',
	'Pitt',
	'Princeton',
	'Reddit',
	'Tau',
	'University of',
	'Verilator',
	'Wokwi',
	'Yale',
];
const nameStarts = names.map(
	(name) =>
		new RegExp(
			`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}\\p{N}])`,
			'u',
		),
);

const months = new Set([
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]);

const blocks = new Set([
	'address',
	'article',
	'aside',
	'blockquote',
	'br',
	'caption',
	'dd',
	'details',
	'div',
	'dl',
	'dt',
	'figcaption',
	'figure',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'hr',
	'li',
	'ol',
	'p',
	'section',
	'summary',
	'table',
	'tbody',
	'td',
	'tfoot',
	'th',
	'thead',
	'tr',
	'ul',
]);

const problems = [];
/** Pages with no page content region, which the check cannot read. */
const skipped = [];
let checked = 0;
for (const file of listHtml(dist)) {
	const html = fs.readFileSync(file, 'utf8');
	if (/http-equiv="refresh"/i.test(html)) continue; // redirect stub
	const rel = path.relative(dist, file);
	const body = content(html);
	if (body === null) {
		skipped.push(rel);
		continue;
	}
	for (const link of links(body)) {
		checked++;
		const reason = problemWith(link.before, link.text);
		if (reason) {
			problems.push(
				`${rel}: link text "${link.text}" ${reason} (after "${tail(link.before)}").`,
			);
		}
	}
}

for (const problem of problems) console.error(problem);
if (problems.length) {
	console.error(
		'Write each link in lower case, or add its first word to the names list in .github/scripts/check-link-case.mjs if it is a proper noun.',
	);
	process.exit(1);
}
console.log(
	`Link text has sentence case in ${checked} links` +
		(skipped.length
			? ` (no page content in ${skipped.length} files: ${skipped.join(', ')}).`
			: '.'),
);

/**
 * The page content, without the footer and pagination.
 * @param {string} html
 */
function content(html) {
	const start = html.search(/class="[^"]*\bsl-markdown-content\b/);
	if (start < 0) return null;
	let body = html.slice(start);
	const end = body.search(/<footer\b/);
	if (end >= 0) body = body.slice(0, end);
	return body;
}

/**
 * Each link in running text, with the text before it in its block.
 * @param {string} html
 * @returns {{ before: string, text: string }[]}
 */
function links(html) {
	const out = [];
	let before = '';
	let heading = 0;
	let open = null; // { before, text, skip }
	for (const part of html.split(/(<[^>]+>)/)) {
		const tag = /^<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>$/.exec(part);
		if (!tag) {
			const text = decode(part);
			before += text;
			if (open) open.text += text;
			continue;
		}
		const closing = tag[1] === '/';
		const name = tag[2].toLowerCase();
		const attrs = tag[3];
		if (/^h[1-6]$/.test(name)) heading += closing ? -1 : 1;
		if (name === 'a' && !closing) {
			const skip =
				heading > 0 || /class="[^"]*(?:sl-anchor-link|card)[^"]*"/.test(attrs);
			open = { before, text: '', skip };
		} else if (name === 'a' && open) {
			const text = open.text
				.replace(/\s*\(opens in a new tab\)\s*$/, '')
				.replace(/\s+/g, ' ')
				.trim();
			if (text && !open.skip) out.push({ before: open.before, text });
			open = null;
		}
		if (blocks.has(name)) {
			before = '';
			if (open && !closing) open = null;
		}
	}
	return out;
}

/**
 * @param {string} before
 * @param {string} text
 */
function problemWith(before, text) {
	const lead = before
		.replace(/\s+/g, ' ')
		.replace(/[\s"'([“‘]+$/, '')
		.trim();
	if (!lead || /[.?!]$/.test(lead)) return '';
	const word = /^[^\p{L}\p{N}]*([\p{L}\p{N}'’]+)/u.exec(text)?.[1];
	if (!word || !/^\p{Lu}/u.test(word)) return '';
	const base = word.replace(/['’]s?$/, '');
	const plain = text.replace(/’/g, "'").replace(/^[^\p{L}\p{N}]+/u, '');
	if (months.has(base) || nameStarts.some((start) => start.test(plain)))
		return '';
	if (/^\p{Lu}{2,}$/u.test(base.replace(/[\d]/g, ''))) return '';
	if (/\p{Ll}\p{Lu}/u.test(base)) return '';
	return 'starts with a capital letter in the middle of a sentence';
}

/** @param {string} text */
function tail(text) {
	const flat = text.replace(/\s+/g, ' ').trim();
	return flat.length > 40 ? `...${flat.slice(-40)}` : flat;
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
