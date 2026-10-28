import fs from 'node:fs';
import path from 'node:path';
import {
	loadWikiIndex,
	pageHeadingIds,
	resolveWikiTarget,
	splitWikiTarget,
} from '../../src/lib/wiki-index.mjs';

const { byKey, pages, contentRoot } = loadWikiIndex();
const linkRe = /\[\[([^\]\n]+)\]\]/g;
/** @type {Map<string, Set<string>>} Heading ids by page href. */
const headingIds = new Map(
	pages.map((page) => [
		page.href,
		pageHeadingIds(fs.readFileSync(path.join(contentRoot, page.file), 'utf8')),
	]),
);
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
			continue;
		}
		if (!resolved.hash) continue;
		const pageHref = resolved.href.split('#')[0] ?? '';
		if (!headingIds.get(pageHref)?.has(resolved.hash)) {
			const { heading } = splitWikiTarget(target);
			console.error(
				`${page.file}: [[${target}]] has no heading "${heading}" (#${resolved.hash}) on ${pageHref}`,
			);
			failed = true;
		}
	}
}

if (failed) process.exit(1);
console.log(
	`Wikilinks and their headings resolve across ${pages.length} pages.`,
);

/** @param {string} text */
function stripCode(text) {
	return text.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '');
}
