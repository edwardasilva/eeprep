import fs from 'node:fs';
import path from 'node:path';
import { loadWikiIndex, resolveWikiTarget } from '../src/lib/wiki-index.mjs';

const { byKey, pages, contentRoot } = loadWikiIndex();
const linkRe = /\[\[([^\]\n]+)\]\]/g;
let failed = false;

for (const page of pages) {
	const full = path.join(contentRoot, page.file);
	const stripped = stripCode(fs.readFileSync(full, 'utf8'));
	for (const match of stripped.matchAll(linkRe)) {
		const target = match[1] ?? '';
		const resolved = resolveWikiTarget(target, byKey);
		if (!resolved.href) {
			console.error(`${page.file}: missing wikilink [[${target}]]`);
			failed = true;
		}
	}
}

if (failed) process.exit(1);
console.log(`Wikilinks resolve across ${pages.length} pages.`);

/** @param {string} text */
function stripCode(text) {
	return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}
