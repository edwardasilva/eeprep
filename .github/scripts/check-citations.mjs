// Fails when a page under src/content/docs links an external source URL that
// references.bib does not list, or when a bibliography entry is linked from no page.
// Also fails on a Pandoc [@key] cite, on Markdown link text that is a
// citation key, a handle, or a bare URL, on an @handle in page prose,
// and on a content line made only of Markdown links.
// Every bibliography entry needs a url. A doi or publisher alone is not enough.
// Bibliography matching is on the url, not on link text.
import fs from 'node:fs';
import path from 'node:path';

const contentRoot = path.resolve(
	process.env.CONTENT_ROOT ?? path.join('src', 'content', 'docs'),
);
const bibPath = path.resolve(
	process.env.BIB_PATH ?? path.join('src', 'content', 'references.bib'),
);

/** @type {string[]} */
const failures = [];

if (!fs.existsSync(bibPath)) {
	console.error(`${display(bibPath)}: bibliography file not found`);
	process.exit(1);
}

const entries = parseBib(fs.readFileSync(bibPath, 'utf8'));
/** @type {Map<string, { key: string, line: number }>} */
const seenKeys = new Map();
/** @type {Map<string, { key: string, line: number, url: string }[]>} */
const byUrl = new Map();

for (const entry of entries) {
	if (!entry.key) {
		failures.push(
			`${display(bibPath)}:${entry.line}: bib entry is missing a key`,
		);
		continue;
	}
	const id = entry.key.toLowerCase();
	const first = seenKeys.get(id);
	if (first) {
		failures.push(
			`${display(bibPath)}:${entry.line}: duplicate citation key "${entry.key}" (first at line ${first.line})`,
		);
	} else {
		seenKeys.set(id, { key: entry.key, line: entry.line });
	}
	if (!hasField(entry, 'title')) {
		failures.push(
			`${display(bibPath)}:${entry.line}: citation entry "${entry.key}" is missing a title`,
		);
	}
	if (!hasField(entry, 'url')) {
		failures.push(
			`${display(bibPath)}:${entry.line}: citation entry "${entry.key}" is missing a url`,
		);
		continue;
	}
	const canonical = canonicalUrl(entry.fields.get('url') ?? '');
	if (!canonical) continue;
	const group = byUrl.get(canonical) ?? [];
	group.push({ key: entry.key, line: entry.line, url: canonical });
	byUrl.set(canonical, group);
}

/** @type {Set<string>} */
const cited = new Set();
/** @type {string[]} */
const pages = [];

if (!fs.existsSync(contentRoot)) {
	failures.push(`Content directory not found: ${display(contentRoot)}`);
} else {
	listMarkdown(contentRoot, pages);
	pages.sort();
	for (const file of pages) {
		const text = fs.readFileSync(file, 'utf8');
		for (const link of findSourceLinks(text)) {
			if (!isSourceUrl(link.url)) continue;
			const canonical = canonicalUrl(link.url);
			if (!canonical) {
				failures.push(
					`${display(file)}:${link.line}: source link is not a valid URL: ${link.url}`,
				);
				continue;
			}
			if (!byUrl.has(canonical)) {
				failures.push(
					`${display(file)}:${link.line}: source URL ${link.url} is not in ${display(bibPath)}`,
				);
				continue;
			}
			cited.add(canonical);
		}
		checkCitationStyle(file, text);
	}
}

for (const entry of entries) {
	if (!entry.key || !hasField(entry, 'url')) continue;
	const canonical = canonicalUrl(entry.fields.get('url') ?? '');
	if (canonical && cited.has(canonical)) continue;
	failures.push(
		`${display(bibPath)}:${entry.line}: bibliography entry "${entry.key}" is not linked from any page`,
	);
}

if (failures.length > 0) {
	for (const failure of failures) console.error(failure);
	process.exit(1);
}

const citedEntries = entries.filter((entry) => {
	const canonical = canonicalUrl(entry.fields.get('url') ?? '');
	return Boolean(canonical && cited.has(canonical));
}).length;

console.log(
	`Citation URLs match ${citedEntries} bibliography entries across ${pages.length} pages.`,
);

/** @param {string} file */
function display(file) {
	return path.relative(process.cwd(), file).split(path.sep).join('/');
}

/** @param {{ fields: Map<string, string> }} entry @param {string} name */
function hasField(entry, name) {
	const value = entry.fields.get(name);
	return Boolean(value && value.trim());
}

/**
 * Host and scheme case, a trailing slash, and a fragment do not change the source.
 * www, http versus https, and the path stay distinct.
 * @param {string} raw
 */
function canonicalUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return '';
	let url;
	try {
		url = new URL(trimmed);
	} catch {
		return '';
	}
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
	url.hash = '';
	url.hostname = url.hostname.toLowerCase();
	if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
	return url.href;
}

/** @param {string} raw */
function isSourceUrl(raw) {
	const canonical = canonicalUrl(raw);
	if (!canonical) return false;
	const url = new URL(canonical);
	const host = url.hostname;
	if (host === 'eeprep.com' || host === 'www.eeprep.com') return false;
	if (host === 'localhost' || host === '127.0.0.1') return false;
	if (
		(host === 'github.com' || host === 'www.github.com') &&
		/^\/edwardasilva\/eeprep(?:\/|$)/i.test(url.pathname)
	) {
		return false;
	}
	return true;
}

/**
 * External http(s) links: markdown links, autolinks, and reference definitions that a page uses.
 * Link text is ignored. Fenced code, inline code, HTML comments, and front matter are ignored.
 * @param {string} text
 * @returns {{ url: string, line: number }[]}
 */
function findSourceLinks(text) {
	const masked = text.replace(/<!--[\s\S]*?-->/g, (block) =>
		block.replace(/[^\n]/g, ' '),
	);
	const lines = masked.split('\n');
	let start = 0;
	if (lines[0]?.trim() === '---') {
		for (let i = 1; i < lines.length; i++) {
			if (lines[i]?.trim() === '---') {
				start = i + 1;
				break;
			}
		}
	}

	/** @type {Map<string, { url: string, line: number }>} */
	const defs = new Map();
	for (let index = start; index < lines.length; index++) {
		const line = stripInlineCode(lines[index] ?? '');
		const def = /^ {0,3}\[(?!\^)([^\]]+)\]:\s+(\S+)/.exec(line);
		if (!def) continue;
		defs.set(def[1].toLowerCase(), {
			url: trimDestination(def[2] ?? ''),
			line: index + 1,
		});
	}

	/** @type {{ url: string, line: number }[]} */
	const found = [];
	/** @type {Set<string>} */
	const seen = new Set();
	/** @type {{ char: string, len: number } | null} */
	let fence = null;

	/** @param {number} line @param {string} url */
	const add = (line, url) => {
		const destination = trimDestination(url);
		if (!destination) return;
		const key = `${line}\n${canonicalUrl(destination) || destination}`;
		if (seen.has(key)) return;
		seen.add(key);
		found.push({ url: destination, line });
	};

	for (let index = start; index < lines.length; index++) {
		const line = lines[index] ?? '';
		const fenceMatch = /^( {0,3})(`{3,}|~{3,})/.exec(line);
		if (fence) {
			if (
				fenceMatch &&
				fenceMatch[2][0] === fence.char &&
				fenceMatch[2].length >= fence.len
			) {
				fence = null;
			}
			continue;
		}
		if (fenceMatch) {
			fence = { char: fenceMatch[2][0], len: fenceMatch[2].length };
			continue;
		}
		if (/^ {0,3}\[(?!\^)[^\]]+\]:\s+\S+/.test(stripInlineCode(line))) continue;
		const stripped = stripInlineCode(line);
		for (const match of stripped.matchAll(/<(https?:\/\/[^>\s]+)>/g)) {
			add(index + 1, match[1] ?? '');
		}
		for (const match of stripped.matchAll(
			/(^|[^!])\[[^\]]*\]\(\s*<?(https?:\/\/[^)\s>]+)>?/g,
		)) {
			add(index + 1, match[2] ?? '');
		}
		for (const match of stripped.matchAll(
			/\shref\s*=\s*["'](https?:\/\/[^"']+)["']/gi,
		)) {
			add(index + 1, match[1] ?? '');
		}
		for (const match of stripped.matchAll(/(^|[^!])\[[^\]]*\]\[([^\]]+)\]/g)) {
			const def = defs.get((match[2] ?? '').toLowerCase());
			if (def) add(index + 1, def.url);
		}
	}
	return found;
}

/** @param {string} line */
function stripInlineCode(line) {
	return line.replace(/`+[^`]*`+/g, (span) => ' '.repeat(span.length));
}

/** @param {string} raw */
function trimDestination(raw) {
	return raw
		.trim()
		.replace(/^<|>$/g, '')
		.replace(/[.,;]+$/g, '');
}

/**
 * Pandoc [@key] cites, link text that is a key, a handle, or a bare URL,
 * and a content line made only of Markdown links.
 * @param {string} file
 * @param {string} text
 */
function checkCitationStyle(file, text) {
	const masked = text.replace(/<!--[\s\S]*?-->/g, (block) =>
		block.replace(/[^\n]/g, ' '),
	);
	const lines = masked.split('\n');
	let start = 0;
	if (lines[0]?.trim() === '---') {
		for (let i = 1; i < lines.length; i++) {
			if (lines[i]?.trim() === '---') {
				start = i + 1;
				break;
			}
		}
	}
	/** @type {{ char: string, len: number } | null} */
	let fence = null;
	for (let index = start; index < lines.length; index++) {
		const line = lines[index] ?? '';
		const fenceMatch = /^( {0,3})(`{3,}|~{3,})/.exec(line);
		if (fence) {
			if (
				fenceMatch &&
				fenceMatch[2][0] === fence.char &&
				fenceMatch[2].length >= fence.len
			) {
				fence = null;
			}
			continue;
		}
		if (fenceMatch) {
			fence = { char: fenceMatch[2][0], len: fenceMatch[2].length };
			continue;
		}
		const stripped = stripInlineCode(line);
		reportLoneLinkLine(file, index + 1, stripped);
		for (const match of stripped.matchAll(/\[@[^\]]+\]/g)) {
			failures.push(
				`${display(file)}:${index + 1}: Pandoc citation "${match[0]}" is not allowed`,
			);
		}
		for (const match of stripped.matchAll(
			/(^|[^!])\[([^\]]*)\]\(([^)\n]*)\)/g,
		)) {
			reportLinkText(file, index + 1, match[2] ?? '');
		}
		for (const match of stripped.matchAll(
			/(^|[^!])\[([^\]]*)\]\[([^\]]*)\]/g,
		)) {
			reportLinkText(file, index + 1, match[2] ?? '');
		}
		for (const match of stripped.matchAll(/<(https?:\/\/[^>\s]+)>/g)) {
			reportLinkText(file, index + 1, match[1] ?? '');
		}
		reportHandles(file, index + 1, stripped);
	}
}

/**
 * A citation belongs in a sentence. A line whose only content is Markdown
 * links is the old key-per-line pattern.
 * @param {string} file
 * @param {number} line
 * @param {string} stripped
 */
function reportLoneLinkLine(file, line, stripped) {
	if (!markdownLinkPattern().test(stripped)) return;
	const rest = stripped
		.replace(/(^|[^!])\[[^\]]*\]\([^)\n]*\)/g, '$1')
		.replace(/(^|[^!])\[[^\]]*\]\[[^\]]*\]/g, '$1')
		.replace(/<(https?:\/\/[^>\s]+)>/g, '');
	if (/\S/.test(rest)) return;
	failures.push(`${display(file)}:${line}: line is only Markdown links`);
}

/** @returns {RegExp} */
function markdownLinkPattern() {
	return /(?:^|[^!])\[[^\]]*\](?:\([^)\n]*\)|\[[^\]]*\])|<(https?:\/\/[^>\s]+)>/;
}

/**
 * An @handle in prose is a username. URLs and code are not prose.
 * Inline code is already blanked. Call this with a fence line skipped.
 * @param {string} file
 * @param {number} line
 * @param {string} stripped
 */
function reportHandles(file, line, stripped) {
	const visible = stripped.replace(/https?:\/\/[^\s)]+/g, (url) =>
		' '.repeat(url.length),
	);
	for (const match of visible.matchAll(/(^|[^\w])@([A-Za-z0-9_]+)/g)) {
		failures.push(
			`${display(file)}:${line}: prose contains a handle "@${match[2]}"`,
		);
	}
}

/** @param {string} file @param {number} line @param {string} raw */
function reportLinkText(file, line, raw) {
	const label = raw.trim();
	if (!label) return;
	let problem = '';
	if (/^https?:\/\//i.test(label) || /^www\./i.test(label)) {
		problem = `link text "${label}" is a bare URL`;
	} else if (/^(?:reddit-|x-)/.test(label)) {
		problem = `link text "${label}" starts with a citation key`;
	} else if (label.includes('@')) {
		problem = `link text "${label}" contains "@"`;
	} else if (!/\s/.test(label) && label.length > 20) {
		problem = `link text "${label}" is a single token over 20 characters`;
	}
	if (!problem) return;
	failures.push(`${display(file)}:${line}: ${problem}`);
}

/** @param {string} dir @param {string[]} out */
function listMarkdown(dir, out) {
	for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
		if (ent.name === 'node_modules' || ent.name === '.git') continue;
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) listMarkdown(full, out);
		else if (/\.(md|mdx|markdown)$/i.test(ent.name)) out.push(full);
	}
}

/**
 * @param {string} text
 * @returns {{ key: string, line: number, fields: Map<string, string> }[]}
 */
function parseBib(text) {
	/** @type {{ key: string, line: number, fields: Map<string, string> }[]} */
	const entries = [];
	let i = 0;
	while (i < text.length) {
		if (text[i] === '%') {
			i = skipLine(text, i);
			continue;
		}
		if (text[i] !== '@') {
			i++;
			continue;
		}
		const line = lineNumber(text, i);
		const mark = i;
		i++;
		const type = readName(text, i);
		i = skipSpace(text, type.next);
		const kind = type.value.toLowerCase();
		if (kind === 'comment' && text[i] !== '{' && text[i] !== '(') {
			i = skipLine(text, i);
			continue;
		}
		if (text[i] !== '{' && text[i] !== '(') {
			if (i === mark) i++;
			continue;
		}
		const open = text[i];
		const close = open === '{' ? '}' : ')';
		i++;
		if (kind === 'comment' || kind === 'preamble' || kind === 'string') {
			i = skipGroup(text, i, open, close);
			continue;
		}
		const keyStart = i;
		while (i < text.length && text[i] !== ',' && text[i] !== close) i++;
		const key = text.slice(keyStart, i).trim();
		/** @type {Map<string, string>} */
		const fields = new Map();
		if (text[i] === ',') i++;
		while (i < text.length && text[i] !== close) {
			i = skipSpaceAndComments(text, i);
			if (i >= text.length || text[i] === close) break;
			if (text[i] === ',') {
				i++;
				continue;
			}
			const name = readName(text, i);
			i = skipSpace(text, name.next);
			if (!name.value || text[i] !== '=') break;
			i = skipSpace(text, i + 1);
			const value = readValue(text, i);
			if (value.next <= i) {
				i++;
				continue;
			}
			i = value.next;
			fields.set(name.value.toLowerCase(), value.value);
			i = skipSpaceAndComments(text, i);
			if (text[i] === ',') i++;
		}
		if (text[i] === close) i++;
		entries.push({ key, line, fields });
	}
	return entries;
}

/** @param {string} text @param {number} index */
function lineNumber(text, index) {
	let line = 1;
	for (let i = 0; i < index; i++) if (text[i] === '\n') line++;
	return line;
}

/** @param {string} text @param {number} index */
function readName(text, index) {
	const start = index;
	while (index < text.length && /[A-Za-z0-9_]/.test(text[index] ?? '')) index++;
	return { value: text.slice(start, index), next: index };
}

/** @param {string} text @param {number} index */
function readValue(text, index) {
	const opener = text[index];
	if (opener === '{' || opener === '(') {
		const close = opener === '{' ? '}' : ')';
		const end = skipGroup(text, index + 1, opener, close);
		return { value: text.slice(index + 1, end - 1).trim(), next: end };
	}
	if (opener === '"') {
		let i = index + 1;
		let value = '';
		while (i < text.length && text[i] !== '"') {
			if (text[i] === '\\') {
				value += text[i + 1] ?? '';
				i += 2;
				continue;
			}
			value += text[i] ?? '';
			i++;
		}
		return { value: value.trim(), next: i < text.length ? i + 1 : i };
	}
	const start = index;
	while (
		index < text.length &&
		text[index] !== ',' &&
		text[index] !== '}' &&
		text[index] !== ')' &&
		!/\s/.test(text[index] ?? '')
	) {
		index++;
	}
	return { value: text.slice(start, index).trim(), next: index };
}

/** @param {string} text @param {number} index @param {string} open @param {string} close */
function skipGroup(text, index, open, close) {
	let depth = 1;
	while (index < text.length && depth > 0) {
		const ch = text[index];
		if (ch === '\\') {
			index += 2;
			continue;
		}
		if (ch === open) depth++;
		else if (ch === close) depth--;
		index++;
	}
	return index;
}

/** @param {string} text @param {number} index */
function skipSpace(text, index) {
	while (index < text.length && /\s/.test(text[index] ?? '')) index++;
	return index;
}

/** @param {string} text @param {number} index */
function skipSpaceAndComments(text, index) {
	while (index < text.length) {
		if (/\s/.test(text[index] ?? '')) {
			index++;
			continue;
		}
		if (text[index] === '%') {
			index = skipLine(text, index);
			continue;
		}
		break;
	}
	return index;
}

/** @param {string} text @param {number} index */
function skipLine(text, index) {
	while (index < text.length && text[index] !== '\n') index++;
	return index < text.length ? index + 1 : index;
}
