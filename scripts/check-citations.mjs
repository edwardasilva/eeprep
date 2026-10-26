import fs from 'node:fs';
import path from 'node:path';

const contentRoot = path.resolve(process.env.CONTENT_ROOT ?? path.join('src', 'content', 'docs'));
const bibPath = path.resolve(process.env.BIB_PATH ?? path.join('src', 'content', 'references.bib'));

if (!fs.existsSync(bibPath)) {
	console.log(`Notice: ${display(bibPath)} is not in this checkout, so citation keys were not checked.`);
	process.exit(0);
}

const entries = parseBib(fs.readFileSync(bibPath, 'utf8'));
/** @type {string[]} */
const failures = [];
/** @type {Map<string, { key: string, line: number }>} */
const seen = new Map();

for (const entry of entries) {
	if (!entry.key) {
		failures.push(`${display(bibPath)}:${entry.line}: bib entry is missing a key`);
		continue;
	}
	const id = entry.key.toLowerCase();
	const first = seen.get(id);
	if (first) {
		failures.push(
			`${display(bibPath)}:${entry.line}: duplicate citation key "${entry.key}" (first at line ${first.line})`,
		);
	} else {
		seen.set(id, { key: entry.key, line: entry.line });
	}
	if (!hasField(entry, 'title')) {
		failures.push(`${display(bibPath)}:${entry.line}: citation entry "${entry.key}" is missing a title`);
	}
	if (!hasField(entry, 'url') && !hasField(entry, 'doi') && !hasField(entry, 'publisher')) {
		failures.push(
			`${display(bibPath)}:${entry.line}: citation entry "${entry.key}" is missing a url, doi, or publisher`,
		);
	}
}

/** @type {string[]} */
const pages = [];
if (!fs.existsSync(contentRoot)) {
	failures.push(`Content directory not found: ${display(contentRoot)}`);
} else {
	listMarkdown(contentRoot, pages);
	pages.sort();
	for (const file of pages) {
		for (const cite of findCitations(fs.readFileSync(file, 'utf8'))) {
			if (!seen.has(cite.key.toLowerCase())) {
				failures.push(`${display(file)}:${cite.line}: citation key "${cite.key}" is not in ${display(bibPath)}`);
			}
		}
	}
}

if (failures.length > 0) {
	for (const failure of failures) console.error(failure);
	process.exit(1);
}

console.log(`Citation keys match ${seen.size} bibliography entries across ${pages.length} pages.`);

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

/** @param {string} text @returns {{ key: string, line: number }[]} */
function findCitations(text) {
	const citeRe = /\[([^\]\n]*)\](?!\()/g;
	const keyRe = /(?:^|[\s;,])-?@([A-Za-z0-9][A-Za-z0-9_:.+/-]*)/g;
	const lines = text.split('\n');
	/** @type {{ key: string, line: number }[]} */
	const found = [];
	/** @type {{ char: string, len: number } | null} */
	let fence = null;
	for (let index = 0; index < lines.length; index++) {
		const line = lines[index] ?? '';
		const fenceMatch = /^( {0,3})(`{3,}|~{3,})/.exec(line);
		if (fence) {
			if (fenceMatch && fenceMatch[2][0] === fence.char && fenceMatch[2].length >= fence.len) fence = null;
			continue;
		}
		if (fenceMatch) {
			fence = { char: fenceMatch[2][0], len: fenceMatch[2].length };
			continue;
		}
		const stripped = line.replace(/`+[^`]*`+/g, (span) => ' '.repeat(span.length));
		citeRe.lastIndex = 0;
		for (const match of stripped.matchAll(citeRe)) {
			const body = match[1] ?? '';
			keyRe.lastIndex = 0;
			for (const keyMatch of body.matchAll(keyRe)) {
				const key = keyMatch[1];
				if (key) found.push({ key, line: index + 1 });
			}
		}
	}
	return found;
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
